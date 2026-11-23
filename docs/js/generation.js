// Authored tutorial island: one metre per voxel. Seed is compatibility-only.
export const SIZE=32, HEIGHT=112, MIN_CHUNK=-4, MAX_CHUNK=3;
export const FOUNDATION_STONE=9;
export const index=(x,y,z)=>(y*SIZE+z)*SIZE+x;
export function hash(x,z,seed){let h=Math.imul(x,374761393)^Math.imul(z,668265263)^Math.imul(seed,1442695041);h=Math.imul(h^h>>>13,1274126177);return ((h^h>>>16)>>>0)/4294967295;}
export function islandRadius(x,z){const a=Math.atan2(z,x);return Math.hypot(x,z)/(108+9*Math.cos(a*3)+5*Math.sin(a*2));}
export function landmarks(){return {x:12,z:-62};}
const trees=[[-26,-24],[34,-34],[-52,18],[46,22],[-28,60],[62,-12],[-64,-40]];
const flora=[[-5,-4],[5,-8],[-13,-17],[22,-28],[-38,12],[48,40],[-20,54],[70,0],[-55,-32],[18,-48]];
export function terrainHeight(x,z){
 const r=islandRadius(x,z);if(r>=1)return -1;
 // Broad hand-cut rings, one-block risers and a northward sightline.
 let h=36+Math.floor(Math.max(0,1-r)*8);
 const d=Math.hypot(x,z);
 if(d<36){const shelter=(z>2||Math.abs(x)>10)?Math.min(4,Math.floor(Math.max(0,d-7)/3)):0;const bed=40+shelter;const blend=Math.max(0,Math.min(1,(d-20)/16));h=Math.floor(bed*(1-blend)+h*blend);}
 return h;
}
export const sparkNodes=[[-11,9],[12,10],[-15,-7],[16,-12],[-20,5],[21,8]];
export function voxelAt(x,y,z,seed){
 if(y<0||y>=HEIGHT||x<MIN_CHUNK*SIZE||x>=(MAX_CHUNK+1)*SIZE||z<MIN_CHUNK*SIZE||z>=(MAX_CHUNK+1)*SIZE)return 0;
 const h=terrainHeight(x,z);if(h<0)return 0;
 if(sparkNodes.some(([sx,sz])=>x===sx&&z===sz)&&y===h)return 10;
 const bottom=14+Math.floor(islandRadius(x,z)*16);
 if(y>=bottom&&y<bottom+2)return FOUNDATION_STONE;
 if(y>=bottom&&y<=h)return y===h?1:(Math.floor(y/4)%2?2:3);
 const m=landmarks();if(Math.abs(x-m.x)<=2&&Math.abs(z-m.z)<=1&&y>terrainHeight(m.x,m.z)&&y<terrainHeight(m.x,m.z)+48)return 4;
 if(y>h+10)return 0;
 for(const [tx,tz] of trees){const th=terrainHeight(tx,tz),dx=x-tx,dz=z-tz;
 if(dx===0&&dz===0&&y>th&&y<=th+5)return 5;
 if(dx*dx+dz*dz+(y-th-6)**2<10&&y>th+3)return 6;}
 for(let i=0;i<flora.length;i++){const [fx,fz]=flora[i];if(x===fx&&z===fz&&y===h+1)return i%2?8:7;}
 return 0;
}
export function generate(cx,cz,seed){
 const blocks=new Uint8Array(SIZE*SIZE*HEIGHT),light=new Uint8Array(blocks.length);
 for(let z=0;z<SIZE;z++)for(let x=0;x<SIZE;x++){let sun=15;for(let y=HEIGHT-1;y>=0;y--){const i=index(x,y,z),b=voxelAt(cx*SIZE+x,y,cz*SIZE+z,seed);blocks[i]=b;if(b)sun=0;light[i]=sun;}}
 return {cx,cz,blocks,light};
}

// Stage four placeholder: canon leaves the full biome table open.
export const DEFAULT_SEED=73021;
const smooth=t=>t*t*(3-2*t);
function noise(x,z,seed,scale){
 const a=Math.floor(x/scale),b=Math.floor(z/scale),u=smooth(x/scale-a),v=smooth(z/scale-b);
 const n=(i,j)=>hash(i,j,seed);
 return (n(a,b)*(1-u)+n(a+1,b)*u)*(1-v)+(n(a,b+1)*(1-u)+n(a+1,b+1)*u)*v;
}
export function wakingHeight(x,z,seed=DEFAULT_SEED){
 return 34+Math.floor(noise(x,z,seed,96)*12+noise(x,z,seed+1,32)*4);
}
export function wakingVoxel(x,y,z,seed=DEFAULT_SEED){
 if(y<0||y>=HEIGHT)return 0;
 const h=wakingHeight(x,z,seed);
 if(y<2)return FOUNDATION_STONE;
 if(y<=h)return y===h?1:(Math.floor(y/4)%2?2:3);
 if(y===h+1&&hash(x,z,seed+7)>.985)return hash(x,z,seed+8)>.5?7:8;
 return 0;
}
export function generateWaking(cx,cz,seed=DEFAULT_SEED){
 const blocks=new Uint8Array(SIZE*SIZE*HEIGHT),light=new Uint8Array(blocks.length);
 for(let z=0;z<SIZE;z++)for(let x=0;x<SIZE;x++){let sun=15;for(let y=HEIGHT-1;y>=0;y--){const i=index(x,y,z),b=wakingVoxel(cx*SIZE+x,y,cz*SIZE+z,seed);blocks[i]=b;if(b)sun=0;light[i]=sun;}}
 return {cx,cz,blocks,light,waking:true};
}
