// ═══════════════════════════════════════════════════════════════════
//  ADMINCOMMANDS5.JS — 5 subsistem admin baru:
//    1) Pin/Announcement  2) Member Notes  3) Group Template
//    4) Scheduled Announcement  5) Birthday Tracker
// ═══════════════════════════════════════════════════════════════════

import { store, save } from '../lib/db.js';
import { getGroupSettings, updateGroupSettings } from '../lib/db.js';
import { fmtNum } from '../lib/utils.js';

function requireAdmin(ctx) {
    if (!ctx.isAdmin) { ctx.reply('❌ Khusus Admin grup.'); return false; }
    return true;
}

function extractTarget(ctx) {
    const quotedParticipant = ctx.msg.message?.extendedTextMessage?.contextInfo?.participant;
    if (quotedParticipant) return quotedParticipant;
    if (ctx.mentioned?.length) return ctx.mentioned[0];
    return null;
}

// ═══════════════════════════════════════════════════════════════════
//  1) PIN / ANNOUNCEMENT — pengumuman grup yang bisa dilihat kapan saja
// ═══════════════════════════════════════════════════════════════════
function pinStore() { return store('groupPins', {}); }

export async function pinAdd(ctx) {
    if (!requireAdmin(ctx)) return;
    const text = ctx.args.join(' ').trim();
    if (!text) return ctx.reply('⚠️ Cara pakai: `.pin [teks pengumuman]`');
    const data = pinStore();
    data[ctx.jid] = { text, by: ctx.sender, at: Date.now() };
    save('groupPins');
    return ctx.reply('📌 *Pengumuman berhasil dipasang.*\n\nLihat kapan saja lewat `.listpin`.');
}

export async function pinRemove(ctx) {
    if (!requireAdmin(ctx)) return;
    const data = pinStore();
    if (!data[ctx.jid]) return ctx.reply('ℹ️ Belum ada pengumuman terpasang.');
    delete data[ctx.jid];
    save('groupPins');
    return ctx.reply('✅ Pengumuman dihapus.');
}

export async function pinList(ctx) {
    const data = pinStore();
    const pin = data[ctx.jid];
    if (!pin) return ctx.reply('ℹ️ Belum ada pengumuman di grup ini.\nAdmin bisa pasang lewat `.pin [teks]`.');
    const date = new Date(pin.at).toLocaleString('id-ID');
    return ctx.reply(`📌 *PENGUMUMAN GRUP*\n\n${pin.text}\n\n_Dipasang: ${date}_`);
}

// ═══════════════════════════════════════════════════════════════════
//  2) MEMBER NOTES — catatan admin tentang member tertentu
// ═══════════════════════════════════════════════════════════════════
function notesStore() { return store('memberNotes', {}); }
function noteKey(jid, target) { return `${jid}:${target}`; }

export async function noteAdd(ctx) {
    if (!requireAdmin(ctx)) return;
    const target = extractTarget(ctx);
    const text = ctx.body.split(' ').slice(1).join(' ').replace(/@\d+/, '').trim();
    if (!target || !text) return ctx.reply('⚠️ Cara pakai: `.addnote @user [catatan]` atau reply pesan target + tulis catatannya.');
    const data = notesStore();
    const key = noteKey(ctx.jid, target);
    data[key] = [...(data[key] || []), { text, by: ctx.sender, at: Date.now() }];
    save('memberNotes');
    return ctx.reply(`✅ Catatan ditambahkan untuk \`${target.split('@')[0]}\`.\nTotal catatan: ${data[key].length}`);
}

export async function noteList(ctx) {
    if (!requireAdmin(ctx)) return;
    const target = extractTarget(ctx);
    if (!target) return ctx.reply('⚠️ Cara pakai: `.listnote @user` atau reply pesan target.');
    const data = notesStore();
    const list = data[noteKey(ctx.jid, target)] || [];
    if (!list.length) return ctx.reply(`ℹ️ Belum ada catatan untuk \`${target.split('@')[0]}\`.`);
    let txt = `📝 *CATATAN — ${target.split('@')[0]}*\n\n`;
    list.forEach((n, i) => {
        txt += `${i + 1}. ${n.text}\n   _oleh ${n.by.split('@')[0]}, ${new Date(n.at).toLocaleDateString('id-ID')}_\n`;
    });
    return ctx.reply(txt);
}

export async function noteDel(ctx) {
    if (!requireAdmin(ctx)) return;
    const target = extractTarget(ctx);
    const idx = parseInt(ctx.args[ctx.args.length - 1], 10);
    if (!target || !idx) return ctx.reply('⚠️ Cara pakai: `.delnote @user [nomor]` (lihat nomornya lewat `.listnote`)');
    const data = notesStore();
    const key = noteKey(ctx.jid, target);
    const list = data[key] || [];
    if (idx < 1 || idx > list.length) return ctx.reply('❌ Nomor catatan tidak valid.');
    list.splice(idx - 1, 1);
    data[key] = list;
    save('memberNotes');
    return ctx.reply(`✅ Catatan #${idx} dihapus.`);
}

// ═══════════════════════════════════════════════════════════════════
//  3) GROUP TEMPLATE — simpan/muat snapshot pengaturan grup (proteksi,
//     lock, dsb — lihat lib/db.js getGroupSettings) dengan nama
// ═══════════════════════════════════════════════════════════════════
function templateStore() { return store('groupTemplates', {}); }

export async function templateSave(ctx) {
    if (!requireAdmin(ctx)) return;
    const name = ctx.args.join(' ').trim().toLowerCase();
    if (!name) return ctx.reply('⚠️ Cara pakai: `.savetemplate [nama]`\n\nMenyimpan snapshot semua pengaturan proteksi & lock grup ini saat ini.');
    const settings = { ...getGroupSettings(ctx.jid) };
    const data = templateStore();
    data[name] = { settings, savedBy: ctx.sender, savedAt: Date.now(), groupName: name };
    save('groupTemplates');
    return ctx.reply(`✅ Template *"${name}"* berhasil disimpan.\n\nMuat lagi kapan saja (di grup manapun) lewat \`.loadtemplate ${name}\`.`);
}

export async function templateLoad(ctx) {
    if (!requireAdmin(ctx)) return;
    const name = ctx.args.join(' ').trim().toLowerCase();
    if (!name) return ctx.reply('⚠️ Cara pakai: `.loadtemplate [nama]`\nLihat daftar: `.listtemplate`');
    const data = templateStore();
    const tpl = data[name];
    if (!tpl) return ctx.reply('❌ Template dengan nama itu tidak ditemukan.');
    updateGroupSettings(ctx.jid, tpl.settings);
    return ctx.reply(`✅ Template *"${name}"* berhasil diterapkan ke grup ini.\n\nSemua pengaturan proteksi & lock sekarang mengikuti template tersebut.`);
}

export async function templateList(ctx) {
    const data = templateStore();
    const names = Object.keys(data);
    if (!names.length) return ctx.reply('ℹ️ Belum ada template tersimpan.\nBuat lewat `.savetemplate [nama]`.');
    let txt = `📋 *DAFTAR TEMPLATE* — total ${names.length}\n\n`;
    names.forEach((n, i) => {
        txt += `${i + 1}. *${n}* — ${new Date(data[n].savedAt).toLocaleDateString('id-ID')}\n`;
    });
    return ctx.reply(txt);
}

export async function templateDel(ctx) {
    if (!requireAdmin(ctx)) return;
    const name = ctx.args.join(' ').trim().toLowerCase();
    const data = templateStore();
    if (!data[name]) return ctx.reply('❌ Template tidak ditemukan.');
    delete data[name];
    save('groupTemplates');
    return ctx.reply(`✅ Template *"${name}"* dihapus.`);
}

// ═══════════════════════════════════════════════════════════════════
//  4) SCHEDULED ANNOUNCEMENT — pesan berulang harian jam tertentu
//     (mirip jadwal buka/tutup, tapi buat teks bebas)
// ═══════════════════════════════════════════════════════════════════
function announcementStore() { return store('groupAnnouncements', {}); }

export async function announcementAdd(ctx) {
    if (!requireAdmin(ctx)) return;
    const match = ctx.body.match(/(\d{1,2}:\d{2})\s+([\s\S]+)/);
    if (!match) return ctx.reply('⚠️ Cara pakai: `.addannouncement 08:00 Selamat pagi semua! Jangan lupa presensi.`');
    const [, time, text] = match;
    const [h, m] = time.split(':').map(Number);
    if (h > 23 || m > 59) return ctx.reply('❌ Format jam tidak valid (HH:MM, 00:00-23:59).');

    const data = announcementStore();
    data[ctx.jid] = [...(data[ctx.jid] || []), { time, text: text.trim(), createdAt: Date.now() }];
    save('groupAnnouncements');
    return ctx.reply(`✅ Pengumuman terjadwal ditambahkan, tiap hari jam *${time}*.\n\n_"${text.trim()}"_`);
}

export async function announcementList(ctx) {
    const data = announcementStore();
    const list = data[ctx.jid] || [];
    if (!list.length) return ctx.reply('ℹ️ Belum ada pengumuman terjadwal di grup ini.');
    let txt = `⏰ *PENGUMUMAN TERJADWAL*\n\n`;
    list.forEach((a, i) => { txt += `${i + 1}. *${a.time}* — ${a.text}\n`; });
    return ctx.reply(txt);
}

export async function announcementDel(ctx) {
    if (!requireAdmin(ctx)) return;
    const idx = parseInt(ctx.args[0], 10);
    const data = announcementStore();
    const list = data[ctx.jid] || [];
    if (!idx || idx < 1 || idx > list.length) return ctx.reply('⚠️ Cara pakai: `.delannouncement [nomor]` (lihat nomornya lewat `.listannouncement`)');
    list.splice(idx - 1, 1);
    data[ctx.jid] = list;
    save('groupAnnouncements');
    return ctx.reply(`✅ Pengumuman terjadwal #${idx} dihapus.`);
}

// Dipanggil dari index.js tiap menit (pola sama seperti group scheduler
// buka/tutup) — cek semua grup, kirim pengumuman yang jamnya cocok SEKARANG.
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
//  5) BIRTHDAY TRACKER — tanggal lahir member, dicek harian
// ═══════════════════════════════════════════════════════════════════
function birthdayStore() { return store('memberBirthdays', {}); }

export async function birthdaySet(ctx) {
    const dateStr = ctx.args[0];
    if (!dateStr || !/^\d{1,2}-\d{1,2}$/.test(dateStr)) {
        return ctx.reply('⚠️ Cara pakai: `.setbirthday DD-MM`\nContoh: `.setbirthday 17-08`');
    }
    const [day, month] = dateStr.split('-').map(Number);
    if (day < 1 || day > 31 || month < 1 || month > 12) return ctx.reply('❌ Tanggal/bulan tidak valid.');
    const data = birthdayStore();
    data[ctx.sender] = { day, month, setAt: Date.now() };
    save('memberBirthdays');
    return ctx.reply(`✅ Tanggal lahir kamu disimpan: *${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}*`);
}

export async function birthdayList(ctx) {
    const data = birthdayStore();
    const meta = await ctx.sock.groupMetadata(ctx.jid).catch(() => null);
    const memberJids = meta ? new Set(meta.participants.map(p => p.id)) : null;
    const entries = Object.entries(data)
        .filter(([jid]) => !memberJids || memberJids.has(jid))
        .sort((a, b) => (a[1].month - b[1].month) || (a[1].day - b[1].day));
    if (!entries.length) return ctx.reply('ℹ️ Belum ada member yang set tanggal lahir.\nSet punya kamu lewat `.setbirthday DD-MM`.');
    let txt = `🎂 *DAFTAR ULANG TAHUN*\n\n`;
    entries.forEach(([jid, b]) => {
        txt += `• ${String(b.day).padStart(2, '0')}-${String(b.month).padStart(2, '0')} — \`${jid.split('@')[0]}\`\n`;
    });
    return ctx.reply(txt);
}

export async function birthdayDel(ctx) {
    const data = birthdayStore();
    if (!data[ctx.sender]) return ctx.reply('ℹ️ Kamu belum set tanggal lahir.');
    delete data[ctx.sender];
    save('memberBirthdays');
    return ctx.reply('✅ Tanggal lahir kamu dihapus dari data.');
}

// Dipanggil dari index.js sekali sehari — return list member yang ulang
// tahun HARI INI beserta grup mana saja mereka ada (buat auto-ucapan).
export function checkTodayBirthdays() {
    const data = birthdayStore();
    const now = new Date();
    const day = now.getDate(), month = now.getMonth() + 1;
    return Object.entries(data)
        .filter(([, b]) => b.day === day && b.month === month)
        .map(([jid]) => jid);
}
