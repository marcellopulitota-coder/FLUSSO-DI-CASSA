
import React from 'react';

interface BalanceDisplayProps {
  balance: number;
}

const BalanceDisplay: React.FC<BalanceDisplayProps> = ({ balance }) => {
  const balanceColor = balance >= 0 ? 'text-green-500' : 'text-red-500';
  const formattedBalance = new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  }).format(balance);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6 text-center">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        Saldo Attuale
      </p>
      <p className={`text-4xl font-bold mt-2 ${balanceColor}`}>
        {formattedBalance}
      </p>
    </div>
  );
};

export default BalanceDisplay;
