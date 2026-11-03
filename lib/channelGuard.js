// ═══════════════════════════════════════════════════════════════════
//  CHANNEL GUARD — id & nama WhatsApp Channel untuk branding forward
// ═══════════════════════════════════════════════════════════════════
//
//  Value-nya sekarang diatur lewat setting.js (channelId & channelName)
//  — checksum integritas yang dulu ada di file ini sudah DILEPAS per
//  permintaan, supaya tinggal edit 2 field itu di setting.js lalu
//  restart bot, tanpa perlu hitung ulang hash apapun.
//
//  File ini dipertahankan (bukan dihapus) supaya index.js & commands/
//  menu.js tidak perlu diubah importnya — cuma jadi jembatan tipis ke
//  setting.js.
// ═══════════════════════════════════════════════════════════════════

import settings from '../setting.js';

const CHANNEL_JID  = settings.channelId;
const CHANNEL_NAME = settings.channelName;

const CHANNEL = Object.freeze({
    jid:  CHANNEL_JID,
    name: CHANNEL_NAME,
});

export default CHANNEL;
export { CHANNEL_JID, CHANNEL_NAME };
