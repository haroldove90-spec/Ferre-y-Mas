import React, { useState } from 'react';
import { useERP } from '../context/ERPContext';
import { 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Lock, 
  Unlock, 
  Calculator, 
  Printer, 
  AlertCircle, 
  CheckCircle2, 
  Plus, 
  Receipt 
} from 'lucide-react';

export const CashDrawerModule: React.FC = () => {
  const { cashShift, openCashDrawer, addCashMovement, closeCashShift } = useERP();

  // Open shift form
  const [fondoInicialInput, setFondoInicialInput] = useState<number>(2500);

  // New movement form
  const [showMovementModal, setShowMovementModal] = useState(false);
  const [movTipo, setMovTipo] = useState<'entrada' | 'salida'>('salida');
  const [movMonto, setMovMonto] = useState<number>(0);
  const [movMotivo, setMovMotivo] = useState('');

  // Close shift (Arqueo) form
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [denominations, setDenominations] = useState<{ [key: string]: number }>({
    '1000': 0,
    '500': 0,
    '200': 0,
    '100': 0,
    '50': 0,
    '20': 0,
    '10': 0,
    '5': 0,
    '2': 0,
    '1': 0,
    '0.5': 0,
  });

  // Calculate total cash counted in arqueo
  const totalCounted = Object.entries(denominations).reduce((acc, [denom, qty]) => {
    return acc + (parseFloat(denom) * (qty || 0));
  }, 0);

  const handleDenomChange = (denom: string, qty: number) => {
    setDenominations(prev => ({ ...prev, [denom]: Math.max(0, qty) }));
  };

  const handleAddMovementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (movMonto <= 0 || !movMotivo) return;
    addCashMovement(movTipo, movMonto, movMotivo);
    setShowMovementModal(false);
    setMovMonto(0);
    setMovMotivo('');
  };

  const handleFinishCloseShift = () => {
    closeCashShift(totalCounted);
    setShowCloseModal(false);
  };

  if (!cashShift || cashShift.estado === 'cerrada') {
    return (
      <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl border border-slate-200 shadow-sm text-center">
        <div className="w-16 h-16 bg-red-50 text-[#D60D1D] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="font-heading font-black text-xl text-slate-900 mb-1">Caja Cerrada</h2>
        <p className="text-xs text-slate-500 mb-6">
          Para comenzar a cobrar y emitir tickets en el POS, es necesario registrar la apertura de turno con el fondo de caja inicial.
        </p>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left mb-6 space-y-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Fondo Inicial de Efectivo ($ MXN)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
            <input
              type="number"
              step="50"
              value={fondoInicialInput}
              onChange={e => setFondoInicialInput(parseFloat(e.target.value) || 0)}
              className="w-full pl-8 pr-4 py-2.5 bg-white text-base font-bold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#D60D1D]"
            />
          </div>
          <span className="text-[11px] text-slate-400">
            Monto sugerido para cambio en monedas y billetes pequeños: $2,500.00
          </span>
        </div>

        <button
          onClick={() => openCashDrawer(fondoInicialInput)}
          className="w-full py-3 bg-[#D60D1D] hover:bg-red-700 text-white font-extrabold rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <Unlock className="w-4 h-4 text-[#FED403]" />
          <span>Realizar Apertura de Caja</span>
        </button>
      </div>
    );
  }

  const expectedCash = cashShift.montoEsperadoEfectivo;
  const diferencia = Number((totalCounted - expectedCash).toFixed(2));

  return (
    <div className="space-y-5 pb-16 md:pb-6">
      
      {/* Top Shift Status Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Turno de Caja Activo (Corte X en Línea)
            </span>
          </div>
          <h2 className="font-heading font-black text-xl text-slate-900 mt-1">
            Cajero: {cashShift.cajeroNombre}
          </h2>
          <div className="text-xs text-slate-500 mt-0.5">
            Apertura: {new Date(cashShift.fechaApertura).toLocaleString('es-MX')} • Fondo Inicial: ${cashShift.fondoInicial.toFixed(2)}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMovementModal(true)}
            className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#D60D1D]" />
            <span>Entrada / Salida</span>
          </button>

          <button
            onClick={() => setShowCloseModal(true)}
            className="px-4 py-2 text-xs sm:text-sm font-bold text-white bg-slate-900 hover:bg-black rounded-xl transition shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Calculator className="w-4 h-4 text-[#FED403]" />
            <span>Arqueo y Cierre (Corte Z)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Ventas en Efectivo
          </span>
          <div className="text-lg sm:text-xl font-black text-slate-900 mt-1">
            ${cashShift.totalVentasEfectivo.toFixed(2)}
          </div>
          <span className="text-[10px] text-slate-500">Cobrado en mostrador</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Tarjetas Débito / Crédito
          </span>
          <div className="text-lg sm:text-xl font-black text-slate-900 mt-1">
            ${cashShift.totalVentasTarjeta.toFixed(2)}
          </div>
          <span className="text-[10px] text-slate-500">Terminal bancaria</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Crédito Ferretero
          </span>
          <div className="text-lg sm:text-xl font-black text-amber-700 mt-1">
            ${cashShift.totalVentasCredito.toFixed(2)}
          </div>
          <span className="text-[10px] text-slate-500">A cuenta de clientes</span>
        </div>

        <div className="p-4 bg-red-50/50 rounded-2xl border border-red-200 shadow-xs">
          <span className="text-[11px] font-bold text-[#D60D1D] uppercase tracking-wider">
            Efectivo Esperado en Cajón
          </span>
          <div className="text-lg sm:text-2xl font-black text-[#D60D1D] mt-1">
            ${expectedCash.toFixed(2)}
          </div>
          <span className="text-[10px] text-slate-500">Fondo + Ventas + Movs</span>
        </div>
      </div>

      {/* Cash Movements Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-heading font-bold text-sm text-slate-900">
            Movimientos Extraordinarios de Efectivo (Entradas y Retiros)
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            {cashShift.movimientos.length} registros
          </span>
        </div>

        {cashShift.movimientos.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No se han registrado entradas ni retiros de efectivo en este turno.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 overflow-x-auto">
            {cashShift.movimientos.map(mov => (
              <div key={mov.id} className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${
                    mov.tipo === 'entrada' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-[#D60D1D]'
                  }`}>
                    {mov.tipo === 'entrada' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 capitalize">
                      {mov.tipo === 'entrada' ? 'Entrada de Efectivo' : 'Retiro / Gasto de Caja'}
                    </div>
                    <div className="text-slate-500 text-[11px]">{mov.motivo}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`font-black text-sm ${
                    mov.tipo === 'entrada' ? 'text-emerald-700' : 'text-[#D60D1D]'
                  }`}>
                    {mov.tipo === 'entrada' ? '+' : '-'}${mov.monto.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-slate-400">{mov.hora} hrs</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL REGISTRAR MOVIMIENTO */}
      {showMovementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-heading font-black text-base">Registrar Movimiento de Efectivo</h3>
              <button onClick={() => setShowMovementModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddMovementSubmit} className="p-5 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Tipo de Movimiento
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMovTipo('entrada')}
                    className={`py-2 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 cursor-pointer ${
                      movTipo === 'entrada'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <ArrowDownLeft className="w-4 h-4" />
                    <span>Entrada (Ingreso)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMovTipo('salida')}
                    className={`py-2 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 cursor-pointer ${
                      movTipo === 'salida'
                        ? 'bg-[#D60D1D] text-white border-[#D60D1D]'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                    <span>Salida (Retiro)</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Monto ($ MXN)</label>
                <input
                  type="number"
                  step="1"
                  required
                  min="1"
                  value={movMonto || ''}
                  onChange={e => setMovMonto(parseFloat(e.target.value) || 0)}
                  placeholder="$ 0.00"
                  className="w-full px-3 py-2 text-sm font-bold border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#D60D1D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Motivo o Justificación</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Pago flete arena, aportación de cambio, etc."
                  value={movMotivo}
                  onChange={e => setMovMotivo(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#D60D1D]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowMovementModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-black rounded-lg"
                >
                  Registrar Movimiento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ARQUEO Y CIERRE DE CAJA */}
      {showCloseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-heading font-black text-base sm:text-lg">
                  Arqueo Físico y Cierre de Turno (Corte Z)
                </h3>
                <p className="text-xs text-slate-300">Conteo de efectivo por denominación</p>
              </div>
              <button onClick={() => setShowCloseModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                Ingresa la cantidad física de billetes y monedas que hay en el cajón de dinero:
              </div>

              {/* Denominations table */}
              <div className="grid grid-cols-2 gap-3">
                {Object.keys(denominations).map(denom => (
                  <div key={denom} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="font-bold text-slate-700">
                      ${parseFloat(denom) < 1 ? '50 centavos' : `${denom} MXN`}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-400">×</span>
                      <input
                        type="number"
                        min="0"
                        value={denominations[denom] || ''}
                        placeholder="0"
                        onChange={e => handleDenomChange(denom, parseInt(e.target.value) || 0)}
                        className="w-16 px-2 py-1 text-center font-bold text-xs bg-white border border-slate-300 rounded focus:ring-1 focus:ring-[#D60D1D]"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Balance */}
              <div className="p-4 bg-slate-100 rounded-xl space-y-2 border border-slate-200 text-xs">
                <div className="flex justify-between">
                  <span>Total Contado en Cajón:</span>
                  <span className="font-bold text-sm text-slate-900">${totalCounted.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Efectivo Esperado por Sistema:</span>
                  <span className="font-bold text-sm text-slate-700">${expectedCash.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-black text-sm pt-2 border-t border-slate-200">
                  <span>Diferencia (Sobrante / Faltante):</span>
                  <span className={diferencia === 0 ? 'text-emerald-700' : diferencia > 0 ? 'text-blue-700' : 'text-red-600'}>
                    {diferencia === 0 ? '$0.00 (Exacto)' : `${diferencia > 0 ? '+ ' : ''}$${diferencia.toFixed(2)} MXN`}
                  </span>
                </div>
              </div>

            </div>

            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowCloseModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl"
              >
                Volver
              </button>
              <button
                onClick={handleFinishCloseShift}
                className="px-5 py-2.5 text-xs sm:text-sm font-black text-white bg-[#D60D1D] hover:bg-red-700 rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-[#FED403]" />
                <span>Cerrar Turno e Imprimir Corte Z</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
