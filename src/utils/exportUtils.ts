import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import {
  type RealTimeState,
  type AnalyticsEvent,
} from '@/services/realTimeAnalyticsService';

// Extend jsPDF with autotable types
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export type ExportFormat = 'pdf' | 'csv' | 'xlsx';

export const exportAnalyticsData = async (
  format: ExportFormat,
  data: RealTimeState,
  reportName: string = 'Analytics_Report',
) => {
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `${reportName}_${timestamp}`;

  switch (format) {
    case 'csv':
      exportToCSV(data, filename);
      break;
    case 'xlsx':
      exportToExcel(data, filename);
      break;
    case 'pdf':
      exportToPDF(data, filename);
      break;
  }
};

const exportToCSV = (data: RealTimeState, filename: string) => {
  const events = data.recentEvents.map((e) => ({
    Type: e.type,
    Message: e.message,
    Time: new Date(e.timestamp).toLocaleString(),
  }));

  const headers = ['Type', 'Message', 'Time'];
  const csvContent = [
    headers.join(','),
    ...events.map((row) =>
      headers.map((h) => `"${row[h as keyof typeof row]}"`).join(','),
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const exportToExcel = (data: RealTimeState, filename: string) => {
  const wsData = [
    ['Metric', 'Value'],
    ['Active Users', data.activeUsers],
    ['Total Enrollments', data.totalEnrollments],
    ['Total Revenue', `$${data.revenue}`],
    ['Completion Rate', `${data.completionRate}%`],
    [],
    ['Recent Events'],
    ['Type', 'Message', 'Timestamp'],
    ...data.recentEvents.map((e) => [
      e.type,
      e.message,
      new Date(e.timestamp).toLocaleString(),
    ]),
  ];

  const ws = XLSX.utils.aoa_to_sheet(wsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Analytics');
  XLSX.writeFile(wb, `${filename}.xlsx`);
};

const exportToPDF = (data: RealTimeState, filename: string) => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(20);
  doc.text('StarkMinds Platform Analytics', 14, 22);

  // Date
  doc.setFontSize(10);
  doc.text(`Report generated on: ${new Date().toLocaleString()}`, 14, 30);

  // Summary Metrics Table
  doc.autoTable({
    startY: 40,
    head: [['Key Metric', 'Count']],
    body: [
      ['Current Active Users', data.activeUsers],
      ['Total Enrollments', data.totalEnrollments],
      ['Total Platform Revenue', `$${data.revenue.toLocaleString()}`],
      ['Average Completion Rate', `${data.completionRate}%`],
    ],
    theme: 'striped',
    headStyles: { fillColor: [139, 92, 246] },
  });

  // Recent Events Table
  doc.setFontSize(14);
  doc.text('Recent Activity Feed', 14, (doc as any).lastAutoTable.finalY + 15);

  doc.autoTable({
    startY: (doc as any).lastAutoTable.finalY + 20,
    head: [['Type', 'Description', 'Time']],
    body: data.recentEvents.map((e) => [
      e.type.toUpperCase(),
      e.message,
      new Date(e.timestamp).toLocaleTimeString(),
    ]),
    theme: 'grid',
    headStyles: { fillColor: [236, 72, 153] },
  });

  doc.save(`${filename}.pdf`);
};
