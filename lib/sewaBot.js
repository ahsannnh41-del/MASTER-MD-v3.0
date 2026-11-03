// ═══════════════════════════════════════════════════════════════════
//  SEWABOT.JS — Sistem Sewa Bot per Grup
// ═══════════════════════════════════════════════════════════════════
//
//  Fitur utama:
//  • Sewa bisa bebas: hari / bulan / tahun / selamanya
//  • Saat sewa habis → bot otomatis keluar dari grup
//  • Notifikasi H-1 dan H-0 (hari habis) ke penyewa & owner
//  • sewaMode: kalau ON, hanya grup bersewa yang bisa pakai bot
// ═══════════════════════════════════════════════════════════════════

import { store, save } from './db.js';

// ── Helpers ────────────────────────────────────────────────────────
function sewaDb()  { return store('sewaan',   {}); }
function cfgDb()   { return store('sewaConfig', { sewaMode: false, harga: '' }); }

function saveSewa() { save('sewaan'); }
function saveCfg()  { save('sewaConfig'); }

// Parse durasi dari string bebas, kembalikan { ms, label }
// Contoh input: "7hari" / "7 hari" / "2bulan" / "1tahun" / "selamanya" / "30d" / "1m" / "permanent"
export function parseDurasi(raw) {
    if (!raw) return null;
    const s = raw.toLowerCase().replace(/\s+/g, '');

    if (['selamanya','permanent','lifetime','permanen','forever','∞','perm'].includes(s)) {
        return { ms: Infinity, label: 'Selamanya ♾️' };
    }

    const map = [
        [/^(\d+)(detik|second?s?|dtk|det|s)$/,  n => n * 1_000,           n => `${n} Detik`],
        [/^(\d+)(menit|minutes?|min|mnt|m)$/,    n => n * 60_000,          n => `${n} Menit`],
        [/^(\d+)(jam|hours?|hr|h)$/,             n => n * 3_600_000,       n => `${n} Jam`],
        [/^(\d+)(hari|days?|d)$/,                n => n * 86_400_000,      n => `${n} Hari`],
        [/^(\d+)(minggu|weeks?|mgg|w)$/,         n => n * 7*86_400_000,    n => `${n} Minggu`],
        [/^(\d+)(bulan|months?|bln|mo)$/,        n => n * 30*86_400_000,   n => `${n} Bulan`],
        [/^(\d+)(tahun|years?|thn|y)$/,          n => n * 365*86_400_000,  n => `${n} Tahun`],
    ];

    for (const [re, toMs, toLabel] of map) {
        const m = s.match(re);
        if (m) {
            const n = parseInt(m[1]);
            if (n <= 0) return null;
            return { ms: toMs(n), label: toLabel(n) };
        }
    }
    return null;
}

// Ambil data sewa satu grup
export function getSewa(groupJid) {
    return sewaDb()[groupJid] || null;
}

// Cek apakah sewa masih aktif
export function isSewaActive(groupJid) {
    const s = getSewa(groupJid);
    if (!s) return false;
    if (s.selesai === Infinity || s.selesai === -1) return true;
    return Date.now() < s.selesai;
}

// Tambah / perpanjang sewa
export function addSewa(groupJid, { penyewaJid, durasi, catatan = '' }) {
    const parsed = parseDurasi(durasi);
    if (!parsed) return { ok: false, reason: `Format durasi tidak dikenal: *${durasi}*\nContoh: \`7hari\`, \`2bulan\`, \`1tahun\`, \`selamanya\`` };

    const db   = sewaDb();
    const now  = Date.now();
    const prev = db[groupJid];

    // Kalau masih aktif, perpanjang dari tanggal selesai sekarang
    const baseTime = (prev && isSewaActive(groupJid) && prev.selesai !== Infinity && prev.selesai !== -1)
        ? prev.selesai
        : now;

    const selesai = parsed.ms === Infinity ? Infinity : baseTime + parsed.ms;

    db[groupJid] = {
        penyewa:  penyewaJid,
        mulai:    prev?.mulai || now,
        selesai,
        durasi:   parsed.label,
        catatan,
        diperpanjang: prev ? (prev.diperpanjang || 0) + 1 : 0,
        notifH1Sent: false,
    };
    saveSewa();

    return {
        ok: true,
        data: db[groupJid],
        label: parsed.label,
        selesaiTs: selesai,
        perpanjang: db[groupJid].diperpanjang > 0,
    };
}

// Hapus sewa
export function delSewa(groupJid) {
    const db = sewaDb();
    if (!db[groupJid]) return false;
    delete db[groupJid];
    saveSewa();
    return true;
}

// Daftar semua sewa (aktif saja, atau semua)
export function listSewa(onlyActive = true) {
    const db = sewaDb();
    return Object.entries(db)
        .filter(([jid]) => !onlyActive || isSewaActive(jid))
        .map(([jid, data]) => ({ jid, ...data }));
}

// SewaMode toggle
export function isSewaMode()        { return !!cfgDb().sewaMode; }
export function setSewaMode(val)    { const c = cfgDb(); c.sewaMode = !!val; saveCfg(); }

// Harga sewa (teks bebas, diatur owner lewat .gantihargasewa)
export function getHargaSewa()      { return cfgDb().harga || ''; }
export function setHargaSewa(val)   { const c = cfgDb(); c.harga = String(val || ''); saveCfg(); }

// Format tanggal Indonesia
export function fmtTgl(ts) {
    if (ts === Infinity || ts === -1) return 'Selamanya ♾️';
    return new Date(ts).toLocaleString('id-ID', {
        day: '2-digit', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta',
    }) + ' WIB';
}

// Sisa waktu sewa dalam format manusiawi
export function sisaWaktu(selesai) {
    if (selesai === Infinity || selesai === -1) return 'Selamanya ♾️';
    const diff = selesai - Date.now();
    if (diff <= 0) return '⛔ Sudah habis';
    const d = Math.floor(diff / 86_400_000);
    const h = Math.floor((diff % 86_400_000) / 3_600_000);
    const m = Math.floor((diff % 3_600_000)  / 60_000);
    if (d > 0) return `${d} hari ${h} jam lagi`;
    if (h > 0) return `${h} jam ${m} menit lagi`;
    return `${m} menit lagi`;
}

// ── Cron-style checker — dipanggil tiap menit dari index.js ───────
// Return: array { groupJid, reason: 'expired'|'h1' }
export function checkSewaExpiry() {
    const db     = sewaDb();
    const now    = Date.now();
    const alerts = [];

    for (const [jid, data] of Object.entries(db)) {
        if (data.selesai === Infinity || data.selesai === -1) continue;

        const sisa = data.selesai - now;

        // H-1 notifikasi (24-25 jam sebelum habis, hanya sekali)
        if (sisa > 0 && sisa <= 25 * 3_600_000 && !data.notifH1Sent) {
            data.notifH1Sent = true;
            alerts.push({ groupJid: jid, reason: 'h1', data });
        }

        // Sudah habis
        if (sisa <= 0) {
            alerts.push({ groupJid: jid, reason: 'expired', data });
            delete db[jid];
        }
    }

    if (alerts.length) saveSewa();
    return alerts;
}
