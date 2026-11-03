// ═══════════════════════════════════════════════════════════════════
//  ROLES.JS — Sistem Jabatan: Creator > Owner > Premium > User
// ═══════════════════════════════════════════════════════════════════
//
//  HIRARKI:
//  • Creator  — pembuat asli bot. HANYA SATU. Nomor & namanya diatur
//               lewat `creatorNumber`/`creatorName` di setting.js (dulu
//               di-hardcode + checksum integritas di file ini — sudah
//               dilepas per permintaan terbaru). Tetap tidak bisa diubah
//               lewat command apapun saat bot berjalan — cuma lewat edit
//               setting.js langsung lalu redeploy/restart.
//  • Owner    — bisa lebih dari satu. Sumbernya GABUNGAN dari dua tempat:
//                 1) Array `ownerNumbers` di setting.js (manual edit file,
//                    butuh restart bot untuk berlaku).
//                 2) File data/owners.json (diatur lewat command .addowner
//                    saat bot berjalan, langsung aktif tanpa restart, dan
//                    persisten setelah restart). .addowner boleh dipakai
//                    oleh Owner ATAUPUN Creator (siapapun yang sudah Owner
//                    boleh menambah Owner baru). .delowner tetap KHUSUS
//                    Creator saja, supaya pencabutan jabatan Owner tidak
//                    bisa dilakukan sesama Owner secara sepihak.
//               Seseorang dianggap Owner kalau nomornya ada di SALAH SATU
//               dari kedua sumber tersebut.
//  • Premium  — sama seperti Owner, gabungan dari `premiumNumbers` di
//               setting.js dan data/premium.json (lewat .addprem/.delprem).
//
// ═══════════════════════════════════════════════════════════════════

import settings from '../setting.js';
import { verifyIntegrity } from './integrity.js';
import { store, save } from './db.js';

verifyIntegrity(settings);

// ─── CREATOR ──────────────────────────────────────────────────────────────
// Dibaca dari setting.js (creatorNumber/creatorName), lalu dibekukan (frozen)
// supaya tidak bisa diubah lagi secara tidak sengaja dari kode manapun saat
// runtime. Checksum integritas yang dulu ada di sini sudah dilepas — tinggal
// edit creatorNumber/creatorName di setting.js lalu restart kalau mau ganti.
const CREATOR = Object.freeze({
    number: settings.creatorNumber,
    name:   settings.creatorName,
});

function normalizeNumber(jidOrNumber) {
    // CATATAN PENTING soal akun ber-ID "@lid": WhatsApp kadang mengirim
    // pesan seseorang dengan JID berbentuk `xxxxx@lid` (ID internal acak),
    // BUKAN `xxxxx@s.whatsapp.net` (nomor HP asli). messagePipeline.js
    // sudah berusaha menukar @lid ke nomor HP asli dulu (lewat
    // resolveSenderJid() di utils.js, pakai field participantPn/senderPn
    // dari Baileys) SEBELUM nilai sampai ke sini. Tapi kalau Baileys/
    // WhatsApp tidak menyediakan nomor aslinya sama sekali (kadang terjadi
    // di chat pribadi — ini keterbatasan upstream, bukan bug di kode ini),
    // maka angka yang masuk ke fungsi ini adalah ID @lid mentah, BUKAN
    // nomor HP — sehingga tidak akan cocok dengan nomor Creator/Owner/
    // Premium manapun. Ini SENGAJA gagal dengan aman (akses ditolak),
    // bukan gagal dengan berbahaya (akses diberikan ke orang yang salah).
    return (jidOrNumber || '').toString().split('@')[0].replace(/[^0-9]/g, '');
}

// ─── CREATOR CHECK ────────────────────────────────────────────────────────
export function isCreator(senderJid) {
    const num = normalizeNumber(senderJid);
    if (num === CREATOR.number) return true;
    // Co-creator juga dianggap creator untuk keperluan akses command
    return coCreatorNumbers().includes(num);
}

export function isPrimaryCreator(senderJid) {
    return normalizeNumber(senderJid) === CREATOR.number;
}

export function getCreatorInfo() {
    // Return copy, bukan reference langsung — supaya pemanggil tidak bisa
    // memutasi objek CREATOR aslinya meskipun lupa kalau itu sudah di-freeze.
    return { number: CREATOR.number, name: CREATOR.name };
}


// ─── CO-CREATOR — database-stored, hanya primary creator yang bisa tambah ──
// Co-Creator punya akses SETARA creator (bisa jalankan semua command creator),
// tapi TIDAK bisa menambah/menghapus Co-Creator lain — hanya primary creator
// (hardcoded) yang bisa melakukan itu. Ini cegah privilege escalation.
function coCreatorStore() {
    return store('cocreators', { list: [] });
}

function coCreatorNumbers() {
    try {
        const data = coCreatorStore();
        if (!Array.isArray(data.list)) return [];
        return data.list.map(normalizeNumber).filter(Boolean);
    } catch { return []; }
}

export function isCoCreator(senderJid) {
    const num = normalizeNumber(senderJid);
    return coCreatorNumbers().includes(num);
}

export function listCoCreators() {
    return coCreatorNumbers().map(num => ({ number: num, source: 'database' }));
}

export function addCoCreator(targetJid, callerJid) {
    // HANYA primary creator (hardcoded) yang bisa menambah co-creator
    if (normalizeNumber(callerJid) !== CREATOR.number) {
        return { ok: false, reason: 'Hanya Primary Creator yang bisa menambah Co-Creator.' };
    }
    const num = normalizeNumber(targetJid);
    if (!num) return { ok: false, reason: 'Nomor tidak valid.' };
    if (num === CREATOR.number) return { ok: false, reason: 'Nomor ini sudah Primary Creator.' };
    const data = coCreatorStore();
    if (!Array.isArray(data.list)) data.list = [];
    if (data.list.map(normalizeNumber).includes(num)) {
        return { ok: false, reason: 'Nomor ini sudah menjadi Co-Creator.' };
    }
    data.list.push(num);
    save('cocreators');
    return { ok: true };
}

export function removeCoCreator(targetJid, callerJid) {
    if (normalizeNumber(callerJid) !== CREATOR.number) {
        return { ok: false, reason: 'Hanya Primary Creator yang bisa menghapus Co-Creator.' };
    }
    const num = normalizeNumber(targetJid);
    const data = coCreatorStore();
    if (!Array.isArray(data.list)) return { ok: false, reason: 'Tidak ada Co-Creator.' };
    const idx = data.list.map(normalizeNumber).indexOf(num);
    if (idx === -1) return { ok: false, reason: 'Nomor ini bukan Co-Creator.' };
    data.list.splice(idx, 1);
    save('cocreators');
    return { ok: true };
}

// ─── OWNER — gabungan setting.js (statis) + database (dinamis) ──────────
function ownerNumbersFromSettings() {
    try {
        const list = Array.isArray(settings.ownerNumbers) ? settings.ownerNumbers : [];
        // `ownerNumber` (tunggal) adalah field Owner utama yang juga
        // dipakai untuk tampilan nama lewat `ownerName` — nomor ini ikut
        // digabung ke sini supaya benar-benar memberi akses Owner, bukan
        // cuma teks tampilan semata.
        const single = settings.ownerNumber ? [settings.ownerNumber] : [];
        return [...single, ...list].map(normalizeNumber).filter(Boolean);
    } catch {
        return [];
    }
}

function ownerStore() {
    // store() sudah punya try/catch internal untuk read/write file (lihat
    // db.js) — kalau file gagal dibaca/ditulis, ini tetap mengembalikan
    // struktur default { list: [] } dan tidak melempar exception.
    return store('owners', { list: [] });
}

function ownerNumbersFromDatabase() {
    try {
        const data = ownerStore();
        if (!Array.isArray(data.list)) return [];
        return data.list.map(normalizeNumber).filter(Boolean);
    } catch {
        return [];
    }
}

export function isOwner(senderJid) {
    const num = normalizeNumber(senderJid);
    if (num === CREATOR.number) return true; // Creator otomatis punya hak Owner
    if (ownerNumbersFromSettings().includes(num)) return true;
    if (ownerNumbersFromDatabase().includes(num)) return true;
    return false;
}

export function listOwners() {
    // Gabungkan kedua sumber, beri tanda asalnya, dan hilangkan duplikat
    // (kalau nomor yang sama kebetulan ada di setting.js DAN database).
    const fromSettings = ownerNumbersFromSettings().map(num => ({ number: num, source: 'setting.js' }));
    const fromDb = ownerNumbersFromDatabase()
        .filter(num => !fromSettings.some(o => o.number === num))
        .map(num => ({ number: num, source: 'database' }));
    return [...fromSettings, ...fromDb];
}

/**
 * Tambah Owner baru ke DATABASE (bukan setting.js — itu tetap harus
 * diedit manual kalau mau). Hanya boleh dipanggil setelah pemanggilnya
 * diverifikasi isOwner() (otomatis true untuk Creator juga) di level
 * command/handler — jadi Owner yang sudah ada juga boleh menambah Owner
 * baru, tidak cuma Creator.
 */
export function addOwner(targetJid) {
    const num = normalizeNumber(targetJid);
    if (!num) return { ok: false, reason: 'Nomor tidak valid.' };
    if (num === CREATOR.number) return { ok: false, reason: 'Nomor ini sudah Creator (otomatis Owner).' };
    if (ownerNumbersFromSettings().includes(num)) {
        return { ok: false, reason: 'Nomor ini sudah Owner lewat setting.js.' };
    }
    const data = ownerStore();
    if (data.list.includes(num)) return { ok: false, reason: 'Nomor ini sudah menjadi Owner.' };
    data.list.push(num);
    save('owners');
    return { ok: true };
}

export function removeOwner(targetJid) {
    const num = normalizeNumber(targetJid);
    if (num === CREATOR.number) {
        return { ok: false, reason: 'Creator tidak bisa dihapus dari jabatan Owner.' };
    }
    if (ownerNumbersFromSettings().includes(num)) {
        return { ok: false, reason: 'Nomor ini Owner lewat setting.js — edit file itu langsung untuk menghapusnya.' };
    }
    const data = ownerStore();
    const idx = data.list.indexOf(num);
    if (idx === -1) return { ok: false, reason: 'Nomor ini bukan Owner (di database).' };
    data.list.splice(idx, 1);
    save('owners');
    return { ok: true };
}

// ─── PREMIUM — gabungan setting.js (statis) + database (dinamis) ────────
function premiumNumbersFromSettings() {
    try {
        const list = settings.premiumNumbers;
        if (!Array.isArray(list)) return [];
        return list.map(normalizeNumber).filter(Boolean);
    } catch {
        return [];
    }
}

function premiumStore() {
    return store('premium', { list: [] });
}

function premiumNumbersFromDatabase() {
    try {
        const data = premiumStore();
        if (!Array.isArray(data.list)) return [];
        return data.list.map(normalizeNumber).filter(Boolean);
    } catch {
        return [];
    }
}

export function isPremium(senderJid) {
    // Creator & Owner otomatis mendapat keuntungan Premium juga
    if (isOwner(senderJid)) return true;
    const num = normalizeNumber(senderJid);
    if (premiumNumbersFromSettings().includes(num)) return true;
    if (premiumNumbersFromDatabase().includes(num)) return true;
    return false;
}

export function listPremium() {
    const fromSettings = premiumNumbersFromSettings().map(num => ({ number: num, source: 'setting.js' }));
    const fromDb = premiumNumbersFromDatabase()
        .filter(num => !fromSettings.some(p => p.number === num))
        .map(num => ({ number: num, source: 'database' }));
    return [...fromSettings, ...fromDb];
}

/**
 * Tambah Premium baru ke DATABASE. Hanya boleh dipanggil setelah
 * pemanggilnya diverifikasi isOwner() (otomatis true untuk Creator juga)
 * di level command/handler.
 */
export function addPremium(targetJid) {
    const num = normalizeNumber(targetJid);
    if (!num) return { ok: false, reason: 'Nomor tidak valid.' };
    if (isOwner(num)) return { ok: false, reason: 'Owner/Creator sudah otomatis mendapat akses Premium.' };
    if (premiumNumbersFromSettings().includes(num)) {
        return { ok: false, reason: 'Nomor ini sudah Premium lewat setting.js.' };
    }
    const data = premiumStore();
    if (data.list.includes(num)) return { ok: false, reason: 'Nomor ini sudah Premium.' };
    data.list.push(num);
    save('premium');
    return { ok: true };
}

export function removePremium(targetJid) {
    const num = normalizeNumber(targetJid);
    if (premiumNumbersFromSettings().includes(num)) {
        return { ok: false, reason: 'Nomor ini Premium lewat setting.js — edit file itu langsung untuk menghapusnya.' };
    }
    const data = premiumStore();
    const idx = data.list.indexOf(num);
    if (idx === -1) return { ok: false, reason: 'Nomor ini bukan Premium (di database).' };
    data.list.splice(idx, 1);
    save('premium');
    return { ok: true };
}

// ─── HELPER: dapatkan label jabatan tertinggi seorang user ───────────────
export function getRoleLabel(senderJid) {
    if (normalizeNumber(senderJid) === CREATOR.number) return '👑 Creator';
    if (isCoCreator(senderJid))  return '🌟 Co-Creator';
    if (isOwner(senderJid))      return '⭐ Owner';
    if (isPremium(senderJid))    return '💎 Premium';
    return '👤 User';
}
