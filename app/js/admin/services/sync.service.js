// ===================================================
// SERVICE: SINCRONIZACION EN VIVO CON API /api/pedidos
// ===================================================

    // Sincronización en vivo inteligente y optimizada con la API
    function startOrderSync() {
      let isSyncing = false;
      let syncTimer = null;
      let pollInterval = 2500;

      async function syncOrders() {
        if (isSyncing) return;
        isSyncing = true;

        try {
          const res = await fetch('/api/pedidos', { cache: 'no-store' });
          if (res.ok) {
            const remoteOrders = await res.json();
            if (Array.isArray(remoteOrders)) {
              let hasNew = false;
              remoteOrders.forEach(rem => {
                const exists = ORDERS.some(o => o.id === rem.id);
                if (!exists) {
                  ORDERS.unshift(rem);
                  hasNew = true;
                }
              });
              if (hasNew) {
                if (window.saveOrdersData) window.saveOrdersData();
                if (window.requestAnimationFrame) {
                  window.requestAnimationFrame(() => {
                    renderKanban();
                  });
                } else {
                  renderKanban();
                }
                playAlertSound();
                showToast('🔥 ¡NUEVO PEDIDO RECIBIDO DESDE LA APP MÓVIL!');
              }
            }
          }
        } catch (err) {
          // Silently handle offline/intermittent drops
        } finally {
          isSyncing = false;
          // Re-schedule dynamically
          clearTimeout(syncTimer);
          syncTimer = setTimeout(syncOrders, pollInterval);
        }
      }

      // Optimización: Si la pestaña no está visible, reducir frecuencia a 12s para ahorrar CPU y batería
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          pollInterval = 12000;
        } else {
          pollInterval = 2500;
          syncOrders(); // Re-sincronizar de inmediato al volver a la pestaña
        }
      });

      syncOrders();
    }

window.startOrderSync = startOrderSync;
