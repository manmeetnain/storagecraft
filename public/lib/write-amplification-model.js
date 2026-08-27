export const WRITE_PRESETS={
  database:{name:'Transactional database',factors:{wal:2,engine:1.2,filesystem:1.15,protection:1.25,replication:3,ftl:1.4}},
  lsm:{name:'LSM-heavy database',factors:{wal:1.3,engine:4,filesystem:1.1,protection:1.25,replication:3,ftl:1.7}},
  cow:{name:'Copy-on-Write snapshots',factors:{wal:1,engine:1,filesystem:2.2,protection:1.25,replication:2,ftl:1.5}},
  ai:{name:'AI checkpoint pipeline',factors:{wal:1,engine:1,filesystem:1.1,protection:1.25,replication:3,ftl:1.2}}
};
export const WRITE_LAYERS=[['wal','Durability log'],['engine','Storage engine'],['filesystem','Filesystem / CoW'],['protection','RAID / coding writes'],['replication','Replica copies'],['ftl','SSD FTL / garbage collection']];
const positive=(v,name)=>{const n=Number(v);if(!Number.isFinite(n)||n<=0)throw new Error(`${name} must be a positive number`);return n};
export function calculateWritePath({logical=1,...input}={}){
  const base=positive(logical,'logical writes');let current=base;const stages=[{key:'logical',name:'Application writes',factor:1,input:base,output:base,added:0}];
  for(const[key,name]of WRITE_LAYERS){const factor=positive(input[key]??1,key);const before=current;current*=factor;stages.push({key,name,factor,input:before,output:current,added:current-before})}
  return{logical:base,physical:current,amplification:current/base,added:current-base,stages,largest:stages.slice(1).sort((a,b)=>b.added-a.added)[0],warning:'Factors are workload-specific relative write-work multipliers, not universal device-byte predictions. Measure each layer in production.'};
}
