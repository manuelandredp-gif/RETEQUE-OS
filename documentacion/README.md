# 📚 Centro de Documentación · Retequeños OS

Bienvenido al repositorio central de documentación de **Retequeños OS** (Tacna, Perú). Aquí encontrarás todos los manuales de arquitectura, registros de cambios, especificaciones y guías de desarrollo del proyecto.

---

## 📑 Índice de Documentos

| Documento | Descripción |
|---|---|
| [**BITACORA_AUDITORIAS_Y_MEJORAS.md**](./BITACORA_AUDITORIAS_Y_MEJORAS.md) | **Bitácora de Auditorías (Antes vs. Después)**. Registro técnico integral de vulnerabilidades resueltas, blindaje de seguridad, integridad financiera y 21 pruebas automatizadas. |
| [**ARQUITECTURA_Y_SISTEMA.md**](./ARQUITECTURA_Y_SISTEMA.md) | **Lectura Obligatoria**. Arquitectura integral del sistema, diagrama completo de carpetas, flujos de datos (Mermaid), ciclo de vida de pedidos y subsistemas. |
| [**MEJORAS.md**](./MEJORAS.md) | Catálogo de mejoras aplicadas (App móvil, Web y Auditorías Fase 1 + Fase 2) con comparativa Antes vs. Después. |
| [**CAMBIOS_KDS_REDISENO.md**](./CAMBIOS_KDS_REDISENO.md) | Registro del rediseño del monitor KDS (Kitchen Display System), tarjetas de comandas, cronómetros y semáforos de urgencia. |
| [**CAMBIOS_DASHBOARD_REDISENO.md**](./CAMBIOS_DASHBOARD_REDISENO.md) | Registro del dashboard ejecutivo BI, curvas horarias de ventas, mix de canales y feed de operaciones en vivo. |
| [**CAMBIOS_CUPONES_OFERTAS.md**](./CAMBIOS_CUPONES_OFERTAS.md) | Especificación del motor de cupones, reglas de descuento, planificador semanal y mockup de previsualización en celular. |
| [**PLAN_IMPLEMENTACION_KDS_RETEQUE_OS_ANTIGRAVITY.md**](./PLAN_IMPLEMENTACION_KDS_RETEQUE_OS_ANTIGRAVITY.md) | Especificación detallada de requerimientos funcionales para el Hub de Operaciones KDS. |
| [**RETEQUENOS_PROTOTIPO_FRONT_IMPLEMENTACION.md**](./RETEQUENOS_PROTOTIPO_FRONT_IMPLEMENTACION.md) | Guía de implementación técnica del frontend de la web de pedidos (React 18 + Vite + Tailwind). |

---

## 🚀 Cómo Iniciar los Entornos

1. **Hub Operativo & Prototipo Móvil (Puerto 3000):**
   * Doble clic en `Iniciar app (celular).cmd` en la raíz.
   * Abre [http://localhost:3000](http://localhost:3000) (app móvil) y [http://localhost:3000/admin](http://localhost:3000/admin) (panel admin).
2. **Web de Pedidos (Puerto 5173):**
   * Doble clic en `Compilar web.cmd` (compila TypeScript + Vite).
   * Doble clic en `Iniciar web.cmd` (sirve la web en http://localhost:5173).
