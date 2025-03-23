"use client";

import { Database, Star, Code, Link as LinkIcon, Lock, BarChart, Network, Rocket } from "lucide-react";
import Link from "next/link";

const categories = [
  {
    id: 1,
    title: "Blockchain Fundamentals",
    description: "Core concepts and principles of blockchain technology",
    icon: <Database className="h-6 w-6 text-blue-600" />,
    courses: 12,
  },
  {
    id: 2,
    title: "Stellar Development",
    description: "Build applications on the Stellar blockchain network",
    icon: <Star className="h-6 w-6 text-blue-600" />,
    courses: 18,
  },
  {
    id: 3,
    title: "Smart Contracts",
    description: "Create and deploy secure smart contracts",
    icon: <Code className="h-6 w-6 text-blue-600" />,
    courses: 15,
  },
  {
    id: 4,
    title: "DeFi Applications",
    description: "Decentralized finance protocols and applications",
    icon: <LinkIcon className="h-6 w-6 text-blue-600" />,
    courses: 10,
  },
  {
    id: 5,
    title: "Blockchain Security",
    description: "Security best practices for blockchain applications",
    icon: <Lock className="h-6 w-6 text-blue-600" />,
    courses: 8,
  },
  {
    id: 6,
    title: "Data Analytics",
    description: "Analyze blockchain data and extract insights",
    icon: <BarChart className="h-6 w-6 text-blue-600" />,
    courses: 6,
  },
  {
    id: 7,
    title: "Enterprise Solutions",
    description: "Blockchain implementation for businesses",
    icon: <Network className="h-6 w-6 text-blue-600" />,
    courses: 9,
  },
  {
    id: 8,
    title: "Advanced Projects",
    description: "End-to-end blockchain application development",
    icon: <Rocket className="h-6 w-6 text-blue-600" />,
    courses: 7,
  },
];

export default function CourseCategories() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explore Course Categories
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Comprehensive curriculum covering all aspects of blockchain technology and Stellar development
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white border border-gray-200 rounded-lg p-6 transition-all hover:shadow-md"
            >
              <div className="mb-4 bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center">
                {category.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {category.title}
              </h3>
              <p className="text-gray-600 mb-4">{category.description}</p>
              <p className="text-gray-500 mb-4">{category.courses} courses</p>
              <Link 
                href={`/courses/${category.id}`}
                className="text-blue-600 font-medium flex items-center hover:underline"
              >
                Explore Courses
                <svg 
                  className="w-4 h-4 ml-1" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path 
                    d="M13.5 19L20.5 12L13.5 5" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                  <path 
                    d="M20.5 12L3.5 12" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 