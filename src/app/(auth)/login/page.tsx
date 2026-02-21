"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { getRedirectPath } from "@/utils/authRedirect";

// 1. Validation Schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 2. Redirect if session already exists
 useEffect(() => {
  // Only attempt redirect if we are sure we are authenticated 
  // and the session object has actually loaded.
  if (status === "authenticated" && session?.user) {
    try {
      const path = getRedirectPath(session.user);
      router.replace(path);
    } catch (err) {
      console.error("Redirect failed:", err);
    }
  }
}, [status, session, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ 
    resolver: zodResolver(loginSchema) 
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setError(null);

    // 3. Next-Auth Sign In
    // This communicates with your [...nextauth] route which links to NestJS
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false, // Prevent page reload to handle errors manually
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      // The useEffect above will catch the session change and redirect
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Login</h1>
          <p className="text-gray-500 text-sm">Welcome back to NovaFund</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded text-sm text-center">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <input
              {...register("email")}
              type="email"
              placeholder="Email"
              className={`w-full p-3 border rounded-lg outline-none transition-all ${
                errors.email ? "border-red-500" : "border-gray-300 focus:border-blue-500"
              }`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <input
              {...register("password")}
              type="password"
              placeholder="Password"
              className={`w-full p-3 border rounded-lg outline-none transition-all ${
                errors.password ? "border-red-500" : "border-gray-300 focus:border-blue-500"
              }`}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Authenticating..." : "Login"}
        </button>
      </form>
    </div>
  );
}
