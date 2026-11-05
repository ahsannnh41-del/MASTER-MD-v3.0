
import { promises as fs } from 'fs'
import path from 'path'

const SUBBOT_DIR = './Sessions/SubBot'
const CACHE_TTL = 60 * 1000 
const cache = new Map()

const DEFAULTS = {
  name: global.botname || 'Bot',
  banner: 'https://files.catbox.moe/xm4gan.jpg',
}

const pickRandom = (list) => list[Math.floor(Math.random() * list.length)]

const getBotId = (conn) =>
  (conn.user?.jid || '').split('@')[0].replace(/\D/g, '')

async function readSubBotConfig(botId) {
  if (!botId) return {}

  const hit = cache.get(botId)
  if (hit && Date.now() - hit.time < CACHE_TTL) return hit.data

  let data = {}
  try {
    const raw = await fs.readFile(path.join(SUBBOT_DIR, botId, 'config.json'), 'utf8')
    data = JSON.parse(raw)
  } catch (err) {
  
    if (err.code !== 'ENOENT') {
      console.log('⚠️ فشل قراءة إعدادات الروبوت الفرعي:', err.message)
    }
  }

  cache.set(botId, { time: Date.now(), data })
  return data
}
function resolveChannel() {
  const ids = [global.idcanal, global.idcanal2].filter(Boolean)
  const id = ids.length ? pickRandom(ids) : global.channelRD?.id
  const name = global.channelRD?.name || DEFAULTS.name
  return { id, name }
}

function buildContext(channel) {
  return {
    contextInfo: {
      isForwarded: true,
      forwardingScore: 1,
      forwardedNewsletterMessageInfo: {
        newsletterJid: channel.id,
        serverMessageId: 100,
        newsletterName: channel.name,
      },
    },
  }
}

export async function before(m, { conn }) {
  try {
    const config = await readSubBotConfig(getBotId(conn))

  
    global.rcanalMeta = {
      name: config.name || DEFAULTS.name,
      banner: config.banner || DEFAULTS.banner,
    }

    const channel = resolveChannel()
    if (!channel.id) return 

    global.rcanal = buildContext(channel)
  } catch (e) {
    console.log('حدث خطأ أثناء إنشاء rcanal:', e)
  }
}