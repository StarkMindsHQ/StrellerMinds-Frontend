'use client';

import type React from 'react';
import { useRef, useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import {
  Copy,
  Play,
  Share2,
  Square,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  SandboxExecutor,
  getMonacoLanguage,
  validateCode,
  DEFAULT_SECURITY_CONFIG,
  type SupportedLanguage,
  type ExecutionOutput,
  type ExecutionStatus,
  type ValidationResult,
} from '@/lib/sandbox';

const Editor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full animate-pulse bg-muted rounded-md" />
  ),
});

interface SecureCodeEditorProps {
  code: string;
  setCode: (code: string) => void;
  language: SupportedLanguage;
  isExecuting: boolean;
  setIsExecuting: (isExecuting: boolean) => void;
  onOutput: (output: ExecutionOutput) => void;
  onStatusChange: (status: ExecutionStatus) => void;
  onClearOutput: () => void;
  onExecutionComplete: (executionTime: number) => void;
}

export default function SecureCodeEditor({
  code,
  setCode,
  language,
  isExecuting,
  setIsExecuting,
  onOutput,
  onStatusChange,
  onClearOutput,
  onExecutionComplete,
}: SecureCodeEditorProps) {
  const editorRef = useRef<any>(null);
  const executorRef = useRef<SandboxExecutor | null>(null);
  const [validation, setValidation] = useState<ValidationResult | null>(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  // Validate code as user types (debounced)
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (code.trim()) {
        const result = validateCode(code, language, DEFAULT_SECURITY_CONFIG);
        setValidation(result);
      } else {
        setValidation(null);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [code, language]);

  const handleExecuteCode = useCallback(async () => {
    if (isExecuting) return;

    // Clear previous output
    onClearOutput();
    setIsExecuting(true);
    onStatusChange('validating');

    // Create executor with callbacks
    const executor = new SandboxExecutor(
      {
        language,
        enableStellarMock: true,
      },
      {
        onOutput: (output) => {
          onOutput(output);
        },
        onStatusChange: (status) => {
          onStatusChange(status);
        },
        onComplete: (result) => {
          setIsExecuting(false);
          onExecutionComplete(result.executionTime);

          if (!result.success && result.error) {
            toast.error(`Execution failed: ${result.error.substring(0, 100)}`);
          }
        },
      },
    );

    executorRef.current = executor;

    // Execute the code
    await executor.execute(code);
  }, [
    code,
    language,
    isExecuting,
    onOutput,
    onStatusChange,
    onClearOutput,
    setIsExecuting,
    onExecutionComplete,
  ]);

  const handleStopExecution = useCallback(() => {
    if (executorRef.current?.isRunning()) {
      executorRef.current.stop();
    }
    setIsExecuting(false);
  }, [setIsExecuting]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (executorRef.current?.isRunning()) {
        executorRef.current.stop();
      }
    };
  }, []);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard');
  };

  const shareCode = () => {
    const encodedCode = encodeURIComponent(code);
    const langParam = language !== 'javascript' ? `&lang=${language}` : '';
    const url = `${window.location.origin}${window.location.pathname}?code=${encodedCode}${langParam}`;
    navigator.clipboard.writeText(url);
    toast.success('Share link copied to clipboard');
  };

  // Get validation status icon
  const getValidationIcon = () => {
    if (!validation) return null;

    if (!validation.isValid) {
      return (
        <div
          className="flex items-center gap-1 text-red-500"
          title="Security issues detected"
        >
          <AlertTriangle className="h-4 w-4" />
          <span className="text-xs">{validation.errors.length} error(s)</span>
        </div>
      );
    }

    if (validation.warnings.length > 0) {
      return (
        <div
          className="flex items-center gap-1 text-yellow-500"
          title="Warnings detected"
        >
          <AlertTriangle className="h-4 w-4" />
          <span className="text-xs">
            {validation.warnings.length} warning(s)
          </span>
        </div>
      );
    }

    return (
      <div
        className="flex items-center gap-1 text-green-500"
        title="Code looks good"
      >
        <CheckCircle className="h-4 w-4" />
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-md overflow-hidden h-[500px]">
        <Editor
          height="100%"
          language={getMonacoLanguage(language)}
          value={code}
          onChange={(value) => setCode(value || '')}
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
          }}
        />
      </div>
      <div className="flex justify-between items-center gap-2 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          {isExecuting ? (
            <Button
              onClick={handleStopExecution}
              variant="destructive"
              className="gap-2"
            >
              <Square className="h-4 w-4" />
              Stop
            </Button>
          ) : (
            <Button
              onClick={handleExecuteCode}
              className="gap-2"
              disabled={validation?.isValid === false}
            >
              <Play className="h-4 w-4" />
              Run Code
            </Button>
          )}
          <Button variant="outline" onClick={copyCode} className="gap-2">
            <Copy className="h-4 w-4" />
            Copy
          </Button>
          <Button variant="outline" onClick={shareCode} className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
        {getValidationIcon()}
      </div>
    </div>
  );
}
