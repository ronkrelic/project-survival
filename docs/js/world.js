import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import {SIZE,HEIGHT,index,generate,MIN_CHUNK,MAX_CHUNK} from './generation.js';
import {mesh} from './meshing.js';
export class World {
 constructor(scene,seed){
  this.scene=scene;this.seed=seed;this.chunks=new Map();this.pending=[];this.ready=[];this.busy=false;this.loaded=false;
  this.material=new THREE.MeshBasicMaterial({vertexColors:true});
  // Fixed 8x8 envelope, loaded once. Never follow the player or evict chunks.
  for(let cz=MIN_CHUNK;cz<=MAX_CHUNK;cz++)for(let cx=MIN_CHUNK;cx<=MAX_CHUNK;cx++)this.pending.push({cx,cz});
  this.pending.sort((a,b)=>a.cx*a.cx+a.cz*a.cz-b.cx*b.cx-b.cz*b.cz);
  const fallback=()=>{this.failed=true;if(this.worker)this.worker.terminate();if(this.inflight)this.pending.unshift(this.inflight);this.inflight=null;this.busy=false;};
  try{this.worker=new Worker(new URL('./worker.js',import.meta.url),{type:'module'});this.worker.onmessage=({data})=>{this.ready.push(data);this.busy=false;this.inflight=null;};this.worker.onerror=e=>{e.preventDefault();fallback();};}catch{fallback();}
 }
 key(cx,cz){return cx+','+cz;}
 install(data){
  const key=this.key(data.cx,data.cz);if(this.chunks.has(key))return;
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(data.positions,3));g.setAttribute('color',new THREE.BufferAttribute(data.colors,3));g.computeBoundingSphere();
  const object=new THREE.Mesh(g,this.material);this.scene.add(object);this.chunks.set(key,{...data,positions:null,colors:null,object});
 }
 block(x,y,z){
  if(y<0||y>=HEIGHT)return 0;
  const cx=Math.floor(x/SIZE),cz=Math.floor(z/SIZE),c=this.chunks.get(this.key(cx,cz));
  return c?c.blocks[index(x-cx*SIZE,y,z-cz*SIZE)]:0;
 }
 update(){
  if(this.ready.length)this.install(this.ready.shift());
  if(!this.busy&&!this.ready.length&&this.pending.length){const c=this.pending.shift();this.busy=true;
   if(!this.failed){this.inflight=c;this.worker.postMessage({...c,seed:this.seed});}
   else{const chunk=generate(c.cx,c.cz,this.seed);this.ready.push({...chunk,...mesh(chunk,this.seed)});this.busy=false;}
  }
  this.loaded=this.chunks.size===64;
 }
}
