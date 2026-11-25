// Canvas-only tests, including the actual immutable PNGs. No GPU required.
export async function testTextureAssets({assembleAtlas,loadAtlas},base){
 const assert=(v,m)=>{if(!v)throw Error(m);};
 const c=document.createElement('canvas');c.width=c.height=240;const ctx=c.getContext('2d');
 ctx.fillStyle='rgb(232,232,232)';ctx.fillRect(0,0,240,240);ctx.fillStyle='rgb(254,254,254)';ctx.fillRect(0,0,120,120);
 const levels=assembleAtlas([{canvas:c,average:237.5}]);let edgeComparisons=0,isolatedPixels=0,collapsedPixels=0;
 for(let l=0;l<=8;l++){
  const size=2048>>l,step=256>>l,g=8>>l,content=240>>l,d=levels[l].getContext('2d').getImageData(0,0,size,size).data;
  const at=(x,y)=>d[(y*size+x)*4];
  for(let y=0;y<size;y++)for(let x=0;x<size;x++){
   if(x>=step||y>=step){assert(at(x,y)===255,'adjacent tile isolation');isolatedPixels++;}
   else if(l<4&&(x<g||y<g||x>=g+content||y>=g+content)){const xx=Math.max(g,Math.min(g+content-1,x)),yy=Math.max(g,Math.min(g+content-1,y));assert(at(x,y)===at(xx,yy),'patterned gutter');edgeComparisons++;}
   else if(l>=4){assert(at(x,y)===238,'flat average collapse');collapsedPixels++;}
  }
 }
 let loaded=0;const sizes=[];const result=await loadAtlas(async url=>{const r=await fetch(url);assert(r.ok,'PNG fetch '+url);const image=await createImageBitmap(await r.blob());sizes.push([url.pathname.split('/').pop(),image.width,image.height]);loaded++;return image;},base);
 assert(!result.fallback&&loaded===17,'actual atlas load');assert(result.levels.length===12,'real mip chain');
 return {edgeComparisons,isolatedPixels,collapsedPixels,loaded,sizes,actualLoad:true};
}
