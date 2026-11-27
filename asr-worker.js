// Shafawi: pekerja latar untuk model AI bacaan Quran (Whisper base yang dilatih
// oleh Tarteel pada bacaan Quran). Semua berjalan dalam telefon; audio tidak dihantar ke mana-mana.
import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.5';

export const MODEL = 'nael239/tasme3-whisper-base-ar-quran-web';
export const REV = 'de82316c38fe2a9f03217aad7eb5865877cc0899'; // dikunci supaya fail model tidak berubah
env.allowLocalModels = false;
env.useBrowserCache = true; // fail model disimpan dalam Cache Storage pelayar selepas muat turun pertama

let asr = null, loading = null;
const files = {};

function report(p) {
  if (p.status === 'progress' && p.total) {
    files[p.file] = [p.loaded, p.total];
    let a = 0, b = 0; for (const k in files) { a += files[k][0]; b += files[k][1]; }
    postMessage({ type: 'progress', loaded: a, total: b });
  }
}

async function load() {
  if (asr) return asr;
  if (!loading) loading = (async () => {
    const p = await pipeline('automatic-speech-recognition', MODEL, {
      revision: REV, dtype: 'q8', device: 'wasm', progress_callback: report,
    });
    await p(new Float32Array(8000), { language: 'arabic', task: 'transcribe' }); // panaskan enjin
    asr = p; return p;
  })();
  return loading;
}

self.onmessage = async e => {
  const m = e.data;
  try {
    if (m.type === 'load') { await load(); postMessage({ type: 'ready' }); }
    if (m.type === 'run') {
      const p = await load(), t0 = performance.now();
      const o = await p(m.audio, { language: 'arabic', task: 'transcribe' });
      postMessage({ type: 'result', id: m.id, text: o.text || '', ms: Math.round(performance.now() - t0) });
    }
  } catch (err) {
    loading = null;
    postMessage({ type: 'error', id: m.id, msg: String(err && err.message || err) });
  }
};
