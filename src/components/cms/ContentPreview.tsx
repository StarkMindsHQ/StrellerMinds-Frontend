'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  PlayCircle,
  FileText,
  CheckCircle2,
  Download,
  ChevronRight,
  Clock,
  BookOpen,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Lesson, Quiz, CourseModule } from '@/types/cms';

interface ContentPreviewProps {
  lesson?: Lesson;
  quiz?: Quiz;
  module?: CourseModule;
}

export function ContentPreview({ lesson, quiz, module }: ContentPreviewProps) {
  if (lesson) {
    return (
      <div className="bg-background min-h-screen">
        <div className="max-w-4xl mx-auto py-12 px-6">
          <div className="flex items-center gap-2 text-sm text-primary font-semibold uppercase tracking-wider mb-4">
            <BookOpen size={16} />
            Lesson Preview
          </div>
          <h1 className="text-4xl font-extrabold mb-6 tracking-tight">
            {lesson.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 py-4 border-y mb-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 uppercase font-bold tracking-tighter">
              <Clock size={16} className="text-primary" />
              {lesson.duration} Minutes
            </div>
            <div className="flex items-center gap-2 uppercase font-bold tracking-tighter">
              <FileText size={16} className="text-primary" />
              {lesson.type} CONTENT
            </div>
            {lesson.isFree && (
              <div className="bg-green-500/10 text-green-600 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-green-500/20">
                FREE PREVIEW
              </div>
            )}
          </div>

          {lesson.type === 'video' && (
            <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl mb-12 group relative cursor-pointer ring-1 ring-white/10">
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-20 h-20 bg-primary/90 text-white rounded-full flex items-center justify-center shadow-xl shadow-primary/20"
                >
                  <PlayCircle size={40} fill="currentColor" />
                </motion.div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                <div className="text-white">
                  <p className="text-sm font-medium opacity-80">Video Lesson</p>
                  <p className="text-lg font-bold">
                    Watch Chapter 1: Introduction
                  </p>
                </div>
                <div className="px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-lg text-white text-xs font-bold uppercase tracking-widest">
                  Preview Only
                </div>
              </div>
            </div>
          )}

          <div className="prose prose-lg prose-primary max-w-none dark:prose-invert">
            <div
              dangerouslySetInnerHTML={{
                __html: lesson.content.richText?.html || '',
              }}
            />
          </div>

          {lesson.attachments.length > 0 && (
            <div className="mt-16 p-8 bg-muted/30 rounded-3xl border shadow-sm">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Download size={20} className="text-primary" />
                Resources & Downloads
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {lesson.attachments.map((att) => (
                  <div
                    key={att.id}
                    className="p-4 bg-background border rounded-2xl flex items-center justify-between hover:border-primary transition-all group cursor-pointer shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                        <FileText size={20} />
                      </div>
                      <span className="font-semibold text-sm">{att.name}</span>
                    </div>
                    <Download
                      size={18}
                      className="text-muted-foreground group-hover:text-primary"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (quiz) {
    return (
      <div className="bg-muted/10 min-h-screen py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-card border rounded-[40px] p-12 shadow-2xl shadow-primary/5 text-center relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-primary/50 via-primary to-primary/50"></div>
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <HelpCircle size={48} className="text-primary" />
            </div>
            <h1 className="text-4xl font-black mb-4 tracking-tighter">
              {quiz.title}
            </h1>
            <p className="text-muted-foreground text-lg mb-10 max-w-md mx-auto leading-relaxed">
              {quiz.description ||
                'Test your knowledge and earn your certificate.'}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="p-6 bg-muted/30 rounded-3xl text-left border">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
                  Pass Score
                </p>
                <p className="text-2xl font-black">{quiz.passingScore}%</p>
              </div>
              <div className="p-6 bg-muted/30 rounded-3xl text-left border">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
                  Time Limit
                </p>
                <p className="text-2xl font-black">
                  {quiz.settings.timeLimit || 'None'}
                </p>
              </div>
            </div>

            <Button
              size="lg"
              className="h-16 px-12 rounded-full text-lg font-black tracking-tight group"
            >
              Start Final Quiz
              <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>

            <div className="mt-12 pt-8 border-t flex items-center justify-center gap-8 text-xs font-black uppercase tracking-widest text-muted-foreground">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-primary" />{' '}
                {quiz.questions.length} Questions
              </span>
              <span className="flex items-center gap-2">
                <AlertCircle size={14} className="text-primary" />{' '}
                {quiz.settings.attemptsAllowed} Attempts
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
