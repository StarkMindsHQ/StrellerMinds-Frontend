'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  Plus,
  GripVertical,
  Trash2,
  CheckCircle2,
  Circle,
  Settings,
  HelpCircle,
  Save,
  X,
  Check,
  Copy,
  Type,
  List,
  AlignLeft,
  Layout,
  FileCode,
  CheckSquare,
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
  { type: 'code', label: 'Code Solution', icon: <FileCode size={16} /> },
];

export function QuizCreator({ quiz, onUpdate, onSave }: QuizCreatorProps) {
  const [activeTab, setActiveTab] = useState<'questions' | 'settings'>(
    'questions',
  );
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(
    null,
  );

  const addQuestion = (type: QuestionType) => {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      quizId: quiz.id,
      type,
      order: quiz.questions.length,
      question: '',
      points: 1,
      required: true,
      options:
        type.includes('multiple') || type === 'true_false'
          ? [
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
            ]
          : [],
    };

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

  const updateQuestion = (id: string, data: Partial<Question>) => {
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

    // For single choice, uncheck other correct answers
    let newOptions = question.options.map((o) =>
      o.id === optionId ? { ...o, ...data } : o,
    );

    if (question.type === 'multiple_choice' && data.isCorrect) {
      newOptions = newOptions.map((o) =>
        o.id === optionId ? o : { ...o, isCorrect: false },
      );
    }

    updateQuestion(questionId, { options: newOptions });
  };

  const reorderQuestions = (newQuestions: Question[]) => {
    onUpdate({
      ...quiz,
      questions: newQuestions.map((q, i) => ({ ...q, order: i })),
    });
  };

  return (
    <div className="flex flex-col h-full bg-card border rounded-xl overflow-hidden shadow-sm">
      {/* Tab Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/20">
        <div className="flex bg-muted p-1 rounded-lg">
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
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast('Draft saved')}
          >
            <Save className="w-4 h-4 mr-2" /> Save Draft
          </Button>
          <Button size="sm" onClick={() => onSave?.(quiz)}>
            <Check className="w-4 h-4 mr-2" /> Publish Quiz
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'questions' ? (
          <div className="p-6 max-w-4xl mx-auto space-y-6">
            <Reorder.Group
              axis="y"
              values={quiz.questions}
              onReorder={reorderQuestions}
              className="space-y-4"
            >
              {quiz.questions.map((q, qIdx) => (
                <Reorder.Item
                  key={q.id}
                  value={q}
                  className={`border rounded-xl bg-background overflow-hidden transition-all ${expandedQuestionId === q.id ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                >
                  <div
                    className="flex items-center gap-4 p-4 cursor-pointer hover:bg-muted/30"
                    onClick={() =>
                      setExpandedQuestionId(
                        expandedQuestionId === q.id ? null : q.id,
                      )
                    }
                  >
                    <div className="cursor-grab active:cursor-grabbing text-muted-foreground">
                      <GripVertical size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-primary/70 uppercase">
                          Question {qIdx + 1}
                        </span>
                        <span className="text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                          {QUESTION_TYPES.find((t) => t.type === q.type)?.label}
                        </span>
                      </div>
                      <p className="font-medium truncate">
                        {q.question || (
                          <span className="text-muted-foreground italic">
                            No question text yet...
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-muted-foreground">
                        {q.points} pt{q.points !== 1 ? 's' : ''}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeQuestion(q.id);
                        }}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedQuestionId === q.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t bg-muted/10 p-6 space-y-6"
                      >
                        <div className="space-y-4">
                          <div className="flex gap-4">
                            <div className="flex-1 space-y-2">
                              <Label>Question Text</Label>
                              <Textarea
                                placeholder="Enter your question here..."
                                value={q.question}
                                onChange={(e) =>
                                  updateQuestion(q.id, {
                                    question: e.target.value,
                                  })
                                }
                                className="min-h-[100px]"
                              />
                            </div>
                            <div className="w-[200px] space-y-4">
                              <div className="space-y-2">
                                <Label>Question Type</Label>
                                <Select
                                  value={q.type}
                                  onValueChange={(v: QuestionType) =>
                                    updateQuestion(q.id, { type: v })
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {QUESTION_TYPES.map((t) => (
                                      <SelectItem key={t.type} value={t.type}>
                                        <div className="flex items-center gap-2">
                                          {t.icon} {t.label}
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
                                  value={q.points}
                                  onChange={(e) =>
                                    updateQuestion(q.id, {
                                      points: parseInt(e.target.value) || 0,
                                    })
                                  }
                                />
                              </div>
                            </div>
                          </div>

                          {/* Options Area (Conditional) */}
                          {(q.type.includes('multiple') ||
                            q.type === 'true_false') && (
                            <div className="space-y-3">
                              <Label>Options</Label>
                              <div className="space-y-2">
                                {q.options?.map((opt, optIdx) => (
                                  <div
                                    key={opt.id}
                                    className="flex items-center gap-3"
                                  >
                                    <button
                                      className={`
                                        w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                                        ${opt.isCorrect ? 'bg-green-500 border-green-500 text-white' : 'border-muted-foreground/30 hover:border-primary'}
                                      `}
                                      onClick={() =>
                                        updateOption(q.id, opt.id, {
                                          isCorrect: !opt.isCorrect,
                                        })
                                      }
                                    >
                                      {opt.isCorrect && <Check size={14} />}
                                    </button>
                                    <Input
                                      value={opt.text}
                                      onChange={(e) =>
                                        updateOption(q.id, opt.id, {
                                          text: e.target.value,
                                        })
                                      }
                                      className="h-9"
                                      disabled={q.type === 'true_false'}
                                    />
                                    {q.type !== 'true_false' && (
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9 text-destructive"
                                        onClick={() =>
                                          removeOption(q.id, opt.id)
                                        }
                                      >
                                        <X size={16} />
                                      </Button>
                                    )}
                                  </div>
                                ))}
                                {q.type !== 'true_false' && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full border-dashed"
                                    onClick={() => addOption(q.id)}
                                  >
                                    <Plus className="w-4 h-4 mr-2" /> Add Option
                                  </Button>
                                )}
                              </div>
                            </div>
                          )}

                          <div className="space-y-2">
                            <Label>Extra Feedback (Optional)</Label>
                            <Input
                              placeholder="Explanation for correct answer..."
                              value={q.explanation || ''}
                              onChange={(e) =>
                                updateQuestion(q.id, {
                                  explanation: e.target.value,
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

            <div className="flex flex-col items-center gap-4 py-8 border-2 border-dashed rounded-2xl bg-muted/10">
              <p className="text-sm font-medium text-muted-foreground">
                Add new question
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {QUESTION_TYPES.map((t) => (
                  <Button
                    key={t.type}
                    variant="secondary"
                    size="sm"
                    className="gap-2"
                    onClick={() => addQuestion(t.type)}
                  >
                    {t.icon} {t.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 max-w-2xl mx-auto space-y-8">
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
                    onCheckedChange={(v: boolean) =>
                      onUpdate({
                        ...quiz,
                        settings: { ...quiz.settings, shuffleQuestions: v },
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
                    onCheckedChange={(v: boolean) =>
                      onUpdate({
                        ...quiz,
                        settings: { ...quiz.settings, shuffleAnswers: v },
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
                    onChange={(e) =>
                      onUpdate({
                        ...quiz,
                        passingScore: parseInt(e.target.value) || 0,
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
                    onChange={(e) =>
                      onUpdate({
                        ...quiz,
                        settings: {
                          ...quiz.settings,
                          attemptsAllowed: parseInt(e.target.value) || 1,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="pt-8 border-t space-y-6">
              <h3 className="text-lg font-bold">Feedback & Results</h3>
              <div className="grid gap-6">
                <div className="space-y-2">
                  <Label>Show Feedback</Label>
                  <Select
                    value={quiz.settings.showFeedback}
                    onValueChange={(v: any) =>
                      onUpdate({
                        ...quiz,
                        settings: { ...quiz.settings, showFeedback: v },
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
                      <SelectItem value="never">Don't show feedback</SelectItem>
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
                    onCheckedChange={(v: boolean) =>
                      onUpdate({
                        ...quiz,
                        settings: { ...quiz.settings, showCorrectAnswers: v },
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
