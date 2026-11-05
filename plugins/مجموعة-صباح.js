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

let handler = async (m, { conn }) => {
    m.react('☀️');

    const messages = [
        "🌞 صباح الخير! أتمنى أن يكون يومك مليئًا بالفرح والفرص الجميلة.",
        "🔆 صباح الخير! أتمنى أن يحمل لك هذا اليوم ابتسامات ولحظات لا تُنسى.",
        "🌤️ صباح الخير! أتمنى أن تجد الجمال في كل التفاصيل الصغيرة اليوم.",
        "✨ صباح الخير! أتمنى أن يكون يومك مليئًا بالإلهام وأن تقرّبك كل خطوة من أحلامك.",
        "🌅 صباح الخير! أتمنى أن يكون يومك مليئًا بالنور والطاقة الإيجابية.",
        "🌄 صباح الخير! أتمنى أن يحمل لك هذا اليوم الكثير من الفرح والفرص الجميلة."
    ];

    let randomMessage = messages[Math.floor(Math.random() * messages.length)];

    if (m.isGroup) {
        let videos = [
            'https://qu.ax/ZVcM.mp4',
            'https://qu.ax/tCblW.mp4',
            'https://qu.ax/kGzZr.mp4',
            'https://qu.ax/iioMV.mp4',
            'https://qu.ax/JgSvx.mp4',
            'https://qu.ax/dvrKi.mp4',
            'https://qu.ax/TZuhK.mp4'
        ];

        const video = videos[Math.floor(Math.random() * videos.length)];

        const caption = `╭━━━〔 ☀️ 𝐍𝐎𝐗 〕━━━╮
│
│ ${randomMessage}
│
│ 🌻 نتمنى لك يومًا جميلًا ومليئًا
│    بالطاقة والنجاح ✨
│
╰━━━━━━━━━━━━━━━━━━╯`;

        conn.sendMessage(
            m.chat,
            {
                video: { url: video },
                gifPlayback: true,
                caption
            },
            { quoted: m }
        );
    }
};

handler.help = ['صباح'];
handler.tags = ['مجموعة'];
handler.command = ['صباح', 'صباحالخير', 'صباحكم'];
handler.group = true;

export default handler;