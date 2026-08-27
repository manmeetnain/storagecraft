---
title: Storage Network Academy
description: Practice Brocade-style FC, Cisco MDS-style FC, and iSCSI operations in a safe stateful terminal.
lastUpdated: 2026-08-27
sidebar:
  order: 10
---

Storage Network Academy is a browser-local training environment for new hires, students, and storage operations teams. It simulates stateful command workflows without connecting to real infrastructure.

Academy v2 adds a live Fabric A/B topology, independent Brocade-style and Cisco MDS-style switch terminals, an iSCSI gateway terminal, cross-fabric incidents, atomic multi-device configuration scripts, path-level diffs, named checkpoints and rollback, Observer/Operator/Administrator roles, chained audit evidence, version-labelled compatibility profiles, and a five-domain practical certification with JSON and CSV reports.

Every device mutation remains local to the browser. Vendor names describe educational command styles; the simulator does not claim exact firmware emulation and must not replace the documentation for the installed production release.

## Beginner-first learning journey

The Academy uses progressive disclosure instead of presenting every engineering control at once:

1. **Start with one switch** — choose an environment and complete a guided health inspection.
2. **Configure safely** — build and remove configuration, then learn scripts, diffs, checkpoints, and rollback.
3. **Understand dual fabrics** — trace independent Fabric A/B paths and test degraded operation.
4. **Troubleshoot incidents** — diagnose vendor-specific and cross-fabric failures across multiple terminals.
5. **Prove job readiness** — complete the evidence-based assessment and download the result.

New sessions open at Stage 1 with advanced controls hidden. Experienced users can select any stage or open the full workspace immediately.

<a class="sl-link-button primary" href="/storagecraft/simulators/network-academy/index.html">Launch Storage Network Academy →</a>

## Environments

- **Brocade FOS-style FC:** switch inspection, ports, aliases, zones, defined configurations, activation, and safe deletion.
- **Cisco MDS NX-OS-style FC:** configuration modes, VSANs, interfaces, device aliases, zones, zonesets, activation, and `no` removal forms.
- **Vendor-neutral iSCSI:** VLAN and IP setup, targets, portals, LUN maps, CHAP, discovery, sessions, multipath state, and path failures.

## Learning modes

The browser provides guided labs with the next command, command history using arrow keys, Tab insertion for the current guided step, contextual errors, local state persistence, `undo`, and `reset`. Free practice is always available.

## Troubleshooting and assessment

Each environment includes reproducible incidents with hidden success criteria:

- Brocade-style link-speed/CRC diagnosis and defined-but-inactive zoning;
- Cisco administratively down interfaces and inactive zonesets;
- iSCSI path loss and CHAP authentication failures.

Use `scenario list`, `scenario load <id>`, and `scenario check` in the terminal. Learners choose their own diagnostic path. An unsuccessful check provides a targeted hint; a successful check reports a score based on command count. Reloading a scenario recreates the same starting fault for repeatable practice.

```text
scenario list
scenario load speed-mismatch
porterrshow
portshow 0
portcfgspeed 0 32
scenario check
```

## CLI

```bash
npm run craft -- academy --profile brocade --command "switchshow"
npm run craft -- academy --profile cisco --command "show vsan"
npm run craft -- academy --profile iscsi --command "show targets"
```

Run without `--command` in an interactive terminal to enter the Academy REPL.

## Safety and fidelity

The Academy is an original educational simulator, not vendor firmware. It implements a documented subset of public command semantics and original output. Unsupported commands fail explicitly. Validate commands and procedures against the exact switch, firmware, host OS, and change-control process before using them in production.
