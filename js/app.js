// --- Main Application Orchestrator & State Manager ---
const $ = id => document.getElementById(id);
const RM = matchMedia("(prefers-reduced-motion:reduce)").matches;

let PTE={}, TG=0, mode="arr", cat="sorting", algo="bubble", arr=[], steps=[], pos=-1, timer=null, cells=[], toks=[], prev=[];
let CMAP=null;
let row, codeEl;

// --- Multi-View Navigation (SPA View Switcher) ---
function showView(v, lang){
  const views = {
    home: $("home"),
    app: $("app"),
    tracer: $("tracer"),
    about: $("about"),
    contact: $("contact")
  };

  Object.entries(views).forEach(([k, el])=>{
    if(el) el.hidden = (k !== v);
  });

  document.querySelectorAll(".nav-btn").forEach(btn=>{
    btn.classList.toggle("active", (btn.dataset.nav === v || btn.dataset.view === v));
  });

  if(v === "tracer"){
    const fn = (typeof onLanguageChange === "function" ? onLanguageChange : (typeof window !== "undefined" ? window.onLanguageChange : null));
    if (lang && typeof fn === "function") {
      fn(lang);
    } else if (typeof initPyodideTracer === "function") {
      initPyodideTracer();
    }
  }

  window.scrollTo({top:0, behavior: RM ? "auto" : "smooth"});
}

// --- Theme Switcher ---
function applyTheme(v){
  const root=document.documentElement;
  if(v==="auto") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme",v);
  try{localStorage.setItem("dsa-theme",v)}catch(e){}
  document.querySelectorAll(".theme-select").forEach(sel=>{
    sel.value=v;
  });
}

function initTheme(){
  let saved="auto";
  try{saved=localStorage.getItem("dsa-theme")||"auto"}catch(e){}
  applyTheme(saved);
}

function sndUI(){
  document.querySelectorAll(".snd-btn").forEach(b=>{
    b.textContent=SND?"🔊":"🔇";
    b.setAttribute("aria-pressed",String(SND));
  });
}

// --- Algorithm Information Display ---
function info(){
  const K=mode==="ds"?cat:algo,f=INFO[K],x=T("cx");
  if($("abS")) $("abS").textContent=T("aboutH")+" — "+NAMES[K];
  if($("ib") && f) {
    $("ib").innerHTML=`<h3>${NAMES[K]}</h3><p>${f.d[lang]}</p><div class="cx">${(f.cl||[...[0,1,2,3].map(i=>[x[i],f.c[i]]),[x[4],T("yn")[f.st?0:1]]]).map(q=>`<div>${q[0]}<b>${q[1]}</b></div>`).join("")}</div>`;
  }
}

function statics(){
  document.querySelectorAll("[data-i]").forEach(e=>e.textContent=T(e.dataset.i));
  if($("custom")) $("custom").placeholder=T("ph");
  if($("lang")) $("lang").value=lang;
  document.documentElement.lang=lang;
  try{
    const th=localStorage.getItem("dsa-theme")||"auto";
    document.querySelectorAll(".theme-select").forEach(sel=>{sel.value=th});
  }catch(e){}
  if($("plang")){
    $("plang").value=plang;
    $("plang").hidden=!(cat==="sorting"||cat==="recursion");
  }
  if($("play")) $("play").textContent=timer?T("pause"):T("play");
  if($("gplay")) $("gplay").textContent=(typeof gt!=="undefined"&&gt)?T("pause"):T("play");
  if($("treePlay")) $("treePlay").textContent=(typeof tTimer!=="undefined"&&tTimer)?T("pause"):T("play");
  info();
}

function pickTG(){
  TG=arr[Math.floor(Math.random()*arr.length)];
  if($("tg")) $("tg").value=TG;
}

function load(){
  stop();
  if(algo==="binary") arr=arr.slice().sort((a,b)=>a-b);
  steps=run(algo,arr);
  pos=-1;
  let src=CODE[algo];
  CMAP=null;
  if(cat==="sorting" && plang!=="pseudo" && REAL[algo] && REAL[algo][plang]){
    src=REAL[algo][plang].src;CMAP=REAL[algo][plang].map;
  }
  if(codeEl && src) {
    codeEl.innerHTML=src.map((t,i)=>`<div class="ln" id="L${i}" data-ln="${i+1}">${hl(t,plang)}</div>`).join("");
  }
  if($("custom")) $("custom").value=arr.join(", ");
  info();
  build();
  show(-1,false);
}

function setCat(c){
  stop();
  if(typeof gstop==="function") gstop();
  if(typeof rstop==="function") rstop();
  if(typeof treeStop==="function") treeStop();
  cat=c;
  mode=c==="graph"?"gr":c==="recursion"?"rec":c==="tree"?"tree":CATS[c].length?"arr":"ds";
  if($("plang")) $("plang").hidden = !(c==="sorting"||c==="recursion");
  ["c-arr","dc"].forEach(i=>{if($(i))$(i).hidden=mode!=="arr"});
  if($("c-code")) $("c-code").hidden=mode==="ds";
  if($("c-ds")) $("c-ds").hidden=mode!=="ds";
  if($("c-gr")) $("c-gr").hidden=mode!=="gr";
  if($("c-rec")) $("c-rec").hidden=mode!=="rec";
  if($("c-tree")) $("c-tree").hidden=mode!=="tree";
  if($("trow")) $("trow").hidden=c!=="searching";

  const tabs=$("tabs");
  if(tabs){
    tabs.innerHTML="";
    tabs.hidden=mode==="ds";
    CATS[c].forEach((k,i)=>{
      const b=document.createElement("button");
      b.dataset.k=k;
      const label = NAMES[k] || k.toUpperCase();
      b.innerHTML=label.replace(" Sort",'<span class="sf"> Sort</span>');
      if(!i) b.classList.add("on");
      b.onclick=()=>{
        algo=k;
        tabs.querySelectorAll("button").forEach(x=>x.classList.toggle("on",x===b));
        if(c==="searching") pickTG();
        mode==="gr"?gload():mode==="rec"?rload():mode==="tree"?treeLoad():load();
      };
      tabs.appendChild(b);
    });
  }

  if(mode==="gr"){algo=CATS[c][0];gload()}
  else if(mode==="rec"){algo=CATS[c][0];rload()}
  else if(mode==="tree"){algo=CATS[c][0];treeLoad()}
  else if(mode==="arr"){algo=CATS[c][0];if(c==="searching")pickTG();load()}
  else{algo=c;dsInit()}
  if($("cat")) $("cat").value=c;
}

// --- Global Event Bindings ---
function bindEvents(){
  row = $("row");
  codeEl = $("code");

  // Audio Context unlock
  addEventListener("pointerdown",()=>ac(),{once:true});

  // Sound toggle across all views
  document.querySelectorAll(".snd-btn").forEach(b=>{
    b.onclick=()=>{
      SND=!SND;
      try{localStorage.setItem("dsa-snd",SND?"1":"0")}catch(e){}
      sndUI();
      if(SND)OKS();
    };
  });
  sndUI();

  // Theme select across all views
  document.querySelectorAll(".theme-select").forEach(sel=>{
    sel.onchange=e=>applyTheme(e.target.value);
  });
  initTheme();

  // Custom Array Inputs
  if($("custom")){
    $("custom").addEventListener("input",e=>{
      const el=e.target,p=el.selectionStart,b=el.value;
      el.value=b.replace(/[^0-9, ]/g,"");
      if(el.value!==b) el.setSelectionRange(p-1,p-1);
    });
    $("custom").addEventListener("keydown",e=>{if(e.key==="Enter")apply()});
  }
  if($("set")) $("set").onclick=apply;
  if($("play")) $("play").onclick=play;
  if($("next")) $("next").onclick=()=>{stop();if(pos<steps.length-1)show(++pos)};
  if($("prev")) $("prev").onclick=()=>{stop();if(pos>=0)show(--pos)};
  if($("reset")) $("reset").onclick=()=>{stop();pos=-1;show(-1)};
  if($("rand")) $("rand").onclick=()=>{arr=rand(+$("size").value);if(cat==="searching")pickTG();load()};
  if($("size")) $("size").oninput=()=>{arr=rand(+$("size").value);if(cat==="searching")pickTG();load()};

  // Language & Plang selectors
  let plang=(()=>{try{return localStorage.getItem("dsa-plang")||"pseudo"}catch(e){return "pseudo"}})();
  window.plang=plang;
  if($("plang")){
    $("plang").value=plang;
    $("plang").onchange=e=>{
      window.plang=e.target.value;
      try{localStorage.setItem("dsa-plang",window.plang)}catch(x){}
      if(mode==="rec") rload(); else {load();show(pos,false)}
    };
  }

  if($("lang")){
    $("lang").onchange=e=>{
      lang=e.target.value;
      try{localStorage.setItem("dsa-lang",lang)}catch(x){}
      statics();
      if(mode==="arr"){steps=run(algo,arr);show(pos,false)}
      else if(mode==="rec"){rload()}
      else if(mode==="gr"&&typeof grender==="function"){grender(gp)}
      else if(mode==="tree"&&typeof treeRender==="function"){treeRender(tPos)}
      else if(mode==="ds"){dsLog(T("dsInit"));maxUI()}
    };
  }

  // Scrubber
  if($("scrub")) $("scrub").oninput=e=>{stop();pos=+e.target.value-1;show(pos,true)};

  // Search input
  if($("cat")) $("cat").onchange=e=>setCat(e.target.value);
  if($("tg")){
    $("tg").addEventListener("input",e=>e.target.value=e.target.value.replace(/\D/g,""));
    $("tg").addEventListener("keydown",e=>{if(e.key==="Enter")$("tgb").click()});
  }
  if($("tgb")) $("tgb").onclick=()=>{TG=+$("tg").value||0;load()};

  // Recursion Controls
  if($("rgo")) $("rgo").onclick=()=>rload();
  if($("rn")){
    $("rn").addEventListener("input",e=>e.target.value=e.target.value.replace(/\D/g,""));
    $("rn").addEventListener("keydown",e=>{if(e.key==="Enter")rload()});
  }
  if($("rplay")) $("rplay").onclick=rplay;
  if($("rnext")) $("rnext").onclick=()=>{rstop();if(RPOS<RSTEPS.length-1)rrender(++RPOS)};
  if($("rprev")) $("rprev").onclick=()=>{rstop();if(RPOS>=0)rrender(--RPOS)};
  if($("rreset")) $("rreset").onclick=()=>{rstop();RPOS=-1;rrender(-1)};

  // Graph Controls
  if($("gs")){
    $("gs").innerHTML=[...LET].map((c,i)=>`<option value="${i}">${c}</option>`).join("");
    $("gs").onchange=gload;
  }
  if($("gw")) $("gw").onclick=()=>{GW=GE.map(()=>1+Math.floor(Math.random()*9));gload()};
  if($("gplay")) $("gplay").onclick=()=>{if(gt){gstop();return}if(gp>=GS.length-1){gp=-1;grender(-1)}$("gplay").textContent=T("pause");gtick()};
  if($("gnext")) $("gnext").onclick=()=>{gstop();if(gp<GS.length-1)grender(++gp)};
  if($("gprev")) $("gprev").onclick=()=>{gstop();if(gp>=0)grender(--gp)};
  if($("greset")) $("greset").onclick=()=>{gstop();gp=-1;grender(-1)};

  // Tree Controls
  if($("treePreset")){
    $("treePreset").onchange=e=>{
      if(typeof currentTreePreset!=="undefined") currentTreePreset=e.target.value;
      treeLoad();
    };
  }
  if($("treePlay")) $("treePlay").onclick=()=>{
    if(tTimer){treeStop();return}
    if(tPos>=TSTEPS.length-1){tPos=-1;treeRender(-1)}
    $("treePlay").textContent=T("pause");
    treeTick();
  };
  if($("treeNext")) $("treeNext").onclick=()=>{treeStop();if(tPos<TSTEPS.length-1)treeRender(++tPos)};
  if($("treePrev")) $("treePrev").onclick=()=>{treeStop();if(tPos>=0)treeRender(--tPos)};
  if($("treeReset")) $("treeReset").onclick=()=>{treeStop();tPos=-1;treeRender(-1)};

  // DS Controls
  if($("dv")){
    $("dv").addEventListener("input",e=>e.target.value=e.target.value.replace(/\D/g,""));
    $("dv").addEventListener("keydown",e=>{if(e.key==="Enter"){const o=OPS[cat].find(o=>o[1]);dsDo(o[0])}});
  }
  if($("tg2")) $("tg2").addEventListener("input",e=>e.target.value=e.target.value.replace(/\D/g,""));
  if($("tplay")) $("tplay").onclick=()=>{if(busy){pauseT();return}if(tp>=TR.length-1)tgo(-1);tauto()};
  if($("tnext")) $("tnext").onclick=()=>{pauseT();if(tp<TR.length-1)tgo(tp+1,true)};
  if($("tprev")) $("tprev").onclick=()=>{pauseT();if(tp>=0)tgo(tp-1,true)};
  if($("dlang")){
    $("dlang").onchange=e=>{
      window.plang=e.target.value;
      try{localStorage.setItem("dsa-plang",window.plang)}catch(x){}
      if($("plang")) $("plang").value=window.plang;
      showPseudo(curOp);dline(curL);
      if(TR.length)$("dsch").textContent=`Algorithm — ${curOp}  ·  ${tp+1}/${TR.length}`;
    };
  }
  if($("dsz")) $("dsz").oninput=()=>{if(busy)pauseT();CAP=+$("dsz").value;dsInit()};

  // Keyboard navigation
  document.addEventListener("keydown",e=>{
    const t=e.target;
    if(t.tagName==="TEXTAREA"||t.tagName==="SELECT"||t.isContentEditable||(t.tagName==="INPUT"&&t.type!=="range"))return;
    if(mode!=="arr")return;
    if(e.code==="Space"&&t.tagName!=="BUTTON"){e.preventDefault();play()}
    else if(e.key==="ArrowRight"&&t.type!=="range")$("next").click();
    else if(e.key==="ArrowLeft"&&t.type!=="range")$("prev").click();
  });

  // Window Resize
  let lw=$("wrap")?$("wrap").clientWidth:340;
  addEventListener("resize",()=>{
    const w=$("wrap")?$("wrap").clientWidth:340;
    if(w!==lw&&mode==="arr"){lw=w;build();show(pos,false)}
  });

  // View Navigation links
  document.querySelectorAll("[data-nav]").forEach(el=>{
    el.addEventListener("click", e=>{
      e.preventDefault();
      showView(el.dataset.nav, el.dataset.lang);
    });
    el.addEventListener("keydown", e=>{
      if((e.key==="Enter"||e.key===" ") && el.tagName!=="INPUT" && el.tagName!=="BUTTON"){
        e.preventDefault();
        showView(el.dataset.nav, el.dataset.lang);
      }
    });
  });

  if($("goHome")){
    $("goHome").onclick=()=>showView("home");
    $("goHome").addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();showView("home")}});
  }
}

// --- App Initialization Boot ---
let appInitialized = false;
function initApp(){
  if(appInitialized) return;
  appInitialized = true;
  bindEvents();
  buildHome();
  initPages();
  if(innerWidth>820 && $("ab")) $("ab").open=true;
  arr=rand(8);
  statics();
  setCat("sorting");
  showView("home");
}

document.addEventListener("DOMContentLoaded", initApp);
if(document.readyState==="interactive"||document.readyState==="complete"){
  initApp();
}
