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

let handler = async (m, { conn }) => {
    try {
        const users = global.db.data.users || {}

        const list = Object.entries(users)
            .map(([jid, user]) => {
                user = user || {}

                return {
                    jid,
                    name: user.name || 'غير معروف',
                    level: Number(user.level || 0),
                    exp: Number(user.exp || 0),
                    money: Number(user.money || user.coin || 0)
                }
            })
            .filter(user => !user.jid.endsWith('@g.us'))
            .sort((a, b) => {
                if (b.level !== a.level) {
                    return b.level - a.level
                }

                return b.exp - a.exp
            })
            .slice(0, 10)

        if (!list.length) {
            return m.reply('❌ لا توجد بيانات مستخدمين لعرض التصنيف.')
        }

        const medals = [
            '🥇',
            '🥈',
            '🥉',
            '🏅',
            '🏅',
            '🏅',
            '🏅',
            '🏅',
            '🏅',
            '🏅'
        ]

        const mentions = []

        const ranking = list.map((user, index) => {
            mentions.push(user.jid)

            return [
                `${medals[index]} 『 ${index + 1} 』`,
                `👤 @${user.jid.split('@')[0]}`,
                `🆙 المستوى: ${user.level}`,
                `⭐ XP: ${user.exp}`,
                `💰 الرصيد: ${user.money}`
            ].join('\n')
        }).join('\n\n')

        const text = `
╭━━━〔 𝐍𝐎𝐗 〕━━━╮
┃
┃ 🏆 𝐓𝐎𝐏 𝟏𝟎
┃
┃ أفضل أعضاء البوت
┃ حسب المستوى والخبرة
┃
┣━━━━━━━━━━━━━━┫
┃
${ranking}
┃
┣━━━━━━━━━━━━━━┫
┃
┃ 𝚆𝙸𝙻𝙻𝙸𝙰𝙼 × 𝚂𝙷𝙰𝙽𝙺𝚂
┃
╰━━━〔 𝐍𝐎𝐗 〕━━━╯
`.trim()

        await conn.sendMessage(
            m.chat,
            {
                text,
                mentions
            },
            { quoted: m }
        )

    } catch (e) {
        console.error(e)
        await m.reply('❌ حدث خطأ أثناء إنشاء التصنيف.')
    }
}

handler.help = [
    'تصنيف',
    'ترتيب',
    'top'
]

handler.tags = ['main']

handler.command = [
    'تصنيف',
    'ترتيب',
    'top'
]

export default handler