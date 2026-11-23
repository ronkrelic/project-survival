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

// Waking world: five biomes decided by Relic, November 22, 2026.
export const DEFAULT_SEED=73021;
export const BIOMES=['Meadow','Forest','Canyon and River Lands','Frost Peaks','Desert'];
const smooth=t=>t*t*(3-2*t);
function noise(x,z,seed,scale){
 const a=Math.floor(x/scale),b=Math.floor(z/scale),u=smooth(x/scale-a),v=smooth(z/scale-b),n=(i,j)=>hash(i,j,seed);
 return (n(a,b)*(1-u)+n(a+1,b)*u)*(1-v)+(n(a,b+1)*(1-u)+n(a+1,b+1)*u)*v;
}
export function biomeWeights(x,z,seed=DEFAULT_SEED){
 const a=Math.floor(x/192),b=Math.floor(z/192),u=smooth(x/192-a),v=smooth(z/192-b),w=[0,0,0,0,0];
 for(let dz=0;dz<2;dz++)for(let dx=0;dx<2;dx++){const i=a+dx,j=b+dz,id=i===0&&j===0?0:Math.min(4,Math.floor(hash(i,j,seed+91)*5));w[id]+=(dx?u:1-u)*(dz?v:1-v);}
 return w;
}
export function biomeAt(x,z,seed=DEFAULT_SEED){const w=biomeWeights(x,z,seed);return BIOMES[w.indexOf(Math.max(...w))];}
export function riverDistance(x,z,seed=DEFAULT_SEED){return Math.abs(z-(Math.sin(x/73+seed)*30+Math.sin(x/181)*48));}
function profile(x,z,seed){
 const w=biomeWeights(x,z,seed),n=noise(x,z,seed,64),b=noise(x,z,seed+1,32),r=riverDistance(x,z,seed);
 const channel=1-smooth(Math.min(1,r/14));
 const heights=[37+n*8,39+n*10,39+noise(x,z,seed+2,96)*15-channel*13,51+noise(x,z,seed+3,96)*25+b*7,36+n*8+(Math.sin(x/19+noise(x,z,seed,96)*5)+1)*2];
 const h=Math.floor(heights.reduce((sum,y,i)=>sum+y*w[i],0));
 let pick=hash(x,z,seed+5),type=4;for(let i=0;i<5;i++){pick-=w[i];if(pick<=0){type=i;break;}}
 const surface=[1,11,r<10?13:12,14,15][type];
 return {h,w,type,surface};
}
export function wakingHeight(x,z,seed=DEFAULT_SEED){return profile(x,z,seed).h;}
// Column work is shared by generation and meshing, never dependent on visit order.
const columns=new Map();
function column(x,z,seed){
 const key=x+','+z+','+seed;if(columns.has(key))return columns.get(key);
 const p=profile(x,z,seed),extra=[];
 const chance=hash(x,z,seed+7);
 if(chance<.004*p.w[0])p.surface=10;
 if(chance>.97&&chance<.97+.025*p.w[0])extra.push([p.h+1,16]);
 if(chance>.91&&chance<.91+.075*p.w[1]+.012*p.w[0]+.002*p.w[3]+.001*p.w[4])extra.push([p.h+1,hash(x,z,seed+8)>.5?7:8]);
 const ax=Math.floor(x/12),az=Math.floor(z/12);
 for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++){
  const a=ax+dx,b=az+dz,tx=a*12+2+Math.floor(hash(a,b,seed+20)*8),tz=b*12+2+Math.floor(hash(a,b,seed+21)*8);
  const xx=x-tx,zz=z-tz;if(Math.abs(xx)>3||Math.abs(zz)>3)continue;
  const q=profile(tx,tz,seed);if(hash(a,b,seed+22)>.90*q.w[1]+.10*q.w[0])continue;
  if(!xx&&!zz)for(let y=q.h+1;y<=q.h+5;y++)extra.push([y,5]);
  for(let y=q.h+4;y<=q.h+8;y++)if(xx*xx+zz*zz+(y-q.h-6)**2<10)extra.push([y,6]);
 }
 const c={...p,extra};if(columns.size>=8192)columns.clear();columns.set(key,c);return c;
}
export function wakingVoxel(x,y,z,seed=DEFAULT_SEED){
 if(y<0||y>=HEIGHT)return 0;const p=column(x,z,seed);
 if(y<2)return FOUNDATION_STONE;
 if(y<=p.h){if((p.type===2||p.type===3)&&y>=p.h-12&&y<p.h-1&&hash(Math.floor(x/3),Math.floor(z/3),seed+Math.floor(y/3)*41+910)<.09)return 18;if(y===p.h)return p.surface;if(p.type===3&&y>p.h-4)return 13;if(p.type===4&&y>p.h-3)return 15;return Math.floor(y/4)%2?2:3;}
 for(const [yy,id] of p.extra)if(y===yy)return id;return 0;
}
export function generateWaking(cx,cz,seed=DEFAULT_SEED){
 const blocks=new Uint8Array(SIZE*SIZE*HEIGHT),light=new Uint8Array(blocks.length);
 for(let z=0;z<SIZE;z++)for(let x=0;x<SIZE;x++){const wx=cx*SIZE+x,wz=cz*SIZE+z;column(wx,wz,seed);let sun=15;for(let y=HEIGHT-1;y>=0;y--){const i=index(x,y,z),b=wakingVoxel(wx,y,wz,seed);blocks[i]=b;if(b)sun=0;light[i]=sun;}}
 return {cx,cz,blocks,light,waking:true};
}
