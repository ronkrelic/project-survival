// Authored tutorial island: one metre per voxel. Seed is compatibility-only.
export const SIZE=32, HEIGHT=112, MIN_CHUNK=-4, MAX_CHUNK=3;
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
 if(d<26){const shelter=(z>2||Math.abs(x)>10)?Math.min(4,Math.floor(Math.max(0,d-7)/3)):0;h=40+shelter;}
 if(Math.abs(x-12)<12&&z<-48&&z>-77)h=43;
 return h;
}
export function voxelAt(x,y,z,seed){
 if(y<0||y>=HEIGHT||x<MIN_CHUNK*SIZE||x>=(MAX_CHUNK+1)*SIZE||z<MIN_CHUNK*SIZE||z>=(MAX_CHUNK+1)*SIZE)return 0;
 const h=terrainHeight(x,z);if(h<0)return 0;
 const bottom=14+Math.floor(islandRadius(x,z)*16);
 if(y>=bottom&&y<=h)return y===h?1:(Math.floor(y/4)%2?2:3);
 const m=landmarks();if(Math.abs(x-m.x)<=2&&Math.abs(z-m.z)<=1&&y>43&&y<91)return 4;
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
