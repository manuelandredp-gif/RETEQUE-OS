import React from 'react';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '../data/catalog';
import { ProductCard } from '../components/catalog/ProductCard';

export const CremasPage: React.FC = () => {
  const cremas = PRODUCTS.filter((p) => p.category === 'cremas');

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="text-xs text-neutral-400 flex items-center gap-1.5">
        <Link to="/" className="hover:text-neutral-700 transition-colors">
          Inicio
        </Link>
        <span>&gt;</span>
        <span className="text-neutral-700 font-semibold">Cremas especiales</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-brand-red tracking-tight">
            Cremas especiales
          </h1>
          <p className="text-sm font-semibold text-neutral-600 mt-0.5">
            Porciones individuales de 2 oz para acompañar tus tequeños y pastelitos
          </p>
        </div>

        <div className="hidden sm:block font-script text-brand-red text-2xl font-bold">
          Salsas hechas con amor ♡
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {cremas.map((prod) => (
          <ProductCard key={prod.id} product={prod} />
        ))}
      </div>
    </div>
  );
};
