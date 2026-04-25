'use client';

import React, { useState, useEffect } from 'react';
import { Plus, X, Package, DollarSign, Percent, Save, Trash2, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import type { EnhancedCourseData } from '@/lib/course-data';

export interface BundleCourse {
  id: string;
  course: EnhancedCourseData;
  included: boolean;
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
  createdAt: string;
  updatedAt: string;
}

interface CourseBundleBuilderProps {
  availableCourses: EnhancedCourseData[];
  onBundleCreate?: (bundle: CourseBundle) => void;
  onBundleUpdate?: (bundle: CourseBundle) => void;
  className?: string;
}

export function CourseBundleBuilder({ 
  availableCourses, 
  onBundleCreate, 
  onBundleUpdate,
  className 
}: CourseBundleBuilderProps) {
  const [bundleCourses, setBundleCourses] = useState<BundleCourse[]>([]);
  const [bundleName, setBundleName] = useState('');
  const [bundleDescription, setBundleDescription] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState(10);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Initialize bundle courses
  useEffect(() => {
    const initialBundleCourses = availableCourses.map(course => ({
      id: course.id,
      course,
      included: false,
    }));
    setBundleCourses(initialBundleCourses);
  }, [availableCourses]);

  // Calculate prices
  const originalPrice = bundleCourses
    .filter(bc => bc.included && bc.course.price)
    .reduce((sum, bc) => sum + (bc.course.price || 0), 0);

  const discountedPrice = discountType === 'percentage' 
    ? originalPrice * (1 - discountValue / 100)
    : Math.max(0, originalPrice - discountValue);

  const totalSavings = originalPrice - discountedPrice;

  const handleCourseToggle = (courseId: string, included: boolean) => {
    setBundleCourses(prev => 
      prev.map(bc => 
        bc.id === courseId ? { ...bc, included } : bc
      )
    );
  };

  const handleSaveBundle = async () => {
    if (!bundleName.trim()) {
      setError('Bundle name is required');
      return;
    }

    if (bundleCourses.filter(bc => bc.included).length < 2) {
      setError('At least 2 courses must be included in the bundle');
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const bundleData = {
        name: bundleName,
        description: bundleDescription,
        courses: bundleCourses.filter(bc => bc.included).map(bc => ({
          id: bc.id,
          title: bc.course.title,
          price: bc.course.price,
        })),
        discountType,
        discountValue,
        originalPrice,
        discountedPrice,
        isActive: true,
      };

      const response = await fetch('/api/bundles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bundleData),
      });

      if (!response.ok) {
        throw new Error('Failed to save bundle');
      }

      const data = await response.json();
      const savedBundle = data.data;

      setSuccess('Bundle saved successfully!');
      if (onBundleCreate) {
        onBundleCreate(savedBundle);
      }

      // Reset form after successful save
      setTimeout(() => {
        resetForm();
        setIsDialogOpen(false);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save bundle');
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setBundleName('');
    setBundleDescription('');
    setDiscountType('percentage');
    setDiscountValue(10);
    setBundleCourses(prev => prev.map(bc => ({ ...bc, included: false })));
    setError(null);
    setSuccess(null);
  };

  const includedCourses = bundleCourses.filter(bc => bc.included);

  return (
    <div className={cn('w-full space-y-6', className)}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Course Bundle Builder
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Bundle Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bundle-name">Bundle Name</Label>
              <Input
                id="bundle-name"
                value={bundleName}
                onChange={(e) => setBundleName(e.target.value)}
                placeholder="e.g., Blockchain Developer Bundle"
              />
            </div>
            <div>
              <Label htmlFor="bundle-description">Description</Label>
              <Textarea
                id="bundle-description"
                value={bundleDescription}
                onChange={(e) => setBundleDescription(e.target.value)}
                placeholder="Describe what students will learn in this bundle"
                rows={3}
              />
            </div>
          </div>

          {/* Discount Settings */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Percent className="h-4 w-4" />
              Discount Settings
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label>Discount Type</Label>
                <div className="flex gap-2 mt-2">
                  <Button
                    type="button"
                    variant={discountType === 'percentage' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDiscountType('percentage')}
                  >
                    Percentage
                  </Button>
                  <Button
                    type="button"
                    variant={discountType === 'fixed' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDiscountType('fixed')}
                  >
                    Fixed Amount
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="discount-value">
                  {discountType === 'percentage' ? 'Discount %' : 'Discount Amount ($)'}
                </Label>
                <Input
                  id="discount-value"
                  type="number"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
                  min={discountType === 'percentage' ? 0 : 0}
                  max={discountType === 'percentage' ? 100 : undefined}
                  step={discountType === 'percentage' ? 1 : 5}
                />
              </div>
              <div className="flex items-end">
                <div className="text-sm text-gray-600">
                  <p>Savings: ${totalSavings.toFixed(2)}</p>
                  <p className="font-semibold text-green-600">
                    {totalSavings > 0 && originalPrice > 0 
                      ? `${((totalSavings / originalPrice) * 100).toFixed(1)}% off`
                      : 'No discount'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Course Selection */}
          <div>
            <h3 className="font-semibold mb-4">Select Courses for Bundle</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto border rounded-lg p-4">
              {bundleCourses.map((bundleCourse) => (
                <div key={bundleCourse.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={bundleCourse.included}
                      onCheckedChange={(checked) => 
                        handleCourseToggle(bundleCourse.id, checked as boolean)
                      }
                    />
                    <div>
                      <p className="font-medium">{bundleCourse.course.title}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {bundleCourse.course.level}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {bundleCourse.course.durationHours}h
                        </Badge>
                        {bundleCourse.course.price && (
                          <Badge variant="outline" className="text-xs">
                            ${bundleCourse.course.price}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bundle Summary */}
          {includedCourses.length > 0 && (
            <div className="border rounded-lg p-4 bg-blue-50">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Bundle Summary
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Courses ({includedCourses.length}):</span>
                  <span>${originalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount ({discountType === 'percentage' ? `${discountValue}%` : `$${discountValue}`}):</span>
                  <span className="text-red-600">-${totalSavings.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Bundle Price:</span>
                  <span className="text-green-600">${discountedPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Error/Success Messages */}
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={handleSaveBundle}
              disabled={isSaving || !bundleName.trim() || includedCourses.length < 2}
              className="flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Bundle
                </>
              )}
            </Button>
            <Button variant="outline" onClick={resetForm}>
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
