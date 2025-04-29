"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import styled from "styled-components"
import type { EnhancedCourseData } from "@/lib/course-data"

// To define the course data interface
export interface CourseData {
  id: string
  title: string
  description: string
  instructor: string
  level: string
  duration: string
  price: number
  rating: number
  reviewCount: number
  imageUrl: string
  popularity: number
  trendingScore: number
  dateAdded: string
  features: string[]
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

// Styled components for the card
const StyledWrapper = styled.div`
  .card { 
    --white: hsl(0, 0%, 100%); 
    --black: hsl(240, 15%, 9%); 
    --paragraph: hsl(0, 0%, 83%); 
    --line: hsl(240, 9%, 17%); 
    --primary: hsl(266, 92%, 58%); 
 
    position: relative; 
 
    display: flex; 
    flex-direction: column; 
    gap: 1rem; 
 
    padding: 1.5rem; 
    width: 100%;
    height: 100%;
    background-color: hsla(240, 15%, 9%, 1); 
    background-image: radial-gradient( 
        at 88% 40%, 
        hsla(240, 15%, 9%, 1) 0px, 
        transparent 85% 
      ), 
      radial-gradient(at 49% 30%, hsla(240, 15%, 9%, 1) 0px, transparent 85%), 
      radial-gradient(at 14% 26%, hsla(240, 15%, 9%, 1) 0px, transparent 85%), 
      radial-gradient(at 0% 64%, hsla(263, 93%, 56%, 1) 0px, transparent 85%), 
      radial-gradient(at 41% 94%, hsla(284, 100%, 84%, 1) 0px, transparent 85%), 
      radial-gradient(at 100% 99%, hsla(306, 100%, 57%, 1) 0px, transparent 85%); 
 
    border-radius: 1rem; 
    box-shadow: 0px -16px 24px 0px rgba(255, 255, 255, 0.25) inset; 
  } 
 
  .card .card__border { 
    overflow: hidden; 
    pointer-events: none; 
 
    position: absolute; 
    z-index: -10; 
    top: 50%; 
    left: 50%; 
    transform: translate(-50%, -50%); 
 
    width: calc(100% + 2px); 
    height: calc(100% + 2px); 
    background-image: linear-gradient( 
      0deg, 
      hsl(0, 0%, 100%) -50%, 
      hsl(0, 0%, 40%) 100% 
    ); 
 
    border-radius: 1rem; 
  } 
 
  .card .card__border::before { 
    content: ""; 
    pointer-events: none; 
 
    position: fixed; 
    z-index: 200; 
    top: 50%; 
    left: 50%; 
    transform: translate(-50%, -50%), rotate(0deg); 
    transform-origin: left; 
 
    width: 200%; 
    height: 10rem; 
    background-image: linear-gradient( 
      0deg, 
      hsla(0, 0%, 100%, 0) 0%, 
      hsl(277, 95%, 60%) 40%, 
      hsl(277, 95%, 60%) 60%, 
      hsla(0, 0%, 40%, 0) 100% 
    ); 
 
    animation: rotate 8s linear infinite; 
  } 
 
  @keyframes rotate { 
    to { 
      transform: rotate(360deg); 
    } 
  } 
 
  .card .card_title__container .card_title { 
    font-size: 1.25rem; 
    font-weight: bold;
    color: var(--white); 
  } 
 
  .card .card_title__container .card_paragraph { 
    margin-top: 0.5rem; 
    width: 100%; 
 
    font-size: 0.875rem; 
    color: var(--paragraph); 
  } 
 
  .card .line { 
    width: 100%; 
    height: 0.1rem; 
    background-color: var(--line); 
 
    border: none; 
  } 
 
  .card .card__list { 
    display: flex; 
    flex-direction: column; 
    gap: 0.75rem; 
    padding: 0;
    list-style: none;
  } 
 
  .card .card__list .card__list_item { 
    display: flex; 
    align-items: center; 
    gap: 0.5rem; 
  } 
 
  .card .card__list .card__list_item .check { 
    display: flex; 
    justify-content: center; 
    align-items: center;
    color: var(--primary);
  } 
 
  .card .card__list .card__list_item .check .check_svg { 
    width: 1rem; 
    height: 1rem; 
  } 
 
  .card .card__list .card__list_item .list_text { 
    font-size: 0.875rem; 
    color: var(--white); 
  } 
 
  .card .button { 
    margin-top: auto;
    padding: 0.75rem 1.5rem; 
 
    font-size: 0.875rem; 
    font-weight: 600; 
    color: var(--white); 
 
    background-color: var(--primary); 
    border: none; 
    border-radius: 0.5rem; 
 
    cursor: pointer; 
    transition: all 0.2s ease-in-out; 
  } 
 
  .card .button:hover { 
    transform: translateY(-2px); 
    box-shadow: 0 5px 15px rgba(138, 43, 226, 0.4); 
  }

  .instructor {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .instructor-img {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    object-fit: cover;
  }

  .instructor-name {
    font-size: 0.75rem;
    color: var(--paragraph);
  }

  .course-meta {
    display: flex;
    justify-content: space-between;
    margin-top: 0.5rem;
    font-size: 0.75rem;
    color: var(--paragraph);
  }
`;

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

  // Custom Course Card Component
  const CourseCard = ({ id, title, description, instructor, level, duration, features, imageUrl }: EnhancedCourseData) => {
    // Create a formatted duration string from durationHours if duration is not provided
    // const formattedDuration = duration || `${durationHours} hours`;
    // Use empty array if features is undefined
    const courseFeatures = features || [];
    
    return (
      <StyledWrapper>
        <div className="card">
          <div className="card__border" />
          <div className="card_title__container">
            <span className="card_title">{title}</span>
            <div className="instructor">
              <img src={imageUrl} alt={instructor} className="instructor-img" />
              <span className="instructor-name">by {instructor}</span>
            </div>
            <div className="course-meta">
              <span>{level}</span>
              <span>{duration}</span>
            </div>
            <p className="card_paragraph">{description}</p>
          </div>
          <hr className="line" />
          <ul className="card__list">
            {courseFeatures.map((feature: string, index: number) => (
              <li key={index} className="card__list_item">
                <span className="check">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="check_svg">
                    <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                  </svg>
                </span>
                <span className="list_text">{feature}</span>
              </li>
            ))}
          </ul>
          <Link href={`/courses/${id}`}>
            <button className="button">Enroll Now</button>
          </Link>
        </div>
      </StyledWrapper>
    )
  }

  return (
    <section className="w-full p-6 my-20 lg:p-16">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-900 to-pink-600 bg-clip-text text-transparent">{title}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
        </div>

        {/* Custom Tabs */}
        <div className="inline-flex justify-center rounded-md bg-gray-100 p-1 dark:bg-gray-800">
          <button
            onClick={() => setActiveTab("popular")}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
              activeTab === "popular"
                ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer"
            }`}
          >
            Popular
          </button>
          <button
            onClick={() => setActiveTab("new")}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              activeTab === "new"
                ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            New
          </button>
          <button
            onClick={() => setActiveTab("trending")}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
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
      <div className="mt-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {getCoursesForTab(activeTab).map((course) => (
            <CourseCard key={course.id} {...course} />
          ))}
        </div>
      </div>

      {hasMoreCourses && (
        <div className="mt-20 flex justify-center">
          <Link
            href="/courses"
            className="text-base inline-flex rounded-lg shadow border px-6 py-2 items-center font-semibold bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:opacity-90 transition-opacity"
          >
            View All Courses
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      )}
    </section>
  )
}

