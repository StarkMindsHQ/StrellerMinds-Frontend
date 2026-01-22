import Hero from '@/components/Hero';
import FeatureCards from '@/components/FeatureCards';
import TestimonialsSection from '@/components/testimonial';
import { FeaturedCourses } from '@/components/FeaturedCourses';
import { allCourses } from '@/lib/course-data';
import MainLayout from '@/components/MainLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Start Your Blockchain Journey',
  description:
    'Join StrellerMinds to master blockchain technology. Explore expert-led courses in DeFi, Smart Contracts, and Web3 development with real-world applications.',
  openGraph: {
    title: 'StrellerMinds | Leading Blockchain & DeFi Education',
    description:
      'Join StrellerMinds to master blockchain technology. Explore expert-led courses in DeFi, Smart Contracts, and Web3 development.',
  },
};

export default function Home() {
  return (
    <MainLayout variant="full-width" padding="none">
      <Hero />
      <FeatureCards />
      <TestimonialsSection />

      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <h1 className="text-4xl font-extrabold text-center mb-8">
          Master the Future of Blockchain with StrellerMinds
        </h1>
        <FeaturedCourses courses={allCourses} maxCoursesToShow={3} />
      </div>
    </MainLayout>
  );
}
