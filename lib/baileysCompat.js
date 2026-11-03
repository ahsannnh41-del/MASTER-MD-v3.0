// lib/baileysCompat.js
//
// FIX KRITIS (Juli 2026): error "TypeError: makeWASocket is not a function"
// yang muncul saat startBot() dipanggil BUKAN karena cara import di kode ini
// salah (`import makeWASocket, {...} from '@whiskeysockets/baileys'` adalah
// cara resmi sesuai dokumentasi Baileys) — tapi karena package
// @whiskeysockets/baileys sedang dalam masa transisi besar ke ESM murni di
// rilis 7.0.0-rc.x (lihat github.com/WhiskeySockets/Baileys/releases), dan
// rilis stabil terakhir di jalur 6.x (6.7.21) sudah tidak dikembangkan lagi.
// Tergantung environment/versi apa yang benar-benar ke-install di server,
// default export bisa muncul dalam 3 bentuk berbeda:
//   1) function-nya langsung (yang diharapkan kode ini)
//   2) object pembungkus berbentuk { default: fn, ...named lainnya }
//   3) seluruh module.exports dengan makeWASocket sebagai salah satu
//      propertinya, bukan default export itu sendiri
// Named import lain (fetchLatestBaileysVersion, dkk) tetap bekerja normal
// karena Node bisa mendeteksi named export secara statis — hanya default
// export yang ambigu. Helper ini menormalkan ketiga kemungkinan itu jadi
// satu, supaya index.js & lib/childBot.js sama-sama aman dipakai TANPA
// peduli bentuk apa yang ke-install.
//
// PENTING: ini adalah jaring pengaman, BUKAN pengganti fix utama. Fix utama
// tetap: kunci versi di package.json ke versi stabil yang benar-benar ada
// di registry (lihat catatan di package.json), lalu install ulang bersih:
//   rm -rf node_modules package-lock.json && npm install
import baileysPkg from '@whiskeysockets/baileys';

export const makeWASocket =
    typeof baileysPkg === 'function' ? baileysPkg :
    baileysPkg && typeof baileysPkg.default === 'function' ? baileysPkg.default :
    baileysPkg && typeof baileysPkg.makeWASocket === 'function' ? baileysPkg.makeWASocket :
    undefined;

if (typeof makeWASocket !== 'function') {
    throw new Error(
        '[FATAL] @whiskeysockets/baileys ter-install tapi tidak mengekspos makeWASocket ' +
        'sebagai function di environment ini (kemungkinan versi RC 7.x yang belum stabil, ' +
        'atau instalasi rusak/setengah jalan).\n' +
        'Perbaikan:\n' +
        '  1) Di Console panel, jalankan:\n' +
        '     rm -rf node_modules package-lock.json\n' +
        '     npm install\n' +
        '  2) Pastikan package.json mengunci "@whiskeysockets/baileys" ke versi stabil ' +
        'yang persis (bukan pakai ^ / ~), misalnya "6.7.21" — cek versi valid terbaru di ' +
        'https://www.npmjs.com/package/@whiskeysockets/baileys?activeTab=versions sebelum deploy.'
    );
}
