export interface Course {
  id: string;
  title: string;
  category: string;
  creditHours: number;
  isActive: boolean;
  description?: string;
  instructor?: string;
}

export interface CourseListResponse {
  courses: Course[];
  total: number;
}

const MOCK_COURSES: Course[] = [
  {
    id: '1',
    title: 'Advanced Machine Learning',
    category: 'Computer Science',
    creditHours: 3,
    isActive: true,
    description:
      'Deep dive into neural networks, deep learning, and modern ML architectures',
    instructor: 'Dr. Sarah Chen',
  },
  {
    id: '2',
    title: 'Digital Marketing Strategy',
    category: 'Business',
    creditHours: 3,
    isActive: true,
    description:
      'Comprehensive study of digital marketing channels and analytics',
    instructor: 'Prof. Michael Torres',
  },
  {
    id: '3',
    title: 'Contemporary Art History',
    category: 'Arts & Humanities',
    creditHours: 2,
    isActive: true,
    description:
      'Exploration of modern and contemporary art movements from 1945 to present',
    instructor: 'Dr. Emma Watson',
  },
  {
    id: '4',
    title: 'Quantum Physics',
    category: 'Physics',
    creditHours: 4,
    isActive: true,
    description: 'Introduction to quantum mechanics and its applications',
    instructor: 'Prof. James Anderson',
  },
  {
    id: '5',
    title: 'Mobile App Development',
    category: 'Computer Science',
    creditHours: 3,
    isActive: true,
    description: 'Build native and cross-platform mobile applications',
    instructor: 'Dr. Lisa Park',
  },
  {
    id: '6',
    title: 'Environmental Economics',
    category: 'Economics',
    creditHours: 3,
    isActive: false,
    description: 'Economic analysis of environmental issues and sustainability',
    instructor: 'Prof. Robert Green',
  },
  {
    id: '7',
    title: 'Creative Writing Workshop',
    category: 'Arts & Humanities',
    creditHours: 2,
    isActive: true,
    description:
      'Develop your voice through fiction, poetry, and narrative techniques',
    instructor: 'Dr. Amanda Rivers',
  },
  {
    id: '8',
    title: 'Blockchain & Cryptocurrency',
    category: 'Computer Science',
    creditHours: 3,
    isActive: true,
    description:
      'Understanding distributed ledger technology and digital currencies',
    instructor: 'Prof. David Kim',
  },
  {
    id: '9',
    title: 'Global Supply Chain Management',
    category: 'Business',
    creditHours: 3,
    isActive: true,
    description:
      'Managing international logistics and supply chain optimization',
    instructor: 'Dr. Maria Rodriguez',
  },
  {
    id: '10',
    title: 'Introduction to Neuroscience',
    category: 'Biology',
    creditHours: 4,
    isActive: false,
    description: 'Study of the nervous system and brain function',
    instructor: 'Prof. Thomas Wright',
  },
];

export interface FetchCoursesOptions {
  simulateDelay?: number;
  simulateError?: boolean;
}

export interface FetchCourseByIdOptions {
  simulateDelay?: number;
  simulateError?: boolean;
}

export const courseService = {
  async fetchCourses(
    options: FetchCoursesOptions = {},
  ): Promise<CourseListResponse> {
    const { simulateDelay = 1000, simulateError = false } = options;

    await new Promise((resolve) => setTimeout(resolve, simulateDelay));

    if (simulateError) {
      throw new Error('Failed to fetch courses. Please try again later.');
    }

    return {
      courses: MOCK_COURSES,
      total: MOCK_COURSES.length,
    };
  },

  async fetchCourseById(
    id: string,
    options: FetchCourseByIdOptions = {},
  ): Promise<Course | null> {
    const { simulateDelay = 800, simulateError = false } = options;

    await new Promise((resolve) => setTimeout(resolve, simulateDelay));

    if (simulateError) {
      throw new Error(
        'Failed to fetch course details. Please try again later.',
      );
    }

    const course = MOCK_COURSES.find((c) => c.id === id);
    return course || null;
  },
};
