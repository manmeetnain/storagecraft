export const ACADEMY_CURRICULA = Object.freeze({
  brocade: [
    { title: 'Complete fabric health check', goal: 'Run the full new-hire baseline across software, chassis, environment, fabric, ports, optics, zoning, and events.', commands: ['version','firmwareshow','uptime','licenseshow','chassisshow','fanshow','psshow','tempshow','sensorshow','switchstatusshow','switchstatuspolicyshow','switchshow','fabricshow','islshow','trunkshow','topologyshow','portcfgshow','portshow 0','sfpshow 0','porterrshow','nsshow','cfgshow','errshow','mapsdb --show'] },
    { title: 'Build single-initiator zoning', goal: 'Create aliases, a zone, a configuration, and activate it.', commands: ['alicreate host1, 10:00:00:00:00:00:00:01','alicreate array1, 50:00:00:00:00:00:00:01','zonecreate z_host1_array1, host1; array1','cfgcreate cfg_prod, z_host1_array1','cfgenable cfg_prod','cfgshow'] },
    { title: 'Safe removal', goal: 'Disable and remove objects in dependency order.', commands: ['cfgdisable','cfgdelete cfg_prod','zonedelete z_host1_array1','alidelete host1','alidelete array1'] },
  ],
  cisco: [
    { title: 'Complete MDS health check', goal: 'Baseline time, software, hardware, environment, resources, FC interfaces, registrations, zoning, and logs.', commands: ['show clock','show version','show module','show environment','show system resources','show ntp peers','show vsan','show interface brief','show interface fc1/1','show interface counters errors','show flogi database','show fcns database','show device-alias database','show zoneset active','show logging last 20'] },
    { title: 'Create a VSAN', goal: 'Enter configuration mode and create VSAN 20.', commands: ['configure terminal','vsan 20','show vsan'] },
    { title: 'Build a zoneset', goal: 'Create a device alias, zone, zoneset, and activate it.', commands: ['configure terminal','device-alias database','device-alias name host1 pwwn 10:00:00:00:00:00:00:01','device-alias commit','exit','zone name z1 vsan 20','member device-alias host1','exit','zoneset name zs1 vsan 20','member z1','exit','zoneset activate name zs1 vsan 20','show zoneset active'] },
    { title: 'Operate an FC port', goal: 'Assign a port to VSAN 20 and test shutdown recovery.', commands: ['configure terminal','interface fc1/1','switchport vsan 20','shutdown','no shutdown','end','show interface brief'] },
    { title: 'Verify logins and save', goal: 'Inspect FLOGI and FCNS registrations, review events, and save the running configuration.', commands: ['show flogi database','show fcns database','show logging','copy running-config startup-config','show startup-config'] },
  ],
  iscsi: [
    { title: 'Complete iSCSI health check', goal: 'Baseline interfaces, routes, portals, targets, sessions, and multipath state.', commands: ['show health','show network','show routes','show portals','show targets','sessions','multipath show'] },
    { title: 'Build the IP path', goal: 'Create an isolated storage VLAN and interface.', commands: ['vlan create 110 storage','interface set eth1 198.51.100.10/24 vlan 110','show network'] },
    { title: 'Publish and connect a LUN', goal: 'Create a target, portal, LUN mapping, discovery, and session.', commands: ['target create iqn.2026-08.lab:target1','portal add iqn.2026-08.lab:target1 198.51.100.20:3260','lun map iqn.2026-08.lab:target1 0 /dev/simdisk0','discover','login iqn.2026-08.lab:target1','sessions'] },
    { title: 'Test path recovery', goal: 'Fail and restore a portal while inspecting multipath state.', commands: ['path fail 198.51.100.20:3260','multipath show','path restore 198.51.100.20:3260','multipath show'] },
    { title: 'Secure and protect sessions', goal: 'Create a CHAP-protected target, authenticate, and select a multipath policy.', commands: ['target create iqn.2026-08.lab:secure','portal add iqn.2026-08.lab:secure 192.0.2.30:3260','chap set iqn.2026-08.lab:secure learner strongsecret','discover','login iqn.2026-08.lab:secure learner strongsecret','multipath policy failover','multipath show'] },
  ],
});

export function curriculumCommandCount() {
  return Object.values(ACADEMY_CURRICULA).flat().reduce((total, lab) => total + lab.commands.length, 0);
}
