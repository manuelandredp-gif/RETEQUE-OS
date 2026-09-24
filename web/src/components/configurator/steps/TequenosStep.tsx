import React from 'react';
import { ChevronUp, ChevronDown, Sparkles, Plus, Minus } from 'lucide-react';
import { TEQUEÑO_FLAVORS } from '../configuratorData';

interface TequenosStepProps {
  isOpen: boolean;
  onToggle: () => void;
  targetTequeños: number;
  totalSelectedTequeños: number;
  isFlavorsCompleted: boolean;
  flavorCounts: Record<string, number>;
  onFlavorDelta: (flavorId: string, delta: number) => void;
}

export const TequenosStep: React.FC<TequenosStepProps> = ({
  isOpen,
  onToggle,
  targetTequeños,
  totalSelectedTequeños,
  isFlavorsCompleted,
  flavorCounts,
  onFlavorDelta,
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
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-black text-sm sm:text-base text-neutral-900">
              Elige los Sabores de tus Tequeños
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              {totalSelectedTequeños}/{targetTequeños} unidades seleccionadas
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`font-bold text-xs px-2.5 py-1 rounded ${
              isFlavorsCompleted
                ? 'bg-[#E8F8EE] text-[#16B959]'
                : 'bg-[#FFF0F1] text-[#C5161D]'
            }`}
          >
            {isFlavorsCompleted ? 'Completado' : `Faltan ${targetTequeños - totalSelectedTequeños}`}
          </span>
          {isOpen ? <ChevronUp className="w-5 h-5 text-neutral-400" /> : <ChevronDown className="w-5 h-5 text-neutral-400" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-4 pt-0 border-t border-neutral-100 divide-y divide-neutral-100">
          {TEQUEÑO_FLAVORS.map((flavor) => {
            const count = flavorCounts[flavor.id] || 0;
            return (
              <div key={flavor.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={flavor.image}
                    alt={flavor.name}
                    className="w-12 h-9 object-cover rounded-lg border border-neutral-200"
                  />
                  <span className="font-bold text-xs sm:text-sm text-neutral-900">
                    {flavor.name}
                  </span>
                </div>

                {count > 0 ? (
                  <div className="inline-flex items-center bg-neutral-100 rounded-lg p-0.5">
                    <button
                      type="button"
                      onClick={() => onFlavorDelta(flavor.id, -1)}
                      className="w-6 h-6 flex items-center justify-center bg-[#C5161D] text-white rounded font-bold hover:bg-[#A3001E] transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-7 text-center font-black text-neutral-900 text-xs">
                      {count}
                    </span>
                    <button
                      type="button"
                      onClick={() => onFlavorDelta(flavor.id, 1)}
                      disabled={totalSelectedTequeños >= targetTequeños}
                      className="w-6 h-6 flex items-center justify-center bg-[#C5161D] text-white rounded font-bold hover:bg-[#A3001E] disabled:opacity-40 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => onFlavorDelta(flavor.id, 1)}
                    disabled={totalSelectedTequeños >= targetTequeños}
                    className="w-7 h-7 rounded-lg border border-neutral-200 hover:border-[#C5161D] text-neutral-500 hover:text-[#C5161D] flex items-center justify-center disabled:opacity-30 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
