export interface RewardTransaction {
  id: number;
  transactionCode: number;
  bookingCode: string;
  points: number;
  type: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  createdAt: string;
}
export interface RewardTransactionTableProps {
  rows: RewardTransaction[];
  loading: boolean;
  sortKey: keyof RewardTransaction | null;
  sortDir: "asc" | "desc";
  onSortChange: (key: keyof RewardTransaction) => void;
 
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}
