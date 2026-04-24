// EarningsSummary.tsx
export default function EarningsSummary({ stats }) {
  return (
    <div>
      <h3>Earnings</h3>
      <p>Total: ${stats?.earnings}</p>
    </div>
  );
}