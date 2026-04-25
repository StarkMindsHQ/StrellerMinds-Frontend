'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Clock, Zap } from 'lucide-react';

interface Section {
  id: string;
  title: string;
  completed: boolean;
  duration?: number; // in minutes
}

interface LessonProgressTrackerProps {
  title: string;
  sections: Section[];
  onSectionComplete?: (sectionId: string) => void;
  onProgressChange?: (progress: number) => void;
  autoSave?: boolean;
}

const LessonProgressTracker: React.FC<LessonProgressTrackerProps> = ({
  title,
  sections: initialSections,
  onSectionComplete,
  onProgressChange,
  autoSave = true,
}) => {
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [startTime] = useState(Date.now());

  const completedCount = sections.filter((s) => s.completed).length;
  const progressPercentage = (completedCount / sections.length) * 100;

  useEffect(() => {
    onProgressChange?.(progressPercentage);
  }, [progressPercentage, onProgressChange]);

  useEffect(() => {
    if (autoSave) {
      const timer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000 / 60); // in minutes
        setTotalTimeSpent(elapsed);
      }, 60000); // Update every minute

      return () => clearInterval(timer);
    }
  }, [autoSave, startTime]);

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const markSectionComplete = (sectionId: string) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId ? { ...section, completed: true } : section
      )
    );
    onSectionComplete?.(sectionId);
    setExpandedSection(sectionId);
  };

  const resetProgress = () => {
    setSections((prevSections) =>
      prevSections.map((section) => ({ ...section, completed: false }))
    );
    setTotalTimeSpent(0);
  };

  const totalDuration = sections.reduce((sum, section) => sum + (section.duration || 0), 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{title}</CardTitle>
              <p className="text-sm text-gray-600 mt-2">
                Progress: {completedCount} of {sections.length} sections
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={resetProgress}>
              Reset
            </Button>
          </div>

          <div className="mt-4 space-y-3">
            <Progress value={progressPercentage} className="h-3" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 text-blue-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium">Completed</span>
                </div>
                <p className="text-xl font-bold text-blue-700 mt-1">{completedCount}/{sections.length}</p>
              </div>

              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 text-purple-600">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">Time Spent</span>
                </div>
                <p className="text-xl font-bold text-purple-700 mt-1">{totalTimeSpent} min</p>
              </div>

              <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center gap-2 text-orange-600">
                  <Zap className="h-4 w-4" />
                  <span className="font-medium">Est. Duration</span>
                </div>
                <p className="text-xl font-bold text-orange-700 mt-1">{totalDuration} min</p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-2">
            {sections.map((section, index) => (
              <div
                key={section.id}
                className="border rounded-lg overflow-hidden transition-all hover:shadow-md"
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    {section.completed ? (
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    )}
                    <span className={`font-medium ${section.completed ? 'line-through text-gray-500' : ''}`}>
                      {index + 1}. {section.title}
                    </span>
                    {section.duration && (
                      <Badge variant="secondary" className="ml-auto">
                        {section.duration} min
                      </Badge>
                    )}
                  </div>
                </button>

                {expandedSection === section.id && (
                  <div className="px-4 py-3 border-t bg-white space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">Status: {section.completed ? 'Completed' : 'In Progress'}</p>
                        {section.duration && (
                          <p className="text-sm text-gray-600">Duration: {section.duration} minutes</p>
                        )}
                      </div>
                    </div>

                    {!section.completed && (
                      <Button
                        onClick={() => markSectionComplete(section.id)}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark as Complete
                      </Button>
                    )}

                    {section.completed && (
                      <Badge className="w-full justify-center py-2 bg-green-100 text-green-800">
                        ✓ Completed
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">You're {Math.round(progressPercentage)}% through this lesson</p>
            <p className="text-lg font-semibold text-gray-900">
              {progressPercentage === 100 ? '🎉 Lesson Complete!' : `Keep going! ${sections.length - completedCount} sections to go`}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LessonProgressTracker;
