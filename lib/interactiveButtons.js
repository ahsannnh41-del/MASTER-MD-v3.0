// lib/interactiveButtons.js
// ═══════════════════════════════════════════════════════════════════════════════
// MASTER MD — Next-Gen Interactive Buttons, Lists & Carousel Engine
// Developed by: AHSAN (03107260507) • Version: 3.0.0
// Inspired by NOX-BOT & CODE-main architecture.
// Uses viewOnceMessage wrapped interactiveMessage for 100% native buttons
// without "Waiting for this message" decryption clock bugs!
// ═══════════════════════════════════════════════════════════════════════════════

import * as baileys from '@whiskeysockets/baileys';
import fs from 'fs';
import path from 'path';

const baileysResolved = baileys.default || baileys;
const proto = baileys.proto || baileysResolved.proto;
const generateWAMessageFromContent = baileys.generateWAMessageFromContent || baileysResolved.generateWAMessageFromContent;
const prepareWAMessageMedia = baileys.prepareWAMessageMedia || baileysResolved.prepareWAMessageMedia;
const WA_DEFAULT_EPHEMERAL = baileys.WA_DEFAULT_EPHEMERAL || baileysResolved.WA_DEFAULT_EPHEMERAL || 604800;

/**
 * Cache for outbound interactive messages to ensure instant resolution on decryption retries
 */
const outboundStore = new Map();

export function storeOutboundMessage(id, message) {
    if (!id || !message) return;
    outboundStore.set(id, message);
    if (outboundStore.size > 2000) {
        const oldest = outboundStore.keys().next().value;
        outboundStore.delete(oldest);
    }
}

export function getOutboundMessage(id) {
    return outboundStore.get(id);
}

/**
 * Normalizes button input into Baileys NativeFlow button stanzas
 * Supports:
 * - Simple tuple: ['Button Text', '.command']
 * - Object: { name: 'quick_reply', display_text: 'Text', id: '.cmd' }
 * - Object: { name: 'cta_url', display_text: 'Open Link', url: 'https://...' }
 * - Object: { name: 'cta_copy', display_text: 'Copy Code', copy_code: 'CODE' }
 */
export function formatNativeButtons(buttons = []) {
    const formatted = [];

    for (const btn of buttons) {
        if (!btn) continue;

        // Tuple format: ['Label', '.id']
        if (Array.isArray(btn)) {
            const [text, id] = btn;
            formatted.push({
                name: 'quick_reply',
                buttonParamsJson: JSON.stringify({
                    display_text: String(text || 'Action'),
                    id: String(id || '')
                })
            });
            continue;
        }

        // Direct object format
        if (typeof btn === 'object') {
            const type = btn.name || btn.type || 'quick_reply';

            if (type === 'quick_reply') {
                formatted.push({
                    name: 'quick_reply',
                    buttonParamsJson: JSON.stringify({
                        display_text: String(btn.display_text || btn.text || btn.title || 'Action'),
                        id: String(btn.id || btn.command || '')
                    })
                });
            } else if (type === 'cta_url' || type === 'url') {
                formatted.push({
                    name: 'cta_url',
                    buttonParamsJson: JSON.stringify({
                        display_text: String(btn.display_text || btn.text || 'Visit Link'),
                        url: String(btn.url || btn.link || 'https://whatsapp.com'),
                        merchant_url: String(btn.url || btn.link || 'https://whatsapp.com')
                    })
                });
            } else if (type === 'cta_copy' || type === 'copy') {
                formatted.push({
                    name: 'cta_copy',
                    buttonParamsJson: JSON.stringify({
                        display_text: String(btn.display_text || btn.text || 'Copy'),
                        copy_code: String(btn.copy_code || btn.code || '')
                    })
                });
            } else if (type === 'single_select' || type === 'list') {
                formatted.push({
                    name: 'single_select',
                    buttonParamsJson: JSON.stringify({
                        title: String(btn.title || 'Select Option'),
                        sections: btn.sections || []
                    })
                });
            }
        }
    }

    return formatted;
}

/**
 * Send an interactive Button message (with optional banner image/video)
 * Wrapped inside viewOnceMessage to guarantee display on modern WhatsApp clients
 */
export async function sendButton(sock, jid, {
    text = '',
    footer = '⚡ MASTER MD • Developed by AHSAN',
    title = '',
    media = null,       // Buffer, local filepath, or { image: buffer } / { video: buffer }
    buttons = [],       // Formatted buttons
    quoted = null,
    options = {}
} = {}) {
    const formattedButtons = formatNativeButtons(buttons);

    // Prepare media header if supplied
    let mediaAttachment = null;
    let hasMedia = false;

    if (media) {
        try {
            if (Buffer.isBuffer(media)) {
                mediaAttachment = await prepareWAMessageMedia(
                    { image: media },
                    { upload: sock.waUploadToServer }
                );
                hasMedia = true;
            } else if (typeof media === 'string' && fs.existsSync(media)) {
                const buf = fs.readFileSync(media);
                const isVideo = media.endsWith('.mp4');
                mediaAttachment = await prepareWAMessageMedia(
                    isVideo ? { video: buf, gifPlayback: true } : { image: buf },
                    { upload: sock.waUploadToServer }
                );
                hasMedia = true;
            } else if (typeof media === 'object') {
                mediaAttachment = await prepareWAMessageMedia(
                    media,
                    { upload: sock.waUploadToServer }
                );
                hasMedia = true;
            }
        } catch (mediaErr) {
            console.warn('[InteractiveButtons] Media preparation warning:', mediaErr.message);
        }
    }

    const interactiveMessage = {
        body: {
            text: text || ''
        },
        footer: {
            text: footer || '⚡ MASTER MD • Dev: AHSAN'
        },
        header: {
            title: title || '',
            hasMediaAttachment: hasMedia,
            imageMessage: mediaAttachment?.imageMessage || null,
            videoMessage: mediaAttachment?.videoMessage || null
        },
        nativeFlowMessage: {
            buttons: formattedButtons,
            messageParamsJson: JSON.stringify({
                bottom_sheet: {
                    in_thread_buttons_limit: 1
                }
            })
        }
    };

    const messageContent = proto.Message.fromObject({
        viewOnceMessage: {
            message: {
                interactiveMessage
            }
        }
    });

    try {
        const isSelf = !!(quoted?.key?.fromMe || (sock.user?.id && jid.includes(sock.user.id.split('@')[0].split(':')[0])));
        const quoteObj = isSelf ? null : quoted;

        const msgs = await generateWAMessageFromContent(jid, messageContent, {
            userJid: sock.user?.jid || (sock.user?.id ? `${sock.user.id.split(':')[0]}@s.whatsapp.net` : undefined),
            quoted: quoteObj,
            upload: sock.waUploadToServer,
            ephemeralExpiration: WA_DEFAULT_EPHEMERAL
        });

        if (msgs?.key?.id && msgs?.message) {
            storeOutboundMessage(msgs.key.id, msgs.message);
        }

        await sock.relayMessage(jid, msgs.message, {
            messageId: msgs.key.id
        });

        return msgs;
    } catch (relayErr) {
        console.warn('[InteractiveButtons] Relay fallback triggering:', relayErr.message);
        // Bulletproof media + text fallback
        let fallbackText = `${text}\n\n`;
        if (formattedButtons.length > 0) {
            fallbackText += `*Available Options:*\n`;
            formattedButtons.forEach((b, idx) => {
                try {
                    const parsed = JSON.parse(b.buttonParamsJson);
                    if (parsed.id) {
                        fallbackText += `${idx + 1}. \`${parsed.id}\` — ${parsed.display_text}\n`;
                    } else if (parsed.url) {
                        fallbackText += `🔗 ${parsed.display_text}: ${parsed.url}\n`;
                    }
                } catch {}
            });
        }
        fallbackText += `\n_${footer}_`;

        if (media) {
            try {
                let imgBuf = Buffer.isBuffer(media) ? media : (typeof media === 'string' && fs.existsSync(media) ? fs.readFileSync(media) : null);
                if (imgBuf) {
                    return await sock.sendMessage(jid, {
                        image: imgBuf,
                        caption: fallbackText.trim()
                    }, { quoted: isSelf ? null : quoted });
                }
            } catch {}
        }
        return await sock.sendMessage(jid, { text: fallbackText.trim() }, { quoted: isSelf ? null : quoted });
    }
}

/**
 * Send an interactive Single-Select List Sheet
 */
export async function sendList(sock, jid, {
    title = '',
    text = '',
    footer = '⚡ MASTER MD • Developed by AHSAN',
    buttonText = '📂 Browse Commands',
    sections = [],
    quoted = null,
    options = {}
} = {}) {
    const message = {
        interactiveMessage: {
            header: {
                title: title || ''
            },
            body: {
                text: text || ''
            },
            footer: {
                text: footer || '⚡ MASTER MD'
            },
            nativeFlowMessage: {
                buttons: [
                    {
                        name: 'single_select',
                        buttonParamsJson: JSON.stringify({
                            title: buttonText,
                            sections
                        })
                    }
                ],
                messageParamsJson: JSON.stringify({
                    bottom_sheet: {
                        in_thread_buttons_limit: 1
                    }
                })
            }
        }
    };

    const messageContent = proto.Message.fromObject({
        viewOnceMessage: {
            message
        }
    });

    try {
        const isSelf = !!(quoted?.key?.fromMe || (sock.user?.id && jid.includes(sock.user.id.split('@')[0].split(':')[0])));
        const quoteObj = isSelf ? null : quoted;

        const msgs = await generateWAMessageFromContent(jid, messageContent, {
            userJid: sock.user?.jid || (sock.user?.id ? `${sock.user.id.split(':')[0]}@s.whatsapp.net` : undefined),
            quoted: quoteObj,
            upload: sock.waUploadToServer,
            ephemeralExpiration: WA_DEFAULT_EPHEMERAL
        });

        if (msgs?.key?.id && msgs?.message) {
            storeOutboundMessage(msgs.key.id, msgs.message);
        }

        await sock.relayMessage(jid, msgs.message, {
            messageId: msgs.key.id
        });

        return msgs;
    } catch (err) {
        console.warn('[InteractiveButtons] sendList fallback:', err.message);
        let fallbackText = `*${title}*\n\n${text}\n\n`;
        sections.forEach(sec => {
            if (sec.title) fallbackText += `*${sec.title}*\n`;
            (sec.rows || []).forEach(r => {
                fallbackText += `• \`${r.id || r.title}\` — ${r.title}${r.description ? ` (${r.description})` : ''}\n`;
            });
            fallbackText += '\n';
        });
        fallbackText += `_${footer}_`;
        return await sock.sendMessage(jid, { text: fallbackText.trim() });
    }
}

/**
 * Send an Interactive Slider / Carousel Cards Message
 */
export async function sendCarousel(sock, jid, {
    text = '',
    footer = '⚡ MASTER MD • Developed by AHSAN',
    cards = [],
    quoted = null,
    options = {}
} = {}) {
    if (!cards || cards.length === 0) {
        return await sock.sendMessage(jid, { text });
    }

    try {
        const builtCards = await Promise.all(cards.map(async (card) => {
            let mediaAttachment = null;
            let hasMedia = false;

            if (card.media) {
                try {
                    if (Buffer.isBuffer(card.media)) {
                        mediaAttachment = await prepareWAMessageMedia(
                            { image: card.media },
                            { upload: sock.waUploadToServer }
                        );
                        hasMedia = true;
                    } else if (typeof card.media === 'string' && fs.existsSync(card.media)) {
                        const buf = fs.readFileSync(card.media);
                        mediaAttachment = await prepareWAMessageMedia(
                            { image: buf },
                            { upload: sock.waUploadToServer }
                        );
                        hasMedia = true;
                    }
                } catch {}
            }

            const cardButtons = formatNativeButtons(card.buttons || []);

            return {
                body: proto.Message.InteractiveMessage.Body.fromObject({
                    text: card.text || ''
                }),
                footer: proto.Message.InteractiveMessage.Footer.fromObject({
                    text: card.footer || footer
                }),
                header: proto.Message.InteractiveMessage.Header.fromObject({
                    title: card.title || '',
                    hasMediaAttachment: hasMedia,
                    imageMessage: mediaAttachment?.imageMessage || null,
                    videoMessage: mediaAttachment?.videoMessage || null
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                    buttons: cardButtons,
                    messageParamsJson: ''
                })
            };
        }));

        const interactiveMessage = proto.Message.InteractiveMessage.create({
            body: proto.Message.InteractiveMessage.Body.fromObject({
                text: text || ''
            }),
            footer: proto.Message.InteractiveMessage.Footer.fromObject({
                text: footer || '⚡ MASTER MD • Dev: AHSAN'
            }),
            header: proto.Message.InteractiveMessage.Header.fromObject({
                title: '⚡ MASTER MD POWER CARDS ⚡',
                hasMediaAttachment: false
            }),
            carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                cards: builtCards
            })
        });

        const messageContent = proto.Message.fromObject({
            viewOnceMessage: {
                message: {
                    interactiveMessage
                }
            }
        });

        const isSelf = !!(quoted?.key?.fromMe || (sock.user?.id && jid.includes(sock.user.id.split('@')[0].split(':')[0])));
        const quoteObj = isSelf ? null : quoted;

        const msgs = await generateWAMessageFromContent(jid, messageContent, {
            userJid: sock.user?.jid || (sock.user?.id ? `${sock.user.id.split(':')[0]}@s.whatsapp.net` : undefined),
            quoted: quoteObj,
            upload: sock.waUploadToServer,
            ephemeralExpiration: WA_DEFAULT_EPHEMERAL
        });

        if (msgs?.key?.id && msgs?.message) {
            storeOutboundMessage(msgs.key.id, msgs.message);
        }

        await sock.relayMessage(jid, msgs.message, {
            messageId: msgs.key.id
        });

        return msgs;
    } catch (err) {
        console.warn('[InteractiveButtons] sendCarousel fallback:', err.message);
        let fallback = `${text}\n\n`;
        cards.forEach((c, idx) => {
            fallback += `*${idx + 1}. ${c.title || 'Option'}*\n${c.text || ''}\n`;
            if (c.buttons) {
                c.buttons.forEach(b => {
                    const id = Array.isArray(b) ? b[1] : (b.id || b.url || '');
                    const label = Array.isArray(b) ? b[0] : (b.display_text || b.text || '');
                    fallback += `  ↳ \`${id}\` (${label})\n`;
                });
            }
            fallback += '\n';
        });
        fallback += `_${footer}_`;
        return await sock.sendMessage(jid, { text: fallback.trim() });
    }
}
