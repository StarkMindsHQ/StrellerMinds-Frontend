'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormError } from '@/components/ui/form-error';
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from '@/lib/validations';

export default function ChangePassword() {
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    mode: 'all',
  });

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const onSubmit = async (data: ChangePasswordFormData) => {
    setIsLoading(true);
    clearErrors();

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate random error for incorrect current password (30% chance)
      if (Math.random() < 0.3) {
        throw new Error('Current password is incorrect');
      }

      // Success
      setIsSuccess(true);
      reset();

      // Auto-hide success message after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      setError('root', {
        message:
          error instanceof Error ? error.message : 'Failed to update password',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-5 duration-300">
      <div className="bg-white/50 backdrop-blur-sm p-8 rounded-xl border border-purple-100">
        <h3 className="text-xl font-bold text-[#5c0f49] mb-6">
          Change Password
        </h3>

        {/* Success Message */}
        {isSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center space-x-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
            <div>
              <p className="text-green-800 font-medium">
                Password updated successfully!
              </p>
              <p className="text-green-600 text-sm">
                Your password has been changed.
              </p>
            </div>
          </div>
        )}

        {/* General Error Message */}
        {errors.root && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <div>
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-600 text-sm">{errors.root.message}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Current Password */}
          <div>
            <Label
              htmlFor="current-password"
              className="text-sm font-semibold text-[#5c0f49] mb-3 block"
            >
              Current Password *
            </Label>
            <div className="relative">
              <Input
                id="current-password"
                type={showPasswords.current ? 'text' : 'password'}
                placeholder="Enter current password"
                {...register('currentPassword')}
                className={`rounded-xl border-purple-200 focus:border-[#5c0f49] focus:ring-[#5c0f49]/20 bg-white/70 backdrop-blur-sm pr-12 transition-all duration-300 ${
                  errors.currentPassword
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : ''
                }`}
                disabled={isLoading || isSubmitting}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#5c0f49] transition-colors duration-300"
                disabled={isLoading || isSubmitting}
              >
                {showPasswords.current ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            <FormError message={errors.currentPassword?.message} />
          </div>

          {/* New Password */}
          <div>
            <Label
              htmlFor="new-password"
              className="text-sm font-semibold text-[#5c0f49] mb-3 block"
            >
              New Password *
            </Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showPasswords.new ? 'text' : 'password'}
                placeholder="Enter new password"
                {...register('newPassword')}
                className={`rounded-xl border-purple-200 focus:border-[#5c0f49] focus:ring-[#5c0f49]/20 bg-white/70 backdrop-blur-sm pr-12 transition-all duration-300 ${
                  errors.newPassword
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : ''
                }`}
                disabled={isLoading || isSubmitting}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#5c0f49] transition-colors duration-300"
                disabled={isLoading || isSubmitting}
              >
                {showPasswords.new ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            <FormError message={errors.newPassword?.message} />
            <div className="mt-2 text-xs text-gray-600">
              Password must be at least 8 characters with uppercase, lowercase,
              and number
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <Label
              htmlFor="confirm-password"
              className="text-sm font-semibold text-[#5c0f49] mb-3 block"
            >
              Confirm New Password *
            </Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showPasswords.confirm ? 'text' : 'password'}
                placeholder="Confirm new password"
                {...register('confirmPassword')}
                className={`rounded-xl border-purple-200 focus:border-[#5c0f49] focus:ring-[#5c0f49]/20 bg-white/70 backdrop-blur-sm pr-12 transition-all duration-300 ${
                  errors.confirmPassword
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : ''
                }`}
                disabled={isLoading || isSubmitting}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#5c0f49] transition-colors duration-300"
                disabled={isLoading || isSubmitting}
              >
                {showPasswords.confirm ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            <FormError message={errors.confirmPassword?.message} />
          </div>

          <Button
            type="submit"
            disabled={isLoading || isSubmitting}
            variant="primary"
            size="lg"
          >
            {isLoading || isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-[#5c0f49]/30 border-t-[#5c0f49] rounded-full animate-spin"></div>
                <span>Updating Password...</span>
              </div>
            ) : (
              'Update Password'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
