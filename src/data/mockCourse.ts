import { Course } from "@/types/course";

export const mockCourse: Course = {
  id: "course-1",
  title: "Frontend Mastery",
  lessons: [
    {
      id: "1",
      title: "Introduction",
      description: "Welcome to the course.",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
    {
      id: "2",
      title: "React Fundamentals",
      description: "Understanding components and props.",
      videoUrl: "https://www.w3schools.com/html/movie.mp4",
    },
    {
      id: "3",
      title: "Advanced State Management",
      description: "Context and beyond.",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
  ],
};
