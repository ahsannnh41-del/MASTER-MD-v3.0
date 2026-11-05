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

const codigosArabes = ['+212', '+971', '+20', '+966', '+964', '+963', '+973', '+968', '+974'];
const regexArabe = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
const regexComando = /^[\/!#.]/;

global.advertenciasArabes = global.advertenciasArabes || {};

export async function before(m, { conn, isOwner, isROwner}) {
  try {
    if (
      m.isBaileys ||
      m.isGroup ||
!m.message ||
!m.sender ||
      typeof m.text!== 'string' ||
      isOwner ||
      isROwner
) return false;

    const numero = m.sender;
    const texto = m.text;
    const numeroLimpio = numero.replace(/[^0-9]/g, '');

    const esArabe = regexArabe.test(texto) || codigosArabes.some(pref => numeroLimpio.startsWith(pref.replace('+', '')));
    const esComando = regexComando.test(texto);

    if (esArabe &&!esComando) {
      global.advertenciasArabes[numero] = (global.advertenciasArabes[numero] || 0) + 1;
      const advertencias = global.advertenciasArabes[numero];

      if (advertencias>= 2) {
        await m.reply(`
🚫 *[نظام الحماية: حظر نهائي]*
══════════════════════
📛 الرقم: ${numero}
📄 السبب: إرسال رسالة غير مسموح بها (2/2)

⛔ تم تنفيذ الحظر تلقائيًا.
🔒 الحالة: تم حظر المستخدم.

📌 تم مسح التحذيرات.
══════════════════════`);
        await conn.updateBlockStatus(m.chat, 'block');
        console.log(`[☠️ كيان محظور] ${numero}`);
        delete global.advertenciasArabes[numero];
} else {
        await m.reply(`
⚠️ *[تحذير أول ${advertencias}/2]*
══════════════════════
📄 تم رصد رسالة غير مسموح بها.

📌 مسموح فقط باستخدام أوامر البوت مثل:
*/menu* - */help* - */code* - !info

🚫 في حالة التكرار سيتم حظرك تلقائيًا.
══════════════════════`);
        console.log(`[⚠️ تحذير ${advertencias}/2] ${numero}`);
}

      return false;
}

    return true;

} catch (e) {
    console.error('[❌ خطأ في نظام الحماية]', e);
    return true;
}
}