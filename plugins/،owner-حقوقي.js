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

import { readdirSync, readFileSync, writeFileSync, statSync } from 'fs';
import path, { join, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const CREDITS = `/*
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
*/`;

const TARGET_DIR = __dirname;

const IGNORE_FILES = [
  'node_modules',
  '.git',
  'package.json',
  'package-lock.json'
];

function processFile(filePath) {
  let content = readFileSync(filePath, 'utf8');
  let cleaned = content.trimStart();

  while (cleaned.startsWith('/*')) {
    const end = cleaned.indexOf('*/');

    if (end === -1) break;

    cleaned = cleaned.slice(end + 2).trimStart();
  }

  const lines = cleaned.split('\n');

  let startIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('//')) {
      startIndex = i + 1;
    } else {
      break;
    }
  }

  cleaned = lines.slice(startIndex).join('\n').trimStart();

  const newContent = CREDITS + '\n\n' + cleaned;

  if (content.trim() === newContent.trim()) {
    return false;
  }

  writeFileSync(filePath, newContent, 'utf8');

  return true;
}

function walkDir(dir) {
  let entries;

  try {
    entries = readdirSync(dir);
  } catch {
    return {
      edited: 0,
      skipped: 0
    };
  }

  let edited = 0;
  let skipped = 0;

  for (const entry of entries) {

    if (IGNORE_FILES.includes(entry)) {
      continue;
    }

    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {

      const res = walkDir(fullPath);

      edited += res.edited;
      skipped += res.skipped;

    } else if (extname(fullPath) === '.js') {

      const changed = processFile(fullPath);

      if (changed) {
        edited++;
      } else {
        skipped++;
      }
    }
  }

  return {
    edited,
    skipped
  };
}

let handler = async (m, { conn, isOwner }) => {

  if (!isOwner) {
    return m.reply('❌ هذا الأمر للمطورين فقط.');
  }

  await m.reply(
    `⚡ MASTER MD ⚡

🚀 جاري إضافة حقوق AHSAN (03107260507)
على ملفات JavaScript...`
  );

  let result;

  try {

    result = walkDir(TARGET_DIR);

  } catch (err) {

    console.error(err);

    return m.reply(
      `❌ حدث خطأ أثناء معالجة الملفات:

${err.message}`
    );
  }

  await m.reply(
    `⚡ MASTER MD ⚡

「 𝐂𝐫𝐞𝐝𝐢𝐭𝐬 𝐛𝐲 AHSAN (03107260507) 」

✅ تم الانتهاء بنجاح.

📁 الملفات التي تم تعديلها:
${result.edited}

⏭️ الملفات التي تم تخطيها:
${result.skipped}

🖤 لا تحذف الحقوق.`
  );
};

handler.help = ['addcredits'];
handler.tags = ['owner'];
handler.command = /^(addcredits|حقوقي|الحقوق)$/i;
handler.owner = true;

export default handler;