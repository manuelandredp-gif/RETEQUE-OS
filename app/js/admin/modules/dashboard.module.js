// ===================================================
// MODULE: DASHBOARD, METRICAS & GRAFICOS CHART.JS
// ===================================================

    let chartHourlyInstance = null;
    let chartChannelsInstance = null;
    let chartAttributionInstance = null;
    let currentCurvePeriod = 'hoy';

    // Curva de ventas nativa en HTML5 Canvas (100% resiliente y offline)
    function renderNativeSalesCurve(period = 'hoy') {
      const canvas = document.getElementById('chart-hourly-sales');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const width = rect.width || canvas.parentElement?.clientWidth || 600;
      const height = rect.height || 240;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      const labels = ['14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
      const data = period === 'hoy'
        ? [70, 110, 180, 230, 370, 610, 862, 730, 470, 180]
        : [450, 720, 1200, 1680, 2540, 4100, 6200, 4900, 3100, 1150];
      const maxVal = period === 'hoy' ? 900 : 6500;

      ctx.clearRect(0, 0, width, height);

      const paddingLeft = 46;
      const paddingRight = 20;
      const paddingTop = 25;
      const paddingBottom = 28;
      const chartW = width - paddingLeft - paddingRight;
      const chartH = height - paddingTop - paddingBottom;

      // Líneas de cuadrícula y eje Y
      ctx.strokeStyle = '#F3F4F6';
      ctx.lineWidth = 1;
      ctx.fillStyle = '#9CA3AF';
      ctx.font = '500 10.5px Inter, system-ui, sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';

      const steps = 4;
      for (let i = 0; i <= steps; i++) {
        const y = paddingTop + (chartH / steps) * i;
        const val = Math.round(maxVal - (maxVal / steps) * i);
        ctx.beginPath();
        ctx.moveTo(paddingLeft, y);
        ctx.lineTo(width - paddingRight, y);
        ctx.stroke();
        ctx.fillText('S/ ' + val, paddingLeft - 8, y);
      }

      // Puntos de la curva
      const points = data.map((val, idx) => {
        const x = paddingLeft + (chartW / (data.length - 1)) * idx;
        const y = paddingTop + chartH - (val / maxVal) * chartH;
        return { x, y, val, label: labels[idx] };
      });

      // Relleno degradado suave
      const grad = ctx.createLinearGradient(0, paddingTop, 0, paddingTop + chartH);
      grad.addColorStop(0, 'rgba(239, 68, 68, 0.16)');
      grad.addColorStop(1, 'rgba(239, 68, 68, 0.005)');

      ctx.beginPath();
      ctx.moveTo(points[0].x, paddingTop + chartH);
      ctx.lineTo(points[0].x, points[0].y);
      for (let i = 0; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
      }
      ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
      ctx.lineTo(points[points.length - 1].x, paddingTop + chartH);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      // Trazo de la curva roja con resplandor neón
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 0; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
      }
      ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
      ctx.shadowColor = 'rgba(239, 68, 68, 0.45)';
      ctx.shadowBlur = 12;
      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 2.8;
      ctx.stroke();
      ctx.restore();

      // Puntos y etiquetas del eje X
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      points.forEach((pt) => {
        // Label hora
        ctx.fillStyle = '#9CA3AF';
        ctx.fillText(pt.label, pt.x, paddingTop + chartH + 8);

        // Círculo del punto con brillo
        ctx.save();
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = '#EF4444';
        ctx.shadowColor = 'rgba(239, 68, 68, 0.6)';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#FFFFFF';
        ctx.stroke();
        ctx.restore();
      });
    }

    function initCharts() {
      // Si Chart.js aún no está cargado, dibujamos la curva nativa de inmediato y reintentamos
      if (typeof Chart === 'undefined') {
        renderNativeSalesCurve(currentCurvePeriod);
        setTimeout(initCharts, 300);
        return;
      }

      try {
        const ctxHourly = document.getElementById('chart-hourly-sales');
        if (ctxHourly) {
          if (chartHourlyInstance) chartHourlyInstance.destroy();
          const isHoy = currentCurvePeriod === 'hoy';
          chartHourlyInstance = new Chart(ctxHourly, {
            type: 'line',
            data: {
              labels: ['14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
              datasets: [{
                label: 'Ventas (Soles)',
                data: isHoy
                  ? [70, 110, 180, 230, 370, 610, 862, 730, 470, 180]
                  : [450, 720, 1200, 1680, 2540, 4100, 6200, 4900, 3100, 1150],
                borderColor: '#EF4444',
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                borderWidth: 2.5,
                fill: true,
                tension: 0.38,
                pointBackgroundColor: '#EF4444',
                pointBorderColor: '#FFFFFF',
                pointBorderWidth: 2,
                pointRadius: 4.5,
                pointHoverRadius: 6.5
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: {
                  backgroundColor: '#111827',
                  padding: 8,
                  titleFont: { size: 11, weight: 'bold' },
                  bodyFont: { size: 12 },
                  callbacks: {
                    label: ctx => `Ventas: S/ ${ctx.parsed.y.toFixed(2)}`
                  }
                }
              },
              scales: {
                y: {
                  min: 0,
                  max: isHoy ? 900 : 6500,
                  grid: { color: '#F3F4F6' },
                  ticks: {
                    stepSize: isHoy ? 100 : 1000,
                    font: { size: 10.5, weight: '500' },
                    color: '#9CA3AF',
                    callback: v => 'S/ ' + v
                  }
                },
                x: {
                  grid: { display: false },
                  ticks: {
                    font: { size: 10.5, weight: '500' },
                    color: '#9CA3AF'
                  }
                }
              }
            }
          });
        }

        // Mix de Pedidos por Canal (Doughnut)
        const ctxChannels = document.getElementById('chart-channels-mix');
        if (ctxChannels) {
          if (chartChannelsInstance) chartChannelsInstance.destroy();
          chartChannelsInstance = new Chart(ctxChannels, {
            type: 'doughnut',
            data: {
              labels: ['WhatsApp Delivery', 'Recojo en tienda', 'Consumo local', 'Promociones/campañas'],
              datasets: [{
                data: [46, 34, 12, 8],
                backgroundColor: ['#EF4444', '#10B981', '#F59E0B', '#8B5CF6'],
                borderWidth: 2.5,
                borderColor: '#FFFFFF'
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    label: ctx => `${ctx.label}: ${ctx.parsed}%`
                  }
                }
              },
              cutout: '72%'
            }
          });
        }

        // Origen de la publicidad: "¿Cómo nos conocieron?"
        const ctxAttr = document.getElementById('chart-attribution');
        if (ctxAttr) {
          if (chartAttributionInstance) chartAttributionInstance.destroy();
          chartAttributionInstance = new Chart(ctxAttr, {
            type: 'doughnut',
            data: {
              labels: ATTRIBUTION.map(a => a.source),
              datasets: [{
                data: ATTRIBUTION.map(a => a.pct),
                backgroundColor: ATTRIBUTION.map(a => a.color),
                borderWidth: 2,
                borderColor: '#FFFFFF'
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              cutout: '70%'
            }
          });
        }
      } catch (err) {
        console.warn('[Dashboard] Falló Chart.js, recurriendo a Canvas nativo:', err);
        renderNativeSalesCurve(currentCurvePeriod);
      }
    }

    // Toggle período en la curva de ventas
    function setSalesCurvePeriod(period) {
      currentCurvePeriod = period;
      const btnHoy = document.getElementById('btn-curve-hoy');
      const btnSemana = document.getElementById('btn-curve-semana');
      const tooltip = document.getElementById('dash-peak-tooltip');
      
      if (period === 'hoy') {
        if (btnHoy) {
          btnHoy.style.background = '#FFF0F1';
          btnHoy.style.color = '#EF4444';
          btnHoy.style.fontWeight = '700';
        }
        if (btnSemana) {
          btnSemana.style.background = 'transparent';
          btnSemana.style.color = '#6B7280';
          btnSemana.style.fontWeight = '600';
        }
        if (chartHourlyInstance) {
          chartHourlyInstance.data.datasets[0].data = [70, 110, 180, 230, 370, 610, 862, 730, 470, 180];
          chartHourlyInstance.options.scales.y.max = 900;
          chartHourlyInstance.options.scales.y.ticks.stepSize = 100;
          chartHourlyInstance.update();
        } else {
          renderNativeSalesCurve('hoy');
        }
        if (tooltip) {
          tooltip.style.display = 'block';
          tooltip.innerHTML = `
            <div class="dash-chart-tooltip-title">Pico de ventas</div>
            <div class="dash-chart-tooltip-val">S/ 862.00</div>
            <div class="dash-chart-tooltip-time">20:00 hrs</div>
          `;
        }
      } else {
        if (btnSemana) {
          btnSemana.style.background = '#FFF0F1';
          btnSemana.style.color = '#EF4444';
          btnSemana.style.fontWeight = '700';
        }
        if (btnHoy) {
          btnHoy.style.background = 'transparent';
          btnHoy.style.color = '#6B7280';
          btnHoy.style.fontWeight = '600';
        }
        if (chartHourlyInstance) {
          chartHourlyInstance.data.datasets[0].data = [450, 720, 1200, 1680, 2540, 4100, 6200, 4900, 3100, 1150];
          chartHourlyInstance.options.scales.y.max = 6500;
          chartHourlyInstance.options.scales.y.ticks.stepSize = 1000;
          chartHourlyInstance.update();
        } else {
          renderNativeSalesCurve('semana');
        }
        if (tooltip) {
          tooltip.style.display = 'block';
          tooltip.innerHTML = `
            <div class="dash-chart-tooltip-title">Pico semanal</div>
            <div class="dash-chart-tooltip-val">S/ 6,200.00</div>
            <div class="dash-chart-tooltip-time">Sábado 20:00</div>
          `;
        }
      }
    }

    // Redibujar curva nativa en resize con throttling vía requestAnimationFrame
    let resizeRafId = null;
    window.addEventListener('resize', () => {
      if (chartHourlyInstance) return;
      if (resizeRafId) cancelAnimationFrame(resizeRafId);
      resizeRafId = requestAnimationFrame(() => {
        renderNativeSalesCurve(currentCurvePeriod);
      });
    }, { passive: true });

    function renderTopProducts(period) {
      const list = TOP_PRODUCTS[period] || TOP_PRODUCTS.hoy;
      const max = list[0].orders;
      const colors = ['#FF2442', '#F59E0B', '#8B5CF6', '#10B981', '#06B6D4'];
      const el = document.getElementById('top-products-list');
      if (!el) return;
      el.innerHTML = list.map((p, i) => `
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px; font-size:13px;">
            <span style="font-weight:700; color:#111827;">${i + 1}. ${p.icon} ${p.name}</span>
            <span style="font-weight:700; ${i === 0 ? 'color:#EF4444;' : 'color:#111827;'}">${p.orders} órdenes - S/ ${p.sales.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div style="height:7px; background:#F3F4F6; border-radius:999px; overflow:hidden;">
            <div style="width:${Math.round(p.orders / max * 100)}%; height:100%; background:${colors[i]}; border-radius:999px;"></div>
          </div>
        </div>`).join('');
      
      const sub = document.getElementById('top-products-subtitle');
      if (sub) sub.textContent = period === 'mes' ? 'Acumulado del mes - base para decidir promos y pauta' : 'Órdenes despachadas hoy - base para decidir promos y pauta';
      
      ['hoy', 'mes'].forEach(k => {
        const b = document.getElementById('top-btn-' + k);
        if (!b) return;
        const on = k === period;
        b.classList.toggle('active', on);
        b.style.background = on ? '#FFF0F1' : 'transparent';
        b.style.color = on ? '#EF4444' : '#6B7280';
        b.style.fontWeight = on ? '700' : '600';
      });
    }

    function starsHtml(n) {
      return '<span style="color:#F59E0B; letter-spacing:1px;">' + '★'.repeat(n) + '</span><span style="color:#E5E7EB; letter-spacing:1px;">' + '★'.repeat(5 - n) + '</span>';
    }

    function renderDashboardFeedback() {
      const lg = document.getElementById('attribution-legend');
      if (lg) lg.innerHTML = ATTRIBUTION.map(a => `
        <div style="display:flex; align-items:center; justify-content:space-between; font-size:12px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="width:9px; height:9px; border-radius:50%; background:${a.color}; flex-shrink:0;"></span>
            <span style="color:#374151; font-weight:500;">${a.source}</span>
          </div>
          <strong style="color:#111827;">${a.pct}%</strong>
        </div>`).join('');

      const rl = document.getElementById('dashboard-reviews-list');
      if (rl) rl.innerHTML = REVIEWS.slice(0, 4).map(r => `
        <div class="dash-review-card">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:flex-start; font-size:11.5px; gap:6px;">
              <div>
                <span style="font-weight:700; color:#111827;">${r.customer}</span>
                <span style="color:#9CA3AF; margin:0 2px;">•</span>
                <span style="color:#6B7280;">${r.order}</span>
              </div>
              <div>${starsHtml(r.stars)}</div>
            </div>
            <div style="font-size:10.5px; color:#9CA3AF; margin-top:1px;">${r.date}</div>
            <div style="font-size:12px; color:#374151; margin-top:8px; line-height:1.35; font-style:italic;">“${r.comment}”</div>
          </div>
          <div style="display:flex; gap:5px; margin-top:10px; flex-wrap:wrap;">
            <span style="background:#EFF6FF; color:#2563EB; font-size:10px; font-weight:600; padding:2px 7px; border-radius:4px;">${r.source}</span>
            ${r.improve.map(t => `<span style="background:#FEF3C7; color:#D97706; font-size:10px; font-weight:600; padding:2px 7px; border-radius:4px;">${t}</span>`).join('')}
            ${r.google ? '<span style="background:#ECFDF5; color:#059669; font-size:10px; font-weight:600; padding:2px 7px; border-radius:4px;">★ Enviado a Google</span>' : ''}
          </div>
        </div>`).join('');

      const counts = {
        'Cremas': 1,
        'Tiempo de entrega': 1,
        'Atención': 1,
        'Temperatura': 1,
        'Empaque': 1
      };
      const tp = document.getElementById('improve-topics');
      if (tp) tp.innerHTML = Object.keys(counts).map(t => `
        <span style="background:#FEF3C7; color:#B45309; border:1px solid #FDE68A; font-weight:600; font-size:11px; padding:3px 8px; border-radius:6px;">
          ${t} (${counts[t]})
        </span>`).join('');

      const badge = document.getElementById('badge-reviews');
      if (badge) badge.textContent = '7';
    }

window.initCharts = initCharts;
window.setSalesCurvePeriod = setSalesCurvePeriod;
window.renderTopProducts = renderTopProducts;
window.renderDashboardFeedback = renderDashboardFeedback;
window.starsHtml = starsHtml;
