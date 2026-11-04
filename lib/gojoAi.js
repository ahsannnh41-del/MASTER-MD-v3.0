// ═══════════════════════════════════════════════════════════════════
//  GOJOAI.JS — Mode Chat AI ala Gojo Satoru (.gojoai on/off)
// ═══════════════════════════════════════════════════════════════════
//  .gojoai on/off → toggle per chat/grup, DEFAULT ON. Hanya Admin grup,
//  Owner, atau Creator yang boleh mengubah (lihat commands/index.js
//  untuk command-nya, pola sama persis dengan .autoread/.self).
//
//  Saat mode ini ON:
//    - Di DM (japri)  : bot membalas SEMUA pesan teks biasa (bukan
//                        command) pakai gaya Gojo Satoru lewat AI.
//    - Di grup         : bot HANYA membalas kalau di-mention (@bot)
//                        atau pesannya me-reply/quote pesan bot
//                        sebelumnya — supaya bot tidak ikut nimbrung
//                        di setiap obrolan biasa member grup.
//
//  Dipanggil dari lib/messagePipeline.js untuk setiap pesan yang BUKAN
//  command (lihat pemanggilan handleGojoAiChat() di sana).
// ═══════════════════════════════════════════════════════════════════

import { store, save } from './db.js';
import { log } from './logger.js';
import { areJidsSameUser } from '@whiskeysockets/baileys';
import { recallRealJid } from './lidMapping.js';

function gojoAiStore() { return store('gojoai', {}); }

export function isGojoAiEnabled(jid) {
    const data = gojoAiStore();
    // Belum pernah diatur sama sekali untuk chat ini -> default ON,
    // sesuai permintaan: fitur ini aktif dari awal begitu bot dipasang.
    return data[jid]?.enabled !== false;
}

export function setGojoAiEnabled(jid, val) {
    const data = gojoAiStore();
    data[jid] = { enabled: !!val };
    save('gojoai');
}

// ── Persona ────────────────────────────────────────────────────────
// Gojo Satoru: sombong-tapi-menghibur, percaya diri berlebihan, gaul,
// ditulis ulang gaya sendiri (bukan kutipan verbatim manga/anime) —
// konsisten dengan pendekatan di commands/gojoCommands.js.
//
// PENTING (branding): instruksi eksplisit di bawah supaya AI TIDAK
// PERNAH menyebut/membocorkan nama SC atau AI lain (Elaina, Alya,
// Ourin, ChatGPT, Llama, dst) — identitasnya harus konsisten "Gojo"
// saja, sesuai brand bot ini.
//
// FIX: dipersingkat dari versi sebelumnya — prompt yang kepanjangan
// kalau di-encode ke URL (dipakai sebagai query param di bawah) bisa
// gampang kena limit panjang URL beberapa server/proxy (umumnya di
// kisaran 4096-8192 karakter), apalagi digabung sama pesan user yang
// panjang. Ini kemungkinan besar penyebab error yang dilaporkan.
const GOJO_AI_PERSONA =
    'You are MASTER AI, the intelligent and friendly WhatsApp assistant developed by AHSAN. ' +
    'Be helpful, confident, polite, and witty. Reply concisely in 1-3 sentences. ' +
    'Your identity is strictly MASTER AI developed by AHSAN.';

// ── Pemanggilan AI eksternal ─────────────────────────────────────────
// Pakai api.siputzx.my.id — API gratis tanpa API key, dari layanan yang
// SAMA dengan yang sudah dipakai commands/bratCommands.js (BRAT_API_URL)
// supaya konsisten satu penyedia di seluruh proyek.
//
// UPDATE (2026-07-25): AI_API_URL dipastikan endpoint "metaai" —
// "https://api.siputzx.my.id/api/ai/metaai" (bukan `/api/metaai`, yang
// tanpa segmen "/ai/" itu 404 karena route-nya memang tidak ada di situ).
//
// FIX PARAMETER: endpoint ini BUKAN pakai field `prompt`+`text` terpisah
// kayak llama33 (endpoint lama) — spesifikasinya cuma SATU field teks
// polos bernama `query`. Karena tidak ada slot system-prompt terpisah,
// persona Gojo & pesan user digabung jadi satu string di buildQueryText()
// sebelum dikirim sebagai nilai `query`. Kalau balasan mulai kedengaran
// kayak Meta AI asli (bukan gaya Gojo) atau nyebut nama Meta/Llama,
// kemungkinan endpoint ini proxy langsung ke produk "Meta AI" yang
// personanya tidak selalu bisa di-override lewat teks prompt — itu
// batasan dari sisi API pihak ketiga, bukan bug di kode ini.
//
// CATATAN PENTING (lama, masih berlaku): endpoint & format respons API
// pihak ketiga gratis seperti ini TIDAK didokumentasikan resmi/stabil
// jangka panjang (bisa berubah sewaktu-waktu tanpa pemberitahuan — ini
// karakteristik umum semua API gratis sejenis, bukan cuma yang ini).
// Kalau di kemudian hari `.gojoai` berhenti membalas / selalu kena pesan
// fallback error, kemungkinan besar endpoint, nama parameter (`query`),
// atau format respons yang berubah — cukup sesuaikan AI_API_URL,
// buildQueryText(), dan/atau parseReplyText() di bawah, bagian lain
// (toggle, deteksi trigger, dst) tidak perlu diubah sama sekali.
const AI_API_URL = 'https://api.siputzx.my.id/api/ai/metaai';

async function getGojoAiReply(userText) {
    const text = userText.slice(0, 500); // FIX: dikurangi dari 2000 -> 500, mengurangi risiko URL kepanjangan
    const timeout = (ms) => new Promise((_, reject) => setTimeout(() => reject(new Error(`timeout ${ms / 1000}s`)), ms));

    // Endpoint /api/ai/metaai cuma terima SATU field teks polos: `query`.
    // Tidak ada slot system-prompt terpisah kayak llama33 (`prompt`+`text`
    // dulu), jadi persona Gojo digabung manual di depan pesan user supaya
    // tetap ada usaha menjaga gaya balasannya.
    function buildQueryText() {
        return `${GOJO_AI_PERSONA}\n\nPesan user: ${text}`;
    }

    function parseReplyText(data) {
        const t = data?.data ?? data?.result ?? data?.message ?? data?.response ?? data?.answer;
        return typeof t === 'string' && t.trim() ? t.trim() : null;
    }

    const queryText = buildQueryText();

    // Percobaan 1: GET dengan query param `query` — spesifikasi endpoint
    // /api/ai/metaai (BUKAN `prompt`+`text` seperti llama33 yang lama).
    try {
        const url = new URL(AI_API_URL);
        url.searchParams.set('query', queryText);
        const res = await Promise.race([fetch(url.toString()), timeout(20_000)]);
        if (res.ok) {
            const data = await res.json();
            const reply = parseReplyText(data);
            if (reply) return reply;
            throw new Error(`format respons tak dikenal: ${JSON.stringify(data).slice(0, 200)}`);
        }
        throw new Error(`GET HTTP ${res.status} ${res.statusText}`);
    } catch (getErr) {
        // FIX: fallback ke POST kalau GET gagal — endpoint API pihak
        // ketiga gratis semacam ini kadang butuh POST+JSON body, bukan
        // GET+query string, dan sebelumnya kalau GET gagal langsung
        // dianggap error tanpa dicoba cara lain. Sekalian log detail
        // GET-nya supaya kalau POST juga gagal, error yang ditampilkan
        // ke user (lewat log.error di handleGojoAiChat) mengandung info
        // dari KEDUA percobaan, bukan cuma pesan generik. Nama field body
        // tetap `query`, konsisten sama versi GET.
        try {
            const res = await Promise.race([
                fetch(AI_API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query: queryText }),
                }),
                timeout(20_000),
            ]);
            if (res.ok) {
                const data = await res.json();
                const reply = parseReplyText(data);
                if (reply) return reply;
                throw new Error(`format respons tak dikenal: ${JSON.stringify(data).slice(0, 200)}`);
            }
            throw new Error(`POST HTTP ${res.status} ${res.statusText}`);
        } catch (postErr) {
            throw new Error(`GET gagal (${getErr.message}); POST gagal (${postErr.message})`);
        }
    }
}

// ── Deteksi trigger ───────────────────────────────────────────────
// FIX: sebelumnya cuma bandingkan angka nomor polos dari sock.user.jid
// terhadap mentionedJid/participant — mention/reply tidak pernah
// terdeteksi (dilaporkan user). Kemungkinan besar penyebabnya: WhatsApp
// kadang melaporkan sebuah identitas (termasuk identitas bot sendiri di
// dalam suatu grup) sebagai @lid (identifier privasi WhatsApp), BUKAN
// nomor asli — perbandingan string polos jadi gagal walau sebenarnya
// merujuk ke bot yang sama. Sekarang dicek berlapis:
//   1) areJidsSameUser() bawaan Baileys (menangani suffix device :XX)
//   2) perbandingan angka nomor polos (fallback tambahan)
//   3) cache lid<->nomor asli (recallRealJid, lib/lidMapping.js),
//      dicek DUA ARAH — jid bot maupun jid pembanding bisa sama-sama
//      berupa @lid
// Juga mengumpulkan semua kemungkinan identitas bot dari objek sock
// (jid & lid kalau tersedia), bukan cuma satu sumber.
function botIdentities(sock) {
    return [sock.user?.jid, sock.user?.lid, sock.user?.id].filter(Boolean);
}

function sameJid(a, b) {
    if (!a || !b) return false;
    if (a === b) return true;
    try { if (areJidsSameUser(a, b)) return true; } catch {}
    const numA = a.split('@')[0].split(':')[0];
    const numB = b.split('@')[0].split(':')[0];
    if (numA === numB) return true;
    if (a.includes('@lid')) { const r = recallRealJid(a); if (r && sameJid(r, b)) return true; }
    if (b.includes('@lid')) { const r = recallRealJid(b); if (r && sameJid(r, a)) return true; }
    return false;
}

function isBotJid(jid, sock) {
    return botIdentities(sock).some(botId => sameJid(botId, jid));
}

function isBotMentioned(msg, sock) {
    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    return mentioned.some(j => isBotJid(j, sock));
}

function isReplyToBot(msg, sock) {
    const quotedParticipant = msg.message?.extendedTextMessage?.contextInfo?.participant;
    return !!quotedParticipant && isBotJid(quotedParticipant, sock);
}

/**
 * Dipanggil dari messagePipeline.js untuk SETIAP pesan yang BUKAN
 * command. Return true kalau pesan ini "ditangani" oleh Gojo AI, false
 * kalau dilewati (mode off / trigger tidak cocok / dsb) — supaya
 * pemanggil tahu tidak perlu proses tambahan apapun.
 */
export async function handleGojoAiChat(sock, msg, jid, body, isGroup) {
    if (!body || !body.trim()) return false;
    const trimmed = body.trim();
    if (/^[0-9]+$/.test(trimmed) || trimmed.startsWith('.') || trimmed.startsWith('/') || trimmed.startsWith('!')) {
        return false;
    }
    if (!isGojoAiEnabled(jid)) return false;

    if (isGroup) {
        // Di grup: HANYA respon kalau di-mention atau reply ke pesan bot
        // — supaya bot tidak ikut nimbrung di obrolan biasa member grup.
        if (!isBotMentioned(msg, sock) && !isReplyToBot(msg, sock)) return false;
    }
    // Di DM: selalu boleh, tidak butuh mention.

    const isSelf = !!(msg?.key?.fromMe || (sock?.user?.id && jid && jid.includes(sock.user.id.split('@')[0].split(':')[0])));
    const quoteOption = isSelf ? {} : (msg ? { quoted: msg } : {});

    try {
        const reply = await getGojoAiReply(body);
        await sock.sendMessage(jid, { text: reply }, quoteOption);
    } catch (err) {
        log.error(`GojoAI: ${err.message}`);
        try {
            await sock.sendMessage(jid, {
                text: `💭 MASTER AI is momentarily experiencing network delay. Please try again shortly.`
            }, quoteOption);
        } catch {}
    }
    return true;
}
