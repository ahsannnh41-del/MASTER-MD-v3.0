// ═══════════════════════════════════════════════════════════════════
//  REPLYDELAY.JS — Override delay balasan bot (.delay), file terpisah
// ═══════════════════════════════════════════════════════════════════
//  SENGAJA dipisah dari lib/messagePipeline.js: messagePipeline.js
//  sudah import dari commands/index.js (handleCommand dkk), jadi kalau
//  fungsi ini didefinisikan di messagePipeline.js lalu commands/index.js
//  butuh import balik dari situ juga, itu jadi circular import antara
//  dua file yang sama-sama besar — berisiko subtle bug. File kecil
//  terpisah ini bisa diimport dari DUA arah dengan aman.

import { store, save } from './db.js';

function replyDelayStore() { return store('botConfig', {}); }

export function getReplyDelayOverride() {
    const val = replyDelayStore().replyDelaySeconds;
    return typeof val === 'number' ? val : null;
}

export function setReplyDelayOverride(seconds) {
    const data = replyDelayStore();
    data.replyDelaySeconds = seconds;
    save('botConfig');
}
