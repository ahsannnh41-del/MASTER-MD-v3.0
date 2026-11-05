/*
═══════════════════════════════════════════════════════════════
  ⚡ MASTER MD — Fake Messages, Stubs & Context Info
  👑 Developer: AHSAN (03107260507)
  📢 Channel: https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46
═══════════════════════════════════════════════════════════════
*/

import pkg from '@whiskeysockets/baileys'
import fs from 'fs'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone'

const { generateWAMessageFromContent, prepareWAMessageMedia, proto } = pkg

var handler = m => m

handler.all = async function (m) {
  global.canalIdM = [
    "120363426042842162@newsletter",
    "120363198000393338@newsletter"
  ]

  global.canalNombreM = [
    "⚡ MASTER MD Official",
    "⚡ MASTER MD Updates"
  ]

  global.channelRD = await getRandomChannel()
  global.d = new Date(new Date().getTime() + 3600000)
  global.locale = 'en-US'

  global.dia = d.toLocaleDateString(locale, { weekday: 'long' })
  global.fecha = d.toLocaleDateString('en-US', { day: 'numeric', month: 'numeric', year: 'numeric' })
  global.mes = d.toLocaleDateString('en-US', { month: 'long' })
  global.año = d.toLocaleDateString('en-US', { year: 'numeric' })
  global.tiempo = d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })

  var canal = 'https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46'
  var comunidad = 'https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46'
  var git = 'https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46'
  var github = 'https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46'
  var correo = 'ahsanofficial@gmail.com'

  global.redes = pickRandom([canal, comunidad, git, github, correo])
  global.nombre = m.pushName || 'User'

  global.packsticker = `╭━━━━━━━━━━━━━━━━━━━━╮
┃  ⚡ MASTER MD
┃  👑 DEV: AHSAN (03107260507)
┃  📢 https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46
╰━━━━━━━━━━━━━━━━━━━━╯`

  global.namebot = 'MASTER MD'
  global.author = 'MASTER MD • Developed by AHSAN (03107260507)'
  global.packsticker2 = global.packsticker

  global.fkontak = {
    key: {
      participants: "0@s.whatsapp.net",
      remoteJid: "status@broadcast",
      fromMe: false,
      id: "MASTER MD"
    },
    message: {
      contactMessage: {
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:MASTER MD\nitem1.TEL;waid=923107260507:923107260507\nitem1.X-ABLabel:Mobile\nEND:VCARD`
      }
    },
    participant: "0@s.whatsapp.net"
  }
}

export default handler

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

async function getRandomChannel() {
  let randomIndex = Math.floor(Math.random() * global.canalIdM.length)
  let id = global.canalIdM[randomIndex]
  let name = global.canalNombreM[randomIndex]
  return { id, name }
}
