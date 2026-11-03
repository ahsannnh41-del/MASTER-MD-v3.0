// ═══════════════════════════════════════════════════════════════════
//  NSFWDETECTOR.JS — Deteksi konten dewasa (NSFW) pada gambar/video
//  Dipakai oleh:
//    - features/antiNsfw.js       (proteksi otomatis .antinsfw on/off)
//    - commands/nsfwAdminCommands.js (command manual .hapusnsfw dkk)
//
//  ARSITEKTUR: sengaja dibuat "pluggable" lewat settings.nsfwDetection
//  di setting.js — supaya kalau provider default (PixLab) suatu saat
//  berubah/down/kuotanya habis, Owner bisa ganti provider TANPA bongkar
//  features/antiNsfw.js sama sekali. Cukup:
//    a) isi settings.nsfwDetection.customApiUrl kalau punya API sejenis
//       (kontrak minimalnya ada di komentar callCustomProvider di bawah), atau
//    b) edit langsung fungsi callPixlab()/callCustomProvider() di file ini.
//
//  PROVIDER DEFAULT: PixLab NSFW Detection API
//    - Endpoint publik & terdokumentasi resmi: https://pixlab.io/endpoints/nsfw
//    - Butuh API key GRATIS: daftar di https://console.pixlab.io lalu ambil
//      key dari dashboard, isi ke settings.nsfwDetection.apiKey di setting.js
//      (atau ENV NSFW_API_KEY, lebih aman kalau setting.js pernah dibagikan
//      ke orang lain).
//    - Respons API: { status: 200, score: 0.0–1.0 } — makin dekat ke 1.0,
//      makin besar kemungkinan kontennya dewasa/eksplisit.
//
//  ⚠️ CATATAN JUJUR: ini API pihak ketiga gratis — bisa saja suatu saat
//  berubah kuota/format/URL-nya. Makanya SELURUH fungsi di file ini
//  menganut prinsip "FAIL-OPEN": kalau API key belum diisi, request
//  timeout, provider error, atau responsnya di luar dugaan — fungsi
//  SELALU balikin { checked: false }, TIDAK PERNAH melempar exception ke
//  pemanggil. features/antiNsfw.js WAJIB memperlakukan checked:false
//  sebagai "tidak yakin" dan TIDAK BOLEH menghapus pesan orang berdasarkan
//  ketidakpastian itu — supaya fitur ini tidak akan pernah salah-hapus
//  media orang atau bikin bot kelihatan rusak hanya gara-gara API
//  eksternal lagi bermasalah. Selama API belum di-setup, admin masih
//  tetap bisa pakai `.hapusnsfw` (hapus manual, tidak butuh API sama
//  sekali) — lihat features/antiNsfw.js.
// ═══════════════════════════════════════════════════════════════════

import fs from 'fs';
import os from 'os';
import path from 'path';
import { resolveFfmpegPath, runFfmpeg } from './videoGen.js';
import { log } from './logger.js';
import settings from '../setting.js';

const DEFAULT_TIMEOUT_MS = 15_000;
const DEFAULT_THRESHOLD  = 0.6;
// Buffer di atas ukuran ini DILEWATI (fail-open), bukan dipaksa diproses —
// menjaga bot tetap ringan & tidak OOM gara-gara video/gambar raksasa.
const MAX_BUFFER_BYTES = 15 * 1024 * 1024; // 15MB

function cfg() {
    const c = settings.nsfwDetection || {};
    const apiKey = process.env.NSFW_API_KEY || c.apiKey || '';
    return {
        apiKey,
        customApiUrl: c.customApiUrl || '',
        threshold:    typeof c.threshold === 'number' ? c.threshold : DEFAULT_THRESHOLD,
        timeoutMs:    c.timeoutMs || DEFAULT_TIMEOUT_MS,
    };
}

// Dipakai command/help supaya bisa kasih tahu admin dengan jelas kalau
// API belum di-setup, alih-alih diam saja tanpa penjelasan.
export function isNsfwDetectionConfigured() {
    const c = cfg();
    return Boolean(c.apiKey || c.customApiUrl);
}

// ─── AMBIL 1 FRAME STATIS DARI VIDEO / STIKER ANIMASI ─────────────────────
// Video & stiker animasi tidak bisa langsung dikirim ke API deteksi gambar,
// jadi diambil 1 frame representatif dulu pakai ffmpeg-static yang SUDAH
// ada di project ini (lib/videoGen.js) — TIDAK menambah dependency baru.
// Kalau ffmpeg-static belum ke-install di server, return null dengan rapi
// (pemanggil akan skip pengecekan, BUKAN bikin bot crash).
export async function extractStillFrame(buffer, hintExt = 'mp4') {
    if (!resolveFfmpegPath()) return null;
    let tmpDir;
    try {
        tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'nsfw-frame-'));
        const inputPath  = path.join(tmpDir, `input.${hintExt}`);
        const outputPath = path.join(tmpDir, 'frame.jpg');
        fs.writeFileSync(inputPath, buffer);
        // -ss 0.2: ambil frame sedikit setelah detik ke-0 (menghindari frame
        // hitam/kosong yang sering muncul di awal video). -frames:v 1: cuma
        // ambil 1 gambar saja.
        await runFfmpeg(['-y', '-ss', '0.2', '-i', inputPath, '-frames:v', '1', '-q:v', '3', outputPath]);
        if (!fs.existsSync(outputPath)) return null;
        return fs.readFileSync(outputPath);
    } catch (err) {
        log.error(`nsfwDetector: gagal extract frame — ${err.message}`);
        return null;
    } finally {
        if (tmpDir) { try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch { /* diamkan */ } }
    }
}

// ─── PROVIDER: PIXLAB (default) ───────────────────────────────────────────
async function callPixlab(buffer, apiKey, timeoutMs) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        // FormData & Blob di sini adalah bawaan global Node.js (tersedia
        // sejak Node 18+, sama seperti requirement "engines" project ini).
        // Sengaja pakai fetch bawaan (BUKAN axios) khusus untuk request
        // multipart ini, karena axios di Node butuh package tambahan
        // (form-data) supaya kompatibel penuh dengan Buffer biner — fetch
        // bawaan sudah beres tanpa dependency ekstra apa pun. axios tetap
        // dipakai apa adanya di semua bagian lain project ini.
        const form = new FormData();
        form.append('key', apiKey);
        form.append('img', new Blob([buffer]), 'check.jpg');

        const res  = await fetch('https://api.pixlab.io/nsfw', {
            method: 'POST',
            body:   form,
            signal: controller.signal,
        });
        const data = await res.json().catch(() => null);

        if (!data || typeof data.score !== 'number') {
            log.error(`nsfwDetector: respons PixLab di luar dugaan — ${JSON.stringify(data)}`);
            return { checked: false };
        }
        if (data.status && data.status !== 200) {
            log.error(`nsfwDetector: PixLab balas error (status ${data.status}) — ${data.error || 'tanpa pesan'}`);
            return { checked: false };
        }
        return { checked: true, score: data.score };
    } catch (err) {
        log.error(`nsfwDetector: request ke PixLab gagal — ${err.message}`);
        return { checked: false };
    } finally {
        clearTimeout(timer);
    }
}

// ─── PROVIDER: CUSTOM (opsional) ──────────────────────────────────────────
// Kontrak minimal yang diharapkan dari provider custom (kalau Owner isi
// settings.nsfwDetection.customApiUrl dengan API sejenis buatan sendiri
// atau API lain): terima POST multipart/form-data dengan field `img`
// (file) dan `key` (API key, opsional), lalu balas JSON { score: 0..1 }.
// Kalau format API pilihanmu beda, tinggal sesuaikan fungsi ini saja —
// tidak perlu ubah features/antiNsfw.js sama sekali.
async function callCustomProvider(buffer, apiUrl, apiKey, timeoutMs) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const form = new FormData();
        if (apiKey) form.append('key', apiKey);
        form.append('img', new Blob([buffer]), 'check.jpg');

        const res  = await fetch(apiUrl, { method: 'POST', body: form, signal: controller.signal });
        const data = await res.json().catch(() => null);
        if (!data || typeof data.score !== 'number') {
            log.error(`nsfwDetector: respons custom provider di luar dugaan — ${JSON.stringify(data)}`);
            return { checked: false };
        }
        return { checked: true, score: data.score };
    } catch (err) {
        log.error(`nsfwDetector: request ke custom provider gagal — ${err.message}`);
        return { checked: false };
    } finally {
        clearTimeout(timer);
    }
}

/**
 * Cek satu buffer gambar statis (JPEG/PNG/WebP).
 * @param {Buffer} buffer
 * @returns {Promise<{checked:false}|{checked:true,isNsfw:boolean,score:number}>}
 *   checked:false  → tidak bisa/tidak sempat dicek (fail-open — JANGAN
 *                    pernah hapus pesan orang atau kasih strike hanya
 *                    berdasarkan hasil ini).
 *   checked:true   → hasil valid dari provider, aman dipakai ambil keputusan.
 */
export async function checkNsfwBuffer(buffer) {
    const c = cfg();
    if (!buffer || !buffer.length) return { checked: false };
    if (buffer.length > MAX_BUFFER_BYTES) return { checked: false };
    if (!c.apiKey && !c.customApiUrl) return { checked: false };

    const result = c.customApiUrl
        ? await callCustomProvider(buffer, c.customApiUrl, c.apiKey, c.timeoutMs)
        : await callPixlab(buffer, c.apiKey, c.timeoutMs);

    if (!result.checked) return { checked: false };
    return { checked: true, isNsfw: result.score >= c.threshold, score: result.score };
}

/**
 * Helper level-tinggi: terima buffer MENTAH apa pun (gambar/video/stiker)
 * beserta tipenya, urus sendiri ekstraksi frame kalau perlu, lalu balikin
 * hasil deteksi. Ini fungsi yang sebaiknya dipanggil dari luar (bukan
 * checkNsfwBuffer langsung) supaya logika "video/stiker animasi harus
 * diubah ke gambar statis dulu" tidak perlu diulang di banyak tempat.
 * @param {Buffer} buffer
 * @param {'image'|'sticker'|'video'|'gif'} mediaType
 */
export async function checkNsfwMedia(buffer, mediaType) {
    if (!buffer || !buffer.length) return { checked: false };
    if (buffer.length > MAX_BUFFER_BYTES) return { checked: false };

    let target = buffer;
    if (mediaType === 'video' || mediaType === 'gif') {
        target = await extractStillFrame(buffer, 'mp4');
        if (!target) return { checked: false };
    }
    // Catatan: stiker (statis maupun animasi) sengaja TIDAK melalui ffmpeg —
    // frame pertama WebP sudah representatif & provider gambar pada
    // umumnya bisa membaca WebP langsung. Kalau di kemudian hari terbukti
    // provider yang dipakai tidak bisa baca WebP, tinggal tambahkan cabang
    // `mediaType === 'sticker'` di atas supaya ikut lewat extractStillFrame().

    return checkNsfwBuffer(target);
}
