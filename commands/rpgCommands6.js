// ═══════════════════════════════════════════════════════════════════
//  RPGCOMMANDS6.JS — Command Guild/Clan (fitur baru)
// ═══════════════════════════════════════════════════════════════════

import { fmtNum } from '../lib/utils.js';
import {
    createGuild, joinGuild, leaveGuild, kickFromGuild, setGuildRole,
    donateToGuild, upgradeGuild, disbandGuild, listGuilds,
    getPlayerGuild, guildExpNeeded, findGuildByName,
} from '../lib/guildSystem.js';

function extractTarget(ctx) {
    const quotedParticipant = ctx.msg.message?.extendedTextMessage?.contextInfo?.participant;
    if (quotedParticipant) return quotedParticipant;
    if (ctx.mentioned?.length) return ctx.mentioned[0];
    return null;
}

function roleLabel(guild, jid) {
    if (guild.leader === jid) return '👑 Leader';
    if (guild.officers.includes(jid)) return '⭐ Officer';
    return '👤 Member';
}

export async function guildCreate(ctx) {
    const name = ctx.args.join(' ').trim();
    if (!name) return ctx.reply('⚠️ Cara pakai: `.guildcreate [nama guild]`\nBiaya: 500 gold');
    const result = createGuild(ctx.sender, name);
    if (!result.success) return ctx.reply(`❌ ${result.error}`);
    return ctx.reply(`✅ *Guild "${result.guild.name}" berhasil dibuat!*\n\nKamu jadi Leader. Ajak teman gabung lewat \`.guildjoin ${result.guild.name}\`.`);
}

export async function guildJoin(ctx) {
    const name = ctx.args.join(' ').trim();
    if (!name) return ctx.reply('⚠️ Cara pakai: `.guildjoin [nama guild]`\nLihat daftar guild: `.guildlist`');
    const result = joinGuild(ctx.sender, name);
    if (!result.success) return ctx.reply(`❌ ${result.error}`);
    return ctx.reply(`✅ *Berhasil gabung guild "${result.guild.name}"!*\n\nTotal member sekarang: ${result.guild.members.length}`);
}

export async function guildLeave(ctx) {
    const result = leaveGuild(ctx.sender);
    if (!result.success) return ctx.reply(`❌ ${result.error}`);
    return ctx.reply('✅ Kamu berhasil keluar dari guild.');
}

export async function guildKick(ctx) {
    const target = extractTarget(ctx);
    if (!target) return ctx.reply('⚠️ Cara pakai: `.guildkick @user` atau reply pesan target.');
    const result = kickFromGuild(ctx.sender, target);
    if (!result.success) return ctx.reply(`❌ ${result.error}`);
    return ctx.reply(`✅ Berhasil kick \`${target.split('@')[0]}\` dari guild.`);
}

export async function guildPromote(ctx) {
    const target = extractTarget(ctx);
    if (!target) return ctx.reply('⚠️ Cara pakai: `.guildpromote @user` atau reply pesan target.');
    const result = setGuildRole(ctx.sender, target, true);
    if (!result.success) return ctx.reply(`❌ ${result.error}`);
    return ctx.reply(`✅ \`${target.split('@')[0]}\` sekarang jadi ⭐ Officer.`);
}

export async function guildDemote(ctx) {
    const target = extractTarget(ctx);
    if (!target) return ctx.reply('⚠️ Cara pakai: `.guilddemote @user` atau reply pesan target.');
    const result = setGuildRole(ctx.sender, target, false);
    if (!result.success) return ctx.reply(`❌ ${result.error}`);
    return ctx.reply(`✅ \`${target.split('@')[0]}\` diturunkan jadi 👤 Member.`);
}

export async function guildDonate(ctx) {
    const amount = parseInt(ctx.args[0], 10);
    if (!amount || amount <= 0) return ctx.reply('⚠️ Cara pakai: `.guilddonate [jumlah gold]`');
    const result = donateToGuild(ctx.sender, amount);
    if (!result.success) return ctx.reply(`❌ ${result.error}`);
    return ctx.reply(`✅ Berhasil sumbang *${fmtNum(amount)} gold* ke treasury guild.\n\n💰 Treasury sekarang: *${fmtNum(result.guild.treasury)}*\n✨ EXP Guild: *${fmtNum(result.guild.exp)}*`);
}

export async function guildUpgrade(ctx) {
    const result = upgradeGuild(ctx.sender);
    if (!result.success) return ctx.reply(`❌ ${result.error}`);
    return ctx.reply(`🎉 *Guild naik ke Level ${result.guild.level}!*\n\nBonus gold & exp untuk semua member sekarang +${((result.guild.level - 1) * 2)}%.`);
}

export async function guildDisband(ctx) {
    if ((ctx.args[0] || '').toLowerCase() !== 'yakin') {
        return ctx.reply('⚠️ Aksi ini PERMANEN dan akan mengeluarkan semua member.\nKetik `.guilddisband yakin` untuk konfirmasi.');
    }
    const result = disbandGuild(ctx.sender);
    if (!result.success) return ctx.reply(`❌ ${result.error}`);
    return ctx.reply('✅ Guild berhasil dibubarkan.');
}

export async function guildInfo(ctx) {
    const name = ctx.args.join(' ').trim();
    const resolved = name ? findGuildByName(name) : getPlayerGuild(ctx.sender);
    if (!resolved) return ctx.reply(name ? '❌ Guild tidak ditemukan.' : '❌ Kamu belum tergabung di guild manapun. Ketik `.guildlist` untuk cari guild.');

    const nextCost = guildExpNeeded(resolved.level);
    let txt = `🏰 *GUILD: ${resolved.name}*\n\n`;
    txt += `👑 Leader: \`${resolved.leader.split('@')[0]}\`\n`;
    txt += `📊 Level: *${resolved.level}* | ✨ EXP: *${fmtNum(resolved.exp)}*\n`;
    txt += `💰 Treasury: *${fmtNum(resolved.treasury)}* _(butuh ${fmtNum(nextCost)} untuk upgrade)_\n`;
    txt += `👥 Member: *${resolved.members.length}/20*\n`;
    return ctx.reply(txt);
}

export async function guildMembers(ctx) {
    const guild = getPlayerGuild(ctx.sender);
    if (!guild) return ctx.reply('❌ Kamu belum tergabung di guild manapun.');
    let txt = `👥 *MEMBER GUILD "${guild.name}"* — ${guild.members.length}/20\n\n`;
    guild.members.forEach((jid, i) => {
        txt += `${i + 1}. \`${jid.split('@')[0]}\` — ${roleLabel(guild, jid)}\n`;
    });
    return ctx.reply(txt);
}

export async function guildListCmd(ctx) {
    const guilds = listGuilds();
    if (!guilds.length) return ctx.reply('📋 Belum ada guild yang dibuat. Jadilah yang pertama lewat `.guildcreate [nama]`!');
    let txt = `📋 *DAFTAR GUILD* — total ${guilds.length}\n\n`;
    guilds.slice(0, 20).forEach((g, i) => {
        txt += `${i + 1}. *${g.name}* — Lv.${g.level} | 👥 ${g.members.length}/20\n`;
    });
    return ctx.reply(txt);
}
