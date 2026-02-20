'use client';

import type React from 'react';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Github,
  Loader2,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { FormError } from '@/components/ui/form-error';
import AnimatedGradientBackground from '@/components/Animated-graded-background';
import {
  signupStep1Schema,
  signupStep2Schema,
  type SignupStep1FormData,
  type SignupStep2FormData,
} from '@/lib/validations';
import { Input } from '@/components/ui/input';

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [userEmail, setUserEmail] = useState('');

  // Step 1 form
  const step1Form = useForm<SignupStep1FormData>({
    resolver: zodResolver(signupStep1Schema),
    mode: 'all',
  });

  // Step 2 form
  const step2Form = useForm<SignupStep2FormData>({
    resolver: zodResolver(signupStep2Schema),
    mode: 'all',
  });

  const { watch: watchStep1 } = step1Form;
  const password = watchStep1('password');

  // Password strength calculation
  const calculatePasswordStrength = (password: string): number => {
    if (!password) return 0;

    let strength = 0;

    // Length check
    if (password.length >= 8) strength += 25;

    // Character variety checks
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;

    return strength;
  };

  const passwordStrength = calculatePasswordStrength(password);

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 25) return 'Weak';
    if (passwordStrength <= 50) return 'Fair';
    if (passwordStrength <= 75) return 'Good';
    return 'Strong';
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 25) return 'bg-red-500';
    if (passwordStrength <= 50) return 'bg-yellow-500';
    if (passwordStrength <= 75) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const onStep1Submit = async (data: SignupStep1FormData) => {
    setIsLoading(true);
    setUserEmail(data.email);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoading(false);
    setStep(2);
  };

  const onStep2Submit = async (data: SignupStep2FormData) => {
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoading(false);
    // In a real app, you would handle verification and registration here
    window.location.href = '/dashboard';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10,
      },
    },
  } as any;

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    }),
  } as any;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="absolute inset-0 z-0">
        <AnimatedGradientBackground />
      </div>
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="w-full max-w-md"
        >
          <motion.div variants={itemVariants}>
            <Card className="border-none shadow-lg">
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-between">
                  {step === 2 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-0 h-8 w-8"
                      onClick={() => setStep(1)}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span className="sr-only">Back</span>
                    </Button>
                  )}
                  <div className={step === 2 ? 'ml-8' : ''}>
                    <CardTitle className="text-2xl font-bold">
                      {step === 1 ? 'Create an account' : 'Verify your email'}
                    </CardTitle>
                    <CardDescription>
                      {step === 1
                        ? 'Enter your information to create an account'
                        : "We've sent a code to your email"}
                    </CardDescription>
                  </div>
                  <div className="w-8"></div> {/* Spacer for alignment */}
                </div>

                <div className="pt-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <span>Account details</span>
                    <span>Verification</span>
                  </div>
                  <div className="relative h-1 w-full bg-muted overflow-hidden rounded-full">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-primary"
                      initial={{ width: '50%' }}
                      animate={{ width: step === 1 ? '50%' : '100%' }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <motion.div
                  key={step}
                  custom={step === 1 ? -1 : 1}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  {step === 1 ? (
                    <form
                      onSubmit={step1Form.handleSubmit(onStep1Submit)}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First name</Label>
                          <Input
                            id="firstName"
                            placeholder="John"
                            {...step1Form.register('firstName')}
                            className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                          />
                          <FormError
                            message={
                              step1Form.formState.errors.firstName?.message
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last name</Label>
                          <Input
                            id="lastName"
                            placeholder="Doe"
                            {...step1Form.register('lastName')}
                            className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                          />
                          <FormError
                            message={
                              step1Form.formState.errors.lastName?.message
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          {...step1Form.register('email')}
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                        />
                        <FormError
                          message={step1Form.formState.errors.email?.message}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            {...step1Form.register('password')}
                            className="pr-10 transition-all duration-200 focus:ring-2 focus:ring-primary"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                            <span className="sr-only">
                              {showPassword ? 'Hide password' : 'Show password'}
                            </span>
                          </Button>
                        </div>
                        <FormError
                          message={step1Form.formState.errors.password?.message}
                        />

                        {password && (
                          <div className="mt-2 space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-xs">
                                {getPasswordStrengthText()} password
                              </span>
                              <span className="text-xs">
                                {passwordStrength}%
                              </span>
                            </div>
                            <Progress
                              value={passwordStrength}
                              className={`h-1 ${getPasswordStrengthColor()}`}
                            />

                            <ul className="space-y-1 mt-2">
                              <li className="text-xs flex items-center gap-1.5">
                                <span
                                  className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${password.length >= 8 ? 'bg-green-500' : 'bg-muted'}`}
                                >
                                  {password.length >= 8 && (
                                    <Check className="h-2.5 w-2.5 text-white" />
                                  )}
                                </span>
                                At least 8 characters
                              </li>
                              <li className="text-xs flex items-center gap-1.5">
                                <span
                                  className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${/[A-Z]/.test(password) ? 'bg-green-500' : 'bg-muted'}`}
                                >
                                  {/[A-Z]/.test(password) && (
                                    <Check className="h-2.5 w-2.5 text-white" />
                                  )}
                                </span>
                                At least 1 uppercase letter
                              </li>
                              <li className="text-xs flex items-center gap-1.5">
                                <span
                                  className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${/[0-9]/.test(password) ? 'bg-green-500' : 'bg-muted'}`}
                                >
                                  {/[0-9]/.test(password) && (
                                    <Check className="h-2.5 w-2.5 text-white" />
                                  )}
                                </span>
                                At least 1 number
                              </li>
                              <li className="text-xs flex items-center gap-1.5">
                                <span
                                  className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${/[^A-Za-z0-9]/.test(password) ? 'bg-green-500' : 'bg-muted'}`}
                                >
                                  {/[^A-Za-z0-9]/.test(password) && (
                                    <Check className="h-2.5 w-2.5 text-white" />
                                  )}
                                </span>
                                At least 1 special character
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>

                      <div className="flex items-start space-x-2 pt-2">
                        <Checkbox
                          id="terms"
                          {...step1Form.register('agreedToTerms')}
                          className="mt-1"
                        />
                        <Label
                          htmlFor="terms"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          I agree to the{' '}
                          <Link
                            href="/terms"
                            className="text-primary underline hover:text-primary/90"
                            target="_blank"
                          >
                            terms of service
                          </Link>{' '}
                          and{' '}
                          <Link
                            href="/privacy"
                            className="text-primary underline hover:text-primary/90"
                            target="_blank"
                          >
                            privacy policy
                          </Link>
                        </Label>
                      </div>
                      <FormError
                        message={
                          step1Form.formState.errors.agreedToTerms?.message
                        }
                      />

                      <Button
                        type="submit"
                        className="w-full group relative overflow-hidden"
                        disabled={isLoading || step1Form.formState.isSubmitting}
                      >
                        <span className="flex items-center justify-center gap-2 relative z-10">
                          {isLoading ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Creating account...
                            </>
                          ) : (
                            <>
                              Continue
                              <motion.span
                                animate={{ x: [0, 5, 0] }}
                                transition={{
                                  repeat: Number.POSITIVE_INFINITY,
                                  repeatType: 'reverse',
                                  duration: 1,
                                  repeatDelay: 1,
                                }}
                              >
                                <ArrowRight className="h-4 w-4" />
                              </motion.span>
                            </>
                          )}
                        </span>
                        <motion.div
                          className="absolute inset-0 bg-primary"
                          initial={{ x: '-100%' }}
                          whileHover={{ x: 0 }}
                          transition={{ duration: 0.3 }}
                        />
                      </Button>

                      <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                          <Separator className="w-full" />
                        </div>
                        <div className="relative flex justify-center">
                          <span className="bg-card px-2 text-xs text-muted-foreground">
                            OR CONTINUE WITH
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" className="w-full">
                          <Github className="mr-2 h-4 w-4" />
                          Github
                        </Button>
                        <Button variant="outline" className="w-full">
                          <Star className="mr-2 h-4 w-4 text-primary" />
                          Stellar
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <form
                      onSubmit={step2Form.handleSubmit(onStep2Submit)}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <div className="text-center mb-4">
                          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{
                                type: 'spring',
                                stiffness: 200,
                                damping: 15,
                                delay: 0.2,
                              }}
                            >
                              <Check className="h-8 w-8 text-primary" />
                            </motion.div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            We've sent a verification code to{' '}
                            <span className="font-medium text-foreground">
                              {userEmail}
                            </span>
                          </p>
                        </div>

                        <Label htmlFor="code">Verification code</Label>
                        <Input
                          id="code"
                          placeholder="Enter 6-digit code"
                          {...step2Form.register('verificationCode')}
                          className="text-center text-lg tracking-widest transition-all duration-200 focus:ring-2 focus:ring-primary"
                          maxLength={6}
                        />
                        <FormError
                          message={
                            step2Form.formState.errors.verificationCode?.message
                          }
                        />
                        <p className="text-xs text-muted-foreground text-center mt-2">
                          Didn't receive a code?{' '}
                          <button
                            type="button"
                            className="text-primary hover:underline"
                          >
                            Resend
                          </button>
                        </p>
                      </div>

                      <Button
                        type="submit"
                        className="w-full group relative overflow-hidden"
                        disabled={isLoading || step2Form.formState.isSubmitting}
                      >
                        <span className="flex items-center justify-center gap-2 relative z-10">
                          {isLoading ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Verifying...
                            </>
                          ) : (
                            <>
                              Complete Sign Up
                              <motion.span
                                animate={{ x: [0, 5, 0] }}
                                transition={{
                                  repeat: Number.POSITIVE_INFINITY,
                                  repeatType: 'reverse',
                                  duration: 1,
                                  repeatDelay: 1,
                                }}
                              >
                                <ArrowRight className="h-4 w-4" />
                              </motion.span>
                            </>
                          )}
                        </span>
                        <motion.div
                          className="absolute inset-0 bg-primary"
                          initial={{ x: '-100%' }}
                          whileHover={{ x: 0 }}
                          transition={{ duration: 0.3 }}
                        />
                      </Button>
                    </form>
                  )}
                </motion.div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
                <div className="text-center text-sm">
                  Already have an account?{' '}
                  <Link
                    href="/auth/signin"
                    className="text-primary font-medium hover:underline"
                  >
                    Sign in
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
