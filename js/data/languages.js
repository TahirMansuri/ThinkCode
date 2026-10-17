// --- Code Implementations (Pseudo, C, C++, Java, Python) & Syntax Highlighting ---

const CODE={
bubble:[
  "for i = 0 to n-2",
  "  for j = 0 to n-i-2",
  "    if a[j] > a[j+1]",
  "      swap(a[j], a[j+1])",
  "  // a[n-i-1] is now in place"
],
selection:[
  "for i = 0 to n-2",
  "  min = i",
  "  for j = i+1 to n-1",
  "    if a[j] < a[min]: min = j",
  "  swap(a[i], a[min])"
],
insertion:[
  "for i = 1 to n-1",
  "  key = a[i]",
  "  j = i - 1",
  "  while j >= 0 and a[j] > key",
  "    a[j+1] = a[j]; j = j - 1",
  "  a[j+1] = key"
],
linear:[
  "for i = 0 to n-1",
  "  if a[i] == target",
  "    return i",
  "return -1  // not found"
],
binary:[
  "lo = 0; hi = n-1",
  "while lo <= hi",
  "  mid = (lo + hi) / 2",
  "  if a[mid] == target: return mid",
  "  else if a[mid] < target: lo = mid + 1",
  "  else: hi = mid - 1",
  "return -1  // not found"
],
merge:[
  "mergeSort(l, r)",
  "  if l >= r: return",
  "  m = (l + r) / 2",
  "  mergeSort(l, m); mergeSort(m+1, r)",
  "  merge(l, m, r)",
  "    temp = copy of a[l..r]; compare temp[i], temp[j]",
  "    write the smaller one into a[k]"
],
bfs:[
  "queue = [start]; mark start visited",
  "while queue is not empty:",
  "  u = dequeue()",
  "  for each neighbour v of u:",
  "    if v not visited: mark it; enqueue(v)"
],
dfs:[
  "dfs(u): mark u visited",
  "  for each neighbour v of u:",
  "    if v not visited: dfs(v)"
],
dijkstra:[
  "dist[all] = ∞; dist[start] = 0",
  "while unvisited nodes remain:",
  "  u = unvisited node with smallest dist",
  "  mark u as visited",
  "  for each neighbour v of u (not visited):",
  "    if dist[u] + w < dist[v]: dist[v] = dist[u] + w"
],
prim:[
  "inTree = {start}",
  "while the tree does not contain all nodes:",
  "  find the lightest edge (u,v): u in tree, v not",
  "  add v and edge (u,v) to the tree"
],
kruskal:[
  "sort all edges by weight",
  "for each edge (u, v, w) in that order:",
  "  if find(u) != find(v):",
  "    add edge to MST; union(u, v)",
  "  else: skip it (it would make a cycle)"
],
tree_bfs:[
  "queue = [root]",
  "while queue is not empty:",
  "  u = dequeue()",
  "  visit(u)  // record node",
  "  if u.left:  enqueue(u.left)",
  "  if u.right: enqueue(u.right)"
],
tree_pre:[
  "dfsPre(node):",
  "  visit(node)         // root first",
  "  dfsPre(node.left)   // traverse left",
  "  dfsPre(node.right)  // traverse right",
  "  return"
],
tree_in:[
  "dfsIn(node):",
  "  dfsIn(node.left)    // left subtree first",
  "  visit(node)         // root in-between",
  "  dfsIn(node.right)   // right subtree",
  "  return"
],
tree_post:[
  "dfsPost(node):",
  "  dfsPost(node.left)  // left subtree",
  "  dfsPost(node.right) // right subtree",
  "  visit(node)         // root last",
  "  return"
]
};

// Recursion pseudo-code (one action per line)
const RCODE={
factorial:[
  "factorial(n):",
  "  if n <= 1:              // base case?",
  "    return 1",
  "  sub = factorial(n - 1)  // go deeper, wait",
  "  result = n * sub        // multiply on the way back",
  "  return result"
],
fib:[
  "fib(n):",
  "  if n <= 1: return n",
  "  return fib(n-1) + fib(n-2)"
],
hanoi:[
  "hanoi(n, from, to, via):",
  "  if n == 1: move disk 1 from→to; return",
  "  hanoi(n-1, from, via, to)",
  "  move disk n from→to",
  "  hanoi(n-1, via, to, from)"
],
nqueens:[
  "solve(row):",
  "  if row == N: record solution; return",
  "  for col = 0..N-1:",
  "    if safe(row, col):",
  "      place queen at (row, col)",
  "      solve(row + 1)",
  "      remove queen  // backtrack"
]
};

const PS={
stack:{
  Push:["if top == MAX-1: overflow","top = top + 1","a[top] = x"],
  Pop:["if top == -1: underflow","x = a[top]","top = top - 1","return x"],
  Peek:["if top == -1: empty","return a[top]"]
},
queue:{
  Enqueue:["if rear == MAX-1: overflow","rear = rear + 1","a[rear] = x"],
  Dequeue:["if front > rear: underflow","x = a[front]","front = front + 1","return x"],
  "Push Front":["if front == 0: overflow (front at start)","front = front - 1","a[front] = x"],
  "Pop Back":["if front > rear: underflow","x = a[rear]","rear = rear - 1","return x"],
  Peek:["if front > rear: empty","return a[front]"]
},
linkedlist:{
  "Insert Head":["node = new Node(x)","node.next = head","head = node"],
  "Insert Tail":["node = new Node(x)","if head == NULL: head = node; return","cur = head","while cur.next != NULL: cur = cur.next","cur.next = node"],
  "Delete Head":["if head == NULL: underflow","temp = head","head = head.next","free(temp)"],
  "Delete Tail":["if head == NULL: underflow","if head.next == NULL: head = NULL; return","cur = head","while cur.next.next != NULL: cur = cur.next","cur.next = NULL"],
  Search:["cur = head","while cur != NULL:","  if cur.value == x: return found","  cur = cur.next","return not found"]
},
dll:{
  "Insert Head":["node = new Node(x)","node.next = head","if head != NULL: head.prev = node","head = node"],
  "Insert Tail":["node = new Node(x)","if head == NULL: head = node; return","cur = head","while cur.next != NULL: cur = cur.next","cur.next = node; node.prev = cur"],
  "Insert Before":["node = new Node(x)","cur = head","while cur != NULL and cur.value != target: cur = cur.next","if cur == NULL: target not found; return","node.next = cur; node.prev = cur.prev","if cur.prev != NULL: cur.prev.next = node","else: head = node","cur.prev = node"],
  "Insert After":["node = new Node(x)","cur = head","while cur != NULL and cur.value != target: cur = cur.next","if cur == NULL: target not found; return","node.prev = cur; node.next = cur.next","if cur.next != NULL: cur.next.prev = node","cur.next = node"],
  "Delete Head":["if head == NULL: underflow","temp = head","head = head.next","if head != NULL: head.prev = NULL","free(temp)"],
  "Delete Tail":["if head == NULL: underflow","if head.next == NULL: head = NULL; return","cur = head","while cur.next.next != NULL: cur = cur.next","cur.next = NULL"],
  Search:["cur = head","while cur != NULL:","  if cur.value == x: return found","  cur = cur.next","return not found"]
}
};

const REAL={
  bubble:{
    c:{src:[
      "void bubbleSort(int a[], int n) {",
      "    for (int i = 0; i < n - 1; i++) {",
      "        for (int j = 0; j < n - i - 1; j++) {",
      "            if (a[j] > a[j + 1]) {",
      "                int t = a[j]; a[j] = a[j + 1]; a[j + 1] = t;",
      "            }",
      "        }",
      "    }",
      "}"
    ],map:[1,2,3,4,-1]},
    cpp:{src:[
      "void bubbleSort(vector<int>& a) {",
      "    for (size_t i = 0; i + 1 < a.size(); ++i)",
      "        for (size_t j = 0; j + 1 < a.size() - i; ++j)",
      "            if (a[j] > a[j + 1])",
      "                swap(a[j], a[j + 1]);",
      "}"
    ],map:[1,2,3,4,-1]},
    java:{src:[
      "void bubbleSort(int[] a) {",
      "    for (int i = 0; i < a.length - 1; i++) {",
      "        for (int j = 0; j < a.length - i - 1; j++) {",
      "            if (a[j] > a[j + 1]) {",
      "                int t = a[j]; a[j] = a[j + 1]; a[j + 1] = t;",
      "            }",
      "        }",
      "    }",
      "}"
    ],map:[1,2,3,4,-1]},
    python:{src:[
      "def bubble_sort(a):",
      "    n = len(a)",
      "    for i in range(n - 1):",
      "        for j in range(n - i - 1):",
      "            if a[j] > a[j + 1]:",
      "                a[j], a[j + 1] = a[j + 1], a[j]",
    ],map:[2,3,4,5,-1]}
  },
  selection:{
    c:{src:[
      "void selectionSort(int a[], int n) {",
      "    for (int i = 0; i < n - 1; i++) {",
      "        int min = i;",
      "        for (int j = i + 1; j < n; j++)",
      "            if (a[j] < a[min]) min = j;",
      "        int t = a[i]; a[i] = a[min]; a[min] = t;",
      "    }",
      "}"
    ],map:[1,2,3,4,5]},
    cpp:{src:[
      "void selectionSort(vector<int>& a) {",
      "    for (size_t i = 0; i + 1 < a.size(); ++i) {",
      "        size_t mn = i;",
      "        for (size_t j = i + 1; j < a.size(); ++j)",
      "            if (a[j] < a[min]) min = j;",
      "        swap(a[i], a[mn]);",
      "    }",
      "}"
    ],map:[1,2,3,4,5]},
    java:{src:[
      "void selectionSort(int[] a) {",
      "    for (int i = 0; i < a.length - 1; i++) {",
      "        int min = i;",
      "        for (int j = i + 1; j < a.length; j++)",
      "            if (a[j] < a[min]) min = j;",
      "        int t = a[i]; a[i] = a[min]; a[min] = t;",
      "    }",
      "}"
    ],map:[1,2,3,4,5]},
    python:{src:[
      "def selection_sort(a):",
      "    for i in range(len(a) - 1):",
      "        mn = i",
      "        for j in range(i + 1, len(a)):",
      "            if a[j] < a[mn]:",
      "                mn = j",
      "        a[i], a[mn] = a[mn], a[i]"
    ],map:[1,2,3,4,6]}
  },
  insertion:{
    c:{src:[
      "void insertionSort(int a[], int n) {",
      "    for (int i = 1; i < n; i++) {",
      "        int key = a[i];",
      "        int j = i - 1;",
      "        while (j >= 0 && a[j] > key) {",
      "            a[j + 1] = a[j];",
      "            j--;",
      "        }",
      "        a[j + 1] = key;",
      "    }",
      "}"
    ],map:[1,2,3,4,5,8]},
    cpp:{src:[
      "void insertionSort(vector<int>& a) {",
      "    for (size_t i = 1; i < a.size(); ++i) {",
      "        int key = a[i];",
      "        int j = int(i) - 1;",
      "        while (j >= 0 && a[j] > key) {",
      "            a[j + 1] = a[j];",
      "            --j;",
      "        }",
      "        a[j + 1] = key;",
      "    }",
      "}"
    ],map:[1,2,3,4,5,8]},
    java:{src:[
      "void insertionSort(int[] a) {",
      "    for (int i = 1; i < a.length; i++) {",
      "        int key = a[i];",
      "        int j = i - 1;",
      "        while (j >= 0 && a[j] > key) {",
      "            a[j + 1] = a[j];",
      "            j--;",
      "        }",
      "        a[j + 1] = key;",
      "    }",
      "}"
    ],map:[1,2,3,4,5,8]},
    python:{src:[
      "def insertion_sort(a):",
      "    for i in range(1, len(a)):",
      "        key = a[i]",
      "        j = i - 1",
      "        while j >= 0 and a[j] > key:",
      "            a[j + 1] = a[j]",
      "            j -= 1",
      "        a[j + 1] = key"
    ],map:[1,2,3,4,5,7]}
  },
  merge:{
    c:{src:[
      "void mergeSort(int a[], int l, int r) {",
      "    if (l >= r) return;",
      "    int m = (l + r) / 2;",
      "    mergeSort(a, l, m);",
      "    mergeSort(a, m + 1, r);",
      "    merge(a, l, m, r);",
      "}",
      "// merge copies a[l..r] into temp, then writes back in order"
    ],map:[0,1,2,3,-1]},
    cpp:{src:[
      "void mergeSort(vector<int>& a, int l, int r) {",
      "    if (l >= r) return;",
      "    int m = (l + r) / 2;",
      "    mergeSort(a, l, m);",
      "    mergeSort(a, m + 1, r);",
      "    merge(a, l, m, r);",
      "}",
      "// merge copies a[l..r] into temp, then writes back in order"
    ],map:[0,1,2,3,-1]},
    java:{src:[
      "void mergeSort(int[] a, int l, int r) {",
      "    if (l >= r) return;",
      "    int m = (l + r) / 2;",
      "    mergeSort(a, l, m);",
      "    mergeSort(a, m + 1, r);",
      "    merge(a, l, m, r);",
      "}",
      "// merge copies a[l..r] into temp, then writes back in order"
    ],map:[0,1,2,3,-1]},
    python:{src:[
      "def merge_sort(a, l, r):",
      "    if l >= r: return",
      "    m = (l + r) // 2",
      "    merge_sort(a, l, m)",
      "    merge_sort(a, m + 1, r)",
      "    merge(a, l, m, r)",
      "",
      "# merge copies a[l..r] into temp, then writes back in order"
    ],map:[0,1,2,3,-1]}
  },
  factorial:{
    c:{src:[
      "int factorial(int n) {",
      "    if (n <= 1) return 1;",
      "    int sub = factorial(n - 1);",
      "    int result = n * sub;",
      "    return result;",
      "}"
    ],map:[0,1,2,3,4,-1]},
    cpp:{src:[
      "int factorial(int n) {",
      "    if (n <= 1) return 1;",
      "    int sub = factorial(n - 1);",
      "    int result = n * sub;",
      "    return result;",
      "}"
    ],map:[0,1,2,3,4,-1]},
    java:{src:[
      "int factorial(int n) {",
      "    if (n <= 1) return 1;",
      "    int sub = factorial(n - 1);",
      "    int result = n * sub;",
      "    return result;",
      "}"
    ],map:[0,1,2,3,4,-1]},
    python:{src:[
      "def factorial(n):",
      "    if n <= 1:",
      "        return 1",
      "    sub = factorial(n - 1)",
      "    result = n * sub",
      "    return result"
    ],map:[0,1,2,3,4,5]}
  }
};

function realLL(op,lg){
  const py=lg==="python",c=lg==="c",cp=lg==="cpp",pt=c||cp;
  const nn={c:"NULL",cpp:"nullptr",java:"null",python:"None"}[lg];
  const ar=pt?"->":".",sc=py?"":";",H=py?"self.head":"head",pd=pt?"Node *":lg==="java"?"Node ":"";
  const eq=a=>py?`${a} is None`:`${a} == ${nn}`,ne=a=>py?`${a} is not None`:`${a} != ${nn}`;
  const ST=(...a)=>{a=a.filter(Boolean);return py?a.join("; "):a.map(x=>x+";").join(" ")};
  const IFL=(k,...b)=>py?`if ${k}: ${ST(...b)}`:`if (${k}) { ${ST(...b)} }`;
  const WH=k=>py?`while ${k}:`:`while (${k}) {`;
  const pr={c:'printf("Underflow\\n")',cpp:'cout << "Underflow" << endl',java:'System.out.println("Underflow")',python:'print("Underflow")'}[lg];
  const fr=x=>c?`free(${x})`:cp?`delete ${x}`:null;
  const NEW=`${pd}node = ${c?"newNode(x)":py?"Node(x)":"new Node(x)"}${sc}`,nx=a=>a+ar+"next",L=[];
  const A=(t,p,i=0)=>L.push([(i?"    ":"")+t,p]),cm=py?"# temp is garbage collected":"// temp is garbage collected";
  const TV=c?"1":py?"True":"true",FV=c?"0":py?"False":"false";
  const spec={
   "Insert Head":{n:"insertHead",r:"void",a:1,b:()=>{A(NEW,0);A(`${nx("node")} = ${H}${sc}`,1);A(`${H} = node${sc}`,2)}},
   "Insert Tail":{n:"insertTail",r:"void",a:1,b:()=>{A(NEW,0);A(IFL(eq(H),`${H} = node`,"return"),1);A(`${pd}cur = ${H}${sc}`,2);A(WH(ne(nx("cur"))),3);A(`cur = ${nx("cur")}${sc}`,-1,1);if(!py)A("}",-1);A(`${nx("cur")} = node${sc}`,4)}},
   "Delete Head":{n:"deleteHead",r:"void",a:0,b:()=>{A(IFL(eq(H),pr,"return"),0);A(`${pd}temp = ${H}${sc}`,1);A(`${H} = ${nx(H)}${sc}`,2);A(fr("temp")?fr("temp")+sc:cm,3)}},
   "Delete Tail":{n:"deleteTail",r:"void",a:0,b:()=>{A(IFL(eq(H),pr,"return"),0);A(IFL(eq(nx(H)),fr("head"),`${H} = ${nn}`,"return"),1);A(`${pd}cur = ${H}${sc}`,2);A(WH(ne(nx(nx("cur")))),3);A(`cur = ${nx("cur")}${sc}`,-1,1);if(!py)A("}",-1);
      A(ST(fr("last")?`${pd}last = ${nx("cur")}`:"",`${nx("cur")} = ${nn}`,fr("last")),4)}},
   Search:{n:"search",r:c?"int":cp?"bool":"boolean",a:1,b:()=>{A(`${pd}cur = ${H}${sc}`,0);A(WH(ne("cur")),1);A(IFL(`cur${ar}value == x`,"return "+TV),2,1);A(`cur = ${nx("cur")}${sc}`,3,1);if(!py)A("}",-1);A(`return ${FV}${sc}`,4)}}}[op];
  const NODE={c:["typedef struct Node {","    int value;","    struct Node *next;","} Node;","Node *head = NULL;","Node *newNode(int x) { Node *n = malloc(sizeof(Node)); n->value = x; n->next = NULL; return n; }"],
   cpp:["struct Node {","    int value;","    Node *next;","    Node(int v) : value(v), next(nullptr) {}","};","Node *head = nullptr;"],
   java:["class Node {","    int value;","    Node next;","    Node(int v) { value = v; }","}","Node head = null;"],
   python:["class Node:","    def __init__(self, v):","        self.value = v","        self.next = None","","class LinkedList:","    def __init__(self):","        self.head = None"]}[lg];
  spec.b();const src=[...NODE,"",py?`    def ${spec.n.replace(/[A-Z]/g,m=>"_"+m.toLowerCase())}(self${spec.a?", x":""}):`:`${spec.r} ${spec.n}(${spec.a?"int x":""}) {`],map=[],pf=py?"        ":"    ";
  L.forEach(([t,p])=>{src.push(pf+t);if(p>=0)map[p]=src.length-1});if(!py)src.push("}");return{src,map};
}

function realDLL(op,lg){
  const py=lg==="python",c=lg==="c",cp=lg==="cpp",pt=c||cp;
  const nn={c:"NULL",cpp:"nullptr",java:"null",python:"None"}[lg];
  const ar=pt?"->":".", sc=py?"":";", H=py?"self.head":"head", pd=pt?"Node *":lg==="java"?"Node ":"";
  const eq=a=>py?`${a} is None`:`${a} == ${nn}`;
  const ne=a=>py?`${a} is not None`:`${a} != ${nn}`;
  const ST=(...a)=>{a=a.filter(Boolean);return py?a.join("; "):a.map(x=>x+";").join(" ")};
  const IFL=(k,...b)=>py?`if ${k}: ${ST(...b)}`:`if (${k}) { ${ST(...b)} }`;
  const WH=k=>py?`while ${k}:`:`while (${k}) {`;
  const fr=x=>c?`free(${x})`:cp?`delete ${x}`:null;
  const pr={c:'printf("Underflow\\n")',cpp:'cout << "Underflow" << endl',java:'System.out.println("Underflow")',python:'print("Underflow")'}[lg];
  const NEW=`${pd}node = ${c?"newNode(x)":py?"Node(x)":"new Node(x)"}${sc}`;
  const nx=a=>a+ar+"next", pv=a=>a+ar+"prev";
  const TV=c?"1":py?"True":"true", FV=c?"0":py?"False":"false";
  const L=[]; const A=(t,p,i=0)=>L.push([(i?"    ":"")+t,p]);

  const spec={
    "Insert Head":{n:"insertHead",r:"void",a:1,b:()=>{
      A(NEW,0);
      A(`${nx("node")} = ${H}${sc}`,1);
      A(IFL(ne(H),`${pv(H)} = node`),2);
      A(`${H} = node${sc}`,3);
    }},
    "Insert Tail":{n:"insertTail",r:"void",a:1,b:()=>{
      A(NEW,0);
      A(IFL(eq(H),`${H} = node`,"return"),1);
      A(`${pd}cur = ${H}${sc}`,2);
      A(WH(ne(nx("cur"))),3);
      A(`cur = ${nx("cur")}${sc}`,-1,1);
      if(!py)A("}",-1);
      A(ST(`${nx("cur")} = node`,`${pv("node")} = cur`),4);
    }},
    "Insert Before":{n:"insertBefore",r:"void",a:2,b:()=>{
      A(NEW,0);
      A(`${pd}cur = ${H}${sc}`,1);
      A(WH(`${ne("cur")} && cur${ar}value != target`),2);
      A(`cur = ${nx("cur")}${sc}`,-1,1);
      if(!py)A("}",-1);
      A(IFL(eq("cur"),`print("target not found")`,"return"),3);
      A(ST(`${nx("node")} = cur`,`${pv("node")} = ${pv("cur")}`),4);
      A(IFL(ne(pv("cur")),`${nx(pv("cur"))} = node`),5);
      A(`else: ${H} = node`,-1,0);
      A(`${pv("cur")} = node${sc}`,6);
    }},
    "Insert After":{n:"insertAfter",r:"void",a:2,b:()=>{
      A(NEW,0);
      A(`${pd}cur = ${H}${sc}`,1);
      A(WH(`${ne("cur")} && cur${ar}value != target`),2);
      A(`cur = ${nx("cur")}${sc}`,-1,1);
      if(!py)A("}",-1);
      A(IFL(eq("cur"),`print("target not found")`,"return"),3);
      A(ST(`${pv("node")} = cur`,`${nx("node")} = ${nx("cur")}`),4);
      A(IFL(ne(nx("cur")),`${pv(nx("cur"))} = node`),5);
      A(`${nx("cur")} = node${sc}`,6);
    }},
    "Delete Head":{n:"deleteHead",r:"void",a:0,b:()=>{
      A(IFL(eq(H),pr,"return"),0);
      A(`${pd}temp = ${H}${sc}`,1);
      A(`${H} = ${nx(H)}${sc}`,2);
      A(IFL(ne(H),`${pv(H)} = ${nn}`),3);
      A(fr("temp")?fr("temp")+sc:(py?"# temp is garbage collected":"// temp is garbage collected"),4);
    }},
    "Delete Tail":{n:"deleteTail",r:"void",a:0,b:()=>{
      A(IFL(eq(H),pr,"return"),0);
      A(IFL(eq(nx(H)),`${H} = ${nn}`,"return"),1);
      A(`${pd}cur = ${H}${sc}`,2);
      A(WH(ne(nx(nx("cur")))),3);
      A(`cur = ${nx("cur")}${sc}`,-1,1);
      if(!py)A("}",-1);
      A(ST(`${nx("cur")} = ${nn}`),4);
    }},
    Search:{n:"search",r:c?"int":cp?"bool":"boolean",a:1,b:()=>{
      A(`${pd}cur = ${H}${sc}`,0);
      A(WH(ne("cur")),1);
      A(IFL(`cur${ar}value == x`,"return "+TV),2,1);
      A(`cur = ${nx("cur")}${sc}`,3,1);
      if(!py)A("}",-1);
      A(`return ${FV}${sc}`,4);
    }}
  }[op];

  const NODE={
    c:["typedef struct Node {","    int value;","    struct Node *prev;","    struct Node *next;","} Node;","Node *head = NULL;","Node *newNode(int x) { Node *n = malloc(sizeof(Node)); n->value = x; n->prev = n->next = NULL; return n; }"],
    cpp:["struct Node {","    int value;","    Node *prev;","    Node *next;","    Node(int v) : value(v), prev(nullptr), next(nullptr) {}","};","Node *head = nullptr;"],
    java:["class Node {","    int value;","    Node prev;","    Node next;","    Node(int v) { value = v; }","}","Node head = null;"],
    python:["class Node:","    def __init__(self, v):","        self.value = v","        self.prev = None","        self.next = None","","class DoublyLinkedList:","    def __init__(self):","        self.head = None"]
  }[lg];

  spec.b();
  const head=py?`    def ${spec.n.replace(/[A-Z]/g,m=>"_"+m.toLowerCase())}(self${spec.a?", x":""}${spec.a===2?", target":""}):`:`${spec.r} ${spec.n}(${spec.a===1?"int x":spec.a===2?"int target, int x":""}) {`;
  const src=[...NODE,"",head];
  const map=[];
  const pf=py?"        ":"    ";
  L.forEach(([t,p])=>{src.push(pf+t);if(p>=0)map[p]=src.length-1});
  if(!py)src.push("}");
  return {src,map};
}

function realDS(c,op,lg){
  const S=c==="stack",K=op==="Push"||op==="Enqueue"?"add":op==="Pop"||op==="Dequeue"||op==="Pop Back"?"rem":op==="Push Front"?"addF":"peek",py=lg==="python",p=S?"top":"rear",q=S?"top":"front",
  g=K==="add"?`${p} == MAX - 1`:K==="addF"?"front == 0":S?"top == -1":"front > rear",msg=K==="add"||K==="addF"?"Overflow":K==="rem"?"Underflow":"Empty",rv=K==="add"||K==="addF"?"":" -1";
  let b=K==="add"?[`${p} = ${p} + 1`,`a[${p}] = x`]:K==="addF"?["front = front - 1","a[front] = x"]:K==="rem"?[(py?"":"int ")+`x = a[${op==="Pop Back"?"rear":q}]`,S?"top = top - 1":op==="Pop Back"?"rear = rear - 1":"front = front + 1","return x"]:[`return a[${q}]`];
  const pr={c:`printf("${msg}\\n")`,cpp:`cout << "${msg}" << endl`,java:`System.out.println("${msg}")`,python:`print("${msg}")`}[lg],f=op.toLowerCase().replace(/\s+/g,"_"),add=K==="add"||K==="addF";
  const head=py?`def ${f}(self${add?", x":""}):`:`${add?"void":"int"} ${f}(${add?"int x":""}) {`,guard=py?`if ${g}: ${pr}; return${rv}`:`if (${g}) { ${pr}; return${rv}; }`;
  const sf=t=>py?t.replace(/\b(top|rear|front|a)\b/g,"self.$1"):t;
  const src=[head,...[guard,...b].map(t=>"    "+sf(t)+(py?"":";").replace(/^;$/,";"))];if(!py)src.push("}");
  if(!py)src[1]=src[1].replace(/;$/,"");
  return{src,map:add?[1,2,3]:K==="rem"?[1,2,3,4]:K==="addF"?[1,2,3]:[1,2]};
}

// Syntax Highlighting
function esc(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}
const KW_COMMON="for|while|if|else|return|break|continue|new|void|null|true|false|int|float|double|char|bool|size_t|string";
const KW_PSEUDO="swap|mergeSort|merge|dfs|push|pop|enqueue|dequeue|peek|mark|visit|relax|union|find|insert|delete|search|free|sort|add|remove|start|end|head|tail|front|rear|top|to";
const KW_C="void|int|float|double|char|long|short|unsigned|signed|struct|typedef|const|static|return|if|else|for|while|do|break|continue|switch|case|sizeof|NULL";
const KW_CPP=KW_C+"|auto|class|public|private|protected|template|typename|namespace|using|vector|bool|true|false|nullptr|size_t|swap|std";
const KW_JAVA="public|private|protected|class|static|void|int|float|double|char|long|short|boolean|String|return|if|else|for|while|do|break|continue|new|true|false|null|this";
const KW_PY="def|return|if|elif|else|for|while|in|range|len|break|continue|and|or|not|True|False|None|print|is|None|lambda|pass";

function kwset(plang){
  if(plang==="c")return new RegExp("\\b("+KW_C+")\\b");
  if(plang==="cpp")return new RegExp("\\b("+KW_CPP+")\\b");
  if(plang==="java")return new RegExp("\\b("+KW_JAVA+")\\b");
  if(plang==="python")return new RegExp("\\b("+KW_PY+")\\b");
  return new RegExp("\\b("+KW_COMMON+"|"+KW_PSEUDO+")\\b");
}

function hl(line,plang){
  const isPy=plang==="python";
  const cm=isPy?/#.*$/:/\/\/.*$/;
  const KW=kwset(plang);
  const NUM=/\b\d+(?:\.\d+)?\b/;
  const OP=/(?:↔|→|≤|≥|<=|>=|==|!=|&&|\|\||<<|>>|[<>]=?|[=+\-*/%])/;
  const out=[];let i=0;
  while(i<line.length){
    const rest=line.slice(i);
    const mc=rest.match(cm);
    if(mc&&mc.index===0){out.push(`<span class="tk-cm">${esc(rest)}</span>`);break}
    let done=false;
    const mn=rest.match(NUM);if(mn&&mn.index===0){out.push(`<span class="tk-num">${esc(mn[0])}</span>`);i+=mn[0].length;done=true}
    if(!done){const mk=rest.match(KW);if(mk&&mk.index===0){out.push(`<span class="tk-kw">${esc(mk[0])}</span>`);i+=mk[0].length;done=true}}
    if(!done){
      const mf=rest.match(/^[A-Za-z_]\w*(?=\s*\()/);
      if(mf&&!/^(if|for|while|switch|return|sizeof)$/.test(mf[0])){out.push(`<span class="tk-fn">${esc(mf[0])}</span>`);i+=mf[0].length;done=true}
    }
    if(!done){const mo=rest.match(OP);if(mo&&mo.index===0){out.push(`<span class="tk-op">${esc(mo[0])}</span>`);i+=mo[0].length;done=true}}
    if(!done){out.push(esc(line[i]));i++}
  }
  return out.join("")||" ";
}
