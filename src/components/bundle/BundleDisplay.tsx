'use client';

import React, { useState } from 'react';
import {
  Package,
  DollarSign,
  Users,
  Clock,
  Star,
  ShoppingCart,
  CheckCircle,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export interface BundleCourse {
  id: string;
  title: string;
  price?: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  durationHours: number;
  instructor?: string;
  rating?: number;
}

export interface CourseBundle {
  id: string;
  name: string;
  description: string;
  courses: BundleCourse[];
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  originalPrice: number;
  discountedPrice: number;
  isActive: boolean;
  enrolledCount: number;
  revenue: number;
  createdAt: string;
  updatedAt: string;
}

interface BundleDisplayProps {
  bundle: CourseBundle;
  onEnroll?: (bundleId: string) => void;
  onEdit?: (bundle: CourseBundle) => void;
  onDelete?: (bundleId: string) => void;
  showActions?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}

export function BundleDisplay({
  bundle,
  onEnroll,
  onEdit,
  onDelete,
  showActions = true,
  variant = 'default',
  className,
}: BundleDisplayProps) {
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);

  const handleEnroll = async () => {
    if (!onEnroll) return;

    setIsEnrolling(true);
    try {
      await onEnroll(bundle.id);
      setEnrolled(true);
    } catch (error) {
      console.error('Enrollment failed:', error);
    } finally {
      setIsEnrolling(false);
    }
  };

  const savings = bundle.originalPrice - bundle.discountedPrice;
  const savingsPercentage =
    bundle.originalPrice > 0 ? (savings / bundle.originalPrice) * 100 : 0;

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

  if (variant === 'compact') {
    return (
      <Card className={cn('hover:shadow-lg transition-shadow', className)}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">{bundle.name}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {bundle.description}
              </p>
            </div>
            <div className="text-right ml-4">
              <div className="text-2xl font-bold text-green-600">
                ${bundle.discountedPrice}
              </div>
              <div className="text-sm text-gray-500 line-through">
                ${bundle.originalPrice}
              </div>
              <Badge className="bg-red-100 text-red-800 mt-1">
                {savingsPercentage.toFixed(0)}% OFF
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Package className="h-3 w-3" />
                {bundle.courses.length} courses
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {bundle.enrolledCount} enrolled
              </span>
            </div>

            {showActions && (
              <Button
                size="sm"
                onClick={handleEnroll}
                disabled={isEnrolling || enrolled || !bundle.isActive}
              >
                {enrolled ? (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Enrolled
                  </>
                ) : isEnrolling ? (
                  'Enrolling...'
                ) : (
                  <>
                    <ShoppingCart className="h-3 w-3 mr-1" />
                    Enroll
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('hover:shadow-lg transition-shadow', className)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2 mb-2">
              <Package className="h-5 w-5" />
              {bundle.name}
            </CardTitle>
            <p className="text-gray-600">{bundle.description}</p>

            <div className="flex gap-2 mt-3">
              <Badge variant={bundle.isActive ? 'default' : 'secondary'}>
                {bundle.isActive ? 'Active' : 'Inactive'}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Package className="h-3 w-3" />
                {bundle.courses.length} courses
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {bundle.enrolledCount} enrolled
              </Badge>
            </div>
          </div>

          <div className="text-right ml-6">
            <div className="text-3xl font-bold text-green-600">
              ${bundle.discountedPrice}
            </div>
            <div className="text-lg text-gray-500 line-through">
              ${bundle.originalPrice}
            </div>
            <Badge className="bg-red-100 text-red-800 mt-2">
              Save ${savings.toFixed(2)} ({savingsPercentage.toFixed(0)}% OFF)
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Courses List */}
        <div>
          <h4 className="font-semibold mb-3">Included Courses</h4>
          <div className="space-y-3">
            {bundle.courses.map((course, index) => (
              <div
                key={course.id}
                className="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-600">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{course.title}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {course.level}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-2 w-2 mr-1" />
                        {course.durationHours}h
                      </Badge>
                      {course.rating && (
                        <Badge variant="outline" className="text-xs">
                          <Star className="h-2 w-2 mr-1" />
                          {course.rating}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {course.price && (
                    <div>
                      <span className="text-sm text-gray-500 line-through">
                        ${course.price}
                      </span>
                      <span className="ml-2 font-semibold text-green-600">
                        FREE
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bundle Stats */}
        {variant === 'detailed' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {bundle.enrolledCount}
              </div>
              <div className="text-sm text-gray-600">Total Enrolled</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                ${bundle.revenue}
              </div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                ${bundle.discountedPrice}
              </div>
              <div className="text-sm text-gray-600">Bundle Price</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {savingsPercentage.toFixed(0)}%
              </div>
              <div className="text-sm text-gray-600">Discount</div>
            </div>
          </div>
        )}

        {/* Progress Bar for Enrollment Goal */}
        {bundle.enrolledCount > 0 && variant === 'detailed' && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Enrollment Progress</span>
              <span>{bundle.enrolledCount} students</span>
            </div>
            <Progress
              value={Math.min((bundle.enrolledCount / 100) * 100, 100)}
              className="h-2"
            />
          </div>
        )}

        {/* Action Buttons */}
        {showActions && (
          <div className="flex gap-2 pt-4 border-t">
            <Button
              onClick={handleEnroll}
              disabled={isEnrolling || enrolled || !bundle.isActive}
              className="flex-1"
            >
              {enrolled ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Already Enrolled
                </>
              ) : isEnrolling ? (
                'Enrolling...'
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Enroll in Bundle - ${bundle.discountedPrice}
                </>
              )}
            </Button>

            {onEdit && (
              <Button variant="outline" onClick={() => onEdit(bundle)}>
                Edit
              </Button>
            )}

            {onDelete && (
              <Button variant="destructive" onClick={() => onDelete(bundle.id)}>
                Delete
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
