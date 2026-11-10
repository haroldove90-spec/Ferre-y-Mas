import React, { useState } from 'react';
import { useERP } from '../context/ERPContext';
import { MapPin, Search, Package } from 'lucide-react';

export const BranchesStockView: React.FC = () => {
  const { products } = useERP();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = products.filter(p => 
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4 pb-16 md:pb-6">
      <div className="pb-3 border-b border-slate-200">
        <h2 className="font-heading font-black text-xl text-slate-900">
          Consulta de Stock en Red de Sucursales y Bodegas
        </h2>
        <p className="text-xs text-slate-500">
          Revisa disponibilidad en tiempo real en Matriz Centro, Bodega Norte y Sucursal Periférico Sur.
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar producto por nombre o SKU..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-1 focus:ring-[#D60D1D]"
        />
      </div>

      <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
        {filtered.map(prod => (
          <div key={prod.id} className="p-4 bg-white hover:bg-slate-50 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <h4 className="font-bold text-sm text-slate-900">{prod.nombre}</h4>
                <div className="text-[11px] text-slate-400 font-mono">SKU: {prod.sku} • {prod.categoria}</div>
              </div>
              <div className="text-xs text-slate-600">
                Ubicación Matriz: <strong className="font-mono text-slate-900">{prod.ubicacion.codigoUbicacion}</strong>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              {prod.sucursales.map(branch => (
                <div key={branch.sucursalId} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-medium text-slate-700">{branch.nombre}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded font-bold ${
                    branch.stock > 10 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {branch.stock} {prod.unidad}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
