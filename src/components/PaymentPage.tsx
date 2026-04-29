'use client';

import React, { useState } from 'react';
import CardModal from '../components/modal/Card-modal';
import CryptoModal from '../components/modal/Crypto-modal';
import { PaystackButton } from './payment/PaystackButton';
import { PaymentRetryModal } from './payment/PaymentRetryModal';
import { logger } from '@/lib/logger';
import { toast } from 'sonner';

const PaymentPage: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState<
    'card' | 'crypto' | 'paystack'
  >('crypto');
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isRetryModalOpen, setIsRetryModalOpen] = useState(false);

  const handleComplete = () => {
    setIsModalOpen(false);
    toast.success('Payment successful!');
  };

  const handlePaymentError = () => {
    setIsRetryModalOpen(true);
  };

  const handleConnectWallet = () => {
    logger.log('Connect wallet clicked');
  };

  const handlePaymentMethodChange = (
    method: 'card' | 'crypto' | 'paystack',
  ) => {
    setPaymentMethod(method);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const courseInfo = {
    title: 'Stellar Smart Contract Development',
    price: 149.99,
    cryptoPrice: 1249.92,
    cryptoCurrency: 'XLM',
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 relative font-sans">
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10 p-4">
          <div className="w-full max-w-lg">
            {paymentMethod === 'card' && (
              <CardModal
                courseTitle={courseInfo.title}
                price={courseInfo.price}
                onComplete={handleComplete}
                currentMethod={paymentMethod as any}
                onChangeMethod={handlePaymentMethodChange as any}
                onClose={handleCloseModal}
              />
            )}

            {paymentMethod === 'crypto' && (
              <CryptoModal
                courseTitle={courseInfo.title}
                price={courseInfo.price}
                cryptoPrice={courseInfo.cryptoPrice}
                cryptoCurrency={courseInfo.cryptoCurrency}
                onConnect={handleConnectWallet}
                currentMethod={paymentMethod as any}
                onChangeMethod={handlePaymentMethodChange as any}
                onClose={handleCloseModal}
              />
            )}

            {paymentMethod === 'paystack' && (
              <div className="bg-white p-8 rounded-2xl shadow-xl space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold">Paystack Checkout</h3>
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Back to Card
                  </button>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-sm text-blue-800 font-medium">
                    {courseInfo.title}
                  </p>
                  <p className="text-2xl font-bold text-blue-900">
                    ${courseInfo.price}
                  </p>
                </div>
                <PaystackButton
                  email="user@example.com"
                  amount={courseInfo.price * 100} // Paystack expects amount in kobo/cents
                  publicKey="pk_test_mock_key"
                  onSuccess={(ref) => {
                    console.log('Payment ref:', ref);
                    handleComplete();
                  }}
                  onClose={() => setPaymentMethod('card')}
                />
                <button
                  onClick={handlePaymentError}
                  className="w-full text-xs text-gray-400 hover:text-red-400 transition-colors py-2"
                >
                  Simulate Payment Failure
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <PaymentRetryModal
        isOpen={isRetryModalOpen}
        onClose={() => setIsRetryModalOpen(false)}
        onRetry={() => {
          setIsRetryModalOpen(false);
          setIsModalOpen(true);
        }}
        transactionContext={{
          courseTitle: courseInfo.title,
          amount: courseInfo.price,
          method: paymentMethod,
        }}
      />

      <div className="fixed bottom-4 left-4 bg-white p-4 rounded-2xl shadow-xl border border-gray-100">
        <div className="flex flex-col gap-3">
          <span className="text-sm font-bold text-gray-900">
            Demo Controls:
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setIsModalOpen(!isModalOpen)}
              className="px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              {isModalOpen ? 'Close Modal' : 'Open Payment Modal'}
            </button>
            <button
              onClick={() => handlePaymentMethodChange('paystack')}
              className="px-4 py-2 rounded-xl bg-[#09A5DB] text-white text-sm font-medium hover:bg-[#0894C4] transition-colors"
            >
              Switch to Paystack
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
