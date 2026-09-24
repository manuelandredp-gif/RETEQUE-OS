import React from 'react';
import { ChevronUp, ChevronDown, Pizza as PizzaIcon } from 'lucide-react';
import { PIZZA_FLAVORS } from '../configuratorData';

interface PizzaStepProps {
  isOpen: boolean;
  onToggle: () => void;
  targetPizzasCount: number;
  pizzasSummaryText: string;
  selectedPizzaFlavors: string[];
  onSelectFlavor: (flavorId: string, slotIndex: number) => void;
}

export const PizzaStep: React.FC<PizzaStepProps> = ({
  isOpen,
  onToggle,
  targetPizzasCount,
  pizzasSummaryText,
  selectedPizzaFlavors,
  onSelectFlavor,
}) => {
  return (
    <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#FFF0F1] flex items-center justify-center text-[#C5161D]">
            <PizzaIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-black text-sm sm:text-base text-neutral-900">
              {targetPizzasCount === 2 ? 'Elige los Sabores de tus 2 Pizzas' : 'Elige el Sabor de tu Pizza Familiar (35 cm)'}
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              {pizzasSummaryText}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-[#E8F8EE] text-[#16B959] font-bold text-xs px-2.5 py-1 rounded">
            Completado
          </span>
          {isOpen ? <ChevronUp className="w-5 h-5 text-neutral-400" /> : <ChevronDown className="w-5 h-5 text-neutral-400" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-4 pt-0 border-t border-neutral-100 divide-y divide-neutral-100">
          {Array.from({ length: targetPizzasCount }).map((_, slotIdx) => (
            <div key={slotIdx} className="py-3 space-y-2">
              <div className="text-xs font-bold text-neutral-700">
                {targetPizzasCount === 2 ? `Sabor para Pizza #${slotIdx + 1}:` : 'Sabor de Pizza:'}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PIZZA_FLAVORS.map((flavor) => {
                  const isSelected = selectedPizzaFlavors[slotIdx] === flavor.id;
                  return (
                    <button
                      key={flavor.id}
                      type="button"
                      onClick={() => onSelectFlavor(flavor.id, slotIdx)}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#C5161D] bg-[#FFF0F1] text-neutral-900 shadow-sm'
                          : 'border-neutral-200 hover:border-neutral-300 text-neutral-700 bg-white'
                      }`}
                    >
                      <img
                        src={flavor.image}
                        alt={flavor.name}
                        className="w-10 h-10 object-cover rounded-lg shrink-0 border border-neutral-200"
                        loading="lazy"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-xs leading-tight truncate">
                          {flavor.name}
                        </div>
                        <div className="text-[10px] text-neutral-500 mt-0.5">35 cm familiar</div>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-[#C5161D] bg-[#C5161D]' : 'border-neutral-300'
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
