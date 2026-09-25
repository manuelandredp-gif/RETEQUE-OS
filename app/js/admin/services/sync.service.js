// ===================================================
// SERVICE: SINCRONIZACION EN VIVO CON API /api/pedidos
// Con autenticación por PIN, reconexión inteligente y persistencia
// ===================================================

(function() {
  'use strict';

  const TOKEN_KEY = 'RTQ_ADMIN_TOKEN';
  let isSyncing = false;
  let syncTimer = null;
  let pollInterval = 2500;
  let isConnected = false;

  function getAdminToken() {
    try {
      return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || '';
    } catch (e) {
      return '';
    }
  }

  function setAdminToken(token) {
    try {
      localStorage.setItem(TOKEN_KEY, token);
      sessionStorage.setItem(TOKEN_KEY, token);
    } catch (e) {}
  }

  function clearAdminToken() {
    try {
      localStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(TOKEN_KEY);
    } catch (e) {}
  }

  function updateIndicator(status, text) {
    const el = document.getElementById('topbar-live-indicator');
    if (!el) return;

    if (status === 'connected') {
      el.style.borderColor = 'rgba(34, 197, 94, 0.3)';
      el.style.background = 'rgba(34, 197, 94, 0.08)';
      el.style.color = '#15803D';
      el.title = 'Conectado a la base de datos persistente en disco (Node.js)';
      el.innerHTML = `
        <span class="radar-beacon">
          <span class="radar-ping" style="background:#22C55E"></span>
          <span class="radar-dot" style="background:#22C55E"></span>
        </span>
        <span>● En Vivo: Node.js Seguro</span>
      `;
    } else if (status === 'auth_required') {
      el.style.borderColor = 'rgba(245, 166, 35, 0.3)';
      el.style.background = 'rgba(245, 166, 35, 0.08)';
      el.style.color = '#B45309';
      el.title = 'Requiere autenticación con PIN';
      el.innerHTML = `
        <span class="radar-beacon">
          <span class="radar-dot" style="background:#F5A623"></span>
        </span>
        <span>🔒 Requiere PIN Admin</span>
      `;
    } else {
      el.style.borderColor = 'rgba(239, 68, 68, 0.3)';
      el.style.background = 'rgba(239, 68, 68, 0.08)';
      el.style.color = '#B91C1C';
      el.title = 'Servidor local desconectado o no disponible';
      el.innerHTML = `
        <span class="radar-beacon">
          <span class="radar-dot" style="background:#EF4444"></span>
        </span>
        <span>⚠ Servidor Offline</span>
      `;
    }
  }

  function showAdminAuthModal() {
    const modal = document.getElementById('modal-admin-auth');
    if (modal) {
      modal.classList.add('open');
      const input = document.getElementById('input-admin-pin');
      if (input) {
        input.value = '';
        setTimeout(() => input.focus(), 100);
      }
      const err = document.getElementById('auth-error-msg');
      if (err) err.style.display = 'none';
    }
    updateIndicator('auth_required');
  }

  function hideAdminAuthModal() {
    const modal = document.getElementById('modal-admin-auth');
    if (modal) modal.classList.remove('open');
  }

  async function handleAdminLogin(event) {
    if (event) event.preventDefault();
    const input = document.getElementById('input-admin-pin');
    const errEl = document.getElementById('auth-error-msg');
    if (!input) return;

    const pin = input.value.trim();
    if (!pin) return;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin })
      });

      const data = await res.json();
      if (res.ok && data.ok && data.token) {
        setAdminToken(data.token);
        hideAdminAuthModal();
        if (window.showToast) window.showToast('✅ Acceso autorizado al Hub Operativo');
        syncOrders();
      } else {
        if (errEl) {
          errEl.textContent = data.error || 'PIN incorrecto. Inténtalo de nuevo.';
          errEl.style.display = 'block';
        }
      }
    } catch (err) {
      if (errEl) {
        errEl.textContent = 'Error de conexión con el servidor.';
        errEl.style.display = 'block';
      }
    }
  }

  async function syncOrders() {
    if (isSyncing) return;
    isSyncing = true;

    try {
      const token = getAdminToken();
      const headers = {
        'Cache-Control': 'no-store'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        headers['x-admin-token'] = token;
      }

      const res = await fetch('/api/pedidos', { headers });

      if (res.status === 401) {
        updateIndicator('auth_required');
        showAdminAuthModal();
        return;
      }

      if (res.ok) {
        const remoteOrders = await res.json();
        if (Array.isArray(remoteOrders)) {
          if (!isConnected) {
            isConnected = true;
            updateIndicator('connected');
          }

          const previousIds = new Set(window.ORDERS.map(o => o.id));
          const hasNew = remoteOrders.some(r => !previousIds.has(r.id) && r.status === 'new');
          const isFirstSync = window.ORDERS.length === 0 || previousIds.size === 0;
          const hasDifference = JSON.stringify(window.ORDERS) !== JSON.stringify(remoteOrders);

          if (hasDifference) {
            window.ORDERS = remoteOrders;
            if (window.saveOrdersData) window.saveOrdersData();
            if (window.renderKanban) {
              if (window.requestAnimationFrame) {
                window.requestAnimationFrame(() => window.renderKanban());
              } else {
                window.renderKanban();
              }
            }

            if (hasNew && !isFirstSync) {
              if (window.playAlertSound) window.playAlertSound();
              if (window.showToast) window.showToast('🔥 ¡NUEVO PEDIDO RECIBIDO Y GUARDADO EN DISCO!');
            }
          }
        }
      } else {
        isConnected = false;
        updateIndicator('offline');
      }
    } catch (err) {
      isConnected = false;
      updateIndicator('offline');
    } finally {
      isSyncing = false;
      clearTimeout(syncTimer);
      syncTimer = setTimeout(syncOrders, pollInterval);
    }
  }

  // Optimización de energía: si la pestaña está oculta, reducir la frecuencia de polling
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      pollInterval = 12000;
    } else {
      pollInterval = 2500;
      syncOrders();
    }
  });

  // Funciones exportadas al contexto global
  window.startOrderSync = function() {
    syncOrders();
  };
  window.showAdminAuthModal = showAdminAuthModal;
  window.hideAdminAuthModal = hideAdminAuthModal;
  window.handleAdminLogin = handleAdminLogin;
  window.getAdminToken = getAdminToken;
})();
