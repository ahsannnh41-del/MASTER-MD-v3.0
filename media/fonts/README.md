# Folder Media/Fonts

Font yang dibundel LANGSUNG di dalam project ini, dipakai oleh
`lib/bratRender.js` untuk render gambar `.brat` / `.bratgreen` / `.bratwhite`
lewat ffmpeg (`drawtext`).

## File

| Nama file                         | Dipakai untuk                                    |
|------------------------------------|---------------------------------------------------|
| `LiberationSans-Bold.ttf`          | Font teks brat (semua variant)                     |
| `OFL-LICENSE-LiberationSans.txt`   | Lisensi font di atas (SIL Open Font License 1.1)   |

## Kenapa font dibundel di sini (bukan cuma pakai font sistem)

FIX (2026-07-24): sebelumnya `bratRender.js` cuma cari font Bold dari path
sistem (`/usr/share/fonts/...`), yang HARUS sudah terinstall lewat paket
distro (`fonts-liberation`, dst). Kebanyakan base image Node.js yang dipakai
egg Pterodactyl itu minimal dan TIDAK bawa font apapun — jadi command
`.brat` gagal terus dengan error "Font Bold sistem tidak ketemu", di HOST
MANAPUN yang tidak kebetulan sudah punya paket font itu ter-install.

Solusinya: bundel font-nya sendiri di dalam project (folder ini), sama
seperti kenapa bot lain kelihatan "brat-nya jalan mulus" — mereka bawa
font sendiri juga, bukan gantung ke sistem. `findFontPath()` di
`lib/bratRender.js` sekarang cek file di folder ini DULU (lewat path
relatif ke lib/, jadi tetap ketemu dari direktori kerja manapun bot
dijalankan), baru fallback ke font sistem kalau file ini somehow hilang.

## Lisensi

`LiberationSans-Bold.ttf` adalah font **Liberation Sans**, lisensi
[SIL Open Font License 1.1](https://scripts.sil.org/OFL) — boleh dipakai,
dimodifikasi, dan dibundel bersama software lain secara bebas (termasuk
untuk project non-open-source), selama tidak dijual terpisah sebagai font
itu sendiri. Teks lengkap lisensinya ada di `OFL-LICENSE-LiberationSans.txt`
di folder ini — JANGAN dihapus, itu syarat dari lisensinya supaya file
font ini boleh diikutsertakan.

> Catatan: kalau nanti mau ganti ke font lain yang lebih sesuai selera
> (mis. font tulisan tangan ala logo "brat" asli), pastikan juga
> bebas-dibundel (cek lisensinya) sebelum ditaruh di sini — jangan
> taruh font komersial (mis. salinan Arial/Helvetica asli) tanpa lisensi
> yang jelas.
