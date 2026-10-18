// =============================================================================
// ThinkCode Academic Practicals Hub — UI Controller & Event Orchestrator
// =============================================================================

(() => {
  const STORAGE_KEY = "thinkcode_saved_practicals";

  // State
  let selectedCourse = "all";
  let selectedCategory = "all";
  let searchQuery = "";
  let onlySaved = false;
  let activePracticalId = "linear-search";
  let activeLang = "c";
  let mobileViewMode = "list"; // "list" or "detail" on small screens

  // Load bookmarks from localStorage
  function getBookmarks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function toggleBookmark(id) {
    let bm = getBookmarks();
    if (bm.includes(id)) {
      bm = bm.filter(x => x !== id);
    } else {
      bm.push(id);
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bm));
    } catch (e) {}
    renderPracticalsList();
    renderPracticalDetail();
    updateBookmarkFilterCount();
  }

  function isBookmarked(id) {
    return getBookmarks().includes(id);
  }

  function updateBookmarkFilterCount() {
    const count = getBookmarks().length;
    const btn = document.getElementById("practicalsSavedFilter");
    if (btn) {
      btn.innerHTML = `⭐ Saved (${count})`;
    }
  }

  // Filter dataset
  function getFilteredPracticals() {
    if (typeof PRACTICALS_DATA === "undefined") return [];
    const bms = getBookmarks();
    const q = searchQuery.trim().toLowerCase();

    return PRACTICALS_DATA.filter(item => {
      // Course match
      if (selectedCourse !== "all" && !item.courses.includes(selectedCourse)) {
        return false;
      }
      // Category match
      if (selectedCategory !== "all" && item.category !== selectedCategory) {
        return false;
      }
      // Saved filter
      if (onlySaved && !bms.includes(item.id)) {
        return false;
      }
      // Search query
      if (q) {
        const inTitle = item.title.toLowerCase().includes(q);
        const inCat = item.category.toLowerCase().includes(q);
        const inAim = item.aim.toLowerCase().includes(q);
        if (!inTitle && !inCat && !inAim) return false;
      }
      return true;
    });
  }

  // Render List Sidebar
  function renderPracticalsList() {
    const listEl = document.getElementById("practicalsListScroll");
    const countEl = document.getElementById("practicalsCountBadge");
    if (!listEl) return;

    const filtered = getFilteredPracticals();
    if (countEl) countEl.textContent = `${filtered.length} / ${PRACTICALS_DATA.length}`;

    if (filtered.length === 0) {
      listEl.innerHTML = `
        <div class="practical-empty-list">
          <p style="font-size:24px;margin:0 0 6px">🔍</p>
          <strong>No Practicals Found</strong>
          <p style="margin:4px 0 0;font-size:12.5px;color:var(--mute)">Try adjusting your search or course filters.</p>
        </div>
      `;
      return;
    }

    // Ensure activePracticalId is still in the filtered set, else pick first
    const hasCurrent = filtered.some(p => p.id === activePracticalId);
    if (!hasCurrent && filtered.length > 0) {
      activePracticalId = filtered[0].id;
      renderPracticalDetail();
    }

    listEl.innerHTML = filtered.map(item => {
      const isSel = item.id === activePracticalId;
      const bm = isBookmarked(item.id);
      return `
        <div class="practical-list-item ${isSel ? 'selected' : ''}" data-id="${item.id}">
          <div class="practical-item-top">
            <span class="practical-item-cat">${item.category}</span>
            <button class="practical-star-btn ${bm ? 'bookmarked' : ''}" data-action="toggle-star" data-id="${item.id}" title="${bm ? 'Remove bookmark' : 'Bookmark practical'}">
              ${bm ? '★' : '☆'}
            </button>
          </div>
          <div class="practical-item-title">${item.title}</div>
          <div class="practical-item-badges">
            ${item.courses.map(c => `<span class="course-chip-mini">${c}</span>`).join("")}
          </div>
        </div>
      `;
    }).join("");

    // Attach click listeners to item cards
    listEl.querySelectorAll(".practical-list-item").forEach(el => {
      el.addEventListener("click", e => {
        if (e.target.closest("[data-action='toggle-star']")) {
          e.stopPropagation();
          const starId = e.target.closest("[data-action='toggle-star']").dataset.id;
          toggleBookmark(starId);
          return;
        }
        const id = el.dataset.id;
        activePracticalId = id;
        renderPracticalsList();
        renderPracticalDetail();

        // On mobile, auto-switch to detail tab
        if (window.innerWidth <= 960) {
          setMobileViewMode("detail");
        }
      });
    });
  }

  // Render Details Pane
  function renderPracticalDetail() {
    const detailPane = document.getElementById("practicalsDetailPane");
    if (!detailPane || typeof PRACTICALS_DATA === "undefined") return;

    const item = PRACTICALS_DATA.find(p => p.id === activePracticalId) || PRACTICALS_DATA[0];
    if (!item) return;

    const bm = isBookmarked(item.id);

    // Title & Aim
    const titleEl = document.getElementById("practicalDetailTitle");
    if (titleEl) titleEl.textContent = item.title;

    const aimEl = document.getElementById("practicalDetailAim");
    if (aimEl) aimEl.textContent = item.aim;

    // Complexity Chips
    const compEl = document.getElementById("practicalComplexityChips");
    if (compEl) {
      compEl.innerHTML = `
        <span class="complexity-pill">Best Time: <strong>${item.complexity.timeBest}</strong></span>
        <span class="complexity-pill">Worst Time: <strong>${item.complexity.timeWorst}</strong></span>
        <span class="complexity-pill">Aux Space: <strong>${item.complexity.space}</strong></span>
        ${item.courses.map(c => `<span class="chip" style="font-size:11.5px">🎓 ${c}</span>`).join("")}
      `;
    }

    // Bookmark button
    const bmBtn = document.getElementById("practicalBookmarkLg");
    if (bmBtn) {
      bmBtn.className = `btn-bookmark-lg ${bm ? 'bookmarked' : ''}`;
      bmBtn.innerHTML = bm ? `★ Saved in My Practicals` : `☆ Save Practical`;
    }

    // Code & Action buttons
    renderCodeBlock(item);

    // Sample I/O
    const ioEl = document.getElementById("practicalTerminalContent");
    if (ioEl) {
      ioEl.textContent = `--- Sample Input ---\n${item.sampleIO.input}\n\n--- Expected Console Output ---\n${item.sampleIO.output}`;
    }

    // Viva Questions
    const vivaGrid = document.getElementById("practicalVivaGrid");
    if (vivaGrid) {
      vivaGrid.innerHTML = item.viva.map((v, i) => `
        <div class="viva-card">
          <div class="viva-question">
            <span class="viva-q-badge">Q${i + 1}</span>
            <span>${v.q}</span>
          </div>
          <div class="viva-answer">${v.a}</div>
        </div>
      `).join("");
    }

    // Visualizer button visibility
    const vizBtn = document.getElementById("practicalVizBtn");
    if (vizBtn) {
      if (item.tracerSupport && item.tracerSupport.visualizerAlgo) {
        vizBtn.style.display = "inline-flex";
      } else {
        vizBtn.style.display = "none";
      }
    }
  }

  // --- Syntax Highlighting & Code Presentation Engine ---
  const ESC_MAP = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
  function escHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ESC_MAP[c]);
  }

  const KW_PATTERNS = {
    c: {
      kw: /^(return|if|else|for|while|do|break|continue|switch|case|default|sizeof|typedef|const|static|volatile|goto)$/,
      type: /^(int|float|double|char|long|short|unsigned|signed|void|struct|enum|union|bool|FILE|size_t)$/,
      bi: /^(NULL|true|false|EOF|stdin|stdout|stderr)$/
    },
    cpp: {
      kw: /^(return|if|else|for|while|do|break|continue|switch|case|default|sizeof|typedef|const|static|class|public|private|protected|template|typename|namespace|using|new|delete|try|catch|throw|auto|friend|virtual|inline|override|explicit)$/,
      type: /^(int|float|double|char|long|short|unsigned|signed|void|struct|enum|union|bool|string|vector|queue|stack|deque|list|map|set|pair|size_t|Node|Graph|Tree|LinearQueue|CircularQueue|SinglyLinkedList|DoublyLinkedList)$/,
      bi: /^(NULL|nullptr|true|false|cout|cin|endl|std|swap|printf|scanf|abs|min|max|pow|sqrt|push_back|pop_back|size|empty|front|back|top|push|pop)$/
    },
    java: {
      kw: /^(public|private|protected|class|static|final|abstract|void|return|if|else|for|while|do|break|continue|new|import|package|this|super|switch|case|default|try|catch|finally|throw|throws|extends|implements|interface)$/,
      type: /^(int|float|double|char|long|short|boolean|byte|String|Node|Stack|Queue|List|ArrayList|LinkedList|Scanner|Math|Object|Integer|Character|Boolean|LinearQueue|CircularQueue|SinglyLinkedList|DoublyLinkedList|BinarySearchTree|GraphBFSDFS)$/,
      bi: /^(null|true|false|System|out|println|print|Scanner|length|push|pop|peek|isEmpty|isFull|enqueue|dequeue|add|remove|get|set|size)$/
    },
    python: {
      kw: /^(def|class|return|if|elif|else|for|while|in|break|continue|and|or|not|is|import|from|as|try|except|finally|raise|pass|lambda|global|nonlocal|with|yield)$/,
      type: /^(int|str|float|bool|list|dict|set|tuple|Node|Stack|Queue|Graph|LinearQueue|CircularQueue|SinglyLinkedList|DoublyLinkedList|BinarySearchTree)$/,
      bi: /^(True|False|None|self|print|len|range|enumerate|zip|abs|min|max|sum|append|pop|insert|reverse|reversed|sorted|open|input)$/
    }
  };

  function highlightLineTokens(text, lang) {
    const pat = KW_PATTERNS[lang] || KW_PATTERNS.c;
    const regex = /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_]\w*)|(->|::|==|!=|<=|>=|&&|\|\||<<|>>|[+\-*/%=&|!<>]=?)|([\s\S])/g;

    return text.replace(regex, (match, str, num, word, op, other, offset) => {
      if (str) return `<span class="c-str">${escHtml(str)}</span>`;
      if (num) return `<span class="c-num">${num}</span>`;
      if (word) {
        if (pat.kw.test(word)) return `<span class="c-kw">${word}</span>`;
        if (pat.type.test(word)) return `<span class="c-type">${word}</span>`;
        if (pat.bi.test(word)) return `<span class="c-bi">${word}</span>`;
        const rest = text.slice(offset + word.length);
        if (/^\s*\(/.test(rest)) return `<span class="c-fn">${word}</span>`;
        return word;
      }
      if (op) return `<span class="c-op">${escHtml(op)}</span>`;
      return escHtml(other);
    });
  }

  function highlightLine(line, lang, state) {
    if (!line || !line.trim()) return " ";

    // Handle multiline comment continuation /* ... */
    if (state.inBlockComment) {
      const endIdx = line.indexOf("*/");
      if (endIdx !== -1) {
        state.inBlockComment = false;
        const commentPart = line.slice(0, endIdx + 2);
        const rest = line.slice(endIdx + 2);
        return `<span class="c-cm">${escHtml(commentPart)}</span>` + highlightLine(rest, lang, state);
      }
      return `<span class="c-cm">${escHtml(line)}</span>`;
    }

    // Preprocessor directives (C / C++)
    if ((lang === "c" || lang === "cpp") && /^\s*#/.test(line)) {
      return `<span class="c-pp">${escHtml(line)}</span>`;
    }

    // Python comments
    if (lang === "python") {
      const hashIdx = line.indexOf("#");
      if (hashIdx !== -1) {
        const pre = line.slice(0, hashIdx);
        const post = line.slice(hashIdx);
        const quotes = (pre.match(/['"]/g) || []).length;
        if (quotes % 2 === 0) {
          return highlightLineTokens(pre, lang) + `<span class="c-cm">${escHtml(post)}</span>`;
        }
      }
    } else {
      // C, C++, Java // comments
      const slashIdx = line.indexOf("//");
      if (slashIdx !== -1) {
        const pre = line.slice(0, slashIdx);
        const post = line.slice(slashIdx);
        const quotes = (pre.match(/"/g) || []).length;
        if (quotes % 2 === 0) {
          return highlightLineTokens(pre, lang) + `<span class="c-cm">${escHtml(post)}</span>`;
        }
      }

      // Check /* comment */
      const blockStart = line.indexOf("/*");
      if (blockStart !== -1) {
        const pre = line.slice(0, blockStart);
        const rest = line.slice(blockStart);
        const blockEnd = rest.indexOf("*/");
        if (blockEnd !== -1) {
          const comment = rest.slice(0, blockEnd + 2);
          const post = rest.slice(blockEnd + 2);
          return highlightLineTokens(pre, lang) + `<span class="c-cm">${escHtml(comment)}</span>` + highlightLine(post, lang, state);
        }
        state.inBlockComment = true;
        return highlightLineTokens(pre, lang) + `<span class="c-cm">${escHtml(rest)}</span>`;
      }
    }

    return highlightLineTokens(line, lang);
  }

  function formatHighlightedCode(code, lang) {
    const lines = String(code).split("\n");
    const state = { inBlockComment: false };

    return lines.map((line, idx) => {
      const lineNum = idx + 1;
      const highlighted = highlightLine(line, lang, state);
      return `<div class="p-code-line"><span class="p-line-num">${lineNum}</span><span class="p-line-content">${highlighted}</span></div>`;
    }).join("");
  }

  function renderCodeBlock(item) {
    const codeEl = document.getElementById("practicalCodeViewer");
    const langBadge = document.getElementById("practicalCodeLangBadge");
    if (!codeEl) return;

    const code = (item.code && item.code[activeLang]) || "// Code not available for this language.";
    codeEl.innerHTML = formatHighlightedCode(code, activeLang);

    const langNames = { c: "C (C11 / GCC)", cpp: "C++ (C++17)", java: "Java (JDK 8+)", python: "Python 3" };
    if (langBadge) langBadge.textContent = langNames[activeLang] || activeLang.toUpperCase();

    // Update active tab button
    document.querySelectorAll(".lang-tab-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.lang === activeLang);
    });
  }

  // Mobile View Switcher (List vs Detail)
  function setMobileViewMode(mode) {
    mobileViewMode = mode;
    const layout = document.getElementById("practicalsLayout");
    if (!layout) return;

    if (mode === "detail") {
      layout.classList.add("show-detail");
      layout.classList.remove("show-list");
    } else {
      layout.classList.add("show-list");
      layout.classList.remove("show-detail");
    }

    document.querySelectorAll(".mobile-view-tab-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.viewMode === mode);
    });

    if (mode === "detail") {
      window.scrollTo({ top: 120, behavior: "smooth" });
    }
  }

  // --- Actions ---

  // 1. Copy Code
  function copyPracticalCode() {
    const item = PRACTICALS_DATA.find(p => p.id === activePracticalId);
    if (!item || !item.code || !item.code[activeLang]) return;

    const code = item.code[activeLang];
    const btn = document.getElementById("practicalCopyBtn");

    navigator.clipboard.writeText(code).then(() => {
      if (btn) {
        const originalText = btn.innerHTML;
        btn.innerHTML = `✓ Copied!`;
        btn.style.borderColor = "var(--ok)";
        btn.style.color = "var(--ok)";
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.borderColor = "";
          btn.style.color = "";
        }, 2000);
      }
    }).catch(() => {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      if (btn) {
        btn.textContent = "✓ Copied!";
        setTimeout(() => { btn.innerHTML = `📋 Copy Code`; }, 2000);
      }
    });
  }

  // 2. Download File
  function downloadPracticalFile() {
    const item = PRACTICALS_DATA.find(p => p.id === activePracticalId);
    if (!item || !item.code || !item.code[activeLang]) return;

    const code = item.code[activeLang];
    const extMap = { c: "c", cpp: "cpp", java: "java", python: "py" };
    const ext = extMap[activeLang] || "txt";

    // Java files require class name filename
    let filename = `${item.id}.${ext}`;
    if (activeLang === "java") {
      const match = code.match(/public\s+class\s+([A-Za-z0-9_]+)/);
      if (match && match[1]) {
        filename = `${match[1]}.java`;
      }
    }

    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // 3. Share Code (Web Share API with WhatsApp / Email fallback)
  function sharePracticalCode() {
    const item = PRACTICALS_DATA.find(p => p.id === activePracticalId);
    if (!item || !item.code || !item.code[activeLang]) return;

    const langName = activeLang.toUpperCase();
    const shareText = `*${item.title} (${langName})* - ThinkCode Academic Lab Manual\n\nAim: ${item.aim}\n\nCheck out the full code in ThinkCode!`;
    const shareUrl = window.location.origin + window.location.pathname + "#practicals";

    if (navigator.share) {
      navigator.share({
        title: `${item.title} (${langName}) — ThinkCode`,
        text: shareText,
        url: shareUrl
      }).catch(err => {
        if (err.name !== "AbortError") {
          fallbackShare(shareText, shareUrl);
        }
      });
    } else {
      fallbackShare(shareText, shareUrl);
    }
  }

  function fallbackShare(text, url) {
    const msg = encodeURIComponent(`${text}\n\n${url}`);
    const waUrl = `https://api.whatsapp.com/send?text=${msg}`;
    window.open(waUrl, "_blank");
  }

  // 4. Run / Trace in ThinkCode
  function runInTracer() {
    const item = PRACTICALS_DATA.find(p => p.id === activePracticalId);
    if (!item) return;

    // Pick tracer language
    let tracerLang = "cpp";
    if (activeLang === "python") {
      tracerLang = "python";
    } else {
      tracerLang = "cpp"; // C or C++ runs in cpp tracer
    }

    const code = item.code[tracerLang] || item.code[activeLang] || "";

    // Switch view to tracer
    if (typeof showView === "function") {
      showView("tracer", tracerLang);
    }

    // Set code in source textarea
    setTimeout(() => {
      const srcEl = document.getElementById("pySrc");
      if (srcEl) {
        srcEl.value = code;
        srcEl.dispatchEvent(new Event("input"));
      }

      // Sync tracer dropdown if available
      const langSel = document.getElementById("langSel");
      if (langSel && langSel.value !== tracerLang) {
        langSel.value = tracerLang;
        if (typeof onLanguageChange === "function") {
          onLanguageChange(tracerLang);
        }
      }
    }, 150);
  }

  // 5. Jump to Algorithm Visualizer
  function openInVisualizer() {
    const item = PRACTICALS_DATA.find(p => p.id === activePracticalId);
    if (!item || !item.tracerSupport || !item.tracerSupport.visualizerAlgo) return;

    const algoKey = item.tracerSupport.visualizerAlgo;
    const catKey = item.tracerSupport.visualizerCat;

    if (typeof showView === "function") {
      showView("app");
    }

    setTimeout(() => {
      // Switch category if needed
      const catSel = document.getElementById("cat");
      if (catSel && catKey && catSel.value !== catKey) {
        catSel.value = catKey;
        if (typeof setCat === "function") setCat(catKey);
        else if (typeof onCategoryChange === "function") onCategoryChange(catKey);
      }

      // Switch algorithm
      setTimeout(() => {
        if (typeof selectAlgo === "function") {
          selectAlgo(algoKey);
        } else if (typeof setAlgo === "function") {
          setAlgo(algoKey);
        }
      }, 100);
    }, 150);
  }

  // --- Initialize Event Listeners ---
  function initPracticalsUI() {
    // Course Tab Buttons
    document.querySelectorAll(".course-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".course-tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        selectedCourse = btn.dataset.course;
        renderPracticalsList();
      });
    });

    // Category Pills
    document.querySelectorAll(".category-pill").forEach(pill => {
      pill.addEventListener("click", () => {
        document.querySelectorAll(".category-pill").forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        selectedCategory = pill.dataset.cat;
        renderPracticalsList();
      });
    });

    // Live Search
    const searchInput = document.getElementById("practicalsSearchInput");
    if (searchInput) {
      searchInput.addEventListener("input", e => {
        searchQuery = e.target.value;
        renderPracticalsList();
      });
    }

    // Saved Practicals Filter Toggle
    const savedFilterBtn = document.getElementById("practicalsSavedFilter");
    if (savedFilterBtn) {
      savedFilterBtn.addEventListener("click", () => {
        onlySaved = !onlySaved;
        savedFilterBtn.classList.toggle("active", onlySaved);
        renderPracticalsList();
      });
    }

    // Language Switcher Tabs
    document.querySelectorAll(".lang-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        activeLang = btn.dataset.lang;
        const item = PRACTICALS_DATA.find(p => p.id === activePracticalId);
        if (item) renderCodeBlock(item);
      });
    });

    // Large Bookmark Button in Details Header
    const bmBtnLg = document.getElementById("practicalBookmarkLg");
    if (bmBtnLg) {
      bmBtnLg.addEventListener("click", () => {
        toggleBookmark(activePracticalId);
      });
    }

    // Mobile View Tabs (List vs Detail)
    document.querySelectorAll(".mobile-view-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        setMobileViewMode(btn.dataset.viewMode);
      });
    });

    // Action Buttons
    const copyBtn = document.getElementById("practicalCopyBtn");
    if (copyBtn) copyBtn.addEventListener("click", copyPracticalCode);

    const downloadBtn = document.getElementById("practicalDownloadBtn");
    if (downloadBtn) downloadBtn.addEventListener("click", downloadPracticalFile);

    const shareBtn = document.getElementById("practicalShareBtn");
    if (shareBtn) shareBtn.addEventListener("click", sharePracticalCode);

    const runBtn = document.getElementById("practicalRunBtn");
    if (runBtn) runBtn.addEventListener("click", runInTracer);

    const vizBtn = document.getElementById("practicalVizBtn");
    if (vizBtn) vizBtn.addEventListener("click", openInVisualizer);

    // Initial render
    updateBookmarkFilterCount();
    renderPracticalsList();
    renderPracticalDetail();
  }

  // Expose to global window
  window.initPracticalsUI = initPracticalsUI;
  window.renderPracticalsList = renderPracticalsList;
  window.renderPracticalDetail = renderPracticalDetail;
})();
