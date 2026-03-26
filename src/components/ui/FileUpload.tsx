'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, FileText, Image as ImageIcon, Video, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from './progress';
import { Button } from './button';

export interface FileWithState {
  id: string;
  file: File;
  preview?: string;
  progress: number;
  status: 'idle' | 'uploading' | 'completed' | 'error';
  error?: string;
}

interface FileUploadProps {
  onFilesSelected?: (files: File[]) => void;
  onUploadComplete?: (files: File[]) => void;
  maxSize?: number; // In MB
  accept?: string[]; // e.g. ['.jpg', '.png', '.pdf']
  multiple?: boolean;
  className?: string;
}

export function FileUpload({
  onFilesSelected,
  onUploadComplete,
  maxSize = 10,
  accept = [],
  multiple = true,
  className,
}: FileUploadProps) {
  const [files, setFiles] = useState<FileWithState[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (maxSize && file.size > maxSize * 1024 * 1024) {
      return `File size exceeds ${maxSize}MB limit`;
    }
    if (accept.length > 0) {
      const extension = `.${file.name.split('.').pop()?.toLowerCase()}`;
      if (!accept.includes(extension) && !accept.includes(file.type)) {
        return `File type not supported. Supported: ${accept.join(', ')}`;
      }
    }
    return null;
  };

  const handleFiles = useCallback(
    (newFiles: FileList | File[]) => {
      const filesArray = Array.from(newFiles);
      const validatedFiles: FileWithState[] = filesArray.map((file) => {
        const error = validateFile(file);
        let preview: string | undefined;
        if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
          preview = URL.createObjectURL(file);
        }

        return {
          id: Math.random().toString(36).substr(2, 9),
          file,
          preview,
          progress: 0,
          status: error ? 'error' : 'idle',
          error: error || undefined,
        };
      });

      setFiles((prev) => (multiple ? [...prev, ...validatedFiles] : validatedFiles));
      if (onFilesSelected) {
        onFilesSelected(validatedFiles.filter((f) => !f.error).map((f) => f.file));
      }

      // Simulate upload for those without errors
      validatedFiles.forEach((fileState) => {
        if (!fileState.error) {
          simulateUpload(fileState.id);
        }
      });
    },
    [multiple, onFilesSelected, accept, maxSize]
  );

  const simulateUpload = (id: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: 'uploading' } : f))
    );

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === id ? { ...f, progress: 100, status: 'completed' } : f
          )
        );
      } else {
        setFiles((prev) =>
          prev.map((f) => (f.id === id ? { ...f, progress } : f))
        );
      }
    }, 400);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === id);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <ImageIcon className="w-5 h-5" />;
    if (file.type.startsWith('video/')) return <Video className="w-5 h-5" />;
    return <FileText className="w-5 h-5" />;
  };

  return (
    <div className={cn('w-full max-w-2xl mx-auto space-y-4', className)}>
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'relative p-10 border-2 border-dashed rounded-2xl transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-4 text-center',
          isDragging
            ? 'border-primary bg-primary/10 scale-[1.02] shadow-xl'
            : 'border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/50',
          'group overflow-hidden'
        )}
      >
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          multiple={multiple}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          accept={accept.join(',')}
        />

        <div className="p-4 rounded-full bg-secondary group-hover:bg-primary/20 transition-colors">
          <Upload className={cn('w-8 h-8 transition-transform group-hover:scale-110', isDragging ? 'text-primary' : 'text-muted-foreground')} />
        </div>

        <div>
          <p className="text-lg font-semibold">Drop files here or click to upload</p>
          <p className="text-sm text-muted-foreground">
            {accept.length > 0 ? accept.join(', ') : 'All files'} up to {maxSize}MB
          </p>
        </div>

        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="space-y-3"
          >
            {files.map((fileState) => (
              <motion.div
                key={fileState.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-card border rounded-xl p-4 flex items-center gap-4 group shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative w-12 h-12 flex-shrink-0 bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                  {fileState.preview && fileState.file.type.startsWith('image/') ? (
                    <img src={fileState.preview} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    getFileIcon(fileState.file)
                  )}
                  {fileState.status === 'completed' && (
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center backdrop-blur-[1px]">
                      <CheckCircle2 className="w-6 h-6 text-primary" />
                    </div>
                  )}
                </div>

                <div className="flex-grow min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium truncate">{fileState.file.name}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(fileState.id);
                      }}
                      className="text-muted-foreground hover:text-destructive transition-colors p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {fileState.error ? (
                    <div className="flex items-center gap-1.5 text-xs text-destructive">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{fileState.error}</span>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                        <span>{fileState.status}...</span>
                        <span>{Math.round(fileState.progress)}%</span>
                      </div>
                      <Progress value={fileState.progress} className="h-1" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
