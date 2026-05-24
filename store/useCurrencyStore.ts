import { create } from 'zustand';

interface CurrencyStore {
  currency: 'EUR' | 'USD' | 'TRY';
  setCurrency: (currency: 'EUR' | 'USD' | 'TRY') => void;
}

export const useCurrencyStore = create<CurrencyStore>((set) => ({
  currency: 'EUR', // Varsayılan baz para birimimiz Euro
  setCurrency: (currency) => set({ currency }),
}));