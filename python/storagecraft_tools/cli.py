"""Command-line entry point for the StorageCraft Python toolkit."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from .models import erasure_coding, gpu_memory, nvme_queues, rag_storage
from .raid import calculate_raid, compare_raids


def parser() -> argparse.ArgumentParser:
    root = argparse.ArgumentParser(prog="storagecraft-py", description="StorageCraft Python learning tools")
    commands = root.add_subparsers(dest="command", required=True)
    raid = commands.add_parser("raid", help="calculate idealized RAID capacity")
    raid.add_argument("--level", required=True)
    raid.add_argument("--disks", required=True, type=int)
    raid.add_argument("--size", required=True, type=float, help="disk size in decimal TB")
    raid.add_argument("--groups", default=2, type=int)
    raid.add_argument("--compare", action="store_true")
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
        result = compare_raids(args.disks, args.size, args.groups) if args.compare else calculate_raid(args.level, args.disks, args.size, args.groups)
        if args.json:
            print(json.dumps(result if isinstance(result, list) else result.as_dict(), indent=2))
        else:
            if isinstance(result, list):
                for item in result:
                    print(f"{item['level']}: {item.get('usable_tb', 'invalid')}" + (f" · {item['error']}" if 'error' in item else " TB"))
                return 0
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
