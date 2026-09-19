import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '../data/catalog';
import { ProductCard } from '../components/catalog/ProductCard';

type Filter = 'todas' | 'gaseosas' | 'artesanales' | 'calientes';

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'todas', label: 'Todas' },
  { id: 'gaseosas', label: 'Gaseosas' },
  { id: 'artesanales', label: 'Artesanales' },
  { id: 'calientes', label: 'Calientes' },
];

export const BebidasPage: React.FC = () => {
  const [subfilter, setSubfilter] = useState<Filter>('todas');
  const bebidas = PRODUCTS.filter((p) => p.category === 'bebidas');

  const filtered = bebidas.filter((b) => subfilter === 'todas' || b.subcategory === subfilter);

  return (
    <div className="space-y-8">
      <nav className="text-xs text-neutral-400 flex items-center gap-1.5" aria-label="Ruta">
        <Link to="/" className="hover:text-neutral-700 transition-colors">
          Inicio
        </Link>
        <span aria-hidden="true">&gt;</span>
        <span className="text-neutral-700 font-semibold">Bebidas</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-brand-red tracking-tight">Bebidas</h1>
          <p className="text-sm font-semibold text-neutral-600 mt-0.5">
            Gaseosas, refrescos artesanales e infusiones · {filtered.length}{' '}
            {filtered.length === 1 ? 'opción' : 'opciones'}
          </p>

          <div className="flex items-center gap-2 mt-4 overflow-x-auto no-scrollbar py-1" role="tablist" aria-label="Filtrar bebidas">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={subfilter === f.id}
                onClick={() => setSubfilter(f.id)}
                className={`text-xs sm:text-sm font-bold px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  subfilter === f.id
                    ? 'bg-brand-red text-white shadow-sm'
                    : 'bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="hidden sm:block font-script text-brand-red text-2xl font-bold">Refrescante compañía ♡</div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-16 text-center text-neutral-500 text-sm">No hay bebidas en esta categoría por ahora.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {filtered.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}
    </div>
  );
};
