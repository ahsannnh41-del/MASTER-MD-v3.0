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

const handler = async (m, { conn }) => {
    try {
        await conn.groupRevokeInvite(m.chat)

        const inviteCode = await conn.groupInviteCode(m.chat)
        const link = `https://chat.whatsapp.com/${inviteCode}`

        const message = `╭━━━〔 🔄 𝐍𝐎𝐗 〕━━━╮
│
│ 𝙂𝙍𝙊𝙐𝙋 𝙇𝙄𝙉𝙆 𝙐𝙋𝘿𝘼𝙏𝙀𝘿
│
│ 🔗 *تم تغيير رابط المجموعة بنجاح*
│
│ 📎 *الرابط الجديد:*
│ ${link}
│
╰━━━━━━━━━━━━━━━━━━━━╯

> AHSAN (03107260507)
> Ｎｏｘ Ｂｏｔ 🌓`

        await conn.reply(m.chat, message, m)

    } catch (error) {
        console.error('NOX REVOKE ERROR:', error)

        await conn.reply(
            m.chat,
            `╭━━━〔 ❌ 𝐍𝐎𝐗 𝐄𝐑𝐑𝐎𝐑 〕━━━╮
│
│ تعذر تغيير رابط المجموعة.
│
│ ⚠️ تأكد أن البوت مشرف.
│
╰━━━━━━━━━━━━━━━━━━━━╯`,
            m
        )
    }
}

handler.help = ['غير']
handler.tags = ['grupo']
handler.command = ['revoke', 'restablecer', 'غير']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler