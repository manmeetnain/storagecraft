const pos=(value,name,int=false)=>{const n=Number(value);if(!Number.isFinite(n)||n<=0||(int&&!Number.isInteger(n)))throw new Error(`${name} must be a positive${int?' integer':''}`);return n};

export function calculateNvmeQueues({queues=8,depthPerQueue=32,latencyUs=100,deviceMaxIops=1_000_000,hostMaxIops=800_000,blockKiB=4}={}){
  const queueCount=pos(queues,'queues',true),depth=pos(depthPerQueue,'depthPerQueue',true),latency=pos(latencyUs,'latencyUs'),device=pos(deviceMaxIops,'deviceMaxIops'),host=pos(hostMaxIops,'hostMaxIops'),block=pos(blockKiB,'blockKiB');
  const concurrency=queueCount*depth;
  const concurrencyLimitedIops=concurrency*1_000_000/latency;
  const effectiveIops=Math.min(concurrencyLimitedIops,device,host);
  const limits=[['Queue concurrency',concurrencyLimitedIops],['NVMe device',device],['Host stack',host]];
  const limitingFactor=limits.reduce((a,b)=>b[1]<a[1]?b:a)[0];
  const throughputMiBps=effectiveIops*block/1024;
  const requiredConcurrency=effectiveIops*latency/1_000_000;
  const minimumDepthPerQueue=Math.max(1,Math.ceil(requiredConcurrency/queueCount));
  return{queues:queueCount,depthPerQueue:depth,concurrency,latencyUs:latency,deviceMaxIops:device,hostMaxIops:host,blockKiB:block,concurrencyLimitedIops,effectiveIops,throughputMiBps,requiredConcurrency,minimumDepthPerQueue,limitingFactor,limits:limits.map(([name,ceilingIops])=>({name,ceilingIops,utilization:effectiveIops/ceilingIops,isLimiting:name===limitingFactor})),warning:'Little’s Law ceiling assumes stable average latency and enough independent work. Real NVMe performance varies with read/write mix, locality, CPU affinity, interrupts or polling, filesystem, thermal state, garbage collection, and tail latency.'};
}
