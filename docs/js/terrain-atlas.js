import {ATLAS_SIZE,GRID,CELL,GUTTER,CONTENT,TEXTURES} from './atlas-layout.js';
// No Three import: assembly and failure paths are CPU-testable without WebGL.
const canvas=n=>{const c=document.createElement('canvas');c.width=c.height=n;return c;};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function detailCell(image){
 const c=canvas(CONTENT),ctx=c.getContext('2d',{willReadFrequently:true});
 ctx.drawImage(image,0,0,CONTENT,CONTENT);
 const pixels=ctx.getImageData(0,0,CONTENT,CONTENT),d=pixels.data;
 let mean=0;for(let i=0;i<d.length;i+=4)mean+=.2126*d[i]+.7152*d[i+1]+.0722*d[i+2];mean/=CONTENT*CONTENT;
 let average=0;for(let i=0;i<d.length;i+=4){const l=.2126*d[i]+.7152*d[i+1]+.0722*d[i+2],v=Math.round(clamp(250+(l-mean)*.18,230,255));d[i]=d[i+1]=d[i+2]=v;d[i+3]=255;average+=v;}
 ctx.putImageData(pixels,0,0);return {canvas:c,average:average/(CONTENT*CONTENT)};
}
export function assembleAtlas(cells=[]){
 const levels=[];const averages=Array.from({length:64},(_,i)=>cells[i]?.average??255);
 for(let level=0;level<=11;level++){
  const size=ATLAS_SIZE>>level,c=canvas(size),ctx=c.getContext('2d');ctx.fillStyle='white';ctx.fillRect(0,0,size,size);
  if(level<=8){const step=CELL>>level;
   for(let cell=0;cell<64;cell++){
    const x=(cell%GRID)*step,y=Math.floor(cell/GRID)*step,source=cells[cell];
    if(level>=4||!source){const a=averages[cell];ctx.fillStyle='rgb('+a+','+a+','+a+')';ctx.fillRect(x,y,step,step);continue;}
    const gutter=GUTTER>>level,content=CONTENT>>level,tile=canvas(content),tc=tile.getContext('2d');
    tc.drawImage(source.canvas,0,0,content,content);
    const pixels=tc.getImageData(0,0,content,content),d=pixels.data,fade=[1,.8,.55,.3][level];
    for(let i=0;i<d.length;i+=4){const v=Math.round(source.average+(d[i]-source.average)*fade);d[i]=d[i+1]=d[i+2]=v;d[i+3]=255;}tc.putImageData(pixels,0,0);
    ctx.drawImage(tile,x+gutter,y+gutter);
    // Extrude all four edges and all four corners afresh at each detailed level.
    ctx.drawImage(tile,0,0,1,content,x,y+gutter,gutter,content);ctx.drawImage(tile,content-1,0,1,content,x+gutter+content,y+gutter,gutter,content);
    ctx.drawImage(tile,0,0,content,1,x+gutter,y,content,gutter);ctx.drawImage(tile,0,content-1,content,1,x+gutter,y+gutter+content,content,gutter);
    for(const sx of [0,content-1])for(const sy of [0,content-1])ctx.drawImage(tile,sx,sy,1,1,x+(sx?gutter+content:0),y+(sy?gutter+content:0),gutter,gutter);
   }
  }else{
   // Beyond one texel/cell, average only flat cell means, never source detail.
   ctx.drawImage(levels[8],0,0,size,size);
  }
  levels.push(c);
 }
 return levels;
}
function imageAt(url){return new Promise((resolve,reject)=>{const image=new Image();const timer=setTimeout(()=>{image.src='';reject(new Error('Texture timeout: '+url));},15000);image.onload=()=>{clearTimeout(timer);resolve(image);};image.onerror=()=>{clearTimeout(timer);reject(new Error('Texture load failed: '+url));};image.src=url;});}
export async function loadAtlas(load=imageAt,base=new URL('../assets/textures/',import.meta.url)){
 try{const cells=await Promise.all(TEXTURES.map(async(name,i)=>i?detailCell(await load(new URL(name+'.png',base))):null));return {levels:assembleAtlas(cells),fallback:false};}
 catch(error){console.warn('Terrain detail unavailable; using white atlas.',error);return {levels:assembleAtlas(),fallback:true};}
}
export function atlasTexture(THREE,levels){
 const texture=new THREE.CanvasTexture(levels[0]);texture.mipmaps=levels;texture.generateMipmaps=false;
 texture.magFilter=THREE.LinearFilter;texture.minFilter=THREE.LinearMipmapLinearFilter;texture.anisotropy=1;texture.colorSpace=THREE.SRGBColorSpace;texture.needsUpdate=true;return texture;
}

