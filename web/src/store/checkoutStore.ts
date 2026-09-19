import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type DeliveryType = 'delivery' | 'recojo';

export interface CheckoutStore {
  fullName: string;
  phone: string;
  deliveryType: DeliveryType;
  address: string;
  reference: string;
  generalNotes: string;
  setField: (field: keyof Omit<CheckoutStore, 'setField' | 'reset'>, value: string) => void;
  reset: () => void;
}

const EMPTY = {
  fullName: '',
  phone: '',
  deliveryType: 'delivery' as DeliveryType,
  address: '',
  reference: '',
  generalNotes: '',
};

export const useCheckoutStore = create<CheckoutStore>()(
  persist(
    (set) => ({
      ...EMPTY,

      setField: (field, value) => {
        set((state) => ({ ...state, [field]: value }));
      },

      reset: () => {
        set({ ...EMPTY });
      },
    }),
    {
      // Nombre nuevo: descarta los datos de prueba que quedaron guardados con la versión anterior.
      name: 'retequenos_checkout_v2',
      partialize: (state) => ({
        fullName: state.fullName,
        phone: state.phone,
        deliveryType: state.deliveryType,
        address: state.address,
        reference: state.reference,
        generalNotes: state.generalNotes,
      }),
    }
  )
);
