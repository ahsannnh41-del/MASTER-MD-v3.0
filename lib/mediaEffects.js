// ═══════════════════════════════════════════════════════════════════
//  MEDIAEFFECTS.JS — Transformasi media (gambar/video/audio) via ffmpeg
//  Reuse resolveFfmpegPath()/runFfmpeg() dari lib/videoGen.js — supaya
//  1 sumber ffmpeg binary yang sama dipakai di seluruh project.
// ═══════════════════════════════════════════════════════════════════

import fs from 'fs';
import os from 'os';
import path from 'path';
import { runFfmpeg } from './videoGen.js';

async function runTransform(inputBuffer, inputExt, outputExt, ffmpegArgs) {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gojo-media-'));
    try {
        const inputPath = path.join(tmpDir, `input.${inputExt}`);
        const outputPath = path.join(tmpDir, `output.${outputExt}`);
        fs.writeFileSync(inputPath, inputBuffer);
        await runFfmpeg(['-y', '-i', inputPath, ...ffmpegArgs, outputPath]);
        return fs.readFileSync(outputPath);
    } finally {
        try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch {}
    }
}

export async function toGrayscale(buffer, ext = 'jpg') {
    return runTransform(buffer, ext, ext, ['-vf', 'hue=s=0']);
}

export async function mirrorHorizontal(buffer, ext = 'jpg') {
    return runTransform(buffer, ext, ext, ['-vf', 'hflip']);
}

export async function blurMedia(buffer, ext = 'jpg') {
    return runTransform(buffer, ext, ext, ['-vf', 'gblur=sigma=15']);
}

export async function rotateMedia(buffer, ext, degrees) {
    // ffmpeg transpose: 1=90° CW, 2=90° CCW. Untuk 180°, transpose 2x.
    const filter = degrees === 90 ? 'transpose=1'
        : degrees === 270 ? 'transpose=2'
        : 'transpose=2,transpose=2'; // 180
    return runTransform(buffer, ext, ext, ['-vf', filter]);
}

export async function changeVideoSpeed(buffer, factor) {
    // factor 2 = 2x lebih cepat, 0.5 = setengah kecepatan (slow motion)
    const videoFilter = `setpts=${(1 / factor).toFixed(3)}*PTS`;
    const audioFilter = `atempo=${Math.min(Math.max(factor, 0.5), 2).toFixed(3)}`;
    return runTransform(buffer, 'mp4', 'mp4', ['-vf', videoFilter, '-af', audioFilter]);
}

export async function muteVideo(buffer) {
    return runTransform(buffer, 'mp4', 'mp4', ['-c', 'copy', '-an']);
}

export async function extractAudio(buffer) {
    return runTransform(buffer, 'mp4', 'mp3', ['-vn', '-acodec', 'libmp3lame', '-q:a', '2']);
}

export async function adjustVolume(buffer, factor) {
    return runTransform(buffer, 'mp3', 'mp3', ['-af', `volume=${factor}`]);
}

export async function trimMedia(buffer, ext, startSec, durationSec) {
    return runTransform(buffer, ext, ext, ['-ss', String(startSec), '-t', String(durationSec), '-c', 'copy']);
}

export async function applySepia(buffer, ext = 'jpg') {
    return runTransform(buffer, ext, ext, ['-vf', 'colorchannelmixer=.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131']);
}

export async function invertColors(buffer, ext = 'jpg') {
    return runTransform(buffer, ext, ext, ['-vf', 'negate']);
}

export async function pixelateMedia(buffer, ext = 'jpg') {
    return runTransform(buffer, ext, ext, ['-vf', 'scale=32:32:flags=neighbor,scale=512:512:flags=neighbor']);
}

export async function adjustBrightness(buffer, ext, amount) {
    // amount: -1.0 (paling gelap) sampai 1.0 (paling terang), 0 = tanpa perubahan
    return runTransform(buffer, ext, ext, ['-vf', `eq=brightness=${amount}`]);
}

export async function reverseVideo(buffer) {
    return runTransform(buffer, 'mp4', 'mp4', ['-vf', 'reverse', '-af', 'areverse']);
}

export async function flipVertical(buffer, ext = 'jpg') {
    return runTransform(buffer, ext, ext, ['-vf', 'vflip']);
}

export async function squareCrop(buffer, ext = 'jpg') {
    return runTransform(buffer, ext, ext, ['-vf', "crop='min(iw,ih)':'min(iw,ih)'"]);
}

export async function addWatermark(buffer, ext, text) {
    // Escape karakter spesial supaya tidak merusak ffmpeg drawtext filter
    const safeText = text.replace(/[:'\\]/g, '');
    return runTransform(buffer, ext, ext, [
        '-vf', `drawtext=text='${safeText}':fontcolor=white@0.7:fontsize=24:x=10:y=h-th-10:box=1:boxcolor=black@0.4`,
    ]);
}

// FIX (2026-07-24): fitur baru .hd — upscale 2x (interpolasi Lanczos,
// kualitas terbaik yang tersedia di ffmpeg) + unsharp mask buat
// nge-tajemin detail yang biasanya jadi lembek gara-gara upscale.
// Bukan AI super-resolution (project ini tidak punya model ML), tapi
// hasilnya tetap terasa "lebih HD" — dan yang penting 100% lokal via
// ffmpeg, tidak gantung ke API pihak ketiga (pelajaran dari .brat yang
// baru saja diperbaiki gara-gara API luar mati).
//
// FIX 2 (2026-07-24): laporan "hd kayak ga berubah" — ternyata cap-nya
// (dulu 2048) nabrak sendiri sama faktor 2x-nya. min(iw*2, CAP) cuma
// beneran 2x kalau iw < CAP/2 (dulu: < 1024px). Foto WA itu HAMPIR
// SELALU sudah >1024px di sisi terpanjang (kompresi WA standar aja
// biasanya masih di kisaran ~1280-1600px, apalagi kalau pengirim aktifin
// toggle "Kualitas HD" bawaan WhatsApp) — jadi buat kebanyakan foto asli,
// cap lama ini diam-diam MEMOTONG faktor 2x jadi cuma naik dikit (mis.
// iw=1600 → cuma jadi 2048, naik 28%, bukan 2x), dan buat foto yang
// lebar awalnya sudah >=2048px, hasilnya PERSIS SAMA UKURAN — kelihatan
// "ga berubah" sama sekali (cuma unsharp-nya doang yang kepakai, efeknya
// halus). Cap dinaikkan ke 4096 (2x dari cap lama) supaya 2x beneran
// kepakai penuh untuk rentang ukuran foto WA yang realistis; unsharp
// juga dinaikkan dikit (0.8→1.3 luma) supaya efeknya tetap kerasa lebih
// "pop" walau nanti gambar dikompres ulang sama WhatsApp saat dikirim
// sebagai foto biasa (ini keterbatasan platform WA, di luar kendali kode
// di sini — bukan tanda upscale-nya gagal).
export async function upscaleHD(buffer, ext = 'jpg') {
    return runTransform(buffer, ext, ext, [
        '-vf', "scale=w=min(iw*2\\,4096):h=min(ih*2\\,4096):force_original_aspect_ratio=decrease:flags=lanczos,unsharp=5:5:1.3:5:5:0.0",
        '-q:v', '2',
    ]);
}
