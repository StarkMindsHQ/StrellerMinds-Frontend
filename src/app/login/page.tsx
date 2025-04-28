"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo.png"
import loginImage from "@/assets/login-image.png";
import loginBg from "@/assets/login-bg.png";

type FormValues = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (data: FormValues) => {
    console.log("Form Data:", data);
    reset();
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative">
      {/* Left Side */}
      <div className="relative w-full md:w-1/2 h-screen overflow-hidden z-10">
        {/* Background Layer */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${loginBg.src})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'right center',
          }}
        />

        {/* Content Layer */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full py-8 px-6">
          {/* Logo */}
          <div className="w-full flex justify-start mb-8">
            <Link href="/">
              <Image src={logo} alt="logo" width={50} />
            </Link>
          </div>

          {/* Welcome Text */}
          <h1 className="text-3xl font-semibold mb-2 text-[#5C2C06] font-serif">
            Welcome Back
          </h1>
          <p className="text-gray-600 mb-8">
            Sign in to continue studying on Sewee Africa
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm">
            {/* Email */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
                type="email"
                placeholder="Enter"
                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                  errors.email ? "border-red-500 ring-red-400" : "focus:ring-red-400"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="mb-2">
              <label className="block text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter"
                  className={`w-full border rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 ${
                    errors.password ? "border-red-500 ring-red-400" : "focus:ring-red-400"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-600 text-sm"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Forgot password */}
            <div className="flex justify-end mb-6 text-sm">
              <Link href="#" className="text-gray-600 hover:underline">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 rounded-full hover:bg-red-700 transition"
            >
              Sign In
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-sm text-gray-700">
            Don’t have an account?{" "}
            <Link href="#" className="text-red-600 hover:underline">
              Register
            </Link>
          </div>

          {/* Contact Info */}
          <div className="mt-4 flex gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span>📞</span> +234862376684
            </div>
            <div className="flex items-center gap-2">
              <span>✉️</span> Info@seweeafrica.com
            </div>
          </div>
        </div>
      </div>

      {/* Wavy SVG separator */}
   {/* <div className="absolute top-0 right-1/2 translate-x-1/2 h-full hidden md:block z-20">
  <svg
    viewBox="0 0 500 500"
    preserveAspectRatio="none"
    className="h-full w-32"
  >
    <path
      d="M0,0 C150,100 350,0 500,100 L500,500 L0,500 Z"
      fill="#ffffff"
    />
  </svg>
</div> */}



      {/* Right Side (Image) */}
      <div className="w-full md:w-1/2 relative hidden md:block z-10">
        <Image
          src={loginImage}
          alt="Login-Image"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}
