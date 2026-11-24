import {isSolid} from './materials.js';
// PC only: pointer lock, metres, 1.8m body and 1.6m standing eyes.
export class Player {
 constructor(camera,canvas,world,spawn) {
  this.camera=camera;this.world=world;this.canvas=canvas;
  this.x=spawn.x;this.y=spawn.y;this.z=spawn.z;this.visualY=this.y;
  this.yaw=0;this.pitch=-.035;this.vy=0;this.grounded=true;
  this.home={...spawn};this.lastShore={...spawn};this.mistCatch=null;this.mistStrength=0;
  this.didJump=false;this.didSprint=false;
  this.stamina=1;this.sprintExhausted=false;this.sprinting=false;this.jumpQueued=false;
  this.keys=new Set();this.wake=0;this.awake=false;
  canvas.addEventListener('click',()=>{canvas.requestPointerLock()?.catch(console.warn);});
  document.addEventListener('pointerlockchange',()=>{
   if(document.pointerLockElement===canvas)this.awake=true;else {this.keys.clear();this.jumpQueued=false;}
  });
  document.addEventListener('mousemove',e=>{
   if(document.pointerLockElement!==canvas)return;
   this.yaw-=e.movementX*.002*(this.sensitivity||1);this.pitch=Math.max(-1.45,Math.min(1.45,this.pitch-e.movementY*.002*(this.sensitivity||1)));
  });
  addEventListener('keydown',e=>{if(document.pointerLockElement===canvas&&['KeyW','KeyA','KeyS','KeyD','Space','ShiftLeft','ShiftRight'].includes(e.code)){e.preventDefault();if(e.code==='Space'&&!e.repeat&&!this.keys.has('Space'))this.jumpQueued=true;this.keys.add(e.code);}});
  addEventListener('keyup',e=>this.keys.delete(e.code));
  addEventListener('blur',()=>{this.keys.clear();this.jumpQueued=false;});
  this.camera.rotation.order='YXZ';this.update(0);
 }
 clear(x,y,z) {
  const r=.27;
  for(let ix=Math.floor(x-r);ix<=Math.floor(x+r);ix++)
   for(let iz=Math.floor(z-r);iz<=Math.floor(z+r);iz++)
    for(let iy=Math.floor(y+.001);iy<=Math.floor(y+1.799);iy++)
     if(isSolid(this.world.block(ix,iy,iz)))return false;
  return true;
 }
 move(dx,dz) {
  const x=this.x+dx,z=this.z+dz;
  if(this.clear(x,this.y,z)){this.x=x;this.z=z;return;}
  // Barriers must not be climbed by the terrain's automatic whole-cell step.
  for(let ix=Math.floor(x-.27);ix<=Math.floor(x+.27);ix++)for(let iz=Math.floor(z-.27);iz<=Math.floor(z+.27);iz++)for(let iy=Math.floor(this.y+.001);iy<=Math.floor(this.y+1.799);iy++)if([21,22].includes(this.world.block(ix,iy,iz)))return;
  // Step one whole voxel only with grounded feet and head clearance.
  if(this.grounded&&this.clear(this.x,this.y+1,this.z)&&this.clear(x,this.y+1,z)){
   this.x=x;this.z=z;this.y+=1;this.vy=0;
  }
 }
 // Only an empty column is the void: terrace drops keep their normal gravity.
 hasGround(x,z) {
  for(let y=111;y>=0;y--)if(isSolid(this.world.block(Math.floor(x),y,Math.floor(z))))return true;
  return false;
 }
 landing(x,z) {
  for(let y=111;y>=0;y--)if(isSolid(this.world.block(Math.floor(x),y,Math.floor(z)))){
   const feet=y+1;
   if(this.clear(x,feet,z)&&[-.27,.27].every(dx=>[-.27,.27].every(dz=>isSolid(this.world.block(Math.floor(x+dx),y,Math.floor(z+dz))))))return {x,y:feet,z};
  }
  return null;
 }
 catchMist() {
  const edge=this.lastShore||this.home,len=Math.hypot(edge.x,edge.z)||1;
  let target=null;
  for(let d=1.8;d<=len+2&&!target;d+=.5){
   const k=Math.max(0,1-d/len);target=this.landing(edge.x*k,edge.z*k);
  }
  target ||= this.landing(this.home.x,this.home.z);
  if(!target)return; // Wait for the fixed island to finish loading.
  this.mistCatch={t:0,from:{x:this.x,y:this.y,z:this.z},target};
  this.vy=0;this.grounded=false;this.keys.clear();
 }
 updateMist(dt) {
  const c=this.mistCatch;c.t=Math.min(1.65,c.t+dt);
  const smooth=t=>t*t*(3-2*t),a=c.from,b=c.target;
  if(c.t<.4){this.y=a.y-.18*smooth(Math.min(1,c.t/.2));}
  else {
   const u=smooth((c.t-.4)/1.25),lift=Math.max(a.y,b.y)+1.2;
   this.x=a.x+(b.x-a.x)*u;this.z=a.z+(b.z-a.z)*u;
   this.y=u<.5?(a.y-.18)+(lift-a.y+.18)*smooth(u*2):lift+(b.y-lift)*smooth((u-.5)*2);
  }
  this.mistStrength=Math.sin(Math.PI*c.t/1.65);
  if(c.t===1.65){Object.assign(this,b);this.vy=0;this.grounded=true;this.lastShore={...b};this.mistCatch=null;this.mistStrength=0;}
 }
 update(dt) {
  const locked=document.pointerLockElement===this.canvas;
  if(this.awake)this.wake=Math.min(1,this.wake+dt/2);
  if(this.world.loaded&&!this.mistCatch&&(this.y<0||(!this.world.waking&&(Math.abs(this.x)>=128||Math.abs(this.z)>=(this.realmLimit||128)))||(!this.grounded&&!this.hasGround(this.x,this.z))))this.catchMist();
  // Full reservoir: 100 points, 16/s drain, 12/s recovery; restart at 25.
  const moving=['KeyW','KeyA','KeyS','KeyD'].some(k=>this.keys.has(k));
  if(this.sprintExhausted&&this.stamina>=.25)this.sprintExhausted=false;
  this.sprinting=locked&&this.wake===1&&!this.mistCatch&&moving&&!this.sprintExhausted&&(this.keys.has('ShiftLeft')||this.keys.has('ShiftRight'));
  if(this.sprinting)this.didSprint=true;
  this.stamina=Math.max(0,Math.min(1,this.stamina+dt*(this.sprinting?-.16:.12)));
  if(this.stamina===0){this.sprintExhausted=true;this.sprinting=false;}
  if(!locked||this.mistCatch)this.jumpQueued=false;
  if(this.mistCatch)this.updateMist(dt);
  else if(locked&&this.wake===1){
   let f=Number(this.keys.has('KeyW'))-Number(this.keys.has('KeyS'));
   let r=Number(this.keys.has('KeyD'))-Number(this.keys.has('KeyA'));
   const len=Math.hypot(f,r)||1;f/=len;r/=len;
   const speed=this.sprinting?6.4:4;
   const jump=this.jumpQueued;this.jumpQueued=false;
   const dx=(r*Math.cos(this.yaw)-f*Math.sin(this.yaw))*speed*dt;
   const dz=(-f*Math.cos(this.yaw)-r*Math.sin(this.yaw))*speed*dt;
   const n=Math.max(1,Math.ceil(dt/.012));
   for(let j=0;j<n;j++){
    this.grounded=!this.clear(this.x,this.y-.035,this.z);
    if(j===0&&jump&&this.grounded){this.vy=6.6;this.grounded=false;this.didJump=true;}
    if(this.grounded)this.lastShore={x:this.x,y:this.y,z:this.z};
    this.move(dx/n,0);this.move(0,dz/n);
    if(!this.hasGround(this.x,this.z)){this.catchMist();break;}
    this.vy=Math.max(-30,this.vy-18*dt/n);
    const next=this.y+this.vy*dt/n;
    if(this.clear(this.x,next,this.z)){this.y=next;this.grounded=false;}
    else {const falling=this.vy<=0;this.y=falling?Math.ceil(next-.001):Math.floor(next+1.799)-1.8;this.vy=0;this.grounded=falling;}
   }
  }
  // Damped camera absorbs step-ups and landings; collision body stays exact.
  this.visualY+=(this.y-this.visualY)*(1-Math.exp(-12*dt));
  const rise=this.wake*this.wake*(3-2*this.wake);
  this.camera.position.set(this.x,this.visualY+.4+1.2*rise,this.z);
  this.camera.rotation.set(this.pitch,this.yaw,0);
 }
}
