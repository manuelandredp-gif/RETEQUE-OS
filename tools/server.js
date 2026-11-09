/**
 * RETEQUEÑOS OS - Servidor de Producción Local & API REST Segura
 * Reemplaza de forma definitiva el antiguo backend en PowerShell (serve-app.ps1).
 *
 * Características:
 * - Cero dependencias externas (utiliza módulos nativos de Node.js).
 * - Persistencia transaccional ACID en disco (data/orders.db.json con escritura atómica).
 * - Autenticación por PIN para el Hub Operativo / Monitor KDS.
 * - Prevención de XSS y validación estricta de esquemas en endpoints REST.
 * - Protección contra Path Traversal y mitigación de CORS inseguro.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

// Configuración de rutas y puertos
const ROOT_DIR = path.resolve(__dirname, '..');
const APP_DIR = path.join(ROOT_DIR, 'app');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const DB_FILE = path.join(DATA_DIR, 'orders.db.json');
const BACKUP_DIR = path.join(DATA_DIR, 'backups');
const COMPLAINTS_FILE = path.join(DATA_DIR, 'complaints.db.json');

// Parseo de argumentos de línea de comandos
const args = process.argv.slice(2);
let PORT = 3000;
let BIND_ALL = false;
let ADMIN_PIN = process.env.RTQ_ADMIN_PIN || '2026';
// La automatización es opcional y se configura fuera del código. Si no hay
// webhook, el operador conserva el procedimiento manual de despacho.
const N8N_WEBHOOK_URL = process.env.RTQ_N8N_WEBHOOK_URL || '';
const N8N_SERVICE_TOKEN = process.env.RTQ_N8N_SERVICE_TOKEN || '';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '-p' || args[i] === '--port') {
    PORT = parseInt(args[++i], 10) || 3000;
  } else if (args[i] === '-Lan' || args[i] === '--lan') {
    BIND_ALL = true;
  } else if (args[i] === '--pin') {
    ADMIN_PIN = args[++i] || '2026';
  }
}

// MIME Types soportados
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'text/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=UTF-8'
};

// Sesiones activas de administrador (en memoria, expiración de 24 horas)
const activeSessions = new Map(); // token -> { createdAt, expiresAt }
const loginAttempts = new Map(); // ip -> { count, lockedUntil }
const orderRateLimits = new Map(); // ip -> { count, resetAt }
const ORDER_STATUSES = ['new', 'kitchen', 'ready', 'published', 'assigned', 'delivered'];
const STATUS_TRANSITIONS = {
  new: ['kitchen'],
  kitchen: ['ready'],
  ready: ['published', 'delivered'], // "delivered" aplica solo a recojo
  published: ['assigned'],
  assigned: ['delivered'],
  delivered: []
};

function checkRateLimit(ip) {
  const now = Date.now();
  const rec = loginAttempts.get(ip);
  if (!rec) return { allowed: true };
  if (rec.lockedUntil && now < rec.lockedUntil) {
    const remainingSecs = Math.ceil((rec.lockedUntil - now) / 1000);
    return { allowed: false, error: `Demasiados intentos fallidos. Bloqueado temporalmente (${remainingSecs}s restantes).` };
  }
  if (rec.lockedUntil && now >= rec.lockedUntil) {
    loginAttempts.delete(ip);
    return { allowed: true };
  }
  return { allowed: true };
}

function checkOrderRateLimit(ip) {
  const now = Date.now();
  const rec = orderRateLimits.get(ip);
  if (!rec || now > rec.resetAt) {
    orderRateLimits.set(ip, { count: 1, resetAt: now + 60 * 1000 });
    return { allowed: true };
  }
  rec.count++;
  if (rec.count > 30) {
    return { allowed: false, error: 'Límite de creación de pedidos excedido (máx 30/min). Por favor espere un momento.' };
  }
  return { allowed: true };
}

function recordLoginAttempt(ip, success) {
  if (success) {
    loginAttempts.delete(ip);
    return;
  }
  const now = Date.now();
  const rec = loginAttempts.get(ip) || { count: 0, lockedUntil: null };
  rec.count++;
  if (rec.count >= 5) {
    rec.lockedUntil = now + 15 * 60 * 1000; // 15 minutos
  }
  loginAttempts.set(ip, rec);
}

function timingSafeEqualStrings(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function createAdminSession() {
  const token = crypto.randomBytes(32).toString('hex');
  const now = Date.now();
  const expiresAt = now + 24 * 60 * 60 * 1000; // 24 horas
  activeSessions.set(token, { createdAt: now, expiresAt });
  return { token, expiresAt };
}

function isValidAdminSession(token) {
  if (!token) return false;
  const session = activeSessions.get(token);
  if (!session) return false;
  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return false;
  }
  return true;
}

// Semilla inicial de pedidos si la base de datos no existe
const SEED_ORDERS = [
  {
    id: 'RTQ-2064',
    customer: 'Milton Flores',
    phone: '+51 952 000 111',
    channel: 'app',
    payMethod: 'Pago confirmado',
    payVerified: true,
    mode: 'pickup',
    status: 'new',
    priority: false,
    time: 'Recién recibido',
    elapsedMinutes: 0,
    address: 'Calle Alto Lima 1488',
    reference: 'Recojo en tienda',
    items: [
      { name: 'Tequeños de queso (Mayonesa de ajo)', qty: 1, price: 16.00, sauces: 'Mayonesa de ajo' },
      { name: 'Promo Duo (Queso + Mayopalta)', qty: 1, price: 35.90, sauces: 'Mayopalta' }
    ],
    subtotal: 51.90,
    deliveryFee: 0,
    discount: 0,
    total: 51.90,
    notes: 'Por favor servilletas adicionales.'
  },
  {
    id: 'RTQ-2181',
    customer: 'Paola Vizcarra',
    phone: '+51 952 223 344',
    channel: 'app',
    payMethod: 'Yape verificado',
    payVerified: true,
    mode: 'delivery',
    status: 'kitchen',
    priority: true,
    time: 'En cocina hace 6 min',
    elapsedMinutes: 6,
    address: 'Urb. Vigil Mz B Lte 12',
    reference: 'Frente al parque infantil',
    items: [
      { name: 'Pizza Familiar Americana', qty: 1, price: 34.90, sauces: 'Orégano extra' },
      { name: 'Inka Cola 1.5L', qty: 1, price: 8.50 }
    ],
    subtotal: 43.40,
    deliveryFee: 5.00,
    discount: 0,
    total: 48.40,
    notes: 'Tocar timbre blanco.'
  },
  {
    id: 'RTQ-2052',
    customer: 'Alejandro Vargas',
    phone: '+51 952 112 433',
    channel: 'whatsapp',
    payMethod: 'Por verificar',
    payVerified: false,
    mode: 'delivery',
    status: 'new',
    priority: false,
    time: 'Recién recibido',
    elapsedMinutes: 1,
    address: 'Av. Bolognesi 450 Dpto 302',
    reference: 'Edificio Los Pinos',
    items: [
      { name: 'Promo Tequepizza', qty: 1, price: 38.90, sauces: 'Tártara' }
    ],
    subtotal: 38.90,
    deliveryFee: 6.00,
    discount: 0,
    total: 44.90,
    notes: 'Enviar comprobante antes de mandar motorizado.'
  }
];

// Capa de Persistencia Transaccional (Atomic File I/O)
class OrderRepository {
  constructor(filePath) {
    this.filePath = filePath;
    this.orders = [];
    this.init();
  }

  init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          this.orders = parsed;
          console.log(`[DB] Base de datos cargada: ${this.orders.length} pedidos persistidos.`);
          return;
        }
      }
    } catch (err) {
      console.warn('[DB] Advertencia al leer base de datos existente, reinicializando:', err.message);
    }

    // Inicializar con seed data
    this.orders = [...SEED_ORDERS];
    this.saveSync();
    console.log(`[DB] Base de datos inicializada con ${this.orders.length} pedidos de demostración.`);
  }

  saveSync() {
    this.createDailyBackup();
    const tmpPath = `${this.filePath}.${Date.now()}.${crypto.randomBytes(4).toString('hex')}.tmp`;
    const jsonStr = JSON.stringify(this.orders, null, 2);
    fs.writeFileSync(tmpPath, jsonStr, 'utf8');
    fs.renameSync(tmpPath, this.filePath); // Operación atómica en POSIX y Windows NTFS
  }

  createDailyBackup() {
    if (!fs.existsSync(this.filePath)) return;
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    const day = new Date().toISOString().slice(0, 10);
    const backup = path.join(BACKUP_DIR, `orders-${day}.json`);
    if (!fs.existsSync(backup)) fs.copyFileSync(this.filePath, backup);

    const backups = fs.readdirSync(BACKUP_DIR)
      .filter(name => /^orders-\d{4}-\d{2}-\d{2}\.json$/.test(name))
      .sort();
    while (backups.length > 7) {
      fs.unlinkSync(path.join(BACKUP_DIR, backups.shift()));
    }
  }

  getAll() {
    return [...this.orders];
  }

  getById(id) {
    return this.orders.find(o => o.id === id);
  }

  insert(order) {
    // Sanitización y parseo de ítems con precisión monetaria
    if (!Array.isArray(order.items) || order.items.length === 0 || order.items.length > 30) {
      throw new Error('El pedido debe incluir entre 1 y 30 productos.');
    }
    const maxQuantity = order.channel === 'app' ? 20 : 50;
    const items = order.items.map(it => {
          const qty = parseInt(it.qty, 10);
          const price = Math.round((Math.max(0, parseFloat(it.price) || 0) + Number.EPSILON) * 100) / 100;
          const name = sanitizeString(it.name || '');
          if (!Number.isInteger(qty) || qty < 1 || qty > maxQuantity) throw new Error(`Cada producto admite entre 1 y ${maxQuantity} unidades.`);
          if (!name || price <= 0) throw new Error('Cada producto debe tener nombre y precio válido.');
          return {
            name,
            qty,
            price,
            sauces: sanitizeString(it.sauces || '')
          };
        });

    const deliveryFee = Math.round((Math.max(0, parseFloat(order.deliveryFee) || 0) + Number.EPSILON) * 100) / 100;
    const discount = Math.round((Math.max(0, parseFloat(order.discount) || 0) + Number.EPSILON) * 100) / 100;

    // Recalcular subtotal a partir de ítems si existen
    let subtotal = Math.round((Math.max(0, parseFloat(order.subtotal) || 0) + Number.EPSILON) * 100) / 100;
    if (items.length > 0) {
      const computedSubtotal = Math.round((items.reduce((sum, it) => sum + (it.price * it.qty), 0) + Number.EPSILON) * 100) / 100;
      if (Math.abs(computedSubtotal - subtotal) > 0.05 || subtotal === 0) {
        subtotal = computedSubtotal;
      }
    }

    // Recalcular total con integridad financiera
    const computedTotal = Math.max(0, Math.round((subtotal + deliveryFee - discount + Number.EPSILON) * 100) / 100);
    let total = Math.round((Math.max(0, parseFloat(order.total) || 0) + Number.EPSILON) * 100) / 100;
    if (Math.abs(computedTotal - total) > 0.05 || total === 0) {
      total = computedTotal;
    }

    // Sanitización preventiva profunda de campos de texto
    const customer = sanitizeString(order.customer || '');
    const phoneDigits = String(order.phone || '').replace(/\D/g, '').replace(/^51/, '');
    if (customer.length < 3) throw new Error('El nombre del cliente debe tener al menos 3 caracteres.');
    if (!/^9\d{8}$/.test(phoneDigits)) throw new Error('El celular debe ser peruano: 9 dígitos que inician en 9.');
    const mode = ['delivery', 'pickup'].includes(order.mode) ? order.mode : 'delivery';
    const address = sanitizeString(order.address || '');
    if (mode === 'delivery' && address.length < 5) throw new Error('Indique una dirección válida para delivery.');

    const sanitized = {
      id: sanitizeId(order.id),
      customer,
      phone: phoneDigits,
      channel: ['web', 'app', 'whatsapp'].includes(order.channel) ? order.channel : 'app',
      mode,
      status: 'new',
      priority: Boolean(order.priority),
      payMethod: sanitizeString(order.payMethod || 'Por verificar'),
      payVerified: Boolean(order.payVerified),
      address,
      reference: sanitizeString(order.reference || ''),
      gps: sanitizeUrl(order.gps || ''),
      notes: sanitizeString(order.notes || ''),
      time: 'Recién recibido',
      elapsedMinutes: 0,
      createdAt: order.createdAt || new Date().toISOString(),
      items,
      subtotal,
      deliveryFee,
      discount,
      total
    };

    // Idempotencia: una repetición de red devuelve la comanda existente, nunca la sobrescribe.
    const existing = this.getById(sanitized.id);
    if (existing) return { order: existing, duplicate: true };
    this.orders.unshift(sanitized);

    this.saveSync();
    return { order: sanitized, duplicate: false };
  }

  updateStatus(id, newStatus, actor = 'admin', driver = {}) {
    const order = this.orders.find(o => o.id === id);
    if (!order) return null;

    if (!ORDER_STATUSES.includes(newStatus) || !STATUS_TRANSITIONS[order.status]?.includes(newStatus)) {
      return { error: `Transición no permitida: ${order.status} → ${newStatus}` };
    }
    if (newStatus === 'kitchen' && isDigitalPayment(order) && !order.payVerified) {
      return { error: 'El pago digital debe verificarse antes de preparar el pedido.' };
    }
    if (newStatus === 'ready' && order.mode === 'pickup') {
      // En recojo no se publica ni asigna motorizado.
      order.dispatchRequired = false;
    }
    if ((newStatus === 'published' || newStatus === 'assigned') && order.mode !== 'delivery') {
      return { error: 'Solo los pedidos delivery pueden pasar por despacho.' };
    }
    if ((newStatus === 'published' || newStatus === 'assigned') && actor !== 'n8n' && actor !== 'admin') {
      return { error: 'Actor no autorizado para despacho.' };
    }

    order.status = newStatus;
    order.updatedAt = new Date().toISOString();
    if (newStatus === 'kitchen') {
      order.time = 'En cocina hace 1 min';
      order.elapsedMinutes = 1;
    } else if (newStatus === 'ready') {
      order.time = 'Listo para despacho';
    } else if (newStatus === 'published') {
      order.time = 'Publicado a motorizados';
      order.dispatchPublishedAt = order.updatedAt;
    } else if (newStatus === 'assigned') {
      order.time = 'Motorizado asignado';
      if (driver.name !== undefined) order.driverName = sanitizeString(driver.name || 'Motorizado').slice(0, 100);
      if (driver.phone !== undefined) order.driverPhone = sanitizeString(driver.phone || '').slice(0, 30);
    } else if (newStatus === 'delivered') {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      order.time = `Entregado a las ${hh}:${mm}`;
    }
    this.saveSync();
    return order;
  }

  assignDriver(id, driverName, driverPhone) {
    const order = this.orders.find(o => o.id === id);
    if (!order) return null;
    if (order.status !== 'published') return { error: 'El pedido debe estar publicado antes de asignar motorizado.' };
    order.driverName = sanitizeString(driverName || 'Motorizado').slice(0, 100);
    order.driverPhone = sanitizeString(driverPhone || '').slice(0, 30);
    return this.updateStatus(id, 'assigned', 'n8n', { name: order.driverName, phone: order.driverPhone });
  }

  verifyPayment(id) {
    const order = this.orders.find(o => o.id === id);
    if (!order) return null;
    order.payVerified = true;
    this.saveSync();
    return order;
  }
}

// --------------------------------------------------------------------------
// Fuente Única de Verdad: Repositorio de Configuración del Negocio
// --------------------------------------------------------------------------
const CONFIG_FILE = path.join(DATA_DIR, 'store.config.json');

class ConfigRepository {
  constructor(filePath) {
    this.filePath = filePath;
    this.config = {};
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(this.filePath)) {
        this.config = JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
      }
    } catch (e) {
      console.warn('[Config] Error al leer store.config.json:', e.message);
    }
  }

  get() {
    return { ...this.config };
  }

  update(patch) {
    this.config = { ...this.config, ...patch };
    const tmp = `${this.filePath}.${Date.now()}.${crypto.randomBytes(4).toString('hex')}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(this.config, null, 2), 'utf8');
    fs.renameSync(tmp, this.filePath);
    return this.config;
  }
}

// Libro de Reclamaciones local. Los datos solo se exponen al administrador.
class ComplaintRepository {
  constructor(filePath) {
    this.filePath = filePath;
    this.complaints = [];
    try {
      if (fs.existsSync(filePath)) {
        const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (Array.isArray(parsed)) this.complaints = parsed;
      }
    } catch (error) {
      console.warn('[Reclamos] No se pudo leer el libro:', error.message);
    }
  }

  saveSync() {
    const tmp = `${this.filePath}.${Date.now()}.${crypto.randomBytes(4).toString('hex')}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(this.complaints, null, 2), 'utf8');
    fs.renameSync(tmp, this.filePath);
  }

  create(input) {
    const fullName = sanitizeString(input.fullName || '');
    const phone = String(input.phone || '').replace(/\D/g, '').replace(/^51/, '');
    const detail = sanitizeString(input.detail || '');
    const type = input.type === 'reclamo' ? 'reclamo' : 'queja';
    if (fullName.length < 3 || !/^9\d{8}$/.test(phone) || detail.length < 10) {
      throw new Error('Complete nombre, celular peruano y un detalle de al menos 10 caracteres.');
    }
    const complaint = {
      id: `LR-${new Date().getFullYear()}-${String(this.complaints.length + 1).padStart(4, '0')}`,
      type,
      fullName,
      phone,
      email: sanitizeString(input.email || '').slice(0, 150),
      orderId: input.orderId ? sanitizeId(input.orderId) : '',
      detail,
      requestedSolution: sanitizeString(input.requestedSolution || ''),
      status: 'received',
      createdAt: new Date().toISOString()
    };
    this.complaints.unshift(complaint);
    this.saveSync();
    return complaint;
  }

  getAll() { return [...this.complaints]; }
}

// --------------------------------------------------------------------------
// Fuente Única de Verdad: Repositorio de Catálogo Maestro de Productos
// --------------------------------------------------------------------------
const CATALOG_FILE = path.join(DATA_DIR, 'catalog.db.json');

class CatalogRepository {
  constructor(filePath) {
    this.filePath = filePath;
    this.products = [];
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(this.filePath)) {
        const parsed = JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
        if (Array.isArray(parsed)) {
          this.products = parsed;
          console.log(`[Catalog] Catálogo cargado: ${this.products.length} productos.`);
          return;
        }
      }
    } catch (e) {
      console.warn('[Catalog] Error al leer catalog.db.json:', e.message);
    }
  }

  saveSync() {
    const tmp = `${this.filePath}.${Date.now()}.${crypto.randomBytes(4).toString('hex')}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(this.products, null, 2), 'utf8');
    fs.renameSync(tmp, this.filePath);
  }

  getAll() {
    return [...this.products];
  }

  getById(id) {
    return this.products.find(p => p.id === id);
  }

  save(product) {
    const sanitized = {
      id: sanitizeId(product.id || `prod_${Date.now()}`),
      name: sanitizeString(product.name || 'Producto'),
      icon: product.icon || '🥟',
      cat: sanitizeString(product.cat || 'Clásicos'),
      qty: sanitizeString(product.qty || 'Porción estándar'),
      price: Math.max(0, parseFloat(product.price) || 0),
      promo: product.promo ? Math.max(0, parseFloat(product.promo) || 0) : null,
      sauces: sanitizeString(product.sauces || '2 salsas gratis'),
      badge: sanitizeString(product.badge || ''),
      desc: sanitizeString(product.desc || ''),
      stock: product.stock !== undefined ? Boolean(product.stock) : true
    };

    const idx = this.products.findIndex(p => p.id === sanitized.id);
    if (idx >= 0) {
      this.products[idx] = sanitized;
    } else {
      this.products.unshift(sanitized);
    }
    this.saveSync();
    return sanitized;
  }

  toggleStock(id, stock) {
    const p = this.products.find(prod => prod.id === id);
    if (!p) return null;
    p.stock = Boolean(stock);
    this.saveSync();
    return p;
  }

  delete(id) {
    const idx = this.products.findIndex(p => p.id === id);
    if (idx === -1) return false;
    this.products.splice(idx, 1);
    this.saveSync();
    return true;
  }
}

const configRepo = new ConfigRepository(CONFIG_FILE);
const complaintRepo = new ComplaintRepository(COMPLAINTS_FILE);
const catalogRepo = new CatalogRepository(CATALOG_FILE);


// Funciones de Sanitización
function sanitizeId(id) {
  if (typeof id !== 'string') return `RTQ-${Math.floor(2000 + Math.random() * 8000)}`;
  const cleaned = id.trim().replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 40);
  return cleaned || `RTQ-${Math.floor(2000 + Math.random() * 8000)}`;
}

function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  return str
    .trim()
    .replace(/[<>]/g, '') // Elimina etiquetas potencialmente maliciosas
    .slice(0, 500); // Límite de longitud preventiva
}

function sanitizeUrl(url) {
  if (typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('https://maps.google.com/') || trimmed.startsWith('https://www.google.com/maps/')) {
    return trimmed;
  }
  return '';
}

function isDigitalPayment(order) {
  return /yape|plin|transfer/i.test(String(order?.payMethod || ''));
}

const repo = new OrderRepository(DB_FILE);

// Detección de IP local para conexión celular
function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return null;
}

// Extracción de Token de Autorización
function extractToken(req) {
  // 1. Cabecera Authorization: Bearer <token>
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }
  // 2. Cabecera personalizada x-admin-token
  if (req.headers['x-admin-token']) {
    return String(req.headers['x-admin-token']).trim();
  }
  // 3. Cookie rtq_admin_token
  const cookieHeader = req.headers['cookie'];
  if (cookieHeader) {
    const match = cookieHeader.match(/rtq_admin_token=([a-f0-9]+)/);
    if (match) return match[1];
  }
  return null;
}

function isN8nServiceRequest(req) {
  if (!N8N_SERVICE_TOKEN) return false;
  const provided = String(req.headers['x-n8n-token'] || '');
  return timingSafeEqualStrings(provided, N8N_SERVICE_TOKEN);
}

function canUseN8nWebhook() {
  try {
    const url = new URL(N8N_WEBHOOK_URL);
    return url.protocol === 'https:' || (url.protocol === 'http:' && ['127.0.0.1', 'localhost'].includes(url.hostname));
  } catch (_) {
    return false;
  }
}

async function notifyN8nDispatch(order) {
  if (!canUseN8nWebhook()) return { sent: false, reason: 'webhook no configurado' };
  // El webhook recibe únicamente el identificador y datos operativos no personales.
  // n8n debe solicitar el detalle por API autenticada después de asignar al motorizado.
  const payload = {
    event: 'order.ready_for_dispatch',
    orderId: order.id,
    total: order.total,
    deliveryFee: order.deliveryFee,
    mode: order.mode,
    createdAt: order.createdAt
  };
  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-N8N-Token': N8N_SERVICE_TOKEN },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(3000)
    });
    return { sent: response.ok, status: response.status };
  } catch (error) {
    console.warn(`[n8n] No se pudo notificar despacho de ${order.id}: ${error.message}`);
    return { sent: false, reason: error.message };
  }
}

// Validación de Origen CORS Seguro
function handleCors(req, res) {
  const origin = req.headers['origin'];
  if (!origin) {
    // Petición interna o de la misma máquina
    res.setHeader('Access-Control-Allow-Origin', '*');
  } else {
    // Permitir orígenes seguros de desarrollo y LAN
    const isAllowed = 
      /^http:\/\/localhost(:[0-9]+)?$/.test(origin) ||
      /^http:\/\/127\.0\.0\.1(:[0-9]+)?$/.test(origin) ||
      /^http:\/\/192\.168\.[0-9]+\.[0-9]+(:[0-9]+)?$/.test(origin) ||
      /^http:\/\/10\.[0-9]+\.[0-9]+\.[0-9]+(:[0-9]+)?$/.test(origin);

    if (isAllowed) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-token, x-n8n-token');
}

// Lector seguro de body JSON con límite de tamaño (DoS protection)
function readJsonBody(req, limitBytes = 64 * 1024) {
  return new Promise((resolve, reject) => {
    let bytes = 0;
    let data = '';

    req.on('data', chunk => {
      bytes += chunk.length;
      if (bytes > limitBytes) {
        req.destroy();
        reject(new Error('Payload Too Large'));
        return;
      }
      data += chunk;
    });

    req.on('end', () => {
      if (!data) return resolve({});
      try {
        const json = JSON.parse(data);
        resolve(json);
      } catch (err) {
        reject(new Error('Invalid JSON'));
      }
    });

    req.on('error', err => reject(err));
  });
}

// Respuestas JSON estandarizadas
function sendJson(res, statusCode, data) {
  const body = JSON.stringify(data);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=UTF-8',
    'Cache-Control': 'no-store, no-cache, must-revalidate',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN'
  });
  res.end(body);
}

// Servidor HTTP Principal
const server = http.createServer(async (req, res) => {
  handleCors(req, res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Sonda sin PII para comprobar que el servicio local responde.
  if (pathname === '/api/health' && req.method === 'GET') {
    return sendJson(res, 200, {
      ok: true,
      timestamp: new Date().toISOString(),
      ordersInMemory: repo.getAll().length,
      n8nConfigured: canUseN8nWebhook()
    });
  }

  // --------------------------------------------------------------------------
  // API: Autenticación Admin
  // --------------------------------------------------------------------------
  if (pathname === '/api/auth/login' && req.method === 'POST') {
    try {
      const clientIp = req.socket.remoteAddress || 'unknown';
      const limit = checkRateLimit(clientIp);
      if (!limit.allowed) {
        return sendJson(res, 429, { ok: false, error: limit.error });
      }

      const body = await readJsonBody(req);
      const inputPin = String(body.pin || '').trim();

      if (timingSafeEqualStrings(inputPin, ADMIN_PIN)) {
        recordLoginAttempt(clientIp, true);
        const session = createAdminSession();
        res.setHeader('Set-Cookie', `rtq_admin_token=${session.token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`);
        return sendJson(res, 200, {
          ok: true,
          message: 'Autenticación exitosa',
          token: session.token,
          expiresAt: session.expiresAt
        });
      } else {
        recordLoginAttempt(clientIp, false);
        return sendJson(res, 401, { ok: false, error: 'PIN de administrador incorrecto' });
      }
    } catch (e) {
      return sendJson(res, 400, { ok: false, error: e.message });
    }
  }

  if (pathname === '/api/auth/verify' && req.method === 'GET') {
    const token = extractToken(req);
    const isValid = isValidAdminSession(token);
    return sendJson(res, 200, { authenticated: isValid });
  }

  if (pathname === '/api/auth/logout' && req.method === 'POST') {
    const token = extractToken(req);
    if (token) activeSessions.delete(token);
    res.setHeader('Set-Cookie', 'rtq_admin_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');
    return sendJson(res, 200, { ok: true });
  }

  // --------------------------------------------------------------------------
  // API: Libro de Reclamaciones (Ley N.° 29571)
  // --------------------------------------------------------------------------
  if (pathname === '/api/reclamos') {
    if (req.method === 'POST') {
      try {
        const clientIp = req.socket.remoteAddress || 'unknown';
        const rate = checkOrderRateLimit(`complaint:${clientIp}`);
        if (!rate.allowed) return sendJson(res, 429, { ok: false, error: rate.error });
        const complaint = complaintRepo.create(await readJsonBody(req));
        return sendJson(res, 201, { ok: true, caseId: complaint.id, createdAt: complaint.createdAt });
      } catch (error) {
        return sendJson(res, 400, { ok: false, error: error.message });
      }
    }
    if (req.method === 'GET') {
      const token = extractToken(req);
      if (!isValidAdminSession(token)) return sendJson(res, 401, { ok: false, error: 'Requiere autenticación de administrador' });
      return sendJson(res, 200, complaintRepo.getAll());
    }
  }

  // --------------------------------------------------------------------------
  // API: Pedidos (RESTful)
  // --------------------------------------------------------------------------
  if (pathname === '/api/pedidos') {
    // GET: Obtener todos los pedidos (Exclusivo Administrador autenticado para evitar fuga de PII)
    if (req.method === 'GET') {
      const token = extractToken(req);
      const isAuth = isValidAdminSession(token);

      if (!isAuth) {
        return sendJson(res, 401, {
          ok: false,
          error: 'Requiere autenticación de administrador para acceder a las comandas'
        });
      }

      const orders = repo.getAll();
      return sendJson(res, 200, orders);
    }

    // POST: Crear nuevo pedido (Público desde Web y App con validación y límite de tasa)
    if (req.method === 'POST') {
      try {
        const clientIp = req.socket.remoteAddress || 'unknown';
        const rate = checkOrderRateLimit(clientIp);
        if (!rate.allowed) {
          return sendJson(res, 429, { ok: false, error: rate.error });
        }

        const payload = await readJsonBody(req);
        if (!payload || typeof payload !== 'object') {
          return sendJson(res, 400, { ok: false, error: 'Cuerpo de pedido inválido' });
        }

        const result = repo.insert(payload);
        if (result.duplicate) {
          return sendJson(res, 200, { ok: true, duplicate: true, order: result.order });
        }
        console.log(`[PEDIDO CREADO] ${result.order.id} - ${result.order.customer} - Total: S/ ${result.order.total.toFixed(2)} (${result.order.channel})`);
        return sendJson(res, 201, { ok: true, duplicate: false, order: result.order });
      } catch (err) {
        return sendJson(res, 400, { ok: false, error: err.message });
      }
    }
  }

  // GET /api/pedidos/:id (Consulta pública y segura de estado individual sin exponer PII completa)
  if (pathname.startsWith('/api/pedidos/') && req.method === 'GET') {
    const orderId = sanitizeId(pathname.split('/')[3] || '');
    const ord = repo.getById(orderId);
    if (!ord) {
      return sendJson(res, 404, { ok: false, error: 'Pedido no encontrado' });
    }
    const token = extractToken(req);
    const isAuth = isValidAdminSession(token);
    const isN8n = isN8nServiceRequest(req);
    if (!isAuth && !isN8n) {
      return sendJson(res, 200, {
        id: ord.id,
        status: ord.status,
        mode: ord.mode,
        time: ord.time,
        elapsedMinutes: ord.elapsedMinutes,
        channel: ord.channel,
        total: ord.total,
        payMethod: ord.payMethod,
        payVerified: ord.payVerified,
        createdAt: ord.createdAt
      });
    }
    return sendJson(res, 200, ord);
  }

  // PATCH /api/pedidos/:id (Actualizar estado o verificar pago - Requiere sesión de Administrador)
  if (pathname.startsWith('/api/pedidos/') && (req.method === 'PATCH' || req.method === 'POST')) {
    const token = extractToken(req);
    const isAdmin = isValidAdminSession(token);
    const isN8n = isN8nServiceRequest(req);
    if (!isAdmin && !isN8n) {
      return sendJson(res, 401, { ok: false, error: 'Requiere autenticación de administrador' });
    }

    const orderId = sanitizeId(pathname.split('/')[3] || '');
    if (!orderId) {
      return sendJson(res, 400, { ok: false, error: 'ID de pedido no especificado' });
    }

    try {
      const body = await readJsonBody(req);
      if (body.status) {
        const updated = repo.updateStatus(orderId, body.status, isN8n ? 'n8n' : 'admin', {
          name: body.driverName,
          phone: body.driverPhone
        });
        if (updated && !updated.error) {
          let dispatch = null;
          if (updated.status === 'ready' && updated.mode === 'delivery') {
            dispatch = await notifyN8nDispatch(updated);
          }
          return sendJson(res, 200, { ok: true, order: updated, dispatch });
        }
        if (updated?.error) return sendJson(res, 409, { ok: false, error: updated.error });
        return sendJson(res, 404, { ok: false, error: 'Pedido no encontrado' });
      }

      if (body.assignDriver) {
        if (!isN8n) return sendJson(res, 403, { ok: false, error: 'La asignación de motorizado requiere token de n8n.' });
        const updated = repo.assignDriver(orderId, body.driverName, body.driverPhone);
        if (updated && !updated.error) return sendJson(res, 200, { ok: true, order: updated });
        if (updated?.error) return sendJson(res, 409, { ok: false, error: updated.error });
        return sendJson(res, 404, { ok: false, error: 'Pedido no encontrado' });
      }

      if (body.verifyPayment) {
        if (!isAdmin) return sendJson(res, 403, { ok: false, error: 'La verificación de pago debe realizarla un administrador.' });
        const updated = repo.verifyPayment(orderId);
        if (updated) {
          return sendJson(res, 200, { ok: true, order: updated });
        }
        return sendJson(res, 404, { ok: false, error: 'Pedido no encontrado' });
      }

      return sendJson(res, 400, { ok: false, error: 'Acción no reconocida' });
    } catch (err) {
      return sendJson(res, 400, { ok: false, error: err.message });
    }
  }

  // --------------------------------------------------------------------------
  // API: Configuración Oficial del Negocio (Fuente Única de Verdad)
  // --------------------------------------------------------------------------
  if (pathname === '/api/config') {
    if (req.method === 'GET') {
      return sendJson(res, 200, configRepo.get());
    }

    if (req.method === 'PATCH' || req.method === 'POST') {
      const token = extractToken(req);
      if (!isValidAdminSession(token)) {
        return sendJson(res, 401, { ok: false, error: 'Requiere autenticación de administrador' });
      }

      try {
        const patch = await readJsonBody(req);
        const updated = configRepo.update(patch);
        return sendJson(res, 200, { ok: true, config: updated });
      } catch (e) {
        return sendJson(res, 400, { ok: false, error: e.message });
      }
    }
  }

  // --------------------------------------------------------------------------
  // API: Catálogo Maestro de Productos (Fuente Única de Verdad)
  // --------------------------------------------------------------------------
  if (pathname === '/api/catalog') {
    if (req.method === 'GET') {
      return sendJson(res, 200, catalogRepo.getAll());
    }

    if (req.method === 'POST') {
      const token = extractToken(req);
      if (!isValidAdminSession(token)) {
        return sendJson(res, 401, { ok: false, error: 'Requiere autenticación de administrador' });
      }

      try {
        const product = await readJsonBody(req);
        const saved = catalogRepo.save(product);
        return sendJson(res, 200, { ok: true, product: saved });
      } catch (e) {
        return sendJson(res, 400, { ok: false, error: e.message });
      }
    }
  }

  if (pathname.startsWith('/api/catalog/') && pathname.endsWith('/stock') && req.method === 'PATCH') {
    const token = extractToken(req);
    if (!isValidAdminSession(token)) {
      return sendJson(res, 401, { ok: false, error: 'Requiere autenticación de administrador' });
    }

    const prodId = pathname.split('/')[3];
    try {
      const body = await readJsonBody(req);
      const updated = catalogRepo.toggleStock(prodId, body.stock);
      if (updated) {
        return sendJson(res, 200, { ok: true, product: updated });
      }
      return sendJson(res, 404, { ok: false, error: 'Producto no encontrado' });
    } catch (e) {
      return sendJson(res, 400, { ok: false, error: e.message });
    }
  }

  if (pathname.startsWith('/api/catalog/') && req.method === 'DELETE') {
    const token = extractToken(req);
    if (!isValidAdminSession(token)) {
      return sendJson(res, 401, { ok: false, error: 'Requiere autenticación de administrador' });
    }

    const prodId = pathname.split('/')[3];
    const ok = catalogRepo.delete(prodId);
    return sendJson(res, ok ? 200 : 404, { ok });
  }

  // --------------------------------------------------------------------------
  // Servidor de Archivos Estáticos (app/) con protección contra Path Traversal
  // --------------------------------------------------------------------------
  if (pathname === '/' || pathname === '/index.html' || pathname === '/app' || pathname === '/mobile') {
    pathname = '/index.html';
  } else if (pathname === '/admin' || pathname === '/admin/') {
    pathname = '/admin.html';
  }

  // Resuelve la ruta canónica y verifica que no escape de APP_DIR
  const safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(APP_DIR, safePath);

  // Verificación estricta contra Path Traversal
  if (!filePath.startsWith(APP_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=UTF-8' });
    res.end('403 Acceso Denegado');
    return;
  }

  // Si es un directorio, buscar index.html
  try {
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
  } catch (e) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
    res.end(`404 No encontrado: ${pathname}`);
    return;
  }

  // Envío del archivo estático
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
      res.end(`404 No encontrado`);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': content.length,
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': ext === '.html' ? 'no-cache, must-revalidate' : 'public, max-age=3600'
    });
    res.end(content);
  });
});

// Inicio del servidor
const bindHost = BIND_ALL ? '0.0.0.0' : '127.0.0.1';
server.listen(PORT, bindHost, () => {
  const localIp = getLocalIp();
  console.log('======================================================');
  console.log('RETEQUEÑOS OS - SERVIDOR DE PRODUCCIÓN LOCAL');
  console.log('======================================================');
  console.log(`✓ Servidor activo en:    http://localhost:${PORT}`);
  console.log(`✓ Panel Administrador:   http://localhost:${PORT}/admin`);
  console.log(`✓ API REST Pedidos:      http://localhost:${PORT}/api/pedidos`);
  console.log(`✓ PIN de Administrador:  ${ADMIN_PIN}`);
  console.log(`✓ Persistencia en disco: ${DB_FILE}`);

  if (BIND_ALL && localIp) {
    console.log(`✓ Acceso desde celular:  http://${localIp}:${PORT} (WiFi local)`);
  } else if (!BIND_ALL) {
    console.log(`* Modo local estricto. Para abrir a la red WiFi usa: --lan`);
  }
  console.log('======================================================\n');
});
