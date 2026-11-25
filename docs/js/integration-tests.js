// CPU-only integration checks. Pass immutable source strings; no renderer is created.
export async function testIntegration(s,base){
 const assert=(ok,m)=>{if(!ok)throw Error(m);};
 const clean=t=>t.replace(/^import .*?;\r?\n/gm,'').replace(/export /g,'').replaceAll('import.meta.url',JSON.stringify('https://example.com/worker.js'));
 const compile=(t,deps,out)=>new Function(...Object.keys(deps),clean(t)+';return '+out)(...Object.values(deps));
 const gen=compile(s['generation.js'],{},'{SIZE,HEIGHT,index,hash,voxelAt,wakingVoxel,generate,generateWaking,MIN_CHUNK,MAX_CHUNK}');
 const layout=compile(s['atlas-layout.js'],{},'{BLOCK_FACES,atlasUV,faceUV}');
 const mesh=compile(s['meshing.js'],{...gen,...layout},'mesh'),old=compile(base['meshing.js'],gen,'mesh');
 const eq=(a,b)=>a.byteLength===b.byteLength&&new Uint8Array(a.buffer,a.byteOffset,a.byteLength).every((v,i)=>v===new Uint8Array(b.buffer,b.byteOffset,b.byteLength)[i]);
 const compare=(a,b)=>{for(const k of ['positions','colors','waterPositions','waterColors'])assert(eq(a[k],b[k]),'parity '+k);};
 const chunk=(id=2,cx=0,cz=0)=>{const blocks=new Uint8Array(gen.SIZE*gen.SIZE*gen.HEIGHT),light=new Uint8Array(blocks.length).fill(15);blocks[gen.index(16,gen.HEIGHT-2,16)]=id;return {cx,cz,blocks,light};};
 let orientationVertices=0,quadDirections=0;const directions=new Set();
 for(let id=1;id<25;id++){
  const c=chunk(id,-2,1),a=mesh(c,73021),pos=a.positions,uv=a.uvs;
  for(let q=0;q<pos.length;q+=18){
   const x=[pos[q+3]-pos[q],pos[q+4]-pos[q+1],pos[q+5]-pos[q+2]],y=[pos[q+6]-pos[q],pos[q+7]-pos[q+1],pos[q+8]-pos[q+2]];
   // Derive each face direction from its triangle winding.
   const cross=[x[1]*y[2]-x[2]*y[1],x[2]*y[0]-x[0]*y[2],x[0]*y[1]-x[1]*y[0]],axis=cross.findIndex(v=>Math.abs(v)>1e-7),n=[0,0,0];n[axis]=Math.sign(cross[axis]);
   const dir=axis===0?(n[0]>0?0:1):axis===1?(n[1]>0?2:3):(n[2]>0?4:5);directions.add(id+':'+dir);quadDirections++;
   const box=Math.floor(q/108);let cell=layout.BLOCK_FACES[id][dir].cell;if(id===24&&box!==0||[22,23].includes(id)&&box!==0)cell=15;
   for(let k=0;k<6;k++){
    const v=[pos[q+k*3]-c.cx*32-16,pos[q+k*3+1]-(gen.HEIGHT-2),pos[q+k*3+2]-c.cz*32-16];
    let [u,w]=n[1]?[v[0],n[1]>0?1-v[2]:v[2]]:n[0]?[n[0]>0?v[2]:1-v[2],v[1]]:[n[2]>0?1-v[0]:v[0],v[1]];
    if((id===22&&dir>=4||id===23&&dir<2)&&box===0){const horizontal=id===22?v[0]:v[2];u=n[2]>0||n[0]<0?1-(horizontal-.06)/.88:(horizontal-.06)/.88;w=.5+(v[1]-.5)*(2/3)/.88;}
    const expected=[(cell%8*256+8+u*240)/2048,1-(Math.floor(cell/8)*256+8+(1-w)*240)/2048];
    for(let j=0;j<2;j++)assert(Math.abs(uv[q/3*2+k*2+j]-expected[j])<2e-6,'orientation '+id+':'+dir+':'+k);orientationVertices++;
   }
  }
 }
 assert(directions.size===144,'six directions per opaque ID');
 let aoCases=0;for(let mask=0;mask<8;mask++){
  const c=chunk();for(let i=0;i<3;i++)if(mask>>i&1)c.blocks[gen.index(16+(i!==1),gen.HEIGHT-1,16+(i!==0))]=2;
  compare(mesh(c,73021),old(c,73021));aoCases++;
 }
 let workerReplies=0;const transferLengths=[];
 for(const waking of [false,true])for(const remesh of [false,true]){
  let reply,transfers;const self={postMessage:(a,b)=>{reply=a;transfers=b;}};
  compile(s['worker.js'],{...gen,mesh,self},'self');const c=chunk(2,-1,-1),data={cx:-1,cz:-1,seed:73021,waking,revision:7,...(remesh?{chunk:c}:{})};self.onmessage({data});
  const expected=mesh(remesh?c:(waking?gen.generateWaking:gen.generate)(-1,-1,73021),73021);
  for(const k of ['positions','colors','uvs','waterPositions','waterColors'])assert(eq(reply[k],expected[k]),'worker arrays '+k);
  const keys=remesh?['positions','colors','uvs','waterPositions','waterColors']:['blocks','light','positions','colors','uvs','waterPositions','waterColors'];
  assert(transfers.length===keys.length&&keys.every((k,i)=>transfers[i]===reply[k].buffer),'transfer list');if(remesh)assert(reply.revision===7,'revision');transferLengths.push(transfers.length);workerReplies++;
 }
 let geometryDisposals=0,materialDisposals=0,textureDisposals=0;class Geometry{constructor(){this.attributes={};}setAttribute(k,v){this.attributes[k]=v;}computeBoundingSphere(){}dispose(){geometryDisposals++;}}
 const THREE={BufferGeometry:Geometry,BufferAttribute:class{constructor(array,itemSize){Object.assign(this,{array,itemSize});}},MeshBasicMaterial:class{constructor(o){Object.assign(this,o);this.userData={};}dispose(){materialDisposals++;}},Mesh:class{constructor(geometry,material){Object.assign(this,{geometry,material});}},DoubleSide:2};
 const Worker=class{postMessage(...a){this.sent=a;}terminate(){}};
 const deps={...gen,THREE,Worker,appendDelta:()=>{},breakable:id=>id>0,mesh};
 const World=compile(s['world.js'],deps,'World'),OldWorld=compile(base['world.js'],deps,'World');const scene={add(){},remove(){}};
 const world=new World(scene,73021),prior=new OldWorld(scene,73021),atlas={dispose(){textureDisposals++;}};world.material.map=atlas;
 for(const w of [world,prior])for(let z=-1;z<=1;z++)for(let x=-1;x<=1;x++){const c=chunk(2,x,z);c.blocks[gen.index(0,100,0)]=2;w.install({...c,...mesh(c,73021)});}
 assert(world.chunks.get('0,0').object.geometry.attributes.uv.itemSize===2,'terrain uv');assert(!('uv' in world.chunks.get('0,0').waterObject.geometry.attributes),'water unchanged');
 world.remove(0,100,0);prior.remove(0,100,0);assert(world.dirty.size===9&&JSON.stringify([...world.dirty])===JSON.stringify([...prior.dirty]),'diagonal dirtying');
 const dirtyNeighbours=world.dirty.size;const halo=world.snapshot(world.chunks.get('0,0')).halo,haloOld=prior.snapshot(prior.chunks.get('0,0')).halo;assert(JSON.stringify(halo)===JSON.stringify(haloOld),'halo parity');
 const c=world.chunks.get('0,0'),before=c.object.geometry;world.install({...chunk(),...mesh(chunk(),73021),revision:0});assert(c.object.geometry===before,'stale rejected');world.install({...chunk(),...mesh(chunk(),73021),revision:c.revision});assert(c.object.geometry!==before,'current accepted');
 world.enterWaking();world.wanted.add('0,0');world.edits.set('0,0',new Set([gen.index(16,gen.HEIGHT-2,16)]));const replay=chunk();world.install({...replay,...mesh(replay,73021)});assert(world.block(16,gen.HEIGHT-2,16)===0,'edit replay');world.stream(3200,3200);assert(!world.chunks.has('0,0'),'unload');assert(world.material.map===atlas&&materialDisposals===0&&textureDisposals===0,'shared atlas survives');
 const start=s['main.js'],original=base['main.js'];let restored=start;
 const changes=[[
 "import {loadAtlas,atlasTexture} from './terrain-atlas.js';\nconst terrainAtlasReady=loadAtlas();\n",''],["\nlet terrainTexturesReady=false;\nterrainAtlasReady.then(({levels})=>{world.material.map=atlasTexture(THREE,levels);world.material.needsUpdate=true;terrainTexturesReady=true;});",''],['if(terrainTexturesReady)world.update(player.x,player.z);','world.update(player.x,player.z);'],['max(vColor.g,vColor.b))*step(vColor.r,.7)','max(diffuseColor.g,diffuseColor.b))*step(diffuseColor.r,.7)']];
 for(const [a,b] of changes){assert(restored.split(a).length===2,'exact main edit');restored=restored.replace(a,b);}assert(restored===original,'protected main byte parity');
 const shaderBody=start.slice(start.indexOf('world.material.onBeforeCompile=shader=>'),start.indexOf('function updateSky'));
 const guide={body:{position:{}}};new Function('world','guide',shaderBody)(world,guide);const shader={uniforms:{},vertexShader:'#include <begin_vertex>',fragmentShader:'#include <map_fragment>\n#include <color_fragment>'};world.material.onBeforeCompile(shader);assert(world.material.userData.shader===shader&&shader.fragmentShader.includes('max(vColor.g,vColor.b)')&&shader.fragmentShader.includes('#include <map_fragment>'),'shader hook');assert(Object.keys(shader.uniforms).length===4,'uniforms');
 let release,updates=0;const ready=new Promise(r=>release=r),fakeWorld={material:{},update(){updates++;}};
 const gate=new Function('terrainAtlasReady','world','atlasTexture','THREE',"let terrainTexturesReady=false;const installed="+start.split('\n').find(l=>l.startsWith('terrainAtlasReady.then'))+";return {tick(){if(terrainTexturesReady)world.update();},installed};")(ready,fakeWorld,()=>atlas,{});
 gate.tick();assert(updates===0,'pending atlas blocks update');release({levels:[]});await gate.installed;gate.tick();assert(updates===1&&fakeWorld.material.map===atlas,'ready atlas permits update');
 return {startupGate:true,orientationVertices,quadDirections,directionPairs:directions.size,aoCases,workerReplies,transferLengths,dirtyNeighbours,haloEntries:Object.keys(halo).length,staleRevision:true,replay:true,unload:true,geometryDisposals,materialDisposals,textureDisposals,protectedMain:true,shaderHook:true};
}
