import { render, screen, fireEvent } from '@testing-library/react';
import CoursePreview from '../src/components/course/CoursePreview';

test('toggles preview mode', () => {
  const course = { title: 'Test Course', lessons: [{ id: '1', title: 'Intro', description: 'Welcome' }] };
  render(<CoursePreview course={course} />);

  fireEvent.click(screen.getByText('Preview as Student'));
  expect(screen.queryByText('Edit Lesson')).toBeNull();

  fireEvent.click(screen.getByText('Exit Preview'));
  expect(screen.getByText('Edit Lesson')).toBeInTheDocument();
});
