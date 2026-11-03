// ═══════════════════════════════════════════════════════════════════
//  GROUPSCHEDULER.JS — Jadwal Buka/Tutup Grup Otomatis (v3.1.0)
//  Dipakai oleh .jadwalbuka / .jadwaltutup / .canceljadwalgrup /
//  .cekjadwalgrup (lihat commands/adminCommands4.js).
//
//  Pola sengaja disamakan dengan lib/sewaBot.js: fungsi di sini PURE
//  (tidak pegang referensi `sock`), cuma mengembalikan daftar aksi yang
//  perlu dieksekusi. Efek samping (panggil sock.groupSettingUpdate,
//  kirim pesan) dilakukan di index.js — supaya konsisten dengan
//  arsitektur checker periodik yang sudah ada (checkSewaExpiry).
// ═══════════════════════════════════════════════════════════════════

import { store } from './db.js';

// State in-memory murni (reset kalau bot restart — sama seperti Map
// in-memory lain di proyek ini, misalnya groupLocks/slowmode) supaya
// jadwal yang sama tidak ke-trigger berkali-kali dalam satu hari yang
// sama (checker jalan tiap 1 menit, jendela cocok bisa lebih dari 1x
// kalau tidak dijaga).
const lastTriggered = new Map(); // `${jid}:open` | `${jid}:close` -> 'YYYY-M-D'

function todayStr() {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

// Dipanggil tiap ±1 menit dari index.js. Mengembalikan array
// { jid, action: 'open' | 'close' } untuk jadwal yang PAS cocok jam:menit
// SEKARANG dan belum dieksekusi hari ini.
export function checkGroupSchedules() {
    const groups = store('groups');
    const now    = new Date();
    const hhmm   = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const today  = todayStr();
    const actions = [];

    for (const [jid, settings] of Object.entries(groups || {})) {
        if (settings?.openTime && settings.openTime === hhmm) {
            const key = `${jid}:open`;
            if (lastTriggered.get(key) !== today) {
                lastTriggered.set(key, today);
                actions.push({ jid, action: 'open' });
            }
        }
        if (settings?.closeTime && settings.closeTime === hhmm) {
            const key = `${jid}:close`;
            if (lastTriggered.get(key) !== today) {
                lastTriggered.set(key, today);
                actions.push({ jid, action: 'close' });
            }
        }
    }
    return actions;
}
