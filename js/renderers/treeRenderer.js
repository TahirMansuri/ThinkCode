// --- Binary Tree Visualizer (SVG Canvas, Rounded Traversal Arrow, & Stack/Queue Live Memory) ---

const TREE_COORDS = [
  { x: 210, y: 44, r: 18 },  // 0: Root
  { x: 115, y: 118, r: 18 }, // 1: Left
  { x: 305, y: 118, r: 18 }, // 2: Right
  { x: 65,  y: 198, r: 18 }, // 3: L-L
  { x: 165, y: 198, r: 18 }, // 4: L-R
  { x: 255, y: 198, r: 18 }, // 5: R-L
  { x: 355, y: 198, r: 18 }  // 6: R-R
];

let TSTEPS = [];
let tPos = -1;
let tTimer = null;
let TEl = { e: [], n: [], t: [], halo: null, arrow: null };

function treeBuild() {
  const svg = $("treeSvg");
  if (!svg) return;
  svg.innerHTML = "";
  TEl = { e: [], n: [], t: [], halo: null, arrow: null };

  const mk = (tag, attrs) => {
    const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
    for (const k in attrs) el.setAttribute(k, attrs[k]);
    svg.appendChild(el);
    return el;
  };

  // SVG Definitions for Markers & Gradients
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  defs.innerHTML = `
    <marker id="treeArrowHead" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="var(--cmp)" />
    </marker>
    <marker id="treeBackArrowHead" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="var(--hole)" />
    </marker>
    <filter id="treeGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  `;
  svg.appendChild(defs);

  // 1. Edges / Branches
  TREE_EDGES.forEach(([a, b]) => {
    const u = TREE_COORDS[a], v = TREE_COORDS[b];
    const line = mk("line", {
      x1: u.x, y1: u.y,
      x2: v.x, y2: v.y,
      stroke: "var(--line)",
      "stroke-width": "3",
      "stroke-linecap": "round",
      class: "tree-edge"
    });
    TEl.e.push(line);
  });

  // 2. Traversal Curved Bezier Arrow
  TEl.arrow = mk("path", {
    d: "M 0 0",
    fill: "none",
    stroke: "var(--cmp)",
    "stroke-width": "3.5",
    "stroke-linecap": "round",
    "marker-end": "url(#treeArrowHead)",
    opacity: "0",
    class: "tree-traversal-arrow"
  });

  // 3. Active Halo / Pulse Indicator
  TEl.halo = mk("circle", {
    cx: 0, cy: 0, r: 24,
    fill: "none",
    stroke: "var(--cmp)",
    "stroke-width": "2",
    opacity: "0",
    class: "tree-active-halo"
  });

  // 4. Tree Nodes & Text Labels
  const vals = (typeof TREE_PRESETS !== "undefined" && TREE_PRESETS[currentTreePreset]) || ["1", "2", "3", "4", "5", "6", "7"];
  TREE_COORDS.forEach((c, i) => {
    const circle = mk("circle", {
      cx: c.x, cy: c.y, r: c.r,
      fill: "var(--bar)",
      stroke: "var(--panel)",
      "stroke-width": "3",
      class: "tree-node"
    });
    TEl.n.push(circle);

    const txt = mk("text", {
      x: c.x, y: c.y + 5,
      "text-anchor": "middle",
      fill: "#ffffff",
      "font-weight": "700",
      "font-size": "13px",
      "font-family": "'JetBrains Mono', monospace",
      "pointer-events": "none"
    });
    txt.textContent = vals[i];
    TEl.t.push(txt);
  });
}

function treeUpdateArrow(arrow) {
  if (!TEl.arrow) return;
  if (!arrow || arrow.from === null || arrow.to === null) {
    TEl.arrow.setAttribute("opacity", "0");
    return;
  }

  const u = TREE_COORDS[arrow.from];
  const v = TREE_COORDS[arrow.to];
  if (!u || !v) {
    TEl.arrow.setAttribute("opacity", "0");
    return;
  }

  // Calculate curved path avoiding straight branch overlap
  const dx = v.x - u.x;
  const dy = v.y - u.y;
  const dist = Math.hypot(dx, dy) || 1;
  const mx = (u.x + v.x) / 2;
  const my = (u.y + v.y) / 2;

  // Offset control point perpendicularly
  const bow = arrow.type === "up" ? -28 : 26;
  const cx = mx - (dy / dist) * bow;
  const cy = my + (dx / dist) * bow;

  // Shorten end points so arrow touches node boundary (radius = 18)
  const rad = 20;
  const startX = u.x + (dx / dist) * rad;
  const startY = u.y + (dy / dist) * rad;
  const endX = v.x - (dx / dist) * (rad + 4);
  const endY = v.y - (dy / dist) * (rad + 4);

  const d = `M ${startX.toFixed(1)} ${startY.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${endX.toFixed(1)} ${endY.toFixed(1)}`;
  TEl.arrow.setAttribute("d", d);
  TEl.arrow.setAttribute("opacity", "1");

  if (arrow.type === "up") {
    TEl.arrow.setAttribute("stroke", "var(--hole)");
    TEl.arrow.setAttribute("stroke-dasharray", "5 4");
    TEl.arrow.setAttribute("marker-end", "url(#treeBackArrowHead)");
  } else {
    TEl.arrow.setAttribute("stroke", "var(--cmp)");
    TEl.arrow.removeAttribute("stroke-dasharray");
    TEl.arrow.setAttribute("marker-end", "url(#treeArrowHead)");
  }
}

function treeRenderPanel(s) {
  const badge = $("tpBadge");
  const action = $("tpAction");
  const container = $("tpContainer");
  const orderEl = $("tpOrder");
  const noteEl = $("tpNote");

  const isBFS = algo === "tree_bfs";

  if (badge) {
    badge.textContent = isBFS ? "QUEUE (FIFO MEMORY)" : "CALL STACK (LIFO MEMORY)";
    badge.className = "tp-badge " + (isBFS ? "badge-queue" : "badge-stack");
  }

  const mem = s.mem || { type: "none", items: [] };
  const vals = (typeof TREE_PRESETS !== "undefined" && TREE_PRESETS[currentTreePreset]) || ["1", "2", "3", "4", "5", "6", "7"];

  if (action) {
    action.textContent = s.m || "";
  }

  // Render Queue or Stack items
  if (container) {
    container.innerHTML = "";
    if (isBFS) {
      // Queue layout (Horizontal, Front -> Rear)
      if (!mem.items || !mem.items.length) {
        container.innerHTML = '<span class="tp-empty">(Queue is empty)</span>';
      } else {
        const wrap = document.createElement("div");
        wrap.className = "tp-queue-track";
        mem.items.forEach((idx, i) => {
          const box = document.createElement("div");
          let cls = "tp-box tp-queue-box";
          if (i === 0) cls += " front";
          if (i === mem.items.length - 1 && mem.items.length > 1) cls += " rear";
          if (mem.active === idx) cls += " active";
          box.className = cls;
          box.innerHTML = `<span class="tp-num">${vals[idx]}</span>${i === 0 ? '<span class="tp-tag">FRONT</span>' : (i === mem.items.length - 1 ? '<span class="tp-tag">REAR</span>' : "")}`;
          wrap.appendChild(box);
        });
        container.appendChild(wrap);
      }
    } else {
      // Stack layout (Vertical / Horizontal stacked frames, Bottom -> Top)
      if (!mem.items || !mem.items.length) {
        container.innerHTML = '<span class="tp-empty">(Call Stack is empty)</span>';
      } else {
        const wrap = document.createElement("div");
        wrap.className = "tp-stack-track";
        mem.items.forEach((idx, i) => {
          const box = document.createElement("div");
          let cls = "tp-box tp-stack-box";
          if (i === mem.items.length - 1) cls += " top active";
          box.className = cls;
          box.innerHTML = `<span class="tp-stack-fn">dfs(${vals[idx]})</span>${i === mem.items.length - 1 ? '<span class="tp-tag">ACTIVE TOP</span>' : ""}`;
          wrap.appendChild(box);
        });
        container.appendChild(wrap);
      }
    }
  }

  // Traversal sequence output
  if (orderEl) {
    if (!s.order || !s.order.length) {
      orderEl.innerHTML = '<span class="tp-empty">—</span>';
    } else {
      orderEl.innerHTML = s.order.map((v, idx) => {
        const isLatest = idx === s.order.length - 1;
        return `<span class="tp-chip ${isLatest ? 'new-visit' : ''}">${v}</span>`;
      }).join('<span class="tp-sep">→</span>');
    }
  }

  if (noteEl) {
    if (isBFS) {
      noteEl.textContent = "BFS sweeps horizontally: it discovers all nodes at the current depth before descending to children.";
    } else if (algo === "tree_pre") {
      noteEl.textContent = "Pre-Order (Root → Left → Right): node is recorded first, then left child, then right child.";
    } else if (algo === "tree_in") {
      noteEl.textContent = "In-Order (Left → Root → Right): left subtree finishes first, then node is recorded, then right. (In BST, output is sorted!)";
    } else {
      noteEl.textContent = "Post-Order (Left → Right → Root): both left & right subtrees finish completely before the parent node is recorded.";
    }
  }
}

function treeRender(p) {
  const s = p < 0
    ? { ns: Array(7).fill(0), es: Array(6).fill(0), order: [], mem: { items: [] }, arrow: null, m: T("init"), l: -1 }
    : TSTEPS[p];

  if (!s) return;

  const NC = ["var(--bar)", "var(--cmp)", "var(--hole)", "var(--ok)"];

  // Update edges
  if (TEl.e) {
    TEl.e.forEach((line, i) => {
      const state = s.es[i];
      line.style.stroke = state === 2 ? "var(--ok)" : state === 1 ? "var(--cmp)" : "var(--line)";
      line.style.strokeWidth = state === 2 ? "5px" : "3px";
    });
  }

  // Update nodes
  if (TEl.n) {
    TEl.n.forEach((circle, i) => {
      const state = s.ns[i];
      circle.style.fill = NC[state];
      circle.style.stroke = state === 2 ? "#ffffff" : "var(--panel)";
      circle.style.strokeWidth = state === 2 ? "4px" : "3px";
    });
  }

  // Update active halo
  if (TEl.halo) {
    const activeIdx = s.ns.findIndex(st => st === 2);
    if (activeIdx >= 0) {
      const c = TREE_COORDS[activeIdx];
      TEl.halo.setAttribute("cx", c.x);
      TEl.halo.setAttribute("cy", c.y);
      TEl.halo.setAttribute("opacity", "0.9");
    } else {
      TEl.halo.setAttribute("opacity", "0");
    }
  }

  // Update curved traversal arrow
  treeUpdateArrow(s.arrow);

  // Update memory & order panels
  treeRenderPanel(s);

  // Status & steps counter
  if ($("msg")) $("msg").textContent = s.m;
  if ($("treeSt")) $("treeSt").textContent = `${Math.max(p + 1, 0)}/${TSTEPS.length}`;

  // Pseudocode line highlight
  const cEl = codeEl || $("code");
  if (cEl) {
    cEl.querySelectorAll(".ln").forEach(el => el.classList.remove("on"));
    if (s.l >= 0) {
      const ln = $("L" + s.l);
      if (ln) ln.classList.add("on");
    }
  }

  // Sound effects
  if (s.ev && typeof tone === "function" && typeof SND !== "undefined" && SND) {
    const baseFreq = 300;
    if (s.ev.t === "enqueue" || s.ev.t === "push") tone(baseFreq + (s.ev.n || 0) * 45, 0.08);
    else if (s.ev.t === "dequeue" || s.ev.t === "pop") tone(baseFreq + 150, 0.06);
    else if (s.ev.t === "visit") tone(550, 0.1);
    else if (s.ev.t === "done" && typeof OKS === "function") OKS();
  }
}

function treeStop() {
  clearTimeout(tTimer);
  tTimer = null;
  if ($("treePlay")) $("treePlay").textContent = T("play");
}

function treeLoad() {
  treeStop();
  if ($("treeT")) $("treeT").textContent = NAMES[algo] || "Binary Tree";
  TSTEPS = treeGen(algo, currentTreePreset);
  tPos = -1;

  const cEl = codeEl || $("code");
  if (cEl && CODE[algo]) {
    cEl.innerHTML = CODE[algo].map((t, i) => `<div class="ln" id="L${i}" data-ln="${i + 1}">${hl(t)}</div>`).join("");
  }

  info();
  treeBuild();
  treeRender(-1);
}

const treeDelay = () => Math.round(1400 / Math.pow(1.3, ($("treeSpd") ? +$("treeSpd").value : 4) - 1)) + 120;
function treeTick() {
  if (tPos >= TSTEPS.length - 1) {
    treeStop();
    return;
  }
  treeRender(++tPos);
  tTimer = setTimeout(treeTick, treeDelay());
}

if (typeof window !== "undefined") {
  window.treeBuild = treeBuild;
  window.treeRender = treeRender;
  window.treeStop = treeStop;
  window.treeLoad = treeLoad;
  window.treeTick = treeTick;
  window.treeDelay = treeDelay;
}
