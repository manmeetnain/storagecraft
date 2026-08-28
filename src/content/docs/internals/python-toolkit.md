---
title: Python toolkit
description: Use StorageCraft models from Python, a dependency-free CLI, or your own notebook.
---

StorageCraft now provides a small Python package alongside the browser labs and colored JavaScript CLI. It is designed for readers who want inspectable code, notebook experiments, automation examples, or a familiar contribution path.

## Run without installation

```bash
PYTHONPATH=python python3 -m storagecraft_tools.cli raid --level 6 --disks 8 --size 4
PYTHONPATH=python python3 -m storagecraft_tools.cli learn
```

Add `--json` to either command for machine-readable output.

## Install locally

```bash
python3 -m venv .venv
.venv/bin/python -m pip install -e .
.venv/bin/storagecraft-py raid --level 10 --disks 8 --size 3.84
```

## Use as a library

```python
from storagecraft_tools import calculate_raid

plan = calculate_raid("raid6", disks=8, disk_size_tb=4)
print(plan.usable_tb, plan.efficiency)
```

## Scope

The first Python release covers transparent, idealized RAID 0/1/5/6/10 capacity and curriculum discovery. The browser Universal RAID Planner remains the comprehensive surface for RAID 2/3/4, RAID 01/10/50/60, RAID-Z1/Z2/Z3, comparison, constraints, and visual explanation.

## Contribute

Keep the Python layer dependency-free, typed, deterministic, and tested. New models should expose a library function, structured result, CLI representation, invalid-input tests, and documentation of assumptions.

## Next step

Run the [Universal RAID Planner](/storagecraft/simulators/raid-planner/) beside the Python command and compare the same configuration.
