import React from 'react';
import { Bike, Percent, Users } from 'lucide-react';

export const BenefitsStrip: React.FC = () => {
  return (
    <div className="bg-[#FFF8ED] border-t border-b border-[#F7E7CE] py-4 mt-12">
      <div className="max-w-[1640px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 flex-1 max-w-4xl">
          {/* Benefit 1 */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#FFEAEB] flex items-center justify-center shrink-0 text-brand-red">
              <Bike className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-neutral-900">
                Delivery en Tacna
              </div>
              <div className="text-xs text-neutral-600">
                Tu antojo, más cerca de ti.
              </div>
            </div>
          </div>

          {/* Benefit 2 */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#FFEAEB] flex items-center justify-center shrink-0 text-brand-red">
              <Percent className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-neutral-900">
                Promociones exclusivas
              </div>
              <div className="text-xs text-neutral-600">
                Todos los días, nuevos antojos.
              </div>
            </div>
          </div>

          {/* Benefit 3 */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#FFEAEB] flex items-center justify-center shrink-0 text-brand-red">
              <Users className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-neutral-900">
                Ideal para compartir
              </div>
              <div className="text-xs text-neutral-600">
                La mejor comida sabe mejor en compañía.
              </div>
            </div>
          </div>
        </div>

        {/* Right slogan */}
        <div className="hidden xl:block">
          <span className="font-script text-brand-red text-2xl font-bold">
            Tacna sabe mejor con Retequeños ♡
          </span>
        </div>
      </div>
    </div>
  );
};
