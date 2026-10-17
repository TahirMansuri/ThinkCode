// --- Graph Visualizer (SVG Canvas & Step Renderer) ---
let GS=[],gp=-1,gt=null,GEl={};

function gbuild(){
  const g=$("gsvg");g.innerHTML="";GEl={e:[],w:[],n:[],t:[],l:[]};
  const mk=(t,a)=>{const e=document.createElementNS("http://www.w3.org/2000/svg",t);for(const k in a)e.setAttribute(k,a[k]);g.appendChild(e);return e};
  GE.forEach(([a,b])=>GEl.e.push(mk("line",{x1:GN[a][0],y1:GN[a][1],x2:GN[b][0],y2:GN[b][1],"stroke-linecap":"round"})));
  GE.forEach(([a,b])=>GEl.w.push(mk("text",{x:(GN[a][0]+GN[b][0])/2+(a+b)%2*8-4,y:(GN[a][1]+GN[b][1])/2-6,"text-anchor":"middle"})));
  GN.forEach(([x,y],i)=>{
    GEl.n.push(mk("circle",{cx:x,cy:y,r:17}));
    const t=mk("text",{x,y:y+5,"text-anchor":"middle"});
    t.textContent=LET[i];GEl.t.push(t);
    GEl.l.push(mk("text",{x,y:y-24,"text-anchor":"middle"}));
  });
}

function gpanel(p){
  const title=$("gpTitle"),frontier=$("gpFrontier"),orderEl=$("gpOrder"),otitle=$("gpOrderTitle"),note=$("gpNote");
  const name=algo;
  if(!$("gpanel"))return;
  $("gpanel").hidden = !(algo==="bfs"||algo==="dfs");
  const isBFS=name==="bfs",isDFS=name==="dfs";
  if(!isBFS&&!isDFS){
    if(title&&title.parentElement)title.parentElement.hidden=true;
    if(title)title.textContent="";
    if(frontier)frontier.innerHTML="";
    if(orderEl)orderEl.innerHTML="";
    if(otitle)otitle.textContent="";
    if(note)note.textContent="";
    return;
  }
  if(title&&title.parentElement)title.parentElement.hidden=false;
  if(title)title.textContent=isBFS?"Queue (front → rear)":"Call stack (bottom → top)";
  if(otitle)otitle.textContent="Visit order";
  if(note)note.textContent=isBFS?"BFS: nodes leave the queue and enqueue their unvisited neighbours.":"DFS: deepest node on top; when it finishes, we pop and backtrack.";
  const q=[];const stack=[];const order=[];const seen=new Set();
  for(let i=0;i<=p;i++){
    const s=GS[i];const e=s&&s.ev;if(!e)continue;
    if(e.t==="frontier"){ q.push(e.n); seen.add(e.n); }
    else if(e.t==="visit"){
      if(isBFS){ if(!seen.has(e.n)){ q.push(e.n); seen.add(e.n); } }
      else { stack.push(e.n); order.push(e.n); seen.add(e.n); }
    }
    else if(e.t==="process"){
      const idx=q.indexOf(e.n); if(idx>=0)q.splice(idx,1);
      order.push(e.n); seen.add(e.n);
    }
    else if(e.t==="done"){
      if(isDFS){ const idx=stack.lastIndexOf(e.n); if(idx>=0)stack.splice(idx,1); }
    }
  }
  const render=(list,cls)=>{
    if(!list.length)return '<span class="gp-empty">empty</span>';
    return list.map((n,i)=>{
      let c="gp-box";
      if(isBFS){ if(i===0)c+=" front"; if(i===list.length-1&&list.length>1)c+=" rear"; }
      else{ if(i===list.length-1)c+=" top"; }
      if(cls)c+=" "+cls;
      return `<div class="${c}">${LET[n]}</div>`;
    }).join("");
  };
  if(frontier)frontier.innerHTML=render(isBFS?q:stack);
  if(orderEl)orderEl.innerHTML=order.length
    ? order.map(n=>`<div class="gp-box order">${LET[n]}</div>`).join("")
    : '<span class="gp-empty">—</span>';
}

function grender(p){
  const s=p<0?{ns:Array(7).fill(0),es:Array(GE.length).fill(0),lab:Array(7).fill(""),ds:"",m:T("init"),l:-2}:GS[p];
  const EC=["var(--mute)","var(--cmp)","var(--ok)","var(--wr)"],NC=["var(--bar)","var(--cmp)","var(--hole)","var(--ok)"];
  if(GEl.e){
    GEl.e.forEach((e,i)=>{
      const v=s.es[i];e.style.stroke=EC[v];e.style.strokeWidth=v===2?6:v===3?4:3;
      e.style.strokeDasharray=v===3?"4 4":"none";e.style.opacity=1;
    });
    GEl.w.forEach((t,i)=>{
      t.textContent=WGT[algo]?GW[i]:"";t.style.fill="var(--ink)";t.style.stroke="var(--panel)";
      t.style.strokeWidth="4px";t.style.paintOrder="stroke";
    });
    GEl.n.forEach((c,i)=>c.style.fill=NC[s.ns[i]]);
    GEl.t.forEach((t,i)=>t.style.fill=s.ns[i]===1?"#1d2433":"#fff");
    GEl.l.forEach((t,i)=>{t.textContent=s.lab[i];t.style.fill="var(--ink)"});
  }
  $("gds").textContent=s.ds;
  $("msg").textContent=s.m;
  $("gst").textContent=`${Math.max(p+1,0)}/${GS.length}`;
  const LEG={
    en:"grey: undiscovered · orange: in frontier · purple: processing · green: done   |   edge — dashed: considering · green: accepted · red: rejected",
    hi:"grey: अभी नहीं देखा · orange: frontier में · purple: अभी process हो रहा है · green: पूरा   |   edge — dashed: देख रहे हैं · green: स्वीकार · red: अस्वीकार",
    mr:"grey: अजून पाहिले नाही · orange: frontier मध्ये · purple: आता process होत आहे · green: पूर्ण   |   edge — dashed: पाहत आहोत · green: स्वीकार · red: नाकारले"
  };
  if(!$("gleg")){
    const d=document.createElement("div");d.id="gleg";
    d.style.cssText="font-size:11px;color:var(--mute);margin-top:4px;line-height:1.5";
    $("gds").after(d);
  }
  if($("gleg")) $("gleg").textContent=LEG[lang]||LEG.en;
  gpanel(p);
  const cEl=codeEl||$("code");
  if(cEl){
    cEl.querySelectorAll(".ln").forEach(e=>e.classList.remove("on"));
    const ln=$("L"+s.l);if(ln)ln.classList.add("on");
  }
  gsfx(p);
}

function gstop(){clearTimeout(gt);gt=null;if($("gplay"))$("gplay").textContent=T("play")}

function gload(){
  gstop();
  const gsEl=$("gs");
  if(gsEl&&gsEl.parentElement) gsEl.parentElement.hidden=algo==="kruskal";
  if($("gw")) $("gw").hidden=!WGT[algo];
  if($("gT")) $("gT").textContent=NAMES[algo]||algo.toUpperCase();
  GS=ggen(algo,+(gsEl?gsEl.value:0)||0);
  gp=-1;
  const cEl=codeEl||$("code");
  if(cEl&&CODE[algo]){
    cEl.innerHTML=CODE[algo].map((t,i)=>`<div class="ln" id="L${i}" data-ln="${i+1}">${hl(t)}</div>`).join("");
  }
  info();
  gbuild();
  grender(-1);
}

const gdelay=()=>Math.round(1400/Math.pow(1.3,($("gspd")?+$("gspd").value:4)-1))+120;
function gtick(){if(gp>=GS.length-1){gstop();return}grender(++gp);gt=setTimeout(gtick,gdelay())}
