"""Offline Uzbek transliteration. No GUI or third-party dependencies."""
from dataclasses import dataclass
from pathlib import Path
import json
import re
import unicodedata
from safety import MAX_RULES_BYTES, check_text_size

LATIN = "Lotin (amaldagi)"
NEW_LATIN = "Yangi lotin (Ö, Ğ, Ş, Ç)"
CYRILLIC = "Kirill"
ALPHABETS = (LATIN, NEW_LATIN, CYRILLIC)
AUTO = "Avto aniqlash"
SOURCE_ALPHABETS = (AUTO,) + ALPHABETS
MIXED = "Aralash yozuv"
APOSTROPHES = "'‘’ʻʼ`ʹ"
WORD = re.compile(r"(?:[^\W\d_]|[\u0300-\u036f])+(?:['‘’ʻʼ`ʹ](?:[^\W\d_]|[\u0300-\u036f])+)*(?:(?<=[oOgG])['‘’`ʹ])?", re.UNICODE)
CYR = re.compile(r"[А-Яа-яЁёЎўҚқҒғҲҳ]")
LAT = re.compile(r"[A-Za-zÖöĞğŞşÇç]")
# Conservative nominal suffix chain; this is not a complete morphology engine.
NOMINAL_SUFFIX = re.compile(
    r"(?:lar)?(?:cha|chi|lik|li|siz|simon)?(?:lar)?"
    r"(?:im|ing|imiz|ingiz|i|si)?(?:ning|ni|ga|ka|qa|da|dan|gacha)?(?:dir|mi|ku)?"
)
SPELLING_HINTS = {"senariy": "ssenariy", "episentr": "epitsentr"}


@dataclass(frozen=True)
class ConversionResult:
    text: str
    warnings: tuple[str, ...] = ()


def _case(value: str, original: str, all_caps: bool = False) -> str:
    if all_caps or (len(original) > 1 and original.isupper()):
        return value.upper()
    if original and original[0].isupper():
        return value[0].upper() + value[1:]
    return value


class Converter:
    def __init__(self, config_path: Path | str | None = None):
        path = Path(config_path) if config_path else Path(__file__).with_name("rules.json")
        def unique_object(pairs):
            result = {}
            for key, value in pairs:
                if key in result:
                    raise ValueError(f"Sozlamada takrorlangan kalit: {key}")
                result[key] = value
            return result

        with path.open("rb") as stream:
            data = stream.read(MAX_RULES_BYTES + 1)
        if len(data) > MAX_RULES_BYTES:
            raise ValueError("rules.json hajmi 128 KB dan oshmasligi kerak.")
        try:
            self.rules = json.loads(data.decode("utf-8-sig"), object_pairs_hook=unique_object)
        except RecursionError as error:
            raise ValueError("rules.json ichma-ich tuzilishi haddan tashqari chuqur.") from error
        if not isinstance(self.rules, dict) or set(self.rules) != {"new_latin", "latin_to_cyrillic", "cyrillic_to_latin"}:
            raise ValueError("rules.json tarkibi noto‘g‘ri.")
        mapping = self.rules["new_latin"]
        if not isinstance(mapping, dict) or set(mapping) != {"o‘", "g‘", "sh", "ch"}:
            raise ValueError("new_latin kalitlari o‘, g‘, sh, ch bo‘lishi kerak.")
        values = list(mapping.values())
        if any(not isinstance(v, str) or len(v) != 1 or not v.isalpha() or not v.islower()
               for v in values) or len(set(values)) != 4:
            raise ValueError("Yangi harflar to‘rtta turli kichik Unicode harfi bo‘lishi kerak.")
        for direction in ("latin_to_cyrillic", "cyrillic_to_latin"):
            entries = self.rules.get(direction, {})
            if not isinstance(entries, dict) or len(entries) > 2000 or any(
                not isinstance(k, str) or not isinstance(v, str) or not k or not v
                or len(k) > 100 or len(v) > 100 or k != k.lower() or v != v.lower()
                or not all(c.isalpha() or c in APOSTROPHES for c in k + v)
                for k, v in entries.items()
            ):
                raise ValueError(f"{direction}: istisnolar matn juftliklari bo‘lishi kerak.")
        self._suffix_stems = {}
        for direction in ("latin_to_cyrillic", "cyrillic_to_latin"):
            stems = {key: value for key, value in self.rules[direction].items()
                     if "ц" in key or "ц" in value}
            if direction == "cyrillic_to_latin":
                # Cyrillic soft signs may disappear before an Uzbek suffix.
                stems.update({key[:-1]: value for key, value in list(stems.items()) if key.endswith("ь")})
            self._suffix_stems[direction] = stems

    def detect(self, text: str) -> str:
        check_text_size(text)
        text = unicodedata.normalize("NFC", text)
        has_cyr, has_lat = bool(CYR.search(text)), bool(LAT.search(text))
        has_new = any(c.lower() in self.rules["new_latin"].values() for c in text)
        has_old = bool(re.search(r"[og]['‘’ʻʼ`ʹ]|sh|ch", text, re.I))
        if (has_cyr and has_lat) or (has_new and has_old):
            return MIXED
        if has_cyr:
            return CYRILLIC
        if has_new:
            return NEW_LATIN
        return LATIN if has_lat else "Aniqlash uchun harf kiriting"

    def convert(self, text: str, source: str, target: str) -> ConversionResult:
        check_text_size(text)
        if source not in SOURCE_ALPHABETS or target not in ALPHABETS:
            raise ValueError("Noma’lum alifbo.")
        warnings = []
        if self.detect(text) == MIXED:
            warnings.append("Aralash yozuvdagi qismlar tanlangan natija alifbosiga o‘girildi.")
        if CYR.search(text) or target == CYRILLIC:
            warnings.append("Kirill bilan konvertatsiya taxminiy: е/э, ё, ц, ъ/ь, yo/ye va o‘zlashma so‘zlarni tekshiring. Ortga o‘girish asl matnni doim tiklamaydi.")
        if target != LATIN and re.search(r"sh|ch", text, re.I):
            warnings.append("Sh/ch bitta harf deb olindi; alohida s+h uchun s’h yozing. Chet tilidagi so‘zlarni tekshiring.")
        hints = set()
        def replace(match):
            word = unicodedata.normalize("NFC", match.group())
            lowered = word.lower()
            for typo, spelling in SPELLING_HINTS.items():
                if lowered.startswith(typo) and NOMINAL_SUFFIX.fullmatch(lowered[len(typo):]):
                    hints.add(f"Imlo eslatmasi: {typo} o‘rniga {spelling} shaklini tekshiring. Manba imlosi avtomatik tuzatilmadi.")
            # Convert script runs separately, including runs inside a mixed word.
            # Existing Cyrillic must never be round-tripped through Latin.
            runs = re.split(r"([А-Яа-яЁёЎўҚқҒғҲҳ]+)", word)
            converted = []
            for run in runs:
                if not run:
                    continue
                if CYR.fullmatch(run[0]):
                    converted.append(run if target == CYRILLIC else self._cyr_to_latin(run))
                else:
                    latin = self._new_to_latin(run) if any(
                        c.lower() in self.rules["new_latin"].values() for c in run
                    ) else run
                    converted.append(self._latin_to_cyr(latin) if target == CYRILLIC else latin)
            normalized = "".join(converted)
            if target == CYRILLIC:
                return normalized
            if target == NEW_LATIN:
                return self._latin_to_new(normalized)
            return normalized
        converted_text = WORD.sub(replace, text)
        return ConversionResult(converted_text, tuple(warnings + sorted(hints)))

    @staticmethod
    def _normalize(word):
        return "".join("‘" if char in APOSTROPHES else char for char in word)

    def _latin_to_new(self, word):
        word = self._normalize(word)
        caps = word.isupper()
        out, index = [], 0
        while index < len(word):
            pair = word[index:index + 2]
            if pair.lower() in self.rules["new_latin"]:
                out.append(_case(self.rules["new_latin"][pair.lower()], pair, caps))
                index += 2
            else:
                # Normalize only internal tutuq, leaving surrounding quotation marks intact.
                out.append("ʼ" if word[index] == "‘" else word[index])
                index += 1
        return "".join(out)

    def _new_to_latin(self, word):
        reverse = {v: k for k, v in self.rules["new_latin"].items()}
        caps = word.isupper()
        return "".join(_case(reverse[c.lower()], c, caps) if c.lower() in reverse
                       else "‘" if c in APOSTROPHES else c for c in word)

    def _exception(self, word, direction):
        value = self.rules.get(direction, {}).get(word.lower())
        # Arbitrary mixed case cannot be recovered from a word-level exception.
        if value and (word.islower() or word.isupper() or word.istitle()):
            return _case(value, word, word.isupper())
        if not (word.islower() or word.isupper() or word.istitle()):
            return None
        # Try the longest known Ц stem, only if the entire tail is a supported
        # suffix chain. Prefix-only replacement would damage unrelated words.
        stems = self._suffix_stems[direction]
        for split in range(min(len(word) - 1, 100), 0, -1):
            stem = word[:split]
            value = stems.get(stem.lower())
            if value is None:
                continue
            tail = word[split:]
            latin_tail = tail.lower() if direction == "latin_to_cyrillic" else self._cyr_to_latin(tail).lower()
            if latin_tail and NOMINAL_SUFFIX.fullmatch(latin_tail):
                if direction == "latin_to_cyrillic":
                    return _case(value.rstrip("ь"), stem, word.isupper()) + self._latin_to_cyr(tail)
                return _case(value, stem, word.isupper()) + self._cyr_to_latin(tail)
        return None

    def _latin_to_cyr(self, word):
        word = self._normalize(word)
        special = self._exception(word, "latin_to_cyrillic")
        if special is not None:
            return special
        singles = dict(zip("abdfghijklmnopqrstuvxyz", "абдфгҳижклмнопқрстувхйз"))
        pairs = {"o‘": "ў", "g‘": "ғ", "sh": "ш", "ch": "ч",
                 "yo": "ё", "yu": "ю", "ya": "я", "ye": "е"}
        caps, out, index = word.isupper(), [], 0
        while index < len(word):
            char = word[index]
            low = char.lower()
            pair = word[index:index + 2]
            # Productive borrowed endings; do not rewrite ts in aytsa/o‘tsa.
            if pair.lower() == "ts" and word[index:index + 5].lower() in {"tsiya", "tsion"}:
                out.append(_case("ц", pair, caps))
                index += 2
                continue
            if word[index:index + 3].lower() == "s‘h":
                out.append(_case("с", char, caps))
                out.append(_case("ҳ", word[index + 2], caps))
                index += 3
                continue
            # yo‘ is y + o‘ (йў), not yo + tutuq (ёъ).
            if pair.lower() in pairs and not (
                pair.lower() == "yo" and word[index + 2:index + 3] == "‘"
            ):
                out.append(_case(pairs[pair.lower()], pair, caps))
                index += 2
                continue
            if low == "e":
                value = "э" if index == 0 or word[index - 1].lower() in "aeiou‘" else "е"
            elif char == "‘":
                value = "ъ"
            else:
                value = singles.get(low, char)
            out.append(_case(value, char, caps))
            index += 1
        return "".join(out)

    def _cyr_to_latin(self, word):
        special = self._exception(word, "cyrillic_to_latin")
        if special is not None:
            return special
        mapping = dict(zip("абвгджзийклмнопрстуфхэҳқ", "abvgdjziyklmnoprstufxehq"))
        mapping.update({"ў": "o‘", "ғ": "g‘", "ш": "sh", "ч": "ch",
                        "ё": "yo", "ю": "yu", "я": "ya", "ъ": "‘", "ь": ""})
        out, caps = [], word.isupper()
        for index, char in enumerate(word):
            low = char.lower()
            if low == "е":
                value = "ye" if index == 0 or word[index - 1].lower() in "аеиоуэёюяўъь" else "e"
            elif low == "ц":
                value = "ts" if index and word[index - 1].lower() in "аеиоуэёюя" else "s"
            else:
                value = mapping.get(low, char)
            out.append(_case(value, char, caps) if value else "")
        return "".join(out)
