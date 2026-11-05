/*
⚡ MASTER MD ⚡
AHSAN (03107260507)
Official Channel: https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46
*/

// Disabled background HTTP polling on every incoming message to prevent ETIMEDOUT handler crashes
export async function before(m, { conn }) {
    return false
}

let handler = async (m, { conn }) => {
    m.reply('🕌 Azan timings plugin is available.')
}

handler.command = ['azan', 'adhan']
handler.help = ['azan']
handler.tags = ['islam']

export default handler
