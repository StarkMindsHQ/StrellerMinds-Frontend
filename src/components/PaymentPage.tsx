'use client'

import React, { useState } from 'react';
import CardModal from '../components/modal/Card-modal';
import CryptoModal from '../components/modal/Crypto-modal';

const PaymentPage: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'crypto'>('crypto');
  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleComplete = () => {
    setIsModalOpen(false);
   
    console.log('Payment completed');
  };

  const handleConnectWallet = () => {
    console.log('Connect wallet clicked');
   
  };

  const handlePaymentMethodChange = (method: 'card' | 'crypto') => {
    setPaymentMethod(method);
  };


  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const courseInfo = {
    title: 'Stellar Smart Contract Development',
    price: 149.99,
    cryptoPrice: 1249.92,
    cryptoCurrency: 'XLM'
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 relative">
     

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-10 p-4">
          {paymentMethod === 'card' ? (
            <CardModal
              courseTitle={courseInfo.title}
              price={courseInfo.price}
              onComplete={handleComplete}
              currentMethod={paymentMethod}
              onChangeMethod={handlePaymentMethodChange}
              onClose={handleCloseModal}
            />
          ) : (
            <CryptoModal
              courseTitle={courseInfo.title}
              price={courseInfo.price}
              cryptoPrice={courseInfo.cryptoPrice}
              cryptoCurrency={courseInfo.cryptoCurrency}
              onConnect={handleConnectWallet}
              currentMethod={paymentMethod}
              onChangeMethod={handlePaymentMethodChange}
              onClose={handleCloseModal} 
            />
          )}
        </div>
      )}
      
  
      <div className="fixed bottom-4 left-4 bg-white p-3 rounded-lg shadow-md">
        <div className="flex items-center gap-4">
          <span className='text-black'>Toggle payment method:</span>
          <button 
            onClick={() => setIsModalOpen(!isModalOpen)} 
            className="px-3 py-1 rounded-lg bg-gray-800 text-white"
          >
            {isModalOpen ? 'Close Modal' : 'Open Modal'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;