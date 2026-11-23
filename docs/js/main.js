import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import {World} from './world.js';
import {Player} from './player.js';
import {terrainHeight,wakingHeight,hash,islandRadius,sparkNodes} from './generation.js';
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
guide.say=function(id,text){if(this.seen.has(id))return;
 if(!world.waking&&!this.lessons.done&&['gather','cold-circle','enough-fire','monolith','nudge','way-open','ask-name'].includes(id)){this.lessons.deferred.set(id,text);return;}this.seen.add(id);this.queue.push({id,text,duration:Math.max(5,text.split(/\s+/).length*.32+2)});};
// Relic, November 22: one responsive island lesson at a time, never a key press guess.
guide.lessons={stage:'jump',done:false,deferred:new Map()};guide.completed=new Set();
guide.updateLessons=function(){
 const l=this.lessons;if(world.waking||l.done||!this.completed.has('steps'))return;
 if(l.stage==='jump'&&player.didJump){this.say('jump-ack',"There. The world holds you up on the way down.");this.delight=3;l.stage='jump-ack';}
 else if(l.stage==='jump'&&!this.active&&!this.queue.length&&this.cooldown===0)this.say('jump-teach',"The island climbs in steps. When a step is too tall, press space and rise to meet it.");
 if(l.stage==='jump-ack'&&this.completed.has('jump-ack'))l.stage='sprint';
 if(l.stage==='sprint'&&player.didSprint){this.say('sprint-ack',"The wind noticed you.");this.delight=3;l.stage='sprint-ack';}
 else if(l.stage==='sprint'&&!this.active&&!this.queue.length&&this.cooldown===0)this.say('sprint-teach',"If you're eager, hold shift and run. It spends your stamina; walk a while and it comes back.");
 if(l.stage==='sprint-ack'&&this.completed.has('sprint-ack')){l.done=true;for(const [id,text] of l.deferred)this.say(id,text);l.deferred.clear();}
};
guide.update=function(dt){
 this.updateLessons();
 this.clock+=dt;this.delight=Math.max(0,this.delight-dt);this.cooldown=Math.max(0,this.cooldown-dt);
 const step=Math.hypot(player.x-this.last.x,player.z-this.last.z);this.last={x:player.x,z:player.z};
 if(player.awake&&player.wake===1&&!world.waking){
  this.stood+=dt;if(step<1)this.travel+=step;
  if(this.stood>.7)this.say('greeting',session.name?`Hello, ${session.name}. You're awake. I was waiting for you.`:"Hello. You're awake. I was waiting for you.");
  if(this.travel>1.5)this.say('steps',"There you go. The dark isn't empty. It's just quiet.");
  if(attention.gathered>0)this.say('gather',"The world gives, if you're gentle with it.");
  const radius=islandRadius(player.x,player.z),distance=Math.hypot(player.x,player.z);
  if(!(phase.value===1&&player.z<-90)&&radius>0&&distance/radius-distance<15)this.say('rim',"Not that way. The edge isn't finished yet. It will catch you, but stay with me.");
  if(attention.monolith)this.say('monolith',"It was here before the mist. It's waiting for something. I think you are too.");
  const progress=attention.regions.size!==this.regions||attention.gathered!==this.gathered||attention.monolith!==this.arrived;
  this.still=progress?0:this.still+dt;this.regions=attention.regions.size;this.gathered=attention.gathered;this.arrived=attention.monolith;
  if(this.still>=90&&!crossing.crossed&&!attention.monolith&&!this.active&&!this.queue.length){this.say('nudge',"Shall we? It's this way.");this.still=0;}
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
  if(t>=end){this.completed.add(a.id);this.active=null;this.mode='ambient';this.cooldown=3;}
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
world.material.onBeforeCompile=shader=>{shader.uniforms.phaseLight={value:0};shader.uniforms.firstFire={value:0};shader.uniforms.emberPosition={value:guide.body.position};world.material.userData.shader=shader;
 shader.vertexShader='varying vec3 islandPosition;\n'+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nislandPosition=(modelMatrix*vec4(position,1.)).xyz;');
 shader.fragmentShader='uniform float firstFire;uniform float phaseLight;uniform vec3 emberPosition;varying vec3 islandPosition;\n'+shader.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\nfloat flora=step(.65,max(diffuseColor.g,diffuseColor.b))*step(diffuseColor.r,.7);float warmth=pow(max(0.,1.-distance(islandPosition,emberPosition)/18.),2.);vec3 ambient=mix(vec3(.14,.17,.30),vec3(.78,.70,.79),phaseLight);diffuseColor.rgb*=mix(ambient+warmth*vec3(1.15,.65,.24)+firstFire*pow(max(0.,1.-distance(islandPosition,vec3(6.,41.,-6.))/15.),2.)*vec3(1.6,.65,.2),vec3(.9),flora);');};
function updateSky(dt){if(ritual.lit){ritual.elapsed=Math.min(90,ritual.elapsed+dt);const t=ritual.elapsed/90;phase.value=ritual.start+(1-ritual.start)*(t*t*(3-2*t));}else {phase.value=THREE.MathUtils.damp(phase.value,attention.score/100*phase.ceiling,.35,dt);phase.value=Math.min(phase.ceiling,phase.value);}phase.name=phase.value===1?'full dawn':phase.value<.22?'night':phase.value<.56?'violet pre-dawn':'rosy cusp';sky.material.uniforms.progress.value=phase.value;
 fogBase.copy(nightFog).lerp(violetFog,Math.min(1,phase.value/.38));if(phase.value>.38)fogBase.lerp(dawnFog,(phase.value-.38)/.62);
 if(world.material.userData.shader){world.material.userData.shader.uniforms.phaseLight.value=phase.value;world.material.userData.shader.uniforms.firstFire.value=ritual.lit?1:0;}
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
 light(){if(this.lit||!this.enough())return false;player.materials.sparkstone-=3;player.materials.dryfiber-=5;this.lit=true;startCrackle();this.start=phase.value;this.elapsed=0;mining.cancel();return true;}};
const hearth=new THREE.Group();hearth.position.set(ritual.x,ritual.y,ritual.z);scene.add(hearth);
for(let i=0;i<10;i++){const rock=new THREE.Mesh(new THREE.DodecahedronGeometry(.3,0),new THREE.MeshBasicMaterial({color:0x8c7b80}));rock.position.set(Math.cos(i*Math.PI/5)*.9,.08,Math.sin(i*Math.PI/5)*.9);rock.scale.y=.6;hearth.add(rock);}
const ash=new THREE.Mesh(new THREE.CylinderGeometry(.68,.75,.08,12),new THREE.MeshBasicMaterial({color:0x49404c}));hearth.add(ash);
const flames=[];for(let i=0;i<3;i++){const f=new THREE.Mesh(new THREE.ConeGeometry(.29-i*.055,.95-i*.12,7),new THREE.MeshBasicMaterial({color:[0xe98b63,0xffc47f,0xf8dba3][i],transparent:true,opacity:.8,depthWrite:false}));f.position.set((i-1)*.17,.48,i%2*.12);hearth.add(f);flames.push(f);}
const fireLight=new THREE.PointLight(0xffb777,0,20,1.5);fireLight.position.y=1;hearth.add(fireLight);
const sparks=[];for(let i=0;i<12;i++){const s=new THREE.Mesh(new THREE.IcosahedronGeometry(.025,0),new THREE.MeshBasicMaterial({color:0xffcc85,transparent:true}));hearth.add(s);sparks.push(s);}
const glints=[];for(const [x,z] of sparkNodes){const g=new THREE.Mesh(new THREE.OctahedronGeometry(.07),new THREE.MeshBasicMaterial({color:0xffe7ad,transparent:true,depthWrite:false}));g.position.set(x+.5,terrainHeight(x,z)+1.08,z+.5);scene.add(g);glints.push(g);}
const aurora=new THREE.Group();aurora.position.set(12,87,-62);scene.add(aurora);
for(let i=0;i<3;i++){const geo=new THREE.PlaneGeometry(44,23,24,10),mat=new THREE.MeshBasicMaterial({color:i%2?0xad91cb:0x81c6bc,transparent:true,opacity:0,side:THREE.DoubleSide,depthWrite:false,fog:false});const ribbon=new THREE.Mesh(geo,mat);ribbon.rotation.y=i*Math.PI/3;ribbon.position.y=i*7;aurora.add(ribbon);}

function startCrackle(){try{const audio=mining.audio||new (window.AudioContext||window.webkitAudioContext)();audio.resume().catch(()=>{});const buffer=audio.createBuffer(1,audio.sampleRate*3,audio.sampleRate),data=buffer.getChannelData(0);let low=0;for(let i=0;i<data.length;i++){low=low*.985+(Math.random()*2-1)*.015;data[i]=low*2+(Math.random()<.0005?(Math.random()-.5)*.4:0);}const noise=audio.createBufferSource(),filter=audio.createBiquadFilter(),gain=audio.createGain();noise.buffer=buffer;noise.loop=true;filter.type='lowpass';filter.frequency.value=900;gain.gain.value=.055;noise.connect(filter).connect(gain).connect(audio.destination);noise.start();ritual.crackle={audio,noise,gain};}catch{}}

function updateRitual(dt){if(world.waking)return;ritual.clock+=dt;const near=Math.hypot(player.x-ritual.x,player.z-ritual.z)<5;
 if(player.awake&&player.wake===1&&!ritual.lit){if(near)guide.say('cold-circle',"It's cold here yet. Stone that sparks, grass that burns. Bring me some of each.");if(ritual.enough())guide.say('enough-fire',"That's enough. Bring it to the stone circle.");}
 const dir=camera.getWorldDirection(new THREE.Vector3()),toward=hearth.position.clone().add(new THREE.Vector3(0,.25,0)).sub(camera.position);const aiming=near&&toward.length()<5&&dir.dot(toward.normalize())>.94;
 if(!ritual.lit&&aiming&&ritual.enough()&&mining.held&&document.pointerLockElement===renderer.domElement){ritual.hold+=dt;mining.elapsed=0;if(ritual.hold>=2)ritual.light();}else ritual.hold=0;
 flames.forEach((f,i)=>{f.visible=ritual.lit;f.scale.set(1+Math.sin(ritual.clock*3+i)*.1,1+Math.sin(ritual.clock*4+i)*.16,1);});fireLight.intensity=ritual.lit?5+Math.sin(ritual.clock*5)*.3+Math.max(0,1-ritual.elapsed)*8:0;
 sparks.forEach((s,i)=>{s.visible=ritual.lit;const a=(ritual.clock*.3+i/12)%1;s.position.set(Math.sin(i*5+a)*.4,.3+a*2,Math.cos(i*7+a)*.4);s.material.opacity=1-a;});
 glints.forEach((g,i)=>{const [x,z]=sparkNodes[i];g.visible=world.block(x,terrainHeight(x,z),z)===10;g.material.opacity=.25+.2*Math.sin(ritual.clock*1.7+i);});
 aurora.visible=ritual.lit;aurora.children.forEach((r,i)=>{r.material.opacity=.12*Math.min(1,ritual.elapsed/30);const p=r.geometry.attributes.position;for(let j=0;j<p.count;j++){const x=p.getX(j),y=p.getY(j);p.setZ(j,Math.sin(x*.16+ritual.clock*.22+i+y*.06)*2.7);}p.needsUpdate=true;});
}


// The threshold is authored geometry, not another generated region.
const crossing={manifest:0,named:false,name:'',offered:false,crossed:false,furthest:-100,clock:0};
const bridge=new THREE.Group(),shore=new THREE.Group();scene.add(bridge,shore);bridge.visible=shore.visible=false;
const decks=[];const bridgeY=z=>36+Math.floor(Math.sin(Math.PI*Math.max(0,Math.min(1,(-z-100)/46)))*3);
for(let z=-100;z>=-146;z--){const mat=new THREE.MeshBasicMaterial({color:0x9e8b90,transparent:true,opacity:0});const deck=new THREE.Mesh(new THREE.BoxGeometry(3,.95,1.03),mat);deck.position.set(12,bridgeY(z)+.5,z+.5);bridge.add(deck);decks.push(deck);}
const shoreGrass=new THREE.Mesh(new THREE.CylinderGeometry(10,8,3,14),new THREE.MeshBasicMaterial({color:0x86a48b}));shoreGrass.position.set(12,35.5,-156);shore.add(shoreGrass);
for(const [x,z] of [[8,-156],[17,-160]]){const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.35,.5,4,6),new THREE.MeshBasicMaterial({color:0x927866}));trunk.position.set(x,39,z);const crown=new THREE.Mesh(new THREE.IcosahedronGeometry(2.8,1),new THREE.MeshBasicMaterial({color:0x8ba48a}));crown.position.set(x,42,z);shore.add(trunk,crown);}
const naming=document.createElement('div');naming.id='guide-naming';naming.hidden=true;naming.style.cssText='position:fixed;inset:0;z-index:30;background:#11152be8;color:#f3cbb7;display:none;place-content:center;text-align:center;font:18px Georgia,serif';naming.innerHTML='<label for="guide-name">A name to carry onward</label><input id="guide-name" value="Ember" maxlength="16" style="margin:22px auto;padding:12px;background:#27263a;color:#f3cbb7;border:1px solid #9b7f83;font:inherit;text-align:center"><button id="accept-guide-name" style="padding:12px;background:#e7bba4;color:#27263a;border:0;font:inherit">Give this name</button>';document.body.append(naming);
function acceptGuideName(){if(crossing.named)return;const input=document.getElementById('guide-name');const name=Array.from(input.value.trim()).slice(0,16).join('');if(!name){input.value='Ember';input.focus();return;}crossing.name=name;crossing.named=true;guide.name=name;guide.delight=6;guide.say('given-name',name+'.');guide.say('keep-name',"I'll keep it.");naming.hidden=true;naming.style.display='none';renderer.domElement.requestPointerLock()?.catch(()=>{});}
document.getElementById('accept-guide-name').onclick=acceptGuideName;
const baseBlock=world.block.bind(world);world.block=function(x,y,z){
 if(world.waking)return baseBlock(x,y,z);
 if(crossing.manifest>=1){
 if(!crossing.named&&x>=10&&x<=14&&z===-101&&y>=36&&y<=43)return 9;
 if(crossing.named&&x>=11&&x<=13&&z<=-100&&z>=-146&&y===bridgeY(z)&&(!crossing.crossed||z<=crossing.furthest+3))return 9;

 }return baseBlock(x,y,z);};
const baseCatch=player.catchMist.bind(player);player.catchMist=function(){if(!crossing.crossed)return baseCatch();const edge=world.waking?this.lastShore:null;const target=world.waking?(edge&&this.landing(edge.x,edge.z)||this.landing(this.home.x,this.home.z)):this.landing(12,-145);if(!target)return;this.mistCatch={t:0,from:{x:this.x,y:this.y,z:this.z},target};this.vy=0;this.grounded=false;this.keys.clear();};
const veil=document.createElement('div');veil.id='threshold-mist';veil.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:25;background:radial-gradient(ellipse,#f4dfcf,#b9bdc6);opacity:0';document.body.append(veil);
function updateCrossing(dt){
 if(crossing.veil){
  const v=crossing.veil;v.t+=dt;
  if(!v.moved&&v.t>=1){
   v.moved=true;world.enterWaking();const from=new THREE.Vector3(player.x,player.y,player.z);
   player.x=.5;player.z=.5;player.y=wakingHeight(0,0,seed)+1;player.visualY=player.y;player.vy=0;player.keys.clear();player.mistCatch=null;
   player.home=player.lastShore={x:player.x,y:player.y,z:player.z};
   guide.body.position.add(new THREE.Vector3(player.x,player.y,player.z).sub(from));player.update(0);
   bridge.visible=shore.visible=grass.visible=hearth.visible=aurora.visible=false;glints.forEach(g=>g.visible=false);
   if(ritual.crackle)ritual.crackle.gain.gain.value=0;
  }
  const settled=v.moved&&[-1,0,1].every(x=>[-1,0,1].every(z=>world.chunks.has(world.key(x,z))));
  if(settled)v.fade=(v.fade||0)+dt;
  veil.style.opacity=String(v.moved?1-Math.min(1,v.fade||0):Math.min(1,v.t));
  if(v.fade>=1){crossing.veil=null;veil.style.opacity='0';}
  return;
 }
 if(world.waking)return;
 crossing.clock+=dt;if(phase.value!==1)return;
 crossing.manifest=Math.min(1,crossing.manifest+dt/7);bridge.visible=true;shore.visible=false;player.realmLimit=190;
 if(crossing.manifest===1)guide.say('way-open',"The way is open. It only goes forward.");
 if(!crossing.named&&!crossing.offered&&crossing.manifest===1&&Math.hypot(player.x-12,player.z+98)<6){crossing.offered=true;guide.say('ask-name',"You've called me Ember since you woke. Maybe it's mine. But a name should be given, not assumed. Would you give me one?");}
 if(crossing.offered&&!crossing.named&&guide.active?.id==='ask-name'&&guide.mode==='speaking'&&guide.elapsed>guide.active.duration){naming.hidden=false;naming.style.display='grid';document.exitPointerLock();document.getElementById('guide-name').focus();}
 if(crossing.named&&player.z<-112&&Math.abs(player.x-12)<2){crossing.crossed=true;crossing.furthest=Math.min(crossing.furthest,player.z);}
 if(crossing.crossed&&player.z<-145){crossing.furthest=-151;crossing.veil={t:0,moved:false,fade:0};mining.cancel();}
 decks.forEach(d=>{const gone=crossing.crossed&&d.position.z>crossing.furthest+3;d.material.opacity=THREE.MathUtils.damp(d.material.opacity,gone?0:crossing.manifest,2,dt);d.position.y=bridgeY(Math.floor(d.position.z))+.5-(1-crossing.manifest)*3;});
}


// Quiet session cartography: unknown cells are never sampled for display.
const hud=document.createElement('aside');hud.id='waking-hud';hud.setAttribute('aria-label','Player, companion and explored ground');hud.style.cssText='position:fixed;inset:0;z-index:8;display:none;pointer-events:none;color:#f3cbb7;font:12px Georgia,serif';
const hudStyle=document.createElement('style');hudStyle.textContent=`#waking-hud .soft-panel{background:#292b39df;border:1px solid #d7ae8c55;border-radius:18px;box-shadow:0 4px 22px #161d2835,inset 0 1px #f4d1af12}#vitals-stack{position:absolute;top:18px;left:18px;width:210px;display:grid;gap:10px}#player-box{padding:14px 16px}#player-hud-name{font-size:16px;overflow-wrap:anywhere;margin-bottom:10px}.vital{margin-top:7px}.vital-label{display:flex;justify-content:space-between;font-size:11px;color:#ddc9b9}.vital small{font-size:9px;opacity:.7}.vital-track{height:6px;background:#151d28;border-radius:8px;margin-top:4px;overflow:hidden}.vital-fill{height:100%;width:100%;border-radius:8px;background:#d7ac99}#hunger-fill{background:#c4ad79}#stamina-fill{background:#91b6a2}#guide-box{display:flex;gap:12px;align-items:center;padding:12px}#guide-hud-name{font-size:15px;overflow-wrap:anywhere}#guide-role{font-size:11px;color:#ccb8a8;margin-top:5px}#explored-map{position:absolute;right:18px;top:18px;width:120px;height:120px;padding:8px;box-sizing:content-box;opacity:.9}@media(max-width:440px){#vitals-stack{left:10px;top:10px;width:180px}#explored-map{right:10px;top:10px;width:96px;height:96px}}#session-code button{display:block;width:100%;margin:7px 0 0!important;padding:7px!important;font-size:12px!important}#session-code{border:1px solid #d7ae8c55;box-shadow:0 4px 22px #161d2835,inset 0 1px #f4d1af12}#journal-lines{scrollbar-width:thin;scrollbar-color:#99857c #292938;scrollbar-gutter:stable}#journal-lines::-webkit-scrollbar{width:7px}#journal-lines::-webkit-scrollbar-track{background:#292938;border-radius:8px}#journal-lines::-webkit-scrollbar-thumb{background:#99857c;border:2px solid #292938;border-radius:8px}#journal-lines::-webkit-scrollbar-thumb:hover{background:#c4ad99}@media(max-width:440px){#session-code{right:136px!important;width:130px!important}}`;document.head.append(hudStyle);
const stack=document.createElement('div');stack.id='vitals-stack';
const playerBox=document.createElement('section');playerBox.id='player-box';playerBox.className='soft-panel';playerBox.setAttribute('aria-label','Player vitals');
const playerName=document.createElement('div');playerName.id='player-hud-name';playerBox.append(playerName);
const bars={};
for(const [id,label] of [['health','Health'],['hunger','Hunger'],['stamina','Stamina']]){
 const row=document.createElement('div');row.className='vital';
 const caption=document.createElement('div');caption.className='vital-label';caption.textContent=label;
 if(id!=='stamina'){const note=document.createElement('small');note.textContent='not yet active';caption.append(note);}
 const track=document.createElement('div');track.className='vital-track';track.setAttribute('role','progressbar');track.setAttribute('aria-label',label+(id==='stamina'?'':' (placeholder; not yet active)'));track.setAttribute('aria-valuemin','0');track.setAttribute('aria-valuemax','100');track.setAttribute('aria-valuenow','100');
 const fill=document.createElement('div');fill.id=id+'-fill';fill.className='vital-fill';track.append(fill);row.append(caption,track);playerBox.append(row);bars[id]={fill,track};
}
const guideBox=document.createElement('section');guideBox.id='guide-box';guideBox.className='soft-panel';guideBox.setAttribute('aria-label','Spirit guide');
const face=document.createElement('img');face.src='https://raw.githubusercontent.com/ronkrelic/project-survival/main/concept-art/ember-icon.jpg';face.alt='Ember portrait';face.width=48;face.height=48;face.style.cssText='width:48px;height:48px;object-fit:cover;border-radius:50%;filter:saturate(.7) contrast(.88);box-shadow:0 0 18px #f0bc9630';
const guideInfo=document.createElement('div'),guideName=document.createElement('div'),guideRole=document.createElement('div');guideName.id='guide-hud-name';guideRole.id='guide-role';guideRole.textContent='spirit guide';guideInfo.append(guideName,guideRole);guideBox.append(face,guideInfo);stack.append(playerBox,guideBox);
const map=document.createElement('canvas');map.id='explored-map';map.className='soft-panel';map.width=map.height=144;map.setAttribute('aria-label','Explored ground; mist hides the unknown');
hud.append(stack,map);document.body.append(hud);
const plate=document.createElement('div');plate.id='guide-nameplate';plate.textContent='Ember';plate.style.cssText='position:fixed;left:0;top:0;z-index:9;display:none;pointer-events:none;color:#f3cbb7;font:13px Georgia,serif;letter-spacing:.04em;text-shadow:0 1px 8px #352533;transform:translate(-50%,-100%)';document.body.append(plate);
guide.name='Ember';
const atlas={island:new Map(),waking:new Map(),clock:1};
const mapColors={1:'#789e8b',2:'#ac876e',3:'#ab8182',4:'#777688',5:'#927866',6:'#87a08a',7:'#8abbb2',8:'#b2a0bb',9:'#8c7378',10:'#d5d1b0',11:'#527f72',12:'#b87868',13:'#c1c5be',14:'#dce4e3',15:'#c7a16a',16:'#97aa83'};
function updateHUD(dt){
 hud.style.display=session.started?'block':'none';
 playerName.textContent=session.name||'Wanderer';guideName.textContent=guide.name||'Ember';
 bars.stamina.fill.style.width=(player.stamina*100)+'%';bars.stamina.track.setAttribute('aria-valuenow',String(Math.round(player.stamina*100)));
 plate.textContent=guide.name||'Ember';
 const point=guide.body.position.clone();point.y+=.38;point.project(camera);
 const visible=session.started&&!crossing.veil&&point.z>-1&&point.z<1&&Math.abs(point.x)<.98&&Math.abs(point.y)<.98;
 plate.style.display=visible?'block':'none';plate.style.left=(point.x*.5+.5)*innerWidth+'px';plate.style.top=(-point.y*.5+.5)*innerHeight+'px';
 if(!session.started||crossing.veil)return;
 const book=world.waking?atlas.waking:atlas.island,cx=Math.floor(player.x/2),cz=Math.floor(player.z/2);atlas.clock+=dt;
 if(atlas.clock>=.2){atlas.clock=0;
  for(let dz=-3;dz<=3;dz++)for(let dx=-3;dx<=3;dx++){if(dx*dx+dz*dz>9)continue;const x=(cx+dx)*2,z=(cz+dz)*2;
   if(!world.chunks.has(world.key(Math.floor(x/32),Math.floor(z/32))))continue;
   let color='#89979e';for(let y=111;y>=0;y--){const id=world.block(x,y,z);if(id){color=mapColors[id]||color;break;}}book.set((cx+dx)+','+(cz+dz),color);
  }
 }
 const ctx=map.getContext('2d');ctx.fillStyle='#202735';ctx.fillRect(0,0,144,144);
 for(let dz=-24;dz<=24;dz++)for(let dx=-24;dx<=24;dx++){const color=book.get((cx+dx)+','+(cz+dz));if(color){ctx.fillStyle=color;ctx.fillRect(72+dx*3,72+dz*3,3,3);}}
 ctx.fillStyle='#f3cbb7';ctx.beginPath();ctx.arc(73,73,2.2,0,Math.PI*2);ctx.fill();
}

let last=performance.now();
function frame(now){requestAnimationFrame(frame);const dt=Math.min((now-last)/1000,.05);last=now;world.update(player.x,player.z);if(world.loaded&&!session.started){wakeButton.disabled=false;wakeHint.textContent='Ready when you are.';}if(world.loaded&&session.started){if(!crossing.veil)player.update(dt);updateRitual(dt);updateCrossing(dt);if(!crossing.veil)mining.update(dt);attention.update();guide.update(dt);}updateSky(dt);updateHUD(dt);
 const rim=world.waking?0:crossing.manifest>0&&player.z<-96?0:THREE.MathUtils.smoothstep(islandRadius(player.x,player.z),.55,1);const held=player.mistStrength||0;scene.fog.density=.012-phase.value*.004+rim*.034+held*.075;
 scene.fog.color.copy(fogBase).lerp(new THREE.Color(0xffe5cf),held*.55);
 sky.position.copy(camera.position);renderer.render(scene,camera);}
requestAnimationFrame(frame);
// Read-only inspection seam for desktop smoke tests; never displayed in-world.
window.grin={session,seed,player,world,renderer,scene,camera,mining,attention,guide,phase,sky,ritual,hearth,aurora,updateRitual,updateSky,crossing,bridge,shore,updateCrossing,acceptGuideName,atlas,updateHUD};

// Stage Six: a read-only, session inventory. The island keeps breathing.
const inventory=document.createElement('section');inventory.id='inventory';inventory.className='soft-panel';inventory.hidden=true;
inventory.setAttribute('aria-label','Gathered materials');inventory.style.cssText='position:fixed;z-index:22;left:50%;top:50%;transform:translate(-50%,-50%);width:min(340px,85vw);padding:24px;color:#ead9c7;background:#292938f2;border:1px solid #99857c;border-radius:18px;font:16px Georgia,serif';
const inventoryTitle=document.createElement('h2');inventoryTitle.textContent='Gathered along the way';inventoryTitle.style.fontSize='20px';
const inventoryRows=document.createElement('div'),inventoryHint=document.createElement('p');inventoryRows.id='inventory-slots';inventoryRows.style.cssText='display:grid;grid-template-columns:repeat(auto-fit,minmax(68px,1fr));gap:8px;max-height:50vh;overflow-y:auto';inventoryHint.textContent='I or Esc to close · the world keeps moving';inventoryHint.style.fontSize='12px';inventory.append(inventoryTitle,inventoryRows,inventoryHint);document.body.append(inventory);
const swatches={earth:'#83a68c',stone:'#b78e72',wood:'#927866',dryfiber:'#c8b58b',sparkstone:'#d9ac78','teal flora bits':'#8abbb2','violet flora bits':'#b2a0bb',sand:'#c7a16a'};
let inventoryStamp='';
function refreshInventory(){const stamp=JSON.stringify(player.materials);if(stamp===inventoryStamp)return;inventoryStamp=stamp;inventoryRows.replaceChildren();for(const [name,count] of Object.entries(player.materials)){const row=document.createElement('div'),swatch=document.createElement('span'),amount=document.createElement('strong'),label=document.createElement('small');row.className='inventory-slot';row.title=name;row.setAttribute('aria-label',name+': '+count);row.style.cssText='display:flex;flex-direction:column;gap:6px;align-items:center;justify-content:center;min-width:0;min-height:86px;padding:8px 4px;background:#373344;border:1px solid #99857c55;border-radius:12px;text-align:center';swatch.style.cssText='width:22px;height:22px;border-radius:6px;background:'+(swatches[name]||'#b5a3a0');amount.textContent=count;amount.style.fontSize='16px';label.textContent=name;label.style.cssText='font-size:10px;color:#ccb8a8;overflow-wrap:anywhere';row.append(swatch,amount,label);inventoryRows.append(row);}if(!inventoryRows.childNodes.length)inventoryRows.textContent='Nothing gathered yet.';}
addEventListener('keydown',e=>{if(!session.started||e.target.matches?.('input,textarea,[contenteditable="true"]'))return;if(e.code==='KeyI'&&!e.repeat){e.preventDefault();inventory.hidden=!inventory.hidden;refreshInventory();}else if(e.code==='Escape')inventory.hidden=true;});
setInterval(()=>{if(!inventory.hidden)refreshInventory();},150);
window.grin.inventory={panel:inventory,refresh:refreshInventory};

// Stage Six: local memories, and a chat surface for a later connection.
const journal=document.createElement('section');journal.id='status-log';journal.className='soft-panel';journal.style.cssText='position:fixed;left:18px;bottom:18px;z-index:20;width:min(320px,40vw);padding:12px;color:#ead9c7;background:#292938df;border:1px solid #99857c77;border-radius:14px;font:13px/1.5 Georgia,serif;display:none';
const journalLines=document.createElement('div');journalLines.id='journal-lines';journalLines.style.cssText='max-height:180px;overflow-y:auto;pointer-events:auto';journalLines.setAttribute('role','log');journalLines.setAttribute('aria-label','Status and conversation');
const chatInput=document.createElement('input');chatInput.id='chat-input';chatInput.maxLength=280;chatInput.placeholder='Enter to speak · Esc to cancel';chatInput.setAttribute('aria-label','Message');chatInput.hidden=true;chatInput.style.cssText='box-sizing:border-box;width:100%;margin-top:8px;background:#373344;color:#f3d6bd;border:1px solid #99857c;border-radius:8px;padding:8px;font:inherit';journal.append(journalLines,chatInput);document.body.append(journal);
const journalEntries=[];
function logLine(text,sender=''){const row=document.createElement('div');row.textContent=(sender?sender+': ':'')+String(text);row.style.cssText='padding:3px 0;transition:opacity 10s';const bottom=journalLines.scrollHeight-journalLines.scrollTop-journalLines.clientHeight<24;journalLines.append(row);journalEntries.push({text:String(text),sender,time:Date.now()});while(journalEntries.length>100){journalEntries.shift();journalLines.firstChild.remove();}setTimeout(()=>{if(row.isConnected)row.style.opacity='.55';},30000);if(bottom)journalLines.scrollTop=journalLines.scrollHeight;}
player.materials=new Proxy(player.materials,{set(target,key,value){const before=target[key]||0;target[key]=value;if(value>before)logLine('Gathered '+(value-before)+' '+String(key)+'.');return true;}});
const updateLocalGuide=guide.update.bind(guide);let lastSpoken=null;
guide.update=function(dt){updateLocalGuide(dt);if(this.mode==='speaking'&&this.active&&this.active!==lastSpoken){lastSpoken=this.active;logLine(this.active.text,this.name||'Ember');}};
const conversation={enabled:false,send:null};
function finishTyping(){chatInput.value='';chatInput.hidden=true;chatInput.blur();player.keys.clear();player.jumpQueued=false;}
addEventListener('keydown',e=>{if(document.activeElement===chatInput){e.stopImmediatePropagation();player.keys.clear();player.jumpQueued=false;mining.cancel();if(e.code==='Enter'){e.preventDefault();const text=chatInput.value.trim();if(text&&conversation.send)conversation.send(text);finishTyping();}else if(e.code==='Escape'){e.preventDefault();finishTyping();}return;}if(e.code==='Enter'&&session.started&&conversation.enabled&&!e.target.matches?.('input,textarea,[contenteditable="true"]')){e.preventDefault();e.stopImmediatePropagation();inventory.hidden=true;player.keys.clear();player.jumpQueued=false;mining.cancel();document.exitPointerLock?.();chatInput.hidden=false;chatInput.focus();}},true);
setInterval(()=>{journal.style.display=session.started?'block':'none';},150);
window.grin.journal={entries:journalEntries,log:logLine,input:chatInput,conversation};

// Stage Six: PeerJS star topology. The host owns the session delta ledger.
import {voxelAt,wakingVoxel} from './generation.js';
import {materials as netMaterials,breakable as netBreakable} from './materials.js';
const net={mode:'solo',peer:null,host:null,links:new Map(),people:new Map(),deltas:new Map(),lit:false,code:'',ready:false,serial:0,pending:new Map(),localStream:null};
const netPanel=document.createElement('div');netPanel.id='multiplayer-options';netPanel.hidden=true;
const multiButton=document.createElement('button');multiButton.textContent='Multiplayer';multiButton.id='multiplayer';wakeButton.after(multiButton,netPanel);
function netButton(label,parent,fn){const b=document.createElement('button');b.textContent=label;b.style.cssText='padding:9px;margin:5px;border:1px solid #99857c;border-radius:9px;background:#393344;color:#f3d6bd;font:inherit';b.onclick=fn;parent.append(b);return b;}
multiButton.onclick=()=>{netPanel.hidden=!netPanel.hidden;};
const codeInput=document.createElement('input');codeInput.id='join-code';codeInput.maxLength=6;codeInput.placeholder='Six-letter island code';codeInput.setAttribute('aria-label','Island code');codeInput.style.cssText='width:170px;padding:9px;background:#292938;color:#f3d6bd;border:1px solid #99857c;border-radius:8px';
const netChip=document.createElement('div');netChip.id='session-code';netChip.className='soft-panel';netChip.style.cssText='display:none;position:fixed;z-index:24;top:18px;right:168px;width:154px;box-sizing:border-box;padding:9px;background:#292938df;color:#f3d6bd;border-radius:12px;font:13px Georgia,serif';document.body.append(netChip);
const netNotice=document.createElement('section');netNotice.id='network-notice';netNotice.hidden=true;netNotice.style.cssText='position:fixed;z-index:45;left:50%;top:35%;transform:translateX(-50%);max-width:340px;padding:24px;background:#292938f5;color:#f3d6bd;border:1px solid #99857c;border-radius:18px;font:16px Georgia,serif';const noticeText=document.createElement('p');netNotice.append(noticeText);netButton('Keep walking',netNotice,()=>{netNotice.hidden=true;});document.body.append(netNotice);
function notice(text){noticeText.textContent=text;netNotice.hidden=false;logLine(text);}
function ownState(){return {id:net.peer?.id||'',name:session.name||nameInput.value.trim().slice(0,16)||'Wanderer',x:player.x,y:player.y,z:player.z,yaw:player.yaw,realm:world.waking?'waking':'island'};}
function validState(p){return p&&[p.x,p.y,p.z,p.yaw].every(Number.isFinite)&&Math.abs(p.x)<100000&&Math.abs(p.z)<100000&&Math.abs(p.y)<1000&&['island','waking'].includes(p.realm);}
function send(c,m){if(c?.open)c.send(m);}
function broadcast(m){for(const c of net.links.values())send(c,m);}
function deltaKey(d){return [d.realm,d.x,d.y,d.z].join(':');}
const rawRemove=world.remove.bind(world),rawInstall=world.install.bind(world),rawLight=ritual.light.bind(ritual);
function applyDelta(d){net.deltas.set(deltaKey(d),d);if((world.waking?'waking':'island')===d.realm)rawRemove(d.x,d.y,d.z);}
world.install=function(data){rawInstall(data);if(net.mode==='solo')return;for(const d of net.deltas.values())if(d.realm===(this.waking?'waking':'island')&&Math.floor(d.x/32)===data.cx&&Math.floor(d.z/32)===data.cz)rawRemove(d.x,d.y,d.z);};
function grant(id){const name=netMaterials[id]?.yield;if(!name)return;player.materials[name]=(player.materials[name]||0)+1;if(id===1)player.materials.dryfiber=(player.materials.dryfiber||0)+1;}
function approveBreak(d,who){if(!d||![d.x,d.y,d.z].every(Number.isInteger)||d.y<2||d.y>=112||!['island','waking'].includes(d.realm)||net.deltas.has(deltaKey(d)))return 0;const p=who===net.peer.id?ownState():net.people.get(who);if(!p||p.realm!==d.realm||Math.hypot(p.x-d.x,p.y-d.y,p.z-d.z)>7)return 0;const id=(d.realm==='waking'?wakingVoxel:voxelAt)(d.x,d.y,d.z,seed);if(!netBreakable(id))return 0;const delta={realm:d.realm,x:d.x,y:d.y,z:d.z};applyDelta(delta);broadcast({type:'break',delta});return id;}
world.remove=function(x,y,z){if(net.mode==='solo')return rawRemove(x,y,z);const d={x,y,z,realm:world.waking?'waking':'island'};if(net.mode==='host')return approveBreak(d,net.peer.id);if(!net.ready)return 0;const key=deltaKey(d);if(!net.pending.has(key)){const request=++net.serial;net.pending.set(key,request);send(net.host,{type:'break-request',delta:d,request});setTimeout(()=>net.pending.delete(key),4000);}return 0;};
function sharedDawn(){if(ritual.lit)return;net.lit=true;ritual.lit=true;ritual.start=phase.value;ritual.elapsed=0;mining.cancel();startCrackle();guide.lessons.deferred.delete('cold-circle');guide.lessons.deferred.delete('enough-fire');guide.queue=guide.queue.filter(l=>!['cold-circle','enough-fire'].includes(l.id));if(['cold-circle','enough-fire'].includes(guide.active?.id)){guide.active=null;guideLine.classList.remove('speaking');}logLine('The hearth is warm. Dawn has found us all.');}
ritual.light=function(){if(net.mode==='solo')return rawLight();if(this.lit||!this.enough()||!net.ready)return false;if(net.mode==='host'){if(rawLight()){net.lit=true;broadcast({type:'dawn'});return true;}return false;}if(net.firePending)return false;net.firePending=true;send(net.host,{type:'fire-request'});setTimeout(()=>{net.firePending=false;},4000);return false;};
function relayChat(text,id){text=String(text||'').trim().slice(0,280);const p=id===net.peer.id?ownState():net.people.get(id);if(!text||!p)return;const m={type:'chat',name:p.name,text};logLine(m.text,m.name);broadcast(m);}
conversation.send=text=>{if(net.mode==='host')relayChat(text,net.peer.id);else if(net.ready)send(net.host,{type:'chat-request',text});else logLine(text,session.name||'Wanderer');};
function removePerson(id){net.people.delete(id);window.grin.avatars?.remove(id);}
function alone(text){net.ready=false;net.mode='solo';conversation.enabled=false;netChip.firstChild.textContent='Walking alone';for(const id of net.people.keys())removePerson(id);notice(text);}
function hostMessage(c,m){if(!m||typeof m!=='object')return;if(m.type==='hello'){const p=m.state;if(!validState(p))return;c.psName=String(p.name||'Wanderer').slice(0,16);net.people.set(c.peer,{...p,id:c.peer,name:c.psName});send(c,{type:'welcome',seed,players:[ownState(),...net.people.values()],deltas:[...net.deltas.values()],lit:net.lit});logLine(c.psName+' has found the island.');window.grin.voice?.call(c.peer);return;}if(!c.psName)return;if(m.type==='state'&&validState(m.state)){const p={...m.state,id:c.peer,name:c.psName};net.people.set(c.peer,p);broadcast({type:'state',state:p});}else if(m.type==='chat-request')relayChat(m.text,c.peer);else if(m.type==='break-request'){const id=approveBreak(m.delta,c.peer);send(c,{type:'break-result',key:deltaKey(m.delta||{}),request:m.request,id});}else if(m.type==='fire-request'){if(!net.lit){sharedDawn();broadcast({type:'dawn'});send(c,{type:'fire-cost'});}else send(c,{type:'dawn'});}}
function guestMessage(m){if(!m||typeof m!=='object')return;if(m.type==='welcome'){if(m.seed!==73021){alone('These islands do not share the same dream.');return;}for(const p of m.players||[])if(p.id!==net.peer.id&&validState(p))net.people.set(p.id,p);for(const d of m.deltas||[])applyDelta(d);if(m.lit)sharedDawn();net.ready=true;boot();}else if(m.type==='state'&&m.state.id!==net.peer.id&&validState(m.state))net.people.set(m.state.id,m.state);else if(m.type==='chat')logLine(String(m.text).slice(0,280),String(m.name).slice(0,16));else if(m.type==='break')applyDelta(m.delta);else if(m.type==='break-result'){if(net.pending.get(m.key)===m.request){net.pending.delete(m.key);if(m.id)grant(m.id);}}else if(m.type==='dawn')sharedDawn();else if(m.type==='fire-cost'){player.materials.sparkstone=Math.max(0,(player.materials.sparkstone||0)-3);player.materials.dryfiber=Math.max(0,(player.materials.dryfiber||0)-5);}else if(m.type==='left')removePerson(m.id);else if(m.type==='full'){alone('This island already holds four lights. Try another code.');net.host?.close();}}
let peerLibrary;
function loadPeer(){if(window.Peer)return Promise.resolve();if(peerLibrary)return peerLibrary;peerLibrary=new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='https://cdn.jsdelivr.net/npm/peerjs@1.5.5/dist/peerjs.min.js';script.onload=resolve;script.onerror=()=>reject(new Error('broker library unavailable'));document.head.append(script);});return peerLibrary;}
function boot(){if(!world.loaded){setTimeout(boot,100);return;}conversation.enabled=true;wakeButton.click();netChip.style.display='block';netChip.firstChild.textContent=net.mode==='host'?'Island · '+net.code:'Together · '+net.code;}
netChip.append(document.createTextNode(''));
const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function friendlyCode(){const a=crypto.getRandomValues(new Uint8Array(6));return Array.from(a,n=>alphabet[n%alphabet.length]).join('');}
async function enterMultiplayer(mode){if(net.peer||session.started)return;const code=mode==='host'?friendlyCode():codeInput.value.trim().toUpperCase();if(!/^[A-HJ-NP-Z2-9]{6}$/.test(code)){notice('That code feels a little lost. Six letters or numbers, without I, O, 0 or 1.');return;}net.mode=mode;net.code=code;window.grin.voice?.request();try{await loadPeer();net.peer=mode==='host'?new Peer('project-survival-six-'+code):new Peer();net.peer.on('error',e=>{if(session.started)notice('The thread is quiet for a moment. You can keep walking.');else{net.peer?.destroy();net.peer=null;net.mode='solo';notice(e.type==='unavailable-id'?'That island code is taken. Host again for a fresh one.':'We could not find that island. Check the code and try again.');}});net.peer.on('disconnected',()=>notice('The signal has wandered. Existing friends may still be here.'));net.peer.on('open',()=>{if(mode==='host'){net.ready=true;boot();}else{const c=net.peer.connect('project-survival-six-'+code,{reliable:true});net.host=c;c.on('open',()=>send(c,{type:'hello',state:ownState()}));c.on('data',guestMessage);c.on('close',()=>alone('The host has gone beyond the mist. Your journey can continue alone.'));c.on('error',()=>alone('The thread has loosened. Your journey can continue alone.'));setTimeout(()=>{if(!net.ready&&!session.started){net.peer?.destroy();net.peer=null;net.mode='solo';notice('No light answered that code. Check it and try again.');}},15000);}});net.peer.on('connection',c=>{if(net.mode!=='host')return c.close();if(net.links.size>=3){c.on('open',()=>{send(c,{type:'full'});setTimeout(()=>c.close(),250);});return;}net.links.set(c.peer,c);c.on('data',m=>hostMessage(c,m));c.on('close',()=>{net.links.delete(c.peer);removePerson(c.peer);broadcast({type:'left',id:c.peer});logLine('A friend has stepped beyond the mist.');});c.on('error',()=>c.close());});net.peer.on('call',call=>window.grin.voice?.answer(call));}catch{net.mode='solo';notice('The meeting place is resting. Wake alone, or try again shortly.');}}
netButton('Host',netPanel,()=>enterMultiplayer('host'));netPanel.append(codeInput);netButton('Join',netPanel,()=>enterMultiplayer('guest'));
setInterval(()=>{if(!net.ready||!session.started)return;const state=ownState();if(net.mode==='host')broadcast({type:'state',state});else send(net.host,{type:'state',state});},1000/15);
window.grin.net=net;

// First-pass matte friends. Spirits are deliberately absent from this protocol.
const avatars=new Map();
function beveledVoxel(w,h,d,color){const shape=new THREE.Shape();shape.moveTo(-w/2,-h/2);shape.lineTo(w/2,-h/2);shape.lineTo(w/2,h/2);shape.lineTo(-w/2,h/2);shape.closePath();const geometry=new THREE.ExtrudeGeometry(shape,{depth:d,bevelEnabled:true,bevelSegments:1,steps:1,bevelSize:.035,bevelThickness:.035});geometry.translate(0,0,-d/2);return new THREE.Mesh(geometry,new THREE.MeshLambertMaterial({color}));}
function makeAvatar(p){const body=new THREE.Group(),torso=beveledVoxel(.44,.58,.24,0x8aada0),head=beveledVoxel(.32,.32,.30,0xd7b39d);torso.position.y=1.03;head.position.y=1.53;body.add(torso,head);const limbs=[];for(const side of [-1,1]){const leg=beveledVoxel(.15,.56,.17,0x77768b);leg.position.set(side*.13,.33,0);const arm=beveledVoxel(.14,.52,.17,0xb3a2b3);arm.position.set(side*.34,1.03,0);body.add(leg,arm);limbs.push(leg,arm);}const name=document.createElement('div');name.className='remote-nameplate';name.style.cssText='position:fixed;z-index:10;pointer-events:none;color:#f3cbb7;font:13px Georgia,serif;letter-spacing:.04em;text-shadow:0 1px 8px #352533;transform:translate(-50%,-100%)';name.textContent=p.name;document.body.append(name);body.position.set(p.x,p.y,p.z);scene.add(body);return {body,limbs,name,clock:0};}
function removeAvatar(id){const a=avatars.get(id);if(!a)return;scene.remove(a.body);a.body.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});a.name.remove();avatars.delete(id);}
let presenceLast=performance.now();
function animateFriends(now){requestAnimationFrame(animateFriends);const dt=Math.min(.05,(now-presenceLast)/1000);presenceLast=now;for(const [id,p] of net.people){if(!validState(p))continue;let a=avatars.get(id);if(!a){a=makeAvatar(p);avatars.set(id,a);}const same=session.started&&!crossing.veil&&p.realm===(world.waking?'waking':'island');a.body.visible=same;a.name.style.display='none';if(!same)continue;const moving=Math.hypot(a.body.position.x-p.x,a.body.position.z-p.z)>.035;a.clock+=dt*(moving?9:0);const t=1-Math.exp(-14*dt);a.body.position.lerp(new THREE.Vector3(p.x,p.y,p.z),t);const delta=Math.atan2(Math.sin(p.yaw-a.body.rotation.y),Math.cos(p.yaw-a.body.rotation.y));a.body.rotation.y+=delta*t;a.limbs.forEach((limb,i)=>{limb.rotation.x=moving?Math.sin(a.clock+(i<2?0:Math.PI))*.25:0;});a.body.position.y+=moving?Math.sin(a.clock*2)*.015:0;a.name.textContent=p.name;const point=a.body.position.clone().add(new THREE.Vector3(0,1.95,0)).project(camera);if(point.z>-1&&point.z<1&&Math.abs(point.x)<.98&&Math.abs(point.y)<.98){a.name.style.display='block';a.name.style.left=(point.x*.5+.5)*innerWidth+'px';a.name.style.top=(-point.y*.5+.5)*innerHeight+'px';}}}
requestAnimationFrame(animateFriends);window.grin.avatars={items:avatars,remove:removeAvatar};
// Host-guest media calls; host mixes other guests into each outgoing stream.
const voice={promise:null,context:null,streams:new Map(),calls:new Map(),mixes:new Map(),audio:new Map(),muted:false};
voice.request=function(){if(this.promise)return this.promise;this.promise=(async()=>{try{net.localStream=await navigator.mediaDevices.getUserMedia({audio:true,video:false});}catch{logLine('Your microphone is resting. You can still listen and type.');}try{this.context=new (window.AudioContext||window.webkitAudioContext)();await this.context.resume();}catch{}return net.localStream;})();return this.promise;};
voice.mix=function(id){if(!this.context)return net.localStream;let mix=this.mixes.get(id);if(!mix){mix={destination:this.context.createMediaStreamDestination(),sources:[]};this.mixes.set(id,mix);}for(const source of mix.sources)source.disconnect();mix.sources=[];for(const [who,stream] of [['self',net.localStream],...this.streams]){if(!stream||who===id)continue;const source=this.context.createMediaStreamSource(stream);source.connect(mix.destination);mix.sources.push(source);}return mix.destination.stream;};
voice.refresh=function(){for(const id of this.mixes.keys())this.mix(id);};
voice.attach=function(call){this.calls.set(call.peer,call);call.on('stream',stream=>{this.streams.set(call.peer,stream);let audio=this.audio.get(call.peer);if(!audio){audio=document.createElement('audio');audio.autoplay=true;audio.setAttribute('playsinline','');document.body.append(audio);this.audio.set(call.peer,audio);}audio.srcObject=stream;audio.play().catch(()=>logLine('Tap Hear voices to let voices through.'));this.refresh();});call.on('close',()=>{this.streams.delete(call.peer);this.calls.delete(call.peer);this.audio.get(call.peer)?.remove();this.audio.delete(call.peer);this.refresh();});call.on('error',()=>logLine('A voice thread is quiet. Text chat is still here.'));};
voice.call=async function(id){await this.request();if(net.mode!=='host'||this.calls.has(id))return;const stream=this.mix(id);if(stream)this.attach(net.peer.call(id,stream));};
voice.answer=async function(call){if(net.mode!=='guest'||call.peer!==net.host?.peer){call.close();return;}await this.request();const stream=net.localStream||this.context?.createMediaStreamDestination().stream;if(stream){call.answer(stream);this.attach(call);}else call.close();};
const mute=netButton('Mic on',netChip,()=>{voice.muted=!voice.muted;for(const t of net.localStream?.getAudioTracks()||[])t.enabled=!voice.muted;mute.textContent=voice.muted?'Mic muted':'Mic on';mute.setAttribute('aria-pressed',String(voice.muted));});mute.id='voice-mute';mute.setAttribute('aria-label','Toggle microphone mute');
netButton('Hear voices',netChip,()=>{voice.context?.resume().catch(()=>{});for(const a of voice.audio.values())a.play().catch(()=>{});});window.grin.voice=voice;

// Host accounts for guest yields and validates the shared ritual, not a client claim.
const guestBags=new Map(),baseApproveBreak=approveBreak,baseHostMessage=hostMessage;
approveBreak=function(d,who){const id=baseApproveBreak(d,who);if(id&&who!==net.peer.id){const bag=guestBags.get(who)||{};const name=netMaterials[id].yield;bag[name]=(bag[name]||0)+1;if(id===1)bag.dryfiber=(bag.dryfiber||0)+1;guestBags.set(who,bag);}return id;};
hostMessage=function(c,m){if(m?.type==='fire-request'){const p=net.people.get(c.peer),bag=guestBags.get(c.peer);if(net.lit){send(c,{type:'dawn'});return;}if(!c.psName||!p||p.realm!=='island'||Math.hypot(p.x-ritual.x,p.z-ritual.z)>5||!bag||(bag.sparkstone||0)<3||(bag.dryfiber||0)<5)return;bag.sparkstone-=3;bag.dryfiber-=5;}baseHostMessage(c,m);};
// Keep accepted edits when a guest continues alone, including later streamed chunks.
world.install=function(data){rawInstall(data);for(const d of net.deltas.values())if(d.realm===(this.waking?'waking':'island')&&Math.floor(d.x/32)===data.cx&&Math.floor(d.z/32)===data.cz)rawRemove(d.x,d.y,d.z);};
wakeButton.addEventListener('click',e=>{if(net.mode!=='solo'&&!net.ready){e.preventDefault();e.stopImmediatePropagation();notice('The thread is still finding your friends. Wait a moment, or choose Wake alone.');}},true);
netButton('Wake alone',netPanel,()=>{net.peer?.destroy();net.peer=null;net.host=null;net.mode='solo';net.ready=false;netNotice.hidden=true;for(const track of net.localStream?.getTracks()||[])track.stop();wakeButton.click();});
const voiceRequest=voice.request.bind(voice);voice.request=async function(){const stream=await voiceRequest();mute.textContent=stream?(this.muted?'Mic muted':'Mic on'):'No microphone';return stream;};

// A failed ICE channel must not hold a seat or strand a guest forever.
setInterval(()=>{if(net.mode==='host'){for(const c of net.links.values()){const state=c.peerConnection?.connectionState;if(state==='failed'||state==='closed'){c.close();continue;}if(!c.psName){c.psWaiting=(c.psWaiting||0)+1;if(c.psWaiting>=20)c.close();}}}else if(net.mode==='guest'&&net.host){const state=net.host.peerConnection?.connectionState;if(state==='failed'||state==='closed')net.host.close();}},1000);

// Stage Eight — Relic, 2026-11-22. Context tools; no equipment or durability.
const recipes=[{result:'wooden pickaxe',cost:{wood:3}},{result:'wooden axe',cost:{wood:3}},{result:'wooden shovel',cost:{wood:3}},{result:'wooden hoe',cost:{wood:3}}];
let craftedCount=0;
const crafting=document.createElement('section');crafting.id='crafting';crafting.hidden=true;crafting.setAttribute('aria-label','Make by hand');crafting.style.cssText='position:fixed;z-index:25;left:50%;top:50%;transform:translate(-50%,-50%);width:min(420px,85vw);max-height:75vh;overflow:auto;padding:24px;background:#292938f5;color:#ead9c7;border:1px solid #99857c;border-radius:18px;font:16px Georgia,serif';document.body.append(crafting);
function canCraft(r){return Object.entries(r.cost).every(([k,n])=>(player.materials[k]||0)>=n);}
function craftItem(name){const r=recipes.find(r=>r.result===name);if(!world.waking||!r||!canCraft(r))return false;for(const [k,n] of Object.entries(r.cost))player.materials[k]-=n;player.materials[name]=(player.materials[name]||0)+1;craftedCount++;logLine('A little patience, an edge, a beginning. You made a '+name+'.');refreshCrafting();refreshInventory();return true;}
function refreshCrafting(){crafting.replaceChildren();const title=document.createElement('h2');title.textContent='Made by your hands';crafting.append(title);for(const r of recipes){const b=document.createElement('button');b.dataset.recipe=r.result;b.textContent=r.result+' · '+Object.entries(r.cost).map(([k,n])=>n+' '+k+' ('+(player.materials[k]||0)+')').join(' + ');b.disabled=!canCraft(r);b.style.cssText='display:block;width:100%;text-align:left;padding:16px;margin:10px 0;background:#373344;color:#ead9c7;border:1px solid #99857c;border-radius:12px;font:inherit;opacity:'+(b.disabled?'.4':'1');b.onclick=()=>craftItem(r.result);crafting.append(b);}const close=document.createElement('button');close.textContent='Close · C / Esc';close.onclick=()=>crafting.hidden=true;crafting.append(close);}
addEventListener('keydown',e=>{if(!session.started||e.target.matches?.('input,textarea,[contenteditable="true"]'))return;if(e.code==='KeyC'&&!e.repeat&&world.waking){e.preventDefault();crafting.hidden=!crafting.hidden;inventory.hidden=true;mining.cancel();player.keys.clear();document.exitPointerLock?.();refreshCrafting();}else if(e.code==='Escape'||e.code==='KeyI')crafting.hidden=true;});
setInterval(()=>{if(!crafting.hidden)refreshCrafting();},250);
window.grin.crafting={recipes,canCraft,craft:craftItem,refresh:refreshCrafting,panel:crafting,get count(){return craftedCount;}};

// Dawn lesson waits for an actual completed recipe, not a key press.
const craftingLesson={stage:'waiting'};
const beforeCraftLessons=guide.updateLessons.bind(guide);
guide.updateLessons=function(){beforeCraftLessons();const l=craftingLesson;if(!world.waking||!session.started||!player.awake||l.stage==='done')return;if(craftedCount>0){if(l.stage==='waiting'){l.stage='done';return;}this.say('craft-ack',"There. Made by your own hands now. The world will notice.");l.stage='ack';}else if(l.stage==='waiting'&&!this.active&&!this.queue.length&&this.cooldown===0){this.say('craft-teach',"The island gave freely. Beyond the bridge, some things ask for more than hands. Let me show you how to make what you'll need.");l.stage='teaching';}if(l.stage==='teaching'&&this.completed.has('craft-teach')){this.say('craft-controls','Hold a tree to gather wood. Three pieces become a wooden tool. Press C to shape one.');l.stage='crafting';}if(l.stage==='ack'&&this.completed.has('craft-ack'))l.stage='done';};
window.grin.crafting.lesson=craftingLesson;

// Session-only crops: deliberately local to each player; soil is shared below.
import {targetBlock} from './mining.js';
import {biomeAt} from './generation.js';
const crops=new Map(),wildHarvested=new Set();let farmClock=0;
const cropKey=(x,y,z)=>[x,y,z].join(':');
function cropStage(p){return Math.min(3,Math.floor((farmClock-p.born)/60));}
function createCrop(x,y,z,wild=false){const key=cropKey(x,y,z);if(crops.has(key))return crops.get(key);const body=new THREE.Group();scene.add(body);const p={key,x,y,z,wild,born:wild?farmClock-180:farmClock,body,stage:-1};crops.set(key,p);drawCrop(p);return p;}
function drawCrop(p){const stage=cropStage(p);if(stage===p.stage)return;p.stage=stage;while(p.body.children.length){const c=p.body.children[0];p.body.remove(c);c.geometry.dispose();c.material.dispose();}for(let i=0;i<3;i++){const h=.10+stage*.15,stem=new THREE.Mesh(new THREE.BoxGeometry(.08,h,.10),new THREE.MeshBasicMaterial({color:stage===3?0xc9ae76:0x7eaa83}));stem.position.set((i-1)*.22,h/2,((i%2)-.5)*.22);p.body.add(stem);if(stage===3){const fruit=new THREE.Mesh(new THREE.IcosahedronGeometry(.14,0),new THREE.MeshBasicMaterial({color:0xe0b384}));fruit.position.copy(stem.position);fruit.position.y=h;p.body.add(fruit);}}p.body.position.set(p.x+.5,p.y+1.015,p.z+.5);}
function updateCrops(dt){farmClock+=dt;if(!world.waking){for(const p of crops.values())p.body.visible=false;return;}for(let a=Math.floor(player.x/12)-2;a<=Math.floor(player.x/12)+2;a++)for(let b=Math.floor(player.z/12)-2;b<=Math.floor(player.z/12)+2;b++){const x=a*12+5,z=b*12+5,y=wakingHeight(x,z,seed),key=cropKey(x,y,z),biome=biomeAt(x,z,seed);if(hash(a,b,seed+301)>(biome==='Meadow'?.65:biome==='Forest'?.14:0)||wildHarvested.has(key)||![1,11].includes(world.block(x,y,z))||world.block(x,y+1,z))continue;createCrop(x,y,z,true);}for(const [key,p] of crops){p.body.visible=world.waking&&Math.hypot(p.x-player.x,p.z-player.z)<65&&!!world.block(p.x,p.y,p.z);if(!world.block(p.x,p.y,p.z)&&world.chunks.has(world.key(Math.floor(p.x/32),Math.floor(p.z/32)))){scene.remove(p.body);crops.delete(key);continue;}drawCrop(p);}}
function harvestCrop(p){if(!p||cropStage(p)<3||!world.waking||Math.hypot(player.x-p.x,player.y-p.y,player.z-p.z)>6)return false;player.materials['sunmeadow grain']=(player.materials['sunmeadow grain']||0)+1;player.materials['sunmeadow seeds']=(player.materials['sunmeadow seeds']||0)+2;if(p.wild)wildHarvested.add(p.key);scene.remove(p.body);for(const c of p.body.children){c.geometry.dispose();c.material.dispose();}crops.delete(p.key);logLine('Sunmeadow grain, and two small promises for another day.');refreshInventory();return true;}
function farmInteract(t){if(!world.waking||!t||Math.hypot(player.x-t.x,player.y-t.y,player.z-t.z)>6)return false;const key=cropKey(t.x,t.y,t.z),p=crops.get(key);if(p)return harvestCrop(p);if(world.block(t.x,t.y,t.z)===17){if((player.materials['sunmeadow seeds']||0)<1)return false;player.materials['sunmeadow seeds']--;createCrop(t.x,t.y,t.z);logLine('A seed settles into the dark rows.');return true;}if(player.materials['wooden hoe']&&[1,11,14,15].includes(t.id)){return tillSoil(t.x,t.y,t.z);}return false;}
function tillSoil(x,y,z){const ok=world.till(x,y,z);if(ok)logLine('The earth opens into quiet rows.');return ok;}
addEventListener('keydown',e=>{if(e.code!=='KeyE'||e.repeat||!session.started||!world.waking||!crafting.hidden||!inventory.hidden||e.target.matches?.('input,textarea,[contenteditable="true"]'))return;farmInteract(targetBlock(world,camera.position,camera.getWorldDirection(new THREE.Vector3())));});
let farmLast=performance.now();setInterval(()=>{const now=performance.now(),dt=Math.min(1,(now-farmLast)/1000);farmLast=now;if(session.started)updateCrops(dt);},200);
Object.assign(swatches,{'wooden axe':'#ad8966','wooden pickaxe':'#ad8966','wooden shovel':'#ad8966','wooden hoe':'#ad8966','sunmeadow grain':'#d5b278','sunmeadow seeds':'#91a97a'});
window.grin.farming={crops,create:createCrop,update:updateCrops,interact:farmInteract,harvest:harvestCrop,stage:cropStage,get clock(){return farmClock;}};
