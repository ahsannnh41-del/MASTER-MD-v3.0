// commands/readypanel.js

export default {
  name: "readypanel",
  alias: ["ready", "panelready"],
  description: "Menampilkan Ready Panel",

  async execute(m, { sock }) {
    await m.reply(
      `⭐ *READY PANEL*\n\n` +
      `🚀 Panel siap digunakan!\n\n` +
      `🌐 https://zanspiwptero.shoppanel.my.id`
    );
  }
};