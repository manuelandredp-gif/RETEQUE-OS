// ===================================================
// RETEQUEÑOS - DISTRITOS / ZONAS DE TACNA
// El costo del envío lo fija y cobra directamente el repartidor
// ===================================================

export interface TacnaZone {
  id: string;
  name: string;
  fee: number;
  timeEstimate: string;
}

export const TACNA_ZONES: TacnaZone[] = [
  { id: 'cercado', name: 'Cercado / Centro de Tacna', fee: 0, timeEstimate: '20-30 min' },
  { id: 'albarracin', name: 'Crnl. Gregorio Albarracín (Cono Sur)', fee: 0, timeEstimate: '30-40 min' },
  { id: 'pocollay', name: 'Pocollay', fee: 0, timeEstimate: '25-35 min' },
  { id: 'alto-alianza', name: 'Alto de la Alianza', fee: 0, timeEstimate: '30-35 min' },
  { id: 'ciudad-nueva', name: 'Ciudad Nueva', fee: 0, timeEstimate: '30-40 min' },
  { id: 'leguia', name: 'Leguía / Para Chico / Natividad', fee: 0, timeEstimate: '20-30 min' },
];

export const DEFAULT_TACNA_ZONE = TACNA_ZONES[0];
