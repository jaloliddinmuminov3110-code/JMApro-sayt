"""Explicit encodings: never silently guess a legacy file's encoding."""
from pathlib import Path
import os
import tempfile

from safety import MAX_FILE_BYTES, check_output_path, check_text_size


def read_text(path: str | Path, encoding: str = "utf-8-sig") -> str:
    if encoding not in {"utf-8-sig", "cp1251", "utf-16"}:
        raise ValueError("Qo‘llanmaydigan fayl kodlashi.")
    with Path(path).open("rb") as stream:
        data = stream.read(MAX_FILE_BYTES + 1)
    if len(data) > MAX_FILE_BYTES:
        raise ValueError("Fayl juda katta. Ko‘pi bilan 5 MB TXT fayl oching.")
    if encoding == "utf-8-sig" and data.startswith((b"\xff\xfe", b"\xfe\xff")):
        encoding = "utf-16"
    text = data.decode(encoding)
    check_text_size(text)
    return text


def write_text(path: str | Path, text: str) -> None:
    check_text_size(text)
    path = check_output_path(path)
    data = text.encode("utf-8")
    temporary = None
    try:
        # Flush a complete sibling file before replacing the destination.
        # On a write failure the existing document is left intact.
        with tempfile.NamedTemporaryFile(mode="wb", dir=path.parent, prefix=".jma-", suffix=".tmp", delete=False) as stream:
            temporary = Path(stream.name)
            stream.write(data)
            stream.flush()
            os.fsync(stream.fileno())
        check_output_path(path)
        os.replace(temporary, path)
    finally:
        if temporary is not None and temporary.exists():
            temporary.unlink()
