// ═══════════════════════════════════════════════════════════════════
//  COOLDOWN.JS — Per-user, per-command cooldown manager
//  Mencegah spam command & memberikan UX yang lebih baik
// ═══════════════════════════════════════════════════════════════════

import settings from '../setting.js';

// Map: `${sender}:${command}` → timestamp last used
const cd = new Map();

// ─── KATEGORI COMMAND ──────────────────────────────────────────────
const CAT = {
    rpg: new Set([
        'hunt','berburu','buru','lawan','battle','pvp','duel',
        'boss','raid','lawanboss','dungeon','masukdungeon','explore',
        'gacha','undianitem','expedition','ekspedisi',
        'mine','nambang','mengeruk','digging',
        'fish','mancing','memancingikan','gofishing',
        'craft','tempa','bikinitem','forge',
        'refine','perkuat','perkuatitem','enhance','upgradeitem',
        'gamble','taruhan','bettinggold','bet','pasangtaruhan',
        'lottery','lotre','beliundian','tiketlotre','buylottery',
        'train','latihan','latihangym','workout','gym',
        'prestige','naikprestige','rebornchar','ascend',
        'daily','klaim','absen','absenharian','klaimharian','rewardharian',
        'kerja','work','job','bekerja','cariuang','ngumpulgold',
        'rob','rampok','curi','merampok','mencuri','steal',
    ]),
    admin: new Set([
        'kick','keluarkan','tendang','promote','jadikanadmin','naikkan',
        'ryoiken','ryoikitenkai','domainexpansion','tenkai',
        'demote','turunkan','copotadmin','add','tambahmember','invite',
        'warn','peringatan','beriwarn','unwarn','hapuswarn',
        'mute','bisukan','unmute','bukabisu',
        'lockgroup','unlockgroup','setname','setdesc',
        'tagall','hidetag','ban','unban','poll','vote',
        'addjadwal','deljadwal','lapor','broadcast','bc',
        // v3.1.0: proteksi & member-management tambahan
        'antilinkphising','antijudol','antipinjol',
        'anticaps','antivirtex','antitag','antiflood',
        'resetprotection','antilinkall',
        'kickall','kicksemua','warnall','warnsemua','resetwarnall',
        'banlist','unbanall','mutemember','unmutemember',
        'lockimage','lockvideo','lockdocument','lockcontact',
        'locklocation','lockvn','lockaudio','lockgif','lockpoll',
        'whitelistadd','whitelistdel','addbadword','delbadword',
        'allowlinkadd','allowlinkdel','seticon','hapusicon',
        'lockinfo','unlockinfo','ephemeral','jadwalbuka','jadwaltutup',
        'approverequest','rejectrequest','approveall','rejectall',
        'backupsetting','restoresetting',
    ]),
    tools: new Set([
        'calc','bmi','bmidetail','umur','umurdetail',
        'convertlength','convertweight','suhu','suhulengkap',
        'diskon','splitbill','hitungtip','persen','persenubah',
        'caesarenkrip','caesardekrip','tomorse','frommorse',
        'genpassword','genuuid','gcdlcm','kuadrat',
        'average','median','fibonacci','roman',
    ]),
    menu: new Set([
        'menu','help','start','allmenu','menurpg','menuadmin',
        'menufun','menutools','menumedia','menubot','rpgmenu',
        'adminmenu','funmenu','toolsmenu','mediamenu','botmenu',
        'ping','cekping','pingbot','runtime','lamabotaktif','botuptime',
        'whoami','siapakahaku','mynumber','jam','waktusekarang','currenttime',
        'owner',
        'pembayaran','payment','bayar','sosmedowner','sosmed','socialmedia',
    ]),
};

function getCategory(cmd) {
    for (const [cat, set] of Object.entries(CAT)) {
        if (set.has(cmd)) return cat;
    }
    return 'fun';
}

function getDuration(cmd) {
    if (!settings.cooldownEnabled) return 0;
    const cat = getCategory(cmd);
    return settings.cooldowns?.[cat] ?? settings.defaultCooldown ?? 3000;
}

/**
 * Cek apakah sender sedang cooldown untuk command ini.
 * @returns {number} 0 = bebas, > 0 = sisa ms cooldown
 */
export function checkCooldown(sender, command) {
    const dur = getDuration(command);
    if (!dur) return 0;
    const key = `${sender}:${command}`;
    const last = cd.get(key) || 0;
    const remaining = dur - (Date.now() - last);
    return remaining > 0 ? remaining : 0;
}

/**
 * Catat bahwa sender baru saja menjalankan command.
 */
export function setCooldown(sender, command) {
    const dur = getDuration(command);
    if (!dur) return;
    cd.set(`${sender}:${command}`, Date.now());
}

/**
 * Generate pesan cooldown yang ramah & informatif.
 */
export function cooldownMsg(command, remainingMs) {
    const secs = (remainingMs / 1000).toFixed(1);
    const tips = [
        '☕ Minum kopi dulu boss~',
        '🧘 Sabar itu indah hehe',
        '💨 Tarik nafas dulu~',
        '🎵 Dengerin musik dulu yuk',
        '🌊 Santai, bot butuh napas juga 😂',
    ];
    const tip = tips[Math.floor(Math.random() * tips.length)];
    return `⏳ *Cooldown!*\n\nCommand *.${command}* masih cooldown *${secs} detik* lagi.\n\n${tip}`;
}

// Bersihkan cooldown lama setiap 5 menit
setInterval(() => {
    const cooldownVals = Object.values(settings.cooldowns || {});
    const maxAge = cooldownVals.length
        ? Math.max(...cooldownVals, settings.defaultCooldown || 3000, 300_000)
        : Math.max(settings.defaultCooldown || 3000, 300_000);
    const cutoff = Date.now() - maxAge;
    for (const [key, ts] of cd) {
        if (ts < cutoff) cd.delete(key);
    }
}, 5 * 60 * 1000);
