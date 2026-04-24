'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCcw, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PaymentRetryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRetry: () => void;
  errorMessage?: string;
  transactionContext?: {
    courseTitle: string;
    amount: number;
    method: string;
  };
}

export const PaymentRetryModal: React.FC<PaymentRetryModalProps> = ({
  isOpen,
  onClose,
  onRetry,
  errorMessage = 'Your payment could not be processed at this time. Please check your card details or try a different payment method.',
  transactionContext,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none shadow-2xl rounded-2xl bg-white">
        <div className="bg-red-50 p-8 flex flex-col items-center justify-center relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-red-100 rounded-full opacity-50" />
          <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 bg-red-100 rounded-full opacity-50" />
          
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 12 }}
            className="relative z-10"
          >
            <div className="bg-red-500 p-4 rounded-full shadow-lg">
              <XCircle className="w-12 h-12 text-white" />
            </div>
          </motion.div>
          
          <DialogTitle className="mt-6 text-2xl font-bold text-red-900 text-center relative z-10">
            Payment Failed
          </DialogTitle>
        </div>

        <div className="p-8">
          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl mb-6 border border-gray-100">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-700 leading-relaxed">
              {errorMessage}
            </p>
          </div>

          {transactionContext && (
            <div className="space-y-3 mb-8 p-4 border border-gray-100 rounded-xl bg-white shadow-sm">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Transaction Details
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Course</span>
                <span className="text-sm font-bold text-gray-900 truncate max-w-[200px]">
                  {transactionContext.courseTitle}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Amount</span>
                <span className="text-sm font-bold text-gray-900">
                  ${transactionContext.amount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Method</span>
                <span className="text-sm font-bold text-gray-900 capitalize">
                  {transactionContext.method}
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="py-6 border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-semibold"
            >
              Cancel
            </Button>
            <Button
              onClick={onRetry}
              className="py-6 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-200"
            >
              <RefreshCcw className="w-4 h-4" />
              Try Again
            </Button>
          </div>
        </div>
        
        <div className="px-8 pb-6 text-center">
          <p className="text-xs text-gray-400">
            Secure encryption protected. Your data is safe with us.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
