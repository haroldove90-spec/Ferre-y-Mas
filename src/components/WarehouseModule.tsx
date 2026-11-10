import React, { useState } from 'react';
import { useERP } from '../context/ERPContext';
import { Product, PurchaseOrder, Shrinkage } from '../types/erp';
import { 
  Package, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  DownloadCloud, 
  ClipboardCheck, 
  AlertOctagon, 
  Truck, 
  Search, 
  Edit3, 
  Plus, 
  Save, 
  Layers, 
  Calendar, 
  Check
} from 'lucide-react';

export const WarehouseModule: React.FC = () => {
  const { 
    products, 
    activeModule, 
    purchaseOrders, 
    receivePurchaseOrder, 
    addShrinkage, 
    shrinkages,
    completeCycleCount, 
    cycleCounts,
    updateProductLocation,
    updateProductStock,
    addNewProduct,
    sales,
    updateDeliveryStatus
  } = useERP();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'todos' | 'bajo' | 'reorden'>('todos');

  // Location edit modal
  const [editingLocationProduct, setEditingLocationProduct] = useState<Product | null>(null);
  const [pasilloInput, setPasilloInput] = useState('');
  const [estanteInput, setEstanteInput] = useState('');
  const [charolaInput, setCharolaInput] = useState('');

  // Reception modal
  const [receptionOrder, setReceptionOrder] = useState<PurchaseOrder | null>(null);
  const [receivedQtys, setReceivedQtys] = useState<{ [key: string]: number }>({});
  const [receivedLots, setReceivedLots] = useState<{ [key: string]: string }>({});
  const [receivedExpiries, setReceivedExpiries] = useState<{ [key: string]: string }>({});

  // Cycle count
  const [selectedPasillo, setSelectedPasillo] = useState('P-01');
  const [cycleInputs, setCycleInputs] = useState<{ [key: string]: number }>({});

  // Merma modal
  const [showMermaModal, setShowMermaModal] = useState(false);
  const [mermaProdId, setMermaProdId] = useState(products[0]?.id || '');
  const [mermaQty, setMermaQty] = useState(1);
  const [mermaMotivo, setMermaMotivo] = useState<Shrinkage['motivo']>('rotura_en_tienda');
  const [mermaReportadoPor, setMermaReportadoPor] = useState('Almacenista Turno');

  // New product modal
  const [showNewProdModal, setShowNewProdModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdSku, setNewProdSku] = useState('');
  const [newProdCat, setNewProdCat] = useState<Product['categoria']>('Tornillería');
  const [newProdUnit, setNewProdUnit] = useState<Product['unidad']>('pieza');
  const [newProdPrice, setNewProdPrice] = useState(0);
  const [newProdPriceContr, setNewProdPriceContr] = useState(0);
  const [newProdCost, setNewProdCost] = useState(0);
  const [newProdStock, setNewProdStock] = useState(0);
  const [newProdMin, setNewProdMin] = useState(5);
  const [newProdMax, setNewProdMax] = useState(100);

  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.ubicacion.codigoUbicacion.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'bajo') return matchesSearch && p.stockActual <= p.stockMinimo;
    if (filterStatus === 'reorden') return matchesSearch && p.stockActual <= p.puntoReorden;
    return matchesSearch;
  });

  const handleOpenEditLocation = (p: Product) => {
    setEditingLocationProduct(p);
    setPasilloInput(p.ubicacion.pasillo);
    setEstanteInput(p.ubicacion.estante);
    setCharolaInput(p.ubicacion.charola);
  };

  const handleSaveLocation = () => {
    if (!editingLocationProduct) return;
    updateProductLocation(editingLocationProduct.id, {
      pasillo: pasilloInput,
      estante: estanteInput,
      charola: charolaInput
    });
    setEditingLocationProduct(null);
  };

  // Reception logic
  const handleStartReception = (po: PurchaseOrder) => {
    setReceptionOrder(po);
    const qtys: { [key: string]: number } = {};
    const lots: { [key: string]: string } = {};
    const exp: { [key: string]: string } = {};

    po.items.forEach(it => {
      qtys[it.productoId] = it.cantidadPedida;
      lots[it.productoId] = `LT-${Date.now().toString().slice(-5)}`;
      exp[it.productoId] = '2027-06-30';
    });

    setReceivedQtys(qtys);
    setReceivedLots(lots);
    setReceivedExpiries(exp);
  };

  const handleConfirmReception = () => {
    if (!receptionOrder) return;
    const items = receptionOrder.items.map(it => ({
      productoId: it.productoId,
      cantidad: receivedQtys[it.productoId] || it.cantidadPedida,
      lote: receivedLots[it.productoId],
      caducidad: receivedExpiries[it.productoId]
    }));

    receivePurchaseOrder(receptionOrder.id, items);
    setReceptionOrder(null);
  };

  // Cycle count
  const pasilloProducts = products.filter(p => p.ubicacion.pasillo === selectedPasillo);

  const handleCompletePasilloCount = () => {
    const items = pasilloProducts.map(p => ({
      productoId: p.id,
      conteoFisico: cycleInputs[p.id] !== undefined ? cycleInputs[p.id] : p.stockActual
    }));
    completeCycleCount(selectedPasillo, items);
    alert(`¡Inventario cíclico del ${selectedPasillo} completado y ajustado exitosamente!`);
    setCycleInputs({});
  };

  // Merma save
  const handleSaveMerma = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find(p => p.id === mermaProdId);
    if (!prod) return;

    addShrinkage({
      productoId: prod.id,
      productoNombre: prod.nombre,
      cantidad: mermaQty,
      unidad: prod.unidad,
      motivo: mermaMotivo,
      costoEstimado: Number((prod.costo * mermaQty).toFixed(2)),
      reportadoPor: mermaReportadoPor,
      estado: 'aplicado_inventario'
    });

    setShowMermaModal(false);
  };

  // New product save
  const handleSaveNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    addNewProduct({
      codigoBarras: `750${Math.floor(100000000 + Math.random() * 900000000)}`,
      sku: newProdSku || `SKU-${Date.now().toString().slice(-4)}`,
      nombre: newProdName,
      categoria: newProdCat,
      unidad: newProdUnit,
      permiteGranel: newProdUnit === 'kilo' || newProdUnit === 'metro' || newProdUnit === 'litro',
      precioPublico: newProdPrice,
      precioContratista: newProdPriceContr || Number((newProdPrice * 0.88).toFixed(2)),
      costo: newProdCost,
      stockActual: newProdStock,
      stockMinimo: newProdMin,
      stockMaximo: newProdMax,
      puntoReorden: Number((newProdMin * 1.3).toFixed(0)),
      ubicacion: {
        pasillo: 'P-01',
        estante: 'Estante A',
        charola: 'Nivel 01',
        codigoUbicacion: 'P01-EA-N01'
      },
      sucursales: [
        { sucursalId: 'matriz', nombre: 'Matriz Centro (Actual)', stock: newProdStock },
        { sucursalId: 'norte', nombre: 'Bodega Norte Industrial', stock: 0 },
        { sucursalId: 'sur', nombre: 'Sucursal Periférico Sur', stock: 0 }
      ],
      requiereLoteCaducidad: newProdCat === 'Pinturas y Adhesivos'
    });
    setShowNewProdModal(false);
    setNewProdName('');
  };

  return (
    <div className="space-y-5 pb-16 md:pb-6">
      
      {/* Module Title & Quick Stats */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
            <Package className="w-4 h-4 text-[#D60D1D]" />
            Control Operativo de Almacén & Bodega
          </span>
          <h2 className="font-heading font-black text-xl text-slate-900 mt-1">
            Inventarios, Recepciones y Ubicaciones Físicas
          </h2>
          <p className="text-xs text-slate-500">
            Control de pasillos, estantes y charolas para tornillería, materiales pesados y químicos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMermaModal(true)}
            className="px-3 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <AlertOctagon className="w-4 h-4 text-[#D60D1D]" />
            <span>Registrar Merma</span>
          </button>

          <button
            onClick={() => setShowNewProdModal(true)}
            className="px-3.5 py-2 text-xs font-bold text-white bg-[#D60D1D] hover:bg-red-700 rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#FED403]" />
            <span>Nuevo Producto</span>
          </button>
        </div>
      </div>

      {/* SUB-VIEW 1: CONTROL DE STOCK & UBICACIONES */}
      {(activeModule === 'stock' || activeModule === 'ubicaciones') && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          
          {/* Filter and Search Bar */}
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por artículo, SKU o ubicación..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white rounded-xl border border-slate-300 focus:ring-1 focus:ring-[#D60D1D]"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <button
                onClick={() => setFilterStatus('todos')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  filterStatus === 'todos' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                Todos ({products.length})
              </button>
              <button
                onClick={() => setFilterStatus('bajo')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  filterStatus === 'bajo' ? 'bg-[#D60D1D] text-white' : 'bg-white text-rose-700 border border-slate-200'
                }`}
              >
                Bajo Stock ({products.filter(p => p.stockActual <= p.stockMinimo).length})
              </button>
              <button
                onClick={() => setFilterStatus('reorden')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  filterStatus === 'reorden' ? 'bg-amber-500 text-black' : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                Punto Reorden ({products.filter(p => p.stockActual <= p.puntoReorden).length})
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Artículo / SKU</th>
                  <th className="py-3 px-4">Categoría</th>
                  <th className="py-3 px-4">Ubicación Física (Pasillo/Estante)</th>
                  <th className="py-3 px-4 text-center">Stock Actual</th>
                  <th className="py-3 px-4 text-center">Mín / Máx</th>
                  <th className="py-3 px-4 text-center">Lote / Caducidad</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredProducts.map(prod => {
                  const isLow = prod.stockActual <= prod.stockMinimo;
                  return (
                    <tr key={prod.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 leading-tight">{prod.nombre}</div>
                        <div className="text-[10px] text-slate-400 font-mono">SKU: {prod.sku}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-semibold">
                          {prod.categoria}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900 px-2 py-0.5 bg-slate-100 rounded border border-slate-200">
                            {prod.ubicacion.codigoUbicacion}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {prod.ubicacion.pasillo} • {prod.ubicacion.estante} • {prod.ubicacion.charola}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full font-bold text-xs ${
                          isLow ? 'bg-red-100 text-[#D60D1D] animate-pulse' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {prod.stockActual} {prod.unidad}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center text-[11px] text-slate-500 font-mono">
                        {prod.stockMinimo} / {prod.stockMaximo}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {prod.lote ? (
                          <div className="text-[11px]">
                            <span className="font-mono font-semibold text-slate-700">{prod.lote}</span>
                            {prod.caducidad && (
                              <div className="text-[10px] text-amber-700">Cad: {prod.caducidad}</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">No aplica</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleOpenEditLocation(prod)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:text-black bg-slate-100 hover:bg-slate-200 rounded-lg transition cursor-pointer"
                          title="Cambiar pasillo, estante o charola"
                        >
                          Mover Ubicación
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: RECEPCIÓN DE MERCANCÍA (COMPRAS -> ALMACÉN) */}
      {activeModule === 'recepcion' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                Recepción y Cotejo Físico de Mercancía de Proveedores
              </h3>
              <p className="text-xs text-slate-500">
                Valida las órdenes de compra emitidas contra las remisiones físicas recibidas en andén.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {purchaseOrders.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No hay órdenes de compra registradas.
              </div>
            ) : (
              purchaseOrders.map(order => (
                <div key={order.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-black text-sm text-slate-900">{order.folio}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        order.estado === 'recibida_completa' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {order.estado.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-xs text-slate-700 mt-1">
                      Proveedor: <strong>{order.proveedorNombre}</strong>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Fecha: {order.fechaCreacion} • {order.items.length} artículos en pedido
                    </div>
                  </div>

                  {order.estado !== 'recibida_completa' ? (
                    <button
                      onClick={() => handleStartReception(order)}
                      className="px-4 py-2 text-xs font-bold text-white bg-[#D60D1D] hover:bg-red-700 rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <DownloadCloud className="w-4 h-4 text-[#FED403]" />
                      <span>Cotejar y Recibir en Almacén</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Stock Ingresado ({order.fechaRecepcion})</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: INVENTARIOS CÍCLICOS POR PASILLO */}
      {activeModule === 'conteo' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                Inventarios Cíclicos por Pasillo o Sección
              </h3>
              <p className="text-xs text-slate-500">
                Herramienta para conteo rápido sin detener la venta de la ferretería.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">Pasillo a Contar:</span>
              <select
                value={selectedPasillo}
                onChange={e => setSelectedPasillo(e.target.value)}
                className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-300 bg-white"
              >
                {['P-01', 'P-02', 'P-03', 'P-04', 'P-05', 'P-06'].map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
            {pasilloProducts.map(prod => {
              const currentInput = cycleInputs[prod.id] !== undefined ? cycleInputs[prod.id] : prod.stockActual;
              const diff = Number((currentInput - prod.stockActual).toFixed(2));
              return (
                <div key={prod.id} className="p-3.5 flex items-center justify-between gap-4 bg-white hover:bg-slate-50">
                  <div>
                    <div className="font-bold text-xs text-slate-900">{prod.nombre}</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {prod.ubicacion.codigoUbicacion} • Stock Sistema: {prod.stockActual} {prod.unidad}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-slate-600">Conteo Físico:</span>
                      <input
                        type="number"
                        step={prod.permiteGranel ? "0.25" : "1"}
                        value={currentInput}
                        onChange={e => setCycleInputs({ ...cycleInputs, [prod.id]: parseFloat(e.target.value) || 0 })}
                        className="w-20 px-2 py-1 text-xs font-bold text-center border border-slate-300 rounded focus:ring-1 focus:ring-[#D60D1D]"
                      />
                    </div>

                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      diff === 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {diff === 0 ? 'Cuadrado' : `${diff > 0 ? '+' : ''}${diff}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleCompletePasilloCount}
              className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-slate-900 hover:bg-black rounded-xl transition shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <ClipboardCheck className="w-4 h-4 text-[#FED403]" />
              <span>Ajustar Inventario del Pasillo {selectedPasillo}</span>
            </button>
          </div>
        </div>
      )}

      {/* SUB-VIEW 4: CONTROL DE MERMAS Y DEVOLUCIONES */}
      {activeModule === 'mermas' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                Registro de Mermas, Roturas y Devoluciones a Proveedor
              </h3>
              <p className="text-xs text-slate-500">
                Seguimiento de artículos dañados, caducos o con defecto de fábrica para salvaguardar costos.
              </p>
            </div>
            <button
              onClick={() => setShowMermaModal(true)}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#D60D1D] hover:bg-red-700 rounded-lg transition"
            >
              + Nueva Merma
            </button>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
            {shrinkages.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No hay mermas registradas.
              </div>
            ) : (
              shrinkages.map(m => (
                <div key={m.id} className="p-3.5 flex items-center justify-between text-xs bg-white">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{m.folio}</span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700">
                        {m.motivo.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="text-slate-700 mt-1">
                      {m.productoNombre} ({m.cantidad} {m.unidad})
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Fecha: {m.fecha} • Reportado por: {m.reportadoPor}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-black text-sm text-[#D60D1D]">
                      -${m.costoEstimado.toFixed(2)} MXN
                    </div>
                    <span className="text-[10px] text-emerald-700 font-semibold">
                      Aplicado a Inventario
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* SUB-VIEW 5: DESPACHO Y SALIDA DE MATERIALES PESADOS */}
      {activeModule === 'despacho' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="pb-3 border-b border-slate-200">
            <h3 className="font-heading font-bold text-base text-slate-900">
              Despacho, Carga y Rutas de Entrega a Domicilio
            </h3>
            <p className="text-xs text-slate-500">
              Gestión de pedidos con entrega programada (cemento, varilla, tinacos, tubería de 6m).
            </p>
          </div>

          <div className="space-y-3">
            {sales.filter(s => s.requiereEntrega).length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No hay notas de entrega activas pendientes de despacho.
              </div>
            ) : (
              sales.filter(s => s.requiereEntrega).map(sale => (
                <div key={sale.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{sale.folio}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        sale.estadoEntrega === 'entregado' ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {sale.estadoEntrega?.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-xs text-slate-700 mt-1">
                      Cliente: <strong>{sale.clienteNombre}</strong>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Destino: {sale.direccionEntrega || 'Dirección de obra especificada'}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {sale.items.map(it => `${it.cantidad} ${it.unidadSeleccionada} ${it.producto.nombre}`).join(' • ')}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {sale.estadoEntrega !== 'entregado' ? (
                      <select
                        value={sale.estadoEntrega}
                        onChange={e => updateDeliveryStatus(sale.id, e.target.value as any)}
                        className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-300 bg-white"
                      >
                        <option value="pendiente_carga">Pendiente Carga en Patio</option>
                        <option value="en_ruta">En Ruta (Vehículo en camino)</option>
                        <option value="entregado">Entregado en Obra</option>
                      </select>
                    ) : (
                      <span className="px-3 py-1 text-xs font-bold text-emerald-700 bg-emerald-100 rounded-lg">
                        Entrega Finalizada
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* MODAL EDITAR UBICACIÓN FÍSICA */}
      {editingLocationProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-heading font-black text-base">Mapear Ubicación en Almacén</h3>
                <p className="text-xs text-slate-300 truncate max-w-xs">{editingLocationProduct.nombre}</p>
              </div>
              <button onClick={() => setEditingLocationProduct(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="p-5 space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pasillo</label>
                <input
                  type="text"
                  placeholder="Ej. P-01, P-02..."
                  value={pasilloInput}
                  onChange={e => setPasilloInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#D60D1D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Estante o Rack</label>
                <input
                  type="text"
                  placeholder="Ej. Estante A, Rack 02..."
                  value={estanteInput}
                  onChange={e => setEstanteInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#D60D1D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Charola, Nivel o Gaveta</label>
                <input
                  type="text"
                  placeholder="Ej. Charola 12, Nivel 03, Gaveta 4..."
                  value={charolaInput}
                  onChange={e => setCharolaInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#D60D1D]"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600">
                Código generado: <strong className="text-slate-900">{pasilloInput}-{estanteInput.slice(0, 2).toUpperCase()}-{charolaInput.slice(0, 4).toUpperCase()}</strong>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setEditingLocationProduct(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveLocation}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#D60D1D] hover:bg-red-700 rounded-lg transition"
                >
                  Guardar Ubicación
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL COTEJAR RECEPCIÓN DE ORDEN DE COMPRA */}
      {receptionOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-heading font-black text-base sm:text-lg">
                  Validación y Recepción de Mercancía: {receptionOrder.folio}
                </h3>
                <p className="text-xs text-slate-300">Proveedor: {receptionOrder.proveedorNombre}</p>
              </div>
              <button onClick={() => setReceptionOrder(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-900">
                Coteja cada renglón físico contra lo pedido. Para selladores o pegamentos, registra el lote y fecha de caducidad.
              </div>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {receptionOrder.items.map(it => (
                  <div key={it.productoId} className="p-3.5 space-y-2 bg-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-slate-900">{it.nombre}</div>
                        <div className="text-[11px] text-slate-400 font-mono">SKU: {it.sku}</div>
                      </div>
                      <span className="text-xs text-slate-600 font-semibold">
                        Pedido: {it.cantidadPedida}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Cantidad Recibida</label>
                        <input
                          type="number"
                          value={receivedQtys[it.productoId] ?? it.cantidadPedida}
                          onChange={e => setReceivedQtys({ ...receivedQtys, [it.productoId]: parseFloat(e.target.value) || 0 })}
                          className="w-full px-2.5 py-1 text-xs font-bold border border-slate-300 rounded"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Lote de Fábrica</label>
                        <input
                          type="text"
                          placeholder="LT-XXXXX"
                          value={receivedLots[it.productoId] || ''}
                          onChange={e => setReceivedLots({ ...receivedLots, [it.productoId]: e.target.value })}
                          className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Fecha Caducidad</label>
                        <input
                          type="date"
                          value={receivedExpiries[it.productoId] || ''}
                          onChange={e => setReceivedExpiries({ ...receivedExpiries, [it.productoId]: e.target.value })}
                          className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                onClick={() => setReceptionOrder(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmReception}
                className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Confirmar Recepción y Aumentar Stock</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL REGISTRAR MERMA */}
      {showMermaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-heading font-black text-base">Registrar Merma / Daño de Mercancía</h3>
              <button onClick={() => setShowMermaModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveMerma} className="p-5 space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Producto Afectado</label>
                <select
                  value={mermaProdId}
                  onChange={e => setMermaProdId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.nombre} (Stock: {p.stockActual} {p.unidad})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Cantidad de Merma</label>
                <input
                  type="number"
                  required
                  min="0.1"
                  step="0.1"
                  value={mermaQty}
                  onChange={e => setMermaQty(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-xs font-bold rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Causa de la Merma</label>
                <select
                  value={mermaMotivo}
                  onChange={e => setMermaMotivo(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                >
                  <option value="rotura_en_tienda">Rotura / Caída en tienda</option>
                  <option value="daño_transporte">Daño en transporte / flete</option>
                  <option value="caducidad_vencida">Caducidad vencida (químico/cemento)</option>
                  <option value="defecto_fabrica">Defecto de fábrica (devolución)</option>
                  <option value="merma_corte">Merma por corte (cables/mangueras)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowMermaModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#D60D1D] hover:bg-red-700 rounded-lg"
                >
                  Aplicar Descuento de Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CREAR NUEVO PRODUCTO */}
      {showNewProdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-heading font-black text-base">Registrar Nuevo Producto en Catálogo</h3>
              <button onClick={() => setShowNewProdModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveNewProduct} className="p-5 overflow-y-auto space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nombre Completo del Artículo</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Codo PVC Sanitario 4 Pulgadas..."
                  value={newProdName}
                  onChange={e => setNewProdName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#D60D1D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">SKU / Clave</label>
                  <input
                    type="text"
                    placeholder="SAN-COD-04"
                    value={newProdSku}
                    onChange={e => setNewProdSku(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 text-xs font-mono uppercase border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Categoría</label>
                  <select
                    value={newProdCat}
                    onChange={e => setNewProdCat(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  >
                    <option value="Tornillería">Tornillería</option>
                    <option value="Plomería">Plomería</option>
                    <option value="Eléctrico">Eléctrico</option>
                    <option value="Pinturas y Adhesivos">Pinturas y Adhesivos</option>
                    <option value="Herramientas">Herramientas</option>
                    <option value="Construcción">Construcción</option>
                    <option value="Cerrajería">Cerrajería</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Unidad</label>
                  <select
                    value={newProdUnit}
                    onChange={e => setNewProdUnit(e.target.value as any)}
                    className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-lg"
                  >
                    <option value="pieza">Pieza</option>
                    <option value="kilo">Kilo</option>
                    <option value="metro">Metro</option>
                    <option value="litro">Litro</option>
                    <option value="caja">Caja</option>
                    <option value="rollo">Rollo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Costo Compra</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProdCost || ''}
                    onChange={e => setNewProdCost(parseFloat(e.target.value) || 0)}
                    placeholder="$ 0.00"
                    className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Precio Público</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProdPrice || ''}
                    onChange={e => setNewProdPrice(parseFloat(e.target.value) || 0)}
                    placeholder="$ 0.00"
                    className="w-full px-2 py-1.5 text-xs font-bold border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Precio Contratista</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProdPriceContr || ''}
                    onChange={e => setNewProdPriceContr(parseFloat(e.target.value) || 0)}
                    placeholder="$ 0.00"
                    className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Stock Inicial</label>
                  <input
                    type="number"
                    value={newProdStock}
                    onChange={e => setNewProdStock(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Stock Mínimo</label>
                  <input
                    type="number"
                    value={newProdMin}
                    onChange={e => setNewProdMin(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Stock Máximo</label>
                  <input
                    type="number"
                    value={newProdMax}
                    onChange={e => setNewProdMax(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewProdModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#D60D1D] hover:bg-red-700 rounded-lg transition"
                >
                  Crear Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
