// ═══════════════════════════════════════════════════════════════════
//  DB.JS — Persistent JSON Store
//  + Analytics tracking, better helpers, command stats
// ═══════════════════════════════════════════════════════════════════

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR  = path.join(__dirname, '../data');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const cache = new Map();
const dirty = new Set();

function filePath(name) {
    return path.join(DATA_DIR, `${name}.json`);
}

function loadFile(name, defaultValue) {
    const fp = filePath(name);
    if (!fs.existsSync(fp)) {
        try {
            fs.writeFileSync(fp, JSON.stringify(defaultValue, null, 2));
        } catch (err) {
            // FIX: kalau gagal menulis file baru (permission, disk penuh,
            // race condition antar proses, dll), JANGAN throw mentah-mentah
            // ke pemanggil. Sebelumnya error di sini bisa lolos sampai ke
            // handleCommand() tanpa tertangkap try/catch manapun, membuat
            // SEMUA command gagal total tanpa balasan apapun ke user.
            console.error(`⚠️  Gagal membuat file data/${name}.json:`, err.message);
        }
        return structuredClone(defaultValue);
    }
    try {
        const raw = fs.readFileSync(fp, 'utf8');
        return JSON.parse(raw || JSON.stringify(defaultValue));
    } catch {
        return structuredClone(defaultValue);
    }
}

/**
 * Get a named store. Lazily loaded & cached.
 */
export function store(name, defaultValue = {}) {
    if (!cache.has(name)) cache.set(name, loadFile(name, defaultValue));
    return cache.get(name);
}

export function save(name) {
    dirty.add(name);
}

function flush() {
    for (const name of dirty) {
        try {
            fs.writeFileSync(filePath(name), JSON.stringify(cache.get(name), null, 2));
        } catch (err) {
            console.error(`❌ Gagal simpan store "${name}":`, err.message);
        }
    }
    dirty.clear();
}

setInterval(flush, 10000);
process.on('exit', flush);
process.on('SIGINT',  () => { flush(); process.exit(0); });
process.on('SIGTERM', () => { flush(); process.exit(0); });

export function flushNow() { flush(); }

// ─── USER (RPG + economy) ─────────────────────────────────────────

export function getUser(jid) {
    const users = store('users');
    // FIX: jangan simpan null ke store — ini mengotori file JSON
    // dan bisa menyesatkan kalau dicek dengan `if (users[jid])`.
    return users[jid] ?? null;
}

export function setUser(jid, data) {
    const users = store('users');
    users[jid]  = data;
    save('users');
}

export function allUsers() {
    return store('users');
}

export function countUsers() {
    return Object.values(store('users')).filter(Boolean).length;
}

// ─── GROUP SETTINGS ───────────────────────────────────────────────

const GROUP_DEFAULTS = {
    antigb:        false,
    antilink:      false,
    antishortlink: false,
    antispam:      false,
    antitoxic:     false,
    welcome:       false,
    welcomeText:   null,
    farewell:      false,
    farewellText:  null,
    muted:         false,
    mutedUntil:    0,
    nsfw:          false,
    warnLimit:     3,

    // ── Proteksi tambahan (v3.1.0 — perluasan fitur admin) ──────────────
    antilinkphising: false, // link phishing (undian palsu, verifikasi akun, dll) — beda dari antilink biasa
    antijudol:       false, // promosi judi online (slot/togel/dll)
    antipinjol:      false, // promosi pinjaman online ilegal
    anticaps:        false, // pesan HURUF KAPITAL berlebihan
    antivirtex:      false, // virus text / teks unicode berlebihan yang bisa nge-lag HP
    antitag:         false, // spam mention massal oleh non-admin

    // ── Anti-NSFW (v3.2.0) — lihat features/antiNsfw.js ─────────────────
    antinsfw:        false, // deteksi & hapus otomatis foto/video/stiker dewasa
    nsfwStrikeLimit: 3,     // jumlah strike NSFW sebelum auto-kick (per grup, lihat .setnsfwlimit)

    // ── Jadwal buka/tutup grup otomatis ─────────────────────────────────
    openTime:  null, // format "HH:MM", null = tidak aktif
    closeTime: null,
};

export function getGroupSettings(jid) {
    const groups = store('groups');
    if (!groups[jid]) {
        groups[jid] = { ...GROUP_DEFAULTS };
        save('groups');
    }
    return groups[jid];
}

export function updateGroupSettings(jid, patch) {
    const groups = store('groups');
    groups[jid]  = { ...getGroupSettings(jid), ...patch };
    save('groups');
    return groups[jid];
}

export function countGroups() {
    return Object.keys(store('groups')).length;
}

// ─── COMMAND ANALYTICS ───────────────────────────────────────────

export function trackCommand(command) {
    const stats = store('cmdStats', {});
    stats[command] = (stats[command] || 0) + 1;
    save('cmdStats');
}

export function getTopCommands(n = 10) {
    const stats = store('cmdStats', {});
    return Object.entries(stats)
        .sort(([, a], [, b]) => b - a)
        .slice(0, n);
}

export function getTotalCommandsRan() {
    const stats = store('cmdStats', {});
    return Object.values(stats).reduce((a, b) => a + b, 0);
}

// ─── MESSAGE COUNTER ─────────────────────────────────────────────

export function trackMessage(jid) {
    const counts = store('msgCounts', {});
    counts[jid]  = (counts[jid] || 0) + 1;
    save('msgCounts');
}

export function getMessageCount(jid) {
    return store('msgCounts', {})[jid] || 0;
}
