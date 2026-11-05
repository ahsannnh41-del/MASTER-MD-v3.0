/*
═══════════════════════════════════════════════════════════════
  ⚡ MASTER MD — Next-Gen Multi-Device WhatsApp Bot
  👑 Developer: AHSAN (03107260507)
  📢 Channel: https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46
  ✨ 100% Native Interactive Buttons & Menu System
═══════════════════════════════════════════════════════════════
*/

import moment from "moment-timezone"
import { prepareWAMessageMedia, generateWAMessageFromContent } from '@whiskeysockets/baileys'
import fs from 'fs'
import path from 'path'
import axios from 'axios'

const VIDEO_URL = 'https://files.catbox.moe/9n2xcd.mp4'
const MENU_DIR = path.join(process.cwd(), 'src', 'menu')
const MENU_FILE = path.join(MENU_DIR, 'menu.mp4')

const categoryNames = {
  'main':         '✨ Main Features',
  'owner':        '👑 Owner & Developer',
  'ai':           '🤖 Artificial Intelligence',
  'anime':        '🌸 Anime & Manga',
  'economy':      '💰 Economy & RPG',
  'game':         '🎮 Interactive Games',
  'group':        '🛡️ Group Administration',
  'grupo':        '👥 Group Utilities',
  'info':         '📖 Bot Information',
  'internet':     '🌐 Web & Search',
  'sticker':      '🏷️ Stickers Studio',
  'tools':        '🧰 Utilities & Tools',
  'download':     '⬇️ Video Downloader',
  'downloader':   '📥 Media Downloads',
  'daily':        '📅 Daily & Rewards',
  'serbot':       '🤖 Bot Pairing & Clones',
  'image':        '🖼️ Image Generator',
  'herramientas': '🔧 Utility Services',
  'nable':        '🔌 Switch & Toggles',
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
}

async function ensureMenuVideo() {
  if (!fs.existsSync(MENU_DIR)) {
    fs.mkdirSync(MENU_DIR, { recursive: true })
  }
  if (!fs.existsSync(MENU_FILE)) {
    try {
      const res = await axios.get(VIDEO_URL, { responseType: 'arraybuffer', timeout: 15000 })
      fs.writeFileSync(MENU_FILE, Buffer.from(res.data))
    } catch {
      // Fallback if network fails
      return null
    }
  }
  return fs.existsSync(MENU_FILE) ? fs.readFileSync(MENU_FILE) : null
}

function getActiveTags() {
  return [...new Set(
    Object.values(global.plugins || {})
      .filter(p => !p.disabled && p.tags)
      .flatMap(p => Array.isArray(p.tags) ? p.tags : [p.tags])
  )].filter(Boolean)
}

function getCategoryRows(tags, usedPrefix = '.') {
  return tags.map(tag => ({
    title: `${tagIcons[tag] || '📂'} ${categoryNames[tag] || tag.toUpperCase()}`,
    description: `View ${categoryNames[tag] || tag} commands`,
    id: `${usedPrefix}menu ${tag}`
  }))
}

function getCommandsByTag(tag, usedPrefix = '.') {
  return Object.values(global.plugins || {})
    .filter(p => !p.disabled && p.tags && (Array.isArray(p.tags) ? p.tags : [p.tags]).includes(tag))
    .flatMap(p => (Array.isArray(p.help) ? p.help : [p.help]).filter(Boolean))
    .map(cmd => `${tagIcons[tag] || '⚘'} *${usedPrefix}${cmd}*`)
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
  const catName = `${tagIcons[tag] || '📂'} ${categoryNames[tag] || tag}`
  const header = decorateCategoryHeader(catName, cmds.length)
  const txt = cmds.length === 0
    ? `⚠️ No commands found in category: *${catName}*`
    : `${header}\n\n${cmds.join('\n')}\n\n⚡ *MASTER MD* • Developed by AHSAN (03107260507)`

  try {
    const videoBuffer = await ensureMenuVideo()
    let mediaMessage = null
    if (videoBuffer) {
      try {
        mediaMessage = await prepareWAMessageMedia(
          { video: videoBuffer, gifPlayback: true },
          { upload: conn.waUploadToServer }
        )
      } catch {}
    }

    const allTags = getActiveTags()
    const headerObj = mediaMessage?.videoMessage
      ? { hasMediaAttachment: true, videoMessage: mediaMessage.videoMessage }
      : { hasMediaAttachment: false, title: `⚡ ${catName}` }

    const msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            header: headerObj,
            body: { text: txt },
            footer: { text: "⚡ MASTER MD • Developed by AHSAN" },
            nativeFlowMessage: {
              buttons: [
                {
                  name: "single_select",
                  buttonParamsJson: JSON.stringify({
                    title: "📂 Select Other Category",
                    sections: [{ title: '📂 Bot Command Categories', rows: getCategoryRows(allTags, usedPrefix) }]
                  })
                },
                {
                  name: "quick_reply",
                  buttonParamsJson: JSON.stringify({
                    display_text: "🔙 Back to Main Menu",
                    id: `${usedPrefix}menu`
                  })
                }
              ],
              messageParamsJson: JSON.stringify({
                bottom_sheet: { in_thread_buttons_limit: 1 }
              })
            }
          }
        }
      }
    }, { quoted: m })

    await conn.relayMessage(m.chat, msg.message, {})
  } catch (e) {
    await conn.sendMessage(m.chat, { text: txt }, { quoted: m })
  }
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
> Welcome to MASTER MD
⚡ Developed by AHSAN, ${tagUser}
*Interactive bottom sheet menu below*

${line}

▸ SYSTEM INFO
• Bot Name   : MASTER MD v3.0.0
• Developer  : AHSAN (03107260507)
• Engine     : Baileys Multi-Device
• Status     : 🟢 Online & Active
• Uptime     : ${uptimeStr}
• Time (PKT) : ${timeStr}
• Prefix     : ${usedPrefix}

${line}

▸ COMMAND DIRECTORY
`

    for (let tag in menu) {
      const icon = tagIcons[tag] || '◦'
      const label = categoryNames[tag] || tag.toUpperCase()
      txt += `\n◆ ${label}\n`
      let commands = menu[tag].map(plugin => {
        const cmdList = Array.isArray(plugin.help) ? plugin.help : [plugin.help]
        return cmdList.map(cmd => `${icon} ${usedPrefix}${cmd}`).join('\n')
      }).join('\n')
      txt += `${commands}\n`
    }

    txt += `
${line}
"Thank you for using MASTER MD! Developed by AHSAN (03107260507) ⚡"
`

    try { await conn.sendMessage(m.chat, { react: { text: '⚡', key: m.key } }) } catch {}

    const videoBuffer = await ensureMenuVideo()
    let mediaMessage = null
    if (videoBuffer) {
      try {
        mediaMessage = await prepareWAMessageMedia(
          { video: videoBuffer, gifPlayback: true },
          { upload: conn.waUploadToServer }
        )
      } catch {}
    }

    const allTags = getActiveTags()

    const quickSections = [
      {
        title: "⚡ MASTER MD DASHBOARD",
        highlight_label: "⭐ QUICK ACCESS",
        rows: [
          { title: "⚡ Check Ping Latency", description: "Test server response speed & uptime", id: `${usedPrefix}ping` },
          { title: "👑 Developer Contact", description: "Official contact: AHSAN (03107260507)", id: `${usedPrefix}owner` },
          { title: "📱 Web Pairing Portal", description: "Link device via 8-digit code generator", id: `${usedPrefix}pair` },
          { title: "📢 Official Channel", description: "Join latest updates & release notes", id: `${usedPrefix}channel` }
        ]
      }
    ]

    const categorySections = [
      {
        title: "📂 COMMAND CATEGORIES",
        rows: getCategoryRows(allTags, usedPrefix)
      }
    ]

    const headerObj = mediaMessage?.videoMessage
      ? { hasMediaAttachment: true, videoMessage: mediaMessage.videoMessage }
      : { hasMediaAttachment: false, title: "⚡ MASTER MD COMMAND CENTER ⚡" }

    const msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            header: headerObj,
            body: { text: txt },
            footer: { text: "⚡ MASTER MD • Developed by AHSAN" },
            nativeFlowMessage: {
              buttons: [
                {
                  name: "single_select",
                  buttonParamsJson: JSON.stringify({
                    title: "⚡ MASTER MD QUICK ACCESS",
                    sections: quickSections
                  })
                },
                {
                  name: "single_select",
                  buttonParamsJson: JSON.stringify({
                    title: "📂 BROWSE CATEGORIES",
                    sections: categorySections
                  })
                }
              ],
              messageParamsJson: JSON.stringify({
                bottom_sheet: {
                  in_thread_buttons_limit: 1,
                  divider_indices: [1],
                  list_title: "⚡ MASTER MD",
                  button_title: "📂 Open MASTER MD Menu"
                },
                tap_target_configuration: {
                  title: "▸ MASTER MD ◂",
                  description: "Main Command Center",
                  canonical_url: "https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46",
                  domain: "https://whatsapp.com",
                  button_index: 0
                }
              })
            },
            contextInfo: {
              mentionedJid: [m.sender],
              isForwarded: true,
              forwardingScore: 999999
            }
          }
        }
      }
    }, { quoted: m })

    await conn.relayMessage(m.chat, msg.message, {})

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, "❌ An error occurred while opening the menu. Please try typing .allmenu or .ping", m)
  }
}

handler.command = [
  'menu', 'help', 'allmenu', 'commands', 'start'
]

handler.help = ['menu']
handler.tags = ['main']

export default handler
