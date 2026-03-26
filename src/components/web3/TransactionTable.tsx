'use client';

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Badge, badgeVariants } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Transaction, TransactionTableProps, TransactionStatus } from '@/types/blockchain';
import { formatTransactionHash, formatAddress, formatEtherBalance } from '@/lib/web3/utils';

type SortField = 'hash' | 'date' | 'amount' | 'status';
type SortDirection = 'asc' | 'desc';

const statusColors: Record<TransactionStatus, string> = {
  pending: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30',
  confirmed: 'bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30',
  failed: 'bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30',
  cancelled: 'bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-500/30',
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

function TransactionRow({ transaction }: { transaction: Transaction }) {
  return (
    <tr className="border-b border-border hover:bg-muted/50 transition-colors">
      <td className="py-3 px-4">
        <a
          href={`https://etherscan.io/tx/${transaction.hash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline font-mono text-sm"
        >
          {formatTransactionHash(transaction.hash)}
        </a>
      </td>
      <td className="py-3 px-4 text-sm text-muted-foreground">
        {formatDate(transaction.timestamp)}
      </td>
      <td className="py-3 px-4">
        <div className="flex flex-col">
          <span className="font-medium text-sm">
            {transaction.amount} {transaction.token || 'ETH'}
          </span>
          {transaction.amountUSD !== undefined && (
            <span className="text-xs text-muted-foreground">
              ≈ ${transaction.amountUSD.toFixed(2)} USD
            </span>
          )}
        </div>
      </td>
      <td className="py-3 px-4">
        <Badge className={cn(statusColors[transaction.status])}>
          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
        </Badge>
      </td>
    </tr>
  );
}

function SortIcon({ direction }: { direction: SortDirection | null }) {
  if (!direction) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-muted-foreground/50"
      >
        <path d="m7 15 5 5 5-5" />
        <path d="m7 9 5-5 5 5" />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-primary"
    >
      {direction === 'asc' ? (
        <path d="m6 9 6-6 6 6" />
      ) : (
        <path d="m18 15-6-6-6 6" />
      )}
    </svg>
  );
}

export function TransactionTable({
  transactions,
  pageSize = 10,
  showPagination = true,
  onPageChange,
  currentPage = 1,
  totalPages: externalTotalPages,
}: TransactionTableProps) {
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [internalPage, setInternalPage] = useState(currentPage);

  const sortedTransactions = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'hash':
          comparison = a.hash.localeCompare(b.hash);
          break;
        case 'date':
          comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
          break;
        case 'amount':
          comparison = parseFloat(a.amount) - parseFloat(b.amount);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [transactions, sortField, sortDirection]);

  const totalPages = externalTotalPages || Math.ceil(sortedTransactions.length / pageSize);

  const paginatedTransactions = useMemo(() => {
    if (externalTotalPages !== undefined) {
      return sortedTransactions;
    }
    const start = (internalPage - 1) * pageSize;
    return sortedTransactions.slice(start, start + pageSize);
  }, [sortedTransactions, internalPage, pageSize, externalTotalPages]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    } else {
      setInternalPage(page);
    }
  };

  const getSortDirection = (field: SortField): SortDirection | null => {
    return sortField === field ? sortDirection : null;
  };

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-muted-foreground mb-4"
        >
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
        <h3 className="text-lg font-medium text-foreground mb-1">No Transactions</h3>
        <p className="text-sm text-muted-foreground">
          There are no transactions to display.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="py-3 px-4 text-left">
                <button
                  onClick={() => handleSort('hash')}
                  className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                >
                  Hash
                  <SortIcon direction={getSortDirection('hash')} />
                </button>
              </th>
              <th className="py-3 px-4 text-left">
                <button
                  onClick={() => handleSort('date')}
                  className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                >
                  Date
                  <SortIcon direction={getSortDirection('date')} />
                </button>
              </th>
              <th className="py-3 px-4 text-left">
                <button
                  onClick={() => handleSort('amount')}
                  className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                >
                  Amount
                  <SortIcon direction={getSortDirection('amount')} />
                </button>
              </th>
              <th className="py-3 px-4 text-left">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                >
                  Status
                  <SortIcon direction={getSortDirection('status')} />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedTransactions.map((transaction) => (
              <TransactionRow key={transaction.id} transaction={transaction} />
            ))}
          </tbody>
        </table>
      </div>

      {showPagination && totalPages > 1 && (
        <div className="flex items-center justify-between py-4 px-2">
          <div className="text-sm text-muted-foreground">
            Page {externalTotalPages ? currentPage : internalPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange((externalTotalPages ? currentPage : internalPage) - 1)}
              disabled={(externalTotalPages ? currentPage : internalPage) === 1}
            >
              Previous
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else {
                const current = externalTotalPages ? currentPage : internalPage;
                if (current <= 3) {
                  pageNum = i + 1;
                } else if (current >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = current - 2 + i;
                }
              }

              return (
                <Button
                  key={pageNum}
                  variant={pageNum === (externalTotalPages ? currentPage : internalPage) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePageChange(pageNum)}
                  className="w-10"
                >
                  {pageNum}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange((externalTotalPages ? currentPage : internalPage) + 1)}
              disabled={(externalTotalPages ? currentPage : internalPage) === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TransactionTable;
