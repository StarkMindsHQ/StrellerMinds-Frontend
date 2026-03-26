'use client';

import React from 'react';
import * as z from 'zod';
import { CreditCard, ShieldCheck, User } from 'lucide-react';
import { MultiStepCourseEnrollment, StepConfig } from './MultiStepCourseEnrollment';

const enrollmentSteps: StepConfig[] = [
  {
    id: 'personal-info',
    title: 'Personal Information',
    description: 'Please provide your basic details',
    icon: <User className="h-5 w-5" />,
    schema: z.object({
      firstName: z.string().min(2, 'First name is required'),
      lastName: z.string().min(2, 'Last name is required'),
      email: z.string().email('Invalid email address'),
      phone: z.string().min(10, 'Phone number must be valid'),
    }),
    fields: [
      { name: 'firstName', label: 'First Name', type: 'text', placeholder: 'John' },
      { name: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Doe' },
      { name: 'email', label: 'Email Address', type: 'email', placeholder: 'john.doe@example.com' },
      { name: 'phone', label: 'Phone Number', type: 'text', placeholder: '+1 (555) 000-0000' },
    ],
  },
  {
    id: 'payment-method',
    title: 'Payment Details',
    description: 'Select how you want to pay',
    icon: <CreditCard className="h-5 w-5" />,
    schema: z.object({
      paymentMethod: z.enum(['credit-card', 'paypal', 'crypto'], {
        required_error: 'Please select a payment method',
      }),
    }),
    fields: [
      {
        name: 'paymentMethod',
        label: 'Payment Options',
        type: 'radio',
        options: [
          { label: 'Credit Card', value: 'credit-card', description: 'Visa, Mastercard, Amex' },
          { label: 'PayPal', value: 'paypal', description: 'Fast, safe checkout' },
          { label: 'Crypto (Web3)', value: 'crypto', description: 'Pay with ETH/USDC' },
        ],
      },
    ],
  },
  {
    id: 'confirmation',
    title: 'Review & Confirm',
    description: 'Review your details before enrolling',
    icon: <ShieldCheck className="h-5 w-5" />,
    // Optional additional summary schema
    schema: z.object({
        summary_flag: z.boolean().optional()
    }),
    fields: [
      {
        name: 'summary_flag',
        label: 'Summary View',
        type: 'summary',
      },
    ],
  },
];

export default function MultiStepEnrollmentExample() {
  const handleEnrollment = (data: any) => {
    console.log('Enrollment successful!', data);
    alert('Enrollment successful! Check console.');
  };

  return (
    <div className="min-h-screen bg-muted/20 flex items-center justify-center p-4">
      <MultiStepCourseEnrollment 
        steps={enrollmentSteps} 
        onSubmit={handleEnrollment} 
        onCancel={() => console.log('Cancelled')}
      />
    </div>
  );
}
