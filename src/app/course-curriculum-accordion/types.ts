export interface Lesson {
  id: string;
  title: string;
  completed: boolean;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}
