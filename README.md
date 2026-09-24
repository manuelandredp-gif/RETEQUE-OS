# Retequeños · Ecosistema Digital (Retequeños OS)

Sistema integral de comercio electrónico y gestión operativa para **Retequeños** (Tacna, Perú). Incluye web de pedidos por WhatsApp, prototipo navegable de la app móvil y hub administrativo con monitor KDS de cocina en tiempo real.

---

## 📂 Estructura General del Proyecto

| Carpeta | Descripción |
|---|---|
| [**`documentacion/`**](./documentacion/README.md) | **Centro de Documentación Oficial**. Contiene la [arquitectura técnica y diagramas](./documentacion/ARQUITECTURA_Y_SISTEMA.md), bitácoras de rediseño KDS, catálogo de mejoras y especificaciones. |
| [**`app/`**](./app/) | **Hub Operativo & App Móvil**. Panel de administración modular ([`admin.html`](./app/admin.html)) con monitor KDS, control de stock y métricas BI, junto al prototipo navegable de 26 pantallas ([`index.html`](./app/index.html)). |
| [**`web/`**](./web/) | **Web de Pedidos**. React 18 + Vite 6 + Tailwind CSS + Zustand. Catálogo modularizado, configurador dinámico de promos/pizzas/tequeños y checkout por WhatsApp. |
| [**`tools/`**](./tools/) | **Utilidades**. Servidores locales en PowerShell nativo (`serve-app.ps1`, `serve-web.ps1`) y lanzador de Node integrado (`node.cmd`). |
| [**`capturas/`**](./capturas/) | Registro visual del sistema antes y después de las mejoras. |

---

## 🏗️ Arquitectura Modular

El proyecto fue completamente reestructurado bajo una **arquitectura por dominios y capas** para eliminar la deuda técnica de archivos monolíticos:

* **Hub Operativo ([`app/admin.html`](./app/admin.html)):** Pasó de 7,534 líneas a 1,841 líneas limpias. Sus estilos se organizaron en 7 hojas modulares en [`app/css/admin/`](./app/css/admin/) y su lógica en 14 submódulos en [`app/js/admin/`](./app/js/admin/).
* **App Móvil ([`app/index.html`](./app/index.html)):** Reducida de 2,040 a 1,406 líneas limpias. Su lógica monolítica se desacopló en submódulos especializados en [`app/js/mobile/`](./app/js/mobile/) (`state.js`, `order.service.js`, `catalog.module.js`, `cart.module.js`, `checkout.module.js`, `tracking.module.js`, `profile.module.js` y `app.js`).
* **Configurador Web ([`ProductConfiguratorModal.tsx`](./web/src/components/configurator/)):** Subdividido en 5 pasos de acordeón independientes, datos aislados y un modal de WhatsApp dedicado.
* **Catálogo Web ([`catalog.ts`](./web/src/data/catalog.ts)):** Desacoplado en submódulos por categoría en [`web/src/data/catalog/`](./web/src/data/catalog/).
* **Carrito ([`CartDrawer.tsx`](./web/src/components/cart/)):** Separado en fila de ítem, formulario del cliente y footer.

> Consulta el documento maestro de arquitectura: [**`documentacion/ARQUITECTURA_Y_SISTEMA.md`**](./documentacion/ARQUITECTURA_Y_SISTEMA.md).

---

## 🚀 Cómo Ejecutar el Sistema

### 1. Hub Operativo (KDS + Admin) y Prototipo Móvil
* **Desde Windows (Sin Node ni instalaciones):**  
  Doble clic en `Iniciar app (celular).cmd`.  
  * **App móvil:** [http://localhost:3000](http://localhost:3000) (o desde tu celular en la misma WiFi con la IP mostrada en consola).
  * **Panel Administrador & KDS:** [http://localhost:3000/admin](http://localhost:3000/admin)
  * **API de Pedidos en Memoria:** [http://localhost:3000/api/pedidos](http://localhost:3000/api/pedidos)

### 2. Web de Pedidos (React + Vite)
* **Desarrollo:**
  ```bash
  cd web
  npm install
  npm run dev        # Disponible en http://localhost:5173
  ```
* **Compilación y Servidor Local (Sin Node externo):**
  * Ejecuta `Compilar web.cmd` (compila con el Node integrado de Antigravity IDE).
  * Ejecuta `Iniciar web.cmd` (sirve `web/dist` en http://localhost:5173).

---

## 📌 Datos de Configuración del Negocio

* **Web:** Todo se centraliza en [`web/src/config/site.ts`](./web/src/config/site.ts) (WhatsApp, dirección, horario, redes sociales y número de Yape).
* **Prototipo Móvil:** En la constante `STORE` de [`app/js/mobile/data.js`](./app/js/mobile/data.js).
