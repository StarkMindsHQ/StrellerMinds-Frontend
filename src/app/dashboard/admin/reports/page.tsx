'use client';

import React, { useState, useEffect, useCallback } from 'react';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import {
  Flag,
  Calendar,
  User,
  Eye,
  CheckCircle,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { reportService } from '@/services/reportService';
import type {
  Report,
  ReportsListResponse,
  ReportStatus,
  ReportReason,
  ReportContentType,
  STATUSES,
} from '@/types/report';
import { ElectivePagination } from '@/components/ElectivePagination';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<ReportStatus | ''>('');
  const [adminNotes, setAdminNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    try {
      const options: any = { page, limit };
      if (statusFilter !== 'all') options.status = statusFilter;
      if (typeFilter !== 'all') options.contentType = typeFilter;

      const data: ReportsListResponse = await reportService.fetchReports(options);
      setReports(data.reports);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to load reports');
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, statusFilter, typeFilter]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    setUpdateStatus(report.status);
    setAdminNotes(report.adminNotes || '');
    setViewModalOpen(true);
  };

  const handleUpdateReport = async () => {
    if (!selectedReport) return;

    setIsUpdating(true);
    try {
      const updates: any = {};
      if (updateStatus) updates.status = updateStatus;
      if (adminNotes !== selectedReport.adminNotes) updates.adminNotes = adminNotes;

      const result = await reportService.updateReport(selectedReport.id, updates);
      setReports((prev) =>
        prev.map((r) => (r.id === selectedReport.id ? result.report : r))
      );
      setSelectedReport(result.report);
      toast.success('Report updated successfully');
    } catch (error) {
      console.error('Error updating report:', error);
      toast.error('Failed to update report');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    if (!confirm('Are you sure you want to delete this report?')) return;

    try {
      await reportService.deleteReport(reportId);
      setReports((prev) => prev.filter((r) => r.id !== reportId));
      toast.success('Report deleted successfully');
    } catch (error) {
      console.error('Error deleting report:', error);
      toast.error('Failed to delete report');
    }
  };

  const getStatusBadgeVariant = (status: ReportStatus) => {
    switch (status) {
      case 'PENDING':
        return 'secondary';
      case 'REVIEWED':
        return 'default';
      case 'RESOLVED':
        return 'default';
      case 'DISMISSED':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getReasonBadgeVariant = (reason: ReportReason) => {
    switch (reason) {
      case 'SPAM':
        return 'outline';
      case 'HARASSMENT':
        return 'destructive';
      case 'INAPPROPRIATE_CONTENT':
        return 'destructive';
      case 'MISINFORMATION':
        return 'warning';
      case 'OTHER':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const formatContentType = (type: ReportContentType) => {
    return type.replace('_', ' ');
  };

  return (
    <MainLayout variant="container" padding="medium">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Content Reports
            </h1>
            <p className="text-muted-foreground">
              Manage user-submitted content reports and take appropriate action.
            </p>
          </div>
          <Button onClick={fetchReports} variant="outline" disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex-1">
                <Label htmlFor="status-filter">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger id="status-filter">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    {STATUSES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Label htmlFor="type-filter">Content Type</Label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger id="type-filter">
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    <SelectItem value="COURSE">Course</SelectItem>
                    <SelectItem value="LESSON">Lesson</SelectItem>
                    <SelectItem value="MODULE">Module</SelectItem>
                    <SelectItem value="REVIEW">Review</SelectItem>
                    <SelectItem value="COMMENT">Comment</SelectItem>
                    <SelectItem value="USER">User</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reports Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flag className="w-5 h-5" />
              Reports ({total})
            </CardTitle>
            <CardDescription>
              {total === 0
                ? 'No reports found.'
                : `Showing ${reports.length} of ${total} reports`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : reports.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Flag className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No reports found matching current filters.</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Content</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Reported By</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-mono text-xs">
                          {report.contentId.substring(0, 8)}...
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {formatContentType(report.contentType)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getReasonBadgeVariant(report.reason)}>
                            {report.reason.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">
                              {report.reporter.name || 'Unknown'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(report.status)}>
                            {report.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            {new Date(report.createdAt).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewReport(report)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4 flex justify-center">
                <ElectivePagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* View/Edit Report Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Review Report</DialogTitle>
            <DialogDescription>
              Review the report details and take appropriate action.
            </DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Report ID</Label>
                  <p className="text-sm font-mono text-muted-foreground">
                    {selectedReport.id}
                  </p>
                </div>
                <div>
                  <Label>Reported At</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedReport.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Content Type</Label>
                  <p className="text-sm">
                    {formatContentType(selectedReport.contentType)}
                  </p>
                </div>
                <div>
                  <Label>Content ID</Label>
                  <p className="text-sm font-mono text-muted-foreground">
                    {selectedReport.contentId}
                  </p>
                </div>
              </div>

              <div>
                <Label>Reason</Label>
                <p className="text-sm">
                  {selectedReport.reason.replace('_', ' ')}
                </p>
              </div>

              {selectedReport.details && (
                <div>
                  <Label>Additional Details</Label>
                  <p className="text-sm text-muted-foreground border-l-2 border-muted pl-3">
                    {selectedReport.details}
                  </p>
                </div>
              )}

              <div>
                <Label>Reported By</Label>
                <p className="text-sm">
                  {selectedReport.reporter.name || 'Unknown'} ({selectedReport.reporter.email})
                </p>
              </div>

              {selectedReport.resolvedByUser && (
                <div>
                  <Label>Resolved By</Label>
                  <p className="text-sm">
                    {selectedReport.resolvedByUser.name || 'Unknown'} at{' '}
                    {new Date(selectedReport.resolvedAt!).toLocaleString()}
                  </p>
                </div>
              )}

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={updateStatus}
                  onValueChange={(v) => setUpdateStatus(v as ReportStatus)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="adminNotes">Admin Notes</Label>
                <Textarea
                  id="adminNotes"
                  placeholder="Add internal notes about this report..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setViewModalOpen(false)}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleUpdateReport}
              disabled={isUpdating || !selectedReport}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Update Report
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
