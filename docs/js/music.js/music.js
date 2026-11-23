// Batch Five — asset themes. Retune mapping, fade and levels here.
export const musicConfig={crossfadeSeconds:4,gains:{'island-predawn':.7,'sunlit-meadow':.65,'first-night':.7},
 themes:{island:'island-predawn',day:'sunlit-meadow',night:'first-night'},nightStartSeconds:540,extensions:['m4a','mp3','ogg','aac','wav']};
export function createMusic(){return {config:musicConfig,context:null,bus:null,buffers:new Map(),voices:[],theme:null,request:0,state:{waking:false,phase:'night',biome:'Island'},
 unlock(context,bus){if(this.context)return;this.context=context;this.bus=bus;},
 async load(theme){if(this.buffers.has(theme))return this.buffers.get(theme);const task=(async()=>{for(const ext of this.config.extensions){try{const r=await fetch(new URL('../assets/music/'+theme+'.'+ext,import.meta.url));if(!r.ok)continue;return await this.context.decodeAudioData(await r.arrayBuffer());}catch{}}return null;})();this.buffers.set(theme,task);return task;},
 update(state){this.state=state;const c=this.config,theme=!state.waking?c.themes.island:state.seconds>=c.nightStartSeconds?c.themes.night:c.themes.day;if(!this.context||this.context.state!=='running'||this.theme===theme)return;this.theme=theme;this.change(theme);},
 async change(theme){const request=++this.request,buffer=await this.load(theme);if(this.theme!==theme||request!==this.request)return;const a=this.context,now=a.currentTime,fade=Math.max(.05,Number(this.config.crossfadeSeconds)||4);
 // Retiring voices are stopped before another fade: never more than two sources.
 for(const v of this.voices.filter(v=>v.retiring)){try{v.source.stop();}catch{}v.source.disconnect();v.gain.disconnect();}
 this.voices=this.voices.filter(v=>!v.retiring);
 for(const v of this.voices){v.retiring=true;v.gain.gain.cancelAndHoldAtTime(now);v.gain.gain.linearRampToValueAtTime(0,now+fade);v.source.stop(now+fade);}
 if(!buffer)return;const source=a.createBufferSource(),gain=a.createGain();source.buffer=buffer;source.loop=true;gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(Math.max(0,this.config.gains[theme]??1),now+fade);source.connect(gain).connect(this.bus);const voice={source,gain,retiring:false};this.voices.push(voice);source.onended=()=>{source.disconnect();gain.disconnect();this.voices=this.voices.filter(v=>v!==voice);};source.start();},
 // Call after adding/replacing files without a page reload; missing themes stay quiet.
 reload(){this.buffers.clear();this.theme=null;}
};}
