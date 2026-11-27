// Shafawi: padankan teks yang didengar (ejaan imla'i daripada model AI) dengan
// perkataan Rasm Uthmani dalam data mushaf. Fungsi tulen, boleh diuji dalam Node.
(function (root) {
  const STRIP = /[\u064B-\u065F\u0670\u06D6-\u06ED\u08F0-\u08F2\u0640\u06DE\u06E9\s]/g;
  const MAP = { 'أ': 'ا', 'إ': 'ا', 'آ': 'ا', 'ٱ': 'ا', 'ؤ': 'و', 'ئ': 'ي', 'ى': 'ي', 'ة': 'ه' };
  // Rangka perkataan: tanpa baris, alif dan hamzah, supaya ejaan Uthmani dan imla'i sama.
  function skel(w) {
    return String(w)
      .replace(/\u0648\u0670/g, '')               // وٰ dibaca alif: ٱلصَّلَوٰةَ = الصلاة
      .replace(/\u06E7/g, '\u064A')                // ya kecil di tengah: إِبۡرَٰهِـۧمَ = إبراهيم
      .replace(/\u06E6/g, '')                      // ya silah (بِهِۦ) tidak ditulis dalam imla'i
      .replace(/\u06E8/g, '\u0646')                // nun kecil: نُـۨجِي = ننجي
      .replace(STRIP, '').replace(/[أإآٱؤئىة]/g, c => MAP[c]).replace(/[اء]/g, '');
  }
  // Huruf "lemah" yang selalu berbeza antara Rasm Uthmani dan ejaan imla'i.
  const WEAK = new Set(['ي', 'ل']);
  function lev(a, b) {
    const m = a.length, n = b.length; if (!m) return { d: n, ok: [...b].every(c => WEAK.has(c)) };
    if (!n) return { d: m, ok: [...a].every(c => WEAK.has(c)) };
    // d[i][j] = jarak; s[i][j] = semua suntingan melibatkan huruf lemah sahaja
    let pd = new Array(n + 1), ps = new Array(n + 1);
    pd[0] = 0; ps[0] = true;
    for (let j = 1; j <= n; j++) { pd[j] = j; ps[j] = ps[j - 1] && WEAK.has(b[j - 1]); }
    for (let i = 1; i <= m; i++) {
      const cd = [i], cs = [ps[0] && WEAK.has(a[i - 1])];
      for (let j = 1; j <= n; j++) {
        if (a[i - 1] === b[j - 1]) { cd[j] = pd[j - 1]; cs[j] = ps[j - 1]; continue; }
        const del = pd[j] + 1, ins = cd[j - 1] + 1, sub = pd[j - 1] + 1;
        const best = Math.min(del, ins, sub);
        let s = false;
        if (del === best) s = s || (ps[j] && WEAK.has(a[i - 1]));
        if (ins === best) s = s || (cs[j - 1] && WEAK.has(b[j - 1]));
        if (sub === best) s = s || (ps[j - 1] && WEAK.has(a[i - 1]) && WEAK.has(b[j - 1]));
        cd[j] = best; cs[j] = s;
      }
      pd = cd; ps = cs;
    }
    return { d: pd[n], ok: ps[n] };
  }
  // Adakah perkataan yang didengar (h) sama dengan perkataan mushaf (e)?
  // Ta maftuhah Uthmani (نِعۡمَتَ, مِشۡكَوٰة) kadang ditulis ة atau ت dalam ejaan imla'i.
  const fin = w => w.replace(/[تة]$/, 'ه');
  function same(h, e) {
    let a = skel(h), b = skel(e);
    if (a === b) return true;
    if (!a || !b) return false;
    a = fin(a); b = fin(b);
    if (a === b) return true;
    const { d, ok } = lev(a, b);
    if (!ok) return hamz(h, e, a, b);
    const L = Math.max(a.length, b.length);
    return L >= 4 && d <= (L >= 7 ? 2 : 1);
  }
  // Kerusi hamzah berbeza (نَبَؤُاْ / نبأ): beza satu و atau ي, dan perkataan asal ada hamzah.
  function hamz(h, e, a, b) {
    return /[ءؤئ\u0654]/.test(e + h) && /^[وي]$/.test(diff1(a, b));
  }
  // Huruf yang lebih dalam perkataan lebih panjang (jika beza satu huruf sahaja).
  function diff1(a, b) {
    if (a.length < b.length) [a, b] = [b, a];
    if (a.length !== b.length + 1) return '';
    for (let i = 0; i < a.length; i++) if (a.slice(0, i) + a.slice(i + 1) === b) return a[i];
    return '';
  }

  // Jajarkan perkataan didengar (hyp) bermula dari kedudukan base dalam senarai
  // perkataan mushaf (exp). Pulangkan bilangan perkataan yang sepadan dan ralat pertama.
  function align(hyp, exp, base) {
    let j = base, i = 0, matched = []; // matched: indeks exp bagi setiap perkataan hyp yang sepadan
    while (i < hyp.length) {
      if (j >= exp.length) break;
      const h = hyp[i];
      if (same(h, exp[j])) { matched.push({ i, j }); i++; j++; continue; }
      // Model kadang pisahkan satu perkataan Uthmani kepada dua (contoh يَٰٓأَيُّهَا -> يا أيها)
      if (i + 1 < hyp.length && same(h + hyp[i + 1], exp[j])) { matched.push({ i: i + 1, j }); i += 2; j++; continue; }
      // ...atau gabungkan dua perkataan Uthmani menjadi satu
      if (j + 1 < exp.length && same(h, exp[j] + exp[j + 1])) { matched.push({ i, j: j + 1 }); i++; j += 2; continue; }
      // Pengguna mengulang beberapa perkataan sebelumnya: terima tanpa ralat.
      let back = -1;
      for (let k = j - 1; k >= Math.max(0, j - 6); k--) if (same(h, exp[k]) && (i + 1 >= hyp.length || same(hyp[i + 1], exp[k + 1]))) { back = k; break; }
      if (back >= 0) { j = back + 1; i++; continue; }
      return { j, matched, err: { pos: j, heard: h, hi: i, last: i === hyp.length - 1 } };
    }
    return { j, matched, err: null, rest: hyp.length - i };
  }

  function words(text) {
    return String(text || '').replace(/[.,،؛؟!?"'«»()\[\]{}0-9٠-٩۝]/g, ' ').split(/\s+/).filter(w => skel(w));
  }

  const api = { skel, same, align, words };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.ShafawiMatch = api;
})(typeof self !== 'undefined' ? self : this);
