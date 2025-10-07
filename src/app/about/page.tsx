import MainLayout from '@/components/MainLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - Learn About Our Mission',
  description:
    'Discover StrellerMinds mission to empower minds through cutting-edge blockchain education. Learn about our expert instructors and comprehensive curriculum.',
  openGraph: {
    title: 'About StrellerMinds - Blockchain Education Experts',
    description:
      'Discover StrellerMinds mission to empower minds through cutting-edge blockchain education. Learn about our expert instructors and comprehensive curriculum.',
  },
};

export default function AboutPage() {
  return (
    <MainLayout variant="container" padding="large">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            About StrellerMinds
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Empowering minds through cutting-edge blockchain education
          </p>
        </div>

        <div className="prose prose-lg dark:prose-invert mx-auto">
          <p>
            Welcome to StrellerMinds, where we believe in transforming the
            future through comprehensive blockchain education. Our mission is to
            make advanced blockchain technologies accessible to everyone,
            regardless of their technical background.
          </p>

          <h2>Our Mission</h2>
          <p>
            We&apos;re dedicated to providing world-class blockchain education
            that bridges the gap between traditional learning and emerging
            technologies. Through our carefully crafted courses and hands-on
            approach, we help students master the skills needed to succeed in
            the decentralized future.
          </p>

          <h2>What Sets Us Apart</h2>
          <ul>
            <li>Expert instructors with real-world blockchain experience</li>
            <li>Hands-on projects using the latest blockchain technologies</li>
            <li>Interactive coding playgrounds for immediate practice</li>
            <li>
              Comprehensive curriculum covering DeFi, Smart Contracts, and more
            </li>
          </ul>

          <h2>Join Our Community</h2>
          <p>
            Ready to start your blockchain journey? Explore our courses and join
            a community of learners, developers, and blockchain enthusiasts who
            are shaping the future of technology.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
