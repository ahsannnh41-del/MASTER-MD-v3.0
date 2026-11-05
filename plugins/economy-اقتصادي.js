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

function formatTime(ms) {
  if (ms <= 0 || isNaN(ms)) return 'الآن';

  const totalSeconds = Math.ceil(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor(totalSeconds % 86400 / 3600);
  const minutes = Math.floor(totalSeconds % 3600 / 60);
  const seconds = totalSeconds % 60;

  const parts = [];

  if (days) parts.push(days + " يوم");
  if (hours) parts.push(hours + " ساعة");
  if (minutes || hours || days) parts.push(minutes + " دقيقة");

  parts.push(seconds + " ثانية");

  return parts.join(" ");
}

let handler = async (m, { conn, command, usedPrefix }) => {

  if (!global.db.data.chats[m.chat].economy && m.isGroup) {
    return m.reply(`❌《✦》أوامر *الاقتصاد* متعطلة في هذه المجموعة.

🛠️ يمكن لأحد المشرفين تفعيلها:
» *${usedPrefix}economy on*`);
  }

  let user = global.db.data.users[m.sender];

  if (!user) {
    return conn.reply(
      m.chat,
      `ꕥ Ｎｏｘ | لا توجد بيانات اقتصادية لهذا المستخدم ❌`,
      m
    );
  }

  const now = Date.now();

  const timers = {
    'عمل': user.lastwork,
    'عمل2': user.lastslut,
    'جريمه': user.lastcrime,
    'سرقه': user.lastrob,
    'يومي': user.lastDaily,
    'اسبوعي': user.lastweekly,
    'شهري': user.lastmonthly,
    'سنوي': user.lastyearly,
    'صندوق': user.lastcofre,
    'مغامره': user.lastAdventure,
    'صيد': user.lastFish,
    'صيد-بري': user.lastHunt,
    'تنقيب': user.lastmine
  };

  const lines = Object.entries(timers).map(([name, time]) => {

    const diff =
      typeof time === "number"
        ? time - now
        : 0;

    return "ⴵ " + name + " » *" + formatTime(diff) + '*';
  });

  const totalCoins =
    ((user.coin || 0) + (user.bank || 0))
      .toLocaleString();

  const username =
    user.name ||
    (await conn.getName(m.sender)) ||
    m.sender.split('@')[0];

  const msg = `「✦」 Ｎｏｘ

*☽ المستخدم \`<${username}>\`*

${lines.join("\n")}

⛁ إجمالي العملات » *¥${totalCoins} ${currency}*`;

  await m.reply(msg.trim());
};

handler.help = ["اقتصادي"];
handler.tags = ['economy'];
handler.command = ["economyinfo", "infoeconomy", "اقتصادي"];
handler.group = true;

export default handler;