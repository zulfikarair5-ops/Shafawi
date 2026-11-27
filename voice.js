// Shafawi: semakan bacaan guna suara (mod "Suara AI").
// Dimuatkan hanya bila pengguna memilih mod suara, supaya app kekal pantas.
(function () {
  const M = self.ShafawiMatch;
  const MODEL = 'nael239/tasme3-whisper-base-ar-quran-web';
  const REV = 'de82316c38fe2a9f03217aad7eb5865877cc0899';
  const CHECK = `https://huggingface.co/${MODEL}/resolve/${REV}/onnx/decoder_model_merged_quantized.onnx`;
  const SR = 16000;

  /* ---------- model (Web Worker) ---------- */
  const eng = { state: 'idle', loaded: 0, total: 0, err: '', subs: new Set() };
  let worker = null, rid = 0;
  const waiting = new Map();
  const emit = () => eng.subs.forEach(f => { try { f(eng) } catch (e) {} });

  async function cached() {
    try { const c = await caches.open('transformers-cache'); return !!(await c.match(CHECK)); } catch (e) { return false; }
  }
  function load() {
    if (worker && eng.state !== 'error') return;
    eng.state = 'loading'; eng.err = ''; emit();
    try { navigator.storage && navigator.storage.persist && navigator.storage.persist(); } catch (e) {}
    worker = new Worker('asr-worker.js', { type: 'module' });
    worker.onmessage = e => {
      const m = e.data;
      if (m.type === 'progress') { eng.loaded = m.loaded; eng.total = m.total; emit(); }
      if (m.type === 'ready') { eng.state = 'ready'; try { localStorage.setItem('thebook.asr', '1'); } catch (e) {} emit(); }
      if (m.type === 'result' || (m.type === 'error' && waiting.has(m.id))) {
        const f = waiting.get(m.id); waiting.delete(m.id); f && f(m);
      } else if (m.type === 'error') { eng.state = 'error'; eng.err = m.msg; emit(); }
    };
    worker.onerror = e => { eng.state = 'error'; eng.err = (e && e.message) || 'Pekerja AI gagal dimulakan'; emit(); };
    worker.postMessage({ type: 'load' });
  }
  function transcribe(audio) {
    return new Promise(res => { const id = ++rid; waiting.set(id, res); worker.postMessage({ type: 'run', id, audio }, [audio.buffer]); });
  }

  /* ---------- rakaman mikrofon ---------- */
  // Penyemak satu sesi bacaan. exp = senarai perkataan mushaf yang dijangka.
  function Session(exp, opts) {
    const s = { conf: 0, base: 0, err: null, mistakes: 0, running: false, busy: false, lastMs: 0 };
    let ctx, src, proc, stream, timer;
    let buf = new Float32Array(SR * 120), len = 0;
    let segStart = 0, lastPass = 0, pendKey = '', speechAt = -1, noise = 0.004, ratio = 1;
    const FR = 480; let frAcc = 0, frN = 0; // VAD setiap 30ms
    const update = () => opts.onUpdate && opts.onUpdate(s);

    function push(x) {
      if (len + x.length > buf.length) { const nb = new Float32Array(buf.length * 2); nb.set(buf.subarray(0, len)); buf = nb; }
      buf.set(x, len);
      for (let i = 0; i < x.length; i++) {
        frAcc += x[i] * x[i];
        if (++frN === FR) {
          const rms = Math.sqrt(frAcc / FR); frAcc = 0; frN = 0;
          if (rms > Math.max(0.012, noise * 3.2)) speechAt = len + i;
          else noise = noise * 0.97 + rms * 0.03;
        }
      }
      len += x.length;
    }
    // Turunkan kadar sampel ke 16 kHz (purata ringkas).
    function down(inp) {
      const n = Math.floor(inp.length / ratio), out = new Float32Array(n);
      for (let i = 0; i < n; i++) { let a = 0; const st = Math.floor(i * ratio), en = Math.floor((i + 1) * ratio); for (let k = st; k < en; k++) a += inp[k]; out[i] = a / Math.max(1, en - st); }
      return out;
    }

    async function start() {
      stream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      await ctx.resume();
      ratio = ctx.sampleRate / SR;
      src = ctx.createMediaStreamSource(stream);
      proc = ctx.createScriptProcessor(4096, 1, 1);
      proc.onaudioprocess = e => { if (s.running) push(down(e.inputBuffer.getChannelData(0))); };
      src.connect(proc); proc.connect(ctx.destination);
      s.running = true; update();
      timer = setInterval(tick, 200);
    }
    function stop() {
      s.running = false; clearInterval(timer);
      try { proc && proc.disconnect(); src && src.disconnect(); } catch (e) {}
      try { stream && stream.getTracks().forEach(t => t.stop()); } catch (e) {}
      try { ctx && ctx.close(); } catch (e) {}
      update();
    }

    function tick() {
      if (!s.running || s.busy || eng.state !== 'ready') return;
      const end = len;
      if (speechAt < segStart) return;                 // belum ada suara dalam segmen ini
      const paused = end - speechAt > SR * 0.75;         // berhenti seketika (waqaf / tarik nafas)
      if (end - segStart < SR * 0.5) return;
      if (end - lastPass < SR * 0.6 && !(paused && lastPass <= speechAt)) return;
      if (paused && lastPass > speechAt) return;         // segmen ini sudah disemak selepas berhenti
      pass(end, paused || end - segStart > SR * 24);
    }

    async function pass(end, paused) {
      s.busy = true; lastPass = end;
      const audio = buf.slice(segStart, end);
      const m = await transcribe(audio);
      s.busy = false;
      if (!s.running && !opts.finalOnStop) return;
      if (m.type === 'error') { opts.onError && opts.onError(m.msg); return; }
      s.lastMs = m.ms;
      let hyp = M.words(m.text);
      hyp = strip(hyp);
      const r = M.align(hyp, exp, s.base);
      opts.onHeard && opts.onHeard(m.text, r);
      if (r.err && (!r.err.last || paused)) {
        const key = r.err.pos + '|' + M.skel(r.err.heard);
        if (paused || key === pendKey) {
          s.conf = Math.max(s.conf, r.err.pos);
          s.err = { pos: r.err.pos, heard: r.err.heard, at: Date.now() };
          s.mistakes++;
          s.base = r.err.pos; segStart = end; pendKey = '';
          update(); return;
        }
        pendKey = key;
      } else pendKey = '';
      // Perkataan yang disahkan betul. Perkataan terakhir belum disahkan kecuali pengguna sudah berhenti.
      let c = r.err ? r.err.pos : r.j;
      if (!paused && !r.err && r.matched.length && r.matched[r.matched.length - 1].i === hyp.length - 1) {
        const prev = r.matched.length > 1 ? r.matched[r.matched.length - 2] : null;
        c = prev ? prev.j + 1 : s.base;
      }
      if (c > s.conf) { s.conf = c; if (s.err && s.conf > s.err.pos) s.err = null; }
      if (paused && !r.err) { s.base = r.j; s.conf = Math.max(s.conf, r.j); segStart = end; if (s.err && s.conf > s.err.pos) s.err = null; }
      update();
    }

    // Buang isti'azah / basmalah di awal bacaan (contoh bila ayat seterusnya ialah awal surah).
    const PRE = [['اعوذ', 'بالله', 'من', 'الشيطان', 'الرجيم'], ['بسم', 'الله', 'الرحمن', 'الرحيم']].map(a => a.map(M.skel));
    function strip(h) {
      if (s.base !== 0) return h;
      let k = 0;
      for (const p of PRE) {
        if (exp.length >= p.length && p.every((w, i) => M.skel(exp[i]) === w)) continue; // ayat itu sendiri bermula dengan lafaz ini
        if (p.every((w, i) => h[k + i] && M.skel(h[k + i]) === w)) k += p.length;
      }
      return h.slice(k);
    }

    s.start = start; s.stop = stop;
    return s;
  }

  self.ShafawiVoice = { eng, cached, load, Session, sizeMB: 127 };
})();
