// --- Homepage UI & Quick Actions ---
const HOMETILES=[
  {k:"sorting",   n:"Sorting",        t:"Bubble, Selection, Insertion, Merge",       b:"4 algorithms",
   svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="12" width="4" height="9" rx="1"/><rect x="10" y="7" width="4" height="14" rx="1"/><rect x="17" y="3" width="4" height="18" rx="1"/></svg>'},
  {k:"searching", n:"Searching",      t:"Linear and Binary search",                  b:"2 algorithms",
   svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/></svg>'},
  {k:"stack",     n:"Stack",          t:"LIFO — push, pop, peek",                    b:"3 operations",
   svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="14" width="14" height="4" rx="1"/><rect x="5" y="9" width="14" height="4" rx="1"/><rect x="5" y="4" width="14" height="4" rx="1"/></svg>'},
  {k:"queue",     n:"Queue / Deque",  t:"FIFO, plus push/pop at both ends",          b:"5 operations",
   svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="9" width="4" height="6" rx="1"/><rect x="10" y="9" width="4" height="6" rx="1"/><rect x="17" y="9" width="4" height="6" rx="1"/></svg>'},
  {k:"linkedlist",n:"Linked List",    t:"Singly linked — nodes and pointers",        b:"5 operations",
   svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="6" cy="12" r="3"/><circle cx="18" cy="12" r="3"/><path d="M9 12h6"/></svg>'},
  {k:"dll",       n:"Doubly Linked",  t:"prev and next pointers on every node",      b:"7 operations",
   svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="6" cy="12" r="3"/><circle cx="18" cy="12" r="3"/><path d="M9 12h6"/><path d="M9 10l-2 2 2 2"/><path d="M15 10l2 2-2 2"/></svg>'},
  {k:"graph",     n:"Graph",          t:"BFS, DFS, Dijkstra, Prim, Kruskal",         b:"5 algorithms",
   svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="12" cy="18" r="2.5"/><path d="M8 7l3 9M16 7l-3 9M8.5 6h7"/></svg>'},
  {k:"recursion", n:"Recursion",      t:"Call stack, frame-by-frame execution",      b:"1 algorithm",
   svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 20c4 0 4-16 8-16 3 0 4 3 4 6"/><circle cx="20" cy="10" r="1.5" fill="currentColor" stroke="none"/></svg>'},
  {k:"tree",      n:"Tree",           t:"BFS Level-order, Pre, In & Post-order",     b:"4 traversals",
   svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="5" r="2.5"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M11 7l-4 9M13 7l4 9"/></svg>'}
];

function buildHome(){
  const g=$("homeGrid");if(!g)return;
  g.innerHTML=HOMETILES.map(T=>`<button class="tile${T.soon?" soon":""}" data-k="${T.k}" ${T.soon?'disabled aria-disabled="true"':''}>
    <span class="ti">${T.svg}</span>
    <span class="tn">${T.n}</span>
    <span class="ts">${T.t}</span>
    <span class="tb">${T.b}</span>
  </button>`).join("");
  g.querySelectorAll(".tile").forEach(b=>{
    if(b.disabled)return;
    b.onclick=()=>{showView("app");setCat(b.dataset.k)};
  });
  document.querySelectorAll(".quick-btn").forEach(q=>{
    q.onclick=()=>runQuick(q.dataset.quick);
  });
  initHero3D();
}

function initHero3D(){
  const container = document.getElementById('hero3DWrapper');
  const card = document.getElementById('holoCard');

  if (container && card) {
    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Calculate tilt degrees (max +- 10deg)
      const rotateX = -(y / (rect.height / 2)) * 10;
      const rotateY = (x / (rect.width / 2)) * 10;

      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    container.addEventListener('mouseleave', () => {
      card.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }
}

function runQuick(k){
  if(k==="bubble"){showView("app");setCat("sorting");arr=rand(8);load();play();return}
  if(k==="bfs"){showView("app");setCat("graph");const s=$("gs");if(s)s.value="0";gload();return}
  if(k==="tree"){showView("app");setCat("tree");const ts=$("tree-algo");if(ts)ts.value="bfs";tload();play();return}
  if(k==="factorial"){showView("app");setCat("recursion");const rn=$("rn");if(rn)rn.value="5";rload();return}
  if(k==="tracer" || k==="tracer-python"){showView("tracer", "python");return}
  if(k==="tracer-cpp"){showView("tracer", "cpp");return}
}
