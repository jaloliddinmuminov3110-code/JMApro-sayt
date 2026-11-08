"""Small, explicit limits shared by the GUI and file/conversion layers."""
from pathlib import Path

APP_DIR = Path(__file__).resolve().parent
MAX_TEXT_CHARS = 500_000
MAX_FILE_BYTES = 5 * 1024 * 1024
MAX_RULES_BYTES = 128 * 1024


def check_text_size(text: str) -> None:
    if len(text) > MAX_TEXT_CHARS:
        raise ValueError("Matn juda katta. Bir safarda ko‘pi bilan 500 000 belgi ishlating.")


def check_output_path(path: str | Path) -> Path:
    path = Path(path).absolute()
    if path.is_symlink() or getattr(path, "is_junction", lambda: False)():
        raise ValueError("Natijani havola faylga saqlab bo‘lmaydi. Boshqa TXT fayl tanlang.")
    resolved = path.resolve()
    protected = {"main.py", "converter.py", "text_files.py", "safety.py", "rules.json",
                 "start.bat", "start.ps1", "README.md", "SECURITY.md"}
    if resolved in {(APP_DIR / name).resolve() for name in protected} or (APP_DIR / "assets").resolve() in resolved.parents:
        raise ValueError("Dastur fayllari ustiga natija yozish taqiqlangan.")
    if path.suffix.lower() != ".txt":
        raise ValueError("Natijani faqat .txt kengaytmali faylga saqlang.")
    return path
