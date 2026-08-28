"""Transparent RAID capacity calculations used by the Python companion CLI."""

from __future__ import annotations

from dataclasses import asdict, dataclass


@dataclass(frozen=True)
class RaidResult:
    level: str
    disks: int
    disk_size_tb: float
    usable_tb: float
    efficiency: float
    minimum_disks: int
    max_failures: int

    def as_dict(self) -> dict[str, str | int | float]:
        return asdict(self)


def calculate_raid(level: str, disks: int, disk_size_tb: float) -> RaidResult:
    """Calculate idealized usable capacity for common non-nested RAID levels."""
    normalized = level.lower().replace("raid", "").replace("-", "").strip()
    rules = {
        "0": (2, 0, lambda n: n),
        "1": (2, 1, lambda _n: 1),
        "5": (3, 1, lambda n: n - 1),
        "6": (4, 2, lambda n: n - 2),
        "10": (4, 1, lambda n: n / 2),
    }
    if normalized not in rules:
        raise ValueError("level must be one of RAID 0, 1, 5, 6, or 10")
    if not isinstance(disks, int) or disks <= 0:
        raise ValueError("disks must be a positive integer")
    if disk_size_tb <= 0:
        raise ValueError("disk size must be positive")
    minimum, failures, data_disks = rules[normalized]
    if disks < minimum or (normalized == "10" and disks % 2):
        requirement = f"at least {minimum} disks" + (" and an even disk count" if normalized == "10" else "")
        raise ValueError(f"RAID {normalized} requires {requirement}")
    raw = disks * disk_size_tb
    usable = data_disks(disks) * disk_size_tb
    return RaidResult(f"RAID {normalized}", disks, disk_size_tb, usable, usable / raw, minimum, failures)
