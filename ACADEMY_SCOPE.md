# Storage Network Academy scope

Storage Network Academy is a safe educational simulator. It never connects to, discovers, or changes a real switch, array, host, or network.

## Release contract

Each vendor profile must provide:

1. A documented command-compatibility matrix
2. Stateful create, inspect, change, activate, deactivate, and delete workflows
3. Context-sensitive help and realistic validation errors
4. Guided foundation, operations, zoning, troubleshooting, and assessment labs
5. A free-practice terminal with history, reset, undo, and local persistence
6. Unit tests for state transitions and destructive-command safeguards
7. Browser accessibility and responsive-layout validation
8. Colored local CLI access and successful GitHub quality/deployment workflows

## Compatibility boundary

- **Brocade profile:** Fabric OS-inspired educational subset for switch identity, ports, aliases, zones, and effective configurations.
- **Cisco profile:** MDS NX-OS-inspired educational subset for VSANs, interfaces, device aliases, zones, and zonesets.
- **iSCSI profile:** Vendor-neutral lab grammar for network portals, targets, LUN mappings, CHAP, discovery, sessions, and multipathing.

Command names modeled after vendor CLIs are implemented from public documentation. Output is original educational output, not copied firmware output. Unsupported commands return help rather than pretending to succeed.

## Delivered components

| Component | State | Command domains |
|---|---|---|
| Academy Core | Shipped | Parser, state, terminal, history, help, undo, reset, persistence |
| Brocade FC Lab | Shipped | Switch setup, ports, aliases, zones, configs, diagnostics, failures |
| Cisco MDS Lab | Shipped | Modes, VSANs, interfaces, FLOGI/FCNS, device aliases, zonesets, logs |
| iSCSI Lab | Shipped | VLAN/IP, target/portal/LUN, CHAP, discovery, sessions, multipath |
| Guided Curriculum | Shipped | Twelve guided labs, hints, six incidents, scoring, reports, export |

## Scenario contract

Scenarios are deterministic state fixtures. A scenario must provide a learner-facing incident brief, hidden machine-checkable success criteria, a diagnostic hint revealed only after an unsuccessful check, and a command-efficiency score. Reloading the same scenario must restore the same fault state.

## Primary references

- [Cisco MDS 9000 NX-OS Fabric Configuration Guide, Release 9.x](https://www.cisco.com/c/en/us/td/docs/dcn/mds9000/sw/9x/configuration/fabric/cisco-mds-9000-nx-os-fabric-configuration-guide-9x.html)
- [Cisco MDS 9000 NX-OS Command Reference, Release 9.x](https://www.cisco.com/c/en/us/td/docs/dcn/mds9000/sw/9x/command/cisco-mds-9000-nx-os-command-reference-guide-9x.html)
- Broadcom Fabric OS product documentation should be consulted for the target FOS release before using knowledge outside this educational subset.
- Host and distribution documentation should be consulted for the target open-iscsi, LIO, device-mapper multipath, and network stack versions.
