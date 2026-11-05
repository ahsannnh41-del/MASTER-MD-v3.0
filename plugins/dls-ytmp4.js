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
import yts from 'yt-search'

const AXIOS_DEFAULTS = {
    timeout: 60000,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'application/json, text/plain, */*'
    }
}

async function tryRequest(getter, attempts = 3) {
    let lastError
    for (let attempt = 1; attempt <= attempts; attempt++) {
        try {
            return await getter()
        } catch (err) {
            lastError = err
            if (attempt < attempts) {
                await new Promise(r => setTimeout(r, 1000 * attempt))
            }
        }
    }
    throw lastError
}

async function getEliteProTechVideoByUrl(youtubeUrl) {
    const apiUrl = `https://eliteprotech-apis.zone.id/ytdown?url=${encodeURIComponent(youtubeUrl)}&format=mp4`
    const res = await tryRequest(() => axios.get(apiUrl, AXIOS_DEFAULTS))
    if (res?.data?.success && res?.data?.downloadURL) {
        return {
            download: res.data.downloadURL,
            title: res.data.title
        }
    }
    throw new Error('err')
}

async function getYupraVideoByUrl(youtubeUrl) {
    const apiUrl = `https://api.yupra.my.id/api/downloader/ytmp4?url=${encodeURIComponent(youtubeUrl)}`
    const res = await tryRequest(() => axios.get(apiUrl, AXIOS_DEFAULTS))
    if (res?.data?.success && res?.data?.data?.download_url) {
        return {
            download: res.data.data.download_url,
            title: res.data.data.title,
            thumbnail: res.data.data.thumbnail
        }
    }
    throw new Error('err')
}

async function getOkatsuVideoByUrl(youtubeUrl) {
    const apiUrl = `https://okatsu-rolezapiiz.vercel.app/downloader/ytmp4?url=${encodeURIComponent(youtubeUrl)}`
    const res = await tryRequest(() => axios.get(apiUrl, AXIOS_DEFAULTS))
    if (res?.data?.result?.mp4) {
        return {
            download: res.data.result.mp4,
            title: res.data.result.title
        }
    }
    throw new Error('err')
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
    try {
        if (!text) {
            return conn.reply(m.chat, 
`🎬 *تحميل فيديو من يوتيوب*

طريقة الاستخدام:
${usedPrefix}فيد <رابط يوتيوب>
أو
${usedPrefix}فيد <اسم الفيديو>

مثال:
${usedPrefix}فيد Dominic Fike babydoll
${usedPrefix}فيد https://youtu.be/nb8CnIo_-_A?si=jG_z4XZN1emCo2W-`,
m)
}
        let videoUrl = ''
        let videoTitle = ''
        let videoThumbnail = ''

        if (text.startsWith('http://') || text.startsWith('https://')) {
            videoUrl = text
        } else {
            const { videos } = await yts(text)
            if (!videos || !videos.length) {
                return conn.reply(m.chat, '❌ لم يتم العثور على فيديوهات.', m)
            }
            videoUrl = videos[0].url
            videoTitle = videos[0].title
            videoThumbnail = videos[0].thumbnail
        }

        await conn.reply(m.chat, '⏳ جارٍ تنزيل الفيديو، يُرجى الانتظار...', m)

        const apiMethods = [
            () => getEliteProTechVideoByUrl(videoUrl),
            () => getYupraVideoByUrl(videoUrl),
            () => getOkatsuVideoByUrl(videoUrl)
        ]

        let videoData
        for (let method of apiMethods) {
            try {
                videoData = await method()
                if (videoData?.download) break
            } catch { continue }
        }

        if (!videoData?.download) {
            throw new Error('فشلت جميع مصادر التنزيل.')
        }

        await conn.sendMessage(m.chat, {
            video: { url: videoData.download },
            mimetype: 'video/mp4',
            fileName: `${(videoData.title || videoTitle || 'مجهول').replace(/[^\w\s-]/g, '')}.mp4`,
            caption: `🎬 *${videoData.title || videoTitle || 'مجهول'}*\n\nتم التنزيل بنجاح!`
        }, { quoted: m })

    } catch (err) {
        console.error(err)
        conn.reply(m.chat, `❌ Error: ${err.message}`, m)
    }
}

handler.help = ['فيد <رابط الفيديو>\<اسم الفيديو>']
handler.tags = ['download']
handler.command = ['ytvideo','فيد','فيديو','ytv','ytmp4']

export default handler