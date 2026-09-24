# Resumen Técnico: Rediseño Integral de "Cupones & Ofertas" (Retequeños OS)

Este documento detalla la reconstrucción y modernización del módulo **"Cupones & Ofertas"** dentro del panel administrador (`app/admin.html`), siguiendo la especificación visual y operativa contenida en `PLAN_IMPLEMENTACION_NUEVO_DISENO_CUPONES_RETEQUE_OS_CLAUDE.md` y la imagen de referencia.

---

## 1. Archivos Modificados

- [`app/admin.html`](file:///C:/Users/MILTONHFLORESCHINO/.gemini/antigravity-ide/scratch/RETEQUE-OS/app/admin.html):
  - **Cabecera global y Navbar**: Integración de buscador general con `⌘ K`, estado de tienda en vivo, botón de app móvil y botón directo `+ Nueva campaña`.
  - **Sidebar**: Botón de navegación principal para `Cupones & Ofertas` destacado con píldora roja activa (`#FF2442`), preservando la estructura del resto del menú (KDS con badge, Encuestas con badge, etc.).
  - **Módulo Cupones & Ofertas (`#tab-promos`)**: Rediseño visual y funcional completo en 4 niveles jerárquicos:
    1. **KPI Cards superiores**: 4 tarjetas métricas (Cupones activos: `12` con variación `+20%`, Programados hoy: `3`, Próximos a vencer: `2`, Tasa de canje: `28.5%` con variación `+5.2%`).
    2. **Planificador semanal de ofertas**: Calendario de 7 columnas (Lunes a Domingo) con promociones horarias etiquetadas (`● Activa`, `● Programada`), botón `+ Agregar oferta` contextual por día, rango de fechas y acción `Guardar programación`.
    3. **Fila central en 3 columnas**:
       - **Columna 1 (Izquierda)**: Formulario completo *Crear / Editar cupón* (Código, Nombre interno, Tipo de beneficio, Valor del descuento, Pedido mínimo, Límite total de usos, Límite por cliente, Fecha inicio/fin, Hora inicio/fin, Días de activación L-D, Segmento de audiencia, Aplicación a carta/categorías/productos, Toggles de acumulabilidad, visibilidad en app, push y estado).
       - **Columna 2 (Centro)**: *Vista previa en app móvil* con mockup de iPhone 15 Pro, Dynamic Island, barra de estado y ticket de cupón dinámico que se actualiza en tiempo real al escribir en el formulario.
       - **Columna 3 (Derecha)**: Dos tarjetas apiladas:
         - *Rendimiento de cupones*: Gráfico de barras de canjes de los últimos 30 días y ranking Top 3 cupones (`MARTESRETQ`, `BIENVENIDO10`, `ENVIOGRATIS`).
         - *Automatizaciones y reglas rápidas*: Acceso directo con plantillas predefinidas (Baja demanda, Cupón de bienvenida, Recuperación de inactivos).
    4. **Tabla de Cupones activos y programados**: Listado general interactivo con buscador instantáneo, filtrado por estado, exportación CSV, badges de vigencia y 5 acciones por fila (Previsualizar en teléfono, Editar, Pausar/Reanudar, Duplicar con nuevo código y Eliminar).

---

## 2. Decisiones Técnicas & Colorimetría

- **Colorimetría Fidedigna**:
  - Rojo Primario Retequeños: `#FF2442` para botones de acción principal, iconos activos y elementos destacados.
  - Verdes de estado / badges: `#DEF7EC` de fondo con `#03543F` de texto para cupones y ofertas activas.
  - Azules de programación: `#E1EFFE` de fondo con `#1E429F` para promociones calendarizadas en fechas futuras.
  - Ámbar de pausa: `#FEF3C7` de fondo con `#92400E` para cupones pausados temporalmente.
  - Fondos de tarjetas: Blanco puro `#FFFFFF` sobre lienzo gris tenue `#F8F9FA` con bordes `#E5E7EB` y sombras ultra sutiles.
- **Iconografía**:
  - Reemplazo de emojis informales por iconos SVG nítidos y ligeros para todas las acciones (ojo para previsualizar, lápiz para editar, pausa/play, duplicar y papelera roja de eliminación).
- **Modelo de Datos Unificado**:
  - Las promociones del calendario semanal y los cupones de la tabla se gestionan mediante estructuras sincronizadas (`DETAILED_COUPONS` y `DETAILED_WEEK_SCHEDULE`), permitiendo que el estado del cupón se refleje automáticamente en la interfaz.

---

## 3. Pruebas Realizadas

- **Inspección Visual en Browser Subagent**: Verificación de resolución 1920x1080 en `http://localhost:3000/admin`.
- **Sincronización en Vivo**: Al editar el código, nombre o descuento en el formulario, el ticket del iPhone mockup refleja el cambio instantáneamente.
- **Acciones de Tabla**:
  - *Editar*: Carga todos los parámetros del cupón en el formulario y sitúa el foco en el editor.
  - *Pausar / Reactivar*: Alterna el estado entre `Activo` y `Pausado` actualizando el badge y el icono.
  - *Duplicar*: Genera una copia con sufijo `_COPIA`, estado `Borrador` y abre el formulario para ajustar parámetros.
  - *Exportar*: Descarga local de un archivo CSV con la data de los cupones activos.
- **Plantillas Rápidas**: El click en cualquiera de las 3 tarjetas de automatizaciones aplica de inmediato los parámetros preconfigurados en el formulario.

---

## 4. Pendientes de Backend (Infraestructura Futura)

Para cuando se implemente un servidor backend persistente:
1. Endpoints REST sugeridos:
   - `GET /api/coupons` (listar cupones con paginación y filtros)
   - `POST /api/coupons` (crear nuevo cupón o borrador)
   - `PUT /api/coupons/:id` (actualización completa)
   - `PATCH /api/coupons/:id/status` (pausa/reanudación rápida)
   - `DELETE /api/coupons/:id` (eliminación o archivado)
2. Servicio de Notificaciones Push (Firebase Cloud Messaging / OneSignal) para la activación real del toggle "Enviar notificación push".
3. Segmentación de clientes en base de datos para validar si un usuario pertenece al segmento `Nuevos`, `Inactivos` o `VIP`.
4. Validación del canje en el proceso de checkout respetando el pedido mínimo y la ventana horaria configurada.
