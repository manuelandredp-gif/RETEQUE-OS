/**
 * Retequeños OS - Módulo de Seguimiento Interactivo de Pedidos
 */
(function() {
  'use strict';

  window.MobileTrackingModule = {
    // Genera las etapas y datos para el seguimiento dinámico
    getTrackingState(isPickup, stepIndex) {
      const P = window.P || window.MOBILE_DATA?.P || {};

      const trackStepLabels = isPickup
        ? ['Pedido confirmado', 'En cocina dorando tequeños 🔥', 'Listo para recoger en tienda 🏪', '¡Pedido entregado con éxito! 🎉']
        : ['Pedido confirmado', 'En cocina dorando tequeños 🔥', 'En camino con repartidor 🛵', '¡Pedido entregado con éxito! 🎉'];

      const trackStepIcons = ['📋', '🔥', isPickup ? '🏪' : '🛵', '🎉'];

      const trackStepTitles = [
        'Pedido recibido y registrado',
        'En preparación en cocina',
        isPickup ? 'Listo para recoger' : 'Repartidor en camino',
        '¡Pedido entregado!'
      ];

      const trackStepDescs = [
        'Tu pedido ingresó al monitor de cocina KDS.',
        'Tus tequeños están en la freidora dorándose al punto exacto.',
        isPickup ? 'Ya está empaquetado en Calle Alto Lima 1488, Tacna.' : 'El repartidor va en camino a tu dirección en Tacna.',
        '¡Que disfrutes tus Retequeños! Gracias por tu preferencia.'
      ];

      const pickupSteps = trackStepLabels.map((label, i) => ({
        label: label,
        mark: i < stepIndex ? '✓' : (i + 1).toString(),
        weight: i === stepIndex ? 700 : 400,
        fg: i <= stepIndex ? P.char : '#A69E93',
        bg: i < stepIndex ? '#1F9D62' : (i === stepIndex ? P.coral : '#fff'),
        bd: i <= stepIndex ? (i < stepIndex ? '#1F9D62' : P.coral) : '#DCD2C1'
      }));

      const generalTrackSteps = ['Pedido confirmado', 'En preparación', 'En camino', 'Entregado'].map((l, i) => ({
        label: l,
        dotBg: i < 2 ? '#1F9D62' : (i === 2 ? P.coral : '#fff'),
        dotBd: i < 2 ? '#1F9D62' : (i === 2 ? P.coral : '#DCD2C1'),
        lineBg: i < 2 ? '#1F9D62' : '#EFE6D6',
        fg: i <= 2 ? P.char : '#A69E93',
        font: i === 2 ? '700 13.5px' : '400 13px'
      }));

      return {
        badge: isPickup ? 'RECOJO EN TIENDA 🏪' : 'DELIVERY EN TACNA 🛵',
        stepIcon: trackStepIcons[stepIndex] || '🥟',
        stepTitle: trackStepTitles[stepIndex] || 'En proceso',
        stepDesc: trackStepDescs[stepIndex] || '',
        pickupSteps: pickupSteps,
        generalTrackSteps: generalTrackSteps
      };
    },

    // Avanza interactivamente la simulación del pedido
    advanceTrackStep(ctx, isPickup) {
      ctx.setState(s => {
        const next = ((s.trackStepIndex !== undefined ? s.trackStepIndex : 1) + 1) % 4;
        const names = ['Pedido recibido', 'Cocinando tequeños', isPickup ? 'Listo para recoger' : 'En camino', '¡Entregado!'];
        ctx.flash('Etapa: ' + names[next]);
        return { trackStepIndex: next };
      });
    }
  };
})();
