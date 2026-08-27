const whole=(value,name,allowZero=false)=>{const n=Number(value);if(!Number.isInteger(n)||n<(allowZero?0:1))throw new Error(`${name} must be ${allowZero?'a non-negative':'a positive'} integer`);return n};
const failure=(failed,total,name)=>{const n=whole(failed,name,true);if(n>total)throw new Error(`${name} cannot exceed installed count`);return n};

export function calculateSanFailure({fabrics=2,hostPortsPerFabric=1,controllers=2,targetPortsPerControllerFabric=1,failedFabrics=0,failedHostPorts=0,failedControllers=0,failedTargetPorts=0,multipathFailoverSeconds=8,applicationTimeoutSeconds=30}={}){
  const fabricTotal=whole(fabrics,'fabrics'),hostPerFabric=whole(hostPortsPerFabric,'hostPortsPerFabric'),controllerTotal=whole(controllers,'controllers'),targetPer=whole(targetPortsPerControllerFabric,'targetPortsPerControllerFabric');
  const installed={fabrics:fabricTotal,hostPorts:fabricTotal*hostPerFabric,controllers:controllerTotal,targetPorts:fabricTotal*controllerTotal*targetPer};
  const failed={fabrics:failure(failedFabrics,installed.fabrics,'failedFabrics'),hostPorts:failure(failedHostPorts,installed.hostPorts,'failedHostPorts'),controllers:failure(failedControllers,installed.controllers,'failedControllers'),targetPorts:failure(failedTargetPorts,installed.targetPorts,'failedTargetPorts')};
  const activeFabrics=installed.fabrics-failed.fabrics,activeControllers=installed.controllers-failed.controllers;
  const remaining={fabrics:activeFabrics,hostPorts:Math.max(0,activeFabrics*hostPerFabric-failed.hostPorts),controllers:activeControllers,targetPorts:Math.max(0,activeFabrics*activeControllers*targetPer-failed.targetPorts)};
  const domains=[['Fabric',installed.fabrics,remaining.fabrics],['Host port',installed.hostPorts,remaining.hostPorts],['Controller',installed.controllers,remaining.controllers],['Target port',installed.targetPorts,remaining.targetPorts]].map(([name,total,active])=>({name,total,active,failed:total-active,available:active>0,redundant:active>1}));
  const available=domains.every(domain=>domain.available);
  const failover=Number(multipathFailoverSeconds),timeout=Number(applicationTimeoutSeconds);if(!Number.isFinite(failover)||failover<0)throw new Error('multipathFailoverSeconds must be non-negative');if(!Number.isFinite(timeout)||timeout<=0)throw new Error('applicationTimeoutSeconds must be positive');
  const recoversBeforeTimeout=available&&failover<timeout;
  const state=!available?'OUTAGE':domains.every(d=>d.failed===0)?'HEALTHY':'DEGRADED';
  const basePaths=fabricTotal*hostPerFabric*controllerTotal*targetPer;
  const activePathEstimate=available?Math.max(1,Math.floor(basePaths*Math.min(remaining.fabrics/installed.fabrics,remaining.hostPorts/installed.hostPorts,remaining.controllers/installed.controllers,remaining.targetPorts/installed.targetPorts))):0;
  return{installed,failed,remaining,domains,basePaths,activePathEstimate,available,state,multipathFailoverSeconds:failover,applicationTimeoutSeconds:timeout,recoversBeforeTimeout,applicationImpact:!available?'No complete initiator-to-target path remains':recoversBeforeTimeout?'Path recovery completes inside the modeled application timeout':'Storage remains reachable, but failover exceeds the application timeout',warning:'Aggregate failure-domain model: it cannot prove that surviving initiator and target ports share the same fabric or zoning. Validate physical cabling, zoning, ALUA/ANA behavior, path policy, timeout stack, quorum, and array-specific controller semantics.'};
}
