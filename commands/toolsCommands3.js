import { randInt } from '../lib/utils.js';

// ─── HELPERS ────────────────────────────────────────────────────────────────
function luhnCheck(numStr) {
    const digits = numStr.replace(/\D/g, '').split('').reverse().map(Number);
    let sum = 0;
    for (let i = 0; i < digits.length; i++) {
        let d = digits[i];
        if (i % 2 === 1) { d *= 2; if (d > 9) d -= 9; }
        sum += d;
    }
    return sum % 10 === 0;
}

function isValidEmailFormat(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidIndoPhone(num) {
    const clean = num.replace(/[^0-9]/g, '');
    return /^(0|62)8[1-9][0-9]{6,10}$/.test(clean);
}

function caesarCipher(text, shift) {
    return text.replace(/[a-zA-Z]/g, (c) => {
        const base = c <= 'Z' ? 65 : 97;
        return String.fromCharCode(((c.charCodeAt(0) - base + shift) % 26 + 26) % 26 + base);
    });
}

function morseEncode(text) {
    const MORSE = {
        a: '.-', b: '-...', c: '-.-.', d: '-..', e: '.', f: '..-.', g: '--.',
        h: '....', i: '..', j: '.---', k: '-.-', l: '.-..', m: '--', n: '-.',
        o: '---', p: '.--.', q: '--.-', r: '.-.', s: '...', t: '-', u: '..-',
        v: '...-', w: '.--', x: '-..-', y: '-.--', z: '--..',
        '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
        '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
        ' ': '/',
    };
    return text.toLowerCase().split('').map(c => MORSE[c] ?? c).join(' ');
}

function morseDecode(code) {
    const REVERSE = {
        '.-': 'a', '-...': 'b', '-.-.': 'c', '-..': 'd', '.': 'e', '..-.': 'f',
        '--.': 'g', '....': 'h', '..': 'i', '.---': 'j', '-.-': 'k', '.-..': 'l',
        '--': 'm', '-.': 'n', '---': 'o', '.--.': 'p', '--.-': 'q', '.-.': 'r',
        '...': 's', '-': 't', '..-': 'u', '...-': 'v', '.--': 'w', '-..-': 'x',
        '-.--': 'y', '--..': 'z',
        '-----': '0', '.----': '1', '..---': '2', '...--': '3', '....-': '4',
        '.....': '5', '-....': '6', '--...': '7', '---..': '8', '----.': '9',
        '/': ' ',
    };
    return code.trim().split(' ').map(c => REVERSE[c] ?? c).join('');
}

function calculateBmiCategory(bmi) {
    if (bmi < 18.5) return 'Berat badan kurang';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Berat badan berlebih';
    return 'Obesitas';
}

export const toolsCommands3 = {

    async checkPalindrome(reply, args) {
        const text = args.join(' ');
        if (!text) return reply('📌 Cara pakai: *.cekpalindrom [teks]*');
        const clean = text.toLowerCase().replace(/[^a-z0-9]/g, '');
        const isPalin = clean === clean.split('').reverse().join('');
        await reply(`🔍 "${text}" ${isPalin ? '✅ ADALAH' : '❌ BUKAN'} palindrom.`);
    },

    async checkCreditCard(reply, args) {
        const num = args.join('');
        if (!num) return reply('📌 Cara pakai: *.cekcc [nomor]*\n(Hanya validasi format Luhn, bukan cek aktif/tidak)');
        const valid = luhnCheck(num);
        await reply(`💳 Nomor: ${num}\nStatus format: ${valid ? '✅ Valid (lolos Luhn check)' : '❌ Tidak valid'}`);
    },

    async checkEmail(reply, args) {
        const email = args[0] || '';
        if (!email) return reply('📌 Cara pakai: *.cekemail [email]*');
        await reply(`📧 Email: ${email}\nFormat: ${isValidEmailFormat(email) ? '✅ Valid' : '❌ Tidak valid'}`);
    },

    async checkPhoneNumber(reply, args) {
        const num = args[0] || '';
        if (!num) return reply('📌 Cara pakai: *.ceknohp [nomor]*');
        await reply(`📱 Nomor: ${num}\nFormat Indonesia: ${isValidIndoPhone(num) ? '✅ Valid' : '❌ Tidak valid'}`);
    },

    async caesarEncrypt(reply, args) {
        const shift = parseInt(args[0]);
        const text = args.slice(1).join(' ');
        if (!text || isNaN(shift)) return reply('📌 Cara pakai: *.caesarenkrip [shift] [teks]*\nContoh: .caesarenkrip 3 halo dunia');
        await reply(`🔐 *CAESAR CIPHER (shift ${shift})*\n\nHasil: ${caesarCipher(text, shift)}`);
    },

    async caesarDecrypt(reply, args) {
        const shift = parseInt(args[0]);
        const text = args.slice(1).join(' ');
        if (!text || isNaN(shift)) return reply('📌 Cara pakai: *.caesardekrip [shift] [teks]*');
        await reply(`🔓 *CAESAR DECIPHER (shift ${shift})*\n\nHasil: ${caesarCipher(text, -shift)}`);
    },

    async toMorse(reply, args) {
        const text = args.join(' ');
        if (!text) return reply('📌 Cara pakai: *.tomorse [teks]*');
        await reply(`📡 *MORSE CODE*\n\n${morseEncode(text)}`);
    },

    async fromMorse(reply, args) {
        const code = args.join(' ');
        if (!code) return reply('📌 Cara pakai: *.frommorse [kode morse]*\nContoh: .frommorse .... .- .-.. ---');
        await reply(`📡 *HASIL DECODE MORSE*\n\n${morseDecode(code)}`);
    },

    async bmiDetailed(reply, args) {
        const weight = parseFloat(args[0]);
        const heightCm = parseFloat(args[1]);
        if (!weight || !heightCm) return reply('📌 Cara pakai: *.bmidetail [kg] [cm]*');
        const heightM = heightCm / 100;
        const bmi = weight / (heightM * heightM);
        await reply(
`⚖️ *BMI DETAIL*

Berat: ${weight} kg | Tinggi: ${heightCm} cm
BMI: *${bmi.toFixed(1)}*
Kategori: *${calculateBmiCategory(bmi)}*

ℹ️ BMI adalah estimasi umum, bukan diagnosis medis.`
        );
    },

    async calculateAge2(reply, args) {
        const dateStr = args[0];
        if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return reply('📌 Cara pakai: *.umurdetail YYYY-MM-DD*');
        const birth = new Date(dateStr);
        if (isNaN(birth.getTime())) return reply('❌ Format tanggal tidak valid!');
        const now = new Date();
        let years = now.getFullYear() - birth.getFullYear();
        let months = now.getMonth() - birth.getMonth();
        let days = now.getDate() - birth.getDate();
        if (days < 0) { months--; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
        if (months < 0) { years--; months += 12; }
        await reply(`🎂 *UMUR DETAIL*\n\n${years} tahun, ${months} bulan, ${days} hari`);
    },

    async percentageChange(reply, args) {
        const from = parseFloat(args[0]);
        const to = parseFloat(args[1]);
        if (isNaN(from) || isNaN(to)) return reply('📌 Cara pakai: *.persenubah [nilai_awal] [nilai_akhir]*');
        if (from === 0) return reply('❌ Nilai awal tidak boleh 0.');
        const change = ((to - from) / from) * 100;
        await reply(`📈 *PERUBAHAN PERSEN*\n\nDari ${from} ke ${to}\nPerubahan: *${change >= 0 ? '+' : ''}${change.toFixed(2)}%*`);
    },

    async discountCalc(reply, args) {
        const price = parseFloat(args[0]);
        const discount = parseFloat(args[1]);
        if (isNaN(price) || isNaN(discount)) return reply('📌 Cara pakai: *.diskon [harga] [persen_diskon]*');
        const discountAmount = price * (discount / 100);
        const final = price - discountAmount;
        await reply(
`🏷️ *KALKULATOR DISKON*

Harga asli: Rp${price.toLocaleString('id-ID')}
Diskon: ${discount}% (Rp${discountAmount.toLocaleString('id-ID')})
Harga akhir: *Rp${final.toLocaleString('id-ID')}*`
        );
    },

    async splitBill(reply, args) {
        const total = parseFloat(args[0]);
        const people = parseInt(args[1]);
        if (!total || !people || people <= 0) return reply('📌 Cara pakai: *.splitbill [total] [jumlah_orang]*');
        const perPerson = total / people;
        await reply(`🧾 *SPLIT BILL*\n\nTotal: Rp${total.toLocaleString('id-ID')}\nJumlah orang: ${people}\nPer orang: *Rp${perPerson.toLocaleString('id-ID')}*`);
    },

    async randomColor(reply) {
        const hex = '#' + Array.from({ length: 6 }, () => '0123456789ABCDEF'[randInt(0, 15)]).join('');
        await reply(`🎨 *WARNA RANDOM*\n\nHex: *${hex}*`);
    },

    async randomDate(reply, args) {
        const startYear = parseInt(args[0]) || 2000;
        const endYear = parseInt(args[1]) || new Date().getFullYear();
        const year = randInt(startYear, endYear);
        const month = randInt(1, 12);
        const day = randInt(1, 28);
        await reply(`📅 *TANGGAL RANDOM*\n\n${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}-${year}`);
    },

    async textToAscii(reply, args) {
        const text = args.join(' ');
        if (!text) return reply('📌 Cara pakai: *.textascii [teks]*');
        const codes = text.split('').map(c => c.charCodeAt(0)).join(' ');
        await reply(`🔢 *ASCII CODE*\n\n${codes}`);
    },

    async asciiToText(reply, args) {
        const codes = args.map(Number);
        if (!codes.length || codes.some(isNaN)) return reply('📌 Cara pakai: *.asciitext [kode1] [kode2] ...*\nContoh: .asciitext 72 101 108 108 111');
        await reply(`🔤 *HASIL DECODE ASCII*\n\n${codes.map(c => String.fromCharCode(c)).join('')}`);
    },

    async wordFrequency(reply, args) {
        const text = args.join(' ').toLowerCase();
        if (!text) return reply('📌 Cara pakai: *.frekuensikata [teks]*');
        const words = text.split(/\s+/).filter(Boolean);
        const freq = {};
        for (const w of words) freq[w] = (freq[w] || 0) + 1;
        const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 5);
        await reply(`📊 *FREKUENSI KATA (top 5)*\n\n${sorted.map(([w, c]) => `${w}: ${c}x`).join('\n')}`);
    },

    async titleCase(reply, args) {
        const text = args.join(' ');
        if (!text) return reply('📌 Cara pakai: *.titlecase [teks]*');
        const result = text.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.substr(1).toLowerCase());
        await reply(`📝 *TITLE CASE*\n\n${result}`);
    },

    async camelCase(reply, args) {
        const text = args.join(' ');
        if (!text) return reply('📌 Cara pakai: *.camelcase [teks]*');
        const words = text.split(/\s+/);
        const result = words[0].toLowerCase() + words.slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
        await reply(`📝 *camelCase*\n\n${result}`);
    },

    async snakeCase(reply, args) {
        const text = args.join(' ');
        if (!text) return reply('📌 Cara pakai: *.snakecase [teks]*');
        await reply(`📝 *snake_case*\n\n${text.toLowerCase().replace(/\s+/g, '_')}`);
    },

    async kebabCase(reply, args) {
        const text = args.join(' ');
        if (!text) return reply('📌 Cara pakai: *.kebabcase [teks]*');
        await reply(`📝 *kebab-case*\n\n${text.toLowerCase().replace(/\s+/g, '-')}`);
    },

    async countVowels(reply, args) {
        const text = args.join(' ');
        if (!text) return reply('📌 Cara pakai: *.hitungvokal [teks]*');
        const vowels = (text.match(/[aeiouAEIOU]/g) || []).length;
        await reply(`🔤 Jumlah huruf vokal dalam teks: *${vowels}*`);
    },

    async removeVowels(reply, args) {
        const text = args.join(' ');
        if (!text) return reply('📌 Cara pakai: *.hapusvokal [teks]*');
        await reply(`🔤 *HASIL*\n\n${text.replace(/[aeiouAEIOU]/g, '')}`);
    },

    async countConsonants(reply, args) {
        const text = args.join(' ');
        if (!text) return reply('📌 Cara pakai: *.hitungkonsonan [teks]*');
        const consonants = (text.match(/[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]/g) || []).length;
        await reply(`🔤 Jumlah huruf konsonan: *${consonants}*`);
    },

    async repeatText(reply, args) {
        const count = parseInt(args[0]);
        const text = args.slice(1).join(' ');
        if (!count || !text || count > 20) return reply('📌 Cara pakai: *.ulangteks [jumlah] [teks]*\nMaksimal 20x.');
        await reply(Array(count).fill(text).join(' '));
    },

    async tempConvert(reply, args) {
        const value = parseFloat(args[0]);
        const mode = (args[1] || '').toLowerCase();
        if (isNaN(value) || !['c2f', 'f2c', 'c2k', 'k2c'].includes(mode)) {
            return reply('📌 Cara pakai: *.suhu [nilai] [c2f/f2c/c2k/k2c]*');
        }
        let result;
        if (mode === 'c2f') result = (value * 9 / 5) + 32;
        else if (mode === 'f2c') result = (value - 32) * 5 / 9;
        else if (mode === 'c2k') result = value + 273.15;
        else result = value - 273.15;
        await reply(`🌡️ *KONVERSI SUHU*\n\n${value} → *${result.toFixed(2)}*`);
    },

    async tipCalc(reply, args) {
        const bill = parseFloat(args[0]);
        const tipPercent = parseFloat(args[1]) || 10;
        if (isNaN(bill) || bill <= 0) return reply('📌 Cara pakai: *.hitungtip [total_bill] [persen_tip]*\nDefault tip 10% jika tidak diisi.');
        const tip = bill * (tipPercent / 100);
        await reply(
`💵 *KALKULATOR TIP*

Bill: Rp${bill.toLocaleString('id-ID')}
Tip (${tipPercent}%): Rp${tip.toLocaleString('id-ID')}
Total bayar: *Rp${(bill + tip).toLocaleString('id-ID')}*`
        );
    },
};
