import TestimonialsSection from '@/components/testimonial';
export default function Home() {
  return (
    <main>
      <h1>Welcome to StrellerMinds</h1>
      <TestimonialsSection />
import Card from "@/components/Card";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ThemeToggle from "@/components/ThemeToggle"; // Import the toggle button
import PaymentModal from "@/components/PaymentPage";

export default function Home() {

  
  return (
    <main className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
      <Navbar />
      <div className="container mx-auto py-8 flex flex-col items-center">
        <h1 className="text-2xl font-bold">Welcome to our site</h1>
        {/* Rest of your content */}

        {/* Theme Toggle Button */}
        <ThemeToggle />
         <PaymentModal/>
      </div>
      <Footer />
    </main>
  );
}
