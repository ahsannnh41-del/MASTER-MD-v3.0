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

const allowedNumbers = [
    '923107260507',
    '923107260507'
]

const handler = async (m, { conn }) => {

    const sender = String(m.sender || '')
        .replace(/[^0-9]/g, '')

    if (!allowedNumbers.includes(sender)) {
        return m.reply('❌ هذا الأمر للمطور فقط.')
    }

    const chats = Object.entries(
        global.db.data.chats || {}
    ).filter(([_, chat]) => chat?.isBanned)

    const users = Object.entries(
        global.db.data.users || {}
    ).filter(([_, user]) => user?.banned)

    const mentions = []

    const userList = users.length
        ? users.map(([jid], index) => {

            let number = String(jid)
                .split('@')[0]
                .replace(/[^0-9]/g, '')

            if (!number) {
                number = 'غير معروف'
            }

            const mentionJid =
                jid.includes('@')
                    ? jid
                    : `${number}@s.whatsapp.net`

            if (number !== 'غير معروف') {
                mentions.push(mentionJid)
            }

            return `│ ${index + 1}. @${number}`

        }).join('\n')
        : '│ لا يوجد مستخدمون محظورون.'

    const chatList = chats.length
        ? chats.map(([jid], index) =>
            `│ ${index + 1}. ${jid}`
        ).join('\n')
        : '│ لا توجد مجموعات محظورة.'

    const caption =
`╭━━━━〔 𝐍𝐎𝐗 𝐁𝐎𝐓 〕━━━━╮
┃
┃ 👤 𝐁𝐀𝐍𝐍𝐄𝐃 𝐔𝐒𝐄𝐑𝐒
┃
┃ 📊 العدد: ${users.length}
┃
${userList}
┃
┣━━━━━━━━━━━━━━━━━━
┃
┃ 💬 𝐁𝐀𝐍𝐍𝐄𝐃 𝐆𝐑𝐎𝐔𝐏𝐒
┃
┃ 📊 العدد: ${chats.length}
┃
${chatList}
┃
┣━━━━━━━━━━━━━━━━━━
┃
┃ ⚡ جميع المحظورين المسجلين
┃ في قاعدة بيانات البوت.
┃
╰━━━━━━━━━━━━━━━━━━━━╯`

    await conn.sendMessage(
        m.chat,
        {
            text: caption,
            mentions
        },
        {
            quoted: m
        }
    )
}

handler.command = [
    'banlist',
    'listban',
    'المتبندين',
    'المحظورين'
]

handler.help = ['المتبندين']
handler.tags = ['owner']

export default handler