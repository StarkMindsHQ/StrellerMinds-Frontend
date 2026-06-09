"use client";

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Flag, Eye, CheckCircle, XCircle, AlertTriangle, MoreHorizontal } from 'lucide-react';
import { Report, ReportStatus, ReportReason, ReportContentType } from '@/types/report';
import { reportService } from '@/services/reportService';
import { format } from 'date-fns';

interface AdminReportListProps {
  reports: Report[];
  onReportUpdated: () => void;
}

export function AdminReportList({ reports, onReportUpdated }: AdminReportListProps) {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [status, setStatus] = useState<ReportStatus>(ReportStatus.PENDING);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenDetails = (report: Report) => {
    setSelectedReport(report);
    setAdminNotes(report.adminNotes || "");
    setStatus(report.status);
    setIsDetailsOpen(true);
  };

  const handleUpdateReport = async () => {
    if (!selectedReport) return;

    setIsSubmitting(true);
    try {
      await reportService.updateReport(selectedReport.id, {
        status,
        adminNotes,
      });
      toast.success("Report updated successfully");
      setIsDetailsOpen(false);
      onReportUpdated();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update report");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case ReportStatus.PENDING:
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400"><AlertTriangle className="w-3 h-3 mr-1" /> Pending</Badge>;
      case ReportStatus.REVIEWED:
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400"><Eye className="w-3 h-3 mr-1" /> Reviewed</Badge>;
      case ReportStatus.RESOLVED:
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400"><CheckCircle className="w-3 h-3 mr-1" /> Resolved</Badge>;
      case ReportStatus.DISMISSED:
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400"><XCircle className="w-3 h-3 mr-1" /> Dismissed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getReasonLabel = (reason: ReportReason) => {
    return reason.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950 overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50 dark:bg-gray-900/50">
          <TableRow>
            <TableHead>Content Type</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Reporter</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                No reports found
              </TableCell>
            </TableRow>
          ) : (
            reports.map((report) => (
              <TableRow key={report.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition-colors">
                <TableCell>
                  <div className="flex items-center font-medium">
                    <Flag className="w-4 h-4 mr-2 text-gray-400" />
                    {report.contentType}
                  </div>
                </TableCell>
                <TableCell>{getReasonLabel(report.reason)}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{report.reporter.name || "Anonymous"}</span>
                    <span className="text-xs text-gray-500">{report.reporter.email}</span>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(report.status)}</TableCell>
                <TableCell className="text-gray-500 text-sm">
                  {format(new Date(report.createdAt), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleOpenDetails(report)}>
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Report Details</DialogTitle>
            <DialogDescription>
              Review the report and take appropriate action.
            </DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-gray-500">Content Type</Label>
                  <p className="font-medium mt-1">{selectedReport.contentType}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Content ID</Label>
                  <p className="font-medium mt-1 truncate" title={selectedReport.contentId}>
                    {selectedReport.contentId}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-500">Reason</Label>
                  <p className="font-medium mt-1">{getReasonLabel(selectedReport.reason)}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Submitted On</Label>
                  <p className="font-medium mt-1">
                    {format(new Date(selectedReport.createdAt), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-gray-500">Reporter Details</Label>
                <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
                  <p className="text-sm font-medium">{selectedReport.reporter.name || "Anonymous"}</p>
                  <p className="text-xs text-gray-500">{selectedReport.reporter.email}</p>
                </div>
              </div>

              {selectedReport.details && (
                <div>
                  <Label className="text-gray-500">Additional Details</Label>
                  <p className="mt-1 text-sm bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border border-gray-100 dark:border-gray-800 leading-relaxed">
                    {selectedReport.details}
                  </p>
                </div>
              )}

              <div className="grid gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="grid gap-2">
                  <Label htmlFor="status">Update Status</Label>
                  <Select 
                    value={status} 
                    onValueChange={(v) => setStatus(v as ReportStatus)}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ReportStatus.PENDING}>Pending</SelectItem>
                      <SelectItem value={ReportStatus.REVIEWED}>Reviewed</SelectItem>
                      <SelectItem value={ReportStatus.RESOLVED}>Resolved</SelectItem>
                      <SelectItem value={ReportStatus.DISMISSED}>Dismissed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="adminNotes">Admin Notes</Label>
                  <Textarea
                    id="adminNotes"
                    placeholder="Add notes about the resolution..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>Cancel</Button>
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white" 
              onClick={handleUpdateReport}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
