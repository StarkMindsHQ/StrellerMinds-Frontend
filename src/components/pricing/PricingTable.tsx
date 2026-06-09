import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { usePricing } from './usePricing';

interface PricingTier {
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  popular: boolean;
  features: { name: string; included: boolean }[];
  ctaText: string;
}

const tiers: PricingTier[] = [
  {
    name: 'Basic',
    description: 'Essential features for individuals and beginners.',
    monthlyPrice: 9.99,
    annualPrice: 99,
    popular: false,
    features: [
      { name: 'Access to all basic courses', included: true },
      { name: 'Community forum access', included: true },
      { name: 'Email support', included: true },
      { name: 'Certificate of completion', included: false },
      { name: '1-on-1 mentorship', included: false },
    ],
    ctaText: 'Get Started',
  },
  {
    name: 'Pro',
    description: 'Perfect for professionals looking to advance their career.',
    monthlyPrice: 29.99,
    annualPrice: 299,
    popular: true,
    features: [
      { name: 'Access to all basic courses', included: true },
      { name: 'Community forum access', included: true },
      { name: 'Priority email support', included: true },
      { name: 'Certificate of completion', included: true },
      { name: '1-on-1 mentorship', included: false },
    ],
    ctaText: 'Start Free Trial',
  },
  {
    name: 'Enterprise',
    description: 'Advanced features for teams and organizations.',
    monthlyPrice: 99.99,
    annualPrice: 999,
    popular: false,
    features: [
      { name: 'Access to all basic courses', included: true },
      { name: 'Community forum access', included: true },
      { name: '24/7 Phone & Email support', included: true },
      { name: 'Certificate of completion', included: true },
      { name: '1-on-1 mentorship', included: true },
    ],
    ctaText: 'Contact Sales',
  },
];

export const PricingTable: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  
  // Example of using dynamic pricing data hook if applicable. 
  // In a real scenario, this hook might override the default prices.
  const { price, loading } = usePricing({ country: 'US', currency: 'USD' });

  return (
    <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Choose the plan that best fits your needs. No hidden fees.
          </p>
        </div>

        <div className="mt-12 flex justify-center items-center gap-3">
          <span className={`text-sm ${!isAnnual ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>Monthly</span>
          <button
            type="button"
            className={`${
              isAnnual ? 'bg-indigo-600' : 'bg-gray-200'
            } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2`}
            role="switch"
            aria-checked={isAnnual}
            onClick={() => setIsAnnual(!isAnnual)}
          >
            <span
              aria-hidden="true"
              className={`${
                isAnnual ? 'translate-x-5' : 'translate-x-0'
              } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
            />
          </button>
          <span className={`text-sm ${isAnnual ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
            Annually <span className="text-green-500 font-medium ml-1">(Save 20%)</span>
          </span>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-2xl border p-8 shadow-sm flex flex-col ${
                tier.popular
                  ? 'border-indigo-600 ring-2 ring-indigo-600 bg-white'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="mb-4">
                {tier.popular && (
                  <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-600 mb-4">
                    Most Popular
                  </span>
                )}
                <h3 className="text-2xl font-semibold text-gray-900">{tier.name}</h3>
                <p className="mt-4 text-sm text-gray-500">{tier.description}</p>
              </div>

              <div className="mt-2 mb-8">
                <span className="text-5xl font-extrabold text-gray-900">
                  ${isAnnual ? tier.annualPrice : tier.monthlyPrice}
                </span>
                <span className="text-base font-medium text-gray-500">
                  /{isAnnual ? 'year' : 'month'}
                </span>
              </div>

              <ul className="mt-6 space-y-4 flex-1">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex space-x-3">
                    {feature.included ? (
                      <Check className="h-5 w-5 flex-shrink-0 text-green-500" aria-hidden="true" />
                    ) : (
                      <X className="h-5 w-5 flex-shrink-0 text-gray-300" aria-hidden="true" />
                    )}
                    <span className={`text-sm ${feature.included ? 'text-gray-700' : 'text-gray-400 line-through'}`}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className={`mt-8 block w-full rounded-md px-4 py-3 text-center text-sm font-semibold shadow-sm hover:scale-[1.02] transition-transform ${
                  tier.popular
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                }`}
              >
                {loading ? 'Loading...' : tier.ctaText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingTable;
