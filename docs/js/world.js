import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import {SIZE,HEIGHT,index,generate,MIN_CHUNK,MAX_CHUNK} from './generation.js';
import {appendDelta} from './deltas.js';
import {breakable} from './materials.js';
import {mesh} from './meshing.js';
export class World {
 constructor(scene,seed){
  this.scene=scene;this.seed=seed;this.chunks=new Map();this.pending=[];this.ready=[];this.busy=false;this.loaded=false;this.dirty=new Set();
  this.material=new THREE.MeshBasicMaterial({vertexColors:true});
  // Fixed 8x8 envelope, loaded once. Never follow the player or evict chunks.
  for(let cz=MIN_CHUNK;cz<=MAX_CHUNK;cz++)for(let cx=MIN_CHUNK;cx<=MAX_CHUNK;cx++)this.pending.push({cx,cz});
  this.pending.sort((a,b)=>a.cx*a.cx+a.cz*a.cz-b.cx*b.cx-b.cz*b.cz);
  const fallback=()=>{this.failed=true;if(this.worker)this.worker.terminate();if(this.inflight){const k=this.key(this.inflight.cx,this.inflight.cz);if(this.chunks.has(k))this.dirty.add(k);else this.pending.unshift(this.inflight);}this.inflight=null;this.busy=false;};
  try{this.worker=new Worker(new URL('./worker.js',import.meta.url),{type:'module'});this.worker.onmessage=({data})=>{this.ready.push(data);this.busy=false;this.inflight=null;};this.worker.onerror=e=>{e.preventDefault();fallback();};}catch{fallback();}
 }
 key(cx,cz){return cx+','+cz;}
 install(data){
  const key=this.key(data.cx,data.cz);const old=this.chunks.get(key);
  if(old&&data.revision!==old.revision)return;
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(data.positions,3));g.setAttribute('color',new THREE.BufferAttribute(data.colors,3));g.computeBoundingSphere();
  if(old){old.object.geometry.dispose();old.object.geometry=g;old.meshedRevision=data.revision;return;}
  const object=new THREE.Mesh(g,this.material);this.scene.add(object);this.chunks.set(key,{...data,revision:0,meshedRevision:0,positions:null,colors:null,object});
 }
 block(x,y,z){
  if(y<0||y>=HEIGHT)return 0;
  const cx=Math.floor(x/SIZE),cz=Math.floor(z/SIZE),c=this.chunks.get(this.key(cx,cz));
  return c?c.blocks[index(x-cx*SIZE,y,z-cz*SIZE)]:0;
 }
 remove(x,y,z){
  if(![x,y,z].every(Number.isInteger))return 0;
  const id=this.block(x,y,z);if(!breakable(id))return 0;
  const cx=Math.floor(x/SIZE),cz=Math.floor(z/SIZE),c=this.chunks.get(this.key(cx,cz));
  c.blocks[index(x-cx*SIZE,y,z-cz*SIZE)]=0;
  let sun=15;for(let yy=HEIGHT-1;yy>=0;yy--){const i=index(x-cx*SIZE,yy,z-cz*SIZE);if(c.blocks[i])sun=0;c.light[i]=sun;}
  appendDelta({x,y,z},id,'remove');
  // Include diagonal neighbours for corner ambient occlusion as well as faces.
  for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++){
   const k=this.key(cx+dx,cz+dz),n=this.chunks.get(k);if(n){n.revision++;this.dirty.add(k);}
  }
  return id;
 }
 snapshot(c){
  const halo={};
  for(let y=0;y<HEIGHT;y++)for(let z=-1;z<=SIZE;z++)for(let x=-1;x<=SIZE;x++){
   if(x>=0&&x<SIZE&&z>=0&&z<SIZE)continue;
   const wx=c.cx*SIZE+x,wz=c.cz*SIZE+z;
   if(this.chunks.has(this.key(Math.floor(wx/SIZE),Math.floor(wz/SIZE))))halo[`${x},${y},${z}`]=this.block(wx,y,wz);
  }
  return {cx:c.cx,cz:c.cz,blocks:c.blocks,light:c.light,halo};
 }
 update(){
  if(this.ready.length)this.install(this.ready.shift());
  if(!this.busy&&!this.ready.length&&this.dirty.size){
   const key=this.dirty.values().next().value;this.dirty.delete(key);const c=this.chunks.get(key),chunk=this.snapshot(c);
   if(!this.failed){this.busy=true;this.inflight={cx:c.cx,cz:c.cz};this.worker.postMessage({cx:c.cx,cz:c.cz,seed:this.seed,revision:c.revision,chunk});}
   else this.ready.push({cx:c.cx,cz:c.cz,revision:c.revision,...mesh(chunk,this.seed)});
  }
  if(!this.busy&&!this.ready.length&&this.pending.length){const c=this.pending.shift();this.busy=true;
   if(!this.failed){this.inflight=c;this.worker.postMessage({...c,seed:this.seed});}
   else{const chunk=generate(c.cx,c.cz,this.seed);this.ready.push({...chunk,...mesh(chunk,this.seed)});this.busy=false;}
  }
  this.loaded=this.chunks.size===64;
 }
}
