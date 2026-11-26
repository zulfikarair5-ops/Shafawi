{
const V=document.getElementById('view');
const AD=n=>String(n).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const store={get(k,d){try{const v=localStorage.getItem('thebook.'+k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem('thebook.'+k,JSON.stringify(v))}catch(e){}}};
const ub=(a,x)=>{let lo=0,hi=a.length;while(lo<hi){const m=(lo+hi)>>1;if(a[m]<=x)lo=m+1;else hi=m}return lo};
const KAT=['Ayat Mutasyabihat','Perkataan','Kepala ayat','Kepala muka surat'];
// Kategori lama (sebelum 26 Nov 2026) dipetakan ke kategori baru.
const KAT_OLD={'Tertukar mutasyabihat':'Ayat Mutasyabihat','Tertinggal perkataan':'Perkataan','Salah baris':'Perkataan','Lupa ayat':'Kepala ayat','Lain-lain':'Perkataan'};
function fixKat(n){if(!KAT.includes(n.kategori)){if(n.kategori==='Lain-lain'&&n.lain)n.perkataan=[n.lain,n.perkataan].filter(Boolean).join(' · ');n.kategori=KAT_OLD[n.kategori]||'Perkataan';n.lain=''}return n}
const NAMEFIX={3:"Ali 'Imran"};
let Q=null,FA=null,END=null;
let notes=store.get('notes',[]).map(fixKat);
let S=null;
let sel={mode:'rawak',juz:1,surah:1,from:1,to:20,skop:0};
// Ayat permulaan 240 maqra' (rubu' hizb) Mushaf Madinah, indeks ayat global bermula 0.
// Sumber: quran-meta (MIT) HizbQuarterList, disemak dengan tanda ۞ QCF4; 15:49 ikut Mushaf Madinah.
const MAQRA=[0,32,50,66,81,98,112,130,148,164,183,195,209,225,239,249,259,269,278,289,307,325,344,367,385,405,425,445,463,478,493,504,516,528,550,566,580,592,606,627,640,655,669,680,695,709,719,735,750,765,777,801,824,847,862,883,899,915,929,939,954,984,1000,1018,1041,1070,1095,1109,1124,1142,1160,1181,1200,1220,1235,1253,1268,1280,1294,1309,1327,1345,1356,1374,1389,1416,1434,1453,1478,1496,1513,1533,1556,1580,1602,1625,1648,1672,1696,1711,1725,1741,1759,1777,1802,1850,1901,1930,1951,1975,1990,2011,2029,2051,2078,2098,2127,2156,2171,2190,2214,2238,2271,2308,2348,2402,2430,2458,2483,2511,2533,2565,2595,2613,2632,2654,2673,2708,2747,2791,2811,2825,2843,2855,2875,2907,2932,2983,3042,3112,3159,3185,3214,3240,3263,3280,3302,3327,3340,3365,3385,3409,3439,3462,3490,3513,3533,3550,3563,3583,3592,3615,3629,3651,3674,3700,3732,3764,3809,3870,3932,3990,4021,4065,4089,4110,4133,4153,4173,4198,4226,4242,4264,4284,4298,4322,4348,4381,4430,4484,4510,4530,4554,4577,4600,4612,4625,4656,4705,4758,4809,4854,4901,4979,5053,5090,5104,5117,5136,5156,5177,5191,5217,5229,5241,5271,5323,5393,5447,5494,5551,5609,5672,5758,5829,5884,5948,6023,6090,6154];
let openNote=null,toastT=null,tab='aktif';
const star=(c,cls='')=>`<i class="star ${cls}">${c}</i>`;
const ORN='<div class="orn"><i></i></div>';
const IC={
 book:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 7c-2-1.6-5-2-8-1.5v12c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5v-12c-3-.5-6-.1-8 1.5zM12 7v12"/></svg>',
 pen:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9l-4-4L4 16zM14 6l4 4"/></svg>',
 ok:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
 no:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M7 7l10 10M17 7L7 17"/></svg>'};

/* ---------- theme ---------- */
const MOON='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z"/></svg>';
const SUN='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
function isDark(){const m=store.get('theme',null);if(m)return m==='dark';const t=document.documentElement.dataset.theme;if(t)return t==='dark';return matchMedia('(prefers-color-scheme: dark)').matches}
function applyTheme(){const d=isDark();document.documentElement.style.colorScheme=d?'dark':'light';document.documentElement.dataset.mode=d?'dark':'light';const b=document.getElementById('theme');b.innerHTML=d?SUN:MOON;b.setAttribute('aria-label',d?'Tukar ke mod cerah':'Tukar ke mod gelap')}
document.getElementById('theme').onclick=()=>{store.set('theme',isDark()?'light':'dark');applyTheme();if(location.hash==='#jawapan')render()};
matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change',applyTheme);
applyTheme();

/* ---------- data helpers ---------- */
const nWords=()=>Q.w.length;
const pageOf=pos=>ub(Q.ps,pos);
const juzOf=pos=>ub(Q.js,pos);
const surOf=gi=>ub(FA,gi);
const ayNo=gi=>gi-FA[surOf(gi)-1]+1;
const gIdx=(s,a)=>FA[s-1]+a-1;
const rng=gi=>[Q.as[gi],(gi+1<Q.as.length?Q.as[gi+1]:nWords())-1];
const sName=s=>NAMEFIX[s]||Q.s[s-1][1];
const ref=gi=>`${sName(surOf(gi))} ${surOf(gi)}:${ayNo(gi)}`;
// 4 perkataan awal ayat, untuk kad nota.
function ayHead(gi,k=4){const [a,b]=rng(gi);return esc(Q.w.slice(a,Math.min(b+1,a+k)).join(' '))+(b+1-a>k?'…':'')}
function ayText(gi){const [a,b]=rng(gi);return esc(Q.w.slice(a,b+1).join(' '))+' <span class="am">۝'+AD(ayNo(gi))+'</span>'}
function slots(p){
  const a=Q.ps[p-1],b=p<604?Q.ps[p]:nWords();
  const ls=Q.ls.filter(x=>x>=a&&x<b),out=[];
  ls.forEach((L,i)=>{const si=Q.ss.indexOf(L);if(si>=0){out.push({t:'h',s:si+1});if(si!==0&&si!==8)out.push({t:'b'})}out.push({t:'l',a:L,b:(i+1<ls.length?ls[i+1]:b)-1})});
  return out}
function zoneOf(gi){const p=pageOf(Q.as[gi]),sl=slots(p),st=Q.as[gi];
  const idx=sl.findIndex(x=>x.t==='l'&&st>=x.a&&st<=x.b),mid=(sl.length-1)/2;
  return {p,side:p%2?'R':'L',half:idx<mid?'T':idx>mid?'B':'*'}}
function hijri(){try{return new Intl.DateTimeFormat('ms-MY-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date())}catch(e){return ''}}

/* ---------- mushaf page ---------- */
// Glyph rendering with the KFGQPC QCF4 (1441H) fonts, loaded from jsDelivr and cached offline by sw.js.
const QCF_CDN='https://cdn.jsdelivr.net/npm/quran-qcf4@1.1.0/fonts-woff2/';
let M=null;const fontState={};
function qfont(name){
  if(!fontState[name]){const ff=new FontFace(name,`url(${QCF_CDN}${name}${name.includes('Hafs')?'_W':''}.woff2)`,{display:'block'});
    fontState[name]=Promise.race([ff.load().then(f=>{document.fonts.add(f);return true}),new Promise(r=>setTimeout(()=>r(false),12000))]).catch(()=>false).then(ok=>{if(!ok)delete fontState[name];return ok})}
  return fontState[name]}
const pageFonts=p=>[...new Set(M.pages[p-1].map(r=>M.fonts[r[1]]))];
function glyphHTML(p,gi){
  const P=M.pages[p-1];
  const rows=P.map(r=>{const t=r[0],f=M.fonts[r[1]],arr=Array.isArray(r[2]),codes=arr?r[2]:Array.from({length:r[3]},(_,i)=>r[2]+i);
    if(t==='h')return `<div class="sh q"><i class="band"></i><i class="ros a"></i><i class="ros b"></i><span class="cart"><span style="font-family:${f}">&#${codes[0]};</span></span></div>`;
    if(t==='b')return `<div class="bs q" style="font-family:${f}">${codes.map(c=>`&#${c};`).join('')}</div>`;
    const runs=r[arr?3:4];let h='',i=0;
    runs.forEach(([g,n])=>{for(let k=0;k<n;k++,i++)h+=`<span${g===gi?' class="h"':''}>&#${codes[i]};</span>`});
    return `<div class="ln t q" style="font-family:${f}"><span class="in">${h}</span></div>`}).join('');
  return frameHTML(p,rows,P.length<15)}
function frameHTML(p,rows,short){
  const s=surOf(ub(Q.as,Q.ps[p-1])-1);
  const side=p%2?'r':'l';
  return `<div class="mush-wrap${short?' short':''}"><div class="mushaf ${side}" aria-label="Muka ${side==='r'?'kanan':'kiri'}"><i class="spine"></i><i class="edge"></i><div class="phead"><span>Juzuk ${juzOf(Q.ps[p-1])}</span><span class="ar" lang="ar">${esc(Q.s[s-1][0])}</span></div><div class="lines">${rows}</div><div class="pfoot"><span>${p}</span></div></div></div>`}
async function showPage(el,p,gi){
  const tok=el.dataset.tok=String(Math.random());
  let html=null;
  if(M){const ok=await Promise.all(pageFonts(p).map(qfont));if(ok.every(Boolean))html=glyphHTML(p,gi)}
  if(el.dataset.tok!==tok)return;
  el.innerHTML=html||pageHTML(p,rng(gi));fitPage(el)}
function pageHTML(p,hl){
  const sl=slots(p),short=sl.length<15;
  const ln=sl.map(x=>{
    if(x.t==='h')return `<div class="sh">سُورَةُ ${esc(Q.s[x.s-1][0])}</div>`;
    if(x.t==='b')return `<div class="bs">${esc(Q.w.slice(0,4).join(' '))}</div>`;
    let h='';for(let i=x.a;i<=x.b;i++){const on=hl&&i>=hl[0]&&i<=hl[1];h+=`<span${on?' class="h"':''}>${esc(Q.w[i])}</span>`;if(END[i])h+=`<span${on?' class="h"':''}>۝${AD(END[i])}</span>`}
    return `<div class="ln t">${h}</div>`}).join('');
  return frameHTML(p,ln,short)}
function fitPage(root){
  const L=root.querySelector('.lines');if(!L)return;
  if(L.querySelector('.q')){ // QCF4 glyph lines: natural spacing, each full line scaled a hair to the exact width
    const W=L.clientWidth;L.style.setProperty('--fs',(W/16.3)+'px');
    L.querySelectorAll('.ln.q .in').forEach(el=>{el.style.transform='';const n=el.offsetWidth;el.style.transform=n>W*.82?`scaleX(${W/n})`:''});
    const hl=L.querySelector('.h');if(hl&&root.dataset.scroll)hl.scrollIntoView({block:'center',behavior:'instant'});return}
  const W=L.clientWidth,short=!!root.querySelector('.short'),q=!!L.querySelector('.q');let fs=W/(q?17:21.5);L.style.setProperty('--fs',fs+'px');
  const t=[...L.querySelectorAll('.ln.t')];t.forEach(l=>l.classList.add('measure'));
  let mx=0;const nat=t.map(l=>{const w=l.scrollWidth;mx=Math.max(mx,w);return w});
  const k=Math.min(1,(W*.985)/mx);fs*=k;L.style.setProperty('--fs',fs+'px');
  t.forEach((l,i)=>{l.classList.remove('measure');if(short||nat[i]*k<W*(q?.8:.55))l.classList.add('c')});
  const hl=L.querySelector('.h');if(hl&&root.dataset.scroll)hl.scrollIntoView({block:'center',behavior:'instant'})}

/* ---------- rehal illustration (original) ---------- */
function rehal(){
  let lines='';for(let i=0;i<6;i++){const y=50+i*8.5;lines+=`<path d="M${70+i*1.2} ${y-4+i*.5}Q110 ${y+2} 143 ${y+10}"/><path d="M${230-i*1.2} ${y-4+i*.5}Q190 ${y+2} 157 ${y+10}"/>`}
  return `<svg class="ill" viewBox="0 0 300 170" role="img" aria-label="Mushaf terbuka di atas rehal kayu">
  <defs><radialGradient id="glow" cx="50%" cy="45%" r="50%"><stop offset="0" stop-color="#f4d99a" stop-opacity=".35"/><stop offset="1" stop-color="#f4d99a" stop-opacity="0"/></radialGradient>
  <linearGradient id="wA" x1="0" x2="1"><stop offset="0" stop-color="var(--wood1)"/><stop offset="1" stop-color="var(--wood2)"/></linearGradient>
  <linearGradient id="wB" x1="1" x2="0"><stop offset="0" stop-color="var(--wood2)"/><stop offset="1" stop-color="var(--wood3)"/></linearGradient></defs>
  <ellipse cx="150" cy="80" rx="140" ry="80" fill="url(#glow)"/>
  <ellipse cx="150" cy="164" rx="92" ry="5" fill="#000" opacity=".25"/>
  <g stroke-linecap="round"><path d="M98 100L202 160" stroke="url(#wA)" stroke-width="18"/><path d="M202 100L98 160" stroke="url(#wB)" stroke-width="18"/><path d="M198 105L103 159" stroke="#f0c48e" stroke-width="2.4" opacity=".6"/></g>
  <circle cx="150" cy="130" r="7.5" fill="var(--wood1)"/><polygon points="150,124.5 152,128 155.5,130 152,132 150,135.5 148,132 144.5,130 148,128" fill="#e8c98a"/>
  <path d="M150 64Q104 36 52 38L46 100Q100 96 150 120Q200 96 254 100L248 38Q196 36 150 64Z" fill="var(--cover)" stroke="#c9a24f" stroke-width="1.6"/>
  <path d="M150 58Q106 30 58 31L54 94Q104 90 150 112Q196 90 246 94L242 31Q194 30 150 58Z" fill="#fbf3df"/>
  <path d="M150 58Q106 30 58 31L56 46Q106 46 150 74Z" fill="#fff" opacity=".45"/>
  <path d="M150 58V112" stroke="#d6c393" stroke-width="2"/>
  <g fill="none" stroke="#a8966b" stroke-width="1.5" opacity=".7">${lines}</g>
  <path d="M62 34Q106 34 148 60M238 34Q194 34 152 60M150 112Q104 90 56 94M150 112Q196 90 244 94" fill="none" stroke="#c9a24f" stroke-width="1.3"/>
  </svg>`}

/* ---------- screens ---------- */
const R={};
R.home=()=>{
  const gi=gIdx(15,9),act=notes.filter(n=>!n.selesai).length,done=notes.length-act;
  const tot=notes.length*5,rep=notes.reduce((t,n)=>t+n.ulangan.filter(Boolean).length,0),C=2*Math.PI*23,f=tot?C*rep/tot:0;
  V.innerHTML=`<div class="greet"><small>${esc(hijri())}</small><h1>Assalamualaikum</h1></div>
  <section class="hero"><div class="date"><span>Ayat hari ini</span><span>بِسۡمِ ٱللَّهِ</span></div>
  ${rehal()}<div class="quran">${ayText(gi)}</div><div class="cap">Al-Hijr · 15:9</div></section>
  <div class="actions">
   <button class="tile main" data-go="mod">${star(IC.book)}<div><b>Tebuk Ayat</b><span>Sambung ayat dan kenal pasti kedudukannya</span></div><i class="go">›</i></button>
   <button class="tile" data-go="nota">${star(IC.pen,'gold')}<div><b>Catatan Muraja'ah</b><span>Rekod ayat yang selalu tersangkut</span></div><i class="go">›</i></button>
  </div>
  <button class="ring" data-go="library"><svg viewBox="0 0 56 56" role="img" aria-label="${rep} daripada ${tot} ulangan"><circle class="tr" cx="28" cy="28" r="23" fill="none" stroke-width="5"/><circle class="pr" cx="28" cy="28" r="23" fill="none" stroke-width="5" stroke-linecap="round" stroke-dasharray="${f.toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 28 28)"/></svg><div><small>Muraja'ah</small><span><b>${act}</b> nota aktif · <i>${done}</i> selesai</span></div><i class="go" style="margin-left:auto;opacity:.5;font-size:22px">›</i></button>
  <p class="credit">Teks dan susun atur Mushaf Madinah: KFGQPC, melalui dataset quran-text (CC BY 4.0).</p>`};

const MODES=[['rawak','30 juzuk','Mana-mana ayat dalam Quran'],['juz','Juzuk','Pilih satu juzuk'],['surah','Surah','Pilih satu surah'],['julat','Julat muka surat','Dari muka surat X hingga Y'],['maqra',"Awal maqra'",'Ayat pertama setiap maqra\' (rubu\' hizb)'],['awalsurah','Awal surah','Ayat pertama setiap surah'],['nota','Dari nota','Ayat sebelum setiap ayat lemah']];
R.mod=()=>{
  const act=notes.filter(n=>!n.selesai).length;
  let o='';
  if(sel.mode==='juz')o=`<label class="f" for="juz">Juzuk</label><select id="juz">${Array.from({length:30},(_,i)=>`<option value="${i+1}"${sel.juz==i+1?' selected':''}>Juzuk ${i+1}</option>`).join('')}</select>`;
  if(sel.mode==='surah')o=`<label class="f" for="surah">Surah</label><select id="surah">${Q.s.map((x,i)=>`<option value="${i+1}"${sel.surah==i+1?' selected':''}>${i+1}. ${esc(sName(i+1))}</option>`).join('')}</select>`;
  if(sel.mode==='julat')o=`<div class="row"><div><label class="f" for="from">Dari muka surat</label><input type="number" id="from" min="1" max="604" inputmode="numeric" value="${sel.from}"></div><div><label class="f" for="to">Hingga</label><input type="number" id="to" min="1" max="604" inputmode="numeric" value="${sel.to}"></div></div>`;
  if(sel.mode==='maqra'||sel.mode==='awalsurah')o=`<label class="f" for="skop">Skop</label><select id="skop"><option value="0">Semua 30 juzuk</option>${Array.from({length:30},(_,i)=>`<option value="${i+1}"${sel.skop==i+1?' selected':''}>Juzuk ${i+1}</option>`).join('')}</select><p class="sub" style="margin:8px 2px 0;font-size:13px">${pool().length} ayat dalam pilihan ini</p>`;
  if(sel.mode==='nota')o=`<p class="sub" style="margin:12px 0 0">${act?`${act} nota aktif. App akan tanya ayat sebelum setiap ayat lemah.`:'Tiada nota aktif lagi. Catat ayat lemah dahulu.'}</p>`;
  V.innerHTML=`<div class="top"><h1>Tebuk Hafazan</h1><button class="link" data-go="home">‹ Kembali</button></div>
  <p class="sub" style="margin-bottom:6px">Pilih mod hafazan</p>${ORN}
  <div class="modes">${MODES.map((m,i)=>`<button class="mode" data-mode="${m[0]}" aria-pressed="${sel.mode===m[0]}">${star(i+1)}<div><b>${m[1]}</b><span>${m[2]}</span></div><i class="tick"></i></button>`).join('')}</div>
  <div class="opts">${o}</div>
  <div style="margin-top:20px"><button class="btn" id="mula"${(sel.mode==='nota'&&!act)||((sel.mode==='maqra'||sel.mode==='awalsurah')&&!pool().length)?' disabled':''}>Mula</button></div>`;
  V.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{sel.mode=b.dataset.mode;R.mod()});
  const g=id=>document.getElementById(id);
  g('juz')&&(g('juz').onchange=e=>sel.juz=+e.target.value);
  g('skop')&&(g('skop').onchange=e=>{sel.skop=+e.target.value;R.mod()});
  g('surah')&&(g('surah').onchange=e=>sel.surah=+e.target.value);
  g('from')&&(g('from').oninput=e=>sel.from=+e.target.value);
  g('to')&&(g('to').oninput=e=>sel.to=+e.target.value);
  g('mula').onclick=start};

function pool(){
  const all=[];const A=Q.as.length;
  if(sel.mode==='rawak'){for(let i=0;i<A;i++)all.push(i)}
  if(sel.mode==='juz'){const a=Q.js[sel.juz-1],b=sel.juz<30?Q.js[sel.juz]:nWords();for(let i=0;i<A;i++)if(Q.as[i]>=a&&Q.as[i]<b)all.push(i)}
  if(sel.mode==='surah'){const n=Q.s[sel.surah-1][2];for(let i=0;i<n;i++)all.push(FA[sel.surah-1]+i)}
  if(sel.mode==='julat'){let f=Math.max(1,Math.min(604,sel.from|0)),t=Math.max(1,Math.min(604,sel.to|0));if(f>t)[f,t]=[t,f];sel.from=f;sel.to=t;for(let i=0;i<A;i++){const p=pageOf(Q.as[i]);if(p>=f&&p<=t)all.push(i)}}
  if(sel.mode==='maqra'||sel.mode==='awalsurah'){const src=sel.mode==='maqra'?MAQRA:FA;src.forEach(gi=>{if(!sel.skop||juzOf(Q.as[gi])===sel.skop)all.push(gi)})}
  if(sel.mode==='nota'){notes.filter(n=>!n.selesai).forEach(n=>{const q=Math.max(0,gIdx(n.surah,n.ayah)-1);if(!all.includes(q))all.push(q)})}
  return all}
function label(){return {rawak:'30 juzuk',juz:'Juzuk '+sel.juz,surah:'Surah '+sName(sel.surah),julat:`Muka surat ${sel.from}–${sel.to}`,maqra:"Awal maqra'"+(sel.skop?' · Juzuk '+sel.skop:''),awalsurah:'Awal surah'+(sel.skop?' · Juzuk '+sel.skop:''),nota:'Dari nota'}[sel.mode]}
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function start(){const p=pool();if(!p.length){toast('Tiada ayat dalam pilihan ini');return}S={pool:p,bag:shuffle(p.slice()),n:0,label:label()};next()}
function next(){if(!S.bag.length)S.bag=shuffle(S.pool.slice());S.gi=S.bag.pop();S.n++;S.after=0;S.before=false;S.pick=null;S.view=null;S.sur=null;go('soalan')}
const corners='<i class="corner" style="top:-7px;left:50%;margin-left:-7px"></i><i class="corner" style="bottom:-7px;left:50%;margin-left:-7px"></i>';

R.soalan=()=>{
  if(!S)return go('mod');
  const gi=S.gi,A=Q.as.length;
  let after='';for(let k=1;k<=S.after&&gi+k<A;k++)after+=`<div class="extra"><small>Ayat seterusnya${S.after>1?' '+k:''}</small><div class="quran">${ayText(gi+k)}</div></div>`;
  const before=S.before&&gi>0?`<div class="extra"><small>Ayat sebelumnya</small><div class="quran">${ayText(gi-1)}</div></div>`:'';
  V.innerHTML=`<div class="qhead"><div><span class="eyebrow">${esc(S.label)}</span><h1>Soalan ${S.n}</h1></div></div>
  ${before}<div class="qcard big">${corners}<span class="lbl">Sambung ayat ini</span><div class="quran">${ayText(gi)}</div></div>${after}
  <div class="qtools"><button class="btn ghost small" id="bf"${S.before||gi===0?' disabled':''}>Ayat sebelumnya</button><button class="btn ghost small" id="af"${gi+S.after+1>=A?' disabled':''}>Ayat seterusnya</button></div>
  <div style="display:grid;gap:4px"><button class="btn" data-go="surah">Kenal Pasti Surah &amp; Kedudukan Ayat</button><button class="link" id="tamat" style="justify-self:center">Tamat sesi</button></div>`;
  document.getElementById('af').onclick=()=>{S.after++;R.soalan();[...V.querySelectorAll('.extra')].pop()?.scrollIntoView({block:'nearest',behavior:'smooth'})};
  document.getElementById('bf').onclick=()=>{S.before=true;R.soalan()};
  document.getElementById('tamat').onclick=tamat};
function tamat(){S=null;go('mod')}

// Kenal pasti surah: 4 pilihan, 3 daripadanya surah berdekatan supaya mengelirukan.
function surOpts(s){
  const near=[];for(let d=1;d<=4;d++){if(s-d>=1)near.push(s-d);if(s+d<=114)near.push(s+d)}
  near.sort((x,y)=>Math.abs(x-s)-Math.abs(y-s)||Math.random()-.5);
  return shuffle([s,...shuffle(near.slice(0,5)).slice(0,3)])}
R.surah=()=>{
  if(!S)return go('mod');
  const s=surOf(S.gi);
  if(!S.sur)S.sur={opts:surOpts(s),pick:null,done:false};
  const U=S.sur;
  const cls=o=>!U.done?(U.pick===o?' sel':''):o===s?' ok':U.pick===o?' no':' dim';
  const res=U.done?`<p class="sres ${U.pick===s?'ok':'no'}">${U.pick===s?'Betul! Surah '+esc(sName(s))+'.':'Salah. Jawapannya Surah '+esc(sName(s))+'.'}</p>`:'';
  V.innerHTML=`<h1>Kenal Pasti Surah</h1><p class="sub">Ayat ini daripada surah apa?</p>
  <div class="qcard" style="padding:10px 14px;margin:0 0 14px"><div class="quran" style="font-size:21px;line-height:1.9;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${ayText(S.gi)}</div></div>
  <div class="sopts">${U.opts.map(o=>`<button class="sopt${cls(o)}" data-s="${o}"${U.done?' disabled':''}><i>${o}</i><span><b>${esc(sName(o))}</b><span class="ar" lang="ar">${esc(Q.s[o-1][0])}</span></span></button>`).join('')}</div>
  ${res}
  <button class="btn" id="sk" style="margin-top:22px"${!U.done&&!U.pick?' disabled':''}>${U.done?'Kenal Pasti Kedudukan Ayat':'Semak surah'}</button>`;
  // Letak butang di tengah antara kandungan di atasnya dan butang Home.
  const sk=document.getElementById('sk'),hm=document.getElementById('tabs');
  const place=()=>{if(!sk.isConnected)return;sk.style.marginTop='22px';const above=sk.previousElementSibling.getBoundingClientRect().bottom,top=hm.getBoundingClientRect().top;
    sk.style.marginTop=Math.max(22,(top-above-sk.offsetHeight)/2)+'px'};
  if(U.done&&sk&&hm){place();document.fonts&&document.fonts.ready.then(place)}
  V.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{U.pick=+b.dataset.s;R.surah()});
  document.getElementById('sk').onclick=()=>{if(U.done)go('teka');else{U.done=true;R.surah()}}};

R.teka=()=>{
  if(!S)return go('mod');
  const z=(side,half,txt)=>`<button class="zone" data-z="${side}${half}" aria-pressed="${S.pick===side+half}"><i class="rules"></i><span>${txt}</span></button>`;
  V.innerHTML=`<h1>Kenal Pasti Kedudukan Ayat</h1><p class="sub">Tekan bahagian muka surat tempat ayat itu bermula.</p>
  <div class="qcard" style="padding:10px 14px;margin:0"><div class="quran" style="font-size:21px;line-height:1.9;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${ayText(S.gi)}</div></div>
  <div class="book"><div class="pg l">${z('L','T','Atas')}${z('L','B','Bawah')}</div><div class="pg r">${z('R','T','Atas')}${z('R','B','Bawah')}</div></div>
  <div class="side"><span>Muka kiri</span><span>Muka kanan</span></div>
  <button class="btn" id="semak"${S.pick?'':' disabled'}>Semak kedudukan</button>`;
  V.querySelectorAll('[data-z]').forEach(b=>b.onclick=()=>{S.pick=b.dataset.z;R.teka()});
  document.getElementById('semak').onclick=()=>go('jawapan')};

R.jawapan=()=>{
  if(!S||!S.pick)return go(S?'teka':'mod');
  const z=zoneOf(S.gi),okPos=S.pick[0]===z.side&&(z.half==='*'||S.pick[1]===z.half);
  const okSur=S.sur&&S.sur.done?S.sur.pick===surOf(S.gi):null,ok=okPos&&okSur!==false;
  const mark=(t,v)=>`<span class="mk ${v?'ok':'no'}">${v?'✓':'✗'} ${t}</span>`;
  const marks=okSur===null?'':`<div class="mks">${mark('Surah',okSur)}${mark('Kedudukan',okPos)}</div>`;
  if(S.view==null)S.view=z.p;
  const pos=`${z.side==='R'?'kanan':'kiri'}, ${z.half==='T'?'atas':z.half==='B'?'bawah':'tengah'}`;
  V.innerHTML=`<div class="verdict ${ok?'ok':'no'}">${star(ok?IC.ok:IC.no)}<div><b>${ok?'Betul! Masya-Allah.':'Salah, teruskan mengulang.'}</b><p>${esc(ref(S.gi))} · muka surat ${z.p} · ${pos}</p>${marks}</div></div>
  <div id="pg" data-scroll="1"><div class="pgload">Memuatkan muka surat ${S.view}…</div></div>
  <div class="pnav"><button class="btn ghost small" id="pn"${S.view>=604?' disabled':''}>‹ Muka surat selepas</button><button class="btn ghost small" id="pp"${S.view<=1?' disabled':''}>Muka surat sebelum ›</button></div>
  ${S.view!==z.p?`<button class="link" id="back" style="display:block;margin:0 auto 6px">Kembali ke muka surat ${z.p}</button>`:''}
  <div style="display:grid;gap:4px"><button class="btn" id="nx">Soalan seterusnya</button><button class="link" id="tamat" style="justify-self:center">Tamat sesi</button></div>`;
  showPage(document.getElementById('pg'),S.view,S.gi);
  const nav=d=>{S.view=Math.min(604,Math.max(1,S.view+d));R.jawapan()};
  document.getElementById('pn').onclick=()=>nav(1);document.getElementById('pp').onclick=()=>nav(-1);
  document.getElementById('back')&&(document.getElementById('back').onclick=()=>{S.view=z.p;R.jawapan()});
  document.getElementById('nx').onclick=next;document.getElementById('tamat').onclick=tamat};

let form={surah:1,ayah:1,kat:KAT[0],lain:'',kata:''};
R.nota=()=>{
  const n=Q.s[form.surah-1][2];if(form.ayah>n)form.ayah=n;
  V.innerHTML=`<div class="top"><h1>Catatan Muraja'ah</h1><button class="btn ghost small" data-go="library">Library</button></div>
  <p class="sub" style="margin-bottom:6px">Catat ayat yang perlu diulang.</p>${ORN}
  <form id="nf" autocomplete="off" class="panel">
  <div class="row"><div style="flex:1.6"><label class="f" for="fs">Surah</label><select id="fs">${Q.s.map((x,i)=>`<option value="${i+1}"${form.surah==i+1?' selected':''}>${i+1}. ${esc(sName(i+1))}</option>`).join('')}</select></div>
  <div><label class="f" for="fa">Ayat</label><select id="fa">${Array.from({length:n},(_,i)=>`<option${form.ayah==i+1?' selected':''}>${i+1}</option>`).join('')}</select></div></div>
  <div class="preview"><div class="quran">${ayText(gIdx(form.surah,form.ayah))}</div></div>
  <label class="f" for="fk">Kategori catatan</label><select id="fk">${KAT.map(k=>`<option${form.kat===k?' selected':''}>${k}</option>`).join('')}</select>
  <label class="f" for="fw">Catatan</label><input type="text" id="fw" dir="auto" placeholder="Tulis catatan" value="${esc(form.kata)}">
  <div style="margin-top:20px"><button class="btn" type="submit">Simpan nota</button></div></form>`;
  const g=id=>document.getElementById(id);
  g('fs').onchange=e=>{form.surah=+e.target.value;form.ayah=1;R.nota()};
  g('fa').onchange=e=>{form.ayah=+e.target.value;R.nota()};
  g('fk').onchange=e=>{form.kat=e.target.value;R.nota()};
  g('fw').oninput=e=>form.kata=e.target.value;
  g('nf').onsubmit=e=>{e.preventDefault();
    notes.push({id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),surah:form.surah,ayah:form.ayah,kategori:form.kat,lain:'',perkataan:form.kata.trim(),ulangan:[0,0,0,0,0],selesai:false,dibuat:new Date().toISOString()});
    save();toast(`Nota ${sName(form.surah)} ${form.surah}:${form.ayah} disimpan`);form.kata='';tab='aktif';go('library')}};

function save(){store.set('notes',notes)}
function sorted(){return notes.slice().sort((a,b)=>(a.selesai-b.selesai)||(gIdx(a.surah,a.ayah)-gIdx(b.surah,b.ayah)))}
// Detail satu nota: mushaf penuh dengan ayat berwarna, ulangan, selesai, padam.
R.notad=()=>{
  const n=notes.find(x=>x.id===openNote);if(!n)return go('library');
  const gi=gIdx(n.surah,n.ayah),p=pageOf(Q.as[gi]),kat=n.kategori;
  const uc=n.ulangan.filter(Boolean).length;
  V.innerHTML=`<button class="back" data-go="library">‹ Library</button>
  <div class="dhead"><i class="star jz"><small>Juzuk</small>${juzOf(Q.as[gi])}</i><div><h1>${esc(sName(n.surah))} : ${n.ayah}</h1><p class="sub" style="margin:0">Muka surat ${p} · <span class="katx">${esc(kat)}</span></p></div></div>
  ${n.perkataan?`<div class="ncat"><small>Catatan</small><span dir="auto">${esc(n.perkataan)}</span></div>`:''}
  <div id="pg"><div class="pgload">Memuatkan muka surat ${p}…</div></div>
  <h2 class="sect">Ulangan <span id="ucn">${uc}/5</span></h2>
  <div class="group pad"><div class="boxes">${n.ulangan.map((u,i)=>`<button class="box" data-i="${i}" aria-pressed="${!!u}" aria-label="Ulangan ${i+1}">${u?'✓':i+1}</button>`).join('')}</div>
  <label class="grow sw"><span><b>Tanda selesai</b><small>Pindah nota ke tab Selesai</small></span><input type="checkbox" class="tg" id="nd-done"${n.selesai?' checked':''}></label></div>
  <button class="del" id="nd-del">${n.confirm?'Tekan sekali lagi untuk padam':'Padam nota'}</button>`;
  showPage(document.getElementById('pg'),p,gi);
  V.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{const i=+b.dataset.i;n.ulangan[i]=n.ulangan[i]?0:1;if(n.ulangan.every(Boolean)&&!n.selesai){n.selesai=true;toast('5 ulangan lengkap. Nota ditanda selesai.')}save();syncND(n)});
  document.getElementById('nd-done').onchange=e=>{n.selesai=e.target.checked;save();toast(n.selesai?'Ditanda selesai':'Dikembalikan ke aktif')};
  document.getElementById('nd-del').onclick=()=>{if(n.confirm){notes=notes.filter(x=>x!==n);openNote=null;save();toast('Nota dipadam');go('library')}else{n.confirm=true;setTimeout(()=>{delete n.confirm},4000);document.getElementById('nd-del').textContent='Tekan sekali lagi untuk padam'}}};
// Kemas kini kotak tanpa lukis semula mushaf.
function syncND(n){V.querySelectorAll('[data-i]').forEach(b=>{const i=+b.dataset.i,u=n.ulangan[i];b.setAttribute('aria-pressed',!!u);b.textContent=u?'✓':i+1});const d=document.getElementById('nd-done');d&&(d.checked=n.selesai);const c=document.getElementById('ucn');c&&(c.textContent=n.ulangan.filter(Boolean).length+'/5')}

R.library=()=>{
  const act=notes.filter(n=>!n.selesai).length,done=notes.length-act;
  const L=sorted().filter(n=>tab==='semua'||(tab==='aktif'?!n.selesai:n.selesai));
  const item=n=>{const gi=gIdx(n.surah,n.ayah),uc=n.ulangan.filter(Boolean).length,kat=n.kategori;
    return `<div class="note${n.selesai?' done':''}"><div class="nrow"><button class="open" data-open="${n.id}"><i class="star jz"><small>Juzuk</small>${juzOf(Q.as[gi])}</i><span class="t"><b>${esc(sName(n.surah))} : ${n.ayah}</b><span class="aw" lang="ar">${ayHead(gi)}</span><em class="kat">${esc(kat)}</em><span class="ub" aria-label="${uc} daripada 5 ulangan">${n.ulangan.map(u=>`<i${u?' class="on"':''}></i>`).join('')}<em>${uc}/5</em></span></span></button><label class="ck" aria-label="Tanda selesai"><input type="checkbox" class="rk" data-done="${n.id}"${n.selesai?' checked':''}></label></div></div>`};
  V.innerHTML=`<div class="top"><div><h1>Library</h1><p class="sub" style="margin:0">Ayat lemah, ikut turutan mushaf</p></div><button class="btn small addn" data-go="nota" aria-label="Tambah nota">＋ Nota</button></div>
  <div class="seg" role="group" aria-label="Tapis nota">${[['aktif','Aktif',act],['selesai','Selesai',done],['semua','Semua',notes.length]].map(t=>`<button data-tab="${t[0]}" aria-pressed="${tab===t[0]}">${t[1]} ${t[2]}</button>`).join('')}</div>
  <div class="list">${L.length?L.map(item).join(''):notes.length?`<div class="empty">Tiada nota dalam senarai ini.</div>`:`<div class="empty">${star(IC.pen,'gold')}<b>Belum ada nota</b>Catat ayat yang selalu tersangkut, kemudian tanda setiap kali anda ulang.<div style="margin-top:14px;display:grid;gap:6px"><button class="btn" data-go="nota">Catat nota pertama</button><button class="link" id="demo">Isi 3 nota contoh untuk cuba</button></div></div>`}</div>
  <h2 class="sect">Data</h2>
  <div class="group">
    <button class="grow" id="ex"${notes.length?'':' disabled'}><i><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V3M7 8l5-5 5 5M5 21h14"/></svg></i><span><b>Eksport nota</b><small>Simpan sandaran ke fail</small></span><em>›</em></button>
    <label class="grow" for="im"><i><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M7 10l5 5 5-5M5 21h14"/></svg></i><span><b>Import nota</b><small>Pulihkan daripada fail sandaran</small></span><em>›</em><input type="file" id="im" accept=".json,application/json" hidden></label>
    <button class="grow" id="dl"${M?'':' disabled'}><i><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2zM4 19V5M9 7h6"/></svg></i><span><b>Mushaf luar talian</b><small id="dls">Simpan semua muka surat (kira-kira 36 MB)</small></span><em>›</em></button>
  </div>
  <p class="fine">Nota disimpan dalam pelayar ini sahaja. Eksport selepas menambah nota supaya tidak hilang bila tukar telefon.</p>`;
  V.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{tab=b.dataset.tab;R.library()});
  V.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>{openNote=b.dataset.open;go('notad')});
  V.querySelectorAll('[data-done]').forEach(c=>c.onchange=()=>{const n=notes.find(x=>x.id===c.dataset.done);n.selesai=c.checked;save();toast(c.checked?'Ditanda selesai':'Dikembalikan ke aktif');R.library()});
  V.querySelectorAll('[data-ul]').forEach(b=>b.onclick=()=>{const n=notes.find(x=>x.id===b.dataset.ul),i=+b.dataset.i;n.ulangan[i]=n.ulangan[i]?0:1;if(n.ulangan.every(Boolean)&&!n.selesai){n.selesai=true;toast('5 ulangan lengkap. Nota ditanda selesai.')}save();R.library()});
  V.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{const n=notes.find(x=>x.id===b.dataset.del);if(n.confirm){notes=notes.filter(x=>x!==n);openNote=null;save();toast('Nota dipadam')}else{n.confirm=true;setTimeout(()=>{delete n.confirm},4000)}R.library()});
  const d=document.getElementById('demo');d&&(d.onclick=()=>{const t=Date.now().toString(36),now=new Date().toISOString();
    notes=[{id:t+'a',surah:2,ayah:102,kategori:'Perkataan',lain:'',perkataan:'وَمَا هُم بِضَآرِّينَ',ulangan:[1,1,0,0,0],selesai:false,dibuat:now},
    {id:t+'b',surah:18,ayah:57,kategori:'Ayat Mutasyabihat',lain:'',perkataan:'وَمَنۡ أَظۡلَمُ',ulangan:[1,0,0,0,0],selesai:false,dibuat:now},
    {id:t+'c',surah:36,ayah:47,kategori:'Kepala ayat',lain:'',perkataan:'',ulangan:[1,1,1,1,1],selesai:true,dibuat:now}];save();R.library()});
  document.getElementById('ex').onclick=exportNotes;
  document.getElementById('dl').onclick=async e=>{const b=e.currentTarget,s=document.getElementById('dls');b.disabled=true;let n=0,bad=0;
    for(const f of M.fonts){if(!(await qfont(f)))bad++;n++;s.textContent=`Menyimpan… ${n}/${M.fonts.length}`}
    s.textContent=bad?`${bad} fail gagal. Tekan untuk cuba lagi`:'Semua muka surat disimpan ✓';b.disabled=!bad};
  document.getElementById('im').onchange=importNotes};

async function exportNotes(){
  const data=new TextEncoder().encode(JSON.stringify({app:'Shafawi',versi:1,dieksport:new Date().toISOString(),nota:notes.map(({confirm,...n})=>n)},null,1));
  const filename=`shafawi-nota-${new Date().toISOString().slice(0,10)}.json`;
  try{const file=new File([data],filename,{type:'application/json'});
    if(navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file],title:'Sandaran nota Shafawi'});return}}catch(e){if(e&&e.name==='AbortError')return}
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([data],{type:'application/json'}));a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),4000)}
function importNotes(e){const f=e.target.files[0];if(!f)return;const r=new FileReader();
  r.onload=()=>{try{const j=JSON.parse(r.result);const arr=Array.isArray(j)?j:j.nota;if(!Array.isArray(arr))throw 0;let add=0;
    arr.forEach(n=>{if(!n||!(n.surah>=1&&n.surah<=114)||!(n.ayah>=1&&n.ayah<=Q.s[n.surah-1][2]))return;const id=String(n.id||Math.random().toString(36).slice(2));
      if(notes.some(x=>x.id===id))return;notes.push(fixKat({id,surah:+n.surah,ayah:+n.ayah,kategori:String(n.kategori||''),lain:String(n.lain||''),perkataan:String(n.perkataan||''),ulangan:(Array.isArray(n.ulangan)?n.ulangan:[]).concat([0,0,0,0,0]).slice(0,5).map(x=>x?1:0),selesai:!!n.selesai,dibuat:String(n.dibuat||'')}));add++});
    save();toast(`${add} nota diimport`);R.library()}catch(_){toast('Fail ini bukan sandaran Shafawi')}};r.readAsText(f)}

function toast(m){let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';t.setAttribute('role','status');document.body.appendChild(t)}t.textContent=m;t.hidden=false;clearTimeout(toastT);toastT=setTimeout(()=>t.hidden=true,2600)}

/* ---------- routing ---------- */
function go(r){if(location.hash==='#'+r)render();else location.hash=r}
function render(){if(!Q)return;const r=(location.hash||'#home').slice(1);(R[r]||R.home)();markTab(R[r]?r:'home');window.scrollTo(0,0)}
document.addEventListener('click',e=>{const b=e.target.closest('[data-go]');if(b){e.preventDefault();go(b.dataset.go)}});
document.querySelectorAll('[data-tab-go]').forEach(b=>b.onclick=()=>{const t=b.dataset.tabGo;go(t==='uji'?(S?'soalan':'mod'):t)});
const TABOF={home:'home',mod:'uji',soalan:'uji',surah:'uji',teka:'uji',jawapan:'uji',nota:'library',notad:'library',library:'library'};
function markTab(r){const t=TABOF[r]||'home';document.querySelectorAll('[data-tab-go]').forEach(b=>b.dataset.tabGo===t?b.setAttribute('aria-current','page'):b.removeAttribute('aria-current'))}
document.getElementById('brand').onclick=()=>go('home');
addEventListener('hashchange',render);
let rt;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>{const p=document.getElementById('pg');p&&fitPage(p)},150)});
fetch('data/mushaf.json').then(r=>r.json()).then(d=>{M=d}).catch(()=>{});

Promise.all([fetch('data/quran.json').then(r=>r.json()),document.fonts.load('20px Hafs').catch(()=>0)]).then(([d])=>{
  Q=d;FA=Q.s.map(x=>x[3]);END=new Int16Array(Q.w.length);
  for(let i=0;i<Q.as.length;i++){const e=(i+1<Q.as.length?Q.as[i+1]:Q.w.length)-1;END[e]=i-FA[ub(FA,i)-1]+1}
  render()}).catch(()=>{V.innerHTML='<div class="loading">Data mushaf gagal dimuatkan. Cuba muat semula.</div>'});
if('serviceWorker' in navigator&&location.protocol!=='file:')addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
}
