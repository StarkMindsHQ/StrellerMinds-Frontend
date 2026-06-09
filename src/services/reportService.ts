import type {
  CreateReportInput,
  UpdateReportInput,
  Report,
  ReportsListResponse,
  CreateReportResponse,
} from '@/types/report';
import { env } from '@/lib/env';

export interface FetchReportsOptions {
  page?: number;
  limit?: number;
  status?: string;
  contentType?: string;
}

export const reportService = {
  /**
   * Fetch reports (user's own or all if admin)
   */
  async fetchReports(
    options: FetchReportsOptions = {}
  ): Promise<ReportsListResponse> {
    const { page = 1, limit = 20, status, contentType } = options;

    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (status) params.append('status', status);
    if (contentType) params.append('contentType', contentType);

    const response = await fetch(
      `${env.NEXT_PUBLIC_API_BASE_URL}/reports?${params}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(env.NEXT_PUBLIC_API_TIMEOUT),
        credentials: 'include',
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch reports');
    }

    const data = await response.json();
    return data;
  },

  /**
   * Submit a new report
   */
  async submitReport(input: CreateReportInput): Promise<CreateReportResponse> {
    const response = await fetch(
      `${env.NEXT_PUBLIC_API_BASE_URL}/reports`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
        signal: AbortSignal.timeout(env.NEXT_PUBLIC_API_TIMEOUT),
        credentials: 'include',
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to submit report');
    }

    const data = await response.json();
    return data;
  },

  /**
   * Update a report (admin only)
   */
  async updateReport(
    reportId: string,
    updates: UpdateReportInput
  ): Promise<{ success: boolean; message: string; report: Report }> {
    const response = await fetch(
      `${env.NEXT_PUBLIC_API_BASE_URL}/admin/reports/${reportId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
        signal: AbortSignal.timeout(env.NEXT_PUBLIC_API_TIMEOUT),
        credentials: 'include',
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update report');
    }

    const data = await response.json();
    return data;
  },

  /**
   * Delete a report (admin only)
   */
  async deleteReport(reportId: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(
      `${env.NEXT_PUBLIC_API_BASE_URL}/admin/reports/${reportId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(env.NEXT_PUBLIC_API_TIMEOUT),
        credentials: 'include',
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete report');
    }

    const data = await response.json();
    return data;
  },

  /**
   * Get a single report (admin only)
   */
  async getReport(reportId: string): Promise<{ success: boolean; report: Report }> {
    const response = await fetch(
      `${env.NEXT_PUBLIC_API_BASE_URL}/admin/reports/${reportId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(env.NEXT_PUBLIC_API_TIMEOUT),
        credentials: 'include',
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch report');
    }

    const data = await response.json();
    return data;
  },
};
