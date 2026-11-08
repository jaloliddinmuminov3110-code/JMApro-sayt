"""Run from this folder: python verify_golden.py"""
from pathlib import Path
import hashlib, json
from converter import Converter, AUTO, LATIN, NEW_LATIN, CYRILLIC
root=Path(__file__).resolve().parent
ids={'auto':AUTO,'latin':LATIN,'new_latin':NEW_LATIN,'cyrillic':CYRILLIC}
c=Converter(root/'rules.json')
suite=json.loads((root/'tests/golden_cases.json').read_text(encoding='utf-8'))
for case in suite['cases']:
    actual=c.convert(case['text'],ids[case['source']],ids[case['target']])
    assert actual.text==case['expected'],case['name']
    assert list(actual.warnings)==case['warnings'],case['name']+' warnings'
    assert c.detect(case['text'])==case['detected'],case['name']+' detection'
print('PASS:',len(suite['cases']),'conversion, warning and detection cases')
