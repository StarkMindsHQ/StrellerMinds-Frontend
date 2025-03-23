import { Clock, Users, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { PlaceholderSVG } from "./PlaceholderSVG"

export type CourseLevel = "Beginner" | "Intermediate" | "Advanced"

export interface CourseCardProps {
  id: string
  title: string
  description: string
  level: CourseLevel
  durationHours: number
  studentsCount: number
  rating: number
  imageUrl: string
}

export function CourseCard({
  id,
  title,
  description,
  level,
  durationHours,
  studentsCount,
  rating,
  imageUrl,
}: CourseCardProps) {
  // Map level to appropriate badge styles - using more generic classes
  const getBadgeStyles = (level: CourseLevel): string => {
    switch (level) {
      case "Beginner":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "Intermediate":
        return "bg-gray-100 text-gray-800 border border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
      case "Advanced":
        return "bg-purple-600 text-white dark:bg-purple-800"
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
    }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-950">
      {/* Card Header */}
      <div className="relative p-0">
        <div className="absolute right-2 top-2 z-10">
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getBadgeStyles(level)}`}>
            {level}
          </span>
        </div>
        <div className="flex h-48 items-center justify-center bg-gray-100 dark:bg-gray-900">
          {imageUrl ? (<Image
            src={imageUrl || "/placeholder.svg"}
            alt={title}
            width={80}
            height={80}
            className="h-20 w-20 object-contain opacity-70"
          />) : (<PlaceholderSVG />)}
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col space-y-4 p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>

      {/* Card Footer */}
      <div className="flex flex-col space-y-4 border-gray-200 p-6 dark:border-gray-800">
        <div className="flex w-full justify-between">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-400">{durationHours} hours</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-400">{studentsCount.toLocaleString()} students</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400" />
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-400">{rating.toFixed(1)}</span>
          </div>
        </div>
        <Link
          href={`/courses/${id}`}
          className="inline-flex w-full items-center justify-center font-bold rounded-md bg-blue-700 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-700 dark:hover:bg-blue-600"
        >
          Enroll Now
          <span className="ml-2">→</span>
        </Link>
      </div>
    </div>
  )
}

