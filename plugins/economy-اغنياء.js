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

const handler = async (m, { conn, args, usedPrefix }) => {

    
    if (m.isGroup && !global.db.data.chats[m.chat]?.economy) {
        return m.reply(
`《✦》أوامر *الاقتصاد* معطّلة في هذه المجموعة ❌

يمكن لأحد المشرفين تفعيلها باستخدام الأمر:
» *${usedPrefix}economy on* ✅`
        )
    }

    
    const users = Object.entries(global.db.data.users || {})
        .map(([jid, data]) => ({
            jid,
            ...data
        }))
        .filter(user =>
            user &&
            typeof user === 'object'
        )

    if (!users.length) {
        return m.reply('❌ لا توجد بيانات مستخدمين في قاعدة الاقتصاد.')
    }

    
    const sorted = users.sort((a, b) => {

        const totalA =
            (Number(a.coin) || 0) +
            (Number(a.bank) || 0)

        const totalB =
            (Number(b.coin) || 0) +
            (Number(b.bank) || 0)

        return totalB - totalA
    })

    
    const perPage = 10

    
    const totalPages = Math.max(
        1,
        Math.ceil(sorted.length / perPage)
    )

    
    let page = parseInt(args[0])

    if (isNaN(page))
        page = 1

    page = Math.max(
        1,
        Math.min(page, totalPages)
    )

    
    const startIndex = (page - 1) * perPage
    const slice = sorted.slice(
        startIndex,
        startIndex + perPage
    )

    
    let text =
`「✿」 *لوحة الأغنياء*
──────────────
🏆 أعلى المستخدمين امتلاكًا لـ *${currency}*
──────────────

`

    
    for (let i = 0; i < slice.length; i++) {

        const user = slice[i]

        const coin = Number(user.coin) || 0
        const bank = Number(user.bank) || 0

        const total = coin + bank

        let name = user.name

        if (typeof name !== 'string' || !name.trim()) {
            try {
                const fetchedName = await conn.getName(user.jid)

                name =
                    typeof fetchedName === 'string' &&
                    fetchedName.trim()
                        ? fetchedName.trim()
                        : user.jid.split('@')[0]

            } catch {
                name = user.jid.split('@')[0]
            }
        }

        text +=
`❐ *${startIndex + i + 1}.* ${name}
💰 المجموع: *¥${total.toLocaleString()} ${currency}*

`
    }

    
    text +=
`──────────────
📄 الصفحة: *${page} / ${totalPages}*
👥 عدد المستخدمين: *${sorted.length}*`

    
    return conn.reply(
        m.chat,
        text,
        m,
        {
            mentions: slice.map(user => user.jid)
        }
    )
}

handler.help = ['الاغنياء']
handler.tags = ['economy']

handler.command = [
    'المعرقين',
    'لوحه-الاغنياء',
    'topmoney',
    'اغنياء',
    'اغنى',
    'الاغنياء'
]

handler.group = true

export default handler