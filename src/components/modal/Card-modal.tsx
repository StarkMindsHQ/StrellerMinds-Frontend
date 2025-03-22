import React, { useState } from 'react';
import { FaRegStar } from 'react-icons/fa';
import { FiCreditCard } from "react-icons/fi";

interface CardModalProps {
  courseTitle: string;
  price: number;
  onComplete: () => void;
  currentMethod: 'card' | 'crypto';
  onChangeMethod: (method: 'card' | 'crypto') => void;
  onClose: () => void; 
}
const CardModal: React.FC<CardModalProps> = ({ 
  courseTitle, 
  price, 
  onComplete,
  currentMethod,
  onChangeMethod,
  onClose
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    cardNumber: '',
    expiryDate: '',
    cvc: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value) {
      value = value.match(/.{1,4}/g)?.join(' ') || '';
    }
    setFormData({ ...formData, cardNumber: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete();
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center p-6 pb-2">
        <h2 className="text-2xl font-bold text-gray-900">Complete your purchase</h2>
        <button className="text-gray-500" onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <p className="text-gray-600 px-6 pb-4">Choose your preferred payment method to enroll in this course.</p>
      
      <div className="mx-6 mb-6 border border-gray-200 rounded-lg">
        <div className="flex items-center p-4">
          <div className="bg-gray-200 w-16 h-16 rounded mr-4 flex items-center justify-center">
            <span className="text-2xl text-gray-400">•</span>
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">{courseTitle}</h3>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Lifetime access</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">Certificate included</span>
            </div>
            <p className="font-bold text-lg mt-1 text-gray-900">${price.toFixed(2)}</p>
          </div>
        </div>
      </div>
      
      {/* Payment method toggle - matching the design in the image */}
      <div className="flex justify-center items-center mx-6 mb-6">
        <div className="flex w-full rounded-lg bg-gray-100 p-1">
          <button 
            onClick={() => onChangeMethod('crypto')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 ${currentMethod === 'crypto' ? 'bg-white rounded-md shadow-sm' : ''}`}
          >
            <span className={currentMethod === 'crypto' ? 'text-gray-900' : 'text-gray-500'}>
              <FaRegStar size={20} />
            </span>
            <span className={`font-medium ${currentMethod === 'crypto' ? 'text-gray-900' : 'text-gray-500'}`}>Crypto</span>
          </button>
          <button 
            onClick={() => onChangeMethod('card')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 ${currentMethod === 'card' ? 'bg-white rounded-md shadow-sm' : ''}`}
          >
            <span className={currentMethod === 'card' ? 'text-gray-900' : 'text-gray-500'}>
             <FiCreditCard size={20} />
            </span>
            <span className={`font-medium ${currentMethod === 'card' ? 'text-gray-900' : 'text-gray-500'}`}>Card</span>
          </button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="px-6 pb-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="firstName" className="block text-black font-semibold  mb-2">First name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-3 border text-gray-800 border-gray-300 rounded-lg"
              placeholder="John"
              required
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-black font-semibold  mb-2">Last name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-3 border text-gray-800 border-gray-300 rounded-lg"
              placeholder="Doe"
              required
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="cardNumber" className="block text-black font-semibold  mb-2">Card number</label>
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleCardNumberChange}
            className="w-full p-3 text-gray-800 border border-gray-300 rounded-lg"
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="expiryDate" className="block text-black font-semibold  mb-2">Expiry date</label>
            <input
              type="text"
              id="expiryDate"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              className="w-full p-3 text-gray-800 border border-gray-300 rounded-lg"
              placeholder="MM/YY"
              maxLength={5}
              required
            />
          </div>
          <div>
            <label htmlFor="cvc" className="block text-black font-semibold mb-2">CVC</label>
            <input
              type="text"
              id="cvc"
              name="cvc"
              value={formData.cvc}
              onChange={handleChange}
              className="w-full p-3 text-gray-800 border border-gray-300 rounded-lg"
              placeholder="123"
              maxLength={3}
              required
            />
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-6 mb-6">
          <div className="flex justify-between items-center">
            <span className="font-bold text-lg text-gray-900">Total:</span>
            <span className="font-bold text-lg text-gray-900">${price.toFixed(2)}</span>
          </div>
        </div>
        
        <button 
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2"
        >
          Complete Purchase
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 5L19 12L12 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </form>
    </div>
  );
};

export default CardModal;