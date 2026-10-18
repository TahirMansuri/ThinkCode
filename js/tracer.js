// --- Python & C++ Code Tracer & Execution Engine ---

(() => {
  const $ = id => {
    return document.getElementById(id) ||
           document.getElementById("py" + id.charAt(0).toUpperCase() + id.slice(1)) ||
           document.getElementById(id.toLowerCase());
  };

  const TRACER_PY = String.raw`
import sys, io, json, types

class StepLimit(Exception): pass

def run_traced(src, stdin_text, limit=2000):
    steps, out = [], io.StringIO()
    inputs = iter(stdin_text.split("\n") if stdin_text else [])

    def fake_input(prompt=""):
        out.write(str(prompt))
        try: v = next(inputs)
        except StopIteration: raise EOFError("input() needs a value - type it in the Input box")
        out.write(v + "\n")
        return v

    def short(v):
        r = repr(v)
        return r if len(r) <= 60 else r[:57] + "..."

    def clean(d):
        return {k: short(v) for k, v in d.items()
                if not k.startswith("__") and not isinstance(v, (types.ModuleType, types.FunctionType, type))}

    def stack_of(frame):
        st = []
        while frame:
            if frame.f_code.co_filename == "<student>":
                st.append({"fn": frame.f_code.co_name, "line": frame.f_lineno, "vars": clean(frame.f_locals)})
            frame = frame.f_back
        return st[::-1]

    pend = {}

    def finish(frame):
        st = pend.pop(id(frame), None)
        if st is None:
            return
        stk = stack_of(frame)
        if st.get("_c"):      # line that called a function: add the "after return" step
            steps.append({"line": st["line"], "event": "line", "ret": None,
                          "vars": stk[-1]["vars"], "stack": stk, "out": out.getvalue()})
        else:
            st["vars"], st["stack"], st["out"] = stk[-1]["vars"], stk, out.getvalue()

    def tracer(frame, event, arg):
        if frame.f_code.co_filename != "<student>":
            return None
        if event == "call":
            pend.pop(id(frame), None)
            p = pend.get(id(frame.f_back))
            if p: p["_c"] = True
        elif event in ("line", "return"):
            finish(frame)
            if len(steps) >= limit:
                raise StepLimit("Too many steps - maybe an infinite loop?")
            stk = stack_of(frame)
            is_fn = frame.f_code.co_name != "<module>"
            step = {"line": frame.f_lineno, "event": event,
                    "ret": short(arg) if event == "return" and is_fn else None,
                    "vars": stk[-1]["vars"], "stack": stk, "out": out.getvalue()}
            steps.append(step)
            if event == "line":
                pend[id(frame)] = step
        return tracer

    try:
        code = compile(src, "<student>", "exec")          # the "compile" step
    except SyntaxError as e:
        return json.dumps({"ok": False, "steps": [], "error": {"type": "SyntaxError", "msg": e.msg, "line": e.lineno or 1}})

    g = {"__name__": "__main__", "input": fake_input}
    old, err = sys.stdout, None
    sys.stdout = out
    sys.settrace(tracer)
    try:
        exec(code, g)
    except StepLimit as e:
        err = {"type": "StepLimit", "msg": str(e), "line": steps[-1]["line"] if steps else 1}
    except BaseException as e:
        tb, line = e.__traceback__, 1
        while tb:
            if tb.tb_frame.f_code.co_filename == "<student>": line = tb.tb_lineno
            tb = tb.tb_next
        err = {"type": type(e).__name__, "msg": str(e), "line": line}
    finally:
        sys.settrace(None)
        sys.stdout = old
    return json.dumps({"ok": err is None, "steps": steps, "error": err, "out": out.getvalue()})
`;

  const TRACER_PRESETS = {
    loop: {
      name: "Loop & Accumulator",
      src: "x = 0\nfor i in range(3):\n    x += i\n    print(\"x =\", x)",
      stdin: ""
    },
    factorial: {
      name: "Recursion (Factorial)",
      src: "def factorial(n):\n    if n <= 1:\n        return 1\n    sub = factorial(n - 1)\n    return n * sub\n\nresult = factorial(4)\nprint(\"4! =\", result)",
      stdin: ""
    },
    input: {
      name: "Interactive input()",
      src: "name = input(\"Enter name: \")\nage = int(input(\"Enter age: \"))\nprint(f\"Hello {name}, in 5 years you will be {age + 5}!\")",
      stdin: "Alex\n20"
    },
    bubble: {
      name: "Bubble Sort Algorithm",
      src: "arr = [5, 2, 8, 1, 9]\nn = len(arr)\nfor i in range(n):\n    for j in range(0, n - i - 1):\n        if arr[j] > arr[j + 1]:\n            arr[j], arr[j + 1] = arr[j + 1], arr[j]\nprint(\"Sorted:\", arr)",
      stdin: ""
    },
    fib: {
      name: "Fibonacci Call Tree",
      src: "def fib(n):\n    if n <= 1:\n        return n\n    return fib(n - 1) + fib(n - 2)\n\nans = fib(4)\nprint(\"fib(4) =\", ans)",
      stdin: ""
    }
  };

  const CPP_PRESETS = {
    loop: {
      name: "Loop & Accumulator",
      src: `#include <iostream>
using namespace std;

int main() {
    int x = 0;
    for (int i = 0; i < 3; i++) {
        x += i;
        cout << "x = " << x << endl;
    }
    return 0;
}`,
      stdin: ""
    },
    factorial: {
      name: "Recursion (Factorial)",
      src: `#include <iostream>
using namespace std;

int fact(int n) {
    if (n <= 1) return 1;
    int sub = fact(n - 1);
    return n * sub;
}

int main() {
    int result = fact(4);
    cout << "4! = " << result << endl;
    return 0;
}`,
      stdin: ""
    },
    input: {
      name: "Interactive cin >>",
      src: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string name;
    int age;
    cin >> name >> age;
    cout << "Hello " << name << ", in 5 years: " << (age + 5) << endl;
    return 0;
}`,
      stdin: "Alex 20"
    },
    bubble: {
      name: "Bubble Sort Algorithm",
      src: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> arr = {5, 2, 8, 1, 9};
    int n = arr.size();
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
            }
        }
    }
    cout << "Sorted size: " << arr.size() << endl;
    return 0;
}`,
      stdin: ""
    },
    fib: {
      name: "Fibonacci Call Tree",
      src: `#include <iostream>
using namespace std;

int fib(int n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}

int main() {
    int ans = fib(4);
    cout << "fib(4) = " << ans << endl;
    return 0;
}`,
      stdin: ""
    }
  };

  const PYODIDE_MIRRORS = [
    "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/",
    "https://fastly.jsdelivr.net/pyodide/v0.26.4/full/",
    "https://gcore.jsdelivr.net/pyodide/v0.26.4/full/"
  ];

  let pyInstance = null;
  let pyLoading = false;
  let pyLoadPromise = null;
  let pyAutoRunPending = false;
  let activeIndexURL = PYODIDE_MIRRORS[0];
  let traceSteps = [];
  let traceErr = null;
  let tracePos = -1;
  let traceTimer = null;

  const escapeHtml = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const KW = /^(and|as|assert|break|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|raise|return|try|while|with|yield|True|False|None)$/;
  const BI = /^(print|input|range|len|int|str|float|list|dict|set|tuple|abs|min|max|sum|sorted|enumerate|zip|map|type|round|bool)$/;

  function pyHL(code) {
    return String(code).replace(/(#.*$)|("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\\n])*"?|'(?:\\.|[^'\\\n])*'?)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_]\w*)|([\s\S])/gm,
      (m, c, s, n, w, o) => c ? `<span class="c">${escapeHtml(c)}</span>` :
                            s ? `<span class="s">${escapeHtml(s)}</span>` :
                            n ? `<span class="n">${escapeHtml(n)}</span>` :
                            w ? (KW.test(w) ? `<span class="k">${w}</span>` : BI.test(w) ? `<span class="b">${w}</span>` : escapeHtml(w)) :
                            escapeHtml(o)
    );
  }

  function drawEd() {
    const hlEl = $("pyHl") || $("hl");
    const srcEl = $("src");
    if (!hlEl || !srcEl) return;
    const isCpp = $("langSel") && $("langSel").value === "cpp";
    let html = "";
    try {
      const HL = (isCpp && typeof cppHL === "function") ? cppHL : (typeof pyHL === "function" ? pyHL : escapeHtml);
      html = HL(srcEl.value);
    } catch (e) {
      console.warn("Syntax highlight error:", e);
      html = escapeHtml(srcEl.value);
    }
    hlEl.innerHTML = html + "\n";
    syncScroll();
  }

  function syncScroll() {
    const hlEl = $("pyHl") || $("hl");
    const srcEl = $("src");
    if (!hlEl || !srcEl) return;
    hlEl.scrollTop = srcEl.scrollTop;
    hlEl.scrollLeft = srcEl.scrollLeft;
  }

  function updatePyStatus(stage, text, isClickable = false) {
    const isCpp = $("langSel") && $("langSel").value === "cpp";
    if (isCpp && stage !== "ready" && !text.includes("C++")) {
      return; // Do not overwrite C++ ready status with background Python downloads
    }

    const statusBadge = $("pyStatusBadge");
    const runBtn = $("pyRunBtn");
    if (!statusBadge) return;

    statusBadge.className = `tracer-status-badge ${stage} ${isClickable ? 'clickable' : ''}`;
    statusBadge.innerHTML = `<span class="dot"></span> ${text}`;

    if (stage === "ready") {
      if (runBtn) {
        runBtn.disabled = false;
        runBtn.textContent = "▶ Run & Trace";
        runBtn.onclick = runTracerCode;
      }
    } else if (stage === "error") {
      if (runBtn) {
        runBtn.disabled = false;
        runBtn.textContent = "⚠️ Tap to Retry Loading Engine";
        runBtn.onclick = () => initPyodideTracer(true);
      }
      statusBadge.onclick = () => initPyodideTracer(true);
    } else if (stage === "loading") {
      if (runBtn) {
        runBtn.disabled = false;
        runBtn.textContent = "⏳ Loading Engine...";
        runBtn.onclick = () => {
          pyAutoRunPending = true;
          const infoEl = $("info");
          if (infoEl) {
            infoEl.className = "tracer-info-banner";
            infoEl.textContent = "⏳ Python 3.12 is downloading (~9MB). Execution will begin automatically when ready...";
          }
        };
      }
      statusBadge.onclick = () => initPyodideTracer(true);
    }
  }

  function loadScriptTag(url, timeoutMs = 8000) {
    return new Promise((resolve, reject) => {
      if (typeof loadPyodide !== "undefined") {
        return resolve();
      }
      const script = document.createElement("script");
      script.src = url;
      script.async = true;
      let timer = setTimeout(() => {
        script.onload = null;
        script.onerror = null;
        reject(new Error("Timeout loading script from " + url));
      }, timeoutMs);

      script.onload = () => {
        clearTimeout(timer);
        resolve();
      };
      script.onerror = () => {
        clearTimeout(timer);
        reject(new Error("Failed to load script from " + url));
      };
      document.head.appendChild(script);
    });
  }

  async function ensurePyodideScriptLoaded() {
    if (typeof loadPyodide !== "undefined") return;

    for (let i = 0; i < PYODIDE_MIRRORS.length; i++) {
      const mirror = PYODIDE_MIRRORS[i];
      const scriptUrl = mirror + "pyodide.js";
      try {
        updatePyStatus("loading", `Connecting to Python CDN (mirror ${i + 1}/${PYODIDE_MIRRORS.length})...`, true);
        await loadScriptTag(scriptUrl, 7000);
        if (typeof loadPyodide !== "undefined") {
          activeIndexURL = mirror;
          return;
        }
      } catch (e) {
        console.warn(`Pyodide mirror ${mirror} failed, trying next mirror:`, e);
      }
    }

    if (typeof loadPyodide === "undefined") {
      await new Promise((resolve, reject) => {
        let count = 0;
        const poll = setInterval(() => {
          count++;
          if (typeof loadPyodide !== "undefined") {
            clearInterval(poll);
            resolve();
          } else if (count > 25) {
            clearInterval(poll);
            reject(new Error("Pyodide script could not be loaded from any CDN mirror. Check connection."));
          }
        }, 200);
      });
    }
  }

  async function initPyodideTracer(forceRetry = false) {
    if (pyInstance) {
      if (!($("langSel") && $("langSel").value === "cpp")) {
        updatePyStatus("ready", "Python 3.12 Ready ✔");
      }
      return pyInstance;
    }
    if (pyLoading && !forceRetry) {
      return pyLoadPromise;
    }

    pyLoading = true;
    if (!($("langSel") && $("langSel").value === "cpp")) {
      updatePyStatus("loading", "Connecting to Python Engine...", true);
    }

    pyLoadPromise = (async () => {
      try {
        await ensurePyodideScriptLoaded();
        if (!($("langSel") && $("langSel").value === "cpp")) {
          updatePyStatus("loading", "Downloading Python 3.12 (~9MB)...", true);
        }
        pyInstance = await loadPyodide({
          indexURL: activeIndexURL
        });

        if (!($("langSel") && $("langSel").value === "cpp")) {
          updatePyStatus("loading", "Preparing execution tracer...", true);
        }
        await pyInstance.runPythonAsync(TRACER_PY);

        pyLoading = false;
        if (!($("langSel") && $("langSel").value === "cpp")) {
          updatePyStatus("ready", "Python 3.12 Ready ✔");
        }

        const infoEl = $("info");
        if (infoEl && (!traceSteps || !traceSteps.length)) {
          infoEl.textContent = "Python 3.12 ready. Click [Run & Trace] to compile and analyze code.";
        }

        if (pyAutoRunPending) {
          pyAutoRunPending = false;
          runTracerCode();
        }

        return pyInstance;
      } catch (err) {
        pyLoading = false;
        pyInstance = null;
        console.error("Pyodide initialization error:", err);
        if (!($("langSel") && $("langSel").value === "cpp")) {
          updatePyStatus("error", "Python Engine Load Failed. <u>Tap to Retry</u>", true);
          const infoEl = $("info");
          if (infoEl) {
            infoEl.className = "tracer-info-banner error";
            infoEl.textContent = "⚠ Failed to download Python WebAssembly runtime. Please tap Retry or check connection.";
          }
        }
        throw err;
      }
    })();

    return pyLoadPromise;
  }

  function buildTracerCodeView() {
    const srcEl = $("src");
    const codeView = $("pyCodeView") || $("codeView");
    if (!srcEl || !codeView) return;

    const isCpp = $("langSel") && $("langSel").value === "cpp";
    const HL = (isCpp && typeof cppHL === "function") ? cppHL : (typeof pyHL === "function" ? pyHL : escapeHtml);
    const lines = srcEl.value.split("\n");
    codeView.innerHTML = lines.map((line, i) => {
      const lineNum = i + 1;
      let highlighted = " ";
      try {
        highlighted = HL(line) || " ";
      } catch (e) {
        highlighted = escapeHtml(line) || " ";
      }
      return `<div class="cl" id="cl${lineNum}"><span class="no">${lineNum}</span><span class="cl-code">${highlighted}</span></div>`;
    }).join("");
  }

  function runTracerCode() {
    const isCpp = $("langSel") && $("langSel").value === "cpp";

    if (!isCpp) {
      if (!pyInstance) {
        if (pyLoading) {
          pyAutoRunPending = true;
          const infoEl = $("info");
          if (infoEl) {
            infoEl.className = "tracer-info-banner";
            infoEl.textContent = "⏳ Python 3.12 runtime is downloading (~9MB). Execution will begin automatically when ready...";
          }
          return;
        } else {
          pyAutoRunPending = true;
          initPyodideTracer(true);
          return;
        }
      }
    }

    traceStop();
    buildTracerCodeView();

    const srcEl = $("src");
    const stdinEl = $("stdin");
    const errEl = $("pyErr") || $("err");
    const scrubber = $("pyScrub");

    if (!srcEl) return;

    const code = srcEl.value, inp = (stdinEl ? stdinEl.value : "");

    try {
      if (!isCpp && pyInstance) {
        pyInstance.globals.set("SRC", code);
        pyInstance.globals.set("STDIN", inp);
      }

      let res;
      if (isCpp) {
        if (typeof traceCpp !== "function") {
          throw new Error("C++ execution engine is not loaded yet. Please ensure js/cpp-tracer.js is available.");
        }
        res = traceCpp(code, inp);
      } else {
        if (!pyInstance) throw new Error("Python runtime is not ready yet.");
        res = JSON.parse(pyInstance.runPython("run_traced(SRC, STDIN)"));
      }

      traceSteps = res.steps || [];
      traceErr = res.error;
      tracePos = -1;

      if (errEl) {
        if (traceErr) {
          errEl.textContent = `⚠ ${traceErr.type}: ${traceErr.msg} (line ${traceErr.line})`;
          errEl.classList.add("show");
        } else {
          errEl.textContent = "";
          errEl.classList.remove("show");
        }
      }

      if (traceErr && !traceSteps.length) {
        const badLine = document.getElementById("cl" + traceErr.line);
        if (badLine) badLine.classList.add("bad");
      }

      if (scrubber) {
        scrubber.min = "-1";
        scrubber.max = String(Math.max(-1, traceSteps.length - 1));
        scrubber.value = "-1";
      }

      renderTraceStep(-1);

      if (window.innerWidth <= 900) {
        const execCard = $("tracerExecCard") || $("pyCodeView");
        if (execCard) {
          execCard.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    } catch (e) {
      console.error("Tracer execution error:", e);
      if (errEl) {
        errEl.textContent = `⚠ Execution Error: ${e.message}`;
        errEl.classList.add("show");
        if (window.innerWidth <= 900) {
          errEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }
  }

  function renderTraceStep(i) {
    document.querySelectorAll(".cl.on").forEach(e => e.classList.remove("on"));

    const varsTable = $("pyVars");
    const stackEl = $("pyStack");
    const outEl = $("pyOut");
    const infoEl = $("info");
    const scrubber = $("pyScrub");
    if (scrubber) scrubber.value = String(i);

    const stepText = `${traceSteps.length === 0 ? 0 : Math.max(0, i + 1)} / ${traceSteps.length}`;
    document.querySelectorAll(".tracer-step-counter").forEach(el => {
      el.textContent = stepText;
    });

    const s = traceSteps[i];

    if (!s) {
      if (varsTable) varsTable.innerHTML = '<tr><td colspan="2" class="var-empty-text">Variables will appear here during execution.</td></tr>';
      if (stackEl) stackEl.innerHTML = '<span class="tp-empty">(Call Stack is empty — press Next or Play to begin)</span>';
      if (outEl) outEl.textContent = "";
      if (infoEl) {
        infoEl.className = "tracer-info-banner";
        const isCpp = $("langSel") && $("langSel").value === "cpp";
        infoEl.textContent = traceSteps.length
          ? "Press Next ▶ or Play to step through code execution."
          : `Click [Run & Trace] to compile and analyze ${isCpp ? "C++" : "Python"} code.`;
      }
      return;
    }

    // Highlight line in code view
    const lineEl = document.getElementById("cl" + s.line);
    if (lineEl) {
      lineEl.classList.add("on");
      try {
        lineEl.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
      } catch (e) {
        lineEl.scrollIntoView(false);
      }
    }

    // Previous variables to detect changes for animation
    const prevVars = (i > 0 && traceSteps[i - 1].stack.length === s.stack.length) ? traceSteps[i - 1].vars : {};

    // Variables Watch Table
    if (varsTable) {
      const entries = Object.entries(s.vars || {});
      if (!entries.length) {
        varsTable.innerHTML = '<tr><td colspan="2" class="var-empty-text">No local variables in current scope.</td></tr>';
      } else {
        varsTable.innerHTML = '<tr><th>Variable</th><th>Value</th></tr>' +
          entries.map(([k, v]) => {
            const changed = prevVars[k] !== v;
            return `<tr class="${changed ? 'chg' : ''}"><td><b>${escapeHtml(k)}</b></td><td><code>${escapeHtml(v)}</code></td></tr>`;
          }).join("");
      }
    }

    // Call Stack Frames
    if (stackEl) {
      const stack = s.stack || [];
      if (!stack.length) {
        stackEl.innerHTML = '<span class="tp-empty">(Stack is empty)</span>';
      } else {
        stackEl.innerHTML = stack.map((frame, idx) => {
          const isTop = idx === stack.length - 1;
          const varStr = Object.entries(frame.vars || {}).map(([k, v]) => `${k}=${v}`).join(", ");
          return `<div class="stack-frame-item ${isTop ? 'top-frame' : ''}">
            <span class="frame-name">${escapeHtml(frame.fn)}() <small style="color:var(--mute)">:line ${frame.line}</small></span>
            <span class="frame-vars">${escapeHtml(varStr || "no locals")}</span>
          </div>`;
        }).join("");
      }
    }

    // Standard Output Terminal
    if (outEl) {
      outEl.textContent = s.out || "";
      outEl.scrollTop = outEl.scrollHeight;
    }

    // Status & Return Value Banner (exactly as specified by user):
    if (infoEl) {
      const last = i === traceSteps.length - 1;
      const ERR = traceErr;
      $("info").textContent = s.ret !== null ? `return ${s.ret}` : s.msg ? s.msg : last && !ERR ? "Program finished ✔" : `Line ${s.line} executed`;
      if (s.ret !== null) {
        infoEl.className = "tracer-info-banner";
      } else if (last && !ERR) {
        infoEl.className = "tracer-info-banner finished";
      } else if (last && ERR) {
        infoEl.className = "tracer-info-banner error";
      } else {
        infoEl.className = "tracer-info-banner";
      }
    }

    // Highlight runtime error line on final step
    if (i === traceSteps.length - 1 && traceErr) {
      const badLine = document.getElementById("cl" + traceErr.line);
      if (badLine) badLine.classList.add("bad");
    }

    // Subtle sound effect
    if (typeof tone === "function" && typeof SND !== "undefined" && SND) {
      tone(420 + (i % 8) * 35, 0.05);
    }
  }

  function traceGo(i) {
    tracePos = Math.max(-1, Math.min(traceSteps.length - 1, i));
    renderTraceStep(tracePos);
  }

  function traceStop() {
    clearInterval(traceTimer);
    traceTimer = null;
    const playBtn = $("pyPlayBtn");
    if (playBtn) playBtn.textContent = "▶ Play";
  }

  function tracePlay() {
    if (traceTimer) {
      traceStop();
      return;
    }
    if (tracePos >= traceSteps.length - 1) tracePos = -1;
    const playBtn = $("pyPlayBtn");
    if (playBtn) playBtn.textContent = "⏸ Pause";

    const speedVal = $("pySpd") ? +$("pySpd").value : 4;
    const delay = Math.round(1500 / Math.pow(1.3, speedVal - 1)) + 100;

    traceTimer = setInterval(() => {
      if (tracePos >= traceSteps.length - 1) {
        traceStop();
        return;
      }
      traceGo(tracePos + 1);
    }, delay);
  }

  function onLanguageChange(lang) {
    const langSel = $("langSel");
    if (langSel && lang) langSel.value = lang;
    const isCpp = (langSel && langSel.value === "cpp") || lang === "cpp";
    const srcEl = $("src");
    const stdinEl = $("stdin");
    const presetSel = $("pyPresetSelect");
    const titleEl = $("tracerMainTitle");
    const titleLogo = $("tracerTitleLogo");
    const titleText = $("tracerTitleText");
    const selLogo = $("tracerSelLogo");
    const descEl = $("tracerDescText");
    const termLabel = $("tracerTerminalLabel");
    const runBtn = $("pyRunBtn");

    traceStop();
    traceSteps = [];
    traceErr = null;
    tracePos = -1;

    if (isCpp) {
      if (srcEl) {
        srcEl.value = `#include <iostream>
using namespace std;

int main() {
    int x = 0;
    for (int i = 0; i < 3; i++) {
        x += i;
        cout << "x = " << x << endl;
    }
    return 0;
}`;
      }
      if (stdinEl) {
        stdinEl.value = "";
        stdinEl.placeholder = "cin >> values (space or newline separated)";
      }
      if (presetSel) {
        presetSel.innerHTML = `
          <option value="loop">1. Loop & cout <<</option>
          <option value="factorial">2. Recursion (Factorial)</option>
          <option value="input">3. User cin >></option>
          <option value="bubble">4. Bubble Sort (Vector)</option>
          <option value="fib">5. Fibonacci Tree</option>
        `;
        presetSel.value = "loop";
      }
      if (titleLogo) {
        titleLogo.src = "assets/cpp-logo.svg";
        titleLogo.alt = "C++";
      }
      if (titleText) titleText.textContent = "C++ Code Tracer & Execution Engine";
      if (selLogo) {
        selLogo.src = "assets/cpp-logo.svg";
        selLogo.alt = "C++";
      }
      if (descEl) descEl.textContent = `Inspect local variables and output step-by-step in C++ (Interactive Browser Interpreter).`;
      if (termLabel) termLabel.textContent = `c++ - stdout`;

      updatePyStatus("ready", "C++ Engine Ready (Instant)");
      if (runBtn) {
        runBtn.disabled = false;
        runBtn.textContent = "▶ Run & Trace";
      }
    } else {
      if (srcEl) {
        srcEl.value = `x = 0
for i in range(3):
    x += i
    print("x =", x)`;
      }
      if (stdinEl) {
        stdinEl.value = "";
        stdinEl.placeholder = "input() values, one per line";
      }
      if (presetSel) {
        presetSel.innerHTML = `
          <option value="loop">1. Loop & Accumulator</option>
          <option value="factorial">2. Recursion (Factorial)</option>
          <option value="input">3. User input()</option>
          <option value="bubble">4. Bubble Sort Simulation</option>
          <option value="fib">5. Fibonacci Tree</option>
        `;
        presetSel.value = "loop";
      }
      if (titleLogo) {
        titleLogo.src = "assets/python-logo.svg";
        titleLogo.alt = "Python";
      }
      if (titleText) titleText.textContent = "Python Code Tracer & Execution Engine";
      if (selLogo) {
        selLogo.src = "assets/python-logo.svg";
        selLogo.alt = "Python";
      }
      if (descEl) descEl.textContent = `Inspect local variables and output step-by-step in Python 3.12 (Pyodide).`;
      if (termLabel) termLabel.textContent = `python3 - stdout`;

      if (pyInstance) {
        updatePyStatus("ready", "Python 3.12 Ready ✔");
      } else if (pyLoading) {
        updatePyStatus("loading", "Connecting to Python Engine...", true);
      } else {
        updatePyStatus("loading", "Initializing Python Engine...", true);
      }
    }

    drawEd();
    buildTracerCodeView();
    renderTraceStep(-1);
  }

  function initTracerUI() {
    const runBtn = $("pyRunBtn");
    const playBtn = $("pyPlayBtn");
    const nextBtn = $("pyNextBtn");
    const prevBtn = $("pyPrevBtn");
    const resetBtn = $("pyResetBtn");
    const scrubber = $("pyScrub");
    const presetSel = $("pyPresetSelect");
    const srcEl = $("src");
    const langSel = $("langSel");

    if (runBtn) runBtn.onclick = runTracerCode;
    if (playBtn) playBtn.onclick = tracePlay;
    if (nextBtn) nextBtn.onclick = () => { traceStop(); traceGo(tracePos + 1); };
    if (prevBtn) prevBtn.onclick = () => { traceStop(); traceGo(tracePos - 1); };
    if (resetBtn) resetBtn.onclick = () => { traceStop(); traceGo(-1); };

    if (langSel) {
      const handleLangChange = e => {
        onLanguageChange(e.target.value);
      };
      langSel.onchange = handleLangChange;
      langSel.addEventListener("input", handleLangChange);
    }

    if (scrubber) {
      scrubber.oninput = e => {
        traceStop();
        traceGo(+e.target.value);
      };
    }

    if (presetSel) {
      const handlePresetChange = e => {
        const curLangSel = $("langSel");
        const isCpp = curLangSel && curLangSel.value === "cpp";
        const presets = isCpp ? CPP_PRESETS : TRACER_PRESETS;
        const presetKey = e && e.target ? e.target.value : presetSel.value;
        const preset = presets[presetKey];
        const curSrcEl = $("src");
        if (preset && curSrcEl) {
          curSrcEl.value = preset.src;
          const curStdinEl = $("stdin");
          if (curStdinEl) curStdinEl.value = preset.stdin || "";
          drawEd();
          buildTracerCodeView();
          traceSteps = [];
          tracePos = -1;
          renderTraceStep(-1);
        }
      };
      presetSel.onchange = handlePresetChange;
      presetSel.addEventListener("input", handlePresetChange);
    }

    // Hook up live syntax-highlighted editor input, scroll & tab indentation
    if (srcEl) {
      const handleInput = () => {
        drawEd();
        buildTracerCodeView();
      };
      srcEl.addEventListener("input", handleInput);
      srcEl.addEventListener("scroll", syncScroll, { passive: true });
      srcEl.addEventListener("touchmove", syncScroll, { passive: true });
      srcEl.addEventListener("keyup", syncScroll, { passive: true });
      srcEl.addEventListener("click", syncScroll, { passive: true });
      srcEl.addEventListener("keydown", function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
          e.preventDefault();
          runTracerCode();
          return;
        }
        if (e.key === "Tab") {
          e.preventDefault();
          const start = this.selectionStart;
          const end = this.selectionEnd;
          if (typeof this.setRangeText === "function") {
            this.setRangeText("    ", start, end, "end");
          } else {
            this.value = this.value.substring(0, start) + "    " + this.value.substring(end);
            this.selectionStart = this.selectionEnd = start + 4;
          }
          drawEd();
          buildTracerCodeView();
        }
      });
    }

    drawEd();
    buildTracerCodeView();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTracerUI);
  } else {
    initTracerUI();
  }

  if (typeof window !== "undefined") {
    window.initPyodideTracer = initPyodideTracer;
    window.runTracerCode = runTracerCode;
    window.runCode = runTracerCode;
    window.buildCode = buildTracerCodeView;
    window.drawEd = drawEd;
    window.render = renderTraceStep;
    window.initTracerUI = initTracerUI;
    window.onLanguageChange = onLanguageChange;

    window.addEventListener("load", () => {
      setTimeout(() => {
        initPyodideTracer();
      }, 1200);
    });
  }
})();
