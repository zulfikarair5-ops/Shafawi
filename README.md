# TheBook

Web app minimalis untuk menguji hafazan Quran sendiri (tebuk ayat) dan mencatat ayat yang lemah.
Direka untuk iPhone (Safari), boleh ditambah ke Skrin Utama dan berfungsi tanpa internet selepas dibuka kali pertama.

## Ciri

- **Tebuk ayat**: 5 mod (rawak 30 juzuk, juzuk, surah, julat muka surat, dari nota). Papar ayat, buka ayat sebelum/seterusnya, kemudian teka kedudukan ayat (kiri/kanan, atas/bawah) dalam Mushaf Madinah. Skrin jawapan papar muka surat penuh 15 baris dengan ayat soalan berwarna.
- **Nota ayat lemah**: surah, ayat, kategori kesalahan, perkataan. Library dengan tab Aktif/Selesai/Semua, 5 kotak ulangan (5 ulangan = selesai), padam, sandaran eksport/import fail JSON.
- Mod gelap (ikut iPhone, atau tukar dengan butang).

## Struktur

| Fail | Isi |
|---|---|
| `index.html` | Kerangka halaman |
| `styles.css` | Gaya (hijau tua + emas, corak khatam) |
| `app.js` | Semua logik app, tanpa framework |
| `sw.js` | Service worker untuk mod luar talian |
| `manifest.webmanifest`, `icons/` | Ikon dan tetapan Skrin Utama |
| `data/quran.json` | Teks Rasm Uthmani + susun atur muka surat, baris, ayat, juzuk |
| `data/hafs.ttf` | Fon KFGQPC HAFS Uthmanic Script |
| `scripts/build_data.py` | Jana `data/quran.json` daripada `hafs.json` pakej `@quran.ws/text` |

Nota disimpan dalam `localStorage` pelayar (kunci `thebook.notes`). Tiada pelayan, tiada akaun.

## Jalankan secara lokal

```sh
python3 -m http.server 8000
# buka http://localhost:8000
```

## Deploy

Fail statik sahaja, jadi boleh dihoskan di GitHub Pages, Netlify atau Cloudflare Pages tanpa langkah build.
Bila mengubah fail app, naikkan `VERSION` dalam `sw.js` supaya telefon ambil versi baru.

## Sumber data dan lesen

- Teks Quran, susun atur Mushaf Madinah 604 muka surat 15 baris, dan fon: King Fahd Glorious Quran Printing Complex (KFGQPC), riwayat Hafs, diambil melalui dataset [quran-text](https://github.com/quran-ws/quran-text) (pakej npm `@quran.ws/text` 0.1.0, lesen CC BY 4.0). Susunan baris disahkan terhadap `hafsData_v2-0.csv` KFGQPC.
- Baris nama surah dan basmalah tidak ada dalam data; app menambahnya (setiap surah kecuali Al-Fatihah dan At-Taubah ada basmalah). Semua muka surat 3 hingga 604 genap 15 baris.
- Ilustrasi rehal dan ikon dilukis khas untuk app ini.
