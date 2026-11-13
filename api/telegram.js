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
// Anti-Spam Himoya Mexanizmi: Barcha "teshik"larni yopuvchi ko'p bosqichli filtr
// -----------------------------------------------------------------

// Lotin va Kirill o'xshash harflarini normallashtirish (homoglyph bypass)
function normalizeSpamText(str) {
    if (!str) return { raw: "", norm: "", collapsed: "" };
    let raw = str.toLowerCase();
    // Ko'rinmas va maxsus zero-width belgilarni tozalash
    raw = raw.replace(/[\u200B-\u200D\uFEFF\u00AD\u2060\u200E\u200F]/g, "");
    
    const latToCyr = {
        'a': 'а', 'c': 'с', 'e': 'е', 'k': 'к', 'o': 'о',
        'p': 'р', 'x': 'х', 'y': 'у', 'h': 'н', 'm': 'м', 't': 'т'
    };
    let norm = "";
    for (let i = 0; i < raw.length; i++) {
        norm += latToCyr[raw[i]] || raw[i];
    }
    // Bo'shliqlar, nuqta, chiziqcha va maxsus belgilardan tozalangan siqiq shakli
    const collapsed = norm.replace(/[\s\.\-_–—*#•:;,~`\/\\!?\(\)\[\]\{\}]+/g, "");
    return { raw, norm, collapsed };
}

// Xabar ichidagi barcha havolalarni (ochiq matn + entities giperhavolalari) yig'ish
function extractAllLinks(msg) {
    const urls = [];
    const text = ((msg.text || "") + " " + (msg.caption || ""));

    // 1. Ochiq matndagi havolalar (http, https, t.me, tg://)
    const regex = /(https?:\/\/[^\s]+|t\.me\/[^\s]+|telegram\.me\/[^\s]+|tg:\/\/[^\s]+)/gi;
    let match;
    while ((match = regex.exec(text)) !== null) {
        urls.push(match[1]);
    }

    // 2. Rich text entities (ko'rinmas giperhavolalar text_link va mentions)
    const allEntities = [...(msg.entities || []), ...(msg.caption_entities || [])];
    for (const ent of allEntities) {
        if (ent.type === "text_link" && ent.url) {
            urls.push(ent.url);
        } else if (ent.type === "url") {
            const rawUrl = text.substring(ent.offset, ent.offset + ent.length);
            if (rawUrl) urls.push(rawUrl);
        } else if (ent.type === "mention") {
            const mention = text.substring(ent.offset, ent.offset + ent.length);
            if (mention) urls.push(mention);
        }
    }
    return urls;
}

function isSpamMessage(msg) {
    if (!msg) return { isSpam: false };

    // 1. Inline bot orqali yuborilgan xabarlar (via_bot)
    if (msg.via_bot) {
        return { isSpam: true, reason: `via_inline_bot: @${msg.via_bot.username || "unknown"}` };
    }

    // 2. Reklama tugmalari (inline keyboard / reply markup)
    if (msg.reply_markup && (msg.reply_markup.inline_keyboard || msg.reply_markup.keyboard)) {
        return { isSpam: true, reason: "has_reply_markup" };
    }

    // 3. Forward qilingan xabarlar (Kanallar, guruhlar yoki boshqa botlardan)
    // Telegram Bot API 7.0+ (forward_origin) va eski formatlarni to'liq qamrab oladi
    if (msg.forward_from_chat || msg.forward_from || msg.forward_origin || msg.forward_sender_name) {
        if (msg.forward_from_chat && msg.forward_from_chat.type === "channel") {
            return { isSpam: true, reason: "forwarded_from_channel" };
        }
        if (msg.forward_origin && (msg.forward_origin.type === "channel" || msg.forward_origin.type === "chat")) {
            return { isSpam: true, reason: "forward_origin_channel" };
        }
        if (msg.forward_from && msg.forward_from.is_bot) {
            return { isSpam: true, reason: "forwarded_from_bot" };
        }
        if (msg.forward_origin && msg.forward_origin.sender_user && msg.forward_origin.sender_user.is_bot) {
            return { isSpam: true, reason: "forward_origin_bot" };
        }
        const forwardLinks = extractAllLinks(msg);
        if (forwardLinks.length > 0) {
            return { isSpam: true, reason: "forwarded_with_link" };
        }
    }

    // 4. Barcha havolalarni (t.me kanallar, guruhlar, qisqartirilgan havolalar) tekshirish
    const links = extractAllLinks(msg);
    for (const url of links) {
        const u = url.toLowerCase();

        // Ruxsat berilgan rasmiy xavfsiz havolalar
        const isSafe = u.includes("jmapro.uz") || 
                       u.includes("t.me/jaloliddinmuminov") || 
                       u.includes("t.me/jmapro_bot") ||
                       u.includes("youtube.com/@jaloliddinmuminov") ||
                       u.includes("youtu.be");

        if (!isSafe) {
            // Begona Telegram havolalari: har qanday begona kanal, guruh, bot yoki private invite (t.me/..., t.me/+...)
            if (/t\.me\/|telegram\.me\/|tg:\/\/join|tg:\/\/resolve/i.test(u)) {
                return { isSpam: true, reason: `unsolicited_telegram_link: ${url}` };
            }

            // Qisqartirilgan fishing havolalari
            const shorteners = [
                "bit.ly", "tinyurl.com", "clck.ru", "cutt.ly", "is.gd", 
                "vk.cc", "rb.gy", "goo.su", "qps.ru", "v.gd", "t.co", "ow.ly"
            ];
            for (const sh of shorteners) {
                if (u.includes(sh)) {
                    return { isSpam: true, reason: `url_shortener: ${url}` };
                }
            }

            // Kazino, kripto, pul tikish va moliyaviy fishing domenlari
            const badDomains = [
                "1xbet", "melbet", "mostbet", "casino", "aviator", "stake", 
                "slot", "vulkan", "crypto", "binance", "bybit", "airdrop", 
                "invest", "bonus", "dating", "sex", "porn", "intim"
            ];
            for (const bd of badDomains) {
                if (u.includes(bd)) {
                    return { isSpam: true, reason: `spam_domain: ${url}` };
                }
            }
        }
    }

    // 5. Xavfli fayllar (APK, EXE, SCR, BAT, VBS, JS)
    if (msg.document) {
        const fileName = (msg.document.file_name || "").toLowerCase();
        if (/\.(apk|exe|bat|cmd|scr|vbs|js|msi|pif|reg|ps1|sh)$/i.test(fileName)) {
            return { isSpam: true, reason: `dangerous_file: ${fileName}` };
        }
    }

    // 6. Spam media turlari (Kontakt kartasi, so'rovnoma, o'yin, hikoyalar)
    if (msg.contact || msg.poll || msg.game || msg.story) {
        return { isSpam: true, reason: "unsolicited_media_type" };
    }

    // 7. Matn va kalit so'zlar bo'yicha chuqur semantik tekshiruv
    const combinedText = ((msg.text || "") + " " + (msg.caption || "")).trim();
    if (combinedText) {
        const { raw, norm, collapsed } = normalizeSpamText(combinedText);

        const spamPatterns = [
            // Qidiruv / Probiv / Osint
            "поисковый бот", "поисковыйбот", "глаз бога", "глазбога", "поиск по номеру",
            "поиск по фото", "поиск по авто", "пробив", "деанон", "слив фото", "слив данных",
            "взлом", "база данных", "найти человека", "поиск данных", "поиск информации", "запустить бот",

            // Wildberries / Ozon / Ish / Podrabotka
            "wildberries", "вайлдберриз", "вайлдбериз", "ozon", "озон", "мегамаркет",
            "удаленная работа", "удалённая работа", "работа на дому", "подработка", "подработк",
            "ставьте лайки", "ставить лайки", "оплата за лайки", "оплата за отзывы",
            "отзывы за деньги", "выкуп товара", "менеджер маркетплейса", "заработок",
            "заработать", "заработай", "доход от", "лёгкий заработок", "легкий заработок",
            "вакансия на удаленке", "вакансия", "пассивный доход",

            // Kripto / Treyding / Investitsiya
            "криптовалюта", "криптобот", "crypto bot", "trading signals", "pump and dump",
            "airdrop", "раздача usdt", "ноткоин", "blum", "hamster kombat", "арбитраж p2p",
            "арбитраж", "сигналы", "бинанс", "bybit", "binance", "инвестиц", "инвестируй",

            // Kazino / Qimor / Stavka
            "казино", "1xbet", "melbet", "mostbet", "слоты", "авиатор", "aviator",
            "букмекер", "ставки на спорт", "ставк", "договорные матчи", "выигрыш",

            // 18+ / Intim
            "девочки 18+", "интим знакомства", "голые девушки", "слив приват",
            "знакомства 18+", "порно", "проститутки", "секс знакомства",

            // Reklama / Nakrutka
            "накрутка подписчиков", "накрутка", "раскрутка каналов", "раскрутка",
            "рассылка сообщений", "рассылка", "купить рекламу", "вип канал", "vip канал",
            "переходи по ссылке", "подпишись на", "подпишитесь на", "вступай в",
            "вступить в группу", "бесплатный бот",

            // O'zbekcha moliyaviy va spam iboralar
            "kunlik daromad", "onlayn daromad", "uyda o'tirib", "sarmoyasiz daromad",
            "karta raqam", "payme pul", "click pul", "kanalimizga a'zo", "kanalga obuna",
            "obunachi qo'shish", "nakrutka", "pul ishlash", "daromad topish", "sarmoyasiz pul"
        ];

        for (const pattern of spamPatterns) {
            const pNorm = normalizeSpamText(pattern);
            if (raw.includes(pattern) || norm.includes(pNorm.norm) || collapsed.includes(pNorm.collapsed)) {
                return { isSpam: true, reason: `keyword: ${pattern}` };
            }
        }
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

        // Faqat shaxsiy (1-ga-1) chatlardan xabarlarni qabul qilamiz!
        // Guruhlar yoki kanallardan botga kelgan har qanday xabarni e'tiborsiz qoldiramiz
        if (msg.chat && msg.chat.type && msg.chat.type !== "private") {
            return res.status(200).json({ ok: true, ignored: "non_private_chat" });
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
