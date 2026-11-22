import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import {World} from './world.js';
import {Player} from './player.js';
import {terrainHeight,hash,islandRadius} from './generation.js';
import {Mining} from './mining.js';
const query=new URLSearchParams(location.search).get('seed');
const requestedSeed=query!==null&&/^-?\d+$/.test(query)?Number(query)|0:73021;
const seed=73021; // Handmade layout and decoration ignore requestedSeed.
const scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0xeab59f,.009);
const camera=new THREE.PerspectiveCamera(72,innerWidth/innerHeight,.08,950);
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(innerWidth,innerHeight);
renderer.outputColorSpace=THREE.SRGBColorSpace;document.body.appendChild(renderer.domElement);renderer.domElement.style.visibility="hidden";
document.body.style.background="#090d20";
// Camera-centred dome, peach horizon to indigo zenith, with a broad low sun.
const sky=new THREE.Mesh(new THREE.SphereGeometry(800,32,20),new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,uniforms:{},vertexShader:`varying vec3 ray;void main(){ray=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`varying vec3 ray;void main(){vec3 d=normalize(ray);float t=pow(max(d.y,0.),.48);vec3 c=mix(vec3(.92,.65,.54),vec3(.15,.18,.34),t);vec3 sun=normalize(vec3(.26,.075,-1.));float a=max(dot(d,sun),0.);c+=vec3(.18,.09,.035)*pow(a,60.)+vec3(.25,.16,.07)*pow(a,1600.);c=mix(vec3(.92,.71,.62),c,smoothstep(-.10,.16,d.y));gl_FragColor=vec4(c,1.);}` }));
scene.add(sky);
const world=new World(scene,seed);
import {World} from './world.js';
import {Player} from './player.js';
import {terrainHeight,hash,islandRadius,sparkNodes} from './generation.js';
import {Mining} from './mining.js';
const query=new URLSearchParams(location.search).get('seed');
const requestedSeed=query!==null&&/^-?\d+$/.test(query)?Number(query)|0:73021;
const seed=73021; // Handmade layout and decoration ignore requestedSeed.
const scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0xeab59f,.009);
const camera=new THREE.PerspectiveCamera(72,innerWidth/innerHeight,.08,950);
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(innerWidth,innerHeight);
renderer.outputColorSpace=THREE.SRGBColorSpace;document.body.appendChild(renderer.domElement);renderer.domElement.style.visibility="hidden";
document.body.style.background="#090d20";
// Camera-centred dome, peach horizon to indigo zenith, with a broad low sun.
const sky=new THREE.Mesh(new THREE.SphereGeometry(800,32,20),new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,uniforms:{},vertexShader:`varying vec3 ray;void main(){ray=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`varying vec3 ray;void main(){vec3 d=normalize(ray);float t=pow(max(d.y,0.),.48);vec3 c=mix(vec3(.92,.65,.54),vec3(.15,.18,.34),t);vec3 sun=normalize(vec3(.26,.075,-1.));float a=max(dot(d,sun),0.);c+=vec3(.18,.09,.035)*pow(a,60.)+vec3(.25,.16,.07)*pow(a,1600.);c=mix(vec3(.92,.71,.62),c,smoothstep(-.10,.16,d.y));gl_FragColor=vec4(c,1.);}` }));
scene.add(sky);
const world=new World(scene,seed);
const player=new Player(camera,renderer.domElement,world,{x:.5,y:terrainHeight(0,0,seed)+1,z:.5});
const mining=new Mining(scene,camera,world,player,renderer.domElement);


import {World} from './world.js';
import {Player} from './player.js';
import {terrainHeight,hash,islandRadius,sparkNodes} from './generation.js';
import {Mining} from './mining.js';
const query=new URLSearchParams(location.search).get('seed');
const requestedSeed=query!==null&&/^-?\d+$/.test(query)?Number(query)|0:73021;
const seed=73021; // Handmade layout and decoration ignore requestedSeed.
const scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0xeab59f,.009);
const camera=new THREE.PerspectiveCamera(72,innerWidth/innerHeight,.08,950);
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(innerWidth,innerHeight);
renderer.outputColorSpace=THREE.SRGBColorSpace;document.body.appendChild(renderer.domElement);renderer.domElement.style.visibility="hidden";
document.body.style.background="#090d20";
// Camera-centred dome, peach horizon to indigo zenith, with a broad low sun.
const sky=new THREE.Mesh(new THREE.SphereGeometry(800,32,20),new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,uniforms:{},vertexShader:`varying vec3 ray;void main(){ray=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`varying vec3 ray;void main(){vec3 d=normalize(ray);float t=pow(max(d.y,0.),.48);vec3 c=mix(vec3(.92,.65,.54),vec3(.15,.18,.34),t);vec3 sun=normalize(vec3(.26,.075,-1.));float a=max(dot(d,sun),0.);c+=vec3(.18,.09,.035)*pow(a,60.)+vec3(.25,.16,.07)*pow(a,1600.);c=mix(vec3(.92,.71,.62),c,smoothstep(-.10,.16,d.y));gl_FragColor=vec4(c,1.);}` }));
scene.add(sky);
const world=new World(scene,seed);
const player=new Player(camera,renderer.domElement,world,{x:.5,y:terrainHeight(0,0,seed)+1,z:.5});
const mining=new Mining(scene,camera,world,player,renderer.domElement);


// The island assembles behind the curtain; identity lasts only for this session.
const session={name:'',started:false};
const curtain=document.getElementById('waking'),wakeButton=document.getElementById('wake'),nameInput=document.getElementById('character-name'),wakeHint=document.getElementById('wake-hint');
wakeButton.addEventListener('click',()=>{
 if(!world.loaded||session.started)return;
 session.name=Array.from(nameInput.value.trim()).slice(0,16).join('');player.characterName=session.name;session.started=true;
 renderer.domElement.style.visibility='visible';curtain.classList.add('leaving');setTimeout(()=>{curtain.hidden=true;curtain.style.display='none';},1200);
 renderer.domElement.requestPointerLock()?.catch(()=>{wakeHint.textContent='Click the island to wake.';});
});

// Stage Two: session-only attention, never a clock or a save.
const attention={score:0,counts:{},regions:new Set(),distance:0,last:{x:player.x,z:player.z},gathered:0,monolith:false,
 award(type,weight){const n=this.counts[type]||0;this.counts[type]=n+1;this.score=Math.min(100,this.score+weight/(1+n*.18));},
 update(){const d=Math.hypot(player.x-this.last.x,player.z-this.last.z);this.last={x:player.x,z:player.z};if(!player.awake||player.mistCatch)return;
 if(d<1)this.distance+=d;if(this.distance>=4){this.distance-=4;this.award('steps',3);}
 const region=Math.floor(player.x/12)+','+Math.floor(player.z/12);if(!this.regions.has(region)){this.regions.add(region);this.award('ground',4);}
 const total=Object.values(player.materials).reduce((a,b)=>a+b,0);if(total>this.gathered){for(let i=this.gathered;i<total;i++)this.award('gather',7);this.gathered=total;guide.delight=2;}
 if(!this.monolith&&Math.hypot(player.x-12,player.z+62)<7){this.monolith=true;this.award('monolith',20);}
 }};
const guide={mode:'ambient',clock:0,delight:0,seen:new Set(),queue:[],active:null,elapsed:0,cooldown:0,still:0,stood:0,travel:0,last:{x:player.x,z:player.z},regions:0,gathered:0,arrived:false};
guide.body=new THREE.Group();guide.body.position.copy(camera.position).add(new THREE.Vector3(.95,.45,.2));
const ember=new THREE.Mesh(new THREE.IcosahedronGeometry(.11,2),new THREE.MeshBasicMaterial({color:0xffc77e,transparent:true,opacity:.65}));
const halo=new THREE.Mesh(new THREE.SphereGeometry(.32,12,8),new THREE.MeshBasicMaterial({color:0xffad63,transparent:true,opacity:.045,depthWrite:false}));guide.body.add(ember,halo);
// Two translucent petals suggest a fairy without making a tiny person or a beacon.
const wings=[];for(const side of [-1,1]){const wing=new THREE.Mesh(new THREE.SphereGeometry(1,12,8),new THREE.MeshBasicMaterial({color:0xf3c8af,transparent:true,opacity:.12,depthWrite:false}));wing.scale.set(.18,.07,.025);wing.position.set(side*.16,.05,0);guide.body.add(wing);wings.push(wing);}
guide.light=new THREE.PointLight(0xffbd7c,1.3,22,1.4);guide.body.add(guide.light);scene.add(guide.body);
const guideLine=document.getElementById('guide-line');
guide.say=function(id,text){if(this.seen.has(id))return;this.seen.add(id);this.queue.push({id,text,duration:Math.max(5,text.split(/\s+/).length*.32+2)});};
guide.update=function(dt){
 this.clock+=dt;this.delight=Math.max(0,this.delight-dt);this.cooldown=Math.max(0,this.cooldown-dt);
 const step=Math.hypot(player.x-this.last.x,player.z-this.last.z);this.last={x:player.x,z:player.z};
 if(player.awake&&player.wake===1){
  this.stood+=dt;if(step<1)this.travel+=step;
  if(this.stood>.7)this.say('greeting',session.name?`Hello, ${session.name}. You're awake. I was waiting for you.`:"Hello. You're awake. I was waiting for you.");
  if(this.travel>1.5)this.say('steps',"There you go. The dark isn't empty. It's just quiet.");
  if(attention.gathered>0)this.say('gather',"The world gives, if you're gentle with it.");
  const radius=islandRadius(player.x,player.z),distance=Math.hypot(player.x,player.z);
  if(radius>0&&distance/radius-distance<15)this.say('rim',"Not that way. The edge isn't finished yet. It will catch you, but stay with me.");
  if(attention.monolith)this.say('monolith',"It was here before the mist. It's waiting for something. I think you are too.");
  const progress=attention.regions.size!==this.regions||attention.gathered!==this.gathered||attention.monolith!==this.arrived;
  this.still=progress?0:this.still+dt;this.regions=attention.regions.size;this.gathered=attention.gathered;this.arrived=attention.monolith;
  if(this.still>=90&&!attention.monolith&&!this.active&&!this.queue.length){this.say('nudge',"Shall we? It's this way.");this.still=0;}
 }
 if(!this.active&&this.queue.length&&this.cooldown===0){this.active=this.queue.shift();this.elapsed=0;this.mode='approach';}
 const forward=new THREE.Vector3();camera.getWorldDirection(forward);forward.y=0;forward.normalize();
 const right=new THREE.Vector3(-forward.z,0,forward.x),target=camera.position.clone();
 if(this.active){
  this.elapsed+=dt;const t=this.elapsed,a=this.active;
  if(t<.55){this.mode='approach';guideLine.classList.remove('speaking');}
  else if(t<a.duration+.55){this.mode='speaking';guideLine.textContent=a.text;guideLine.classList.add('speaking');}
  else {guideLine.classList.remove('speaking');this.mode=a.id==='nudge'?'wayfinding':'returning';}
  target.addScaledVector(forward,1.65).addScaledVector(right,.28);target.y+=.14;
  if(a.id==='nudge'&&t>a.duration+1.55){const toward=new THREE.Vector3(12-player.x,0,-62-player.z).normalize();target.copy(camera.position).addScaledVector(toward,3.8);target.y+=.35;}
  const end=a.duration+(a.id==='nudge'?5.55:1.55);
  if(t>=end){this.active=null;this.mode='ambient';this.cooldown=3;}
 }else{
  // A shoulder-side arc stays outside the forward view; never a leading waypoint.
  target.addScaledVector(right,1.05+Math.sin(this.clock*.55)*.18).addScaledVector(forward,-.3+Math.sin(this.clock*.32)*.22);target.y+=.42;
 }
 target.y+=Math.sin(this.clock*2.2)*.09;this.body.position.lerp(target,1-Math.exp(-dt*(this.active?6:3)));
 const bright=this.active?1:0,pulse=Math.sin(this.clock*2);
 ember.material.opacity=.6+bright*.4;ember.scale.set(1+pulse*.08,1.25,1);halo.material.opacity=.045+bright*.09;halo.scale.setScalar(1+pulse*.1+this.delight*.12);
 wings.forEach((w,i)=>{w.rotation.z=(i?1:-1)*(.25+Math.sin(this.clock*9)*.25);});
 this.light.intensity=1.3+bright*3.7+pulse*.18+this.delight*2;
};
const phase={value:0,name:'night',ceiling:.72};
const nightFog=new THREE.Color(0x171c38),violetFog=new THREE.Color(0x4b3c68),dawnFog=new THREE.Color(0xeab59f),fogBase=new THREE.Color();
sky.material.uniforms.progress={value:0};
sky.material.fragmentShader=sky.material.fragmentShader.replace('varying vec3 ray;','uniform float progress;varying vec3 ray;').replace('gl_FragColor=vec4(c,1.);','vec3 night=mix(vec3(.025,.031,.075),vec3(.009,.013,.038),t);vec3 violet=mix(vec3(.29,.18,.36),vec3(.055,.045,.14),t);vec3 early=mix(night,violet,smoothstep(0.,.38,progress));c=mix(early,c,smoothstep(.38,1.,progress));gl_FragColor=vec4(c,1.);');
// Preserve the baked matte voxel shading and luminous flora, but tint terrain at night.
world.material.onBeforeCompile=shader=>{shader.uniforms.phaseLight={value:0};shader.uniforms.emberPosition={value:guide.body.position};world.material.userData.shader=shader;
 shader.vertexShader='varying vec3 islandPosition;\n'+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nislandPosition=(modelMatrix*vec4(position,1.)).xyz;');
 shader.fragmentShader='uniform float phaseLight;uniform vec3 emberPosition;varying vec3 islandPosition;\n'+shader.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\nfloat flora=step(.65,max(diffuseColor.g,diffuseColor.b))*step(diffuseColor.r,.7);float warmth=pow(max(0.,1.-distance(islandPosition,emberPosition)/18.),2.);vec3 ambient=mix(vec3(.14,.17,.30),vec3(.78,.70,.79),phaseLight);diffuseColor.rgb*=mix(ambient+warmth*vec3(1.15,.65,.24),vec3(.9),flora);');};
function updateSky(dt){if(ritual.lit){ritual.elapsed=Math.min(90,ritual.elapsed+dt);const t=ritual.elapsed/90;phase.value=ritual.start+(1-ritual.start)*(t*t*(3-2*t));}else {phase.value=THREE.MathUtils.damp(phase.value,attention.score/100*phase.ceiling,.35,dt);phase.value=Math.min(phase.ceiling,phase.value);}phase.name=phase.value===1?'full dawn':phase.value<.22?'night':phase.value<.56?'violet pre-dawn':'rosy cusp';sky.material.uniforms.progress.value=phase.value;
 fogBase.copy(nightFog).lerp(violetFog,Math.min(1,phase.value/.38));if(phase.value>.38)fogBase.lerp(dawnFog,(phase.value-.38)/.62);
 if(world.material.userData.shader)world.material.userData.shader.uniforms.phaseLight.value=phase.value;
}

// A handful of matte grass blades at the bed: no HUD or click instruction.
const grass=new THREE.Group(),mat=new THREE.MeshBasicMaterial({color:0x789c85,side:THREE.DoubleSide});
for(let i=0;i<55;i++){
 const x=(hash(i,31,seed)-.5)*7,z=(hash(i,32,seed)-.5)*7;
 if(Math.hypot(x-.5,z-.5)<.6)continue;
 const h=.15+hash(i,33,seed)*.23,g=new THREE.PlaneGeometry(.06,h);
 const blade=new THREE.Mesh(g,mat);blade.position.set(x,terrainHeight(Math.floor(x),Math.floor(z),seed)+1+h/2,z);blade.rotation.y=i*2.4;grass.add(blade);
}scene.add(grass);
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});

// Stage Three: one ritual, one dawn. No inventory or crafting screen.
const ritual={lit:false,hold:0,elapsed:0,start:0,clock:0,x:6,z:-6,y:terrainHeight(6,-6)+1,
 enough(){return (player.materials.sparkstone||0)>=3&&(player.materials.dryfiber||0)>=5;},
 light(){if(this.lit||!this.enough())return false;player.materials.sparkstone-=3;player.materials.dryfiber-=5;mining.tally.textContent='Carried: '+Object.entries(player.materials).map(([k,v])=>k+' '+v).join(' · ');this.lit=true;this.start=phase.value;this.elapsed=0;mining.cancel();return true;}};
const hearth=new THREE.Group();hearth.position.set(ritual.x,ritual.y,ritual.z);scene.add(hearth);
for(let i=0;i<10;i++){const rock=new THREE.Mesh(new THREE.DodecahedronGeometry(.3,0),new THREE.MeshBasicMaterial({color:0x8c7b80}));rock.position.set(Math.cos(i*Math.PI/5)*.9,.08,Math.sin(i*Math.PI/5)*.9);rock.scale.y=.6;hearth.add(rock);}
const ash=new THREE.Mesh(new THREE.CylinderGeometry(.68,.75,.08,12),new THREE.MeshBasicMaterial({color:0x49404c}));hearth.add(ash);
const flames=[];for(let i=0;i<3;i++){const f=new THREE.Mesh(new THREE.ConeGeometry(.29-i*.055,.95-i*.12,7),new THREE.MeshBasicMaterial({color:[0xe98b63,0xffc47f,0xf8dba3][i],transparent:true,opacity:.8,depthWrite:false}));f.position.set((i-1)*.17,.48,i%2*.12);hearth.add(f);flames.push(f);}
const fireLight=new THREE.PointLight(0xffb777,0,20,1.5);fireLight.position.y=1;hearth.add(fireLight);
const sparks=[];for(let i=0;i<12;i++){const s=new THREE.Mesh(new THREE.IcosahedronGeometry(.025,0),new THREE.MeshBasicMaterial({color:0xffcc85,transparent:true}));hearth.add(s);sparks.push(s);}
const glints=[];for(const [x,z] of sparkNodes){const g=new THREE.Mesh(new THREE.OctahedronGeometry(.07),new THREE.MeshBasicMaterial({color:0xffe7ad,transparent:true,depthWrite:false}));g.position.set(x+.5,terrainHeight(x,z)+1.08,z+.5);scene.add(g);glints.push(g);}
const aurora=new THREE.Group();aurora.position.set(12,87,-62);scene.add(aurora);
for(let i=0;i<3;i++){const geo=new THREE.PlaneGeometry(44,23,24,10),mat=new THREE.MeshBasicMaterial({color:i%2?0xad91cb:0x81c6bc,transparent:true,opacity:0,side:THREE.DoubleSide,depthWrite:false,fog:false});const ribbon=new THREE.Mesh(geo,mat);ribbon.rotation.y=i*Math.PI/3;ribbon.position.y=i*7;aurora.add(ribbon);}
function updateRitual(dt){ritual.clock+=dt;const near=Math.hypot(player.x-ritual.x,player.z-ritual.z)<5;
 if(player.awake&&player.wake===1&&!ritual.lit){if(near)guide.say('cold-circle',"It's cold here yet. Stone that sparks, grass that burns. Bring me some of each.");if(ritual.enough())guide.say('enough-fire',"That's enough. Bring it to the stone circle.");}
 const dir=camera.getWorldDirection(new THREE.Vector3()),toward=hearth.position.clone().add(new THREE.Vector3(0,.25,0)).sub(camera.position);const aiming=near&&toward.length()<5&&dir.dot(toward.normalize())>.94;
 if(!ritual.lit&&aiming&&ritual.enough()&&mining.held&&document.pointerLockElement===renderer.domElement){ritual.hold+=dt;mining.elapsed=0;if(ritual.hold>=2)ritual.light();}else ritual.hold=0;
 flames.forEach((f,i)=>{f.visible=ritual.lit;f.scale.set(1+Math.sin(ritual.clock*3+i)*.1,1+Math.sin(ritual.clock*4+i)*.16,1);});fireLight.intensity=ritual.lit?5+Math.sin(ritual.clock*5)*.3+Math.max(0,1-ritual.elapsed)*8:0;
 sparks.forEach((s,i)=>{s.visible=ritual.lit;const a=(ritual.clock*.3+i/12)%1;s.position.set(Math.sin(i*5+a)*.4,.3+a*2,Math.cos(i*7+a)*.4);s.material.opacity=1-a;});
 glints.forEach((g,i)=>{const [x,z]=sparkNodes[i];g.visible=world.block(x,terrainHeight(x,z)-1,z)===10;g.material.opacity=.25+.2*Math.sin(ritual.clock*1.7+i);});
 aurora.visible=ritual.lit;aurora.children.forEach((r,i)=>{r.material.opacity=.12*Math.min(1,ritual.elapsed/30);const p=r.geometry.attributes.position;for(let j=0;j<p.count;j++){const x=p.getX(j),y=p.getY(j);p.setZ(j,Math.sin(x*.16+ritual.clock*.22+i+y*.06)*2.7);}p.needsUpdate=true;});
}


// The threshold is authored geometry, not another generated region.
const crossing={manifest:0,named:false,name:'',offered:false,crossed:false,furthest:-100,clock:0};
const bridge=new THREE.Group(),shore=new THREE.Group();scene.add(bridge,shore);bridge.visible=shore.visible=false;
const decks=[];const bridgeY=z=>36+Math.floor(Math.sin(Math.PI*Math.max(0,Math.min(1,(-z-100)/46)))*3);
for(let z=-100;z>=-146;z--){const mat=new THREE.MeshBasicMaterial({color:0x9e8b90,transparent:true,opacity:0});const deck=new THREE.Mesh(new THREE.BoxGeometry(3,.95,1.03),mat);deck.position.set(12,bridgeY(z)+.5,z+.5);bridge.add(deck);decks.push(deck);}
const grass=new THREE.Mesh(new THREE.CylinderGeometry(10,8,3,14),new THREE.MeshBasicMaterial({color:0x86a48b}));grass.position.set(12,35.5,-156);shore.add(grass);
for(const [x,z] of [[8,-156],[17,-160]]){const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.35,.5,4,6),new THREE.MeshBasicMaterial({color:0x927866}));trunk.position.set(x,39,z);const crown=new THREE.Mesh(new THREE.IcosahedronGeometry(2.8,1),new THREE.MeshBasicMaterial({color:0x8ba48a}));crown.position.set(x,42,z);shore.add(trunk,crown);}
const naming=document.createElement('div');naming.id='guide-naming';naming.hidden=true;naming.style.cssText='position:fixed;inset:0;z-index:30;background:#11152be8;color:#f3cbb7;display:none;place-content:center;text-align:center;font:18px Georgia,serif';naming.innerHTML='<label for="guide-name">A name to carry onward</label><input id="guide-name" value="Ember" maxlength="16" style="margin:22px auto;padding:12px;background:#27263a;color:#f3cbb7;border:1px solid #9b7f83;font:inherit;text-align:center"><button id="accept-guide-name" style="padding:12px;background:#e7bba4;color:#27263a;border:0;font:inherit">Give this name</button>';document.body.append(naming);
function acceptGuideName(){const input=document.getElementById('guide-name');const name=Array.from(input.value.trim()).slice(0,16).join('');if(!name){input.value='Ember';input.focus();return;}crossing.name=name;crossing.named=true;guide.name=name;guide.delight=6;guide.say('given-name',name+'.');guide.say('keep-name',"I'll keep it.");naming.hidden=true;naming.style.display='none';renderer.domElement.requestPointerLock()?.catch(()=>{});}
document.getElementById('accept-guide-name').onclick=acceptGuideName;
const baseBlock=world.block.bind(world);world.block=function(x,y,z){
 if(crossing.manifest>=1){
 if(!crossing.named&&x>=10&&x<=14&&z===-101&&y>=36&&y<=43)return 9;
 if(x>=11&&x<=13&&z<=-100&&z>=-146&&y===bridgeY(z)&&(!crossing.crossed||z<=crossing.furthest+3))return 9;
 if((x-12)**2+(z+156)**2<=90&&y>=34&&y<=36)return 9;
 }return baseBlock(x,y,z);};
const baseCatch=player.catchMist.bind(player);player.catchMist=function(){if(!crossing.crossed)return baseCatch();const target=this.landing(12,-156);if(!target)return;this.mistCatch={t:0,from:{x:this.x,y:this.y,z:this.z},target};this.vy=0;this.grounded=false;this.keys.clear();};
function updateCrossing(dt){crossing.clock+=dt;if(phase.value!==1)return;
 crossing.manifest=Math.min(1,crossing.manifest+dt/7);bridge.visible=shore.visible=true;player.realmLimit=190;
 if(crossing.manifest===1)guide.say('way-open',"The way is open. It only goes forward.");
 if(!crossing.named&&!crossing.offered&&crossing.manifest===1&&Math.hypot(player.x-12,player.z+98)<6){crossing.offered=true;guide.say('ask-name',"You've come all this way with me, and I never told you my name. I don't have one yet. Would you give me one?");}
 if(crossing.offered&&!crossing.named&&guide.active?.id==='ask-name'&&guide.mode==='speaking'&&guide.elapsed>guide.active.duration){naming.hidden=false;naming.style.display='grid';document.exitPointerLock();document.getElementById('guide-name').focus();}
 if(crossing.named&&player.z<-103&&Math.abs(player.x-12)<2){crossing.crossed=true;crossing.furthest=Math.min(crossing.furthest,player.z);}
 if(crossing.crossed&&player.z<-146){player.home={x:12,y:37,z:-156};crossing.furthest=-151;}
 decks.forEach(d=>{const gone=crossing.crossed&&d.position.z>crossing.furthest+3;d.material.opacity=THREE.MathUtils.damp(d.material.opacity,gone?0:crossing.manifest,2,dt);d.position.y=bridgeY(Math.floor(d.position.z))+.5-(1-crossing.manifest)*3;});
}

let last=performance.now();
function frame(now){requestAnimationFrame(frame);const dt=Math.min((now-last)/1000,.05);last=now;world.update(player.x,player.z);if(world.loaded&&!session.started){wakeButton.disabled=false;wakeHint.textContent='Ready when you are.';}if(world.loaded&&session.started){player.update(dt);updateRitual(dt);updateCrossing(dt);mining.update(dt);attention.update();guide.update(dt);}updateSky(dt);
 const rim=crossing.manifest>0&&player.z<-96?0:THREE.MathUtils.smoothstep(islandRadius(player.x,player.z),.55,1);const held=player.mistStrength||0;scene.fog.density=.012-phase.value*.004+rim*.034+held*.075;
 scene.fog.color.copy(fogBase).lerp(new THREE.Color(0xffe5cf),held*.55);
 sky.position.copy(camera.position);renderer.render(scene,camera);}
requestAnimationFrame(frame);
// Read-only inspection seam for desktop smoke tests; never displayed in-world.
window.grin={session,seed,player,world,renderer,scene,camera,mining,attention,guide,phase,sky,ritual,hearth,aurora,updateRitual,updateSky,crossing,bridge,shore,updateCrossing,acceptGuideName};
