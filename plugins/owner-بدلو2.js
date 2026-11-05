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

import fs from 'fs'
import path from 'path'
import { prepareWAMessageMedia } from '@whiskeysockets/baileys'

global.replaceCache = global.replaceCache || new Map()

const replaceCache = global.replaceCache

const allowedNumbers = [
    '923107260507',
    '923107260507'
]

const handler = async (m, { conn, text, command }) => {

    const sender = String(m.sender || '')
        .replace(/[^0-9]/g, '')

    if (!allowedNumbers.includes(sender)) {
        return m.reply('❌ هذا الأمر للمطور فقط.')
    }

    
    
    

    if (command === 'بدلو2') {

        if (!text || !text.includes('|')) {
            return m.reply(
                `╭━━━〔 𝐍𝐎𝐗 𝐁𝐎𝐓 〕━━━╮
┃
┃ ❌ الصيغة غير صحيحة
┃
┃ استخدم:
┃ .بدلو2 الكلمة القديمة | الكلمة الجديدة
┃
╰━━━━━━━━━━━━━━━━╯`
            )
        }

        const [oldText, newText] = text
            .split('|')
            .map(t => t.trim())

        if (!oldText || !newText) {
            return m.reply('⚠️ تأكد من كتابة الكلمتين بشكل صحيح.')
        }

        if (oldText === newText) {
            return m.reply('⚠️ الكلمة القديمة والجديدة متطابقتان.')
        }

        const pluginsDir =
            path.resolve(process.cwd(), 'plugins')

        if (!fs.existsSync(pluginsDir)) {
            return m.reply('❌ مجلد plugins غير موجود.')
        }

        const files = fs
            .readdirSync(pluginsDir)
            .filter(file => file.endsWith('.js'))

        const matchedFiles = []

        for (const file of files) {

            const filePath =
                path.join(pluginsDir, file)

            try {

                const content =
                    fs.readFileSync(filePath, 'utf8')

                if (content.includes(oldText)) {
                    matchedFiles.push(file)
                }

            } catch {}
        }

        if (!matchedFiles.length) {
            return m.reply(
                `╭━━━〔 𝐍𝐎𝐗 𝐁𝐎𝐓 〕━━━╮
┃
┃ 😕 لم يتم العثور على:
┃
┃ "${oldText}"
┃
┃ داخل أي Plugin.
┃
╰━━━━━━━━━━━━━━━━╯`
            )
        }

        replaceCache.set(sender, {
            oldText,
            newText,
            time: Date.now()
        })

        const imageUrl =
            global.michipg ||
            'https://files.catbox.moe/leougq.jpg'

        const media =
            await prepareWAMessageMedia(
                {
                    image: {
                        url: imageUrl
                    }
                },
                {
                    upload: conn.waUploadToServer
                }
            )

        const sectionRows =
            matchedFiles.map(file => ({
                header: '📂 Plugin',
                title: file,
                description: 'اضغط لتعديل هذا الملف',
                id: `.نفذ_التبديل ${file}`
            }))

        const menu = {
            viewOnceMessage: {
                message: {
                    interactiveMessage: {

                        body: {
                            text:
                                `╭━━━〔 𝐍𝐎𝐗 𝐁𝐎𝐓 〕━━━╮
┃
┃ 🔎 نتائج البحث
┃
┃ 📁 الملفات المطابقة:
┃ ${matchedFiles.length}
┃
┃ 🔄 الكلمة القديمة:
┃ ${oldText}
┃
┃ ➜ الكلمة الجديدة:
┃ ${newText}
┃
┃ اختر الملف الذي تريد تعديله 👇
┃
╰━━━━━━━━━━━━━━━━╯`
                        },

                        footer: {
                            text:
                                global.dev ||
                                global.author ||
                                'Nox Bot'
                        },

                        header: {
                            hasMediaAttachment: true,
                            imageMessage:
                                media.imageMessage
                        },

                        nativeFlowMessage: {
                            buttons: [
                                {
                                    name: 'single_select',

                                    buttonParamsJson:
                                        JSON.stringify({
                                            title:
                                                '📁 الملفات المطابقة',

                                            sections: [
                                                {
                                                    title:
                                                        '🛠️ اختر الملف',

                                                    highlight_label:
                                                        '𝐍𝐎𝐗 𝐁𝐎𝐓',

                                                    rows:
                                                        sectionRows
                                                }
                                            ]
                                        })
                                }
                            ]
                        }
                    }
                }
            }
        }

        return await conn.relayMessage(
            m.chat,
            menu,
            {}
        )
    }

    
    
    

    if (command === 'نفذ_التبديل') {

        const fileName =
            text?.trim()

        if (!fileName) {
            return m.reply(
                '⚠️ لم يتم تحديد الملف.'
            )
        }

        const data =
            replaceCache.get(sender)

        if (!data) {
            return m.reply(
                `❌ لا توجد عملية تبديل محفوظة.

استخدم:
.بدلو2 الكلمة القديمة | الكلمة الجديدة`
            )
        }

        const {
            oldText,
            newText
        } = data

        const pluginsDir =
            path.resolve(process.cwd(), 'plugins')

        const filePath =
            path.resolve(
                pluginsDir,
                fileName
            )

        if (
            !filePath.startsWith(
                pluginsDir + path.sep
            )
        ) {
            return m.reply(
                '❌ مسار الملف غير صالح.'
            )
        }

        if (!fileName.endsWith('.js')) {
            return m.reply(
                '❌ يمكنك تعديل ملفات JavaScript فقط.'
            )
        }

        if (!fs.existsSync(filePath)) {
            return m.reply(
                `❌ الملف غير موجود:

${fileName}`
            )
        }

        let content

        try {

            content =
                fs.readFileSync(
                    filePath,
                    'utf8'
                )

        } catch (err) {

            return m.reply(
                `❌ تعذر قراءة الملف:

${err.message}`
            )
        }

        if (!content.includes(oldText)) {

            replaceCache.delete(sender)

            return m.reply(
                `😕 الكلمة لم تعد موجودة داخل:

${fileName}`
            )
        }

        const occurrences =
            content.split(oldText).length - 1

        const newContent =
            content.replaceAll(
                oldText,
                newText
            )

        try {

            fs.writeFileSync(
                filePath,
                newContent,
                'utf8'
            )

        } catch (err) {

            return m.reply(
                `❌ تعذر حفظ التعديل:

${err.message}`
            )
        }

        replaceCache.delete(sender)

        await m.react('✅')

        return m.reply(
            `╭━━━〔 𝐍𝐎𝐗 𝐁𝐎𝐓 〕━━━╮
┃
┃ ✅ تم التبديل بنجاح
┃
┃ 📂 الملف:
┃ ${fileName}
┃
┃ 🔄 من:
┃ ${oldText}
┃
┃ ➜ إلى:
┃ ${newText}
┃
┃ 🔢 عدد الاستبدالات:
┃ ${occurrences}
┃
╰━━━━━━━━━━━━━━━━╯`
        )
    }
}

handler.command = /^(بدلو2|نفذ_التبديل)$/i
handler.help = [
    'بدلو2 الكلمة القديمة | الكلمة الجديدة',
    'نفذ_التبديل اسم_الملف.js'
]
handler.tags = ['owner']

export default handler