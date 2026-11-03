// ═══════════════════════════════════════════════════════════════════
//  ADMINCOMMANDS7.JS — Batch admin baru #3: Event RSVP, Quick Lock
// ═══════════════════════════════════════════════════════════════════

import { store, save, getGroupSettings, updateGroupSettings } from '../lib/db.js';

function requireAdmin(ctx) {
    if (!ctx.isAdmin) { ctx.reply('❌ Khusus Admin grup.'); return false; }
    return true;
}

// ═══════════════════════════════════════════════════════════════════
//  EVENT RSVP
// ═══════════════════════════════════════════════════════════════════
function eventStore() { return store('groupEvents', {}); }

export async function eventCreate(ctx) {
    if (!requireAdmin(ctx)) return;
    const match = ctx.body.match(/(\d{4}-\d{2}-\d{2})\s+([\s\S]+)/);
    if (!match) return ctx.reply('⚠️ Cara pakai: `.createevent 2026-08-17 Nonton bareng 17an`');
    const [, dateStr, text] = match;
    if (isNaN(new Date(dateStr))) return ctx.reply('❌ Format tanggal salah, pakai YYYY-MM-DD.');

    const list = eventStore()[ctx.jid] || [];
    const event = { id: list.length + 1, date: dateStr, text: text.trim(), yes: [], no: [], createdBy: ctx.sender };
    list.push(event);
    const data = eventStore();
    data[ctx.jid] = list;
    save('groupEvents');
    return ctx.reply(`✅ *Event #${event.id} dibuat!*\n\n📅 ${dateStr}\n📝 ${text.trim()}\n\nMember bisa konfirmasi lewat \`.rsvp ${event.id} ya\` atau \`.rsvp ${event.id} tidak\``);
}

export async function eventRsvp(ctx) {
    const [id, answer] = ctx.args;
    const eventId = parseInt(id, 10);
    if (!eventId || !['ya', 'tidak'].includes((answer || '').toLowerCase())) {
        return ctx.reply('⚠️ Cara pakai: `.rsvp [id_event] ya` atau `.rsvp [id_event] tidak`\nLihat event: `.listevents`');
    }
    const list = eventStore()[ctx.jid] || [];
    const event = list.find(e => e.id === eventId);
    if (!event) return ctx.reply('❌ Event dengan ID itu tidak ditemukan.');

    event.yes = event.yes.filter(j => j !== ctx.sender);
    event.no = event.no.filter(j => j !== ctx.sender);
    (answer.toLowerCase() === 'ya' ? event.yes : event.no).push(ctx.sender);
    save('groupEvents');
    return ctx.reply(`✅ Konfirmasi kamu untuk event #${eventId} tercatat: *${answer.toUpperCase()}*\n\n👍 ${event.yes.length} akan hadir | 👎 ${event.no.length} tidak hadir`);
}

export async function eventList(ctx) {
    const list = (eventStore()[ctx.jid] || []).filter(e => new Date(e.date) >= new Date(new Date().toDateString()));
    if (!list.length) return ctx.reply('ℹ️ Belum ada event mendatang di grup ini.');
    let txt = `📅 *EVENT MENDATANG*\n\n`;
    list.forEach(e => { txt += `#${e.id} — ${e.date}\n${e.text}\n👍 ${e.yes.length} | 👎 ${e.no.length}\n\n`; });
    return ctx.reply(txt.trim());
}

export async function eventAttendees(ctx) {
    const id = parseInt(ctx.args[0], 10);
    const list = eventStore()[ctx.jid] || [];
    const event = list.find(e => e.id === id);
    if (!event) return ctx.reply('⚠️ Cara pakai: `.eventattendees [id]`');
    let txt = `👥 *KONFIRMASI EVENT #${id}*\n${event.text}\n\n`;
    txt += `👍 *Hadir (${event.yes.length}):*\n${event.yes.map(j => `\`${j.split('@')[0]}\``).join(', ') || '-'}\n\n`;
    txt += `👎 *Tidak hadir (${event.no.length}):*\n${event.no.map(j => `\`${j.split('@')[0]}\``).join(', ') || '-'}`;
    return ctx.reply(txt);
}

// ═══════════════════════════════════════════════════════════════════
//  QUICK LOCK — nyalakan/matikan beberapa proteksi umum sekaligus
//  ("mode darurat" saat grup lagi diserang spam/link/dsb)
// ═══════════════════════════════════════════════════════════════════
const QUICK_LOCK_KEYS = ['antilink', 'antispam', 'antitag'];

export async function quickLock(ctx) {
    if (!requireAdmin(ctx)) return;
    const patch = {};
    QUICK_LOCK_KEYS.forEach(k => { patch[k] = true; });
    updateGroupSettings(ctx.jid, patch);
    try { await ctx.sock.groupSettingUpdate(ctx.jid, 'announcement'); } catch {}
    return ctx.reply('🔒 *Quick Lock aktif!*\n\nAnti-link, Anti-spam, Anti-tag diaktifkan, dan grup dikunci (cuma admin yang bisa chat).\nMatikan lagi lewat `.quickunlock` kalau situasi sudah aman.');
}

export async function quickUnlock(ctx) {
    if (!requireAdmin(ctx)) return;
    const patch = {};
    QUICK_LOCK_KEYS.forEach(k => { patch[k] = false; });
    updateGroupSettings(ctx.jid, patch);
    try { await ctx.sock.groupSettingUpdate(ctx.jid, 'not_announcement'); } catch {}
    return ctx.reply('🔓 *Quick Lock dinonaktifkan.*\n\nSemua proteksi yang diaktifkan lewat `.quicklock` sudah dimatikan, dan grup dibuka lagi untuk semua member.');
}
