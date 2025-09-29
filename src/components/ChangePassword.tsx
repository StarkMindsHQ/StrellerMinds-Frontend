'use client';

<<<<<<< HEAD
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/inputt'
import { Label } from '@/components/ui/label'
import { FormError } from '@/components/ui/form-error'
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react'
import { changePasswordSchema, type ChangePasswordFormData } from '@/lib/validations'

export default function ChangePassword() {
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

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
  })

=======
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/inputt';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ValidationErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  general?: string;
}

export default function ChangePassword() {
  const [formData, setFormData] = useState<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Required field validation
    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters long';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
      newErrors.newPassword =
        'Password must contain uppercase, lowercase, and number';
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Check if new password is same as current
    if (
      formData.currentPassword &&
      formData.newPassword &&
      formData.currentPassword === formData.newPassword
    ) {
      newErrors.newPassword =
        'New password must be different from current password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof PasswordFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear specific field error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    // Clear general error
    if (errors.general) {
      setErrors((prev) => ({ ...prev, general: undefined }));
    }

    // Clear success state
    if (isSuccess) {
      setIsSuccess(false);
    }
  };
>>>>>>> f89608a47ee4e9a4cd5e6970d561bb9f0c6b72a6

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

<<<<<<< HEAD
  const onSubmit = async (data: ChangePasswordFormData) => {
    setIsLoading(true)
    clearErrors()
=======
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});
>>>>>>> f89608a47ee4e9a4cd5e6970d561bb9f0c6b72a6

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate random error for incorrect current password (30% chance)
      if (Math.random() < 0.3) {
        throw new Error('Current password is incorrect');
      }

      // Success
<<<<<<< HEAD
      setIsSuccess(true)
      reset()
      
=======
      setIsSuccess(true);
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

>>>>>>> f89608a47ee4e9a4cd5e6970d561bb9f0c6b72a6
      // Auto-hide success message after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
<<<<<<< HEAD
      setError('root', {
        message: error instanceof Error ? error.message : 'Failed to update password'
      })
=======
      setErrors({
        general:
          error instanceof Error ? error.message : 'Failed to update password',
      });
>>>>>>> f89608a47ee4e9a4cd5e6970d561bb9f0c6b72a6
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
<<<<<<< HEAD
                {...register('currentPassword')}
=======
                value={formData.currentPassword}
                onChange={(e) =>
                  handleInputChange('currentPassword', e.target.value)
                }
>>>>>>> f89608a47ee4e9a4cd5e6970d561bb9f0c6b72a6
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
<<<<<<< HEAD
                {...register('newPassword')}
=======
                value={formData.newPassword}
                onChange={(e) =>
                  handleInputChange('newPassword', e.target.value)
                }
>>>>>>> f89608a47ee4e9a4cd5e6970d561bb9f0c6b72a6
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
<<<<<<< HEAD
                {...register('confirmPassword')}
=======
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange('confirmPassword', e.target.value)
                }
>>>>>>> f89608a47ee4e9a4cd5e6970d561bb9f0c6b72a6
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
