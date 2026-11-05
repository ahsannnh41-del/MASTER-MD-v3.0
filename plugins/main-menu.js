/*
═══════════════════════════════════════════════════════════════
  ⚡ MASTER MD — Next-Gen Multi-Device WhatsApp Bot
  👑 Developer: AHSAN (03107260507)
  📢 Channel: https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46
  ✨ 100% Pure English Translated Menu (Zero Arabic, Zero Waiting Bugs)
═══════════════════════════════════════════════════════════════
*/

import moment from "moment-timezone"
import fs from 'fs'
import path from 'path'

const categoryNames = {
  'main':         'Main Commands',
  'owner':        'Owner & Developer',
  'ai':           'Artificial Intelligence',
  'anime':        'Anime & Manga',
  'economy':      'Economy & Banking',
  'game':         'Interactive Games',
  'group':        'Group Administration',
  'grupo':        'Group Utilities',
  'info':         'Information & Status',
  'internet':     'Web & Search',
  'sticker':      'Stickers Studio',
  'tools':        'Utilities & Tools',
  'download':     'Video Downloader',
  'downloader':   'Media Downloads',
  'daily':        'Daily & Rewards',
  'serbot':       'Bot Pairing & Clones',
  'image':        'Image Generator',
  'herramientas': 'Utility Services',
  'nable':        'Switch & Toggles',
  'islam':        'Islamic Features',
  'قسم الأدوات🛠️': 'Extended Tools',
  'ترفيه':        'Fun & Entertainment',
  'مجموعة':       'Group Social & Chat',
  'utils':        'Utilities & Helpers'
}

const tagIcons = {
  'main':         '✨',
  'owner':        '👑',
  'ai':           '🤖',
  'anime':        '🌸',
  'economy':      '💰',
  'game':         '🎮',
  'group':        '🛡️',
  'grupo':        '👥',
  'info':         'ℹ️',
  'internet':     '🌐',
  'sticker':      '🏷️',
  'tools':        '🧰',
  'download':     '⬇️',
  'downloader':   '📥',
  'daily':        '📅',
  'serbot':       '🤖',
  'image':        '🖼️',
  'herramientas': '🔧',
  'nable':        '🔌',
  'islam':        '🕌',
  'قسم الأدوات🛠️': '🛠️',
  'ترفيه':        '🎭',
  'مجموعة':       '👥',
  'utils':        '⚙️'
}

const commandTranslations = {
  // AI
  'انطق': 'tts <text>',
  'فيديو-ذكاء <وصف>': 'ai-video <prompt>',
  // Tools
  'وصف <رد على صورة>': 'describe <reply to img>',
  'rgb <النص>': 'rgb <text>',
  'ازالة': 'removebg',
  'ايموجي <ايموجي>': 'emoji <emoji>',
  'فضح': 'antidelete / reveal',
  'لصورة': 'toimg',
  'إبلاغ': 'report <issue>',
  'اقتراح': 'suggest <feature>',
  'ترجم <النص>': 'translate <text>',
  'تنفيذ_الترجمة': 'run_translation',
  'اسكرين <رابط>': 'ssweb <url>',
  'لفويس': 'tovn',
  'صوت-لنص': 'transcribe',
  // Downloads
  'تيك <رابط>': 'tiktok <url>',
  'سبوتيفاي <بحث>': 'spotify <query>',
  'spdl <رابط>': 'spdl <url>',
  'يوتيوب <رابط>': 'youtube <url>',
  'play2': 'play2 <song>',
  'فيلم': 'movie <name>',
  'انستا <رابط>': 'instagram <url>',
  'بنترست <بحث>': 'pinterest <query>',
  'صور <بحث>': 'images <query>',
  'فيد <رابط الفيديو><اسم الفيديو>': 'video <url>',
  'ايديت': 'capcut_edit',
  'شغل <اسم الأغنية>': 'play <song name>',
  'play <اسم الأغنية>': 'play <song name>',
  'ytmp340 <رابط>': 'ytmp3 <url>',
  'ytmp440 <رابط>': 'ytmp4 <url>',
  'ytmpp3doc <رابط>': 'ytmp3doc <url>',
  'ytmpp4doc <رابط>': 'ytmp4doc <url>',
  // Group Admin
  'كلوز': 'close',
  'ضيف-ميتا': 'addmeta',
  'بانشات': 'banchat',
  'حظر_البوت': 'banchat',
  'بانشاتفك': 'unbanchat',
  'desbanearbot': 'unbanchat',
  'الغاء_انذار': 'unwarn',
  'إلغاء_إنذار': 'unwarn',
  'تحذير': 'warn',
  'انذار': 'warn',
  'قفل-شات': 'lockchat',
  'فتح-شات': 'openchat',
  'قبول الكل': 'acceptall',
  'قبول <عدد>': 'accept <count>',
  'خفض': 'demote <@tag>',
  'رفع': 'promote <@tag>',
  'كتم': 'mute <@tag>',
  'رفع_كتم': 'unmute <@tag>',
  'المكتومين': 'mutedlist',
  'طرد': 'kick <@tag>',
  'لينك': 'grouplink',
  'غير': 'revoke',
  'مخفي': 'hidetag / tagall',
  // Economy
  'اسبوعي': 'weekly',
  'الاغنياء': 'leaderboard',
  'اقتصادي': 'economy',
  'ايداع': 'deposit <amount>',
  'بنك': 'bank',
  'تحويل': 'transfer <@tag> <amount>',
  'تنقيب': 'mine',
  'جريمه': 'crime',
  'رهان': 'bet <amount>',
  'رهان2': 'bet2 <amount>',
  'روليت': 'roulette',
  'سحب': 'withdraw <amount>',
  'اسرق @tag': 'rob <@tag>',
  'سنوي': 'yearly',
  'شهري': 'monthly',
  'صندوق': 'inventory',
  'صيد-بري': 'safari',
  'صيد': 'fish',
  'عالج': 'heal',
  'عمل2': 'work2',
  'عمل': 'work',
  'كازينو': 'casino',
  'مغامره': 'adventure',
  'ملك-كتابة': 'coinflip',
  'متجر': 'shop',
  'شراء': 'buy <item>',
  'يومي': 'daily',
  // Owner
  'حزمة-تيلي <رابط>': 'tgsticker <url>',
  'بان <@tag>': 'banuser <@tag>',
  '$ <الأمر>': 'exec <code>',
  'المتبندين': 'bannedlist',
  'ريستارت': 'restart',
  'بانفك <@tag>': 'unbanuser <@tag>',
  'ابحث <كلمة>': 'searchcode <word>',
  'ارفعني': 'setadmin',
  'افحصهم': 'checkusers',
  'اوامرهم': 'usercommands',
  'اوت': 'leavegroup',
  'باتش <اسم الأمر>': 'patch <cmd>',
  'بدلو الكلمة القديمة | الجديدة': 'replace <old>|<new>',
  'بدلو2 الكلمة القديمة | الكلمة الجديدة': 'replace2 <old>|<new>',
  'نفذ_التبديل اسم_الملف.js': 'applyreplace <file>',
  'خش <لينك>': 'join <link>',
  'ضيف': 'addcmd',
  'امسح': 'delcmd',
  'بلوقن لست': 'plugin list',
  'بلوقن عرض': 'plugin view',
  'بلوقن اضف': 'plugin add',
  'بلوقن حذف': 'plugin del',
  'جيب': 'getplugin',
  'سكرب': 'script',
  // Switches
  'التفعيلات': 'toggles / switches',
  // Anime
  'وايفو': 'waifu',
  'انمي': 'anime',
  // Games
  'احزر': 'guess',
  // Main
  'إنجازاتي': 'achievements',
  'انجازاتي': 'achievements',
  'البوت': 'botstatus',
  'بروفايل': 'profile',
  'تصنيف': 'ranking',
  'ترتيب': 'top',
  'المالكين': 'owners',
  // Stickers
  'لملصق': 'sticker',
  'براتفيد': 'bratvideo',
  'حقوق <نص>': 'take / wm <pack|author>',
  'لفيد': 'tovideo',
  'مسج': 'fakemsg',
  // Bot control
  'ذاتي': 'selfmode',
  'عام': 'publicmode',
  'مضاد-خاص': 'antiprivate',
  'قروبات': 'grouponly',
  'ادخل': 'join <link>',
  'salir': 'leave',
  'اطلع': 'leave',
  'تسجيل-خروج': 'logout',
  'اعادة-تشغيل': 'reload',
  // Fun
  'خجل @منشن': 'blush @tag',
  'عض < رد': 'bite <reply>',
  'غضب @منشن': 'angry @tag',
  'غضب': 'angry',
  'قهوة @منشن': 'coffee @tag',
  'ملل @منشن': 'bored @tag',
  'صباح': 'goodmorning',
  'ليلة': 'goodnight',
  // Novel / Web
  'رواية <اسم> - البحث عن رواية': 'novel search <name>',
  'رواية-اختيار <رقم> - اختيار رواية من النتائج': 'novel select <num>',
  'رواية-صفحة <رقم> - عرض فصول صفحة معينة': 'novel page <num>',
  'رواية-فصل <رقم> - تحميل فصل معين': 'novel chapter <num>',
  'رواية-الصفحات - عرض صفحات الفصول': 'novel pages',
  'رواية-تحديث - تحديث قائمة الفصول': 'novel update',
  'شازام': 'shazam',
  'ترانست': 'translate'
}

function translateCommand(rawCmd) {
  const trimmed = String(rawCmd || '').trim()
  if (commandTranslations[trimmed]) return commandTranslations[trimmed]

  let translated = trimmed
    .replace(/<رابط>/g, '<url>')
    .replace(/<النص>/g, '<text>')
    .replace(/<نص>/g, '<text>')
    .replace(/<بحث>/g, '<query>')
    .replace(/<اسم>/g, '<name>')
    .replace(/<رقم>/g, '<num>')
    .replace(/<وصف>/g, '<prompt>')
    .replace(/@منشن/g, '@tag')
    .replace(/<رد على صورة>/g, '<reply to img>')

  return commandTranslations[translated] || translated
}

function getLocalThumbnail() {
  const candidates = [
    path.join(process.cwd(), 'media', 'thumbnail.jpg'),
    path.join(process.cwd(), 'src', 'menu', 'thumbnail.jpg'),
    path.join(process.cwd(), 'media', 'thumbnail.png')
  ]
  for (const p of candidates) {
    try {
      if (fs.existsSync(p) && fs.statSync(p).size > 1000) {
        return fs.readFileSync(p)
      }
    } catch {}
  }
  return null
}

function getCommandsByTag(tag, usedPrefix = '.') {
  const rawList = Object.values(global.plugins || {})
    .filter(p => !p.disabled && p.tags && (Array.isArray(p.tags) ? p.tags : [p.tags]).includes(tag))
    .flatMap(p => (Array.isArray(p.help) ? p.help : [p.help]).filter(Boolean))

  const seen = new Set()
  const translated = []
  for (const cmd of rawList) {
    const en = translateCommand(cmd)
    if (!seen.has(en)) {
      seen.add(en)
      translated.push(`  ${tagIcons[tag] || '◦'} *${usedPrefix}${en}*`)
    }
  }
  return translated
}

function decorateCategoryHeader(catName, cmdCount) {
  const emoji = catName.split(' ')[0]
  return `╭━━━━━━━━━━━━━━━━━━━╮
┃ ${emoji} ${catName} ${emoji} ┃
╰━━━━━━━━━━━━━━━━━━━╯
⚘ *Available Commands:* ${cmdCount} ⚘`
}

async function sendCategoryMenu(m, conn, tag, usedPrefix = '.') {
  const cmds = getCommandsByTag(tag, usedPrefix)
  const catName = `${tagIcons[tag] || '📂'} ${categoryNames[tag] || tag.toUpperCase()}`
  const header = decorateCategoryHeader(catName, cmds.length)
  const txt = cmds.length === 0
    ? `⚠️ No commands found in category: *${catName}*`
    : `${header}\n\n${cmds.join('\n')}\n\n⚡ *MASTER MD* • Developed by AHSAN (03107260507)`

  const thumb = getLocalThumbnail()
  if (thumb) {
    return await conn.sendMessage(m.chat, {
      image: thumb,
      caption: txt,
      mentions: [m.sender]
    }, { quoted: m })
  }
  return await conn.sendMessage(m.chat, { text: txt }, { quoted: m })
}

let handler = async (m, { conn, usedPrefix, args }) => {
  try {
    const tag = args[0]?.trim().toLowerCase()
    if (tag && categoryNames[tag]) {
      return await sendCategoryMenu(m, conn, tag, usedPrefix)
    }

    let menu = {}
    for (let plugin of Object.values(global.plugins || {})) {
      if (!plugin || !plugin.help) continue
      let taglist = plugin.tags || []
      for (let t of taglist) {
        if (!menu[t]) menu[t] = []
        menu[t].push(plugin)
      }
    }

    let uptimeSec = process.uptime()
    let uptimeStr = `${Math.floor(uptimeSec/3600)}h ${Math.floor((uptimeSec%3600)/60)}m ${Math.floor(uptimeSec%60)}s`
    const now     = moment().tz("Asia/Karachi")
    const timeStr = now.format("hh:mm:ss A")
    const tagUser = '@' + m.sender.split('@')[0]
    const line    = "━━━━━━━━━━━━━━━━━━━━━━"

    let txt = `
╔══════════════════════╗
   ⚡ ＭＡＳＴＥＲ  ＭＤ ⚡
╚══════════════════════╝   
> Welcome to MASTER MD (Gojo Satoru Edition)
⚡ Developed by AHSAN, ${tagUser}

${line}

▸ *SYSTEM INFO*
• *Bot Name*   : MASTER MD v3.0.0
• *Developer*  : AHSAN (03107260507)
• *Engine*     : Baileys Multi-Device
• *Status*     : 🟢 Online & Active
• *Uptime*     : ${uptimeStr}
• *Time (PKT)* : ${timeStr}
• *Prefix*     : ${usedPrefix}
• *Channel*    : https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46

${line}

▸ *COMMAND DIRECTORY*
`

    for (let tag in menu) {
      const icon = tagIcons[tag] || '◦'
      const label = categoryNames[tag] || tag.toUpperCase()
      const cmds = getCommandsByTag(tag, usedPrefix)
      if (cmds.length === 0) continue

      txt += `\n◆ *${icon} ${label}*\n`
      txt += `${cmds.join('\n')}\n`
    }

    txt += `
${line}
💡 *Quick Usage:*
• Type \`${usedPrefix}menu <category>\` (e.g. \`${usedPrefix}menu ai\`)
• Type \`${usedPrefix}ping\` to test server speed
• Type \`${usedPrefix}owner\` for developer contact

👑 "Thank you for using MASTER MD! Developed by AHSAN (03107260507) ⚡"
`

    try { await conn.sendMessage(m.chat, { react: { text: '⚡', key: m.key } }) } catch {}

    const thumb = getLocalThumbnail()
    if (thumb) {
      await conn.sendMessage(m.chat, {
        image: thumb,
        caption: txt,
        mentions: [m.sender]
      }, { quoted: m })
    } else {
      await conn.sendMessage(m.chat, {
        text: txt,
        mentions: [m.sender]
      }, { quoted: m })
    }

  } catch (e) {
    console.error('[Menu Error]:', e)
    conn.reply(m.chat, "❌ An error occurred while opening the menu. Please try typing .ping", m)
  }
}

handler.command = ['menu', 'help', 'allmenu', 'commands', 'start']
handler.help = ['menu']
handler.tags = ['main']

export default handler
