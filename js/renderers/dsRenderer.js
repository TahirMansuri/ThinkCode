// --- Data Structures DOM Renderer (Stack, Queue, Deque, Singly & Doubly Linked List) ---
function showPseudo(op){
  curOp=op;let src=PS[cat][op],lg="pseudo";CMD=null;
  if(plang!=="pseudo"){
    const r=cat==="linkedlist"?realLL(op,plang):cat==="dll"?realDLL(op,plang):realDS(cat,op,plang);
    src=r.src;CMD=r.map;lg=plang;
  }
  $("dsch").textContent="Algorithm — "+op;
  $("dsc").innerHTML=src.map((t,i)=>`<div class="ln" id="D${i}" data-ln="${i+1}">${lg==="pseudo"?hl(t):hl(t,lg)}</div>`).join("");
}

function dline(l){
  curL=l;
  document.querySelectorAll("#dsc .ln").forEach(e=>e.classList.remove("on"));
  const r=CMD&&l>=0?CMD[l]:l,e=$("D"+r);
  if(e)e.classList.add("on");
}

function slBuild(){
  const b=$("dsv");
  b.className="ds "+(cat==="stack"?"sk":"qu");
  b.innerHTML="";
  b.style.height=cat==="stack"?(CAP*44)+"px":"";
  b.style.setProperty("--n",CAP);
  SE=[];PE={};
  for(let i=0;i<CAP;i++){
    const e=document.createElement("div");e.className="sl";const x=document.createElement("i");x.textContent=i;e.appendChild(x);e.appendChild(document.createElement("span"));
    if(cat==="stack")e.style.bottom=(i*44)+"px";else e.style.left=`calc(var(--qp)*${i} + 30px)`;
    b.appendChild(e);SE.push(e);
  }
  Object.keys(ptr).forEach(k=>{
    const p=document.createElement("div");p.className="ptr";p.dataset.k=k;p.innerHTML='<span class="pl"></span><b class="d"></b>';
    b.appendChild(p);PE[k]=p;
  });
  slRender();
}

function slRender(fl){
  const live=i=>cat==="stack"?i<=ptr.top:(i>=ptr.front&&i<=ptr.rear);
  SE.forEach((e,i)=>{
    const v=SL[i];
    e.className="sl"+(v==null?"":live(i)?" f":" gh")+(i===HL?" hl":"")+(i===NEWI?" pop":"");
    e.lastChild.textContent=v==null?"":v;
  });
  Object.keys(ptr).forEach(k=>{
    const p=PE[k],v=ptr[k];
    p.querySelector(".pl").textContent=`${k} = ${v}`;
    if(cat==="stack")p.style.bottom=(v*44+10)+"px";
    else p.style.left=v<0?"26px":`calc(var(--qp)*${v} + 30px + (var(--qs))/2)`;
    if(fl&&fl.k===k){
      const d=p.querySelector(".d");
      d.textContent=fl.d>0?"+1":"−1";
      p.classList.remove("inc","dec");
      void p.offsetWidth;
      p.classList.add(fl.d>0?"inc":"dec");
    }
  });
}

function lRender(hl){
  const b=$("dsv"),n=DS.length;
  b.className="ds linkedlist";b.style.height="";b.innerHTML="";
  const nul=()=>{const z=document.createElement("div");z.className="nul";z.textContent="NULL";return z};
  if(!n){b.innerHTML='<span class="hd0">HEAD</span><span class="ar">→</span>';b.appendChild(nul());return}
  DS.forEach((v,i)=>{
    const e=document.createElement("div");e.className="nd lnode"+(hl&&hl.i===i?" "+hl.c:"")+(i===DSnew?" pop":"");
    e.innerHTML=`<b class="dt">${v}</b><b class="nx"><i></i></b>`;
    const tg=[i===0?"HEAD":"",hl&&hl.i===i&&hl.c==="cmp"?"cur":""].filter(Boolean).join(" · ");
    if(tg){const m=document.createElement("em");m.textContent=tg+" ▼";e.appendChild(m)}
    const t=document.createElement("u");t.textContent="["+i+"]";e.appendChild(t);b.appendChild(e);
    const a=document.createElement("span");a.className="ar";a.textContent="→";b.appendChild(a);
  });
  b.appendChild(nul());
  const g=document.createElement("div");g.className="lgd";g.textContent="node = [ data | next ● ]   ●→ points to the next node";
  b.appendChild(g);
}

function dllRender(hl){
  const b=$("dsv"),n=DS.length;
  b.className="ds linkedlist dll";
  b.style.height="";b.innerHTML="";
  const nul=()=>{const z=document.createElement("div");z.className="nul";z.textContent="NULL";return z};
  if(!n){b.innerHTML='<span class="hd0">HEAD</span><span class="ar">⇄</span>';b.appendChild(nul());return}
  DS.forEach((v,i)=>{
    const e=document.createElement("div");
    e.className="nd lnode dlnode"+(hl&&hl.i===i?" "+hl.c:"")+(i===DSnew?" pop":"");
    e.innerHTML=`<b class="pv"><i></i></b><b class="dt">${v}</b><b class="nx"><i></i></b>`;
    const tg=[i===0?"HEAD":"",i===n-1?"TAIL":"",hl&&hl.i===i&&hl.c==="cmp"?"cur":""].filter(Boolean).join(" · ");
    if(tg){const m=document.createElement("em");m.textContent=tg+" ▼";e.appendChild(m)}
    const t=document.createElement("u");t.textContent="["+i+"]";e.appendChild(t);
    b.appendChild(e);
    const a=document.createElement("span");a.className="ar";a.textContent="⇄";b.appendChild(a);
  });
  b.appendChild(nul());
  const g=document.createElement("div");g.className="lgd";g.textContent="node = [ ◄ prev | data | next ► ]   ⇄ = links in both directions";
  b.appendChild(g);
}
