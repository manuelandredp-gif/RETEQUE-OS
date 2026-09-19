import React from 'react';
import { createPortal } from 'react-dom';
import { Check } from 'lucide-react';
import { useUiStore } from '../../store/uiStore';
import { useCartStore } from '../../store/cartStore';

/** Aviso breve al agregar productos, con acceso directo al pedido. */
export const Toast: React.FC = () => {
  const toast = useUiStore((s) => s.toast);
  const hideToast = useUiStore((s) => s.hideToast);
  const openCart = useCartStore((s) => s.openCart);

  if (!toast) return null;

  return createPortal(
    <div
      role="status"
      aria-live="polite"
      className="fixed left-1/2 -translate-x-1/2 bottom-24 md:bottom-8 z-[9990] w-[calc(100vw-2rem)] max-w-md"
    >
      <div className="bg-neutral-900 text-white rounded-xl shadow-2xl px-4 py-3 flex items-center gap-3 text-sm font-semibold toast-in">
        <span className="w-6 h-6 rounded-full bg-[#16B959] flex items-center justify-center shrink-0">
          <Check className="w-3.5 h-3.5 stroke-[3]" aria-hidden="true" />
        </span>
        <span className="flex-1 min-w-0 truncate">{toast.message}</span>
        {toast.action === 'cart' && (
          <button
            type="button"
            onClick={() => {
              hideToast();
              openCart();
            }}
            className="text-[#FFEB3B] font-black whitespace-nowrap hover:underline"
          >
            Ver pedido
          </button>
        )}
      </div>
    </div>,
    document.body
  );
};
