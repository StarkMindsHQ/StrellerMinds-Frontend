'use client';

import React, { useState, useEffect } from 'react';
import { CourseRecommendationCarousel } from '@/components/CourseRecommendationCarousel';
import { type CourseCardProps } from '@/components/CourseCard';

// Mock data demonstrating different course variations
const MOCK_COURSES: CourseCardProps[] = [
  {
    id: 'course-1',
    title: 'Advanced Web Development with Next.js & React',
    description:
      'Master server-side rendering, static site generation, and build scalable React applications from scratch.',
    level: 'Advanced',
    durationHours: 40,
    studentsCount: 15420,
    rating: 4.8,
    imageUrl: '', // Blank will use PlaceholderSVG
    instructor: 'Sarah Drasner',
    features: [
      'Next.js 14 App Router',
      'React Server Components',
      'Tailwind CSS Integration',
    ],
    tags: ['Web Dev', 'React', 'Frontend'],
    price: 99.99,
    originalPrice: 149.99,
    variant: 'default',
  },
  {
    id: 'course-2',
    title: 'Complete Python Bootcamp: Go from zero to hero',
    description:
      'Learn Python like a Professional. Start from the basics and go all the way to creating your own applications and games.',
    level: 'Beginner',
    durationHours: 22,
    studentsCount: 231500,
    rating: 4.6,
    imageUrl: '',
    instructor: 'Jose Portilla',
    features: [
      'Python 3 Basics',
      'Object Oriented Programming',
      'Data Science Intro',
    ],
    tags: ['Python', 'Programming'],
    variant: 'default',
  },
  {
    id: 'course-3',
    title: 'UI/UX Design Masterclass: Design Better Products',
    description:
      'Learn designing user interfaces and user experiences matching modern industry standards for web and mobile.',
    level: 'Intermediate',
    durationHours: 15,
    studentsCount: 8400,
    rating: 4.9,
    imageUrl: '',
    instructor: 'Gary Simon',
    features: ['Figma Mastery', 'Wireframing', 'Prototyping', 'User Research'],
    tags: ['Design', 'UI/UX', 'Figma'],
    price: 49.99,
    variant: 'default',
  },
  {
    id: 'course-4',
    title: 'Machine Learning A-Z: Hands-On Python & R',
    description:
      'Learn to create Machine Learning Algorithms in Python and R from two Data Science experts. Code templates included.',
    level: 'Advanced',
    durationHours: 44,
    studentsCount: 98000,
    rating: 4.7,
    imageUrl: '',
    instructor: 'Kirill Eremenko',
    features: ['Supervised Learning', 'Deep Learning', 'NLP'],
    tags: ['AI', 'Data Science', 'Python'],
    variant: 'default',
  },
  {
    id: 'course-5',
    title: 'Blockchain and Cryptocurrency Explained',
    description:
      'Understand the fundamental concepts of blockchain, Bitcoin, Ethereum, smart contracts and Web3 technologies.',
    level: 'Beginner',
    durationHours: 8,
    studentsCount: 12500,
    rating: 4.5,
    imageUrl: '',
    instructor: 'Andreas Antonopoulos',
    features: [
      'Cryptography Basics',
      'Consensus Mechanisms',
      'Wallet Security',
    ],
    tags: ['Blockchain', 'Web3', 'Crypto'],
    variant: 'default',
  },
];

export default function CourseRecommendationCarouselExample() {
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState<CourseCardProps[]>([]);

  // Simulate an API call
  useEffect(() => {
    const timer = setTimeout(() => {
      setCourses(MOCK_COURSES);
      setIsLoading(false);
    }, 2500); // Simulate network latency

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 md:p-12 space-y-12">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Main interactive example */}
        <CourseRecommendationCarousel
          title="Recommended For You"
          description="Hand-picked courses to help you advance your career based on your recent activity."
          courses={courses}
          isLoading={isLoading}
          autoScroll={true}
          autoScrollInterval={4000} // Custom scroll interval
        />

        {/* Example with featured UI format and loaded static data */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <CourseRecommendationCarousel
            title={
              <span className="flex items-center gap-2">
                <span className="text-blue-500">🔥</span> Trending This Week
              </span>
            }
            description="The most popular classes our students are taking right now."
            courses={MOCK_COURSES.map((c) => ({ ...c, variant: 'featured' }))}
            autoScroll={false} // Disabled autoScroll
            isLoading={false}
          />
        </div>

        {/* Example with compact cards */}
        <CourseRecommendationCarousel
          title="Quick Skills Update"
          description="Short on time? Try these rapid courses."
          courses={MOCK_COURSES.map((c) => ({ ...c, variant: 'compact' }))}
          autoScroll={true}
          isLoading={false}
          className="pt-0 bg-transparent"
        />
      </div>
    </div>
  );
}
