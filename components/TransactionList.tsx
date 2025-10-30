
import React from 'react';
import { Transaction } from '../types';
import { EditIcon, TrashIcon } from './icons';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

const TransactionItem: React.FC<{ transaction: Transaction; onEdit: (t: Transaction) => void; onDelete: (id: string) => void }> = ({ transaction, onEdit, onDelete }) => {
  const isIncome = transaction.type === 'ENTRATA';
  const amountColor = isIncome ? 'text-green-500' : 'text-red-500';
  const sign = isIncome ? '+' : '-';
  const formattedAmount = new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  }).format(transaction.amount);

  const formattedDate = new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(transaction.date));

  return (
    <li className="bg-white dark:bg-gray-800 rounded-lg p-4 flex items-center space-x-4 transition-shadow hover:shadow-md">
      <div className="flex-grow">
        <div className="flex justify-between items-start">
            <span className="font-semibold text-gray-800 dark:text-gray-100">{transaction.description}</span>
            <span className={`font-bold ${amountColor}`}>{sign} {formattedAmount}</span>
        </div>
        <div className="flex justify-between items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
          <span>{formattedDate}</span>
          <div className="flex items-center space-x-2">
            {transaction.toBeReimbursed && (
              <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${transaction.reimbursed ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'}`}>
                {transaction.reimbursed ? 'Rimborsato' : 'Da Rimborsare'}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
        <button onClick={() => onEdit(transaction)} className="p-2 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Modifica">
          <EditIcon />
        </button>
        <button onClick={() => onDelete(transaction.id)} className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Elimina">
          <TrashIcon />
        </button>
      </div>
    </li>
  );
};

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onEdit, onDelete }) => {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-10 px-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <p className="text-gray-500 dark:text-gray-400">Nessuna operazione registrata.</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Clicca il pulsante '+' per iniziare.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {transactions.map(transaction => (
        <TransactionItem key={transaction.id} transaction={transaction} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </ul>
  );
};

export default TransactionList;
