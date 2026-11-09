// JMApro.uz - Telegram Bot Serverless Webhook Handler (24/7 on Vercel)
// Bot: @JMApro_bot | Admin Chat ID: 6471413331 (Jaloliddin Mo'minov)

const fs = require("fs");
const STATE_FILE = "/tmp/jmapro_user_quotas.json";

const BOT_TOKEN = "9039848468:AAEx2BXB2VrWELvm4K71JfQffBFPbhicOXY";
const ADMIN_CHAT_ID = "6471413331";

// -----------------------------------------------------------------
// Kvota (limit) boshqaruvi: Admin javob bermaguncha max 3 ta xabar
// -----------------------------------------------------------------
function loadUserQuotas() {
    try {
        if (fs.existsSync(STATE_FILE)) {
            return JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
        }
    } catch (e) {}
    return {};
}

function saveUserQuotas(quotas) {
    try {
        fs.writeFileSync(STATE_FILE, JSON.stringify(quotas));
    } catch (e) {}
}

const memoryQuotas = loadUserQuotas();

function getUserCount(userId) {
    return memoryQuotas[userId] || 0;
}

function incrementUserCount(userId) {
    memoryQuotas[userId] = (memoryQuotas[userId] || 0) + 1;
    saveUserQuotas(memoryQuotas);
    return memoryQuotas[userId];
}

function resetUserCount(userId) {
    delete memoryQuotas[userId];
    saveUserQuotas(memoryQuotas);
}

// -----------------------------------------------------------------
// Anti-Spam Himoya Mexanizmi: Reklama botlari va fishingni bloklash
// -----------------------------------------------------------------
function isSpamMessage(msg) {
    if (!msg) return { isSpam: false };

    const text = (msg.text || msg.caption || "").toLowerCase();

    // 1. Reklama xabarlaridagi inline tugmalar (Запустить Бот, Перейдите va h.k.)
    if (msg.reply_markup && msg.reply_markup.inline_keyboard && msg.reply_markup.inline_keyboard.length > 0) {
        return { isSpam: true, reason: "inline_keyboard_promo" };
    }

    // 2. Kanallardan yoki boshqa botlardan forward qilingan reklama
    if (msg.forward_from_chat || msg.forward_from) {
        if (text.includes("t.me/") || text.includes("http") || text.includes("бот") || text.includes("bot") || text.includes("канал")) {
            return { isSpam: true, reason: "forwarded_ad" };
        }
    }

    // 3. Spammer va fishing kalit so'zlari (Search bot, probiv, casino, crypto spam)
    const spamKeywords = [
        "поисковый бот",
        "запустить бот",
        "глаз бога",
        "поиск по номеру",
        "поиск по фото",
        "поиск по авто",
        "пробив",
        "деанон",
        "слив фото",
        "взлом",
        "казино",
        "1xbet",
        "melbet",
        "слоты",
        "заработок онлайн",
        "лёгкий заработок",
        "заработок в интернете",
        "инвестиции от",
        "пассивный доход",
        "криптобот",
        "crypto bot",
        "trading signals",
        "pump and dump",
        "airdrop",
        "darknet",
        "вип канал",
        "vip канал",
        "переходи по ссылке",
        "подпишись на наш",
        "девочки 18+",
        "интим знакомства",
        "голые девушки"
    ];

    for (const kw of spamKeywords) {
        if (text.includes(kw)) {
            return { isSpam: true, reason: `keyword: ${kw}` };
        }
    }

    // 4. Boshqa botlarga taklif havolalari (t.me/...bot yoki @...bot)
    if (/t\.me\/[a-zA-Z0-9_]+bot\b/i.test(text) || /tg:\/\/resolve\?domain=[a-zA-Z0-9_]+bot\b/i.test(text)) {
        return { isSpam: true, reason: "bot_invite_link" };
    }

    // 5. Yopiq kanal/guruhlarga qo'shilish havolalari (t.me/+... yoki t.me/joinchat/...)
    if (/t\.me\/\+[a-zA-Z0-9_-]+/i.test(text) || /t\.me\/joinchat\//i.test(text)) {
        return { isSpam: true, reason: "private_invite_link" };
    }

    return { isSpam: false };
}

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
        const senderUsername = from.username ? `@${from.username}` : "mavjud emas";
        const senderId = String(from.id || chatId);

        // -------------------------------------------------------------
        // 1. ADMIN (Jaloliddin Mo'minov) TOMONI
        // -------------------------------------------------------------
        if (chatId === ADMIN_CHAT_ID) {
            // Admin biror xabarga "Reply" (Ответить) qilib yozganida
            if (msg.reply_to_message) {
                let targetUserId = null;

                // 1. Avval entities ichidagi ko'rinmas havola orqali ID ni aniqlaymiz
                const entities = msg.reply_to_message.entities || [];
                for (const ent of entities) {
                    if (ent.url && ent.url.includes("uid=")) {
                        const m = ent.url.match(/uid=(\d+)/);
                        if (m) targetUserId = m[1];
                    }
                }

                // 2. Agar ko'rinmas havolada bo'lmasa, matn ichidan (eski xabarlar uchun fallback)
                if (!targetUserId && msg.reply_to_message.text) {
                    const m = msg.reply_to_message.text.match(/TG_ID:\s*(\d+)/i) || 
                              msg.reply_to_message.text.match(/ID:\s*(\d+)/i);
                    if (m) targetUserId = m[1];
                }

                if (targetUserId) {
                    // Foydalanuvchiga javobni yetkazamiz
                    await callTelegram("sendMessage", {
                        chat_id: targetUserId,
                        text: `💬 <b>Jaloliddin Mo'minovdan javob:</b>\n\n${escapeHtml(text)}`,
                        parse_mode: "HTML"
                    });

                    // Foydalanuvchining xabar limitini nollaymiz (endi u yana 3 ta xabar yozishi mumkin!)
                    resetUserCount(targetUserId);

                    // Adminga atigi 1 so'zli ixcham tasdiq
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
                    text: `👋 Assalomu alaykum, Jaloliddin aka!\n@JMApro_bot faol ishlamoqda. Murojaatlarga "Reply" qilib qisqa javob, shaxsiy username yoki tel raqamingizni yuborishingiz mumkin.`
                });
                return res.status(200).json({ ok: true });
            }

            return res.status(200).json({ ok: true });
        }

        // -------------------------------------------------------------
        // 2. MEHMON / TALABA / FOYDALANUVCHI TOMONI
        // -------------------------------------------------------------

        // Anti-Spam Tekshiruvi: reklama botlari, fishing yoki spam xabarlarni to'xtatish
        const spamCheck = isSpamMessage(msg);
        if (spamCheck.isSpam) {
            console.log(`[SPAM BLOCKED] from ${senderId} (${senderUsername}): ${spamCheck.reason}`);
            // Spammerga javob berilmaydi, adminga ham yuborilmaydi (sukutli blokirovka)
            return res.status(200).json({ ok: true, spam_blocked: true, reason: spamCheck.reason });
        }

        // Foydalanuvchi /start bosganda (1-band: aynan rasmda ko'rsatilgan matn shakli)
        if (text === "/start") {
            const welcomeText = 
`👋 <b>Assalomu alaykum, ${escapeHtml(from.first_name || "foydalanuvchi")}!</b>

<b>Jaloliddin Mo'minov</b>ning rasmiy <b>JMApro</b> aloqa botiga xush kelibsiz.

📚 Ilmiy tadqiqotlar, ilmiy nashrlar, o'quv materiallari va dasturlarga oid
✍️ Savol yoki fikringizni bemalol yozib qoldiring

ℹ️ <i>Eslatma: Bu bot sun'iy intellekt (AI) emas — barcha xabarlar to'g'ridan-to'g'ri Jaloliddin Mo'minovga yetkaziladi va sizga shaxsan javob qaytariladi.</i>

• 🎬 <a href="https://www.youtube.com/@jaloliddinMuminov_yt">YouTube: Ilmiy kanal videolari;</a>
• 🌐 Rasmiy portal: <a href="https://jmapro.uz">jmapro.uz</a>`;

            await callTelegram("sendMessage", {
                chat_id: chatId,
                text: welcomeText,
                parse_mode: "HTML",
                disable_web_page_preview: true
            });

            return res.status(200).json({ ok: true });
        }

        // -------------------------------------------------------------
        // 3-band: Foydalanuvchi xabar yozganda kvota tekshiruvi (Max 3 ta)
        // -------------------------------------------------------------
        const currentCount = getUserCount(senderId);

        if (currentCount >= 3) {
            // Agar foydalanuvchi 3 tadan oshiq yozsa — adminga yuborilmaydi, foydalanuvchiga kutish eslatiladi
            await callTelegram("sendMessage", {
                chat_id: chatId,
                text: `⏳ <i>Iltimos, avvalgi xabarlaringizga javob berilishini kuting. Jaloliddin Mo'minov sizga javob qaytargach, yana xabar yuborishingiz mumkin bo'ladi.</i>`,
                parse_mode: "HTML",
                reply_to_message_id: msg.message_id
            });
            return res.status(200).json({ ok: true });
        }

        // Yangi hisob
        const newCount = incrementUserCount(senderId);

        // -------------------------------------------------------------
        // 2-band: Adminga yuborish (Tg ID ko'rinmas qilib yashiriladi)
        // -------------------------------------------------------------
        // Nol-kenglikdagi ko'rinmas havola orqali ID matnda ko'rinmaydi, lekin Reply qilganda bot uni taniydi
        const hiddenIdTag = `<a href="https://t.me/jmapro?uid=${senderId}">&#8205;</a>`;
        
        const countBadge = newCount > 1 ? ` (${newCount}/3)` : "";
        const adminText = 
`${hiddenIdTag}📩 <b>#Murojaat${countBadge}:</b> ${escapeHtml(senderName)} (${senderUsername})\n` +
`💬 ${escapeHtml(text || "[Media / fayl yuborildi]")}`;

        await callTelegram("sendMessage", {
            chat_id: ADMIN_CHAT_ID,
            text: adminText,
            parse_mode: "HTML"
        });

        // Agar foydalanuvchi fayl/rasm yuborgan bo'lsa, adminga forward
        if (msg.photo || msg.document || msg.voice || msg.video || msg.audio) {
            await callTelegram("forwardMessage", {
                chat_id: ADMIN_CHAT_ID,
                from_chat_id: chatId,
                message_id: msg.message_id
            });
        }

        // Foydalanuvchiga tasdiq (Agar 3-xabar bo'lsa, limit to'lgani bildiriladi)
        let confirmText = `✅ <i>Xabaringiz Jaloliddin Mo'minovga yetkazildi.</i>`;
        if (newCount === 3) {
            confirmText = `✅ <i>Xabaringiz yetkazildi. (Ketma-ket 3 ta xabar yubordingiz. Yangi xabar yuborish uchun Jaloliddin Mo'minovning javobini kuting).</i>`;
        }

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
