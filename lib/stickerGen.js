// ═══════════════════════════════════════════════════════════════════
//  STICKERGEN.JS — Encode buffer RGBA mentah jadi sticker WebP asli
//
//  PENTING — kenapa tidak menulis encoder WebP sendiri dari nol (seperti
//  PNG encoder di imageGen.js): format WebP (VP8L) punya bitstream entropy
//  coding (Huffman + LZ77 + beberapa transform) yang kompleks. Menulis ini
//  dari nol beresiko tinggi menghasilkan file yang LOLOS tes round-trip
//  sendiri tapi tetap GAGAL/corrupt di pembaca WebP asli (WhatsApp) — ini
//  bukan asumsi, ini kejadian nyata yang didokumentasikan orang lain yang
//  pernah mencoba (butuh berhari-hari mencari 3 bug halus: 1 bit yang
//  hilang, off-by-one di Huffman tree, tabel jarak yang terbalik).
//
//  Karena itu, modul ini memakai `webp-wasm` — package yang membungkus
//  `libwebp` ASLI (dikompilasi Google sendiri) jadi WebAssembly. Ini BUKAN
//  encoder buatan sendiri, jadi hasilnya dijamin valid sesuai spesifikasi
//  WebP, sama seperti yang dipakai Chrome/aplikasi resmi lainnya. Tidak
//  butuh compiler/toolchain native apapun saat `npm install` (beda dengan
//  `sharp`), jadi tetap aman dipasang di Pterodactyl.
// ═══════════════════════════════════════════════════════════════════

import { createRequire } from 'module';

const require = createRequire(import.meta.url);

let cachedWebp; // null = sudah dicek & TIDAK ada; undefined = belum dicek
function resolveWebp() {
    if (cachedWebp !== undefined) return cachedWebp;
    try {
        cachedWebp = require('webp-wasm');
    } catch {
        cachedWebp = null;
    }
    return cachedWebp;
}

export function isStickerGenAvailable() {
    return !!resolveWebp();
}

/**
 * Encode buffer RGBA mentah (Uint8Array/Buffer, urutan baris atas->bawah,
 * 4 byte per piksel) jadi WebP lossless — siap dikirim sebagai sticker
 * lewat Baileys: sock.sendMessage(jid, { sticker: webpBuffer }).
 *
 * @param {Buffer|Uint8Array} rgba - piksel RGBA mentah
 * @param {number} width
 * @param {number} height
 * @returns {Promise<Buffer>} buffer WebP (lossless)
 */
export async function rgbaToWebpSticker(rgba, width, height) {
    const webp = resolveWebp();
    if (!webp) {
        throw new Error(
            "Package 'webp-wasm' belum terinstall. Jalankan: npm install webp-wasm — " +
            'lalu restart bot untuk mengaktifkan sticker.'
        );
    }

    // webp-wasm mengharapkan objek mirip ImageData browser (data/width/
    // height). Library ini sendiri yang men-polyfill `global.ImageData`
    // kalau belum ada, jadi kita tinggal pakai itu langsung.
    if (!('ImageData' in globalThis)) {
        // Jaga-jaga kalau load order beda — definisikan minimal di sini juga.
        globalThis.ImageData = class ImageData {
            constructor(data, w, h) { this.data = data; this.width = w; this.height = h; }
        };
    }
    const imgData = new globalThis.ImageData(
        rgba instanceof Uint8ClampedArray ? rgba : new Uint8ClampedArray(rgba),
        width,
        height,
    );

    // quality di sini adalah "effort kompresi" untuk mode lossless (0-100,
    // bukan kualitas visual — losslessnya tetap piksel-perfect). Pakai 100
    // karena gambar brat/iqc kita kecil & sederhana (dominan 2 warna),
    // jadi waktu encode tetap cepat walau effort maksimal.
    const result = await webp.encode(imgData, { lossless: 1, quality: 100 });
    return Buffer.from(result);
}

// CATATAN (2026-07-07): fungsi sticker WebP ANIMASI (dulu di sini, pakai
// package `wasm-webp`) sudah DIHAPUS bersamaan dengan .bratvid — itu
// satu-satunya command yang memakainya. Sticker statis (non-animasi) di
// atas (rgbaToWebpSticker, pakai `webp-wasm`) tidak terpengaruh.
