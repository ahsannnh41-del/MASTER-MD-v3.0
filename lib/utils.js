// ═══════════════════════════════════════════════════════════════════
//  UTILS.JS — General Purpose Helpers
// ═══════════════════════════════════════════════════════════════════

import { rememberLidMapping, recallRealJid } from './lidMapping.js';

export function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

export function pickN(arr, n) {
    const copy = [...arr];
    const result = [];
    for (let i = 0; i < Math.min(n, copy.length); i++) {
        const idx = Math.floor(Math.random() * copy.length);
        result.push(copy.splice(idx, 1)[0]);
    }
    return result;
}

export function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export function bar(cur, max, len = 10) {
    const safeMax = max > 0 ? max : 1;
    const f = Math.max(0, Math.min(len, Math.round((cur / safeMax) * len)));
    return '█'.repeat(f) + '░'.repeat(len - f);
}

export function barColor(cur, max, len = 10) {
    const pct = (cur / Math.max(max, 1)) * 100;
    const filled = bar(cur, max, len);
    if (pct > 60) return `🟩 ${filled}`;
    if (pct > 30) return `🟨 ${filled}`;
    return `🟥 ${filled}`;
}

export function fmtNum(n) {
    return Number(n).toLocaleString('id-ID');
}

export function fmtNumShort(n) {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000)     return (n / 1_000).toFixed(1) + 'K';
    return String(n);
}

export function fmtDuration(ms) {
    if (ms <= 0) return '0 detik';
    const s = Math.floor(ms / 1000) % 60;
    const m = Math.floor(ms / 60000) % 60;
    const h = Math.floor(ms / 3600000) % 24;
    const d = Math.floor(ms / 86400000);
    const parts = [];
    if (d) parts.push(`${d} hari`);
    if (h) parts.push(`${h} jam`);
    if (m) parts.push(`${m} menit`);
    if (s && !d) parts.push(`${s} detik`);
    return parts.join(' ') || '0 detik';
}

export function fmtDate(ts = Date.now()) {
    return new Date(ts).toLocaleDateString('id-ID', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });
}

export function fmtTime(ts = Date.now()) {
    return new Date(ts).toLocaleTimeString('id-ID', { hour12: false });
}

export function jidNum(jid) {
    return (jid || '').split('@')[0];
}

// ─── RESOLVE SENDER (LID-aware) ──────────────────────────────────────────
// WhatsApp telah merilis sistem "LID" (Linked Identifier) — sebagian akun
// kadang muncul dengan JID berbentuk `xxxxx@lid` BUKAN `xxxxx@s.whatsapp.net`.
// Angka di depan `@lid` BUKAN nomor HP asli orang itu — itu ID internal
// acak milik WhatsApp. Kalau ID itu cuma di-strip "@lid"-nya lalu dianggap
// nomor HP biasa (seperti yang sebelumnya dilakukan), maka:
//   1) Identitas orang itu jadi TIDAK KONSISTEN antar pesan — kadang
//      WhatsApp mengirim pesannya sebagai @lid, kadang sebagai
//      @s.whatsapp.net (nomor asli), sehingga sistem .daftar / cek Owner
//      bisa menganggap itu "dua orang yang berbeda" padahal orang yang sama.
//   2) Command seperti .nomorku menampilkan angka @lid itu seolah-olah
//      nomor HP asli, padahal bukan.
// Baileys MENYEDIAKAN field `participantPn` (di grup) dan `senderPn` (di
// chat pribadi, tersedia di versi Baileys yang lebih baru) yang berisi JID
// nomor HP asli, KALAU WhatsApp memberikannya. Fungsi ini mencoba field-
// field tersebut dulu sebelum jatuh ke remoteJid/participant mentah.
//
// FIX TAMBAHAN: setiap kali pasangan (lid, nomor asli) berhasil didapat
// dalam satu pesan, pasangan itu disimpan PERMANEN lewat rememberLidMapping()
// (lib/lidMapping.js). Jadi di pesan-pesan berikutnya, KALAUPUN WhatsApp
// cuma kasih @lid tanpa nomor asli lagi, bot masih bisa "ingat" nomor
// aslinya dari cache — bukan langsung balik memperlakukan orang itu
// sebagai identitas asing lagi.
//
// CATATAN: ini BUKAN solusi 100% sempurna — ini adalah keterbatasan yang
// diakui sendiri oleh tim Baileys (lihat GitHub issue #1718, #1832, dst):
// di chat pribadi, kadang TIDAK ADA cara reliable untuk memetakan @lid ke
// nomor asli sampai WhatsApp sendiri memberikan datanya MINIMAL SEKALI.
// Kalau LID seseorang belum pernah sekalipun muncul bareng nomor aslinya
// sejak bot ini berjalan, fungsi ini tetap mengembalikan JID @lid mentah
// (tidak dipalsukan jadi nomor biasa) — supaya identitasnya tetap KONSISTEN
// sebagai dirinya sendiri (walau belum bisa dicocokkan ke nomor HP aslinya).
export function resolveSenderJid(msg, isGroup) {
    const key = msg?.key || {};
    if (isGroup) {
        const lid = key.participant;
        const pn  = key.participantPn;
        if (pn && lid && lid.includes('@lid')) rememberLidMapping(lid, pn);
        if (pn) return pn;
        // Belum dapat PN langsung di pesan ini — coba ingat dari cache
        // kalau LID ini PERNAH muncul bareng nomor asli sebelumnya.
        if (lid && lid.includes('@lid')) {
            const remembered = recallRealJid(lid);
            if (remembered) return remembered;
        }
        return lid || key.remoteJid;
    }
    const lid = key.remoteJid;
    const pn  = key.senderPn;
    if (pn && lid && lid.includes('@lid')) rememberLidMapping(lid, pn);
    if (pn) return pn;
    if (lid && lid.includes('@lid')) {
        const remembered = recallRealJid(lid);
        if (remembered) return remembered;
    }
    return lid;
}

// Cek apakah sebuah JID adalah identitas LID (bukan nomor HP biasa) —
// berguna untuk menampilkan peringatan/info yang jujur ke user di command
// seperti .nomorku, daripada diam-diam menampilkan angka @lid seolah nomor
// HP asli.
export function isLidJid(jid) {
    return (jid || '').includes('@lid');
}

export function tagName(jid) {
    return `@${jidNum(jid)}`;
}

export function nowTs() {
    return Date.now();
}

export function cooldownLeft(lastTs, cooldownMs) {
    const elapsed = Date.now() - (lastTs || 0);
    return Math.max(0, cooldownMs - elapsed);
}

export function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
}

export function box(title) {
    const pad = '═'.repeat(Math.max(0, title.length));
    return `╔═${pad}═╗\n║ ${title} ║\n╚═${pad}═╝`;
}

export function sectionHeader(emoji, title) {
    return `╭─「 ${emoji} *${title}* 」`;
}

export function sectionFooter() {
    return '╰──────────────────────────────';
}

export function percentChance(pct) {
    return Math.random() * 100 < pct;
}

export function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

export function parseDurationArg(arg, fallbackUnit = 'm') {
    if (!arg) return null;
    const match = String(arg).match(/^(\d+)([smhd]?)$/i);
    if (!match) return null;
    const value = parseInt(match[1], 10);
    const unit  = (match[2] || fallbackUnit).toLowerCase();
    const mult  = { s: 1000, m: 60000, h: 3600000, d: 86400000 }[unit] || 60000;
    return value * mult;
}

export function safeReplyText(text) {
    if (text.length > 60000) return text.slice(0, 59980) + '\n…(dipotong)';
    return text;
}

// Truncate text dengan ellipsis
export function truncate(text, maxLen = 100) {
    if (!text || text.length <= maxLen) return text;
    return text.slice(0, maxLen - 1) + '…';
}

// Hitung runtime sejak timestamp
export function getRuntime(startTs) {
    return fmtDuration(Date.now() - startTs);
}

// Buat progress bar dengan label
export function progressBar(cur, max, len = 12, label = '') {
    const pct = Math.round((cur / Math.max(max, 1)) * 100);
    return `${bar(cur, max, len)} ${pct}%${label ? ` ${label}` : ''}`;
}

// Buat divider dinamis
export function divider(char = '─', len = 32) {
    return char.repeat(len);
}

// ─── Batasi waktu tunggu sebuah promise ──────────────────────────────────
// Jaring pengaman untuk operasi ke WhatsApp (sendMessage, sendPresenceUpdate,
// readMessages, dll) yang berpotensi MACET/HANG TANPA BATAS WAKTU kalau
// koneksi di balik layar bermasalah — yaitu promise yang tidak pernah
// resolve ATAUPUN reject. Tanpa ini, try/catch normal tidak akan pernah
// jalan karena tidak ada exception yang dilempar; kode hanya menunggu
// selamanya, sehingga bot terlihat "online" tapi diam total tanpa balasan
// atau error apapun. withTimeout() memaksa promise tersebut reject setelah
// batas waktu tertentu, sehingga try/catch di pemanggilnya akhirnya bisa
// menangani kegagalan tersebut dan melanjutkan eksekusi (misalnya tetap
// mengirim pesan error ke user, bukan diam selamanya).
export function withTimeout(promise, ms, label = 'operation') {
    return Promise.race([
        promise,
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error(`Timeout: ${label} > ${ms}ms`)), ms)
        ),
    ]);
}
