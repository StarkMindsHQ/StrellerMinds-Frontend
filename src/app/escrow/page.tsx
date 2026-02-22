import MainLayout from '@/components/MainLayout';
import EscrowCard from '@/components/escrow/EscrowCard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Escrow — Funding',
  description: 'Escrow visibility and funding timeline',
};

export default function EscrowPage() {
  return (
    <MainLayout variant="full-width">
      <div className="py-8 px-4">
        <EscrowCard />
      </div>
    </MainLayout>
  );
}
