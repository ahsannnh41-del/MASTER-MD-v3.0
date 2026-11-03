// ═══════════════════════════════════════════════════════════════════
//  TOOLSCOMMANDS5.JS — Batch tools besar #2 (math, konversi, algoritma teks)
// ═══════════════════════════════════════════════════════════════════

function levenshteinDistance(a, b) {
    const m = a.length, n = b.length;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            dp[i][j] = a[i - 1] === b[j - 1]
                ? dp[i - 1][j - 1]
                : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        }
    }
    return dp[m][n];
}

function parseNumberList(str) {
    return str.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
}

const PASSPHRASE_WORDS = ['langit','gunung','sungai','matahari','bintang','angin','hutan','lautan','bulan','kilat','ombak','pelangi','kabut','fajar','senja','badai','embun','cahaya','bara','kristal'];

export const toolsCommands5 = {

    // ── ENCODING TAMBAHAN ──────────────────────────────────────────
    async urlEncode(reply, args) {
        const text = args.join(' ');
        if (!text) return reply('📌 Cara pakai: *.urlencode [teks]*');
        await reply(`🔗 Hasil: \`${encodeURIComponent(text)}\``);
    },
    async urlDecode(reply, args) {
        const text = args.join(' ');
        if (!text) return reply('📌 Cara pakai: *.urldecode [teks]*');
        try { await reply(`🔗 Hasil: \`${decodeURIComponent(text)}\``); }
        catch { await reply('❌ Teks tidak valid untuk di-decode.'); }
    },
    async htmlEncode(reply, args) {
        const text = args.join(' ');
        if (!text) return reply('📌 Cara pakai: *.htmlencode [teks]*');
        const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
        await reply(`🌐 Hasil: \`${text.replace(/[&<>"']/g, c => map[c])}\``);
    },
    async htmlDecode(reply, args) {
        const text = args.join(' ');
        if (!text) return reply('📌 Cara pakai: *.htmldecode [teks]*');
        const map = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'" };
        await reply(`🌐 Hasil: \`${text.replace(/&amp;|&lt;|&gt;|&quot;|&#39;/g, m => map[m])}\``);
    },
    async rot47(reply, args) {
        const text = args.join(' ');
        if (!text) return reply('📌 Cara pakai: *.rot47 [teks]*\n(Encrypt & decrypt sama, jalankan 2x buat balik)');
        const result = text.replace(/[!-~]/g, c => String.fromCharCode(33 + (c.charCodeAt(0) + 14) % 94));
        await reply(`🔐 ROT47: \`${result}\``);
    },
    async xorCipher(reply, args) {
        if (args.length < 2) return reply('📌 Cara pakai: *.xorcipher [key] [teks]*\n(Hasil dalam hex, jalankan lagi dgn key sama + hasil hex utk decrypt — lihat .xordekrip)');
        const [key, ...rest] = args;
        const text = rest.join(' ');
        let result = '';
        for (let i = 0; i < text.length; i++) {
            result += (text.charCodeAt(i) ^ key.charCodeAt(i % key.length)).toString(16).padStart(2, '0');
        }
        await reply(`🔐 XOR (hex): \`${result}\``);
    },
    async xorDecrypt(reply, args) {
        if (args.length < 2) return reply('📌 Cara pakai: *.xordekrip [key] [hex]*');
        const [key, hex] = args;
        if (!/^[0-9a-fA-F]+$/.test(hex) || hex.length % 2 !== 0) return reply('❌ Format hex tidak valid.');
        let result = '';
        for (let i = 0; i < hex.length; i += 2) {
            const byte = parseInt(hex.slice(i, i + 2), 16);
            result += String.fromCharCode(byte ^ key.charCodeAt((i / 2) % key.length));
        }
        await reply(`🔓 Hasil: \`${result}\``);
    },

    // ── TEORI BILANGAN ──────────────────────────────────────────────
    async digitalRoot(reply, args) {
        let n = parseInt(args[0], 10);
        if (isNaN(n) || n < 0) return reply('📌 Cara pakai: *.digitalroot [angka]*');
        const original = n;
        while (n >= 10) n = String(n).split('').reduce((s, d) => s + Number(d), 0);
        await reply(`🔢 Digital root dari ${original}: *${n}*`);
    },
    async collatzLength(reply, args) {
        let n = parseInt(args[0], 10);
        if (isNaN(n) || n < 1) return reply('📌 Cara pakai: *.collatz [angka positif]*');
        if (n > 10_000_000) return reply('❌ Angka terlalu besar.');
        const original = n; let steps = 0;
        while (n !== 1 && steps < 100000) { n = n % 2 === 0 ? n / 2 : 3 * n + 1; steps++; }
        await reply(`🔢 Collatz sequence dari ${original}: *${steps} langkah* sampai mencapai 1`);
    },
    async perfectNumberCheck(reply, args) {
        const n = parseInt(args[0], 10);
        if (isNaN(n) || n < 1) return reply('📌 Cara pakai: *.perfectnumber [angka]*\n(Angka yang sama dengan jumlah pembagi propernya, ex: 6 = 1+2+3)');
        if (n > 100_000_000) return reply('❌ Angka terlalu besar untuk dicek.');
        let sum = 0;
        for (let i = 1; i < n; i++) if (n % i === 0) sum += i;
        await reply(`🔢 ${n} ${sum === n ? 'ADALAH' : 'BUKAN'} perfect number.\n_(Jumlah pembagi proper: ${sum})_`);
    },
    async popCount(reply, args) {
        const n = parseInt(args[0], 10);
        if (isNaN(n) || n < 0) return reply('📌 Cara pakai: *.popcount [angka]*\n(Hitung jumlah bit 1 di representasi binernya)');
        const binary = n.toString(2);
        const count = binary.split('').filter(b => b === '1').length;
        await reply(`🔢 ${n} = ${binary} (biner)\nJumlah bit 1: *${count}*`);
    },
    async binaryOps(reply, args) {
        const [a, op, b] = args;
        const na = parseInt(a, 10), nb = parseInt(b, 10);
        if (isNaN(na) || isNaN(nb) || !['and', 'or', 'xor'].includes((op || '').toLowerCase())) {
            return reply('📌 Cara pakai: *.binaryops [a] [and/or/xor] [b]*\nContoh: `.binaryops 12 and 10`');
        }
        const ops = { and: na & nb, or: na | nb, xor: na ^ nb };
        const result = ops[op.toLowerCase()];
        await reply(`🔢 ${na} (${na.toString(2)}) ${op.toUpperCase()} ${nb} (${nb.toString(2)})\n= *${result}* (${result.toString(2)})`);
    },

    // ── GEOMETRI ─────────────────────────────────────────────────────
    async circleCalc(reply, args) {
        const r = parseFloat(args[0]);
        if (isNaN(r) || r <= 0) return reply('📌 Cara pakai: *.circlearea [radius]*');
        await reply(`⭕ Radius: ${r}\nLuas: *${(Math.PI * r * r).toFixed(2)}*\nKeliling: *${(2 * Math.PI * r).toFixed(2)}*`);
    },
    async triangleHeron(reply, args) {
        const [a, b, c] = args.map(Number);
        if ([a, b, c].some(n => isNaN(n) || n <= 0) || a + b <= c || b + c <= a || a + c <= b) {
            return reply('📌 Cara pakai: *.triangleheron [sisi_a] [sisi_b] [sisi_c]*\n(Ketiga sisi harus membentuk segitiga valid)');
        }
        const s = (a + b + c) / 2;
        const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
        await reply(`📐 Segitiga sisi ${a}, ${b}, ${c}\nLuas (Heron): *${area.toFixed(2)}*\nKeliling: *${(a + b + c).toFixed(2)}*`);
    },
    async rectCalc(reply, args) {
        const [p, l] = args.map(Number);
        if (isNaN(p) || isNaN(l) || p <= 0 || l <= 0) return reply('📌 Cara pakai: *.rectarea [panjang] [lebar]*');
        await reply(`▭ Panjang: ${p}, Lebar: ${l}\nLuas: *${(p * l).toFixed(2)}*\nKeliling: *${(2 * (p + l)).toFixed(2)}*`);
    },
    async sphereCalc(reply, args) {
        const r = parseFloat(args[0]);
        if (isNaN(r) || r <= 0) return reply('📌 Cara pakai: *.spherevolume [radius]*');
        const volume = (4 / 3) * Math.PI * r ** 3;
        const surface = 4 * Math.PI * r ** 2;
        await reply(`🌐 Radius: ${r}\nVolume: *${volume.toFixed(2)}*\nLuas permukaan: *${surface.toFixed(2)}*`);
    },

    // ── STATISTIK ────────────────────────────────────────────────────
    async stdDeviation(reply, args) {
        const nums = parseNumberList(args.join(' '));
        if (nums.length < 2) return reply('📌 Cara pakai: *.stdev [n1,n2,n3,...]*\nContoh: `.stdev 2,4,4,4,5,5,7,9`');
        const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
        const variance = nums.reduce((s, n) => s + (n - mean) ** 2, 0) / nums.length;
        await reply(`📊 Data: ${nums.length} angka\nRata-rata: *${mean.toFixed(2)}*\nVarians: *${variance.toFixed(2)}*\nStandar Deviasi: *${Math.sqrt(variance).toFixed(2)}*`);
    },
    async statMode(reply, args) {
        const nums = parseNumberList(args.join(' '));
        if (!nums.length) return reply('📌 Cara pakai: *.mode [n1,n2,n3,...]*');
        const freq = {};
        nums.forEach(n => { freq[n] = (freq[n] || 0) + 1; });
        const maxFreq = Math.max(...Object.values(freq));
        const modes = Object.keys(freq).filter(k => freq[k] === maxFreq);
        await reply(`📊 Modus: *${modes.join(', ')}*\n_(muncul ${maxFreq}x)_`);
    },

    // ── FINANSIAL ────────────────────────────────────────────────────
    async compoundInterest(reply, args) {
        const [pokok, rate, tahun] = args.map(Number);
        if ([pokok, rate, tahun].some(n => isNaN(n)) || pokok <= 0 || tahun <= 0) {
            return reply('📌 Cara pakai: *.compoundinterest [pokok] [rate%/tahun] [tahun]*\nContoh: `.compoundinterest 1000000 5 10`');
        }
        const result = pokok * Math.pow(1 + rate / 100, tahun);
        await reply(`💰 *Bunga Majemuk*\n\nPokok: ${pokok.toLocaleString('id-ID')}\nRate: ${rate}%/tahun selama ${tahun} tahun\n\nHasil akhir: *${Math.round(result).toLocaleString('id-ID')}*\nTotal bunga: *${Math.round(result - pokok).toLocaleString('id-ID')}*`);
    },
    async simpleInterest(reply, args) {
        const [pokok, rate, tahun] = args.map(Number);
        if ([pokok, rate, tahun].some(n => isNaN(n)) || pokok <= 0 || tahun <= 0) {
            return reply('📌 Cara pakai: *.simpleinterest [pokok] [rate%/tahun] [tahun]*');
        }
        const bunga = pokok * (rate / 100) * tahun;
        await reply(`💰 *Bunga Sederhana*\n\nPokok: ${pokok.toLocaleString('id-ID')}\nBunga total: *${Math.round(bunga).toLocaleString('id-ID')}*\nHasil akhir: *${Math.round(pokok + bunga).toLocaleString('id-ID')}*`);
    },
    async loanPayment(reply, args) {
        const [pokok, rateTahunan, bulan] = args.map(Number);
        if ([pokok, rateTahunan, bulan].some(n => isNaN(n)) || pokok <= 0 || bulan <= 0) {
            return reply('📌 Cara pakai: *.loanpayment [pokok] [rate%/tahun] [tenor_bulan]*\nContoh: `.loanpayment 100000000 8 24`');
        }
        const rateBulanan = rateTahunan / 100 / 12;
        const payment = rateBulanan === 0
            ? pokok / bulan
            : (pokok * rateBulanan * Math.pow(1 + rateBulanan, bulan)) / (Math.pow(1 + rateBulanan, bulan) - 1);
        await reply(`🏦 *Simulasi Cicilan*\n\nPokok: ${pokok.toLocaleString('id-ID')}\nTenor: ${bulan} bulan @ ${rateTahunan}%/tahun\n\nCicilan/bulan: *${Math.round(payment).toLocaleString('id-ID')}*\nTotal bayar: *${Math.round(payment * bulan).toLocaleString('id-ID')}*\n\n_Simulasi kasar, bukan pengganti simulasi resmi bank/lembaga finansial._`);
    },
    async roiCalc(reply, args) {
        const [modal, untung] = args.map(Number);
        if (isNaN(modal) || isNaN(untung) || modal <= 0) return reply('📌 Cara pakai: *.roi [modal] [untung_bersih]*');
        const roi = (untung / modal) * 100;
        await reply(`📈 *ROI*\n\nModal: ${modal.toLocaleString('id-ID')}\nUntung: ${untung.toLocaleString('id-ID')}\n\nROI: *${roi.toFixed(2)}%*`);
    },

    // ── TANGGAL TAMBAHAN ─────────────────────────────────────────────
    async businessDaysBetween(reply, args) {
        const [d1, d2] = args;
        const date1 = new Date(d1), date2 = new Date(d2);
        if (!d1 || !d2 || isNaN(date1) || isNaN(date2)) {
            return reply('📌 Cara pakai: *.businessdays [YYYY-MM-DD] [YYYY-MM-DD]*');
        }
        let count = 0;
        const cur = new Date(Math.min(date1, date2));
        const end = new Date(Math.max(date1, date2));
        while (cur <= end) {
            const day = cur.getDay();
            if (day !== 0 && day !== 6) count++;
            cur.setDate(cur.getDate() + 1);
        }
        await reply(`📅 Hari kerja (Senin-Jumat) antara ${d1} dan ${d2}: *${count} hari*`);
    },
    async weekNumber(reply, args) {
        const date = args[0] ? new Date(args[0]) : new Date();
        if (isNaN(date)) return reply('📌 Cara pakai: *.weeknumber [YYYY-MM-DD]* (kosongkan untuk hari ini)');
        const target = new Date(date.valueOf());
        target.setDate(target.getDate() + 3 - ((target.getDay() + 6) % 7));
        const week1 = new Date(target.getFullYear(), 0, 4);
        const weekNo = 1 + Math.round(((target - week1) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
        await reply(`📅 ${date.toISOString().slice(0, 10)} adalah minggu ke-*${weekNo}* tahun ${target.getFullYear()}`);
    },
    async quarterOf(reply, args) {
        const date = args[0] ? new Date(args[0]) : new Date();
        if (isNaN(date)) return reply('📌 Cara pakai: *.quarter [YYYY-MM-DD]* (kosongkan untuk hari ini)');
        const q = Math.floor(date.getMonth() / 3) + 1;
        await reply(`📅 ${date.toISOString().slice(0, 10)} ada di *Q${q} ${date.getFullYear()}*`);
    },

    // ── ALGORITMA TEKS ───────────────────────────────────────────────
    async levenshtein(reply, args) {
        const text = args.join(' ');
        const [a, b] = text.split('|').map(s => s.trim());
        if (!a || !b) return reply('📌 Cara pakai: *.levenshtein [kata1] | [kata2]*\nContoh: `.levenshtein kitten | sitting`');
        const dist = levenshteinDistance(a, b);
        await reply(`🔤 Edit distance "${a}" ↔ "${b}": *${dist}*\n_(jumlah minimum ubah/tambah/hapus karakter)_`);
    },
    async passphrase(reply, args) {
        const n = Math.min(Math.max(parseInt(args[0], 10) || 4, 3), 8);
        const words = [];
        for (let i = 0; i < n; i++) words.push(PASSPHRASE_WORDS[Math.floor(Math.random() * PASSPHRASE_WORDS.length)]);
        const passphrase = words.join('-') + '-' + Math.floor(Math.random() * 90 + 10);
        await reply(`🔑 *Passphrase (${n} kata)*\n\n\`${passphrase}\`\n\n_Lebih gampang diingat dari password acak, tetap kuat karena panjang._`);
    },
    async acronymGenerate(reply, args) {
        const text = args.join(' ');
        if (!text) return reply('📌 Cara pakai: *.acronym [frasa panjang]*\nContoh: `.acronym Work From Home`');
        const acronym = text.split(/\s+/).map(w => w[0]?.toUpperCase()).join('');
        await reply(`🔤 Akronim: *${acronym}*`);
    },
    async listUnique(reply, args) {
        const items = args.join(' ').split(',').map(s => s.trim()).filter(Boolean);
        if (!items.length) return reply('📌 Cara pakai: *.listunique a,b,a,c,b*');
        const unique = [...new Set(items)];
        await reply(`📋 Unik (${unique.length}/${items.length}): ${unique.join(', ')}`);
    },
    async listIntersect(reply, args) {
        const [l1, l2] = args.join(' ').split('|');
        if (!l1 || !l2) return reply('📌 Cara pakai: *.listintersect a,b,c | b,c,d*');
        const set1 = new Set(l1.split(',').map(s => s.trim()));
        const set2 = new Set(l2.split(',').map(s => s.trim()));
        const result = [...set1].filter(x => set2.has(x));
        await reply(result.length ? `📋 Irisan: ${result.join(', ')}` : '📋 Tidak ada irisan.');
    },
    async listDiff(reply, args) {
        const [l1, l2] = args.join(' ').split('|');
        if (!l1 || !l2) return reply('📌 Cara pakai: *.listdiff a,b,c | b,c,d*\n(Item di list 1 yang TIDAK ada di list 2)');
        const set2 = new Set(l2.split(',').map(s => s.trim()));
        const result = l1.split(',').map(s => s.trim()).filter(x => !set2.has(x));
        await reply(result.length ? `📋 Selisih: ${result.join(', ')}` : '📋 Tidak ada selisih.');
    },

    // ── KONVERSI TAMBAHAN ────────────────────────────────────────────
    async windChill(reply, args) {
        const [temp, wind] = args.map(Number);
        if (isNaN(temp) || isNaN(wind) || wind < 0) return reply('📌 Cara pakai: *.windchill [suhu°C] [kecepatan_angin_kmh]*');
        if (temp > 10 || wind < 4.8) return reply('ℹ️ Wind chill cuma relevan untuk suhu ≤10°C dan angin ≥4.8 km/j.');
        const wc = 13.12 + 0.6215 * temp - 11.37 * Math.pow(wind, 0.16) + 0.3965 * temp * Math.pow(wind, 0.16);
        await reply(`🌬️ Suhu terasa (wind chill): *${wc.toFixed(1)}°C*\n_(Suhu asli ${temp}°C, angin ${wind} km/j)_`);
    },
    async heatIndex(reply, args) {
        const [temp, humidity] = args.map(Number);
        if (isNaN(temp) || isNaN(humidity) || humidity < 0 || humidity > 100) return reply('📌 Cara pakai: *.heatindex [suhu°C] [kelembapan%]*');
        const tempF = temp * 9 / 5 + 32;
        const hi = -42.379 + 2.049 * tempF + 10.143 * humidity - 0.225 * tempF * humidity
            - 0.006838 * tempF ** 2 - 0.05482 * humidity ** 2 + 0.001229 * tempF ** 2 * humidity
            + 0.000853 * tempF * humidity ** 2 - 0.00000199 * tempF ** 2 * humidity ** 2;
        const hiC = (hi - 32) * 5 / 9;
        await reply(`🥵 Suhu terasa (heat index): *${hiC.toFixed(1)}°C*\n_(Suhu asli ${temp}°C, kelembapan ${humidity}%)_`);
    },
    async angleConvert(reply, args) {
        const val = parseFloat(args[0]);
        const mode = (args[1] || '').toLowerCase();
        if (isNaN(val) || !['deg2rad', 'rad2deg'].includes(mode)) {
            return reply('📌 Cara pakai: *.angleconvert [nilai] [deg2rad/rad2deg]*');
        }
        const result = mode === 'deg2rad' ? val * (Math.PI / 180) : val * (180 / Math.PI);
        await reply(`📐 ${val} → *${result.toFixed(4)}* (${mode === 'deg2rad' ? 'radian' : 'derajat'})`);
    },
    async cmykToRgb(reply, args) {
        const parts = args.join(' ').split(',').map(Number);
        if (parts.length !== 4 || parts.some(n => isNaN(n) || n < 0 || n > 100)) {
            return reply('📌 Cara pakai: *.cmyk2rgb [c,m,y,k]* (nilai 0-100)\nContoh: `.cmyk2rgb 0,50,100,0`');
        }
        const [c, m, y, k] = parts.map(n => n / 100);
        const r = Math.round(255 * (1 - c) * (1 - k));
        const g = Math.round(255 * (1 - m) * (1 - k));
        const b = Math.round(255 * (1 - y) * (1 - k));
        const hex = '#' + [r, g, b].map(n => n.toString(16).padStart(2, '0')).join('').toUpperCase();
        await reply(`🎨 CMYK(${parts.join(', ')}) →\nRGB(${r}, ${g}, ${b})\nHex: ${hex}`);
    },
};
