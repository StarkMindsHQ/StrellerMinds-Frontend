'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Link,
  Image,
  Code,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
  Type,
  Palette,
  Highlighter,
  Table,
  Video,
  Minus,
  Check,
  X,
  ChevronDown,
  Maximize2,
  Minimize2,
  Eye,
  Code2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface RichTextEditorProps {
  initialContent?: string;
  onChange?: (content: string, plainText: string) => void;
  placeholder?: string;
  minHeight?: number;
  maxHeight?: number;
  readOnly?: boolean;
  className?: string;
  onImageUpload?: (file: File) => Promise<string>;
  onSave?: (content: string) => void;
  autoSave?: boolean;
}

const COLORS = [
  '#000000',
  '#434343',
  '#666666',
  '#999999',
  '#e60000',
  '#ff9900',
  '#ffff00',
  '#008a00',
  '#0066cc',
  '#9933ff',
  '#ff00ff',
  '#ffffff',
];

export function RichTextEditor({
  initialContent = '',
  onChange,
  placeholder = 'Start writing...',
  minHeight = 300,
  maxHeight = 600,
  readOnly = false,
  className = '',
  onImageUpload,
  onSave,
  autoSave = false,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState(initialContent);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'code'>('edit');
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const updateActiveFormats = useCallback(() => {
    const formats = new Set<string>();
    if (document.queryCommandState('bold')) formats.add('bold');
    if (document.queryCommandState('italic')) formats.add('italic');
    if (document.queryCommandState('underline')) formats.add('underline');
    setActiveFormats(formats);
  }, []);

  // Sync initial content once
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== initialContent) {
      editorRef.current.innerHTML = initialContent;
      setContent(initialContent);
    }
  }, [initialContent]);

  const handleContentChange = useCallback(() => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      const plainText = editorRef.current.innerText || '';

      // We update the state for other parts of the UI (status bar, preview)
      // but we avoid triggering a re-render of the editor div itself
      setContent(html);
      setWordCount(plainText.trim() ? plainText.trim().split(/\s+/).length : 0);
      setCharCount(plainText.length);
      onChange?.(html, plainText);
    }
  }, [onChange]);

  const execCommand = useCallback(
    (command: string, value?: string) => {
      document.execCommand(command, false, value);
      editorRef.current?.focus();
      updateActiveFormats();
      handleContentChange();
    },
    [updateActiveFormats, handleContentChange],
  );

  useEffect(() => {
    if (!autoSave || !onSave) return;
    const timer = setInterval(() => {
      if (content) {
        onSave(content);
        setLastSaved(new Date());
      }
    }, 30000);
    return () => clearInterval(timer);
  }, [autoSave, content, onSave]);

  const insertLink = useCallback(() => {
    if (linkUrl) {
      execCommand('createLink', linkUrl);
      setLinkUrl('');
      setShowLinkModal(false);
    }
  }, [linkUrl, execCommand]);

  const handleImageUpload = useCallback(async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const url = onImageUpload
          ? await onImageUpload(file)
          : URL.createObjectURL(file);
        execCommand('insertImage', url);
      }
    };
    input.click();
  }, [onImageUpload, execCommand]);

  const ToolbarBtn = ({
    icon,
    command,
    value,
    tooltip,
    active,
  }: {
    icon: React.ReactNode;
    command: string;
    value?: string;
    tooltip: string;
    active?: boolean;
  }) => (
    <button
      type="button"
      className={`p-2 rounded-md transition-all hover:bg-primary/10 ${active || activeFormats.has(command) ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}`}
      onClick={() => execCommand(command, value)}
      title={tooltip}
      disabled={readOnly}
    >
      {icon}
    </button>
  );

  return (
    <div
      className={`rich-text-editor border rounded-xl overflow-hidden bg-card shadow-lg ${isFullscreen ? 'fixed inset-4 z-50' : ''} ${className}`}
    >
      {/* Toolbar */}
      <div className="toolbar border-b bg-gradient-to-r from-muted/50 to-muted/30 p-2 flex flex-wrap gap-1 items-center">
        <div className="flex items-center gap-0.5 pr-2 border-r">
          <ToolbarBtn icon={<Undo size={18} />} command="undo" tooltip="Undo" />
          <ToolbarBtn icon={<Redo size={18} />} command="redo" tooltip="Redo" />
        </div>
        <div className="flex items-center gap-0.5 px-2 border-r">
          <ToolbarBtn icon={<Bold size={18} />} command="bold" tooltip="Bold" />
          <ToolbarBtn
            icon={<Italic size={18} />}
            command="italic"
            tooltip="Italic"
          />
          <ToolbarBtn
            icon={<Underline size={18} />}
            command="underline"
            tooltip="Underline"
          />
          <ToolbarBtn
            icon={<Strikethrough size={18} />}
            command="strikeThrough"
            tooltip="Strikethrough"
          />
        </div>
        <div className="flex items-center gap-0.5 px-2 border-r">
          <ToolbarBtn
            icon={<Heading1 size={18} />}
            command="formatBlock"
            value="h1"
            tooltip="Heading 1"
          />
          <ToolbarBtn
            icon={<Heading2 size={18} />}
            command="formatBlock"
            value="h2"
            tooltip="Heading 2"
          />
          <ToolbarBtn
            icon={<Heading3 size={18} />}
            command="formatBlock"
            value="h3"
            tooltip="Heading 3"
          />
        </div>
        <div className="flex items-center gap-0.5 px-2 border-r">
          <ToolbarBtn
            icon={<AlignLeft size={18} />}
            command="justifyLeft"
            tooltip="Left"
          />
          <ToolbarBtn
            icon={<AlignCenter size={18} />}
            command="justifyCenter"
            tooltip="Center"
          />
          <ToolbarBtn
            icon={<AlignRight size={18} />}
            command="justifyRight"
            tooltip="Right"
          />
        </div>
        <div className="flex items-center gap-0.5 px-2 border-r">
          <ToolbarBtn
            icon={<List size={18} />}
            command="insertUnorderedList"
            tooltip="Bullets"
          />
          <ToolbarBtn
            icon={<ListOrdered size={18} />}
            command="insertOrderedList"
            tooltip="Numbers"
          />
        </div>
        <div className="flex items-center gap-0.5 px-2 border-r">
          <button
            className="p-2 rounded-md hover:bg-muted/80 text-muted-foreground"
            onClick={() => setShowLinkModal(true)}
            title="Link"
          >
            <Link size={18} />
          </button>
          <button
            className="p-2 rounded-md hover:bg-muted/80 text-muted-foreground"
            onClick={handleImageUpload}
            title="Image"
          >
            <Image size={18} />
          </button>
          <button
            className="p-2 rounded-md hover:bg-muted/80 text-muted-foreground"
            onClick={() => execCommand('formatBlock', 'pre')}
            title="Code"
          >
            <Code size={18} />
          </button>
          <button
            className="p-2 rounded-md hover:bg-muted/80 text-muted-foreground"
            onClick={() => execCommand('formatBlock', 'blockquote')}
            title="Quote"
          >
            <Quote size={18} />
          </button>
        </div>
        <div className="flex items-center gap-0.5 ml-auto">
          <button
            className={`p-2 rounded-md ${viewMode === 'edit' ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}`}
            onClick={() => setViewMode('edit')}
            title="Edit"
          >
            <Type size={18} />
          </button>
          <button
            className={`p-2 rounded-md ${viewMode === 'preview' ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}`}
            onClick={() => setViewMode('preview')}
            title="Preview"
          >
            <Eye size={18} />
          </button>
          <button
            className={`p-2 rounded-md ${viewMode === 'code' ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}`}
            onClick={() => setViewMode('code')}
            title="HTML"
          >
            <Code2 size={18} />
          </button>
          <button
            className="p-2 rounded-md text-muted-foreground ml-2"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title="Fullscreen"
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
      </div>

      {/* Editor */}
      <div
        style={{
          minHeight: isFullscreen ? 'calc(100vh - 150px)' : minHeight,
          maxHeight: isFullscreen ? 'none' : maxHeight,
        }}
      >
        {viewMode === 'edit' && (
          <div
            ref={editorRef}
            className="w-full h-full p-6 outline-none overflow-y-auto prose max-w-none dark:prose-invert"
            contentEditable={!readOnly}
            onInput={handleContentChange}
            onSelect={updateActiveFormats}
            style={{ minHeight }}
            suppressContentEditableWarning
          />
        )}
        {viewMode === 'preview' && (
          <div
            className="p-6 prose max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
        {viewMode === 'code' && (
          <textarea
            className="w-full h-full p-6 font-mono text-sm bg-muted/30"
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              if (editorRef.current)
                editorRef.current.innerHTML = e.target.value;
              onChange?.(e.target.value, '');
            }}
            style={{ minHeight }}
          />
        )}
      </div>

      {/* Status */}
      <div className="border-t bg-muted/30 px-4 py-2 flex justify-between text-sm text-muted-foreground">
        <span>
          {wordCount} words · {charCount} chars
        </span>
        {lastSaved && <span>Saved: {lastSaved.toLocaleTimeString()}</span>}
      </div>

      {/* Link Modal */}
      <AnimatePresence>
        {showLinkModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowLinkModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-card p-6 rounded-xl shadow-2xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">Insert Link</h3>
              <Input
                type="url"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="mb-4"
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowLinkModal(false)}
                >
                  <X size={16} className="mr-1" />
                  Cancel
                </Button>
                <Button onClick={insertLink} disabled={!linkUrl}>
                  <Check size={16} className="mr-1" />
                  Insert
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default RichTextEditor;
