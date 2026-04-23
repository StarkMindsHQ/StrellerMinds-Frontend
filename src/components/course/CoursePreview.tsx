import React, { useState } from 'react';
import CourseContent from './CourseContent';

interface CoursePreviewProps {
  course: Course;
}

export default function CoursePreview({ course }: CoursePreviewProps) {
  const [previewMode, setPreviewMode] = useState(false);

  return (
    <div>
      <button onClick={() => setPreviewMode(!previewMode)}>
        {previewMode ? 'Exit Preview' : 'Preview as Student'}
      </button>

      {previewMode ? (
        <CourseContent course={course} editable={false} />
      ) : (
        <CourseContent course={course} editable={true} />
      )}
    </div>
  );
}
