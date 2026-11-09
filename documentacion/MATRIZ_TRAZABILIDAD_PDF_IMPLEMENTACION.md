# Matriz de trazabilidad: documentos PDF a implementación

Actualizada el 9 de noviembre de 2026. La fuente funcional prioritaria es el SRS v1.1 y el SAD v2.0, por ser posteriores a la propuesta comercial de septiembre. Cuando los documentos discrepan, se conserva el alcance MVP más reciente: PWA, Node.js, JSON local y n8n solo para despacho supervisado.

| Área | Evidencia en los PDF | Implementación verificable | Estado |
| --- | --- | --- | --- |
| Carta, búsqueda, detalle y configurador | RF-01, RF-02 | `web/src/pages/`, `web/src/components/configurator/` | Implementado |
| Carrito persistente, cupón y pedido por WhatsApp | RF-03 a RF-05 | Zustand, checkout y `web/src/lib/whatsapp.ts` | Implementado |
| App PWA navegable | RF-06 a RF-09 | `app/index.html`, manifest y service worker | Implementado como PWA; no es app nativa |
| KDS, pago manual y ticket | RF-10 a RF-13 | `app/admin.html`, módulos KDS y API | Implementado |
| Flujo de despacho | RN-02, RF-14, SAD v2.0 | API con `new → kitchen → ready → published → assigned → delivered` | Implementado; n8n requiere configuración externa |
| Privacidad y pago digital | RNF-01 a RNF-04, RN-03 | PIN, rate limit, sanitización, PII protegido y pago manual | Implementado |
| Privacidad y reclamos | Factibilidad legal, Ley N.° 29733 y Ley N.° 29571 | Política visible, Libro de Reclamaciones con caso trazable y consulta solo administrativa | Implementado |
| Carta, stock, cupones, encuestas y métricas | RF-15 a RF-17 | módulos Admin y catálogos persistentes | Implementado |
| Lanzadores y regresión | RF-18, RNF-10, RNF-11 | `.cmd`, `tools/test-system.js` | Implementado; 29 pruebas |
| Respaldos locales | RNF-05, RNF-11 y factibilidad | Copia diaria local antes de la primera escritura y retención de 7 días en `data/backups/` | Implementado |
| Operación cloud | Propuesta y factibilidad | No se activa automáticamente para no crear servicios/costos sin aprobación | Pendiente de infraestructura |
| Publicación Android/iOS, push y mapas reales | Propuesta inicial | El proyecto vigente solo entrega PWA; requiere cuentas, proveedor y publicación | Evolución aprobable |

## Configuración opcional de n8n

El servidor mantiene despacho manual si no existen estas variables. Para conectar el flujo `Despacho` de n8n sin exponer datos personales en el grupo de motorizados, configurar antes de iniciar el servidor:

```powershell
$env:RTQ_N8N_WEBHOOK_URL = 'http://127.0.0.1:5678/webhook/despacho'
$env:RTQ_N8N_SERVICE_TOKEN = 'un-secreto-largo-y-unico'
node tools/server.js --lan
```

Al pasar un pedido delivery a `ready`, el servidor envía al webhook solo el identificador y el total operativo. n8n debe usar `X-N8N-Token` para consultar el pedido individual y actualizarlo a `published`, `assigned` (incluyendo motorizado) y `delivered`. La verificación de pago sigue limitada a una sesión de administrador.

## Controles añadidos

- El servidor rechaza saltos de estado y evita cocina sin pago digital verificado.
- La API permite persistir y auditar la asignación del motorizado.
- El webhook se limita a HTTPS o a `localhost`/`127.0.0.1` y agota la espera en 3 segundos.
- La suite cubre ahora el ciclo íntegro de despacho, además de seguridad, persistencia e integridad financiera.
- Los pedidos validan nombre, celular peruano, dirección delivery, número de líneas y límites de cantidad; los reintentos conservan la primera comanda (idempotencia).
- `GET /api/health` permite verificar disponibilidad sin publicar datos personales.
