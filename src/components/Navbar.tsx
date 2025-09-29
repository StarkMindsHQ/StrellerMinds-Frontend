// "use client";

// import React, { useState } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { Menu, X, Home, BookOpen, Users, FileText, Info } from "lucide-react";
// import SimpleLogo from "@/components/ui/SimpleLogo";
// import SignInButton from "@/components/ui/SignInButton";
// import CustomGetStartedButton from "@/components/ui/CustomGetStartedButton";
// import CryptoTicker from "./CryptoTicker";

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const pathname = usePathname();

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   const navLinks = [
//     { name: "Home", href: "/", icon: <Home className="h-4 w-4 text-[#ffcc00]" /> },
//     { name: "Courses", href: "/courses", icon: <BookOpen className="h-4 w-4 text-[#ffcc00]" /> },
//     { name: "Community", href: "/community", icon: <Users className="h-4 w-4 text-[#ffcc00]" /> },
//     { name: "Resources", href: "/resources", icon: <FileText className="h-4 w-4 text-[#ffcc00]" /> },
//     { name: "About", href: "/about", icon: <Info className="h-4 w-4 text-[#ffcc00]" /> },
//   ];

//   return (
//     <nav className="bg-[#5c0f49] text-white py-3">
//       <div className="container mx-auto px-4">
//         <div className="flex justify-between items-center">
//           {/* Logo - Left aligned */}
//           <div className="flex-shrink-0">
//             <Link href="/" className="flex items-center">
//               <SimpleLogo />
//               <span className="font-bold text-xl ml-2">StrellerMinds</span>
//             </Link>
//             <CryptoTicker/>
//           </div>

//           {/* Mobile menu button */}
//           <div className="md:hidden">
//             <button
//               onClick={toggleMenu}
//               className="text-white focus:outline-none"
//             >
//               {isMenuOpen ? (
//                 <X className="h-6 w-6" />
//               ) : (
//                 <Menu className="h-6 w-6" />
//               )}
//             </button>
//           </div>

//           {/* Navigation Links - Center aligned */}
//           <div className="hidden md:flex items-center justify-center flex-1">
//             <ul className="flex space-x-8">
//               {navLinks.map((link) => (
//                 <li key={link.name}>
//                   <Link
//                     href={link.href}
//                     className={`group flex items-center gap-2 relative px-2 py-1 overflow-hidden hover:text-[#dfb1cc] transition-colors ${
//                       pathname === link.href ? "font-semibold" : ""
//                     }`}
//                   >
//                     <span className="inline-block transition-transform group-hover:translate-x-1 duration-300 ease-in-out">
//                       {link.icon}
//                     </span>
//                     <span>{link.name}</span>
//                     <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#dfb1cc] transition-all duration-300 ease-in-out group-hover:w-full"></span>
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Auth Buttons - Right aligned */}
//           <div className="hidden md:flex items-center space-x-4">
//             <SignInButton />
//             <CustomGetStartedButton />
//           </div>
//         </div>

//         {/* Mobile menu */}
//         {isMenuOpen && (
//           <div className="md:hidden mt-4">
//             <ul className="flex flex-col space-y-4">
//               {navLinks.map((link) => (
//                 <li key={link.name}>
//                   <Link
//                     href={link.href}
//                     className={`flex items-center gap-2 hover:text-[#dfb1cc] transition-colors ${
//                       pathname === link.href ? "font-semibold" : ""
//                     }`}
//                     onClick={() => setIsMenuOpen(false)}
//                   >
//                     {link.icon}
//                     <span>{link.name}</span>
//                   </Link>
//                 </li>
//               ))}
//               <li className="pt-4 border-t border-[#dfb1cc]/30 flex flex-col space-y-3">
//                 <SignInButton />
//                 <CustomGetStartedButton />
//               </li>
//             </ul>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Home, BookOpen, Users, FileText, Info } from 'lucide-react';
import SimpleLogo from '@/components/ui/SimpleLogo';
import SignInButton from '@/components/ui/SignInButton';
import CustomGetStartedButton from '@/components/ui/CustomGetStartedButton';
import CryptoTicker from './CryptoTicker';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks = [
    {
      name: 'Home',
      href: '/',
      icon: <Home className="h-4 w-4 text-[#ffcc00]" />,
    },
    {
      name: 'Courses',
      href: '/courses',
      icon: <BookOpen className="h-4 w-4 text-[#ffcc00]" />,
    },
    {
      name: 'Community',
      href: '/community',
      icon: <Users className="h-4 w-4 text-[#ffcc00]" />,
    },
    {
      name: 'Resources',
      href: '/resources',
      icon: <FileText className="h-4 w-4 text-[#ffcc00]" />,
    },
    {
      name: 'About',
      href: '/about',
      icon: <Info className="h-4 w-4 text-[#ffcc00]" />,
    },
  ];

  return (
    <nav
      className="bg-[#5c0f49] text-white py-3 z-50 relative"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo and Crypto Ticker */}
          <div className="flex-shrink-0 flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#5c0f49] rounded-md px-2 py-1"
              aria-label="StrellerMinds home page"
            >
              <SimpleLogo />
              <span className="font-bold text-xl ml-2">StrellerMinds</span>
            </Link>
            {/* Desktop Crypto Ticker */}
            <div className="hidden lg:block">
              <CryptoTicker />
            </div>
          </div>

          {/* Hamburger button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              aria-label={
                isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'
              }
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              className="text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#5c0f49] rounded-md p-2"
              type="button"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <ul className="flex space-x-8" role="menubar">
              {navLinks.map((link) => (
                <li key={link.name} role="none">
                  <Link
                    href={link.href}
                    role="menuitem"
                    aria-current={pathname === link.href ? 'page' : undefined}
                    className={`group flex items-center gap-2 relative px-3 py-2 rounded-md overflow-hidden hover:text-[#dfb1cc] transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#5c0f49] ${
                      pathname === link.href ? 'font-semibold bg-white/10' : ''
                    }`}
                  >
                    <span
                      className="inline-block transition-transform group-hover:translate-x-1 duration-300 ease-in-out"
                      aria-hidden="true"
                    >
                      {link.icon}
                    </span>
                    <span>{link.name}</span>
                    <span
                      className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#dfb1cc] transition-all duration-300 ease-in-out group-hover:w-full"
                      aria-hidden="true"
                    ></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <SignInButton />
            <CustomGetStartedButton />
          </div>
        </div>

        {/* Mobile Nav Menu */}
        {isMenuOpen && (
          <div
            id="mobile-menu"
            role="menu"
            aria-label="Mobile navigation menu"
            className="md:hidden mt-4 h-[90vh]"
          >
            {/* Mobile Crypto Ticker */}
            <div className="mb-4 pb-4 border-b border-[#dfb1cc]/30">
              <CryptoTicker />
            </div>

            <ul className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <li key={link.name} role="none">
                  <Link
                    href={link.href}
                    role="menuitem"
                    aria-current={pathname === link.href ? 'page' : undefined}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md hover:text-[#dfb1cc] transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#5c0f49] ${
                      pathname === link.href ? 'font-semibold bg-white/10' : ''
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span aria-hidden="true">{link.icon}</span>
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
              <li
                className="pt-4 border-t border-[#dfb1cc]/30 flex flex-col space-y-3"
                role="none"
              >
                <SignInButton />
                <CustomGetStartedButton />
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
