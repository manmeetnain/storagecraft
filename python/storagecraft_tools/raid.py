"""Transparent capacity calculations for every RAID family in StorageCraft."""

from __future__ import annotations

from dataclasses import asdict, dataclass
from typing import Callable


@dataclass(frozen=True)
class RaidResult:
    level: str
    family: str
    disks: int
    disk_size_tb: float
    usable_tb: float
    raw_tb: float
    overhead_tb: float
    efficiency: float
    minimum_disks: int
    guaranteed_failures: int
    maximum_failures: int
    groups: int = 1

    @property
    def max_failures(self) -> int:
        """Backward-compatible alias used by the first Python CLI release."""
        return self.maximum_failures

    def as_dict(self) -> dict:
        return asdict(self)


SPECS = {
    "jbod": ("JBOD", "Concatenation", 1), "0": ("RAID 0", "Striping", 2),
    "1": ("RAID 1", "Mirroring", 2), "2": ("RAID 2", "Hamming code", 3),
    "3": ("RAID 3", "Dedicated parity", 3), "4": ("RAID 4", "Dedicated parity", 3),
    "5": ("RAID 5", "Distributed parity", 3), "6": ("RAID 6", "Distributed parity", 4),
    "01": ("RAID 0+1", "Nested RAID", 4), "10": ("RAID 10", "Nested RAID", 4),
    "50": ("RAID 50", "Nested RAID", 6), "60": ("RAID 60", "Nested RAID", 8),
    "z1": ("RAID-Z1", "ZFS RAID-Z", 3), "z2": ("RAID-Z2", "ZFS RAID-Z", 4),
    "z3": ("RAID-Z3", "ZFS RAID-Z", 5),
}


def normalize_level(level: str) -> str:
    value = str(level).lower().replace("raid", "").replace("-", "").replace("1+0", "10").replace("0+1", "01").replace("5+0", "50").replace("6+0", "60").replace("zfs", "").strip()
    if value.startswith("z") and value not in SPECS:
        value = value.replace("z", "z", 1)
    if value not in SPECS:
        raise ValueError(f"unsupported RAID level: {level}; choose one of {', '.join(SPECS)}")
    return value


def _hamming(total: int) -> tuple[int, int]:
    for parity in range(2, total):
        data = total - parity
        if 2**parity >= data + parity + 1:
            return data, parity
    raise ValueError("RAID 2 requires enough disks for data and Hamming code")


def calculate_raid(level: str, disks: int, disk_size_tb: float, groups: int = 2) -> RaidResult:
    key = normalize_level(level)
    name, family, minimum = SPECS[key]
    if not isinstance(disks, int) or disks < minimum:
        raise ValueError(f"{name} requires at least {minimum} disks")
    if disk_size_tb <= 0:
        raise ValueError("disk size must be positive")
    data, parity, guaranteed, maximum, group_count = disks, 0, 0, 0, 1
    if key == "1": data, guaranteed, maximum = 1, disks - 1, disks - 1
    elif key == "2": data, parity = _hamming(disks); guaranteed = maximum = 1
    elif key in {"3", "4", "5", "z1"}: data, parity, guaranteed, maximum = disks - 1, 1, 1, 1
    elif key in {"6", "z2"}: data, parity, guaranteed, maximum = disks - 2, 2, 2, 2
    elif key == "z3": data, parity, guaranteed, maximum = disks - 3, 3, 3, 3
    elif key in {"01", "10"}:
        if disks % 2:
            raise ValueError(f"{name} requires an even disk count")
        data, guaranteed, maximum = disks // 2, 1, disks // 2
    elif key in {"50", "60"}:
        if not isinstance(groups, int) or groups <= 0 or disks % groups:
            raise ValueError(f"{name} requires a positive group count that divides the disks")
        per_group, parity_each = disks // groups, 1 if key == "50" else 2
        required = 3 if key == "50" else 4
        if per_group < required:
            raise ValueError(f"{name} requires groups of at least {required} disks")
        group_count, parity = groups, groups * parity_each
        data, guaranteed, maximum = disks - parity, parity_each, parity
    raw, usable = disks * disk_size_tb, data * disk_size_tb
    return RaidResult(name, family, disks, disk_size_tb, usable, raw, raw - usable, usable / raw, minimum, guaranteed, maximum, group_count)


def compare_raids(disks: int, disk_size_tb: float, groups: int = 2) -> list[dict]:
    results = []
    for level in SPECS:
        try:
            results.append(calculate_raid(level, disks, disk_size_tb, groups).as_dict())
        except ValueError as error:
            results.append({"level": SPECS[level][0], "error": str(error)})
    return results
