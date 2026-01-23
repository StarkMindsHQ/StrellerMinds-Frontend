'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import * as Y from 'yjs';
import { MonacoBinding } from 'y-monaco';
import { useCollaboration } from '@/contexts/collaboration-context';
import { Button } from '@/components/ui/button';
import { Copy, Play, Square, Users } from 'lucide-react';
import { toast } from 'sonner';
import type { SupportedLanguage } from '@/lib/sandbox';
import { SocketIOProvider } from '@/lib/collaboration/yjs-socket-provider';

interface CollaborativeEditorProps {
  language: SupportedLanguage;
  isExecuting: boolean;
  setIsExecuting: (isExecuting: boolean) => void;
  onExecute: (code: string) => void;
  onStop: () => void;
}

export default function CollaborativeEditor({
  language,
  isExecuting,
  setIsExecuting,
  onExecute,
  onStop,
}: CollaborativeEditorProps) {
  const editorRef = useRef<any>(null);
  const yDocRef = useRef<Y.Doc | null>(null);
  const yTextRef = useRef<Y.Text | null>(null);
  const bindingRef = useRef<MonacoBinding | null>(null);
  const providerRef = useRef<SocketIOProvider | null>(null);
  const [code, setCode] = useState('');
  const {
    state,
    updateCursor,
    updateSelection,
    canUserEdit,
    getCurrentCode,
  } = useCollaboration();

  // Initialize Yjs document and provider
  useEffect(() => {
    if (!state.session || !state.isConnected) {
      // Cleanup if session disconnected
      if (bindingRef.current) {
        bindingRef.current.destroy();
        bindingRef.current = null;
      }
      if (providerRef.current) {
        providerRef.current.destroy();
        providerRef.current = null;
      }
      if (yDocRef.current) {
        yDocRef.current.destroy();
        yDocRef.current = null;
        yTextRef.current = null;
      }
      return;
    }

    const yDoc = new Y.Doc();
    const yText = yDoc.getText('monaco');
    yDocRef.current = yDoc;
    yTextRef.current = yText;

    // Connect to Socket.IO provider
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001';
    const provider = new SocketIOProvider(state.session.id, yDoc, wsUrl);
    providerRef.current = provider;

    // Initialize with current session code if available (only if Yjs is empty)
    // Wait a bit for sync to complete, then initialize if still empty
    setTimeout(() => {
      if (yText.length === 0 && state.session.code) {
        yText.insert(0, state.session.code);
      }
    }, 500);

    // Update local code state when Yjs changes (for display/execution)
    const updateCodeFromYjs = () => {
      const newCode = yText.toString();
      setCode(newCode);
    };

    yText.observe(updateCodeFromYjs);

    // Initial code update
    updateCodeFromYjs();

    // Cleanup
    return () => {
      if (bindingRef.current) {
        bindingRef.current.destroy();
        bindingRef.current = null;
      }
      if (providerRef.current) {
        providerRef.current.destroy();
        providerRef.current = null;
      }
      if (yDocRef.current) {
        yDocRef.current.destroy();
        yDocRef.current = null;
        yTextRef.current = null;
      }
    };
  }, [state.session?.id, state.isConnected]);

  // Handle editor mount
  const handleEditorDidMount = useCallback(
    (editor: any, monaco: any) => {
      editorRef.current = editor;

      // Wait for Yjs to be ready, then create binding
      const setupBinding = () => {
        if (!yTextRef.current || !state.session || !providerRef.current) {
          // Retry after a short delay if Yjs isn't ready yet
          setTimeout(setupBinding, 100);
          return;
        }

        // Destroy existing binding if any
        if (bindingRef.current) {
          bindingRef.current.destroy();
        }

        // Create Monaco binding for collaborative editing with Yjs
        try {
          const binding = new MonacoBinding(
            yTextRef.current,
            editor.getModel(),
            new Set([editor]),
            providerRef.current.awareness,
          );
          bindingRef.current = binding;

          // Set initial value from Yjs if editor is empty
          const currentValue = editor.getValue();
          const yjsValue = yTextRef.current.toString();
          if (!currentValue && yjsValue) {
            editor.setValue(yjsValue);
          } else if (currentValue && !yjsValue) {
            // If editor has content but Yjs is empty, initialize Yjs
            yTextRef.current.insert(0, currentValue);
          }
        } catch (error) {
          console.error('Error creating Monaco binding:', error);
          toast.error('Failed to initialize collaborative editing');
        }
      };

      setupBinding();

      // Track cursor position (debounced)
      let cursorTimeout: NodeJS.Timeout | null = null;
      editor.onDidChangeCursorPosition((e: any) => {
        if (state.currentUser) {
          if (cursorTimeout) clearTimeout(cursorTimeout);
          cursorTimeout = setTimeout(() => {
            updateCursor({
              lineNumber: e.position.lineNumber,
              column: e.position.column,
              userId: state.currentUser!.id,
            });
          }, 100);
        }
      });

      // Track selection
      editor.onDidChangeCursorSelection((e: any) => {
        if (state.currentUser) {
          const selection = e.selection;
          if (
            selection.startLineNumber !== selection.endLineNumber ||
            selection.startColumn !== selection.endColumn
          ) {
            updateSelection({
              startLineNumber: selection.startLineNumber,
              startColumn: selection.startColumn,
              endLineNumber: selection.endLineNumber,
              endColumn: selection.endColumn,
              userId: state.currentUser.id,
            });
          } else {
            updateSelection(null);
          }
        }
      });

      // Make editor read-only if user can't edit
      editor.updateOptions({ readOnly: !canUserEdit() });
    },
    [state.session, state.currentUser, canUserEdit, updateCursor, updateSelection],
  );

  // Handle code changes (Yjs handles this automatically, but we keep this for compatibility)
  const handleCodeChange = useCallback((value: string | undefined) => {
    // Yjs binding handles changes automatically
    // This is just for local state if needed
    if (value !== undefined) {
      setCode(value);
    }
  }, []);

  // Copy code
  const copyCode = useCallback(() => {
    const codeToCopy = code || getCurrentCode();
    navigator.clipboard.writeText(codeToCopy);
    toast.success('Code copied to clipboard');
  }, [code, getCurrentCode]);

  // Get current code for execution
  const getCode = useCallback(() => {
    return code || getCurrentCode();
  }, [code, getCurrentCode]);

  return (
    <div className="space-y-4">
      {/* User presence indicator */}
      {state.session && (
        <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
          <Users className="h-4 w-4" />
          <span className="text-sm">
            {state.session.users.length} user{state.session.users.length !== 1 ? 's' : ''} in
            session
          </span>
          <div className="flex gap-1 ml-auto">
            {Array.from(state.users.values()).map((user) => (
              <div
                key={user.id}
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white"
                style={{ backgroundColor: user.color }}
                title={user.name}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="border rounded-md overflow-hidden h-[500px]">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={handleCodeChange}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: 'on',
            automaticLayout: true,
            tabSize: 2,
            scrollBeyondLastLine: false,
            lineNumbers: 'on',
            renderLineHighlight: 'line',
            folding: true,
            bracketPairColorization: { enabled: true },
            readOnly: !canUserEdit(),
            // Disable default undo/redo - Yjs handles this
            undoStopBefore: false,
            undoStopAfter: false,
          }}
        />
      </div>

      <div className="flex gap-2 flex-wrap">
        {isExecuting ? (
          <Button onClick={onStop} variant="destructive" className="gap-2">
            <Square className="h-4 w-4" />
            Stop
          </Button>
        ) : (
          <Button
            onClick={() => onExecute(getCode())}
            className="gap-2"
            disabled={!canUserEdit()}
          >
            <Play className="h-4 w-4" />
            Run Code
          </Button>
        )}
        <Button variant="outline" onClick={copyCode} className="gap-2">
          <Copy className="h-4 w-4" />
          Copy
        </Button>
      </div>
    </div>
  );
}
