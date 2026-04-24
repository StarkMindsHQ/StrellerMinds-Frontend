'use client';

import React, { useState, useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Download, Filter, TrendingUp, DollarSign, PieChart as PieChartIcon, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

const COLORS = ['#5c0f49', '#09A5DB', '#10b981', '#f59e0b'];

const MOCK_REVENUE_DATA = [
  { name: 'Platform Fee (20%)', value: 1200, color: '#5c0f49' },
  { name: 'Instructor Share (80%)', value: 4800, color: '#09A5DB' },
];

const MOCK_MONTHLY_REVENUE = [
  { month: 'Jan', instructor: 3200, platform: 800 },
  { month: 'Feb', instructor: 4100, platform: 1025 },
  { month: 'Mar', instructor: 3800, platform: 950 },
  { month: 'Apr', instructor: 4800, platform: 1200 },
  { month: 'May', instructor: 5200, platform: 1300 },
  { month: 'Jun', instructor: 6100, platform: 1525 },
];

export const RevenueSplitVisualization: React.FC = () => {
  const [viewType, setViewType] = useState<'pie' | 'bar'>('pie');
  const [timeRange, setTimeRange] = useState('last-6-months');
  const [selectedCourse, setSelectedCourse] = useState('all');

  const totalRevenue = useMemo(() => {
    return MOCK_REVENUE_DATA.reduce((acc, item) => acc + item.value, 0);
  }, []);

  const instructorShare = MOCK_REVENUE_DATA.find(d => d.name.includes('Instructor'))?.value || 0;
  const platformShare = MOCK_REVENUE_DATA.find(d => d.name.includes('Platform'))?.value || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Revenue Distribution</h2>
          <p className="text-sm text-gray-500">Track your earnings and platform distribution</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-30-days">Last 30 Days</SelectItem>
              <SelectItem value="last-6-months">Last 6 Months</SelectItem>
              <SelectItem value="year-to-date">Year to Date</SelectItem>
              <SelectItem value="all-time">All Time</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="w-[200px] bg-white">
              <SelectValue placeholder="Select Course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              <SelectItem value="stellar-dev">Stellar Smart Contracts</SelectItem>
              <SelectItem value="react-mastery">React Mastery</SelectItem>
              <SelectItem value="web3-fundamentals">Web3 Fundamentals</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" className="bg-white">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Key Metrics */}
        <div className="lg:col-span-1 space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-950 p-6 rounded-2xl border border-gray-100 shadow-sm"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-50 rounded-xl text-[#5c0f49]">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <h3 className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</h3>
              </div>
            </div>
            <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
              <TrendingUp className="w-4 h-4" />
              <span>+12.5% from last period</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-950 p-6 rounded-2xl border border-gray-100 shadow-sm"
          >
            <div className="flex justify-between items-end mb-2">
              <div>
                <p className="text-sm font-medium text-gray-500">Your Share (80%)</p>
                <h3 className="text-2xl font-bold text-[#09A5DB]">${instructorShare.toLocaleString()}</h3>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Platform Fee</p>
                <p className="text-sm font-semibold text-gray-600">${platformShare.toLocaleString()}</p>
              </div>
            </div>
            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-[#09A5DB] h-full rounded-full transition-all duration-1000" 
                style={{ width: '80%' }}
              />
            </div>
          </motion.div>
        </div>

        {/* Chart Area */}
        <Card className="lg:col-span-2 border-none shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 bg-white">
            <div>
              <CardTitle className="text-lg">Financial Breakdown</CardTitle>
              <CardDescription>Visual representation of your earnings</CardDescription>
            </div>
            <div className="flex items-center bg-gray-50 p-1 rounded-lg">
              <Button 
                variant={viewType === 'pie' ? 'secondary' : 'ghost'} 
                size="sm" 
                onClick={() => setViewType('pie')}
                className="h-8 px-3"
              >
                <PieChartIcon className="w-4 h-4 mr-2" />
                Pie
              </Button>
              <Button 
                variant={viewType === 'bar' ? 'secondary' : 'ghost'} 
                size="sm" 
                onClick={() => setViewType('bar')}
                className="h-8 px-3"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Bar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6 bg-white min-h-[350px]">
            <ResponsiveContainer width="100%" height={300}>
              {viewType === 'pie' ? (
                <PieChart>
                  <Pie
                    data={MOCK_REVENUE_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={1500}
                  >
                    {MOCK_REVENUE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              ) : (
                <BarChart data={MOCK_MONTHLY_REVENUE}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Legend verticalAlign="top" align="right" height={36}/>
                  <Bar dataKey="instructor" name="Instructor Share" stackId="a" fill="#09A5DB" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="platform" name="Platform Fee" stackId="a" fill="#5c0f49" radius={[4, 4, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
