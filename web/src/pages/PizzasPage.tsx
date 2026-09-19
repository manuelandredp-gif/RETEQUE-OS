import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '../data/catalog';
import { ProductCard } from '../components/catalog/ProductCard';

export const PizzasPage: React.FC = () => {
  const [subfilter, setSubfilter] = useState<'todas' | 'clasicas' | 'especiales'>('todas');

  const pizzas = PRODUCTS.filter((p) => p.category === 'pizzas');

  const filteredPizzas = pizzas.filter((p) => {
    if (subfilter === 'clasicas') return p.subcategory === 'clasicos';
    if (subfilter === 'especiales') return p.subcategory === 'especiales';
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="text-xs text-neutral-400 flex items-center gap-1.5">
        <Link to="/" className="hover:text-neutral-700 transition-colors">
          Inicio
        </Link>
        <span>&gt;</span>
        <span className="text-neutral-700 font-semibold">Pizzas</span>
      </nav>

      {/* Header with Title & Slogan */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-brand-red tracking-tight">
            Pizzas
          </h1>
          <p className="text-sm font-bold text-neutral-700 mt-0.5">
            Familiar 35 cm
          </p>

          {/* Subfilter Pills */}
          <div className="flex items-center gap-2 mt-4">
            <button
              type="button"
              onClick={() => setSubfilter('todas')}
              className={`text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                subfilter === 'todas'
                  ? 'bg-brand-red text-white shadow-sm'
                  : 'bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300'
              }`}
            >
              Todas
            </button>
            <button
              type="button"
              onClick={() => setSubfilter('clasicas')}
              className={`text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                subfilter === 'clasicas'
                  ? 'bg-brand-red text-white shadow-sm'
                  : 'bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300'
              }`}
            >
              Clásicas
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

        {/* Right slogan */}
        <div className="hidden sm:block">
          <span className="font-script text-brand-red text-2xl sm:text-3xl font-bold">
            Pizzas que unen momentos ♡
          </span>
        </div>
      </div>

      {/* Pizzas Grid (5 columns on desktop, exactly like Image 3) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredPizzas.map((pizza) => (
          <ProductCard key={pizza.id} product={pizza} />
        ))}
      </div>

      {/* Adicionales Banner */}
      <div className="bg-[#FFF8ED] border border-[#F5E4CE] rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-6 mt-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-brand-red">
              Adicionales
            </h3>
            <span className="inline-block bg-[#FDE8CC] text-brand-red font-black text-xs px-3 py-1 rounded-full mt-1">
              S/ 3.00
            </span>
          </div>
          <div className="text-xs sm:text-sm text-neutral-700 leading-relaxed max-w-md">
            Maíz / Champiñones / Jamón / Queso parmesano / Tocino / Aceituna verde
          </div>
        </div>

        <div className="flex items-center gap-4">
          <img
            src="/assets/products/pizzas/adicionales.jpg"
            alt="Ingredientes adicionales"
            className="h-16 sm:h-20 w-auto rounded-xl object-contain drop-shadow-sm"
          />
          <div className="font-script text-brand-red text-xl sm:text-2xl font-bold">
            Haz tu pizza a tu gusto ♡
          </div>
        </div>
      </div>
    </div>
  );
};
