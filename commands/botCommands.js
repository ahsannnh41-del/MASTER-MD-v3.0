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

    let txt = `📊 *BOT USAGE STATISTICS*\n\n`;
    txt += `Total commands executed: *${fmtNum(data.total || 0)}*\n`;
    txt += `Today: *${fmtNum(todayCount)}*\n\n`;
    if (topCommands.length) {
        txt += `🏆 *Top 10 Most Popular Commands:*\n`;
        topCommands.forEach(([cmd, count], i) => {
            txt += `${i + 1}. .${cmd} — ${fmtNum(count)}x\n`;
        });
    }
    return ctx.reply(txt);
}

// ── CHANGELOG ────────────────────────────────────────────────────────
const CHANGELOG = [
    { version: '3.2.0', date: '2026-07', notes: [
        'Cpanel Features — Pterodactyl server reseller engine (v1-v5)',
        'Guild/Clan System for RPG adventures',
        'Smart AI Chat System',
        'Advanced group administration suites (pins, notes, templates, tasks, bulk ops)',
        '20+ new utility tools (QR generator, financial calculator, etc.)',
        '6 new social downloader platforms (TikTok, Instagram, YouTube, etc.)',
        'Media transformations and View-Once retriever (.vv)',
    ]},
    { version: '3.1.0', date: '2026-06', notes: [
        '300+ New Admin moderation commands',
        'Advanced protection shields (Anti-Phishing, Anti-Link, Anti-Spam)',
        'Anti-Flood & auto-rate-limiting enabled',
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
    if (!text) return ctx.reply('📌 Usage: *.suggest [feature suggestion / feedback]*');
    const list = suggestionStore();
    list.push({ id: list.length + 1, text, from: ctx.sender, at: Date.now() });
    save('suggestions');
    return ctx.reply('✅ Thank you! Your feedback has been recorded for developer review.');
}

export async function listSuggestions(ctx) {
    if (!ctx.isOwner && !ctx.isCreator) return ctx.reply('❌ Owner / Creator only.');
    const list = suggestionStore();
    if (!list.length) return ctx.reply('ℹ️ No suggestions submitted yet.');
    let txt = `💡 *SUGGESTIONS LIST* — Total ${list.length}\n\n`;
    list.slice(-20).reverse().forEach(s => {
        txt += `#${s.id} — \`${s.from.split('@')[0]}\`\n${s.text}\n\n`;
    });
    return ctx.reply(txt.trim());
}

export async function clearSuggestions(ctx) {
    if (!ctx.isOwner && !ctx.isCreator) return ctx.reply('❌ Owner / Creator only.');
    const data = suggestionStore();
    data.length = 0;
    save('suggestions');
    return ctx.reply('✅ All suggestions have been cleared.');
}

// ── CREDITS & SUPPORT ────────────────────────────────────────────────
export async function showCredits(ctx) {
    const txt = `⚡ *MASTER MD CREDITS* ⚡\n\n` +
        `👑 *Developer:* AHSAN (03107260507)\n` +
        `🤖 *Bot Name:* ${settings.botName} (v${settings.botVersion})\n` +
        `📢 *Official Channel:* ${settings.channelUrl || 'https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46'}\n\n` +
        `Built with high performance Baileys Multi-Device engine, interactive buttons, 2000+ commands, and anti-tamper security.\n\n` +
        `© 2026 MASTER MD • All Rights Reserved to AHSAN.`;
    return ctx.reply(txt);
}

export async function showSupport(ctx) {
    const txt = `🆘 *MASTER MD SUPPORT & ASSISTANCE*\n\n` +
        `1. Check \`.allmenu\` or \`.menu\` for full command instructions.\n` +
        `2. Report issues or request features via \`.suggest [message]\`.\n` +
        `3. Direct Developer Contact: +923107260507 (\`.owner\` for details).\n` +
        `4. Join Official Channel: ${settings.channelUrl || 'https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46'}\n\n` +
        `⚡ Quick response guaranteed for all inquiries!`;
    return ctx.reply(txt);
}

// ── BACKUP MANUAL ────────────────────────────────────────────────────
export async function backupNow(ctx) {
    if (!ctx.isOwner && !ctx.isCreator) return ctx.reply('❌ Owner / Creator only.');
    try {
        const fs = await import('fs');
        const path = await import('path');
        if (!fs.existsSync('./data')) return ctx.reply('ℹ️ Data directory does not exist yet; nothing to back up.');
        const backupDir = `./data-backup-manual-${Date.now()}`;
        fs.mkdirSync(backupDir, { recursive: true });
        const files = fs.readdirSync('./data');
        for (const file of files) {
            fs.copyFileSync(path.join('./data', file), path.join(backupDir, file));
        }
        return ctx.reply(`✅ Manual backup completed!\n\n📁 ${files.length} files copied to:\n\`${backupDir}\``);
    } catch (err) {
        return ctx.reply(`❌ Backup failed: ${err.message}`);
    }
}
