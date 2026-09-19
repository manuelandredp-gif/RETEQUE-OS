import React, { useState } from 'react';
import { Flame, Sparkles, UtensilsCrossed, Pizza, Coffee, Cookie, Droplet } from 'lucide-react';
import { HeroBanner } from '../components/home/HeroBanner';
import { BenefitsStrip } from '../components/layout/BenefitsStrip';
import { ProductCard } from '../components/catalog/ProductCard';
import { PromotionCard } from '../components/catalog/PromotionCard';
import { PRODUCTS, Product } from '../data/catalog';
import { PROMOTIONS } from '../data/promotions';

type SectionId = 'todos' | 'promociones' | 'tequenos' | 'pizzas' | 'bebidas' | 'pastelitos' | 'cremas';

interface SectionMeta {
  id: Exclude<SectionId, 'todos'>;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  tag?: string;
}

const SECTIONS: SectionMeta[] = [
  {
    id: 'tequenos',
    title: 'Tequeños artesanales por porción',
    subtitle: 'Crujientes, dorados y rellenos al máximo. Disponibles en porciones de 10 y 20 unidades.',
    icon: Sparkles,
    tag: 'Porción de 10 o 20 unid.',
  },
  {
    id: 'pizzas',
    title: 'Pizzas familiares 35 cm',
    subtitle: 'Masa crocante artesanal, salsa pomodoro de la casa y queso mozarella.',
    icon: Pizza,
    tag: 'Tamaño familiar 35 cm',
  },
  {
    id: 'pastelitos',
    title: 'Pastelitos crujientes',
    subtitle: 'Masa hojaldrada dorada rellena de abundante queso derretido.',
    icon: Cookie,
  },
  {
    id: 'bebidas',
    title: 'Bebidas heladas',
    subtitle: 'Gaseosas bien heladas y chicha morada artesanal para acompañar tus tequeños.',
    icon: Coffee,
  },
  {
    id: 'cremas',
    title: 'Cremas y salsas artesanales (2 oz)',
    subtitle: 'El secreto de un buen tequeño: sumérgelos en nuestras salsas caseras.',
    icon: Droplet,
  },
];

const CATEGORY_TABS: { id: SectionId; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
  { id: 'todos', label: 'Todo el menú', icon: UtensilsCrossed },
  { id: 'promociones', label: 'Promociones y combos', icon: Flame, badge: 'Ahorro' },
  { id: 'tequenos', label: 'Tequeños', icon: Sparkles },
  { id: 'pizzas', label: 'Pizzas familiares 35 cm', icon: Pizza },
  { id: 'bebidas', label: 'Bebidas', icon: Coffee },
  { id: 'pastelitos', label: 'Pastelitos', icon: Cookie },
  { id: 'cremas', label: 'Cremas', icon: Droplet },
];

export const HomePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<SectionId>('todos');

  const productsByCategory = (category: Product['category']) =>
    PRODUCTS.filter((p) => p.category === category);

  const show = (id: SectionId) => selectedCategory === 'todos' || selectedCategory === id;

  return (
    <div className="space-y-8">
      <HeroBanner />

      {/* Filtro por categoría (se queda visible al hacer scroll, debajo del encabezado) */}
      <div className="sticky top-28 z-30 bg-[#F9FAFB]/95 backdrop-blur-md py-3 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 border-b border-neutral-200/80">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5" role="tablist" aria-label="Secciones de la carta">
          {CATEGORY_TABS.map((tab) => {
            const Icon = tab.icon;
            const isSelected = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedCategory(tab.id)}
                className={`flex items-center gap-2 text-xs sm:text-sm font-bold px-4 py-2.5 rounded-full whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#C5161D] text-white shadow-md shadow-[#C5161D]/20 scale-[1.02]'
                    : 'bg-white text-neutral-700 hover:text-neutral-900 border border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-[#C5161D]'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                      isSelected ? 'bg-white text-[#C5161D]' : 'bg-[#FFF0F1] text-[#C5161D]'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-12">
        {show('promociones') && (
          <section className="space-y-4" aria-labelledby="sec-promociones">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-[#FFF0F1] text-[#C5161D]">
                    <Flame className="w-5 h-5 fill-[#C5161D]" aria-hidden="true" />
                  </span>
                  <h2 id="sec-promociones" className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
                    Promociones y combos
                  </h2>
                </div>
                <p className="text-xs text-neutral-500 mt-1">
                  Combos completos para compartir. Elige tus sabores de tequeños, cremas y bebidas favoritas.
                </p>
              </div>
              <span className="hidden sm:inline-block text-xs font-bold text-[#C5161D] bg-[#FFF0F1] px-3 py-1.5 rounded-full shrink-0">
                {PROMOTIONS.length} promociones
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {PROMOTIONS.map((promo) => (
                <PromotionCard key={promo.id} promotion={promo} />
              ))}
            </div>
          </section>
        )}

        {SECTIONS.map((section) => {
          if (!show(section.id)) return null;
          const products = productsByCategory(section.id);
          if (products.length === 0) return null;
          const Icon = section.icon;
          return (
            <section key={section.id} className="space-y-4" aria-labelledby={`sec-${section.id}`}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-[#FFF0F1] text-[#C5161D]">
                      <Icon className="w-5 h-5" />
                    </span>
                    <h2 id={`sec-${section.id}`} className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
                      {section.title}
                    </h2>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">{section.subtitle}</p>
                </div>
                {section.tag && (
                  <span className="hidden sm:inline-block text-xs font-bold text-[#C5161D] bg-[#FFF0F1] px-3 py-1.5 rounded-full shrink-0">
                    {section.tag}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <BenefitsStrip />
    </div>
  );
};
