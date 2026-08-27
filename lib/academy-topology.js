const clone = (value) => JSON.parse(JSON.stringify(value));

export const ACADEMY_TOPOLOGY_VERSION = '2.0';

export function createDualFabricTopology() {
  return {
    version: ACADEMY_TOPOLOGY_VERSION,
    nodes: [
      { id: 'host-01', label: 'HOST-01', type: 'host' },
      { id: 'brocade-a1', label: 'FC-A1', type: 'brocade', fabric: 'A' },
      { id: 'cisco-a2', label: 'MDS-A2', type: 'cisco', fabric: 'A' },
      { id: 'brocade-b1', label: 'FC-B1', type: 'brocade', fabric: 'B' },
      { id: 'cisco-b2', label: 'MDS-B2', type: 'cisco', fabric: 'B' },
      { id: 'array-01', label: 'ARRAY-01', type: 'storage' },
    ],
    links: [
      ['host-01', 'brocade-a1', 'A'], ['brocade-a1', 'cisco-a2', 'A'], ['cisco-a2', 'array-01', 'A'],
      ['host-01', 'brocade-b1', 'B'], ['brocade-b1', 'cisco-b2', 'B'], ['cisco-b2', 'array-01', 'B'],
    ].map(([from, to, fabric], index) => ({ id: `link-${index + 1}`, from, to, fabric, state: 'up' })),
  };
}

export function setFabricState(topology, fabric, state) {
  if (!['A', 'B'].includes(fabric)) throw new Error('fabric must be A or B');
  if (!['up', 'down'].includes(state)) throw new Error('state must be up or down');
  const next = clone(topology);
  next.links.filter((link) => link.fabric === fabric).forEach((link) => { link.state = state; });
  return next;
}

export function topologyHealth(topology) {
  const pathUp = (fabric) => topology.links.filter((link) => link.fabric === fabric).every((link) => link.state === 'up');
  const paths = { A: pathUp('A'), B: pathUp('B') };
  return { paths, reachable: paths.A || paths.B, redundant: paths.A && paths.B, state: paths.A && paths.B ? 'HEALTHY' : paths.A || paths.B ? 'DEGRADED' : 'OUTAGE' };
}
