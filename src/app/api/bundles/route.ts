import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  validateQueryParams,
  createApiSuccess,
  createApiError,
} from '@/lib/api-validation';

// Schema for bundle creation
export const bundleCreateSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  courses: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        price: z.number().optional(),
      }),
    )
    .min(2),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.number().min(0),
  originalPrice: z.number().min(0),
  discountedPrice: z.number().min(0),
  isActive: z.boolean().default(true),
});

// Mock database for bundles
const bundles = new Map<string, any>();

// Helper to generate bundle ID
function generateBundleId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `bundle-${timestamp}-${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validateQueryParams(request, bundleCreateSchema, body);

    if (!validation.success) {
      return validation.response;
    }

    const bundleData = validation.data;
    const bundleId = generateBundleId();

    // Create bundle object
    const bundle = {
      id: bundleId,
      ...bundleData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'user@example.com', // In production, get from auth context
      enrolledCount: 0,
      revenue: 0,
    };

    // Store bundle (in production, save to database)
    bundles.set(bundleId, bundle);

    return createApiSuccess('Bundle created successfully', bundle);
  } catch (error) {
    console.error('Error in POST /api/bundles:', error);
    return createApiError('An unexpected error occurred', 500);
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bundleId = searchParams.get('id');
    const userId = searchParams.get('userId');
    const active = searchParams.get('active');

    if (bundleId) {
      // Get specific bundle
      const bundle = bundles.get(bundleId);
      if (!bundle) {
        return createApiError('Bundle not found', 404);
      }
      return createApiSuccess('Bundle retrieved successfully', bundle);
    } else if (userId) {
      // Get bundles created by user
      const userBundles = Array.from(bundles.values()).filter(
        (bundle) => bundle.createdBy === userId,
      );
      return createApiSuccess('User bundles retrieved successfully', {
        bundles: userBundles,
        count: userBundles.length,
      });
    } else {
      // Get all bundles with optional filtering
      let allBundles = Array.from(bundles.values());

      if (active === 'true') {
        allBundles = allBundles.filter((bundle) => bundle.isActive);
      } else if (active === 'false') {
        allBundles = allBundles.filter((bundle) => !bundle.isActive);
      }

      return createApiSuccess('Bundles retrieved successfully', {
        bundles: allBundles,
        count: allBundles.length,
      });
    }
  } catch (error) {
    console.error('Error in GET /api/bundles:', error);
    return createApiError('An unexpected error occurred', 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { bundleId, action, updates } = body;

    if (!bundleId) {
      return createApiError('Bundle ID is required', 400);
    }

    const bundle = bundles.get(bundleId);
    if (!bundle) {
      return createApiError('Bundle not found', 404);
    }

    if (action === 'update') {
      // Update bundle
      const updatedBundle = {
        ...bundle,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      bundles.set(bundleId, updatedBundle);
      return createApiSuccess('Bundle updated successfully', updatedBundle);
    } else if (action === 'activate' || action === 'deactivate') {
      // Activate/deactivate bundle
      bundle.isActive = action === 'activate';
      bundle.updatedAt = new Date().toISOString();

      bundles.set(bundleId, bundle);
      return createApiSuccess(
        `Bundle ${action === 'activate' ? 'activated' : 'deactivated'} successfully`,
        bundle,
      );
    } else if (action === 'enroll') {
      // Enroll user in bundle
      const { userId } = updates;
      if (!userId) {
        return createApiError('User ID is required for enrollment', 400);
      }

      // In production, this would create enrollment records
      bundle.enrolledCount = (bundle.enrolledCount || 0) + 1;
      bundle.revenue = (bundle.revenue || 0) + bundle.discountedPrice;
      bundle.updatedAt = new Date().toISOString();

      bundles.set(bundleId, bundle);

      return createApiSuccess('User enrolled in bundle successfully', {
        bundleId,
        userId,
        enrollmentDate: new Date().toISOString(),
      });
    } else {
      return createApiError('Invalid action', 400);
    }
  } catch (error) {
    console.error('Error in PUT /api/bundles:', error);
    return createApiError('An unexpected error occurred', 500);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bundleId = searchParams.get('id');

    if (!bundleId) {
      return createApiError('Bundle ID is required', 400);
    }

    const bundle = bundles.get(bundleId);
    if (!bundle) {
      return createApiError('Bundle not found', 404);
    }

    // Remove bundle
    bundles.delete(bundleId);

    return createApiSuccess('Bundle deleted successfully', { bundleId });
  } catch (error) {
    console.error('Error in DELETE /api/bundles:', error);
    return createApiError('An unexpected error occurred', 500);
  }
}
