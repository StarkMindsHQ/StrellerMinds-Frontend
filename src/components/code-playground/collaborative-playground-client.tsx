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
import {
  CollaborationProvider,
  useCollaboration,
} from '@/contexts/collaboration-context';
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
    <div className="container mx-auto p-2 sm:p-4 max-w-7xl">
      <Toaster position="top-right" />

      {/* Header Card */}
      <Card className="mb-4 sm:mb-6">
        <CardHeader className="px-3 sm:px-6 py-3 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="min-w-0">
              <CardTitle className="text-lg sm:text-2xl flex items-center gap-2">
                <Code2 className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
                <span className="truncate">Collaborative Code Playground</span>
              </CardTitle>
              <CardDescription className="mt-1 text-xs sm:text-sm">
                Real-time collaborative coding with live synchronization
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <SessionManager />
              {state.isConnected ? (
                <Badge variant="outline" className="gap-1 text-xs sm:text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="hidden sm:inline">Connected</span>
                  <span className="sm:hidden">On</span>
                </Badge>
              ) : (
                <Badge variant="outline" className="gap-1 text-xs sm:text-sm">
                  <div className="w-2 h-2 bg-gray-400 rounded-full" />
                  <span className="hidden sm:inline">Disconnected</span>
                  <span className="sm:hidden">Off</span>
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {!state.session ? (
        <Card>
          <CardContent className="py-8 sm:py-12 text-center px-4">
            <Users className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 text-muted-foreground" />
            <h3 className="text-base sm:text-lg font-semibold mb-2">
              No Active Session
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4">
              Create a new session or join an existing one to start
              collaborating
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Main Editor Area */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                  <CardTitle className="text-base sm:text-lg">
                    Collaborative Editor
                  </CardTitle>
                  <LanguageSelector
                    selectedLanguage={language}
                    onLanguageChange={handleLanguageChange}
                    disabled={isExecuting || !canUserEdit()}
                  />
                </div>
              </CardHeader>
              <CardContent className="px-3 sm:px-6">
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
          <div className="space-y-4 sm:space-y-6">
            <CollaborationChat />
          </div>
        </div>
      )}
    </div>
  );
}

export default function CollaborativePlaygroundClient() {
  return (
    <CollaborationProvider>
      <CollaborativePlaygroundContent />
    </CollaborationProvider>
  );
}
