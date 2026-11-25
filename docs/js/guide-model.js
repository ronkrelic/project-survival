// Visual-only Ember attachment. No save, presence, dialogue, or network state.
// GLTFLoader/BufferGeometryUtils are the pinned local Three.js r180 addons.
export const GUIDE_HEIGHT = 0.40; // The single size tuning knob (metres).
export const GUIDE_FADE_SECONDS = 0.8;
export const GUIDE_TINT = 0xffedda;
export const GUIDE_MODEL_URL = new URL('../assets/models/ember.glb', import.meta.url);

// Idempotent ownership, including resources resolving AFTER a failed parse.
export function createResourceLedger() {
 const owned = {geometries:new Set(), materials:new Set(), textures:new Set(), bitmaps:new Set()};
 const disposed = new WeakSet();
 const freed = {geometries:0, materials:0, textures:0, bitmaps:0};
 let closed = false;
 function release(kind, item) {
  if (!item || disposed.has(item)) return;
  disposed.add(item); owned[kind].delete(item); freed[kind]++;
  if (kind === 'bitmaps') { if (typeof item.close === 'function') item.close(); else if ('src' in item) item.src = ''; }
  else { item.dispose(); if (kind === 'textures') item.image = null; }
 }
 function own(kind, item) {
  if (!item || disposed.has(item)) return item;
  if (closed) release(kind, item); else owned[kind].add(item);
  return item;
 }
 function texture(t) {
  if (!t) return;
  const image = t.image;
  own('textures', t); if (image) own('bitmaps', image);
 }
 function material(m) {
  if (!m) return;
  for (const v of Object.values(m)) if (v?.isTexture) texture(v);
  own('materials', m);
 }
 function tree(root) {
  root?.traverse(o => {if (o.geometry) own('geometries', o.geometry); for (const m of [].concat(o.material || [])) material(m);});
 }
 function retain(keep = {}) {
  for (const kind of Object.keys(owned)) for (const item of [...owned[kind]]) if (!keep[kind]?.has(item)) release(kind, item);
 }
 return {own, texture, material, tree, retain,
  close() {closed = true; retain();},
  stats() {return {closed, owned:Object.fromEntries(Object.entries(owned).map(([k,v]) => [k,v.size])), freed:{...freed}};}
 };
}

export async function decodeGuideImage(blob) {
 if (typeof createImageBitmap === 'function') {
  // r180 glTF uses unflipped bitmap data and texture.flipY=false.
  return createImageBitmap(blob, {imageOrientation:'none', premultiplyAlpha:'none', colorSpaceConversion:'none'});
 }
 const url = URL.createObjectURL(blob), image = new Image();
 try { image.src = url; await image.decode(); return image; }
 finally { URL.revokeObjectURL(url); }
}

// Pinned r180 parser seam: own geometry before mesh completion and decode images
// ourselves, so a swallowed loadTextureImage error cannot install a broken guide.
// This also avoids r180 loadImageSource's unreclaimed object URL on decode failure.
export function trackGuideParser(parser, THREE, ledger, decode, imageFailed) {
 const get = parser.getDependency.bind(parser);
 parser.getDependency = function(type, index) {
  return Promise.resolve(get(type, index)).then(value => {
   if (type === 'texture') ledger.texture(value);
   if (type === 'material') ledger.material(value);
   if (type === 'mesh' || type === 'scene') ledger.tree(value);
   return value;
  });
 };
 const geometries = parser.loadGeometries.bind(parser);
 parser.loadGeometries = function(...args) {
  const pending = geometries(...args);
  // Promise.all can reject while another primitive resolves later. Own each
  // cached primitive independently, not only the aggregate mesh result.
  for (const entry of Object.values(parser.primitiveCache)) {
   Promise.resolve(entry.promise).then(geometry => ledger.own('geometries', geometry), () => {});
  }
  return Promise.resolve(pending).then(values => {
   for (const geometry of values) ledger.own('geometries', geometry);
   return values;
  });
 };
 const images = new Map();
 parser.loadImageSource = function(index) {
  if (!images.has(index)) images.set(index, (async () => {
   try {
    const image = parser.json.images[index];
    // Ember is a self-contained GLB. Do not introduce external image requests.
    if (image.bufferView === undefined) throw Error('Expected embedded guide image');
    const data = await parser.getDependency('bufferView', image.bufferView);
    const bitmap = await decode(new Blob([data], {type:image.mimeType}));
    ledger.own('bitmaps', bitmap);
    const texture = new THREE.Texture(bitmap); texture.needsUpdate = true;
    texture.userData.mimeType = image.mimeType; ledger.texture(texture);
    return texture;
   } catch (error) { imageFailed(error); throw error; }
  })());
  return images.get(index);
 };
 return {name:'SURVIVAL_guide_ownership'};
}

export function createGuideModel(THREE, {body, fallback}, dependencies = {}) {
 const importLoader = dependencies.importLoader || (() => import('./vendor/GLTFLoader.js'));
 const fetchAsset = dependencies.fetchAsset || (url => fetch(url));
 const decode = dependencies.decodeImage || decodeGuideImage;
 const ledger = createResourceLedger();
 let state = 'idle', failure = null, flight = null, pivot = null, fade = 0, scale = 1;
 const originals = new Map(), matte = [];
 function fail(kind) {failure = kind; state = 'failed'; ledger.close(); return null;}
 async function load() {
  let module, buffer, gltf, imageError = false;
  try {module = await importLoader();} catch {return fail('import');}
  try {
   const response = await fetchAsset(GUIDE_MODEL_URL);
   if (!response.ok) throw Error('Guide HTTP ' + response.status);
   buffer = await response.arrayBuffer();
  } catch {return fail('network');}
  try {
   const loader = new module.GLTFLoader();
   loader.register(parser => trackGuideParser(parser, THREE, ledger, decode, () => {imageError = true;}));
   gltf = await loader.parseAsync(buffer, new URL('.', GUIDE_MODEL_URL).href);
   ledger.tree(gltf.scene);
  } catch {return fail(imageError ? 'image' : 'parse');}
  if (imageError) return fail('image');
  let next;
  try {
   const root = gltf.scene;
   root.updateMatrixWorld(true);
   const bounds = new THREE.Box3().setFromObject(root), size = bounds.getSize(new THREE.Vector3());
   if (!Number.isFinite(size.y) || size.y <= 0) throw Error('Empty guide bounds');
   const center = bounds.getCenter(new THREE.Vector3());
   scale = GUIDE_HEIGHT / size.y;
   next = new THREE.Group(); next.name = 'Ember visual pivot';
   root.position.sub(center); next.scale.setScalar(scale); next.add(root);
   const keep = {geometries:new Set(), materials:new Set(), textures:new Set(), bitmaps:new Set()};
   root.traverse(object => {
    if (!object.isMesh) return;
    keep.geometries.add(object.geometry);
    const convert = source => {
     if (!source.map) throw Error('Missing guide base colour');
     source.map.colorSpace = THREE.SRGBColorSpace;
     const material = new THREE.MeshBasicMaterial({map:source.map, color:GUIDE_TINT, side:THREE.DoubleSide, transparent:true, opacity:0, depthWrite:false});
     ledger.own('materials', material); matte.push(material); keep.materials.add(material);
     keep.textures.add(source.map); keep.bitmaps.add(source.map.image);
     return material;
    };
    object.material = Array.isArray(object.material) ? object.material.map(convert) : convert(object.material);
   });
   if (!matte.length) throw Error('No guide mesh');
   // MR + normal textures/decoded images and original PBR materials are freed now.
   ledger.retain(keep);
   for (const object of fallback) for (const material of [].concat(object.material)) originals.set(material, material.opacity);
   body.add(next); pivot = next; state = 'ready'; return pivot;
  } catch {next?.removeFromParent(); return fail('parse');}
 }
 return {
  get state() {return state;}, get failure() {return failure;}, get pivot() {return pivot;},
  get scale() {return scale;}, get fade() {return fade;},
  stats:() => ledger.stats(),
  request() {if (flight) return flight; state = 'loading'; flight = load(); return flight;},
  // Restore before the unchanged procedural update writes pulse/brightness.
  restoreFallback() {for (const [material, opacity] of originals) material.opacity = opacity;},
  update(dt, clock = 0) {
   if (state !== 'ready') return;
   fade = Math.min(1, fade + Math.max(0, Math.min(dt, .05)) / GUIDE_FADE_SECONDS);
   for (const object of fallback) {
    for (const material of [].concat(object.material)) {originals.set(material, material.opacity); material.opacity *= 1 - fade;}
    object.visible = fade < 1;
   }
   for (const material of matte) {
    material.opacity = fade;
    if (fade === 1 && material.transparent) {material.transparent = false; material.depthWrite = true; material.needsUpdate = true;}
   }
   // The static figure inherits body bob/translation; its pivot carries a quiet
   // horizontal breath and flutter instead of deforming the owner's geometry.
   pivot.scale.x = scale * (1 + Math.sin(clock * 2) * .08);
   pivot.rotation.z = Math.sin(clock * 9) * .025;
   // No AnimationMixer: Ember has no clips. A future mixer must use local dt,
   // never the shared multiplayer/network clock.
  }
 };
}
