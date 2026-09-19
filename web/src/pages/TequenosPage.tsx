import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import { PRODUCTS } from '../data/catalog';
import { ProductCard } from '../components/catalog/ProductCard';

export const TequenosPage: React.FC = () => {
  const [subfilter, setSubfilter] = useState<'todos' | 'clasicos' | 'especiales'>('todos');
  const [quantityFilter, setQuantityFilter] = useState<'10' | '20' | null>(null);

  const tequenos = PRODUCTS.filter((p) => p.category === 'tequenos');

  const clasicos = tequenos.filter((p) => p.subcategory === 'clasicos');
  const especiales = tequenos.filter((p) => p.subcategory === 'especiales');

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="text-xs text-neutral-400 flex items-center gap-1.5">
        <Link to="/" className="hover:text-neutral-700 transition-colors">
          Inicio
        </Link>
        <span>&gt;</span>
        <span className="text-neutral-700 font-semibold">Tequeños</span>
      </nav>

      {/* Header with Title & Quantity filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight">
            Tequeños
          </h1>
          <p className="font-script text-lg sm:text-xl text-neutral-600 mt-0.5">
            Con el sabor y la receta original de siempre ♡
          </p>

          {/* Subcategory Pills */}
          <div className="flex items-center gap-2 mt-4">
            <button
              type="button"
              onClick={() => setSubfilter('todos')}
              className={`text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                subfilter === 'todos'
                  ? 'bg-brand-red text-white shadow-sm'
                  : 'bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300'
              }`}
            >
              Todos
            </button>
            <button
              type="button"
              onClick={() => setSubfilter('clasicos')}
              className={`text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                subfilter === 'clasicos'
                  ? 'bg-brand-red text-white shadow-sm'
                  : 'bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300'
              }`}
            >
              Clásicos
            </button>
            <button
              type="button"
              onClick={() => setSubfilter('especiales')}
              className={`text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                subfilter === 'especiales'
                  ? 'bg-brand-red text-white shadow-sm'
                  : 'bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300'
              }`}
            >
              Especiales
            </button>
          </div>
        </div>

        {/* Filter by quantity pill card */}
        <div className="bg-[#FFF8ED] border border-[#F5E4CE] rounded-2xl p-3 sm:p-4 self-start md:self-auto flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-800">
            <SlidersHorizontal className="w-3.5 h-3.5 text-brand-red" />
            <span>Filtrar por cantidad</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setQuantityFilter(quantityFilter === '10' ? null : '10')}
              className={`text-xs font-bold px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
                quantityFilter === '10'
                  ? 'bg-brand-red text-white shadow-sm'
                  : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              10 unid.
            </button>
            <button
              type="button"
              onClick={() => setQuantityFilter(quantityFilter === '20' ? null : '20')}
              className={`text-xs font-bold px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
                quantityFilter === '20'
                  ? 'bg-brand-red text-white shadow-sm'
                  : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              20 unid.
            </button>
          </div>
        </div>
      </div>

      {/* Clásicos Section */}
      {(subfilter === 'todos' || subfilter === 'clasicos') && (
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-black text-brand-red">
              Clásicos
            </h2>
            <span className="font-script text-brand-red text-base sm:text-lg">
              Los sabores de siempre, que nunca fallan ♡
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {clasicos.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                forcedPresentation={quantityFilter || undefined}
              />
            ))}
          </div>
        </section>
      )}

      {/* Especiales Section */}
      {(subfilter === 'todos' || subfilter === 'especiales') && (
        <section className="space-y-4 pt-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-black text-brand-red">
              Especiales
            </h2>
            <span className="font-script text-brand-red text-base sm:text-lg">
              Sabores únicos para antojos más grandes ♡
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {especiales.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                forcedPresentation={quantityFilter || undefined}
              />
            ))}
          </div>
        </section>
      )}

      {/* Cremas Especiales Bottom Banner */}
      <div className="bg-[#FFF8ED] border border-[#F5E4CE] rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 mt-8">
        <div className="flex items-center gap-4">
          <img
            src="/assets/products/cremas/mayonesa-ajo.jpg"
            alt="Cremas"
            className="w-12 h-10 object-contain drop-shadow-sm rounded-lg"
          />
          <div>
            <h3 className="font-black text-brand-red text-base">
              Cremas especiales
            </h3>
            <p className="text-xs sm:text-sm text-neutral-700 mt-0.5">
              Mayonesa de ajo / Salsa tocino / Mayopalta / Ají especial —{' '}
              <span className="font-bold text-neutral-900">crema adicional 2 oz S/ 2.00</span>
            </p>
          </div>
        </div>

        <div className="font-script text-brand-red text-lg sm:text-xl font-bold shrink-0">
          La mejor compañía para tus tequeños ♡
        </div>
      </div>
    </div>
  );
};
