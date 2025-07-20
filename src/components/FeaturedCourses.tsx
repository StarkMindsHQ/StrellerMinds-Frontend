"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { CourseCard } from "./CourseCard"
import type { EnhancedCourseData } from "@/lib/course-data"

// Course tab types for filtering
export type CourseTab = "popular" | "new" | "trending"

// Props interface for the FeaturedCourses component
export interface FeaturedCoursesProps {
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
    <section className="w-full p-6 my-20 lg:p-16">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-900 to-pink-600 bg-clip-text text-transparent">{title}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{subtitle}</p>
        </div>

        {/* Custom Tabs */}
        <div className="inline-flex justify-center rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
          <button
            onClick={() => setActiveTab("popular")}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
              activeTab === "popular"
                ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer"
            }`}
          >
            Popular
          </button>
          <button
            onClick={() => setActiveTab("new")}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "new"
                ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            New
          </button>
          <button
            onClick={() => setActiveTab("trending")}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "trending"
                ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            Trending
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {getCoursesForTab(activeTab).map((course) => (
            <CourseCard 
              key={course.id} 
              {...course}
              variant="featured"
              showFeatures={true}
              maxFeaturesDisplay={3}
            />
          ))}
        </div>
      </div>

      {hasMoreCourses && (
        <div className="mt-12 flex justify-center">
          <Link
            href="/courses"
            className="text-base inline-flex rounded-lg shadow border px-6 py-3 items-center font-semibold bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:opacity-90 transition-opacity"
          >
            View All Courses
            <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      )}
    </section>
  )
}

