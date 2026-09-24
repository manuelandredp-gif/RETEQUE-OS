// ===================================================
// MODULE: CLIENTES & NOTIFICACIONES PUSH
// ===================================================

    function updatePushPreview() {
      const title = document.getElementById('push-title-input').value;
      const desc = document.getElementById('push-desc-input').value;
      document.getElementById('preview-push-title').textContent = title || 'Título de Notificación';
      document.getElementById('preview-push-desc').textContent = desc || 'Cuerpo del mensaje...';
    }

    function handleSendPush(e) {
      e.preventDefault();
      playAlertSound();
      showToast('🚀 Notificación Push enviada exitosamente a 1,240 dispositivos');
    }


window.updatePushPreview = updatePushPreview;
window.handleSendPush = handleSendPush;
