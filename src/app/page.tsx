import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      {/* Your page content goes here */}
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold">Welcome to our site</h1>
        
        {/* Rest of your content */}
      </div>
      <Footer />
    </main>
  );
}