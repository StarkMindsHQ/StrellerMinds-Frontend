import Hero from "@/components/Hero";
import FeatureCards from "@/components/FeatureCards";
import TestimonialsSection from "@/components/testimonial";
import { FeaturedCourses } from "@/components/FeaturedCourses";
import { allCourses } from "@/lib/course-data";

export default function Home() {
  return (
    <main className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
      <Hero />
      <FeatureCards />
      <TestimonialsSection />

      <div className="container mx-auto py-8 flex flex-col items-center">
        <h1 className="text-2xl font-bold">Welcome to our site</h1>
        <FeaturedCourses courses={allCourses} maxCoursesToShow={3} />
      </div>
    </main>
  );
}

