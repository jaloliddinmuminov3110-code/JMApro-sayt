/**
 * JMA Alifbo Web Engine v1.3 (Core v1.2)
 * Muallif: Mo'minov Jaloliddin Azizjon o'g'li
 * 100% Client-side, xavfsiz va bir zumda o'giruvchi Lotin-Kirill dvigateli
 */
(function(window) {
    'use strict';

    const RULES = {
  "new_latin": {
    "o‘": "ö",
    "g‘": "ğ",
    "sh": "ş",
    "ch": "ç"
  },
  "latin_to_cyrillic": {
    "abssess": "абсцесс",
    "abssissa": "абсцисса",
    "abstraksiya": "абстракция",
    "adaptatsiya": "адаптация",
    "adsorbsiya": "адсорбция",
    "akatsiya": "акация",
    "akklimatizatsiya": "акклиматизация",
    "akkreditatsiya": "аккредитация",
    "akkumulyatsiya": "аккумуляция",
    "akseptor": "акцептор",
    "aksessor": "акцессор",
    "aksiya": "акция",
    "aksiyador": "акциядор",
    "aksiz": "акциз",
    "aktivatsiya": "активация",
    "animatsiya": "анимация",
    "annotatsiya": "аннотация",
    "antifriksion": "антифрикцион",
    "apellyatsiya": "апелляция",
    "aprobatsiya": "апробация",
    "assimilyatsiya": "ассимиляция",
    "assotsiatsiya": "ассоциация",
    "atseton": "ацетон",
    "atstek": "ацтек",
    "attestatsiya": "аттестация",
    "auksion": "аукцион",
    "aviatsiya": "авиация",
    "barens": "баренц",
    "bens": "бенц",
    "budjet": "бюджет",
    "cherepitsa": "черепица",
    "dansig": "данциг",
    "deduksiya": "дедукция",
    "defitsit": "дефицит",
    "deformatsiya": "деформация",
    "degustatsiya": "дегустация",
    "dekabr": "декабрь",
    "deklamatsiya": "декламация",
    "deklaratsiya": "декларация",
    "dekoratsiya": "декорация",
    "delegatsiya": "делегация",
    "delimitatsiya": "делимитация",
    "demarkatsiya": "демаркация",
    "denonsatsiya": "денонсация",
    "deportatsiya": "депортация",
    "derivatsiya": "деривация",
    "detonatsiya": "детонация",
    "detsibel": "децибел",
    "detsimetr": "дециметр",
    "devalvatsiya": "девальвация",
    "dezaktivatsiya": "дезактивация",
    "differensial": "дифференциал",
    "differensiatsiya": "дифференциация",
    "differensiya": "дифференция",
    "direksiya": "дирекция",
    "diskriminatsiya": "дискриминация",
    "diskvalifikatsiya": "дисквалификация",
    "dislokatsiya": "дислокация",
    "dissertatsiya": "диссертация",
    "dissimilyatsiya": "диссимиляция",
    "diversifikatsiya": "диверсификация",
    "donetsk": "донецк",
    "dotatsiya": "дотация",
    "dotsent": "доцент",
    "ekspeditsiya": "экспедиция",
    "ekspluatatsiya": "эксплуатация",
    "ekspozitsiya": "экспозиция",
    "ekssentrisitet": "эксцентриситет",
    "ekstraksiya": "экстракция",
    "ekvivalensiya": "эквиваленция",
    "elektrostriksiya": "электрострикция",
    "emansipatsiya": "эмансипация",
    "emigratsiya": "эмиграция",
    "emotsiya": "эмоция",
    "ensiklopedik": "энциклопедик",
    "ensiklopediya": "энциклопедия",
    "epileysit": "эпилейцит",
    "epitsentr": "эпицентр",
    "essensiya": "эссенция",
    "evolyutsiya": "эволюция",
    "farmatsevtika": "фармацевтика",
    "federatsiya": "федерация",
    "fevral": "февраль",
    "florensiya": "флоренция",
    "formatsiya": "формация",
    "fraksiya": "фракция",
    "fransisk": "франциск",
    "fransisko": "франциско",
    "fransiy": "франций",
    "fransiya": "франция",
    "fransuz": "француз",
    "friksion": "фрикцион",
    "funksiya": "функция",
    "geliotsentrik": "гелиоцентрик",
    "geotsentrik": "геоцентрик",
    "gers": "герц",
    "gersog": "герцог",
    "gidratatsiya": "гидратация",
    "globalizatsiya": "глобализация",
    "gorchitsa": "горчица",
    "gravitatsion": "гравитацион",
    "gravitatsiya": "гравитация",
    "gretsiya": "греция",
    "illyustratsiya": "иллюстрация",
    "immobilizatsiya": "иммобилизация",
    "improvizatsiya": "импровизация",
    "indeksatsiya": "индексация",
    "induksiya": "индукция",
    "indulgensiya": "индульгенция",
    "inersiya": "инерция",
    "infeksiya": "инфекция",
    "inflyatsiya": "инфляция",
    "informatsion": "информацион",
    "inkubatsiya": "инкубация",
    "inkvizitsiya": "инквизиция",
    "inspeksiya": "инспекция",
    "inssenirovka": "инсценировка",
    "instruksiya": "инструкция",
    "integratsiya": "интеграция",
    "interferensiya": "интерференция",
    "intervensiya": "интервенция",
    "intuitsiya": "интуиция",
    "investitsiya": "инвестиция",
    "irratsional": "иррационал",
    "irrigatsiya": "ирригация",
    "izolyatsiya": "изоляция",
    "jitsu": "жицу",
    "kalsiy": "кальций",
    "kanalizatsiya": "канализация",
    "kansler": "канцлер",
    "kapitulyatsiya": "капитуляция",
    "kassatsiya": "кассация",
    "katolitsizm": "католицизм",
    "klassifikatsiya": "классификация",
    "klassitsizm": "классицизм",
    "koeffitsiyent": "коэффициент",
    "kolleksiya": "коллекция",
    "kolonizatsiya": "колонизация",
    "kombinatsiya": "комбинация",
    "kommersiya": "коммерция",
    "kommunikatsiya": "коммуникация",
    "kompensatsiya": "компенсация",
    "kompozitsiya": "композиция",
    "konfederatsiya": "конфедерация",
    "konferensiya": "конференция",
    "konsentrat": "концентрат",
    "konsentratsiya": "концентрация",
    "konsepsiya": "концепция",
    "konsept": "концепт",
    "konsern": "концерн",
    "konsert": "концерт",
    "konservatsiya": "консервация",
    "konsessiya": "концессия",
    "konslager": "концлагерь",
    "konsolidatsiya": "консолидация",
    "konsorsium": "консорциум",
    "konsorsiya": "консорция",
    "konstansa": "констанца",
    "konstitutsiya": "конституция",
    "konstruksiya": "конструкция",
    "konsultatsiya": "консультация",
    "konveksiya": "конвекция",
    "konvensiya": "конвенция",
    "kon‘yunksiya": "конъюнкция",
    "koordinatsiya": "координация",
    "korporatsiya": "корпорация",
    "korreksiya": "коррекция",
    "korrespondensiya": "корреспонденция",
    "korrupsiya": "коррупция",
    "kultivatsiya": "культивация",
    "kvalifikatsiya": "квалификация",
    "kvars": "кварц",
    "laktatsiya": "лактация",
    "leksiya": "лекция",
    "leypsig": "лейпциг",
    "leysit": "лейцит",
    "litsensiat": "лиценциат",
    "litsenziya": "лицензия",
    "litsey": "лицей",
    "marganets": "марганец",
    "margansovka": "марганцовка",
    "matritsa": "матрица",
    "mayns": "майнц",
    "melioratsiya": "мелиорация",
    "mexanizatsiya": "механизация",
    "migratsiya": "миграция",
    "militsiya": "милиция",
    "modernizatsiya": "модернизация",
    "modifikatsiya": "модификация",
    "modulyatsiya": "модуляция",
    "motosikl": "мотоцикл",
    "mtsiri": "мцири",
    "munitsipal": "муниципал",
    "munitsipalitet": "муниципалитет",
    "mutatsiya": "мутация",
    "natsionalizatsiya": "национализация",
    "natsionalizm": "национализм",
    "natsist": "нацист",
    "navigatsiya": "навигация",
    "nitssa": "ницца",
    "noyabr": "ноябрь",
    "obligatsiya": "облигация",
    "obyekt": "объект",
    "ofitser": "офицер",
    "okkupatsiya": "оккупация",
    "oksigenatsiya": "оксигенация",
    "oktabr": "октябрь",
    "operatsiya": "операция",
    "ossillograf": "осциллограф",
    "parsial": "парциал",
    "patritsiy": "патриций",
    "plantatsiya": "плантация",
    "platsdarm": "плацдарм",
    "platsenta": "плацента",
    "politsiya": "полиция",
    "populyatsiya": "популяция",
    "potensial": "потенциал",
    "poyezd": "поезд",
    "pozitsiya": "позиция",
    "prinsip": "принцип",
    "proporsional": "пропорционал",
    "proporsiya": "пропорция",
    "protsess": "процесс",
    "provinsiya": "провинция",
    "proyeksiya": "проекция",
    "publitsist": "публицист",
    "publitsistik": "публицистик",
    "radiatsiya": "радиация",
    "radiolokatsiya": "радиолокация",
    "ratifikatsiya": "ратификация",
    "ratsion": "рацион",
    "ratsional": "рационал",
    "reabilitatsiya": "реабилитация",
    "reaksiya": "реакция",
    "realizatsiya": "реализация",
    "reanimatsiya": "реанимация",
    "redaksiya": "редакция",
    "reduksiya": "редукция",
    "regulyatsiya": "регуляция",
    "rekreatsiya": "рекреация",
    "rektifikatsiya": "ректификация",
    "reproduksiya": "репродукция",
    "retsept": "рецепт",
    "retseptor": "рецептор",
    "retsidivist": "рецидивист",
    "revolyutsiya": "революция",
    "rezervatsiya": "резервация",
    "ritsar": "рицар",
    "sedimentatsiya": "седиментация",
    "sekretsiya": "секреция",
    "seksiya": "секция",
    "seleksiya": "селекция",
    "sellofan": "целлофан",
    "sellyuloza": "целлюлоза",
    "selsiy": "цельсий",
    "sement": "цемент",
    "sentabr": "сентябрь",
    "sentner": "центнер",
    "senzor": "цензор",
    "senzura": "цензура",
    "separatsiya": "сепарация",
    "setse": "цеце",
    "sex": "цех",
    "seytnot": "цейтнот",
    "sezar": "цезарь",
    "seziy": "цезий",
    "shprits": "шприц",
    "shvetsiya": "швеция",
    "shveysariya": "швейцария",
    "signalizatsiya": "сигнализация",
    "sikl": "цикл",
    "siklon": "циклон",
    "siklop": "циклоп",
    "silindr": "цилиндр",
    "silindrik": "цилиндрик",
    "silindrsimon": "цилиндрсимон",
    "sirk": "цирк",
    "sirkul": "циркуль",
    "sirkulyatsiya": "циркуляция",
    "sisterna": "цистерна",
    "sitrus": "цитрус",
    "sitsiliya": "сицилия",
    "sivilizatsiya": "цивилизация",
    "slanets": "сланец",
    "sotsializm": "социализм",
    "sotsiologiya": "социология",
    "ssenariy": "сценарий",
    "stansiya": "станция",
    "statsionar": "стационар",
    "stupitsa": "ступица",
    "subyekt": "субъект",
    "suksinat": "сукцинат",
    "syanszi": "сянцзи",
    "tendensiya": "тенденция",
    "transformatsiya": "трансформация",
    "transkripsiya": "транскрипция",
    "transnatsional": "транснационал",
    "trapetsiya": "трапеция",
    "unsiya": "унция",
    "vaduts": "вадуц",
    "vaksina": "вакцина",
    "variatsiya": "вариация",
    "vegetatsiya": "вегетация",
    "venetsiya": "венеция",
    "ventilyatsiya": "вентиляция",
    "vibratsiya": "вибрация",
    "vitse": "вице",
    "xalsedon": "халцедон",
    "xoletsistit": "холецистит",
    "yanszi": "янцзи",
    "yanvar": "январь",
    "yurisdiksiya": "юрисдикция",
    "yurisprudensiya": "юриспруденция"
  },
  "cyrillic_to_latin": {
    "абстракция": "abstraksiya",
    "абсцесс": "abssess",
    "абсцисса": "abssissa",
    "авиация": "aviatsiya",
    "адаптация": "adaptatsiya",
    "адсорбция": "adsorbsiya",
    "акация": "akatsiya",
    "акклиматизация": "akklimatizatsiya",
    "аккредитация": "akkreditatsiya",
    "аккумуляция": "akkumulyatsiya",
    "активация": "aktivatsiya",
    "акцептор": "akseptor",
    "акцессор": "aksessor",
    "акциз": "aksiz",
    "акция": "aksiya",
    "анимация": "animatsiya",
    "аннотация": "annotatsiya",
    "антифрикцион": "antifriksion",
    "апелляция": "apellyatsiya",
    "апробация": "aprobatsiya",
    "ассимиляция": "assimilyatsiya",
    "ассоциация": "assotsiatsiya",
    "аттестация": "attestatsiya",
    "аукцион": "auksion",
    "ацетон": "atseton",
    "ацтек": "atstek",
    "баренц": "barens",
    "бенц": "bens",
    "бюджет": "budjet",
    "вадуц": "vaduts",
    "вакцина": "vaksina",
    "вариация": "variatsiya",
    "вегетация": "vegetatsiya",
    "венеция": "venetsiya",
    "вентиляция": "ventilyatsiya",
    "вибрация": "vibratsiya",
    "вице": "vitse",
    "гелиоцентрик": "geliotsentrik",
    "геоцентрик": "geotsentrik",
    "герц": "gers",
    "герцог": "gersog",
    "гидратация": "gidratatsiya",
    "глобализация": "globalizatsiya",
    "горчица": "gorchitsa",
    "гравитацион": "gravitatsion",
    "гравитация": "gravitatsiya",
    "греция": "gretsiya",
    "данциг": "dansig",
    "девальвация": "devalvatsiya",
    "дегустация": "degustatsiya",
    "дедукция": "deduksiya",
    "дезактивация": "dezaktivatsiya",
    "декабрь": "dekabr",
    "декламация": "deklamatsiya",
    "декларация": "deklaratsiya",
    "декорация": "dekoratsiya",
    "делегация": "delegatsiya",
    "делимитация": "delimitatsiya",
    "демаркация": "demarkatsiya",
    "денонсация": "denonsatsiya",
    "депортация": "deportatsiya",
    "деривация": "derivatsiya",
    "детонация": "detonatsiya",
    "дефицит": "defitsit",
    "деформация": "deformatsiya",
    "децибел": "detsibel",
    "дециметр": "detsimetr",
    "диверсификация": "diversifikatsiya",
    "дирекция": "direksiya",
    "дисквалификация": "diskvalifikatsiya",
    "дискриминация": "diskriminatsiya",
    "дислокация": "dislokatsiya",
    "диссертация": "dissertatsiya",
    "диссимиляция": "dissimilyatsiya",
    "дифференциал": "differensial",
    "дифференциация": "differensiatsiya",
    "дифференция": "differensiya",
    "донецк": "donetsk",
    "дотация": "dotatsiya",
    "доцент": "dotsent",
    "жицу": "jitsu",
    "изоляция": "izolyatsiya",
    "иллюстрация": "illyustratsiya",
    "иммобилизация": "immobilizatsiya",
    "импровизация": "improvizatsiya",
    "инвестиция": "investitsiya",
    "индексация": "indeksatsiya",
    "индукция": "induksiya",
    "индульгенция": "indulgensiya",
    "инерция": "inersiya",
    "инквизиция": "inkvizitsiya",
    "инкубация": "inkubatsiya",
    "инспекция": "inspeksiya",
    "инструкция": "instruksiya",
    "инсценировка": "inssenirovka",
    "интеграция": "integratsiya",
    "интервенция": "intervensiya",
    "интерференция": "interferensiya",
    "интуиция": "intuitsiya",
    "инфекция": "infeksiya",
    "инфляция": "inflyatsiya",
    "информацион": "informatsion",
    "иррационал": "irratsional",
    "ирригация": "irrigatsiya",
    "кальций": "kalsiy",
    "канализация": "kanalizatsiya",
    "канцлер": "kansler",
    "капитуляция": "kapitulyatsiya",
    "кассация": "kassatsiya",
    "католицизм": "katolitsizm",
    "квалификация": "kvalifikatsiya",
    "кварц": "kvars",
    "классификация": "klassifikatsiya",
    "классицизм": "klassitsizm",
    "коллекция": "kolleksiya",
    "колонизация": "kolonizatsiya",
    "комбинация": "kombinatsiya",
    "коммерция": "kommersiya",
    "коммуникация": "kommunikatsiya",
    "компенсация": "kompensatsiya",
    "композиция": "kompozitsiya",
    "конвекция": "konveksiya",
    "конвенция": "konvensiya",
    "консервация": "konservatsiya",
    "консолидация": "konsolidatsiya",
    "консорциум": "konsorsium",
    "консорция": "konsorsiya",
    "констанца": "konstansa",
    "конституция": "konstitutsiya",
    "конструкция": "konstruksiya",
    "консультация": "konsultatsiya",
    "конфедерация": "konfederatsiya",
    "конференция": "konferensiya",
    "концентрат": "konsentrat",
    "концентрация": "konsentratsiya",
    "концепт": "konsept",
    "концепция": "konsepsiya",
    "концерн": "konsern",
    "концерт": "konsert",
    "концессия": "konsessiya",
    "концлагерь": "konslager",
    "конъюнкция": "kon‘yunksiya",
    "координация": "koordinatsiya",
    "корпорация": "korporatsiya",
    "коррекция": "korreksiya",
    "корреспонденция": "korrespondensiya",
    "коррупция": "korrupsiya",
    "коэффициент": "koeffitsiyent",
    "культивация": "kultivatsiya",
    "лактация": "laktatsiya",
    "лейпциг": "leypsig",
    "лейцит": "leysit",
    "лекция": "leksiya",
    "лицей": "litsey",
    "лицензия": "litsenziya",
    "лиценциат": "litsensiat",
    "майнц": "mayns",
    "марганец": "marganets",
    "марганцовка": "margansovka",
    "матрица": "matritsa",
    "мелиорация": "melioratsiya",
    "механизация": "mexanizatsiya",
    "миграция": "migratsiya",
    "милиция": "militsiya",
    "модернизация": "modernizatsiya",
    "модификация": "modifikatsiya",
    "модуляция": "modulyatsiya",
    "мотоцикл": "motosikl",
    "муниципал": "munitsipal",
    "муниципалитет": "munitsipalitet",
    "мутация": "mutatsiya",
    "мцири": "mtsiri",
    "навигация": "navigatsiya",
    "национализация": "natsionalizatsiya",
    "национализм": "natsionalizm",
    "нацист": "natsist",
    "ницца": "nitssa",
    "ноябрь": "noyabr",
    "облигация": "obligatsiya",
    "объект": "obyekt",
    "оккупация": "okkupatsiya",
    "оксигенация": "oksigenatsiya",
    "октябрь": "oktabr",
    "операция": "operatsiya",
    "осциллограф": "ossillograf",
    "офицер": "ofitser",
    "парциал": "parsial",
    "патриций": "patritsiy",
    "плантация": "plantatsiya",
    "плацдарм": "platsdarm",
    "плацента": "platsenta",
    "поезд": "poyezd",
    "позиция": "pozitsiya",
    "полиция": "politsiya",
    "популяция": "populyatsiya",
    "потенциал": "potensial",
    "принцип": "prinsip",
    "провинция": "provinsiya",
    "проекция": "proyeksiya",
    "пропорционал": "proporsional",
    "пропорция": "proporsiya",
    "процесс": "protsess",
    "публицист": "publitsist",
    "публицистик": "publitsistik",
    "радиация": "radiatsiya",
    "радиолокация": "radiolokatsiya",
    "ратификация": "ratifikatsiya",
    "рацион": "ratsion",
    "рационал": "ratsional",
    "реабилитация": "reabilitatsiya",
    "реакция": "reaksiya",
    "реализация": "realizatsiya",
    "реанимация": "reanimatsiya",
    "революция": "revolyutsiya",
    "регуляция": "regulyatsiya",
    "редакция": "redaksiya",
    "редукция": "reduksiya",
    "резервация": "rezervatsiya",
    "рекреация": "rekreatsiya",
    "ректификация": "rektifikatsiya",
    "репродукция": "reproduksiya",
    "рецепт": "retsept",
    "рецептор": "retseptor",
    "рецидивист": "retsidivist",
    "рицар": "ritsar",
    "седиментация": "sedimentatsiya",
    "секреция": "sekretsiya",
    "секция": "seksiya",
    "селекция": "seleksiya",
    "сентябрь": "sentabr",
    "сепарация": "separatsiya",
    "сигнализация": "signalizatsiya",
    "сицилия": "sitsiliya",
    "сланец": "slanets",
    "социализм": "sotsializm",
    "социология": "sotsiologiya",
    "станция": "stansiya",
    "стационар": "statsionar",
    "ступица": "stupitsa",
    "субъект": "subyekt",
    "сукцинат": "suksinat",
    "сценарий": "ssenariy",
    "сянцзи": "syanszi",
    "тенденция": "tendensiya",
    "транскрипция": "transkripsiya",
    "транснационал": "transnatsional",
    "трансформация": "transformatsiya",
    "трапеция": "trapetsiya",
    "унция": "unsiya",
    "фармацевтика": "farmatsevtika",
    "февраль": "fevral",
    "федерация": "federatsiya",
    "флоренция": "florensiya",
    "формация": "formatsiya",
    "фракция": "fraksiya",
    "франций": "fransiy",
    "франциск": "fransisk",
    "франциско": "fransisko",
    "франция": "fransiya",
    "француз": "fransuz",
    "фрикцион": "friksion",
    "функция": "funksiya",
    "халцедон": "xalsedon",
    "холецистит": "xoletsistit",
    "цезарь": "sezar",
    "цезий": "seziy",
    "цейтнот": "seytnot",
    "целлофан": "sellofan",
    "целлюлоза": "sellyuloza",
    "цельсий": "selsiy",
    "цемент": "sement",
    "цензор": "senzor",
    "цензура": "senzura",
    "центнер": "sentner",
    "цех": "sex",
    "цеце": "setse",
    "цивилизация": "sivilizatsiya",
    "цикл": "sikl",
    "циклон": "siklon",
    "циклоп": "siklop",
    "цилиндр": "silindr",
    "цилиндрик": "silindrik",
    "цилиндрсимон": "silindrsimon",
    "цирк": "sirk",
    "циркуль": "sirkul",
    "циркуляция": "sirkulyatsiya",
    "цистерна": "sisterna",
    "цитрус": "sitrus",
    "черепица": "cherepitsa",
    "швейцария": "shveysariya",
    "швеция": "shvetsiya",
    "шприц": "shprits",
    "эволюция": "evolyutsiya",
    "эквиваленция": "ekvivalensiya",
    "экспедиция": "ekspeditsiya",
    "эксплуатация": "ekspluatatsiya",
    "экспозиция": "ekspozitsiya",
    "экстракция": "ekstraksiya",
    "эксцентриситет": "ekssentrisitet",
    "электрострикция": "elektrostriksiya",
    "эмансипация": "emansipatsiya",
    "эмиграция": "emigratsiya",
    "эмоция": "emotsiya",
    "энциклопедик": "ensiklopedik",
    "энциклопедия": "ensiklopediya",
    "эпилейцит": "epileysit",
    "эпицентр": "epitsentr",
    "эссенция": "essensiya",
    "юрисдикция": "yurisdiksiya",
    "юриспруденция": "yurisprudensiya",
    "январь": "yanvar",
    "янцзи": "yanszi"
  }
};

    const LATIN = "Lotin (amaldagi)";
    const NEW_LATIN = "Yangi lotin (Ö, Ğ, Ş, Ç)";
    const CYRILLIC = "Kirill";
    const AUTO = "Avto aniqlash";
    const MIXED = "Aralash yozuv";
    const APOSTROPHES = "'‘’ʻʼ`ʹ";

    const WORD_REGEX = /(?:[\p{L}\u0300-\u036f])+(?:['‘’ʻʼ`ʹ](?:[\p{L}\u0300-\u036f])+)*(?:(?<=[oOgG])['‘’`ʹ])?/gu;
    const CYR_REGEX = /[А-Яа-яЁёЎўҚқҒғҲҳ]/u;
    const LAT_REGEX = /[A-Za-zÖöĞğŞşÇç]/u;
    const NOMINAL_SUFFIX_REGEX = /^(?:lar)?(?:cha|chi|lik|li|siz|simon)?(?:lar)?(?:im|ing|imiz|ingiz|i|si)?(?:ning|ni|ga|ka|qa|da|dan|gacha)?(?:dir|mi|ku)?$/u;
    const SPELLING_HINTS = { "senariy": "ssenariy", "episentr": "epitsentr" };

    const LAT_CYR_SINGLES = {
        "a": "а", "b": "б", "d": "д", "f": "ф", "g": "г", "h": "ҳ", "i": "и", "j": "ж",
        "k": "к", "l": "л", "m": "м", "n": "н", "o": "о", "p": "п", "q": "қ", "r": "р",
        "s": "с", "t": "т", "u": "у", "v": "в", "x": "х", "y": "й", "z": "з"
    };

    const LAT_CYR_PAIRS = {
        "o‘": "ў", "g‘": "ғ", "sh": "ш", "ch": "ч",
        "yo": "ё", "yu": "ю", "ya": "я", "ye": "е"
    };

    const CYR_LAT_MAP = {
        "а": "a", "б": "b", "в": "v", "г": "g", "д": "d", "ж": "j", "з": "z",
        "и": "i", "й": "y", "к": "k", "л": "l", "м": "m", "н": "n", "о": "o",
        "п": "p", "р": "r", "с": "s", "т": "t", "у": "u", "ф": "f", "х": "x",
        "э": "e", "ҳ": "h", "қ": "q", "ў": "o‘", "ғ": "g‘", "ш": "sh", "ч": "ch",
        "ё": "yo", "ю": "yu", "я": "ya", "ъ": "‘", "ь": ""
    };

    const REVERSE_NEW_LATIN = {};
    for (const [k, v] of Object.entries(RULES.new_latin)) {
        REVERSE_NEW_LATIN[v.toLowerCase()] = k;
    }

    const SUFFIX_STEMS = { latin_to_cyrillic: {}, cyrillic_to_latin: {} };
    for (const direction of ["latin_to_cyrillic", "cyrillic_to_latin"]) {
        const stems = {};
        for (const [k, v] of Object.entries(RULES[direction])) {
            if (k.includes("ц") || v.includes("ц")) {
                stems[k] = v;
            }
        }
        if (direction === "cyrillic_to_latin") {
            for (const [k, v] of Object.entries(stems)) {
                if (k.endsWith("ь")) {
                    stems[k.slice(0, -1)] = v;
                }
            }
        }
        SUFFIX_STEMS[direction] = stems;
    }

    function isUpper(str) {
        return Boolean(str) && str.toUpperCase() === str && str.toLowerCase() !== str;
    }

    function isLower(str) {
        return Boolean(str) && str.toLowerCase() === str && str.toUpperCase() !== str;
    }

    function isTitle(str) {
        if (!str || str.length === 0) return false;
        const first = str[0];
        const rest = str.slice(1);
        const firstIsUpper = isUpper(first);
        const restIsLower = rest.length === 0 || (!isUpper(rest) && rest.toLowerCase() === rest);
        return firstIsUpper && restIsLower;
    }

    function _case(value, original, allCaps) {
        if (!value) return "";
        if (allCaps || (original && original.length > 1 && isUpper(original))) {
            return value.toUpperCase();
        }
        if (original && isUpper(original[0])) {
            return value.charAt(0).toUpperCase() + value.slice(1);
        }
        return value;
    }

    function _normalize(word) {
        return word.replace(/['‘’ʻʼ`ʹ]/g, "‘");
    }

    function _latin_to_new(word) {
        word = _normalize(word);
        const caps = isUpper(word);
        const out = [];
        let index = 0;
        while (index < word.length) {
            const pair = word.slice(index, index + 2);
            const lowPair = pair.toLowerCase();
            if (RULES.new_latin[lowPair]) {
                out.push(_case(RULES.new_latin[lowPair], pair, caps));
                index += 2;
            } else {
                out.push(word[index] === "‘" ? "ʼ" : word[index]);
                index += 1;
            }
        }
        return out.join("");
    }

    function _new_to_latin(word) {
        const caps = isUpper(word);
        const out = [];
        for (let i = 0; i < word.length; i++) {
            const c = word[i];
            const low = c.toLowerCase();
            if (REVERSE_NEW_LATIN[low]) {
                out.push(_case(REVERSE_NEW_LATIN[low], c, caps));
            } else if (APOSTROPHES.includes(c)) {
                out.push("‘");
            } else {
                out.push(c);
            }
        }
        return out.join("");
    }

    function _exception(word, direction) {
        const dict = RULES[direction] || {};
        const lowWord = word.toLowerCase();
        const cleanCase = isLower(word) || isUpper(word) || isTitle(word);

        const value = dict[lowWord];
        if (value && cleanCase) {
            return _case(value, word, isUpper(word));
        }
        if (!cleanCase) {
            return null;
        }

        const stems = SUFFIX_STEMS[direction];
        const maxSplit = Math.min(word.length - 1, 100);
        for (let split = maxSplit; split > 0; split--) {
            const stem = word.slice(0, split);
            const stemVal = stems[stem.toLowerCase()];
            if (stemVal === undefined) continue;

            const tail = word.slice(split);
            const latinTail = direction === "latin_to_cyrillic"
                ? tail.toLowerCase()
                : _cyr_to_latin(tail).toLowerCase();

            if (latinTail && NOMINAL_SUFFIX_REGEX.test(latinTail)) {
                if (direction === "latin_to_cyrillic") {
                    const cleanVal = stemVal.replace(/ь+$/, "");
                    return _case(cleanVal, stem, isUpper(word)) + _latin_to_cyr(tail);
                } else {
                    return _case(stemVal, stem, isUpper(word)) + _cyr_to_latin(tail);
                }
            }
        }
        return null;
    }

    function _latin_to_cyr(word) {
        word = _normalize(word);
        const special = _exception(word, "latin_to_cyrillic");
        if (special !== null) return special;

        const caps = isUpper(word);
        const out = [];
        let index = 0;
        while (index < word.length) {
            const char = word[index];
            const low = char.toLowerCase();
            const pair = word.slice(index, index + 2);
            const lowPair = pair.toLowerCase();

            if (lowPair === "ts") {
                const next5 = word.slice(index, index + 5).toLowerCase();
                if (next5 === "tsiya" || next5 === "tsion") {
                    out.push(_case("ц", pair, caps));
                    index += 2;
                    continue;
                }
            }

            if (word.slice(index, index + 3).toLowerCase() === "s‘h") {
                out.push(_case("с", char, caps));
                out.push(_case("ҳ", word[index + 2], caps));
                index += 3;
                continue;
            }

            if (LAT_CYR_PAIRS[lowPair] && !(lowPair === "yo" && word.slice(index + 2, index + 3) === "‘")) {
                out.push(_case(LAT_CYR_PAIRS[lowPair], pair, caps));
                index += 2;
                continue;
            }

            let value;
            if (low === "e") {
                value = (index === 0 || "aeiou‘".includes(word[index - 1].toLowerCase())) ? "э" : "е";
            } else if (char === "‘") {
                value = "ъ";
            } else {
                value = LAT_CYR_SINGLES[low] !== undefined ? LAT_CYR_SINGLES[low] : char;
            }
            out.push(_case(value, char, caps));
            index += 1;
        }
        return out.join("");
    }

    function _cyr_to_latin(word) {
        const special = _exception(word, "cyrillic_to_latin");
        if (special !== null) return special;

        const out = [];
        const caps = isUpper(word);
        for (let index = 0; index < word.length; index++) {
            const char = word[index];
            const low = char.toLowerCase();
            let value;
            if (low === "е") {
                value = (index === 0 || "аеиоуэёюяўъь".includes(word[index - 1].toLowerCase())) ? "ye" : "e";
            } else if (low === "ц") {
                value = (index > 0 && "аеиоуэёюя".includes(word[index - 1].toLowerCase())) ? "ts" : "s";
            } else {
                value = CYR_LAT_MAP[low] !== undefined ? CYR_LAT_MAP[low] : char;
            }
            out.push(value ? _case(value, char, caps) : "");
        }
        return out.join("");
    }

    function detect(text) {
        if (!text || !text.trim()) return "Aniqlash uchun harf kiriting";
        text = text.normalize("NFC");
        const hasCyr = CYR_REGEX.test(text);
        const hasLat = LAT_REGEX.test(text);
        const newChars = Object.values(RULES.new_latin);
        const hasNew = Array.from(text).some(c => newChars.includes(c.toLowerCase()));
        const hasOld = /[ogOG]['‘’ʻʼ`ʹ]|sh|ch|SH|CH|Sh|Ch/i.test(text);

        if ((hasCyr && hasLat) || (hasNew && hasOld)) {
            return MIXED;
        }
        if (hasCyr) return CYRILLIC;
        if (hasNew) return NEW_LATIN;
        return hasLat ? LATIN : "Aniqlash uchun harf kiriting";
    }

    function convert(text, source, target) {
        text = text || "";
        const detected = detect(text);
        const warnings = [];

        let targetNorm = target;
        if (target === "latin") targetNorm = LATIN;
        if (target === "new_latin") targetNorm = NEW_LATIN;
        if (target === "cyrillic") targetNorm = CYRILLIC;

        if (detected === MIXED) {
            warnings.push("Aralash yozuvdagi qismlar tanlangan natija alifbosiga o‘girildi.");
        }
        if (CYR_REGEX.test(text) || targetNorm === CYRILLIC) {
            warnings.push("Kirill bilan konvertatsiya taxminiy: е/э, ё, ц, ъ/ь, yo/ye va o‘zlashma so‘zlarni tekshiring. Ortga o‘girish asl matnni doim tiklamaydi.");
        }
        if (targetNorm !== LATIN && /sh|ch/i.test(text)) {
            warnings.push("Sh/ch bitta harf deb olindi; alohida s+h uchun s’h yozing. Chet tilidagi so‘zlarni tekshiring.");
        }

        if (!text) {
            return {
                text: "",
                warnings: warnings,
                detected: detected
            };
        }

        const hints = new Set();
        const convertedText = text.replace(WORD_REGEX, function(match) {
            const word = match.normalize("NFC");
            const lowered = word.toLowerCase();
            for (const [typo, spelling] of Object.entries(SPELLING_HINTS)) {
                if (lowered.startsWith(typo) && NOMINAL_SUFFIX_REGEX.test(lowered.slice(typo.length))) {
                    hints.add("Imlo eslatmasi: " + typo + " o‘rniga " + spelling + " shaklini tekshiring. Manba imlosi avtomatik tuzatilmadi.");
                }
            }

            const runs = word.split(/([А-Яа-яЁёЎўҚқҒғҲҳ]+)/u);
            const converted = [];
            for (const run of runs) {
                if (!run) continue;
                if (CYR_REGEX.test(run[0])) {
                    converted.push(targetNorm === CYRILLIC ? run : _cyr_to_latin(run));
                } else {
                    const hasNewChar = Array.from(run).some(c => Object.values(RULES.new_latin).includes(c.toLowerCase()));
                    const latin = hasNewChar ? _new_to_latin(run) : run;
                    converted.push(targetNorm === CYRILLIC ? _latin_to_cyr(latin) : latin);
                }
            }
            const normalized = converted.join("");
            if (targetNorm === CYRILLIC) return normalized;
            if (targetNorm === NEW_LATIN) return _latin_to_new(normalized);
            return normalized;
        });

        const sortedHints = Array.from(hints).sort();
        return {
            text: convertedText,
            warnings: warnings.concat(sortedHints),
            detected: detected
        };
    }

    window.JMAAlifbo = {
        LATIN: LATIN,
        NEW_LATIN: NEW_LATIN,
        CYRILLIC: CYRILLIC,
        AUTO: AUTO,
        MIXED: MIXED,
        detect: detect,
        convert: convert,
        rules: RULES
    };

})(typeof window !== 'undefined' ? window : this);
