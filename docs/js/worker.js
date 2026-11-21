import {generate} from './generation.js';
import {mesh} from './meshing.js';
// Remesh snapshots are cloned, never transferred out of the live world.
self.onmessage=({data})=>{
 const {cx,cz,seed,revision}=data;
 const chunk=data.chunk||generate(cx,cz,seed),surface=mesh(chunk,seed);
 if(data.chunk)self.postMessage({cx,cz,revision,...surface},[surface.positions.buffer,surface.colors.buffer]);
 else self.postMessage({...chunk,...surface},[chunk.blocks.buffer,chunk.light.buffer,surface.positions.buffer,surface.colors.buffer]);
};
