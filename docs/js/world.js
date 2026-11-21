import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import {SIZE,HEIGHT,index,generate} from './generation.js';
import {mesh} from './meshing.js';
export class World {
 constructor(scene,seed) {
  this.scene=scene;this.seed=seed;this.chunks=new Map();this.pending=[];this.ready=[];
  this.center='';this.cx=0;this.cz=0;this.busy=false;this.radius=11;
  this.material=new THREE.MeshBasicMaterial({vertexColors:true});
  // One safe spawn chunk immediately; all subsequent generation is worker-owned.
  const first=generate(0,0,seed);this.install({...first,...mesh(first,seed)});
  this.worker=new Worker(new URL('./worker.js',import.meta.url),{type:'module'});
  this.worker.onmessage=({data})=>{this.ready.push(data);this.busy=false;};
  this.worker.onerror=e=>{console.error('Chunk worker failed',e);this.failed=true;this.busy=false;};
 }
 key(cx,cz){return cx+','+cz;}
 install(data) {
  const key=this.key(data.cx,data.cz);if(this.chunks.has(key))return;
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.BufferAttribute(data.positions,3));
  g.setAttribute('color',new THREE.BufferAttribute(data.colors,3));g.computeBoundingSphere();
  const object=new THREE.Mesh(g,this.material);this.scene.add(object);
  this.chunks.set(key,{...data,positions:null,colors:null,object});
 }
 block(x,y,z) {
  if(y<0)return 2;if(y>=HEIGHT)return 0;
  const cx=Math.floor(x/SIZE),cz=Math.floor(z/SIZE),c=this.chunks.get(this.key(cx,cz));
  // Unstreamed ground is a solid boundary, never a hole under the walker.
  return c?c.blocks[index(x-cx*SIZE,y,z-cz*SIZE)]:-1;
 }
 update(x,z) {
  const cx=Math.floor(x/SIZE),cz=Math.floor(z/SIZE),key=this.key(cx,cz);
  if(key!==this.center){
   this.center=key;this.cx=cx;this.cz=cz;this.pending=[];
   for(let dz=-this.radius;dz<=this.radius;dz++)for(let dx=-this.radius;dx<=this.radius;dx++){
    const d=dx*dx+dz*dz;if(d>this.radius*this.radius)continue;
    if(!this.chunks.has(this.key(cx+dx,cz+dz)))this.pending.push({cx:cx+dx,cz:cz+dz,d});
   }
   this.pending.sort((a,b)=>a.d-b.d);
   for(const [k,c] of this.chunks)if(Math.hypot(c.cx-cx,c.cz-cz)>this.radius+2){
    this.scene.remove(c.object);c.object.geometry.dispose();this.chunks.delete(k);
   }
  }
  // At most one GPU upload per animation frame; one worker job in flight.
  if(this.ready.length){const c=this.ready.shift();if(Math.hypot(c.cx-cx,c.cz-cz)<=this.radius+1)this.install(c);}
  if(!this.busy&&!this.ready.length&&this.pending.length){
   const c=this.pending.shift();if(!this.chunks.has(this.key(c.cx,c.cz))){
    this.busy=true;
    if(!this.failed)this.worker.postMessage({...c,seed:this.seed});
    else { // Clearly isolated fallback seam if module workers are unavailable.
     setTimeout(()=>{const chunk=generate(c.cx,c.cz,this.seed);this.ready.push({...chunk,...mesh(chunk,this.seed)});this.busy=false;},0);
    }
   }
  }
 }
}
