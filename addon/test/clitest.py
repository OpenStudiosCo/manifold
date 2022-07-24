"""Test the image tracer."""
from pathlib import Path

from svgtrace import trace

THISDIR = str(Path(__file__).resolve().parent)
logoFile = f"{THISDIR}\\"

print(f"{logoFile}demo2.jpg")

Path(
    f"{logoFile}demo2.svg").write_text(
        trace(
            f"{logoFile}demo2.jpg"
        ), encoding="utf-8"
)
