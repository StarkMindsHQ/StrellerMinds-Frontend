'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Calendar,
  BadgeIcon as Certificate,
  ChevronRight,
  Clock,
  CreditCard,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings,
  Star,
  Users,
  Menu,
  CheckCircle,
  Bell,
  Briefcase,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import WalletConnect from '@/components/WalletConnect';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ContributorDashboard } from '@/components/dashboard/contributor/ContributorDashboard';

import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const navItems = [
    { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/dashboard' },
    { id: 'courses', icon: <BookOpen size={20} />, label: 'My Courses', href: '#' },
    { id: 'schedule', icon: <Calendar size={20} />, label: 'Schedule', href: '#' },
    { id: 'certs', icon: <Certificate size={20} />, label: 'Certifications', href: '#' },
    { id: 'community', icon: <MessageSquare size={20} />, label: 'Community', href: '#' },
    { id: 'workforce', icon: <Briefcase size={20} />, label: 'Workforce', href: '#' },
    { id: 'progress', icon: <BarChart3 size={20} />, label: 'Progress', href: '#' },
    { id: 'settings', icon: <Settings size={20} />, label: 'Settings', href: '#' },
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground overflow-hidden">
      {/* Mobile Sidebar Trigger - Better positioned and styled */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden fixed top-3 left-4 z-50 bg-background/80 backdrop-blur-md border shadow-sm rounded-full h-10 w-10"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 border-r-0 w-[300px] overflow-hidden">
          <div className="flex flex-col h-full bg-card">
            <div className="flex h-20 items-center border-b px-6 bg-primary/5">
              <Link href="/" className="flex items-center gap-3 font-black text-xl tracking-tighter">
                <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                  <Star className="h-5 w-5" fill="currentColor" />
                </div>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">StarkMinds</span>
              </Link>
            </div>
            <div className="flex-1 py-6 overflow-y-auto px-4">
              <nav className="grid gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group ${item.id === 'dashboard'
                      ? 'bg-primary text-white shadow-md shadow-primary/20'
                      : 'hover:bg-primary/10 text-muted-foreground hover:text-primary'
                      }`}
                  >
                    <span className="shrink-0">{item.icon}</span>
                    <span className="font-semibold text-sm">{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
            <div className="p-6 border-t bg-muted/30">
              {/* Mobile Profile Summary */}
              <div className="flex items-center gap-4 p-2 rounded-2xl bg-background/50 border">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden">
                  <Image src="/placeholder.svg?height=48&width=48&text=JD" alt="JD" width={48} height={48} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">John Doe</p>
                  <p className="text-xs text-muted-foreground truncate italic">Student</p>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar - Collapsible with motion */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarCollapsed ? 88 : 280 }}
        className="hidden md:flex flex-col border-r bg-card relative z-40 transition-all duration-300 ease-in-out"
      >
        <div className="flex h-20 items-center px-6 border-b shrink-0 overflow-hidden">
          <Link href="/" className="flex items-center gap-3 font-black text-xl tracking-tighter">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 shrink-0">
              <Star className="h-5 w-5" fill="currentColor" />
            </div>
            {!isSidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 ml-1"
              >
                StarkMinds
              </motion.span>
            )}
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 no-scrollbar">
          <nav className="grid gap-2">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`
                  flex items-center rounded-2xl transition-all duration-200 group relative
                  ${isSidebarCollapsed ? 'justify-center p-3.5' : 'gap-4 px-4 py-3.5'}
                  ${item.id === 'dashboard'
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'hover:bg-primary/10 text-muted-foreground hover:text-primary'}
                `}
              >
                <span className="shrink-0">{item.icon}</span>
                {!isSidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-semibold text-sm"
                  >
                    {item.label}
                  </motion.span>
                )}
                {isSidebarCollapsed && (
                  <div className="absolute left-full ml-4 px-3 py-2 bg-popover text-popover-foreground rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-xl border font-bold pointer-events-none">
                    {item.label}
                  </div>
                )}
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t space-y-4">
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="w-full flex items-center h-12 rounded-2xl text-muted-foreground hover:bg-muted transition-all border border-transparent hover:border-border"
          >
            <div className={`flex items-center w-full ${isSidebarCollapsed ? 'justify-center' : 'px-4 gap-4'}`}>
              <ChevronRight size={20} className={`transform transition-transform duration-300 ${isSidebarCollapsed ? '' : 'rotate-180'}`} />
              {!isSidebarCollapsed && <span className="text-sm font-medium">Collapse</span>}
            </div>
          </button>
        </div>
      </motion.aside>
      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="sticky top-0 z-30 flex h-20 shrink-0 items-center justify-between border-b bg-background/80 backdrop-blur-md px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="md:hidden w-10"></div> {/* Space for mobile menu trigger button */}
            <h1 className="text-xl font-bold tracking-tight">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            {/* <WalletConnect variant="outline" size="sm" /> */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                    3
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-[300px] overflow-auto">
                  <DropdownMenuItem className="flex flex-col items-start p-3">
                    <div className="flex w-full items-center gap-2">
                      <span className="rounded-full bg-primary/10 p-1">
                        <Calendar className="h-4 w-4 text-primary" />
                      </span>
                      <span className="font-medium">Live Q&A Session</span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        2h ago
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Reminder: Smart Contract Security Q&A starts in 1 hour
                    </p>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex flex-col items-start p-3">
                    <div className="flex w-full items-center gap-2">
                      <span className="rounded-full bg-green-100 p-1">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </span>
                      <span className="font-medium">Assignment Graded</span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        1d ago
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Your DeFi Protocol Analysis assignment has been graded
                    </p>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex flex-col items-start p-3">
                    <div className="flex w-full items-center gap-2">
                      <span className="rounded-full bg-blue-100 p-1">
                        <MessageSquare className="h-4 w-4 text-blue-600" />
                      </span>
                      <span className="font-medium">New Discussion Reply</span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        2d ago
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Michael Rodriguez replied to your question about
                      time-locked transactions
                    </p>
                  </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator />
                <div className="p-2 text-center">
                  <Button variant="ghost" size="sm" className="w-full">
                    View All Notifications
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Image
                    src="/placeholder.svg?height=32&width=32&text=JD"
                    alt="User avatar"
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="grid gap-6 p-4 sm:p-6 md:gap-8 md:p-8">
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Welcome back, John!
              </h2>
              <p className="text-muted-foreground">
                Track your progress and continue learning
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Browse Courses</Button>
              <Button>Continue Learning</Button>
            </div>
          </div>

          <Tabs
            defaultValue="overview"
            className="space-y-4"
            onValueChange={setActiveTab}
          >
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="courses">My Courses</TabsTrigger>
              <TabsTrigger value="contributor">Workforce</TabsTrigger>
              <TabsTrigger value="certificates">Certificates</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Courses Enrolled
                    </CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">5</div>
                    <p className="text-xs text-muted-foreground">
                      +1 from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Completion Rate
                    </CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">68%</div>
                    <p className="text-xs text-muted-foreground">
                      +4% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Hours Learned
                    </CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">24.5</div>
                    <p className="text-xs text-muted-foreground">
                      +2.5 from last week
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Certificates Earned
                    </CardTitle>
                    <Certificate className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">2</div>
                    <p className="text-xs text-muted-foreground">
                      +1 from last month
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4">
                  <CardHeader>
                    <CardTitle>Continue Learning</CardTitle>
                    <CardDescription>
                      Pick up where you left off
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-md overflow-hidden shrink-0">
                          <Image
                            src="/placeholder.svg?height=48&width=48&text=SC"
                            alt="Stellar Smart Contracts"
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                            placeholder="blur"
                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium truncate">
                              Stellar Smart Contract Development
                            </h3>
                            <span className="text-xs text-muted-foreground">
                              68%
                            </span>
                          </div>
                          <Progress value={68} className="h-2 mt-2" />
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-muted-foreground">
                              Module 4: Advanced Contract Patterns
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 gap-1"
                            >
                              Continue <ArrowRight className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-md overflow-hidden shrink-0">
                          <Image
                            src="/placeholder.svg?height=48&width=48&text=BF"
                            alt="Blockchain Fundamentals"
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                            placeholder="blur"
                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium truncate">
                              Blockchain Fundamentals
                            </h3>
                            <span className="text-xs text-muted-foreground">
                              92%
                            </span>
                          </div>
                          <Progress value={92} className="h-2 mt-2" />
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-muted-foreground">
                              Module 8: Consensus Mechanisms
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 gap-1"
                            >
                              Continue <ArrowRight className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="lg:col-span-3">
                  <CardHeader>
                    <CardTitle>Upcoming Events</CardTitle>
                    <CardDescription>
                      Scheduled sessions and deadlines
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="rounded-full p-1.5 bg-blue-100 text-blue-600">
                          <Calendar className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">
                            Live Q&A: Smart Contract Security
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Tomorrow, 2:00 PM
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="rounded-full p-1.5 bg-amber-100 text-amber-600">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">
                            Assignment Due: DeFi Protocol Analysis
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Friday, 11:59 PM
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="rounded-full p-1.5 bg-green-100 text-green-600">
                          <Users className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">
                            Community Meetup: Stellar Ecosystem
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Next Monday, 6:00 PM
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View Calendar
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Recommended Courses</CardTitle>
                    <CardDescription>Based on your interests</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md overflow-hidden shrink-0">
                        <Image
                          src="/placeholder.svg?height=40&width=40&text=DeFi"
                          alt="DeFi Course"
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                          placeholder="blur"
                          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          DeFi Applications on Stellar
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Intermediate • 10 hours
                        </p>
                      </div>
                      <Button variant="ghost" size="icon">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md overflow-hidden shrink-0">
                        <Image
                          src="/placeholder.svg?height=40&width=40&text=Sec"
                          alt="Security Course"
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                          placeholder="blur"
                          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          Blockchain Security Best Practices
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Advanced • 8 hours
                        </p>
                      </div>
                      <Button variant="ghost" size="icon">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md overflow-hidden shrink-0">
                        <Image
                          src="/placeholder.svg?height=40&width=40&text=NFT"
                          alt="NFT Course"
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                          placeholder="blur"
                          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          NFT Development with Stellar
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Intermediate • 7 hours
                        </p>
                      </div>
                      <Button variant="ghost" size="icon">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View All Recommendations
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Community Activity</CardTitle>
                    <CardDescription>
                      Recent discussions and posts
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                          <Image
                            src="/placeholder.svg?height=32&width=32&text=SC"
                            alt="User avatar"
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                            placeholder="blur"
                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">Sarah Chen</p>
                            <p className="text-xs text-muted-foreground">
                              2h ago
                            </p>
                          </div>
                          <p className="text-sm">
                            Shared a resource on Stellar payment channels
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                          <Image
                            src="/placeholder.svg?height=32&width=32&text=MR"
                            alt="User avatar"
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                            placeholder="blur"
                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">
                              Michael Rodriguez
                            </p>
                            <p className="text-xs text-muted-foreground">
                              5h ago
                            </p>
                          </div>
                          <p className="text-sm">
                            Asked a question about Stellar smart contract
                            security
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                          <Image
                            src="/placeholder.svg?height=32&width=32&text=AJ"
                            alt="User avatar"
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                            placeholder="blur"
                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">Alex Johnson</p>
                            <p className="text-xs text-muted-foreground">
                              Yesterday
                            </p>
                          </div>
                          <p className="text-sm">
                            Posted a solution to the weekly coding challenge
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View Community
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Account Summary</CardTitle>
                    <CardDescription>
                      Your subscription and billing
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-primary" />
                        <span className="font-medium">Pro Plan</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        Active
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm">
                        Next billing date:{' '}
                        <span className="font-medium">April 15, 2025</span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        $29.99/month
                      </p>
                    </div>
                    <div className="pt-2">
                      <h4 className="text-sm font-medium mb-2">
                        Plan Features:
                      </h4>
                      <ul className="space-y-1">
                        <li className="text-sm flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Unlimited course access</span>
                        </li>
                        <li className="text-sm flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Certificate downloads</span>
                        </li>
                        <li className="text-sm flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Community forum access</span>
                        </li>
                        <li className="text-sm flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Live Q&A sessions</span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-2">
                    <Button variant="outline" className="w-full gap-2">
                      <CreditCard className="h-4 w-4" /> Manage Subscription
                    </Button>
                    <Button variant="ghost" className="w-full">
                      Billing History
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="courses">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>My Enrolled Courses</CardTitle>
                    <CardDescription>
                      Track your progress across all courses
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Course items would go here */}
                      <p className="text-muted-foreground">
                        Course content will be displayed here
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="certificates">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>My Certificates</CardTitle>
                    <CardDescription>
                      View and download your earned certificates
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Certificate items would go here */}
                      <p className="text-muted-foreground">
                        Certificate content will be displayed here
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="contributor">
              <ContributorDashboard />
            </TabsContent>
          </Tabs>
        </main>
      </div >
    </div >
  );
}
