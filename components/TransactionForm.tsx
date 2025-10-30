
import React, { useState, useEffect } from 'react';
import { Transaction, TransactionType } from '../types';
import { CloseIcon } from './icons';

interface TransactionFormProps {
  transaction: Transaction | null;
  onSave: (transaction: Transaction) => void;
  onClose: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ transaction, onSave, onClose }) => {
  const [type, setType] = useState<TransactionType>(transaction?.type || 'USCITA');
  const [description, setDescription] = useState(transaction?.description || '');
  const [amount, setAmount] = useState(transaction?.amount || '');
  const [date, setDate] = useState(transaction?.date ? transaction.date.split('T')[0] : new Date().toISOString().split('T')[0]);
  const [toBeReimbursed, setToBeReimbursed] = useState(transaction?.toBeReimbursed || false);
  const [reimbursed, setReimbursed] = useState(transaction?.reimbursed || false);
  
  useEffect(() => {
    if (!toBeReimbursed) {
      setReimbursed(false);
    }
  }, [toBeReimbursed]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || parseFloat(amount.toString()) <= 0) {
      alert("Per favore, compila descrizione e importo (maggiore di zero).");
      return;
    }

    const newTransaction: Transaction = {
      id: transaction?.id || new Date().getTime().toString(),
      type,
      description,
      amount: parseFloat(amount.toString()),
      date,
      toBeReimbursed,
      reimbursed,
    };
    onSave(newTransaction);
  };
  
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md relative" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {transaction ? 'Modifica Operazione' : 'Nuova Operazione'}
            </h2>
            <button onClick={onClose} className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
              <CloseIcon />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="grid grid-cols-2 gap-2 rounded-lg p-1 bg-gray-200 dark:bg-gray-700">
                <button type="button" onClick={() => handleTypeChange('USCITA')} className={`w-full py-2.5 text-sm font-semibold rounded-md transition-colors ${type === 'USCITA' ? 'bg-white dark:bg-gray-900 text-red-600 dark:text-red-500 shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'}`}>
                  Uscita
                </button>
                <button type="button" onClick={() => handleTypeChange('ENTRATA')} className={`w-full py-2.5 text-sm font-semibold rounded-md transition-colors ${type === 'ENTRATA' ? 'bg-white dark:bg-gray-900 text-green-600 dark:text-green-500 shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'}`}>
                  Entrata
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Descrizione</label>
              <input type="text" id="description" value={description} onChange={e => setDescription(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Importo (€)</label>
                <input type="number" id="amount" value={amount} onChange={e => setAmount(e.target.value)} required min="0.01" step="0.01" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Data</label>
                <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input id="toBeReimbursed" name="toBeReimbursed" type="checkbox" checked={toBeReimbursed} onChange={e => setToBeReimbursed(e.target.checked)} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-600 rounded" />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="toBeReimbursed" className="font-medium text-gray-700 dark:text-gray-300">Da Rimborsare</label>
                </div>
              </div>
              {toBeReimbursed && (
                 <div className="flex items-start pl-5">
                    <div className="flex items-center h-5">
                      <input id="reimbursed" name="reimbursed" type="checkbox" checked={reimbursed} onChange={e => setReimbursed(e.target.checked)} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-600 rounded" />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="reimbursed" className="font-medium text-gray-700 dark:text-gray-300">Rimborsato</label>
                    </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button type="submit" className="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800">
                Salva Operazione
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TransactionForm;
