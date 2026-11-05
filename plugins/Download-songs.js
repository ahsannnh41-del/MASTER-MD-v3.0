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

import axios from "axios";

const API = "http://engez.a7a.online/api/v1";

const handlerSearch = async (m, { conn, text, usedPrefix }) => {
  if (!text)
    return m.reply(
      `╭━━━〔 🎧 *𝐒𝐩𝐨𝐭𝐢𝐟𝐲 𝐒𝐞𝐚𝐫𝐜𝐡* 〕━━━╮\n│\n│ ⚠️ ┊ *يرجى إرسال اسم الأغنية للبحث*\n│\n│ 📌 ┊ *مثال:*\n│ » ${usedPrefix}سبوتيفاي 7liwa\n│\n╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯`
    );

  await m.react("🔍");

  try {
    const { data } = await axios.get(`${API}/search/spotify`, { params: { q: text } });
    const results = data?.response?.results;
    if (!data.success || !results?.length) {
      await m.react("❌");
      return m.reply(
        `╭━━━〔 ❌ *𝐍𝐨 𝐑𝐞𝐬𝐮𝐥𝐭𝐬* 〕━━━╮\n│\n│ ✖️ ┊ *لم يتم العثور على أي نتائج*\n│\n╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯`
      );
    }

    const list = results.slice(0, 10);

    let generateWAMessageFromContent, proto;
    try {
      let baileysLib;
      try { baileysLib = await import('@whiskeysockets/baileys') }
      catch { baileysLib = await import('baileys') }

      generateWAMessageFromContent = baileysLib?.generateWAMessageFromContent || baileysLib?.default?.generateWAMessageFromContent;
      proto = baileysLib?.proto || baileysLib?.default?.proto;
    } catch (e) {
      console.error(e);
    }

    if (generateWAMessageFromContent && proto) {
      const buttons = [
        {
          name: "single_select",
          buttonParamsJson: JSON.stringify({
            title: "▻ إضغـط لـلاخـتـيـار ⚡",
            sections: [
              {
                title: `🎵 نتائج البحث عن: ${text}`,
                rows: list.map((t, i) => ({
                  title: `${i + 1}. ${t.name}`.slice(0, 24),
                  description: `👤 ${t.artist} | ⏱ ${t.duration}`.slice(0, 48),
                  id: `${usedPrefix}spdl ${t.url}`,
                })),
              },
            ],
          }),
        },
      ];

      const bodyText =
        `╭━━━〔 🎧 *بـحـث Spotify* 🎧 〕━━━╮\n` +
        `│\n` +
        `│ 🔍 ┊ *الـبـحـث:* ${text}\n` +
        `│ 📊 ┊ *عـدد الـنـتـائـج:* ${list.length}\n` +
        `│\n` +
        `╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯\n\n` +
        `👇 *اختر الأغنية المطلوبة من القائمة بالأسفل:*`;

      const msg = generateWAMessageFromContent(
        m.chat,
        {
          viewOnceMessage: {
            message: {
              messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
              interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                body: proto.Message.InteractiveMessage.Body.create({ text: bodyText }),
                footer: proto.Message.InteractiveMessage.Footer.create({ text: "👑 𝙉𝙊𝙓 𝘽𝙊𝙏 - ⧼ 𝙎𝙥𝙤𝙩𝙞𝙛𝙮 ⧽" }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({ buttons }),
              }),
            },
          },
        },
        {}
      );

      await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
      await m.react("✅");
      return;
    }

    let searchTxt =
      `╭━━━〔 🎧 *بـحـث Spotify* 🎧 〕━━━╮\n` +
      `│\n│ 🔍 ┊ *الـبـحـث:* ${text}\n│\n╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯\n\n`;

    list.forEach((t, i) => {
      searchTxt +=
        `ꕥ *${i + 1}.* ${t.name}\n` +
        `> 👤 *الفنان ›* ${t.artist}\n` +
        `> ⏱ *المدة ›* ${t.duration}\n` +
        `> 🔗 *التحميل ›* ${usedPrefix}spdl ${t.url}\n\n`;
    });

    searchTxt += `👑 𝙉𝙊𝙓 𝘽𝙊𝙏 - ⧼ 𝙎𝙥𝙤𝙩𝙞𝙛𝙮 ⧽`;

    await m.reply(searchTxt.trim());
    await m.react("✅");

  } catch (e) {
    console.error('[Spotify Search Error]', e);
    await m.react("❌");
    await m.reply(
      `╭━━━〔 ❌ *𝐄𝐫𝐫𝐨𝐫* 〕━━━╮\n│\n│ ✖️ ┊ *حدث خطأ أثناء البحث*\n│ 📋 ┊ ${e.message}\n│\n╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯`
    );
  }
};

const handlerDl = async (m, { conn, text, usedPrefix }) => {
  if (!text || !text.includes("spotify.com"))
    return m.reply(
      `╭━━━〔 🎧 *𝐒𝐩𝐨𝐭𝐢𝐟𝐲 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝* 〕━━━╮\n│\n│ ⚠️ ┊ *يرجى إرسال رابط Spotify صحيح*\n│\n│ 📌 ┊ *مثال:*\n│ » ${usedPrefix}spdl https://open.spotify.com/track/xxx\n│\n╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯`
    );

  await m.react("⏳");

  try {
    const { data } = await axios.get(`${API}/download/spotify`, { params: { url: text.trim() } });
    const info = data?.response;
    if (!data.success || !info?.downloadUrl)
      throw new Error("فشل الحصول على رابط التحميل من السيرفر.");

    await conn.sendMessage(
      m.chat,
      {
        audio: { url: info.downloadUrl },
        mimetype: "audio/mpeg",
        fileName: `${info.title || 'audio'}.mp3`,
        caption:
          `✨ ━━━〔 *تم التحميل بنجاح* 🎵 〕━━━ ✨\n\n` +
          `ꕥ 🎵 ┊ *العنوان ›* ${info.title}\n` +
          `ꕥ 👤 ┊ *الفنان ›* ${info.author || info.artist}\n` +
          `ꕥ ⏱ ┊ *المدة ›* ${info.duration}\n\n` +
          `👑 𝙉𝙊𝙓 𝘽𝙊𝙏 - ⧼ 𝙎𝙥𝙤𝙩𝙞𝙛𝙮 ⧽`
      },
      { quoted: m }
    );

    await m.react("✅");

  } catch (e) {
    console.error('[Spotify DL Error]', e);
    await m.react("❌");
    await m.reply(
      `╭━━━〔 ❌ *𝐄𝐫𝐫𝐨𝐫* 〕━━━╮\n│\n│ ✖️ ┊ *حدث خطأ أثناء التحميل*\n│ 📋 ┊ ${e.message}\n│\n╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯`
    );
  }
};

var handler = async (m, { conn, text, usedPrefix, command }) => {
  if (command === "سبوتيفاي" || command === "spsearch") return handlerSearch(m, { conn, text, usedPrefix });
  return handlerDl(m, { conn, text, usedPrefix });
};

handler.help = ["سبوتيفاي <بحث>", "spdl <رابط>"];
handler.tags = ["downloader"];
handler.command = /^(سبوتيفاي|spsearch|spdl|spotifydl)$/i;

export default handler;