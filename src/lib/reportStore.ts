import { ReportStatus, ReportContentType, ReportReason } from '@/types/report';

export interface StoredReport {
  id: string;
  contentType: ReportContentType;
  contentId: string;
  reason: ReportReason;
  details: string | null;
  status: ReportStatus;
  reporterId: string;
  reporter: {
    id: string;
    name: string | null;
    email: string;
  };
  resolvedBy: string | null;
  resolvedByUser: {
    id: string;
    name: string | null;
    email: string;
  } | null;
  resolvedAt: string | null;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

// In-memory storage for reports
// In production, replace with database (Prisma)
export const reportStore: StoredReport[] = [];
export let reportIdCounter = 1;
