// ═══════════════════════════════════════════════════════════════════
//  ANTI-CALL & ANTI-CHAT — proteksi nomor bot dari telepon/DM asing
// ═══════════════════════════════════════════════════════════════════
//
//  Anti-Call : otomatis menolak semua panggilan masuk (voice/video)
//              ke nomor bot lewat sock.rejectCall(). Owner & Creator
//              dikecualikan (jaga-jaga kalau lagi tes sendiri).
//
//  Anti-Chat : mematikan auto-reply "ngobrol bebas" (.gojoai) di DM
//              untuk pengirim selain Owner/Creator/Premium. Command
//              yang diawali prefix TETAP jalan seperti biasa — yang
//              dimatikan cuma auto-chat AI bebasnya di private chat.
//
//  Keduanya bot-wide (bukan per-grup), karena nomor bot cuma satu.
// ═══════════════════════════════════════════════════════════════════

import { store, save } from '../lib/db.js';
import { isOwner, isCreator, isPremium } from '../lib/roles.js';
import { log } from '../lib/logger.js';

const settings = store('callChatGuard', { anticall: false, antichat: false });

export function isAnticallEnabled() {
    return !!settings.anticall;
}

export function setAnticall(value) {
    settings.anticall = !!value;
    save('callChatGuard');
}

export function isAntichatEnabled() {
    return !!settings.antichat;
}

export function setAntichat(value) {
    settings.antichat = !!value;
    save('callChatGuard');
}

// In-memory saja (reset tiap restart) — cukup buat cegah notifikasi
// balik yang spam ke orang yang sama berkali-kali.
const notifiedCallers = new Set();
const notifiedChatters = new Set();

// Dipanggil dari index.js lewat sock.ev.on('call', ...)
export async function handleIncomingCall(sock, calls) {
    if (!isAnticallEnabled()) return;
    for (const call of calls || []) {
        try {
            if (call.status && call.status !== 'offer') continue;
            const from = call.from || call.chatId || call.peerJid;
            if (!from) continue;
            if (isOwner(from) || isCreator(from)) continue;

            await sock.rejectCall(call.id, from);
            log.protection('anti-call', String(from).split('@')[0]);

            if (!notifiedCallers.has(from)) {
                notifiedCallers.add(from);
                await sock.sendMessage(from, {
                    text: '📵 Voice and video calls are not supported by this bot. Please interact using text commands.',
                }).catch(() => {});
            }
        } catch (err) {
            log.error(`anticall: ${err.message}`);
        }
    }
}

// Check if direct AI chat should be skipped
export async function shouldBlockDmChat(sock, jid, sender) {
    if (!isAntichatEnabled()) return false;
    if (isOwner(sender) || isCreator(sender) || isPremium(sender)) return false;

    log.protection('anti-chat', String(sender).split('@')[0]);

    if (!notifiedChatters.has(sender)) {
        notifiedChatters.add(sender);
        try {
            await sock.sendMessage(jid, {
                text: '💬 Free AI chat is currently disabled in private DMs. Commands starting with prefix can still be used normally.',
            });
        } catch { /* ignore */ }
    }
    return true;
}
