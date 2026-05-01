import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  validateQueryParams,
  createApiSuccess,
  createApiError,
} from '@/lib/api-validation';

// Schema for certificate generation request
export const certificateRequestSchema = z.object({
  userId: z.string(),
  courseId: z.string(),
  userName: z.string().optional(),
});

// Mock certificate data - in production this would come from database
const mockCertificates = new Map<string, any>();

// Helper to generate certificate ID
function generateCertificateId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `CERT-${timestamp}-${random}`.toUpperCase();
}

// Helper to get course data
function getCourseData(courseId: string) {
  const courses = {
    'blockchain-fundamentals': {
      title: 'Fundamentals of Blockchain Technology',
      instructor: 'Dr. Sarah Chen',
      durationHours: 6,
      level: 'Beginner' as const,
    },
    'stellar-smart-contract': {
      title: 'Stellar Smart Contract Development',
      instructor: 'Alex Rodriguez',
      durationHours: 8,
      level: 'Intermediate' as const,
    },
    'defi-stellar': {
      title: 'Decentralized Finance (DeFi) on Stellar',
      instructor: 'Michael Thompson',
      durationHours: 10,
      level: 'Advanced' as const,
    },
  };
  return courses[courseId as keyof typeof courses];
}

// Helper to get user data
function getUserData(userId: string) {
  const users = {
    'user@example.com': {
      name: 'John Doe',
      completedCourses: ['blockchain-fundamentals'],
    },
    'student@example.com': {
      name: 'Jane Smith',
      completedCourses: ['stellar-smart-contract'],
    },
  };
  return users[userId as keyof typeof users];
}

// Helper to check if user completed course
function hasUserCompletedCourse(userId: string, courseId: string): boolean {
  const userData = getUserData(userId);
  return userData?.completedCourses.includes(courseId) || false;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validateQueryParams(
      request,
      certificateRequestSchema,
      body,
    );

    if (!validation.success) {
      return validation.response;
    }

    const { userId, courseId, userName } = validation.data;

    // Check if user has completed the course
    if (!hasUserCompletedCourse(userId, courseId)) {
      return createApiError('Course not completed by user', 400);
    }

    // Get course and user data
    const courseData = getCourseData(courseId);
    if (!courseData) {
      return createApiError('Course not found', 404);
    }

    const userData = getUserData(userId);
    if (!userData) {
      return createApiError('User not found', 404);
    }

    // Generate certificate data
    const certificateId = generateCertificateId();
    const certificateData = {
      id: certificateId,
      userName: userName || userData.name,
      courseTitle: courseData.title,
      instructorName: courseData.instructor,
      completionDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      durationHours: courseData.durationHours,
      level: courseData.level,
      certificateId,
      userId,
      courseId,
      issuedAt: new Date().toISOString(),
    };

    // Store certificate (in production, save to database)
    mockCertificates.set(certificateId, certificateData);

    return createApiSuccess(
      'Certificate generated successfully',
      certificateData,
    );
  } catch (error) {
    console.error('Error in POST /api/certificates:', error);
    return createApiError('An unexpected error occurred', 500);
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const certificateId = searchParams.get('id');
    const userId = searchParams.get('userId');

    if (certificateId) {
      // Get specific certificate
      const certificate = mockCertificates.get(certificateId);
      if (!certificate) {
        return createApiError('Certificate not found', 404);
      }
      return createApiSuccess(
        'Certificate retrieved successfully',
        certificate,
      );
    } else if (userId) {
      // Get all certificates for user
      const userCertificates = Array.from(mockCertificates.values()).filter(
        (cert) => cert.userId === userId,
      );
      return createApiSuccess('User certificates retrieved successfully', {
        certificates: userCertificates,
        count: userCertificates.length,
      });
    } else {
      return createApiError('Certificate ID or User ID is required', 400);
    }
  } catch (error) {
    console.error('Error in GET /api/certificates:', error);
    return createApiError('An unexpected error occurred', 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { certificateId, action } = body;

    if (action === 'verify') {
      const certificate = mockCertificates.get(certificateId);
      if (!certificate) {
        return createApiError('Certificate not found', 404);
      }

      // Update verification status
      certificate.verifiedAt = new Date().toISOString();
      certificate.verified = true;

      return createApiSuccess('Certificate verified successfully', certificate);
    } else {
      return createApiError('Invalid action', 400);
    }
  } catch (error) {
    console.error('Error in PUT /api/certificates:', error);
    return createApiError('An unexpected error occurred', 500);
  }
}
