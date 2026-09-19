import React from 'react';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '../data/catalog';
import { ProductCard } from '../components/catalog/ProductCard';

export const PastelitosPage: React.FC = () => {
  const pastelitos = PRODUCTS.filter((p) => p.category === 'pastelitos');

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="text-xs text-neutral-400 flex items-center gap-1.5">
        <Link to="/" className="hover:text-neutral-700 transition-colors">
          Inicio
        </Link>
        <span>&gt;</span>
        <span className="text-neutral-700 font-semibold">Pastelitos</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-brand-red tracking-tight">
            Pastelitos
          </h1>
          <p className="text-sm font-semibold text-neutral-600 mt-0.5">
            Masa hojaldrada crujiente rellena de los mejores ingredientes
          </p>
        </div>

        <div className="hidden sm:block font-script text-brand-red text-2xl font-bold">
          El toque crujiente del día ♡
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {pastelitos.map((prod) => (
          <ProductCard key={prod.id} product={prod} />
        ))}
      </div>
    </div>
  );
};
