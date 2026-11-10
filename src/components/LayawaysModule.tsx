import React from 'react';
import { useERP } from '../context/ERPContext';
import { Clock, CheckCircle2, Phone, Calendar, DollarSign, Package } from 'lucide-react';

export const LayawaysModule: React.FC = () => {
  const { layaways, settleLayaway } = useERP();

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4 pb-16 md:pb-6">
      <div className="pb-3 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <h2 className="font-heading font-black text-xl text-slate-900">
            Control de Apartados y Preventas de Mercancía
          </h2>
          <p className="text-xs text-slate-500">
            Clientes que apartan material con anticipo y liquidan posteriormente en caja para retirar su producto.
          </p>
        </div>
        <span className="text-xs font-bold px-3 py-1 bg-amber-50 text-amber-900 rounded-full border border-amber-200">
          {layaways.filter(l => l.estado === 'vigente').length} apartados vigentes
        </span>
      </div>

      <div className="space-y-3">
        {layaways.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No hay apartados registrados. Puedes crear uno desde el Punto de Venta (POS) con el botón "Apartado".
          </div>
        ) : (
          layaways.map(layaway => {
            const isVigente = layaway.estado === 'vigente';
            return (
              <div 
                key={layaway.id} 
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-[#FED403] transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-black text-sm text-slate-900">{layaway.folio}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      isVigente ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {layaway.estado}
                    </span>
                  </div>

                  <div className="text-xs text-slate-800 font-bold">
                    Cliente: {layaway.clienteNombre}
                  </div>

                  <div className="flex items-center gap-4 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {layaway.clienteTelefono}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Vence: {layaway.fechaVencimiento}
                    </span>
                  </div>

                  {/* Items summary */}
                  <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 mt-1">
                    {layaway.items.map((it, idx) => (
                      <span key={idx} className="mr-2 inline-block">
                        • {it.cantidad} {it.unidadSeleccionada} {it.producto.nombre}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-right flex flex-col sm:items-end justify-between self-stretch sm:self-auto min-w-[140px]">
                  <div>
                    <div className="text-[11px] text-slate-400">Total Apartado: ${layaway.total.toFixed(2)}</div>
                    <div className="text-xs text-emerald-700 font-semibold">Anticipo: ${layaway.anticipo.toFixed(2)}</div>
                    <div className="text-base font-black text-[#D60D1D] mt-0.5">
                      Resta: ${layaway.saldoRestante.toFixed(2)} MXN
                    </div>
                  </div>

                  {isVigente && (
                    <button
                      onClick={() => {
                        settleLayaway(layaway.id);
                        alert(`¡Apartado ${layaway.folio} liquidado exitosamente! El material puede entregarse al cliente.`);
                      }}
                      className="mt-3 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition shadow-xs flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Liquidar en Caja</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
