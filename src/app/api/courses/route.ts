import { NextRequest } from "next/server"
import { allCourses } from "@/lib/course-data"
import { courseQuerySchema } from "@/lib/validations"
import { validateQueryParams, createApiSuccess, handleApiError } from "@/lib/api-validation"

export async function GET(request: NextRequest) {
  try {
    // Validate query parameters
    const queryValidation = validateQueryParams(request, courseQuerySchema)
    if (!queryValidation.success) {
      return queryValidation.response
    }

    const { tab, limit } = queryValidation.data

    // Filter courses based on the tab
    let filteredCourses = [...allCourses]

    switch (tab) {
      case "popular":
        // Sort by popularity (highest first)
        filteredCourses.sort((a, b) => b.popularity - a.popularity)
        break
      case "new":
        // Sort by date added (newest first)
        filteredCourses.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
        break
      case "trending":
        // Sort by trending score (highest first)
        filteredCourses.sort((a, b) => b.trendingScore - a.trendingScore)
        break
    }

    // Apply limit if specified
    if (limit > 0) {
      filteredCourses = filteredCourses.slice(0, limit)
    }

    return createApiSuccess("Courses retrieved successfully", { courses: filteredCourses })
  } catch (error) {
    return handleApiError(error, "GET /api/courses")
  }
}

