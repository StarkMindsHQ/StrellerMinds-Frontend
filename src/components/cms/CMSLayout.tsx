'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  BookOpen,
  Layers,
  Users,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronLeft,
  Search,
  Bell,
  LogOut,
  Menu,
  X,
  PlusCircle,
  Sparkles,
  Folder,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { CMSProvider, useCMS } from '@/contexts/CMSContext';

interface CMSLayoutProps {
  children: React.ReactNode;
}

export function CMSLayout({ children }: CMSLayoutProps) {
  const { sidebarOpen, toggleSidebar, currentUser } = useCMS();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/cms' },
    {
      icon: <BookOpen size={20} />,
      label: 'All Courses',
      href: '/cms/courses',
    },
    { icon: <Layers size={20} />, label: 'Modules', href: '/cms/modules' },
    { icon: <Folder size={20} />, label: 'Media Library', href: '/cms/media' },
    { icon: <Users size={20} />, label: 'Students', href: '/cms/students' },
    {
      icon: <BarChart3 size={20} />,
      label: 'Analytics',
      href: '/cms/analytics',
    },
    { icon: <Settings size={20} />, label: 'Settings', href: '/cms/settings' },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className="hidden md:flex flex-col border-r bg-card relative z-30"
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <Sparkles size={18} fill="currentColor" />
          </div>
          {sidebarOpen && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-lg font-bold tracking-tight"
            >
              Streller<span className="text-primary font-black">CMS</span>
            </motion.span>
          )}
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all
                hover:bg-primary/10 hover:text-primary group
                ${item.label === 'All Courses' ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground'}
              `}
            >
              <span className="shrink-0">{item.icon}</span>
              {sidebarOpen && <span className="text-sm">{item.label}</span>}
              {!sidebarOpen && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-md">
                  {item.label}
                </div>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <button
            onClick={toggleSidebar}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-muted transition-all"
          >
            <ChevronLeft
              size={20}
              className={`transform transition-transform ${!sidebarOpen ? 'rotate-180 mx-auto' : ''}`}
            />
            {sidebarOpen && <span className="text-sm">Collapse Sidebar</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header */}
        <header className="h-16 border-b bg-background/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 -ml-2 hover:bg-muted rounded-lg"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div className="hidden sm:flex items-center bg-muted/50 rounded-full px-4 py-1.5 focus-within:ring-2 ring-primary/20 transition-all border border-transparent focus-within:border-primary/20">
              <Search size={16} className="text-muted-foreground" />
              <input
                placeholder="Search courses, assets, students..."
                className="bg-transparent border-none outline-none text-sm ml-2 w-[240px]"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-muted-foreground"
            >
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-background"></span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-1.5 rounded-full hover:bg-muted transition-all">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    {currentUser?.name?.[0] || 'A'}
                  </div>
                  <div className="hidden sm:block text-left mr-1">
                    <p className="text-sm font-semibold leading-none">
                      {currentUser?.name || 'Administrator'}
                    </p>
                    <p className="text-[10px] text-muted-foreground leading-tight">
                      {currentUser?.role || 'Author'}
                    </p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Account Settings</DropdownMenuItem>
                <DropdownMenuItem>Help & Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive font-medium">
                  <LogOut size={16} className="mr-2" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto bg-muted/20 scroll-smooth">
          {children}
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed inset-y-0 left-0 w-[280px] bg-card z-50 shadow-2xl md:hidden"
            >
              <div className="p-6 flex items-center justify-between">
                <span className="text-lg font-bold tracking-tight">
                  Streller<span className="text-primary font-black">CMS</span>
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X size={20} />
                </Button>
              </div>
              <nav className="px-3 space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-primary/10 hover:text-primary transition-all text-muted-foreground"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
