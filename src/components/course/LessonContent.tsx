"use client";

import { useCourse } from "@/contexts/CourseContext";
import VideoContainer from "./VideoContainer";
import CompletionSection from "./CompletionSection";
import ProgressBar from "./ProgressBar";



export default function LessonContent() {
  const { lessons, activeLessonId } = useCourse();

  const lesson = lessons.find(l => l.id === activeLessonId);

  if (!lesson) return null;

  return (
<div
  key={lesson.id}
  className="w-full max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-10 space-y-6 animate-fade"
>
      
      {/* Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">
          {lesson.title}
        </h1>
        <p className="text-gray-600 mt-2 text-sm md:text-base">
          {lesson.description}
        </p>
      </div>
{/* Title */}
<div>
  <h1 className="text-2xl md:text-3xl font-bold">
    {lesson.title}
  </h1>
  <p className="text-gray-600 mt-2 text-sm md:text-base">
    {lesson.description}
  </p>

  <div className="mt-6">
    <ProgressBar />
  </div>
</div>

      {/* Video */}
      <VideoContainer videoUrl={lesson.videoUrl} />

      {/* Completion */}
      <CompletionSection />
    </div>
  );
}
