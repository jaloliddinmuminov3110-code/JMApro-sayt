# Цц lug‘ati manbalari va saralash qaydi

Asosiy manba: Xushnudbek.UZ, **“Ц” ҳарфи иштирок этган сўзларнинг имлоси**.
<https://xushnudbek.blogspot.com/p/blog-page_1204.html>
2026-10-24 kuni brauzerda o‘qilgan. `ts_words_source.tsv` — jadvaldagi
301 ta kirill/lotin juftligining nusxasi. So‘z juftliklari konvertatsiya
faktlari sifatida qo‘llangan; maqola matni ko‘chirilmagan. Muallifga havola
manba va tarqatma paketlarida saqlanadi.

## Tekshiruv va istisnolar

- Manbada `цеце / setse` ikki marta uchraydi; lug‘atda bir marta.
- `абцесс / absess`, `абцисса / absissa` va
  `менингококкцемия / meningokokksemiya` yozuvlari shubhali imlo sabab
  avtomatik lug‘atga olinmagan. Xom nusxada asl holicha qoldirilgan.
- `abssess / абсцесс`, `abssissa / абсцисса` shakllari alohida kiritilgan.
  Qo‘shimcha tekshiruv manbalari: <https://izoh.uz/word/abssissa>,
  <https://api.scienceweb.uz/storage/publication_files/4263/12572/64edd21b35a20___INTERNATIONAL%20MEDICAL%20TERMS%20FROM%20FRENCH%20TO%20UZBEK%20LANGUAGE.pdf>.
- Foydalanuvchi misollaridan `rektifikatsiya / ректификация`,
  `animatsiya / анимация`, `parsial / парциал`, `sezar / цезарь` qo‘shilgan.
  Bular asosiy manba jadvalidan ko‘chirilgan deb ko‘rsatilmaydi.
  `ректификация` qo‘llanishi: <https://www.lex.uz/mact/8116480?ONDATE=04.04.2026+00>.
- Defisli so‘zlarda tokenlash uchun Ц qatnashgan qism olinadi: masalan,
  `Mersedes-bens` ichidagi `bens / бенц`, `vitse-` ichidagi `vitse / вице`.
- Natija: 302 ta Ц so‘z/qism juftligi. Eski istisnolar bilan birga
  `rules.json` da lotin→kirill uchun 313, kirill→lotin uchun 312 yozuv bor.

`tools/build_lexicon.py` ushbu nusxadan tekshirilgan juftliklarni
`rules.json` ga qo‘shadi. Dastur ishlaganda saytga ulanmaydi va TSV’ni
qayta o‘qimaydi; tayyor lug‘at EXE ichiga joylanadi.

Bu ish umumiy imlo tekshiruvchisi emas. `senariy` va `episentr` kiritilsa,
`ssenariy` va `epitsentr` shakllari haqida izoh chiqadi, matn yashirincha
tuzatilmaydi. Qo‘shimcha qoidasi cheklangan ot qo‘shimchalari zanjirini
taniydi; barcha so‘z yasalishi va o‘zlashma nomlarning imlosini kafolatlamaydi.
