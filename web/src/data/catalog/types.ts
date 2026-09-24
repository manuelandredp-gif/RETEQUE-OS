// ===================================================
// RETEQUEÑOS - TIPOS DE DATOS DEL CATALOGO
// ===================================================

export type ProductCategory =
  | 'tequenos'
  | 'pastelitos'
  | 'pizzas'
  | 'bebidas'
  | 'cremas'
  | 'promociones';

export interface ProductOption {
  id: string;
  label: string;
  price: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  subcategory?: 'clasicos' | 'especiales' | 'gaseosas' | 'artesanales' | 'calientes';
  description?: string;
  image: string;
  gallery?: string[];
  basePrice?: number;
  presentations?: ProductOption[];
  extras?: ProductOption[];
  ingredients?: string[];
  featured?: boolean;
}
