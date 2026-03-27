import CourseAccordion from './CourseAccordion';
import type { Module } from './types';

const modules: Module[] = [
  {
    id: 'module-1',
    title: 'Introduction',
    lessons: [
      { id: 'lesson-1', title: 'Welcome', completed: true },
      { id: 'lesson-2', title: 'Setup', completed: false },
    ],
  },
  {
    id: 'module-2',
    title: 'Advanced Topics',
    lessons: [
      { id: 'lesson-3', title: 'Hooks', completed: false },
      { id: 'lesson-4', title: 'Context API', completed: false },
    ],
  },
];

export default function Page() {
  return (
    <div style={{ padding: '24px' }}>
      <h1>Course Curriculum Accordion Demo</h1>
      <CourseAccordion modules={modules} currentLessonId="lesson-2" />
    </div>
  );
}
