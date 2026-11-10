export type UserRole = 
  | 'cajero' 
  | 'almacen' 
  | 'compras' 
  | 'administrador';

export type MeasurementUnit = 
  | 'pieza'      // PZA
  | 'caja'       // CJA
  | 'metro'      // M (lineal)
  | 'kilo'       // KG
  | 'litro'      // L
  | 'rollo'      // RLL
  | 'tonelada';  // TON

export type UnitType = 'standard' | 'fractional'; // fractional allows grams, ml, cm

export interface StockLocation {
  pasillo: string;   // ej: "P-03"
  estante: string;   // ej: "Estante B"
  charola: string;   // ej: "Charola 14"
  codigoUbicacion: string; // ej: "P03-EB-CH14"
}

export interface BranchStock {
  sucursalId: string;
  nombre: string;
  stock: number;
}

export interface Product {
  id: string;
  codigoBarras: string;
  sku: string;
  nombre: string;
  categoria: 'Tornillería' | 'Plomería' | 'Eléctrico' | 'Pinturas y Adhesivos' | 'Herramientas' | 'Construcción' | 'Cerrajería';
  unidad: MeasurementUnit;
  permiteGranel: boolean; // permite vender por gramos, cm, ml
  precioPublico: number;
  precioContratista: number; // Precio especial mayoreo / contratista
  costo: number;
  stockActual: number;
  stockMinimo: number;
  stockMaximo: number;
  puntoReorden: number;
  ubicacion: StockLocation;
  sucursales: BranchStock[];
  proveedorId?: string;
  requiereLoteCaducidad?: boolean; // ej: selladores, pegamentos, cementos
  lote?: string;
  caducidad?: string;
  historialCostos?: { fecha: string; costo: number; proveedor: string }[];
}

export interface CartItem {
  producto: Product;
  cantidad: number; // can be fractional (e.g. 0.350 kg, 2.5 m)
  unidadSeleccionada: string;
  precioUnitario: number;
  tipoPrecio: 'publico' | 'contratista';
  descuento: number; // porcentaje
  subtotal: number;
}

export type TipoComprobante = 'ticket' | 'factura' | 'nota_venta' | 'devolucion';

export interface Sale {
  id: string;
  folio: string;
  fecha: string;
  cajeroNombre: string;
  cajeroId: string;
  tipoComprobante: TipoComprobante;
  clienteId?: string;
  clienteNombre: string;
  clienteRfc?: string;
  usoCfdi?: string;
  metodoPago: 'efectivo' | 'tarjeta_debito' | 'tarjeta_credito' | 'transferencia' | 'credito_ferretero';
  items: CartItem[];
  subtotal: number;
  iva: number;
  total: number;
  efectivoRecibido?: number;
  cambio?: number;
  requiereEntrega: boolean;
  estadoEntrega?: 'no_aplica' | 'pendiente_carga' | 'en_ruta' | 'entregado';
  direccionEntrega?: string;
  notas?: string;
}

export interface Layaway {
  id: string;
  folio: string;
  clienteNombre: string;
  clienteTelefono: string;
  fechaCreacion: string;
  fechaVencimiento: string;
  items: CartItem[];
  total: number;
  anticipo: number;
  saldoRestante: number;
  estado: 'vigente' | 'liquidado' | 'cancelado';
}

export interface CashMovement {
  id: string;
  tipo: 'entrada' | 'salida';
  monto: number;
  motivo: string;
  hora: string;
  usuario: string;
}

export interface CashShift {
  id: string;
  cajeroId: string;
  cajeroNombre: string;
  fechaApertura: string;
  fondoInicial: number;
  movimientos: CashMovement[];
  fechaCierre?: string;
  totalVentasEfectivo: number;
  totalVentasTarjeta: number;
  totalVentasTransferencia: number;
  totalVentasCredito: number;
  totalEntradas: number;
  totalSalidas: number;
  montoEsperadoEfectivo: number;
  montoRealEfectivo?: number;
  diferencia?: number;
  estado: 'abierta' | 'cerrada';
}

export interface Supplier {
  id: string;
  nombreComercial: string;
  rfc: string;
  contacto: string;
  telefono: string;
  email: string;
  diasCredito: number;
  tiempoEntregaDias: number;
  descuentoComercial: number; // %
  categorias: string[];
}

export interface PurchaseOrderItem {
  productoId: string;
  nombre: string;
  sku: string;
  cantidadSugerida: number;
  cantidadPedida: number;
  costoUnitario: number;
  subtotal: number;
  lote?: string;
  caducidad?: string;
  recibido?: number;
}

export interface PurchaseOrder {
  id: string;
  folio: string;
  proveedorId: string;
  proveedorNombre: string;
  fechaCreacion: string;
  fechaEsperada: string;
  estado: 'borrador' | 'sugerida' | 'enviada' | 'recibida_parcial' | 'recibida_completa' | 'cancelada';
  items: PurchaseOrderItem[];
  subtotal: number;
  iva: number;
  total: number;
  notas?: string;
  fechaRecepcion?: string;
}

export interface Client {
  id: string;
  nombre: string;
  rfc: string;
  telefono: string;
  email: string;
  direccion: string;
  tipo: 'publico_general' | 'contratista' | 'constructora';
  limiteCredito: number;
  saldoActual: number;
  saldoVencido: number;
  diasCredito: number;
  historialComprasCount: number;
}

export interface Shrinkage {
  id: string;
  folio: string;
  fecha: string;
  productoId: string;
  productoNombre: string;
  cantidad: number;
  unidad: string;
  motivo: 'daño_transporte' | 'rotura_en_tienda' | 'caducidad_vencida' | 'defecto_fabrica' | 'merma_corte';
  costoEstimado: number;
  reportadoPor: string;
  estado: 'registrado' | 'aplicado_inventario' | 'devolucion_proveedor';
}

export interface CycleCountItem {
  productoId: string;
  nombre: string;
  sku: string;
  ubicacion: string;
  stockSistema: number;
  conteoFisico: number;
  diferencia: number;
  ajustado: boolean;
}

export interface CycleCount {
  id: string;
  folio: string;
  fecha: string;
  pasilloOSeccion: string;
  responsable: string;
  items: CycleCountItem[];
  estado: 'en_proceso' | 'completado';
}
