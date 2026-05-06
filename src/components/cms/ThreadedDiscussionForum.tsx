'use client';

import React, { useMemo, useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  MessageSquare,
  Pin,
  PinOff,
  Plus,
  ThumbsUp,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

type SortMode = 'new' | 'top';

interface ForumThread {
  id: string;
  author: string;
  role: string;
  body: string;
  createdAt: string;
  likes: number;
  replies: ForumThread[];
}

const ROOT_POSTS_PER_PAGE = 2;

const INITIAL_THREADS: ForumThread[] = [
  {
    id: 'thread-1',
    author: 'Maya Okafor',
    role: 'Student',
    body:
      'How are you all structuring the drag-and-drop quiz experience so instructors can preview the order before publishing?',
    createdAt: '2026-04-24T08:30:00.000Z',
    likes: 18,
    replies: [
      {
        id: 'reply-1',
        author: 'Victor Grant',
        role: 'Instructor',
        body:
          'I keep a staging list and a learner preview side by side. It helps catch gaps before the quiz goes live.',
        createdAt: '2026-04-24T09:00:00.000Z',
        likes: 9,
        replies: [
          {
            id: 'reply-2',
            author: 'You',
            role: 'Mentor',
            body:
              'That preview pattern is exactly what we are using in the editor tab now. It makes ordering changes much safer.',
            createdAt: '2026-04-24T09:40:00.000Z',
            likes: 4,
            replies: [],
          },
        ],
      },
    ],
  },
  {
    id: 'thread-2',
    author: 'Aisha Bello',
    role: 'Student',
    body:
      'Would anyone want a rubric template for the peer-review assignment? I made one for smart contract audits.',
    createdAt: '2026-04-23T18:15:00.000Z',
    likes: 26,
    replies: [
      {
        id: 'reply-3',
        author: 'Daniel Marks',
        role: 'Reviewer',
        body:
          'Yes please. A rubric with accuracy, explanation, and remediation quality would be especially useful.',
        createdAt: '2026-04-23T19:10:00.000Z',
        likes: 11,
        replies: [],
      },
    ],
  },
  {
    id: 'thread-3',
    author: 'Jonah Smith',
    role: 'Student',
    body:
      'For inline lesson comments, are you anchoring notes to timestamps or to content blocks beneath the player?',
    createdAt: '2026-04-22T15:50:00.000Z',
    likes: 12,
    replies: [],
  },
];

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function relativeTime(value: string) {
  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.max(1, Math.floor(diff / 60000));

  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  return `${Math.floor(hours / 24)}d ago`;
}

function countReplies(thread: ForumThread): number {
  return thread.replies.reduce(
    (total, reply) => total + 1 + countReplies(reply),
    0,
  );
}

function scoreThread(thread: ForumThread): number {
  return thread.likes + countReplies(thread) * 2;
}

function insertReply(
  threads: ForumThread[],
  parentId: string,
  reply: ForumThread,
): ForumThread[] {
  return threads.map((thread) => {
    if (thread.id === parentId) {
      return {
        ...thread,
        replies: [...thread.replies, reply],
      };
    }

    return {
      ...thread,
      replies: insertReply(thread.replies, parentId, reply),
    };
  });
}

export function ThreadedDiscussionForum() {
  const { role } = useAuth();
  const isAdmin = role === 'admin';

  const [threads, setThreads] = useState(INITIAL_THREADS);
  const [sortMode, setSortMode] = useState<SortMode>('new');
  const [page, setPage] = useState(1);
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());
  const [pinnedThreadIds, setPinnedThreadIds] = useState<Set<string>>(new Set());
  const [newThreadBody, setNewThreadBody] = useState('');
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});

  const sortedThreads = useMemo(() => {
    return [...threads].sort((left, right) => {
      if (sortMode === 'top') {
        return scoreThread(right) - scoreThread(left);
      }

      return (
        new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
      );
    });
  }, [sortMode, threads]);

  const pinnedThreads = useMemo(
    () => sortedThreads.filter((thread) => pinnedThreadIds.has(thread.id)),
    [pinnedThreadIds, sortedThreads],
  );

  const unpinnedThreads = useMemo(
    () => sortedThreads.filter((thread) => !pinnedThreadIds.has(thread.id)),
    [pinnedThreadIds, sortedThreads],
  );

  const totalPages = Math.max(
    1,
    Math.ceil(unpinnedThreads.length / ROOT_POSTS_PER_PAGE),
  );
  const currentPage = Math.min(page, totalPages);
  const paginatedThreads = unpinnedThreads.slice(
    (currentPage - 1) * ROOT_POSTS_PER_PAGE,
    currentPage * ROOT_POSTS_PER_PAGE,
  );

  const toggleThread = (threadId: string) => {
    setCollapsedIds((previous) => {
      const next = new Set(previous);
      if (next.has(threadId)) next.delete(threadId);
      else next.add(threadId);
      return next;
    });
  };

  const togglePinnedThread = (threadId: string) => {
    setPinnedThreadIds((previous) => {
      const next = new Set(previous);
      if (next.has(threadId)) next.delete(threadId);
      else next.add(threadId);
      return next;
    });
  };

  const handleCreateThread = () => {
    if (!newThreadBody.trim()) return;

    setThreads((previous) => [
      {
        id: createId('thread'),
        author: 'You',
        role: 'Mentor',
        body: newThreadBody.trim(),
        createdAt: new Date().toISOString(),
        likes: 0,
        replies: [],
      },
      ...previous,
    ]);
    setNewThreadBody('');
    setPage(1);
  };

  const handleReply = (threadId: string) => {
    const draft = replyDrafts[threadId]?.trim();
    if (!draft) return;

    setThreads((previous) =>
      insertReply(previous, threadId, {
        id: createId('reply'),
        author: 'You',
        role: 'Mentor',
        body: draft,
        createdAt: new Date().toISOString(),
        likes: 0,
        replies: [],
      }),
    );
    setReplyDrafts((previous) => ({ ...previous, [threadId]: '' }));
    setCollapsedIds((previous) => {
      const next = new Set(previous);
      next.delete(threadId);
      return next;
    });
  };

  const renderThread = (thread: ForumThread, depth = 0): React.ReactNode => {
    const isCollapsed = collapsedIds.has(thread.id);
    const totalReplies = countReplies(thread);
    const isRootThread = depth === 0;
    const isPinned = isRootThread && pinnedThreadIds.has(thread.id);

    return (
      <div key={thread.id} className={depth > 0 ? 'ml-4 border-l pl-4' : ''}>
        <div className="rounded-2xl border bg-background p-4 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold">{thread.author}</span>
                <Badge variant="secondary" className="font-normal">
                  {thread.role}
                </Badge>
                {isPinned ? (
                  <Badge variant="outline" className="font-normal">
                    Pinned
                  </Badge>
                ) : null}
                <span className="text-xs text-muted-foreground">
                  {relativeTime(thread.createdAt)}
                </span>
              </div>
              <p className="text-sm leading-6 text-foreground/90">
                {thread.body}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <ThumbsUp className="h-3.5 w-3.5" />
                {thread.likes}
              </span>
              {isRootThread && isAdmin ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1"
                  onClick={() => togglePinnedThread(thread.id)}
                >
                  {isPinned ? (
                    <PinOff className="h-4 w-4" />
                  ) : (
                    <Pin className="h-4 w-4" />
                  )}
                  {isPinned ? 'Unpin' : 'Pin'}
                </Button>
              ) : null}
              {totalReplies > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1"
                  onClick={() => toggleThread(thread.id)}
                >
                  {isCollapsed ? (
                    <ChevronRight className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                  {totalReplies} repl{totalReplies === 1 ? 'y' : 'ies'}
                </Button>
              )}
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <Textarea
              value={replyDrafts[thread.id] || ''}
              onChange={(event) =>
                setReplyDrafts((previous) => ({
                  ...previous,
                  [thread.id]: event.target.value,
                }))
              }
              placeholder="Reply to this discussion thread..."
              className="min-h-[92px]"
            />
            <div className="flex justify-end">
              <Button size="sm" onClick={() => handleReply(thread.id)}>
                Reply
              </Button>
            </div>
          </div>
        </div>

        {!isCollapsed && thread.replies.length > 0 && (
          <div className="mt-3 space-y-3">
            {thread.replies.map((reply) => renderThread(reply, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
      <Card className="border-0 shadow-sm lg:sticky lg:top-6 lg:h-fit">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <MessageSquare className="h-5 w-5 text-primary" />
            Forum Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="rounded-2xl bg-muted/40 p-4">
            <p className="text-sm font-medium">Sorting and pagination</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Switch between newest activity and top-performing threads, then
              page through the root discussions without flattening replies.
            </p>
          </div>

          <Tabs
            value={sortMode}
            onValueChange={(value) => {
              setSortMode(value as SortMode);
              setPage(1);
            }}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="new">Newest</TabsTrigger>
              <TabsTrigger value="top">Top</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl border bg-background p-3 text-center">
              <p className="text-2xl font-bold">{threads.length}</p>
              <p className="text-xs text-muted-foreground">Root threads</p>
            </div>
            <div className="rounded-2xl border bg-background p-3 text-center">
              <p className="text-2xl font-bold">
                {threads.reduce((total, thread) => total + countReplies(thread), 0)}
              </p>
              <p className="text-xs text-muted-foreground">Nested replies</p>
            </div>
            <div className="rounded-2xl border bg-background p-3 text-center">
              <p className="text-2xl font-bold">{totalPages}</p>
              <p className="text-xs text-muted-foreground">Pages</p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">Start a new discussion</p>
            <Textarea
              value={newThreadBody}
              onChange={(event) => setNewThreadBody(event.target.value)}
              placeholder="Share a prompt, blocker, or lesson insight..."
              className="min-h-[120px]"
            />
            <Button className="w-full gap-2" onClick={handleCreateThread}>
              <Plus className="h-4 w-4" />
              Post discussion
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader className="border-b bg-card">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-xl">
                Threaded Discussion Forum
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Nested replies, expand and collapse controls, page-based root
                threads, and sort modes for active conversations.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setPage((previous) => Math.max(1, previous - 1))}
              >
                Previous
              </Button>
              <div className="rounded-full border px-3 py-1 text-sm">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setPage((previous) => Math.min(totalPages, previous + 1))
                }
              >
                Next
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[780px]">
            {pinnedThreads.length > 0 ? (
              <div className="space-y-4 border-b bg-muted/10 p-6">
                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                  <Pin className="h-4 w-4" />
                  Pinned discussions
                </div>
                {pinnedThreads.map((thread) => renderThread(thread))}
              </div>
            ) : null}

            <div className="space-y-4 p-6">
              {paginatedThreads.map((thread) => renderThread(thread))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
