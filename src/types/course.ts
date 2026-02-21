export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
}

export interface Course {
  id: string;
  title: string;
  lessons: Lesson[];
  
}
