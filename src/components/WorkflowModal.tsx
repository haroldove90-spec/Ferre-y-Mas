import React, { useState } from 'react';
import { useERP } from '../context/ERPContext';
import { 
  X, 
  ArrowRight, 
  CheckCircle2, 
  ShoppingCart, 
  DownloadCloud, 
  Truck, 
  BarChart3, 
  FileText,
  Play
} from 'lucide-react';

export const WorkflowModal: React.FC = () => {
  const { 
    showWorkflowModal, 
    setShowWorkflowModal, 
    products, 
    purchaseOrders, 
    sales,
    setActiveRole, 
    setActiveModule 
  } = useERP();

  const [selectedStepIndex, setSelectedStepIndex] = useState(0);

  if (!showWorkflowModal) return null;

  const lowStockCount = products.filter(p => p.stockActual <= p.stockMinimo).length;
  const pendingOrdersCount = purchaseOrders.filter(o => o.estado === 'enviada' || o.estado === 'sugerida').length;
  const pendingDeliveries = sales.filter(s => s.estadoEntrega === 'pendiente_carga' || s.estadoEntrega === 'en_ruta').length;

  const steps = [
    {
      id: 1,
      name: '1. Abastecimiento',
      subtitle: 'Compras & Proveedores',
      icon: <Truck className="w-5 h-5 text-[#D60D1D]" />,
      role: 'compras' as const,
      module: 'sugerencias',
      desc: 'El sistema detecta automáticamente que un producto ha llegado a su stock mínimo (ej. Clavos de 2", Cable cal. 12) y genera alertas y sugerencias de Órdenes de Compra (OC) al departamento de compras.',
      metric: `${lowStockCount} productos en stock mínimo`,
      metricBadge: lowStockCount > 0 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800',
      actionLabel: 'Ver Sugerencias de Compra'
    },
    {
      id: 2,
      name: '2. Recepción',
      subtitle: 'Almacén & Inventarios',
      icon: <DownloadCloud className="w-5 h-5 text-[#D60D1D]" />,
      role: 'almacen' as const,
      module: 'recepcion',
      desc: 'El proveedor entrega el pedido en la ferretería. El almacenista valida contra la orden, registra lotes y caducidades si aplica (ej. selladores, pegamentos) y el stock se incrementa al instante.',
      metric: `${pendingOrdersCount} pedidos por recibir`,
      metricBadge: 'bg-blue-100 text-blue-800',
      actionLabel: 'Validar Recepción en Almacén'
    },
    {
      id: 3,
      name: '3. Venta / POS',
      subtitle: 'Caja & Mostrador',
      icon: <ShoppingCart className="w-5 h-5 text-[#D60D1D]" />,
      role: 'cajero' as const,
      module: 'pos',
      desc: 'El cliente solicita tubería, varilla o tornillos a granel. El vendedor busca por código o SKU, calcula tarifa (Público General o Contratista) y descuenta las piezas del inventario al cobrar.',
      metric: `${sales.length} ventas procesadas`,
      metricBadge: 'bg-slate-100 text-slate-800',
      actionLabel: 'Abrir Punto de Venta'
    },
    {
      id: 4,
      name: '4. Facturación / Salida',
      subtitle: 'Despacho & Logística',
      icon: <FileText className="w-5 h-5 text-[#D60D1D]" />,
      role: 'almacen' as const,
      module: 'despacho',
      desc: 'Si es compra grande (ej. 20 sacos de cemento, varillas de 12m), el sistema genera la Nota de Entrega / Despacho para el patio de carga y camión repartidor.',
      metric: `${pendingDeliveries} despachos en ruta`,
      metricBadge: pendingDeliveries > 0 ? 'bg-orange-100 text-orange-800' : 'bg-slate-100 text-slate-600',
      actionLabel: 'Ver Despachos y Rutas'
    },
    {
      id: 5,
      name: '5. Cierre & Reportes',
      subtitle: 'Administración & Gerencia',
      icon: <BarChart3 className="w-5 h-5 text-[#D60D1D]" />,
      role: 'administrador' as const,
      module: 'dashboard',
      desc: 'Al final del turno, el cajero realiza su corte de caja (arqueo). El administrador analiza el reporte de ventas, flujo de efectivo y margen de utilidad por categoría.',
      metric: `Corte de Caja en línea`,
      metricBadge: 'bg-emerald-100 text-emerald-800',
      actionLabel: 'Ver Reportes Financieros'
    }
  ];

  const currentStep = steps[selectedStepIndex];

  const handleGoToModule = () => {
    setActiveRole(currentStep.role);
    setActiveModule(currentStep.module);
    setShowWorkflowModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#D60D1D] rounded-xl text-white">
              <Play className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h2 className="font-heading font-black text-base sm:text-lg text-white">
                Flujo Operativo Integrado de la Ferretería
              </h2>
              <p className="text-xs text-slate-300">
                [1. Abastecimiento] ──&gt; [2. Recepción] ──&gt; [3. Venta/POS] ──&gt; [4. Salida/Despacho] ──&gt; [5. Reportes]
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowWorkflowModal(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Navigation */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            {steps.map((st, idx) => {
              const isSelected = selectedStepIndex === idx;
              return (
                <React.Fragment key={st.id}>
                  <button
                    onClick={() => setSelectedStepIndex(idx)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#D60D1D] text-white shadow-sm'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <span>{st.name}</span>
                  </button>
                  {idx < steps.length - 1 && (
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Selected Step Details */}
        <div className="p-5 sm:p-6 flex-1 overflow-y-auto space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-100">
                {currentStep.icon}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Etapa {currentStep.id} de 5 • {currentStep.subtitle}
                </span>
                <h3 className="font-heading font-black text-lg text-slate-900">
                  {currentStep.name}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${currentStep.metricBadge}`}>
                {currentStep.metric}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              ¿Cómo opera en Ferre y Más?
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              {currentStep.desc}
            </p>
          </div>

          {/* Quick interactive examples */}
          {currentStep.id === 1 && (
            <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-950">
                <CheckCircle2 className="w-4 h-4 text-amber-700" />
                Ejemplo real:
              </div>
              <p>
                Los clavos de 2" están en 18.5 kg (Mínimo: 35 kg). El sistema sugiere pedir 50 kg a Deacero México automáticamente para evitar quiebre de stock.
              </p>
            </div>
          )}

          {currentStep.id === 2 && (
            <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-blue-950">
                <CheckCircle2 className="w-4 h-4 text-blue-700" />
                Control de Caducidades en Almacén:
              </div>
              <p>
                Al recibir productos químicos o cemento (ej. Sikaflex o Tangit), se captura Lote y Fecha de Vencimiento para rotación FIFO (primeras entradas, primeras salidas).
              </p>
            </div>
          )}

          {currentStep.id === 3 && (
            <div className="p-3.5 bg-red-50 rounded-xl border border-red-200 text-xs text-red-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-red-950">
                <CheckCircle2 className="w-4 h-4 text-[#D60D1D]" />
                Venta Fraccionada y Tarifas:
              </div>
              <p>
                El POS permite vender 250 gramos de pijas para tablaroca o 3.5 metros de cable eléctrico, aplicando automáticamente descuento de Contratista si el cliente está registrado.
              </p>
            </div>
          )}

          {currentStep.id === 4 && (
            <div className="p-3.5 bg-orange-50 rounded-xl border border-orange-200 text-xs text-orange-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-orange-950">
                <CheckCircle2 className="w-4 h-4 text-orange-700" />
                Logística de Materiales Pesados:
              </div>
              <p>
                Ventas de bultos de cemento, varillas o tinacos generan orden de carga en el patio y nota de entrega con chofer asignado para rastreo.
              </p>
            </div>
          )}

          {currentStep.id === 5 && (
            <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-emerald-950">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                Cierre Z & Utilidades:
              </div>
              <p>
                Arqueo de efectivo contra ventas registradas, reporte de margen bruto y alertas de cartera de clientes con saldo vencido.
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedStepIndex(prev => Math.max(0, prev - 1))}
              disabled={selectedStepIndex === 0}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
            >
              Anterior
            </button>
            <button
              onClick={() => setSelectedStepIndex(prev => Math.min(steps.length - 1, prev + 1))}
              disabled={selectedStepIndex === steps.length - 1}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
            >
              Siguiente
            </button>
          </div>

          <button
            onClick={handleGoToModule}
            className="px-4 py-2 text-xs sm:text-sm font-bold text-white bg-[#D60D1D] hover:bg-red-700 rounded-xl transition shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <span>{currentStep.actionLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
