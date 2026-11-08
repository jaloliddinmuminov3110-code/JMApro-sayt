"""Regression checks for data preservation and untrusted configuration."""
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

from converter import Converter, AUTO, LATIN
from safety import APP_DIR, MAX_TEXT_CHARS, MAX_FILE_BYTES, MAX_RULES_BYTES
from text_files import read_text, write_text


class SafetyTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory(dir=Path(__file__).resolve().parent)
        self.folder = Path(self.directory.name)

    def tearDown(self):
        self.directory.cleanup()

    def test_failed_replace_preserves_original_and_cleans_temporary(self):
        path = self.folder / "existing.txt"
        path.write_text("original", encoding="utf-8")
        with patch("text_files.os.replace", side_effect=OSError("write failed")):
            with self.assertRaises(OSError):
                write_text(path, "replacement")
        self.assertEqual(path.read_text(encoding="utf-8"), "original")
        self.assertEqual(list(self.folder.iterdir()), [path])

    def test_failed_sync_preserves_original(self):
        path = self.folder / "existing.txt"
        path.write_text("original", encoding="utf-8")
        with patch("text_files.os.fsync", side_effect=OSError("disk error")):
            with self.assertRaises(OSError):
                write_text(path, "replacement")
        self.assertEqual(path.read_text(encoding="utf-8"), "original")
        self.assertEqual(list(self.folder.iterdir()), [path])

    def test_program_files_cannot_be_overwritten(self):
        for name in ("main.py", "rules.json", "start.bat", "assets/logo.png", "assets/hidden.txt"):
            path = APP_DIR / name
            original = path.read_bytes() if path.exists() else None
            with self.subTest(name=name), self.assertRaises(ValueError):
                write_text(path, "changed")
            if original is not None:
                self.assertEqual(path.read_bytes(), original)
            else:
                self.assertFalse(path.exists())
        with self.assertRaises(ValueError):
            write_text(self.folder / "document.py", "changed")

    def test_limits_apply_to_open_and_convert(self):
        path = self.folder / "large.txt"
        path.write_bytes(b"x" * (MAX_FILE_BYTES + 1))
        with self.assertRaises(ValueError):
            read_text(path)
        text = "x" * (MAX_TEXT_CHARS + 1)
        converter = Converter()
        with self.assertRaises(ValueError):
            converter.convert(text, AUTO, LATIN)
        with self.assertRaises(ValueError):
            converter.detect(text)
        with self.assertRaises(ValueError):
            write_text(self.folder / "too-large.txt", text)

    def test_invalid_configurations_are_rejected(self):
        path = self.folder / "rules.json"
        base = json.loads((APP_DIR / "rules.json").read_text(encoding="utf-8"))
        documents = [[], None, {}, {**base, "new_latin": []},
                     {**base, "unknown": "entry"},
                     {**base, "latin_to_cyrillic": {"test": "bad\nvalue"}},
                     {**base, "latin_to_cyrillic": {"test": "bad\u202evalue"}},
                     {**base, "latin_to_cyrillic": {"test": "x" * 101}},
                     {**base, "cyrillic_to_latin": {"test": 42}}]
        for doc in documents:
            path.write_text(json.dumps(doc), encoding="utf-8")
            with self.subTest(doc=doc), self.assertRaises(ValueError):
                Converter(path)
        path.write_text('{"new_latin": {}, "new_latin": {}}', encoding="utf-8")
        with self.assertRaises(ValueError):
            Converter(path)
        path.write_text("[" * 2000 + "]" * 2000, encoding="utf-8")
        with self.assertRaises(ValueError):
            Converter(path)
        path.write_bytes(b" " * (MAX_RULES_BYTES + 1))
        with self.assertRaises(ValueError):
            Converter(path)
