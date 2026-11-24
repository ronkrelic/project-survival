import {SIZE,HEIGHT,index,voxelAt,wakingVoxel,hash} from './generation.js';
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
const palette=[[0,0,0],[.30,.52,.43],[.57,.36,.22],[.54,.30,.29],[.075,.09,.12],[.26,.20,.17],[.25,.40,.32],[.18,.85,.78],[.64,.38,.88],[.25,.16,.17],[.78,.76,.55],[.16,.34,.27],[.58,.28,.20],[.57,.61,.60],[.77,.85,.87],[.65,.47,.25],[.37,.49,.29],[.20,.15,.12],[.42,.65,.57],[.33,.23,.18],[.78,.76,.55],[.46,.32,.23],[.48,.34,.25],[.48,.34,.25],[.46,.32,.23]];
export function mesh(chunk,seed) {
 const {cx,cz,blocks,light}=chunk,positions=[],colors=[];
 const at=(x,y,z)=>y<0?2:y>=HEIGHT?0:(x>=0&&z>=0&&x<SIZE&&z<SIZE?blocks[index(x,y,z)]:(chunk.halo?.[`${x},${y},${z}`]??(chunk.waking?wakingVoxel:voxelAt)(cx*SIZE+x,y,cz*SIZE+z,seed)));
 for(let y=0;y<HEIGHT;y++)for(let z=0;z<SIZE;z++)for(let x=0;x<SIZE;x++) {
  const i=index(x,y,z),id=blocks[i];if(!id)continue;
  const band=id===9?(y%2?.72:1.08):1;
  const tint=band*(.94+hash(cx*SIZE+x,cz*SIZE+z,seed+id)*.10);
  if([21,22,23,24].includes(id)){
   const boxes=id===24?[[.05,.62,.05,.95,.80,.95],[.12,0,.12,.28,.62,.28],[.72,0,.12,.88,.62,.28],[.12,0,.72,.28,.62,.88],[.72,0,.72,.88,.62,.88],[.18,.22,.18,.82,.32,.82]]:id===21?[[.40,0,.40,.60,.95,.60],[0,.30,.44,1,.43,.56],[0,.65,.44,1,.78,.56]]:id===22?[[.06,0,.43,.94,1,.57],[.72,.43,.57,.80,.53,.63]]:[[.06,0,.06,.20,1,.94],[.20,.43,.72,.26,.53,.80]];
   for(const b of boxes)for(const f of faces)for(const k of [0,1,2,0,2,3]){const v=f.v[k];positions.push(cx*SIZE+x+b[0]+v[0]*(b[3]-b[0]),y+b[1]+v[1]*(b[4]-b[1]),cz*SIZE+z+b[2]+v[2]*(b[5]-b[2]));for(const c of palette[id])colors.push(c*f.shade*tint*(.82+.18*light[i]/15));}
   continue;
  }
  for(const f of faces) {
   const [nx,ny,nz]=f.n;const neighbor=at(x+nx,y+ny,z+nz);if(neighbor&&![21,22,23,24].includes(neighbor))continue;
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
   if(id===17&&ny===1){for(let row=0;row<6;row++){const a=row/6,b=(row+1)/6,vs=[[0,1,b],[1,1,b],[1,1,a],[0,1,a]];for(const k of [0,1,2,0,2,3]){const v=vs[k];positions.push(x+v[0]+cx*SIZE,y+1,z+v[2]+cz*SIZE);for(const c of palette[id])colors.push(c*shades[k]*(row%2?.76:1.12));}}continue;}
   for(const k of [0,1,2,0,2,3]) {
    const v=f.v[k];positions.push(x+v[0]+cx*SIZE,y+v[1],z+v[2]+cz*SIZE);
    for(const c of palette[id])colors.push(c*shades[k]);
   }
  }
 }
 return {positions:new Float32Array(positions),colors:new Float32Array(colors)};
}
