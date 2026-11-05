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

let handler = async (m, { conn }) => {

    const sender = String(m.sender || '')
        .replace(/[^0-9]/g, '')

    if (!allowedNumbers.includes(sender)) {
        return m.reply(
            '╭─〔 ⛔ 𝐀𝐂𝐂𝐄𝐒𝐒 〕─╮\n' +
            '│\n' +
            '│ ❌ هذا الأمر مخصص للمطور.\n' +
            '│\n' +
            '╰────────────────╯'
        )
    }

    if (!m.quoted && !m.mentionedJid?.length) {
        return m.reply(
            '╭─〔 🚫 𝐁𝐀𝐍 〕─╮\n' +
            '│\n' +
            '│ ⚠️ حدد المستخدم أولاً.\n' +
            '│\n' +
            '│ • منشن المستخدم\n' +
            '│ • أو اعمل ريبلاي على رسالته\n' +
            '│\n' +
            '╰────────────────╯'
        )
    }

    let who

    if (m.isGroup) {
        who =
            m.mentionedJid?.[0] ||
            m.quoted?.sender ||
            null
    } else {
        who = m.chat
    }

    if (!who) {
        return m.reply(
            '⚠️ لم أتمكن من تحديد المستخدم.'
        )
    }

    const users = global.db.data.users

    if (!users[who]) {
        users[who] = {}
    }

    if (users[who].banned) {
        return m.reply(
            `╭─〔 ⚠️ 𝐍𝐎𝐗 〕─╮
│
│ المستخدم @${who.split('@')[0]}
│ محظور بالفعل.
│
╰────────────────╯`,
            null,
            {
                mentions: [who]
            }
        )
    }

    users[who].banned = true

    await m.react('🚫')

    await conn.sendMessage(
        m.chat,
        {
            text:
                `╭━━━━━━〔 𝐁𝐀𝐍𝐍𝐄𝐃 〕━━━━━━╮
┃
┃ 𖣔 تم حظر المستخدم بنجاح
┃
┃ 👤 المستخدم:
┃ @${who.split('@')[0]}
┃
┃ 🔒 الحالة:
┃ 𝐁𝐀𝐍𝐍𝐄𝐃
┃
┃ ⚡ بواسطة:
┃ 𝐍𝐎𝐗 𝐁𝐎𝐓
┃
┃ ─────────────────
┃
┃ 📝 لن يتمكن المستخدم من
┃ استخدام أوامر البوت.
┃
╰━━━━━━━━━━━━━━━━━━━━╯`,

            contextInfo: {
                mentionedJid: [who],

                externalAdReply: {
                    showAdAttribution: false,
                    title: global.botname || '𝐍𝐎𝐗 𝐁𝐎𝐓',
                    body: global.dev || '𝐖𝐈𝐋𝐋𝐈𝐀𝐌',
                    mediaType: 2,
                    sourceUrl: global.redes || '',
                    thumbnail: global.icons || null
                }
            }
        },
        {
            quoted: m
        }
    )
}

handler.help = ['بان <@tag>']
handler.command = ['banuser', 'بان', 'ban']
handler.tags = ['owner']

export default handler