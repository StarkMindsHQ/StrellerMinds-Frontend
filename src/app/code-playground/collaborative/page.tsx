'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Toaster } from 'sonner';
import { Code2, Users } from 'lucide-react';
import { CollaborationProvider, useCollaboration } from '@/contexts/collaboration-context';
import SessionManager from '@/components/code-playground/session-manager';
import CollaborativeEditor from '@/components/code-playground/collaborative-editor';
import CollaborationChat from '@/components/code-playground/collaboration-chat';
import EnhancedOutputPanel from '@/components/code-playground/enhanced-output-panel';
import LanguageSelector from '@/components/code-playground/language-selector';
import type {
  SupportedLanguage,
  ExecutionOutput,
  ExecutionStatus,
} from '@/lib/sandbox';
import { executeCode } from '@/lib/code-executor';

function CollaborativePlaygroundContent() {
  const { state, connect, updateLanguage, canUserEdit } = useCollaboration();
  const [language, setLanguage] = useState<SupportedLanguage>('javascript');
  const [outputs, setOutputs] = useState<ExecutionOutput[]>([]);
  const [status, setStatus] = useState<ExecutionStatus>('idle');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | undefined>();

  // Connect on mount
  useEffect(() => {
    connect();
    return () => {
      // Cleanup handled by context
    };
  }, [connect]);

  // Handle language change
  const handleLanguageChange = useCallback(
    (newLanguage: SupportedLanguage) => {
      setLanguage(newLanguage);
      if (state.session) {
        updateLanguage(newLanguage);
      }
    },
    [state.session, updateLanguage],
  );

  // Handle code execution
  const handleExecute = useCallback(
    async (code: string) => {
      if (!canUserEdit()) {
        return;
      }

      setIsExecuting(true);
      setStatus('executing');
      setOutputs([]);

      try {
        const startTime = Date.now();
        let currentOutput = '';

        const { stop } = await executeCode(code, (log: string) => {
          currentOutput += log + '\n';
          setOutputs((prev) => [
            ...prev,
            {
              type: 'log' as const,
              content: log,
              timestamp: Date.now(),
            },
          ]);
        });

        const endTime = Date.now();
        setExecutionTime(endTime - startTime);
        setStatus('completed');
        setIsExecuting(false);
      } catch (error) {
        setOutputs((prev) => [
          ...prev,
          {
            type: 'error' as const,
            content: error instanceof Error ? error.message : String(error),
            timestamp: Date.now(),
          },
        ]);
        setStatus('error');
        setIsExecuting(false);
      }
    },
    [canUserEdit],
  );

  // Handle stop execution
  const handleStop = useCallback(() => {
    setIsExecuting(false);
    setStatus('stopped');
    setOutputs((prev) => [
      ...prev,
      {
        type: 'log' as const,
        content: '\n--- Execution stopped by user ---',
        timestamp: Date.now(),
      },
    ]);
  }, []);

  // Handle clear output
  const handleClearOutput = useCallback(() => {
    setOutputs([]);
    setStatus('idle');
    setExecutionTime(undefined);
  }, []);

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <Toaster position="top-right" />

      {/* Header Card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Code2 className="h-6 w-6" />
                Collaborative Code Playground
              </CardTitle>
              <CardDescription className="mt-1">
                Real-time collaborative coding with live synchronization
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <SessionManager />
              {state.isConnected ? (
                <Badge variant="outline" className="gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  Connected
                </Badge>
              ) : (
                <Badge variant="outline" className="gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full" />
                  Disconnected
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {!state.session ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Active Session</h3>
            <p className="text-muted-foreground mb-4">
              Create a new session or join an existing one to start collaborating
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Editor Area */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle>Collaborative Editor</CardTitle>
                  <LanguageSelector
                    selectedLanguage={language}
                    onLanguageChange={handleLanguageChange}
                    disabled={isExecuting || !canUserEdit()}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <CollaborativeEditor
                  language={language}
                  isExecuting={isExecuting}
                  setIsExecuting={setIsExecuting}
                  onExecute={handleExecute}
                  onStop={handleStop}
                />
              </CardContent>
            </Card>

            <EnhancedOutputPanel
              outputs={outputs}
              status={status}
              executionTime={executionTime}
              onClear={handleClearOutput}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <CollaborationChat />
          </div>
        </div>
      )}
    </div>
  );
}

export default function CollaborativePlaygroundPage() {
  return (
    <CollaborationProvider>
      <CollaborativePlaygroundContent />
    </CollaborationProvider>
  );
}
