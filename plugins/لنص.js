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
import FormData from 'form-data'

const GLADIA_API_KEY = 'sk_gladia_9777ec61e97a4614b9d6f7a75ab5be0c'

const handler = async (m, { conn }) => {
   const q = m.quoted ? m.quoted : m
   const mime = (q.msg || q).mimetype || ''

   if (!/audio/.test(mime)) {
      return m.reply('❌ قم بالرد على مقطع صوتي أو ريكورد للتحويل إلى نص.')
   }

   await m.react('⏳')

   try {

      const audioBuffer = await q.download()
      if (!audioBuffer) throw new Error('فشل تحميل المقطع الصوتي.')

 
      const form = new FormData()
      form.append('audio', audioBuffer, {
         filename: 'audio.mp3',
         contentType: mime
      })

      const uploadRes = await axios.post('https://api.gladia.io/v2/upload', form, {
         headers: {
            ...form.getHeaders(),
            'x-gladia-key': GLADIA_API_KEY
         }
      })

      const audioUrl = uploadRes.data?.audio_url
      if (!audioUrl) throw new Error('لم يتم الاستجابة برابط الصوت من API Gladia.')

      const transcribeRes = await axios.post(
         'https://api.gladia.io/v2/transcription',
         {
            audio_url: audioUrl
         },
         {
            headers: {
               'Content-Type': 'application/json',
               'x-gladia-key': GLADIA_API_KEY
            }
         }
      )

      const resultUrl = transcribeRes.data?.result_url
      if (!resultUrl) throw new Error('فشل إنشاء مهمة تفريغ الصوت.')

      let transcriptText = ''
      let isCompleted = false
      let attempts = 0

      while (!isCompleted && attempts < 30) {
         await new Promise(resolve => setTimeout(resolve, 2000))
         attempts++

         const statusRes = await axios.get(resultUrl, {
            headers: { 'x-gladia-key': GLADIA_API_KEY }
         })

         const status = statusRes.data?.status
         if (status === 'done') {
            transcriptText = statusRes.data?.result?.transcription?.full_transcript || ''
            isCompleted = true
         } else if (status === 'error') {
            throw new Error('حدث خطأ في معالجة الصوت داخل السيرفر.')
         }
      }

      if (!transcriptText) throw new Error('لم يتم العثور على نص داخل المقطع الصوتي.')

      await m.react('✅')
      await m.reply(`📝 *النص المستخرج:*\n\n${transcriptText}`)

   } catch (e) {
      console.error('[Gladia STT Error]', e)
      await m.react('❌').catch(() => {})
      
      const valError = e.response?.data?.validation_errors
      const errorMsg = valError ? JSON.stringify(valError) : (e.response?.data?.message || e.message)
      
      await m.reply(`❌ *خطأ:* ${errorMsg}`)
   }
}

handler.command = /^(لنص|لتكست|stt|transcribe)$/i
handler.help = ['صوت-لنص']
handler.tags = ['tools']

export default handler