"""Rebuild reviewed Ц exceptions from the attributed source snapshot.

Developer tool only. The application loads rules.json and never fetches data.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE_URL = "https://xushnudbek.blogspot.com/p/blog-page_1204.html"
# Source typos/uncertain spelling are kept in the snapshot, not shipped blindly.
SKIP = {"абцесс", "абцисса", "менингококкцемия"}
ADDITIONS = {
    "rektifikatsiya": "ректификация", "animatsiya": "анимация",
    "parsial": "парциал", "sezar": "цезарь",
    "abssess": "абсцесс", "abssissa": "абсцисса",
}


def normalized(text):
    return "".join("‘" if c in "'‘’ʻʼ`ʹ" else c for c in text.lower())


def reviewed_pairs():
    pairs = set()
    for line in (ROOT / "data/ts_words_source.tsv").read_text(encoding="utf-8").splitlines():
        cyr, latin = line.split("\t")
        if cyr.lower() in SKIP:
            continue
        cyr_parts, latin_parts = cyr.strip("-").split("-"), latin.strip("-").split("-")
        if len(cyr_parts) != len(latin_parts):
            raise ValueError("Compound alignment error: " + line)
        for cyr_part, latin_part in zip(cyr_parts, latin_parts):
            if "ц" in cyr_part.lower():
                pairs.add((normalized(latin_part), cyr_part.lower()))
    pairs.update(ADDITIONS.items())
    return sorted(pairs)


def main():
    path = ROOT / "rules.json"
    rules = json.loads(path.read_text(encoding="utf-8"))
    for latin, cyr in reviewed_pairs():
        for direction, key, value in (("latin_to_cyrillic", latin, cyr),
                                      ("cyrillic_to_latin", cyr, latin)):
            previous = rules[direction].get(key)
            if previous is not None and previous != value:
                raise ValueError(f"Conflicting dictionary entry: {key}")
            rules[direction][key] = value
    for direction in ("latin_to_cyrillic", "cyrillic_to_latin"):
        rules[direction] = dict(sorted(rules[direction].items()))
    path.write_text(json.dumps(rules, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Reviewed Ц word pairs: {len(reviewed_pairs())}")
    print(f"Full Latin/Cyrillic exceptions: {len(rules['latin_to_cyrillic'])}/{len(rules['cyrillic_to_latin'])}")


if __name__ == "__main__":
    main()
