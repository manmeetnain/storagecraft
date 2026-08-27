export const ACADEMY_PROFILES={
  brocade:{name:'Brocade FOS-style FC',prompt:'FC-SW-A:admin>',description:'Fabric OS-inspired switch, port, alias, zone, and effective-configuration practice.'},
  cisco:{name:'Cisco MDS NX-OS-style FC',prompt:'MDS-A#',description:'NX-OS-inspired VSAN, interface, device-alias, zone, and zoneset practice.'},
  iscsi:{name:'Vendor-neutral iSCSI',prompt:'iscsi-lab>',description:'Portal, target, LUN, CHAP, discovery, session, and path practice.'}
};

const clone=value=>JSON.parse(JSON.stringify(value));
const wwn=/^(?:[0-9a-f]{2}:){7}[0-9a-f]{2}$/i;
const name=/^[A-Za-z][A-Za-z0-9_.-]{0,63}$/;
const ok=(output,changed=false)=>({ok:true,output,changed});
const bad=output=>({ok:false,output,changed:false});
const need=(value,label,pattern=name)=>{if(!value)throw new Error(`${label} is required`);if(pattern&&!pattern.test(value))throw new Error(`invalid ${label}: ${value}`);return value};
const csv=text=>text.split(/[;,]/).map(x=>x.trim()).filter(Boolean);
const values=object=>Object.entries(object).map(([key,value])=>`${key}: ${Array.isArray(value)?value.join('; '):value}`).join('\n')||'  -- none --';

function initialState(profile){
  if(profile==='brocade')return{hostname:'FC-SW-A',domainId:1,management:{ip:'10.10.10.11',mask:'255.255.255.0',gateway:'10.10.10.1'},ports:Array.from({length:8},(_,i)=>({id:i,enabled:true,speed:'auto',state:i<2?'Online':'No_Light',expectedSpeed:null,crc:0,encOut:0})),aliases:{},zones:{},configs:{},effectiveConfig:null,saved:false};
  if(profile==='cisco')return{hostname:'MDS-A',mode:'exec',context:null,vsans:{1:{name:'default'}},interfaces:Object.fromEntries(Array.from({length:8},(_,i)=>[`fc1/${i+1}`,{enabled:true,speed:'auto',vsan:1,state:i<2?'up':'down'}])),deviceAliases:{},zones:{},zonesets:{},activeZonesets:{},saved:false};
  return{hostname:'iscsi-lab',vlans:{},interfaces:{eth0:{ip:'192.0.2.10/24',vlan:null,up:true}},targets:{},initiators:{host1:{iqn:'iqn.2026-08.lab:host1',discoveries:[],sessions:[]}},failedPaths:[],saved:false};
}

export const ACADEMY_SCENARIOS={
  brocade:[
    {id:'speed-mismatch',title:'CRC storm after host upgrade',brief:'A host was upgraded and port 0 now records encoding and CRC errors. Diagnose the negotiated link and restore the intended speed.',hint:'Start with porterrshow and portshow 0. The design record expects 32G.',inject:s=>{s.ports[0].speed='16';s.ports[0].expectedSpeed='32';s.ports[0].crc=129;s.ports[0].encOut=47},check:s=>s.ports[0].speed==='32'&&s.ports[0].crc===0&&s.ports[0].encOut===0},
    {id:'inactive-zoning',title:'Defined zone is not effective',brief:'The host and array aliases exist and the zone is defined, but the host cannot see storage.',hint:'Compare defined and effective configuration with cfgshow.',inject:s=>{s.aliases={host1:['10:00:00:00:00:00:00:01'],array1:['50:00:00:00:00:00:00:01']};s.zones={z_host1_array1:['host1','array1']};s.configs={cfg_prod:['z_host1_array1']};s.effectiveConfig=null},check:s=>s.effectiveConfig==='cfg_prod'}
  ],
  cisco:[
    {id:'interface-shutdown',title:'FC host path administratively down',brief:'The host path on fc1/1 is down after a maintenance window. Restore it without changing VSAN membership.',hint:'Inspect show interface brief, enter the interface, and use the NX-OS negation form.',inject:s=>{s.interfaces['fc1/1'].enabled=false;s.interfaces['fc1/1'].state='down'},check:s=>s.interfaces['fc1/1'].enabled===true},
    {id:'inactive-zoneset',title:'Zoneset built but not activated',brief:'VSAN 20 contains a valid zone and zoneset, but no active zoneset is enforcing it.',hint:'Inspect show zoneset and show zoneset active.',inject:s=>{s.vsans[20]={name:'production'};s.deviceAliases={host1:'10:00:00:00:00:00:00:01'};s.zones={'20:z1':{name:'z1',vsan:20,members:['host1']}};s.zonesets={'20:zs_prod':{name:'zs_prod',vsan:20,members:['z1']}};s.activeZonesets={}},check:s=>s.activeZonesets[20]==='zs_prod'}
  ],
  iscsi:[
    {id:'path-loss',title:'One iSCSI path failed',brief:'A connected target has two portals; one path is failed and redundancy must be restored.',hint:'Use multipath show, then restore the failed portal.',inject:s=>{const iqn='iqn.2026-08.lab:target1';s.targets[iqn]={portals:['198.51.100.20:3260','198.51.100.21:3260'],luns:{0:'/dev/simdisk0'},chap:null};s.initiators.host1.sessions=[{iqn,portals:[...s.targets[iqn].portals]}];s.failedPaths=['198.51.100.21:3260']},check:s=>s.failedPaths.length===0},
    {id:'chap-failure',title:'CHAP login rejected',brief:'Discovery succeeds, but the target requires the approved learner credentials before a session can form.',hint:'Inspect show targets. Login with learner and the training secret strongsecret.',inject:s=>{const iqn='iqn.2026-08.lab:secure';s.targets[iqn]={portals:['192.0.2.20:3260'],luns:{0:'/dev/secure0'},chap:{user:'learner',secret:'strongsecret'}};s.initiators.host1.discoveries=[iqn]},check:s=>s.initiators.host1.sessions.some(x=>x.iqn==='iqn.2026-08.lab:secure')}
  ]
};

export function loadAcademyScenario(session,id){
  const scenario=ACADEMY_SCENARIOS[session.profile]?.find(item=>item.id===id);if(!scenario)throw new Error(`Unknown ${session.profile} scenario: ${id}`);session.undoStack.push(clone(session.state));session.state=initialState(session.profile);scenario.inject(session.state);session.scenario={id,commands:0,checks:0,complete:false,bestScore:null};return{title:scenario.title,brief:scenario.brief};
}

export function evaluateAcademyScenario(session){
  if(!session.scenario)return{active:false,passed:false,score:0,output:'No scenario is active. Use scenario list and scenario load <id>.'};const scenario=ACADEMY_SCENARIOS[session.profile].find(item=>item.id===session.scenario.id),passed=scenario.check(session.state);session.scenario.checks++;session.scenario.complete=passed;const score=passed?Math.max(60,100-Math.max(0,session.scenario.commands-2)*5):0;if(passed&&(session.scenario.bestScore===null||score>session.scenario.bestScore))session.scenario.bestScore=score;return{active:true,passed,score,title:scenario.title,hint:scenario.hint,commands:session.scenario.commands,output:passed?`PASS · ${scenario.title}\nScore: ${score}/100 · Commands: ${session.scenario.commands}`:`NOT YET RESOLVED · ${scenario.title}\nHint: ${scenario.hint}`};
}

export function createAcademySession(profile='brocade'){
  if(!ACADEMY_PROFILES[profile])throw new Error(`profile must be one of: ${Object.keys(ACADEMY_PROFILES).join(', ')}`);
  return{profile,state:initialState(profile),undoStack:[],commandHistory:[]};
}

export function academyPrompt(session){
  if(session.profile==='cisco'){
    const s=session.state;if(s.mode==='config')return`${s.hostname}(config)#`;if(s.mode==='interface')return`${s.hostname}(config-if)#`;if(s.mode==='zone')return`${s.hostname}(config-zone)#`;if(s.mode==='zoneset')return`${s.hostname}(config-zoneset)#`;if(s.mode==='device-alias')return`${s.hostname}(config-device-alias-db)#`;return`${s.hostname}#`;
  }
  return session.profile==='brocade'?`${session.state.hostname}:admin>`:`${session.state.hostname}>`;
}

function help(profile){
  const common='help | help <command> | show state | undo | reset | save | clear';
  if(profile==='brocade')return`${common}\nshow: switchshow, fabricshow, portshow <port>, porterrshow, nsshow, alishow, zoneshow, cfgshow\nsetup: switchname <name>, configure domain-id <1-239>, ipaddrset <ip> <mask> <gateway>\nports: portenable|portdisable <port>, portcfgspeed <port> <auto|4|8|16|32|64>, portstatsclear <port>\nzoning: alicreate|aliadd|aliremove|alidelete; zonecreate|zoneadd|zoneremove|zonedelete; cfgcreate|cfgadd|cfgremove|cfgdelete|cfgenable|cfgdisable|cfgsave\nincidents: scenario list | scenario load <id> | scenario check`;
  if(profile==='cisco')return`${common}\nshow: show version|vsan|interface brief|device-alias database|zone|zoneset [active]\nmode: configure terminal, exit, end\nconfig: hostname, vsan <id>, interface fc1/1, device-alias database, zone name <name> vsan <id>, zoneset name <name> vsan <id>\nremove: use the no form; activate: zoneset activate name <name> vsan <id>`;
  return`${common}\nnetwork: vlan create|delete, interface set|up|down\nstorage: target create|delete, portal add|delete, lun map|unmap, chap set|clear\nhost: discover, login, logout, sessions, multipath show, path fail|restore`;
}

function brocade(session,line){
  const s=session.state,t=line.trim().split(/\s+/),cmd=t[0].toLowerCase(),rest=line.slice(t[0].length).trim();
  if(cmd==='switchshow')return ok(`switchName: ${s.hostname}\nswitchDomain: ${s.domainId}\nswitchState: Online\n${s.ports.map(p=>`${String(p.id).padStart(2)} ${p.enabled?'Online':'Disabled'} ${p.speed}G ${p.state}`).join('\n')}`);
  if(cmd==='fabricshow')return ok(`Fabric ID 128\nDomain ${s.domainId}  ${s.hostname}  Principal`);
  if(cmd==='portshow'){const p=s.ports[Number(t[1])];return p?ok(`port ${p.id}\nstate: ${p.enabled?p.state:'Disabled'}\nspeed: ${p.speed}\nstatus: ${p.enabled?'enabled':'disabled'}`):bad(`Invalid port. Range: 0-${s.ports.length-1}`)}
  if(cmd==='porterrshow')return ok(`port  crc_err  enc_out  link_fail\n${s.ports.map(p=>`${String(p.id).padStart(4)} ${String(p.crc).padStart(8)} ${String(p.encOut).padStart(8)} ${String(p.enabled?0:1).padStart(10)}`).join('\n')}`);
  if(cmd==='nsshow')return ok(`Name Server entries\n${Object.entries(s.aliases).flatMap(([alias,members])=>members.map(member=>`${member}  ${alias}`)).join('\n')||'  -- none --'}`);
  if(cmd==='alishow')return ok(values(s.aliases));if(cmd==='zoneshow')return ok(values(s.zones));
  if(cmd==='cfgshow')return ok(`Defined configurations:\n${values(s.configs)}\nEffective configuration: ${s.effectiveConfig||'none'}`);
  if(cmd==='switchname'){s.hostname=need(t[1],'switch name');return ok(`Committing configuration...\nSwitch name changed to ${s.hostname}`,true)}
  if(cmd==='configure'&&t[1]?.toLowerCase()==='domain-id'){const id=Number(t[2]);if(!Number.isInteger(id)||id<1||id>239)return bad('Domain ID must be an integer from 1 to 239');s.domainId=id;return ok(`Domain ID set to ${id}`,true)}
  if(cmd==='ipaddrset'){if(t.length<4)return bad('Usage: ipaddrset <ip> <mask> <gateway>');s.management={ip:t[1],mask:t[2],gateway:t[3]};return ok(`Management IP set to ${t[1]}`,true)}
  if(['portenable','portdisable','portcfgspeed','portstatsclear'].includes(cmd)){const p=s.ports[Number(t[1])];if(!p)return bad(`Invalid port. Range: 0-${s.ports.length-1}`);if(cmd==='portcfgspeed'){if(!['auto','4','8','16','32','64'].includes(String(t[2])))return bad('Speed must be auto, 4, 8, 16, 32, or 64');p.speed=t[2];if(!p.expectedSpeed||p.speed===p.expectedSpeed){p.crc=0;p.encOut=0}}else if(cmd==='portstatsclear'){p.crc=0;p.encOut=0}else{p.enabled=cmd==='portenable';p.state=p.enabled?(p.id<2?'Online':'No_Light'):'Disabled'}return ok(`port ${p.id}: ${cmd==='portcfgspeed'?`speed ${p.speed}`:cmd==='portstatsclear'?'statistics cleared':p.enabled?'enabled':'disabled'}`,true)}
  const zoning=/^(alicreate|aliadd|aliremove|zonecreate|zoneadd|zoneremove|cfgcreate|cfgadd|cfgremove)\s+([^,\s]+)\s*,\s*(.+)$/i.exec(line);
  if(zoning){const action=zoning[1].toLowerCase(),key=need(zoning[2],'name'),members=csv(zoning[3]);const type=action.startsWith('ali')?'aliases':action.startsWith('zone')?'zones':'configs',map=s[type],create=action.endsWith('create'),add=action.endsWith('add');if(create&&map[key])return bad(`${key} already exists`);if(!create&&!map[key])return bad(`${key} does not exist`);if(type==='aliases'&&members.some(m=>!wwn.test(m)))return bad('Alias members must be colon-separated 16-hex-digit WWNs');if(type==='zones'&&members.some(m=>!s.aliases[m]&&!wwn.test(m)))return bad('Zone members must be existing aliases or WWNs');if(type==='configs'&&members.some(m=>!s.zones[m]))return bad('Configuration members must be existing zones');if(create)map[key]=[...new Set(members)];else if(add)map[key]=[...new Set([...map[key],...members])];else map[key]=map[key].filter(x=>!members.includes(x));return ok(`${key}: ${map[key].join('; ')||'empty'}`,true)}
  const deletion=/^(alidelete|zonedelete|cfgdelete)\s+(.+)$/i.exec(line);if(deletion){const type=deletion[1].toLowerCase().startsWith('ali')?'aliases':deletion[1].toLowerCase().startsWith('zone')?'zones':'configs',key=deletion[2].trim();if(!s[type][key])return bad(`${key} does not exist`);if(type==='aliases'&&Object.values(s.zones).some(m=>m.includes(key)))return bad(`Cannot delete ${key}: referenced by a zone`);if(type==='zones'&&Object.values(s.configs).some(m=>m.includes(key)))return bad(`Cannot delete ${key}: referenced by a configuration`);if(type==='configs'&&s.effectiveConfig===key)return bad(`Cannot delete ${key}: configuration is effective`);delete s[type][key];return ok(`${key} deleted`,true)}
  if(cmd==='cfgenable'){const key=t[1];if(!s.configs[key])return bad(`${key} does not exist`);if(!s.configs[key].length)return bad(`${key} has no zones`);s.effectiveConfig=key;return ok(`Effective configuration is now ${key}`,true)}
  if(cmd==='cfgdisable'){s.effectiveConfig=null;return ok('Effective configuration disabled',true)}
  if(cmd==='cfgsave'){s.saved=true;return ok('Defined zoning configuration saved',true)}
  return bad(`Invalid command: ${line}\nType help for the supported educational command set.`);
}

function cisco(session,line){
  const s=session.state,t=line.trim().split(/\s+/),lower=line.toLowerCase(),cmd=t[0]?.toLowerCase();
  if(lower==='configure terminal'||lower==='conf t'){s.mode='config';s.context=null;return ok('Enter configuration commands, one per line.',true)}
  if(cmd==='end'){s.mode='exec';s.context=null;return ok('',true)}if(cmd==='exit'){s.mode=s.mode==='exec'?'exec':'config';s.context=null;return ok('',true)}
  if(lower==='show version')return ok(`StorageCraft MDS educational simulator\nHostname: ${s.hostname}\nProfile: NX-OS 9.x-inspired subset`);
  if(lower==='show vsan')return ok(Object.entries(s.vsans).map(([id,v])=>`vsan ${id} name ${v.name}`).join('\n'));
  if(lower==='show interface brief')return ok(Object.entries(s.interfaces).map(([id,v])=>`${id.padEnd(8)} ${v.enabled?'up':'down'} speed ${v.speed} vsan ${v.vsan}`).join('\n'));
  if(lower==='show device-alias database')return ok(values(s.deviceAliases));if(lower==='show zone')return ok(values(s.zones));
  if(lower==='show zoneset'||lower==='show zoneset active')return ok(lower.endsWith('active')?values(s.activeZonesets):values(s.zonesets));
  if(lower==='show running-config'||lower==='show state')return ok(JSON.stringify(s,null,2));
  if(lower==='copy running-config startup-config'){s.saved=true;return ok('Copy complete.',true)}
  if(s.mode==='exec')return bad("Invalid command in EXEC mode. Use 'configure terminal' for changes.");
  if(s.mode==='config'&&cmd==='hostname'){s.hostname=need(t[1],'hostname');return ok('',true)}
  if(s.mode==='config'&&cmd==='vsan'){const id=Number(t[1]);if(!Number.isInteger(id)||id<1||id>4093)return bad('VSAN must be 1-4093');s.vsans[id]=s.vsans[id]||{name:`vsan${id}`};return ok('',true)}
  if(s.mode==='config'&&lower.startsWith('no vsan ')){const id=Number(t[2]);if(id===1)return bad('VSAN 1 cannot be removed');delete s.vsans[id];return ok('',true)}
  if(s.mode==='config'&&cmd==='interface'){const id=t[1]?.toLowerCase();if(!s.interfaces[id])return bad(`Unknown interface ${id}`);s.mode='interface';s.context=id;return ok('',true)}
  if(s.mode==='interface'){const i=s.interfaces[s.context];if(lower==='shutdown'){i.enabled=false;i.state='down';return ok('',true)}if(lower==='no shutdown'){i.enabled=true;i.state=s.context==='fc1/1'||s.context==='fc1/2'?'up':'down';return ok('',true)}if(lower.startsWith('switchport speed ')){i.speed=t[2];return ok('',true)}if(lower.startsWith('switchport vsan ')){const id=Number(t[2]);if(!s.vsans[id])return bad(`VSAN ${id} does not exist`);i.vsan=id;return ok('',true)}}
  if(s.mode==='config'&&lower==='device-alias database'){s.mode='device-alias';return ok('',true)}
  if(s.mode==='device-alias'){const match=/^(no )?device-alias name (\S+)(?: pwwn (\S+))?$/i.exec(line);if(match){const remove=!!match[1],alias=need(match[2],'device alias');if(remove){if(!s.deviceAliases[alias])return bad(`${alias} does not exist`);if(Object.values(s.zones).some(z=>z.members.includes(alias)))return bad(`${alias} is referenced by a zone`);delete s.deviceAliases[alias]}else{if(!wwn.test(match[3]||''))return bad('A valid pWWN is required');s.deviceAliases[alias]=match[3]}return ok('',true)}if(lower==='device-alias commit')return ok('Device alias database committed.',true)}
  const zone=/^zone name (\S+) vsan (\d+)$/i.exec(line);if(s.mode==='config'&&zone){if(!s.vsans[zone[2]])return bad(`VSAN ${zone[2]} does not exist`);const key=`${zone[2]}:${zone[1]}`;s.zones[key]=s.zones[key]||{name:zone[1],vsan:Number(zone[2]),members:[]};s.mode='zone';s.context=key;return ok('',true)}
  if(s.mode==='zone'){const z=s.zones[s.context],member=/^member (?:device-alias|pwwn) (\S+)$/i.exec(line),remove=/^no member (?:device-alias|pwwn) (\S+)$/i.exec(line);if(member){const v=member[1];if(!s.deviceAliases[v]&&!wwn.test(v))return bad('Member must be an existing device alias or pWWN');z.members=[...new Set([...z.members,v])];return ok('',true)}if(remove){z.members=z.members.filter(x=>x!==remove[1]);return ok('',true)}}
  const zs=/^zoneset name (\S+) vsan (\d+)$/i.exec(line);if(s.mode==='config'&&zs){const key=`${zs[2]}:${zs[1]}`;s.zonesets[key]=s.zonesets[key]||{name:zs[1],vsan:Number(zs[2]),members:[]};s.mode='zoneset';s.context=key;return ok('',true)}
  if(s.mode==='zoneset'){const z=s.zonesets[s.context];if(cmd==='member'){const key=`${z.vsan}:${t[1]}`;if(!s.zones[key])return bad(`Zone ${t[1]} is not present in VSAN ${z.vsan}`);z.members=[...new Set([...z.members,t[1]])];return ok('',true)}if(lower.startsWith('no member ')){z.members=z.members.filter(x=>x!==t[2]);return ok('',true)}}
  const activate=/^(no )?zoneset activate name (\S+) vsan (\d+)$/i.exec(line);if(s.mode==='config'&&activate){const key=`${activate[3]}:${activate[2]}`;if(activate[1])delete s.activeZonesets[activate[3]];else{if(!s.zonesets[key])return bad(`Zoneset ${activate[2]} is not configured in VSAN ${activate[3]}`);s.activeZonesets[activate[3]]=activate[2]}return ok('',true)}
  const noZone=/^no zone name (\S+) vsan (\d+)$/i.exec(line);if(s.mode==='config'&&noZone){const key=`${noZone[2]}:${noZone[1]}`;if(Object.values(s.zonesets).some(x=>x.vsan===Number(noZone[2])&&x.members.includes(noZone[1])))return bad('Zone is referenced by a zoneset');delete s.zones[key];return ok('',true)}
  const noZs=/^no zoneset name (\S+) vsan (\d+)$/i.exec(line);if(s.mode==='config'&&noZs){if(s.activeZonesets[noZs[2]]===noZs[1])return bad('Cannot remove an active zoneset');delete s.zonesets[`${noZs[2]}:${noZs[1]}`];return ok('',true)}
  return bad(`Invalid command in ${s.mode} mode: ${line}\nType help for supported syntax.`);
}

function iscsi(session,line){
  const s=session.state,t=line.trim().split(/\s+/),lower=line.toLowerCase();
  if(lower==='show state'||lower==='show running-config')return ok(JSON.stringify(s,null,2));if(lower==='show network')return ok(`VLANs\n${JSON.stringify(s.vlans,null,2)}\nInterfaces\n${JSON.stringify(s.interfaces,null,2)}`);if(lower==='show targets')return ok(JSON.stringify(s.targets,null,2));if(lower==='sessions')return ok(JSON.stringify(s.initiators.host1.sessions,null,2));if(lower==='multipath show')return ok(s.initiators.host1.sessions.flatMap(x=>x.portals.map(p=>`${x.iqn} via ${p} ${s.failedPaths.includes(p)?'failed':'active'}`)).join('\n')||'No paths');
  let m=/^vlan (create|delete) (\d+)(?: (\S+))?$/i.exec(line);if(m){if(m[1].toLowerCase()==='create')s.vlans[m[2]]={name:m[3]||`vlan${m[2]}`};else delete s.vlans[m[2]];return ok('',true)}
  m=/^interface set (\S+) (\S+)(?: vlan (\d+))?$/i.exec(line);if(m){if(m[3]&&!s.vlans[m[3]])return bad(`VLAN ${m[3]} does not exist`);s.interfaces[m[1]]={ip:m[2],vlan:m[3]||null,up:true};return ok('',true)}
  m=/^interface (up|down) (\S+)$/i.exec(line);if(m){if(!s.interfaces[m[2]])return bad(`Interface ${m[2]} does not exist`);s.interfaces[m[2]].up=m[1].toLowerCase()==='up';return ok('',true)}
  m=/^target (create|delete) (\S+)$/i.exec(line);if(m){const iqn=m[2];if(m[1].toLowerCase()==='create')s.targets[iqn]={portals:[],luns:{},chap:null};else{if(!s.targets[iqn])return bad(`${iqn} does not exist`);if(s.initiators.host1.sessions.some(x=>x.iqn===iqn))return bad('Target has an active session; logout first');delete s.targets[iqn]}return ok('',true)}
  m=/^portal (add|delete) (\S+) (\S+)$/i.exec(line);if(m){const target=s.targets[m[2]];if(!target)return bad(`${m[2]} does not exist`);if(m[1].toLowerCase()==='add')target.portals=[...new Set([...target.portals,m[3]])];else target.portals=target.portals.filter(x=>x!==m[3]);return ok('',true)}
  m=/^lun (map|unmap) (\S+) (\d+)(?: (\S+))?$/i.exec(line);if(m){const target=s.targets[m[2]];if(!target)return bad(`${m[2]} does not exist`);if(m[1].toLowerCase()==='map'){if(!m[4])return bad('Usage: lun map <target-iqn> <lun> <backing-store>');target.luns[m[3]]=m[4]}else delete target.luns[m[3]];return ok('',true)}
  m=/^chap (set|clear) (\S+)(?: (\S+) (\S+))?$/i.exec(line);if(m){const target=s.targets[m[2]];if(!target)return bad(`${m[2]} does not exist`);target.chap=m[1].toLowerCase()==='set'?{user:need(m[3],'CHAP user',null),secret:need(m[4],'CHAP secret',null)}:null;return ok('',true)}
  if(lower==='discover'){s.initiators.host1.discoveries=Object.keys(s.targets);return ok(s.initiators.host1.discoveries.join('\n')||'No targets discovered',true)}
  m=/^(login|logout) (\S+)$/i.exec(line);if(m){const target=s.targets[m[2]];if(!target)return bad(`${m[2]} was not discovered`);if(m[1].toLowerCase()==='login'){if(target.chap)return bad('CHAP credentials required: login <iqn> <user> <secret>');s.initiators.host1.sessions=[...s.initiators.host1.sessions.filter(x=>x.iqn!==m[2]),{iqn:m[2],portals:[...target.portals]}]}else s.initiators.host1.sessions=s.initiators.host1.sessions.filter(x=>x.iqn!==m[2]);return ok('',true)}
  m=/^login (\S+) (\S+) (\S+)$/i.exec(line);if(m){const target=s.targets[m[1]];if(!target)return bad(`${m[1]} was not discovered`);if(!target.chap||target.chap.user!==m[2]||target.chap.secret!==m[3])return bad('Authentication failed');s.initiators.host1.sessions=[...s.initiators.host1.sessions.filter(x=>x.iqn!==m[1]),{iqn:m[1],portals:[...target.portals]}];return ok('',true)}
  m=/^path (fail|restore) (\S+)$/i.exec(line);if(m){if(m[1].toLowerCase()==='fail')s.failedPaths=[...new Set([...s.failedPaths,m[2]])];else s.failedPaths=s.failedPaths.filter(x=>x!==m[2]);return ok('',true)}
  return bad(`Invalid command: ${line}\nType help for the supported educational command set.`);
}

export function executeAcademyCommand(session,input){
  if(!session||!ACADEMY_PROFILES[session.profile])throw new Error('A valid Academy session is required');const line=String(input??'').trim();if(!line)return{...ok(''),prompt:academyPrompt(session)};session.commandHistory.push(line);
  const lower=line.toLowerCase();if(lower==='help'||lower==='?'||lower.startsWith('help '))return{...ok(help(session.profile)),prompt:academyPrompt(session)};
  if(lower==='scenario list')return{...ok(ACADEMY_SCENARIOS[session.profile].map(item=>`${item.id.padEnd(18)} ${item.title}\n  ${item.brief}`).join('\n')),prompt:academyPrompt(session)};
  if(lower.startsWith('scenario load ')){try{const loaded=loadAcademyScenario(session,line.slice(14).trim());return{...ok(`SCENARIO LOADED · ${loaded.title}\n${loaded.brief}\nUse diagnostic commands, remediate safely, then run scenario check.`,true),prompt:academyPrompt(session)}}catch(error){return{...bad(error.message),prompt:academyPrompt(session)}}}
  if(lower==='scenario check'){const evaluation=evaluateAcademyScenario(session);return{...(evaluation.passed?ok(evaluation.output):bad(evaluation.output)),prompt:academyPrompt(session),assessment:evaluation}}
  if(lower==='reset'){session.undoStack.push(clone(session.state));session.state=initialState(session.profile);return{...ok('Simulator reset to the profile baseline.',true),prompt:academyPrompt(session)}}
  if(lower==='undo'){const prior=session.undoStack.pop();if(!prior)return{...bad('Nothing to undo.'),prompt:academyPrompt(session)};session.state=prior;return{...ok('Previous state restored.',true),prompt:academyPrompt(session)}}
  if(lower==='save'){session.state.saved=true;return{...ok('Simulation state marked as saved.',true),prompt:academyPrompt(session)}}
  if(lower==='show state'&&session.profile==='brocade')return{...ok(JSON.stringify(session.state,null,2)),prompt:academyPrompt(session)};
  const before=clone(session.state);let result;try{result=session.profile==='brocade'?brocade(session,line):session.profile==='cisco'?cisco(session,line):iscsi(session,line)}catch(error){session.state=before;result=bad(error.message)}if(result.changed)session.undoStack.push(before);else if(!result.ok)session.state=before;if(session.scenario&&!lower.startsWith('scenario '))session.scenario.commands++;return{...result,prompt:academyPrompt(session)};
}
