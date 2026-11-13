# Loyiha Konteksti: JMApro Ilmiy-Muhandislik Markazi (Hub)

## 1. Asosiy Ma'lumotlar va Muallif
* **Domen:** `jmapro.uz` (UZINFOCOM tomonidan tasdiqlangan, Vercel'ga to'liq ulangan va SSL xavfsizlik sertifikati faol).
* **Jonli rasmiy havola:** [https://jmapro.uz](https://jmapro.uz) (va [https://www.jmapro.uz](https://www.jmapro.uz))
* **Muallif:** Mo'minov Jaloliddin Azizjon o'g'li (Texnika fanlari bo'yicha PhD, tadqiqotchi, muhandis va o'qituvchi).
* **Ta'lim va ilmiy darajalar:**
  * PhD: Neft va gaz kimyosi va texnologiyasi (jarayon va apparatlar yo'nalishi)
  * Magistratura: Kimyo sanoati va qurilish materiallari korxonalarining mashinalari hamda apparatlari (pedagog-tadqiqotchi)
  * Bakalavriat: Texnologik mashinalar va jihozlar (muhandis-mexanik)
* **Aloqa:** `JaloliddinMuminov3110@gmail.com` | Telegram: `@jaloliddinMuminov` | Rasmiy Telegram Bot: `@JMApro_bot` | YouTube: `Jaloliddin Mo'minov - Ilmiy kanal` (`@jaloliddinMuminov_yt`)
* **Yo'nalish:** Muhandislik va sanoat texnologiyalari (kimyoviy texnologiya jarayonlari va apparatlari: issiqlik almashinish jarayonlari va havoli sovitish apparatlari - HSA).
* **Loyihaning Katta Konsepsiyasi:** `JMApro.uz` — shunchaki shaxsiy portfolio yoki vizitka sayt emas, balki olimlar, muhandislar, talabalar va tadqiqotchilar uchun mo'ljallangan **ko'p tarmoqli raqamli markaz (Hub)** va ilmiy-amaliy ekotizimdir.

## 2. Joriy Holat va Infratuzilma (08.11.2026)
* **Jonli havola (Production):** [https://jmapro.uz](https://jmapro.uz) (va [https://www.jmapro.uz](https://www.jmapro.uz))
* **GitHub ombori:** `jaloliddinmuminov3110-code/JMApro-sayt` (Vercel CI/CD ga ulangan, avtomatik deploy).
* **Texnologik stek:** Sof HTML5, Tailwind CSS, JavaScript (Vanilla Canvas/SVG/DOM), Vercel Hosting.
* **Domen va DNS sozlamalari:**
  * Domen provayderi: `my.eskiz.uz`
  * Asosiy domen (A Record): `jmapro.uz` -> `216.198.79.1` (Vercel individual Anycast IP)
  * Subdomen (CNAME Record): `www.jmapro.uz` -> `3a390ef50b2c1cde.vercel-dns-017.com` (Vercel individual CNAME)
  * Domen UZINFOCOM tomonidan tasdiqlandi va faol holatda.
* **Qayta aloqa (Backend):** Telegram Bot API (`@JMApro_bot`, Token va Chat ID `6471413331` bilan to'g'ridan-to'g'ri integratsiya qilingan). Vercel serverless webhook (`/api/telegram`) orqali 24/7 ikki tomonlama (Two-way communication) xabarlashuv tizimi ishga tushirildi.
* **Arxitektura:** Ko'p sahifali (Multi-page) modulli tizim: `index.html` (`/`), `alifbo.html` (`/alifbo`), `research.html` (`/research`), `teaching.html` (`/teaching`), `channel.html` (`/channel`). `vercel.json` orqali toza havolalar (Clean URLs - `.html`siz) yo'lga qo'yilgan. Serverless API: `/api/telegram`.

## 3. Markaziy Arxitektura va Modullar (JMApro Ekotizimi)

Tizim mantiqiy bog'langan, ammo texnik jihatdan mustaqil bo'lgan quyidagi 4 ta asosiy blokdan iborat:

### 3.1. Asosiy Portal (Main Portal & Portfolio)
* **Bosh sahifa (`index.html`):** Shaxsiy taqdimot ("PhD | Tadqiqotchi | Muhandis"), 3D muhandislik portret kartasi, ko'rsatkichlar, qisqa tarjimai hol, tezkor sarhisoblar va interaktiv HSA kalkulyatori.
* **Ilmiy Faoliyat (`research.html`):** Xalqaro ilmiy profillar (Google Scholar, Scopus, WoS, ORCID, ResearchGate), 3 ta asosiy tadqiqot yo'nalishi (HSA, issiqlik tizimlari, CFD tahlil) hamda filtrli to'liq nashrlar bazasi (Scopus, OAK, DGU dasturlari).
* **Ta'lim va Resurslar (`teaching.html`):** TMJ yo'nalishi bo'yicha o'qitiladigan fanlar, ma'ruzalar matni, laboratoriya ko'rsatmalari, kurs loyihalari va slaydlar bazasi hamda ilmiy rahbarlik.
* **YouTube Ilmiy Kanal (`channel.html`):** "Jaloliddin Mo'minov - Ilmiy kanal" (@jaloliddinMuminov_yt), 3D animatsiyalar, video to'plamlar va sanoat korxonalari uchun 3D vizualizatsiya xizmatlari.

### 3.2. JMA Alifbo (Amaliy Lingvistik Vosita)
* **URL joylashuvi:** `https://jmapro.uz/alifbo` (Clean URL, `alifbo.html`).
* **Vazifasi:** Lotin-Kirill-Lotin matnlarini yuqori aniqlikda, o'zbek tili orfografik qoidalariga to'liq rioya qilgan holda o'girish tizimi (apostrof, tutuq belgisi, sh, ch, ng, yo, yu, ya qoidalari, 625 ta lug'at istisnolari va yangi qabul qilingan alifbo: ō, ğ, ş, ç).
* **Tarkibi:**
  1. **Web App (Onlayn Veb-Konverter):** Brauzerning o'zida 100% client-side ishlovchi (`assets/alifbo/alifbo-engine.js`), xavfsiz (matn serverga jo'natilmaydi), 847 ta golden test holatlaridan 100% muvaffaqiyatli o'tgan dvigatel. Jonli alifboni avtomatik aniqlash (`Auto-detect`), ikki tomonlama o'girish, tezkor nusxalash, TXT eksport va maxsus harflar virtual klaviaturasi.
  2. **Universal Desktop Installer (`downloads/JMA-Alifbo-Setup-1.3.exe`):** Inno Setup orqali yig'ilgan yagona 14.4 MB universal o'rnatuvchi. 1 ta fayl ichida:
     - Mustaqil Desktop dastur (`Program Files\JMA\JMA Alifbo` + Desktop yorlig'i);
     - MS Word uchun VBA makrosi (`STARTUP` papkasiga `JMA-Alifbo-Word.dotm`);
     - MS Excel uchun plagin (`XLSTART` papkasiga `JMA-Alifbo-Excel.xlam`);
     - Qaytarish (Undo / Ctrl+Z) integratsiyasi, tezkor klavishlar: `Alt+Q`, `Alt+W`, `Alt+E`;
     - Xavfsiz zaxira (`%LOCALAPPDATA%\JMA\AlifboOffice`) va Windows Ilovalari orqali toza o'chirish (Uninstall).
  3. **Yangilanish mexanizmi:** Desktop dastur va Office makrosidagi "Yangilash" tugmasi to'g'ridan-to'g'ri `https://jmapro.uz/alifbo` sahifasiga ulanadi.
  4. **Arxiv:** Oldingi barqaror v1.2 nashri (`downloads/JMA-Alifbo-1.2.exe`) arxiv sifatida saqlangan.

### 3.3. Muhandislik Dasturlari va Vizual Simulyatorlar (Vizual Laboratoriya)
* **Bog'liqligi:** Asosiy saytdagi muhandislik kalkulyatorlari va "IT & Dasturlash" bo'limi bilan uzviy integratsiya.
* **Vazifasi:** Murakkab issiqlik-massa almashinuv va gidrodinamik jarayonlarni real vaqtda modellashtirish va talabalar uchun vizual anglash vositasi yaratish.
* **Tarkibi:**
  1. **JMA Muhandislik Dasturlari:** Muallif tomonidan ishlab chiqilgan va DGU guvohnomalariga ega bo'lgan yuklab olinuvchi desktop dasturlar va hisoblash skriptlari arxivi.
  2. **Interaktiv Veb-Simulyatorlar (Web Simulators):** HTML5 Canvas, SVG va JavaScript yordamida qurilgan dinamik interaktiv sxemalar (masalan, Issiqlik almashinish jarayoni, quvurlar bo'ylab harorat gradiyenti o'zgarishi, havoli sovitish apparati ventilyatori tezligining sovish dinamikasiga ta'siri). Foydalanuvchi parametrlarni o'zgartirganida jarayon animatsiyasi va hisob natijalari ko'z o'ngida jonlanadi.

### 3.4. Ilmiy Jurnal Platformasi (`journal.jmapro.uz`) — Kelgusi Strategik Maqsad
* **URL joylashuvi:** `journal.jmapro.uz` (Alohida mustaqil subdomen).
* **Vazifasi:** Rasmiy ro'yxatdan o'tgan (OAV guvohnomasi, ISSN, DOI, Crossref) xalqaro darajadagi mustaqil ilmiy jurnal platformasi.
* **Texnik Yechim:** OJS (Open Journal Systems) platformasi yoki maxsus ishlab chiqiladigan zamonaviy akademik CMS.
* **Tarkibi va Jarayonlar:**
  * Mualliflar uchun maqola yuborish (Submit manuscript) onlayn tizimi;
  * Ikki tomonlama yashirin taqrizlash tizimi (Double-blind peer-review workflow);
  * Muallif, taqrizchi va bosh muharrir shaxsiy kabinetlari;
  * Yillar va sonlar bo'yicha to'liq ochiq kirish (Open Access) ilmiy maqolalar arxivi;
  * Worldofscience.uz va boshqa jurnallardagi tizimli xato va kamchiliklarni hisobga olgan holda mukammal, xalqaro indeksatsiyaga (Scopus/WoS talablariga) mos arxitektura.

## 4. Rivojlantirish Bosqichlari (Strategik Roadmap)

* **1-bosqich: Baza va Amaliyot (Joriy navbatdagi vazifa)**
  * JMA Alifbo bo'limini (`/alifbo`) to'liq yaratish va ishga tushirish.
  * Onlayn Web App konverter UI interfeysini ishlab chiqish.
  * MS Word uchun VBA makrosini yaratish va Inno Setup orqali `.exe` installer tayyorlash mexanizmini yo'lga qo'yish.
* **2-bosqich: Vizualizatsiya va Dasturlar (Vizual Laboratoriya)**
  * "IT va Muhandislik dasturlari" bo'limini kengaytirish.
  * Birinchi sinov (demo) interaktiv veb-simulyatorini yaratish (masalan: Havoli Sovitish Apparatida issiqlik almashinish jarayonining dinamik animatsiyali HTML5 simulyatori).
  * Yuklab olinuvchi dasturlar katalogi va qo'llanmalarini joylashtirish.
* **3-bosqich: Ilmiy Nashriyot (`journal.jmapro.uz`)**
  * Yuridik hujjatlar, OAV va nashriyot ro'yxatdan o'tish masalalari hal etilgach, jurnal subdomenini ko'tarish.
  * OJS platformasini o'rnatish va moslashtirish, xalqaro indeksatsiya talablariga javob beradigan akademik dizayn yaratish.

## 5. Ish Oqimi (Workflow)
Saytni yangilash va yuritish tartibi:
1. **AI yordamida (Antigravity):** Yangi bo'limlar, sahifalar yoki dasturiy kodlar yaratilganda avtomatik sinovdan o'tkazilib, `git push` orqali Vercel'ga uzatiladi.
2. **Qo'lda tahrirlanganda (1-klik):** Foydalanuvchi fayllarni o'zi tahrirlasa, papkadagi `saytni_yangilash.bat` fayliga 2 marta bosadi.
3. **Avto-deploy:** Vercel har qanday o'zgarishni 15 soniya ichida qabul qilib, rasmiy `https://jmapro.uz` (va `https://www.jmapro.uz`) da yangilaydi.

## 6. Bajarilgan Ishlar va Navbatdagi Amaliy Reja
* [x] Yangilangan `index.html` faylini GitHub omboriga yuklash orqali Vercel'dagi jonli saytni yangilash.
* [x] Aloqa formasini to'g'ridan-to'g'ri Telegram botga (`@JMApro_bot`) ulash (Token va Chat ID `6471413331`).
* [x] Rasmiy vektor logotip va muhandislik SVG fonlari Header, Hero va Footerga to'liq tatbiq etildi.
* [x] Ko'p sahifali (Multi-page) arxitektura yo'lga qo'yildi: `research.html`, `teaching.html`, `channel.html`.
* [x] Yangi 3D muhandislik portret kartasi (`JMApro_3D_portret_1variant_yuz.jpg`) asosiy sahifaga o'rnatildi va WebP formatida tezlashtirildi.
* [x] Navigatsiya paneli yuqori kontrastli shriftlar va mos piktogrammalar (ikokalar) bilan boyitildi.
* [x] Saytning barcha sahifalari yuqori qismiga (Head/Header) o'ngdan chapga uzluksiz harakatlanuvchi zamonaviy animatsion **"Sayt test rejimida ishlamoqda"** lentasi (Marquee ticker) o'rnatildi.
* [x] Brauzer manzili panelidan `.html` kengaytmasi to'liq olib tashlandi (Clean URLs: `jmapro.uz/research`, `jmapro.uz/teaching`, `jmapro.uz/channel`).
* [x] `@JMApro_bot` 24/7 serverless webhook tizimiga ulandi (`/api/telegram`), istalgan akkauntdan yozilgan xabarlar Jaloliddin Mo'minovga yetkaziladi va Telegram'da "Reply" qilish orqali to'g'ridan-to'g'ri foydalanuvchiga javob qaytarish imkoniyati yaratildi.
* [x] `@JMApro_bot` salomlashuvi rasmiy matnga moslashtirildi, TG ID ko'rinmas qilib yashirildi, va admin javob bermagunicha foydalanuvchiga ketma-ket maksimal 3 ta xabar cheklovi (anti-spam kvota) o'rnatildi.
* [x] **JMA Alifbo ekotizimi sahifasi (`/alifbo`)** to'liq ishga tushirildi: Onlayn veb-konverter maydoni (100% offline, 847/847 golden testlardan o'tgan dvigatel), So'nggi v1.3 universal Inno Setup o'rnatuvchisi (`JMA-Alifbo-Setup-1.3.exe` va `.zip`), SmartScreen/Chrome tushuntirishlari, v1.2 arxiv versiyasi va Office makroslari integratsiyasi.
* [x] **SEO va Ijtimoiy tarmoqlar (Open Graph):** Telegram va boshqa tarmoqlarda havola yuborilganda chiroyli va ixcham chiqishi uchun barcha sahifalardan "PhD" prefiksi olib tashlanib, toza taqdimot holatiga keltirildi.
* [x] **Telegram Bot (@JMApro_bot) Anti-Spam tizimi (2-bosqich, to'liq yopilgan):** Spamerlarning barcha "teshik"lari (ko'rinmas giperhavolalar `entities: text_link`, kanallardan repostlar `forward_origin`, inline botlar `via_bot`, orasi ochiq va aralash lotin-kirill so'zlar `homoglyphs`, har qanday begona Telegram kanal/guruh havolalari `t.me/...`, xavfli fayllar `.apk` va qisqartirilgan fishing havolalari) ko'p qatlamli chuqur filtr orqali to'liq yopildi.
* [x] YouTube tugmalari rasmiy qizil rangda **"Jaloliddin Mo'minov - Ilmiy kanal"** (`@jaloliddinMuminov_yt`) nomi ostida yangilandi.
* [x] Interaktiv Havoli Sovitish Apparati (HSA) Kalkulyatori yaratildi.
* [ ] **Navbatdagi 1-vazifa:** Issiqlik almashinish jarayonining interaktiv veb-simulyatori (Vizual laboratoriya demo maketi).
* [ ] **Navbatdagi 2-vazifa:** Zamonaviy Infografik CV sahifasini ishlab chiqish.
* [ ] **Kelgusi 3-vazifa:** `journal.jmapro.uz` ilmiy jurnal loyihasi infratuzilmasini tayyorlash.

## 7. Reja: Zamonaviy Infografik CV (Interaktiv Rezyume)
* **Konsepsiya:** Standart quruq matnli CV emas, balki markazda muallif portreti joylashgan, atrofida esa shoxlangan zamonaviy infografik vizual bloklar:
  * 🎓 **Akademik unvonlar:** PhD (Neft-gaz kimyosi va texnologiyasi, jarayon va apparatlar), Magistratura, Bakalavriat.
  * 🔬 **Ilmiy natijalar:** Scopus, Acta Polytechnica, ARPN xalqaro maqolalari, DGU dasturlari, iqtiboslar ko'rsatkichi.
  * ⚙️ **Muhandislik yo'nalishlari:** Issiqlik almashinish tizimlari, havoli sovitish apparatlari (HSA), CFD tahlil va aerodinamika.
  * 💻 **Dasturiy kompetensiyalar:** Kompas 3D, SolidWorks, AutoCAD, Blender 3D, Ansys Fluent, Python, Colab.
  * 👨‍🏫 **Pedagogik faoliyat:** TMJ kafedrasi o'qituvchisi, darsliklar va ilmiy rahbarlik.
* **Format:** Sayt ichida alohida interaktiv infografik sahifa/modal hamda yuklab olish uchun yuqori sifatli A4 PDF formatida tayyorlanadi.
