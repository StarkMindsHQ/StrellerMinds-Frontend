import MainLayout from '@/components/MainLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - Blockchain Insights & Tutorials',
  description:
    'Stay updated with the latest blockchain insights, tutorials, and industry updates from StrellerMinds experts.',
  openGraph: {
    title: 'StrellerMinds Blog - Blockchain Insights & Tutorials',
    description:
      'Stay updated with the latest blockchain insights, tutorials, and industry updates from StrellerMinds experts.',
  },
};

export default function BlogPage() {
  return (
    <MainLayout variant="container" padding="large">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            StrellerMinds Blog
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Insights, tutorials, and updates from the blockchain world
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Placeholder blog posts */}
          {Array.from({ length: 6 }, (_, i) => (
            <article
              key={i}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="h-48 bg-gradient-to-r from-purple-500 to-pink-500"></div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                  <span>March {20 - i}, 2024</span>
                  <span>•</span>
                  <span>5 min read</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Understanding Blockchain Technology: A Beginner&apos;s Guide
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Dive into the fundamentals of blockchain technology and
                  discover how it&apos;s revolutionizing industries across the
                  globe.
                </p>
                <a
                  href="#"
                  className="inline-flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-medium"
                >
                  Read more
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors">
            Load More Posts
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
