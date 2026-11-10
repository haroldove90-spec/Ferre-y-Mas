import React from 'react';
import { useERP } from '../context/ERPContext';
import { 
  ShoppingCart, 
  DollarSign, 
  Package, 
  DownloadCloud, 
  Truck, 
  BarChart3, 
  Clock, 
  Grid, 
  TrendingUp, 
  PieChart,
  Users
} from 'lucide-react';

export const BottomBar: React.FC = () => {
  const { activeRole, activeModule, setActiveModule } = useERP();

  if (!activeRole) return null;

  const quickNavByRole: Record<string, { id: string; label: string; icon: React.ReactNode }[]> = {
    cajero: [
      { id: 'pos', label: 'POS', icon: <ShoppingCart className="w-5 h-5" /> },
      { id: 'caja', label: 'Caja', icon: <DollarSign className="w-5 h-5" /> },
      { id: 'apartados', label: 'Apartados', icon: <Clock className="w-5 h-5" /> },
      { id: 'historial_ventas', label: 'Tickets', icon: <Users className="w-5 h-5" /> },
    ],
    almacen: [
      { id: 'stock', label: 'Stock', icon: <Package className="w-5 h-5" /> },
      { id: 'recepcion', label: 'Recepción', icon: <DownloadCloud className="w-5 h-5" /> },
      { id: 'ubicaciones', label: 'Ubicaciones', icon: <Grid className="w-5 h-5" /> },
      { id: 'despacho', label: 'Despacho', icon: <Truck className="w-5 h-5" /> },
    ],
    compras: [
      { id: 'ordenes', label: 'Órdenes', icon: <Truck className="w-5 h-5" /> },
      { id: 'sugerencias', label: 'Reorden', icon: <TrendingUp className="w-5 h-5" /> },
      { id: 'proveedores', label: 'Proveedores', icon: <Users className="w-5 h-5" /> },
    ],
    administrador: [
      { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-5 h-5" /> },
      { id: 'reportes', label: 'Finanzas', icon: <PieChart className="w-5 h-5" /> },
      { id: 'crm', label: 'Clientes', icon: <Users className="w-5 h-5" /> },
    ]
  };

  const items = quickNavByRole[activeRole] || [];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-lg px-2 py-1 safe-area-bottom">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-[#D60D1D] font-bold'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <div className={`p-1 rounded-lg ${isActive ? 'bg-red-50 scale-105' : ''}`}>
                {item.icon}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 truncate max-w-[64px]">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
