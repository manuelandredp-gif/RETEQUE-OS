import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { DRINKS, DrinkOption } from '../configuratorData';
import { formatMoney } from '../../../lib/money';

interface DrinksStepProps {
  isOpen: boolean;
  onToggle: () => void;
  selectedDrinkId: string;
  selectedDrink?: DrinkOption;
  onSelectDrink: (drinkId: string) => void;
}

export const DrinksStep: React.FC<DrinksStepProps> = ({
  isOpen,
  onToggle,
  selectedDrinkId,
  selectedDrink,
  onSelectDrink,
}) => {
  return (
    <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors cursor-pointer"
      >
        <div>
          <h3 className="font-black text-sm sm:text-base text-neutral-900">
            Elige el Sabor de tu Bebida
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">{selectedDrink?.name || 'Selecciona una bebida'}</p>
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
          {DRINKS.map((drink) => {
            const isSelected = selectedDrinkId === drink.id;
            return (
              <div
                key={drink.id}
                onClick={() => onSelectDrink(drink.id)}
                className="py-3 flex items-center justify-between gap-3 cursor-pointer hover:bg-neutral-50 px-2 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={drink.image}
                    alt={drink.name}
                    className="w-8 h-8 object-contain rounded"
                  />
                  <span className="font-bold text-xs sm:text-sm text-neutral-900">
                    {drink.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {drink.extraPrice > 0 && (
                    <span className="text-xs font-bold text-neutral-500">
                      +{formatMoney(drink.extraPrice)}
                    </span>
                  )}
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-[#C5161D] bg-[#C5161D]' : 'border-neutral-300'
                    }`}
                  >
                    {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
