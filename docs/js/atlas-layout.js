// THREE-free atlas contract. Cell zero is exact white, including fallback.
export const ATLAS_SIZE=2048, GRID=8, CELL=256, GUTTER=8, CONTENT=240;
export const TEXTURES=Object.freeze(['','grass-top','grass-side','dirt','stone','echostone-strata','echostone-chamber','log','leaves','flora','sparkstone','monolith','snow','hearthglow-ore','dryfiber','wood-plank','workbench','door']);
export const RESERVED=Object.freeze(['fence','hearth','sunseed']);
// Directions: +X,-X,+Y,-Y,+Z,-Z. Object faces never share mutable descriptors.
const all=n=>[n,n,n,n,n,n];
const mapping={1:[2,2,1,3,2,2],11:[2,2,1,3,2,2],2:all(4),3:all(4),9:all(4),13:all(4),12:[5,5,6,6,5,5],5:all(7),6:all(8),7:all(9),8:all(9),10:all(10),4:all(11),14:all(12),18:all(13),16:all(14),17:all(3),19:all(3),21:all(15),22:[15,15,15,15,17,17],23:[17,17,15,15,15,15],24:[15,15,16,15,15,15],15:all(0),20:all(0)};
export const BLOCK_FACES=Object.freeze(Object.fromEntries(Object.entries(mapping).map(([id,cells])=>[id,Object.freeze(cells.map(cell=>Object.freeze({cell})))])));
// Canvas rows run downward; texture UVs run upward (CanvasTexture.flipY=true).
export function atlasUV(cell,u,v){return [((cell%GRID)*CELL+GUTTER+u*CONTENT)/ATLAS_SIZE,1-(Math.floor(cell/GRID)*CELL+GUTTER+(1-v)*CONTENT)/ATLAS_SIZE];}
// Upright on vertical faces; +Y/-Y use X horizontally and Z vertically.
export function faceUV(n,v){return n[1]?[v[0],n[1]>0?1-v[2]:v[2]]:n[0]?[n[0]>0?v[2]:1-v[2],v[1]]:[n[2]>0?1-v[0]:v[0],v[1]];}
