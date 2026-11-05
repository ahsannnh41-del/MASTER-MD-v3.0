/*
═══════════════════════════════════════════════════════════════
  ⚡ MASTER MD — Next-Gen Multi-Device WhatsApp Bot
  👑 Developer: AHSAN (03107260507)
  📢 Channel: https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46
  ✨ 100% Pure Standard Image Menu (No Buttons, Zero Waiting Bugs)
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
  'grupo':        'Group Tools',
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
  return Object.values(global.plugins || {})
    .filter(p => !p.disabled && p.tags && (Array.isArray(p.tags) ? p.tags : [p.tags]).includes(tag))
    .flatMap(p => (Array.isArray(p.help) ? p.help : [p.help]).filter(Boolean))
    .map(cmd => `  ${tagIcons[tag] || '◦'} *${usedPrefix}${cmd}*`)
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
      txt += `\n◆ *${icon} ${label}*\n`
      let commands = menu[tag].map(plugin => {
        const cmdList = Array.isArray(plugin.help) ? plugin.help : [plugin.help]
        return cmdList.map(cmd => `  ${icon} ${usedPrefix}${cmd}`).join('\n')
      }).join('\n')
      txt += `${commands}\n`
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
