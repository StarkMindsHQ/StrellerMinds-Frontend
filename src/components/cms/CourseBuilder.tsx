'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  Plus,
  GripVertical,
  ChevronDown,
  ChevronRight,
  Edit2,
  Trash2,
  Video,
  FileText,
  HelpCircle,
  ClipboardList,
  Download,
  MoreVertical,
  Copy,
  Eye,
  Lock,
  Unlock,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import type {
  CourseModule,
  Lesson,
  Quiz,
  Assignment,
  LessonType,
} from '@/types/cms';

interface CourseBuilderProps {
  modules: CourseModule[];
  onModulesChange: (modules: CourseModule[]) => void;
  onEditLesson?: (moduleId: string, lesson: Lesson) => void;
  onEditQuiz?: (moduleId: string, quiz: Quiz) => void;
  onEditAssignment?: (moduleId: string, assignment: Assignment) => void;
  readOnly?: boolean;
}

const LESSON_TYPES: {
  type: LessonType;
  icon: React.ReactNode;
  label: string;
}[] = [
  { type: 'video', icon: <Video size={16} />, label: 'Video Lesson' },
  { type: 'text', icon: <FileText size={16} />, label: 'Text Lesson' },
  { type: 'interactive', icon: <HelpCircle size={16} />, label: 'Interactive' },
  { type: 'mixed', icon: <ClipboardList size={16} />, label: 'Mixed Content' },
];

export function CourseBuilder({
  modules,
  onModulesChange,
  onEditLesson,
  onEditQuiz,
  onEditAssignment,
  readOnly = false,
}: CourseBuilderProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set(modules.map((m) => m.id)),
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');

  const generateId = () =>
    `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) next.delete(moduleId);
      else next.add(moduleId);
      return next;
    });
  };

  const addModule = () => {
    const newModule: CourseModule = {
      id: generateId(),
      courseId: '',
      title: 'New Module',
      description: '',
      order: modules.length,
      isLocked: false,
      lessons: [],
      quizzes: [],
      assignments: [],
      resources: [],
      duration: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    onModulesChange([...modules, newModule]);
    setExpandedModules((prev) => new Set(prev).add(newModule.id));
    setEditingId(newModule.id);
    setEditingValue('New Module');
  };

  const addLesson = (moduleId: string, type: LessonType) => {
    const newLesson: Lesson = {
      id: generateId(),
      moduleId,
      title: 'New Lesson',
      description: '',
      type,
      order: modules.find((m) => m.id === moduleId)?.lessons.length || 0,
      duration: 0,
      content: {},
      status: 'draft',
      isFree: false,
      isRequired: true,
      attachments: [],
      version: 1,
      versionHistory: [],
      createdBy: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    onModulesChange(
      modules.map((m) =>
        m.id === moduleId ? { ...m, lessons: [...m.lessons, newLesson] } : m,
      ),
    );
  };

  const addQuiz = (moduleId: string) => {
    const newQuiz: Quiz = {
      id: generateId(),
      moduleId,
      title: 'New Quiz',
      description: '',
      type: 'graded',
      order: modules.find((m) => m.id === moduleId)?.quizzes.length || 0,
      questions: [],
      settings: {
        shuffleQuestions: false,
        shuffleAnswers: false,
        showFeedback: 'after_submit',
        attemptsAllowed: 3,
        timeLimitEnabled: false,
        requirePassToProgress: false,
        showCorrectAnswers: true,
        allowReview: true,
      },
      passingScore: 70,
      totalPoints: 0,
      status: 'draft',
      version: 1,
      versionHistory: [],
      createdBy: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    onModulesChange(
      modules.map((m) =>
        m.id === moduleId ? { ...m, quizzes: [...m.quizzes, newQuiz] } : m,
      ),
    );
  };

  const deleteModule = (moduleId: string) => {
    onModulesChange(modules.filter((m) => m.id !== moduleId));
  };

  const deleteLesson = (moduleId: string, lessonId: string) => {
    onModulesChange(
      modules.map((m) =>
        m.id === moduleId
          ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) }
          : m,
      ),
    );
  };

  const deleteQuiz = (moduleId: string, quizId: string) => {
    onModulesChange(
      modules.map((m) =>
        m.id === moduleId
          ? { ...m, quizzes: m.quizzes.filter((q) => q.id !== quizId) }
          : m,
      ),
    );
  };

  const updateTitle = (
    type: 'module' | 'lesson' | 'quiz',
    id: string,
    moduleId?: string,
  ) => {
    if (type === 'module') {
      onModulesChange(
        modules.map((m) => (m.id === id ? { ...m, title: editingValue } : m)),
      );
    } else if (type === 'lesson' && moduleId) {
      onModulesChange(
        modules.map((m) =>
          m.id === moduleId
            ? {
                ...m,
                lessons: m.lessons.map((l) =>
                  l.id === id ? { ...l, title: editingValue } : l,
                ),
              }
            : m,
        ),
      );
    } else if (type === 'quiz' && moduleId) {
      onModulesChange(
        modules.map((m) =>
          m.id === moduleId
            ? {
                ...m,
                quizzes: m.quizzes.map((q) =>
                  q.id === id ? { ...q, title: editingValue } : q,
                ),
              }
            : m,
        ),
      );
    }
    setEditingId(null);
  };

  const duplicateModule = (module: CourseModule) => {
    const newModule = {
      ...module,
      id: generateId(),
      title: `${module.title} (Copy)`,
      order: modules.length,
    };
    onModulesChange([...modules, newModule]);
  };

  const toggleLock = (moduleId: string) => {
    onModulesChange(
      modules.map((m) =>
        m.id === moduleId ? { ...m, isLocked: !m.isLocked } : m,
      ),
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckCircle size={14} className="text-green-500" />;
      case 'review':
        return <AlertCircle size={14} className="text-yellow-500" />;
      default:
        return <Clock size={14} className="text-muted-foreground" />;
    }
  };

  const getLessonIcon = (type: LessonType) => {
    const found = LESSON_TYPES.find((t) => t.type === type);
    return found?.icon || <FileText size={16} />;
  };

  return (
    <div className="course-builder">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">Course Structure</h2>
          <p className="text-sm text-muted-foreground">
            Organize modules, lessons, and quizzes
          </p>
        </div>
        {!readOnly && (
          <Button onClick={addModule} className="gap-2">
            <Plus size={18} /> Add Module
          </Button>
        )}
      </div>

      <Reorder.Group
        axis="y"
        values={modules}
        onReorder={onModulesChange}
        className="space-y-4"
      >
        {modules.map((module, moduleIndex) => (
          <Reorder.Item key={module.id} value={module} className="list-none">
            <motion.div
              layout
              className={`bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow ${module.isLocked ? 'opacity-75' : ''}`}
            >
              {/* Module Header */}
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-primary/5 to-transparent">
                {!readOnly && (
                  <div className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground">
                    <GripVertical size={20} />
                  </div>
                )}
                <button
                  onClick={() => toggleModule(module.id)}
                  className="p-1 hover:bg-muted rounded"
                >
                  {expandedModules.has(module.id) ? (
                    <ChevronDown size={20} />
                  ) : (
                    <ChevronRight size={20} />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  {editingId === module.id ? (
                    <Input
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      onBlur={() => updateTitle('module', module.id)}
                      onKeyDown={(e) =>
                        e.key === 'Enter' && updateTitle('module', module.id)
                      }
                      className="h-8 font-semibold"
                      autoFocus
                    />
                  ) : (
                    <h3 className="font-semibold truncate flex items-center gap-2">
                      <span className="text-primary/70">
                        Module {moduleIndex + 1}:
                      </span>
                      {module.title}
                      {module.isLocked && (
                        <Lock size={14} className="text-muted-foreground" />
                      )}
                    </h3>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{module.lessons.length} lessons</span>
                  <span>·</span>
                  <span>{module.quizzes.length} quizzes</span>
                </div>
                {!readOnly && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setEditingId(module.id);
                          setEditingValue(module.title);
                        }}
                      >
                        <Edit2 size={14} className="mr-2" /> Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => duplicateModule(module)}>
                        <Copy size={14} className="mr-2" /> Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleLock(module.id)}>
                        {module.isLocked ? (
                          <Unlock size={14} className="mr-2" />
                        ) : (
                          <Lock size={14} className="mr-2" />
                        )}
                        {module.isLocked ? 'Unlock' : 'Lock'}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => deleteModule(module.id)}
                        className="text-destructive"
                      >
                        <Trash2 size={14} className="mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              {/* Module Content */}
              <AnimatePresence>
                {expandedModules.has(module.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t"
                  >
                    <div className="p-4 space-y-2">
                      {/* Lessons */}
                      {module.lessons.map((lesson, lessonIndex) => (
                        <div
                          key={lesson.id}
                          className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors group"
                        >
                          <div className="text-muted-foreground">
                            {getLessonIcon(lesson.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            {editingId === lesson.id ? (
                              <Input
                                value={editingValue}
                                onChange={(e) =>
                                  setEditingValue(e.target.value)
                                }
                                onBlur={() =>
                                  updateTitle('lesson', lesson.id, module.id)
                                }
                                onKeyDown={(e) =>
                                  e.key === 'Enter' &&
                                  updateTitle('lesson', lesson.id, module.id)
                                }
                                className="h-7 text-sm"
                                autoFocus
                              />
                            ) : (
                              <p className="text-sm font-medium truncate">
                                {lessonIndex + 1}. {lesson.title}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(lesson.status)}
                            {lesson.isFree && (
                              <span className="text-xs bg-green-500/20 text-green-600 px-2 py-0.5 rounded">
                                Free
                              </span>
                            )}
                            {lesson.duration > 0 && (
                              <span className="text-xs text-muted-foreground">
                                {lesson.duration}m
                              </span>
                            )}
                          </div>
                          {!readOnly && (
                            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0"
                                onClick={() =>
                                  onEditLesson?.(module.id, lesson)
                                }
                              >
                                <Edit2 size={14} />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0 text-destructive"
                                onClick={() =>
                                  deleteLesson(module.id, lesson.id)
                                }
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Quizzes */}
                      {module.quizzes.map((quiz, quizIndex) => (
                        <div
                          key={quiz.id}
                          className="flex items-center gap-3 p-3 bg-yellow-500/10 rounded-lg hover:bg-yellow-500/20 transition-colors group"
                        >
                          <HelpCircle size={16} className="text-yellow-600" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              Quiz: {quiz.title}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(quiz.status)}
                            <span className="text-xs text-muted-foreground">
                              {quiz.questions.length} questions
                            </span>
                          </div>
                          {!readOnly && (
                            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0"
                                onClick={() => onEditQuiz?.(module.id, quiz)}
                              >
                                <Edit2 size={14} />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0 text-destructive"
                                onClick={() => deleteQuiz(module.id, quiz.id)}
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Add Content */}
                      {!readOnly && (
                        <div className="flex items-center gap-2 pt-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                              >
                                <Plus size={14} /> Add Lesson
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              {LESSON_TYPES.map(({ type, icon, label }) => (
                                <DropdownMenuItem
                                  key={type}
                                  onClick={() => addLesson(module.id, type)}
                                >
                                  {icon} <span className="ml-2">{label}</span>
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => addQuiz(module.id)}
                          >
                            <HelpCircle size={14} /> Add Quiz
                          </Button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {modules.length === 0 && (
        <div className="text-center py-16 border-2 border-dashed rounded-xl">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus size={32} className="text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No modules yet</h3>
          <p className="text-muted-foreground mb-4">
            Start building your course by adding modules
          </p>
          {!readOnly && (
            <Button onClick={addModule} className="gap-2">
              <Plus size={18} /> Add First Module
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default CourseBuilder;
