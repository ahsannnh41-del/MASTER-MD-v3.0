import { watchFile, unwatchFile } from "fs"
import chalk from "chalk"
import { fileURLToPath } from "url"
import fs from "fs"

global.botNumber = process.env.BOT_NUMBER || "" 

global.owner = [
    ["923107260507", "👑 AHSAN", true, "923107260507@s.whatsapp.net"],
]

global.mods = ["923107260507"]
global.suittag = ["923107260507"]
global.prems = []

global.libreria = "Baileys Multi Device"
global.vs = "v3.0.0"
global.nameqr = "QR"
global.sessions = "Sessions/Principal"
global.jadi = "Sessions/SubBot"
global.MichiJadibts = true

global.botname = "MASTER MD"
global.textbot = "MASTER MD ⚡"
global.dev = "AHSAN (03107260507)"
global.author = "MASTER MD • Developed by AHSAN"
global.etiqueta = "MASTER MD Official"
global.currency = "Coins"
global.michipg = "https://files.catbox.moe/xm4gan.jpg"
global.icono = "https://files.catbox.moe/bocvdr.jpg"
global.catalogo = fs.existsSync('./lib/catalogo.jpg') ? fs.readFileSync('./lib/catalogo.jpg') : Buffer.alloc(0)

global.group = "https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46"
global.community = "https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46"
global.channel = "https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46"
global.github = "https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46"
global.gmail = "ahsanofficial@gmail.com"
global.ch = {
    ch1: "120363426042842162@newsletter",
    ch2: "120363198000393338@newsletter"
}

global.APIs = {
    vreden: { url: "https://api.vreden.web.id", key: null },
    delirius: { url: "https://api.delirius.store", key: null },
    zenzxz: { url: "https://api.zenzxz.my.id", key: null },
    siputzx: { url: "https://api.siputzx.my.id", key: null },
    adonix: { url: "https://api-adonix.ultraplus.click", key: null }
}

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
    unwatchFile(file)
    console.log(chalk.redBright("Update 'settings.js'"))
    import(`${file}?update=${Date.now()}`)
})
