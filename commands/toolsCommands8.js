// ═══════════════════════════════════════════════════════════════════
//  TOOLSCOMMANDS8.JS — Batch tools #5
// ═══════════════════════════════════════════════════════════════════

const ZODIAC_ELEMENT = {
    aries: 'api', leo: 'api', sagitarius: 'api',
    taurus: 'tanah', virgo: 'tanah', capricorn: 'tanah',
    gemini: 'udara', libra: 'udara', aquarius: 'udara',
    cancer: 'air', scorpio: 'air', pisces: 'air',
};

const MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
function isLeapYear(y) { return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0; }

export const toolsCommands8 = {
    // ── EKSTRAKSI TEKS ───────────────────────────────────────────────
    async removePunctuation(reply, args) {
        const text = args.join(' ');
        if (!text) return reply('📌 Cara pakai: *.removepunctuation [teks]*');
        await reply(`✂️ Hasil: ${text.replace(/[^\w\s]/g, '')}`);
    },
    async extractNumbers(reply, args) {
        const text = args.join(' ');
        if (!text) return reply('📌 Cara pakai: *.extractnumbers [teks]*');
        const found = text.match(/\d+/g);
        await reply(found ? `🔢 Angka ditemukan: ${found.join(', ')}` : '🔢 Tidak ada angka dalam teks.');
    },
    async extractEmails(reply, args) {
        const text = args.join(' ');
        if (!text) return reply('📌 Cara pakai: *.extractemails [teks]*');
        const found = text.match(/[\w.+-]+@[\w-]+\.[\w.-]+/g);
        await reply(found ? `📧 Email ditemukan:\n${found.join('\n')}` : '📧 Tidak ada email dalam teks.');
    },
    async extractUrls(reply, args) {
        const text = args.join(' ');
        if (!text) return reply('📌 Cara pakai: *.extracturls [teks]*');
        const found = text.match(/https?:\/\/[^\s]+/g);
        await reply(found ? `🔗 URL ditemukan:\n${found.join('\n')}` : '🔗 Tidak ada URL dalam teks.');
    },
    async wordWrap(reply, args) {
        const width = parseInt(args[args.length - 1], 10);
        const text = isNaN(width) ? args.join(' ') : args.slice(0, -1).join(' ');
        const w = isNaN(width) ? 30 : width;
        if (!text) return reply('📌 Cara pakai: *.wordwrap [teks] [lebar_opsional]*');
        const words = text.split(' ');
        let lines = [], current = '';
        for (const word of words) {
            if ((current + ' ' + word).trim().length > w) { lines.push(current.trim()); current = word; }
            else current += ' ' + word;
        }
        if (current) lines.push(current.trim());
        await reply(`📄 *Word wrap (lebar ${w}):*\n\n\`\`\`${lines.join('\n')}\`\`\``);
    },

    // ── FINANSIAL TAMBAHAN ───────────────────────────────────────────
    async taxCalc(reply, args) {
        const [harga, persen] = args.map(Number);
        if (isNaN(harga) || isNaN(persen)) return reply('📌 Cara pakai: *.tax [harga] [persen_pajak]*');
        const pajak = harga * (persen / 100);
        await reply(`💰 Harga: ${harga.toLocaleString('id-ID')}\nPajak (${persen}%): ${Math.round(pajak).toLocaleString('id-ID')}\nTotal: *${Math.round(harga + pajak).toLocaleString('id-ID')}*`);
    },
    async taxRemove(reply, args) {
        const [totalHarga, persen] = args.map(Number);
        if (isNaN(totalHarga) || isNaN(persen)) return reply('📌 Cara pakai: *.taxremove [harga_termasuk_pajak] [persen_pajak]*');
        const hargaAsli = totalHarga / (1 + persen / 100);
        await reply(`💰 Total: ${totalHarga.toLocaleString('id-ID')}\nHarga asli (sebelum pajak ${persen}%): *${Math.round(hargaAsli).toLocaleString('id-ID')}*\nPajak: ${Math.round(totalHarga - hargaAsli).toLocaleString('id-ID')}`);
    },
    async discountStack(reply, args) {
        const harga = parseFloat(args[0]);
        const discounts = args.slice(1).map(Number);
        if (isNaN(harga) || !discounts.length || discounts.some(isNaN)) {
            return reply('📌 Cara pakai: *.discountstack [harga] [diskon1%] [diskon2%] ...*\nContoh: `.discountstack 200000 20 10`\n(Diskon berlapis, bukan dijumlah)');
        }
        let hasil = harga;
        discounts.forEach(d => { hasil -= hasil * (d / 100); });
        const totalPersen = ((harga - hasil) / harga * 100).toFixed(1);
        await reply(`💰 Harga awal: ${harga.toLocaleString('id-ID')}\nSetelah diskon ${discounts.join('% + ')}%:\nHarga akhir: *${Math.round(hasil).toLocaleString('id-ID')}*\n_(setara diskon tunggal ${totalPersen}%)_`);
    },
    async retirementCountdown(reply, args) {
        const [umurSekarang, umurPensiun] = args.map(Number);
        if (isNaN(umurSekarang) || isNaN(umurPensiun) || umurPensiun <= umurSekarang) {
            return reply('📌 Cara pakai: *.retirement [umur_sekarang] [target_umur_pensiun]*');
        }
        const tahun = umurPensiun - umurSekarang;
        await reply(`🏖️ ${tahun} tahun lagi menuju usia pensiun (${umurPensiun} tahun).\n_(${(tahun * 12).toLocaleString('id-ID')} bulan dari sekarang)_`);
    },

    // ── INFO KESEHATAN DASAR (informasional, bukan saran medis) ──────
    async bmrCalc(reply, args) {
        const [berat, tinggi, umur, gender] = args;
        const w = parseFloat(berat), h = parseFloat(tinggi), a = parseFloat(umur);
        const g = (gender || '').toLowerCase();
        if ([w, h, a].some(isNaN) || !['l', 'p'].includes(g)) {
            return reply('📌 Cara pakai: *.bmr [berat_kg] [tinggi_cm] [umur] [L/P]*\nContoh: `.bmr 65 170 25 L`\n\n_Estimasi kasar (rumus Mifflin-St Jeor), bukan pengganti saran ahli gizi._');
        }
        const bmr = g === 'l'
            ? 10 * w + 6.25 * h - 5 * a + 5
            : 10 * w + 6.25 * h - 5 * a - 161;
        await reply(`🔥 Estimasi BMR (kalori basal/hari): *${Math.round(bmr).toLocaleString('id-ID')} kkal*\n\n_Ini kebutuhan kalori tubuh saat istirahat total, belum termasuk aktivitas harian. Sekadar informasi umum, bukan saran medis._`);
    },
    async idealWeightRange(reply, args) {
        const h = parseFloat(args[0]);
        if (isNaN(h) || h < 100 || h > 250) return reply('📌 Cara pakai: *.idealweight [tinggi_cm]*');
        const hM = h / 100;
        const low = (18.5 * hM * hM).toFixed(1);
        const high = (24.9 * hM * hM).toFixed(1);
        await reply(`⚖️ Untuk tinggi ${h}cm, rentang berat badan dengan BMI normal (18.5-24.9):\n*${low} kg – ${high} kg*\n\n_Sekadar estimasi umum berbasis BMI, bukan saran medis personal._`);
    },
    async waterIntake(reply, args) {
        const w = parseFloat(args[0]);
        if (isNaN(w) || w <= 0) return reply('📌 Cara pakai: *.waterintake [berat_kg]*');
        const liters = (w * 0.033).toFixed(1);
        await reply(`💧 Estimasi kebutuhan air harian: *~${liters} liter*\n_(rumus umum 33ml/kg berat badan — sesuaikan dengan aktivitas, cuaca, dan kondisi kesehatanmu.)_`);
    },

    // ── LAIN-LAIN ────────────────────────────────────────────────────
    async timeConvert(reply, args) {
        let seconds = parseInt(args[0], 10);
        if (isNaN(seconds) || seconds < 0) return reply('📌 Cara pakai: *.timeconvert [detik]*');
        const days = Math.floor(seconds / 86400); seconds %= 86400;
        const hours = Math.floor(seconds / 3600); seconds %= 3600;
        const minutes = Math.floor(seconds / 60); seconds %= 60;
        await reply(`⏱️ = *${days}h ${hours}j ${minutes}m ${seconds}d*`);
    },
    async numeralSystem(reply, args) {
        const [numStr, fromBase, toBase] = args;
        const bases = { bin: 2, oct: 8, dec: 10, hex: 16 };
        if (!numStr || !bases[fromBase] || !bases[toBase]) {
            return reply('📌 Cara pakai: *.numeralsystem [angka] [dari] [ke]*\nBasis: bin, oct, dec, hex\nContoh: `.numeralsystem 1010 bin dec`');
        }
        const decimal = parseInt(numStr, bases[fromBase]);
        if (isNaN(decimal)) return reply('❌ Angka tidak valid untuk basis tersebut.');
        await reply(`🔢 ${numStr} (${fromBase}) = *${decimal.toString(bases[toBase]).toUpperCase()}* (${toBase})`);
    },
    async leapYearList(reply, args) {
        const [start, end] = args.map(Number);
        if (isNaN(start) || isNaN(end) || end - start > 100 || end < start) {
            return reply('📌 Cara pakai: *.leapyearlist [tahun_awal] [tahun_akhir]*\n(Rentang maks 100 tahun)');
        }
        const leaps = [];
        for (let y = start; y <= end; y++) if (isLeapYear(y)) leaps.push(y);
        await reply(`📅 Tahun kabisat ${start}-${end} (${leaps.length}):\n${leaps.join(', ') || '(tidak ada)'}`);
    },
    async daysInMonth(reply, args) {
        const [month, year] = args.map(Number);
        if (isNaN(month) || month < 1 || month > 12) return reply('📌 Cara pakai: *.daysinmonth [bulan_1-12] [tahun_opsional]*');
        const y = isNaN(year) ? new Date().getFullYear() : year;
        const days = month === 2 && isLeapYear(y) ? 29 : MONTH_DAYS[month - 1];
        await reply(`📅 Bulan ${month}/${y} punya *${days} hari*`);
    },
    async zodiacCompat(reply, args) {
        const z1 = (args[0] || '').toLowerCase();
        const z2 = (args[1] || '').toLowerCase();
        if (!ZODIAC_ELEMENT[z1] || !ZODIAC_ELEMENT[z2]) {
            return reply('📌 Cara pakai: *.zodiaccompat [zodiak1] [zodiak2]*\nContoh: `.zodiaccompat leo aquarius`\n_Cuma untuk hiburan, ya!_');
        }
        const e1 = ZODIAC_ELEMENT[z1], e2 = ZODIAC_ELEMENT[z2];
        const compatible = { api: ['api', 'udara'], udara: ['udara', 'api'], tanah: ['tanah', 'air'], air: ['air', 'tanah'] };
        const match = compatible[e1].includes(e2);
        await reply(`💫 ${args[0]} (${e1}) & ${args[1]} (${e2})\n\n${match ? '✅ Elemen cocok, biasanya cocok satu sama lain!' : '⚡ Elemen beda, butuh usaha ekstra buat nyambung.'}\n\n_Sekadar hiburan, bukan patokan serius ya!_`);
    },
};
