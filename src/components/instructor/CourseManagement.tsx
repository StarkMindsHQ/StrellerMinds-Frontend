'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MOCK_COURSES, type MockCourse } from '@/data/mockInstructorData';
import { Search, Users, BookOpen, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

const statusVariant: Record<MockCourse['status'], 'default' | 'secondary' | 'outline'> = {
  published: 'default',
  draft: 'secondary',
  archived: 'outline',
};

export default function CourseManagement() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<MockCourse['status'] | 'all'>('all');

  const filtered = useMemo(() => {
    return MOCK_COURSES.filter((c) => {
      const matchSearch =
        !search ||
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.slug.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || c.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search courses by title or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {(['all', 'published', 'draft', 'archived'] as const).map((s) => (
            <Button
              key={s}
              size="sm"
              variant={statusFilter === s ? 'secondary' : 'ghost'}
              onClick={() => setStatusFilter(s)}
              className={cn(
                'capitalize',
                statusFilter === s
                  ? 'text-white'
                  : 'text-[#5c0f49]'
              )}
            >
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
        {filtered.map((course) => (
          <Card key={course.id} className="overflow-hidden border-[#5c0f49]/15 hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <CardTitle className="text-lg">{course.title}</CardTitle>
                <Badge variant={statusVariant[course.status]}>{course.status}</Badge>
              </div>
              <p className="text-sm text-muted-foreground font-mono">{course.slug}</p>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5 text-[#5c0f49] font-medium">
                <Users className="size-4 text-purple-600" />
                {course.enrolledCount} enrolled
              </span>
              <span className="flex items-center gap-1.5 text-purple-600 font-medium">
                <BookOpen className="size-4 text-[#5c0f49]" />
                {course.modulesCount} modules
              </span>
              <span className="flex items-center gap-1.5 text-amber-600 font-medium">
                <Calendar className="size-4 text-amber-500" />
                Updated {course.lastUpdated}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-8">No courses match your filters.</p>
      )}
    </div>
  );
}
