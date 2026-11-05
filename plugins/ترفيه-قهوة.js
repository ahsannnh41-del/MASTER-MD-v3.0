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

import fs from 'fs';
import path from 'path';

let handler = async (m, { conn, usedPrefix }) => {
    let who;

    if (m.mentionedJid.length > 0) {
        who = m.mentionedJid[0];
    } else if (m.quoted) {
        who = m.quoted.sender;
    } else {
        who = m.sender;
    }

    let name = conn.getName(who);
    let name2 = conn.getName(m.sender);
    m.react('☕');

    let str;
    if (m.mentionedJid.length > 0) {
        str = `╭━━━〔 ☕ 𝐍𝐎𝐗 〕━━━╮
│
│ ☕ *${name2}*
│ يشرب فنجان قهوة مع
│ 👤 *${name || who}*
│
╰━━━━━━━━━━━━━━━━━━╯`;
    } else if (m.quoted) {
        str = `╭━━━〔 ☕ 𝐍𝐎𝐗 〕━━━╮
│
│ ☕ *${name2}*
│ يشرب فنجان قهوة مع
│ 👤 *${name || who}*
│
╰━━━━━━━━━━━━━━━━━━╯`;
    } else {
        str = `╭━━━〔 ☕ 𝐍𝐎𝐗 〕━━━╮
│
│ ☕ *${name2}*
│ يستمتع بفنجان قهوة ☕
│
╰━━━━━━━━━━━━━━━━━━╯`.trim();
    }

    if (m.isGroup) {
        let pp = 'https://files.catbox.moe/k6bzj0.mp4';
        let pp2 = 'https://files.catbox.moe/3pj3nx.mp4';
        let pp3 = 'https://files.catbox.moe/wcpe4z.mp4';
        let pp4 = 'https://files.catbox.moe/64t3cf.mp4';
        let pp5 = 'https://files.catbox.moe/qy1qmo.mp4';
        let pp6 = 'https://files.catbox.moe/va1mu7.mp4';
        let pp7 = 'https://files.catbox.moe/zqqre3.mp4';
        let pp8 = 'https://files.catbox.moe/duydzw.mp4';
        let pp9 = 'https://files.catbox.moe/4mn95m.mp4';

        const videos = [pp, pp2, pp3, pp4, pp5, pp6, pp7, pp8, pp9];
        const video = videos[Math.floor(Math.random() * videos.length)];

        let mentions = [who];

        conn.sendMessage(
            m.chat,
            {
                video: { url: video },
                gifPlayback: true,
                caption: str,
                mentions
            },
            { quoted: m }
        );
    }
};

handler.help = ['قهوة @منشن'];
handler.tags = ['ترفيه'];
handler.command = ['قهوة', 'كهوة'];
handler.group = true;

export default handler;