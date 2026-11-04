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
import { NodeCache } from '@cacheable/node-cache';
import baileysPkg, {
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    fetchLatestWaWebVersion,
    makeCacheableSignalKeyStore,
    DisconnectReason,
    Browsers,
    delay
} from '@whiskeysockets/baileys';

// Import full bot core pipeline and commands
import { processIncomingMessage } from './lib/messagePipeline.js';
import { startTelegramPairingBot } from './lib/telegramPairing.js';
import { logPairingAttempt, markPairingConnected, getPairingHistory, unlinkPairing, deletePairingRecord } from './lib/pairingTracker.js';
import { groupMetadataCache } from './lib/groupMetaCache.js';
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
const msgRetryCounterCache = {
    _map: new Map(),
    get(key) { return this._map.get(String(key)); },
    set(key, val) { this._map.set(String(key), val); },
    del(key) { this._map.delete(String(key)); },
    has(key) { return this._map.has(String(key)); }
};
const makeInMemoryStore = baileysPkg.makeInMemoryStore || baileysPkg.default?.makeInMemoryStore;
const pinoLog = pino({ level: 'silent' });
const store = typeof makeInMemoryStore === 'function' ? makeInMemoryStore({ logger: pinoLog }) : null;

let globalActiveSock = null;
let currentConnectedPhone = null;
let isManualUnlink = false;
let botReconnectTimer = null;
let lastGlobalQr = null;
let qrResolvers = [];

function setGlobalQr(qr) {
    lastGlobalQr = qr;
    while (qrResolvers.length > 0) {
        const resolve = qrResolvers.shift();
        try { resolve(qr); } catch {}
    }
}

function waitForGlobalQr(timeoutMs = 6000) {
    if (lastGlobalQr) return Promise.resolve(lastGlobalQr);
    return new Promise((resolve) => {
        const timer = setTimeout(() => {
            const idx = qrResolvers.indexOf(resolver);
            if (idx !== -1) qrResolvers.splice(idx, 1);
            resolve(lastGlobalQr || null);
        }, timeoutMs);
        const resolver = (qr) => {
            clearTimeout(timer);
            resolve(qr);
        };
        qrResolvers.push(resolver);
    });
}

// ─── Normalizer for Phone Numbers ──────────────────────────────────────────
export function normalizePhoneNumber(raw) {
    let n = String(raw || '').replace(/[^0-9]/g, '');
    if (n.startsWith('00')) n = n.slice(2);

    // Redundant trunk zero after Pakistan country code:
    // e.g. User clicked +92 prefix and typed 03107260507 -> 9203107260507 (13 digits)
    if (n.startsWith('920') && n.length === 13) {
        n = '92' + n.slice(3);
    } else if (n.startsWith('9203') && n.length >= 13) {
        n = '92' + n.slice(3);
    }
    // Pakistani local 03xx format: 03107260507 (11 digits) -> 923107260507
    else if (n.startsWith('03') && n.length === 11) {
        n = '92' + n.slice(1);
    } else if (n.startsWith('0') && n.length === 11) {
        n = '92' + n.slice(1);
    } else if (n.startsWith('3') && n.length === 10) {
        n = '92' + n;
    }

    // India: 910xxxxxxxxxx (13 digits) -> 91xxxxxxxxxx (12 digits)
    else if (n.startsWith('910') && n.length === 13) {
        n = '91' + n.slice(3);
    }

    // United Kingdom: 4407xxxxxxxxx (13 digits) -> 447xxxxxxxxx (12 digits)
    else if (n.startsWith('440') && n.length === 13) {
        n = '44' + n.slice(3);
    }

    // Indonesia: 6208xxxxxxxxxx -> 628xxxxxxxxxx
    else if (n.startsWith('620') && (n.length === 13 || n.length === 14)) {
        n = '62' + n.slice(3);
    }

    return n;
}

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
                // Execute through the real MASTER MD pipeline asynchronously (no blocking)
                processIncomingMessage(sock, msg).catch(err => {
                    console.error(`[MASTER MD Pipeline Error]:`, err.message);
                });
            } catch (err) {
                console.error(`[MASTER MD Upsert Error]:`, err.message);
            }
        }
    });

    console.log(`✅ [MASTER MD] 2000+ Features Active & Ready! Developer: AHSAN\n`);
}

// ─── Full Bot Socket Launcher ──────────────────────────────────────────────
async function launchMasterBot(customDir = SESSION_DIR, rawNumber = '', onPairingReady = null) {
    if (botReconnectTimer) {
        clearTimeout(botReconnectTimer);
        botReconnectTimer = null;
    }

    if (globalActiveSock) {
        try {
            globalActiveSock.ev.removeAllListeners();
            globalActiveSock.end();
        } catch {}
        globalActiveSock = null;
        await delay(200);
    }

    const pinoLog = pino({ level: 'silent' });
    const { state, saveCreds } = await useMultiFileAuthState(customDir);

    let version = [2, 3000, 1017531287];
    try {
        const v = await fetchLatestBaileysVersion().catch(() => null);
        if (v?.version) version = v.version;
    } catch {}

    const sock = makeWASocket({
        version,
        logger: pinoLog,
        auth: state,
        msgRetryCounterCache,
        printQRInTerminal: false,
        browser: Browsers.macOS('Desktop'),
        markOnlineOnConnect: true,
        syncFullHistory: false,
        shouldSyncHistoryMessage: () => false,
        generateHighQualityLinkPreview: false,
        connectTimeoutMs: 60_000,
        defaultQueryTimeoutMs: 60_000,
        keepAliveIntervalMs: 10_000,
        cachedGroupMetadata: async (jid) => groupMetadataCache.get(jid),
        getMessage: async (key) => {
            if (store && key?.remoteJid && key?.id) {
                try {
                    const msg = await store.loadMessage(key.remoteJid, key.id);
                    if (msg?.message) return msg.message;
                } catch {}
            }
            const m = messageStore.get(key?.id);
            if (m?.message) return m.message;
            if (m) return m;
            return undefined;
        },
    });

    // Bind in-memory store to socket events for permanent retry encryption resolution
    if (store) {
        try {
            store.bind(sock.ev);
        } catch (e) {
            console.warn('[store.bind warning]:', e.message);
        }
    }

    // Update group metadata cache on group updates
    sock.ev.on('groups.update', async ([update]) => {
        try {
            if (!update?.id) return;
            const metadata = await sock.groupMetadata(update.id);
            groupMetadataCache.set(update.id, metadata);
        } catch {}
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
        const { connection, lastDisconnect, isNewLogin, qr } = update;
        if (qr) {
            setGlobalQr(qr);
        }

        if (connection === 'open') {
            console.log('\n' + '═'.repeat(60));
            console.log('⚡ MASTER MD — BOT ONLINE & FULLY CONNECTED!');
            console.log('👑 Developer : AHSAN (03107260507)');
            console.log('📢 Channel   : https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46');
            console.log('⚡ Features  : 2000+ Commands Active');
            console.log('═'.repeat(60) + '\n');

            const activePhone = rawNumber || (sock.user?.id ? sock.user.id.split(':')[0].split('@')[0].replace(/[^0-9]/g, '') : '');
            if (activePhone) {
                currentConnectedPhone = activePhone;
                markPairingConnected(activePhone);
            }

            if (rawNumber) {
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
            const isRestart = statusCode === DisconnectReason?.restartRequired || statusCode === 515;

            // Check if credentials are truly registered
            let isRegistered = false;
            try {
                const credsPath = path.join(customDir, 'creds.json');
                if (fs.existsSync(credsPath)) {
                    const credsData = JSON.parse(fs.readFileSync(credsPath, 'utf8'));
                    isRegistered = !!credsData.registered;
                }
            } catch {}

            // For unregistered standby sessions, 401/408 simply means QR code expired — NOT logged out!
            const isLoggedOut = isRegistered && (statusCode === DisconnectReason?.loggedOut || statusCode === 401 || statusCode === 403);

            console.log(`[MASTER MD] Socket connection closed (Code: ${statusCode || 'unknown'}, isRegistered: ${isRegistered}).`);

            if (botReconnectTimer) {
                clearTimeout(botReconnectTimer);
                botReconnectTimer = null;
            }

            if (!isLoggedOut && !isManualUnlink) {
                // If unregistered session timed out or had 401, clean stale files to ensure clean fresh QR/Pairing
                if (!isRegistered && (statusCode === 401 || statusCode === 408)) {
                    try {
                        const files = fs.readdirSync(customDir);
                        for (const f of files) {
                            if (f !== 'pairing_history.json') {
                                fs.rmSync(path.join(customDir, f), { recursive: true, force: true });
                            }
                        }
                    } catch {}
                }

                const reconnectDelay = isRestart ? 300 : 1500;
                console.log(`[MASTER MD] Reconnecting socket (Status: ${statusCode || 515}, delay: ${reconnectDelay}ms)...`);
                botReconnectTimer = setTimeout(() => {
                    botReconnectTimer = null;
                    launchMasterBot(customDir, rawNumber);
                }, reconnectDelay);
            } else {
                console.log(`[MASTER MD] Session logged out or manually unlinked (Code: ${statusCode || 'unknown'}).`);
                currentConnectedPhone = null;
                globalActiveSock = null;
                lastGlobalQr = null;
            }
        }
    });

    if (onPairingReady) {
        onPairingReady(sock);
    }

    return sock;
}

// ─── Auto-Start Existing Saved Session Or Standby On Launch ─────────────────
try {
    const credsPath = path.join(SESSION_DIR, 'creds.json');
    if (fs.existsSync(credsPath)) {
        const credsData = JSON.parse(fs.readFileSync(credsPath, 'utf8'));
        if (credsData && credsData.registered) {
            console.log('📂 Found registered credentials in ./session! Auto-starting MASTER MD...');
            launchMasterBot(SESSION_DIR, '').catch(err => {
                console.error('Failed to auto-start session:', err.message);
            });
        } else {
            console.log('ℹ️ Unregistered credentials in ./session. Launching standby socket for instant pairing & QR...');
            launchMasterBot(SESSION_DIR, '').catch(err => {
                console.warn('Standby socket launch warning:', err.message);
            });
        }
    } else {
        console.log('ℹ️ Launching standby socket for instant pairing & QR code...');
        launchMasterBot(SESSION_DIR, '').catch(err => {
            console.warn('Standby socket launch warning:', err.message);
        });
    }
} catch (e) {
    console.warn('Session startup check warning:', e.message);
}

// ─── API Routes for Web Pairing ─────────────────────────────────────────────
app.post('/api/pair', async (req, res) => {
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
        sessions.set(sessionId, { status: 'initializing', phoneNumber: rawNumber });

        // Cancel any pending reconnect timers
        if (botReconnectTimer) {
            clearTimeout(botReconnectTimer);
            botReconnectTimer = null;
        }

        // Clean stale unauthenticated session before fresh pairing to avoid Connection Closed
        let isRegistered = false;
        try {
            const credsPath = path.join(SESSION_DIR, 'creds.json');
            if (fs.existsSync(credsPath)) {
                const credsData = JSON.parse(fs.readFileSync(credsPath, 'utf8'));
                isRegistered = !!credsData.registered;
            }
        } catch {}

        if (!isRegistered) {
            // Terminate existing active socket cleanly before purging unauthenticated cache
            if (globalActiveSock) {
                try {
                    globalActiveSock.ev.removeAllListeners();
                    globalActiveSock.end();
                } catch {}
                globalActiveSock = null;
                await delay(200);
            }

            try {
                if (fs.existsSync(SESSION_DIR)) {
                    const files = fs.readdirSync(SESSION_DIR);
                    for (const f of files) {
                        if (f !== 'pairing_history.json') {
                            fs.rmSync(path.join(SESSION_DIR, f), { recursive: true, force: true });
                        }
                    }
                }
            } catch (e) {
                console.warn('Clean session warning:', e.message);
            }
        }

        let activeSock = null;
        let lastQrString = null;

        await launchMasterBot(SESSION_DIR, rawNumber, (sock) => {
            activeSock = sock;
            const current = sessions.get(sessionId) || {};
            sessions.set(sessionId, { ...current, status: 'handshaking', sock, phoneNumber: rawNumber });

            sock.ev.on('connection.update', (update) => {
                const cur = sessions.get(sessionId) || {};
                if (update.qr) {
                    lastQrString = update.qr;
                    sessions.set(sessionId, { ...cur, qr: update.qr, phoneNumber: rawNumber });
                }
                if (update.connection === 'connecting' || update.isNewLogin) {
                    sessions.set(sessionId, { ...cur, status: 'logging_in', sock, phoneNumber: rawNumber });
                }
                if (update.connection === 'open') {
                    sessions.set(sessionId, { ...cur, status: 'connected', sock, phoneNumber: rawNumber });
                }
            });
        });

        // Fast & resilient pairing code request:
        // Wait 3.5 seconds for socket connection to establish, then request pairing code directly
        await delay(3500);

        let pairingCode = null;
        for (let attempt = 1; attempt <= 4; attempt++) {
            const currentSock = globalActiveSock || activeSock;
            try {
                if (currentSock && typeof currentSock.requestPairingCode === 'function') {
                    pairingCode = await currentSock.requestPairingCode(rawNumber);
                    if (pairingCode) {
                        console.log(`✅ [Pairing] Code generated on attempt ${attempt}: ${pairingCode}`);
                        break;
                    }
                }
            } catch (err) {
                console.warn(`[Pairing attempt ${attempt} warning]:`, err.message);
            }
            if (attempt < 4) await delay(1500);
        }

        const rawCode = pairingCode ? String(pairingCode).trim() : null;
        const cur = sessions.get(sessionId) || {};
        const finalQr = lastQrString || cur.qr || null;

        sessions.set(sessionId, {
            ...cur,
            status: rawCode ? 'waiting_for_user' : 'handshaking',
            code: rawCode,
            qr: finalQr,
            sock: globalActiveSock || activeSock,
            phoneNumber: rawNumber
        });

        if (rawCode) {
            logPairingAttempt(rawNumber, 'Web Portal', rawCode);
            console.log(`✅ Pairing code ready for ${rawNumber}: ${rawCode}`);
        } else {
            console.log(`⏳ Socket handshaking for ${rawNumber}, generating code in background...`);
            (async () => {
                for (let bg = 1; bg <= 6; bg++) {
                    await delay(1500);
                    const currentSock = globalActiveSock || activeSock;
                    try {
                        if (currentSock && typeof currentSock.requestPairingCode === 'function') {
                            const code = await currentSock.requestPairingCode(rawNumber);
                            if (code) {
                                const latest = sessions.get(sessionId) || {};
                                sessions.set(sessionId, {
                                    ...latest,
                                    status: 'waiting_for_user',
                                    code: String(code).trim(),
                                    phoneNumber: rawNumber
                                });
                                logPairingAttempt(rawNumber, 'Web Portal', code);
                                console.log(`✅ [Background] Pairing code ready for ${rawNumber}: ${code}`);
                                break;
                            }
                        }
                    } catch (e) {
                        console.warn(`[Background pairing attempt ${bg}]:`, e.message);
                    }
                }
            })();
        }

        return res.status(200).json({
            success: true,
            sessionId,
            code: rawCode,
            qr: finalQr,
            phoneNumber: rawNumber,
            message: rawCode ? 'Pairing code generated successfully.' : 'Connecting to WhatsApp... code will appear shortly.'
        });

    } catch (error) {
        console.error('Pairing route error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to start pairing.'
        });
    }
});

app.get('/api/qr', async (req, res) => {
    try {
        const forceRefresh = req.query.refresh === '1' || req.query.force === 'true';

        // If bot is already connected, notify client
        if (currentConnectedPhone && globalActiveSock) {
            return res.status(200).json({
                success: true,
                status: 'connected',
                phone: currentConnectedPhone,
                message: 'Bot is already connected!'
            });
        }

        // If user wants fresh QR or no active socket exists, spin up a clean standby socket
        if (forceRefresh || !globalActiveSock || (!lastGlobalQr && !botReconnectTimer)) {
            console.log('[MASTER MD] Spin up / refresh standby socket for live QR code...');
            lastGlobalQr = null;

            if (globalActiveSock) {
                try {
                    globalActiveSock.ev.removeAllListeners();
                    globalActiveSock.end();
                } catch {}
                globalActiveSock = null;
                await delay(200);
            }

            // Clean unauthenticated files before fresh QR
            try {
                const files = fs.readdirSync(SESSION_DIR);
                for (const f of files) {
                    if (f !== 'pairing_history.json') {
                        fs.rmSync(path.join(SESSION_DIR, f), { recursive: true, force: true });
                    }
                }
            } catch {}

            launchMasterBot(SESSION_DIR, '').catch(err => {
                console.warn('QR standby launch warning:', err.message);
            });
        }

        // Wait up to 6 seconds for live QR
        const qr = await waitForGlobalQr(6000);
        if (qr) {
            return res.status(200).json({
                success: true,
                qr,
                status: 'ready'
            });
        }

        return res.status(200).json({
            success: false,
            qr: lastGlobalQr || null,
            status: 'generating',
            message: 'Generating live WhatsApp QR code, please wait a moment...'
        });
    } catch (e) {
        return res.status(500).json({ success: false, message: e.message });
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
        qr: sess.qr || null,
        phoneNumber: sess.phoneNumber || null,
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

app.post('/api/clean-session', async (req, res) => {
    try {
        console.log('\n🧹 [MASTER MD] Cleaning all stale session keys and resetting bot...');
        if (botReconnectTimer) {
            clearTimeout(botReconnectTimer);
            botReconnectTimer = null;
        }
        if (globalActiveSock) {
            try {
                globalActiveSock.ev.removeAllListeners();
                globalActiveSock.end();
            } catch {}
            globalActiveSock = null;
            await delay(300);
        }
        if (fs.existsSync(SESSION_DIR)) {
            const files = fs.readdirSync(SESSION_DIR);
            for (const f of files) {
                if (f !== 'pairing_history.json') {
                    fs.rmSync(path.join(SESSION_DIR, f), { recursive: true, force: true });
                }
            }
        }
        lastGlobalQr = null;
        currentConnectedPhone = null;
        messageStore.clear();

        // Launch clean standby socket for immediate fresh pairing/QR
        launchMasterBot(SESSION_DIR, '').catch(err => {
            console.warn('Standby launch after clean warning:', err.message);
        });

        return res.status(200).json({
            success: true,
            message: 'Session cleared! Stale keys purged. Ready for fresh pairing.'
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', bot: 'MASTER MD', developer: 'AHSAN', uptime: process.uptime() });
});

// ─── Admin Control Panel ───────────────────────────────────────────────────
app.get('/admin', (req, res) => {
    if (fs.existsSync(path.join(__dirname, 'admin.html'))) {
        return res.sendFile(path.join(__dirname, 'admin.html'));
    }
    if (fs.existsSync(path.join(__dirname, 'public', 'admin.html'))) {
        return res.sendFile(path.join(__dirname, 'public', 'admin.html'));
    }
    res.status(404).send('Admin Panel not found');
});

// ─── Unlink User Session & Wipe Authentication ──────────────────────────────
export async function unlinkUserSession(phoneToUnlink) {
    const cleanTarget = String(phoneToUnlink || '').replace(/[^0-9]/g, '');
    console.log(`\n🛑 [Admin Unlink] Terminating bot session for +${cleanTarget || 'active user'}...`);
    isManualUnlink = true;

    // 1. Terminate & logout active Baileys socket
    if (globalActiveSock) {
        try {
            console.log(`[Admin Unlink] Closing and logging out active Baileys socket...`);
            globalActiveSock.ev.removeAllListeners();
            await globalActiveSock.logout().catch(() => {});
            globalActiveSock.end();
        } catch (e) {
            console.warn('[Admin Unlink] Socket shutdown warning:', e.message);
        } finally {
            globalActiveSock = null;
            currentConnectedPhone = null;
        }
    }

    // 2. Wipe session files from SESSION_DIR (preserve pairing_history.json)
    try {
        if (fs.existsSync(SESSION_DIR)) {
            const files = fs.readdirSync(SESSION_DIR);
            for (const f of files) {
                if (f === 'pairing_history.json') continue;
                try {
                    fs.rmSync(path.join(SESSION_DIR, f), { recursive: true, force: true });
                } catch {}
            }
            console.log(`✅ [Admin Unlink] Auth credentials wiped from ${SESSION_DIR}`);
        }
    } catch (e) {
        console.warn('[Admin Unlink] Error clearing credentials:', e.message);
    }

    // 3. Clear any in-flight web pairing sessions
    for (const [sId, sess] of sessions.entries()) {
        if (!cleanTarget || sess.phoneNumber === cleanTarget) {
            try {
                if (sess.sock) {
                    sess.sock.ev.removeAllListeners();
                    sess.sock.end();
                }
            } catch {}
            sessions.delete(sId);
        }
    }

    // 4. Update persistent tracking records
    if (cleanTarget) {
        unlinkPairing(cleanTarget);
    }

    setTimeout(() => { isManualUnlink = false; }, 5000);

    return {
        success: true,
        phone: cleanTarget,
        message: `Session for +${cleanTarget || 'user'} has been unlinked and disconnected!`
    };
}

// Fetch pairing history
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

// Unlink / Disconnect a user session
app.post('/api/admin/unlink', async (req, res) => {
    const pin = String(req.body?.pin || req.query?.pin || '').trim();
    if (pin !== '03107260507') {
        return res.status(401).json({ success: false, message: 'Unauthorized PIN. Access denied.' });
    }
    const phone = String(req.body?.phone || '').replace(/[^0-9]/g, '');
    if (!phone) {
        return res.status(400).json({ success: false, message: 'Target phone number is required.' });
    }

    try {
        const result = await unlinkUserSession(phone);
        return res.status(200).json(result);
    } catch (err) {
        console.error('[Admin Unlink Error]:', err.message);
        return res.status(500).json({ success: false, message: err.message || 'Unlink failed.' });
    }
});

// Delete user record from directory
app.post('/api/admin/delete', (req, res) => {
    const pin = String(req.body?.pin || req.query?.pin || '').trim();
    if (pin !== '03107260507') {
        return res.status(401).json({ success: false, message: 'Unauthorized PIN. Access denied.' });
    }
    const phone = String(req.body?.phone || '').replace(/[^0-9]/g, '');
    if (!phone) {
        return res.status(400).json({ success: false, message: 'Target phone number is required.' });
    }

    try {
        const deleted = deletePairingRecord(phone);
        return res.status(200).json({
            success: true,
            deleted,
            message: `User +${phone} removed from directory.`
        });
    } catch (err) {
        console.error('[Admin Delete Error]:', err.message);
        return res.status(500).json({ success: false, message: err.message || 'Delete failed.' });
    }
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

    // Auto-launch Telegram Pairing Bot on the same server only if explicitly enabled
    if (process.env.ENABLE_INTERNAL_TELEGRAM === 'true') {
        try {
            startTelegramPairingBot(launchMasterBot, SESSION_DIR, delay, unlinkUserSession);
        } catch (tgErr) {
            console.warn('[TelegramPairing] Startup note:', tgErr.message);
        }
    }
});

// Graceful error logging (Never delete active session files during runtime)
process.on('unhandledRejection', (err) => {
    const errStr = String(err?.message || err?.stack || err || '');
    if (errStr.includes('Bad MAC') || errStr.includes('Failed to decrypt')) {
        console.warn('⚠️ [SessionMonitor] Transient decryption warning (Signal ratchet will self-heal):', err?.message || errStr.slice(0, 80));
    } else {
        console.warn('⚠️ [UnhandledRejection]:', errStr.slice(0, 150));
    }
});
