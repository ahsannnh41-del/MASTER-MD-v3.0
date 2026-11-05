/*╭━━━〔 CREDITS FOR 𝙎𝙃𝘼𝙉𝙆𝙎〕━━━╮
│ 👑 الـمـطـور ↜ 𝙎𝙃𝘼𝙉𝙆𝙎
│ 🌾 قــنــاة الــمــطـور ↜https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46
 📜 𝙏𝙝𝙞𝙨 𝙞𝙨 𝙩𝙝𝙚 𝙍𝙀𝙋𝙊 𝙡𝙞𝙣𝙠 𝙬𝙞𝙩𝙝 𝙖𝙡𝙡 𝙩𝙝𝙚 𝙘𝙤𝙙𝙚𝙨:
⚡ https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46
╰━━━━━━━━━━━━━━━━━━╯
*/

import fetch from 'node-fetch'
import crypto from 'crypto'

let handler = async (m, { conn, text, command, usedPrefix }) => {
  if (!text) return m.reply(`*يرجى كتابة النص المطلوب!*\nمثال:\n*${usedPrefix + command}* أهلا كيفك`)

  await m.react('⏳')

  
  const messageId = crypto.randomUUID()
  const conversationId = crypto.randomUUID()

  
  let model = 'claude-haiku-4-5'
  if (command.includes('gpt')) model = 'gpt-4o-mini'
  if (command.includes('llama')) model = 'llama-3.3-70b'

  const headers = {
    'accept': 'text/event-stream',
    'accept-language': 'en-EG',
    'content-type': 'application/json',
    'cookie': 'duckai_experiment_duckai-product-tour=WzEsMSwxLDEsIjc1WG1DenB5bmhDdjFmSEVaTllvdE5ibnFpWjBwNFlNNW9wRUdjQXRYYVkiLFsic3RyaW5nIiwidHJlYXRtZW50Il0sImluY2x1ZGVkIiwxLHRydWUsMTc4OTM1ODQwMDAwMF0.DSNRhIAP8KZ6bWX9bjvTPVoAcTCfMnB6dxQPTbLVHCo',
    'origin': 'https://duck.ai',
    'priority': 'u=1, i',
    'referer': 'https://duck.ai/',
    'sec-ch-ua': '"Chromium";v="127", "Not)A;Brand";v="99", "Microsoft Edge Simulate";v="127", "Lemur";v="127"',
    'sec-ch-ua-mobile': '?1',
    'sec-ch-ua-platform': '"Android"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Mobile Safari/537.36',
    'x-ddg-journey-id': 'c16603245f77f0a681ed33a76f2b8b02',
    'x-fe-signals': 'eyJzdGFydCI6MTc4ODk0MTkwMTM2MSwiZXZlbnRzIjpbeyJuYW1lIjoic3RhcnROZXdDaGF0X2ZyZWUiLCJkZWx0YSI6MjcwfSx7Im5hbWUiOiJhY3Rpb24iLCJkZWx0YSI6MTE3NywidHJ1c3RlZCI6dHJ1ZX0seyJuYW1lIjoiaW5pdFN3aXRjaE1vZGVsIiwiZGVsdGEiOjEyNTh9XSwiZW5kIjoyMjExNn0=',
    'x-fe-version': 'serp_20260908_154637_ET-7e1eb6518d136048a82db7b8d6e898a31cb720bb',
    'x-vqd-hash-1': 'eyJzZXJ2ZXJfaGFzaGVzIjpbImJmSU5JU1R4djRGdm82dGZ2MzhSQlUxdmtKMGd6RkZiSFZLQ1E3SlRycXM9IiwiZlZxVjNrN0hZaEhrSmJxVG1qTjlXdVhIQmg5dFlvVUIvR3dzL2VHSHNXbz0iLCJCS3pUL1RieThRTFdaUjZJQWwzbjZ4c3ZVbFgyZTBTNnZtL0J2em9YVmNFPSJdLCJjbGllbnRfaGFzaGVzIjpbIkFiTkpDQmJ2Njk4d3Z2SnNkTkNZNDBXOFlIeUhmWm9EVEVHS3Rhd2xRRE09IiwidnR4eVhhYjFuSUx5SzZaaUtZK2d5SWtxVGM2MzFIMmRjRHJ6SlRnWUVwOD0iLCJtNDh2cEY1TFh4bGkrWXBXTGZMeEJjbXp2WHVlOXdyS1M4TDlCMmtyZVZnPSJdLCJzaWduYWxzIjp7fSwibWV0YSI6eyJ2IjoiNCIsImNoYWxsZW5nZV9pZCI6ImRjZjMyNzZmMmE4ZTJhMmFmYmMxODU1NTkzZTkzMzFkNWIzZmM0MDQyNzc3MzA5NzA2MzhmZTQyYzFhMTgzMDRoOGpidCIsInRpbWVzdGFtcCI6IjE3ODg5NDE5MDI1MzQiLCJkZWJ1ZyI6Ik1JIiwib3JpZ2luIjoiaHR0cHM6Ly9kdWNrLmFpIiwic3RhY2siOiJFcnJvclxuYXQgbCAoaHR0cHM6Ly9kdWNrLmFpL2Rpc3QvZHVja2FpLWRpc3QvZW50cnkuZHVja2FpLjAyZjhmOGM5NDA4NTY2ZDY2YzQwLmpzOjI6MTg1NTcwMilcbmF0IGFzeW5jIGh0dHBzOi8vZHVjay5haS9kaXN0L2R1Y2thaS1kaXN0L2VudHJ5LmR1Y2thaS4wMmY4ZjhjOTQwODU2NmQ2NmM0MC5qczoyOjE2Mjg0NTkiLCJkdXJhdGlvbiI6IjQxIn19'
  }

  const payloadData = {
    model: model,
    metadata: {
      toolChoice: {
        NewsSearch: false,
        VideosSearch: false,
        LocalSearch: false,
        WeatherForecast: false
      }
    },
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: text
          }
        ]
      }
    ],
    canUseTools: true,
    reasoningEffort: 'none',
    canUseApproxLocation: null,
    canDelegateImageGeneration: null,
    canShowGreeting: true,
    durableStream: {
      messageId: messageId,
      conversationId: conversationId,
      publicKey: {
        alg: 'RSA-OAEP-256',
        e: 'AQAB',
        ext: true,
        key_ops: ['encrypt'],
        kty: 'RSA',
        n: 'uzfZuaaNaDnMoNZP3ai1JM1yV0ZoYqM5QKP9WDUJ8e_WgEKDNah1KeVVR1y7Yq08w-mCJ9tVorw7zfejeX0oFRHciqwCVKlOd-CKPV8GHwLFZJqC73xDfWiM5pA58ehBKISwOKn46bXH6e3XOB6of-INI0146zJ46kPG_y6BbFOE7p5e4qwjmn_04cy_x2FPyPzkXUvcBSFFiieAuVKjGY5q3M8aClqpQKkugBCvJRQ9jdm1K76H92-FtuAQK8Cxuiuv24_8Egk-5VlPDn1WUJB6FgtZNAfoFUar2KG70XcCEQLV9r9bcAIdWYjeWTWx4Xi59SZkq0V81y3xyavK2Q',
        use: 'enc'
      }
    }
  }

  try {
    const response = await fetch('https://duck.ai/duckchat/v1/chat', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payloadData)
    })

    if (!response.ok) {
      await m.react('❌')
      return m.reply(`خطأ في الاستجابة: ${response.status}`)
    }

    const responseText = await response.text()
    const lines = responseText.split('\n')
    let fullMessage = ''

    for (let line of lines) {
      line = line.trim()
      if (line.startsWith('data: ')) {
        const jsonString = line.slice(6)
        if (jsonString.startsWith('[CHAT_TITLE:') || jsonString.startsWith('[DONE]')) continue
        try {
          const parsed = JSON.parse(jsonString)
          if (parsed.role === 'assistant' && parsed.message) {
            fullMessage += parsed.message
          }
        } catch (e) {
          
        }
      }
    }

    if (!fullMessage.trim()) {
      await m.react('❌')
      return m.reply('لم أتمكن من استخراج النص من الرد.')
    }

    await m.react('✅')
    await m.reply(fullMessage.trim())

  } catch (err) {
    console.error(err)
    await m.react('❌')
    await m.reply(`حدث خطأ: ${err.message}`)
  }
}

handler.help = ['duckai', 'claude', 'gpt']
handler.tags = ['ai']
handler.command = ['duckai', 'كلاود', 'claude', 'gpt']

export default handler