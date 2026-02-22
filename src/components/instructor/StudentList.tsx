'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MOCK_STUDENTS, type MockStudent } from '@/data/mockInstructorData';
import { Search, Mail, BookOpen } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const statusVariant: Record<MockStudent['status'], 'default' | 'secondary' | 'outline'> = {
  active: 'default',
  completed: 'secondary',
  dropped: 'outline',
};

export default function StudentList() {
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<MockStudent['status'] | 'all'>('all');

  const courses = useMemo(() => {
    const set = new Set(MOCK_STUDENTS.map((s) => s.course));
    return Array.from(set).sort();
  }, []);

  const filtered = useMemo(() => {
    return MOCK_STUDENTS.filter((s) => {
      const matchSearch =
        !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase());
      const matchCourse = courseFilter === 'all' || s.course === courseFilter;
      const matchStatus = statusFilter === 'all' || s.status === statusFilter;
      return matchSearch && matchCourse && matchStatus;
    });
  }, [search, courseFilter, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={courseFilter} onValueChange={setCourseFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All courses</SelectItem>
            {courses.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as MockStudent['status'] | 'all')}
        >
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="dropped">Dropped</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="border-[#5c0f49]/15">
        <CardHeader>
          <CardTitle>Student progress</CardTitle>
          <p className="text-sm text-muted-foreground">
            {filtered.length} student{filtered.length !== 1 ? 's' : ''} shown
          </p>
        </CardHeader>
        <CardContent className="p-0 sm:px-6 sm:pb-6">
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b bg-gradient-to-r from-[#5c0f49]/10 to-[#ffcc00]/10">
                  <th className="text-left p-3 font-medium">Name</th>
                  <th className="text-left p-3 font-medium hidden md:table-cell">Email</th>
                  <th className="text-left p-3 font-medium">Course</th>
                  <th className="text-left p-3 font-medium">Progress</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Last activity</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-medium">{s.name}</td>
                    <td className="p-3 text-muted-foreground hidden md:table-cell">
                      <span className="flex items-center gap-1">
                        <Mail className="size-3.5 shrink-0" />
                        {s.email}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="flex items-center gap-1">
                        <BookOpen className="size-3.5 shrink-0 text-muted-foreground" />
                        <span className="line-clamp-1 max-w-[180px]">{s.course}</span>
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#5c0f49] to-[#ffcc00] transition-all"
                            style={{ width: `${s.progress}%` }}
                          />
                        </div>
                        <span className="tabular-nums">{s.progress}%</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant={statusVariant[s.status]}>{s.status}</Badge>
                    </td>
                    <td className="p-3 text-muted-foreground">{s.lastActivity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-8">No students match your filters.</p>
      )}
    </div>
  );
}
