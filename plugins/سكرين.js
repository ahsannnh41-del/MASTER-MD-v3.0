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

import fetch from 'node-fetch'

let handler = async (m, { conn, command, args }) => {
    if (!args[0]) {
        return conn.reply(m.chat, '『 هات لينك الصفحه او الموقع معا الامر 🩸 』', m)
    }
    await m.react('🕓')

    try {
        
        let ss = await (await fetch(`https://image.thum.io/get/fullpage/${args[0]}`)).buffer()
        conn.sendFile(m.chat, ss, 'screenshot.png', 'تم يحب  🩸', m)
        await m.react('✅')
    } catch (err) {
        console.error(err) 
        await m.react('✖️')
    }
}

handler.help = ['اسكرين <رابط>']
handler.tags = ['tools']
handler.command = /^سكرين$/i

export default handler