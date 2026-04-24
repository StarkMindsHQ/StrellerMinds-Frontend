export default function TransactionFilters({ filters, setFilters }) {
  return (
    <div>
      <select
        onChange={(e) =>
          setFilters((prev) => ({ ...prev, status: e.target.value }))
        }
      >
        <option value="">All</option>
        <option value="success">Success</option>
        <option value="pending">Pending</option>
        <option value="failed">Failed</option>
      </select>

      <input
        type="date"
        onChange={(e) =>
          setFilters((prev) => ({ ...prev, startDate: e.target.value }))
        }
      />

      <input
        type="date"
        onChange={(e) =>
          setFilters((prev) => ({ ...prev, endDate: e.target.value }))
        }
      />
    </div>
  );
}