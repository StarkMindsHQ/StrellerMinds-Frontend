import TestimonialsSection from '@/components/testimonial';
import { FeaturedCourses } from "@/components/FeaturedCourses";
import { allCourses } from "@/lib/course-data";

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto py-8 flex flex-col items-center">
        <h1 className="text-2xl font-bold">Welcome to StrellerMinds</h1>
        <TestimonialsSection />
        {/* Rest of your content */}
        <FeaturedCourses courses={allCourses} maxCoursesToShow={3} />
      </div>
    </main>
  );
}
