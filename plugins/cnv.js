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

import axios from 'axios'
import fs from 'fs'
import path from 'path'
import os from 'os'
import { proto, generateWAMessageFromContent, prepareWAMessageMedia } from '@whiskeysockets/baileys'

const TMP = os.tmpdir()
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36'

const HEADERS = {
    'User-Agent': UA,
    'Origin': 'https://iframe.y2meta-uk.com',
    'Referer': 'https://iframe.y2meta-uk.com/'
}

const VIDEO_QUALITIES = [
    { label: '360p', value: '360', emoji: '📱' },
    { label: '480p', value: '480', emoji: '📺' },
    { label: '720p HD', value: '720', emoji: '🎬' },
    { label: '1080p Full HD', value: '1080', emoji: '🎥' },
    { label: '1440p 2K', value: '1440', emoji: '💎' },
    { label: '2160p 4K', value: '2160', emoji: '🌟' }
]

const AUDIO_QUALITIES = [
    { label: 'MP3 128kbps', value: '128', emoji: '🎵' },
    { label: 'MP3 256kbps', value: '256', emoji: '🎧' },
    { label: 'MP3 320kbps', value: '320', emoji: '🎼' }
]

if (!global.cnvData) global.cnvData = {}

function extractVideoId(url) {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
        /^([a-zA-Z0-9_-]{11})$/
    ]
    for (const p of patterns) {
        const m = url.match(p)
        if (m) return m[1]
    }
    return null
}

async function getVideoInfo(videoId) {
    const r = await axios.get(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`, {
        headers: { 'User-Agent': UA },
        timeout: 20000
    })
    return {
        title: r.data?.title || 'YouTube Video',
        author: r.data?.author_name || 'Unknown',
        thumbnail: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
        thumbnailFallback: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
    }
}

async function getDownloadKey(videoId) {
    const r = await axios.get(`https://cnv.cx/v2/sanity/key?id=${videoId}`, {
        headers: HEADERS,
        timeout: 20000
    })
    if (!r.data?.key) throw new Error('فشل جلب المفتاح')
    return r.data.key
}

async function convertVideo(videoId, options) {
    const key = await getDownloadKey(videoId)
    await new Promise(r => setTimeout(r, 1500))

    const params = new URLSearchParams({
        link: `https://youtu.be/${videoId}`,
        format: options.format,
        videoQuality: options.videoQuality,
        filenameStyle: 'pretty',
        vCodec: 'h264'
    })

    if (options.format === 'mp3' && options.audioBitrate) {
        params.set('audioBitrate', options.audioBitrate)
    }

    const r = await axios.post('https://cnv.cx/v2/converter', params.toString(), {
        headers: {
            ...HEADERS,
            'Content-Type': 'application/x-www-form-urlencoded',
            'accept': '*/*',
            'key': key
        },
        timeout: 120000,
        validateStatus: () => true
    })

    if (r.status === 200 && r.data?.url) return r.data
    if (r.data?.errorMsg) throw new Error(r.data.errorMsg)
    throw new Error('فشل التحويل: ' + r.status)
}

async function downloadBuffer(url) {
    const r = await axios.get(url, {
        headers: {
            'User-Agent': UA,
            'Referer': 'https://cnv.cx/',
            'Origin': 'https://cnv.cx'
        },
        timeout: 600000,
        responseType: 'arraybuffer',
        maxRedirects: 5
    })
    return Buffer.from(r.data)
}

async function getThumbBuffer(info) {
    for (const url of [info.thumbnail, info.thumbnailFallback]) {
        try {
            const r = await axios.get(url, {
                headers: { 'User-Agent': UA },
                responseType: 'arraybuffer',
                timeout: 15000
            })
            if (r.data?.length > 1000) return Buffer.from(r.data)
        } catch {}
    }
    return null
}

function formatSize(bytes) {
    if (!bytes || bytes < 1024) return bytes + ' B'
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
    if (bytes < 1073741824) return (bytes / 1048576).toFixed(2) + ' MB'
    return (bytes / 1073741824).toFixed(2) + ' GB'
}

let before = async (m, { conn }) => {
    try {
        let text = m.text || ''
        const userId = m.sender.split('@')[0]

        if (!text.startsWith('.cnvsel-')) return false

        const parts = text.trim().split(/\s+/)
        const key = parts[0]

        const data = global.cnvData?.[userId]?.[key]
        if (!data) return false

        const isVideo = data.type === 'video'
        const quality = isVideo
            ? VIDEO_QUALITIES.find(q => q.value === data.quality)
            : AUDIO_QUALITIES.find(q => q.value === data.quality)

        if (!quality) return false

        const emoji = quality.emoji
        const label = quality.label

        await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })
        const statusMsg = await m.reply(`⏳ *جاري تحضير ${emoji} ${label}...*`)

        try {
            const options = isVideo
                ? { format: 'mp4', videoQuality: quality.value }
                : { format: 'mp3', audioBitrate: quality.value, videoQuality: '720' }

            const result = await convertVideo(data.videoId, options)

            await m.reply(`⬇️ *جاري تحميل ${emoji} ${label}...*`)
            const buffer = await downloadBuffer(result.url)

            try { await conn.sendMessage(m.chat, { delete: statusMsg.key }) } catch {}

            if (buffer.length < 10000) throw new Error('الملف صغير جداً')
            const sizeStr = formatSize(buffer.length)

            if (isVideo) {
                const outFile = path.join(TMP, `cnv_${Date.now()}.mp4`)
                fs.writeFileSync(outFile, buffer)
                await conn.sendMessage(m.chat, {
                    video: { url: outFile },
                    mimetype: 'video/mp4',
                    fileName: result.filename || `${data.title}.mp4`,
                    caption: `🎬 *${data.title.slice(0, 80)}*\n\n${emoji} *الجودة:* ${label}\n📦 *الحجم:* ${sizeStr}`
                }, { quoted: m })
                setTimeout(() => { try { fs.unlinkSync(outFile) } catch {} }, 180000)
            } else {
                const outFile = path.join(TMP, `cnv_${Date.now()}.mp3`)
                fs.writeFileSync(outFile, buffer)
                await conn.sendMessage(m.chat, {
                    audio: { url: outFile },
                    mimetype: 'audio/mpeg',
                    fileName: result.filename || `${data.title}.mp3`,
                    ptt: false
                }, { quoted: m })
                setTimeout(() => { try { fs.unlinkSync(outFile) } catch {} }, 180000)
            }

            await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
        } catch (e) {
            console.error('[cnv DL]', e.message)
            try { await conn.sendMessage(m.chat, { delete: statusMsg.key }) } catch {}
            await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
            m.reply('❌ ' + e.message)
        }

        return true
    } catch {
        return false
    }
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
    const input = (text || '').trim()

    if (input.startsWith('.cnvsel-')) return

    if (!input) {
        return m.reply(`🎬 *YouTube Downloader*\n\n${usedPrefix}${command} <رابط أو ID>\n\n💡 *مثال:*\n${usedPrefix}${command} https://youtu.be/dQw4w9WgXcQ`)
    }

    const videoId = extractVideoId(input)
    if (!videoId) {
        return m.reply('❌ رابط غير صالح')
    }

    await m.react('⏳')

    try {
        const info = await getVideoInfo(videoId)
        const userId = m.sender.split('@')[0]

        if (!global.cnvData[userId]) global.cnvData[userId] = {}

        const videoRows = VIDEO_QUALITIES.map((q, i) => {
            const code = `.cnvsel-v${i}`
            global.cnvData[userId][code] = {
                videoId,
                type: 'video',
                quality: q.value,
                title: info.title
            }
            return {
                header: `${q.emoji} ${q.label}`,
                title: `${q.emoji} تحضير الجودة (${q.label})`,
                description: 'فيديو بصيغة MP4',
                id: code
            }
        })

        const audioRows = AUDIO_QUALITIES.map((q, i) => {
            const code = `.cnvsel-a${i}`
            global.cnvData[userId][code] = {
                videoId,
                type: 'audio',
                quality: q.value,
                title: info.title
            }
            return {
                header: `${q.emoji} ${q.label}`,
                title: `${q.emoji} تحضير الصوت (${q.label})`,
                description: 'صوت بصيغة MP3',
                id: code
            }
        })

        let imgMsg = null
        try {
            const thumb = await getThumbBuffer(info)
            if (thumb) {
                imgMsg = await prepareWAMessageMedia(
                    { image: thumb },
                    { upload: conn.waUploadToServer }
                )
            }
        } catch {}

        const bodyText = `🎬 *${info.title.slice(0, 80)}*\n\n👤 *القناة:* ${info.author}\n\n🎚️ *اختر الجودة المطلوبة من القائمة:*`

        const msg = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                        body: proto.Message.InteractiveMessage.Body.create({ text: bodyText }),
                        footer: proto.Message.InteractiveMessage.Footer.create({ text: '✧ 𝙎𝙃𝘼𝙉𝙆𝙎 𝘽𝙊𝙏 𝘾𝙊𝘿𝙀𝙎' }),
                        header: proto.Message.InteractiveMessage.Header.create({
                            hasMediaAttachment: !!imgMsg?.imageMessage,
                            imageMessage: imgMsg?.imageMessage || null
                        }),
                        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                            buttons: [
                                {
                                    name: 'single_select',
                                    buttonParamsJson: JSON.stringify({
                                        title: '🎬 جودات الفيديو (MP4)',
                                        sections: [{ title: 'اختر الجودة المناسبة', rows: videoRows }]
                                    })
                                },
                                {
                                    name: 'single_select',
                                    buttonParamsJson: JSON.stringify({
                                        title: '🎵 جودات الصوت (MP3)',
                                        sections: [{ title: 'اختر جودة الصوت', rows: audioRows }]
                                    })
                                }
                            ],
                            messageParamsJson: ''
                        })
                    })
                }
            }
        }, { userJid: conn.user.jid, quoted: m })

        await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
        await m.react('✅')
    } catch (e) {
        console.error('[cnv]', e.message)
        await m.react('❌')
        m.reply('❌ ' + e.message)
    }
}

handler.before = before
handler.help = ['يوتيوب <رابط>']
handler.tags = ['downloader']
handler.command = /^(يوتيوب|yt|cnv|cnvdown)$/i

export default handler