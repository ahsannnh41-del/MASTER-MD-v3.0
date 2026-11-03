// ═══════════════════════════════════════════════════════════════════
//  TOOLSCOMMANDS12.JS — Batch tools #9 (fisika, matematika, konverter)
//  v3.2.0 — ditambahkan bareng fitur Anti-NSFW untuk menggenapkan total
//  command bot ini.
// ═══════════════════════════════════════════════════════════════════

const G_GRAVITASI = 9.8;                 // percepatan gravitasi bumi (m/s²)
const G_UNIVERSAL = 6.674e-11;           // konstanta gravitasi universal

function toNum(x) { const n = Number(x); return Number.isFinite(n) ? n : null; }

function parseMatrix2x2(str) {
    const parts = (str || '').split(',').map(s => toNum(s.trim()));
    if (parts.length !== 4 || parts.some(n => n === null)) return null;
    return [[parts[0], parts[1]], [parts[2], parts[3]]];
}
function fmtMatrix(m) {
    return `[ ${m[0][0]}  ${m[0][1]} ]\n[ ${m[1][0]}  ${m[1][1]} ]`;
}

export const toolsCommands12 = {

    // ── FISIKA ────────────────────────────────────────────────────────
    async ohmLaw(reply, args) {
        if (args.length !== 3) {
            return reply('📌 Cara pakai: *.ohm [tegangan(V)] [arus(I)] [resistansi(R)]*\n\nIsi tepat SATU nilai dengan tanda "?" (yang mau dicari), sisanya angka.\nContoh: `.ohm 12 ? 4` → mencari arus (I) dari V=12 volt, R=4 ohm.');
        }
        const raw = args;
        const unknownIdx = raw.findIndex(x => x === '?');
        if (unknownIdx === -1 || raw.filter(x => x === '?').length !== 1) {
            return reply('📌 Isi tepat SATU nilai dengan tanda "?" (yang mau dicari), dua lainnya harus angka.\nContoh: `.ohm 12 ? 4`');
        }
        const [vRaw, iRaw, rRaw] = raw;
        const v = vRaw === '?' ? null : toNum(vRaw);
        const i = iRaw === '?' ? null : toNum(iRaw);
        const r = rRaw === '?' ? null : toNum(rRaw);
        if ((v === null && vRaw !== '?') || (i === null && iRaw !== '?') || (r === null && rRaw !== '?')) {
            return reply('❌ Nilai yang bukan "?" harus berupa angka.');
        }

        let hasil, label;
        if (unknownIdx === 0) { if (!i || !r) return reply('❌ I dan R tidak boleh 0.'); hasil = i * r; label = `Tegangan (V) = I × R = ${i} × ${r}`; }
        else if (unknownIdx === 1) { if (!r) return reply('❌ R tidak boleh 0.'); hasil = v / r; label = `Arus (I) = V ÷ R = ${v} ÷ ${r}`; }
        else { if (!i) return reply('❌ I tidak boleh 0.'); hasil = v / i; label = `Resistansi (R) = V ÷ I = ${v} ÷ ${i}`; }

        const satuan = ['Volt (V)', 'Ampere (A)', 'Ohm (Ω)'][unknownIdx];
        await reply(`⚡ *HUKUM OHM*\n\n${label}\n= *${Number(hasil.toFixed(4))} ${satuan}*`);
    },

    async kineticEnergy(reply, args) {
        const [m, v] = args.map(toNum);
        if (m === null || v === null || m < 0) return reply('📌 Cara pakai: *.energikinetik [massa_kg] [kecepatan_m/s]*');
        const ke = 0.5 * m * v * v;
        await reply(`⚡ *ENERGI KINETIK*\n\nEK = ½ × m × v²\nEK = ½ × ${m} × ${v}²\n= *${ke.toLocaleString('id-ID', { maximumFractionDigits: 2 })} Joule*`);
    },

    async gravitationalForce(reply, args) {
        const [m1, m2, jarak] = args.map(toNum);
        if (m1 === null || m2 === null || jarak === null || jarak <= 0) {
            return reply('📌 Cara pakai: *.gayagravitasi [massa1_kg] [massa2_kg] [jarak_m]*');
        }
        const f = (G_UNIVERSAL * m1 * m2) / (jarak * jarak);
        await reply(`🌍 *GAYA GRAVITASI ANTAR 2 BENDA*\n\nF = G × (m₁ × m₂) ÷ r²\n= *${f.toExponential(4)} Newton*`);
    },

    async projectileRange(reply, args) {
        const [v, sudutDerajat] = args.map(toNum);
        if (v === null || sudutDerajat === null || v <= 0 || sudutDerajat <= 0 || sudutDerajat >= 90) {
            return reply('📌 Cara pakai: *.jarakproyektil [kecepatan_awal_m/s] [sudut_derajat 0-90]*');
        }
        const rad = (sudutDerajat * Math.PI) / 180;
        const range = (v * v * Math.sin(2 * rad)) / G_GRAVITASI;
        await reply(`🎯 *JARAK PROYEKTIL (GERAK PARABOLA)*\n\nJarak = v² × sin(2θ) ÷ g\nJarak = ${v}² × sin(${sudutDerajat * 2}°) ÷ ${G_GRAVITASI}\n= *${range.toFixed(2)} meter*\n\n_(Mengabaikan hambatan udara.)_`);
    },

    async acceleration(reply, args) {
        const [v0, v1, t] = args.map(toNum);
        if (v0 === null || v1 === null || t === null || t <= 0) {
            return reply('📌 Cara pakai: *.percepatan [kecepatan_awal] [kecepatan_akhir] [waktu_detik]*');
        }
        const a = (v1 - v0) / t;
        await reply(`🏎️ *PERCEPATAN*\n\na = (v₁ − v₀) ÷ t\na = (${v1} − ${v0}) ÷ ${t}\n= *${a.toFixed(3)} m/s²*${a < 0 ? '\n_(Nilai negatif = perlambatan/deselerasi)_' : ''}`);
    },

    // ── MATEMATIKA ────────────────────────────────────────────────────
    async primeFactors(reply, args) {
        let n = parseInt(args[0]);
        if (!n || n < 2 || n > 1e12) return reply('📌 Cara pakai: *.faktorprima [angka bulat ≥ 2]*');
        const factors = [];
        let d = 2;
        const original = n;
        while (d * d <= n) {
            while (n % d === 0) { factors.push(d); n /= d; }
            d++;
        }
        if (n > 1) factors.push(n);
        const grouped = {};
        for (const f of factors) grouped[f] = (grouped[f] || 0) + 1;
        const expr = Object.entries(grouped).map(([base, exp]) => exp > 1 ? `${base}^${exp}` : `${base}`).join(' × ');
        await reply(`🔢 *FAKTORISASI PRIMA*\n\n${original} = ${expr}`);
    },

    async gcdSteps(reply, args) {
        let [a, b] = args.map(n => parseInt(n));
        if (!a || !b || a < 1 || b < 1) return reply('📌 Cara pakai: *.fpbstep [angka1] [angka2]*');
        const steps = [];
        let x = a, y = b;
        while (y !== 0) {
            const q = Math.floor(x / y);
            const r = x % y;
            steps.push(`${x} = ${q} × ${y} + ${r}`);
            x = y; y = r;
        }
        await reply(`🔢 *FPB — ALGORITMA EUCLIDEAN*\n\n${steps.join('\n')}\n\nFPB(${a}, ${b}) = *${x}*`);
    },

    async matrixAdd(reply, args) {
        const [m1, m2] = args;
        const a = parseMatrix2x2(m1), b = parseMatrix2x2(m2);
        if (!a || !b) return reply('📌 Cara pakai: *.matrixtambah a,b,c,d e,f,g,h*\n(matrix 2×2, contoh: `.matrixtambah 1,2,3,4 5,6,7,8`)');
        const result = [[a[0][0] + b[0][0], a[0][1] + b[0][1]], [a[1][0] + b[1][0], a[1][1] + b[1][1]]];
        await reply(`➕ *PENJUMLAHAN MATRIX 2×2*\n\n${fmtMatrix(result)}`);
    },

    async matrixMultiply(reply, args) {
        const [m1, m2] = args;
        const a = parseMatrix2x2(m1), b = parseMatrix2x2(m2);
        if (!a || !b) return reply('📌 Cara pakai: *.matrixkali a,b,c,d e,f,g,h*\n(matrix 2×2, contoh: `.matrixkali 1,2,3,4 5,6,7,8`)');
        const result = [
            [a[0][0] * b[0][0] + a[0][1] * b[1][0], a[0][0] * b[0][1] + a[0][1] * b[1][1]],
            [a[1][0] * b[0][0] + a[1][1] * b[1][0], a[1][0] * b[0][1] + a[1][1] * b[1][1]],
        ];
        await reply(`✖️ *PERKALIAN MATRIX 2×2*\n\n${fmtMatrix(result)}`);
    },

    // ── KESEHATAN (angka murni, tanpa saran diet/target) ──────────────
    async bodyFatPercent(reply, args) {
        const [gender, tinggi, leher, pinggang, pinggul] = args;
        const g = (gender || '').toLowerCase();
        const t = toNum(tinggi), n = toNum(leher), p = toNum(pinggang), h = toNum(pinggul);
        if ((g !== 'l' && g !== 'p') || t === null || n === null || p === null || (g === 'p' && h === null)) {
            return reply('📌 Cara pakai:\n*.persentaselemak l [tinggi_cm] [leher_cm] [pinggang_cm]*\n*.persentaselemak p [tinggi_cm] [leher_cm] [pinggang_cm] [pinggul_cm]*\n\n_l = laki-laki, p = perempuan. Semua ukuran dalam cm._');
        }
        let bf;
        if (g === 'l') {
            bf = 495 / (1.0324 - 0.19077 * Math.log10(p - n) + 0.15456 * Math.log10(t)) - 450;
        } else {
            bf = 495 / (1.29579 - 0.35004 * Math.log10(p + h - n) + 0.22100 * Math.log10(t)) - 450;
        }
        if (!Number.isFinite(bf)) return reply('❌ Ukuran yang dimasukkan tidak masuk akal (cek lagi angkanya).');
        await reply(`📏 *ESTIMASI PERSENTASE LEMAK TUBUH*\n_(Metode U.S. Navy — perkiraan kasar, bukan pengukuran medis)_\n\nHasil: *${bf.toFixed(1)}%*`);
    },

    async runningPace(reply, args) {
        const [jarakKm, waktuMenit] = args.map(toNum);
        if (jarakKm === null || waktuMenit === null || jarakKm <= 0 || waktuMenit <= 0) {
            return reply('📌 Cara pakai: *.pacelari [jarak_km] [waktu_menit]*\nContoh: `.pacelari 5 30` (lari 5km dalam 30 menit)');
        }
        const paceMenit = waktuMenit / jarakKm;
        const menit = Math.floor(paceMenit);
        const detik = Math.round((paceMenit - menit) * 60);
        const speedKmh = (jarakKm / (waktuMenit / 60));
        await reply(`🏃 *KALKULATOR PACE LARI*\n\nJarak: ${jarakKm} km — Waktu: ${waktuMenit} menit\n\n⏱️ Pace: *${menit}:${String(detik).padStart(2, '0')} menit/km*\n🚀 Kecepatan: *${speedKmh.toFixed(2)} km/jam*`);
    },

    // ── KONVERTER ──────────────────────────────────────────────────────
    async dataUnitConvert(reply, args) {
        const [nilaiRaw, dariRaw, keRaw] = args;
        const nilai = toNum(nilaiRaw);
        const UNITS = { bit: 1, byte: 8, kb: 8 * 1024, mb: 8 * 1024 ** 2, gb: 8 * 1024 ** 3, tb: 8 * 1024 ** 4 };
        const dari = (dariRaw || '').toLowerCase(), ke = (keRaw || '').toLowerCase();
        if (nilai === null || !UNITS[dari] || !UNITS[ke]) {
            return reply('📌 Cara pakai: *.konversidata [nilai] [dari] [ke]*\nSatuan: bit, byte, kb, mb, gb, tb\nContoh: `.konversidata 1024 mb gb`');
        }
        const hasil = (nilai * UNITS[dari]) / UNITS[ke];
        await reply(`💾 *KONVERSI DATA*\n\n${nilai} ${dari.toUpperCase()} = *${Number(hasil.toFixed(6))} ${ke.toUpperCase()}*`);
    },

    async powerUnitConvert(reply, args) {
        const [nilaiRaw, dariRaw, keRaw] = args;
        const nilai = toNum(nilaiRaw);
        // Basis: watt
        const UNITS = { watt: 1, w: 1, kw: 1000, hp: 745.7, pk: 735.5 };
        const dari = (dariRaw || '').toLowerCase(), ke = (keRaw || '').toLowerCase();
        if (nilai === null || !UNITS[dari] || !UNITS[ke]) {
            return reply('📌 Cara pakai: *.konversidaya [nilai] [dari] [ke]*\nSatuan: watt, kw, hp, pk\nContoh: `.konversidaya 100 hp kw`');
        }
        const hasil = (nilai * UNITS[dari]) / UNITS[ke];
        await reply(`⚙️ *KONVERSI DAYA*\n\n${nilai} ${dariRaw.toUpperCase()} = *${Number(hasil.toFixed(4))} ${keRaw.toUpperCase()}*`);
    },
};
