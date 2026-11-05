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

let handler = async (m, { conn, isAdmin, isBotAdmin, text }) => {
    if (!m.isGroup) return conn.reply(m.chat, "الأمر ده يشتغل في الجروبات بس.", m);
    if (!isBotAdmin) return conn.reply(m.chat, "خليني أدمن الأول عشان أقدر أرقي حد.", m);
    if (!isAdmin) return conn.reply(m.chat, "الأمر ده للأدمن بس.", m);

    let target;
    if (m.quoted) {
        target = m.quoted.sender;
    } else if (m.mentionedJid && m.mentionedJid.length > 0) {
        target = m.mentionedJid[0];
    } else if (text) {
        let match = text.replace(/[^0-9]/g, "").match(/(\d{7,15})/);
        if (match) target = match[1];
    }

    if (!target) return conn.reply(m.chat, "منشن الشخص أو رد على رسالته عشان أرقيه.", m);

    let targetNumber = target.replace(/[^0-9]/g, "");

    let freshMeta = await conn.groupMetadata(m.chat, false);

    let matched = freshMeta.participants.find(p =>
        p.id.replace(/[^0-9]/g, "") === targetNumber ||
        p.phoneNumber?.replace(/[^0-9]/g, "") === targetNumber
    );

    if (!matched) return conn.reply(m.chat, "الشخص ده مش موجود في الجروب.", m);
    if (matched.admin) return conn.reply(m.chat, "الشخص ده أدمن بالفعل.", m);

    let promoteId = matched.phoneNumber || matched.id;

    try {
        await conn.groupParticipantsUpdateRaw(m.chat, [promoteId], "promote");
    } catch (e) {
        return conn.reply(m.chat, "حصل خطأ: " + (e.message || e), m);
    }

    let updatedMeta = await conn.groupMetadata(m.chat, false);
    let nowAdmin = updatedMeta.participants.find(p =>
        (p.id === matched.id || p.phoneNumber === matched.phoneNumber) && p.admin
    );

    if (nowAdmin) {
        await conn.reply(m.chat, "تمت الرفع ✅", m);
    } else {
        await conn.reply(m.chat, "فشلت الرفع فعليًا ❌", m);
    }
};

handler.command = ['ترقيه', 'رفع', 'promote']
handler.help = ['رفع']
handler.tags = ['group']

export default handler