// ═══════════════════════════════════════════════════════════════════
//  GUILDSYSTEM.JS — Sistem Guild/Clan RPG (baru, belum ada sebelumnya)
// ═══════════════════════════════════════════════════════════════════
//  Player bisa bikin/join guild, sumbang gold ke treasury guild buat
//  naikin level guild (perk: bonus gold/exp untuk semua member), dan
//  ada hirarki Leader > Officer > Member.
//
//  Command-nya ada di commands/rpgCommands6.js — file ini logic murni.
// ═══════════════════════════════════════════════════════════════════

import { store, save } from './db.js';
import { getChar, saveChar } from './rpgEngine.js';

const GUILD_CREATE_COST = 500;
const GUILD_MAX_MEMBERS = 20;

function guildsStore() { return store('guilds', {}); }

export function getGuild(guildId) {
    return guildsStore()[guildId] || null;
}

export function findGuildByName(name) {
    const guilds = guildsStore();
    const q = name.toLowerCase().trim();
    return Object.values(guilds).find(g => g.name.toLowerCase() === q) || null;
}

export function getPlayerGuild(jid) {
    const char = getChar(jid);
    if (!char?.guildId) return null;
    return getGuild(char.guildId);
}

export function guildExpNeeded(level) {
    return 1000 * level;
}

export function createGuild(jid, name) {
    if (!name || name.length < 3 || name.length > 20) {
        return { success: false, error: 'Nama guild harus 3-20 karakter.' };
    }
    const char = getChar(jid);
    if (!char) return { success: false, error: 'Kamu belum punya karakter RPG. Ketik `.rpg` dulu.' };
    if (char.guildId) return { success: false, error: 'Kamu sudah tergabung di guild lain. Keluar dulu (`.guildleave`).' };
    if (char.gold < GUILD_CREATE_COST) return { success: false, error: `Butuh ${GUILD_CREATE_COST} gold untuk bikin guild (kamu punya ${char.gold}).` };
    if (findGuildByName(name)) return { success: false, error: 'Nama guild itu sudah dipakai, pilih nama lain.' };

    const guildId = `g${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const guilds = guildsStore();
    guilds[guildId] = {
        id: guildId,
        name,
        leader: jid,
        officers: [],
        members: [jid],
        level: 1,
        exp: 0,
        treasury: 0,
        createdAt: Date.now(),
    };
    save('guilds');

    char.gold -= GUILD_CREATE_COST;
    char.guildId = guildId;
    saveChar(jid, char);

    return { success: true, guild: guilds[guildId] };
}

export function joinGuild(jid, name) {
    const char = getChar(jid);
    if (!char) return { success: false, error: 'Kamu belum punya karakter RPG. Ketik `.rpg` dulu.' };
    if (char.guildId) return { success: false, error: 'Kamu sudah tergabung di guild lain. Keluar dulu (`.guildleave`).' };
    const guild = findGuildByName(name);
    if (!guild) return { success: false, error: 'Guild dengan nama itu tidak ditemukan.' };
    if (guild.members.length >= GUILD_MAX_MEMBERS) return { success: false, error: `Guild ini sudah penuh (maks ${GUILD_MAX_MEMBERS} member).` };

    guild.members.push(jid);
    save('guilds');
    char.guildId = guild.id;
    saveChar(jid, char);
    return { success: true, guild };
}

export function leaveGuild(jid) {
    const char = getChar(jid);
    if (!char?.guildId) return { success: false, error: 'Kamu belum tergabung di guild manapun.' };
    const guild = getGuild(char.guildId);
    if (!guild) { char.guildId = null; saveChar(jid, char); return { success: false, error: 'Data guild kamu sudah tidak ada.' }; }
    if (guild.leader === jid) {
        return { success: false, error: 'Leader tidak bisa keluar begitu saja — pakai `.guilddisband` untuk bubarkan guild, atau promote member lain jadi leader dulu.' };
    }
    guild.members = guild.members.filter(m => m !== jid);
    guild.officers = guild.officers.filter(m => m !== jid);
    save('guilds');
    char.guildId = null;
    saveChar(jid, char);
    return { success: true };
}

export function kickFromGuild(actorJid, targetJid) {
    const actorChar = getChar(actorJid);
    if (!actorChar?.guildId) return { success: false, error: 'Kamu belum tergabung di guild manapun.' };
    const guild = getGuild(actorChar.guildId);
    if (!guild) return { success: false, error: 'Data guild tidak ditemukan.' };
    const isLeader = guild.leader === actorJid;
    const isOfficer = guild.officers.includes(actorJid);
    if (!isLeader && !isOfficer) return { success: false, error: 'Cuma Leader/Officer yang bisa kick member.' };
    if (!guild.members.includes(targetJid)) return { success: false, error: 'Orang itu bukan member guild ini.' };
    if (targetJid === guild.leader) return { success: false, error: 'Tidak bisa kick Leader.' };
    if (guild.officers.includes(targetJid) && !isLeader) return { success: false, error: 'Cuma Leader yang bisa kick sesama Officer.' };

    guild.members = guild.members.filter(m => m !== targetJid);
    guild.officers = guild.officers.filter(m => m !== targetJid);
    save('guilds');
    const targetChar = getChar(targetJid);
    if (targetChar) { targetChar.guildId = null; saveChar(targetJid, targetChar); }
    return { success: true };
}

export function setGuildRole(actorJid, targetJid, promote) {
    const actorChar = getChar(actorJid);
    if (!actorChar?.guildId) return { success: false, error: 'Kamu belum tergabung di guild manapun.' };
    const guild = getGuild(actorChar.guildId);
    if (!guild) return { success: false, error: 'Data guild tidak ditemukan.' };
    if (guild.leader !== actorJid) return { success: false, error: 'Cuma Leader yang bisa promote/demote Officer.' };
    if (!guild.members.includes(targetJid)) return { success: false, error: 'Orang itu bukan member guild ini.' };
    if (targetJid === guild.leader) return { success: false, error: 'Target adalah Leader.' };

    if (promote) {
        if (guild.officers.includes(targetJid)) return { success: false, error: 'Orang itu sudah jadi Officer.' };
        guild.officers.push(targetJid);
    } else {
        if (!guild.officers.includes(targetJid)) return { success: false, error: 'Orang itu bukan Officer.' };
        guild.officers = guild.officers.filter(m => m !== targetJid);
    }
    save('guilds');
    return { success: true };
}

export function donateToGuild(jid, amount) {
    const char = getChar(jid);
    if (!char?.guildId) return { success: false, error: 'Kamu belum tergabung di guild manapun.' };
    if (!Number.isFinite(amount) || amount <= 0) return { success: false, error: 'Jumlah donasi tidak valid.' };
    if (char.gold < amount) return { success: false, error: `Gold kamu tidak cukup (punya ${char.gold}).` };

    const guild = getGuild(char.guildId);
    if (!guild) return { success: false, error: 'Data guild tidak ditemukan.' };

    char.gold -= amount;
    saveChar(jid, char);
    guild.treasury += amount;
    guild.exp += Math.floor(amount / 2);
    save('guilds');
    return { success: true, guild };
}

export function upgradeGuild(jid) {
    const char = getChar(jid);
    if (!char?.guildId) return { success: false, error: 'Kamu belum tergabung di guild manapun.' };
    const guild = getGuild(char.guildId);
    if (!guild) return { success: false, error: 'Data guild tidak ditemukan.' };
    const isLeader = guild.leader === jid;
    const isOfficer = guild.officers.includes(jid);
    if (!isLeader && !isOfficer) return { success: false, error: 'Cuma Leader/Officer yang bisa upgrade guild.' };

    const cost = guildExpNeeded(guild.level);
    if (guild.treasury < cost) {
        return { success: false, error: `Treasury belum cukup. Butuh ${cost} gold di treasury (sekarang ${guild.treasury}). Sumbang lewat \`.guilddonate\`.` };
    }
    guild.treasury -= cost;
    guild.level += 1;
    save('guilds');
    return { success: true, guild };
}

export function disbandGuild(jid) {
    const char = getChar(jid);
    if (!char?.guildId) return { success: false, error: 'Kamu belum tergabung di guild manapun.' };
    const guild = getGuild(char.guildId);
    if (!guild) return { success: false, error: 'Data guild tidak ditemukan.' };
    if (guild.leader !== jid) return { success: false, error: 'Cuma Leader yang bisa membubarkan guild.' };

    for (const memberJid of guild.members) {
        const memberChar = getChar(memberJid);
        if (memberChar) { memberChar.guildId = null; saveChar(memberJid, memberChar); }
    }
    const guilds = guildsStore();
    delete guilds[guild.id];
    save('guilds');
    return { success: true };
}

export function listGuilds() {
    return Object.values(guildsStore()).sort((a, b) => b.level - a.level || b.members.length - a.members.length);
}

// Bonus dari level guild: +2% gold & exp per level guild (perk pasif
// untuk semua member) — dipanggil dari rpgCommands lain kalau mau
// diterapkan ke reward hunt/dungeon/dsb (opsional, tidak wajib dipakai).
export function getGuildBonusMultiplier(jid) {
    const guild = getPlayerGuild(jid);
    if (!guild) return 1;
    return 1 + (guild.level - 1) * 0.02;
}
