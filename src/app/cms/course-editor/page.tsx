'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CMSLayout } from '@/components/cms/CMSLayout';
import { CourseBuilder } from '@/components/cms/CourseBuilder';
import { RichTextEditor } from '@/components/cms/RichTextEditor';
import { QuizCreator } from '@/components/cms/QuizCreator';
import { MediaManager } from '@/components/cms/MediaManager';
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import type { Course, Lesson, Quiz } from '@/types/cms';

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
  const [showMediaModal, setShowMediaModal] = useState(false);

  // Initialize with mock data if none exists
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
            quizzes: [],
            assignments: [],
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

  if (!currentCourse)
    return <div className="p-20 text-center">Loading Course Workspace...</div>;

  const handleEditLesson = (moduleId: string, lesson: Lesson) => {
    setEditingLessonId(lesson.id);
    setActiveTab('editor');
  };

  const handleEditQuiz = (moduleId: string, quiz: Quiz) => {
    setEditingQuizId(quiz.id);
    setActiveTab('quiz');
  };

  return (
    <CMSLayout>
      <div className="flex flex-col h-full bg-muted/10">
        {/* Editor Toolbar */}
        <div className="bg-card border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft size={16} /> Back
            </Button>
            <div className="h-6 w-px bg-border hidden sm:block"></div>
            <div>
              <h1 className="text-lg font-bold leading-none truncate max-w-[300px]">
                {currentCourse.title}
              </h1>
              <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1.5 uppercase font-bold tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span>
                Draft v{currentCourse.version}.0 · Last saved 2m ago
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-1 mr-2 px-3 py-1.5 bg-muted/50 rounded-full">
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
                  <Share2 className="w-4 h-4 mr-2" /> Share Link
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <History className="w-4 h-4 mr-2" /> Version History
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Lock className="w-4 h-4 mr-2" /> Course Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <Layers className="w-4 h-4 mr-2" /> Archive Course
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Main Workspace Area */}
        <div className="flex-1 overflow-hidden">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="h-full flex flex-col"
          >
            <div className="bg-card border-b px-6 flex items-center justify-between">
              <TabsList className="h-12 bg-transparent border-none p-0 gap-6">
                <TabsTrigger
                  value="builder"
                  className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-2"
                >
                  <Layers size={16} className="mr-2" /> Course Builder
                </TabsTrigger>
                <TabsTrigger
                  value="editor"
                  className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-2"
                >
                  <FileText size={16} className="mr-2" /> Lesson Editor
                </TabsTrigger>
                <TabsTrigger
                  value="quiz"
                  className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-2"
                >
                  <HelpCircle size={16} className="mr-2" /> Quiz Creator
                </TabsTrigger>
                <TabsTrigger
                  value="media"
                  className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-2"
                >
                  <ImageIcon size={16} className="mr-2" /> Media Library
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-2"
                >
                  <Settings size={16} className="mr-2" /> SEO & Settings
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium">
                <span className="flex items-center gap-1.5">
                  <Globe size={14} className="text-green-500" /> Public Access
                </span>
                <span>$99.00 USD</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              <div className="max-w-[1200px] mx-auto h-full">
                <TabsContent
                  value="builder"
                  className="mt-0 h-full focus-visible:outline-none"
                >
                  <CourseBuilder
                    modules={currentCourse.modules}
                    onModulesChange={(m) => updateCourse({ modules: m })}
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
                        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                          Editing Lesson ID: {editingLessonId}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-sm italic">
                          Select a lesson from the builder to start editing
                          contents
                        </p>
                      )}
                    </div>
                    <RichTextEditor
                      className="min-h-[500px]"
                      onSave={(html) => toast('Auto-saved Content')}
                      autoSave
                    />
                  </div>
                </TabsContent>

                <TabsContent
                  value="quiz"
                  className="mt-0 h-full focus-visible:outline-none"
                >
                  {currentCourse.modules[0].quizzes[0] ? (
                    <QuizCreator
                      quiz={currentCourse.modules[0].quizzes[0]}
                      onUpdate={(q) => {}}
                    />
                  ) : (
                    <div className="h-[400px] flex flex-col items-center justify-center bg-card border-2 border-dashed rounded-3xl">
                      <HelpCircle
                        size={48}
                        className="text-muted-foreground opacity-20 mb-4"
                      />
                      <h3 className="text-xl font-bold mb-2">
                        No active quiz selected
                      </h3>
                      <p className="text-muted-foreground mb-6">
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
                  value="settings"
                  className="mt-0 h-full focus-visible:outline-none"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                      <div className="bg-card border rounded-2xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold mb-4">Course Info</h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              Course Title
                            </label>
                            <Input
                              value={currentCourse.title}
                              onChange={(e) =>
                                updateCourse({ title: e.target.value })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              Slug / URL
                            </label>
                            <Input
                              value={currentCourse.slug}
                              onChange={(e) =>
                                updateCourse({ slug: e.target.value })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              Short Description
                            </label>
                            <Input
                              value={currentCourse.shortDescription}
                              onChange={(e) =>
                                updateCourse({
                                  shortDescription: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>

                      <div className="bg-card border rounded-2xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold mb-4">SEO Metadata</h3>
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
                              className="w-full min-h-[100px] rounded-xl border bg-background px-3 py-2 text-sm"
                              placeholder="Brief summary for search results..."
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-card border rounded-2xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold mb-4">
                          Publication Settings
                        </h3>
                        <div className="space-y-4">
                          <div className="p-3 bg-muted/50 rounded-xl flex items-center justify-between">
                            <span className="text-sm font-medium">
                              Free Course
                            </span>
                            <div className="w-10 h-6 bg-muted rounded-full relative">
                              <div className="absolute left-1 top-1 w-4 h-4 bg-background rounded-full shadow-sm"></div>
                            </div>
                          </div>
                          <div className="p-3 bg-muted/50 rounded-xl flex items-center justify-between">
                            <span className="text-sm font-medium">
                              Enable Certificates
                            </span>
                            <div className="w-10 h-6 bg-primary rounded-full relative">
                              <div className="absolute right-1 top-1 w-4 h-4 bg-background rounded-full shadow-sm"></div>
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
