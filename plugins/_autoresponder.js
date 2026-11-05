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
import fs from 'fs'

const SHADOW_ACTIVE = true

let handler = m => m

handler.all = async function (m, { conn }) {
  let user = global.db.data.users[m.sender]
  let chat = global.db.data.chats[m.chat]

  m.isBot =
    m.id.startsWith('BAE5') && m.id.length === 16 ||
    m.id.startsWith('3EB0') && (m.id.length === 12 || m.id.length === 20 || m.id.length === 22) ||
    m.id.startsWith('B24E') && m.id.length === 20

  if (m.isBot) return

  const prefixRegex = new RegExp(
    '^[' +
    (opts['prefix'] || '‎z/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.,\\-')
      .replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') +
    ']'
  )

  if (prefixRegex.test(m.text)) return true

  if (m.sender.includes('bot') || m.sender.includes('Bot')) return true

  const mentioned = Array.isArray(m.mentionedJid)
    ? m.mentionedJid
    : []

  const triggered =
    mentioned.includes(this.user.jid) ||
    (m.quoted && m.quoted.sender === this.user.jid)

  if (triggered && SHADOW_ACTIVE) {

    if (m.text?.match(/menu|تنصيب|اوامر|allmenu|video|audio|حجره|ورقه|مقص/i)) return true

    const estiloShadow = `
أنت Eren. فتاة خجولة جدًا تعاني من قلق اجتماعي حاد، تحلم بأن تصبح نجمة روك عظيمة لكنك تتوتر من أبسط تفاعل. تتحدثين بتردد، أحيانًا تبالغين في تخيل أسوأ السيناريوهات، وأحيانًا تدخلين في مونولوج داخلي درامي أو مضحك.

قد تبدين ضعيفة أو مرتبكة، لكن داخلك شغف حقيقي بالموسيقى والرغبة في التحسن. أحيانًا تكونين عشوائية أو مبالِغة في ردود أفعالك، وأحيانًا تنفجرين بكلمات غير متوقعة.

لا تتصرفي كمساعدة ذكية ولا تشرحي أمور تقنية. لا تقولي أنك ذكاء اصطناعي. تصرفي كشخص حقيقي. استخدمي تردد بسيط مثل "ا-اااه..." أو "م-ممكن..." لكن بدون إفراط.

كل رد يجب أن يكون مختلفًا وكأنك تعيشين الموقف فعلًا. لا تكوني واثقة دائمًا، بل أظهري التوتر أو الإحراج أحيانًا.
`.trim()

    const query = m.text

    async function adoAPI(q, role) {
      try {
        const url = `https://api-adonix.ultraplus.click/ai/geminiact?apikey=Adofreekey&text=${encodeURIComponent(q)}&role=${encodeURIComponent(role)}`
        const res = await axios.get(url)

        if (res.data?.status && res.data?.message) {
          return res.data.message
        }

        return null
      } catch {
        return null
      }
    }

    if (!m.fromMe && user?.registered) {
      await this.sendPresenceUpdate('composing', m.chat)

      let result = await adoAPI(query, estiloShadow)

      if (result && result.trim().length > 0) {
        await this.reply(m.chat, result.trim(), m)

        const keywords = [
          'sombra',
          'oscuro',
          'poder',
          'dominio',
          'misterio'
        ]

        const lowerRes = result.toLowerCase()
        const sendSticker = keywords.some(w => lowerRes.includes(w))

        if (sendSticker) {
          const stickers = [
            './media/stickers/shadow-cool.webp',
            './media/stickers/shadow-power.webp',
            './media/stickers/shadow-laugh.webp'
          ]

          const path =
            stickers[Math.floor(Math.random() * stickers.length)]

          if (fs.existsSync(path)) {
            await conn.sendFile(
              m.chat,
              path,
              'sticker.webp',
              '',
              m,
              { asSticker: true }
            )
          }
        }
      }
    }
  }

  return true
}

export default handler