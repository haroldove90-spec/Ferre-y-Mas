import React, { useState } from 'react';
import { useERP } from '../context/ERPContext';
import { 
  X, 
  Database, 
  Check, 
  Copy, 
  Trash2, 
  RefreshCw, 
  Key, 
  Server,
  Code2,
  ExternalLink
} from 'lucide-react';

export const SupabaseConfigModal: React.FC = () => {
  const { 
    showSupabaseModal, 
    setShowSupabaseModal, 
    supabaseConfig, 
    updateSupabaseConfig, 
    clearSupabaseData,
    clearDemoData 
  } = useERP();

  const [url, setUrl] = useState(supabaseConfig.url || '');
  const [anonKey, setAnonKey] = useState(supabaseConfig.anonKey || '');
  const [copied, setCopied] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [clearSuccess, setClearSuccess] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!showSupabaseModal) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSupabaseConfig({ url, anonKey });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleClearAllSupabase = async () => {
    setIsClearing(true);
    await new Promise(r => setTimeout(r, 600));
    await clearSupabaseData();
    clearDemoData();
    setIsClearing(false);
    setClearSuccess(true);
    setTimeout(() => setClearSuccess(false), 3000);
  };

  const sqlSchema = `-- Esquema SQL para Ferre y Más en Supabase (PostgreSQL)
-- Copia y pega en SQL Editor de tu proyecto Supabase:

CREATE TABLE IF NOT EXISTS productos (
  id TEXT PRIMARY KEY,
  codigo_barras TEXT,
  sku TEXT UNIQUE,
  nombre TEXT NOT NULL,
  categoria TEXT,
  unidad TEXT DEFAULT 'pieza',
  permite_granel BOOLEAN DEFAULT false,
  precio_publico NUMERIC(12,2) NOT NULL,
  precio_contratista NUMERIC(12,2) NOT NULL,
  costo NUMERIC(12,2) NOT NULL,
  stock_actual NUMERIC(12,3) DEFAULT 0,
  stock_minimo NUMERIC(12,3) DEFAULT 5,
  stock_maximo NUMERIC(12,3) DEFAULT 100,
  punto_reorden NUMERIC(12,3) DEFAULT 10,
  pasillo TEXT,
  estante TEXT,
  charola TEXT,
  lote TEXT,
  caducidad DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ventas (
  id TEXT PRIMARY KEY,
  folio TEXT UNIQUE,
  fecha TIMESTAMPTZ DEFAULT now(),
  cajero_nombre TEXT,
  tipo_comprobante TEXT,
  cliente_nombre TEXT,
  cliente_rfc TEXT,
  metodo_pago TEXT,
  subtotal NUMERIC(12,2),
  iva NUMERIC(12,2),
  total NUMERIC(12,2),
  requiere_entrega BOOLEAN DEFAULT false,
  estado_entrega TEXT DEFAULT 'no_aplica'
);

CREATE TABLE IF NOT EXISTS ordenes_compra (
  id TEXT PRIMARY KEY,
  folio TEXT UNIQUE,
  proveedor_nombre TEXT,
  fecha_creacion DATE DEFAULT CURRENT_DATE,
  fecha_esperada DATE,
  estado TEXT DEFAULT 'sugerida',
  total NUMERIC(12,2),
  notas TEXT
);

CREATE TABLE IF NOT EXISTS cortes_caja (
  id TEXT PRIMARY KEY,
  cajero_nombre TEXT,
  fecha_apertura TIMESTAMPTZ DEFAULT now(),
  fecha_cierre TIMESTAMPTZ,
  fondo_inicial NUMERIC(12,2),
  total_ventas_efectivo NUMERIC(12,2),
  monto_real_efectivo NUMERIC(12,2),
  diferencia NUMERIC(12,2),
  estado TEXT DEFAULT 'abierta'
);

-- Para vaciar registros cuando se requiera limpieza:
-- TRUNCATE TABLE ventas, ordenes_compra, cortes_caja;`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-600 rounded-xl text-white">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-black text-base sm:text-lg text-white">
                Configuración y Sincronización Supabase
              </h2>
              <p className="text-xs text-slate-300">
                Base de datos PostgreSQL en la nube para Ferre y Más
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowSupabaseModal(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Status Badge */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border bg-slate-50 border-slate-200">
            <div className="flex items-center gap-2.5">
              <span className={`w-3 h-3 rounded-full ${supabaseConfig.isConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
              <span className="text-xs sm:text-sm font-bold text-slate-800">
                {supabaseConfig.isConfigured ? 'Conexión Supabase Guardada' : 'Modo Local Activo (Sin Supabase configurado)'}
              </span>
            </div>
            <a 
              href="https://supabase.com/dashboard" 
              target="_blank" 
              rel="noreferrer"
              className="text-xs text-[#D60D1D] hover:underline flex items-center gap-1 font-semibold"
            >
              <span>Abrir Supabase</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-slate-500" />
                Project URL de Supabase
              </label>
              <input
                type="text"
                placeholder="https://xyzcompany.supabase.co"
                value={url}
                onChange={e => setUrl(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#D60D1D] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-slate-500" />
                Anon Public Key / Service Key
              </label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={anonKey}
                onChange={e => setAnonKey(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#D60D1D] focus:border-transparent font-mono"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Las credenciales se guardan de forma segura en tu navegador.
              </span>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-black rounded-lg transition shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4 text-[#FED403]" />
                Guardar Conexión
              </button>
            </div>

            {savedSuccess && (
              <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                ¡Configuración de Supabase guardada exitosamente!
              </div>
            )}
          </form>

          {/* Borrado de registros de muestra / Supabase */}
          <div className="p-4 bg-red-50/60 rounded-xl border border-red-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-950 font-bold text-xs sm:text-sm">
                <Trash2 className="w-4 h-4 text-[#D60D1D]" />
                Limpieza y Borrado de Registros de Muestra
              </div>
              <button
                onClick={handleClearAllSupabase}
                disabled={isClearing}
                className="px-3 py-1.5 text-xs font-bold text-white bg-[#D60D1D] hover:bg-red-700 rounded-lg transition shadow-xs cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                {isClearing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>Borrar Registros Ahora</span>
              </button>
            </div>
            <p className="text-xs text-slate-600">
              Esta función borra de inmediato los datos de muestra del navegador para que no se vuelvan a mostrar, y ejecuta el protocolo de limpieza para Supabase cuando esté conectado.
            </p>

            {clearSuccess && (
              <div className="p-2 bg-emerald-100 text-emerald-900 rounded-lg text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                ¡Registros demo eliminados permanentemente! El sistema está en blanco.
              </div>
            )}
          </div>

          {/* SQL Schema Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-slate-500" />
                Script DDL de Tablas para Supabase
              </span>
              <button
                onClick={copySql}
                className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado' : 'Copiar SQL'}</span>
              </button>
            </div>
            <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl text-[11px] font-mono overflow-x-auto max-h-40 leading-relaxed">
              {sqlSchema}
            </pre>
          </div>

        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => setShowSupabaseModal(false)}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg cursor-pointer"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
