// ReferralDashboard.tsx
import { useReferral } from '../../hooks/useReferral';
import ReferralStats from './ReferralStats';
import ReferralLink from './ReferralLink';
import EarningsSummary from './EarningsSummary';

export default function ReferralDashboard({ userId }) {
  const { stats, loading } = useReferral();

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Referral Dashboard</h2>

      <ReferralLink userId={userId} />
      <ReferralStats stats={stats} />
      <EarningsSummary stats={stats} />
    </div>
  );
}
