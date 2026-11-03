/**
 * socialDownloadCommands.js — Fitur .ig (Instagram) & .tiktok (TikTok)
 * Download video dari link Instagram/TikTok, kirim ke pengguna dengan
 * caption info (judul/Request by/Powered by).
 *
 * Memakai infrastruktur yang SAMA dengan .play (lib/ytdlpBinary.js) —
 * yt-dlp juga mendukung Instagram & TikTok, jadi TIDAK perlu nambah
 * dependency baru sama sekali. Lihat lib/ytdlpBinary.js untuk penjelasan
 * lengkap soal binary yt-dlp & kenapa dipakai (bukan library Node.js
 * yang sudah usang seperti ytdl-core).
 *
 * CATATAN PENTING soal "ambil audio": di foto contoh, di bawah video
 * ada tombol hijau "ambil audio" — itu BUKAN sesuatu yang dikontrol bot
 * manapun, itu FITUR NATIVE WhatsApp client sendiri untuk SEMUA pesan
 * video (built-in WhatsApp, sudah ada otomatis tanpa bot perlu buat
 * apapun). Makanya di sini bot cukup fokus pada bagian yang BISA
 * dikontrol bot: caption info + kualitas video yang dikirim.
 */

import { ensureYtDlp, runYtDlp } from '../lib/ytdlpBinary.js';
import { tagName } from '../lib/utils.js';

const MAX_DURATION_SEC = 600; // 10 menit, konsisten dengan limit .play

// ─── Helper: ambil teks dari pesan yang di-reply (quote) ─────────────────
// Pola IDENTIK dengan getQuotedText di commands/bratCommands.js — supaya
// .ig/.tiktok bisa dipakai dengan REPLY ke pesan berisi link, bukan cuma
// ".ig <link>" langsung (lihat pesan bantuan di downloadAndSend di bawah,
// yang memang menyebutkan dua cara ini).
function getQuotedText(msg) {
    const ctxInfo = msg.message?.extendedTextMessage?.contextInfo;
    const quoted = ctxInfo?.quotedMessage;
    if (!quoted) return null;
    return (
        quoted.conversation ||
        quoted.extendedTextMessage?.text ||
        quoted.imageMessage?.caption ||
        quoted.videoMessage?.caption ||
        null
    );
}

// Ambil URL: dari argumen kalau ada (".ig <link>"), kalau tidak coba dari
// teks pesan yang di-reply (cari pola URL yang cocok dengan urlPattern di
// dalamnya, karena pesan yang di-reply mungkin punya teks lain di sekitar
// link-nya, bukan cuma URL polos).
function resolveInputUrl(ctx, urlPattern) {
    const fromArgs = (ctx.args || [])[0];
    if (fromArgs) return fromArgs;
    const fromQuote = getQuotedText(ctx.msg);
    if (fromQuote) {
        const match = fromQuote.match(urlPattern);
        if (match) return match[0];
    }
    return null;
}

// User-agent mobile (bukan browser desktop) — beberapa kasus terbukti
// membantu yt-dlp lolos dari deteksi "Main webpage is locked behind the
// login page" yang sering dialami Instagram (lihat catatan panjang di
// bagian bawah file ini soal kenapa Instagram lebih sering bermasalah
// dibanding TikTok). Ini BUKAN solusi 100% — kalau Instagram memang
// sedang rate-limit IP server secara agresif, tidak ada flag yang bisa
// menembusnya tanpa cookies akun asli.
const INSTAGRAM_USER_AGENT = 'Instagram 269.0.0.18.75 Android (30/11; 420dpi; 1080x2129; samsung; SM-G973F; beyond1; exynos9820; en_US; 314665256)';

// TikTok kadang minta header/Referer khusus biar nggak dianggap request
// mencurigakan (dokumentasi komunitas yt-dlp per pertengahan 2026
// nyaranin ini kalau ketemu error 403/"Unable to extract webpage video
// data"). Extra header, bukan pengganti update yt-dlp — kalau TikTok
// ubah lagi struktur halamannya, yt-dlp sendiri yang perlu di-update
// (lihat explainDownloadError di bawah).
const TIKTOK_EXTRA_ARGS = [
    '--add-header', 'Referer: https://www.tiktok.com/',
    '--user-agent', 'Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
];

// ─── Helper: ekstrak metadata + download video dalam SATU panggilan ──────
// Beda dengan musicCommands.js yang search dulu baru download (karena
// .play menerima KATA KUNCI), di sini user kasih LINK LANGSUNG, jadi
// tidak perlu tahap "cari" — cukup --dump-single-json untuk dapat info
// (judul/durasi/uploader) SEKALIGUS nanti download videonya.
async function fetchMetadata(binPath, url, { platformLabel } = {}) {
    const extraArgs = platformLabel === 'Instagram'
        ? ['--user-agent', INSTAGRAM_USER_AGENT]
        : platformLabel === 'TikTok'
        ? TIKTOK_EXTRA_ARGS
        : [];
    const { stdout } = await runYtDlp(binPath, [
        url,
        '--dump-single-json',
        '--no-warnings',
        '--no-playlist',
        ...extraArgs,
        '--skip-download',
    ], { timeoutMs: 30_000 });

    const text = stdout.toString('utf8').trim();
    if (!text) return null;
    try {
        return JSON.parse(text);
    } catch {
        return null;
    }
}

async function downloadVideoBuffer(binPath, url, { platformLabel } = {}) {
    const extraArgs = platformLabel === 'Instagram'
        ? ['--user-agent', INSTAGRAM_USER_AGENT]
        : platformLabel === 'TikTok'
        ? TIKTOK_EXTRA_ARGS
        : [];
    const { stdout } = await runYtDlp(binPath, [
        url,
        '-f', 'best[ext=mp4]/best',
        '--no-warnings',
        '--no-playlist',
        ...extraArgs,
        '-o', '-',
    ], { timeoutMs: 180_000 });
    if (!stdout || stdout.length === 0) throw new Error('Output kosong dari yt-dlp.');
    return stdout;
}

// Ubah pesan error mentah yt-dlp (yang panjang & teknis) jadi pesan yang
// jelas buat user biasa — yt-dlp SUDAH melampirkan stderr asli ke dalam
// err.message (lihat lib/ytdlpBinary.js), tapi stderr itu berisi banyak
// jargon teknis yang membingungkan kalau ditampilkan mentah-mentah di
// WhatsApp. Fungsi ini mendeteksi pola error yang PALING SERING terjadi
// (lihat riset GitHub issue yt-dlp #16311, #17074 — per pertengahan 2026
// Instagram memang jauh lebih sering minta login/rate-limit dibanding
// TikTok) dan menggantinya dengan penjelasan yang actionable.
function explainDownloadError(rawMessage, platformLabel) {
    const msg = String(rawMessage || '');
    if (/login required|rate-limit|locked behind the login|empty media response/i.test(msg)) {
        return `${platformLabel} is currently rate-limiting or requiring login for this media. Please try again in a few minutes or test with another link.`;
    }
    if (/private|not available|removed|404/i.test(msg)) {
        return `This content is private or has been removed. Only public media can be downloaded.`;
    }
    if (/Unable to extract|unable to extract/i.test(msg)) {
        return `Unable to extract video data from ${platformLabel}. Please try again shortly.`;
    }
    const shortDetail = msg.split('\n').find(line => line.trim().startsWith('ERROR')) || msg.slice(0, 200);
    return `Download failed (${platformLabel}: "${shortDetail.trim()}"). Please try again.`;
}

function fmtDur(seconds) {
    seconds = Math.round(seconds || 0);
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
}

// ─── Shared core logic for .ig and .tiktok ──────────────────────────────
async function downloadAndSend({ ctx, platformLabel, urlPattern }) {
    const { reply, sock, jid, msg } = ctx;
    const url = resolveInputUrl(ctx, urlPattern);
    if (!url) {
        return reply(
`📌 *HOW TO USE*

Send a ${platformLabel} link after the command:
➜ \`.${platformLabel.toLowerCase()} <link>\`

Or REPLY to any message containing a ${platformLabel} link!`
        );
    }
    if (!urlPattern.test(url)) {
        return reply(`❌ Invalid ${platformLabel} link format. Please provide a valid URL.`);
    }

    let binPath;
    try {
        binPath = await ensureYtDlp();
    } catch (err) {
        return reply(`❌ ${err.message}`);
    }

    await reply(`🔍 Processing ${platformLabel} link...`);

    let meta;
    try {
        meta = await fetchMetadata(binPath, url, { platformLabel });
        if (!meta) return reply(`❌ Failed to read ${platformLabel} link. Ensure link is valid and post is public.`);
    } catch (err) {
        return reply(`❌ ${explainDownloadError(err.message, platformLabel)}`);
    }

    if (meta.duration && meta.duration > MAX_DURATION_SEC) {
        return reply(`⚠️ Video is too long (${fmtDur(meta.duration)}). Maximum limit is ${fmtDur(MAX_DURATION_SEC)}.`);
    }

    let videoBuffer;
    try {
        videoBuffer = await downloadVideoBuffer(binPath, url, { platformLabel });
    } catch (err) {
        return reply(
`❌ Failed to download video.
${explainDownloadError(err.message, platformLabel)}`
        );
    }

    const requesterName = msg?.pushName || null;
    const requesterTag = requesterName ? requesterName : tagName(msg?.key?.participant || jid);

    const captionLines = [
        `📥 *${platformLabel} Video*`,
        `👤 Requested by: ${requesterTag}`,
    ];
    if (meta.uploader) captionLines.splice(1, 0, `🎬 Creator: ${meta.uploader}`);
    captionLines.push('', `⚡ Powered by: MASTER MD • Dev: AHSAN`);

    try {
        await sock.sendMessage(jid, {
            video: videoBuffer,
            mimetype: 'video/mp4',
            caption: captionLines.join('\n'),
        }, { quoted: msg });
    } catch (err) {
        return reply(`❌ Gagal mengirim video: ${err.message}`);
    }
}

// ─── Command .ig ──────────────────────────────────────────────────────────
const IG_URL_PATTERN = /(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:p|reel|tv)\/[A-Za-z0-9_-]+\S*/i;

async function downloadInstagram(ctx) {
    return downloadAndSend({ ctx, platformLabel: 'Instagram', urlPattern: IG_URL_PATTERN });
}

// ─── Command .tiktok ──────────────────────────────────────────────────────
const TIKTOK_URL_PATTERN = /(?:https?:\/\/)?(?:www\.|vm\.|vt\.)?tiktok\.com\/[A-Za-z0-9@._/-]+\S*/i;

async function downloadTiktok(ctx) {
    return downloadAndSend({ ctx, platformLabel: 'TikTok', urlPattern: TIKTOK_URL_PATTERN });
}

// ─── Command .ytmp4 (YouTube video) ───────────────────────────────────────
const YT_URL_PATTERN = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)[A-Za-z0-9_-]+\S*/i;

async function downloadYoutubeVideo(ctx) {
    return downloadAndSend({ ctx, platformLabel: 'YouTube', urlPattern: YT_URL_PATTERN });
}

// ─── Command .twitter / .twdl ─────────────────────────────────────────────
const TWITTER_URL_PATTERN = /(?:https?:\/\/)?(?:www\.)?(?:twitter|x)\.com\/\S+\/status\/[0-9]+\S*/i;

async function downloadTwitter(ctx) {
    return downloadAndSend({ ctx, platformLabel: 'Twitter/X', urlPattern: TWITTER_URL_PATTERN });
}

// ─── Command .facebook / .fbdl ────────────────────────────────────────────
const FB_URL_PATTERN = /(?:https?:\/\/)?(?:www\.)?(?:facebook\.com|fb\.watch)\/\S+/i;

async function downloadFacebook(ctx) {
    return downloadAndSend({ ctx, platformLabel: 'Facebook', urlPattern: FB_URL_PATTERN });
}

// ─── Command .soundcloud / .scdl ──────────────────────────────────────────
const SC_URL_PATTERN = /(?:https?:\/\/)?(?:www\.)?soundcloud\.com\/\S+/i;

async function downloadSoundcloud(ctx) {
    const { reply, sock, jid, msg } = ctx;
    const url = resolveInputUrl(ctx, SC_URL_PATTERN);
    if (!url) return reply('📌 Cara pakai: `.scdl <link SoundCloud>`');
    if (!SC_URL_PATTERN.test(url)) return reply('❌ Bukan link SoundCloud yang valid.');

    let binPath;
    try { binPath = await ensureYtDlp(); } catch (err) { return reply(`❌ ${err.message}`); }

    await reply('🎵 Mengunduh audio SoundCloud...');
    try {
        const { stdout } = await runYtDlp(binPath, [
            url, '-f', 'bestaudio', '-x', '--audio-format', 'mp3',
            '--no-warnings', '--no-playlist', '-o', '-',
        ], { timeoutMs: 120_000 });
        if (!stdout || stdout.length === 0) throw new Error('Output kosong.');
        await sock.sendMessage(jid, {
            audio: stdout,
            mimetype: 'audio/mpeg',
            ptt: false,
        }, { quoted: msg });
    } catch (err) {
        await reply(`❌ Gagal download SoundCloud: ${explainDownloadError(err.message, 'SoundCloud')}`);
    }
}

// ─── Command .pinterest / .pin ────────────────────────────────────────────
const PIN_URL_PATTERN = /(?:https?:\/\/)?(?:www\.)?(?:pinterest\.com|pin\.it)\/\S+/i;

async function downloadPinterest(ctx) {
    return downloadAndSend({ ctx, platformLabel: 'Pinterest', urlPattern: PIN_URL_PATTERN });
}

// ─── Command .threads ──────────────────────────────────────────────────────
const THREADS_URL_PATTERN = /(?:https?:\/\/)?(?:www\.)?threads\.net\/@[\w.]+\/post\/[A-Za-z0-9_-]+\S*/i;

async function downloadThreads(ctx) {
    return downloadAndSend({ ctx, platformLabel: 'Threads', urlPattern: THREADS_URL_PATTERN });
}

// ─── Command .reddit / .redditdl ───────────────────────────────────────────
const REDDIT_URL_PATTERN = /(?:https?:\/\/)?(?:www\.|old\.)?reddit\.com\/r\/\S+\/comments\/\S+/i;

async function downloadReddit(ctx) {
    return downloadAndSend({ ctx, platformLabel: 'Reddit', urlPattern: REDDIT_URL_PATTERN });
}

// ─── Command .bilibili / .bili ─────────────────────────────────────────────
const BILIBILI_URL_PATTERN = /(?:https?:\/\/)?(?:www\.)?bilibili\.com\/video\/[A-Za-z0-9]+\S*/i;

async function downloadBilibili(ctx) {
    return downloadAndSend({ ctx, platformLabel: 'Bilibili', urlPattern: BILIBILI_URL_PATTERN });
}

// ─── Command .dailymotion / .dmdl ──────────────────────────────────────────
const DAILYMOTION_URL_PATTERN = /(?:https?:\/\/)?(?:www\.)?dailymotion\.com\/video\/[A-Za-z0-9]+\S*/i;

async function downloadDailymotion(ctx) {
    return downloadAndSend({ ctx, platformLabel: 'Dailymotion', urlPattern: DAILYMOTION_URL_PATTERN });
}

// ─── Command .vimeo / .vimeodl ─────────────────────────────────────────────
const VIMEO_URL_PATTERN = /(?:https?:\/\/)?(?:www\.)?vimeo\.com\/[0-9]+\S*/i;

async function downloadVimeo(ctx) {
    return downloadAndSend({ ctx, platformLabel: 'Vimeo', urlPattern: VIMEO_URL_PATTERN });
}

// ─── Command .snackvideo / .snackdl ────────────────────────────────────────
// CATATAN: platform regional (populer di Indonesia) — dukungan yt-dlp
// untuk platform yang lebih niche seperti ini bisa berubah-ubah lebih
// sering dibanding platform besar (Instagram/TikTok/YouTube dkk). Kalau
// suatu saat berhenti berfungsi, itu kemungkinan besar dari sisi yt-dlp-nya
// (perlu `npm run update-ytdlp` atau setara — lihat lib/ytdlpBinary.js),
// bukan bug di command ini.
const SNACKVIDEO_URL_PATTERN = /(?:https?:\/\/)?(?:www\.)?snackvideo\.com\/\S+/i;

async function downloadSnackvideo(ctx) {
    return downloadAndSend({ ctx, platformLabel: 'SnackVideo', urlPattern: SNACKVIDEO_URL_PATTERN });
}

export const socialDownloadCommands = {
    downloadInstagram,
    downloadTiktok,
    downloadYoutubeVideo,
    downloadTwitter,
    downloadFacebook,
    downloadSoundcloud,
    downloadPinterest,
    downloadThreads,
    downloadReddit,
    downloadBilibili,
    downloadDailymotion,
    downloadVimeo,
    downloadSnackvideo,
};
