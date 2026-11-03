// ═══════════════════════════════════════════════════════════════════
//  MEDIACOMMANDS3.JS — 10 command transformasi gaya AI (.tobotak dkk)
// ═══════════════════════════════════════════════════════════════════
//  Backend/logic ada di lib/imageStyleTransfer.js — WAJIB baca catatan
//  keandalan di file itu sebelum berharap ini 100% jalan mulus.

import { transformImageStyle } from '../lib/imageStyleTransfer.js';

async function getQuotedImageBuffer(ctx) {
    const ctxInfo = ctx.msg.message?.extendedTextMessage?.contextInfo;
    const quotedMessage = ctxInfo?.quotedMessage;
    let targetMsg = null;

    if (quotedMessage?.imageMessage) {
        targetMsg = { key: { remoteJid: ctx.jid, id: ctxInfo.stanzaId, participant: ctxInfo.participant }, message: quotedMessage };
    } else if (ctx.msg.message?.imageMessage) {
        targetMsg = ctx.msg;
    }
    if (!targetMsg) return null;

    const { downloadMediaMessage } = await import('@whiskeysockets/baileys');
    const buffer = await downloadMediaMessage(targetMsg, 'buffer', {});
    return buffer;
}

async function runStyleTransform(ctx, commandName, promptText) {
    const buffer = await getQuotedImageBuffer(ctx);
    if (!buffer) return ctx.reply(`📌 Kirim foto dengan caption *${commandName}*, atau reply foto lalu ketik *${commandName}*.`);

    await ctx.reply('🎨 Lagi diproses AI, tunggu bentar ya (bisa 10-30 detik)...');
    try {
        const resultBuffer = await transformImageStyle(buffer, 'image/jpeg', promptText);
        await ctx.sock.sendMessage(ctx.jid, { image: resultBuffer }, { quoted: ctx.msg });
    } catch (err) {
        await ctx.reply(`❌ Gagal proses gambar.\n\n_Detail: ${err.message.slice(0, 300)}_`);
    }
}

export async function toBotakCmd(ctx) {
    return runStyleTransform(ctx, '.tobotak', 'Edit this photo so the person appears completely bald (no hair). Keep the face, expression, clothing, and background exactly the same.');
}

export async function toChibiCmd(ctx) {
    return runStyleTransform(ctx, '.tochibi', 'Redraw this photo as a cute chibi-style anime illustration with an oversized head and small body, while keeping the recognizable features and outfit.');
}

export async function toFiguraCmd(ctx) {
    return runStyleTransform(ctx, '.tofigura', 'Transform this photo into a realistic collectible action figure toy, displayed in blister packaging, professional toy photography style.');
}

export async function toGhibliCmd(ctx) {
    return runStyleTransform(ctx, '.toghibli', 'Redraw this photo as a hand-painted anime illustration inspired by classic Japanese animation studio art style, soft colors, painterly background.');
}

export async function toHijabCmd(ctx) {
    return runStyleTransform(ctx, '.tohijab', 'Edit this photo so the person is wearing a modest, neatly-styled hijab headscarf. Keep the face and background exactly the same.');
}

export async function toLegoCmd(ctx) {
    return runStyleTransform(ctx, '.tolego', 'Transform this photo into a LEGO minifigure character, plastic brick toy aesthetic, studio product photography style.');
}

export async function toHitamCmd(ctx) {
    return runStyleTransform(ctx, '.tohitam', 'Convert this photo into a dramatic high-contrast black and white noir photography style with deep shadows.');
}

export async function to3dCmd(ctx) {
    return runStyleTransform(ctx, '.to3d', 'Transform this photo into a 3D rendered animated movie character, Pixar-style, smooth shading and rounded features.');
}

export async function toRobloxCmd(ctx) {
    return runStyleTransform(ctx, '.toroblox', 'Transform this photo into a Roblox avatar character, blocky 3D game aesthetic with plastic-like textures.');
}

export async function toOilPaintingCmd(ctx) {
    return runStyleTransform(ctx, '.tooilpainting', 'Transform this photo into a classical oil painting artwork with visible brushstrokes and rich painterly texture, museum gallery style.');
}
