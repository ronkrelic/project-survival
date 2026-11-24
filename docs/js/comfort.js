// Stage Fourteen: pure comfort and personal-memory rules, with no world edits.
export const GARMENTS=Object.freeze({
 'meadowfold cloak':{slot:'body',color:0x83a68c,insulation:.35,cost:{dryfiber:8,'teal flora bits':2}},
 'heather hush hat':{slot:'head',color:0xb2a0bb,insulation:.20,cost:{dryfiber:5,'violet flora bits':1}}
});
export const WARMTH=Object.freeze({nightStart:600,nightEnd:780,night:.08,shower:.06,frost:.08,wet:.10,wetSeconds:45,recovery:.04,hearth:.50,max:100,hungerLean:.15});
const object=o=>o!==null&&typeof o==='object'&&!Array.isArray(o);
export function validWorn(o){return object(o)&&Object.keys(o).every(k=>['body','head'].includes(k))&&['body','head'].every(k=>o[k]==null||GARMENTS[o[k]]?.slot===k);}
export function cleanWorn(o){return {body:GARMENTS[o?.body]?.slot==='body'?o.body:null,head:GARMENTS[o?.head]?.slot==='head'?o.head:null};}
export function insulation(worn){return Object.values(cleanWorn(worn)).reduce((n,k)=>n+(GARMENTS[k]?.insulation||0),0);}
export function coldStep(cold,dt,{mainland=true,seconds=0,shower=0,frost=false,wet=false,hearth=false,worn={}}={}){
 if(!mainland)return 0;
 if(!Number.isFinite(dt)||dt<=0)return cold;
 const exposure=(seconds>=WARMTH.nightStart&&seconds<WARMTH.nightEnd?WARMTH.night:0)+WARMTH.shower*Math.max(0,Math.min(1,shower))+(frost?WARMTH.frost:0)+(wet?WARMTH.wet:0);
 const rate=exposure*(1-insulation(worn))-(exposure===0?WARMTH.recovery:0)-(hearth?WARMTH.hearth:0);
 return Math.max(0,Math.min(WARMTH.max,cold+rate*dt));
}
export const MOMENT_LIMIT=64;
export const MOMENT_LABELS=Object.freeze({firstFire:'the first hearth',monolith:'the waiting stone',guideNamed:'a name for your companion',characterNamed:'a name for the road',crossed:'the first crossing',firstDusk:'the first dusk',firstGarmentCrafted:'cloth shaped by hand',firstGarmentWorn:'a little warmth to carry'});
export function dayPhase(s){return s<60||s>=780?'dawn':s<540?'day':s<600?'dusk':'night';}
export function validMoments(a){return Array.isArray(a)&&a.length<=MOMENT_LIMIT&&new Set(a.map(m=>m?.id)).size===a.length&&a.every(m=>object(m)&&Object.keys(m).every(k=>['id','day','phase','name'].includes(k))&&typeof m.id==='string'&&/^[a-zA-Z][a-zA-Z0-9-]{0,47}$/.test(m.id)&&(m.day===null||Number.isSafeInteger(m.day)&&m.day>0)&&(m.phase===null||['dawn','day','dusk','night'].includes(m.phase))&&(m.name===undefined||typeof m.name==='string'&&Array.from(m.name).length<=16));}
export function keepMoment(moments,id,day,phase,name){
 if(moments.length>=MOMENT_LIMIT||moments.some(m=>m.id===id))return false;
 const m={id,day,phase};if(name)m.name=Array.from(String(name)).slice(0,16).join('');
 if(!validMoments([m]))return false;moments.push(m);return true;
}
export function backfillMoments(s,moments,echo=()=>{}){
 const a=s.arc||{},flags={firstFire:a.firstFire,monolith:a.monolith,guideNamed:a.named,characterNamed:!!s.name,crossed:a.crossed||s.crossed,firstDusk:a.firstDusk};
 for(const [id,set] of Object.entries(flags))if(set&&keepMoment(moments,id,null,null,id==='guideNamed'?s.guideName:id==='characterNamed'?s.name:undefined))echo(id);
}
