// Personal discoveries only: no world ledger or network dependencies.
import {MOMENT_LABELS} from './comfort.js';
export const PLACE_LIMIT=32,LABEL_LIMIT=8;
const phases=['dawn','day','dusk','night'];
const nameOf=s=>Array.from(String(s).trim()).slice(0,16).join('');
export function validPlaces(a){return Array.isArray(a)&&a.length<=PLACE_LIMIT&&a.every(p=>p&&typeof p==='object'&&!Array.isArray(p)&&Object.keys(p).length===6&&['name','x','y','z','day','phase'].every(k=>Object.hasOwn(p,k))&&typeof p.name==='string'&&p.name===nameOf(p.name)&&!!p.name&&[p.x,p.z].every(n=>Number.isFinite(n)&&Math.abs(n)<=100000)&&Number.isFinite(p.y)&&Math.abs(p.y)<=1000&&Number.isSafeInteger(p.day)&&p.day>0&&phases.includes(p.phase));}
export function changePlace(places,index,text,spot,day,phase){
 const name=nameOf(text);if(!name)return 'cancelled';
 if(index!==null){if(!places[index])return 'missing';places[index].name=name;return 'renamed';}
 if(places.length>=PLACE_LIMIT)return 'full';
 const p={name,x:spot.x,y:spot.y,z:spot.z,day,phase};if(!validPlaces([p]))return 'invalid';
 places.push(p);return 'created';
}
export function forgetPlace(places,index){if(!Number.isInteger(index)||index<0||index>=places.length)return false;places.splice(index,1);return true;}
export const PLACE_MOMENT='a place given a name';
export const AHEAD=Object.freeze({
 firstFire:'a first fire, still waiting',monolith:'a quiet stone, holding its hush',
 guideNamed:'a companion’s name, not yet given',characterNamed:'a name for the road, if one comes',
 crossed:'a farther shore, folded in mist',firstDusk:'a first dusk, still gathering',
 firstGarmentCrafted:'a little cloth, waiting for your hands',firstGarmentWorn:'a little warmth, waiting to travel',
 firstPlaceNamed:'a place, waiting for a name'
});
export function memoryDate(m){return m.day===null?'before the counting':'day '+m.day+' · '+m.phase;}
export function memoryContent(moments,places){
 const ids=new Set(moments.map(m=>m.id));return {
 kept:moments.map(m=>(m.id==='firstPlaceNamed'?PLACE_MOMENT:MOMENT_LABELS[m.id]||'a quiet moment')+(m.name?' — '+m.name:'')+' · '+memoryDate(m)),
 ahead:Object.entries(AHEAD).filter(([id])=>!ids.has(id)).map(([,hint])=>hint),
 places:places.map(p=>p.name+' · '+memoryDate(p))};
}
// project returns clip coordinates including w; reject behind-camera points explicitly.
export function projectPlaces(places,eye,project,width,height){
 return places.map((p,index)=>({p,index,d:Math.hypot(p.x-eye.x,p.y-eye.y,p.z-eye.z)}))
 .filter(p=>p.d<64).sort((a,b)=>a.d-b.d).map(({p,index,d})=>{
  const q=project(p.x,p.y+1.8,p.z);if(!(q.w>0)||q.z<=-1||q.z>=1||Math.abs(q.x)>=.94||Math.abs(q.y)>=.90)return null;
  return {index,left:(q.x*.5+.5)*width,top:(-q.y*.5+.5)*height,opacity:.78*Math.min(1,Math.max(0,(64-d)/24))};
 }).filter(Boolean).slice(0,LABEL_LIMIT);
}
export function createPersonalPages(api){
 const style=document.createElement('style');style.textContent= '#personal-tools{position:fixed;right:20px;top:294px;z-index:13;display:flex;gap:8px}'+
 '#personal-tools button{margin:0;padding:7px 12px;font:12px Georgia;background:#eadcc5;color:#514c49;border:1px solid #aa9475;border-radius:10px}'+
 '.personal-page{position:fixed;z-index:27;left:50%;top:50%;transform:translate(-50%,-50%);box-sizing:border-box;width:min(540px,92vw);max-height:80vh;overflow:auto;padding:24px;background:#eadcc5f5;color:#514c49;border:2px solid #aa9475;border-radius:14px;box-shadow:0 8px 35px #302e3540;font:16px/1.5 Georgia}'+
 '.personal-page[hidden],#personal-tools[hidden]{display:none}.personal-page h2{font-size:23px;margin:0 0 12px}.personal-page h3{font-size:15px;letter-spacing:.08em;border-bottom:1px solid #aa9475}.personal-page p{font-size:13px}.personal-page li{margin:10px 0;overflow-wrap:anywhere}'+
 '.personal-page button{display:inline-block;margin:6px;padding:8px 14px;background:#d9c59b;color:#514c49;border:1px solid #aa9475;border-radius:8px;font:14px Georgia}.personal-page input{width:100%;background:#f7ecd7;color:#514c49;border:1px solid #aa9475;font:18px Georgia}.personal-page :focus-visible,#personal-tools :focus-visible{outline:2px solid #d49b54;outline-offset:3px}'+
 '.private-place-label{position:fixed;z-index:7;pointer-events:none;color:#eadcc5;background:#514c4940;padding:3px 8px;border-radius:10px;font:13px Georgia;letter-spacing:.04em;text-shadow:0 1px 6px #514c49;transform:translate(-50%,-100%);max-width:160px;overflow-wrap:anywhere}';document.head.append(style);
 const tools=document.createElement('nav');tools.id='personal-tools';tools.setAttribute('aria-label','Personal discoveries');tools.hidden=true;
 const button=(text,parent,fn)=>{const b=document.createElement('button');b.type='button';b.textContent=text;b.onclick=fn;parent.append(b);return b;};
 const page=(id,title)=>{const p=document.createElement('section');p.id=id;p.className='personal-page';p.hidden=true;p.setAttribute('role','dialog');p.setAttribute('aria-modal','true');p.setAttribute('aria-labelledby',id+'-title');const h=document.createElement('h2');h.id=id+'-title';h.textContent=title;p.append(h);document.body.append(p);return p;};
 const book=page('personal-memories','Memories'),editor=page('personal-place','A name for this place');
 const note=document.createElement('p');note.textContent='Kept only by you, in this browser. The world keeps moving.';book.append(note);
 const sections={};for(const title of ['KEPT','AHEAD','PLACES']){const h=document.createElement('h3'),list=document.createElement('ul');h.textContent=title;book.append(h,list);sections[title]=list;}
 const input=document.createElement('input');input.id='private-place-name';input.maxLength=16;input.autocomplete='off';const label=document.createElement('label');label.htmlFor=input.id;label.textContent='Place name · up to 16 characters';editor.append(label,input);
 const help=document.createElement('p');help.textContent='A blank name leaves things as they are.';editor.append(help);
 const status=document.createElement('p');status.setAttribute('role','status');editor.append(status);
 let active=null,returnTo=null,index=null,spot=null,bookStamp='';
 function close(){if(!active)return;active.hidden=true;active=null;for(const b of [nameButton,bookButton])b.setAttribute('aria-expanded','false');api.save();returnTo?.focus();}
 function open(p,from){api.prepare();if(active)active.hidden=true;active=p;returnTo=from;p.hidden=false;nameButton.setAttribute('aria-expanded',String(p===editor));bookButton.setAttribute('aria-expanded',String(p===book));(p.querySelector('input,button')||p).focus();}
 function render(){const s=api.read();bookStamp=JSON.stringify([s.moments,s.places]);const content=memoryContent(s.moments,s.places);for(const [key,rows,empty] of [['KEPT',content.kept,'The page is quiet, for now.'],['AHEAD',content.ahead,'The road still has room for ordinary wonders.'],['PLACES',content.places,'No places named yet.']]){
  const list=sections[key];list.replaceChildren();for(const [i,text] of (rows.length?rows:[empty]).entries()){const li=document.createElement('li');li.append(document.createTextNode(text));if(key==='PLACES'&&rows.length){button('Rename',li,()=>name(i));button('Forget',li,()=>{api.forget(i);render();});}list.append(li);}
 }}
 function name(i=null){const s=api.read();if(i===null&&!s.canName)return;index=i;spot={...s.spot};input.value=i===null?'':s.places[i].name;status.textContent='';open(editor,i===null?nameButton:bookButton);input.focus();}
 button('Keep this name',editor,()=>{const result=api.change(index,input.value,spot);if(result==='full'){status.textContent='Thirty-two places kept. Forget one in Memories to make room.';return;}if(['invalid','missing'].includes(result)){status.textContent='This place is out of reach for now.';return;}close();});
 button('Cancel / Esc',editor,close);button('Close / Esc',book,close);
 const nameButton=button('Name this place',tools,()=>name()),bookButton=button('Memories',tools,()=>{render();open(book,bookButton);});
 for(const [b,p] of [[nameButton,editor],[bookButton,book]]){b.setAttribute('aria-controls',p.id);b.setAttribute('aria-expanded','false');}
 document.body.append(tools);
 const labels=Array.from({length:LABEL_LIMIT},()=>{const n=document.createElement('div');n.className='private-place-label';n.setAttribute('aria-hidden','true');n.hidden=true;document.body.append(n);return n;});
 return {get active(){return active;},key(e){e.stopImmediatePropagation();if(e.code==='Escape'){e.preventDefault();close();}if(e.code==='Tab'){
  const all=[...active.querySelectorAll('input,button')].filter(n=>!n.disabled),first=all[0],last=all.at(-1);
  if(!active.contains(document.activeElement)){e.preventDefault();first.focus();}
  else if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
 }},update(visible,projected){if(active===book){const s=api.read();if(bookStamp!==JSON.stringify([s.moments,s.places]))render();}tools.hidden=!visible;nameButton.disabled=!api.read().canName;nameButton.title=api.read().canName?'Name this place':'Place names begin beyond the crossing.';if(!visible&&active)close();labels.forEach((n,i)=>{const q=visible&&!active?projected[i]:null;n.hidden=!q;if(!q)return;n.textContent=api.read().places[q.index].name;n.style.left=q.left+'px';n.style.top=q.top+'px';n.style.opacity=q.opacity;});}};
}
