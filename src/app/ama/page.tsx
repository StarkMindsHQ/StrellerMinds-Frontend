import React from 'react';
import type { Metadata } from 'next';
import AMASession from '@/components/ama/AMASession';

export const metadata: Metadata = {
  title: 'AMA Session | StrellerMinds',
  description:
    'Join live Ask Me Anything sessions with blockchain instructors and experts.',
};

export default function AMAPage() {
  return (
    <main className="min-h-screen py-8 px-4">
      <AMASession />
    </main>
  );
}
