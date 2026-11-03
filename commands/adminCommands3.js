import { store, save } from '../lib/db.js';
import { jidNum, fmtDuration, parseDurationArg } from '../lib/utils.js';
import { computeSiders } from '../lib/siderTracker.js';
import { recallRealJid } from '../lib/lidMapping.js';

function isAdminCheck(isAdmin, reply) {
    if (isAdmin === undefined || isAdmin === null) {
        reply('❌ Command ini hanya bisa digunakan di dalam *grup*!');
        return false;
    }
    if (!isAdmin) {
        reply('❌ Hanya *admin grup* yang bisa menggunakan command ini!\n\n_Owner/Creator bot tidak dihitung kalau tidak jadi admin di grup ini._');
        return false;
    }
    return true;
}

// Threshold default "berapa lama tidak chat = sider": 3 hari.
// Bisa di-override per pemanggilan lewat ".sider [jumlah][s/m/h/d]",
// contoh ".sider 7d" (7 hari) atau ".sider 12h" (12 jam) — TIDAK
// disimpan permanen, cuma berlaku untuk pengecekan saat itu saja,
// supaya admin bebas coba-coba threshold tanpa mengubah setting grup.
const DEFAULT_SIDER_THRESHOLD_MS = 3 * 24 * 60 * 60 * 1000;

// Resolusi JID @lid -> nomor asli (best-effort) khusus untuk tampilan,
// dengan fallback ke JID @lid mentah kalau memang belum pernah ketahuan
// nomor aslinya (lihat lib/lidMapping.js & utils.js untuk penjelasan
// lengkap soal kenapa @lid butuh penanganan khusus di bot ini).
function displayJid(jid) {
    if (jid.includes('@lid')) {
        const real = recallRealJid(jid);
        if (real) return real;
    }
    return jid;
}

function getPolls(jid) {
    const data = store('groupPolls');
    if (!data[jid]) { data[jid] = []; save('groupPolls'); }
    return data[jid];
}

export const adminCommands3 = {

    // ─── POLLING SEDERHANA (teks) ───────────────────────────────────────────
    async createPoll(reply, jid, args, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const text = args.join(' ');
        if (!text || !text.includes('|')) {
            return reply('📌 Cara pakai: *.poll [pertanyaan] | [opsi1] | [opsi2] | ...*\nContoh: .poll Makan apa? | Nasi | Mie | Roti');
        }
        const [question, ...options] = text.split('|').map(s => s.trim()).filter(Boolean);
        if (options.length < 2) return reply('❌ Minimal 2 opsi diperlukan!');

        const polls = getPolls(jid);
        const poll = { id: polls.length + 1, question, options, votes: {}, createdAt: Date.now() };
        polls.push(poll);
        save('groupPolls');

        const optText = options.map((o, i) => `${i + 1}. ${o}`).join('\n');
        await reply(`📊 *POLLING #${poll.id}*\n\n*${question}*\n\n${optText}\n\nVote dengan: *.vote ${poll.id} [nomor]*`);
    },

    async votePoll(reply, jid, sender, args) {
        const pollId = parseInt(args[0]);
        const choice = parseInt(args[1]);
        if (!pollId || !choice) return reply('📌 Cara pakai: *.vote [id_poll] [nomor_opsi]*');

        const polls = getPolls(jid);
        const poll = polls.find(p => p.id === pollId);
        if (!poll) return reply('❌ Polling dengan ID itu tidak ditemukan.');
        if (choice < 1 || choice > poll.options.length) return reply(`❌ Pilih nomor 1-${poll.options.length}!`);

        poll.votes[sender] = choice;
        save('groupPolls');
        await reply(`✅ Vote kamu untuk *"${poll.options[choice - 1]}"* tercatat!`);
    },

    async pollResult(reply, jid, args) {
        const pollId = parseInt(args[0]);
        if (!pollId) return reply('📌 Cara pakai: *.hasilpoll [id_poll]*');

        const polls = getPolls(jid);
        const poll = polls.find(p => p.id === pollId);
        if (!poll) return reply('❌ Polling dengan ID itu tidak ditemukan.');

        const counts = poll.options.map((_, i) => Object.values(poll.votes).filter(v => v === i + 1).length);
        const total = counts.reduce((a, b) => a + b, 0) || 1;
        const lines = poll.options.map((o, i) => {
            const pct = ((counts[i] / total) * 100).toFixed(0);
            return `${o}: ${counts[i]} suara (${pct}%)`;
        });

        await reply(`📊 *HASIL POLLING #${pollId}*\n\n*${poll.question}*\n\n${lines.join('\n')}\n\nTotal voter: ${Object.keys(poll.votes).length}`);
    },

    async listPolls(reply, jid) {
        const polls = getPolls(jid);
        if (!polls.length) return reply('📋 Belum ada polling di grup ini.');
        const lines = polls.slice(-10).map(p => `#${p.id} — ${p.question}`);
        await reply(`📋 *DAFTAR POLLING (10 terakhir)*\n\n${lines.join('\n')}`);
    },

    // ─── JADWAL GRUP SEDERHANA ───────────────────────────────────────────────
    async addSchedule(reply, jid, args, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const text = args.join(' ');
        if (!text) return reply('📌 Cara pakai: *.addjadwal [teks jadwal/acara]*');

        const data = store('groupSchedule');
        if (!data[jid]) data[jid] = [];
        data[jid].push({ text, ts: Date.now() });
        save('groupSchedule');
        await reply(`✅ Jadwal ditambahkan (#${data[jid].length}).`);
    },

    async listSchedule(reply, jid) {
        const data = store('groupSchedule');
        const items = data[jid] || [];
        if (!items.length) return reply('📅 Belum ada jadwal tersimpan di grup ini.');
        const lines = items.map((it, i) => `${i + 1}. ${it.text}`);
        await reply(`📅 *JADWAL GRUP*\n\n${lines.join('\n')}`);
    },

    async deleteSchedule(reply, jid, args, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const idx = parseInt(args[0]) - 1;
        const data = store('groupSchedule');
        const items = data[jid] || [];
        if (isNaN(idx) || idx < 0 || idx >= items.length) return reply('📌 Cara pakai: *.deljadwal [nomor]*');
        items.splice(idx, 1);
        save('groupSchedule');
        await reply('✅ Jadwal berhasil dihapus.');
    },

    // ─── REPORT / LAPOR KE ADMIN ────────────────────────────────────────────
    async reportToAdmin(reply, jid, sender, args) {
        const text = args.join(' ');
        if (!text) return reply('📌 Cara pakai: *.lapor [isi laporan]*\nLaporan akan disimpan untuk ditinjau admin.');

        const data = store('groupReports');
        if (!data[jid]) data[jid] = [];
        data[jid].push({ from: sender, text, ts: Date.now() });
        save('groupReports');
        await reply('✅ Laporan kamu sudah dicatat. Admin akan meninjau dengan *.listlaporan*.');
    },

    async listReports(reply, jid, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const data = store('groupReports');
        const items = data[jid] || [];
        if (!items.length) return reply('📋 Tidak ada laporan tertunda.');
        const lines = items.slice(-10).map((r, i) => `${i + 1}. @${jidNum(r.from)}: ${r.text}`);
        await reply(`📋 *LAPORAN MEMBER (10 terakhir)*\n\n${lines.join('\n')}`);
    },

    async clearReports(reply, jid, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const data = store('groupReports');
        data[jid] = [];
        save('groupReports');
        await reply('✅ Semua laporan telah dibersihkan.');
    },

    // ─── GROUP STATS RINGKAS ────────────────────────────────────────────────
    async groupActivity(reply, jid) {
        const polls = getPolls(jid);
        const schedules = store('groupSchedule')[jid] || [];
        const reports = store('groupReports')[jid] || [];
        await reply(
`📈 *AKTIVITAS GRUP*

📊 Total Polling: ${polls.length}
📅 Total Jadwal: ${schedules.length}
📋 Laporan Tertunda: ${reports.length}`
        );
    },

    // ─── SIDER — DETEKSI MEMBER YANG GAK PERNAH/JARANG CHAT ─────────────────
    // "Sider" = member yang ada di grup tapi cuma numpang lihat doang, gak
    // pernah ikut ngobrol. Dihitung dengan membandingkan waktu chat terakhir
    // tiap member (dicatat otomatis oleh lib/siderTracker.js setiap ada
    // pesan grup masuk) terhadap daftar participant grup SAAT INI (jadi
    // member yang baru keluar tidak ikut muncul, dan member baru join tidak
    // langsung dicap sider walau belum pernah chat — lihat catatan di bawah).
    async checkSider(sock, reply, jid, args, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;

        let thresholdMs = DEFAULT_SIDER_THRESHOLD_MS;
        if (args[0]) {
            const parsed = parseDurationArg(args[0], 'd');
            if (!parsed) return reply('📌 Format threshold salah. Contoh: *.sider 7d* (7 hari) atau *.sider 12h* (12 jam).');
            thresholdMs = parsed;
        }

        let metadata;
        try {
            metadata = await sock.groupMetadata(jid);
        } catch {
            return reply('❌ Gagal mengambil data member grup. Coba lagi sebentar.');
        }

        const siders = computeSiders(jid, metadata.participants, thresholdMs, true);
        if (!siders.length) {
            return reply(`✅ Tidak ada sider terdeteksi di grup ini *(threshold: ${fmtDuration(thresholdMs)})*.\nSemua member (non-admin) sudah pernah chat dalam rentang waktu itu.`);
        }

        const lines = siders.map((s, i) => {
            const status = s.idleMs === null
                ? 'belum pernah chat sama sekali'
                : `terakhir chat ${fmtDuration(s.idleMs)} lalu`;
            return `${i + 1}. @${jidNum(displayJid(s.id))} — _${status}_`;
        });

        await sock.sendMessage(jid, {
            text:
`👀 *DAFTAR SIDER*
━━━━━━━━━━━━━━━━━━
Threshold tidak aktif : *${fmtDuration(thresholdMs)}*
Jumlah terdeteksi     : *${siders.length} member*
━━━━━━━━━━━━━━━━━━
${lines.join('\n')}
━━━━━━━━━━━━━━━━━━
💡 Admin grup TIDAK dihitung sebagai sider.
⚠️ Member yang baru join dan belum pernah tercatat aktif akan ikut muncul di sini — cek dulu sebelum kick kalau grup baru pasang fitur ini.
👉 Ketik *.kicksider* untuk keluarkan semua sider di atas sekaligus.`,
            mentions: siders.map(s => s.id),
        });
    },

    // ─── KICK SEMUA SIDER SEKALIGUS ──────────────────────────────────────────
    async kickSider(sock, reply, msg, jid, args, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;

        let thresholdMs = DEFAULT_SIDER_THRESHOLD_MS;
        if (args[0]) {
            const parsed = parseDurationArg(args[0], 'd');
            if (!parsed) return reply('📌 Format threshold salah. Contoh: *.kicksider 7d* (7 hari).');
            thresholdMs = parsed;
        }

        let metadata;
        try {
            metadata = await sock.groupMetadata(jid);
        } catch {
            return reply('❌ Gagal mengambil data member grup. Coba lagi sebentar.');
        }

        const siders = computeSiders(jid, metadata.participants, thresholdMs, true);
        if (!siders.length) {
            return reply(`✅ Tidak ada sider untuk di-kick *(threshold: ${fmtDuration(thresholdMs)})*.`);
        }

        await reply(`🔎 Ditemukan *${siders.length}* sider. Mulai proses kick satu per satu...`);

        const results = [];
        for (const s of siders) {
            try {
                await sock.groupParticipantsUpdate(jid, [s.id], 'remove');
                results.push(`👢 @${jidNum(displayJid(s.id))} — dikeluarkan`);
            } catch {
                results.push(`❌ @${jidNum(displayJid(s.id))} — gagal dikeluarkan`);
            }
        }

        await sock.sendMessage(jid, {
            text: `✅ *PROSES KICK SIDER SELESAI*\n━━━━━━━━━━━━━━━━━━\n${results.join('\n')}`,
            mentions: siders.map(s => s.id),
        }, { quoted: msg });
    },
};
