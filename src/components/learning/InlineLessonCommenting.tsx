'use client';

import React, { useState } from 'react';
import { Bell, MessageSquare, Pencil, Trash2, Flag } from 'lucide-react';
import { ReportModal } from '@/components/ReportModal';
import { ReportContentType } from '@/types/report';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface LessonNoteBlock {
  id: string;
  label: string;
  timestamp: string;
  body: string;
}

interface InlineComment {
  id: string;
  blockId: string;
  parentId?: string;
  author: string;
  text: string;
  createdAt: string;
}

interface ReplyNotification {
  id: string;
  blockLabel: string;
  actor: string;
  createdAt: string;
}

interface InlineLessonCommentingProps {
  lessonId: string;
  lessonTitle: string;
}

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

function buildLessonBlocks(lessonTitle: string): LessonNoteBlock[] {
  return [
    {
      id: 'opening',
      label: 'Opening concept',
      timestamp: '00:45',
      body: `${lessonTitle} starts by framing the core concept, the learner outcome, and the real-world scenario this lesson will keep referring back to.`,
    },
    {
      id: 'walkthrough',
      label: 'Key walkthrough',
      timestamp: '05:10',
      body:
        'This section breaks the process into a sequence of steps so students can pause, ask questions, and compare implementation choices with their peers.',
    },
    {
      id: 'takeaway',
      label: 'Final takeaway',
      timestamp: '09:35',
      body:
        'The closing summary highlights what should be retained, what deserves follow-up practice, and which prompts are worth discussing after the lesson.',
    },
  ];
}

const INITIAL_COMMENTS: InlineComment[] = [
  {
    id: 'comment-1',
    blockId: 'opening',
    author: 'Maya',
    text: 'This explanation is clear, but I would love a short glossary for the terms mentioned here.',
    createdAt: '2026-04-24T11:00:00.000Z',
  },
  {
    id: 'comment-2',
    blockId: 'opening',
    parentId: 'comment-1',
    author: 'You',
    text: 'Good call. I would pin a glossary card right below this section.',
    createdAt: '2026-04-24T11:12:00.000Z',
  },
  {
    id: 'comment-3',
    blockId: 'walkthrough',
    author: 'David',
    text: 'A timestamped code sample here would help connect the theory to the demo.',
    createdAt: '2026-04-24T12:20:00.000Z',
  },
];

export function InlineLessonCommenting({
  lessonId,
  lessonTitle,
}: InlineLessonCommentingProps) {
  const blocks = buildLessonBlocks(lessonTitle);
  const [comments, setComments] = useState<InlineComment[]>(INITIAL_COMMENTS);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingDraft, setEditingDraft] = useState('');
  const [notifications, setNotifications] = useState<ReplyNotification[]>([
    {
      id: 'notification-1',
      blockLabel: 'Opening concept',
      actor: 'Maya',
      createdAt: '2026-04-24T12:45:00.000Z',
    },
  ]);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportContentId, setReportContentId] = useState<string | null>(null);

  const deleteCommentWithReplies = (commentId: string) => {
    const relatedIds = new Set<string>([commentId]);
    let changed = true;

    while (changed) {
      changed = false;
      comments.forEach((comment) => {
        if (comment.parentId && relatedIds.has(comment.parentId)) {
          if (!relatedIds.has(comment.id)) {
            relatedIds.add(comment.id);
            changed = true;
          }
        }
      });
    }

    setComments((previous) =>
      previous.filter((comment) => !relatedIds.has(comment.id)),
    );
  };

  const handleAddComment = (blockId: string) => {
    const draft = drafts[blockId]?.trim();
    if (!draft) return;

    setComments((previous) => [
      ...previous,
      {
        id: createId(`comment-${lessonId}`),
        blockId,
        author: 'You',
        text: draft,
        createdAt: new Date().toISOString(),
      },
    ]);
    setDrafts((previous) => ({ ...previous, [blockId]: '' }));
  };

  const handleReply = (blockId: string, parentComment: InlineComment) => {
    const draft = replyDrafts[parentComment.id]?.trim();
    if (!draft) return;

    setComments((previous) => [
      ...previous,
      {
        id: createId(`reply-${lessonId}`),
        blockId,
        parentId: parentComment.id,
        author: 'You',
        text: draft,
        createdAt: new Date().toISOString(),
      },
    ]);
    setReplyDrafts((previous) => ({ ...previous, [parentComment.id]: '' }));

    if (parentComment.author !== 'You') {
      const blockLabel =
        blocks.find((block) => block.id === blockId)?.label || 'Lesson block';

      setNotifications((previous) => [
        {
          id: createId('notification'),
          blockLabel,
          actor: parentComment.author,
          createdAt: new Date().toISOString(),
        },
        ...previous,
      ]);
    }
  };

  const beginEdit = (comment: InlineComment) => {
    setEditingCommentId(comment.id);
    setEditingDraft(comment.text);
  };

  const saveEdit = (commentId: string) => {
    setComments((previous) =>
      previous.map((comment) =>
        comment.id === commentId ? { ...comment, text: editingDraft } : comment,
      ),
    );
    setEditingCommentId(null);
    setEditingDraft('');
  };

  const renderComment = (
    comment: InlineComment,
    blockId: string,
    depth = 0,
  ): React.ReactNode => {
    const replies = comments.filter((item) => item.parentId === comment.id);
    const isEditing = editingCommentId === comment.id;
    const canModify = comment.author === 'You';

    return (
      <div key={comment.id} className={depth > 0 ? 'ml-4 border-l pl-4' : ''}>
        <div className="rounded-2xl border bg-background p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">{comment.author}</span>
              <span className="text-xs text-muted-foreground">
                {relativeTime(comment.createdAt)}
              </span>
            </div>

            {canModify && (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1"
                  onClick={() => beginEdit(comment)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-destructive"
                    onClick={() => deleteCommentWithReplies(comment.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </Button>
                </div>
              )}

              {!canModify && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-muted-foreground hover:text-red-500"
                  onClick={() => {
                    setReportContentId(comment.id);
                    setReportModalOpen(true);
                  }}
                >
                  <Flag className="h-3.5 w-3.5" />
                  Report
                </Button>
              )}
            </div>

          {isEditing ? (
            <div className="mt-3 space-y-2">
              <Textarea
                value={editingDraft}
                onChange={(event) => setEditingDraft(event.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingCommentId(null);
                    setEditingDraft('');
                  }}
                >
                  Cancel
                </Button>
                <Button size="sm" onClick={() => saveEdit(comment.id)}>
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <p className="mt-3 text-sm leading-6 text-foreground/90">
              {comment.text}
            </p>
          )}

          <div className="mt-4 space-y-2">
            <Textarea
              value={replyDrafts[comment.id] || ''}
              onChange={(event) =>
                setReplyDrafts((previous) => ({
                  ...previous,
                  [comment.id]: event.target.value,
                }))
              }
              placeholder="Reply to this inline comment..."
              className="min-h-[90px]"
            />
            <div className="flex justify-end">
              <Button size="sm" onClick={() => handleReply(blockId, comment)}>
                Reply
              </Button>
            </div>
          </div>
        </div>

        {replies.length > 0 && (
          <div className="mt-3 space-y-3">
            {replies.map((reply) => renderComment(reply, blockId, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
      <Card className="border-0 shadow-sm lg:sticky lg:top-6 lg:h-fit">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Bell className="h-5 w-5 text-primary" />
            Reply Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-2xl bg-muted/40 p-4">
            <p className="text-sm font-medium">Inline lesson commenting</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Comments are attached to individual lesson blocks and surfaced
              inline so learners never lose context.
            </p>
          </div>

          <div className="space-y-3">
            {notifications.length === 0 ? (
              <p className="rounded-2xl border bg-background p-4 text-sm text-muted-foreground">
                No new reply notifications.
              </p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="rounded-2xl border bg-background p-4"
                >
                  <p className="text-sm font-medium">
                    {notification.actor} replied in {notification.blockLabel}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {relativeTime(notification.createdAt)}
                  </p>
                </div>
              ))
            )}
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => setNotifications([])}
          >
            Clear notifications
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-5">
        {blocks.map((block) => {
          const rootComments = comments.filter(
            (comment) =>
              comment.blockId === block.id && typeof comment.parentId === 'undefined',
          );

          return (
            <Card key={block.id} className="border-0 shadow-sm">
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-xl">{block.label}</CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {lessonTitle} • {block.timestamp}
                    </p>
                  </div>
                  <Badge variant="secondary" className="gap-1">
                    <MessageSquare className="h-3.5 w-3.5" />
                    {rootComments.length} inline comment
                    {rootComments.length === 1 ? '' : 's'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="rounded-2xl bg-muted/30 p-4 text-sm leading-6 text-foreground/85">
                  {block.body}
                </div>

                <div className="space-y-3">
                  {rootComments.map((comment) => renderComment(comment, block.id))}
                </div>

                <div className="rounded-2xl border border-dashed bg-background p-4">
                  <p className="text-sm font-medium">
                    Add an inline comment to this content block
                  </p>
                  <Textarea
                    value={drafts[block.id] || ''}
                    onChange={(event) =>
                      setDrafts((previous) => ({
                        ...previous,
                        [block.id]: event.target.value,
                      }))
                    }
                    placeholder="Ask a contextual question, leave a note, or suggest an edit..."
                    className="mt-3 min-h-[100px]"
                  />
                  <div className="mt-3 flex justify-end">
                    <Button onClick={() => handleAddComment(block.id)}>
                      Add comment
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <ReportModal
        contentType={ReportContentType.COMMENT}
        contentId={reportContentId || ''}
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        onSuccess={() => {
          toast.success("Thank you for your report. Our moderators will review it.");
        }}
      />
    </div>
  );
}
