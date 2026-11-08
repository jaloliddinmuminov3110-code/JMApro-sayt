# JMApro Ilmiy-Muhandislik Markazi (Hub) Arxitekturasi

## 1. Loyiha Konsepsiyasi

`jmapro.uz` shunchaki shaxsiy vizitka yoki portfolio emas, balki olimlar, muhandislar, talabalar va tadqiqotchilar uchun ko'p tarmoqli raqamli markaz (Hub) vazifasini bajaradi. Tizim mantiqiy bog'langan, ammo texnik jihatdan o'z o'rni va funksiyasiga ega bo'lgan quyidagi asosiy bo'limlardan tashkil topadi.

## 2. Tizim Tarkibi va Bo'limlar

### 2.1. Asosiy Portal (Main Portfolio)
* **Bosh sahifa & CV:** Shaxsiy ma'lumotlar, PhD darajasi, yutuqlar, nashrlar statistikasi va aloqa ma'lumotlari.
* **Ta'lim va Resurslar:** O'quv qo'llanmalar, darsliklar va YouTube ilmiy kanaliga (animatsiyalar va darslarga) havolalar.

### 2.2. JMA Alifbo (Amaliy vosita)
* **URL joylashuvi:** `/alifbo` bo'limi.
* **Vazifasi:** Lotin-Kirill-Lotin matnlarini yuqori aniqlikda o'girish tizimi.
* **Tarkibi:** 
  * **Web App:** Brauzerda ishlovchi, yuklab olishni talab qilmaydigan onlayn matn konverteri.
  * **Desktop Installer:** Inno Setup orqali yig'ilgan `.exe` dastur bo'lib, foydalanuvchi kompyuteridagi MS Word dasturi (Startup papkasi)ga makroslarni to'g'ridan-to'g'ri integratsiya qiladi.
  * **Yangilanish mexanizmi:** Makros ichidagi "Yangilash" tugmasi bosilganda brauzer ochilib, saytdagi so'nggi versiya joylashgan sahifaga yo'naltiradi.

### 2.3. Muhandislik Dasturlari va Simulyatorlari
* **Bog'liqligi:** Asosiy saytdagi "IT va Dasturlash" bo'limi bilan uzviy bog'lanadi.
* **Vazifasi:** Muhandislik hisob-kitoblari va jarayonlarni vizualizatsiya qilish (Vizual laboratoriya).
* **Tarkibi:**
  * **JMA Dasturlari:** Yuklab olinadigan maxsus muhandislik va hisob-kitob dasturlari (desktop) arxivi.
  * **Interaktiv Sxemalar (Web Simulators):** Alohida `.html` (HTML5, JS, Canvas/SVG) fayllarda yaratilgan jarayon va qurilmalarning dinamik interaktiv maketlari. 
  * Foydalanuvchi parametrlarni kiritadi va qurilmaning ishlash prinsipini (animatsiya orqali) va hisob natijalarini amalda ko'radi (talabalar uchun vizual anglash vositasi).

### 2.4. Ilmiy Jurnal (Kelgusi strategik maqsad)
* **URL joylashuvi:** `journal.jmapro.uz` (Alohida subdomen).
* **Vazifasi:** Rasmiy ro'yxatdan o'tgan (OAV, ISSN, DOI) xalqaro darajadagi mustaqil ilmiy jurnal platformasi.
* **Texnik Yechim:** OJS (Open Journal Systems) platformasi asosida quriladi (yoki mos keluvchi maxsus CMS).
* **Tarkibi va Jarayonlar:** 
  * Maqola qabul qilish (Submit manuscript).
  * Ko'r-ko'rona taqrizlash tizimi (Blind peer-review workflow).
  * Muallif va muharrir shaxsiy kabinetlari.
  * Yillar va sonlar bo'yicha maqolalar ochiq arxivi (Open Access).

## 3. Rivojlantirish Bosqichlari (Roadmap)

* **1-bosqich: Baza va Amaliyot** 
  JMA Alifbo bo'limini to'liq kodlash va ishga tushirish (Onlayn konverter UI va MS Word Makrosini yozish, Installer tayyorlash).
* **2-bosqich: Vizualizatsiya va Dasturlar** 
  "IT va Dasturlash" bo'limini kengaytirish, birinchi sinov (demo) `.html` vizual laboratoriyani (masalan, Issiqlik almashinish jarayoni) saytga joylashtirish.
* **3-bosqich: Ilmiy Nashriyot** 
  Yuridik hujjatlar va OAV masalalari hal etilgandan so'ng, jurnal subdomenini ko'tarish, OJS'ni o'rnatish, dizaynni Worldofscience.uz kabi jurnallardagi xatolarni hisobga olgan holda mukammal holatga keltirish.