// server.js — Unified MASTER MD Full Engine + Web Pairing Portal
// Developer: AHSAN (03107260507)
// Official Channel: https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46

import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import os from 'os';
import pino from 'pino';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import baileysPkg, {
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    DisconnectReason,
    Browsers,
    delay
} from '@whiskeysockets/baileys';

// Import full bot core pipeline and commands
import { processIncomingMessage } from './lib/messagePipeline.js';
import { startTelegramPairingBot } from './lib/telegramPairing.js';
import { logPairingAttempt, markPairingConnected, getPairingHistory } from './lib/pairingTracker.js';
import settings from './setting.js';
import { verifyIntegrity } from './lib/integrity.js';

// Cryptographic anti-tamper runtime assertion
verifyIntegrity(settings);

const makeWASocket =
    typeof baileysPkg === 'function' ? baileysPkg :
    baileysPkg && typeof baileysPkg.default === 'function' ? baileysPkg.default :
    baileysPkg && typeof baileysPkg.makeWASocket === 'function' ? baileysPkg.makeWASocket :
    undefined;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files (Web Pairing Portal)
app.use(express.static(__dirname));
if (fs.existsSync(path.join(__dirname, 'public'))) {
    app.use(express.static(path.join(__dirname, 'public')));
}
if (fs.existsSync(path.join(__dirname, 'web-pairing'))) {
    app.use(express.static(path.join(__dirname, 'web-pairing')));
}

// In-Memory Session & Message Store for E2EE Retry Decryption
const sessions = new Map();
const messageStore = new Map();
let globalActiveSock = null;

// Ensure persistent session directory
const SESSION_DIR = path.join(__dirname, 'session');
if (!fs.existsSync(SESSION_DIR)) {
    fs.mkdirSync(SESSION_DIR, { recursive: true });
}

// ─── Attach Full 2000+ Command Engine to a Socket ───────────────────────────
function attachFullBotPipeline(sock, rawNumber) {
    globalActiveSock = sock;
    console.log(`\n🚀 [MASTER MD] Attaching Full 2000+ Command Engine for +${rawNumber || 'User'}...`);

    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        // Accept BOTH 'notify' (messages from others) and 'append' (messages sent by paired phone/self)
        if (type !== 'notify' && type !== 'append') return;

        for (const msg of messages) {
            try {
                if (!msg.message) continue;
                if (msg.key?.remoteJid === 'status@broadcast') continue;
                if (msg.key?.id) {
                    messageStore.set(msg.key.id, msg);
                    if (messageStore.size > 2000) {
                        const oldest = messageStore.keys().next().value;
                        messageStore.delete(oldest);
                    }
                }

                console.log(`[MASTER MD] 📩 Message received (${type}) from: ${msg.key?.remoteJid} (fromMe: ${msg.key?.fromMe})`);
                // Execute through the real MASTER MD pipeline (all 2000+ commands, admin, protection, media, RPG)
                await processIncomingMessage(sock, msg);
            } catch (err) {
                console.error(`[MASTER MD Pipeline Error]:`, err.message);
            }
        }
    });

    console.log(`✅ [MASTER MD] 2000+ Features Active & Ready! Developer: AHSAN\n`);
}

// ─── Full Bot Socket Launcher ──────────────────────────────────────────────
async function launchMasterBot(customDir = SESSION_DIR, rawNumber = '', onPairingReady = null) {
    if (globalActiveSock) {
        try {
            globalActiveSock.ev.removeAllListeners();
            globalActiveSock.end();
        } catch {}
    }

    const pinoLog = pino({ level: 'silent' });
    const { state, saveCreds } = await useMultiFileAuthState(customDir);
    const { version } = await fetchLatestBaileysVersion().catch(() => ({ version: [2, 3000, 1037641644] }));

    const sock = makeWASocket({
        version,
        logger: pinoLog,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pinoLog)
        },
        printQRInTerminal: false,
        browser: Browsers.ubuntu('Chrome'),
        markOnlineOnConnect: true,
        syncFullHistory: false,
        shouldSyncHistoryMessage: () => false,
        generateHighQualityLinkPreview: false,
        connectTimeoutMs: 60_000,
        defaultQueryTimeoutMs: 60_000,
        keepAliveIntervalMs: 10_000,
        getMessage: async (key) => {
            const m = messageStore.get(key.id);
            if (m?.message) return m.message;
            if (m) return m;
            return undefined;
        },
    });

    // Auto-index all outgoing messages to eliminate "Waiting for this message" decryption retries
    const originalRelay = sock.relayMessage.bind(sock);
    sock.relayMessage = async (jid, message, options = {}) => {
        const msgId = options.messageId || options.additionalAttributes?.id;
        if (msgId) {
            messageStore.set(msgId, { key: { remoteJid: jid, id: msgId }, message });
        }
        return await originalRelay(jid, message, options);
    };

    const originalSend = sock.sendMessage.bind(sock);
    sock.sendMessage = async (jid, content, options = {}) => {
        const sent = await originalSend(jid, content, options);
        if (sent?.key?.id && sent?.message) {
            messageStore.set(sent.key.id, sent);
        }
        return sent;
    };

    sock.ev.on('creds.update', async () => {
        try {
            await saveCreds();
            // Also mirror credentials to root session folder
            if (customDir !== SESSION_DIR && fs.existsSync(customDir)) {
                fs.cpSync(customDir, SESSION_DIR, { recursive: true, force: true });
            }
        } catch (e) {
            console.warn('saveCreds warning:', e.message);
        }
    });

    // Attach message processing pipeline immediately
    attachFullBotPipeline(sock, rawNumber);

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, isNewLogin } = update;

        if (connection === 'open') {
            console.log('\n' + '═'.repeat(60));
            console.log('⚡ MASTER MD — BOT ONLINE & FULLY CONNECTED!');
            console.log('👑 Developer : AHSAN (03107260507)');
            console.log('📢 Channel   : https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46');
            console.log('⚡ Features  : 2000+ Commands Active');
            console.log('═'.repeat(60) + '\n');

            if (rawNumber) {
                markPairingConnected(rawNumber);
                try {
                    const targetJid = `${rawNumber}@s.whatsapp.net`;
                    await sock.sendMessage(targetJid, {
                        text:
`╔══════════════════════════════════╗\n` +
`║   ⚡ MASTER MD CONNECTED! ⚡     ║\n` +
`║       DEVELOPER: AHSAN           ║\n` +
`╚══════════════════════════════════╝\n\n` +
`Assalam-o-Alaikum! Your WhatsApp is now successfully linked with *MASTER MD*.\n\n` +
`🤖 *Bot Name:* MASTER MD v3.0.0\n` +
`👑 *Developer:* AHSAN\n` +
`⚡ *Features:* 2000+ Commands Active\n` +
`📢 *Channel:* https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46\n\n` +
`Type *.menu* to explore all interactive features.\n` +
`> © 2026 MASTER MD • All Rights Reserved to AHSAN`
                    });
                } catch (e) {
                    console.error('Welcome message send error:', e.message);
                }
            }
        } else if (connection === 'close') {
            const statusCode = lastDisconnect?.error?.output?.statusCode;
            const isLoggedOut = statusCode === DisconnectReason?.loggedOut || statusCode === 401 || statusCode === 403;

            // Auto-reconnect for 515 (restartRequired)
            if (!isLoggedOut && state.creds.registered) {
                console.log(`[MASTER MD] Reconnecting socket (Code: ${statusCode})...`);
                setTimeout(() => launchMasterBot(customDir, rawNumber), 2000);
            }
        }
    });

    if (onPairingReady) {
        onPairingReady(sock);
    }

    return sock;
}

// ─── Auto-Start Existing Saved Session On Launch ────────────────────────────
if (fs.existsSync(path.join(SESSION_DIR, 'creds.json'))) {
    console.log('📂 Found existing credentials in ./session! Auto-starting MASTER MD...');
    launchMasterBot(SESSION_DIR, '').catch(err => {
        console.error('Failed to auto-start session:', err.message);
    });
}

// ─── API Routes for Web Pairing ─────────────────────────────────────────────
app.post('/api/pair', async (req, res) => {
    try {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
        let rawNumber = String(body.phoneNumber || '').replace(/[^0-9]/g, '');

        if (!rawNumber || rawNumber.length < 10 || rawNumber.length > 15) {
            return res.status(400).json({
                success: false,
                message: 'Invalid phone number! Please enter 10 to 15 digits including country code (e.g. 923107260507).'
            });
        }

        const sessionId = crypto.randomBytes(6).toString('hex');
        sessions.set(sessionId, { status: 'initializing', phoneNumber: rawNumber });

        // ── Respond IMMEDIATELY — don't block on WhatsApp handshake ──────────
        // Render has a 30s proxy timeout; pairing takes 10-20s so we must
        // return the sessionId now and let the client poll /api/status.
        res.status(200).json({
            success: true,
            sessionId,
            code: null,
            message: 'Pairing started. Poll /api/status for your code.'
        });

        // ── Run pairing in background (non-blocking) ─────────────────────────
        (async () => {
            try {
                let activeSock = null;

                await launchMasterBot(SESSION_DIR, rawNumber, (sock) => {
                    activeSock = sock;
                    sessions.set(sessionId, { status: 'handshaking', sock, phoneNumber: rawNumber });

                    sock.ev.on('connection.update', (update) => {
                        if (update.connection === 'connecting' || update.isNewLogin) {
                            sessions.set(sessionId, { status: 'logging_in', sock, phoneNumber: rawNumber });
                        }
                        if (update.connection === 'open') {
                            sessions.set(sessionId, { status: 'connected', sock, phoneNumber: rawNumber });
                        }
                    });
                });

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

                sessions.set(sessionId, {
                    status: 'waiting_for_user',
                    code: pairingCode,
                    sock: activeSock,
                    phoneNumber: rawNumber
                });

                logPairingAttempt(rawNumber, 'Web Portal', pairingCode);
                console.log(`✅ Pairing code ready for ${rawNumber}: ${pairingCode}`);

            } catch (bgErr) {
                console.error('Background pairing error:', bgErr.message);
                sessions.set(sessionId, { status: 'error', error: bgErr.message, phoneNumber: rawNumber });
            }
        })();

    } catch (error) {
        console.error('Pairing route error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to start pairing.'
        });
    }
});

app.get('/api/status', (req, res) => {
    const { id } = req.query;
    if (!id || !sessions.has(id)) {
        return res.status(200).json({ status: 'waiting', message: 'Waiting for session...' });
    }
    const sess = sessions.get(id);
    const hasCode = !!sess.code;
    return res.status(200).json({
        status: sess.status,
        code: sess.code || null,
        success: hasCode,
        error: sess.error || null,
        message: sess.status === 'connected'
            ? 'Connected successfully!'
            : hasCode
                ? 'Pairing code ready!'
                : sess.status === 'error'
                    ? (sess.error || 'Pairing failed.')
                    : 'Generating pairing code, please wait...'
    });
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', bot: 'MASTER MD', developer: 'AHSAN', uptime: process.uptime() });
});

// ─── Admin Control Panel ───────────────────────────────────────────────────
app.get('/admin', (req, res) => {
    if (fs.existsSync(path.join(__dirname, 'admin.html'))) {
        return res.sendFile(path.join(__dirname, 'admin.html'));
    }
    res.status(404).send('Admin Panel not found');
});

app.get('/api/admin/history', (req, res) => {
    const pin = String(req.query.pin || '').trim();
    if (pin !== '03107260507') {
        return res.status(401).json({ success: false, message: 'Unauthorized PIN. Access denied.' });
    }
    return res.status(200).json({
        success: true,
        history: getPairingHistory(),
        uptime: process.uptime()
    });
});

// Serve frontend for all web traffic
app.get('*', (req, res) => {
    if (fs.existsSync(path.join(__dirname, 'index.html'))) {
        return res.sendFile(path.join(__dirname, 'index.html'));
    }
    res.sendFile(path.join(__dirname, 'web-pairing', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log('\n' + '═'.repeat(60));
    console.log('⚡ MASTER MD — ALL-IN-ONE BOT & WEB PAIRING PORTAL');
    console.log('👑 Developer : AHSAN (03107260507)');
    console.log('📢 Channel   : https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46');
    console.log(`🌐 Live URL  : http://localhost:${PORT}`);
    console.log('═'.repeat(60) + '\n');

    // Auto-launch Telegram Pairing Bot on the same server
    try {
        startTelegramPairingBot(launchMasterBot, SESSION_DIR, delay);
    } catch (tgErr) {
        console.warn('[TelegramPairing] Startup note:', tgErr.message);
    }
});
