"""Command-line entry point for the StorageCraft Python toolkit."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from .raid import calculate_raid


def parser() -> argparse.ArgumentParser:
    root = argparse.ArgumentParser(prog="storagecraft-py", description="StorageCraft Python learning tools")
    commands = root.add_subparsers(dest="command", required=True)
    raid = commands.add_parser("raid", help="calculate idealized RAID capacity")
    raid.add_argument("--level", required=True)
    raid.add_argument("--disks", required=True, type=int)
    raid.add_argument("--size", required=True, type=float, help="disk size in decimal TB")
    raid.add_argument("--json", action="store_true")
    learn = commands.add_parser("learn", help="list the ordered Zero-to-SAN curriculum")
    learn.add_argument("--json", action="store_true")
    return root


def _catalog() -> dict:
    root = Path(__file__).resolve().parents[2]
    return json.loads((root / "learning" / "catalog.json").read_text(encoding="utf-8"))


def main(argv: list[str] | None = None) -> int:
    args = parser().parse_args(argv)
    if args.command == "raid":
        result = calculate_raid(args.level, args.disks, args.size)
        if args.json:
            print(json.dumps(result.as_dict(), indent=2))
        else:
            print(f"{result.level}: {result.usable_tb:g} TB usable · {result.efficiency:.1%} efficiency · tolerates {result.max_failures} failure(s)")
        return 0
    catalog = _catalog()
    if args.json:
        print(json.dumps(catalog, indent=2))
    else:
        print(catalog["program"])
        for module in catalog["modules"]:
            print(f"{module['order']:>2}  {module['title']} ({module['minutes']} min)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
