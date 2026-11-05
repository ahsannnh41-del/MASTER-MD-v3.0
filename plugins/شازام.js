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

import acrcloud from 'acrcloud';
import ytSearch from 'yt-search';

let acr = new acrcloud({
  host: 'identify-eu-west-1.acrcloud.com',
  access_key: 'c33c767d683f78bd17d4bd4991955d81',
  access_secret: 'bvgaIAEtADBTbLwiPGYlxupWqkNGIjT7J9Ag2vIu'
});

let handler = async (m, { conn, usedPrefix, command }) => {
  try {
    const q = m.quoted ? m.quoted : m;
    const mime = (q.msg || q).mimetype || q.mediaType || '';

    if (!/video|audio/.test(mime)) {
      return conn.sendMessage(
        m.chat,
        {
          text: `╭━━━〔 🎵 تـحـديـد الـمـوسـيـقـى 〕━━━╮

│ ❒ قم بالرد على مقطع صوتي أو فيديو قصير
│ ❒ ثم استخدم الأمر:
│   ${usedPrefix + command}
│
│ مثال:
│   ${usedPrefix + command} ← بالرد على المقطع

╰━━━━━━━━━━━━━━━━━━━━━━╯`,
          ...rcanal
        },
        { quoted: m }
      );
    }

    await conn.sendMessage(
      m.chat,
      {
        text: '⏳ جاري تحليل المقطع والتعرف على الأغنية...',
        ...rcanal
      },
      { quoted: m }
    );

    const buffer = await q.download();

    if (!buffer) {
      throw new Error('تعذر تحميل المقطع.');
    }

    const { status, metadata } = await acr.identify(buffer);

    if (status.code !== 0) {
      throw new Error(status.msg || 'لم أتمكن من التعرف على الأغنية.');
    }

    if (!metadata?.music?.length) {
      throw new Error('لم يتم العثور على معلومات الأغنية.');
    }

    const music = metadata.music[0];

    const title = music.title || 'غير متوفر';

    const artists =
      music.artists?.map(v => v.name).join(', ') ||
      'غير معروف';

    const album =
      music.album?.name ||
      'غير متوفر';

    const genres =
      music.genres?.map(v => v.name).join(', ') ||
      'غير محدد';

    const releaseDate =
      music.release_date ||
      'غير مسجل';

    
    let youtubeUrl = null;
    let youtubeTitle = null;

    try {
      const search = await ytSearch(`${title} ${artists}`);

      if (search?.videos?.length) {
        const video = search.videos[0];

        youtubeUrl = video.url;
        youtubeTitle = video.title;
      }
    } catch (error) {
      console.log('YouTube Search Error:', error);
    }

    let txt = `╭━━━〔 🎵 تـحـديـد الـمـوسـيـقـى 〕━━━╮

│ 🎼 الـعـنـوان
│ ❯ ${title}

│ 🎤 الـفـنـان
│ ❯ ${artists}

│ 💿 الألـبـوم
│ ❯ ${album}

│ 🎧 الـنـوع
│ ❯ ${genres}

│ 📅 تـاريـخ الإصـدار
│ ❯ ${releaseDate}`;

    if (youtubeUrl) {
      txt += `

│ ▶️ مـشـاهـدة عـلـى يـوتـيـوب
│ ❯ ${youtubeUrl}`;
    } else {
      txt += `

│ ⚠️ لم يتم العثور على رابط يوتيوب`;
    }

    txt += `

╰━━━━━━━━━━━━━━━━━━━━━━╯`;

    await conn.sendMessage(
      m.chat,
      {
        text: txt,
        ...rcanal
      },
      { quoted: m }
    );

  } catch (error) {
    console.error('Shazam Error:', error);

    await conn.sendMessage(
      m.chat,
      {
        text: `╭━━━〔 ⚠️ خـطـأ 〕━━━╮

│ ❒ تعذر التعرف على الموسيقى.
│
│ ❒ السبب:
│   ${error?.message || 'خطأ غير معروف'}

╰━━━━━━━━━━━━━━━━━━━━━━╯`,
        ...rcanal
      },
      { quoted: m }
    );
  }
};

handler.help = ['شازام'];
handler.tags = ['herramientas'];
handler.command = ['شازام', 'كشف-موسيقى'];


export default handler;