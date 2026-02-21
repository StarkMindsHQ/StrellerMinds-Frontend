"use client";

import { useCourse } from "@/contexts/CourseContext";
import LessonItem from "./LessonItem";

export default function LessonSidebar() {
  const {
    lessons,
    activeLessonId,
    setActiveLesson,
    isLessonLocked,
  } = useCourse();

  return (
    <div className="w-full p-4 space-y-2">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
        Lessons
      </h2>

      {lessons.map((lesson) => {
        const locked = isLessonLocked(lesson.id);

        return (
          <LessonItem
            key={lesson.id}
            id={lesson.id}
            title={lesson.title}
            isActive={activeLessonId === lesson.id}
            isLocked={locked}
            onClick={() => {
              if (!locked) {
                setActiveLesson(lesson.id);
              }
            }}
          />
        );
      })}
    </div>
  );
}
