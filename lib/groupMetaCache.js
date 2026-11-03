// ═══════════════════════════════════════════════════════════════════
//  GROUPMETACACHE.JS — cache groupMetadata bersama
// ═══════════════════════════════════════════════════════════════════
// Dipisah ke file kecil ini (bukan didefinisikan langsung di index.js)
// supaya lib/messagePipeline.js (dan file lain yang butuh) bisa import
// cache yang SAMA PERSIS dengan yang dipakai index.js untuk opsi
// cachedGroupMetadata Baileys — tanpa circular import (index.js sudah
// import processIncomingMessage dari messagePipeline.js, jadi
// messagePipeline.js tidak boleh balik import dari index.js). Pola ini
// sama seperti lib/replyDelay.js, lihat komentar di file itu.
//
// FIX PERFORMA (delay balasan bot): sebelumnya lib/messagePipeline.js
// manggil sock.groupMetadata(jid) LANGSUNG setiap ada pesan grup masuk
// (buat cek isAdmin) — itu SELALU roundtrip network ke server WhatsApp,
// padahal cache di index.js sebenarnya sudah punya data yang sama
// (di-refresh tiap ada event groups.update/groups.upsert). Ini nambah
// ~ratusan ms sampai 1 detik+ ke SETIAP pesan grup, SEBELUM autoTyping
// & command-nya sendiri sempat diproses — jadi walau .delay sudah
// diset 0, waktu balas total masih kerasa 1-2 detik karena network
// round-trip ini, bukan karena delay yang disengaja di kode. Sekarang
// getGroupMetadata() di bawah ini cek cache dulu; groupMetadata() fresh
// ke WhatsApp cuma dipanggil kalau cache kosong/expired.
// CATATAN: @cacheable/node-cache (pengganti node-cache versi lawas yang
// sudah tidak di-maintain) TIDAK punya default export — importnya HARUS
// pakai kurung kurawal {NodeCache}, bukan `import NodeCache from ...`.
import { NodeCache } from '@cacheable/node-cache';

export const groupMetadataCache = new NodeCache({ stdTTL: 5 * 60, useClones: false });

/**
 * Ambil metadata grup — prioritaskan cache (instan, tanpa network),
 * fallback fetch fresh ke WhatsApp + isi cache kalau cache kosong/expired.
 * Timeout sengaja TIDAK dibungkus di sini (caller yang tahu batas waktu
 * yang pas untuk context-nya masing-masing) — cukup teruskan errornya.
 */
export async function getGroupMetadata(sock, jid) {
    const cached = groupMetadataCache.get(jid);
    if (cached) return cached;
    const fresh = await sock.groupMetadata(jid);
    groupMetadataCache.set(jid, fresh);
    return fresh;
}
