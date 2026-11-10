import { Product, Supplier, Client, PurchaseOrder, CashShift, Layaway, Shrinkage } from '../types/erp';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    codigoBarras: '750100234501',
    sku: 'TOR-CLA-002',
    nombre: 'Clavo Estándar con Cabeza 2" (50mm)',
    categoria: 'Tornillería',
    unidad: 'kilo',
    permiteGranel: true,
    precioPublico: 52.00,
    precioContratista: 44.50,
    costo: 32.00,
    stockActual: 18.5, // 18.5 kg (below minimum: trigger alert!)
    stockMinimo: 35.0,
    stockMaximo: 150.0,
    puntoReorden: 40.0,
    ubicacion: {
      pasillo: 'P-01',
      estante: 'Estante A',
      charola: 'Gaveta 04',
      codigoUbicacion: 'P01-EA-G04'
    },
    sucursales: [
      { sucursalId: 'matriz', nombre: 'Matriz Centro (Actual)', stock: 18.5 },
      { sucursalId: 'norte', nombre: 'Bodega Norte Industrial', stock: 65.0 },
      { sucursalId: 'sur', nombre: 'Sucursal Periférico Sur', stock: 24.0 }
    ],
    proveedorId: 'prov-001',
    requiereLoteCaducidad: false,
    historialCostos: [
      { fecha: '2026-08-15', costo: 29.50, proveedor: 'Deacero México' },
      { fecha: '2026-10-02', costo: 32.00, proveedor: 'Deacero México' }
    ]
  },
  {
    id: 'prod-002',
    codigoBarras: '750100234502',
    sku: 'TOR-CHI-006',
    nombre: 'Pija Negra Punta de Broca #6 x 1" para Tablaroca',
    categoria: 'Tornillería',
    unidad: 'pieza',
    permiteGranel: true,
    precioPublico: 0.65,
    precioContratista: 0.48,
    costo: 0.28,
    stockActual: 1840,
    stockMinimo: 800,
    stockMaximo: 5000,
    puntoReorden: 1000,
    ubicacion: {
      pasillo: 'P-01',
      estante: 'Estante B',
      charola: 'Charola 12',
      codigoUbicacion: 'P01-EB-CH12'
    },
    sucursales: [
      { sucursalId: 'matriz', nombre: 'Matriz Centro (Actual)', stock: 1840 },
      { sucursalId: 'norte', nombre: 'Bodega Norte Industrial', stock: 4500 },
      { sucursalId: 'sur', nombre: 'Sucursal Periférico Sur', stock: 920 }
    ],
    proveedorId: 'prov-001',
    requiereLoteCaducidad: false
  },
  {
    id: 'prod-003',
    codigoBarras: '750100234503',
    sku: 'ELE-CAB-012',
    nombre: 'Cable Eléctrico THW-LS Calibre 12 AWG IUSA (Negro)',
    categoria: 'Eléctrico',
    unidad: 'metro',
    permiteGranel: true,
    precioPublico: 18.50,
    precioContratista: 15.20,
    costo: 10.90,
    stockActual: 14.0, // critically low
    stockMinimo: 80.0,
    stockMaximo: 500.0,
    puntoReorden: 100.0,
    ubicacion: {
      pasillo: 'P-02',
      estante: 'Racks Carretes',
      charola: 'Nivel 01',
      codigoUbicacion: 'P02-RC-N01'
    },
    sucursales: [
      { sucursalId: 'matriz', nombre: 'Matriz Centro (Actual)', stock: 14.0 },
      { sucursalId: 'norte', nombre: 'Bodega Norte Industrial', stock: 320.0 },
      { sucursalId: 'sur', nombre: 'Sucursal Periférico Sur', stock: 45.0 }
    ],
    proveedorId: 'prov-002',
    requiereLoteCaducidad: false,
    historialCostos: [
      { fecha: '2026-07-10', costo: 9.80, proveedor: 'IUSA Eléctrica' },
      { fecha: '2026-10-14', costo: 10.90, proveedor: 'IUSA Eléctrica' }
    ]
  },
  {
    id: 'prod-004',
    codigoBarras: '750100234504',
    sku: 'PLO-TUB-012',
    nombre: 'Tubo PVC Hidráulico Cédula 40 1/2" Tramo 6m Amanco',
    categoria: 'Plomería',
    unidad: 'pieza',
    permiteGranel: false,
    precioPublico: 145.00,
    precioContratista: 122.00,
    costo: 88.00,
    stockActual: 28,
    stockMinimo: 15,
    stockMaximo: 120,
    puntoReorden: 25,
    ubicacion: {
      pasillo: 'P-03',
      estante: 'Caballete Tubos',
      charola: 'Sección A',
      codigoUbicacion: 'P03-CT-SA'
    },
    sucursales: [
      { sucursalId: 'matriz', nombre: 'Matriz Centro (Actual)', stock: 28 },
      { sucursalId: 'norte', nombre: 'Bodega Norte Industrial', stock: 180 },
      { sucursalId: 'sur', nombre: 'Sucursal Periférico Sur', stock: 35 }
    ],
    proveedorId: 'prov-003',
    requiereLoteCaducidad: false
  },
  {
    id: 'prod-005',
    codigoBarras: '750100234505',
    sku: 'ADH-SIK-11FC',
    nombre: 'Sellador Adhesivo Poliuretano Sikaflex 11FC Blanco 300ml',
    categoria: 'Pinturas y Adhesivos',
    unidad: 'pieza',
    permiteGranel: false,
    precioPublico: 185.00,
    precioContratista: 158.00,
    costo: 115.00,
    stockActual: 8, // below minimum
    stockMinimo: 12,
    stockMaximo: 60,
    puntoReorden: 15,
    ubicacion: {
      pasillo: 'P-04',
      estante: 'Estante C',
      charola: 'Nivel 02',
      codigoUbicacion: 'P04-EC-N02'
    },
    sucursales: [
      { sucursalId: 'matriz', nombre: 'Matriz Centro (Actual)', stock: 8 },
      { sucursalId: 'norte', nombre: 'Bodega Norte Industrial', stock: 45 },
      { sucursalId: 'sur', nombre: 'Sucursal Periférico Sur', stock: 14 }
    ],
    proveedorId: 'prov-004',
    requiereLoteCaducidad: true,
    lote: 'LT-SIKA-2609-A',
    caducidad: '2027-04-30',
    historialCostos: [
      { fecha: '2026-06-20', costo: 108.00, proveedor: 'Sika Mexicana' },
      { fecha: '2026-09-18', costo: 115.00, proveedor: 'Sika Mexicana' }
    ]
  },
  {
    id: 'prod-006',
    codigoBarras: '750100234506',
    sku: 'ADH-TAN-250',
    nombre: 'Pegamento para PVC Tangit Alta Resistencia 250ml',
    categoria: 'Pinturas y Adhesivos',
    unidad: 'pieza',
    permiteGranel: false,
    precioPublico: 118.00,
    precioContratista: 98.00,
    costo: 72.00,
    stockActual: 19,
    stockMinimo: 10,
    stockMaximo: 50,
    puntoReorden: 15,
    ubicacion: {
      pasillo: 'P-04',
      estante: 'Estante C',
      charola: 'Nivel 01',
      codigoUbicacion: 'P04-EC-N01'
    },
    sucursales: [
      { sucursalId: 'matriz', nombre: 'Matriz Centro (Actual)', stock: 19 },
      { sucursalId: 'norte', nombre: 'Bodega Norte Industrial', stock: 35 },
      { sucursalId: 'sur', nombre: 'Sucursal Periférico Sur', stock: 12 }
    ],
    proveedorId: 'prov-004',
    requiereLoteCaducidad: true,
    lote: 'LT-TG-2611-X',
    caducidad: '2027-08-15'
  },
  {
    id: 'prod-007',
    codigoBarras: '750100234507',
    sku: 'CON-CEM-050',
    nombre: 'Cemento Gris Tolteca CPC 30R Bulto 50 kg',
    categoria: 'Construcción',
    unidad: 'pieza',
    permiteGranel: false,
    precioPublico: 260.00,
    precioContratista: 235.00,
    costo: 192.00,
    stockActual: 85,
    stockMinimo: 50,
    stockMaximo: 500,
    puntoReorden: 80,
    ubicacion: {
      pasillo: 'P-06',
      estante: 'Patio Cargas',
      charola: 'Tarima Cemento',
      codigoUbicacion: 'P06-PC-TC'
    },
    sucursales: [
      { sucursalId: 'matriz', nombre: 'Matriz Centro (Actual)', stock: 85 },
      { sucursalId: 'norte', nombre: 'Bodega Norte Industrial', stock: 650 },
      { sucursalId: 'sur', nombre: 'Sucursal Periférico Sur', stock: 110 }
    ],
    proveedorId: 'prov-005',
    requiereLoteCaducidad: true,
    lote: 'CEM-TOL-2610',
    caducidad: '2027-01-30'
  },
  {
    id: 'prod-008',
    codigoBarras: '750100234508',
    sku: 'CON-VAR-38',
    nombre: 'Varilla Corrugada 3/8" Grado 42 Tramo 12m',
    categoria: 'Construcción',
    unidad: 'pieza',
    permiteGranel: false,
    precioPublico: 195.00,
    precioContratista: 172.00,
    costo: 138.00,
    stockActual: 140,
    stockMinimo: 60,
    stockMaximo: 600,
    puntoReorden: 90,
    ubicacion: {
      pasillo: 'P-06',
      estante: 'Bodega Fierros',
      charola: 'Bancada 01',
      codigoUbicacion: 'P06-BF-B01'
    },
    sucursales: [
      { sucursalId: 'matriz', nombre: 'Matriz Centro (Actual)', stock: 140 },
      { sucursalId: 'norte', nombre: 'Bodega Norte Industrial', stock: 800 },
      { sucursalId: 'sur', nombre: 'Sucursal Periférico Sur', stock: 180 }
    ],
    proveedorId: 'prov-001',
    requiereLoteCaducidad: false
  },
  {
    id: 'prod-009',
    codigoBarras: '750100234509',
    sku: 'HER-STI-014',
    nombre: 'Llave Stillson 14" Uso Pesado Truper Expert 15838',
    categoria: 'Herramientas',
    unidad: 'pieza',
    permiteGranel: false,
    precioPublico: 385.00,
    precioContratista: 330.00,
    costo: 245.00,
    stockActual: 6,
    stockMinimo: 4,
    stockMaximo: 25,
    puntoReorden: 5,
    ubicacion: {
      pasillo: 'P-05',
      estante: 'Vitrina Herramienta',
      charola: 'Estante 03',
      codigoUbicacion: 'P05-VH-E03'
    },
    sucursales: [
      { sucursalId: 'matriz', nombre: 'Matriz Centro (Actual)', stock: 6 },
      { sucursalId: 'norte', nombre: 'Bodega Norte Industrial', stock: 18 },
      { sucursalId: 'sur', nombre: 'Sucursal Periférico Sur', stock: 5 }
    ],
    proveedorId: 'prov-006',
    requiereLoteCaducidad: false
  },
  {
    id: 'prod-010',
    codigoBarras: '750100234510',
    sku: 'MAN-JAR-012',
    nombre: 'Manguera Reforzada Nivel y Jardín 1/2" 3 Capas',
    categoria: 'Plomería',
    unidad: 'metro',
    permiteGranel: true,
    precioPublico: 16.00,
    precioContratista: 13.00,
    costo: 9.00,
    stockActual: 82.5,
    stockMinimo: 40.0,
    stockMaximo: 300.0,
    puntoReorden: 60.0,
    ubicacion: {
      pasillo: 'P-03',
      estante: 'Carretes Manguera',
      charola: 'Nivel 01',
      codigoUbicacion: 'P03-CM-N01'
    },
    sucursales: [
      { sucursalId: 'matriz', nombre: 'Matriz Centro (Actual)', stock: 82.5 },
      { sucursalId: 'norte', nombre: 'Bodega Norte Industrial', stock: 250.0 },
      { sucursalId: 'sur', nombre: 'Sucursal Periférico Sur', stock: 75.0 }
    ],
    proveedorId: 'prov-006',
    requiereLoteCaducidad: false
  },
  {
    id: 'prod-011',
    codigoBarras: '750100234511',
    sku: 'SOL-THI-001',
    nombre: 'Thinner Estándar Extra Fino para Limpieza y Pintura',
    categoria: 'Pinturas y Adhesivos',
    unidad: 'litro',
    permiteGranel: true,
    precioPublico: 38.00,
    precioContratista: 32.00,
    costo: 22.00,
    stockActual: 45.0,
    stockMinimo: 30.0,
    stockMaximo: 200.0,
    puntoReorden: 40.0,
    ubicacion: {
      pasillo: 'P-04',
      estante: 'Gabinete Solventes',
      charola: 'Tambor 200L',
      codigoUbicacion: 'P04-GS-T200'
    },
    sucursales: [
      { sucursalId: 'matriz', nombre: 'Matriz Centro (Actual)', stock: 45.0 },
      { sucursalId: 'norte', nombre: 'Bodega Norte Industrial', stock: 180.0 },
      { sucursalId: 'sur', nombre: 'Sucursal Periférico Sur', stock: 50.0 }
    ],
    proveedorId: 'prov-004',
    requiereLoteCaducidad: false
  },
  {
    id: 'prod-012',
    codigoBarras: '750100234512',
    sku: 'HER-CAR-550',
    nombre: 'Carretilla Bastidor Tubular Concha Metálica 5.5 ft Truper',
    categoria: 'Construcción',
    unidad: 'pieza',
    permiteGranel: false,
    precioPublico: 1390.00,
    precioContratista: 1220.00,
    costo: 940.00,
    stockActual: 5,
    stockMinimo: 3,
    stockMaximo: 18,
    puntoReorden: 4,
    ubicacion: {
      pasillo: 'P-06',
      estante: 'Piso Rampa',
      charola: 'Sección Carretillas',
      codigoUbicacion: 'P06-PR-SC'
    },
    sucursales: [
      { sucursalId: 'matriz', nombre: 'Matriz Centro (Actual)', stock: 5 },
      { sucursalId: 'norte', nombre: 'Bodega Norte Industrial', stock: 22 },
      { sucursalId: 'sur', nombre: 'Sucursal Periférico Sur', stock: 8 }
    ],
    proveedorId: 'prov-006',
    requiereLoteCaducidad: false
  }
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'prov-001',
    nombreComercial: 'Deacero Comercial S.A. de C.V.',
    rfc: 'DEA850101XYZ',
    contacto: 'Ing. Carlos Mendoza',
    telefono: '81 8369 4000',
    email: 'ventas@deacero.com.mx',
    diasCredito: 30,
    tiempoEntregaDias: 3,
    descuentoComercial: 6.0,
    categorias: ['Tornillería', 'Construcción']
  },
  {
    id: 'prov-002',
    nombreComercial: 'IUSA Eléctrica Distribución',
    rfc: 'IUS720315KL9',
    contacto: 'Lic. Mariana Rivera',
    telefono: '55 5133 2200',
    email: 'distribuidores@iusa.com.mx',
    diasCredito: 45,
    tiempoEntregaDias: 2,
    descuentoComercial: 8.5,
    categorias: ['Eléctrico']
  },
  {
    id: 'prov-003',
    nombreComercial: 'Amanco Wavin México',
    rfc: 'AMA900820T54',
    contacto: 'Jesús Morales',
    telefono: '55 5864 7100',
    email: 'pedidos@amancowavin.mx',
    diasCredito: 30,
    tiempoEntregaDias: 4,
    descuentoComercial: 5.0,
    categorias: ['Plomería']
  },
  {
    id: 'prov-004',
    nombreComercial: 'Sika Mexicana & Adhesivos',
    rfc: 'SIK650412MN1',
    contacto: 'Dra. Gabriela Solís',
    telefono: '442 238 6600',
    email: 'contacto@sika.com.mx',
    diasCredito: 15,
    tiempoEntregaDias: 2,
    descuentoComercial: 7.0,
    categorias: ['Pinturas y Adhesivos']
  },
  {
    id: 'prov-005',
    nombreComercial: 'Cemex Distribución Centro',
    rfc: 'CEM780909AA8',
    contacto: 'Ernesto Zavala',
    telefono: '800 236 3900',
    email: 'construrama@cemex.com',
    diasCredito: 15,
    tiempoEntregaDias: 1,
    descuentoComercial: 4.0,
    categorias: ['Construcción']
  },
  {
    id: 'prov-006',
    nombreComercial: 'Truper Ferreterías Mayorista',
    rfc: 'TRU750614P89',
    contacto: 'Rodolfo Cárdenas',
    telefono: '800 696 4600',
    email: 'pedidos_directos@truper.com',
    diasCredito: 30,
    tiempoEntregaDias: 3,
    descuentoComercial: 10.0,
    categorias: ['Herramientas', 'Construcción', 'Plomería']
  }
];

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'cli-001',
    nombre: 'Público General de Mostrador',
    rfc: 'XAXX010101000',
    telefono: 'S/N',
    email: 'mostrador@ferreymas.com',
    direccion: 'Venta Directa Mostrador',
    tipo: 'publico_general',
    limiteCredito: 0,
    saldoActual: 0,
    saldoVencido: 0,
    diasCredito: 0,
    historialComprasCount: 342
  },
  {
    id: 'cli-002',
    nombre: 'Arq. Roberto Méndez (Constructora Méndez & Hijos)',
    rfc: 'CME120405H89',
    telefono: '55 4123 9876',
    email: 'compras@mendezconstructores.com',
    direccion: 'Av. Las Palmas 402, Col. San Jerónimo',
    tipo: 'constructora',
    limiteCredito: 90000,
    saldoActual: 38400,
    saldoVencido: 0,
    diasCredito: 30,
    historialComprasCount: 48
  },
  {
    id: 'cli-003',
    nombre: 'Maestro Fernando Silva (Instalaciones Hidro-Sanitarias)',
    rfc: 'SIF8311029G1',
    telefono: '55 6789 1234',
    email: 'plomeria.silva@gmail.com',
    direccion: 'Calle Morelos 129, Col. Industrial',
    tipo: 'contratista',
    limiteCredito: 25000,
    saldoActual: 18200,
    saldoVencido: 4500, // saldo vencido
    diasCredito: 15,
    historialComprasCount: 26
  },
  {
    id: 'cli-004',
    nombre: 'Electricistas Asociados del Valle',
    rfc: 'EAV190822K33',
    telefono: '55 8901 2345',
    email: 'proyectos@electricistasvalle.com',
    direccion: 'Eje Central 810, Interior 4',
    tipo: 'contratista',
    limiteCredito: 40000,
    saldoActual: 8900,
    saldoVencido: 0,
    diasCredito: 20,
    historialComprasCount: 19
  }
];

export const INITIAL_ORDERS: PurchaseOrder[] = [
  {
    id: 'oc-1001',
    folio: 'OC-2026-089',
    proveedorId: 'prov-001',
    proveedorNombre: 'Deacero Comercial S.A. de C.V.',
    fechaCreacion: '2026-11-08',
    fechaEsperada: '2026-11-12',
    estado: 'enviada',
    items: [
      {
        productoId: 'prod-001',
        nombre: 'Clavo Estándar con Cabeza 2" (50mm)',
        sku: 'TOR-CLA-002',
        cantidadSugerida: 50,
        cantidadPedida: 50,
        costoUnitario: 32.00,
        subtotal: 1600.00
      }
    ],
    subtotal: 1600.00,
    iva: 256.00,
    total: 1856.00,
    notas: 'Entrega por reorden de stock mínimo detectado automáticamente.'
  },
  {
    id: 'oc-1002',
    folio: 'OC-2026-090',
    proveedorId: 'prov-002',
    proveedorNombre: 'IUSA Eléctrica Distribución',
    fechaCreacion: '2026-11-09',
    fechaEsperada: '2026-11-13',
    estado: 'sugerida',
    items: [
      {
        productoId: 'prod-003',
        nombre: 'Cable Eléctrico THW-LS Calibre 12 AWG IUSA (Negro)',
        sku: 'ELE-CAB-012',
        cantidadSugerida: 200,
        cantidadPedida: 200,
        costoUnitario: 10.90,
        subtotal: 2180.00
      }
    ],
    subtotal: 2180.00,
    iva: 348.80,
    total: 2528.80,
    notas: 'Sugerida automáticamente: Stock actual (14m) menor a mínimo (80m).'
  }
];

export const INITIAL_CASH_SHIFT: CashShift = {
  id: 'corte-001',
  cajeroId: 'usr-cajero-01',
  cajeroNombre: 'Daniel Morales',
  fechaApertura: '2026-11-10T08:00:00',
  fondoInicial: 2500.00,
  movimientos: [
    {
      id: 'mov-001',
      tipo: 'salida',
      monto: 250.00,
      motivo: 'Pago flete menor descarga de arena',
      hora: '10:15',
      usuario: 'Daniel Morales'
    },
    {
      id: 'mov-002',
      tipo: 'entrada',
      monto: 500.00,
      motivo: 'Aportación cambio menudo morralla',
      hora: '11:40',
      usuario: 'Daniel Morales'
    }
  ],
  totalVentasEfectivo: 4320.00,
  totalVentasTarjeta: 6850.00,
  totalVentasTransferencia: 2400.00,
  totalVentasCredito: 12500.00,
  totalEntradas: 500.00,
  totalSalidas: 250.00,
  montoEsperadoEfectivo: 2500 + 4320 + 500 - 250, // 7070.00
  estado: 'abierta'
};

export const INITIAL_LAYAWAYS: Layaway[] = [
  {
    id: 'apa-001',
    folio: 'AP-2026-0045',
    clienteNombre: 'Héctor Salgado',
    clienteTelefono: '55 3344 5566',
    fechaCreacion: '2026-11-05',
    fechaVencimiento: '2026-11-25',
    items: [
      {
        producto: INITIAL_PRODUCTS[8], // Llave stilson
        cantidad: 1,
        unidadSeleccionada: 'pieza',
        precioUnitario: 385.00,
        tipoPrecio: 'publico',
        descuento: 0,
        subtotal: 385.00
      },
      {
        producto: INITIAL_PRODUCTS[11], // Carretilla
        cantidad: 1,
        unidadSeleccionada: 'pieza',
        precioUnitario: 1390.00,
        tipoPrecio: 'publico',
        descuento: 0,
        subtotal: 1390.00
      }
    ],
    total: 1775.00,
    anticipo: 600.00,
    saldoRestante: 1175.00,
    estado: 'vigente'
  }
];

export const INITIAL_SHRINKAGES: Shrinkage[] = [
  {
    id: 'mer-001',
    folio: 'MER-2026-012',
    fecha: '2026-11-07',
    productoId: 'prod-005',
    productoNombre: 'Sellador Adhesivo Poliuretano Sikaflex 11FC Blanco 300ml',
    cantidad: 1,
    unidad: 'pieza',
    motivo: 'rotura_en_tienda',
    costoEstimado: 115.00,
    reportadoPor: 'Almacén Central',
    estado: 'aplicado_inventario'
  }
];
