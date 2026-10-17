// --- Array & Sorting/Searching Visualizer Renderer ---
let PITCH=64,TK=56,BASE=86,DROP=76;
const PC={lo:"var(--ok)",hi:"var(--wr)",mid:"var(--hole)",i:"var(--cmp)"};

function rand(n){return Array.from({length:n},()=>Math.floor(Math.random()*90)+10)}

function build(){
  const row=$("row");
  const WW=$("wrap").clientWidth||340;
  PITCH=Math.max(40,Math.min(64,Math.floor((WW-12)/arr.length)));
  TK=PITCH-8;
  BASE=algo==="insertion"?TK+24:algo==="merge"?8:Math.round(TK*.6)+4;
  DROP=algo==="merge"?TK+34:TK+20;
  PTE={};row.innerHTML="";row.style.width=(arr.length*PITCH+12)+"px";
  row.style.height=((algo==="merge"?BASE+DROP+TK+8:BASE+TK+Math.max(34,Math.round(TK*.6)+8))+(cat==="searching"?58:0))+"px";
  row.style.setProperty("--tk",TK+"px");
  row.style.setProperty("--base",BASE+"px");
  cells=[];toks=[];prev=[];
  arr.forEach((v,i)=>{
    const c=document.createElement("div");c.className="cell";c.style.left=(i*PITCH+6)+"px";row.appendChild(c);cells.push(c);
    const x=document.createElement("div");x.className="idx";x.style.left=(i*PITCH+6)+"px";x.textContent=i;row.appendChild(x);
  });
  arr.forEach((v,i)=>{
    const t=document.createElement("div");t.className="tok";t.textContent=v;
    {const L=String(v).length;t.style.fontSize=Math.max(11,TK*(L>3?.26:L>2?.32:.4))+"px"}
    row.appendChild(t);toks.push(t);prev.push(null);
  });
}

function tags(s){
  const row=$("row");
  const c={};
  Object.keys(PTE).forEach(k=>PTE[k].style.opacity=0);
  if(!s.pt)return;
  Object.entries(s.pt).forEach(([k,v])=>{
    let e=PTE[k];const sl=Math.max(0,Math.min(arr.length-1,v)),j=c[sl]=(c[sl]??-1)+1;
    if(!e){
      e=document.createElement("div");e.className="pt";e.style.color=PC[k];
      e.style.left=(sl*PITCH+6+TK/2)+"px";e.style.top=(BASE+TK+32+j*20)+"px";
      row.appendChild(e);PTE[k]=e;
    }
    e.textContent=`${k} = ${v}`;e.style.opacity=1;
    e.style.left=(sl*PITCH+6+TK/2)+"px";e.style.top=(BASE+TK+32+j*20)+"px";
  });
}

function delay(){return Math.round(1400/Math.pow(1.3,$("spd").value-1))+60}
function adur(){return RM?90:Math.min(560,Math.max(140,delay()*.85))}

function show(p,anim=true){
  const n=arr.length;
  const s=p<0?{v:arr.slice(),x:[],t:null,p:arr.map((_,i)=>i),y:Array(n).fill(0),s:[],c:[],w:[],h:-1,r:null,k:null,l:-2,m:T("init"),cmp:0,mv:0}:steps[p];
  const dur=adur();
  toks.forEach((el,id)=>{
    const tx=s.p[id]*PITCH+6,ty=BASE+(s.y[id]<0?-(TK+20):s.y[id]*DROP),pv=prev[id],slot=s.p[id],low=s.y[id];
    const moved = !pv || pv.x!==tx || pv.y!==ty;
    if(anim && !RM && moved){
      const m=new DOMMatrix(getComputedStyle(el).transform);
      const cx=m.m41||(pv?pv.x:tx), cy=m.m42||(pv?pv.y:ty);
      const dy=ty-cy, dx=tx-cx;
      const lifted = (low===-1)||(pv&&pv.y!==ty&&Math.abs(dx)<1);
      if(lifted){
        el.animate([
          {transform:`translate(${cx}px,${cy}px) scale(1)`,opacity:1},
          {transform:`translate(${cx}px,${(cy+ty)/2}px) scale(1.06)`,offset:.55,opacity:1},
          {transform:`translate(${tx}px,${ty}px) scale(1)`,opacity:1}
        ],{duration:dur,easing:"cubic-bezier(.4,.0,.2,1)"});
      }else{
        const arc=pv&&pv.y===ty?Math.min(TK*.6,24+Math.abs(dx)/6)*(dx>0?-1:1):0;
        el.animate([
          {transform:`translate(${cx}px,${cy}px) scale(1)`},
          {transform:`translate(${(cx+tx)/2}px,${(cy+ty)/2+arc}px) scale(1.12)`,offset:.5},
          {transform:`translate(${tx}px,${ty}px) scale(1)`}
        ],{duration:dur,easing:"cubic-bezier(.45,.05,.25,1)"});
      }
    } else if(anim && !RM && !pv){
      el.animate([
        {transform:`translate(${tx}px,${ty-14}px) scale(.92)`,opacity:.6},
        {transform:`translate(${tx}px,${ty}px) scale(1)`,opacity:1}
      ],{duration:220,easing:"cubic-bezier(.3,.7,.3,1)"});
    }
    el.style.transform=`translate(${tx}px,${ty}px)`;prev[id]={x:tx,y:ty};
    let c="tok";
    if(s.s[slot]&&low===0)c+=" ok";
    else if(s.w.includes(slot)&&(!s.r||low===0))c+=" wr";
    else if(s.c.includes(slot)&&(!s.r||low===1))c+=" cmp";
    else if(s.k!==null&&low===-1)c+=" hole";
    else if((algo==="selection"||algo==="binary")&&s.h===slot)c+=" hole";
    el.className=c;
  });
  cells.forEach((c,i)=>{
    let k="cell";if(s.s[i])k+=" ok";else if(s.w.includes(i))k+=" wr";else if(s.c.includes(i))k+=" cmp";else if(s.h===i)k+=" hole";
    if(s.r&&(i<s.r[0]||i>s.r[1]))k+=" dim";c.className=k;
  });
  tags(s);
  $("key").textContent=s.k!==null?`key = ${s.k}  ${T("lifted")}`:"";
  $("tmpl").textContent=s.y.some(v=>v===1)?T("tmpl"):"";
  codeEl.querySelectorAll(".ln").forEach(e=>e.classList.remove("on"));
  let realL=s.l;
  if(CMAP&&s.l>=0){const m=CMAP[s.l];realL=(m===undefined||m<0)?-1:m}
  const ln=$("L"+realL);if(ln)ln.classList.add("on");
  $("dt").textContent=s.t?W("t_"+s.t):"—";$("dm").textContent=s.m;
  $("dx").innerHTML="";(s.x||[]).forEach(x=>{const li=document.createElement("li");li.textContent=x;$("dx").appendChild(li)});
  const pv=p>0?steps[p-1].v:arr;
  $("mt").innerHTML=s.v.map((v,i)=>`<div class="${v!==pv[i]?"ch":""}"><u>${i}</u>${v===null?"_":v}</div>`).join("");
  $("scrub").max=steps.length;$("scrub").value=Math.max(p+1,0);$("msg").textContent=s.m;
  $("st").textContent=`${Math.max(p+1,0)}/${steps.length}`;$("cm").textContent=s.cmp;$("mv").textContent=s.mv;
  if(anim&&p>=0)sfx(s);
}

function tick(){if(pos>=steps.length-1){stop();return}pos++;show(pos);timer=setTimeout(tick,delay())}
function stop(){clearTimeout(timer);timer=null;$("play").textContent=T("play")}
function play(){if(timer){stop();return}if(pos>=steps.length-1){pos=-1;show(-1,false)}$("play").textContent=T("pause");tick()}

function apply(){
  const v=$("custom").value.split(/[\s,]+/).filter(Boolean).map(Number);
  if(v.length<2||v.length>50||v.some(x=>!Number.isInteger(x)||x<0||x>9999)){$("msg").textContent=T("bad");return}
  arr=v;load();
}
