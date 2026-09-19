import { create } from 'zustand';
import type { Product } from '../data/catalog';
import type { Promotion } from '../data/promotions';

export type ConfigurableItem = Product | Promotion;

export interface ToastState {
  message: string;
  action?: 'cart';
}

interface UiStore {
  productToConfigure: ConfigurableItem | null;
  openConfigurator: (item: ConfigurableItem) => void;
  closeConfigurator: () => void;
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  toast: ToastState | null;
  showToast: (toast: ToastState) => void;
  hideToast: () => void;
}

let toastTimer: ReturnType<typeof setTimeout> | undefined;

export const useUiStore = create<UiStore>()((set) => ({
  productToConfigure: null,
  openConfigurator: (item) => set({ productToConfigure: item, isMobileMenuOpen: false, isSearchOpen: false }),
  closeConfigurator: () => set({ productToConfigure: null }),

  isMobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),

  isSearchOpen: false,
  setSearchOpen: (open) => set({ isSearchOpen: open }),

  toast: null,
  showToast: (toast) => {
    if (toastTimer) clearTimeout(toastTimer);
    set({ toast });
    toastTimer = setTimeout(() => set({ toast: null }), 2800);
  },
  hideToast: () => {
    if (toastTimer) clearTimeout(toastTimer);
    set({ toast: null });
  },
}));
