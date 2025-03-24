'use client';

import React, { useState } from 'react';
import AnimatedGradientBackground from './Animated-graded-background';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

export default function EmailVerificationPage() {
  const [email] = useState('algodicino@gmail.com');
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResendCode = () => {
    // This would connect to your backend resend functionality
    alert('Verification code resent!');
  };

  const handleCompleteSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      if (code.length === 6) {
        window.location.href = '/dashboard'; // Redirect on success
      } else {
        alert('Please enter a valid 6-digit code');
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AnimatedGradientBackground />
      
     

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4 py-5">
        <div className="bg-white w-full max-w-xl rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
           <div className='flex items-center gap-20'>
           <button className="mb-6 text-gray-500 hover:text-gray-700 flex items-center">
              <ArrowLeft size={16} className="mr-1" />
              <span className="text-sm">Back</span>
            </button>
            
            <div className='text-center'>
            <h1 className="text-3xl font-bold text-center mb-1">Verify your email</h1>
            <p className="text-gray-500 text-center mb-6">We&apos;ve sent a code to your email</p>
           
            
            </div>
            </div> 
            
            <div className="flex justify-between mb-3">
              <span className="text-sm text-gray-600">Account details</span>
              <span className="text-sm font-medium text-gray-600">Verification</span>
            </div>
            <div className="flex mb-8">
              <div className="w-full h-1 bg-blue-600 rounded-l"></div>
             
            </div>
            
           
            
            {/* Verification status */}
            <div className="flex justify-center my-6">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                <Check className="w-9 h-9 text-blue-600" />
              </div>
            </div>
            
            <p className="text-center text-sm mb-6">
              We have sent a verification code to <span className="font-medium">{email}</span>
            </p>
            
            <form onSubmit={handleCompleteSignup}>
              <div className="mb-4">
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                  Verification code
                </label>
                <input
                  type="text"
                  id="code"
                  placeholder="Enter 6-digit code"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                  maxLength={6}
                />
              </div>
              
              <div className="text-center mb-6">
                <p className="text-sm text-gray-600">
                  Didnt receive a code? <button 
                    type="button" 
                    className="text-blue-600 font-medium hover:underline"
                    onClick={handleResendCode}
                  >
                    Resend
                  </button>
                </p>
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-md flex items-center justify-center transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : (
                  <>
                    Complete Sign Up
                    <ArrowRight size={16} className="ml-2" />
                  </>
                )}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account? <a href="#" className="text-blue-600 font-medium hover:underline">Sign in</a>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}