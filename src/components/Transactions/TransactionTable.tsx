export type TransactionStatus = "success" | "pending" | "failed";

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  createdAt: string;
  description: string;
}