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
    const isActuallyOnline = !!(global.conn?.user?.id && global.conn?.ws?.readyState === 1)
    const user = global.conn?.user || null

    res.json({
        success: true,
        isConnReady,
        isRegistered: isActuallyOnline,
        user,
        botName: 'MASTER MD v3.0.0',
        developer: 'AHSAN (03107260507)',
        status: isActuallyOnline ? 'connected' : 'waiting_for_pairing'
    })
})

// Live QR code endpoint
app.get('/api/qr', async (req, res) => {
    try {
        const refresh = req.query.refresh === 'true'
        if (typeof global.getOrGenerateQR === 'function') {
            const qrResult = await global.getOrGenerateQR(refresh)
            return res.json({ success: true, ...qrResult })
        }
        if (global.qrDataURL) {
            return res.json({ success: true, qr: global.qrDataURL, isConnected: false })
        }
        return res.json({ success: false, message: 'QR Code is generating... please wait 2-3 seconds.' })
    } catch (e) {
        return res.status(500).json({ success: false, message: e.message })
    }
})

// Request 8-digit pairing code via web
app.post('/api/pair', async (req, res) => {
    try {
        const { phoneNumber, force } = req.body || {}
        const cleanNumber = normalizePhoneNumber(phoneNumber)

        if (!cleanNumber || cleanNumber.length < 10 || cleanNumber.length > 15) {
            return res.status(400).json({
                success: false,
                message: 'Invalid phone number! Please enter 10 to 15 digits including country code (e.g. 923107260507).'
            })
        }

        const isActuallyOnline = !!(global.conn?.user?.id && global.conn?.ws?.readyState === 1)
        if (isActuallyOnline && !force) {
            return res.json({
                success: false,
                alreadyConnected: true,
                user: global.conn.user.id.split(':')[0],
                message: 'MASTER MD is already online and connected as +' + global.conn.user.id.split(':')[0] + '. Click "Force Re-Pair" below if you want to link a new number.'
            })
        }

        if (force) {
            if (typeof global.resetSession === 'function') {
                await global.resetSession()
                await new Promise(r => setTimeout(r, 2500))
            }
        }

        // Wait up to 5 seconds if bot engine is still loading
        for (let wait = 0; wait < 10; wait++) {
            if (typeof global.requestPairingCode === 'function' || global.conn) break
            await new Promise(r => setTimeout(r, 500))
        }

        console.log(`[Web Pairing] Initiating clean pairing flow for: +${cleanNumber}`)

        let formattedCode = null
        if (typeof global.requestPairingCode === 'function') {
            formattedCode = await global.requestPairingCode(cleanNumber)
        } else if (global.conn && typeof global.conn.requestPairingCode === 'function') {
            const rawCode = await global.conn.requestPairingCode(cleanNumber)
            formattedCode = rawCode?.match(/.{1,4}/g)?.join("-") || rawCode
        }

        if (!formattedCode) {
            return res.status(500).json({
                success: false,
                message: 'Could not generate pairing code. Please ensure your number is registered on WhatsApp and try again.'
            })
        }

        console.log(`✅ [Web Pairing Ready] Code for +${cleanNumber}: ${formattedCode}`)

        return res.json({
            success: true,
            code: formattedCode,
            phoneNumber: cleanNumber,
            message: 'Pairing code generated successfully! Enter it on your phone within 60 seconds.'
        })

    } catch (e) {
        console.error('[Web Pairing Error]:', e)
        return res.status(500).json({
            success: false,
            message: e.message || 'Server error occurred during pairing.'
        })
    }
})

// Reset session to allow fresh pairing code or QR handshake
app.post('/api/reset', async (req, res) => {
    try {
        if (typeof global.resetSession === 'function') {
            await global.resetSession()
        } else {
            const sessionPath = path.join(__dirname, global.sessions || 'Sessions/Principal')
            if (fs.existsSync(sessionPath)) {
                fs.rmSync(sessionPath, { recursive: true, force: true })
                console.log('🧹 [Session Reset] Cleared session files.')
            }
        }
        return res.json({ success: true, message: 'Session reset successfully! You can now request a fresh pairing code or scan QR code.' })
    } catch (e) {
        return res.status(500).json({ success: false, message: e.message })
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

// Automatically launch Telegram Pairing Bot
setTimeout(() => {
    const tgToken = process.env.TELEGRAM_BOT_TOKEN || process.env.TG_TOKEN || global.tgToken || '9104594619:AAHaspLTBfwlKCTSU1xsmCPi0GZ-bFAP2M8'
    if (tgToken) {
        console.log('🤖 [MASTER MD] Launching Telegram Pairing Bot...')
        import('./telegram-pair-bot.js').catch(err => {
            console.error('⚠️ [Telegram Bot Start Error]:', err.message)
        })
    }
}, 3000)
