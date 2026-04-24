'use client';

import React, { useState } from 'react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import { 
  GripVertical, 
  Plus, 
  Trash2, 
  Edit3, 
  Video, 
  FileText, 
  HelpCircle, 
  ChevronDown, 
  ChevronRight,
  Save,
  Layout
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'quiz' | 'article';
}

interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
  isExpanded: boolean;
}

const INITIAL_DATA: Section[] = [
  {
    id: 's1',
    title: 'Introduction to Stellar',
    isExpanded: true,
    lessons: [
      { id: 'l1', title: 'What is Stellar?', type: 'video' },
      { id: 'l2', title: 'Stellar Ecosystem Overview', type: 'article' },
    ],
  },
  {
    id: 's2',
    title: 'Smart Contract Basics',
    isExpanded: true,
    lessons: [
      { id: 'l3', title: 'Setting up your environment', type: 'video' },
      { id: 'l4', title: 'Your first Soroban contract', type: 'video' },
      { id: 'l5', title: 'Quiz: Basic Concepts', type: 'quiz' },
    ],
  },
];

export const CurriculumBuilder: React.FC = () => {
  const [sections, setSections] = useState<Section[]>(INITIAL_DATA);
  const [isSaving, setIsSaving] = useState(false);

  const addSection = () => {
    const newSection: Section = {
      id: `s-${Date.now()}`,
      title: 'New Section',
      lessons: [],
      isExpanded: true,
    };
    setSections([...sections, newSection]);
  };

  const addLesson = (sectionId: string) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          lessons: [
            ...section.lessons,
            { id: `l-${Date.now()}`, title: 'New Lesson', type: 'video' }
          ]
        };
      }
      return section;
    }));
  };

  const deleteSection = (sectionId: string) => {
    setSections(sections.filter(s => s.id !== sectionId));
    toast.success('Section deleted');
  };

  const deleteLesson = (sectionId: string, lessonId: string) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          lessons: section.lessons.filter(l => l.id !== lessonId)
        };
      }
      return section;
    }));
  };

  const toggleSection = (sectionId: string) => {
    setSections(sections.map(section => 
      section.id === sectionId ? { ...section, isExpanded: !section.isExpanded } : section
    ));
  };

  const updateSectionTitle = (sectionId: string, title: string) => {
    setSections(sections.map(section => 
      section.id === sectionId ? { ...section, title } : section
    ));
  };

  const updateLessonTitle = (sectionId: string, lessonId: string, title: string) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          lessons: section.lessons.map(lesson => 
            lesson.id === lessonId ? { ...lesson, title } : lesson
          )
        };
      }
      return section;
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Curriculum saved successfully');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Course Curriculum</h2>
          <p className="text-sm text-gray-500">Plan and organize your course content</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={addSection} className="rounded-xl border-gray-200">
            <Plus className="w-4 h-4 mr-2" />
            Add Section
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="bg-[#5c0f49] hover:bg-[#4a0c3b] text-white rounded-xl shadow-lg shadow-purple-100"
          >
            {isSaving ? (
              <span className="flex items-center">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Saving...
              </span>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Structure
              </>
            )}
          </Button>
        </div>
      </div>

      <Reorder.Group axis="y" values={sections} onReorder={setSections} className="space-y-4">
        <AnimatePresence>
          {sections.map((section) => (
            <Reorder.Item
              key={section.id}
              value={section}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="p-4 flex items-center gap-4 bg-gray-50/50">
                <div className="cursor-grab active:cursor-grabbing text-gray-400">
                  <GripVertical className="w-5 h-5" />
                </div>
                <button 
                  onClick={() => toggleSection(section.id)}
                  className="p-1 hover:bg-gray-200 rounded-md transition-colors"
                >
                  {section.isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </button>
                <div className="flex-1">
                  <Input 
                    value={section.title}
                    onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                    className="border-none bg-transparent font-bold text-lg focus-visible:ring-0 px-0 h-auto"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium bg-white px-2 py-1 rounded-md text-gray-500 border border-gray-200">
                    {section.lessons.length} lessons
                  </span>
                  <Button variant="ghost" size="icon" onClick={() => deleteSection(section.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <AnimatePresence>
                {section.isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 pt-0 space-y-2 ml-12 pr-6 pb-6">
                      <Reorder.Group 
                        axis="y" 
                        values={section.lessons} 
                        onReorder={(newLessons) => {
                          setSections(sections.map(s => s.id === section.id ? { ...s, lessons: newLessons } : s));
                        }}
                        className="space-y-2"
                      >
                        {section.lessons.map((lesson) => (
                          <Reorder.Item
                            key={lesson.id}
                            value={lesson}
                            className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl hover:border-purple-200 hover:shadow-sm transition-all group"
                          >
                            <div className="cursor-grab active:cursor-grabbing text-gray-300">
                              <GripVertical className="w-4 h-4" />
                            </div>
                            <div className="p-2 bg-gray-50 rounded-lg text-gray-500">
                              {lesson.type === 'video' && <Video className="w-4 h-4" />}
                              {lesson.type === 'article' && <FileText className="w-4 h-4" />}
                              {lesson.type === 'quiz' && <HelpCircle className="w-4 h-4" />}
                            </div>
                            <div className="flex-1">
                              <Input 
                                value={lesson.title}
                                onChange={(e) => updateLessonTitle(section.id, lesson.id, e.target.value)}
                                className="border-none bg-transparent text-sm focus-visible:ring-0 px-0 h-auto"
                              />
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => deleteLesson(section.id, lesson.id)}
                              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </Reorder.Item>
                        ))}
                      </Reorder.Group>
                      
                      <Button 
                        variant="ghost" 
                        onClick={() => addLesson(section.id)}
                        className="w-full mt-4 border-2 border-dashed border-gray-100 hover:border-purple-100 hover:bg-purple-50/30 text-gray-500 rounded-xl py-8 flex flex-col gap-2"
                      >
                        <div className="p-2 bg-white rounded-full shadow-sm">
                          <Plus className="w-5 h-5 text-[#5c0f49]" />
                        </div>
                        <span className="text-sm font-medium">Add a lesson to this section</span>
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Reorder.Item>
          ))}
        </AnimatePresence>
      </Reorder.Group>

      {sections.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
          <div className="bg-gray-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Layout className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Your curriculum is empty</h3>
          <p className="text-gray-500 mb-6">Start by adding your first section</p>
          <Button onClick={addSection} className="bg-[#5c0f49] hover:bg-[#4a0c3b] text-white px-8 py-6 rounded-xl font-bold">
            <Plus className="w-5 h-5 mr-2" />
            Add First Section
          </Button>
        </div>
      )}
    </div>
  );
};
