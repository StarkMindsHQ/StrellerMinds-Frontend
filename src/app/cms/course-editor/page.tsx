'use client';

import React, { useEffect, useState } from 'react';
import { CMSLayout } from '@/components/cms/CMSLayout';
import { CourseBuilder } from '@/components/cms/CourseBuilder';
import { RichTextEditor } from '@/components/cms/RichTextEditor';
import { QuizCreator } from '@/components/cms/QuizCreator';
import { MediaManager } from '@/components/cms/MediaManager';
import { ThreadedDiscussionForum } from '@/components/cms/ThreadedDiscussionForum';
import { PeerReviewAssignmentPanel } from '@/components/cms/PeerReviewAssignmentPanel';
import { useCMS } from '@/contexts/CMSContext';
import {
  Save,
  Eye,
  Rocket,
  ArrowLeft,
  Settings,
  Layers,
  FileText,
  HelpCircle,
  Image as ImageIcon,
  History,
  Share2,
  MoreVertical,
  Globe,
  Lock,
  ShieldCheck,
  MessageSquare,
  ClipboardCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import type { Assignment, Course, Lesson, Quiz } from '@/types/cms';

const starterQuiz: Quiz = {
  id: 'quiz-starter-1',
  moduleId: 'mod-1',
  title: 'Lesson Readiness Check',
  description: 'Validate understanding before publishing the learning path.',
  type: 'graded',
  order: 0,
  questions: [
    {
      id: 'question-1',
      quizId: 'quiz-starter-1',
      type: 'multiple_choice',
      order: 0,
      question: 'Which learner signal should unlock the next module?',
      points: 2,
      required: true,
      explanation:
        'Use the milestone that best represents demonstrated understanding.',
      options: [
        { id: 'option-1', text: 'Video completed', isCorrect: false },
        { id: 'option-2', text: 'Quiz passed', isCorrect: true },
        { id: 'option-3', text: 'Profile updated', isCorrect: false },
      ],
    },
    {
      id: 'question-2',
      quizId: 'quiz-starter-1',
      type: 'ordering',
      order: 1,
      question: 'Arrange the quiz publishing flow in the correct order.',
      points: 3,
      required: true,
      orderingItems: [
        { id: 'order-a', text: 'Draft questions', correctPosition: 1 },
        { id: 'order-b', text: 'Preview learner experience', correctPosition: 2 },
        { id: 'order-c', text: 'Publish quiz', correctPosition: 3 },
      ],
    },
  ],
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
  totalPoints: 5,
  status: 'draft',
  version: 1,
  versionHistory: [],
  createdBy: 'admin',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const starterPeerReviewAssignment: Assignment = {
  id: 'assignment-peer-1',
  moduleId: 'mod-1',
  title: 'Smart Contract Audit Peer Review',
  description: 'Review another learner submission using a structured rubric.',
  instructions: {
    html: '<p>Review the submitted audit note and provide rubric-based feedback.</p>',
    plainText:
      'Review the submitted audit note and provide rubric-based feedback.',
    json: {},
    wordCount: 12,
  },
  type: 'text_submission',
  order: 0,
  points: 10,
  settings: {
    allowLateSubmission: true,
    maxSubmissions: 1,
    peerReviewEnabled: true,
    peerReviewCount: 3,
    plagiarismCheckEnabled: false,
  },
  rubric: {
    criteria: [
      {
        id: 'criterion-1',
        name: 'Accuracy',
        description:
          'Does the reviewer correctly identify the core quality issues?',
        maxPoints: 4,
        levels: [],
      },
      {
        id: 'criterion-2',
        name: 'Reasoning',
        description: 'Does the reviewer explain why each recommendation matters?',
        maxPoints: 3,
        levels: [],
      },
      {
        id: 'criterion-3',
        name: 'Actionability',
        description:
          'Are the next steps clear enough for the author to improve quickly?',
        maxPoints: 3,
        levels: [],
      },
    ],
  },
  attachments: [],
  status: 'draft',
  createdBy: 'admin',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export default function CourseEditorPage() {
  const {
    currentCourse,
    setCurrentCourse,
    updateCourse,
    saveCourse,
    publishCourse,
    isSaving,
  } = useCMS();

  const [activeTab, setActiveTab] = useState('builder');
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [editingQuizId, setEditingQuizId] = useState<string | null>(null);

  useEffect(() => {
    if (!currentCourse) {
      setCurrentCourse({
        id: 'course-1',
        title: 'Mastering Modern Web Development',
        slug: 'mastering-modern-web-dev',
        description: 'Comprehensive guide to React, Next.js and Tailwind CSS',
        shortDescription: 'Learn full-stack development from scratch',
        category: 'Development',
        tags: ['React', 'Next.js', 'Frontend'],
        level: 'intermediate',
        duration: 1200,
        status: 'draft',
        price: 99.99,
        currency: 'USD',
        instructors: [],
        modules: [
          {
            id: 'mod-1',
            courseId: 'course-1',
            title: 'Introduction to React',
            description: 'Core concepts and environment setup',
            order: 0,
            isLocked: false,
            lessons: [
              {
                id: 'les-1',
                moduleId: 'mod-1',
                title: 'Getting Started',
                description: 'Initial setup',
                type: 'video',
                order: 0,
                duration: 15,
                content: {
                  richText: {
                    html: '<p>Welcome to the course!</p>',
                    plainText: '',
                    json: {},
                    wordCount: 4,
                  },
                },
                status: 'published',
                isFree: true,
                isRequired: true,
                attachments: [],
                version: 1,
                versionHistory: [],
                createdBy: 'admin',
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            ],
            quizzes: [starterQuiz],
            assignments: [starterPeerReviewAssignment],
            resources: [],
            duration: 60,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        prerequisites: [],
        learningOutcomes: [],
        targetAudience: [],
        seoMetadata: {
          title: '',
          description: '',
          keywords: [],
          noIndex: false,
          noFollow: false,
        },
        settings: {
          certificateEnabled: true,
          discussionEnabled: true,
          downloadEnabled: false,
          completionCriteria: 'all_lessons',
          drip: { enabled: false, schedule: 'daily' },
        },
        version: 1,
        versionHistory: [],
        createdBy: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
        analytics: {
          enrollments: 0,
          completions: 0,
          averageRating: 0,
          totalReviews: 0,
          averageProgress: 0,
          averageCompletionTime: 0,
        },
      });
    }
  }, [currentCourse, setCurrentCourse]);

  if (!currentCourse) {
    return <div className="p-20 text-center">Loading Course Workspace...</div>;
  }

  const quizEntries = currentCourse.modules.flatMap((module) =>
    module.quizzes.map((quiz) => ({
      moduleId: module.id,
      quiz,
    })),
  );
  const activeQuizEntry =
    quizEntries.find((entry) => entry.quiz.id === editingQuizId) ||
    quizEntries[0] ||
    null;
  const activePeerReviewAssignment =
    currentCourse.modules.flatMap((module) => module.assignments)[0] || null;

  const handleEditLesson = (_moduleId: string, lesson: Lesson) => {
    setEditingLessonId(lesson.id);
    setActiveTab('editor');
  };

  const handleEditQuiz = (_moduleId: string, quiz: Quiz) => {
    setEditingQuizId(quiz.id);
    setActiveTab('quiz');
  };

  const handleQuizUpdate = (updatedQuiz: Quiz) => {
    if (!activeQuizEntry) return;

    updateCourse({
      modules: currentCourse.modules.map((module) =>
        module.id === activeQuizEntry.moduleId
          ? {
              ...module,
              quizzes: module.quizzes.map((quiz) =>
                quiz.id === updatedQuiz.id
                  ? {
                      ...updatedQuiz,
                      totalPoints: updatedQuiz.questions.reduce(
                        (sum, question) => sum + question.points,
                        0,
                      ),
                      updatedAt: new Date(),
                    }
                  : quiz,
              ),
            }
          : module,
      ),
    });
  };

  return (
    <CMSLayout>
      <div className="flex h-full flex-col bg-muted/10">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-card px-6 py-4 shadow-sm">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft size={16} /> Back
            </Button>
            <div className="hidden h-6 w-px bg-border sm:block"></div>
            <div>
              <h1 className="max-w-[300px] truncate text-lg font-bold leading-none">
                {currentCourse.title}
              </h1>
              <p className="mt-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-yellow-500"></span>
                Draft v{currentCourse.version}.0 · Last saved 2m ago
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="mr-2 hidden items-center gap-1 rounded-full bg-muted/50 px-3 py-1.5 lg:flex">
              <ShieldCheck size={14} className="text-primary" />
              <span className="text-xs font-semibold text-primary">
                Collaboration Content Lock Active
              </span>
            </div>
            <Button variant="ghost" size="sm" className="gap-2">
              <Eye size={16} /> Preview
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={saveCourse}
              disabled={isSaving}
            >
              <Save size={16} /> {isSaving ? 'Saving...' : 'Save Draft'}
            </Button>
            <Button
              size="sm"
              className="gap-2 bg-primary hover:bg-primary/90"
              onClick={publishCourse}
            >
              <Rocket size={16} /> Publish
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <MoreVertical size={18} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <Share2 className="mr-2 h-4 w-4" /> Share Link
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <History className="mr-2 h-4 w-4" /> Version History
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Lock className="mr-2 h-4 w-4" /> Course Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <Layers className="mr-2 h-4 w-4" /> Archive Course
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex h-full flex-col"
          >
            <div className="flex items-center justify-between border-b bg-card px-6">
              <TabsList className="h-12 gap-6 border-none bg-transparent p-0">
                <TabsTrigger
                  value="builder"
                  className="h-12 rounded-none border-b-2 border-transparent px-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  <Layers size={16} className="mr-2" /> Course Builder
                </TabsTrigger>
                <TabsTrigger
                  value="editor"
                  className="h-12 rounded-none border-b-2 border-transparent px-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  <FileText size={16} className="mr-2" /> Lesson Editor
                </TabsTrigger>
                <TabsTrigger
                  value="quiz"
                  className="h-12 rounded-none border-b-2 border-transparent px-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  <HelpCircle size={16} className="mr-2" /> Quiz Creator
                </TabsTrigger>
                <TabsTrigger
                  value="media"
                  className="h-12 rounded-none border-b-2 border-transparent px-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  <ImageIcon size={16} className="mr-2" /> Media Library
                </TabsTrigger>
                <TabsTrigger
                  value="discussion"
                  className="h-12 rounded-none border-b-2 border-transparent px-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  <MessageSquare size={16} className="mr-2" /> Discussion
                </TabsTrigger>
                <TabsTrigger
                  value="peer-review"
                  className="h-12 rounded-none border-b-2 border-transparent px-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  <ClipboardCheck size={16} className="mr-2" /> Peer Review
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="h-12 rounded-none border-b-2 border-transparent px-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  <Settings size={16} className="mr-2" /> SEO & Settings
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Globe size={14} className="text-green-500" /> Public Access
                </span>
                <span>$99.00 USD</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              <div className="mx-auto h-full max-w-[1200px]">
                <TabsContent
                  value="builder"
                  className="mt-0 h-full focus-visible:outline-none"
                >
                  <CourseBuilder
                    modules={currentCourse.modules}
                    onModulesChange={(modules) => updateCourse({ modules })}
                    onEditLesson={handleEditLesson}
                    onEditQuiz={handleEditQuiz}
                  />
                </TabsContent>

                <TabsContent
                  value="editor"
                  className="mt-0 h-full focus-visible:outline-none"
                >
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold">Content Editor</h2>
                      {editingLessonId ? (
                        <div className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                          Editing Lesson ID: {editingLessonId}
                        </div>
                      ) : (
                        <p className="text-sm italic text-muted-foreground">
                          Select a lesson from the builder to start editing
                          contents
                        </p>
                      )}
                    </div>
                    <RichTextEditor
                      className="min-h-[500px]"
                      onSave={() => toast('Auto-saved Content')}
                      autoSave
                    />
                  </div>
                </TabsContent>

                <TabsContent
                  value="quiz"
                  className="mt-0 h-full focus-visible:outline-none"
                >
                  {activeQuizEntry ? (
                    <QuizCreator
                      quiz={activeQuizEntry.quiz}
                      onUpdate={handleQuizUpdate}
                      onSave={(quiz) => {
                        handleQuizUpdate({
                          ...quiz,
                          status: 'published',
                        });
                        toast.success('Quiz saved and preview is ready');
                      }}
                    />
                  ) : (
                    <div className="flex h-[400px] flex-col items-center justify-center rounded-3xl border-2 border-dashed bg-card">
                      <HelpCircle
                        size={48}
                        className="mb-4 text-muted-foreground opacity-20"
                      />
                      <h3 className="mb-2 text-xl font-bold">
                        No active quiz selected
                      </h3>
                      <p className="mb-6 text-muted-foreground">
                        Create a quiz in the course builder to start designing
                        questions
                      </p>
                      <Button onClick={() => setActiveTab('builder')}>
                        Go to Builder
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent
                  value="media"
                  className="mt-0 h-full focus-visible:outline-none"
                >
                  <MediaManager />
                </TabsContent>

                <TabsContent
                  value="discussion"
                  className="mt-0 h-full focus-visible:outline-none"
                >
                  <ThreadedDiscussionForum />
                </TabsContent>

                <TabsContent
                  value="peer-review"
                  className="mt-0 h-full focus-visible:outline-none"
                >
                  {activePeerReviewAssignment?.rubric ? (
                    <PeerReviewAssignmentPanel
                      assignmentTitle={activePeerReviewAssignment.title}
                      rubricCriteria={activePeerReviewAssignment.rubric.criteria}
                    />
                  ) : (
                    <div className="rounded-3xl border border-dashed bg-card p-12 text-center">
                      <p className="text-muted-foreground">
                        Add a peer-reviewed assignment to activate this workflow.
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent
                  value="settings"
                  className="mt-0 h-full focus-visible:outline-none"
                >
                  <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div className="space-y-8 lg:col-span-2">
                      <div className="rounded-2xl border bg-card p-6 shadow-sm">
                        <h3 className="mb-4 text-lg font-bold">Course Info</h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              Course Title
                            </label>
                            <Input
                              value={currentCourse.title}
                              onChange={(event) =>
                                updateCourse({ title: event.target.value })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              Slug / URL
                            </label>
                            <Input
                              value={currentCourse.slug}
                              onChange={(event) =>
                                updateCourse({ slug: event.target.value })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              Short Description
                            </label>
                            <Input
                              value={currentCourse.shortDescription}
                              onChange={(event) =>
                                updateCourse({
                                  shortDescription: event.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl border bg-card p-6 shadow-sm">
                        <h3 className="mb-4 text-lg font-bold">SEO Metadata</h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              Meta Title
                            </label>
                            <Input placeholder="Search engine title..." />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              Meta Description
                            </label>
                            <textarea
                              className="min-h-[100px] w-full rounded-xl border bg-background px-3 py-2 text-sm"
                              placeholder="Brief summary for search results..."
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="rounded-2xl border bg-card p-6 shadow-sm">
                        <h3 className="mb-4 text-lg font-bold">
                          Publication Settings
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between rounded-xl bg-muted/50 p-3">
                            <span className="text-sm font-medium">
                              Free Course
                            </span>
                            <div className="relative h-6 w-10 rounded-full bg-muted">
                              <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-background shadow-sm"></div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between rounded-xl bg-muted/50 p-3">
                            <span className="text-sm font-medium">
                              Enable Certificates
                            </span>
                            <div className="relative h-6 w-10 rounded-full bg-primary">
                              <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-background shadow-sm"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    </CMSLayout>
  );
}
