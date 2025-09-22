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

  const validateForm = () => {
    let newErrors: { email?: string; password?: string } = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (value: string, name: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'rememberMe' ? value === 'true' : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    // This is where you would typically handle form submission.
    // Set timeout is used here to simulate a network request.
    setTimeout(() => {
      setLoading(false);
      toast.success('Login successful!');
    }, 1500);
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
            <div>
              <label className="block text-sm font-semibold">Email</label>
              <Input
                className="w-full px-3 py-2 border rounded-lg outline-none"
                id="email"
                placeholder="you@example.com"
                type="email"
                defaultValue={formData.email}
                onChange={(e) => handleChange(e.target.value, 'email')}
              />
            </div>
            <div>
              <div className="flex justify-between">
                <label className="block text-sm font-semibold">Password</label>
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
              />
            </div>
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
