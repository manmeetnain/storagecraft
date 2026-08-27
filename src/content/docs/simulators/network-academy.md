---
title: Storage Network Academy
description: Practice Brocade-style FC, Cisco MDS-style FC, and iSCSI operations in a safe stateful terminal.
lastUpdated: 2026-08-27
sidebar:
  order: 10
---

Storage Network Academy is a browser-local training environment for new hires, students, and storage operations teams. It simulates stateful command workflows without connecting to real infrastructure.

<a class="sl-link-button primary" href="/storagecraft/simulators/network-academy/index.html">Launch Storage Network Academy →</a>

## Environments

- **Brocade FOS-style FC:** switch inspection, ports, aliases, zones, defined configurations, activation, and safe deletion.
- **Cisco MDS NX-OS-style FC:** configuration modes, VSANs, interfaces, device aliases, zones, zonesets, activation, and `no` removal forms.
- **Vendor-neutral iSCSI:** VLAN and IP setup, targets, portals, LUN maps, CHAP, discovery, sessions, multipath state, and path failures.

## Learning modes

The browser provides guided labs with the next command, command history using arrow keys, Tab insertion for the current guided step, contextual errors, local state persistence, `undo`, and `reset`. Free practice is always available.

## CLI

```bash
npm run craft -- academy --profile brocade --command "switchshow"
npm run craft -- academy --profile cisco --command "show vsan"
npm run craft -- academy --profile iscsi --command "show targets"
```

Run without `--command` in an interactive terminal to enter the Academy REPL.

## Safety and fidelity

The Academy is an original educational simulator, not vendor firmware. It implements a documented subset of public command semantics and original output. Unsupported commands fail explicitly. Validate commands and procedures against the exact switch, firmware, host OS, and change-control process before using them in production.
