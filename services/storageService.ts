
import { Transaction } from '../types';

const STORAGE_KEY = 'flucas_transactions';

export const saveTransactions = (transactions: Transaction[]): void => {
  try {
    const data = JSON.stringify(transactions);
    localStorage.setItem(STORAGE_KEY, data);
  } catch (error) {
    console.error("Errore nel salvataggio delle transazioni:", error);
  }
};

export const loadTransactions = (): Transaction[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Errore nel caricamento delle transazioni:", error);
  }
  return [];
};
