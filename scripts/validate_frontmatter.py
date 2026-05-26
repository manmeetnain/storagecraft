#!/usr/bin/env python3
"""
StorageCraft — Frontmatter Validator
Usage: python3 scripts/validate_frontmatter.py
"""
import sys
from pathlib import Path
from datetime import datetime

CONTENT_DIR = Path("docs/src/content/docs")
REQUIRED = ["title", "description", "lastUpdated"]
errors, warnings = [], []

def parse_fm(text):
    if not text.startswith("---"): return {}
    end = text.find("---", 3)
    if end == -1: return {}
    fields = {}
    for line in text[3:end].strip().splitlines():
        if ":" in line and not line.startswith(" "):
            k, _, v = line.partition(":")
            fields[k.strip()] = v.strip()
    return fields

files = list(CONTENT_DIR.rglob("*.md")) + list(CONTENT_DIR.rglob("*.mdx"))
print(f"Validating {len(files)} file(s)...")

for f in files:
    rel = f.relative_to(CONTENT_DIR)
    fm = parse_fm(f.read_text())
    for field in REQUIRED:
        if field not in fm or not fm[field]:
            errors.append(f"{rel}: missing '{field}'")
    if "description" in fm and len(fm["description"]) > 160:
        warnings.append(f"{rel}: description too long ({len(fm['description'])} chars)")

for e in errors: print(f"  ✗ {e}")
for w in warnings: print(f"  ⚠ {w}")
if not errors and not warnings:
    print(f"✓ All {len(files)} files valid.")
sys.exit(1 if errors else 0)
