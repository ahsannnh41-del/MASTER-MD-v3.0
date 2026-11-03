// ═══════════════════════════════════════════════════════════════════
//  ADMINCOMMANDS5.JS — Group Admin Utilities:
//    1) Pin/Announcement  2) Member Notes  3) Group Templates
//    4) Scheduled Announcements  5) Birthday Tracker
//  Developer: AHSAN (03107260507)
// ═══════════════════════════════════════════════════════════════════

import { store, save } from '../lib/db.js';
import { getGroupSettings, updateGroupSettings } from '../lib/db.js';
import { fmtNum } from '../lib/utils.js';

function requireAdmin(ctx) {
    if (!ctx.isAdmin) { ctx.reply('❌ Group Admins only.'); return false; }
    return true;
}

function extractTarget(ctx) {
    const quotedParticipant = ctx.msg.message?.extendedTextMessage?.contextInfo?.participant;
    if (quotedParticipant) return quotedParticipant;
    if (ctx.mentioned?.length) return ctx.mentioned[0];
    return null;
}

// ═══════════════════════════════════════════════════════════════════
//  1) PIN / ANNOUNCEMENTS
// ═══════════════════════════════════════════════════════════════════
function pinStore() { return store('groupPins', {}); }

export async function pinAdd(ctx) {
    if (!requireAdmin(ctx)) return;
    const text = ctx.args.join(' ').trim();
    if (!text) return ctx.reply('⚠️ Usage: `.pin [announcement text]`');
    const data = pinStore();
    data[ctx.jid] = { text, by: ctx.sender, at: Date.now() };
    save('groupPins');
    return ctx.reply('📌 *Group announcement pinned successfully.*\n\nView anytime with `.listpin`.');
}

export async function pinRemove(ctx) {
    if (!requireAdmin(ctx)) return;
    const data = pinStore();
    if (!data[ctx.jid]) return ctx.reply('ℹ️ No active pinned announcement found.');
    delete data[ctx.jid];
    save('groupPins');
    return ctx.reply('✅ Pinned announcement removed.');
}

export async function pinList(ctx) {
    const data = pinStore();
    const pin = data[ctx.jid];
    if (!pin) return ctx.reply('ℹ️ No active pinned announcement in this group.\nAdmins can set one with `.pin [text]`.');
    const date = new Date(pin.at).toLocaleString('en-US');
    return ctx.reply(`📌 *GROUP PINNED ANNOUNCEMENT*\n\n${pin.text}\n\n_Pinned: ${date}_`);
}

// ═══════════════════════════════════════════════════════════════════
//  2) MEMBER NOTES
// ═══════════════════════════════════════════════════════════════════
function notesStore() { return store('memberNotes', {}); }
function noteKey(jid, target) { return `${jid}:${target}`; }

export async function noteAdd(ctx) {
    if (!requireAdmin(ctx)) return;
    const target = extractTarget(ctx);
    const text = ctx.body.split(' ').slice(1).join(' ').replace(/@\d+/, '').trim();
    if (!target || !text) return ctx.reply('⚠️ Usage: `.addnote @user [note]` or reply to user message.');
    const data = notesStore();
    const key = noteKey(ctx.jid, target);
    data[key] = [...(data[key] || []), { text, by: ctx.sender, at: Date.now() }];
    save('memberNotes');
    return ctx.reply(`✅ Admin note saved for \`${target.split('@')[0]}\`.\nTotal notes: ${data[key].length}`);
}

export async function noteList(ctx) {
    if (!requireAdmin(ctx)) return;
    const target = extractTarget(ctx);
    if (!target) return ctx.reply('⚠️ Usage: `.listnote @user` or reply to user message.');
    const data = notesStore();
    const list = data[noteKey(ctx.jid, target)] || [];
    if (!list.length) return ctx.reply(`ℹ️ No admin notes recorded for \`${target.split('@')[0]}\`.`);
    let txt = `📝 *ADMIN NOTES — ${target.split('@')[0]}*\n\n`;
    list.forEach((n, i) => {
        txt += `${i + 1}. ${n.text}\n   _by ${n.by.split('@')[0]}, ${new Date(n.at).toLocaleDateString('en-US')}_\n`;
    });
    return ctx.reply(txt);
}

export async function noteDel(ctx) {
    if (!requireAdmin(ctx)) return;
    const target = extractTarget(ctx);
    const idx = parseInt(ctx.args[ctx.args.length - 1], 10);
    if (!target || !idx) return ctx.reply('⚠️ Usage: `.delnote @user [note_number]` (check numbers via `.listnote`)');
    const data = notesStore();
    const key = noteKey(ctx.jid, target);
    const list = data[key] || [];
    if (idx < 1 || idx > list.length) return ctx.reply('❌ Invalid note number.');
    list.splice(idx - 1, 1);
    data[key] = list;
    save('memberNotes');
    return ctx.reply(`✅ Note #${idx} deleted.`);
}

// ═══════════════════════════════════════════════════════════════════
//  3) GROUP TEMPLATES
// ═══════════════════════════════════════════════════════════════════
function templateStore() { return store('groupTemplates', {}); }

export async function templateSave(ctx) {
    if (!requireAdmin(ctx)) return;
    const name = ctx.args.join(' ').trim().toLowerCase();
    if (!name) return ctx.reply('⚠️ Usage: `.savetemplate [template_name]`\n\nSaves current protection & configuration settings as a reusable template.');
    const settings = { ...getGroupSettings(ctx.jid) };
    const data = templateStore();
    data[name] = { settings, savedBy: ctx.sender, savedAt: Date.now(), groupName: name };
    save('groupTemplates');
    return ctx.reply(`✅ Template *"${name}"* saved successfully.\n\nApply to any group with \`.loadtemplate ${name}\`.`);
}

export async function templateLoad(ctx) {
    if (!requireAdmin(ctx)) return;
    const name = ctx.args.join(' ').trim().toLowerCase();
    if (!name) return ctx.reply('⚠️ Usage: `.loadtemplate [template_name]`\nView list: `.listtemplate`');
    const data = templateStore();
    const tpl = data[name];
    if (!tpl) return ctx.reply('❌ Template with that name was not found.');
    updateGroupSettings(ctx.jid, tpl.settings);
    return ctx.reply(`✅ Template *"${name}"* applied to this group.\n\nAll protection shields and configuration restored.`);
}

export async function templateList(ctx) {
    const data = templateStore();
    const names = Object.keys(data);
    if (!names.length) return ctx.reply('ℹ️ No saved group templates found.\nCreate one with `.savetemplate [name]`.');
    let txt = `📋 *SAVED GROUP TEMPLATES* — Total ${names.length}\n\n`;
    names.forEach((n, i) => {
        txt += `${i + 1}. *${n}* — ${new Date(data[n].savedAt).toLocaleDateString('en-US')}\n`;
    });
    return ctx.reply(txt);
}

export async function templateDel(ctx) {
    if (!requireAdmin(ctx)) return;
    const name = ctx.args.join(' ').trim().toLowerCase();
    const data = templateStore();
    if (!data[name]) return ctx.reply('❌ Template not found.');
    delete data[name];
    save('groupTemplates');
    return ctx.reply(`✅ Template *"${name}"* deleted.`);
}

// ═══════════════════════════════════════════════════════════════════
//  4) SCHEDULED ANNOUNCEMENTS
// ═══════════════════════════════════════════════════════════════════
function announcementStore() { return store('groupAnnouncements', {}); }

export async function announcementAdd(ctx) {
    if (!requireAdmin(ctx)) return;
    const match = ctx.body.match(/(\d{1,2}:\d{2})\s+([\s\S]+)/);
    if (!match) return ctx.reply('⚠️ Usage: `.addannouncement 08:00 Good morning everyone!`');
    const [, time, text] = match;
    const [h, m] = time.split(':').map(Number);
    if (h > 23 || m > 59) return ctx.reply('❌ Invalid time format (HH:MM in 24-hour clock).');

    const data = announcementStore();
    data[ctx.jid] = [...(data[ctx.jid] || []), { time, text: text.trim(), createdAt: Date.now() }];
    save('groupAnnouncements');
    return ctx.reply(`✅ Scheduled announcement added daily at *${time}*.\n\n_"${text.trim()}"_`);
}

export async function announcementList(ctx) {
    const data = announcementStore();
    const list = data[ctx.jid] || [];
    if (!list.length) return ctx.reply('ℹ️ No scheduled announcements configured for this group.');
    let txt = `⏰ *SCHEDULED ANNOUNCEMENTS*\n\n`;
    list.forEach((a, i) => { txt += `${i + 1}. *${a.time}* — ${a.text}\n`; });
    return ctx.reply(txt);
}

export async function announcementDel(ctx) {
    if (!requireAdmin(ctx)) return;
    const idx = parseInt(ctx.args[0], 10);
    const data = announcementStore();
    const list = data[ctx.jid] || [];
    if (!idx || idx < 1 || idx > list.length) return ctx.reply('⚠️ Usage: `.delannouncement [number]` (view with `.listannouncement`)');
    list.splice(idx - 1, 1);
    data[ctx.jid] = list;
    save('groupAnnouncements');
    return ctx.reply(`✅ Scheduled announcement #${idx} deleted.`);
}

export function checkScheduledAnnouncements() {
    const data = announcementStore();
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const nowStr = `${hh}:${mm}`;
    const due = [];
    for (const [jid, list] of Object.entries(data)) {
        for (const a of list) {
            if (a.time === nowStr) due.push({ jid, text: a.text });
        }
    }
    return due;
}

// ═══════════════════════════════════════════════════════════════════
//  5) BIRTHDAY TRACKER
// ═══════════════════════════════════════════════════════════════════
function birthdayStore() { return store('memberBirthdays', {}); }

export async function birthdaySet(ctx) {
    const dateStr = ctx.args[0];
    if (!dateStr || !/^\d{1,2}-\d{1,2}$/.test(dateStr)) {
        return ctx.reply('⚠️ Usage: `.setbirthday DD-MM`\nExample: `.setbirthday 25-12`');
    }
    const [day, month] = dateStr.split('-').map(Number);
    if (day < 1 || day > 31 || month < 1 || month > 12) return ctx.reply('❌ Invalid date/month values.');
    const data = birthdayStore();
    data[ctx.sender] = { day, month, setAt: Date.now() };
    save('memberBirthdays');
    return ctx.reply(`✅ Your birthday has been saved: *${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}*`);
}

export async function birthdayList(ctx) {
    const data = birthdayStore();
    const meta = await ctx.sock.groupMetadata(ctx.jid).catch(() => null);
    const memberJids = meta ? new Set(meta.participants.map(p => p.id)) : null;
    const entries = Object.entries(data)
        .filter(([jid]) => !memberJids || memberJids.has(jid))
        .sort((a, b) => (a[1].month - b[1].month) || (a[1].day - b[1].day));
    if (!entries.length) return ctx.reply('ℹ️ No member birthdays saved yet.\nRegister yours with `.setbirthday DD-MM`.');
    let txt = `🎂 *GROUP BIRTHDAYS CALENDAR*\n\n`;
    entries.forEach(([jid, b]) => {
        txt += `• ${String(b.day).padStart(2, '0')}-${String(b.month).padStart(2, '0')} — \`${jid.split('@')[0]}\`\n`;
    });
    return ctx.reply(txt);
}

export async function birthdayDel(ctx) {
    const data = birthdayStore();
    if (!data[ctx.sender]) return ctx.reply('ℹ️ You have not saved your birthday yet.');
    delete data[ctx.sender];
    save('memberBirthdays');
    return ctx.reply('✅ Your birthday has been removed.');
}

export function checkTodayBirthdays() {
    const data = birthdayStore();
    const now = new Date();
    const day = now.getDate(), month = now.getMonth() + 1;
    return Object.entries(data)
        .filter(([, b]) => b.day === day && b.month === month)
        .map(([jid]) => jid);
}
