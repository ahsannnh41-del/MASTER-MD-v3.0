# ⚡ MASTER MD (v3.0.0) ⚡
> **The Ultimate WhatsApp Multi-Device Powerhouse Bot**  
> **Developed by: AHSAN**

![MASTER MD](https://files.catbox.moe/8jkhav.png)

---

## 🌟 Key Features

* 👑 **Exclusive Developer Branding:** Complete bot, credits, menus, and logs belong strictly to **AHSAN**.
* 🔘 **Interactive Buttons System:** Fully interactive modern WhatsApp buttons (`native_flow`, `single_select`, list menu categories, and action CTA buttons).
* 🌐 **Web Pairing Portal:** Deployable on **Vercel, Netlify, Render, or VPS** — users can simply enter their number and get an 8-digit pairing code to link WhatsApp.
* 🛡️ **Code Protection & Anti-Theft:** Advance encryption and obfuscation (`scripts/encrypt.js`) to protect your bot source code against theft or unauthorized editing.
* ⚡ **2000+ Commands & Features:**
  * **AI Supercharged:** Chatbot with smart persona, image generators, DALL-E, Puter.js.
  * **Media Downloaders:** YouTube, Instagram, TikTok, Facebook, Twitter/X, SoundCloud.
  * **Group Security:** Antilink, Antidelete, AntiNSFW, Anticall, Antispam, Auto-moderation.
  * **RPG & Gaming:** Full RPG game engine, inventory, economy, farming, guilds, bosses.
  * **Jadibot / Sub-Bot Pairing:** Host multiple numbers on one bot instance.

---

## 🚀 Quick Setup & Deployment

### 1️⃣ Bot Deployment (Pterodactyl / VPS / Koyeb / Render)

1. Clone or upload the `MASTER-MD` repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your settings in `setting.js`:
   * `creatorNumber`: Apna phone number likhein (e.g. `923001234567`).
   * `channelUrl`: Apna WhatsApp channel link daalein.
4. Start the bot:
   ```bash
   npm start
   ```
5. Console me ya Web Portal par apna number laga kar **8-digit Pairing Code** WhatsApp me daalein aur bot connect kar lein!

---

### 2️⃣ Web Pairing Portal Deployment (Vercel / Netlify / Render)

Aap web pairing system ko **1-Click** Vercel ya Netlify par deploy kar sakte hain:

#### Deploy to Vercel:
1. `MASTER-MD/web-pairing` folder ko GitHub par push karein ya Vercel dashboard me import karein.
2. Vercel automatically `vercel.json` detect karega.
3. **Deploy** button dabayein!
4. Website link ready ho jayega jahan koi bhi apna number enter kar ke pairing code hasil kar sakta hai.

#### Standalone Express Server:
Agar local ya VPS par web portal chalana hai:
```bash
npm run pair-server
```
Portal live ho jayega: `http://localhost:3000`

---

### 3️⃣ Code Encryption & Protection (Anti-Theft)

Apne bot ka source code encrypt / obfuscate karne ke liye:
```bash
npm run build:protect
```
Yeh script automatically saare `.js` files ko encrypt kar ke **`MASTER-MD-PROTECTED`** folder bana dega. Us encrypted version me:
* Koi bhi code ko edit nahi kar sakega.
* AHSAN ka developer credit hamesha safe rahega.
* Files me anti-tamper security active hogi.

---

## 📜 Credits & License

* **Developer:** AHSAN
* **Engine:** Baileys Multi-Device (@whiskeysockets/baileys)
* **Bot Name:** MASTER MD
* **Copyright:** © 2026 MASTER MD. All Rights Reserved to AHSAN.
