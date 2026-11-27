// Seluruh app dalam fungsi (IIFE), bukan blok { }. Safari 16 (iPhone X) tidak dapat melihat const/let
// blok dari dalam fungsi yang diisytihar dalam blok itu ("Can't find variable: store").
(function(){
const V=document.getElementById('view');
const AD=n=>String(n).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const store={get(k,d){try{const v=localStorage.getItem('thebook.'+k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem('thebook.'+k,JSON.stringify(v))}catch(e){}}};
/* ---------- bahasa (i18n) ---------- */
// Semua teks UI di sini. Tambah kunci baharu dalam KEDUA-DUA ms dan en.
// Nilai boleh teks biasa atau fungsi (untuk teks yang ada nombor/nama).
const TX={
 ms:{
  langAria:'Bahasa',brandAria:'Shafawi, ke Home',themeDark:'Tukar ke mod gelap',themeLight:'Tukar ke mod cerah',
  navAria:'Navigasi utama',tabHome:'Utama',tabUji:'Tebuk',tabLib:'Catatan',tabProg:'Pencapaian',
  loading:'Memuatkan mushaf…',loadFail:'Data mushaf gagal dimuatkan. Cuba muat semula.',
  juz:'Juzuk',juzN:n=>'Juzuk '+n,pageRight:'Muka kanan',pageLeft:'Muka kiri',rehalAria:'Mushaf terbuka di atas rehal kayu',
  hTebuk:'Tebuk Ayat',hTebukSub:'Sambung ayat dan kenal pasti kedudukannya',hNota:"Catatan Muraja'ah",hNotaSub:'Rekod ayat yang selalu tersangkut',
  ringAria:(r,t)=>`${r} daripada ${t} ulangan`,activeNotes:'nota aktif',done:'selesai',
  credit:'Teks dan susun atur Mushaf Madinah: KFGQPC, melalui dataset quran-text (CC BY 4.0).',
  modes:{rawak:['30 juzuk','Mana-mana ayat dalam Quran'],juz:['Juzuk','Pilih satu juzuk'],surah:['Surah','Pilih satu surah'],julat:['Julat muka surat','Dari muka surat X hingga Y'],maqra:["Awal maqra'","Ayat pertama setiap maqra' (rubu' hizb)"],awalsurah:['Awal surah','Ayat pertama setiap surah'],nota:['Dari nota','Ayat sebelum setiap ayat lemah']},
  surah:'Surah',fromPage:'Dari muka surat',to:'Hingga',scope:'Skop',all30:'Semua 30 juzuk',inSel:n=>`${n} ayat dalam pilihan ini`,
  notaMode:n=>`${n} nota aktif. App akan tanya ayat sebelum setiap ayat lemah.`,noActive:'Tiada nota aktif lagi. Catat ayat lemah dahulu.',
  modTitle:'Tebuk Hafazan',back:'‹ Kembali',pickMode:'Pilih mod hafazan',start:'Mula',
  lblSurah:n=>'Surah '+n,lblPages:(a,b)=>`Muka surat ${a}–${b}`,noAyat:'Tiada ayat dalam pilihan ini',
  nextAyah:'Ayat seterusnya',prevAyah:'Ayat sebelumnya',qN:n=>'Soalan '+n,contAyah:'Sambung ayat ini',idBoth:'Kenal Pasti Surah &amp; Kedudukan Ayat',endSess:'Tamat sesi',
  surOk:'Masyallah mumtaz. Jawapan anda betul',surNo:'Jawapan anda salah. Teruskan murajaah',surAns:n=>`Jawapannya Surah ${n}`,idSurah:'Kenal Pasti Surah',whichSurah:'Ayat ini daripada surah apa?',idPos:'Kenal Pasti Kedudukan Ayat',checkSurah:'Semak surah',
  tapZone:'Tekan bahagian muka surat tempat ayat itu bermula.',top:'Atas',bottom:'Bawah',checkPos:'Semak kedudukan',
  posOk:'Masyallah mumtaz. Jawapan anda betul',posNo:'Jawapan anda salah. Teruskan murajaah',pg:n=>'ms '+n,right:'kanan',left:'kiri',topL:'atas',bottomL:'bawah',mid:'tengah',
  loadingPage:n=>`Memuatkan muka surat ${n}…`,nextPage:'Muka surat selepas',prevPage:'Muka surat sebelum',nextQ:'Soalan seterusnya',backTo:n=>`Kembali ke ms ${n}`,
  noteHint:'Catat ayat yang perlu diulang.',ayah:'Ayat',katLbl:'Kategori catatan',catatan:'Catatan',writeNote:'Tulis catatan',saveNote:'Simpan nota',saved:r=>`Nota ${r} disimpan`,
  kat:{'Ayat Mutasyabihat':'Ayat Mutasyabihat','Perkataan':'Perkataan','Kepala ayat':'Kepala ayat','Kepala muka surat':'Kepala muka surat'},
  pageN:n=>'Muka surat '+n,revN:n=>'Ulangan '+n,doneT:'Selesai',tapDel:'Tekan lagi untuk padam',delNote:'Padam nota',
  fiveDone:'5 ulangan lengkap. Nota ditanda selesai.',markedDone:'Ditanda selesai',backActive:'Dikembalikan ke aktif',deleted:'Nota dipadam',
  libSub:'Ayat lemah, ikut turutan mushaf',addNoteAria:'Tambah nota',addNote:'＋ Nota',filterAria:'Tapis nota',fAktif:'Aktif',fSelesai:'Selesai',fSemua:'Semua',
  emptyList:'Tiada nota dalam senarai ini.',noNotes:'Belum ada nota',noNotesSub:'Catat ayat yang selalu tersangkut, kemudian tanda setiap kali anda ulang.',firstNote:'Catat nota pertama',demo:'Isi 3 nota contoh untuk cuba',
  markDone:'Tanda selesai',revOf5:n=>`${n} daripada 5 ulangan`,dataBackup:'Data &amp; sandaran',exp:'Eksport nota',expSub:'Simpan sandaran ke fail',imp:'Import nota',impSub:'Pulihkan daripada fail sandaran',
  off:'Mushaf luar talian',offSub:'Simpan semua muka surat (kira-kira 36 MB)',fine:'Nota disimpan dalam pelayar ini sahaja. Eksport selepas menambah nota supaya tidak hilang bila tukar telefon.',
  savingN:(n,t)=>`Menyimpan… ${n}/${t}`,failN:n=>`${n} fail gagal. Tekan untuk cuba lagi`,allSaved:'Semua muka surat disimpan ✓',
  score:'Skor',progSub:'Rekod setiap sesi uji anda',noHist:'Belum ada sesi',noHistSub:'Tamatkan satu sesi Tebuk Ayat dan skornya akan direkod di sini.',quote:'Murajaah itu amanah, masyi itu satu anugerah.',ptsM:n=>`+${n} markah`,ruleTxt:'Setiap soalan 2 markah: surah betul 1 markah, kedudukan betul 1 markah.',ptsN:n=>`+${n}`,
  sumTitle:'Sesi tamat',sumPts:(a,b,n)=>`${a}/${b} markah · ${n} soalan`,sumSurah:'Surah',sumPos:'Kedudukan',
  grade:['Mumtaz','Jayyid Jiddan','Jayyid','Maqbul'],keepGoing:'Teruskan usaha',wrongT:'Ayat untuk diulang',wrongS:'Surah salah',wrongP:'Kedudukan salah',
  saveWrong:n=>`Simpan ${n} ayat ke Catatan`,savedWrong:n=>`${n} ayat disimpan ke Catatan`,allSavedW:'Sudah disimpan ke Catatan ✓',newSess:'Sesi baharu',toHome:'Ke Utama',fromTest:'Dari sesi uji',
  progT:'Perkembangan 7 hari',avgN:n=>`Purata ${n}%`,histT:'Sesi lepas',chartAria:'Peratus skor setiap hari, 7 hari lepas',
  days:['Ahad','Isnin','Selasa','Rabu','Khamis','Jumaat','Sabtu'],dayS:['Ahd','Isn','Sel','Rab','Kha','Jum','Sab'],mon:['Jan','Feb','Mac','Apr','Mei','Jun','Jul','Ogo','Sep','Okt','Nov','Dis'],today:'Hari ini',nSess:n=>`${n} sesi`,qs:n=>`${n} soalan`,
  shareTitle:'Sandaran nota Shafawi',imported:n=>`${n} nota diimport`,badFile:'Fail ini bukan sandaran Shafawi',hMon:['Muharam','Safar','Rabiulawal','Rabiulakhir','Jamadilawal','Jamadilakhir','Rejab','Syaaban','Ramadan','Syawal','Zulkaedah','Zulhijah']},
 en:{
  langAria:'Language',brandAria:'Shafawi, go to Home',themeDark:'Switch to dark mode',themeLight:'Switch to light mode',
  navAria:'Main navigation',tabHome:'Home',tabUji:'Test',tabLib:'Notes',tabProg:'Progress',
  loading:'Loading mushaf…',loadFail:'Could not load the mushaf data. Please reload.',
  juz:'Juz',juzN:n=>'Juz '+n,pageRight:'Right page',pageLeft:'Left page',rehalAria:'Open mushaf on a wooden rehal',
  hTebuk:'Ayah Test',hTebukSub:'Continue the ayah and identify its position',hNota:"Muraja'ah Notes",hNotaSub:'Keep track of ayahs you often get stuck on',
  ringAria:(r,t)=>`${r} of ${t} revisions`,activeNotes:'active notes',done:'done',
  credit:'Mushaf Madinah text and layout: KFGQPC, via the quran-text dataset (CC BY 4.0).',
  modes:{rawak:['All 30 juz','Any ayah in the Quran'],juz:['Juz','Pick one juz'],surah:['Surah','Pick one surah'],julat:['Page range','From page X to Y'],maqra:["Start of maqra'","First ayah of each maqra' (rub' al-hizb)"],awalsurah:['Start of surah','First ayah of each surah'],nota:['From notes','The ayah before each weak ayah']},
  surah:'Surah',fromPage:'From page',to:'To',scope:'Scope',all30:'All 30 juz',inSel:n=>`${n} ayahs in this selection`,
  notaMode:n=>`${n} active notes. The app will ask the ayah before each weak ayah.`,noActive:'No active notes yet. Note down your weak ayahs first.',
  modTitle:'Memorization Test',back:'‹ Back',pickMode:'Choose a test mode',start:'Start',
  lblSurah:n=>'Surah '+n,lblPages:(a,b)=>`Pages ${a}–${b}`,noAyat:'No ayahs in this selection',
  nextAyah:'Next ayah',prevAyah:'Previous ayah',qN:n=>'Question '+n,contAyah:'Continue this ayah',idBoth:'Identify Surah &amp; Ayah Position',endSess:'End session',
  surOk:'Masha Allah, mumtaz! Your answer is correct',surNo:'Your answer is wrong. Keep up your muraja\'ah',surAns:n=>`The answer is Surah ${n}`,idSurah:'Identify the Surah',whichSurah:'Which surah is this ayah from?',idPos:'Identify Ayah Position',checkSurah:'Check surah',
  tapZone:'Tap the part of the page where the ayah begins.',top:'Top',bottom:'Bottom',checkPos:'Check position',
  posOk:'Masha Allah, mumtaz! Your answer is correct',posNo:'Your answer is wrong. Keep up your muraja\'ah',pg:n=>'p. '+n,right:'right',left:'left',topL:'top',bottomL:'bottom',mid:'middle',
  loadingPage:n=>`Loading page ${n}…`,nextPage:'Next page',prevPage:'Previous page',nextQ:'Next question',backTo:n=>`Back to p. ${n}`,
  noteHint:'Note down ayahs that need revising.',ayah:'Ayah',katLbl:'Note category',catatan:'Note',writeNote:'Write a note',saveNote:'Save note',saved:r=>`Note ${r} saved`,
  kat:{'Ayat Mutasyabihat':'Mutashabihat ayah','Perkataan':'Word','Kepala ayat':'Start of ayah','Kepala muka surat':'Start of page'},
  pageN:n=>'Page '+n,revN:n=>'Revision '+n,doneT:'Done',tapDel:'Tap again to delete',delNote:'Delete note',
  fiveDone:'5 revisions complete. Note marked done.',markedDone:'Marked done',backActive:'Moved back to active',deleted:'Note deleted',
  libSub:'Weak ayahs, in mushaf order',addNoteAria:'Add note',addNote:'＋ Note',filterAria:'Filter notes',fAktif:'Active',fSelesai:'Done',fSemua:'All',
  emptyList:'No notes in this list.',noNotes:'No notes yet',noNotesSub:'Note down ayahs you often get stuck on, then tick them each time you revise.',firstNote:'Write your first note',demo:'Add 3 sample notes to try',
  markDone:'Mark done',revOf5:n=>`${n} of 5 revisions`,dataBackup:'Data &amp; backup',exp:'Export notes',expSub:'Save a backup to a file',imp:'Import notes',impSub:'Restore from a backup file',
  off:'Offline mushaf',offSub:'Save all pages (about 36 MB)',fine:'Notes are stored in this browser only. Export after adding notes so they are not lost when you change phones.',
  savingN:(n,t)=>`Saving… ${n}/${t}`,failN:n=>`${n} files failed. Tap to try again`,allSaved:'All pages saved ✓',
  score:'Score',progSub:'A record of every test session',noHist:'No sessions yet',noHistSub:'Finish an Ayah Test session and its score will be recorded here.',quote:'Muraja\'ah is a trust; fluent recitation is a gift.',ptsM:n=>`+${n} pt`,ruleTxt:'Each question is worth 2 points: 1 for the correct surah, 1 for the correct position.',ptsN:n=>`+${n}`,
  sumTitle:'Session complete',sumPts:(a,b,n)=>`${a}/${b} points · ${n} questions`,sumSurah:'Surah',sumPos:'Position',
  grade:['Mumtaz','Jayyid Jiddan','Jayyid','Maqbul'],keepGoing:'Keep going',wrongT:'Ayahs to revise',wrongS:'Wrong surah',wrongP:'Wrong position',
  saveWrong:n=>`Save ${n} ayahs to Notes`,savedWrong:n=>`${n} ayahs saved to Notes`,allSavedW:'Saved to Notes ✓',newSess:'New session',toHome:'Go to Home',fromTest:'From a test session',
  progT:'Last 7 days',avgN:n=>`Average ${n}%`,histT:'Past sessions',chartAria:'Score percentage per day, last 7 days',
  days:['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],dayS:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],mon:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],today:'Today',nSess:n=>`${n} sessions`,qs:n=>`${n} questions`,
  shareTitle:'Shafawi notes backup',imported:n=>`${n} notes imported`,badFile:'This file is not a Shafawi backup',}};
let LANG=store.get('lang','ms');if(!TX[LANG])LANG='ms';
const t=(k,...a)=>{const v=TX[LANG][k]??TX.ms[k];return typeof v==='function'?v(...a):v};
const katName=k=>TX[LANG].kat[k]||k;
// Teks statik dalam index.html (data-t = kunci, data-ta = kunci untuk aria-label).
function applyLang(){
  document.documentElement.lang=LANG;
  document.querySelectorAll('[data-t]').forEach(el=>el.textContent=t(el.dataset.t));
  document.querySelectorAll('[data-ta]').forEach(el=>el.setAttribute('aria-label',t(el.dataset.ta)));
  document.querySelectorAll('[data-lang]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.lang===LANG));
  document.getElementById('theme')&&applyTheme()}
document.querySelectorAll('[data-lang]').forEach(b=>b.onclick=()=>{if(LANG===b.dataset.lang)return;LANG=b.dataset.lang;store.set('lang',LANG);applyLang();render()});
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
// Ayat keputusan dipecah dua: ayat pertama jadi tajuk, selebihnya baris kedua.
const vtx=x=>{const m=/^(.+?[.!])\s+(.+)$/.exec(x);return m?`<b>${esc(m[1])}</b><span class="vl">${esc(m[2])}</span>`:`<b>${esc(x)}</b>`};
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
function applyTheme(){const d=isDark();document.documentElement.style.colorScheme=d?'dark':'light';document.documentElement.dataset.mode=d?'dark':'light';const b=document.getElementById('theme');b.innerHTML=d?SUN:MOON;b.setAttribute('aria-label',d?t('themeLight'):t('themeDark'))}
document.getElementById('theme').onclick=()=>{store.set('theme',isDark()?'light':'dark');applyTheme();if(location.hash==='#jawapan')render()};
matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change',applyTheme);
applyTheme();applyLang();

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
// Takwim Hijri Malaysia (JAKIM, e-solat.gov.my): Gregorian date of the 1st of each Hijri month.
// Malaysia uses rukyah + imkanur rukyah, so it often differs by a day from Umm al-Qura.
// Covers 1 Jamadilakhir 1445 to 1 Syaaban 1449 (Dec 2023 - Jan 2028); outside that, falls back to Umm al-Qura.
// Add new rows each year from https://www.e-solat.gov.my (takwimsolat API, field "hijri").
const JAKIM_H0=[1445,6],JAKIM_D=['2023-12-14','2024-01-13','2024-02-11','2024-03-12','2024-04-10','2024-05-10','2024-06-08',
 '2024-07-07','2024-08-06','2024-09-05','2024-10-04','2024-11-03','2024-12-03','2025-01-01','2025-01-31','2025-03-02','2025-03-31',
 '2025-04-29','2025-05-29','2025-06-27','2025-07-26','2025-08-25','2025-09-23','2025-10-23','2025-11-22','2025-12-22','2026-01-20',
 '2026-02-19','2026-03-21','2026-04-19','2026-05-18','2026-06-17','2026-07-16','2026-08-14','2026-09-13','2026-10-12','2026-11-11',
 '2026-12-11','2027-01-10','2027-02-08','2027-03-10','2027-04-09','2027-05-08','2027-06-06','2027-07-06','2027-08-04','2027-09-02',
 '2027-10-02','2027-10-31','2027-11-30','2027-12-29'];
function hijriYMD(d){const day=Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/864e5,
  st=JAKIM_D.map(x=>Date.parse(x)/864e5);
  for(let i=st.length-1;i>=0;i--)if(day>=st[i]){const n=day-st[i]+1;if(n>30)break;
    const k=JAKIM_H0[1]-1+i;return {y:JAKIM_H0[0]+Math.floor(k/12),m:k%12+1,d:n}}
  try{const p=Object.fromEntries(new Intl.DateTimeFormat('en-u-ca-islamic-umalqura',{day:'numeric',month:'numeric',year:'numeric'}).formatToParts(d).map(x=>[x.type,x.value]));
    return {y:parseInt(p.year),m:+p.month,d:+p.day}}catch(e){return null}}
function hijri(d=new Date()){const h=hijriYMD(d);return h?`${h.d} ${TX.ms.hMon[h.m-1]} ${h.y}H`:''}

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
  return `<div class="mush-wrap${short?' short':''}"><div class="mushaf ${side}" aria-label="${side==='r'?t('pageRight'):t('pageLeft')}"><i class="spine"></i><i class="edge"></i><div class="phead"><span>${t('juzN',juzOf(Q.ps[p-1]))}</span><span class="ar" lang="ar">${esc(Q.s[s-1][0])}</span></div><div class="lines">${rows}</div><div class="pfoot"><span>${p}</span></div></div></div>`}
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
  // 3D-style mushaf on a carved wooden rehal (front three-quarter view)
  // text lines on pages, following page curvature
  let lines='';for(let i=0;i<7;i++){const y=48+i*7.6,s=i*0.9;
    lines+=`<path d="M${74+s} ${y-3}Q112 ${y+1} 141 ${y+12}"/><path d="M${226-s} ${y-3}Q188 ${y+1} 159 ${y+12}"/>`}
  // page-edge strata
  let edgeL='',edgeR='';for(let i=1;i<5;i++){edgeL+=`<path d="M${52+i*.3} ${101+i*1.6}Q102 ${97+i*1.6} 150 ${121+i*1.6}"/>`;edgeR+=`<path d="M${248-i*.3} ${101+i*1.6}Q198 ${97+i*1.6} 150 ${121+i*1.6}"/>`}
  return `<svg class="ill" viewBox="0 0 300 190" role="img" aria-label="${t('rehalAria')}">
  <defs>
   <radialGradient id="rg-glow" cx="50%" cy="42%" r="52%"><stop offset="0" stop-color="#f4d99a" stop-opacity=".38"/><stop offset="1" stop-color="#f4d99a" stop-opacity="0"/></radialGradient>
   <linearGradient id="rg-wf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#c98a4e"/><stop offset=".5" stop-color="#9a5f30"/><stop offset="1" stop-color="#6e3f1e"/></linearGradient>
   <linearGradient id="rg-wb" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a5429"/><stop offset="1" stop-color="#4f2c14"/></linearGradient>
   <linearGradient id="rg-ws" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a3216"/><stop offset="1" stop-color="#3a1f0c"/></linearGradient>
   <linearGradient id="rg-pl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f3e7c9"/><stop offset=".55" stop-color="#fffaf0"/><stop offset=".9" stop-color="#efe0bd"/><stop offset="1" stop-color="#d8c294"/></linearGradient>
   <linearGradient id="rg-pr" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#eadcb9"/><stop offset=".55" stop-color="#fbf4e4"/><stop offset=".9" stop-color="#e9d8b2"/><stop offset="1" stop-color="#cfb787"/></linearGradient>
   <linearGradient id="rg-edge" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#efe2c2"/><stop offset="1" stop-color="#c9b083"/></linearGradient>
   <linearGradient id="rg-cov" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1d5a40"/><stop offset="1" stop-color="#0a2c1f"/></linearGradient>
   <filter id="rg-blur" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="4"/></filter>
   <filter id="rg-sh" x="-10%" y="-10%" width="120%" height="140%"><feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="#000" flood-opacity=".35"/></filter>
  </defs>
  <ellipse cx="150" cy="92" rx="146" ry="90" fill="url(#rg-glow)"/>
  <ellipse cx="150" cy="178" rx="104" ry="7" fill="#000" opacity=".4" filter="url(#rg-blur)"/>
  <!-- back leg (behind), darker -->
  <path d="M206 106 L222 106 L120 176 L103 176 Z" fill="url(#rg-wb)"/>
  <path d="M103 176 L120 176 L120 180 L103 180 Z" fill="#2e180a"/>
  <!-- front leg with side thickness -->
  <path d="M94 106 L110 106 L200 172 L200 177 L184 177 L94 111 Z" fill="url(#rg-ws)"/>
  <path d="M78 106 L96 106 L200 172 L182 172 Z" fill="url(#rg-wf)"/>
  <path d="M84 107 L94 107 L192 170" fill="none" stroke="#f0c48e" stroke-width="1.4" opacity=".55"/>
  <!-- feet -->
  <path d="M176 172 Q192 166 206 172 L206 178 L176 178 Z" fill="url(#rg-wf)"/><path d="M98 172 Q112 166 126 172 L126 178 L98 178 Z" fill="url(#rg-wb)"/>
  <!-- hinge boss -->
  <circle cx="150" cy="141" r="7" fill="#5a3216"/><circle cx="150" cy="140" r="5.2" fill="#c98a4e"/><polygon points="150,135.5 151.5,138.5 154.5,140 151.5,141.5 150,144.5 148.5,141.5 145.5,140 148.5,138.5" fill="#f4dca4"/>
  <g filter="url(#rg-sh)">
   <!-- cover (underneath, overhangs) -->
   <path d="M150 74Q100 44 44 46L36 112Q98 106 150 134Q202 106 264 112L256 46Q200 44 150 74Z" fill="url(#rg-cov)" stroke="#c9a24f" stroke-width="1.4"/>
   <!-- page block edges (thickness) -->
   <path d="M150 64Q104 36 54 38L50 104Q102 98 150 124Q198 98 250 104L246 38Q196 36 150 64Z" fill="url(#rg-edge)"/>
   <g fill="none" stroke="#b99d6b" stroke-width=".6" opacity=".8">${edgeL}${edgeR}</g>
   <!-- top pages -->
   <path d="M150 58Q106 28 58 30L52 99Q103 93 150 118Z" fill="url(#rg-pl)"/>
   <path d="M150 58Q194 28 242 30L248 99Q197 93 150 118Z" fill="url(#rg-pr)"/>
   <!-- gutter shadow -->
   <path d="M150 58 L150 118" stroke="#a88d5c" stroke-width="1.2"/>
   <path d="M139 50Q146 56 150 58Q154 56 161 50L161 108Q155 112 150 118Q145 112 139 108Z" fill="#7a5a2a" opacity=".12"/>
   <!-- curled top-left page highlight -->
   <path d="M150 58Q106 28 58 30L57 40Q106 40 150 66Z" fill="#fff" opacity=".35"/>
   <g fill="none" stroke="#9c8a62" stroke-width="1.3" stroke-linecap="round" opacity=".65">${lines}</g>
   <!-- gold page frame -->
   <path d="M64 36Q106 36 146 62M236 36Q194 36 154 62M146 112Q102 92 60 95M154 112Q198 92 240 95" fill="none" stroke="#c9a24f" stroke-width="1.1"/>
  </g>
  </svg>`}

/* ---------- screens ---------- */
const R={};
R.home=()=>{
  const gi=gIdx(15,9),act=notes.filter(n=>!n.selesai).length,done=notes.length-act;
  const tot=notes.length*5,rep=notes.reduce((t,n)=>t+n.ulangan.filter(Boolean).length,0),C=2*Math.PI*23,f=tot?C*rep/tot:0;
  V.innerHTML=`<div class="greet"><small>${esc(hijri())}</small><h1>Assalamualaikum</h1></div>
  <section class="hero"><div class="date"><span>بِسۡمِ ٱللَّهِ</span></div>
  ${rehal()}<div class="quran">${ayText(gi)}</div><div class="cap">Al-Hijr · 15:9</div></section>
  <div class="actions">
   <button class="tile main" data-go="mod">${star(IC.book)}<div><b>${t('hTebuk')}</b><span>${t('hTebukSub')}</span></div><i class="go">›</i></button>
   <button class="tile notes" data-go="library"><svg class="mring" viewBox="0 0 56 56" role="img" aria-label="${t('ringAria',rep,tot)}"><circle class="tr" cx="28" cy="28" r="23" fill="none" stroke-width="5"/><circle class="pr" cx="28" cy="28" r="23" fill="none" stroke-width="5" stroke-linecap="round" stroke-dasharray="${f.toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 28 28)"/></svg><div><b>${t('hNota')}</b><span>${notes.length?`<em>${act}</em> ${t('activeNotes')} · <em>${done}</em> ${t('done')}`:t('hNotaSub')}</span></div><i class="go">›</i></button>
  </div>
  <p class="credit">${t('credit')}</p>`};

/* ---------- skor & sejarah sesi ---------- */
// Setiap soalan: surah betul 1 markah, kedudukan betul 1 markah (maksimum 2).
let hist=store.get('sesi',[]),LAST=null;
const pct=x=>x.max?Math.round(x.pts*100/x.max):0;
// Skala pangkat (zulfikar, 27 Nov 2026): Mumtaz 85-100, Jayyid Jiddan 70-84, Jayyid 50-69, Maqbul bawah 50.
const gradeOf=p=>p>=85?0:p>=70?1:p>=50?2:3;
const cfgKey=c=>[c.mode,c.mode==='juz'?c.juz:c.mode==='surah'?c.surah:c.mode==='julat'?c.from+'-'+c.to:c.skop||''].join(':');
const dkey=d=>d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
function fdate(iso){const d=new Date(iso),td=new Date();const y=new Date(td);y.setDate(td.getDate()-1);
  return dkey(d)===dkey(td)?t('today'):`${t('days')[d.getDay()]} ${d.getDate()} ${t('mon')[d.getMonth()]}`}
const ftime=iso=>{const d=new Date(iso);return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')};
function histHTML(){
  if(!hist.length)return `<div class="empty">${star(IC.book,'gold')}<b>${t('noHist')}</b>${t('noHistSub')}<div style="margin-top:14px"><button class="btn" data-go="mod">${t('hTebuk')}</button></div></div>`;
  const td=new Date(),days=[];
  for(let i=6;i>=0;i--){const d=new Date(td);d.setDate(td.getDate()-i);const k=dkey(d),L=hist.filter(h=>dkey(new Date(h.t))===k);
    const P=L.reduce((a,h)=>a+h.pts,0),X=L.reduce((a,h)=>a+h.max,0);days.push({d,v:X?Math.round(P*100/X):null,k:L.length,today:i===0})}
  const vs=days.filter(x=>x.v!=null),avg=vs.length?Math.round(vs.reduce((a,x)=>a+x.v,0)/vs.length):0;
  const bars=days.map(x=>`<div class="bc${x.today?' td':''}"><em>${x.v==null?'':x.v}</em><i style="height:${x.v==null?4:Math.max(6,x.v)}px"${x.v==null?' class="z"':''}></i><span>${t('dayS')[x.d.getDay()]}</span><small>${x.k>1?t('nSess',x.k):'&nbsp;'}</small></div>`).join('');
  let lastD='';const rows=hist.slice(-40).reverse().map(h=>{const dk=dkey(new Date(h.t)),hd=dk!==lastD?`<div class="hday">${fdate(h.t)}</div>`:'';lastD=dk;const p=pct(h),g=gradeOf(p);
    return hd+`<div class="grow hs"><i class="g${g}">${p}<small>%</small></i><span><b>${esc(label(h.cfg))}</b><small>${ftime(h.t)} · ${t('qs',h.n)} · ${h.pts}/${h.max}</small></span><em class="gr g${g}">${t('grade')[g]}</em></div>`}).join('');
  return `<div class="sect">${t('progT')}${vs.length?`<span>${t('avgN',avg)}</span>`:''}</div>
  <div class="group pad chart" role="img" aria-label="${t('chartAria')}"><div class="bars">${bars}</div></div>
  <div class="sect">${t('histT')}</div><div class="group">${rows}</div>`}
R.pencapaian=()=>{V.innerHTML=`<h1>${t('tabProg')}</h1><p class="sub" style="margin-bottom:0">${t('progSub')}</p>${histHTML()}`};
function scoreHTML(){const c=S.sc;if(!c.n)return '';return `<div class="scorep" role="status" aria-label="${t('score')} ${c.pts}/${c.n*2}"><small>${t('score')}</small><b>${c.pts}<span>/${c.n*2}</span></b></div>`}
function finish(){
  const c=S.sc,cfg=S.cfg;
  if(!c.n){S=null;return go('mod')}
  const key=cfgKey(cfg);
  const rec={t:new Date().toISOString(),cfg,key,n:c.n,s:c.s,p:c.p,pts:c.pts,max:c.n*2};
  hist.push(rec);if(hist.length>300)hist=hist.slice(-300);store.set('sesi',hist);
  LAST={...rec,wrong:c.wrong,saved:false};S=null;go('ringkasan')}
R.ringkasan=()=>{
  const L=LAST;if(!L)return go('home');
  const p=pct(L),g=gradeOf(p),C=2*Math.PI*52;
  const W=L.wrong.filter(w=>!notes.some(n=>gIdx(n.surah,n.ayah)===w.gi));
  V.innerHTML=`<div class="qhead"><div><span class="eyebrow">${esc(label(L.cfg))}</span><h1>${t('sumTitle')}</h1></div></div>
  <section class="sumcard g${g}">
   <svg class="sring" viewBox="0 0 120 120" aria-hidden="true"><circle class="tr" cx="60" cy="60" r="52" fill="none" stroke-width="9"/><circle class="pr" cx="60" cy="60" r="52" fill="none" stroke-width="9" stroke-linecap="round" stroke-dasharray="${(C*p/100).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 60 60)"/></svg>
   <div class="sring-n"><b>${p}<small>%</small></b></div>
   <h2>${t('grade')[g]}</h2>${g===3?`<p class="kg">${t('keepGoing')}</p>`:''}<p>${t('sumPts',L.pts,L.max,L.n)}</p>
  </section>
  <div class="stats"><div class="stat"><b>${L.s}<small>/${L.n}</small></b><span>${t('sumSurah')}</span></div><div class="stat"><b>${L.p}<small>/${L.n}</small></b><span>${t('sumPos')}</span></div></div>
  <p class="rule">${t('ruleTxt')}</p>
  <figure class="quote">${ORN}<blockquote>${t('quote')}</blockquote></figure>
  ${L.wrong.length?`<div class="sect">${t('wrongT')}<span>${L.wrong.length}</span></div>
  <div class="group">${L.wrong.map(w=>`<div class="grow wr"><span><b>${esc(ref(w.gi))}</b><span class="aw" lang="ar">${ayHead(w.gi)}</span></span><span class="wt">${!w.s?`<em class="mk no">${t('wrongS')}</em>`:''}${!w.p?`<em class="mk no">${t('wrongP')}</em>`:''}</span></div>`).join('')}</div>
  <button class="btn" id="svw" style="margin-top:14px"${W.length?'':' disabled'}>${W.length?t('saveWrong',W.length):t('allSavedW')}</button>`:''}
  <div style="display:grid;gap:4px;margin-top:10px"><button class="btn ${L.wrong.length?'ghost':''}" data-go="mod">${t('newSess')}</button><button class="link" data-go="home" style="justify-self:center">${t('toHome')}</button></div>`;
  const sv=document.getElementById('svw');sv&&(sv.onclick=()=>{const now=new Date().toISOString();
    W.forEach((w,i)=>notes.push({id:Date.now().toString(36)+i+Math.random().toString(36).slice(2,5),surah:surOf(w.gi),ayah:ayNo(w.gi),kategori:w.p?'Perkataan':'Kepala muka surat',lain:'',perkataan:t('fromTest'),ulangan:[0,0,0,0,0],selesai:false,dibuat:now}));
    save();toast(t('savedWrong',W.length));R.ringkasan()})};

const MODES=['rawak','juz','surah','julat','maqra','awalsurah','nota'];
R.mod=()=>{
  const act=notes.filter(n=>!n.selesai).length;
  let o='';
  if(sel.mode==='juz')o=`<label class="f" for="juz">${t('juz')}</label><select id="juz">${Array.from({length:30},(_,i)=>`<option value="${i+1}"${sel.juz==i+1?' selected':''}>${t('juzN',i+1)}</option>`).join('')}</select>`;
  if(sel.mode==='surah')o=`<label class="f" for="surah">${t('surah')}</label><select id="surah">${Q.s.map((x,i)=>`<option value="${i+1}"${sel.surah==i+1?' selected':''}>${i+1}. ${esc(sName(i+1))}</option>`).join('')}</select>`;
  if(sel.mode==='julat')o=`<div class="row"><div><label class="f" for="from">${t('fromPage')}</label><input type="number" id="from" min="1" max="604" inputmode="numeric" value="${sel.from}"></div><div><label class="f" for="to">${t('to')}</label><input type="number" id="to" min="1" max="604" inputmode="numeric" value="${sel.to}"></div></div>`;
  if(sel.mode==='maqra'||sel.mode==='awalsurah')o=`<label class="f" for="skop">${t('scope')}</label><select id="skop"><option value="0">${t('all30')}</option>${Array.from({length:30},(_,i)=>`<option value="${i+1}"${sel.skop==i+1?' selected':''}>${t('juzN',i+1)}</option>`).join('')}</select><p class="sub" style="margin:8px 2px 0;font-size:13px">${t('inSel',pool().length)}</p>`;
  if(sel.mode==='nota')o=`<p class="sub" style="margin:12px 0 0">${act?t('notaMode',act):t('noActive')}</p>`;
  V.innerHTML=`<div class="top"><h1>${t('modTitle')}</h1><button class="link" data-go="home">${t('back')}</button></div>
  <p class="sub" style="margin-bottom:6px">${t('pickMode')}</p>${ORN}
  <div class="modes">${MODES.map((m,i)=>`<button class="mode" data-mode="${m}" aria-pressed="${sel.mode===m}">${star(i+1)}<div><b>${t('modes')[m][0]}</b><span>${t('modes')[m][1]}</span></div><i class="tick"></i></button>`).join('')}</div>
  <div class="opts">${o}</div>
  <p class="rule">${t('ruleTxt')}</p><div style="margin-top:14px"><button class="btn" id="mula"${(sel.mode==='nota'&&!act)||((sel.mode==='maqra'||sel.mode==='awalsurah')&&!pool().length)?' disabled':''}>${t('start')}</button></div>`;
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
// Label sesi dikira semasa paparan supaya ikut bahasa semasa.
function label(c=sel){const M_=t('modes'),sk=c.skop?' · '+t('juzN',c.skop):'';return {rawak:M_.rawak[0],juz:t('juzN',c.juz),surah:t('lblSurah',sName(c.surah)),julat:t('lblPages',c.from,c.to),maqra:M_.maqra[0]+sk,awalsurah:M_.awalsurah[0]+sk,nota:M_.nota[0]}[c.mode]}
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function start(){const p=pool();if(!p.length){toast(t('noAyat'));return}S={pool:p,bag:shuffle(p.slice()),n:0,cfg:{...sel},sc:{n:0,s:0,p:0,pts:0,wrong:[]}};next()}
function next(){if(!S.bag.length)S.bag=shuffle(S.pool.slice());S.gi=S.bag.pop();S.n++;S.after=0;S.before=false;S.pick=null;S.view=null;S.sur=null;S.jfx=false;S.got=null;go('soalan')}
const corners='<i class="corner" style="top:-7px;left:50%;margin-left:-7px"></i><i class="corner" style="bottom:-7px;left:50%;margin-left:-7px"></i>';

R.soalan=()=>{
  if(!S)return go('mod');
  const gi=S.gi,A=Q.as.length;
  let after='';for(let k=1;k<=S.after&&gi+k<A;k++)after+=`<div class="extra"><small>${t('nextAyah')}${S.after>1?' '+k:''}</small><div class="quran">${ayText(gi+k)}</div></div>`;
  const before=S.before&&gi>0?`<div class="extra"><small>${t('prevAyah')}</small><div class="quran">${ayText(gi-1)}</div></div>`:'';
  V.innerHTML=`<div class="qhead"><div><span class="eyebrow">${esc(label(S.cfg))}</span><h1>${t('qN',S.n)}</h1></div>${scoreHTML()}</div>
  ${before}<div class="qcard big">${corners}<span class="lbl">${t('contAyah')}</span><div class="quran">${ayText(gi)}</div></div>${after}
  <div class="qtools"><button class="btn ghost small" id="bf"${S.before||gi===0?' disabled':''}>${t('prevAyah')}</button><button class="btn ghost small" id="af"${gi+S.after+1>=A?' disabled':''}>${t('nextAyah')}</button></div>
  <div style="display:grid;gap:4px"><button class="btn" data-go="surah">${t('idBoth')}</button><button class="link" id="tamat" style="justify-self:center">${t('endSess')}</button></div>`;
  document.getElementById('af').onclick=()=>{S.after++;R.soalan();[...V.querySelectorAll('.extra')].pop()?.scrollIntoView({block:'nearest',behavior:'smooth'})};
  document.getElementById('bf').onclick=()=>{S.before=true;R.soalan()};
  document.getElementById('tamat').onclick=tamat};
function tamat(){finish()}

// Kenal pasti surah: 4 pilihan, 3 daripadanya surah berdekatan supaya mengelirukan.
function surOpts(s){
  const near=[];for(let d=1;d<=4;d++){if(s-d>=1)near.push(s-d);if(s+d<=114)near.push(s+d)}
  near.sort((x,y)=>Math.abs(x-s)-Math.abs(y-s)||Math.random()-.5);
  return shuffle([s,...shuffle(near.slice(0,5)).slice(0,3)])}
// Kesan bila keputusan surah keluar. Betul: kad melantun + bintang emas memercik dari lencana; salah: goyang perlahan.
function celebrate(card,ok){
  if(!card||!ok||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const st=card.querySelector('.star'),b=document.createElement('span');b.className='burst';
  b.style.left=st.offsetLeft+st.offsetWidth/2+'px';b.style.top=st.offsetTop+st.offsetHeight/2+'px';b.innerHTML='<i class="ring"></i>';card.appendChild(b);
  for(let i=0;i<10;i++){const p=document.createElement('i');p.className='spk';
    const a=i/10*Math.PI*2+Math.random()*.4,d=34+Math.random()*26;p.style.setProperty('--x',Math.cos(a)*d+'px');p.style.setProperty('--y',Math.sin(a)*d+'px');
    p.style.animationDelay=(.18+Math.random()*.12)+'s';b.appendChild(p)}
  setTimeout(()=>b.remove(),1400)}
R.surah=()=>{
  if(!S)return go('mod');
  const s=surOf(S.gi);
  if(!S.sur)S.sur={opts:surOpts(s),pick:null,done:false};
  const U=S.sur;
  const cls=o=>!U.done?(U.pick===o?' sel':''):o===s?' ok':U.pick===o?' no':' dim';
  // Selepas semak: kad keputusan di atas (gaya sama dengan Kenal Pasti Kedudukan Ayat).
  const ok=U.pick===s,fx=U.done&&!U.shown;if(U.done)U.shown=true;
  const head=U.done?`<div class="verdict sv ${ok?'ok':'no'}${fx?' fx':''}">${star(ok?IC.ok:IC.no)}<div>${vtx(ok?t('surOk'):t('surNo'))}<p>${ok?'Surah '+esc(ref(S.gi)):t('surAns',esc(sName(s)))}</p></div><span class="pts${ok?'':' z'}">${t('ptsM',ok?1:0)}</span></div>`
    :`<h1>${t('idSurah')}</h1><p class="sub">${t('whichSurah')}</p>`;
  V.innerHTML=`${head}
  <div class="qcard" style="padding:10px 14px;margin:0 0 14px"><div class="quran" style="font-size:21px;line-height:1.9;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${ayText(S.gi)}</div></div>
  <div class="sopts">${U.opts.map(o=>`<button class="sopt${cls(o)}" data-s="${o}"${U.done?' disabled':''}><i>${o}</i><span><b>${esc(sName(o))}</b><span class="ar" lang="ar">${esc(Q.s[o-1][0])}</span></span></button>`).join('')}</div>
  <button class="btn" id="sk" style="margin-top:22px"${!U.done&&!U.pick?' disabled':''}>${U.done?t('idPos'):t('checkSurah')}</button>`;
  // Letak butang di tengah antara kandungan di atasnya dan butang Home.
  const sk=document.getElementById('sk'),hm=document.getElementById('tabs');
  const place=()=>{if(!sk.isConnected)return;sk.style.marginTop='22px';const above=sk.previousElementSibling.getBoundingClientRect().bottom,top=hm.getBoundingClientRect().top;
    sk.style.marginTop=Math.max(22,(top-above-sk.offsetHeight)/2)+'px'};
  if(U.done&&sk&&hm){place();document.fonts&&document.fonts.ready.then(place)}
  if(fx)celebrate(V.querySelector('.verdict'),ok);
  V.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{U.pick=+b.dataset.s;R.surah()});
  document.getElementById('sk').onclick=()=>{if(U.done)go('teka');else{U.done=true;R.surah()}}};

R.teka=()=>{
  if(!S)return go('mod');
  const z=(side,half,txt)=>`<button class="zone" data-z="${side}${half}" aria-pressed="${S.pick===side+half}"><i class="rules"></i><span>${txt}</span></button>`;
  V.innerHTML=`<h1>${t('idPos')}</h1><p class="sub">${t('tapZone')}</p>
  <div class="qcard" style="padding:10px 14px;margin:0"><div class="quran" style="font-size:21px;line-height:1.9;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${ayText(S.gi)}</div></div>
  <div class="book"><div class="pg l">${z('L','T',t('top'))}${z('L','B',t('bottom'))}</div><div class="pg r">${z('R','T',t('top'))}${z('R','B',t('bottom'))}</div></div>
  <div class="side"><span>${t('pageLeft')}</span><span>${t('pageRight')}</span></div>
  <button class="btn" id="semak"${S.pick?'':' disabled'}>${t('checkPos')}</button>`;
  V.querySelectorAll('[data-z]').forEach(b=>b.onclick=()=>{S.pick=b.dataset.z;S.jfx=false;R.teka()});
  document.getElementById('semak').onclick=()=>go('jawapan')};

R.jawapan=()=>{
  if(!S||!S.pick)return go(S?'teka':'mod');
  const z=zoneOf(S.gi),okPos=S.pick[0]===z.side&&(z.half==='*'||S.pick[1]===z.half);
  // Keputusan surah sudah ditunjuk di halaman Kenal Pasti Surah; di sini nilai kedudukan sahaja.
  const ok=okPos;
  if(S.view==null)S.view=z.p;
  const pos=`${z.side==='R'?t('right'):t('left')}, ${z.half==='T'?t('topL'):z.half==='B'?t('bottomL'):t('mid')}`;
  // Animasi hanya kali pertama keputusan keluar, bukan bila tukar muka surat atau tema.
  const fx=!S.jfx;S.jfx=true;
  // Kira markah sekali sahaja untuk setiap soalan.
  if(!S.got){const c=S.sc,sOk=!!(S.sur&&S.sur.pick===surOf(S.gi)),g=(sOk?1:0)+(okPos?1:0);S.got={g};
    c.n++;c.s+=sOk;c.p+=okPos;c.pts+=g;if(g<2)c.wrong.push({gi:S.gi,s:sOk,p:okPos})}
  V.innerHTML=`<div class="verdict sv ${ok?'ok':'no'}${fx?' fx':''}">${star(ok?IC.ok:IC.no)}<div>${vtx(ok?t('posOk'):t('posNo'))}<p>${esc(ref(S.gi))} · ${t('pg',z.p)} · ${pos}</p></div><span class="pts${okPos?'':' z'}">${t('ptsM',okPos?1:0)}</span></div>
  <div id="pg" data-scroll="1"><div class="pgload">${t('loadingPage',S.view)}</div></div>
  <div class="jnav"><button class="btn ghost pgb" id="pn"${S.view>=604?' disabled':''} aria-label="${t('nextPage')}">‹</button><button class="btn" id="nx">${t('nextQ')}</button><button class="btn ghost pgb" id="pp"${S.view<=1?' disabled':''} aria-label="${t('prevPage')}">›</button></div>
  <div class="jlinks">${S.view!==z.p?`<button class="link" id="back">${t('backTo',z.p)}</button>`:''}<button class="link" id="tamat">${t('endSess')}</button></div>`;
  showPage(document.getElementById('pg'),S.view,S.gi);
  if(fx)celebrate(V.querySelector('.verdict'),ok);
  const nav=d=>{S.view=Math.min(604,Math.max(1,S.view+d));R.jawapan()};
  document.getElementById('pn').onclick=()=>nav(1);document.getElementById('pp').onclick=()=>nav(-1);
  document.getElementById('back')&&(document.getElementById('back').onclick=()=>{S.view=z.p;R.jawapan()});
  document.getElementById('nx').onclick=next;document.getElementById('tamat').onclick=tamat};

let form={surah:1,ayah:1,kat:KAT[0],lain:'',kata:''};
R.nota=()=>{
  const n=Q.s[form.surah-1][2];if(form.ayah>n)form.ayah=n;
  V.innerHTML=`<div class="top"><h1>${t('hNota')}</h1><button class="btn ghost small" data-go="library">${t('tabLib')}</button></div>
  <p class="sub" style="margin-bottom:6px">${t('noteHint')}</p>${ORN}
  <form id="nf" autocomplete="off" class="panel">
  <div class="row"><div style="flex:1.6"><label class="f" for="fs">${t('surah')}</label><select id="fs">${Q.s.map((x,i)=>`<option value="${i+1}"${form.surah==i+1?' selected':''}>${i+1}. ${esc(sName(i+1))}</option>`).join('')}</select></div>
  <div><label class="f" for="fa">${t('ayah')}</label><select id="fa">${Array.from({length:n},(_,i)=>`<option${form.ayah==i+1?' selected':''}>${i+1}</option>`).join('')}</select></div></div>
  <div class="preview"><div class="quran">${ayText(gIdx(form.surah,form.ayah))}</div></div>
  <label class="f" for="fk">${t('katLbl')}</label><select id="fk">${KAT.map(k=>`<option value="${esc(k)}"${form.kat===k?' selected':''}>${esc(katName(k))}</option>`).join('')}</select>
  <label class="f" for="fw">${t('catatan')}</label><input type="text" id="fw" dir="auto" placeholder="${t('writeNote')}" value="${esc(form.kata)}">
  <div style="margin-top:20px"><button class="btn" type="submit">${t('saveNote')}</button></div></form>`;
  const g=id=>document.getElementById(id);
  g('fs').onchange=e=>{form.surah=+e.target.value;form.ayah=1;R.nota()};
  g('fa').onchange=e=>{form.ayah=+e.target.value;R.nota()};
  g('fk').onchange=e=>{form.kat=e.target.value;R.nota()};
  g('fw').oninput=e=>form.kata=e.target.value;
  g('nf').onsubmit=e=>{e.preventDefault();
    notes.push({id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),surah:form.surah,ayah:form.ayah,kategori:form.kat,lain:'',perkataan:form.kata.trim(),ulangan:[0,0,0,0,0],selesai:false,dibuat:new Date().toISOString()});
    save();toast(t('saved',`${sName(form.surah)} ${form.surah}:${form.ayah}`));form.kata='';tab='aktif';go('library')}};

function save(){store.set('notes',notes)}
function sorted(){return notes.slice().sort((a,b)=>(a.selesai-b.selesai)||(gIdx(a.surah,a.ayah)-gIdx(b.surah,b.ayah)))}
// Detail satu nota: mushaf penuh dengan ayat berwarna, ulangan, selesai, padam.
R.notad=()=>{
  const n=notes.find(x=>x.id===openNote);if(!n)return go('library');
  const gi=gIdx(n.surah,n.ayah),p=pageOf(Q.as[gi]),kat=n.kategori;
  const uc=n.ulangan.filter(Boolean).length;
  V.innerHTML=`<button class="back" data-go="library">‹ ${t('tabLib')}</button>
  <div class="dhead"><i class="star jz"><small>${t('juz')}</small>${juzOf(Q.as[gi])}</i><div><h1>${esc(sName(n.surah))} : ${n.ayah}</h1><p class="sub" style="margin:0">${t('pageN',p)} · <span class="katx">${esc(katName(kat))}</span></p></div></div>
  ${n.perkataan?`<div class="ncat"><small>${t('catatan')}</small><span dir="auto">${esc(n.perkataan)}</span></div>`:''}
  <div id="pg"><div class="pgload">${t('loadingPage',p)}</div></div>
  <div class="ulrow"><div class="boxes">${n.ulangan.map((u,i)=>`<button class="box" data-i="${i}" aria-pressed="${!!u}" aria-label="${t('revN',i+1)}">${u?'✓':i+1}</button>`).join('')}</div><span id="ucn">${uc}/5</span></div>
  <div class="ndfoot"><label class="sw2"><input type="checkbox" class="tg" id="nd-done"${n.selesai?' checked':''}><span>${t('doneT')}</span></label><button class="del" id="nd-del">${n.confirm?t('tapDel'):t('delNote')}</button></div>`;
  showPage(document.getElementById('pg'),p,gi);
  V.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{const i=+b.dataset.i;n.ulangan[i]=n.ulangan[i]?0:1;if(n.ulangan.every(Boolean)&&!n.selesai){n.selesai=true;toast(t('fiveDone'))}save();syncND(n)});
  document.getElementById('nd-done').onchange=e=>{n.selesai=e.target.checked;save();toast(n.selesai?t('markedDone'):t('backActive'))};
  document.getElementById('nd-del').onclick=()=>{if(n.confirm){notes=notes.filter(x=>x!==n);openNote=null;save();toast(t('deleted'));go('library')}else{n.confirm=true;setTimeout(()=>{delete n.confirm},4000);document.getElementById('nd-del').textContent=t('tapDel')}}};
// Kemas kini kotak tanpa lukis semula mushaf.
function syncND(n){V.querySelectorAll('[data-i]').forEach(b=>{const i=+b.dataset.i,u=n.ulangan[i];b.setAttribute('aria-pressed',!!u);b.textContent=u?'✓':i+1});const d=document.getElementById('nd-done');d&&(d.checked=n.selesai);const c=document.getElementById('ucn');c&&(c.textContent=n.ulangan.filter(Boolean).length+'/5')}

R.library=()=>{
  const act=notes.filter(n=>!n.selesai).length,done=notes.length-act;
  const L=sorted().filter(n=>tab==='semua'||(tab==='aktif'?!n.selesai:n.selesai));
  const item=n=>{const gi=gIdx(n.surah,n.ayah),uc=n.ulangan.filter(Boolean).length,kat=n.kategori;
    return `<div class="note${n.selesai?' done':''}"><div class="nrow"><button class="open" data-open="${n.id}"><i class="star jz"><small>${t('juz')}</small>${juzOf(Q.as[gi])}</i><span class="t"><b>${esc(sName(n.surah))} : ${n.ayah}</b><span class="aw" lang="ar">${ayHead(gi)}</span><em class="kat">${esc(katName(kat))}</em><span class="ub" aria-label="${t('revOf5',uc)}">${n.ulangan.map(u=>`<i${u?' class="on"':''}></i>`).join('')}<em>${uc}/5</em></span></span></button><label class="ck" aria-label="${t('markDone')}"><input type="checkbox" class="rk" data-done="${n.id}"${n.selesai?' checked':''}></label></div></div>`};
  V.innerHTML=`<div class="top"><div><h1>${t('tabLib')}</h1><p class="sub" style="margin:0">${t('libSub')}</p></div><button class="btn small addn" data-go="nota" aria-label="${t('addNoteAria')}">${t('addNote')}</button></div>
  <div class="seg" role="group" aria-label="${t('filterAria')}">${[['aktif',t('fAktif'),act],['selesai',t('fSelesai'),done],['semua',t('fSemua'),notes.length]].map(t=>`<button data-tab="${t[0]}" aria-pressed="${tab===t[0]}">${t[1]} ${t[2]}</button>`).join('')}</div>
  <div class="list">${L.length?L.map(item).join(''):notes.length?`<div class="empty">${t('emptyList')}</div>`:`<div class="empty">${star(IC.pen,'gold')}<b>${t('noNotes')}</b>${t('noNotesSub')}<div style="margin-top:14px;display:grid;gap:6px"><button class="btn" data-go="nota">${t('firstNote')}</button><button class="link" id="demo">${t('demo')}</button></div></div>`}</div>
  <details class="datab"><summary class="sect">${t('dataBackup')}</summary>
  <div class="group">
    <button class="grow" id="ex"${notes.length?'':' disabled'}><i><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V3M7 8l5-5 5 5M5 21h14"/></svg></i><span><b>${t('exp')}</b><small>${t('expSub')}</small></span><em>›</em></button>
    <label class="grow" for="im"><i><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M7 10l5 5 5-5M5 21h14"/></svg></i><span><b>${t('imp')}</b><small>${t('impSub')}</small></span><em>›</em><input type="file" id="im" accept=".json,application/json" hidden></label>
    <button class="grow" id="dl"${M?'':' disabled'}><i><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2zM4 19V5M9 7h6"/></svg></i><span><b>${t('off')}</b><small id="dls">${t('offSub')}</small></span><em>›</em></button>
  </div>
  <p class="fine">${t('fine')}</p></details>`;
  V.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{tab=b.dataset.tab;R.library()});
  V.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>{openNote=b.dataset.open;go('notad')});
  V.querySelectorAll('[data-done]').forEach(c=>c.onchange=()=>{const n=notes.find(x=>x.id===c.dataset.done);n.selesai=c.checked;save();toast(c.checked?t('markedDone'):t('backActive'));R.library()});
  V.querySelectorAll('[data-ul]').forEach(b=>b.onclick=()=>{const n=notes.find(x=>x.id===b.dataset.ul),i=+b.dataset.i;n.ulangan[i]=n.ulangan[i]?0:1;if(n.ulangan.every(Boolean)&&!n.selesai){n.selesai=true;toast(t('fiveDone'))}save();R.library()});
  V.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{const n=notes.find(x=>x.id===b.dataset.del);if(n.confirm){notes=notes.filter(x=>x!==n);openNote=null;save();toast(t('deleted'))}else{n.confirm=true;setTimeout(()=>{delete n.confirm},4000)}R.library()});
  const d=document.getElementById('demo');d&&(d.onclick=()=>{const t=Date.now().toString(36),now=new Date().toISOString();
    notes=[{id:t+'a',surah:2,ayah:102,kategori:'Perkataan',lain:'',perkataan:'وَمَا هُم بِضَآرِّينَ',ulangan:[1,1,0,0,0],selesai:false,dibuat:now},
    {id:t+'b',surah:18,ayah:57,kategori:'Ayat Mutasyabihat',lain:'',perkataan:'وَمَنۡ أَظۡلَمُ',ulangan:[1,0,0,0,0],selesai:false,dibuat:now},
    {id:t+'c',surah:36,ayah:47,kategori:'Kepala ayat',lain:'',perkataan:'',ulangan:[1,1,1,1,1],selesai:true,dibuat:now}];save();R.library()});
  document.getElementById('ex').onclick=exportNotes;
  document.getElementById('dl').onclick=async e=>{const b=e.currentTarget,s=document.getElementById('dls');b.disabled=true;let n=0,bad=0;
    for(const f of M.fonts){if(!(await qfont(f)))bad++;n++;s.textContent=t('savingN',n,M.fonts.length)}
    s.textContent=bad?t('failN',bad):t('allSaved');b.disabled=!bad};
  document.getElementById('im').onchange=importNotes};

async function exportNotes(){
  const data=new TextEncoder().encode(JSON.stringify({app:'Shafawi',versi:1,dieksport:new Date().toISOString(),nota:notes.map(({confirm,...n})=>n)},null,1));
  const filename=`shafawi-nota-${new Date().toISOString().slice(0,10)}.json`;
  try{const file=new File([data],filename,{type:'application/json'});
    if(navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file],title:t('shareTitle')});return}}catch(e){if(e&&e.name==='AbortError')return}
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([data],{type:'application/json'}));a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),4000)}
function importNotes(e){const f=e.target.files[0];if(!f)return;const r=new FileReader();
  r.onload=()=>{try{const j=JSON.parse(r.result);const arr=Array.isArray(j)?j:j.nota;if(!Array.isArray(arr))throw 0;let add=0;
    arr.forEach(n=>{if(!n||!(n.surah>=1&&n.surah<=114)||!(n.ayah>=1&&n.ayah<=Q.s[n.surah-1][2]))return;const id=String(n.id||Math.random().toString(36).slice(2));
      if(notes.some(x=>x.id===id))return;notes.push(fixKat({id,surah:+n.surah,ayah:+n.ayah,kategori:String(n.kategori||''),lain:String(n.lain||''),perkataan:String(n.perkataan||''),ulangan:(Array.isArray(n.ulangan)?n.ulangan:[]).concat([0,0,0,0,0]).slice(0,5).map(x=>x?1:0),selesai:!!n.selesai,dibuat:String(n.dibuat||'')}));add++});
    save();toast(t('imported',add));R.library()}catch(_){toast(t('badFile'))}};r.readAsText(f)}

function toast(m){let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';t.setAttribute('role','status');document.body.appendChild(t)}t.textContent=m;t.hidden=false;clearTimeout(toastT);toastT=setTimeout(()=>t.hidden=true,2600)}

/* ---------- routing ---------- */
function go(r){if(location.hash==='#'+r)render();else location.hash=r}
function render(){if(!Q)return;const r=(location.hash||'#home').slice(1);(R[r]||R.home)();markTab(R[r]?r:'home');window.scrollTo(0,0)}
document.addEventListener('click',e=>{const b=e.target.closest('[data-go]');if(b){e.preventDefault();go(b.dataset.go)}});
document.querySelectorAll('[data-tab-go]').forEach(b=>b.onclick=()=>{const t=b.dataset.tabGo;go(t==='uji'?(S?'soalan':'mod'):t)});
const TABOF={home:'home',ringkasan:'uji',mod:'uji',soalan:'uji',surah:'uji',teka:'uji',jawapan:'uji',nota:'library',notad:'library',library:'library',pencapaian:'pencapaian'};
function markTab(r){const t=TABOF[r]||'home';document.querySelectorAll('[data-tab-go]').forEach(b=>b.dataset.tabGo===t?b.setAttribute('aria-current','page'):b.removeAttribute('aria-current'))}
document.getElementById('brand').onclick=()=>go('home');
addEventListener('hashchange',render);
let rt;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>{const p=document.getElementById('pg');p&&fitPage(p)},150)});
// Splash: icon pops in, crescent & star follow, then zooms out into Home (min 1.5s, or 0.4s if reduced motion)
const SPL=document.getElementById('splash'),SPL_T0=performance.now(),SPL_MIN=matchMedia('(prefers-reduced-motion: reduce)').matches?300:1100;
function hideSplash(){if(!SPL||SPL.classList.contains('out'))return;setTimeout(()=>{requestAnimationFrame(()=>{SPL.classList.add('out');setTimeout(()=>SPL.remove(),450)})},Math.max(0,SPL_MIN-(performance.now()-SPL_T0)))}
setTimeout(hideSplash,6000);
fetch('data/mushaf.json').then(r=>r.json()).then(d=>{M=d}).catch(()=>{});

Promise.all([fetch('data/quran.json').then(r=>r.json()),Promise.race([document.fonts.load('20px Hafs'),new Promise(r=>setTimeout(r,4000))]).catch(()=>0)]).then(([d])=>{
  Q=d;FA=Q.s.map(x=>x[3]);END=new Int16Array(Q.w.length);
  for(let i=0;i<Q.as.length;i++){const e=(i+1<Q.as.length?Q.as[i+1]:Q.w.length)-1;END[e]=i-FA[ub(FA,i)-1]+1}
  render();hideSplash()}).catch(e=>{V.innerHTML=`<div class="loading">${t('loadFail')}</div><p class="err">${esc(e&&e.message||e)}</p>`;hideSplash()});
if('serviceWorker' in navigator&&location.protocol!=='file:')addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
})();
