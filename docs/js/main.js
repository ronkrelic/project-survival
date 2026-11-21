import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import {World} from './world.js';
import {Player} from './player.js';
import {terrainHeight,hash,islandRadius} from './generation.js';
import './deltas.js';
const query=new URLSearchParams(location.search).get('seed');
const requestedSeed=query!==null&&/^-?\d+$/.test(query)?Number(query)|0:73021;
const seed=73021; // Handmade layout and decoration ignore requestedSeed.
const scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0xeab59f,.009);
const camera=new THREE.PerspectiveCamera(72,innerWidth/innerHeight,.08,950);
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(innerWidth,innerHeight);
renderer.outputColorSpace=THREE.SRGBColorSpace;document.body.appendChild(renderer.domElement);renderer.domElement.style.visibility="hidden";
document.body.style.background="#eab59f";
// Camera-centred dome, peach horizon to indigo zenith, with a broad low sun.
const sky=new THREE.Mesh(new THREE.SphereGeometry(800,32,20),new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,uniforms:{},vertexShader:`varying vec3 ray;void main(){ray=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`varying vec3 ray;void main(){vec3 d=normalize(ray);float t=pow(max(d.y,0.),.48);vec3 c=mix(vec3(.92,.65,.54),vec3(.15,.18,.34),t);vec3 sun=normalize(vec3(.26,.075,-1.));float a=max(dot(d,sun),0.);c+=vec3(.18,.09,.035)*pow(a,60.)+vec3(.25,.16,.07)*pow(a,1600.);c=mix(vec3(.92,.71,.62),c,smoothstep(-.10,.16,d.y));gl_FragColor=vec4(c,1.);}` }));
scene.add(sky);
const world=new World(scene,seed);
const player=new Player(camera,renderer.domElement,world,{x:.5,y:terrainHeight(0,0,seed)+1,z:.5});
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
function frame(now){requestAnimationFrame(frame);const dt=Math.min((now-last)/1000,.05);last=now;world.update(player.x,player.z);if(world.loaded){renderer.domElement.style.visibility="visible";player.update(dt);}
 const rim=THREE.MathUtils.smoothstep(islandRadius(player.x,player.z),.55,1);scene.fog.density=.009+rim*.034;
 sky.position.copy(camera.position);renderer.render(scene,camera);}
requestAnimationFrame(frame);
// Read-only inspection seam for desktop smoke tests; never displayed in-world.
window.grin={seed,player,world,renderer,scene,camera};
