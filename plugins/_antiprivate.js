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

export async function before(m, { conn, isAdmin, isBotAdmin, isOwner, isROwner }) {
  if (m.isBaileys && m.fromMe) return true;
  if (m.isGroup) return false;
  if (!m.message) return true;

  const chat = global.db.data.chats[m.chat];
  const bot = global.db.data.settings[conn.user.jid] || {};

  
  const palabrasClave = ['دعم', 'allmenu', 'المطور', 'اوامر', 'تنصيب'];

  if (palabrasClave.some((palabra) => m.text.includes(palabra))) return true;
  if (m.chat === '120363426042842162@newsletter') return true;

  
  const creador = '+923107260507';
  if (m.sender.includes(creador.replace('+', ''))) return true;

  
  if (bot.antiPrivate && !isOwner && !isROwner) {
    
    const prefixRegex = /^[!/#$.]/;

    if (prefixRegex.test(m.text)) {
      const grupoURL = 'https://chat.whatsapp.com/CGcd4tj7oTrBJKRJoniE89';
      const nombreUsuario = await conn.getName(m.sender);

      const mensajeBloqueo = `⚠️ *مرحباً ${nombreUsuario}*، قام مالك البوت بتعطيل الأوامر في المحادثات الخاصة.

لذلك سيتم حظرك تلقائياً.

🌌 *انضم إلى المجموعة الرسمية لاستخدام البوت:*
${grupoURL}`;

      const imagenURL = 'https://files.catbox.moe/xm4gan.jpg';

      await conn.sendFile(m.chat, imagenURL, 'antiprivado.jpg', mensajeBloqueo, m, false, {
        mentions: [m.sender]
      });

      await conn.updateBlockStatus(m.chat, 'block');
    }
  }

  return false;
}