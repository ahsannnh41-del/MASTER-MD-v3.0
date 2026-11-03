// ═══════════════════════════════════════════════════════════════════
//  LIDMAPPING.JS — Cache permanen "@lid" -> nomor HP asli
//
//  WhatsApp tidak selalu konsisten kapan dia memberi tahu nomor HP asli
//  seseorang (lewat field participantPn/senderPn dari Baileys) vs kapan
//  dia cuma kasih ID acak "@lid". Supaya bot tidak "lupa" nomor asli
//  seseorang yang SUDAH PERNAH diketahui sebelumnya, setiap kali Baileys
//  kebetulan memberikan pasangan (lid, nomor asli) dalam satu pesan, kita
//  simpan permanen di sini. Lain kali pesan dari LID yang sama datang
//  TANPA nomor asli sama sekali, kita masih bisa "ingat" dari cache ini.
//
//  CATATAN JUJUR: ini tetap bukan solusi sempurna. Kalau LID seseorang
//  BELUM PERNAH sekalipun muncul bersama nomor aslinya (dari pesan
//  manapun sejak bot ini berjalan), cache ini tidak akan punya apa-apa
//  untuk LID itu, dan bot akan tetap menampilkan/memperlakukannya sebagai
//  @lid mentah — karena memang belum ada cara mengetahui nomor aslinya
//  sampai WhatsApp sendiri memberikan info itu di pesan manapun.
// ═══════════════════════════════════════════════════════════════════

import { store, save } from './db.js';

function mapStore() {
    return store('lidMapping', {});
}

/**
 * Simpan pasangan (lidJid, realPnJid) kalau Baileys memberikannya.
 * Dipanggil setiap kali resolveSenderJid() kebetulan punya kedua field
 * tersebut dalam satu pesan yang sama.
 */
export function rememberLidMapping(lidJid, realPnJid) {
    if (!lidJid || !realPnJid) return;
    if (!lidJid.includes('@lid')) return;
    const data = mapStore();
    if (data[lidJid] === realPnJid) return; // sudah sama, tidak perlu tulis ulang
    data[lidJid] = realPnJid;
    save('lidMapping');
}

/**
 * Ambil nomor asli yang pernah tercatat untuk sebuah @lid, kalau ada.
 * Return null kalau belum pernah tercatat sama sekali.
 */
export function recallRealJid(lidJid) {
    if (!lidJid || !lidJid.includes('@lid')) return null;
    const data = mapStore();
    return data[lidJid] || null;
}
