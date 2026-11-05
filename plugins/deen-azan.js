/*
⚡ MASTER MD ⚡
AHSAN (03107260507)

「 𝐂𝐫𝐞𝐝𝐢𝐭𝐬 𝐛𝐲 AHSAN (03107260507) 」
「 لا تحذف الحقوق 🖤 」
𝐍𝐎𝐗 channel
https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46
𝙎𝙃𝘼𝙉𝙆𝙎 channel
https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46
 📜 𝙏𝙝𝙞𝙨 𝙞𝙨 𝙩𝙝𝙚 𝙍𝙀𝙋𝙊 𝙡𝙞𝙣𝙠 𝙬𝙞𝙩𝙝 𝙖𝙡𝙡 𝙩𝙝𝙚 𝙘𝙤𝙙𝙚𝙨:
⚡ https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46
*/

import axios from 'axios'
import moment from 'moment-timezone'

const sentAzan = {}

async function getPrayerTimes() {
  const date = moment().tz('Africa/Cairo').format('DD-MM-YYYY')

  const { data } = await axios.get(`https://api.aladhan.com/v1/timingsByCity/${date}?city=Cairo&country=Egypt&method=5`)

  return data.data.timings
}

export async function before(m, { conn }) {
  try {
    const now = moment().tz('Africa/Cairo').format('HH:mm')
    const today = moment().tz('Africa/Cairo').format('YYYY-MM-DD')

    const timings = await getPrayerTimes()

    const prayers = {
      الفجر: timings.Fajr,
      الظهر: timings.Dhuhr,
      العصر: timings.Asr,
      المغرب: timings.Maghrib,
      العشاء: timings.Isha
    }

    const groups = Object.entries(conn.chats)
      .filter(([_, chat]) => chat.isChats && chat.id.endsWith('@g.us'))
      .map(([id]) => id)

    for (const [name, time] of Object.entries(prayers)) {
      const cleanTime = time.split(' ')[0]
      const key = `${today}_${name}`

      if (now === cleanTime && sentAzan[key] !== true) {
        sentAzan[key] = true

        for (const group of groups) {
          await conn.sendMessage(group, {
            text: `🕌 حان الآن موعد أذان صلاة ${name}\n⏰ بتوقيت القاهرة - مصر`
          })
        }
      }
    }

  } catch (e) {
    console.error(e)
  }
}