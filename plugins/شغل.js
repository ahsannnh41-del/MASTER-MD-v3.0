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

import fetch from 'node-fetch'
import yts from 'yt-search'
import Jimp from 'jimp'
import axios from 'axios'
import { delay } from '@whiskeysockets/baileys'

const MAX_FILE_SIZE = 500 * 1024 * 1024
const AUDIO_DOC_THRESHOLD = 30 * 1024 * 1024

const botName = global.botname || 'Ｎｏｘ Ｂｏｔ'
const developer = global.dev || global.author || 'Nox Developer'

 

async function resizeImage(buffer, size = 300) {
    try {
        const image = await Jimp.read(buffer)
        return await image
            .resize(size, size)
            .getBufferAsync(Jimp.MIME_JPEG)
    } catch {
        return buffer
    }
}

function formatSize(bytes) {
    if (!bytes || isNaN(bytes)) return 'غير معروف'

    const units = ['B', 'KB', 'MB', 'GB']
    let i = 0
    bytes = Number(bytes)

    while (bytes >= 1024 && i < units.length - 1) {
        bytes /= 1024
        i++
    }

    return `${bytes.toFixed(2)} ${units[i]}`
}

async function getSize(url) {
    try {
        const response = await axios.head(url, {
            timeout: 10000,
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': '*/*'
            }
        })

        return parseInt(
            response.headers['content-length'],
            10
        ) || 0
    } catch {
        return 0
    }
}

function getYoutubeId(url) {
    return url.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    )?.[1]
}

 

const savenowApi = {

    key: 'dfcb6d76f2f6a9894gjkege8a4ab232222',

    agent:
        'Mozilla/5.0 (Android 13; Mobile; rv:146.0) Gecko/146.0 Firefox/146.0',

    referer: 'https://y2down.cc/enSB/',

    async ytdl(url, format) {

        try {

            const initUrl =
                `https://p.savenow.to/ajax/download.php` +
                `?copyright=0` +
                `&format=${format}` +
                `&url=${encodeURIComponent(url)}` +
                `&api=${this.key}`

            const init = await fetch(initUrl, {
                headers: {
                    'User-Agent': this.agent,
                    'Referer': this.referer
                }
            })

            const data = await init.json()

            if (!data.success) {
                return {
                    error:
                        data.message ||
                        'تعذر بدء عملية التنزيل'
                }
            }

            const id = data.id

            const progressUrl =
                `https://p.savenow.to/api/progress?id=${id}`

            for (let attempt = 0; attempt < 30; attempt++) {

                await delay(2000)

                const response = await fetch(progressUrl, {
                    headers: {
                        'User-Agent': this.agent,
                        'Referer': this.referer
                    }
                })

                const status = await response.json()

                if (status.progress === 1000) {

                    return {
                        title:
                            data.title ||
                            data.info?.title ||
                            'بدون عنوان',

                        image: data.info?.image,

                        link: status.download_url
                    }
                }
            }

            return {
                error: 'انتهى وقت انتظار التنزيل'
            }

        } catch (error) {

            return {
                error: error.message
            }
        }
    },

    async download(url, type = 'audio') {

        try {

            const videoId = getYoutubeId(url)

            if (!videoId) {
                return {
                    status: false,
                    error: 'رابط يوتيوب غير صالح ❌'
                }
            }

            const info = await yts({
                videoId
            })

            let result

            if (type === 'audio') {

                result =
                    await this.ytdl(url, 'mp3')

                if (result.error) {
                    result =
                        await this.ytdl(url, 'm4a')
                }

            } else {

                const qualities = [
                    '720',
                    '480',
                    '360',
                    '240',
                    '144'
                ]

                for (const quality of qualities) {

                    result =
                        await this.ytdl(
                            url,
                            quality
                        )

                    if (!result.error) break
                }
            }

            if (!result || result.error) {
                return {
                    status: false,
                    error:
                        result?.error ||
                        'التنزيل غير متاح'
                }
            }

            return {
                status: true,

                result: {

                    title:
                        result.title ||
                        info.title ||
                        'بدون عنوان',

                    author:
                        info.author?.name ||
                        'غير معروف',

                    views:
                        info.views ||
                        0,

                    timestamp:
                        info.timestamp ||
                        '0:00',

                    ago:
                        info.ago ||
                        'غير معروف',

                    download:
                        result.link,

                    thumbnail:
                        result.image ||
                        info.thumbnail ||
                        `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
                }
            }

        } catch (error) {

            return {
                status: false,
                error: error.message
            }
        }
    }
}

 

const amScraperApi = {

    baseUrl:
        'https://scrapers.hostrta.win/scraper/24',

    async download(url, type = 'audio') {

        try {

            const videoId = getYoutubeId(url)

            if (!videoId) {
                return {
                    status: false,
                    error: 'رابط يوتيوب غير صالح ❌'
                }
            }

            const info =
                await yts({ videoId })

            const response =
                await axios.get(
                    `${this.baseUrl}?url=${encodeURIComponent(url)}`,
                    {
                        timeout: 15000,
                        headers: {
                            'User-Agent':
                                'Mozilla/5.0',
                            'Accept':
                                'application/json'
                        }
                    }
                )

            const data = response.data

            if (!data || data.error) {
                return {
                    status: false,
                    error:
                        data?.error ||
                        'فشل API'
                }
            }

            let downloadUrl = null

            if (type === 'audio') {

                downloadUrl =
                    data.audio?.url ||
                    data.formats?.find(
                        f =>
                            f.mimeType?.includes(
                                'audio'
                            )
                    )?.url

            } else {

                const qualities = [
                    '720p',
                    '480p',
                    '360p',
                    '240p'
                ]

                for (const quality of qualities) {

                    const format =
                        data.formats?.find(
                            f =>
                                f.quality === quality ||
                                f.qualityLabel === quality
                        )

                    if (format?.url) {
                        downloadUrl =
                            format.url
                        break
                    }
                }

                if (!downloadUrl) {
                    downloadUrl =
                        data.video?.url ||
                        data.formats?.find(
                            f =>
                                f.mimeType?.includes(
                                    'video/mp4'
                                )
                        )?.url
                }
            }

            if (!downloadUrl) {
                return {
                    status: false,
                    error:
                        'التنسيق المطلوب غير متوفر'
                }
            }

            return {
                status: true,

                result: {

                    title:
                        info.title ||
                        data.title ||
                        'بدون عنوان',

                    author:
                        info.author?.name ||
                        data.author ||
                        'غير معروف',

                    views:
                        info.views ||
                        data.views ||
                        0,

                    timestamp:
                        info.timestamp ||
                        data.duration ||
                        '0:00',

                    download:
                        downloadUrl,

                    thumbnail:
                        info.thumbnail ||
                        data.thumbnail ||
                        `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
                }
            }

        } catch (error) {

            return {
                status: false,
                error: error.message
            }
        }
    }
}

 

const backupApi = {

    baseUrl:
        'https://youtube-downloader-api.vercel.app',

    async download(url, type = 'audio') {

        try {

            const response =
                await axios.get(
                    `${this.baseUrl}/info?url=${encodeURIComponent(url)}`,
                    {
                        timeout: 10000
                    }
                )

            const data =
                response.data?.data

            if (!data) {
                return {
                    status: false,
                    error:
                        'تعذر الحصول على معلومات الفيديو'
                }
            }

            let downloadUrl = null

            if (type === 'audio') {

                const formats =
                    data.formats || []

                const audio =
                    formats
                        .filter(
                            f =>
                                f.mimeType?.includes(
                                    'audio'
                                )
                        )
                        .sort(
                            (a, b) =>
                                (b.bitrate || 0) -
                                (a.bitrate || 0)
                        )[0]

                downloadUrl =
                    audio?.url

            } else {

                const formats =
                    data.formats || []

                const video =
                    formats.find(
                        f =>
                            f.hasVideo &&
                            f.hasAudio &&
                            (
                                f.qualityLabel ===
                                '720p' ||
                                f.qualityLabel ===
                                '480p'
                            )
                    ) ||
                    formats.find(
                        f =>
                            f.hasVideo &&
                            f.hasAudio
                    )

                downloadUrl =
                    video?.url
            }

            if (!downloadUrl) {
                return {
                    status: false,
                    error:
                        'التنسيق غير متوفر'
                }
            }

            return {
                status: true,

                result: {

                    title:
                        data.title ||
                        'بدون عنوان',

                    author:
                        data.author?.name ||
                        'غير معروف',

                    views:
                        data.viewCount ||
                        0,

                    timestamp:
                        data.lengthSeconds ||
                        0,

                    download:
                        downloadUrl,

                    thumbnail:
                        data.thumbnails?.at(-1)?.url
                }
            }

        } catch (error) {

            return {
                status: false,
                error: error.message
            }
        }
    }
}

 

async function downloadWithFallback(
    url,
    type = 'audio'
) {

    let result

    result =
        await savenowApi.download(
            url,
            type
        )

    if (result.status) {
        return result
    }

    result =
        await amScraperApi.download(
            url,
            type
        )

    if (result.status) {
        return result
    }

    result =
        await backupApi.download(
            url,
            type
        )

    if (result.status) {
        return result
    }

    return {
        status: false,
        error:
            'تعذر تنزيل الفيديو حاليًا، حاول مرة أخرى لاحقًا ❌'
    }
}

 

const handler = async (
    m,
    {
        conn,
        text,
        usedPrefix,
        command
    }
) => {

    const downloadCommands = [
        'ytmp340',
        'ytmp440',
        'ytmpp3doc',
        'ytmpp4doc'
    ]

    if (
        downloadCommands.includes(
            command
        )
    ) {
        return handleDownload(
            m,
            conn,
            text,
            command,
            usedPrefix
        )
    }

    if (!text?.trim()) {

        return m.reply(
            `❗ *طريقة الاستخدام*

مثال:
» ${usedPrefix}${command} Golden Brown

أو:
» ${usedPrefix}${command} https://youtube.com/...`
        )
    }

    await m.react('🔎')

    try {

        const search =
            await yts(text)

        const video =
            search.videos?.[0]

        if (!video) {
            throw new Error(
                'لم يتم العثور على نتائج ❌'
            )
        }

        const title =
            video.title || 'بدون عنوان'

        const author =
            video.author?.name ||
            'غير معروف'

        const views =
            video.views?.toLocaleString() ||
            'غير معروف'

        const body =
`╭━━〔 ${botName} 〕━━╮
│
│ 🎵 *نتيجة يوتيوب*
│
│ 🎬 ${title.substring(0, 100)}
│
│ 👤 ${author.substring(0, 50)}
│ 👁️ ${views}
│ ⏱️ ${video.timestamp || '0:00'}
│ 📅 ${video.ago || 'غير معروف'}
│
╰━━━━━━━━━━━━━━╯

اختر نوع التحميل من الأوامر بالأسفل 👇`

        const buttons = [

            {
                buttonId:
                    `${usedPrefix}ytmp340 ${video.url}`,

                buttonText: {
                    displayText:
                        '🎧 صوت'
                },

                type: 1
            },

            {
                buttonId:
                    `${usedPrefix}ytmp440 ${video.url}`,

                buttonText: {
                    displayText:
                        '🎬 فيديو'
                },

                type: 1
            },

            {
                buttonId:
                    `${usedPrefix}ytmpp3doc ${video.url}`,

                buttonText: {
                    displayText:
                        '📄 صوت كملف'
                },

                type: 1
            },

            {
                buttonId:
                    `${usedPrefix}ytmpp4doc ${video.url}`,

                buttonText: {
                    displayText:
                        '📦 فيديو كملف'
                },

                type: 1
            }
        ]

        try {

            await conn.sendMessage(
                m.chat,
                {
                    image: {
                        url: video.thumbnail
                    },

                    caption: body,

                    footer:
                        `⌁ ${botName} • ${developer}`,

                    buttons,

                    viewOnce: true,

                    headerType: 4
                },
                {
                    quoted: m
                }
            )

        } catch {

            await conn.sendFile(
                m.chat,
                video.thumbnail,
                'thumbnail.jpg',
                `${body}

🎧 ${usedPrefix}ytmp340 ${video.url}
🎬 ${usedPrefix}ytmp440 ${video.url}
📄 ${usedPrefix}ytmpp3doc ${video.url}
📦 ${usedPrefix}ytmpp4doc ${video.url}`,
                m
            )
        }

        await m.react('✅')

    } catch (error) {

        await m.react('❌')

        return m.reply(
            `❌ حدث خطأ:

${error.message || error}`
        )
    }
}

 

async function handleDownload(
    m,
    conn,
    text,
    command,
    usedPrefix
) {

    if (!text?.trim()) {

        return m.reply(
            `❌ أرسل رابط الفيديو أولًا.

مثال:
» ${usedPrefix}${command} https://youtu.be/...`
        )
    }

    await m.react('⏳')

    try {

        let url

        if (
            /youtube\.com|youtu\.be/i.test(
                text
            )
        ) {

            const id =
                getYoutubeId(text)

            if (!id) {
                throw new Error(
                    'رابط يوتيوب غير صالح ❌'
                )
            }

            url =
                `https://www.youtube.com/watch?v=${id}`

        } else {

            const search =
                await yts(text)

            if (!search.videos?.length) {
                throw new Error(
                    'لم يتم العثور على الفيديو ❌'
                )
            }

            url =
                search.videos[0].url
        }

        const id =
            getYoutubeId(url)

        const info =
            await yts({
                videoId: id
            })

        const title =
            info.title ||
            'بدون عنوان'

        const thumbnail =
            info.thumbnail ||
            `https://i.ytimg.com/vi/${id}/hqdefault.jpg`

        let thumbBuffer

        try {

            const thumbResponse =
                await fetch(thumbnail)

            thumbBuffer =
                await thumbResponse.buffer()

            thumbBuffer =
                await resizeImage(
                    thumbBuffer,
                    300
                )

        } catch {
            thumbBuffer = null
        }

         

        if (
            command === 'ytmp340'
        ) {

            await m.reply(
`╭━━〔 ${botName} 〕━━╮
│ 🎧 *جاري تحميل الصوت*
╰━━━━━━━━━━━━━━╯

🎵 ${title}

⏳ انتظر قليلًا...`
            )

            const dl =
                await downloadWithFallback(
                    url,
                    'audio'
                )

            if (!dl.status) {
                throw new Error(
                    dl.error
                )
            }

            const size =
                await getSize(
                    dl.result.download
                )

            if (
                size > MAX_FILE_SIZE
            ) {
                throw new Error(
                    `حجم الملف كبير جدًا: ${formatSize(size)}`
                )
            }

            await conn.sendMessage(
                m.chat,
                {
                    audio: {
                        url:
                            dl.result.download
                    },

                    mimetype:
                        'audio/mpeg',

                    fileName:
                        `${title}.mp3`
                },
                {
                    quoted: m
                }
            )

            await m.react('✅')
            return
        }

         

        if (
            command === 'ytmp440'
        ) {

            await m.reply(
`╭━━〔 ${botName} 〕━━╮
│ 🎬 *جاري تحميل الفيديو*
╰━━━━━━━━━━━━━━╯

📹 ${title}

⏳ انتظر قليلًا...`
            )

            const dl =
                await downloadWithFallback(
                    url,
                    'video'
                )

            if (!dl.status) {
                throw new Error(
                    dl.error
                )
            }

            const size =
                await getSize(
                    dl.result.download
                )

            if (
                size > 200 * 1024 * 1024
            ) {
                throw new Error(
                    `الفيديو كبير جدًا (${formatSize(size)}).

استخدم أمر ملف الفيديو:
${usedPrefix}ytmpp4doc ${url}`
                )
            }

            const message = {
                video: {
                    url:
                        dl.result.download
                },

                mimetype:
                    'video/mp4',

                caption:
                    `🎬 *${title}*\n\n⌁ ${botName}`
            }

            if (thumbBuffer) {
                message.jpegThumbnail =
                    thumbBuffer
            }

            await conn.sendMessage(
                m.chat,
                message,
                {
                    quoted: m
                }
            )

            await m.react('✅')
            return
        }

         

        if (
            command === 'ytmpp3doc'
        ) {

            await m.reply(
`╭━━〔 ${botName} 〕━━╮
│ 📄 *جاري تجهيز الملف*
╰━━━━━━━━━━━━━━╯

🎵 ${title}

⏳ انتظر قليلًا...`
            )

            const dl =
                await downloadWithFallback(
                    url,
                    'audio'
                )

            if (!dl.status) {
                throw new Error(
                    dl.error
                )
            }

            const size =
                await getSize(
                    dl.result.download
                )

            if (
                size > MAX_FILE_SIZE
            ) {
                throw new Error(
                    `حجم الملف كبير جدًا (${formatSize(size)})`
                )
            }

            await conn.sendMessage(
                m.chat,
                {
                    document: {
                        url:
                            dl.result.download
                    },

                    mimetype:
                        'audio/mpeg',

                    fileName:
                        `${title}.mp3`
                },
                {
                    quoted: m
                }
            )

            await m.react('✅')
            return
        }

         

        if (
            command === 'ytmpp4doc'
        ) {

            await m.reply(
`╭━━〔 ${botName} 〕━━╮
│ 📦 *جاري تجهيز الفيديو*
╰━━━━━━━━━━━━━━╯

📹 ${title}

⏳ انتظر قليلًا...`
            )

            const dl =
                await downloadWithFallback(
                    url,
                    'video'
                )

            if (!dl.status) {
                throw new Error(
                    dl.error
                )
            }

            const size =
                await getSize(
                    dl.result.download
                )

            if (
                size > MAX_FILE_SIZE
            ) {
                throw new Error(
                    `حجم الملف كبير جدًا (${formatSize(size)})`
                )
            }

            await conn.sendMessage(
                m.chat,
                {
                    document: {
                        url:
                            dl.result.download
                    },

                    mimetype:
                        'video/mp4',

                    fileName:
                        `${title}.mp4`
                },
                {
                    quoted: m
                }
            )

            await m.react('✅')
            return
        }

    } catch (error) {

        await m.react('❌')

        console.error(
            '[NOX YOUTUBE ERROR]',
            error
        )

        return m.reply(
            `❌ *تعذر إكمال العملية*

${error.message || error}`
        )
    }
}

 

handler.help = [
    'شغل <اسم الأغنية>',
    'play <اسم الأغنية>',
    'ytmp340 <رابط>',
    'ytmp440 <رابط>',
    'ytmpp3doc <رابط>',
    'ytmpp4doc <رابط>'
]

handler.tags = [
    'download'
]

handler.command = [
    'play',
    'شغل',
    'ytmp340',
    'ytmp440',
    'ytmpp3doc',
    'ytmpp4doc'
]

handler.group = true
handler.register = false

export default handler