
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Transaction } from './types';
import { saveTransactions, loadTransactions } from './services/storageService';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import BalanceDisplay from './components/BalanceDisplay';
import Header from './components/Header';

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadTransactions());
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  const balance = useMemo(() => {
    return transactions.reduce((acc, transaction) => {
      if (transaction.type === 'ENTRATA') {
        return acc + transaction.amount;
      }
      return acc - transaction.amount;
    }, 0);
  }, [transactions]);

  const handleAddTransaction = useCallback(() => {
    setEditingTransaction(null);
    setIsFormVisible(true);
  }, []);
  
  const handleEditTransaction = useCallback((transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormVisible(true);
  }, []);

  const handleDeleteTransaction = useCallback((id: string) => {
    if (window.confirm("Sei sicuro di voler eliminare questa operazione?")) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  }, []);

  const handleSaveTransaction = useCallback((transaction: Transaction) => {
    setTransactions(prev => {
      const existing = prev.find(t => t.id === transaction.id);
      if (existing) {
        return prev.map(t => t.id === transaction.id ? transaction : t);
      }
      return [...prev, transaction];
    });
    setIsFormVisible(false);
  }, []);

  const handleExportToCsv = useCallback(() => {
    if (transactions.length === 0) {
      alert("Nessun dato da esportare.");
      return;
    }

    const headers = [
      "Tipo Operazione", 
      "Descrizione", 
      "Importo (€)", 
      "Data", 
      "Da Rimborsare", 
      "Rimborsato"
    ];
    
    const rows = transactions.map(t => [
      t.type,
      `"${t.description.replace(/"/g, '""')}"`,
      t.amount.toFixed(2),
      new Date(t.date).toLocaleDateString('it-IT'),
      t.toBeReimbursed ? 'SI' : 'NO',
      t.reimbursed ? 'SI' : 'NO'
    ].join(','));

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(',') + '\n' 
      + rows.join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "FLUCAS.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [transactions]);

  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions]);

  return (
    <div className="min-h-screen font-sans text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto max-w-2xl p-4">
        <Header onAddTransaction={handleAddTransaction} onExport={handleExportToCsv} />
        <main>
          <BalanceDisplay balance={balance} />
          <TransactionList 
            transactions={sortedTransactions} 
            onEdit={handleEditTransaction} 
            onDelete={handleDeleteTransaction}
          />
        </main>
      </div>
      {isFormVisible && (
        <TransactionForm
          transaction={editingTransaction}
          onSave={handleSaveTransaction}
          onClose={() => setIsFormVisible(false)}
        />
      )}
    </div>
  );
};

export default App;
