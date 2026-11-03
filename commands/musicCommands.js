/**
 * musicCommands.js — Fitur .play untuk GOJO SATORU MD V2
 * Cari & download audio dari YouTube, lalu kirim ke pengguna.
 *
 * ═══════════════════════════════════════════════════════════════════
 *  GANTI DARI @distube/ytdl-core KE yt-dlp (lihat lib/ytdlpBinary.js
 *  untuk penjelasan lengkap kenapa) — singkatnya: @distube/ytdl-core
 *  sudah di-archive (tidak ada update lagi), itu sebabnya .play selalu
 *  gagal dengan "Status code: 403". yt-dlp (project terpisah, dijalankan
 *  sebagai binary lewat child_process — BUKAN library Node.js) jauh
 *  lebih sering di-update mengikuti perubahan YouTube, dan binary
 *  standalone-nya tidak butuh Python ter-install di server.
 * ═══════════════════════════════════════════════════════════════════
 *
 * Dependensi:
 *   - lib/ytdlpBinary.js : auto-download & jalankan binary yt-dlp
 *   (yt-search SUDAH TIDAK DIPAKAI di sini — yt-dlp sendiri sudah bisa
 *   search YouTube lewat sintaks "ytsearch1:<query>", jadi satu sumber
 *   kebenaran yang sama dipakai untuk cari & download, bukan dua tools
 *   berbeda yang bisa saling tidak sinkron.)
 */

import { ensureYtDlp, runYtDlp } from '../lib/ytdlpBinary.js';
import { nauvalPlay } from '../lib/nauvalApi.js';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const FFMPEG_PATH = require('ffmpeg-static');

// ─── Helper: format durasi detik → mm:ss / h:mm:ss ───────────────
function fmtDur(seconds) {
    seconds = Math.round(seconds || 0);
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return `${m}:${String(s).padStart(2, '0')}`;
}

function fmtViews(n) {
    if (!n) return '?';
    return Number(n).toLocaleString('id-ID');
}

// ─── Helper: cari 1 video lewat yt-dlp sendiri (sintaks ytsearch1:) ──
// --dump-single-json mengembalikan metadata video TANPA mendownloadnya
// (cepat, hanya beberapa detik), mirip cara kerja yt-search sebelumnya
// tapi datanya datang dari sumber yang SAMA dengan yang nanti dipakai
// untuk download — jadi tidak ada risiko video yang ditemukan saat
// "search" beda dengan yang di-download.
async function searchVideo(binPath, query) {
    const { stdout } = await runYtDlp(binPath, [
        `ytsearch1:${query}`,
        '--dump-single-json',
        '--no-warnings',
        '--no-playlist',
        '--skip-download',
    ], { timeoutMs: 30_000 });

    const text = stdout.toString('utf8').trim();
    if (!text) return null;

    // ytsearch1: mengembalikan SATU objek JSON (bukan array), karena
    // batas hasil sudah dipatok 1 lewat angka di belakang "ytsearch".
    let data;
    try {
        data = JSON.parse(text);
    } catch {
        return null;
    }
    // Beberapa versi yt-dlp membungkusnya dalam { entries: [...] }
    // kalau query berupa playlist pencarian — tangani keduanya.
    if (data?.entries?.length) data = data.entries[0];
    if (!data || !data.id) return null;

    return {
        id: data.id,
        url: data.webpage_url || `https://www.youtube.com/watch?v=${data.id}`,
        title: data.title || 'Tanpa judul',
        author: data.uploader || data.channel || 'Unknown',
        seconds: data.duration || 0,
        views: data.view_count || 0,
    };
}

// ─── Command .play ────────────────────────────────────────────────
async function play(reply, sock, jid, msg, args) {
    if (!args || args.length === 0) {
        return reply(
`🎵 *CARA PAKAI .play*

Ketik judul lagu atau artis:
➜ \`.play Naruto opening\`
➜ \`.play Yoasobi Idol\`
➜ \`.play Alan Walker Faded\`

Bot akan cari di YouTube lalu kirim audionya langsung!`
        );
    }

    const query = args.join(' ');

    // 0. Coba REST API Nauval terlebih dahulu. Endpoint dicari dari OpenAPI
    // API itu sendiri, jadi tidak mengunci bot ke path yang bisa berubah.
    // API key bersifat opsional; bila server API menerima akses gratis berbasis
    // IP, bot tetap bisa mencoba tanpa key. Jika gagal, fallback ke yt-dlp.
    try {
        const apiResult = await nauvalPlay(query);
        if (apiResult?.buffer?.length) {
            await sock.sendMessage(jid, {
                audio: apiResult.buffer,
                mimetype: apiResult.mimetype || 'audio/mpeg',
                fileName: `${String(apiResult.title || 'audio').replace(/[\\/:*?"<>|]/g, '_').slice(0, 80)}.mp3`,
                ptt: false,
            }, { quoted: msg });
            return;
        }
        if (apiResult?.url) {
            try {
                const r = await fetch(apiResult.url, { signal: AbortSignal.timeout(30_000) });
                if (r.ok) {
                    const buf = Buffer.from(await r.arrayBuffer());
                    if (buf.length > 0 && buf.length <= 15 * 1024 * 1024) {
                        await sock.sendMessage(jid, {
                            audio: buf,
                            mimetype: 'audio/mpeg',
                            fileName: `${String(apiResult.title || 'audio').replace(/[\\/:*?"<>|]/g, '_').slice(0, 80)}.mp3`,
                            ptt: false,
                        }, { quoted: msg });
                        return;
                    }
                }
            } catch { /* fallback ke yt-dlp */ }
        }
    } catch { /* API gagal/tidak tersedia → fallback ke yt-dlp */ }

    // 0. Siapkan binary yt-dlp (download sekali kalau belum ada — bisa
    //    makan waktu beberapa detik di pemanggilan PERTAMA saja).
    let binPath;
    try {
        binPath = await ensureYtDlp();
    } catch (err) {
        return reply(`❌ ${err.message}`);
    }

    // 1. Beritahu user sedang mencari
    await reply(`🔍 Mencari *"${query}"* di YouTube...`);

    let video;
    try {
        video = await searchVideo(binPath, query);
        if (!video) return reply('❌ Tidak ada hasil ditemukan. Coba kata kunci lain.');
    } catch (err) {
        return reply(`❌ Gagal mencari lagu: ${err.message}`);
    }

    // 2. Cek durasi — batasi 10 menit supaya tidak timeout / file terlalu besar
    const MAX_DURATION_SEC = 600;
    if (video.seconds > MAX_DURATION_SEC) {
        return reply(
`⚠️ Durasi lagu terlalu panjang!

🎵 *${video.title}*
⏱️ Durasi: ${fmtDur(video.seconds)} (maks. 10 menit)

Coba cari lagu yang lebih pendek ya.`
        );
    }

    // 3. Beritahu user sedang download
    await reply(
`🎵 *Ditemukan!*

📌 *${video.title}*
👤 ${video.author}
⏱️ ${fmtDur(video.seconds)}
👁️ ${fmtViews(video.views)} views

⬇️ Mengunduh audio...`
    );

    // 4. Download + konversi ke MP3 di file sementara.
    // Jangan lagi mengirim bestaudio mentah ke stdout: stream YouTube bisa
    // berupa WebM/Opus dan WhatsApp kadang menolaknya sebagai audio.
    // ffmpeg-static dibundel di project sehingga tidak bergantung pada
    // ffmpeg sistem Pterodactyl.
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gojo-play-'));
    const outFile = path.join(tmpDir, 'audio.mp3');
    try {
        if (!FFMPEG_PATH) throw new Error('FFmpeg tidak tersedia di paket bot.');
        await runYtDlp(binPath, [
            video.url,
            '-f', 'bestaudio/best',
            '--extract-audio',
            '--audio-format', 'mp3',
            '--audio-quality', '0',
            '--ffmpeg-location', FFMPEG_PATH,
            '--no-warnings',
            '--no-playlist',
            '-o', outFile,
        ], { timeoutMs: 180_000 });
        const stat = fs.statSync(outFile);
        if (!stat.isFile() || stat.size === 0) throw new Error('File audio hasil download kosong.');
        // Batas aman praktis untuk pengiriman audio.
        if (stat.size > 15 * 1024 * 1024) throw new Error('File audio terlalu besar untuk dikirim.');

        const audioBuffer = fs.readFileSync(outFile);
        try {
            await sock.sendMessage(jid, {
                audio: audioBuffer,
                mimetype: 'audio/mpeg',
                fileName: `${video.title.replace(/[\\/:*?"<>|]/g, '_').slice(0, 80) || 'audio'}.mp3`,
                ptt: false,
            }, { quoted: msg });
        } catch (err) {
            return reply(`❌ Gagal mengirim audio: ${err.message || 'pengiriman gagal'}`);
        }
    } catch (err) {
        return reply(
`❌ Gagal mengunduh audio.
${String(err.message || 'Downloader gagal').replace(/\s+/g, ' ').slice(0, 300)}

Coba judul/lagu lain.`
        );
    } finally {
        try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch {}
    }
}

// ─── Export ───────────────────────────────────────────────────────
export const musicCommands = { play };
