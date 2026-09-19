import React, { useState } from 'react';
import { Plus, Check, SlidersHorizontal } from 'lucide-react';
import { Promotion } from '../../data/promotions';
import { Badge } from '../ui/Badge';
import { formatMoney } from '../../lib/money';
import { useProductActions } from '../../lib/productActions';
import { ImageWithFallback } from '../ui/ImageWithFallback';

interface PromotionCardProps {
  promotion: Promotion;
}

export const PromotionCard: React.FC<PromotionCardProps> = ({ promotion }) => {
  const { addPromo, openPromo } = useProductActions();
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addPromo(promotion);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <article
      onClick={() => openPromo(promotion)}
      className="bg-white rounded-xl sm:rounded-2xl border border-[#ECECEC] overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
    >
      <div className="relative aspect-[16/10] sm:aspect-[4/3] bg-neutral-100 overflow-hidden">
        <ImageWithFallback
          src={promotion.image}
          alt={promotion.name}
          fallbackLabel={promotion.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute top-2.5 left-2.5">
          <Badge variant="promo">Promo</Badge>
        </div>
        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-white/95 text-neutral-900 text-xs font-black px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#C5161D]" aria-hidden="true" />
            Personalizar
          </span>
        </div>
      </div>

      <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between gap-2.5">
        <div>
          <h3 className="font-bold text-xs sm:text-sm text-neutral-900 leading-snug group-hover:text-brand-red transition-colors">
            {promotion.name}
          </h3>
          <p className="text-[11px] text-neutral-500 line-clamp-2 mt-1 leading-relaxed">{promotion.description}</p>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-neutral-100 mt-auto">
          <span className="font-extrabold text-sm sm:text-base text-neutral-900">{formatMoney(promotion.price)}</span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openPromo(promotion);
              }}
              className="text-[11px] font-bold text-[#C5161D] bg-[#FFF0F1] hover:bg-[#FFE2E4] px-2.5 py-1.5 rounded-lg transition-colors"
            >
              Elegir
            </button>

            <button
              type="button"
              onClick={handleAdd}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 shadow-sm active:scale-90 ${
                added ? 'bg-whatsapp text-white' : 'bg-brand-red hover:bg-brand-red-dark text-white'
              }`}
              aria-label={`Agregar ${promotion.name} al pedido`}
            >
              {added ? <Check className="w-4 h-4 stroke-[3]" /> : <Plus className="w-4 h-4 stroke-[2.8]" />}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
