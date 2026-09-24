import React from 'react';
import { ChevronUp, ChevronDown, Plus, Minus } from 'lucide-react';
import { CREAMS } from '../configuratorData';

interface CreamsStepProps {
  isOpen: boolean;
  onToggle: () => void;
  targetCreams: number;
  totalSelectedCreams: number;
  isCreamsCompleted: boolean;
  creamCounts: Record<string, number>;
  onCreamDelta: (creamId: string, delta: number) => void;
}

export const CreamsStep: React.FC<CreamsStepProps> = ({
  isOpen,
  onToggle,
  targetCreams,
  totalSelectedCreams,
  isCreamsCompleted,
  creamCounts,
  onCreamDelta,
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
            Elige tus Cremas de 2 oz
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            {totalSelectedCreams}/{targetCreams} cremas incluidas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`font-bold text-xs px-2.5 py-1 rounded ${
              isCreamsCompleted
                ? 'bg-[#E8F8EE] text-[#16B959]'
                : 'bg-[#FFF0F1] text-[#C5161D]'
            }`}
          >
            {isCreamsCompleted ? 'Completado' : `Faltan ${targetCreams - totalSelectedCreams}`}
          </span>
          {isOpen ? <ChevronUp className="w-5 h-5 text-neutral-400" /> : <ChevronDown className="w-5 h-5 text-neutral-400" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-4 pt-0 border-t border-neutral-100 divide-y divide-neutral-100">
          {CREAMS.map((cream) => {
            const count = creamCounts[cream.id] || 0;
            return (
              <div key={cream.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={cream.image}
                    alt={cream.name}
                    className="w-10 h-8 object-contain rounded"
                  />
                  <span className="font-bold text-xs sm:text-sm text-neutral-900">
                    {cream.name}
                  </span>
                </div>

                {count > 0 ? (
                  <div className="inline-flex items-center bg-neutral-100 rounded-lg p-0.5">
                    <button
                      type="button"
                      onClick={() => onCreamDelta(cream.id, -1)}
                      className="w-6 h-6 flex items-center justify-center bg-[#C5161D] text-white rounded font-bold hover:bg-[#A3001E]"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-7 text-center font-black text-neutral-900 text-xs">
                      {count}
                    </span>
                    <button
                      type="button"
                      onClick={() => onCreamDelta(cream.id, 1)}
                      disabled={totalSelectedCreams >= targetCreams}
                      className="w-6 h-6 flex items-center justify-center bg-[#C5161D] text-white rounded font-bold hover:bg-[#A3001E] disabled:opacity-40"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => onCreamDelta(cream.id, 1)}
                    disabled={totalSelectedCreams >= targetCreams}
                    className="w-7 h-7 rounded-lg border border-neutral-200 hover:border-[#C5161D] text-neutral-500 hover:text-[#C5161D] flex items-center justify-center disabled:opacity-30"
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
