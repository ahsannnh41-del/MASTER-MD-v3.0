import settings from '../setting.js';
import { verifyIntegrity } from '../lib/integrity.js';

verifyIntegrity(settings);
import * as baileys from '@whiskeysockets/baileys';
const baileysPkg = baileys.default || baileys;
const prepareWAMessageMedia = baileys.prepareWAMessageMedia || baileysPkg.prepareWAMessageMedia;
const generateWAMessageFromContent = baileys.generateWAMessageFromContent || baileysPkg.generateWAMessageFromContent;
import { sendButton, sendList, sendCarousel, storeOutboundMessage } from '../lib/interactiveButtons.js';
import { fmtDuration, safeReplyText, truncate, withTimeout } from '../lib/utils.js';
import { resolveFfmpegPath } from '../lib/videoGen.js';
import { spawn } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { getChar } from '../lib/rpgEngine.js';
import { expNeeded } from '../lib/rpgData.js';
import { log } from '../lib/logger.js';
import { markMenuPending } from '../lib/menuShortcut.js';
import { getGroupMetadata } from '../lib/groupMetaCache.js';
import { getThumbnailImageContent } from '../lib/thumbnailSource.js';
import { mapChars, SMALLCAPS_MAP } from './toolsCommands11.js';
import { GOJO_2000_FEATURES } from './featureRegistry2000.js';

// FIX "font beda dari contoh": label section .menu sebelumnya pakai gaya
// unicode Bold-Italic Sans (𝙉𝙖𝙢𝙖, 𝑵𝑶𝑻𝑬, dst) — beda gaya sama contoh
// referensi yang dikasih user (gaya small-caps, mis. "ʙᴏᴛ ɪɴғᴏ"). sc()
// pakai SMALLCAPS_MAP yang SAMA persis dengan command .smallcaps yang
// sudah ada, supaya gaya font di .menu konsisten dengan tool bawaan bot.
// Diekspor (bukan cuma dipakai internal) supaya .allmenu di commands/index.js
// bisa pakai helper font yang SAMA — biar font section header di .allmenu
// konsisten dengan .menu, .menurpg, .menuadmin, dst (semua satu sumber).
export const sc = (text) => mapChars(text.toLowerCase(), SMALLCAPS_MAP);

const P   = settings.prefix   || '.';
const BOT = settings.botName  || 'MASTER MD';
const TAG = settings.botTagline || '⚡ Next-Gen WhatsApp Multi-Device Powerhouse by AHSAN ⚡';


// Registry category helper
const REGISTRY_CATEGORY_RANGES = {
    '🛡️ Admin': [[45,147],[245,270],[303,314],[396,404],[690,764]],
    '🎮 Fun': [[148,173],[315,329],[405,424],[475,510]],
    '🛠️ Tools': [[9,44],[174,198],[223,244],[295,302],[329,349],[350,395],[425,474],[510,517],[517,599],[628,633],[651,690]],
    '🖼️ Media': [[291,294],[600,627],[634,650]],
    '🤖 Bot': [[199,222],[611,618],[691,717],[767,769]],
    '📥 Downloader': [[770,783]],
};

const REGISTRY_CATEGORY_PREFIX = {
    admin: '🛡️ Admin', fun: '🎮 Fun', tool: '🛠️ Tools',
    media: '🖼️ Media', bot: '🤖 Bot', social: '📥 Downloader',
};

function registryCategory(name) {
    const n = String(name || '').toLowerCase();
    const prefix = Object.keys(REGISTRY_CATEGORY_PREFIX).find(p => n.startsWith(p));
    if (prefix) return REGISTRY_CATEGORY_PREFIX[prefix];
    if (['sewa','ceksewa','delsewa','listsewa','extsewa','hargasewa','gantihargasewa','sewamode'].includes(n)) return '🛒 Rental';
    if (['brat','bratgreen','bratwhite','iqc','repost'].includes(n)) return '🖼️ Media';
    if (['self','public','private','autojoin','whoami','runtime','jam'].includes(n)) return '🤖 Bot';
    if (['menu','menurpg','menuadmin','menufun','menutools','menumedia','menubot','totalfitur','daftar'].includes(n)) return '🤖 Bot';
    const i = GOJO_2000_FEATURES.indexOf(n);
    for (const [cat, blocks] of Object.entries(REGISTRY_CATEGORY_RANGES)) {
        if (blocks.some(([a,b]) => i >= a && i <= b)) return cat;
    }
    if (n === 'play') return '🎵 Music';
    if (['broadcast','broadcastuser','listgrup'].includes(n)) return '📢 Broadcast';
    if (n === 'cpanel') return '🖥️ Panel';
    if (['sewa','ceksewa','delsewa','listsewa','extsewa','hargasewa','gantihargasewa','sewamode'].includes(n)) return '🛒 Rental';
    return '📦 Miscellaneous';
}

function compactMenuDescription(name) {
    const text = getFeatureDescription(name);
    if (text.length <= 34) return text;
    return text.slice(0, 34).replace(/[ ,.;:!?-]+$/,'') + '…';
}

const CURATED_MENU_COMMANDS = new Set([
    'achievement',
    'add',
    'addannouncement',
    'addbadword',
    'addjadwal',
    'addmembernote',
    'addnote',
    'addowner',
    'addprem',
    'admincount',
    'afirmasihariini',
    'aktivitasgrup',
    'allmenu',
    'allowlinkadd',
    'allowlinkdel',
    'allowlinklist',
    'alternating',
    'anagram',
    'angkakeberuntungan',
    'anticaps',
    'antidelete',
    'antigb',
    'antijudol',
    'antilink',
    'antilinkall',
    'antilinkphising',
    'antinsfw',
    'antipinjol',
    'antishortlink',
    'antispam',
    'antitag',
    'antitoxic',
    'antivirtex',
    'approveall',
    'approverequest',
    'asciitext',
    'assigntask',
    'atbash',
    'aturautobalas',
    'autoreply',
    'average',
    'averagespeed',
    'backupnow',
    'backupsetting',
    'ban',
    'banlist',
    'beli',
    'binaryops',
    'blokirpengguna',
    'bmi',
    'bmidetail',
    'bmr',
    'boss',
    'bossinfo',
    'botstats',
    'bounty',
    'brat',
    'brighten',
    'broadcast',
    'broadcastuser',
    'buatpolling',
    'bukablokirpengguna',
    'bulkdemote',
    'bulkkick',
    'bulkpromote',
    'businessdays',
    'buypet',
    'caesardekrip',
    'caesarenkrip',
    'calc',
    'camelcase',
    'canceljadwalgrup',
    'cekaturangrup',
    'cekbot',
    'cekcc',
    'cekemail',
    'cekjabatan',
    'cekjadwalgrup',
    'ceknohp',
    'cekpalindrom',
    'cekpassword',
    'cekprima',
    'cekwarnall',
    'changelog',
    'checkwarn',
    'circlearea',
    'claimbounty',
    'class',
    'clearlaporan',
    'coinflip',
    'compliment',
    'compoundinterest',
    'convertlength',
    'convertweight',
    'cook',
    'cpanel',
    'craft',
    'createevent',
    'credits',
    'currencyformat',
    'dadjoke',
    'daily',
    'dare',
    'delannouncement',
    'delay',
    'delbadword',
    'deljadwal',
    'delmembernote',
    'delnote',
    'delowner',
    'delprem',
    'deltemplate',
    'demote',
    'dice',
    'digitalroot',
    'diskon',
    'divorce',
    'dogyears',
    'donetask',
    'drawcard',
    'dungeon',
    'dungeoninfo',
    'emojirandom',
    'ephemeral',
    'equip',
    'equiptitle',
    'eventattendees',
    'expedition',
    'exportmember',
    'extractaudio',
    'extractnumbers',
    'fact',
    'faktorial',
    'farewell',
    'farmstatus',
    'fibonacci',
    'fish',
    'flipvertical',
    'fortunecookie',
    'frekuensikata',
    'frombase64',
    'frombinary',
    'fromhex',
    'frommorse',
    'fueleff',
    'gacha',
    'gcdlcm',
    'genpassword',
    'genuuid',
    'gojo',
    'gojoai',
    'gojofact',
    'gojohype',
    'gojopower',
    'gojoroast',
    'gojoteknik',
    'gpacalc',
    'grayscale',
    'groupage',
    'groupcreator',
    'groupinfo',
    'grouplinkqr',
    'grouplockstatus',
    'groupsummary',
    'guesshilo',
    'guildcreate',
    'guilddisband',
    'guilddonate',
    'guildinfo',
    'guildjoin',
    'guildkick',
    'guildleave',
    'guildlist',
    'guildmembers',
    'guildpromote',
    'guildupgrade',
    'hammingdistance',
    'hapusicon',
    'hapuspengumuman',
    'hapusvokal',
    'harike',
    'harvest',
    'hashtaggen',
    'hasilpoll',
    'hd',
    'helpproteksi',
    'hex2rgb',
    'hidetag',
    'hitungkonsonan',
    'hitungtip',
    'hitungvokal',
    'hunt',
    'ibancheck',
    'ig',
    'inventory',
    'iqc',
    'istirahat',
    'jadibot',
    'jadwalbuka',
    'jadwaltutup',
    'jam',
    'jawabriddle2',
    'jawabscramble',
    'jawabtrivia',
    'joblist',
    'jodoh',
    'jsonvalidate',
    'jual',
    'katahariini',
    'kebabcase',
    'kepribadianhariini',
    'kerja',
    'kick',
    'kickall',
    'kicksider',
    'klaimekspedisi',
    'konspirasi',
    'kuadrat',
    'lapor',
    'lawan',
    'leaderboard',
    'leapyear',
    'leapyearlist',
    'leave',
    'leet',
    'levenshtein',
    'lihatautobalas',
    'lihatcatatan',
    'link',
    'listadmin',
    'listannouncement',
    'listautoreply',
    'listbadword',
    'listbirthday',
    'listevents',
    'listgrup',
    'listinactive',
    'listjadibot',
    'listjadwal',
    'listlaporan',
    'listmembernote',
    'listmutedmember',
    'listowner',
    'listpoll',
    'listprem',
    'listrequest',
    'listsuggestions',
    'listtasks',
    'listtemplate',
    'listunique',
    'loadtemplate',
    'lockaudio',
    'lockcontact',
    'lockdocument',
    'lockgif',
    'lockgroup',
    'lockimage',
    'lockinfo',
    'locklocation',
    'lockmedia',
    'lockpoll',
    'lockstiker',
    'locktext',
    'lockvideo',
    'lockvn',
    'loremipsum',
    'lovecalc',
    'lower',
    'magic8ball',
    'maintenancemode',
    'marry',
    'massconvert',
    'mbtitoday',
    'mediainfo',
    'median',
    'membercount',
    'menuadmin',
    'menubot',
    'menumedia',
    'menurpg',
    'menutools',
    'mine',
    'moodku',
    'motd',
    'mute',
    'mutemember',
    'mutestatus',
    'mutevideo',
    'mytasks',
    'nabung',
    'ncr',
    'nextweekday',
    'nomorhoki',
    'notes',
    'numeronim',
    'owner',
    'pantun',
    'pembayaran',
    'pembukacerita',
    'pengagumrahasia',
    'pengumuman',
    'pernahkah',
    'persen',
    'persenubah',
    'petinfo',
    'petshop',
    'pilih',
    'pilihini',
    'ping',
    'pingenerate',
    'plant',
    'play',
    'poll',
    'pollclose',
    'pollnative',
    'pp',
    'ppgrup',
    'pressureconvert',
    'prestige',
    'previewwelcome',
    'profil',
    'promote',
    'pujianrandom2',
    'qrcode',
    'quest',
    'questclaim',
    'quicklock',
    'quickunlock',
    'quote',
    'railfence',
    'randomcolorname',
    'randomname',
    'randomword',
    'ranking',
    'ratehariini',
    'rayuan',
    'readingtime',
    'recipes',
    'refine',
    'regextest',
    'rejectall',
    'rejectrequest',
    'removedupewords',
    'removepunctuation',
    'repost',
    'resetprotection',
    'resetwarnall',
    'restoresetting',
    'retirement',
    'reverse',
    'reversevideo',
    'revoke',
    'riddle',
    'riddle2',
    'roast',
    'rob',
    'rolldadu',
    'rollnotation',
    'roman',
    'rot13',
    'rot47',
    'rotate90',
    'rpg',
    'rps',
    'rsvp',
    'rules',
    'runtime',
    'savetemplate',
    'sepia',
    'setbirthday',
    'setdesc',
    'setfarewell',
    'seticon',
    'setmotd',
    'setname',
    'setpengumuman',
    'setpet',
    'setrules',
    'setwelcome',
    'sewa',
    'shorturl',
    'shuffle',
    'sider',
    'simpancatatan',
    'simplifyfraction',
    'sisahari',
    'slot',
    'slowmode',
    'slowmodeoff',
    'slugify',
    'snakecase',
    'sosmedowner',
    'speedup',
    'splitbill',
    'statdetail',
    'statistikgrup',
    'statsgrupmember',
    'stdev',
    'sticker',
    'stopbot',
    'strikethrough',
    'suggest',
    'suhu',
    'suhulengkap',
    'support',
    'syllable',
    'tagall',
    'tanggalrandom',
    'tantanganrandom',
    'tarik',
    'tarot',
    'tax',
    'tebak',
    'tebakangka',
    'tebakgambar',
    'tebakhilo',
    'textascii',
    'threads',
    'tiktok',
    'timeconvert',
    'titlecase',
    'titles',
    'tobase32',
    'tobase36',
    'tobase58',
    'tobase64',
    'tobinary',
    'tobotak',
    'tohex',
    'tohijab',
    'toko',
    'tomorse',
    'topactive',
    'topwarn',
    'topwords',
    'toroblox',
    'totalfitur',
    'train',
    'transfer',
    'trapezoidarea',
    'trimspaces',
    'trivia',
    'truth',
    'ulangteks',
    'umur',
    'unban',
    'unbanall',
    'unlockgroup',
    'unlockinfo',
    'unmute',
    'unmutemember',
    'unwarn',
    'upper',
    'upsidedown',
    'urlencode',
    'use',
    'version',
    'vigenere',
    'volumeup',
    'vote',
    'votekick',
    'warn',
    'warnall',
    'warnarandom',
    'warnlimit',
    'water',
    'watermark',
    'welcome',
    'whitelist',
    'whitelistadd',
    'whitelistdel',
    'whoami',
    'windchill',
    'wordcount',
    'wordscramble',
    'wyr',
    'zodiak',
    'zodiaklahir',
    'opengroup',
    'closegroup',
    'terimarequest',
    'tolakrequest',
    'terimasemua',
]);


function registrySubcategory(name, category) {
    const n = String(name || '').toLowerCase();

    if (category === '🛡️ Admin') {
        if (/(approve|reject|request|terima|tolak)/.test(n)) return '📥 Join Requests & Approvals';
        if (/(kick|promote|demote|add|remove|member|mutemember|unmutemember|listadmin|admincount|bulk)/.test(n)) return '👥 Member Management';
        if (/(owner|creator|premium|role|jabatan|permission|access)/.test(n)) return '👑 Roles & Access Control';
        if (/(warn|warning|strike)/.test(n)) return '⚠️ Warnings & Moderation';
        if (/(lockimage|lockvideo|lockdocument|lockcontact|locklocation|lockvn|lockaudio|lockgif|lockpoll|locktext|locksticker|lockmedia)/.test(n)) return '🔒 Content Lock & Security';
        if (/(anti|protect|secure|phishing|nsfw|spam|toxic|virtex|judol|pinjol|caps|flood)/.test(n)) return '🛡️ Protection & Anti-Spam';
        if (/(badword|allowlink|whitelist|antilink|link|revoke)/.test(n)) return '🔗 Links, Filters & Whitelist';
        if (/(welcome|farewell)/.test(n)) return '👋 Welcome & Farewell';
        if (/(poll|vote|jadwal|schedule)/.test(n)) return '📊 Polls & Automated Schedules';
        if (/(event|rsvp|birthday|task|quicklock|quickunlock)/.test(n)) return '🎉 Events & Group Tasks';
        if (/(announcement|pengumuman|membernote|template|catatan|note|motd|autoreply)/.test(n)) return '📝 Announcements, Notes & Templates';
        if (/(audit|report|lapor|laporan)/.test(n)) return '🧾 Audit Logs & Reports';
        if (/(monitor|activity|aktivitas|stats|statistik)/.test(n)) return '📈 Group Monitoring & Stats';
        if (/(backup|restore)/.test(n)) return '💾 Backup & Recovery';
        if (/(group|open|close|setname|setdesc|icon|ephemeral|rules|setting)/.test(n)) return '⚙️ Group Settings & Rules';
        if (/(summary|groupage|exportmember|cekbot)/.test(n)) return '📋 Group Dashboard & Overview';
        return '📦 Other Admin Tools';
    }

    if (category === '🛠️ Tools') {
        if (/(binary|base|hex|morse|rot|caesar|vigenere|atbash|cipher|encode|decode|ascii|urlencode|urldecode|htmlencode|htmldecode)/.test(n)) return '🔐 Encoding & Cryptography';
        if (/(calc|persen|bmi|prima|faktorial|fibonacci|gcd|lcm|average|median|mode|fraction|interest|loan|roi|tax|discount|gpa|roman|number|area|volume|convert.*(length|weight|temperature|suhu|mass|volume|pressure|angle|currency))/.test(n)) return '🔢 Math & Converters';
        if (/(uppercase|lower|upper|reverse|alternating|titlecase|camelcase|snakecase|kebabcase|leet|wordcount|vokal|konsonan|ulangteks|frekuensi|slugify|anagram|syllable|readingtime|smallcaps|upsidedown|zalgo|strikethrough|underline|circledtext|fullwidth|textanalysis|capitalize|trimspaces|countchar|removedupewords|strlen|reversenumber)/.test(n)) return '🔤 Text Manipulation';
        if (/(email|nohp|cc|password|palindrom|palindrome|iban|macvalidate|ipv4|regex|jsonvalidate|isnumeric)/.test(n)) return '✅ Validators & Checkers';
        if (/(genpassword|uuid|pilih|shuffle|random|coupon|pingenerate|drawcard|hashtag|numbertowords|numeronim|passphrase|acronym)/.test(n)) return '🎲 Generators & Random';
        if (/(hari|tanggal|date|year|umur|age|weekday|weeknumber|quarter|businessdays|zodiak|timeconvert|ageinseconds|sisahari|daysinmonth)/.test(n)) return '📅 Date & Time Tools';
        if (/(diskon|bill|tip|currency|retirement|bmr|idealweight|waterintake|fueleff|cookingconvert|electricitybill)/.test(n)) return '💸 Financial Calculators';
        if (/(qrcode|shorturl|url|html|json|regex|extractemails|extracturls)/.test(n)) return '🌐 Web & URL Data';
        return '🛠️ Other Tools';
    }

    if (category === '🖼️ Media') {
        if (/(sticker|stiker|brat|iqc)/.test(n)) return '🎭 Stickers & Text';
        if (/(hd|grayscale|mirror|blur|rotate|sepia|invert|pixelate|brighten|darken|flip|square|watermark)/.test(n)) return '🎨 Image Effects & Edit';
        if (/(speed|slowmo|mutevideo|reversevideo|extractaudio|volumeup)/.test(n)) return '🎬 Video & Audio Effects';
        if (/(pp|profile|avatar)/.test(n)) return '👤 Profiles & Avatars';
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
        if (/(menu|totalfitur|daftar|version|runtime|ping|whoami)/.test(n)) return 'ℹ️ Info & System Status';
        if (/(self|public|private|autojoin|autoread|autotyping)/.test(n)) return '⚙️ Modes & Automation';
        if (/(jadibot|stopbot|listjadibot)/.test(n)) return '🤖 Web Pairing & Sub-Bots';
        if (/(stats|system|database|session)/.test(n)) return '📊 System & Statistics';
        return '🤖 Other Bot Tools';
    }

    if (category === '🎵 Music') return '🎵 Music & YouTube';
    if (category === '📥 Downloader') {
        if (/(ig|instagram|tiktok|twitter|facebook|threads|reddit|bilibili|dailymotion|vimeo|snackvideo|pinterest)/.test(n)) return '📱 Social Media Downloader';
        if (/(yt|youtube|play)/.test(n)) return '🎵 YouTube & Music';
        return '📥 Other Downloaders';
    }
    if (category === '📢 Broadcast') return '📢 Broadcast Tools';
    if (category === '🖥️ Panel') {
        if (/(create|make|add)/.test(n)) return '🖥️ Server Creation';
        if (/(delete|del|remove)/.test(n)) return '🗑️ Server Management';
        if (/(role|admin|seller)/.test(n)) return '👥 Roles & Access';
        return '⚙️ Panel & Hosting';
    }
    if (category === '🌀 Gojo') return '⚡ MASTER AI & Specials';
    if (category === '🛒 Sewa') return '🛒 Bot Rental';
    if (category === '💎 Premium') return '💎 Premium Access';
    return '📦 Miscellaneous';
}

function buildRegistryCategoryPack(category, label = category) {
    const names = GOJO_2000_FEATURES
        .filter(n => registryCategory(n) === category)
        .filter(n => !['gamble','lottery','bettinggold'].includes(String(n).toLowerCase()))
        .filter(n => !CURATED_MENU_COMMANDS.has(String(n).toLowerCase()));
    if (!names.length) return '';

    const groups = new Map();
    for (const name of names) {
        const sub = registrySubcategory(name, category);
        if (!groups.has(sub)) groups.set(sub, []);
        groups.get(sub).push(name);
    }

    const blocks = [...groups.entries()].map(([sub, list]) => {
        const lines = list.sort().map(name => `│ ${P}${name} — ${compactMenuDescription(name)}`);
        return `\n╭─〔 ${sub} 〕\n${lines.join('\n')}\n╰──────────────────────────────`;
    }).join('\n');

    return `\n${blocks}`;
}

export function getBannerBuffer() {
    const candidatePaths = [
        path.join(process.cwd(), 'media', 'thumbnail.jpg'),
        path.join(process.cwd(), 'media', 'thumbnail.png'),
        path.join(process.cwd(), 'media', 'thumbnail_opt.jpg')
    ];
    for (const cp of candidatePaths) {
        try {
            if (fs.existsSync(cp)) return fs.readFileSync(cp);
        } catch {}
    }
    return null;
}

export function getSubmenuButtons(current = '') {
    const allCategories = [
        { title: '🛡️ Group Administration', description: 'Anti-link, kick, mute, security & moderation', id: `${P}menuadmin` },
        { title: '📥 Social Downloaders', description: 'TikTok watermark-free, YouTube, Instagram, FB', id: `${P}menumedia` },
        { title: '🎮 Interactive Games', description: 'Tic-tac-toe, slots, dino runner, racing, snake', id: `${P}menufun` },
        { title: '🛠️ Utilities & Converters', description: 'Removebg, QR codes, encoders, text tools', id: `${P}menutools` },
        { title: '🤖 Bot Configuration', description: 'Autoread, autotyping, public/private modes', id: `${P}menubot` },
        { title: '👑 Owner Suite', description: 'Creator tools and system management', id: `${P}menuowner` },
        { title: '⚡ Check Ping Latency', description: 'Response speed and server uptime', id: `${P}ping` }
    ].filter(c => !current || !c.id.includes(current));

    return [
        {
            name: 'single_select',
            buttonParamsJson: JSON.stringify({
                title: '📂 Other Categories',
                sections: [
                    {
                        title: '📂 MASTER MD CATEGORIES',
                        rows: allCategories
                    }
                ]
            })
        },
        {
            name: 'quick_reply',
            buttonParamsJson: JSON.stringify({
                display_text: '🔙 Back to Main Menu',
                id: `${P}menu`
            })
        }
    ];
}

// ─── MAIN MENU (LIGHTWEIGHT, ZERO-LAG, BULLETPROOF DELIVERY) ────────
export async function sendMainMenu(reply, sender, sock, jid, msg, opts = {}) {
    const now     = Date.now();
    const { isOwner = false, isPremium = false, pushName = null, botStartTime = now, totalFeatures = 0 } = opts;

    if (sock && jid) {
        try { await sock.sendPresenceUpdate('composing', jid); } catch { /* ignore */ }
    }

    const statusLabel = isOwner ? 'Owner 👑' : isPremium ? 'Premium 💎' : 'Free 🌿';
    const namaTampil  = pushName || (sender ? sender.split('@')[0] : 'User');
    const mode        = settings.public !== false ? 'Public' : 'Private';
    const nodeVersion = process.version;
    const ramUsageMb  = (process.memoryUsage().rss / 1024 / 1024).toFixed(1);

    const tagUser = namaTampil;
    const line = '━━━━━━━━━━━━━━━━━━━━━━';

    const menuText =
`╔══════════════════════╗
   ⚡ ＭＡＳＴＥＲ  ＭＤ ⚡
╚══════════════════════╝
> Welcome to MASTER MD
Developed by AHSAN ✦ , ${tagUser}
*Interactive button menu in bottom sheet below*

${line}

▸ SYSTEM INFO
• Bot Name   : MASTER MD
• Developer  : AHSAN (03107260507)
• Status     : ${statusLabel}
• Mode       : ${mode}
• Version    : v${settings.botVersion || '3.0.0'}
• Node.js    : ${nodeVersion}
• Engine     : Baileys Multi-Device
• RAM Usage  : ${ramUsageMb} MB
• Uptime     : ${fmtDuration(now - botStartTime)}
• Features   : ${totalFeatures || '2025'} Active
• Prefix     : \`${P}\`

${line}

▸ COMMAND SUITES
│ 1️⃣ \`${P}allmenu\`   — Complete 2,000+ command catalog
│ 2️⃣ \`${P}owner\`     — Developer contact & info
│ 3️⃣ \`${P}pair\`      — Web pairing code generator
│ 4️⃣ \`${P}credits\`   — Official Channel & updates
│ 5️⃣ \`${P}menuadmin\` — Group protection & admin tools
│ 6️⃣ \`${P}menufun\`   — Interactive games & casino suite
│ 7️⃣ \`${P}menumedia\` — High-speed video downloaders
│ 8️⃣ \`${P}menutools\` — Converters, tools & encoders
│ 9️⃣ \`${P}ping\`      — Latency & connection speed
╰──────────────────────────────
💡 _Tap the buttons below or reply 1–9 to open any suite!_

${line}
"Thank you for using MASTER MD by AHSAN ⚡"`;

    markMenuPending(sender);

    if (sock && jid) {
        let mediaBuffer = null;
        const candidatePaths = [
            path.join(process.cwd(), 'media', 'thumbnail.jpg'),
            path.join(process.cwd(), 'media', 'thumbnail.png'),
            path.join(process.cwd(), 'media', 'thumbnail_opt.jpg')
        ];
        for (const cp of candidatePaths) {
            try {
                if (fs.existsSync(cp)) {
                    mediaBuffer = fs.readFileSync(cp);
                    break;
                }
            } catch {}
        }

        const dashboardSections = [
            {
                title: '⚡ MASTER MD QUICK ACCESS',
                highlight_label: '⭐ POPULAR',
                rows: [
                    { title: '🤖 All 2000+ Commands', description: 'Complete directory of all bot features', id: `${P}allmenu` },
                    { title: '⚡ Check Ping Latency', description: 'Test response speed and server uptime', id: `${P}ping` },
                    { title: '👑 Developer Contact', description: 'Official developer info: AHSAN (03107260507)', id: `${P}owner` },
                    { title: '📱 Web Pairing Portal', description: 'Link your WhatsApp via 8-digit code', id: `${P}pair` },
                    { title: '📢 Official Channel', description: 'Join updates and release news', id: `${P}credits` }
                ]
            }
        ];

        const categorySections = [
            {
                title: '📂 COMMAND CATEGORIES',
                rows: [
                    { title: '🛡️ Group Administration', description: 'Anti-link, kick, mute, security & moderation', id: `${P}menuadmin` },
                    { title: '📥 Social Downloaders', description: 'TikTok watermark-free, YouTube, Instagram, FB', id: `${P}menumedia` },
                    { title: '🎮 Interactive Games', description: 'Tic-tac-toe, slots, dino runner, racing, snake', id: `${P}menufun` },
                    { title: '🛠️ Utilities & Converters', description: 'Removebg, QR codes, encoders, text tools', id: `${P}menutools` },
                    { title: '🤖 Bot Configuration', description: 'Autoread, autotyping, public/private modes', id: `${P}menubot` },
                    { title: '👑 Owner Suite', description: 'Creator tools and system management', id: `${P}menuowner` }
                ]
            }
        ];

        const buttons = [
            {
                name: 'single_select',
                buttonParamsJson: JSON.stringify({
                    title: '⚡ MASTER MD DASHBOARD',
                    sections: dashboardSections
                })
            },
            {
                name: 'single_select',
                buttonParamsJson: JSON.stringify({
                    title: '📂 COMMAND CATEGORIES',
                    sections: categorySections
                })
            }
        ];

        const messageParamsJson = JSON.stringify({
            bottom_sheet: {
                in_thread_buttons_limit: 1,
                divider_indices: [1],
                list_title: '⚡ MASTER MD',
                button_title: '📂 Open Menu'
            },
            tap_target_configuration: {
                title: '▸ MASTER MD ◂',
                description: 'Command Center',
                canonical_url: settings.channelUrl || 'https://whatsapp.com',
                domain: 'https://whatsapp.com',
                button_index: 0
            }
        });

        let mediaMessage = null;
        if (sock.waUploadToServer) {
            const videoPath = path.join(process.cwd(), 'media', 'menu.mp4');
            if (fs.existsSync(videoPath)) {
                try {
                    const videoBuffer = fs.readFileSync(videoPath);
                    mediaMessage = await prepareWAMessageMedia(
                        { video: videoBuffer, gifPlayback: true },
                        { upload: sock.waUploadToServer }
                    );
                } catch (vErr) {
                    console.warn('[menu] video prep warning, falling back to image:', vErr.message);
                }
            }
            if (!mediaMessage && mediaBuffer) {
                try {
                    mediaMessage = await prepareWAMessageMedia(
                        { image: mediaBuffer },
                        { upload: sock.waUploadToServer }
                    );
                } catch (iErr) {
                    console.warn('[menu] image prep warning:', iErr.message);
                }
            }
        }

        const isSelf = !!(msg?.key?.fromMe || (sock.user?.id && jid.includes(sock.user.id.split('@')[0].split(':')[0])));
        const quoteObj = isSelf ? null : msg;

        const hasMedia = !!(mediaMessage?.videoMessage || mediaMessage?.imageMessage);
        const header = hasMedia
            ? {
                hasMediaAttachment: true,
                ...(mediaMessage?.videoMessage ? { videoMessage: mediaMessage.videoMessage } : {}),
                ...(mediaMessage?.imageMessage ? { imageMessage: mediaMessage.imageMessage } : {})
              }
            : {
                title: '⚡ MASTER MD COMMAND CENTER ⚡',
                hasMediaAttachment: false
              };

        const interactiveMessage = {
            header,
            body: {
                text: menuText
            },
            footer: {
                text: `⚡ MASTER MD v${settings.botVersion || '3.0.0'} • Dev: AHSAN (03107260507)`
            },
            nativeFlowMessage: {
                buttons,
                messageParamsJson
            },
            contextInfo: {
                mentionedJid: sender ? [sender] : [],
                isForwarded: true,
                forwardingScore: 999999
            }
        };

        try {
            const msgObj = generateWAMessageFromContent(jid, {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: {
                            deviceListMetadata: {},
                            deviceListMetadataVersion: 2
                        },
                        interactiveMessage
                    }
                }
            }, {
                userJid: sock.user?.jid || (sock.user?.id ? `${sock.user.id.split(':')[0]}@s.whatsapp.net` : undefined),
                quoted: quoteObj
            });

            if (msgObj?.key?.id && msgObj?.message) {
                storeOutboundMessage(msgObj.key.id, msgObj.message);
            }

            await sock.relayMessage(jid, msgObj.message, {
                messageId: msgObj.key.id
            });
            return msgObj;
        } catch (relayError) {
            console.warn('[menu] relayMessage failed, sending fallback image message:', relayError.message);
        }

        // Bulletproof Fallback: ALWAYS SEND BANNER IMAGE WITH CAPTION
        if (mediaBuffer) {
            if (menuText.length > 1000) {
                try {
                    await sock.sendMessage(jid, { image: mediaBuffer, caption: '⚡ MASTER MD COMMAND CENTER ⚡\nDeveloped by AHSAN (03107260507)' }, { quoted: quoteObj });
                    return await reply(menuText);
                } catch {}
            }
            try {
                return await sock.sendMessage(jid, {
                    image: mediaBuffer,
                    caption: menuText
                }, { quoted: quoteObj });
            } catch {}
        }
    }

    await reply(menuText);
}

const SAFE_CAPTION_LIMIT = 1000;
async function sendMenuReply(sock, jid, quotedMsg, imageUrl, text) {
    const full = safeReplyText(text);
    const tooLongForCaption = full.length > SAFE_CAPTION_LIMIT;
    const caption = tooLongForCaption
        ? `${truncate(full, SAFE_CAPTION_LIMIT)}\n\n👇 _Full details arriving in next message..._`
        : full;

    if (imageUrl) {
        try {
            const imageContent = imageUrl === settings.thumbnailUrl
                ? getThumbnailImageContent()
                : { image: { url: imageUrl } };
            await withTimeout(
                sock.sendMessage(jid, { ...imageContent, caption }, { quoted: quotedMsg }),
                30_000,
                'sendMessage(image)'
            );
            if (tooLongForCaption) {
                await sock.sendMessage(jid, { text: full }, { quoted: quotedMsg });
            }
            return;
        } catch (err) {
            log?.warn?.(`[menu] Failed to send thumbnail image: ${err.message}`);
        }
    }
    try {
        await sock.sendMessage(jid, { text: full }, { quoted: quotedMsg });
    } catch (err) {
        log?.error?.(`[menu] Failed to send fallback text: ${err.message}`);
    }
}

export async function sendRpgMenu(reply) {
    await reply(
`╔══════════════════════════════════════╗
║   ⚡ *${sc('RPG DEACTIVATED — MASTER MD')}*
╚══════════════════════════════════════╝

⚠️ *RPG system has been deactivated in MASTER MD v3.0.0.*
All gaming & virtual economy commands were removed to ensure zero-lag performance, eliminate clutter, and preserve 100% server stability.

💡 *Active Feature Suites:*
• .menuadmin  — Group Moderation, Bans, Warnings & Content Locks
• .menumedia  — HD Enhancement, Stickers, Filters & Media Tools
• .menutools  — Converters, Search, Web Utilities & Code Tools
• .menufun    — Quizzes, Trivia, Interactive Games & Quotes
• .ai         — Artificial Intelligence Chat & Search
• .allmenu    — Complete 2000+ Command Directory

👑 *Developer:* AHSAN (03107260507)
📢 *Official Channel:* https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46`
    );
}

// ─── DYNAMIC FEATURE DESCRIPTIONS (ENGLISH) ──────────────────────────
const ACTION_DESC = {
    audit: 'Audits group activities and changes',
    report: 'Manages user reports and complaints',
    restore: 'Restores data from backups',
    backup: 'Backs up data and configurations',
    delete: 'Deletes data or configuration',
    remove: 'Removes data or members',
    schedule: 'Manages automated schedules',
    protect: 'Activates group protection',
    add: 'Adds data or members',
    del: 'Deletes data or configuration',

    info: 'Displays detailed information',
    status: 'Shows status of features or system',
    start: 'Starts the selected mode or process',
    stop: 'Stops active mode or process',
    create: 'Creates new data or session',
    open: 'Opens access or session',
    close: 'Closes active access or session',
    enter: 'Enters session, area, or activity',
    leave: 'Leaves session or activity',
    join: 'Joins session or activity',
    list: 'Displays list of available data',
    search: 'Searches data by keyword',
    find: 'Finds matching records',
    inspect: 'Inspects object details',
    scan: 'Scans data for relevant items',
    track: 'Tracks progress or targets',
    claim: 'Claims available rewards or loot',
    complete: 'Completes active tasks or quests',
    cancel: 'Cancels running activity',
    accept: 'Accepts requests or invitations',
    decline: 'Declines requests or invitations',
    buy: 'Purchases items using balance',
    sell: 'Sells items for gold or currency',
    use: 'Uses selected item or tool',
    equip: 'Equips gear or weapon',
    unequip: 'Unequips worn gear',
    upgrade: 'Upgrades level or tier',
    repair: 'Repairs damaged equipment',
    craft: 'Crafts new items from ingredients',
    refine: 'Refines and purifies materials',
    forge: 'Forges stronger gear versions',
    cook: 'Cooks dishes from ingredients',
    feed: 'Feeds character or companion pet',
    train: 'Trains character to boost stats',
    heal: 'Heals HP and restores vitality',
    revive: 'Revives fallen character',
    attack: 'Strikes target in battle',
    defend: 'Guards and braces against damage',
    dodge: 'Attempts to dodge enemy attack',
    parry: 'Parries and counters enemy attack',
    cast: 'Casts magical spell or special skill',
    learn: 'Learns new skill or ability',
    forget: 'Forgets or removes selected skill',
    unlock: 'Unlocks locked feature or area',
    lock: 'Locks feature, area, or access',
    collect: 'Collects items or pending rewards',
    deposit: 'Deposits balance or items to storage',
    withdraw: 'Withdraws balance from bank storage',
    pay: 'Sends payment using available balance',
    give: 'Gives item or gift to target',
    receive: 'Receives items or gifts from users',
    send: 'Sends data or items to target',
    invite: 'Invites user to activity or group',
    kick: 'Kicks target from session or group',
    promote: 'Promotes target in role system',
    demote: 'Demotes target in role system',
    donate: 'Donates gold or items to treasury',
    build: 'Builds new facility or structure',
    expand: 'Expands available territory/capacity',
    travel: 'Travels to another realm or location',
    return: 'Returns to previous location',
    teleport: 'Instantly teleports to destination',
    summon: 'Summons companion or magical entity',
    dismiss: 'Dismisses summoned entity',
    sacrifice: 'Sacrifices item for special bonus',
    trade: 'Trades items with another player',
    bid: 'Places bid in auction market',
    sellout: 'Quickly sells eligible inventory items',
    roll: 'Generates random result with dice roll',
    spin: 'Spins prize wheel for random outcome',
    draw: 'Draws random card from deck',
    choose: 'Selects random option from list',
    vote: 'Casts vote in active poll',
    challenge: 'Challenges target to a duel',
    rank: 'Displays user tier and ranking',
    score: 'Shows accumulated points or score',
    top: 'Displays top achieving players',
    history: 'Shows history of past activities',
    log: 'Displays system activity logs',
    save: 'Saves current progress or configuration',
    load: 'Loads saved data or settings',
    reset: 'Resets selected data or progress',
    rename: 'Renames target object or profile',
    set: 'Sets value or configuration',
    get: 'Retrieves configuration value',
    view: 'Views detailed data breakdown',
    show: 'Displays available results or data',
    compare: 'Compares two objects or profiles',
    moderate: 'Applies moderation to target content',
    protect: 'Activates protection for target',
    secure: 'Strengthens security for target',
    configure: 'Adjusts configuration settings',
    backup: 'Creates data backup',
    restore: 'Restores data from backup',
    schedule: 'Schedules automated action',
    count: 'Counts matching members or records',
    check: 'Inspects status or condition of target',
    reload: 'Reloads configuration components',
    restart: 'Restarts session or component',
    enable: 'Enables target feature or guard',
    disable: 'Disables target feature or guard',
    monitor: 'Monitors target activity and logs',
    owner: 'Manages owner information & rights',
    channel: 'Manages official channel details',
    system: 'Inspects or manages bot system',
    version: 'Displays current version info',
    export: 'Exports target data to usable format',
    import: 'Imports data from provided source',
    convert: 'Converts data to selected format',
    encode: 'Encodes data into chosen format',
    decode: 'Decodes data from encoded format',
};

const ADMIN_TARGET = {
    group: 'group', member: 'member', admin: 'admin', link: 'group link',
    spam: 'spam', toxic: 'toxic language', media: 'media', image: 'image',
    video: 'video', audio: 'audio', document: 'document', sticker: 'sticker',
    poll: 'poll', welcome: 'welcome message', farewell: 'farewell message',
    rules: 'group rules', warning: 'warning system', request: 'join request',
    event: 'group event', note: 'group notes', template: 'group template',
    activity: 'group activity', invite: 'group invite', setting: 'group settings',
    security: 'group security',
};

function humanizeTarget(target) {
    return ADMIN_TARGET[target] || target.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/-/g, ' ');
}

export function getFeatureDescription(name) {
    const n = String(name || '').toLowerCase();
    if (!n) return 'Executes bot command.';

    const known = {
        play: 'Mencari lagu di YouTube lalu mengirim audionya',
        ytmp3: 'Downloads audio from YouTube link',
        ytmp4: 'Downloads video from YouTube link',
        tiktok: 'Downloads watermark-free TikTok video',
        ig: 'Downloads Instagram posts, reels, and stories',
        brat: 'Generates Brat-style text image',
        menu: 'Displays the main interactive bot menu',
        allmenu: 'Lists all available bot commands',
        menuadmin: 'Opens group admin and moderation tools',
        menutools: 'Opens utilities and tools menu',
        menumedia: 'Opens media processing and downloaders',
        menufun: 'Opens entertainment and fun commands',
        menubot: 'Opens bot settings and controls',
        totalfitur: 'Displays total count of active commands',
        ping: 'Checks bot response latency and server status',
        alive: 'Shows live status, developer info, and uptime',
    };
    if (known[n]) return known[n];

    if (n.startsWith('admin')) {
        const rest = n.slice(5);
        const action = Object.keys(ACTION_DESC).find(a => rest.startsWith(a));
        const target = action ? rest.slice(action.length) : rest;
        if (action && target) return `${ACTION_DESC[action]} for ${humanizeTarget(target)}`;
        if (action) return ACTION_DESC[action];
        return 'Manages group security and moderation settings';
    }

    if (n.startsWith('fun')) {
        const rest = n.slice(3);
        const action = Object.keys(ACTION_DESC).find(a => rest.startsWith(a));
        const target = action ? rest.slice(action.length) : rest;
        if (action && target) return `${ACTION_DESC[action]} for game ${humanizeTarget(target)}`;
        return action ? ACTION_DESC[action] + ' for entertainment' : 'Interactive games and entertainment';
    }

    if (n.startsWith('tool')) {
        const rest = n.slice(4);
        const action = Object.keys(ACTION_DESC).find(a => rest.startsWith(a));
        const target = action ? rest.slice(action.length) : rest;
        if (action && target) return `${ACTION_DESC[action]} on ${humanizeTarget(target)}`;
        return action ? ACTION_DESC[action] : 'Utility to process or inspect data';
    }

    if (n.startsWith('media')) {
        const rest = n.slice(5);
        const mediaAction = {
            hd: 'Enhances image resolution and sharpness',
            crop: 'Crops image or video to selected aspect ratio',
            rotate: 'Rotates media by selected angle',
            blur: 'Applies blur effect to media',
            mirror: 'Horizontally flips media',
            extractaudio: 'Extracts MP3 audio from video',
            reverse: 'Plays video backwards in reverse',
        };
        if (mediaAction[rest]) return mediaAction[rest];
        return 'Processes images, video, audio, or stickers';
    }

    if (n.startsWith('bot')) {
        const rest = n.slice(3);
        const action = Object.keys(ACTION_DESC).find(a => rest.startsWith(a));
        const target = action ? rest.slice(action.length) : rest;
        if (action && target) return `${ACTION_DESC[action]} for ${humanizeTarget(target)}`;
        return 'Manages bot system settings and diagnostics';
    }

    if (n.startsWith('social')) return 'Downloads or processes social media content';
    if (n.startsWith('cpanel')) return 'Manages server panel accounts and hosting';
    if (n.startsWith('owner') || n.startsWith('creator')) return 'Developer controls and bot administration';
    if (n.startsWith('premium')) return 'Premium membership commands and privileges';
    if (n.startsWith('ai')) return 'Smart AI assistant and image generator tools';

    const specific = {
        play: 'Searches YouTube and downloads audio instantly',
        ytmp4: 'Downloads high quality YouTube video',
        ig: 'Downloads Instagram video, reel, or photo',
        tiktok: 'Downloads TikTok video without watermark',
        twitter: 'Downloads video from X / Twitter',
        facebook: 'Downloads video from Facebook',
        scdl: 'Downloads music from SoundCloud',
        pin: 'Downloads media from Pinterest',
        threads: 'Downloads media from Threads',
        reddit: 'Downloads video or image from Reddit',
        quote: 'Generates inspiring or humorous quote',
        fact: 'Displays random interesting fact',
        riddle: 'Gives a riddle to solve',
        truth: 'Provides a Truth question for games',
        dare: 'Provides a Dare challenge for games',
        coinflip: 'Flips a coin for Heads or Tails',
        dice: 'Rolls a virtual dice',
        rps: 'Plays Rock-Paper-Scissors against the bot',
        slot: 'Plays virtual slot machine',
        calc: 'Evaluates mathematical expression',
        persen: 'Calculates percentages',
        bmi: 'Calculates Body Mass Index',
        genpassword: 'Generates secure random password',
        genuuid: 'Generates new unique UUID',
        pilih: 'Picks a random item from a given list',
        shuffle: 'Shuffles list of items randomly',
        ping: 'Checks bot latency and connection speed',
        alive: 'Shows live status, developer info, and uptime',
        owner: 'Displays official developer info (AHSAN)',
        channel: 'Shares official WhatsApp channel link',
        sticker: 'Converts image or video to WhatsApp sticker',
        botstats: 'Displays bot performance and usage statistics',
        changelog: 'Displays recent bot updates and changelog',
        credits: 'Displays MASTER MD credits and AHSAN details',
        support: 'Displays user guide and support assistance',
        version: 'Displays MASTER MD version and runtime details',
    };
    if (specific[n]) return specific[n];

    const verbs = Object.keys(ACTION_DESC).sort((a,b) => b.length - a.length);
    const verb = verbs.find(v => n === v || n.startsWith(v));
    if (verb) {
        const target = n === verb ? '' : n.slice(verb.length);
        return target
            ? `${ACTION_DESC[verb]} for ${target.replace(/([a-z])(?=[0-9])/g, '$1 ').replace(/([a-z])([A-Z])/g, '$1 $2')}`
            : ACTION_DESC[verb];
    }
    return 'Executes command based on input arguments';
}

// ─── ADMIN MENU (ENGLISH) ──────────────────────────────────────────
export async function sendAdminMenu(reply, sock, jid, msg) {
    const adminPack = buildRegistryCategoryPack('🛡️ Admin', '🛡️ Admin');
    const text =
`╔══════════════════════════════════════╗
║   🛡️  *${sc('ADMIN & GROUP MANAGEMENT')}*
╚══════════════════════════════════════╝

╭─「 👥 *${sc('MEMBER MANAGEMENT')}* 」
│ ${P}kick @tag        — Remove member from group
│ ${P}promote @tag     — Promote member to admin
│ ${P}demote @tag      — Demote member from admin
│ ${P}add [number]     — Add new member to group
│ ${P}listadmin        — List all group admins
│ ${P}membercount      — Total member count
╰──────────────────────────────

╭─「 👑 *${sc('BOT ROLES & PERMISSIONS')}* 」
│ ${P}cekjabatan [@tag] — Check role (Creator/Owner/Premium)
│ ${P}addowner @tag    — Grant Owner access _(Creator only)_
│ ${P}delowner @tag    — Revoke Owner access _(Creator only)_
│ ${P}listowner        — List Creator & Owners
│ ${P}addprem @tag     — Grant Premium access _(Owner only)_
│ ${P}delprem @tag     — Revoke Premium access _(Owner only)_
│ ${P}listprem         — List all Premium users
╰──────────────────────────────

╭─「 ⚠️ *${sc('WARNING SYSTEM')}* 」
│ ${P}warn @tag        — Issue official warning to member
│ ${P}unwarn @tag      — Remove warning from member
│ ${P}checkwarn @tag   — Check member warning count
│ ${P}warnlimit [n]    — Set auto-kick warning limit (default: 3)
╰──────────────────────────────

╭─「 🔇 *${sc('MUTE & GROUP LOCKS')}* 」
│ ${P}mute [duration]  — Mute all members (e.g. 10m, 1h)
│ ${P}unmute           — Unmute group
│ ${P}mutestatus       — Check mute status
│ ${P}lockgroup        — Lock group (only admins can chat)
│ ${P}unlockgroup      — Unlock group
│ ${P}opengroup        — Open group chat
│ ${P}closegroup       — Close group chat
│ ${P}slowmode [sec]   — Enable slow mode
│ ${P}lockmedia on/off — Lock media messaging
│ ${P}lockstiker on/off— Lock sticker messaging
╰──────────────────────────────

╭─「 ⚙️ *${sc('GROUP SETTINGS')}* 」
│ ${P}groupinfo        — Comprehensive group profile & details
│ ${P}setname [name]   — Change group subject/name
│ ${P}setdesc [text]   — Update group description
│ ${P}link             — Get group invite link
│ ${P}revoke           — Reset/revoke invite link
│ ${P}leave            — Command bot to leave group
│ ${P}hidetag [text]   — Hidden mass mention
│ ${P}tagall [text]    — Mention all members
╰──────────────────────────────

╭─「 👋 *${sc('WELCOME & FAREWELL')}* 」
│ ${P}welcome on/off   — Toggle welcome greeting message
│ ${P}setwelcome [txt] — Set custom welcome message
│ ${P}farewell on/off  — Toggle farewell message
│ ${P}setfarewell [txt]— Set custom farewell message
│   _Variables: {name} {group} {num}_
╰──────────────────────────────

╭─「 🛡️ *${sc('SECURITY & PROTECTION')}* 」
│ ${P}antigb on/off         — Block WA group invite links
│ ${P}antilink on/off       — Block all external URLs
│ ${P}antishortlink on/off  — Block link shorteners
│ ${P}antilinkphising on/off— Block phishing & scam URLs
│ ${P}antispam on/off       — Block message spamming
│ ${P}antitoxic on/off      — Block abusive/toxic words
│ ${P}antijudol on/off      — Block gambling promotions
│ ${P}antipinjol on/off     — Block illegal loan spam
│ ${P}anticaps on/off       — Block excessive CAPITAL letters
│ ${P}antivirtex on/off     — Block virus/zalgo crash texts
│ ${P}antitag on/off        — Block mass tag spamming
│ _(Anti-flood activates automatically with antispam)_
│
│ ${P}resetprotection   — Disable all protections at once
│ ${P}antilinkall on/off— Enable all link security filters
│ ${P}grouplockstatus   — Check status of all security filters
│ ${P}helpproteksi      — Security filters quick reference
╰──────────────────────────────

╭─「 🔒 *${sc('CONTENT LOCKS')}* 」
│ ${P}lockimage on/off    — Restrict images
│ ${P}lockvideo on/off    — Restrict videos
│ ${P}lockdocument on/off — Restrict documents
│ ${P}lockcontact on/off  — Restrict contact cards
│ ${P}locklocation on/off — Restrict location sharing
│ ${P}lockvn on/off       — Restrict voice notes
│ ${P}lockaudio on/off    — Restrict audio files
│ ${P}lockgif on/off      — Restrict GIFs
│ ${P}lockpoll on/off     — Restrict poll creation
╰──────────────────────────────

╭─「 📝 *${sc('WORD FILTER, LINKS & WHITELIST')}* 」
│ ${P}addbadword [word]  — Add custom forbidden word
│ ${P}delbadword [word]  — Delete custom forbidden word
│ ${P}listbadword        — View list of forbidden words
│ ${P}allowlinkadd [dom] — Whitelist domain from Anti-Link
│ ${P}allowlinkdel [dom] — Remove domain from whitelist
│ ${P}allowlinklist      — View whitelisted domains
│ ${P}whitelistadd @tag  — Whitelist member from filters
│ ${P}whitelistdel @tag  — Remove member from whitelist
│ ${P}whitelist          — View whitelisted members
╰──────────────────────────────

╭─「 📊 *${sc('POLLS, SCHEDULES & REPORTS')}* 」
│ ${P}poll [q]|[a]|[b] — Create interactive poll
│ ${P}vote [id] [no]   — Vote on active poll
│ ${P}hasilpoll [id]   — View poll results
│ ${P}listpoll         — List active polls
│ ${P}addjadwal [text] — Add group schedule
│ ${P}listjadwal       — List all group schedules
│ ${P}deljadwal [no]   — Delete schedule entry
│ ${P}lapor [text]     — Send report to admins
│ ${P}listlaporan      — View member reports
│ ${P}clearlaporan     — Clear all reports
│ ${P}aktivitasgrup    — Activity statistics
╰──────────────────────────────

╭─「 👀 *${sc('INACTIVE MEMBERS (SIDER)')}* 」
│ ${P}sider [days]     — Check inactive silent members
│ ${P}kicksider [days] — Kick all inactive members
│ _Default duration: 3 days. Example: ${P}sider 7d_
╰──────────────────────────────

╭─「 👥➕ *${sc('ADVANCED MEMBER CONTROLS')}* 」
│ ${P}kickall yakin    — Kick all non-admin members
│ ${P}warnall          — Issue warning to all non-admins
│ ${P}cekwarnall       — List all members with warnings
│ ${P}topwarn          — Top warned members ranking
│ ${P}resetwarnall     — Reset all warnings in group
│ ${P}mutemember @tag  — Mute specific member
│ ${P}unmutemember @tag— Unmute specific member
│ ${P}listmutedmember  — List muted members
╰──────────────────────────────

╭─「 📥 *${sc('JOIN REQUEST APPROVAL')}* 」
│ ${P}listrequest         — View pending join requests
│ ${P}approverequest [num]— Approve single join request
│ ${P}rejectrequest [num] — Reject single join request
│ ${P}approveall          — Approve all pending requests
│ ${P}rejectall           — Reject all pending requests
╰──────────────────────────────

╭─「 ⏰ *${sc('AUTO OPEN/CLOSE TIMERS')}* 」
│ ${P}jadwalbuka 07:00  — Auto open group daily
│ ${P}jadwaltutup 22:00 — Auto close group daily
│ ${P}cekjadwalgrup     — View active schedules
│ ${P}canceljadwalgrup  — Cancel auto timers
╰──────────────────────────────

╭─「 ⚡ *${sc('BULK OPS & TASKS')}* 」
│ ${P}bulkpromote @user1 @user2 ... — Promote multiple members
│ ${P}bulkdemote @user1 @user2 ...  — Demote multiple members
│ ${P}bulkkick @user1 @user2 ...    — Kick multiple members
│ ${P}topactive          — Leaderboard of most active members
│ ${P}listinactive [d]   — List inactive members
│ ${P}assigntask @user [task] — Assign task to member
│ ${P}mytasks            — View your assigned tasks
│ ${P}listtasks          — List all group tasks
│ ${P}donetask [no]      — Mark task as completed
│ ${P}maintenancemode on/off — Toggle maintenance mode
╰──────────────────────────────

╭─「 🎉 *${sc('EVENTS & ANNOUNCEMENTS')}* 」
│ ${P}createevent YYYY-MM-DD [text] — Schedule group event
│ ${P}rsvp [id] yes/no   — RSVP for scheduled event
│ ${P}listevents         — List upcoming events
│ ${P}quicklock          — Instant emergency lockdown
│ ${P}quickunlock        — Lift emergency lockdown
│ ${P}grouplinkqr        — QR code for group invite link
│ ${P}previewwelcome     — Preview welcome message
╰──────────────────────────────${adminPack}

👑 *Developer:* AHSAN (03107260507)
📢 *Official Channel:* https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46`;

    if (sock && jid) {
        return await sendButton(sock, jid, {
            text,
            footer: '⚡ MASTER MD • Developed by AHSAN (03107260507)',
            title: '🛡️ GROUP ADMINISTRATION SUITE 🛡️',
            media: getBannerBuffer(),
            buttons: getSubmenuButtons('admin'),
            quoted: msg
        });
    }

    await reply(text);
}

// ─── FUN MENU (ENGLISH) ────────────────────────────────────────────
export async function sendFunMenu(reply, sock, jid, msg) {
    const text =
`╔══════════════════════════════════════╗
║   🎮  *${sc('FUN & ENTERTAINMENT MENU')}*
╚══════════════════════════════════════╝

╭─「 🕹️ *${sc('INTERACTIVE GAMES')}* 」
│ ${P}xo / ${P}tictactoe — Interactive Tic-Tac-Toe challenge 🎯
│ ${P}slots / ${P}slot   — Casino slot machine spinner 🎰
│ ${P}dino             — Retro Google Dino runner 🦖
│ ${P}race / ${P}carrace — Turbo Highway racing game 🏎️
│ ${P}snake            — Classic snake apple eater 🐍
╰──────────────────────────────

╭─「 🎲 *${sc('CLASSIC SOCIAL GAMES')}* 」
│ ${P}coinflip      — Toss a coin (Heads/Tails)
│ ${P}dice [sides]  — Roll dice (1-6)
│ ${P}rps [choice]  — Rock, Paper, Scissors
│ ${P}guess [num]   — Guess the hidden number
│ ${P}wyr           — Would You Rather?
│ ${P}match @tag    — Compatibility calculator 💑
│ ${P}tarot         — Daily tarot card reading
│ ${P}fortunecookie — Crack open a fortune cookie 🍪
│ ${P}horoscope     — Daily horoscope & zodiac
╰──────────────────────────────

╭─「 🧠 *${sc('TRIVIA & BRAIN TEASERS')}* 」
│ ${P}trivia            — General knowledge trivia
│ ${P}answertrivia [ans]— Submit trivia answer
│ ${P}wordscramble      — Word scramble puzzle
│ ${P}riddle            — Brain-teasing riddles
│ ${P}truth             — Truth question
│ ${P}dare              — Dare challenge
╰──────────────────────────────

╭─「 🎉 *${sc('MEMES & HUMOR')}* 」
│ ${P}dadjoke          — Hilarious dad jokes 😂
│ ${P}quote            — Inspiring quotes & wisdom
│ ${P}fact             — Fascinating facts
│ ${P}magic8ball [?]   — Mystic 8-ball answers
│ ${P}dailyquote       — Positive daily affirmation
│ ${P}luckynumber      — Today's lucky numbers
│ ${P}roast @tag       — Playful roast 😏
│ ${P}compliment @tag  — Heartwarming compliment 💐
╰──────────────────────────────

👑 *Developer:* AHSAN (03107260507)
📢 *Official Channel:* https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46`;

    if (sock && jid) {
        return await sendButton(sock, jid, {
            text,
            footer: '⚡ MASTER MD • Developed by AHSAN (03107260507)',
            title: '🎮 GAMES & ENTERTAINMENT SUITE 🎮',
            media: getBannerBuffer(),
            buttons: getSubmenuButtons('fun'),
            quoted: msg
        });
    }

    await reply(text);
}

// ─── TOOLS MENU (ENGLISH) ──────────────────────────────────────────
export async function sendToolsMenu(reply, sock, jid, msg) {
    const text =
`╔══════════════════════════════════════╗
║   🛠️  *${sc('TOOLS & UTILITIES MENU')}*
╚══════════════════════════════════════╝

╭─「 ℹ️ *${sc('SYSTEM & STATUS')}* 」
│ ${P}ping    — Check server latency & response speed
│ ${P}owner   — Developer AHSAN contact & info
│ ${P}whoami  — View your WhatsApp user ID & metadata
│ ${P}runtime — Bot system uptime duration
│ ${P}version — Bot engine version
╰──────────────────────────────

╭─「 🎨 *${sc('CREATIVE & EDITING TOOLS')}* 」
│ ${P}removebg       — Remove background from any photo
│ ${P}tgsticker [pk] — Download entire Telegram sticker pack
│ ${P}sticker        — Convert image/video to sticker
│ ${P}hd             — Enhance and upscale image to HD
│ ${P}brat <text>    — Generate green Brat aesthetic image
│ ${P}iqc <text>     — Generate iPhone aesthetic chat screenshot
╰──────────────────────────────

╭─「 🧠 *${sc('AI & CHATBOT')}* 」
│ ${P}ai [prompt]     — Chat with MASTER AI
│ ${P}gpt [prompt]    — Ask GPT assistant
│ ${P}masterai on/off — Toggle auto AI responder
╰──────────────────────────────

╭─「 🔤 *${sc('TEXT & CODE CONVERTERS')}* 」
│ ${P}uppercase [txt] — UPPERCASE transformation
│ ${P}lowercase [txt] — lowercase transformation
│ ${P}reverse [txt]   — Reverse text order
│ ${P}smallcaps [txt] — Convert to small-caps font
│ ${P}morse [txt]     — Convert text to Morse code
│ ${P}binary [txt]    — Convert text to Binary
│ ${P}base64 [txt]    — Encode text to Base64
│ ${P}decodebase64    — Decode Base64 string
│ ${P}wordcount [txt] — Character & word analytics
╰──────────────────────────────

╭─「 🔢 *${sc('MATH & GENERATORS')}* 」
│ ${P}calc [math]     — Scientific calculator
│ ${P}bmi [w] [h]     — Calculate Body Mass Index
│ ${P}percent [n]% [x]— Percentage calculator
│ ${P}qrcode [text]   — Generate custom QR code
│ ${P}genpassword [n] — Generate secure random password
│ ${P}shorturl [link] — Shorten long URL
│ ${P}clock           — Current global clock
│ ${P}age [YYYY-MM-DD]— Age in years, months, seconds
╰──────────────────────────────

👑 *Developer:* AHSAN (03107260507)
📢 *Official Channel:* https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46`;

    if (sock && jid) {
        return await sendButton(sock, jid, {
            text,
            footer: '⚡ MASTER MD • Developed by AHSAN (03107260507)',
            title: '🛠️ UTILITY & DEVELOPER TOOLS 🛠️',
            media: getBannerBuffer(),
            buttons: getSubmenuButtons('tools'),
            quoted: msg
        });
    }

    await reply(text);
}

// ─── MEDIA MENU (ENGLISH) ──────────────────────────────────────────
export async function sendMediaMenu(reply, sock, jid, msg) {
    const text =
`╔══════════════════════════════════════╗
║   🖼️  *${sc('MEDIA & DOWNLOADER MENU')}*
╚══════════════════════════════════════╝

╭─「 🔓 *${sc('VIEW-ONCE RETRIEVER (.vv)')}* 」
│ ${P}vv / ${P}rvo       — Retrieve View-Once photos, videos & audios
│ _Reply to any View-Once media with \`${P}vv\` to save it permanently!_
╰──────────────────────────────

╭─「 📥 *${sc('HIGH-SPEED SOCIAL MEDIA DOWNLOADERS')}* 」
│ ${P}tiktok <link>  — Download TikTok videos without watermark (Fast HD)
│ ${P}ig <link>      — Download Instagram Reels / Posts / Videos
│ ${P}ytmp4 <link>   — Download YouTube video in high definition
│ ${P}play <query>   — Search & download audio from YouTube
│ ${P}fb <link>      — Download Facebook public video
│ ${P}twitter <link> — Download Twitter/X video
│ ${P}scdl <link>    — Download SoundCloud tracks
│ ${P}pin <link>     — Download Pinterest media
│ ${P}threads <link> — Download Threads video
│ ${P}reddit <link>  — Download Reddit video
│ _You can also REPLY to any message containing a link!_
╰──────────────────────────────

╭─「 🎭 *${sc('STICKERS & AVATARS')}* 」
│ ${P}sticker        — Convert image/video to WhatsApp sticker
│ ${P}tgsticker [pk] — Download entire Telegram sticker pack
│ ${P}pp [@tag]      — View user profile picture in HD
│ ${P}ppgrup         — View current group display icon
╰──────────────────────────────

╭─「 🎨 *${sc('PHOTO & VIDEO EDITING')}* 」
│ ${P}removebg       — Remove background from any image
│ ${P}hd             — Upscale and enhance image resolution
│ ${P}grayscale      — Convert image to classic black & white
│ ${P}mirror / blur  — Mirror or blur image
│ ${P}speedup        — Speed up video 2x
│ ${P}slowmo         — Slow down video 0.5x
│ ${P}extractaudio   — Extract MP3 audio from video
│ ${P}volumeup       — Boost voice note volume 2x
╰──────────────────────────────

╭─「 🟢 *${sc('BRAT & IPHONE CHAT')}* 」
│ ${P}brat <text>        — Brat green aesthetic image maker
│ \`${P}iqc <text> dark\` — iPhone style chat screenshot maker
╰──────────────────────────────

👑 *Developer:* AHSAN (03107260507)
📢 *Official Channel:* https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46`;

    if (sock && jid) {
        return await sendButton(sock, jid, {
            text,
            footer: '⚡ MASTER MD • Developed by AHSAN (03107260507)',
            title: '🖼️ MEDIA & DOWNLOADER SUITE 🖼️',
            media: getBannerBuffer(),
            buttons: getSubmenuButtons('media'),
            quoted: msg
        });
    }

    await reply(text);
}

// ─── BOT MENU (ENGLISH) ────────────────────────────────────────────
export async function sendBotMenu(reply, sock, jid, msg) {
    const text =
`╔══════════════════════════════════════╗
║   🤖  *${sc('BOT MENU — SYSTEM & OWNER')}*
╚══════════════════════════════════════╝

╭─「 📦 *${sc('FEATURE STATS')}* 」
│ ${P}totalfeatures — Total count of registered commands
│ ${P}allmenu       — Complete commands index
╰──────────────────────────────

╭─「 📢 *${sc('BROADCAST (OWNER)')}* 」
│ ${P}broadcast [msg]     — Broadcast announcement to all groups
│ ${P}broadcastuser [msg] — Broadcast message to all bot users
│ ${P}listgroups          — Total groups joined by bot
╰──────────────────────────────

╭─「 🔄 *${sc('WEB PAIRING & PORTAL')}* 」
│ ${P}pair [number]    — Generate 8-digit pairing code for device
│ ${P}stopbot [number] — Disconnect active sub-bot
│ ${P}listjadibot      — View all active sub-bot connections
╰──────────────────────────────

╭─「 📊 *${sc('STATISTICS & LOGS')}* 」
│ ${P}botstats    — Command usage statistics
│ ${P}changelog   — Bot update history
│ ${P}suggest [msg] — Send feedback/suggestion to Developer
│ ${P}listsuggestions — View feedback submissions (Owner)
╰──────────────────────────────

╭─「 🙏 *${sc('CREDITS & SUPPORT')}* 」
│ ${P}credits    — Developer AHSAN & technology credits
│ ${P}support    — Get help & contact developer
│ ${P}backupnow  — Create manual data backup (Owner)
│ ${P}version    — View current MASTER MD version
╰──────────────────────────────

👑 *Developer:* AHSAN (03107260507)
📢 *Official Channel:* https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46`;

    if (sock && jid) {
        return await sendButton(sock, jid, {
            text,
            footer: '⚡ MASTER MD • Developed by AHSAN (03107260507)',
            title: '🤖 BOT SYSTEM CONTROLS 🤖',
            media: getBannerBuffer(),
            buttons: getSubmenuButtons('bot'),
            quoted: msg
        });
    }

    await reply(text);
}

// ─── OWNER MENU (ENGLISH) ──────────────────────────────────────────
export async function sendOwnerMenu(reply, sock, jid, msg) {
    const text =
`╔══════════════════════════════════════╗
║   👑  *${sc('OWNER & DEVELOPER CONTROLS')}*
╚══════════════════════════════════════╝

👑 *System Architect:* AHSAN (03107260507)
📢 *Official Channel:* https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46

╭─「 🔐 *${sc('OWNER CONTROLS')}* 」
│ ${P}broadcast <msg>      — Broadcast announcement to all groups
│ ${P}broadcastuser <msg>  — Broadcast message to all private users
│ ${P}addowner / ${P}delowner — Add or remove bot owners
│ ${P}addprem / ${P}delprem   — Grant or revoke VIP premium status
│ ${P}backupnow            — Instant full server data backup
│ ${P}self / ${P}public    — Switch bot between private & public mode
│ ${P}botstats             — System performance and command statistics
│ ${P}setprefix <symbol>   — Change bot command prefix
╰──────────────────────────────
> © 2026 MASTER MD • All Rights Reserved to AHSAN`;

    if (sock && jid) {
        return await sendButton(sock, jid, {
            text,
            footer: '⚡ MASTER MD • Developed by AHSAN (03107260507)',
            title: '👑 DEVELOPER & OWNER SUITE 👑',
            media: getBannerBuffer(),
            buttons: getSubmenuButtons('owner'),
            quoted: msg
        });
    }

    await reply(text);
}

// ─── AI MENU (ENGLISH) ─────────────────────────────────────────────
export async function sendAiMenu(reply, sock, jid, msg) {
    const text =
`╔══════════════════════════════════════╗
║   🧠  *${sc('AI & SMART ASSISTANT MENU')}*
╚══════════════════════════════════════╝

╭─「 🤖 *${sc('ARTIFICIAL INTELLIGENCE')}* 」
│ ${P}ai <prompt>         — Ask Gemini / GPT AI anything
│ ${P}gojoai on/off       — Toggle automatic conversational AI
│ ${P}dalle <prompt>       — Generate AI images from description
│ ${P}gemini <prompt>      — Advanced multimodal reasoning
│ ${P}imagine <prompt>     — Creative artwork synthesizer
│ ${P}translate <lang>     — AI-powered multi-language translator
╰──────────────────────────────
> © 2026 MASTER MD • Developed by AHSAN`;

    if (sock && jid) {
        return await sendButton(sock, jid, {
            text,
            footer: '⚡ MASTER MD • Developed by AHSAN (03107260507)',
            title: '🧠 ARTIFICIAL INTELLIGENCE SUITE 🧠',
            media: getBannerBuffer(),
            buttons: getSubmenuButtons('ai'),
            quoted: msg
        });
    }

    await reply(text);
}
