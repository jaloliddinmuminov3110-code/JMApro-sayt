// JMApro.uz - Telegram Bot Serverless Webhook Handler (24/7 on Vercel)
// Bot: @JMApro_bot | Admin Chat ID: 6471413331 (PhD Jaloliddin Mo'minov)

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
    // Brauzer yoki GET so'rovi uchun tekshiruv
    if (req.method !== "POST") {
        return res.status(200).json({
            ok: true,
            status: "active",
            bot: "@JMApro_bot",
            portal: "https://jmapro.uz",
            message: "JMApro Telegram Bot Webhook 24/7 faol ishlamoqda."
        });
    }

    try {
        let update = req.body;
        if (typeof update === "string") {
            try {
                update = JSON.parse(update);
            } catch (err) {
                // not JSON
            }
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
        const senderName = `${from.first_name || ""} ${from.last_name || ""}`.trim() || "Noma'lum foydalanuvchi";
        const senderUsername = from.username ? `@${from.username}` : "Mavjud emas";
        const senderId = String(from.id || chatId);

        // -------------------------------------------------------------
        // 1. ADMIN (Jaloliddin Mo'minov) yozgan holat
        // -------------------------------------------------------------
        if (chatId === ADMIN_CHAT_ID) {
            // Agar admin biror foydalanuvchi xabariga "Reply" (Ответить) qilib yozgan bo'lsa
            if (msg.reply_to_message && msg.reply_to_message.text) {
                const replyText = msg.reply_to_message.text;
                // Xabar ichidan foydalanuvchi Telegram ID sini topamiz
                const match = replyText.match(/TG_ID:\s*(\d+)/i) || replyText.match(/Telegram ID:\s*(\d+)/i);

                if (match && match[1]) {
                    const targetUserId = match[1];

                    // Foydalanuvchiga Jaloliddin aka javobini yuboramiz
                    await callTelegram("sendMessage", {
                        chat_id: targetUserId,
                        text: `👨‍💼 <b>PhD Jaloliddin Mo'minovdan javob:</b>\n\n${escapeHtml(text)}\n\n<i>Savollaringiz bo'lsa yana yozishingiz mumkin.</i>`,
                        parse_mode: "HTML"
                    });

                    // Adminga tasdiq xabari
                    await callTelegram("sendMessage", {
                        chat_id: ADMIN_CHAT_ID,
                        text: `✅ <b>Javobingiz foydalanuvchiga muvaffaqiyatli yetkazildi!</b>\n👤 Qabul qiluvchi ID: <code>${targetUserId}</code>`,
                        parse_mode: "HTML",
                        reply_to_message_id: msg.message_id
                    });

                    return res.status(200).json({ ok: true });
                }
            }

            // Agar admin oddiy /start bosgan bo'lsa
            if (text === "/start") {
                await callTelegram("sendMessage", {
                    chat_id: ADMIN_CHAT_ID,
                    text: `👋 <b>Assalomu alaykum, Jaloliddin aka!</b>\n\n<b>@JMApro_bot</b> 24/7 rejimida Vercel serverless tizimiga ulandi.\n\nFoydalanuvchilar (talabalar, olimlar, mehmonlar) botga xabar yozganda, xabarlar to'g'ridan-to'g'ri shu yerga keladi.\n\nSiz kelgan xabarga Telegram'da <b>"Reply" (Ответить)</b> qilib javob yozsangiz, javobingiz bot nomidan o'sha foydalanuvchiga boradi! 🚀`,
                    parse_mode: "HTML"
                });
                return res.status(200).json({ ok: true });
            }

            return res.status(200).json({ ok: true });
        }

        // -------------------------------------------------------------
        // 2. MEHMON / TALABA / FOYDALANUVCHI yozgan holat
        // -------------------------------------------------------------
        if (text === "/start") {
            const welcomeText = 
`👋 <b>Assalomu alaykum, ${escapeHtml(from.first_name || "Hurmatli foydalanuvchi")}!</b>

Siz PhD Jaloliddin Mo'minovning rasmiy <b>JMApro</b> aloqa va maslahat botiga xush kelibsiz.

<b>Bu yerda siz:</b>
• 📚 Ilmiy tadqiqotlar va nashrlar bo'yicha maslahat;
• 🎓 TMJ fanlari va o'quv materiallari;
• ⚙️ Havoli sovitish apparatlari va issiqlik texnikasi hisoblari;
• 🎬 Muhandislik 3D animatsiyalari (@jaloliddinMuminov_yt);
• 💼 Ilmiy va amaliy hamkorlik takliflarini qoldirishingiz mumkin.

✍️ <b>Savol yoki xabaringizni bemalol shu yerga yozib qoldiring.</b> Xabaringiz to'g'ridan-to'g'ri Jaloliddin Mo'minovga yetkaziladi va tez orada javob qaytariladi!

🌐 Rasmiy portal: <a href="https://jmapro.uz">jmapro.uz</a>`;

            await callTelegram("sendMessage", {
                chat_id: chatId,
                text: welcomeText,
                parse_mode: "HTML",
                disable_web_page_preview: true
            });

            // Adminga yangi foydalanuvchi botni boshlagani haqida bildirish
            await callTelegram("sendMessage", {
                chat_id: ADMIN_CHAT_ID,
                text: `🔔 <b>Yangi foydalanuvchi botni ishga tushirdi:</b>\n\n👤 <b>Ism:</b> ${escapeHtml(senderName)}\n🔗 <b>Username:</b> ${senderUsername}\n🆔 <b>Telegram ID:</b> <code>${senderId}</code>\nTG_ID: ${senderId}`,
                parse_mode: "HTML"
            });

            return res.status(200).json({ ok: true });
        }

        // Agar foydalanuvchi biror xabar (savol, taklif, murojaat) yozgan bo'lsa:
        const now = new Date().toLocaleString("uz-UZ", { timeZone: "Asia/Tashkent" });

        const adminNotification = 
`📩 <b>#YangiMurojaat (Telegram botdan)</b>

👤 <b>Yuboruvchi:</b> ${escapeHtml(senderName)}
🔗 <b>Username:</b> ${senderUsername}
🆔 <b>Telegram ID:</b> <code>${senderId}</code>
⏰ <b>Vaqt:</b> ${now}

💬 <b>Xabar matni:</b>
${escapeHtml(text || "[Matnsiz fayl / media yuborildi]")}

TG_ID: ${senderId}
──────────────────────────────
💡 <i>Ushbu foydalanuvchiga javob berish uchun mazkur xabarga <b>"Reply" (Ответить)</b> qilib yozing!</i>`;

        // 1. Jaloliddin akaga xabarni uzatamiz
        await callTelegram("sendMessage", {
            chat_id: ADMIN_CHAT_ID,
            text: adminNotification,
            parse_mode: "HTML"
        });

        // Agar rasm, hujjat yoki audio bo'lsa, uni ham adminga forward qilamiz
        if (msg.photo || msg.document || msg.voice || msg.video || msg.audio) {
            await callTelegram("forwardMessage", {
                chat_id: ADMIN_CHAT_ID,
                from_chat_id: chatId,
                message_id: msg.message_id
            });
        }

        // 2. Foydalanuvchiga qabul qilinganlik tasdig'ini yuboramiz
        const confirmText = 
`✅ <b>Xabaringiz qabul qilindi!</b>

Murojaatingiz to'g'ridan-to'g'ri Jaloliddin Mo'minovga yetkazildi. Tez orada siz bilan bog'lanamiz yoki shu bot orqali javob beramiz. 

<i>E'tiboringiz va murojaatingiz uchun tashakkur!</i>`;

        await callTelegram("sendMessage", {
            chat_id: chatId,
            text: confirmText,
            parse_mode: "HTML",
            reply_to_message_id: msg.message_id
        });

        return res.status(200).json({ ok: true });

    } catch (error) {
        console.error("Webhook processing error:", error);
        return res.status(200).json({ ok: false, error: String(error) });
    }
};
