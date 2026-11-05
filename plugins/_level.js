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

import { canLevelUp, xpRange } from '../lib/levelling.js'

let handler = m => m
handler.before = async function (m, { conn }) {
let user = global.db.data.users[m.sender]
let before = user.level
while (canLevelUp(user.level, user.exp, global.multiplier)) { user.level++ }
if (before !== user.level) {
let especial = 'coin'
let especial2 = 'exp'
let especialCant = Math.floor(Math.random() * (8000 - 5000 + 1)) + 5000
let especialCant2 = Math.floor(Math.random() * (500 - 100 + 1)) + 100
if (user.level % 5 === 0) {
user[especial] += especialCant
user[especial2] += especialCant2
}
let { min, max } = xpRange(user.level, global.multiplier)
}
return !0
}

export default handler