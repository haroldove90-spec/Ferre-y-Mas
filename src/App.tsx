import React, { useState } from 'react';
import { ERPProvider, useERP } from './context/ERPContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BottomBar } from './components/BottomBar';
import { RoleSelector } from './components/RoleSelector';
import { SplashScreen } from './components/SplashScreen';
import { POSModule } from './components/POSModule';
import { CashDrawerModule } from './components/CashDrawerModule';
import { LayawaysModule } from './components/LayawaysModule';
import { BranchesStockView } from './components/BranchesStockView';
import { SalesHistoryView } from './components/SalesHistoryView';
import { WarehouseModule } from './components/WarehouseModule';
import { PurchasingModule } from './components/PurchasingModule';
import { AdminModule } from './components/AdminModule';
import { TicketModal } from './components/TicketModal';
import { WorkflowModal } from './components/WorkflowModal';
import { SupabaseConfigModal } from './components/SupabaseConfigModal';

const ERPAppContent: React.FC = () => {
  const { activeRole, setActiveRole, activeModule } = useERP();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(() => {
    // Show splash only on first open
    return !sessionStorage.getItem('ferre_splash_shown');
  });

  const handleFinishSplash = () => {
    sessionStorage.setItem('ferre_splash_shown', 'true');
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onFinish={handleFinishSplash} />;
  }

  // ACCESO POR ROLES EN INICIO (Sin header, sin descripciones, solo nombre del rol y logo sin encapsular)
  if (!activeRole) {
    return <RoleSelector onSelectRole={role => setActiveRole(role)} />;
  }

  // Active Role Workspace
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-900 font-sans selection:bg-[#FED403] selection:text-black">
      
      {/* Cabecera Institucional Unificada */}
      <Header onToggleSidebar={() => setSidebarOpen(prev => !prev)} />

      <div className="flex-1 flex overflow-hidden">
        {/* Menú Lateral Desplegable en Escritorio */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Workspace (Clean, no duplicate horizontal tabs) */}
        <main className="flex-1 md:pl-64 flex flex-col min-w-0 overflow-y-auto">
          <div className="max-w-7xl w-full mx-auto p-3 sm:p-6 flex-1">
            
            {/* Cajero / Vendedor Modules */}
            {activeRole === 'cajero' && (
              <>
                {activeModule === 'pos' && <POSModule />}
                {activeModule === 'caja' && <CashDrawerModule />}
                {activeModule === 'apartados' && <LayawaysModule />}
                {activeModule === 'stock_sucursales' && <BranchesStockView />}
                {activeModule === 'historial_ventas' && <SalesHistoryView />}
              </>
            )}

            {/* Encargado de Almacén / Inventarios Modules */}
            {activeRole === 'almacen' && <WarehouseModule />}

            {/* Compras y Proveedores Modules */}
            {activeRole === 'compras' && <PurchasingModule />}

            {/* Administrador / Gerente Modules */}
            {activeRole === 'administrador' && <AdminModule />}

          </div>
        </main>
      </div>

      {/* Navegación Móvil y Tablet (Bottom Bar) */}
      <BottomBar />

      {/* Global Modals */}
      <TicketModal />
      <WorkflowModal />
      <SupabaseConfigModal />
    </div>
  );
};

export default function App() {
  return (
    <ERPProvider>
      <ERPAppContent />
    </ERPProvider>
  );
}
