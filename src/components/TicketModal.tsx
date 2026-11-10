import React from 'react';
import { useERP } from '../context/ERPContext';
import { Printer, X, Check, FileText } from 'lucide-react';

export const TicketModal: React.FC = () => {
  const { selectedTicketSale, setSelectedTicketSale } = useERP();

  if (!selectedTicketSale) return null;

  const handlePrint = () => {
    window.print();
  };

  const isFactura = selectedTicketSale.tipoComprobante === 'factura';
  const isNotaVenta = selectedTicketSale.tipoComprobante === 'nota_venta';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header (hidden in print) */}
        <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#FED403]" />
            <span className="font-heading font-bold text-sm">
              {isFactura ? 'Factura Electrónica CFDI 4.0' : isNotaVenta ? 'Nota de Venta' : 'Ticket de Venta / Caja'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1 bg-[#D60D1D] hover:bg-red-700 text-white text-xs font-bold rounded-lg transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir</span>
            </button>
            <button
              onClick={() => setSelectedTicketSale(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Ticket Content (80mm width standard) */}
        <div 
          id="printable-ticket" 
          className="p-6 overflow-y-auto font-mono text-xs text-slate-900 bg-white"
        >
          {/* Header Store Info */}
          <div className="text-center pb-3 border-b border-dashed border-slate-400">
            <img
              src="https://daloocomercializadora.com.mx/ferrelogo.png"
              alt="Ferre y Más"
              className="h-10 mx-auto mb-1.5 object-contain"
            />
            <div className="font-bold text-sm uppercase">FERRE Y MÁS S.A. DE C.V.</div>
            <div className="text-[11px] text-slate-600">RFC: FYM240101XYZ</div>
            <div className="text-[11px] text-slate-600">Av. Ferrocarril #108, Col. Industrial</div>
            <div className="text-[11px] text-slate-600">Tel: (55) 5890-4422 • CP 03100</div>
            <div className="text-[11px] text-slate-600">Régimen General de Ley Personas Morales</div>
          </div>

          {/* Comprobante Info */}
          <div className="py-2.5 border-b border-dashed border-slate-400 text-[11px] space-y-0.5">
            <div className="flex justify-between font-bold">
              <span>FOLIO:</span>
              <span>{selectedTicketSale.folio}</span>
            </div>
            <div className="flex justify-between">
              <span>FECHA:</span>
              <span>{new Date(selectedTicketSale.fecha).toLocaleString('es-MX')}</span>
            </div>
            <div className="flex justify-between">
              <span>CAJERO:</span>
              <span>{selectedTicketSale.cajeroNombre}</span>
            </div>
            <div className="flex justify-between">
              <span>CLIENTE:</span>
              <span className="truncate max-w-[170px] text-right">{selectedTicketSale.clienteNombre}</span>
            </div>
            {isFactura && (
              <>
                <div className="flex justify-between">
                  <span>RFC CLIENTE:</span>
                  <span>{selectedTicketSale.clienteRfc}</span>
                </div>
                <div className="flex justify-between">
                  <span>USO CFDI:</span>
                  <span className="truncate max-w-[170px]">{selectedTicketSale.usoCfdi}</span>
                </div>
              </>
            )}
            <div className="flex justify-between">
              <span>PAGO:</span>
              <span className="uppercase">{selectedTicketSale.metodoPago.replace('_', ' ')}</span>
            </div>
          </div>

          {/* Items Table */}
          <div className="py-2.5 border-b border-dashed border-slate-400">
            <div className="flex justify-between font-bold text-[11px] pb-1 border-b border-slate-300">
              <span className="w-12">CANT</span>
              <span className="flex-1 text-left px-1">DESCRIPCIÓN</span>
              <span className="w-16 text-right">IMPORTE</span>
            </div>
            <div className="space-y-1.5 pt-1.5">
              {selectedTicketSale.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-[11px] items-start">
                  <span className="w-12 text-slate-700">
                    {item.cantidad} {item.unidadSeleccionada}
                  </span>
                  <div className="flex-1 px-1">
                    <div className="leading-tight font-semibold">{item.producto.nombre}</div>
                    <div className="text-[10px] text-slate-500">
                      ${item.precioUnitario.toFixed(2)} c/u {item.descuento > 0 ? `(-${item.descuento}%)` : ''}
                    </div>
                  </div>
                  <span className="w-16 text-right font-bold">
                    ${item.subtotal.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="py-2.5 border-b border-dashed border-slate-400 space-y-1 text-xs">
            <div className="flex justify-between">
              <span>SUBTOTAL:</span>
              <span>${selectedTicketSale.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>I.V.A. (16%):</span>
              <span>${selectedTicketSale.iva.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-extrabold text-sm pt-1 border-t border-slate-200">
              <span>TOTAL:</span>
              <span>${selectedTicketSale.total.toFixed(2)} MXN</span>
            </div>

            {selectedTicketSale.metodoPago === 'efectivo' && selectedTicketSale.efectivoRecibido && (
              <>
                <div className="flex justify-between text-[11px] text-slate-600 pt-1">
                  <span>EFECTIVO:</span>
                  <span>${selectedTicketSale.efectivoRecibido.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[11px] font-bold">
                  <span>CAMBIO:</span>
                  <span>${selectedTicketSale.cambio?.toFixed(2)}</span>
                </div>
              </>
            )}
          </div>

          {/* Delivery Note notice if applicable */}
          {selectedTicketSale.requiereEntrega && (
            <div className="py-2 my-2 bg-slate-100 p-2 rounded text-[11px] text-center border border-slate-300">
              <div className="font-bold text-[#D60D1D]">REQUIERE DESPACHO / ENTREGA A DOMICILIO</div>
              <div>Dirección: {selectedTicketSale.direccionEntrega || 'Patio de Carga'}</div>
              <div>Estado: {selectedTicketSale.estadoEntrega}</div>
            </div>
          )}

          {/* Barcode representation */}
          <div className="pt-4 text-center">
            <div className="h-10 bg-slate-200 flex items-center justify-center font-bold tracking-widest text-slate-600">
              *||| | || |||| | ||| ||*
            </div>
            <div className="text-[10px] text-slate-500 mt-1">{selectedTicketSale.folio}</div>
            <div className="text-[10px] text-slate-500 mt-2 font-sans">
              ¡Gracias por su compra en Ferre y Más!
            </div>
            <div className="text-[9px] text-slate-400">
              Para cambios y devoluciones presente este comprobante dentro de los primeros 15 días hábiles.
            </div>
          </div>
        </div>

        {/* Footer (hidden in print) */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2 no-print">
          <button
            onClick={() => setSelectedTicketSale(null)}
            className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg cursor-pointer"
          >
            Cerrar
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-1.5 text-xs font-bold text-white bg-[#D60D1D] hover:bg-red-700 rounded-lg transition shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir Ticket</span>
          </button>
        </div>

      </div>
    </div>
  );
};
