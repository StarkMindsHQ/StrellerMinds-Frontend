'use client';

import { useState, useMemo } from 'react';
import {
  Search,
  CheckCircle,
  MessageSquare,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export interface QAAnswer {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
  isAccepted?: boolean;
}

export interface QAQuestion {
  id: string;
  authorName: string;
  title: string;
  content: string;
  createdAt: string;
  answers: QAAnswer[];
}

export interface MentorQAPanelProps {
  questions?: QAQuestion[];
  currentUser?: string;
  onPostQuestion?: (title: string, content: string) => void;
  onPostAnswer?: (questionId: string, content: string) => void;
  onAcceptAnswer?: (questionId: string, answerId: string) => void;
  className?: string;
}

export function MentorQAPanel({
  questions: initialQuestions = [],
  currentUser = 'You',
  onPostQuestion,
  onPostAnswer,
  onAcceptAnswer,
  className = '',
}: MentorQAPanelProps) {
  const [questions, setQuestions] = useState<QAQuestion[]>(initialQuestions);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [answerDrafts, setAnswerDrafts] = useState<Record<string, string>>({});

  const filtered = useMemo(
    () =>
      questions.filter(
        (q) =>
          q.title.toLowerCase().includes(search.toLowerCase()) ||
          q.content.toLowerCase().includes(search.toLowerCase()),
      ),
    [questions, search],
  );

  const handlePostQuestion = () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    const q: QAQuestion = {
      id: Date.now().toString(),
      authorName: currentUser,
      title: newTitle.trim(),
      content: newContent.trim(),
      createdAt: new Date().toISOString(),
      answers: [],
    };
    setQuestions((prev) => [q, ...prev]);
    onPostQuestion?.(newTitle.trim(), newContent.trim());
    setNewTitle('');
    setNewContent('');
    setShowForm(false);
  };

  const handlePostAnswer = (questionId: string) => {
    const content = answerDrafts[questionId]?.trim();
    if (!content) return;
    const answer: QAAnswer = {
      id: Date.now().toString(),
      authorName: currentUser,
      content,
      createdAt: new Date().toISOString(),
    };
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId ? { ...q, answers: [...q.answers, answer] } : q,
      ),
    );
    onPostAnswer?.(questionId, content);
    setAnswerDrafts((prev) => ({ ...prev, [questionId]: '' }));
  };

  const handleAccept = (questionId: string, answerId: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              answers: q.answers.map((a) => ({
                ...a,
                isAccepted: a.id === answerId,
              })),
            }
          : q,
      ),
    );
    onAcceptAnswer?.(questionId, answerId);
  };

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Mentor Q&amp;A
        </h2>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {showForm ? 'Cancel' : 'Ask a Question'}
        </button>
      </div>

      {/* Question form */}
      {showForm && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <input
            type="text"
            placeholder="Question title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          />
          <textarea
            placeholder="Describe your question..."
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            rows={3}
            className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          />
          <button
            type="button"
            onClick={handlePostQuestion}
            disabled={!newTitle.trim() || !newContent.trim()}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Post Question
          </button>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          placeholder="Search questions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
        />
      </div>

      {/* Questions list */}
      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
          No questions found.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {filtered.map((q) => {
            const isExpanded = expandedId === q.id;
            const accepted = q.answers.find((a) => a.isAccepted);
            return (
              <li
                key={q.id}
                className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900"
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : q.id)}
                  className="flex w-full items-start justify-between gap-3 p-4 text-left"
                  aria-expanded={isExpanded}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {accepted && (
                        <CheckCircle
                          className="h-4 w-4 shrink-0 text-green-500"
                          aria-label="Has accepted answer"
                        />
                      )}
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {q.title}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {q.authorName} ·{' '}
                      {new Date(q.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <MessageSquare className="h-4 w-4" />
                    {q.answers.length}
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-gray-100 px-4 pb-4 pt-3 dark:border-gray-700">
                    <p className="mb-4 text-sm text-gray-700 dark:text-gray-300">
                      {q.content}
                    </p>

                    {/* Answers */}
                    {q.answers.length > 0 && (
                      <ul className="mb-4 flex flex-col gap-3">
                        {q.answers.map((a) => (
                          <li
                            key={a.id}
                            className={`rounded-lg p-3 text-sm ${
                              a.isAccepted
                                ? 'border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                                : 'bg-gray-50 dark:bg-gray-800'
                            }`}
                          >
                            <div className="mb-1 flex items-center justify-between gap-2">
                              <span className="font-medium text-gray-800 dark:text-gray-200">
                                {a.authorName}
                                {a.isAccepted && (
                                  <span className="ml-2 text-xs text-green-600 dark:text-green-400">
                                    ✓ Accepted
                                  </span>
                                )}
                              </span>
                              {!a.isAccepted &&
                                q.authorName === currentUser && (
                                  <button
                                    type="button"
                                    onClick={() => handleAccept(q.id, a.id)}
                                    className="text-xs text-blue-600 hover:underline dark:text-blue-400"
                                  >
                                    Accept
                                  </button>
                                )}
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">
                              {a.content}
                            </p>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Answer form */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Write an answer..."
                        value={answerDrafts[q.id] ?? ''}
                        onChange={(e) =>
                          setAnswerDrafts((prev) => ({
                            ...prev,
                            [q.id]: e.target.value,
                          }))
                        }
                        onKeyDown={(e) =>
                          e.key === 'Enter' && handlePostAnswer(q.id)
                        }
                        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                      />
                      <button
                        type="button"
                        onClick={() => handlePostAnswer(q.id)}
                        disabled={!answerDrafts[q.id]?.trim()}
                        className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                      >
                        Answer
                      </button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
