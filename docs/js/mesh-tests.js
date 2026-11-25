import {BLOCK_FACES,atlasUV,faceUV} from './atlas-layout.js';
const assert=(v,m)=>{if(!v)throw new Error(m);};
const bytesEqual=(a,b)=>a.byteLength===b.byteLength&&new Uint8Array(a.buffer,a.byteOffset,a.byteLength).every((v,i)=>v===new Uint8Array(b.buffer,b.byteOffset,b.byteLength)[i]);
export function testMesh(mesh,baseline,generation){
 const {SIZE,HEIGHT,index,generate,generateWaking}=generation;
 let fixtures=0,vertices=0,uvValues=0,parityBytes=0,orientedQuads=0;const byBlock={};let min=1,max=0;
 const cases=[[0,0,10,10],[-1,-1,0,0],[-2,1,31,31],[1,-2,0,31],[-1,0,31,0],[0,-1,16,16]];
 for(let id=0;id<=25;id++)for(const [cx,cz,x,z] of cases){
  const blocks=new Uint8Array(SIZE*SIZE*HEIGHT),light=new Uint8Array(blocks.length).fill(15),y=HEIGHT-2;blocks[index(x,y,z)]=id;
  const halo={};for(let yy=y-1;yy<=y+1;yy++)for(let zz=-1;zz<=SIZE;zz++)for(let xx=-1;xx<=SIZE;xx++)if(xx<0||zz<0||xx>=SIZE||zz>=SIZE)halo[xx+','+yy+','+zz]=0;
  const chunk={cx,cz,blocks,light,halo},a=mesh(chunk,73021),b=baseline(chunk,73021);
  for(const k of ['positions','colors','waterPositions','waterColors']){assert(bytesEqual(a[k],b[k]),'baseline bytes '+id+':'+k);parityBytes+=a[k].byteLength;}
  const expected=id===0||id===25?0:id===17?66:id===21?108:id===22||id===23?72:id===24?216:36;
  assert(a.positions.length/3===expected&&a.uvs.length===expected*2,'counts '+id);
  for(const v of a.uvs){assert(Number.isFinite(v)&&v>=0&&v<=1,'UV bounds '+id);min=Math.min(min,v);max=Math.max(max,v);}
  // Every triangle uses a single tile and has nonzero area. Six vertices per quad.
  for(let q=0;q<a.uvs.length;q+=12){const u=a.uvs;const area=(u[q+2]-u[q])*(u[q+5]-u[q+1])-(u[q+4]-u[q])*(u[q+3]-u[q+1]);assert(area!==0,'UV orientation/crop area '+id);orientedQuads++;}
  byBlock[id]={opaqueVertices:expected,waterVertices:a.waterPositions.length/3,uvValues:a.uvs.length};fixtures++;vertices+=expected;uvValues+=a.uvs.length;
 }
 // Real generated terrain exercises shaded faces, AO, water and halo fallback.
 let generated=0;for(const waking of [false,true])for(const [cx,cz] of [[0,0],[-1,-1],[3,-4]]){
  const c=(waking?generateWaking:generate)(cx,cz,73021),a=mesh(c,73021),b=baseline(c,73021);
  for(const k of ['positions','colors','waterPositions','waterColors']){assert(bytesEqual(a[k],b[k]),'generated parity '+waking+':'+k);parityBytes+=a[k].byteLength;}
  assert(a.uvs.length===a.positions.length/3*2,'generated UV count');generated++;
 }
 return {fixtures,generated,vertices,uvValues,min,max,orientedQuads,parityBytes,byBlock};
}
export {bytesEqual};
