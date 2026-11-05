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

let groupSessions = {}

const handler = async (m, { conn, text, args, command, isOwner, isROwner }) => {
    const isDev = isOwner || isROwner || m.fromMe
    if (!isDev) {
        await conn.reply(m.chat, '❌ هذا الأمر مخصص للمطور فقط !', m)
        return
    }

    if (command === 'الجروبات' || command === 'جروباتي') {
        try {
            const chats = await conn.groupFetchAllParticipating()
            const groupsList = Object.values(chats)

            if (groupsList.length === 0) {
                await conn.reply(m.chat, '❌ البوت ليس متواجدًا في أي مجموعة حاليًا.', m)
                return
            }

            groupSessions[m.sender] = groupsList.map(g => ({ id: g.id, subject: g.subject }))

            let caption = `*📋 قائمة المجموعات المتاحة للتحكم:* \n\n`
            groupsList.forEach((g, index) => {
                caption += `*${index + 1}.* ${g.subject}\n`
            })
            caption += `\n*لإرسال رسالة أو أمر لمجموعة معينة، اكتب:* \n`
            caption += `*.ارسل_للجروب <رقم الجروب> <الرسالة أو الأمر>*</`

            await conn.reply(m.chat, caption, m)
        } catch (err) {
            console.error(err)
            await conn.reply(m.chat, '❌ حدث خطأ أثناء جلب قائمة المجموعات.', m)
        }
        return
    }

    if (command === 'ارسل_للجروب' || command === 'وجه') {
        if (!args[0] || !args[1]) {
            await conn.reply(m.chat, '❌ الصيغة خاطئة!\nمثال: `.ارسل_للجروب 1 السلام عليكم`', m)
            return
        }

        const userGroups = groupSessions[m.sender]
        if (!userGroups || userGroups.length === 0) {
            await conn.reply(m.chat, '❌ يرجى عرض قائمة المجموعات أولاً باستخدام أمر `.الجروبات`', m)
            return
        }

        const groupIndex = parseInt(args[0]) - 1
        if (isNaN(groupIndex) || groupIndex < 0 || groupIndex >= userGroups.length) {
            await conn.reply(m.chat, '❌ رقم المجموعة غير صحيح! تحقق من القائمة عبر `.الجروبات`', m)
            return
        }

        const targetGroup = userGroups[groupIndex]
        const messageToSend = args.slice(1).join(' ')

        try {
            await conn.sendMessage(targetGroup.id, { text: messageToSend })
            await conn.reply(m.chat, `✅ تم إرسال الرسالة بنجاح إلى مجموعة:\n*${targetGroup.subject}*`, m)
        } catch (err) {
            console.error(err)
            await conn.reply(m.chat, '❌ فشل إرسال الرسالة إلى المجموعة المحددة.', m)
        }
    }
}

handler.command = ['الجروبات', 'جروباتي', 'ارسل_للجروب', 'وجه']
export default handler