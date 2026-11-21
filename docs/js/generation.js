// One metre per voxel. Pure seed + coordinates; no random mutable state.
export const SIZE = 32, HEIGHT = 112;
export const index = (x,y,z) => (y * SIZE + z) * SIZE + x;
export function hash(x,z,seed) {
  let h = Math.imul(x,374761393) ^ Math.imul(z,668265263) ^ Math.imul(seed,1442695041);
  h = Math.imul(h ^ h >>> 13,1274126177); return ((h ^ h >>> 16) >>> 0) / 4294967295;
}
const smooth = t => t*t*(3-2*t);
function noise(x,z,seed,scale) {
  x/=scale; z/=scale; const a=Math.floor(x), b=Math.floor(z), u=smooth(x-a), v=smooth(z-b);
  const p=hash(a,b,seed)*(1-u)+hash(a+1,b,seed)*u;
  const q=hash(a,b+1,seed)*(1-u)+hash(a+1,b+1,seed)*u; return p*(1-v)+q*v;
}
export function landmarks(seed) {
  const a=(hash(7,9,seed)-.5)*.35;
  return {x:Math.round(Math.sin(a)*305),z:-Math.round(Math.cos(a)*305)};
}
export function terrainHeight(x,z,seed) {
  const m=landmarks(seed), ridge=13*Math.exp(-((x-m.x)**2+(z-m.z)**2)/4200);
  const rolling=18+noise(x,z,seed,110)*19+noise(x,z,seed+1,42)*7+ridge;
  // Spawn terrace faces north over a lower valley, with a safe flat bed.
  const d=Math.max(Math.abs(x),Math.abs(z));
  const spawn=39+Math.min(0,z+3)*.42;
  const w=1-smooth(Math.min(1,Math.max(0,(d-4)/24)));
  return Math.floor(rolling*(1-w)+spawn*w);
}
function island(x,y,z,seed) {
  for(let n=0;n<2;n++) {
    const ix=(n? -135:110)+Math.floor(hash(n,4,seed)*25), iz=-215-n*38;
    const dx=x-ix,dz=z-iz,r=dx*dx/110+dz*dz/65;
    const top=77+n*12;
    if(r<1 && y<=top && y>=top-Math.ceil((1-r)*9)) return y===top?1:(y%6<3?2:3);
  } return 0;
}
export function voxelAt(x,y,z,seed) {
  if(y<0)return 2; if(y>=HEIGHT)return 0;
  const h=terrainHeight(x,z,seed);
  if(y<=h)return y===h?1:(Math.floor(y/4)%2?2:3);
  const m=landmarks(seed);
  if(Math.abs(x-m.x)<=2 && Math.abs(z-m.z)<=1){
    const base=terrainHeight(m.x,m.z,seed)+1;
    if(y>=base && y<base+39)return 4;
  }
  const floating=island(x,y,z,seed); if(floating)return floating;
  if(y>h+12)return 0;
  // Sparse rounded block canopies, indexed by cells so borders agree.
  const gx=Math.floor(x/18),gz=Math.floor(z/18);
  for(let a=gx-1;a<=gx+1;a++)for(let b=gz-1;b<=gz+1;b++) {
    if(hash(a,b,seed+8)>.13)continue;
    const tx=a*18+5+Math.floor(hash(a,b,seed+9)*8),tz=b*18+5+Math.floor(hash(a,b,seed+10)*8);
    if(Math.hypot(tx,tz)<14)continue;
    const th=terrainHeight(tx,tz,seed), dx=x-tx,dz=z-tz;
    if(dx===0&&dz===0&&y>th&&y<=th+5)return 5;
    if(dx*dx+dz*dz+(y-th-6)**2*.8<10 && y>th+3)return 6;
  }return 0;
}
export function generate(cx,cz,seed) {
  const blocks=new Uint8Array(SIZE*SIZE*HEIGHT),light=new Uint8Array(blocks.length);
  for(let z=0;z<SIZE;z++)for(let x=0;x<SIZE;x++) {
    let sky=15; const wx=cx*SIZE+x,wz=cz*SIZE+z;
    // Scan downward: each voxel reserves its own 0..15 light channel.
    for(let y=HEIGHT-1;y>=0;y--) {
      const i=index(x,y,z), b=voxelAt(wx,y,wz,seed); blocks[i]=b;
      light[i]=sky; if(b)sky=Math.max(3,sky-3);
    }
  }
  return {cx,cz,blocks,light};
}
