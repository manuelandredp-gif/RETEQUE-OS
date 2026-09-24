// ===================================================
// TOAST SERVICE - Notificaciones en pantalla
// ===================================================

function showToast(msg) {
  const toast = document.getElementById('toast');
  const textEl = document.getElementById('toast-text');
  if (!toast || !textEl) return;
  textEl.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3200);
}

window.showToast = showToast;
