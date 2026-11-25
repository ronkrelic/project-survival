// CPU-only regression suite. Inject the real r180 modules and immutable source bytes.
// No renderer or WebGL context is created. Run in a browser for actual image decode.
// Harness inputs: THREE = local r180 exports; model = guide-model.js exports;
// loaderModule = local GLTFLoader.js exports; glb = immutable ember.glb ArrayBuffer;
// mainBefore = main.js at 24c43daf7fe33416c704a37be5b7851c1580971d;
// mainAfter = integration commit main.js; acorn = harness-provided Acorn parser.
// Call await runGuideModelTests(inputs). Acorn is test-only, never a game dependency.
export async function runGuideModelTests({THREE,model,loaderModule,glb,mainBefore,mainAfter,acorn}) {
 let assertions=0; const assert=(v,m)=>{assertions++;if(!v)throw Error(m);};
 const same=(a,b,m)=>assert(JSON.stringify(a)===JSON.stringify(b),m);
 const empty=s=>Object.values(s.owned).every(n=>n===0);
 const view=new DataView(glb);
 assert(view.getUint32(0,true)===0x46546c67&&view.getUint32(4,true)===2,'GLB v2');
 assert(view.getUint32(8,true)===glb.byteLength&&glb.byteLength===9725188,'GLB exact byte inventory');
 const jsonLength=view.getUint32(12,true), json=JSON.parse(new TextDecoder().decode(new Uint8Array(glb,20,jsonLength)));
 const binStart=20+jsonLength+8, primitive=json.meshes[0].primitives[0], position=json.accessors[primitive.attributes.POSITION], indices=json.accessors[primitive.indices];
 assert(json.scenes.length===1&&json.meshes.length===1&&json.meshes[0].primitives.length===1&&json.materials.length===1,'single scene mesh primitive material');
 assert(!json.skins?.length&&!json.animations?.length&&!json.extensionsUsed?.length&&!json.extensionsRequired?.length&&!primitive.targets,'static uncompressed asset');
 assert(primitive.mode===4&&indices.componentType===5125&&indices.count===291546&&position.count===63326,'geometry inventory');
 same(Object.keys(primitive.attributes).sort(),['NORMAL','POSITION','TEXCOORD_0'],'attribute inventory');
 const b=json.bufferViews[position.bufferView],stride=b.byteStride||12,min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];
 for(let i=0;i<position.count;i++)for(let k=0;k<3;k++){const x=view.getFloat32(binStart+(b.byteOffset||0)+(position.byteOffset||0)+i*stride+k*4,true);min[k]=Math.min(min[k],x);max[k]=Math.max(max[k],x);}
 same(min,position.min,'actual vertex minimum');same(max,position.max,'actual vertex maximum');
 const ib=json.bufferViews[indices.bufferView];let maxIndex=0;
 for(let i=0;i<indices.count;i++)maxIndex=Math.max(maxIndex,view.getUint32(binStart+(ib.byteOffset||0)+(indices.byteOffset||0)+i*4,true));
 assert(maxIndex<position.count,'all indices within vertex array');
 const center=min.map((x,k)=>(x+max[k])/2),scale=model.GUIDE_HEIGHT/(max[1]-min[1]);
 assert(Math.abs((max[1]-min[1])*scale-.4)<1e-14,'0.40 metre math');
 same(json.images.map(x=>json.bufferViews[x.bufferView].byteLength),[2311018,1286044,2933179],'embedded image byte inventory');
 const rig=()=>{const body=new THREE.Group(),light=new THREE.PointLight(),fallback=Array.from({length:4},()=>new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshBasicMaterial({transparent:true,opacity:.65})));body.add(...fallback,light);return {body,light,fallback};};
 const disposeTree=root=>{const l=model.createResourceLedger();l.tree(root);l.close();};
 const counts={imports:0,fetches:0,decodes:0};const sizes=[];
 const r=rig(),positionRef=r.body.position;
 const visual=model.createGuideModel(THREE,r,{importLoader:async()=>{counts.imports++;return loaderModule;},fetchAsset:async()=>{counts.fetches++;return {ok:true,arrayBuffer:async()=>glb};},decodeImage:async blob=>{counts.decodes++;const image=await model.decodeGuideImage(blob);sizes.push([image.width,image.height]);return image;}});
 assert(visual.state==='idle','idle');const p=visual.request();assert(visual.state==='loading','loading');assert(p===visual.request(),'single flight promise');await p;
 assert(visual.state==='ready'&&visual.failure===null,'ready real parser');assert(visual.request()===p,'success never retries');
 same(counts,{imports:1,fetches:1,decodes:3},'one real load attempt');same(sizes,[[2048,2048],[2048,2048],[2048,2048]],'actual decoded image sizes');
 assert(r.body.position===positionRef&&r.body.children.includes(r.light),'body vector/light retained');assert(visual.pivot.parent===r.body,'new child pivot');
 const actual=new THREE.Box3().setFromObject(visual.pivot);assert(Math.abs(actual.getSize(new THREE.Vector3()).y-.4)<1e-12,'real transformed height');
 assert(actual.getCenter(new THREE.Vector3()).length()<1e-12,'real transformed center');assert(Math.abs(visual.scale-scale)<1e-14,'computed scale');
 same(visual.stats().owned,{geometries:1,materials:1,textures:1,bitmaps:1},'only base resources retained');
 same(visual.stats().freed,{geometries:0,materials:2,textures:2,bitmaps:2},'PBR clones MR normal freed');
 visual.pivot.traverse(o=>{if(!o.isMesh)return;assert(o.material.isMeshBasicMaterial&&o.material.side===THREE.DoubleSide,'matte double sided');assert(o.material.map.colorSpace===THREE.SRGBColorSpace&&!o.material.map.flipY,'sRGB glTF orientation');assert(o.material.opacity===0,'initial transparent model');});
 for(let i=0;i<16;i++){visual.restoreFallback();visual.update(i===0?9:.05,i*.05);assert(Math.abs(visual.fade-(i+1)/16)<1e-12,'capped fade bookkeeping '+i);if(i===7)assert(Math.abs(r.fallback[0].material.opacity-.325)<1e-12,'noncumulative fallback opacity');}
 assert(visual.fade===1&&r.fallback.every(o=>!o.visible)&&r.light.visible,'fade completion preserves light');
 visual.pivot.traverse(o=>{if(o.isMesh)assert(!o.material.transparent&&o.material.depthWrite&&o.material.opacity===1,'opaque finish');});
 const successStats=visual.stats();
 const failures=[];
 for(const failure of ['import','network','http','body','parse','image0','image1','image2']){
  const rr=rig(),refs=rr.body.children.slice(),calls={imports:0,fetches:0,images:0},closed=[];
  const v=model.createGuideModel(THREE,rr,{importLoader:async()=>{calls.imports++;if(failure==='import')throw Error('offline import');return loaderModule;},fetchAsset:async()=>{calls.fetches++;if(failure==='network')throw Error('offline');return {ok:failure!=='http',status:503,arrayBuffer:async()=>{if(failure==='body')throw Error('body');return failure==='parse'?new ArrayBuffer(4):glb;}};},decodeImage:async()=>{const id=calls.images++;if(failure==='image'+id)throw Error('decode');return {width:2048,height:2048,close(){closed.push(id);}};}});
  const promise=v.request();assert(promise===v.request(),'failure single flight '+failure);await promise;
  const category=failure.startsWith('image')?'image':['http','body'].includes(failure)?'network':failure;
  assert(v.state==='failed'&&v.failure===category,'failure classification '+failure);assert(v.request()===promise&&calls.imports===1,'permanent failure '+failure);
  same(rr.body.children,refs,'fallback/light attachment unchanged '+failure);assert(rr.fallback.every(o=>o.visible&&o.material.opacity===.65),'fallback unchanged '+failure);
  v.restoreFallback();v.update(.05);assert(empty(v.stats())&&v.stats().closed,'all tracked failure resources disposed '+failure);
  assert(new Set(closed).size===closed.length,'images closed once '+failure);
  if(failure.startsWith('image')){assert(closed.length===2&&v.stats().freed.geometries===1&&v.stats().freed.textures===2,'partial decoded resources freed '+failure);}
  failures.push({case:failure,category,calls,resources:v.stats()});disposeTree(rr.body);
 }
 // Reject a parse after allocating resources, then resolve an in-flight primitive.
 const partialRig=rig();let releaseLate,plugin,lateGeometry;
 class PartialLoader {register(p){plugin=p;return this;}async parseAsync(){
  const parser={json:{images:[]},primitiveCache:{},getDependency:()=>Promise.resolve(null),loadGeometries(){const g=new THREE.BoxGeometry();this.primitiveCache.a={promise:Promise.resolve(g)};this.primitiveCache.b={promise:new Promise(resolve=>{releaseLate=()=>{lateGeometry=new THREE.BoxGeometry();resolve(lateGeometry);};})};return Promise.reject(Error('partial parse'));}};
  plugin(parser);await parser.loadGeometries();
 }}
 const partial=model.createGuideModel(THREE,partialRig,{importLoader:async()=>({GLTFLoader:PartialLoader}),fetchAsset:async()=>({ok:true,arrayBuffer:async()=>glb})});
 await partial.request();releaseLate();await Promise.resolve();await Promise.resolve();assert(partial.state==='failed'&&partial.failure==='parse','partial parse failed');assert(empty(partial.stats())&&partial.stats().freed.geometries===2,'early and late geometries disposed');disposeTree(partialRig.body);
 const ledger=model.createResourceLedger();const accounting={geometries:0,materials:0,textures:0,bitmaps:0};
 for(const kind of Object.keys(accounting)){const resource=kind==='bitmaps'?{close(){accounting[kind]++;}}:{dispose(){accounting[kind]++;}};ledger.own(kind,resource);ledger.own(kind,resource);}ledger.close();ledger.close();
 for(const kind of Object.keys(accounting))ledger.own(kind,kind==='bitmaps'?{close(){accounting[kind]++;}}:{dispose(){accounting[kind]++;}});
 same(accounting,{geometries:2,materials:2,textures:2,bitmaps:2},'idempotent and late disposal accounting');assert(empty(ledger.stats()),'closed ledger empty');
 const namingCrossing=testNamingCrossing({THREE,visualPivot:visual.pivot,mainBefore,mainAfter,acorn,assert,same});
 const parity=await testGuideParity({THREE,model,visualPivot:visual.pivot,mainBefore,mainAfter,acorn,assert,same});disposeTree(r.body);
 return {assertions,inventory:{bytes:glb.byteLength,vertices:position.count,indices:indices.count,triangles:indices.count/3,min,max,center,scale,maxIndex,images:sizes},success:{counts,resources:successStats,fadeFrames:16},failures,lateParse:partial.stats(),ledger:accounting,namingCrossing,parity};
}

async function testGuideParity({THREE,model,visualPivot,mainBefore,mainAfter,acorn,assert,same}) {
 const parse=s=>acorn.parse(s,{ecmaVersion:'latest',sourceType:'module'});
 const beforeAST=parse(mainBefore),afterAST=parse(mainAfter);
 const expected=mainBefore.replace("import {loadAtlas,atlasTexture} from './terrain-atlas.js';","import {loadAtlas,atlasTexture} from './terrain-atlas.js';\nimport {createGuideModel} from './guide-model.js';").replace("const guideLine=document.getElementById('guide-line');","const guideVisual=createGuideModel(THREE,{body:guide.body,fallback:[ember,halo,...wings]});\nconst guideLine=document.getElementById('guide-line');").replace("if(world.loaded&&session.started){nourishment.update(dt);","if(world.loaded&&session.started){if(guideVisual.state==='idle')void guideVisual.request();nourishment.update(dt);").replace("attention.update();guide.update(dt);","attention.update();guideVisual.restoreFallback();guide.update(dt);guideVisual.update(dt,guide.clock);");
 assert(expected===mainAfter,'exact four allowed integration edits, entire remainder byte identical');
 const fragment=s=>s.slice(s.indexOf('const guide={'),s.indexOf('const phase={'));
 async function fixture(source,attached,mode,offline=false){
  const camera=new THREE.PerspectiveCamera();camera.position.set(.5,42,.5);const player={x:.5,y:41,z:.5,awake:true,wake:1,materials:{},didJump:false,didSprint:false};
  const world={waking:false},session={name:'Fixture',started:true},attention={gathered:0,regions:new Set(),monolith:false},phase={value:0},crossing={crossed:false};
  const classes=new Set(),line={textContent:'',classList:{add:x=>classes.add(x),remove:x=>classes.delete(x)}};
  const ctx={THREE,camera,player,world,session,attention,phase,crossing,scene:new THREE.Scene(),document:{getElementById:()=>line},islandRadius:()=>80,createGuideModel:()=>({})};
  const guide=new Function(...Object.keys(ctx),fragment(source)+'\nreturn guide;')(...Object.values(ctx));
  const bodyRef=guide.body,positionRef=guide.body.position;
  if(attached)guide.body.add(visualPivot.clone(true));
  const blocked=model.createGuideModel(THREE,{body:guide.body,fallback:guide.body.children.filter(o=>o.isMesh)},{importLoader:async()=>{throw Error('offline import');}});
  if(offline){await blocked.request();assert(blocked.state==='failed','offline failure before continuing fixture');}
  const frames=[];
  for(let i=0;i<600;i++){
   player.x+=i<100?.025:0;player.z-=i<180?.015:0;camera.position.set(player.x,player.y+1,player.z);
   if(i===90)attention.gathered=1;if(i===150)player.didJump=true;if(i===210)player.didSprint=true;if(i===260)attention.monolith=true;
   if(i===320){guide.name='Fixture Ember';guide.say('given-name','Fixture Ember.');}
   if(i===360){guide.body.position.add(new THREE.Vector3(4,2,-8));world.waking=true;}
   if(i===420){player.awake=false;player.mistCatch={};}if(i===460){player.awake=true;player.mistCatch=null;}
   if(i===500){guide.queue=[];guide.active={id:'nudge',text:'Fixture',duration:.1};guide.elapsed=1.8;}
   if(offline)blocked.restoreFallback();guide.update(.05);if(offline)blocked.update(.05,guide.clock);
   frames.push({mode:guide.mode,clock:guide.clock,position:guide.body.position.toArray(),elapsed:guide.elapsed,active:guide.active,queue:guide.queue.map(x=>({...x})),seen:[...guide.seen],completed:[...guide.completed],lessons:{stage:guide.lessons.stage,done:guide.lessons.done},text:line.textContent,classes:[...classes],light:guide.light.intensity});
  }
  assert(guide.body===bodyRef&&guide.body.position===positionRef,'guide reference identity '+mode);
  return frames;
 }
 for(const mode of ['solo','host','guest']){const baseline=await fixture(mainBefore,false,mode);same(baseline,await fixture(mainAfter,true,mode),'600 real-model behavior/position frames '+mode);same(baseline,await fixture(mainAfter,false,mode,true),'600 offline-fallback behavior/position frames '+mode);}
 const declarations=(s,ast)=>ast.body.filter(n=>n.type==='FunctionDeclaration'&&['worldSnapshot','personalSnapshot','farmSnapshot','ownState'].includes(n.id.name)||n.type==='VariableDeclaration'&&n.declarations.length===1&&n.declarations[0].init?.type==='Identifier'&&n.declarations[0].init.name==='personalSnapshot'||n.type==='ExpressionStatement'&&n.expression.type==='AssignmentExpression'&&n.expression.left.type==='Identifier'&&n.expression.left.name==='personalSnapshot').map(n=>s.slice(n.start,n.end)).join('\n');
 const snapshotCtx={seed:73021,session:{name:'Fixture'},crossing:{name:'Fixture Ember',named:true},player:{x:1,y:42,z:-101,yaw:.25,materials:{stone:5}},nourishment:{hunger:83,health:97},craftHistory:['fixture'],craftBase:2,personalIdentity:'fixture-id',arcFor:()=>({firstFire:true,monolith:true,named:true,crossed:true,firstDusk:false}),settings:{sfx:1,music:.4,sensitivity:1},worn:{body:null,head:null},moments:[{id:'guideNamed',day:1}],places:[{name:'Fixture',x:1,z:2}],world:{farmland:new Map([['1,2',3]]),waking:true},net:{mode:'solo',peer:{id:'local'},deltas:new Map(),people:new Map([['friend',{}]]),links:new Map([['friend',{psIdentity:'friend-id'}]])},crops:new Map([['p',{x:1,y:2,z:3,wild:false,born:20}]]),farmClock:100,wildHarvested:new Set(['fixture']),rhythm:{seconds:100,day:1},ritual:{lit:true},savedGuestLedgers:{},guestBags:new Map([['friend',{stone:2}]]),guestCraftCounts:new Map([['friend',1]]),farmRevision:2,nameInput:{value:''}};
 const serialize=(s,ast,ctx)=>new Function(...Object.keys(ctx),declarations(s,ast)+'\nreturn {world:JSON.stringify(worldSnapshot()),personal:JSON.stringify(personalSnapshot()),farm:JSON.stringify(farmSnapshot()),presence:JSON.stringify(ownState())};')(...Object.values(ctx));
 const snapshots=[];for(const mode of ['solo','host','guest']){snapshotCtx.net.mode=mode;const a=serialize(mainBefore,beforeAST,snapshotCtx),b=serialize(mainAfter,afterAST,snapshotCtx);same(a,b,'all snapshot bytes '+mode);snapshots.push({mode,bytes:Object.fromEntries(Object.entries(a).map(([k,v])=>[k,new TextEncoder().encode(v).length]))});}
 const wire=s=>[...new Set([...s.matchAll(/type\s*:\s*['"]([^'"]+)['"]/g)].map(m=>m[1]))].sort();same(wire(mainBefore),wire(mainAfter),'wire message types unchanged');
 return {behaviorFrames:3600,snapshotFixtures:snapshots,wireTypes:wire(mainAfter),offlineImportUsesSameBehavior:true,scope:'CPU guide.update fixtures plus exact whole-source integration guard; not an end-to-end gameplay or GPU test'};
}

function testNamingCrossing({THREE,visualPivot,mainBefore,mainAfter,acorn,assert,same}) {
 function run(source,attached){
  const ast=acorn.parse(source,{ecmaVersion:'latest',sourceType:'module'}),code=ast.body.filter(n=>n.type==='FunctionDeclaration'&&['acceptGuideName','updateCrossing'].includes(n.id.name)).map(n=>source.slice(n.start,n.end)).join('\n');
  const body=new THREE.Group(),position=body.position;body.position.set(12,41,-98);if(attached)body.add(visualPivot.clone(true));
  const guide={body,name:'Ember',queue:[],say(id,text){this.queue.push({id,text});}},crossing={clock:0,manifest:0,named:false,offered:false,crossed:false,furthest:-112,veil:null};
  const player={x:12,y:40,z:-98,keys:new Set(['KeyW']),mistCatch:{active:true},update(){this.updated=true;}},world={waking:false,chunks:new Map(),key:(x,z)=>x+','+z,enterWaking(){this.waking=true;}};
  for(let x=-1;x<=1;x++)for(let z=-1;z<=1;z++)world.chunks.set(world.key(x,z),{});
  let focused=0,cancelled=0;const recorded=[],input={value:'Fixture Ember',focus(){focused++;}},naming={hidden:true,style:{}},veil={style:{}};
  const ctx={THREE,guide,crossing,player,world,phase:{value:1},ritual:{},naming,veil,seed:73021,wakingHeight:()=>40,bridge:{visible:false},shore:{visible:true},grass:{visible:true},hearth:{visible:true},aurora:{visible:true},glints:[],decks:[],bridgeY:()=>40,mining:{cancel(){cancelled++;}},recordMoment:id=>recorded.push(id),document:{getElementById:()=>input,exitPointerLock(){}},renderer:{domElement:{requestPointerLock:()=>Promise.resolve()}}};
  const api=new Function(...Object.keys(ctx),code+'\nreturn {acceptGuideName,updateCrossing};')(...Object.values(ctx));
  const frames=[],capture=()=>frames.push({crossing:JSON.parse(JSON.stringify(crossing)),guideName:guide.name,queue:guide.queue.slice(),guidePosition:body.position.toArray(),player:{x:player.x,y:player.y,z:player.z,mistCatch:player.mistCatch,keys:[...player.keys]},naming:{hidden:naming.hidden,display:naming.style.display},focused,cancelled,recorded:recorded.slice(),worldWaking:world.waking});
  api.updateCrossing(7);capture();guide.active={id:'ask-name',duration:1};guide.mode='speaking';guide.elapsed=2;api.updateCrossing(.05);capture();api.acceptGuideName();capture();
  player.z=-113;api.updateCrossing(.05);capture();player.z=-146;api.updateCrossing(.05);capture();api.updateCrossing(1);capture();
  assert(guide.name==='Fixture Ember'&&crossing.named&&crossing.crossed&&world.waking,'naming and crossing completed');assert(body.position===position&&player.mistCatch===null&&player.keys.size===0,'crossing retains guide vector and clears mist state');
  return frames;
 }
 same(run(mainBefore,false),run(mainAfter,true),'actual naming/crossing fixture with real visual attached');return {steps:6,source:'unchanged acceptGuideName/updateCrossing functions'};
}
