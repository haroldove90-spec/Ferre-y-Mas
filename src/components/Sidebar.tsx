import React from 'react';
import { useERP } from '../context/ERPContext';
import { 
  ShoppingCart, 
  DollarSign, 
  Clock, 
  MapPin, 
  Receipt, 
  Package, 
  DownloadCloud, 
  ClipboardCheck, 
  Grid, 
  AlertOctagon, 
  Truck, 
  Users, 
  TrendingUp, 
  History, 
  BarChart3, 
  PieChart, 
  ShieldAlert, 
  Settings, 
  LogOut,
  Workflow
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { activeRole, activeModule, setActiveModule, setActiveRole, setShowWorkflowModal } = useERP();

  if (!activeRole) return null;

  const modulesByRole: Record<string, { id: string; label: string; icon: React.ReactNode }[]> = {
    cajero: [
      { id: 'pos', label: 'Punto de Venta (POS)', icon: <ShoppingCart className="w-5 h-5" /> },
      { id: 'caja', label: 'Corte y Manejo de Caja', icon: <DollarSign className="w-5 h-5" /> },
      { id: 'apartados', label: 'Apartados y Preventas', icon: <Clock className="w-5 h-5" /> },
      { id: 'stock_sucursales', label: 'Stock en Sucursales', icon: <MapPin className="w-5 h-5" /> },
      { id: 'historial_ventas', label: 'Comprobantes Emitidos', icon: <Receipt className="w-5 h-5" /> },
    ],
    almacen: [
      { id: 'stock', label: 'Control de Stock en Tiempo Real', icon: <Package className="w-5 h-5" /> },
      { id: 'recepcion', label: 'Recepción de Mercancía (OC)', icon: <DownloadCloud className="w-5 h-5" /> },
      { id: 'ubicaciones', label: 'Ubicaciones (Pasillo/Estante)', icon: <Grid className="w-5 h-5" /> },
      { id: 'conteo', label: 'Inventarios Cíclicos', icon: <ClipboardCheck className="w-5 h-5" /> },
      { id: 'mermas', label: 'Mermas y Devoluciones', icon: <AlertOctagon className="w-5 h-5" /> },
      { id: 'despacho', label: 'Despacho y Carga a Granel', icon: <Truck className="w-5 h-5" /> },
    ],
    compras: [
      { id: 'ordenes', label: 'Órdenes de Compra (OC)', icon: <Truck className="w-5 h-5" /> },
      { id: 'sugerencias', label: 'Sugerencias de Reorden', icon: <TrendingUp className="w-5 h-5" /> },
      { id: 'proveedores', label: 'Catálogo de Proveedores', icon: <Users className="w-5 h-5" /> },
      { id: 'historial_costos', label: 'Historial de Costos', icon: <History className="w-5 h-5" /> },
    ],
    administrador: [
      { id: 'dashboard', label: 'Panel de Control (Dashboard)', icon: <BarChart3 className="w-5 h-5" /> },
      { id: 'reportes', label: 'Rentabilidad y Finanzas', icon: <PieChart className="w-5 h-5" /> },
      { id: 'crm', label: 'Clientes y Líneas de Crédito', icon: <Users className="w-5 h-5" /> },
      { id: 'permisos', label: 'Roles y Restricciones', icon: <ShieldAlert className="w-5 h-5" /> },
      { id: 'configuracion', label: 'Configuración ERP', icon: <Settings className="w-5 h-5" /> },
    ]
  };

  const navItems = modulesByRole[activeRole] || [];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-xs transition-opacity" 
        />
      )}

      {/* Sidebar Panel */}
      <aside 
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Role Title Banner */}
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Módulos del Rol
          </div>
          <div className="font-heading font-extrabold text-slate-900 text-sm mt-0.5 capitalize">
            {activeRole === 'cajero' && 'Cajero / Ventas POS'}
            {activeRole === 'almacen' && 'Almacén e Inventarios'}
            {activeRole === 'compras' && 'Compras y Proveedores'}
            {activeRole === 'administrador' && 'Administración y Gerencia'}
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveModule(item.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-[#D60D1D] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span className={isActive ? 'text-[#FED403]' : 'text-slate-500'}>
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-slate-100 space-y-1.5 bg-slate-50/50">
          <button
            onClick={() => {
              setShowWorkflowModal(true);
              onClose();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-200/70 transition cursor-pointer"
          >
            <Workflow className="w-4 h-4 text-[#D60D1D]" />
            <span>Ver Flujo del ERP</span>
          </button>

          <button
            onClick={() => {
              setActiveRole(null);
              onClose();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-700 hover:bg-rose-100 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Salir de este rol</span>
          </button>
        </div>
      </aside>
    </>
  );
};
