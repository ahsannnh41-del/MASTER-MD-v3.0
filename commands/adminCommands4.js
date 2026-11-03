// ═══════════════════════════════════════════════════════════════════
//  ADMINCOMMANDS4.JS — Perluasan Fitur Admin (v3.1.0)
//  Member management lanjutan · Konfigurasi grup native WhatsApp
//  Jadwal buka/tutup otomatis · Approval join request · Dashboard grup
//  Whitelist/Custom bad-word/Link allowlist/Mute per-member (wrapper)
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
        reply('❌ Hanya admin grup yang bisa menggunakan perintah ini!');
        return false;
    }
    return true;
}

// Ambil semua member NON-admin di satu grup, TIDAK termasuk bot sendiri
// ATAUPUN Owner/Creator bot (safety-net supaya .kickall/.warnall tidak
// pernah menyasar pemilik bot walau kebetulan bukan admin di grup itu).
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
    //  MEMBER MANAGEMENT LANJUTAN
    // ═══════════════════════════════════════════════════════════════
    async kickAll(sock, reply, msg, jid, isAdmin, args) {
        if (!isAdminCheck(isAdmin, reply)) return;
        if ((args[0] || '').toLowerCase() !== 'yakin') {
            return reply('⚠️ *PERINGATAN!*\n\nPerintah ini akan mengeluarkan SEMUA member non-admin dari grup ini secara permanen!\n\nKalau yakin, ketik:\n*.kickall yakin*');
        }
        let targets = [];
        try { targets = await getNonAdminMembers(sock, jid); } catch { return reply('❌ Gagal mengambil data member grup.'); }
        if (!targets.length) return reply('ℹ️ Tidak ada member non-admin untuk dikeluarkan.');
        await reply(`⏳ Mengeluarkan ${targets.length} member non-admin...`);
        await adminCommands.kickMember(sock, reply, msg, jid, targets, isAdmin);
    },

    async warnAll(sock, reply, msg, jid, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        let targets = [];
        try { targets = await getNonAdminMembers(sock, jid); } catch { return reply('❌ Gagal mengambil data member grup.'); }
        if (!targets.length) return reply('ℹ️ Tidak ada member non-admin untuk diberi warn.');
        await adminCommands.warnMember(sock, reply, msg, jid, targets, isAdmin);
    },

    async listWarnAll(reply, jid) {
        const list = getGroupWarns(jid);
        if (!list.length) return reply('✅ Tidak ada member dengan peringatan di grup ini.');
        const lines = list.map((w, i) => `${i + 1}. @${jidNum(w.sender)} — ${w.count}x`).join('\n');
        await reply(`⚠️ *DAFTAR WARN GRUP INI*\n━━━━━━━━━━━━━━━━━━\n${lines}`);
    },

    async topWarn(reply, jid) {
        const list = getGroupWarns(jid).slice(0, 5);
        if (!list.length) return reply('✅ Belum ada member dengan peringatan di grup ini.');
        const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
        const lines = list.map((w, i) => `${medals[i] || `${i + 1}.`} @${jidNum(w.sender)} — ${w.count}x warn`).join('\n');
        await reply(`🏆 *TOP WARN GRUP INI*\n━━━━━━━━━━━━━━━━━━\n${lines}`);
    },

    async resetWarnAllCmd(reply, jid, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const cleared = resetGroupWarns(jid);
        await reply(cleared ? `✅ Data warn ${cleared} member berhasil direset.` : 'ℹ️ Tidak ada data warn untuk direset.');
    },

    // ═══════════════════════════════════════════════════════════════
    //  INFO / DASHBOARD GRUP
    // ═══════════════════════════════════════════════════════════════
    async checkBotAdmin(sock, reply, jid) {
        try {
            const metadata = await sock.groupMetadata(jid);
            const botNum   = sock.user?.jid?.split('@')[0]?.split(':')[0];
            const me       = metadata.participants.find(p => jidNum(p.id) === botNum);
            const isBotAdmin = me?.admin === 'admin' || me?.admin === 'superadmin';
            await reply(isBotAdmin
                ? '✅ *Bot adalah ADMIN* di grup ini — semua fitur admin (kick/mute/lock/dll) bisa berjalan penuh.'
                : '❌ *Bot BUKAN admin* di grup ini — fitur seperti kick/mute/lock/hapus pesan TIDAK akan berfungsi.\n\n💡 Jadikan bot admin dulu lewat pengaturan grup WhatsApp.');
        } catch {
            await reply('❌ Gagal mengecek status bot di grup ini.');
        }
    },

    async groupLockStatus(reply, jid) {
        const s = getGroupSettings(jid);
        const lockedTypes = getLockedTypes(jid);
        const flag = v => v ? '✅' : '❌';
        await reply(
`🛡️ *STATUS PROTEKSI LENGKAP*
━━━━━━━━━━━━━━━━━━
${flag(s.antigb)} Anti-GB
${flag(s.antilink)} Anti-Link
${flag(s.antishortlink)} Anti-ShortLink
${flag(s.antilinkphising)} Anti-Link-Phising
${flag(s.antispam)} Anti-Spam _(+ Anti-Flood)_
${flag(s.antitoxic)} Anti-Toxic
${flag(s.antijudol)} Anti-Judol
${flag(s.antipinjol)} Anti-Pinjol
${flag(s.anticaps)} Anti-Caps
${flag(s.antivirtex)} Anti-Virtex
${flag(s.antitag)} Anti-Tag
${flag(s.antinsfw)} Anti-NSFW _(foto/video/stiker dewasa)_
━━━━━━━━━━━━━━━━━━
🔒 *Lock aktif:* ${lockedTypes.length ? lockedTypes.join(', ') : 'tidak ada'}
━━━━━━━━━━━━━━━━━━
💡 *.helpproteksi* — cheatsheet semua command proteksi`
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
            const schedule = (s.openTime || s.closeTime) ? `${s.openTime || '-'} → ${s.closeTime || '-'}` : 'tidak diatur';
            await reply(
`📊 *DASHBOARD GRUP*
_${metadata.subject}_
━━━━━━━━━━━━━━━━━━
👥 Member      : ${metadata.participants.length}
👑 Admin       : ${admins}
⚠️ Warn aktif  : ${warns} member
🛡️ Proteksi    : ${onCount}/${ALL_PROTECTION_KEYS.length} aktif
🔒 Lock aktif  : ${locked}
⏰ Jadwal      : ${schedule}
━━━━━━━━━━━━━━━━━━
💡 *.grouplockstatus* — detail proteksi
💡 *.groupinfo* — info dasar grup`
            );
        } catch {
            await reply('❌ Gagal mengambil ringkasan grup.');
        }
    },

    async groupAge(sock, reply, jid) {
        try {
            const metadata = await sock.groupMetadata(jid);
            if (!metadata.creation) return reply('ℹ️ Info tanggal pembuatan grup tidak tersedia dari WhatsApp.');
            const createdMs = metadata.creation * 1000;
            const tanggal = new Date(createdMs).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
            await reply(`📅 *UMUR GRUP*\n\nDibuat: ${tanggal}\nUmur: ${fmtDuration(Date.now() - createdMs)}`);
        } catch {
            await reply('❌ Gagal mengambil umur grup.');
        }
    },

    async adminCount(sock, reply, jid) {
        try {
            const metadata = await sock.groupMetadata(jid);
            const admins = metadata.participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin');
            await reply(`👑 Jumlah admin grup ini: *${admins.length}* dari ${metadata.participants.length} member.`);
        } catch {
            await reply('❌ Gagal mengambil data admin grup.');
        }
    },

    async groupCreatorInfo(sock, reply, jid) {
        try {
            const metadata = await sock.groupMetadata(jid);
            const owner = metadata.owner || metadata.subjectOwner || null;
            if (!owner) return reply('ℹ️ Info pembuat grup tidak tersedia (biasanya untuk grup yang sudah cukup lama).');
            await reply(`👤 Grup ini dibuat oleh: @${jidNum(owner)}`);
        } catch {
            await reply('❌ Gagal mengambil info pembuat grup.');
        }
    },

    async exportMember(sock, reply, jid) {
        try {
            const metadata = await sock.groupMetadata(jid);
            const lines = metadata.participants.map((p, i) => `${i + 1}. ${jidNum(p.id)}${p.admin ? ' (admin)' : ''}`).join('\n');
            const text = `📋 *DATA MEMBER GRUP*\n_${metadata.subject}_ — Total: ${metadata.participants.length}\n━━━━━━━━━━━━━━━━━━\n${lines}`;
            await reply(safeReplyText(text));
        } catch {
            await reply('❌ Gagal mengambil data member grup.');
        }
    },

    // ═══════════════════════════════════════════════════════════════
    //  BACKUP / RESTORE PENGATURAN GRUP
    // ═══════════════════════════════════════════════════════════════
    async backupSetting(reply, jid, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const backups = store('groupSettingBackup', {});
        backups[jid] = { ...getGroupSettings(jid) };
        save('groupSettingBackup');
        await reply('✅ Pengaturan grup ini (semua toggle proteksi & konfigurasi) berhasil di-backup.\n\n💡 Pakai *.restoresetting* untuk mengembalikannya kapan saja.');
    },

    async restoreSetting(reply, jid, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const backups = store('groupSettingBackup', {});
        const snapshot = backups[jid];
        if (!snapshot) return reply('❌ Belum ada backup pengaturan untuk grup ini. Pakai *.backupsetting* dulu.');
        updateGroupSettings(jid, snapshot);
        await reply('✅ Pengaturan grup berhasil dikembalikan dari backup terakhir.');
    },

    // ═══════════════════════════════════════════════════════════════
    //  BUNDLE TOGGLE (aktifkan/nonaktifkan banyak proteksi sekaligus)
    // ═══════════════════════════════════════════════════════════════
    async resetProtectionAll(reply, jid, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const patch = {};
        for (const k of ALL_PROTECTION_KEYS) patch[k] = false;
        updateGroupSettings(jid, patch);
        await reply('✅ Semua proteksi konten telah dinonaktifkan.');
    },

    async setAntiLinkAll(reply, jid, args, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const status = (args[0] || '').toLowerCase();
        if (status !== 'on' && status !== 'off') {
            return reply('📌 Cara pakai: *.antilinkall on/off*\n\nMengaktifkan/menonaktifkan Anti-GB + Anti-Link + Anti-ShortLink + Anti-Link-Phising sekaligus.');
        }
        const on = status === 'on';
        updateGroupSettings(jid, { antigb: on, antilink: on, antishortlink: on, antilinkphising: on });
        await reply(on
            ? '✅ Semua proteksi link (Anti-GB, Anti-Link, Anti-ShortLink, Anti-Link-Phising) diaktifkan sekaligus.'
            : '❌ Semua proteksi link dinonaktifkan sekaligus.');
    },

    async helpProteksi(reply) {
        await reply(
`🛡️ *CHEATSHEET PROTEKSI GRUP*
━━━━━━━━━━━━━━━━━━
.antigb on/off — link grup WA
.antilink on/off — semua link
.antishortlink on/off — link pemendek
.antilinkphising on/off — link/pola phising
.antijudol on/off — promosi judi online
.antipinjol on/off — promosi pinjol ilegal
.anticaps on/off — HURUF KAPITAL berlebihan
.antivirtex on/off — teks virus/zalgo
.antitag on/off — spam mention massal
.antispam on/off — spam pesan (+ anti-flood)
.antitoxic on/off — kata kasar
.antinsfw on/off — foto/video/stiker dewasa (auto-hapus)
.hapusnsfw — reply media, hapus manual + strike (tidak butuh API)
.cekstrikensfw @tag — cek jumlah strike NSFW member
.resetnsfwstrike @tag — reset strike NSFW member
.setnsfwlimit [angka] — atur batas strike sebelum auto-kick
━━━━━━━━━━━━━━━━━━
💡 .resetprotection — matikan semua sekaligus
💡 .grouplockstatus — lihat status detail
━━━━━━━━━━━━━━━━━━`
        );
    },

    // ═══════════════════════════════════════════════════════════════
    //  WHITELIST PROTEKSI (bebas dari proteksi baru di atas)
    // ═══════════════════════════════════════════════════════════════
    async whitelistAdd(reply, jid, mentioned, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        if (!mentioned?.[0]) return reply('📌 Cara pakai: *.whitelistadd @tag*\n\nMember ini akan bebas dari anti-judol/pinjol/caps/virtex/tag/link-phising/nsfw.');
        const ok = addWhitelist(jid, mentioned[0]);
        await reply(ok ? `✅ @${jidNum(mentioned[0])} ditambahkan ke whitelist proteksi.` : `ℹ️ @${jidNum(mentioned[0])} sudah ada di whitelist.`);
    },

    async whitelistDel(reply, jid, mentioned, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        if (!mentioned?.[0]) return reply('📌 Cara pakai: *.whitelistdel @tag*');
        const ok = removeWhitelist(jid, mentioned[0]);
        await reply(ok ? `✅ @${jidNum(mentioned[0])} dihapus dari whitelist.` : 'ℹ️ Member itu tidak ada di whitelist.');
    },

    async whitelistShow(reply, jid, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const list = listWhitelist(jid);
        if (!list.length) return reply('ℹ️ Belum ada member di whitelist proteksi grup ini.');
        await reply(`📋 *WHITELIST PROTEKSI*\n━━━━━━━━━━━━━━━━━━\n${list.map((id, i) => `${i + 1}. @${jidNum(id)}`).join('\n')}`);
    },

    // ═══════════════════════════════════════════════════════════════
    //  CUSTOM BAD-WORD (perluasan .antitoxic per-grup)
    // ═══════════════════════════════════════════════════════════════
    async addBadWordCmd(reply, jid, args, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const word = args.join(' ').trim();
        if (!word) return reply('📌 Cara pakai: *.addbadword [kata]*\n\nKata ini akan ikut terdeteksi oleh .antitoxic.');
        const ok = addCustomBadWord(jid, word);
        await reply(ok ? `✅ Kata "${word}" ditambahkan ke daftar kata terlarang grup ini.` : 'ℹ️ Kata itu sudah ada di daftar.');
    },

    async delBadWordCmd(reply, jid, args, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const word = args.join(' ').trim();
        if (!word) return reply('📌 Cara pakai: *.delbadword [kata]*');
        const ok = removeCustomBadWord(jid, word);
        await reply(ok ? `✅ Kata "${word}" dihapus dari daftar.` : 'ℹ️ Kata itu tidak ada di daftar custom.');
    },

    async listBadWordCmd(reply, jid, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const list = getCustomBadWords(jid);
        if (!list.length) return reply('ℹ️ Belum ada kata custom ditambahkan. Kata bawaan tetap aktif kalau .antitoxic on.');
        await reply(`📋 *KATA TERLARANG CUSTOM*\n━━━━━━━━━━━━━━━━━━\n${list.map((w, i) => `${i + 1}. ${w}`).join('\n')}`);
    },

    // ═══════════════════════════════════════════════════════════════
    //  LINK ALLOWLIST (pengecualian untuk .antilink)
    // ═══════════════════════════════════════════════════════════════
    async allowLinkAdd(reply, jid, args, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const domain = (args[0] || '').trim();
        if (!domain) return reply('📌 Cara pakai: *.allowlinkadd youtube.com*\n\nLink dari domain ini akan lolos dari .antilink.');
        const ok = addAllowLink(jid, domain);
        await reply(ok ? `✅ Domain "${domain}" ditambahkan ke pengecualian Anti-Link.` : 'ℹ️ Domain itu sudah ada di daftar.');
    },

    async allowLinkDel(reply, jid, args, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const domain = (args[0] || '').trim();
        if (!domain) return reply('📌 Cara pakai: *.allowlinkdel youtube.com*');
        const ok = removeAllowLink(jid, domain);
        await reply(ok ? `✅ Domain "${domain}" dihapus dari pengecualian.` : 'ℹ️ Domain itu tidak ada di daftar.');
    },

    async allowLinkShow(reply, jid, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const list = listAllowLink(jid);
        if (!list.length) return reply('ℹ️ Belum ada domain yang dikecualikan dari Anti-Link.');
        await reply(`📋 *DOMAIN DIKECUALIKAN DARI ANTI-LINK*\n━━━━━━━━━━━━━━━━━━\n${list.map((d, i) => `${i + 1}. ${d}`).join('\n')}`);
    },

    // ═══════════════════════════════════════════════════════════════
    //  MUTE PER-MEMBER (beda dari .mute yang membisukan SELURUH grup)
    // ═══════════════════════════════════════════════════════════════
    async muteMemberCmd(reply, jid, mentioned, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        if (!mentioned?.[0]) return reply('📌 Cara pakai: *.mutemember @tag*\n\nPesan dari member ini akan otomatis dihapus, TANPA membisukan grup lainnya.');
        muteMemberOn(jid, mentioned[0]);
        await reply(`🔇 @${jidNum(mentioned[0])} sekarang dibisukan (pesannya akan otomatis dihapus).`);
    },

    async unmuteMemberCmd(reply, jid, mentioned, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        if (!mentioned?.[0]) return reply('📌 Cara pakai: *.unmutemember @tag*');
        muteMemberOff(jid, mentioned[0]);
        await reply(`🔊 @${jidNum(mentioned[0])} sudah tidak dibisukan lagi.`);
    },

    async listMutedMemberCmd(reply, jid, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const list = listMutedMembers(jid);
        if (!list.length) return reply('ℹ️ Tidak ada member yang dibisukan individual di grup ini.');
        await reply(`🔇 *MEMBER DIBISUKAN INDIVIDUAL*\n━━━━━━━━━━━━━━━━━━\n${list.map((id, i) => `${i + 1}. @${jidNum(id)}`).join('\n')}`);
    },

    // ═══════════════════════════════════════════════════════════════
    //  APPROVAL JOIN REQUEST (mode "Perlu Persetujuan Admin" WhatsApp)
    // ═══════════════════════════════════════════════════════════════
    async listJoinRequests(sock, reply, jid, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        try {
            const list = await sock.groupRequestParticipantsList(jid);
            if (!list?.length) return reply('✅ Tidak ada permintaan join yang menunggu di grup ini.');
            const lines = list.map((r, i) => `${i + 1}. @${jidNum(r.jid || r.id)}`).join('\n');
            await reply(`📥 *PERMINTAAN JOIN MENUNGGU* (${list.length})\n━━━━━━━━━━━━━━━━━━\n${lines}\n━━━━━━━━━━━━━━━━━━\n💡 *.approverequest 62xxx* / *.rejectrequest 62xxx*\n💡 *.approveall* / *.rejectall* untuk semua sekaligus`);
        } catch {
            await reply('❌ Gagal mengambil daftar permintaan join.\n_(pastikan mode "Perlu Persetujuan Admin" aktif di pengaturan grup WhatsApp, dan bot adalah admin)_');
        }
    },

    async approveJoinRequest(sock, reply, jid, args, mentioned, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const target = resolveTargetJid(args, mentioned);
        if (!target) return reply('📌 Cara pakai: *.approverequest 62xxx* (atau reply/tag orangnya)');
        try {
            await sock.groupRequestParticipantsUpdate(jid, [target], 'approve');
            await reply(`✅ Permintaan join dari @${jidNum(target)} diterima.`);
        } catch {
            await reply('❌ Gagal menerima permintaan (mungkin sudah tidak pending lagi).');
        }
    },

    async rejectJoinRequest(sock, reply, jid, args, mentioned, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const target = resolveTargetJid(args, mentioned);
        if (!target) return reply('📌 Cara pakai: *.rejectrequest 62xxx* (atau reply/tag orangnya)');
        try {
            await sock.groupRequestParticipantsUpdate(jid, [target], 'reject');
            await reply(`✅ Permintaan join dari @${jidNum(target)} ditolak.`);
        } catch {
            await reply('❌ Gagal menolak permintaan (mungkin sudah tidak pending lagi).');
        }
    },

    async approveAllRequests(sock, reply, jid, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        try {
            const list = await sock.groupRequestParticipantsList(jid);
            if (!list?.length) return reply('✅ Tidak ada permintaan join yang menunggu.');
            await sock.groupRequestParticipantsUpdate(jid, list.map(r => r.jid || r.id), 'approve');
            await reply(`✅ ${list.length} permintaan join berhasil diterima semua.`);
        } catch {
            await reply('❌ Gagal menerima semua permintaan join.');
        }
    },

    async rejectAllRequests(sock, reply, jid, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        try {
            const list = await sock.groupRequestParticipantsList(jid);
            if (!list?.length) return reply('✅ Tidak ada permintaan join yang menunggu.');
            await sock.groupRequestParticipantsUpdate(jid, list.map(r => r.jid || r.id), 'reject');
            await reply(`✅ ${list.length} permintaan join berhasil ditolak semua.`);
        } catch {
            await reply('❌ Gagal menolak semua permintaan join.');
        }
    },

    // ═══════════════════════════════════════════════════════════════
    //  JADWAL BUKA/TUTUP GRUP OTOMATIS (dieksekusi oleh lib/groupScheduler.js)
    // ═══════════════════════════════════════════════════════════════
    async setOpenSchedule(reply, jid, args, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const time = args[0];
        if (!time || !/^\d{1,2}:\d{2}$/.test(time)) return reply('📌 Cara pakai: *.jadwalbuka 07:00* (format 24 jam)');
        updateGroupSettings(jid, { openTime: time });
        await reply(`✅ Grup akan otomatis DIBUKA setiap hari jam *${time}*.\n\n_Pastikan bot tetap online supaya jadwal ini berjalan._`);
    },

    async setCloseSchedule(reply, jid, args, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const time = args[0];
        if (!time || !/^\d{1,2}:\d{2}$/.test(time)) return reply('📌 Cara pakai: *.jadwaltutup 22:00* (format 24 jam)');
        updateGroupSettings(jid, { closeTime: time });
        await reply(`✅ Grup akan otomatis DITUTUP setiap hari jam *${time}*.\n\n_Pastikan bot tetap online supaya jadwal ini berjalan._`);
    },

    async cancelSchedule(reply, jid, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        updateGroupSettings(jid, { openTime: null, closeTime: null });
        await reply('✅ Jadwal buka/tutup otomatis grup ini dibatalkan.');
    },

    async checkScheduleStatus(reply, jid) {
        const s = getGroupSettings(jid);
        if (!s.openTime && !s.closeTime) {
            return reply('ℹ️ Belum ada jadwal buka/tutup otomatis untuk grup ini.\n\nAtur lewat *.jadwalbuka* / *.jadwaltutup*.');
        }
        await reply(`⏰ *JADWAL OTOMATIS GRUP INI*\n\n🔓 Buka  : ${s.openTime || '- (tidak diatur)'}\n🔒 Tutup : ${s.closeTime || '- (tidak diatur)'}`);
    },

    // ═══════════════════════════════════════════════════════════════
    //  KONFIGURASI NATIVE GRUP WHATSAPP LAINNYA
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
        if (!targetMsg) return reply('📌 Kirim gambar dengan caption *.seticon*, atau reply sebuah gambar lalu ketik *.seticon*.');

        try {
            const { downloadMediaMessage } = await import('@whiskeysockets/baileys');
            const buffer = await downloadMediaMessage(targetMsg, 'buffer', {});
            await sock.updateProfilePicture(jid, buffer);
            await reply('✅ Foto profil grup berhasil diubah!');
        } catch {
            await reply('❌ Gagal mengubah foto profil grup. Pastikan bot adalah admin & gambar valid (JPG/PNG).');
        }
    },

    async removeGroupIcon(sock, reply, jid, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        try {
            await sock.removeProfilePicture(jid);
            await reply('✅ Foto profil grup berhasil dihapus.');
        } catch {
            await reply('❌ Gagal menghapus foto profil grup.');
        }
    },

    async lockGroupInfo(sock, reply, jid, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        try {
            await sock.groupSettingUpdate(jid, 'locked');
            await reply('🔒 Info grup dikunci — hanya admin yang bisa ubah nama/ikon/deskripsi grup.');
        } catch {
            await reply('❌ Gagal mengunci info grup.');
        }
    },

    async unlockGroupInfo(sock, reply, jid, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        try {
            await sock.groupSettingUpdate(jid, 'unlocked');
            await reply('🔓 Info grup dibuka — semua member bisa ubah nama/ikon/deskripsi grup.');
        } catch {
            await reply('❌ Gagal membuka info grup.');
        }
    },

    async setEphemeral(sock, reply, jid, args, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const map = { off: 0, '24h': 86400, '1d': 86400, '7d': 604800, '90d': 7776000 };
        const key = (args[0] || '').toLowerCase();
        const seconds = map[key];
        if (seconds === undefined) return reply('📌 Cara pakai: *.ephemeral off/1d/7d/90d*\n\n(pesan sementara / disappearing messages)');
        try {
            await sock.groupToggleEphemeral(jid, seconds);
            await reply(seconds === 0 ? '✅ Pesan sementara dinonaktifkan.' : `✅ Pesan sementara diaktifkan: pesan otomatis hilang setelah *${key}*.`);
        } catch {
            await reply('❌ Gagal mengatur pesan sementara.');
        }
    },
};
