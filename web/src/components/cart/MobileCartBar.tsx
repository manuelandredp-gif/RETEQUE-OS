import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { formatMoney } from '../../lib/money';

/** Barra fija inferior en celular: muestra el pedido en curso y abre el carrito. */
export const MobileCartBar: React.FC = () => {
  const totalCount = useCartStore((s) => s.getTotalCount());
  const subtotal = useCartStore((s) => s.getSubtotal());
  const isCartOpen = useCartStore((s) => s.isCartOpen);
  const openCart = useCartStore((s) => s.openCart);

  if (totalCount === 0 || isCartOpen) return null;

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-[9980] px-3 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-gradient-to-t from-white via-white/95 to-transparent pointer-events-none">
      <button
        type="button"
        onClick={openCart}
        className="pointer-events-auto w-full h-13 bg-[#C5161D] hover:bg-[#A3001E] text-white rounded-2xl shadow-xl flex items-center justify-between px-4 font-black text-sm transition-colors"
        aria-label={`Ver pedido, ${totalCount} productos, ${formatMoney(subtotal)}`}
      >
        <span className="flex items-center gap-2.5">
          <span className="bg-[#FFEB3B] text-neutral-900 rounded-full min-w-[26px] h-[26px] px-1.5 flex items-center justify-center text-xs">
            {totalCount}
          </span>
          <ShoppingBag className="w-4 h-4" aria-hidden="true" />
          Ver pedido
        </span>
        <span>{formatMoney(subtotal)}</span>
      </button>
    </div>
  );
};
