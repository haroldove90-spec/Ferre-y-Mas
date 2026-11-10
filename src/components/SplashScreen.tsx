import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onFinish, 300);
          return 100;
        }
        return prev + 20;
      });
    }, 180);

    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white p-6 selection:bg-none">
      <div className="flex flex-col items-center text-center max-w-sm w-full animate-in fade-in zoom-in-95 duration-500">
        
        {/* Splash Logos sin encapsular */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <img
            src="https://daloocomercializadora.com.mx/ferreicono.png"
            alt="Ferre y Más Icono"
            className="h-16 sm:h-20 w-auto object-contain"
          />
          <img
            src="https://daloocomercializadora.com.mx/ferrelogo.png"
            alt="Ferre y Más Logo"
            className="h-16 sm:h-20 w-auto object-contain"
          />
        </div>

        <h1 className="font-heading font-black text-2xl sm:text-3xl tracking-tight text-slate-900 mb-1">
          Ferre y Más
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-slate-500 mb-8">
          Sistema ERP Integral de Ferretería
        </p>

        {/* Brand progress bar */}
        <div className="w-48 sm:w-60 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
          <div
            className="h-full bg-gradient-to-r from-[#D60D1D] via-[#FED403] to-[#D60D1D] transition-all duration-200 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="text-[11px] font-semibold text-slate-400 mt-3">
          Cargando módulos operativos...
        </span>
      </div>
    </div>
  );
};
