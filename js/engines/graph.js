// --- Graph Algorithms Step Engine (BFS, DFS, Dijkstra, Prim, Kruskal) ---
const GN=[[40,125],[110,45],[110,205],[180,125],[250,45],[250,205],[308,125]];
const LET="ABCDEFG";
const GE=[[0,1],[0,2],[1,2],[1,3],[2,3],[3,4],[3,5],[4,6],[5,6]];
const WGT={dijkstra:1,prim:1,kruskal:1};
let GW=[4,2,1,5,8,3,6,7,2];

const adj=u=>GE.map((e,i)=>e[0]===u?[e[1],i]:e[1]===u?[e[0],i]:null).filter(Boolean).sort((a,b)=>a[0]-b[0]);

function ggen(name,s0){
  const n=7,ns=Array(n).fill(0),es=Array(GE.length).fill(0),lab=Array(n).fill(""),S=[],out=[];let ds="";
  const Lt=i=>LET[i],yn=r=>r?T("yes"):T("no"),ed=i=>Lt(GE[i][0])+Lt(GE[i][1])+"("+GW[i]+")";
  const P=(l,m,d)=>{if(d!==undefined)ds=d;S.push({l,ns:ns.slice(),es:es.slice(),lab:lab.slice(),ds,m})};
  if(name==="bfs"){
    const q=[s0],vis=Array(n).fill(false);vis[s0]=true;ns[s0]=1;
    const D=()=>`Queue: [${q.map(Lt)}]   Order: [${out.map(Lt)}]`;
    P(0,`start = ${Lt(s0)} → enqueue, mark in frontier`,D());S[S.length-1].ev={t:"frontier",n:s0};
    while(q.length){
      const u=q.shift();ns[u]=2;
      P(2,`u = dequeue() = ${Lt(u)}  → now processing`,D());S[S.length-1].ev={t:"process",n:u};
      for(const[v,e]of adj(u)){
        es[e]=1;
        P(3,`consider edge ${Lt(u)}–${Lt(v)} (${Lt(v)} ${vis[v]?"already visited":"unvisited"})`,D());
        S[S.length-1].ev={t:"relax"};
        if(!vis[v]){
          vis[v]=true;q.push(v);ns[v]=1;es[e]=2;
          P(4,`${Lt(v)} not visited → enqueue(${Lt(v)}), accept edge`,D());
          S[S.length-1].ev={t:"visit",n:v};
        }else{
          es[e]=3;
          P(4,`${Lt(v)} already visited → reject edge (would revisit)`,D());
          S[S.length-1].ev={t:"reject"};
        }
      }
      adj(u).forEach(([,e])=>{ if(es[e]===3) es[e]=0; });
      ns[u]=3;out.push(u);
      P(1,`${Lt(u)} finished  (all neighbours processed)`,D());S[S.length-1].ev={t:"done",n:u};
    }
  }
  else if(name==="dfs"){
    const vis=Array(n).fill(false),stk=[];
    const D=()=>`Call stack: [${stk.map(Lt)}]   Order: [${out.map(Lt)}]`;
    const dfs=u=>{
      vis[u]=true;stk.push(u);out.push(u);ns[u]=2;
      P(0,`dfs(${Lt(u)}): mark visited, push frame  (depth ${stk.length})`,D());
      S[S.length-1].ev={t:"visit",n:u};
      for(const[v,e]of adj(u)){
        es[e]=1;
        P(1,`consider edge ${Lt(u)}–${Lt(v)} (${Lt(v)} ${vis[v]?"already visited":"unvisited"})`,D());
        S[S.length-1].ev={t:"relax"};
        if(!vis[v]){
          es[e]=2; ns[u]=1;
          P(2,`${Lt(v)} unvisited → recurse dfs(${Lt(v)})`,D());
          S[S.length-1].ev={t:"visit",n:v};
          dfs(v);
          ns[u]=2;
          P(1,`returned to ${Lt(u)}  (backtrack from ${Lt(v)})`,D());
          S[S.length-1].ev={t:"backtrack",n:u};
        }else{
          es[e]=3;
          P(2,`${Lt(v)} already visited → skip edge (no cycle)`,D());
          S[S.length-1].ev={t:"reject"};
        }
      }
      adj(u).forEach(([,e])=>{ if(es[e]===3) es[e]=0; });
      ns[u]=3;stk.pop();
      P(1,`${Lt(u)} finished, pop frame`,D());S[S.length-1].ev={t:"done",n:u};
    };
    dfs(s0);
  }
  else if(name==="dijkstra"){
    const INF=1e9,d=Array(n).fill(INF),pe=Array(n).fill(-1),done=Array(n).fill(false);d[s0]=0;lab.fill("∞");lab[s0]="0";
    const D=()=>"dist: "+d.map((x,i)=>Lt(i)+"="+(x===INF?"∞":x)).join("  ");P(0,`dist[all] = ∞, dist[${Lt(s0)}] = 0`,D());
    for(;;){
      let u=-1;for(let i=0;i<n;i++)if(!done[i]&&d[i]<INF&&(u<0||d[i]<d[u]))u=i;if(u<0)break;
      ns[u]=2;P(2,`u = ${Lt(u)}  (smallest dist = ${d[u]})`);done[u]=true;P(3,`${Lt(u)} is visited: its distance ${d[u]} is final`);
      for(const[v,e]of adj(u)){
        if(done[v])continue;es[e]=1;const nd=d[u]+GW[e];
        P(5,`${d[u]} + ${GW[e]} = ${nd}  <  dist[${Lt(v)}] = ${d[v]===INF?"∞":d[v]} ?  ${yn(nd<d[v])}`);
        S[S.length-1].ev={t:"relax"};
        if(nd<d[v]){
          if(pe[v]>=0)es[pe[v]]=0;
          d[v]=nd;pe[v]=e;lab[v]=""+nd;es[e]=2;if(!ns[v])ns[v]=1;
          P(5,`dist[${Lt(v)}] = ${nd}  (via ${Lt(u)})`,D());
          S[S.length-1].ev={t:"accept",n:v};
        }else{
          es[e]=pe[v]===e?2:0;
        }
      }
      ns[u]=3;P(1,`${Lt(u)} finished`,D())
    }
  }
  else if(name==="prim"){
    const inT=Array(n).fill(false);inT[s0]=true;ns[s0]=3;let tot=0;const D=()=>`MST weight so far: ${tot}`;P(0,`start with ${Lt(s0)} in the tree`,D());
    for(;;){
      const c=[];GE.forEach(([a,b],i)=>{if(inT[a]!==inT[b])c.push(i)});if(!c.length)break;
      c.forEach(i=>es[i]=1);P(2,`edges leaving the tree: ${c.map(ed).join("  ")}`);
      S[S.length-1].ev={t:"relax"};
      const b=c.reduce((x,y)=>GW[y]<GW[x]?y:x);c.forEach(i=>es[i]=0);es[b]=2;const v=inT[GE[b][0]]?GE[b][1]:GE[b][0];inT[v]=true;ns[v]=3;tot+=GW[b];
      P(3,`lightest = ${ed(b)}  → add ${Lt(v)} to the tree`,D());
      S[S.length-1].ev={t:"accept",n:v}
    }
  }
  else{
    const par=[...Array(n).keys()],find=x=>par[x]===x?x:find(par[x]),idx=GE.map((_,i)=>i).sort((a,b)=>GW[a]-GW[b]||a-b),inM=Array(n).fill(false);let tot=0;const D=()=>`MST weight so far: ${tot}`;
    P(0,`sorted: ${idx.map(ed).join("  ")}`,D());
    for(const i of idx){
      const[a,b]=GE[i];es[i]=1;ns[a]=ns[b]=2;P(1,`next edge ${ed(i)}`);
      S[S.length-1].ev={t:"relax"};const ra=find(a),rb=find(b);
      P(2,`find(${Lt(a)}) = ${Lt(ra)},  find(${Lt(b)}) = ${Lt(rb)}  →  different ? ${yn(ra!==rb)}`);
      if(ra!==rb){par[ra]=rb;es[i]=2;tot+=GW[i];inM[a]=inM[b]=true;P(3,`add ${ed(i)} to the MST, union`,D())}else{es[i]=3;P(4,`same component → it would make a cycle, skip`)}
      S[S.length-1].ev = (ra!==rb) ? {t:"accept"} : {t:"reject"};
      ns[a]=inM[a]?3:0;ns[b]=inM[b]?3:0
    }
  }
  P(-1,"✔ "+T("done"));S[S.length-1].ev={t:"done"};return S;
}
