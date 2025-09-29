import React from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Github,
  Twitter,
  Linkedin,
  Heart,
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-[#5c0f49] via-[#4a0d3a] to-[#3d0a2e] text-white overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0 opacity-8">
        <div className="absolute top-8 right-12 w-20 h-20 bg-gradient-to-r from-[#ffcc00] to-yellow-300 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-8 left-12 w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info - Compact */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#ffcc00] via-yellow-400 to-orange-400 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-[#5c0f49] font-bold text-lg">SM</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-purple-100 to-[#ffcc00] bg-clip-text text-transparent">
                  StrellerMinds
                </h2>
                <p className="text-purple-300 text-sm">
                  Empowering African Designers
                </p>
              </div>
            </div>

            <p className="text-purple-200 text-sm leading-relaxed max-w-md">
              Transforming African design through innovative education and
              cultural heritage.
            </p>

            {/* Contact Info - Compact Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center space-x-2 p-2 bg-white/5 rounded-lg">
                <MapPin className="h-4 w-4 text-[#ffcc00]" />
                <span className="text-purple-100 text-sm">Lagos, Nigeria</span>
              </div>

              <div className="flex items-center space-x-2 p-2 bg-white/5 rounded-lg">
                <Phone className="h-4 w-4 text-[#ffcc00]" />
                <span className="text-purple-100 text-sm">
                  +234 814 880 6684
                </span>
              </div>

              <div className="flex items-center space-x-2 p-2 bg-white/5 rounded-lg sm:col-span-2">
                <Mail className="h-4 w-4 text-[#ffcc00]" />
                <a
                  href="mailto:hello@strellerminds.com"
                  className="text-purple-100 hover:text-[#ffcc00] transition-colors text-sm"
                >
                  hello@strellerminds.com
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links - Compact */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
              <div className="w-1.5 h-1.5 bg-[#ffcc00] rounded-full mr-2"></div>
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { name: 'Courses', href: '/courses' },
                { name: 'About', href: '/about' },
                { name: 'Contact', href: '/contact' },
                { name: 'Blog', href: '/blog' },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-purple-300 hover:text-[#ffcc00] transition-colors text-sm block py-1"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Social - Compact */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
              <div className="w-1.5 h-1.5 bg-[#ffcc00] rounded-full mr-2"></div>
              Support
            </h3>
            <ul className="space-y-2 mb-4">
              {[
                { name: 'Help Center', href: '/support' },
                { name: 'FAQ', href: '/faq' },
                { name: 'Privacy', href: '/privacy' },
                { name: 'Terms', href: '/terms' },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-purple-300 hover:text-[#ffcc00] transition-colors text-sm block py-1"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>

            {/* Social Links - Compact */}
            <div>
              <h4 className="text-white font-medium mb-2 text-sm flex items-center">
                <Heart className="h-3 w-3 text-[#ffcc00] mr-1" />
                Follow Us
              </h4>
              <div className="flex space-x-2">
                {[
                  { icon: Twitter, href: '#', label: 'Twitter' },
                  { icon: Linkedin, href: '#', label: 'LinkedIn' },
                  { icon: Github, href: '#', label: 'GitHub' },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="p-2 bg-white/5 rounded-lg hover:bg-[#ffcc00]/20 transition-all duration-300 hover:scale-105"
                    aria-label={social.label}
                  >
                    <social.icon className="h-4 w-4 text-purple-300 hover:text-[#ffcc00] transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Compact */}
        <div className="border-t border-purple-700/30 mt-8 pt-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <div className="text-purple-300 text-xs">
              © 2025 StrellerMinds. All rights reserved.
            </div>
            <div className="flex items-center space-x-1 text-xs">
              <span className="text-purple-300">Made with</span>
              <Heart className="h-3 w-3 text-red-400" />
              <span className="text-purple-300">in Africa</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
