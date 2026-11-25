import * as THREE from './vendor/three.module.js';
import {SIZE,HEIGHT,index,generate,generateWaking,MIN_CHUNK,MAX_CHUNK} from './generation.js';
import {appendDelta} from './deltas.js';
import {breakable} from './materials.js';
import {mesh} from './meshing.js';
export class World {
 constructor(scene,seed){
  this.scene=scene;this.seed=seed;this.chunks=new Map();this.pending=[];this.ready=[];this.busy=false;this.loaded=false;this.dirty=new Set();
  this.farmland=new Map();this.waking=false;this.edits=new Map();this.wanted=new Set();
  this.material=new THREE.MeshBasicMaterial({vertexColors:true});
  // Separate pass: never run water through the terrain's luminous-flora heuristic.
  this.waterUniforms={waterTime:{value:0},waterNight:{value:0},waterSeed:{value:seed}};
  this.waterMaterial=new THREE.MeshBasicMaterial({vertexColors:true,transparent:true,opacity:.45,depthWrite:false,side:THREE.DoubleSide});
  this.waterMaterial.onBeforeCompile=shader=>{
   Object.assign(shader.uniforms,this.waterUniforms);
   shader.vertexShader='varying vec3 waterWorld;\n'+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nwaterWorld=(modelMatrix*vec4(position,1.)).xyz;');
   shader.fragmentShader='uniform float waterTime;uniform float waterNight;uniform float waterSeed;varying vec3 waterWorld;\n'+shader.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\nfloat shimmer=sin(waterWorld.x*.7+waterWorld.z*.43+waterTime*.55+waterSeed)*.035+sin(waterWorld.z*.91-waterTime*.38)*.02;diffuseColor.rgb=(diffuseColor.rgb+shimmer)*mix(vec3(1.05,1.04,1.),vec3(.34,.48,.65),waterNight);');
  };
  // Fixed 8x8 envelope, loaded once. Never follow the player or evict chunks.
  for(let cz=MIN_CHUNK;cz<=MAX_CHUNK;cz++)for(let cx=MIN_CHUNK;cx<=MAX_CHUNK;cx++)this.pending.push({cx,cz});
  this.pending.sort((a,b)=>a.cx*a.cx+a.cz*a.cz-b.cx*b.cx-b.cz*b.cz);
  const fallback=()=>{this.failed=true;if(this.worker)this.worker.terminate();if(this.inflight){const k=this.key(this.inflight.cx,this.inflight.cz);if(this.chunks.has(k))this.dirty.add(k);else this.pending.unshift(this.inflight);}this.inflight=null;this.busy=false;};
  try{this.worker=new Worker(new URL('./worker.js',import.meta.url),{type:'module'});this.worker.onmessage=({data})=>{if(!!data.waking===this.waking)this.ready.push(data);this.busy=false;this.inflight=null;};this.worker.onerror=e=>{e.preventDefault();fallback();};}catch{fallback();}
 }
 key(cx,cz){return cx+','+cz;}
 install(data){
  const key=this.key(data.cx,data.cz);if(this.waking&&!this.wanted.has(key))return;const old=this.chunks.get(key);
  if(old&&data.revision!==old.revision)return;
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(data.positions,3));g.setAttribute('color',new THREE.BufferAttribute(data.colors,3));g.setAttribute('uv',new THREE.BufferAttribute(data.uvs,2));g.computeBoundingSphere();
  const wg=new THREE.BufferGeometry();wg.setAttribute('position',new THREE.BufferAttribute(data.waterPositions,3));wg.setAttribute('color',new THREE.BufferAttribute(data.waterColors,3));wg.computeBoundingSphere();
  if(old){old.object.geometry.dispose();old.object.geometry=g;old.waterObject.geometry.dispose();old.waterObject.geometry=wg;old.meshedRevision=data.revision;return;}
  if(this.waking&&data.blocks){for(const i of this.edits.get(key)||[])data.blocks[i]=0;
   for(let z=0;z<SIZE;z++)for(let x=0;x<SIZE;x++){let sun=15;for(let y=HEIGHT-1;y>=0;y--){const i=index(x,y,z);if(data.blocks[i]&&data.blocks[i]!==25)sun=0;data.light[i]=sun;}}
  }
  const object=new THREE.Mesh(g,this.material),waterObject=new THREE.Mesh(wg,this.waterMaterial);waterObject.renderOrder=1;this.scene.add(object,waterObject);this.chunks.set(key,{...data,revision:0,meshedRevision:0,positions:null,colors:null,uvs:null,waterPositions:null,waterColors:null,object,waterObject});
  if(this.waking){const c=this.chunks.get(key);if(this.edits.has(key)){c.revision++;this.dirty.add(key);}for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++){if(!dx&&!dz)continue;const k=this.key(data.cx+dx,data.cz+dz),n=this.chunks.get(k);if(n){n.revision++;this.dirty.add(k);}}}
 }
 till(x,y,z){
  const id=this.block(x,y,z);if(![1,11,14,15,19].includes(id)||this.block(x,y+1,z))return false;
  const key=(this.waking?'waking':'island')+':'+[x,y,z].join(':');this.farmland.set(key,{x,y,z});this.paintSoil(x,y,z);return true;
 }
 paintSoil(x,y,z){const cx=Math.floor(x/SIZE),cz=Math.floor(z/SIZE),c=this.chunks.get(this.key(cx,cz));if(!c)return;const i=index(x-cx*SIZE,y,z-cz*SIZE);if(![1,11,14,15,17,19].includes(c.blocks[i]))return;c.blocks[i]=17;c.revision++;this.dirty.add(this.key(cx,cz));}
 block(x,y,z){
  if(y<0||y>=HEIGHT)return 0;
  const cx=Math.floor(x/SIZE),cz=Math.floor(z/SIZE),c=this.chunks.get(this.key(cx,cz));
  return c?c.blocks[index(x-cx*SIZE,y,z-cz*SIZE)]:0;
 }
 remove(x,y,z){
  if(![x,y,z].every(Number.isInteger))return 0;
  const id=this.block(x,y,z);if(!breakable(id))return 0;
  const cx=Math.floor(x/SIZE),cz=Math.floor(z/SIZE),c=this.chunks.get(this.key(cx,cz));
  const i=index(x-cx*SIZE,y,z-cz*SIZE);c.blocks[i]=0;
  if(this.waking){const k=this.key(cx,cz);if(!this.edits.has(k))this.edits.set(k,new Set());this.edits.get(k).add(i);}
  let sun=15;for(let yy=HEIGHT-1;yy>=0;yy--){const i=index(x-cx*SIZE,yy,z-cz*SIZE);if(c.blocks[i]&&c.blocks[i]!==25)sun=0;c.light[i]=sun;}
  this.farmland.delete((this.waking?'waking':'island')+':'+[x,y,z].join(':'));appendDelta({x,y,z},id,'remove');
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
  return {waking:this.waking,cx:c.cx,cz:c.cz,blocks:c.blocks,light:c.light,halo};
 }
 enterWaking(){
  this.waking=true;this.pending=[];this.ready=[];this.dirty.clear();
  for(const c of this.chunks.values()){this.scene.remove(c.object,c.waterObject);c.object.geometry.dispose();c.waterObject.geometry.dispose();}this.chunks.clear();
  this.stream(0,0);
 }
 stream(x,z){
  const cx=Math.floor(x/SIZE),cz=Math.floor(z/SIZE);this.wanted.clear();
  for(let dz=-3;dz<=3;dz++)for(let dx=-3;dx<=3;dx++)this.wanted.add(this.key(cx+dx,cz+dz));
  for(const [k,c] of this.chunks)if(!this.wanted.has(k)){this.scene.remove(c.object,c.waterObject);c.object.geometry.dispose();c.waterObject.geometry.dispose();this.chunks.delete(k);this.dirty.delete(k);}
  this.pending=this.pending.filter(c=>this.wanted.has(this.key(c.cx,c.cz)));
  const queued=new Set(this.pending.map(c=>this.key(c.cx,c.cz)));
  if(this.inflight)queued.add(this.key(this.inflight.cx,this.inflight.cz));
  for(const c of this.ready)queued.add(this.key(c.cx,c.cz));
  for(let dz=-2;dz<=2;dz++)for(let dx=-2;dx<=2;dx++){const a=cx+dx,b=cz+dz,k=this.key(a,b);if(!this.chunks.has(k)&&!queued.has(k))this.pending.push({cx:a,cz:b});}
  this.pending.sort((a,b)=>(a.cx-cx)**2+(a.cz-cz)**2-(b.cx-cx)**2-(b.cz-cz)**2);
 }
 update(x=0,z=0){
  if(this.waking)this.stream(x,z);
  if(this.ready.length)this.install(this.ready.shift());
  if(!this.busy&&!this.ready.length&&this.dirty.size){
   const key=this.dirty.values().next().value;this.dirty.delete(key);const c=this.chunks.get(key);if(!c)return;const chunk=this.snapshot(c);
   if(!this.failed){this.busy=true;this.inflight={cx:c.cx,cz:c.cz};this.worker.postMessage({cx:c.cx,cz:c.cz,seed:this.seed,waking:this.waking,revision:c.revision,chunk});}
   else this.ready.push({cx:c.cx,cz:c.cz,revision:c.revision,...mesh(chunk,this.seed)});
  }
  if(!this.busy&&!this.ready.length&&this.pending.length){const c=this.pending.shift();this.busy=true;
   if(!this.failed){this.inflight=c;this.worker.postMessage({...c,seed:this.seed,waking:this.waking});}
   else{const chunk=(this.waking?generateWaking:generate)(c.cx,c.cz,this.seed);this.ready.push({...chunk,...mesh(chunk,this.seed)});this.busy=false;}
  }
  for(const [k,p] of this.farmland)if(k.startsWith(this.waking?'waking:':'island:')&&this.block(p.x,p.y,p.z)!==17)this.paintSoil(p.x,p.y,p.z);
  this.loaded=this.waking||this.chunks.size===64;
 }
}
