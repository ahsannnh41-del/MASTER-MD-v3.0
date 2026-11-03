// ═══════════════════════════════════════════════════════════════════
//  SIDERTRACKER.JS — Deteksi "Sider" (member grup yang silent/gak aktif)
//
//  "Sider" = member yang ada di grup tapi gak pernah/jarang ngirim
//  pesan (cuma numpang liat doang, gak ikut ngobrol). Modul ini cuma
//  mencatat KAPAN TERAKHIR setiap nomor mengirim pesan di tiap grup —
//  deteksi siapa yang "termasuk" sider dihitung belakangan di
//  commands/adminCommands3.js dengan membandingkan data ini terhadap
//  daftar participant grup (dari groupMetadata) saat command .sider
//  dijalankan, supaya datanya selalu segar (bukan snapshot lama).
//
//  Disimpan lewat lib/db.js (store/save) — otomatis persisten ke
//  data/siderActivity.json, konsisten dengan pola store lain di bot
//  ini (lihat getGroupSettings di db.js).
// ═══════════════════════════════════════════════════════════════════

import { store, save } from './db.js';

function activityStore() {
    // Struktur: { [groupJid]: { [participantJid]: lastActiveTimestamp } }
    return store('siderActivity', {});
}

/**
 * Dipanggil dari messagePipeline.js SETIAP ada pesan masuk dari grup
 * (command ATAU chat biasa — keduanya dihitung "aktif", supaya orang
 * yang cuma pakai command tanpa pernah chat normal tidak salah
 * dianggap sider).
 */
export function markActive(groupJid, sender) {
    if (!groupJid || !sender) return;
    const data = activityStore();
    if (!data[groupJid]) data[groupJid] = {};
    data[groupJid][sender] = Date.now();
    save('siderActivity');
}

/**
 * Ambil timestamp aktivitas terakhir seseorang di sebuah grup.
 * Return null kalau belum pernah tercatat aktif sama sekali (sejak
 * fitur ini mulai berjalan / sejak join, mana yang lebih akhir).
 */
export function getLastActive(groupJid, participantJid) {
    const data = activityStore();
    return data[groupJid]?.[participantJid] ?? null;
}

/**
 * Hapus semua data aktivitas sebuah grup (dipakai kalau grup di-reset
 * atau bot di-remove dari grup tersebut — opsional, tidak otomatis
 * dipanggil di mana pun, disediakan untuk keperluan maintenance).
 */
export function clearGroupActivity(groupJid) {
    const data = activityStore();
    if (data[groupJid]) {
        delete data[groupJid];
        save('siderActivity');
    }
}

/**
 * Hitung daftar sider untuk sebuah grup.
 *
 * @param groupJid     JID grup
 * @param participants Array participant dari sock.groupMetadata(jid).participants
 *                      (masing-masing punya .id, dan biasanya .admin)
 * @param thresholdMs   Berapa lama TIDAK aktif sebelum dianggap sider.
 *                      Default 3 hari.
 * @param excludeAdmin  Kalau true, admin/superadmin grup tidak pernah
 *                       dianggap sider walau memang belum pernah chat
 *                       (default true — supaya admin yang jarang chat
 *                       gak ke-kick gara-gara dianggap sider).
 *
 * Return array of { id, lastActive (timestamp|null), idleMs (number|null) }
 * — idleMs null artinya BELUM PERNAH tercatat aktif sama sekali.
 */
export function computeSiders(groupJid, participants, thresholdMs, excludeAdmin = true) {
    const now = Date.now();
    const result = [];
    for (const p of participants) {
        if (!p?.id) continue;
        if (excludeAdmin && (p.admin === 'admin' || p.admin === 'superadmin')) continue;

        const last = getLastActive(groupJid, p.id);
        const idleMs = last ? (now - last) : null;
        const isSider = last === null || idleMs >= thresholdMs;

        if (isSider) {
            result.push({ id: p.id, lastActive: last, idleMs });
        }
    }
    // Yang paling lama nggak aktif (atau belum pernah sama sekali)
    // ditampilkan paling atas — null (belum pernah aktif) dianggap
    // "paling sider", jadi diurutkan duluan.
    result.sort((a, b) => {
        if (a.idleMs === null && b.idleMs === null) return 0;
        if (a.idleMs === null) return -1;
        if (b.idleMs === null) return 1;
        return b.idleMs - a.idleMs;
    });
    return result;
}
