// ═══════════════════════════════════════════════════════════════════
//  REGISTRY.JS — Sistem wajib daftar (.daftar nama.umur)
//
//  Sengaja dipisah dari `users` store (lib/db.js, dipakai RPG/economy)
//  supaya data registrasi (nama, umur) tidak bercampur/ketimpa oleh
//  sistem karakter RPG (`!rpg <class>`) yang punya store sendiri.
// ═══════════════════════════════════════════════════════════════════

import { store, save } from './db.js';
import settings from '../setting.js';
import { getCreatorInfo } from './roles.js';

// CATATAN soal akun ber-ID "@lid": lihat penjelasan lengkap di
// lib/roles.js (fungsi normalizeNumber) — intinya, messagePipeline.js
// sudah berusaha menukar @lid ke nomor HP asli SEBELUM nilai `sender`
// sampai ke sini. Kalau gagal (WhatsApp tidak memberi tahu nomor
// aslinya), JID @lid mentah akan dipakai sebagai kunci registrasi —
// konsisten untuk identitas itu sendiri, tapi tidak akan otomatis
// "nyambung" ke pendaftaran lewat nomor HP asli orang yang sama.
function normalizeJid(jid) {
    // FIX: jangan paksa @s.whatsapp.net kalau JID-nya @lid —
    // itu akan mengubah JID @lid menjadi domain yang salah sama sekali.
    // Biarkan @lid tetap apa adanya (konsisten sebagai kunci sendiri).
    const s = (jid || '').trim();
    if (s.includes('@lid')) return s;
    return s.split('@')[0] + '@s.whatsapp.net';
}

function registryStore() {
    // store() sudah aman dari error baca/tulis file (lihat db.js) —
    // kalau file rusak/gagal dibaca, otomatis balik ke { } kosong.
    return store('registry', {});
}

/**
 * Cek apakah nomor ini sudah daftar.
 */
export function isRegistered(jid) {
    const data = registryStore();
    return Boolean(data[normalizeJid(jid)]);
}

/**
 * Ambil data profil (nama, umur, waktu daftar) — null kalau belum daftar.
 */
export function getProfile(jid) {
    const data = registryStore();
    return data[normalizeJid(jid)] || null;
}

/**
 * Parse input mentah ".daftar nama.umur" -> { name, age } atau null kalau
 * formatnya salah. Umur HARUS berupa angka (tidak ada batas min/max —
 * sesuai keputusan: "gak usah validasi umur, asal angka aja").
 */
export function parseDaftarInput(rawArgsJoined) {
    const text = String(rawArgsJoined || '').trim();
    if (!text || !text.includes('.')) return null;

    // Pisah di TITIK TERAKHIR — supaya nama yang mengandung titik
    // (jarang, tapi tetap dijaga) tidak ikut kepotong jadi bagian umur.
    const lastDot = text.lastIndexOf('.');
    const namePart = text.slice(0, lastDot).trim();
    const agePart  = text.slice(lastDot + 1).trim();

    if (!namePart) return null;
    if (!/^\d+$/.test(agePart)) return null; // harus angka bulat

    const age = parseInt(agePart, 10);
    return { name: namePart, age };
}

/**
 * Daftarkan nomor baru. Return { ok, reason? }.
 */
export function register(jid, name, age) {
    const key = normalizeJid(jid);
    const data = registryStore();
    if (data[key]) return { ok: false, reason: 'Nomor ini sudah terdaftar.' };

    data[key] = {
        name: String(name).trim(),
        age: Number(age),
        registeredAt: Date.now(),
    };
    save('registry');
    return { ok: true };
}

/**
 * Hapus pendaftaran (dipakai untuk command admin/owner kalau perlu reset).
 */
export function unregister(jid) {
    const key = normalizeJid(jid);
    const data = registryStore();
    if (!data[key]) return { ok: false, reason: 'Nomor ini belum terdaftar.' };
    delete data[key];
    save('registry');
    return { ok: true };
}

export function countRegistered() {
    return Object.keys(registryStore()).length;
}

/**
 * Pesan yang ditampilkan kalau nomor belum daftar dan mencoba pakai
 * command apapun selain `.daftar`. `pushname` adalah nama tampilan
 * WhatsApp pengirim (kalau tidak ada, fallback ke "Kak").
 */
export function buildWelcomeMessage(pushname) {
    const creator = getCreatorInfo();
    const botName = settings.botName || 'MASTER MD';
    const name = pushname || 'Kak';
    const prefix = settings.prefix || '.';
    return (
`⚡ *${botName.toUpperCase()}*
━━━━━━━━━━━━━━━━━━

👋 Halo *${name}!*
Aap register nahi hain, register karein:

📋 *CARA DAFTAR*
━━━━━━━━━━━━━━━━━━
◈ Format  : *${prefix}daftar nama.umur*
◈ Example : *${prefix}daftar Ahsan.20*
━━━━━━━━━━━━━━━━━━
> *© ${botName} | Dev: ${creator.name}*`
    );
}
