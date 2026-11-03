import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getGroupSettings, updateGroupSettings } from '../lib/db.js';
import { fmtDuration, parseDurationArg, jidNum } from '../lib/utils.js';
import settings from '../setting.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RYOIKI_VIDEO_PATH = path.join(__dirname, '..', 'media', 'ryoiki-tenkai.mp4');

// In-memory runtime state (per-process; resets on restart, persisted settings live in db)
const mutedGroups = new Map();   // jid -> unmuteAt (0 = indefinite)
const warnCounts = new Map();    // `${jid}:${sender}` -> count
const antilinkExempt = new Set();
const slowmode = new Map();      // jid -> {seconds, lastMsgBySender: Map}
const groupLocks = new Map();    // jid -> Set of lock types ('media','sticker','link', etc.)

function isAdminCheck(isAdmin, reply) {
    // isAdmin === undefined → command dipakai di DM (bukan grup)
    if (isAdmin === undefined || isAdmin === null) {
        reply('❌ This command can only be used inside a *group*!');
        return false;
    }
    // isAdmin === false → ada di grup tapi bukan admin
    if (!isAdmin) {
        reply('❌ Only *group admins* can use this command!');
        return false;
    }
    return true;
}

function warnKey(jid, sender) {
    return `${jid}:${sender}`;
}

export async function checkMute(sock, msg, jid, sender, isAdmin) {
    if (!mutedGroups.has(jid)) return false;
    const until = mutedGroups.get(jid);
    if (until !== 0 && Date.now() > until) {
        mutedGroups.delete(jid);
        return false;
    }
    if (isAdmin) return false;

    try {
        await sock.sendMessage(jid, { delete: msg.key });
    } catch { /* ignore */ }
    return true;
}

export function isGroupLocked(jid, type) {
    return groupLocks.get(jid)?.has(type) || false;
}

// Dipakai oleh .grouplockstatus (v3.1.0) untuk menampilkan semua jenis
// lock yang sedang aktif di satu grup sekaligus, tanpa perlu tahu daftar
// jenisnya lebih dulu.
export function getLockedTypes(jid) {
    return [...(groupLocks.get(jid) || [])];
}

export async function checkSlowmode(sock, msg, jid, sender) {
    const sm = slowmode.get(jid);
    if (!sm) return false;
    const last = sm.lastMsgBySender.get(sender) || 0;
    const now = Date.now();
    if (now - last < sm.seconds * 1000) {
        try { await sock.sendMessage(jid, { delete: msg.key }); } catch {}
        return true;
    }
    sm.lastMsgBySender.set(sender, now);
    return false;
}

// ─── DETEKSI TIPE KONTEN UNTUK GROUP LOCK ──────────────────────────────────
// v3.1.0: diperluas dari cuma 'media' (gambar/video/dokumen digabung jadi
// satu) & 'sticker', menjadi granular per jenis — supaya admin bisa kunci
// SATU jenis spesifik (misal cuma dokumen, sering disalahgunakan buat sebar
// file .apk mencurigakan) tanpa harus ikut mengunci gambar/video juga.
// Lock 'media' LAMA tetap didukung penuh lewat LEGACY_MEDIA_TYPES di bawah,
// supaya grup yang sudah pakai `.lockmedia on` sebelumnya tidak perlu
// setting ulang apapun setelah update ini.
export function getMessageContentType(msg) {
    const m = msg?.message;
    if (!m) return null;
    if (m.stickerMessage) return 'sticker';
    if (m.contactMessage || m.contactsArrayMessage) return 'contact';
    if (m.locationMessage || m.liveLocationMessage) return 'location';
    if (m.audioMessage) return m.audioMessage.ptt ? 'voice' : 'audio';
    if (m.videoMessage) return m.videoMessage.gifPlayback ? 'gif' : 'video';
    if (m.imageMessage) return 'image';
    if (m.documentMessage) return 'document';
    if (m.pollCreationMessage || m.pollCreationMessageV2 || m.pollCreationMessageV3) return 'poll';
    // FIX (fitur baru .locktext — mode "media only"): pesan teks BEBAS
    // (bukan command yang diawali prefix) juga dideteksi sebagai 'text'.
    // SENGAJA tidak dianggap 'text' kalau diawali prefix (mis. '.') —
    // supaya .locktext tidak ikut menghapus command, cuma chat bebas biasa.
    const plainText = m.conversation || m.extendedTextMessage?.text;
    if (typeof plainText === 'string' && plainText.trim() && !plainText.trim().startsWith(settings.prefix)) {
        return 'text';
    }
    return null;
}

// Jenis-jenis yang sebelum v3.1.0 semuanya ditelan satu lock 'media'.
const LEGACY_MEDIA_TYPES = new Set(['image', 'video', 'document']);

const LOCK_TYPE_LABEL = {
    media: 'gambar/video/dokumen', sticker: 'stiker', image: 'gambar',
    video: 'video', document: 'dokumen', contact: 'kontak',
    location: 'lokasi', audio: 'audio', voice: 'voice note',
    gif: 'GIF', poll: 'polling', text: 'chat teks bebas (mode media-only)',
};

export async function checkContentLock(sock, msg, jid, sender, isAdmin) {
    if (isAdmin) return false;
    const type = getMessageContentType(msg);
    if (!type) return false;

    const specificLocked = isGroupLocked(jid, type);
    const legacyLocked    = LEGACY_MEDIA_TYPES.has(type) && isGroupLocked(jid, 'media');
    if (!specificLocked && !legacyLocked) return false;

    const label = LOCK_TYPE_LABEL[type] || type;
    try {
        await sock.sendMessage(jid, { delete: msg.key });
        await sock.sendMessage(jid, {
            text: `🔒 *LOCK ${type.toUpperCase()} AKTIF!*\n\n@${jidNum(sender)}, pengiriman ${label} sedang dikunci di grup ini.`,
            mentions: [sender],
        });
    } catch { /* ignore */ }
    return true;
}

// ─── HELPER WARN LINTAS-GRUP (v3.1.0) ──────────────────────────────────────
// warnCounts (di atas) key-nya "`${jid}:${sender}`" — dua fungsi di bawah
// membaca/menghapus SEMUA entry milik satu jid grup sekaligus, dipakai oleh
// .cekwarnall, .topwarn, dan .resetwarnall tanpa perlu tahu daftar member
// yang punya warn lebih dulu.
export function getGroupWarns(jid) {
    const prefix = `${jid}:`;
    const out = [];
    for (const [key, count] of warnCounts) {
        if (key.startsWith(prefix) && count > 0) {
            out.push({ sender: key.slice(prefix.length), count });
        }
    }
    return out.sort((a, b) => b.count - a.count);
}

export function resetGroupWarns(jid) {
    const prefix = `${jid}:`;
    let cleared = 0;
    for (const key of [...warnCounts.keys()]) {
        if (key.startsWith(prefix)) {
            warnCounts.delete(key);
            cleared++;
        }
    }
    return cleared;
}

export const adminCommands = {

    // ─── MUTE / UNMUTE ───────────────────────────────────────────────────
    async muteGroup(sock, reply, jid, args, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const ms = parseDurationArg(args[0], 'm');
        const until = ms ? Date.now() + ms : 0;
        mutedGroups.set(jid, until);

        let text = '🔇 *Group has been MUTED!*\nOnly admins can send messages now.';
        if (ms) {
            text += `\n⏱️ Auto-unmute in *${fmtDuration(ms)}*.`;
            setTimeout(async () => {
                if (mutedGroups.get(jid) === until) {
                    mutedGroups.delete(jid);
                    try { await sock.sendMessage(jid, { text: '🔊 *Group has been automatically UNMUTED!*' }); } catch {}
                }
            }, ms);
        }
        await reply(text);
    },

    async unmuteGroup(reply, jid, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        mutedGroups.delete(jid);
        await reply('🔊 *Group has been UNMUTED!* Chat returned to normal.');
    },

    async muteStatus(reply, jid) {
        if (!mutedGroups.has(jid)) return reply('🔊 Group is not currently muted.');
        const until = mutedGroups.get(jid);
        await reply(until === 0 ? '🔇 Group is muted indefinitely.' : `🔇 Group is muted until ${new Date(until).toLocaleTimeString('id-ID')}`);
    },

    // ─── KICK / ADD / PROMOTE / DEMOTE ──────────────────────────────────
    async kickMember(sock, reply, msg, jid, mentioned, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        if (!mentioned?.length) return reply('📌 Usage: *!kick @tag*');

        const results = [];
        for (const target of mentioned) {
            try {
                await sock.groupParticipantsUpdate(jid, [target], 'remove');
                results.push(`👢 @${jidNum(target)} has been removed from the group.`);
            } catch {
                results.push(`❌ Failed to kick @${jidNum(target)}`);
            }
        }
        await sock.sendMessage(jid, { text: results.join('\n'), mentions: mentioned }, { quoted: msg });
    },

    // ─── RYOIKI TENKAI KICK — kirim video "Ryoiki Tenkai" lalu kick member ──
    async ryoikiTenkaiKick(sock, reply, msg, jid, mentioned, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        if (!mentioned?.length) return reply('📌 Usage: *!ryoiken @tag*\n\n_Tagged member will be banished through Domain Expansion and removed from the group._');

        const hasVideo = fs.existsSync(RYOIKI_VIDEO_PATH);
        const targetTags = mentioned.map(t => `@${jidNum(t)}`).join(' ');
        const caption = `🌀 *DOMAIN EXPANSION...!* 🌀\n\n${targetTags} has been trapped inside the domain.\n_There is no escape..._`;

        try {
            if (hasVideo) {
                await sock.sendMessage(jid, {
                    video: fs.readFileSync(RYOIKI_VIDEO_PATH),
                    caption,
                    mentions: mentioned,
                }, { quoted: msg });
            } else if (settings.thumbnailRyoikiTenkai) {
                await sock.sendMessage(jid, {
                    image: { url: settings.thumbnailRyoikiTenkai },
                    caption,
                    mentions: mentioned,
                }, { quoted: msg });
            } else {
                await sock.sendMessage(jid, {
                    text: `${caption}\n\n⚠️ _(Drop video into_ \`media/ryoiki-tenkai.mp4\` _to play animation before kick)_`,
                    mentions: mentioned,
                }, { quoted: msg });
            }
        } catch {
            await sock.sendMessage(jid, { text: caption, mentions: mentioned }, { quoted: msg }).catch(() => {});
        }

        await new Promise(r => setTimeout(r, 2500));

        const results = [];
        for (const target of mentioned) {
            try {
                await sock.groupParticipantsUpdate(jid, [target], 'remove');
                results.push(`💀 @${jidNum(target)} — *"Domain Expansion: Void Purge."* Banished from the group.`);
            } catch {
                results.push(`❌ Failed to remove @${jidNum(target)} (check if bot is group admin).`);
            }
        }
        await sock.sendMessage(jid, { text: results.join('\n'), mentions: mentioned }, { quoted: msg });
    },

    async promoteMember(sock, reply, msg, jid, mentioned, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        if (!mentioned?.length) return reply('📌 Usage: *!promote @tag*');

        const results = [];
        for (const target of mentioned) {
            try {
                await sock.groupParticipantsUpdate(jid, [target], 'promote');
                results.push(`✅ @${jidNum(target)} has been promoted to admin!`);
            } catch {
                results.push(`❌ Failed to promote @${jidNum(target)}`);
            }
        }
        await sock.sendMessage(jid, { text: results.join('\n'), mentions: mentioned }, { quoted: msg });
    },

    async demoteMember(sock, reply, msg, jid, mentioned, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        if (!mentioned?.length) return reply('📌 Usage: *!demote @tag*');

        const results = [];
        for (const target of mentioned) {
            try {
                await sock.groupParticipantsUpdate(jid, [target], 'demote');
                results.push(`⬇️ @${jidNum(target)} has been demoted from admin.`);
            } catch {
                results.push(`❌ Failed to demote @${jidNum(target)}`);
            }
        }
        await sock.sendMessage(jid, { text: results.join('\n'), mentions: mentioned }, { quoted: msg });
    },

    async addMember(sock, reply, jid, args, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const number = (args[0] || '').replace(/[^0-9]/g, '');
        if (!number) return reply('📌 Usage: *!add 628xxxx*');

        try {
            await sock.groupParticipantsUpdate(jid, [`${number}@s.whatsapp.net`], 'add');
            await reply(`✅ Successfully added +${number} to the group.`);
        } catch {
            await reply('❌ Failed to add member. Number might be invalid or privacy restricted.');
        }
    },

    // ─── WARN SYSTEM ─────────────────────────────────────────────────────
    async warnMember(sock, reply, msg, jid, mentioned, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        if (!mentioned?.length) return reply('📌 Usage: *!warn @tag*');

        const settings = getGroupSettings(jid);
        const limit = settings.warnLimit || 3;
        const results = [];

        for (const target of mentioned) {
            const key = warnKey(jid, target);
            const count = (warnCounts.get(key) || 0) + 1;
            warnCounts.set(key, count);

            if (count >= limit) {
                try {
                    await sock.groupParticipantsUpdate(jid, [target], 'remove');
                    results.push(`🚨 @${jidNum(target)} reached ${count}/${limit} warnings and has been KICKED!`);
                    warnCounts.delete(key);
                } catch {
                    results.push(`⚠️ @${jidNum(target)} reached warning limit but failed to kick.`);
                }
            } else {
                results.push(`⚠️ @${jidNum(target)} was issued a warning (${count}/${limit}).`);
            }
        }
        await sock.sendMessage(jid, { text: results.join('\n'), mentions: mentioned }, { quoted: msg });
    },

    async unwarnMember(sock, reply, msg, jid, mentioned, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        if (!mentioned?.length) return reply('📌 Usage: *!unwarn @tag*');

        for (const target of mentioned) {
            const key = warnKey(jid, target);
            const count = Math.max(0, (warnCounts.get(key) || 0) - 1);
            warnCounts.set(key, count);
        }
        await reply('✅ Warning count reduced by 1 for tagged member(s).');
    },

    async checkWarn(reply, jid, mentioned, sender) {
        const target = mentioned?.[0] || sender;
        const count = warnCounts.get(warnKey(jid, target)) || 0;
        const settings = getGroupSettings(jid);
        await reply(`⚠️ @${jidNum(target)} currently has *${count}/${settings.warnLimit || 3}* warnings.`);
    },

    async setWarnLimit(reply, jid, args, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const n = parseInt(args[0]);
        if (!n || n < 1) return reply('📌 Usage: *!warnlimit [number]*');
        updateGroupSettings(jid, { warnLimit: n });
        await reply(`✅ Warning limit set to *${n}*.`);
    },

    // ─── GROUP INFO / SETTINGS TOGGLES ──────────────────────────────────
    async groupInfo(sock, reply, jid) {
        try {
            const metadata = await sock.groupMetadata(jid);
            const settings = getGroupSettings(jid);
            await reply(
`ℹ️ *GROUP PROFILE & SECURITY*

📛 Name: ${metadata.subject}
👥 Members: ${metadata.participants.length}
📝 Description: ${metadata.desc || '-'}

🛡️ Anti-Group Link: ${settings.antigb ? '✅' : '❌'}
🔗 Anti-Link: ${settings.antilink ? '✅' : '❌'}
🚫 Anti-Spam: ${settings.antispam ? '✅' : '❌'}
🤬 Anti-Toxic: ${settings.antitoxic ? '✅' : '❌'}
👋 Welcome: ${settings.welcome ? '✅' : '❌'}
👋 Farewell: ${settings.farewell ? '✅' : '❌'}

👑 Developer: AHSAN (03107260507)
💡 _Type *.menuadmin* for full moderation controls_`
            );
        } catch {
            await reply('❌ Failed to retrieve group information.');
        }
    },

    async setGroupName(sock, reply, jid, args, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const name = args.join(' ');
        if (!name) return reply('📌 Usage: *!setname [new name]*');
        try {
            await sock.groupUpdateSubject(jid, name);
            await reply(`✅ Group name changed to *${name}*.`);
        } catch {
            await reply('❌ Failed to update group name (ensure bot is admin).');
        }
    },

    async setGroupDesc(sock, reply, jid, args, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const desc = args.join(' ');
        if (!desc) return reply('📌 Usage: *!setdesc [description]*');
        try {
            await sock.groupUpdateDescription(jid, desc);
            await reply('✅ Group description updated successfully.');
        } catch {
            await reply('❌ Failed to update group description.');
        }
    },

    async lockGroup(sock, reply, jid, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        try {
            await sock.groupSettingUpdate(jid, 'announcement');
            await reply('🔒 Group locked! Only admins can send messages.');
        } catch {
            await reply('❌ Failed to lock group.');
        }
    },

    async unlockGroup(sock, reply, jid, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        try {
            await sock.groupSettingUpdate(jid, 'not_announcement');
            await reply('🔓 Group unlocked! All members can send messages.');
        } catch {
            await reply('❌ Failed to unlock group.');
        }
    },

    async getInviteLink(sock, reply, jid, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        try {
            const code = await sock.groupInviteCode(jid);
            await reply(`🔗 Group Invite Link:\nhttps://chat.whatsapp.com/${code}`);
        } catch {
            await reply('❌ Failed to fetch group invite link.');
        }
    },

    async revokeInviteLink(sock, reply, jid, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        try {
            await sock.groupRevokeInvite(jid);
            await reply('✅ Group invite link reset successfully. Previous link is now invalid.');
        } catch {
            await reply('❌ Failed to reset group link.');
        }
    },

    async leaveGroup(sock, reply, jid, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        await reply('👋 Bot is leaving the group. Farewell everyone!');
        try {
            await sock.groupLeave(jid);
        } catch { /* ignore */ }
    },

    // ─── TOGGLE-STYLE SETTINGS (generic) ────────────────────────────────
    async toggleSetting(reply, jid, key, label, args, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const status = (args[0] || '').toLowerCase();

        if (status === 'on') {
            updateGroupSettings(jid, { [key]: true });
            await reply(`✅ *${label}* has been enabled!`);
        } else if (status === 'off') {
            updateGroupSettings(jid, { [key]: false });
            await reply(`❌ *${label}* has been disabled.`);
        } else {
            const current = getGroupSettings(jid)[key];
            await reply(`ℹ️ Current status of *${label}*: ${current ? '✅ ENABLED' : '❌ DISABLED'}\n\nUsage: *.set ${key} on / off*`);
        }
    },

    // ─── WELCOME / FAREWELL MESSAGES ────────────────────────────────────
    async setWelcomeMsg(reply, jid, args, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const text = args.join(' ');
        if (!text) return reply('📌 Usage: *!setwelcome [text]*\nUse {user} to mention the new member, {group} for group name.');
        updateGroupSettings(jid, { welcomeText: text, welcome: true });
        await reply('✅ Welcome message set and enabled successfully.');
    },

    async setFarewellMsg(reply, jid, args, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const text = args.join(' ');
        if (!text) return reply('📌 Usage: *!setfarewell [text]*\nUse {user} to mention the member, {group} for group name.');
        updateGroupSettings(jid, { farewellText: text, farewell: true });
        await reply('✅ Farewell message set and enabled successfully.');
    },

    // ─── SLOWMODE ────────────────────────────────────────────────────────
    async setSlowmode(reply, jid, args, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const seconds = parseInt(args[0]);
        if (!seconds || seconds < 0) {
            slowmode.delete(jid);
            return reply('✅ Slow mode disabled.');
        }
        slowmode.set(jid, { seconds, lastMsgBySender: new Map() });
        await reply(`🐢 Slow mode enabled: members must wait *${seconds} seconds* between messages.`);
    },

    // ─── GROUP LOCKS (media/sticker/link) ───────────────────────────────
    async lockType(reply, jid, type, args, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const status = (args[0] || 'on').toLowerCase();
        if (!groupLocks.has(jid)) groupLocks.set(jid, new Set());
        const set = groupLocks.get(jid);

        if (status === 'off') {
            set.delete(type);
            await reply(`✅ Lock *${type}* disabled.`);
        } else {
            set.add(type);
            await reply(`🔒 Lock *${type}* activated! This content type will be auto-deleted from non-admins.`);
        }
    },

    async hidetag(sock, reply, msg, jid, args, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const text = args.join(' ') || '📢 Attention everyone!';
        try {
            const metadata = await sock.groupMetadata(jid);
            const all = metadata.participants.map(p => p.id);
            await sock.sendMessage(jid, { text, mentions: all }, { quoted: msg });
        } catch {
            await reply('❌ Failed to send hidetag.');
        }
    },

    async tagAll(sock, reply, msg, jid, args, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        try {
            const metadata = await sock.groupMetadata(jid);
            const note = args.join(' ') || 'Attention to all members!';
            const lines = metadata.participants.map(p => `@${jidNum(p.id)}`).join('\n');
            await sock.sendMessage(jid, { text: `📢 *${note}*\n\n${lines}`, mentions: metadata.participants.map(p => p.id) }, { quoted: msg });
        } catch {
            await reply('❌ Failed to tag members.');
        }
    },

    async listAdmins(sock, reply, jid) {
        try {
            const metadata = await sock.groupMetadata(jid);
            const admins = metadata.participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin');
            const lines = admins.map(a => `• @${jidNum(a.id)} ${a.admin === 'superadmin' ? '👑' : '🛡️'}`).join('\n');
            await sock.sendMessage(jid, { text: `👑 *GROUP ADMINS*\n\n${lines}`, mentions: admins.map(a => a.id) });
        } catch {
            await reply('❌ Failed to retrieve admin list.');
        }
    },

    async groupMembersCount(sock, reply, jid) {
        try {
            const metadata = await sock.groupMetadata(jid);
            await reply(`👥 Total group members: *${metadata.participants.length}*`);
        } catch {
            await reply('❌ Failed to retrieve member count.');
        }
    },
};
