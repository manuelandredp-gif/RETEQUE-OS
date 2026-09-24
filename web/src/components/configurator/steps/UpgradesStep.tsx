import React from 'react';
import { ChevronUp, ChevronDown, Plus } from 'lucide-react';
import { UPGRADES } from '../configuratorData';
import { formatMoney } from '../../../lib/money';

interface UpgradesStepProps {
  isOpen: boolean;
  onToggle: () => void;
  upgradeCounts: Record<string, number>;
  onUpgradeDelta: (upgradeId: string, delta: number) => void;
}

export const UpgradesStep: React.FC<UpgradesStepProps> = ({
  isOpen,
  onToggle,
  upgradeCounts,
  onUpgradeDelta,
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
            Adicionales y Cremas Extra
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">Elige porciones adicionales</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="border border-neutral-300 text-neutral-700 font-bold text-xs px-2.5 py-1 rounded">
            Opcional
          </span>
          {isOpen ? <ChevronUp className="w-5 h-5 text-neutral-400" /> : <ChevronDown className="w-5 h-5 text-neutral-400" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-4 pt-0 border-t border-neutral-100 divide-y divide-neutral-100 max-h-72 overflow-y-auto">
          {UPGRADES.map((upgrade) => {
            const count = upgradeCounts[upgrade.id] || 0;
            return (
              <div key={upgrade.id} className="py-2.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={upgrade.image}
                    alt={upgrade.name}
                    className="w-9 h-7 object-cover rounded shrink-0 border border-neutral-100"
                  />
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-neutral-900 truncate">
                      {upgrade.name}
                    </div>
                    <div className="text-[11px] font-bold text-neutral-500">
                      +{formatMoney(upgrade.price)}
                    </div>
                  </div>
                </div>

                {count > 0 ? (
                  <div className="inline-flex items-center bg-neutral-100 rounded-lg p-0.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => onUpgradeDelta(upgrade.id, -1)}
                      className="w-5 h-5 flex items-center justify-center bg-[#C5161D] text-white rounded font-bold"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-bold text-neutral-900 text-xs">
                      {count}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpgradeDelta(upgrade.id, 1)}
                      className="w-5 h-5 flex items-center justify-center bg-[#C5161D] text-white rounded font-bold"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => onUpgradeDelta(upgrade.id, 1)}
                    className="w-6 h-6 bg-[#C5161D] hover:bg-[#A3001E] text-white rounded-lg flex items-center justify-center transition-all cursor-pointer shrink-0"
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
