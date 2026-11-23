import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import {materials,breakable} from './materials.js';
// Grid traversal, not triangle picking: works with any loaded voxel realm.
export function targetBlock(world,origin,direction,reach=5){
 const p=[Math.floor(origin.x),Math.floor(origin.y),Math.floor(origin.z)],o=origin.toArray(),d=direction.toArray();
 const step=d.map(Math.sign),delta=d.map(v=>v===0?Infinity:Math.abs(1/v));
 const next=d.map((v,i)=>v===0?Infinity:((v>0?p[i]+1:p[i])-o[i])/v);
 let distance=0;
 while(distance<=reach){const id=world.block(...p);if(id)return {x:p[0],y:p[1],z:p[2],id,distance};
  const a=next.indexOf(Math.min(...next));distance=next[a];p[a]+=step[a];next[a]+=delta[a];
 }return null;
}
export class Mining{
 constructor(scene,camera,world,player,canvas){
  Object.assign(this,{scene,camera,world,player,canvas,held:false,elapsed:0,target:null,motes:[],clock:0});
  player.materials=Object.create(null);
  this.outline=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.008,1.008,1.008)),new THREE.LineBasicMaterial({color:0xe1d2bd,transparent:true,opacity:.28}));
  this.glow=new THREE.Mesh(new THREE.BoxGeometry(1.004,1.004,1.004),new THREE.MeshBasicMaterial({color:0xe6d6bf,transparent:true,opacity:0,depthWrite:false}));
  scene.add(this.outline,this.glow);this.outline.visible=this.glow.visible=false;
  this.dot=document.createElement('div');this.dot.textContent='·';this.dot.style.cssText='position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);color:#e0d4c5;font:20px serif;pointer-events:none;opacity:.65';document.body.append(this.dot);
  this.moteGeometry=new THREE.SphereGeometry(.035,4,3);
  canvas.addEventListener('mousedown',e=>{if(e.button!==0||document.pointerLockElement!==canvas)return;this.held=true;this.elapsed=0;this.startHum();});
  addEventListener('mouseup',e=>{if(e.button===0)this.cancel();});addEventListener('blur',()=>this.cancel());
  document.addEventListener('pointerlockchange',()=>{if(document.pointerLockElement!==canvas)this.cancel();});
 }
 cancel(){this.held=false;this.elapsed=0;if(this.gain)this.gain.gain.value=0;}
 startHum(){
  try{if(!this.audio){this.audio=new (window.AudioContext||window.webkitAudioContext)();this.gain=this.audio.createGain();this.gain.gain.value=0;const tone=this.audio.createOscillator();tone.type='sine';tone.frequency.value=92;tone.connect(this.gain).connect(this.audio.destination);tone.start();}this.audio.resume().catch(()=>{});}catch{}
 }
 mote(t,collect=false){
  const m=materials[t.id],object=new THREE.Mesh(this.moteGeometry,new THREE.MeshBasicMaterial({color:m?.color||0xc7b5a0,transparent:true,opacity:.6,depthWrite:false}));
  object.position.set(t.x+.15+Math.random()*.7,t.y+.25+Math.random()*.65,t.z+.15+Math.random()*.7);this.scene.add(object);
  this.motes.push({object,age:0,collect,life:collect?1.05:.65});
 }
 update(dt){
  this.clock+=dt;
  const active=document.pointerLockElement===this.canvas&&this.world.loaded&&this.player.wake===1;
  const t=active?targetBlock(this.world,this.camera.position,this.camera.getWorldDirection(new THREE.Vector3())):null;
  if(!t||!this.target||t.x!==this.target.x||t.y!==this.target.y||t.z!==this.target.z||t.id!==this.target.id)this.elapsed=0;
  this.target=t;this.outline.visible=this.glow.visible=!!t;this.dot.style.display=active?'':'none';
  let hum=0;
  if(t){
   this.outline.position.set(t.x+.5,t.y+.5,t.z+.5);this.glow.position.copy(this.outline.position);
   const m=materials[t.id],seconds=m?.seconds??Infinity;
   if(this.held&&active){
    this.elapsed+=dt;
    if(breakable(t.id)){
     const progress=Math.min(1,this.elapsed/seconds);
     this.glow.material.opacity=.03+.14*progress;this.outline.material.opacity=.28+.2*progress;
     if(Math.floor(this.clock*14)!==Math.floor((this.clock-dt)*14))this.mote(t);
     if(this.elapsed>=seconds){const removed=this.world.remove(t.x,t.y,t.z);if(removed){const name=materials[removed].yield;this.player.materials[name]=(this.player.materials[name]||0)+1;if(removed===1)this.player.materials.dryfiber=(this.player.materials.dryfiber||0)+1;for(let i=0;i<14;i++)this.mote(t,true);}this.elapsed=0;this.target=null;}
    }else{this.glow.material.opacity=.045+.02*Math.sin(this.clock*5);hum=.018;}
   }else{this.glow.material.opacity=.018;this.outline.material.opacity=.28;}
  }else this.elapsed=0;
  if(this.gain)this.gain.gain.setTargetAtTime(hum,this.audio.currentTime,.1);
  for(let i=this.motes.length-1;i>=0;i--){const m=this.motes[i];m.age+=dt;
   if(m.collect&&m.age>.2)m.object.position.lerp(this.camera.position,1-Math.exp(-3*dt));else m.object.position.y+=dt*.45;
   m.object.material.opacity=.6*Math.max(0,1-m.age/m.life);
   if(m.age>=m.life){this.scene.remove(m.object);m.object.material.dispose();this.motes.splice(i,1);}
  }
 }
}
