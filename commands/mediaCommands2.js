// ═══════════════════════════════════════════════════════════════════
//  MEDIACOMMANDS2.JS — Command transformasi media baru (grayscale,
//  mirror, blur, rotate, speed, mute, extract audio, dst)
// ═══════════════════════════════════════════════════════════════════

import {
    toGrayscale, mirrorHorizontal, blurMedia, rotateMedia,
    changeVideoSpeed, muteVideo, extractAudio, adjustVolume,
    applySepia, invertColors, pixelateMedia, adjustBrightness, reverseVideo,
    flipVertical, squareCrop, addWatermark, upscaleHD,
} from '../lib/mediaEffects.js';

// Ambil buffer + tipe media dari pesan yang di-reply ATAU dikirim
// langsung dengan caption command — pola sama seperti setGroupIcon di
// adminCommands4.js, diperluas untuk video & audio juga.
async function getQuotedMediaBuffer(ctx, allowedTypes) {
    const ctxInfo = ctx.msg.message?.extendedTextMessage?.contextInfo;
    const quotedMessage = ctxInfo?.quotedMessage;
    let targetMsg = null, mediaType = null;

    const check = (msgObj) => {
        if (msgObj?.imageMessage) return 'image';
        if (msgObj?.videoMessage) return 'video';
        if (msgObj?.audioMessage) return 'audio';
        return null;
    };

    const quotedType = check(quotedMessage);
    if (quotedType) {
        targetMsg = { key: { remoteJid: ctx.jid, id: ctxInfo.stanzaId, participant: ctxInfo.participant }, message: quotedMessage };
        mediaType = quotedType;
    } else {
        const directType = check(ctx.msg.message);
        if (directType) { targetMsg = ctx.msg; mediaType = directType; }
    }

    if (!targetMsg || !allowedTypes.includes(mediaType)) return null;

    const { downloadMediaMessage } = await import('@whiskeysockets/baileys');
    const buffer = await downloadMediaMessage(targetMsg, 'buffer', {});
    return { buffer, mediaType };
}

const NO_MEDIA_MSG = (cmd, types) => `📌 Kirim ${types} dengan caption *${cmd}*, atau reply ${types} lalu ketik *${cmd}*.`;
const FFMPEG_MISSING_HINT = '\n\n_(Fitur ini butuh package ffmpeg-static — pastikan sudah ke-install)_';

async function withMediaEffect(ctx, cmd, allowedTypes, typeLabel, transformFn, resultKind, extraCaption = '') {
    const media = await getQuotedMediaBuffer(ctx, allowedTypes);
    if (!media) return ctx.reply(NO_MEDIA_MSG(cmd, typeLabel));
    try {
        const resultBuffer = await transformFn(media);
        const payload = resultKind === 'image' ? { image: resultBuffer, caption: extraCaption }
            : resultKind === 'video' ? { video: resultBuffer, caption: extraCaption }
            : { audio: resultBuffer, mimetype: 'audio/mpeg' };
        await ctx.sock.sendMessage(ctx.jid, payload, { quoted: ctx.msg });
    } catch (err) {
        await ctx.reply(`❌ Gagal proses media: ${err.message}${err.message.includes('ffmpeg-static') ? '' : FFMPEG_MISSING_HINT}`);
    }
}

export async function grayscaleCmd(ctx) {
    return withMediaEffect(ctx, '.grayscale', ['image', 'video'], 'gambar/video', async (m) => {
        const ext = m.mediaType === 'video' ? 'mp4' : 'jpg';
        return toGrayscale(m.buffer, ext);
    }, 'image');
}

export async function mirrorCmd(ctx) {
    return withMediaEffect(ctx, '.mirror', ['image', 'video'], 'gambar/video', async (m) => {
        const ext = m.mediaType === 'video' ? 'mp4' : 'jpg';
        return mirrorHorizontal(m.buffer, ext);
    }, 'image');
}

export async function blurCmd(ctx) {
    return withMediaEffect(ctx, '.blur', ['image'], 'gambar', async (m) => blurMedia(m.buffer, 'jpg'), 'image');
}

// FIX (2026-07-24): fitur baru — .hd, upscale + pertajam foto (lokal
// lewat ffmpeg, lihat lib/mediaEffects.js:upscaleHD — tidak pakai API
// luar sama sekali).
export async function hdCmd(ctx) {
    return withMediaEffect(ctx, '.hd', ['image'], 'foto', async (m) => upscaleHD(m.buffer, 'jpg'), 'image', '✨ HD-in selesai!');
}

export async function rotate90Cmd(ctx) {
    return withMediaEffect(ctx, '.rotate90', ['image'], 'gambar', async (m) => rotateMedia(m.buffer, 'jpg', 90), 'image');
}

export async function rotate180Cmd(ctx) {
    return withMediaEffect(ctx, '.rotate180', ['image'], 'gambar', async (m) => rotateMedia(m.buffer, 'jpg', 180), 'image');
}

export async function speedUpCmd(ctx) {
    const media = await getQuotedMediaBuffer(ctx, ['video']);
    if (!media) return ctx.reply(NO_MEDIA_MSG('.speedup', 'video'));
    try {
        const result = await changeVideoSpeed(media.buffer, 2);
        await ctx.sock.sendMessage(ctx.jid, { video: result, caption: '⚡ 2x lebih cepat' }, { quoted: ctx.msg });
    } catch (err) { await ctx.reply(`❌ Gagal: ${err.message}`); }
}

export async function slowMoCmd(ctx) {
    const media = await getQuotedMediaBuffer(ctx, ['video']);
    if (!media) return ctx.reply(NO_MEDIA_MSG('.slowmo', 'video'));
    try {
        const result = await changeVideoSpeed(media.buffer, 0.5);
        await ctx.sock.sendMessage(ctx.jid, { video: result, caption: '🐌 Slow motion 0.5x' }, { quoted: ctx.msg });
    } catch (err) { await ctx.reply(`❌ Gagal: ${err.message}`); }
}

export async function muteVideoCmd(ctx) {
    const media = await getQuotedMediaBuffer(ctx, ['video']);
    if (!media) return ctx.reply(NO_MEDIA_MSG('.mutevideo', 'video'));
    try {
        const result = await muteVideo(media.buffer);
        await ctx.sock.sendMessage(ctx.jid, { video: result, caption: '🔇 Suara dihapus' }, { quoted: ctx.msg });
    } catch (err) { await ctx.reply(`❌ Gagal: ${err.message}`); }
}

export async function extractAudioCmd(ctx) {
    const media = await getQuotedMediaBuffer(ctx, ['video']);
    if (!media) return ctx.reply(NO_MEDIA_MSG('.extractaudio', 'video'));
    try {
        const result = await extractAudio(media.buffer);
        await ctx.sock.sendMessage(ctx.jid, { audio: result, mimetype: 'audio/mpeg' }, { quoted: ctx.msg });
    } catch (err) { await ctx.reply(`❌ Gagal: ${err.message}`); }
}

export async function volumeUpCmd(ctx) {
    const media = await getQuotedMediaBuffer(ctx, ['audio']);
    if (!media) return ctx.reply(NO_MEDIA_MSG('.volumeup', 'audio/voice note'));
    try {
        const result = await adjustVolume(media.buffer, 2);
        await ctx.sock.sendMessage(ctx.jid, { audio: result, mimetype: 'audio/mpeg' }, { quoted: ctx.msg });
    } catch (err) { await ctx.reply(`❌ Gagal: ${err.message}`); }
}

export async function sepiaCmd(ctx) {
    return withMediaEffect(ctx, '.sepia', ['image'], 'gambar', async (m) => applySepia(m.buffer, 'jpg'), 'image');
}

export async function invertCmd(ctx) {
    return withMediaEffect(ctx, '.invert', ['image'], 'gambar', async (m) => invertColors(m.buffer, 'jpg'), 'image');
}

export async function pixelateCmd(ctx) {
    return withMediaEffect(ctx, '.pixelate', ['image'], 'gambar', async (m) => pixelateMedia(m.buffer, 'jpg'), 'image');
}

export async function brightenCmd(ctx) {
    return withMediaEffect(ctx, '.brighten', ['image'], 'gambar', async (m) => adjustBrightness(m.buffer, 'jpg', 0.3), 'image');
}

export async function darkenCmd(ctx) {
    return withMediaEffect(ctx, '.darken', ['image'], 'gambar', async (m) => adjustBrightness(m.buffer, 'jpg', -0.3), 'image');
}

export async function reverseVideoCmd(ctx) {
    const media = await getQuotedMediaBuffer(ctx, ['video']);
    if (!media) return ctx.reply(NO_MEDIA_MSG('.reversevideo', 'video'));
    try {
        const result = await reverseVideo(media.buffer);
        await ctx.sock.sendMessage(ctx.jid, { video: result, caption: '⏪ Video dibalik' }, { quoted: ctx.msg });
    } catch (err) { await ctx.reply(`❌ Gagal: ${err.message}`); }
}

export async function flipVerticalCmd(ctx) {
    return withMediaEffect(ctx, '.flipvertical', ['image', 'video'], 'gambar/video', async (m) => {
        const ext = m.mediaType === 'video' ? 'mp4' : 'jpg';
        return flipVertical(m.buffer, ext);
    }, 'image');
}

export async function squareCropCmd(ctx) {
    return withMediaEffect(ctx, '.square', ['image'], 'gambar', async (m) => squareCrop(m.buffer, 'jpg'), 'image');
}

export async function watermarkCmd(ctx) {
    const text = ctx.args.join(' ').trim();
    if (!text) return ctx.reply('📌 Cara pakai: reply gambar dengan caption *.watermark [teks]*');
    const media = await getQuotedMediaBuffer(ctx, ['image']);
    if (!media) return ctx.reply(NO_MEDIA_MSG('.watermark [teks]', 'gambar'));
    try {
        const result = await addWatermark(media.buffer, 'jpg', text);
        await ctx.sock.sendMessage(ctx.jid, { image: result }, { quoted: ctx.msg });
    } catch (err) {
        await ctx.reply(`❌ Gagal: ${err.message}`);
    }
}
