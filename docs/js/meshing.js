import {SIZE,HEIGHT,index,voxelAt,hash} from './generation.js';
// Mesh reads mutable block/light arrays. Future edits call mesh(chunk,seed) again.
const faces=[
 {n:[1,0,0],v:[[1,0,0],[1,1,0],[1,1,1],[1,0,1]],shade:.78},
 {n:[-1,0,0],v:[[0,0,1],[0,1,1],[0,1,0],[0,0,0]],shade:.61},
 {n:[0,1,0],v:[[0,1,1],[1,1,1],[1,1,0],[0,1,0]],shade:1},
 {n:[0,-1,0],v:[[0,0,0],[1,0,0],[1,0,1],[0,0,1]],shade:.47},
 {n:[0,0,1],v:[[1,0,1],[1,1,1],[0,1,1],[0,0,1]],shade:.84},
 {n:[0,0,-1],v:[[0,0,0],[0,1,0],[1,1,0],[1,0,0]],shade:.7}
];
// Linear-ish matte palette: sage teal, ochre, rose, basalt, bark, muted foliage.
const palette=[[0,0,0],[.30,.52,.43],[.57,.36,.22],[.54,.30,.29],[.075,.09,.12],[.26,.20,.17],[.25,.40,.32]];
export function mesh(chunk,seed) {
 const {cx,cz,blocks,light}=chunk,positions=[],colors=[];
 const at=(x,y,z)=>y<0?2:y>=HEIGHT?0:(x>=0&&z>=0&&x<SIZE&&z<SIZE?blocks[index(x,y,z)]:voxelAt(cx*SIZE+x,y,cz*SIZE+z,seed));
 for(let y=0;y<HEIGHT;y++)for(let z=0;z<SIZE;z++)for(let x=0;x<SIZE;x++) {
  const i=index(x,y,z),id=blocks[i];if(!id)continue;
  const tint=.94+hash(cx*SIZE+x,cz*SIZE+z,seed+id)*.10;
  for(const f of faces) {
   const [nx,ny,nz]=f.n;if(at(x+nx,y+ny,z+nz))continue;
   const axes=[0,1,2].filter(a=>f.n[a]===0),p=[x,y,z];
   const shades=f.v.map(v=>{
    const a=[...p],b=[...p],c=[...p];
    for(let j=0;j<3;j++)a[j]+=f.n[j],b[j]+=f.n[j],c[j]+=f.n[j];
    a[axes[0]]+=v[axes[0]]?1:-1;b[axes[1]]+=v[axes[1]]?1:-1;
    c[axes[0]]+=v[axes[0]]?1:-1;c[axes[1]]+=v[axes[1]]?1:-1;
    const s1=!!at(...a),s2=!!at(...b),co=!!at(...c);
    const ao=s1&&s2?.68:1-.10*(Number(s1)+Number(s2)+Number(co));
    return f.shade*ao*tint*(.82+.18*light[i]/15);
   });
   for(const k of [0,1,2,0,2,3]) {
    const v=f.v[k];positions.push(x+v[0]+cx*SIZE,y+v[1],z+v[2]+cz*SIZE);
    for(const c of palette[id])colors.push(c*shades[k]);
   }
  }
 }
 return {positions:new Float32Array(positions),colors:new Float32Array(colors)};
}
