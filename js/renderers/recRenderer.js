// --- Recursion Visualizer & Call Stack Frame Renderer ---
let RSTEPS=[],RPOS=-1,RTIMER=null;

function rrender(p){
  const host=$("rstack"),valEl=$("rval"),varEl=$("rvar"),phaseEl=$("rphase");
  if(!host)return;
  const s=(p<0||!RSTEPS.length)
    ? {stack:[],active:-1,phase:"down",line:-1,msg:T("init"),tag:null}
    : RSTEPS[p];

  // phase banner
  if(phaseEl){
    phaseEl.textContent = s.phase==="down" ? "▼ Descending — calls stack up, nothing computed yet"
                        : s.phase==="up" ? "▲ Ascending — values return, multiplications resolve"
                        : "";
    phaseEl.className = "rphase " + (s.phase||"");
  }

  // call stack
  host.innerHTML="";
  if(!s.stack.length){
    const e=document.createElement("div");e.className="rempty";e.textContent="(stack is empty)";host.appendChild(e);
  }else{
    s.stack.forEach((f,i)=>{
      const e=document.createElement("div");
      let c="rframe";
      if(i===s.active){
        c += f.state==="ret" ? " returning" : f.state==="compute" ? " computing" : " active";
      }
      e.className=c;
      let right="";
      if(f.state==="wait" && f.waiting) right=`waiting for ${f.waiting}`;
      else if(f.state==="wait") right=`n = ${f.n}`;
      else if(f.state==="compute") right=`computing ${f.pending}`;
      else if(f.state==="ret") right=`→ ${f.result}`;
      e.innerHTML=`<span class="rn">factorial(${f.n})</span><span class="rc">${right}</span>`;
      host.appendChild(e);
    });
  }

  // message
  if(valEl)valEl.textContent=s.msg;

  // active frame variables
  const a=s.active>=0?s.stack[s.active]:null;
  if(a&&varEl){
    const bits=[`n = ${a.n}`];
    if(a.waiting)bits.push(`waiting → ${a.waiting}`);
    if(a.sub!==null)bits.push(`sub = ${a.sub}`);
    if(a.pending)bits.push(`pending: ${a.pending}`);
    if(a.result!==null)bits.push(`result = ${a.result}`);
    varEl.textContent=bits.join("    ");
  } else if(varEl){
    varEl.textContent="";
  }

  // code highlight
  codeEl.querySelectorAll(".ln").forEach(e=>e.classList.remove("on"));
  let realL=s.line;
  if(CMAP&&s.line>=0){const m=CMAP[s.line];realL=(m===undefined||m<0)?-1:m}
  const ln=$("L"+realL);if(ln)ln.classList.add("on");

  // details
  const TAGS={call:"Call",check:"Check",base:"Base case",compute:"Compute",ret:"Return",done:"Finished"};
  if($("dt"))$("dt").textContent=s.tag?(TAGS[s.tag]||s.tag):"—";
  if($("dm"))$("dm").textContent=s.msg;

  if(p>=0)rsfx(s);
  if($("rst"))$("rst").textContent=`${Math.max(p+1,0)}/${RSTEPS.length}`;
  if($("st"))$("st").textContent=`${Math.max(p+1,0)}/${RSTEPS.length}`;
}

function rstop(){
  clearTimeout(RTIMER);RTIMER=null;
  if($("rplay"))$("rplay").textContent=T("play");
  if($("play"))$("play").textContent=T("play");
}

function rplay(){
  if(RTIMER){rstop();return}
  if(RPOS>=RSTEPS.length-1){RPOS=-1;rrender(-1)}
  if($("rplay"))$("rplay").textContent=T("pause");
  if($("play"))$("play").textContent=T("pause");
  rtick();
}

function rtick(){
  if(RPOS>=RSTEPS.length-1){rstop();return}
  RPOS++;rrender(RPOS);
  RTIMER=setTimeout(rtick,rdelay());
}

function rdelay(){
  return Math.round(1500/Math.pow(1.35,$("rspd").value-1))+80;
}

function rload(){
  rstop();RPOS=-1;
  const n=Math.max(1,Math.min(12,parseInt($("rn").value||"5",10)||5));
  $("rn").value=n;
  let src=RCODE[algo]||[],CM=null;
  if(plang!=="pseudo"&&REAL[algo]&&REAL[algo][plang]){
    src=REAL[algo][plang].src;CM=REAL[algo][plang].map;
  }
  CMAP=CM;
  codeEl.innerHTML=src.map((t,i)=>`<div class="ln" id="L${i}" data-ln="${i+1}">${hl(t,plang)}</div>`).join("");
  info();
  RSTEPS=rgen(algo,n);
  $("rT").textContent=NAMES[algo]+"   n = "+n;
  rrender(-1);
}
