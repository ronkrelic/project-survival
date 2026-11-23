// Latest edit per voxel coordinate; bounded by distinct edited cells.
// Record: {position:{x,y,z}, block:integerId, action:'place'|'remove'}.
// World save/network replay own realm persistence; this compact log supports local edits.
const log=new Map();
export function appendDelta(position,block,action) {
 if(!['place','remove'].includes(action)||!Number.isInteger(block)||!['x','y','z'].every(k=>Number.isInteger(position[k])))throw new TypeError('Invalid voxel delta');
 log.set([position.x,position.y,position.z].join(':'),Object.freeze({position:Object.freeze({...position}),block,action}));
}
export function readDeltas(){return [...log.values()];}
