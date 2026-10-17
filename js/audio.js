// --- Web Audio API Synthesizer & Sound FX ---
let SND=true,AC=null;
try{SND=localStorage.getItem("dsa-snd")!=="0"}catch(e){}

function ac(){
  if(!AC){
    try{AC=new(window.AudioContext||window.webkitAudioContext)()}catch(e){return null}
  }
  if(AC.state==="suspended")AC.resume();
  return AC;
}

function tone(f,d=.12,type="sine",vol=.12,at=0,slide=0){
  if(!SND)return;
  const c=ac();if(!c)return;
  const t=c.currentTime+at,o=c.createOscillator(),g=c.createGain();
  o.type=type;o.frequency.setValueAtTime(f,t);
  if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(40,f*slide),t+d);
  g.gain.setValueAtTime(.0001,t);
  g.gain.exponentialRampToValueAtTime(vol,t+.012);
  g.gain.exponentialRampToValueAtTime(.0001,t+d);
  o.connect(g);g.connect(c.destination);
  o.start(t);o.stop(t+d+.03);
}

const arp=(fs,type="triangle",vol=.13,gap=.085)=>fs.forEach((f,i)=>tone(f,.2,type,vol,i*gap));
const FAN=()=>arp([523,659,784,1047,1319]);
const OKS=()=>arp([659,784,1047]);
// Soft descending motif for empty/not-found
const BAD=()=>{tone(392,.22,"sine",.11);tone(330,.30,"sine",.10,.10)};

// Pitch multiplier so each algorithm runs in its own musical key
const THEME={bubble:1,selection:1.122,insertion:1.189,merge:1.335,linear:1,binary:1.498,bfs:1,dfs:1.122,dijkstra:1.335,prim:1.26,kruskal:1.414};
const th=k=>THEME[k]||1;

function pf(v){if(v==null)return 440;const lo=Math.min(...arr),hi=Math.max(...arr);return 220*Math.pow(2,2*(v-lo)/((hi-lo)||1))}
function valAt(s,i){for(let id=0;id<arr.length;id++)if(s.p[id]===i)return arr[id];return null}

function sfx(s){
  const t=s.t;if(!t)return;const f=a=>pf(valAt(s,a))*th(algo);
  if(t==="cmp"){const q=s.c.length?s.c:[0];tone(q.map(f).reduce((x,y)=>x+y,0)/q.length,.1,"sine",.11)}
  else if(t==="swap"){tone(f(s.w[0]),.12,"triangle",.14);if(s.w[1]!==undefined&&s.w[1]!==s.w[0])tone(f(s.w[1]),.12,"triangle",.14,.07)}
  else if(t==="shift"||t==="write")tone(f(s.w[0]),.13,"triangle",.14);
  else if(t==="place")tone(s.w&&s.w.length?Math.min(1500,f(s.w[0])*1.5):988,.18,"sine",.12);
  else if(t==="pass")tone(170,.1,"sine",.08);
  else if(t==="key")tone(f(s.h),.12,"sawtooth",.06);
  else if(t==="min")tone(Math.min(1500,f(s.h)*1.5),.1,"square",.05);
  else if(t==="split")tone(280,.06,"square",.04);
  else if(t==="mid")tone(520,.12,"sine",.12);
  else if(t==="merge")tone(330,.18,"triangle",.1,0,.7);
  else if(t==="found")OKS();else if(t==="nf")BAD();else if(t==="done")FAN();
}

function dsSfx(op){
  const mk=k=>({Push:"push",Enqueue:"enqueue",Pop:"pop",Dequeue:"dequeue",Peek:"peek",
    "Push Front":"pushF","Pop Back":"popB",
    "Insert Head":"insH","Insert Tail":"insT","Insert Before":"insB","Insert After":"insA","Delete Head":"delH","Delete Tail":"delT",Search:"search",
    tick:"tick",add:"add",rem:"rem",ok:"ok",nf:"nf",err:"err"}[k]||k);
  const k=mk(op);
  switch(k){
    case "push":      tone(392,.10,"triangle",.13); tone(523,.16,"triangle",.13,.07); break;
    case "pop":       tone(523,.10,"triangle",.13); tone(392,.18,"triangle",.12,.07); break;
    case "peek":      tone(659,.12,"sine",.10); break;
    case "enqueue":   tone(330,.10,"triangle",.13); tone(494,.16,"triangle",.13,.07); break;
    case "dequeue":   tone(494,.10,"triangle",.13); tone(330,.18,"triangle",.12,.07); break;
    case "pushF":     tone(294,.10,"triangle",.13); tone(440,.16,"triangle",.13,.07); break;
    case "popB":      tone(440,.10,"triangle",.13); tone(294,.18,"triangle",.12,.07); break;
    case "insH":      tone(587,.10,"triangle",.14); break;
    case "insT":      arp([392,494,587,698],"triangle",.11,.06); break;
    case "insB":      tone(523,.10,"triangle",.13); tone(440,.14,"triangle",.12,.06); break;
    case "insA":      tone(523,.10,"triangle",.13); tone(659,.14,"triangle",.12,.06); break;
    case "delH":      tone(587,.10,"triangle",.14); tone(440,.12,"sine",.08,.06); break;
    case "delT":      arp([698,587,494,392],"triangle",.11,.06); break;
    case "search":    OKS(); break;
    case "ok":        OKS(); break;
    case "add":       tone(392,.10,"triangle",.14); tone(587,.16,"triangle",.14,.08); break;
    case "rem":       tone(587,.10,"triangle",.14); tone(392,.18,"triangle",.14,.08); break;
    case "tick":      tone(300,.06,"sine",.07); break;
    case "nf":        BAD(); break;
    case "err":       BAD(); break;
    default:          tone(300,.06,"sine",.06);
  }
}

function stepSfx(q,dir,last){
  if(!q)return;
  if(dir<0){tone(q.fl?(q.fl.d>0?392:523):330,.12,"sine",.12);return}
  if(last){if(TR.err)BAD();else{dsSfx(curOp);setTimeout(OKS,260)}return}
  if(q.fl)tone(q.fl.d>0?523:392,.12,"triangle",.14);
  else if(q.NEWI>=0)tone(659,.13,"triangle",.14);
  else if(q.HL>=0)tone(587,.11,"sine",.12);
  else tone(440,.09,"sine",.11);
}

const SEMI=[0,2,4,5,7,9,11],gf=i=>262*Math.pow(2,SEMI[i]/12);
function gsfx(p){
  if(p<0)return;
  const s=GS[p], o=p>0?GS[p-1]:null;
  const ev=s.ev || null;
  if(ev){
    switch(ev.t){
      case "visit":    tone(ev.n?gf(ev.n):523,.14,"sine",.12); break;
      case "frontier": tone(392,.10,"triangle",.12); tone(523,.14,"triangle",.12,.06); break;
      case "process":  tone(ev.n?gf(ev.n):440,.12,"triangle",.11); break;
      case "relax":    tone(659,.08,"square",.05); break;
      case "accept":   tone(523,.14,"triangle",.13); tone(659,.18,"triangle",.13,.08); tone(784,.20,"triangle",.12,.16); break;
      case "reject":   tone(196,.16,"sine",.09); break;
      case "backtrack":tone(440,.12,"sine",.10); tone(330,.16,"sine",.09,.08); break;
      case "done":     FAN(); break;
      default:         break;
    }
    return;
  }
  if(s.l===-1){FAN();return}
  const base=o||{ns:Array(7).fill(0),es:Array(GE.length).fill(0)};let k=0;
  s.ns.forEach((v,i)=>{if(v!==base.ns[i]){if(v===1)tone(gf(i),.14,"sine",.12,k*.06);else if(v===2)tone(gf(i)*2,.12,"triangle",.1,k*.06);else if(v===3)tone(gf(i)/2,.2,"sine",.1,k*.06);else tone(gf(i)/2,.06,"sine",.05,k*.06);k++}});
  s.es.forEach((v,i)=>{if(v!==base.es[i]){if(v===2)tone(784,.09,"square",.05,k*.06);else if(v===3)tone(150,.14,"sawtooth",.06,k*.06,.7);else if(v===1)tone(420,.05,"sine",.06,k*.06);k++}});
  if(!k)tone(230,.05,"sine",.05);
}

function rsfx(s){
  if(s.tag==="call")tone(392+Math.min(6,s.stack.length)*30,.1,"sine",.11);
  else if(s.tag==="check")tone(300,.06,"sine",.06);
  else if(s.tag==="base")OKS();
  else if(s.tag==="compute")tone(523,.12,"triangle",.13);
  else if(s.tag==="ret")tone(659,.13,"triangle",.13);
  else if(s.tag==="done")FAN();
}
