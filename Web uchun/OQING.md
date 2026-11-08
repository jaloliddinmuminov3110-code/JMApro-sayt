# JMA Alifbo — web uchun ma'lumotlar

Nusxa: 2026-11-09. Dastur V1.3, konvertatsiya yadrosi V1.2.
Bu papka veb-konvertor yaratish uchun ma'lumot va etalon algoritm to'plami.
Tayyor JavaScript konvertori yoki o'rnatuvchi emas. Asosiy loyiha o'zgarmaydi.

## Qaysi fayllar kerak?

- `rules.json` — to'rtta yangi lotin birikmasi va 625 yo'nalishli istisno:
  lotin -> kirill 313; kirill -> lotin 312 yozuv. Bular 625 xil so'z degani emas.
- `web-data.json` — alifbo IDlari, harf xaritalari, apostroflar, regex
  namunalari, imlo eslatmalari, limitlar va sayt havolalari.
- `converter.py` — ishlayotgan dasturdan aynan olingan etalon algoritm.
  `safety.py` — uning bevosita bog'liqligi; uchinchi tomon paketi kerak emas.
- `text_files.py` — TXT import/eksport uchun ixtiyoriy Python etaloni.
- `data/ts_words_source.tsv` — Ц lug'atining xom manba jadvali.
- `data/SOURCES.md` — manbalar, chiqarib tashlangan xatolar va saralash izohi.
  Ishlaydigan veb-dastur xom TSV emas, tekshirilgan rules.json dan foydalansin.
- `tools/build_lexicon.py` — lug'atni qayta yig'ish yordamchisi (odatiy
  ishlashda kerak emas; ishga tushirilsa SHU papkadagi rules.json ni yangilaydi).
- `tests/golden_cases.json` — **847** kirish/natija misoli. 667 tasi
  Word/Excel bilan solishtirilgan to'plamdan; qolganlari vebdagi yo'nalishlar,
  aralash yozuv, Unicode va chegaraviy misollar. IDlar Python/Office raqamlari
  o'rniga `auto`, `latin`, `new_latin`, `cyrillic` bilan berilgan.
- `tests/test_*.py` — mavjud yadro va xavfsizlik regressiya testlari.
- `assets/` — original logo, kichik PNG va ICO. `namuna*.txt` — namunalar.
- `MANIFEST.json` — nusxalangan/generatsiya qilingan fayllar SHA-256 qiymatlari.

## JavaScript'ga ko'chirish tartibi

1. Boshlang'ich tanlov: manba `auto`, natija `new_latin`.
2. Harf xaritasi bilan cheklanib qolmang: converter.py dagi tokenlash,
   aralash so'z ichidagi alohida kirill/lotin bo'laklari, NFC, apostroflar,
   katta/kichik harflar va istisnolarni qo'llash tartibini saqlang.
3. Istisno avval aniq so'zga, keyin eng uzun Ц asosiga va faqat qo'llab-
   quvvatlangan to'liq qo'shimcha zanjiriga qo'llanadi. Har qanday `s`ni `ц`
   qilish yoki har qanday `ts`ni `ц`ga aylantirish mumkin emas.
4. е/э, ё/yo, yo', ъ/ь va s'h kabi kontekstli qoidalar JSON harf
   xaritalariga to'liq sig'maydi; converter.py da bajarilish tartibi bor.
5. Python regexlarini JS ga to'g'ridan-to'g'ri ko'chirmang: Unicode harflari,
   fullmatch, titlecase/isupper va code-point hisoblash farqlarini moslang.
   Belgilarni DOMga chiqarishda textContent yoki textarea.value ishlating;
   foydalanuvchi matnini innerHTML sifatida qo'ymang.
6. JavaScript natijasini golden_cases.json dagi expected bilan solishtiring.
   warnings va detected ham etalon sifatida berilgan. Xatoliklarni yashirin
   imlo tuzatish bilan berkitmang: senariy/episentr uchun faqat eslatma bor.
7. Lotin/kirill ortga konvertatsiya har doim asl matnni tiklamaydi.
   Bu umumiy imlo tekshiruvchisi yoki tarjimon emas, alifbo konvertori.

Yadro manba tanlovi qiymatini tekshiradi, lekin aralash yozuvni barcha manba
rejimlarida natija alifbosiga o'tkazadi. Bu xatti-harakatni testlar bilan
saqlang; faqat tanlangan manbaga tegishli harflarni o'girish bilan cheklamang.

Veb matn konvertori uchun EXE, Word/Excel VBA, loyiha parollari yoki
Windows o'rnatuvchi kerak emas. Ular bu papkaga kiritilmagan.
Brending rasmlari ixtiyoriy. Onlayn matnni serverga yubormasdan brauzerning
o'zida qayta ishlash mumkin. Rasmiy yangilanish/aloqa havolalari web-data.json da.

## Etalon nusxani tekshirish

Python 3.10+ bilan shu papka ichida:

    python verify_golden.py
    python -m unittest discover -s tests -v

Bu Python sinovi bo'lajak JavaScript kodining o'zi tekshirildi degani emas.
JavaScript tayyorlangach aynan shu JSON misollari unga qarshi ham bajarilsin.
Manba havolalari va saralash qaydlarini keyingi tarqatmada saqlang.
