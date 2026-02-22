<<<<<<< HEAD
import { User } from "@/types/auth";

/**
 * Simulate API delay
 */
const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Login user
 */
export const loginUser = async (
  email: string,
  password: string
): Promise<User> => {
  await delay(1000);

  // TODO: Replace with real API call
  return {
    id: crypto.randomUUID(),
    fullName: "Test User",
    email,
    role: null,
  };
};

/**
 * Register user
 */
export const registerUser = async (
  fullName: string,
  email: string,
  password: string
): Promise<User> => {
  await delay(1200);

  // TODO: Replace with real API call
  return {
    id: crypto.randomUUID(),
    fullName,
    email,
    role: null,
  };
};

export const verifyOtp = async (otp: string) => {
  await new Promise((res) => setTimeout(res, 1200));

  if (otp !== "123456") {
    throw new Error("Invalid OTP");
  }

  return true;
};

export const resendOtp = async () => {
  await new Promise((res) => setTimeout(res, 1000));
  return true;
=======
import { signIn, signOut } from 'next-auth/react';

export const authService = {
  loginWithProvider(provider: 'google' | 'github') {
    return signIn(provider);
  },

  logout() {
    return signOut({ callbackUrl: '/' });
  },
>>>>>>> 795846c (fix CI/CD issues)
};

export async function verifyOtp(code: string) {
  // Placeholder implementation for type-checking and tests
  return Promise.resolve(code === '1234');
}
