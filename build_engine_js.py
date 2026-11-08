import json
from pathlib import Path

root = Path(__file__).resolve().parent
rules_path = root / "Web uchun" / "rules.json"
rules_data = json.loads(rules_path.read_text(encoding="utf-8"))

js_engine_code = f"""/**
 * JMA Alifbo Web Engine v1.3 (Core v1.2)
 * Muallif: Mo'minov Jaloliddin Azizjon o'g'li
 * 100% Client-side, xavfsiz va bir zumda o'giruvchi Lotin-Kirill dvigateli
 */
(function(window) {{
    'use strict';

    const RULES = {json.dumps(rules_data, ensure_ascii=False, indent=2)};

    const LATIN = "Lotin (amaldagi)";
    const NEW_LATIN = "Yangi lotin (Ö, Ğ, Ş, Ç)";
    const CYRILLIC = "Kirill";
    const AUTO = "Avto aniqlash";
    const MIXED = "Aralash yozuv";
    const APOSTROPHES = "'‘’ʻʼ`ʹ";

    const WORD_REGEX = /(?:[\\p{{L}}\\u0300-\\u036f])+(?:['‘’ʻʼ`ʹ](?:[\\p{{L}}\\u0300-\\u036f])+)*(?:(?<=[oOgG])['‘’`ʹ])?/gu;
    const CYR_REGEX = /[А-Яа-яЁёЎўҚқҒғҲҳ]/u;
    const LAT_REGEX = /[A-Za-zÖöĞğŞşÇç]/u;
    const NOMINAL_SUFFIX_REGEX = /^(?:lar)?(?:cha|chi|lik|li|siz|simon)?(?:lar)?(?:im|ing|imiz|ingiz|i|si)?(?:ning|ni|ga|ka|qa|da|dan|gacha)?(?:dir|mi|ku)?$/u;
    const SPELLING_HINTS = {{ "senariy": "ssenariy", "episentr": "epitsentr" }};

    const LAT_CYR_SINGLES = {{
        "a": "а", "b": "б", "d": "д", "f": "ф", "g": "г", "h": "ҳ", "i": "и", "j": "ж",
        "k": "к", "l": "л", "m": "м", "n": "н", "o": "о", "p": "п", "q": "қ", "r": "р",
        "s": "с", "t": "т", "u": "у", "v": "в", "x": "х", "y": "й", "z": "з"
    }};

    const LAT_CYR_PAIRS = {{
        "o‘": "ў", "g‘": "ғ", "sh": "ш", "ch": "ч",
        "yo": "ё", "yu": "ю", "ya": "я", "ye": "е"
    }};

    const CYR_LAT_MAP = {{
        "а": "a", "б": "b", "в": "v", "г": "g", "д": "d", "ж": "j", "з": "z",
        "и": "i", "й": "y", "к": "k", "л": "l", "м": "m", "н": "n", "о": "o",
        "п": "p", "р": "r", "с": "s", "т": "t", "у": "u", "ф": "f", "х": "x",
        "э": "e", "ҳ": "h", "қ": "q", "ў": "o‘", "ғ": "g‘", "ш": "sh", "ч": "ch",
        "ё": "yo", "ю": "yu", "я": "ya", "ъ": "‘", "ь": ""
    }};

    const REVERSE_NEW_LATIN = {{}};
    for (const [k, v] of Object.entries(RULES.new_latin)) {{
        REVERSE_NEW_LATIN[v.toLowerCase()] = k;
    }}

    const SUFFIX_STEMS = {{ latin_to_cyrillic: {{}}, cyrillic_to_latin: {{}} }};
    for (const direction of ["latin_to_cyrillic", "cyrillic_to_latin"]) {{
        const stems = {{}};
        for (const [k, v] of Object.entries(RULES[direction])) {{
            if (k.includes("ц") || v.includes("ц")) {{
                stems[k] = v;
            }}
        }}
        if (direction === "cyrillic_to_latin") {{
            for (const [k, v] of Object.entries(stems)) {{
                if (k.endsWith("ь")) {{
                    stems[k.slice(0, -1)] = v;
                }}
            }}
        }}
        SUFFIX_STEMS[direction] = stems;
    }}

    function isUpper(str) {{
        return Boolean(str) && str.toUpperCase() === str && str.toLowerCase() !== str;
    }}

    function isLower(str) {{
        return Boolean(str) && str.toLowerCase() === str && str.toUpperCase() !== str;
    }}

    function isTitle(str) {{
        if (!str || str.length === 0) return false;
        const first = str[0];
        const rest = str.slice(1);
        const firstIsUpper = isUpper(first);
        const restIsLower = rest.length === 0 || (!isUpper(rest) && rest.toLowerCase() === rest);
        return firstIsUpper && restIsLower;
    }}

    function _case(value, original, allCaps) {{
        if (!value) return "";
        if (allCaps || (original && original.length > 1 && isUpper(original))) {{
            return value.toUpperCase();
        }}
        if (original && isUpper(original[0])) {{
            return value.charAt(0).toUpperCase() + value.slice(1);
        }}
        return value;
    }}

    function _normalize(word) {{
        return word.replace(/['‘’ʻʼ`ʹ]/g, "‘");
    }}

    function _latin_to_new(word) {{
        word = _normalize(word);
        const caps = isUpper(word);
        const out = [];
        let index = 0;
        while (index < word.length) {{
            const pair = word.slice(index, index + 2);
            const lowPair = pair.toLowerCase();
            if (RULES.new_latin[lowPair]) {{
                out.push(_case(RULES.new_latin[lowPair], pair, caps));
                index += 2;
            }} else {{
                out.push(word[index] === "‘" ? "ʼ" : word[index]);
                index += 1;
            }}
        }}
        return out.join("");
    }}

    function _new_to_latin(word) {{
        const caps = isUpper(word);
        const out = [];
        for (let i = 0; i < word.length; i++) {{
            const c = word[i];
            const low = c.toLowerCase();
            if (REVERSE_NEW_LATIN[low]) {{
                out.push(_case(REVERSE_NEW_LATIN[low], c, caps));
            }} else if (APOSTROPHES.includes(c)) {{
                out.push("‘");
            }} else {{
                out.push(c);
            }}
        }}
        return out.join("");
    }}

    function _exception(word, direction) {{
        const dict = RULES[direction] || {{}};
        const lowWord = word.toLowerCase();
        const cleanCase = isLower(word) || isUpper(word) || isTitle(word);

        const value = dict[lowWord];
        if (value && cleanCase) {{
            return _case(value, word, isUpper(word));
        }}
        if (!cleanCase) {{
            return null;
        }}

        const stems = SUFFIX_STEMS[direction];
        const maxSplit = Math.min(word.length - 1, 100);
        for (let split = maxSplit; split > 0; split--) {{
            const stem = word.slice(0, split);
            const stemVal = stems[stem.toLowerCase()];
            if (stemVal === undefined) continue;

            const tail = word.slice(split);
            const latinTail = direction === "latin_to_cyrillic"
                ? tail.toLowerCase()
                : _cyr_to_latin(tail).toLowerCase();

            if (latinTail && NOMINAL_SUFFIX_REGEX.test(latinTail)) {{
                if (direction === "latin_to_cyrillic") {{
                    const cleanVal = stemVal.replace(/ь+$/, "");
                    return _case(cleanVal, stem, isUpper(word)) + _latin_to_cyr(tail);
                }} else {{
                    return _case(stemVal, stem, isUpper(word)) + _cyr_to_latin(tail);
                }}
            }}
        }}
        return null;
    }}

    function _latin_to_cyr(word) {{
        word = _normalize(word);
        const special = _exception(word, "latin_to_cyrillic");
        if (special !== null) return special;

        const caps = isUpper(word);
        const out = [];
        let index = 0;
        while (index < word.length) {{
            const char = word[index];
            const low = char.toLowerCase();
            const pair = word.slice(index, index + 2);
            const lowPair = pair.toLowerCase();

            if (lowPair === "ts") {{
                const next5 = word.slice(index, index + 5).toLowerCase();
                if (next5 === "tsiya" || next5 === "tsion") {{
                    out.push(_case("ц", pair, caps));
                    index += 2;
                    continue;
                }}
            }}

            if (word.slice(index, index + 3).toLowerCase() === "s‘h") {{
                out.push(_case("с", char, caps));
                out.push(_case("ҳ", word[index + 2], caps));
                index += 3;
                continue;
            }}

            if (LAT_CYR_PAIRS[lowPair] && !(lowPair === "yo" && word.slice(index + 2, index + 3) === "‘")) {{
                out.push(_case(LAT_CYR_PAIRS[lowPair], pair, caps));
                index += 2;
                continue;
            }}

            let value;
            if (low === "e") {{
                value = (index === 0 || "aeiou‘".includes(word[index - 1].toLowerCase())) ? "э" : "е";
            }} else if (char === "‘") {{
                value = "ъ";
            }} else {{
                value = LAT_CYR_SINGLES[low] !== undefined ? LAT_CYR_SINGLES[low] : char;
            }}
            out.push(_case(value, char, caps));
            index += 1;
        }}
        return out.join("");
    }}

    function _cyr_to_latin(word) {{
        const special = _exception(word, "cyrillic_to_latin");
        if (special !== null) return special;

        const out = [];
        const caps = isUpper(word);
        for (let index = 0; index < word.length; index++) {{
            const char = word[index];
            const low = char.toLowerCase();
            let value;
            if (low === "е") {{
                value = (index === 0 || "аеиоуэёюяўъь".includes(word[index - 1].toLowerCase())) ? "ye" : "e";
            }} else if (low === "ц") {{
                value = (index > 0 && "аеиоуэёюя".includes(word[index - 1].toLowerCase())) ? "ts" : "s";
            }} else {{
                value = CYR_LAT_MAP[low] !== undefined ? CYR_LAT_MAP[low] : char;
            }}
            out.push(value ? _case(value, char, caps) : "");
        }}
        return out.join("");
    }}

    function detect(text) {{
        if (!text || !text.trim()) return "Aniqlash uchun harf kiriting";
        text = text.normalize("NFC");
        const hasCyr = CYR_REGEX.test(text);
        const hasLat = LAT_REGEX.test(text);
        const newChars = Object.values(RULES.new_latin);
        const hasNew = Array.from(text).some(c => newChars.includes(c.toLowerCase()));
        const hasOld = /[ogOG]['‘’ʻʼ`ʹ]|sh|ch|SH|CH|Sh|Ch/i.test(text);

        if ((hasCyr && hasLat) || (hasNew && hasOld)) {{
            return MIXED;
        }}
        if (hasCyr) return CYRILLIC;
        if (hasNew) return NEW_LATIN;
        return hasLat ? LATIN : "Aniqlash uchun harf kiriting";
    }}

    function convert(text, source, target) {{
        text = text || "";
        const detected = detect(text);
        const warnings = [];

        let targetNorm = target;
        if (target === "latin") targetNorm = LATIN;
        if (target === "new_latin") targetNorm = NEW_LATIN;
        if (target === "cyrillic") targetNorm = CYRILLIC;

        if (detected === MIXED) {{
            warnings.push("Aralash yozuvdagi qismlar tanlangan natija alifbosiga o‘girildi.");
        }}
        if (CYR_REGEX.test(text) || targetNorm === CYRILLIC) {{
            warnings.push("Kirill bilan konvertatsiya taxminiy: е/э, ё, ц, ъ/ь, yo/ye va o‘zlashma so‘zlarni tekshiring. Ortga o‘girish asl matnni doim tiklamaydi.");
        }}
        if (targetNorm !== LATIN && /sh|ch/i.test(text)) {{
            warnings.push("Sh/ch bitta harf deb olindi; alohida s+h uchun s’h yozing. Chet tilidagi so‘zlarni tekshiring.");
        }}

        if (!text) {{
            return {{
                text: "",
                warnings: warnings,
                detected: detected
            }};
        }}

        const hints = new Set();
        const convertedText = text.replace(WORD_REGEX, function(match) {{
            const word = match.normalize("NFC");
            const lowered = word.toLowerCase();
            for (const [typo, spelling] of Object.entries(SPELLING_HINTS)) {{
                if (lowered.startsWith(typo) && NOMINAL_SUFFIX_REGEX.test(lowered.slice(typo.length))) {{
                    hints.add("Imlo eslatmasi: " + typo + " o‘rniga " + spelling + " shaklini tekshiring. Manba imlosi avtomatik tuzatilmadi.");
                }}
            }}

            const runs = word.split(/([А-Яа-яЁёЎўҚқҒғҲҳ]+)/u);
            const converted = [];
            for (const run of runs) {{
                if (!run) continue;
                if (CYR_REGEX.test(run[0])) {{
                    converted.push(targetNorm === CYRILLIC ? run : _cyr_to_latin(run));
                }} else {{
                    const hasNewChar = Array.from(run).some(c => Object.values(RULES.new_latin).includes(c.toLowerCase()));
                    const latin = hasNewChar ? _new_to_latin(run) : run;
                    converted.push(targetNorm === CYRILLIC ? _latin_to_cyr(latin) : latin);
                }}
            }}
            const normalized = converted.join("");
            if (targetNorm === CYRILLIC) return normalized;
            if (targetNorm === NEW_LATIN) return _latin_to_new(normalized);
            return normalized;
        }});

        const sortedHints = Array.from(hints).sort();
        return {{
            text: convertedText,
            warnings: warnings.concat(sortedHints),
            detected: detected
        }};
    }}

    window.JMAAlifbo = {{
        LATIN: LATIN,
        NEW_LATIN: NEW_LATIN,
        CYRILLIC: CYRILLIC,
        AUTO: AUTO,
        MIXED: MIXED,
        detect: detect,
        convert: convert,
        rules: RULES
    }};

}})(typeof window !== 'undefined' ? window : this);
"""

out_file = root / "assets" / "alifbo" / "alifbo-engine.js"
out_file.parent.mkdir(parents=True, exist_ok=True)
out_file.write_text(js_engine_code, encoding="utf-8")
print(f"alifbo-engine.js generated successfully ({len(js_engine_code)} bytes)")
