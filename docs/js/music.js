// Asset music tuning: edit this block, or window.grin.music.config in the console.
export const musicConfig={
 crossfadeSeconds:4, nightStartSeconds:540,
 assetDirectory:'../assets/music/', extensions:['m4a','mp3','ogg','aac','wav'],
 gains:{'island-predawn':.7,'sunlit-meadow':.65,'first-night':.7,'deep-forest':.65,'frost-peaks':.65,'canyon-dusk':.65,'first-dawn':.7,'underfoot':.65,'hearthside':.65,'monolith':.7},
 themes:{island:'island-predawn',dawn:'first-dawn',night:'first-night',fallback:'sunlit-meadow'},
 biomes:{meadow:'sunlit-meadow',forest:'deep-forest','frost peaks':'frost-peaks',canyon:'canyon-dusk',desert:'canyon-dusk'},
 dawnPhase:'Dawn',
 // Priority: island, monolith, underground, dawn, night hearth, night, biome.
 // Hearth uses the existing lit-hearth proximity test (five blocks).
 // Underground and monolith are placeholders: no certain cheap event signal.
 optional:{hearthside:{enabled:true,theme:'hearthside'},underfoot:{enabled:false,theme:'underfoot'},monolith:{enabled:false,theme:'monolith'}}
};
export function createMusic(){return {
 config:musicConfig,context:null,bus:null,buffers:new Map(),voices:[],theme:null,request:0,state:{waking:false},
 unlock(context,bus){if(!this.context&&context&&bus){this.context=context;this.bus=bus;}},
 choose(s){const c=this.config,o=c.optional;if(!s.waking)return c.themes.island;
 if(o.monolith.enabled&&s.monolith)return o.monolith.theme;
 if(o.underfoot.enabled&&s.underground)return o.underfoot.theme;
 if(s.phase===c.dawnPhase)return c.themes.dawn;
 if(s.seconds>=c.nightStartSeconds)return o.hearthside.enabled&&s.nearHearth?o.hearthside.theme:c.themes.night;
 return c.biomes[String(s.biome||'').toLowerCase()]||c.themes.fallback;},
 load(theme){if(this.buffers.has(theme))return this.buffers.get(theme);
 const task=(async()=>{for(const ext of this.config.extensions){try{
 const r=await fetch(new URL(this.config.assetDirectory+theme+'.'+ext,import.meta.url));
 if(!r.ok)continue;return await this.context.decodeAudioData(await r.arrayBuffer());
 }catch{}}return null;})();this.buffers.set(theme,task);return task;},
 update(state){this.state=state;if(!this.context||this.context.state!=='running')return;
 const theme=this.choose(state);if(theme===this.theme)return;this.theme=theme;
 this.change(theme).catch(()=>{});},
 remove(v){try{v.source.stop();}catch{}try{v.source.disconnect();v.gain.disconnect();}catch{}
 this.voices=this.voices.filter(x=>x!==v);},
 level(v,now){const p=Math.min(1,Math.max(0,(now-v.start)/Math.max(.0001,v.end-v.start)));return v.from+(v.to-v.from)*p;},
 ramp(v,to,now,fade){const from=this.level(v,now),p=v.gain.gain;p.cancelScheduledValues(now);p.setValueAtTime(from,now);p.linearRampToValueAtTime(to,now+fade);Object.assign(v,{from,to,start:now,end:now+fade});},
 async change(theme){const request=++this.request,buffer=await this.load(theme);
 if(request!==this.request||theme!==this.theme)return;
 const a=this.context,now=a.currentTime,c=this.config,fade=Number.isFinite(c.crossfadeSeconds)?Math.max(0,c.crossfadeSeconds):4;
 // Stop any already retiring source before starting another: at most two voices.
 for(const v of [...this.voices])if(v.retiring)this.remove(v);
 for(const v of this.voices){v.retiring=true;this.ramp(v,0,now,fade);v.source.stop(now+fade);}
 if(!buffer)return;
 const source=a.createBufferSource(),gain=a.createGain();source.buffer=buffer;source.loop=true;gain.gain.setValueAtTime(0,now);
 source.connect(gain).connect(this.bus);const v={source,gain,retiring:false,from:0,to:0,start:now,end:now};
 source.onended=()=>this.remove(v);this.voices.push(v);
 const level=Number(c.gains[theme]??1);this.ramp(v,Number.isFinite(level)?Math.max(0,level):1,now,fade);source.start();
 },
 // Invalidate pending loads too; next update retries even a formerly missing file.
 // Call after adding assets or changing gains/mapping. Existing voices fade normally.
 reload(){this.request++;this.buffers.clear();this.theme=null;}
};}
