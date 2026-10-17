// --- Binary Tree Step Engine (BFS Level-Order, DFS Pre/In/Post-Order) ---

const TREE_PRESETS = {
  numbers: ["1", "2", "3", "4", "5", "6", "7"],
  bst: ["40", "20", "60", "10", "30", "50", "70"],
  alpha: ["A", "B", "C", "D", "E", "F", "G"]
};

let currentTreePreset = "numbers";

const TREE_EDGES = [
  [0, 1], // Root -> Left
  [0, 2], // Root -> Right
  [1, 3], // Left -> L-L
  [1, 4], // Left -> L-R
  [2, 5], // Right -> R-L
  [2, 6]  // Right -> R-R
];

function treeGen(name, presetKey) {
  const vals = TREE_PRESETS[presetKey || currentTreePreset] || TREE_PRESETS.numbers;
  const n = 7;
  const ns = Array(n).fill(0); // 0: unvisited, 1: queued/stacked, 2: active, 3: visited
  const es = Array(TREE_EDGES.length).fill(0); // 0: default, 1: active, 2: traversed
  const S = [];
  const out = [];

  const val = i => (i >= 0 && i < n ? vals[i] : "?");
  const edgeIdx = (u, v) => TREE_EDGES.findIndex(([a, b]) => (a === u && b === v) || (a === v && b === u));

  const P = (l, m, mem, arrow) => {
    S.push({
      l,
      ns: ns.slice(),
      es: es.slice(),
      order: out.slice(),
      mem: JSON.parse(JSON.stringify(mem || { type: "none", items: [] })),
      arrow: arrow ? { ...arrow } : null,
      m
    });
  };

  // ==================== 1. BFS: Level-Order Traversal (FIFO Queue) ====================
  if (name === "tree_bfs") {
    const q = [0];
    ns[0] = 1;
    P(0, `Initialize FIFO Queue with root node [${val(0)}].`, { type: "queue", items: [0], action: "enqueue" }, null);
    S[S.length - 1].ev = { t: "enqueue", n: 0 };

    while (q.length) {
      const u = q.shift();
      ns[u] = 2; // active inspecting
      P(2, `Dequeue node [${val(u)}] from the front of the queue to process it.`, { type: "queue", items: q.slice(), active: u, action: "dequeue" }, null);
      S[S.length - 1].ev = { t: "dequeue", n: u };

      // Visit node
      ns[u] = 3; // marked done
      out.push(val(u));
      P(3, `Visit [${val(u)}] → added to Level-Order sequence.`, { type: "queue", items: q.slice(), action: "visit" }, null);
      S[S.length - 1].ev = { t: "visit", n: u };

      // Left child
      const left = 2 * u + 1;
      if (left < n) {
        ns[left] = 1;
        q.push(left);
        const e = edgeIdx(u, left);
        if (e >= 0) es[e] = 2;
        P(4, `Left child [${val(left)}] exists → enqueue [${val(left)}].`, { type: "queue", items: q.slice(), action: "enqueue" }, { from: u, to: left, type: "down" });
        S[S.length - 1].ev = { t: "enqueue", n: left };
      }

      // Right child
      const right = 2 * u + 2;
      if (right < n) {
        ns[right] = 1;
        q.push(right);
        const e = edgeIdx(u, right);
        if (e >= 0) es[e] = 2;
        P(5, `Right child [${val(right)}] exists → enqueue [${val(right)}].`, { type: "queue", items: q.slice(), action: "enqueue" }, { from: u, to: right, type: "down" });
        S[S.length - 1].ev = { t: "enqueue", n: right };
      }
    }
  }

  // ==================== 2. DFS: Pre-Order Traversal (Root -> Left -> Right) ====================
  else if (name === "tree_pre") {
    const stack = [];
    const dfsPre = (u, parent) => {
      if (u >= n) return;
      stack.push(u);
      ns[u] = 2;
      const arrowDown = parent !== null ? { from: parent, to: u, type: "down" } : null;
      if (parent !== null) {
        const e = edgeIdx(parent, u);
        if (e >= 0) es[e] = 2;
      }

      P(0, `Enter dfsPre(${val(u)}) → push frame onto Call Stack.`, { type: "stack", items: stack.slice(), action: "push" }, arrowDown);
      S[S.length - 1].ev = { t: "push", n: u };

      // Visit immediately (PRE-order)
      ns[u] = 3;
      out.push(val(u));
      P(1, `Pre-Order: Visit root/node [${val(u)}] before subtrees → output: [${out.join(", ")}].`, { type: "stack", items: stack.slice(), action: "visit" }, null);
      S[S.length - 1].ev = { t: "visit", n: u };

      const left = 2 * u + 1;
      const right = 2 * u + 2;

      if (left < n) {
        P(2, `Traverse left subtree of [${val(u)}].`, { type: "stack", items: stack.slice(), action: "descend" }, null);
        dfsPre(left, u);
        // Return from left
        ns[u] = 2;
        P(2, `Returned from left child [${val(left)}] back to [${val(u)}].`, { type: "stack", items: stack.slice(), action: "backtrack" }, { from: left, to: u, type: "up" });
        S[S.length - 1].ev = { t: "backtrack", n: u };
      }

      if (right < n) {
        P(3, `Traverse right subtree of [${val(u)}].`, { type: "stack", items: stack.slice(), action: "descend" }, null);
        dfsPre(right, u);
        // Return from right
        ns[u] = 2;
        P(3, `Returned from right child [${val(right)}] back to [${val(u)}].`, { type: "stack", items: stack.slice(), action: "backtrack" }, { from: right, to: u, type: "up" });
        S[S.length - 1].ev = { t: "backtrack", n: u };
      }

      ns[u] = 3;
      stack.pop();
      P(4, `Completed subtrees of [${val(u)}] → pop frame from Call Stack.`, { type: "stack", items: stack.slice(), action: "pop" }, null);
      S[S.length - 1].ev = { t: "pop", n: u };
    };

    dfsPre(0, null);
  }

  // ==================== 3. DFS: In-Order Traversal (Left -> Root -> Right) ====================
  else if (name === "tree_in") {
    const stack = [];
    const dfsIn = (u, parent) => {
      if (u >= n) return;
      stack.push(u);
      ns[u] = 1;
      const arrowDown = parent !== null ? { from: parent, to: u, type: "down" } : null;
      if (parent !== null) {
        const e = edgeIdx(parent, u);
        if (e >= 0) es[e] = 2;
      }

      P(0, `Enter dfsIn(${val(u)}) → push frame onto Call Stack.`, { type: "stack", items: stack.slice(), action: "push" }, arrowDown);
      S[S.length - 1].ev = { t: "push", n: u };

      const left = 2 * u + 1;
      const right = 2 * u + 2;

      if (left < n) {
        P(1, `Descend into left child of [${val(u)}].`, { type: "stack", items: stack.slice(), action: "descend" }, null);
        dfsIn(left, u);
        // Return from left
        ns[u] = 2;
        P(1, `Returned from left child [${val(left)}] to [${val(u)}].`, { type: "stack", items: stack.slice(), action: "backtrack" }, { from: left, to: u, type: "up" });
        S[S.length - 1].ev = { t: "backtrack", n: u };
      }

      // Visit node IN-between left and right
      ns[u] = 3;
      out.push(val(u));
      P(2, `In-Order: Left subtree done → Visit [${val(u)}] → output: [${out.join(", ")}].`, { type: "stack", items: stack.slice(), action: "visit" }, null);
      S[S.length - 1].ev = { t: "visit", n: u };

      if (right < n) {
        P(3, `Descend into right child of [${val(u)}].`, { type: "stack", items: stack.slice(), action: "descend" }, null);
        dfsIn(right, u);
        // Return from right
        ns[u] = 2;
        P(3, `Returned from right child [${val(right)}] to [${val(u)}].`, { type: "stack", items: stack.slice(), action: "backtrack" }, { from: right, to: u, type: "up" });
        S[S.length - 1].ev = { t: "backtrack", n: u };
      }

      ns[u] = 3;
      stack.pop();
      P(4, `Completed [${val(u)}] → pop frame from Call Stack.`, { type: "stack", items: stack.slice(), action: "pop" }, null);
      S[S.length - 1].ev = { t: "pop", n: u };
    };

    dfsIn(0, null);
  }

  // ==================== 4. DFS: Post-Order Traversal (Left -> Right -> Root) ====================
  else if (name === "tree_post") {
    const stack = [];
    const dfsPost = (u, parent) => {
      if (u >= n) return;
      stack.push(u);
      ns[u] = 1;
      const arrowDown = parent !== null ? { from: parent, to: u, type: "down" } : null;
      if (parent !== null) {
        const e = edgeIdx(parent, u);
        if (e >= 0) es[e] = 2;
      }

      P(0, `Enter dfsPost(${val(u)}) → push frame onto Call Stack.`, { type: "stack", items: stack.slice(), action: "push" }, arrowDown);
      S[S.length - 1].ev = { t: "push", n: u };

      const left = 2 * u + 1;
      const right = 2 * u + 2;

      if (left < n) {
        P(1, `Descend into left child of [${val(u)}].`, { type: "stack", items: stack.slice(), action: "descend" }, null);
        dfsPost(left, u);
        ns[u] = 1;
        P(1, `Returned from left child [${val(left)}] to [${val(u)}].`, { type: "stack", items: stack.slice(), action: "backtrack" }, { from: left, to: u, type: "up" });
        S[S.length - 1].ev = { t: "backtrack", n: u };
      }

      if (right < n) {
        P(2, `Descend into right child of [${val(u)}].`, { type: "stack", items: stack.slice(), action: "descend" }, null);
        dfsPost(right, u);
        ns[u] = 1;
        P(2, `Returned from right child [${val(right)}] to [${val(u)}].`, { type: "stack", items: stack.slice(), action: "backtrack" }, { from: right, to: u, type: "up" });
        S[S.length - 1].ev = { t: "backtrack", n: u };
      }

      // Visit node AFTER both left and right subtrees
      ns[u] = 3;
      out.push(val(u));
      P(3, `Post-Order: Both subtrees done → Visit [${val(u)}] → output: [${out.join(", ")}].`, { type: "stack", items: stack.slice(), action: "visit" }, null);
      S[S.length - 1].ev = { t: "visit", n: u };

      stack.pop();
      P(4, `Completed [${val(u)}] → pop frame from Call Stack.`, { type: "stack", items: stack.slice(), action: "pop" }, null);
      S[S.length - 1].ev = { t: "pop", n: u };
    };

    dfsPost(0, null);
  }

  // Final Step: Complete
  P(-1, `✔ Traversal complete! Final sequence: [${out.join(", ")}]`, { type: "done", items: [] }, null);
  S[S.length - 1].ev = { t: "done" };

  return S;
}

if (typeof window !== "undefined") {
  window.TREE_PRESETS = TREE_PRESETS;
  window.currentTreePreset = currentTreePreset;
  window.TREE_EDGES = TREE_EDGES;
  window.treeGen = treeGen;
}
