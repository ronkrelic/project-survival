// Append-only future world edits. Co-op later = seed + deltas.
// Record: {position:{x,y,z}, block:integerId, action:'place'|'remove'}.
// Mining appends removals; session-only, with no persistence or networking.
const log=[];
export function appendDelta(position,block,action) {
 if(!['place','remove'].includes(action)||!Number.isInteger(block)||!['x','y','z'].every(k=>Number.isInteger(position[k])))throw new TypeError('Invalid voxel delta');
 log.push(Object.freeze({position:Object.freeze({...position}),block,action}));
}
export function readDeltas(){return log.slice();}
