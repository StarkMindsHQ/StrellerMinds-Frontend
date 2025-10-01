import { NextRequest } from 'next/server';
import {
  authRegisterRequestSchema,
  authRegisterResponseSchema,
} from '@/lib/validations';
import {
  validateRequestBody,
  createApiSuccess,
  createApiError,
  handleApiError,
} from '@/lib/api-validation';

export async function POST(request: NextRequest) {
  try {
    // Validate request body
    const bodyValidation = await validateRequestBody(
      request,
      authRegisterRequestSchema,
    );
    if (!bodyValidation.success) {
      return bodyValidation.response;
    }

    const { name, email, phone, password } = bodyValidation.data;

    // TODO: Implement actual registration logic
    // This is a mock implementation
    const mockUser = {
      id: '2',
      email: email,
      name: name,
    };

    const responseData = {
      user: mockUser,
      verificationRequired: true,
    };

    return createApiSuccess(
      'Registration successful. Please verify your email.',
      responseData,
    );
  } catch (error) {
    return handleApiError(error, 'POST /api/auth/register');
  }
}
