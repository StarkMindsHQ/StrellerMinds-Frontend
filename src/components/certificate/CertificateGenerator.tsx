'use client';

import React, { useState } from 'react';
import { Download, Award, Calendar, User, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface CertificateData {
  id: string;
  userName: string;
  courseTitle: string;
  instructorName: string;
  completionDate: string;
  durationHours: number;
  score?: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  certificateId: string;
}

interface CertificateGeneratorProps {
  certificateData: CertificateData;
  className?: string;
}

export function CertificateGenerator({ certificateData, className }: CertificateGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const generateCertificatePDF = async () => {
    setIsGenerating(true);
    try {
      const element = document.getElementById('certificate-content');
      if (!element) {
        throw new Error('Certificate element not found');
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      
      const imgWidth = 297; // A4 width in mm (landscape)
      const pageHeight = 210; // A4 height in mm (landscape)
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${certificateData.userName.replace(/\s+/g, '_')}_${certificateData.courseTitle.replace(/\s+/g, '_')}_Certificate.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'Advanced':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const CertificateContent = ({ isPreview = false }: { isPreview?: boolean }) => (
    <div
      id="certificate-content"
      className={cn(
        'relative w-full max-w-4xl mx-auto bg-white p-12',
        isPreview ? 'scale-50 origin-top' : '',
        'border-8 border-double border-amber-600',
      )}
    >
      {/* Certificate Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full bg-gradient-to-br from-amber-200 to-amber-600"></div>
      </div>
      
      {/* Certificate Content */}
      <div className="relative z-10 text-center">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-amber-100 rounded-full">
              <Award className="h-16 w-16 text-amber-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-amber-900 mb-2">Certificate of Completion</h1>
          <p className="text-lg text-amber-700">StrellerMinds Learning Platform</p>
        </div>

        {/* Main Content */}
        <div className="mb-8 space-y-4">
          <p className="text-2xl text-gray-800 font-medium">
            This is to certify that
          </p>
          <div className="py-4 border-y-2 border-amber-300">
            <h2 className="text-3xl font-bold text-gray-900">
              {certificateData.userName}
            </h2>
          </div>
          <p className="text-xl text-gray-800">
            has successfully completed the course
          </p>
          <div className="py-4">
            <h3 className="text-2xl font-bold text-amber-800">
              {certificateData.courseTitle}
            </h3>
            <div className="flex justify-center mt-2">
              <Badge className={getLevelBadgeColor(certificateData.level)}>
                {certificateData.level} Level
              </Badge>
            </div>
          </div>
        </div>

        {/* Course Details */}
        <div className="grid grid-cols-3 gap-4 mb-8 text-sm">
          <div className="flex items-center justify-center gap-2">
            <Calendar className="h-4 w-4 text-amber-600" />
            <span className="text-gray-600">Completed: {certificateData.completionDate}</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <User className="h-4 w-4 text-amber-600" />
            <span className="text-gray-600">Instructor: {certificateData.instructorName}</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Award className="h-4 w-4 text-amber-600" />
            <span className="text-gray-600">Duration: {certificateData.durationHours} hours</span>
          </div>
        </div>

        {/* Score (if available) */}
        {certificateData.score && (
          <div className="mb-6">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-lg font-semibold text-gray-800">
                Final Score: {certificateData.score}%
              </span>
            </div>
          </div>
        )}

        {/* Certificate ID */}
        <div className="mt-8 pt-4 border-t border-amber-200">
          <p className="text-xs text-gray-500">
            Certificate ID: {certificateData.certificateId}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            This certificate can be verified at: strellerminds.com/verify/{certificateData.certificateId}
          </p>
        </div>

        {/* Signatures */}
        <div className="flex justify-between mt-12 pt-8 border-t border-amber-200">
          <div className="text-center">
            <div className="w-32 h-0.5 bg-gray-400 mb-2"></div>
            <p className="text-sm text-gray-600">{certificateData.instructorName}</p>
            <p className="text-xs text-gray-500">Course Instructor</p>
          </div>
          <div className="text-center">
            <div className="w-32 h-0.5 bg-gray-400 mb-2"></div>
            <p className="text-sm text-gray-600">StrellerMinds Platform</p>
            <p className="text-xs text-gray-500">Authorized Signatory</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={cn('w-full max-w-6xl mx-auto space-y-6', className)}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Course Certificate
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Certificate Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-500">Student</p>
              <p className="font-medium">{certificateData.userName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Course</p>
              <p className="font-medium truncate">{certificateData.courseTitle}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="font-medium">{certificateData.completionDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Certificate ID</p>
              <p className="font-mono text-xs">{certificateData.certificateId}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={generateCertificatePDF}
              disabled={isGenerating}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {isGenerating ? 'Generating...' : 'Download PDF'}
            </Button>
            <Button
              variant="outline"
              onClick={() => setPreviewMode(!previewMode)}
            >
              {previewMode ? 'Hide Preview' : 'Show Preview'}
            </Button>
          </div>

          {/* Preview */}
          {previewMode && (
            <div className="border rounded-lg p-4 bg-gray-50 overflow-auto">
              <CertificateContent isPreview={true} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Full Certificate (for PDF generation) */}
      <div className="hidden">
        <CertificateContent />
      </div>
    </div>
  );
}
