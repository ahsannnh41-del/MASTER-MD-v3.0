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

let handler = async (m, { conn, usedPrefix, command }) => {
    const ownerNumber = "923107260507";

    let senderNumber = m.sender.replace(/[^0-9]/g, '');

    if (senderNumber !== ownerNumber) {
        return m.reply("❌ هذا الأمر مخصص لمطور ويليام فقط!");
    }

    if (!m.isGroup) {
        return m.reply("❌ هذا الأمر يتم تنفيذه داخل المجموعات فقط.");
    }

    try {
        await conn.sendMessage(m.chat, {
            text: "حاضر مطوري ويليام 🤍"
        }, { quoted: m });

        await new Promise(resolve => setTimeout(resolve, 1000));

        await conn.groupLeave(m.chat);

    } catch (e) {
        console.error(e);
        m.reply("❌ حدث خطأ أثناء محاولة خروج ويليام من المجموعة.");
    }
};

handler.help = ["اوت"];
handler.tags = ["owner"];
handler.command = /^(اوت)$/i;
handler.group = true;

export default handler;