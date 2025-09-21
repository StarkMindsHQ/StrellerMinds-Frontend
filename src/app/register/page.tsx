"use client"

import React from "react"
import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, Phone, Mail } from "lucide-react"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/inputt"
import { FormField } from "@/components/form-field"
import { PhoneInput } from "@/components/phone-input"
import { Logo } from "@/components/logo"
import { logger } from "@/lib/logger"

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
})

type FormData = z.infer<typeof formSchema>

export default function Register() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    password: "",
  })

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [showPassword, setShowPassword] = useState(false)

  const validateField = (name: keyof FormData, value: string) => {
    try {
      formSchema.shape[name].parse(value)
      setErrors((prev) => ({ ...prev, [name]: undefined }))
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = error.errors[0]?.message || `Invalid ${name}`
        setErrors((prev) => ({ ...prev, [name]: message }))
      }
      return false
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    validateField(name as keyof FormData, value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all fields
    let isValid = true
    Object.entries(formData).forEach(([key, value]) => {
      const fieldValid = validateField(key as keyof FormData, value)
      if (!fieldValid) isValid = false
    })

    if (isValid) {
      // Submit form data
      logger.log("Form submitted:", formData)
    }
  }

  return (
    <div className="flex flex-col justify-center items-center py-10 px-4">
      <div className="w-full max-w-md mx-auto">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-6">
            <Logo />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#5D4037] mb-2">Create an Account</h1>
          <p className="text-gray-600 mb-6">Register for StrellerMinds, a pioneering blockchain education platform on Stellar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Name" name="name" error={errors.name}>
            <Input
              id="name"
              name="name"
              placeholder="Enter"
              value={formData.name}
              onChange={handleChange}
              onBlur={(e) => validateField("name", e.target.value)}
              error={!!errors.name}
            />
          </FormField>

          <FormField label="Email" name="email" error={errors.email}>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter"
              value={formData.email}
              onChange={handleChange}
              onBlur={(e) => validateField("email", e.target.value)}
              error={!!errors.email}
            />
          </FormField>

          <FormField label="Phone" name="phone" error={errors.phone}>
            <PhoneInput
              value={formData.phone}
              onChange={(value) => {
                setFormData((prev) => ({ ...prev, phone: value }))
                validateField("phone", value)
              }}
              error={!!errors.phone}
            />
          </FormField>

          <FormField label="Password" name="password" error={errors.password}>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter"
                value={formData.password}
                onChange={handleChange}
                onBlur={(e) => validateField("password", e.target.value)}
                error={!!errors.password}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </FormField>

          <div className="text-sm">
            <p>
              By registering, you agree to StrellerMinds{" "}
              <Link href="/terms" className="text-red-600 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-red-600 hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>

          <Button type="submit" className="w-full py-3 bg-red-600 hover:bg-red-700">
            Register
          </Button>

          <div className="text-center mt-4">
            <p>
              Have an account?{" "}
              <Link href="/login" className="text-red-600 hover:underline">
                Sign In
              </Link>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center sm:space-x-8 space-y-2 sm:space-y-0 mt-6 text-gray-600 text-sm">
            <div className="flex items-center justify-center">
              <Phone className="h-4 w-4 mr-2" />
              <span>+2348623766884</span>
            </div>
            <div className="flex items-center justify-center">
              <Mail className="h-4 w-4 mr-2" />
              <span>info@strellerminds.com</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
