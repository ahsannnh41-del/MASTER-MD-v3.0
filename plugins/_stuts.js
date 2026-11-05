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

import os from 'os'
import { execSync} from 'child_process'

let handler = async (m, { conn, usedPrefix, command, participants, isOwner}) => {
  try {
    const uptimeSeconds = process.uptime()
    const uptime = formatDuration(uptimeSeconds)

    const memTotal = os.totalmem()
    const memFree = os.freemem()
    const memUsed = memTotal - memFree

    const cpus = os.cpus()
    const cpuModel = cpus[0].model
    const cpuCores = cpus.length
    const load = os.loadavg()

    const nodeVersion = process.version
    const platform = `${os.type()} ${os.arch()} ${os.release()}`
    const pMem = process.memoryUsage()

    let chatsCount = 0, groupsCount = 0, privateChats = 0
    try {
      const store = conn.store || conn.chats || {}
      const chatKeys = Object.keys(store)
      const entries = chatKeys.length? chatKeys: (store.chats? Object.keys(store.chats): [])

      const allJids = []
      if (conn.chats && typeof conn.chats === 'object' &&!Array.isArray(conn.chats)) {
        for (let k of Object.keys(conn.chats)) allJids.push(k)
} else if (Array.isArray(conn.chats)) {
        for (let item of conn.chats) allJids.push(item.id || item.jid)
} else if (Array.isArray(entries)) {
        for (let k of entries) allJids.push(k)
}

      const uniq = Array.from(new Set(allJids)).filter(Boolean)
      chatsCount = uniq.length
      groupsCount = uniq.filter(j => j.endsWith('@g.us')).length
      privateChats = chatsCount - groupsCount
} catch (e) {}


const ownerInfo = `NUM: https://wa.me/923107260507
NAME: © ᴡɪʟʟɪᴀᴍ`;
  
    let latency = '⏳ N/A'
    try {
      const start = Date.now()
      const sent = await conn.sendMessage(m.chat, { text: '🧭 انتظر قليلا جاري جلب معلومات البوت...'})
      const elapsed = Date.now() - start
      latency = `⚡ ${elapsed} ms`
      try {
        await conn.deleteMessage(m.chat, { id: sent.key.id, remoteJid: m.chat, fromMe: true})
} catch (err) {}
} catch (err) {
      latency = '❌ حدث خطأ ما'
}

    let pkgInfo = {}
    try {
      pkgInfo = JSON.parse(execSync('cat package.json').toString())
} catch (e) {
      pkgInfo = { name: 'william', version: '❓ مجهول'}
}

    let report = []
    report.push(`🕵️‍♂️ تقرير البوت — ${pkgInfo.name} v${pkgInfo.version}`)
    report.push(`⏱️ وقت التشغيل: ${uptime} (${Math.floor(uptimeSeconds)}ثانية)`)
    report.push(`⚡ معدل زمن الاستجابة: ${latency}`)
    report.push(`🖥️ بيئة التشغيل: ${platform}`)
    report.push(`🧬 اصدار النود: ${nodeVersion}`)
    report.push(`🧠 المعالج: ${cpuModel} — ${cpuCores} انوية`)
    report.push(`📊 متوسط الحمل خلال (1m/5m/15m): ${load.map(n => n.toFixed(2)).join(' / ')}`)
    report.push(`💾 الذاكرة: إجمالي=${formatBytes(memTotal)} مستخدم=${formatBytes(memUsed)} المتاح=${formatBytes(memFree)}`)
    report.push(`📦 العملية: الذاكرة الكلية=${formatBytes(pMem.rss)}, المستخدمة=${formatBytes(pMem.heapUsed)}, الخارجية=${formatBytes(pMem.external || 0)}`)
    report.push(`💬 المحادثات: ${chatsCount} (👥 المجموعات: ${groupsCount} • 👤 خاص: ${privateChats})`)
    report.push(`🧑‍💼 مطوري: ${ownerInfo}`)

    const textReport = report.join('\n');
    await conn.sendMessage(m.chat, { text: textReport});

    if (isOwner) {
      try {
        const store = conn.store || conn.chats || {}
        const allJids = []
        if (conn.chats && typeof conn.chats === 'object' &&!Array.isArray(conn.chats)) {
for (let k of Object.keys(conn.chats)) allJids.push(k)
} else if (Array.isArray(conn.chats)) {
          for (let item of conn.chats) allJids.push(item.id || item.jid)
}
        const uniq = Array.from(new Set(allJids)).filter(Boolean)
        const lines = ['jid,type,name']
        for (let jid of uniq) {
          const isGroup = jid.endsWith('@g.us')
          let name = ''
          try {
            name = await conn.getName(jid)
} catch (e) {
            name = ''
}
          lines.push(`${jid},${isGroup? 'group': 'private'},"${name.replace(/"/g, '""')}"`)
}
        const csv = lines.join('\n')
        await conn.sendMessage(m.chat, {
          document: Buffer.from(csv),
          fileName: '📁 chats_list.csv',
          mimetype: 'text/csv'
})
} catch (e) {}
}

} catch (err) {
    console.error(err)
    m.reply('💥 حدث خطأ ما، تفاصيل الخطأ: ' + err.message)
}
}

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const dm = decimals < 0? 0: decimals
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

function formatDuration(seconds) {
  seconds = Math.floor(seconds)
  const d = Math.floor(seconds / (3600 * 24))
  seconds %= 3600 * 24
  const h = Math.floor(seconds / 3600)
  seconds %= 3600
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${d}d ${h}h ${m}m ${s}s`
}

handler.command = [
  'status',
  'report',
  'estado',
  'informe',
'الحاله',
'حاله',
  'حالة',
  'الحالة',
  'تقرير',
  'ريبورت',
  'احصائيات',
  'إحصائيات',
  'معلومات',
  'ستاتس'
]
export default handler