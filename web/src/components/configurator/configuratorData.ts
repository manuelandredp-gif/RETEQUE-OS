// ===================================================
// RETEQUEÑOS - DATOS DE CONFIGURADOR DE PRODUCTOS
// ===================================================

export interface FlavorOption {
  id: string;
  name: string;
  image: string;
}

export interface DrinkOption {
  id: string;
  name: string;
  extraPrice: number;
  image: string;
}

export interface UpgradeOption {
  id: string;
  name: string;
  price: number;
  image: string;
}

// Available flavors for tequeños
export const TEQUEÑO_FLAVORS: FlavorOption[] = [
  { id: 'queso', name: 'Tequeños de Queso', image: '/assets/products/tequenos/queso.jpg' },
  { id: 'jamon-queso', name: 'Tequeños Jamón y Queso', image: '/assets/products/tequenos/jamon-queso.jpg' },
  { id: 'tocino-queso', name: 'Tequeños Tocino y Queso', image: '/assets/products/tequenos/tocino-queso.jpg' },
  { id: 'hotdog-queso', name: 'Tequeños Hotdog y Queso', image: '/assets/products/tequenos/hotdog-queso.jpg' },
  { id: 'tres-quesos', name: 'Tequeños Tres Quesos', image: '/assets/products/tequenos/tres-quesos.jpg' },
  { id: 'aji-gallina', name: 'Ají de Gallina Criollo', image: '/assets/products/tequenos/aji-de-gallina.jpg' },
  { id: 'queso-cheddar', name: 'Queso Cheddar', image: '/assets/products/tequenos/queso-cheddar.jpg' },
];

// Available pizza flavors
export const PIZZA_FLAVORS: FlavorOption[] = [
  { id: 'americana', name: 'Americana (Jamón y Mozarella)', image: '/assets/products/pizzas/americana.jpg' },
  { id: 'peperoni', name: 'Full Peperoni (Mozarella y Peperoni)', image: '/assets/products/pizzas/full-peperoni.jpg' },
  { id: 'hawaiana', name: 'La Hawaiana (Jamón, Mozarella y Piña)', image: '/assets/products/pizzas/la-hawaiana.jpg' },
  { id: 'italiana', name: 'Italiana (Pollo, Jamón, Aceituna)', image: '/assets/products/pizzas/italiana.jpg' },
  { id: 'la-especial', name: 'La Especial (Tocino, Champiñones, Parmesano)', image: '/assets/products/pizzas/la-especial.jpg' },
  { id: 'super-margarita', name: 'Super Margarita (Tomate, Mozarella, Pimentón)', image: '/assets/products/pizzas/super-margarita.jpg' },
];

// Available creams
export const CREAMS: FlavorOption[] = [
  { id: 'mayonesa-ajo', name: 'Mayonesa de ajo (2 oz)', image: '/assets/products/cremas/mayonesa-ajo.jpg' },
  { id: 'salsa-tocino', name: 'Salsa tocino (2 oz)', image: '/assets/products/cremas/salsa-tocino.jpg' },
  { id: 'mayopalta', name: 'Mayopalta (2 oz)', image: '/assets/products/cremas/mayopalta.jpg' },
  { id: 'aji-especial', name: 'Ají especial (2 oz)', image: '/assets/products/cremas/aji-especial.jpg' },
];

// Available drinks
export const DRINKS: DrinkOption[] = [
  { id: 'inka-cola-600', name: 'Inka Cola 600 ml', extraPrice: 0, image: '/assets/products/bebidas/coca-cola-600ml.jpg' },
  { id: 'coca-cola-600', name: 'Coca-Cola 600 ml', extraPrice: 0, image: '/assets/products/bebidas/coca-cola-600ml.jpg' },
  { id: 'pepsi-1l', name: 'Pepsi 1 Litro', extraPrice: 2.00, image: '/assets/products/bebidas/coca-cola-600ml.jpg' },
  { id: 'chicha-morada', name: 'Chicha Morada Artesanal 1/2 L', extraPrice: 3.00, image: '/assets/products/bebidas/coca-cola-600ml.jpg' },
];

// Extra upgrades
export const UPGRADES: UpgradeOption[] = [
  { id: 'extra-10-queso', name: '10 Tequeños de Queso adicionales', price: 16.00, image: '/assets/products/tequenos/queso.jpg' },
  { id: 'extra-pastelito-queso', name: 'Pastelito de Queso crujiente', price: 3.50, image: '/assets/promos/antojo-criollo.jpg' },
  { id: 'extra-pastelito-jamon', name: 'Pastelito Jamón y Queso', price: 4.00, image: '/assets/promos/antojo-criollo.jpg' },
  { id: 'extra-crema-mayo', name: 'Crema Mayonesa de ajo extra 2 oz', price: 2.00, image: '/assets/products/cremas/mayonesa-ajo.jpg' },
  { id: 'extra-crema-tocino', name: 'Crema Salsa tocino extra 2 oz', price: 2.00, image: '/assets/products/cremas/salsa-tocino.jpg' },
  { id: 'extra-crema-palta', name: 'Crema Mayopalta extra 2 oz', price: 2.00, image: '/assets/products/cremas/mayopalta.jpg' },
  { id: 'extra-crema-aji', name: 'Crema Ají especial extra 2 oz', price: 2.00, image: '/assets/products/cremas/aji-especial.jpg' },
];
