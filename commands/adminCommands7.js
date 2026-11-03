// ═══════════════════════════════════════════════════════════════════
//  ADMINCOMMANDS7.JS — Group Events & Emergency Quick Lock
//  Developer: AHSAN (03107260507)
// ═══════════════════════════════════════════════════════════════════

import { store, save, getGroupSettings, updateGroupSettings } from '../lib/db.js';

function requireAdmin(ctx) {
    if (!ctx.isAdmin) { ctx.reply('❌ Group Admins only.'); return false; }
    return true;
}

// ═══════════════════════════════════════════════════════════════════
//  EVENT RSVP
// ═══════════════════════════════════════════════════════════════════
function eventStore() { return store('groupEvents', {}); }

export async function eventCreate(ctx) {
    if (!requireAdmin(ctx)) return;
    const match = ctx.body.match(/(\d{4}-\d{2}-\d{2})\s+([\s\S]+)/);
    if (!match) return ctx.reply('⚠️ Usage: `.createevent 2026-12-25 Christmas Group Meetup`');
    const [, dateStr, text] = match;
    if (isNaN(new Date(dateStr))) return ctx.reply('❌ Invalid date format, please use YYYY-MM-DD.');

    const list = eventStore()[ctx.jid] || [];
    const event = { id: list.length + 1, date: dateStr, text: text.trim(), yes: [], no: [], createdBy: ctx.sender };
    list.push(event);
    const data = eventStore();
    data[ctx.jid] = list;
    save('groupEvents');
    return ctx.reply(`✅ *Event #${event.id} created!*\n\n📅 ${dateStr}\n📝 ${text.trim()}\n\nMembers can RSVP with \`.rsvp ${event.id} yes\` or \`.rsvp ${event.id} no\``);
}

export async function eventRsvp(ctx) {
    const [id, answer] = ctx.args;
    const eventId = parseInt(id, 10);
    const ans = (answer || '').toLowerCase();
    const isYes = ans === 'yes' || ans === 'ya';
    const isNo = ans === 'no' || ans === 'tidak';
    if (!eventId || (!isYes && !isNo)) {
        return ctx.reply('⚠️ Usage: `.rsvp [event_id] yes` or `.rsvp [event_id] no`\nView events: `.listevents`');
    }
    const list = eventStore()[ctx.jid] || [];
    const event = list.find(e => e.id === eventId);
    if (!event) return ctx.reply('❌ Event with that ID was not found.');

    event.yes = event.yes.filter(j => j !== ctx.sender);
    event.no = event.no.filter(j => j !== ctx.sender);
    (isYes ? event.yes : event.no).push(ctx.sender);
    save('groupEvents');
    return ctx.reply(`✅ Your RSVP for event #${eventId} recorded: *${isYes ? 'ATTENDING' : 'NOT ATTENDING'}*\n\n👍 ${event.yes.length} Attending | 👎 ${event.no.length} Not Attending`);
}

export async function eventList(ctx) {
    const list = (eventStore()[ctx.jid] || []).filter(e => new Date(e.date) >= new Date(new Date().toDateString()));
    if (!list.length) return ctx.reply('ℹ️ No upcoming events in this group.');
    let txt = `📅 *UPCOMING EVENTS*\n\n`;
    list.forEach(e => { txt += `#${e.id} — ${e.date}\n${e.text}\n👍 ${e.yes.length} Attending | 👎 ${e.no.length} Not Attending\n\n`; });
    return ctx.reply(txt.trim());
}

export async function eventAttendees(ctx) {
    const id = parseInt(ctx.args[0], 10);
    const list = eventStore()[ctx.jid] || [];
    const event = list.find(e => e.id === id);
    if (!event) return ctx.reply('⚠️ Usage: `.eventattendees [id]`');
    let txt = `👥 *EVENT ATTENDEES #${id}*\n${event.text}\n\n`;
    txt += `👍 *Attending (${event.yes.length}):*\n${event.yes.map(j => `\`${j.split('@')[0]}\``).join(', ') || 'None'}\n\n`;
    txt += `👎 *Not Attending (${event.no.length}):*\n${event.no.map(j => `\`${j.split('@')[0]}\``).join(', ') || 'None'}`;
    return ctx.reply(txt);
}

// ═══════════════════════════════════════════════════════════════
//  QUICK LOCK (EMERGENCY RAID DEFENSE)
// ═══════════════════════════════════════════════════════════════
const QUICK_LOCK_KEYS = ['antilink', 'antispam', 'antitag'];

export async function quickLock(ctx) {
    if (!requireAdmin(ctx)) return;
    const patch = {};
    QUICK_LOCK_KEYS.forEach(k => { patch[k] = true; });
    updateGroupSettings(ctx.jid, patch);
    try { await ctx.sock.groupSettingUpdate(ctx.jid, 'announcement'); } catch {}
    return ctx.reply('🔒 *Quick Lock Activated!*\n\nAnti-Link, Anti-Spam, and Anti-Tag shields are active, and group is locked to Admins Only.\nDisable with `.quickunlock` when safe.');
}

export async function quickUnlock(ctx) {
    if (!requireAdmin(ctx)) return;
    const patch = {};
    QUICK_LOCK_KEYS.forEach(k => { patch[k] = false; });
    updateGroupSettings(ctx.jid, patch);
    try { await ctx.sock.groupSettingUpdate(ctx.jid, 'not_announcement'); } catch {}
    return ctx.reply('🔓 *Quick Lock Deactivated.*\n\nEmergency raid protection disabled and chat reopened for all members.');
}
