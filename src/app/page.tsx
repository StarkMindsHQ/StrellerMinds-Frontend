import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { FeaturedCourses } from "@/components/FeaturedCourses"
import { allCourses } from "@/lib/course-data"
import "./globals.css";

export default function Home() {
  return (
    <main>
      <Navbar />
      {/* Your page content goes here */}
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold">Welcome to our site</h1>
        {/* Rest of your content */}
        <FeaturedCourses courses={allCourses} maxCoursesToShow={3} />
      </div>
      <Footer />
    </main>
  );
}