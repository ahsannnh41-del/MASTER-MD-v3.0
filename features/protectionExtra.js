// ═══════════════════════════════════════════════════════════════════
//  PROTECTIONEXTRA.JS — Perluasan Sistem Proteksi (v3.1.0)
//  Anti-Link-Phising · Anti-Judol · Anti-Pinjol
//  Anti-Caps · Anti-Virtex · Anti-Tag
//  + Whitelist proteksi, custom bad-word, link allowlist, mute per-member
//
//  File ini SENGAJA terpisah dari features/protection.js (bukan
//  menambah isi file itu secara langsung) supaya proteksi versi 3.0.0
//  yang sudah terbukti jalan (antigb/antilink/antispam/antitoxic) tidak
//  ikut ke-utak-atik / berisiko regresi. protection.js meng-import 2
//  fungsi kecil dari sini (getCustomBadWords, isLinkAllowed) — jadi
//  arah dependency SATU ARAH saja (protection.js -> protectionExtra.js),
//  tidak circular.
// ═══════════════════════════════════════════════════════════════════

import { getGroupSettings, store, save } from '../lib/db.js';
import { jidNum } from '../lib/utils.js';
import { log } from '../lib/logger.js';
import { adminCommands2 } from '../commands/adminCommands2.js';

// ─── STORAGE: whitelist / custom bad-word / allow-link per grup ───────────
function extraStore() {
    return store('groupProtectionExtra', {});
}

function getExtra(jid) {
    const data = extraStore();
    if (!data[jid]) {
        data[jid] = { whitelist: [], customBadWords: [], allowedLinks: [] };
        save('groupProtectionExtra');
    }
    // FIX: file lama (sebelum v3.1.0) belum punya field ini — pastikan
    // selalu ada supaya .push()/.includes() tidak error di grup lama.
    if (!Array.isArray(data[jid].whitelist))      data[jid].whitelist = [];
    if (!Array.isArray(data[jid].customBadWords)) data[jid].customBadWords = [];
    if (!Array.isArray(data[jid].allowedLinks))   data[jid].allowedLinks = [];
    return data[jid];
}

// ── WHITELIST (bebas dari SEMUA proteksi baru di file ini) ────────────────
export function isWhitelisted(jid, sender) {
    return getExtra(jid).whitelist.includes(sender);
}
export function addWhitelist(jid, target) {
    const extra = getExtra(jid);
    if (extra.whitelist.includes(target)) return false;
    extra.whitelist.push(target);
    save('groupProtectionExtra');
    return true;
}
export function removeWhitelist(jid, target) {
    const extra = getExtra(jid);
    const before = extra.whitelist.length;
    extra.whitelist = extra.whitelist.filter(id => id !== target);
    save('groupProtectionExtra');
    return extra.whitelist.length !== before;
}
export function listWhitelist(jid) {
    return getExtra(jid).whitelist;
}

// ── CUSTOM BAD-WORD (dipakai tambahan oleh antiToxic di protection.js) ────
export function addCustomBadWord(jid, word) {
    const w = word.toLowerCase().trim();
    if (!w) return false;
    const extra = getExtra(jid);
    if (extra.customBadWords.includes(w)) return false;
    extra.customBadWords.push(w);
    save('groupProtectionExtra');
    return true;
}
export function removeCustomBadWord(jid, word) {
    const w = word.toLowerCase().trim();
    const extra = getExtra(jid);
    const before = extra.customBadWords.length;
    extra.customBadWords = extra.customBadWords.filter(x => x !== w);
    save('groupProtectionExtra');
    return extra.customBadWords.length !== before;
}
export function getCustomBadWords(jid) {
    return getExtra(jid).customBadWords;
}

// ── LINK ALLOWLIST (dipakai sebagai pengecualian oleh antiLink) ───────────
export function addAllowLink(jid, domain) {
    const d = domain.toLowerCase().trim();
    if (!d) return false;
    const extra = getExtra(jid);
    if (extra.allowedLinks.includes(d)) return false;
    extra.allowedLinks.push(d);
    save('groupProtectionExtra');
    return true;
}
export function removeAllowLink(jid, domain) {
    const d = domain.toLowerCase().trim();
    const extra = getExtra(jid);
    const before = extra.allowedLinks.length;
    extra.allowedLinks = extra.allowedLinks.filter(x => x !== d);
    save('groupProtectionExtra');
    return extra.allowedLinks.length !== before;
}
export function listAllowLink(jid) {
    return getExtra(jid).allowedLinks;
}
export function isLinkAllowed(jid, body) {
    const list = getExtra(jid).allowedLinks;
    if (!list.length) return false;
    const lower = body.toLowerCase();
    return list.some(d => lower.includes(d));
}

// ── MUTE PER-MEMBER (beda dengan .mute yang membisukan SELURUH grup) ──────
const mutedMembers = new Map(); // jid grup -> Set(sender)
export function muteMemberOn(jid, target) {
    if (!mutedMembers.has(jid)) mutedMembers.set(jid, new Set());
    mutedMembers.get(jid).add(target);
}
export function muteMemberOff(jid, target) {
    mutedMembers.get(jid)?.delete(target);
}
export function isMemberMuted(jid, target) {
    return mutedMembers.get(jid)?.has(target) || false;
}
export function listMutedMembers(jid) {
    return [...(mutedMembers.get(jid) || [])];
}

export async function checkMemberMute(sock, msg, jid, sender, isAdmin) {
    if (isAdmin) return false;
    if (!isMemberMuted(jid, sender)) return false;
    try { await sock.sendMessage(jid, { delete: msg.key }); } catch { /* ignore */ }
    return true;
}

// ─── HELPER: hapus pesan + kirim notifikasi (mention pengirim) ────────────
async function deleteAndNotify(sock, msg, jid, sender, text) {
    try { await sock.sendMessage(jid, { delete: msg.key }); } catch { /* ignore */ }
    try {
        await sock.sendMessage(jid, { text, mentions: [sender] });
    } catch (err) {
        log.error(`ProtectionExtra notify: ${err.message}`);
    }
}

// Setiap fungsi anti-X di bawah menerima `isAdmin` yang SUDAH dihitung oleh
// lib/messagePipeline.js (bukan menghitung ulang groupMetadata sendiri
// seperti di protection.js versi lama) — lebih efisien (satu groupMetadata
// per pesan, bukan satu per jenis proteksi) dan otomatis sadar @lid karena
// isAdmin dari pipeline sudah melalui pencocokan @lid-aware.
function bypass(jid, sender, isAdmin) {
    return isAdmin || isWhitelisted(jid, sender);
}

// ═══════════════════════════════════════════════════════════════════
//  ANTI-LINK-PHISING
//  Beda dari .antilink biasa (yang blokir SEMUA link): ini spesifik
//  menyasar pola phishing (form verifikasi akun palsu, klaim hadiah
//  palsu, domain punycode) — bisa aktif sendiri walau .antilink OFF,
//  supaya grup yang memang butuh sharing link bebas tetap terlindungi
//  dari link berbahaya secara spesifik.
// ═══════════════════════════════════════════════════════════════════
const PHISHING_KEYWORDS_RE = new RegExp([
    'verifikasi akun', 'akun (anda|kamu) (akan |sudah )?(di ?)?(blokir|suspend|banned|nonaktif)',
    'klaim hadiah', 'menang(kan)? (undian|hadiah|giveaway)', 'hadiah (senilai|sebesar|spesial)',
    'saldo gratis', 'dana kaget', 'centang biru gratis', 'akun (anda|kamu) akan dihapus',
    'konfirmasi (akun|data|kartu)', 'update data akun', 'form(ulir)? verifikasi',
    'pemenang (ke|nomor|undian)', 'selamat anda (terpilih|mendapatkan)',
].join('|'), 'i');
const SUSPICIOUS_LINK_RE = /https?:\/\/[^\s]+|www\.[^\s]+\.[a-z]{2,}|\b[a-z0-9-]{3,}\.(tk|ml|ga|cf|gq|xyz|top|click|rest|zip|country)\b/i;
const PUNYCODE_RE = /xn--/i;

function looksLikePhishing(body) {
    if (!body) return false;
    if (PUNYCODE_RE.test(body)) return true;
    if (!SUSPICIOUS_LINK_RE.test(body)) return false;
    return PHISHING_KEYWORDS_RE.test(body);
}

export async function antiLinkPhishing(sock, msg, jid, sender, body, isAdmin) {
    const s = getGroupSettings(jid);
    if (!s.antilinkphising) return false;
    if (bypass(jid, sender, isAdmin)) return false;
    if (!looksLikePhishing(body)) return false;

    log.protection('anti-link-phising', jidNum(sender));
    await deleteAndNotify(sock, msg, jid, sender,
`🎣 *[ ANTI-PHISHING ACTIVE ]*

@${jidNum(sender)}, your message was detected containing suspicious phishing links/patterns!
❌ Message deleted automatically for group security.

_Never click untrusted links._`);
    return true;
}

// ═══════════════════════════════════════════════════════════════════
//  ANTI-JUDOL — online gambling / betting promotions
// ═══════════════════════════════════════════════════════════════════
const JUDOL_PHRASES = [
    'slot gacor', 'maxwin', 'situs slot', 'rtp tinggi', 'rtp live',
    'bandar togel', 'bandar judi', 'judi online', 'agen slot',
    'pola gacor', 'scatter hitam', 'wd tercepat', 'slot online terpercaya',
    'daftar slot', 'toto slot', 'link slot', 'situs togel',
];

function looksLikeJudol(body) {
    const lower = body.toLowerCase();
    return JUDOL_PHRASES.some(p => lower.includes(p));
}

export async function antiJudol(sock, msg, jid, sender, body, isAdmin) {
    const s = getGroupSettings(jid);
    if (!s.antijudol) return false;
    if (bypass(jid, sender, isAdmin)) return false;
    if (!looksLikeJudol(body)) return false;

    log.protection('anti-judol', jidNum(sender));
    await deleteAndNotify(sock, msg, jid, sender,
`🎰 *[ ANTI-GAMBLING ACTIVE ]*

@${jidNum(sender)}, gambling and casino promotions are strictly prohibited!
❌ Message deleted automatically.`);
    return true;
}

// ═══════════════════════════════════════════════════════════════════
//  ANTI-PINJOL — unauthorized loan promotions
// ═══════════════════════════════════════════════════════════════════
const PINJOL_PHRASES = [
    'pinjaman tanpa jaminan', 'pinjol ilegal', 'dana cepat cair',
    'cair tanpa ribet', 'pinjaman ktp saja', 'pinjaman online cepat cair',
    'cair dalam hitungan menit', 'tanpa survey langsung cair',
    'pinjaman tanpa survey', 'bunga rendah langsung cair',
];

function looksLikePinjol(body) {
    const lower = body.toLowerCase();
    return PINJOL_PHRASES.some(p => lower.includes(p));
}

export async function antiPinjol(sock, msg, jid, sender, body, isAdmin) {
    const s = getGroupSettings(jid);
    if (!s.antipinjol) return false;
    if (bypass(jid, sender, isAdmin)) return false;
    if (!looksLikePinjol(body)) return false;

    log.protection('anti-pinjol', jidNum(sender));
    await deleteAndNotify(sock, msg, jid, sender,
`💸 *[ ANTI-LOAN SPAM ACTIVE ]*

@${jidNum(sender)}, unauthorized loan promotions are not allowed!
❌ Message deleted automatically.`);
    return true;
}

// ═══════════════════════════════════════════════════════════════════
//  ANTI-CAPS — excessive uppercase characters
// ═══════════════════════════════════════════════════════════════════
function isExcessiveCaps(body) {
    const letters = (body || '').replace(/[^a-zA-Z]/g, '');
    if (letters.length < 15) return false;
    const upper = letters.replace(/[^A-Z]/g, '').length;
    return (upper / letters.length) > 0.7;
}

export async function antiCaps(sock, msg, jid, sender, body, isAdmin) {
    const s = getGroupSettings(jid);
    if (!s.anticaps) return false;
    if (bypass(jid, sender, isAdmin)) return false;
    if (!isExcessiveCaps(body)) return false;

    log.protection('anti-caps', jidNum(sender));
    await deleteAndNotify(sock, msg, jid, sender,
`🔠 *[ ANTI-CAPS ACTIVE ]*

@${jidNum(sender)}, please avoid shouting in all-caps!
❌ Message deleted automatically.`);
    return true;
}

// ═══════════════════════════════════════════════════════════════════
//  ANTI-VIRTEX — crash text / unicode zalgo spam
// ═══════════════════════════════════════════════════════════════════
function isVirtexMessage(body) {
    if (!body) return false;
    if (body.length > 5000) return true;
    const combining = (body.match(/[\u0300-\u036f\u1ab0-\u1aff\u1dc0-\u1dff\u20d0-\u20ff\ufe20-\ufe2f]/g) || []).length;
    if (combining > 60) return true;
    if (/(.)\1{300,}/.test(body)) return true;
    return false;
}

export async function antiVirtex(sock, msg, jid, sender, body, isAdmin) {
    const s = getGroupSettings(jid);
    if (!s.antivirtex) return false;
    if (bypass(jid, sender, isAdmin)) return false;
    if (!isVirtexMessage(body)) return false;

    log.protection('anti-virtex', jidNum(sender));
    await deleteAndNotify(sock, msg, jid, sender,
`💣 *[ ANTI-VIRTEX ACTIVE ]*

@${jidNum(sender)}, malicious crash text (virtex) detected!
❌ Message deleted automatically before causing lag.`);
    return true;
}

// ═══════════════════════════════════════════════════════════════════
//  ANTI-TAG — mass mention spam by non-admins
// ═══════════════════════════════════════════════════════════════════
const TAG_SPAM_THRESHOLD = 5;

function getMentionedJids(msg) {
    return msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
}

export async function antiTagSpam(sock, msg, jid, sender, isAdmin) {
    const s = getGroupSettings(jid);
    if (!s.antitag) return false;
    if (bypass(jid, sender, isAdmin)) return false;

    const mentioned = getMentionedJids(msg);
    if (mentioned.length < TAG_SPAM_THRESHOLD) return false;

    log.protection('anti-tag', jidNum(sender));
    await deleteAndNotify(sock, msg, jid, sender,
`📛 *[ ANTI-TAG SPAM ACTIVE ]*

@${jidNum(sender)}, mass mentioning members (${mentioned.length}) is not allowed!
❌ Message deleted automatically.

_Only group admins may use mass mentions (.tagall / .hidetag)._`);
    return true;
}

// ═══════════════════════════════════════════════════════════════════
//  Banned re-join check
// ═══════════════════════════════════════════════════════════════════
function getBotNum(sock) {
    return sock.user?.jid?.split('@')[0]?.split(':')[0] || null;
}

export async function checkBannedRejoin(sock, jid, participants) {
    const botNum = getBotNum(sock);

    for (const p of participants) {
        if (!p) continue;
        const num = jidNum(p);
        if (!num || num === botNum) continue;
        if (!adminCommands2.isBanned(jid, p)) continue;

        try {
            await sock.groupParticipantsUpdate(jid, [p], 'remove');
            await sock.sendMessage(jid, {
                text: `🚫 @${num} is banned in this group and has been removed automatically.\n_Use *.unban* to restore access._`,
                mentions: [p],
            });
            log.protection('banned-rejoin', num);
        } catch (err) {
            log.error(`Failed to remove banned user ${num}: ${err.message}`);
        }
    }
}
