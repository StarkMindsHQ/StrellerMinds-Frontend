'use client';

/**
 * FILE: src/components/code-playground/CodePlayground.tsx
 *
 * Embedded coding environment with:
 * - Syntax-highlighted editor (using a <textarea> + overlay approach, no heavy deps)
 * - JS execution via sandboxed iframe
 * - Python execution via Pyodide (loaded on demand)
 * - Output console with error display
 */

import { useState, useRef, useCallback, useEffect } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Language = 'javascript' | 'python';

interface OutputLine {
  type: 'log' | 'error' | 'warn' | 'result';
  content: string;
  ts: number;
}

interface CodePlaygroundProps {
  initialCode?: string;
  language?: Language;
  title?: string;
  readOnly?: boolean;
  height?: number;
}

// ─── Starter templates ────────────────────────────────────────────────────────

const STARTERS: Record<Language, string> = {
  javascript: `// JavaScript Playground
// Click ▶ Run to execute your code

function greet(name) {
  return \`Hello, \${name}! 👋\`;
}

console.log(greet("StrellerMinds"));

// Try some maths
const nums = [3, 1, 4, 1, 5, 9, 2, 6];
const sorted = [...nums].sort((a, b) => a - b);
console.log("Sorted:", sorted);
console.log("Max:", Math.max(...nums));
`,
  python: `# Python Playground (powered by Pyodide)
# Click ▶ Run to execute

def greet(name):
    return f"Hello, {name}! 👋"

print(greet("StrellerMinds"))

# Simple list comprehension
squares = [x**2 for x in range(1, 8)]
print("Squares:", squares)
`,
};

// ─── Sandbox JS execution via iframe ─────────────────────────────────────────

function runJavaScript(
  code: string,
  onOutput: (line: OutputLine) => void,
): void {
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.sandbox.value = 'allow-scripts';
  document.body.appendChild(iframe);

  const captured: OutputLine[] = [];
  const listener = (e: MessageEvent) => {
    if (e.data?.source !== 'smplayground') return;
    captured.push({
      type: e.data.type,
      content: e.data.content,
      ts: Date.now(),
    });
    onOutput(captured[captured.length - 1]);
  };
  window.addEventListener('message', listener);

  const src = `
    <script>
      const _log = (type, ...args) => {
        const content = args.map(a => {
          try { return typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a); }
          catch { return String(a); }
        }).join(' ');
        parent.postMessage({ source: 'smplayground', type, content }, '*');
      };
      console.log = (...a) => _log('log', ...a);
      console.warn = (...a) => _log('warn', ...a);
      console.error = (...a) => _log('error', ...a);
      window.onerror = (msg, src, line, col) => {
        _log('error', \`\${msg} (line \${line})\`);
        return true;
      };
      try {
        const __result = eval(${JSON.stringify(code)});
        if (__result !== undefined) _log('result', __result);
      } catch(e) {
        _log('error', e.message);
      }
    <\/script>
  `;

  iframe.srcdoc = src;
  setTimeout(() => {
    window.removeEventListener('message', listener);
    document.body.removeChild(iframe);
  }, 5000);
}

// ─── Simple keyword highlighter (no heavy deps) ───────────────────────────────

function highlight(code: string, lang: Language): string {
  const esc = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  let src = esc(code);

  const apply = (pattern: RegExp, cls: string) =>
    src.replace(pattern, (m) => `<span class="${cls}">${m}</span>`);

  // Strings
  src = src.replace(
    /(["'`])((?:\\.|(?!\1)[^\\])*)\1/g,
    '<span class="hl-str">$&</span>',
  );
  // Comments
  if (lang === 'javascript') src = apply(/(\/\/[^\n]*)/g, 'hl-cmt');
  if (lang === 'python') src = apply(/(#[^\n]*)/g, 'hl-cmt');
  // Numbers
  src = apply(/\b(\d+\.?\d*)\b/g, 'hl-num');
  // Keywords
  const jsKw =
    /\b(const|let|var|function|return|if|else|for|while|class|new|import|export|default|async|await|try|catch|throw|typeof|instanceof|of|in|true|false|null|undefined)\b/g;
  const pyKw =
    /\b(def|return|if|elif|else|for|while|class|import|from|as|with|try|except|raise|True|False|None|and|or|not|in|is|lambda|pass|break|continue|yield)\b/g;
  src = apply(lang === 'python' ? pyKw : jsKw, 'hl-kw');

  return src;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CodePlayground({
  initialCode,
  language: initialLang = 'javascript',
  title = 'Code Playground',
  readOnly = false,
  height = 320,
}: CodePlaygroundProps) {
  const [lang, setLang] = useState<Language>(initialLang);
  const [code, setCode] = useState(initialCode ?? STARTERS[initialLang]);
  const [output, setOutput] = useState<OutputLine[]>([]);
  const [running, setRunning] = useState(false);
  const [pyodideReady, setPyodideReady] = useState(false);
  const [loadingPy, setLoadingPy] = useState(false);
  const pyodideRef = useRef<{
    runPythonAsync: (c: string) => Promise<unknown>;
  } | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  // Switch language -> reset code
  const switchLang = (l: Language) => {
    setLang(l);
    setCode(STARTERS[l]);
    setOutput([]);
  };

  // Auto-scroll output
  useEffect(() => {
    if (outputRef.current)
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
  }, [output]);

  const addLine = useCallback(
    (line: OutputLine) => setOutput((o) => [...o, line]),
    [],
  );

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return;
    setLoadingPy(true);
    try {
      // Dynamically load Pyodide from CDN
      if (!window.loadPyodide) {
        await new Promise<void>((res, rej) => {
          const s = document.createElement('script');
          s.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js';
          s.onload = () => res();
          s.onerror = () => rej(new Error('Failed to load Pyodide'));
          document.head.appendChild(s);
        });
      }
      pyodideRef.current = await window.loadPyodide!({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/',
      });
      // Redirect Python stdout
      await pyodideRef.current.runPythonAsync(`
import sys, js
class _Out:
    def write(self, s):
        if s.strip(): js.postMessage({'source':'smplayground','type':'log','content':s.rstrip()})
    def flush(self): pass
sys.stdout = _Out()
sys.stderr = _Out()
      `);
      setPyodideReady(true);
    } catch (e) {
      addLine({
        type: 'error',
        content: 'Failed to load Python runtime: ' + (e as Error).message,
        ts: Date.now(),
      });
    }
    setLoadingPy(false);
  }, [addLine]);

  const runCode = useCallback(async () => {
    setOutput([]);
    setRunning(true);

    if (lang === 'javascript') {
      runJavaScript(code, addLine);
      // Give iframe time to finish
      await new Promise((r) => setTimeout(r, 800));
    } else {
      if (!pyodideReady) await loadPyodide();
      if (!pyodideRef.current) {
        setRunning(false);
        return;
      }
      try {
        // Capture stdout by overriding in Python
        const capturedLines: string[] = [];
        const originalRun = pyodideRef.current.runPythonAsync.bind(
          pyodideRef.current,
        );
        // Simple approach: execute and capture print via js bridge
        await originalRun(`
import sys, io
_buf = io.StringIO()
sys.stdout = _buf
sys.stderr = _buf
`);
        await originalRun(code);
        const out = await originalRun(`
_v = _buf.getvalue()
sys.stdout = sys.__stdout__
_v
`);
        String(out)
          .split('\n')
          .filter(Boolean)
          .forEach((line) =>
            addLine({ type: 'log', content: line, ts: Date.now() }),
          );
      } catch (e: unknown) {
        const msg = (e as Error).message?.split('\n').pop() ?? String(e);
        addLine({ type: 'error', content: msg, ts: Date.now() });
      }
    }
    setRunning(false);
  }, [lang, code, addLine, pyodideReady, loadPyodide]);

  // Keyboard shortcut: Ctrl/Cmd+Enter to run
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        runCode();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [runCode]);

  // Tab support in textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = e.currentTarget;
      const { selectionStart: ss, selectionEnd: se } = ta;
      const newVal = code.slice(0, ss) + '  ' + code.slice(se);
      setCode(newVal);
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = ss + 2;
      });
    }
  };

  const lineCount = code.split('\n').length;

  return (
    <div
      style={{
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        background: '#0d1117',
        border: '1px solid #30363d',
        borderRadius: 14,
        overflow: 'hidden',
        color: '#e6edf3',
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          padding: '10px 16px',
          background: '#161b22',
          borderBottom: '1px solid #30363d',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#8b949e' }}>
            {title}
          </span>
          <div
            style={{
              display: 'flex',
              background: '#0d1117',
              borderRadius: 6,
              border: '1px solid #30363d',
              overflow: 'hidden',
            }}
          >
            {(['javascript', 'python'] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => switchLang(l)}
                style={{
                  padding: '4px 12px',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: 'none',
                  background: lang === l ? '#1f6feb' : 'transparent',
                  color: lang === l ? '#fff' : '#8b949e',
                  fontFamily: 'inherit',
                  transition: 'background 0.15s',
                }}
              >
                {l === 'javascript' ? 'JS' : 'PY'}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {lang === 'python' && !pyodideReady && !loadingPy && (
            <span
              style={{
                fontSize: 10,
                color: '#6e7681',
                fontFamily: 'sans-serif',
              }}
            >
              Pyodide loads on first run
            </span>
          )}
          {loadingPy && (
            <span
              style={{
                fontSize: 10,
                color: '#f0883e',
                fontFamily: 'sans-serif',
              }}
            >
              ⏳ Loading Python…
            </span>
          )}
          <button
            onClick={() => setOutput([])}
            style={{
              background: 'transparent',
              border: '1px solid #30363d',
              borderRadius: 6,
              padding: '5px 10px',
              fontSize: 11,
              color: '#8b949e',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Clear
          </button>
          <button
            onClick={runCode}
            disabled={running}
            style={{
              background: running ? '#1c2128' : '#238636',
              border: 'none',
              borderRadius: 6,
              padding: '6px 16px',
              fontSize: 13,
              fontWeight: 700,
              cursor: running ? 'not-allowed' : 'pointer',
              color: running ? '#6e7681' : '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontFamily: 'inherit',
              transition: 'background 0.15s',
            }}
          >
            {running ? (
              <>
                <span
                  style={{
                    display: 'inline-block',
                    width: 10,
                    height: 10,
                    border: '2px solid #6e7681',
                    borderTopColor: '#238636',
                    borderRadius: '50%',
                    animation: 'spin 0.6s linear infinite',
                  }}
                />{' '}
                Running
              </>
            ) : (
              '▶ Run'
            )}
          </button>
        </div>
      </div>

      {/* Editor area */}
      <div style={{ position: 'relative', height, display: 'flex' }}>
        {/* Line numbers */}
        <div
          style={{
            width: 48,
            background: '#0d1117',
            borderRight: '1px solid #21262d',
            padding: '14px 0',
            userSelect: 'none',
            flexShrink: 0,
            overflowY: 'hidden',
          }}
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div
              key={i}
              style={{
                fontSize: 12,
                lineHeight: '20px',
                textAlign: 'right',
                paddingRight: 10,
                color: '#3b454e',
              }}
            >
              {i + 1}
            </div>
          ))}
        </div>

        {/* Code editor (textarea) */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          {/* Highlight layer */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              padding: '14px 16px',
              fontSize: 13,
              lineHeight: '20px',
              fontFamily: 'inherit',
              whiteSpace: 'pre',
              overflowX: 'auto',
              pointerEvents: 'none',
              color: 'transparent',
            }}
            dangerouslySetInnerHTML={{ __html: highlight(code, lang) + '\n' }}
          />
          <textarea
            ref={taRef}
            value={code}
            onChange={(e) => !readOnly && setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            readOnly={readOnly}
            spellCheck={false}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              resize: 'none',
              padding: '14px 16px',
              fontSize: 13,
              lineHeight: '20px',
              fontFamily: 'inherit',
              color: '#e6edf3',
              caretColor: '#e6edf3',
              overflowY: 'auto',
              width: '100%',
              height: '100%',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {/* Output console */}
      <div style={{ borderTop: '1px solid #21262d' }}>
        <div
          style={{
            padding: '8px 16px',
            background: '#161b22',
            borderBottom: '1px solid #21262d',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontSize: 11,
              color: '#6e7681',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            Output
          </span>
          <span style={{ fontSize: 10, color: '#3b454e' }}>
            Ctrl+Enter to run
          </span>
        </div>
        <div
          ref={outputRef}
          style={{
            minHeight: 100,
            maxHeight: 200,
            overflowY: 'auto',
            padding: '12px 16px',
            background: '#0d1117',
          }}
        >
          {output.length === 0 ? (
            <span style={{ color: '#3b454e', fontSize: 12 }}>
              No output yet. Press ▶ Run to execute.
            </span>
          ) : (
            output.map((line, i) => (
              <div
                key={i}
                style={{
                  fontSize: 12,
                  lineHeight: '18px',
                  marginBottom: 2,
                  color:
                    line.type === 'error'
                      ? '#f85149'
                      : line.type === 'warn'
                        ? '#f0883e'
                        : line.type === 'result'
                          ? '#79c0ff'
                          : '#e6edf3',
                  display: 'flex',
                  gap: 8,
                }}
              >
                <span style={{ color: '#3b454e', flexShrink: 0 }}>
                  {line.type === 'error'
                    ? '✖'
                    : line.type === 'warn'
                      ? '⚠'
                      : line.type === 'result'
                        ? '→'
                        : '>'}
                </span>
                <span
                  style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}
                >
                  {line.content}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .hl-kw { color: #ff7b72; }
        .hl-str { color: #a5d6ff; }
        .hl-num { color: #79c0ff; }
        .hl-cmt { color: #8b949e; font-style: italic; }
      `}</style>
    </div>
  );
}
