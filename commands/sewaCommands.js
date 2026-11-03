// ═══════════════════════════════════════════════════════════════════
//  SEWACOMMANDS.JS — Bot Group Rental & Authorization System
//  Developer: AHSAN (03107260507)
// ═══════════════════════════════════════════════════════════════════

import {
    addSewa, delSewa, getSewa, listSewa, isSewaActive,
    isSewaMode, setSewaMode, fmtTgl, sisaWaktu, parseDurasi,
    getHargaSewa, setHargaSewa,
} from '../lib/sewaBot.js';
import settings from '../setting.js';

const P = settings.prefix || '.';

function resolveGroupJid(input) {
    if (!input) return null;
    const linkMatch = input.match(/chat\.whatsapp\.com\/([A-Za-z0-9]+)/);
    if (linkMatch) return linkMatch[1];
    if (input.includes('@g.us')) return input;
    const clean = input.replace(/[^0-9]/g, '');
    if (clean.length > 10) return `${clean}@g.us`;
    return null;
}

export const sewaCommands = {

    // ── .sewa ─────────────────────────────────────────────────────
    async sewa(ctx) {
        if (!ctx.isOwner) {
            return ctx.reply('❌ Only the *Bot Owner/Creator* can configure bot rentals.');
        }

        const { args, jid, isGroup } = ctx;
        let targetJid = null;
        let durasiStr = null;

        if (args.length === 0) {
            return ctx.reply(
                `📋 *BOT GROUP RENTAL SYSTEM*\n\n` +
                `*How to use:*\n` +
                `• Inside a group: \`${P}sewa 7days\`\n` +
                `• From private chat: \`${P}sewa [group_link/jid] [duration]\`\n\n` +
                `*Duration formats:*\n` +
                `┣ \`1day\` / \`7days\` / \`30days\` / \`7hari\`\n` +
                `┣ \`1week\` / \`2weeks\` / \`1minggu\`\n` +
                `┣ \`1month\` / \`3months\` / \`1bulan\`\n` +
                `┣ \`1year\` / \`1tahun\`\n` +
                `┗ \`permanent\` / \`selamanya\`\n\n` +
                `*Examples:*\n` +
                `\`${P}sewa 7days\` (inside group)\n` +
                `\`${P}sewa https://chat.whatsapp.com/xxx 1month\``
            );
        }

        if (args.length === 1) {
            if (isGroup && parseDurasi(args[0])) {
                targetJid = jid;
                durasiStr = args[0];
            } else {
                return ctx.reply(`❌ Incomplete arguments.\nExample: \`${P}sewa 7days\` (in group) or \`${P}sewa <link> 7days\``);
            }
        } else {
            targetJid = resolveGroupJid(args[0]);
            durasiStr = args.slice(1).join('');
            if (!targetJid) {
                if (isGroup && parseDurasi(args[0])) {
                    targetJid = jid;
                    durasiStr = args[0];
                } else {
                    return ctx.reply('❌ Unrecognized group link or JID format.');
                }
            }
        }

        const result = addSewa(targetJid, {
            penyewaJid: ctx.sender,
            durasi: durasiStr,
            catatan: '',
        });

        if (!result.ok) return ctx.reply(`❌ ${result.reason}`);

        const isPerp = result.perpanjang;
        const selesaiText = result.selesaiTs === Infinity
            ? 'Permanent ♾️'
            : fmtTgl(result.selesaiTs);

        await ctx.reply(
            `${isPerp ? '🔄 *Rental Extended*' : '✅ *Bot Group Rental Configured*'}\n\n` +
            `🏘️ Group   : \`${targetJid}\`\n` +
            `⏱️ Duration: *${result.label}*\n` +
            `📅 Valid until: *${selesaiText}*\n\n` +
            `> Type \`${P}ceksewa\` in the group to check status.`
        );
    },

    // ── .ceksewa ──────────────────────────────────────────────────
    async ceksewa(ctx) {
        const targetJid = ctx.args?.[0] ? resolveGroupJid(ctx.args[0]) : ctx.jid;
        const data = getSewa(targetJid);

        if (!data) {
            return ctx.reply(
                `📋 *Bot Rental Status*\n\n` +
                `❌ This group *does not* have an active bot rental or authorization.\n\n` +
                `👑 Developer: AHSAN (03107260507)\n` +
                `> Contact Owner to authorize or rent the bot for this group.`
            );
        }

        const aktif = isSewaActive(targetJid);
        const sisa  = sisaWaktu(data.selesai);

        await ctx.reply(
            `📋 *Bot Rental Status*\n\n` +
            `${aktif ? '✅ *ACTIVE & AUTHORIZED*' : '⛔ *EXPIRED*'}\n\n` +
            `🏘️ Group      : \`${targetJid}\`\n` +
            `📅 Start Date : ${fmtTgl(data.mulai)}\n` +
            `📅 End Date   : ${fmtTgl(data.selesai)}\n` +
            `⏱️ Duration   : ${data.durasi}\n` +
            `⌛ Remaining  : *${sisa}*\n` +
            `${data.diperpanjang > 0 ? `🔄 Extensions: ${data.diperpanjang}x\n` : ''}` +
            `${data.catatan ? `📝 Notes: ${data.catatan}\n` : ''}`
        );
    },

    // ── .delsewa ──────────────────────────────────────────────────
    async delsewa(ctx, sock) {
        if (!ctx.isOwner) return ctx.reply('❌ Only the *Bot Owner/Creator* can remove group rentals.');

        const targetJid = ctx.args?.[0] ? resolveGroupJid(ctx.args[0]) : ctx.jid;
        if (!targetJid) return ctx.reply(`📌 Usage: \`${P}delsewa [link/jid]\` or run directly inside group.`);

        const deleted = delSewa(targetJid);
        if (!deleted) return ctx.reply(`❌ No active rental found for group \`${targetJid}\`.`);

        try {
            await sock?.sendMessage(targetJid, {
                text: '⚠️ Bot rental for this group has been revoked by Owner. The bot is now leaving. Thank you!'
            });
            await new Promise(r => setTimeout(r, 2000));
            await sock?.groupLeave(targetJid).catch(() => {});
        } catch {}

        await ctx.reply(`✅ Rental for group \`${targetJid}\` removed successfully and bot left group.`);
    },

    // ── .listsewa ─────────────────────────────────────────────────
    async listsewa(ctx) {
        if (!ctx.isOwner) return ctx.reply('❌ Only the *Bot Owner/Creator* can view the rental directory.');

        const list = listSewa(false);
        if (list.length === 0) return ctx.reply('📋 No rental records found in database.');

        const active  = list.filter(s => isSewaActive(s.jid));
        const expired = list.filter(s => !isSewaActive(s.jid));

        const fmt = (s) =>
            `• \`${s.jid.split('@')[0]}\` — ${s.durasi} — ⌛ ${sisaWaktu(s.selesai)}`;

        let msg = `📋 *BOT GROUP RENTALS DIRECTORY*\n\n`;
        if (active.length)  msg += `✅ *Active (${active.length}):*\n${active.map(fmt).join('\n')}\n\n`;
        if (expired.length) msg += `⛔ *Expired (${expired.length}):*\n${expired.map(fmt).join('\n')}`;

        await ctx.reply(msg);
    },

    // ── .extsewa (extend) ─────────────────────────────────────────
    async extsewa(ctx) {
        if (!ctx.isOwner) return ctx.reply('❌ Only the *Bot Owner/Creator* can extend rentals.');

        const { args, jid, isGroup } = ctx;
        if (args.length === 0) {
            return ctx.reply(`📌 Usage: \`${P}extsewa [link] [duration]\` or \`${P}extsewa 7days\` inside group.`);
        }

        let targetJid = null, durasiStr = null;
        if (isGroup && args.length === 1 && parseDurasi(args[0])) {
            targetJid = jid; durasiStr = args[0];
        } else {
            targetJid = resolveGroupJid(args[0]);
            durasiStr = args.slice(1).join('');
        }
        if (!targetJid || !durasiStr) return ctx.reply('❌ Incomplete duration format.');

        const existing = getSewa(targetJid);
        if (!existing) return ctx.reply(`❌ Group does not have an active rental. Use \`${P}sewa\` first.`);

        const result = addSewa(targetJid, { penyewaJid: ctx.sender, durasi: durasiStr });
        if (!result.ok) return ctx.reply(`❌ ${result.reason}`);

        await ctx.reply(
            `🔄 *Rental Extended*\n\n` +
            `⏱️ Added: *+${result.label}*\n` +
            `📅 New End Date: *${fmtTgl(result.selesaiTs)}*\n` +
            `⌛ Remaining: *${sisaWaktu(result.selesaiTs)}*`
        );
    },

    // ── .hargasewa ────────────────────────────────────────────────
    async hargasewa(ctx) {
        const harga = getHargaSewa();

        await ctx.reply(
            `💰 *MASTER MD RENTAL PLANS*\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
            `${harga ? `${harga}\n\n` : ''}` +
            `⏱️ *Custom Durations Available* — Any duration from days to permanent access!\n\n` +
            `*Supported durations:*\n` +
            `┣ \`7days\` / \`14days\` / \`30days\`\n` +
            `┣ \`1month\` / \`3months\` / \`6months\`\n` +
            `┣ \`1year\` / \`permanent\`\n\n` +
            `👑 *Contact Developer:* AHSAN (03107260507)\n` +
            `📢 *Official Channel:* https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46\n\n` +
            `> Type \`${P}ceksewa\` to check your group's current authorization.`
        );
    },

    // ── .gantihargasewa ─────────────────────────────────────────────
    async gantihargasewa(ctx) {
        if (!ctx.isOwner) {
            return ctx.reply('❌ Only the *Bot Owner/Creator* can update rental pricing.');
        }

        const teks = ctx.args?.join(' ').trim();
        const current = getHargaSewa();

        if (!teks) {
            return ctx.reply(
                `📌 *Update Rental Pricing*\n\n` +
                `Current text:\n${current ? current : '_(not set)_'}\n\n` +
                `*Usage:*\n` +
                `\`${P}gantihargasewa <new pricing text>\`\n\n` +
                `*Example:*\n` +
                `\`${P}gantihargasewa 7 Days: $2 | 30 Days: $5 | Permanent: $15\`\n\n` +
                `> Send \`-\` to reset pricing text.`
            );
        }

        setHargaSewa(teks === '-' ? '' : teks);

        await ctx.reply(
            teks === '-'
                ? `✅ Rental pricing text cleared.\n\n> Type \`${P}hargasewa\` to view.`
                : `✅ *Rental Pricing Updated*\n\n${teks}\n\n> Type \`${P}hargasewa\` to view.`
        );
    },

    // ── .sewamode on/off ──────────────────────────────────────────
    async sewamode(ctx) {
        if (!ctx.isOwner) return ctx.reply('❌ Only the *Bot Owner/Creator* can toggle rental mode.');

        const arg = (ctx.args?.[0] || '').toLowerCase();
        if (!['on', 'off'].includes(arg)) {
            return ctx.reply(
                `📌 *Rental Mode*\n\n` +
                `Status: *${isSewaMode() ? '✅ ON' : '❌ OFF'}*\n\n` +
                `• ON = Only rented/authorized groups can use the bot\n` +
                `• OFF = Public mode (all groups can use the bot)\n\n` +
                `\`${P}sewamode on\` / \`${P}sewamode off\``
            );
        }
        const val = arg === 'on';
        setSewaMode(val);
        await ctx.reply(
            val
                ? `✅ *Rental Mode ON* — Bot now only responds in authorized/rented groups.`
                : `❌ *Rental Mode OFF* — Bot is active in all groups (public mode).`
        );
    },
};
