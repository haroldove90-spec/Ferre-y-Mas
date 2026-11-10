import React, { useState } from 'react';
import { Download, Smartphone, Check, X, Share2, PlusSquare } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  // If already running standalone
  if (isInstalled) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-100 rounded-full border border-emerald-200 shadow-xs">
        <Check className="w-3.5 h-3.5 text-emerald-600" />
        <span className="hidden sm:inline">App Instalada</span>
      </div>
    );
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (!success) {
        setShowGuide(true);
      }
    } else {
      setShowGuide(true);
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        title="Instalar Ferre y Más en Android, iOS y Computadora"
        className={`flex items-center gap-1.5 font-bold transition-all duration-150 active:scale-95 shadow-xs cursor-pointer ${
          compact
            ? 'px-2.5 py-1.5 text-xs rounded-lg bg-[#FED403] text-black hover:bg-[#ffe23b] border border-amber-300'
            : 'px-3 py-1.5 text-xs sm:text-sm rounded-lg bg-[#FED403] text-black hover:bg-[#ffe23b] border border-amber-300 font-extrabold'
        }`}
      >
        <Download className="w-4 h-4 text-black animate-bounce" />
        <span>Instalar App</span>
      </button>

      {/* Guide Modal for iOS & Desktop browsers */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <img 
                  src="https://appdesignproyectos.com/futuraicono.png" 
                  alt="Ferre y Más Icono" 
                  className="w-8 h-8 rounded-lg shadow-xs" 
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">Instalar Ferre y Más</h3>
                  <p className="text-xs text-slate-500">Android, iOS y Computadoras</p>
                </div>
              </div>
              <button 
                onClick={() => setShowGuide(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-xs sm:text-sm">
              {isIOS ? (
                <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 space-y-2">
                  <div className="font-semibold flex items-center gap-1.5 text-amber-950">
                    <Smartphone className="w-4 h-4 text-[#D60D1D]" /> Pasos para iPhone / iPad (Safari):
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-slate-700 text-xs">
                    <li>Toca el botón <strong>Compartir</strong> <Share2 className="w-3.5 h-3.5 inline mx-0.5 text-blue-600" /> en la barra inferior de Safari.</li>
                    <li>Desplázate hacia abajo y selecciona <strong>Agregar a Inicio</strong> <PlusSquare className="w-3.5 h-3.5 inline mx-0.5 text-slate-700" />.</li>
                    <li>Confirma el nombre <strong>Ferre y Más</strong> y pulsa <strong>Agregar</strong>.</li>
                  </ol>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="font-semibold text-slate-900 text-xs flex items-center gap-1 mb-1">
                      📱 En Android (Chrome / Edge):
                    </div>
                    <p className="text-xs text-slate-600">
                      Toca el menú de tres puntos (⋮) en la esquina superior derecha y presiona <strong>"Instalar aplicación"</strong> o <strong>"Agregar a la pantalla principal"</strong>.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="font-semibold text-slate-900 text-xs flex items-center gap-1 mb-1">
                      💻 En Computadora (Chrome / Edge):
                    </div>
                    <p className="text-xs text-slate-600">
                      Haz clic en el icono de instalación <Download className="w-3.5 h-3.5 inline mx-0.5 text-[#D60D1D]" /> en el extremo derecho de la barra de direcciones de tu navegador para usarlo como app de escritorio.
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-slate-100 p-3 rounded-xl flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs text-slate-700">Acceso ultrarrápido al POS y Almacén sin conexión o con red intermitente.</span>
              </div>
            </div>

            <button
              onClick={() => setShowGuide(false)}
              className="mt-5 w-full rounded-xl bg-[#D60D1D] py-2.5 text-sm font-bold text-white hover:bg-red-700 transition shadow-sm cursor-pointer"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
};
