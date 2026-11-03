import path from 'path';
import os from 'os';
import pino from 'pino';
import crypto from 'crypto';
import baileysPkg, {
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    DisconnectReason,
    Browsers,
    delay
} from '@whiskeysockets/baileys';
import { createSession, updateSession, getSession } from './sessionStore.js';

// Self-contained Baileys compatibility wrapper
const makeWASocket =
    typeof baileysPkg === 'function' ? baileysPkg :
    baileysPkg && typeof baileysPkg.default === 'function' ? baileysPkg.default :
    baileysPkg && typeof baileysPkg.makeWASocket === 'function' ? baileysPkg.makeWASocket :
    undefined;

export const maxDuration = 60;

function normalizePhoneNumber(raw) {
    let n = String(raw || '').replace(/[^0-9]/g, '');
    if (n.startsWith('00')) n = n.slice(2);
    if (n.startsWith('920') && n.length === 13) n = '92' + n.slice(3);
    else if (n.startsWith('9203') && n.length >= 13) n = '92' + n.slice(3);
    else if (n.startsWith('03') && n.length === 11) n = '92' + n.slice(1);
    else if (n.startsWith('0') && n.length === 11) n = '92' + n.slice(1);
    else if (n.startsWith('3') && n.length === 10) n = '92' + n;
    else if (n.startsWith('910') && n.length === 13) n = '91' + n.slice(3);
    else if (n.startsWith('440') && n.length === 13) n = '44' + n.slice(3);
    else if (n.startsWith('620') && (n.length === 13 || n.length === 14)) n = '62' + n.slice(3);
    return n;
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method === 'GET') {
        return res.status(200).json({
            success: true,
            service: 'MASTER MD Web Pairing API',
            developer: 'AHSAN',
            status: 'online'
        });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method Not Allowed. Use POST.' });
    }

    try {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
        let rawNumber = normalizePhoneNumber(body.phoneNumber);

        if (!rawNumber || rawNumber.length < 10 || rawNumber.length > 15) {
            return res.status(400).json({
                success: false,
                message: 'Invalid phone number! Please enter 10 to 15 digits including country code (e.g. 923107260507).'
            });
        }

        const sessionId = crypto.randomBytes(6).toString('hex');
        const sessionDir = path.join(os.tmpdir(), `master_md_${sessionId}`);

        createSession(sessionId, { phoneNumber: rawNumber, status: 'initializing' });

        const pinoLog = pino({ level: 'silent' });
        let credsReceived = false;
        let activeSock = null;
        let reconnectCount = 0;

        async function launchSocket(isReconnect = false) {
            const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
            const { version } = await fetchLatestBaileysVersion().catch(() => ({ version: [2, 3000, 1037641644] }));

            const sock = makeWASocket({
                version,
                logger: pinoLog,
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pinoLog)
                },
                printQRInTerminal: false,
                browser: Browsers.macOS('Chrome'),
                markOnlineOnConnect: true,
                syncFullHistory: false,
                shouldSyncHistoryMessage: () => false,
                generateHighQualityLinkPreview: false,
                connectTimeoutMs: 60_000,
                defaultQueryTimeoutMs: 60_000,
                keepAliveIntervalMs: 10_000,
            });

            activeSock = sock;
            updateSession(sessionId, { sock });

            sock.ev.on('creds.update', async () => {
                try {
                    await saveCreds();
                    credsReceived = true;
                    updateSession(sessionId, {
                        status: 'logging_in',
                        message: 'Credentials verified! Finalizing WhatsApp session...'
                    });
                } catch (e) {
                    console.warn('saveCreds warning:', e.message);
                }
            });

            // ─── Incoming Message Command Handler (.menu, .ping, .alive, etc.) ───
            sock.ev.on('messages.upsert', async ({ messages, type }) => {
                if (type !== 'notify' && type !== 'append') return;

                for (const m of messages) {
                    if (!m.message) continue;

                    const from = m.key.remoteJid;
                    if (!from || from === 'status@broadcast') continue;

                    const bodyText = (
                        m.message.conversation ||
                        m.message.extendedTextMessage?.text ||
                        m.message.imageMessage?.caption ||
                        m.message.videoMessage?.caption ||
                        m.message.buttonsResponseMessage?.selectedButtonId ||
                        m.message.listResponseMessage?.singleSelectReply?.selectedRowId ||
                        m.message.templateButtonReplyMessage?.selectedId ||
                        ''
                    ).trim();

                    if (!bodyText.startsWith('.') && !bodyText.startsWith('!') && !bodyText.startsWith('/')) continue;

                    const prefix = bodyText[0];
                    const [rawCmd, ...args] = bodyText.slice(1).trim().split(/\s+/);
                    const cmd = (rawCmd || '').toLowerCase();
                    const text = args.join(' ');
                    const pushName = m.pushName || 'Friend';

                    // 1. .ping / .speed
                    if (cmd === 'ping' || cmd === 'speed') {
                        const start = Date.now();
                        const latency = Math.abs(Date.now() - (m.messageTimestamp * 1000 || start));
                        await sock.sendMessage(from, {
                            text: `⚡ *PONG!* \`\`\`${latency} ms\`\`\`\n\n🤖 *Bot:* MASTER MD\n👑 *Developer:* AHSAN (03107260507)\n⚡ *Status:* Online & Lightning Fast!`
                        }, { quoted: m }).catch(() => {});
                        continue;
                    }

                    // 2. .alive
                    if (cmd === 'alive') {
                        await sock.sendMessage(from, {
                            text:
`╔══════════════════════════════════╗\n` +
`║      ⚡ MASTER MD IS ALIVE ⚡    ║\n` +
`╚══════════════════════════════════╝\n\n` +
`Assalam-o-Alaikum *${pushName}*!\n\n` +
`🤖 *Bot Name:* MASTER MD\n` +
`👑 *Developer:* AHSAN\n` +
`📱 *Dev Number:* 03107260507\n` +
`📢 *Channel:* https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46\n` +
`⚡ *Speed:* 100% Operational & Active\n\n` +
`Type *.menu* to view all commands!`
                        }, { quoted: m }).catch(() => {});
                        continue;
                    }

                    // 3. .owner / .creator / .developer
                    if (cmd === 'owner' || cmd === 'creator' || cmd === 'developer') {
                        await sock.sendMessage(from, {
                            text:
`👑 *MASTER MD OFFICIAL DEVELOPER*\n\n` +
`• *Developer:* AHSAN\n` +
`• *Phone:* +92 310 7260507\n` +
`• *WhatsApp:* https://wa.me/923107260507\n` +
`• *Official Channel:* https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46\n\n` +
`> © 2026 MASTER MD • All Rights Reserved to AHSAN`
                        }, { quoted: m }).catch(() => {});
                        continue;
                    }

                    // 4. .menu / .help / .allmenu
                    if (cmd === 'menu' || cmd === 'help' || cmd === 'allmenu') {
                        const menuText =
`╔══════════════════════════════════╗\n` +
`║      ⚡ MASTER MD MAIN MENU ⚡   ║\n` +
`║        DEVELOPER: AHSAN          ║\n` +
`╚══════════════════════════════════╝\n\n` +
`👋 Assalam-o-Alaikum, *${pushName}*!\n\n` +
`🤖 *Bot Name:* MASTER MD v3.0.0\n` +
`👑 *Developer:* AHSAN\n` +
`📱 *Dev Contact:* 03107260507\n` +
`📢 *Channel:* https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46\n` +
`⚡ *Prefix:* [ ${prefix} ]\n` +
`📅 *Date:* ${new Date().toLocaleDateString('en-GB')}\n\n` +
`╭───『 🛡️ ADMIN COMMANDS 』───\n` +
`│ • ${prefix}kick @user\n` +
`│ • ${prefix}add 92300xxx\n` +
`│ • ${prefix}promote @user\n` +
`│ • ${prefix}demote @user\n` +
`│ • ${prefix}tagall [message]\n` +
`│ • ${prefix}hidetag [message]\n` +
`│ • ${prefix}mute / ${prefix}unmute\n` +
`│ • ${prefix}setdesc / ${prefix}setname\n` +
`╰────────────────────────\n\n` +
`╭───『 📥 DOWNLOADER 』───\n` +
`│ • ${prefix}tiktok <url>\n` +
`│ • ${prefix}instagram <url>\n` +
`│ • ${prefix}ytmp3 <song name/url>\n` +
`│ • ${prefix}ytmp4 <video name/url>\n` +
`│ • ${prefix}mediafire <url>\n` +
`│ • ${prefix}play <song title>\n` +
`╰────────────────────────\n\n` +
`╭───『 🤖 AI & CHAT 』───\n` +
`│ • ${prefix}ai <question>\n` +
`│ • ${prefix}masterai <question>\n` +
`│ • ${prefix}gpt <query>\n` +
`╰────────────────────────\n\n` +
`╭───『 🛠️ TOOLS & UTILS 』───\n` +
`│ • ${prefix}sticker / ${prefix}s (reply photo)\n` +
`│ • ${prefix}toimg (reply sticker)\n` +
`│ • ${prefix}tinyurl <link>\n` +
`│ • ${prefix}translate <lang> <text>\n` +
`│ • ${prefix}ping / ${prefix}speed\n` +
`│ • ${prefix}alive\n` +
`│ • ${prefix}owner\n` +
`╰────────────────────────\n\n` +
`╭───『 🎮 FUN & GAMES 』───\n` +
`│ • ${prefix}quote\n` +
`│ • ${prefix}fact\n` +
`│ • ${prefix}joke\n` +
`│ • ${prefix}dare\n` +
`│ • ${prefix}truth\n` +
`╰────────────────────────\n\n` +
`> © 2026 MASTER MD • All Rights Reserved to AHSAN\n` +
`> Join Channel: https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46`;

                        await sock.sendMessage(from, { text: menuText }, { quoted: m }).catch(() => {});
                        continue;
                    }

                    // 5. .ai / .masterai / .gpt
                    if (cmd === 'ai' || cmd === 'masterai' || cmd === 'gpt') {
                        if (!text) {
                            await sock.sendMessage(from, { text: `⚠️ Please ask a question!\nExample: *${prefix}${cmd} Who created you?*` }, { quoted: m });
                            continue;
                        }
                        await sock.sendMessage(from, {
                            text: `🤖 *MASTER AI:*\n\nHello *${pushName}*! Regarding "*${text}*":\nI am *MASTER MD*, WhatsApp AI Bot developed by *AHSAN* (03107260507). All systems are running at maximum speed!`
                        }, { quoted: m });
                        continue;
                    }
                }
            });

            sock.ev.on('connection.update', async (update) => {
                const { connection, lastDisconnect, isNewLogin } = update;

                if (connection === 'connecting' || isNewLogin) {
                    updateSession(sessionId, {
                        status: 'logging_in',
                        message: 'WhatsApp is linking your device. Please wait!'
                    });
                }

                if (connection === 'open') {
                    updateSession(sessionId, {
                        status: 'connected',
                        message: 'Connected successfully! Welcome to MASTER MD.'
                    });

                    // Send official welcome message to user's chat
                    try {
                        const targetJid = `${rawNumber}@s.whatsapp.net`;
                        await sock.sendMessage(targetJid, {
                            text:
`╔══════════════════════════════════╗\n` +
`║   ⚡ MASTER MD CONNECTED! ⚡     ║\n` +
`║       DEVELOPER: AHSAN           ║\n` +
`╚══════════════════════════════════╝\n\n` +
`Assalam-o-Alaikum! Your WhatsApp is now successfully linked with *MASTER MD*.\n\n` +
`🤖 *Bot Name:* MASTER MD\n` +
`👑 *Developer:* AHSAN\n` +
`⚡ *Status:* Active & Online\n` +
`📢 *Channel:* https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46\n\n` +
`Type *.menu* in any chat to view all commands.\n` +
`> © 2026 MASTER MD • All Rights Reserved to AHSAN`
                        });
                    } catch (e) {
                        console.error('Welcome message send error:', e.message);
                    }
                } else if (connection === 'close') {
                    const statusCode = lastDisconnect?.error?.output?.statusCode;
                    const isLoggedOut = statusCode === DisconnectReason?.loggedOut || statusCode === 401 || statusCode === 403;

                    // Reconnect on 515 (restartRequired)
                    if (!isLoggedOut && (credsReceived || state.creds.registered)) {
                        reconnectCount++;
                        if (reconnectCount <= 10) {
                            console.log(`Reconnecting to maintain active bot session (attempt ${reconnectCount})... Code: ${statusCode}`);
                            setTimeout(() => launchSocket(true), 2000);
                            return;
                        }
                    }

                    if (isLoggedOut) {
                        updateSession(sessionId, { status: 'error', message: 'Authentication rejected or session logged out.' });
                    }
                }
            });

            return sock;
        }

        const sock = await launchSocket(false);

        updateSession(sessionId, { status: 'handshaking' });
        await delay(4500);

        let pairingCode = null;
        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                pairingCode = await activeSock.requestPairingCode(rawNumber);
                if (pairingCode) break;
            } catch (err) {
                console.warn(`Pairing code attempt ${attempt} failed:`, err.message);
                if (attempt === 3) throw err;
                await delay(2000);
            }
        }

        updateSession(sessionId, { code: pairingCode, status: 'waiting_for_user' });

        return res.status(200).json({
            success: true,
            sessionId,
            code: pairingCode,
            message: 'Pairing code generated successfully.'
        });

    } catch (error) {
        console.error('Pairing generation error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to generate pairing code.'
        });
    }
}
