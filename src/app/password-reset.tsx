import { useState } from 'react';
import AnimatedGradientBackground from '@/components/Animated-graded-background';
import { LuArrowRight, LuArrowLeft } from 'react-icons/lu';
import { logger } from '@/lib/logger';

type FormData = {
  email: string;
};

export default function PasswordReset() {
  const [formData, setFormData] = useState<FormData>({ email: '' });
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Simulate form submission
    logger.log('Form submitted:', formData);
    setSubmitted(true);
  };

  return (
    <>
      <div className="relative w-full h-screen">
        <AnimatedGradientBackground />
        <div className="absolute inset-0 flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm text-left flex justify-left gap-2">
            <LuArrowLeft />
            <div>
              <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                Reset password
              </h2>
              <p className="text-sm/6 text-gray-500">
                Enter your email to receive a password reset link
              </p>
            </div>
          </div>

          {submitted ? (
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm text-center">
              <p className="text-green-600">
                A password reset link has been sent to your email.
              </p>
            </div>
          ) : (
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Send reset link <LuArrowRight />
                  </button>
                </div>
              </form>

              <p className="mt-10 text-center text-sm/6 text-gray-500">
                Remember your password?{' '}
                <a
                  href="#"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Sign in
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
