// --- Main Application Orchestrator & State Manager ---
const $ = id => document.getElementById(id);
const RM = matchMedia("(prefers-reduced-motion:reduce)").matches;

let PTE={}, TG=0, mode="arr", cat="sorting", algo="bubble", arr=[], steps=[], pos=-1, timer=null, cells=[], toks=[], prev=[];
let CMAP=null;
let row, codeEl;

// --- Multi-View Navigation (SPA View Switcher with History & Back-Swipe Support) ---
let currentView = "home";

const VIEW_TITLES = {
  home: "ThinkCode — Interactive Data Structures & Algorithms",
  app: "ThinkCode — Algorithm Visualizer",
  tracer: "ThinkCode — Live Code Tracer",
  about: "ThinkCode — About",
  contact: "ThinkCode — Contact & Feedback"
};

function getHashView(){
  const h = (location.hash || "").replace(/^#\/?/, "").toLowerCase();
  if(!h) return null;
  if(h === "home") return "home";
  if(h === "visualizer" || h === "app") return "app";
  if(h === "tracer" || h === "code-tracer") return "tracer";
  if(h === "about") return "about";
  if(h === "contact") return "contact";
  return null;
}

const navHistory = [];

function showExitModal() {
  const modal = $("exitModal");
  if (!modal) return;
  modal.style.display = "flex";
  void modal.offsetWidth;
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
}

function hideExitModal() {
  const modal = $("exitModal");
  if (!modal) return;
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  setTimeout(() => {
    if (!modal.classList.contains("show")) {
      modal.style.display = "none";
    }
  }, 220);
}

function confirmExitApp() {
  hideExitModal();
  if (window.AndroidApp && typeof window.AndroidApp.closeApp === "function") {
    window.AndroidApp.closeApp();
  } else if (window.navigator && window.navigator.app && typeof window.navigator.app.exitApp === "function") {
    window.navigator.app.exitApp();
  } else if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App && typeof window.Capacitor.Plugins.App.exitApp === "function") {
    window.Capacitor.Plugins.App.exitApp();
  }
}

function handleAndroidBack() {
  const exitModal = $("exitModal");
  // 1. If exit modal is open, dismiss it
  if (exitModal && (exitModal.classList.contains("show") || exitModal.style.display === "flex")) {
    hideExitModal();
    return;
  }

  // 2. If any dialog/popup is open, close it
  const openDialogs = document.querySelectorAll("dialog[open], .modal.show, .popup.show");
  if (openDialogs.length > 0) {
    openDialogs.forEach(d => {
      if (typeof d.close === "function") d.close();
      d.classList.remove("show");
    });
    return;
  }

  // 3. If currently NOT on homepage, navigate back!
  if (currentView !== "home") {
    let target = navHistory.pop();
    if (!target || target === currentView) {
      target = "home";
    }
    showView(target, null, true);
    return;
  }

  // 4. If currently ON homepage, show exit confirmation dialog!
  showExitModal();
}

function showView(v, lang, fromHistory = false){
  if(v === "visualizer") v = "app";
  const views = {
    home: $("home"),
    app: $("app"),
    tracer: $("tracer"),
    about: $("about"),
    contact: $("contact")
  };

  if(!views[v]) v = "home";

  if(!fromHistory && currentView && currentView !== v){
    if(navHistory.length === 0 || navHistory[navHistory.length - 1] !== currentView){
      navHistory.push(currentView);
    }
  }

  // Manage browser history for smooth back gestures on mobile & browser back button
  if(!fromHistory){
    const targetHash = (v === "home") ? "" : ("#" + v);
    const targetUrl = (v === "home")
      ? (location.pathname + location.search)
      : (location.pathname + location.search + targetHash);

    if(v !== currentView || !history.state){
      try {
        history.pushState({ view: v, lang: lang || null }, "", targetUrl);
      } catch(e) {
        if(location.hash !== targetHash) location.hash = targetHash;
      }
    }
  }

  currentView = v;

  // Stop running algorithm animations/audio if leaving visualizer
  if(v !== "app"){
    if(typeof timer !== "undefined" && timer && typeof stop === "function") stop();
    if(typeof tTimer !== "undefined" && tTimer && typeof treeStop === "function") treeStop();
  }

  if(VIEW_TITLES[v]){
    document.title = VIEW_TITLES[v];
  }

  Object.entries(views).forEach(([k, el])=>{
    if(el) el.hidden = (k !== v);
  });

  document.querySelectorAll(".nav-btn").forEach(btn=>{
    btn.classList.toggle("active", (btn.dataset.nav === v || btn.dataset.view === v));
  });

  if(v === "tracer"){
    const initFn = (typeof initTracerUI === "function" ? initTracerUI : (typeof window !== "undefined" ? window.initTracerUI : null));
    if (typeof initFn === "function") initFn();
    const fn = (typeof onLanguageChange === "function" ? onLanguageChange : (typeof window !== "undefined" ? window.onLanguageChange : null));
    if (lang && typeof fn === "function") {
      fn(lang);
    } else if (typeof fn === "function") {
      const curLangSel = document.getElementById("langSel");
      const curLang = curLangSel ? curLangSel.value : "python";
      fn(curLang || "python");
    } else if (typeof initPyodideTracer === "function") {
      initPyodideTracer();
    }
  }

  window.scrollTo({top:0, behavior: RM ? "auto" : "smooth"});
}

// Mobile swipe-back & browser back/forward event listeners
window.addEventListener("popstate", e => {
  const exitModal = $("exitModal");
  if (exitModal && (exitModal.classList.contains("show") || exitModal.style.display === "flex")) {
    hideExitModal();
    return;
  }
  const stateView = e.state && e.state.view;
  const hashView = getHashView();
  const targetView = stateView || hashView || "home";
  const targetLang = (e.state && e.state.lang) || null;
  if (targetView === "home" && currentView === "home") {
    showExitModal();
    return;
  }
  showView(targetView, targetLang, true);
});

window.addEventListener("hashchange", () => {
  const hashView = getHashView() || "home";
  if(hashView !== currentView){
    showView(hashView, null, true);
  }
});

window.handleAndroidBack = handleAndroidBack;
window.showExitModal = showExitModal;
window.hideExitModal = hideExitModal;
window.confirmExitApp = confirmExitApp;

document.addEventListener("backbutton", e => {
  if (e && typeof e.preventDefault === "function") e.preventDefault();
  handleAndroidBack();
});

window.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    const exitModal = $("exitModal");
    if (exitModal && (exitModal.classList.contains("show") || exitModal.style.display === "flex")) {
      hideExitModal();
    }
  }
});


// --- Theme Switcher ---
function isDarkTheme(t){
  if(t==="dark"||t==="midnight") return true;
  if(t==="light"||t==="paper") return false;
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function updateThemeToggleButtons(t){
  const isDark=isDarkTheme(t);
  const icon=isDark?"☀️":"🌙";
  const title=isDark?"Switch to light theme":"Switch to dark theme";
  document.querySelectorAll(".theme-toggle-btn").forEach(btn=>{
    btn.textContent=icon;
    btn.setAttribute("title",title);
    btn.setAttribute("aria-label",title);
  });
}

function toggleTheme(){
  const cur=document.documentElement.getAttribute("data-theme")||"auto";
  const isDark=isDarkTheme(cur);
  const next=isDark?"light":"dark";
  applyTheme(next);
}

function applyTheme(v){
  const root=document.documentElement;
  if(v==="auto") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme",v);
  try{localStorage.setItem("dsa-theme",v)}catch(e){}
  document.querySelectorAll(".theme-select").forEach(sel=>{
    sel.value=v;
  });
  updateThemeToggleButtons(v);
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

  // Theme select & mobile toggle button across all views
  document.querySelectorAll(".theme-select").forEach(sel=>{
    sel.onchange=e=>applyTheme(e.target.value);
  });
  document.querySelectorAll(".theme-toggle-btn").forEach(btn=>{
    btn.onclick=toggleTheme;
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
  function updateDlangLogo(val){
    const el = $("dlangLogo");
    if(!el) return;
    if(val === "cpp"){
      el.src = "assets/cpp-logo.svg";
      el.alt = "C++";
      el.style.display = "inline-block";
    } else if(val === "python"){
      el.src = "assets/python-logo.svg";
      el.alt = "Python";
      el.style.display = "inline-block";
    } else {
      el.style.display = "none";
    }
  }
  window.updateDlangLogo = updateDlangLogo;

  if($("dlang")){
    updateDlangLogo(window.plang);
    $("dlang").onchange=e=>{
      window.plang=e.target.value;
      try{localStorage.setItem("dsa-plang",window.plang)}catch(x){}
      if($("plang")) $("plang").value=window.plang;
      updateDlangLogo(window.plang);
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

  // Exit Confirmation Modal button bindings
  const exitModal = $("exitModal");
  const exitCancelBtn = $("exitCancelBtn");
  const exitConfirmBtn = $("exitConfirmBtn");
  if(exitCancelBtn) exitCancelBtn.onclick = hideExitModal;
  if(exitConfirmBtn) exitConfirmBtn.onclick = confirmExitApp;
  if(exitModal){
    exitModal.onclick = e => {
      if(e.target === exitModal) hideExitModal();
    };
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

  const initialHashView = getHashView();
  if(initialHashView && initialHashView !== "home"){
    try {
      history.replaceState({ view: "home" }, "", location.pathname + location.search);
      history.pushState({ view: initialHashView }, "", "#" + initialHashView);
    } catch(e){}
    showView(initialHashView, null, true);
  } else {
    try {
      history.replaceState({ view: "home" }, "", location.pathname + location.search);
    } catch(e){}
    showView("home", null, true);
  }
}

document.addEventListener("DOMContentLoaded", initApp);
if(document.readyState==="interactive"||document.readyState==="complete"){
  initApp();
}
