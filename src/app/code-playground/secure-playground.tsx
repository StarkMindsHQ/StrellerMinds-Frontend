'use client';

import { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Toaster } from 'sonner';
import { Shield, Zap, Clock, Code2 } from 'lucide-react';

import LanguageSelector from '@/components/code-playground/language-selector';
import EnhancedTemplateSelector from '@/components/code-playground/enhanced-template-selector';
import SecureCodeEditor from '@/components/code-playground/secure-code-editor';
import EnhancedOutputPanel from '@/components/code-playground/enhanced-output-panel';
import SaveCodeForm from '@/components/code-playground/save-code-form';
import DocumentationPanel from '@/components/code-playground/documentation-panel';

import {
  type SupportedLanguage,
  type ExecutionOutput,
  type ExecutionStatus,
  initializeSandbox,
} from '@/lib/sandbox';
import { getDefaultTemplate, type CodeTemplate } from '@/lib/sandbox/templates';

export default function SecureCodePlayground() {
  const [language, setLanguage] = useState<SupportedLanguage>('javascript');
  const [code, setCode] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('js-blank');
  const [outputs, setOutputs] = useState<ExecutionOutput[]>([]);
  const [status, setStatus] = useState<ExecutionStatus>('idle');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | undefined>();
  const [savedSnippets, setSavedSnippets] = useState<{ [key: string]: string }>(
    {},
  );

  // Initialize sandbox on mount
  useEffect(() => {
    initializeSandbox();
  }, []);

  // Load initial template and saved snippets on mount only
  useEffect(() => {
    const initialLanguage: SupportedLanguage = 'javascript';
    const defaultTemplate = getDefaultTemplate(initialLanguage);
    setCode(defaultTemplate.code);
    setSelectedTemplateId(defaultTemplate.id);

    // Load saved snippets
    const saved = localStorage.getItem('secure-playground-snippets');
    if (saved) {
      setSavedSnippets(JSON.parse(saved));
    }
  }, []);

  // Handle shared code from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedCode = params.get('code');
    const sharedLang = params.get('lang') as SupportedLanguage | null;

    if (sharedCode) {
      setCode(decodeURIComponent(sharedCode));
      if (
        sharedLang &&
        ['javascript', 'typescript', 'python'].includes(sharedLang)
      ) {
        setLanguage(sharedLang);
      }
    }
  }, []);

  // Handle language change
  const handleLanguageChange = useCallback((newLanguage: SupportedLanguage) => {
    setLanguage(newLanguage);
    const defaultTemplate = getDefaultTemplate(newLanguage);
    setCode(defaultTemplate.code);
    setSelectedTemplateId(defaultTemplate.id);
    setOutputs([]);
    setStatus('idle');
    setExecutionTime(undefined);
  }, []);

  // Handle template change
  const handleTemplateChange = useCallback((template: CodeTemplate) => {
    setCode(template.code);
    setSelectedTemplateId(template.id);
    setOutputs([]);
    setStatus('idle');
  }, []);

  // Handle output
  const handleOutput = useCallback((output: ExecutionOutput) => {
    setOutputs((prev) => [...prev, output]);
  }, []);

  // Handle status change
  const handleStatusChange = useCallback((newStatus: ExecutionStatus) => {
    setStatus(newStatus);
  }, []);

  // Handle clear output
  const handleClearOutput = useCallback(() => {
    setOutputs([]);
    setStatus('idle');
    setExecutionTime(undefined);
  }, []);

  // Handle execution complete
  const handleExecutionComplete = useCallback((time: number) => {
    setExecutionTime(time);
  }, []);

  // Save snippet
  const saveSnippet = (name: string, snippetCode: string) => {
    const key = `${language}:${name}`;
    const updatedSnippets = {
      ...savedSnippets,
      [key]: snippetCode,
    };
    setSavedSnippets(updatedSnippets);
    localStorage.setItem(
      'secure-playground-snippets',
      JSON.stringify(updatedSnippets),
    );
  };

  // Load snippet
  const loadSnippet = (key: string) => {
    const snippetCode = savedSnippets[key];
    if (snippetCode) {
      setCode(snippetCode);
      // Try to detect language from key
      const [lang] = key.split(':');
      if (['javascript', 'typescript', 'python'].includes(lang)) {
        setLanguage(lang as SupportedLanguage);
      }
    }
  };

  // Delete snippet
  const deleteSnippet = (key: string) => {
    const { [key]: _removed, ...rest } = savedSnippets;
    void _removed; // Intentionally unused - we only need to remove the key
    setSavedSnippets(rest);
    localStorage.setItem('secure-playground-snippets', JSON.stringify(rest));
  };

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
                Secure Code Playground
              </CardTitle>
              <CardDescription className="mt-1">
                Execute code safely in an isolated sandbox environment
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="gap-1">
                <Shield className="h-3 w-3" />
                Sandboxed
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Zap className="h-3 w-3" />
                Real-time Output
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Clock className="h-3 w-3" />
                Resource Limited
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor Area */}
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle>Code Editor</CardTitle>
                <div className="flex flex-wrap gap-2">
                  <LanguageSelector
                    selectedLanguage={language}
                    onLanguageChange={handleLanguageChange}
                    disabled={isExecuting}
                  />
                  <EnhancedTemplateSelector
                    language={language}
                    selectedTemplateId={selectedTemplateId}
                    onTemplateChange={handleTemplateChange}
                    disabled={isExecuting}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <SecureCodeEditor
                code={code}
                setCode={setCode}
                language={language}
                isExecuting={isExecuting}
                setIsExecuting={setIsExecuting}
                onOutput={handleOutput}
                onStatusChange={handleStatusChange}
                onClearOutput={handleClearOutput}
                onExecutionComplete={handleExecutionComplete}
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
          <Tabs defaultValue="saved">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="saved">Saved Snippets</TabsTrigger>
              <TabsTrigger value="save">Save Code</TabsTrigger>
            </TabsList>
            <TabsContent value="saved">
              <Card>
                <CardContent className="pt-4">
                  {Object.keys(savedSnippets).length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No saved snippets yet. Save your code to access it later!
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-[300px] overflow-auto">
                      {Object.keys(savedSnippets).map((key) => {
                        const [lang, ...nameParts] = key.split(':');
                        const name = nameParts.join(':');
                        return (
                          <div
                            key={key}
                            className="flex items-center justify-between p-2 rounded border"
                          >
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {lang}
                              </Badge>
                              <span className="text-sm truncate max-w-[120px]">
                                {name}
                              </span>
                            </div>
                            <div className="flex gap-1">
                              <button
                                onClick={() => loadSnippet(key)}
                                className="text-xs text-blue-500 hover:underline"
                              >
                                Load
                              </button>
                              <button
                                onClick={() => deleteSnippet(key)}
                                className="text-xs text-red-500 hover:underline"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="save">
              <SaveCodeForm
                code={code}
                onSave={(name) => saveSnippet(name, code)}
              />
            </TabsContent>
          </Tabs>

          {/* Security Info */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Security Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>
                    Isolated execution environment (Web Workers / WebAssembly)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>No file system or network access</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>CPU and memory limits enforced</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>30-second execution timeout</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Input/output sanitization</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Rate limiting (60 executions/min)</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <DocumentationPanel />
        </div>
      </div>
    </div>
  );
}
