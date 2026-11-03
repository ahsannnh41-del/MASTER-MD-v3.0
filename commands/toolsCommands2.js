// ─── ADDITIONAL SMALL UTILITIES ────────────────────────────────────────────

function isPrime(n) {
    if (n < 2) return false;
    for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
    return true;
}

function isPalindrome(s) {
    const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
    return clean === clean.split('').reverse().join('');
}

function factorial(n) {
    if (n < 0 || n > 170) return null;
    let r = 1;
    for (let i = 2; i <= n; i++) r *= i;
    return r;
}

function fibonacci(n) {
    const seq = [0, 1];
    for (let i = 2; i < n; i++) seq.push(seq[i - 1] + seq[i - 2]);
    return seq.slice(0, n);
}

function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }
function lcm(a, b) { return (a * b) / gcd(a, b); }

function celsiusToAll(c) {
    return { f: (c * 9 / 5) + 32, k: c + 273.15 };
}

function romanNumeral(num) {
    if (num <= 0 || num > 3999) return null;
    const vals = [
        [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'],
        [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
    ];
    let result = '';
    for (const [v, sym] of vals) {
        while (num >= v) { result += sym; num -= v; }
    }
    return result;
}

export const mathTools2 = {
    async isPrime(reply, args) {
        const n = parseInt(args?.[0]);
        if (isNaN(n)) return reply('📌 !isprime [angka]');
        await reply(`🔢 ${n} ${isPrime(n) ? 'adalah' : 'bukan'} angka prima.`);
    },

    async isPalindrome(reply, args) {
        const t = args.join(' ');
        if (!t) return reply('📌 !palindrome [teks]');
        await reply(`🔁 "${t}" ${isPalindrome(t) ? 'adalah' : 'bukan'} palindrome.`);
    },

    async factorial(reply, args) {
        const n = parseInt(args?.[0]);
        if (isNaN(n)) return reply('📌 !faktorial [angka]');
        const result = factorial(n);
        await reply(result !== null ? `🔢 ${n}! = *${result}*` : '❌ Angka di luar rentang aman (0-170).');
    },

    async fibonacci(reply, args) {
        const n = Math.min(30, parseInt(args?.[0]) || 10);
        await reply(`🔢 Fibonacci (${n} suku):\n${fibonacci(n).join(', ')}`);
    },

    async gcdLcm(reply, args) {
        const [a, b] = args.map(Number);
        if (!a || !b) return reply('📌 !gcdlcm [a] [b]');
        await reply(`🔢 GCD(${a},${b}) = *${gcd(a, b)}*\nLCM(${a},${b}) = *${lcm(a, b)}*`);
    },

    async celsiusAll(reply, args) {
        const c = parseFloat(args?.[0]);
        if (isNaN(c)) return reply('📌 !suhulengkap [celcius]');
        const { f, k } = celsiusToAll(c);
        await reply(`🌡️ ${c}°C = *${f.toFixed(1)}°F* = *${k.toFixed(1)}K*`);
    },

    async toRoman(reply, args) {
        const n = parseInt(args?.[0]);
        if (isNaN(n)) return reply('📌 !roman [angka 1-3999]');
        const result = romanNumeral(n);
        await reply(result ? `🏛️ ${n} = *${result}*` : '❌ Angka harus 1-3999.');
    },

    async quadratic(reply, args) {
        const [a, b, c] = args.map(Number);
        if (!a) return reply('📌 !kuadrat [a] [b] [c]\nMenghitung akar ax²+bx+c=0');
        const d = b * b - 4 * a * c;
        if (d < 0) return reply('❌ Tidak ada akar real (diskriminan negatif).');
        const x1 = (-b + Math.sqrt(d)) / (2 * a);
        const x2 = (-b - Math.sqrt(d)) / (2 * a);
        await reply(`📐 Akar: x1 = *${x1.toFixed(3)}*, x2 = *${x2.toFixed(3)}*`);
    },

    async average(reply, args) {
        const nums = args.map(Number).filter(n => !isNaN(n));
        if (!nums.length) return reply('📌 !average [n1] [n2] [n3] ...');
        const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
        await reply(`📊 Rata-rata: *${avg.toFixed(2)}*\nJumlah data: ${nums.length}`);
    },

    async median(reply, args) {
        const nums = args.map(Number).filter(n => !isNaN(n)).sort((a, b) => a - b);
        if (!nums.length) return reply('📌 !median [n1] [n2] [n3] ...');
        const mid = Math.floor(nums.length / 2);
        const med = nums.length % 2 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
        await reply(`📊 Median: *${med}*`);
    },
};

// ─── DATE/TIME UTILITIES ───────────────────────────────────────────────────
const DAY_NAMES = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const MONTH_NAMES = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

export const dateTools = {
    async dayOfWeek(reply, args) {
        const dateStr = args.join(' ');
        const date = dateStr ? new Date(dateStr) : new Date();
        if (isNaN(date.getTime())) return reply('📌 !harike [YYYY-MM-DD]');
        await reply(`📅 ${date.getDate()} ${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()} adalah hari *${DAY_NAMES[date.getDay()]}*`);
    },

    async daysUntil(reply, args) {
        const dateStr = args.join(' ');
        const target = new Date(dateStr);
        if (isNaN(target.getTime())) return reply('📌 !sisahari [YYYY-MM-DD]');
        const now = new Date();
        const diff = Math.ceil((target - now) / 86400000);
        await reply(diff >= 0 ? `📅 *${diff} hari* lagi sampai tanggal tersebut.` : `📅 Tanggal tersebut sudah lewat *${Math.abs(diff)} hari* yang lalu.`);
    },

    async isLeapYear(reply, args) {
        const year = parseInt(args?.[0]) || new Date().getFullYear();
        const leap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
        await reply(`📅 Tahun ${year} ${leap ? 'adalah' : 'bukan'} tahun kabisat.`);
    },

    async zodiacSign(reply, args) {
        const [day, month] = args.map(Number);
        if (!day || !month) return reply('📌 !zodiaklahir [tanggal] [bulan]\nContoh: !zodiaklahir 15 8');
        const signs = [
            [20, 'Capricorn'], [19, 'Aquarius'], [20, 'Pisces'], [20, 'Aries'], [21, 'Taurus'], [21, 'Gemini'],
            [22, 'Cancer'], [22, 'Leo'], [23, 'Virgo'], [23, 'Libra'], [22, 'Scorpio'], [21, 'Sagittarius'],
        ];
        const sign = day <= signs[month - 1][0] ? signs[month - 1][1] : signs[month % 12][1];
        await reply(`♈ Zodiak untuk tanggal ${day}/${month}: *${sign}*`);
    },
};

// ─── FORMAT HELPERS ─────────────────────────────────────────────────────────
export const formatTools = {
    async toTitleCase(reply, args) {
        const t = args.join(' ');
        if (!t) return reply('📌 !titlecase [teks]');
        await reply(t.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()));
    },

    async removeSpaces(reply, args) {
        const t = args.join(' ');
        if (!t) return reply('📌 !removespace [teks]');
        await reply(t.replace(/\s+/g, ''));
    },

    async repeatText(reply, args) {
        const n = parseInt(args[0]);
        const t = args.slice(1).join(' ');
        if (!n || !t) return reply('📌 !repeat [jumlah] [teks]');
        await reply(t.repeat(Math.min(n, 50)));
    },

    async charAt(reply, args) {
        const t = args.slice(0, -1).join(' ');
        const idx = parseInt(args[args.length - 1]);
        if (!t || isNaN(idx)) return reply('📌 !charat [teks] [index]');
        await reply(t[idx] !== undefined ? `Karakter ke-${idx}: *${t[idx]}*` : '❌ Index di luar rentang.');
    },

    async textStats(reply, args) {
        const t = args.join(' ');
        if (!t) return reply('📌 !textstats [teks]');
        const vowels = (t.match(/[aeiouAEIOU]/g) || []).length;
        const consonants = (t.match(/[a-zA-Z]/g) || []).length - vowels;
        await reply(`📊 *Statistik Teks*\n\nPanjang: ${t.length}\nHuruf vokal: ${vowels}\nHuruf konsonan: ${consonants}\nKata: ${t.trim().split(/\s+/).filter(Boolean).length}`);
    },
};

// ─── ID GENERATOR / VALIDATORS ──────────────────────────────────────────────
export const validatorTools = {
    async validateEmail(reply, args) {
        const email = args[0];
        if (!email) return reply('📌 !validemail [email]');
        const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        await reply(`📧 Email "${email}" ${valid ? '✅ valid' : '❌ tidak valid'} secara format.`);
    },

    async validatePhone(reply, args) {
        const phone = args[0];
        if (!phone) return reply('📌 !validphone [nomor]');
        const valid = /^(\+?62|0)8[0-9]{8,11}$/.test(phone.replace(/[\s-]/g, ''));
        await reply(`📱 Nomor "${phone}" ${valid ? '✅ format valid (ID)' : '❌ format tidak valid'}.`);
    },

    async checkPasswordStrength(reply, args) {
        const pw = args[0];
        if (!pw) return reply('📌 !cekpassword [password]');
        let score = 0;
        if (pw.length >= 8) score++;
        if (/[A-Z]/.test(pw)) score++;
        if (/[a-z]/.test(pw)) score++;
        if (/[0-9]/.test(pw)) score++;
        if (/[^A-Za-z0-9]/.test(pw)) score++;
        const labels = ['Sangat Lemah', 'Lemah', 'Sedang', 'Kuat', 'Sangat Kuat', 'Excellent'];
        await reply(`🔐 Kekuatan password: *${labels[score]}* (${score}/5)`);
    },
};
