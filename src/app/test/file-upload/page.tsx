'use client';

import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { FileUpload } from '@/components/ui/FileUpload';

export default function FileUploadTestPage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(files);
    console.log('Selected files:', files);
  };

  return (
    <MainLayout variant="container">
      <div className="space-y-12 py-10">
        <div className="flex flex-col items-center gap-6 text-center">
          <h1 className="text-4xl font-bold">File Upload Component</h1>
          <p className="text-muted-foreground max-w-2xl">
            Test the premium file upload component below. It supports
            drag-and-drop, multiple file selection, type/size validation, and
            previews.
          </p>
        </div>

        <section className="space-y-6">
          <div className="bg-card p-10 rounded-3xl border border-border shadow-sm">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Default Multipurpose Upload
            </h2>
            <FileUpload
              onFilesSelected={handleFilesSelected}
              maxSize={5}
              accept={['.jpg', '.jpeg', '.png', '.pdf', '.mp4']}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card p-8 rounded-2xl border border-border">
              <h3 className="text-xl font-bold mb-4">Images Only (Max 2MB)</h3>
              <FileUpload
                multiple={false}
                maxSize={2}
                accept={['image/jpeg', 'image/png', 'image/webp']}
                className="max-w-full"
              />
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border">
              <h3 className="text-xl font-bold mb-4">Videos Only (Max 50MB)</h3>
              <FileUpload
                maxSize={50}
                accept={['video/mp4', 'video/quicktime']}
                className="max-w-full"
              />
            </div>
          </div>
        </section>

        {selectedFiles.length > 0 && (
          <div className="p-6 bg-secondary/50 rounded-xl border border-secondary">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-2">
              Debug Info:
            </h3>
            <p className="text-sm text-muted-foreground">
              {selectedFiles.length} valid files ready for processing.
            </p>
            <ul className="mt-2 text-xs space-y-1 list-disc list-inside">
              {selectedFiles.map((file, i) => (
                <li key={i}>
                  {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
