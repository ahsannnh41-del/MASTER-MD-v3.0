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

const BOT_NAME = 'Ｎｏｘ Ｂｏｔ'

const handler = async (m, { conn, text, usedPrefix }) => {

   if (!text) {
      return conn.sendMessage(
         m.chat,
         {
            text: `╭━━━〔 ${BOT_NAME} 〕━━━╮
│
│ 𖤐 📦 تـحـمـيـل تـطـبـيـقـات APK
│ 𖤐 📱 مـع مـلـفـات OBB إن وجـدت
│
│ ⚡ طـريـقـة الاسـتـخـدام:
│ • ${usedPrefix}apk ⧼ اسم التطبيق ⧽
│
│ 📌 مـثـال:
│ • ${usedPrefix}apk free fire
│
╰━━━〔 ${BOT_NAME} 〕━━━╯`,
            contextInfo: {
               externalAdReply: {
                  title: `𖤐 ${BOT_NAME}`,
                  body: '⚡ APK DOWNLOADER',
                  mediaType: 1,
                  thumbnail: await getThumbnail(),
                  mediaUrl: 'https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46',
                  sourceUrl: 'https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46'
               }
            }
         },
         { quoted: m }
      )
   }

   const query = text.trim()

   if (/^com\./i.test(query)) {

      await conn.sendMessage(m.chat, {
         react: {
            text: '⏬',
            key: m.key
         }
      })

      try {

         const info = await getAppInfo(query)
         const res = await downloadApp(query)

         if (res.size > 2000000000) {
            return conn.sendMessage(
               m.chat,
               {
                  text: `╭━━━〔 ${BOT_NAME} 〕━━━╮
│
│ ❌ حـجـم APK كـبـيـر جـداً
│
│ 📦 الـحـد الأقـصـى: 2GB
│
╰━━━〔 ${BOT_NAME} 〕━━━╯`
               },
               { quoted: m }
            )
         }

         await conn.sendMessage(
            m.chat,
            {
               image: {
                  url: info.icon
               },
               caption: `╭━━━〔 ${BOT_NAME} 〕━━━╮
│
│ 📱 الاسـم: ${info.name}
│ 📦 الـحـزمـة: ${info.packageN}
│
│ ⏬ جـاري تـحـمـيـل الـمـلـف...
│
╰━━━〔 ${BOT_NAME} 〕━━━╯`,
               footer: BOT_NAME
            },
            { quoted: m }
         )

         await conn.sendMessage(
            m.chat,
            {
               document: {
                  url: res.download
               },
               mimetype:
                  res.mimetype ||
                  'application/vnd.android.package-archive',
               fileName: res.fileName
            },
            { quoted: m }
         )

         if (info.obb && info.obb_link) {

            await conn.sendMessage(
               m.chat,
               {
                  text: `╭━━━〔 ${BOT_NAME} 〕━━━╮
│
│ 📦 جـاري تـحـمـيـل OBB
│ 📱 ${info.name}
│
╰━━━〔 ${BOT_NAME} 〕━━━╯`
               },
               { quoted: m }
            )

            const obbRes = await fetch(
               info.obb_link,
               {
                  method: 'HEAD'
               }
            )

            const obbMimetype =
               obbRes.headers.get('content-type') ||
               'application/octet-stream'

            const obbFileName =
               decodeURIComponent(
                  info.obb_link
                     .split('/')
                     .pop()
                     .split('?')[0]
               )

            await conn.sendMessage(
               m.chat,
               {
                  document: {
                     url: info.obb_link
                  },
                  mimetype: obbMimetype,
                  fileName: obbFileName
               },
               { quoted: m }
            )
         }

         await conn.sendMessage(m.chat, {
            react: {
               text: '✅',
               key: m.key
            }
         })

      } catch (e) {

         console.error(`[${BOT_NAME} APK ERROR]`, e)

         await conn.sendMessage(
            m.chat,
            {
               text: `╭━━━〔 ${BOT_NAME} 〕━━━╮
│
│ ❌ فـشـل تـحـمـيـل APK
│
│ ⚠️ حـاول مـرة أخـرى لاحـقـاً
│
╰━━━〔 ${BOT_NAME} 〕━━━╯`
            },
            { quoted: m }
         )
      }

      return
   }

   await conn.sendMessage(m.chat, {
      react: {
         text: '🔍',
         key: m.key
      }
   })

   try {

      const apps = await searchApps(query)

      if (!apps.length) {
         return conn.sendMessage(
            m.chat,
            {
               text: `╭━━━〔 ${BOT_NAME} 〕━━━╮
│
│ ❌ لـم يـتـم الـعـثـور عـلـى تـطـبـيـقـات
│
│ 🔎 الـبـحـث: ${query}
│
╰━━━〔 ${BOT_NAME} 〕━━━╯`
            },
            { quoted: m }
         )
      }

      let generateWAMessageFromContent
      let proto

      try {

         let baileysLib

         try {
            baileysLib =
               await import('@whiskeysockets/baileys')
         } catch {
            baileysLib =
               await import('baileys')
         }

         generateWAMessageFromContent =
            baileysLib?.generateWAMessageFromContent ||
            baileysLib?.default?.generateWAMessageFromContent

         proto =
            baileysLib?.proto ||
            baileysLib?.default?.proto

      } catch (e) {
         console.error(
            `[${BOT_NAME} BAILEYS ERROR]`,
            e
         )
      }

      if (
         generateWAMessageFromContent &&
         proto
      ) {

         const buttons = [
            {
               name: 'single_select',

               buttonParamsJson:
                  JSON.stringify({
                     title: '📱 عـرض الـنـتـائـج',

                     sections: [
                        {
                           title:
                              `🔎 نتائج البحث: ${query}`,

                           rows: apps.map(
                              app => ({
                                 title:
                                    String(
                                       app.name
                                    ).slice(0, 24),

                                 description:
                                    String(
                                       app.package
                                    ).slice(0, 48),

                                 id:
                                    `${usedPrefix}apk ${app.package}`
                              })
                           )
                        }
                     ]
                  })
            }
         ]

         const msg =
            generateWAMessageFromContent(
               m.chat,
               {
                  viewOnceMessage: {
                     message: {
                        messageContextInfo: {
                           deviceListMetadata: {},
                           deviceListMetadataVersion: 2
                        },

                        interactiveMessage:
                           proto.Message.InteractiveMessage.fromObject({

                              body:
                                 proto.Message.InteractiveMessage.Body.create({
                                    text: `╭━━━〔 ${BOT_NAME} 〕━━━╮
│
│ 🔎 الـبـحـث: ${query}
│
│ 📱 اخـتـر الـتـطـبـيـق لـلـتـحـمـيـل
│
╰━━━〔 ${BOT_NAME} 〕━━━╯`
                                 }),

                              footer:
                                 proto.Message.InteractiveMessage.Footer.create({
                                    text:
                                       `© ${BOT_NAME}`
                                 }),

                              nativeFlowMessage:
                                 proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                                    buttons
                                 })
                           })
                     }
                  }
               },
               {}
            )

         await conn.relayMessage(
            m.chat,
            msg.message,
            {
               messageId: msg.key.id
            }
         )

         return
      }

      let fallbackTxt =
         `╭━━━〔 ${BOT_NAME} 〕━━━╮
│
│ 🔎 نـتـائـج الـبـحـث
│ ${query}
│
╰━━━〔 ${BOT_NAME} 〕━━━╯

`

      apps.forEach(
         (app, i) => {

            fallbackTxt +=
               `*${i + 1}.* ${app.name}
📦 *الـحـزمـة:* ${app.package}
🔗 *الـتـحـمـيـل:* ${usedPrefix}apk ${app.package}

`
         }
      )

      await conn.sendMessage(
         m.chat,
         {
            text: fallbackTxt.trim()
         },
         { quoted: m }
      )

   } catch (e) {

      console.error(
         `[${BOT_NAME} SEARCH ERROR]`,
         e
      )

      await conn.sendMessage(
         m.chat,
         {
            text: `╭━━━〔 ${BOT_NAME} 〕━━━╮
│
│ 🥶 حـدث خـطـأ أثـنـاء الـبـحـث
│
╰━━━〔 ${BOT_NAME} 〕━━━╯`
         },
         { quoted: m }
      )
   }
}

async function searchApps(query) {

   const res = await fetch(
      'http://ws75.aptoide.com/api/7/apps/search?query=' +
      encodeURIComponent(query) +
      '&limit=10'
   )

   const json = await res.json()

   return (
      json?.datalist?.list?.map(
         app => ({
            name: app.name,
            package: app.package
         })
      ) || []
   )
}

async function getAppInfo(packageName) {

   const res = await fetch(
      'http://ws75.aptoide.com/api/7/apps/search?query=' +
      encodeURIComponent(packageName) +
      '&limit=1'
   )

   const json = await res.json()

   const app =
      json?.datalist?.list?.[0]

   if (!app) {
      throw new Error(
         '❌ لم يتم العثور على التطبيق'
      )
   }

   let obbLink = null
   let hasObb = false

   try {
      obbLink =
         app.obb.main.path

      hasObb =
         Boolean(obbLink)

   } catch {
      obbLink = null
      hasObb = false
   }

   return {
      obb: hasObb,
      obb_link: obbLink,
      name: app.name,
      icon: app.icon,
      packageN: app.package
   }
}

async function downloadApp(packageName) {

   const res = await fetch(
      'http://ws75.aptoide.com/api/7/apps/search?query=' +
      encodeURIComponent(packageName) +
      '&limit=1'
   )

   const json = await res.json()

   const app =
      json?.datalist?.list?.[0]

   if (!app?.file?.path) {
      throw new Error(
         'رابط تحميل APK غير موجود'
      )
   }

   const download =
      app.file.path

   const fileName =
      app.package + '.apk'

   const head =
      await fetch(
         download,
         {
            method: 'HEAD'
         }
      )

   const sizeHeader =
      head.headers.get(
         'content-length'
      )

   const size =
      sizeHeader
         ? Number(sizeHeader)
         : 0

   const mimetype =
      head.headers.get(
         'content-type'
      ) ||
      'application/vnd.android.package-archive'

   return {
      fileName,
      mimetype,
      download,
      size
   }
}

async function getThumbnail() {

   try {

      const res =
         await fetch(
            'https://file.garden/aauvg01sjleV_ic1/8f445f4632f57a977f5e5e2524510d2f.jpg'
         )

      return Buffer.from(
         await res.arrayBuffer()
      )

   } catch {

      return null
   }
}

handler.command = ['apk']

export default handler