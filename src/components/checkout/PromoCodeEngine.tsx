'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Tag, 
  CheckCircle, 
  XCircle, 
  Percent, 
  Gift, 
  Calendar, 
  Clock, 
  AlertTriangle,
  Loader2,
  Sparkles,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Types
interface PromoCode {
  id: string;
  code: string;
  description: string;
  type: 'percentage' | 'fixed' | 'free_shipping';
  value: number;
  minAmount?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  expiresAt?: string;
  isActive: boolean;
  applicableProducts?: string[];
  userSpecific?: boolean;
  firstTimeUserOnly?: boolean;
}

interface PromoCodeResponse {
  success: boolean;
  promoCode?: PromoCode;
  error?: string;
  discountAmount?: number;
  finalPrice?: number;
}

interface PromoCodeEngineProps {
  totalAmount: number;
  onPromoApplied?: (promoCode: PromoCode, discountAmount: number, finalPrice: number) => void;
  onPromoRemoved?: () => void;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  showSuggestions?: boolean;
  userId?: string;
  productIds?: string[];
}

// Mock promo codes database
const mockPromoCodes: PromoCode[] = [
  {
    id: '1',
    code: 'WELCOME10',
    description: 'Welcome discount for new users',
    type: 'percentage',
    value: 10,
    minAmount: 50,
    maxDiscount: 25,
    usageLimit: 1000,
    usedCount: 234,
    expiresAt: '2024-12-31T23:59:59Z',
    isActive: true,
    firstTimeUserOnly: true
  },
  {
    id: '2',
    code: 'SAVE20',
    description: 'Save 20% on your order',
    type: 'percentage',
    value: 20,
    minAmount: 100,
    usageLimit: 500,
    usedCount: 156,
    expiresAt: '2024-11-30T23:59:59Z',
    isActive: true
  },
  {
    id: '3',
    code: 'FLAT15',
    description: '$15 off your purchase',
    type: 'fixed',
    value: 15,
    minAmount: 75,
    usageLimit: 300,
    usedCount: 89,
    expiresAt: '2024-12-15T23:59:59Z',
    isActive: true
  },
  {
    id: '4',
    code: 'FREESHIP',
    description: 'Free shipping on all orders',
    type: 'free_shipping',
    value: 0,
    minAmount: 25,
    usageLimit: 2000,
    usedCount: 567,
    isActive: true
  },
  {
    id: '5',
    code: 'EXPIRED',
    description: 'This code has expired',
    type: 'percentage',
    value: 15,
    minAmount: 50,
    usageLimit: 100,
    usedCount: 95,
    expiresAt: '2024-01-01T23:59:59Z',
    isActive: false
  }
];

// Mock API call
const validatePromoCode = async (
  code: string,
  totalAmount: number,
  userId?: string,
  productIds?: string[]
): Promise<PromoCodeResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const promoCode = mockPromoCodes.find(
    pc => pc.code.toLowerCase() === code.toLowerCase() && pc.isActive
  );

  if (!promoCode) {
    return {
      success: false,
      error: 'Invalid promo code'
    };
  }

  // Check expiration
  if (promoCode.expiresAt && new Date(promoCode.expiresAt) < new Date()) {
    return {
      success: false,
      error: 'Promo code has expired'
    };
  }

  // Check usage limit
  if (promoCode.usageLimit && promoCode.usedCount >= promoCode.usageLimit) {
    return {
      success: false,
      error: 'Promo code usage limit reached'
    };
  }

  // Check minimum amount
  if (promoCode.minAmount && totalAmount < promoCode.minAmount) {
    return {
      success: false,
      error: `Minimum order amount of $${promoCode.minAmount} required`
    };
  }

  // Check first-time user only
  if (promoCode.firstTimeUserOnly && userId) {
    // In real implementation, check if user has used promo before
    // For demo, we'll randomly allow it
    const isFirstTime = Math.random() > 0.5;
    if (!isFirstTime) {
      return {
        success: false,
        error: 'Promo code is for first-time users only'
      };
    }
  }

  // Calculate discount
  let discountAmount = 0;

  switch (promoCode.type) {
    case 'percentage':
      discountAmount = (totalAmount * promoCode.value) / 100;
      if (promoCode.maxDiscount && discountAmount > promoCode.maxDiscount) {
        discountAmount = promoCode.maxDiscount;
      }
      break;
    case 'fixed':
      discountAmount = promoCode.value;
      break;
    case 'free_shipping':
      // In real implementation, calculate shipping cost
      discountAmount = 10; // Assume $10 shipping
      break;
  }

  const finalPrice = Math.max(0, totalAmount - discountAmount);

  return {
    success: true,
    promoCode,
    discountAmount,
    finalPrice
  };
};

// Promo code status component
const PromoCodeStatus: React.FC<{
  status: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
  promoCode?: PromoCode;
  discountAmount?: number;
}> = ({ status, message, promoCode, discountAmount }) => {
  if (status === 'idle') return null;

  const statusConfig = {
    loading: {
      icon: <Loader2 className="h-4 w-4 animate-spin" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 border-blue-200'
    },
    success: {
      icon: <CheckCircle className="h-4 w-4" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50 border-green-200'
    },
    error: {
      icon: <XCircle className="h-4 w-4" />,
      color: 'text-red-600',
      bgColor: 'bg-red-50 border-red-200'
    }
  };

  const config = statusConfig[status as keyof typeof statusConfig];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex items-center gap-2 p-3 rounded-lg border text-sm',
        config.bgColor,
        config.color
      )}
    >
      {config.icon}
      <div className="flex-1">
        {status === 'success' && promoCode && (
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium">{promoCode.code}</span>
              <span className="ml-2">applied successfully!</span>
              {promoCode.description && (
                <p className="text-xs opacity-75 mt-1">{promoCode.description}</p>
              )}
            </div>
            {discountAmount && (
              <div className="text-right">
                <div className="font-bold">-${discountAmount.toFixed(2)}</div>
              </div>
            )}
          </div>
        )}
        {status === 'error' && (
          <span>{message}</span>
        )}
        {status === 'loading' && (
          <span>Validating promo code...</span>
        )}
      </div>
    </motion.div>
  );
};

// Promo suggestions component
const PromoSuggestions: React.FC<{
  onSelect: (code: string) => void;
  totalAmount: number;
}> = ({ onSelect, totalAmount }) => {
  const availableCodes = mockPromoCodes.filter(
    code => code.isActive && 
    (!code.minAmount || totalAmount >= code.minAmount) &&
    (!code.expiresAt || new Date(code.expiresAt) > new Date())
  );

  if (availableCodes.length === 0) return null;

  return (
    <div className="mt-3">
      <p className="text-xs text-muted-foreground mb-2">Available promo codes:</p>
      <div className="flex flex-wrap gap-2">
        {availableCodes.slice(0, 3).map((code) => (
          <Button
            key={code.id}
            variant="outline"
            size="sm"
            onClick={() => onSelect(code.code)}
            className="text-xs h-7 px-2"
          >
            <Tag className="h-3 w-3 mr-1" />
            {code.code}
            {code.type === 'percentage' && ` (${code.value}%)`}
            {code.type === 'fixed' && ` (-$${code.value})`}
          </Button>
        ))}
      </div>
    </div>
  );
};

// Main Promo Code Engine Component
export const PromoCodeEngine: React.FC<PromoCodeEngineProps> = ({
  totalAmount,
  onPromoApplied,
  onPromoRemoved,
  className,
  disabled = false,
  placeholder = 'Enter promo code',
  showSuggestions = true,
  userId,
  productIds
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await validatePromoCode(promoCode, totalAmount, userId, productIds);

      if (response.success && response.promoCode && response.discountAmount !== undefined) {
        setStatus('success');
        setAppliedPromo(response.promoCode);
        setDiscountAmount(response.discountAmount);
        onPromoApplied?.(response.promoCode, response.discountAmount, response.finalPrice || totalAmount);
      } else {
        setStatus('error');
        setErrorMessage(response.error || 'Failed to apply promo code');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  const handleRemovePromo = () => {
    setPromoCode('');
    setAppliedPromo(null);
    setStatus('idle');
    setErrorMessage('');
    setDiscountAmount(0);
    onPromoRemoved?.();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (appliedPromo) {
        handleRemovePromo();
      } else {
        handleApplyPromo();
      }
    }
  };

  const handleSuggestionSelect = (code: string) => {
    setPromoCode(code);
    // Auto-apply the selected code
    setTimeout(() => handleApplyPromo(), 100);
  };

  return (
    <Card className={cn('w-full', className)}>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-primary" />
            <span className="font-medium">Promo Code</span>
            {discountAmount > 0 && (
              <Badge variant="secondary" className="text-xs">
                Saved ${discountAmount.toFixed(2)}
              </Badge>
            )}
          </div>

          {/* Input Field */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={appliedPromo ? appliedPromo.code : placeholder}
                disabled={disabled || status === 'loading'}
                className={cn(
                  'pr-10',
                  appliedPromo && 'bg-green-50 border-green-200 text-green-800'
                )}
              />
              {appliedPromo && (
                <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-600" />
              )}
            </div>
            
            <AnimatePresence mode="wait">
              {!appliedPromo ? (
                <motion.div
                  key="apply"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <Button
                    onClick={handleApplyPromo}
                    disabled={disabled || status === 'loading' || !promoCode.trim()}
                    size="sm"
                    className="px-4"
                  >
                    {status === 'loading' ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Apply
                      </>
                    )}
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="remove"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <Button
                    onClick={handleRemovePromo}
                    disabled={disabled}
                    variant="outline"
                    size="sm"
                    className="px-4"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Status Message */}
          <PromoCodeStatus
            status={status}
            message={errorMessage}
            promoCode={appliedPromo || undefined}
            discountAmount={discountAmount}
          />

          {/* Applied Promo Details */}
          {appliedPromo && status === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Gift className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800">{appliedPromo.description}</span>
                  </div>
                  {appliedPromo.expiresAt && (
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <Calendar className="h-3 w-3" />
                      <span>Expires {new Date(appliedPromo.expiresAt).toLocaleDateString()}</span>
                    </div>
                  )}
                  {appliedPromo.usageLimit && (
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <Clock className="h-3 w-3" />
                      <span>{appliedPromo.usageLimit - appliedPromo.usedCount} uses left</span>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-800">
                    -${discountAmount.toFixed(2)}
                  </div>
                  <div className="text-xs text-green-600">
                    {appliedPromo.type === 'percentage' && `${appliedPromo.value}% off`}
                    {appliedPromo.type === 'fixed' && `$${appliedPromo.value} off`}
                    {appliedPromo.type === 'free_shipping' && 'Free shipping'}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Promo Suggestions */}
          {showSuggestions && !appliedPromo && status === 'idle' && (
            <PromoSuggestions
              onSelect={handleSuggestionSelect}
              totalAmount={totalAmount}
            />
          )}

          {/* Info Message */}
          {!appliedPromo && status === 'idle' && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="h-3 w-3" />
              <span>Enter a promo code to get discounts on your order</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PromoCodeEngine;
