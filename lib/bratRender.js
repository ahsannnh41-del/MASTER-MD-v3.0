// ═══════════════════════════════════════════════════════════════════
//  BRATRENDER.JS — generate gambar brat SECARA LOKAL pakai ffmpeg
//
//  FIX (2026-07-24): brat.siputzx.my.id (satu-satunya sumber gambar
//  brat sebelumnya) mati — HTTP 530 (Cloudflare "origin unreachable").
//  Ini API pihak ketiga KEDUA yang mati (sebelumnya api-faa.my.id).
//  Daripada gali API pengganti yang besar kemungkinan bakal mati lagi
//  juga di masa depan, gambar brat sekarang di-render LANGSUNG di sini
//  pakai ffmpeg (sudah jadi dependency project ini lewat ffmpeg-static,
//  dipakai juga oleh lib/videoGen.js) — jadi TIDAK butuh internet/API
//  luar sama sekali buat fitur ini. Teknik: canvas warna solid (lavfi
//  color source) + filter drawtext, teks di-wrap & ukuran font
//  di-auto-fit di JS dulu sebelum dikasih ke ffmpeg (drawtext sendiri
//  tidak punya word-wrap otomatis).
// ═══════════════════════════════════════════════════════════════════

import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { runFfmpeg } from './videoGen.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// FIX (2026-07-24, lanjutan): render pertama sempat gagal di beberapa host
// dengan error persis:
//   "ffmpeg exit 1: ...text_align=C' / Error reinitializing filters! /
//    Failed to inject frame into filter network: Option not found"
// Sebabnya: kode di bawah sebelumnya manggil `spawn('ffmpeg', args)` —
// ffmpeg SISTEM apa adanya dari PATH, bukan lewat resolveFfmpegPath()/
// runFfmpeg() yang sudah ada di lib/videoGen.js (dipakai imageToWebpSticker
// di file yang sama, lihat juga bagian akhir file ini). Opsi drawtext
// `text_align` baru ada mulai FFmpeg 4.4 (2021) — kalau ffmpeg sistem di
// host lebih lama dari itu (banyak base image Pterodactyl/VPS masih bawa
// versi lama dari repo distro), opsi ini persis dianggap "Option not
// found". runFfmpeg() lebih diandalkan: dia utamakan binary dari
// ffmpeg-static (dependency project ini juga, biasanya jauh lebih baru)
// dan baru fallback ke ffmpeg sistem kalau itu benar-benar tidak ada.

// FIX (2026-07-24, lanjutan lagi — INI PENYEBAB "masih rusak" setelah fix
// ffmpeg di atas): findFontPath() sebelumnya HANYA mengandalkan FONT_CANDIDATES
// di bawah — semuanya path font yang harus SUDAH terinstall di OS (paket
// fonts-liberation/fonts-dejavu-core/dst lewat apt/apk). Base image Node.js
// yang dipakai kebanyakan Pterodactyl egg itu minimal — TIDAK ada satupun
// paket font ter-install by default. Hasilnya: findFontPath() balik null
// di hampir semua host, renderBratImage() langsung throw "Font Bold sistem
// tidak ketemu" — SETIAP KALI, apapun teksnya. Ini kenapa cuma ganti ke
// ffmpeg lokal (fix sebelumnya) belum cukup, dan juga PERSIS kenapa bot lain
// (mis. Alya) kelihatan "jalan aja" — dia bawa font sendiri di dalam project-
// nya (assets/fonts/), bukan gantung ke font sistem sama sekali.
// Fix di sini: pola yang sama, bukan nyalin kode Alya — font Liberation Sans
// Bold (lisensi SIL Open Font License 1.1, bebas dibundel) sekarang ikut
// dikirim di dalam project ini sendiri (media/fonts/), dicek PALING DULU
// lewat path relatif ke file ini (__dirname, bukan process.cwd() — supaya
// tetap ketemu walau bot dijalankan dari direktori lain). FONT_CANDIDATES
// sistem di bawah tetap dipertahankan sebagai fallback tambahan (tidak
// merugikan, cuma tidak lagi jadi satu-satunya sumber).
const BUNDLED_FONT_PATH = path.join(__dirname, '../media/fonts/LiberationSans-Bold.ttf');

const FONT_CANDIDATES = [
    '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf',
    '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
    '/usr/share/fonts/truetype/msttcorefonts/Arial_Bold.ttf',
    '/usr/share/fonts/truetype/noto/NotoSans-Bold.ttf',
    '/usr/share/fonts/TTF/DejaVuSans-Bold.ttf',
];

let _cachedFontPath = null;
function findFontPath() {
    if (_cachedFontPath) return _cachedFontPath;
    if (fs.existsSync(BUNDLED_FONT_PATH)) {
        _cachedFontPath = BUNDLED_FONT_PATH;
        return _cachedFontPath;
    }
    for (const candidate of FONT_CANDIDATES) {
        if (fs.existsSync(candidate)) {
            _cachedFontPath = candidate;
            return candidate;
        }
    }
    return null; // ditangani di renderBratImage() — lempar error yang jelas
}

// ── Word-wrap teks brat jadi beberapa baris ────────────────────────
function wrapBratText(text, maxCharsPerLine) {
    const words = text.split(/\s+/).filter(Boolean);
    const lines = [];
    let current = '';
    for (const word of words) {
        const candidate = current ? `${current} ${word}` : word;
        if (candidate.length > maxCharsPerLine && current) {
            lines.push(current);
            current = word;
        } else {
            current = candidate;
        }
    }
    if (current) lines.push(current);
    return lines.length ? lines : [text];
}

// ── Cari ukuran font terbesar yang masih muat di kanvas ────────────
// (perkiraan lebar karakter rata-rata, bukan pengukuran font presisi
// — cukup buat sticker teks pendek/sedang kayak pemakaian brat pada
// umumnya. Kalau teksnya kepanjangan banget, berhenti di ukuran
// minimum & biarkan sedikit rapat daripada infinite loop.)
function computeBratLayout(text, canvasSize) {
    const padding = Math.round(canvasSize * 0.08);
    const usableWidth = canvasSize - padding * 2;
    const usableHeight = canvasSize - padding * 2;
    const CHAR_W = 0.58; // rasio lebar-rata2/fontsize buat sans bold
    let fontSize = Math.round(canvasSize * 0.2);
    const minFontSize = Math.round(canvasSize * 0.045);
    let lines = [text];
    while (fontSize > minFontSize) {
        const maxCharsPerLine = Math.max(1, Math.floor(usableWidth / (fontSize * CHAR_W)));
        lines = wrapBratText(text, maxCharsPerLine);
        const lineHeight = fontSize * 1.15;
        const totalHeight = lines.length * lineHeight;
        const widestLine = Math.max(...lines.map(l => l.length));
        const widestLineWidth = widestLine * fontSize * CHAR_W;
        if (totalHeight <= usableHeight && widestLineWidth <= usableWidth) break;
        fontSize -= Math.max(2, Math.round(canvasSize * 0.008));
    }
    return { fontSize, lines };
}

// ── Render gambar brat → mengembalikan Buffer PNG ──────────────────
export async function renderBratImage(text, { bg = 'ffffff', color = '000000', size = 512 } = {}) {
    const fontPath = findFontPath();
    if (!fontPath) {
        // Seharusnya nyaris tidak pernah kena sekarang — font sudah dibundel
        // langsung di media/fonts/ (lihat BUNDLED_FONT_PATH di atas). Kalau
        // tetap muncul, berarti file font itu hilang/ke-delete dari project.
        throw new Error(
            `Font tidak ketemu — file media/fonts/LiberationSans-Bold.ttf hilang dari project ` +
            `(cek folder media/fonts/ ada isinya atau tidak), dan fallback font sistem juga tidak ada.`
        );
    }

    const clean = (text || '').toLowerCase().trim().replace(/\n+/g, ' ');
    if (!clean) throw new Error('Teks kosong.');

    const { fontSize, lines } = computeBratLayout(clean, size);

    const tmpDir = os.tmpdir();
    const tmpTxt = path.join(tmpDir, `brat_${Date.now()}_${Math.random().toString(36).slice(2)}.txt`);
    const tmpOut = path.join(tmpDir, `brat_${Date.now()}_${Math.random().toString(36).slice(2)}.png`);
    // Pakai textfile= (bukan text=) supaya isi teks (bisa mengandung
    // tanda kutip/titik dua/dll dari user) tidak perlu di-escape manual
    // buat filtergraph ffmpeg — dibaca apa adanya dari file, baris baru
    // di file otomatis jadi baris baru di gambar.
    fs.writeFileSync(tmpTxt, lines.join('\n'), 'utf-8');

    // Blur tipis buat kesan "lo-fi" ala brat asli, tapi cukup halus
    // supaya teks tetap kebaca jelas di ukuran sticker kecil.
    // text_align=C bikin tiap baris teks center relatif ke baris lain
    // (bukan cuma center blok totalnya) — penting kalau baris hasil
    // word-wrap panjangnya beda-beda. buildVf(false) (tanpa opsi ini)
    // dipakai sebagai fallback SEKALI kalau ffmpeg yang kepakai ternyata
    // versi lama yang belum kenal opsi ini (lihat catatan FIX di atas).
    const buildVf = (withAlign) => [
        `drawtext=fontfile='${fontPath}':textfile='${tmpTxt}':`
        + `fontsize=${fontSize}:fontcolor=0x${color}:`
        + `x=(w-text_w)/2:y=(h-text_h)/2:line_spacing=6`
        + (withAlign ? ':text_align=C' : ''),
        'gblur=sigma=0.4',
    ].join(',');

    const buildArgs = (vf) => [
        '-y',
        '-f', 'lavfi', '-i', `color=c=0x${bg}:s=${size}x${size}`,
        '-vf', vf,
        '-frames:v', '1', '-update', '1',
        tmpOut,
    ];

    try {
        try {
            await runFfmpeg(buildArgs(buildVf(true)));
        } catch (err) {
            if (/text_align|option not found/i.test(err.message)) {
                await runFfmpeg(buildArgs(buildVf(false)));
            } else {
                throw err;
            }
        }
    } finally {
        try { fs.unlinkSync(tmpTxt); } catch { /* abaikan */ }
    }

    try {
        const buf = fs.readFileSync(tmpOut);
        return buf;
    } finally {
        try { fs.unlinkSync(tmpOut); } catch { /* abaikan */ }
    }
}
