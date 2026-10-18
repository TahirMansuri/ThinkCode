// --- Data Structures Engine (Stack, Queue, Deque, Singly & Doubly Linked List) ---
let CAP=5;
let DS=[],DSnew=-1,busy=false,LOG=[],SL=[],ptr={},PE={},SE=[],HL=-1,NEWI=-1,LH=null;
let TR=[],TB=null,tp=-1,tt=null,FL=null,curOp="",curL=-1,CMD=null,logged=false;

function dsLog(m,keep=true){
  $("dsm").textContent=m;
  if(keep&&m!==T("dsInit")){
    LOG.unshift(m);LOG.length=Math.min(LOG.length,5);
  }
  $("dsl").innerHTML="";
  LOG.forEach(x=>{
    const li=document.createElement("li");
    li.textContent=x;
    $("dsl").appendChild(li);
  });
}

function maxUI(){
  const n=CAP,S=cat==="stack",o=cat==="linkedlist"||cat==="dll";
  $("szrow").hidden=$("maxn").hidden=o;
  if(o)return;
  $("dsz").value=n;
  $("szv").textContent="MAX = "+n;
  $("maxn").textContent={
    en:`MAX = ${n}: the array a[0..${n-1}] has ${n} slots, so the largest index is MAX − 1 = ${n-1}. ${S?"Stack is full when top == MAX − 1.":"Queue is full when rear == MAX − 1."}`,
    hi:`MAX = ${n}: array a[0..${n-1}] में ${n} खाने हैं, इसलिए सबसे बड़ा index MAX − 1 = ${n-1} है। ${S?"top == MAX − 1 होने पर Stack भर जाता है।":"rear == MAX − 1 होने पर Queue भर जाती है।"}`,
    mr:`MAX = ${n}: array a[0..${n-1}] मध्ये ${n} खाने आहेत, म्हणून सर्वात मोठा index MAX − 1 = ${n-1}. ${S?"top == MAX − 1 झाल्यावर Stack भरतो.":"rear == MAX − 1 झाल्यावर Queue भरते."}`
  }[lang];
}

function dsInit(){
  maxUI();clearTimeout(tt);TR=[];tp=-1;$("tbar").hidden=true;$("dlang").hidden=false;$("dlang").value=plang;if(typeof updateDlangLogo==="function")updateDlangLogo(plang);busy=false;LOG=[];DSnew=-1;HL=-1;NEWI=-1;
  $("dsT").textContent=NAMES[cat];info();
  $("dsb").innerHTML="";
  OPS[cat].forEach(o=>{
    const b=document.createElement("button");
    b.textContent=o[0];
    b.onclick=()=>dsDo(o[0]);
    $("dsb").appendChild(b);
  });
  $("trow2").hidden = cat!=="dll";
  {
    const c=document.createElement("button");
    c.textContent="Clear";
    c.onclick=()=>{if(!busy){dsSfx("rem");dsInit()}};
    $("dsb").appendChild(c);
  }
  if(cat==="linkedlist"){DS=[3,7,5];lRender()}
  else if(cat==="dll"){DS=[3,7,5];dllRender()}
  else{SL=Array(CAP).fill(null);ptr=cat==="stack"?{top:-1}:{front:0,rear:-1};slBuild()}
  showPseudo(OPS[cat][0][0]);
  dsLog(T("dsInit"));
}

function tapply(S,fl){
  SL=S.SL.slice();ptr={...S.ptr};HL=S.HL;NEWI=S.NEWI;slRender(fl);
}

function tgo(j,snd){
  const from=tp;tp=j;const S=j<0?TB:TR[j],q=j<0?null:TR[j];
  const fl=j===from+1?S.fl:(j===from-1&&TR[from]&&TR[from].fl?{k:TR[from].fl.k,d:-TR[from].fl.d}:null);
  tapply(S,fl);dline(q?q.l:-1);dsLog(q?q.m:"▶ "+curOp+": start",false);
  $("dsch").textContent=`Algorithm — ${curOp}  ·  ${j+1}/${TR.length}`;
  $("tprev").disabled=j<0;$("tnext").disabled=j>=TR.length-1;
  if(snd){if(j<from)stepSfx(TR[from],-1);else stepSfx(q,1,j===TR.length-1)}
  if(q&&j===TR.length-1&&!logged){logged=true;dsLog(q.m,true)}
}

function pauseT(){clearTimeout(tt);tt=null;busy=false;$("tplay").textContent=T("play")}
function tauto(){
  clearTimeout(tt);
  if(tp>=TR.length-1){pauseT();return}
  busy=true;$("tplay").textContent=T("pause");
  tt=setTimeout(()=>{tgo(tp+1,true);tauto()},tp<0?0:850);
}

function seq(st,opName=window.opName){
  if(cat==="linkedlist"||cat==="dll")return seqLL(st,opName);
  clearTimeout(tt);TR=[];TR.err=st.length===1;TB={SL:SL.slice(),ptr:{...ptr},HL:-1,NEWI:-1,fl:null};logged=false;
  st.forEach(q=>{HL=-1;NEWI=-1;FL=null;const m=q.f?q.f():q.m;TR.push({SL:SL.slice(),ptr:{...ptr},HL,NEWI,fl:FL,l:q.l,m,s:q.s})});
  $("tbar").hidden=false;tp=-1;tgo(-1);pauseT();
}

function seqLL(st, opName = (typeof window !== "undefined" ? window.opName : "")){
  busy=true;let i=0;
  const go=()=>{
    if(i>=st.length){busy=false;return}
    HL=-1;NEWI=-1;LH=null;const q=st[i++];dline(q.l);
    if(cat==="linkedlist")lRender();else if(cat==="dll")dllRender();else slRender();
    const m=q.f?q.f():q.m;if(q.s)dsSfx(opName);if(m)dsLog(m,i===st.length);
    setTimeout(go,850);
  };
  go();
}

function dsDo(op){
  if(busy)return;
  if(cat!=="linkedlist"&&cat!=="dll"&&TR.length&&tp<TR.length-1){pauseT();tgo(TR.length-1)}
  showPseudo(op);dline(-1);const opName=op;
  if(typeof window!=="undefined")window.opName=op;
  const v=$("dv").value.trim(),x=+v,nm=NAMES[cat],need=OPS[cat].find(o=>o[0]===op)[1],Y=T("yes"),N=T("no"),st=[];let foundF=false;
  const tv=$("tg2")?$("tg2").value.trim():"",target=+tv;
  if(need&&(v===""||x>9999)){dsLog(T("needv"));return}
  if(need===2&&(tv===""||Number.isNaN(target)||target>9999)){dsLog(T("needv"));return}
  const fl=(k,d)=>{ptr[k]+=d;FL={k,d};slRender({k,d})};

  if(cat==="dll"){
    const n=DS.length,hl=(i,c="cmp")=>dllRender({i,c}),rmv=i=>{hl(i,"out");setTimeout(()=>{DS.splice(i,1);dllRender()},320)};
    const clearVals=()=>{$("dv").value="";if($("tg2"))$("tg2").value=""};
    if((op==="Insert Head"||op==="Insert Tail"||op==="Insert Before"||op==="Insert After")&&n>=8){
      st.push({l:0,m:`${nm} ${T("full")}`});
    }
    else if(op==="Insert Head"){
      st.push({l:0,m:`node = new Node(${x})`},
        {l:1,m:`node.next = head  (head = ${DS[0]??"NULL"})`},
        {l:2,m:`head.prev = node  (linking backwards)`},
        {l:3,f:()=>{DS.unshift(x);DSnew=0;dllRender();clearVals();return `head = node  →  head = ${x}`}});
    }
    else if(op==="Insert Tail"){
      st.push({l:0,m:`node = new Node(${x})`});
      if(!n)st.push({l:1,f:()=>{DS.push(x);DSnew=0;dllRender();clearVals();return `head == NULL ? ${Y}  →  head = node`}});
      else{
        st.push({l:1,m:`head == NULL ? ${N}`},{l:2,f:()=>{hl(0);return "cur = head"}});
        for(let k=0;k<n;k++)st.push({l:3,f:()=>{hl(k);return `cur = node ${k} (${DS[k]}),  cur.next != NULL ? ${k<n-1?Y:N}`}});
        st.push({l:4,f:()=>{DS.push(x);DSnew=DS.length-1;dllRender();clearVals();return `cur.next = node; node.prev = cur  →  ${x} added at the tail`}});
      }
    }
    else if(op==="Insert Before"||op==="Insert After"){
      const hit=DS.indexOf(target);
      st.push({l:0,m:`node = new Node(${x})`},{l:1,f:()=>{hl(0);return "cur = head"}});
      if(hit<0){
        st.push({l:2,m:`cur.value != ${target} → walk until NULL`});
        for(let k=0;k<n;k++)st.push({l:2,f:()=>{hl(k);return `cur = node ${k} (${DS[k]}) ≠ ${target}`}});
        st.push({l:3,m:`cur == NULL  →  target ${target} not found  ✘`});
        st.push({l:2,m:`node is discarded`});
      }else{
        for(let k=0;k<=hit;k++)st.push({l:2,f:()=>{hl(k);return k<hit?`cur = node ${k} (${DS[k]}) ≠ ${target}`:`cur = node ${k} (${DS[k]}) == ${target}  ✔  stop`}});
        if(op==="Insert Before"){
          st.push({l:4,m:`node.next = cur; node.prev = cur.prev`},
            {l:5,f:()=>{const i=hit;DS.splice(i,0,x);DSnew=i;dllRender();clearVals();return `cur.prev.next = node  (or head = node if cur was head)`}},
            {l:6,m:`cur.prev = node  →  inserted before ${target}`});
        }else{
          st.push({l:4,m:`node.prev = cur; node.next = cur.next`},
            {l:5,m:`cur.next.prev = node  (if cur.next exists)`},
            {l:6,f:()=>{const i=hit+1;DS.splice(i,0,x);DSnew=i;dllRender();clearVals();return `cur.next = node  →  inserted after ${target}`}});
        }
      }
    }
    else if(op==="Delete Head"){
      if(!n)st.push({l:0,m:`${nm} ${T("empty")}`});
      else st.push({l:0,m:`head == NULL ? ${N}`},
        {l:1,f:()=>{hl(0);return `temp = head (${DS[0]})`}},
        {l:2,m:`head = head.next  →  head = ${DS[1]??"NULL"}`},
        {l:3,m:`head.prev = NULL  (new head loses its back-link)`},
        {l:4,f:()=>{rmv(0);return `free(temp)  →  ${DS[0]} removed`}});
    }
    else if(op==="Delete Tail"){
      if(!n)st.push({l:0,m:`${nm} ${T("empty")}`});
      else if(n===1)st.push({l:0,m:`head == NULL ? ${N}`},{l:1,f:()=>{rmv(0);return `head.next == NULL ? ${Y}  →  head = NULL`}});
      else{
        st.push({l:0,m:`head == NULL ? ${N}`},{l:1,m:`head.next == NULL ? ${N}`},{l:2,f:()=>{hl(0);return "cur = head"}});
        for(let k=0;k<=n-2;k++)st.push({l:3,f:()=>{hl(k);return `cur = node ${k},  cur.next.next != NULL ? ${k<n-2?Y:N}`}});
        st.push({l:4,f:()=>{rmv(n-1);return `cur.next = NULL  →  ${DS[n-1]} removed from tail`}});
      }
    }
    else if(op==="Search"){
      if(!n)st.push({l:0,m:`cur = head = NULL`},{l:4,m:W("nf",x)});
      else{
        st.push({l:0,m:"cur = head"});let hit=-1;
        for(let k=0;k<n&&hit<0;k++){const e=DS[k]===x;if(e)hit=k;st.push({l:2,f:()=>{hl(k,e?"ok":"cmp");return `cur.value == ${x} ?  ${DS[k]} == ${x}  →  ${e?Y:N}`}})}
        foundF=hit>=0;
        st.push(hit>=0?{l:2,f:()=>{hl(hit,"ok");return W("fnd",x,hit)}}:{l:4,m:W("nf",x)});
      }
    }
  }
  else if(cat==="linkedlist"){
    const n=DS.length,hl=(i,c="cmp")=>lRender({i,c}),rmv=i=>{hl(i,"out");setTimeout(()=>{DS.splice(i,1);lRender()},320)};
    if((op==="Insert Head"||op==="Insert Tail")&&n>=8)st.push({l:0,m:`${nm} ${T("full")}`});
    else if(op==="Insert Head")st.push({l:0,m:`node = new Node(${x})`},{l:1,m:`node.next = head  (head = ${DS[0]??"NULL"})`},{l:2,f:()=>{DS.unshift(x);DSnew=0;lRender();$("dv").value="";return `head = node  →  head = ${x}`}});
    else if(op==="Insert Tail"){
      st.push({l:0,m:`node = new Node(${x})`});
      if(!n)st.push({l:1,f:()=>{DS.push(x);DSnew=0;lRender();$("dv").value="";return `head == NULL ? ${Y}  →  head = node`}});
      else{
        st.push({l:1,m:`head == NULL ? ${N}`},{l:2,f:()=>{hl(0);return "cur = head"}});
        for(let k=0;k<n;k++)st.push({l:3,f:()=>{hl(k);return `cur = node ${k} (${DS[k]}),  cur.next != NULL ? ${k<n-1?Y:N}`}});
        st.push({l:4,f:()=>{DS.push(x);DSnew=DS.length-1;lRender();$("dv").value="";return `cur.next = node  →  ${x} added at the tail`}});
      }
    }
    else if(op==="Delete Head"){
      if(!n)st.push({l:0,m:`${nm} ${T("empty")}`});
      else st.push({l:0,m:`head == NULL ? ${N}`},{l:1,f:()=>{hl(0);return `temp = head (${DS[0]})`}},{l:2,m:`head = head.next  →  head = ${DS[1]??"NULL"}`},{l:3,f:()=>{rmv(0);return `free(temp)  →  ${DS[0]} removed`}});
    }
    else if(op==="Delete Tail"){
      if(!n)st.push({l:0,m:`${nm} ${T("empty")}`});
      else if(n===1)st.push({l:0,m:`head == NULL ? ${N}`},{l:1,f:()=>{rmv(0);return `head.next == NULL ? ${Y}  →  head = NULL`}});
      else{
        st.push({l:0,m:`head == NULL ? ${N}`},{l:1,m:`head.next == NULL ? ${N}`},{l:2,f:()=>{hl(0);return "cur = head"}});
        for(let k=0;k<=n-2;k++)st.push({l:3,f:()=>{hl(k);return `cur = node ${k},  cur.next.next != NULL ? ${k<n-2?Y:N}`}});
        st.push({l:4,f:()=>{rmv(n-1);return `cur.next = NULL  →  ${DS[n-1]} removed`}});
      }
    }
    else if(op==="Search"){
      if(!n)st.push({l:0,m:`cur = head = NULL`,},{l:4,m:W("nf",x)});
      else{
        st.push({l:0,m:"cur = head"});let hit=-1;
        for(let k=0;k<n&&hit<0;k++){const e=DS[k]===x;if(e)hit=k;st.push({l:2,f:()=>{hl(k,e?"ok":"cmp");return `cur.value == ${x} ?  ${DS[k]} == ${x}  →  ${e?Y:N}`}})}
        foundF=hit>=0;st.push(hit>=0?{l:2,f:()=>{hl(hit,"ok");return W("fnd",x,hit)}}:{l:4,m:W("nf",x)});
      }
    }
  }
  else{
    const S1=cat==="stack",P=S1?"top":"rear",F=S1?"top":"front",cnt=S1?ptr.top+1:ptr.rear-ptr.front+1,
    fullBack=ptr[P]===CAP-1,fullFront=!S1&&ptr.front===0;
    if(op==="Push"||op==="Enqueue"){
      if(fullBack)st.push({l:0,m:`${P} == MAX − 1 (${CAP-1}) ? ${Y}  →  ${nm} ${T("full")}`});
      else st.push({l:0,m:`${P} == MAX − 1 (${CAP-1}) ? ${N}`},{l:1,f:()=>{fl(P,1);return `${P} = ${P} + 1  →  ${P} = ${ptr[P]}`}},{l:2,f:()=>{SL[ptr[P]]=x;NEWI=ptr[P];slRender();$("dv").value="";return `a[${ptr[P]}] = ${x}`}});
    }
    else if(op==="Push Front"){
      if(fullFront)st.push({l:0,m:`front == 0 ? ${Y}  →  ${nm} ${T("full")}`});
      else st.push({l:0,m:`front == 0 ? ${N}`},{l:1,f:()=>{fl("front",-1);return `front = front − 1  →  front = ${ptr.front}`}},{l:2,f:()=>{SL[ptr.front]=x;NEWI=ptr.front;slRender();$("dv").value="";return `a[${ptr.front}] = ${x}`}});
    }
    else if(op==="Pop Back"){
      if(cnt<=0)st.push({l:0,m:`front > rear ? ${Y}  →  ${nm} ${T("empty")}`});
      else{const i=ptr.rear,val=SL[i];st.push({l:0,m:`front > rear ? ${N}`},{l:1,f:()=>{HL=i;slRender();return `x = a[${i}] = ${val}`}},
        {l:2,f:()=>{fl("rear",-1);return `rear = rear − 1  →  rear = ${ptr.rear}`}},{l:3,m:`return ${val}  ✔  (${val} removed from the back)`});
      }
    }
    else if(op==="Pop"||op==="Dequeue"){
      if(cnt<=0)st.push({l:0,m:S1?`top == -1 ? ${Y}  →  ${nm} ${T("empty")}`:`front > rear ? ${Y}  →  ${nm} ${T("empty")}`});
      else{const i=ptr[F],val=SL[i];st.push({l:0,m:S1?`top == -1 ? ${N}`:`front > rear ? ${N}`},{l:1,f:()=>{HL=i;slRender();return `x = a[${i}] = ${val}`}},
        {l:2,f:()=>{fl(F,S1?-1:1);return S1?`top = top − 1  →  top = ${ptr.top}`:`front = front + 1  →  front = ${ptr.front}`}},{l:3,m:`return ${val}  ✔  (${val} removed; the old value just stays in memory)`});
      }
    }
    else{
      if(cnt<=0)st.push({l:0,m:`${nm} ${T("empty")}`});else{const i=S1?ptr.top:ptr.front;st.push({l:0,m:`${S1?"top == -1":"front > rear"} ? ${N}`},{l:1,f:()=>{HL=i;slRender();return `return a[${i}] = ${SL[i]}  (nothing is removed)`}})}
    }
  }
  const ins=/^(Push|Enqueue|Insert)/.test(op),pp=op==="Pop"||op==="Dequeue"||op==="Pop Back";
  st.forEach((q,i)=>{
    q.k=i;const bad=q.m&&(q.m.includes(T("full"))||q.m.includes(T("empty")));
    q.s=bad?"err":pp?(i===2?"rem":"tick"):i===st.length-1?(ins?"add":op==="Search"?(foundF?"ok":"nf"):op==="Peek"?"ok":/^Delete/.test(op)?"rem":"tick"):"tick";
  });
  seq(st, opName);
}
