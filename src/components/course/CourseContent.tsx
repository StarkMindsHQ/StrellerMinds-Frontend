import React from 'react';

interface CourseLesson {
  id: string;
  title: string;
  description?: string;
}

interface CourseContentProps {
  course: {
    title: string;
    lessons: CourseLesson[];
  };
  editable: boolean;
}

export default function CourseContent({
  course,
  editable,
}: CourseContentProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{course.title}</h2>
      {course.lessons.map((lesson) => (
        <div
          key={lesson.id}
          className="rounded-lg border border-border p-4"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-medium">{lesson.title}</h3>
              {lesson.description ? (
                <p className="text-sm text-muted-foreground">
                  {lesson.description}
                </p>
              ) : null}
            </div>
            {editable ? <button>Edit Lesson</button> : <span>Student View</span>}
          </div>
        </div>
      ))}
    </div>
  );
}
