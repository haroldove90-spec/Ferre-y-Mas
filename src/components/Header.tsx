import React, { useState } from 'react';
import { useERP } from '../context/ERPContext';
import { PWAInstallButton } from './PWAInstallButton';
import { 
  LogOut, 
  Trash2, 
  Database, 
  Workflow, 
  ShieldCheck, 
  ShoppingCart, 
  Warehouse, 
  Truck,
  RotateCcw,
  AlertTriangle,
  Menu,
  ChevronDown
} from 'lucide-react';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { 
    activeRole, 
    setActiveRole, 
    isDemoCleared, 
    clearDemoData, 
    restoreDemoData,
    setShowWorkflowModal,
    setShowSupabaseModal,
    supabaseConfig
  } = useERP();

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const roleInfo = {
    cajero: {
      label: 'Cajero / Vendedor',
      color: 'bg-red-50 text-[#D60D1D] border-red-200',
      icon: <ShoppingCart className="w-3.5 h-3.5" />
    },
    almacen: {
      label: 'Almacén / Inventarios',
      color: 'bg-amber-50 text-amber-900 border-amber-300',
      icon: <Warehouse className="w-3.5 h-3.5" />
    },
    compras: {
      label: 'Compras y Proveedores',
      color: 'bg-slate-100 text-slate-800 border-slate-300',
      icon: <Truck className="w-3.5 h-3.5" />
    },
    administrador: {
      label: 'Administrador / Gerente',
      color: 'bg-red-100 text-[#D60D1D] border-red-300 font-bold',
      icon: <ShieldCheck className="w-3.5 h-3.5" />
    }
  };

  const currentRole = activeRole ? roleInfo[activeRole] : null;

  return (
    <>
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Left: Mobile Menu Trigger & System Logo sin encapsular */}
          <div className="flex items-center gap-2 sm:gap-4">
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                title="Abrir menú"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            {/* Logotipo del sistema sin encapsular */}
            <div className="flex items-center">
              <img
                src="https://daloocomercializadora.com.mx/ferrelogo.png"
                alt="Ferre y Más"
                className="h-10 sm:h-12 w-auto object-contain cursor-pointer"
                onClick={() => setActiveRole(null)}
                title="Volver a selección de roles"
              />
            </div>

            {/* Identificación del Rol Activo */}
            {currentRole && (
              <div className="relative">
                <button
                  onClick={() => setShowRoleDropdown(prev => !prev)}
                  className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${currentRole.color} transition hover:opacity-90 cursor-pointer`}
                  title="Cambiar rol rápido"
                >
                  {currentRole.icon}
                  <span>{currentRole.label}</span>
                  <ChevronDown className="w-3 h-3 ml-0.5 opacity-60" />
                </button>

                {showRoleDropdown && (
                  <div className="absolute left-0 mt-2 w-56 rounded-xl bg-white shadow-xl border border-slate-200 py-1.5 z-50 text-xs">
                    <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Cambiar Rol Activo
                    </div>
                    {(['cajero', 'almacen', 'compras', 'administrador'] as const).map(roleKey => (
                      <button
                        key={roleKey}
                        onClick={() => {
                          setActiveRole(roleKey);
                          setShowRoleDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-slate-50 transition ${
                          activeRole === roleKey ? 'font-bold text-[#D60D1D] bg-red-50/50' : 'text-slate-700'
                        }`}
                      >
                        {roleInfo[roleKey].icon}
                        {roleInfo[roleKey].label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Actions, Install, Clear Data & Logout */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            
            {/* Flujo Operativo Button */}
            <button
              onClick={() => setShowWorkflowModal(true)}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition cursor-pointer"
              title="Ver Flujo de Trabajo del ERP"
            >
              <Workflow className="w-4 h-4 text-[#D60D1D]" />
              <span>Flujo ERP</span>
            </button>

            {/* Supabase Status / Config Button */}
            <button
              onClick={() => setShowSupabaseModal(true)}
              className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition cursor-pointer bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              title="Configurar conexión con base de datos Supabase"
            >
              <Database className={`w-3.5 h-3.5 ${supabaseConfig.isConfigured ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span className="hidden xl:inline">Supabase</span>
              {supabaseConfig.isConfigured && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse hidden sm:inline" />
              )}
            </button>

            {/* Botón Borrar Datos de Muestra */}
            {isDemoCleared ? (
              <button
                onClick={restoreDemoData}
                className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition cursor-pointer"
                title="Restaurar datos de muestra para pruebas"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Restaurar Demo</span>
              </button>
            ) : (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition cursor-pointer"
                title="Borrar datos de muestra del todo el sistema"
              >
                <Trash2 className="w-3.5 h-3.5 text-[#D60D1D]" />
                <span className="hidden sm:inline">Limpiar Demo</span>
              </button>
            )}

            {/* Botón de instalación rápida de la aplicación (PWA) */}
            <PWAInstallButton />

            {/* Botón de cierre de sesión */}
            <button
              onClick={() => setActiveRole(null)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-white bg-slate-100 hover:bg-[#000000] rounded-lg transition-all duration-150 cursor-pointer border border-slate-200"
              title="Cerrar sesión / Salir al selector de roles"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>

        </div>
      </header>

      {/* Confirmation Modal to Clear Demo Data */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-red-100">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <div className="p-2.5 bg-red-100 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-[#D60D1D]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">¿Borrar datos de muestra?</h3>
                <p className="text-xs text-slate-500">Limpieza total del sistema para producción</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
              Esta acción eliminará todos los productos de muestra, clientes demo, órdenes de compra y ventas de prueba.
              <strong> El navegador no mostrará los datos de muestra nuevamente</strong> y el sistema quedará listo para ingresar inventario real o sincronizar con Supabase.
            </p>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 mb-5">
              💡 Podrás restaurar los datos de prueba en cualquier momento con el botón "Restaurar Demo".
            </div>

            <div className="flex items-center justify-end gap-2.5">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  clearDemoData();
                  setShowClearConfirm(false);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-[#D60D1D] hover:bg-red-700 rounded-lg transition shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                Confirmar y Borrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
