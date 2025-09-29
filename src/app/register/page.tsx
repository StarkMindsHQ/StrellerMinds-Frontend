'use client';

import React from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { Eye, EyeOff, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/inputt"
import { FormField } from "@/components/form-field"
import { PhoneInput } from "@/components/phone-input"
import { Logo } from "@/components/logo"
import { logger } from "@/lib/logger"
import { registerSchema, type RegisterFormData } from "@/lib/validations"

export default function Register() {
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'all',
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      // Automatically append +234 to phone number
      const formDataWithCountryCode = {
        ...data,
        phone: `+234${data.phone}`
      }
      
      // Submit form data
      logger.log("Form submitted:", formDataWithCountryCode)
      
      // Here you would typically make an API call
      // const response = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formDataWithCountryCode),
      // })
      
    } catch (error) {
      console.error('Registration error:', error)
    }
  };

  return (
    <div className="flex flex-col justify-center items-center py-10 px-4">
      <div className="w-full max-w-md mx-auto">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-6">
            <Logo />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#5D4037] mb-2">
            Create an Account
          </h1>
          <p className="text-gray-600 mb-6">
            Register for StrellerMinds, a pioneering blockchain education
            platform on Stellar
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Name" name="name" error={errors.name?.message}>
            <Input
              id="name"
              placeholder="Enter"
              {...register('name')}
              error={!!errors.name}
            />
          </FormField>

          <FormField label="Email" name="email" error={errors.email?.message}>
            <Input
              id="email"
              type="email"
              placeholder="Enter"
              {...register('email')}
              error={!!errors.email}
            />
          </FormField>

          <FormField label="Phone" name="phone" error={errors.phone?.message}>
            <PhoneInput
              value={watch('phone') || ''}
              onChange={(value) => {
                setValue('phone', value, { shouldValidate: true })
              }}
              error={!!errors.phone}
            />
          </FormField>

          <FormField label="Password" name="password" error={errors.password?.message}>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter"
                {...register('password')}
                error={!!errors.password}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </FormField>

          <FormField label="Confirm Password" name="confirmPassword" error={errors.confirmPassword?.message}>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm password"
                {...register('confirmPassword')}
                error={!!errors.confirmPassword}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </FormField>

          <div className="text-sm">
            <p>
              By registering, you agree to StrellerMinds{' '}
              <Link href="/terms" className="text-red-600 hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-red-600 hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>

          <Button 
            type="submit" 
            className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registering...' : 'Register'}
          </Button>

          <div className="text-center mt-4">
            <p>
              Have an account?{' '}
              <Link href="/login" className="text-red-600 hover:underline">
                Sign In
              </Link>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center sm:space-x-8 space-y-2 sm:space-y-0 mt-6 text-gray-600 text-sm">
            <div className="flex items-center justify-center">
              <Phone className="h-4 w-4 mr-2" />
              <span>+2348623766884</span>
            </div>
            <div className="flex items-center justify-center">
              <Mail className="h-4 w-4 mr-2" />
              <span>info@strellerminds.com</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
