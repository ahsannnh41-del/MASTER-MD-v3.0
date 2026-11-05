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

import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys';

let handler = async (m, { text, conn }) => {
  if (!text) return m.reply('الرجاء إدخال رابط القناة.');
  if (!text.includes('https://whatsapp.com/channel/')) return m.reply('رابط غير صحيح.');

  let result = text.split('https://whatsapp.com/channel/')[1];
  let channelId = result.split('/')[0];

  let res;
  try {
    res = await conn.newsletterMetadata('invite', channelId); 
  } catch (error) {
    console.error("Error fetching channel metadata:", error); 
    return m.reply('حدث خطأ أثناء جلب بيانات القناة. تأكد من صحة الرابط.');
  }
  let channelName = typeof res.name === 'object' 
    ? (res.name?.text || res.name?.value || 'غير معروف')
    : (res.name || res.subject || res.title || 'غير معروف');
  let subscribersCount = res.subscribers ?? res.subscribersCount ?? res.subscribers_count ?? res.subscribersCountText ?? 'غير معروف';

  let timestamp = new Date().getTime();
  let formattedTime = new Date(timestamp).toLocaleString('ar-EG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  let nox = "𝙽𝙾𝚇";
  let teks = `╭━〔 *معلومات القناة* 〕━⬣
┃ 🆔 *ID:* ${res.id || 'غير متوفر'}
┃ 🧣 *الاسم:* ${channelName}
┃ 🕓 *وقت جلب المعلومات:* ${formattedTime}
┃ 👤 *عدد المشتركين:* ${subscribersCount}
┃ 🚦 *الحالة:* ${res.state || 'غير معروف'}
┃ ✅ *التحقق:* ${res.verification === 'VERIFIED' ? 'مُحققة' : 'غير مُحققة'}
╰━━━━━━〔${nox}〕━━━⬣`;

  try {
    let msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2
          },
          interactiveMessage: proto.Message.InteractiveMessage.create({
            body: proto.Message.InteractiveMessage.Body.create({ text: teks }),
            footer: proto.Message.InteractiveMessage.Footer.create({ text: nox }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
              buttons: [
                {
                  name: "cta_copy",
                  buttonParamsJson: JSON.stringify({
                    display_text: "نسخ الـ ID 📋",
                    id: "copy_lid",
                    copy_code: String(res.id)
                  })
                }
              ]
            })
          })
        }
      }
    }, { quoted: m });

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
  } catch (e) {
    console.error("Button Error:", e);
    await m.reply(teks);
  }
};

handler.help = ['lid2'];
handler.command = ['lid2'];
handler.tags = ['tools'];

export default handler;