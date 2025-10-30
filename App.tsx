import React, { useState, useMemo, useCallback } from 'react';
import { Transaction } from './types';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import BalanceDisplay from './components/BalanceDisplay';
import Header from './components/Header';

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

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
      "Data Operazione",
      "Tipo Operazione", 
      "Descrizione", 
      "Importo (€)", 
      "Da Rimborsare", 
      "Rimborsato"
    ];
    
    // Sort by date ascending for export
    const sortedForExport = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const rows = sortedForExport.map(t => [
      new Date(t.date).toLocaleDateString('it-IT'),
      t.type,
      `"${t.description.replace(/"/g, '""')}"`,
      t.amount.toFixed(2).replace('.', ','),
      t.toBeReimbursed ? 'SI' : 'NO',
      t.reimbursed ? 'SI' : 'NO'
    ].join(';'));

    const formattedBalance = new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: 'EUR',
    }).format(balance);

    const summaryRow = `\n\n;;;;Saldo Attuale;${formattedBalance}`;
    
    const BOM = "\uFEFF"; // Byte Order Mark for Excel
    const csvContent = "data:text/csv;charset=utf-8," 
      + BOM
      + headers.join(';') + '\n' 
      + rows.join('\n')
      + summaryRow;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "FLUCAS.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [transactions, balance]);

  const handleSaveToJson = useCallback(() => {
    if (transactions.length === 0) {
        alert("Nessun dato da salvare.");
        return;
    }
    const dataStr = JSON.stringify(transactions, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'FLUDAT.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    alert("Dati salvati in FLUDAT.json");
  }, [transactions]);

  const handleLoadFromJson = useCallback(() => {
      if (transactions.length > 0 && !window.confirm("Attenzione: i dati attuali non salvati verranno sovrascritti. Continuare?")) {
          return;
      }
      
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json,application/json';
      input.onchange = e => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (!file) return;
          
          const reader = new FileReader();
          reader.onload = readerEvent => {
              try {
                  const content = readerEvent.target?.result;
                  if (typeof content === 'string') {
                      const loadedTransactions = JSON.parse(content);
                      if (Array.isArray(loadedTransactions)) {
                          setTransactions(loadedTransactions as Transaction[]);
                          alert("Dati caricati con successo.");
                      } else {
                         throw new Error("Il file JSON non è nel formato corretto.");
                      }
                  }
              } catch (error) {
                  console.error("Errore nel caricare il file JSON:", error);
                  alert("Errore: Impossibile caricare il file. Assicurati che sia un file FLUDAT.json valido.");
              }
          };
          reader.readAsText(file);
      };
      input.click();
  }, [transactions]);

  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions]);

  return (
    <div className="min-h-screen font-sans text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto max-w-2xl p-4">
        <Header 
          onAddTransaction={handleAddTransaction} 
          onExportCsv={handleExportToCsv}
          onSaveJson={handleSaveToJson}
          onLoadJson={handleLoadFromJson}
        />
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