// ===================================================
// RETEQUEÑOS - CATALOGO MAESTRO UNIFICADO
// Arquitectura modular por dominios de categorías
// ===================================================

export * from './catalog/types';
export * from './catalog/cremas';
export * from './catalog/pizzas';
export * from './catalog/tequenos';
export * from './catalog/bebidas';
export * from './catalog/pastelitos';

import { Product } from './catalog/types';
import { TEQUENOS_PRODUCTS } from './catalog/tequenos';
import { PIZZAS_PRODUCTS } from './catalog/pizzas';
import { BEBIDAS_PRODUCTS } from './catalog/bebidas';
import { PASTELITOS_PRODUCTS } from './catalog/pastelitos';
import { CREMAS_PRODUCTS } from './catalog/cremas';

export const PRODUCTS: Product[] = [
  ...TEQUENOS_PRODUCTS,
  ...PIZZAS_PRODUCTS,
  ...BEBIDAS_PRODUCTS,
  ...PASTELITOS_PRODUCTS,
  ...CREMAS_PRODUCTS,
];
