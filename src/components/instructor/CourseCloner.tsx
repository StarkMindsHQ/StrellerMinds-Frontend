'use client';

import React, { useState } from 'react';
import { Copy, Edit, Eye, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import type { EnhancedCourseData } from '@/lib/course-data';

export interface CourseCloneOptions {
  title: string;
  description: string;
  includeContent: boolean;
  includeStructure: boolean;
  includeSettings: boolean;
  newPrice?: number;
  status: 'draft' | 'published';
}

interface CourseClonerProps {
  course: EnhancedCourseData;
  onCloneComplete?: (clonedCourse: EnhancedCourseData) => void;
  className?: string;
}

export function CourseCloner({ course, onCloneComplete, className }: CourseClonerProps) {
  const [isCloning, setIsCloning] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [cloneOptions, setCloneOptions] = useState<CourseCloneOptions>({
    title: `${course.title} - Copy`,
    description: course.description,
    includeContent: true,
    includeStructure: true,
    includeSettings: false,
    status: 'draft',
  });
  const [cloneResult, setCloneResult] = useState<{
    success: boolean;
    message: string;
    clonedCourse?: EnhancedCourseData;
  } | null>(null);

  const handleClone = async () => {
    setIsCloning(true);
    setCloneResult(null);

    try {
      const response = await fetch('/api/courses/clone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalCourseId: course.id,
          cloneOptions,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to clone course');
      }

      const data = await response.json();
      const clonedCourse = data.data;

      setCloneResult({
        success: true,
        message: 'Course cloned successfully!',
        clonedCourse,
      });

      if (onCloneComplete) {
        onCloneComplete(clonedCourse);
      }

      // Close dialog after successful clone
      setTimeout(() => {
        setShowDialog(false);
        setCloneResult(null);
      }, 2000);
    } catch (error) {
      setCloneResult({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to clone course',
      });
    } finally {
      setIsCloning(false);
    }
  };

  const generateNewCourseId = (): string => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `${course.id}-clone-${timestamp}-${random}`;
  };

  const CloneDialogContent = () => (
    <div className="space-y-6">
      {/* Original Course Info */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-sm text-gray-700 mb-2">Original Course</h4>
        <div className="space-y-1">
          <p className="font-medium">{course.title}</p>
          <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
          <div className="flex gap-2 mt-2">
            <Badge variant="secondary">{course.level}</Badge>
            <Badge variant="outline">{course.durationHours}h</Badge>
            {course.price && <Badge variant="outline">${course.price}</Badge>}
          </div>
        </div>
      </div>

      {/* Clone Options */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="clone-title">Course Title</Label>
          <Input
            id="clone-title"
            value={cloneOptions.title}
            onChange={(e) => setCloneOptions(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Enter new course title"
          />
        </div>

        <div>
          <Label htmlFor="clone-description">Description</Label>
          <Textarea
            id="clone-description"
            value={cloneOptions.description}
            onChange={(e) => setCloneOptions(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Enter course description"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="clone-price">Price (optional)</Label>
          <Input
            id="clone-price"
            type="number"
            value={cloneOptions.newPrice || ''}
            onChange={(e) => setCloneOptions(prev => ({ 
              ...prev, 
              newPrice: e.target.value ? parseFloat(e.target.value) : undefined 
            }))}
            placeholder="Leave empty to keep original price"
          />
        </div>

        <div>
          <Label>Clone Options</Label>
          <div className="space-y-2 mt-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={cloneOptions.includeContent}
                onChange={(e) => setCloneOptions(prev => ({ ...prev, includeContent: e.target.checked }))}
                className="rounded"
              />
              <span className="text-sm">Include all lessons and content</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={cloneOptions.includeStructure}
                onChange={(e) => setCloneOptions(prev => ({ ...prev, includeStructure: e.target.checked }))}
                className="rounded"
              />
              <span className="text-sm">Include course structure and modules</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={cloneOptions.includeSettings}
                onChange={(e) => setCloneOptions(prev => ({ ...prev, includeSettings: e.target.checked }))}
                className="rounded"
              />
              <span className="text-sm">Include course settings and configurations</span>
            </label>
          </div>
        </div>

        <div>
          <Label>Status</Label>
          <div className="flex gap-2 mt-2">
            <Button
              type="button"
              variant={cloneOptions.status === 'draft' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCloneOptions(prev => ({ ...prev, status: 'draft' }))}
            >
              Draft
            </Button>
            <Button
              type="button"
              variant={cloneOptions.status === 'published' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCloneOptions(prev => ({ ...prev, status: 'published' }))}
            >
              Published
            </Button>
          </div>
        </div>
      </div>

      {/* Clone Result */}
      {cloneResult && (
        <Alert className={cloneResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
          <div className="flex items-center gap-2">
            {cloneResult.success ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={cloneResult.success ? 'text-green-800' : 'text-red-800'}>
              {cloneResult.message}
            </AlertDescription>
          </div>
        </Alert>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4">
        <Button
          onClick={handleClone}
          disabled={isCloning || !cloneOptions.title.trim()}
          className="flex-1"
        >
          {isCloning ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Cloning...
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              Clone Course
            </>
          )}
        </Button>
        <Button variant="outline" onClick={() => setShowDialog(false)}>
          Cancel
        </Button>
      </div>
    </div>
  );

  return (
    <div className={cn('w-full', className)}>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Copy className="h-4 w-4" />
            Clone Course
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Copy className="h-5 w-5" />
              Clone Course: {course.title}
            </DialogTitle>
          </DialogHeader>
          <CloneDialogContent />
        </DialogContent>
      </Dialog>
    </div>
  );
}
