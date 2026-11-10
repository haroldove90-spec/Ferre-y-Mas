import React, { useState } from 'react';
import { useERP } from '../context/ERPContext';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Users, 
  ShieldAlert, 
  DollarSign, 
  AlertTriangle, 
  ArrowUpRight, 
  CreditCard, 
  FileText, 
  CheckCircle2, 
  Layers, 
  Lock, 
  Settings,
  Plus
} from 'lucide-react';

export const AdminModule: React.FC = () => {
  const { 
    sales, 
    products, 
    clients, 
    suppliers, 
    cashShift, 
    activeModule, 
    registerClientPayment,
    setShowSupabaseModal,
    clearDemoData,
    restoreDemoData,
    isDemoCleared
  } = useERP();

  // Payment registration modal for client credit
  const [selectedClientForPayment, setSelectedClientForPayment] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  // Financial KPIs
  const totalSalesToday = sales.reduce((acc, s) => acc + s.total, 0) + (cashShift?.totalVentasEfectivo || 0);
  const totalTicketsCount = sales.length;
  const ticketPromedio = totalTicketsCount > 0 ? Number((totalSalesToday / totalTicketsCount).toFixed(2)) : 0;
  
  // Total accounts receivable
  const totalCarteraCredito = clients.reduce((acc, c) => acc + c.saldoActual, 0);
  const totalCarteraVencida = clients.reduce((acc, c) => acc + c.saldoVencido, 0);

  // Total inventory valuation
  const valorInventarioCosto = products.reduce((acc, p) => acc + (p.stockActual * p.costo), 0);
  const valorInventarioVenta = products.reduce((acc, p) => acc + (p.stockActual * p.precioPublico), 0);
  const utilidadProyectada = valorInventarioVenta - valorInventarioCosto;

  // Low stock alerts
  const criticalStockItems = products.filter(p => p.stockActual <= p.stockMinimo);

  const handlePayCreditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientForPayment || paymentAmount <= 0) return;
    registerClientPayment(selectedClientForPayment, paymentAmount);
    setSelectedClientForPayment(null);
    setPaymentAmount(0);
  };

  return (
    <div className="space-y-5 pb-16 md:pb-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#D60D1D] uppercase tracking-wider flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-[#D60D1D]" />
            Gerencia General & Control Financiero
          </span>
          <h2 className="font-heading font-black text-xl text-slate-900 mt-1">
            Dashboard Ejecutivo Ferre y Más
          </h2>
          <p className="text-xs text-slate-500">
            Rentabilidad, margen por línea, cartera de crédito ferretero y auditoría de permisos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSupabaseModal(true)}
            className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <Settings className="w-4 h-4 text-slate-600" />
            <span>Configurar Supabase</span>
          </button>
        </div>
      </div>

      {/* SUB-VIEW 1: DASHBOARD KPIS */}
      {(activeModule === 'dashboard') && (
        <div className="space-y-5">
          {/* Top 4 KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Ventas Totales Hoy
              </span>
              <div className="text-lg sm:text-2xl font-black text-slate-900 mt-1">
                ${totalSalesToday.toFixed(2)}
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" />
                Ventas en mostrador y crédito
              </span>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Ticket Promedio
              </span>
              <div className="text-lg sm:text-2xl font-black text-slate-900 mt-1">
                ${ticketPromedio > 0 ? ticketPromedio.toFixed(2) : '385.00'}
              </div>
              <span className="text-[10px] text-slate-500">Por comprador en mostrador</span>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Cuentas por Cobrar (Crédito)
              </span>
              <div className="text-lg sm:text-2xl font-black text-amber-700 mt-1">
                ${totalCarteraCredito.toFixed(2)}
              </div>
              <span className="text-[10px] text-rose-600 font-bold">
                ${totalCarteraVencida.toFixed(2)} vencido
              </span>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Valuación de Inventario (Costo)
              </span>
              <div className="text-lg sm:text-2xl font-black text-emerald-700 mt-1">
                ${valorInventarioCosto.toLocaleString('es-MX', { maximumFractionDigits: 0 })}
              </div>
              <span className="text-[10px] text-slate-500">Capital en almacén</span>
            </div>
          </div>

          {/* Critical Alerts and Stock warnings */}
          {criticalStockItems.length > 0 && (
            <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 space-y-2">
              <div className="flex items-center gap-2 text-[#D60D1D] font-bold text-xs sm:text-sm">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <span>Alerta Crítica: {criticalStockItems.length} artículos en o por debajo de stock mínimo</span>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                {criticalStockItems.map(p => (
                  <span key={p.id} className="bg-white px-2.5 py-1 rounded-lg border border-rose-300 font-semibold text-slate-800">
                    {p.nombre}: <strong>{p.stockActual} {p.unidad}</strong> (Mín: {p.stockMinimo})
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recent Sales Overview */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
            <h3 className="font-heading font-bold text-base text-slate-900">
              Últimas Transacciones Registradas en POS
            </h3>
            {sales.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                Aún no hay ventas emitidas en el turno.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {sales.slice(0, 5).map(s => (
                  <div key={s.id} className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-50">
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <span>{s.folio}</span>
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                          {s.tipoComprobante}
                        </span>
                      </div>
                      <div className="text-slate-600">{s.clienteNombre}</div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(s.fecha).toLocaleTimeString('es-MX')} • Cajero: {s.cajeroNombre}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-black text-sm text-slate-900">${s.total.toFixed(2)}</div>
                      <span className="text-[10px] text-slate-500 uppercase">{s.metodoPago.replace('_', ' ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: RENTABILIDAD & REPORTES FINANCIEROS */}
      {activeModule === 'reportes' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="pb-3 border-b border-slate-200">
            <h3 className="font-heading font-bold text-base text-slate-900">
              Análisis de Rentabilidad y Margen Bruto por Artículo
            </h3>
            <p className="text-xs text-slate-500">
              Cálculo de utilidad por cada producto comparando costo de adquisición contra precio venta.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Artículo</th>
                  <th className="py-3 px-4">Categoría</th>
                  <th className="py-3 px-4 text-right">Costo Compra</th>
                  <th className="py-3 px-4 text-right">Público ($)</th>
                  <th className="py-3 px-4 text-right">Contratista ($)</th>
                  <th className="py-3 px-4 text-right">Utilidad Bruta</th>
                  <th className="py-3 px-4 text-center">Margen %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {products.map(p => {
                  const utilidad = p.precioPublico - p.costo;
                  const margen = Number(((utilidad / p.precioPublico) * 100).toFixed(1));
                  return (
                    <tr key={p.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 font-bold text-slate-900">{p.nombre}</td>
                      <td className="py-3 px-4 text-slate-500">{p.categoria}</td>
                      <td className="py-3 px-4 text-right font-mono">${p.costo.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold">${p.precioPublico.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right font-mono text-amber-700">${p.precioContratista.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right font-mono font-black text-emerald-700">+${utilidad.toFixed(2)}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded font-bold text-xs ${
                          margen >= 35 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {margen}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: CRM CLIENTES & CRÉDITOS */}
      {activeModule === 'crm' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="pb-3 border-b border-slate-200">
            <h3 className="font-heading font-bold text-base text-slate-900">
              Cartera de Clientes Frecuentes, Constructoras y Líneas de Crédito
            </h3>
            <p className="text-xs text-slate-500">
              Control de saldos utilizados, líneas asignadas y registro de abonos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clients.map(cli => (
              <div key={cli.id} className="p-4 rounded-xl border border-slate-200 bg-white hover:border-[#D60D1D] transition-all space-y-2.5">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-heading font-bold text-sm text-slate-900">{cli.nombre}</h4>
                    <span className="text-[11px] text-slate-400 font-mono">RFC: {cli.rfc}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    cli.tipo === 'constructora' ? 'bg-purple-100 text-purple-800' :
                    cli.tipo === 'contratista' ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {cli.tipo.replace('_', ' ')}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <div>Teléfono: {cli.telefono}</div>
                  <div>Dirección: {cli.direccion}</div>
                </div>

                {cli.limiteCredito > 0 && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Línea de Crédito:</span>
                      <strong className="text-slate-900">${cli.limiteCredito.toLocaleString()} MXN</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Saldo por Liquidar:</span>
                      <strong className="text-[#D60D1D]">${cli.saldoActual.toLocaleString()} MXN</strong>
                    </div>
                    {cli.saldoVencido > 0 && (
                      <div className="flex justify-between text-rose-600 font-bold">
                        <span>Saldo Vencido:</span>
                        <span>${cli.saldoVencido.toLocaleString()} MXN</span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-200 flex justify-end">
                      <button
                        onClick={() => {
                          setSelectedClientForPayment(cli.id);
                          setPaymentAmount(cli.saldoActual > 0 ? 5000 : 0);
                        }}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Abonar a Cuenta</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 4: PERMISOS Y RESTRICCIONES DE ROLES */}
      {(activeModule === 'permisos' || activeModule === 'configuracion') && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="pb-3 border-b border-slate-200">
            <h3 className="font-heading font-bold text-base text-slate-900">
              Matriz de Permisos y Restricciones de Seguridad por Rol
            </h3>
            <p className="text-xs text-slate-500">
              Reglas de negocio activadas en el sistema ERP.
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
              <Lock className="w-5 h-5 text-[#D60D1D] shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-xs sm:text-sm text-slate-900">
                  Límite de Descuento en Caja: Máximo 5%
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Los usuarios con rol "Cajero / Vendedor" tienen restringido aplicar descuentos mayores al 5% por artículo para proteger la utilidad. Solo el Administrador puede aplicar descuentos mayores.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
              <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-xs sm:text-sm text-slate-900">
                  Ocultamiento de Costos y Utilidades en Punto de Venta
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  El POS solo muestra precios de venta al público y tarifas de contratista. El costo de adquisición y el margen quedan protegidos bajo el rol de Compras y Gerencia.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
              <Lock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-xs sm:text-sm text-slate-900">
                  Aprobación de Órdenes de Compra y Ajuste de Inventario
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Las órdenes sugeridas deben ser autorizadas por Compras o Administración antes de su envío formal al mayorista.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL REGISTRAR ABONO A CRÉDITO */}
      {selectedClientForPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-heading font-black text-base">Registrar Abono a Línea de Crédito</h3>
              <button onClick={() => setSelectedClientForPayment(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handlePayCreditSubmit} className="p-5 space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Monto del Abono ($ MXN)</label>
                <input
                  type="number"
                  step="100"
                  required
                  min="50"
                  value={paymentAmount || ''}
                  onChange={e => setPaymentAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm font-bold border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#D60D1D]"
                />
              </div>

              <div className="p-3 bg-emerald-50 text-emerald-900 rounded-xl text-xs">
                El abono se aplicará inmediatamente reduciendo el saldo deudor del cliente y liberando su capacidad de crédito para compras en mostrador.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedClientForPayment(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition"
                >
                  Confirmar Abono
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
