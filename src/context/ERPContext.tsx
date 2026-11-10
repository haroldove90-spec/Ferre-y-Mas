import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  UserRole, 
  Product, 
  CartItem, 
  Sale, 
  Supplier, 
  PurchaseOrder, 
  Client, 
  CashShift, 
  CashMovement, 
  Layaway, 
  Shrinkage, 
  CycleCount,
  TipoComprobante
} from '../types/erp';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_SUPPLIERS, 
  INITIAL_CLIENTS, 
  INITIAL_ORDERS, 
  INITIAL_CASH_SHIFT, 
  INITIAL_LAYAWAYS, 
  INITIAL_SHRINKAGES 
} from '../data/initialData';

interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConfigured: boolean;
}

interface ERPContextType {
  activeRole: UserRole | null;
  setActiveRole: (role: UserRole | null) => void;
  activeModule: string;
  setActiveModule: (mod: string) => void;
  
  // Data States
  products: Product[];
  suppliers: Supplier[];
  clients: Client[];
  sales: Sale[];
  purchaseOrders: PurchaseOrder[];
  cashShift: CashShift | null;
  layaways: Layaway[];
  shrinkages: Shrinkage[];
  cycleCounts: CycleCount[];
  
  // Demo Data State
  isDemoCleared: boolean;
  clearDemoData: () => void;
  restoreDemoData: () => void;
  
  // Supabase
  supabaseConfig: SupabaseConfig;
  updateSupabaseConfig: (config: { url: string; anonKey: string }) => void;
  clearSupabaseData: () => Promise<boolean>;

  // POS Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, customUnit?: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  updateCartItemPriceType: (productId: string, type: 'publico' | 'contratista') => void;
  updateCartItemDiscount: (productId: string, discount: number) => boolean;
  clearCart: () => void;
  activeClient: Client | null;
  setActiveClient: (client: Client | null) => void;
  completeSale: (saleData: {
    tipoComprobante: TipoComprobante;
    metodoPago: Sale['metodoPago'];
    clienteRfc?: string;
    usoCfdi?: string;
    efectivoRecibido?: number;
    requiereEntrega: boolean;
    direccionEntrega?: string;
    notas?: string;
  }) => Sale | null;

  // Cash Drawer (Caja)
  openCashDrawer: (fondoInicial: number) => void;
  addCashMovement: (tipo: 'entrada' | 'salida', monto: number, motivo: string) => void;
  closeCashShift: (montoRealEfectivo: number) => CashShift | null;

  // Layaways (Apartados)
  createLayaway: (clienteNombre: string, clienteTelefono: string, anticipo: number) => Layaway | null;
  settleLayaway: (layawayId: string) => void;

  // Warehouse (Almacén)
  receivePurchaseOrder: (orderId: string, receivedItems: { productoId: string; cantidad: number; lote?: string; caducidad?: string }[]) => void;
  addShrinkage: (data: Omit<Shrinkage, 'id' | 'folio' | 'fecha'>) => void;
  completeCycleCount: (pasillo: string, items: { productoId: string; conteoFisico: number }[]) => void;
  updateProductLocation: (productId: string, location: { pasillo: string; estante: string; charola: string }) => void;
  updateProductStock: (productId: string, newStock: number) => void;
  addNewProduct: (product: Omit<Product, 'id'>) => void;

  // Purchasing (Compras)
  createPurchaseOrder: (proveedorId: string, items: { productoId: string; cantidad: number }[], notas?: string) => PurchaseOrder;
  generateAutoReplenishmentOrders: () => PurchaseOrder[];
  updateOrderStatus: (orderId: string, status: PurchaseOrder['estado']) => void;

  // Dispatch / Logística
  updateDeliveryStatus: (saleId: string, status: Sale['estadoEntrega']) => void;

  // Client Credit CRM
  registerClientPayment: (clientId: string, monto: number) => void;

  // Modal helpers
  selectedTicketSale: Sale | null;
  setSelectedTicketSale: (sale: Sale | null) => void;
  showWorkflowModal: boolean;
  setShowWorkflowModal: (show: boolean) => void;
  showSupabaseModal: boolean;
  setShowSupabaseModal: (show: boolean) => void;
}

const ERPContext = createContext<ERPContextType | undefined>(undefined);

const LOCAL_STORAGE_PREFIX = 'ferreymas_';

export const ERPProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeRole, setActiveRoleState] = useState<UserRole | null>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}role`);
    return (saved as UserRole) || null;
  });

  const [activeModule, setActiveModule] = useState<string>('pos');
  const [isDemoCleared, setIsDemoCleared] = useState<boolean>(() => {
    return localStorage.getItem(`${LOCAL_STORAGE_PREFIX}demo_cleared`) === 'true';
  });

  // Supabase configuration
  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}supabase_config`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return { url: '', anonKey: '', isConfigured: false };
  });

  // Main Data States with localStorage persistence
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}products`);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    const demoCleared = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}demo_cleared`) === 'true';
    return demoCleared ? [] : INITIAL_PRODUCTS;
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}suppliers`);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    const demoCleared = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}demo_cleared`) === 'true';
    return demoCleared ? [] : INITIAL_SUPPLIERS;
  });

  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}clients`);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    const demoCleared = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}demo_cleared`) === 'true';
    return demoCleared ? [] : INITIAL_CLIENTS;
  });

  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}sales`);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [];
  });

  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}orders`);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    const demoCleared = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}demo_cleared`) === 'true';
    return demoCleared ? [] : INITIAL_ORDERS;
  });

  const [cashShift, setCashShift] = useState<CashShift | null>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}cash_shift`);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    const demoCleared = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}demo_cleared`) === 'true';
    return demoCleared ? null : INITIAL_CASH_SHIFT;
  });

  const [layaways, setLayaways] = useState<Layaway[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}layaways`);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    const demoCleared = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}demo_cleared`) === 'true';
    return demoCleared ? [] : INITIAL_LAYAWAYS;
  });

  const [shrinkages, setShrinkages] = useState<Shrinkage[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}shrinkages`);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    const demoCleared = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}demo_cleared`) === 'true';
    return demoCleared ? [] : INITIAL_SHRINKAGES;
  });

  const [cycleCounts, setCycleCounts] = useState<CycleCount[]>([]);

  // POS State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeClient, setActiveClient] = useState<Client | null>(() => clients[0] || null);

  // Modals
  const [selectedTicketSale, setSelectedTicketSale] = useState<Sale | null>(null);
  const [showWorkflowModal, setShowWorkflowModal] = useState<boolean>(false);
  const [showSupabaseModal, setShowSupabaseModal] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}products`, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}suppliers`, JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}clients`, JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}sales`, JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}orders`, JSON.stringify(purchaseOrders));
  }, [purchaseOrders]);

  useEffect(() => {
    if (cashShift) {
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}cash_shift`, JSON.stringify(cashShift));
    } else {
      localStorage.removeItem(`${LOCAL_STORAGE_PREFIX}cash_shift`);
    }
  }, [cashShift]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}layaways`, JSON.stringify(layaways));
  }, [layaways]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}shrinkages`, JSON.stringify(shrinkages));
  }, [shrinkages]);

  const setActiveRole = (role: UserRole | null) => {
    setActiveRoleState(role);
    if (role) {
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}role`, role);
      // set sensible default module
      if (role === 'cajero') setActiveModule('pos');
      else if (role === 'almacen') setActiveModule('stock');
      else if (role === 'compras') setActiveModule('ordenes');
      else if (role === 'administrador') setActiveModule('dashboard');
    } else {
      localStorage.removeItem(`${LOCAL_STORAGE_PREFIX}role`);
    }
  };

  // Clear demo data persistently
  const clearDemoData = () => {
    setIsDemoCleared(true);
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}demo_cleared`, 'true');
    setProducts([]);
    setSuppliers([]);
    setClients([]);
    setSales([]);
    setPurchaseOrders([]);
    setCashShift(null);
    setLayaways([]);
    setShrinkages([]);
    setCycleCounts([]);
    setCart([]);
    setActiveClient(null);
  };

  // Restore demo data
  const restoreDemoData = () => {
    setIsDemoCleared(false);
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}demo_cleared`, 'false');
    setProducts(INITIAL_PRODUCTS);
    setSuppliers(INITIAL_SUPPLIERS);
    setClients(INITIAL_CLIENTS);
    setSales([]);
    setPurchaseOrders(INITIAL_ORDERS);
    setCashShift(INITIAL_CASH_SHIFT);
    setLayaways(INITIAL_LAYAWAYS);
    setShrinkages(INITIAL_SHRINKAGES);
    setActiveClient(INITIAL_CLIENTS[0]);
  };

  // Supabase credentials updater
  const updateSupabaseConfig = (config: { url: string; anonKey: string }) => {
    const updated = {
      url: config.url.trim(),
      anonKey: config.anonKey.trim(),
      isConfigured: Boolean(config.url.trim() && config.anonKey.trim())
    };
    setSupabaseConfig(updated);
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}supabase_config`, JSON.stringify(updated));
  };

  const clearSupabaseData = async (): Promise<boolean> => {
    // If supabase credentials configured, execute cleanup or trigger local cleanup
    clearDemoData();
    return true;
  };

  // POS Cart logic
  const addToCart = (product: Product, quantity = 1, customUnit?: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.producto.id === product.id);
      const isContratista = activeClient?.tipo === 'contratista' || activeClient?.tipo === 'constructora';
      const unitPrice = isContratista ? product.precioContratista : product.precioPublico;
      const unit = customUnit || product.unidad;

      if (existing) {
        const newQty = Number((existing.cantidad + quantity).toFixed(3));
        const subtotal = Number((newQty * existing.precioUnitario * (1 - existing.descuento / 100)).toFixed(2));
        return prev.map(item => item.producto.id === product.id ? { ...item, cantidad: newQty, subtotal } : item);
      } else {
        const subtotal = Number((quantity * unitPrice).toFixed(2));
        return [...prev, {
          producto: product,
          cantidad: quantity,
          unidadSeleccionada: unit,
          precioUnitario: unitPrice,
          tipoPrecio: isContratista ? 'contratista' : 'publico',
          descuento: 0,
          subtotal
        }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.producto.id !== productId));
  };

  const updateCartItemQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => {
      if (item.producto.id === productId) {
        const subtotal = Number((quantity * item.precioUnitario * (1 - item.descuento / 100)).toFixed(2));
        return { ...item, cantidad: quantity, subtotal };
      }
      return item;
    }));
  };

  const updateCartItemPriceType = (productId: string, type: 'publico' | 'contratista') => {
    setCart(prev => prev.map(item => {
      if (item.producto.id === productId) {
        const unitPrice = type === 'contratista' ? item.producto.precioContratista : item.producto.precioPublico;
        const subtotal = Number((item.cantidad * unitPrice * (1 - item.descuento / 100)).toFixed(2));
        return { ...item, tipoPrecio: type, precioUnitario: unitPrice, subtotal };
      }
      return item;
    }));
  };

  const updateCartItemDiscount = (productId: string, discount: number): boolean => {
    // Check role restrictions: cashier can only discount up to 5%
    if (activeRole === 'cajero' && discount > 5) {
      return false;
    }
    setCart(prev => prev.map(item => {
      if (item.producto.id === productId) {
        const validDiscount = Math.min(100, Math.max(0, discount));
        const subtotal = Number((item.cantidad * item.precioUnitario * (1 - validDiscount / 100)).toFixed(2));
        return { ...item, descuento: validDiscount, subtotal };
      }
      return item;
    }));
    return true;
  };

  const clearCart = () => setCart([]);

  const completeSale = (saleData: {
    tipoComprobante: TipoComprobante;
    metodoPago: Sale['metodoPago'];
    clienteRfc?: string;
    usoCfdi?: string;
    efectivoRecibido?: number;
    requiereEntrega: boolean;
    direccionEntrega?: string;
    notas?: string;
  }): Sale | null => {
    if (cart.length === 0) return null;

    const subtotal = cart.reduce((acc, it) => acc + it.subtotal, 0);
    const iva = Number((subtotal * 0.16).toFixed(2));
    const total = Number((subtotal + iva).toFixed(2));
    const folioNum = sales.length + 1001;
    const prefix = saleData.tipoComprobante === 'factura' ? 'FAC' : saleData.tipoComprobante === 'nota_venta' ? 'NV' : 'TCK';
    const folio = `${prefix}-2026-${String(folioNum).padStart(4, '0')}`;

    const newSale: Sale = {
      id: `sale-${Date.now()}`,
      folio,
      fecha: new Date().toISOString(),
      cajeroNombre: cashShift?.cajeroNombre || 'Cajero de Turno',
      cajeroId: cashShift?.cajeroId || 'usr-cajero-01',
      tipoComprobante: saleData.tipoComprobante,
      clienteId: activeClient?.id,
      clienteNombre: activeClient?.nombre || 'Público General',
      clienteRfc: saleData.clienteRfc || activeClient?.rfc || 'XAXX010101000',
      usoCfdi: saleData.usoCfdi || 'G03 - Gastos en general',
      metodoPago: saleData.metodoPago,
      items: [...cart],
      subtotal,
      iva,
      total,
      efectivoRecibido: saleData.efectivoRecibido,
      cambio: saleData.efectivoRecibido ? Number((saleData.efectivoRecibido - total).toFixed(2)) : 0,
      requiereEntrega: saleData.requiereEntrega,
      estadoEntrega: saleData.requiereEntrega ? 'pendiente_carga' : 'no_aplica',
      direccionEntrega: saleData.direccionEntrega,
      notas: saleData.notas
    };

    // 1. Descontar inventario en tiempo real
    setProducts(prevProducts => {
      return prevProducts.map(p => {
        const cartItem = cart.find(ci => ci.producto.id === p.id);
        if (cartItem) {
          const newStock = Math.max(0, Number((p.stockActual - cartItem.cantidad).toFixed(3)));
          // also update branch stock for Matriz
          const updatedBranches = p.sucursales.map(b => 
            b.sucursalId === 'matriz' ? { ...b, stock: newStock } : b
          );
          return {
            ...p,
            stockActual: newStock,
            sucursales: updatedBranches
          };
        }
        return p;
      });
    });

    // 2. Si es crédito ferretero, actualizar saldo del cliente
    if (saleData.metodoPago === 'credito_ferretero' && activeClient) {
      setClients(prev => prev.map(c => {
        if (c.id === activeClient.id) {
          return {
            ...c,
            saldoActual: Number((c.saldoActual + total).toFixed(2)),
            historialComprasCount: c.historialComprasCount + 1
          };
        }
        return c;
      }));
    }

    // 3. Actualizar corte de caja si hay shift abierto
    if (cashShift && cashShift.estado === 'abierta') {
      setCashShift(prev => {
        if (!prev) return null;
        let vEfectivo = prev.totalVentasEfectivo;
        let vTarjeta = prev.totalVentasTarjeta;
        let vTransf = prev.totalVentasTransferencia;
        let vCredito = prev.totalVentasCredito;

        if (saleData.metodoPago === 'efectivo') vEfectivo += total;
        else if (saleData.metodoPago.startsWith('tarjeta')) vTarjeta += total;
        else if (saleData.metodoPago === 'transferencia') vTransf += total;
        else if (saleData.metodoPago === 'credito_ferretero') vCredito += total;

        const mEsperado = prev.fondoInicial + vEfectivo + prev.totalEntradas - prev.totalSalidas;

        return {
          ...prev,
          totalVentasEfectivo: Number(vEfectivo.toFixed(2)),
          totalVentasTarjeta: Number(vTarjeta.toFixed(2)),
          totalVentasTransferencia: Number(vTransf.toFixed(2)),
          totalVentasCredito: Number(vCredito.toFixed(2)),
          montoEsperadoEfectivo: Number(mEsperado.toFixed(2))
        };
      });
    }

    setSales(prev => [newSale, ...prev]);
    clearCart();
    setSelectedTicketSale(newSale);
    return newSale;
  };

  // Cash Shift actions
  const openCashDrawer = (fondoInicial: number) => {
    const newShift: CashShift = {
      id: `corte-${Date.now()}`,
      cajeroId: 'usr-cajero-01',
      cajeroNombre: 'Daniel Morales',
      fechaApertura: new Date().toISOString(),
      fondoInicial,
      movimientos: [],
      totalVentasEfectivo: 0,
      totalVentasTarjeta: 0,
      totalVentasTransferencia: 0,
      totalVentasCredito: 0,
      totalEntradas: 0,
      totalSalidas: 0,
      montoEsperadoEfectivo: fondoInicial,
      estado: 'abierta'
    };
    setCashShift(newShift);
  };

  const addCashMovement = (tipo: 'entrada' | 'salida', monto: number, motivo: string) => {
    if (!cashShift) return;
    const mov: CashMovement = {
      id: `mov-${Date.now()}`,
      tipo,
      monto,
      motivo,
      hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      usuario: cashShift.cajeroNombre
    };
    setCashShift(prev => {
      if (!prev) return null;
      const movs = [...prev.movimientos, mov];
      const totalEntradas = tipo === 'entrada' ? prev.totalEntradas + monto : prev.totalEntradas;
      const totalSalidas = tipo === 'salida' ? prev.totalSalidas + monto : prev.totalSalidas;
      const mEsperado = prev.fondoInicial + prev.totalVentasEfectivo + totalEntradas - totalSalidas;
      return {
        ...prev,
        movimientos: movs,
        totalEntradas,
        totalSalidas,
        montoEsperadoEfectivo: Number(mEsperado.toFixed(2))
      };
    });
  };

  const closeCashShift = (montoRealEfectivo: number): CashShift | null => {
    if (!cashShift) return null;
    const diferencia = Number((montoRealEfectivo - cashShift.montoEsperadoEfectivo).toFixed(2));
    const closed: CashShift = {
      ...cashShift,
      fechaCierre: new Date().toISOString(),
      montoRealEfectivo,
      diferencia,
      estado: 'cerrada'
    };
    setCashShift(closed);
    return closed;
  };

  // Layaways
  const createLayaway = (clienteNombre: string, clienteTelefono: string, anticipo: number): Layaway | null => {
    if (cart.length === 0) return null;
    const total = cart.reduce((acc, it) => acc + it.subtotal, 0) * 1.16;
    const saldoRestante = Math.max(0, total - anticipo);
    const folio = `AP-2026-${String(layaways.length + 1).padStart(4, '0')}`;
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 30);

    const newLayaway: Layaway = {
      id: `apa-${Date.now()}`,
      folio,
      clienteNombre,
      clienteTelefono,
      fechaCreacion: new Date().toISOString().split('T')[0],
      fechaVencimiento: expiry.toISOString().split('T')[0],
      items: [...cart],
      total: Number(total.toFixed(2)),
      anticipo,
      saldoRestante: Number(saldoRestante.toFixed(2)),
      estado: 'vigente'
    };

    setLayaways(prev => [newLayaway, ...prev]);
    clearCart();
    return newLayaway;
  };

  const settleLayaway = (layawayId: string) => {
    setLayaways(prev => prev.map(l => {
      if (l.id === layawayId) {
        return { ...l, estado: 'liquidado', saldoRestante: 0 };
      }
      return l;
    }));
  };

  // Warehouse actions
  const receivePurchaseOrder = (
    orderId: string, 
    receivedItems: { productoId: string; cantidad: number; lote?: string; caducidad?: string }[]
  ) => {
    // Update order status
    setPurchaseOrders(prevOrders => prevOrders.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          estado: 'recibida_completa',
          fechaRecepcion: new Date().toISOString().split('T')[0]
        };
      }
      return order;
    }));

    // Update product stock and optionally lot/expiry
    setProducts(prevProducts => prevProducts.map(prod => {
      const match = receivedItems.find(it => it.productoId === prod.id);
      if (match) {
        const newStock = Number((prod.stockActual + match.cantidad).toFixed(3));
        const updatedBranches = prod.sucursales.map(b => 
          b.sucursalId === 'matriz' ? { ...b, stock: newStock } : b
        );
        return {
          ...prod,
          stockActual: newStock,
          sucursales: updatedBranches,
          lote: match.lote || prod.lote,
          caducidad: match.caducidad || prod.caducidad
        };
      }
      return prod;
    }));
  };

  const addShrinkage = (data: Omit<Shrinkage, 'id' | 'folio' | 'fecha'>) => {
    const folio = `MER-2026-${String(shrinkages.length + 1).padStart(3, '0')}`;
    const newMerma: Shrinkage = {
      ...data,
      id: `mer-${Date.now()}`,
      folio,
      fecha: new Date().toISOString().split('T')[0]
    };
    setShrinkages(prev => [newMerma, ...prev]);

    // Deduct stock if marked as applied
    if (data.estado === 'aplicado_inventario') {
      setProducts(prev => prev.map(p => {
        if (p.id === data.productoId) {
          const newStock = Math.max(0, p.stockActual - data.cantidad);
          return { ...p, stockActual: newStock };
        }
        return p;
      }));
    }
  };

  const completeCycleCount = (pasillo: string, items: { productoId: string; conteoFisico: number }[]) => {
    const folio = `CC-2026-${String(cycleCounts.length + 1).padStart(3, '0')}`;
    const countItems = items.map(it => {
      const p = products.find(prod => prod.id === it.productoId);
      const stockSistema = p?.stockActual || 0;
      const diferencia = Number((it.conteoFisico - stockSistema).toFixed(2));
      return {
        productoId: it.productoId,
        nombre: p?.nombre || 'Producto',
        sku: p?.sku || '',
        ubicacion: p?.ubicacion.codigoUbicacion || '',
        stockSistema,
        conteoFisico: it.conteoFisico,
        diferencia,
        ajustado: true
      };
    });

    const newCycleCount: CycleCount = {
      id: `cc-${Date.now()}`,
      folio,
      fecha: new Date().toISOString().split('T')[0],
      pasilloOSeccion: pasillo,
      responsable: 'Almacenista en Turno',
      items: countItems,
      estado: 'completado'
    };

    setCycleCounts(prev => [newCycleCount, ...prev]);

    // Apply adjustments to products
    setProducts(prev => prev.map(prod => {
      const match = items.find(it => it.productoId === prod.id);
      if (match) {
        return { ...prod, stockActual: match.conteoFisico };
      }
      return prod;
    }));
  };

  const updateProductLocation = (productId: string, location: { pasillo: string; estante: string; charola: string }) => {
    setProducts(prev => prev.map(prod => {
      if (prod.id === productId) {
        const codigo = `${location.pasillo}-${location.estante.slice(0, 2).toUpperCase()}-${location.charola.slice(0, 4).toUpperCase()}`;
        return {
          ...prod,
          ubicacion: {
            ...location,
            codigoUbicacion: codigo
          }
        };
      }
      return prod;
    }));
  };

  const updateProductStock = (productId: string, newStock: number) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, stockActual: Math.max(0, newStock) } : p));
  };

  const addNewProduct = (product: Omit<Product, 'id'>) => {
    const id = `prod-${Date.now()}`;
    const newP: Product = { ...product, id };
    setProducts(prev => [newP, ...prev]);
  };

  // Purchasing actions
  const createPurchaseOrder = (
    proveedorId: string, 
    items: { productoId: string; cantidad: number }[], 
    notas?: string
  ): PurchaseOrder => {
    const prov = suppliers.find(s => s.id === proveedorId);
    const folio = `OC-2026-${String(purchaseOrders.length + 91).padStart(3, '0')}`;
    const expected = new Date();
    expected.setDate(expected.getDate() + (prov?.tiempoEntregaDias || 3));

    const poItems = items.map(it => {
      const p = products.find(prod => prod.id === it.productoId);
      const costo = p?.costo || 50;
      return {
        productoId: it.productoId,
        nombre: p?.nombre || 'Artículo',
        sku: p?.sku || 'SKU',
        cantidadSugerida: it.cantidad,
        cantidadPedida: it.cantidad,
        costoUnitario: costo,
        subtotal: Number((costo * it.cantidad).toFixed(2))
      };
    });

    const subtotal = poItems.reduce((acc, i) => acc + i.subtotal, 0);
    const iva = Number((subtotal * 0.16).toFixed(2));
    const total = Number((subtotal + iva).toFixed(2));

    const newPO: PurchaseOrder = {
      id: `oc-${Date.now()}`,
      folio,
      proveedorId,
      proveedorNombre: prov?.nombreComercial || 'Proveedor Ferretero',
      fechaCreacion: new Date().toISOString().split('T')[0],
      fechaEsperada: expected.toISOString().split('T')[0],
      estado: 'enviada',
      items: poItems,
      subtotal,
      iva,
      total,
      notas
    };

    setPurchaseOrders(prev => [newPO, ...prev]);
    return newPO;
  };

  const generateAutoReplenishmentOrders = (): PurchaseOrder[] => {
    // Find products where stockActual <= stockMinimo
    const lowStockProducts = products.filter(p => p.stockActual <= p.stockMinimo);
    if (lowStockProducts.length === 0) return [];

    // Group by supplier
    const grouped: { [key: string]: Product[] } = {};
    lowStockProducts.forEach(p => {
      const provId = p.proveedorId || 'prov-001';
      if (!grouped[provId]) grouped[provId] = [];
      grouped[provId].push(p);
    });

    const newOrders: PurchaseOrder[] = [];

    Object.entries(grouped).forEach(([provId, prods]) => {
      const prov = suppliers.find(s => s.id === provId);
      const folio = `OC-AUTO-${Date.now().toString().slice(-4)}`;
      const expected = new Date();
      expected.setDate(expected.getDate() + (prov?.tiempoEntregaDias || 3));

      const items = prods.map(p => {
        const reordenNeeded = Math.max(10, p.stockMaximo - p.stockActual);
        return {
          productoId: p.id,
          nombre: p.nombre,
          sku: p.sku,
          cantidadSugerida: reordenNeeded,
          cantidadPedida: reordenNeeded,
          costoUnitario: p.costo,
          subtotal: Number((reordenNeeded * p.costo).toFixed(2))
        };
      });

      const subtotal = items.reduce((acc, i) => acc + i.subtotal, 0);
      const iva = Number((subtotal * 0.16).toFixed(2));
      const total = Number((subtotal + iva).toFixed(2));

      const po: PurchaseOrder = {
        id: `oc-${Date.now()}-${provId}`,
        folio,
        proveedorId: provId,
        proveedorNombre: prov?.nombreComercial || 'Proveedor Ferretero',
        fechaCreacion: new Date().toISOString().split('T')[0],
        fechaEsperada: expected.toISOString().split('T')[0],
        estado: 'sugerida',
        items,
        subtotal,
        iva,
        total,
        notas: 'Generada automáticamente por alerta de stock mínimo en ERP.'
      };
      newOrders.push(po);
    });

    setPurchaseOrders(prev => [...newOrders, ...prev]);
    return newOrders;
  };

  const updateOrderStatus = (orderId: string, status: PurchaseOrder['estado']) => {
    setPurchaseOrders(prev => prev.map(o => o.id === orderId ? { ...o, estado: status } : o));
  };

  const updateDeliveryStatus = (saleId: string, status: Sale['estadoEntrega']) => {
    setSales(prev => prev.map(s => s.id === saleId ? { ...s, estadoEntrega: status } : s));
  };

  const registerClientPayment = (clientId: string, monto: number) => {
    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        const newSaldo = Math.max(0, c.saldoActual - monto);
        const newVencido = Math.max(0, c.saldoVencido - monto);
        return { ...c, saldoActual: Number(newSaldo.toFixed(2)), saldoVencido: Number(newVencido.toFixed(2)) };
      }
      return c;
    }));
  };

  return (
    <ERPContext.Provider
      value={{
        activeRole,
        setActiveRole,
        activeModule,
        setActiveModule,
        products,
        suppliers,
        clients,
        sales,
        purchaseOrders,
        cashShift,
        layaways,
        shrinkages,
        cycleCounts,
        isDemoCleared,
        clearDemoData,
        restoreDemoData,
        supabaseConfig,
        updateSupabaseConfig,
        clearSupabaseData,
        cart,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        updateCartItemPriceType,
        updateCartItemDiscount,
        clearCart,
        activeClient,
        setActiveClient,
        completeSale,
        openCashDrawer,
        addCashMovement,
        closeCashShift,
        createLayaway,
        settleLayaway,
        receivePurchaseOrder,
        addShrinkage,
        completeCycleCount,
        updateProductLocation,
        updateProductStock,
        addNewProduct,
        createPurchaseOrder,
        generateAutoReplenishmentOrders,
        updateOrderStatus,
        updateDeliveryStatus,
        registerClientPayment,
        selectedTicketSale,
        setSelectedTicketSale,
        showWorkflowModal,
        setShowWorkflowModal,
        showSupabaseModal,
        setShowSupabaseModal,
      }}
    >
      {children}
    </ERPContext.Provider>
  );
};

export const useERP = () => {
  const context = useContext(ERPContext);
  if (!context) {
    throw new Error('useERP must be used within an ERPProvider');
  }
  return context;
};
