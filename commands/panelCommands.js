// ═══════════════════════════════════════════════════════════════════
//  PANELCOMMANDS.JS — Pterodactyl Reseller & Server Creation Engine
//  Developer: AHSAN (03107260507)
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
    const raw = err?.response?.data?.errors?.[0]?.detail || err?.response?.data?.message || err.message || 'Unknown API error';
    const map = {
        'has already been taken': 'Username/email is already taken — choose another username.',
        'could not find': 'Egg or nest not found — verify nest/egg IDs in setting.js.',
        'no suitable allocation': 'No available ports on server node — allocate ports in panel.',
        'unauthorized': 'API key lacks permissions — create an API key with full administrative permissions.',
    };
    const hit = Object.entries(map).find(([k]) => raw.toLowerCase().includes(k));
    return hit ? hit[1] : raw;
}

function missingConfigReply(version) {
    const available = getAvailableServers();
    let txt = `⚠️ *Server ${version.toUpperCase()} is not configured yet.*\n\n`;
    txt += available.length
        ? `Configured active servers: *${available.join(', ')}*.\nSet \`settings.pterodactyl.server${version.slice(1)}\` in setting.js to activate ${version.toUpperCase()}.`
        : `Configure \`settings.pterodactyl\` in setting.js first (domain & apikey required).`;
    return txt;
}

function accessDeniedReply(sender, version, isBotOwnerOrCreator) {
    const role = getUserRole(sender, version);
    return `❌ *Access Denied*\n\nYou do not have permission for server *${version.toUpperCase()}*.\nYour role on this server: *${role ? capitalize(role) : 'None'}*`;
}

// ═══════════════════════════════════════════════════════════════════
//  CPANEL DASHBOARD
// ═══════════════════════════════════════════════════════════════════
export function cpanelMenuText(prefix) {
    const available = getAvailableServers();
    return `╔══════════════════════════════════════╗
║   🖥️  *MASTER MD — CPANEL SERVER ENGINE*
║       👑 DEVELOPER: AHSAN (03107260507)
╚══════════════════════════════════════╝

Active servers: *${available.length ? available.join(', ').toUpperCase() : 'None, configure in setting.js'}*

╭─「 🆕 *CREATE SERVER* 」
│ ${prefix}1gbv1 username[,phone]
│ ${prefix}2gbv1 up to ${prefix}10gbv1, ${prefix}univ1
│   _(replace v1 with v2/v3/v4/v5 for other servers)_
╰──────────────────────────────

╭─「 📋 *MANAGE SERVERS* 」
│ ${prefix}listserverv1 — List all active servers
│ ${prefix}serverinfov1 [id] — View detailed server specs
│ ${prefix}delserverv1 [id] — Delete server from panel
╰──────────────────────────────

╭─「 👑 *MANAGE ROLES* 」 _(v1-v5)_
│ ${prefix}addownerv1 / addceov1 / addresellerv1 @user
│ ${prefix}delownerv1 / delceov1 / delresellerv1 @user
│ ${prefix}listownerv1 / listceov1 / listresellerv1
╰──────────────────────────────

╭─「 👥 *GC SELLER PERMISSION* 」
│ ${prefix}addgcsellerv1 — Grant group free server creation
│ ${prefix}resetgcsellerv1 — Revoke group server creation
╰──────────────────────────────

╭─「 🛠️ *ROOT ADMIN* 」 _(Owner/CEO only)_
│ ${prefix}cadminv1 username — Create root admin panel account
╰──────────────────────────────

> Role hierarchy: Owner > CEO > Reseller. Bot Owner & Creator always retain full access.`;
}

// ═══════════════════════════════════════════════════════════════════
//  CREATE SERVER
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
            return ctx.reply(`⏱️ *Cooldown Active*\n\nPlease wait *${formatDuration(cooldown.remaining)}* before creating another server.`);
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
                `⚠️ *Usage*\n\n\`${ctx.args._prefix || '.'}${ramTier}${version} username\`\n\`...${ramTier}${version} username,phone_number\`\n\nServer: *${version.toUpperCase()}* | RAM: *${ramTier === 'unli' ? 'Unlimited' : ramTier.toUpperCase()}*\nYour role: *${capitalize(role)}*`
            );
        }
        if (!/^[a-z0-9_]{3,16}$/.test(username)) {
            return ctx.reply('❌ Username must be lowercase letters, numbers, and underscores only (3-16 chars).');
        }

        const quotedParticipant = ctx.msg.message?.extendedTextMessage?.contextInfo?.participant;
        let targetJid;
        if (targetNumber) targetJid = `${targetNumber}@s.whatsapp.net`;
        else if (quotedParticipant) targetJid = quotedParticipant;
        else if (ctx.mentioned?.length) targetJid = ctx.mentioned[0];
        else targetJid = ctx.sender.includes('@') ? ctx.sender : `${ctx.sender}@s.whatsapp.net`;

        try {
            const [onWa] = await ctx.sock.onWhatsApp(targetJid.split('@')[0]);
            if (!onWa?.exists) return ctx.reply(`❌ Phone number \`${targetJid.split('@')[0]}\` is not registered on WhatsApp.`);
        } catch {}

        const email = `${username}@mastermd.panel`;
        const name = capitalize(username) + ' Server';
        const password = username + crypto.randomBytes(3).toString('hex');
        const label = version.toUpperCase();

        await ctx.reply(`🕐 Creating server *${label}* (${ramTier === 'unli' ? 'Unlimited' : ramTier.toUpperCase()}) for \`${targetJid.split('@')[0]}\`...`);

        try {
            const user = await createPterodactylUser(cfg, { email, username, name, password });
            const server = await createPterodactylServer(cfg, { userId: user.id, name, ramTier });
            markCreationUsed();

            const ramLabel = ramTier === 'unli' ? 'Unlimited' : `${RAM_SPECS[ramTier].ram / 1000} GB`;
            const detailTxt = `✅ *SERVER CREATED SUCCESSFULLY*\n\n` +
                `🖥️ Server: *${label}*\n` +
                `👤 Username: *${user.username}*\n` +
                `🔐 Password: *${password}*\n` +
                `💾 RAM: *${ramLabel}*\n` +
                `🆔 Server ID: *${server.id}*\n` +
                `🌐 Panel URL: ${cfg.domain}\n\n` +
                `👑 Developer: AHSAN (03107260507)\n` +
                `⚠️ Please save these login credentials securely!`;

            await ctx.sock.sendMessage(targetJid, { text: detailTxt });
            if (targetJid !== ctx.sender && !ctx.sender.includes(targetJid.split('@')[0])) {
                await ctx.reply(`✅ Server *${label}* created successfully for \`${targetJid.split('@')[0]}\`.`);
            }
        } catch (err) {
            return ctx.reply(`❌ *Failed to create server*\n\n${friendlyApiError(err)}`);
        }
    };
}

// ═══════════════════════════════════════════════════════════════════
//  LIST / DELETE / INFO SERVER
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
            if (!servers.length) return ctx.reply(`📋 *Server List ${version.toUpperCase()}*\n\nNo servers registered in this panel.`);

            let txt = `📋 *Server List ${version.toUpperCase()}* — Total ${servers.length}\n\n`;
            servers.slice(0, 25).forEach(s => {
                const a = s.attributes, l = a.limits || {};
                txt += `• *${a.name}* (ID: \`${a.id}\`)\n   RAM ${formatBytes(l.memory)} | CPU ${l.cpu === 0 ? 'Unlimited' : l.cpu + '%'}\n`;
            });
            if (servers.length > 25) txt += `\n_...and ${servers.length - 25} more servers._`;
            return ctx.reply(txt);
        } catch (err) {
            return ctx.reply(`❌ *Failed to fetch servers*\n\n${friendlyApiError(err)}`);
        }
    };
}

export function makeDeleteServerHandler(version) {
    return async (ctx) => {
        const isBotOwnerOrCreator = ctx.isOwner || ctx.isCreator;
        if (!hasFullAccess(ctx.sender, version, isBotOwnerOrCreator)) {
            return ctx.reply(accessDeniedReply(ctx.sender, version, isBotOwnerOrCreator));
        }
        const cfg = getServerConfig(version);
        if (validateServerConfig(cfg).length) return ctx.reply(missingConfigReply(version));

        const serverId = ctx.args[0];
        if (!serverId || isNaN(serverId)) {
            return ctx.reply(`⚠️ *Usage*\n\n\`.delserver${version} [id]\`\nView IDs with \`.listserver${version}\``);
        }
        try {
            const server = await getPterodactylServer(cfg, serverId);
            await deletePterodactylServer(cfg, serverId);
            return ctx.reply(`✅ *Server Deleted*\n\nPanel: *${version.toUpperCase()}*\nID: \`${serverId}\`\nName: \`${server.name}\``);
        } catch (err) {
            return ctx.reply(`❌ *Failed to delete server*\n\n${friendlyApiError(err)}`);
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
            return ctx.reply(`⚠️ *Usage*\n\n\`.serverinfo${version} [id]\`\nView IDs with \`.listserver${version}\``);
        }
        try {
            const s = await getPterodactylServer(cfg, serverId);
            const l = s.limits || {}, f = s.feature_limits || {};
            const txt = `📊 *Server Details [${version.toUpperCase()}]*\n\n` +
                `ID: *${s.id}* | Name: *${s.name}*\n` +
                `Status: *${s.suspended ? '⛔ Suspended' : '✅ Active'}*\n\n` +
                `💾 RAM: *${formatBytes(l.memory)}*\n` +
                `⚡ CPU: *${l.cpu === 0 ? 'Unlimited' : l.cpu + '%'}*\n` +
                `📦 Disk: *${formatBytes(l.disk)}*\n\n` +
                `🗄️ Databases: *${f.databases}* | 💾 Backups: *${f.backups}* | 🔌 Allocations: *${f.allocations}*`;
            return ctx.reply(txt);
        } catch (err) {
            return ctx.reply(`❌ *Failed to fetch details*\n\n${friendlyApiError(err)}`);
        }
    };
}

// ═══════════════════════════════════════════════════════════════════
//  ROLE MANAGEMENT
// ═══════════════════════════════════════════════════════════════════
export function makeRoleHandler(action, role, version) {
    return async (ctx) => {
        const isBotOwnerOrCreator = ctx.isOwner || ctx.isCreator;
        const label = capitalize(role);

        if (action === 'list') {
            const list = listByRole(version, role);
            if (!list.length) return ctx.reply(`📋 *${label} List ${version.toUpperCase()}*\n\nNo ${role} registered.`);
            let txt = `📋 *${label} List ${version.toUpperCase()}* — Total ${list.length}\n\n`;
            list.forEach((n, i) => { txt += `${i + 1}. \`${n}\`\n`; });
            return ctx.reply(txt);
        }

        if (!canManageRole(ctx.sender, version, role, isBotOwnerOrCreator)) {
            const myRole = getUserRole(ctx.sender, version);
            return ctx.reply(`❌ *Access Denied*\n\nYou cannot manage *${label}* on *${version.toUpperCase()}*.\nYour role: *${myRole ? capitalize(myRole) : 'None'}*\n\nHierarchy: Owner > CEO > Reseller`);
        }

        const target = extractTargetNumber(ctx);
        if (!target) {
            return ctx.reply(`⚠️ *Usage*\n\n\`.${action}${role}${version} @user\`\n\`.${action}${role}${version} 923xxx\`\nOr reply to a message`);
        }

        if (action === 'add') {
            const result = addRole(target, version, role);
            if (!result.success) return ctx.reply(`❌ ${result.error}`);
            return ctx.reply(`✅ *${label} Added*\n\nNumber: \`${target}\`\nServer: *${version.toUpperCase()}*\nTotal ${role}: *${listByRole(version, role).length}*`);
        }
        if (action === 'del') {
            const result = removeRole(target, version, role);
            if (!result.success) return ctx.reply(`❌ ${result.error}`);
            return ctx.reply(`✅ *${label} Removed*\n\nNumber: \`${target}\`\nServer: *${version.toUpperCase()}*\nTotal ${role}: *${listByRole(version, role).length}*`);
        }
    };
}

// ═══════════════════════════════════════════════════════════════════
//  GC SELLER
// ═══════════════════════════════════════════════════════════════════
export function makeGcSellerHandler(action, version) {
    return async (ctx) => {
        const isBotOwnerOrCreator = ctx.isOwner || ctx.isCreator;
        if (!ctx.isGroup) return ctx.reply('❌ This command can only be used in a group.');
        if (!isBotOwnerOrCreator) {
            return ctx.reply('❌ *Access Denied*\n\nOnly the Bot Owner/Creator can configure GC Seller groups.');
        }
        const label = version.toUpperCase();

        if (action === 'add') {
            const current = getGcSeller(version);
            if (current === ctx.jid) return ctx.reply(`❌ This group is already a GC Seller for *${label}*.`);
            setGcSeller(version, ctx.jid);
            return ctx.reply(`✅ *GC Seller ${label} Configured*\n\nAll members in this group can now create *${label}* servers (\`.1gb${version}\` to \`.10gb${version}\`, \`.uni${version}\`) without special roles.${current ? `\n\n_Previous group (\`${current}\`) replaced._` : ''}`);
        }
        if (action === 'reset') {
            const current = getGcSeller(version);
            if (!current) return ctx.reply(`❌ No GC Seller assigned for *${label}*.`);
            setGcSeller(version, null);
            return ctx.reply(`✅ *GC Seller ${label} Reset*\n\nGroup \`${current}\` is no longer linked to server ${label}.`);
        }
    };
}

// ═══════════════════════════════════════════════════════════════════
//  CADMIN — Root admin account creation
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
            return ctx.reply(`⚠️ *Usage*\n\n\`.cadmin${version} username\`\nUsername: lowercase letters, numbers, underscores (3-16 chars).`);
        }

        const quotedParticipant = ctx.msg.message?.extendedTextMessage?.contextInfo?.participant;
        const targetJid = quotedParticipant || ctx.mentioned?.[0] || ctx.sender;
        const email = `${username}@mastermd.panel`;
        const name = capitalize(username) + ' Admin';
        const password = username + crypto.randomBytes(3).toString('hex');

        await ctx.reply(`🛠️ Creating *Root Admin* account on panel *${version.toUpperCase()}*...\n\n⚠️ This grants FULL access to the Pterodactyl node.`);

        try {
            const user = await createPterodactylUser(cfg, { email, username, name, password, rootAdmin: true });
            const detailTxt = `✅ *ROOT ADMIN ACCOUNT CREATED*\n\n` +
                `Server: *${version.toUpperCase()}*\nUsername: *${user.username}*\nPassword: *${password}*\nRole: *Root Admin*\nPanel: ${cfg.domain}\n\n` +
                `👑 Developer: AHSAN (03107260507)\n` +
                `⚠️ Keep these credentials confidential!`;
            await ctx.sock.sendMessage(targetJid.includes('@') ? targetJid : `${targetJid}@s.whatsapp.net`, { text: detailTxt });
            if (targetJid !== ctx.sender) return ctx.reply(`✅ Panel admin for *${version.toUpperCase()}* created; details sent to \`${String(targetJid).split('@')[0]}\`.`);
        } catch (err) {
            return ctx.reply(`❌ *Failed to create admin*\n\n${friendlyApiError(err)}`);
        }
    };
}
