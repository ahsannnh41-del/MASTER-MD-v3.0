// ═══════════════════════════════════════════════════════════════════
//  PANELCOMMANDS.JS — Command-command fitur .cpanel (jualan slot
//  server Pterodactyl). Backend/logic murni ada di
//  lib/pterodactylReseller.js — file ini isinya HANDLER command yang
//  dipanggil dari commands/index.js (pola sama seperti
//  adminCommands.js dkk).
// ═══════════════════════════════════════════════════════════════════
//  Adaptasi dari referensi eksternal, ditulis ulang menyesuaikan
//  arsitektur bot ini (ctx-based, pakai lib/db.js untuk penyimpanan,
//  tanpa dependency/branding dari SC asalnya).
//
//  CATATAN: fitur ini butuh axios (sudah ada di dependencies? cek
//  package.json — kalau belum ada, jalankan `npm install axios` di
//  server sebelum start bot).
// ═══════════════════════════════════════════════════════════════════

import crypto from 'crypto';
import {
    VALID_SERVERS, VALID_ROLES, RAM_TIERS, RAM_SPECS,
    getUserRole, hasFullAccess, hasAccessToServer, canManageRole,
    addRole, removeRole, listByRole,
    setGcSeller, getGcSeller, isGcSeller,
    checkCreationCooldown, markCreationUsed, formatDuration,
    getServerConfig, validateServerConfig, getAvailableServers,
    createPterodactylUser, createPterodactylServer,
    listPterodactylServers, getPterodactylServer, deletePterodactylServer,
    formatBytes,
} from '../lib/pterodactylReseller.js';

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

// Ambil nomor target dari (urut prioritas): reply/quote, mention, atau
// argumen teks. Dipakai command role-management (add/del owner dkk).
function extractTargetNumber(ctx) {
    const quotedParticipant = ctx.msg.message?.extendedTextMessage?.contextInfo?.participant;
    if (quotedParticipant) return quotedParticipant.split('@')[0].split(':')[0];
    if (ctx.mentioned?.length) return ctx.mentioned[0].split('@')[0].split(':')[0];
    if (ctx.args?.[0]) {
        let n = ctx.args[0].replace(/[^0-9]/g, '');
        if (n.startsWith('08')) n = '62' + n.slice(1);
        return n;
    }
    return null;
}

function friendlyApiError(err) {
    const raw = err?.response?.data?.errors?.[0]?.detail || err?.response?.data?.message || err.message || 'Error tidak diketahui';
    const map = {
        'has already been taken': 'Username/email itu sudah dipakai — coba username lain.',
        'could not find': 'Egg atau nest tidak ditemukan — cek egg/nestid di setting.js.',
        'no suitable allocation': 'Tidak ada port tersedia di server itu — hubungi admin panel.',
        'unauthorized': 'API key tidak punya izin cukup — buat API key baru dengan semua permission dicentang.',
    };
    const hit = Object.entries(map).find(([k]) => raw.toLowerCase().includes(k));
    return hit ? hit[1] : raw;
}

function missingConfigReply(version) {
    const available = getAvailableServers();
    let txt = `⚠️ *Server ${version.toUpperCase()} belum dikonfigurasi.*\n\n`;
    txt += available.length
        ? `Server yang sudah siap: *${available.join(', ')}*.\nIsi \`settings.pterodactyl.server${version.slice(1)}\` di setting.js untuk mengaktifkan ${version.toUpperCase()}.`
        : `Isi \`settings.pterodactyl\` di setting.js dulu (domain & apikey minimal).`;
    return txt;
}

function accessDeniedReply(sender, version, isBotOwnerOrCreator) {
    const role = getUserRole(sender, version);
    return `❌ *Akses ditolak*\n\nKamu tidak punya akses ke server *${version.toUpperCase()}*.\nRole kamu di server ini: *${role ? capitalize(role) : 'Tidak ada'}*`;
}

// ═══════════════════════════════════════════════════════════════════
//  MENU
// ═══════════════════════════════════════════════════════════════════
export function cpanelMenuText(prefix) {
    const available = getAvailableServers();
    return `╔══════════════════════════════════════╗
║   🖥️  *CPANEL — JUALAN SLOT SERVER*
╚══════════════════════════════════════╝

Server aktif: *${available.length ? available.join(', ').toUpperCase() : 'belum ada, isi setting.js'}*

╭─「 🆕 *BUAT SERVER* 」
│ ${prefix}1gbv1 username[,628xxx]
│ ${prefix}2gbv1 s/d ${prefix}10gbv1, ${prefix}univ1
│   _(ganti v1 → v2/v3/v4/v5 untuk server lain)_
╰──────────────────────────────

╭─「 📋 *KELOLA SERVER* 」
│ ${prefix}listserverv1 — daftar semua server
│ ${prefix}serverinfov1 [id] — detail 1 server
│ ${prefix}delserverv1 [id] — hapus server
╰──────────────────────────────

╭─「 👑 *KELOLA ROLE* 」 _(v1-v5 semua sama)_
│ ${prefix}addownerv1 / addceov1 / addresellerv1 @user
│ ${prefix}delownerv1 / delceov1 / delresellerv1 @user
│ ${prefix}listownerv1 / listceov1 / listresellerv1
╰──────────────────────────────

╭─「 👥 *GC SELLER* 」
│ ${prefix}addgcsellerv1 — bebaskan grup ini create server v1
│ ${prefix}resetgcsellerv1 — cabut status grup ini
╰──────────────────────────────

╭─「 🛠️ *ADMIN PANEL* 」 _(Owner/CEO saja)_
│ ${prefix}cadminv1 username — buat akun root admin panel
╰──────────────────────────────

> Hirarki role: Owner > CEO > Reseller. Owner & Creator bot selalu punya akses penuh ke semua server.`;
}

// ═══════════════════════════════════════════════════════════════════
//  CREATE SERVER — factory: 1 handler per kombinasi RAM × versi
// ═══════════════════════════════════════════════════════════════════
export function makeCreateServerHandler(ramTier, version) {
    return async (ctx) => {
        const isBotOwnerOrCreator = ctx.isOwner || ctx.isCreator;
        const gcAccess = isGcSeller(ctx.jid, version);

        if (!gcAccess && !hasAccessToServer(ctx.sender, version, isBotOwnerOrCreator, ctx.jid)) {
            return ctx.reply(accessDeniedReply(ctx.sender, version, isBotOwnerOrCreator));
        }

        const cooldown = checkCreationCooldown();
        if (!cooldown.allowed) {
            return ctx.reply(`⏱️ *Jeda aktif*\n\nMohon tunggu *${formatDuration(cooldown.remaining)}* sebelum membuat server lagi.\n_(Jeda ini berlaku untuk semua user, supaya panel tidak digempur sekaligus.)_`);
        }

        const cfg = getServerConfig(version);
        const missing = validateServerConfig(cfg);
        if (missing.length) return ctx.reply(missingConfigReply(version));

        const argStr = ctx.args.join(' ').trim();
        let username = null, targetNumber = null;
        if (argStr.includes(',')) {
            const [u, n] = argStr.split(',');
            username = u?.trim().toLowerCase();
            const num = n?.trim().replace(/[^0-9]/g, '');
            if (num) targetNumber = num;
        } else if (argStr) {
            username = argStr.trim().toLowerCase();
        }

        if (!username) {
            const role = getUserRole(ctx.sender, version) || (gcAccess ? 'GC Seller' : 'Guest');
            return ctx.reply(
                `⚠️ *Cara pakai*\n\n\`${ctx.args._prefix || '.'}${ramTier}${version} username\`\n\`...${ramTier}${version} username,628xxx\`\n\nServer: *${version.toUpperCase()}* | RAM: *${ramTier === 'unli' ? 'Unlimited' : ramTier.toUpperCase()}*\nRole kamu: *${capitalize(role)}*`
            );
        }
        if (!/^[a-z0-9_]{3,16}$/.test(username)) {
            return ctx.reply('❌ Username cuma boleh huruf kecil, angka, underscore (3-16 karakter).');
        }

        const quotedParticipant = ctx.msg.message?.extendedTextMessage?.contextInfo?.participant;
        let targetJid;
        if (targetNumber) targetJid = `${targetNumber}@s.whatsapp.net`;
        else if (quotedParticipant) targetJid = quotedParticipant;
        else if (ctx.mentioned?.length) targetJid = ctx.mentioned[0];
        else targetJid = ctx.sender.includes('@') ? ctx.sender : `${ctx.sender}@s.whatsapp.net`;

        try {
            const [onWa] = await ctx.sock.onWhatsApp(targetJid.split('@')[0]);
            if (!onWa?.exists) return ctx.reply(`❌ Nomor \`${targetJid.split('@')[0]}\` tidak terdaftar di WhatsApp.`);
        } catch {}

        const email = `${username}@gojosatorumdv2.panel`;
        const name = capitalize(username) + ' Server';
        const password = username + crypto.randomBytes(3).toString('hex');
        const label = version.toUpperCase();

        await ctx.reply(`🕐 Membuat server *${label}* (${ramTier === 'unli' ? 'Unlimited' : ramTier.toUpperCase()}) untuk \`${targetJid.split('@')[0]}\`...`);

        try {
            const user = await createPterodactylUser(cfg, { email, username, name, password });
            const server = await createPterodactylServer(cfg, { userId: user.id, name, ramTier });
            markCreationUsed();

            const ramLabel = ramTier === 'unli' ? 'Unlimited' : `${RAM_SPECS[ramTier].ram / 1000} GB`;
            const detailTxt = `✅ *SERVER BERHASIL DIBUAT*\n\n` +
                `🖥️ Server: *${label}*\n` +
                `👤 Username: *${user.username}*\n` +
                `🔐 Password: *${password}*\n` +
                `💾 RAM: *${ramLabel}*\n` +
                `🆔 Server ID: *${server.id}*\n` +
                `🌐 Panel: ${cfg.domain}\n\n` +
                `⚠️ Simpan data ini baik-baik, jangan dibagikan ke siapapun!`;

            await ctx.sock.sendMessage(targetJid, { text: detailTxt });
            if (targetJid !== ctx.sender && !ctx.sender.includes(targetJid.split('@')[0])) {
                await ctx.reply(`✅ Server *${label}* berhasil dibuat untuk \`${targetJid.split('@')[0]}\`.`);
            }
        } catch (err) {
            return ctx.reply(`❌ *Gagal membuat server*\n\n${friendlyApiError(err)}`);
        }
    };
}

// ═══════════════════════════════════════════════════════════════════
//  LIST / DELETE / INFO SERVER — factory per versi
// ═══════════════════════════════════════════════════════════════════
export function makeListServerHandler(version) {
    return async (ctx) => {
        const isBotOwnerOrCreator = ctx.isOwner || ctx.isCreator;
        if (!hasFullAccess(ctx.sender, version, isBotOwnerOrCreator)) {
            return ctx.reply(accessDeniedReply(ctx.sender, version, isBotOwnerOrCreator));
        }
        const cfg = getServerConfig(version);
        if (validateServerConfig(cfg).length) return ctx.reply(missingConfigReply(version));

        try {
            const servers = await listPterodactylServers(cfg);
            if (!servers.length) return ctx.reply(`📋 *Daftar server ${version.toUpperCase()}*\n\nBelum ada server terdaftar di panel ini.`);

            let txt = `📋 *Daftar server ${version.toUpperCase()}* — total ${servers.length}\n\n`;
            servers.slice(0, 25).forEach(s => {
                const a = s.attributes, l = a.limits || {};
                txt += `• *${a.name}* (ID: \`${a.id}\`)\n   RAM ${formatBytes(l.memory)} | CPU ${l.cpu === 0 ? 'Unlimited' : l.cpu + '%'}\n`;
            });
            if (servers.length > 25) txt += `\n_...dan ${servers.length - 25} server lainnya._`;
            return ctx.reply(txt);
        } catch (err) {
            return ctx.reply(`❌ *Gagal ambil data*\n\n${friendlyApiError(err)}`);
        }
    };
}

export function makeDelServerHandler(version) {
    return async (ctx) => {
        const isBotOwnerOrCreator = ctx.isOwner || ctx.isCreator;
        if (!hasFullAccess(ctx.sender, version, isBotOwnerOrCreator)) {
            return ctx.reply(accessDeniedReply(ctx.sender, version, isBotOwnerOrCreator));
        }
        const cfg = getServerConfig(version);
        if (validateServerConfig(cfg).length) return ctx.reply(missingConfigReply(version));

        const serverId = ctx.args[0];
        if (!serverId || isNaN(serverId)) {
            return ctx.reply(`⚠️ *Cara pakai*\n\n\`.delserver${version} [id]\`\nLihat ID lewat \`.listserver${version}\``);
        }
        try {
            const server = await getPterodactylServer(cfg, serverId);
            await deletePterodactylServer(cfg, serverId);
            return ctx.reply(`✅ *Server dihapus*\n\nPanel: *${version.toUpperCase()}*\nID: \`${serverId}\`\nNama: \`${server.name}\``);
        } catch (err) {
            return ctx.reply(`❌ *Gagal hapus server*\n\n${friendlyApiError(err)}`);
        }
    };
}

export function makeServerInfoHandler(version) {
    return async (ctx) => {
        const isBotOwnerOrCreator = ctx.isOwner || ctx.isCreator;
        if (!hasFullAccess(ctx.sender, version, isBotOwnerOrCreator)) {
            return ctx.reply(accessDeniedReply(ctx.sender, version, isBotOwnerOrCreator));
        }
        const cfg = getServerConfig(version);
        if (validateServerConfig(cfg).length) return ctx.reply(missingConfigReply(version));

        const serverId = ctx.args[0];
        if (!serverId || isNaN(serverId)) {
            return ctx.reply(`⚠️ *Cara pakai*\n\n\`.serverinfo${version} [id]\`\nLihat ID lewat \`.listserver${version}\``);
        }
        try {
            const s = await getPterodactylServer(cfg, serverId);
            const l = s.limits || {}, f = s.feature_limits || {};
            const txt = `📊 *Info server [${version.toUpperCase()}]*\n\n` +
                `ID: *${s.id}* | Nama: *${s.name}*\n` +
                `Status: *${s.suspended ? '⛔ Suspended' : '✅ Active'}*\n\n` +
                `💾 RAM: *${formatBytes(l.memory)}*\n` +
                `⚡ CPU: *${l.cpu === 0 ? 'Unlimited' : l.cpu + '%'}*\n` +
                `📦 Disk: *${formatBytes(l.disk)}*\n\n` +
                `🗄️ Database: *${f.databases}* | 💾 Backup: *${f.backups}* | 🔌 Alokasi: *${f.allocations}*`;
            return ctx.reply(txt);
        } catch (err) {
            return ctx.reply(`❌ *Gagal ambil data*\n\n${friendlyApiError(err)}`);
        }
    };
}

// ═══════════════════════════════════════════════════════════════════
//  ROLE MANAGEMENT — factory per (aksi × role × versi)
// ═══════════════════════════════════════════════════════════════════
export function makeRoleHandler(action, role, version) {
    return async (ctx) => {
        const isBotOwnerOrCreator = ctx.isOwner || ctx.isCreator;
        const label = capitalize(role);

        if (action === 'list') {
            const list = listByRole(version, role);
            if (!list.length) return ctx.reply(`📋 *Daftar ${label} ${version.toUpperCase()}*\n\nBelum ada ${role} terdaftar.`);
            let txt = `📋 *Daftar ${label} ${version.toUpperCase()}* — total ${list.length}\n\n`;
            list.forEach((n, i) => { txt += `${i + 1}. \`${n}\`\n`; });
            return ctx.reply(txt);
        }

        if (!canManageRole(ctx.sender, version, role, isBotOwnerOrCreator)) {
            const myRole = getUserRole(ctx.sender, version);
            return ctx.reply(`❌ *Akses ditolak*\n\nKamu tidak bisa mengelola *${label}* di *${version.toUpperCase()}*.\nRole kamu: *${myRole ? capitalize(myRole) : 'Tidak ada'}*\n\nHirarki: Owner > CEO > Reseller`);
        }

        const target = extractTargetNumber(ctx);
        if (!target) {
            return ctx.reply(`⚠️ *Cara pakai*\n\n\`.${action}${role}${version} @user\`\n\`.${action}${role}${version} 628xxx\`\nAtau reply pesan user`);
        }

        if (action === 'add') {
            const result = addRole(target, version, role);
            if (!result.success) return ctx.reply(`❌ ${result.error}`);
            return ctx.reply(`✅ *${label} ditambahkan*\n\nNomor: \`${target}\`\nServer: *${version.toUpperCase()}*\nTotal ${role}: *${listByRole(version, role).length}*`);
        }
        if (action === 'del') {
            const result = removeRole(target, version, role);
            if (!result.success) return ctx.reply(`❌ ${result.error}`);
            return ctx.reply(`✅ *${label} dihapus*\n\nNomor: \`${target}\`\nServer: *${version.toUpperCase()}*\nTotal ${role}: *${listByRole(version, role).length}*`);
        }
    };
}

// ═══════════════════════════════════════════════════════════════════
//  GC SELLER — factory per (aksi × versi)
// ═══════════════════════════════════════════════════════════════════
export function makeGcSellerHandler(action, version) {
    return async (ctx) => {
        const isBotOwnerOrCreator = ctx.isOwner || ctx.isCreator;
        if (!ctx.isGroup) return ctx.reply('❌ Command ini cuma bisa dipakai di dalam grup.');
        if (!isBotOwnerOrCreator) {
            return ctx.reply('❌ *Akses ditolak*\n\nHanya Owner/Creator bot yang bisa mengatur GC Seller.');
        }
        const label = version.toUpperCase();

        if (action === 'add') {
            const current = getGcSeller(version);
            if (current === ctx.jid) return ctx.reply(`❌ Grup ini sudah jadi GC Seller *${label}*.`);
            setGcSeller(version, ctx.jid);
            return ctx.reply(`✅ *GC Seller ${label} ditambahkan*\n\nSemua member grup ini sekarang bisa create server *${label}* (\`.1gb${version}\` s/d \`.10gb${version}\`, \`.uni${version}\`) tanpa perlu role khusus.${current ? `\n\n_Grup sebelumnya (\`${current}\`) otomatis dicabut._` : ''}`);
        }
        if (action === 'reset') {
            const current = getGcSeller(version);
            if (!current) return ctx.reply(`❌ Belum ada GC Seller terdaftar untuk *${label}*.`);
            setGcSeller(version, null);
            return ctx.reply(`✅ *GC Seller ${label} direset*\n\nGrup \`${current}\` tidak lagi terhubung ke server ${label}.`);
        }
    };
}

// ═══════════════════════════════════════════════════════════════════
//  CADMIN — buat akun root admin di panel Pterodactyl (bukan role bot)
// ═══════════════════════════════════════════════════════════════════
export function makeCadminHandler(version) {
    return async (ctx) => {
        const isBotOwnerOrCreator = ctx.isOwner || ctx.isCreator;
        if (!hasFullAccess(ctx.sender, version, isBotOwnerOrCreator)) {
            return ctx.reply(accessDeniedReply(ctx.sender, version, isBotOwnerOrCreator));
        }
        const cfg = getServerConfig(version);
        if (validateServerConfig(cfg).length) return ctx.reply(missingConfigReply(version));

        const username = (ctx.args[0] || '').trim().toLowerCase();
        if (!username || !/^[a-z0-9_]{3,16}$/.test(username)) {
            return ctx.reply(`⚠️ *Cara pakai*\n\n\`.cadmin${version} username\`\nUsername: huruf kecil/angka/underscore, 3-16 karakter.`);
        }

        const quotedParticipant = ctx.msg.message?.extendedTextMessage?.contextInfo?.participant;
        const targetJid = quotedParticipant || ctx.mentioned?.[0] || ctx.sender;
        const email = `${username}@gojosatorumdv2.panel`;
        const name = capitalize(username) + ' Admin';
        const password = username + crypto.randomBytes(3).toString('hex');

        await ctx.reply(`🛠️ Membuat akun *root admin* panel *${version.toUpperCase()}*...\n\n⚠️ Akun ini akses PENUH ke seluruh panel — pastikan targetnya orang yang tepercaya.`);

        try {
            const user = await createPterodactylUser(cfg, { email, username, name, password, rootAdmin: true });
            const detailTxt = `✅ *Admin panel berhasil dibuat*\n\n` +
                `Server: *${version.toUpperCase()}*\nUsername: *${user.username}*\nPassword: *${password}*\nStatus: *Root Admin*\nPanel: ${cfg.domain}\n\n` +
                `⚠️ Akun ini punya akses PENUH! Jangan dibagikan ke siapapun.`;
            await ctx.sock.sendMessage(targetJid.includes('@') ? targetJid : `${targetJid}@s.whatsapp.net`, { text: detailTxt });
            if (targetJid !== ctx.sender) return ctx.reply(`✅ Admin panel *${version.toUpperCase()}* dibuat, data dikirim ke \`${String(targetJid).split('@')[0]}\`.`);
        } catch (err) {
            return ctx.reply(`❌ *Gagal buat admin*\n\n${friendlyApiError(err)}`);
        }
    };
}
