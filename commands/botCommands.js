// ═══════════════════════════════════════════════════════════════════
//  BOTCOMMANDS.JS — Fitur kategori Bot baru: statistik pemakaian,
//  changelog, dan kotak saran
// ═══════════════════════════════════════════════════════════════════

import { store, save } from '../lib/db.js';
import { fmtNum } from '../lib/utils.js';
import { settings } from '../setting.js';

// ── STATISTIK PEMAKAIAN — hook trackCommandUsage() dipanggil dari
// commands/index.js tiap command berhasil dijalankan ────────────────
function statsStore() { return store('commandStats', {}); }

export function trackCommandUsage(command) {
    const data = statsStore();
    const today = new Date().toISOString().slice(0, 10);
    data.total = (data.total || 0) + 1;
    data.byCommand = data.byCommand || {};
    data.byCommand[command] = (data.byCommand[command] || 0) + 1;
    data.byDay = data.byDay || {};
    data.byDay[today] = (data.byDay[today] || 0) + 1;
    save('commandStats');
}

export async function botStats(ctx) {
    const data = statsStore();
    const today = new Date().toISOString().slice(0, 10);
    const todayCount = data.byDay?.[today] || 0;
    const topCommands = Object.entries(data.byCommand || {})
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    let txt = `📊 *STATISTIK PEMAKAIAN BOT*\n\n`;
    txt += `Total command dijalankan: *${fmtNum(data.total || 0)}*\n`;
    txt += `Hari ini: *${fmtNum(todayCount)}*\n\n`;
    if (topCommands.length) {
        txt += `🏆 *Top 10 Command Terpopuler:*\n`;
        topCommands.forEach(([cmd, count], i) => {
            txt += `${i + 1}. .${cmd} — ${fmtNum(count)}x\n`;
        });
    }
    return ctx.reply(txt);
}

// ── CHANGELOG ────────────────────────────────────────────────────────
const CHANGELOG = [
    { version: '3.2.0', date: '2026-07', notes: [
        'Fitur Cpanel — jualan slot server Pterodactyl (v1-v5)',
        'Sistem Guild/Clan untuk RPG',
        'Gojo AI — mode chat AI ala Gojo Satoru',
        '5+ subsistem admin baru (pengumuman, catatan member, template grup, tugas, bulk operations)',
        '20+ tools baru (QR code, cipher tambahan, kalkulator finansial, dll)',
        '6 downloader platform baru (Threads, Reddit, Bilibili, dll)',
        'Transformasi media baru (grayscale, mirror, blur, speed, dll)',
    ]},
    { version: '3.1.0', date: '2026-06', notes: [
        '300+ Command Admin baru',
        'Proteksi tambahan (antilinkphising, antijudol, antipinjol, dll)',
        'Anti-Flood akhirnya aktif di alur pesan',
    ]},
];

export async function showChangelog(ctx) {
    const n = Math.min(parseInt(ctx.args[0], 10) || 2, CHANGELOG.length);
    let txt = `📋 *CHANGELOG — ${settings.botName}*\n\n`;
    CHANGELOG.slice(0, n).forEach(entry => {
        txt += `*v${entry.version}* (${entry.date})\n`;
        entry.notes.forEach(note => { txt += `  • ${note}\n`; });
        txt += '\n';
    });
    return ctx.reply(txt.trim());
}

// ── KOTAK SARAN ──────────────────────────────────────────────────────
function suggestionStore() { return store('suggestions', []); }

export async function submitSuggestion(ctx) {
    const text = ctx.args.join(' ').trim();
    if (!text) return ctx.reply('📌 Cara pakai: *.suggest [saran fitur/perbaikan]*');
    const list = suggestionStore();
    list.push({ id: list.length + 1, text, from: ctx.sender, at: Date.now() });
    save('suggestions');
    return ctx.reply('✅ Terima kasih! Saran kamu sudah dicatat untuk ditinjau Owner.');
}

export async function listSuggestions(ctx) {
    if (!ctx.isOwner && !ctx.isCreator) return ctx.reply('❌ Khusus Owner/Creator.');
    const list = suggestionStore();
    if (!list.length) return ctx.reply('ℹ️ Belum ada saran masuk.');
    let txt = `💡 *DAFTAR SARAN* — total ${list.length}\n\n`;
    list.slice(-20).reverse().forEach(s => {
        txt += `#${s.id} — \`${s.from.split('@')[0]}\`\n${s.text}\n\n`;
    });
    return ctx.reply(txt.trim());
}

export async function clearSuggestions(ctx) {
    if (!ctx.isOwner && !ctx.isCreator) return ctx.reply('❌ Khusus Owner/Creator.');
    const data = suggestionStore();
    data.length = 0;
    save('suggestions');
    return ctx.reply('✅ Semua saran sudah dibersihkan.');
}

// ── CREDITS & SUPPORT ────────────────────────────────────────────────
export async function showCredits(ctx) {
    const txt = `⚡ *MASTER MD CREDITS* ⚡\n\n` +
        `👑 *Developer:* AHSAN\n` +
        `🤖 *Bot Name:* ${settings.botName} (v${settings.botVersion})\n` +
        `📢 *Official Channel:* ${settings.channelUrl || 'https://whatsapp.com'}\n\n` +
        `Built with high performance Baileys Multi-Device engine, interactive buttons, 2000+ commands, and anti-tamper security.\n\n` +
        `© 2026 MASTER MD • All Rights Reserved to AHSAN.`;
    return ctx.reply(txt);
}

export async function showSupport(ctx) {
    const creator = settings.ownerNumber ? `+${settings.ownerNumber}` : '(lihat .owner)';
    const txt = `🆘 *BUTUH BANTUAN?*\n\n` +
        `1. Cek dulu \`.allmenu\` — mungkin jawabannya di situ\n` +
        `2. Kirim saran/laporan bug lewat \`.suggest [pesan]\`\n` +
        `3. Hubungi langsung: ${creator} (\`.owner\` untuk detail)\n\n` +
        `Sabar ya, biasanya dibalas secepatnya! 🙌`;
    return ctx.reply(txt);
}

// ── BACKUP MANUAL ────────────────────────────────────────────────────
export async function backupNow(ctx) {
    if (!ctx.isOwner && !ctx.isCreator) return ctx.reply('❌ Khusus Owner/Creator.');
    try {
        const fs = await import('fs');
        const path = await import('path');
        if (!fs.existsSync('./data')) return ctx.reply('ℹ️ Folder data/ belum ada, belum ada yang perlu di-backup.');
        const backupDir = `./data-backup-manual-${Date.now()}`;
        fs.mkdirSync(backupDir, { recursive: true });
        const files = fs.readdirSync('./data');
        for (const file of files) {
            fs.copyFileSync(path.join('./data', file), path.join(backupDir, file));
        }
        return ctx.reply(`✅ Backup manual berhasil!\n\n📁 ${files.length} file disalin ke:\n\`${backupDir}\``);
    } catch (err) {
        return ctx.reply(`❌ Gagal backup: ${err.message}`);
    }
}
