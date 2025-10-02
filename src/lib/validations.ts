import { z } from 'zod';

// Common validation patterns
export const emailSchema = z
  .string()
  .trim()
  .min(1, { message: 'Email is required' })
  .max(254, { message: 'Email must be no more than 254 characters' })
  .email({ message: 'Please enter a valid email address' })
  .refine(
    (email) => {
      // Check for valid domain
      const domain = email.split('@')[1];
      return (
        domain &&
        domain.includes('.') &&
        !domain.startsWith('.') &&
        !domain.endsWith('.')
      );
    },
    { message: 'Please enter a valid email domain' },
  )
  .toLowerCase();

const passwordSchema = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters long' })
  .regex(/[A-Z]/, {
    message: 'Password must contain at least one uppercase letter',
  })
  .regex(/[a-z]/, {
    message: 'Password must contain at least one lowercase letter',
  })
  .regex(/[0-9]/, { message: 'Password must contain at least one number' })
  .regex(/[^A-Za-z0-9]/, {
    message: 'Password must contain at least one special character',
  });

const phoneSchema = z
  .string()
  .min(1, { message: 'Phone number is required' })
  .refine(
    (phone) => {
      // Check if it's exactly 10 digits (without +234 prefix)
      const digits = phone.replace(/\D/g, '');
      return digits.length === 10;
    },
    { message: 'Phone number must be exactly 10 digits' },
  )
  .refine(
    (phone) => {
      // Check if the number starts with 7, 8, or 9
      const digits = phone.replace(/\D/g, '');
      return /^[789]\d{9}$/.test(digits);
    },
    { message: 'Nigerian phone number must start with 7, 8, or 9' },
  );

const nameSchema = z
  .string()
  .min(2, { message: 'Name must be at least 2 characters' })
  .max(50, { message: 'Name must be no more than 50 characters' })
  .regex(/^[a-zA-Z\s'-]+$/, {
    message: 'Name can only contain letters, spaces, hyphens, and apostrophes',
  })
  .refine((name) => name.trim().length >= 2, {
    message: 'Name cannot be just spaces',
  })
  .trim();

// Login form validation
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: 'Password is required' }),
  rememberMe: z.boolean().catch(false),
});

// Register form validation
export const registerSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    phone: phoneSchema,
    password: passwordSchema,
    confirmPassword: z
      .string()
      .min(1, { message: 'Please confirm your password' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Signup form validation (multi-step)
export const signupStep1Schema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  agreedToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms of service and privacy policy',
  }),
});

export const signupStep2Schema = z.object({
  verificationCode: z
    .string()
    .trim()
    .length(6, { message: 'Verification code must be exactly 6 digits' })
    .regex(/^\d{6}$/, {
      message: 'Verification code must contain only numbers',
    })
    .transform((code) => code.trim()),
});

// Settings form validations
export const profileUpdateSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  title: z
    .string()
    .min(2, { message: 'Title must be at least 2 characters' })
    .max(100, { message: 'Title must be no more than 100 characters' })
    .trim(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: 'Current password is required' }),
    newPassword: passwordSchema,
    confirmPassword: z
      .string()
      .min(1, { message: 'Please confirm your new password' }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// API request/response schemas
export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
});

export const apiErrorSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  message: z.string(),
  statusCode: z.number(),
  timestamp: z.string(),
  details: z.record(z.string(), z.unknown()).optional(),
});

export const apiSuccessSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: z.record(z.string(), z.unknown()).optional(),
});

// Course API schemas
export const courseQuerySchema = z.object({
  tab: z.enum(['popular', 'new', 'trending']).default('popular'),
  limit: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return 0;
      const parsed = parseInt(val, 10);
      if (isNaN(parsed)) throw new Error('Invalid number format');
      return parsed;
    })
    .refine((val) => val >= 0 && val <= 1000, {
      message: 'Limit must be between 0 and 1000',
    }),
});

// Auth API schemas
export const authLoginRequestSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const authLoginResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: z.object({
    user: userSchema,
    token: z.string().min(1),
  }),
});

// API phone schema expects full number with +234
const apiPhoneSchema = z
  .string()
  .min(1, { message: 'Phone number is required' })
  .regex(/^\+234/, { message: 'Phone number must start with +234' })
  .refine(
    (phone) => {
      // Check if it's exactly 13 digits total (+234 + 10 digits)
      const digits = phone.replace(/\D/g, '');
      return digits.length === 13;
    },
    { message: 'Phone number must be +234 followed by 10 digits' },
  )
  .refine(
    (phone) => {
      // Check if the number after +234 is valid (starts with 7, 8, or 9)
      const digits = phone.replace(/\D/g, '');
      const numberAfter234 = digits.substring(3);
      return /^[789]\d{9}$/.test(numberAfter234);
    },
    { message: 'Nigerian phone number must start with 7, 8, or 9 after +234' },
  );

export const authRegisterRequestSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: apiPhoneSchema,
  password: passwordSchema,
});

export const authRegisterResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: z.object({
    user: userSchema,
    verificationRequired: z.boolean(),
  }),
});

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type SignupStep1FormData = z.infer<typeof signupStep1Schema>;
export type SignupStep2FormData = z.infer<typeof signupStep2Schema>;
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type ApiError = z.infer<typeof apiErrorSchema>;
export type ApiSuccess = z.infer<typeof apiSuccessSchema>;
export type CourseQuery = z.infer<typeof courseQuerySchema>;
export type AuthLoginRequest = z.infer<typeof authLoginRequestSchema>;
export type AuthLoginResponse = z.infer<typeof authLoginResponseSchema>;
export type AuthRegisterRequest = z.infer<typeof authRegisterRequestSchema>;
export type AuthRegisterResponse = z.infer<typeof authRegisterResponseSchema>;
