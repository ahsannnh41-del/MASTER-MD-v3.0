// ─── CHILD BOT MANAGER (JADIBOT) ───────────────────────────────────────────
// Menerapkan 3 bug fix utama:
//
// BUG FIX 1: Unregistered session disconnect → reconnect sia-sia
//   Sebelum: kalau WA tutup socket sebelum pairing di-scan → reconnect 3x
//   (percuma karena creds belum ada). Selama itu user tidak bisa retry.
//   Fix: kalau creds belum registered saat disconnect → langsung fatal,
//   bersihkan session, user bisa coba lagi segera.
//
// BUG FIX 2: Rate limit blokir retry yang sah
//   Sebelum: rateLimit.set() dipanggil di AWAL (sebelum tahu sukses/gagal).
//   Kalau gagal (pairing code error, dll) user harus tunggu 60 detik.
//   Fix: rate limit hanya aktif selama koneksi berlangsung. Begitu session
//   bersih (success/error/stop), rate limit juga dihapus.
//
// BUG FIX 3: sessions tidak dibersihkan kalau launch() throw tak terduga
//   Sebelum: sessions.set() dipanggil sebelum launch(). Kalau launch() throw
//   sebelum sempat setup socket (misal useMultiFileAuthState gagal), session
//   entry tertinggal dan user tidak bisa jadibot lagi sampai bot restart.
//   Fix: bungkus launch() dalam try/finally di startChildBot, selalu hapus
//   sessions di finally kalau launch() throw sebelum creds terdaftar.

import {
    useMultiFileAuthState,
    DisconnectReason,
    makeCacheableSignalKeyStore,
    Browsers,
    delay,
    fetchLatestBaileysVersion,
} from '@whiskeysockets/baileys';
// FIX: sama seperti index.js — makeWASocket lewat shim, lihat lib/baileysCompat.js
import { makeWASocket } from './baileysCompat.js';
import pino from 'pino';
import { rmSync, mkdirSync, existsSync, readdirSync } from 'fs';
import path from 'path';
import { log } from './logger.js';

// ── Konfigurasi ────────────────────────────────────────────────────────────
const MAX_CHILD_BOTS     = 20;
const MAX_RECONNECT      = 3;
const RECONNECT_DELAY_MS = 5_000;
const SESSION_BASE       = path.join('.', 'session', 'jadibot');
const pinoLog            = pino({ level: 'silent' });

// ── State ──────────────────────────────────────────────────────────────────
const sessions   = new Map();   // number -> { sock, ownerJid, startedAt, heartbeat, status }
const reconnects = new Map();   // number -> attempt count
const rateLocks  = new Set();   // number -> sedang dalam proses (bukan timer, tapi lock)

// ── Helpers ────────────────────────────────────────────────────────────────
function sessionPath(number)     { return path.join(SESSION_BASE, number); }
function ensureDir(number)       {
    const p = sessionPath(number);
    if (!existsSync(p)) mkdirSync(p, { recursive: true });
    return p;
}
function cleanSession(number, deleteFiles = false) {
    const e = sessions.get(number);
    if (e?.heartbeat) clearInterval(e.heartbeat);
    try { e?.sock?.ev?.removeAllListeners(); } catch {}
    try { e?.sock?.ws?.close(); } catch {}
    sessions.delete(number);
    reconnects.delete(number);
    rateLocks.delete(number);       // ← BUG FIX 2: hapus lock saat bersih
    if (deleteFiles) {
        try { rmSync(sessionPath(number), { recursive: true, force: true }); } catch {}
    }
}

export function isAlreadyChildBot(number) { return sessions.has(number); }
export function countActiveChildBots()    { return sessions.size; }
export function listChildBotNumbers()     { return [...sessions.keys()]; }
export function getChildBotStatus(number) {
    const s = sessions.get(number);
    if (!s) return null;
    return { number, status: s.status, startedAt: s.startedAt };
}

// ── Light store (ringan, hemat memori) ─────────────────────────────────────
function createStore() {
    const msgs = new Map();
    return {
        bind(ev) {
            ev.on('messages.upsert', ({ messages }) => {
                for (const m of messages || []) {
                    const jid = m.key?.remoteJid; if (!jid || !m.key?.id) continue;
                    if (!msgs.has(jid)) msgs.set(jid, new Map());
                    const chat = msgs.get(jid);
                    chat.set(m.key.id, m);
                    if (chat.size > 200) {
                        const keys = [...chat.keys()];
                        for (let i = 0; i < keys.length - 150; i++) chat.delete(keys[i]);
                    }
                }
            });
        },
        async loadMessage(jid, id) { return msgs.get(jid)?.get(id); },
    };
}

// ── Error classification (pola klasifikasi disconnect yang teruji) ────────
const ERROR_MAP = {
    401: { reason: 'Nomor tidak terdaftar WhatsApp',         fatal: true  },
    403: { reason: 'Akses ditolak / akun dibanned',          fatal: true  },
    406: { reason: 'Nomor dibatasi WhatsApp',                fatal: true  },
    408: { reason: 'Timeout',                                fatal: false },
    409: { reason: 'Session konflik (login di device lain)', fatal: true  },
    411: { reason: 'Autentikasi gagal',                      fatal: true  },
    428: { reason: 'Rate limit WhatsApp',                    fatal: true  },
    440: { reason: 'Session expired',                        fatal: true  },
    515: { reason: 'Stream error',                           fatal: false },
};
function classifyDisconnect(ld) {
    const code = ld?.error?.output?.statusCode;
    const msg  = ld?.error?.message || 'Unknown';
    return { code, message: msg, ...(ERROR_MAP[code] || { reason: `Error (${code}): ${msg}`, fatal: false }) };
}

// ── Core: mulai child bot ──────────────────────────────────────────────────
export async function startChildBot(number, { onPairingCode, onStatus, mainHandleMessage }) {
    if (sessions.size >= MAX_CHILD_BOTS)
        throw new Error(`Batas maksimum ${MAX_CHILD_BOTS} jadibot aktif tercapai.`);
    if (sessions.has(number))
        throw new Error('Nomor ini sudah punya sesi jadibot aktif. Ketik .stopbot dulu.');
    // BUG FIX 2: cek lock (bukan timer — lock dihapus saat session bersih)
    if (rateLocks.has(number))
        throw new Error('Sesi sebelumnya belum selesai dibersihkan. Tunggu beberapa detik dan coba lagi.');

    rateLocks.add(number);
    ensureDir(number);
    sessions.set(number, { sock: null, startedAt: Date.now(), status: 'connecting', heartbeat: null });

    // BUG FIX 3: kalau launch() throw sebelum socket setup → bersihkan
    try {
        await launch(false);
    } catch (err) {
        cleanSession(number, false); // jangan hapus file — mungkin ada creds valid
        throw err;
    }

    async function launch(isReconnect) {
        const { state, saveCreds } = await useMultiFileAuthState(sessionPath(number));
        const { version } = await fetchLatestBaileysVersion()
            .catch(() => ({ version: [2, 3000, 1023040140] }));

        const sock = makeWASocket({
            version,
            logger: pinoLog,
            printQRInTerminal: false,
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, pinoLog),
            },
            browser: Browsers.ubuntu('Chrome'),
            markOnlineOnConnect: true,
            syncFullHistory: false,
            generateHighQualityLinkPreview: false,
            defaultQueryTimeoutMs: 20_000,
            connectTimeoutMs:      20_000,
            keepAliveIntervalMs:   10_000,
        });

        const store = createStore();
        store.bind(sock.ev);
        const entry = sessions.get(number);
        if (entry) entry.sock = sock;

        // ── connection.update ─────────────────────────────────────────────
        sock.ev.on('connection.update', async ({ connection, lastDisconnect: ld }) => {
            if (connection === 'open') {
                reconnects.delete(number);
                sock.sendPresenceUpdate('available').catch(() => {});
                const hb = setInterval(() => {
                    try { if (!sock?.ws || sock.ws.readyState !== 1) clearInterval(hb); } catch { clearInterval(hb); }
                }, 30_000);
                const e = sessions.get(number);
                if (e) { e.status = 'connected'; e.heartbeat = hb; }
                onStatus?.('connected', '');
            }

            if (connection === 'close') {
                const info = classifyDisconnect(ld);

                // ── BUG FIX 1 ────────────────────────────────────────────
                // Kalau creds belum registered (pairing belum selesai) dan
                // WA menutup socket → JANGAN reconnect. Ini artinya:
                //   - pairing code expired (user tidak scan tepat waktu)
                //   - WA menolak pairing karena nomor bermasalah
                //   - dll
                // Langsung bersihkan session → user bisa coba lagi segera.
                if (!state.creds.registered) {
                    log.warn(`Jadibot ${number}: disconnect sebelum creds registered (kode ${info.code})`);
                    cleanSession(number, true);
                    onStatus?.('error', `Koneksi terputus sebelum pairing selesai (${info.reason}). Silakan coba lagi.`);
                    return;
                }
                // ── end BUG FIX 1 ────────────────────────────────────────

                const e = sessions.get(number);
                if (e?.heartbeat) clearInterval(e.heartbeat);

                if (info.code === DisconnectReason.loggedOut || info.fatal) {
                    cleanSession(number, true);
                    onStatus?.('loggedout', info.reason);
                    return;
                }

                const attempts = (reconnects.get(number) || 0) + 1;
                if (attempts > MAX_RECONNECT) {
                    cleanSession(number, false);
                    onStatus?.('error', `Gagal reconnect setelah ${MAX_RECONNECT}x: ${info.reason}`);
                    return;
                }
                reconnects.set(number, attempts);
                onStatus?.('reconnecting', `Reconnect ${attempts}/${MAX_RECONNECT}...`);
                setTimeout(() => launch(true), RECONNECT_DELAY_MS);
            }
        });

        sock.ev.on('creds.update', saveCreds);

        // ── Pairing code ──────────────────────────────────────────────────
        if (!state.creds.registered && !isReconnect) {
            await delay(3000);
            try {
                const raw  = await sock.requestPairingCode(number);
                const code = raw?.match(/.{1,4}/g)?.join('-') ?? raw;
                onPairingCode?.(code);
            } catch (err) {
                log.error(`Jadibot ${number}: GAGAL requestPairingCode → ${err.message}`);
                // BUG FIX 2: bersihkan lock supaya user bisa retry segera
                cleanSession(number, false);
                onStatus?.('error', `Gagal membuat pairing code: ${err.message}`);
                try { sock.end?.(); } catch {}
                return;
            }
        }

        // ── Pesan masuk ───────────────────────────────────────────────────
        // FIX PERFORMA: mainHandleMessage() SENGAJA tidak di-await di dalam
        // loop ini (beda dari sebelumnya) — supaya satu pesan yang proses-
        // nya lambat (command yang manggil API luar, dst) tidak menahan
        // pesan lain di batch messages.upsert yang sama. Dedup (processed
        // Map) tetap aman karena id-nya ditandai SEBELUM handler async
        // dipanggil, jadi urutan pengecekan duplikat tidak berubah — yang
        // berubah cuma pemrosesan sesudahnya tidak lagi saling menunggu.
        const processed = new Map();
        sock.ev.on('messages.upsert', async ({ messages: msgs, type }) => {
            if (type !== 'notify' && type !== 'append') return;
            for (const msg of msgs) {
                if (!msg.message) continue;
                const id = msg.key?.id;
                if (id && processed.has(id)) continue;
                if (id) processed.set(id, Date.now());
                if (msg.key?.remoteJid === 'status@broadcast') continue;
                const ts = Number(msg.messageTimestamp || 0) * 1000;
                if (ts && Date.now() - ts > 3_600_000) continue;
                mainHandleMessage(sock, msg).catch(err => {
                    log.error(`Jadibot ${number}: handler — ${err.message}`);
                });
            }
            const cutoff = Date.now() - 300_000;
            for (const [k, t] of processed) if (t < cutoff) processed.delete(k);
        });
    }
}

// ── Stop child bot ─────────────────────────────────────────────────────────
export async function stopChildBot(number, deleteFiles = true) {
    if (!sessions.has(number)) return false;
    cleanSession(number, deleteFiles);
    return true;
}

// ── Restore sessions setelah restart ──────────────────────────────────────
export async function restoreChildBotSessions(mainHandleMessage) {
    if (!existsSync(SESSION_BASE)) return;
    const dirs = readdirSync(SESSION_BASE, { withFileTypes: true })
        .filter(d => d.isDirectory()).map(d => d.name);

    for (const number of dirs) {
        const credsPath = path.join(sessionPath(number), 'creds.json');
        if (!existsSync(credsPath)) continue;
        if (sessions.has(number)) continue;

        log.info(`Jadibot: restore session ${number}`);
        startChildBot(number, {
            onPairingCode: () => {},
            onStatus: (s, m) => log.info(`Jadibot restore ${number}: ${s} ${m}`),
            mainHandleMessage,
        }).catch(err => {
            log.error(`Jadibot: gagal restore ${number}: ${err.message}`);
            cleanSession(number, false);
        });
    }
}
