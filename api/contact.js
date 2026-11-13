// JMApro.uz - Secure Contact Form Serverless Handler (Vercel)
// Receives contact inquiries from jmapro.uz and sends them to Admin Telegram
// Admin Chat ID: 6471413331 | Bot: @JMApro_bot

const BOT_TOKEN = "9039848468:AAEx2BXB2VrWELvm4K71JfQffBFPbhicOXY";
const ADMIN_CHAT_ID = "6471413331";

// In-memory IP rate limiter: max 3 submissions per IP per 10 minutes
const ipRequests = new Map();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 3;

function isRateLimited(ip) {
    if (!ip) return false;
    const now = Date.now();
    const records = ipRequests.get(ip) || [];
    const validRecords = records.filter(ts => now - ts < RATE_LIMIT_WINDOW_MS);
    if (validRecords.length >= MAX_REQUESTS_PER_WINDOW) {
        return true;
    }
    validRecords.push(now);
    ipRequests.set(ip, validRecords);
    return false;
}

function escapeHtml(text) {
    if (!text) return "";
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function normalizeSpamText(str) {
    if (!str) return { raw: "", norm: "", collapsed: "" };
    let raw = str.toLowerCase();
    raw = raw.replace(/[\u200B-\u200D\uFEFF\u00AD\u2060\u200E\u200F]/g, "");
    
    const latToCyr = {
        'a': 'а', 'c': 'с', 'e': 'е', 'k': 'к', 'o': 'о',
        'p': 'р', 'x': 'х', 'y': 'у', 'h': 'н', 'm': 'м', 't': 'т'
    };
    let norm = "";
    for (let i = 0; i < raw.length; i++) {
        norm += latToCyr[raw[i]] || raw[i];
    }
    const collapsed = norm.replace(/[\s\.\-_–—*#•:;,~`\/\\!?\(\)\[\]\{\}]+/g, "");
    return { raw, norm, collapsed };
}

function isSpam(fullName, contactInfo, message) {
    const combined = `${fullName || ""} ${contactInfo || ""} ${message || ""}`.trim();
    if (!combined) return { isSpam: true, reason: "empty_content" };

    const { raw, norm, collapsed } = normalizeSpamText(combined);

    // 1. URL va havolalarni tekshirish
    const urlMatches = combined.match(/(https?:\/\/[^\s]+|t\.me\/[^\s]+|telegram\.me\/[^\s]+|tg:\/\/[^\s]+)/gi) || [];
    for (const url of urlMatches) {
        const u = url.toLowerCase();
        const isSafe = u.includes("jmapro.uz") || 
                       u.includes("t.me/jaloliddinmuminov") || 
                       u.includes("t.me/jmapro_bot") ||
                       u.includes("youtube.com") || 
                       u.includes("youtu.be") ||
                       u.includes("scholar.google.com") ||
                       u.includes("orcid.org") ||
                       u.includes("researchgate.net");

        if (!isSafe) {
            // Begona Telegram havolalari
            if (/t\.me\/|telegram\.me\/|tg:\/\/join|tg:\/\/resolve/i.test(u)) {
                return { isSpam: true, reason: `unsolicited_telegram_link: ${url}` };
            }

            // Qisqartirilgan havolalar
            const shorteners = [
                "bit.ly", "tinyurl.com", "clck.ru", "cutt.ly", "is.gd", 
                "vk.cc", "rb.gy", "goo.su", "qps.ru", "v.gd", "t.co", "ow.ly"
            ];
            for (const sh of shorteners) {
                if (u.includes(sh)) {
                    return { isSpam: true, reason: `url_shortener: ${url}` };
                }
            }

            // Kazino, kripto, porn va moliyaviy fishing
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

    // 2. Begona bot mentionlari (@...bot)
    if (/@\w+bot\b/i.test(combined) && !/@jmapro_bot\b/i.test(combined)) {
        return { isSpam: true, reason: "foreign_bot_mention" };
    }

    // 3. Kalit so'zlar bo'yicha chuqur tekshiruv
    const spamPatterns = [
        "поисковый бот", "поисковыйбот", "глаз бога", "глазбога", "поиск по номеру",
        "поиск по фото", "поиск по авто", "пробив", "деанон", "слив фото", "слив данных",
        "взлом", "база данных", "найти человека", "поиск данных", "поиск информации", "запустить бот",
        "wildberries", "вайлдберриз", "вайлдбериз", "ozon", "озон", "мегамаркет",
        "удаленная работа", "удалённая работа", "работа на дому", "подработка", "подработк",
        "ставьте лайки", "ставить лайки", "оплата за лайки", "оплата за отзывы",
        "отзывы за деньги", "выкуп товара", "менеджер маркетплейса", "заработок",
        "заработать", "заработай", "доход от", "лёгкий заработок", "легкий заработок",
        "вакансия на удаленке", "вакансия", "пассивный доход",
        "криптовалюта", "криптобот", "crypto bot", "trading signals", "pump and dump",
        "airdrop", "раздача usdt", "ноткоин", "blum", "hamster kombat", "арбитраж p2p",
        "арбитраж", "сигналы", "бинанс", "bybit", "binance", "инвестиц", "инвестируй",
        "казино", "1xbet", "melbet", "mostbet", "слоты", "авиатор", "aviator",
        "букмекер", "ставки на спорт", "ставк", "договорные матчи", "выигрыш",
        "девочки 18+", "интим знакомства", "голые девушки", "слив приват",
        "знакомства 18+", "порно", "проститутки", "секс знакомства",
        "накрутка подписчиков", "накрутка", "раскрутка каналов", "раскрутка",
        "рассылка сообщений", "рассылка", "купить рекламу", "вип канал", "vip канал",
        "переходи по ссылке", "подпишись на", "подпишитесь на", "вступай в",
        "вступить в группу", "бесплатный бот",
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

    return { isSpam: false };
}

module.exports = async (req, res) => {
    // Faqat POST so'rovlarni qabul qilamiz
    if (req.method !== "POST") {
        return res.status(200).json({ ok: true, service: "JMApro Contact API" });
    }

    try {
        let body = req.body;
        if (typeof body === "string") {
            try { body = JSON.parse(body); } catch (e) {}
        }

        const clientIp = req.headers["x-forwarded-for"] || req.headers["x-real-ip"] || (req.socket && req.socket.remoteAddress) || "unknown";

        const fullName = (body.fullName || "").trim();
        const contactInfo = (body.contactInfo || "").trim();
        const subject = (body.subject || "Umumiy").trim();
        const message = (body.message || "").trim();
        const hpField = (body.hpField || "").trim(); // Honeypot trap
        const duration = Number(body.duration) || 0; // Time trap

        // 1. Honeypot tekshiruvi: Agar robot ko'rinmas qopqonni to'ldirgan bo'lsa -> jimjit bloklash
        if (hpField !== "") {
            console.log(`[HONEYPOT BLOCKED] Bot detected from IP: ${clientIp}`);
            // Spamerga soxta muvaffaqiyat qaytaramiz, lekin Telegramga yubormaymiz
            return res.status(200).json({ ok: true, status: "sent" });
        }

        // 2. Time-trap tekshiruvi: Agar forma ochilgach 2 soniyadan kam vaqtda yuborilgan bo'lsa (odam bunchalik tez yoza olmaydi)
        if (duration > 0 && duration < 2) {
            console.log(`[TIMETRAP BLOCKED] Submission too fast (${duration}s) from IP: ${clientIp}`);
            return res.status(200).json({ ok: true, status: "sent" });
        }

        // 3. Majburiy maydonlar mavjudligi va uzunligi
        if (!fullName || !contactInfo || !message) {
            return res.status(400).json({ ok: false, error: "Barcha majburiy maydonlarni to'ldiring." });
        }
        if (fullName.length < 2 || contactInfo.length < 3 || message.length < 5) {
            return res.status(400).json({ ok: false, error: "Ma'lumotlar juda qisqa." });
        }

        // 4. IP Rate-limiting (har 10 daqiqada ko'pi bilan 3 ta murojaat)
        if (isRateLimited(clientIp)) {
            console.log(`[RATELIMIT BLOCKED] Too many requests from IP: ${clientIp}`);
            return res.status(429).json({ ok: false, error: "Iltimos, birozdan so'ng qayta urinib ko'ring (tez-tez yuborish cheklangan)." });
        }

        // 5. Anti-Spam semantik tekshiruvi
        const spamCheck = isSpam(fullName, contactInfo, message);
        if (spamCheck.isSpam) {
            console.log(`[CONTACT SPAM BLOCKED] from ${clientIp}: ${spamCheck.reason}`);
            // Spamerga soxta muvaffaqiyat qaytaramiz (qayta urinmasligi uchun)
            return res.status(200).json({ ok: true, status: "sent" });
        }

        // 6. Haqiqiy toza xabarni Telegramga xavfsiz yetkazish
        const now = new Date().toLocaleString("uz-UZ", { timeZone: "Asia/Tashkent" });
        const telegramText = 
`🔔 <b>JMApro.uz saytidan yangi murojaat!</b>

👤 <b>F.I.Sh:</b> ${escapeHtml(fullName)}
📞 <b>Aloqa:</b> ${escapeHtml(contactInfo)}
📌 <b>Mavzu:</b> ${escapeHtml(subject)}
💬 <b>Xabar:</b>
${escapeHtml(message)}

🕒 <i>Vaqt: ${now}</i>`;

        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: ADMIN_CHAT_ID,
                text: telegramText,
                parse_mode: "HTML"
            })
        });

        const result = await response.json();

        if (result.ok) {
            return res.status(200).json({ ok: true, status: "sent" });
        } else {
            console.error("Telegram API error:", result);
            return res.status(500).json({ ok: false, error: "Telegramga yetkazishda xatolik yuz berdi." });
        }

    } catch (error) {
        console.error("Contact handler error:", error);
        return res.status(500).json({ ok: false, error: "Server ichki xatosi." });
    }
};
