import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CoursePreview from '@/components/course/CoursePreview';

describe('CoursePreview', () => {
  it('toggles preview mode', () => {
    const course = {
      title: 'Test Course',
      lessons: [{ id: '1', title: 'Intro', description: 'Welcome' }],
    };

    render(<CoursePreview course={course} />);

    expect(screen.getByText('Edit Lesson')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Preview as Student'));
    expect(screen.queryByText('Edit Lesson')).toBeNull();

    fireEvent.click(screen.getByText('Exit Preview'));
    expect(screen.getByText('Edit Lesson')).toBeInTheDocument();
  });
});
