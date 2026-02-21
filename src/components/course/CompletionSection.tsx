"use client";

import { useCourse } from "@/contexts/CourseContext";

export default function CompletionSection() {
  const {
    activeLessonId,
    completedLessons,
    markLessonComplete,
    lessons,
  } = useCourse();

  const isCompleted = completedLessons.includes(activeLessonId);

  const currentIndex = lessons.findIndex(
    (l) => l.id === activeLessonId
  );

  const isLastLesson = currentIndex === lessons.length - 1;

  return (
    <div className="mt-10 p-6 rounded-xl border bg-gray-50 transition-all">
      {!isCompleted ? (
        <button
          onClick={() => markLessonComplete(activeLessonId)}
          className="w-full md:w-auto px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition duration-200"
        >
          Mark Lesson as Complete
        </button>
      ) : (
        <div className="space-y-4">
          <p className="text-green-600 font-semibold">
            Lesson completed ✓
          </p>

          {!isLastLesson ? (
            <button
              onClick={() => markLessonComplete(activeLessonId)}
              className="px-6 py-3 rounded-lg bg-black text-white hover:bg-gray-800 transition duration-200"
            >
              Continue Learning
            </button>
          ) : (
            <p className="text-gray-600 font-medium">
              🎉 Course Completed!
            </p>
          )}
        </div>
      )}
    </div>
  );
}
