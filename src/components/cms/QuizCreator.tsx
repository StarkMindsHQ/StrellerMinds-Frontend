'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  Plus,
  GripVertical,
  Trash2,
  CheckCircle2,
  Circle,
  Save,
  X,
  Check,
  Type,
  AlignLeft,
  FileCode,
  CheckSquare,
  ArrowUpDown,
  Puzzle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import type { Quiz, Question, QuestionType, QuestionOption } from '@/types/cms';

interface QuizCreatorProps {
  quiz: Quiz;
  onUpdate: (quiz: Quiz) => void;
  onSave?: (quiz: Quiz) => void;
}

const QUESTION_TYPES: {
  type: QuestionType;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    type: 'multiple_choice',
    label: 'Multiple Choice',
    icon: <Circle size={16} />,
  },
  {
    type: 'multiple_select',
    label: 'Multiple Select',
    icon: <CheckSquare size={16} />,
  },
  {
    type: 'true_false',
    label: 'True / False',
    icon: <CheckCircle2 size={16} />,
  },
  { type: 'short_answer', label: 'Short Answer', icon: <Type size={16} /> },
  { type: 'long_answer', label: 'Long Answer', icon: <AlignLeft size={16} /> },
  { type: 'fill_blank', label: 'Fill in the Blank', icon: <Type size={16} /> },
  { type: 'matching', label: 'Matching', icon: <Puzzle size={16} /> },
  { type: 'ordering', label: 'Ordering', icon: <ArrowUpDown size={16} /> },
  { type: 'code', label: 'Code Solution', icon: <FileCode size={16} /> },
];

function createQuestionTemplate(
  type: QuestionType,
  order: number,
  quizId: string,
): Question {
  const baseQuestion: Question = {
    id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    quizId,
    type,
    order,
    question: '',
    points: 1,
    required: true,
  };

  if (type.includes('multiple') || type === 'true_false') {
    return {
      ...baseQuestion,
      options: [
        {
          id: 'opt-1',
          text: type === 'true_false' ? 'True' : 'Option 1',
          isCorrect: type === 'true_false',
        },
        {
          id: 'opt-2',
          text: type === 'true_false' ? 'False' : 'Option 2',
          isCorrect: false,
        },
      ],
    };
  }

  if (type === 'fill_blank') {
    return {
      ...baseQuestion,
      blanks: [
        {
          id: 'blank-1',
          placeholder: 'Primary answer',
          acceptedAnswers: [''],
          caseSensitive: false,
        },
      ],
    };
  }

  if (type === 'matching') {
    return {
      ...baseQuestion,
      matchingPairs: [
        {
          id: 'pair-1',
          left: 'Concept',
          right: 'Definition',
        },
      ],
    };
  }

  if (type === 'ordering') {
    return {
      ...baseQuestion,
      orderingItems: [
        {
          id: 'order-1',
          text: 'First step',
          correctPosition: 1,
        },
      ],
    };
  }

  return baseQuestion;
}

function normalizeQuestionForType(
  question: Question,
  type: QuestionType,
): Question {
  const template = createQuestionTemplate(type, question.order, question.quizId);

  return {
    ...question,
    type,
    options: template.options,
    blanks: template.blanks,
    matchingPairs: template.matchingPairs,
    orderingItems: template.orderingItems,
  };
}

export function QuizCreator({ quiz, onUpdate, onSave }: QuizCreatorProps) {
  const [activeTab, setActiveTab] = useState<
    'questions' | 'settings' | 'preview'
  >('questions');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(
    null,
  );

  const addQuestion = (type: QuestionType) => {
    const newQuestion = createQuestionTemplate(type, quiz.questions.length, quiz.id);

    onUpdate({
      ...quiz,
      questions: [...quiz.questions, newQuestion],
    });
    setExpandedQuestionId(newQuestion.id);
  };

  const removeQuestion = (id: string) => {
    onUpdate({
      ...quiz,
      questions: quiz.questions.filter((q) => q.id !== id),
    });
  };

  const updateQuestion = (id: string, data: Partial<Question> | Question) => {
    onUpdate({
      ...quiz,
      questions: quiz.questions.map((q) =>
        q.id === id ? { ...q, ...data } : q,
      ),
    });
  };

  const addOption = (questionId: string) => {
    const question = quiz.questions.find((q) => q.id === questionId);
    if (!question || !question.options) return;

    const newOption: QuestionOption = {
      id: `opt-${Date.now()}`,
      text: `Option ${question.options.length + 1}`,
      isCorrect: false,
    };

    updateQuestion(questionId, {
      options: [...question.options, newOption],
    });
  };

  const removeOption = (questionId: string, optionId: string) => {
    const question = quiz.questions.find((q) => q.id === questionId);
    if (!question || !question.options) return;

    updateQuestion(questionId, {
      options: question.options.filter((o) => o.id !== optionId),
    });
  };

  const updateOption = (
    questionId: string,
    optionId: string,
    data: Partial<QuestionOption>,
  ) => {
    const question = quiz.questions.find((q) => q.id === questionId);
    if (!question || !question.options) return;

    let nextOptions = question.options.map((option) =>
      option.id === optionId ? { ...option, ...data } : option,
    );

    if (question.type === 'multiple_choice' && data.isCorrect) {
      nextOptions = nextOptions.map((option) =>
        option.id === optionId ? option : { ...option, isCorrect: false },
      );
    }

    updateQuestion(questionId, { options: nextOptions });
  };

  const reorderQuestions = (newQuestions: Question[]) => {
    onUpdate({
      ...quiz,
      questions: newQuestions.map((question, index) => ({
        ...question,
        order: index,
      })),
    });
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b bg-muted/20 px-6 py-4">
        <div className="flex rounded-lg bg-muted p-1">
          <button
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'questions' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab('questions')}
          >
            Questions ({quiz.questions.length})
          </button>
          <button
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'settings' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab('settings')}
          >
            Quiz Settings
          </button>
          <button
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'preview' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab('preview')}
          >
            Preview
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast('Draft saved')}
          >
            <Save className="mr-2 h-4 w-4" /> Save Draft
          </Button>
          <Button size="sm" onClick={() => onSave?.(quiz)}>
            <Check className="mr-2 h-4 w-4" /> Publish Quiz
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'questions' ? (
          <div className="mx-auto max-w-4xl space-y-6 p-6">
            <Reorder.Group
              axis="y"
              values={quiz.questions}
              onReorder={reorderQuestions}
              className="space-y-4"
            >
              {quiz.questions.map((question, index) => (
                <Reorder.Item
                  key={question.id}
                  value={question}
                  className={`overflow-hidden rounded-xl border bg-background transition-all ${expandedQuestionId === question.id ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                >
                  <div
                    className="flex cursor-pointer items-center gap-4 p-4 hover:bg-muted/30"
                    onClick={() =>
                      setExpandedQuestionId(
                        expandedQuestionId === question.id ? null : question.id,
                      )
                    }
                  >
                    <div className="cursor-grab text-muted-foreground active:cursor-grabbing">
                      <GripVertical size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="text-xs font-bold uppercase text-primary/70">
                          Question {index + 1}
                        </span>
                        <span className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                          {
                            QUESTION_TYPES.find((item) => item.type === question.type)
                              ?.label
                          }
                        </span>
                      </div>
                      <p className="truncate font-medium">
                        {question.question || (
                          <span className="italic text-muted-foreground">
                            No question text yet...
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-muted-foreground">
                        {question.points} pt{question.points !== 1 ? 's' : ''}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={(event) => {
                          event.stopPropagation();
                          removeQuestion(question.id);
                        }}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedQuestionId === question.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="space-y-6 border-t bg-muted/10 p-6"
                      >
                        <div className="space-y-4">
                          <div className="flex gap-4">
                            <div className="flex-1 space-y-2">
                              <Label>Question Text</Label>
                              <Textarea
                                placeholder="Enter your question here..."
                                value={question.question}
                                onChange={(event) =>
                                  updateQuestion(question.id, {
                                    question: event.target.value,
                                  })
                                }
                                className="min-h-[100px]"
                              />
                            </div>
                            <div className="w-[200px] space-y-4">
                              <div className="space-y-2">
                                <Label>Question Type</Label>
                                <Select
                                  value={question.type}
                                  onValueChange={(value: QuestionType) =>
                                    updateQuestion(
                                      question.id,
                                      normalizeQuestionForType(question, value),
                                    )
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {QUESTION_TYPES.map((item) => (
                                      <SelectItem key={item.type} value={item.type}>
                                        <div className="flex items-center gap-2">
                                          {item.icon} {item.label}
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label>Points</Label>
                                <Input
                                  type="number"
                                  value={question.points}
                                  onChange={(event) =>
                                    updateQuestion(question.id, {
                                      points:
                                        Number.parseInt(event.target.value, 10) || 0,
                                    })
                                  }
                                />
                              </div>
                            </div>
                          </div>

                          {(question.type.includes('multiple') ||
                            question.type === 'true_false') && (
                            <div className="space-y-3">
                              <Label>Options</Label>
                              <div className="space-y-2">
                                {question.options?.map((option) => (
                                  <div
                                    key={option.id}
                                    className="flex items-center gap-3"
                                  >
                                    <button
                                      className={`
                                        flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all
                                        ${option.isCorrect ? 'border-green-500 bg-green-500 text-white' : 'border-muted-foreground/30 hover:border-primary'}
                                      `}
                                      onClick={() =>
                                        updateOption(question.id, option.id, {
                                          isCorrect: !option.isCorrect,
                                        })
                                      }
                                    >
                                      {option.isCorrect && <Check size={14} />}
                                    </button>
                                    <Input
                                      value={option.text}
                                      onChange={(event) =>
                                        updateOption(question.id, option.id, {
                                          text: event.target.value,
                                        })
                                      }
                                      className="h-9"
                                      disabled={question.type === 'true_false'}
                                    />
                                    {question.type !== 'true_false' && (
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9 text-destructive"
                                        onClick={() =>
                                          removeOption(question.id, option.id)
                                        }
                                      >
                                        <X size={16} />
                                      </Button>
                                    )}
                                  </div>
                                ))}
                                {question.type !== 'true_false' && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full border-dashed"
                                    onClick={() => addOption(question.id)}
                                  >
                                    <Plus className="mr-2 h-4 w-4" /> Add Option
                                  </Button>
                                )}
                              </div>
                            </div>
                          )}

                          {question.type === 'fill_blank' && (
                            <div className="space-y-3">
                              <Label>Accepted Answers</Label>
                              {question.blanks?.map((blank) => (
                                <div
                                  key={blank.id}
                                  className="grid gap-3 rounded-2xl border bg-background p-4 md:grid-cols-2"
                                >
                                  <Input
                                    value={blank.placeholder}
                                    onChange={(event) =>
                                      updateQuestion(question.id, {
                                        blanks: question.blanks?.map((item) =>
                                          item.id === blank.id
                                            ? {
                                                ...item,
                                                placeholder: event.target.value,
                                              }
                                            : item,
                                        ),
                                      })
                                    }
                                    placeholder="Blank label"
                                  />
                                  <Input
                                    value={blank.acceptedAnswers.join(', ')}
                                    onChange={(event) =>
                                      updateQuestion(question.id, {
                                        blanks: question.blanks?.map((item) =>
                                          item.id === blank.id
                                            ? {
                                                ...item,
                                                acceptedAnswers: event.target.value
                                                  .split(',')
                                                  .map((value) => value.trim())
                                                  .filter(Boolean),
                                              }
                                            : item,
                                        ),
                                      })
                                    }
                                    placeholder="comma separated accepted answers"
                                  />
                                </div>
                              ))}
                            </div>
                          )}

                          {question.type === 'matching' && (
                            <div className="space-y-3">
                              <Label>Matching Pairs</Label>
                              {question.matchingPairs?.map((pair) => (
                                <div
                                  key={pair.id}
                                  className="grid gap-3 rounded-2xl border bg-background p-4 md:grid-cols-2"
                                >
                                  <Input
                                    value={pair.left}
                                    onChange={(event) =>
                                      updateQuestion(question.id, {
                                        matchingPairs: question.matchingPairs?.map(
                                          (item) =>
                                            item.id === pair.id
                                              ? {
                                                  ...item,
                                                  left: event.target.value,
                                                }
                                              : item,
                                        ),
                                      })
                                    }
                                    placeholder="Prompt"
                                  />
                                  <Input
                                    value={pair.right}
                                    onChange={(event) =>
                                      updateQuestion(question.id, {
                                        matchingPairs: question.matchingPairs?.map(
                                          (item) =>
                                            item.id === pair.id
                                              ? {
                                                  ...item,
                                                  right: event.target.value,
                                                }
                                              : item,
                                        ),
                                      })
                                    }
                                    placeholder="Match"
                                  />
                                </div>
                              ))}
                            </div>
                          )}

                          {question.type === 'ordering' && (
                            <div className="space-y-3">
                              <Label>Ordering Items</Label>
                              {question.orderingItems?.map((item) => (
                                <div
                                  key={item.id}
                                  className="grid gap-3 rounded-2xl border bg-background p-4 md:grid-cols-[1fr_120px]"
                                >
                                  <Input
                                    value={item.text}
                                    onChange={(event) =>
                                      updateQuestion(question.id, {
                                        orderingItems: question.orderingItems?.map(
                                          (entry) =>
                                            entry.id === item.id
                                              ? {
                                                  ...entry,
                                                  text: event.target.value,
                                                }
                                              : entry,
                                        ),
                                      })
                                    }
                                    placeholder="Step text"
                                  />
                                  <Input
                                    type="number"
                                    min={1}
                                    value={item.correctPosition}
                                    onChange={(event) =>
                                      updateQuestion(question.id, {
                                        orderingItems: question.orderingItems?.map(
                                          (entry) =>
                                            entry.id === item.id
                                              ? {
                                                  ...entry,
                                                  correctPosition:
                                                    Number.parseInt(
                                                      event.target.value,
                                                      10,
                                                    ) || 1,
                                                }
                                              : entry,
                                        ),
                                      })
                                    }
                                  />
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="space-y-2">
                            <Label>Extra Feedback (Optional)</Label>
                            <Input
                              placeholder="Explanation for correct answer..."
                              value={question.explanation || ''}
                              onChange={(event) =>
                                updateQuestion(question.id, {
                                  explanation: event.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Reorder.Item>
              ))}
            </Reorder.Group>

            <div className="flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed bg-muted/10 py-8">
              <p className="text-sm font-medium text-muted-foreground">
                Add new question
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {QUESTION_TYPES.map((item) => (
                  <Button
                    key={item.type}
                    variant="secondary"
                    size="sm"
                    className="gap-2"
                    onClick={() => addQuestion(item.type)}
                  >
                    {item.icon} {item.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        ) : activeTab === 'settings' ? (
          <div className="mx-auto max-w-2xl space-y-8 p-8">
            <div className="space-y-6">
              <h3 className="text-lg font-bold">Quiz Rules</h3>
              <div className="grid gap-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Shuffle Questions</Label>
                    <p className="text-xs text-muted-foreground">
                      Randomize the order of questions for each student
                    </p>
                  </div>
                  <Switch
                    checked={quiz.settings.shuffleQuestions}
                    onCheckedChange={(value: boolean) =>
                      onUpdate({
                        ...quiz,
                        settings: { ...quiz.settings, shuffleQuestions: value },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Shuffle Answers</Label>
                    <p className="text-xs text-muted-foreground">
                      Randomize the order of answers for each question
                    </p>
                  </div>
                  <Switch
                    checked={quiz.settings.shuffleAnswers}
                    onCheckedChange={(value: boolean) =>
                      onUpdate({
                        ...quiz,
                        settings: { ...quiz.settings, shuffleAnswers: value },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Passing Score (%)</Label>
                    <p className="text-xs text-muted-foreground">
                      Minimum percentage required to pass the quiz
                    </p>
                  </div>
                  <Input
                    type="number"
                    className="w-24"
                    value={quiz.passingScore}
                    onChange={(event) =>
                      onUpdate({
                        ...quiz,
                        passingScore:
                          Number.parseInt(event.target.value, 10) || 0,
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Attempts Allowed</Label>
                    <p className="text-xs text-muted-foreground">
                      Number of times a student can take this quiz
                    </p>
                  </div>
                  <Input
                    type="number"
                    className="w-24"
                    value={quiz.settings.attemptsAllowed}
                    onChange={(event) =>
                      onUpdate({
                        ...quiz,
                        settings: {
                          ...quiz.settings,
                          attemptsAllowed:
                            Number.parseInt(event.target.value, 10) || 1,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6 border-t pt-8">
              <h3 className="text-lg font-bold">Feedback & Results</h3>
              <div className="grid gap-6">
                <div className="space-y-2">
                  <Label>Show Feedback</Label>
                  <Select
                    value={quiz.settings.showFeedback}
                    onValueChange={(value) =>
                      onUpdate({
                        ...quiz,
                        settings: { ...quiz.settings, showFeedback: value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">
                        Immediately after each question
                      </SelectItem>
                      <SelectItem value="after_submit">
                        After the quiz is submitted
                      </SelectItem>
                      <SelectItem value="after_deadline">
                        Only after the module deadline
                      </SelectItem>
                      <SelectItem value="never">Don&apos;t show feedback</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Correct Answers</Label>
                    <p className="text-xs text-muted-foreground">
                      Show students which answers were correct after submission
                    </p>
                  </div>
                  <Switch
                    checked={quiz.settings.showCorrectAnswers}
                    onCheckedChange={(value: boolean) =>
                      onUpdate({
                        ...quiz,
                        settings: {
                          ...quiz.settings,
                          showCorrectAnswers: value,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-6 p-8">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border bg-background p-4">
                <p className="text-sm text-muted-foreground">Question types</p>
                <p className="mt-2 text-2xl font-bold">
                  {new Set(quiz.questions.map((question) => question.type)).size}
                </p>
              </div>
              <div className="rounded-2xl border bg-background p-4">
                <p className="text-sm text-muted-foreground">Total questions</p>
                <p className="mt-2 text-2xl font-bold">{quiz.questions.length}</p>
              </div>
              <div className="rounded-2xl border bg-background p-4">
                <p className="text-sm text-muted-foreground">Total points</p>
                <p className="mt-2 text-2xl font-bold">
                  {quiz.questions.reduce(
                    (total, question) => total + question.points,
                    0,
                  )}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {quiz.questions.map((question, index) => (
                <div
                  key={question.id}
                  className="rounded-3xl border bg-background p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-primary/70">
                        Question {index + 1}
                      </p>
                      <h3 className="mt-1 font-semibold">
                        {question.question || 'Untitled question'}
                      </h3>
                    </div>
                    <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                      {
                        QUESTION_TYPES.find((item) => item.type === question.type)
                          ?.label
                      }
                    </span>
                  </div>

                  {question.options && question.options.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {question.options.map((option) => (
                        <div
                          key={option.id}
                          className={`rounded-2xl border px-4 py-3 text-sm ${
                            option.isCorrect
                              ? 'border-emerald-300 bg-emerald-50'
                              : 'bg-muted/20'
                          }`}
                        >
                          {option.text}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
