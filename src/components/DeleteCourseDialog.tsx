'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface DeleteCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseTitle: string;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export function DeleteCourseDialog({
  open,
  onOpenChange,
  courseTitle,
  onConfirm,
  isDeleting = false,
}: DeleteCourseDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <DialogTitle>Delete Course</DialogTitle>
          </div>
          <DialogDescription className="pt-4">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              &ldquo;{courseTitle}&rdquo;
            </span>
            ? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? 'Deleting...' : 'Delete Course'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
