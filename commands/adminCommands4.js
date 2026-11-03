// ═══════════════════════════════════════════════════════════════════
//  ADMINCOMMANDS4.JS — Advanced Group Administration Features
//  Developer: AHSAN (03107260507)
// ═══════════════════════════════════════════════════════════════════

import { getGroupSettings, updateGroupSettings, store, save } from '../lib/db.js';
import { jidNum, fmtDuration, safeReplyText } from '../lib/utils.js';
import { adminCommands, getGroupWarns, resetGroupWarns, getLockedTypes } from './adminCommands.js';
import { isOwner, isCreator } from '../lib/roles.js';
import {
    addWhitelist, removeWhitelist, listWhitelist,
    addCustomBadWord, removeCustomBadWord, getCustomBadWords,
    addAllowLink, removeAllowLink, listAllowLink,
    muteMemberOn, muteMemberOff, listMutedMembers,
} from '../features/protectionExtra.js';

function isAdminCheck(isAdmin, reply) {
    if (!isAdmin) {
        reply('❌ Only group admins can use this command!');
        return false;
    }
    return true;
}

// Fetch all non-admin members (safeguards bot and owner/creator from accidental kicks)
async function getNonAdminMembers(sock, jid) {
    const metadata = await sock.groupMetadata(jid);
    const botNum   = sock.user?.jid?.split('@')[0]?.split(':')[0];
    return metadata.participants
        .filter(p => !p.admin)
        .map(p => p.id)
        .filter(id => {
            if (jidNum(id) === botNum) return false;
            if (isOwner(id) || isCreator(id)) return false;
            return true;
        });
}

const ALL_PROTECTION_KEYS = [
    'antigb', 'antilink', 'antishortlink', 'antispam', 'antitoxic',
    'antilinkphising', 'antijudol', 'antipinjol',
    'anticaps', 'antivirtex', 'antitag', 'antinsfw',
];

function resolveTargetJid(args, mentioned) {
    if (mentioned?.[0]) return mentioned[0];
    const num = (args[0] || '').replace(/\D/g, '');
    return num ? `${num}@s.whatsapp.net` : null;
}

export const adminCommands4 = {

    // ═══════════════════════════════════════════════════════════════
    //  ADVANCED MEMBER MANAGEMENT
    // ═══════════════════════════════════════════════════════════════
    async kickAll(sock, reply, msg, jid, isAdmin, args) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const arg0 = (args[0] || '').toLowerCase();
        if (arg0 !== 'confirm' && arg0 !== 'yakin') {
            return reply('⚠️ *WARNING!*\n\nThis command will remove ALL non-admin members permanently!\n\nTo confirm, type:\n*.kickall confirm*');
        }
        let targets = [];
        try { targets = await getNonAdminMembers(sock, jid); } catch { return reply('❌ Failed to fetch group members.'); }
        if (!targets.length) return reply('ℹ️ No non-admin members found to remove.');
        await reply(`⏳ Removing ${targets.length} non-admin members...`);
        await adminCommands.kickMember(sock, reply, msg, jid, targets, isAdmin);
    },

    async warnAll(sock, reply, msg, jid, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        let targets = [];
        try { targets = await getNonAdminMembers(sock, jid); } catch { return reply('❌ Failed to fetch group members.'); }
        if (!targets.length) return reply('ℹ️ No non-admin members found to warn.');
        await adminCommands.warnMember(sock, reply, msg, jid, targets, isAdmin);
    },

    async listWarnAll(reply, jid) {
        const list = getGroupWarns(jid);
        if (!list.length) return reply('✅ No members with warnings in this group.');
        const lines = list.map((w, i) => `${i + 1}. @${jidNum(w.sender)} — ${w.count}x`).join('\n');
        await reply(`⚠️ *GROUP WARN LIST*\n━━━━━━━━━━━━━━━━━━\n${lines}`);
    },

    async topWarn(reply, jid) {
        const list = getGroupWarns(jid).slice(0, 5);
        if (!list.length) return reply('✅ No members with warnings in this group.');
        const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
        const lines = list.map((w, i) => `${medals[i] || `${i + 1}.`} @${jidNum(w.sender)} — ${w.count}x warn`).join('\n');
        await reply(`🏆 *TOP WARNED MEMBERS*\n━━━━━━━━━━━━━━━━━━\n${lines}`);
    },

    async resetWarnAllCmd(reply, jid, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const cleared = resetGroupWarns(jid);
        await reply(cleared ? `✅ Warnings reset for ${cleared} members.` : 'ℹ️ No warning records to reset.');
    },

    // ═══════════════════════════════════════════════════════════════
    //  GROUP INFORMATION & DASHBOARDS
    // ═══════════════════════════════════════════════════════════════
    async checkBotAdmin(sock, reply, jid) {
        try {
            const metadata = await sock.groupMetadata(jid);
            const botNum   = sock.user?.jid?.split('@')[0]?.split(':')[0];
            const me       = metadata.participants.find(p => jidNum(p.id) === botNum);
            const isBotAdmin = me?.admin === 'admin' || me?.admin === 'superadmin';
            await reply(isBotAdmin
                ? '✅ *Bot is ADMIN* in this group — all moderation features (kick, mute, lock, etc.) are fully active.'
                : '❌ *Bot is NOT an admin* in this group — moderation actions will not function.\n\n💡 Please promote the bot to Admin in WhatsApp group settings.');
        } catch {
            await reply('❌ Failed to verify bot admin status in this group.');
        }
    },

    async groupLockStatus(reply, jid) {
        const s = getGroupSettings(jid);
        const lockedTypes = getLockedTypes(jid);
        const flag = v => v ? '✅' : '❌';
        await reply(
`🛡️ *GROUP PROTECTION STATUS*
━━━━━━━━━━━━━━━━━━
${flag(s.antigb)} Anti-Group-Link
${flag(s.antilink)} Anti-All-Links
${flag(s.antishortlink)} Anti-ShortLink
${flag(s.antilinkphising)} Anti-Phishing-Link
${flag(s.antispam)} Anti-Spam _(+ Anti-Flood)_
${flag(s.antitoxic)} Anti-Toxic
${flag(s.antijudol)} Anti-Gambling
${flag(s.antipinjol)} Anti-Scam-Loans
${flag(s.anticaps)} Anti-Caps
${flag(s.antivirtex)} Anti-Virtex
${flag(s.antitag)} Anti-Mass-Mention
${flag(s.antinsfw)} Anti-NSFW _(adult media auto-delete)_
━━━━━━━━━━━━━━━━━━
🔒 *Active Locks:* ${lockedTypes.length ? lockedTypes.join(', ') : 'None'}
━━━━━━━━━━━━━━━━━━
💡 *.helpproteksi* — View all protection commands`
        );
    },

    async groupSummary(sock, reply, jid) {
        try {
            const metadata = await sock.groupMetadata(jid);
            const s = getGroupSettings(jid);
            const admins  = metadata.participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin').length;
            const warns   = getGroupWarns(jid).length;
            const onCount = ALL_PROTECTION_KEYS.filter(k => s[k]).length;
            const locked  = getLockedTypes(jid).length;
            const schedule = (s.openTime || s.closeTime) ? `${s.openTime || '-'} → ${s.closeTime || '-'}` : 'Not set';
            await reply(
`📊 *GROUP DASHBOARD*
_${metadata.subject}_
━━━━━━━━━━━━━━━━━━
👥 Members    : ${metadata.participants.length}
👑 Admins     : ${admins}
⚠️ Active Warns : ${warns} members
🛡️ Protections: ${onCount}/${ALL_PROTECTION_KEYS.length} active
🔒 Active Locks : ${locked}
⏰ Schedules  : ${schedule}
━━━━━━━━━━━━━━━━━━
💡 *.grouplockstatus* — Protection details
💡 *.groupinfo* — Basic group information`
            );
        } catch {
            await reply('❌ Failed to fetch group summary.');
        }
    },

    async groupAge(sock, reply, jid) {
        try {
            const metadata = await sock.groupMetadata(jid);
            if (!metadata.creation) return reply('ℹ️ Group creation date is unavailable from WhatsApp.');
            const createdMs = metadata.creation * 1000;
            const tanggal = new Date(createdMs).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
            await reply(`📅 *GROUP AGE*\n\nCreated: ${tanggal}\nAge: ${fmtDuration(Date.now() - createdMs)}`);
        } catch {
            await reply('❌ Failed to fetch group age.');
        }
    },

    async adminCount(sock, reply, jid) {
        try {
            const metadata = await sock.groupMetadata(jid);
            const admins = metadata.participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin');
            await reply(`👑 Group Admins: *${admins.length}* of ${metadata.participants.length} members.`);
        } catch {
            await reply('❌ Failed to fetch group admin data.');
        }
    },

    async groupCreatorInfo(sock, reply, jid) {
        try {
            const metadata = await sock.groupMetadata(jid);
            const owner = metadata.owner || metadata.subjectOwner || null;
            if (!owner) return reply('ℹ️ Group creator information is unavailable.');
            await reply(`👤 Group created by: @${jidNum(owner)}`);
        } catch {
            await reply('❌ Failed to fetch group creator info.');
        }
    },

    async exportMember(sock, reply, jid) {
        try {
            const metadata = await sock.groupMetadata(jid);
            const lines = metadata.participants.map((p, i) => `${i + 1}. ${jidNum(p.id)}${p.admin ? ' (admin)' : ''}`).join('\n');
            const text = `📋 *GROUP MEMBERS DIRECTORY*\n_${metadata.subject}_ — Total: ${metadata.participants.length}\n━━━━━━━━━━━━━━━━━━\n${lines}`;
            await reply(safeReplyText(text));
        } catch {
            await reply('❌ Failed to fetch group member list.');
        }
    },

    // ═══════════════════════════════════════════════════════════════
    //  BACKUP / RESTORE GROUP SETTINGS
    // ═══════════════════════════════════════════════════════════════
    async backupSetting(reply, jid, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const backups = store('groupSettingBackup', {});
        backups[jid] = { ...getGroupSettings(jid) };
        save('groupSettingBackup');
        await reply('✅ Group settings (all protection shields & toggles) backed up successfully.\n\n💡 Use *.restoresetting* to restore anytime.');
    },

    async restoreSetting(reply, jid, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const backups = store('groupSettingBackup', {});
        const snapshot = backups[jid];
        if (!snapshot) return reply('❌ No backup settings found for this group. Run *.backupsetting* first.');
        updateGroupSettings(jid, snapshot);
        await reply('✅ Group settings restored successfully from latest backup.');
    },

    // ═══════════════════════════════════════════════════════════════
    //  BUNDLE TOGGLE
    // ═══════════════════════════════════════════════════════════════
    async resetProtectionAll(reply, jid, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const patch = {};
        for (const k of ALL_PROTECTION_KEYS) patch[k] = false;
        updateGroupSettings(jid, patch);
        await reply('✅ All protection filters have been deactivated.');
    },

    async setAntiLinkAll(reply, jid, args, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const status = (args[0] || '').toLowerCase();
        if (status !== 'on' && status !== 'off') {
            return reply('📌 Usage: *.antilinkall on/off*\n\nEnables or disables Anti-GroupLink + Anti-Link + Anti-ShortLink + Anti-Phishing simultaneously.');
        }
        const on = status === 'on';
        updateGroupSettings(jid, { antigb: on, antilink: on, antishortlink: on, antilinkphising: on });
        await reply(on
            ? '✅ All link protection shields (Anti-GroupLink, Anti-Link, Anti-ShortLink, Anti-Phishing) activated.'
            : '❌ All link protection shields deactivated.');
    },

    async helpProteksi(reply) {
        await reply(
`🛡️ *GROUP PROTECTION COMMANDS*
━━━━━━━━━━━━━━━━━━
.antigb on/off — WhatsApp group invite links
.antilink on/off — All hyperlinks
.antishortlink on/off — URL shorteners
.antilinkphising on/off — Phishing patterns
.antijudol on/off — Gambling promotions
.antipinjol on/off — Scam loan links
.anticaps on/off — Excessive uppercase text
.antivirtex on/off — Virus/Zalgo crash text
.antitag on/off — Mass tag spam
.antispam on/off — Message spam (+ anti-flood)
.antitoxic on/off — Abusive language filter
.antinsfw on/off — Adult photos/videos/stickers
.vv / .rvo — Retrieve view-once media
.hapusnsfw — Reply to media to remove + strike
.cekstrikensfw @tag — Check member NSFW strikes
.resetnsfwstrike @tag — Reset member NSFW strikes
.setnsfwlimit [number] — Set strike limit before kick
━━━━━━━━━━━━━━━━━━
💡 .resetprotection — Turn off all shields
💡 .grouplockstatus — View current shield status
━━━━━━━━━━━━━━━━━━`
        );
    },

    // ═══════════════════════════════════════════════════════════════
    //  PROTECTION WHITELIST
    // ═══════════════════════════════════════════════════════════════
    async whitelistAdd(reply, jid, mentioned, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        if (!mentioned?.[0]) return reply('📌 Usage: *.whitelistadd @tag*\n\nMember will bypass all anti-link, anti-caps, and spam filters.');
        const ok = addWhitelist(jid, mentioned[0]);
        await reply(ok ? `✅ @${jidNum(mentioned[0])} added to protection whitelist.` : `ℹ️ @${jidNum(mentioned[0])} is already on the whitelist.`);
    },

    async whitelistDel(reply, jid, mentioned, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        if (!mentioned?.[0]) return reply('📌 Usage: *.whitelistdel @tag*');
        const ok = removeWhitelist(jid, mentioned[0]);
        await reply(ok ? `✅ @${jidNum(mentioned[0])} removed from protection whitelist.` : 'ℹ️ Member is not on the whitelist.');
    },

    async whitelistShow(reply, jid, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const list = listWhitelist(jid);
        if (!list.length) return reply('ℹ️ Protection whitelist is currently empty in this group.');
        await reply(`📋 *PROTECTION WHITELIST*\n━━━━━━━━━━━━━━━━━━\n${list.map((id, i) => `${i + 1}. @${jidNum(id)}`).join('\n')}`);
    },

    // ═══════════════════════════════════════════════════════════════
    //  CUSTOM BANNED WORDS
    // ═══════════════════════════════════════════════════════════════
    async addBadWordCmd(reply, jid, args, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const word = args.join(' ').trim();
        if (!word) return reply('📌 Usage: *.addbadword [word]*\n\nThis word will be filtered when .antitoxic is on.');
        const ok = addCustomBadWord(jid, word);
        await reply(ok ? `✅ Word "${word}" added to group banned list.` : 'ℹ️ Word is already on the banned list.');
    },

    async delBadWordCmd(reply, jid, args, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const word = args.join(' ').trim();
        if (!word) return reply('📌 Usage: *.delbadword [word]*');
        const ok = removeCustomBadWord(jid, word);
        await reply(ok ? `✅ Word "${word}" removed from banned list.` : 'ℹ️ Word not found on custom banned list.');
    },

    async listBadWordCmd(reply, jid, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const list = getCustomBadWords(jid);
        if (!list.length) return reply('ℹ️ No custom banned words configured yet.');
        await reply(`📋 *CUSTOM BANNED WORDS*\n━━━━━━━━━━━━━━━━━━\n${list.map((w, i) => `${i + 1}. ${w}`).join('\n')}`);
    },

    // ═══════════════════════════════════════════════════════════════
    //  LINK ALLOWLIST
    // ═══════════════════════════════════════════════════════════════
    async allowLinkAdd(reply, jid, args, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const domain = (args[0] || '').trim();
        if (!domain) return reply('📌 Usage: *.allowlinkadd youtube.com*\n\nLinks from this domain will bypass .antilink.');
        const ok = addAllowLink(jid, domain);
        await reply(ok ? `✅ Domain "${domain}" added to Anti-Link allowlist.` : 'ℹ️ Domain is already allowlisted.');
    },

    async allowLinkDel(reply, jid, args, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const domain = (args[0] || '').trim();
        if (!domain) return reply('📌 Usage: *.allowlinkdel youtube.com*');
        const ok = removeAllowLink(jid, domain);
        await reply(ok ? `✅ Domain "${domain}" removed from allowlist.` : 'ℹ️ Domain not found on allowlist.');
    },

    async allowLinkShow(reply, jid, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const list = listAllowLink(jid);
        if (!list.length) return reply('ℹ️ No domains are currently allowlisted from Anti-Link.');
        await reply(`📋 *ANTI-LINK ALLOWLIST*\n━━━━━━━━━━━━━━━━━━\n${list.map((d, i) => `${i + 1}. ${d}`).join('\n')}`);
    },

    // ═══════════════════════════════════════════════════════════════
    //  INDIVIDUAL MEMBER MUTE
    // ═══════════════════════════════════════════════════════════════
    async muteMemberCmd(reply, jid, mentioned, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        if (!mentioned?.[0]) return reply('📌 Usage: *.mutemember @tag*\n\nMessages from this member will be auto-deleted without muting the entire group.');
        muteMemberOn(jid, mentioned[0]);
        await reply(`🔇 @${jidNum(mentioned[0])} has been muted (messages will be deleted automatically).`);
    },

    async unmuteMemberCmd(reply, jid, mentioned, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        if (!mentioned?.[0]) return reply('📌 Usage: *.unmutemember @tag*');
        muteMemberOff(jid, mentioned[0]);
        await reply(`🔊 @${jidNum(mentioned[0])} has been unmuted.`);
    },

    async listMutedMemberCmd(reply, jid, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const list = listMutedMembers(jid);
        if (!list.length) return reply('ℹ️ No individual members are muted in this group.');
        await reply(`🔇 *INDIVIDUALLY MUTED MEMBERS*\n━━━━━━━━━━━━━━━━━━\n${list.map((id, i) => `${i + 1}. @${jidNum(id)}`).join('\n')}`);
    },

    // ═══════════════════════════════════════════════════════════════
    //  JOIN REQUEST APPROVALS
    // ═══════════════════════════════════════════════════════════════
    async listJoinRequests(sock, reply, jid, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        try {
            const list = await sock.groupRequestParticipantsList(jid);
            if (!list?.length) return reply('✅ No pending join requests in this group.');
            const lines = list.map((r, i) => `${i + 1}. @${jidNum(r.jid || r.id)}`).join('\n');
            await reply(`📥 *PENDING JOIN REQUESTS* (${list.length})\n━━━━━━━━━━━━━━━━━━\n${lines}\n━━━━━━━━━━━━━━━━━━\n💡 *.approverequest 923xxx* / *.rejectrequest 923xxx*\n💡 *.approveall* / *.rejectall* for bulk actions`);
        } catch {
            await reply('❌ Failed to fetch join requests.\n_(Ensure "Approve new participants" is enabled in WhatsApp group settings and bot is admin)_');
        }
    },

    async approveJoinRequest(sock, reply, jid, args, mentioned, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const target = resolveTargetJid(args, mentioned);
        if (!target) return reply('📌 Usage: *.approverequest 923xxx* (or reply/tag user)');
        try {
            await sock.groupRequestParticipantsUpdate(jid, [target], 'approve');
            await reply(`✅ Join request from @${jidNum(target)} approved.`);
        } catch {
            await reply('❌ Failed to approve request (may no longer be pending).');
        }
    },

    async rejectJoinRequest(sock, reply, jid, args, mentioned, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const target = resolveTargetJid(args, mentioned);
        if (!target) return reply('📌 Usage: *.rejectrequest 923xxx* (or reply/tag user)');
        try {
            await sock.groupRequestParticipantsUpdate(jid, [target], 'reject');
            await reply(`✅ Join request from @${jidNum(target)} rejected.`);
        } catch {
            await reply('❌ Failed to reject request (may no longer be pending).');
        }
    },

    async approveAllRequests(sock, reply, jid, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        try {
            const list = await sock.groupRequestParticipantsList(jid);
            if (!list?.length) return reply('✅ No pending join requests found.');
            await sock.groupRequestParticipantsUpdate(jid, list.map(r => r.jid || r.id), 'approve');
            await reply(`✅ All ${list.length} join requests approved successfully.`);
        } catch {
            await reply('❌ Failed to approve all requests.');
        }
    },

    async rejectAllRequests(sock, reply, jid, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        try {
            const list = await sock.groupRequestParticipantsList(jid);
            if (!list?.length) return reply('✅ No pending join requests found.');
            await sock.groupRequestParticipantsUpdate(jid, list.map(r => r.jid || r.id), 'reject');
            await reply(`✅ All ${list.length} join requests rejected.`);
        } catch {
            await reply('❌ Failed to reject all requests.');
        }
    },

    // ═══════════════════════════════════════════════════════════════
    //  AUTOMATED GROUP SCHEDULING (OPEN / CLOSE)
    // ═══════════════════════════════════════════════════════════════
    async setOpenSchedule(reply, jid, args, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const time = args[0];
        if (!time || !/^\d{1,2}:\d{2}$/.test(time)) return reply('📌 Usage: *.jadwalbuka 07:00* (24h format HH:MM)');
        updateGroupSettings(jid, { openTime: time });
        await reply(`✅ Group will automatically OPEN daily at *${time}*.\n\n_Ensure bot remains online for schedule execution._`);
    },

    async setCloseSchedule(reply, jid, args, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const time = args[0];
        if (!time || !/^\d{1,2}:\d{2}$/.test(time)) return reply('📌 Usage: *.jadwaltutup 22:00* (24h format HH:MM)');
        updateGroupSettings(jid, { closeTime: time });
        await reply(`✅ Group will automatically CLOSE daily at *${time}*.\n\n_Ensure bot remains online for schedule execution._`);
    },

    async cancelSchedule(reply, jid, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        updateGroupSettings(jid, { openTime: null, closeTime: null });
        await reply('✅ Group auto open/close schedules cancelled.');
    },

    async checkScheduleStatus(reply, jid) {
        const s = getGroupSettings(jid);
        if (!s.openTime && !s.closeTime) {
            return reply('ℹ️ No automated schedules configured for this group.\n\nSet with *.jadwalbuka* / *.jadwaltutup*.');
        }
        await reply(`⏰ *AUTOMATED GROUP SCHEDULES*\n\n🔓 Open  : ${s.openTime || '- (not set)'}\n🔒 Close : ${s.closeTime || '- (not set)'}`);
    },

    // ═══════════════════════════════════════════════════════════════
    //  NATIVE WHATSAPP GROUP CONFIGURATION
    // ═══════════════════════════════════════════════════════════════
    async setGroupIcon(sock, reply, msg, jid, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const ctxInfo = msg.message?.extendedTextMessage?.contextInfo;
        const quotedMessage = ctxInfo?.quotedMessage;
        let targetMsg = null;
        if (quotedMessage?.imageMessage) {
            targetMsg = { key: { remoteJid: jid, id: ctxInfo.stanzaId, participant: ctxInfo.participant }, message: quotedMessage };
        } else if (msg.message?.imageMessage) {
            targetMsg = msg;
        }
        if (!targetMsg) return reply('📌 Send an image with caption *.seticon*, or reply to an image with *.seticon*.');

        try {
            const { downloadMediaMessage } = await import('@whiskeysockets/baileys');
            const buffer = await downloadMediaMessage(targetMsg, 'buffer', {});
            await sock.updateProfilePicture(jid, buffer);
            await reply('✅ Group profile picture updated successfully!');
        } catch {
            await reply('❌ Failed to update group profile picture. Ensure bot is admin & image is valid.');
        }
    },

    async removeGroupIcon(sock, reply, jid, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        try {
            await sock.removeProfilePicture(jid);
            await reply('✅ Group profile picture removed successfully.');
        } catch {
            await reply('❌ Failed to remove group profile picture.');
        }
    },

    async lockGroupInfo(sock, reply, jid, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        try {
            await sock.groupSettingUpdate(jid, 'locked');
            await reply('🔒 Group info locked — only admins can edit group name, icon, or description.');
        } catch {
            await reply('❌ Failed to lock group info.');
        }
    },

    async unlockGroupInfo(sock, reply, jid, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        try {
            await sock.groupSettingUpdate(jid, 'unlocked');
            await reply('🔓 Group info unlocked — all members can edit group name, icon, and description.');
        } catch {
            await reply('❌ Failed to unlock group info.');
        }
    },

    async setEphemeral(sock, reply, jid, args, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const map = { off: 0, '24h': 86400, '1d': 86400, '7d': 604800, '90d': 7776000 };
        const key = (args[0] || '').toLowerCase();
        const seconds = map[key];
        if (seconds === undefined) return reply('📌 Usage: *.ephemeral off/1d/7d/90d*\n\n(Configures disappearing messages timer)');
        try {
            await sock.groupToggleEphemeral(jid, seconds);
            await reply(seconds === 0 ? '✅ Disappearing messages deactivated.' : `✅ Disappearing messages enabled: messages will expire after *${key}*.`);
        } catch {
            await reply('❌ Failed to update disappearing messages.');
        }
    },
};
