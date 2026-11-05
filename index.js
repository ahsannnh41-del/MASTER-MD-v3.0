process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'

import './settings.js'

import './plugins/_fakes.js'

import cfonts from 'cfonts'

import { createRequire } from 'module'

import { fileURLToPath, pathToFileURL } from 'url'

import { platform } from 'process'

import * as ws from 'ws'

import fs, { readdirSync, statSync, unlinkSync, existsSync, mkdirSync, readFileSync, rmSync, watch } from 'fs'

import yargs from 'yargs'

import { spawn, execSync } from 'child_process'

import lodash from 'lodash'

import { MichiJadiBot } from './plugins/subs-conexion.js'

import chalk from 'chalk'

import syntaxerror from 'syntax-error'

import { tmpdir } from 'os'

import { format } from 'util'

import boxen from 'boxen'

import pino from 'pino'

import Pino from 'pino'

import path, { join, dirname } from 'path'

import { Boom } from '@hapi/boom'

import { makeWASocket, protoType, serialize } from './lib/simple.js'

import { Low, JSONFile } from 'lowdb'

import { mongoDB, mongoDBV2 } from './lib/mongoDB.js'

import store from './lib/store.js'

const _baileysIndex = await import('@whiskeysockets/baileys')
const proto = _baileysIndex.proto || _baileysIndex.default?.proto

import pkg from 'google-libphonenumber'

const { PhoneNumberUtil } = pkg

const phoneUtil = PhoneNumberUtil.getInstance()

const { DisconnectReason, useMultiFileAuthState, MessageRetryMap, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, jidNormalizedUser, Browsers } = await import('@whiskeysockets/baileys')

import readline, { createInterface } from 'readline'

import NodeCache from 'node-cache'

const { CONNECTING } = ws

const { chain } = lodash

const PORT = process.env.PORT || process.env.SERVER_PORT || 3000

let { say } = cfonts

console.log(chalk.cyanBright('\n⚡ Starting MASTER MD v3.0.0...'))

say('MASTER MD', {
font: 'simple',
align: 'left',
gradient: ['cyan', 'yellow']
})

say('DEVELOPED BY AHSAN (03107260507)', {
font: 'console',
align: 'center',
colors: ['green', 'yellow', 'cyan']
})

protoType()

serialize()

global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') {

    return rmPrefix ? pathURL.replace(/^file:\/\//, '') : pathURL

}; global.__dirname = function dirname(pathURL) {

return path.dirname(global.__filename(pathURL, true))

}; global.__require = function require(dir = import.meta.url) {

return createRequire(dir)

}

global.timestamp = {start: new Date}

const __dirname = global.__dirname(import.meta.url)

global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())

global.prefix = new RegExp('^[#!./]')

global.db = new Low(/https?:\/\//.test(opts['db'] || '') ? new cloudDBAdapter(opts['db']) : new JSONFile('database.json'))

global.DATABASE = global.db; 

global.loadDatabase = async function loadDatabase() {

if (global.db.READ) {

return new Promise((resolve) => setInterval(async function() {

if (!global.db.READ) {

clearInterval(this);

resolve(global.db.data == null ? global.loadDatabase() : global.db.data)

}}, 1 * 1000))

}

if (global.db.data !== null) return

global.db.READ = true

await global.db.read().catch(console.error)

global.db.READ = null

global.db.data = {

users: {},

chats: {},

stats: {},

msgs: {},

sticker: {},

settings: {},

...(global.db.data || {}),

}

global.db.chain = chain(global.db.data)

}

loadDatabase()

const {state, saveState, saveCreds} = await useMultiFileAuthState(global.sessions)

const msgRetryCounterMap = new Map()

const msgRetryCounterCache = new NodeCache({ stdTTL: 0, checkperiod: 0 })

const userDevicesCache = new NodeCache({ stdTTL: 0, checkperiod: 0 })

let version = [2, 3000, 1037641644]
try {
    const fetched = await fetchLatestBaileysVersion()
    if (fetched?.version) version = fetched.version
} catch (e) {
    console.warn('[ MASTER MD ] Baileys version fetch warning, using stable fallback:', version.join('.'))
}
global.waVersion = version

let phoneNumber = global.botNumber

const methodCodeQR = process.argv.includes("qr")

const methodCode = !!phoneNumber || process.argv.includes("code")

const MethodMobile = process.argv.includes("mobile")

const colors = chalk.bold.white

const qrOption = chalk.blueBright

const textOption = chalk.cyan

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

const question = (texto) => new Promise((resolver) => rl.question(texto, resolver))

let opcion

if (methodCodeQR) {

opcion = '1'

}

if (!methodCodeQR && !methodCode && !fs.existsSync(`./${sessions}/creds.json`)) {
if (!process.stdin.isTTY) {
opcion = '2'
} else {
do {
opcion = await question(colors("Select an option:\n") + qrOption("1. With QR code\n") + textOption("2. With 8-digit text code\n--> "))
if (!/^[1-2]$/.test(opcion)) {
console.log(chalk.bold.redBright(`Please enter only 1 or 2.`))
}} while (opcion !== '1' && opcion !== '2' || fs.existsSync(`./${sessions}/creds.json`))
}
} 

console.info = () => { }

const connectionOptions = {

logger: pino({ level: 'silent' }),

printQRInTerminal: opcion == '1' ? true : methodCodeQR ? true : false,

mobile: MethodMobile, 

browser: Browsers ? Browsers.ubuntu('Chrome') : ['Ubuntu', 'Chrome', '20.0.04'],

auth: {

creds: state.creds,

keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })),

},

markOnlineOnConnect: false, 

generateHighQualityLinkPreview: true, 

syncFullHistory: false,

shouldSyncHistoryMessage: () => false,

getMessage: async (key) => {

try {

let jid = jidNormalizedUser(key.remoteJid);

let msg = await store.loadMessage(jid, key.id)

return msg?.message || ""

} catch (error) {

return ""

}},

msgRetryCounterCache: msgRetryCounterCache || new Map(),

userDevicesCache: userDevicesCache || new Map(),

defaultQueryTimeoutMs: undefined,

cachedGroupMetadata: (jid) => globalThis.conn?.chats?.[jid] ?? {},

version: version, 

keepAliveIntervalMs: 55000, 

maxIdleTimeMs: 60000, 

}

global.conn = makeWASocket(connectionOptions)

// Universal Robust Pairing Code Generator for Web, Telegram, and CLI
global.requestPairingCode = async function(rawNumber) {
    const cleanNumber = String(rawNumber || '').replace(/[^0-9]/g, '')
    if (!cleanNumber || cleanNumber.length < 10 || cleanNumber.length > 15) {
        throw new Error('Invalid phone number! Please enter 10 to 15 digits including country code (e.g. 923107260507).')
    }

    if (global.conn?.authState?.creds?.registered) {
        throw new Error('MASTER MD is already linked and connected to WhatsApp!')
    }

    console.log(chalk.cyan(`\n⚡ [ MASTER MD Pairing ] Generating fresh pairing handshake for: +${cleanNumber}...`))

    // 1. Close existing socket if alive and not registered
    if (global.conn) {
        try {
            global.conn.ev.removeAllListeners()
            global.conn.ws?.close()
        } catch (e) {}
    }

    // 2. Clean up un-registered session files to ensure pristine key exchange
    const sessionDir = path.join(__dirname, global.sessions || 'Sessions/Principal')
    if (fs.existsSync(sessionDir)) {
        try {
            fs.rmSync(sessionDir, { recursive: true, force: true })
            console.log(chalk.yellow('[ MASTER MD Pairing ] Cleaned previous un-registered session state.'))
        } catch (e) {}
    }

    // 3. Initialize fresh multi-file auth state
    const { state: freshState, saveCreds: freshSaveCreds } = await useMultiFileAuthState(global.sessions || 'Sessions/Principal')

    // 4. Create fresh Baileys socket with pristine signal keys
    const pairOptions = {
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        mobile: false,
        browser: Browsers ? Browsers.ubuntu('Chrome') : ['Ubuntu', 'Chrome', '20.0.04'],
        auth: {
            creds: freshState.creds,
            keys: makeCacheableSignalKeyStore(freshState.keys, pino({ level: 'silent' }))
        },
        markOnlineOnConnect: false,
        generateHighQualityLinkPreview: true,
        syncFullHistory: false,
        shouldSyncHistoryMessage: () => false,
        version: global.waVersion || [2, 3000, 1037641644],
        keepAliveIntervalMs: 30000,
        maxIdleTimeMs: 60000,
    }

    const sock = makeWASocket(pairOptions)
    global.conn = sock

    // 5. Save credentials immediately on phone confirmation
    sock.ev.on('creds.update', async () => {
        try {
            await freshSaveCreds()
        } catch (err) {
            console.error('[ MASTER MD creds.update ]', err.message)
        }
    })

    // 6. Monitor connection opening
    sock.ev.on('connection.update', async (update) => {
        const { connection } = update
        if (connection === 'open') {
            console.log(chalk.bold.greenBright(`\n🎉 [ MASTER MD ] WhatsApp Linked Successfully with: +${cleanNumber}!`))
            try {
                const targetJid = jidNormalizedUser(sock.user?.id || `${cleanNumber}@s.whatsapp.net`)
                await sock.sendMessage(targetJid, {
                    text: `╔══════════════════════════════════╗\n` +
                          `║   ⚡ MASTER MD CONNECTED! ⚡     ║\n` +
                          `║       DEVELOPER: AHSAN           ║\n` +
                          `╚══════════════════════════════════╝\n\n` +
                          `Assalam-o-Alaikum! Your WhatsApp is now successfully linked with *MASTER MD*.\n\n` +
                          `🤖 *Bot Name:* MASTER MD v3.0.0\n` +
                          `👑 *Developer:* AHSAN (03107260507)\n` +
                          `⚡ *Status:* 🟢 Active & Online\n` +
                          `📢 *Channel:* https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46\n\n` +
                          `Type *.menu* to view interactive buttons menu.\n` +
                          `> © 2026 MASTER MD • All Rights Reserved to AHSAN`
                })
            } catch (e) {}

            if (typeof global.reloadHandler === 'function') {
                await global.reloadHandler(false).catch(console.error)
            }
        }
    })

    // 7. Allow 3.5 seconds for WebSocket Noise encryption & transport readiness
    await new Promise(resolve => setTimeout(resolve, 3500))

    // 8. Request 8-digit pairing code from WhatsApp server
    let rawCode = null
    for (let attempt = 1; attempt <= 3; attempt++) {
        try {
            rawCode = await sock.requestPairingCode(cleanNumber)
            if (rawCode) break
        } catch (err) {
            console.warn(`[ Pairing Request Attempt ${attempt} ]`, err.message)
            await new Promise(r => setTimeout(r, 2000))
        }
    }

    if (!rawCode) {
        throw new Error('Could not generate pairing code. Please ensure the phone number is active on WhatsApp and retry.')
    }

    const formatted = rawCode.match(/.{1,4}/g)?.join('-') || rawCode
    console.log(chalk.bold.white(chalk.bgMagenta(`[ ⚡ ] Pairing Code:`)), chalk.bold.white(chalk.white(formatted)))
    return formatted
}

global.resetSession = async function() {
    if (global.conn?.authState?.creds?.registered) {
        throw new Error('Cannot reset an active registered session. Please logout from WhatsApp on your phone first.')
    }
    if (global.conn) {
        try {
            global.conn.ev.removeAllListeners()
            global.conn.ws?.close()
        } catch (e) {}
    }
    const sessionDir = path.join(__dirname, global.sessions || 'Sessions/Principal')
    if (fs.existsSync(sessionDir)) {
        try {
            fs.rmSync(sessionDir, { recursive: true, force: true })
        } catch (e) {}
    }
    console.log(chalk.yellow('[ MASTER MD ] Unregistered session state cleared.'))
    return true
}

if (!fs.existsSync(`./${sessions}/creds.json`)) {

if (opcion === '2' || methodCode) {

opcion = '2'

if (!conn.authState.creds.registered) {

let addNumber

if (!!phoneNumber) {
addNumber = phoneNumber.replace(/[^0-9]/g, '')
} else if (!process.stdin.isTTY) {
console.log(chalk.yellow('[ MASTER MD ] Non-TTY mode: Ready for Web/Telegram pairing code requests.'))
} else {
do {
phoneNumber = await question(chalk.bgBlack(chalk.bold.greenBright(`[ ⚡ ] Please enter your WhatsApp number (e.g. 923107260507):\n${chalk.bold.magentaBright('---> ')}`)))
phoneNumber = phoneNumber.replace(/\D/g,'')
if (!phoneNumber.startsWith('+')) {
phoneNumber = `+${phoneNumber}`
}} while (!await isValidPhoneNumber(phoneNumber))
rl.close()
addNumber = phoneNumber.replace(/\D/g, '')
}

if (addNumber) {
setTimeout(async () => {
try {
await global.requestPairingCode(addNumber)
} catch (pairErr) {
console.error(chalk.red('[ Pairing Error ]'), pairErr.message)
}
}, 1000)
}}}}

conn.isInit = false

conn.well = false

conn.logger.info(`[ 🍐 ] completed\n`)

if (!opts['test']) {

if (global.db) setInterval(async () => {

if (global.db.data) await global.db.write()

if (opts['autocleartmp'] && (global.support || {}).find) (tmp = [os.tmpdir(), 'tmp', `${jadi}`], tmp.forEach((filename) => cp.spawn('find', [filename, '-amin', '3', '-type', 'f', '-delete'])))

}, 30 * 1000)

}

async function resolveLidToRealJid(lidJid, groupJid, maxRetries = 3, retryDelay = 1000) {

if (!lidJid?.endsWith("@lid") || !groupJid?.endsWith("@g.us")) return lidJid?.includes("@") ? lidJid : `${lidJid}@s.whatsapp.net`

const cached = lidCache.get(lidJid);

if (cached) return cached;

const lidToFind = lidJid.split("@")[0];

let attempts = 0

while (attempts < maxRetries) {

try {

const metadata = await conn.groupMetadata(groupJid)

if (!metadata?.participants) throw new Error("No participants were obtained")

for (const participant of metadata.participants) {

try {

if (!participant?.jid) continue

const contactDetails = await conn.onWhatsApp(participant.jid)

if (!contactDetails?.[0]?.lid) continue

const possibleLid = contactDetails[0].lid.split("@")[0]

if (possibleLid === lidToFind) {

lidCache.set(lidJid, participant.jid)

return participant.jid

}} catch (e) {

continue

}}

lidCache.set(lidJid, lidJid)

return lidJid

} catch (e) {

attempts++

if (attempts >= maxRetries) {

lidCache.set(lidJid, lidJid)

return lidJid

}

await new Promise(resolve => setTimeout(resolve, retryDelay))

}}

return lidJid

}

async function extractAndProcessLids(text, groupJid) {

if (!text) return text

const lidMatches = text.match(/\d+@lid/g) || []

let processedText = text

for (const lid of lidMatches) {

try {

const realJid = await resolveLidToRealJid(lid, groupJid);

processedText = processedText.replace(new RegExp(lid, 'g'), realJid)

} catch (e) {

console.error(`Error procesando LID ${lid}:`, e)

}}

return processedText

}

async function processLidsInMessage(message, groupJid) {

if (!message || !message.key) return message

try {

const messageCopy = {

key: {...message.key},

message: message.message ? {...message.message} : undefined,

...(message.quoted && {quoted: {...message.quoted}}),

...(message.mentionedJid && {mentionedJid: [...message.mentionedJid]})

}

const remoteJid = messageCopy.key.remoteJid || groupJid

if (messageCopy.key?.participant?.endsWith('@lid')) { messageCopy.key.participant = await resolveLidToRealJid(messageCopy.key.participant, remoteJid) }

if (messageCopy.message?.extendedTextMessage?.contextInfo?.participant?.endsWith('@lid')) { messageCopy.message.extendedTextMessage.contextInfo.participant = await resolveLidToRealJid( messageCopy.message.extendedTextMessage.contextInfo.participant, remoteJid ) }

if (messageCopy.message?.extendedTextMessage?.contextInfo?.mentionedJid) {

const mentionedJid = messageCopy.message.extendedTextMessage.contextInfo.mentionedJid

if (Array.isArray(mentionedJid)) {

for (let i = 0; i < mentionedJid.length; i++) {

if (mentionedJid[i]?.endsWith('@lid')) {

mentionedJid[i] = await resolveLidToRealJid(mentionedJid[i], remoteJid)

}}}}

if (messageCopy.message?.extendedTextMessage?.contextInfo?.quotedMessage?.extendedTextMessage?.contextInfo?.mentionedJid) {

const quotedMentionedJid = messageCopy.message.extendedTextMessage.contextInfo.quotedMessage.extendedTextMessage.contextInfo.mentionedJid;

if (Array.isArray(quotedMentionedJid)) {

for (let i = 0; i < quotedMentionedJid.length; i++) {

if (quotedMentionedJid[i]?.endsWith('@lid')) {

quotedMentionedJid[i] = await resolveLidToRealJid(quotedMentionedJid[i], remoteJid)

}}}}

if (messageCopy.message?.conversation) { messageCopy.message.conversation = await extractAndProcessLids(messageCopy.message.conversation, remoteJid) }

if (messageCopy.message?.extendedTextMessage?.text) { messageCopy.message.extendedTextMessage.text = await extractAndProcessLids(messageCopy.message.extendedTextMessage.text, remoteJid) }

if (messageCopy.message?.extendedTextMessage?.contextInfo?.participant && !messageCopy.quoted) {

const quotedSender = await resolveLidToRealJid( messageCopy.message.extendedTextMessage.contextInfo.participant, remoteJid );

messageCopy.quoted = { sender: quotedSender, message: messageCopy.message.extendedTextMessage.contextInfo.quotedMessage }

}

return messageCopy

} catch (e) {

console.error('Error en processLidsInMessage:', e)

return message

}}

async function groupParticipantsUpdate(anu) {

    try {

        const { id, participants, action } = anu

        if (!id?.endsWith('@g.us')) return

        if (!Array.isArray(participants) || !participants.length) return

        const stubTypeMap = {

            add: 27,

            remove: 28,

            leave: 32,

            promote: 29,

            demote: 30

        }

        const messageStubType = stubTypeMap[action]

        if (!messageStubType) return

        for (const participant of participants) {

            const fakeMessage = {

                key: {

                    remoteJid: id,

                    fromMe: false,

                    id: 'GROUP-UPDATE-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8)

                },

                messageTimestamp: Math.floor(Date.now() / 1000),

                messageStubType,

                messageStubParameters: [participant]

            }

            const chatUpdate = {

                messages: [fakeMessage],

                type: 'notify'

            }

            await conn.handler(chatUpdate).catch((e) => console.error('🍁 خطأ في تمرير رسالة الترحيب/المغادرة للهاندلر:', e))

        }

    } catch (e) {

        console.error('🍁 خطأ في group-participants.update:', e)

    }

}

async function connectionUpdate(update) {

const {connection, lastDisconnect, isNewLogin} = update

global.stopped = connection

if (isNewLogin) conn.isInit = true

const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode;

if (code && code !== DisconnectReason.loggedOut && conn?.ws.socket == null) {

await global.reloadHandler(true).catch(console.error);

global.timestamp.connect = new Date

}

if (global.db.data == null) loadDatabase()

if (update.qr != 0 && update.qr != undefined || methodCodeQR) {

if (opcion == '1' || methodCodeQR) {

console.log(chalk.green.bold(`[ ✿ ]  Escanea este código QR`))}

}

if (connection === "open") {

const userJid = jidNormalizedUser(conn.user.id)

const userName = conn.user.name || conn.user.verifiedName || "MASTER MD User"

await joinChannels(conn)

console.log(chalk.green.bold(`\n⚡ [ MASTER MD ] Connected successfully as: ${userName} (${userJid})`))

}

let reason = new Boom(lastDisconnect?.error)?.output?.statusCode

if (connection === 'close') {

if (reason === DisconnectReason.badSession) {

console.log(chalk.bold.cyanBright(`\n⚠︎ [ MASTER MD ] Bad session. Delete the bot's session folder, then pair again.`))

} else if (reason === DisconnectReason.connectionClosed) {

console.log(chalk.bold.magentaBright(`\n♻ [ MASTER MD ] Reconnecting to WhatsApp server...`))

await global.reloadHandler(true).catch(console.error)

} else if (reason === DisconnectReason.connectionLost) {

console.log(chalk.bold.blueBright(`\n⚠︎ [ MASTER MD ] Connection lost; reconnecting to WhatsApp...`))

await global.reloadHandler(true).catch(console.error)

} else if (reason === DisconnectReason.connectionReplaced) {

console.log(chalk.bold.yellowBright(`\nꕥ [ MASTER MD ] Connection replaced by another session.`))

} else if (reason === DisconnectReason.loggedOut) {

console.log(chalk.bold.redBright(`\n⚠︎ [ MASTER MD ] Logged out from WhatsApp. Clear session and pair again.`))

await global.reloadHandler(true).catch(console.error)

} else if (reason === DisconnectReason.restartRequired) {

console.log(chalk.bold.cyanBright(`\n♻ [ MASTER MD ] Server requested restart, reconnecting...`))

await global.reloadHandler(true).catch(console.error)

} else if (reason === DisconnectReason.timedOut) {

console.log(chalk.bold.yellowBright(`\n♻ [ MASTER MD ] Connection timed out, reconnecting...`))

await global.reloadHandler(true).catch(console.error)

} else {

console.log(chalk.bold.redBright(`\n⚠︎ [ MASTER MD ] Connection closed, reconnecting...`))

}}}

process.on('uncaughtException', console.error)

let isInit = true

let handler = await import('./handler.js')

global.reloadHandler = async function(restatConn) {

try {

const Handler = await import(`./handler.js?update=${Date.now()}`).catch(console.error);

if (Object.keys(Handler || {}).length) handler = Handler

} catch (e) {

console.error(e);

}

if (restatConn) {

const oldChats = global.conn.chats

try {

global.conn.ws.close()

} catch { }

conn.ev.removeAllListeners()

global.conn = makeWASocket(connectionOptions, {chats: oldChats})

isInit = true

}

if (!isInit) {

conn.ev.off('messages.upsert', conn.handler)

conn.ev.off('connection.update', conn.connectionUpdate)

conn.ev.off('creds.update', conn.credsUpdate)

conn.ev.off('group-participants.update', conn.groupParticipantsUpdate)

}

conn.handler = handler.handler.bind(global.conn)

conn.connectionUpdate = connectionUpdate.bind(global.conn)

conn.credsUpdate = saveCreds.bind(global.conn, true)

if (!conn.groupParticipantsUpdateRaw) {

    conn.groupParticipantsUpdateRaw = conn.groupParticipantsUpdate.bind(global.conn)

}

conn.groupParticipantsUpdate = groupParticipantsUpdate.bind(global.conn)

const currentDateTime = new Date()

const messageDateTime = new Date(conn.ev)

if (currentDateTime >= messageDateTime) {

const chats = Object.entries(conn.chats).filter(([jid, chat]) => !jid.endsWith('@g.us') && chat.isChats).map((v) => v[0])

} else {

const chats = Object.entries(conn.chats).filter(([jid, chat]) => !jid.endsWith('@g.us') && chat.isChats).map((v) => v[0])

}

conn.ev.on('messages.upsert', conn.handler)

conn.ev.on('connection.update', conn.connectionUpdate)

conn.ev.on('creds.update', conn.credsUpdate)

conn.ev.on('group-participants.update', conn.groupParticipantsUpdate)

isInit = false

return true

}

setInterval(() => {

    console.log(chalk.bold.magenta('[ ✿ ] إعادة تشغيل البوت تلقائياً (كل 15 دقيقة)...'));

    process.exit(0);

}, 15 * 60 * 1000);

let rtU = join(__dirname, `./${jadi}`)

if (!existsSync(rtU)) {

mkdirSync(rtU, { recursive: true }) 

}

global.rutaJadiBot = join(__dirname, `./${jadi}`)

if (global.MichiJadibts) {

if (!existsSync(global.rutaJadiBot)) {

mkdirSync(global.rutaJadiBot, { recursive: true }) 

console.log(chalk.bold.cyan(`ꕥ The folder: ${jadi} was created successfully..`))

} else {

console.log(chalk.bold.cyan(`ꕥ The folder: ${jadi} already exists.`)) 

}

const readRutaJadiBot = readdirSync(rutaJadiBot)

if (readRutaJadiBot.length > 0) {

const creds = 'creds.json'

for (const gjbts of readRutaJadiBot) {

const botPath = join(rutaJadiBot, gjbts)

const readBotPath = readdirSync(botPath)

if (readBotPath.includes(creds)) {

MichiJadiBot({pathMichiJadiBot: botPath, m: null, conn, args: '', usedPrefix: '/', command: 'serbot'})

}}}}

const pluginFolder = global.__dirname(join(__dirname, './plugins/index'))

const pluginFilter = (filename) => /\.js$/.test(filename)

global.plugins = {}

async function filesInit() {

for (const filename of readdirSync(pluginFolder).filter(pluginFilter)) {

try {

const file = global.__filename(join(pluginFolder, filename))

const module = await import(file)

global.plugins[filename] = module.default || module

} catch (e) {

conn.logger.error(e)

delete global.plugins[filename]

}}}

filesInit().then((_) => Object.keys(global.plugins)).catch(console.error)

global.reload = async (_ev, filename) => {

if (pluginFilter(filename)) {

const dir = global.__filename(join(pluginFolder, filename), true);

if (filename in global.plugins) {

if (existsSync(dir)) conn.logger.info(` updated plugin - '${filename}'`)

else {

conn.logger.warn(`deleted plugin - '${filename}'`)

return delete global.plugins[filename]

}} else conn.logger.info(`new plugin - '${filename}'`)

const err = syntaxerror(readFileSync(dir), filename, {

sourceType: 'module',

allowAwaitOutsideFunction: true,

});

if (err) conn.logger.error(`syntax error while loading '${filename}'\n${format(err)}`)

else {

try {

const module = (await import(`${global.__filename(dir)}?update=${Date.now()}`));

global.plugins[filename] = module.default || module;

} catch (e) {

conn.logger.error(`error require plugin '${filename}\n${format(e)}'`)

} finally {

global.plugins = Object.fromEntries(Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b)))

}}}}

Object.freeze(global.reload)

watch(pluginFolder, (event, filename) => {
    if (filename) global.reload(event, filename)
})

await global.reloadHandler()

async function _quickTest() {

const test = await Promise.all([

spawn('ffmpeg'),

spawn('ffprobe'),

spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-filter_complex', 'color', '-frames:v', '1', '-f', 'webp', '-']),

spawn('convert'),

spawn('magick'),

spawn('gm'),

spawn('find', ['--version']),

].map((p) => {

return Promise.race([

new Promise((resolve) => {

p.on('close', (code) => {

resolve(code !== 127);

});

}),

new Promise((resolve) => {

p.on('error', (_) => resolve(false))

})])

}))

const [ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find] = test;

const s = global.support = {ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find};

Object.freeze(global.support);

}

setInterval(async () => {

  console.log(chalk.cyan('[ ✿ ] Iniciando limpieza automática de SubBots...'));

  const baseDir = `./${jadi}/`;

  try {

    if (!existsSync(baseDir)) {

      console.log(chalk.yellow(`[ ✿ ] No existe la carpeta ${jadi}.`));

      return;

    }

    const subBots = readdirSync(baseDir);

    let totalDeleted = 0;

    for (const bot of subBots) {

      const botPath = join(baseDir, bot);

      const stat = statSync(botPath);

      if (!stat.isDirectory()) continue;

      const files = readdirSync(botPath);

      for (const file of files) {

        if (!['creds.json', 'config.json', 'config.js'].includes(file)) {

          const filePath = join(botPath, file);

          const fileStat = statSync(filePath);

          try {

            if (fileStat.isDirectory()) {

              rmSync(filePath, { recursive: true, force: true });

            } else {

              unlinkSync(filePath);

            }

            totalDeleted++;

          } catch (err) {

            console.error(chalk.red(`Error eliminando ${bot}/${file}: ${err.message}`));

          }

        }

      }

    }

    console.log(chalk.green(

      totalDeleted

        ? `[ ✿ ] Cleanup complete: ${totalDeleted} files deleted`

        : `[ ✿ ] No files were deleted; only creds.json and settings files remain.`

    ));

  } catch (error) {

    console.error(chalk.red(`Error in automatic cleaning of subbots: ${error}`));

  }

}, 3 * 60 * 1000); 

setInterval(async () => {

const tmpDir = join(__dirname, 'tmp')

try {

const filenames = readdirSync(tmpDir)

filenames.forEach(file => {

const filePath = join(tmpDir, file)

unlinkSync(filePath)})

console.log(chalk.gray(`→ Archivos de la carpeta TMP eliminados`))

} catch {

console.log(chalk.gray(`→ Los archivos de la carpeta TMP no se pudieron eliminar`));

}}, 30 * 1000)

setInterval(async () => {
    const directories = [`./${global.sessions || 'sessions'}/`, `./${global.jadi || 'jadibts'}/`].filter(Boolean);
    
    directories.forEach(dir => {
        if (!existsSync(dir)) return;
        try {
            const files = readdirSync(dir);
            files.forEach(file => {
                if (file !== 'creds.json') {
                    const filePath = path.join(dir, file);
                    try {
                        unlinkSync(filePath);
                    } catch {}
                }
            });
        } catch {}
    });
}, 10 * 60 * 1000);


_quickTest().catch(console.error)

async function isValidPhoneNumber(number) {

try {

number = number.replace(/\s+/g, '')

if (number.startsWith('+521')) {

number = number.replace('+521', '+52');

} else if (number.startsWith('+52') && number[4] === '1') {

number = number.replace('+52 1', '+52');

}

const parsedNumber = phoneUtil.parseAndKeepRawInput(number)

return phoneUtil.isValidNumber(parsedNumber)

} catch (error) {

return false

}}

async function joinChannels(sock) {

for (const value of Object.values(global.ch)) {

if (typeof value === 'string' && value.endsWith('@newsletter')) {

await sock.newsletterFollow(value).catch(() => {})

}}}