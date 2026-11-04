/**
 * commands/creativeTools.js — Creative Tools for MASTER MD
 * Developed by AHSAN (03107260507) • Version 3.0.0
 * Includes: Background Remover, Telegram Sticker Pack Downloader, Media Enhancers
 */

import axios from 'axios';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { downloadContentFromMessage } from '@whiskeysockets/baileys';

// Helper to download media from quoted or direct message
async function downloadMedia(msg) {
    let quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    let messageType = '';
    let targetMsg = null;

    if (quoted) {
        if (quoted.imageMessage) {
            messageType = 'image';
            targetMsg = quoted.imageMessage;
        } else if (quoted.videoMessage) {
            messageType = 'video';
            targetMsg = quoted.videoMessage;
        } else if (quoted.stickerMessage) {
            messageType = 'sticker';
            targetMsg = quoted.stickerMessage;
        }
    } else if (msg.message?.imageMessage) {
        messageType = 'image';
        targetMsg = msg.message.imageMessage;
    } else if (msg.message?.videoMessage) {
        messageType = 'video';
        targetMsg = msg.message.videoMessage;
    }

    if (!targetMsg || !messageType) return null;

    const stream = await downloadContentFromMessage(targetMsg, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }
    return { buffer, type: messageType };
}

// ─── 1. BACKGROUND REMOVER (.removebg) ──────────────────────────────────────
export async function handleRemoveBg(ctx) {
    const { sock, jid, msg, reply } = ctx;

    const media = await downloadMedia(msg);
    if (!media || media.type !== 'image') {
        return reply('📸 Please reply to or send an image with caption `.removebg` to remove its background!');
    }

    try {
        // High-speed free background removal via remove-bg API
        const form = new FormData();
        form.append('image', new Blob([media.buffer], { type: 'image/png' }), 'image.png');

        const res = await axios.post('https://api.slayer-cloud.tech/api/tools/removebg', form, {
            headers: { 'Content-Type': 'multipart/form-data' },
            responseType: 'arraybuffer',
            timeout: 30000
        }).catch(async () => {
            // Fallback API
            return await axios.post('https://api.betabotz.eu.org/api/tools/removebg', form, {
                headers: { 'Content-Type': 'multipart/form-data' },
                responseType: 'arraybuffer',
                timeout: 30000
            });
        });

        if (res.data) {
            return await sock.sendMessage(jid, {
                image: Buffer.from(res.data),
                caption: `✅ *Background Removed Successfully!*\n⚡ Powered by MASTER MD • Dev: AHSAN (03107260507)`
            });
        }
    } catch (e) {
        return reply(`❌ Failed to remove background: ${e.message}`);
    }
}

// ─── 2. TELEGRAM STICKER PACK DOWNLOADER (.tgsticker) ───────────────────────
export async function handleTgSticker(ctx) {
    const { sock, jid, args, reply } = ctx;
    const url = args[0];

    if (!url || !url.includes('t.me/addstickers/')) {
        return reply('📌 Please provide a valid Telegram sticker pack link!\nExample: `.tgsticker https://t.me/addstickers/animals`');
    }

    const packName = url.split('t.me/addstickers/')[1]?.split('?')[0]?.trim();
    if (!packName) return reply('❌ Could not parse sticker pack name from link.');

    try {
        const res = await axios.get(`https://api.telegram.org/bot8934387851:AAGNkxRA-4ex3MYnRaThxWlNAdN8Z8862lU/getStickerSet?name=${encodeURIComponent(packName)}`, {
            timeout: 15000
        });

        if (!res.data?.ok || !res.data?.result?.stickers?.length) {
            return reply('❌ Sticker pack not found or is private.');
        }

        const stickers = res.data.result.stickers.slice(0, 10); // Grab first 10
        await reply(`📦 Found sticker pack: *${res.data.result.title}* (${stickers.length} stickers). Delivering...`);

        for (const st of stickers) {
            try {
                const fileRes = await axios.get(`https://api.telegram.org/bot8934387851:AAGNkxRA-4ex3MYnRaThxWlNAdN8Z8862lU/getFile?file_id=${st.file_id}`);
                const filePath = fileRes.data?.result?.file_path;
                if (!filePath) continue;

                const fileUrl = `https://api.telegram.org/file/bot8934387851:AAGNkxRA-4ex3MYnRaThxWlNAdN8Z8862lU/${filePath}`;
                const fileBuf = await axios.get(fileUrl, { responseType: 'arraybuffer' });

                await sock.sendMessage(jid, {
                    sticker: Buffer.from(fileBuf.data)
                });
            } catch {}
        }
    } catch (e) {
        return reply(`❌ Telegram sticker fetch note: ${e.message}`);
    }
}
