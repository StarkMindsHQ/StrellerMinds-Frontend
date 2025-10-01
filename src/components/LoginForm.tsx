'use client';

import { useState } from 'react';
import AnimatedGradientBackground from './Animated-graded-background';
import Link from 'next/link';
import { LuGithub } from 'react-icons/lu';
import { FaRegStar } from 'react-icons/fa';
import { Input } from './ui/inputt';
import { toast } from 'sonner';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [loading, setLoading] = useState(false);
  const [announcementMessage, setAnnouncementMessage] = useState('');
  const [submissionError, setSubmissionError] = useState('');

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required.';
    } else {
      const passwordError = validatePassword(formData.password);
      if (passwordError) {
        newErrors.password = passwordError;
      }
    }

    setErrors(newErrors);
    return { isValid: Object.keys(newErrors).length === 0, errors: newErrors };
  };

  const handleChange = (value: string, name: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'rememberMe' ? value === 'true' : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateForm();

    if (!validation.isValid) {
      const errorCount = Object.keys(validation.errors).length;
      setAnnouncementMessage(
        `Your submission failed. Please correct the ${errorCount} error${errorCount === 1 ? '' : 's'} highlighted below.`,
      );
      return;
    }

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
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Authentication failure
          const errorMessage = 'Incorrect email or password. Please try again.';
          setSubmissionError(errorMessage);
          setAnnouncementMessage(errorMessage);
        } else {
          // Other server errors
          const errorMessage = 'An error occurred. Please try again later.';
          setSubmissionError(errorMessage);
          setAnnouncementMessage(errorMessage);
        }
        setLoading(false);
        return;
      }

      // Success
      const data = await response.json();
      setLoading(false);
      toast.success('Login successful!');

      // Handle successful login (e.g., redirect, store token, etc.)
      // Example: localStorage.setItem('token', data.token);
      // Example: router.push('/dashboard');
    } catch (error) {
      // Network or other connection errors
      const errorMessage =
        'Connection error. Please check your internet and try again.';
      setSubmissionError(errorMessage);
      setAnnouncementMessage(errorMessage);
      setLoading(false);
    }
  };

  const validatePassword = (value: any) => {
    if (value.length < 8) return 'Password must be at least 8 characters long';
    if (!/[A-Z]/.test(value))
      return 'Password must contain at least one uppercase letter';
    if (!/[a-z]/.test(value))
      return 'Password must contain at least one lowercase letter';
    if (!/[0-9]/.test(value))
      return 'Password must contain at least one number';
    if (!/[^A-Za-z0-9]/.test(value))
      return 'Password must contain at least one special character';
    return null;
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
            Enter your credencials to acces your account
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                defaultValue={formData.email}
                onChange={(e) => handleChange(e.target.value, 'email')}
                aria-invalid={!!errors.email}
                aria-describedby="email-error"
              />
              {errors.email && (
                <p id="email-error" className="text-red-600 text-sm mt-1">
                  {errors.email}
                </p>
              )}
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
                placeholder="password"
                type="password"
                defaultValue={formData.password}
                onChange={(e) => handleChange(e.target.value, 'password')}
                aria-invalid={!!errors.password}
                aria-describedby="password-error"
              />
              {errors.password && (
                <p id="password-error" className="text-red-600 text-sm mt-1">
                  {errors.password}
                </p>
              )}
            </div>
            {submissionError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-800 text-sm">{submissionError}</p>
              </div>
            )}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                className="mr-2 p-1"
                checked={formData.rememberMe}
                onChange={(e) =>
                  handleChange(e.target.checked.toString(), 'rememberMe')
                }
              />
              <label htmlFor="rememberMe">Remember Me</label>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
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
                <span>Github</span>
              </button>
              <button
                onClick={signInWithStella}
                className="shadow-xl border-1 border-#777 rounded-[9px] text-[#777] flex gap-2 py-[10.5px] px-[37.6px] my-[30px]"
              >
                <FaRegStar className="mt-[3px]" color="#155dfc" />
                <span>Stella</span>
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
