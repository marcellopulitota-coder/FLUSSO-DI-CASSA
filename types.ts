
export type TransactionType = 'ENTRATA' | 'USCITA';

export interface Transaction {
  id: string;
  type: TransactionType;
  description: string;
  amount: number;
  date: string; // ISO string format for easy sorting and date manipulation
  toBeReimbursed: boolean;
  reimbursed: boolean;
}
