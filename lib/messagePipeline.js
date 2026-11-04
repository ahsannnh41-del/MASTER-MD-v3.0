// ═══════════════════════════════════════════════════════════════════
//  MESSAGEPIPELINE.JS — Pemrosesan Pesan Masuk
//  + Auto-Read, Auto-Typing, Cooldown System, Better Logging
// ═══════════════════════════════════════════════════════════════════

import { isJidGroup } from '@whiskeysockets/baileys';
import { handleCommand, checkMute, commandExists } from '../commands/index.js';
import { adminCommands2 } from '../commands/adminCommands2.js';
import { checkSlowmode, checkContentLock } from '../commands/adminCommands.js';
import { antiGB, antiLink, antiShortLink, antiSpam, antiToxic, antiFlood } from '../features/protection.js';
import {
    antiLinkPhishing, antiJudol, antiPinjol,
    antiCaps, antiVirtex, antiTagSpam, checkMemberMute,
} from '../features/protectionExtra.js';
import { antiNsfw } from '../features/antiNsfw.js';
import { trackMedia } from '../commands/mediaCommands.js';
import { checkCooldown, setCooldown, cooldownMsg } from './cooldown.js';
import { log } from './logger.js';
import settings from '../setting.js';
import { withTimeout, resolveSenderJid } from './utils.js';
import { recallRealJid } from './lidMapping.js';
import { getReplyDelayOverride } from './replyDelay.js';
import { getGroupMetadata } from './groupMetaCache.js';
import { isOwner, isCreator } from './roles.js';
import { trackActivity, isMaintenanceMode } from '../commands/adminCommands6.js';
import { markActive } from './siderTracker.js';
import { resolveMenuShortcut } from './menuShortcut.js';
import { handleAutoFeatures } from './autoFeatures.js';
import { shouldBlockDmChat } from '../features/antiCallChat.js';
import { handleGojoAiChat } from './gojoAi.js';

const PREFIX = settings.prefix || '.';

// ─── HELPER: Ekstrak ID dari balasan Native Flow (tombol interaktif) ──
function extractNativeFlowId(msg) {
    try {
        const paramsJson = msg.message?.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson;
        if (!paramsJson) return '';
        const parsed = JSON.parse(paramsJson);
        return parsed?.id || '';
    } catch {
        return '';
    }
}

function extractNativeFlowFromContent(content) {
    try {
        const paramsJson = content?.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson;
        if (!paramsJson) return '';
        const parsed = JSON.parse(paramsJson);
        return parsed?.id || '';
    } catch {
        return '';
    }
}

// ─── HELPER: Auto-read ───────────────────────────────────────────
async function autoRead(sock, msg) {
    if (!settings.autoRead) return;
    try {
        await withTimeout(sock.readMessages([msg.key]), 10_000, 'readMessages');
    } catch { /* ignore */ }
}

// ─── HELPER: Auto-typing ─────────────────────────────────────────
async function autoTyping(sock, jid) {
    if (!settings.autoTyping) return;
    const override = getReplyDelayOverride();
    if (override === 0) return; // instan — skip typing indicator
    try {
        await withTimeout(sock.sendPresenceUpdate('composing', jid), 3_000, 'sendPresenceUpdate(composing)');
        const ms = override !== null ? override * 1000 : 250;
        await new Promise(r => setTimeout(r, ms));
        await withTimeout(sock.sendPresenceUpdate('paused', jid), 3_000, 'sendPresenceUpdate(paused)');
    } catch { /* ignore */ }
}

// ─── OWNER CHECK ─────────────────────────────────────────────────
// (fungsi isOwner sekarang diimport dari roles.js — mendukung Creator
// hardcoded + banyak Owner dinamis, bukan cuma satu nomor statis)

// ─── DEDUP PESAN MASUK ─────────────────────────────────────────────
// FIX (2026-08-06, root cause kemungkinan besar thumbnail "gak konsisten"
// pas testing di self-chat "Message yourself"): dari log console user,
// SATU pengiriman ".menu" ternyata tercatat masuk & diproses LENGKAP DUA
// KALI — dua baris "📩 [DM]" + "⚡ → .menu" persis di detik yang sama,
// PAS bersamaan dengan sesi Signal yang lagi "Closing session"/dirotasi.
// Ini kemungkinan besar quirk multi-device WhatsApp saat kirim pesan ke
// NOMOR SENDIRI (self-chat): pesan yang sama bisa tersinkron balik lewat
// lebih dari satu jalur pengiriman ke device yang sama. Efeknya: DUA
// eksekusi sendMainMenu() (atau command apapun) jalan nyaris BERBARENGAN
// untuk satu input yang sama — termasuk dua kali kirim gambar & dua kali
// kirim pesan tombol ke JID yang sama nyaris bersamaan, yang bisa saling
// tabrakan/rebutan (apalagi kalau pas bertepatan sesi Signal lagi ditutup
// ulang seperti terlihat di log). Command yang idempoten (mis. .ping)
// tidak akan kelihatan masalahnya kalau dijalankan 2x — tapi command yang
// kirim media/efek samping bisa kena race condition yang membingungkan
// persis seperti kasus ini.
// FIX: setiap message ID yang sudah diproses dicatat sebentar (10 detik).
// Kalau ID yang SAMA (dari JID yang sama) masuk lagi dalam rentang itu,
// dianggap duplikat pengiriman dan dilewati total SEBELUM masuk ke logic
// command apapun di bawah — jadi cuma diproses SEKALI, seperti seharusnya.
const recentMessageIds = new Map(); // id -> waktu diproses (ms)
const DEDUP_WINDOW_MS = 10_000;

function isDuplicateMessage(id) {
    if (!id) return false; // tidak ada ID buat dicek -> proses seperti biasa
    const now = Date.now();
    for (const [k, t] of recentMessageIds) {
        if (now - t > DEDUP_WINDOW_MS) recentMessageIds.delete(k); // bersihkan entri lama sekalian
    }
    if (recentMessageIds.has(id)) return true;
    recentMessageIds.set(id, now);
    return false;
}

// ─── MAIN PIPELINE ───────────────────────────────────────────────
export async function processIncomingMessage(sock, msg) {
    if (!msg.message) return;

    if (isDuplicateMessage(msg.key.id)) {
        log?.debug?.(`[dedup] pesan duplikat dilewati (ID sudah diproses <10 detik lalu): ${msg.key.id}`);
        return;
    }


    const jid     = msg.key.remoteJid;
    const isGroup = isJidGroup(jid);

    // Recursively unwrap ephemeral, viewOnce, and document wrappers
    let msgContent = msg.message;
    if (msgContent?.ephemeralMessage?.message) {
        msgContent = msgContent.ephemeralMessage.message;
    }
    if (msgContent?.viewOnceMessage?.message) {
        msgContent = msgContent.viewOnceMessage.message;
    }
    if (msgContent?.viewOnceMessageV2?.message) {
        msgContent = msgContent.viewOnceMessageV2.message;
    }
    if (msgContent?.documentWithCaptionMessage?.message) {
        msgContent = msgContent.documentWithCaptionMessage.message;
    }

    const body    =
        msgContent?.conversation                                          ||
        msgContent?.extendedTextMessage?.text                             ||
        msgContent?.imageMessage?.caption                                 ||
        msgContent?.videoMessage?.caption                                 ||
        msgContent?.buttonsResponseMessage?.selectedButtonId              ||
        msgContent?.listResponseMessage?.singleSelectReply?.selectedRowId ||
        msgContent?.templateButtonReplyMessage?.selectedId                ||
        extractNativeFlowId(msg)                                           ||
        extractNativeFlowFromContent(msgContent)                           ||
        '';

    const trimmedBody = (body || '').trim();
    const PREFIX = settings.prefix || '.';
    const startsWithPrefix = trimmedBody.startsWith(PREFIX) || trimmedBody.startsWith('.') || trimmedBody.startsWith('!') || trimmedBody.startsWith('/');

    // Pesan fromMe: hanya proses kalau itu command (diawali prefix atau shortcut menu 1-9)
    if (msg.key.fromMe && !startsWithPrefix && !/^[1-9]$/.test(trimmedBody)) return;

    // FIX BUG @lid: resolve sender JID
    const rawSelfId   = sock.user?.id || '';
    const botOwnNumber = rawSelfId.split('@')[0].split(':')[0];
    const sender = (msg.key.fromMe && botOwnNumber)
        ? `${botOwnNumber}@s.whatsapp.net`
        : (isGroup ? resolveSenderJid(msg, true) : resolveSenderJid(msg, false));

    if (!body) return;

    // Normalize JID if it is @lid with known real JID
    let targetJid = jid;
    if (targetJid && targetJid.includes('@lid')) {
        const recalled = recallRealJid(targetJid);
        if (recalled) {
            targetJid = recalled;
        }
    }

    // Self-mode: hanya owner yang bisa pakai bot
    if (settings.selfMode && !isOwner(sender)) return;

    const num     = (sender || '').split('@')[0];
    const chatTag = isGroup ? '[GRP]' : '[DM] ';

    // Shortcut angka: kalau user balas "1".."9", langsung eksekusi command tujuan (tanpa delay atau AI)
    const shortcutCmd  = resolveMenuShortcut(sender, trimmedBody || body);
    const effectiveBody = shortcutCmd ? `${PREFIX}${shortcutCmd}` : body;

    const activePrefix = [PREFIX, '.', '!', '/'].find(p => effectiveBody.startsWith(p));
    const isCmd   = Boolean(activePrefix || shortcutCmd);

    // Log pesan masuk
    if (settings.logMessages) {
        log.msg(chatTag, num, body);
    }

    // Auto-read & auto-typing (per-chat setting, diatur via .autoread/.autotyping)
    // FIX PERFORMA: sebelumnya di-await — pipeline nunggu readMessages()/
    // sendPresenceUpdate() (network call ke WhatsApp) selesai dulu sebelum
    // lanjut. Tidak ada langkah di bawah ini yang butuh hasil dari fungsi
    // ini, jadi sekarang dilepas (fire-and-forget) — jalan di background,
    // tidak ikut menambah waktu tunggu sebelum balasan command diproses.
    handleAutoFeatures(sock, msg, jid).catch(() => {});

    trackMedia(jid, msg);

    // ── Catat aktivitas untuk fitur .sider ──────────────────────────
    // Dicatat di SINI (sebelum proteksi/cooldown/dsb) supaya SEMUA jenis
    // pesan grup (chat biasa ATAUPUN command) dihitung "aktif" — bukan
    // cuma yang lolos semua filter di bawah. Tujuannya supaya member yang
    // emang aktif chat tidak salah ke-deteksi sebagai sider gara-gara,
    // misalnya, pesannya kena anti-spam atau lagi di-mute.
    if (isGroup) {
        try { markActive(jid, sender); } catch { /* ignore */ }
    }

    // ── Status admin (hanya grup) ──────────────────────────────────
    // FIX PERFORMA: sebelumnya SELALU sock.groupMetadata(jid) fresh ke
    // WhatsApp di SETIAP pesan grup — network round-trip ini nambah
    // ratusan ms sampai 1 detik+ ke waktu balas bot, bahkan waktu
    // .delay sudah diset 0 (karena ini terjadi SEBELUM autoTyping,
    // .delay cuma ngatur bagian typing-nya saja). Sekarang pakai
    // getGroupMetadata() dari lib/groupMetaCache.js — cache 5 menit
    // yang SAMA dipakai Baileys sendiri, jadi kalau cache masih ada,
    // ini nyaris instan tanpa network call sama sekali. Cache otomatis
    // ke-refresh tiap ada event groups.update, jadi perubahan admin
    // tetap ke-detect, cuma delay-nya maksimal beberapa menit (atau
    // instan kalau memang ada event group update-nya).
    let isAdmin = false;
    if (isGroup) {
        try {
            const meta = await withTimeout(getGroupMetadata(sock, jid), 15_000, 'groupMetadata');
            // FIX @lid: p.id di groupMetadata bisa @lid sementara sender sudah
            // di-resolve ke @s.whatsapp.net — strict === selalu false → isAdmin false.
            const participant = meta.participants.find(p => {
                if (p.id === sender) return true;
                if (p.id.includes('@lid')) { const r = recallRealJid(p.id); if (r && r === sender) return true; }
                if (sender.includes('@lid')) { const r = recallRealJid(sender); if (r && r === p.id) return true; }
                return false;
            });
            isAdmin = participant?.admin === 'admin' || participant?.admin === 'superadmin';
        } catch { /* bukan admin jika metadata gagal */ }
    }


    // ── Proteksi grup ─────────────────────────────────────────────
    if (isGroup) {
        const blocked =
            (await antiGB(sock, msg, jid, sender, body))                    ||
            (await antiLink(sock, msg, jid, sender, body))                   ||
            (await antiShortLink(sock, msg, jid, sender, body))              ||
            // v3.1.0: proteksi tambahan — lihat features/protectionExtra.js
            (await antiLinkPhishing(sock, msg, jid, sender, body, isAdmin))  ||
            (await antiSpam(sock, msg, jid, sender))                         ||
            (await antiFlood(sock, msg, jid, sender))                        ||
            (await antiToxic(sock, msg, jid, sender, body))                  ||
            (await antiJudol(sock, msg, jid, sender, body, isAdmin))         ||
            (await antiPinjol(sock, msg, jid, sender, body, isAdmin))        ||
            (await antiCaps(sock, msg, jid, sender, body, isAdmin))          ||
            (await antiVirtex(sock, msg, jid, sender, body, isAdmin))        ||
            (await antiTagSpam(sock, msg, jid, sender, isAdmin))             ||
            (await checkMute(sock, msg, jid, sender, isAdmin))               ||
            (await checkMemberMute(sock, msg, jid, sender, isAdmin))         ||
            (await checkSlowmode(sock, msg, jid, sender))                    ||
            (await checkContentLock(sock, msg, jid, sender, isAdmin))        ||
            // v3.2.0: anti-NSFW — sengaja ditaruh PALING TERAKHIR di rantai
            // ini, karena satu-satunya pengecekan di atas yang mungkin
            // memanggil API eksternal (lihat features/antiNsfw.js) — kalau
            // pesan sudah ke-blokir oleh proteksi lain yang lebih murah di
            // atas, pengecekan NSFW tidak perlu dijalankan sama sekali.
            (await antiNsfw(sock, msg, jid, sender, isAdmin));

        if (blocked) return;

        // Activity tracker (.topactive / .listinactive) — catat SETIAP
        // pesan grup yang lolos proteksi, command maupun chat biasa.
        try { trackActivity(jid, sender); } catch { /* ignore */ }

        // Blokir user yang di-ban
        if (isCmd && adminCommands2.isBanned(jid, sender)) return;

        // Auto-reply (non-command)
        if (!isCmd) {
            const ar = adminCommands2.checkAutoReply(jid, body);
            if (ar) {
                try { await sock.sendMessage(jid, { text: ar }, { quoted: msg }); } catch {}
            }
        }
    }

    // ── Non-command handling: AI Chat permanently removed per user request ────
    if (!isCmd) {
        return;
    }

    const prefixLen = activePrefix ? activePrefix.length : 0;
    const parts   = effectiveBody.slice(prefixLen).trim().split(/ +/);
    const command = parts.shift().toLowerCase();
    const args    = parts;

    // ── Maintenance mode (.maintenancemode on/off) ──────────────────
    if (isGroup && command !== 'maintenancemode' && isMaintenanceMode(jid) && !isOwner(sender) && !isCreator(sender)) {
        return;
    }

    // ── Log command ───────────────────────────────────────────────
    if (settings.logCommands) {
        log.cmd(num, `.${command}`, args);
    }

    // ── Cooldown check (owner/creator bypass jika dikonfigurasi) ──
    const ownerSkipCd = (settings.ownerBypassCooldown && isOwner(sender)) || isCreator(sender);
    const isSelfChat = !!(msg.key.fromMe || (botOwnNumber && (targetJid || jid).includes(botOwnNumber)));
    if (!ownerSkipCd) {
        const remaining = checkCooldown(sender, command);
        if (remaining > 0) {
            log.cooldown(num, command, (remaining / 1000).toFixed(1));
            try {
                await sock.sendMessage(targetJid || jid, { text: cooldownMsg(command, remaining) }, isSelfChat ? {} : { quoted: msg });
            } catch {}
            return;
        }
    }

    // Auto reaction ⏳ removed to eliminate "Waiting for this message" clock icon bubbles on recipient devices

    // ── Typing indicator ──────────────────────────────────────────
    await autoTyping(sock, targetJid || jid);

    // ── Set cooldown SEBELUM execute (mencegah double-trigger) ────
    setCooldown(sender, command);

    // ── Execute command ───────────────────────────────────────────
    await handleCommand(
        sock, msg, targetJid || jid, sender,
        command, args,
        isGroup, body,
        isGroup ? isAdmin : undefined
    );
}
