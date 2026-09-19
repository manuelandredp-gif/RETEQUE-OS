import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuantityStepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

export const QuantityStepper: React.FC<QuantityStepperProps> = ({
  value,
  min = 1,
  max = 99,
  onChange,
  size = 'md',
}) => {
  const handleDecrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (value < max) {
      onChange(value + 1);
    }
  };

  const containerSizes = {
    sm: 'h-8 text-xs',
    md: 'h-10 text-sm',
    lg: 'h-12 text-base',
  };

  const btnSizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base',
  };

  return (
    <div className={`inline-flex items-center bg-[#F4F5F7] border border-[#E5E7EB] rounded-xl p-1 ${containerSizes[size]}`}>
      <button
        type="button"
        onClick={handleDecrease}
        disabled={value <= min}
        className={`flex items-center justify-center rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-white/80 active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all ${btnSizes[size]}`}
        aria-label="Disminuir cantidad"
      >
        <Minus className="w-4 h-4 stroke-[2.5]" />
      </button>

      <span className="w-8 text-center font-bold text-neutral-900 select-none">
        {value}
      </span>

      <button
        type="button"
        onClick={handleIncrease}
        disabled={value >= max}
        className={`flex items-center justify-center rounded-lg bg-brand-red text-white hover:bg-brand-red-dark active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm ${btnSizes[size]}`}
        aria-label="Aumentar cantidad"
      >
        <Plus className="w-4 h-4 stroke-[2.5]" />
      </button>
    </div>
  );
};
