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

import { delay } from '@whiskeysockets/baileys';

let handler = async (m, { conn }) => {
    let target = "I'm MASTER MD";
    let chars = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890!@#$%^&*()";
    
    let { key } = await conn.sendMessage(m.chat, { text: "..." });

    for (let i = 0; i <= target.length; i++) {
        let output = "";
        for (let j = 0; j < target.length; j++) {
            if (j < i) {
                output += target[j];
            } else {
                output += chars[Math.floor(Math.random() * chars.length)];
            }
        }
        await conn.sendMessage(m.chat, { text: output, edit: key }).catch(() => {});
        await delay(30);
    }

    await conn.sendMessage(m.chat, { text: target, edit: key }).catch(() => {});
};

handler.command = ['تست'];
export default handler;