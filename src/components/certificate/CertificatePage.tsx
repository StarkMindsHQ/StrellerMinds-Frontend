'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { CertificateGenerator, CertificateData } from './CertificateGenerator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Award, Clock, User } from 'lucide-react';

export default function CertificatePage() {
  const params = useParams();
  const [certificateData, setCertificateData] = useState<CertificateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const courseId = params.courseId as string;
        const userId = 'user@example.com'; // In production, get from auth context

        const response = await fetch('/api/certificates', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            courseId,
            userName: 'John Doe', // In production, get from user profile
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate certificate');
        }

        const data = await response.json();
        setCertificateData(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [params.courseId]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-red-600">
                <Award className="h-5 w-5" />
                <h3 className="font-semibold">Certificate Not Available</h3>
              </div>
              <p className="text-gray-600 mt-2">{error}</p>
              <p className="text-sm text-gray-500 mt-4">
                Certificates are available only after completing all course requirements.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!certificateData) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-6 text-center">
              <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-700">Certificate Not Found</h3>
              <p className="text-gray-500 mt-2">Unable to load certificate data.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge variant="secondary" className="text-sm">
            <CheckCircle className="h-3 w-3 mr-1" />
            Course Completed
          </Badge>
          <h1 className="text-3xl font-bold text-gray-900">Your Certificate</h1>
          <p className="text-gray-600">
            Congratulations on completing your course! Download your certificate below.
          </p>
        </div>

        {/* Certificate Generator */}
        <CertificateGenerator certificateData={certificateData} />

        {/* Additional Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Certificate Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Student Name</p>
                    <p className="font-medium">{certificateData.userName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Course</p>
                    <p className="font-medium">{certificateData.courseTitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium">{certificateData.durationHours} hours</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Completion Date</p>
                  <p className="font-medium">{certificateData.completionDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Certificate ID</p>
                  <p className="font-mono text-sm bg-gray-100 p-2 rounded">
                    {certificateData.certificateId}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Verification URL</p>
                  <a
                    href={`https://strellerminds.com/verify/${certificateData.certificateId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm break-all"
                  >
                    strellerminds.com/verify/{certificateData.certificateId}
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
