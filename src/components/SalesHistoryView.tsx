import React, { useState } from 'react';
import { useERP } from '../context/ERPContext';
import { Receipt, Printer, Search, FileText } from 'lucide-react';

export const SalesHistoryView: React.FC = () => {
  const { sales, setSelectedTicketSale } = useERP();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = sales.filter(s => 
    s.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.clienteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.tipoComprobante.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4 pb-16 md:pb-6">
      <div className="pb-3 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <h2 className="font-heading font-black text-xl text-slate-900">
            Comprobantes Emitidos (Tickets, Facturas CFDI y Notas)
          </h2>
          <p className="text-xs text-slate-500">
            Historial de ventas del turno para reimpresión de comprobante o aclaraciones de clientes.
          </p>
        </div>
        <span className="text-xs font-bold text-slate-500">
          {sales.length} comprobantes en registro
        </span>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar por folio, cliente o tipo..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-1 focus:ring-[#D60D1D]"
        />
      </div>

      <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No se han registrado ventas aún. Emite una venta en el POS para visualizarla aquí.
          </div>
        ) : (
          filtered.map(sale => (
            <div key={sale.id} className="p-4 bg-white hover:bg-slate-50 flex items-center justify-between gap-4 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-heading font-black text-sm text-slate-900">{sale.folio}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-600">
                    {sale.tipoComprobante}
                  </span>
                </div>
                <div className="font-semibold text-slate-800 mt-0.5">
                  {sale.clienteNombre} {sale.clienteRfc ? `(RFC: ${sale.clienteRfc})` : ''}
                </div>
                <div className="text-[11px] text-slate-400">
                  {new Date(sale.fecha).toLocaleString('es-MX')} • Cajero: {sale.cajeroNombre} • Pago: {sale.metodoPago.replace('_', ' ')}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="font-black text-sm text-slate-900">${sale.total.toFixed(2)}</div>
                  <div className="text-[10px] text-slate-400">{sale.items.length} artículos</div>
                </div>

                <button
                  onClick={() => setSelectedTicketSale(sale)}
                  className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                  title="Reimprimir o consultar comprobante"
                >
                  <Printer className="w-3.5 h-3.5 text-[#D60D1D]" />
                  <span>Ver Ticket</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
