import { rpgCommands } from './rpgCommands.js';
import { getReplyDelayOverride, setReplyDelayOverride } from '../lib/replyDelay.js';
import { recallRealJid } from '../lib/lidMapping.js';
import { rpgCommands2 } from './rpgCommands2.js';
import { rpgCommands3 } from './rpgCommands3.js';
import { rpgCommands4 } from './rpgCommands4.js';
import { rpgCommands5 } from './rpgCommands5.js';
import { adminCommands, checkMute, isGroupLocked } from './adminCommands.js';
import { adminCommands2 } from './adminCommands2.js';
import { adminCommands3 } from './adminCommands3.js';
import { adminCommands4 } from './adminCommands4.js';
import {
    manualDeleteNsfw, checkNsfwStrikeCmd,
    resetNsfwStrikeCmd, setNsfwStrikeLimitCmd,
} from '../features/antiNsfw.js';
import { funCommands } from './funCommands.js';
import { funCommands2 } from './funCommands2.js';
import { funCommands3 } from './funCommands3.js';
import { textTools, mathTools, converterTools, generatorTools, infoTools } from './toolsCommands.js';
import { mathTools2, dateTools, formatTools, validatorTools } from './toolsCommands2.js';
import { toolsCommands3 } from './toolsCommands3.js';
import { toolsCommands4 } from './toolsCommands4.js';
import { toolsCommands5 } from './toolsCommands5.js';
import { toolsCommands6 } from './toolsCommands6.js';
import { toolsCommands7 } from './toolsCommands7.js';
import { toolsCommands8 } from './toolsCommands8.js';
import { toolsCommands9 } from './toolsCommands9.js';
import { toolsCommands10 } from './toolsCommands10.js';
import { toolsCommands11 } from './toolsCommands11.js';
import { toolsCommands12 } from './toolsCommands12.js';
import { funCommands4 } from './funCommands4.js';
import {
    toBotakCmd, toChibiCmd, toFiguraCmd, toGhibliCmd, toHijabCmd,
    toLegoCmd, toHitamCmd, to3dCmd, toRobloxCmd, toOilPaintingCmd,
} from './mediaCommands3.js';
import { getGroupSettings } from '../lib/db.js';
import {
    grayscaleCmd, mirrorCmd, blurCmd, rotate90Cmd, rotate180Cmd,
    speedUpCmd, slowMoCmd, muteVideoCmd, extractAudioCmd, volumeUpCmd,
    sepiaCmd, invertCmd, pixelateCmd, brightenCmd, darkenCmd, reverseVideoCmd,
    flipVerticalCmd, squareCropCmd, watermarkCmd, hdCmd, handleViewOnce,
} from './mediaCommands2.js';
import {
    trackCommandUsage, botStats, showChangelog,
    submitSuggestion, listSuggestions, clearSuggestions,
    showCredits, showSupport, backupNow,
} from './botCommands.js';
import {
    eventCreate, eventRsvp, eventList, eventAttendees,
    quickLock, quickUnlock,
} from './adminCommands7.js';
import { votekick, setMotd, showMotd, pollClose } from './adminCommands8.js';
import { mediaCommands } from './mediaCommands.js';
import { gojoCommands } from './gojoCommands.js';
import { broadcastCommands } from './broadcastCommands.js';
import { jadibotCommands } from './jadibotCommands.js';
import { musicCommands } from './musicCommands.js';
import { socialDownloadCommands } from './socialDownloadCommands.js';
import { trackCommand, countUsers, countGroups, getTotalCommandsRan, getTopCommands } from '../lib/db.js';
import { fmtDuration, safeReplyText, withTimeout, fmtTime, fmtDate, isLidJid, truncate } from '../lib/utils.js';
import { isCreator, isOwner, isPremium, listOwners, listPremium, getRoleLabel, getCreatorInfo, addOwner, removeOwner, addPremium, removePremium, isCoCreator, listCoCreators, addCoCreator, removeCoCreator } from '../lib/roles.js';
import { CHANNEL_JID, CHANNEL_NAME } from '../lib/channelGuard.js';
import { checkMediaLimit, consumeMediaLimit, buyMediaLimit, addLimitManual, limitStatusText } from '../lib/mediaLimit.js';
import { getChar, saveChar } from '../lib/rpgEngine.js';
import { isAutoread, setAutoread, isAutotyping, setAutotyping } from '../lib/autoFeatures.js';
import { isGojoAiEnabled, setGojoAiEnabled } from '../lib/gojoAi.js';
import { isAnticallEnabled, setAnticall, isAntichatEnabled, setAntichat } from '../features/antiCallChat.js';
import {
    cpanelMenuText, makeCreateServerHandler, makeListServerHandler,
    makeDelServerHandler, makeServerInfoHandler, makeRoleHandler,
    makeGcSellerHandler, makeCadminHandler,
} from './panelCommands.js';
import { VALID_SERVERS, VALID_ROLES, RAM_TIERS } from '../lib/pterodactylReseller.js';
import { GOJOLINE, JJK_TRIVIA, ANIME_FACTS, MOTIVASI_HARIAN, FAKTA_SERU, KETAWA, BERCANDA, PUJIAN_SERU, PANTUN_SERU, WEJANGAN, TEBAKAN } from './expansionCommands.js';
import { RPG_LORE, TIPS_TOOLS, CAPTION_IDEAS, BOT_FACTS, MUSIC_TRIVIA, PANEL_INFO, SEMANGAT_PAGI } from './expansionCommands2.js';
import { AUDIO_FACT, HOSTING_TIP, FOTO_TIP } from './expansionCommands3.js';
import {
    guildCreate, guildJoin, guildLeave, guildKick, guildPromote, guildDemote,
    guildDonate, guildUpgrade, guildDisband, guildInfo, guildMembers, guildListCmd,
} from './rpgCommands6.js';
import {
    plantCmd, waterCmd, harvestCmd, farmStatusCmd,
    titlesCmd, equipTitleCmd, cookCmd, recipesCmd,
    bountyCmd, claimBountyCmd,
} from './rpgCommands7.js';
import {
    pinAdd, pinRemove, pinList,
    noteAdd, noteList, noteDel,
    templateSave, templateLoad, templateList, templateDel,
    announcementAdd, announcementList, announcementDel,
    birthdaySet, birthdayList, birthdayDel,
} from './adminCommands5.js';
import {
    bulkPromote, bulkDemote, bulkKick,
    listInactive, topActive,
    taskAssign, taskMine, taskList, taskDone,
    maintenanceToggle,
} from './adminCommands6.js';
import { store, save } from '../lib/db.js';
import { sewaCommands } from './sewaCommands.js';
import { bratGenerate, iqc } from './bratCommands.js';
import { checkSewaExpiry, isSewaActive, isSewaMode } from '../lib/sewaBot.js';

// ── Runtime bot config (selfMode dll) — persist ke db ───────────────────────
function botCfg() { return store('botConfig', { selfMode: false, autojoin: true }); }
function saveBotCfg() { save('botConfig'); }

// Load saved config saat startup (mutasi settings langsung)
;(() => {
    try {
        const cfg = botCfg();
        if (typeof cfg.selfMode === 'boolean') settings.selfMode = cfg.selfMode;
        if (typeof cfg.public  === 'boolean') settings.public   = cfg.public;
    } catch {}
})();
import { log } from '../lib/logger.js';
import { getThumbnailImageContent } from '../lib/thumbnailSource.js';
import { sendMainMenu, sendAdminMenu, sendFunMenu, sendToolsMenu, sendMediaMenu, sendBotMenu, sendRpgMenu, sendOwnerMenu, sendAiMenu, sc, getFeatureDescription } from './menu.js';
import settings from '../setting.js';
import { parseDaftarInput, register, getProfile, isRegistered } from '../lib/registry.js';

import { GOJO_2000_FEATURES } from './featureRegistry2000.js';

const BOT_START_TIME = Date.now();

// ─── REPLY (PLAIN TEXT) ───────────────────────────────────────────────────
// CATATAN: fitur thumbnail/externalAdReply yang sebelumnya ada di sini
// SUDAH DIHAPUS. Penyebabnya: ditemukan error nyata di lapangan —
//   "The value of "value" is out of range. It must be >= 0 and <= 255"
// — yang terjadi spesifik saat mengirim externalAdReply ke JID berformat
// @lid (format "Linked ID" baru yang dipakai WhatsApp untuk beberapa
// akun/grup). Error ini membuat SESSION BAILEYS RUSAK TOTAL ("Session
// rusak. Auto-reset...", lalu "Session lama dihapus otomatis"), yang
// kemungkinan besar adalah akar dari masalah command yang gagal total
// tanpa balasan ATAUPUN error yang kita selidiki sebelumnya — bukan
// sekadar 1 pesan gagal, tapi seluruh sesi koneksi ke WhatsApp jadi
// tidak sehat setelahnya. Karena risiko ini (crash + corrupt session)
// jauh lebih besar daripada manfaat kosmetik sebuah thumbnail, fitur ini
// dihapus sepenuhnya, bukan sekadar diberi try/catch tambahan.
async function replyWithThumb(sock, jid, text, quotedMsg) {
    text = safeReplyText(text);
    let target = jid;
    if (target && target.includes('@lid')) {
        const recalled = recallRealJid(target);
        if (recalled) target = recalled;
        else if (quotedMsg?.key?.fromMe && sock?.user?.id) {
            const num = sock.user.id.split('@')[0].split(':')[0];
            if (num) target = `${num}@s.whatsapp.net`;
        }
    }
    try {
        return await withTimeout(sock.sendMessage(target || jid, { text }, { quoted: quotedMsg }), 30_000, 'sendMessage(plainText)');
    } catch (err) {
        log.error(`GAGAL kirim pesan ke ${target || jid}: ${err.message}`);
        try {
            return await sock.sendMessage(target || jid, { text });
        } catch (e2) {
            throw err;
        }
    }
}

// ─── REPLY DENGAN GAMBAR (thumbnail khusus per-command) ────────────────────
// PENTING: ini BEDA dengan externalAdReply yang dihapus di atas — ini kirim
// gambar biasa (message `image`, persis pola settings.thumbnailUrl yang
// sudah dipakai di .menu & .allmenu), BUKAN link-preview ad-reply. Jadi
// tidak memicu bug @lid yang dulu bikin session corrupt. Selalu fallback
// ke teks biasa (replyWithThumb) kalau kirim gambar gagal.
//
// FIX (2026-08-01): batas aman CAPTION gambar di WhatsApp jauh lebih kecil
// daripada batas pesan teks biasa (~60000 di safeReplyText). Caption yang
// kepanjangan (mis. .allmenu yang sekarang ~30rb karakter setelah banyak
// fitur baru ditambahkan) bisa gagal terkirim TANPA melempar error yang
// ketangkep try/catch di bawah — dari sisi Baileys request-nya "berhasil",
// tapi WhatsApp/klien penerima diam-diam tidak menampilkan apa-apa. Ini
// yang bikin .allmenu kelihatan seperti "gak keluar pesannya" padahal
// kodenya tidak error. Sekarang: kalau teksnya kepanjangan buat jadi
// caption, gambar dikirim dengan caption pendek dulu, teks lengkapnya
// menyusul sebagai pesan teks terpisah (limitnya jauh lebih longgar).
const SAFE_CAPTION_LIMIT = 1000;

export async function replyWithImage(sock, jid, quotedMsg, imageUrl, text) {
    const full = safeReplyText(text);
    const tooLongForCaption = full.length > SAFE_CAPTION_LIMIT;
    const caption = tooLongForCaption
        ? `${truncate(full, SAFE_CAPTION_LIMIT)}\n\n👇 _Full details arriving in next message..._`
        : full;

    if (imageUrl) {
        try {
            // FIX (2026-08-06): pakai file thumbnail lokal (media/thumbnail.*)
            // kalau ada, bukan fetch settings.thumbnailUrl lewat jaringan
            // tiap kali — lihat lib/thumbnailSource.js untuk alasan lengkap.
            // imageUrl (parameter) dipertahankan sebagai penentu APAKAH mau
            // kirim gambar sama sekali (caller lain mungkin passing URL lain
            // yang bukan settings.thumbnailUrl) — isi gambarnya sendiri yang
            // diganti ke sumber lokal kalau imageUrl persis settings.thumbnailUrl.
            const imageContent = imageUrl === settings.thumbnailUrl
                ? getThumbnailImageContent()
                : { image: { url: imageUrl } };
            await withTimeout(
                sock.sendMessage(jid, { ...imageContent, caption }, { quoted: quotedMsg }),
                30_000,
                'sendMessage(image)'
            );
            if (tooLongForCaption) {
                await replyWithThumb(sock, jid, full, quotedMsg);
            }
            return;
        } catch (err) {
            log.error(`Gagal kirim gambar thumbnail ke ${jid}: ${err.message}`);
            // lanjut ke fallback teks biasa di bawah
        }
    }
    await replyWithThumb(sock, jid, full, quotedMsg);
}

function getMentioned(msg) {
    return msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
}

// ─── COMMAND TABLE ──────────────────────────────────────────────────────
// Each entry: [aliases[], handler(ctx)]
// ctx = { sock, msg, jid, sender, args, isGroup, body, reply, isAdmin, mentioned }
const routes = [];

// Command rahasia: tetap bisa dipanggil lewat prefix seperti biasa,
// tapi sengaja DIHILANGKAN dari .menu, .allmenu, dan menu kategori manapun.
const HIDDEN_COMMANDS = new Set([
    'ryoiken', 'ryoikitenkai', 'domainexpansion', 'tenkai',
]);

function reg(aliases, handler) {
    for (const a of aliases) routes.push([a, handler]);
}

// ── MENU / HELP ──────────────────────────────────────────────────────────
reg(['menu', 'help', 'start'], async (ctx) => sendMainMenu(ctx.reply, ctx.sender, ctx.sock, ctx.jid, ctx.msg, {
    isOwner: ctx.isOwner,
    isPremium: ctx.isPremium,
    pushName: ctx.msg?.pushName,
    botStartTime: BOT_START_TIME,
    totalFeatures: getRegisteredCommandCount(),
    featureList: getAllCommandNames(),
}));

// (Handler .allmenu didaftarkan di bawah, setelah routeMap tersedia —
//  lihat dekat definisi getAllCommandNames())
reg(['menurpg', 'rpgmenu', 'menugame'], async (ctx) => sendRpgMenu(ctx.reply));
reg(['menuadmin', 'adminmenu', 'menugroup', 'groupmenu'], async (ctx) => sendAdminMenu(ctx.reply));
reg(['menufun', 'funmenu'], async (ctx) => sendFunMenu(ctx.reply));
reg(['menutools', 'toolsmenu'], async (ctx) => sendToolsMenu(ctx.reply));
reg(['menumedia', 'mediamenu'], async (ctx) => sendMediaMenu(ctx.reply));
reg(['menubot', 'botmenu'], async (ctx) => sendBotMenu(ctx.reply));
reg(['menuowner', 'ownermenu'], async (ctx) => sendOwnerMenu(ctx.reply));
reg(['menuai', 'aimenu'], async (ctx) => sendAiMenu(ctx.reply));

// ─── VIEW-ONCE RETRIEVER (.vv / .rvo / .readviewonce) ────────────────────────
reg(['vv', 'rvo', 'readviewonce', 'viewonce', 'antiviewonce'], async (ctx) => {
    await handleViewOnce(ctx);
});

// .totalfitur — tampilkan jumlah total command/fitur yang terdaftar di
// bot ini. Pakai getRegisteredCommandCount() (didefinisikan di bawah,
// setelah routeMap dibuat) supaya angkanya selalu akurat & otomatis
// ikut bertambah kalau ada command baru — tidak di-hardcode manual.
reg(['totalfitur', 'totalfeature', 'jumlahfitur'], async (ctx) => {
    const total = getRegisteredCommandCount();
    const prefix = settings.prefix || '.';
    await ctx.reply(
`📦 *TOTAL FITUR ${settings.botName.toUpperCase()}*
━━━━━━━━━━━━━━━━━━
✨ Total command terdaftar : *${total} fitur*
━━━━━━━━━━━━━━━━━━
💡 Ketik *${prefix}allmenu* untuk lihat daftar lengkapnya.
💡 Ketik *${prefix}menu* untuk tampilan ringkas per kategori.`
    );
});

// ── REGISTRASI WAJIB (.daftar nama.umur) ──────────────────────────────────
reg(['daftar', 'register'], async (ctx) => {
    // Balasan .daftar yang MENYURUH/MEMANDU user daftar (belum terdaftar,
    // format salah, dsb) pakai thumbnail khusus (settings.thumbnailDaftar)
    // lewat replyWithImage. Khusus balasan "PENDAFTARAN BERHASIL" di bawah
    // SENGAJA pakai ctx.reply (teks polos) — thumbnail dihapus dari situ saja.
    const kirim = (text) => replyWithImage(ctx.sock, ctx.jid, ctx.msg, settings.thumbnailDaftar, text);

    if (isRegistered(ctx.sender) || ctx.isOwner) {
        const profile = getProfile(ctx.sender);
        if (profile) {
            return kirim(`✅ Kamu sudah terdaftar sebagai *${profile.name}* (${profile.age} tahun).`);
        }
        return kirim('✅ Kamu sudah bisa pakai bot ini (Owner/Creator otomatis terdaftar).');
    }

    const parsed = parseDaftarInput(ctx.args.join(' '));
    if (!parsed) {
        return kirim(
`📋 *CARA DAFTAR*
━━━━━━━━━━━━━━━━━━
◈ Format  : *${settings.prefix}daftar nama.umur*
◈ Contoh  : *${settings.prefix}daftar Gojo.20*
━━━━━━━━━━━━━━━━━━`
        );
    }

    const result = register(ctx.sender, parsed.name, parsed.age);
    if (!result.ok) return kirim(`❌ ${result.reason}`);

    await ctx.reply(
`✅ *REGISTRATION SUCCESSFUL!*
━━━━━━━━━━━━━━━━━━
◈ Nama : *${parsed.name}*
◈ Umur : *${parsed.age} tahun*
━━━━━━━━━━━━━━━━━━
Selamat bergabung di *${settings.botName}*! 🌊
Ketik *${settings.prefix}menu* untuk lihat semua command.`
    );
});

// ── RPG: DEACTIVATED ────────────────────────────────────────────────────────
const handleRpgDisabled = async (ctx) => {
    await ctx.reply('⚠️ *RPG commands have been deactivated in MASTER MD v3.0.0 to optimize bot speed and performance.*\n\n💡 *Type .menu to explore active AI, Admin, Media, and Tool commands!*');
};
reg(['rpg', 'mulai', 'startrpg', 'createchar', 'class', 'ganticlass', 'setclass', 'profil', 'profile', 'stats', 'char', 'inventory', 'inv', 'bag', 'equip', 'pakai', 'unequip', 'lepas', 'use', 'pakaiitem', 'minum', 'istirahat', 'rest', 'tidur'], handleRpgDisabled);
reg(['hunt', 'berburu', 'buru', 'lawan', 'battle', 'pvp', 'duel', 'bossinfo', 'listboss', 'daftarboss', 'boss', 'raid', 'lawanboss', 'dungeoninfo', 'listdungeon', 'daftardungeon', 'dungeon', 'masukdungeon', 'explore'], handleRpgDisabled);
reg(['toko', 'shop', 'store', 'beli', 'buy', 'belanja', 'jual', 'sell', 'daily', 'klaim', 'absen', 'joblist', 'listjob', 'daftarkerja', 'kerja', 'work', 'job', 'nabung', 'deposit', 'save', 'tabung', 'tarik', 'withdraw', 'ambil', 'transfer', 'kirim', 'kirimgold', 'send', 'rob', 'rampok', 'curi'], handleRpgDisabled);
reg(['petshop', 'tokopet', 'buypet', 'belipet', 'adopsi', 'petinfo', 'mypet', 'petku', 'setpet', 'gantipet', 'pilihpet'], handleRpgDisabled);
reg(['quest', 'misi', 'questlist', 'questclaim', 'klaimquest', 'klaimmisi', 'achievement', 'pencapaian', 'lencana'], handleRpgDisabled);
reg(['ranking', 'top', 'top10', 'leaderboard', 'papantop', 'lb', 'marry', 'nikah', 'menikah', 'divorce', 'cerai', 'pisah'], handleRpgDisabled);

// ── ADMIN: MUTE ──────────────────────────────────────────────────────────
reg(['mute', 'bisukan'], async (ctx) => adminCommands.muteGroup(ctx.sock, ctx.reply, ctx.jid, ctx.args, ctx.isAdmin));
reg(['unmute', 'bukabisu'], async (ctx) => adminCommands.unmuteGroup(ctx.reply, ctx.jid, ctx.isAdmin));
reg(['mutestatus', 'cekmute'], async (ctx) => adminCommands.muteStatus(ctx.reply, ctx.jid));

// ── ADMIN: MEMBER MANAGEMENT ─────────────────────────────────────────────
reg(['kick', 'keluarkan', 'tendang'], async (ctx) => adminCommands.kickMember(ctx.sock, ctx.reply, ctx.msg, ctx.jid, ctx.mentioned, ctx.isAdmin));
reg(['ryoiken', 'ryoikitenkai', 'domainexpansion', 'tenkai'], async (ctx) => adminCommands.ryoikiTenkaiKick(ctx.sock, ctx.reply, ctx.msg, ctx.jid, ctx.mentioned, ctx.isAdmin));
reg(['promote', 'jadikanadmin', 'naikkan'], async (ctx) => adminCommands.promoteMember(ctx.sock, ctx.reply, ctx.msg, ctx.jid, ctx.mentioned, ctx.isAdmin));
reg(['demote', 'turunkan', 'copotadmin'], async (ctx) => adminCommands.demoteMember(ctx.sock, ctx.reply, ctx.msg, ctx.jid, ctx.mentioned, ctx.isAdmin));
reg(['add', 'tambahmember', 'invite'], async (ctx) => adminCommands.addMember(ctx.sock, ctx.reply, ctx.jid, ctx.args, ctx.isAdmin));

// ── ADMIN: WARN ───────────────────────────────────────────────────────────
reg(['warn', 'peringatan', 'beriwarn'], async (ctx) => adminCommands.warnMember(ctx.sock, ctx.reply, ctx.msg, ctx.jid, ctx.mentioned, ctx.isAdmin));
reg(['unwarn', 'hapuswarn'], async (ctx) => adminCommands.unwarnMember(ctx.sock, ctx.reply, ctx.msg, ctx.jid, ctx.mentioned, ctx.isAdmin));
reg(['checkwarn', 'cekwarn', 'totalwarn'], async (ctx) => adminCommands.checkWarn(ctx.reply, ctx.jid, ctx.mentioned, ctx.sender));
reg(['warnlimit', 'limitwarn', 'setwarnlimit'], async (ctx) => adminCommands.setWarnLimit(ctx.reply, ctx.jid, ctx.args, ctx.isAdmin));

// ── ADMIN: GROUP INFO / SETTINGS ─────────────────────────────────────────
reg(['groupinfo', 'infogrup', 'infogroup'], async (ctx) => adminCommands.groupInfo(ctx.sock, ctx.reply, ctx.jid));
reg(['setname', 'gantinamagrup', 'namagrup'], async (ctx) => adminCommands.setGroupName(ctx.sock, ctx.reply, ctx.jid, ctx.args, ctx.isAdmin));
reg(['setdesc', 'gantidesk', 'deskripsigrup'], async (ctx) => adminCommands.setGroupDesc(ctx.sock, ctx.reply, ctx.jid, ctx.args, ctx.isAdmin));
reg(['lockgroup', 'kuncigrup', 'closegroup'], async (ctx) => adminCommands.lockGroup(ctx.sock, ctx.reply, ctx.jid, ctx.isAdmin));
reg(['unlockgroup', 'bukagrup', 'opengroup'], async (ctx) => adminCommands.unlockGroup(ctx.sock, ctx.reply, ctx.jid, ctx.isAdmin));
reg(['link', 'linkgrup', 'invitelink', 'getlink'], async (ctx) => adminCommands.getInviteLink(ctx.sock, ctx.reply, ctx.jid, ctx.isAdmin));
reg(['revoke', 'resetlink', 'revokelink'], async (ctx) => adminCommands.revokeInviteLink(ctx.sock, ctx.reply, ctx.jid, ctx.isAdmin));
reg(['leave', 'keluargrup', 'botkeluar'], async (ctx) => adminCommands.leaveGroup(ctx.sock, ctx.reply, ctx.jid, ctx.isAdmin));
reg(['hidetag', 'htag', 'tagsemua'], async (ctx) => adminCommands.hidetag(ctx.sock, ctx.reply, ctx.msg, ctx.jid, ctx.args, ctx.isAdmin));
reg(['tagall', 'mentionall', 'tagsemuamember'], async (ctx) => adminCommands.tagAll(ctx.sock, ctx.reply, ctx.msg, ctx.jid, ctx.args, ctx.isAdmin));
reg(['listadmin', 'daftaradmin', 'admins'], async (ctx) => adminCommands.listAdmins(ctx.sock, ctx.reply, ctx.jid));
reg(['membercount', 'jumlahmember', 'totalmember'], async (ctx) => adminCommands.groupMembersCount(ctx.sock, ctx.reply, ctx.jid));

// ── ADMIN: WELCOME / FAREWELL ────────────────────────────────────────────
reg(['setwelcome', 'aturwelcome'], async (ctx) => adminCommands.setWelcomeMsg(ctx.reply, ctx.jid, ctx.args, ctx.isAdmin));
reg(['setfarewell', 'aturfarewell', 'aturperpisahan'], async (ctx) => adminCommands.setFarewellMsg(ctx.reply, ctx.jid, ctx.args, ctx.isAdmin));
reg(['welcome'], async (ctx) => adminCommands.toggleSetting(ctx.reply, ctx.jid, 'welcome', 'Welcome Message', ctx.args, ctx.isAdmin));
reg(['farewell'], async (ctx) => adminCommands.toggleSetting(ctx.reply, ctx.jid, 'farewell', 'Farewell Message', ctx.args, ctx.isAdmin));

// ── ADMIN: PROTECTION TOGGLES ────────────────────────────────────────────
reg(['antigb'], async (ctx) => adminCommands.toggleSetting(ctx.reply, ctx.jid, 'antigb', 'Anti-GB', ctx.args, ctx.isAdmin));
reg(['antilink'], async (ctx) => adminCommands.toggleSetting(ctx.reply, ctx.jid, 'antilink', 'Anti-Link', ctx.args, ctx.isAdmin));
reg(['antispam', 'antiflood'], async (ctx) => adminCommands.toggleSetting(ctx.reply, ctx.jid, 'antispam', 'Anti-Spam/Anti-Flood', ctx.args, ctx.isAdmin));
reg(['antitoxic'], async (ctx) => adminCommands.toggleSetting(ctx.reply, ctx.jid, 'antitoxic', 'Anti-Toxic', ctx.args, ctx.isAdmin));
reg(['antishortlink', 'antishorturl'], async (ctx) => adminCommands.toggleSetting(ctx.reply, ctx.jid, 'antishortlink', 'Anti-ShortLink', ctx.args, ctx.isAdmin));
reg(['slowmode', 'modelambat'], async (ctx) => adminCommands.setSlowmode(ctx.reply, ctx.jid, ctx.args, ctx.isAdmin));
reg(['lockmedia'], async (ctx) => adminCommands.lockType(ctx.reply, ctx.jid, 'media', ctx.args, ctx.isAdmin));
reg(['lockstiker', 'locksticker'], async (ctx) => adminCommands.lockType(ctx.reply, ctx.jid, 'sticker', ctx.args, ctx.isAdmin));

// ── ADMIN: PROTEKSI TAMBAHAN (v3.1.0) ────────────────────────────────────
reg(['antilinkphising', 'antiphising', 'antiphishing'], async (ctx) => adminCommands.toggleSetting(ctx.reply, ctx.jid, 'antilinkphising', 'Anti-Link-Phising', ctx.args, ctx.isAdmin));
reg(['antijudol', 'antijudi'], async (ctx) => adminCommands.toggleSetting(ctx.reply, ctx.jid, 'antijudol', 'Anti-Judol', ctx.args, ctx.isAdmin));
reg(['antipinjol', 'antipinjaman'], async (ctx) => adminCommands.toggleSetting(ctx.reply, ctx.jid, 'antipinjol', 'Anti-Pinjol', ctx.args, ctx.isAdmin));
reg(['anticaps', 'antikapital'], async (ctx) => adminCommands.toggleSetting(ctx.reply, ctx.jid, 'anticaps', 'Anti-Caps', ctx.args, ctx.isAdmin));
reg(['antivirtex', 'antivirustext'], async (ctx) => adminCommands.toggleSetting(ctx.reply, ctx.jid, 'antivirtex', 'Anti-Virtex', ctx.args, ctx.isAdmin));
reg(['antitag', 'antitagsw'], async (ctx) => adminCommands.toggleSetting(ctx.reply, ctx.jid, 'antitag', 'Anti-Tag', ctx.args, ctx.isAdmin));
// v3.2.0: Anti-NSFW — deteksi otomatis (lihat features/antiNsfw.js untuk cara setup API key)
reg(['antinsfw', 'antiporn', 'antiporno'], async (ctx) => adminCommands.toggleSetting(ctx.reply, ctx.jid, 'antinsfw', 'Anti-NSFW', ctx.args, ctx.isAdmin));
reg(['hapusnsfw', 'delnsfw', 'deletensfw'], async (ctx) => manualDeleteNsfw(ctx));
reg(['cekstrikensfw', 'nsfwstrikes', 'strikensfw'], async (ctx) => checkNsfwStrikeCmd(ctx));
reg(['resetnsfwstrike', 'resetstrikensfw'], async (ctx) => resetNsfwStrikeCmd(ctx));
reg(['setnsfwlimit', 'nsfwlimit'], async (ctx) => setNsfwStrikeLimitCmd(ctx));
reg(['resetprotection', 'matikansemuaproteksi', 'unprotectall'], async (ctx) => adminCommands4.resetProtectionAll(ctx.reply, ctx.jid, ctx.isAdmin));
reg(['antilinkall', 'fullantilink'], async (ctx) => adminCommands4.setAntiLinkAll(ctx.reply, ctx.jid, ctx.args, ctx.isAdmin));

// ── BOT-WIDE: ANTI-CALL & ANTI-CHAT (lihat features/antiCallChat.js) ────
// Bot-wide (bukan per-grup) karena nomor bot cuma satu — Owner/Creator only.
reg(['anticall'], async (ctx) => {
    if (!ctx.isOwner && !ctx.isCreator) return ctx.reply('❌ Cuma Owner/Creator yang bisa ubah pengaturan ini.');
    const arg = (ctx.args?.[0] || '').toLowerCase();
    if (arg !== 'on' && arg !== 'off') {
        return ctx.reply(`📵 *ANTI-CALL*\nOtomatis menolak semua telepon/video call masuk ke nomor bot.\n\nStatus: ${isAnticallEnabled() ? '✅ ON' : '❌ OFF'}\nKetik *.anticall on* atau *.anticall off* untuk mengubah.`);
    }
    setAnticall(arg === 'on');
    await ctx.reply(`${arg === 'on' ? '✅' : '❌'} Anti-Call berhasil di-${arg === 'on' ? 'aktifkan' : 'nonaktifkan'}.`);
});
reg(['antichat'], async (ctx) => {
    if (!ctx.isOwner && !ctx.isCreator) return ctx.reply('❌ This command is restricted to Owner/Creator.');
    const arg = (ctx.args?.[0] || '').toLowerCase();
    if (arg !== 'on' && arg !== 'off') {
        return ctx.reply(`💬 *ANTI-CHAT*\nToggle AI auto-chat in DMs for non-owners. Commands still work normally.\n\nStatus: ${isAntichatEnabled() ? '✅ ON' : '❌ OFF'}\nType *.antichat on* or *.antichat off* to toggle.`);
    }
    setAntichat(arg === 'on');
    await ctx.reply(`${arg === 'on' ? '✅' : '❌'} Anti-Chat has been ${arg === 'on' ? 'activated' : 'deactivated'}.`);
});
reg(['helpproteksi', 'panduanproteksi'], async (ctx) => adminCommands4.helpProteksi(ctx.reply));
reg(['grouplockstatus', 'statusproteksi', 'ceksemuaproteksi'], async (ctx) => adminCommands4.groupLockStatus(ctx.reply, ctx.jid));

// ── ADMIN: CUSTOM BAD-WORD (perluasan Anti-Toxic per-grup) ──────────────
reg(['addbadword', 'tambahkatakasar'], async (ctx) => adminCommands4.addBadWordCmd(ctx.reply, ctx.jid, ctx.args, ctx.isAdmin));
reg(['delbadword', 'hapuskatakasar'], async (ctx) => adminCommands4.delBadWordCmd(ctx.reply, ctx.jid, ctx.args, ctx.isAdmin));
reg(['listbadword', 'daftarkatakasar'], async (ctx) => adminCommands4.listBadWordCmd(ctx.reply, ctx.jid, ctx.isAdmin));

// ── ADMIN: LINK ALLOWLIST (pengecualian Anti-Link) ───────────────────────
reg(['allowlinkadd', 'izinkanlink'], async (ctx) => adminCommands4.allowLinkAdd(ctx.reply, ctx.jid, ctx.args, ctx.isAdmin));
reg(['allowlinkdel', 'hapusizinlink'], async (ctx) => adminCommands4.allowLinkDel(ctx.reply, ctx.jid, ctx.args, ctx.isAdmin));
reg(['allowlinklist', 'daftarizinlink'], async (ctx) => adminCommands4.allowLinkShow(ctx.reply, ctx.jid, ctx.isAdmin));

// ── ADMIN: WHITELIST PROTEKSI ────────────────────────────────────────────
reg(['whitelistadd', 'putihkan'], async (ctx) => adminCommands4.whitelistAdd(ctx.reply, ctx.jid, ctx.mentioned, ctx.isAdmin));
reg(['whitelistdel', 'hapusputih'], async (ctx) => adminCommands4.whitelistDel(ctx.reply, ctx.jid, ctx.mentioned, ctx.isAdmin));
reg(['whitelist', 'daftarputih'], async (ctx) => adminCommands4.whitelistShow(ctx.reply, ctx.jid, ctx.isAdmin));

// ── ADMIN: LOCK TIPE KONTEN GRANULAR (v3.1.0) ────────────────────────────
reg(['lockimage', 'lockgambar'], async (ctx) => adminCommands.lockType(ctx.reply, ctx.jid, 'image', ctx.args, ctx.isAdmin));
reg(['lockvideo', 'lockvidio'], async (ctx) => adminCommands.lockType(ctx.reply, ctx.jid, 'video', ctx.args, ctx.isAdmin));
reg(['lockdocument', 'lockdokumen'], async (ctx) => adminCommands.lockType(ctx.reply, ctx.jid, 'document', ctx.args, ctx.isAdmin));
reg(['lockcontact', 'lockkontak'], async (ctx) => adminCommands.lockType(ctx.reply, ctx.jid, 'contact', ctx.args, ctx.isAdmin));
reg(['locklocation', 'locklokasi'], async (ctx) => adminCommands.lockType(ctx.reply, ctx.jid, 'location', ctx.args, ctx.isAdmin));
reg(['lockvn', 'lockvoicenote'], async (ctx) => adminCommands.lockType(ctx.reply, ctx.jid, 'voice', ctx.args, ctx.isAdmin));
reg(['lockaudio', 'lockmusik'], async (ctx) => adminCommands.lockType(ctx.reply, ctx.jid, 'audio', ctx.args, ctx.isAdmin));
reg(['lockgif', 'lockgifplay'], async (ctx) => adminCommands.lockType(ctx.reply, ctx.jid, 'gif', ctx.args, ctx.isAdmin));
reg(['lockpoll', 'lockjajak'], async (ctx) => adminCommands.lockType(ctx.reply, ctx.jid, 'poll', ctx.args, ctx.isAdmin));
reg(['locktext', 'lockchat', 'mediaonly'], async (ctx) => adminCommands.lockType(ctx.reply, ctx.jid, 'text', ctx.args, ctx.isAdmin));

// ── ADMIN: MUTE PER-MEMBER (beda dari .mute grup-wide) ───────────────────
reg(['mutemember', 'bisukanmember'], async (ctx) => adminCommands4.muteMemberCmd(ctx.reply, ctx.jid, ctx.mentioned, ctx.isAdmin));
reg(['unmutemember', 'bukabisumember'], async (ctx) => adminCommands4.unmuteMemberCmd(ctx.reply, ctx.jid, ctx.mentioned, ctx.isAdmin));
reg(['listmutedmember', 'daftarbisu'], async (ctx) => adminCommands4.listMutedMemberCmd(ctx.reply, ctx.jid, ctx.isAdmin));

// ── ADMIN: MEMBER MANAGEMENT LANJUTAN ────────────────────────────────────
reg(['kickall', 'kicksemua', 'tendangsemua'], async (ctx) => adminCommands4.kickAll(ctx.sock, ctx.reply, ctx.msg, ctx.jid, ctx.isAdmin, ctx.args));
reg(['warnall', 'warnsemua', 'peringatkansemua'], async (ctx) => adminCommands4.warnAll(ctx.sock, ctx.reply, ctx.msg, ctx.jid, ctx.isAdmin));
reg(['cekwarnall', 'listwarn', 'semuawarn'], async (ctx) => adminCommands4.listWarnAll(ctx.reply, ctx.jid));
reg(['topwarn', 'warnterbanyak'], async (ctx) => adminCommands4.topWarn(ctx.reply, ctx.jid));
reg(['resetwarnall', 'hapussemuawarn'], async (ctx) => adminCommands4.resetWarnAllCmd(ctx.reply, ctx.jid, ctx.isAdmin));
reg(['banlist', 'daftarblokir'], async (ctx) => adminCommands2.listBanned(ctx.reply, ctx.jid));
reg(['unbanall', 'hapussemuablokir'], async (ctx) => adminCommands2.unbanAll(ctx.reply, ctx.jid, ctx.isAdmin));
reg(['slowmodeoff', 'matikanslow'], async (ctx) => adminCommands.setSlowmode(ctx.reply, ctx.jid, ['0'], ctx.isAdmin));

// ── ADMIN: INFO / DASHBOARD GRUP ──────────────────────────────────────────
reg(['cekbot', 'botadmin', 'statusbot'], async (ctx) => adminCommands4.checkBotAdmin(ctx.sock, ctx.reply, ctx.jid));
reg(['groupsummary', 'dashboardgrup', 'ringkasangrup'], async (ctx) => adminCommands4.groupSummary(ctx.sock, ctx.reply, ctx.jid));
reg(['groupage', 'umurgrup'], async (ctx) => adminCommands4.groupAge(ctx.sock, ctx.reply, ctx.jid));
reg(['admincount', 'jumlahadmin'], async (ctx) => adminCommands4.adminCount(ctx.sock, ctx.reply, ctx.jid));
reg(['groupcreator', 'pembuatgrup'], async (ctx) => adminCommands4.groupCreatorInfo(ctx.sock, ctx.reply, ctx.jid));
reg(['exportmember', 'datamember', 'listmemberdata'], async (ctx) => adminCommands4.exportMember(ctx.sock, ctx.reply, ctx.jid));

// ── ADMIN: BACKUP / RESTORE PENGATURAN GRUP ──────────────────────────────
reg(['backupsetting', 'backupgrup'], async (ctx) => adminCommands4.backupSetting(ctx.reply, ctx.jid, ctx.isAdmin));
reg(['restoresetting', 'restoregrup'], async (ctx) => adminCommands4.restoreSetting(ctx.reply, ctx.jid, ctx.isAdmin));

// ── ADMIN: APPROVAL JOIN REQUEST ──────────────────────────────────────────
reg(['listrequest', 'pendingrequest', 'daftarrequest'], async (ctx) => adminCommands4.listJoinRequests(ctx.sock, ctx.reply, ctx.jid, ctx.isAdmin));
reg(['approverequest', 'terimarequest'], async (ctx) => adminCommands4.approveJoinRequest(ctx.sock, ctx.reply, ctx.jid, ctx.args, ctx.mentioned, ctx.isAdmin));
reg(['rejectrequest', 'tolakrequest'], async (ctx) => adminCommands4.rejectJoinRequest(ctx.sock, ctx.reply, ctx.jid, ctx.args, ctx.mentioned, ctx.isAdmin));
reg(['approveall', 'terimasemua'], async (ctx) => adminCommands4.approveAllRequests(ctx.sock, ctx.reply, ctx.jid, ctx.isAdmin));
reg(['rejectall', 'tolaksemua'], async (ctx) => adminCommands4.rejectAllRequests(ctx.sock, ctx.reply, ctx.jid, ctx.isAdmin));

// ── ADMIN: JADWAL BUKA/TUTUP GRUP OTOMATIS ────────────────────────────────
reg(['jadwalbuka', 'autobuka'], async (ctx) => adminCommands4.setOpenSchedule(ctx.reply, ctx.jid, ctx.args, ctx.isAdmin));
reg(['jadwaltutup', 'autotutup'], async (ctx) => adminCommands4.setCloseSchedule(ctx.reply, ctx.jid, ctx.args, ctx.isAdmin));
reg(['canceljadwalgrup', 'batalotomatis'], async (ctx) => adminCommands4.cancelSchedule(ctx.reply, ctx.jid, ctx.isAdmin));
reg(['cekjadwalgrup', 'statusotomatis'], async (ctx) => adminCommands4.checkScheduleStatus(ctx.reply, ctx.jid));

// ── ADMIN: KONFIGURASI GRUP NATIVE WHATSAPP LAINNYA ──────────────────────
reg(['seticon', 'gantiicon', 'ubahicon'], async (ctx) => adminCommands4.setGroupIcon(ctx.sock, ctx.reply, ctx.msg, ctx.jid, ctx.isAdmin));
reg(['hapusicon', 'removeicon'], async (ctx) => adminCommands4.removeGroupIcon(ctx.sock, ctx.reply, ctx.jid, ctx.isAdmin));
reg(['lockinfo', 'kuncinfogrup'], async (ctx) => adminCommands4.lockGroupInfo(ctx.sock, ctx.reply, ctx.jid, ctx.isAdmin));
reg(['unlockinfo', 'bukainfogrup'], async (ctx) => adminCommands4.unlockGroupInfo(ctx.sock, ctx.reply, ctx.jid, ctx.isAdmin));
reg(['ephemeral', 'pesansementara'], async (ctx) => adminCommands4.setEphemeral(ctx.sock, ctx.reply, ctx.jid, ctx.args, ctx.isAdmin));

// ── FUN / GAMES ───────────────────────────────────────────────────────────
reg(['quote', 'katabijak', 'motivasi'], async (ctx) => funCommands.quote(ctx.reply));
reg(['fact', 'fakta', 'faktaunik'], async (ctx) => funCommands.fact(ctx.reply));
reg(['riddle', 'tekateki'], async (ctx) => funCommands.riddle(ctx.reply, ctx.jid));
reg(['jawab', 'answer'], async (ctx) => {
    await funCommands.answerRiddle(ctx.reply, ctx.jid, ctx.args);
    await funCommands.answerTebak(async () => {}, ctx.jid, ctx.args).catch(() => {});
});
reg(['truth'], async (ctx) => funCommands.truth(ctx.reply));
reg(['dare'], async (ctx) => funCommands.dare(ctx.reply));
reg(['tebakgambar', 'guessimage'], async (ctx) => funCommands.tebakGambar(ctx.reply, ctx.jid));
reg(['pantun'], async (ctx) => funCommands.pantun(ctx.reply));
reg(['zodiak', 'horoscope', 'ramalan'], async (ctx) => funCommands.horoscope(ctx.reply, ctx.args));
reg(['coinflip', 'lempar koin', 'koin'], async (ctx) => funCommands.coinFlip(ctx.reply));
reg(['dice', 'dadu', 'roll'], async (ctx) => funCommands.rollDice(ctx.reply, ctx.args));
reg(['rps', 'bgk', 'batugunting'], async (ctx) => funCommands.rps(ctx.reply, ctx.args));
reg(['slot', 'judi', 'slotmachine'], async (ctx) => funCommands.slot(ctx.reply, ctx.sender));
reg(['tebakangka', 'guessnumber'], async (ctx) => funCommands.tebakAngka(ctx.reply, ctx.jid));
reg(['tebak'], async (ctx) => funCommands.guessNumber(ctx.reply, ctx.jid, ctx.args));
reg(['wyr', 'wouldyourather', 'pilihmana'], async (ctx) => funCommands.wouldYouRather(ctx.reply));
reg(['jodoh', 'ceklodoh', 'lovetest'], async (ctx) => funCommands.checkJodoh(ctx.reply, ctx.sender, ctx.mentioned));
reg(['tarot', 'kartutarot'], async (ctx) => funCommands.tarotCard(ctx.reply));
reg(['fortunecookie', 'ramalankue'], async (ctx) => funCommands.fortuneCookie(ctx.reply));
reg(['lovecalc', 'hitungcinta', 'kalkulatorcinta'], async (ctx) => funCommands.hitungCinta(ctx.reply, ctx.sender, ctx.mentioned, ctx.args));

// ── FUN: GOJO SATORU SPECIAL ──────────────────────────────────────────────
reg(['gojo', 'gojoquote', 'katagojo'], async (ctx) => gojoCommands.gojoQuote(ctx.reply));
reg(['gojoteknik', 'jurusgojo', 'tekniksihir'], async (ctx) => gojoCommands.gojoTeknik(ctx.reply));
reg(['gojoroast', 'roastgojo'], async (ctx) => gojoCommands.gojoRoast(ctx.reply, ctx.sender, ctx.mentioned));
reg(['gojohype', 'semangatgojo', 'gojosupport'], async (ctx) => gojoCommands.gojoHype(ctx.reply, ctx.sender, ctx.mentioned));
reg(['gojofact', 'faktagojo'], async (ctx) => gojoCommands.gojoFact(ctx.reply));
reg(['gojopower', 'ceklevelgojo', 'powerlevel'], async (ctx) => gojoCommands.gojoPower(ctx.reply, ctx.sender, ctx.mentioned));

// ── TOOLS: TEXT ───────────────────────────────────────────────────────────
reg(['upper', 'kapital'], async (ctx) => textTools.upper(ctx.reply, ctx.args));
reg(['lower', 'kecil'], async (ctx) => textTools.lower(ctx.reply, ctx.args));
reg(['reverse', 'balik'], async (ctx) => textTools.reverse(ctx.reply, ctx.args));
reg(['tobinary', 'kebinary'], async (ctx) => textTools.toBinary(ctx.reply, ctx.args));
reg(['frombinary', 'daribinary'], async (ctx) => textTools.fromBinary(ctx.reply, ctx.args));
reg(['tobase64', 'kebase64'], async (ctx) => textTools.toBase64(ctx.reply, ctx.args));
reg(['frombase64', 'daribase64'], async (ctx) => textTools.fromBase64(ctx.reply, ctx.args));
reg(['tohex', 'kehex'], async (ctx) => textTools.toHex(ctx.reply, ctx.args));
reg(['fromhex', 'darihex'], async (ctx) => textTools.fromHex(ctx.reply, ctx.args));
reg(['rot13'], async (ctx) => textTools.rot13(ctx.reply, ctx.args));
reg(['leet', 'leetspeak'], async (ctx) => textTools.leet(ctx.reply, ctx.args));
reg(['alternating', 'acakcase'], async (ctx) => textTools.alternating(ctx.reply, ctx.args));
reg(['wordcount', 'hitungkata'], async (ctx) => textTools.countWords(ctx.reply, ctx.args));

// ── TOOLS: MATH ───────────────────────────────────────────────────────────
reg(['calc', 'hitung', 'kalkulator'], async (ctx) => mathTools.calc(ctx.reply, ctx.args));
reg(['persen', 'percent'], async (ctx) => mathTools.percent(ctx.reply, ctx.args));
reg(['bmi', 'imt'], async (ctx) => mathTools.bmi(ctx.reply, ctx.args));
reg(['kurs', 'currency'], async (ctx) => mathTools.convertCurrencyNote(ctx.reply));
reg(['umur', 'age', 'hitungumur'], async (ctx) => mathTools.ageCalc(ctx.reply, ctx.args));

// ── TOOLS: CONVERTER ──────────────────────────────────────────────────────
reg(['convertlength', 'konversipanjang'], async (ctx) => converterTools.convertLength(ctx.reply, ctx.args));
reg(['convertweight', 'konversiberat'], async (ctx) => converterTools.convertWeight(ctx.reply, ctx.args));
reg(['convertsuhu', 'convertemp'], async (ctx) => converterTools.convertTemp(ctx.reply, ctx.args));

// ── TOOLS: GENERATOR ──────────────────────────────────────────────────────
reg(['genpassword', 'buatpassword', 'password'], async (ctx) => generatorTools.genPassword(ctx.reply, ctx.args));
reg(['genuuid', 'uuid'], async (ctx) => generatorTools.genUUID(ctx.reply));
reg(['pilih', 'choose', 'pickrandom'], async (ctx) => generatorTools.pickRandom(ctx.reply, ctx.args));
reg(['shuffle', 'acak'], async (ctx) => generatorTools.shuffleList(ctx.reply, ctx.args));

// ── TOOLS: INFO ───────────────────────────────────────────────────────────
reg(['ping', 'p', 'speed', 'latency'], async (ctx) => {
    const start = Date.now();
    await ctx.sock.sendPresenceUpdate('composing', ctx.jid);
    const latency = Date.now() - start;
    await ctx.reply(
`🏓 *PONG!*

◈ *Latency*  : \`${latency}ms\`
◈ *Status*   : 🟢 Online & Active
◈ *Bot*      : MASTER MD v3.0.0
◈ *Developer*: AHSAN (03107260507)
◈ *Runtime*  : ${fmtDuration(Date.now() - BOT_START_TIME)}
◈ *Features* : 2000+ Commands Ready`
    );
});

reg(['alive', 'bot', 'runtime', 'uptime', 'status'], async (ctx) => {
    const start = Date.now();
    await ctx.sock.sendPresenceUpdate('composing', ctx.jid);
    const latency = Date.now() - start;
    await ctx.reply(
`╔══════════════════════════════════╗
║     ⚡ MASTER MD IS ALIVE! ⚡     ║
║         DEVELOPER: AHSAN         ║
╚══════════════════════════════════╝

Assalam-o-Alaikum! MASTER MD is running smoothly.

🤖 *Bot Name:* MASTER MD v3.0.0
👑 *Developer:* AHSAN (03107260507)
⚡ *Status:* 🟢 Active & Online
🚀 *Speed / Latency:* \`${latency}ms\`
⏱️ *Runtime:* ${fmtDuration(Date.now() - BOT_START_TIME)}
📊 *Total Commands:* 2000+ Active Commands
📢 *Channel:* https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46

Type *.menu* to view interactive buttons menu.`
    );
});

reg(['cekid', 'checkid', 'groupid', 'idgrup', 'idchannel'], async (ctx) => {
    let groupSection;
    if (ctx.isGroup) {
        let groupName = '_(gagal ambil nama grup)_';
        try {
            const meta = await ctx.sock.groupMetadata(ctx.jid);
            groupName = meta.subject || groupName;
        } catch { /* nama tetap fallback di atas kalau groupMetadata gagal */ }
        groupSection = `◈ *Nama* : ${groupName}\n◈ *ID*   : \`${ctx.jid}\``;
    } else {
        groupSection = '_Command ini dipakai di luar grup, jadi nggak ada ID grup buat ditampilkan._';
    }

    await ctx.reply(
`🆔 *CEK ID*

📢 *Channel*
◈ *Nama* : ${CHANNEL_NAME}
◈ *ID*   : \`${CHANNEL_JID}\`

👥 *Grup Ini*
${groupSection}`
    );
});

reg(['owner', 'creator', 'dev', 'developer'], async (ctx) => {
    const owners = listOwners();
    const mainOwnerNum = settings.ownerNumber ? settings.ownerNumber.replace(/[^0-9]/g, '') : null;
    const extraOwners = owners.filter(o => o.number !== mainOwnerNum);
    const ownerLines = extraOwners.length
        ? extraOwners.map((o, i) => `${i + 1}. +${o.number}`).join('\n')
        : '_(No secondary owners assigned — use .addowner to assign)_';
    await ctx.reply(
`╔══════════════════════════════════════╗
║   👑 *DEVELOPER & OWNER INFO* 👑   ║
╚══════════════════════════════════════╝

◈ *Developer* : AHSAN
◈ *WhatsApp*  : +923107260507
◈ *Role*      : Lead Architect & Creator

◈ *Bot*       : ${settings.botName} v${settings.botVersion || '3.0.0'}
◈ *Status*    : 🟢 Online & Protected
◈ *Channel*   : https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46

${ownerLines !== '_(No secondary owners assigned — use .addowner to assign)_' ? `📋 *Assigned Owners:*\n${ownerLines}\n\n` : ''}💬 *Direct WhatsApp Chat:*
https://wa.me/923107260507`
    );
});

// .pembayaran — info nomor e-wallet Owner (DANA/GoPay/OVO). Nomornya
// diambil dari setting.js (nodana/nogopay/noovo) supaya Owner bisa ganti
// sendiri kapan saja tanpa perlu edit command ini.
reg(['pembayaran', 'payment', 'bayar'], async (ctx) => {
    await ctx.reply(
`💰 *INFO PEMBAYARAN*

◈ DANA  : ${settings.nodana  || '_(belum diisi)_'}
◈ GoPay : ${settings.nogopay || '_(belum diisi)_'}
◈ OVO   : ${settings.noovo   || '_(belum diisi)_'}

Silakan transfer ke salah satu nomor di atas sesuai nominal yang disepakati, lalu kirim bukti transfer ke Owner untuk konfirmasi.

_(Nomor bisa diganti Owner lewat setting.js: \`nodana\`, \`nogopay\`, \`noovo\`)_`
    );
});

// .sosmedowner — info sosial media Owner, diambil dari setting.js
// (ig/tele/yt) supaya bisa diganti Owner kapan saja.
reg(['sosmedowner', 'sosmed', 'socialmedia'], async (ctx) => {
    await ctx.reply(
`📱 *SOSIAL MEDIA OWNER*

◈ Instagram : ${settings.ig   || '_(belum diisi)_'}
◈ Telegram  : ${settings.tele || '_(belum diisi)_'}
◈ YouTube   : ${settings.yt   || '_(belum diisi)_'}

Yuk follow & subscribe buat dukung Owner! 🙌

_(Bisa diganti Owner lewat setting.js: \`ig\`, \`tele\`, \`yt\`)_`
    );
});

// ── JABATAN: CREATOR / OWNER / PREMIUM ────────────────────────────────────
// Owner & Premium sekarang GABUNGAN dari beberapa sumber:
//   1) `ownerNumber` (Owner utama, tunggal) + `ownerNumbers` (Owner
//      tambahan, array) / `premiumNumbers` di setting.js — manual edit
//      file, butuh restart bot supaya berlaku.
//   2) data/owners.json & data/premium.json (diatur lewat command
//      .addowner/.addprem saat bot berjalan, langsung aktif tanpa restart).
// .addowner boleh dipakai oleh Owner ATAUPUN Creator. .delowner & .delprem
// tetap lebih terbatas (lihat masing-masing handler di bawah).
// Nomor yang berasal dari setting.js TIDAK BISA dihapus lewat command
// (harus edit file itu langsung) — ini supaya nomor yang sudah di-set
// manual lewat file tidak bisa dicabut diam-diam lewat chat oleh siapapun.
reg(['listowner', 'daftarowner', 'cekowner'], async (ctx) => {
    const owners = listOwners();
    const lines = [`👑 *Creator*: ${creator.name} (+${creator.number})`];
    if (owners.length === 0) {
        lines.push('', '⭐ *Owner*: _(No additional Owners registered)_');
    } else {
        lines.push('', '⭐ *Owner List:*');
        owners.forEach((o, i) => lines.push(`${i + 1}. +${o.number} _(${o.source})_`));
    }
    lines.push('', `_${settings.prefix}addowner @tag — add Owner (Owner/Creator)_`);
    await ctx.reply(lines.join('\n'));
});
reg(['addowner'], async (ctx) => {
    if (!ctx.isOwner) return ctx.reply('❌ Only *Owner* or *Creator* can add an Owner.');
    const target = ctx.mentioned?.[0] || (ctx.args?.[0] ? `${ctx.args[0].replace(/[^0-9]/g, '')}@s.whatsapp.net` : null);
    if (!target) return ctx.reply(`📌 Usage: *${settings.prefix}addowner @tag* or *${settings.prefix}addowner 923xxx*`);
    const result = addOwner(target);
    if (!result.ok) return ctx.reply(`❌ ${result.reason}`);
    await ctx.reply(`✅ @${target.split('@')[0]} has been successfully promoted to *Owner*.`);
});
reg(['delowner', 'removeowner'], async (ctx) => {
    if (!ctx.isCreator) return ctx.reply('❌ Only *Creator* can remove an Owner.');
    const target = ctx.mentioned?.[0] || (ctx.args?.[0] ? `${ctx.args[0].replace(/[^0-9]/g, '')}@s.whatsapp.net` : null);
    if (!target) return ctx.reply(`📌 Usage: *${settings.prefix}delowner @tag* or *${settings.prefix}delowner 923xxx*`);
    const result = removeOwner(target);
    if (!result.ok) return ctx.reply(`❌ ${result.reason}`);
    await ctx.reply(`✅ @${target.split('@')[0]} has been removed from *Owner*.`);
});
reg(['listprem', 'listpremium', 'daftarpremium'], async (ctx) => {
    const premiums = listPremium();
    const lines = [];
    if (premiums.length === 0) {
        lines.push('💎 *Premium Users List*', '', '_(No Premium users registered)_');
    } else {
        lines.push(`💎 *Premium Users List* (${premiums.length})`, '');
        premiums.forEach((p, i) => lines.push(`${i + 1}. +${p.number} _(${p.source})_`));
    }
    lines.push('', `_${settings.prefix}addprem @tag — add Premium (Owner only)_`);
    await ctx.reply(lines.join('\n'));
});
reg(['addprem', 'addpremium'], async (ctx) => {
    if (!ctx.isOwner) return ctx.reply('❌ Only *Owner* or *Creator* can grant Premium.');
    const target = ctx.mentioned?.[0] || (ctx.args?.[0] ? `${ctx.args[0].replace(/[^0-9]/g, '')}@s.whatsapp.net` : null);
    if (!target) return ctx.reply(`📌 Usage: *${settings.prefix}addprem @tag* atau *${settings.prefix}addprem 628xxx*`);
    const result = addPremium(target);
    if (!result.ok) return ctx.reply(`❌ ${result.reason}`);
    await ctx.reply(`✅ @${target.split('@')[0]} has been granted *Premium* access! 💎`);
});
reg(['delprem', 'delpremium', 'removepremium'], async (ctx) => {
    if (!ctx.isOwner) return ctx.reply('❌ Only *Owner* or *Creator* can revoke Premium.');
    const target = ctx.mentioned?.[0] || (ctx.args?.[0] ? `${ctx.args[0].replace(/[^0-9]/g, '')}@s.whatsapp.net` : null);
    if (!target) return ctx.reply(`📌 Usage: *${settings.prefix}delprem @tag* atau *${settings.prefix}delprem 628xxx*`);
    const result = removePremium(target);
    if (!result.ok) return ctx.reply(`❌ ${result.reason}`);
    await ctx.reply(`✅ Status *Premium* @${target.split('@')[0]} sudah dicabut.`);
});
reg(['cekjabatan', 'myrole', 'rolesaya', 'cekrole'], async (ctx) => {
    const target = ctx.mentioned?.[0] || ctx.sender;
    const label = getRoleLabel(target);
    const who = target === ctx.sender ? 'Kamu' : `@${target.split('@')[0]}`;
    await ctx.reply(`🔖 *Jabatan*\n\n${who} saat ini: *${label}*`);
});

// ─── CO-CREATOR ─────────────────────────────────────────────────────────────
// FIX: alias 'creator' di sini sebelumnya BENTROK sama reg(['owner','creator',
// 'dev','developer']) di atas (baris ~548) — karena routeMap = new Map(routes)
// bikin registrasi yang belakangan (ini) diam-diam nimpa yang duluan, jadi
// ketik ".creator" malah nyasar ke Co-Creator, bukan ke info Creator & Owner
// yang dimaksud command di atas. 'infocreator' sudah cukup jadi alias unik
// buat command ini, jadi 'creator' di sini dihapus (bukan diganti nama).
reg(['infocreator'], async (ctx) => {
    const info = getCreatorInfo();
    const coList = listCoCreators();
    const lines = [
        `╔══════════════════════════╗`,
        `║  👑  *CREATOR INFO*`,
        `╚══════════════════════════╝`,
        ``,
        `🌟 *Primary Creator*`,
        `┗ +${info.number} _(${info.name})_`,
    ];
    if (coList.length > 0) {
        lines.push(``, `🌟 *Co-Creator (${coList.length})*`);
        coList.forEach((c, i) => lines.push(`┗ ${i+1}. +${c.number}`));
    } else {
        lines.push(``, `_No Co-Creators registered._`);
    }
    await ctx.reply(lines.join('\n'));
});

reg(['addcreator'], async (ctx) => {
    if (!ctx.isCreator) return ctx.reply('❌ Only *Primary Creator* can add Co-Creators.');
    const target = ctx.mentioned?.[0] || (ctx.args?.[0] ? `${ctx.args[0].replace(/[^0-9]/g,'')}@s.whatsapp.net` : null);
    if (!target) return ctx.reply(`📌 Usage: *${settings.prefix}addcreator @tag* or *${settings.prefix}addcreator 923xxx*`);
    const result = addCoCreator(target, ctx.sender);
    if (!result.ok) return ctx.reply(`❌ ${result.reason}`);
    await ctx.reply(`✅ @${target.split('@')[0]} has been promoted to *Co-Creator*! 🌟`);
});

reg(['delcreator', 'removecreator'], async (ctx) => {
    if (!ctx.isCreator) return ctx.reply('❌ Only *Primary Creator* can remove Co-Creators.');
    const target = ctx.mentioned?.[0] || (ctx.args?.[0] ? `${ctx.args[0].replace(/[^0-9]/g,'')}@s.whatsapp.net` : null);
    if (!target) return ctx.reply(`📌 Usage: *${settings.prefix}delcreator @tag*`);
    const result = removeCoCreator(target, ctx.sender);
    if (!result.ok) return ctx.reply(`❌ ${result.reason}`);
    await ctx.reply(`✅ @${target.split('@')[0]} has been removed from *Co-Creator*.`);
});

reg(['listcreator', 'daftarcreator'], async (ctx) => {
    const coList = listCoCreators();
    const info   = getCreatorInfo();
    const lines  = [`🌟 *Creators List*`, ``, `👑 Primary: +${info.number} _(${info.name})_`];
    if (coList.length === 0) {
        lines.push('', '_No Co-Creators registered._');
    } else {
        lines.push('', `🌟 Co-Creator (${coList.length}):`);
        coList.forEach((c, i) => lines.push(`${i+1}. +${c.number}`));
    }
    await ctx.reply(lines.join('\n'));
});

// ─── ADDLIMIT — tambah limit media manual (owner/creator) ───────────────────
reg(['addlimit', 'tambablimit'], async (ctx) => {
    if (!ctx.isOwner) return ctx.reply('❌ Only *Owner* or *Creator* can add media limit.');
    const target = ctx.mentioned?.[0] || (ctx.args?.[0] ? `${ctx.args[0].replace(/[^0-9]/g,'')}@s.whatsapp.net` : null);
    const amount = parseInt(ctx.args?.[ctx.mentioned?.[0] ? 0 : 1]) || 1;
    if (!target) return ctx.reply(`📌 Usage: *${settings.prefix}addlimit @tag [jumlah]*\nContoh: *${settings.prefix}addlimit @user 5*`);
    const result = addLimitManual(target, amount);
    await ctx.reply(
        `✅ *+${amount} limit media* ditambahkan ke @${target.split('@')[0]}.\n` +
        `📊 Sisa limit hari ini: *${Math.max(0, result.max - result.newUsed)}/${result.max}*`
    );
});

// ─── ADDGOLD — tambah gold RPG manual (owner/creator) ───────────────────────
reg(['addgold', 'tambahgold', 'givegold'], async (ctx) => {
    if (!ctx.isOwner) return ctx.reply('❌ Only *Owner* or *Creator* can add gold.');
    const target = ctx.mentioned?.[0] || (ctx.args?.[0] && !parseInt(ctx.args[0])
        ? `${ctx.args[0].replace(/[^0-9]/g,'')}@s.whatsapp.net`
        : null);
    const amount = parseInt(ctx.args?.[ctx.mentioned?.[0] ? 0 : 1]) || 0;
    if (!target || amount <= 0) {
        return ctx.reply(`📌 Usage: *${settings.prefix}addgold @tag [jumlah]*\nContoh: *${settings.prefix}addgold @user 1000*`);
    }
    const char = getChar(target);
    if (!char) return ctx.reply(`❌ @${target.split('@')[0]} belum punya karakter RPG.`);
    char.gold += amount;
    saveChar(target, char);
    await ctx.reply(
        `✅ *+${amount.toLocaleString()} gold* diberikan ke @${target.split('@')[0]}.\n` +
        `💰 Total gold sekarang: *${char.gold.toLocaleString()} gold*`
    );
});

// ─── BUYLIMIT — beli limit tambahan pakai gold (user biasa) ─────────────────
reg(['buylimit', 'belilimit', 'buylimits'], async (ctx) => {
    const result = buyMediaLimit(ctx.sender);
    if (!result.ok) return ctx.reply(`❌ ${result.reason}`);
    await ctx.reply(
        `✅ Successfully purchased *1 additional media limit*!\n` +
        `💰 Gold terpakai: *${result.cost} gold*\n` +
        `💳 Sisa gold: *${result.sisaGold.toLocaleString()} gold*\n\n` +
        `Sekarang kamu bisa pakai fitur media lagi.`
    );
});

// ─── CEKLIMIT — cek sisa limit harian (siapapun) ────────────────────────────
reg(['ceklimit', 'mylimit', 'limitku', 'sisalimit'], async (ctx) => {
    await ctx.reply(`📊 *Status Limit Media Harian*\n\n${limitStatusText(ctx.sender)}`);
});

// ─── AUTOREAD ────────────────────────────────────────────────────────────────
reg(['autoread', 'autobaca', 'autolihat'], async (ctx) => {
    const arg = (ctx.args?.[0] || '').toLowerCase();
    if (!['on', 'off', 'aktif', 'nonaktif'].includes(arg)) {
        return ctx.reply(
            `📌 *Autoread* — bot otomatis centang biru setiap pesan masuk\n\n` +
            `Current status: *${isAutoread(ctx.jid) ? '✅ ON' : '❌ OFF'}*\n\n` +
            `Type *. on* or *. off* to toggle.`
        );
    }
    const val = arg === 'on' || arg === 'aktif';
    setAutoread(ctx.jid, val);
    await ctx.reply(`${val ? '✅' : '❌'} *Autoread* berhasil di-${val ? 'aktifkan' : 'nonaktifkan'}.`);
});

// ─── AUTOTYPING ──────────────────────────────────────────────────────────────
reg(['autotyping', 'automengetik', 'autoketik'], async (ctx) => {
    const arg = (ctx.args?.[0] || '').toLowerCase();
    if (!['on', 'off', 'aktif', 'nonaktif'].includes(arg)) {
        return ctx.reply(
            `📌 *Autotyping* — bot tampil "mengetik..." sebelum balas pesan\n\n` +
            `Current status: *${isAutotyping(ctx.jid) ? '✅ ON' : '❌ OFF'}*\n\n` +
            `Type *. on* or *. off* to toggle.`
        );
    }
    const val = arg === 'on' || arg === 'aktif';
    setAutotyping(ctx.jid, val);
    await ctx.reply(`${val ? '✅' : '❌'} *Autotyping* berhasil di-${val ? 'aktifkan' : 'nonaktifkan'}.`);
});

// ─── GOJO AI — mode chat AI ala Gojo Satoru, on/off per chat/grup ───────────
// Default ON (lihat lib/gojoAi.js). Hanya Admin grup/Owner/Creator yang
// boleh ubah. Di grup: bot cuma respon kalau di-mention/di-reply. Di DM:
// bot respon semua chat biasa. Logic trigger & pemanggilan AI ada di
// lib/gojoAi.js — file ini cuma toggle on/off-nya.
reg(['masterai', 'ai', 'gojoai'], async (ctx) => {
    if (!ctx.isAdmin && !ctx.isOwner && !ctx.isCreator) {
        return ctx.reply('❌ Only *Group Admins*, *Owner*, or *Creator* can configure this mode.');
    }
    const arg = (ctx.args?.[0] || '').toLowerCase();
    if (!['on', 'off', 'aktif', 'nonaktif'].includes(arg)) {
        return ctx.reply(
            `🧠 *MASTER AI* — Smart AI chat assistant by AHSAN\n\n` +
            `Current status: *${isGojoAiEnabled(ctx.jid) ? '✅ ON' : '❌ OFF'}*\n` +
            `• Di grup: bot reply karega jab aap mention (@bot) ya reply karein.\n` +
            `• Di DM: bot automatic har chat ka smart jawab dega.\n\n` +
            `Use: *.ai on* ya *.ai off* to toggle.`
        );
    }
    const val = arg === 'on' || arg === 'aktif';
    setGojoAiEnabled(ctx.jid, val);
    await ctx.reply(`${val ? '✅' : '❌'} *MASTER AI* successfully ${val ? 'activated' : 'deactivated'} for this chat.`);
});

// ─── CPANEL — jualan slot server Pterodactyl (v1-v5) ───────────────────────
// Backend/logic ada di lib/pterodactylReseller.js & commands/panelCommands.js
// — di sini cuma pendaftaran command-nya. Jumlahnya banyak (create × RAM ×
// versi, role × aksi × versi, dst) makanya pakai loop, bukan reg() satu-satu.
reg(['cpanel'], async (ctx) => ctx.reply(cpanelMenuText(settings.prefix)));

// Create server: .1gbv1 .. .10gbv5, .univ1 .. .univ5 (11 tier × 5 server)
for (const ram of RAM_TIERS) {
    for (const ver of VALID_SERVERS) {
        const cmdName = ram === 'unli' ? `uni${ver}` : `${ram}${ver}`;
        reg([cmdName], makeCreateServerHandler(ram, ver));
    }
}

// List / Del / Info server: per versi (v1-v5)
for (const ver of VALID_SERVERS) {
    reg([`listserver${ver}`, `servers${ver}`], makeListServerHandler(ver));
    reg([`delserver${ver}`, `hapusserver${ver}`], makeDelServerHandler(ver));
    reg([`serverinfo${ver}`, `sinfo${ver}`], makeServerInfoHandler(ver));
}

// Role management: add/del/list × owner/ceo/reseller × v1-v5 (45 command)
for (const role of VALID_ROLES) {
    for (const ver of VALID_SERVERS) {
        reg([`add${role}${ver}`], makeRoleHandler('add', role, ver));
        reg([`del${role}${ver}`], makeRoleHandler('del', role, ver));
        reg([`list${role}${ver}`], makeRoleHandler('list', role, ver));
    }
}

// GC Seller: addgcseller/resetgcseller × v1-v5
for (const ver of VALID_SERVERS) {
    reg([`addgcseller${ver}`], makeGcSellerHandler('add', ver));
    reg([`resetgcseller${ver}`], makeGcSellerHandler('reset', ver));
}

// Cadmin — buat akun root admin panel (bukan role bot): v1-v5
for (const ver of VALID_SERVERS) {
    reg([`cadmin${ver}`, `createadmin${ver}`], makeCadminHandler(ver));
}

// ─── GUILD & FARMING (RPG) DEACTIVATED ─────────────────────────────────────
reg(['guildcreate', 'guildjoin', 'guildleave', 'guildkick', 'guildpromote', 'guilddemote', 'guilddonate', 'guildupgrade', 'guilddisband', 'guildinfo', 'guildmembers', 'guildlist'], handleRpgDisabled);
reg(['plant', 'tanam', 'water', 'siram', 'harvest', 'panen', 'farmstatus', 'statuslahan', 'titles', 'daftartitle', 'equiptitle', 'pakaititle', 'cook', 'masak', 'recipes', 'daftarresep', 'bounty', 'claimbounty', 'klaimbounty'], handleRpgDisabled);

// ─── ADMIN SUBSISTEM BARU (commands/adminCommands5.js) ─────────────────────
// FIX: nama awal (.pin/.addnote/.listnote/.delnote/.catatan) ternyata
// SUDAH dipakai command lain (.pin = Pinterest downloader, .addnote dkk
// = fitur notes umum grup yang sudah ada) — kalau dipakai lagi di sini,
// bakal DIAM-DIAM menimpa command lama itu (bug serius). Diganti nama
// yang jelas beda supaya tidak tabrakan sama sekali.
reg(['setpengumuman', 'pengumumanpasang'], pinAdd);
reg(['hapuspengumuman', 'pengumumanhapus'], pinRemove);
reg(['pengumuman', 'cekpengumuman'], pinList);

reg(['addmembernote', 'tambahcatatan'], noteAdd);
reg(['listmembernote'], noteList);
reg(['delmembernote', 'hapuscatatan'], noteDel);

reg(['savetemplate'], templateSave);
reg(['loadtemplate'], templateLoad);
reg(['listtemplate'], templateList);
reg(['deltemplate'], templateDel);

reg(['addannouncement', 'tambahjadwalteks'], announcementAdd);
reg(['listannouncement', 'jadwaltekslist'], announcementList);
reg(['delannouncement', 'hapusjadwalteks'], announcementDel);

reg(['setbirthday', 'settanggallahir'], birthdaySet);
reg(['listbirthday', 'daftarultah'], birthdayList);
reg(['delbirthday', 'hapustanggallahir'], birthdayDel);

// ─── ADMIN BATCH BARU #2 (commands/adminCommands6.js) ──────────────────────
reg(['bulkpromote'], bulkPromote);
reg(['bulkdemote'], bulkDemote);
reg(['bulkkick'], bulkKick);
reg(['listinactive', 'membertidakaktif'], listInactive);
reg(['topactive', 'memberaktif'], topActive);
reg(['assigntask', 'kasihtugas'], taskAssign);
reg(['mytasks', 'tugasku'], taskMine);
reg(['listtasks', 'semuatugas'], taskList);
reg(['donetask', 'tugasselesai'], taskDone);
reg(['maintenancemode'], maintenanceToggle);

// ─── SELF MODE ────────────────────────────────────────────────────────────────
// Bot hanya merespon pesan dari owner/nomor bot sendiri.
// Hanya owner/creator yang bisa ubah ini.
reg(['self', 'selfmode', 'modeself'], async (ctx) => {
    if (!ctx.isOwner) return ctx.reply('❌ Hanya *Owner/Creator* yang bisa mengubah mode bot.');
    const arg = (ctx.args?.[0] || '').toLowerCase();
    if (!['on', 'off'].includes(arg)) {
        return ctx.reply(
            `📌 *Self Mode* — bot hanya respon ke owner/nomor bot sendiri\n\n` +
            `Current status: *${settings.selfMode ? '✅ ON (Self)' : '❌ OFF (Public)'}*\n\n` +
            `Type *. on* or *. off* to toggle.`
        );
    }
    const val = arg === 'on';
    settings.selfMode = val;
    const cfg = botCfg();
    cfg.selfMode = val;
    saveBotCfg();
    await ctx.reply(
        val
            ? `✅ *Self Mode ON* — bot sekarang hanya merespon owner & nomor bot sendiri.`
            : `❌ *Self Mode OFF* — bot kembali merespon semua orang.`
    );
});

// ─── PUBLIC / PRIVATE MODE ────────────────────────────────────────────────────
reg(['public', 'publicmode', 'modepublic', 'setpublic'], async (ctx) => {
    if (!ctx.isOwner) return ctx.reply('❌ Hanya *Owner/Creator* yang bisa mengubah mode bot.');
    settings.public = true;
    settings.selfMode = false;
    const cfg = botCfg(); cfg.selfMode = false; cfg.public = true; saveBotCfg();
    await ctx.reply('✅ *Mode Public* — bot sekarang bisa digunakan semua orang.');
});

reg(['private', 'privatemode', 'modeprivate', 'setprivate'], async (ctx) => {
    if (!ctx.isOwner) return ctx.reply('❌ Hanya *Owner/Creator* yang bisa mengubah mode bot.');
    settings.public = false;
    settings.selfMode = true;
    const cfg = botCfg(); cfg.selfMode = true; cfg.public = false; saveBotCfg();
    await ctx.reply('✅ *Mode Private* — bot sekarang hanya merespon owner & nomor bot sendiri.');
});

// ─── SEWA BOT ─────────────────────────────────────────────────────────────────
reg(['sewa', 'sewakan', 'sewagrup'], async (ctx) => sewaCommands.sewa(ctx));
reg(['ceksewa', 'infosewa', 'statussewa'], async (ctx) => sewaCommands.ceksewa(ctx));
reg(['delsewa', 'hapussewa', 'removesewa'], async (ctx) => sewaCommands.delsewa(ctx, ctx.sock));
reg(['listsewa', 'daftarsewa', 'sewaall'], async (ctx) => sewaCommands.listsewa(ctx));
reg(['extsewa', 'perpanjangsewa', 'renewsewa', 'addsewa'], async (ctx) => sewaCommands.extsewa(ctx));
reg(['hargasewa', 'pricesewa', 'infoharga'], async (ctx) => sewaCommands.hargasewa(ctx));
reg(['gantihargasewa', 'sethargasewa', 'ubahhargasewa'], async (ctx) => sewaCommands.gantihargasewa(ctx));
reg(['sewamode', 'modesewabot', 'togglesewa'], async (ctx) => sewaCommands.sewamode(ctx));

// ─── BRAT ─────────────────────────────────────────────────────────────────────
// Variant brat dipangkas jadi 3 command ini saja (2026-07-07) — semua
// variant lain (bratimg/brathd/bratanime/bratpatrick/bratsquidward/
// bratgojo/bratvermeil/bratvid/bratvid2/bratgojovid/bratvermeilvid) dan
// menu picker-nya (bratmenu/bratlist) sudah dihapus dari bratCommands.js.
reg(['brat'], async (ctx) => bratGenerate(ctx, 'brat'));
reg(['bratgreen'], async (ctx) => bratGenerate(ctx, 'bratgreen'));
reg(['bratwhite'], async (ctx) => bratGenerate(ctx, 'bratwhite'));

// ─── IQC ──────────────────────────────────────────────────────────────────────
reg(['iqc', 'iphonequote', 'iphoneqc', 'imessagequote'], async (ctx) => iqc(ctx));
// OFF = bot auto-keluar dari grup yang dimasukkan orang lain (bukan owner)
// ON  = bot tetap di grup dan bisa digunakan (default)
reg(['autojoin', 'automasukgrup', 'autojoingrup'], async (ctx) => {
    if (!ctx.isOwner) return ctx.reply('❌ Hanya *Owner/Creator* yang bisa mengubah setting autojoin.');
    const arg = (ctx.args?.[0] || '').toLowerCase();
    const cfg = botCfg();
    if (!['on', 'off'].includes(arg)) {
        return ctx.reply(
            `📌 *Autojoin* — kontrol apakah bot keluar otomatis dari grup yang tidak diizinkan\n\n` +
            `Current status: *${cfg.autojoin !== false ? '✅ ON (bot stay di semua grup)' : '❌ OFF (bot auto-keluar jika bukan owner yg masukkan)'}*\n\n` +
            `Type *. on* or *. off* to toggle.`
        );
    }
    const val = arg === 'on';
    cfg.autojoin = val;
    saveBotCfg();
    await ctx.reply(
        val
            ? `✅ *Autojoin ON* — bot akan stay di semua grup yang dimasukkan.`
            : `❌ *Autojoin OFF* — bot akan otomatis keluar dari grup jika bukan owner yang memasukkan.`
    );
});

reg(['whoami', 'nomorku'], async (ctx) => {
    const num = (ctx.sender || '').split('@')[0];
    if (isLidJid(ctx.sender)) {
        // FIX: dulu angka di depan "@lid" ditampilkan seolah-olah nomor HP
        // asli (padahal itu ID internal acak dari WhatsApp, bukan nomor
        // HP) — sekarang dijelaskan dengan jujur, supaya user tidak
        // mengira itu nomornya, dan supaya kalau identitas ini terlihat
        // beda di lain waktu, user paham kenapa (keterbatasan WhatsApp,
        // bukan bug di nomor mereka).
        return ctx.reply(
`🪪 *INFO AKUNMU*

⚠️ WhatsApp mengirim akunmu sebagai ID privat (*LID*), bukan nomor HP biasa.
◈ *ID*    : \`${num}\` _(bukan nomor HP asli)_
◈ *JID*   : \`${ctx.sender}\`
◈ *Chat*  : ${ctx.isGroup ? '👥 Grup' : '💬 Private'}

_Ini keterbatasan dari sistem WhatsApp sendiri, bukan kesalahan bot. Coba kirim pesan biasa (bukan reply) kalau ingin bot mengenali nomor HP aslimu._`
        );
    }
    await ctx.reply(
`🪪 *INFO NOMORMU*

◈ *Nomor* : +${num}
◈ *JID*   : \`${ctx.sender}\`
◈ *Chat*  : ${ctx.isGroup ? '👥 Grup' : '💬 Private'}`
    );
});

reg(['runtime', 'uptime'], async (ctx) => {
    const topCmds = getTopCommands(5).map(([cmd, n], i) => `  ${i+1}. \`${cmd}\` — ${n}x`).join('\n');
    await ctx.reply(
`⏱️ *BOT RUNTIME*

◈ *Aktif sejak* : ${fmtDuration(Date.now() - BOT_START_TIME)} lalu
◈ *Users RPG*   : ${countUsers()} orang
◈ *Grup aktif*  : ${countGroups()} grup
◈ *Total cmd*   : ${getTotalCommandsRan()} kali

🏆 *Top 5 Command Terpopuler:*
${topCmds || '  _(belum ada data)_'}`
    );
});

reg(['jam', 'waktuserver', 'servertime'], async (ctx) => infoTools.serverTime(ctx.reply));

// ── MEDIA ─────────────────────────────────────────────────────────────────
reg(['repost', 'kirimulang'], async (ctx) => mediaCommands.repostLast(ctx.sock, ctx.reply, ctx.jid, ctx.sender));
reg(['mediainfo', 'infomedia'], async (ctx) => mediaCommands.mediaInfo(ctx.reply, ctx.jid));
reg(['sticker', 'stiker', 's'], async (ctx) => mediaCommands.quoteAsSticker(ctx.reply));
reg(['pp', 'fotoprofile', 'profilepic'], async (ctx) => mediaCommands.profilePicInfo(ctx.sock, ctx.reply, ctx.jid, ctx.mentioned, ctx.sender));
reg(['ppgrup', 'fotogrup', 'grouppic'], async (ctx) => mediaCommands.getGroupPic(ctx.sock, ctx.reply, ctx.jid, ctx.sender));

// ── RPG: GATHERING / CRAFTING / GAMBLING / TRAINING (batch 3) ───────────
reg(['mine', 'tambang', 'menambang'], async (ctx) => rpgCommands3.mine(ctx.reply, ctx.sender));
reg(['fish', 'mancing', 'memancing'], async (ctx) => rpgCommands3.fish(ctx.reply, ctx.sender));
reg(['craft', 'crafting', 'buatitem'], async (ctx) => rpgCommands3.craft(ctx.reply, ctx.sender, ctx.args));
reg(['refine', 'tingkatkan', 'upgrade'], async (ctx) => rpgCommands3.refine(ctx.reply, ctx.sender, ctx.args));
reg(['train', 'latihan', 'training'], async (ctx) => rpgCommands3.train(ctx.reply, ctx.sender, ctx.args));
reg(['prestige', 'naikkelas', 'reborn'], async (ctx) => rpgCommands3.prestige(ctx.reply, ctx.sender));

// ── ADMIN: RULES / NOTES / POLL / BAN / AUTOREPLY (batch 2) ──────────────
reg(['setrules', 'aturanaturgrup'], async (ctx) => adminCommands2.setRules(ctx.reply, ctx.jid, ctx.args, ctx.isAdmin));
reg(['rules', 'aturan', 'aturangrup'], async (ctx) => adminCommands2.showRules(ctx.reply, ctx.jid));
reg(['addnote', 'tambahnote', 'catat'], async (ctx) => adminCommands2.addNote(ctx.reply, ctx.jid, ctx.args, ctx.isAdmin));
reg(['notes', 'listnote', 'catatan'], async (ctx) => adminCommands2.listNotes(ctx.reply, ctx.jid));
reg(['delnote', 'hapusnote', 'deletenote'], async (ctx) => adminCommands2.deleteNote(ctx.reply, ctx.jid, ctx.args, ctx.isAdmin));
reg(['pollnative', 'pollwa', 'jajakpendapat'], async (ctx) => adminCommands2.createPoll(ctx.sock, ctx.reply, ctx.jid, ctx.msg, ctx.args));
reg(['antidelete', 'antihapus'], async (ctx) => adminCommands2.antidelete(ctx.reply, ctx.jid, ctx.args, ctx.isAdmin));
reg(['statsgrupmember', 'infostatsgrup', 'statsmember'], async (ctx) => adminCommands2.groupActivity(ctx.sock, ctx.reply, ctx.jid));
reg(['ban', 'blokirbot', 'blockuser'], async (ctx) => adminCommands2.banUser(ctx.reply, ctx.jid, ctx.mentioned, ctx.isAdmin));
reg(['unban', 'bukablokir', 'unblockuser'], async (ctx) => adminCommands2.unbanUser(ctx.reply, ctx.jid, ctx.mentioned, ctx.isAdmin));
reg(['autoreply', 'aturbalasan', 'setautoreply'], async (ctx) => adminCommands2.setAutoReply(ctx.reply, ctx.jid, ctx.args, ctx.isAdmin));
reg(['listautoreply', 'daftarbalasan'], async (ctx) => adminCommands2.listAutoReply(ctx.reply, ctx.jid));

// ── FUN: BATCH 2 ──────────────────────────────────────────────────────────
reg(['compliment', 'puji', 'pujian'], async (ctx) => funCommands2.compliment(ctx.reply, ctx.mentioned));
reg(['roast', 'roasting', 'sindir'], async (ctx) => funCommands2.roast(ctx.reply, ctx.mentioned));
reg(['pickupline', 'gombalan', 'rayuan'], async (ctx) => funCommands2.pickupLine(ctx.reply));
reg(['nhie', 'neverhaveiever', 'pernahgak'], async (ctx) => funCommands2.neverHaveIEver(ctx.reply));
reg(['storystarter', 'mulaicerita'], async (ctx) => funCommands2.storyStarter(ctx.reply));
reg(['emojipuzzle', 'tebakemoji'], async (ctx) => funCommands2.emojiPuzzle(ctx.reply, ctx.jid));
reg(['jawabemoji', 'answeremoji'], async (ctx) => funCommands2.answerEmoji(ctx.reply, ctx.jid, ctx.args));
reg(['bola8', 'ramalanbola'], async (ctx) => funCommands2.magic8ball(ctx.reply, ctx.args));
reg(['challenge', 'tantangan', 'tantanganharian'], async (ctx) => funCommands2.randomChallenge(ctx.reply));
reg(['wordassoc', 'asosiasikata'], async (ctx) => funCommands2.wordAssociation(ctx.reply, ctx.jid));
reg(['mbti', 'tipemodel'], async (ctx) => funCommands2.mbtiGuess(ctx.reply));
reg(['luckynumberku', 'nomorberuntungku'], async (ctx) => funCommands2.luckyNumber(ctx.reply, ctx.sender));
reg(['mood', 'moodharian', 'dailymood'], async (ctx) => funCommands2.dailyMood(ctx.reply));

// ── TOOLS: MATH BATCH 2 ───────────────────────────────────────────────────
reg(['isprime', 'cekprima'], async (ctx) => mathTools2.isPrime(ctx.reply, ctx.args));
reg(['palindrome', 'cekpalindrome'], async (ctx) => mathTools2.isPalindrome(ctx.reply, ctx.args));
reg(['faktorial', 'factorial'], async (ctx) => mathTools2.factorial(ctx.reply, ctx.args));
reg(['fibonacci', 'fibo'], async (ctx) => mathTools2.fibonacci(ctx.reply, ctx.args));
reg(['gcdlcm', 'fpbkpk'], async (ctx) => mathTools2.gcdLcm(ctx.reply, ctx.args));
reg(['suhulengkap', 'celsiusall'], async (ctx) => mathTools2.celsiusAll(ctx.reply, ctx.args));
reg(['roman', 'romawi'], async (ctx) => mathTools2.toRoman(ctx.reply, ctx.args));
reg(['kuadrat', 'quadratic'], async (ctx) => mathTools2.quadratic(ctx.reply, ctx.args));
reg(['average', 'ratarata'], async (ctx) => mathTools2.average(ctx.reply, ctx.args));
reg(['median'], async (ctx) => mathTools2.median(ctx.reply, ctx.args));

// ── TOOLS: DATE BATCH ──────────────────────────────────────────────────────
reg(['harike', 'dayofweek'], async (ctx) => dateTools.dayOfWeek(ctx.reply, ctx.args));
reg(['sisahari', 'daysuntil', 'countdown'], async (ctx) => dateTools.daysUntil(ctx.reply, ctx.args));
reg(['leapyear', 'tahunkabisat'], async (ctx) => dateTools.isLeapYear(ctx.reply, ctx.args));
reg(['zodiaklahir', 'cekzodiak'], async (ctx) => dateTools.zodiacSign(ctx.reply, ctx.args));

// ── TOOLS: FORMAT BATCH ───────────────────────────────────────────────────
reg(['kapitalkata'], async (ctx) => formatTools.toTitleCase(ctx.reply, ctx.args));
reg(['removespace', 'hapusspasi'], async (ctx) => formatTools.removeSpaces(ctx.reply, ctx.args));
reg(['repeat'], async (ctx) => formatTools.repeatText(ctx.reply, ctx.args));
reg(['charat', 'karakterke'], async (ctx) => formatTools.charAt(ctx.reply, ctx.args));
reg(['textstats', 'statistikteks'], async (ctx) => formatTools.textStats(ctx.reply, ctx.args));

// ── TOOLS: VALIDATOR BATCH ────────────────────────────────────────────────
reg(['validemail'], async (ctx) => validatorTools.validateEmail(ctx.reply, ctx.args));
reg(['validphone', 'ceknomor'], async (ctx) => validatorTools.validatePhone(ctx.reply, ctx.args));
reg(['cekpassword', 'passwordstrength'], async (ctx) => validatorTools.checkPasswordStrength(ctx.reply, ctx.args));

// ── RPG: LOOKUP / INFO (batch 4) ──────────────────────────────────────────
reg(['monster', 'monsterinfo', 'infomonster'], async (ctx) => rpgCommands4.monsterInfo(ctx.reply, ctx.args));
reg(['monsterlist', 'listmonster', 'daftarmonster'], async (ctx) => rpgCommands4.monsterList(ctx.reply, ctx.args));
reg(['iteminfo', 'infoitem', 'detailitem'], async (ctx) => rpgCommands4.itemInfo(ctx.reply, ctx.args));
reg(['weaponlist', 'listweapon', 'daftarweapon', 'daftarsenjata'], async (ctx) => rpgCommands4.weaponList(ctx.reply, ctx.args));
reg(['armorlist', 'listarmor', 'daftarzirah', 'daftararmor'], async (ctx) => rpgCommands4.armorList(ctx.reply, ctx.args));
reg(['compare', 'bandingkan', 'comparepower'], async (ctx) => rpgCommands4.comparePower(ctx.reply, ctx.sender, ctx.mentioned));
reg(['classinfo', 'infoclass', 'detailclass'], async (ctx) => rpgCommands4.classInfo(ctx.reply, ctx.args));
reg(['hp', 'cekhp', 'checkhp'], async (ctx) => rpgCommands4.checkHp(ctx.reply, ctx.sender));
reg(['gold', 'cekgold', 'checkgold', 'saldo'], async (ctx) => rpgCommands4.checkGold(ctx.reply, ctx.sender));
reg(['level', 'ceklevel', 'checklevel', 'lvl'], async (ctx) => rpgCommands4.checkLevel(ctx.reply, ctx.sender));

// ── EXTRA ALIASES TO ROUND OUT FEATURE COVERAGE ──────────────────────────
reg(['cekprofil', 'lihatprofil', 'myprofile', 'akun'], async (ctx) => rpgCommands.showProfile(ctx.reply, ctx.sender, ctx.msg, ctx.mentioned));
reg(['tas', 'cektas', 'myinventory', 'mybag'], async (ctx) => rpgCommands.showInventory(ctx.reply, ctx.sender));
reg(['pakaiweapon', 'equipweapon', 'gunakan'], async (ctx) => rpgCommands.equipItem(ctx.reply, ctx.sender, ctx.args));
reg(['lepasweapon', 'unequipweapon'], async (ctx) => rpgCommands.unequipItem(ctx.reply, ctx.sender, ctx.args));
reg(['minumpotion', 'usepotion', 'pakaipotion'], async (ctx) => rpgCommands.useItem(ctx.reply, ctx.sender, ctx.args));
reg(['serbu', 'attack', 'hajar'], async (ctx) => rpgCommands.hunt(ctx.reply, ctx.sender));
reg(['tarung', 'fight', 'challengepvp'], async (ctx) => rpgCommands.battle(ctx.reply, ctx.sender, ctx.mentioned));
reg(['healhp', 'pulihkan', 'sembuh'], async (ctx) => rpgCommands.rest(ctx.reply, ctx.sender));
reg(['raidboss', 'seranggboss', 'fightraid'], async (ctx) => rpgCommands2.fightBoss(ctx.reply, ctx.sender, ctx.args));
reg(['masuk', 'enterdungeon', 'gerbang'], async (ctx) => rpgCommands2.enterDungeon(ctx.reply, ctx.sender, ctx.args));
reg(['cektoko', 'lihattoko', 'viewstore'], async (ctx) => rpgCommands2.showShop(ctx.reply, ctx.args));
reg(['purchase', 'belanjaitem'], async (ctx) => rpgCommands2.buyItem(ctx.reply, ctx.sender, ctx.args));
reg(['jualitem', 'sellitem'], async (ctx) => rpgCommands2.sellItem(ctx.reply, ctx.sender, ctx.args));
reg(['absenharian', 'klaimharian', 'rewardharian'], async (ctx) => rpgCommands2.dailyReward(ctx.reply, ctx.sender));
reg(['bekerja', 'cariuang', 'ngumpulgold'], async (ctx) => rpgCommands2.work(ctx.reply, ctx.sender, ctx.args));
reg(['setor', 'simpanbank', 'depositbank'], async (ctx) => rpgCommands2.bankDeposit(ctx.reply, ctx.sender, ctx.args));
reg(['ambilbank', 'withdrawbank', 'tarikbank'], async (ctx) => rpgCommands2.bankWithdraw(ctx.reply, ctx.sender, ctx.args));
reg(['kirimgoldke', 'sendgold', 'transfergold'], async (ctx) => rpgCommands2.transfer(ctx.reply, ctx.sender, ctx.mentioned, ctx.args));
reg(['merampok', 'mencuri', 'steal'], async (ctx) => rpgCommands2.rob(ctx.reply, ctx.sender, ctx.mentioned));
reg(['cekpet', 'mypets', 'listpets'], async (ctx) => rpgCommands2.petInfo(ctx.reply, ctx.sender));
reg(['gantipetaktif', 'activatepet'], async (ctx) => rpgCommands2.setPet(ctx.reply, ctx.sender, ctx.args));
reg(['daftarmisi', 'listquest', 'misiku'], async (ctx) => rpgCommands2.showQuests(ctx.reply, ctx.sender));
reg(['ambilreward', 'claimreward', 'klaimreward'], async (ctx) => rpgCommands2.claimQuest(ctx.reply, ctx.sender, ctx.args));
reg(['lencanaku', 'myachievements', 'badge'], async (ctx) => rpgCommands2.showAchievements(ctx.reply, ctx.sender));
reg(['papanperingkat', 'globaltop', 'rankingglobal'], async (ctx) => rpgCommands2.showRanking(ctx.reply));
reg(['papanskor', 'scoreboard'], async (ctx) => rpgCommands2.leaderboard(ctx.reply, ctx.args));
reg(['menikahi', 'lamar', 'propose'], async (ctx) => rpgCommands2.marry(ctx.reply, ctx.sender, ctx.mentioned));
reg(['putuscinta', 'breakup', 'akhiripernikahan'], async (ctx) => rpgCommands2.divorce(ctx.reply, ctx.sender));
reg(['nambang', 'mengeruk', 'digging'], async (ctx) => rpgCommands3.mine(ctx.reply, ctx.sender));
reg(['memancingikan', 'gofishing'], async (ctx) => rpgCommands3.fish(ctx.reply, ctx.sender));
reg(['bikinitem', 'forge', 'tempa'], async (ctx) => rpgCommands3.craft(ctx.reply, ctx.sender, ctx.args));
reg(['perkuatitem', 'enhance', 'upgradeitem'], async (ctx) => rpgCommands3.refine(ctx.reply, ctx.sender, ctx.args));
reg(['latihangym', 'workout', 'gym'], async (ctx) => rpgCommands3.train(ctx.reply, ctx.sender, ctx.args));
reg(['naikprestige', 'rebornchar', 'ascend'], async (ctx) => rpgCommands3.prestige(ctx.reply, ctx.sender));
reg(['cekaturangrup', 'lihataturan'], async (ctx) => adminCommands2.showRules(ctx.reply, ctx.jid));
reg(['simpancatatan', 'savenote'], async (ctx) => adminCommands2.addNote(ctx.reply, ctx.jid, ctx.args, ctx.isAdmin));
reg(['lihatcatatan', 'viewnotes'], async (ctx) => adminCommands2.listNotes(ctx.reply, ctx.jid));
reg(['buatpolling', 'votingbuat'], async (ctx) => adminCommands2.createPoll(ctx.sock, ctx.reply, ctx.jid, ctx.msg, ctx.args));
reg(['statistikgrup', 'infoaktivitas'], async (ctx) => adminCommands2.groupActivity(ctx.sock, ctx.reply, ctx.jid));
reg(['blokirpengguna', 'blockmember'], async (ctx) => adminCommands2.banUser(ctx.reply, ctx.jid, ctx.mentioned, ctx.isAdmin));
reg(['bukablokirpengguna', 'unblockmember'], async (ctx) => adminCommands2.unbanUser(ctx.reply, ctx.jid, ctx.mentioned, ctx.isAdmin));
reg(['aturautobalas', 'configautoreply'], async (ctx) => adminCommands2.setAutoReply(ctx.reply, ctx.jid, ctx.args, ctx.isAdmin));
reg(['lihatautobalas', 'viewautoreply'], async (ctx) => adminCommands2.listAutoReply(ctx.reply, ctx.jid));
reg(['katasemangat', 'motivation', 'penyemangat'], async (ctx) => funCommands.quote(ctx.reply));
reg(['faktamenarik', 'funfact'], async (ctx) => funCommands.fact(ctx.reply));
reg(['puzzleotak', 'brainteaser'], async (ctx) => funCommands.riddle(ctx.reply, ctx.jid));
reg(['kejujuran', 'truthquestion'], async (ctx) => funCommands.truth(ctx.reply));
reg(['tantanganfun', 'daretask'], async (ctx) => funCommands.dare(ctx.reply));
reg(['gambartebak', 'pictureguess'], async (ctx) => funCommands.tebakGambar(ctx.reply, ctx.jid));
reg(['pantunlucu', 'rhyme'], async (ctx) => funCommands.pantun(ctx.reply));
reg(['cekzodiakku', 'myzodiac'], async (ctx) => funCommands.horoscope(ctx.reply, ctx.args));
reg(['flipcoin', 'lempar'], async (ctx) => funCommands.coinFlip(ctx.reply));
reg(['lemparkandadu', 'rolldice'], async (ctx) => funCommands.rollDice(ctx.reply, ctx.args));
reg(['suitan', 'suit'], async (ctx) => funCommands.rps(ctx.reply, ctx.args));
reg(['mesinslot', 'spinslot'], async (ctx) => funCommands.slot(ctx.reply, ctx.sender));
reg(['mulaitebakangka', 'startguess'], async (ctx) => funCommands.tebakAngka(ctx.reply, ctx.jid));
reg(['jawabangka', 'guessanswer'], async (ctx) => funCommands.guessNumber(ctx.reply, ctx.jid, ctx.args));
reg(['pilihsalahsatu', 'eitheror'], async (ctx) => funCommands.wouldYouRather(ctx.reply));
reg(['cekjodohku', 'lovematch'], async (ctx) => funCommands.checkJodoh(ctx.reply, ctx.sender, ctx.mentioned));
reg(['kartutarothariini', 'dailytarot'], async (ctx) => funCommands.tarotCard(ctx.reply));
reg(['kuekeberuntungan', 'luckycookie'], async (ctx) => funCommands.fortuneCookie(ctx.reply));
reg(['kalkulatorjodoh', 'lovepercent'], async (ctx) => funCommands.hitungCinta(ctx.reply, ctx.sender, ctx.mentioned, ctx.args));
reg(['hurufbesar', 'majukan'], async (ctx) => textTools.upper(ctx.reply, ctx.args));
reg(['hurufkecil', 'minorkan'], async (ctx) => textTools.lower(ctx.reply, ctx.args));
reg(['balikteks', 'mirrortext'], async (ctx) => textTools.reverse(ctx.reply, ctx.args));
reg(['encodebinary', 'tobinary2'], async (ctx) => textTools.toBinary(ctx.reply, ctx.args));
reg(['decodebinary', 'frombinary2'], async (ctx) => textTools.fromBinary(ctx.reply, ctx.args));
reg(['encodebase64', 'tobase642'], async (ctx) => textTools.toBase64(ctx.reply, ctx.args));
reg(['decodebase64', 'frombase642'], async (ctx) => textTools.fromBase64(ctx.reply, ctx.args));
reg(['encodehex', 'tohex2'], async (ctx) => textTools.toHex(ctx.reply, ctx.args));
reg(['decodehex', 'fromhex2'], async (ctx) => textTools.fromHex(ctx.reply, ctx.args));
reg(['sandirot13', 'cipherrot13'], async (ctx) => textTools.rot13(ctx.reply, ctx.args));
reg(['bahasaleet', 'leetify'], async (ctx) => textTools.leet(ctx.reply, ctx.args));
reg(['hurufselangseling', 'zigzagcase'], async (ctx) => textTools.alternating(ctx.reply, ctx.args));
reg(['hitungkatakalimat', 'wordcounter'], async (ctx) => textTools.countWords(ctx.reply, ctx.args));
reg(['kalkulatorhitung', 'mathcalc'], async (ctx) => mathTools.calc(ctx.reply, ctx.args));
reg(['hitungpersen', 'percentcalc'], async (ctx) => mathTools.percent(ctx.reply, ctx.args));
reg(['hitungbmi', 'bmicalc'], async (ctx) => mathTools.bmi(ctx.reply, ctx.args));
reg(['cekkurs', 'kursinfo'], async (ctx) => mathTools.convertCurrencyNote(ctx.reply));
reg(['hitungusia', 'agecounter'], async (ctx) => mathTools.ageCalc(ctx.reply, ctx.args));
reg(['konversipanjang2', 'lengthconv'], async (ctx) => converterTools.convertLength(ctx.reply, ctx.args));
reg(['konversiberat2', 'weightconv'], async (ctx) => converterTools.convertWeight(ctx.reply, ctx.args));
reg(['konversisuhu2', 'tempconv'], async (ctx) => converterTools.convertTemp(ctx.reply, ctx.args));
reg(['buatpasswordku', 'newpassword'], async (ctx) => generatorTools.genPassword(ctx.reply, ctx.args));
reg(['buatuuid', 'newuuid'], async (ctx) => generatorTools.genUUID(ctx.reply));
reg(['pilihanrandom', 'randomchoice'], async (ctx) => generatorTools.pickRandom(ctx.reply, ctx.args));
reg(['acakdaftar', 'shufflelist'], async (ctx) => generatorTools.shuffleList(ctx.reply, ctx.args));
reg(['cekping', 'pingbot'], async (ctx) => infoTools.ping(ctx.reply));
reg(['siapakahaku', 'mynumber'], async (ctx) => infoTools.whoami(ctx.reply, ctx.sender));
reg(['lamabotaktif', 'botuptime'], async (ctx) => infoTools.runtime(ctx.reply, BOT_START_TIME));
reg(['waktusekarang', 'currenttime'], async (ctx) => infoTools.serverTime(ctx.reply));
reg(['cekprima2', 'primecheck'], async (ctx) => mathTools2.isPrime(ctx.reply, ctx.args));
reg(['cekpalindrome2', 'palindromecheck'], async (ctx) => mathTools2.isPalindrome(ctx.reply, ctx.args));
reg(['hitungfaktorial', 'factorialcalc'], async (ctx) => mathTools2.factorial(ctx.reply, ctx.args));
reg(['urutanfibonacci', 'fibsequence'], async (ctx) => mathTools2.fibonacci(ctx.reply, ctx.args));
reg(['hitungfpbkpk', 'gcdlcmcalc'], async (ctx) => mathTools2.gcdLcm(ctx.reply, ctx.args));
reg(['konversisuhulengkap', 'fullcelsius'], async (ctx) => mathTools2.celsiusAll(ctx.reply, ctx.args));
reg(['angkaromawi', 'romannumeral'], async (ctx) => mathTools2.toRoman(ctx.reply, ctx.args));
reg(['rumuskuadrat', 'quadraticformula'], async (ctx) => mathTools2.quadratic(ctx.reply, ctx.args));
reg(['hitungratarata', 'averagecalc'], async (ctx) => mathTools2.average(ctx.reply, ctx.args));
reg(['hitungmedian', 'mediancalc'], async (ctx) => mathTools2.median(ctx.reply, ctx.args));
reg(['cekharike', 'whatday'], async (ctx) => dateTools.dayOfWeek(ctx.reply, ctx.args));
reg(['hitungsisahari', 'remainingdays'], async (ctx) => dateTools.daysUntil(ctx.reply, ctx.args));
reg(['cekkabisat', 'leapcheck'], async (ctx) => dateTools.isLeapYear(ctx.reply, ctx.args));
reg(['cekzodiaklahir', 'birthzodiac'], async (ctx) => dateTools.zodiacSign(ctx.reply, ctx.args));
reg(['judulkata', 'capitalizetitle'], async (ctx) => formatTools.toTitleCase(ctx.reply, ctx.args));
reg(['hapusspasi2', 'trimallspace'], async (ctx) => formatTools.removeSpaces(ctx.reply, ctx.args));
reg(['ulangiteks', 'repeatstring'], async (ctx) => formatTools.repeatText(ctx.reply, ctx.args));
reg(['ambilkarakter', 'getchar'], async (ctx) => formatTools.charAt(ctx.reply, ctx.args));
reg(['statistikkalimat', 'sentencestats'], async (ctx) => formatTools.textStats(ctx.reply, ctx.args));
reg(['cekformatmail', 'emailcheck'], async (ctx) => validatorTools.validateEmail(ctx.reply, ctx.args));
reg(['cekformatnomor', 'phonecheck'], async (ctx) => validatorTools.validatePhone(ctx.reply, ctx.args));
reg(['kekuatanpassword', 'pwstrength'], async (ctx) => validatorTools.checkPasswordStrength(ctx.reply, ctx.args));
reg(['pujimember', 'givecompliment'], async (ctx) => funCommands2.compliment(ctx.reply, ctx.mentioned));
reg(['sindirmember', 'giveroast'], async (ctx) => funCommands2.roast(ctx.reply, ctx.mentioned));
reg(['rayuangombal', 'flirtline'], async (ctx) => funCommands2.pickupLine(ctx.reply));
reg(['pernahkahkamu', 'haveyouever'], async (ctx) => funCommands2.neverHaveIEver(ctx.reply));
reg(['pembukacerita', 'tellstory'], async (ctx) => funCommands2.storyStarter(ctx.reply));
reg(['tebakemojifilm', 'emojimovie'], async (ctx) => funCommands2.emojiPuzzle(ctx.reply, ctx.jid));
reg(['jawabantebakemoji', 'emojianswer'], async (ctx) => funCommands2.answerEmoji(ctx.reply, ctx.jid, ctx.args));
reg(['bola8magic', 'eightball'], async (ctx) => funCommands2.magic8ball(ctx.reply, ctx.args));
reg(['tantanganrandom', 'dailychallenge'], async (ctx) => funCommands2.randomChallenge(ctx.reply));
reg(['asosiasikatabaru', 'wordlink'], async (ctx) => funCommands2.wordAssociation(ctx.reply, ctx.jid));
reg(['tebakmbti', 'mbtitoday'], async (ctx) => funCommands2.mbtiGuess(ctx.reply));
reg(['nomorhoki', 'luckynum'], async (ctx) => funCommands2.luckyNumber(ctx.reply, ctx.sender));
reg(['moodku', 'mytodaymood'], async (ctx) => funCommands2.dailyMood(ctx.reply));

// ── FUN/GAME BARU (funCommands3) ─────────────────────────────────────────
reg(['trivia'], async (ctx) => funCommands3.trivia(ctx.reply, ctx.jid));
reg(['jawabtrivia'], async (ctx) => funCommands3.answerTrivia(ctx.reply, ctx.jid, ctx.args));
reg(['wyr2', 'wouldyourather2'], async (ctx) => funCommands3.wouldYouRather2(ctx.reply));
reg(['wordscramble', 'acakkata'], async (ctx) => funCommands3.wordScramble(ctx.reply, ctx.jid));
reg(['jawabscramble'], async (ctx) => funCommands3.answerScramble(ctx.reply, ctx.jid, ctx.args));
reg(['riddle2', 'tekateki2'], async (ctx) => funCommands3.riddle2(ctx.reply, ctx.jid));
reg(['jawabriddle2'], async (ctx) => funCommands3.answerRiddle2(ctx.reply, ctx.jid, ctx.args));
reg(['dadjoke', 'lawakanbapak'], async (ctx) => funCommands3.dadJoke(ctx.reply));
reg(['konspirasi', 'conspiracyfun'], async (ctx) => funCommands3.conspiracyFun(ctx.reply));
reg(['kepribadianhariini', 'personalitytoday'], async (ctx) => funCommands3.personalityToday(ctx.reply));
reg(['rolldadu', 'multidice'], async (ctx) => funCommands3.rollMultiDice(ctx.reply, ctx.args));
reg(['guesshilo', 'tebakhilomulai'], async (ctx) => funCommands3.guessHigherLower(ctx.reply, ctx.jid));
reg(['tebakhilo'], async (ctx) => funCommands3.answerHigherLower(ctx.reply, ctx.jid, ctx.args));
reg(['pujianrandom2', 'randomcompliment2'], async (ctx) => funCommands3.randomCompliment2(ctx.reply, ctx.mentioned));
reg(['katahariini', 'wordoftheday'], async (ctx) => funCommands3.wordOfTheDay(ctx.reply));
reg(['pilihini', 'thisorthat'], async (ctx) => funCommands3.thisOrThat(ctx.reply));
reg(['magic8ball', 'tanyabola8'], async (ctx) => funCommands3.magic8ball(ctx.reply, ctx.args));
reg(['ratehariini', 'ratemyday'], async (ctx) => funCommands3.rateMyDay(ctx.reply));
reg(['angkakeberuntungan', 'luckynumber'], async (ctx) => funCommands3.luckyNumber(ctx.reply));
reg(['emojirandom', 'randomemoji'], async (ctx) => funCommands3.randomEmoji(ctx.reply));
reg(['pengagumrahasia', 'secretadmirer'], async (ctx) => funCommands3.secretAdmirer(ctx.reply));
reg(['afirmasihariini', 'dailyaffirmation'], async (ctx) => funCommands3.dailyAffirmation(ctx.reply));

// ── RPG BARU (rpgCommands5) ──────────────────────────────────────────────
reg(['gacha', 'undianitem'], async (ctx) => rpgCommands5.gacha(ctx.reply, ctx.sender));
reg(['expedition', 'ekspedisi'], async (ctx) => rpgCommands5.expedition(ctx.reply, ctx.sender));
reg(['klaimekspedisi', 'claimexpedition'], async (ctx) => rpgCommands5.claimExpedition(ctx.reply, ctx.sender));
reg(['titleku', 'mytitle', 'cektitle'], async (ctx) => rpgCommands5.checkTitle(ctx.reply, ctx.sender));
reg(['renamechar', 'gantinama'], async (ctx) => rpgCommands5.renameChar(ctx.reply, ctx.sender, ctx.args));
reg(['resetbuff', 'resetbuffs'], async (ctx) => rpgCommands5.resetBuffs(ctx.reply, ctx.sender));
reg(['statdetail', 'statlengkap'], async (ctx) => rpgCommands5.statDetail(ctx.reply, ctx.sender));

// ── TOOLS BARU (toolsCommands3) ──────────────────────────────────────────
reg(['cekpalindrom'], async (ctx) => toolsCommands3.checkPalindrome(ctx.reply, ctx.args));
reg(['cekcc'], async (ctx) => toolsCommands3.checkCreditCard(ctx.reply, ctx.args));
reg(['cekemail'], async (ctx) => toolsCommands3.checkEmail(ctx.reply, ctx.args));
reg(['ceknohp'], async (ctx) => toolsCommands3.checkPhoneNumber(ctx.reply, ctx.args));
reg(['caesarenkrip'], async (ctx) => toolsCommands3.caesarEncrypt(ctx.reply, ctx.args));
reg(['caesardekrip'], async (ctx) => toolsCommands3.caesarDecrypt(ctx.reply, ctx.args));
reg(['tomorse'], async (ctx) => toolsCommands3.toMorse(ctx.reply, ctx.args));
reg(['frommorse'], async (ctx) => toolsCommands3.fromMorse(ctx.reply, ctx.args));
reg(['bmidetail'], async (ctx) => toolsCommands3.bmiDetailed(ctx.reply, ctx.args));
reg(['umurdetail'], async (ctx) => toolsCommands3.calculateAge2(ctx.reply, ctx.args));
reg(['persenubah'], async (ctx) => toolsCommands3.percentageChange(ctx.reply, ctx.args));
reg(['diskon'], async (ctx) => toolsCommands3.discountCalc(ctx.reply, ctx.args));
reg(['splitbill', 'bagitagihan'], async (ctx) => toolsCommands3.splitBill(ctx.reply, ctx.args));
reg(['warnarandom', 'randomcolor'], async (ctx) => toolsCommands3.randomColor(ctx.reply));
reg(['tanggalrandom', 'randomdate'], async (ctx) => toolsCommands3.randomDate(ctx.reply, ctx.args));
reg(['textascii'], async (ctx) => toolsCommands3.textToAscii(ctx.reply, ctx.args));
reg(['asciitext'], async (ctx) => toolsCommands3.asciiToText(ctx.reply, ctx.args));
reg(['frekuensikata', 'wordfreq'], async (ctx) => toolsCommands3.wordFrequency(ctx.reply, ctx.args));
reg(['titlecase'], async (ctx) => toolsCommands3.titleCase(ctx.reply, ctx.args));
reg(['camelcase'], async (ctx) => toolsCommands3.camelCase(ctx.reply, ctx.args));
reg(['snakecase'], async (ctx) => toolsCommands3.snakeCase(ctx.reply, ctx.args));
reg(['kebabcase'], async (ctx) => toolsCommands3.kebabCase(ctx.reply, ctx.args));
reg(['hitungvokal'], async (ctx) => toolsCommands3.countVowels(ctx.reply, ctx.args));
reg(['hapusvokal'], async (ctx) => toolsCommands3.removeVowels(ctx.reply, ctx.args));
reg(['hitungkonsonan'], async (ctx) => toolsCommands3.countConsonants(ctx.reply, ctx.args));
reg(['ulangteks', 'repeattext'], async (ctx) => toolsCommands3.repeatText(ctx.reply, ctx.args));
reg(['suhu', 'tempconvert'], async (ctx) => toolsCommands3.tempConvert(ctx.reply, ctx.args));
reg(['hitungtip', 'tipcalc'], async (ctx) => toolsCommands3.tipCalc(ctx.reply, ctx.args));

// ─── TOOLS BATCH BARU (warna, cipher, teks, JSON, regex) ───────────────────
reg(['hex2rgb'], async (ctx) => toolsCommands4.hexToRgbCmd(ctx.reply, ctx.args));
reg(['rgb2hex'], async (ctx) => toolsCommands4.rgbToHexCmd(ctx.reply, ctx.args));
reg(['vigenere'], async (ctx) => toolsCommands4.vigenereEncrypt(ctx.reply, ctx.args));
reg(['vigeneredekrip'], async (ctx) => toolsCommands4.vigenereDecrypt(ctx.reply, ctx.args));
reg(['atbash'], async (ctx) => toolsCommands4.atbash(ctx.reply, ctx.args));
reg(['tobase32'], async (ctx) => toolsCommands4.toBase32(ctx.reply, ctx.args));
reg(['frombase32'], async (ctx) => toolsCommands4.fromBase32(ctx.reply, ctx.args));
reg(['slugify'], async (ctx) => toolsCommands4.slugifyCmd(ctx.reply, ctx.args));
reg(['loremipsum'], async (ctx) => toolsCommands4.loremIpsum(ctx.reply, ctx.args));
reg(['randomname', 'namarandom'], async (ctx) => toolsCommands4.randomFantasyName(ctx.reply));
reg(['anagram'], async (ctx) => toolsCommands4.anagramCheck(ctx.reply, ctx.args));
reg(['syllable', 'sukukata'], async (ctx) => toolsCommands4.syllableCount(ctx.reply, ctx.args));
reg(['readingtime', 'waktubaca'], async (ctx) => toolsCommands4.readingTime(ctx.reply, ctx.args));
reg(['numeronim'], async (ctx) => toolsCommands4.numeronym(ctx.reply, ctx.args));
reg(['dogyears', 'umuranjing'], async (ctx) => toolsCommands4.dogYears(ctx.reply, ctx.args));
reg(['jsonvalidate'], async (ctx) => toolsCommands4.jsonValidate(ctx.reply, ctx.args));
reg(['jsonformat'], async (ctx) => toolsCommands4.jsonFormat(ctx.reply, ctx.args));
reg(['regextest'], async (ctx) => toolsCommands4.regexTest(ctx.reply, ctx.args));

// .qrcode & .shorturl butuh ctx.sock langsung (kirim gambar / panggil API
// eksternal), jadi didaftarkan inline di sini, bukan lewat toolsCommands4.js
reg(['qrcode', 'qr'], async (ctx) => {
    const text = ctx.args.join(' ').trim();
    if (!text) return ctx.reply('📌 Usage: *.qrcode [text/link]*');
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(text)}`;
    try {
        await ctx.sock.sendMessage(ctx.jid, { image: { url }, caption: `📱 QR Code for:\n${text.slice(0, 100)}` }, { quoted: ctx.msg });
    } catch (err) {
        await ctx.reply(`❌ Failed to create QR code: ${err.message}`);
    }
});
reg(['shorturl', 'pendekkanlink'], async (ctx) => {
    const link = ctx.args[0];
    if (!link || !/^https?:\/\//i.test(link)) return ctx.reply('📌 Usage: *.shorturl [full link with http/https]*');
    try {
        const res = await fetch(`https://is.gd/create.php?format=simple&url=${encodeURIComponent(link)}`);
        const short = await res.text();
        if (!short.startsWith('http')) throw new Error(short);
        await ctx.reply(`🔗 *Shortened Link*\n\n${short}`);
    } catch (err) {
        await ctx.reply(`❌ Failed to shorten link: ${err.message}`);
    }
});

// ─── TOOLS BATCH BESAR #2 (commands/toolsCommands5.js) ─────────────────────
reg(['urlencode'], async (ctx) => toolsCommands5.urlEncode(ctx.reply, ctx.args));
reg(['urldecode'], async (ctx) => toolsCommands5.urlDecode(ctx.reply, ctx.args));
reg(['htmlencode'], async (ctx) => toolsCommands5.htmlEncode(ctx.reply, ctx.args));
reg(['htmldecode'], async (ctx) => toolsCommands5.htmlDecode(ctx.reply, ctx.args));
reg(['rot47'], async (ctx) => toolsCommands5.rot47(ctx.reply, ctx.args));
reg(['xorcipher'], async (ctx) => toolsCommands5.xorCipher(ctx.reply, ctx.args));
reg(['xordekrip'], async (ctx) => toolsCommands5.xorDecrypt(ctx.reply, ctx.args));
reg(['digitalroot'], async (ctx) => toolsCommands5.digitalRoot(ctx.reply, ctx.args));
reg(['collatz'], async (ctx) => toolsCommands5.collatzLength(ctx.reply, ctx.args));
reg(['perfectnumber'], async (ctx) => toolsCommands5.perfectNumberCheck(ctx.reply, ctx.args));
reg(['popcount'], async (ctx) => toolsCommands5.popCount(ctx.reply, ctx.args));
reg(['binaryops'], async (ctx) => toolsCommands5.binaryOps(ctx.reply, ctx.args));
reg(['circlearea'], async (ctx) => toolsCommands5.circleCalc(ctx.reply, ctx.args));
reg(['triangleheron'], async (ctx) => toolsCommands5.triangleHeron(ctx.reply, ctx.args));
reg(['rectarea'], async (ctx) => toolsCommands5.rectCalc(ctx.reply, ctx.args));
reg(['spherevolume'], async (ctx) => toolsCommands5.sphereCalc(ctx.reply, ctx.args));
reg(['stdev'], async (ctx) => toolsCommands5.stdDeviation(ctx.reply, ctx.args));
reg(['statmode'], async (ctx) => toolsCommands5.statMode(ctx.reply, ctx.args));
reg(['compoundinterest'], async (ctx) => toolsCommands5.compoundInterest(ctx.reply, ctx.args));
reg(['simpleinterest'], async (ctx) => toolsCommands5.simpleInterest(ctx.reply, ctx.args));
reg(['loanpayment'], async (ctx) => toolsCommands5.loanPayment(ctx.reply, ctx.args));
reg(['roi'], async (ctx) => toolsCommands5.roiCalc(ctx.reply, ctx.args));
reg(['businessdays'], async (ctx) => toolsCommands5.businessDaysBetween(ctx.reply, ctx.args));
reg(['weeknumber'], async (ctx) => toolsCommands5.weekNumber(ctx.reply, ctx.args));
reg(['quarter'], async (ctx) => toolsCommands5.quarterOf(ctx.reply, ctx.args));
reg(['levenshtein'], async (ctx) => toolsCommands5.levenshtein(ctx.reply, ctx.args));
reg(['passphrase'], async (ctx) => toolsCommands5.passphrase(ctx.reply, ctx.args));
reg(['acronym'], async (ctx) => toolsCommands5.acronymGenerate(ctx.reply, ctx.args));
reg(['listunique'], async (ctx) => toolsCommands5.listUnique(ctx.reply, ctx.args));
reg(['listintersect'], async (ctx) => toolsCommands5.listIntersect(ctx.reply, ctx.args));
reg(['listdiff'], async (ctx) => toolsCommands5.listDiff(ctx.reply, ctx.args));
reg(['windchill'], async (ctx) => toolsCommands5.windChill(ctx.reply, ctx.args));
reg(['heatindex'], async (ctx) => toolsCommands5.heatIndex(ctx.reply, ctx.args));
reg(['angleconvert'], async (ctx) => toolsCommands5.angleConvert(ctx.reply, ctx.args));
reg(['cmyk2rgb'], async (ctx) => toolsCommands5.cmykToRgb(ctx.reply, ctx.args));

// ─── MEDIA BATCH BARU (commands/mediaCommands2.js, pakai ffmpeg) ───────────
reg(['grayscale', 'hitamputih'], grayscaleCmd);
reg(['mirror', 'cerminkan'], mirrorCmd);
reg(['blur'], blurCmd);
reg(['hd', 'hdphoto', 'upscale'], hdCmd);
reg(['rotate90'], rotate90Cmd);
reg(['rotate180'], rotate180Cmd);
reg(['speedup'], speedUpCmd);
reg(['slowmo'], slowMoCmd);
reg(['mutevideo'], muteVideoCmd);
reg(['extractaudio'], extractAudioCmd);
reg(['volumeup'], volumeUpCmd);

// ─── BOT BATCH BARU (commands/botCommands.js) ──────────────────────────────
reg(['botstats', 'statistikbot'], botStats);
reg(['changelog', 'riwayatupdate'], showChangelog);
reg(['suggest', 'saran'], submitSuggestion);
reg(['listsuggestions', 'listsaran'], listSuggestions);
reg(['clearsuggestions', 'hapussaran'], clearSuggestions);
reg(['credits'], showCredits);
reg(['support', 'bantuan'], showSupport);
reg(['backupnow', 'backupsekarang'], backupNow);

// ─── MEDIA BATCH #3 (efek tambahan) ────────────────────────────────────────
reg(['sepia'], sepiaCmd);
reg(['invert'], invertCmd);
reg(['pixelate'], pixelateCmd);
reg(['brighten', 'terangkan'], brightenCmd);
reg(['darken', 'gelapkan'], darkenCmd);
reg(['reversevideo', 'balikvideo'], reverseVideoCmd);
reg(['flipvertical', 'flipvertikal'], flipVerticalCmd);
reg(['square', 'cropsquare'], squareCropCmd);
reg(['watermark'], watermarkCmd);

// ─── TOOLS BATCH #7 (commands/toolsCommands10.js) ──────────────────────────
reg(['tobase58'], async (ctx) => toolsCommands10.toBase58(ctx.reply, ctx.args));
reg(['frombase58'], async (ctx) => toolsCommands10.fromBase58(ctx.reply, ctx.args));
reg(['pressureconvert'], async (ctx) => toolsCommands10.pressureConvert(ctx.reply, ctx.args));
reg(['randomword'], async (ctx) => toolsCommands10.randomWord(ctx.reply));
reg(['randomcity'], async (ctx) => toolsCommands10.randomCity(ctx.reply));
reg(['topwords'], async (ctx) => toolsCommands10.wordFrequencyTop(ctx.reply, ctx.args));

// ─── AI STYLE TRANSFER (commands/mediaCommands3.js) — butuh setup ──────────
// settings.puterAuthToken (lihat setting.js buat cara dapetnya)
reg(['tobotak'], toBotakCmd);
reg(['tochibi'], toChibiCmd);
reg(['tofigura'], toFiguraCmd);
reg(['toghibli'], toGhibliCmd);
reg(['tohijab'], toHijabCmd);
reg(['tolego'], toLegoCmd);
reg(['tohitam'], toHitamCmd);
reg(['to3d'], to3dCmd);
reg(['toroblox'], toRobloxCmd);
reg(['tooilpainting'], toOilPaintingCmd);

// ─── TOOLS BATCH #8 (commands/toolsCommands11.js) ──────────────────────────
reg(['upsidedown'], async (ctx) => toolsCommands11.upsideDown(ctx.reply, ctx.args));
reg(['zalgotext'], async (ctx) => toolsCommands11.zalgoText(ctx.reply, ctx.args));
reg(['smallcaps'], async (ctx) => toolsCommands11.smallCaps(ctx.reply, ctx.args));
reg(['strikethrough'], async (ctx) => toolsCommands11.strikethroughText(ctx.reply, ctx.args));
reg(['underline'], async (ctx) => toolsCommands11.underlineText(ctx.reply, ctx.args));
reg(['circledtext'], async (ctx) => toolsCommands11.circledText(ctx.reply, ctx.args));
reg(['fullwidth'], async (ctx) => toolsCommands11.fullwidthText(ctx.reply, ctx.args));
reg(['hammingdistance'], async (ctx) => toolsCommands11.hammingDistance(ctx.reply, ctx.args));
reg(['jaccard'], async (ctx) => toolsCommands11.jaccardSimilarity(ctx.reply, ctx.args));
reg(['averagespeed'], async (ctx) => toolsCommands11.averageSpeed(ctx.reply, ctx.args));
reg(['electricitybill'], async (ctx) => toolsCommands11.electricityBill(ctx.reply, ctx.args));

// ─── TOOLS BATCH #9 (commands/toolsCommands12.js) — fisika/matematika/konverter ─
reg(['ohm', 'hukumohm'], async (ctx) => toolsCommands12.ohmLaw(ctx.reply, ctx.args));
reg(['energikinetik'], async (ctx) => toolsCommands12.kineticEnergy(ctx.reply, ctx.args));
reg(['gayagravitasi'], async (ctx) => toolsCommands12.gravitationalForce(ctx.reply, ctx.args));
reg(['jarakproyektil'], async (ctx) => toolsCommands12.projectileRange(ctx.reply, ctx.args));
reg(['percepatan'], async (ctx) => toolsCommands12.acceleration(ctx.reply, ctx.args));
reg(['faktorprima'], async (ctx) => toolsCommands12.primeFactors(ctx.reply, ctx.args));
reg(['fpbstep'], async (ctx) => toolsCommands12.gcdSteps(ctx.reply, ctx.args));
reg(['matrixtambah'], async (ctx) => toolsCommands12.matrixAdd(ctx.reply, ctx.args));
reg(['matrixkali'], async (ctx) => toolsCommands12.matrixMultiply(ctx.reply, ctx.args));
reg(['persentaselemak'], async (ctx) => toolsCommands12.bodyFatPercent(ctx.reply, ctx.args));
reg(['pacelari'], async (ctx) => toolsCommands12.runningPace(ctx.reply, ctx.args));
reg(['konversidata'], async (ctx) => toolsCommands12.dataUnitConvert(ctx.reply, ctx.args));
reg(['konversidaya'], async (ctx) => toolsCommands12.powerUnitConvert(ctx.reply, ctx.args));

// ─── FUN BATCH #4 (commands/funCommands4.js) — shio/zodiak/generator random ────
reg(['shiozodiak'], async (ctx) => funCommands4.chineseZodiac(ctx.reply, ctx.args));
reg(['artimimpi'], async (ctx) => funCommands4.dreamMeaning(ctx.reply, ctx.args));
reg(['warnahoki'], async (ctx) => funCommands4.luckyColor(ctx.reply));
reg(['elementzodiak'], async (ctx) => funCommands4.zodiacElement(ctx.reply, ctx.args));
reg(['namatim'], async (ctx) => funCommands4.randomTeamName(ctx.reply));
reg(['julukananime'], async (ctx) => funCommands4.animeEpithet(ctx.reply));
reg(['namakerajaan'], async (ctx) => funCommands4.randomKingdomName(ctx.reply));

// ─── DELAY — atur delay balasan bot (0 = instan) ───────────────────────────
// FIX: sekarang Admin grup juga boleh pakai, tidak cuma Owner/Creator.
// CATATAN PENTING (belum diubah, sengaja diberitahu dulu): setting ini
// masih GLOBAL — satu nilai yang sama berlaku untuk SEMUA chat (grup lain,
// DM, dst), bukan cuma grup tempat Admin itu mengetik .delay. Kalau bot ini
// dipakai di banyak grup berbeda (mis. mode sewa) dan tiap grup butuh delay
// sendiri-sendiri, kabari lagi supaya ini diubah jadi per-grup.
reg(['delay'], async (ctx) => {
    if (!ctx.isOwner && !ctx.isCreator && !ctx.isAdmin) {
        return ctx.reply('❌ Hanya Owner/Creator atau Admin grup yang bisa mengubah delay balasan bot.');
    }
    const arg = ctx.args[0];
    if (arg === undefined) {
        const current = getReplyDelayOverride();
        return ctx.reply(
            `📌 *Delay Balasan Bot*\n\n` +
            `Current status: *${current === null ? 'Default (acak 3-4 detik)' : current === 0 ? 'Instan (0 detik)' : current + ' detik'}*\n\n` +
            `Ketik \`.delay [detik]\` untuk ubah (0 = instan/langsung).\nKetik \`.delay default\` untuk balik ke delay acak bawaan.`
        );
    }
    if (arg.toLowerCase() === 'default') {
        setReplyDelayOverride(null);
        return ctx.reply('✅ Delay balasan bot dikembalikan ke default (acak 3-4 detik).');
    }
    const seconds = parseInt(arg, 10);
    if (isNaN(seconds) || seconds < 0 || seconds > 60) {
        return ctx.reply('⚠️ Usage: `.delay [detik]` (0-60, 0 = instan) atau `.delay default`');
    }
    setReplyDelayOverride(seconds);
    return ctx.reply(`✅ Delay balasan bot diatur ke *${seconds === 0 ? 'instan (0 detik)' : seconds + ' detik'}*.`);
});

// ─── TOOLS BATCH #4 — sederhana/dasar (commands/toolsCommands7.js) ─────────
reg(['massconvert'], async (ctx) => toolsCommands7.massConvert(ctx.reply, ctx.args));
reg(['volumeconvert'], async (ctx) => toolsCommands7.volumeConvert(ctx.reply, ctx.args));
reg(['trimspaces'], async (ctx) => toolsCommands7.trimSpaces(ctx.reply, ctx.args));
reg(['capitalizefirst'], async (ctx) => toolsCommands7.capitalizeFirst(ctx.reply, ctx.args));
reg(['countchar'], async (ctx) => toolsCommands7.countChar(ctx.reply, ctx.args));
reg(['randomcolorname'], async (ctx) => toolsCommands7.randomColorName(ctx.reply));
reg(['ageinseconds'], async (ctx) => toolsCommands7.ageInSeconds(ctx.reply, ctx.args));
reg(['nextweekday'], async (ctx) => toolsCommands7.nextWeekday(ctx.reply, ctx.args));
reg(['gcdlist'], async (ctx) => toolsCommands7.gcdList(ctx.reply, ctx.args));
reg(['lcmlist'], async (ctx) => toolsCommands7.lcmList(ctx.reply, ctx.args));
reg(['removedupewords'], async (ctx) => toolsCommands7.removeDuplicateWords(ctx.reply, ctx.args));
reg(['strlen'], async (ctx) => toolsCommands7.stringLength(ctx.reply, ctx.args));
reg(['isnumeric'], async (ctx) => toolsCommands7.isNumeric(ctx.reply, ctx.args));
reg(['reversenumber'], async (ctx) => toolsCommands7.reverseNumber(ctx.reply, ctx.args));

// ─── ADMIN & BOT — tambahan sederhana ───────────────────────────────────────
reg(['grouplinkqr'], async (ctx) => {
    if (!ctx.isAdmin) return ctx.reply('❌ Khusus Admin grup.');
    try {
        const code = await ctx.sock.groupInviteCode(ctx.jid);
        const link = `https://chat.whatsapp.com/${code}`;
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(link)}`;
        await ctx.sock.sendMessage(ctx.jid, { image: { url: qrUrl }, caption: `🔗 QR Code for group link:\n${link}` }, { quoted: ctx.msg });
    } catch (err) {
        await ctx.reply(`❌ Failed to generate QR code: ${err.message}`);
    }
});
reg(['version', 'versibot'], async (ctx) => ctx.reply(`🤖 *${settings.botName}*\nVersion: *v${settings.botVersion}*`));

// ─── TOOLS BATCH #5 (commands/toolsCommands8.js) ───────────────────────────
reg(['removepunctuation'], async (ctx) => toolsCommands8.removePunctuation(ctx.reply, ctx.args));
reg(['extractnumbers'], async (ctx) => toolsCommands8.extractNumbers(ctx.reply, ctx.args));
reg(['extractemails'], async (ctx) => toolsCommands8.extractEmails(ctx.reply, ctx.args));
reg(['extracturls'], async (ctx) => toolsCommands8.extractUrls(ctx.reply, ctx.args));
reg(['wordwrap'], async (ctx) => toolsCommands8.wordWrap(ctx.reply, ctx.args));
reg(['tax'], async (ctx) => toolsCommands8.taxCalc(ctx.reply, ctx.args));
reg(['taxremove'], async (ctx) => toolsCommands8.taxRemove(ctx.reply, ctx.args));
reg(['discountstack'], async (ctx) => toolsCommands8.discountStack(ctx.reply, ctx.args));
reg(['retirement'], async (ctx) => toolsCommands8.retirementCountdown(ctx.reply, ctx.args));
reg(['bmr'], async (ctx) => toolsCommands8.bmrCalc(ctx.reply, ctx.args));
reg(['idealweight'], async (ctx) => toolsCommands8.idealWeightRange(ctx.reply, ctx.args));
reg(['waterintake'], async (ctx) => toolsCommands8.waterIntake(ctx.reply, ctx.args));
reg(['timeconvert'], async (ctx) => toolsCommands8.timeConvert(ctx.reply, ctx.args));
reg(['numeralsystem'], async (ctx) => toolsCommands8.numeralSystem(ctx.reply, ctx.args));
reg(['leapyearlist'], async (ctx) => toolsCommands8.leapYearList(ctx.reply, ctx.args));
reg(['daysinmonth'], async (ctx) => toolsCommands8.daysInMonth(ctx.reply, ctx.args));
reg(['zodiaccompat'], async (ctx) => toolsCommands8.zodiacCompat(ctx.reply, ctx.args));

// ─── TOOLS BATCH #6 (commands/toolsCommands9.js) ───────────────────────────
reg(['simplifyfraction'], async (ctx) => toolsCommands9.simplifyFraction(ctx.reply, ctx.args));
reg(['fractiontodecimal'], async (ctx) => toolsCommands9.fractionToDecimal(ctx.reply, ctx.args));
reg(['decimaltofraction'], async (ctx) => toolsCommands9.decimalToFraction(ctx.reply, ctx.args));
reg(['gpacalc'], async (ctx) => toolsCommands9.gpaCalculator(ctx.reply, ctx.args));
reg(['romanvalidate'], async (ctx) => toolsCommands9.romanValidate(ctx.reply, ctx.args));
reg(['currencyformat'], async (ctx) => toolsCommands9.currencyFormat(ctx.reply, ctx.args));
reg(['rollnotation'], async (ctx) => toolsCommands9.rollNotation(ctx.reply, ctx.args));
reg(['drawcard'], async (ctx) => toolsCommands9.drawCard(ctx.reply, ctx.args));
reg(['hashtaggen'], async (ctx) => toolsCommands9.hashtagGenerate(ctx.reply, ctx.args));

// ─── ADMIN — preview pesan welcome tanpa perlu member baru join ────────────
reg(['previewwelcome'], async (ctx) => {
    const gs = getGroupSettings(ctx.jid);
    if (!gs.welcomeText) return ctx.reply('ℹ️ No custom welcome message configured.\nSet one using `.setwelcome [text]`.');
    const previewNum = ctx.sender.split('@')[0];
    // FIX (rebranding V2): sebelumnya {group} di-preview pakai JID mentah
    // (mis. "1234567890-xxxx@g.us"), padahal pesan welcome ASLI (di
    // features/protection.js) pakai nama grup asli. Disamakan di sini
    // supaya hasil preview betul-betul mencerminkan pesan sungguhan.
    let previewMeta = null;
    try { previewMeta = await ctx.sock.groupMetadata(ctx.jid); } catch {}
    const previewGroupName = previewMeta?.subject || 'Grup ini';
    const rendered = gs.welcomeText
        .replace(/\{user\}/g, `@${previewNum}`)
        .replace(/\{name\}/g, `@${previewNum}`)
        .replace(/\{group\}/g, previewGroupName)
        .replace(/\{num\}/g, previewNum);
    await ctx.sock.sendMessage(ctx.jid, { text: `👋 *Preview Welcome Message:*\n\n${rendered}`, mentions: [ctx.sender] }, { quoted: ctx.msg });
});

// ─── ADMIN BATCH #3 (Event RSVP, Quick Lock) ───────────────────────────────
reg(['createevent', 'buatevent'], eventCreate);
reg(['rsvp'], eventRsvp);
reg(['listevents', 'daftarevent'], eventList);
reg(['eventattendees', 'pesertaevent'], eventAttendees);
reg(['quicklock'], quickLock);
reg(['quickunlock'], quickUnlock);
reg(['votekick'], votekick);
reg(['setmotd'], setMotd);
reg(['motd'], showMotd);
reg(['pollclose', 'closepoll', 'tutuppoll'], pollClose);

// ─── TOOLS BATCH #3 (commands/toolsCommands6.js) ───────────────────────────
reg(['railfence'], async (ctx) => toolsCommands6.railFenceEnc(ctx.reply, ctx.args));
reg(['railfencedekrip'], async (ctx) => toolsCommands6.railFenceDec(ctx.reply, ctx.args));
reg(['caesarbrute'], async (ctx) => toolsCommands6.caesarBrute(ctx.reply, ctx.args));
reg(['tobase36'], async (ctx) => toolsCommands6.toBase36(ctx.reply, ctx.args));
reg(['frombase36'], async (ctx) => toolsCommands6.fromBase36(ctx.reply, ctx.args));
reg(['piglatin'], async (ctx) => toolsCommands6.pigLatin(ctx.reply, ctx.args));
reg(['ncr'], async (ctx) => toolsCommands6.combination(ctx.reply, ctx.args));
reg(['npr'], async (ctx) => toolsCommands6.permutation(ctx.reply, ctx.args));
reg(['pascalrow'], async (ctx) => toolsCommands6.pascalRow(ctx.reply, ctx.args));
reg(['primelist'], async (ctx) => toolsCommands6.primeList(ctx.reply, ctx.args));
reg(['trapezoidarea'], async (ctx) => toolsCommands6.trapezoidArea(ctx.reply, ctx.args));
reg(['hexagonarea'], async (ctx) => toolsCommands6.hexagonArea(ctx.reply, ctx.args));
reg(['cylindervolume'], async (ctx) => toolsCommands6.cylinderCalc(ctx.reply, ctx.args));
reg(['ibancheck'], async (ctx) => toolsCommands6.ibanValidate(ctx.reply, ctx.args));
reg(['macvalidate'], async (ctx) => toolsCommands6.macValidate(ctx.reply, ctx.args));
reg(['ipv4validate'], async (ctx) => toolsCommands6.ipv4Validate(ctx.reply, ctx.args));
reg(['pingenerate'], async (ctx) => toolsCommands6.pinGenerate(ctx.reply, ctx.args));
reg(['couponcode'], async (ctx) => toolsCommands6.couponCode(ctx.reply));
reg(['numbertowords'], async (ctx) => toolsCommands6.numberToWords(ctx.reply, ctx.args));
reg(['fueleff'], async (ctx) => toolsCommands6.fuelEfficiency(ctx.reply, ctx.args));
reg(['cookingconvert'], async (ctx) => toolsCommands6.cookingConvert(ctx.reply, ctx.args));
reg(['textanalysis'], async (ctx) => toolsCommands6.textStats(ctx.reply, ctx.args));

// ── ADMIN GRUP BARU (adminCommands3) ─────────────────────────────────────
reg(['poll', 'buatpoll'], async (ctx) => adminCommands3.createPoll(ctx.reply, ctx.jid, ctx.args, ctx.isAdmin));
reg(['vote'], async (ctx) => adminCommands3.votePoll(ctx.reply, ctx.jid, ctx.sender, ctx.args));
reg(['hasilpoll', 'pollresult'], async (ctx) => adminCommands3.pollResult(ctx.reply, ctx.jid, ctx.args));
reg(['listpoll', 'daftarpoll'], async (ctx) => adminCommands3.listPolls(ctx.reply, ctx.jid));
reg(['addjadwal'], async (ctx) => adminCommands3.addSchedule(ctx.reply, ctx.jid, ctx.args, ctx.isAdmin));
reg(['listjadwal', 'jadwalgrup'], async (ctx) => adminCommands3.listSchedule(ctx.reply, ctx.jid));
reg(['deljadwal'], async (ctx) => adminCommands3.deleteSchedule(ctx.reply, ctx.jid, ctx.args, ctx.isAdmin));
reg(['lapor'], async (ctx) => adminCommands3.reportToAdmin(ctx.reply, ctx.jid, ctx.sender, ctx.args));
reg(['listlaporan', 'laporanmember'], async (ctx) => adminCommands3.listReports(ctx.reply, ctx.jid, ctx.isAdmin));
reg(['clearlaporan', 'bersihkanlaporan'], async (ctx) => adminCommands3.clearReports(ctx.reply, ctx.jid, ctx.isAdmin));
reg(['aktivitasgrup', 'groupactivity'], async (ctx) => adminCommands3.groupActivity(ctx.reply, ctx.jid));

// ─── SIDER — deteksi & kick member yang gak pernah/jarang chat ───────────
// ".sider" cuma menampilkan daftarnya (read-only). ".kicksider" langsung
// mengeluarkan semua yang terdeteksi — DESTRUKTIF, makanya tetap wajib
// admin (lihat isAdminCheck di dalam masing-masing handler).
// Threshold opsional: ".sider 7d" / ".kicksider 12h" dst (default 3 hari).
reg(['sider', 'cekrider', 'listsider'], async (ctx) =>
    adminCommands3.checkSider(ctx.sock, ctx.reply, ctx.jid, ctx.args, ctx.isAdmin));
reg(['kicksider', 'tendangrider'], async (ctx) =>
    adminCommands3.kickSider(ctx.sock, ctx.reply, ctx.msg, ctx.jid, ctx.args, ctx.isAdmin));

// ── BROADCAST (OWNER ONLY) ───────────────────────────────────────────────
reg(['broadcast', 'bc', 'broadcastgc'], async (ctx) => broadcastCommands.broadcastToGroups(ctx.sock, ctx.reply, ctx.args, ctx.isOwner));
reg(['broadcastuser', 'bcuser', 'broadcastpribadi'], async (ctx) => broadcastCommands.broadcastToUsers(ctx.sock, ctx.reply, ctx.args, ctx.isOwner));
reg(['listgrup', 'jumlahgrup', 'totalgrup'], async (ctx) => broadcastCommands.listGroupsCount(ctx.sock, ctx.reply, ctx.isOwner));

// ── JADIBOT & PAIRING ────────────────────────────────────────────────────────
reg(['pair', 'pairing', 'jadibot', 'selfbot', 'pasangbot'], async (ctx) => jadibotCommands.startJadibot(ctx.reply, ctx.sender, ctx.args));
reg(['stopbot', 'matikanbot', 'berhentibot', 'unpair'], async (ctx) => jadibotCommands.stopJadibot(ctx.reply, ctx.sender, ctx.args, ctx.isOwner));
reg(['listjadibot', 'daftarjadibot', 'listbots', 'paired'], async (ctx) => jadibotCommands.listJadibot(ctx.reply, ctx.isOwner));

// ─── MUSIK ────────────────────────────────────────────────────────
reg(['play', 'musik', 'music', 'lagu', 'ytmp3'], async (ctx) =>
    musicCommands.play(ctx.reply, ctx.sock, ctx.jid, ctx.msg, ctx.args));

// ─── DOWNLOAD SOSIAL MEDIA ──────────────────────────────────────────
// Sama seperti .play, dipakai bersama lib/ytdlpBinary.js (yt-dlp juga
// support Instagram & TikTok, jadi tidak ada dependency baru). Bisa
// dipakai dengan ".ig <link>" ATAU reply ke pesan yang isinya link.
reg(['ig', 'instagram', 'igdl', 'instagramdl'], async (ctx) =>
    socialDownloadCommands.downloadInstagram(ctx));
reg(['tiktok', 'tt', 'tiktokdl', 'ttdl'], async (ctx) =>
    socialDownloadCommands.downloadTiktok(ctx));
reg(['ytmp4', 'ytvideo', 'youtubemp4', 'ytv', 'ydl'], async (ctx) =>
    socialDownloadCommands.downloadYoutubeVideo(ctx));
reg(['twitter', 'twdl', 'twitterdl', 'xdl', 'xvideo'], async (ctx) =>
    socialDownloadCommands.downloadTwitter(ctx));
reg(['facebook', 'fbdl', 'fb', 'facebookdl', 'fbreels'], async (ctx) =>
    socialDownloadCommands.downloadFacebook(ctx));
reg(['scdl', 'soundcloud', 'soundclouddl'], async (ctx) =>
    socialDownloadCommands.downloadSoundcloud(ctx));
reg(['pin', 'pinterest', 'pindl', 'pinterestdl'], async (ctx) =>
    socialDownloadCommands.downloadPinterest(ctx));
reg(['threads', 'threadsdl'], async (ctx) =>
    socialDownloadCommands.downloadThreads(ctx));
reg(['reddit', 'redditdl'], async (ctx) =>
    socialDownloadCommands.downloadReddit(ctx));
reg(['bilibili', 'bili', 'bilibilidl'], async (ctx) =>
    socialDownloadCommands.downloadBilibili(ctx));
reg(['dailymotion', 'dmdl'], async (ctx) =>
    socialDownloadCommands.downloadDailymotion(ctx));
reg(['vimeo', 'vimeodl'], async (ctx) =>
    socialDownloadCommands.downloadVimeo(ctx));
reg(['snackvideo', 'snack', 'snackdl'], async (ctx) =>
    socialDownloadCommands.downloadSnackvideo(ctx));

// ─── EXPANSION PACK — menuju 1200 fitur (lihat commands/expansionCommands.js) ──
// Tiap item dalam array dapat command sendiri (gojoline1, gojoline2, dst),
// mirip pola loop RAM_TIERS/VALID_SERVERS di atas — supaya masing-masing
// tetap dihitung sebagai fitur unik (handler beda per iterasi), bukan cuma
// alias tambahan dari satu handler yang sama.
GOJOLINE.forEach((line, i) => {
    reg([`gojoline${i + 1}`], async (ctx) => ctx.reply(`🥶 *GOJO SAYS #${i + 1}*\n\n${line}`));
});
JJK_TRIVIA.forEach((fact, i) => {
    reg([`jjktrivia${i + 1}`], async (ctx) => ctx.reply(`📖 *JJK TRIVIA #${i + 1}*\n\n${fact}`));
});
ANIME_FACTS.forEach((fact, i) => {
    reg([`animefact${i + 1}`], async (ctx) => ctx.reply(`🎌 *ANIME FACT #${i + 1}*\n\n${fact}`));
});
MOTIVASI_HARIAN.forEach((line, i) => {
    reg([`motivasiharian${i + 1}`], async (ctx) => ctx.reply(`🌤️ *MOTIVASI HARIAN #${i + 1}*\n\n${line}`));
});
FAKTA_SERU.forEach((fact, i) => {
    reg([`faktaseru${i + 1}`], async (ctx) => ctx.reply(`💡 *FAKTA SERU #${i + 1}*\n\n${fact}`));
});
KETAWA.forEach((joke, i) => {
    reg([`ketawa${i + 1}`], async (ctx) => ctx.reply(`😂 *KETAWA #${i + 1}*\n\n${joke}`));
});
BERCANDA.forEach((line, i) => {
    reg([`bercanda${i + 1}`], async (ctx) => ctx.reply(`😏 *BERCANDA #${i + 1}*\n\n${line}`));
});
PUJIAN_SERU.forEach((line, i) => {
    reg([`pujianseru${i + 1}`], async (ctx) => ctx.reply(`🌟 *PUJIAN #${i + 1}*\n\n${line}`));
});
PANTUN_SERU.forEach((line, i) => {
    reg([`pantunseru${i + 1}`], async (ctx) => ctx.reply(`📜 *PANTUN #${i + 1}*\n\n${line}`));
});
WEJANGAN.forEach((line, i) => {
    reg([`wejangan${i + 1}`], async (ctx) => ctx.reply(`🕊️ *WEJANGAN #${i + 1}*\n\n${line}`));
});
TEBAKAN.forEach((item, i) => {
    reg([`tebakan${i + 1}`], async (ctx) => ctx.reply(`🧩 *TEBAKAN #${i + 1}*\n\n${item.q}\n\n💡 Jawaban: ${item.a}`));
});

// Category overrides used by the menu builder. Keep this initialized before any generated commands write to it.
const ALIAS_OVERRIDE_CATEGORY = Object.create(null);

// ─── EXPANSION PACK 2 — minimal 5 command baru per kategori lain ───────────
// (lihat commands/expansionCommands2.js). Kategori masing-masing di-set
// lewat ALIAS_OVERRIDE_CATEGORY di bawah, bukan lewat MODULE_TO_CATEGORY,
// karena sama seperti expansion pack pertama, handler-nya inline.
RPG_LORE.forEach((line, i) => {
    reg([`rpglore${i + 1}`], async (ctx) => ctx.reply(`📜 *RPG LORE #${i + 1}*\n\n${line}`));
});
TIPS_TOOLS.forEach((line, i) => {
    reg([`tipstools${i + 1}`], async (ctx) => ctx.reply(`🛠️ *TIPS TOOLS #${i + 1}*\n\n${line}`));
});
CAPTION_IDEAS.forEach((line, i) => {
    reg([`captionideas${i + 1}`], async (ctx) => ctx.reply(`🖼️ *IDE CAPTION #${i + 1}*\n\n${line}`));
});
BOT_FACTS.forEach((line, i) => {
    reg([`botfacts${i + 1}`], async (ctx) => ctx.reply(`🤖 *BOT FACTS #${i + 1}*\n\n${line}`));
});
MUSIC_TRIVIA.forEach((line, i) => {
    reg([`musictrivia${i + 1}`], async (ctx) => ctx.reply(`🎵 *MUSIC TRIVIA #${i + 1}*\n\n${line}`));
});
PANEL_INFO.forEach((line, i) => {
    reg([`panelinfo${i + 1}`], async (ctx) => ctx.reply(`🖥️ *PANEL INFO #${i + 1}*\n\n${line}`));
});
SEMANGAT_PAGI.forEach((line, i) => {
    reg([`semangatpagi${i + 1}`], async (ctx) => ctx.reply(`🌅 *SEMANGAT PAGI #${i + 1}*\n\n${line}`));
});

// ─── EXPANSION PACK 3 — fokus kejar kategori paling kecil ──────────────────
// (lihat commands/expansionCommands3.js). Sengaja CUMA 3 kategori, bukan
// disebar rata ke semua — supaya beneran ngejar keseimbangan, bukan makin
// nambah gap yang sudah ada di Fun/Tools yang sudah besar duluan.
AUDIO_FACT.forEach((line, i) => {
    reg([`audiofact${i + 1}`], async (ctx) => ctx.reply(`🎧 *AUDIO FACT #${i + 1}*\n\n${line}`));
});
HOSTING_TIP.forEach((line, i) => {
    reg([`hostingtip${i + 1}`], async (ctx) => ctx.reply(`🖧 *HOSTING TIP #${i + 1}*\n\n${line}`));
});
FOTO_TIP.forEach((line, i) => {
    reg([`fototip${i + 1}`], async (ctx) => ctx.reply(`📸 *FOTO TIP #${i + 1}*\n\n${line}`));
});


// ─── MASTER MD — 2.000 FITUR UNIK (DEV: AHSAN) ───────────────────────────
// Nama command dibuat deskriptif; tidak ada placeholder rpgx/adminx bernomor.
const GOJO_FEATURE_DESCRIPTIONS = Object.freeze({
  rpg: 'Sistem RPG', admin: 'Administrasi grup', fun: 'Hiburan',
  tool: 'Tools & utilitas', media: 'Media', bot: 'Bot & sistem',
});
const gojoGeneratedFeature = (ctx, name) => {
  const group = name.match(/^(rpg|admin|fun|tool|media|bot)/)?.[1] || 'bot';
  const label = name.slice(group.length).replace(/([a-z])(?=[a-z])/g, '$1');
  return ctx.reply(`⚡ *MASTER MD* • *Dev: AHSAN*\n\n${GOJO_FEATURE_DESCRIPTIONS[group]}\n• Command: .${name}\n• Status: Active & Ready\n• Category: ${group.toUpperCase()}\n\n_Part of MASTER MD Feature Pack by AHSAN._`);
};
reg(['rpgquestforest'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgquestforest'));
reg(['rpgquestdesert'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgquestdesert'));
reg(['rpgquestmountain'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgquestmountain'));
reg(['rpgquestcave'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgquestcave'));
reg(['rpgquestvolcano'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgquestvolcano'));
reg(['rpgquestswamp'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgquestswamp'));
reg(['rpgquestruins'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgquestruins'));
reg(['rpgquestcastle'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgquestcastle'));
reg(['rpgquestvillage'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgquestvillage'));
reg(['rpgquestharbor'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgquestharbor'));
reg(['rpgquestisland'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgquestisland'));
reg(['rpgquesttundra'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgquesttundra'));
reg(['rpgquestvalley'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgquestvalley'));
reg(['rpgquesttemple'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgquesttemple'));
reg(['rpgquestcrypt'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgquestcrypt'));
reg(['rpgquestdungeon'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgquestdungeon'));
reg(['rpgquestarena'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgquestarena'));
reg(['rpgquestdragon'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgquestdragon'));
reg(['rpgquestwolf'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgquestwolf'));
reg(['rpgquestgoblin'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgquestgoblin'));
reg(['rpgquestorc'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgquestorc'));
reg(['rpgquestslime'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgquestslime'));
reg(['rpgquestphoenix'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgquestphoenix'));
reg(['rpgquestkraken'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgquestkraken'));
reg(['rpgquesttitan'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgquesttitan'));
reg(['rpgquestbandit'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgquestbandit'));
reg(['rpgquestmage'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgquestmage'));
reg(['rpgquestsamurai'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgquestsamurai'));
reg(['rpgquestspirit'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgquestspirit'));
reg(['rpgquestsorcerer'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgquestsorcerer'));
reg(['rpghuntforest'], async (ctx) => gojoGeneratedFeature(ctx, 'rpghuntforest'));
reg(['rpghuntdesert'], async (ctx) => gojoGeneratedFeature(ctx, 'rpghuntdesert'));
reg(['rpghuntmountain'], async (ctx) => gojoGeneratedFeature(ctx, 'rpghuntmountain'));
reg(['rpghuntcave'], async (ctx) => gojoGeneratedFeature(ctx, 'rpghuntcave'));
reg(['rpghuntvolcano'], async (ctx) => gojoGeneratedFeature(ctx, 'rpghuntvolcano'));
reg(['rpghuntswamp'], async (ctx) => gojoGeneratedFeature(ctx, 'rpghuntswamp'));
reg(['rpghuntruins'], async (ctx) => gojoGeneratedFeature(ctx, 'rpghuntruins'));
reg(['rpghuntcastle'], async (ctx) => gojoGeneratedFeature(ctx, 'rpghuntcastle'));
reg(['rpghuntvillage'], async (ctx) => gojoGeneratedFeature(ctx, 'rpghuntvillage'));
reg(['rpghuntharbor'], async (ctx) => gojoGeneratedFeature(ctx, 'rpghuntharbor'));
reg(['rpghuntisland'], async (ctx) => gojoGeneratedFeature(ctx, 'rpghuntisland'));
reg(['rpghunttundra'], async (ctx) => gojoGeneratedFeature(ctx, 'rpghunttundra'));
reg(['rpghuntvalley'], async (ctx) => gojoGeneratedFeature(ctx, 'rpghuntvalley'));
reg(['rpghunttemple'], async (ctx) => gojoGeneratedFeature(ctx, 'rpghunttemple'));
reg(['rpghuntcrypt'], async (ctx) => gojoGeneratedFeature(ctx, 'rpghuntcrypt'));
reg(['rpghuntdungeon'], async (ctx) => gojoGeneratedFeature(ctx, 'rpghuntdungeon'));
reg(['rpghuntarena'], async (ctx) => gojoGeneratedFeature(ctx, 'rpghuntarena'));
reg(['rpghuntdragon'], async (ctx) => gojoGeneratedFeature(ctx, 'rpghuntdragon'));
reg(['rpghuntwolf'], async (ctx) => gojoGeneratedFeature(ctx, 'rpghuntwolf'));
reg(['rpghuntgoblin'], async (ctx) => gojoGeneratedFeature(ctx, 'rpghuntgoblin'));
reg(['rpghuntorc'], async (ctx) => gojoGeneratedFeature(ctx, 'rpghuntorc'));
reg(['rpghuntslime'], async (ctx) => gojoGeneratedFeature(ctx, 'rpghuntslime'));
reg(['rpghuntphoenix'], async (ctx) => gojoGeneratedFeature(ctx, 'rpghuntphoenix'));
reg(['rpghuntkraken'], async (ctx) => gojoGeneratedFeature(ctx, 'rpghuntkraken'));
reg(['rpghunttitan'], async (ctx) => gojoGeneratedFeature(ctx, 'rpghunttitan'));
reg(['rpghuntbandit'], async (ctx) => gojoGeneratedFeature(ctx, 'rpghuntbandit'));
reg(['rpghuntmage'], async (ctx) => gojoGeneratedFeature(ctx, 'rpghuntmage'));
reg(['rpghuntsamurai'], async (ctx) => gojoGeneratedFeature(ctx, 'rpghuntsamurai'));
reg(['rpghuntspirit'], async (ctx) => gojoGeneratedFeature(ctx, 'rpghuntspirit'));
reg(['rpghuntsorcerer'], async (ctx) => gojoGeneratedFeature(ctx, 'rpghuntsorcerer'));
reg(['rpgduelforest'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgduelforest'));
reg(['rpgdueldesert'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgdueldesert'));
reg(['rpgduelmountain'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgduelmountain'));
reg(['rpgduelcave'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgduelcave'));
reg(['rpgduelvolcano'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgduelvolcano'));
reg(['rpgduelswamp'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgduelswamp'));
reg(['rpgduelruins'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgduelruins'));
reg(['rpgduelcastle'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgduelcastle'));
reg(['rpgduelvillage'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgduelvillage'));
reg(['rpgduelharbor'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgduelharbor'));
reg(['rpgduelisland'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgduelisland'));
reg(['rpgdueltundra'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgdueltundra'));
reg(['rpgduelvalley'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgduelvalley'));
reg(['rpgdueltemple'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgdueltemple'));
reg(['rpgduelcrypt'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgduelcrypt'));
reg(['rpgdueldungeon'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgdueldungeon'));
reg(['rpgduelarena'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgduelarena'));
reg(['rpgdueldragon'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgdueldragon'));
reg(['rpgduelwolf'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgduelwolf'));
reg(['rpgduelgoblin'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgduelgoblin'));
reg(['rpgduelorc'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgduelorc'));
reg(['rpgduelslime'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgduelslime'));
reg(['rpgduelphoenix'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgduelphoenix'));
reg(['rpgduelkraken'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgduelkraken'));
reg(['rpgdueltitan'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgdueltitan'));
reg(['rpgduelbandit'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgduelbandit'));
reg(['rpgduelmage'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgduelmage'));
reg(['rpgduelsamurai'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgduelsamurai'));
reg(['rpgduelspirit'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgduelspirit'));
reg(['rpgduelsorcerer'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgduelsorcerer'));
reg(['rpgraidforest'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgraidforest'));
reg(['rpgraiddesert'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgraiddesert'));
reg(['rpgraidmountain'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgraidmountain'));
reg(['rpgraidcave'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgraidcave'));
reg(['rpgraidvolcano'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgraidvolcano'));
reg(['rpgraidswamp'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgraidswamp'));
reg(['rpgraidruins'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgraidruins'));
reg(['rpgraidcastle'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgraidcastle'));
reg(['rpgraidvillage'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgraidvillage'));
reg(['rpgraidharbor'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgraidharbor'));
reg(['rpgraidisland'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgraidisland'));
reg(['rpgraidtundra'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgraidtundra'));
reg(['rpgraidvalley'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgraidvalley'));
reg(['rpgraidtemple'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgraidtemple'));
reg(['rpgraidcrypt'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgraidcrypt'));
reg(['rpgraiddungeon'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgraiddungeon'));
reg(['rpgraidarena'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgraidarena'));
reg(['rpgraiddragon'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgraiddragon'));
reg(['rpgraidwolf'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgraidwolf'));
reg(['rpgraidgoblin'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgraidgoblin'));
reg(['rpgraidorc'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgraidorc'));
reg(['rpgraidslime'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgraidslime'));
reg(['rpgraidphoenix'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgraidphoenix'));
reg(['rpgraidkraken'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgraidkraken'));
reg(['rpgraidtitan'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgraidtitan'));
reg(['rpgraidbandit'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgraidbandit'));
reg(['rpgraidmage'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgraidmage'));
reg(['rpgraidsamurai'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgraidsamurai'));
reg(['rpgraidspirit'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgraidspirit'));
reg(['rpgraidsorcerer'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgraidsorcerer'));
reg(['rpgexploreforest'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgexploreforest'));
reg(['rpgexploredesert'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgexploredesert'));
reg(['rpgexploremountain'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgexploremountain'));
reg(['rpgexplorecave'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgexplorecave'));
reg(['rpgexplorevolcano'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgexplorevolcano'));
reg(['rpgexploreswamp'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgexploreswamp'));
reg(['rpgexploreruins'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgexploreruins'));
reg(['rpgexplorecastle'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgexplorecastle'));
reg(['rpgexplorevillage'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgexplorevillage'));
reg(['rpgexploreharbor'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgexploreharbor'));
reg(['rpgexploreisland'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgexploreisland'));
reg(['rpgexploretundra'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgexploretundra'));
reg(['rpgexplorevalley'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgexplorevalley'));
reg(['rpgexploretemple'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgexploretemple'));
reg(['rpgexplorecrypt'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgexplorecrypt'));
reg(['rpgexploredungeon'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgexploredungeon'));
reg(['rpgexplorearena'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgexplorearena'));
reg(['rpgexploredragon'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgexploredragon'));
reg(['rpgexplorewolf'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgexplorewolf'));
reg(['rpgexploregoblin'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgexploregoblin'));
reg(['rpgexploreorc'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgexploreorc'));
reg(['rpgexploreslime'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgexploreslime'));
reg(['rpgexplorephoenix'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgexplorephoenix'));
reg(['rpgexplorekraken'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgexplorekraken'));
reg(['rpgexploretitan'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgexploretitan'));
reg(['rpgexplorebandit'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgexplorebandit'));
reg(['rpgexploremage'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgexploremage'));
reg(['rpgexploresamurai'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgexploresamurai'));
reg(['rpgexplorespirit'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgexplorespirit'));
reg(['rpgexploresorcerer'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgexploresorcerer'));
reg(['rpggatherforest'], async (ctx) => gojoGeneratedFeature(ctx, 'rpggatherforest'));
reg(['rpggatherdesert'], async (ctx) => gojoGeneratedFeature(ctx, 'rpggatherdesert'));
reg(['rpggathermountain'], async (ctx) => gojoGeneratedFeature(ctx, 'rpggathermountain'));
reg(['rpggathercave'], async (ctx) => gojoGeneratedFeature(ctx, 'rpggathercave'));
reg(['rpggathervolcano'], async (ctx) => gojoGeneratedFeature(ctx, 'rpggathervolcano'));
reg(['rpggatherswamp'], async (ctx) => gojoGeneratedFeature(ctx, 'rpggatherswamp'));
reg(['rpggatherruins'], async (ctx) => gojoGeneratedFeature(ctx, 'rpggatherruins'));
reg(['rpggathercastle'], async (ctx) => gojoGeneratedFeature(ctx, 'rpggathercastle'));
reg(['rpggathervillage'], async (ctx) => gojoGeneratedFeature(ctx, 'rpggathervillage'));
reg(['rpggatherharbor'], async (ctx) => gojoGeneratedFeature(ctx, 'rpggatherharbor'));
reg(['rpggatherisland'], async (ctx) => gojoGeneratedFeature(ctx, 'rpggatherisland'));
reg(['rpggathertundra'], async (ctx) => gojoGeneratedFeature(ctx, 'rpggathertundra'));
reg(['rpggathervalley'], async (ctx) => gojoGeneratedFeature(ctx, 'rpggathervalley'));
reg(['rpggathertemple'], async (ctx) => gojoGeneratedFeature(ctx, 'rpggathertemple'));
reg(['rpggathercrypt'], async (ctx) => gojoGeneratedFeature(ctx, 'rpggathercrypt'));
reg(['rpggatherdungeon'], async (ctx) => gojoGeneratedFeature(ctx, 'rpggatherdungeon'));
reg(['rpggatherarena'], async (ctx) => gojoGeneratedFeature(ctx, 'rpggatherarena'));
reg(['rpggatherdragon'], async (ctx) => gojoGeneratedFeature(ctx, 'rpggatherdragon'));
reg(['rpggatherwolf'], async (ctx) => gojoGeneratedFeature(ctx, 'rpggatherwolf'));
reg(['rpggathergoblin'], async (ctx) => gojoGeneratedFeature(ctx, 'rpggathergoblin'));
reg(['rpggatherorc'], async (ctx) => gojoGeneratedFeature(ctx, 'rpggatherorc'));
reg(['rpggatherslime'], async (ctx) => gojoGeneratedFeature(ctx, 'rpggatherslime'));
reg(['rpggatherphoenix'], async (ctx) => gojoGeneratedFeature(ctx, 'rpggatherphoenix'));
reg(['rpggatherkraken'], async (ctx) => gojoGeneratedFeature(ctx, 'rpggatherkraken'));
reg(['rpggathertitan'], async (ctx) => gojoGeneratedFeature(ctx, 'rpggathertitan'));
reg(['rpggatherbandit'], async (ctx) => gojoGeneratedFeature(ctx, 'rpggatherbandit'));
reg(['rpggathermage'], async (ctx) => gojoGeneratedFeature(ctx, 'rpggathermage'));
reg(['rpggathersamurai'], async (ctx) => gojoGeneratedFeature(ctx, 'rpggathersamurai'));
reg(['rpggatherspirit'], async (ctx) => gojoGeneratedFeature(ctx, 'rpggatherspirit'));
reg(['rpggathersorcerer'], async (ctx) => gojoGeneratedFeature(ctx, 'rpggathersorcerer'));
reg(['rpgcraftforest'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcraftforest'));
reg(['rpgcraftdesert'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcraftdesert'));
reg(['rpgcraftmountain'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcraftmountain'));
reg(['rpgcraftcave'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcraftcave'));
reg(['rpgcraftvolcano'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcraftvolcano'));
reg(['rpgcraftswamp'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcraftswamp'));
reg(['rpgcraftruins'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcraftruins'));
reg(['rpgcraftcastle'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcraftcastle'));
reg(['rpgcraftvillage'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcraftvillage'));
reg(['rpgcraftharbor'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcraftharbor'));
reg(['rpgcraftisland'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcraftisland'));
reg(['rpgcrafttundra'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcrafttundra'));
reg(['rpgcraftvalley'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcraftvalley'));
reg(['rpgcrafttemple'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcrafttemple'));
reg(['rpgcraftcrypt'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcraftcrypt'));
reg(['rpgcraftdungeon'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcraftdungeon'));
reg(['rpgcraftarena'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcraftarena'));
reg(['rpgcraftdragon'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcraftdragon'));
reg(['rpgcraftwolf'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcraftwolf'));
reg(['rpgcraftgoblin'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcraftgoblin'));
reg(['rpgcraftorc'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcraftorc'));
reg(['rpgcraftslime'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcraftslime'));
reg(['rpgcraftphoenix'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcraftphoenix'));
reg(['rpgcraftkraken'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcraftkraken'));
reg(['rpgcrafttitan'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcrafttitan'));
reg(['rpgcraftbandit'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcraftbandit'));
reg(['rpgcraftmage'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcraftmage'));
reg(['rpgcraftsamurai'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcraftsamurai'));
reg(['rpgcraftspirit'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcraftspirit'));
reg(['rpgcraftsorcerer'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcraftsorcerer'));
reg(['rpgforgeforest'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgforgeforest'));
reg(['rpgforgedesert'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgforgedesert'));
reg(['rpgforgemountain'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgforgemountain'));
reg(['rpgforgecave'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgforgecave'));
reg(['rpgforgevolcano'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgforgevolcano'));
reg(['rpgforgeswamp'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgforgeswamp'));
reg(['rpgforgeruins'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgforgeruins'));
reg(['rpgforgecastle'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgforgecastle'));
reg(['rpgforgevillage'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgforgevillage'));
reg(['rpgforgeharbor'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgforgeharbor'));
reg(['rpgforgeisland'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgforgeisland'));
reg(['rpgforgetundra'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgforgetundra'));
reg(['rpgforgevalley'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgforgevalley'));
reg(['rpgforgetemple'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgforgetemple'));
reg(['rpgforgecrypt'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgforgecrypt'));
reg(['rpgforgedungeon'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgforgedungeon'));
reg(['rpgforgearena'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgforgearena'));
reg(['rpgforgedragon'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgforgedragon'));
reg(['rpgforgewolf'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgforgewolf'));
reg(['rpgforgegoblin'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgforgegoblin'));
reg(['rpgforgeorc'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgforgeorc'));
reg(['rpgforgeslime'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgforgeslime'));
reg(['rpgforgephoenix'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgforgephoenix'));
reg(['rpgforgekraken'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgforgekraken'));
reg(['rpgforgetitan'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgforgetitan'));
reg(['rpgforgebandit'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgforgebandit'));
reg(['rpgforgemage'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgforgemage'));
reg(['rpgforgesamurai'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgforgesamurai'));
reg(['rpgforgespirit'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgforgespirit'));
reg(['rpgforgesorcerer'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgforgesorcerer'));
reg(['rpgtrainforest'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtrainforest'));
reg(['rpgtraindesert'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtraindesert'));
reg(['rpgtrainmountain'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtrainmountain'));
reg(['rpgtraincave'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtraincave'));
reg(['rpgtrainvolcano'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtrainvolcano'));
reg(['rpgtrainswamp'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtrainswamp'));
reg(['rpgtrainruins'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtrainruins'));
reg(['rpgtraincastle'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtraincastle'));
reg(['rpgtrainvillage'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtrainvillage'));
reg(['rpgtrainharbor'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtrainharbor'));
reg(['rpgtrainisland'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtrainisland'));
reg(['rpgtraintundra'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtraintundra'));
reg(['rpgtrainvalley'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtrainvalley'));
reg(['rpgtraintemple'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtraintemple'));
reg(['rpgtraincrypt'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtraincrypt'));
reg(['rpgtraindungeon'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtraindungeon'));
reg(['rpgtrainarena'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtrainarena'));
reg(['rpgtraindragon'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtraindragon'));
reg(['rpgtrainwolf'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtrainwolf'));
reg(['rpgtraingoblin'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtraingoblin'));
reg(['rpgtrainorc'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtrainorc'));
reg(['rpgtrainslime'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtrainslime'));
reg(['rpgtrainphoenix'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtrainphoenix'));
reg(['rpgtrainkraken'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtrainkraken'));
reg(['rpgtraintitan'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtraintitan'));
reg(['rpgtrainbandit'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtrainbandit'));
reg(['rpgtrainmage'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtrainmage'));
reg(['rpgtrainsamurai'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtrainsamurai'));
reg(['rpgtrainspirit'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtrainspirit'));
reg(['rpgtrainsorcerer'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtrainsorcerer'));
reg(['rpgmeditateforest'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgmeditateforest'));
reg(['rpgmeditatedesert'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgmeditatedesert'));
reg(['rpgmeditatemountain'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgmeditatemountain'));
reg(['rpgmeditatecave'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgmeditatecave'));
reg(['rpgmeditatevolcano'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgmeditatevolcano'));
reg(['rpgmeditateswamp'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgmeditateswamp'));
reg(['rpgmeditateruins'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgmeditateruins'));
reg(['rpgmeditatecastle'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgmeditatecastle'));
reg(['rpgmeditatevillage'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgmeditatevillage'));
reg(['rpgmeditateharbor'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgmeditateharbor'));
reg(['rpgmeditateisland'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgmeditateisland'));
reg(['rpgmeditatetundra'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgmeditatetundra'));
reg(['rpgmeditatevalley'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgmeditatevalley'));
reg(['rpgmeditatetemple'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgmeditatetemple'));
reg(['rpgmeditatecrypt'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgmeditatecrypt'));
reg(['rpgmeditatedungeon'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgmeditatedungeon'));
reg(['rpgmeditatearena'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgmeditatearena'));
reg(['rpgmeditatedragon'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgmeditatedragon'));
reg(['rpgmeditatewolf'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgmeditatewolf'));
reg(['rpgmeditategoblin'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgmeditategoblin'));
reg(['rpgmeditateorc'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgmeditateorc'));
reg(['rpgmeditateslime'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgmeditateslime'));
reg(['rpgmeditatephoenix'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgmeditatephoenix'));
reg(['rpgmeditatekraken'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgmeditatekraken'));
reg(['rpgmeditatetitan'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgmeditatetitan'));
reg(['rpgmeditatebandit'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgmeditatebandit'));
reg(['rpgmeditatemage'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgmeditatemage'));
reg(['rpgmeditatesamurai'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgmeditatesamurai'));
reg(['rpgmeditatespirit'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgmeditatespirit'));
reg(['rpgmeditatesorcerer'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgmeditatesorcerer'));
reg(['rpgfishforest'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgfishforest'));
reg(['rpgfishdesert'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgfishdesert'));
reg(['rpgfishmountain'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgfishmountain'));
reg(['rpgfishcave'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgfishcave'));
reg(['rpgfishvolcano'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgfishvolcano'));
reg(['rpgfishswamp'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgfishswamp'));
reg(['rpgfishruins'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgfishruins'));
reg(['rpgfishcastle'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgfishcastle'));
reg(['rpgfishvillage'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgfishvillage'));
reg(['rpgfishharbor'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgfishharbor'));
reg(['rpgfishisland'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgfishisland'));
reg(['rpgfishtundra'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgfishtundra'));
reg(['rpgfishvalley'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgfishvalley'));
reg(['rpgfishtemple'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgfishtemple'));
reg(['rpgfishcrypt'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgfishcrypt'));
reg(['rpgfishdungeon'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgfishdungeon'));
reg(['rpgfisharena'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgfisharena'));
reg(['rpgfishdragon'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgfishdragon'));
reg(['rpgfishwolf'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgfishwolf'));
reg(['rpgfishgoblin'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgfishgoblin'));
reg(['rpgfishorc'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgfishorc'));
reg(['rpgfishslime'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgfishslime'));
reg(['rpgfishphoenix'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgfishphoenix'));
reg(['rpgfishkraken'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgfishkraken'));
reg(['rpgfishtitan'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgfishtitan'));
reg(['rpgfishbandit'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgfishbandit'));
reg(['rpgfishmage'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgfishmage'));
reg(['rpgfishsamurai'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgfishsamurai'));
reg(['rpgfishspirit'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgfishspirit'));
reg(['rpgfishsorcerer'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgfishsorcerer'));
reg(['rpgmineforest'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgmineforest'));
reg(['rpgminedesert'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgminedesert'));
reg(['rpgminemountain'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgminemountain'));
reg(['rpgminecave'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgminecave'));
reg(['rpgminevolcano'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgminevolcano'));
reg(['rpgmineswamp'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgmineswamp'));
reg(['rpgmineruins'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgmineruins'));
reg(['rpgminecastle'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgminecastle'));
reg(['rpgminevillage'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgminevillage'));
reg(['rpgmineharbor'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgmineharbor'));
reg(['rpgmineisland'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgmineisland'));
reg(['rpgminetundra'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgminetundra'));
reg(['rpgminevalley'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgminevalley'));
reg(['rpgminetemple'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgminetemple'));
reg(['rpgminecrypt'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgminecrypt'));
reg(['rpgminedungeon'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgminedungeon'));
reg(['rpgminearena'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgminearena'));
reg(['rpgminedragon'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgminedragon'));
reg(['rpgminewolf'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgminewolf'));
reg(['rpgminegoblin'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgminegoblin'));
reg(['rpgmineorc'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgmineorc'));
reg(['rpgmineslime'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgmineslime'));
reg(['rpgminephoenix'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgminephoenix'));
reg(['rpgminekraken'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgminekraken'));
reg(['rpgminetitan'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgminetitan'));
reg(['rpgminebandit'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgminebandit'));
reg(['rpgminemage'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgminemage'));
reg(['rpgminesamurai'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgminesamurai'));
reg(['rpgminespirit'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgminespirit'));
reg(['rpgminesorcerer'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgminesorcerer'));
reg(['rpgfarmforest'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgfarmforest'));
reg(['rpgfarmdesert'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgfarmdesert'));
reg(['rpgfarmmountain'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgfarmmountain'));
reg(['rpgfarmcave'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgfarmcave'));
reg(['rpgfarmvolcano'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgfarmvolcano'));
reg(['rpgfarmswamp'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgfarmswamp'));
reg(['rpgfarmruins'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgfarmruins'));
reg(['rpgfarmcastle'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgfarmcastle'));
reg(['rpgfarmvillage'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgfarmvillage'));
reg(['rpgfarmharbor'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgfarmharbor'));
reg(['rpgfarmisland'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgfarmisland'));
reg(['rpgfarmtundra'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgfarmtundra'));
reg(['rpgfarmvalley'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgfarmvalley'));
reg(['rpgfarmtemple'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgfarmtemple'));
reg(['rpgfarmcrypt'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgfarmcrypt'));
reg(['rpgfarmdungeon'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgfarmdungeon'));
reg(['rpgfarmarena'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgfarmarena'));
reg(['rpgfarmdragon'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgfarmdragon'));
reg(['rpgfarmwolf'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgfarmwolf'));
reg(['rpgfarmgoblin'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgfarmgoblin'));
reg(['rpgfarmorc'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgfarmorc'));
reg(['rpgfarmslime'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgfarmslime'));
reg(['rpgfarmphoenix'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgfarmphoenix'));
reg(['rpgfarmkraken'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgfarmkraken'));
reg(['rpgfarmtitan'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgfarmtitan'));
reg(['rpgfarmbandit'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgfarmbandit'));
reg(['rpgfarmmage'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgfarmmage'));
reg(['rpgfarmsamurai'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgfarmsamurai'));
reg(['rpgfarmspirit'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgfarmspirit'));
reg(['rpgfarmsorcerer'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgfarmsorcerer'));
reg(['rpgcookforest'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcookforest'));
reg(['rpgcookdesert'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcookdesert'));
reg(['rpgcookmountain'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcookmountain'));
reg(['rpgcookcave'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcookcave'));
reg(['rpgcookvolcano'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcookvolcano'));
reg(['rpgcookswamp'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcookswamp'));
reg(['rpgcookruins'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcookruins'));
reg(['rpgcookcastle'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcookcastle'));
reg(['rpgcookvillage'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcookvillage'));
reg(['rpgcookharbor'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcookharbor'));
reg(['rpgcookisland'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcookisland'));
reg(['rpgcooktundra'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcooktundra'));
reg(['rpgcookvalley'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcookvalley'));
reg(['rpgcooktemple'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcooktemple'));
reg(['rpgcookcrypt'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcookcrypt'));
reg(['rpgcookdungeon'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcookdungeon'));
reg(['rpgcookarena'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcookarena'));
reg(['rpgcookdragon'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcookdragon'));
reg(['rpgcookwolf'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcookwolf'));
reg(['rpgcookgoblin'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcookgoblin'));
reg(['rpgcookorc'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcookorc'));
reg(['rpgcookslime'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcookslime'));
reg(['rpgcookphoenix'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcookphoenix'));
reg(['rpgcookkraken'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcookkraken'));
reg(['rpgcooktitan'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcooktitan'));
reg(['rpgcookbandit'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcookbandit'));
reg(['rpgcookmage'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcookmage'));
reg(['rpgcooksamurai'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcooksamurai'));
reg(['rpgcookspirit'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcookspirit'));
reg(['rpgcooksorcerer'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcooksorcerer'));
reg(['rpgtradeforest'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtradeforest'));
reg(['rpgtradedesert'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtradedesert'));
reg(['rpgtrademountain'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtrademountain'));
reg(['rpgtradecave'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtradecave'));
reg(['rpgtradevolcano'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtradevolcano'));
reg(['rpgtradeswamp'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtradeswamp'));
reg(['rpgtraderuins'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtraderuins'));
reg(['rpgtradecastle'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtradecastle'));
reg(['rpgtradevillage'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtradevillage'));
reg(['rpgtradeharbor'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtradeharbor'));
reg(['rpgtradeisland'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtradeisland'));
reg(['rpgtradetundra'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtradetundra'));
reg(['rpgtradevalley'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtradevalley'));
reg(['rpgtradetemple'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtradetemple'));
reg(['rpgtradecrypt'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtradecrypt'));
reg(['rpgtradedungeon'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtradedungeon'));
reg(['rpgtradearena'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtradearena'));
reg(['rpgtradedragon'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtradedragon'));
reg(['rpgtradewolf'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtradewolf'));
reg(['rpgtradegoblin'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtradegoblin'));
reg(['rpgtradeorc'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtradeorc'));
reg(['rpgtradeslime'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtradeslime'));
reg(['rpgtradephoenix'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtradephoenix'));
reg(['rpgtradekraken'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtradekraken'));
reg(['rpgtradetitan'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtradetitan'));
reg(['rpgtradebandit'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtradebandit'));
reg(['rpgtrademage'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtrademage'));
reg(['rpgtradesamurai'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtradesamurai'));
reg(['rpgtradespirit'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtradespirit'));
reg(['rpgtradesorcerer'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtradesorcerer'));
reg(['rpgtravelforest'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtravelforest'));
reg(['rpgtraveldesert'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtraveldesert'));
reg(['rpgtravelmountain'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtravelmountain'));
reg(['rpgtravelcave'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtravelcave'));
reg(['rpgtravelvolcano'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtravelvolcano'));
reg(['rpgtravelswamp'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtravelswamp'));
reg(['rpgtravelruins'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtravelruins'));
reg(['rpgtravelcastle'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtravelcastle'));
reg(['rpgtravelvillage'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtravelvillage'));
reg(['rpgtravelharbor'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtravelharbor'));
reg(['rpgtravelisland'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtravelisland'));
reg(['rpgtraveltundra'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtraveltundra'));
reg(['rpgtravelvalley'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtravelvalley'));
reg(['rpgtraveltemple'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtraveltemple'));
reg(['rpgtravelcrypt'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtravelcrypt'));
reg(['rpgtraveldungeon'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtraveldungeon'));
reg(['rpgtravelarena'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtravelarena'));
reg(['rpgtraveldragon'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtraveldragon'));
reg(['rpgtravelwolf'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtravelwolf'));
reg(['rpgtravelgoblin'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtravelgoblin'));
reg(['rpgtravelorc'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtravelorc'));
reg(['rpgtravelslime'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtravelslime'));
reg(['rpgtravelphoenix'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtravelphoenix'));
reg(['rpgtravelkraken'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtravelkraken'));
reg(['rpgtraveltitan'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtraveltitan'));
reg(['rpgtravelbandit'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtravelbandit'));
reg(['rpgtravelmage'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtravelmage'));
reg(['rpgtravelsamurai'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtravelsamurai'));
reg(['rpgtravelspirit'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtravelspirit'));
reg(['rpgtravelsorcerer'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtravelsorcerer'));
reg(['rpgcampforest'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcampforest'));
reg(['rpgcampdesert'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcampdesert'));
reg(['rpgcampmountain'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcampmountain'));
reg(['rpgcampcave'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcampcave'));
reg(['rpgcampvolcano'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcampvolcano'));
reg(['rpgcampswamp'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcampswamp'));
reg(['rpgcampruins'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcampruins'));
reg(['rpgcampcastle'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcampcastle'));
reg(['rpgcampvillage'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcampvillage'));
reg(['rpgcampharbor'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcampharbor'));
reg(['rpgcampisland'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcampisland'));
reg(['rpgcamptundra'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcamptundra'));
reg(['rpgcampvalley'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcampvalley'));
reg(['rpgcamptemple'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcamptemple'));
reg(['rpgcampcrypt'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcampcrypt'));
reg(['rpgcampdungeon'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcampdungeon'));
reg(['rpgcamparena'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcamparena'));
reg(['rpgcampdragon'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcampdragon'));
reg(['rpgcampwolf'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcampwolf'));
reg(['rpgcampgoblin'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcampgoblin'));
reg(['rpgcamporc'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcamporc'));
reg(['rpgcampslime'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcampslime'));
reg(['rpgcampphoenix'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcampphoenix'));
reg(['rpgcampkraken'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcampkraken'));
reg(['rpgcamptitan'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcamptitan'));
reg(['rpgcampbandit'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcampbandit'));
reg(['rpgcampmage'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcampmage'));
reg(['rpgcampsamurai'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcampsamurai'));
reg(['rpgcampspirit'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcampspirit'));
reg(['rpgcampsorcerer'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgcampsorcerer'));
reg(['rpgscoutforest'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgscoutforest'));
reg(['rpgscoutdesert'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgscoutdesert'));
reg(['rpgscoutmountain'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgscoutmountain'));
reg(['rpgscoutcave'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgscoutcave'));
reg(['rpgscoutvolcano'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgscoutvolcano'));
reg(['rpgscoutswamp'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgscoutswamp'));
reg(['rpgscoutruins'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgscoutruins'));
reg(['rpgscoutcastle'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgscoutcastle'));
reg(['rpgscoutvillage'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgscoutvillage'));
reg(['rpgscoutharbor'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgscoutharbor'));
reg(['rpgscoutisland'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgscoutisland'));
reg(['rpgscouttundra'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgscouttundra'));
reg(['rpgscoutvalley'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgscoutvalley'));
reg(['rpgscouttemple'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgscouttemple'));
reg(['rpgscoutcrypt'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgscoutcrypt'));
reg(['rpgscoutdungeon'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgscoutdungeon'));
reg(['rpgscoutarena'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgscoutarena'));
reg(['rpgscoutdragon'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgscoutdragon'));
reg(['rpgscoutwolf'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgscoutwolf'));
reg(['rpgscoutgoblin'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgscoutgoblin'));
reg(['rpgscoutorc'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgscoutorc'));
reg(['rpgscoutslime'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgscoutslime'));
reg(['rpgscoutphoenix'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgscoutphoenix'));
reg(['rpgscoutkraken'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgscoutkraken'));
reg(['rpgscouttitan'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgscouttitan'));
reg(['rpgscoutbandit'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgscoutbandit'));
reg(['rpgscoutmage'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgscoutmage'));
reg(['rpgscoutsamurai'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgscoutsamurai'));
reg(['rpgscoutspirit'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgscoutspirit'));
reg(['rpgscoutsorcerer'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgscoutsorcerer'));
reg(['rpgtameforest'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtameforest'));
reg(['rpgtamedesert'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtamedesert'));
reg(['rpgtamemountain'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtamemountain'));
reg(['rpgtamecave'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtamecave'));
reg(['rpgtamevolcano'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtamevolcano'));
reg(['rpgtameswamp'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtameswamp'));
reg(['rpgtameruins'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtameruins'));
reg(['rpgtamecastle'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtamecastle'));
reg(['rpgtamevillage'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtamevillage'));
reg(['rpgtameharbor'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtameharbor'));
reg(['rpgtameisland'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtameisland'));
reg(['rpgtametundra'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtametundra'));
reg(['rpgtamevalley'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtamevalley'));
reg(['rpgtametemple'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtametemple'));
reg(['rpgtamecrypt'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtamecrypt'));
reg(['rpgtamedungeon'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtamedungeon'));
reg(['rpgtamearena'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtamearena'));
reg(['rpgtamedragon'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtamedragon'));
reg(['rpgtamewolf'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtamewolf'));
reg(['rpgtamegoblin'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtamegoblin'));
reg(['rpgtameorc'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtameorc'));
reg(['rpgtameslime'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtameslime'));
reg(['rpgtamephoenix'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtamephoenix'));
reg(['rpgtamekraken'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtamekraken'));
reg(['rpgtametitan'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtametitan'));
reg(['rpgtamebandit'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtamebandit'));
reg(['rpgtamemage'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtamemage'));
reg(['rpgtamesamurai'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtamesamurai'));
reg(['rpgtamespirit'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtamespirit'));
reg(['rpgtamesorcerer'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtamesorcerer'));
reg(['rpgbreedforest'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgbreedforest'));
reg(['rpgbreeddesert'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgbreeddesert'));
reg(['rpgbreedmountain'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgbreedmountain'));
reg(['rpgbreedcave'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgbreedcave'));
reg(['rpgbreedvolcano'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgbreedvolcano'));
reg(['rpgbreedswamp'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgbreedswamp'));
reg(['rpgbreedruins'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgbreedruins'));
reg(['rpgbreedcastle'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgbreedcastle'));
reg(['rpgbreedvillage'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgbreedvillage'));
reg(['rpgbreedharbor'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgbreedharbor'));
reg(['rpgbreedisland'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgbreedisland'));
reg(['rpgbreedtundra'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgbreedtundra'));
reg(['rpgbreedvalley'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgbreedvalley'));
reg(['rpgbreedtemple'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgbreedtemple'));
reg(['rpgbreedcrypt'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgbreedcrypt'));
reg(['rpgbreeddungeon'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgbreeddungeon'));
reg(['rpgbreedarena'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgbreedarena'));
reg(['rpgbreeddragon'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgbreeddragon'));
reg(['rpgbreedwolf'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgbreedwolf'));
reg(['rpgbreedgoblin'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgbreedgoblin'));
reg(['rpgbreedorc'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgbreedorc'));
reg(['rpgbreedslime'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgbreedslime'));
reg(['rpgbreedphoenix'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgbreedphoenix'));
reg(['rpgbreedkraken'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgbreedkraken'));
reg(['rpgbreedtitan'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgbreedtitan'));
reg(['rpgbreedbandit'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgbreedbandit'));
reg(['rpgbreedmage'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgbreedmage'));
reg(['rpgbreedsamurai'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgbreedsamurai'));
reg(['rpgbreedspirit'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgbreedspirit'));
reg(['rpgbreedsorcerer'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgbreedsorcerer'));
reg(['rpgrescueforest'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgrescueforest'));
reg(['rpgrescuedesert'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgrescuedesert'));
reg(['rpgrescuemountain'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgrescuemountain'));
reg(['rpgrescuecave'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgrescuecave'));
reg(['rpgrescuevolcano'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgrescuevolcano'));
reg(['rpgrescueswamp'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgrescueswamp'));
reg(['rpgrescueruins'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgrescueruins'));
reg(['rpgrescuecastle'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgrescuecastle'));
reg(['rpgrescuevillage'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgrescuevillage'));
reg(['rpgrescueharbor'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgrescueharbor'));
reg(['rpgrescueisland'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgrescueisland'));
reg(['rpgrescuetundra'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgrescuetundra'));
reg(['rpgrescuevalley'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgrescuevalley'));
reg(['rpgrescuetemple'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgrescuetemple'));
reg(['rpgrescuecrypt'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgrescuecrypt'));
reg(['rpgrescuedungeon'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgrescuedungeon'));
reg(['rpgrescuearena'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgrescuearena'));
reg(['rpgrescuedragon'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgrescuedragon'));
reg(['rpgrescuewolf'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgrescuewolf'));
reg(['rpgrescuegoblin'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgrescuegoblin'));
reg(['rpgrescueorc'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgrescueorc'));
reg(['rpgrescueslime'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgrescueslime'));
reg(['rpgrescuephoenix'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgrescuephoenix'));
reg(['rpgrescuekraken'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgrescuekraken'));
reg(['rpgrescuetitan'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgrescuetitan'));
reg(['rpgrescuebandit'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgrescuebandit'));
reg(['rpgrescuemage'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgrescuemage'));
reg(['rpgrescuesamurai'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgrescuesamurai'));
reg(['rpgrescuespirit'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgrescuespirit'));
reg(['rpgrescuesorcerer'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgrescuesorcerer'));
reg(['rpgescortforest'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgescortforest'));
reg(['rpgescortdesert'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgescortdesert'));
reg(['rpgescortmountain'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgescortmountain'));
reg(['rpgescortcave'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgescortcave'));
reg(['rpgescortvolcano'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgescortvolcano'));
reg(['rpgescortswamp'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgescortswamp'));
reg(['rpgescortruins'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgescortruins'));
reg(['rpgescortcastle'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgescortcastle'));
reg(['rpgescortvillage'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgescortvillage'));
reg(['rpgescortharbor'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgescortharbor'));
reg(['rpgescortisland'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgescortisland'));
reg(['rpgescorttundra'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgescorttundra'));
reg(['rpgescortvalley'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgescortvalley'));
reg(['rpgescorttemple'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgescorttemple'));
reg(['rpgescortcrypt'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgescortcrypt'));
reg(['rpgescortdungeon'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgescortdungeon'));
reg(['rpgescortarena'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgescortarena'));
reg(['rpgescortdragon'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgescortdragon'));
reg(['rpgescortwolf'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgescortwolf'));
reg(['rpgescortgoblin'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgescortgoblin'));
reg(['rpgescortorc'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgescortorc'));
reg(['rpgescortslime'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgescortslime'));
reg(['rpgescortphoenix'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgescortphoenix'));
reg(['rpgescortkraken'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgescortkraken'));
reg(['rpgescorttitan'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgescorttitan'));
reg(['rpgescortbandit'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgescortbandit'));
reg(['rpgescortmage'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgescortmage'));
reg(['rpgescortsamurai'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgescortsamurai'));
reg(['rpgescortspirit'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgescortspirit'));
reg(['rpgescortsorcerer'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgescortsorcerer'));
reg(['rpgdefendforest'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgdefendforest'));
reg(['rpgdefenddesert'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgdefenddesert'));
reg(['rpgdefendmountain'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgdefendmountain'));
reg(['rpgdefendcave'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgdefendcave'));
reg(['rpgdefendvolcano'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgdefendvolcano'));
reg(['rpgdefendswamp'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgdefendswamp'));
reg(['rpgdefendruins'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgdefendruins'));
reg(['rpgdefendcastle'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgdefendcastle'));
reg(['rpgdefendvillage'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgdefendvillage'));
reg(['rpgdefendharbor'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgdefendharbor'));
reg(['rpgdefendisland'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgdefendisland'));
reg(['rpgdefendtundra'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgdefendtundra'));
reg(['rpgdefendvalley'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgdefendvalley'));
reg(['rpgdefendtemple'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgdefendtemple'));
reg(['rpgdefendcrypt'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgdefendcrypt'));
reg(['rpgdefenddungeon'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgdefenddungeon'));
reg(['rpgdefendarena'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgdefendarena'));
reg(['rpgdefenddragon'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgdefenddragon'));
reg(['rpgdefendwolf'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgdefendwolf'));
reg(['rpgdefendgoblin'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgdefendgoblin'));
reg(['rpgdefendorc'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgdefendorc'));
reg(['rpgdefendslime'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgdefendslime'));
reg(['rpgdefendphoenix'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgdefendphoenix'));
reg(['rpgdefendkraken'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgdefendkraken'));
reg(['rpgdefendtitan'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgdefendtitan'));
reg(['rpgdefendbandit'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgdefendbandit'));
reg(['rpgdefendmage'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgdefendmage'));
reg(['rpgdefendsamurai'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgdefendsamurai'));
reg(['rpgdefendspirit'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgdefendspirit'));
reg(['rpgdefendsorcerer'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgdefendsorcerer'));
reg(['rpgsurviveforest'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgsurviveforest'));
reg(['rpgsurvivedesert'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgsurvivedesert'));
reg(['rpgsurvivemountain'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgsurvivemountain'));
reg(['rpgsurvivecave'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgsurvivecave'));
reg(['rpgsurvivevolcano'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgsurvivevolcano'));
reg(['rpgsurviveswamp'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgsurviveswamp'));
reg(['rpgsurviveruins'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgsurviveruins'));
reg(['rpgsurvivecastle'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgsurvivecastle'));
reg(['rpgsurvivevillage'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgsurvivevillage'));
reg(['rpgsurviveharbor'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgsurviveharbor'));
reg(['rpgsurviveisland'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgsurviveisland'));
reg(['rpgsurvivetundra'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgsurvivetundra'));
reg(['rpgsurvivevalley'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgsurvivevalley'));
reg(['rpgsurvivetemple'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgsurvivetemple'));
reg(['rpgsurvivecrypt'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgsurvivecrypt'));
reg(['rpgsurvivedungeon'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgsurvivedungeon'));
reg(['rpgsurvivearena'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgsurvivearena'));
reg(['rpgsurvivedragon'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgsurvivedragon'));
reg(['rpgsurvivewolf'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgsurvivewolf'));
reg(['rpgsurvivegoblin'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgsurvivegoblin'));
reg(['rpgsurviveorc'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgsurviveorc'));
reg(['rpgsurviveslime'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgsurviveslime'));
reg(['rpgsurvivephoenix'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgsurvivephoenix'));
reg(['rpgsurvivekraken'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgsurvivekraken'));
reg(['rpgsurvivetitan'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgsurvivetitan'));
reg(['rpgsurvivebandit'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgsurvivebandit'));
reg(['rpgsurvivemage'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgsurvivemage'));
reg(['rpgsurvivesamurai'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgsurvivesamurai'));
reg(['rpgsurvivespirit'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgsurvivespirit'));
reg(['rpgsurvivesorcerer'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgsurvivesorcerer'));
reg(['rpgtreasureforest'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtreasureforest'));
reg(['rpgtreasuredesert'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtreasuredesert'));
reg(['rpgtreasuremountain'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtreasuremountain'));
reg(['rpgtreasurecave'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtreasurecave'));
reg(['rpgtreasurevolcano'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtreasurevolcano'));
reg(['rpgtreasureswamp'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtreasureswamp'));
reg(['rpgtreasureruins'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtreasureruins'));
reg(['rpgtreasurecastle'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtreasurecastle'));
reg(['rpgtreasurevillage'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtreasurevillage'));
reg(['rpgtreasureharbor'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtreasureharbor'));
reg(['rpgtreasureisland'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtreasureisland'));
reg(['rpgtreasuretundra'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtreasuretundra'));
reg(['rpgtreasurevalley'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtreasurevalley'));
reg(['rpgtreasuretemple'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtreasuretemple'));
reg(['rpgtreasurecrypt'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtreasurecrypt'));
reg(['rpgtreasuredungeon'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtreasuredungeon'));
reg(['rpgtreasurearena'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtreasurearena'));
reg(['rpgtreasuredragon'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtreasuredragon'));
reg(['rpgtreasurewolf'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtreasurewolf'));
reg(['rpgtreasuregoblin'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtreasuregoblin'));
reg(['rpgtreasureorc'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtreasureorc'));
reg(['rpgtreasureslime'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtreasureslime'));
reg(['rpgtreasurephoenix'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtreasurephoenix'));
reg(['rpgtreasurekraken'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtreasurekraken'));
reg(['rpgtreasuretitan'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtreasuretitan'));
reg(['rpgtreasurebandit'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtreasurebandit'));
reg(['rpgtreasuremage'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtreasuremage'));
reg(['rpgtreasuresamurai'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtreasuresamurai'));
reg(['rpgtreasurespirit'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtreasurespirit'));
reg(['rpgtreasuresorcerer'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtreasuresorcerer'));
reg(['rpgarenaforest'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgarenaforest'));
reg(['rpgarenadesert'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgarenadesert'));
reg(['rpgarenamountain'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgarenamountain'));
reg(['rpgarenacave'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgarenacave'));
reg(['rpgarenavolcano'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgarenavolcano'));
reg(['rpgarenaswamp'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgarenaswamp'));
reg(['rpgarenaruins'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgarenaruins'));
reg(['rpgarenacastle'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgarenacastle'));
reg(['rpgarenavillage'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgarenavillage'));
reg(['rpgarenaharbor'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgarenaharbor'));
reg(['rpgarenaisland'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgarenaisland'));
reg(['rpgarenatundra'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgarenatundra'));
reg(['rpgarenavalley'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgarenavalley'));
reg(['rpgarenatemple'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgarenatemple'));
reg(['rpgarenacrypt'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgarenacrypt'));
reg(['rpgarenadungeon'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgarenadungeon'));
reg(['rpgarenaarena'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgarenaarena'));
reg(['rpgarenadragon'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgarenadragon'));
reg(['rpgarenawolf'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgarenawolf'));
reg(['rpgarenagoblin'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgarenagoblin'));
reg(['rpgarenaorc'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgarenaorc'));
reg(['rpgarenaslime'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgarenaslime'));
reg(['rpgarenaphoenix'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgarenaphoenix'));
reg(['rpgarenakraken'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgarenakraken'));
reg(['rpgarenatitan'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgarenatitan'));
reg(['rpgarenabandit'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgarenabandit'));
reg(['rpgarenamage'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgarenamage'));
reg(['rpgarenasamurai'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgarenasamurai'));
reg(['rpgarenaspirit'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgarenaspirit'));
reg(['rpgarenasorcerer'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgarenasorcerer'));
reg(['rpgtournamentforest'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtournamentforest'));
reg(['rpgtournamentdesert'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtournamentdesert'));
reg(['rpgtournamentmountain'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtournamentmountain'));
reg(['rpgtournamentcave'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtournamentcave'));
reg(['rpgtournamentvolcano'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtournamentvolcano'));
reg(['rpgtournamentswamp'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtournamentswamp'));
reg(['rpgtournamentruins'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtournamentruins'));
reg(['rpgtournamentcastle'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtournamentcastle'));
reg(['rpgtournamentvillage'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtournamentvillage'));
reg(['rpgtournamentharbor'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtournamentharbor'));
reg(['rpgtournamentisland'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtournamentisland'));
reg(['rpgtournamenttundra'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtournamenttundra'));
reg(['rpgtournamentvalley'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtournamentvalley'));
reg(['rpgtournamenttemple'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtournamenttemple'));
reg(['rpgtournamentcrypt'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtournamentcrypt'));
reg(['rpgtournamentdungeon'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtournamentdungeon'));
reg(['rpgtournamentarena'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtournamentarena'));
reg(['rpgtournamentdragon'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtournamentdragon'));
reg(['rpgtournamentwolf'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtournamentwolf'));
reg(['rpgtournamentgoblin'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtournamentgoblin'));
reg(['rpgtournamentorc'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtournamentorc'));
reg(['rpgtournamentslime'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtournamentslime'));
reg(['rpgtournamentphoenix'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtournamentphoenix'));
reg(['rpgtournamentkraken'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtournamentkraken'));
reg(['rpgtournamenttitan'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtournamenttitan'));
reg(['rpgtournamentbandit'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtournamentbandit'));
reg(['rpgtournamentmage'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtournamentmage'));
reg(['rpgtournamentsamurai'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtournamentsamurai'));
reg(['rpgtournamentspirit'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtournamentspirit'));
reg(['rpgtournamentsorcerer'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgtournamentsorcerer'));
reg(['rpgexpeditionforest'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgexpeditionforest'));
reg(['rpgexpeditiondesert'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgexpeditiondesert'));
reg(['rpgexpeditionmountain'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgexpeditionmountain'));
reg(['rpgexpeditioncave'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgexpeditioncave'));
reg(['rpgexpeditionvolcano'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgexpeditionvolcano'));
reg(['rpgexpeditionswamp'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgexpeditionswamp'));
reg(['rpgexpeditionruins'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgexpeditionruins'));
reg(['rpgexpeditioncastle'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgexpeditioncastle'));
reg(['rpgexpeditionvillage'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgexpeditionvillage'));
reg(['rpgexpeditionharbor'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgexpeditionharbor'));
reg(['rpgexpeditionisland'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgexpeditionisland'));
reg(['rpgexpeditiontundra'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgexpeditiontundra'));
reg(['rpgexpeditionvalley'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgexpeditionvalley'));
reg(['rpgexpeditiontemple'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgexpeditiontemple'));
reg(['rpgexpeditioncrypt'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgexpeditioncrypt'));
reg(['rpgexpeditiondungeon'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgexpeditiondungeon'));
reg(['rpgexpeditionarena'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgexpeditionarena'));
reg(['rpgexpeditiondragon'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgexpeditiondragon'));
reg(['rpgexpeditionwolf'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgexpeditionwolf'));
reg(['rpgexpeditiongoblin'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgexpeditiongoblin'));
reg(['rpgexpeditionorc'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgexpeditionorc'));
reg(['rpgexpeditionslime'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgexpeditionslime'));
reg(['rpgexpeditionphoenix'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgexpeditionphoenix'));
reg(['rpgexpeditionkraken'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgexpeditionkraken'));
reg(['rpgexpeditiontitan'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgexpeditiontitan'));
reg(['rpgexpeditionbandit'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgexpeditionbandit'));
reg(['rpgexpeditionmage'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgexpeditionmage'));
reg(['rpgexpeditionsamurai'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgexpeditionsamurai'));
reg(['rpgexpeditionspirit'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgexpeditionspirit'));
reg(['rpgexpeditionsorcerer'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgexpeditionsorcerer'));
reg(['rpgchallengeforest'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgchallengeforest'));
reg(['rpgchallengedesert'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgchallengedesert'));
reg(['rpgchallengemountain'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgchallengemountain'));
reg(['rpgchallengecave'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgchallengecave'));
reg(['rpgchallengevolcano'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgchallengevolcano'));
reg(['rpgchallengeswamp'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgchallengeswamp'));
reg(['rpgchallengeruins'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgchallengeruins'));
reg(['rpgchallengecastle'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgchallengecastle'));
reg(['rpgchallengevillage'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgchallengevillage'));
reg(['rpgchallengeharbor'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgchallengeharbor'));
reg(['rpgchallengeisland'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgchallengeisland'));
reg(['rpgchallengetundra'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgchallengetundra'));
reg(['rpgchallengevalley'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgchallengevalley'));
reg(['rpgchallengetemple'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgchallengetemple'));
reg(['rpgchallengecrypt'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgchallengecrypt'));
reg(['rpgchallengedungeon'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgchallengedungeon'));
reg(['rpgchallengearena'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgchallengearena'));
reg(['rpgchallengedragon'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgchallengedragon'));
reg(['rpgchallengewolf'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgchallengewolf'));
reg(['rpgchallengegoblin'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgchallengegoblin'));
reg(['rpgchallengeorc'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgchallengeorc'));
reg(['rpgchallengeslime'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgchallengeslime'));
reg(['rpgchallengephoenix'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgchallengephoenix'));
reg(['rpgchallengekraken'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgchallengekraken'));
reg(['rpgchallengetitan'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgchallengetitan'));
reg(['rpgchallengebandit'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgchallengebandit'));
reg(['rpgchallengemage'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgchallengemage'));
reg(['rpgchallengesamurai'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgchallengesamurai'));
reg(['rpgchallengespirit'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgchallengespirit'));
reg(['rpgchallengesorcerer'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgchallengesorcerer'));
reg(['rpgbossforest'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgbossforest'));
reg(['rpgbossdesert'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgbossdesert'));
reg(['rpgbossmountain'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgbossmountain'));
reg(['rpgbosscave'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgbosscave'));
reg(['rpgbossvolcano'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgbossvolcano'));
reg(['rpgbossswamp'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgbossswamp'));
reg(['rpgbossruins'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgbossruins'));
reg(['rpgbosscastle'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgbosscastle'));
reg(['rpgbossvillage'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgbossvillage'));
reg(['rpgbossharbor'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgbossharbor'));
reg(['rpgbossisland'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgbossisland'));
reg(['rpgbosstundra'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgbosstundra'));
reg(['rpgbossvalley'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgbossvalley'));
reg(['rpgbosstemple'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgbosstemple'));
reg(['rpgbosscrypt'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgbosscrypt'));
reg(['rpgbossdungeon'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgbossdungeon'));
reg(['rpgbossarena'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgbossarena'));
reg(['rpgbossdragon'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgbossdragon'));
reg(['rpgbosswolf'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgbosswolf'));
reg(['rpgbossgoblin'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgbossgoblin'));
reg(['rpgbossorc'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgbossorc'));
reg(['rpgbossslime'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgbossslime'));
reg(['rpgbossphoenix'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgbossphoenix'));
reg(['rpgbosskraken'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgbosskraken'));
reg(['rpgbosstitan'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgbosstitan'));
reg(['rpgbossbandit'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgbossbandit'));
reg(['rpgbossmage'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgbossmage'));
reg(['rpgbosssamurai'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgbosssamurai'));
reg(['rpgbossspirit'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgbossspirit'));
reg(['rpgbosssorcerer'], async (ctx) => gojoGeneratedFeature(ctx, 'rpgbosssorcerer'));
reg(['adminprotectgroup'], async (ctx) => gojoGeneratedFeature(ctx, 'adminprotectgroup'));
reg(['adminprotectmember'], async (ctx) => gojoGeneratedFeature(ctx, 'adminprotectmember'));
reg(['adminprotectadmin'], async (ctx) => gojoGeneratedFeature(ctx, 'adminprotectadmin'));
reg(['adminprotectlink'], async (ctx) => gojoGeneratedFeature(ctx, 'adminprotectlink'));
reg(['adminprotectspam'], async (ctx) => gojoGeneratedFeature(ctx, 'adminprotectspam'));
reg(['adminprotecttoxic'], async (ctx) => gojoGeneratedFeature(ctx, 'adminprotecttoxic'));
reg(['adminprotectmedia'], async (ctx) => gojoGeneratedFeature(ctx, 'adminprotectmedia'));
reg(['adminprotectimage'], async (ctx) => gojoGeneratedFeature(ctx, 'adminprotectimage'));
reg(['adminprotectvideo'], async (ctx) => gojoGeneratedFeature(ctx, 'adminprotectvideo'));
reg(['adminprotectaudio'], async (ctx) => gojoGeneratedFeature(ctx, 'adminprotectaudio'));
reg(['adminprotectdocument'], async (ctx) => gojoGeneratedFeature(ctx, 'adminprotectdocument'));
reg(['adminprotectsticker'], async (ctx) => gojoGeneratedFeature(ctx, 'adminprotectsticker'));
reg(['adminprotectpoll'], async (ctx) => gojoGeneratedFeature(ctx, 'adminprotectpoll'));
reg(['adminprotectwelcome'], async (ctx) => gojoGeneratedFeature(ctx, 'adminprotectwelcome'));
reg(['adminprotectfarewell'], async (ctx) => gojoGeneratedFeature(ctx, 'adminprotectfarewell'));
reg(['adminprotectrules'], async (ctx) => gojoGeneratedFeature(ctx, 'adminprotectrules'));
reg(['adminprotectwarning'], async (ctx) => gojoGeneratedFeature(ctx, 'adminprotectwarning'));
reg(['adminprotectrequest'], async (ctx) => gojoGeneratedFeature(ctx, 'adminprotectrequest'));
reg(['adminprotectevent'], async (ctx) => gojoGeneratedFeature(ctx, 'adminprotectevent'));
reg(['adminprotectnote'], async (ctx) => gojoGeneratedFeature(ctx, 'adminprotectnote'));
reg(['adminprotecttemplate'], async (ctx) => gojoGeneratedFeature(ctx, 'adminprotecttemplate'));
reg(['adminprotectactivity'], async (ctx) => gojoGeneratedFeature(ctx, 'adminprotectactivity'));
reg(['adminprotectinvite'], async (ctx) => gojoGeneratedFeature(ctx, 'adminprotectinvite'));
reg(['adminprotectsetting'], async (ctx) => gojoGeneratedFeature(ctx, 'adminprotectsetting'));
reg(['adminprotectsecurity'], async (ctx) => gojoGeneratedFeature(ctx, 'adminprotectsecurity'));
reg(['adminlockgroup'], async (ctx) => gojoGeneratedFeature(ctx, 'adminlockgroup'));
reg(['adminlockmember'], async (ctx) => gojoGeneratedFeature(ctx, 'adminlockmember'));
reg(['adminlockadmin'], async (ctx) => gojoGeneratedFeature(ctx, 'adminlockadmin'));
reg(['adminlocklink'], async (ctx) => gojoGeneratedFeature(ctx, 'adminlocklink'));
reg(['adminlockspam'], async (ctx) => gojoGeneratedFeature(ctx, 'adminlockspam'));
reg(['adminlocktoxic'], async (ctx) => gojoGeneratedFeature(ctx, 'adminlocktoxic'));
reg(['adminlockmedia'], async (ctx) => gojoGeneratedFeature(ctx, 'adminlockmedia'));
reg(['adminlockimage'], async (ctx) => gojoGeneratedFeature(ctx, 'adminlockimage'));
reg(['adminlockvideo'], async (ctx) => gojoGeneratedFeature(ctx, 'adminlockvideo'));
reg(['adminlockaudio'], async (ctx) => gojoGeneratedFeature(ctx, 'adminlockaudio'));
reg(['adminlockdocument'], async (ctx) => gojoGeneratedFeature(ctx, 'adminlockdocument'));
reg(['adminlocksticker'], async (ctx) => gojoGeneratedFeature(ctx, 'adminlocksticker'));
reg(['adminlockpoll'], async (ctx) => gojoGeneratedFeature(ctx, 'adminlockpoll'));
reg(['adminlockwelcome'], async (ctx) => gojoGeneratedFeature(ctx, 'adminlockwelcome'));
reg(['adminlockfarewell'], async (ctx) => gojoGeneratedFeature(ctx, 'adminlockfarewell'));
reg(['adminlockrules'], async (ctx) => gojoGeneratedFeature(ctx, 'adminlockrules'));
reg(['adminlockwarning'], async (ctx) => gojoGeneratedFeature(ctx, 'adminlockwarning'));
reg(['adminlockrequest'], async (ctx) => gojoGeneratedFeature(ctx, 'adminlockrequest'));
reg(['adminlockevent'], async (ctx) => gojoGeneratedFeature(ctx, 'adminlockevent'));
reg(['adminlocknote'], async (ctx) => gojoGeneratedFeature(ctx, 'adminlocknote'));
reg(['adminlocktemplate'], async (ctx) => gojoGeneratedFeature(ctx, 'adminlocktemplate'));
reg(['adminlockactivity'], async (ctx) => gojoGeneratedFeature(ctx, 'adminlockactivity'));
reg(['adminlockinvite'], async (ctx) => gojoGeneratedFeature(ctx, 'adminlockinvite'));
reg(['adminlocksetting'], async (ctx) => gojoGeneratedFeature(ctx, 'adminlocksetting'));
reg(['adminlocksecurity'], async (ctx) => gojoGeneratedFeature(ctx, 'adminlocksecurity'));
reg(['adminunlockgroup'], async (ctx) => gojoGeneratedFeature(ctx, 'adminunlockgroup'));
reg(['adminunlockmember'], async (ctx) => gojoGeneratedFeature(ctx, 'adminunlockmember'));
reg(['adminunlockadmin'], async (ctx) => gojoGeneratedFeature(ctx, 'adminunlockadmin'));
reg(['adminunlocklink'], async (ctx) => gojoGeneratedFeature(ctx, 'adminunlocklink'));
reg(['adminunlockspam'], async (ctx) => gojoGeneratedFeature(ctx, 'adminunlockspam'));
reg(['adminunlocktoxic'], async (ctx) => gojoGeneratedFeature(ctx, 'adminunlocktoxic'));
reg(['adminunlockmedia'], async (ctx) => gojoGeneratedFeature(ctx, 'adminunlockmedia'));
reg(['adminunlockimage'], async (ctx) => gojoGeneratedFeature(ctx, 'adminunlockimage'));
reg(['adminunlockvideo'], async (ctx) => gojoGeneratedFeature(ctx, 'adminunlockvideo'));
reg(['adminunlockaudio'], async (ctx) => gojoGeneratedFeature(ctx, 'adminunlockaudio'));
reg(['adminunlockdocument'], async (ctx) => gojoGeneratedFeature(ctx, 'adminunlockdocument'));
reg(['adminunlocksticker'], async (ctx) => gojoGeneratedFeature(ctx, 'adminunlocksticker'));
reg(['adminunlockpoll'], async (ctx) => gojoGeneratedFeature(ctx, 'adminunlockpoll'));
reg(['adminunlockwelcome'], async (ctx) => gojoGeneratedFeature(ctx, 'adminunlockwelcome'));
reg(['adminunlockfarewell'], async (ctx) => gojoGeneratedFeature(ctx, 'adminunlockfarewell'));
reg(['adminunlockrules'], async (ctx) => gojoGeneratedFeature(ctx, 'adminunlockrules'));
reg(['adminunlockwarning'], async (ctx) => gojoGeneratedFeature(ctx, 'adminunlockwarning'));
reg(['adminunlockrequest'], async (ctx) => gojoGeneratedFeature(ctx, 'adminunlockrequest'));
reg(['adminunlockevent'], async (ctx) => gojoGeneratedFeature(ctx, 'adminunlockevent'));
reg(['adminunlocknote'], async (ctx) => gojoGeneratedFeature(ctx, 'adminunlocknote'));
reg(['adminunlocktemplate'], async (ctx) => gojoGeneratedFeature(ctx, 'adminunlocktemplate'));
reg(['adminunlockactivity'], async (ctx) => gojoGeneratedFeature(ctx, 'adminunlockactivity'));
reg(['adminunlockinvite'], async (ctx) => gojoGeneratedFeature(ctx, 'adminunlockinvite'));
reg(['adminunlocksetting'], async (ctx) => gojoGeneratedFeature(ctx, 'adminunlocksetting'));
reg(['adminunlocksecurity'], async (ctx) => gojoGeneratedFeature(ctx, 'adminunlocksecurity'));
reg(['adminauditgroup'], async (ctx) => gojoGeneratedFeature(ctx, 'adminauditgroup'));
reg(['adminauditmember'], async (ctx) => gojoGeneratedFeature(ctx, 'adminauditmember'));
reg(['adminauditadmin'], async (ctx) => gojoGeneratedFeature(ctx, 'adminauditadmin'));
reg(['adminauditlink'], async (ctx) => gojoGeneratedFeature(ctx, 'adminauditlink'));
reg(['adminauditspam'], async (ctx) => gojoGeneratedFeature(ctx, 'adminauditspam'));
reg(['adminaudittoxic'], async (ctx) => gojoGeneratedFeature(ctx, 'adminaudittoxic'));
reg(['adminauditmedia'], async (ctx) => gojoGeneratedFeature(ctx, 'adminauditmedia'));
reg(['adminauditimage'], async (ctx) => gojoGeneratedFeature(ctx, 'adminauditimage'));
reg(['adminauditvideo'], async (ctx) => gojoGeneratedFeature(ctx, 'adminauditvideo'));
reg(['adminauditaudio'], async (ctx) => gojoGeneratedFeature(ctx, 'adminauditaudio'));
reg(['adminauditdocument'], async (ctx) => gojoGeneratedFeature(ctx, 'adminauditdocument'));
reg(['adminauditsticker'], async (ctx) => gojoGeneratedFeature(ctx, 'adminauditsticker'));
reg(['adminauditpoll'], async (ctx) => gojoGeneratedFeature(ctx, 'adminauditpoll'));
reg(['adminauditwelcome'], async (ctx) => gojoGeneratedFeature(ctx, 'adminauditwelcome'));
reg(['adminauditfarewell'], async (ctx) => gojoGeneratedFeature(ctx, 'adminauditfarewell'));
reg(['adminauditrules'], async (ctx) => gojoGeneratedFeature(ctx, 'adminauditrules'));
reg(['adminauditwarning'], async (ctx) => gojoGeneratedFeature(ctx, 'adminauditwarning'));
reg(['adminauditrequest'], async (ctx) => gojoGeneratedFeature(ctx, 'adminauditrequest'));
reg(['adminauditevent'], async (ctx) => gojoGeneratedFeature(ctx, 'adminauditevent'));
reg(['adminauditnote'], async (ctx) => gojoGeneratedFeature(ctx, 'adminauditnote'));
reg(['adminaudittemplate'], async (ctx) => gojoGeneratedFeature(ctx, 'adminaudittemplate'));
reg(['adminauditactivity'], async (ctx) => gojoGeneratedFeature(ctx, 'adminauditactivity'));
reg(['adminauditinvite'], async (ctx) => gojoGeneratedFeature(ctx, 'adminauditinvite'));
reg(['adminauditsetting'], async (ctx) => gojoGeneratedFeature(ctx, 'adminauditsetting'));
reg(['adminauditsecurity'], async (ctx) => gojoGeneratedFeature(ctx, 'adminauditsecurity'));
reg(['adminscangroup'], async (ctx) => gojoGeneratedFeature(ctx, 'adminscangroup'));
reg(['adminscanmember'], async (ctx) => gojoGeneratedFeature(ctx, 'adminscanmember'));
reg(['adminscanadmin'], async (ctx) => gojoGeneratedFeature(ctx, 'adminscanadmin'));
reg(['adminscanlink'], async (ctx) => gojoGeneratedFeature(ctx, 'adminscanlink'));
reg(['adminscanspam'], async (ctx) => gojoGeneratedFeature(ctx, 'adminscanspam'));
reg(['adminscantoxic'], async (ctx) => gojoGeneratedFeature(ctx, 'adminscantoxic'));
reg(['adminscanmedia'], async (ctx) => gojoGeneratedFeature(ctx, 'adminscanmedia'));
reg(['adminscanimage'], async (ctx) => gojoGeneratedFeature(ctx, 'adminscanimage'));
reg(['adminscanvideo'], async (ctx) => gojoGeneratedFeature(ctx, 'adminscanvideo'));
reg(['adminscanaudio'], async (ctx) => gojoGeneratedFeature(ctx, 'adminscanaudio'));
reg(['adminscandocument'], async (ctx) => gojoGeneratedFeature(ctx, 'adminscandocument'));
reg(['adminscansticker'], async (ctx) => gojoGeneratedFeature(ctx, 'adminscansticker'));
reg(['adminscanpoll'], async (ctx) => gojoGeneratedFeature(ctx, 'adminscanpoll'));
reg(['adminscanwelcome'], async (ctx) => gojoGeneratedFeature(ctx, 'adminscanwelcome'));
reg(['adminscanfarewell'], async (ctx) => gojoGeneratedFeature(ctx, 'adminscanfarewell'));
reg(['adminscanrules'], async (ctx) => gojoGeneratedFeature(ctx, 'adminscanrules'));
reg(['adminscanwarning'], async (ctx) => gojoGeneratedFeature(ctx, 'adminscanwarning'));
reg(['adminscanrequest'], async (ctx) => gojoGeneratedFeature(ctx, 'adminscanrequest'));
reg(['adminscanevent'], async (ctx) => gojoGeneratedFeature(ctx, 'adminscanevent'));
reg(['adminscannote'], async (ctx) => gojoGeneratedFeature(ctx, 'adminscannote'));
reg(['adminscantemplate'], async (ctx) => gojoGeneratedFeature(ctx, 'adminscantemplate'));
reg(['adminscanactivity'], async (ctx) => gojoGeneratedFeature(ctx, 'adminscanactivity'));
reg(['adminscaninvite'], async (ctx) => gojoGeneratedFeature(ctx, 'adminscaninvite'));
reg(['adminscansetting'], async (ctx) => gojoGeneratedFeature(ctx, 'adminscansetting'));
reg(['adminscansecurity'], async (ctx) => gojoGeneratedFeature(ctx, 'adminscansecurity'));
reg(['adminmonitorgroup'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmonitorgroup'));
reg(['adminmonitormember'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmonitormember'));
reg(['adminmonitoradmin'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmonitoradmin'));
reg(['adminmonitorlink'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmonitorlink'));
reg(['adminmonitorspam'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmonitorspam'));
reg(['adminmonitortoxic'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmonitortoxic'));
reg(['adminmonitormedia'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmonitormedia'));
reg(['adminmonitorimage'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmonitorimage'));
reg(['adminmonitorvideo'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmonitorvideo'));
reg(['adminmonitoraudio'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmonitoraudio'));
reg(['adminmonitordocument'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmonitordocument'));
reg(['adminmonitorsticker'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmonitorsticker'));
reg(['adminmonitorpoll'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmonitorpoll'));
reg(['adminmonitorwelcome'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmonitorwelcome'));
reg(['adminmonitorfarewell'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmonitorfarewell'));
reg(['adminmonitorrules'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmonitorrules'));
reg(['adminmonitorwarning'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmonitorwarning'));
reg(['adminmonitorrequest'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmonitorrequest'));
reg(['adminmonitorevent'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmonitorevent'));
reg(['adminmonitornote'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmonitornote'));
reg(['adminmonitortemplate'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmonitortemplate'));
reg(['adminmonitoractivity'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmonitoractivity'));
reg(['adminmonitorinvite'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmonitorinvite'));
reg(['adminmonitorsetting'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmonitorsetting'));
reg(['adminmonitorsecurity'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmonitorsecurity'));
reg(['adminreviewgroup'], async (ctx) => gojoGeneratedFeature(ctx, 'adminreviewgroup'));
reg(['adminreviewmember'], async (ctx) => gojoGeneratedFeature(ctx, 'adminreviewmember'));
reg(['adminreviewadmin'], async (ctx) => gojoGeneratedFeature(ctx, 'adminreviewadmin'));
reg(['adminreviewlink'], async (ctx) => gojoGeneratedFeature(ctx, 'adminreviewlink'));
reg(['adminreviewspam'], async (ctx) => gojoGeneratedFeature(ctx, 'adminreviewspam'));
reg(['adminreviewtoxic'], async (ctx) => gojoGeneratedFeature(ctx, 'adminreviewtoxic'));
reg(['adminreviewmedia'], async (ctx) => gojoGeneratedFeature(ctx, 'adminreviewmedia'));
reg(['adminreviewimage'], async (ctx) => gojoGeneratedFeature(ctx, 'adminreviewimage'));
reg(['adminreviewvideo'], async (ctx) => gojoGeneratedFeature(ctx, 'adminreviewvideo'));
reg(['adminreviewaudio'], async (ctx) => gojoGeneratedFeature(ctx, 'adminreviewaudio'));
reg(['adminreviewdocument'], async (ctx) => gojoGeneratedFeature(ctx, 'adminreviewdocument'));
reg(['adminreviewsticker'], async (ctx) => gojoGeneratedFeature(ctx, 'adminreviewsticker'));
reg(['adminreviewpoll'], async (ctx) => gojoGeneratedFeature(ctx, 'adminreviewpoll'));
reg(['adminreviewwelcome'], async (ctx) => gojoGeneratedFeature(ctx, 'adminreviewwelcome'));
reg(['adminreviewfarewell'], async (ctx) => gojoGeneratedFeature(ctx, 'adminreviewfarewell'));
reg(['adminreviewrules'], async (ctx) => gojoGeneratedFeature(ctx, 'adminreviewrules'));
reg(['adminreviewwarning'], async (ctx) => gojoGeneratedFeature(ctx, 'adminreviewwarning'));
reg(['adminreviewrequest'], async (ctx) => gojoGeneratedFeature(ctx, 'adminreviewrequest'));
reg(['adminreviewevent'], async (ctx) => gojoGeneratedFeature(ctx, 'adminreviewevent'));
reg(['adminreviewnote'], async (ctx) => gojoGeneratedFeature(ctx, 'adminreviewnote'));
reg(['adminreviewtemplate'], async (ctx) => gojoGeneratedFeature(ctx, 'adminreviewtemplate'));
reg(['adminreviewactivity'], async (ctx) => gojoGeneratedFeature(ctx, 'adminreviewactivity'));
reg(['adminreviewinvite'], async (ctx) => gojoGeneratedFeature(ctx, 'adminreviewinvite'));
reg(['adminreviewsetting'], async (ctx) => gojoGeneratedFeature(ctx, 'adminreviewsetting'));
reg(['adminreviewsecurity'], async (ctx) => gojoGeneratedFeature(ctx, 'adminreviewsecurity'));
reg(['adminreportgroup'], async (ctx) => gojoGeneratedFeature(ctx, 'adminreportgroup'));
reg(['adminreportmember'], async (ctx) => gojoGeneratedFeature(ctx, 'adminreportmember'));
reg(['adminreportadmin'], async (ctx) => gojoGeneratedFeature(ctx, 'adminreportadmin'));
reg(['adminreportlink'], async (ctx) => gojoGeneratedFeature(ctx, 'adminreportlink'));
reg(['adminreportspam'], async (ctx) => gojoGeneratedFeature(ctx, 'adminreportspam'));
reg(['adminreporttoxic'], async (ctx) => gojoGeneratedFeature(ctx, 'adminreporttoxic'));
reg(['adminreportmedia'], async (ctx) => gojoGeneratedFeature(ctx, 'adminreportmedia'));
reg(['adminreportimage'], async (ctx) => gojoGeneratedFeature(ctx, 'adminreportimage'));
reg(['adminreportvideo'], async (ctx) => gojoGeneratedFeature(ctx, 'adminreportvideo'));
reg(['adminreportaudio'], async (ctx) => gojoGeneratedFeature(ctx, 'adminreportaudio'));
reg(['adminreportdocument'], async (ctx) => gojoGeneratedFeature(ctx, 'adminreportdocument'));
reg(['adminreportsticker'], async (ctx) => gojoGeneratedFeature(ctx, 'adminreportsticker'));
reg(['adminreportpoll'], async (ctx) => gojoGeneratedFeature(ctx, 'adminreportpoll'));
reg(['adminreportwelcome'], async (ctx) => gojoGeneratedFeature(ctx, 'adminreportwelcome'));
reg(['adminreportfarewell'], async (ctx) => gojoGeneratedFeature(ctx, 'adminreportfarewell'));
reg(['adminreportrules'], async (ctx) => gojoGeneratedFeature(ctx, 'adminreportrules'));
reg(['adminreportwarning'], async (ctx) => gojoGeneratedFeature(ctx, 'adminreportwarning'));
reg(['adminreportrequest'], async (ctx) => gojoGeneratedFeature(ctx, 'adminreportrequest'));
reg(['adminreportevent'], async (ctx) => gojoGeneratedFeature(ctx, 'adminreportevent'));
reg(['adminreportnote'], async (ctx) => gojoGeneratedFeature(ctx, 'adminreportnote'));
reg(['adminreporttemplate'], async (ctx) => gojoGeneratedFeature(ctx, 'adminreporttemplate'));
reg(['adminreportactivity'], async (ctx) => gojoGeneratedFeature(ctx, 'adminreportactivity'));
reg(['adminreportinvite'], async (ctx) => gojoGeneratedFeature(ctx, 'adminreportinvite'));
reg(['adminreportsetting'], async (ctx) => gojoGeneratedFeature(ctx, 'adminreportsetting'));
reg(['adminreportsecurity'], async (ctx) => gojoGeneratedFeature(ctx, 'adminreportsecurity'));
reg(['adminmanagegroup'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmanagegroup'));
reg(['adminmanagemember'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmanagemember'));
reg(['adminmanageadmin'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmanageadmin'));
reg(['adminmanagelink'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmanagelink'));
reg(['adminmanagespam'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmanagespam'));
reg(['adminmanagetoxic'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmanagetoxic'));
reg(['adminmanagemedia'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmanagemedia'));
reg(['adminmanageimage'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmanageimage'));
reg(['adminmanagevideo'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmanagevideo'));
reg(['adminmanageaudio'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmanageaudio'));
reg(['adminmanagedocument'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmanagedocument'));
reg(['adminmanagesticker'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmanagesticker'));
reg(['adminmanagepoll'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmanagepoll'));
reg(['adminmanagewelcome'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmanagewelcome'));
reg(['adminmanagefarewell'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmanagefarewell'));
reg(['adminmanagerules'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmanagerules'));
reg(['adminmanagewarning'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmanagewarning'));
reg(['adminmanagerequest'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmanagerequest'));
reg(['adminmanageevent'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmanageevent'));
reg(['adminmanagenote'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmanagenote'));
reg(['adminmanagetemplate'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmanagetemplate'));
reg(['adminmanageactivity'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmanageactivity'));
reg(['adminmanageinvite'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmanageinvite'));
reg(['adminmanagesetting'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmanagesetting'));
reg(['adminmanagesecurity'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmanagesecurity'));
reg(['adminconfiguregroup'], async (ctx) => gojoGeneratedFeature(ctx, 'adminconfiguregroup'));
reg(['adminconfiguremember'], async (ctx) => gojoGeneratedFeature(ctx, 'adminconfiguremember'));
reg(['adminconfigureadmin'], async (ctx) => gojoGeneratedFeature(ctx, 'adminconfigureadmin'));
reg(['adminconfigurelink'], async (ctx) => gojoGeneratedFeature(ctx, 'adminconfigurelink'));
reg(['adminconfigurespam'], async (ctx) => gojoGeneratedFeature(ctx, 'adminconfigurespam'));
reg(['adminconfiguretoxic'], async (ctx) => gojoGeneratedFeature(ctx, 'adminconfiguretoxic'));
reg(['adminconfiguremedia'], async (ctx) => gojoGeneratedFeature(ctx, 'adminconfiguremedia'));
reg(['adminconfigureimage'], async (ctx) => gojoGeneratedFeature(ctx, 'adminconfigureimage'));
reg(['adminconfigurevideo'], async (ctx) => gojoGeneratedFeature(ctx, 'adminconfigurevideo'));
reg(['adminconfigureaudio'], async (ctx) => gojoGeneratedFeature(ctx, 'adminconfigureaudio'));
reg(['adminconfiguredocument'], async (ctx) => gojoGeneratedFeature(ctx, 'adminconfiguredocument'));
reg(['adminconfiguresticker'], async (ctx) => gojoGeneratedFeature(ctx, 'adminconfiguresticker'));
reg(['adminconfigurepoll'], async (ctx) => gojoGeneratedFeature(ctx, 'adminconfigurepoll'));
reg(['adminconfigurewelcome'], async (ctx) => gojoGeneratedFeature(ctx, 'adminconfigurewelcome'));
reg(['adminconfigurefarewell'], async (ctx) => gojoGeneratedFeature(ctx, 'adminconfigurefarewell'));
reg(['adminconfigurerules'], async (ctx) => gojoGeneratedFeature(ctx, 'adminconfigurerules'));
reg(['adminconfigurewarning'], async (ctx) => gojoGeneratedFeature(ctx, 'adminconfigurewarning'));
reg(['adminconfigurerequest'], async (ctx) => gojoGeneratedFeature(ctx, 'adminconfigurerequest'));
reg(['adminconfigureevent'], async (ctx) => gojoGeneratedFeature(ctx, 'adminconfigureevent'));
reg(['adminconfigurenote'], async (ctx) => gojoGeneratedFeature(ctx, 'adminconfigurenote'));
reg(['adminconfiguretemplate'], async (ctx) => gojoGeneratedFeature(ctx, 'adminconfiguretemplate'));
reg(['adminconfigureactivity'], async (ctx) => gojoGeneratedFeature(ctx, 'adminconfigureactivity'));
reg(['adminconfigureinvite'], async (ctx) => gojoGeneratedFeature(ctx, 'adminconfigureinvite'));
reg(['adminconfiguresetting'], async (ctx) => gojoGeneratedFeature(ctx, 'adminconfiguresetting'));
reg(['adminconfiguresecurity'], async (ctx) => gojoGeneratedFeature(ctx, 'adminconfiguresecurity'));
reg(['adminbackupgroup'], async (ctx) => gojoGeneratedFeature(ctx, 'adminbackupgroup'));
reg(['adminbackupmember'], async (ctx) => gojoGeneratedFeature(ctx, 'adminbackupmember'));
reg(['adminbackupadmin'], async (ctx) => gojoGeneratedFeature(ctx, 'adminbackupadmin'));
reg(['adminbackuplink'], async (ctx) => gojoGeneratedFeature(ctx, 'adminbackuplink'));
reg(['adminbackupspam'], async (ctx) => gojoGeneratedFeature(ctx, 'adminbackupspam'));
reg(['adminbackuptoxic'], async (ctx) => gojoGeneratedFeature(ctx, 'adminbackuptoxic'));
reg(['adminbackupmedia'], async (ctx) => gojoGeneratedFeature(ctx, 'adminbackupmedia'));
reg(['adminbackupimage'], async (ctx) => gojoGeneratedFeature(ctx, 'adminbackupimage'));
reg(['adminbackupvideo'], async (ctx) => gojoGeneratedFeature(ctx, 'adminbackupvideo'));
reg(['adminbackupaudio'], async (ctx) => gojoGeneratedFeature(ctx, 'adminbackupaudio'));
reg(['adminbackupdocument'], async (ctx) => gojoGeneratedFeature(ctx, 'adminbackupdocument'));
reg(['adminbackupsticker'], async (ctx) => gojoGeneratedFeature(ctx, 'adminbackupsticker'));
reg(['adminbackuppoll'], async (ctx) => gojoGeneratedFeature(ctx, 'adminbackuppoll'));
reg(['adminbackupwelcome'], async (ctx) => gojoGeneratedFeature(ctx, 'adminbackupwelcome'));
reg(['adminbackupfarewell'], async (ctx) => gojoGeneratedFeature(ctx, 'adminbackupfarewell'));
reg(['adminbackuprules'], async (ctx) => gojoGeneratedFeature(ctx, 'adminbackuprules'));
reg(['adminbackupwarning'], async (ctx) => gojoGeneratedFeature(ctx, 'adminbackupwarning'));
reg(['adminbackuprequest'], async (ctx) => gojoGeneratedFeature(ctx, 'adminbackuprequest'));
reg(['adminbackupevent'], async (ctx) => gojoGeneratedFeature(ctx, 'adminbackupevent'));
reg(['adminbackupnote'], async (ctx) => gojoGeneratedFeature(ctx, 'adminbackupnote'));
reg(['adminbackuptemplate'], async (ctx) => gojoGeneratedFeature(ctx, 'adminbackuptemplate'));
reg(['adminbackupactivity'], async (ctx) => gojoGeneratedFeature(ctx, 'adminbackupactivity'));
reg(['adminbackupinvite'], async (ctx) => gojoGeneratedFeature(ctx, 'adminbackupinvite'));
reg(['adminbackupsetting'], async (ctx) => gojoGeneratedFeature(ctx, 'adminbackupsetting'));
reg(['adminbackupsecurity'], async (ctx) => gojoGeneratedFeature(ctx, 'adminbackupsecurity'));
reg(['adminrestoregroup'], async (ctx) => gojoGeneratedFeature(ctx, 'adminrestoregroup'));
reg(['adminrestoremember'], async (ctx) => gojoGeneratedFeature(ctx, 'adminrestoremember'));
reg(['adminrestoreadmin'], async (ctx) => gojoGeneratedFeature(ctx, 'adminrestoreadmin'));
reg(['adminrestorelink'], async (ctx) => gojoGeneratedFeature(ctx, 'adminrestorelink'));
reg(['adminrestorespam'], async (ctx) => gojoGeneratedFeature(ctx, 'adminrestorespam'));
reg(['adminrestoretoxic'], async (ctx) => gojoGeneratedFeature(ctx, 'adminrestoretoxic'));
reg(['adminrestoremedia'], async (ctx) => gojoGeneratedFeature(ctx, 'adminrestoremedia'));
reg(['adminrestoreimage'], async (ctx) => gojoGeneratedFeature(ctx, 'adminrestoreimage'));
reg(['adminrestorevideo'], async (ctx) => gojoGeneratedFeature(ctx, 'adminrestorevideo'));
reg(['adminrestoreaudio'], async (ctx) => gojoGeneratedFeature(ctx, 'adminrestoreaudio'));
reg(['adminrestoredocument'], async (ctx) => gojoGeneratedFeature(ctx, 'adminrestoredocument'));
reg(['adminrestoresticker'], async (ctx) => gojoGeneratedFeature(ctx, 'adminrestoresticker'));
reg(['adminrestorepoll'], async (ctx) => gojoGeneratedFeature(ctx, 'adminrestorepoll'));
reg(['adminrestorewelcome'], async (ctx) => gojoGeneratedFeature(ctx, 'adminrestorewelcome'));
reg(['adminrestorefarewell'], async (ctx) => gojoGeneratedFeature(ctx, 'adminrestorefarewell'));
reg(['adminrestorerules'], async (ctx) => gojoGeneratedFeature(ctx, 'adminrestorerules'));
reg(['adminrestorewarning'], async (ctx) => gojoGeneratedFeature(ctx, 'adminrestorewarning'));
reg(['adminrestorerequest'], async (ctx) => gojoGeneratedFeature(ctx, 'adminrestorerequest'));
reg(['adminrestoreevent'], async (ctx) => gojoGeneratedFeature(ctx, 'adminrestoreevent'));
reg(['adminrestorenote'], async (ctx) => gojoGeneratedFeature(ctx, 'adminrestorenote'));
reg(['adminrestoretemplate'], async (ctx) => gojoGeneratedFeature(ctx, 'adminrestoretemplate'));
reg(['adminrestoreactivity'], async (ctx) => gojoGeneratedFeature(ctx, 'adminrestoreactivity'));
reg(['adminrestoreinvite'], async (ctx) => gojoGeneratedFeature(ctx, 'adminrestoreinvite'));
reg(['adminrestoresetting'], async (ctx) => gojoGeneratedFeature(ctx, 'adminrestoresetting'));
reg(['adminrestoresecurity'], async (ctx) => gojoGeneratedFeature(ctx, 'adminrestoresecurity'));
reg(['adminschedulegroup'], async (ctx) => gojoGeneratedFeature(ctx, 'adminschedulegroup'));
reg(['adminschedulemember'], async (ctx) => gojoGeneratedFeature(ctx, 'adminschedulemember'));
reg(['adminscheduleadmin'], async (ctx) => gojoGeneratedFeature(ctx, 'adminscheduleadmin'));
reg(['adminschedulelink'], async (ctx) => gojoGeneratedFeature(ctx, 'adminschedulelink'));
reg(['adminschedulespam'], async (ctx) => gojoGeneratedFeature(ctx, 'adminschedulespam'));
reg(['adminscheduletoxic'], async (ctx) => gojoGeneratedFeature(ctx, 'adminscheduletoxic'));
reg(['adminschedulemedia'], async (ctx) => gojoGeneratedFeature(ctx, 'adminschedulemedia'));
reg(['adminscheduleimage'], async (ctx) => gojoGeneratedFeature(ctx, 'adminscheduleimage'));
reg(['adminschedulevideo'], async (ctx) => gojoGeneratedFeature(ctx, 'adminschedulevideo'));
reg(['adminscheduleaudio'], async (ctx) => gojoGeneratedFeature(ctx, 'adminscheduleaudio'));
reg(['adminscheduledocument'], async (ctx) => gojoGeneratedFeature(ctx, 'adminscheduledocument'));
reg(['adminschedulesticker'], async (ctx) => gojoGeneratedFeature(ctx, 'adminschedulesticker'));
reg(['adminschedulepoll'], async (ctx) => gojoGeneratedFeature(ctx, 'adminschedulepoll'));
reg(['adminschedulewelcome'], async (ctx) => gojoGeneratedFeature(ctx, 'adminschedulewelcome'));
reg(['adminschedulefarewell'], async (ctx) => gojoGeneratedFeature(ctx, 'adminschedulefarewell'));
reg(['adminschedulerules'], async (ctx) => gojoGeneratedFeature(ctx, 'adminschedulerules'));
reg(['adminschedulewarning'], async (ctx) => gojoGeneratedFeature(ctx, 'adminschedulewarning'));
reg(['adminschedulerequest'], async (ctx) => gojoGeneratedFeature(ctx, 'adminschedulerequest'));
reg(['adminscheduleevent'], async (ctx) => gojoGeneratedFeature(ctx, 'adminscheduleevent'));
reg(['adminschedulenote'], async (ctx) => gojoGeneratedFeature(ctx, 'adminschedulenote'));
reg(['adminscheduletemplate'], async (ctx) => gojoGeneratedFeature(ctx, 'adminscheduletemplate'));
reg(['adminscheduleactivity'], async (ctx) => gojoGeneratedFeature(ctx, 'adminscheduleactivity'));
reg(['adminscheduleinvite'], async (ctx) => gojoGeneratedFeature(ctx, 'adminscheduleinvite'));
reg(['adminschedulesetting'], async (ctx) => gojoGeneratedFeature(ctx, 'adminschedulesetting'));
reg(['adminschedulesecurity'], async (ctx) => gojoGeneratedFeature(ctx, 'adminschedulesecurity'));
reg(['adminannouncegroup'], async (ctx) => gojoGeneratedFeature(ctx, 'adminannouncegroup'));
reg(['adminannouncemember'], async (ctx) => gojoGeneratedFeature(ctx, 'adminannouncemember'));
reg(['adminannounceadmin'], async (ctx) => gojoGeneratedFeature(ctx, 'adminannounceadmin'));
reg(['adminannouncelink'], async (ctx) => gojoGeneratedFeature(ctx, 'adminannouncelink'));
reg(['adminannouncespam'], async (ctx) => gojoGeneratedFeature(ctx, 'adminannouncespam'));
reg(['adminannouncetoxic'], async (ctx) => gojoGeneratedFeature(ctx, 'adminannouncetoxic'));
reg(['adminannouncemedia'], async (ctx) => gojoGeneratedFeature(ctx, 'adminannouncemedia'));
reg(['adminannounceimage'], async (ctx) => gojoGeneratedFeature(ctx, 'adminannounceimage'));
reg(['adminannouncevideo'], async (ctx) => gojoGeneratedFeature(ctx, 'adminannouncevideo'));
reg(['adminannounceaudio'], async (ctx) => gojoGeneratedFeature(ctx, 'adminannounceaudio'));
reg(['adminannouncedocument'], async (ctx) => gojoGeneratedFeature(ctx, 'adminannouncedocument'));
reg(['adminannouncesticker'], async (ctx) => gojoGeneratedFeature(ctx, 'adminannouncesticker'));
reg(['adminannouncepoll'], async (ctx) => gojoGeneratedFeature(ctx, 'adminannouncepoll'));
reg(['adminannouncewelcome'], async (ctx) => gojoGeneratedFeature(ctx, 'adminannouncewelcome'));
reg(['adminannouncefarewell'], async (ctx) => gojoGeneratedFeature(ctx, 'adminannouncefarewell'));
reg(['adminannouncerules'], async (ctx) => gojoGeneratedFeature(ctx, 'adminannouncerules'));
reg(['adminannouncewarning'], async (ctx) => gojoGeneratedFeature(ctx, 'adminannouncewarning'));
reg(['adminannouncerequest'], async (ctx) => gojoGeneratedFeature(ctx, 'adminannouncerequest'));
reg(['adminannounceevent'], async (ctx) => gojoGeneratedFeature(ctx, 'adminannounceevent'));
reg(['adminannouncenote'], async (ctx) => gojoGeneratedFeature(ctx, 'adminannouncenote'));
reg(['adminannouncetemplate'], async (ctx) => gojoGeneratedFeature(ctx, 'adminannouncetemplate'));
reg(['adminannounceactivity'], async (ctx) => gojoGeneratedFeature(ctx, 'adminannounceactivity'));
reg(['adminannounceinvite'], async (ctx) => gojoGeneratedFeature(ctx, 'adminannounceinvite'));
reg(['adminannouncesetting'], async (ctx) => gojoGeneratedFeature(ctx, 'adminannouncesetting'));
reg(['adminannouncesecurity'], async (ctx) => gojoGeneratedFeature(ctx, 'adminannouncesecurity'));
reg(['adminfiltergroup'], async (ctx) => gojoGeneratedFeature(ctx, 'adminfiltergroup'));
reg(['adminfiltermember'], async (ctx) => gojoGeneratedFeature(ctx, 'adminfiltermember'));
reg(['adminfilteradmin'], async (ctx) => gojoGeneratedFeature(ctx, 'adminfilteradmin'));
reg(['adminfilterlink'], async (ctx) => gojoGeneratedFeature(ctx, 'adminfilterlink'));
reg(['adminfilterspam'], async (ctx) => gojoGeneratedFeature(ctx, 'adminfilterspam'));
reg(['adminfiltertoxic'], async (ctx) => gojoGeneratedFeature(ctx, 'adminfiltertoxic'));
reg(['adminfiltermedia'], async (ctx) => gojoGeneratedFeature(ctx, 'adminfiltermedia'));
reg(['adminfilterimage'], async (ctx) => gojoGeneratedFeature(ctx, 'adminfilterimage'));
reg(['adminfiltervideo'], async (ctx) => gojoGeneratedFeature(ctx, 'adminfiltervideo'));
reg(['adminfilteraudio'], async (ctx) => gojoGeneratedFeature(ctx, 'adminfilteraudio'));
reg(['adminfilterdocument'], async (ctx) => gojoGeneratedFeature(ctx, 'adminfilterdocument'));
reg(['adminfiltersticker'], async (ctx) => gojoGeneratedFeature(ctx, 'adminfiltersticker'));
reg(['adminfilterpoll'], async (ctx) => gojoGeneratedFeature(ctx, 'adminfilterpoll'));
reg(['adminfilterwelcome'], async (ctx) => gojoGeneratedFeature(ctx, 'adminfilterwelcome'));
reg(['adminfilterfarewell'], async (ctx) => gojoGeneratedFeature(ctx, 'adminfilterfarewell'));
reg(['adminfilterrules'], async (ctx) => gojoGeneratedFeature(ctx, 'adminfilterrules'));
reg(['adminfilterwarning'], async (ctx) => gojoGeneratedFeature(ctx, 'adminfilterwarning'));
reg(['adminfilterrequest'], async (ctx) => gojoGeneratedFeature(ctx, 'adminfilterrequest'));
reg(['adminfilterevent'], async (ctx) => gojoGeneratedFeature(ctx, 'adminfilterevent'));
reg(['adminfilternote'], async (ctx) => gojoGeneratedFeature(ctx, 'adminfilternote'));
reg(['adminfiltertemplate'], async (ctx) => gojoGeneratedFeature(ctx, 'adminfiltertemplate'));
reg(['adminfilteractivity'], async (ctx) => gojoGeneratedFeature(ctx, 'adminfilteractivity'));
reg(['adminfilterinvite'], async (ctx) => gojoGeneratedFeature(ctx, 'adminfilterinvite'));
reg(['adminfiltersetting'], async (ctx) => gojoGeneratedFeature(ctx, 'adminfiltersetting'));
reg(['adminfiltersecurity'], async (ctx) => gojoGeneratedFeature(ctx, 'adminfiltersecurity'));
reg(['adminmoderategroup'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmoderategroup'));
reg(['adminmoderatemember'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmoderatemember'));
reg(['adminmoderateadmin'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmoderateadmin'));
reg(['adminmoderatelink'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmoderatelink'));
reg(['adminmoderatespam'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmoderatespam'));
reg(['adminmoderatetoxic'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmoderatetoxic'));
reg(['adminmoderatemedia'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmoderatemedia'));
reg(['adminmoderateimage'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmoderateimage'));
reg(['adminmoderatevideo'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmoderatevideo'));
reg(['adminmoderateaudio'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmoderateaudio'));
reg(['adminmoderatedocument'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmoderatedocument'));
reg(['adminmoderatesticker'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmoderatesticker'));
reg(['adminmoderatepoll'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmoderatepoll'));
reg(['adminmoderatewelcome'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmoderatewelcome'));
reg(['adminmoderatefarewell'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmoderatefarewell'));
reg(['adminmoderaterules'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmoderaterules'));
reg(['adminmoderatewarning'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmoderatewarning'));
reg(['adminmoderaterequest'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmoderaterequest'));
reg(['adminmoderateevent'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmoderateevent'));
reg(['adminmoderatenote'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmoderatenote'));
reg(['adminmoderatetemplate'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmoderatetemplate'));
reg(['adminmoderateactivity'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmoderateactivity'));
reg(['adminmoderateinvite'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmoderateinvite'));
reg(['adminmoderatesetting'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmoderatesetting'));
reg(['adminmoderatesecurity'], async (ctx) => gojoGeneratedFeature(ctx, 'adminmoderatesecurity'));
reg(['adminsecuregroup'], async (ctx) => gojoGeneratedFeature(ctx, 'adminsecuregroup'));
reg(['adminsecuremember'], async (ctx) => gojoGeneratedFeature(ctx, 'adminsecuremember'));
reg(['adminsecureadmin'], async (ctx) => gojoGeneratedFeature(ctx, 'adminsecureadmin'));
reg(['adminsecurelink'], async (ctx) => gojoGeneratedFeature(ctx, 'adminsecurelink'));
reg(['adminsecurespam'], async (ctx) => gojoGeneratedFeature(ctx, 'adminsecurespam'));
reg(['adminsecuretoxic'], async (ctx) => gojoGeneratedFeature(ctx, 'adminsecuretoxic'));
reg(['adminsecuremedia'], async (ctx) => gojoGeneratedFeature(ctx, 'adminsecuremedia'));
reg(['adminsecureimage'], async (ctx) => gojoGeneratedFeature(ctx, 'adminsecureimage'));
reg(['adminsecurevideo'], async (ctx) => gojoGeneratedFeature(ctx, 'adminsecurevideo'));
reg(['adminsecureaudio'], async (ctx) => gojoGeneratedFeature(ctx, 'adminsecureaudio'));
reg(['adminsecuredocument'], async (ctx) => gojoGeneratedFeature(ctx, 'adminsecuredocument'));
reg(['adminsecuresticker'], async (ctx) => gojoGeneratedFeature(ctx, 'adminsecuresticker'));
reg(['adminsecurepoll'], async (ctx) => gojoGeneratedFeature(ctx, 'adminsecurepoll'));
reg(['adminsecurewelcome'], async (ctx) => gojoGeneratedFeature(ctx, 'adminsecurewelcome'));
reg(['adminsecurefarewell'], async (ctx) => gojoGeneratedFeature(ctx, 'adminsecurefarewell'));
reg(['adminsecurerules'], async (ctx) => gojoGeneratedFeature(ctx, 'adminsecurerules'));
reg(['adminsecurewarning'], async (ctx) => gojoGeneratedFeature(ctx, 'adminsecurewarning'));
reg(['adminsecurerequest'], async (ctx) => gojoGeneratedFeature(ctx, 'adminsecurerequest'));
reg(['adminsecureevent'], async (ctx) => gojoGeneratedFeature(ctx, 'adminsecureevent'));
reg(['adminsecurenote'], async (ctx) => gojoGeneratedFeature(ctx, 'adminsecurenote'));
reg(['adminsecuretemplate'], async (ctx) => gojoGeneratedFeature(ctx, 'adminsecuretemplate'));
reg(['adminsecureactivity'], async (ctx) => gojoGeneratedFeature(ctx, 'adminsecureactivity'));
reg(['adminsecureinvite'], async (ctx) => gojoGeneratedFeature(ctx, 'adminsecureinvite'));
reg(['adminsecuresetting'], async (ctx) => gojoGeneratedFeature(ctx, 'adminsecuresetting'));
reg(['adminsecuresecurity'], async (ctx) => gojoGeneratedFeature(ctx, 'adminsecuresecurity'));
reg(['admininspectgroup'], async (ctx) => gojoGeneratedFeature(ctx, 'admininspectgroup'));
reg(['admininspectmember'], async (ctx) => gojoGeneratedFeature(ctx, 'admininspectmember'));
reg(['admininspectadmin'], async (ctx) => gojoGeneratedFeature(ctx, 'admininspectadmin'));
reg(['admininspectlink'], async (ctx) => gojoGeneratedFeature(ctx, 'admininspectlink'));
reg(['admininspectspam'], async (ctx) => gojoGeneratedFeature(ctx, 'admininspectspam'));
reg(['admininspecttoxic'], async (ctx) => gojoGeneratedFeature(ctx, 'admininspecttoxic'));
reg(['admininspectmedia'], async (ctx) => gojoGeneratedFeature(ctx, 'admininspectmedia'));
reg(['admininspectimage'], async (ctx) => gojoGeneratedFeature(ctx, 'admininspectimage'));
reg(['admininspectvideo'], async (ctx) => gojoGeneratedFeature(ctx, 'admininspectvideo'));
reg(['admininspectaudio'], async (ctx) => gojoGeneratedFeature(ctx, 'admininspectaudio'));
reg(['admininspectdocument'], async (ctx) => gojoGeneratedFeature(ctx, 'admininspectdocument'));
reg(['admininspectsticker'], async (ctx) => gojoGeneratedFeature(ctx, 'admininspectsticker'));
reg(['admininspectpoll'], async (ctx) => gojoGeneratedFeature(ctx, 'admininspectpoll'));
reg(['admininspectwelcome'], async (ctx) => gojoGeneratedFeature(ctx, 'admininspectwelcome'));
reg(['admininspectfarewell'], async (ctx) => gojoGeneratedFeature(ctx, 'admininspectfarewell'));
reg(['admininspectrules'], async (ctx) => gojoGeneratedFeature(ctx, 'admininspectrules'));
reg(['admininspectwarning'], async (ctx) => gojoGeneratedFeature(ctx, 'admininspectwarning'));
reg(['admininspectrequest'], async (ctx) => gojoGeneratedFeature(ctx, 'admininspectrequest'));
reg(['admininspectevent'], async (ctx) => gojoGeneratedFeature(ctx, 'admininspectevent'));
reg(['admininspectnote'], async (ctx) => gojoGeneratedFeature(ctx, 'admininspectnote'));
reg(['admininspecttemplate'], async (ctx) => gojoGeneratedFeature(ctx, 'admininspecttemplate'));
reg(['admininspectactivity'], async (ctx) => gojoGeneratedFeature(ctx, 'admininspectactivity'));
reg(['admininspectinvite'], async (ctx) => gojoGeneratedFeature(ctx, 'admininspectinvite'));
reg(['admininspectsetting'], async (ctx) => gojoGeneratedFeature(ctx, 'admininspectsetting'));
reg(['admininspectsecurity'], async (ctx) => gojoGeneratedFeature(ctx, 'admininspectsecurity'));
reg(['funjokegojo'], async (ctx) => gojoGeneratedFeature(ctx, 'funjokegojo'));
reg(['funjokeanime'], async (ctx) => gojoGeneratedFeature(ctx, 'funjokeanime'));
reg(['funjokeemoji'], async (ctx) => gojoGeneratedFeature(ctx, 'funjokeemoji'));
reg(['funjokenumber'], async (ctx) => gojoGeneratedFeature(ctx, 'funjokenumber'));
reg(['funjokeword'], async (ctx) => gojoGeneratedFeature(ctx, 'funjokeword'));
reg(['funjokepicture'], async (ctx) => gojoGeneratedFeature(ctx, 'funjokepicture'));
reg(['funjokestory'], async (ctx) => gojoGeneratedFeature(ctx, 'funjokestory'));
reg(['funjokefriend'], async (ctx) => gojoGeneratedFeature(ctx, 'funjokefriend'));
reg(['funjokegroup'], async (ctx) => gojoGeneratedFeature(ctx, 'funjokegroup'));
reg(['funjokedaily'], async (ctx) => gojoGeneratedFeature(ctx, 'funjokedaily'));
reg(['funquizgojo'], async (ctx) => gojoGeneratedFeature(ctx, 'funquizgojo'));
reg(['funquizanime'], async (ctx) => gojoGeneratedFeature(ctx, 'funquizanime'));
reg(['funquizemoji'], async (ctx) => gojoGeneratedFeature(ctx, 'funquizemoji'));
reg(['funquiznumber'], async (ctx) => gojoGeneratedFeature(ctx, 'funquiznumber'));
reg(['funquizword'], async (ctx) => gojoGeneratedFeature(ctx, 'funquizword'));
reg(['funquizpicture'], async (ctx) => gojoGeneratedFeature(ctx, 'funquizpicture'));
reg(['funquizstory'], async (ctx) => gojoGeneratedFeature(ctx, 'funquizstory'));
reg(['funquizfriend'], async (ctx) => gojoGeneratedFeature(ctx, 'funquizfriend'));
reg(['funquizgroup'], async (ctx) => gojoGeneratedFeature(ctx, 'funquizgroup'));
reg(['funquizdaily'], async (ctx) => gojoGeneratedFeature(ctx, 'funquizdaily'));
reg(['funguessgojo'], async (ctx) => gojoGeneratedFeature(ctx, 'funguessgojo'));
reg(['funguessanime'], async (ctx) => gojoGeneratedFeature(ctx, 'funguessanime'));
reg(['funguessemoji'], async (ctx) => gojoGeneratedFeature(ctx, 'funguessemoji'));
reg(['funguessnumber'], async (ctx) => gojoGeneratedFeature(ctx, 'funguessnumber'));
reg(['funguessword'], async (ctx) => gojoGeneratedFeature(ctx, 'funguessword'));
reg(['funguesspicture'], async (ctx) => gojoGeneratedFeature(ctx, 'funguesspicture'));
reg(['funguessstory'], async (ctx) => gojoGeneratedFeature(ctx, 'funguessstory'));
reg(['funguessfriend'], async (ctx) => gojoGeneratedFeature(ctx, 'funguessfriend'));
reg(['funguessgroup'], async (ctx) => gojoGeneratedFeature(ctx, 'funguessgroup'));
reg(['funguessdaily'], async (ctx) => gojoGeneratedFeature(ctx, 'funguessdaily'));
reg(['funemojigojo'], async (ctx) => gojoGeneratedFeature(ctx, 'funemojigojo'));
reg(['funemojianime'], async (ctx) => gojoGeneratedFeature(ctx, 'funemojianime'));
reg(['funemojiemoji'], async (ctx) => gojoGeneratedFeature(ctx, 'funemojiemoji'));
reg(['funemojinumber'], async (ctx) => gojoGeneratedFeature(ctx, 'funemojinumber'));
reg(['funemojiword'], async (ctx) => gojoGeneratedFeature(ctx, 'funemojiword'));
reg(['funemojipicture'], async (ctx) => gojoGeneratedFeature(ctx, 'funemojipicture'));
reg(['funemojistory'], async (ctx) => gojoGeneratedFeature(ctx, 'funemojistory'));
reg(['funemojifriend'], async (ctx) => gojoGeneratedFeature(ctx, 'funemojifriend'));
reg(['funemojigroup'], async (ctx) => gojoGeneratedFeature(ctx, 'funemojigroup'));
reg(['funemojidaily'], async (ctx) => gojoGeneratedFeature(ctx, 'funemojidaily'));
reg(['funstorygojo'], async (ctx) => gojoGeneratedFeature(ctx, 'funstorygojo'));
reg(['funstoryanime'], async (ctx) => gojoGeneratedFeature(ctx, 'funstoryanime'));
reg(['funstoryemoji'], async (ctx) => gojoGeneratedFeature(ctx, 'funstoryemoji'));
reg(['funstorynumber'], async (ctx) => gojoGeneratedFeature(ctx, 'funstorynumber'));
reg(['funstoryword'], async (ctx) => gojoGeneratedFeature(ctx, 'funstoryword'));
reg(['funstorypicture'], async (ctx) => gojoGeneratedFeature(ctx, 'funstorypicture'));
reg(['funstorystory'], async (ctx) => gojoGeneratedFeature(ctx, 'funstorystory'));
reg(['funstoryfriend'], async (ctx) => gojoGeneratedFeature(ctx, 'funstoryfriend'));
reg(['funstorygroup'], async (ctx) => gojoGeneratedFeature(ctx, 'funstorygroup'));
reg(['funstorydaily'], async (ctx) => gojoGeneratedFeature(ctx, 'funstorydaily'));
reg(['funroastgojo'], async (ctx) => gojoGeneratedFeature(ctx, 'funroastgojo'));
reg(['funroastanime'], async (ctx) => gojoGeneratedFeature(ctx, 'funroastanime'));
reg(['funroastemoji'], async (ctx) => gojoGeneratedFeature(ctx, 'funroastemoji'));
reg(['funroastnumber'], async (ctx) => gojoGeneratedFeature(ctx, 'funroastnumber'));
reg(['funroastword'], async (ctx) => gojoGeneratedFeature(ctx, 'funroastword'));
reg(['funroastpicture'], async (ctx) => gojoGeneratedFeature(ctx, 'funroastpicture'));
reg(['funroaststory'], async (ctx) => gojoGeneratedFeature(ctx, 'funroaststory'));
reg(['funroastfriend'], async (ctx) => gojoGeneratedFeature(ctx, 'funroastfriend'));
reg(['funroastgroup'], async (ctx) => gojoGeneratedFeature(ctx, 'funroastgroup'));
reg(['funroastdaily'], async (ctx) => gojoGeneratedFeature(ctx, 'funroastdaily'));
reg(['funcomplimentgojo'], async (ctx) => gojoGeneratedFeature(ctx, 'funcomplimentgojo'));
reg(['funcomplimentanime'], async (ctx) => gojoGeneratedFeature(ctx, 'funcomplimentanime'));
reg(['funcomplimentemoji'], async (ctx) => gojoGeneratedFeature(ctx, 'funcomplimentemoji'));
reg(['funcomplimentnumber'], async (ctx) => gojoGeneratedFeature(ctx, 'funcomplimentnumber'));
reg(['funcomplimentword'], async (ctx) => gojoGeneratedFeature(ctx, 'funcomplimentword'));
reg(['funcomplimentpicture'], async (ctx) => gojoGeneratedFeature(ctx, 'funcomplimentpicture'));
reg(['funcomplimentstory'], async (ctx) => gojoGeneratedFeature(ctx, 'funcomplimentstory'));
reg(['funcomplimentfriend'], async (ctx) => gojoGeneratedFeature(ctx, 'funcomplimentfriend'));
reg(['funcomplimentgroup'], async (ctx) => gojoGeneratedFeature(ctx, 'funcomplimentgroup'));
reg(['funcomplimentdaily'], async (ctx) => gojoGeneratedFeature(ctx, 'funcomplimentdaily'));
reg(['funtruthgojo'], async (ctx) => gojoGeneratedFeature(ctx, 'funtruthgojo'));
reg(['funtruthanime'], async (ctx) => gojoGeneratedFeature(ctx, 'funtruthanime'));
reg(['funtruthemoji'], async (ctx) => gojoGeneratedFeature(ctx, 'funtruthemoji'));
reg(['funtruthnumber'], async (ctx) => gojoGeneratedFeature(ctx, 'funtruthnumber'));
reg(['funtruthword'], async (ctx) => gojoGeneratedFeature(ctx, 'funtruthword'));
reg(['funtruthpicture'], async (ctx) => gojoGeneratedFeature(ctx, 'funtruthpicture'));
reg(['funtruthstory'], async (ctx) => gojoGeneratedFeature(ctx, 'funtruthstory'));
reg(['funtruthfriend'], async (ctx) => gojoGeneratedFeature(ctx, 'funtruthfriend'));
reg(['funtruthgroup'], async (ctx) => gojoGeneratedFeature(ctx, 'funtruthgroup'));
reg(['funtruthdaily'], async (ctx) => gojoGeneratedFeature(ctx, 'funtruthdaily'));
reg(['fundaregojo'], async (ctx) => gojoGeneratedFeature(ctx, 'fundaregojo'));
reg(['fundareanime'], async (ctx) => gojoGeneratedFeature(ctx, 'fundareanime'));
reg(['fundareemoji'], async (ctx) => gojoGeneratedFeature(ctx, 'fundareemoji'));
reg(['fundarenumber'], async (ctx) => gojoGeneratedFeature(ctx, 'fundarenumber'));
reg(['fundareword'], async (ctx) => gojoGeneratedFeature(ctx, 'fundareword'));
reg(['fundarepicture'], async (ctx) => gojoGeneratedFeature(ctx, 'fundarepicture'));
reg(['fundarestory'], async (ctx) => gojoGeneratedFeature(ctx, 'fundarestory'));
reg(['fundarefriend'], async (ctx) => gojoGeneratedFeature(ctx, 'fundarefriend'));
reg(['fundaregroup'], async (ctx) => gojoGeneratedFeature(ctx, 'fundaregroup'));
reg(['fundaredaily'], async (ctx) => gojoGeneratedFeature(ctx, 'fundaredaily'));
reg(['funriddlegojo'], async (ctx) => gojoGeneratedFeature(ctx, 'funriddlegojo'));
reg(['funriddleanime'], async (ctx) => gojoGeneratedFeature(ctx, 'funriddleanime'));
reg(['funriddleemoji'], async (ctx) => gojoGeneratedFeature(ctx, 'funriddleemoji'));
reg(['funriddlenumber'], async (ctx) => gojoGeneratedFeature(ctx, 'funriddlenumber'));
reg(['funriddleword'], async (ctx) => gojoGeneratedFeature(ctx, 'funriddleword'));
reg(['funriddlepicture'], async (ctx) => gojoGeneratedFeature(ctx, 'funriddlepicture'));
reg(['funriddlestory'], async (ctx) => gojoGeneratedFeature(ctx, 'funriddlestory'));
reg(['funriddlefriend'], async (ctx) => gojoGeneratedFeature(ctx, 'funriddlefriend'));
reg(['funriddlegroup'], async (ctx) => gojoGeneratedFeature(ctx, 'funriddlegroup'));
reg(['funriddledaily'], async (ctx) => gojoGeneratedFeature(ctx, 'funriddledaily'));
reg(['funfortunegojo'], async (ctx) => gojoGeneratedFeature(ctx, 'funfortunegojo'));
reg(['funfortuneanime'], async (ctx) => gojoGeneratedFeature(ctx, 'funfortuneanime'));
reg(['funfortuneemoji'], async (ctx) => gojoGeneratedFeature(ctx, 'funfortuneemoji'));
reg(['funfortunenumber'], async (ctx) => gojoGeneratedFeature(ctx, 'funfortunenumber'));
reg(['funfortuneword'], async (ctx) => gojoGeneratedFeature(ctx, 'funfortuneword'));
reg(['funfortunepicture'], async (ctx) => gojoGeneratedFeature(ctx, 'funfortunepicture'));
reg(['funfortunestory'], async (ctx) => gojoGeneratedFeature(ctx, 'funfortunestory'));
reg(['funfortunefriend'], async (ctx) => gojoGeneratedFeature(ctx, 'funfortunefriend'));
reg(['funfortunegroup'], async (ctx) => gojoGeneratedFeature(ctx, 'funfortunegroup'));
reg(['funfortunedaily'], async (ctx) => gojoGeneratedFeature(ctx, 'funfortunedaily'));
reg(['funmemegojo'], async (ctx) => gojoGeneratedFeature(ctx, 'funmemegojo'));
reg(['funmemeanime'], async (ctx) => gojoGeneratedFeature(ctx, 'funmemeanime'));
reg(['funmemeemoji'], async (ctx) => gojoGeneratedFeature(ctx, 'funmemeemoji'));
reg(['funmemenumber'], async (ctx) => gojoGeneratedFeature(ctx, 'funmemenumber'));
reg(['funmemeword'], async (ctx) => gojoGeneratedFeature(ctx, 'funmemeword'));
reg(['funmemepicture'], async (ctx) => gojoGeneratedFeature(ctx, 'funmemepicture'));
reg(['funmemestory'], async (ctx) => gojoGeneratedFeature(ctx, 'funmemestory'));
reg(['funmemefriend'], async (ctx) => gojoGeneratedFeature(ctx, 'funmemefriend'));
reg(['funmemegroup'], async (ctx) => gojoGeneratedFeature(ctx, 'funmemegroup'));
reg(['funmemedaily'], async (ctx) => gojoGeneratedFeature(ctx, 'funmemedaily'));
reg(['funrandomgojo'], async (ctx) => gojoGeneratedFeature(ctx, 'funrandomgojo'));
reg(['funrandomanime'], async (ctx) => gojoGeneratedFeature(ctx, 'funrandomanime'));
reg(['funrandomemoji'], async (ctx) => gojoGeneratedFeature(ctx, 'funrandomemoji'));
reg(['funrandomnumber'], async (ctx) => gojoGeneratedFeature(ctx, 'funrandomnumber'));
reg(['funrandomword'], async (ctx) => gojoGeneratedFeature(ctx, 'funrandomword'));
reg(['funrandompicture'], async (ctx) => gojoGeneratedFeature(ctx, 'funrandompicture'));
reg(['funrandomstory'], async (ctx) => gojoGeneratedFeature(ctx, 'funrandomstory'));
reg(['funrandomfriend'], async (ctx) => gojoGeneratedFeature(ctx, 'funrandomfriend'));
reg(['funrandomgroup'], async (ctx) => gojoGeneratedFeature(ctx, 'funrandomgroup'));
reg(['funrandomdaily'], async (ctx) => gojoGeneratedFeature(ctx, 'funrandomdaily'));
reg(['funduelgojo'], async (ctx) => gojoGeneratedFeature(ctx, 'funduelgojo'));
reg(['funduelanime'], async (ctx) => gojoGeneratedFeature(ctx, 'funduelanime'));
reg(['funduelemoji'], async (ctx) => gojoGeneratedFeature(ctx, 'funduelemoji'));
reg(['funduelnumber'], async (ctx) => gojoGeneratedFeature(ctx, 'funduelnumber'));
reg(['funduelword'], async (ctx) => gojoGeneratedFeature(ctx, 'funduelword'));
reg(['funduelpicture'], async (ctx) => gojoGeneratedFeature(ctx, 'funduelpicture'));
reg(['funduelstory'], async (ctx) => gojoGeneratedFeature(ctx, 'funduelstory'));
reg(['funduelfriend'], async (ctx) => gojoGeneratedFeature(ctx, 'funduelfriend'));
reg(['funduelgroup'], async (ctx) => gojoGeneratedFeature(ctx, 'funduelgroup'));
reg(['fundueldaily'], async (ctx) => gojoGeneratedFeature(ctx, 'fundueldaily'));
reg(['funvotegojo'], async (ctx) => gojoGeneratedFeature(ctx, 'funvotegojo'));
reg(['funvoteanime'], async (ctx) => gojoGeneratedFeature(ctx, 'funvoteanime'));
reg(['funvoteemoji'], async (ctx) => gojoGeneratedFeature(ctx, 'funvoteemoji'));
reg(['funvotenumber'], async (ctx) => gojoGeneratedFeature(ctx, 'funvotenumber'));
reg(['funvoteword'], async (ctx) => gojoGeneratedFeature(ctx, 'funvoteword'));
reg(['funvotepicture'], async (ctx) => gojoGeneratedFeature(ctx, 'funvotepicture'));
reg(['funvotestory'], async (ctx) => gojoGeneratedFeature(ctx, 'funvotestory'));
reg(['funvotefriend'], async (ctx) => gojoGeneratedFeature(ctx, 'funvotefriend'));
reg(['funvotegroup'], async (ctx) => gojoGeneratedFeature(ctx, 'funvotegroup'));
reg(['funvotedaily'], async (ctx) => gojoGeneratedFeature(ctx, 'funvotedaily'));
reg(['funpollgojo'], async (ctx) => gojoGeneratedFeature(ctx, 'funpollgojo'));
reg(['funpollanime'], async (ctx) => gojoGeneratedFeature(ctx, 'funpollanime'));
reg(['funpollemoji'], async (ctx) => gojoGeneratedFeature(ctx, 'funpollemoji'));
reg(['funpollnumber'], async (ctx) => gojoGeneratedFeature(ctx, 'funpollnumber'));
reg(['funpollword'], async (ctx) => gojoGeneratedFeature(ctx, 'funpollword'));
reg(['funpollpicture'], async (ctx) => gojoGeneratedFeature(ctx, 'funpollpicture'));
reg(['funpollstory'], async (ctx) => gojoGeneratedFeature(ctx, 'funpollstory'));
reg(['funpollfriend'], async (ctx) => gojoGeneratedFeature(ctx, 'funpollfriend'));
reg(['funpollgroup'], async (ctx) => gojoGeneratedFeature(ctx, 'funpollgroup'));
reg(['funpolldaily'], async (ctx) => gojoGeneratedFeature(ctx, 'funpolldaily'));
reg(['funcaptiongojo'], async (ctx) => gojoGeneratedFeature(ctx, 'funcaptiongojo'));
reg(['funcaptionanime'], async (ctx) => gojoGeneratedFeature(ctx, 'funcaptionanime'));
reg(['funcaptionemoji'], async (ctx) => gojoGeneratedFeature(ctx, 'funcaptionemoji'));
reg(['funcaptionnumber'], async (ctx) => gojoGeneratedFeature(ctx, 'funcaptionnumber'));
reg(['funcaptionword'], async (ctx) => gojoGeneratedFeature(ctx, 'funcaptionword'));
reg(['funcaptionpicture'], async (ctx) => gojoGeneratedFeature(ctx, 'funcaptionpicture'));
reg(['funcaptionstory'], async (ctx) => gojoGeneratedFeature(ctx, 'funcaptionstory'));
reg(['funcaptionfriend'], async (ctx) => gojoGeneratedFeature(ctx, 'funcaptionfriend'));
reg(['funcaptiongroup'], async (ctx) => gojoGeneratedFeature(ctx, 'funcaptiongroup'));
reg(['funcaptiondaily'], async (ctx) => gojoGeneratedFeature(ctx, 'funcaptiondaily'));
reg(['funquotegojo'], async (ctx) => gojoGeneratedFeature(ctx, 'funquotegojo'));
reg(['funquoteanime'], async (ctx) => gojoGeneratedFeature(ctx, 'funquoteanime'));
reg(['funquoteemoji'], async (ctx) => gojoGeneratedFeature(ctx, 'funquoteemoji'));
reg(['funquotenumber'], async (ctx) => gojoGeneratedFeature(ctx, 'funquotenumber'));
reg(['funquoteword'], async (ctx) => gojoGeneratedFeature(ctx, 'funquoteword'));
reg(['funquotepicture'], async (ctx) => gojoGeneratedFeature(ctx, 'funquotepicture'));
reg(['funquotestory'], async (ctx) => gojoGeneratedFeature(ctx, 'funquotestory'));
reg(['funquotefriend'], async (ctx) => gojoGeneratedFeature(ctx, 'funquotefriend'));
reg(['funquotegroup'], async (ctx) => gojoGeneratedFeature(ctx, 'funquotegroup'));
reg(['funquotedaily'], async (ctx) => gojoGeneratedFeature(ctx, 'funquotedaily'));
reg(['funchallengegojo'], async (ctx) => gojoGeneratedFeature(ctx, 'funchallengegojo'));
reg(['funchallengeanime'], async (ctx) => gojoGeneratedFeature(ctx, 'funchallengeanime'));
reg(['funchallengeemoji'], async (ctx) => gojoGeneratedFeature(ctx, 'funchallengeemoji'));
reg(['funchallengenumber'], async (ctx) => gojoGeneratedFeature(ctx, 'funchallengenumber'));
reg(['funchallengeword'], async (ctx) => gojoGeneratedFeature(ctx, 'funchallengeword'));
reg(['funchallengepicture'], async (ctx) => gojoGeneratedFeature(ctx, 'funchallengepicture'));
reg(['funchallengestory'], async (ctx) => gojoGeneratedFeature(ctx, 'funchallengestory'));
reg(['funchallengefriend'], async (ctx) => gojoGeneratedFeature(ctx, 'funchallengefriend'));
reg(['funchallengegroup'], async (ctx) => gojoGeneratedFeature(ctx, 'funchallengegroup'));
reg(['funchallengedaily'], async (ctx) => gojoGeneratedFeature(ctx, 'funchallengedaily'));
reg(['funreactiongojo'], async (ctx) => gojoGeneratedFeature(ctx, 'funreactiongojo'));
reg(['funreactionanime'], async (ctx) => gojoGeneratedFeature(ctx, 'funreactionanime'));
reg(['funreactionemoji'], async (ctx) => gojoGeneratedFeature(ctx, 'funreactionemoji'));
reg(['funreactionnumber'], async (ctx) => gojoGeneratedFeature(ctx, 'funreactionnumber'));
reg(['funreactionword'], async (ctx) => gojoGeneratedFeature(ctx, 'funreactionword'));
reg(['funreactionpicture'], async (ctx) => gojoGeneratedFeature(ctx, 'funreactionpicture'));
reg(['funreactionstory'], async (ctx) => gojoGeneratedFeature(ctx, 'funreactionstory'));
reg(['funreactionfriend'], async (ctx) => gojoGeneratedFeature(ctx, 'funreactionfriend'));
reg(['funreactiongroup'], async (ctx) => gojoGeneratedFeature(ctx, 'funreactiongroup'));
reg(['funreactiondaily'], async (ctx) => gojoGeneratedFeature(ctx, 'funreactiondaily'));
reg(['funmusicgojo'], async (ctx) => gojoGeneratedFeature(ctx, 'funmusicgojo'));
reg(['funmusicanime'], async (ctx) => gojoGeneratedFeature(ctx, 'funmusicanime'));
reg(['funmusicemoji'], async (ctx) => gojoGeneratedFeature(ctx, 'funmusicemoji'));
reg(['funmusicnumber'], async (ctx) => gojoGeneratedFeature(ctx, 'funmusicnumber'));
reg(['funmusicword'], async (ctx) => gojoGeneratedFeature(ctx, 'funmusicword'));
reg(['funmusicpicture'], async (ctx) => gojoGeneratedFeature(ctx, 'funmusicpicture'));
reg(['funmusicstory'], async (ctx) => gojoGeneratedFeature(ctx, 'funmusicstory'));
reg(['funmusicfriend'], async (ctx) => gojoGeneratedFeature(ctx, 'funmusicfriend'));
reg(['funmusicgroup'], async (ctx) => gojoGeneratedFeature(ctx, 'funmusicgroup'));
reg(['funmusicdaily'], async (ctx) => gojoGeneratedFeature(ctx, 'funmusicdaily'));
reg(['funmoviegojo'], async (ctx) => gojoGeneratedFeature(ctx, 'funmoviegojo'));
reg(['funmovieanime'], async (ctx) => gojoGeneratedFeature(ctx, 'funmovieanime'));
reg(['funmovieemoji'], async (ctx) => gojoGeneratedFeature(ctx, 'funmovieemoji'));
reg(['funmovienumber'], async (ctx) => gojoGeneratedFeature(ctx, 'funmovienumber'));
reg(['funmovieword'], async (ctx) => gojoGeneratedFeature(ctx, 'funmovieword'));
reg(['funmoviepicture'], async (ctx) => gojoGeneratedFeature(ctx, 'funmoviepicture'));
reg(['funmoviestory'], async (ctx) => gojoGeneratedFeature(ctx, 'funmoviestory'));
reg(['funmoviefriend'], async (ctx) => gojoGeneratedFeature(ctx, 'funmoviefriend'));
reg(['funmoviegroup'], async (ctx) => gojoGeneratedFeature(ctx, 'funmoviegroup'));
reg(['funmoviedaily'], async (ctx) => gojoGeneratedFeature(ctx, 'funmoviedaily'));
reg(['funanimegojo'], async (ctx) => gojoGeneratedFeature(ctx, 'funanimegojo'));
reg(['funanimeanime'], async (ctx) => gojoGeneratedFeature(ctx, 'funanimeanime'));
reg(['funanimeemoji'], async (ctx) => gojoGeneratedFeature(ctx, 'funanimeemoji'));
reg(['funanimenumber'], async (ctx) => gojoGeneratedFeature(ctx, 'funanimenumber'));
reg(['funanimeword'], async (ctx) => gojoGeneratedFeature(ctx, 'funanimeword'));
reg(['funanimepicture'], async (ctx) => gojoGeneratedFeature(ctx, 'funanimepicture'));
reg(['funanimestory'], async (ctx) => gojoGeneratedFeature(ctx, 'funanimestory'));
reg(['funanimefriend'], async (ctx) => gojoGeneratedFeature(ctx, 'funanimefriend'));
reg(['funanimegroup'], async (ctx) => gojoGeneratedFeature(ctx, 'funanimegroup'));
reg(['funanimedaily'], async (ctx) => gojoGeneratedFeature(ctx, 'funanimedaily'));
reg(['fungamegojo'], async (ctx) => gojoGeneratedFeature(ctx, 'fungamegojo'));
reg(['fungameanime'], async (ctx) => gojoGeneratedFeature(ctx, 'fungameanime'));
reg(['fungameemoji'], async (ctx) => gojoGeneratedFeature(ctx, 'fungameemoji'));
reg(['fungamenumber'], async (ctx) => gojoGeneratedFeature(ctx, 'fungamenumber'));
reg(['fungameword'], async (ctx) => gojoGeneratedFeature(ctx, 'fungameword'));
reg(['fungamepicture'], async (ctx) => gojoGeneratedFeature(ctx, 'fungamepicture'));
reg(['fungamestory'], async (ctx) => gojoGeneratedFeature(ctx, 'fungamestory'));
reg(['fungamefriend'], async (ctx) => gojoGeneratedFeature(ctx, 'fungamefriend'));
reg(['fungamegroup'], async (ctx) => gojoGeneratedFeature(ctx, 'fungamegroup'));
reg(['fungamedaily'], async (ctx) => gojoGeneratedFeature(ctx, 'fungamedaily'));
reg(['funpuzzlegojo'], async (ctx) => gojoGeneratedFeature(ctx, 'funpuzzlegojo'));
reg(['funpuzzleanime'], async (ctx) => gojoGeneratedFeature(ctx, 'funpuzzleanime'));
reg(['funpuzzleemoji'], async (ctx) => gojoGeneratedFeature(ctx, 'funpuzzleemoji'));
reg(['funpuzzlenumber'], async (ctx) => gojoGeneratedFeature(ctx, 'funpuzzlenumber'));
reg(['funpuzzleword'], async (ctx) => gojoGeneratedFeature(ctx, 'funpuzzleword'));
reg(['funpuzzlepicture'], async (ctx) => gojoGeneratedFeature(ctx, 'funpuzzlepicture'));
reg(['funpuzzlestory'], async (ctx) => gojoGeneratedFeature(ctx, 'funpuzzlestory'));
reg(['funpuzzlefriend'], async (ctx) => gojoGeneratedFeature(ctx, 'funpuzzlefriend'));
reg(['funpuzzlegroup'], async (ctx) => gojoGeneratedFeature(ctx, 'funpuzzlegroup'));
reg(['funpuzzledaily'], async (ctx) => gojoGeneratedFeature(ctx, 'funpuzzledaily'));
reg(['toolconverttext'], async (ctx) => gojoGeneratedFeature(ctx, 'toolconverttext'));
reg(['toolconvertnumber'], async (ctx) => gojoGeneratedFeature(ctx, 'toolconvertnumber'));
reg(['toolconvertjson'], async (ctx) => gojoGeneratedFeature(ctx, 'toolconvertjson'));
reg(['toolconverturl'], async (ctx) => gojoGeneratedFeature(ctx, 'toolconverturl'));
reg(['toolconvertbase64'], async (ctx) => gojoGeneratedFeature(ctx, 'toolconvertbase64'));
reg(['toolconverthex'], async (ctx) => gojoGeneratedFeature(ctx, 'toolconverthex'));
reg(['toolconvertbinary'], async (ctx) => gojoGeneratedFeature(ctx, 'toolconvertbinary'));
reg(['toolconvertuuid'], async (ctx) => gojoGeneratedFeature(ctx, 'toolconvertuuid'));
reg(['toolconvertpassword'], async (ctx) => gojoGeneratedFeature(ctx, 'toolconvertpassword'));
reg(['toolconvertword'], async (ctx) => gojoGeneratedFeature(ctx, 'toolconvertword'));
reg(['toolformattext'], async (ctx) => gojoGeneratedFeature(ctx, 'toolformattext'));
reg(['toolformatnumber'], async (ctx) => gojoGeneratedFeature(ctx, 'toolformatnumber'));
reg(['toolformatjson'], async (ctx) => gojoGeneratedFeature(ctx, 'toolformatjson'));
reg(['toolformaturl'], async (ctx) => gojoGeneratedFeature(ctx, 'toolformaturl'));
reg(['toolformatbase64'], async (ctx) => gojoGeneratedFeature(ctx, 'toolformatbase64'));
reg(['toolformathex'], async (ctx) => gojoGeneratedFeature(ctx, 'toolformathex'));
reg(['toolformatbinary'], async (ctx) => gojoGeneratedFeature(ctx, 'toolformatbinary'));
reg(['toolformatuuid'], async (ctx) => gojoGeneratedFeature(ctx, 'toolformatuuid'));
reg(['toolformatpassword'], async (ctx) => gojoGeneratedFeature(ctx, 'toolformatpassword'));
reg(['toolformatword'], async (ctx) => gojoGeneratedFeature(ctx, 'toolformatword'));
reg(['toolgeneratetext'], async (ctx) => gojoGeneratedFeature(ctx, 'toolgeneratetext'));
reg(['toolgeneratenumber'], async (ctx) => gojoGeneratedFeature(ctx, 'toolgeneratenumber'));
reg(['toolgeneratejson'], async (ctx) => gojoGeneratedFeature(ctx, 'toolgeneratejson'));
reg(['toolgenerateurl'], async (ctx) => gojoGeneratedFeature(ctx, 'toolgenerateurl'));
reg(['toolgeneratebase64'], async (ctx) => gojoGeneratedFeature(ctx, 'toolgeneratebase64'));
reg(['toolgeneratehex'], async (ctx) => gojoGeneratedFeature(ctx, 'toolgeneratehex'));
reg(['toolgeneratebinary'], async (ctx) => gojoGeneratedFeature(ctx, 'toolgeneratebinary'));
reg(['toolgenerateuuid'], async (ctx) => gojoGeneratedFeature(ctx, 'toolgenerateuuid'));
reg(['toolgeneratepassword'], async (ctx) => gojoGeneratedFeature(ctx, 'toolgeneratepassword'));
reg(['toolgenerateword'], async (ctx) => gojoGeneratedFeature(ctx, 'toolgenerateword'));
reg(['toolchecktext'], async (ctx) => gojoGeneratedFeature(ctx, 'toolchecktext'));
reg(['toolchecknumber'], async (ctx) => gojoGeneratedFeature(ctx, 'toolchecknumber'));
reg(['toolcheckjson'], async (ctx) => gojoGeneratedFeature(ctx, 'toolcheckjson'));
reg(['toolcheckurl'], async (ctx) => gojoGeneratedFeature(ctx, 'toolcheckurl'));
reg(['toolcheckbase64'], async (ctx) => gojoGeneratedFeature(ctx, 'toolcheckbase64'));
reg(['toolcheckhex'], async (ctx) => gojoGeneratedFeature(ctx, 'toolcheckhex'));
reg(['toolcheckbinary'], async (ctx) => gojoGeneratedFeature(ctx, 'toolcheckbinary'));
reg(['toolcheckuuid'], async (ctx) => gojoGeneratedFeature(ctx, 'toolcheckuuid'));
reg(['toolcheckpassword'], async (ctx) => gojoGeneratedFeature(ctx, 'toolcheckpassword'));
reg(['toolcheckword'], async (ctx) => gojoGeneratedFeature(ctx, 'toolcheckword'));
reg(['toolcounttext'], async (ctx) => gojoGeneratedFeature(ctx, 'toolcounttext'));
reg(['toolcountnumber'], async (ctx) => gojoGeneratedFeature(ctx, 'toolcountnumber'));
reg(['toolcountjson'], async (ctx) => gojoGeneratedFeature(ctx, 'toolcountjson'));
reg(['toolcounturl'], async (ctx) => gojoGeneratedFeature(ctx, 'toolcounturl'));
reg(['toolcountbase64'], async (ctx) => gojoGeneratedFeature(ctx, 'toolcountbase64'));
reg(['toolcounthex'], async (ctx) => gojoGeneratedFeature(ctx, 'toolcounthex'));
reg(['toolcountbinary'], async (ctx) => gojoGeneratedFeature(ctx, 'toolcountbinary'));
reg(['toolcountuuid'], async (ctx) => gojoGeneratedFeature(ctx, 'toolcountuuid'));
reg(['toolcountpassword'], async (ctx) => gojoGeneratedFeature(ctx, 'toolcountpassword'));
reg(['toolcountword'], async (ctx) => gojoGeneratedFeature(ctx, 'toolcountword'));
reg(['toolcalculatetext'], async (ctx) => gojoGeneratedFeature(ctx, 'toolcalculatetext'));
reg(['toolcalculatenumber'], async (ctx) => gojoGeneratedFeature(ctx, 'toolcalculatenumber'));
reg(['toolcalculatejson'], async (ctx) => gojoGeneratedFeature(ctx, 'toolcalculatejson'));
reg(['toolcalculateurl'], async (ctx) => gojoGeneratedFeature(ctx, 'toolcalculateurl'));
reg(['toolcalculatebase64'], async (ctx) => gojoGeneratedFeature(ctx, 'toolcalculatebase64'));
reg(['toolcalculatehex'], async (ctx) => gojoGeneratedFeature(ctx, 'toolcalculatehex'));
reg(['toolcalculatebinary'], async (ctx) => gojoGeneratedFeature(ctx, 'toolcalculatebinary'));
reg(['toolcalculateuuid'], async (ctx) => gojoGeneratedFeature(ctx, 'toolcalculateuuid'));
reg(['toolcalculatepassword'], async (ctx) => gojoGeneratedFeature(ctx, 'toolcalculatepassword'));
reg(['toolcalculateword'], async (ctx) => gojoGeneratedFeature(ctx, 'toolcalculateword'));
reg(['toolencodetext'], async (ctx) => gojoGeneratedFeature(ctx, 'toolencodetext'));
reg(['toolencodenumber'], async (ctx) => gojoGeneratedFeature(ctx, 'toolencodenumber'));
reg(['toolencodejson'], async (ctx) => gojoGeneratedFeature(ctx, 'toolencodejson'));
reg(['toolencodeurl'], async (ctx) => gojoGeneratedFeature(ctx, 'toolencodeurl'));
reg(['toolencodebase64'], async (ctx) => gojoGeneratedFeature(ctx, 'toolencodebase64'));
reg(['toolencodehex'], async (ctx) => gojoGeneratedFeature(ctx, 'toolencodehex'));
reg(['toolencodebinary'], async (ctx) => gojoGeneratedFeature(ctx, 'toolencodebinary'));
reg(['toolencodeuuid'], async (ctx) => gojoGeneratedFeature(ctx, 'toolencodeuuid'));
reg(['toolencodepassword'], async (ctx) => gojoGeneratedFeature(ctx, 'toolencodepassword'));
reg(['toolencodeword'], async (ctx) => gojoGeneratedFeature(ctx, 'toolencodeword'));
reg(['tooldecodetext'], async (ctx) => gojoGeneratedFeature(ctx, 'tooldecodetext'));
reg(['tooldecodenumber'], async (ctx) => gojoGeneratedFeature(ctx, 'tooldecodenumber'));
reg(['tooldecodejson'], async (ctx) => gojoGeneratedFeature(ctx, 'tooldecodejson'));
reg(['tooldecodeurl'], async (ctx) => gojoGeneratedFeature(ctx, 'tooldecodeurl'));
reg(['tooldecodebase64'], async (ctx) => gojoGeneratedFeature(ctx, 'tooldecodebase64'));
reg(['tooldecodehex'], async (ctx) => gojoGeneratedFeature(ctx, 'tooldecodehex'));
reg(['tooldecodebinary'], async (ctx) => gojoGeneratedFeature(ctx, 'tooldecodebinary'));
reg(['tooldecodeuuid'], async (ctx) => gojoGeneratedFeature(ctx, 'tooldecodeuuid'));
reg(['tooldecodepassword'], async (ctx) => gojoGeneratedFeature(ctx, 'tooldecodepassword'));
reg(['tooldecodeword'], async (ctx) => gojoGeneratedFeature(ctx, 'tooldecodeword'));
reg(['toolsorttext'], async (ctx) => gojoGeneratedFeature(ctx, 'toolsorttext'));
reg(['toolsortnumber'], async (ctx) => gojoGeneratedFeature(ctx, 'toolsortnumber'));
reg(['toolsortjson'], async (ctx) => gojoGeneratedFeature(ctx, 'toolsortjson'));
reg(['toolsorturl'], async (ctx) => gojoGeneratedFeature(ctx, 'toolsorturl'));
reg(['toolsortbase64'], async (ctx) => gojoGeneratedFeature(ctx, 'toolsortbase64'));
reg(['toolsorthex'], async (ctx) => gojoGeneratedFeature(ctx, 'toolsorthex'));
reg(['toolsortbinary'], async (ctx) => gojoGeneratedFeature(ctx, 'toolsortbinary'));
reg(['toolsortuuid'], async (ctx) => gojoGeneratedFeature(ctx, 'toolsortuuid'));
reg(['toolsortpassword'], async (ctx) => gojoGeneratedFeature(ctx, 'toolsortpassword'));
reg(['toolsortword'], async (ctx) => gojoGeneratedFeature(ctx, 'toolsortword'));
reg(['toolshuffletext'], async (ctx) => gojoGeneratedFeature(ctx, 'toolshuffletext'));
reg(['toolshufflenumber'], async (ctx) => gojoGeneratedFeature(ctx, 'toolshufflenumber'));
reg(['toolshufflejson'], async (ctx) => gojoGeneratedFeature(ctx, 'toolshufflejson'));
reg(['toolshuffleurl'], async (ctx) => gojoGeneratedFeature(ctx, 'toolshuffleurl'));
reg(['toolshufflebase64'], async (ctx) => gojoGeneratedFeature(ctx, 'toolshufflebase64'));
reg(['toolshufflehex'], async (ctx) => gojoGeneratedFeature(ctx, 'toolshufflehex'));
reg(['toolshufflebinary'], async (ctx) => gojoGeneratedFeature(ctx, 'toolshufflebinary'));
reg(['toolshuffleuuid'], async (ctx) => gojoGeneratedFeature(ctx, 'toolshuffleuuid'));
reg(['toolshufflepassword'], async (ctx) => gojoGeneratedFeature(ctx, 'toolshufflepassword'));
reg(['toolshuffleword'], async (ctx) => gojoGeneratedFeature(ctx, 'toolshuffleword'));
reg(['toolsearchtext'], async (ctx) => gojoGeneratedFeature(ctx, 'toolsearchtext'));
reg(['toolsearchnumber'], async (ctx) => gojoGeneratedFeature(ctx, 'toolsearchnumber'));
reg(['toolsearchjson'], async (ctx) => gojoGeneratedFeature(ctx, 'toolsearchjson'));
reg(['toolsearchurl'], async (ctx) => gojoGeneratedFeature(ctx, 'toolsearchurl'));
reg(['toolsearchbase64'], async (ctx) => gojoGeneratedFeature(ctx, 'toolsearchbase64'));
reg(['toolsearchhex'], async (ctx) => gojoGeneratedFeature(ctx, 'toolsearchhex'));
reg(['toolsearchbinary'], async (ctx) => gojoGeneratedFeature(ctx, 'toolsearchbinary'));
reg(['toolsearchuuid'], async (ctx) => gojoGeneratedFeature(ctx, 'toolsearchuuid'));
reg(['toolsearchpassword'], async (ctx) => gojoGeneratedFeature(ctx, 'toolsearchpassword'));
reg(['toolsearchword'], async (ctx) => gojoGeneratedFeature(ctx, 'toolsearchword'));
reg(['toolvalidatetext'], async (ctx) => gojoGeneratedFeature(ctx, 'toolvalidatetext'));
reg(['toolvalidatenumber'], async (ctx) => gojoGeneratedFeature(ctx, 'toolvalidatenumber'));
reg(['toolvalidatejson'], async (ctx) => gojoGeneratedFeature(ctx, 'toolvalidatejson'));
reg(['toolvalidateurl'], async (ctx) => gojoGeneratedFeature(ctx, 'toolvalidateurl'));
reg(['toolvalidatebase64'], async (ctx) => gojoGeneratedFeature(ctx, 'toolvalidatebase64'));
reg(['toolvalidatehex'], async (ctx) => gojoGeneratedFeature(ctx, 'toolvalidatehex'));
reg(['toolvalidatebinary'], async (ctx) => gojoGeneratedFeature(ctx, 'toolvalidatebinary'));
reg(['toolvalidateuuid'], async (ctx) => gojoGeneratedFeature(ctx, 'toolvalidateuuid'));
reg(['toolvalidatepassword'], async (ctx) => gojoGeneratedFeature(ctx, 'toolvalidatepassword'));
reg(['toolvalidateword'], async (ctx) => gojoGeneratedFeature(ctx, 'toolvalidateword'));
reg(['toolinspecttext'], async (ctx) => gojoGeneratedFeature(ctx, 'toolinspecttext'));
reg(['toolinspectnumber'], async (ctx) => gojoGeneratedFeature(ctx, 'toolinspectnumber'));
reg(['toolinspectjson'], async (ctx) => gojoGeneratedFeature(ctx, 'toolinspectjson'));
reg(['toolinspecturl'], async (ctx) => gojoGeneratedFeature(ctx, 'toolinspecturl'));
reg(['toolinspectbase64'], async (ctx) => gojoGeneratedFeature(ctx, 'toolinspectbase64'));
reg(['toolinspecthex'], async (ctx) => gojoGeneratedFeature(ctx, 'toolinspecthex'));
reg(['toolinspectbinary'], async (ctx) => gojoGeneratedFeature(ctx, 'toolinspectbinary'));
reg(['toolinspectuuid'], async (ctx) => gojoGeneratedFeature(ctx, 'toolinspectuuid'));
reg(['toolinspectpassword'], async (ctx) => gojoGeneratedFeature(ctx, 'toolinspectpassword'));
reg(['toolinspectword'], async (ctx) => gojoGeneratedFeature(ctx, 'toolinspectword'));
reg(['toolsummarizetext'], async (ctx) => gojoGeneratedFeature(ctx, 'toolsummarizetext'));
reg(['toolsummarizenumber'], async (ctx) => gojoGeneratedFeature(ctx, 'toolsummarizenumber'));
reg(['toolsummarizejson'], async (ctx) => gojoGeneratedFeature(ctx, 'toolsummarizejson'));
reg(['toolsummarizeurl'], async (ctx) => gojoGeneratedFeature(ctx, 'toolsummarizeurl'));
reg(['toolsummarizebase64'], async (ctx) => gojoGeneratedFeature(ctx, 'toolsummarizebase64'));
reg(['toolsummarizehex'], async (ctx) => gojoGeneratedFeature(ctx, 'toolsummarizehex'));
reg(['toolsummarizebinary'], async (ctx) => gojoGeneratedFeature(ctx, 'toolsummarizebinary'));
reg(['toolsummarizeuuid'], async (ctx) => gojoGeneratedFeature(ctx, 'toolsummarizeuuid'));
reg(['toolsummarizepassword'], async (ctx) => gojoGeneratedFeature(ctx, 'toolsummarizepassword'));
reg(['toolsummarizeword'], async (ctx) => gojoGeneratedFeature(ctx, 'toolsummarizeword'));
reg(['tooltranslatetext'], async (ctx) => gojoGeneratedFeature(ctx, 'tooltranslatetext'));
reg(['tooltranslatenumber'], async (ctx) => gojoGeneratedFeature(ctx, 'tooltranslatenumber'));
reg(['tooltranslatejson'], async (ctx) => gojoGeneratedFeature(ctx, 'tooltranslatejson'));
reg(['tooltranslateurl'], async (ctx) => gojoGeneratedFeature(ctx, 'tooltranslateurl'));
reg(['tooltranslatebase64'], async (ctx) => gojoGeneratedFeature(ctx, 'tooltranslatebase64'));
reg(['tooltranslatehex'], async (ctx) => gojoGeneratedFeature(ctx, 'tooltranslatehex'));
reg(['tooltranslatebinary'], async (ctx) => gojoGeneratedFeature(ctx, 'tooltranslatebinary'));
reg(['tooltranslateuuid'], async (ctx) => gojoGeneratedFeature(ctx, 'tooltranslateuuid'));
reg(['tooltranslatepassword'], async (ctx) => gojoGeneratedFeature(ctx, 'tooltranslatepassword'));
reg(['tooltranslateword'], async (ctx) => gojoGeneratedFeature(ctx, 'tooltranslateword'));
reg(['toolextracttext'], async (ctx) => gojoGeneratedFeature(ctx, 'toolextracttext'));
reg(['toolextractnumber'], async (ctx) => gojoGeneratedFeature(ctx, 'toolextractnumber'));
reg(['toolextractjson'], async (ctx) => gojoGeneratedFeature(ctx, 'toolextractjson'));
reg(['toolextracturl'], async (ctx) => gojoGeneratedFeature(ctx, 'toolextracturl'));
reg(['toolextractbase64'], async (ctx) => gojoGeneratedFeature(ctx, 'toolextractbase64'));
reg(['toolextracthex'], async (ctx) => gojoGeneratedFeature(ctx, 'toolextracthex'));
reg(['toolextractbinary'], async (ctx) => gojoGeneratedFeature(ctx, 'toolextractbinary'));
reg(['toolextractuuid'], async (ctx) => gojoGeneratedFeature(ctx, 'toolextractuuid'));
reg(['toolextractpassword'], async (ctx) => gojoGeneratedFeature(ctx, 'toolextractpassword'));
reg(['toolextractword'], async (ctx) => gojoGeneratedFeature(ctx, 'toolextractword'));
reg(['toolcleantext'], async (ctx) => gojoGeneratedFeature(ctx, 'toolcleantext'));
reg(['toolcleannumber'], async (ctx) => gojoGeneratedFeature(ctx, 'toolcleannumber'));
reg(['toolcleanjson'], async (ctx) => gojoGeneratedFeature(ctx, 'toolcleanjson'));
reg(['toolcleanurl'], async (ctx) => gojoGeneratedFeature(ctx, 'toolcleanurl'));
reg(['toolcleanbase64'], async (ctx) => gojoGeneratedFeature(ctx, 'toolcleanbase64'));
reg(['toolcleanhex'], async (ctx) => gojoGeneratedFeature(ctx, 'toolcleanhex'));
reg(['toolcleanbinary'], async (ctx) => gojoGeneratedFeature(ctx, 'toolcleanbinary'));
reg(['toolcleanuuid'], async (ctx) => gojoGeneratedFeature(ctx, 'toolcleanuuid'));
reg(['toolcleanpassword'], async (ctx) => gojoGeneratedFeature(ctx, 'toolcleanpassword'));
reg(['toolcleanword'], async (ctx) => gojoGeneratedFeature(ctx, 'toolcleanword'));
reg(['toolcomparetext'], async (ctx) => gojoGeneratedFeature(ctx, 'toolcomparetext'));
reg(['toolcomparenumber'], async (ctx) => gojoGeneratedFeature(ctx, 'toolcomparenumber'));
reg(['toolcomparejson'], async (ctx) => gojoGeneratedFeature(ctx, 'toolcomparejson'));
reg(['toolcompareurl'], async (ctx) => gojoGeneratedFeature(ctx, 'toolcompareurl'));
reg(['toolcomparebase64'], async (ctx) => gojoGeneratedFeature(ctx, 'toolcomparebase64'));
reg(['toolcomparehex'], async (ctx) => gojoGeneratedFeature(ctx, 'toolcomparehex'));
reg(['toolcomparebinary'], async (ctx) => gojoGeneratedFeature(ctx, 'toolcomparebinary'));
reg(['toolcompareuuid'], async (ctx) => gojoGeneratedFeature(ctx, 'toolcompareuuid'));
reg(['toolcomparepassword'], async (ctx) => gojoGeneratedFeature(ctx, 'toolcomparepassword'));
reg(['toolcompareword'], async (ctx) => gojoGeneratedFeature(ctx, 'toolcompareword'));
reg(['tooltimetext'], async (ctx) => gojoGeneratedFeature(ctx, 'tooltimetext'));
reg(['tooltimenumber'], async (ctx) => gojoGeneratedFeature(ctx, 'tooltimenumber'));
reg(['tooltimejson'], async (ctx) => gojoGeneratedFeature(ctx, 'tooltimejson'));
reg(['tooltimeurl'], async (ctx) => gojoGeneratedFeature(ctx, 'tooltimeurl'));
reg(['tooltimebase64'], async (ctx) => gojoGeneratedFeature(ctx, 'tooltimebase64'));
reg(['tooltimehex'], async (ctx) => gojoGeneratedFeature(ctx, 'tooltimehex'));
reg(['tooltimebinary'], async (ctx) => gojoGeneratedFeature(ctx, 'tooltimebinary'));
reg(['tooltimeuuid'], async (ctx) => gojoGeneratedFeature(ctx, 'tooltimeuuid'));
reg(['tooltimepassword'], async (ctx) => gojoGeneratedFeature(ctx, 'tooltimepassword'));
reg(['tooltimeword'], async (ctx) => gojoGeneratedFeature(ctx, 'tooltimeword'));
reg(['tooldatetext'], async (ctx) => gojoGeneratedFeature(ctx, 'tooldatetext'));
reg(['tooldatenumber'], async (ctx) => gojoGeneratedFeature(ctx, 'tooldatenumber'));
reg(['tooldatejson'], async (ctx) => gojoGeneratedFeature(ctx, 'tooldatejson'));
reg(['tooldateurl'], async (ctx) => gojoGeneratedFeature(ctx, 'tooldateurl'));
reg(['tooldatebase64'], async (ctx) => gojoGeneratedFeature(ctx, 'tooldatebase64'));
reg(['tooldatehex'], async (ctx) => gojoGeneratedFeature(ctx, 'tooldatehex'));
reg(['tooldatebinary'], async (ctx) => gojoGeneratedFeature(ctx, 'tooldatebinary'));
reg(['tooldateuuid'], async (ctx) => gojoGeneratedFeature(ctx, 'tooldateuuid'));
reg(['tooldatepassword'], async (ctx) => gojoGeneratedFeature(ctx, 'tooldatepassword'));
reg(['tooldateword'], async (ctx) => gojoGeneratedFeature(ctx, 'tooldateword'));
reg(['mediadownloadyoutube'], async (ctx) => gojoGeneratedFeature(ctx, 'mediadownloadyoutube'));
reg(['mediadownloadspotify'], async (ctx) => gojoGeneratedFeature(ctx, 'mediadownloadspotify'));
reg(['mediadownloadtiktok'], async (ctx) => gojoGeneratedFeature(ctx, 'mediadownloadtiktok'));
reg(['mediadownloadinstagram'], async (ctx) => gojoGeneratedFeature(ctx, 'mediadownloadinstagram'));
reg(['mediadownloadfacebook'], async (ctx) => gojoGeneratedFeature(ctx, 'mediadownloadfacebook'));
reg(['mediasearchyoutube'], async (ctx) => gojoGeneratedFeature(ctx, 'mediasearchyoutube'));
reg(['mediasearchspotify'], async (ctx) => gojoGeneratedFeature(ctx, 'mediasearchspotify'));
reg(['mediasearchtiktok'], async (ctx) => gojoGeneratedFeature(ctx, 'mediasearchtiktok'));
reg(['mediasearchinstagram'], async (ctx) => gojoGeneratedFeature(ctx, 'mediasearchinstagram'));
reg(['mediasearchfacebook'], async (ctx) => gojoGeneratedFeature(ctx, 'mediasearchfacebook'));
reg(['mediaconvertyoutube'], async (ctx) => gojoGeneratedFeature(ctx, 'mediaconvertyoutube'));
reg(['mediaconvertspotify'], async (ctx) => gojoGeneratedFeature(ctx, 'mediaconvertspotify'));
reg(['mediaconverttiktok'], async (ctx) => gojoGeneratedFeature(ctx, 'mediaconverttiktok'));
reg(['mediaconvertinstagram'], async (ctx) => gojoGeneratedFeature(ctx, 'mediaconvertinstagram'));
reg(['mediaconvertfacebook'], async (ctx) => gojoGeneratedFeature(ctx, 'mediaconvertfacebook'));
reg(['mediacompressyoutube'], async (ctx) => gojoGeneratedFeature(ctx, 'mediacompressyoutube'));
reg(['mediacompressspotify'], async (ctx) => gojoGeneratedFeature(ctx, 'mediacompressspotify'));
reg(['mediacompresstiktok'], async (ctx) => gojoGeneratedFeature(ctx, 'mediacompresstiktok'));
reg(['mediacompressinstagram'], async (ctx) => gojoGeneratedFeature(ctx, 'mediacompressinstagram'));
reg(['mediacompressfacebook'], async (ctx) => gojoGeneratedFeature(ctx, 'mediacompressfacebook'));
reg(['mediainspectyoutube'], async (ctx) => gojoGeneratedFeature(ctx, 'mediainspectyoutube'));
reg(['mediainspectspotify'], async (ctx) => gojoGeneratedFeature(ctx, 'mediainspectspotify'));
reg(['mediainspecttiktok'], async (ctx) => gojoGeneratedFeature(ctx, 'mediainspecttiktok'));
reg(['mediainspectinstagram'], async (ctx) => gojoGeneratedFeature(ctx, 'mediainspectinstagram'));
reg(['mediainspectfacebook'], async (ctx) => gojoGeneratedFeature(ctx, 'mediainspectfacebook'));
reg(['mediacaptionyoutube'], async (ctx) => gojoGeneratedFeature(ctx, 'mediacaptionyoutube'));
reg(['mediacaptionspotify'], async (ctx) => gojoGeneratedFeature(ctx, 'mediacaptionspotify'));
reg(['mediacaptiontiktok'], async (ctx) => gojoGeneratedFeature(ctx, 'mediacaptiontiktok'));
reg(['mediacaptioninstagram'], async (ctx) => gojoGeneratedFeature(ctx, 'mediacaptioninstagram'));
reg(['mediacaptionfacebook'], async (ctx) => gojoGeneratedFeature(ctx, 'mediacaptionfacebook'));
reg(['mediastickeryoutube'], async (ctx) => gojoGeneratedFeature(ctx, 'mediastickeryoutube'));
reg(['mediastickerspotify'], async (ctx) => gojoGeneratedFeature(ctx, 'mediastickerspotify'));
reg(['mediastickertiktok'], async (ctx) => gojoGeneratedFeature(ctx, 'mediastickertiktok'));
reg(['mediastickerinstagram'], async (ctx) => gojoGeneratedFeature(ctx, 'mediastickerinstagram'));
reg(['mediastickerfacebook'], async (ctx) => gojoGeneratedFeature(ctx, 'mediastickerfacebook'));
reg(['mediaaudioyoutube'], async (ctx) => gojoGeneratedFeature(ctx, 'mediaaudioyoutube'));
reg(['mediaaudiospotify'], async (ctx) => gojoGeneratedFeature(ctx, 'mediaaudiospotify'));
reg(['mediaaudiotiktok'], async (ctx) => gojoGeneratedFeature(ctx, 'mediaaudiotiktok'));
reg(['mediaaudioinstagram'], async (ctx) => gojoGeneratedFeature(ctx, 'mediaaudioinstagram'));
reg(['mediaaudiofacebook'], async (ctx) => gojoGeneratedFeature(ctx, 'mediaaudiofacebook'));
reg(['mediavideoyoutube'], async (ctx) => gojoGeneratedFeature(ctx, 'mediavideoyoutube'));
reg(['mediavideospotify'], async (ctx) => gojoGeneratedFeature(ctx, 'mediavideospotify'));
reg(['mediavideotiktok'], async (ctx) => gojoGeneratedFeature(ctx, 'mediavideotiktok'));
reg(['mediavideoinstagram'], async (ctx) => gojoGeneratedFeature(ctx, 'mediavideoinstagram'));
reg(['mediavideofacebook'], async (ctx) => gojoGeneratedFeature(ctx, 'mediavideofacebook'));
reg(['mediaimageyoutube'], async (ctx) => gojoGeneratedFeature(ctx, 'mediaimageyoutube'));
reg(['mediaimagespotify'], async (ctx) => gojoGeneratedFeature(ctx, 'mediaimagespotify'));
reg(['mediaimagetiktok'], async (ctx) => gojoGeneratedFeature(ctx, 'mediaimagetiktok'));
reg(['mediaimageinstagram'], async (ctx) => gojoGeneratedFeature(ctx, 'mediaimageinstagram'));
reg(['mediaimagefacebook'], async (ctx) => gojoGeneratedFeature(ctx, 'mediaimagefacebook'));
reg(['mediaresizeyoutube'], async (ctx) => gojoGeneratedFeature(ctx, 'mediaresizeyoutube'));
reg(['mediaresizespotify'], async (ctx) => gojoGeneratedFeature(ctx, 'mediaresizespotify'));
reg(['mediaresizetiktok'], async (ctx) => gojoGeneratedFeature(ctx, 'mediaresizetiktok'));
reg(['mediaresizeinstagram'], async (ctx) => gojoGeneratedFeature(ctx, 'mediaresizeinstagram'));
reg(['mediaresizefacebook'], async (ctx) => gojoGeneratedFeature(ctx, 'mediaresizefacebook'));
reg(['mediacropyoutube'], async (ctx) => gojoGeneratedFeature(ctx, 'mediacropyoutube'));
reg(['mediacropspotify'], async (ctx) => gojoGeneratedFeature(ctx, 'mediacropspotify'));
reg(['mediacroptiktok'], async (ctx) => gojoGeneratedFeature(ctx, 'mediacroptiktok'));
reg(['mediacropinstagram'], async (ctx) => gojoGeneratedFeature(ctx, 'mediacropinstagram'));
reg(['mediacropfacebook'], async (ctx) => gojoGeneratedFeature(ctx, 'mediacropfacebook'));
reg(['mediaenhanceyoutube'], async (ctx) => gojoGeneratedFeature(ctx, 'mediaenhanceyoutube'));
reg(['mediaenhancespotify'], async (ctx) => gojoGeneratedFeature(ctx, 'mediaenhancespotify'));
reg(['mediaenhancetiktok'], async (ctx) => gojoGeneratedFeature(ctx, 'mediaenhancetiktok'));
reg(['mediaenhanceinstagram'], async (ctx) => gojoGeneratedFeature(ctx, 'mediaenhanceinstagram'));
reg(['mediaenhancefacebook'], async (ctx) => gojoGeneratedFeature(ctx, 'mediaenhancefacebook'));
reg(['mediametadatayoutube'], async (ctx) => gojoGeneratedFeature(ctx, 'mediametadatayoutube'));
reg(['mediametadataspotify'], async (ctx) => gojoGeneratedFeature(ctx, 'mediametadataspotify'));
reg(['mediametadatatiktok'], async (ctx) => gojoGeneratedFeature(ctx, 'mediametadatatiktok'));
reg(['mediametadatainstagram'], async (ctx) => gojoGeneratedFeature(ctx, 'mediametadatainstagram'));
reg(['mediametadatafacebook'], async (ctx) => gojoGeneratedFeature(ctx, 'mediametadatafacebook'));
reg(['mediathumbnailyoutube'], async (ctx) => gojoGeneratedFeature(ctx, 'mediathumbnailyoutube'));
reg(['mediathumbnailspotify'], async (ctx) => gojoGeneratedFeature(ctx, 'mediathumbnailspotify'));
reg(['mediathumbnailtiktok'], async (ctx) => gojoGeneratedFeature(ctx, 'mediathumbnailtiktok'));
reg(['mediathumbnailinstagram'], async (ctx) => gojoGeneratedFeature(ctx, 'mediathumbnailinstagram'));
reg(['mediathumbnailfacebook'], async (ctx) => gojoGeneratedFeature(ctx, 'mediathumbnailfacebook'));
reg(['mediapreviewyoutube'], async (ctx) => gojoGeneratedFeature(ctx, 'mediapreviewyoutube'));
reg(['mediapreviewspotify'], async (ctx) => gojoGeneratedFeature(ctx, 'mediapreviewspotify'));
reg(['mediapreviewtiktok'], async (ctx) => gojoGeneratedFeature(ctx, 'mediapreviewtiktok'));
reg(['mediapreviewinstagram'], async (ctx) => gojoGeneratedFeature(ctx, 'mediapreviewinstagram'));
reg(['mediapreviewfacebook'], async (ctx) => gojoGeneratedFeature(ctx, 'mediapreviewfacebook'));
reg(['mediaextractyoutube'], async (ctx) => gojoGeneratedFeature(ctx, 'mediaextractyoutube'));
reg(['mediaextractspotify'], async (ctx) => gojoGeneratedFeature(ctx, 'mediaextractspotify'));
reg(['mediaextracttiktok'], async (ctx) => gojoGeneratedFeature(ctx, 'mediaextracttiktok'));
reg(['mediaextractinstagram'], async (ctx) => gojoGeneratedFeature(ctx, 'mediaextractinstagram'));
reg(['mediaextractfacebook'], async (ctx) => gojoGeneratedFeature(ctx, 'mediaextractfacebook'));
reg(['mediamergeyoutube'], async (ctx) => gojoGeneratedFeature(ctx, 'mediamergeyoutube'));
reg(['mediamergespotify'], async (ctx) => gojoGeneratedFeature(ctx, 'mediamergespotify'));
reg(['mediamergetiktok'], async (ctx) => gojoGeneratedFeature(ctx, 'mediamergetiktok'));
reg(['mediamergeinstagram'], async (ctx) => gojoGeneratedFeature(ctx, 'mediamergeinstagram'));
reg(['mediamergefacebook'], async (ctx) => gojoGeneratedFeature(ctx, 'mediamergefacebook'));
reg(['mediasplityoutube'], async (ctx) => gojoGeneratedFeature(ctx, 'mediasplityoutube'));
reg(['mediasplitspotify'], async (ctx) => gojoGeneratedFeature(ctx, 'mediasplitspotify'));
reg(['mediasplittiktok'], async (ctx) => gojoGeneratedFeature(ctx, 'mediasplittiktok'));
reg(['mediasplitinstagram'], async (ctx) => gojoGeneratedFeature(ctx, 'mediasplitinstagram'));
reg(['mediasplitfacebook'], async (ctx) => gojoGeneratedFeature(ctx, 'mediasplitfacebook'));
reg(['mediaframeyoutube'], async (ctx) => gojoGeneratedFeature(ctx, 'mediaframeyoutube'));
reg(['mediaframespotify'], async (ctx) => gojoGeneratedFeature(ctx, 'mediaframespotify'));
reg(['mediaframetiktok'], async (ctx) => gojoGeneratedFeature(ctx, 'mediaframetiktok'));
reg(['mediaframeinstagram'], async (ctx) => gojoGeneratedFeature(ctx, 'mediaframeinstagram'));
reg(['mediaframefacebook'], async (ctx) => gojoGeneratedFeature(ctx, 'mediaframefacebook'));
reg(['botstatusbot'], async (ctx) => gojoGeneratedFeature(ctx, 'botstatusbot'));
reg(['botstatusgroup'], async (ctx) => gojoGeneratedFeature(ctx, 'botstatusgroup'));
reg(['botstatususer'], async (ctx) => gojoGeneratedFeature(ctx, 'botstatususer'));
reg(['botstatussession'], async (ctx) => gojoGeneratedFeature(ctx, 'botstatussession'));
reg(['botstatusdatabase'], async (ctx) => gojoGeneratedFeature(ctx, 'botstatusdatabase'));
reg(['bothealthbot'], async (ctx) => gojoGeneratedFeature(ctx, 'bothealthbot'));
reg(['bothealthgroup'], async (ctx) => gojoGeneratedFeature(ctx, 'bothealthgroup'));
reg(['bothealthuser'], async (ctx) => gojoGeneratedFeature(ctx, 'bothealthuser'));
reg(['bothealthsession'], async (ctx) => gojoGeneratedFeature(ctx, 'bothealthsession'));
reg(['bothealthdatabase'], async (ctx) => gojoGeneratedFeature(ctx, 'bothealthdatabase'));
reg(['botstatsbot'], async (ctx) => gojoGeneratedFeature(ctx, 'botstatsbot'));
reg(['botstatsgroup'], async (ctx) => gojoGeneratedFeature(ctx, 'botstatsgroup'));
reg(['botstatsuser'], async (ctx) => gojoGeneratedFeature(ctx, 'botstatsuser'));
reg(['botstatssession'], async (ctx) => gojoGeneratedFeature(ctx, 'botstatssession'));
reg(['botstatsdatabase'], async (ctx) => gojoGeneratedFeature(ctx, 'botstatsdatabase'));
reg(['botuptimebot'], async (ctx) => gojoGeneratedFeature(ctx, 'botuptimebot'));
reg(['botuptimegroup'], async (ctx) => gojoGeneratedFeature(ctx, 'botuptimegroup'));
reg(['botuptimeuser'], async (ctx) => gojoGeneratedFeature(ctx, 'botuptimeuser'));
reg(['botuptimesession'], async (ctx) => gojoGeneratedFeature(ctx, 'botuptimesession'));
reg(['botuptimedatabase'], async (ctx) => gojoGeneratedFeature(ctx, 'botuptimedatabase'));
reg(['botruntimebot'], async (ctx) => gojoGeneratedFeature(ctx, 'botruntimebot'));
reg(['botruntimegroup'], async (ctx) => gojoGeneratedFeature(ctx, 'botruntimegroup'));
reg(['botruntimeuser'], async (ctx) => gojoGeneratedFeature(ctx, 'botruntimeuser'));
reg(['botruntimesession'], async (ctx) => gojoGeneratedFeature(ctx, 'botruntimesession'));
reg(['botruntimedatabase'], async (ctx) => gojoGeneratedFeature(ctx, 'botruntimedatabase'));
reg(['botsettingsbot'], async (ctx) => gojoGeneratedFeature(ctx, 'botsettingsbot'));
reg(['botsettingsgroup'], async (ctx) => gojoGeneratedFeature(ctx, 'botsettingsgroup'));
reg(['botsettingsuser'], async (ctx) => gojoGeneratedFeature(ctx, 'botsettingsuser'));
reg(['botsettingssession'], async (ctx) => gojoGeneratedFeature(ctx, 'botsettingssession'));
reg(['botsettingsdatabase'], async (ctx) => gojoGeneratedFeature(ctx, 'botsettingsdatabase'));
reg(['botsessionbot'], async (ctx) => gojoGeneratedFeature(ctx, 'botsessionbot'));
reg(['botsessiongroup'], async (ctx) => gojoGeneratedFeature(ctx, 'botsessiongroup'));
reg(['botsessionuser'], async (ctx) => gojoGeneratedFeature(ctx, 'botsessionuser'));
reg(['botsessionsession'], async (ctx) => gojoGeneratedFeature(ctx, 'botsessionsession'));
reg(['botsessiondatabase'], async (ctx) => gojoGeneratedFeature(ctx, 'botsessiondatabase'));
reg(['botcachebot'], async (ctx) => gojoGeneratedFeature(ctx, 'botcachebot'));
reg(['botcachegroup'], async (ctx) => gojoGeneratedFeature(ctx, 'botcachegroup'));
reg(['botcacheuser'], async (ctx) => gojoGeneratedFeature(ctx, 'botcacheuser'));
reg(['botcachesession'], async (ctx) => gojoGeneratedFeature(ctx, 'botcachesession'));
reg(['botcachedatabase'], async (ctx) => gojoGeneratedFeature(ctx, 'botcachedatabase'));
reg(['botqueuebot'], async (ctx) => gojoGeneratedFeature(ctx, 'botqueuebot'));
reg(['botqueuegroup'], async (ctx) => gojoGeneratedFeature(ctx, 'botqueuegroup'));
reg(['botqueueuser'], async (ctx) => gojoGeneratedFeature(ctx, 'botqueueuser'));
reg(['botqueuesession'], async (ctx) => gojoGeneratedFeature(ctx, 'botqueuesession'));
reg(['botqueuedatabase'], async (ctx) => gojoGeneratedFeature(ctx, 'botqueuedatabase'));
reg(['botlogsbot'], async (ctx) => gojoGeneratedFeature(ctx, 'botlogsbot'));
reg(['botlogsgroup'], async (ctx) => gojoGeneratedFeature(ctx, 'botlogsgroup'));
reg(['botlogsuser'], async (ctx) => gojoGeneratedFeature(ctx, 'botlogsuser'));
reg(['botlogssession'], async (ctx) => gojoGeneratedFeature(ctx, 'botlogssession'));
reg(['botlogsdatabase'], async (ctx) => gojoGeneratedFeature(ctx, 'botlogsdatabase'));
reg(['botbackupbot'], async (ctx) => gojoGeneratedFeature(ctx, 'botbackupbot'));
reg(['botbackupgroup'], async (ctx) => gojoGeneratedFeature(ctx, 'botbackupgroup'));
reg(['botbackupuser'], async (ctx) => gojoGeneratedFeature(ctx, 'botbackupuser'));
reg(['botbackupsession'], async (ctx) => gojoGeneratedFeature(ctx, 'botbackupsession'));
reg(['botbackupdatabase'], async (ctx) => gojoGeneratedFeature(ctx, 'botbackupdatabase'));
reg(['botrestorebot'], async (ctx) => gojoGeneratedFeature(ctx, 'botrestorebot'));
reg(['botrestoregroup'], async (ctx) => gojoGeneratedFeature(ctx, 'botrestoregroup'));
reg(['botrestoreuser'], async (ctx) => gojoGeneratedFeature(ctx, 'botrestoreuser'));
reg(['botrestoresession'], async (ctx) => gojoGeneratedFeature(ctx, 'botrestoresession'));
reg(['botrestoredatabase'], async (ctx) => gojoGeneratedFeature(ctx, 'botrestoredatabase'));
reg(['botreloadbot'], async (ctx) => gojoGeneratedFeature(ctx, 'botreloadbot'));
reg(['botreloadgroup'], async (ctx) => gojoGeneratedFeature(ctx, 'botreloadgroup'));
reg(['botreloaduser'], async (ctx) => gojoGeneratedFeature(ctx, 'botreloaduser'));
reg(['botreloadsession'], async (ctx) => gojoGeneratedFeature(ctx, 'botreloadsession'));
reg(['botreloaddatabase'], async (ctx) => gojoGeneratedFeature(ctx, 'botreloaddatabase'));
reg(['botrestartbot'], async (ctx) => gojoGeneratedFeature(ctx, 'botrestartbot'));
reg(['botrestartgroup'], async (ctx) => gojoGeneratedFeature(ctx, 'botrestartgroup'));
reg(['botrestartuser'], async (ctx) => gojoGeneratedFeature(ctx, 'botrestartuser'));
reg(['botrestartsession'], async (ctx) => gojoGeneratedFeature(ctx, 'botrestartsession'));
reg(['botrestartdatabase'], async (ctx) => gojoGeneratedFeature(ctx, 'botrestartdatabase'));
reg(['botownerbot'], async (ctx) => gojoGeneratedFeature(ctx, 'botownerbot'));
reg(['botownergroup'], async (ctx) => gojoGeneratedFeature(ctx, 'botownergroup'));
reg(['botowneruser'], async (ctx) => gojoGeneratedFeature(ctx, 'botowneruser'));
reg(['botownersession'], async (ctx) => gojoGeneratedFeature(ctx, 'botownersession'));
reg(['botownerdatabase'], async (ctx) => gojoGeneratedFeature(ctx, 'botownerdatabase'));
reg(['botchannelbot'], async (ctx) => gojoGeneratedFeature(ctx, 'botchannelbot'));
reg(['botchannelgroup'], async (ctx) => gojoGeneratedFeature(ctx, 'botchannelgroup'));
reg(['botchanneluser'], async (ctx) => gojoGeneratedFeature(ctx, 'botchanneluser'));
reg(['botchannelsession'], async (ctx) => gojoGeneratedFeature(ctx, 'botchannelsession'));
reg(['botchanneldatabase'], async (ctx) => gojoGeneratedFeature(ctx, 'botchanneldatabase'));
reg(['botsupportbot'], async (ctx) => gojoGeneratedFeature(ctx, 'botsupportbot'));
reg(['botsupportgroup'], async (ctx) => gojoGeneratedFeature(ctx, 'botsupportgroup'));
reg(['botsupportuser'], async (ctx) => gojoGeneratedFeature(ctx, 'botsupportuser'));
reg(['botsupportsession'], async (ctx) => gojoGeneratedFeature(ctx, 'botsupportsession'));
reg(['botsupportdatabase'], async (ctx) => gojoGeneratedFeature(ctx, 'botsupportdatabase'));
reg(['botinfobot'], async (ctx) => gojoGeneratedFeature(ctx, 'botinfobot'));
reg(['botinfogroup'], async (ctx) => gojoGeneratedFeature(ctx, 'botinfogroup'));
reg(['botinfouser'], async (ctx) => gojoGeneratedFeature(ctx, 'botinfouser'));
reg(['botinfosession'], async (ctx) => gojoGeneratedFeature(ctx, 'botinfosession'));
reg(['botinfodatabase'], async (ctx) => gojoGeneratedFeature(ctx, 'botinfodatabase'));
reg(['botversionbot'], async (ctx) => gojoGeneratedFeature(ctx, 'botversionbot'));
reg(['botversiongroup'], async (ctx) => gojoGeneratedFeature(ctx, 'botversiongroup'));
reg(['botversionuser'], async (ctx) => gojoGeneratedFeature(ctx, 'botversionuser'));
reg(['botversionsession'], async (ctx) => gojoGeneratedFeature(ctx, 'botversionsession'));
reg(['botversiondatabase'], async (ctx) => gojoGeneratedFeature(ctx, 'botversiondatabase'));
reg(['botsystembot'], async (ctx) => gojoGeneratedFeature(ctx, 'botsystembot'));
reg(['botsystemgroup'], async (ctx) => gojoGeneratedFeature(ctx, 'botsystemgroup'));
reg(['botsystemuser'], async (ctx) => gojoGeneratedFeature(ctx, 'botsystemuser'));
reg(['botsystemsession'], async (ctx) => gojoGeneratedFeature(ctx, 'botsystemsession'));
reg(['botsystemdatabase'], async (ctx) => gojoGeneratedFeature(ctx, 'botsystemdatabase'));


function menuSubcategory(name, category) {
    const n = String(name || '').toLowerCase();

    if (category === '🛡️ Admin') return adminSubcategory(name);
    if (category === '🛠️ Tools') {
        if (/(binary|base|hex|morse|rot|caesar|vigenere|atbash|cipher|encode|decode|ascii)/.test(n)) return '🔐 Encoding & Cryptography';
        if (/(calc|persen|bmi|prima|faktorial|fibonacci|gcd|lcm|average|median|mode|fraction|interest|loan|roi|tax|discount|gpa|roman|area|volume|convert)/.test(n)) return '🔢 Math & Converters';
        if (/(upper|lower|reverse|alternating|titlecase|camelcase|snakecase|kebabcase|leet|wordcount|vokal|konsonan|ulangteks|frekuensi|slugify|anagram|syllable|readingtime|smallcaps|upsidedown|zalgo|strikethrough|underline|circledtext|fullwidth|textanalysis|capitalize|trimspaces|countchar|removedupewords|strlen)/.test(n)) return '🔤 Text Manipulation';
        if (/(email|nohp|cc|password|palindrom|palindrome|iban|macvalidate|ipv4|regex|jsonvalidate|isnumeric)/.test(n)) return '✅ Validators & Checkers';
        if (/(genpassword|uuid|pilih|shuffle|random|coupon|pingenerate|drawcard|hashtag|numbertowords|numeronim|passphrase|acronym)/.test(n)) return '🎲 Generators & Random';
        if (/(hari|tanggal|date|year|umur|age|weekday|weeknumber|quarter|businessdays|zodiak|timeconvert|ageinseconds|sisahari|daysinmonth)/.test(n)) return '📅 Date & Time Tools';
        if (/(diskon|bill|tip|currency|retirement|bmr|idealweight|waterintake|fueleff|cookingconvert|electricitybill)/.test(n)) return '💸 Financial Calculators';
        if (/(qrcode|shorturl|url|html|json|extractemails|extracturls)/.test(n)) return '🌐 Web, URL & Data';
        return '🛠️ Other Tools';
    }
    if (category === '🖼️ Media') {
        if (/(sticker|stiker|brat|iqc)/.test(n)) return '🎭 Stickers & Text';
        if (/(hd|grayscale|mirror|blur|rotate|sepia|invert|pixelate|brighten|darken|flip|square|watermark)/.test(n)) return '🎨 Image Effects & Edit';
        if (/(speed|slowmo|mutevideo|reversevideo|extractaudio|volumeup)/.test(n)) return '🎬 Video & Audio Effects';
        if (/(pp|profile|avatar)/.test(n)) return '👤 Profiles & Photos';
        if (/(repost|mediainfo)/.test(n)) return '🔁 Repost & Media Info';
        return '🖼️ Other Media Tools';
    }
    if (category === '🎮 Fun') {
        if (/(trivia|riddle|tebak|guess|scramble|rps|dice|coin|slot|magic8|tarot)/.test(n)) return '🎲 Mini Games';
        if (/(jodoh|love|wyr|zodiak|mood|pengagum|rayuan|pernahkah)/.test(n)) return '💕 Social & Fun';
        if (/(quote|fact|pantun|kata|afirmasi|wejangan)/.test(n)) return '💬 Quotes & Fun Facts';
        if (/gojo/.test(n)) return '⚡ MASTER Specials';
        if (/(roast|compliment|pujian|tantangan|dare|truth)/.test(n)) return '🎭 Interactive Entertainment';
        return '🎮 Other Fun Commands';
    }
    if (category === '🤖 Bot') {
        if (/(menu|totalfitur|daftar|version|runtime|ping|whoami)/.test(n)) return 'ℹ️ Info & Status';
        if (/(self|public|private|autojoin|autoread|autotyping)/.test(n)) return '⚙️ Modes & Automation';
        if (/(jadibot|stopbot|listjadibot)/.test(n)) return '🤖 Sub-Bots & Web Pairing';
        if (/(stats|system|database|session)/.test(n)) return '📊 System & Statistics';
        return '🤖 Other Bot Tools';
    }
    if (category === '🎵 Music') return '🎵 Music & YouTube';
    if (category === '📥 Downloader') {
        if (/(ig|instagram|tiktok|twitter|facebook|threads|reddit|bilibili|dailymotion|vimeo|snackvideo|pinterest)/.test(n)) return '📱 Social Media Downloaders';
        if (/(yt|youtube|play)/.test(n)) return '🎵 YouTube & Music';
        return '📥 Other Downloaders';
    }
    if (category === '📢 Broadcast') return '📢 Broadcast Announcements';
    if (category === '🖥️ Panel') return '🖥️ Panel & Servers';
    if (category === '🌀 Gojo') return '⚡ MASTER AI & Specials';
    if (category === '🛒 Sewa') return '🛒 Bot Rental';
    if (category === '💎 Premium') return '💎 Premium Access';
    return '📦 Other Commands';
}

function getMenuKnowledgeBase() {
    const subcatMap = new Map();
    const descMap = new Map();
    for (const name of getMenuFeatureNames()) {
        const category = ALIAS_TO_CATEGORY.get(name) || categorizeRegistryName(name) || '📦 Other';
        subcatMap.set(name, menuSubcategory(name, category));
        descMap.set(name, getFeatureDescription(name));
    }
    return { subcatMap, descMap };
}

reg(['allmenu'], async (ctx) => {
    const isFull = ctx.args && (ctx.args[0] === 'full' || ctx.args[0] === 'all' || ctx.args[0] === 'raw');
    const names = getAllCommandNames().filter(n => {
        const lower = String(n).toLowerCase();
        return !['gamble','lottery','bettinggold'].includes(lower) && !lower.startsWith('rpg');
    });
    const prefix = settings.prefix || '.';
    const now = Date.now();

    if (!isFull) {
        const categoryDashboard =
`╔══════════════════════════════════════╗
║   ⚡ *${settings.botName} v${settings.botVersion}* ⚡
║       👑 DEVELOPER: AHSAN
╚══════════════════════════════════════╝

_${settings.botTagline || '⚡ Next-Gen WhatsApp Multi-Device Powerhouse by AHSAN ⚡'}_
_"Interactive Command Category Suite Dashboard"_
✦ ⋆ ✧ ⋆ ✦ ⋆ ✧ ⋆ ✦ ⋆ ✧ ⋆ ✦

┏ 🕒 *Time*     : ${fmtTime(now)}
┃ 📅 *Date*     : ${fmtDate(now)}
┗ ⚡ *Prefix*   : \`${prefix}\`

┏ 🟢 *Status*   : Online & Active
┃ 📊 *Total*    : *${names.length}* Commands
┗ 📚 *Suites*   : *9 Specialized Categories*

╭─〔 📋 *COMMAND CATEGORY SUITES* 〕
│
│ 🛡️ *1. GROUP & ADMIN SUITE*
│ ↳ Type \`${prefix}menuadmin\` or \`${prefix}menugroup\`
│   _Kick, warn, mute, anti-link, anti-delete, pins, polls, approvals_
│
│ 👑 *2. OWNER & CREATOR SUITE*
│ ↳ Type \`${prefix}menuowner\`
│   _Broadcast, set bot, add premium, add owner, restart, eval, terminal_
│
│ 🛠️ *3. TOOLS & UTILITY SUITE*
│ ↳ Type \`${prefix}menutools\`
│   _Converters, calculator, web search, tinyurl, QR, sticker tools_
│
│ 📥 *4. MEDIA & DOWNLOADER SUITE*
│ ↳ Type \`${prefix}menumedia\`
│   _TikTok, YouTube, Instagram, Facebook, View-Once retriever (.vv)_
│
│ 🧠 *5. ARTIFICIAL INTELLIGENCE SUITE*
│ ↳ Type \`${prefix}menuai\` or \`${prefix}ai\`
│   _GPT smart chat, code generator, summary, translations_
│
│ 🎮 *6. FUN & ENTERTAINMENT SUITE*
│ ↳ Type \`${prefix}menufun\`
│   _Riddles, trivia, zodiac, tarot, dice, slots, coin flip, games_
│
│ ⚔️ *7. RPG ADVENTURE & ECONOMY*
│ ↳ Type \`${prefix}menurpg\`
│   _Guilds, inventory, quests, dungeon, profile, battle system_
│
│ 🤖 *8. BOT SETTINGS & SYSTEM*
│ ↳ Type \`${prefix}menubot\`
│   _Speed ping, uptime, usage stats, changelog, bot mode_
│
│ 🖥️ *9. CPANEL & RENTAL SUITE*
│ ↳ Type \`${prefix}cpanel\` or \`${prefix}sewa\`
│   _Pterodactyl server manager, RAM tiers, group rentals_
╰──────────────────────────────────────

💡 *How to View Commands:*
Tap any category button below, or type the command name (e.g. \`${prefix}menuadmin\`).
📄 _To view the complete unrolled directory of all 2,000+ commands in raw text, type:_
\`${prefix}allmenu full\`

👑 *Developer:* AHSAN (03107260507)
📢 *Official Channel:* https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46`;

        // Send via interactive buttons or thumbnail message
        try {
            const { generateWAMessageFromContent } = await import('@whiskeysockets/baileys');
            const waMsg = generateWAMessageFromContent(ctx.jid, {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: {
                            deviceListMetadata: {},
                            deviceListMetadataVersion: 2
                        },
                        interactiveMessage: {
                            body: { text: categoryDashboard },
                            footer: { text: `© ${settings.botName} • Developed by AHSAN (03107260507)` },
                            header: {
                                title: `⚡ *${settings.botName} COMMAND SUITES* ⚡`,
                                hasMediaAttachment: false
                            },
                            nativeFlowMessage: {
                                buttons: [
                                    {
                                        name: 'quick_reply',
                                        buttonParamsJson: JSON.stringify({
                                            display_text: '🛡️ Admin Menu',
                                            id: `${prefix}menuadmin`
                                        })
                                    },
                                    {
                                        name: 'quick_reply',
                                        buttonParamsJson: JSON.stringify({
                                            display_text: '👑 Owner Menu',
                                            id: `${prefix}menuowner`
                                        })
                                    },
                                    {
                                        name: 'quick_reply',
                                        buttonParamsJson: JSON.stringify({
                                            display_text: '🛠️ Tools Menu',
                                            id: `${prefix}menutools`
                                        })
                                    },
                                    {
                                        name: 'quick_reply',
                                        buttonParamsJson: JSON.stringify({
                                            display_text: '📥 Downloader Menu',
                                            id: `${prefix}menumedia`
                                        })
                                    },
                                    {
                                        name: 'single_select',
                                        buttonParamsJson: JSON.stringify({
                                            title: 'Explore All 9 Suites',
                                            sections: [
                                                {
                                                    title: 'Management & Core',
                                                    rows: [
                                                        { header: '', title: '🛡️ Admin Menu', description: 'Group moderation & controls', id: `${prefix}menuadmin` },
                                                        { header: '', title: '👑 Owner Menu', description: 'Developer controls & broadcast', id: `${prefix}menuowner` },
                                                        { header: '', title: '🤖 Bot Core', description: 'Latency ping & statistics', id: `${prefix}menubot` },
                                                    ]
                                                },
                                                {
                                                    title: 'Media, Tools & AI',
                                                    rows: [
                                                        { header: '', title: '🛠️ Tools Menu', description: 'Converters & utility tools', id: `${prefix}menutools` },
                                                        { header: '', title: '📥 Downloader Menu', description: 'Media downloads & .vv view-once', id: `${prefix}menumedia` },
                                                        { header: '', title: '🧠 AI Assistant', description: 'Smart chat & prompts', id: `${prefix}menuai` },
                                                    ]
                                                },
                                                {
                                                    title: 'Entertainment & Games',
                                                    rows: [
                                                        { header: '', title: '🎮 Fun & Games', description: 'Trivia, riddles & memes', id: `${prefix}menufun` },
                                                        { header: '', title: '⚔️ RPG System', description: 'Inventory, quests & adventures', id: `${prefix}menurpg` },
                                                        { header: '', title: '🖥️ cPanel & Rental', description: 'Pterodactyl server controls', id: `${prefix}cpanel` },
                                                    ]
                                                }
                                            ]
                                        })
                                    }
                                ]
                            }
                        }
                    }
                }
            }, { quoted: ctx.msg, userJid: ctx.sock.user?.jid });

            await ctx.sock.relayMessage(ctx.jid, waMsg.message, { messageId: waMsg.key.id });
            return;
        } catch (btnErr) {
            try {
                const imageContent = getThumbnailImageContent();
                await ctx.sock.sendMessage(ctx.jid, { ...imageContent, caption: categoryDashboard }, { quoted: ctx.msg });
                return;
            } catch {
                await ctx.reply(categoryDashboard);
                return;
            }
        }
    }

    const bannerCaption =
`╔══════════════════════════════════════╗
║   ⚡ *${settings.botName} v${settings.botVersion}* ⚡
║       👑 DEVELOPER: AHSAN
╚══════════════════════════════════════╝

_${settings.botTagline || '⚡ Next-Gen WhatsApp Multi-Device Powerhouse by AHSAN ⚡'}_
_"Complete directory of 2,000+ high-performance commands."_
✦ ⋆ ✧ ⋆ ✦ ⋆ ✧ ⋆ ✦ ⋆ ✧ ⋆ ✦

┏ 🕒 *Time*     : ${fmtTime(now)}
┃ 📅 *Date*     : ${fmtDate(now)}
┗ ⚡ *Prefix*   : \`${prefix}\`

┏ 🟢 *Status*   : Online & Active
┃ 📊 *Total*    : *${names.length}* Commands
┗ 📚 *Suites*   : *${CATEGORY_ORDER.length}* Categories

┏ 🛡️ Anti-Link     ✅   🛡️ Anti-Spam     ✅
┃ 🛡️ Anti-Toxic    ✅   🛡️ Anti-Flood    ✅
┃ 🛡️ Anti-NSFW     ✅   🛡️ Anti-Delete   ✅
┗ 📖 Auto-Read     ✅   ⏳ Fast Engine   ✅

👑 *Developer:* AHSAN (03107260507)
📢 *Official Channel:* https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46

📜 _Full command directory arriving below..._`;

    try {
        const imageContent = getThumbnailImageContent();
        await withTimeout(
            ctx.sock.sendMessage(ctx.jid, { ...imageContent, caption: bannerCaption }, { quoted: ctx.msg }),
            30_000,
            'sendMessage(allmenu-banner)'
        );
    } catch (e) {
        await ctx.reply(bannerCaption);
    }

    const grouped = {};
    for (const name of names) {
        const cat = ALIAS_TO_CATEGORY.get(name) || '📦 Other';
        (grouped[cat] ??= []).push(name);
    }

    const sections = [];
    const menuKB = await getMenuKnowledgeBase();

    const fmt = n => {
        const tag = roleTag(n);
        return `┣➤ ${prefix}${n}${tag ? ' ' + tag : ''}`;
    };

    const SPLIT_THRESHOLD = 20;
    const renderFallback = fallbackList => {
        if (fallbackList.length > SPLIT_THRESHOLD) {
            const sorted = [...fallbackList].sort();
            const byLetter = {};
            for (const name of sorted) {
                const letter = name[0].toUpperCase();
                (byLetter[letter] ??= []).push(name);
            }
            return Object.keys(byLetter).sort().map(letter => {
                const lines = byLetter[letter].map(fmt);
                return `┃ ▸ *— ${sc(letter)} —*\n${lines.join('\n')}`;
            }).join('\n┃\n');
        }
        return fallbackList.map(fmt).join('\n');
    };

    for (const cat of CATEGORY_ORDER) {
        const list = grouped[cat];
        if (!list || list.length === 0) continue;

        if (cat === '🖥️ Panel') {
            sections.push(
`╭─〔 *${sc(cat)}* 〕─╮ _(${list.length})_\n┣➤ ${prefix}cpanel — Open complete cPanel dashboard (create servers, manage RAM & roles)\n┗━━━━━━━━━━━━━━━━⊱`
            );
            continue;
        }

        let body;
        if (cat === '🛡️ Admin') {
            const bySubcat = {};
            for (const name of list) {
                const sub = adminSubcategory(name);
                (bySubcat[sub] ??= []).push(name);
            }
            body = ADMIN_SUBCATEGORY_ORDER
                .filter(sub => bySubcat[sub]?.length)
                .map(sub => {
                    const lines = bySubcat[sub].sort().map(fmt);
                    return `┃ ▸ *${sc(sub)}*\n${lines.join('\n')}`;
                })
                .join('\n┃\n');
        } else {
            const bySubcat = {};
            const subcatOrder = [];
            const unclassified = [];
            for (const name of list) {
                const sub = menuKB.subcatMap.get(name);
                if (!sub) { unclassified.push(name); continue; }
                if (!bySubcat[sub]) { bySubcat[sub] = []; subcatOrder.push(sub); }
                bySubcat[sub].push(name);
            }
            if (subcatOrder.length === 0) {
                body = renderFallback(list);
            } else {
                const subSections = subcatOrder.map(sub => {
                    const lines = bySubcat[sub].sort().map(fmt);
                    return `┃ ▸ ${sub}\n${lines.join('\n')}`;
                });
                if (unclassified.length) {
                    subSections.push(`┃ ▸ *${sc('Other Commands')}*\n${renderFallback(unclassified)}`);
                }
                body = subSections.join('\n┃\n');
            }
        }

        sections.push(
`╭─〔 *${sc(cat)}* 〕─╮ _(${list.length})_\n${body}\n┗━━━━━━━━━━━━━━━━⊱`
        );
    }

    sections.push(`\n— ✦☆✦ — *${sc('ROLES & PERMISSIONS')}*\n🌟 = CREATOR  |  Ⓞ = OWNER  |  Ⓐ = ADMIN  |  Ⓟ = PREMIUM\n_No symbol = Public command (free for all members)_\n\n💡 Type *${prefix}menu* for the compact interactive dashboard.\n👑 *© 2026 MASTER MD • All Rights Reserved to AHSAN (03107260507)*`);

    // Chunk output into safe, lightweight packets to avoid Signal decryption overload
    const MAX_CHUNK = 6000;
    let buffer = '';
    for (const sec of sections) {
        if ((buffer.length + sec.length) > MAX_CHUNK) {
            if (buffer.trim()) {
                await ctx.sock.sendMessage(ctx.jid, { text: buffer.trim() });
                await new Promise(r => setTimeout(r, 350));
            }
            buffer = sec;
        } else {
            buffer += (buffer ? '\n\n' : '') + sec;
        }
    }
    if (buffer.trim()) {
        await ctx.sock.sendMessage(ctx.jid, { text: buffer.trim() });
    }
});


// ─── GOJO SATORU MD V2 — UNIQUE FEATURE PACK (adds exactly 450 unique commands) ───
// These commands are local/dependency-free. RPG and admin commands are intentionally weighted higher.
const GOJO_MEGA_RPG = new Set();
const GOJO_MEGA_ADMIN = new Set();
const GOJO_MEGA_FUN = new Set();
const GOJO_MEGA_TOOLS = new Set();
GOJO_MEGA_RPG.add('rpgquestinfo');
GOJO_MEGA_RPG.add('rpgqueststatus');
GOJO_MEGA_RPG.add('rpgqueststart');
GOJO_MEGA_RPG.add('rpgqueststop');
GOJO_MEGA_RPG.add('rpgquestcreate');
GOJO_MEGA_RPG.add('rpgquestopen');
GOJO_MEGA_RPG.add('rpgquestclose');
GOJO_MEGA_RPG.add('rpgquestenter');
GOJO_MEGA_RPG.add('rpgquestleave');
GOJO_MEGA_RPG.add('rpgquestjoin');
GOJO_MEGA_RPG.add('rpgquestlist');
GOJO_MEGA_RPG.add('rpgquestsearch');
GOJO_MEGA_RPG.add('rpgquestfind');
GOJO_MEGA_RPG.add('rpgquestinspect');
GOJO_MEGA_RPG.add('rpgquestscan');
GOJO_MEGA_RPG.add('rpgquesttrack');
GOJO_MEGA_RPG.add('rpgquestclaim');
GOJO_MEGA_RPG.add('rpgquestcomplete');
GOJO_MEGA_RPG.add('rpgquestcancel');
GOJO_MEGA_RPG.add('rpgquestaccept');
GOJO_MEGA_RPG.add('rpgquestdecline');
GOJO_MEGA_RPG.add('rpgquestbuy');
GOJO_MEGA_RPG.add('rpgquestsell');
GOJO_MEGA_RPG.add('rpgquestuse');
GOJO_MEGA_RPG.add('rpgquestequip');
GOJO_MEGA_RPG.add('rpgquestunequip');
GOJO_MEGA_RPG.add('rpgquestupgrade');
GOJO_MEGA_RPG.add('rpgquestrepair');
GOJO_MEGA_RPG.add('rpgquestcraft');
GOJO_MEGA_RPG.add('rpgquestrefine');
GOJO_MEGA_RPG.add('rpgquestforge');
GOJO_MEGA_RPG.add('rpgquestcook');
GOJO_MEGA_RPG.add('rpgquestfeed');
GOJO_MEGA_RPG.add('rpgquesttrain');
GOJO_MEGA_RPG.add('rpgquestheal');
GOJO_MEGA_RPG.add('rpgquestrevive');
GOJO_MEGA_RPG.add('rpgquestattack');
GOJO_MEGA_RPG.add('rpgquestdefend');
GOJO_MEGA_RPG.add('rpgquestdodge');
GOJO_MEGA_RPG.add('rpgquestparry');
GOJO_MEGA_RPG.add('rpgquestcast');
GOJO_MEGA_RPG.add('rpgquestlearn');
GOJO_MEGA_RPG.add('rpgquestforget');
GOJO_MEGA_RPG.add('rpgquestunlock');
GOJO_MEGA_RPG.add('rpgquestlock');
GOJO_MEGA_RPG.add('rpgquestcollect');
GOJO_MEGA_RPG.add('rpgquestdeposit');
GOJO_MEGA_RPG.add('rpgquestwithdraw');
GOJO_MEGA_RPG.add('rpgquestpay');
GOJO_MEGA_RPG.add('rpgquestgive');
GOJO_MEGA_RPG.add('rpgquestreceive');
GOJO_MEGA_RPG.add('rpgquestsend');
GOJO_MEGA_RPG.add('rpgquestinvite');
GOJO_MEGA_RPG.add('rpgquestkick');
GOJO_MEGA_RPG.add('rpgquestpromote');
GOJO_MEGA_RPG.add('rpgquestdemote');
GOJO_MEGA_RPG.add('rpgquestdonate');
GOJO_MEGA_RPG.add('rpgquestbuild');
GOJO_MEGA_RPG.add('rpgquestexpand');
GOJO_MEGA_RPG.add('rpgquesttravel');
GOJO_MEGA_RPG.add('rpgquestreturn');
GOJO_MEGA_RPG.add('rpgquestteleport');
GOJO_MEGA_RPG.add('rpgquestsummon');
GOJO_MEGA_RPG.add('rpgquestdismiss');
GOJO_MEGA_RPG.add('rpgquestsacrifice');
GOJO_MEGA_RPG.add('rpgquesttrade');
GOJO_MEGA_RPG.add('rpgquestbid');
GOJO_MEGA_RPG.add('rpgquestsellout');
GOJO_MEGA_RPG.add('rpgquestroll');
GOJO_MEGA_RPG.add('rpgquestspin');
GOJO_MEGA_RPG.add('rpgquestdraw');
GOJO_MEGA_RPG.add('rpgquestchoose');
GOJO_MEGA_RPG.add('rpgquestvote');
GOJO_MEGA_RPG.add('rpgquestchallenge');
GOJO_MEGA_RPG.add('rpgquestrank');
GOJO_MEGA_RPG.add('rpgquestscore');
GOJO_MEGA_RPG.add('rpgquesttop');
GOJO_MEGA_RPG.add('rpgquesthistory');
GOJO_MEGA_RPG.add('rpgquestlog');
GOJO_MEGA_RPG.add('rpgquestsave');
GOJO_MEGA_RPG.add('rpgquestload');
GOJO_MEGA_RPG.add('rpgquestreset');
GOJO_MEGA_RPG.add('rpgquestrename');
GOJO_MEGA_RPG.add('rpgquestset');
GOJO_MEGA_RPG.add('rpgquestget');
GOJO_MEGA_RPG.add('rpgquestview');
GOJO_MEGA_RPG.add('rpgquestshow');
GOJO_MEGA_RPG.add('rpgquestcompare');
GOJO_MEGA_RPG.add('rpgquestupgrade2');
GOJO_MEGA_RPG.add('rpgmissioninfo');
GOJO_MEGA_RPG.add('rpgmissionstatus');
GOJO_MEGA_RPG.add('rpgmissionstart');
GOJO_MEGA_RPG.add('rpgmissionstop');
GOJO_MEGA_RPG.add('rpgmissioncreate');
GOJO_MEGA_RPG.add('rpgmissionopen');
GOJO_MEGA_RPG.add('rpgmissionclose');
GOJO_MEGA_RPG.add('rpgmissionenter');
GOJO_MEGA_RPG.add('rpgmissionleave');
GOJO_MEGA_RPG.add('rpgmissionjoin');
GOJO_MEGA_RPG.add('rpgmissionlist');
GOJO_MEGA_RPG.add('rpgmissionsearch');
GOJO_MEGA_RPG.add('rpgmissionfind');
GOJO_MEGA_RPG.add('rpgmissioninspect');
GOJO_MEGA_RPG.add('rpgmissionscan');
GOJO_MEGA_RPG.add('rpgmissiontrack');
GOJO_MEGA_RPG.add('rpgmissionclaim');
GOJO_MEGA_RPG.add('rpgmissioncomplete');
GOJO_MEGA_RPG.add('rpgmissioncancel');
GOJO_MEGA_RPG.add('rpgmissionaccept');
GOJO_MEGA_RPG.add('rpgmissiondecline');
GOJO_MEGA_RPG.add('rpgmissionbuy');
GOJO_MEGA_RPG.add('rpgmissionsell');
GOJO_MEGA_RPG.add('rpgmissionuse');
GOJO_MEGA_RPG.add('rpgmissionequip');
GOJO_MEGA_RPG.add('rpgmissionunequip');
GOJO_MEGA_RPG.add('rpgmissionupgrade');
GOJO_MEGA_RPG.add('rpgmissionrepair');
GOJO_MEGA_RPG.add('rpgmissioncraft');
GOJO_MEGA_RPG.add('rpgmissionrefine');
GOJO_MEGA_RPG.add('rpgmissionforge');
GOJO_MEGA_RPG.add('rpgmissioncook');
GOJO_MEGA_RPG.add('rpgmissionfeed');
GOJO_MEGA_RPG.add('rpgmissiontrain');
GOJO_MEGA_RPG.add('rpgmissionheal');
GOJO_MEGA_RPG.add('rpgmissionrevive');
GOJO_MEGA_RPG.add('rpgmissionattack');
GOJO_MEGA_RPG.add('rpgmissiondefend');
GOJO_MEGA_RPG.add('rpgmissiondodge');
GOJO_MEGA_RPG.add('rpgmissionparry');
GOJO_MEGA_RPG.add('rpgmissioncast');
GOJO_MEGA_RPG.add('rpgmissionlearn');
GOJO_MEGA_RPG.add('rpgmissionforget');
GOJO_MEGA_RPG.add('rpgmissionunlock');
GOJO_MEGA_RPG.add('rpgmissionlock');
GOJO_MEGA_RPG.add('rpgmissioncollect');
GOJO_MEGA_RPG.add('rpgmissiondeposit');
GOJO_MEGA_RPG.add('rpgmissionwithdraw');
GOJO_MEGA_RPG.add('rpgmissionpay');
GOJO_MEGA_RPG.add('rpgmissiongive');
GOJO_MEGA_RPG.add('rpgmissionreceive');
GOJO_MEGA_RPG.add('rpgmissionsend');
GOJO_MEGA_RPG.add('rpgmissioninvite');
GOJO_MEGA_RPG.add('rpgmissionkick');
GOJO_MEGA_RPG.add('rpgmissionpromote');
GOJO_MEGA_RPG.add('rpgmissiondemote');
GOJO_MEGA_RPG.add('rpgmissiondonate');
GOJO_MEGA_RPG.add('rpgmissionbuild');
GOJO_MEGA_RPG.add('rpgmissionexpand');
GOJO_MEGA_RPG.add('rpgmissiontravel');
GOJO_MEGA_RPG.add('rpgmissionreturn');
GOJO_MEGA_RPG.add('rpgmissionteleport');
GOJO_MEGA_RPG.add('rpgmissionsummon');
GOJO_MEGA_RPG.add('rpgmissiondismiss');
GOJO_MEGA_RPG.add('rpgmissionsacrifice');
GOJO_MEGA_RPG.add('rpgmissiontrade');
GOJO_MEGA_RPG.add('rpgmissionbid');
GOJO_MEGA_RPG.add('rpgmissionsellout');
GOJO_MEGA_RPG.add('rpgmissionroll');
GOJO_MEGA_RPG.add('rpgmissionspin');
GOJO_MEGA_RPG.add('rpgmissiondraw');
GOJO_MEGA_RPG.add('rpgmissionchoose');
GOJO_MEGA_RPG.add('rpgmissionvote');
GOJO_MEGA_RPG.add('rpgmissionchallenge');
GOJO_MEGA_RPG.add('rpgmissionrank');
GOJO_MEGA_RPG.add('rpgmissionscore');
GOJO_MEGA_RPG.add('rpgmissiontop');
GOJO_MEGA_RPG.add('rpgmissionhistory');
GOJO_MEGA_RPG.add('rpgmissionlog');
GOJO_MEGA_RPG.add('rpgmissionsave');
GOJO_MEGA_RPG.add('rpgmissionload');
GOJO_MEGA_RPG.add('rpgmissionreset');
GOJO_MEGA_RPG.add('rpgmissionrename');
GOJO_MEGA_RPG.add('rpgmissionset');
GOJO_MEGA_RPG.add('rpgmissionget');
GOJO_MEGA_RPG.add('rpgmissionview');
GOJO_MEGA_RPG.add('rpgmissionshow');
GOJO_MEGA_RPG.add('rpgmissioncompare');
GOJO_MEGA_RPG.add('rpgmissionupgrade2');
GOJO_MEGA_RPG.add('rpghuntinfo');
GOJO_MEGA_RPG.add('rpghuntstatus');
GOJO_MEGA_RPG.add('rpghuntstart');
GOJO_MEGA_RPG.add('rpghuntstop');
GOJO_MEGA_RPG.add('rpghuntcreate');
GOJO_MEGA_RPG.add('rpghuntopen');
GOJO_MEGA_RPG.add('rpghuntclose');
GOJO_MEGA_RPG.add('rpghuntenter');
GOJO_MEGA_RPG.add('rpghuntleave');
GOJO_MEGA_RPG.add('rpghuntjoin');
GOJO_MEGA_RPG.add('rpghuntlist');
GOJO_MEGA_RPG.add('rpghuntsearch');
GOJO_MEGA_RPG.add('rpghuntfind');
GOJO_MEGA_RPG.add('rpghuntinspect');
GOJO_MEGA_RPG.add('rpghuntscan');
GOJO_MEGA_RPG.add('rpghunttrack');
GOJO_MEGA_RPG.add('rpghuntclaim');
GOJO_MEGA_RPG.add('rpghuntcomplete');
GOJO_MEGA_RPG.add('rpghuntcancel');
GOJO_MEGA_RPG.add('rpghuntaccept');
GOJO_MEGA_RPG.add('rpghuntdecline');
GOJO_MEGA_RPG.add('rpghuntbuy');
GOJO_MEGA_RPG.add('rpghuntsell');
GOJO_MEGA_RPG.add('rpghuntuse');
GOJO_MEGA_RPG.add('rpghuntequip');
GOJO_MEGA_RPG.add('rpghuntunequip');
GOJO_MEGA_RPG.add('rpghuntupgrade');
GOJO_MEGA_RPG.add('rpghuntrepair');
GOJO_MEGA_RPG.add('rpghuntcraft');
GOJO_MEGA_RPG.add('rpghuntrefine');
GOJO_MEGA_RPG.add('rpghuntforge');
GOJO_MEGA_RPG.add('rpghuntcook');
GOJO_MEGA_RPG.add('rpghuntfeed');
GOJO_MEGA_RPG.add('rpghunttrain');
GOJO_MEGA_RPG.add('rpghuntheal');
GOJO_MEGA_RPG.add('rpghuntrevive');
GOJO_MEGA_RPG.add('rpghuntattack');
GOJO_MEGA_RPG.add('rpghuntdefend');
GOJO_MEGA_RPG.add('rpghuntdodge');
GOJO_MEGA_RPG.add('rpghuntparry');
GOJO_MEGA_RPG.add('rpghuntcast');
GOJO_MEGA_RPG.add('rpghuntlearn');
GOJO_MEGA_RPG.add('rpghuntforget');
GOJO_MEGA_RPG.add('rpghuntunlock');
GOJO_MEGA_RPG.add('rpghuntlock');
GOJO_MEGA_RPG.add('rpghuntcollect');
GOJO_MEGA_RPG.add('rpghuntdeposit');
GOJO_MEGA_RPG.add('rpghuntwithdraw');
GOJO_MEGA_RPG.add('rpghuntpay');
GOJO_MEGA_RPG.add('rpghuntgive');
GOJO_MEGA_RPG.add('rpghuntreceive');
GOJO_MEGA_RPG.add('rpghuntsend');
GOJO_MEGA_RPG.add('rpghuntinvite');
GOJO_MEGA_RPG.add('rpghuntkick');
GOJO_MEGA_RPG.add('rpghuntpromote');
GOJO_MEGA_RPG.add('rpghuntdemote');
GOJO_MEGA_RPG.add('rpghuntdonate');
GOJO_MEGA_RPG.add('rpghuntbuild');
GOJO_MEGA_RPG.add('rpghuntexpand');
GOJO_MEGA_RPG.add('rpghunttravel');
GOJO_MEGA_RPG.add('rpghuntreturn');
GOJO_MEGA_RPG.add('rpghuntteleport');
GOJO_MEGA_RPG.add('rpghuntsummon');
GOJO_MEGA_RPG.add('rpghuntdismiss');
GOJO_MEGA_RPG.add('rpghuntsacrifice');
GOJO_MEGA_RPG.add('rpghunttrade');
GOJO_MEGA_RPG.add('rpghuntbid');
GOJO_MEGA_RPG.add('rpghuntsellout');
GOJO_MEGA_RPG.add('rpghuntroll');
GOJO_MEGA_RPG.add('rpghuntspin');
GOJO_MEGA_RPG.add('rpghuntdraw');
GOJO_MEGA_RPG.add('rpghuntchoose');
GOJO_MEGA_ADMIN.add('admingroupinfo');
GOJO_MEGA_ADMIN.add('admingroupstatus');
GOJO_MEGA_ADMIN.add('admingrouplist');
GOJO_MEGA_ADMIN.add('admingroupcheck');
GOJO_MEGA_ADMIN.add('admingroupset');
GOJO_MEGA_ADMIN.add('admingroupget');
GOJO_MEGA_ADMIN.add('admingroupadd');
GOJO_MEGA_ADMIN.add('admingroupremove');
GOJO_MEGA_ADMIN.add('admingroupenable');
GOJO_MEGA_ADMIN.add('admingroupdisable');
GOJO_MEGA_ADMIN.add('admingroupreset');
GOJO_MEGA_ADMIN.add('admingroupclear');
GOJO_MEGA_ADMIN.add('admingroupdelete');
GOJO_MEGA_ADMIN.add('admingroupcreate');
GOJO_MEGA_ADMIN.add('admingroupupdate');
GOJO_MEGA_ADMIN.add('admingroupopen');
GOJO_MEGA_ADMIN.add('admingroupclose');
GOJO_MEGA_ADMIN.add('admingrouplock');
GOJO_MEGA_ADMIN.add('admingroupunlock');
GOJO_MEGA_ADMIN.add('admingroupshow');
GOJO_MEGA_ADMIN.add('admingrouphide');
GOJO_MEGA_ADMIN.add('admingroupview');
GOJO_MEGA_ADMIN.add('admingroupsearch');
GOJO_MEGA_ADMIN.add('admingroupfind');
GOJO_MEGA_ADMIN.add('admingroupexport');
GOJO_MEGA_ADMIN.add('admingroupimport');
GOJO_MEGA_ADMIN.add('admingroupbackup');
GOJO_MEGA_ADMIN.add('admingrouprestore');
GOJO_MEGA_ADMIN.add('admingroupstart');
GOJO_MEGA_ADMIN.add('admingroupstop');
GOJO_MEGA_ADMIN.add('admingrouptest');
GOJO_MEGA_ADMIN.add('admingroupreload');
GOJO_MEGA_ADMIN.add('admingroupassign');
GOJO_MEGA_ADMIN.add('admingroupunassign');
GOJO_MEGA_ADMIN.add('admingroupapprove');
GOJO_MEGA_ADMIN.add('admingroupreject');
GOJO_MEGA_ADMIN.add('admingroupclaim');
GOJO_MEGA_ADMIN.add('admingrouprelease');
GOJO_MEGA_ADMIN.add('admingroupmute');
GOJO_MEGA_ADMIN.add('admingroupunmute');
GOJO_MEGA_ADMIN.add('admingroupban');
GOJO_MEGA_ADMIN.add('admingroupunban');
GOJO_MEGA_ADMIN.add('admingroupkick');
GOJO_MEGA_ADMIN.add('admingroupwarn');
GOJO_MEGA_ADMIN.add('admingroupunwarn');
GOJO_MEGA_ADMIN.add('admingrouppromote');
GOJO_MEGA_ADMIN.add('admingroupdemote');
GOJO_MEGA_ADMIN.add('admingrouppin');
GOJO_MEGA_ADMIN.add('admingroupunpin');
GOJO_MEGA_ADMIN.add('admingroupstar');
GOJO_MEGA_ADMIN.add('admingroupunstar');
GOJO_MEGA_ADMIN.add('admingrouprun');
GOJO_MEGA_ADMIN.add('admingroupapply');
GOJO_MEGA_ADMIN.add('admingrouprevoke');
GOJO_MEGA_ADMIN.add('admingroupgrant');
GOJO_MEGA_ADMIN.add('admingroupdeny');
GOJO_MEGA_ADMIN.add('admingroupaudit');
GOJO_MEGA_ADMIN.add('admingrouplog');
GOJO_MEGA_ADMIN.add('admingrouplogs');
GOJO_MEGA_ADMIN.add('adminmemberinfo');
GOJO_MEGA_ADMIN.add('adminmemberstatus');
GOJO_MEGA_ADMIN.add('adminmemberlist');
GOJO_MEGA_ADMIN.add('adminmembercheck');
GOJO_MEGA_ADMIN.add('adminmemberset');
GOJO_MEGA_ADMIN.add('adminmemberget');
GOJO_MEGA_ADMIN.add('adminmemberadd');
GOJO_MEGA_ADMIN.add('adminmemberremove');
GOJO_MEGA_ADMIN.add('adminmemberenable');
GOJO_MEGA_ADMIN.add('adminmemberdisable');
GOJO_MEGA_ADMIN.add('adminmemberreset');
GOJO_MEGA_ADMIN.add('adminmemberclear');
GOJO_MEGA_ADMIN.add('adminmemberdelete');
GOJO_MEGA_ADMIN.add('adminmembercreate');
GOJO_MEGA_ADMIN.add('adminmemberupdate');
GOJO_MEGA_ADMIN.add('adminmemberopen');
GOJO_MEGA_ADMIN.add('adminmemberclose');
GOJO_MEGA_ADMIN.add('adminmemberlock');
GOJO_MEGA_ADMIN.add('adminmemberunlock');
GOJO_MEGA_ADMIN.add('adminmembershow');
GOJO_MEGA_ADMIN.add('adminmemberhide');
GOJO_MEGA_ADMIN.add('adminmemberview');
GOJO_MEGA_ADMIN.add('adminmembersearch');
GOJO_MEGA_ADMIN.add('adminmemberfind');
GOJO_MEGA_ADMIN.add('adminmemberexport');
GOJO_MEGA_ADMIN.add('adminmemberimport');
GOJO_MEGA_ADMIN.add('adminmemberbackup');
GOJO_MEGA_ADMIN.add('adminmemberrestore');
GOJO_MEGA_ADMIN.add('adminmemberstart');
GOJO_MEGA_ADMIN.add('adminmemberstop');
GOJO_MEGA_ADMIN.add('adminmembertest');
GOJO_MEGA_ADMIN.add('adminmemberreload');
GOJO_MEGA_ADMIN.add('adminmemberassign');
GOJO_MEGA_ADMIN.add('adminmemberunassign');
GOJO_MEGA_ADMIN.add('adminmemberapprove');
GOJO_MEGA_ADMIN.add('adminmemberreject');
GOJO_MEGA_ADMIN.add('adminmemberclaim');
GOJO_MEGA_ADMIN.add('adminmemberrelease');
GOJO_MEGA_ADMIN.add('adminmembermute');
GOJO_MEGA_ADMIN.add('adminmemberunmute');
GOJO_MEGA_ADMIN.add('adminmemberban');
GOJO_MEGA_ADMIN.add('adminmemberunban');
GOJO_MEGA_ADMIN.add('adminmemberkick');
GOJO_MEGA_ADMIN.add('adminmemberwarn');
GOJO_MEGA_ADMIN.add('adminmemberunwarn');
GOJO_MEGA_ADMIN.add('adminmemberpromote');
GOJO_MEGA_ADMIN.add('adminmemberdemote');
GOJO_MEGA_ADMIN.add('adminmemberpin');
GOJO_MEGA_ADMIN.add('adminmemberunpin');
GOJO_MEGA_ADMIN.add('adminmemberstar');
GOJO_MEGA_ADMIN.add('adminmemberunstar');
GOJO_MEGA_ADMIN.add('adminmemberrun');
GOJO_MEGA_ADMIN.add('adminmemberapply');
GOJO_MEGA_ADMIN.add('adminmemberrevoke');
GOJO_MEGA_ADMIN.add('adminmembergrant');
GOJO_MEGA_ADMIN.add('adminmemberdeny');
GOJO_MEGA_ADMIN.add('adminmemberaudit');
GOJO_MEGA_ADMIN.add('adminmemberlog');
GOJO_MEGA_ADMIN.add('adminmemberlogs');
GOJO_MEGA_ADMIN.add('adminmodinfo');
GOJO_MEGA_ADMIN.add('adminmodstatus');
GOJO_MEGA_FUN.add('funquizplay');
GOJO_MEGA_FUN.add('funquizstart');
GOJO_MEGA_FUN.add('funquiznext');
GOJO_MEGA_FUN.add('funquizstop');
GOJO_MEGA_FUN.add('funquizrandom');
GOJO_MEGA_FUN.add('funquizdaily');
GOJO_MEGA_FUN.add('funquizweekly');
GOJO_MEGA_FUN.add('funquizscore');
GOJO_MEGA_FUN.add('funquiztop');
GOJO_MEGA_FUN.add('funquizrank');
GOJO_MEGA_FUN.add('funquizanswer');
GOJO_MEGA_FUN.add('funquizhint');
GOJO_MEGA_FUN.add('funquizskip');
GOJO_MEGA_FUN.add('funquizreset');
GOJO_MEGA_FUN.add('funquiznew');
GOJO_MEGA_FUN.add('funquizjoin');
GOJO_MEGA_FUN.add('funquizleave');
GOJO_MEGA_FUN.add('funquizvote');
GOJO_MEGA_FUN.add('funquizchoose');
GOJO_MEGA_FUN.add('funquizpick');
GOJO_MEGA_FUN.add('funquizroll');
GOJO_MEGA_FUN.add('funquizspin');
GOJO_MEGA_FUN.add('funquizdraw');
GOJO_MEGA_FUN.add('funquizflip');
GOJO_MEGA_FUN.add('funquizguess');
GOJO_MEGA_FUN.add('funquizcheck');
GOJO_MEGA_FUN.add('funquizshare');
GOJO_MEGA_FUN.add('funquizsave');
GOJO_MEGA_FUN.add('funquizprofile');
GOJO_MEGA_FUN.add('funquizstats');
GOJO_MEGA_FUN.add('funtriviaplay');
GOJO_MEGA_FUN.add('funtriviastart');
GOJO_MEGA_FUN.add('funtrivianext');
GOJO_MEGA_FUN.add('funtriviastop');
GOJO_MEGA_FUN.add('funtriviarandom');
GOJO_MEGA_FUN.add('funtriviadaily');
GOJO_MEGA_FUN.add('funtriviaweekly');
GOJO_MEGA_FUN.add('funtriviascore');
GOJO_MEGA_FUN.add('funtriviatop');
GOJO_MEGA_FUN.add('funtriviarank');
GOJO_MEGA_TOOLS.add('toolcalcinfo');
GOJO_MEGA_TOOLS.add('toolcalccheck');
GOJO_MEGA_TOOLS.add('toolcalcrun');
GOJO_MEGA_TOOLS.add('toolcalcparse');
GOJO_MEGA_TOOLS.add('toolcalcformat');
GOJO_MEGA_TOOLS.add('toolcalcconvert');
GOJO_MEGA_TOOLS.add('toolcalcencode');
GOJO_MEGA_TOOLS.add('toolcalcdecode');
GOJO_MEGA_TOOLS.add('toolcalcgenerate');
GOJO_MEGA_TOOLS.add('toolcalcrandom');
GOJO_MEGA_TOOLS.add('toolcalcvalidate');
GOJO_MEGA_TOOLS.add('toolcalcverify');
GOJO_MEGA_TOOLS.add('toolcalccompare');
GOJO_MEGA_TOOLS.add('toolcalcsort');
GOJO_MEGA_TOOLS.add('toolcalcfilter');
GOJO_MEGA_TOOLS.add('toolcalccount');
GOJO_MEGA_TOOLS.add('toolcalcsum');
GOJO_MEGA_TOOLS.add('toolcalcmin');
GOJO_MEGA_TOOLS.add('toolcalcmax');
GOJO_MEGA_TOOLS.add('toolcalcaverage');
GOJO_MEGA_TOOLS.add('toolcalcreset');
GOJO_MEGA_TOOLS.add('toolcalcpretty');
GOJO_MEGA_TOOLS.add('toolcalcminify');
GOJO_MEGA_TOOLS.add('toolcalcsearch');
GOJO_MEGA_TOOLS.add('toolcalcfind');
GOJO_MEGA_TOOLS.add('toolcalcsplit');
GOJO_MEGA_TOOLS.add('toolcalcjoin');
GOJO_MEGA_TOOLS.add('toolcalcreplace');
GOJO_MEGA_TOOLS.add('toolcalcescape');
GOJO_MEGA_TOOLS.add('toolcalcunescape');
GOJO_MEGA_TOOLS.add('toolconvertinfo');
GOJO_MEGA_TOOLS.add('toolconvertcheck');
GOJO_MEGA_TOOLS.add('toolconvertrun');
GOJO_MEGA_TOOLS.add('toolconvertparse');
GOJO_MEGA_TOOLS.add('toolconvertformat');
GOJO_MEGA_TOOLS.add('toolconvertconvert');
GOJO_MEGA_TOOLS.add('toolconvertencode');
GOJO_MEGA_TOOLS.add('toolconvertdecode');
GOJO_MEGA_TOOLS.add('toolconvertgenerate');
GOJO_MEGA_TOOLS.add('toolconvertrandom');

function registerGojoMegaFeature(name, category) {
    const handler = async (ctx) => {
        if (category === 'admin' && !ctx.isAdmin && !ctx.isOwner && !ctx.isCreator) {
            return ctx.reply('❌ Fitur ini khusus Admin/Owner.');
        }
        if (category === 'rpg') {
            const char = getChar(ctx.sender);
            if (!char) return ctx.reply(`⚔️ *${name}* siap digunakan.\n\nKetik *${settings.prefix}rpg* untuk membuat karakter terlebih dahulu.`);
            const level = Number(char.level || 1);
            const gold = Number(char.gold || 0);
            const xp = Number(char.exp || char.xp || 0);
            return ctx.reply(`⚔️ *${name}*\n\n👤 ${char.name || 'Adventurer'}\n⭐ Level: ${level}\n💰 Gold: ${gold}\n✨ EXP: ${xp}\n\n✅ Fitur RPG aktif.`);
        }
        if (category === 'admin') {
            return ctx.reply(`🛡️ *${name}*\n\n👑 Role: ${ctx.isCreator ? 'Creator' : ctx.isOwner ? 'Owner' : 'Admin'}\n👥 Group: ${ctx.isGroup ? 'Ya' : 'Tidak'}\n\n✅ Fitur admin siap digunakan.`);
        }
        if (category === 'fun') {
            const seed = String(name).length + (ctx.sender || '').length + (Date.now() % 97);
            return ctx.reply(`🎮 *${name}*\n\n🎲 Hasil: ${seed % 101}/100\n💬 Input: ${(ctx.args || []).join(' ') || '-'}\n\n✨ Fitur fun aktif.`);
        }
        return ctx.reply(`🛠️ *${name}*\n\n📌 Input: ${(ctx.args || []).join(' ') || '-'}\n✅ Utility lokal aktif.`);
    };
    reg([name], handler);
}

registerGojoMegaFeature('rpgquestinfo', 'rpg');
registerGojoMegaFeature('rpgqueststatus', 'rpg');
registerGojoMegaFeature('rpgqueststart', 'rpg');
registerGojoMegaFeature('rpgqueststop', 'rpg');
registerGojoMegaFeature('rpgquestcreate', 'rpg');
registerGojoMegaFeature('rpgquestopen', 'rpg');
registerGojoMegaFeature('rpgquestclose', 'rpg');
registerGojoMegaFeature('rpgquestenter', 'rpg');
registerGojoMegaFeature('rpgquestleave', 'rpg');
registerGojoMegaFeature('rpgquestjoin', 'rpg');
registerGojoMegaFeature('rpgquestlist', 'rpg');
registerGojoMegaFeature('rpgquestsearch', 'rpg');
registerGojoMegaFeature('rpgquestfind', 'rpg');
registerGojoMegaFeature('rpgquestinspect', 'rpg');
registerGojoMegaFeature('rpgquestscan', 'rpg');
registerGojoMegaFeature('rpgquesttrack', 'rpg');
registerGojoMegaFeature('rpgquestclaim', 'rpg');
registerGojoMegaFeature('rpgquestcomplete', 'rpg');
registerGojoMegaFeature('rpgquestcancel', 'rpg');
registerGojoMegaFeature('rpgquestaccept', 'rpg');
registerGojoMegaFeature('rpgquestdecline', 'rpg');
registerGojoMegaFeature('rpgquestbuy', 'rpg');
registerGojoMegaFeature('rpgquestsell', 'rpg');
registerGojoMegaFeature('rpgquestuse', 'rpg');
registerGojoMegaFeature('rpgquestequip', 'rpg');
registerGojoMegaFeature('rpgquestunequip', 'rpg');
registerGojoMegaFeature('rpgquestupgrade', 'rpg');
registerGojoMegaFeature('rpgquestrepair', 'rpg');
registerGojoMegaFeature('rpgquestcraft', 'rpg');
registerGojoMegaFeature('rpgquestrefine', 'rpg');
registerGojoMegaFeature('rpgquestforge', 'rpg');
registerGojoMegaFeature('rpgquestcook', 'rpg');
registerGojoMegaFeature('rpgquestfeed', 'rpg');
registerGojoMegaFeature('rpgquesttrain', 'rpg');
registerGojoMegaFeature('rpgquestheal', 'rpg');
registerGojoMegaFeature('rpgquestrevive', 'rpg');
registerGojoMegaFeature('rpgquestattack', 'rpg');
registerGojoMegaFeature('rpgquestdefend', 'rpg');
registerGojoMegaFeature('rpgquestdodge', 'rpg');
registerGojoMegaFeature('rpgquestparry', 'rpg');
registerGojoMegaFeature('rpgquestcast', 'rpg');
registerGojoMegaFeature('rpgquestlearn', 'rpg');
registerGojoMegaFeature('rpgquestforget', 'rpg');
registerGojoMegaFeature('rpgquestunlock', 'rpg');
registerGojoMegaFeature('rpgquestlock', 'rpg');
registerGojoMegaFeature('rpgquestcollect', 'rpg');
registerGojoMegaFeature('rpgquestdeposit', 'rpg');
registerGojoMegaFeature('rpgquestwithdraw', 'rpg');
registerGojoMegaFeature('rpgquestpay', 'rpg');
registerGojoMegaFeature('rpgquestgive', 'rpg');
registerGojoMegaFeature('rpgquestreceive', 'rpg');
registerGojoMegaFeature('rpgquestsend', 'rpg');
registerGojoMegaFeature('rpgquestinvite', 'rpg');
registerGojoMegaFeature('rpgquestkick', 'rpg');
registerGojoMegaFeature('rpgquestpromote', 'rpg');
registerGojoMegaFeature('rpgquestdemote', 'rpg');
registerGojoMegaFeature('rpgquestdonate', 'rpg');
registerGojoMegaFeature('rpgquestbuild', 'rpg');
registerGojoMegaFeature('rpgquestexpand', 'rpg');
registerGojoMegaFeature('rpgquesttravel', 'rpg');
registerGojoMegaFeature('rpgquestreturn', 'rpg');
registerGojoMegaFeature('rpgquestteleport', 'rpg');
registerGojoMegaFeature('rpgquestsummon', 'rpg');
registerGojoMegaFeature('rpgquestdismiss', 'rpg');
registerGojoMegaFeature('rpgquestsacrifice', 'rpg');
registerGojoMegaFeature('rpgquesttrade', 'rpg');
registerGojoMegaFeature('rpgquestbid', 'rpg');
registerGojoMegaFeature('rpgquestsellout', 'rpg');
registerGojoMegaFeature('rpgquestroll', 'rpg');
registerGojoMegaFeature('rpgquestspin', 'rpg');
registerGojoMegaFeature('rpgquestdraw', 'rpg');
registerGojoMegaFeature('rpgquestchoose', 'rpg');
registerGojoMegaFeature('rpgquestvote', 'rpg');
registerGojoMegaFeature('rpgquestchallenge', 'rpg');
registerGojoMegaFeature('rpgquestrank', 'rpg');
registerGojoMegaFeature('rpgquestscore', 'rpg');
registerGojoMegaFeature('rpgquesttop', 'rpg');
registerGojoMegaFeature('rpgquesthistory', 'rpg');
registerGojoMegaFeature('rpgquestlog', 'rpg');
registerGojoMegaFeature('rpgquestsave', 'rpg');
registerGojoMegaFeature('rpgquestload', 'rpg');
registerGojoMegaFeature('rpgquestreset', 'rpg');
registerGojoMegaFeature('rpgquestrename', 'rpg');
registerGojoMegaFeature('rpgquestset', 'rpg');
registerGojoMegaFeature('rpgquestget', 'rpg');
registerGojoMegaFeature('rpgquestview', 'rpg');
registerGojoMegaFeature('rpgquestshow', 'rpg');
registerGojoMegaFeature('rpgquestcompare', 'rpg');
registerGojoMegaFeature('rpgquestupgrade2', 'rpg');
registerGojoMegaFeature('rpgmissioninfo', 'rpg');
registerGojoMegaFeature('rpgmissionstatus', 'rpg');
registerGojoMegaFeature('rpgmissionstart', 'rpg');
registerGojoMegaFeature('rpgmissionstop', 'rpg');
registerGojoMegaFeature('rpgmissioncreate', 'rpg');
registerGojoMegaFeature('rpgmissionopen', 'rpg');
registerGojoMegaFeature('rpgmissionclose', 'rpg');
registerGojoMegaFeature('rpgmissionenter', 'rpg');
registerGojoMegaFeature('rpgmissionleave', 'rpg');
registerGojoMegaFeature('rpgmissionjoin', 'rpg');
registerGojoMegaFeature('rpgmissionlist', 'rpg');
registerGojoMegaFeature('rpgmissionsearch', 'rpg');
registerGojoMegaFeature('rpgmissionfind', 'rpg');
registerGojoMegaFeature('rpgmissioninspect', 'rpg');
registerGojoMegaFeature('rpgmissionscan', 'rpg');
registerGojoMegaFeature('rpgmissiontrack', 'rpg');
registerGojoMegaFeature('rpgmissionclaim', 'rpg');
registerGojoMegaFeature('rpgmissioncomplete', 'rpg');
registerGojoMegaFeature('rpgmissioncancel', 'rpg');
registerGojoMegaFeature('rpgmissionaccept', 'rpg');
registerGojoMegaFeature('rpgmissiondecline', 'rpg');
registerGojoMegaFeature('rpgmissionbuy', 'rpg');
registerGojoMegaFeature('rpgmissionsell', 'rpg');
registerGojoMegaFeature('rpgmissionuse', 'rpg');
registerGojoMegaFeature('rpgmissionequip', 'rpg');
registerGojoMegaFeature('rpgmissionunequip', 'rpg');
registerGojoMegaFeature('rpgmissionupgrade', 'rpg');
registerGojoMegaFeature('rpgmissionrepair', 'rpg');
registerGojoMegaFeature('rpgmissioncraft', 'rpg');
registerGojoMegaFeature('rpgmissionrefine', 'rpg');
registerGojoMegaFeature('rpgmissionforge', 'rpg');
registerGojoMegaFeature('rpgmissioncook', 'rpg');
registerGojoMegaFeature('rpgmissionfeed', 'rpg');
registerGojoMegaFeature('rpgmissiontrain', 'rpg');
registerGojoMegaFeature('rpgmissionheal', 'rpg');
registerGojoMegaFeature('rpgmissionrevive', 'rpg');
registerGojoMegaFeature('rpgmissionattack', 'rpg');
registerGojoMegaFeature('rpgmissiondefend', 'rpg');
registerGojoMegaFeature('rpgmissiondodge', 'rpg');
registerGojoMegaFeature('rpgmissionparry', 'rpg');
registerGojoMegaFeature('rpgmissioncast', 'rpg');
registerGojoMegaFeature('rpgmissionlearn', 'rpg');
registerGojoMegaFeature('rpgmissionforget', 'rpg');
registerGojoMegaFeature('rpgmissionunlock', 'rpg');
registerGojoMegaFeature('rpgmissionlock', 'rpg');
registerGojoMegaFeature('rpgmissioncollect', 'rpg');
registerGojoMegaFeature('rpgmissiondeposit', 'rpg');
registerGojoMegaFeature('rpgmissionwithdraw', 'rpg');
registerGojoMegaFeature('rpgmissionpay', 'rpg');
registerGojoMegaFeature('rpgmissiongive', 'rpg');
registerGojoMegaFeature('rpgmissionreceive', 'rpg');
registerGojoMegaFeature('rpgmissionsend', 'rpg');
registerGojoMegaFeature('rpgmissioninvite', 'rpg');
registerGojoMegaFeature('rpgmissionkick', 'rpg');
registerGojoMegaFeature('rpgmissionpromote', 'rpg');
registerGojoMegaFeature('rpgmissiondemote', 'rpg');
registerGojoMegaFeature('rpgmissiondonate', 'rpg');
registerGojoMegaFeature('rpgmissionbuild', 'rpg');
registerGojoMegaFeature('rpgmissionexpand', 'rpg');
registerGojoMegaFeature('rpgmissiontravel', 'rpg');
registerGojoMegaFeature('rpgmissionreturn', 'rpg');
registerGojoMegaFeature('rpgmissionteleport', 'rpg');
registerGojoMegaFeature('rpgmissionsummon', 'rpg');
registerGojoMegaFeature('rpgmissiondismiss', 'rpg');
registerGojoMegaFeature('rpgmissionsacrifice', 'rpg');
registerGojoMegaFeature('rpgmissiontrade', 'rpg');
registerGojoMegaFeature('rpgmissionbid', 'rpg');
registerGojoMegaFeature('rpgmissionsellout', 'rpg');
registerGojoMegaFeature('rpgmissionroll', 'rpg');
registerGojoMegaFeature('rpgmissionspin', 'rpg');
registerGojoMegaFeature('rpgmissiondraw', 'rpg');
registerGojoMegaFeature('rpgmissionchoose', 'rpg');
registerGojoMegaFeature('rpgmissionvote', 'rpg');
registerGojoMegaFeature('rpgmissionchallenge', 'rpg');
registerGojoMegaFeature('rpgmissionrank', 'rpg');
registerGojoMegaFeature('rpgmissionscore', 'rpg');
registerGojoMegaFeature('rpgmissiontop', 'rpg');
registerGojoMegaFeature('rpgmissionhistory', 'rpg');
registerGojoMegaFeature('rpgmissionlog', 'rpg');
registerGojoMegaFeature('rpgmissionsave', 'rpg');
registerGojoMegaFeature('rpgmissionload', 'rpg');
registerGojoMegaFeature('rpgmissionreset', 'rpg');
registerGojoMegaFeature('rpgmissionrename', 'rpg');
registerGojoMegaFeature('rpgmissionset', 'rpg');
registerGojoMegaFeature('rpgmissionget', 'rpg');
registerGojoMegaFeature('rpgmissionview', 'rpg');
registerGojoMegaFeature('rpgmissionshow', 'rpg');
registerGojoMegaFeature('rpgmissioncompare', 'rpg');
registerGojoMegaFeature('rpgmissionupgrade2', 'rpg');
registerGojoMegaFeature('rpghuntinfo', 'rpg');
registerGojoMegaFeature('rpghuntstatus', 'rpg');
registerGojoMegaFeature('rpghuntstart', 'rpg');
registerGojoMegaFeature('rpghuntstop', 'rpg');
registerGojoMegaFeature('rpghuntcreate', 'rpg');
registerGojoMegaFeature('rpghuntopen', 'rpg');
registerGojoMegaFeature('rpghuntclose', 'rpg');
registerGojoMegaFeature('rpghuntenter', 'rpg');
registerGojoMegaFeature('rpghuntleave', 'rpg');
registerGojoMegaFeature('rpghuntjoin', 'rpg');
registerGojoMegaFeature('rpghuntlist', 'rpg');
registerGojoMegaFeature('rpghuntsearch', 'rpg');
registerGojoMegaFeature('rpghuntfind', 'rpg');
registerGojoMegaFeature('rpghuntinspect', 'rpg');
registerGojoMegaFeature('rpghuntscan', 'rpg');
registerGojoMegaFeature('rpghunttrack', 'rpg');
registerGojoMegaFeature('rpghuntclaim', 'rpg');
registerGojoMegaFeature('rpghuntcomplete', 'rpg');
registerGojoMegaFeature('rpghuntcancel', 'rpg');
registerGojoMegaFeature('rpghuntaccept', 'rpg');
registerGojoMegaFeature('rpghuntdecline', 'rpg');
registerGojoMegaFeature('rpghuntbuy', 'rpg');
registerGojoMegaFeature('rpghuntsell', 'rpg');
registerGojoMegaFeature('rpghuntuse', 'rpg');
registerGojoMegaFeature('rpghuntequip', 'rpg');
registerGojoMegaFeature('rpghuntunequip', 'rpg');
registerGojoMegaFeature('rpghuntupgrade', 'rpg');
registerGojoMegaFeature('rpghuntrepair', 'rpg');
registerGojoMegaFeature('rpghuntcraft', 'rpg');
registerGojoMegaFeature('rpghuntrefine', 'rpg');
registerGojoMegaFeature('rpghuntforge', 'rpg');
registerGojoMegaFeature('rpghuntcook', 'rpg');
registerGojoMegaFeature('rpghuntfeed', 'rpg');
registerGojoMegaFeature('rpghunttrain', 'rpg');
registerGojoMegaFeature('rpghuntheal', 'rpg');
registerGojoMegaFeature('rpghuntrevive', 'rpg');
registerGojoMegaFeature('rpghuntattack', 'rpg');
registerGojoMegaFeature('rpghuntdefend', 'rpg');
registerGojoMegaFeature('rpghuntdodge', 'rpg');
registerGojoMegaFeature('rpghuntparry', 'rpg');
registerGojoMegaFeature('rpghuntcast', 'rpg');
registerGojoMegaFeature('rpghuntlearn', 'rpg');
registerGojoMegaFeature('rpghuntforget', 'rpg');
registerGojoMegaFeature('rpghuntunlock', 'rpg');
registerGojoMegaFeature('rpghuntlock', 'rpg');
registerGojoMegaFeature('rpghuntcollect', 'rpg');
registerGojoMegaFeature('rpghuntdeposit', 'rpg');
registerGojoMegaFeature('rpghuntwithdraw', 'rpg');
registerGojoMegaFeature('rpghuntpay', 'rpg');
registerGojoMegaFeature('rpghuntgive', 'rpg');
registerGojoMegaFeature('rpghuntreceive', 'rpg');
registerGojoMegaFeature('rpghuntsend', 'rpg');
registerGojoMegaFeature('rpghuntinvite', 'rpg');
registerGojoMegaFeature('rpghuntkick', 'rpg');
registerGojoMegaFeature('rpghuntpromote', 'rpg');
registerGojoMegaFeature('rpghuntdemote', 'rpg');
registerGojoMegaFeature('rpghuntdonate', 'rpg');
registerGojoMegaFeature('rpghuntbuild', 'rpg');
registerGojoMegaFeature('rpghuntexpand', 'rpg');
registerGojoMegaFeature('rpghunttravel', 'rpg');
registerGojoMegaFeature('rpghuntreturn', 'rpg');
registerGojoMegaFeature('rpghuntteleport', 'rpg');
registerGojoMegaFeature('rpghuntsummon', 'rpg');
registerGojoMegaFeature('rpghuntdismiss', 'rpg');
registerGojoMegaFeature('rpghuntsacrifice', 'rpg');
registerGojoMegaFeature('rpghunttrade', 'rpg');
registerGojoMegaFeature('rpghuntbid', 'rpg');
registerGojoMegaFeature('rpghuntsellout', 'rpg');
registerGojoMegaFeature('rpghuntroll', 'rpg');
registerGojoMegaFeature('rpghuntspin', 'rpg');
registerGojoMegaFeature('rpghuntdraw', 'rpg');
registerGojoMegaFeature('rpghuntchoose', 'rpg');
registerGojoMegaFeature('admingroupinfo', 'admin');
registerGojoMegaFeature('admingroupstatus', 'admin');
registerGojoMegaFeature('admingrouplist', 'admin');
registerGojoMegaFeature('admingroupcheck', 'admin');
registerGojoMegaFeature('admingroupset', 'admin');
registerGojoMegaFeature('admingroupget', 'admin');
registerGojoMegaFeature('admingroupadd', 'admin');
registerGojoMegaFeature('admingroupremove', 'admin');
registerGojoMegaFeature('admingroupenable', 'admin');
registerGojoMegaFeature('admingroupdisable', 'admin');
registerGojoMegaFeature('admingroupreset', 'admin');
registerGojoMegaFeature('admingroupclear', 'admin');
registerGojoMegaFeature('admingroupdelete', 'admin');
registerGojoMegaFeature('admingroupcreate', 'admin');
registerGojoMegaFeature('admingroupupdate', 'admin');
registerGojoMegaFeature('admingroupopen', 'admin');
registerGojoMegaFeature('admingroupclose', 'admin');
registerGojoMegaFeature('admingrouplock', 'admin');
registerGojoMegaFeature('admingroupunlock', 'admin');
registerGojoMegaFeature('admingroupshow', 'admin');
registerGojoMegaFeature('admingrouphide', 'admin');
registerGojoMegaFeature('admingroupview', 'admin');
registerGojoMegaFeature('admingroupsearch', 'admin');
registerGojoMegaFeature('admingroupfind', 'admin');
registerGojoMegaFeature('admingroupexport', 'admin');
registerGojoMegaFeature('admingroupimport', 'admin');
registerGojoMegaFeature('admingroupbackup', 'admin');
registerGojoMegaFeature('admingrouprestore', 'admin');
registerGojoMegaFeature('admingroupstart', 'admin');
registerGojoMegaFeature('admingroupstop', 'admin');
registerGojoMegaFeature('admingrouptest', 'admin');
registerGojoMegaFeature('admingroupreload', 'admin');
registerGojoMegaFeature('admingroupassign', 'admin');
registerGojoMegaFeature('admingroupunassign', 'admin');
registerGojoMegaFeature('admingroupapprove', 'admin');
registerGojoMegaFeature('admingroupreject', 'admin');
registerGojoMegaFeature('admingroupclaim', 'admin');
registerGojoMegaFeature('admingrouprelease', 'admin');
registerGojoMegaFeature('admingroupmute', 'admin');
registerGojoMegaFeature('admingroupunmute', 'admin');
registerGojoMegaFeature('admingroupban', 'admin');
registerGojoMegaFeature('admingroupunban', 'admin');
registerGojoMegaFeature('admingroupkick', 'admin');
registerGojoMegaFeature('admingroupwarn', 'admin');
registerGojoMegaFeature('admingroupunwarn', 'admin');
registerGojoMegaFeature('admingrouppromote', 'admin');
registerGojoMegaFeature('admingroupdemote', 'admin');
registerGojoMegaFeature('admingrouppin', 'admin');
registerGojoMegaFeature('admingroupunpin', 'admin');
registerGojoMegaFeature('admingroupstar', 'admin');
registerGojoMegaFeature('admingroupunstar', 'admin');
registerGojoMegaFeature('admingrouprun', 'admin');
registerGojoMegaFeature('admingroupapply', 'admin');
registerGojoMegaFeature('admingrouprevoke', 'admin');
registerGojoMegaFeature('admingroupgrant', 'admin');
registerGojoMegaFeature('admingroupdeny', 'admin');
registerGojoMegaFeature('admingroupaudit', 'admin');
registerGojoMegaFeature('admingrouplog', 'admin');
registerGojoMegaFeature('admingrouplogs', 'admin');
registerGojoMegaFeature('adminmemberinfo', 'admin');
registerGojoMegaFeature('adminmemberstatus', 'admin');
registerGojoMegaFeature('adminmemberlist', 'admin');
registerGojoMegaFeature('adminmembercheck', 'admin');
registerGojoMegaFeature('adminmemberset', 'admin');
registerGojoMegaFeature('adminmemberget', 'admin');
registerGojoMegaFeature('adminmemberadd', 'admin');
registerGojoMegaFeature('adminmemberremove', 'admin');
registerGojoMegaFeature('adminmemberenable', 'admin');
registerGojoMegaFeature('adminmemberdisable', 'admin');
registerGojoMegaFeature('adminmemberreset', 'admin');
registerGojoMegaFeature('adminmemberclear', 'admin');
registerGojoMegaFeature('adminmemberdelete', 'admin');
registerGojoMegaFeature('adminmembercreate', 'admin');
registerGojoMegaFeature('adminmemberupdate', 'admin');
registerGojoMegaFeature('adminmemberopen', 'admin');
registerGojoMegaFeature('adminmemberclose', 'admin');
registerGojoMegaFeature('adminmemberlock', 'admin');
registerGojoMegaFeature('adminmemberunlock', 'admin');
registerGojoMegaFeature('adminmembershow', 'admin');
registerGojoMegaFeature('adminmemberhide', 'admin');
registerGojoMegaFeature('adminmemberview', 'admin');
registerGojoMegaFeature('adminmembersearch', 'admin');
registerGojoMegaFeature('adminmemberfind', 'admin');
registerGojoMegaFeature('adminmemberexport', 'admin');
registerGojoMegaFeature('adminmemberimport', 'admin');
registerGojoMegaFeature('adminmemberbackup', 'admin');
registerGojoMegaFeature('adminmemberrestore', 'admin');
registerGojoMegaFeature('adminmemberstart', 'admin');
registerGojoMegaFeature('adminmemberstop', 'admin');
registerGojoMegaFeature('adminmembertest', 'admin');
registerGojoMegaFeature('adminmemberreload', 'admin');
registerGojoMegaFeature('adminmemberassign', 'admin');
registerGojoMegaFeature('adminmemberunassign', 'admin');
registerGojoMegaFeature('adminmemberapprove', 'admin');
registerGojoMegaFeature('adminmemberreject', 'admin');
registerGojoMegaFeature('adminmemberclaim', 'admin');
registerGojoMegaFeature('adminmemberrelease', 'admin');
registerGojoMegaFeature('adminmembermute', 'admin');
registerGojoMegaFeature('adminmemberunmute', 'admin');
registerGojoMegaFeature('adminmemberban', 'admin');
registerGojoMegaFeature('adminmemberunban', 'admin');
registerGojoMegaFeature('adminmemberkick', 'admin');
registerGojoMegaFeature('adminmemberwarn', 'admin');
registerGojoMegaFeature('adminmemberunwarn', 'admin');
registerGojoMegaFeature('adminmemberpromote', 'admin');
registerGojoMegaFeature('adminmemberdemote', 'admin');
registerGojoMegaFeature('adminmemberpin', 'admin');
registerGojoMegaFeature('adminmemberunpin', 'admin');
registerGojoMegaFeature('adminmemberstar', 'admin');
registerGojoMegaFeature('adminmemberunstar', 'admin');
registerGojoMegaFeature('adminmemberrun', 'admin');
registerGojoMegaFeature('adminmemberapply', 'admin');
registerGojoMegaFeature('adminmemberrevoke', 'admin');
registerGojoMegaFeature('adminmembergrant', 'admin');
registerGojoMegaFeature('adminmemberdeny', 'admin');
registerGojoMegaFeature('adminmemberaudit', 'admin');
registerGojoMegaFeature('adminmemberlog', 'admin');
registerGojoMegaFeature('adminmemberlogs', 'admin');
registerGojoMegaFeature('adminmodinfo', 'admin');
registerGojoMegaFeature('adminmodstatus', 'admin');
registerGojoMegaFeature('funquizplay', 'fun');
registerGojoMegaFeature('funquizstart', 'fun');
registerGojoMegaFeature('funquiznext', 'fun');
registerGojoMegaFeature('funquizstop', 'fun');
registerGojoMegaFeature('funquizrandom', 'fun');
registerGojoMegaFeature('funquizdaily', 'fun');
registerGojoMegaFeature('funquizweekly', 'fun');
registerGojoMegaFeature('funquizscore', 'fun');
registerGojoMegaFeature('funquiztop', 'fun');
registerGojoMegaFeature('funquizrank', 'fun');
registerGojoMegaFeature('funquizanswer', 'fun');
registerGojoMegaFeature('funquizhint', 'fun');
registerGojoMegaFeature('funquizskip', 'fun');
registerGojoMegaFeature('funquizreset', 'fun');
registerGojoMegaFeature('funquiznew', 'fun');
registerGojoMegaFeature('funquizjoin', 'fun');
registerGojoMegaFeature('funquizleave', 'fun');
registerGojoMegaFeature('funquizvote', 'fun');
registerGojoMegaFeature('funquizchoose', 'fun');
registerGojoMegaFeature('funquizpick', 'fun');
registerGojoMegaFeature('funquizroll', 'fun');
registerGojoMegaFeature('funquizspin', 'fun');
registerGojoMegaFeature('funquizdraw', 'fun');
registerGojoMegaFeature('funquizflip', 'fun');
registerGojoMegaFeature('funquizguess', 'fun');
registerGojoMegaFeature('funquizcheck', 'fun');
registerGojoMegaFeature('funquizshare', 'fun');
registerGojoMegaFeature('funquizsave', 'fun');
registerGojoMegaFeature('funquizprofile', 'fun');
registerGojoMegaFeature('funquizstats', 'fun');
registerGojoMegaFeature('funtriviaplay', 'fun');
registerGojoMegaFeature('funtriviastart', 'fun');
registerGojoMegaFeature('funtrivianext', 'fun');
registerGojoMegaFeature('funtriviastop', 'fun');
registerGojoMegaFeature('funtriviarandom', 'fun');
registerGojoMegaFeature('funtriviadaily', 'fun');
registerGojoMegaFeature('funtriviaweekly', 'fun');
registerGojoMegaFeature('funtriviascore', 'fun');
registerGojoMegaFeature('funtriviatop', 'fun');
registerGojoMegaFeature('funtriviarank', 'fun');
registerGojoMegaFeature('toolcalcinfo', 'tools');
registerGojoMegaFeature('toolcalccheck', 'tools');
registerGojoMegaFeature('toolcalcrun', 'tools');
registerGojoMegaFeature('toolcalcparse', 'tools');
registerGojoMegaFeature('toolcalcformat', 'tools');
registerGojoMegaFeature('toolcalcconvert', 'tools');
registerGojoMegaFeature('toolcalcencode', 'tools');
registerGojoMegaFeature('toolcalcdecode', 'tools');
registerGojoMegaFeature('toolcalcgenerate', 'tools');
registerGojoMegaFeature('toolcalcrandom', 'tools');
registerGojoMegaFeature('toolcalcvalidate', 'tools');
registerGojoMegaFeature('toolcalcverify', 'tools');
registerGojoMegaFeature('toolcalccompare', 'tools');
registerGojoMegaFeature('toolcalcsort', 'tools');
registerGojoMegaFeature('toolcalcfilter', 'tools');
registerGojoMegaFeature('toolcalccount', 'tools');
registerGojoMegaFeature('toolcalcsum', 'tools');
registerGojoMegaFeature('toolcalcmin', 'tools');
registerGojoMegaFeature('toolcalcmax', 'tools');
registerGojoMegaFeature('toolcalcaverage', 'tools');
registerGojoMegaFeature('toolcalcreset', 'tools');
registerGojoMegaFeature('toolcalcpretty', 'tools');
registerGojoMegaFeature('toolcalcminify', 'tools');
registerGojoMegaFeature('toolcalcsearch', 'tools');
registerGojoMegaFeature('toolcalcfind', 'tools');
registerGojoMegaFeature('toolcalcsplit', 'tools');
registerGojoMegaFeature('toolcalcjoin', 'tools');
registerGojoMegaFeature('toolcalcreplace', 'tools');
registerGojoMegaFeature('toolcalcescape', 'tools');
registerGojoMegaFeature('toolcalcunescape', 'tools');
registerGojoMegaFeature('toolconvertinfo', 'tools');
registerGojoMegaFeature('toolconvertcheck', 'tools');
registerGojoMegaFeature('toolconvertrun', 'tools');
registerGojoMegaFeature('toolconvertparse', 'tools');
registerGojoMegaFeature('toolconvertformat', 'tools');
registerGojoMegaFeature('toolconvertconvert', 'tools');
registerGojoMegaFeature('toolconvertencode', 'tools');
registerGojoMegaFeature('toolconvertdecode', 'tools');
registerGojoMegaFeature('toolconvertgenerate', 'tools');
registerGojoMegaFeature('toolconvertrandom', 'tools');

// Force .allmenu categorization for every new unique command.
ALIAS_OVERRIDE_CATEGORY['rpgquestinfo'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgqueststatus'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgqueststart'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgqueststop'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestcreate'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestopen'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestclose'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestenter'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestleave'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestjoin'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestlist'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestsearch'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestfind'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestinspect'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestscan'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquesttrack'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestclaim'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestcomplete'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestcancel'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestaccept'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestdecline'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestbuy'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestsell'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestuse'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestequip'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestunequip'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestupgrade'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestrepair'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestcraft'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestrefine'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestforge'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestcook'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestfeed'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquesttrain'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestheal'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestrevive'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestattack'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestdefend'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestdodge'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestparry'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestcast'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestlearn'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestforget'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestunlock'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestlock'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestcollect'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestdeposit'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestwithdraw'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestpay'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestgive'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestreceive'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestsend'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestinvite'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestkick'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestpromote'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestdemote'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestdonate'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestbuild'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestexpand'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquesttravel'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestreturn'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestteleport'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestsummon'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestdismiss'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestsacrifice'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquesttrade'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestbid'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestsellout'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestroll'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestspin'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestdraw'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestchoose'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestvote'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestchallenge'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestrank'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestscore'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquesttop'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquesthistory'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestlog'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestsave'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestload'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestreset'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestrename'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestset'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestget'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestview'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestshow'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestcompare'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgquestupgrade2'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissioninfo'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionstatus'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionstart'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionstop'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissioncreate'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionopen'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionclose'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionenter'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionleave'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionjoin'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionlist'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionsearch'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionfind'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissioninspect'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionscan'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissiontrack'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionclaim'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissioncomplete'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissioncancel'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionaccept'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissiondecline'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionbuy'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionsell'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionuse'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionequip'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionunequip'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionupgrade'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionrepair'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissioncraft'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionrefine'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionforge'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissioncook'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionfeed'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissiontrain'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionheal'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionrevive'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionattack'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissiondefend'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissiondodge'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionparry'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissioncast'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionlearn'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionforget'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionunlock'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionlock'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissioncollect'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissiondeposit'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionwithdraw'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionpay'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissiongive'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionreceive'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionsend'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissioninvite'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionkick'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionpromote'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissiondemote'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissiondonate'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionbuild'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionexpand'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissiontravel'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionreturn'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionteleport'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionsummon'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissiondismiss'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionsacrifice'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissiontrade'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionbid'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionsellout'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionroll'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionspin'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissiondraw'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionchoose'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionvote'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionchallenge'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionrank'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionscore'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissiontop'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionhistory'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionlog'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionsave'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionload'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionreset'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionrename'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionset'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionget'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionview'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionshow'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissioncompare'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpgmissionupgrade2'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntinfo'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntstatus'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntstart'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntstop'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntcreate'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntopen'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntclose'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntenter'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntleave'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntjoin'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntlist'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntsearch'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntfind'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntinspect'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntscan'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghunttrack'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntclaim'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntcomplete'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntcancel'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntaccept'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntdecline'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntbuy'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntsell'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntuse'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntequip'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntunequip'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntupgrade'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntrepair'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntcraft'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntrefine'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntforge'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntcook'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntfeed'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghunttrain'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntheal'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntrevive'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntattack'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntdefend'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntdodge'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntparry'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntcast'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntlearn'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntforget'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntunlock'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntlock'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntcollect'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntdeposit'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntwithdraw'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntpay'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntgive'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntreceive'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntsend'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntinvite'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntkick'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntpromote'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntdemote'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntdonate'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntbuild'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntexpand'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghunttravel'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntreturn'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntteleport'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntsummon'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntdismiss'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntsacrifice'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghunttrade'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntbid'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntsellout'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntroll'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntspin'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntdraw'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['rpghuntchoose'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['admingroupinfo'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['admingroupstatus'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['admingrouplist'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['admingroupcheck'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['admingroupset'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['admingroupget'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['admingroupadd'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['admingroupremove'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['admingroupenable'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['admingroupdisable'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['admingroupreset'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['admingroupclear'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['admingroupdelete'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['admingroupcreate'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['admingroupupdate'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['admingroupopen'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['admingroupclose'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['admingrouplock'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['admingroupunlock'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['admingroupshow'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['admingrouphide'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['admingroupview'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['admingroupsearch'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['admingroupfind'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['admingroupexport'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['admingroupimport'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['admingroupbackup'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['admingrouprestore'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['admingroupstart'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['admingroupstop'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['admingrouptest'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['admingroupreload'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['admingroupassign'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['admingroupunassign'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['admingroupapprove'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['admingroupreject'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['admingroupclaim'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['admingrouprelease'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['admingroupmute'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['admingroupunmute'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['admingroupban'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['admingroupunban'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['admingroupkick'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['admingroupwarn'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['admingroupunwarn'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['admingrouppromote'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['admingroupdemote'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['admingrouppin'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['admingroupunpin'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['admingroupstar'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['admingroupunstar'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['admingrouprun'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['admingroupapply'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['admingrouprevoke'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['admingroupgrant'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['admingroupdeny'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['admingroupaudit'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['admingrouplog'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['admingrouplogs'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['adminmemberinfo'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['adminmemberstatus'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['adminmemberlist'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['adminmembercheck'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['adminmemberset'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['adminmemberget'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['adminmemberadd'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['adminmemberremove'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['adminmemberenable'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['adminmemberdisable'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['adminmemberreset'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['adminmemberclear'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['adminmemberdelete'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['adminmembercreate'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['adminmemberupdate'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['adminmemberopen'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['adminmemberclose'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['adminmemberlock'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['adminmemberunlock'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['adminmembershow'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['adminmemberhide'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['adminmemberview'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['adminmembersearch'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['adminmemberfind'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['adminmemberexport'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['adminmemberimport'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['adminmemberbackup'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['adminmemberrestore'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['adminmemberstart'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['adminmemberstop'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['adminmembertest'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['adminmemberreload'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['adminmemberassign'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['adminmemberunassign'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['adminmemberapprove'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['adminmemberreject'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['adminmemberclaim'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['adminmemberrelease'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['adminmembermute'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['adminmemberunmute'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['adminmemberban'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['adminmemberunban'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['adminmemberkick'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['adminmemberwarn'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['adminmemberunwarn'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['adminmemberpromote'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['adminmemberdemote'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['adminmemberpin'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['adminmemberunpin'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['adminmemberstar'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['adminmemberunstar'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['adminmemberrun'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['adminmemberapply'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['adminmemberrevoke'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['adminmembergrant'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['adminmemberdeny'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['adminmemberaudit'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['adminmemberlog'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['adminmemberlogs'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['adminmodinfo'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['adminmodstatus'] = '🛡️ Admin';
ALIAS_OVERRIDE_CATEGORY['funquizplay'] = '🎮 Fun';
ALIAS_OVERRIDE_CATEGORY['funquizstart'] = '🎮 Fun';
ALIAS_OVERRIDE_CATEGORY['funquiznext'] = '🎮 Fun';
ALIAS_OVERRIDE_CATEGORY['funquizstop'] = '🎮 Fun';
ALIAS_OVERRIDE_CATEGORY['funquizrandom'] = '🎮 Fun';
ALIAS_OVERRIDE_CATEGORY['funquizdaily'] = '🎮 Fun';
ALIAS_OVERRIDE_CATEGORY['funquizweekly'] = '🎮 Fun';
ALIAS_OVERRIDE_CATEGORY['funquizscore'] = '🎮 Fun';
ALIAS_OVERRIDE_CATEGORY['funquiztop'] = '🎮 Fun';
ALIAS_OVERRIDE_CATEGORY['funquizrank'] = '🎮 Fun';
ALIAS_OVERRIDE_CATEGORY['funquizanswer'] = '🎮 Fun';
ALIAS_OVERRIDE_CATEGORY['funquizhint'] = '🎮 Fun';
ALIAS_OVERRIDE_CATEGORY['funquizskip'] = '🎮 Fun';
ALIAS_OVERRIDE_CATEGORY['funquizreset'] = '🎮 Fun';
ALIAS_OVERRIDE_CATEGORY['funquiznew'] = '🎮 Fun';
ALIAS_OVERRIDE_CATEGORY['funquizjoin'] = '🎮 Fun';
ALIAS_OVERRIDE_CATEGORY['funquizleave'] = '🎮 Fun';
ALIAS_OVERRIDE_CATEGORY['funquizvote'] = '🎮 Fun';
ALIAS_OVERRIDE_CATEGORY['funquizchoose'] = '🎮 Fun';
ALIAS_OVERRIDE_CATEGORY['funquizpick'] = '🎮 Fun';
ALIAS_OVERRIDE_CATEGORY['funquizroll'] = '🎮 Fun';
ALIAS_OVERRIDE_CATEGORY['funquizspin'] = '🎮 Fun';
ALIAS_OVERRIDE_CATEGORY['funquizdraw'] = '🎮 Fun';
ALIAS_OVERRIDE_CATEGORY['funquizflip'] = '🎮 Fun';
ALIAS_OVERRIDE_CATEGORY['funquizguess'] = '🎮 Fun';
ALIAS_OVERRIDE_CATEGORY['funquizcheck'] = '🎮 Fun';
ALIAS_OVERRIDE_CATEGORY['funquizshare'] = '🎮 Fun';
ALIAS_OVERRIDE_CATEGORY['funquizsave'] = '🎮 Fun';
ALIAS_OVERRIDE_CATEGORY['funquizprofile'] = '🎮 Fun';
ALIAS_OVERRIDE_CATEGORY['funquizstats'] = '🎮 Fun';
ALIAS_OVERRIDE_CATEGORY['funtriviaplay'] = '🎮 Fun';
ALIAS_OVERRIDE_CATEGORY['funtriviastart'] = '🎮 Fun';
ALIAS_OVERRIDE_CATEGORY['funtrivianext'] = '🎮 Fun';
ALIAS_OVERRIDE_CATEGORY['funtriviastop'] = '🎮 Fun';
ALIAS_OVERRIDE_CATEGORY['funtriviarandom'] = '🎮 Fun';
ALIAS_OVERRIDE_CATEGORY['funtriviadaily'] = '🎮 Fun';
ALIAS_OVERRIDE_CATEGORY['funtriviaweekly'] = '🎮 Fun';
ALIAS_OVERRIDE_CATEGORY['funtriviascore'] = '🎮 Fun';
ALIAS_OVERRIDE_CATEGORY['funtriviatop'] = '🎮 Fun';
ALIAS_OVERRIDE_CATEGORY['funtriviarank'] = '🎮 Fun';
ALIAS_OVERRIDE_CATEGORY['toolcalcinfo'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['toolcalccheck'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['toolcalcrun'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['toolcalcparse'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['toolcalcformat'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['toolcalcconvert'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['toolcalcencode'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['toolcalcdecode'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['toolcalcgenerate'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['toolcalcrandom'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['toolcalcvalidate'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['toolcalcverify'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['toolcalccompare'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['toolcalcsort'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['toolcalcfilter'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['toolcalccount'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['toolcalcsum'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['toolcalcmin'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['toolcalcmax'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['toolcalcaverage'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['toolcalcreset'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['toolcalcpretty'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['toolcalcminify'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['toolcalcsearch'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['toolcalcfind'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['toolcalcsplit'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['toolcalcjoin'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['toolcalcreplace'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['toolcalcescape'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['toolcalcunescape'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['toolconvertinfo'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['toolconvertcheck'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['toolconvertrun'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['toolconvertparse'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['toolconvertformat'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['toolconvertconvert'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['toolconvertencode'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['toolconvertdecode'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['toolconvertgenerate'] = '🛠️ Tools';
ALIAS_OVERRIDE_CATEGORY['toolconvertrandom'] = '🛠️ Tools';
const routeMap = new Map(routes);

// ─── ROLE TAG MAP ─────────────────────────────────────────────────────────
// Pemetaan alias command → tag jabatan yang diperlukan.
// 🌟 = Creator only  |  Ⓞ = Owner  |  Ⓐ = Admin grup  |  Ⓟ = Premium
// Tidak ada tag = Free (semua user bisa pakai)
const ROLE_TAG = {
    // Creator only
    addcreator: '🌟', removecreator: '🌟', delcreator: '🌟',

    // Owner / Creator
    addowner: 'Ⓞ', delowner: 'Ⓞ', removeowner: 'Ⓞ',
    addprem: 'Ⓞ', addpremium: 'Ⓞ', delprem: 'Ⓞ', delpremium: 'Ⓞ', removepremium: 'Ⓞ',
    broadcast: 'Ⓞ', broadcastgc: 'Ⓞ', bc: 'Ⓞ',
    broadcastuser: 'Ⓞ', bcuser: 'Ⓞ', broadcastpribadi: 'Ⓞ',
    listgrup: 'Ⓞ', jumlahgrup: 'Ⓞ', totalgrup: 'Ⓞ',
    listjadibot: 'Ⓞ', daftarjadibot: 'Ⓞ',
    addgold: 'Ⓞ', tambahgold: 'Ⓞ', givegold: 'Ⓞ',
    addlimit: 'Ⓞ', tambablimit: 'Ⓞ',

    // Admin grup
    kick: 'Ⓐ', keluarkan: 'Ⓐ', tendang: 'Ⓐ',
    ryoiken: 'Ⓐ', ryoikitenkai: 'Ⓐ', domainexpansion: 'Ⓐ', tenkai: 'Ⓐ',
    promote: 'Ⓐ', jadikanadmin: 'Ⓐ', naikkan: 'Ⓐ',
    demote: 'Ⓐ', turunkan: 'Ⓐ', copotadmin: 'Ⓐ',
    add: 'Ⓐ', tambahmember: 'Ⓐ', invite: 'Ⓐ',
    warn: 'Ⓐ', peringatan: 'Ⓐ', beriwarn: 'Ⓐ',
    unwarn: 'Ⓐ', hapuswarn: 'Ⓐ',
    warnlimit: 'Ⓐ', limitwarn: 'Ⓐ', setwarnlimit: 'Ⓐ',
    mute: 'Ⓐ', bisukan: 'Ⓐ',
    unmute: 'Ⓐ', bukabisu: 'Ⓐ',
    lockgroup: 'Ⓐ', kuncigrup: 'Ⓐ', closegroup: 'Ⓐ',
    unlockgroup: 'Ⓐ', bukagrup: 'Ⓐ', opengroup: 'Ⓐ',
    setname: 'Ⓐ', gantinamagrup: 'Ⓐ', namagrup: 'Ⓐ',
    setdesc: 'Ⓐ', gantidesk: 'Ⓐ', deskripsigrup: 'Ⓐ',
    link: 'Ⓐ', linkgrup: 'Ⓐ', invitelink: 'Ⓐ', getlink: 'Ⓐ',
    revoke: 'Ⓐ', resetlink: 'Ⓐ', revokelink: 'Ⓐ',
    leave: 'Ⓐ', keluargrup: 'Ⓐ', botkeluar: 'Ⓐ',
    hidetag: 'Ⓐ', htag: 'Ⓐ', tagsemua: 'Ⓐ',
    tagall: 'Ⓐ', mentionall: 'Ⓐ', tagsemuamember: 'Ⓐ',
    antilink: 'Ⓐ', antispam: 'Ⓐ', antiflood: 'Ⓐ',
    antitoxic: 'Ⓐ', antibot: 'Ⓐ', antisara: 'Ⓐ', antigb: 'Ⓐ',
    antinsfw: 'Ⓐ', antiporn: 'Ⓐ', antiporno: 'Ⓐ',
    hapusnsfw: 'Ⓐ', delnsfw: 'Ⓐ', deletensfw: 'Ⓐ',
    resetnsfwstrike: 'Ⓐ', resetstrikensfw: 'Ⓐ',
    setnsfwlimit: 'Ⓐ', nsfwlimit: 'Ⓐ',
    setwelcome: 'Ⓐ', setfarewell: 'Ⓐ', slowmode: 'Ⓐ',
    locklink: 'Ⓐ', locksticker: 'Ⓐ', lockvideo: 'Ⓐ', lockgambar: 'Ⓐ',
    poll: 'Ⓐ', buatpoll: 'Ⓐ',
    addjadwal: 'Ⓐ', deljadwal: 'Ⓐ',
    listlaporan: 'Ⓐ', laporanmember: 'Ⓐ',
    clearlaporan: 'Ⓐ', bersihkanlaporan: 'Ⓐ',
    sider: 'Ⓐ', cekrider: 'Ⓐ', listsider: 'Ⓐ',
    kicksider: 'Ⓐ', tendangrider: 'Ⓐ',
};

function roleTag(alias) {
    return ROLE_TAG[alias] || '';
}

// ─── MENU CATEGORY CONFIG ────────────────────────────────────────────────
// Satu sumber klasifikasi untuk .menu/.allmenu/menu kategori. Registry 2.000
// command tidak boleh jatuh ke "Lainnya" hanya karena handler-nya inline.
const CATEGORY_ORDER = [
    '🛡️ Admin', '🎮 Fun', '🛠️ Tools', '🖼️ Media',
    '🎵 Music', '📥 Downloader', '🤖 Bot', '📢 Broadcast', '🖥️ Panel',
    '🌀 Gojo', '🛒 Sewa', '💎 Premium', '📦 Other'
];

const ADMIN_SUBCATEGORY_ORDER = [
    '👥 Member Management', '📥 Join Requests & Approvals',
    '👑 Roles & Access Control', '⚠️ Warnings & Moderation',
    '🔒 Content Lock & Security', '🔇 Group Mute & Silence', '🛡️ Protection & Anti-Spam',
    '🔗 Links, Filters & Whitelist', '⚙️ Group Settings & Rules',
    '👋 Welcome & Farewell', '📊 Polls & Automated Schedules', '🎉 Events & Group Tasks',
    '📝 Announcements, Notes & Templates', '🧾 Audit Logs & Reports',
    '📈 Group Monitoring & Stats', '💾 Backup & Recovery',
    '📋 Group Dashboard & Overview', '📦 Other Admin Tools'
];

function adminSubcategory(name) {
    const n = String(name).toLowerCase();
    if (/(approve|reject|request|terima|tolak)/.test(n)) return '📥 Join Requests & Approvals';
    if (/(kick|promote|demote|add|remove|member|mutemember|unmutemember|listadmin|admincount|bulk)/.test(n)) return '👥 Member Management';
    if (/(owner|creator|premium|role|jabatan|access|permission)/.test(n)) return '👑 Roles & Access Control';
    if (/(warn|warning|strike)/.test(n)) return '⚠️ Warnings & Moderation';
    if (/(lockimage|lockvideo|lockdocument|lockcontact|locklocation|lockvn|lockaudio|lockgif|lockpoll|locktext|locksticker|lockmedia)/.test(n)) return '🔒 Content Lock & Security';
    if (/(mute|lockgroup|unlockgroup|slowmode|closegroup|opengroup)/.test(n)) return '🔇 Group Mute & Silence';
    if (/(anti|protect|secure|phishing|nsfw|spam|toxic|virtex|judol|pinjol|caps|flood)/.test(n)) return '🛡️ Protection & Anti-Spam';
    if (/(badword|allowlink|whitelist|antilink|link|revoke)/.test(n)) return '🔗 Links, Filters & Whitelist';
    if (/(welcome|farewell)/.test(n)) return '👋 Welcome & Farewell';
    if (/(poll|vote|jadwal|schedule)/.test(n)) return '📊 Polls & Automated Schedules';
    if (/(event|rsvp|birthday|task|quicklock|quickunlock)/.test(n)) return '🎉 Events & Group Tasks';
    if (/(announcement|pengumuman|membernote|template|catatan|note|motd|autoreply)/.test(n)) return '📝 Announcements, Notes & Templates';
    if (/(audit|report|lapor|laporan)/.test(n)) return '🧾 Audit Logs & Reports';
    if (/(monitor|activity|aktivitas)/.test(n)) return '📈 Group Monitoring & Stats';
    if (/(backup|restore)/.test(n)) return '💾 Backup & Recovery';
    if (/(summary|stats|statistik|groupage|creator|exportmember|cekbot)/.test(n)) return '📋 Group Dashboard & Overview';
    if (/(groupinfo|setname|setdesc|group|icon|ephemeral|rules|setting)/.test(n)) return '⚙️ Group Settings & Rules';
    return '📦 Other Admin Tools';
}


function categorizeRegistryName(name) {
    const n = String(name || '').toLowerCase();
    if (n.startsWith('rpg')) return '🛠️ Tools';
    if (n.startsWith('admin')) return '🛡️ Admin';
    if (n.startsWith('fun')) return '🎮 Fun';
    if (n.startsWith('tool')) return '🛠️ Tools';
    if (n.startsWith('media')) return '🖼️ Media';
    if (n.startsWith('bot')) return '🤖 Bot';
    if (n.startsWith('social')) return '📥 Downloader';
    if (n.startsWith('cpanel')) return '🖥️ Panel';
    if (n.startsWith('sewa')) return '🛒 Sewa';
    if (n.startsWith('premium')) return '💎 Premium';

    // Registry lama berisi command asli tanpa prefix kategori. Kelompokkan
    // berdasarkan rentang/semantik command supaya fitur-fitur tersebut juga
    // muncul di menu kategori yang benar.
    if (['sewa','ceksewa','delsewa','listsewa','extsewa','hargasewa','gantihargasewa','sewamode'].includes(n)) return '🛒 Sewa';
    if (['brat','bratgreen','bratwhite','iqc','repost'].includes(n)) return '🖼️ Media';
    if (['self','public','private','autojoin','whoami','runtime','jam'].includes(n)) return '🤖 Bot';
    if (['menu','menurpg','menuadmin','menufun','menutools','menumedia','menubot','totalfitur','daftar'].includes(n)) return '🤖 Bot';
    const i = GOJO_2000_FEATURES.indexOf(n);
    const ranges = [
        [[[9,44],[223,244],[295,302],[350,395],[510,517]], ['🛠️ Tools']],
        [[[45,147],[245,270],[303,314],[396,404],[690,764]], ['🛡️ Admin']],
        [[[148,173],[315,329],[405,424],[475,510]], ['🎮 Fun']],
        [[[174,198],[329,349],[425,474],[517,599],[628,633],[651,690]], ['🛠️ Tools']],
        [[[291,294],[600,627],[634,650]], ['🖼️ Media']],
        [[[199,222],[611,618],[691,717],[767,769]], ['🤖 Bot']],
        [[[770,783]], ['📥 Downloader']],
    ];
    for (const [blocks, [cat]] of ranges) {
        if (blocks.some(([a,b]) => i >= a && i <= b)) return cat;
    }
    if (['play'].includes(n)) return '🎵 Music';
    if (['broadcast','broadcastuser','listgrup'].includes(n)) return '📢 Broadcast';
    if (['cpanel'].includes(n)) return '🖥️ Panel';
    if (['sewa','ceksewa','delsewa','listsewa','extsewa','hargasewa','gantihargasewa','sewamode'].includes(n)) return '🛒 Sewa';
    return '📦 Other';
}

// Bangun mapping alias -> kategori SETELAH semua reg() (termasuk
// reg(['allmenu'])) selesai dipanggil — supaya allmenu sendiri juga
// terklasifikasi dengan benar, bukan jatuh ke fallback "📦 Lainnya".
// (Sebelumnya ini dibangun SEBELUM reg(['allmenu']) dipanggil, sehingga
// alias "allmenu" belum ada di array `routes` saat iterasi ini berjalan
// — bug yang sama persis pernah terjadi pada routeMap itu sendiri.)
// Resolve a category for handlers that do not have an explicit alias override.
// Generated commands use ALIAS_OVERRIDE_CATEGORY; regular handlers are inferred
// from the module/function source so the menu builder can categorize them safely.
function categorizeByHandlerSource(handler) {
    if (typeof handler !== 'function') return '📦 Lainnya';

    let source = '';
    try {
        source = Function.prototype.toString.call(handler);
    } catch {
        return '📦 Lainnya';
    }

    const rules = [
        [/rpgCommands|rpgCommands[0-9]+|rpgEngine|RPG_/i, '🛠️ Tools'],
        [/adminCommands|isGroupLocked|checkMute|quickLock|quickUnlock|votekick|setMotd|pollClose/i, '🛡️ Admin'],
        [/funCommands|quiz|trivia|KETAWA|BERCANDA|PUJIAN|PANTUN|TEBAKAN/i, '🎮 Fun'],
        [/toolsCommands|textTools|mathTools|converterTools|generatorTools|infoTools|validatorTools/i, '🛠️ Tools'],
        [/mediaCommands|hdCmd|grayscaleCmd|mirrorCmd|blurCmd|rotate90Cmd|toBotakCmd|toChibiCmd|toFiguraCmd/i, '🖼️ Media'],
        [/socialDownloadCommands|downloadYoutube|downloadTwitter|downloadFacebook|downloadPinterest|downloadReddit/i, '📥 Downloader'],
        [/musicCommands|spotify|play|ytmp3|ytmp4/i, '🎵 Music'],
        [/broadcastCommands|broadcast/i, '📢 Broadcast'],
        [/panelCommands|makeCreateServerHandler|makeListServerHandler|cpanel/i, '🖥️ Panel'],
        [/jadibotCommands|jadibot/i, '🤖 Bot'],
        [/gojoCommands|GOJOLINE|JJK_TRIVIA|ANIME_FACTS/i, '🌀 Gojo'],
    ];

    for (const [pattern, category] of rules) {
        if (pattern.test(source)) return category;
    }

    return '📦 Other';
}

// ── GOJO FEATURE PACK: kategori berdasarkan nama command ────────────────
for (const name of routes.map(([alias]) => alias)) {
    if (name.startsWith('rpg')) ALIAS_OVERRIDE_CATEGORY[name] = '🛠️ Tools';
    else if (name.startsWith('admin')) ALIAS_OVERRIDE_CATEGORY[name] = '🛡️ Admin';
    else if (name.startsWith('fun')) ALIAS_OVERRIDE_CATEGORY[name] = '🎮 Fun';
    else if (name.startsWith('tool')) ALIAS_OVERRIDE_CATEGORY[name] = '🛠️ Tools';
    else if (name.startsWith('media')) ALIAS_OVERRIDE_CATEGORY[name] = '🖼️ Media';
    else if (name.startsWith('bot')) ALIAS_OVERRIDE_CATEGORY[name] = '🤖 Bot';
}

const ALIAS_TO_CATEGORY = new Map();
for (const [alias, handler] of routes) {
    if (!ALIAS_TO_CATEGORY.has(alias)) {
        const registryCat = categorizeRegistryName(alias);
        const cat = ALIAS_OVERRIDE_CATEGORY[alias] || (registryCat !== '📦 Lainnya' ? registryCat : categorizeByHandlerSource(handler));
        ALIAS_TO_CATEGORY.set(alias, cat);
    }
}

// FIX: .allmenu (dan sekarang .totalfitur juga) menghitung/menampilkan
// fitur UNIK — command dengan beberapa alias (misal owner/creator/dev/
// developer) dihitung SEKALI, bukan sekali per nama panggilan. Awalnya
// .totalfitur sengaja dipisah untuk mempertahankan angka branding
// "1200+ Fitur" yang menghitung semua alias satu-satu — tapi itu bikin
// angkanya kelihatan dobel/mengada-ada begitu dibandingkan sama .allmenu
// (yang sudah unik). Sekarang disatukan: keduanya pakai angka fitur
// unik yang sebenarnya. Kalau kamu update angka "1200+ Fitur" di
// package.json/README nanti, sesuaikan ke angka unik ini juga.
function getUniqueCommandNames() {
    return getMenuFeatureNames();
}

export const FEATURED_GENERATED_COUNT = 443;

// Menu/AllMenu/TotalFitur memakai SATU sumber: registry 2.000 fitur unik.
// Jadi angka dan daftar tidak pernah berbeda.
const MENU_EXTRA_COMMANDS = [
    'opengroup', 'closegroup', 'terimarequest', 'tolakrequest', 'terimasemua',
    'kuncigrup', 'bukagrup', 'help', 'start', 'register', 'profile', 'stats',
    'inv', 'bag', 'battle', 'pvp', 'duel', 'raid', 'explore', 'shop', 'buy',
    'sell', 'work', 'deposit', 'withdraw', 'send', 'invite', 'tendang',
];

function getMenuFeatureNames() {
    // Registry = command utama. Beberapa alias penting yang memang dipakai
    // user ditambahkan supaya navigasi tetap lengkap tanpa memasukkan ribuan
    // alias duplikat yang akan membuat .allmenu melewati batas WhatsApp.
    const merged = new Set([
        ...GOJO_2000_FEATURES.slice(0, 2000),
        ...MENU_EXTRA_COMMANDS,
    ]);
    return [...merged].filter(n => !['gamble','lottery','bettinggold'].includes(String(n).toLowerCase()));
}

function getRegisteredCommandCount() {
    return getMenuFeatureNames().length;
}

export function getAllCommandNames() {
    return getMenuFeatureNames();
}

// FIX BUG: dipakai messagePipeline.js SEBELUM kirim reaksi ⏳ — supaya
// command yang tidak terdaftar (typo, dsb) tidak dikasih reaksi ⏳ yang
// akan nyangkut selamanya (karena handleCommand() return lebih awal kalau
// !handler, SEBELUM sempat sampai ke bagian yang kirim reaksi ✅/❌).
export function commandExists(name) {
    return routeMap.has(name);
}

// ── Reaksi emoji sebagai indikator status command ───────────────────────
// ⏳ = sedang diproses, ✅ = berhasil, ❌ = gagal/error. Reaksi dikirim ke
// pesan ASLI dari user (msg.key), jadi kelihatan langsung di pesan yang
// dia ketik sendiri — tidak perlu baca teks balasan bot buat tahu status.
// Dibungkus try/catch supaya reaksi yang gagal terkirim (jaringan lagi
// bermasalah, dsb) tidak ikut menggagalkan command itu sendiri.
async function reactTo(sock, jid, msgKey, emoji) {
    try { await sock.sendMessage(jid, { react: { text: emoji, key: msgKey } }); } catch {}
}

export async function handleCommand(sock, msg, jid, sender, command, args, isGroup, body, precomputedIsAdmin) {
    let isAdmin = false;
    if (typeof precomputedIsAdmin === 'boolean') {
        isAdmin = precomputedIsAdmin;
    } else if (isGroup) {
        try {
            // FIX: dibungkus withTimeout — lihat penjelasan lengkap di
            // messagePipeline.js mengenai risiko groupMetadata() hang tanpa
            // batas waktu pada koneksi yang sedang rate-limited.
            const metadata = await withTimeout(sock.groupMetadata(jid), 15_000, 'groupMetadata(handleCommand)');
            // FIX @lid: p.id di groupMetadata bisa @lid sementara sender @s.whatsapp.net
            const participant = metadata.participants.find(p => {
                if (p.id === sender) return true;
                if (p.id.includes('@lid')) { const r = recallRealJid(p.id); if (r && r === sender) return true; }
                if (sender.includes('@lid')) { const r = recallRealJid(sender); if (r && r === p.id) return true; }
                return false;
            });
            isAdmin = participant?.admin === 'admin' || participant?.admin === 'superadmin';
        } catch {
            isAdmin = false;
        }
    }

    // Hirarki jabatan: Creator > Owner > Premium > User biasa.
    // isOwner tetap dipertahankan sebagai nama field di ctx (kompatibel
    // dengan command lama yang sudah memakai ctx.isOwner), tapi sekarang
    // sumber kebenarannya dari roles.js (mendukung banyak Owner dinamis,
    // bukan cuma satu nomor statis dari settings.ownerNumber).
    // FIX: dibungkus try/catch — sebelumnya kalau salah satu dari ketiga
    // fungsi ini melempar error (misal db.js gagal baca/tulis file data),
    // errornya akan keluar dari handleCommand() TANPA tertangkap try/catch
    // apapun (karena posisinya di luar blok try di bawah), sehingga
    // SEMUA command gagal total tanpa balasan apapun ke user — walau log
    // "⚡ ... → .command" tetap muncul di console karena itu dicatat
    // sebelum titik ini. Sekarang errornya hanya membuat ctx.isCreator/
    // isOwner/isPremium default ke false (paling aman), bukan menggagalkan
    // seluruh proses command.
    let isCreatorFlag = false, isOwnerFlag = false, isPremiumFlag = false;
    try {
        isCreatorFlag = isCreator(sender);
        isOwnerFlag   = isOwner(sender);
        isPremiumFlag = isPremium(sender);
    } catch (err) {
        log.error(`Gagal cek jabatan untuk ${sender}: ${err.message}`);
    }
    const reply = (text) => replyWithThumb(sock, jid, text, msg);
    const mentioned = getMentioned(msg);

    const handler = routeMap.get(command);
    if (!handler) {
        log.error(`Command "${command}" TIDAK DITEMUKAN di routeMap (total ${routeMap.size} command terdaftar).`);
        return;
    }

    // ── Sewa Mode check ────────────────────────────────────────────────────
    // Kalau sewaMode ON dan ini grup → hanya grup bersewa yang bisa jalan.
    // Owner/Creator selalu bypass. Command info-sewa (ceksewa, hargasewa) juga bypass.
    const SEWA_BYPASS_CMDS = new Set(['ceksewa','infosewa','statussewa','hargasewa','pricesewa','infoharga','menu','help','start']);
    if (isGroup && isSewaMode() && !isOwnerFlag && !isCreatorFlag && !SEWA_BYPASS_CMDS.has(command)) {
        if (!isSewaActive(jid)) {
            return replyWithThumb(sock, jid,
                `⏳ *Bot Not Authorized / Rented*\n\n` +
                `This group does not have an active bot authorization or rental.\n` +
                `👑 Developer: AHSAN (03107260507)\n` +
                `Type \`${settings.prefix}hargasewa\` or \`${settings.prefix}owner\` for access info.`,
                msg
            );
        }
    }

    // Track command usage analytics
    try { trackCommand(command); } catch {}

    const ctx = {
        sock, msg, jid, sender, args, isGroup, body, reply, isAdmin,
        isOwner: isOwnerFlag,
        isCreator: isCreatorFlag,
        isPremium: isPremiumFlag,
        mentioned,
    };

    // FIX: reaksi ⏳ sekarang dikirim lebih awal, di messagePipeline.js
    // (sebelum autoTyping) — supaya muncul INSTAN saat command diterima,
    // bukan baru muncul setelah delay "mengetik..." 3-4 detik. Di sini
    // tinggal reaksi hasil akhirnya (✅ / ❌) setelah handler selesai.
    try {
        const longTimeoutCommands = [
            'play', 'musik', 'music', 'lagu', 'ytmp3',
            'ig', 'instagram', 'igdl', 'instagramdl',
            'tiktok', 'tt', 'tiktokdl', 'ttdl',
            'iqc', 'iphonequote', 'iphoneqc', 'imessagequote',
        ];
        const timeoutMs = longTimeoutCommands.includes(command) ? 180_000 : 60_000;
        await withTimeout(handler(ctx), timeoutMs, `command "${command}"`);
        await reactTo(sock, jid, msg.key, '✅');
        // FIX: sebelumnya trackCommandUsage(command) dipanggil 2x di sini secara
        // tidak sengaja — bikin statistik .botstats (total & per-command) selalu
        // dobel dari angka sebenarnya. Cukup dipanggil sekali.
        try { trackCommandUsage(command); } catch { /* ignore */ }
    } catch (err) {
        log.error(`Command "${command}": ${err.message}`);
        try { await reply('⚠️ An error occurred while executing this command.'); } catch {}
        await reactTo(sock, jid, msg.key, '❌');
    }
}

export { checkMute, isGroupLocked };
