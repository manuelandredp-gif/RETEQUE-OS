# RETEQUE-OS — Plan de implementación del módulo Pedidos KDS
## Guía para Antigravity basada en la imagen de referencia

## 1. Objetivo

Rediseñar el módulo **Panel administrador → Pedidos KDS** para que quede visualmente prácticamente igual a la imagen de referencia que se entregará junto con este archivo.

La imagen es la **fuente principal de verdad visual**. Deben respetarse al máximo:

- composición;
- jerarquía;
- sidebar;
- header;
- KPIs;
- filtros;
- columnas;
- tarjetas;
- badges;
- botones;
- colores;
- espaciado;
- densidad visual;
- panel inferior de alertas.

El objetivo no es rehacer RETEQUE-OS, sino modernizar este módulo sin romper la lógica existente.

---

## 2. Regla principal

Antes de modificar código:

1. Inspeccionar la implementación actual de `Pedidos KDS`.
2. Localizar archivos, componentes, estilos, mocks, APIs y lógica de estados.
3. Revisar:
   - creación de pedidos;
   - simulación;
   - sonidos;
   - actualización de tiempos;
   - pagos;
   - pedidos App / WhatsApp;
   - Recojo / Delivery;
   - transición entre estados.
4. Reutilizar toda lógica válida.
5. No crear un segundo motor de pedidos.
6. No inventar backend ni APIs inexistentes.
7. No tocar módulos no relacionados salvo componentes globales estrictamente necesarios.

---

# 3. Resultado visual esperado

La estructura final debe ser:

```text
SIDEBAR
│
├── Header global
├── Monitor de Cocina y Despacho en Vivo
├── KPIs operativos
├── Buscador + filtros
├── Board KDS
│   ├── Nuevos / Por aceptar
│   ├── En cocina
│   ├── En camino / Delivery
│   └── Entregados hoy
└── Alertas / notas / rendimiento
```

La pantalla debe sentirse compacta, moderna y operativa.

---

# 4. Sidebar

Conservar el sidebar de RETEQUE-OS y ajustarlo para que coincida con la referencia.

Debe mostrar:

### Operación principal
- Dashboard & Métricas
- **Pedidos KDS**
- Menú & Stock
- Clientes & Push
- Cupones & Ofertas
- Encuestas & Reseñas
- Reportes

### Configuración
- Preferencias Tienda
- Usuarios
- Integraciones

`Pedidos KDS` debe aparecer seleccionado con:

- fondo rojo;
- texto blanco;
- icono;
- badge con cantidad pendiente.

En la parte inferior conservar:

```text
¿Necesitas ayuda?
Centro de soporte →

MF
Milton Flores
Superadministrador
```

---

# 5. Header global

Mantener la estructura superior de la referencia:

### Izquierda
```text
Buscar en Retequeños...
```

### Derecha
```text
● Tienda abierta
Sonido: ON
Ver app móvil
+ Nueva campaña
MF
```

No romper la funcionalidad real de tienda, sonido ni navegación.

Si actualmente existe un botón operativo de simulación de pedido, conservarlo en una ubicación coherente aunque la referencia visual utilice otra acción superior.

---

# 6. Cabecera del módulo

Mostrar:

```text
Monitor de Cocina y Despacho en Vivo   ● Actualización en tiempo real
Gestiona todos tus pedidos, desde la recepción hasta la entrega.
```

A la derecha:

```text
Fecha actual
Hora actual
● Sistema en línea
```

La fecha y hora deben ser dinámicas.

No hardcodear la fecha de la captura.

---

# 7. KPIs superiores

Implementar seis cards.

## Nuevos
```text
Nuevos
4
Por aceptar
```

## En cocina
```text
En cocina
2
Preparándose
```

## En delivery
```text
En delivery
2
En camino
```

## Entregados hoy
```text
Entregados hoy
12
↑ +20%
vs. ayer
```

## Tiempo prom. cocina
```text
Tiempo prom. cocina
8 min
↓ -2 min
Última hora
```

## Con retraso
```text
Con retraso
1
> 20 minutos
```

### Regla
Los valores deben derivarse de los datos existentes siempre que sea posible.

No hardcodear métricas que ya puedan calcularse.

---

# 8. Barra de filtros

Crear una única barra horizontal debajo de KPIs.

Debe contener:

### Buscador
```text
Buscar por código, cliente o producto...
```

Buscar por:
- ID;
- cliente;
- producto.

### Tipo de pedido
```text
Todos
App
WhatsApp
Recojo
Delivery
```

### Estado de pago
Usar los estados reales disponibles.

Ejemplos:
```text
Todos
Confirmado
Verificado
Por verificar
Efectivo
Contraentrega
```

### Prioridad
```text
Todas
Normal
Prioridad
Retrasados
```

### Rango de tiempo
```text
Hoy
Última hora
Últimas 4 horas
```

### Limpiar
```text
↻ Limpiar filtros
```

Los filtros deben combinarse correctamente.

---

# 9. Tablero principal

Crear cuatro columnas visibles simultáneamente en desktop:

```text
Nuevos / Por aceptar
En cocina
En camino / Delivery
Entregados hoy
```

Cada columna tendrá:

- icono;
- título;
- subtítulo;
- badge contador;
- color suave propio;
- cards internas.

---

# 10. Columna Nuevos / Por aceptar

Header:

```text
Nuevos / Por aceptar          4
Pedidos pendientes de aceptación
```

Color/acento azul.

Acción principal en cards:

```text
✓ Aceptar
```

---

# 11. Columna En cocina

Header:

```text
En cocina                     2
Pedidos en preparación
```

Color/acento naranja.

Para delivery:

```text
Pasar a delivery
```

Para recojo:

```text
Marcar listo
```

No mandar pedidos de recojo a Delivery.

---

# 12. Columna En camino / Delivery

Header:

```text
En camino / Delivery          2
Pedidos en ruta de entrega
```

Color/acento rosado/rojo.

Acción:

```text
✓ Marcar entregado
```

No implementar GPS ni mapa.

---

# 13. Columna Entregados hoy

Header:

```text
Entregados hoy               12
Pedidos completados
```

Color/acento verde.

Las cards de esta columna deben ser más compactas.

Acción:

```text
Ver detalle
```

---

# 14. Componente OrderCard

Crear/reutilizar un componente único para todos los pedidos.

Estructura visual:

```text
RTQ-2064                   Recién recibido

Milton Flores

[App] [Pago confirmado]           [Recojo]

1x Tequeños de queso
1x Promo Duo

S/ 120.70

[Ver detalle] [✓ Aceptar]
```

El card debe ser compacto y no desperdiciar altura.

---

# 15. Información dentro del card

Mostrar:

- ID;
- tiempo transcurrido;
- cliente;
- canal;
- estado de pago;
- modalidad;
- productos;
- observaciones;
- dirección cuando exista;
- total;
- acciones.

---

# 16. Badges de canal

Usar visualmente:

### App
Azul.

### WhatsApp
Verde.

No mezclar canal con modalidad.

---

# 17. Estado del pago

Mostrar como badge independiente.

Ejemplos:

- Pago confirmado;
- Transferencia verificada;
- Yape verificado;
- PIN verificado;
- Efectivo;
- Por verificar;
- Pago contraentrega.

Usar los valores reales del proyecto.

---

# 18. Modalidad

Mostrar tags como:

```text
Recojo
Moto
```

`Moto` representa gestión operativa.

No implementar tracking GPS.

---

# 19. Productos

Mostrar productos de forma compacta.

Ejemplo:

```text
1x Tequeños de queso (Mayonesa de ajo)
1x Promo Duo (Queso + Mayopalta)
```

Si hay demasiados:

```text
+ 3 productos más
```

El detalle completo va en `Ver detalle`.

---

# 20. Notas de cocina

Las observaciones especiales deben mostrarse en una banda secundaria dentro del card.

Ejemplo:

```text
Sin cebolla, por favor.
```

o:

```text
Agregar salsa extra de chocolate.
```

---

# 21. Dirección

Solo mostrar si el pedido ya posee una dirección.

Ejemplo:

```text
📍 Av. Primavera 123
```

No crear:

- mapa;
- ubicación en vivo;
- GPS;
- tracking del motorizado.

---

# 22. Total

Mostrar el total en rojo Retequeños:

```text
S/ 120.70
```

Debe ser fácil de localizar.

---

# 23. Estados de tiempo

Ejemplos:

```text
Recién recibido
Hace 2 min
En cocina hace 6 min
Salió hace 8 min
Entregado a las 20:15
```

Calcularlos desde timestamps.

No guardar textos de tiempo como dato principal.

---

# 24. Retrasos

Centralizar umbral.

Ejemplo:

```javascript
const DELAY_THRESHOLD_MINUTES = 20;
```

Cuando se supere:

- badge `Retrasado`;
- acento visual;
- incluir en KPI;
- incluir en alertas.

---

# 25. Prioridad

Pedidos prioritarios pueden mostrar:

```text
🔥 Prioridad
```

Orden recomendado:

1. retrasados;
2. prioridad;
3. más antiguos;
4. más recientes.

En entregados:
- más reciente primero.

---

# 26. Acciones por estado

## Nuevo
```text
[Ver detalle] [Aceptar]
```

## Cocina + Delivery
```text
[Ver detalle] [Pasar a delivery]
```

## Cocina + Recojo
```text
[Ver detalle] [Marcar listo]
```

## En delivery
```text
[Ver detalle] [Marcar entregado]
```

## Entregado
```text
[Ver detalle]
```

Conectar a la lógica actual.

No crear estados duplicados.

---

# 27. Panel inferior

Replicar los tres módulos de la referencia.

## Pedidos que requieren atención

```text
⚠ Pedidos que requieren atención
1 pedido con mayor tiempo del esperado

RTQ-2038
Hace 25 min
Retrasado
En cocina
>
```

## Notas de cocina

```text
Notas de cocina
Revisa las solicitudes especiales de los pedidos en preparación.

2 >
```

## Rendimiento de hoy

```text
Rendimiento de hoy
12 pedidos entregados

↑ +20%
>
```

---

# 28. Diseño visual

Usar la imagen como guía estricta.

### Primario
Rojo Retequeños.

### Nuevo
Azul suave.

### Cocina
Naranja suave.

### Delivery
Rosado/rojo suave.

### Entregado
Verde suave.

### Tiempo
Morado.

### Retraso
Rojo.

---

# 29. Cards

Usar:

- fondo blanco;
- border-radius aproximado 10–14 px;
- borde gris claro;
- sombra muy suave;
- padding compacto.

Evitar cards enormes.

---

# 30. Tipografía

Usar la fuente existente del proyecto.

Jerarquía aproximada:

```text
Título página: 20–24 px
Números KPI: 22–28 px
Título columna: 14–16 px
ID pedido: 14–15 px semibold
Texto card: 12–13 px
Auxiliares: 11–12 px
```

---

# 31. Espaciado

Usar un sistema consistente:

```text
4
8
12
16
20
24
```

No usar valores arbitrarios diferentes en cada card.

---

# 32. Botones

### Primario
Rojo.

### Acción cocina/delivery
Naranja.

### Entregado
Verde.

### Secundario
Blanco/gris.

Añadir:
- hover;
- focus;
- active.

---

# 33. Densidad

La referencia utiliza alta densidad.

El diseño final NO debe volver a verse:

- vacío;
- básico;
- con demasiado espacio desaprovechado.

Priorizar lectura rápida.

---

# 34. Scroll

Si una columna tiene muchos pedidos:

- permitir scroll interno vertical;
- mantener header de columna visible.

Evitar una página extremadamente larga.

---

# 35. Responsive

Probar mínimo:

- 1366×768;
- 1440×900;
- 1920×1080.

En desktop grande mantener las cuatro columnas visibles.

En anchos menores:
- usar scroll horizontal del board si hace falta;
- no apilar las columnas demasiado pronto.

---

# 36. Lógica de KPIs

Conceptualmente:

```javascript
newOrders = orders.filter(...)
kitchenOrders = orders.filter(...)
deliveryOrders = orders.filter(...)
deliveredToday = orders.filter(...)
delayedOrders = orders.filter(...)
```

No duplicar fuentes de datos.

---

# 37. Tiempo promedio de cocina

Si hay timestamps:

```text
kitchenCompletedAt - kitchenStartedAt
```

Calcular promedio.

Si no hay datos suficientes:

```text
—
```

No inventar valor.

---

# 38. Búsqueda

Debe encontrar:

```text
RTQ-2048
Milton
Promo Duo
```

Normalizar mayúsculas/minúsculas.

---

# 39. Empty states

Si una columna está vacía:

```text
No hay pedidos en esta etapa.
```

No dejar un área blanca sin explicación.

---

# 40. Loading

Si los pedidos cargan async:

usar skeletons o loading discreto.

No bloquear todo el panel innecesariamente.

---

# 41. Error

Si falla la carga:

```text
No se pudieron cargar los pedidos.
[Reintentar]
```

---

# 42. Feedback

Después de una acción:

```text
RTQ-2050 pasó a Delivery.
```

Usar toast existente.

Evitar `alert()` si hay una solución mejor en el proyecto.

---

# 43. Detalle del pedido

`Ver detalle` debe reutilizar el flujo existente.

No crear un segundo modal si ya hay uno.

Debe mostrar como mínimo:

- ID;
- cliente;
- canal;
- modalidad;
- productos;
- agregados;
- observaciones;
- subtotal;
- descuentos;
- total;
- pago;
- timestamps;
- estado.

---

# 44. Actualización en tiempo real

Si existe polling/WebSocket:
- conservar.

Si no existe:
- no inventarlo.

La UI debe reflejar el mecanismo real actual.

---

# 45. Sonido

No romper las alertas existentes.

Evitar reproducir sonido en cada render.

---

# 46. Simulación

Si existe `Nuevo Pedido Simulado`:
- conservar su lógica;
- mantenerlo accesible.

No eliminar funcionalidad solo por copiar exactamente una etiqueta superior de la imagen.

---

# 47. Arquitectura sugerida

Adaptar al stack real.

Conceptualmente:

```text
KDSPage
 ├── KDSHeader
 ├── KDSMetrics
 ├── KDSFilters
 ├── KDSBoard
 │    ├── KDSColumn
 │    │    └── OrderCard
 └── KDSInsights
```

No forzar React si el proyecto no usa React.

---

# 48. No hardcodear ejemplos

La imagen muestra datos como:

```text
RTQ-2064
Milton Flores
S/ 120.70
```

Son ejemplos visuales.

Si existen datos reales/mocks actuales:
usar esos.

---

# 49. No implementar

- mapas;
- tracking GPS;
- ubicación de moto en tiempo real;
- backend ficticio;
- WebSockets ficticios;
- librerías pesadas innecesarias;
- drag & drop obligatorio.

---

# 50. Drag & drop

Solo implementar si ya existe o es muy estable con el stack actual.

No es necesario para cumplir el diseño.

Los botones de transición son suficientes.

---

# 51. Fase 1 — Auditoría

Antes de programar:

- identificar archivos;
- componentes;
- estilos;
- fuentes de datos;
- acciones;
- estados;
- dependencias.

Crear internamente una lista de archivos a modificar.

---

# 52. Fase 2 — Layout

Construir:

- cabecera;
- fecha/hora;
- KPIs;
- filtros;
- board;
- panel inferior.

Primero igualar la estructura visual.

---

# 53. Fase 3 — Columnas

Construir:

- Nuevos;
- Cocina;
- Delivery;
- Entregados.

Ajustar anchos y colores según referencia.

---

# 54. Fase 4 — OrderCard

Concentrar la presentación de pedidos en un componente reutilizable.

Debe soportar variantes por estado.

---

# 55. Fase 5 — Acciones

Conectar:

```text
Aceptar
Pasar a delivery
Marcar listo
Marcar entregado
Ver detalle
```

Usando lógica existente.

---

# 56. Fase 6 — Filtros

Implementar:

- búsqueda;
- canal/tipo;
- pago;
- prioridad;
- rango;
- limpiar.

---

# 57. Fase 7 — Alertas

Conectar:

- retrasos;
- prioridad;
- notas;
- rendimiento.

---

# 58. Fase 8 — Responsive

Ajustar:

- 1366;
- 1440;
- 1920.

---

# 59. Fase 9 — Comparación visual

Abrir la implementación junto a la imagen de referencia.

Comparar:

- ancho sidebar;
- altura header;
- altura KPIs;
- tamaño filtros;
- ancho columnas;
- padding cards;
- tipografía;
- botones;
- badges;
- colores;
- banda inferior.

Corregir diferencias evidentes.

---

# 60. Fase 10 — Limpieza

Eliminar:

- CSS obsoleto;
- funciones reemplazadas;
- listeners duplicados;
- variables sin uso;
- componentes antiguos que ya no se usan.

---

# 61. Casos de prueba obligatorios

## Nuevo pedido
Debe aparecer en:
```text
Nuevos / Por aceptar
```

## Aceptar
Debe pasar al estado correspondiente.

## Cocina
Debe mostrarse en:
```text
En cocina
```

## Delivery
Debe pasar a:
```text
En camino / Delivery
```

## Entregado
Debe pasar a:
```text
Entregados hoy
```

## Retrasado
Debe:
- mostrar badge;
- sumar KPI;
- aparecer en alertas.

## Buscar por ID
`RTQ-2048`

## Buscar por cliente
`Milton`

## Buscar por producto
`Promo Duo`

## Filtro WhatsApp
Solo mostrar canal WhatsApp.

## Filtro pago
Aplicar correctamente.

## Limpiar filtros
Restaurar board.

---

# 62. Criterios visuales de aceptación

- [ ] Se parece claramente y de forma muy cercana a la imagen.
- [ ] Sidebar correcto.
- [ ] Pedidos KDS resaltado.
- [ ] Cabecera correcta.
- [ ] 6 KPI cards.
- [ ] Barra de filtros compacta.
- [ ] 4 columnas visibles.
- [ ] Cards compactas.
- [ ] Badges coherentes.
- [ ] Acciones contextualizadas.
- [ ] Alertas inferiores.
- [ ] No hay grandes espacios muertos.
- [ ] No hay componentes desalineados.
- [ ] No hay textos cortados.
- [ ] La pantalla se siente moderna y terminada.

---

# 63. Criterios funcionales de aceptación

- [ ] Los pedidos siguen cargando.
- [ ] Aceptar funciona.
- [ ] Cambiar estado funciona.
- [ ] Marcar entregado funciona.
- [ ] Ver detalle funciona.
- [ ] Buscar funciona.
- [ ] Filtros funcionan.
- [ ] Limpiar filtros funciona.
- [ ] KPIs reflejan datos.
- [ ] Retrasos se calculan.
- [ ] Tiempos se derivan de timestamps.
- [ ] Sonido existente sigue funcionando.
- [ ] Simulación existente sigue funcionando.
- [ ] Recojo mantiene lógica coherente.
- [ ] Delivery mantiene lógica coherente.
- [ ] No se agregó tracking GPS.
- [ ] No hay errores importantes en consola.

---

# 64. Entregable técnico final

Crear:

```text
CAMBIOS_KDS_REDISENO.md
```

Con:

## Archivos modificados
Lista.

## Componentes creados
Lista.

## Lógica reutilizada
Descripción.

## Lógica nueva
Descripción.

## Bugs encontrados
Lista.

## Pendientes de backend
Lista.

## Pruebas realizadas
Lista.

---

# 65. Instrucción final para Antigravity

No interpretar este trabajo como:

> “haz el KDS un poco más bonito”.

El objetivo es:

> **reconstruir la interfaz de Pedidos KDS para que visualmente quede prácticamente igual a la imagen entregada, sin romper la lógica real del proyecto.**

La imagen define la meta visual.

Antes de terminar:

1. ejecutar el proyecto;
2. abrir `Pedidos KDS`;
3. comparar directamente con la imagen;
4. corregir diferencias;
5. validar acciones;
6. validar filtros;
7. validar tiempos y KPIs;
8. revisar consola;
9. limpiar código antiguo.

Si existe conflicto entre la referencia y la arquitectura actual:

1. conservar la funcionalidad real;
2. reproducir la referencia lo máximo posible;
3. documentar cualquier diferencia inevitable.

---

# Resultado final esperado

El módulo debe convertirse en un verdadero:

## **Monitor de Cocina y Despacho en Vivo**

Debe ser:

- moderno;
- compacto;
- rápido;
- visual;
- profesional;
- fácil de operar;
- coherente con RETEQUE-OS;
- listo para demostración;
- suficientemente sólido para evolucionar a producción.

Y visualmente:

> **debe quedar prácticamente igual a la imagen de referencia proporcionada a Antigravity.**
