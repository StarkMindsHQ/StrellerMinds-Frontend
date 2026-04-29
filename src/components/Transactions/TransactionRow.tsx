export default function TransactionRow({ tx }) {
  return (
    <tr>
      <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
      <td>{tx.description}</td>
      <td>
        {tx.currency} {tx.amount}
      </td>
      <td>{tx.status}</td>
    </tr>
  );
}
