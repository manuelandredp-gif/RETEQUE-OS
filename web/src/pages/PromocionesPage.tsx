import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PROMOTIONS, PromotionCategory } from '../data/promotions';
import { PromotionCard } from '../components/catalog/PromotionCard';

type Filter = 'todos' | PromotionCategory;

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'todos', label: 'Todas' },
  { id: 'tequenos', label: 'Tequeños' },
  { id: 'pizza-tequenos', label: 'Pizza + Tequeños' },
  { id: 'familiares', label: 'Familiares' },
];

export const PromocionesPage: React.FC = () => {
  const [filter, setFilter] = useState<Filter>('todos');

  const filteredPromos = PROMOTIONS.filter((promo) => filter === 'todos' || promo.category === filter);

  return (
    <div className="space-y-8">
      <nav className="text-xs text-neutral-400 flex items-center gap-1.5" aria-label="Ruta">
        <Link to="/" className="hover:text-neutral-700 transition-colors">
          Inicio
        </Link>
        <span aria-hidden="true">&gt;</span>
        <span className="text-neutral-700 font-semibold">Promociones</span>
      </nav>

      <div>
        <h1 className="text-3xl sm:text-4xl font-black text-brand-red tracking-tight">Promociones</h1>
        <p className="text-sm font-semibold text-neutral-600 mt-0.5">
          Elige tu antojo · {filteredPromos.length} {filteredPromos.length === 1 ? 'promoción' : 'promociones'}
        </p>

        <div className="flex items-center gap-2 mt-4 overflow-x-auto no-scrollbar py-1" role="tablist" aria-label="Filtrar promociones">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={`text-xs sm:text-sm font-bold px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                filter === f.id
                  ? 'bg-brand-red text-white shadow-sm'
                  : 'bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filteredPromos.length === 0 ? (
        <div className="py-16 text-center text-neutral-500 text-sm">
          No hay promociones en esta categoría por ahora.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {filteredPromos.map((promo) => (
            <PromotionCard key={promo.id} promotion={promo} />
          ))}
        </div>
      )}
    </div>
  );
};
