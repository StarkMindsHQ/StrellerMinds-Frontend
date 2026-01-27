'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AnimatedGradientBackground from './Animated-graded-background';
import Link from 'next/link';
import { LuGithub } from 'react-icons/lu';
import { FaRegStar } from 'react-icons/fa';
import { Input } from './ui/input';
import { FormError } from './ui/form-error';
import { toast } from 'sonner';
import { loginSchema, type LoginFormData } from '@/lib/validations';

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [announcementMessage, setAnnouncementMessage] = useState('');
  const [submissionError, setSubmissionError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'all',
  });

  const onSubmit = async (data: LoginFormData) => {
    // Clear any previous error announcements and submission errors
    setAnnouncementMessage('');
    setSubmissionError('');
    setLoading(true);

    try {
      // Simulate API call - replace with actual API endpoint
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Authentication failure
          const errorMessage = 'Incorrect email or password. Please try again.';
          setSubmissionError(errorMessage);
          setAnnouncementMessage(errorMessage);
          setError('root', { message: errorMessage });
        } else {
          // Other server errors
          const errorMessage = 'An error occurred. Please try again later.';
          setSubmissionError(errorMessage);
          setAnnouncementMessage(errorMessage);
          setError('root', { message: errorMessage });
        }
        setLoading(false);
        return;
      }

      // Success
      const responseData = await response.json();
      setLoading(false);
      toast.success('Login successful!');

      // Handle successful login (e.g., redirect, store token, etc.)
      // Example: localStorage.setItem('token', responseData.data.token);
      // Example: router.push('/dashboard');
    } catch (error) {
      // Network or other connection errors
      const errorMessage =
        'Connection error. Please check your internet and try again.';
      setSubmissionError(errorMessage);
      setAnnouncementMessage(errorMessage);
      setError('root', { message: errorMessage });
      setLoading(false);
    }
  };

  const signInWithGithub = () => {
    return;
  };

  const signInWithStella = () => {
    return;
  };

  return (
    <AnimatedGradientBackground>
      <div className="flex justify-center items-center text-[#000]">
        <div className="bg-white shadow-lg p-8 rounded-lg w-full">
          <h2 className="text-2xl font-bold mb-2">Sign In</h2>
          <h2 className="mb-5 text-[#777]">
            Enter your credentials to access your account
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* ARIA live region for screen reader announcements */}
            <div role="alert" aria-live="assertive" className="sr-only">
              {announcementMessage}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold">
                Email
              </label>
              <Input
                className="w-full px-3 py-2 border rounded-lg outline-none"
                id="email"
                placeholder="you@example.com"
                type="email"
                {...register('email')}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              <FormError
                message={errors.email?.message}
                id="email-error"
                className="text-red-600 text-sm mt-1"
              />
            </div>
            <div>
              <div className="flex justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold"
                >
                  Password
                </label>
                <Link
                  href={'./'}
                  className="block text-sm font-medium text-[#155dfc]"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                className="w-full px-3 py-2 border rounded-lg outline-none"
                id="password"
                placeholder="Enter your password"
                type="password"
                {...register('password')}
                aria-invalid={!!errors.password}
                aria-describedby={
                  errors.password ? 'password-error' : undefined
                }
              />
              <FormError
                message={errors.password?.message}
                id="password-error"
                className="text-red-600 text-sm mt-1"
              />
            </div>
            {errors.root && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <FormError message={errors.root.message} />
              </div>
            )}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                className="mr-2 p-1"
                {...register('rememberMe')}
              />
              <label htmlFor="rememberMe">Remember Me</label>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || isSubmitting}
            >
              {loading || isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <div className="mt-9">
            <div className="relative">
              <hr className="h-[1px] bg-gray-500" />
              <span className="bg-white text-[13.7px] text-#777 absolute top-[-11px] left-[50%] px-4 transform -translate-x-1/2 text-nowrap">
                or continue with
              </span>
            </div>
            <div className="flex justify-between">
              <button
                onClick={signInWithGithub}
                className="shadow-xl border-1 border-#777 rounded-[9px] text-[#777] flex gap-2 py-[10.5px] px-[37.6px] my-[30px]"
              >
                <LuGithub className="mt-[2px]" />
                <span>GitHub</span>
              </button>
              <button
                onClick={signInWithStella}
                className="shadow-xl border-1 border-#777 rounded-[9px] text-[#777] flex gap-2 py-[10.5px] px-[37.6px] my-[30px]"
              >
                <FaRegStar className="mt-[3px]" color="#155dfc" />
                <span>Stellar</span>
              </button>
            </div>
            <p className="text-center">
              Don't have an account?
              <Link
                className="text-[#155dfc] font-semibold ml-2 text-center"
                href={'/'}
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AnimatedGradientBackground>
  );
};

export default LoginForm;
