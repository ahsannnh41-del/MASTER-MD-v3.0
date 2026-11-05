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

const normalize = jid => {
    if (!jid) return ''
    return jid.toString()
        .replace(/:\d+@/, '@')
        .replace(/@s\.whatsapp\.net|@lid|@g\.us/g, '')
        .replace(/\D/g, '')
}

const isParticipantAdmin = (participant, jid) => {
    if (!participant || !jid) return false

    const target = normalize(jid)

    const ids = [
        participant.id,
        participant.jid,
        participant.lid,
        participant.phoneNumber
    ]

    return ids.some(id => normalize(id) === target)
        && (
            participant.admin === 'admin' ||
            participant.admin === 'superadmin'
        )
}

const handler = async (m, { conn, args, isOwner, isROwner }) => {

    if (!m.isGroup) {
        return m.reply(
`╭─〔 ◜Ｎｏｘ◞ 〕─╮
│
│  هذا الأمر يعمل داخل
│  المجموعات فقط.
│
╰────────────────╯`
        )
    }

    let metadata

    try {
        metadata = await conn.groupMetadata(m.chat)
    } catch {
        return m.reply(
`╭─〔 ◜Ｎｏｘ◞ 〕─╮
│
│  ❌ تعذر جلب بيانات المجموعة.
│
╰────────────────╯`
        )
    }

    const participants = metadata?.participants || []

    const senderAdmin = participants.some(p =>
        isParticipantAdmin(p, m.sender) ||
        isParticipantAdmin(p, m.key?.participant)
    )

    const botJid = conn.user?.id || conn.user?.jid

    const botAdmin = participants.some(p =>
        isParticipantAdmin(p, botJid)
    )

    if (!senderAdmin && !isOwner && !isROwner) {
        return m.reply(
`╭─〔 ◜Ｎｏｘ◞ 〕─╮
│
│  ⛔ هذا الأمر للمشرفين فقط.
│
│  تأكد أنك مشرف في المجموعة.
│
╰────────────────╯`
        )
    }

    if (!botAdmin) {
        return m.reply(
`╭─〔 ◜Ｎｏｘ◞ 〕─╮
│
│  ⚠️ لا أستطيع تنفيذ الأمر.
│
│  يجب أن يكون البوت مشرفًا
│  في هذه المجموعة.
│
╰────────────────╯`
        )
    }

    let requests

    try {
        requests = await conn.groupRequestParticipantsList(m.chat)
    } catch (e) {
        console.error('NOX REQUEST LIST ERROR:', e)

        return m.reply(
`╭─〔 ◜Ｎｏｘ◞ 〕─╮
│
│  ❌ تعذر جلب طلبات الانضمام.
│
│  قد تكون نسخة Baileys الحالية
│  لا تدعم هذه العملية.
│
╰────────────────╯`
        )
    }

    if (!Array.isArray(requests) || requests.length === 0) {
        return m.reply(
`╭─〔 ◜Ｎｏｘ◞ 〕─╮
│
│  ◌ لا توجد طلبات انضمام
│  معلّقة حاليًا.
│
│  ✦ كل شيء هادئ.
│
╰────────────────╯`
        )
    }

    const input = String(args[0] || '').toLowerCase().trim()

    let amount

    if (
        input === 'الكل' ||
        input === 'كل' ||
        input === 'all' ||
        input === '*'
    ) {
        amount = requests.length
    } else if (/^\d+$/.test(input)) {
        amount = Number(input)

        if (amount <= 0) {
            return m.reply(
`╭─〔 ◜Ｎｏｘ◞ 〕─╮
│
│  ❗ العدد يجب أن يكون
│  أكبر من صفر.
│
│  مثال:
│  قبول 5
│
╰────────────────╯`
            )
        }

        amount = Math.min(amount, requests.length)
    } else {
        return m.reply(
`╭─〔 ◜Ｎｏｘ◞ 〕─╮
│
│  ✦ طلبات الانضمام
│
│  عدد الطلبات:
│  ${requests.length}
│
│  ───────────────
│
│  قبول الكل
│  قبول 5
│  قبول 10
│
╰────────────────╯`
        )
    }

    const selected = requests
        .slice(0, amount)
        .map(user =>
            user.jid ||
            user.id ||
            user.phoneNumber ||
            user.lid
        )
        .filter(Boolean)

    if (!selected.length) {
        return m.reply(
`╭─〔 ◜Ｎｏｘ◞ 〕─╮
│
│  ❌ لم أجد أعضاء لقبولهم.
│
╰────────────────╯`
        )
    }

    let result

    try {
        result = await conn.groupRequestParticipantsUpdate(
            m.chat,
            selected,
            'approve'
        )
    } catch (e) {
        console.error('NOX APPROVE ERROR:', e)

        return m.reply(
`╭─〔 ◜Ｎｏｘ◞ 〕─╮
│
│  ❌ فشل قبول الطلبات.
│
│  تأكد أن البوت مشرف
│  في المجموعة.
│
╰────────────────╯`
        )
    }

    let approved = selected.length

    if (Array.isArray(result)) {
        const successful = result.filter(x =>
            String(x?.status) === '200' ||
            String(x?.status) === '201'
        )

        if (successful.length) {
            approved = successful.length
        }
    }

    const remaining = Math.max(
        requests.length - approved,
        0
    )

    return m.reply(
`╭─〔 ◜Ｎｏｘ◞ 〕─╮
│
│  ✦ تم قبول الطلبات بنجاح
│
│  ───────────────
│
│  ✓ المقبول:
│  ${approved} طلب
│
│  ◌ المتبقي:
│  ${remaining} طلب
│
│  ───────────────
│
│  ◜Ｎｏｘ◞
│  إدارة المجموعة
│
╰────────────────╯`
    )
}

handler.help = [
    'قبول الكل',
    'قبول <عدد>'
]

handler.tags = [
    'group'
]

handler.command = [
    'قبول'
]

handler.group = true

export default handler