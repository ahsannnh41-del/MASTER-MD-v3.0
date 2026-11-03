// ═══════════════════════════════════════════════════════════════════
//  IMAGEGEN.JS — Generator gambar teks (iqc) TANPA dependency eksternal
//  apapun (tidak pakai sharp/canvas/jimp). Hanya pakai modul bawaan
//  Node (`zlib`) untuk encode PNG secara manual.
//
//  CATATAN (2026-07-07): render brat lokal (renderBratRGBA/
//  renderBratImage/renderBratFrames) sudah DIHAPUS dari file ini —
//  bratCommands.js sekarang generate gambar brat lewat API remote
//  (brat.siputzx.my.id), bukan lagi render bitmap-font lokal. File ini
//  sekarang cuma dipakai untuk renderIqcImage() + encodePNG() generik.
//
//  Sengaja dibuat begini (bukan pakai library gambar) karena:
//  1) package.json project ini SENGAJA dijaga minim dependency demi
//     kompatibilitas Pterodactyl (lihat catatan di mediaCommands.js
//     soal sharp/webp yang belum diaktifkan).
//  2) Tidak butuh font system / library native apapun saat deploy —
//     tinggal `npm install` dependency biasa, tidak ada native build.
//
//  Font yang dipakai adalah bitmap 5x7 buatan sendiri (lihat di bawah).
// ═══════════════════════════════════════════════════════════════════

import zlib from 'zlib';

// ─── CRC32 (dibutuhkan untuk chunk PNG) ──────────────────────────────────
const CRC_TABLE = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    CRC_TABLE[n] = c;
}
function crc32(buf) {
    let crc = 0xffffffff;
    for (let i = 0; i < buf.length; i++) crc = CRC_TABLE[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
    return (crc ^ 0xffffffff) >>> 0;
}

// ─── PNG ENCODER (RGBA 8-bit, tanpa filter/interlace) ────────────────────
function pngChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
}

export function encodePNG(width, height, rgbaBuffer) {
    const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(width, 0);
    ihdr.writeUInt32BE(height, 4);
    ihdr[8] = 8;  // bit depth
    ihdr[9] = 6;  // color type: RGBA
    ihdr[10] = 0; // compression method
    ihdr[11] = 0; // filter method
    ihdr[12] = 0; // interlace

    const stride = width * 4;
    const raw = Buffer.alloc((stride + 1) * height);
    for (let y = 0; y < height; y++) {
        raw[y * (stride + 1)] = 0; // filter type "None" per scanline
        rgbaBuffer.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride);
    }
    const idatData = zlib.deflateSync(raw, { level: 9 });

    return Buffer.concat([
        sig,
        pngChunk('IHDR', ihdr),
        pngChunk('IDAT', idatData),
        pngChunk('IEND', Buffer.alloc(0)),
    ]);
}

// ─── BITMAP FONT 5x7 ──────────────────────────────────────────────────────
// Setiap glyph: 7 baris, masing-masing 5 bit (bit 4 = kolom paling kiri).
const FONT_5x7 = {
    ' ': [0,0,0,0,0,0,0],
    'A': [0x0E,0x11,0x11,0x1F,0x11,0x11,0x11],
    'B': [0x1E,0x11,0x11,0x1E,0x11,0x11,0x1E],
    'C': [0x0E,0x11,0x10,0x10,0x10,0x11,0x0E],
    'D': [0x1C,0x12,0x11,0x11,0x11,0x12,0x1C],
    'E': [0x1F,0x10,0x10,0x1E,0x10,0x10,0x1F],
    'F': [0x1F,0x10,0x10,0x1E,0x10,0x10,0x10],
    'G': [0x0E,0x11,0x10,0x17,0x11,0x11,0x0F],
    'H': [0x11,0x11,0x11,0x1F,0x11,0x11,0x11],
    'I': [0x0E,0x04,0x04,0x04,0x04,0x04,0x0E],
    'J': [0x07,0x02,0x02,0x02,0x02,0x12,0x0C],
    'K': [0x11,0x12,0x14,0x18,0x14,0x12,0x11],
    'L': [0x10,0x10,0x10,0x10,0x10,0x10,0x1F],
    'M': [0x11,0x1B,0x15,0x15,0x11,0x11,0x11],
    'N': [0x11,0x19,0x15,0x13,0x11,0x11,0x11],
    'O': [0x0E,0x11,0x11,0x11,0x11,0x11,0x0E],
    'P': [0x1E,0x11,0x11,0x1E,0x10,0x10,0x10],
    'Q': [0x0E,0x11,0x11,0x11,0x15,0x12,0x0D],
    'R': [0x1E,0x11,0x11,0x1E,0x14,0x12,0x11],
    'S': [0x0F,0x10,0x10,0x0E,0x01,0x01,0x1E],
    'T': [0x1F,0x04,0x04,0x04,0x04,0x04,0x04],
    'U': [0x11,0x11,0x11,0x11,0x11,0x11,0x0E],
    'V': [0x11,0x11,0x11,0x11,0x11,0x0A,0x04],
    'W': [0x11,0x11,0x11,0x15,0x15,0x15,0x0A],
    'X': [0x11,0x11,0x0A,0x04,0x0A,0x11,0x11],
    'Y': [0x11,0x11,0x0A,0x04,0x04,0x04,0x04],
    'Z': [0x1F,0x01,0x02,0x04,0x08,0x10,0x1F],
    '0': [0x0E,0x11,0x13,0x15,0x19,0x11,0x0E],
    '1': [0x04,0x0C,0x04,0x04,0x04,0x04,0x0E],
    '2': [0x0E,0x11,0x01,0x06,0x08,0x10,0x1F],
    '3': [0x1F,0x02,0x04,0x06,0x01,0x11,0x0E],
    '4': [0x02,0x06,0x0A,0x12,0x1F,0x02,0x02],
    '5': [0x1F,0x10,0x1E,0x01,0x01,0x11,0x0E],
    '6': [0x06,0x08,0x10,0x1E,0x11,0x11,0x0E],
    '7': [0x1F,0x01,0x02,0x04,0x08,0x08,0x08],
    '8': [0x0E,0x11,0x11,0x0E,0x11,0x11,0x0E],
    '9': [0x0E,0x11,0x11,0x0F,0x01,0x02,0x0C],
    '.': [0,0,0,0,0,0x0C,0x0C],
    ',': [0,0,0,0,0,0x0C,0x08],
    '!': [0x04,0x04,0x04,0x04,0x04,0,0x04],
    '?': [0x0E,0x11,0x01,0x06,0x04,0,0x04],
    "'": [0x0C,0x04,0x08,0,0,0,0],
    '"': [0x1B,0x1B,0x0A,0,0,0,0],
    '-': [0,0,0,0x1F,0,0,0],
    '+': [0,0x04,0x04,0x1F,0x04,0x04,0],
    '=': [0,0,0x1F,0,0x1F,0,0],
    ':': [0,0x0C,0x0C,0,0x0C,0x0C,0],
    ';': [0,0x0C,0x0C,0,0x0C,0x08,0],
    '/': [0x01,0x02,0x04,0x08,0x10,0,0],
    '\\': [0x10,0x08,0x04,0x02,0x01,0,0],
    '_': [0,0,0,0,0,0,0x1F],
    '(': [0x06,0x08,0x10,0x10,0x10,0x08,0x06],
    ')': [0x0C,0x02,0x01,0x01,0x01,0x02,0x0C],
    '%': [0x19,0x12,0x04,0x08,0x09,0x16,0x13],
    '@': [0x0E,0x11,0x17,0x15,0x17,0x10,0x0E],
    '#': [0x0A,0x1F,0x0A,0x0A,0x1F,0x0A,0],
    '&': [0x0C,0x12,0x14,0x08,0x15,0x12,0x0D],
    '*': [0,0x15,0x0E,0x1F,0x0E,0x15,0],
};
function glyph(ch) {
    return FONT_5x7[ch.toUpperCase()] || FONT_5x7[' '];
}

// ─── HELPER CANVAS (RGBA buffer mentah) ──────────────────────────────────
function makeCanvas(w, h, bg) {
    const buf = Buffer.alloc(w * h * 4);
    for (let i = 0; i < w * h; i++) {
        buf[i*4] = bg[0]; buf[i*4+1] = bg[1]; buf[i*4+2] = bg[2]; buf[i*4+3] = 255;
    }
    return buf;
}
function setPixel(buf, w, h, x, y, color) {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const i = (y * w + x) * 4;
    buf[i] = color[0]; buf[i+1] = color[1]; buf[i+2] = color[2]; buf[i+3] = 255;
}
function drawChar(buf, w, h, ch, x, y, scale, color) {
    const rows = glyph(ch);
    for (let ry = 0; ry < 7; ry++) {
        const bits = rows[ry];
        for (let rx = 0; rx < 5; rx++) {
            if (bits & (1 << (4 - rx))) {
                for (let sy = 0; sy < scale; sy++) {
                    for (let sx = 0; sx < scale; sx++) {
                        setPixel(buf, w, h, x + rx*scale + sx, y + ry*scale + sy, color);
                    }
                }
            }
        }
    }
}
function textWidth(text, scale, spacing) {
    return text.length * (5*scale + spacing) - spacing;
}
function wrapText(text, scale, spacing, maxWidth) {
    const words = text.split(/\s+/).filter(Boolean);
    const lines = [];
    let cur = '';
    for (const word of words) {
        const test = cur ? cur + ' ' + word : word;
        if (textWidth(test, scale, spacing) > maxWidth && cur) {
            lines.push(cur);
            cur = word;
        } else {
            cur = test;
        }
    }
    if (cur) lines.push(cur);
    return lines.length ? lines : [''];
}
function fillRoundedRect(buf, w, h, x0, y0, rw, rh, radius, color) {
    for (let y = y0; y < y0 + rh; y++) {
        for (let x = x0; x < x0 + rw; x++) {
            const lx = x - x0, ly = y - y0;
            let inside = true, cx = -1, cy = -1;
            if (lx < radius && ly < radius) { cx = radius; cy = radius; }
            else if (lx >= rw - radius && ly < radius) { cx = rw - radius - 1; cy = radius; }
            else if (lx < radius && ly >= rh - radius) { cx = radius; cy = rh - radius - 1; }
            else if (lx >= rw - radius && ly >= rh - radius) { cx = rw - radius - 1; cy = rh - radius - 1; }
            if (cx >= 0) {
                const dx = lx - cx, dy = ly - cy;
                if (dx*dx + dy*dy > radius*radius) inside = false;
            }
            if (inside) setPixel(buf, w, h, x, y, color);
        }
    }
}

// ─── RENDER: IQC (bubble chat ala WhatsApp asli) ─────────────────────────
// Sebelumnya bubble ini bertema iMessage (biru, ekor di kiri-bawah, teks
// putih). Sekarang diganti jadi bubble WhatsApp ASLI: hijau (warna bubble
// pesan TERKIRIM di WA — bukan pesan masuk yang putih/abu), ekor di
// KANAN-bawah (bubble pengirim di WA selalu nempel ke kanan, beda dengan
// iMessage yang nempel ke kiri), dan teks GELAP (bukan putih) — karena
// bubble hijau WA pakai teks hitam/gelap, bukan putih seperti iMessage.
export function renderIqcImage(text, { theme = 'light', bubbleColor = null, size = 720 } = {}) {
    const clean = String(text || '').trim() || '...';
    const w = size;
    const padding = Math.round(size * 0.06);

    // Tema WhatsApp: light = wallpaper chat terang + bubble hijau muda
    // klasik (#DCF8C6) dengan teks hitam; dark = wallpaper chat gelap WA
    // (#0B141A) + bubble hijau tua WA Dark Mode (#005C4B) dengan teks putih.
    const isDark = theme === 'dark';
    const bg = isDark ? [11, 20, 26] : [229, 221, 213]; // wallpaper chat WA (gelap / terang khas WA)
    const resolvedBubbleColor = bubbleColor || (isDark ? [0, 92, 75] : [220, 248, 198]); // #005C4B / #DCF8C6
    const fg = isDark ? [233, 237, 239] : [17, 27, 33]; // teks WA: putih pudar (dark) / hampir hitam (light)

    const bubblePadX = Math.round(size * 0.05);
    const bubblePadY = Math.round(size * 0.045);
    const maxBubbleWidth = w - padding * 2 - bubblePadX * 2;

    // FIX: sebelumnya loop ini berhenti di SCALE PERTAMA (paling besar)
    // yang "muat" — tapi karena bubble chat boleh selebar maxBubbleWidth,
    // di scale besar manapun teks SELALU "muat" asal di-wrap jadi banyak
    // baris pendek (akibatnya kalimat pendek seperti "halo lagi apa nih"
    // malah dipecah 1 kata per baris, bukan natural seperti bubble chat
    // asli — bandingkan dengan screenshot bubble WhatsApp asli yang
    // jarang mecah kalimat pendek jadi banyak baris).
    //
    // Sekarang dicoba TARGET JUMLAH BARIS dari paling sedikit (1) ke
    // paling banyak (6) — untuk setiap target, cari scale TERBESAR yang
    // membuat teks pas dengan jumlah baris itu. Opsi PERTAMA yang scale-
    // nya sudah "cukup besar untuk dibaca" (>= MIN_READABLE_SCALE)
    // dipakai — ini meniru cara orang mengetik chat: kalimat pendek
    // diketik dalam 1-2 baris ukuran wajar, BUKAN dipecah jadi banyak
    // baris super besar.
    const MIN_READABLE_SCALE = 6;
    let scale = 2, spacing = 2, lines = [clean.toUpperCase()], lineHeight = 14;
    let best = null;
    outer:
    for (let targetLines = 1; targetLines <= 6; targetLines++) {
        for (let s = Math.max(2, Math.floor(size / 30)); s >= 2; s--) {
            const sp = s;
            const candidateLines = wrapText(clean.toUpperCase(), s, sp, maxBubbleWidth);
            const widest = Math.max(...candidateLines.map(l => textWidth(l, s, sp)));
            if (candidateLines.length <= targetLines && widest <= maxBubbleWidth) {
                // Opsi valid TERBESAR untuk target baris ini ditemukan.
                if (s >= MIN_READABLE_SCALE || targetLines === 6) {
                    best = { scale: s, spacing: sp, lines: candidateLines, widest };
                    break outer;
                }
                // Scale-nya kebagusan tapi terlalu kecil untuk target baris
                // ini -> simpan sebagai kandidat cadangan, lalu coba target
                // baris yang lebih banyak (mungkin scale-nya membesar lagi).
                if (!best || s > best.scale) best = { scale: s, spacing: sp, lines: candidateLines, widest };
                break;
            }
        }
    }
    if (!best) {
        best = { scale: 2, spacing: 2, lines: wrapText(clean.toUpperCase(), 2, 2, maxBubbleWidth), widest: 0 };
    }
    scale = best.scale;
    spacing = best.spacing;
    lines = best.lines;
    lineHeight = 7 * scale;
    const lineSpacing = Math.round(lineHeight * 0.55);
    const textBlockHeight = lines.length * lineHeight + (lines.length - 1) * lineSpacing;
    const widestLineWidth = Math.max(...lines.map(l => textWidth(l, scale, spacing)));

    const bubbleW = widestLineWidth + bubblePadX * 2;
    const bubbleH = textBlockHeight + bubblePadY * 2;
    const bubbleRadius = Math.min(Math.round(size * 0.035), Math.round(Math.min(bubbleW, bubbleH) * 0.22));
    const tailH = Math.round(bubbleH * 0.18);

    const h = bubbleH + padding * 2 + tailH;
    const buf = makeCanvas(w, h, bg);

    // Bubble pesan TERKIRIM di WhatsApp selalu rapat ke sisi KANAN layar
    // (beda dengan iMessage yang justru rapat ke kiri) — jadi posisi
    // horizontal bubble digeser ke kanan, bukan ditengah seperti sebelumnya.
    const bubbleX = w - padding - bubbleW;
    const bubbleY = padding;
    fillRoundedRect(buf, w, h, bubbleX, bubbleY, bubbleW, bubbleH, bubbleRadius, resolvedBubbleColor);

    // Ekor bubble di KANAN-bawah (ciri khas bubble pengirim WhatsApp,
    // kebalikan dari iMessage yang ekornya di kiri-bawah).
    const tailX = bubbleX + bubbleW - Math.round(bubbleW * 0.12) - tailH;
    const tailY = bubbleY + bubbleH - 2;
    for (let ty = 0; ty < tailH; ty++) {
        const rowW = tailH - ty;
        const rowStartX = tailX + (tailH - rowW); // segitiga miring ke kanan-bawah
        for (let tx = 0; tx < rowW; tx++) {
            setPixel(buf, w, h, rowStartX + tx, tailY + ty, resolvedBubbleColor);
        }
    }

    let textY = bubbleY + bubblePadY;
    for (const line of lines) {
        const lw = textWidth(line, scale, spacing);
        let textX = bubbleX + Math.round((bubbleW - lw) / 2);
        for (const ch of line) {
            drawChar(buf, w, h, ch, textX, textY, scale, fg);
            textX += 5*scale + spacing;
        }
        textY += lineHeight + lineSpacing;
    }

    return encodePNG(w, h, buf);
}
