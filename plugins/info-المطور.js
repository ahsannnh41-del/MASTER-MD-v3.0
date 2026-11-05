/*
═══════════════════════════════════════════════════════════════
  ⚡ MASTER MD — Developer & Owner Contact Information
  👑 Developer: AHSAN (03107260507)
  📢 Channel: https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46
═══════════════════════════════════════════════════════════════
*/

let handler = async (m, { conn }) => {
    await m.react('👑')

    let list = [
        {
            displayName: 'AHSAN ⚡ (MASTER MD)',
            vcard: `BEGIN:VCARD
VERSION:3.0
FN:AHSAN
TEL;type=CELL;waid=923107260507:+92 310 7260507
END:VCARD`
        }
    ]

    const canalInfo = {
        title: '⚡ MASTER MD OFFICIAL ⚡',
        body: 'Developed by AHSAN (03107260507)',
        thumbnailUrl: 'https://files.catbox.moe/iq1skp.jpg',
        sourceUrl: 'https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46',
        mediaType: 1,
        renderLargerThumbnail: true
    }

    try {
        await conn.sendMessage(
            m.chat,
            {
                contacts: {
                    displayName: `${list.length} Contact`,
                    contacts: list
                },
                contextInfo: {
                    externalAdReply: canalInfo
                }
            },
            { quoted: m }
        )
    } catch {}

    let txt = `╔══════════════════════════════════╗
║     👑 MASTER MD DEVELOPER 👑     ║
╚══════════════════════════════════╝

👑 *Developer / Owner:* AHSAN
📞 *WhatsApp / Phone:* +92 310 7260507
⚡ *Bot Status:* 🟢 Active & Running
🌐 *Bot Version:* v3.0.0 Multi-Device
📢 *Official Channel:* https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46

💡 _Feel free to reach out for custom bot setups, features, or support!_`

    await conn.sendMessage(
        m.chat,
        {
            text: txt,
        },
        { quoted: m }
    )
}

handler.help = ['owner', 'creator', 'developer']
handler.tags = ['info', 'owner']
handler.command = ['owner', 'creator', 'developer', 'ahsan', 'المطور']

export default handler
