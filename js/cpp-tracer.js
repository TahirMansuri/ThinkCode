/* C++ step tracer: a small interpreter for a teaching subset of C++.
   traceCpp(src, stdinText) -> {ok, steps, error, out}  (same shape as the Python tracer)
   step = {line, event:"line"|"return", ret, msg, vars, stack:[{fn,line,vars}], out}
   Each step shows the state AFTER its line has run. */
function traceCpp(src, stdin, limit = 2000) {
  const steps = []; let out = "", quiet = false, err = null;
  class Err extends Error { constructor(type, msg, line) { super(msg); this.type = type; this.line = line; } }
  const E = (m, l, t = "Error") => { throw new Err(t, m, l); };
  const chr = n => String.fromCharCode(n);
  const unesc = s => s.replace(/\\(.)/g, (m, c) => ({ n: "\n", t: "\t", "0": "\0" }[c] ?? c));
  try { // lexer, parser and runtime are all inside this try, so every error is reported the same way

  /* ---------- lexer ---------- */
  const toks = []; src = src.replace(/\bstd::/g, "");
  const re = /\s+|\/\/[^\n]*|\/\*[\s\S]*?\*\/|#[^\n]*|(\d+\.\d*|\.\d+|\d+)[fFlLuU]*|([A-Za-z_]\w*)|"((?:\\.|[^"\\\n])*)"|'((?:\\.|[^'\\\n])*)'|(<<=|>>=|<<|>>|\+\+|--|\+=|-=|\*=|\/=|%=|==|!=|<=|>=|&&|\|\||->|[-+*\/%=<>!&|^~?:;,.(){}\[\]])|([\s\S])/y;
  let m, line = 1;
  while (re.lastIndex < src.length && (m = re.exec(src))) {
    const t = m[0];
    if (m[1] !== undefined) toks.push({ k: "num", v: t.replace(/[fFlLuU]+$/, ""), f: t.includes("."), line });
    else if (m[2] !== undefined) toks.push({ k: "id", v: t, line });
    else if (m[3] !== undefined) toks.push({ k: "str", v: unesc(m[3]), line });
    else if (m[4] !== undefined) toks.push({ k: "chr", v: unesc(m[4]), line });
    else if (m[5] !== undefined) toks.push({ k: "op", v: t, line });
    else if (m[6] !== undefined) E(`unexpected character '${t}'`, line, "SyntaxError");
    line += (t.match(/\n/g) || []).length;
  }
  toks.push({ k: "eof", v: "<end of file>", line });

  /* ---------- parser ---------- */
  let p = 0;
  const pk = (o = 0) => toks[Math.min(p + o, toks.length - 1)], nx = () => toks[p++];
  const is = (v, o = 0) => { const t = pk(o); return (t.k === "op" || t.k === "id") && t.v === v; };
  const ex = v => { if (!is(v)) { const t = pk(); E(`expected '${v}' but found '${t.v}'`, v === ";" || v === ")" ? toks[p - 1].line : t.line, "SyntaxError"); } return nx(); };
  const TY = new Set(["int", "long", "short", "unsigned", "signed", "float", "double", "char", "bool", "string", "auto", "void", "const"]);
  const isType = () => { const t = pk(); return t.k === "id" && (TY.has(t.v) || t.v === "vector"); };
  function parseType() {
    const w = []; let vec = false;
    while (isType()) { const v = nx().v; if (v === "vector") { vec = true; ex("<"); w.push(parseType().base); ex(">"); } else w.push(v); }
    const base = w.includes("double") || w.includes("float") ? "double" : w.includes("char") ? "char" : w.includes("bool") ? "bool"
      : w.includes("string") ? "string" : w.includes("void") ? "void" : w.includes("auto") ? "auto" : "int";
    return { base, vec };
  }
  const BP = { "||": 1, "&&": 2, "==": 3, "!=": 3, "<": 4, ">": 4, "<=": 4, ">=": 4, "<<": 5, ">>": 5, "+": 6, "-": 6, "*": 7, "/": 7, "%": 7 };
  const pe = () => pAssign();
  function pAssign() { const l = pTern(), t = pk(); if (t.k === "op" && /^(=|\+=|-=|\*=|\/=|%=)$/.test(t.v)) { nx(); return { k: "asg", op: t.v, l, r: pAssign(), line: t.line }; } return l; }
  function pTern() { const c = pBin(1); if (is("?")) { nx(); const a = pAssign(); ex(":"); return { k: "tern", c, a, b: pAssign() }; } return c; }
  function pBin(min) { let l = pUn(); for (;;) { const t = pk(), b = t.k === "op" && BP[t.v]; if (!b || b < min) return l; nx(); l = { k: "bin", op: t.v, l, r: pBin(b + 1), line: t.line }; } }
  function pUn() {
    const t = pk();
    if (t.k === "op" && "!-+".includes(t.v) && t.v.length === 1) { nx(); return { k: "un", op: t.v, e: pUn(), line: t.line }; }
    if (t.k === "op" && (t.v === "++" || t.v === "--")) { nx(); return { k: "inc", op: t.v, e: pUn(), pre: true, line: t.line }; }
    if (is("(") && pk(1).k === "id" && TY.has(pk(1).v)) { nx(); const ty = parseType(); ex(")"); return { k: "cast", ty: ty.base, e: pUn() }; }
    if (t.k === "op" && (t.v === "*" || t.v === "&")) E("pointers and references (* &) in expressions are not supported yet", t.line, "NotSupported");
    return pPost();
  }
  function pArgs() { const a = []; if (!is(")")) { do a.push(pAssign()); while (is(",") && nx()); } ex(")"); return a; }
  function pPost() {
    let e = pPri();
    for (;;) {
      const t = pk();
      if (is("[")) { nx(); const i = pe(); ex("]"); e = { k: "idx", a: e, i, line: t.line }; }
      else if (is("++") || is("--")) { nx(); e = { k: "inc", op: t.v, e, pre: false, line: t.line }; }
      else if (is(".")) { nx(); const mm = nx().v; let args = []; if (is("(")) { nx(); args = pArgs(); } e = { k: "meth", o: e, m: mm, args, line: t.line }; }
      else return e;
    }
  }
  function pPri() {
    const t = nx();
    if (t.k === "num") return { k: "num", t: t.f ? "double" : "int", v: Number(t.v) };
    if (t.k === "str") return { k: "str", v: t.v };
    if (t.k === "chr") return { k: "chr", v: t.v.charCodeAt(0) };
    if (t.k === "id") { if (is("(")) { nx(); return { k: "call", n: t.v, args: pArgs(), line: t.line }; } return { k: "var", n: t.v, line: t.line }; }
    if (t.v === "(" && t.k === "op") { const e = pe(); ex(")"); return e; }
    E(`unexpected '${t.v}'`, t.line, "SyntaxError");
  }
  function pInit() { if (is("{")) { nx(); const L = []; if (!is("}")) { do { if (is("}")) break; L.push(pInit()); } while (is(",") && nx()); } ex("}"); return { k: "list", items: L }; } return pAssign(); }
  function pDecl() {
    const l = pk().line, ty = parseType(), ds = [];
    do {
      if (is("*")) E("pointers are not supported yet", pk().line, "NotSupported");
      if (is("&")) nx();
      const n = nx(); if (n.k !== "id") E("expected a variable name", n.line, "SyntaxError");
      let dims = [], init = null;
      while (is("[")) { nx(); dims.push(is("]") ? -1 : pe()); ex("]"); }
      if (is("(") && ty.vec) { nx(); dims = [pe()]; ex(")"); }
      else if (is("=")) { nx(); init = pInit(); }
      ds.push({ n: n.v, dims, init });
    } while (is(",") && nx());
    ex(";"); return { k: "decl", ty, ds, line: l };
  }
  function pBlock() { const l = ex("{").line, ss = []; while (!is("}")) { if (pk().k === "eof") E("missing '}' at the end of the file", l, "SyntaxError"); ss.push(pStmt()); } return { k: "blk", ss, line: l, end: nx().line }; }
  function pStmt() {
    const t = pk(), l = t.line;
    if (is("{") && t.k === "op") return pBlock();
    if (t.k === "id") {
      switch (t.v) {
        case "if": { nx(); ex("("); const c = pe(); ex(")"); const a = pStmt(); let b = null; if (is("else")) { nx(); b = pStmt(); } return { k: "if", c, a, b, line: l }; }
        case "while": { nx(); ex("("); const c = pe(); ex(")"); return { k: "while", c, b: pStmt(), line: l }; }
        case "do": { nx(); const b = pStmt(); ex("while"); ex("("); const c = pe(); ex(")"); ex(";"); return { k: "do", c, b, line: l }; }
        case "for": {
          nx(); ex("("); let i = null;
          if (isType()) { const s0 = p, ty = parseType(); if (pk().k === "id" && is(":", 1)) { const n = nx().v; nx(); const e = pe(); ex(")"); return { k: "rfor", ty, n, e, b: pStmt(), line: l }; } p = s0; }
          if (!is(";")) i = isType() ? pDecl() : { k: "expr", e: pe(), line: l };
          if (!(i && i.k === "decl")) ex(";");
          const c = is(";") ? null : pe(); ex(";"); const s = is(")") ? null : pe(); ex(")");
          return { k: "for", i, c, s, b: pStmt(), line: l };
        }
        case "switch": {
          nx(); ex("("); const e = pe(); ex(")"); ex("{"); const cases = [];
          while (!is("}")) {
            const ct = pk();
            if (ct.k === "eof") E("missing '}' at the end of switch", l, "SyntaxError");
            if (is("case")) { nx(); const v = pe(); ex(":"); cases.push({ v, body: [], line: ct.line }); }
            else if (is("default")) { nx(); ex(":"); cases.push({ v: null, body: [], line: ct.line }); }
            else { if (!cases.length) E("expected 'case' or 'default' here", ct.line, "SyntaxError"); cases[cases.length - 1].body.push(pStmt()); }
          }
          nx(); return { k: "switch", e, cases, line: l };
        }
        case "return": { nx(); const e = is(";") ? null : pe(); ex(";"); return { k: "ret", e, line: l }; }
        case "break": case "continue": nx(); ex(";"); return { k: t.v, line: l };
        case "struct": case "class": case "new": case "delete": case "template": E(`'${t.v}' is not supported yet in this tracer`, l, "NotSupported");
      }
      if (isType()) return pDecl();
    }
    if (is(";")) { nx(); return { k: "nop", line: l }; }
    const e = pe(); ex(";"); return { k: "expr", e, line: l };
  }
  const funcs = {}, globals = [];
  while (pk().k !== "eof") {
    if (is("using")) { while (!is(";") && pk().k !== "eof") nx(); nx(); continue; }
    const s0 = p;
    if (!isType()) E(`unexpected '${pk().v}' outside a function`, pk().line, "SyntaxError");
    const ty = parseType(), nm = nx();
    if (nm.k === "id" && is("(")) {
      nx(); const params = [];
      if (is("void") && is(")", 1)) nx();
      while (!is(")")) {
        const pt = parseType(); if (is("*")) E("pointers are not supported yet", pk().line, "NotSupported");
        const ref = is("&"); if (ref) nx(); const pn = nx().v; let arr = pt.vec;
        while (is("[")) { nx(); if (!is("]")) pe(); ex("]"); arr = true; }
        params.push({ n: pn, ty: pt.base, ref, arr }); if (!is(")")) ex(",");
      }
      ex(")"); funcs[nm.v] = { ty: ty.base, params, body: pBlock(), line: nm.line };
    } else { p = s0; globals.push(pDecl()); }
  }

  /* ---------- runtime ---------- */
  const mk = par => ({ m: new Map(), p: par }), G = mk(null), stack = [];
  const F = () => stack[stack.length - 1], scope = () => F().scope;
  const look = (n, l) => { for (let s = scope(); s; s = s.p) if (s.m.has(n)) return s.m.get(n); E(`'${n}' was not declared in this scope`, l, "CompileError"); };
  const fd = v => String(Number(v.toPrecision(6)));
  const show = c => c.t === "int" ? String(c.v) : c.t === "double" ? fd(c.v) : c.t === "char" ? "'" + chr(c.v) + "'" : c.t === "bool" ? (c.v ? "true" : "false")
    : c.t === "string" ? '"' + c.v + '"' : "[" + c.v.map(x => show(c.et === "arr" ? x : { t: c.et, v: x })).join(", ") + "]";
  const frameVars = f => { const o = {}; for (let s = f.scope; s; s = s.p) for (const [k, c] of s.m) if (!(k in o)) o[k] = show(c); return o; };
  function step(line, msg, ret) {
    if (quiet) return;
    if (steps.length >= limit) throw new Err("StepLimit", "Too many steps - maybe an infinite loop?", line);
    const st = stack.map(f => ({ fn: f.fn, line, vars: frameVars(f) }));
    steps.push({ line, event: ret !== undefined ? "return" : "line", ret: ret ?? null, msg: msg || "", vars: st[st.length - 1].vars, stack: st, out });
  }
  const cv = (t, x, l) => {
    if (t === "string") return x.t === "string" ? x.v : x.t === "char" ? chr(x.v) : E("cannot convert to string", l, "CompileError");
    if (x.t === "string" || x.t === "arr" || x.t === "stream") E(`cannot convert ${x.t} to ${t}`, l, "CompileError");
    return t === "int" ? Math.trunc(x.v) : t === "bool" ? (x.v ? 1 : 0) : t === "char" ? Math.trunc(x.v) : x.v;
  };
  const inp = stdin.split(/\s+/).filter(Boolean);
  function readIn(t, l) {
    if (!inp.length) E("cin: no input left - type the values in the Input box", l, "RuntimeError");
    let w = inp.shift();
    if (t === "string") return w;
    if (t === "char") { if (w.length > 1) inp.unshift(w.slice(1)); return w.charCodeAt(0); }
    const v = t === "double" ? parseFloat(w) : parseInt(w, 10);
    if (Number.isNaN(v)) E(`cin: '${w}' is not a valid ${t}`, l, "RuntimeError");
    return v;
  }
  const arith = (op, a, b, l) => {
    if (a.t === "string" || b.t === "string") {
      const s = x => x.t === "string" ? x.v : x.t === "char" ? chr(x.v) : String(x.v);
      if (op === "+") return { t: "string", v: s(a) + s(b) };
      const c = s(a), d = s(b);
      return { t: "bool", v: +({ "==": c === d, "!=": c !== d, "<": c < d, ">": c > d, "<=": c <= d, ">=": c >= d }[op]) };
    }
    const d = a.t === "double" || b.t === "double", x = a.v, y = b.v; let r;
    switch (op) {
      case "+": r = x + y; break; case "-": r = x - y; break; case "*": r = x * y; break;
      case "/": if (!d && y === 0) E("division by zero", l, "RuntimeError"); r = d ? x / y : Math.trunc(x / y); break;
      case "%": if (y === 0) E("division by zero", l, "RuntimeError"); r = x % y; break;
      case "<<": r = x << y; break; case ">>": r = x >> y; break;
      default: return { t: "bool", v: +({ "<": x < y, ">": x > y, "<=": x <= y, ">=": x >= y, "==": x === y, "!=": x !== y }[op]) };
    }
    return { t: d ? "double" : "int", v: r };
  };
  function ref(n) {
    if (n.k === "var") { const c = look(n.n, n.line); if (c.t === "arr") E(`'${n.n}' is an array: use ${n.n}[i]`, n.line, "CompileError"); return { get: () => ({ t: c.t, v: c.v }), set: x => { c.v = cv(c.t, x, n.line); } }; }
    if (n.k === "idx") {
      const a = ev(n.a), i = Math.trunc(ev(n.i).v), len = a.v.length;
      if (a.t !== "arr" && a.t !== "string") E("only arrays, vectors and strings can be indexed", n.line, "CompileError");
      if (i < 0 || i >= len) E(`index ${i} is out of bounds (size ${len})`, n.line, "RuntimeError");
      if (a.t === "arr" && a.et === "arr") return { get: () => a.v[i], set: () => E("cannot assign a whole row", n.line, "CompileError") };
      if (a.t === "string") return { get: () => ({ t: "char", v: a.v.charCodeAt(i) }), set: x => { a.v = a.v.slice(0, i) + chr(cv("char", x)) + a.v.slice(i + 1); } };
      return { get: () => ({ t: a.et, v: a.v[i] }), set: x => { a.v[i] = cv(a.et, x, n.line); } };
    }
    E("invalid assignment target", n.line, "CompileError");
  }
  const write = x => { out += x.t === "string" ? x.v : x.t === "char" ? chr(x.v) : x.t === "double" ? fd(x.v) : x.t === "bool" ? (x.v ? 1 : 0) : x.t === "arr" ? E("cannot print an array directly", 0, "CompileError") : String(x.v); };
  const printf = (a, l) => { let i = 1; return a[0].v.replace(/%([-0+ ]*)(\d*)(?:\.(\d+))?(?:ll|l|h)?([dicsfuxX%])/g, (mm, fl, w, pr, c) => {
    if (c === "%") return "%"; const x = a[i++]; if (!x) E("printf: not enough arguments", l, "RuntimeError");
    let s = c === "f" ? Number(x.v).toFixed(pr === undefined ? 6 : +pr) : c === "c" ? chr(x.v) : c === "s" ? x.v : c === "x" ? x.v.toString(16) : c === "X" ? x.v.toString(16).toUpperCase() : String(Math.trunc(x.v));
    if (w) s = fl.includes("-") ? s.padEnd(+w) : s.padStart(+w, fl.includes("0") && c !== "s" ? "0" : " "); return s; }); };
  const D = (t, v) => ({ t, v });
  const BI = { sqrt: a => D("double", Math.sqrt(a[0].v)), pow: a => D("double", Math.pow(a[0].v, a[1].v)), floor: a => D("double", Math.floor(a[0].v)), ceil: a => D("double", Math.ceil(a[0].v)),
    abs: a => D(a[0].t === "double" ? "double" : "int", Math.abs(a[0].v)), max: a => a[0].v >= a[1].v ? a[0] : a[1], min: a => a[0].v <= a[1].v ? a[0] : a[1],
    swap: a => { [a[0].v, a[1].v] = [a[1].v, a[0].v]; return D("int", 0); } };
  function ev(n) {
    switch (n.k) {
      case "num": return D(n.t, n.v); case "str": return D("string", n.v); case "chr": return D("char", n.v);
      case "var": if (n.n === "endl") return D("string", "\n"); if (n.n === "cout" || n.n === "cin") return D("stream", n.n);
        if (n.n === "true" || n.n === "false") return D("bool", +(n.n === "true")); return look(n.n, n.line);
      case "asg": { const r = ev(n.r), t = ref(n.l); t.set(n.op === "=" ? r : arith(n.op[0], t.get(), r, n.line)); return t.get(); }
      case "inc": { const t = ref(n.e), c = t.get(); t.set(D(c.t, c.v + (n.op === "++" ? 1 : -1))); return n.pre ? t.get() : c; }
      case "bin": {
        if (n.op === "&&") return D("bool", +(ev(n.l).v && ev(n.r).v)); if (n.op === "||") return D("bool", +(ev(n.l).v || ev(n.r).v));
        const a = ev(n.l);
        if (a.t === "stream" && n.op === "<<") { write(ev(n.r)); return a; }
        if (a.t === "stream" && n.op === ">>") { const t = ref(n.r), c = t.get(); t.set(D(c.t, readIn(c.t, n.line))); return a; }
        return arith(n.op, a, ev(n.r), n.line);
      }
      case "un": { const x = ev(n.e); return n.op === "!" ? D("bool", +!x.v) : D(x.t === "double" ? "double" : "int", n.op === "-" ? -x.v : x.v); }
      case "tern": return ev(n.c).v ? ev(n.a) : ev(n.b);
      case "cast": { const x = ev(n.e); return D(n.ty, cv(n.ty, x, 0)); }
      case "idx": return ref(n).get();
      case "meth": {
        const o = ev(n.o), a = n.args.map(ev), L = o.v.length;
        switch (n.m) {
          case "size": case "length": return D("int", L); case "empty": return D("bool", +(L === 0));
          case "push_back": o.v.push(cv(o.et, a[0], n.line)); return D("int", 0); case "pop_back": o.v.pop(); return D("int", 0);
          case "back": return D(o.et, o.v[L - 1]); case "front": return D(o.et, o.v[0]); case "clear": o.v = o.t === "string" ? "" : []; return D("int", 0);
          case "substr": return D("string", o.v.substr(a[0].v, a[1] ? a[1].v : undefined));
        } E(`'${n.m}' is not supported yet`, n.line, "NotSupported");
      }
      case "call": return call(n);
    }
  }
  function call(n) {
    const args = n.args.map(ev);
    if (n.n === "printf") { out += printf(args, n.line); return D("int", 0); }
    const fn = funcs[n.n];
    if (!fn) { if (BI[n.n]) return BI[n.n](args); E(`'${n.n}' was not declared in this scope`, n.line, "CompileError"); }
    if (n.n !== "main" && args.length !== fn.params.length) E(`${n.n}() needs ${fn.params.length} argument(s) but got ${args.length}`, n.line, "CompileError");
    if (stack.length > 200) E("stack overflow (recursion is too deep)", n.line, "RuntimeError");
    const f = { fn: n.n, scope: mk(G) }; stack.push(f);
    fn.params.forEach((pr, i) => { const a = args[i]; f.scope.m.set(pr.n, a.t === "arr" || (pr.ref && n.args[i].k === "var") ? a : { t: pr.ty === "auto" ? a.t : pr.ty, v: cv(pr.ty === "auto" ? a.t : pr.ty, a, n.line) }); });
    step(fn.line, `call ${n.n}(${args.map(a => a.t === "arr" ? "[...]" : show(a)).join(", ")})`);
    const r = exec(fn.body); let rv = D("int", 0);
    if (r && r.k === "ret" && r.v) rv = fn.ty === "void" ? r.v : D(fn.ty, cv(fn.ty, r.v, n.line));
    if (n.n === "main" && steps.length) steps.push({ ...steps[steps.length - 1], line: fn.body.end, event: "line", ret: null, msg: "main() finished", out });
    stack.pop(); return rv;
  }
  const cond = (s, l) => { const c = ev(s).v; step(l, "condition is " + (c ? "true" : "false")); return c; };
  const build = (dims, init, et, l) => {
    const isL = init && init.k === "list", len = dims[0] === -1 ? (isL ? init.items.length : 0) : Math.trunc(ev(dims[0]).v);
    if (len < 0 || len > 10000) E("invalid array size " + len, l, "RuntimeError");
    const v = Array.from({ length: len }, (_, i) => dims.length > 1 ? build(dims.slice(1), isL ? init.items[i] : null, et, l)
      : isL && i < init.items.length ? cv(et, ev(init.items[i]), l) : et === "string" ? "" : 0);
    return { t: "arr", et: dims.length > 1 ? "arr" : et, v };
  };
  function exec(s) {
    switch (s.k) {
      case "blk": { const f = F(), old = f.scope; f.scope = mk(old); try { for (const x of s.ss) { const r = exec(x); if (r) return r; } } finally { f.scope = old; } return; }
      case "decl": {
        for (const d of s.ds) {
          const base = s.ty.base, et = base === "auto" ? "int" : base; let c;
          if (s.ty.vec || d.dims.length) { c = build(d.dims.length ? d.dims : [-1], d.init, et, s.line); } else { const x = d.init ? ev(d.init) : D(et, et === "string" ? "" : 0), t = base === "auto" ? x.t : base; c = { t, v: cv(t, x, s.line) }; }
          scope().m.set(d.n, c);
        }
        step(s.line); return;
      }
      case "expr": ev(s.e); step(s.line); return;
      case "if": { const c = cond(s.c, s.line); return exec(c ? s.a : s.b || { k: "nop" }); }
      case "while": for (;;) { if (!cond(s.c, s.line)) break; const r = exec(s.b); if (r) { if (r.k === "break") break; if (r.k === "ret") return r; } } return;
      case "switch": {
        const x = ev(s.e); step(s.line, `switch (${show(x)})`);
        let i = s.cases.findIndex(c => c.v && ev(c.v).v === x.v), dflt = false;
        if (i < 0) { i = s.cases.findIndex(c => !c.v); dflt = true; }
        if (i < 0) return;
        step(s.cases[i].line, dflt ? "no case matches -> default" : "case matches");
        const f = F(), old = f.scope; f.scope = mk(old);
        try { for (; i < s.cases.length; i++) for (const st of s.cases[i].body) { const r = exec(st); if (r) return r.k === "break" ? undefined : r; } } finally { f.scope = old; }
        return;
      }
      case "do": for (;;) { const r = exec(s.b); if (r) { if (r.k === "break") break; if (r.k === "ret") return r; } if (!cond(s.c, s.line)) break; } return;
      case "for": {
        const f = F(), old = f.scope; f.scope = mk(old);
        try {
          if (s.i) exec(s.i);
          for (;;) {
            if (s.c && !cond(s.c, s.line)) break;
            const r = exec(s.b); if (r) { if (r.k === "break") break; if (r.k === "ret") return r; }
            if (s.s) { ev(s.s); step(s.line, "update"); }
          }
        } finally { f.scope = old; } return;
      }
      case "rfor": {
        const f = F(), old = f.scope, a = ev(s.e), items = a.t === "string" ? [...a.v].map(ch => ch.charCodeAt(0)) : a.v.slice(), et = a.t === "string" ? "char" : a.et;
        f.scope = mk(old);
        try {
          for (const x of items) {
            f.scope.m.set(s.n, et === "arr" ? x : { t: s.ty.base === "auto" ? et : s.ty.base, v: x }); step(s.line, `${s.n} = ${show(et === "arr" ? x : { t: et, v: x })}`);
            const r = exec(s.b); if (r) { if (r.k === "break") break; if (r.k === "ret") return r; }
          }
        } finally { f.scope = old; } return;
      }
      case "ret": { const v = s.e ? ev(s.e) : null; if (stack.length > 1) step(s.line, "return", v ? show(v) : "void"); else step(s.line, "return"); return { k: "ret", v }; }
      case "break": case "continue": return { k: s.k };
      case "nop": return;
    }
  }
    if (!funcs.main) E("no main() function found", 1, "CompileError");
    quiet = true; stack.push({ fn: "global", scope: G }); for (const g of globals) exec(g); stack.pop(); quiet = false;
    call({ n: "main", args: [], line: funcs.main.line });
  } catch (e) {
    if (e instanceof Err) err = { type: e.type, msg: e.message, line: e.line };
    else err = { type: "InternalError", msg: String(e.message || e), line: steps.length ? steps[steps.length - 1].line : 1 };
  }
  return { ok: !err, steps, error: err, out };
}

/* ---------- syntax colours for the editor (same CSS classes as pyHL: k s n c b) ---------- */
const CPP_KW = /^(auto|bool|break|case|char|class|const|continue|default|do|double|else|float|for|if|int|long|namespace|return|short|signed|string|struct|switch|true|false|unsigned|using|vector|void|while)$/;
const CPP_BI = /^(cout|cin|endl|printf|scanf|sqrt|pow|abs|max|min|swap|size|push_back|main)$/;
function cppHL(code) {
  const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  return code.replace(/(\/\/[^\n]*|\/\*[\s\S]*?\*\/|^\s*#.*$)|("(?:\\.|[^"\\\n])*"?|'(?:\\.|[^'\\\n])*'?)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_]\w*)|([\s\S])/gm,
    (m, c, s, n, w, o) => c ? `<span class="c">${esc(c)}</span>` : s ? `<span class="s">${esc(s)}</span>` : n ? `<span class="n">${n}</span>`
      : w ? (CPP_KW.test(w) ? `<span class="k">${w}</span>` : CPP_BI.test(w) ? `<span class="b">${w}</span>` : w) : esc(o));
}

if (typeof window !== "undefined") {
  window.traceCpp = traceCpp;
  window.cppHL = cppHL;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = { traceCpp, cppHL };
}
