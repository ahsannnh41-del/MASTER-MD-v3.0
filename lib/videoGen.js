// ═══════════════════════════════════════════════════════════════════
//  VIDEOGEN.JS — Konversi gambar (hasil fetch API brat remote) jadi
//  sticker WebP statis untuk .brat/.bratgreen/.bratwhite via ffmpeg.
//
//  CATATAN (2026-07-07): dulu file ini juga menyusun frame PNG jadi
//  video MP4 looping untuk .bratvid — fungsi itu (concatClipsToAnimatedWebp,
//  isVideoGenAvailable, framesToMp4) sudah dihapus bersama .bratvid.
//
//  Pakai package `ffmpeg-static` (BUKAN `sharp`/native build) — paket
//  ini cuma download binary ffmpeg yang sudah dikompilasi sesuai OS
//  saat `npm install`, tanpa perlu compiler/toolchain apapun di server,
//  jadi tetap aman dipakai di Pterodactyl. Kalau package ini belum
//  di-install (belum ada di package.json/node_modules), fungsi di
//  bawah ini akan gagal dengan rapi (try/catch di pemanggil) — TIDAK
//  bikin bot crash — supaya konsisten dengan gaya defensif yang sudah
//  dipakai di seluruh project ini (lihat mediaCommands.js/quoteAsSticker
//  yang juga menjelaskan dengan jelas kalau sebuah fitur butuh dependency
//  tambahan yang belum aktif).
//
//  v3.2.1 — DUKUNGAN TERMUX/ANDROID: binary yang di-download `ffmpeg-static`
//  dikompilasi untuk Linux glibc biasa dan TIDAK BISA JALAN di Termux
//  (Android pakai Bionic libc, bukan glibc) — walau npm install-nya
//  sendiri tetap sukses tanpa error. Supaya bot tetap bisa proses
//  video/frame di Termux, resolveFfmpegPath() sekarang fallback ke
//  ffmpeg SISTEM (dari PATH) kalau binary ffmpeg-static ternyata tidak
//  ada/tidak valid. Di Termux, tinggal `pkg install ffmpeg` sekali dan
//  fallback ini otomatis dipakai — tidak perlu setting tambahan apa pun.
//  Fallback ini juga berguna di VPS/Pterodactyl manapun yang kebetulan
//  sudah punya ffmpeg sistem tapi download binary ffmpeg-staticnya gagal
//  (mis. karena proxy/firewall memblokir GitHub releases saat npm install).
// ═══════════════════════════════════════════════════════════════════

import { spawn, execSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

let cachedFfmpegPath; // null = sudah dicek & TIDAK ada; undefined = belum dicek
export function resolveFfmpegPath() {
    if (cachedFfmpegPath !== undefined) return cachedFfmpegPath;

    // 1) Coba ffmpeg-static dulu — jalan tanpa setup tambahan di kebanyakan
    //    VPS/Pterodactyl (Linux glibc), macOS, dan Windows.
    try {
        // ffmpeg-static adalah package CommonJS — pakai createRequire supaya
        // bisa di-import dari modul ESM ini.
        const staticPath = require('ffmpeg-static');
        if (staticPath && fs.existsSync(staticPath)) {
            cachedFfmpegPath = staticPath;
            return cachedFfmpegPath;
        }
    } catch {
        // package belum terinstall sama sekali — lanjut ke fallback di bawah
    }

    // 2) Fallback: ffmpeg SISTEM dari PATH. INI YANG DIPAKAI DI TERMUX
    //    (setelah `pkg install ffmpeg`) — lihat catatan v3.2.1 di atas.
    try {
        const systemPath = execSync('command -v ffmpeg', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
        if (systemPath && fs.existsSync(systemPath)) {
            cachedFfmpegPath = systemPath;
            return cachedFfmpegPath;
        }
    } catch {
        // ffmpeg sistem juga tidak ditemukan
    }

    cachedFfmpegPath = null;
    return cachedFfmpegPath;
}

export function runFfmpeg(args) {
    const ffmpegPath = resolveFfmpegPath();
    if (!ffmpegPath) {
        return Promise.reject(new Error(
            "ffmpeg tidak ditemukan. Jalankan: npm install ffmpeg-static — atau, kalau di Termux/Android " +
            '(binary ffmpeg-static tidak jalan di sana), install ffmpeg sistem dengan: pkg install ffmpeg — ' +
            'lalu restart bot.'
        ));
    }
    return new Promise((resolve, reject) => {
        const proc = spawn(ffmpegPath, args);
        let stderr = '';
        proc.stderr.on('data', (d) => { stderr += d.toString(); });
        proc.on('error', reject);
        proc.on('close', (code) => {
            if (code === 0) resolve();
            else reject(new Error(`ffmpeg keluar dengan kode ${code}: ${stderr.slice(-500)}`));
        });
    });
}

/**
 * Konversi SATU gambar (buffer PNG/JPEG apapun, mis. hasil fetch dari API
 * brat eksternal) jadi sticker WebP statis 512x512 — dipakai bratCommands.js
 * supaya tidak perlu dependency `sharp`/`canvas` untuk konversi format,
 * cukup ffmpeg yang sudah ada.
 * @param {Buffer} imageBuffer
 * @returns {Promise<Buffer>} buffer WebP siap kirim sebagai sticker
 */
export async function imageToWebpSticker(imageBuffer) {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'brat-img-'));
    try {
        const inputPath = path.join(tmpDir, 'input.img');
        const outputPath = path.join(tmpDir, 'output.webp');
        fs.writeFileSync(inputPath, imageBuffer);

        await runFfmpeg([
            '-y',
            '-i', inputPath,
            '-vf', 'scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=white@0.0',
            outputPath,
        ]);

        return fs.readFileSync(outputPath);
    } finally {
        try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch { /* ignore */ }
    }
}

// CATATAN (2026-07-07): concatClipsToAnimatedWebp(), isVideoGenAvailable(),
// dan framesToMp4() sudah DIHAPUS dari sini — ketiganya cuma dipakai oleh
// .bratvid (variant video/animasi brat), yang sudah dihapus. imageToWebpSticker()
// di atas (dipakai .brat/.bratgreen/.bratwhite) tidak terpengaruh — dia
// tetap butuh resolveFfmpegPath()/runFfmpeg() di atas, jadi keduanya tetap ada.
