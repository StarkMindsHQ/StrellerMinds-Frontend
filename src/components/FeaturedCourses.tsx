"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { CourseCard, type CourseCardProps } from "@/components/CourseCard"
import type { EnhancedCourseData } from "@/lib/course-data"

// To define the course data interface
export interface CourseData extends Omit<CourseCardProps, "id"> {
  id: string
}

// To define the tab types
type CourseTab = "popular" | "new" | "trending"

interface FeaturedCoursesProps {
  title?: string
  subtitle?: string
  courses: EnhancedCourseData[]
  defaultTab?: CourseTab
  maxCoursesToShow?: number
}

export function FeaturedCourses({
  title = "Featured Courses",
  subtitle = "Expand your blockchain knowledge with our expert-led courses",
  courses,
  defaultTab = "popular",
  maxCoursesToShow = 3,
}: FeaturedCoursesProps) {
  const [activeTab, setActiveTab] = useState<CourseTab>(defaultTab)

  // To filter courses based on the active tab
  const getCoursesForTab = (tab: CourseTab): EnhancedCourseData[] => {
    let filteredCourses: EnhancedCourseData[] = []

    switch (tab) {
      case "popular":
        // Sort by popularity (highest first)
        filteredCourses = [...courses].sort((a, b) => b.popularity - a.popularity)
        break
      case "new":
        // Sort by date added (newest first)
        filteredCourses = [...courses].sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
        break
      case "trending":
        // Sort by trending score (highest first)
        filteredCourses = [...courses].sort((a, b) => b.trendingScore - a.trendingScore)
        break
      default:
        filteredCourses = courses
    }

    // To limit the number of courses shown
    return filteredCourses.slice(0, maxCoursesToShow)
  }

  // To check if there are more courses than what we're showing
  const hasMoreCourses = courses.length > maxCoursesToShow

  return (
    <section className="w-full border-x border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950 my-20 lg:p-16">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
        </div>

        {/* Custom Tabs */}
        <div className="inline-flex justify-center rounded-md bg-gray-100 p-1 dark:bg-gray-800">
          <button
            onClick={() => setActiveTab("popular")}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
              activeTab === "popular"
                ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-100 cursor-pointer"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer"
            }`}
          >
            Popular
          </button>
          <button
            onClick={() => setActiveTab("new")}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              activeTab === "new"
                ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-100"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            New
          </button>
          <button
            onClick={() => setActiveTab("trending")}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              activeTab === "trending"
                ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-100"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            Trending
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "popular" && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {getCoursesForTab("popular").map((course) => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>
        )}

        {activeTab === "new" && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {getCoursesForTab("new").map((course) => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>
        )}

        {activeTab === "trending" && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {getCoursesForTab("trending").map((course) => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>
        )}
      </div>

      {hasMoreCourses && (
        <div className="mt-20 flex justify-center ">
          <Link
            href="/courses"
            className="text-base inline-flex rounded-lg shadow border px-6 py-2 items-center font-semibold text-gray-900 hover:text-gray-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            View All Courses
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      )}
    </section>
  )
}

