import { CourseCard } from "@/components/CourseCard"
import { allCourses } from "@/lib/course-data"
import MainLayout from "@/components/MainLayout"

export default function CoursesPage() {
  return (
    <MainLayout variant="container" padding="medium">
    <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">All Courses</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Browse our complete catalog of blockchain courses and enhance your skills with expert-led content
        </p>
    </div>

      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {allCourses.map((course) => (
          <CourseCard 
            key={course.id} 
            {...course}
            variant="default"
            showFeatures={true}
            maxFeaturesDisplay={4}
            className="transition-transform duration-300 hover:scale-[1.02]"
          />
        ))}
      </div>
    </MainLayout>
  )
}

