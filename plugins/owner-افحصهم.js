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
import chalk from 'chalk';

const handler = async (m, { conn }) => {
  const pluginDir = './plugins';
  const files = fs.readdirSync(pluginDir).filter(file => file.endsWith('.js'));

  if (files.length === 0) return m.reply('🪐 لا يوجد أي بلوجنات للتنفيذ.');

  m.reply(`🛰️ جاري تحميل وتشغيل ${files.length} بلوجن...\n`);

  for (const file of files) {
    const fullPath = path.join(pluginDir, file);
    try {
      const plugin = await import(path.resolve(fullPath));

      if (plugin?.default?.handler) {
        await plugin.default.handler(m, { conn, text: '', usedPrefix: '', command: '' });
        m.reply(`🟢 تم تنفيذ البلوجن: ${file}`);
      } else {
        console.log(chalk.yellow(`🟡 لا يوجد handler في ${file}`));
      }
    } catch (e) {
      m.reply(`🔴 خطأ في تشغيل البلوجن ${file}:\n${e.message}`);
    }
  }

  m.reply('🏁 انتهى تنفيذ جميع البلوجنز.');
};

handler.help = ['افحصهم'];
handler.command = ['افحصهم'];
handler.tags = ['owner'];

export default handler;