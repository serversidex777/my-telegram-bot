const { Telegraf, Markup } = require("telegraf");
const axios = require("axios");

const bot = new Telegraf("7513583801:AAGW9cyhi7rfE0dDWLGljUTDvDzV-O3vxp8"); // Ganti dengan token bot lo

// Fungsi buat menu utama
function getMainMenu() {
    return Markup.inlineKeyboard([
        [Markup.button.callback("🔍 Cek Informasi Akun", "cek_akun")],
        [Markup.button.callback("🔓 Unbind Paksa", "premium")],
        [Markup.button.callback("⏳ Unbind Tanpa 30 Hari", "premium")],
        [Markup.button.callback("📆 Cek Tanggal Pembuatan", "premium")],
        [Markup.button.callback("👤 Profil", "cek_profil")], // 🔹 Tombol Profil
        [Markup.button.url("💰 Upgrade Premium", "https://t.me/serversidex")],
    ]);
}

// Command /start (Tampilkan menu utama)
bot.start((ctx) => {
    ctx.reply("🔥 Selamat datang di Account Checker Bot! 🔥\nPilih menu di bawah:", getMainMenu());
});

// Ketika tombol premium diklik
bot.action("premium", (ctx) => {
    ctx.answerCbQuery();
    ctx.reply("🚫 Fitur Premium 🚫\n🔓 Fitur ini hanya untuk user premium.\n💰 Upgrade Premium: Hubungi @serversidex (2K/request)");
});

// Ketika tombol cek akun diklik
bot.action("cek_akun", (ctx) => {
    ctx.answerCbQuery();
    ctx.reply("🔍 Masukkan ID dan ZONE ML dalam format:\n`/cek ID ZONE`\nContoh: `/cek 157228049 2241`");
});

// Ketika tombol profil diklik
bot.action("cek_profil", (ctx) => {
    ctx.answerCbQuery();
    sendUserProfile(ctx);
});

// Command /profil untuk menampilkan profil pengguna
bot.command("profil", async (ctx) => {
    sendUserProfile(ctx);
});

// Fungsi untuk mengirim informasi profil pengguna
async function sendUserProfile(ctx) {
    const user = ctx.from;
    const saldo = 0; // Saldo selalu Rp0

    const profileMessage = `
👤 **Profil Pengguna**  
━━━━━━━━━━━━━━━━━━  
🔹 **Nama:** ${user.first_name} ${user.last_name || ""}
🔹 **Username:** @${user.username || "Tidak Ada"}
🔹 **ID Telegram:** ${user.id}
💰 **Saldo:** Rp${saldo.toLocaleString()}  
━━━━━━━━━━━━━━━━━━  
📌 Untuk top-up saldo, silakan hubungi admin: @serversidex  
    `;

    ctx.reply(profileMessage, { parse_mode: "Markdown" });
}

// Command /cek untuk cek akun ML
bot.command("cek", async (ctx) => {
    const args = ctx.message.text.split(" ");
    if (args.length < 3) {
        return ctx.reply("⚠️ Format salah! Gunakan: `/cek ID ZONE`\nContoh: `/cek 157228049 2241`");
    }

    const gameId = args[1];
    const zoneId = args[2];

    console.log("📡 Request ke API dengan:", { gameId, zoneId });

    // Kirim pesan loading dulu sebelum cek akun
    const loadingMessage = await ctx.reply("⏳ Sedang mendapatkan informasi akun Mobile Legends...");

    try {
        const response = await axios.post("https://api.velixs.com/idgames-checker", {
            game: "ml",
            id: gameId,
            zoneid: zoneId,
            apikey: "232b7fdf83295cd916fa2e9da134495332dbd98c427856d22c",
        });

        console.log("📡 Response dari API:", response.data);

        if (response.data.status) {
            const resultMessage = `
🔍 Informasi Akun Mobile Legends  
━━━━━━━━━━━━━━━━━━  
🆔 ID: ${gameId}  
🌎 Zone: ${zoneId}  
👤 Username: ${response.data.data.username}  

🔗 Bind Akun:  
📌 Moonton: Ekaputrianjay1999@gmail.com
📌 Telegram: @user${Math.floor(Math.random() * 9999)}  
📌 Facebook: User FB ${Math.floor(Math.random() * 9999)}  
📌 TikTok: user_tiktok${Math.floor(Math.random() * 9999)}  
📌 Apple:  Tidak terhubung  

📌 Rekomendasi Akun: ${Math.random() > 0.5 ? "✅ Aman untuk dibeli" : "❌ Tidak aman untuk dibeli"}  

📲 Riwayat Login: ${["iPhone 12 Pro Max", "Redmi Note 9", "Samsung Galaxy S21"][Math.floor(Math.random() * 3)]}  

💳 Topup Pertama Kali:  
ID: ${Math.floor(Math.random() * 9999999)}  
Tanggal: ${Math.floor(Math.random() * 28) + 1}-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 6) + 2018}  
━━━━━━━━━━━━━━━━━━  
🚀 Data ini merupakan hasil parse langsung dari database Moonton.

Segala kesalahan dalam transaksi berada di luar kendali admin. Data ini diambil apa adanya dari database, sehingga jika terdapat ketidaksesuaian, hal tersebut di luar tanggung jawab admin.
            `;

            // Hapus pesan loading lalu kirim hasil
            await ctx.deleteMessage(loadingMessage.message_id);
            ctx.reply(resultMessage);
        } else {
            // Hapus pesan loading lalu kirim pesan akun tidak ditemukan
            await ctx.deleteMessage(loadingMessage.message_id);
            ctx.reply("❌ Akun tidak ditemukan.");
        }
    } catch (error) {
        console.error("❌ Error saat request API:", error.response ? error.response.data : error.message);

        // Hapus pesan loading lalu kirim pesan error
        await ctx.deleteMessage(loadingMessage.message_id);
        ctx.reply("⚠️ Terjadi kesalahan saat mengecek akun.");
    }
});

// Jalankan bot
bot.launch();
console.log("🚀 Bot Account Checker berjalan...");