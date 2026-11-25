import {assembleAtlas,detailCell,loadAtlas,atlasTexture} from './terrain-atlas.js';
import {atlasUV,faceUV,TEXTURES,BLOCK_FACES} from './atlas-layout.js';
const assert=(v,m)=>{if(!v)throw new Error(m);};
export async function testAtlas(){
 const cells=Array.from({length:64},(_,i)=>{const c=document.createElement('canvas');c.width=c.height=240;const x=c.getContext('2d');x.fillStyle='rgb('+(230+i%26)+','+(230+i%26)+','+(230+i%26)+')';x.fillRect(0,0,240,240);return {canvas:c,average:230+i%26};});
 const levels=assembleAtlas(cells);let gutterPixels=0,flatPixels=0,whitePixels=0;
 for(let l=0;l<9;l++){const c=levels[l],s=256>>l,g=8>>l,n=240>>l,d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;
  for(let cell=0;cell<64;cell++)for(let y=0;y<s;y++)for(let x=0;x<s;x++){
   const p=4*((Math.floor(cell/8)*s+y)*c.width+(cell%8)*s+x),v=Math.round(cells[cell].average);
   assert(d[p]===v&&d[p+1]===v&&d[p+2]===v&&d[p+3]===255,'cell placement/isolation '+l+':'+cell);
   if(l>=4)flatPixels++;else if(x<g||y<g||x>=g+n||y>=g+n)gutterPixels++;
  }
 }
 const source=cells[1].canvas,x=source.getContext('2d');x.fillStyle='#f01090';x.fillRect(0,0,120,240);const detail=detailCell(source),d=detail.canvas.getContext('2d').getImageData(0,0,240,240).data;
 for(let i=0;i<d.length;i+=4)assert(d[i]===d[i+1]&&d[i]===d[i+2]&&d[i]>=230&&d[i]<=255,'near-white grayscale');
 const fail=await loadAtlas(()=>Promise.reject(new Error('injected')),new URL('https://example.com/'));
 assert(fail.fallback,'failure flag');for(const c of fail.levels){const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;for(let i=0;i<d.length;i++)assert(d[i]===255,'white fallback');whitePixels+=d.length/4;}
 const THREE={CanvasTexture:class{constructor(image){this.image=image;}},LinearFilter:1,LinearMipmapLinearFilter:2,SRGBColorSpace:'srgb'},t=atlasTexture(THREE,levels);
 assert(t.mipmaps.length===12&&!t.generateMipmaps&&t.anisotropy===1&&t.magFilter===1&&t.minFilter===2&&t.colorSpace==='srgb','filter contract');
 assert(TEXTURES.length===18&&Object.isFrozen(BLOCK_FACES[1][0]),'immutable manifest');
 return {levels:levels.map(c=>c.width),gutterPixels,flatPixels,whitePixels,detailPixels:d.length/4,fallback:true,filters:true};
}
