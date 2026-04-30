import React from 'react';
import { Metadata } from 'next';
import PricingTable from '@/components/pricing/PricingTable';

export const metadata: Metadata = {
  title: 'Pricing | StrellerMinds',
  description: 'Choose the best plan for your learning journey.',
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-gray-50 pt-20">
      <PricingTable />
    </main>
  );
}
