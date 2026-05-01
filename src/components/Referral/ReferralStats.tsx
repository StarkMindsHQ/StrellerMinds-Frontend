// ReferralStats.tsx
export default function ReferralStats({ stats }) {
  return (
    <div>
      <p>Clicks: {stats?.clicks}</p>
      <p>Conversions: {stats?.conversions}</p>
    </div>
  );
}
