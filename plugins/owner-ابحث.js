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

let handler = async (m, { text, conn, usedPrefix, command }) => {
  if (!text)
    return m.reply(`MASTER MD 〢 𝚂𝙴𝙰𝚁𝙲𝙷

🔎 اكتب الكلمة أو الحرف الذي تريد البحث عنه.

📌 الاستخدام:
${usedPrefix + command} <الكلمة أو الحرف>

مثال:
${usedPrefix + command} ا`)

  let baseDir = './plugins'
  let files = getAllJsFiles(baseDir)

  let results = []
  let codeCounter = 1

  for (let file of files) {
    let content = fs.readFileSync(file, 'utf-8')
    let lines = content.split('\n')

    lines.forEach((line, index) => {
      if (line.includes(text)) {
        results.push({
          codeNum: codeCounter++,
          file: path.basename(file),
          lineNum: index + 1,
          lineText: line.trim()
        })
      }
    })
  }

  if (results.length === 0) {
    return m.reply(`MASTER MD 〢 𝚂𝙴𝙰𝚁𝙲𝙷

❌ لم يتم العثور على أي تطابق.

🔎 البحث عن:
"${text}"`)
  }

  let output = `MASTER MD 〢 𝚂𝙴𝙰𝚁𝙲𝙷

✅ تم العثور على ${results.length} نتيجة.

🔎 البحث عن:
"${text}"

━━━━━━━━━━━━━━━━━━

`

  for (let res of results) {
    output += `📄 𝙲𝙾𝙳𝙴 〢 ${res.codeNum}
📁 𝙵𝙸𝙻𝙴 〢 ${res.file}
🔢 𝙻𝙸𝙽𝙴 〢 ${res.lineNum}
> ${res.lineText}

━━━━━━━━━━━━━━━━━━

`
  }

  if (output.length > 4000) {
    const filePath = './tmp/search_results.txt'

    if (!fs.existsSync('./tmp'))
      fs.mkdirSync('./tmp', { recursive: true })

    fs.writeFileSync(filePath, output)

    await conn.sendFile(
      m.chat,
      filePath,
      'nox_search_results.txt',
      `MASTER MD 〢 𝚁𝙴𝚂𝚄𝙻𝚃𝚂

📁 النتائج كثيرة، لذلك تم إرسالها كملف.`,
      m
    )

    fs.unlinkSync(filePath)
  } else {
    await conn.reply(m.chat, output.trim(), m)
  }
}

handler.help = ['ابحث <كلمة>']
handler.tags = ['owner']
handler.command = /^ابحث$/i
handler.owner = true

export default handler

function getAllJsFiles(dirPath, arrayOfFiles = []) {
  let files = fs.readdirSync(dirPath)

  for (let file of files) {
    let filePath = path.join(dirPath, file)

    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllJsFiles(filePath, arrayOfFiles)
    } else if (filePath.endsWith('.js')) {
      arrayOfFiles.push(filePath)
    }
  }

  return arrayOfFiles
}