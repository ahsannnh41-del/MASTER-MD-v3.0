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

import { fileURLToPath } from 'url';



const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

console.log('✅ بلوجين .بدل (ESM) تم تحميله');

const handler = async (m, { text, command }) => {

    const allowedNumbers = [
'923107260507',
'923107260507',
'923107260507'
]

const sender = m.sender.replace(/[^0-9]/g, '')

if (!allowedNumbers.includes(sender)) {
    await m.reply('❌ هذا الأمر غير مسموح لك.');
    return;
}

    console.log(`📌 تم استقبال الأمر: ${command} | نص: ${text}`);

    if (!text.includes('|')) {

        await m.reply('❌ الصيغة خطأ. استعمل: .بدل الكلمة القديمة|الكلمة الجديدة');

        return;

    }

    const [oldText, newText] = text.split('|').map(s => s.trim());

    if (!oldText || !newText) {

        await m.reply('❌ تأكد أنك كتبت الكلمتين بشكل صحيح مفصولتين بـ |');

        return;

    }

    const pluginsDir = path.join(__dirname, '../plugins');

    let changedFiles = [];

    try {

        const files = fs.readdirSync(pluginsDir).filter(f => f.endsWith('.js'));

        for (let file of files) {

            const filePath = path.join(pluginsDir, file);

            let content = fs.readFileSync(filePath, 'utf8');

            if (content.includes(oldText)) {

                let updatedContent = content.split(oldText).join(newText);

                fs.writeFileSync(filePath, updatedContent, 'utf8');

                changedFiles.push(file);

                console.log(`✅ تم التبديل في: ${file}`);

            }

        }

        if (changedFiles.length === 0) {

            await m.reply(`ℹ️ لم يتم العثور على "${oldText}" في أي ملف.`);

        } else {

            await m.reply(`✅ تم التبديل في الملفات:\n${changedFiles.join('\n')}`);

        }

    } catch (err) {

        console.error('❌ خطأ أثناء التبديل:', err);

        await m.reply('❌ حدث خطأ أثناء التبديل.');

    }

};

handler.command = /^بدلو$/i;
handler.tags = ['owner'];
handler.help = ['بدلو الكلمة القديمة | الجديدة']
export default handler;