import axios from 'axios';

export async function uploadFile(file: File, onProgress: (progress: number) => void) {
  const formData = new FormData();
  formData.append('file', file);

  await axios.post('/api/upload', formData, {
    onUploadProgress: (event) => {
      const percent = Math.round((event.loaded * 100) / event.total);
      onProgress(percent);
    },
  });
}
