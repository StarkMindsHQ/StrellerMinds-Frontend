'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MOCK_APPLICATIONS, type MockApplication } from '@/data/mockInstructorData';
import { Search, Mail, Check, X, Clock } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const statusConfig: Record<
  MockApplication['status'],
  { variant: 'default' | 'secondary' | 'outline'; icon: typeof Check }
> = {
  pending: { variant: 'secondary', icon: Clock },
  approved: { variant: 'default', icon: Check },
  rejected: { variant: 'outline', icon: X },
};

export default function ApplicationReview() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<MockApplication['status'] | 'all'>('all');

  const filtered = useMemo(() => {
    return MOCK_APPLICATIONS.filter((a) => {
      const matchSearch =
        !search ||
        a.applicantName.toLowerCase().includes(search.toLowerCase()) ||
        a.email.toLowerCase().includes(search.toLowerCase()) ||
        a.course.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || a.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as MockApplication['status'] | 'all')}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((app) => {
          const config = statusConfig[app.status];
          const Icon = config.icon;
          return (
            <Card key={app.id} className="overflow-hidden border-[#5c0f49]/15 hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <CardTitle className="text-base">{app.applicantName}</CardTitle>
                  <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
                    <Icon className="size-3" />
                    {app.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Mail className="size-3.5" />
                  {app.email}
                </p>
                <p className="text-sm font-medium text-[#5c0f49]">{app.course}</p>
                <p className="text-xs text-muted-foreground">Submitted {app.submittedAt}</p>
              </CardHeader>
              {app.message && (
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground border-t pt-3">{app.message}</p>
                </CardContent>
              )}
              {app.status === 'pending' && (
                <CardContent className="pt-0 flex gap-2">
                  <Button size="sm" variant="secondary">Approve</Button>
                  <Button size="sm" variant="outline">Reject</Button>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-8">No applications match your filters.</p>
      )}
    </div>
  );
}
