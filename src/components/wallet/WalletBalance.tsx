export default function WalletBalance({ wallet }) {
  if (!wallet) return <p>Loading balance...</p>;

  return (
    <div>
      <h2>Wallet Balance</h2>
      <h1>
        {wallet.currency} {wallet.balance.toFixed(2)}
      </h1>
    </div>
  );
}