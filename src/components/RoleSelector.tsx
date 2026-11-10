import React from 'react';
import { UserRole } from '../types/erp';
import { ShoppingCart, Warehouse, Truck, ShieldCheck } from 'lucide-react';

interface RoleSelectorProps {
  onSelectRole: (role: UserRole) => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ onSelectRole }) => {
  const roles: { id: UserRole; name: string; icon: React.ReactNode; accent: string }[] = [
    {
      id: 'cajero',
      name: 'Cajero / Vendedor',
      icon: <ShoppingCart className="w-8 h-8 text-[#D60D1D]" />,
      accent: 'border-b-4 border-[#D60D1D] hover:shadow-red-100'
    },
    {
      id: 'almacen',
      name: 'Encargado de Almacén / Inventarios',
      icon: <Warehouse className="w-8 h-8 text-[#D60D1D]" />,
      accent: 'border-b-4 border-[#FED403] hover:shadow-amber-100'
    },
    {
      id: 'compras',
      name: 'Compras y Proveedores',
      icon: <Truck className="w-8 h-8 text-[#D60D1D]" />,
      accent: 'border-b-4 border-slate-900 hover:shadow-slate-200'
    },
    {
      id: 'administrador',
      name: 'Administrador / Gerente',
      icon: <ShieldCheck className="w-8 h-8 text-[#D60D1D]" />,
      accent: 'border-b-4 border-[#D60D1D] hover:shadow-red-100'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 sm:p-8">
      {/* Sistema Logo sin encapsular */}
      <div className="mb-8 sm:mb-12 flex flex-col items-center">
        <img
          src="https://daloocomercializadora.com.mx/ferrelogo.png"
          alt="Ferre y Más"
          className="h-16 sm:h-24 object-contain max-w-full drop-shadow-xs"
        />
      </div>

      {/* Cuadrícula 2 Columnas Móvil / 4 Columnas Escritorio */}
      <div className="w-full max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => onSelectRole(role.id)}
            className={`flex flex-col items-center justify-center p-6 sm:p-8 bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 active:scale-95 cursor-pointer text-center group ${role.accent}`}
          >
            <div className="mb-4 p-4 rounded-xl bg-slate-50 group-hover:bg-amber-50 group-hover:scale-110 transition-all duration-200">
              {role.icon}
            </div>

            {/* Solo nombre del rol */}
            <span className="font-heading font-bold text-sm sm:text-base text-slate-900 group-hover:text-[#D60D1D] transition-colors leading-snug">
              {role.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
