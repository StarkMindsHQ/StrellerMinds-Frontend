import Card from "@/components/Card";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { FeaturedCourses } from "@/components/FeaturedCourses"
import { allCourses } from "@/lib/course-data"
import "./globals.css";

export default function Home() {

  
  return (
    <main className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
      <Navbar />
      <div className="container mx-auto py-8 flex flex-col items-center">
        <h1 className="text-2xl font-bold">Welcome to our site</h1>
        {/* Rest of your content */}
        <FeaturedCourses courses={allCourses} maxCoursesToShow={3} />
      </div>
      <Footer />
    </main>
  );
}
