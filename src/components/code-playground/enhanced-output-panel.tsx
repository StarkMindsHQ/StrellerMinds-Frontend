'use client';

import { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, Copy, Download } from 'lucide-react';
import { toast } from 'sonner';
import type { ExecutionOutput, ExecutionStatus } from '@/lib/sandbox';

interface EnhancedOutputPanelProps {
  outputs: ExecutionOutput[];
  status: ExecutionStatus;
  executionTime?: number;
  onClear: () => void;
}

const statusColors: Record<ExecutionStatus, string> = {
  idle: 'bg-gray-500',
  validating: 'bg-yellow-500',
  compiling: 'bg-blue-500',
  executing: 'bg-green-500 animate-pulse',
  completed: 'bg-green-600',
  error: 'bg-red-500',
  timeout: 'bg-orange-500',
  stopped: 'bg-gray-600',
};

const statusLabels: Record<ExecutionStatus, string> = {
  idle: 'Ready',
  validating: 'Validating...',
  compiling: 'Compiling...',
  executing: 'Running...',
  completed: 'Completed',
  error: 'Error',
  timeout: 'Timed Out',
  stopped: 'Stopped',
};

const outputTypeColors: Record<string, string> = {
  log: 'text-green-400',
  error: 'text-red-400',
  warn: 'text-yellow-400',
  info: 'text-blue-400',
  result: 'text-purple-400',
  system: 'text-gray-400 italic',
};

export default function EnhancedOutputPanel({
  outputs,
  status,
  executionTime,
  onClear,
}: EnhancedOutputPanelProps) {
  const outputRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new output arrives
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [outputs]);

  const copyOutput = () => {
    const text = outputs.map((o) => o.content).join('\n');
    navigator.clipboard.writeText(text);
    toast.success('Output copied to clipboard');
  };

  const downloadOutput = () => {
    const text = outputs.map((o) => o.content).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'output.txt';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Output downloaded');
  };

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  return (
    <Card>
      <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <CardTitle className="text-base sm:text-lg">Output</CardTitle>
            <Badge
              className={`${statusColors[status]} text-white text-xs sm:text-sm flex-shrink-0`}
            >
              {statusLabels[status]}
            </Badge>
            {executionTime !== undefined && status === 'completed' && (
              <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                {formatTime(executionTime)}
              </span>
            )}
          </div>
          <div className="flex gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={copyOutput}
              disabled={outputs.length === 0}
              title="Copy output"
              className="min-h-[36px] sm:min-h-0 touch-manipulation"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={downloadOutput}
              disabled={outputs.length === 0}
              title="Download output"
              className="min-h-[36px] sm:min-h-0 touch-manipulation"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              disabled={outputs.length === 0}
              title="Clear output"
              className="min-h-[36px] sm:min-h-0 touch-manipulation"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-3 sm:px-6">
        <div
          ref={outputRef}
          className="bg-black font-mono p-3 sm:p-4 rounded-md h-[200px] sm:h-[250px] overflow-auto text-xs sm:text-sm touch-pan-y"
        >
          {outputs.length === 0 ? (
            <div className="text-gray-500">
              {status === 'idle'
                ? '// Code execution output will appear here'
                : '// Waiting for output...'}
            </div>
          ) : (
            outputs.map((output, index) => (
              <div
                key={index}
                className={`${outputTypeColors[output.type] || 'text-green-400'} whitespace-pre-wrap break-words`}
              >
                {output.type === 'error' &&
                  !output.content.startsWith('ERROR:') && (
                    <span className="text-red-500 font-bold">ERROR: </span>
                  )}
                {output.type === 'warn' &&
                  !output.content.startsWith('WARNING:') && (
                    <span className="text-yellow-500 font-bold">WARNING: </span>
                  )}
                {output.content}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
