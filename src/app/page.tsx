import Hero from "@/components/Hero";
import FeatureCards from "@/components/FeatureCards";
import TestimonialsSection from "@/components/testimonial";
import { FeaturedCourses } from "@/components/FeaturedCourses";
import { allCourses } from "@/lib/course-data";
import MainLayout from "@/components/MainLayout";

export default function Home() {
  return (
    <MainLayout variant="full-width" padding="none">
      <Hero />
      <FeatureCards />
      <TestimonialsSection />

      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <h1 className="text-2xl font-bold">Welcome to our site</h1>
        <FeaturedCourses courses={allCourses} maxCoursesToShow={3} />
      </div>
    </MainLayout>
  );
}

