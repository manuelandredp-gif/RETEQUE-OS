# Retequeños · 30 + 30 mejoras MVP

Carpeta de trabajo: `C:\Users\LENOVO\Desktop\Retequenos`

| Carpeta | Qué es | Cómo abrirla |
|---|---|---|
| `app/` | Prototipo de la **app móvil** (26 pantallas, navegable) + panel admin | Doble clic en `Iniciar app (celular).cmd` → http://localhost:3000 (desde el celular: la IP que muestra la ventana) |
| `web/` | **Web** de pedidos por WhatsApp (React + Vite + Tailwind) | Doble clic en `Iniciar web.cmd` → http://localhost:5173 |
| `tools/` | Servidores locales sin Node, compilador y scripts de parche | `Compilar web.cmd` regenera `web/dist` |

Todo lo listado abajo **ya está aplicado** en esta carpeta. Los originales en `Music\Alcance_y_fotografia_proyecto_completo` y `Pictures\market_retequenos` quedaron intactos.

Prioridad MVP: **P1** = imprescindible para lanzar · **P2** = mejora clara con poco esfuerzo · **P3** = pulido.

---

## A · App móvil (prototipo `app/index.html`)

| # | Mejora | Prioridad | Estado |
|---|---|---|---|
| A01 | **Vista móvil real**: al abrirla desde un celular (o ventana < 720 px) desaparece el escritorio del prototipo y la app ocupa toda la pantalla, sin marco ni barra de estado falsa. | P1 | Aplicada |
| A02 | **Fotos reales** de la carta 2026 en Inicio, Menú, Búsqueda, Favoritos y Carrito (las mismas de la web), en lugar de ilustraciones placeholder. | P1 | Aplicada |
| A03 | Foto real en la Bienvenida, en el banner de promo del Inicio y en el detalle de producto. | P2 | Aplicada |
| A04 | **Detalle de producto dinámico**: abre el producto que tocaste (nombre, foto, precio, descripción, valoración); antes siempre mostraba "Tequeños de queso". | P1 | Aplicada |
| A05 | Selector de **presentación 10 / 20 unidades** en el detalle, con el precio de cada una tomado de la carta. | P1 | Aplicada |
| A06 | **Contador del carrito consistente**: se calcula desde las líneas reales (antes era un número aparte que no bajaba al eliminar). El botón "+" agrega una línea real. | P1 | Aplicada |
| A07 | **Estado vacío del carrito** con foto y botón "Ver el menú". | P2 | Aplicada |
| A08 | **Barra "Ver carrito · N · S/ total"** visible en Inicio, Búsqueda, Menú, Favoritos y Promociones cuando hay productos. | P1 | Aplicada |
| A09 | **Flujo de compra corregido**: Carrito → Modalidad → Dirección (solo si es delivery) → Resumen. Recojo en tienda ya no obliga a elegir dirección. | P1 | Aplicada |
| A10 | Costo de envío según modalidad: S/ 5.90 delivery, **S/ 0.00 recojo**, en carrito, resumen y confirmación. | P1 | Aplicada |
| A11 | **Resumen y confirmación con datos reales**: líneas, subtotal, descuento y total del carrito (antes estaban fijos en S/ 55.80 / S/ 58.80 con productos que no eran los del carrito). | P1 | Aplicada |
| A12 | El pedido que llega al **panel admin (`/api/pedidos`)** lleva las líneas, total, dirección o recojo, método de pago y notas reales. | P1 | Aplicada |
| A13 | **Notas editables**: en "Personalizar combo" y en "Instrucciones para el repartidor" (campos reales que viajan al pedido). | P2 | Aplicada |
| A14 | Campana del Inicio → Notificaciones (antes iba a Promociones). "Entregar en Tacna" → Direcciones (antes no hacía nada). | P2 | Aplicada |
| A15 | **"Continuar como invitado"** en Inicio de sesión (menos fricción para el primer pedido). | P1 | Aplicada |
| A16 | Búsqueda: sin texto precargado, **chips de sugerencia** (Tequeños, Promos, Pizzas, Bebidas) y "Más pedidos" ordena por valoración. Se quitaron "Filtrar" y "Ordenar", que no hacían nada. | P2 | Aplicada |
| A17 | Menú: subtítulo con la categoría y el número de productos; acceso al carrito en la cabecera. | P3 | Aplicada |
| A18 | **"Pedir de nuevo"** (Historial y Detalle del pedido) agrega las líneas reales del pedido anterior. | P2 | Aplicada |
| A19 | Tarjeta **"Tu último pedido · REPETIR"** en el Inicio (retención). | P2 | Aplicada |
| A20 | Chip de estado **"Abierto hoy · delivery hasta 11:00 p. m."** y línea "Delivery S/ 5.90 · 35–45 min" en el Inicio (configurable en `STORE`, horario por confirmar). | P2 | Aplicada |
| A21 | **Áreas táctiles más grandes**: botones "+" de 36 px, +/− del carrito y del detalle con relleno, "×" del buscador de 26 px, botón "Volver" con margen. | P1 | Aplicada |
| A22 | **Contraste**: textos secundarios y placeholders pasan de #9B948C a #7A736B (legibles sobre crema). | P2 | Aplicada |
| A23 | Método de pago: al elegir Yape / Plin / transferencia aparece el **número para yapear** y la instrucción de enviar la captura. | P2 | Aplicada |
| A24 | Confirmación: **número de pedido generado** (RTQ-xxxx) y **hora estimada calculada** (ahora + 35 min; recojo + 22 min). | P2 | Aplicada |
| A25 | Seguimiento muestra el id y total del pedido real; título "LISTO PARA RECOGER" cuando es recojo. | P3 | Aplicada |
| A26 | Historial: el pedido "En curso" es el que acabas de confirmar. | P3 | Aplicada |
| A27 | Cupón con botón **"Quitar"** para revertirlo. | P3 | Aplicada |
| A28 | **Accesibilidad**: `aria-label` en botones de ícono (volver, carrito, notificaciones, favorito, eliminar, +/−) y textos alternativos en fotos. | P2 | Aplicada |
| A29 | **Toast con acción "Ver carrito ›"** al agregar (tocar el aviso lleva al carrito). | P2 | Aplicada |
| A30 | Panel del prototipo actualizado (v2 · MVP), pistas por pantalla y sin peticiones 404 de imágenes al cargar. | P3 | Aplicada |

**Pendiente que no depende del código (para el negocio):** fotos en alta resolución (las actuales son recortes de la carta de ~190 × 80 px y se ven suaves al ampliarlas), confirmar dirección del local, horario y número de Yape.

---

## B · Web (`web/`, React + Vite)

| # | Mejora | Prioridad | Estado |
|---|---|---|---|
| W01 | **Menú hamburguesa funcional** en celular: categorías, WhatsApp, teléfono, dirección y redes (antes el botón no hacía nada). | P1 | Aplicada |
| W02 | **Buscador en celular** (icono lupa → barra desplegable); antes solo existía en escritorio. Busca sin tildes ("tequenos"). | P1 | Aplicada |
| W03 | Las **pestañas de categorías del encabezado navegan** a su página y resaltan la sección activa (antes no hacían nada). | P1 | Aplicada |
| W04 | **Datos del cliente vacíos por defecto**: antes venían precargados "María Fernanda Quispe, Av. Bolognesi 450…" y se enviaban al negocio. | P1 | Aplicada |
| W05 | **Validación** de celular peruano (9 dígitos, empieza en 9), nombre mínimo y dirección, con mensajes claros. | P1 | Aplicada |
| W06 | **El pedido se abre al agregar** desde el configurador de promos (antes en el Inicio no se abría) y cada "+" muestra un aviso con "Ver pedido". | P1 | Aplicada |
| W07 | Estado del carrito **unificado en un solo store**; ya no se guarda "abierto" entre recargas. | P2 | Aplicada |
| W08 | **Un solo configurador global** (antes había 3 copias) y **acciones de catálogo unificadas**: tequeños → detalle, promos → configurador, resto → agregar directo. | P2 | Aplicada |
| W09 | Enlace universal de WhatsApp **`wa.me`** (funciona igual en celular y escritorio) en un solo helper. | P1 | Aplicada |
| W10 | **Estado "pedido enviado"** tras abrir WhatsApp, con "Ya lo envié, vaciar" y "Reintentar". | P1 | Aplicada |
| W11 | Carrito: botón **"Vaciar pedido"**, controles de cantidad de 32 px (antes 20 px) y campo de referencia. | P2 | Aplicada |
| W12 | Notas y opciones de cada producto visibles en el carrito. | P3 | Aplicada |
| W13 | **Recojo en tienda muestra la dirección** del local; el mensaje de WhatsApp indica recojo o delivery. | P2 | Aplicada |
| W14 | **Barra inferior fija en celular** "Ver pedido · N · S/ total". | P1 | Aplicada |
| W15 | **Botón flotante de WhatsApp** en toda la web. | P1 | Aplicada |
| W16 | **Aviso (toast)** global "Agregado: … · Ver pedido". | P2 | Aplicada |
| W17 | **Página 404 real** con enlace a la carta (antes cualquier URL mostraba el inicio). | P2 | Aplicada |
| W18 | **Producto no encontrado** en `/producto/:slug` (antes mostraba Tequeños de queso en silencio). | P2 | Aplicada |
| W19 | Galería del detalle: miniaturas solo cuando el producto tiene galería (antes reutilizaba las fotos de queso en todos). | P3 | Aplicada |
| W20 | **Imagen con respaldo**: si una foto falla, se muestra un placeholder de marca en vez de un ícono roto. | P2 | Aplicada |
| W21 | Configurador en celular: **pasos primero, resumen después**; cierra con Escape; rol de diálogo. | P2 | Aplicada |
| W22 | **Reglas de cada promo explícitas en los datos** (`config: tequeños, pizzas, cremas, bebida`) en lugar de adivinarlas por el texto. La bebida solo aparece si la promo la incluye. | P1 | Aplicada |
| W23 | **Clases de Tailwind inválidas corregidas** (`w-4.5`, `shadow-xs`, `scale-102`, `py-0.2`, `active:scale-98`) que no aplicaban ningún estilo. | P3 | Aplicada |
| W24 | Header limpio: se quitaron el selector de ciudad y la campana, que no hacían nada. | P3 | Aplicada |
| W25 | **SEO / compartir / instalable**: Open Graph, `theme-color`, favicon correcto, `manifest.webmanifest` (se puede "Agregar a inicio" en el celular), `robots.txt`. | P2 | Aplicada |
| W26 | **Accesibilidad**: foco visible por teclado, `aria-label` en botones de ícono, roles de diálogo, radios y pestañas, enlace "Ir al contenido", cierre con Escape. | P2 | Aplicada |
| W27 | Rendimiento: `loading="lazy"` y `decoding="async"` en el catálogo, `fetchpriority="high"` en el hero. | P3 | Aplicada |
| W28 | Hero con **segundo CTA "Pedir por WhatsApp"** y franja de datos (delivery en Tacna, formas de pago, horario si se configura). | P2 | Aplicada |
| W29 | **Footer y menú con datos del negocio** desde `src/config/site.ts` (WhatsApp, dirección con mapa, horario, Instagram, Facebook, enlaces a la carta). | P2 | Aplicada |
| W30 | **Estados vacíos y contadores** en filtros de promociones y bebidas. | P3 | Aplicada |

**Pendiente que no depende del código:** completar en `web/src/config/site.ts` el horario (`hours`), y confirmar dirección, número de Yape y URLs de Instagram/Facebook (están marcados con `// confirmar`). Fotos de bebidas y pastelitos: hoy reutilizan una misma imagen.

---

## Cómo se compila la web sin Node instalado

`tools\node.cmd` usa el motor Node 22 que trae el ejecutable de Antigravity IDE (Electron con `ELECTRON_RUN_AS_NODE=1`). `Compilar web.cmd` ejecuta `tsc -b` y `vite build` con él y deja el resultado en `web/dist`, listo para subir a cualquier hosting estático.
