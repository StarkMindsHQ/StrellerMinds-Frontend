'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Highlighter, Book } from 'lucide-react';

interface Highlight {
  id: string;
  text: string;
  color: string;
  startOffset: number;
  endOffset: number;
  concept?: string;
}

interface InlineConceptHighlighterProps {
  content: string;
  onHighlightsChange?: (highlights: Highlight[]) => void;
  highlights?: Highlight[];
}

const HIGHLIGHT_COLORS = [
  { name: 'Yellow', value: '#fef08a', className: 'bg-yellow-100' },
  { name: 'Green', value: '#dcfce7', className: 'bg-green-100' },
  { name: 'Blue', value: '#dbeafe', className: 'bg-blue-100' },
  { name: 'Pink', value: '#fbcfe8', className: 'bg-pink-100' },
  { name: 'Purple', value: '#e9d5ff', className: 'bg-purple-100' },
];

const InlineConceptHighlighter: React.FC<InlineConceptHighlighterProps> = ({
  content,
  onHighlightsChange,
  highlights: initialHighlights = [],
}) => {
  const [highlights, setHighlights] = useState<Highlight[]>(initialHighlights);
  const [selectedColor, setSelectedColor] = useState(HIGHLIGHT_COLORS[0].value);
  const [conceptName, setConceptName] = useState('');
  const [showConceptInput, setShowConceptInput] = useState(false);
  const [pendingHighlight, setPendingHighlight] = useState<{ start: number; end: number } | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onHighlightsChange?.(highlights);
  }, [highlights, onHighlightsChange]);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.toString().length === 0) return;

    const selectedText = selection.toString();
    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(contentRef.current!);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    const start = preCaretRange.toString().length - selectedText.length;
    const end = start + selectedText.length;

    setPendingHighlight({ start, end });
    setShowConceptInput(true);
  };

  const confirmHighlight = () => {
    if (!pendingHighlight) return;

    const selectedText = content.substring(pendingHighlight.start, pendingHighlight.end);
    const newHighlight: Highlight = {
      id: Date.now().toString(),
      text: selectedText,
      color: selectedColor,
      startOffset: pendingHighlight.start,
      endOffset: pendingHighlight.end,
      concept: conceptName || undefined,
    };

    setHighlights([...highlights, newHighlight]);
    setPendingHighlight(null);
    setConceptName('');
    setShowConceptInput(false);
  };

  const removeHighlight = (id: string) => {
    setHighlights(highlights.filter((h) => h.id !== id));
  };

  const clearAllHighlights = () => {
    setHighlights([]);
  };

  const renderContent = () => {
    if (highlights.length === 0) {
      return content;
    }

    const sortedHighlights = [...highlights].sort((a, b) => a.startOffset - b.startOffset);
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    sortedHighlights.forEach((highlight, idx) => {
      if (highlight.startOffset > lastIndex) {
        parts.push(content.substring(lastIndex, highlight.startOffset));
      }

      const colorClass = HIGHLIGHT_COLORS.find((c) => c.value === highlight.color)?.className || 'bg-yellow-100';

      parts.push(
        <mark
          key={highlight.id}
          className={`${colorClass} cursor-pointer relative group px-1 rounded`}
          onClick={() => removeHighlight(highlight.id)}
          title="Click to remove highlight"
        >
          {content.substring(highlight.startOffset, highlight.endOffset)}
          {highlight.concept && (
            <span className="absolute -top-8 left-0 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10">
              {highlight.concept}
            </span>
          )}
        </mark>
      );

      lastIndex = highlight.endOffset;
    });

    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }

    return parts;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Highlighter className="h-5 w-5" />
            Highlight Key Concepts
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Select text in the content below to highlight key concepts and improve comprehension
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-3">
            <p className="text-sm font-medium">Highlight Color</p>
            <div className="flex gap-2 flex-wrap">
              {HIGHLIGHT_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setSelectedColor(color.value)}
                  className={`px-4 py-2 rounded border-2 transition-all ${color.className} ${
                    selectedColor === color.value ? 'border-gray-900' : 'border-gray-300'
                  }`}
                >
                  {color.name}
                </button>
              ))}
            </div>
          </div>

          <div
            ref={contentRef}
            onMouseUp={handleTextSelection}
            className="p-6 bg-gray-50 rounded-lg border-2 border-gray-200 leading-relaxed select-text cursor-text"
          >
            <p className="text-gray-900 whitespace-pre-wrap">{renderContent()}</p>
          </div>

          {showConceptInput && (
            <div className="p-4 border-2 border-blue-200 bg-blue-50 rounded-lg space-y-3">
              <div>
                <p className="text-sm font-medium mb-2">Highlighted Text: "{content.substring(pendingHighlight?.start || 0, pendingHighlight?.end || 0)}"</p>
                <input
                  type="text"
                  placeholder="Enter concept name (optional)"
                  value={conceptName}
                  onChange={(e) => setConceptName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={confirmHighlight} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Highlight
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setPendingHighlight(null);
                    setConceptName('');
                    setShowConceptInput(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Highlights ({highlights.length})</p>
              {highlights.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearAllHighlights} className="text-red-600">
                  Clear All
                </Button>
              )}
            </div>

            {highlights.length === 0 ? (
              <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
                <Book className="h-6 w-6 mx-auto mb-2 opacity-50" />
                <p>No highlights yet. Start highlighting key concepts!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {highlights.map((highlight) => {
                  const colorClass = HIGHLIGHT_COLORS.find((c) => c.value === highlight.color)?.className || 'bg-yellow-100';
                  return (
                    <div key={highlight.id} className={`p-3 rounded-lg ${colorClass} border flex items-start justify-between`}>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 break-words">"{highlight.text}"</p>
                        {highlight.concept && (
                          <Badge variant="secondary" className="mt-2">
                            {highlight.concept}
                          </Badge>
                        )}
                      </div>
                      <button
                        onClick={() => removeHighlight(highlight.id)}
                        className="ml-2 p-1 hover:bg-gray-300 rounded flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InlineConceptHighlighter;
