// JMApro.uz - Telegram Bot Serverless Webhook Handler (24/7 on Vercel)
// Bot: @JMApro_bot | Admin Chat ID: 6471413331 (Jaloliddin Mo'minov)

const BOT_TOKEN = "9039848468:AAEx2BXB2VrWELvm4K71JfQffBFPbhicOXY";
const ADMIN_CHAT_ID = "6471413331";

function escapeHtml(text) {
    if (!text) return "";
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

async function callTelegram(method, data) {
    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (e) {
        console.error(`Telegram API error (${method}):`, e);
        return { ok: false, error: String(e) };
    }
}

module.exports = async (req, res) => {
    if (req.method !== "POST") {
        return res.status(200).json({
            ok: true,
            status: "active",
            bot: "@JMApro_bot",
            portal: "https://jmapro.uz"
        });
    }

    try {
        let update = req.body;
        if (typeof update === "string") {
            try {
                update = JSON.parse(update);
            } catch (err) {}
        }

        if (!update || (!update.message && !update.callback_query)) {
            return res.status(200).json({ ok: true });
        }

        const msg = update.message;
        if (!msg) {
            return res.status(200).json({ ok: true });
        }

        const chatId = String(msg.chat.id);
        const from = msg.from || {};
        const text = msg.text || msg.caption || "";
        const senderName = `${from.first_name || ""} ${from.last_name || ""}`.trim() || "Foydalanuvchi";
        const senderUsername = from.username ? `@${from.username}` : "yo'q";
        const senderId = String(from.id || chatId);

        // -------------------------------------------------------------
        // 1. ADMIN (Jaloliddin Mo'minov) TOMONI
        // -------------------------------------------------------------
        if (chatId === ADMIN_CHAT_ID) {
            // Admin biror xabarga "Reply" (Ответить) qilib yozsa
            if (msg.reply_to_message && msg.reply_to_message.text) {
                const replyText = msg.reply_to_message.text;
                const match = replyText.match(/TG_ID:\s*(\d+)/i) || replyText.match(/Telegram ID:\s*(\d+)/i);

                if (match && match[1]) {
                    const targetUserId = match[1];

                    // Foydalanuvchiga javob yuborish
                    await callTelegram("sendMessage", {
                        chat_id: targetUserId,
                        text: `💬 <b>Jaloliddin Mo'minovdan javob:</b>\n\n${escapeHtml(text)}`,
                        parse_mode: "HTML"
                    });

                    // Adminga qisqa 1 qator tasdiq
                    await callTelegram("sendMessage", {
                        chat_id: ADMIN_CHAT_ID,
                        text: `✅ Yetkazildi.`,
                        reply_to_message_id: msg.message_id
                    });

                    return res.status(200).json({ ok: true });
                }
            }

            // Admin /start bosganda
            if (text === "/start") {
                await callTelegram("sendMessage", {
                    chat_id: ADMIN_CHAT_ID,
                    text: `👋 Assalomu alaykum, Jaloliddin aka!\n@JMApro_bot faol ishlamoqda. Murojaatlarga Reply qilib javob yozishingiz mumkin.`
                });
                return res.status(200).json({ ok: true });
            }

            return res.status(200).json({ ok: true });
        }

        // -------------------------------------------------------------
        // 2. MEHMON / FOYDALANUVCHI TOMONI
        // -------------------------------------------------------------

        // Foydalanuvchi /start bosganda
        if (text === "/start") {
            const welcomeText = 
`👋 <b>Assalomu alaykum, ${escapeHtml(from.first_name || "hurmatli foydalanuvchi")}!</b>

Siz <b>Jaloliddin Mo'minov</b>ning rasmiy aloqa botiga xush kelibsiz.

<b>Bu yerda:</b>
• 📚 Ilmiy tadqiqotlar va nashrlar;
• 🎓 TMJ fanlari va o'quv materiallari;
• ⚙️ Havoli sovitish apparatlari va hisoblash vositalari;
• 🎬 <a href="https://www.youtube.com/@jaloliddinMuminov_yt">YouTube: Ilmiy kanal</a> videolari;
• 💼 Hamkorlik va loyiha takliflaringizni yozib qoldirishingiz mumkin.

ℹ️ <i>Eslatma: Bu bot sun'iy intellekt (AI) emas — barcha xabarlar to'g'ridan-to'g'ri Jaloliddin Mo'minovga yetkaziladi va sizga shaxsan javob qaytariladi.</i>

✍️ <b>Savol yoki fikringizni bemalol yozib qoldiring.</b>`;

            await callTelegram("sendMessage", {
                chat_id: chatId,
                text: welcomeText,
                parse_mode: "HTML",
                disable_web_page_preview: true
            });

            // Eslatma: /start bosilganda adminga ortiqcha xabar yuborilmaydi (chat to'lib ketmasligi uchun)
            return res.status(200).json({ ok: true });
        }

        // Foydalanuvchi biror xabar (savol, matn, fayl) yozganida:
        // 1. Adminga ixcham, qisqa xabar uzatamiz:
        const adminText = 
`📩 <b>#Murojaat:</b> ${escapeHtml(senderName)} (${senderUsername})
💬 ${escapeHtml(text || "[Media/fayl yuborildi]")}

TG_ID: ${senderId}`;

        await callTelegram("sendMessage", {
            chat_id: ADMIN_CHAT_ID,
            text: adminText,
            parse_mode: "HTML"
        });

        // Agar fayl/rasm bo'lsa adminga forward
        if (msg.photo || msg.document || msg.voice || msg.video || msg.audio) {
            await callTelegram("forwardMessage", {
                chat_id: ADMIN_CHAT_ID,
                from_chat_id: chatId,
                message_id: msg.message_id
            });
        }

        // 2. Foydalanuvchiga faqat bitta ixcham qator:
        await callTelegram("sendMessage", {
            chat_id: chatId,
            text: `✅ <i>Xabaringiz Jaloliddin Mo'minovga yetkazildi.</i>`,
            parse_mode: "HTML",
            reply_to_message_id: msg.message_id
        });

        return res.status(200).json({ ok: true });

    } catch (error) {
        console.error("Webhook processing error:", error);
        return res.status(200).json({ ok: false, error: String(error) });
    }
};
