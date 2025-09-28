import { NextRequest } from "next/server"
import { authLoginRequestSchema, authLoginResponseSchema } from "@/lib/validations"
import { validateRequestBody, createApiSuccess, createApiError, handleApiError } from "@/lib/api-validation"

export async function POST(request: NextRequest) {
  try {
    // Validate request body
    const bodyValidation = await validateRequestBody(request, authLoginRequestSchema)
    if (!bodyValidation.success) {
      return bodyValidation.response
    }

    const { email, password } = bodyValidation.data

    // TODO: Implement actual authentication logic
    // This is a mock implementation
    if (email === "test@example.com" && password === "Test123!") {
      const mockUser = {
        id: "1",
        email: email,
        name: "Test User",
      }

      const mockToken = "mock-jwt-token-12345"

      const responseData = {
        user: mockUser,
        token: mockToken,
      }

      return createApiSuccess("Login successful", responseData)
    } else {
      return createApiError("Invalid email or password", 401)
    }
  } catch (error) {
    return handleApiError(error, "POST /api/auth/login")
  }
}
