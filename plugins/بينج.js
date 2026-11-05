/*
═══════════════════════════════════════════════════════════════
  ⚡ MASTER MD — Ping & System Latency Monitor
  👑 Developer: AHSAN (03107260507)
  📢 Channel: https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46
═══════════════════════════════════════════════════════════════
*/

import os from 'os'
import { performance } from 'perf_hooks'

function clockString(ms) {
    let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
    let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
    let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
    return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
}

function formatSize(bytes) {
    if (!bytes) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

let handler = async (m, { conn }) => {
    const start = performance.now()
    const uptime = clockString(process.uptime() * 1000)
    const ramUsage = process.memoryUsage()
    const totalMem = os.totalmem()
    const freeMem = os.freemem()
    const usedMem = totalMem - freeMem
    const cpus = os.cpus()
    const cores = cpus.length
    const cpuModel = cpus[0]?.model?.trim() || 'Multi-Core Server'
    const cpuLoad = Math.min(100, Math.round((os.loadavg()[0] / (cores || 1)) * 100))
    const ramPercent = Math.round((usedMem / totalMem) * 100)
    const heapPercent = Math.round((ramUsage.heapUsed / ramUsage.heapTotal) * 100)
    const speed = (performance.now() - start).toFixed(2)

    const statusText = `╔══════════════════════════════════╗
║     ⚡ MASTER MD PONG! ⚡        ║
║       DEVELOPER: AHSAN           ║
╚══════════════════════════════════╝

◈ *Latency*  : \`${speed} ms\`
◈ *Status*   : 🟢 Online & Active
◈ *Bot*      : MASTER MD v3.0.0
◈ *Developer*: AHSAN (03107260507)
◈ *Uptime*   : ${uptime}

▸ SYSTEM RESOURCES
◈ *RAM*      : ${formatSize(usedMem)} / ${formatSize(totalMem)} (${ramPercent}%)
◈ *Heap*     : ${formatSize(ramUsage.heapUsed)} / ${formatSize(ramUsage.heapTotal)} (${heapPercent}%)
◈ *CPU*      : ${cpuModel} (${cpuLoad}%)
◈ *Node.js*  : ${process.version}
◈ *Platform* : ${os.platform().toUpperCase()} ${os.arch()}

📢 *Official Channel:* https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46`

    try {
        await conn.relayMessage(
            m.chat,
            {
                pollResultSnapshotMessage: {
                    name: statusText,
                    pollVotes: [
                        { optionName: `⚡ 𝐂𝐏𝐔  ·  ${cpuLoad}%`, optionVoteCount: cpuLoad },
                        { optionName: `💾 𝐑𝐀𝐌  ·  ${ramPercent}%`, optionVoteCount: ramPercent },
                        { optionName: `🧠 𝐇𝐄𝐀𝐏 ·  ${heapPercent}%`, optionVoteCount: heapPercent }
                    ],
                    pollType: 0
                }
            },
            {}
        )
    } catch {
        await conn.sendMessage(m.chat, { text: statusText }, { quoted: m })
    }
}

handler.help = ['ping', 'status', 'speed']
handler.tags = ['main', 'info']
handler.command = /^(ping|p|speed|status|alive|بينج|حالة|حاله)$/i

export default handler
