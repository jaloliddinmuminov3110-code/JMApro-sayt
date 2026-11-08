import tempfile
import unittest
from pathlib import Path

from converter import Converter, LATIN, NEW_LATIN, CYRILLIC, AUTO, MIXED
from text_files import read_text, write_text


class ConverterTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.converter = Converter()

    def test_examples(self):
        cases = [
            (LATIN, NEW_LATIN, "O‘zbekiston", "Özbekiston"),
            (LATIN, NEW_LATIN, "G‘alaba", "Ğalaba"),
            (LATIN, NEW_LATIN, "Shahar, chiroyli", "Şahar, çiroyli"),
            (LATIN, NEW_LATIN, "SH CH O‘ G‘", "Ş Ç Ö Ğ"),
            (LATIN, NEW_LATIN, "O'zbek Oʻzbek O’zbek O`zbek", "Özbek Özbek Özbek Özbek"),
            (LATIN, NEW_LATIN, "ma’no san'at", "maʼno sanʼat"),
            (LATIN, NEW_LATIN, "tong yangi", "tong yangi"),
            (NEW_LATIN, LATIN, "Özbekça şe’r", "O‘zbekcha she‘r"),
            (NEW_LATIN, LATIN, "ŞAHAR ÇIROQ", "SHAHAR CHIROQ"),
            (NEW_LATIN, LATIN, "Şahar Çiroq", "Shahar Chiroq"),
            (LATIN, CYRILLIC, "O‘zbekiston", "Ўзбекистон"),
            (LATIN, CYRILLIC, "G‘alaba va chiroyli shahar", "Ғалаба ва чиройли шаҳар"),
            (LATIN, CYRILLIC, "SH CH NG", "Ш Ч НГ"),
            (LATIN, CYRILLIC, "erkin ekin el", "эркин экин эл"),
            (LATIN, CYRILLIC, "yetakchi yulduz yaxshi", "етакчи юлдуз яхши"),
            (LATIN, CYRILLIC, "yoz yo‘l", "ёз йўл"),
            (LATIN, CYRILLIC, "ma’no san'at", "маъно санъат"),
            (LATIN, CYRILLIC, "is’hoq", "исҳоқ"),
            (LATIN, CYRILLIC, "sentabr obyekt", "сентябрь объект"),
            (LATIN, CYRILLIC, "SIRK Konstitutsiya", "ЦИРК Конституция"),
            (CYRILLIC, LATIN, "Ўзбекистон", "O‘zbekiston"),
            (CYRILLIC, LATIN, "ШАҲАР ЧИРОҚ", "SHAHAR CHIROQ"),
            (CYRILLIC, LATIN, "Шаҳар Чироқ", "Shahar Chiroq"),
            (CYRILLIC, LATIN, "елкан поезд театр", "yelkan poyezd teatr"),
            (CYRILLIC, LATIN, "цирк акция конституция", "sirk aksiya konstitutsiya"),
            (CYRILLIC, LATIN, "объект сентябрь", "obyekt sentabr"),
            (CYRILLIC, NEW_LATIN, "ЎЗБЕКЧА ШЕЪР", "ÖZBEKÇA ŞEʼR"),
            (NEW_LATIN, CYRILLIC, "Özbekça şeʼr", "Ўзбекча шеър"),
            (LATIN, NEW_LATIN, "“O‘zbek” — 'shahar'!\r\n123\t🙂", "“Özbek” — 'şahar'!\r\n123\t🙂"),
            (LATIN, CYRILLIC, "abc Ўзбек", "абc Ўзбек"),
            (LATIN, NEW_LATIN, "o\u02bbzbek", "özbek"),
            (NEW_LATIN, LATIN, "O\u0308zbek", "O‘zbek"),
        ]
        for source, target, text, expected in cases:
            with self.subTest(source=source, target=target, text=text):
                self.assertEqual(self.converter.convert(text, source, target).text, expected)

    def test_single_letters(self):
        self.assertEqual(self.converter.convert(
            "a b d f g h i j k l m n o p q r s t u v x y z",
            LATIN, CYRILLIC).text,
            "а б д ф г ҳ и ж к л м н о п қ р с т у в х й з")
        self.assertEqual(self.converter.convert(
            "а б в г д ж з и й к л м н о п р с т у ф х э ҳ қ",
            CYRILLIC, LATIN).text,
            "a b v g d j z i y k l m n o p r s t u f x e h q")

    def test_all_directions_empty_and_identity(self):
        for source in (LATIN, NEW_LATIN, CYRILLIC):
            own_text = {LATIN: "O' SH", NEW_LATIN: "Ö Ş", CYRILLIC: "Ў Ш Ь Ц"}[source]
            self.assertEqual(self.converter.convert(own_text, source, source).text, own_text)
            for target in (LATIN, NEW_LATIN, CYRILLIC):
                self.assertEqual(self.converter.convert("", source, target).text, "")

    def test_warnings_and_mixed_word(self):
        result = self.converter.convert("salom Привет aбc", LATIN, CYRILLIC)
        self.assertEqual(result.text, "салом Привет абc")
        self.assertTrue(any("Aralash" in warning for warning in result.warnings))
        self.assertTrue(any("taxminiy" in warning for warning in result.warnings))

    def test_detect(self):
        for text, expected in [("Salom", LATIN), ("Шаҳар", CYRILLIC),
                               ("Özbekça", NEW_LATIN), ("O\u0308zbek", NEW_LATIN),
                               ("salom шаҳар", MIXED), ("şahar shahar", MIXED)]:
            with self.subTest(text=text):
                self.assertEqual(self.converter.detect(text), expected)
        self.assertNotIn(self.converter.detect("123 🙂"), (LATIN, NEW_LATIN, CYRILLIC))

    def test_mixed_all_sources_and_targets(self):
        text = "O‘rik ўрик örik. G‘ani Ғани Ğani!\r\nShahar шаҳар şahar."
        expected = {
            LATIN: "O‘rik o‘rik o‘rik. G‘ani G‘ani G‘ani!\r\nShahar shahar shahar.",
            NEW_LATIN: "Örik örik örik. Ğani Ğani Ğani!\r\nŞahar şahar şahar.",
            CYRILLIC: "Ўрик ўрик ўрик. Ғани Ғани Ғани!\r\nШаҳар шаҳар шаҳар.",
        }
        for source in (AUTO, LATIN, NEW_LATIN, CYRILLIC):
            for target in (LATIN, NEW_LATIN, CYRILLIC):
                with self.subTest(source=source, target=target):
                    self.assertEqual(self.converter.convert(text, source, target).text, expected[target])

    def test_cyrillic_target_does_not_damage_existing_letters(self):
        self.assertEqual(self.converter.convert("Ц Ь Э Щ объект sirk", AUTO, CYRILLIC).text,
                         "Ц Ь Э Щ объект цирк")

    def test_mixed_inside_word(self):
        self.assertEqual(self.converter.convert("salоm", AUTO, LATIN).text, "salom")
        self.assertEqual(self.converter.convert("salоm", AUTO, CYRILLIC).text, "салом")
        self.assertEqual(self.converter.convert("ўrik", AUTO, NEW_LATIN).text, "örik")

    def test_new_latin_round_trip(self):
        for text in ("O‘zbekiston g‘alaba shahar chiroq", "SH CH sh ch", "Shahar Chiroq", "TONG yangi"):
            new = self.converter.convert(text, LATIN, NEW_LATIN).text
            self.assertEqual(self.converter.convert(new, NEW_LATIN, LATIN).text, text)

    def test_invalid_alphabet(self):
        with self.assertRaises(ValueError):
            self.converter.convert("text", "unknown", LATIN)

    def test_configuration(self):
        import json
        with tempfile.TemporaryDirectory(dir=Path(__file__).resolve().parent) as folder:
            path = Path(folder) / "rules.json"
            rules = dict(self.converter.rules)
            rules["latin_to_cyrillic"] = {"test": "тест"}
            path.write_text(json.dumps(rules), encoding="utf-8")
            self.assertEqual(Converter(path).convert("TEST Test test", LATIN, CYRILLIC).text, "ТЕСТ Тест тест")
            rules["new_latin"] = {"sh": "ş"}
            path.write_text(json.dumps(rules), encoding="utf-8")
            with self.assertRaises(ValueError):
                Converter(path)


class FileTests(unittest.TestCase):
    def test_encodings_and_line_endings(self):
        with tempfile.TemporaryDirectory(dir=Path(__file__).resolve().parent) as folder:
            path = Path(folder) / "sample.txt"
            text = "Ўзбекистон\r\nO‘zbek\t🙂\n"
            write_text(path, text)
            self.assertEqual(read_text(path), text)
            self.assertEqual(path.read_bytes(), text.encode("utf-8"))
            for encoding in ("utf-8-sig", "utf-16"):
                path.write_bytes(text.encode(encoding))
                self.assertEqual(read_text(path), text)
            path.write_bytes("Ўзбекистон".encode("cp1251"))
            self.assertEqual(read_text(path, "cp1251"), "Ўзбекистон")
            with self.assertRaises(UnicodeError):
                read_text(path)


if __name__ == "__main__":
    unittest.main()
