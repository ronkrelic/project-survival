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
const player=new Player(camera,renderer.domElement,world,{x:.5,y:terrainHeight(0,0,seed)+1,z:.5});
const mining=new Mining(scene,camera,world,player,renderer.domElement);

// Stage Two: session-only attention, never a clock or a save.
const attention={score:0,counts:{},regions:new Set(),distance:0,last:{x:player.x,z:player.z},gathered:0,monolith:false,
 award(type,weight){const n=this.counts[type]||0;this.counts[type]=n+1;this.score=Math.min(100,this.score+weight/(1+n*.18));},
 update(){const d=Math.hypot(player.x-this.last.x,player.z-this.last.z);this.last={x:player.x,z:player.z};if(!player.awake||player.mistCatch)return;
 if(d<1)this.distance+=d;if(this.distance>=4){this.distance-=4;this.award('steps',3);}
 const region=Math.floor(player.x/12)+','+Math.floor(player.z/12);if(!this.regions.has(region)){this.regions.add(region);this.award('ground',4);}
 const total=Object.values(player.materials).reduce((a,b)=>a+b,0);if(total>this.gathered){for(let i=this.gathered;i<total;i++)this.award('gather',7);this.gathered=total;guide.delight=2;}
 if(!this.monolith&&Math.hypot(player.x-12,player.z+62)<7){this.monolith=true;this.award('monolith',20);}
 }};
const guide={route:[[.5,-6],[5,-10],[-8,-18],[-22,-24],[0,-40],[18,-48],[12,-56]],index:0,mode:'waiting',clock:0,pause:0,delight:0,circle:0,settled:false};
guide.body=new THREE.Group();guide.body.position.set(.5,terrainHeight(0,-6)+1.05,-6);
const ember=new THREE.Mesh(new THREE.IcosahedronGeometry(.16,2),new THREE.MeshBasicMaterial({color:0xffc77e}));
const halo=new THREE.Mesh(new THREE.SphereGeometry(.46,12,8),new THREE.MeshBasicMaterial({color:0xffad63,transparent:true,opacity:.12,depthWrite:false}));guide.body.add(ember,halo);
guide.light=new THREE.PointLight(0xffbd7c,5,22,1.4);guide.body.add(guide.light);scene.add(guide.body);
guide.update=function(dt){this.clock+=dt;this.delight=Math.max(0,this.delight-dt);this.pause=Math.max(0,this.pause-dt);
 const p=this.body.position,dist=Math.hypot(player.x-p.x,player.z-p.z);this.body.lookAt(player.x,p.y,player.z);
 if(!this.moved&&attention.distance>.5){this.moved=true;this.delight=1;}
 if(this.settled){this.mode='settled';}
 else if(this.mode==='circling'){this.circle=Math.min(Math.PI*2,this.circle+dt*.65);p.x=12+5*Math.sin(this.circle);p.z=-62+5*Math.cos(this.circle);if(this.circle===Math.PI*2)this.settled=true;}
 else if(this.index===this.route.length-1&&Math.hypot(p.x-12,p.z+56)<.3&&dist<7){this.mode='circling';}
 else if(player.awake&&dist<7&&this.pause===0){this.mode='leading';const [x,z]=this.route[this.index],dx=x-p.x,dz=z-p.z,d=Math.hypot(dx,dz);
 if(d<.25){if(this.index<this.route.length-1)this.index++;this.pause=1.8;this.mode='waiting';}
 else{p.x+=dx/d*Math.min(d,dt*2.1);p.z+=dz/d*Math.min(d,dt*2.1);}}
 else{this.mode='waiting';
 // On a detour, meet the player's heading toward the next landmark, never the rim.
 if(player.awake&&dist>12&&dist<55){const [x,z]=this.route[this.index],dx=x-player.x,dz=z-player.z,d=Math.hypot(dx,dz)||1;const tx=player.x+dx/d*6,tz=player.z+dz/d*6;
 if(islandRadius(tx,tz)<.70){const len=Math.hypot(tx-p.x,tz-p.z)||1;p.x+=(tx-p.x)/len*Math.min(len,dt*1.5);p.z+=(tz-p.z)/len*Math.min(len,dt*1.5);}}}
 const ground=terrainHeight(Math.floor(p.x),Math.floor(p.z))+1.25;p.y=THREE.MathUtils.damp(p.y,ground,5,dt)+Math.sin(this.clock*2.2)*dt*.12;
 ember.scale.set(1+Math.sin(this.clock*2)*.08,1.25,1);halo.scale.setScalar(1+Math.sin(this.clock*2)*.1+this.delight*.12);this.light.intensity=5+Math.sin(this.clock*2)*.5+this.delight*2;
};
const phase={value:0,name:'night',ceiling:.72};
const nightFog=new THREE.Color(0x171c38),violetFog=new THREE.Color(0x4b3c68),dawnFog=new THREE.Color(0xeab59f),fogBase=new THREE.Color();
sky.material.uniforms.progress={value:0};
sky.material.fragmentShader=sky.material.fragmentShader.replace('varying vec3 ray;','uniform float progress;varying vec3 ray;').replace('gl_FragColor=vec4(c,1.);','vec3 night=mix(vec3(.025,.031,.075),vec3(.009,.013,.038),t);vec3 violet=mix(vec3(.29,.18,.36),vec3(.055,.045,.14),t);vec3 early=mix(night,violet,smoothstep(0.,.38,progress));c=mix(early,c,smoothstep(.38,1.,progress));gl_FragColor=vec4(c,1.);');
// Preserve the baked matte voxel shading and luminous flora, but tint terrain at night.
world.material.onBeforeCompile=shader=>{shader.uniforms.phaseLight={value:0};shader.uniforms.emberPosition={value:guide.body.position};world.material.userData.shader=shader;
 shader.vertexShader='varying vec3 islandPosition;\n'+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nislandPosition=(modelMatrix*vec4(position,1.)).xyz;');
 shader.fragmentShader='uniform float phaseLight;uniform vec3 emberPosition;varying vec3 islandPosition;\n'+shader.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\nfloat flora=step(.65,max(diffuseColor.g,diffuseColor.b))*step(diffuseColor.r,.7);float warmth=pow(max(0.,1.-distance(islandPosition,emberPosition)/18.),2.);vec3 ambient=mix(vec3(.14,.17,.30),vec3(.78,.70,.79),phaseLight);diffuseColor.rgb*=mix(ambient+warmth*vec3(1.15,.65,.24),vec3(.9),flora);');};
function updateSky(dt){phase.value=THREE.MathUtils.damp(phase.value,attention.score/100*phase.ceiling,.35,dt);phase.value=Math.min(phase.ceiling,phase.value);phase.name=phase.value<.22?'night':phase.value<.56?'violet pre-dawn':'rosy cusp';sky.material.uniforms.progress.value=phase.value;
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
let last=performance.now();
function frame(now){requestAnimationFrame(frame);const dt=Math.min((now-last)/1000,.05);last=now;world.update(player.x,player.z);if(world.loaded){renderer.domElement.style.visibility="visible";player.update(dt);mining.update(dt);attention.update();guide.update(dt);}updateSky(dt);
 const rim=THREE.MathUtils.smoothstep(islandRadius(player.x,player.z),.55,1);const held=player.mistStrength||0;scene.fog.density=.012-phase.value*.004+rim*.034+held*.075;
 scene.fog.color.copy(fogBase).lerp(new THREE.Color(0xffe5cf),held*.55);
 sky.position.copy(camera.position);renderer.render(scene,camera);}
requestAnimationFrame(frame);
// Read-only inspection seam for desktop smoke tests; never displayed in-world.
window.grin={seed,player,world,renderer,scene,camera,mining,attention,guide,phase,sky};
