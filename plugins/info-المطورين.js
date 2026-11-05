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

let handler = async (m, { conn }) => {

  let owners = global.owner || []

  if (!owners.length) {
    return m.reply('❌ لا يوجد مالكين في ملف settings');
  }

  let list = []

  for (let owner of owners) {
    let number = owner[0].replace(/[^0-9]/g, '')
    let name = owner[1] || 'مطور'

    list.push({
      displayName: name,
      vcard: `BEGIN:VCARD
VERSION:3.0
FN:${name}
TEL;type=CELL;waid=${number}:${number}
END:VCARD`
    })
  }

  await conn.sendMessage(m.chat, {
    contacts: {
      displayName: `قائمة المطورين`,
      contacts: list
    }
  }, { quoted: m })

}

handler.command = ['المالكين','الصانعين','مالكين','المطورين']
handler.help = ['المالكين']
handler.tags = ['info']

export default handler