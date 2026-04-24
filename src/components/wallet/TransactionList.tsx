import TransactionItem from "./TransactionItem";

export default function TransactionList({ transactions, loading }) {
  if (loading) return <p>Loading transactions...</p>;

  return (
    <div>
      {transactions.map((tx) => (
        <TransactionItem key={tx.id} tx={tx} />
      ))}
    </div>
  );
}