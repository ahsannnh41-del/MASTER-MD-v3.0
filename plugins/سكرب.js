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
import { execSync } from "child_process"

let handler = async (m, { conn }) => {
  
  let step = "0 - بداية الأمر"

  try {
    const allowedNumbers = [
      "923107260507",
      "923107260507"
    ]

    if (!allowedNumbers.includes(m.sender.replace(/[^0-9+]/g, ""))) {
      return m.reply("❌ انت مش مسموحلك تاخد النسخة الاحتياطية")
    }

    const tempDir = "./tmp"
    const backupName = "NOX-BOT"
    const backupPath = `${tempDir}/${backupName}.zip`
    const password = "NoxBot_ShanksX_William"
    const target = "120363430524886172@g.us"

    
    step = "1 - فحص تثبيت أمر zip"
    try {
      execSync("zip -v", { stdio: "pipe" })
    } catch {
      throw new Error("أمر zip مش متسطب على السيرفر. نزله بـ: apt install zip -y")
    }

    
    step = "2 - تجهيز فولدر tmp وتنضيفه"
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true })
    for (const file of fs.readdirSync(tempDir)) {
      fs.rmSync(`${tempDir}/${file}`, { recursive: true, force: true })
    }

    await m.reply("📦جاري ارسال النسخه الاحتياطيه")

    
    step = "3 - تحديد الملفات المطلوبة"
    
    const include = [
      "lib",
      "plugins",
      "src",
      "tmp",
      "A7A.js",
      "handler.js",
      "index.js",
      "package.json",
      "settings.js",
      "startup.js"
    ]

    const list = include.filter(f => fs.existsSync(f))
    const missing = include.filter(f => !fs.existsSync(f))
    if (missing.length) console.warn("[NOX BACKUP] ملفات مش موجودة وهيتم تخطيها:", missing.join(", "))
    if (list.length === 0) throw new Error("ولا ملف من القائمة موجود في مكان تشغيل البوت")

    const ls = list.map(f => `"${f}"`).join(" ")

    
    step = "4 - إنشاء ملف الزيب (zip)"
    try {
      execSync(`zip -r -q -P "${password}" "${backupPath}" ${ls}`, {
        stdio: "pipe",
        maxBuffer: 1024 * 1024 * 200
      })
    } catch (zipErr) {
      
      
      if (!(zipErr.status === 18 && fs.existsSync(backupPath))) throw zipErr
    }

    
    step = "5 - فحص حجم الملف"
    if (!fs.existsSync(backupPath)) throw new Error("الزيب ما اتعملش أصلاً")
    const sizeMB = fs.statSync(backupPath).size / 1024 / 1024
    if (sizeMB > 95) {
      throw new Error(`حجم النسخة ${sizeMB.toFixed(1)}MB وده أكبر من حد واتساب. استثني فولدرات ميديا/كاش`)
    }

    
    step = "6 - إرسال الملف للجروب"
    const buffer = fs.readFileSync(backupPath)
    const payload = {
      document: buffer,
      fileName: `${backupName}.zip`,
      mimetype: "application/zip"
    }

    let sentTo = null
    try {
      await conn.sendMessage(target, payload, { quoted: m })
      sentTo = "الجروب"
    } catch (sendErr) {
      console.error("[NOX BACKUP] فشل الإرسال للجروب:", sendErr.message)
      
      step = "6 - إرسال الملف (بديل: الشات الحالي/الخاص)"
      const fallback = m.chat
      await conn.sendMessage(fallback, payload, { quoted: m })
      sentTo = `الشات الحالي (الإرسال للجروب فشل: ${sendErr.message})`
    }

    if (sentTo !== "الجروب") await m.reply(`⚠️ اتبعتت النسخة في: ${sentTo}\nتأكد إن رقم البوت عضو في الجروب ${target} وإنه أدمن لو الجروب مقفول.`)

    
    step = "7 - حذف الملف المؤقت"
    fs.unlinkSync(backupPath)

    if (m.chat !== m.sender) return m.reply("ف جروبنا يا مطوري المظ🫦")

  } catch (e) {
    console.error(`[NOX BACKUP] فشل في الخطوة: ${step}`, e)

    const stderr = e.stderr?.toString().trim()
    const stdout = e.stdout?.toString().trim()
    const stackLine = e.stack
      ?.split("\n")
      .find(l => l.includes("at ") && !l.includes("node:internal"))
      ?.trim()

    let report = "❌ فشل إنشاء النسخة الاحتياطية\n\n"
    report += `📍 *الخطوة:* ${step}\n`
    report += `⚠️ *الخطأ:* ${e.message}\n`
    if (e.code) report += `🔢 *الكود:* ${e.code}\n`
    if (e.status !== undefined && e.status !== null) report += `🔢 *exit status:* ${e.status}\n`
    if (stderr) report += `\n📄 *stderr:*\n${stderr.slice(0, 500)}\n`
    if (stdout) report += `\n📄 *stdout:*\n${stdout.slice(0, 300)}\n`
    if (stackLine) report += `\n📌 *المكان في الكود:*\n${stackLine}`

    m.reply(report)
  }
}

handler.help = ["سكرب"]
handler.tags = ["owner"]
handler.command = /^(سكرب|scrb)$/i

export default handler