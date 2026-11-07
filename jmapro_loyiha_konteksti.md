# Loyiha Konteksti: JMApro.uz - Ilmiy va Muhandislik Portfolio Sayti

## 1. Asosiy Ma'lumotlar va Muallif
* **Domen:** `jmapro.uz` (Xarid qilingan, UZINFOCOM tomonidan tasdiqlanish jarayonida).
* **Muallif:** Mo'minov Jaloliddin Azizjon o'g'li (Texnika fanlari bo'yicha PhD, tadqiqotchi va o'qituvchi).
* **Ta'lim va ilmiy darajalar:**
  * PhD: Neft va gaz kimyosi va texnologiyasi (jarayon va apparatlar yo'nalishi)
  * Magistratura: Kimyo sanoati va qurilish materiallari korxonalarining mashinalari hamda apparatlari (pedagog-tadqiqotchi)
  * Bakalavriat: Texnologik mashinalar va jihozlar (muhandis-mexanik)
* **Aloqa:** `JaloliddinMuminov3110@gmail.com` | Telegram: `@jaloliddinMuminov` | YouTube: `@jaloliddinMuminov_yt`
* **Yo'nalish:** Muhandislik va sanoat texnologiyalari (kimyoviy texnologiya jarayonlari va apparatlari: issiqlik almashinish jarayonlari va havoli sovitish apparatlari - HSA).
* **Loyihaning maqsadi:** Akademik, muhandislik-texnik (issiqlik almashinish jarayonlari va qurilmalari, havoli sovitish apparatlari - HSA, qovurg'alangan quvurlar aerodinamikasi) hamda muhandislik 3D animatsiyalari va hisoblash dasturlari faoliyatini yaxlit namoyish etuvchi markaziy shaxsiy portfolio va resurslar bazasini yaratish.

## 2. Joriy Holat va Infratuzilma (07.11.2026)
* **Jonli havola (Test/Production):** [https://jmapro-sayt.vercel.app](https://jmapro-sayt.vercel.app)
* **GitHub ombori (Repository):** `jmapro-sayt` (Vercel CI/CD ga ulangan).
* **Texnologik stek (Stack):** Sof HTML5 va Tailwind CSS (CDN orqali).
* **Xosting:** Vercel (bepul bulutli hosting, avtomatik deploy).
* **Domen va DNS sozlamalari:**
  * Domen provayderi: `my.eskiz.uz`
  * Vercel'ning A va CNAME yozuvlari tayyorlangan.
  * Domen faollashishi bilan (kutilayotgan vaqt: dushanba kuni) DNS yozuvlari `my.eskiz.uz` boshqaruv paneliga kiritiladi.
* **Fayllar va ma'lumotlar saqlash:** Google Drive (5 TB hajm – maqolalar, darsliklar, 3D modellar va video materiallar uchun).
* **Qayta aloqa (Backend):** Telegram Bot API (`@JMApro_bot`) orqali xabarlarni to'g'ridan-to'g'ri muallifning shaxsiy Telegramiga yetkazish (faol).

## 3. Rivojlanish Bosqichlari va Texnik Strategiya
* **1-bosqich (Joriy – Tejamkor va Tezkor):**
  * Sof HTML + Tailwind CSS bilan barcha asosiy bo'limlarni yaratish.
  * Vercel + GitHub orqali avtomatik yangilanish.
  * Google Drive va Google Sheets integratsiyasi.
* **O'rta bosqich (Ish oqimini qulaylashtirish) - BAJARILDI (07.11.2026):**
  * Git CLI o'rnatildi va kompyuter to'g'ridan-to'g'ri `jaloliddinmuminov3110-code/JMApro-sayt` bilan ulandi.
  * Har bir o'zgarish Antigravity tomonidan avtomatik `git push` orqali Vercel'ga jo'natiladi. Qo'lda fayl yuklash bosqichi to'liq bekor qilindi.
* **2-bosqich (Kelajak – Katta ekotizim):**
  * Issiqlik almashinish qurilmalari va havoli sovitish apparatlarini (HSA) hisoblash uchun interaktiv muhandislik kalkulyatorlari (JS yoki Python/FastAPI/Django).
  * Talabalar va tadqiqotchilar uchun shaxsiy kabinet / avtorizatsiya tizimi zarur bo'lganda mustaqil VPS hostingga ko'chirish.

## 4. Sayt Arxitekturasi (Multi-page Arxitektura)
1. **Bosh sahifa (`index.html`):**
   * Shaxsiy tanishtiruv ("PhD | Tadqiqotchi | Muhandis"), muhandislik 3D fotosurati.
   * Qisqa tarjimai hol va akademik bosqichlar (`#about`).
   * Ilmiy faoliyat ko'rgazmasi (`#research`) -> to'liq sahifa: `research.html`.
   * Ta'lim resurslari ko'rgazmasi (`#teaching`) -> to'liq sahifa: `teaching.html`.
   * YouTube kanali taqdimoti (`#channel`) -> to'liq sahifa: `channel.html`.
   * Interaktiv HSA Muhandislik Kalkulyatori (`#it-calc`).
   * Qayta aloqa formasi (`#contact` - Telegram `@JMApro_bot` ga ulangan).
2. **Ilmiy faoliyat sahifasi (`research.html`):**
   * Xalqaro ilmiy profillar (Google Scholar, Scopus, WoS, ORCID, ResearchGate).
   * 3 ta chuqurlashtirilgan tadqiqot yo'nalishi (HSA, issiqlik tizimlari, CFD tahlil).
   * Interaktiv filtrli nashrlar bazasi (Scopus, OAK, DGU EHM dasturlari).
3. **Ta'lim va Resurslar sahifasi (`teaching.html`):**
   * TMJ yo'nalishi uchun o'qitiladigan fanlar.
   * Ma'ruzalar matni, laboratoriya va amaliy mashg'ulotlar, kurs loyihalari va slaydlar bazasi.
   * Talabalar va magistrantlar uchun ilmiy rahbarlik bo'limi.
4. **YouTube Ilmiy Kanal sahifasi (`channel.html`):**
   * Rasmiy brend: **"Jaloliddin Mo'minov - Ilmiy kanal"** (`@jaloliddinMuminov_yt`).
   * Qizil YouTube obuna tugmasi va dasturiy ta'minot nishonlari (Kompas 3D, SolidWorks, Blender, Ansys Fluent).
   * Mavzuli video to'plamlar va 3D sanoat animatsiyalari buyurtma moduli.

## 5. Ish Oqimi (Workflow)
Saytni yangilash va yuritish tartibi:
1. **AI yordamida (Antigravity):** Matnlar yoki yangi kod aytiladi, Antigravity uni o'zgartirib darhol avtomatik `git push` qiladi.
2. **Qo'lda tahrirlanganda (1-klik):** Foydalanuvchi `index.html`ni o'zi tahrirlasa, papkadagi `saytni_yangilash.bat` fayliga 2 marta bosadi.
3. **Avto-deploy:** Vercel har qanday o'zgarishni 15 soniya ichida qabul qilib, `https://jmapro-sayt.vercel.app` (va `jmapro.uz`) da yangilaydi. Foydalanuvchi brauzer orqali GitHub'ga kirishi umuman talab etilmaydi.

## 6. Navbatdagi Amaliy Qadamlar va Natijalar
1. [x] Yangilangan `index.html` faylini GitHub omboriga yuklash orqali Vercel'dagi jonli saytni yangilash (07.11.2026 da muvaffaqiyatli bajarildi va tekshirildi).
2. [x] Aloqa formasini to'g'ridan-to'g'ri Telegram botga (`@JMApro_bot`) ulash (07.11.2026 da muvaffaqiyatli ulandi va sinovdan o'tkazildi).
3. [x] Rasmiy vektor logotip va muhandislik SVG fonlari (`jmapro-logo-light.svg`, `jmapro-background-light.svg`, `jmapro-background-dark.svg`, `jmapro-icon-512.png`) Header, Hero, YouTube bo'limi va Footerga to'liq tatbiq etildi (08.11.2026).
4. [x] Ilmiy nashrlar (`#research`) bo'limida interaktiv filtr teglari (Scopus, OAK, DGU dasturlari) va xalqaro ilmiy identifikatorlar (Google Scholar, Scopus ID, ORCID, ResearchGate) yaratildi.
5. [x] YouTube `@jaloliddinMuminov_yt` bo'limi sanoat 3D modellar ko'rgazmasi va CAD/CFD dasturiy nishonlari bilan boyitildi.
6. [x] Interaktiv Havoli Sovitish Apparati (HSA) Kalkulyatori (`#it-calc`) yaratildi (mahsulot sarfi, haroratlar va issiqlik uzatish koeffitsientiga qarab issiqlik yuki, logarifmik harorat, zaruriy sirt, quvurlar soni va havo sarfini real vaqtda hisoblaydi).
7. [x] Rasmiy Profile2 kompozitsiyasi (HSA zavodi, 3D CAD/CFD geksagonlari va JMApro.uz brendi bilan) asosiy kartaga joylashtirildi va WebP formatida tezlashtirildi.
8. [x] Foydalanuvchi qulayligi uchun suzuvchi "Scroll to Top" tugmasi qo'shildi.
9. [ ] Domen faollashishi bilanoq `my.eskiz.uz` da Vercel DNS (A va CNAME) yozuvlarini kiritish va SSL sertifikatini tekshirish.
10. [ ] YouTube videolari havolalari muallif tomonidan taqdim etilganda bo'limni real videolar bilan boyitish.
11. [ ] Infografik zamonaviy CV (Section 7) vizual sahifasini ishlab chiqish.

## 7. Reja: Zamonaviy Infografik CV (Interaktiv Rezyume)
* **Konsepsiya:** Standart quruq matnli CV emas, balki markazda muallif portreti joylashgan, atrofida esa shoxlangan zamonaviy infografik vizual bloklar:
  * 🎓 **Akademik unvonlar:** PhD (Neft-gaz kimyosi va texnologiyasi, jarayon va apparatlar), Magistratura, Bakalavriat.
  * 🔬 **Ilmiy natijalar:** Scopus, Acta Polytechnica, ARPN xalqaro maqolalari, DGU dasturlari, iqtiboslar ko'rsatkichi.
  * ⚙️ **Muhandislik yo'nalishlari:** Issiqlik almashinish tizimlari, havoli sovitish apparatlari (HSA), CFD tahlil va aerodinamika.
  * 💻 **Dasturiy kompetensiyalar:** Kompas 3D, SolidWorks, AutoCAD, Blender 3D, Ansys Fluent, Python, Colab.
  * 👨‍🏫 **Pedagogik faoliyat:** TMJ kafedrasi o'qituvchisi, darsliklar va ilmiy rahbarlik.
* **Format:** Sayt ichida alohida interaktiv infografik sahifa/modal hamda yuklab olish uchun yuqori sifatli A4 PDF formatida tayyorlanadi.
