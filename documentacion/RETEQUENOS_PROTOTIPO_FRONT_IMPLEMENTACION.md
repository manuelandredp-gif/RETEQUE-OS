# RETEQUEÑOS — Especificación maestra del prototipo web y base de implementación

> **Objetivo:** construir un prototipo web real, navegable y reutilizable que reproduzca con alta fidelidad las imágenes finales de diseño de Retequeños y que, sin rehacerlo desde cero, pueda evolucionar después al frontend definitivo.
>
> **Stack acordado:** React + Vite + Tailwind CSS + Zustand + React Router + Lucide Icons.
>
> **Canal de cierre de pedido:** WhatsApp. **No existe pasarela de pago integrada en esta etapa.**

---

## 1. Regla principal de este proyecto

Este prototipo **NO debe construirse como una imagen estática ni como un screenshot pegado al fondo**.

Debe reconstruirse con componentes reales de React:

- header real;
- navegación real;
- cards reales;
- filtros reales;
- botones reales;
- selectores reales;
- carrito real;
- formularios reales;
- estado real del carrito;
- generación real del mensaje para WhatsApp.

Las imágenes entregadas son la **referencia visual exacta** que se debe reproducir, pero la interfaz debe quedar editable y reutilizable.

### Jerarquía de fuentes

Si existe alguna diferencia entre las fuentes, respetar este orden:

1. **CARTA 2026.pdf** → fuente de verdad para nombres, cantidades, precios y composición de los productos/promociones.
2. **Imágenes finales de diseño** → fuente de verdad para apariencia, composición visual, jerarquía, layout, color, espaciado y estilo.
3. **Este archivo .md** → fuente de verdad para arquitectura, comportamiento, rutas, componentes y reglas técnicas.

**Nunca corregir precios o promociones basándose únicamente en texto generado dentro de una imagen. La carta oficial prevalece.**

---

## 2. Imágenes finales que deben usarse como referencia visual

Trabajar con estas pantallas como referencias independientes. No hacer una composición de varias pantallas en una sola vista.

### 2.1. Página principal / landing + catálogo

Archivo de referencia esperado:

`página_de_retequeños_sabor_que_alegra.png`

Debe corresponder a la ruta:

`/`

### 2.2. Categoría Tequeños

Archivo de referencia esperado:

`menú_de_tequeños_retequeños_en_tacna.png`

Ruta:

`/tequenos`

### 2.3. Categoría Pizzas

Archivo de referencia esperado:

`menú_de_pizzas_retequeños.png`

Ruta:

`/pizzas`

### 2.4. Promociones

Archivo de referencia esperado:

`página_de_promociones_gastronómicas_de_retequeños.png`

Ruta:

`/promociones`

### 2.5. Detalle de Tequeños de Queso

Archivo de referencia esperado:

`página_de_tequeños_de_queso.png`

Ruta:

`/producto/tequenos-de-queso`

### 2.6. Carrito + datos + envío a WhatsApp

Archivo de referencia esperado:

`checkout_de_retequeños_en_tacna.png`

Ruta:

`/carrito`

> Si los archivos se entregan con otro nombre, identificarlos visualmente por su contenido y mapearlos a estas rutas.

---

## 3. Principio de implementación

El prototipo debe quedar preparado para que después se pueda:

- cambiar colores globales;
- cambiar textos;
- actualizar precios;
- agregar o quitar productos;
- cambiar fotografías;
- crear nuevas categorías;
- modificar promociones;
- cambiar el número de WhatsApp;
- conectar productos a una base de datos;
- conectar un panel administrativo;
- conectar Supabase u otro backend;
- conectar la operación de WhatsApp con n8n;
- cambiar el diseño sin rehacer la lógica del carrito.

Por eso:

- no duplicar componentes;
- no escribir productos directamente dentro del JSX de las páginas;
- no repetir colores manualmente en cada componente;
- no guardar precios como textos formateados;
- no generar el mensaje de WhatsApp desde una card individual;
- centralizar datos y configuración.

---

# 4. Stack técnico

## Frontend

- **React 19**
- **Vite**
- **Tailwind CSS**
- **React Router DOM**
- **Zustand**
- **Lucide React**

## Recomendado

- TypeScript si el proyecto se inicia desde cero.
- Si Antigravity genera inicialmente JavaScript/JSX, conservar la misma arquitectura; no bloquear el prototipo por una migración prematura.

## Deploy del prototipo

Preferencia:

- Vercel

Alternativas:

- Netlify
- Cloudflare Pages

## Backend

Para el prototipo inicial:

**No es obligatorio.**

Los datos pueden vivir en:

`src/data/catalog.ts`

Después se podrá cambiar esa capa por Supabase/API sin modificar la UI.

---

# 5. Estructura recomendada del proyecto

```text
retequenos-web/
├── public/
│   └── assets/
│       ├── brand/
│       │   ├── logo-retequenos.svg
│       │   └── logo-retequenos-white.svg
│       ├── hero/
│       ├── products/
│       │   ├── tequenos/
│       │   ├── pizzas/
│       │   ├── pastelitos/
│       │   ├── bebidas/
│       │   └── cremas/
│       ├── promos/
│       └── references/
│
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   └── router.tsx
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── CategoryNav.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── PageContainer.tsx
│   │   │
│   │   ├── home/
│   │   │   ├── HeroBanner.tsx
│   │   │   ├── FeaturedCatalog.tsx
│   │   │   ├── PromotionsPreview.tsx
│   │   │   └── BenefitsStrip.tsx
│   │   │
│   │   ├── catalog/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── CategoryFilters.tsx
│   │   │   ├── PresentationSelector.tsx
│   │   │   └── AddButton.tsx
│   │   │
│   │   ├── product/
│   │   │   ├── ProductGallery.tsx
│   │   │   ├── ProductOptionGroup.tsx
│   │   │   ├── CreamSelector.tsx
│   │   │   ├── QuantityStepper.tsx
│   │   │   └── ProductActions.tsx
│   │   │
│   │   ├── cart/
│   │   │   ├── CartItem.tsx
│   │   │   ├── CartList.tsx
│   │   │   ├── CheckoutStepper.tsx
│   │   │   ├── CustomerForm.tsx
│   │   │   ├── DeliverySelector.tsx
│   │   │   └── OrderSummary.tsx
│   │   │
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Badge.tsx
│   │       ├── Card.tsx
│   │       ├── Input.tsx
│   │       ├── Textarea.tsx
│   │       ├── RadioCard.tsx
│   │       └── Modal.tsx
│   │
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── TequenosPage.tsx
│   │   ├── PizzasPage.tsx
│   │   ├── PromocionesPage.tsx
│   │   ├── ProductDetailPage.tsx
│   │   └── CartPage.tsx
│   │
│   ├── data/
│   │   ├── catalog.ts
│   │   ├── promotions.ts
│   │   └── categories.ts
│   │
│   ├── store/
│   │   ├── cartStore.ts
│   │   └── checkoutStore.ts
│   │
│   ├── config/
│   │   ├── site.ts
│   │   └── theme.ts
│   │
│   ├── lib/
│   │   ├── money.ts
│   │   ├── whatsapp.ts
│   │   └── cart.ts
│   │
│   ├── styles/
│   │   └── globals.css
│   │
│   └── main.tsx
│
├── tailwind.config.ts
├── vite.config.ts
└── package.json
```

---

# 6. Rutas

```text
/                              Página principal + catálogo destacado
/tequenos                      Categoría Tequeños
/pizzas                        Categoría Pizzas
/promociones                   Promociones
/producto/tequenos-de-queso    Detalle de Tequeños de Queso
/carrito                       Carrito + datos + WhatsApp
```

Las categorías `Pastelitos`, `Bebidas` y `Cremas` pueden inicialmente funcionar como:

- filtros desde la home; o
- rutas preparadas para futuras páginas.

No crear pantallas visuales nuevas que contradigan los diseños aprobados sin requerimiento adicional.

---

# 7. Sistema visual

## 7.1. Colores

Definir los colores como tokens para que puedan modificarse globalmente.

Valores de inicio aproximados, a ajustar visualmente contra las imágenes:

```css
:root {
  --brand-red: #e9152b;
  --brand-red-dark: #c80f22;
  --brand-yellow: #f7bd21;
  --brand-orange: #f47b20;
  --brand-cream: #fff8ed;
  --brand-cream-2: #fff1d6;
  --brand-white: #ffffff;
  --text-main: #151820;
  --text-muted: #667085;
  --line: #e8e8e8;
  --whatsapp: #16b959;
}
```

No distribuir hexadecimales arbitrarios por los componentes.

## 7.2. Tailwind

Extender el theme de Tailwind con nombres semánticos:

```text
brand-red
brand-red-dark
brand-yellow
brand-orange
brand-cream
brand-cream-2
whatsapp
```

## 7.3. Bordes y radios

Estética general:

- cards: `rounded-xl` / `rounded-2xl`;
- botones grandes: `rounded-xl`;
- chips: `rounded-full`;
- inputs: `rounded-xl`;
- imágenes de cards: redondeo superior consistente.

No exagerar el glassmorphism.

## 7.4. Sombras

Sombras suaves y discretas:

```text
shadow-sm
shadow-md solo para bloques principales
```

No utilizar sombras negras intensas.

## 7.5. Tipografía

La interfaz debe usar una sans legible y moderna.

Opciones:

- Inter
- Manrope
- Nunito Sans

El logotipo y frases manuscritas deben preferentemente usar **assets del branding** o una fuente equivalente autorizada.

No sustituir el logo por texto genérico si se proporciona el logo real.

---

# 8. Layout general

Las imágenes de diseño fueron generadas en formato aproximado **1672 × 941 (16:9)**.

Esto sirve como viewport de control visual, pero la implementación **no debe estar hardcodeada a 1672 px**.

## Contenedor

Recomendación:

```text
max-width: 1600–1640 px
margin: auto
padding horizontal: 24–36 px
```

Para 1440 px debe conservarse la misma jerarquía.

## Breakpoints web

Aunque no se diseñó una “app”, la web sí debe ser responsive:

- `>= 1536`: composición amplia de referencia;
- `1280–1535`: reducir gaps y número de columnas;
- `1024–1279`: 3–4 columnas según sección;
- `768–1023`: tablet web;
- `< 768`: web móvil responsive, sin apariencia de app nativa.

El prototipo visual de aprobación inicial se valida primero en desktop.

---

# 9. Header global

El header debe ser un componente único compartido por todas las páginas.

Debe contener:

1. Logo Retequeños.
2. Frase de marca opcional `¡Expertos en tequeños!`.
3. Buscador.
4. Selector de ubicación `Tacna, Perú`.
5. Acceso `Iniciar sesión / Mi cuenta`.
6. Carrito con contador y total.
7. CTA verde `Pedir por WhatsApp`.

## Buscador

En prototipo debe filtrar productos por nombre.

No es necesario conectar búsqueda al servidor.

## Carrito del header

Debe mostrar:

- cantidad total de líneas/unidades según la decisión de UX;
- monto total del carrito;
- click → `/carrito`.

No abrir un drawer si la imagen de esa pantalla no lo muestra.

---

# 10. Navegación por categorías

Orden exacto:

```text
Todo
Promociones
Tequeños
Pastelitos
Pizzas
Bebidas
Cremas
```

Estado activo:

- texto e icono en rojo;
- subrayado rojo;
- el resto neutro.

La categoría no debe perder el estado al navegar.

---

# 11. HOME — `/`

Referencia visual:

`página_de_retequeños_sabor_que_alegra.png`

## 11.1. Hero

Debe reproducir:

- fondo predominantemente rojo;
- fotografía grande de tequeños;
- alto contraste;
- headline promocional;
- texto de marca;
- CTA amarillo `Ver promociones`;
- composición gastronómica cálida.

Copy base:

```text
TEQUEÑOS
QUE ALEGRAN EL DÍA

Con el sabor y la receta original de siempre
```

El CTA navega a:

`/promociones`

## 11.2. Sección `Nuestra carta`

Cards destacadas de la home:

- Tequeños de Queso
- Tequeños Jamón y Queso
- Tequeños Tocino y Queso
- Tequeños Hotdog y Queso
- Tequeños Tres Quesos
- Pizza Americana
- Pizza Italiana
- Coca Cola 600 ml

Los tequeños deben permitir seleccionar `10 unid.` o `20 unid.` antes de agregar.

## 11.3. Promociones destacadas

En la home solo se muestran tres promos destacadas:

- Promo Solo para mí — S/ 19.90
- Promo Extra — S/ 32.90
- Promo Familiar — S/ 63.90

**La composición real de cada promo debe obtenerse del dataset oficial, no del texto decorativo de la imagen.**

---

# 12. CATEGORÍA TEQUEÑOS — `/tequenos`

Referencia:

`menú_de_tequeños_retequeños_en_tacna.png`

## Título

```text
Tequeños
Con el sabor y la receta original de siempre
```

## Filtros visuales

```text
Todos
Clásicos
Especiales
```

Filtro por cantidad:

```text
10 unid.
20 unid.
```

## Clásicos

| Producto | 10 unid. | 20 unid. |
|---|---:|---:|
| Queso | S/ 16.00 | S/ 27.00 |
| Jamón y Queso | S/ 16.00 | S/ 28.00 |
| Tocino y Queso | S/ 17.00 | S/ 29.00 |
| Hotdog y Queso | S/ 16.00 | S/ 28.00 |
| Tres Quesos | S/ 17.00 | S/ 28.00 |

## Especiales mostrados en el diseño

| Producto | 10 unid. | 20 unid. |
|---|---:|---:|
| Ají de Gallina | S/ 17.00 | S/ 29.00 |
| Chocolate | S/ 17.00 | S/ 31.00 |
| Queso Cheddar | S/ 18.00 | S/ 34.00 |
| Jamón y Cheddar | S/ 19.00 | S/ 36.00 |

## Cremas especiales

Mostrar una franja inferior:

```text
Cremas especiales
Mayonesa de ajo / Salsa tocino / Mayopalta / Ají especial
Crema adicional 2 oz: S/ 2.00
```

---

# 13. CATEGORÍA PIZZAS — `/pizzas`

Referencia:

`menú_de_pizzas_retequeños.png`

Título:

```text
Pizzas
Familiar 35 cm
```

## Pizzas

| Pizza | Ingredientes | Precio |
|---|---|---:|
| Americana | Salsa de tomate, Mozarella, Jamón | S/ 35.00 |
| Italiana | Salsa de tomate, Mozarella, Jamón, Aceituna negra, Pollo, Pimentón | S/ 38.00 |
| Super Margarita | Salsa de tomate, Mozarella, Jamón, Pimentón, Aceituna verde | S/ 36.00 |
| La Hawaiana | Salsa de tomate, Mozarella, Jamón, Piña | S/ 37.00 |
| Full Peperoni | Salsa de tomate, Mozarella, Peperoni, Jamón | S/ 38.00 |
| La Especial | Salsa de tomate, Mozarella, Pimentón, Tocino ahumado, Champiñones, Queso parmesano | S/ 39.00 |
| Española | Salsa de tomate, Mozarella, Chorizo, Pimentón, Aceituna verde | S/ 38.00 |
| Vegetariana | Salsa de tomate, Mozarella, Aceituna verde y negra, Pimentón, Champiñón | S/ 36.00 |
| Oriental | Salsa de tomate, Mozarella, Piña, Pollo | S/ 37.00 |
| Primavera | Salsa de tomate, Mozarella, Jamón, Maíz | S/ 35.00 |
| Margarita | Salsa de tomate, Mozarella, Tomate, Aceite de oliva | S/ 34.00 |

## Adicionales

```text
S/ 3.00
Maíz / Champiñones / Jamón / Queso parmesano / Tocino / Aceituna verde
```

No inventar tamaños distintos de 35 cm en esta versión.

---

# 14. PROMOCIONES — `/promociones`

Referencia:

`página_de_promociones_gastronómicas_de_retequeños.png`

Filtros:

```text
Todos
Tequeños
Pizza + Tequeños
Familiares
```

## Datos oficiales

### Antojo Criollo — S/ 19.90

```text
10 mini empanaditas de ají de gallina, lomo saltado y queso
1 Coca Cola 600 ml
2 cremas
```

### Sazón & Antojo — S/ 47.90

```text
20 mini tequeños de queso
20 mini empanaditas de ají de gallina, lomo saltado y queso
1 Pepsi 1L
4 cremas
```

### Promo Solo para mí — S/ 19.90

```text
10 tequeños de queso
2 cremas
1 gaseosa 1/2 L
```

### Promo Extra — S/ 32.90

```text
20 tequeños
2 sabores
2 cremas
1 gaseosa 1/2 L
```

### Promo Dúo — S/ 35.90

```text
20 tequeños
2 sabores
2 cremas
2 gaseosas 1/2 L
```

### Promo Familiar — S/ 63.90

```text
40 tequeños
4 sabores
4 cremas
1 gaseosa 2L
```

### Promo Tequepizza — S/ 43.90

```text
1 pizza familiar 35 cm
5 tequeños de queso
1 gaseosa 1L
```

### Bocaditos de Felicidad — S/ 36.90

```text
20 mini tequeños de queso
20 mini empanaditas (carne, pollo y queso/jamón)
3 cremas
```

### Fiesta de Sabor — S/ 43.90

```text
20 tequeños de queso
20 mini empanaditas (carne, pollo y queso/jamón)
3 cremas
```

### Mundo de Sabores — S/ 51.90

```text
1 pizza familiar (elige sabor)
20 mini tequeños de queso
1 Pepsi 1L
2 cremas
```

### Sabor Sin Límites — S/ 54.90

```text
1 pizza familiar (elige sabor)
20 mini empanaditas mixtas (carne, pollo, jamón/queso)
1 Pepsi 1L
3 cremas
```

### La Doble Tentación — S/ 53.90

```text
1 pizza Hawaiana familiar
20 tequeños de jamón y queso
2 cremas
```

### Doble Placer — S/ 64.90

```text
2 pizzas familiares (elige sabor)
1 Pepsi 1L
2 cremas
```

Cada card de promoción debe tener:

- imagen;
- badge `Promo`;
- título;
- resumen del contenido;
- precio;
- botón `+`.

---

# 15. BEBIDAS

Datos de la carta:

| Producto | Precio |
|---|---:|
| Coca Cola 600 ml | S/ 5.00 |
| Inka Cola 600 ml | S/ 5.00 |
| Pepsi 1L | S/ 6.00 |
| Pepsi 2L | S/ 8.00 |
| Chicha morada 1/2 litro | S/ 8.00 |
| Chicha morada 1 litro | S/ 15.00 |
| Limonada 1/2 litro | S/ 8.00 |
| Limonada 1 litro | S/ 15.00 |
| Agua | S/ 4.50 |
| Infusiones | S/ 3.50 |

Estas entradas deben quedar en `catalog.ts`, aunque no todas aparezcan en la home.

---

# 16. PASTELITOS

Datos de la carta:

| Pastelito | 1 unid. |
|---|---:|
| Queso | S/ 3.50 |
| Jamón y Queso | S/ 4.00 |
| Pizza | S/ 4.50 |
| Pollo deshilachado | S/ 4.50 |
| Carne deshilachada | S/ 4.50 |

Preparar el dataset y assets aunque inicialmente no exista una pantalla independiente final para esta categoría.

---

# 17. DETALLE DE PRODUCTO — Tequeños de Queso

Referencia:

`página_de_tequeños_de_queso.png`

Ruta:

`/producto/tequenos-de-queso`

## Layout

Desktop en dos columnas:

### Izquierda

- imagen principal grande;
- galería de thumbnails;
- cambio de imagen al seleccionar thumbnail.

### Derecha

Título:

```text
Tequeños de Queso
```

Copy:

```text
Con el sabor y la receta original de siempre
```

## Presentación obligatoria

```text
10 unid. — S/ 16.00
20 unid. — S/ 27.00
```

No permitir agregar el producto sin una presentación seleccionada.

## Cremas opcionales

```text
Mayonesa de ajo
Salsa tocino
Mayopalta
Ají especial
```

Cada crema adicional:

```text
2 oz — S/ 2.00
```

## Indicaciones

Textarea:

```text
Indicaciones para tu pedido
```

Máximo sugerido:

`200 caracteres`

## Acciones

- selector `- 1 +`;
- `Agregar al pedido` → carrito local;
- `Comprar por WhatsApp` → puede agregar el producto y llevar al flujo de carrito o generar el checkout correspondiente.

Para mantener consistencia, preferir que `Comprar por WhatsApp` agregue el producto y navegue a `/carrito` con el CTA final allí.

---

# 18. MODELO DE DATOS

No guardar precios como strings.

Ejemplo:

```ts
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
  subcategory?: string;
  description?: string;
  image: string;
  gallery?: string[];
  basePrice?: number;
  presentations?: ProductOption[];
  extras?: ProductOption[];
  ingredients?: string[];
  tags?: string[];
  featured?: boolean;
}
```

Ejemplo:

```ts
{
  id: 'teq-queso',
  slug: 'tequenos-de-queso',
  name: 'Tequeños de Queso',
  category: 'tequenos',
  subcategory: 'clasicos',
  image: '/assets/products/tequenos/queso.jpg',
  presentations: [
    { id: '10', label: '10 unid.', price: 16 },
    { id: '20', label: '20 unid.', price: 27 }
  ],
  extras: [
    { id: 'mayonesa-ajo', label: 'Mayonesa de ajo — 2 oz', price: 2 },
    { id: 'salsa-tocino', label: 'Salsa tocino — 2 oz', price: 2 },
    { id: 'mayopalta', label: 'Mayopalta — 2 oz', price: 2 },
    { id: 'aji-especial', label: 'Ají especial — 2 oz', price: 2 }
  ]
}
```

---

# 19. Carrito con Zustand

Crear una store única.

## Estado mínimo

```ts
interface CartItem {
  lineId: string;
  productId: string;
  name: string;
  image: string;
  quantity: number;
  unitPrice: number;
  selectedPresentation?: string;
  selectedOptions?: string[];
  notes?: string;
}
```

## Acciones

```text
addItem
removeItem
increaseQuantity
decreaseQuantity
setQuantity
clearCart
getSubtotal
getTotalUnits
```

## Persistencia

Usar middleware `persist` de Zustand con `localStorage`.

Así el carrito no se pierde al refrescar la página.

---

# 20. CARRITO / CHECKOUT WHATSAPP — `/carrito`

Referencia:

`checkout_de_retequeños_en_tacna.png`

## Stepper

```text
1. Carrito
2. Tus datos
3. Confirmar por WhatsApp
```

Visualmente puede mostrarse completo desde el inicio, como en la referencia.

## Columna 1 — Tu carrito

Cada producto muestra:

- thumbnail;
- nombre;
- presentación/opciones;
- cantidad;
- precio;
- eliminar.

Ejemplo de la pantalla de referencia:

```text
Tequeños de Queso — 20 unid. — S/ 27.00
Promo Extra — S/ 32.90
Coca Cola 600 ml — S/ 5.00
Crema adicional 2 oz — S/ 2.00
```

Subtotal del ejemplo:

```text
S/ 66.90
```

Esta cifra es demostrativa de la referencia. En implementación debe calcularse dinámicamente desde el carrito.

## Indicaciones

Textarea opcional.

## Columna 2 — Tus datos

Campos:

```text
Nombre completo *
Celular *
Tipo de entrega *
Dirección *   (solo si Delivery)
Referencia    (opcional)
```

Tipo de entrega:

```text
Delivery
Recojo en tienda
```

Cuando se seleccione `Recojo en tienda`:

- ocultar o deshabilitar Dirección;
- no solicitar costo de delivery.

## Pago

No mostrar tarjeta ni pasarela.

Mostrar:

```text
Forma de pago: se coordina por WhatsApp
```

## Columna 3 — Resumen

Mostrar:

```text
Subtotal
Delivery: por confirmar
Total: subtotal + delivery
```

Mientras el delivery no esté confirmado:

**no inventar una tarifa.**

Usar:

```text
Delivery: por confirmar
```

Y:

```text
Total: S/ XX.XX + delivery
```

## Nota visible

```text
Tu pedido se enviará a WhatsApp para confirmar disponibilidad,
dirección, delivery y forma de pago.
```

## Número oficial para el flujo

```text
912 266 950
```

Formato internacional para wa.me:

```text
51912266950
```

---

# 21. Generación del mensaje de WhatsApp

Crear una única función:

`src/lib/whatsapp.ts`

No construir URLs de WhatsApp en cada componente.

## Ejemplo de mensaje

```text
Hola Retequeños 👋

Quiero realizar el siguiente pedido:

1 x Tequeños de Queso (20 unid.) — S/ 27.00
1 x Promo Extra — S/ 32.90
1 x Coca Cola 600 ml — S/ 5.00
1 x Crema adicional 2 oz — S/ 2.00

Subtotal: S/ 66.90
Delivery: por confirmar

DATOS DEL CLIENTE
Nombre: María Fernanda Quispe
Celular: 912 000 000
Tipo de entrega: Delivery
Dirección: Av. Ejemplo 123, Tacna
Referencia: Frente al parque

Indicaciones: Sin ají.

Deseo confirmar disponibilidad, delivery y forma de pago.
```

## URL

```ts
const phone = '51912266950';
const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
window.open(url, '_blank', 'noopener,noreferrer');
```

## Importante

n8n **no forma parte del frontend visual**.

La web únicamente:

1. arma el pedido;
2. valida los datos;
3. genera el texto;
4. redirige a WhatsApp.

Después WhatsApp/n8n administra el flujo operativo.

---

# 22. Validaciones

Antes de enviar a WhatsApp:

## Requeridos

- carrito no vacío;
- nombre;
- celular;
- tipo de entrega;
- dirección si el tipo es Delivery.

## Productos configurables

No agregar al carrito si falta una opción obligatoria.

Ejemplo:

- Tequeños: seleccionar 10 o 20 unidades.

## Errores

Mostrar errores inline, no usar `alert()` del navegador.

---

# 23. Componentes reutilizables obligatorios

## `ProductCard`

Debe poder representar:

- tequeño con presentaciones;
- pizza con precio fijo;
- bebida;
- promo;
- pastelito.

Evitar un componente distinto para cada tarjeta si la diferencia puede resolverse con props.

## `QuantityStepper`

Usar el mismo en:

- detalle de producto;
- carrito.

## `Button`

Variantes:

```text
primary       rojo
secondary     blanco/borde
whatsapp      verde
warning       amarillo
icon          cuadrado
```

## `Badge`

Variantes:

```text
promo
nuevo
mas-vendido
categoria
```

---

# 24. Assets

## Regla crítica

No usar las imágenes de pantalla completa como fondo de la web.

Deben servir solo para comparar visualmente.

Los assets reales deben ser independientes:

```text
logo
hero
foto de cada producto
foto de cada promoción
iconos
```

## Nombres sugeridos

```text
/assets/products/tequenos/queso.jpg
/assets/products/tequenos/jamon-queso.jpg
/assets/products/tequenos/tocino-queso.jpg
/assets/products/tequenos/hotdog-queso.jpg
/assets/products/tequenos/tres-quesos.jpg
/assets/products/pizzas/americana.jpg
/assets/products/pizzas/italiana.jpg
/assets/promos/promo-extra.jpg
```

## Si al construir el prototipo solo se tienen screenshots

1. No convertir el screenshot completo en UI.
2. Usar placeholders temporales para fotografías.
3. Mantener los contenedores, ratios y `object-fit` correctos.
4. Sustituir los placeholders cuando se entreguen assets individuales.

---

# 25. Proporciones de imágenes

Cards de catálogo:

```text
aspect-ratio aproximado: 4 / 3
object-fit: cover
```

Hero:

```text
imagen panorámica
object-fit: cover
posición focal sobre tequeños / cheese pull
```

Detalle:

```text
imagen principal amplia
thumbnails con ratio uniforme
```

No estirar las fotografías.

---

# 26. Responsive web

Aunque las referencias finales son de escritorio, el código debe ser responsive desde el inicio.

## Header

En pantallas menores:

- ocultar copy secundaria;
- reducir ancho del buscador;
- convertir categorías a scroll horizontal;
- mantener carrito y WhatsApp visibles.

## Grids

Sugerencia:

```text
2xl: 5–8 cards según página
xl: 4–5
lg: 3–4
md: 2–3
sm: 2
xs: 1
```

No crear una navegación “app” ni una bottom tab bar nativa salvo requerimiento posterior.

---

# 27. Accesibilidad mínima

- botones con `aria-label` cuando sean solo iconos;
- imágenes con `alt`;
- contraste suficiente;
- foco visible;
- controles de presentación operables con teclado;
- labels reales para formulario;
- no depender exclusivamente del color para indicar selección.

---

# 28. Estados de UI

Preparar desde el prototipo:

## Catálogo

- normal;
- hover;
- seleccionado;
- sin resultados de búsqueda.

## Botones

- default;
- hover;
- active;
- disabled.

## Carrito

- vacío;
- con productos.

Carrito vacío:

```text
Tu carrito está vacío
Agrega algo rico de nuestra carta.
[Ver carta]
```

---

# 29. Configuración central

Archivo:

`src/config/site.ts`

```ts
export const siteConfig = {
  name: 'Retequeños',
  city: 'Tacna, Perú',
  whatsappDisplay: '912 266 950',
  whatsappInternational: '51912266950',
  instagram: '@retequenos',
  facebook: 'Retequeños',
};
```

No repetir el número de WhatsApp manualmente en múltiples archivos.

---

# 30. Footer

Mantener el estilo de la referencia:

- fondo rojo;
- logo;
- WhatsApp;
- Instagram;
- Facebook;
- frases de marca.

Información principal:

```text
WhatsApp: 912 266 950
Instagram: @retequenos
Facebook: Retequeños
```

---

# 31. Flujo del usuario

```text
HOME
  ↓
Explora categorías/promociones
  ↓
Selecciona presentación / producto
  ↓
Agregar al pedido
  ↓
Continúa comprando
  ↓
Carrito
  ↓
Completa datos
  ↓
Enviar pedido por WhatsApp
  ↓
WhatsApp
  ↓
n8n / gestión operativa posterior
```

---

# 32. Lo que NO debe construirse en esta etapa

- pasarela de pago;
- tarjeta de crédito;
- checkout bancario;
- login funcional complejo;
- panel administrativo;
- backend obligatorio;
- app móvil nativa;
- integración n8n dentro del frontend;
- sistema de tracking;
- mapa de delivery;
- tarifa automática de delivery;
- inventario en tiempo real.

Se puede dejar arquitectura preparada, pero no inventar estas funciones.

---

# 33. Criterios de fidelidad visual

La implementación debe compararse contra las imágenes de referencia a viewport equivalente.

Revisar:

- altura del header;
- proporciones del hero;
- márgenes laterales;
- tamaño de cards;
- gaps de los grids;
- tamaños de fuente;
- radios;
- color de botones;
- ubicación del CTA de WhatsApp;
- densidad de contenido;
- altura del footer;
- proporción de fotos.

## Regla

Si un componente cumple funcionalmente pero visualmente se aleja de la referencia, todavía no está terminado.

---

# 34. Criterios de mantenibilidad

La pantalla no debe quedar “pintada” exclusivamente con clases gigantescas sin estructura.

Exigencias:

- componentes por responsabilidad;
- datos fuera del JSX;
- rutas separadas;
- store separada;
- función de WhatsApp separada;
- tokens de diseño;
- componentes UI reutilizables;
- nombres semánticos;
- evitar duplicación.

---

# 35. Plan de construcción recomendado

## Fase 1 — Base

1. Crear proyecto Vite.
2. Instalar Tailwind.
3. Instalar React Router.
4. Instalar Zustand.
5. Instalar Lucide.
6. Definir tokens.
7. Crear `siteConfig`.
8. Cargar assets.

## Fase 2 — Layout global

1. Header.
2. CategoryNav.
3. PageContainer.
4. BenefitsStrip.
5. Footer.

## Fase 3 — Home

1. Hero.
2. ProductCard.
3. Catálogo destacado.
4. Promociones destacadas.

**No avanzar hasta que la home se vea prácticamente igual a la imagen de referencia.**

## Fase 4 — Catálogos

1. Tequeños.
2. Pizzas.
3. Promociones.

## Fase 5 — Detalle

1. Gallery.
2. Presentación.
3. Cremas.
4. Cantidad.
5. Add to cart.

## Fase 6 — Carrito

1. Store.
2. CartItem.
3. CustomerForm.
4. OrderSummary.
5. WhatsApp formatter.

## Fase 7 — QA

1. Validar precios.
2. Validar textos.
3. Validar rutas.
4. Validar persistencia.
5. Validar mensaje de WhatsApp.
6. Validar responsive.
7. Comparar visualmente contra screenshots.

---

# 36. Definición de “prototipo terminado”

El prototipo se considera listo cuando:

- todas las rutas indicadas funcionan;
- los elementos del diseño son componentes reales;
- los productos salen de datos centralizados;
- los precios oficiales coinciden;
- los filtros básicos funcionan;
- se puede agregar y quitar productos;
- el carrito calcula subtotales dinámicamente;
- el formulario valida los campos;
- el CTA genera un WhatsApp válido;
- no hay pasarela de pago;
- el diseño se parece de forma muy cercana a las imágenes aprobadas;
- se puede cambiar un precio en `catalog.ts` y toda la UI se actualiza;
- se puede reemplazar una imagen sin modificar componentes;
- se puede cambiar el número de WhatsApp desde `site.ts`;
- no se ha usado una captura completa como fondo de la interfaz.

---

# 37. Instrucción maestra para Antigravity / agente de código

Copiar y usar este bloque como instrucción principal junto con las imágenes de referencia:

```text
Construye un prototipo web real y navegable de Retequeños usando React + Vite + Tailwind CSS + Zustand + React Router + Lucide.

Toma las imágenes adjuntas como referencia visual exacta. No las utilices como fondos completos ni como sustituto del HTML. Reconstruye cada pantalla con componentes reales y reutilizables de React.

La prioridad es:
1) la CARTA 2026 para nombres, cantidades, precios y composición de productos;
2) los screenshots para apariencia visual;
3) el archivo RETEQUENOS_PROTOTIPO_FRONT_IMPLEMENTACION.md para arquitectura, comportamiento y reglas técnicas.

Implementa las rutas:
/
/tequenos
/pizzas
/promociones
/producto/tequenos-de-queso
/carrito

El prototipo debe quedar listo para evolucionar después al frontend definitivo sin rehacerlo desde cero.

Usa datos centralizados, componentes reutilizables, variables de tema y estado global para el carrito. No hardcodees productos en las páginas.

No existe pasarela de pagos. El cierre del pedido consiste en construir un mensaje con carrito + datos del cliente y abrir WhatsApp al número 51912266950. Delivery, disponibilidad y forma de pago se confirman posteriormente por WhatsApp.

Construye primero la página principal y no avances a la siguiente vista hasta que la fidelidad visual contra su screenshot sea alta. Luego continúa con Tequeños, Pizzas, Promociones, Detalle de producto y Carrito.

La UI debe quedar editable: cambiar un producto, precio, imagen, color o número de WhatsApp no debe requerir reescribir las páginas.
```

---

# 38. Checklist final de revisión

- [ ] React + Vite funcionando.
- [ ] Tailwind configurado.
- [ ] Rutas funcionando.
- [ ] Branding centralizado.
- [ ] Home fiel al screenshot.
- [ ] Tequeños fiel al screenshot.
- [ ] Pizzas fiel al screenshot.
- [ ] Promociones fiel al screenshot.
- [ ] Detalle de producto fiel al screenshot.
- [ ] Carrito fiel al screenshot.
- [ ] Datos de carta centralizados.
- [ ] Precios validados contra CARTA 2026.
- [ ] Carrito con Zustand.
- [ ] Persistencia en localStorage.
- [ ] Formularios validados.
- [ ] WhatsApp funcionando.
- [ ] Sin pasarela de pago.
- [ ] Sin screenshots usados como páginas.
- [ ] Assets reemplazables.
- [ ] Responsive web preparado.
- [ ] Código mantenible y reutilizable.

---

## Resultado esperado

El resultado no es una maqueta desechable. Debe ser la **primera versión real del frontend**, todavía alimentada por datos locales, pero con estructura suficiente para que en la siguiente etapa pueda conectarse a datos dinámicos, Supabase u otra fuente y a la operación de WhatsApp/n8n sin reemplazar la interfaz completa.

