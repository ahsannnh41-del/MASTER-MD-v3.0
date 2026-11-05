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
    m.react('🌕');

    const messages = [
        "🌙 تصبح على خير! أتمنى لك راحة هادئة ونومًا مريحًا وأحلامًا جميلة.",
        "✨ تصبح على خير! أتمنى أن يحيط بك هدوء الليل وتستعد ليوم جديد.",
        "🌌 تصبح على خير! تذكر أن كل نجمة في السماء تحمل حلمًا ينتظر أن يتحقق.",
        "🌙 تصبح على خير! اترك هموم اليوم خلفك واستمتع بسلام الليل.",
        "🌠 تصبح على خير! أتمنى أن تكون أحلامك مشرقة كالنجوم التي تضيء السماء.",
        "💤 تصبح على خير! أتمنى أن تجد السكينة في هدوء الليل وتستيقظ بنشاط."
    ];

    let randomMessage = messages[Math.floor(Math.random() * messages.length)];

    if (m.isGroup) {
        const videos = [
            'https://files.catbox.moe/0n2bf5.mp4',
            'https://files.catbox.moe/zua131.mp4',
            'https://files.catbox.moe/0im4vk.mp4',
            'https://files.catbox.moe/9cm0x9.mp4',
            'https://files.catbox.moe/7kxjhv.mp4',
            'https://files.catbox.moe/id09sr.mp4',
            'https://files.catbox.moe/3kyhf0.mp4',
            'https://files.catbox.moe/4qokmi.mp4'
        ];

        const video = videos[Math.floor(Math.random() * videos.length)];

        const caption = `╭━━━〔 🌙 𝐍𝐎𝐗 〕━━━╮
│
│ ${randomMessage}
│
│ 🌌 ليلة هادئة وأحلام جميلة
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

handler.help = ['ليلة'];
handler.tags = ['مجموعة'];
handler.command = ['ليلة', 'ليله', 'تصبحون'];
handler.group = true;

export default handler;