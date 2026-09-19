# Retequeños · Ecosistema digital (MVP)

Web de pedidos por WhatsApp y prototipo de app móvil para **Retequeños** (Tacna, Perú).

| Carpeta | Qué es |
|---|---|
| `web/` | Web de pedidos: React 18 + Vite 6 + Tailwind 3 + Zustand. Catálogo, promos configurables, carrito y envío del pedido por WhatsApp. |
| `app/` | Prototipo navegable de la app móvil (26 pantallas) + panel administrador con API de pedidos en memoria. Abierto desde un celular se ve a pantalla completa. |
| `tools/` | Servidores locales en PowerShell (sin Node), compilador y scripts de parche. |
| `capturas/` | Capturas de pantalla antes y después. |
| `MEJORAS.md` | Las 30 mejoras aplicadas a la app y las 30 aplicadas a la web, con prioridad MVP. |

## Cómo correrlo

### Web

```bash
cd web
npm install
npm run dev        # desarrollo en http://localhost:5173
npm run build      # genera web/dist para subir a cualquier hosting estático
```

Sin Node instalado (Windows): `Compilar web.cmd` usa el Node integrado de Antigravity IDE a través de `tools\node.cmd`, y `Iniciar web.cmd` sirve `web/dist` en http://localhost:5173.

### App móvil (prototipo) y panel admin

`Iniciar app (celular).cmd` levanta http://localhost:3000 (app) y http://localhost:3000/admin (panel). Muestra la IP local para abrirla desde un celular en la misma red WiFi.

## Datos del negocio

Todo lo que aparece en la web sale de `web/src/config/site.ts` (WhatsApp, dirección, horario, redes, número de Yape). En el prototipo, la constante `STORE` al inicio del script de `app/index.html`. Los valores marcados con `confirmar` deben validarse con Retequeños antes de publicar.

## Estado

MVP funcional: catálogo completo (carta 2026), promos con reglas por datos, carrito persistente, validación de datos del cliente y pedido por WhatsApp. Pendiente: fotos en alta resolución, confirmación de dirección, horario y Yape, y conexión del panel admin a un backend real.
