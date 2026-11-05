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

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { generateWAMessageFromContent, proto, generateMessageIDV2 } from "@whiskeysockets/baileys"
import hljs from "highlight.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function mapType(type) {
  switch (type) {
    case "keyword":
    case "built_in":
      return 1
    case "number":
    case "literal":
      return 2
    case "string":
    case "regexp":
      return 3
    case "title":
    case "function":
    case "attr":
      return 4
    case "comment":
    case "doctag":
      return 5
    case "variable":
    case "template-variable":
      return 6
    case "property":
    case "symbol":
      return 7
    case "params":
      return 8
    case "class":
    case "type":
      return 9
    case "operator":
    case "punctuation":
      return 10
    default:
      return 0
  }
}

function hljsToWhatsApp(code, lang = "javascript") {
  let html
  try {
    html = hljs.highlight(code, { language: lang }).value
  } catch {
    html = code
  }

  const result = []
  const regex = /(<span class="hljs-(.*?)">.*?<\/span>)/gs
  let lastIndex = 0
  let match

  const decodeHTML = s =>
    s
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")

  while ((match = regex.exec(html)) !== null) {
    if (match.index > lastIndex) {
      const raw = decodeHTML(
        html.slice(lastIndex, match.index).replace(/<[^>]+>/g, "")
      )

      raw.split(/(\s+|\.|\(|\)|\{|\}|,|:)/g)
        .filter(Boolean)
        .forEach(part =>
          result.push({
            highlightType: 0,
            codeContent: part
          })
        )
    }

    const types = match[2].split(" ")
    const mappedType = mapType(types[0])

    result.push({
      highlightType: mappedType,
      codeContent: decodeHTML(match[1].replace(/<[^>]+>/g, ""))
    })

    lastIndex = regex.lastIndex
  }

  if (lastIndex < html.length) {
    const raw = decodeHTML(
      html.slice(lastIndex).replace(/<[^>]+>/g, "")
    )

    raw.split(/(\s+|\.|\(|\)|\{|\}|,|:)/g)
      .filter(Boolean)
      .forEach(part =>
        result.push({
          highlightType: 0,
          codeContent: part
        })
      )
  }

  return result
}

const handler = async (m, { conn, args, usedPrefix }) => {
  const allowedUsers = [
    '923107260507@s.whatsapp.net',
    '923107260507@s.whatsapp.net'
  ]

  if (!allowedUsers.includes(m.sender)) {
    return m.reply('⛔ هذا الأمر مخصص للمطور فقط.')
  }

  const react = async (e) => {
    try { await conn.sendMessage(m.chat, { react: { text: e, key: m.key } }) } catch {}
  }

  const pluginsDir = __dirname
  const currentFile = path.basename(__filename)
  const getPlugins = () => fs.readdirSync(pluginsDir).filter(f => f.endsWith(".js") && f !== currentFile)

  const findPlugin = (name) => {
    let searchName = name.replace(/\.js$/i, "").trim().toLowerCase()
    searchName = searchName.replace(/\s+/g, '-')
    const allFiles = getPlugins()
    
    let found = allFiles.find(f => f.toLowerCase() === searchName + ".js")
    if (found) return found
    
    found = allFiles.find(f => f.replace(/-/g, '_').toLowerCase() === searchName.replace(/-/g, '_') + ".js")
    if (found) return found
    
    found = allFiles.find(f => f.toLowerCase().includes(searchName))
    if (found) return found
    
    found = allFiles.find(f => searchName.includes(f.replace(".js", "").toLowerCase()))
    if (found) return found
    
    return null
  }

  const action = (args[0] || "").toLowerCase()

  if (/^(عرض|show|get)$/i.test(action)) {
    const nameArg = args.slice(1).join(" ").trim()
    if (!nameArg) {
      return m.reply(`╭━━〔 📄 عـرض بـلـوجـن 〕━━╮
┃ 📌 الاستخدام:
┃ ${usedPrefix}بلوقن عرض <اسم البلجن>
╰━━━━━━━━━━━━╯`)
    }

    const foundFile = findPlugin(nameArg)
    if (!foundFile) {
      await react("❌")
      return m.reply(`╭━━〔 ⚠️ خطأ 〕━━╮
┃ لم يتم العثور على الملف:
┃ ${nameArg}
┃
┃ 💡 استخدم ${usedPrefix}بلوقن لست لعرض جميع البلجنات.
╰━━━━━━━━━━━━╯`)
    }

    await react("⏳")

    const filePath = path.join(pluginsDir, foundFile)
    const code = fs.readFileSync(filePath, "utf-8")

    try {
      const codeLines = code.split('\n')
      const codeBlocks = hljsToWhatsApp(code, "javascript")
      
      const submessages = [
        {
          messageType: 2,
          messageText: `\n📄 *${foundFile}*\n📦 الحجم: ${(code.length / 1024).toFixed(2)} KB\n📝 ${codeLines.length} سطر\n`,
        },
        {
          messageType: 5,
          codeMetadata: {
            codeLanguage: "javascript",
            codeBlocks: codeBlocks
          }
        }
      ]

      const richMessage = {
        richResponseMessage: {
          messageType: 1,
          submessages: submessages,
          contextInfo: {
            isForwarded: true,
            forwardingScore: 1,
            forwardedAiBotMessageInfo: { 
              botJid: "867051314767696@bot"
            },
            forwardOrigin: 4
          }
        }
      }

      const msg = await generateWAMessageFromContent(m.chat, { 
        botForwardedMessage: { message: richMessage } 
      }, {
        senderId: conn.user.id,
        userJid: conn.user.id,
        messageId: generateMessageIDV2(conn.user.id),
        quoted: m
      })

      await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
      await react("📄")
      
    } catch (metaErr) {
      console.error("Meta AI Error:", metaErr)
      const copyButton = {
        name: 'cta_copy',
        buttonParamsJson: JSON.stringify({
          display_text: '📋 نسخ الكود',
          copy_code: code
        })
      }

      const menuText = `╭━━〔 📄 ${foundFile} 〕━━╮
┃ 📦 الحجم: ${(code.length / 1024).toFixed(2)} KB
┃ ⚔️ اضغط على الزر أدناه لنسخ الكود
╰━━━━━━━━━━━━╯`

      const interactiveMessage = {
        body: { text: menuText },
        footer: { text: '⚡ MASTER MD ⚡' },
        nativeFlowMessage: {
          buttons: [copyButton]
        }
      }

      const msg2 = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
          message: {
            interactiveMessage: proto.Message.InteractiveMessage.fromObject(interactiveMessage)
          }
        }
      }, { userJid: conn.user.jid, quoted: m })

      await conn.relayMessage(m.chat, msg2.message, { messageId: msg2.key.id })
      await react("📄")
    }
    return
  }

  if (/^(لست|list)$/i.test(action)) {
    const plugins = getPlugins()
    if (!plugins.length) {
      await react("📦")
      return m.reply(`╭━━〔 📂 لا يوجد 〕━━╮
┃ لا يوجد أي بلجنات مثبتة حالياً.
╰━━━━━━━━━━━━╯`)
    }

    const pluginsList = plugins.map((f, i) => `◈ ${i + 1}. ${f.replace(".js", "")}`).join('\n')

    await react("📦")
    return m.reply(`╭━━〔 𝐍𝐎𝐗 〕━━╮
┃ 📦 قائمة البلجنات المتاحة:
┃
${pluginsList}
┃
┃ 📊 المجموع: ${plugins.length} بلجن
╰━━━━━━━━━━━━╯`)
  }

  if (/^(حذف|delete|del|remove)$/i.test(action)) {
    const nameArg = args.slice(1).join(" ").trim()
    if (!nameArg) {
      return m.reply(`╭━━〔 🗑️ حذف بلجن 〕━━╮
┃ 📌 الاستخدام:
┃ ${usedPrefix}بلوقن حذف <اسم البلجن>
╰━━━━━━━━━━━━╯`)
    }

    const foundFile = findPlugin(nameArg)
    if (!foundFile) {
      await react("❌")
      return m.reply(`╭━━〔 ⚠️ خطأ 〕━━╮
┃ لم يتم العثور على الملف:
┃ ${nameArg}
┃
┃ 💡 استخدم ${usedPrefix}بلوقن لست لعرض جميع البلجنات.
╰━━━━━━━━━━━━╯`)
    }

    const filePath = path.join(pluginsDir, foundFile)
    const code = fs.readFileSync(filePath, "utf-8")
    const fileSize = (code.length / 1024).toFixed(2)
    const lineCount = code.split('\n').length

    fs.unlinkSync(filePath)
    if (global.plugins?.[foundFile]) delete global.plugins[foundFile]

    await react("🗑️")
    return m.reply(`╭━━〔 🗑️ تم الحذف 〕━━╮
┃ 📄 الملف: ${foundFile}
┃ 📦 الحجم: ${fileSize} KB
┃ 📝 الأسطر: ${lineCount} سطر
╰━━━━━━━━━━━━╯`)
  }

  if (/^(اضف|اضافه|اضافة|add)$/i.test(action)) {
    const quoted = m.quoted
    if (!quoted) {
      await react("❌")
      return m.reply(`╭━━〔 ⚠️ خطأ 〕━━╮
┃ يرجى الرد على كود أو ملف البلجن المراد إضافته.
╰━━━━━━━━━━━━╯`)
    }

    await react("⏳")

    let code = ""
    let fileName = ""
    
    const customName = args.slice(1).join(" ").trim()

    const docMsg = quoted.message?.documentMessage ||
      quoted.message?.documentWithCaptionMessage?.message?.documentMessage || null

    if (docMsg) {
      let buffer
      try { buffer = await quoted.download() } catch {
        try {
          const stream = await conn.downloadContentFromMessage(docMsg, "document")
          const chunks = []
          for await (const c of stream) chunks.push(c)
          buffer = Buffer.concat(chunks)
        } catch (e) {
          await react("❌")
          return m.reply(`╭━━〔 ❌ خطأ 〕━━╮
┃ فشل تحميل الملف:
┃ ${e.message}
╰━━━━━━━━━━━━╯`)
        }
      }
      
      if (customName) {
        const cleanName = customName.replace(/\.js$/i, "").trim().replace(/\s+/g, '-')
        fileName = `${cleanName}.js`
      } else {
        const baseName = (docMsg.fileName || `plugin_${Date.now()}`).replace(/\.js$/i, "")
        fileName = `${baseName}.js`
      }
      
      code = buffer.toString("utf-8")
    } else {
      code = quoted.text || quoted.body || ""
      if (!code.trim()) {
        await react("❌")
        return m.reply(`╭━━〔 ⚠️ خطأ 〕━━╮
┃ الرسالة المحددة لا تحتوي على أي كود.
╰━━━━━━━━━━━━╯`)
      }
      
      if (customName) {
        const cleanName = customName.replace(/\.js$/i, "").trim().replace(/\s+/g, '-')
        fileName = `${cleanName}.js`
      } else {
        let extractedName = null
        
        const cmdMatch1 = code.match(/handler\.command\s*=\s*\/\^\(?([^)\/|\\s]+)/)
        if (cmdMatch1) extractedName = cmdMatch1[1].trim()
        
        if (!extractedName) {
          const cmdMatch2 = code.match(/handler\.command\s*=\s*\[['"`]([^'"`]+)['"`]\]/)
          if (cmdMatch2) extractedName = cmdMatch2[1].trim()
        }
        
        if (!extractedName) {
          const cmdMatch3 = code.match(/command\s*:\s*['"`]([^'"`]+)['"`]/)
          if (cmdMatch3) extractedName = cmdMatch3[1].trim()
        }
        
        if (!extractedName) {
          const fileMatch = code.match(/plugins\/([a-zA-Z0-9_-]+)\.js/)
          if (fileMatch) extractedName = fileMatch[1].trim()
        }
        
        if (!extractedName) {
          extractedName = `plugin_${Date.now()}`
        }
        
        fileName = `${extractedName}.js`
      }
    }

    const savePath = path.join(pluginsDir, fileName)
    const isEdit = fs.existsSync(savePath)
    fs.writeFileSync(savePath, code, "utf-8")

    const fileSize = (code.length / 1024).toFixed(2)
    const lineCount = code.split('\n').length

    await react("✅")
    return m.reply(`╭━━〔 ${isEdit ? '✏️ تم التعديل' : '✅ تم الإضافة'} 〕━━╮
┃ 📄 الملف: ${fileName}
┃ 📦 الحجم: ${fileSize} KB
┃ 📝 الأسطر: ${lineCount} سطر
╰━━━━━━━━━━━━╯`)
  }

  await react("📦")
  return m.reply(`╭━━〔 📦 إدارة البلجنات 〕━━╮
┃ 📋 لست: عرض قائمة بكل البلجنات
┃ 📄 عرض: عرض الكود البرمجي ملون
┃ ➕ اضف: إضافة بلجن جديد (مع الاسم)
┃ 🗑️ حذف: حذف بلجن محدد
┃
┃ 📌 مثال:
┃ ${usedPrefix}بلوقن اضف myplugin
╰━━━━━━━━━━━━╯`)
}

handler.help = ["بلوقن لست", "بلوقن عرض", "بلوقن اضف", "بلوقن حذف"]
handler.tags = ["owner"]
handler.command = ['بلوقن', 'plugin', 'plugins']

export default handler