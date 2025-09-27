"use client"

import { useState } from "react"
import Link from "next/link"
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import WalletConnect from "@/components/wallet-connect"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="flex min-h-screen">
      {/* Mobile Sidebar Trigger */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden absolute top-4 left-4 z-50">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <div className="flex h-14 items-center border-b px-4">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Star className="h-5 w-5 text-primary" />
              <span>StarkMinds</span>
            </Link>
          </div>
          <div className="py-2">
            <nav className="grid gap-1 px-2">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 rounded-lg bg-primary/10 px-3 py-2 text-primary transition-all hover:text-primary"
              >
                <LayoutDashboard className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground"
              >
                <BookOpen className="h-5 w-5" />
                <span>My Courses</span>
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground"
              >
                <Calendar className="h-5 w-5" />
                <span>Schedule</span>
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground"
              >
                <Certificate className="h-5 w-5" />
                <span>Certifications</span>
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground"
              >
                <MessageSquare className="h-5 w-5" />
                <span>Community</span>
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground"
              >
                <BarChart3 className="h-5 w-5" />
                <span>Progress</span>
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground"
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
            </nav>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 flex-col border-r bg-background">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Star className="h-5 w-5 text-primary" />
            <span>StarkMinds</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid gap-1 px-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-lg bg-primary/10 px-3 py-2 text-primary transition-all hover:text-primary"
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground"
            >
              <BookOpen className="h-5 w-5" />
              <span>My Courses</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground"
            >
              <Calendar className="h-5 w-5" />
              <span>Schedule</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground"
            >
              <Certificate className="h-5 w-5" />
              <span>Certifications</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground"
            >
              <MessageSquare className="h-5 w-5" />
              <span>Community</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground"
            >
              <BarChart3 className="h-5 w-5" />
              <span>Progress</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground"
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
          </nav>
        </div>
        <div className="mt-auto border-t p-4">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="w-10 h-10 rounded-full bg-muted overflow-hidden">
              <img
                src="/placeholder.svg?height=40&width=40&text=JD"
                alt="User avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-muted-foreground truncate">john.doe@example.com</p>
            </div>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6 md:px-8">
          <div className="md:hidden w-4"></div>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <WalletConnect variant="outline" size="sm" />
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
                      <span className="ml-auto text-xs text-muted-foreground">2h ago</span>
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
                      <span className="ml-auto text-xs text-muted-foreground">1d ago</span>
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
                      <span className="ml-auto text-xs text-muted-foreground">2d ago</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Michael Rodriguez replied to your question about time-locked transactions
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
                  <img
                    src="/placeholder.svg?height=32&width=32&text=JD"
                    alt="User avatar"
                    className="h-8 w-8 rounded-full"
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
              <h2 className="text-2xl font-bold tracking-tight">Welcome back, John!</h2>
              <p className="text-muted-foreground">Track your progress and continue learning</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Browse Courses</Button>
              <Button>Continue Learning</Button>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="courses">My Courses</TabsTrigger>
              <TabsTrigger value="certificates">Certificates</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Courses Enrolled</CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">5</div>
                    <p className="text-xs text-muted-foreground">+1 from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">68%</div>
                    <p className="text-xs text-muted-foreground">+4% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Hours Learned</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">24.5</div>
                    <p className="text-xs text-muted-foreground">+2.5 from last week</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Certificates Earned</CardTitle>
                    <Certificate className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">2</div>
                    <p className="text-xs text-muted-foreground">+1 from last month</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4">
                  <CardHeader>
                    <CardTitle>Continue Learning</CardTitle>
                    <CardDescription>Pick up where you left off</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-md overflow-hidden shrink-0">
                          <img
                            src="/placeholder.svg?height=48&width=48&text=SC"
                            alt="Stellar Smart Contracts"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium truncate">Stellar Smart Contract Development</h3>
                            <span className="text-xs text-muted-foreground">68%</span>
                          </div>
                          <Progress value={68} className="h-2 mt-2" />
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-muted-foreground">Module 4: Advanced Contract Patterns</span>
                            <Button variant="ghost" size="sm" className="h-7 gap-1">
                              Continue <ArrowRight className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-md overflow-hidden shrink-0">
                          <img
                            src="/placeholder.svg?height=48&width=48&text=BF"
                            alt="Blockchain Fundamentals"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium truncate">Blockchain Fundamentals</h3>
                            <span className="text-xs text-muted-foreground">92%</span>
                          </div>
                          <Progress value={92} className="h-2 mt-2" />
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-muted-foreground">Module 8: Consensus Mechanisms</span>
                            <Button variant="ghost" size="sm" className="h-7 gap-1">
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
                    <CardDescription>Scheduled sessions and deadlines</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="rounded-full p-1.5 bg-blue-100 text-blue-600">
                          <Calendar className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">Live Q&A: Smart Contract Security</p>
                          <p className="text-sm text-muted-foreground">Tomorrow, 2:00 PM</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="rounded-full p-1.5 bg-amber-100 text-amber-600">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">Assignment Due: DeFi Protocol Analysis</p>
                          <p className="text-sm text-muted-foreground">Friday, 11:59 PM</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="rounded-full p-1.5 bg-green-100 text-green-600">
                          <Users className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">Community Meetup: Stellar Ecosystem</p>
                          <p className="text-sm text-muted-foreground">Next Monday, 6:00 PM</p>
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
                        <img
                          src="/placeholder.svg?height=40&width=40&text=DeFi"
                          alt="DeFi Course"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">DeFi Applications on Stellar</p>
                        <p className="text-xs text-muted-foreground">Intermediate • 10 hours</p>
                      </div>
                      <Button variant="ghost" size="icon">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md overflow-hidden shrink-0">
                        <img
                          src="/placeholder.svg?height=40&width=40&text=Sec"
                          alt="Security Course"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">Blockchain Security Best Practices</p>
                        <p className="text-xs text-muted-foreground">Advanced • 8 hours</p>
                      </div>
                      <Button variant="ghost" size="icon">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md overflow-hidden shrink-0">
                        <img
                          src="/placeholder.svg?height=40&width=40&text=NFT"
                          alt="NFT Course"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">NFT Development with Stellar</p>
                        <p className="text-xs text-muted-foreground">Intermediate • 7 hours</p>
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
                    <CardDescription>Recent discussions and posts</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                          <img
                            src="/placeholder.svg?height=32&width=32&text=SC"
                            alt="User avatar"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">Sarah Chen</p>
                            <p className="text-xs text-muted-foreground">2h ago</p>
                          </div>
                          <p className="text-sm">Shared a resource on Stellar payment channels</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                          <img
                            src="/placeholder.svg?height=32&width=32&text=MR"
                            alt="User avatar"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">Michael Rodriguez</p>
                            <p className="text-xs text-muted-foreground">5h ago</p>
                          </div>
                          <p className="text-sm">Asked a question about Stellar smart contract security</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                          <img
                            src="/placeholder.svg?height=32&width=32&text=AJ"
                            alt="User avatar"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">Alex Johnson</p>
                            <p className="text-xs text-muted-foreground">Yesterday</p>
                          </div>
                          <p className="text-sm">Posted a solution to the weekly coding challenge</p>
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
                    <CardDescription>Your subscription and billing</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-primary" />
                        <span className="font-medium">Pro Plan</span>
                      </div>
                      <span className="text-sm text-muted-foreground">Active</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm">
                        Next billing date: <span className="font-medium">April 15, 2025</span>
                      </p>
                      <p className="text-sm text-muted-foreground">$29.99/month</p>
                    </div>
                    <div className="pt-2">
                      <h4 className="text-sm font-medium mb-2">Plan Features:</h4>
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
                    <CardDescription>Track your progress across all courses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Course items would go here */}
                      <p className="text-muted-foreground">Course content will be displayed here</p>
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
                    <CardDescription>View and download your earned certificates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Certificate items would go here */}
                      <p className="text-muted-foreground">Certificate content will be displayed here</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

