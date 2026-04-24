import { useWallet } from "../../hooks/useWallet";
import { useWalletRealtime } from "../../hooks/useWalletRealtime";
import WalletBalance from "./WalletBalance";
import TransactionList from "./TransactionList";
import TransactionFilters from "./TransactionFilters";

export default function WalletDashboard() {
  const {
    wallet,
    transactions,
    loading,
    filters,
    setFilters,
    refresh,
  } = useWallet();

  useWalletRealtime(refresh);

  return (
    <div>
      <h1>Wallet Dashboard</h1>

      <WalletBalance wallet={wallet} />

      <TransactionFilters
        filters={filters}
        setFilters={setFilters}
      />

      <TransactionList
        transactions={transactions}
        loading={loading}
      />
    </div>
  );
}