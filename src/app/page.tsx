import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { ReactNode } from "react";


export default function Home({children}: {children:ReactNode}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
