
import React from 'react';
import { PlusIcon, ExportIcon } from './icons';

interface HeaderProps {
  onAddTransaction: () => void;
  onExport: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAddTransaction, onExport }) => {
  return (
    <header className="flex items-center justify-between mb-6 py-2">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
        Flusso di Cassa
      </h1>
      <div className="flex items-center space-x-2">
        <button
          onClick={onExport}
          className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          aria-label="Esporta dati"
          title="Esporta dati"
        >
          <ExportIcon className="w-6 h-6" />
        </button>
        <button
          onClick={onAddTransaction}
          className="flex items-center justify-center bg-indigo-600 text-white rounded-full p-2 shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          aria-label="Aggiungi operazione"
          title="Aggiungi operazione"
        >
          <PlusIcon className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};

export default Header;
