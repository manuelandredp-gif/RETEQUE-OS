import React, { useState } from 'react';

const input = 'w-full rounded-xl border border-neutral-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5161D]/20 focus:border-[#C5161D]';

export const ComplaintsPage: React.FC = () => {
  const [form, setForm] = useState({ fullName: '', phone: '', email: '', orderId: '', type: 'queja', detail: '', requestedSolution: '' });
  const [message, setMessage] = useState('');
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('Enviando...');
    try {
      const response = await fetch('/api/reclamos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No fue posible registrar el caso.');
      setMessage(`Caso ${data.caseId} registrado. Te contactaremos por el medio indicado.`);
      setForm({ fullName: '', phone: '', email: '', orderId: '', type: 'queja', detail: '', requestedSolution: '' });
    } catch (error) { setMessage(error instanceof Error ? error.message : 'No fue posible registrar el caso.'); }
  };
  const update = (key: keyof typeof form, value: string) => setForm(prev => ({ ...prev, [key]: value }));
  return <section className="max-w-2xl mx-auto py-10 sm:py-14">
    <p className="text-xs font-black uppercase tracking-widest text-[#C5161D]">Atención al consumidor</p>
    <h1 className="mt-2 text-3xl sm:text-4xl font-black text-neutral-900">Libro de Reclamaciones</h1>
    <p className="mt-4 text-neutral-600">Registra tu queja o reclamo. Recibirás un código de caso para su seguimiento.</p>
    <form onSubmit={submit} className="mt-8 grid gap-4 rounded-2xl border border-neutral-200 bg-white p-5 sm:p-7 shadow-sm">
      <div className="grid sm:grid-cols-2 gap-4"><label className="text-sm font-bold">Nombre completo<input required minLength={3} className={input} value={form.fullName} onChange={e => update('fullName', e.target.value)} /></label><label className="text-sm font-bold">Celular<input required inputMode="numeric" className={input} value={form.phone} onChange={e => update('phone', e.target.value)} /></label></div>
      <div className="grid sm:grid-cols-2 gap-4"><label className="text-sm font-bold">Correo (opcional)<input type="email" className={input} value={form.email} onChange={e => update('email', e.target.value)} /></label><label className="text-sm font-bold">Código de pedido (opcional)<input className={input} value={form.orderId} onChange={e => update('orderId', e.target.value)} /></label></div>
      <label className="text-sm font-bold">Tipo<select className={input} value={form.type} onChange={e => update('type', e.target.value)}><option value="queja">Queja (atención)</option><option value="reclamo">Reclamo (producto o servicio)</option></select></label>
      <label className="text-sm font-bold">Detalle<textarea required minLength={10} rows={5} className={input} value={form.detail} onChange={e => update('detail', e.target.value)} /></label>
      <label className="text-sm font-bold">Pedido o solución esperada (opcional)<textarea rows={3} className={input} value={form.requestedSolution} onChange={e => update('requestedSolution', e.target.value)} /></label>
      <button className="h-11 rounded-xl bg-[#C5161D] text-white font-black hover:bg-[#a91118]">Registrar caso</button>
      {message && <p role="status" className="text-sm font-semibold text-neutral-700">{message}</p>}
    </form>
  </section>;
};
