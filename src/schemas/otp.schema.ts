<<<<<<< HEAD
import { z } from "zod";

export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});
=======
import { z } from 'zod';

export const otpSchema = z.object({
  code: z.string().min(4).max(8),
});

export type OtpSchema = z.infer<typeof otpSchema>;
>>>>>>> 795846c (fix CI/CD issues)
