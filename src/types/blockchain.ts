/**
 * Transaction types for blockchain transactions
 */

export type TransactionStatus = 'pending' | 'confirmed' | 'failed' | 'cancelled';

export interface Transaction {
  id: string;
  hash: string;
  from: string;
  to: string;
  amount: string;
  amountUSD?: number;
  token?: string;
  status: TransactionStatus;
  timestamp: Date;
  blockNumber?: number;
  gasUsed?: string;
  gasPrice?: string;
  nonce?: number;
}

export interface TransactionParams {
  to: string;
  value?: string;
  data?: string;
  gasLimit?: number;
}

export interface GasEstimate {
  gasPrice: bigint;
  gasLimit: bigint;
  gasFeeWei: bigint;
  gasFeeEth: number;
  gasFeeUsd: number;
  gasPriceGwei: number;
}

export interface TransactionTableProps {
  transactions: Transaction[];
  pageSize?: number;
  showPagination?: boolean;
  onPageChange?: (page: number) => void;
  currentPage?: number;
  totalPages?: number;
}

export interface TransactionCostEstimatorProps {
  params: TransactionParams;
  onParamsChange?: (params: TransactionParams) => void;
  cryptoPrice?: number;
}
