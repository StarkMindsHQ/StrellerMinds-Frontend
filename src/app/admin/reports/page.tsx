"use client";

import React, { useState, useEffect, useCallback } from 'react';
import MainLayout from '@/components/MainLayout';
import { AdminReportList } from '@/components/admin/AdminReportList';
import { reportService, FetchReportsOptions } from '@/services/reportService';
import { Report, ReportStatus, ReportContentType } from '@/types/report';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Loader2, ShieldAlert, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FetchReportsOptions>({
    page: 1,
    limit: 20,
    status: undefined,
    contentType: undefined,
  });

  const loadReports = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await reportService.fetchReports(filters);
      setReports(data.reports);
      setError(null);
    } catch (err) {
      console.error('Error loading reports:', err);
      setError(err instanceof Error ? err.message : 'Failed to load reports');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const handleStatusFilterChange = (value: string) => {
    setFilters(prev => ({ 
      ...prev, 
      status: value === 'ALL' ? undefined : value,
      page: 1 
    }));
  };

  const handleContentTypeFilterChange = (value: string) => {
    setFilters(prev => ({ 
      ...prev, 
      contentType: value === 'ALL' ? undefined : value,
      page: 1 
    }));
  };

  return (
    <MainLayout variant="container" padding="large">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
              <ShieldAlert className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Content Moderation</h1>
              <p className="text-gray-500">Manage and resolve user-reported content</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <Select onValueChange={handleStatusFilterChange} defaultValue="ALL">
                <SelectTrigger className="w-[150px] bg-white dark:bg-gray-950">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value={ReportStatus.PENDING}>Pending</SelectItem>
                  <SelectItem value={ReportStatus.REVIEWED}>Reviewed</SelectItem>
                  <SelectItem value={ReportStatus.RESOLVED}>Resolved</SelectItem>
                  <SelectItem value={ReportStatus.DISMISSED}>Dismissed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Select onValueChange={handleContentTypeFilterChange} defaultValue="ALL">
              <SelectTrigger className="w-[150px] bg-white dark:bg-gray-950">
                <SelectValue placeholder="Content Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value={ReportContentType.REVIEW}>Review</SelectItem>
                <SelectItem value={ReportContentType.COMMENT}>Comment</SelectItem>
                <SelectItem value={ReportContentType.COURSE}>Course</SelectItem>
                <SelectItem value={ReportContentType.LESSON}>Lesson</SelectItem>
                <SelectItem value={ReportContentType.USER}>User</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={() => loadReports()}>
              Refresh
            </Button>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
            <p className="text-gray-500 animate-pulse">Loading reports...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/20">
            <ShieldAlert className="w-12 h-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">Error Loading Reports</h3>
            <p className="text-red-600 dark:text-red-400 max-w-md">{error}</p>
            <Button className="mt-6 bg-red-600 hover:bg-red-700" onClick={() => loadReports()}>
              Retry
            </Button>
          </div>
        ) : (
          <AdminReportList reports={reports} onReportUpdated={loadReports} />
        )}
      </div>
    </MainLayout>
  );
}
