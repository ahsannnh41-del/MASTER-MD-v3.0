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

const regex = /^(?:https:\/\/|git@)github\.com\/([^\/]+)\/([^\/]+?)(?:\.git)?$/i

const handler = async (m, { conn, usedPrefix, text }) => {

  if (!text) {
    return conn.reply(
      m.chat,
      `╭━━━〔 Ｎｏｘ Ｂｏｔ 〕━━━╮
│
│ 𖤐 أرسل رابط مستودع GitHub
│ 𖤐 أو اكتب اسم المستودع للبحث
│
│ ⚙️ الاستخدام:
│ ${usedPrefix}gitclone ⧼ الرابط / الاسم ⧽
│
│ 📌 مثال:
│ ${usedPrefix}gitclone https://github.com/user/repo
│
╰━━━〔 Ｎｏｘ Ｂｏｔ 〕━━━╯`,
      m
    )
  }

  try {

    await m.react('🔄')

    let info = ''
    let image
    let zipBuffer
    let zipName
    let repos = []

    const match = text.trim().match(regex)

    if (match) {

      const [, user, repo] = match

      const repoRes = await fetch(
        `https://api.github.com/repos/${user}/${repo}`
      )

      const zipRes = await fetch(
        `https://api.github.com/repos/${user}/${repo}/zipball`
      )

      const repoData = await repoRes.json()

      if (!repoRes.ok || repoData?.message) {
        throw new Error(
          'لم يتم العثور على المستودع المطلوب.'
        )
      }

      zipName =
        zipRes.headers
          .get('content-disposition')
          ?.match(/filename=(.*)/)?.[1]

      if (!zipName) {
        zipName = `${repo}-${user}.zip`
      }

      zipBuffer = await zipRes.buffer()

      repos.push(repoData)

      image =
        'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/shadow-christmas.jpg'

    } else {

      const res = await fetch(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(text)}`
      )

      const json = await res.json()

      if (!json.items?.length) {
        return conn.reply(
          m.chat,
          `╭━━━〔 Ｎｏｘ Ｂｏｔ 〕━━━╮
│
│ ❌ لم يتم العثور على أي مستودعات.
│
│ 🔎 البحث:
│ ${text}
│
╰━━━〔 Ｎｏｘ Ｂｏｔ 〕━━━╯`,
          m
        )
      }

      repos = json.items

      image =
        await (
          await fetch(
            repos[0].owner.avatar_url
          )
        ).buffer()
    }

    info += repos
      .map(
        (repo, index) =>
`╭━━━〔 Ｎｏｘ Ｂｏｔ 〕━━━╮
│
│ 📦 المستودع: ${index + 1}
│
│ 👤 المطور: ${repo.owner.login}
│ 📂 الاسم: ${repo.name}
│ 📅 تاريخ الإنشاء: ${formatDate(repo.created_at)}
│ 🔄 آخر تحديث: ${formatDate(repo.updated_at)}
│ 👁️ المتابعون: ${repo.watchers}
│ 🌱 التفرعات: ${repo.forks}
│ ⭐ النجوم: ${repo.stargazers_count}
│ ⚔️ المشاكل: ${repo.open_issues}
│
│ 📝 الوصف:
│ ${repo.description || 'لا يوجد وصف'}
│
│ 🔗 الرابط:
│ ${repo.clone_url}
│
╰━━━〔 Ｎｏｘ Ｂｏｔ 〕━━━╯`
      )
      .join('\n\n')

    await conn.sendFile(
      m.chat,
      image,
      'nox_repo.jpg',
      `🌑 *معلومات مستودع GitHub*\n\n${info.trim()}`,
      m
    )

    if (zipBuffer && zipName) {
      await conn.sendFile(
        m.chat,
        zipBuffer,
        zipName,
        null,
        m
      )
    }

    await m.react('✅')

  } catch (e) {

    console.error('[Ｎｏｘ Ｂｏｔ - GITCLONE]', e)

    await m.react('❌')

    await conn.reply(
      m.chat,
      `╭━━━〔 Ｎｏｘ Ｂｏｔ 〕━━━╮
│
│ ❌ حـدث خـطـأ أثـنـاء الـعـمـلـيـة
│
│ 📝 السبب:
│ ${e.message || 'خطأ غير معروف'}
│
│ 💡 إذا استمر الخطأ:
│ استخدم ${usedPrefix}report لإبلاغ المطور.
│
╰━━━〔 Ｎｏｘ Ｂｏｔ 〕━━━╯`,
      m
    )
  }
}

handler.help = ['gitclone']
handler.tags = ['download']
handler.command = ['gitclone']
handler.group = true

export default handler

function formatDate(n, locale = 'ar') {

  const d = new Date(n)

  return d.toLocaleDateString(
    locale,
    {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    }
  )
}