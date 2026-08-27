const positive=(value,name)=>{const n=Number(value);if(!Number.isFinite(n)||n<=0)throw new Error(`${name} must be a positive number`);return n};

export function calculateAiDataPath({datasetTiB=100,epochs=1,objectReadMBps=5000,fabricMBps=12500,preprocessMBps=8000,trainerIngestMBps=6000,checkpointGiB=500,checkpointWriteMBps=4000,modelGiB=140,modelReadMBps=7000,gpuLoadMBps=12000}={}){
  const dataset=positive(datasetTiB,'datasetTiB'),passes=positive(epochs,'epochs'),fabric=positive(fabricMBps,'fabricMBps');
  const stages=[['Object storage',positive(objectReadMBps,'objectReadMBps')],['Data fabric',fabric],['Preprocessing',positive(preprocessMBps,'preprocessMBps')],['Trainer ingest',positive(trainerIngestMBps,'trainerIngestMBps')]].map(([name,throughputMBps])=>({name,throughputMBps}));
  const bottleneck=stages.reduce((lowest,stage)=>stage.throughputMBps<lowest.throughputMBps?stage:lowest);
  const totalMiB=dataset*1024*1024*passes;
  const trainingHours=totalMiB/bottleneck.throughputMBps/3600;
  const checkpointSize=positive(checkpointGiB,'checkpointGiB'),checkpointEffectiveMBps=Math.min(positive(checkpointWriteMBps,'checkpointWriteMBps'),fabric);
  const checkpointSeconds=checkpointSize*1024/checkpointEffectiveMBps;
  const modelSize=positive(modelGiB,'modelGiB'),modelEffectiveMBps=Math.min(positive(modelReadMBps,'modelReadMBps'),fabric,positive(gpuLoadMBps,'gpuLoadMBps'));
  const modelLoadSeconds=modelSize*1024/modelEffectiveMBps;
  return{datasetTiB:dataset,epochs:passes,stages:stages.map(stage=>({...stage,utilization:bottleneck.throughputMBps/stage.throughputMBps,idealPassHours:totalMiB/stage.throughputMBps/3600,isBottleneck:stage.name===bottleneck.name})),bottleneck:bottleneck.name,effectiveTrainingMBps:bottleneck.throughputMBps,trainingHours,checkpointGiB:checkpointSize,checkpointEffectiveMBps,checkpointSeconds,modelGiB:modelSize,modelEffectiveMBps,modelLoadSeconds,warning:'This is a steady-state bandwidth model. Production results also depend on small-file metadata, cache state, compression, CPU/GPU overlap, queue depth, tail latency, contention, retries, and checkpoint coordination.'};
}
