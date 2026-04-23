import React, { useState } from 'react';
import { uploadFile } from '../../services/uploadService';

interface UploadFile {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export default function BulkUploadManager() {
  const [files, setFiles] = useState<UploadFile[]>([]);

  const handleSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files).map(file => ({
        file,
        progress: 0,
        status: 'pending',
      }));
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const startUpload = async (uploadFile: UploadFile, index: number) => {
    try {
      setFiles(prev => {
        const updated = [...prev];
        updated[index].status = 'uploading';
        return updated;
      });

      await uploadFile.file.arrayBuffer(); // simulate reading
      await uploadFileToServer(uploadFile.file, (progress) => {
        setFiles(prev => {
          const updated = [...prev];
          updated[index].progress = progress;
          return updated;
        });
      });

      setFiles(prev => {
        const updated = [...prev];
        updated[index].status = 'success';
        return updated;
      });
    } catch (err: any) {
      setFiles(prev => {
        const updated = [...prev];
        updated[index].status = 'error';
        updated[index].error = err.message;
        return updated;
      });
    }
  };

  const retryUpload = (index: number) => {
    startUpload(files[index], index);
  };

  return (
    <div>
      <input type="file" multiple onChange={handleSelect} />
      <ul>
        {files.map((f, i) => (
          <li key={i}>
            {f.file.name} - {f.status}
            {f.status === 'uploading' && <progress value={f.progress} max={100} />}
            {f.status === 'error' && (
              <button onClick={() => retryUpload(i)}>Retry</button>
            )}
          </li>
        ))}
      </ul>
      <button onClick={() => files.forEach((f, i) => startUpload(f, i))}>
        Start Upload
      </button>
    </div>
  );
}

// Mock upload function
async function uploadFileToServer(file: File, onProgress: (progress: number) => void) {
  return new Promise<void>((resolve, reject) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      onProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        resolve();
      }
    }, 200);
  });
}
