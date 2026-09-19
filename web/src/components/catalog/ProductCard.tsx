import React, { useEffect, useState } from 'react';
import { Plus, Check } from 'lucide-react';
import { Product } from '../../data/catalog';
import { formatMoney } from '../../lib/money';
import { productUnitPrice, useProductActions } from '../../lib/productActions';
import { ImageWithFallback } from '../ui/ImageWithFallback';

interface ProductCardProps {
  product: Product;
  forcedPresentation?: '10' | '20';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, forcedPresentation }) => {
  const { quickAdd, openProduct } = useProductActions();
  const [selectedPresId, setSelectedPresId] = useState<string>(
    forcedPresentation || (product.presentations ? product.presentations[0].id : '')
  );
  const [added, setAdded] = useState(false);

  // Sincroniza la presentación cuando cambia el filtro de la categoría
  useEffect(() => {
    if (forcedPresentation && product.presentations) {
      setSelectedPresId(forcedPresentation);
    }
  }, [forcedPresentation, product.presentations]);

  const price = productUnitPrice(product, selectedPresId);
  const isTequeno = product.category === 'tequenos';

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    quickAdd(product, selectedPresId);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <article
      onClick={() => openProduct(product)}
      className="bg-white rounded-xl sm:rounded-2xl border border-[#ECECEC] overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
    >
      <div className="relative aspect-[16/10] sm:aspect-[4/3] bg-neutral-100 overflow-hidden">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          fallbackLabel={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          decoding="async"
        />
        {isTequeno && (
          <span className="absolute bottom-2 left-2 bg-white/95 text-neutral-900 text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Ver opciones
          </span>
        )}
      </div>

      <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between gap-2.5">
        <div>
          <h3 className="font-bold text-xs sm:text-sm text-neutral-900 leading-snug line-clamp-1 group-hover:text-brand-red transition-colors">
            {product.name}
          </h3>

          {product.ingredients && product.ingredients.length > 0 ? (
            <p className="text-[11px] text-neutral-500 line-clamp-2 mt-1 leading-relaxed">
              {product.ingredients.join(', ')}
            </p>
          ) : product.category === 'pizzas' ? (
            <p className="text-[11px] text-neutral-500 mt-0.5">Familiar 35 cm</p>
          ) : product.description ? (
            <p className="text-[11px] text-neutral-500 line-clamp-1 mt-1">{product.description}</p>
          ) : null}

          {product.presentations && product.presentations.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2" role="group" aria-label="Presentación">
              {product.presentations.map((pres) => {
                const isSelected = pres.id === selectedPresId;
                return (
                  <button
                    key={pres.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPresId(pres.id);
                    }}
                    className={`text-[10px] sm:text-[11px] font-bold px-2 py-1 rounded-md transition-all ${
                      isSelected
                        ? 'bg-brand-red text-white shadow-sm'
                        : 'bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    {pres.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-neutral-100 mt-auto">
          <span className="font-extrabold text-sm sm:text-base text-neutral-900">{formatMoney(price)}</span>

          <div className="flex items-center gap-1.5">
            {isTequeno && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openProduct(product);
                }}
                className="text-[11px] font-bold text-[#C5161D] bg-[#FFF0F1] hover:bg-[#FFE2E4] px-2.5 py-1.5 rounded-lg transition-colors"
              >
                Elegir
              </button>
            )}

            <button
              type="button"
              onClick={handleAdd}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 shadow-sm active:scale-90 ${
                added ? 'bg-whatsapp text-white' : 'bg-brand-red hover:bg-brand-red-dark text-white'
              }`}
              aria-label={`Agregar ${product.name} al pedido`}
            >
              {added ? <Check className="w-4 h-4 stroke-[3]" /> : <Plus className="w-4 h-4 stroke-[2.8]" />}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
