"""Independent Ц regression examples from the reported failures."""
import unittest

from converter import Converter, AUTO, LATIN, NEW_LATIN, CYRILLIC


class TsTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.converter = Converter()

    def test_reported_words(self):
        cases = {
            "rektifikatsiya": "ректификация", "sement": "цемент",
            "parsial": "парциал", "aksiya": "акция", "sirk": "цирк",
            "siklon": "циклон", "animatsiya": "анимация",
            "deformatsiya": "деформация", "aviatsiya": "авиация",
            "adaptatsiya": "адаптация", "ssenariy": "сценарий",
            "konsert": "концерт", "dotsent": "доцент",
            "epitsentr": "эпицентр", "silindr": "цилиндр", "sezar": "цезарь",
        }
        for latin, cyr in cases.items():
            for style in (str.lower, str.title, str.upper):
                for source in (AUTO, LATIN, NEW_LATIN):
                    with self.subTest(word=latin, source=source, case=style.__name__):
                        self.assertEqual(self.converter.convert(style(latin), source, CYRILLIC).text, style(cyr))
                        self.assertEqual(self.converter.convert(style(cyr), CYRILLIC, LATIN).text, style(latin))

    def test_suffix_chains_both_directions(self):
        cases = {
            "siklonlar": "циклонлар", "siklonlardan": "циклонлардан",
            "silindrning": "цилиндрнинг", "silindrsimon": "цилиндрсимон",
            "dotsentlik": "доцентлик", "dotsentlarimizga": "доцентларимизга",
            "animatsiyalarida": "анимацияларида", "ssenariyning": "сценарийнинг",
            "sementdan": "цементдан", "sezarga": "цезарга",
            "sirkchi": "циркчи", "siklli": "циклли", "fransuzcha": "французча",
        }
        for latin, cyr in cases.items():
            with self.subTest(word=latin):
                self.assertEqual(self.converter.convert(latin, AUTO, CYRILLIC).text, cyr)
                self.assertEqual(self.converter.convert(cyr, AUTO, LATIN).text, latin)

    def test_real_t_plus_s_is_not_a_ts_sound(self):
        cases = {"aytsa": "айтса", "o‘tsa": "ўтса", "sotsa": "сотса",
                 "qaytsa": "қайтса", "ketsa": "кетса", "yetsa": "етса",
                 "siklonx": "сиклонх", "sirkon": "сиркон", "sen": "сен"}
        for latin, cyr in cases.items():
            with self.subTest(word=latin):
                self.assertEqual(self.converter.convert(latin, AUTO, CYRILLIC).text, cyr)

    def test_productive_endings_outside_dictionary(self):
        # Deliberately not dictionary entries: exercise the actual fallback rule.
        for latin, cyr in (("nanoanimatsiya", "наноанимация"),
                           ("nanoanimatsiyalar", "наноанимациялар"),
                           ("innovatsion", "инновацион")):
            with self.subTest(word=latin):
                self.assertEqual(self.converter.convert(latin, AUTO, CYRILLIC).text, cyr)

    def test_typos_are_reported_not_silently_corrected(self):
        result = self.converter.convert("senariy episentr", AUTO, CYRILLIC)
        self.assertEqual(result.text, "сенарий эписентр")
        self.assertTrue(any("ssenariy" in warning for warning in result.warnings))
        self.assertTrue(any("epitsentr" in warning for warning in result.warnings))
        result = self.converter.convert("senariylar episentrning", AUTO, CYRILLIC)
        self.assertTrue(any("ssenariy" in warning for warning in result.warnings))
        self.assertTrue(any("epitsentr" in warning for warning in result.warnings))

    def test_mixed_and_new_latin(self):
        text = "siklon циклон — animatsiya анимация\r\nSsenariy, ssenariyçi!"
        self.assertEqual(self.converter.convert(text, AUTO, CYRILLIC).text,
                         "циклон циклон — анимация анимация\r\nСценарий, сценарийчи!")
        self.assertEqual(self.converter.convert("Сценарийчи Циркчи", AUTO, NEW_LATIN).text,
                         "Ssenariyçi Sirkçi")

    def test_compound_and_other_source_exceptions(self):
        cases = {"vitse-prezident": "вице-президент", "San-fransisko": "Сан-франциско",
                 "Mersedes-bens": "Мерседес-бенц", "kon’yunksiya": "конъюнкция",
                 "kalsiy": "кальций", "setse": "цеце", "abssissa": "абсцисса"}
        for latin, cyr in cases.items():
            with self.subTest(word=latin):
                self.assertEqual(self.converter.convert(latin, AUTO, CYRILLIC).text, cyr)


if __name__ == "__main__":
    unittest.main()
