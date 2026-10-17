# ThinkCode — Interactive DSA Visualizer & Dual-Engine Code Tracer

> **Watch Algorithms Think & Execute.**  
> An interactive web-based Data Structures & Algorithms visualizer featuring real-time, in-browser step tracing for both **Python** and **C++**. Built specifically for Computer Science & IT students to dissect memory mutations, recursion stacks, and code execution.

![ThinkCode Banner](assets/hero-banner.png)

---

## 🌟 Highlights

- **⚡ In-Browser Code Tracers (No Server Required)**
  - **C++ Step Tracer:** Built-in lightweight C++ interpreter written in JavaScript. Zero download, 0ms startup latency. Traces loops, recursion, vectors, arrays, reference parameters, `cout`, `cin`, and standard library math functions.
  - **Python Step Tracer:** Powered by Pyodide (Python 3.12 WebAssembly). Traces arbitrary Python code, functions, recursion, and standard input/output.
- **🔍 Live Execution Inspection:**
  - **Interactive Code View:** Highlights active execution line and erroneous syntax in real time.
  - **Variables Watch Table:** Displays scope variables with real-time mutation highlighting.
  - **Call Stack Frames:** Full active frame inspection for recursion and nested function invocations.
  - **Console Output Terminal:** Streams `stdout` (`print`, `cout`, `printf`) step-by-step.
- **📊 Interactive Algorithm Visualizers:**
  - **Sorting:** Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort.
  - **Graphs:** Breadth-First Search (BFS), Depth-First Search (DFS), Dijkstra's Shortest Path.
  - **Trees:** Binary Search Tree (BST), AVL Tree (Self-balancing), Tree Level-Order Traversal.
  - **Data Structures:** Dynamic Array, Stack, Queue, Singly Linked List.
  - **Recursion Trees:** Factorial, Fibonacci Call Trees.
- **🔊 Audio Synthesis Engine:** Web Audio API sound synthesis synchronized with comparisons and swaps.
- **🎨 Modern Cyber Aesthetics:** Responsive interface with support for **Dark**, **Midnight**, **Light**, and **Paper** themes.

---

## 🚀 Quick Start

Because this project is built entirely with client-side **HTML5, Vanilla CSS, and JavaScript**, no build tools or package managers are required!

### Option 1: Run Locally
1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/ThinkCode.git
   cd ThinkCode
   ```
2. Open `index.html` directly in any modern browser, or serve it with Python:
   ```bash
   python3 -m http.server 8000
   ```
3. Visit `http://localhost:8000` in your browser.

### Option 2: Deploy to GitHub Pages (1 Click)
1. Go to your repository settings on GitHub: **Settings** → **Pages**.
2. Under **Build and deployment** → **Branch**, select `main` (or `master`) and folder `/ (root)`.
3. Click **Save**. Your visualizer will be live at `https://<your-username>.github.io/ThinkCode/`!

---

## 📂 Project Architecture

```
├── index.html            # Main single-page application entry point
├── cpp-tracer.js         # Client-side C++ lexer, parser, interpreter & syntax highlighter
├── css/
│   ├── base.css          # Design system tokens, variables & typography
│   ├── home.css          # Homepage hero, cyber holo-card & quick actions
│   ├── visualizer.css    # Algorithm visualizer boards & canvas layouts
│   ├── tracer.css        # Code tracer editor, variables table & terminal styles
│   └── pages.css         # Theory, about & documentation modal styles
├── js/
│   ├── app.js            # SPA view switcher & global event orchestrator
│   ├── audio.js          # Web Audio API tone synthesis engine
│   ├── tracer.js         # Unified Python & C++ trace controller and step runner
│   ├── data/             # Algorithm metadata, complexities & language translations
│   ├── engines/          # Step-generation engines for sorting, trees, graphs, and DS
│   ├── renderers/        # SVG & DOM visual animation renderers
│   └── ui/               # Home and theory UI view controllers
└── assets/               # Visual assets and previews
```

---

## 🛠️ Supported C++ Subset (In Tracer)
- **Data Types:** `int`, `long`, `double`, `float`, `char`, `bool`, `string`, `auto`, 1D arrays, `vector`.
- **Control Flow:** `if`/`else`, `for`, range-based `for`, `while`, `do-while`, `break`, `continue`, ternary `?:`.
- **Functions:** Recursion (with stack frame visualization), pass-by-reference (`&`), global variables.
- **I/O:** `cout <<`, `cin >>`, `printf` (with `%d`, `%f`, `%.2f`, `%s`, `%c`).
- **Standard Library:** `push_back`, `pop_back`, `size`, `swap`, `sqrt`, `pow`, `abs`, `min`, `max`, `floor`, `ceil`.

---

## 👤 Author
- **Lead Developer:** Tahir Mansuri

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
