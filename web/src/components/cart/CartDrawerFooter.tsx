import React from 'react';
import { MessageCircle, CheckCircle2 } from 'lucide-react';
import { formatMoney } from '../../lib/money';

interface CartDrawerFooterProps {
  subtotal: number;
  sent: boolean;
  onSend: () => void;
  onClear: () => void;
}

export const CartDrawerFooter: React.FC<CartDrawerFooterProps> = ({
  subtotal,
  sent,
  onSend,
  onClear,
}) => {
  return (
    <div className="p-4 border-t border-neutral-200 bg-white space-y-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="flex items-center justify-between text-sm">
        <span className="text-neutral-500 font-bold">Subtotal</span>
        <span className="text-lg font-black text-neutral-900">{formatMoney(subtotal)}</span>
      </div>

      {sent ? (
        <div className="rounded-xl border border-[#16B959]/40 bg-[#E8F8EE] p-3 space-y-2">
          <div className="flex items-start gap-2 text-sm text-neutral-800">
            <CheckCircle2 className="w-5 h-5 text-[#16B959] shrink-0" aria-hidden="true" />
            <span>
              Abrimos WhatsApp con tu pedido. Si ya lo enviaste, puedes vaciar el carrito. Si no se abrió,
              vuelve a intentarlo.
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onClear}
              className="h-10 rounded-xl bg-[#16B959] hover:bg-[#13A24D] text-white text-xs font-black cursor-pointer"
            >
              Ya lo envié, vaciar
            </button>
            <button
              type="button"
              onClick={onSend}
              className="h-10 rounded-xl border border-neutral-300 text-neutral-800 text-xs font-bold hover:bg-neutral-50 cursor-pointer"
            >
              Reintentar
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={onSend}
          className="w-full h-12 bg-[#16B959] hover:bg-[#13A24D] text-white font-black text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
        >
          <MessageCircle className="w-5 h-5 fill-white" aria-hidden="true" />
          <span>Enviar pedido por WhatsApp</span>
        </button>
      )}
    </div>
  );
};
