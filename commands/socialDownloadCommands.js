/**
 * socialDownloadCommands.js — Universal Social Media Downloader
 * Supports: TikTok, Instagram, YouTube, Facebook, Twitter/X, SoundCloud, Pinterest, Threads, Reddit
 * Powered by high-speed Direct APIs (tikwm, ssstik, universal) with automatic yt-dlp fallback.
 * Developed by AHSAN (03107260507) for MASTER MD v3.0.0
 */

import axios from 'axios';
import { ensureYtDlp, runYtDlp } from '../lib/ytdlpBinary.js';
import { tagName } from '../lib/utils.js';

const MAX_DURATION_SEC = 600; // 10 minutes

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

// ─── Direct Fast TikTok Downloader (tikwm + ssstik) ──────────────────────────
async function fetchDirectTikTok(url) {
    // 1. Try tikwm.com
    try {
        const params = new URLSearchParams();
        params.set('url', url);
        params.set('hd', '1');
        const res = await axios.post('https://www.tikwm.com/api/', params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 15000
        });

        if (res.data?.data?.play) {
            const videoUrl = res.data.data.play;
            const videoBuf = await axios.get(videoUrl, {
                responseType: 'arraybuffer',
                timeout: 30000,
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
            });

            return {
                buffer: Buffer.from(videoBuf.data),
                title: res.data.data.title || 'TikTok Video',
                author: res.data.data.author?.nickname || res.data.data.author?.unique_id || 'TikTok Creator',
                duration: res.data.data.duration || 0
            };
        }
    } catch (e) {
        console.warn('[TikTok direct tikwm note]:', e.message);
    }

    // 2. Try ssstik.io
    try {
        const res = await axios.get(`https://api.ssstik.io/v1/download?url=${encodeURIComponent(url)}`, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
            timeout: 15000
        });

        if (res.data?.video) {
            const videoBuf = await axios.get(res.data.video, {
                responseType: 'arraybuffer',
                timeout: 30000
            });
            return {
                buffer: Buffer.from(videoBuf.data),
                title: res.data.title || 'TikTok Video',
                author: res.data.author || 'TikTok Creator',
                duration: res.data.duration || 0
            };
        }
    } catch (e) {
        console.warn('[TikTok direct ssstik note]:', e.message);
    }

    return null;
}

// ─── Direct Universal Downloader (2b.hidenfree.com) ──────────────────────────
async function fetchDirectUniversal(url) {
    try {
        const API_URL = 'https://2b.hidenfree.com';
        const { data: dlData } = await axios.get(`${API_URL}/api/universal/public`, {
            params: { api_key: 'free_key', url, type: 'video' },
            timeout: 25000,
            validateStatus: () => true
        });

        if (dlData?.success && (dlData.url || dlData.fileKey)) {
            const streamUrl = dlData.url || `${API_URL}/api/universal/download?file=${dlData.fileKey}`;
            const vidRes = await axios.get(streamUrl, {
                responseType: 'arraybuffer',
                timeout: 45000,
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
            });
            return {
                buffer: Buffer.from(vidRes.data),
                title: dlData.title || 'Downloaded Video',
                author: dlData.author || dlData.uploader || 'Social Media'
            };
        }
    } catch (e) {
        console.warn('[Universal Direct Downloader note]:', e.message);
    }
    return null;
}

// ─── yt-dlp Fallback Engine ──────────────────────────────────────────────────
async function fetchMetadata(binPath, url, { platformLabel } = {}) {
    const { stdout } = await runYtDlp(binPath, [
        url,
        '--dump-single-json',
        '--no-warnings',
        '--no-playlist',
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
    const { stdout } = await runYtDlp(binPath, [
        url,
        '-f', 'best[ext=mp4]/best',
        '--no-warnings',
        '--no-playlist',
        '-o', '-',
    ], { timeoutMs: 180_000 });
    if (!stdout || stdout.length === 0) throw new Error('Empty output from yt-dlp.');
    return stdout;
}

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

// ─── Unified Downloader Controller ───────────────────────────────────────────
async function downloadAndSend({ ctx, platformLabel, urlPattern }) {
    const { reply, sock, jid, msg } = ctx;
    const url = resolveInputUrl(ctx, urlPattern);

    if (!url) {
        return reply(
`📌 *HOW TO USE*

Send a ${platformLabel} link with the command:
➜ \`.${platformLabel.toLowerCase()} <link>\`

_Or simply REPLY to any message containing a ${platformLabel} link!_`
        );
    }

    if (!urlPattern.test(url)) {
        return reply(`❌ Invalid ${platformLabel} link format. Please provide a valid URL.`);
    }

    const requesterName = msg?.pushName || null;
    const requesterTag = requesterName ? requesterName : tagName(msg?.key?.participant || jid);

    // ── 1. FAST PATH: Direct Web API for TikTok ──
    if (platformLabel === 'TikTok') {
        const directResult = await fetchDirectTikTok(url);
        if (directResult?.buffer) {
            const captionLines = [
                `📥 *TikTok Video (No Watermark)*`,
                `🎬 Creator: @${directResult.author}`,
                `👤 Requested by: ${requesterTag}`,
                '',
                `⚡ Powered by: MASTER MD • Dev: AHSAN (03107260507)`
            ];

            try {
                return await sock.sendMessage(jid, {
                    video: directResult.buffer,
                    mimetype: 'video/mp4',
                    caption: captionLines.join('\n')
                });
            } catch (sendErr) {
                return reply(`❌ Failed to send video: ${sendErr.message}`);
            }
        }
    }

    // ── 2. FAST PATH: Universal Direct API for Instagram / Facebook / Twitter ──
    if (['Instagram', 'Facebook', 'Twitter'].includes(platformLabel)) {
        const directUniversal = await fetchDirectUniversal(url);
        if (directUniversal?.buffer) {
            const captionLines = [
                `📥 *${platformLabel} Video*`,
                `🎬 Creator: ${directUniversal.author}`,
                `👤 Requested by: ${requesterTag}`,
                '',
                `⚡ Powered by: MASTER MD • Dev: AHSAN (03107260507)`
            ];

            try {
                return await sock.sendMessage(jid, {
                    video: directUniversal.buffer,
                    mimetype: 'video/mp4',
                    caption: captionLines.join('\n')
                });
            } catch (sendErr) {
                return reply(`❌ Failed to send video: ${sendErr.message}`);
            }
        }
    }

    // ── 3. FALLBACK PATH: yt-dlp Native Engine ──
    let binPath;
    try {
        binPath = await ensureYtDlp();
    } catch (err) {
        return reply(`❌ Downloader engine unavailable: ${err.message}`);
    }

    let meta;
    try {
        meta = await fetchMetadata(binPath, url, { platformLabel });
    } catch {}

    if (meta?.duration && meta.duration > MAX_DURATION_SEC) {
        return reply(`⚠️ Video is too long (${fmtDur(meta.duration)}). Maximum limit is ${fmtDur(MAX_DURATION_SEC)}.`);
    }

    let videoBuffer;
    try {
        videoBuffer = await downloadVideoBuffer(binPath, url, { platformLabel });
    } catch (err) {
        return reply(`❌ Failed to download video.\n${explainDownloadError(err.message, platformLabel)}`);
    }

    const captionLines = [
        `📥 *${platformLabel} Video*`,
        `👤 Requested by: ${requesterTag}`,
    ];
    if (meta?.uploader) captionLines.splice(1, 0, `🎬 Creator: ${meta.uploader}`);
    captionLines.push('', `⚡ Powered by: MASTER MD • Dev: AHSAN (03107260507)`);

    try {
        await sock.sendMessage(jid, {
            video: videoBuffer,
            mimetype: 'video/mp4',
            caption: captionLines.join('\n'),
        });
    } catch (err) {
        return reply(`❌ Failed to send video: ${err.message}`);
    }
}

// ─── Supported Platforms ────────────────────────────────────────────────────
const IG_URL_PATTERN = /(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:p|reel|tv)\/[A-Za-z0-9_-]+\S*/i;
async function downloadInstagram(ctx) {
    return downloadAndSend({ ctx, platformLabel: 'Instagram', urlPattern: IG_URL_PATTERN });
}

const TIKTOK_URL_PATTERN = /(?:https?:\/\/)?(?:www\.|vm\.|vt\.)?tiktok\.com\/[A-Za-z0-9@._/-]+\S*/i;
async function downloadTiktok(ctx) {
    return downloadAndSend({ ctx, platformLabel: 'TikTok', urlPattern: TIKTOK_URL_PATTERN });
}

const YT_URL_PATTERN = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)[A-Za-z0-9_-]+\S*/i;
async function downloadYoutubeVideo(ctx) {
    return downloadAndSend({ ctx, platformLabel: 'YouTube', urlPattern: YT_URL_PATTERN });
}

const TWITTER_URL_PATTERN = /(?:https?:\/\/)?(?:www\.)?(?:twitter|x)\.com\/\S+\/status\/[0-9]+\S*/i;
async function downloadTwitter(ctx) {
    return downloadAndSend({ ctx, platformLabel: 'Twitter', urlPattern: TWITTER_URL_PATTERN });
}

const FB_URL_PATTERN = /(?:https?:\/\/)?(?:www\.)?(?:facebook\.com|fb\.watch)\/\S+/i;
async function downloadFacebook(ctx) {
    return downloadAndSend({ ctx, platformLabel: 'Facebook', urlPattern: FB_URL_PATTERN });
}

const SC_URL_PATTERN = /(?:https?:\/\/)?(?:www\.)?soundcloud\.com\/\S+/i;
async function downloadSoundcloud(ctx) {
    return downloadAndSend({ ctx, platformLabel: 'SoundCloud', urlPattern: SC_URL_PATTERN });
}

const PIN_URL_PATTERN = /(?:https?:\/\/)?(?:www\.)?(?:pinterest\.com\/pin|pin\.it)\/\S+/i;
async function downloadPinterest(ctx) {
    return downloadAndSend({ ctx, platformLabel: 'Pinterest', urlPattern: PIN_URL_PATTERN });
}

const THREADS_URL_PATTERN = /(?:https?:\/\/)?(?:www\.)?threads\.net\/\S+/i;
async function downloadThreads(ctx) {
    return downloadAndSend({ ctx, platformLabel: 'Threads', urlPattern: THREADS_URL_PATTERN });
}

const REDDIT_URL_PATTERN = /(?:https?:\/\/)?(?:www\.)?reddit\.com\/r\/\S+/i;
async function downloadReddit(ctx) {
    return downloadAndSend({ ctx, platformLabel: 'Reddit', urlPattern: REDDIT_URL_PATTERN });
}

const BILI_URL_PATTERN = /(?:https?:\/\/)?(?:www\.)?bilibili\.tv\/\S+/i;
async function downloadBilibili(ctx) {
    return downloadAndSend({ ctx, platformLabel: 'Bilibili', urlPattern: BILI_URL_PATTERN });
}

const DM_URL_PATTERN = /(?:https?:\/\/)?(?:www\.)?dailymotion\.com\/video\/\S+/i;
async function downloadDailymotion(ctx) {
    return downloadAndSend({ ctx, platformLabel: 'Dailymotion', urlPattern: DM_URL_PATTERN });
}

const VIMEO_URL_PATTERN = /(?:https?:\/\/)?(?:www\.)?vimeo\.com\/\d+\S*/i;
async function downloadVimeo(ctx) {
    return downloadAndSend({ ctx, platformLabel: 'Vimeo', urlPattern: VIMEO_URL_PATTERN });
}

const SNACK_URL_PATTERN = /(?:https?:\/\/)?(?:www\.)?(?:snackvideo\.com|sck\.io)\/\S+/i;
async function downloadSnackvideo(ctx) {
    return downloadAndSend({ ctx, platformLabel: 'SnackVideo', urlPattern: SNACK_URL_PATTERN });
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
