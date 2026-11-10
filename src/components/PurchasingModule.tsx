import React, { useState } from 'react';
import { useERP } from '../context/ERPContext';
import { PurchaseOrder, Supplier } from '../types/erp';
import { 
  Truck, 
  TrendingUp, 
  Users, 
  History, 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  Mail, 
  Clock, 
  FileText,
  DollarSign,
  TrendingDown
} from 'lucide-react';

export const PurchasingModule: React.FC = () => {
  const { 
    suppliers, 
    products, 
    purchaseOrders, 
    activeModule, 
    createPurchaseOrder, 
    generateAutoReplenishmentOrders, 
    updateOrderStatus 
  } = useERP();

  // Create Order modal
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState(suppliers[0]?.id || '');
  const [orderItems, setOrderItems] = useState<{ productoId: string; cantidad: number }[]>([
    { productoId: products[0]?.id || '', cantidad: 10 }
  ]);
  const [orderNotes, setOrderNotes] = useState('');

  // Auto generated banner notice
  const [autoOrdersCreated, setAutoOrdersCreated] = useState<number | null>(null);

  const lowStockProducts = products.filter(p => p.stockActual <= p.stockMinimo);

  const handleGenerateAuto = () => {
    const generated = generateAutoReplenishmentOrders();
    setAutoOrdersCreated(generated.length);
    setTimeout(() => setAutoOrdersCreated(null), 4000);
  };

  const handleAddItemToOrder = () => {
    setOrderItems(prev => [...prev, { productoId: products[0]?.id || '', cantidad: 10 }]);
  };

  const handleRemoveItemFromOrder = (idx: number) => {
    setOrderItems(prev => prev.filter((_, i) => i !== idx));
  };

  const handleUpdateItemInOrder = (idx: number, prodId: string, qty: number) => {
    setOrderItems(prev => prev.map((it, i) => i === idx ? { productoId: prodId, cantidad: qty } : it));
  };

  const handleSaveOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplierId || orderItems.length === 0) return;
    createPurchaseOrder(selectedSupplierId, orderItems, orderNotes);
    setShowNewOrderModal(false);
    setOrderNotes('');
  };

  return (
    <div className="space-y-5 pb-16 md:pb-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-[#D60D1D]" />
            Abastecimiento, Proveedores y Protección de Costos
          </span>
          <h2 className="font-heading font-black text-xl text-slate-900 mt-1">
            Gestión de Órdenes de Compra y Proveedores
          </h2>
          <p className="text-xs text-slate-500">
            Detección automática de reorden y monitoreo de precios de mayoristas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleGenerateAuto}
            className="px-3.5 py-2 text-xs font-bold text-slate-900 bg-[#FED403] hover:bg-amber-400 rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
            title="Calcular faltantes y generar pedidos sugeridos automáticamente"
          >
            <Sparkles className="w-4 h-4 text-black" />
            <span>Sugerir Órdenes Automáticas</span>
          </button>

          <button
            onClick={() => setShowNewOrderModal(true)}
            className="px-4 py-2 text-xs font-bold text-white bg-[#D60D1D] hover:bg-red-700 rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Orden de Compra</span>
          </button>
        </div>
      </div>

      {autoOrdersCreated !== null && (
        <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs font-semibold text-amber-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-amber-700" />
          <span>
            {autoOrdersCreated > 0
              ? `¡Se generaron ${autoOrdersCreated} órdenes de compra sugeridas basadas en el punto de reorden!`
              : 'Todos los productos se encuentran actualmente por encima de su stock mínimo.'}
          </span>
        </div>
      )}

      {/* SUB-VIEW 1: ÓRDENES DE COMPRA */}
      {(activeModule === 'ordenes' || activeModule === 'sugerencias') && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                Órdenes de Compra (OC) Vigentes
              </h3>
              <p className="text-xs text-slate-500">
                Historial de pedidos a proveedores con fecha esperada de entrega.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500">
              {purchaseOrders.length} órdenes en sistema
            </span>
          </div>

          <div className="space-y-3">
            {purchaseOrders.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No hay órdenes de compra registradas.
              </div>
            ) : (
              purchaseOrders.map(order => (
                <div key={order.id} className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-black text-sm text-slate-900">{order.folio}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        order.estado === 'recibida_completa' ? 'bg-emerald-100 text-emerald-800' :
                        order.estado === 'enviada' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {order.estado.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="text-xs text-slate-800 font-bold mt-1">
                      {order.proveedorNombre}
                    </div>

                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Fecha Pedido: {order.fechaCreacion} • Entrega Estimada: {order.fechaEsperada}
                    </div>

                    <div className="text-xs text-slate-600 mt-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      {order.items.map(it => `${it.cantidadPedida} × ${it.nombre} ($${it.costoUnitario.toFixed(2)})`).join(' • ')}
                    </div>
                  </div>

                  <div className="text-right flex flex-col sm:items-end justify-between self-stretch sm:self-auto">
                    <div>
                      <div className="text-[11px] text-slate-400">Total con IVA:</div>
                      <div className="text-base sm:text-lg font-black text-slate-900">
                        ${order.total.toFixed(2)} MXN
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      {order.estado === 'sugerida' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'enviada')}
                          className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                        >
                          Aprobar y Enviar al Proveedor
                        </button>
                      )}
                      {order.estado === 'enviada' && (
                        <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded">
                          En tránsito hacia ferretería
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: CATÁLOGO DE PROVEEDORES */}
      {activeModule === 'proveedores' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="pb-3 border-b border-slate-200">
            <h3 className="font-heading font-bold text-base text-slate-900">
              Catálogo de Proveedores Mayoristas
            </h3>
            <p className="text-xs text-slate-500">
              Condiciones comerciales, días de crédito y tiempos de entrega pactados.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suppliers.map(prov => (
              <div key={prov.id} className="p-4 rounded-xl border border-slate-200 bg-white hover:border-[#FED403] transition-all space-y-2.5">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-heading font-bold text-sm text-slate-900">{prov.nombreComercial}</h4>
                    <span className="text-[11px] text-slate-400 font-mono">RFC: {prov.rfc}</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {prov.descuentoComercial}% Desc.
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>Contacto: <strong>{prov.contacto}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>Teléfono: {prov.telefono}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{prov.email}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    Entrega en <strong>{prov.tiempoEntregaDias} días</strong>
                  </span>
                  <span>
                    Crédito: <strong>{prov.diasCredito} días</strong>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: HISTORIAL DE COSTOS Y VARIACIÓN */}
      {activeModule === 'historial_costos' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="pb-3 border-b border-slate-200">
            <h3 className="font-heading font-bold text-base text-slate-900">
              Historial de Costos de Compra vs. Margen de Ganancia
            </h3>
            <p className="text-xs text-slate-500">
              Monitorea los incrementos en fierro, cable de cobre, cemento y solventes para no perder utilidad.
            </p>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
            {products.filter(p => p.historialCostos && p.historialCostos.length > 0).map(prod => {
              const margenActual = Number((((prod.precioPublico - prod.costo) / prod.precioPublico) * 100).toFixed(1));
              return (
                <div key={prod.id} className="p-4 bg-white hover:bg-slate-50 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="font-bold text-sm text-slate-900">{prod.nombre}</div>
                      <div className="text-[11px] text-slate-400 font-mono">SKU: {prod.sku}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Costo Actual:</span>
                        <span className="font-bold text-sm text-slate-900">${prod.costo.toFixed(2)}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Margen Bruto:</span>
                        <span className="font-bold text-sm text-emerald-700">{margenActual}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Variation pills */}
                  <div className="pt-2 flex flex-wrap gap-2 text-xs">
                    {prod.historialCostos?.map((hc, idx) => (
                      <div key={idx} className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2">
                        <span className="text-[11px] text-slate-500">{hc.fecha}:</span>
                        <strong className="text-slate-800">${hc.costo.toFixed(2)}</strong>
                        <span className="text-[10px] text-slate-400">({hc.proveedor})</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL CREAR NUEVA ORDEN DE COMPRA */}
      {showNewOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-heading font-black text-base">Crear Nueva Orden de Compra (OC)</h3>
              <button onClick={() => setShowNewOrderModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveOrderSubmit} className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Proveedor Mayorista</label>
                <select
                  value={selectedSupplierId}
                  onChange={e => setSelectedSupplierId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                >
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.nombreComercial} (Entrega: {s.tiempoEntregaDias} días)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Artículos a Solicitar</label>
                  <button
                    type="button"
                    onClick={handleAddItemToOrder}
                    className="text-xs text-[#D60D1D] font-bold hover:underline"
                  >
                    + Agregar otro renglón
                  </button>
                </div>

                <div className="space-y-2">
                  {orderItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                      <select
                        value={item.productoId}
                        onChange={e => handleUpdateItemInOrder(idx, e.target.value, item.cantidad)}
                        className="flex-1 px-2 py-1.5 text-xs bg-white border border-slate-300 rounded"
                      >
                        {products.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.nombre} (Costo: ${p.costo.toFixed(2)})
                          </option>
                        ))}
                      </select>

                      <input
                        type="number"
                        min="1"
                        value={item.cantidad}
                        onChange={e => handleUpdateItemInOrder(idx, item.productoId, parseFloat(e.target.value) || 1)}
                        className="w-20 px-2 py-1.5 text-xs font-bold text-center bg-white border border-slate-300 rounded"
                      />

                      {orderItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItemFromOrder(idx)}
                          className="p-1 text-slate-400 hover:text-red-600"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notas o Instrucciones de Entrega</label>
                <input
                  type="text"
                  placeholder="Ej. Entregar en andén 2 antes de las 14:00 hrs..."
                  value={orderNotes}
                  onChange={e => setOrderNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewOrderModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#D60D1D] hover:bg-red-700 rounded-lg transition"
                >
                  Emitir Orden de Compra
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
