/*
═══════════════════════════════════════════════════════════════
  ⚡ MASTER MD — Web Pairing Server & Bot Controller
  👑 Developer: AHSAN (03107260507)
  📢 Channel: https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46
═══════════════════════════════════════════════════════════════
*/

import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

export function normalizePhoneNumber(raw) {
    let n = String(raw || '').replace(/[^0-9]/g, '')
    if (n.startsWith('00')) n = n.slice(2)

    // Pakistan +92 prefix adjustments
    if (n.startsWith('920') && n.length === 13) {
        n = '92' + n.slice(3)
    } else if (n.startsWith('9203') && n.length >= 13) {
        n = '92' + n.slice(3)
    } else if (n.startsWith('03') && n.length === 11) {
        n = '92' + n.slice(1)
    } else if (n.startsWith('0') && n.length === 11) {
        n = '92' + n.slice(1)
    } else if (n.startsWith('3') && n.length === 10) {
        n = '92' + n
    }

    // India +91 adjustments
    else if (n.startsWith('910') && n.length === 13) {
        n = '91' + n.slice(3)
    }

    return n
}

// Health check for Render / Cloud Uptime Monitors
app.get('/health', (req, res) => {
    res.json({ status: 'ok', bot: 'MASTER MD', developer: 'AHSAN (03107260507)' })
})

// Bot connection status
app.get('/api/status', (req, res) => {
    const isConnReady = !!global.conn
    const isRegistered = !!global.conn?.authState?.creds?.registered
    const user = global.conn?.user || null

    res.json({
        success: true,
        isConnReady,
        isRegistered,
        user,
        botName: 'MASTER MD v3.0.0',
        developer: 'AHSAN (03107260507)',
        status: isRegistered ? 'connected' : 'waiting_for_pairing'
    })
})

// Request 8-digit pairing code via web
app.post('/api/pair', async (req, res) => {
    try {
        const { phoneNumber } = req.body || {}
        const cleanNumber = normalizePhoneNumber(phoneNumber)

        if (!cleanNumber || cleanNumber.length < 10 || cleanNumber.length > 15) {
            return res.status(400).json({
                success: false,
                message: 'Invalid phone number! Please enter 10 to 15 digits including country code (e.g. 923107260507).'
            })
        }

        if (!global.conn) {
            return res.status(503).json({
                success: false,
                message: 'Bot socket is currently initializing. Please retry in 5 seconds.'
            })
        }

        if (global.conn.authState?.creds?.registered) {
            return res.json({
                success: false,
                message: 'MASTER MD is already linked and connected to WhatsApp! If you wish to re-pair, please logout first.'
            })
        }

        console.log(`[Web Pairing] Generating code for: +${cleanNumber}`)

        let rawCode = null
        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                if (typeof global.conn.requestPairingCode === 'function') {
                    rawCode = await global.conn.requestPairingCode(cleanNumber, "MASTERMD")
                    if (rawCode) break
                }
            } catch (err) {
                console.warn(`[Web Pairing] Attempt ${attempt} note:`, err.message)
                await new Promise(r => setTimeout(r, 1500))
            }
        }

        if (!rawCode) {
            return res.status(500).json({
                success: false,
                message: 'Could not generate pairing code. Please ensure your number is registered on WhatsApp and try again.'
            })
        }

        const formattedCode = rawCode?.match(/.{1,4}/g)?.join("-") || rawCode

        console.log(`✅ [Web Pairing Ready] Code for +${cleanNumber}: ${formattedCode}`)

        return res.json({
            success: true,
            code: formattedCode,
            phoneNumber: cleanNumber,
            message: 'Pairing code generated successfully!'
        })

    } catch (e) {
        console.error('[Web Pairing Error]:', e)
        return res.status(500).json({
            success: false,
            message: 'Server error: ' + e.message
        })
    }
})

// Start Express Web Server
app.listen(PORT, () => {
    console.log(`\n🌐 [MASTER MD] Web Pairing Server listening on http://localhost:${PORT}`)
})

// Launch NOX-BOT Core
console.log('🚀 [MASTER MD] Launching WhatsApp Baileys Engine...')
import('./index.js').catch(err => {
    console.error('❌ [MASTER MD] Bot start error:', err)
})
