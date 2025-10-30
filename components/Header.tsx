import React from 'react';
import { PlusIcon, ExportIcon, UploadIcon, SaveIcon } from './icons';

interface HeaderProps {
  onAddTransaction: () => void;
  onExportCsv: () => void;
  onSaveJson: () => void;
  onLoadJson: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAddTransaction, onExportCsv, onSaveJson, onLoadJson }) => {
  return (
    <header className="flex items-center justify-between mb-6 py-2 flex-wrap gap-2">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
        Flusso di Cassa
      </h1>
      <div className="flex items-center space-x-2">
        <button
          onClick={onLoadJson}
          className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          aria-label="Carica dati da file JSON"
          title="Carica dati (FLUDAT.json)"
        >
          <UploadIcon className="w-6 h-6" />
        </button>
        <button
          onClick={onSaveJson}
          className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          aria-label="Salva dati in file JSON"
          title="Salva dati (FLUDAT.json)"
        >
          <SaveIcon className="w-6 h-6" />
        </button>
        <button
          onClick={onExportCsv}
          className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          aria-label="Esporta dati in CSV"
          title="Esporta CSV (FLUCAS.csv)"
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