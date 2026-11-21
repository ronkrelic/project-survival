import {generate} from './generation.js';
import {mesh} from './meshing.js';
// Pure generation and meshing live off the rendering thread.
self.onmessage=({data:{cx,cz,seed}})=>{
 const chunk=generate(cx,cz,seed), surface=mesh(chunk,seed);
 self.postMessage({...chunk,...surface},[chunk.blocks.buffer,chunk.light.buffer,surface.positions.buffer,surface.colors.buffer]);
};
