// AanzSmm.js
const TelegramBot = require("node-telegram-bot-api");
const fetch = require("node-fetch");
const { config } = require("./settings");

const bot = new TelegramBot(config.bot_token, { polling: true });

console.log("🤖 Aanz SMM Bot aktif dan siap digunakan!");

// ======== Fungsi bantu API ========

// Cek saldo akun SMM
async function cekSaldo() {
  try {
    const res = await fetch("https://smmnusantara.id/api/balance", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        api_id: config.api_id,
        api_key: config.api_key
      })
    });

    const data = await res.json();
    if (data.balance) {
      return `💰 *Saldo Akun SMM*\n\nRp ${data.balance}\n💵 Mata uang: ${data.currency}`;
    } else {
      return `⚠️ Gagal cek saldo.\nRespon: ${JSON.stringify(data)}`;
    }
  } catch (e) {
    return `❌ Terjadi error koneksi API:\n${e.message}`;
  }
}

// ======== COMMAND HANDLER ========

// /start
bot.onText(/\/start/, (msg) => {
  const text = `Halo ${msg.from.first_name} 👋

Selamat datang di *Aanz SMM Bot* 🚀  
Bot ini membantu kamu mengelola layanan SMM Nusantara.

📋 Daftar perintah:
• /saldo → Cek saldo akun SMM
• /help → Lihat bantuan

Fitur order & status coming soon 😎`;

  bot.sendMessage(msg.chat.id, text, { parse_mode: "Markdown" });
});

// /help
bot.onText(/\/help/, (msg) => {
  const text = `🧾 *Panduan Penggunaan Bot*

/saldo → Menampilkan saldo akun SMM kamu  
/help → Menampilkan daftar perintah

⚙️ Fitur order & cek status akan ditambahkan nanti.`;

  bot.sendMessage(msg.chat.id, text, { parse_mode: "Markdown" });
});

// /saldo
bot.onText(/\/saldo/, async (msg) => {
  const chatId = msg.chat.id;

  // Batas hanya untuk admin
  if (chatId.toString() !== config.admin_id) {
    return bot.sendMessage(chatId, "❌ Kamu tidak memiliki izin untuk cek saldo.");
  }

  bot.sendMessage(chatId, "⏳ Mengecek saldo...");
  const hasil = await cekSaldo();
  bot.sendMessage(chatId, hasil, { parse_mode: "Markdown" });
});

module.exports = { bot };
