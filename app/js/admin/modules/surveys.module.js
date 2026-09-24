// ===================================================
// MODULE: ENCUESTAS Y RESEÑAS DE CLIENTES
// ===================================================

    function renderSurveys() {
      const kp = document.getElementById('survey-kpis');
      const total = REVIEWS.length || 1;
      const avg = (REVIEWS.reduce((a, r) => a + r.stars, 0) / total).toFixed(1);
      const good = REVIEWS.filter(r => r.stars >= 4).length;
      const toGoogle = REVIEWS.filter(r => r.google).length;
      const coupons = REVIEWS.filter(r => r.coupon).length;
      if (kp) kp.innerHTML = [
        ['Respuestas recibidas', REVIEWS.length + ' encuestas', 'Última hace 20 min · vía App y QR', 'var(--primary)', '#FFF0F1'],
        ['Calificación promedio', avg + ' ★', `${Math.round(good / total * 100)}% dieron 4-5 ★`, 'var(--gold)', '#FFF3DF'],
        ['Enviados a Google Reviews', toGoogle + ' clientes', 'Regla: 4-5 ★ → invitación automática', 'var(--success)', '#E7F6EE'],
        ['Cupones entregados', coupons + ' × ENCUESTA3', 'S/ 3.00 c/u · vence 30 sep.', 'var(--info)', '#E6F4FB']
      ].map(k => `
        <div class="kpi-card">
          <div class="kpi-header"><span class="kpi-title">${k[0]}</span><div class="kpi-icon-wrap" style="color:${k[3]};background:${k[4]}">📋</div></div>
          <div class="kpi-value">${k[1]}</div>
          <div class="kpi-trend" style="color:var(--text-muted)"><span>${k[2]}</span></div>
        </div>`).join('');

      const sl = document.getElementById('surveys-list-container');
      if (sl) sl.innerHTML = SURVEYS.map(s => `
        <div class="coupon-card">
          <div class="coupon-badge-code" style="font-size:11px;">${s.id}</div>
          <div class="coupon-meta">
            <div class="coupon-title">${s.title}</div>
            <div class="coupon-desc">Hasta ${s.until.split('-').reverse().join('/')} · ${s.responses} respuestas · ${s.coupons} cupones ${s.couponCode || ''} · ${s.google ? '4-5★ → Google' : 'sin Google'}</div>
            <div class="coupon-desc" style="font-family:monospace;">🔗 ${s.link}</div>
          </div>
          <div><label class="switch"><input type="checkbox" ${s.active ? 'checked' : ''} onchange="toggleSurvey('${s.id}', this.checked)"><span class="slider"></span></label></div>
        </div>`).join('');

      renderReviews();
      renderDashboardFeedback();
    }

    function renderReviews() {
      const f = (document.getElementById('rv-filter') || {}).value || 'all';
      const rows = REVIEWS.filter(r => f === 'all' || r.source === f);
      const tb = document.getElementById('reviews-table-body');
      if (!tb) return;
      tb.innerHTML = rows.map(r => `
        <tr>
          <td style="white-space:nowrap;">${r.date}</td>
          <td style="font-family:monospace;">${r.order}</td>
          <td>${r.customer}</td>
          <td style="white-space:nowrap;">${starsHtml(r.stars)}</td>
          <td><span class="col-badge badge-blue">${r.source}</span></td>
          <td>${r.improve.length ? r.improve.map(t => `<span class="col-badge badge-orange" style="margin:1px;">${t}</span>`).join(' ') : '<span style="color:var(--text-light)">—</span>'}</td>
          <td style="font-size:12px; max-width:260px;">${r.comment}</td>
          <td>${r.coupon ? `<span class="col-badge badge-green">${r.coupon}</span>` : '—'}</td>
          <td>${r.google ? '✅ Sí' : '<span style="color:var(--text-light)">No</span>'}</td>
        </tr>`).join('') || '<tr><td colspan="9" style="text-align:center; padding:24px; color:var(--text-muted);">Sin respuestas para este filtro.</td></tr>';
    }

    function toggleSurvey(id, active) {
      const s = SURVEYS.find(x => x.id === id);
      if (s) { s.active = active; showToast(`Encuesta ${id} ${active ? 'ACTIVADA' : 'PAUSADA'} en la App y el QR`); }
    }

    function handleCreateSurvey(e) {
      e.preventDefault();
      const title = document.getElementById('sv-title').value.trim();
      const until = document.getElementById('sv-until').value;
      const reward = parseFloat(document.getElementById('sv-reward').value) || 0;
      const couponUntil = document.getElementById('sv-coupon-until').value;
      const google = document.getElementById('sv-google').value === '1';
      const id = 'SV-' + Date.now().toString().slice(-5);
      const couponCode = reward ? ('ENCUESTA' + reward) : '';
      SURVEYS.unshift({ id, title, until, reward, couponCode, couponUntil, google, responses: 0, coupons: 0, active: true, link: 'retequenos.com/encuesta/' + id.toLowerCase() });
      if (reward && !COUPONS.some(c => c.code === couponCode)) {
        COUPONS.unshift({ code: couponCode, type: 'fixed', val: reward, min: 15, uses: 0, limit: 999, active: true, expires: couponUntil, label: `S/ ${reward.toFixed(2)} OFF por completar encuesta` });
        renderCoupons();
      }
      document.getElementById('sv-link').textContent = 'retequenos.com/encuesta/' + id.toLowerCase();
      renderSurveys();
      playAlertSound();
      showToast(`📋 Encuesta "${title}" publicada · QR y cupón ${couponCode || 'sin recompensa'} listos`);
    }

    function exportReviewsCSV() {
      const head = ['Fecha', 'Pedido', 'Cliente', 'Estrellas', 'Donde nos vio', 'Que mejorar', 'Comentario', 'Cupon', 'Google Review'];
      const lines = REVIEWS.map(r => [r.date, r.order, r.customer, r.stars, r.source, r.improve.join(' | '), r.comment, r.coupon || '', r.google ? 'Si' : 'No']
        .map(v => '"' + String(v).replace(/"/g, '""') + '"').join(';'));
      const blob = new Blob(['﻿' + [head.join(';')].concat(lines).join('\r\n')], { type: 'text/csv;charset=utf-8;' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'retequenos-encuestas.csv';
      document.body.appendChild(a); a.click(); a.remove();
      showToast('⬇ Excel (CSV) de encuestas descargado');
    }


window.renderSurveys = renderSurveys;
window.renderReviews = renderReviews;
window.toggleSurvey = toggleSurvey;
window.handleCreateSurvey = handleCreateSurvey;
window.exportReviewsCSV = exportReviewsCSV;
