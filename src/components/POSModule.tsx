import React, { useState } from 'react';
import { useERP } from '../context/ERPContext';
import { Product, TipoComprobante, Sale } from '../types/erp';
import { 
  Search, 
  Barcode, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard, 
  Banknote, 
  Truck, 
  MapPin, 
  Clock, 
  DollarSign, 
  Receipt, 
  Percent, 
  UserCheck, 
  ShieldAlert,
  Package,
  Layers,
  Sparkles,
  ArrowRight,
  ShoppingCart
} from 'lucide-react';

export const POSModule: React.FC = () => {
  const { 
    products, 
    cart, 
    addToCart, 
    removeFromCart, 
    updateCartItemQuantity, 
    updateCartItemPriceType,
    updateCartItemDiscount, 
    clearCart,
    activeClient,
    setActiveClient,
    clients,
    completeSale,
    createLayaway,
    activeRole,
    setSelectedTicketSale
  } = useERP();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [quickAddAmount, setQuickAddAmount] = useState<number>(1);
  const [quickFractionUnit, setQuickFractionUnit] = useState<string>('pieza');

  // Checkout modal states
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [tipoComprobante, setTipoComprobante] = useState<TipoComprobante>('ticket');
  const [metodoPago, setMetodoPago] = useState<Sale['metodoPago']>('efectivo');
  const [efectivoRecibido, setEfectivoRecibido] = useState<number>(0);
  const [requiereEntrega, setRequiereEntrega] = useState(false);
  const [direccionEntrega, setDireccionEntrega] = useState('');
  const [clienteRfc, setClienteRfc] = useState('');
  const [usoCfdi, setUsoCfdi] = useState('G03 - Gastos en general');
  const [notas, setNotas] = useState('');

  // Apartado / Preventa modal
  const [showLayawayModal, setShowLayawayModal] = useState(false);
  const [layawayClient, setLayawayClient] = useState('');
  const [layawayPhone, setLayawayPhone] = useState('');
  const [layawayAnticipo, setLayawayAnticipo] = useState<number>(0);

  // Stock branches viewer modal
  const [selectedProductStock, setSelectedProductStock] = useState<Product | null>(null);

  // Discount error
  const [discountError, setDiscountError] = useState<string | null>(null);

  const categories = [
    'Todas',
    'Tornillería',
    'Plomería',
    'Eléctrico',
    'Pinturas y Adhesivos',
    'Herramientas',
    'Construcción',
    'Cerrajería'
  ];

  // Filtered products by search or category
  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.codigoBarras.includes(searchTerm) ||
      p.categoria.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCat = selectedCategory === 'Todas' || p.categoria === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const cartSubtotal = cart.reduce((acc, it) => acc + it.subtotal, 0);
  const cartIva = Number((cartSubtotal * 0.16).toFixed(2));
  const cartTotal = Number((cartSubtotal + cartIva).toFixed(2));

  const handleQuickAdd = (product: Product) => {
    addToCart(product, 1);
  };

  const handleCustomFractionAdd = (product: Product, amount: number, unitLabel: string) => {
    addToCart(product, amount, unitLabel);
  };

  const handleDiscountChange = (productId: string, val: number) => {
    const success = updateCartItemDiscount(productId, val);
    if (!success) {
      setDiscountError('Los cajeros solo tienen autorización para aplicar hasta un 5% de descuento máximo.');
      setTimeout(() => setDiscountError(null), 3500);
    }
  };

  const handleFinishCheckout = () => {
    if (cart.length === 0) return;
    const sale = completeSale({
      tipoComprobante,
      metodoPago,
      clienteRfc,
      usoCfdi,
      efectivoRecibido: metodoPago === 'efectivo' ? efectivoRecibido : undefined,
      requiereEntrega,
      direccionEntrega: requiereEntrega ? direccionEntrega : undefined,
      notas
    });
    if (sale) {
      setShowCheckoutModal(false);
      // ticket is automatically opened via context setSelectedTicketSale
    }
  };

  const handleCreateLayawaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!layawayClient || layawayAnticipo <= 0) return;
    createLayaway(layawayClient, layawayPhone, layawayAnticipo);
    setShowLayawayModal(false);
    setLayawayClient('');
    setLayawayPhone('');
    setLayawayAnticipo(0);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full pb-16 md:pb-0">
      
      {/* LEFT COLUMN: Product Catalog & Fast Search */}
      <div className="flex-1 flex flex-col min-w-0 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Top Search & Filter Bar */}
        <div className="p-3 sm:p-4 border-b border-slate-200 space-y-3 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, SKU, código de barras o categoría..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#D60D1D] focus:border-transparent font-medium"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  Limpiar
                </button>
              )}
            </div>

            {/* Quick barcode indicator badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-2.5 bg-white rounded-xl border border-slate-300 text-xs font-semibold text-slate-600">
              <Barcode className="w-4 h-4 text-[#D60D1D]" />
              <span>Lector Listo</span>
            </div>
          </div>

          {/* Categories Pill Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#D60D1D] text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 p-3 sm:p-4 overflow-y-auto">
          {filteredProducts.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <Package className="w-12 h-12 stroke-1 mb-2 text-slate-300" />
              <p className="font-bold text-sm text-slate-600">No se encontraron productos</p>
              <p className="text-xs text-slate-400 max-w-sm mt-1">
                Verifica el término de búsqueda o asegúrate de que no se hayan borrado los productos de muestra.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {filteredProducts.map(product => {
                const isContratista = activeClient?.tipo === 'contratista' || activeClient?.tipo === 'constructora';
                const currentPrice = isContratista ? product.precioContratista : product.precioPublico;
                const isLowStock = product.stockActual <= product.stockMinimo;

                return (
                  <div
                    key={product.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-[#FED403] hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Category & Branch Stock Trigger */}
                      <div className="flex items-center justify-between text-[11px] mb-1.5">
                        <span className="font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                          {product.categoria}
                        </span>
                        
                        <button
                          onClick={() => setSelectedProductStock(product)}
                          className="flex items-center gap-1 text-[10px] text-blue-700 hover:underline font-semibold cursor-pointer"
                          title="Ver stock en sucursales"
                        >
                          <MapPin className="w-3 h-3 text-blue-600" />
                          <span>Sucursales</span>
                        </button>
                      </div>

                      {/* Product Name & SKU */}
                      <h4 className="font-heading font-bold text-xs sm:text-sm text-slate-900 group-hover:text-[#D60D1D] transition-colors line-clamp-2 leading-snug">
                        {product.nombre}
                      </h4>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        SKU: {product.sku}
                      </div>

                      {/* Stock & Location */}
                      <div className="flex items-center justify-between text-xs mt-2 text-slate-600">
                        <span className="flex items-center gap-1">
                          <span className={`w-2 h-2 rounded-full ${isLowStock ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
                          <strong className={isLowStock ? 'text-red-600 font-bold' : 'text-slate-800'}>
                            {product.stockActual} {product.unidad}
                          </strong>
                          {isLowStock && <span className="text-[10px] text-red-500">(Bajo)</span>}
                        </span>
                        <span className="text-[10px] bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200 text-slate-500 font-mono">
                          {product.ubicacion.codigoUbicacion}
                        </span>
                      </div>
                    </div>

                    {/* Pricing & Add buttons */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div>
                        <div className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                          ${currentPrice.toFixed(2)}
                          <span className="text-[10px] font-normal text-slate-500 ml-0.5">
                            /{product.unidad}
                          </span>
                        </div>
                        {isContratista && (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1 rounded">
                            Tarifa Contratista
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        {/* Granel / Fraccionado Quick Button */}
                        {product.permiteGranel && (
                          <div className="flex items-center gap-1">
                            {product.unidad === 'kilo' && (
                              <button
                                onClick={() => handleCustomFractionAdd(product, 0.250, 'kg (250g)')}
                                className="px-1.5 py-1 text-[10px] font-bold bg-slate-100 hover:bg-slate-200 rounded text-slate-700 cursor-pointer"
                                title="Agregar 250 gramos"
                              >
                                250g
                              </button>
                            )}
                            {product.unidad === 'metro' && (
                              <button
                                onClick={() => handleCustomFractionAdd(product, 0.5, 'm (50cm)')}
                                className="px-1.5 py-1 text-[10px] font-bold bg-slate-100 hover:bg-slate-200 rounded text-slate-700 cursor-pointer"
                                title="Agregar 50 cm"
                              >
                                0.5m
                              </button>
                            )}
                          </div>
                        )}

                        <button
                          onClick={() => handleQuickAdd(product)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#D60D1D] hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1 transition shadow-xs cursor-pointer active:scale-95"
                          title="Agregar al carrito de venta"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Agregar</span>
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* RIGHT COLUMN: POS Cart, Customer & Checkout */}
      <div className="w-full lg:w-96 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Customer Selector Header */}
        <div className="p-3.5 border-b border-slate-200 bg-slate-50 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-[#D60D1D]" />
              Cliente en Mostrador
            </span>
            {activeClient?.tipo !== 'publico_general' && (
              <span className="text-[10px] font-extrabold bg-[#FED403] text-black px-2 py-0.5 rounded-full">
                {activeClient?.tipo === 'constructora' ? 'Constructora' : 'Contratista'}
              </span>
            )}
          </div>

          <select
            value={activeClient?.id || ''}
            onChange={(e) => {
              const selected = clients.find(c => c.id === e.target.value) || null;
              setActiveClient(selected);
              if (selected && (selected.tipo === 'contratista' || selected.tipo === 'constructora')) {
                cart.forEach(ci => updateCartItemPriceType(ci.producto.id, 'contratista'));
              } else {
                cart.forEach(ci => updateCartItemPriceType(ci.producto.id, 'publico'));
              }
            }}
            className="w-full px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#D60D1D]"
          >
            {clients.map(cli => (
              <option key={cli.id} value={cli.id}>
                {cli.nombre} {cli.tipo !== 'publico_general' ? `(${cli.tipo})` : ''}
              </option>
            ))}
          </select>

          {/* Credit balance badge if client has line */}
          {activeClient && activeClient.limiteCredito > 0 && (
            <div className="p-2 bg-white rounded-lg border border-slate-200 text-[11px] flex items-center justify-between">
              <div>
                <span className="text-slate-500">Línea de Crédito:</span>{' '}
                <span className="font-bold text-slate-800">${activeClient.limiteCredito.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-500">Disponible:</span>{' '}
                <span className="font-bold text-emerald-700">
                  ${(activeClient.limiteCredito - activeClient.saldoActual).toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Discount Warning alert */}
        {discountError && (
          <div className="m-2 p-2 bg-red-100 border border-red-300 rounded-lg text-xs font-semibold text-red-800 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#D60D1D] shrink-0" />
            <span>{discountError}</span>
          </div>
        )}

        {/* Cart Items List */}
        <div className="flex-1 p-3 overflow-y-auto space-y-2 min-h-[220px]">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <ShoppingCart className="w-10 h-10 stroke-1 mb-2 text-slate-300" />
              <p className="text-xs font-bold text-slate-600">Carrito de venta vacío</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Haz clic en "Agregar" en cualquier producto del catálogo para iniciar el ticket.
              </p>
            </div>
          ) : (
            cart.map(item => (
              <div
                key={item.producto.id}
                className="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col gap-1.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="font-heading font-bold text-xs text-slate-900 leading-snug">
                      {item.producto.nombre}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      ${item.precioUnitario.toFixed(2)} / {item.unidadSeleccionada}
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.producto.id)}
                    className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                    title="Eliminar artículo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
                  {/* Quantity input with stepper & fraction support */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateCartItemQuantity(item.producto.id, Math.max(0.1, Number((item.cantidad - (item.producto.permiteGranel ? 0.25 : 1)).toFixed(3))))}
                      className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    
                    <input
                      type="number"
                      step={item.producto.permiteGranel ? "0.05" : "1"}
                      value={item.cantidad}
                      onChange={e => updateCartItemQuantity(item.producto.id, parseFloat(e.target.value) || 0)}
                      className="w-16 px-1 py-0.5 text-xs text-center font-bold border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#D60D1D]"
                    />

                    <button
                      onClick={() => updateCartItemQuantity(item.producto.id, Number((item.cantidad + (item.producto.permiteGranel ? 0.25 : 1)).toFixed(3)))}
                      className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Discount percentage input */}
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-500 flex items-center">
                      <Percent className="w-2.5 h-2.5 mr-0.5" />
                    </span>
                    <input
                      type="number"
                      min="0"
                      max={activeRole === 'cajero' ? 5 : 50}
                      value={item.descuento || ''}
                      placeholder="0%"
                      onChange={e => handleDiscountChange(item.producto.id, Number(e.target.value) || 0)}
                      className="w-12 px-1 py-0.5 text-[11px] text-center border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#D60D1D]"
                      title={activeRole === 'cajero' ? 'Descuento máximo para cajero: 5%' : 'Descuento general'}
                    />
                  </div>

                  {/* Subtotal */}
                  <div className="text-right font-black text-xs text-slate-900">
                    ${item.subtotal.toFixed(2)}
                  </div>
                </div>

              </div>
            ))
          )}
        </div>

        {/* Cart Totals & Checkout Actions */}
        <div className="p-3.5 border-t border-slate-200 bg-slate-50 space-y-2.5">
          <div className="space-y-1 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-semibold">${cartSubtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>IVA (16%):</span>
              <span className="font-semibold">${cartIva.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm sm:text-base font-black text-slate-900 pt-1 border-t border-slate-200">
              <span>Total a Cobrar:</span>
              <span className="text-[#D60D1D]">${cartTotal.toFixed(2)} MXN</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => setShowLayawayModal(true)}
              disabled={cart.length === 0}
              className="py-2 px-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl transition flex items-center justify-center gap-1.5 disabled:opacity-40 cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-[#FED403]" />
              <span>Apartado</span>
            </button>

            <button
              onClick={() => {
                setEfectivoRecibido(cartTotal);
                setShowCheckoutModal(true);
              }}
              disabled={cart.length === 0}
              className="py-2.5 px-3 text-xs sm:text-sm font-black text-white bg-[#D60D1D] hover:bg-red-700 rounded-xl transition shadow-md flex items-center justify-center gap-1.5 disabled:opacity-40 cursor-pointer active:scale-95"
            >
              <Banknote className="w-4 h-4 text-[#FED403]" />
              <span>Cobrar</span>
            </button>
          </div>

          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="w-full text-center text-[11px] text-slate-400 hover:text-red-600 font-semibold cursor-pointer"
            >
              Cancelar y vaciar ticket
            </button>
          )}
        </div>

      </div>

      {/* CHECKOUT MODAL (Cobro, Facturación SAT CFDI, Despacho) */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
            
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-heading font-black text-base sm:text-lg">Procesar Venta y Cobro</h3>
                <p className="text-xs text-slate-300">Total a liquidar: ${cartTotal.toFixed(2)} MXN</p>
              </div>
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
              
              {/* Tipo de Comprobante Fiscal */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Tipo de Comprobante
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'ticket', label: 'Ticket de Caja' },
                    { id: 'factura', label: 'Factura CFDI 4.0' },
                    { id: 'nota_venta', label: 'Nota de Venta' }
                  ].map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTipoComprobante(t.id as TipoComprobante)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold border transition text-center cursor-pointer ${
                        tipoComprobante === t.id
                          ? 'bg-[#D60D1D] text-white border-[#D60D1D]'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Si es Factura: RFC y Uso de CFDI */}
              {tipoComprobante === 'factura' && (
                <div className="p-3 bg-red-50/50 rounded-xl border border-red-200 space-y-2.5">
                  <div className="font-bold text-xs text-red-950">Datos Fiscales para Facturación:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">RFC Receptor</label>
                      <input
                        type="text"
                        placeholder="CME120405H89"
                        value={clienteRfc || activeClient?.rfc || ''}
                        onChange={e => setClienteRfc(e.target.value.toUpperCase())}
                        className="w-full px-2.5 py-1.5 text-xs font-mono uppercase bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#D60D1D]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Uso de CFDI</label>
                      <select
                        value={usoCfdi}
                        onChange={e => setUsoCfdi(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#D60D1D]"
                      >
                        <option value="G01 - Adquisición de mercancías">G01 - Adquisición de mercancías</option>
                        <option value="G03 - Gastos en general">G03 - Gastos en general</option>
                        <option value="I01 - Construcciones">I01 - Construcciones</option>
                        <option value="S01 - Sin efectos fiscales">S01 - Sin efectos fiscales</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Método de Pago */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Método de Pago
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'efectivo', label: 'Efectivo', icon: <Banknote className="w-3.5 h-3.5" /> },
                    { id: 'tarjeta_debito', label: 'T. Débito', icon: <CreditCard className="w-3.5 h-3.5" /> },
                    { id: 'tarjeta_credito', label: 'T. Crédito', icon: <CreditCard className="w-3.5 h-3.5" /> },
                    { id: 'credito_ferretero', label: 'Crédito Ferretero', icon: <DollarSign className="w-3.5 h-3.5" /> },
                  ].map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMetodoPago(m.id as Sale['metodoPago'])}
                      className={`p-2 rounded-xl text-xs font-bold border transition flex flex-col items-center justify-center gap-1 cursor-pointer ${
                        metodoPago === m.id
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span className={metodoPago === m.id ? 'text-[#FED403]' : 'text-slate-500'}>
                        {m.icon}
                      </span>
                      <span>{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Efectivo Recibido y Cambio */}
              {metodoPago === 'efectivo' && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">Monto Recibido ($):</label>
                    <input
                      type="number"
                      step="10"
                      value={efectivoRecibido || ''}
                      onChange={e => setEfectivoRecibido(parseFloat(e.target.value) || 0)}
                      className="w-32 px-2.5 py-1 text-sm font-bold text-right border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#D60D1D]"
                    />
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold pt-1 border-t border-slate-200">
                    <span>Cambio a devolver:</span>
                    <span className="text-base text-emerald-700">
                      ${Math.max(0, (efectivoRecibido || 0) - cartTotal).toFixed(2)} MXN
                    </span>
                  </div>
                </div>
              )}

              {/* Despacho / Entrega a Domicilio Check */}
              <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={requiereEntrega}
                    onChange={e => setRequiereEntrega(e.target.checked)}
                    className="w-4 h-4 text-[#D60D1D] rounded border-slate-300 focus:ring-[#D60D1D]"
                  />
                  <span className="font-bold text-xs text-slate-800 flex items-center gap-1">
                    <Truck className="w-4 h-4 text-[#D60D1D]" />
                    ¿Requiere Despacho / Entrega en Vehículo de Carga?
                  </span>
                </label>
                {requiereEntrega && (
                  <input
                    type="text"
                    placeholder="Dirección o punto de entrega (ej. Obra Residencial Lote 4)..."
                    value={direccionEntrega}
                    onChange={e => setDireccionEntrega(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#D60D1D]"
                  />
                )}
              </div>

            </div>

            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl cursor-pointer"
              >
                Regresar
              </button>
              <button
                onClick={handleFinishCheckout}
                className="px-5 py-2.5 text-xs sm:text-sm font-black text-white bg-[#D60D1D] hover:bg-red-700 rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
              >
                <Receipt className="w-4 h-4 text-[#FED403]" />
                <span>Confirmar y Emitir Ticket</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* APARTADO / PREVENTA MODAL */}
      {showLayawayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-heading font-black text-base">Registrar Apartado / Preventa</h3>
                <p className="text-xs text-slate-300">Total del material: ${cartTotal.toFixed(2)} MXN</p>
              </div>
              <button onClick={() => setShowLayawayModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateLayawaySubmit} className="p-5 space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nombre del Cliente</label>
                <input
                  type="text"
                  required
                  placeholder="Juan López"
                  value={layawayClient}
                  onChange={e => setLayawayClient(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-1 focus:ring-[#D60D1D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Teléfono de Contacto</label>
                <input
                  type="tel"
                  required
                  placeholder="55 1234 5678"
                  value={layawayPhone}
                  onChange={e => setLayawayPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-1 focus:ring-[#D60D1D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Anticipo Recibido ($)</label>
                <input
                  type="number"
                  required
                  min="50"
                  max={cartTotal}
                  value={layawayAnticipo || ''}
                  onChange={e => setLayawayAnticipo(parseFloat(e.target.value) || 0)}
                  placeholder="Ej. $500.00"
                  className="w-full px-3 py-2 text-xs font-bold rounded-lg border border-slate-300 focus:ring-1 focus:ring-[#D60D1D]"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Saldo pendiente tras anticipo: ${(cartTotal - (layawayAnticipo || 0)).toFixed(2)} MXN
                </span>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl text-amber-900 text-xs">
                El material quedará reservado con vigencia de 30 días para liquidar en caja.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLayawayModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#D60D1D] hover:bg-red-700 rounded-lg transition"
                >
                  Crear Apartado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BRANCHES STOCK MODAL */}
      {selectedProductStock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-heading font-black text-base">Disponibilidad en Sucursales</h3>
                <p className="text-xs text-slate-300 truncate max-w-xs">{selectedProductStock.nombre}</p>
              </div>
              <button onClick={() => setSelectedProductStock(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="p-5 space-y-3">
              <div className="text-xs text-slate-500 font-mono">
                SKU: {selectedProductStock.sku} • Ubicación en Matriz: {selectedProductStock.ubicacion.codigoUbicacion}
              </div>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {selectedProductStock.sucursales.map(branch => (
                  <div key={branch.sucursalId} className="p-3 flex items-center justify-between text-xs bg-white">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span className="font-semibold text-slate-800">{branch.nombre}</span>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full font-bold ${
                      branch.stock > 10 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {branch.stock} {selectedProductStock.unidad}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedProductStock(null)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
