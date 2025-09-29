import React from 'react';
import { FaRegStar } from 'react-icons/fa';
import { FiCreditCard } from 'react-icons/fi';
import { LuWallet } from 'react-icons/lu';

interface CryptoModalProps {
  courseTitle: string;
  price: number;
  cryptoPrice: number;
  cryptoCurrency: string;
  onConnect: () => void;
  currentMethod: 'card' | 'crypto';
  onChangeMethod: (method: 'card' | 'crypto') => void;
  onClose: () => void;
}

const CryptoModal: React.FC<CryptoModalProps> = ({
  courseTitle,
  price,
  cryptoPrice,
  cryptoCurrency,
  onConnect,
  currentMethod,
  onChangeMethod,
  onClose,
}) => {
  const exchangeRate = (price / cryptoPrice).toFixed(2);

  return (
    <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-black">
          Complete your purchase
        </h2>
        <button className="text-gray-500" onClick={onClose}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <p className="text-gray-600 mb-6">
        Choose your preferred payment method to enroll in this course.
      </p>

      <div className="border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <div className="bg-gray-200 w-16 h-16 rounded mr-4"></div>
          <div>
            <h3 className="font-bold text-lg text-black">{courseTitle}</h3>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Lifetime access</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">Certificate included</span>
            </div>
            <p className="font-bold text-lg mt-1 text-black">
              ${price.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Payment toggle */}
      <div className="flex justify-center items-center mb-6">
        <div className="flex w-full rounded-md bg-gray-50 p-1">
          <button
            onClick={() => onChangeMethod('crypto')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 ${
              currentMethod === 'crypto' ? 'bg-white rounded-md shadow-sm' : ''
            }`}
          >
            <span
              className={
                currentMethod === 'crypto' ? 'text-black' : 'text-gray-500'
              }
            >
              <FaRegStar size={20} />
            </span>
            <span
              className={`font-medium ${
                currentMethod === 'crypto' ? 'text-black' : 'text-gray-500'
              }`}
            >
              Crypto
            </span>
          </button>
          <button
            onClick={() => onChangeMethod('card')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 ${currentMethod === 'card' ? 'bg-white rounded-md shadow-sm' : ''}`}
          >
            <span
              className={
                currentMethod === 'card' ? 'text-blue-600' : 'text-gray-500'
              }
            >
              <FiCreditCard size={20} />
            </span>
            <span
              className={`font-medium ${currentMethod === 'card' ? 'text-blue-600' : 'text-gray-500'}`}
            >
              Card
            </span>
          </button>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-blue-600">
            <FaRegStar size={20} />
          </span>
          <h3 className="font-bold text-lg text-black">
            Pay with Stellar (XLM)
          </h3>
          <span className="ml-auto font-bold text-black">
            {cryptoPrice} XLM
          </span>
        </div>
        <p className="text-gray-600">
          Connect your Stellar wallet to make a secure payment
        </p>
      </div>
      <div className="flex justify-center">
        <button
          onClick={onConnect}
          className="w-[200px] bg-blue-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-6 mb-4"
        >
          <LuWallet size={20} />
          Connect Wallet
        </button>
      </div>

      <p className="text-center text-gray-600 mb-1">
        Payments are processed on the Stellar blockchain
      </p>
      <p className="text-center text-gray-600 mb-6">
        Current rate: 1 XLM ≈ ${exchangeRate}
      </p>

      <hr className="mb-6" />

      <div className="flex justify-between items-center mb-6">
        <span className="font-bold text-lg text-black">Total:</span>
        <span className="font-bold text-lg text-black">{cryptoPrice} XLM</span>
      </div>

      <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2">
        Complete Purchase
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 12H19"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 5L19 12L12 19"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default CryptoModal;
