---
title: Academy command reference
description: Supported Brocade-style FC, Cisco MDS-style FC, iSCSI, safety, and scenario commands.
lastUpdated: 2026-08-27
sidebar:
  order: 11
---

This matrix is the authoritative compatibility surface for Storage Network Academy. Commands not listed here must fail explicitly rather than silently changing simulated state.

## Simulator controls

| Command | Effect |
|---|---|
| `help` | Show the current profile's supported command families |
| `show state` | Inspect the complete simulated state |
| `undo` | Restore state before the most recent successful change |
| `reset` | Restore the selected profile's baseline |
| `save` | Mark the current simulated state as saved |
| `scenario list` | List incidents available for the current profile |
| `scenario load <id>` | Load a deterministic fault fixture |
| `scenario check` | Evaluate hidden recovery criteria and return a score |
| `academy report` | Show completion, best scores, command counts, and profile average |
| `academy export` | Emit the current profile report as machine-readable JSON |

## Brocade FOS-style profile

| Area | Supported syntax |
|---|---|
| Software and identity | `version`, `firmwareshow`, `uptime`, `licenseshow`, `switchshow` |
| Chassis/environment | `chassisshow`, `fanshow`, `psshow`, `tempshow`, `sensorshow` |
| Health policy | `switchstatusshow`, `switchstatuspolicyshow`, `mapsdb --show` |
| Fabric topology | `fabricshow`, `islshow`, `trunkshow`, `topologyshow`, `nsshow`, `nodefind <alias\|wwn>` |
| Port/optics diagnostics | `portcfgshow`, `portshow <port>`, `sfpshow <port>`, `porterrshow`, `portstatsclear <port>` |
| Event history | `errshow`, `errdump` |
| Identity | `switchname <name>`, `configure domain-id <1-239>` |
| Management | `ipaddrset <ip> <mask> <gateway>` |
| Ports | `portenable <port>`, `portdisable <port>`, `portcfgspeed <port> <auto\|4\|8\|16\|32\|64>` |
| Aliases | `alicreate`, `aliadd`, `aliremove`, `alidelete`, `alishow` |
| Zones | `zonecreate`, `zoneadd`, `zoneremove`, `zonedelete`, `zoneshow` |
| Configurations | `cfgcreate`, `cfgadd`, `cfgremove`, `cfgdelete`, `cfgenable`, `cfgdisable`, `cfgsave`, `cfgshow` |

Brocade-style create/add/remove commands use `object, member; member` syntax. Alias members must be valid pWWNs. Zones accept defined aliases or pWWNs. Configurations accept defined zones. Referenced and effective objects cannot be deleted.

## Cisco MDS NX-OS-style profile

| Mode/area | Supported syntax |
|---|---|
| System health | `show clock`, `show version`, `show module`, `show environment`, `show system resources`, `show ntp peers` |
| Fabric health | `show vsan`, `show interface brief`, `show interface fc1/1`, `show interface counters errors`, `show flogi database`, `show fcns database` |
| Event history | `show logging`, `show logging last 20` |
| Configuration inspection | `show running-config`, `show startup-config`, `show device-alias database`, `show zone`, `show zoneset`, `show zoneset active` |
| Mode navigation | `configure terminal`, `conf t`, `exit`, `end` |
| Global config | `hostname <name>`, `vsan <id> [name <name>]`, `no vsan <id>` |
| Interface config | `interface fc1/1`, `shutdown`, `no shutdown`, `switchport speed <value>`, `switchport vsan <id>`, `switchport mode <F\|E\|NP>` |
| Device aliases | `device-alias database`, `device-alias name <name> pwwn <wwn>`, `no device-alias name <name>`, `device-alias commit` |
| Zones | `zone name <name> vsan <id>`, `member device-alias <name>`, `member pwwn <wwn>`, corresponding `no member`, `no zone name <name> vsan <id>` |
| Zonesets | `zoneset name <name> vsan <id>`, `member <zone>`, `no member <zone>`, `zoneset activate name <name> vsan <id>`, corresponding `no` forms |
| Persistence | `copy running-config startup-config` |

Configuration commands are mode-sensitive. VSAN and zoning objects cannot be removed while referenced. Only one modeled zoneset is active per VSAN.

## Vendor-neutral iSCSI profile

| Area | Supported syntax |
|---|---|
| Inspection | `show health`, `show network`, `show routes`, `show portals`, `show targets`, `sessions`, `multipath show` |
| VLANs and interfaces | `vlan create\|delete <id> [name]`, `interface set <name> <cidr> [vlan <id>]`, `interface delete <name>`, `interface up\|down <name>` |
| Targets and portals | `target create\|delete <iqn>`, `portal add\|delete <iqn> <address:port>` |
| LUNs | `lun map <iqn> <lun> <backing-store>`, `lun unmap <iqn> <lun>` |
| Authentication | `chap set <iqn> <user> <secret>`, `chap clear <iqn>` |
| Initiator | `discover`, `login <iqn> [user secret]`, `logout <iqn>` |
| Multipath/failures | `multipath policy <round-robin\|failover>`, `path fail <address:port>`, `path restore <address:port>` |

Targets with active sessions cannot be deleted. CHAP-enabled targets reject missing or incorrect credentials. Multipath output reflects injected path failures.

## Fidelity boundary

This is an educational subset with original output, not firmware emulation. Command availability, defaults, privileges, transactional behavior, and output vary by exact release and platform. Consult the relevant vendor and operating-system documentation before executing any production change.
