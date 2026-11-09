import React from 'react';

export const PrivacyPage: React.FC = () => (
  <article className="max-w-3xl mx-auto py-10 sm:py-14 text-neutral-700">
    <p className="text-xs font-black uppercase tracking-widest text-[#C5161D]">Retequeños</p>
    <h1 className="mt-2 text-3xl sm:text-4xl font-black text-neutral-900">Política de privacidad</h1>
    <p className="mt-5 leading-7">Usamos tus datos únicamente para gestionar el pedido, coordinar entrega, verificar pagos de forma manual y atender consultas o reclamos.</p>
    <div className="mt-8 space-y-6 leading-7">
      <section><h2 className="font-black text-neutral-900 text-lg">Datos que tratamos</h2><p>Nombre, celular, dirección, referencia, pedido y medio de pago declarado. El comprobante digital solo lo revisa el personal autorizado.</p></section>
      <section><h2 className="font-black text-neutral-900 text-lg">Uso y conservación</h2><p>No vendemos datos ni los publicamos en el grupo de motorizados. Conservamos la información operativa el tiempo necesario para atender el pedido, reclamos y obligaciones aplicables.</p></section>
      <section><h2 className="font-black text-neutral-900 text-lg">Tus derechos</h2><p>Puedes solicitar acceso, corrección o eliminación de tus datos escribiendo al WhatsApp oficial. Las promociones requieren una autorización separada; no son necesarias para comprar.</p></section>
      <section><h2 className="font-black text-neutral-900 text-lg">Seguridad</h2><p>El panel administrativo exige sesión, los datos se limitan por rol y los pedidos usan controles de validación y respaldos locales.</p></section>
    </div>
  </article>
);
