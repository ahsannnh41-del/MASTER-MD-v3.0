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

const _originalSendMessage = conn.sendMessage.bind(conn);

conn.sendMessage = async (jid, content, options = {}) => {
  if (global.rcanal && typeof content === 'object' && content !== null) {
    const hasForward =
      content?.contextInfo?.forwardingScore ||
      content?.contextInfo?.isForwarded ||
      options?.contextInfo?.forwardingScore ||
      options?.contextInfo?.isForwarded;

    if (!hasForward) {
      content = {
        ...content,
        ...global.rcanal,
        contextInfo: {
          ...(global.rcanal?.contextInfo || {}),
          ...(content?.contextInfo || {}),
          ...(options?.contextInfo || {})
        }
      };
    }
  }

  return _originalSendMessage(jid, content, options);
};