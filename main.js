const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

console.log("Groq key cargada:", !!process.env.GROQ_API_KEY);

const { app, BrowserWindow, ipcMain, dialog, shell, Menu } = require('electron');
const { autoUpdater } = require('electron-updater');
const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');
const bcrypt = require('bcryptjs');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const crypto = require('crypto');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

if (!process.env.GROQ_API_KEY) console.error('⚠️ GROQ_API_KEY no está configurada — las funciones de IA fallarán.');
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) console.error('⚠️ SUPABASE_URL/SUPABASE_KEY no están configuradas.');

const openai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY || 'missing-groq-key',
    baseURL: "https://api.groq.com/openai/v1" // 🚨 Este es el truco de magia
});

const supabase = createClient(
    process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.SUPABASE_KEY || 'missing-supabase-key'
);

const DURACION_SESION_RECORDADA_DIAS = 30;
async function emitirTokenSesion(usuarioId) {
    const token = crypto.randomBytes(32).toString('hex');
    const expira = new Date(Date.now() + DURACION_SESION_RECORDADA_DIAS * 24 * 60 * 60 * 1000).toISOString();
    const { error } = await supabase.from('usuarios').update({ session_token: token, session_expira: expira }).eq('id', usuarioId);
    if (error) {
        console.error('No se pudo guardar el token de sesión recordada:', error.message);
        return null;
    }
    return token;
}

const fs = require('fs');
let devicesCache = null;

// Los modelos agregados por el usuario se guardan en userData (fuera de la carpeta
// de instalación) para que sobrevivan a actualizaciones y reinstalaciones del programa.
function rutaDevicesCacheUsuario() {
    return path.join(app.getPath('userData'), 'devices_cache.json');
}

function cargarDevicesCache() {
    try {
        const userPath = rutaDevicesCacheUsuario();
        const seedPath = path.join(__dirname, 'devices_cache.json');
        if (fs.existsSync(userPath)) {
            devicesCache = JSON.parse(fs.readFileSync(userPath, 'utf8'));
            console.log("✨ [Catálogo] Cargado desde datos de usuario. Marcas encontradas:", Object.keys(devicesCache).length);
        } else if (fs.existsSync(seedPath)) {
            devicesCache = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
            fs.writeFileSync(userPath, JSON.stringify(devicesCache, null, 2));
            console.log("✨ [Catálogo] Copiado del instalador a datos de usuario. Marcas encontradas:", Object.keys(devicesCache).length);
        } else {
            console.warn("⚠️ [Catálogo] No se encontró devices_cache.json en ninguna ruta.");
        }
    } catch (e) {
        console.error("❌ [Catálogo] Error al cargar:", e);
    }
}

// Copia las plantillas Excel de inventario (que vienen con el instalador, de solo
// lectura) a la carpeta de datos de usuario la primera vez, para que el cliente
// pueda abrirlas, llenarlas y guardarlas sin tocar la carpeta de instalación.
function prepararPlantillasInventario() {
    try {
        const origen = path.join(__dirname, 'plantillas_excel');
        const destino = path.join(app.getPath('userData'), 'Plantillas de Inventario');
        if (!fs.existsSync(destino)) fs.mkdirSync(destino, { recursive: true });
        if (fs.existsSync(origen)) {
            fs.readdirSync(origen).forEach(archivo => {
                const destinoArchivo = path.join(destino, archivo);
                if (!fs.existsSync(destinoArchivo)) {
                    fs.copyFileSync(path.join(origen, archivo), destinoArchivo);
                }
            });
        }
    } catch (e) {
        console.error('No se pudieron preparar las plantillas de inventario:', e.message);
    }
}

let mainWindow = null;
let empresaActual = null;
let rolActual = null;
let usuarioActual = null;
const otpMemoryCache = new Map(); // Fallback en memoria si faltan columnas de base de datos

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        icon: path.join(__dirname, 'assets', 'icon.png'),
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: false, // Se mantiene en false por seguridad
            contextIsolation: true, // Se mantiene en true por seguridad
            preload: path.join(__dirname, 'preload.js') // 🚨 AÑADE ESTA LÍNEA AQUÍ
        }
    });

    mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
    Menu.setApplicationMenu(null);
    cargarDevicesCache();
    prepararPlantillasInventario();
    createWindow();
    
    // Configuración de actualizaciones automáticas.
    // Usamos checkForUpdates() (sin "AndNotify") a propósito: ese método extra
    // dispara además una notificación nativa de Windows por su cuenta, fuera de
    // nuestro control, que se sentía como un aviso repetido/intrusivo. Con esto
    // solo queda nuestro banner propio dentro de la app, que sí refleja la versión real.
    autoUpdater.checkForUpdates();

    autoUpdater.on('update-available', (info) => {
        if (mainWindow) mainWindow.webContents.send('actualizacion-disponible', { version: info.version });
    });

    autoUpdater.on('update-downloaded', (info) => {
        if (mainWindow) mainWindow.webContents.send('actualizacion-lista', { version: info.version });
    });

    // Ya está en la última versión: avisar al renderer para que oculte el banner (defensivo).
    autoUpdater.on('update-not-available', () => {
        if (mainWindow) mainWindow.webContents.send('actualizacion-no-disponible', {});
    });

    autoUpdater.on('error', (err) => {
        console.warn('Error al buscar actualizaciones:', err.message);
    });

    // Exponer versión al frontend
    ipcMain.on('pedir-version', (event) => {
        event.reply('recibir-version', app.getVersion());
    });

    // Abrir la página de descarga en el navegador (fallback manual, usado por el aviso de
    // actualización cuando TODAVÍA no se terminó de descargar la actualización en segundo plano).
    // Va directo a /api/download (redirige al .exe del último release), no a la portada, para
    // no obligar al usuario a buscar el botón de descarga él mismo.
    ipcMain.on('abrir-pagina-descarga', () => {
        shell.openExternal('https://blackhouse-os-web.vercel.app/api/download');
    });

    // Reinstalar la actualización que electron-updater YA descargó en segundo plano (evento
    // 'update-downloaded'). Antes el único botón del banner mandaba al usuario al navegador a
    // descargar el instalador a mano, sin usar nunca esta descarga silenciosa ni quitAndInstall()
    // — por eso la app vieja se quedaba abierta y el aviso de actualización nunca desaparecía de
    // verdad. Este handler cierra la app e instala la versión ya descargada, y al reabrir queda
    // en la versión nueva de una vez.
    ipcMain.on('instalar-actualizacion-ahora', () => {
        autoUpdater.quitAndInstall();
    });

    // === CREAR CARPETAS FIRMWARE Y DUMP AL INICIAR (en userData: sobreviven actualizaciones) ===
    try {
        const firmwarePath = path.join(app.getPath('userData'), 'Firmware');
        const dumpPath = path.join(app.getPath('userData'), 'Dump');
        if (!fs.existsSync(firmwarePath)) {
            fs.mkdirSync(firmwarePath, { recursive: true });
            console.log('📁 [Carpeta] Firmware/ creada en:', firmwarePath);
        }
        if (!fs.existsSync(dumpPath)) {
            fs.mkdirSync(dumpPath, { recursive: true });
            console.log('📁 [Carpeta] Dump/ creada en:', dumpPath);
        }
    } catch (e) {
        console.error('No se pudieron crear las carpetas Firmware/Dump:', e.message);
    }
});

// === ABRIR CARPETAS FIRMWARE / DUMP ===
ipcMain.on('abrir-carpeta', (event, tipo) => {
    const carpeta = tipo === 'firmware'
        ? path.join(app.getPath('userData'), 'Firmware')
        : path.join(app.getPath('userData'), 'Dump');
    if (!fs.existsSync(carpeta)) fs.mkdirSync(carpeta, { recursive: true });
    shell.openPath(carpeta);
});

// === ABRIR CARPETA DE PLANTILLAS DE INVENTARIO (Excel para carga masiva) ===
ipcMain.on('abrir-carpeta-plantillas', () => {
    const carpeta = path.join(app.getPath('userData'), 'Plantillas de Inventario');
    prepararPlantillasInventario();
    shell.openPath(carpeta);
});

// === OBTENER MARCAS Y MODELOS DE DISPOSITIVOS ===
ipcMain.on('obtener-marcas-modelos', (event) => {
    event.reply('marcas-modelos-respuesta', devicesCache || {});
});

// === AGREGAR MODELO NUEVO AL CATÁLOGO (cuando no existe uno que el usuario necesita) ===
ipcMain.on('agregar-modelo-nuevo', (event, { marca, modelo }) => {
    try {
        if (!devicesCache) devicesCache = {};
        if (!devicesCache[marca]) devicesCache[marca] = [];
        if (!devicesCache[marca].some(m => m.toLowerCase() === modelo.toLowerCase())) {
            devicesCache[marca].push(modelo);
            devicesCache[marca].sort();
            fs.writeFileSync(rutaDevicesCacheUsuario(), JSON.stringify(devicesCache, null, 2));
        }
        event.reply('marcas-modelos-respuesta', devicesCache);
    } catch (e) {
        console.warn('No se pudo guardar el modelo nuevo:', e.message);
    }
});

// === 2. LOGIN INTELIGENTE (FILTRA POR EMPRESA Y FECHA) ===
ipcMain.on('iniciar-sesion', async (event, data) => {
    try {
        console.log("=== INICIO DE LOGIN ===");
        console.log("Intentando entrar con usuario:", data.usuario);

        // 1. Buscamos al usuario
        console.log("Paso 1: Buscando en tabla usuarios...");
        const { data: users, error } = await supabase
            .from('usuarios')
            .select('*')
            .eq('usuario', data.usuario)
            .eq('estado', 'activo')
            .single();

        if (error && error.code !== 'PGRST116') {
            // Error real de conexion/consulta (red, DNS, Supabase caido, etc.), no un simple "no existe".
            console.error('Login query error - fallo de conexion (Paso 1):', error);
            return event.reply('login-respuesta', { success: false, msg: `🌐 No se pudo conectar con el servidor. Verifica tu conexión a internet o la fecha/hora del sistema. (${error.message || error.code || 'error desconocido'})` });
        }

        if (error || !users) {
            console.error('Login query error - usuario no encontrado (Paso 1):', error);
            return event.reply('login-respuesta', { success: false, msg: 'Usuario no encontrado o inactivo' });
        }
        
        console.log("Usuario encontrado:", users.usuario, "Empresa ID:", users.empresa_id);

        // 2. Validamos la contraseña
        console.log("Paso 2: Validando contraseña...");
        const eraTextoPlano = data.password === users.password;
        const contrasenaValida = eraTextoPlano || await bcrypt.compare(data.password, users.password).catch(() => false);

        if (!contrasenaValida) {
            console.log("Error: Contraseña incorrecta");
            return event.reply('login-respuesta', { success: false, msg: 'Contraseña incorrecta' });
        }

        console.log("Contraseña correcta.");

        // Migración transparente: si la contraseña seguía en texto plano, la hasheamos ahora
        if (eraTextoPlano) {
            const hashMigrado = await bcrypt.hash(data.password, 10);
            await supabase.from('usuarios').update({ password: hashMigrado }).eq('id', users.id);
        }

        // 3. Verificamos el estado de la suscripción de su empresa
        console.log("Paso 3: Verificando empresa", users.empresa_id);
        const { data: empresaData, error: errEmpresa } = await supabase
            .from('empresas')
            .select('fecha_de_vencimiento')
            .eq('id', users.empresa_id)
            .single();

        if (errEmpresa || !empresaData) {
            console.error("Error al verificar empresa:", errEmpresa);
            return event.reply('login-respuesta', { success: false, msg: 'Error al verificar la licencia del taller.' });
        }

        console.log("Empresa verificada. Fecha de vencimiento:", empresaData.fecha_de_vencimiento);

        // 4. EL BLOQUEO: Comparamos las fechas
        if (users.empresa_id !== 1 && empresaData.fecha_de_vencimiento) {
            console.log("Paso 4: Validando fechas...");
            const fechaVencimiento = new Date(empresaData.fecha_de_vencimiento);
            const hoy = new Date();

            if (hoy > fechaVencimiento) {
                console.log("Error: Licencia vencida");
                return event.reply('login-respuesta', {
                    success: false,
                    msg: `⛔ Licencia Vencida. Tu acceso caducó el ${empresaData.fecha_de_vencimiento}. Escríbenos al WhatsApp para renovar.`
                });
            }
        }

       // 5. VERIFICACIÓN DE IP (desactivada: la licencia ya no se ata a una ubicación/red fija)

        console.log("=== LOGIN EXITOSO ===");
        
        // Establecer las variables de estado global de la sesión en el main.js
        empresaActual = users.empresa_id;
        rolActual = users.rol;
        usuarioActual = users.usuario;

        let sessionToken = null;
        if (data.recordar) {
            sessionToken = await emitirTokenSesion(users.id);
        }

        // 6. Login Directo
        event.reply('login-respuesta', {
            success: true,
            usuario: users.usuario,
            rol: users.rol,
            empresa_id: users.empresa_id,
            nombre_completo: users.nombre_completo || '',
            nickname: users.nickname || users.usuario,
            avatar: users.avatar || '',
            sessionToken
        });

    } catch (err) {
        console.error("Error fatal en login:", err);
        event.reply('login-respuesta', { success: false, msg: 'Error de conexión al servidor' });
    }
});

// === 2.0B LOGIN AUTOMATICO CON TOKEN DE SESION RECORDADA ===
ipcMain.on('iniciar-sesion-token', async (event, data) => {
    try {
        const token = data && data.token;
        if (!token) {
            return event.reply('login-respuesta', { success: false, msg: 'Sin token' });
        }

        const { data: users, error } = await supabase
            .from('usuarios')
            .select('*')
            .eq('session_token', token)
            .eq('estado', 'activo')
            .single();

        if (error || !users) {
            return event.reply('login-respuesta', { success: false, msg: 'Sesión guardada no válida' });
        }

        if (!users.session_expira || new Date() > new Date(users.session_expira)) {
            await supabase.from('usuarios').update({ session_token: null, session_expira: null }).eq('id', users.id);
            return event.reply('login-respuesta', { success: false, msg: 'Sesión guardada expirada' });
        }

        // Verificamos vencimiento de licencia de la empresa (mismo criterio que el login normal)
        const { data: empresaData, error: errEmpresa } = await supabase
            .from('empresas')
            .select('fecha_de_vencimiento')
            .eq('id', users.empresa_id)
            .single();

        if (errEmpresa || !empresaData) {
            return event.reply('login-respuesta', { success: false, msg: 'Error al verificar la licencia del taller.' });
        }

        if (users.empresa_id !== 1 && empresaData.fecha_de_vencimiento) {
            if (new Date() > new Date(empresaData.fecha_de_vencimiento)) {
                return event.reply('login-respuesta', {
                    success: false,
                    msg: `⛔ Licencia Vencida. Tu acceso caducó el ${empresaData.fecha_de_vencimiento}. Escríbenos al WhatsApp para renovar.`
                });
            }
        }

        empresaActual = users.empresa_id;
        rolActual = users.rol;
        usuarioActual = users.usuario;

        // Rotamos el token en cada login automático (mitiga robo/reuso del token guardado)
        const nuevoToken = await emitirTokenSesion(users.id);

        event.reply('login-respuesta', {
            success: true,
            usuario: users.usuario,
            rol: users.rol,
            empresa_id: users.empresa_id,
            nombre_completo: users.nombre_completo || '',
            nickname: users.nickname || users.usuario,
            avatar: users.avatar || '',
            sessionToken: nuevoToken
        });
    } catch (err) {
        console.error('Error en login por token:', err);
        event.reply('login-respuesta', { success: false, msg: 'Error de conexión al servidor' });
    }
});

// === 2.0C CERRAR SESIÓN RECORDADA (invalida el token guardado) ===
ipcMain.on('cerrar-sesion-token', async (event, data) => {
    try {
        const token = data && data.token;
        if (token) {
            await supabase.from('usuarios').update({ session_token: null, session_expira: null }).eq('session_token', token);
        }
    } catch (e) {
        console.warn('No se pudo invalidar el token de sesión:', e.message);
    }
    // location.reload() en el renderer NO reinicia main.js (sigue siendo el mismo proceso Electron
    // en ejecución) — sin esto, empresaActual/rolActual se quedaban apuntando al usuario anterior
    // hasta el próximo login exitoso, y cualquier handler que se disparara mientras tanto (incluido
    // un auto-login por token que no se haya limpiado a tiempo en el renderer) seguía operando con
    // los datos de la empresa/rol de la sesión que se acababa de cerrar.
    empresaActual = null;
    rolActual = null;
    usuarioActual = null;
});

// === 2.1 VERIFICACIÓN DE 2FA (SEGUNDO PASO DE ACCESO) ===
ipcMain.on('verificar-2fa', async (event, data) => {
    try {
        const { usuario, codigo } = data;
        if (!usuario || !codigo) {
            return event.reply('resultado-2fa', { success: false, msg: 'Datos incompletos' });
        }

        let hashedOtp = null;
        let otpExpiry = null;
        let userPayload = null;

        // 1. Intentamos buscar en la Base de Datos
        try {
            const { data: dbUser, error: dbErr } = await supabase
                .from('usuarios')
                .select('*')
                .eq('usuario', usuario)
                .single();

            if (!dbErr && dbUser && dbUser.otp_hash) {
                hashedOtp = dbUser.otp_hash;
                otpExpiry = dbUser.otp_expiry;
                userPayload = {
                    id: dbUser.id,
                    usuario: dbUser.usuario,
                    rol: dbUser.rol,
                    empresa_id: dbUser.empresa_id,
                    nombre_completo: dbUser.nombre_completo || '',
                    nickname: dbUser.nickname || dbUser.usuario,
                    avatar: dbUser.avatar || ''
                };
            }
        } catch (dbEx) {
            // Ignoramos errores si las columnas no existen
        }

        // 2. Si no se encontró en la BD, buscamos en el fallback en memoria
        if (!hashedOtp && otpMemoryCache.has(usuario)) {
            const cached = otpMemoryCache.get(usuario);
            hashedOtp = cached.otp_hash;
            otpExpiry = cached.otp_expiry;
            userPayload = cached.userPayload;
        }

        if (!hashedOtp || !otpExpiry) {
            return event.reply('resultado-2fa', { success: false, msg: 'Código no solicitado o expirado. Inicia sesión nuevamente.' });
        }

        // 3. Verificamos expiración
        if (new Date() > new Date(otpExpiry)) {
            otpMemoryCache.delete(usuario);
            try {
                await supabase.from('usuarios').update({ otp_hash: null, otp_expiry: null }).eq('usuario', usuario);
            } catch (e) {}
            return event.reply('resultado-2fa', { success: false, msg: 'El código ha expirado (límite 5 minutos).' });
        }

        // 4. Comparamos el código ingresado con el hash
        const match = await bcrypt.compare(codigo, hashedOtp).catch(() => false);
        if (!match) {
            return event.reply('resultado-2fa', { success: false, msg: 'Código de seguridad incorrecto' });
        }

        // Limpiamos el OTP en la BD / memoria tras un uso exitoso
        otpMemoryCache.delete(usuario);
        try {
            await supabase.from('usuarios').update({ otp_hash: null, otp_expiry: null }).eq('usuario', usuario);
        } catch (e) {}

        // Establecemos el estado de la sesión actual en el main.js
        empresaActual = userPayload.empresa_id;
        rolActual = userPayload.rol;
        usuarioActual = userPayload.usuario;

        console.log(`🔒 [2FA] Verificación exitosa para el usuario: ${usuario}`);

        let sessionToken = null;
        if (data.recordar && userPayload.id) {
            sessionToken = await emitirTokenSesion(userPayload.id);
        }

        // Enviamos el payload final al renderer
        event.reply('resultado-2fa', {
            success: true,
            ...userPayload,
            sessionToken
        });

    } catch (err) {
        console.error("Error fatal en verificación 2FA:", err);
        event.reply('resultado-2fa', { success: false, msg: 'Error de conexión al servidor' });
    }
});



// === 3. CLIENTES (SOLO DE MI EMPRESA) ===
ipcMain.on('guardar-cliente', async (event, cliente) => {
    try {
        cliente.empresa_id = empresaActual;
        cliente.tecnico_id = usuarioActual;
        const { error } = await supabase.from('clientes').insert([cliente]);
        if (error) throw error;
        event.reply('resultado-cliente', { success: true, msg: 'Cliente guardado' });
    } catch (err) { event.reply('resultado-cliente', { success: false, msg: 'Error al guardar' }); }
});

ipcMain.on('obtener-clientes', async (event) => {
    let query = supabase.from('clientes')
        .select('*')
        .eq('empresa_id', empresaActual);
        
    if (rolActual === 'tecnico') {
        query = query.eq('tecnico_id', usuarioActual);
    }
    
    const { data } = await query.order('id', { ascending: false });
    event.reply('lista-de-clientes', data || []);
});

// Búsqueda rápida de clientes para autocompletar la Recepción (misma visibilidad por rol que
// obtener-clientes: el técnico solo encuentra sus propios clientes, igual que en su vista).
ipcMain.on('buscar-clientes', async (event, texto) => {
    try {
        const t = String(texto || '').trim().replace(/[,()%]/g, '');
        if (t.length < 2) return event.reply('clientes-sugeridos', []);
        let q = supabase.from('clientes')
            .select('id, nombre, telefono, email')
            .eq('empresa_id', empresaActual)
            .or(`nombre.ilike.%${t}%,telefono.ilike.%${t}%`)
            .limit(8);
        if (rolActual === 'tecnico') q = q.eq('tecnico_id', usuarioActual);
        const { data } = await q;
        event.reply('clientes-sugeridos', data || []);
    } catch (e) {
        event.reply('clientes-sugeridos', []);
    }
});

// Sugerir repuestos EN STOCK compatibles con el modelo del equipo que se está recibiendo.
// Matching de solo lectura (no toca nada): por modelo_compatible (variantes separadas por "/")
// o por tokens del modelo contenidos en el nombre del producto. Reusa normalizarModeloCompat.
ipcMain.on('sugerir-stock-modelo', async (event, modelo) => {
    try {
        const norm = normalizarModeloCompat(modelo);
        if (norm.length < 3) return event.reply('stock-sugerido-modelo', []);
        const { data: prods } = await supabase.from('productos')
            .select('id, nombre, categoria, precio, stock, modelo_compatible')
            .eq('empresa_id', empresaActual)
            .gt('stock', 0);
        const tokens = norm.split(' ').filter(t => t.length > 1);
        const coincide = (p) => {
            const compat = normalizarModeloCompat(p.modelo_compatible);
            if (compat) {
                const variantes = compat.split('/').map(v => v.trim()).filter(Boolean);
                if (variantes.some(v => norm.includes(v) || v.includes(norm))) return true;
            }
            const nombreN = normalizarModeloCompat(p.nombre);
            return tokens.length > 0 && tokens.every(t => nombreN.includes(t));
        };
        const matches = (prods || []).filter(coincide).slice(0, 6)
            .map(p => ({ id: p.id, nombre: p.nombre, categoria: p.categoria, precio: p.precio, stock: p.stock }));
        event.reply('stock-sugerido-modelo', matches);
    } catch (e) {
        event.reply('stock-sugerido-modelo', []);
    }
});

// === PROVEEDORES (PERSISTENCIA SEGURA EN SUPABASE + CONTROL DE FALLOS) ===
ipcMain.on('guardar-proveedor-db', async (event, prov) => {
    try {
        await supabase.from('proveedores').insert([{
            nombre: prov.nombre,
            tel: prov.tel,
            email: prov.email,
            dir: prov.dir,
            cat: prov.cat,
            foto: prov.foto,
            empresa_id: empresaActual
        }]);
    } catch (e) {
        console.warn("Tabla 'proveedores' no disponible en base de datos. Guardado local activo.");
    }
});

ipcMain.on('obtener-proveedores-db', async (event) => {
    try {
        const { data, error } = await supabase.from('proveedores')
            .select('*')
            .eq('empresa_id', empresaActual)
            .order('id', { ascending: false });
        if (error) throw error;
        event.reply('proveedores-db-respuesta', data || []);
    } catch (e) {
        console.warn("Tabla 'proveedores' no disponible. Usando LocalStorage.");
        event.reply('proveedores-db-respuesta', []);
    }
});

ipcMain.on('eliminar-proveedor-db', async (event, data) => {
    try {
        await supabase.from('proveedores').delete().eq('id', data.id);
    } catch (e) {
        console.warn("Error al eliminar proveedor de la BD:", e.message);
    }
});

// === 4. INVENTARIO (SOLO DE MI EMPRESA) ===
ipcMain.on('nuevo-producto-sql', async (event, prod) => {
    try {
        const insertData = {
            nombre: prod.nombre,
            categoria: prod.categoria,
            subcategoria: prod.subcategoria || null,
            costo: rolActual === 'dueno' ? (parseFloat(prod.costo) || 0) : 0,
            precio: parseFloat(prod.precio) || 0,
            stock: parseInt(prod.stock) || 0,
            proveedor: prod.proveedor || '',
            empresa_id: empresaActual
        };
        // Agregar SKU si viene
        if (prod.sku) insertData.sku = prod.sku;
        // Agregar modelo compatible si viene (Pantallas/Micas vinculadas a un modelo del selector)
        if (prod.modelo_compatible) insertData.modelo_compatible = prod.modelo_compatible;
        // Si el usuario aceptó la sugerencia de vincular el producto a un grupo de compatibilidad existente
        if (prod.grupo_compatibilidad_id) insertData.grupo_compatibilidad_id = prod.grupo_compatibilidad_id;

        const { error } = await supabase.from('productos').insert([insertData]);
        if (error) throw error;
        event.reply('producto-guardado');
    } catch (e) {
        console.error(e);
        event.reply('producto-guardado', { success: false, msg: e.message });
    }
});

ipcMain.on('obtener-productos', async (event) => {
    const { data } = await supabase.from('productos')
        .select('*')
        .eq('empresa_id', empresaActual)
        .order('id', { ascending: false });
    event.reply('lista-de-productos', data || []);
});

// Elimina un producto del inventario (solo el dueño). No hay FKs que referencien productos.id
// (el historial de stock se guarda por SKU, no por id), así que un borrado directo es seguro y
// no deja registros huérfanos. Pensado sobre todo para limpiar duplicados: productos que ya
// existían por separado y que, al agruparlos en un grupo de compatibilidad, quedaron redundantes
// (el grupo no fusiona el stock de varias filas en una sola automáticamente).
ipcMain.on('eliminar-producto', async (event, productoId) => {
    try {
        if (rolActual !== 'dueno') {
            return event.reply('producto-eliminado', { success: false, msg: 'Solo el dueño puede eliminar productos.' });
        }
        const { error } = await supabase.from('productos')
            .delete()
            .eq('id', productoId)
            .eq('empresa_id', empresaActual);
        if (error) throw error;
        event.reply('producto-eliminado', { success: true, id: productoId });
    } catch (e) {
        console.error('Error eliminando producto:', e.message);
        event.reply('producto-eliminado', { success: false, msg: e.message });
    }
});

// === 4D. GRUPOS DE COMPATIBILIDAD DE MODELOS (micas/pantallas que comparten pieza y stock) ===
const normalizarModeloCompat = (txt) => String(txt || '').replace(/\s+/g, ' ').trim().toUpperCase();

ipcMain.on('obtener-grupos-compatibilidad', async (event) => {
    try {
        const { data: grupos, error: errGrupos } = await supabase.from('grupos_compatibilidad')
            .select('*')
            .eq('empresa_id', empresaActual)
            .order('id', { ascending: false });
        if (errGrupos) throw errGrupos;

        const grupoIds = (grupos || []).map(g => g.id);
        let miembros = [];
        let productosVinculados = [];

        if (grupoIds.length > 0) {
            const { data: m, error: errM } = await supabase.from('grupos_compatibilidad_modelos')
                .select('*')
                .in('grupo_id', grupoIds);
            if (errM) throw errM;
            miembros = m || [];

            const { data: p, error: errP } = await supabase.from('productos')
                .select('id, sku, nombre, stock, categoria, subcategoria, grupo_compatibilidad_id')
                .eq('empresa_id', empresaActual)
                .in('grupo_compatibilidad_id', grupoIds);
            if (errP) throw errP;
            productosVinculados = p || [];
        }

        const resultado = (grupos || []).map(g => ({
            ...g,
            miembros: miembros.filter(m => m.grupo_id === g.id),
            productos: productosVinculados.filter(p => p.grupo_compatibilidad_id === g.id)
        }));

        event.reply('lista-grupos-compatibilidad', resultado);
    } catch (e) {
        console.error('Error obteniendo grupos de compatibilidad:', e.message);
        event.reply('lista-grupos-compatibilidad', []);
    }
});

// Crea un grupo nuevo con sus modelos miembro. miembros: [{marca, modelo}, ...]
ipcMain.on('crear-grupo-compatibilidad', async (event, payload) => {
    try {
        const { tipo_pieza, etiqueta, miembros } = payload || {};
        if (!tipo_pieza || !['mica', 'pantalla', 'general'].includes(tipo_pieza)) {
            throw new Error('Tipo de pieza inválido.');
        }
        if (!etiqueta || !Array.isArray(miembros) || miembros.length === 0) {
            throw new Error('El grupo necesita una etiqueta y al menos un modelo.');
        }

        const { data: grupoCreado, error: errGrupo } = await supabase.from('grupos_compatibilidad')
            .insert([{ empresa_id: empresaActual, tipo_pieza, etiqueta }])
            .select('id')
            .single();
        if (errGrupo) throw errGrupo;

        const filasMiembros = miembros.map(m => ({
            grupo_id: grupoCreado.id,
            marca: m.marca || null,
            modelo: m.modelo,
            modelo_normalizado: normalizarModeloCompat(m.modelo)
        }));

        const { error: errMiembros } = await supabase.from('grupos_compatibilidad_modelos').insert(filasMiembros);
        if (errMiembros) throw errMiembros;

        // Auto-vincular productos existentes sin grupo cuyo modelo_compatible (texto legacy) coincide
        // EXACTO (normalizado) con la etiqueta del grupo recién creado. Esto es lo que permite que,
        // por ejemplo, al crear manualmente el grupo "Honor X7 / Honor X7a" (uno de los 5 casos que no
        // se pudieron migrar automáticamente por no existir en el catálogo), el producto MICA-0050 que
        // ya tenía ese texto exacto en modelo_compatible quede vinculado sin tocarlo a mano.
        // Solo coincidencia EXACTA (no difusa) — el matching aproximado es tarea de la Fase 3 (Excel).
        let vinculadosAuto = 0;
        const categoriaEsperada = tipo_pieza === 'mica' ? 'Micas' : (tipo_pieza === 'pantalla' ? 'Pantallas' : null);
        let queryCandidatos = supabase.from('productos')
            .select('id, modelo_compatible')
            .eq('empresa_id', empresaActual)
            .is('grupo_compatibilidad_id', null);
        if (categoriaEsperada) queryCandidatos = queryCandidatos.eq('categoria', categoriaEsperada);
        const { data: candidatos } = await queryCandidatos;

        const etiquetaNorm = normalizarModeloCompat(etiqueta);
        const idsAutoVincular = (candidatos || [])
            .filter(p => p.modelo_compatible && normalizarModeloCompat(p.modelo_compatible) === etiquetaNorm)
            .map(p => p.id);

        if (idsAutoVincular.length > 0) {
            const { error: errAuto } = await supabase.from('productos')
                .update({ grupo_compatibilidad_id: grupoCreado.id })
                .in('id', idsAutoVincular);
            if (!errAuto) vinculadosAuto = idsAutoVincular.length;
        }

        event.reply('grupo-compatibilidad-guardado', { success: true, id: grupoCreado.id, vinculadosAuto });
    } catch (e) {
        console.error('Error creando grupo de compatibilidad:', e.message);
        event.reply('grupo-compatibilidad-guardado', { success: false, msg: e.message });
    }
});

// Actualiza etiqueta/tipo_pieza y reemplaza la lista completa de modelos miembro de un grupo existente.
ipcMain.on('actualizar-grupo-compatibilidad', async (event, payload) => {
    try {
        const { grupo_id, tipo_pieza, etiqueta, miembros } = payload || {};
        if (!grupo_id) throw new Error('Falta el grupo a actualizar.');
        if (!tipo_pieza || !['mica', 'pantalla', 'general'].includes(tipo_pieza)) {
            throw new Error('Tipo de pieza inválido.');
        }
        if (!etiqueta || !Array.isArray(miembros) || miembros.length === 0) {
            throw new Error('El grupo necesita una etiqueta y al menos un modelo.');
        }

        const { error: errUpdate } = await supabase.from('grupos_compatibilidad')
            .update({ tipo_pieza, etiqueta })
            .eq('id', grupo_id)
            .eq('empresa_id', empresaActual);
        if (errUpdate) throw errUpdate;

        // Reemplazo total de miembros: más simple y predecible que un diff incremental
        const { error: errDelete } = await supabase.from('grupos_compatibilidad_modelos')
            .delete()
            .eq('grupo_id', grupo_id);
        if (errDelete) throw errDelete;

        const filasMiembros = miembros.map(m => ({
            grupo_id,
            marca: m.marca || null,
            modelo: m.modelo,
            modelo_normalizado: normalizarModeloCompat(m.modelo)
        }));
        const { error: errInsert } = await supabase.from('grupos_compatibilidad_modelos').insert(filasMiembros);
        if (errInsert) throw errInsert;

        // Mantener sincronizado el texto modelo_compatible de los productos ya vinculados a este grupo
        await supabase.from('productos')
            .update({ modelo_compatible: etiqueta })
            .eq('grupo_compatibilidad_id', grupo_id)
            .eq('empresa_id', empresaActual);

        event.reply('grupo-compatibilidad-guardado', { success: true, id: grupo_id });
    } catch (e) {
        console.error('Error actualizando grupo de compatibilidad:', e.message);
        event.reply('grupo-compatibilidad-guardado', { success: false, msg: e.message });
    }
});

// Elimina un grupo. Los miembros se borran en cascada (FK ON DELETE CASCADE) y los productos
// vinculados quedan con grupo_compatibilidad_id = NULL automáticamente (FK ON DELETE SET NULL).
ipcMain.on('eliminar-grupo-compatibilidad', async (event, grupoId) => {
    try {
        const { error } = await supabase.from('grupos_compatibilidad')
            .delete()
            .eq('id', grupoId)
            .eq('empresa_id', empresaActual);
        if (error) throw error;
        event.reply('grupo-compatibilidad-eliminado', { success: true, id: grupoId });
    } catch (e) {
        console.error('Error eliminando grupo de compatibilidad:', e.message);
        event.reply('grupo-compatibilidad-eliminado', { success: false, msg: e.message });
    }
});

// Vincula un producto YA EXISTENTE a un grupo de compatibilidad (usado desde la pantalla de
// Compatibilidades para corregir productos antiguos que no se vincularon al crearse).
ipcMain.on('vincular-producto-a-grupo', async (event, { producto_id, grupo_id }) => {
    try {
        const { data: grupo, error: errGrupo } = await supabase.from('grupos_compatibilidad')
            .select('etiqueta')
            .eq('id', grupo_id)
            .eq('empresa_id', empresaActual)
            .single();
        if (errGrupo) throw errGrupo;

        const { error } = await supabase.from('productos')
            .update({ grupo_compatibilidad_id: grupo_id, modelo_compatible: grupo.etiqueta })
            .eq('id', producto_id)
            .eq('empresa_id', empresaActual);
        if (error) throw error;

        event.reply('producto-vinculado-a-grupo', { success: true });
    } catch (e) {
        console.error('Error vinculando producto a grupo:', e.message);
        event.reply('producto-vinculado-a-grupo', { success: false, msg: e.message });
    }
});

// === 4A. SUBCATEGORÍAS PERSONALIZADAS (editables por el usuario, ej. tipos de Micas) ===
ipcMain.on('obtener-subcategorias-custom', async (event) => {
    try {
        const { data } = await supabase.from('subcategorias_personalizadas')
            .select('categoria, nombre')
            .eq('empresa_id', String(empresaActual));
        const agrupado = {};
        (data || []).forEach(row => {
            if (!agrupado[row.categoria]) agrupado[row.categoria] = [];
            agrupado[row.categoria].push(row.nombre);
        });
        event.reply('subcategorias-custom-lista', agrupado);
    } catch (e) {
        console.warn('No se pudieron cargar subcategorías personalizadas:', e.message);
        event.reply('subcategorias-custom-lista', {});
    }
});

ipcMain.on('agregar-subcategoria-custom', async (event, payload) => {
    try {
        await supabase.from('subcategorias_personalizadas').insert([{
            empresa_id: String(empresaActual),
            categoria: payload.categoria,
            nombre: payload.nombre
        }]);
    } catch (e) {
        console.warn('No se pudo guardar la subcategoría personalizada (puede que ya exista):', e.message);
    }
});

// === 4B. IMPORTACIÓN DESDE EXCEL - PREVIEW ===
ipcMain.on('preview-excel-inventario', async (event, payload) => {
    try {
        const productos = payload.items || [];
        // Obtener todos los productos actuales de la empresa
        const { data: productosDB } = await supabase.from('productos')
            .select('*')
            .eq('empresa_id', empresaActual);

        const existentes = productosDB || [];
        const items = [];
        const errores = [];

        // === TERCERA VÍA DE MATCHING: por grupo de compatibilidad ===
        // Si el modelo importado (columna "Modelo Compatible" del Excel) coincide con un modelo
        // miembro de un grupo de compatibilidad ya existente, y ese grupo ya tiene un producto
        // vinculado de la MISMA categoría+subcategoría, se ofrece sumar el stock ahí en vez de
        // crear un producto duplicado (ej: fila "Note 10s" reconoce el grupo "Note 11 / Note 10s").
        // Esto es ADICIONAL al matching por SKU y por nombre+categoría de más abajo, no lo reemplaza.
        const { data: gruposEmpresa } = await supabase.from('grupos_compatibilidad')
            .select('id')
            .eq('empresa_id', empresaActual);
        const grupoIdsEmpresa = (gruposEmpresa || []).map(g => g.id);

        let miembrosCompat = [];
        if (grupoIdsEmpresa.length > 0) {
            const { data: miembrosData } = await supabase.from('grupos_compatibilidad_modelos')
                .select('grupo_id, modelo_normalizado')
                .in('grupo_id', grupoIdsEmpresa);
            miembrosCompat = miembrosData || [];
        }
        // Productos que ya están vinculados a algún grupo (candidatos a recibir el stock importado)
        const productosConGrupo = existentes.filter(e => e.grupo_compatibilidad_id);

        // === LOGICA DE SUBCATEGORIAS PARA EXCEL ===
        const SUBCATEGORIAS = {
            'repuestos': [
                'Batería', 'Flex de Carga', 'Flex de Volumen/Encendido', 'Placa de Carga (conector)',
                'Flex de Huella Dactilar', 'Cámara Frontal', 'Cámara Trasera', 'Altavoz (Parlante)',
                'Auricular (altavoz de llamada)', 'Micrófono', 'Vibrador (motor)', 'Antena/Módulo de Señal',
                'Conector de Audífonos', 'Bandeja SIM', 'Botón de Encendido/Home', 'Otro'
            ],
            'repuestos de celulares': [
                'Batería', 'Flex de Carga', 'Flex de Volumen/Encendido', 'Placa de Carga (conector)',
                'Flex de Huella Dactilar', 'Cámara Frontal', 'Cámara Trasera', 'Altavoz (Parlante)',
                'Auricular (altavoz de llamada)', 'Micrófono', 'Vibrador (motor)', 'Antena/Módulo de Señal',
                'Conector de Audífonos', 'Bandeja SIM', 'Botón de Encendido/Home', 'Otro'
            ],
            'accesorios': [
                'Auriculares (alámbricos)', 'Auriculares Bluetooth', 'Cargadores (pared/auto)',
                'Cables (USB-C/Lightning/Micro USB)', 'Forros/Case', 'Stickers/Calcomanías',
                'Soportes/Holders', 'Power Bank', 'Memorias/USB', 'Parlantes Bluetooth',
                'Popsockets/Anillos', 'Protector de Cámara', 'Otro'
            ],
            'micas': [
                'Vidrio 88D', 'Cerámica Matte', 'Cerámica Anti Espía', 'Vidrio Anti Espía', 'Vidrio de Tablet',
                'Vidrio OG', 'Cerámica Brillosa', 'Flyer Sin Bordes', 'Flyer Super Gruesa Original',
                'OG Sin Bordes', '21D', 'Otro'
            ]
        };

        // Fusionar subcategorías personalizadas que el usuario haya agregado desde la app
        const { data: customSub } = await supabase.from('subcategorias_personalizadas')
            .select('categoria, nombre')
            .eq('empresa_id', String(empresaActual));
        (customSub || []).forEach(row => {
            const key = (row.categoria || '').toLowerCase().trim();
            if (!SUBCATEGORIAS[key]) SUBCATEGORIAS[key] = [];
            if (!SUBCATEGORIAS[key].some(o => o.toLowerCase() === row.nombre.toLowerCase())) {
                SUBCATEGORIAS[key].push(row.nombre);
            }
        });

        const normalizarSub = (txt) => (txt || '').replace(/\s+/g, ' ').trim().toLowerCase();

        for (const prod of productos) {
            let encontrado = null;

            const normalizar = (txt) => (txt || '').replace(/\s+/g, ' ').trim().toUpperCase();

            // VALIDACIÓN ESTRICTA DE SUBCATEGORÍA
            const catClean = (prod.categoria || '').toLowerCase().trim();
            if (SUBCATEGORIAS[catClean]) {
                const subOriginal = (prod.subcategoria || '').trim();
                const validOptions = SUBCATEGORIAS[catClean];
                const validMatched = validOptions.find(o => o.toLowerCase() === subOriginal.toLowerCase());
                
                if (!validMatched) {
                    errores.push(`"${prod.nombre}": Subcategoría inválida o ausente ("${subOriginal}").`);
                    continue; // Ignorar fila
                }
                prod.subcategoria = validMatched; // Normalizamos con mayúsculas/minúsculas correctas
            } else {
                prod.subcategoria = null;
            }

            // Buscar por SKU primero (si tiene)
            if (prod.sku) {
                encontrado = existentes.find(e => 
                    e.sku && e.sku.toLowerCase() === prod.sku.toLowerCase()
                );
                if (encontrado) prod.metodoVinculacion = 'sku';
            }

            // Fallback: buscar por nombre + categoría
            if (!encontrado && prod.nombre) {
                encontrado = existentes.find(e =>
                    normalizar(e.nombre) === normalizar(prod.nombre) &&
                    normalizar(e.categoria) === normalizar(prod.categoria)
                );
                if (encontrado) prod.metodoVinculacion = 'nombre';
            }

            // Tercer fallback: por grupo de compatibilidad (ver comentario arriba del handler)
            if (!encontrado && prod.modelo_compatible && miembrosCompat.length > 0) {
                const modeloImportadoNorm = normalizarModeloCompat(prod.modelo_compatible);
                const miembroMatch = miembrosCompat.find(m => m.modelo_normalizado === modeloImportadoNorm);
                if (miembroMatch) {
                    const productoDelGrupo = productosConGrupo.find(p =>
                        p.grupo_compatibilidad_id === miembroMatch.grupo_id &&
                        normalizar(p.categoria) === normalizar(prod.categoria) &&
                        normalizar(p.subcategoria || '') === normalizar(prod.subcategoria || '')
                    );
                    if (productoDelGrupo) {
                        encontrado = productoDelGrupo;
                        prod.metodoVinculacion = 'compatibilidad';
                    }
                }
            }

            if (encontrado) {
                items.push({
                    ...prod,
                    accion: 'actualizar',
                    stockActual: encontrado.stock,
                    productoId: encontrado.id,
                    skuExistente: encontrado.sku,
                    metodoVinculacion: prod.metodoVinculacion
                });
            } else {
                items.push({
                    ...prod,
                    accion: 'nuevo',
                    stockActual: 0,
                    productoId: null
                });
            }
        }

        event.reply('preview-excel-resultado', { hash: payload.hash, nombreArchivo: payload.nombreArchivo, items, errores });
    } catch (e) {
        console.error('Error en preview Excel:', e);
        event.reply('preview-excel-resultado', { items: [], errores: ['Error al consultar la base de datos: ' + e.message] });
    }
});

// === 4C. IMPORTACIÓN DESDE EXCEL - EJECUTAR UPSERT ADITIVO ===
ipcMain.on('importar-excel-inventario', async (event, payload) => {
    try {
        const { hash, nombreArchivo, items: productos } = payload;
        
        let actualizados = 0;
        let nuevosCreados = 0;
        let vinculadosCount = 0;
        let vinculadosPorCompatibilidad = 0;
        const movimientos = [];
        const erroresImport = [];

        // 1. Verificar deduplicación por hash
        if (hash) {
            const { data: cargaExistente } = await supabase.from('cargas_procesadas')
                .select('id, procesado_en')
                .eq('hash_archivo', hash)
                .eq('empresa_id', empresaActual)
                .single();
            if (cargaExistente) {
                const fecha = new Date(cargaExistente.procesado_en).toLocaleString();
                event.reply('resultado-importacion-excel', { 
                    success: false, 
                    msg: `Este archivo ya fue procesado el ${fecha}. Se bloqueó para evitar duplicar el inventario.` 
                });
                return;
            }
        }

        // Prefijos estrictos
        const prefijosMap = {
            'pantallas': 'PANT',
            'accesorios': 'ACCE',
            'repuestos de celulares': 'REPU',
            'micas': 'MICA',
            'celulares': 'CEL'
        };

        const proveedoresValidos = ['CAYCEL', 'SAMTEC', 'CYBERPHONE', 'AMOBILE'];

        // Obtener SKUs máximos por prefijo de una sola vez
        const { data: todosProductos } = await supabase.from('productos')
            .select('sku')
            .eq('empresa_id', empresaActual);
            
        const nextSkuByPrefix = {};
        if (todosProductos) {
            for (const p of todosProductos) {
                if (p.sku && p.sku.includes('-')) {
                    const parts = p.sku.split('-');
                    const prefix = parts[0];
                    const num = parseInt(parts[1], 10);
                    if (!isNaN(num)) {
                        if (!nextSkuByPrefix[prefix] || num > nextSkuByPrefix[prefix]) {
                            nextSkuByPrefix[prefix] = num;
                        }
                    }
                }
            }
        }

        for (const prod of productos) {
            try {
                let skuFinal = prod.sku;
                let proveedorClean = prod.proveedor;
                let costoField = null;

                // Validación exacta del proveedor para aplicar costos
                if (proveedorClean && proveedoresValidos.includes(proveedorClean)) {
                    costoField = `costo_${proveedorClean.toLowerCase()}`;
                } else if (proveedorClean && proveedorClean !== 'OTRO') {
                    erroresImport.push(`${prod.nombre}: Costo sin proveedor reconocido (${proveedorClean}), revisar manualmente.`);
                }

                if (prod.accion === 'actualizar' && prod.productoId) {
                    // ACTUALIZAR: Sumar cantidad al stock existente
                    const nuevoStock = (prod.stockActual || 0) + (prod.cantidad || 0);
                    const updateData = { stock: nuevoStock };
                    
                    // GENERAR SKU si no tenía uno previamente
                    if (!prod.skuExistente) {
                        const catClean = (prod.categoria || '').toLowerCase().trim();
                        const prefijo = prefijosMap[catClean];
                        if (prefijo) {
                            const currentNum = (nextSkuByPrefix[prefijo] || 0) + 1;
                            nextSkuByPrefix[prefijo] = currentNum;
                            skuFinal = `${prefijo}-${String(currentNum).padStart(4, '0')}`;
                            updateData.sku = skuFinal;
                        }
                    }

                    if (prod.metodoVinculacion === 'nombre') {
                        vinculadosCount++;
                    } else if (prod.metodoVinculacion === 'compatibilidad') {
                        vinculadosPorCompatibilidad++;
                    }
                    
                    // Actualizar costo del proveedor indicado (solo el dueño puede escribir costos)
                    if (costoField && prod.costo > 0 && rolActual === 'dueno') {
                        updateData[costoField] = prod.costo;
                    }
                    
                    // Actualizar precios opcionales
                    if (prod.precio > 0) updateData.precio = prod.precio;
                    if (prod.precio_mayor > 0) updateData.precio_mayor = prod.precio_mayor;
                    
                    // Guardar SKU por si lo necesitamos para movimientos_stock
                    const { data: updatedProd, error: updateError } = await supabase.from('productos')
                        .update(updateData)
                        .eq('id', prod.productoId)
                        .select('sku')
                        .single();

                    if (updateError) {
                        erroresImport.push(`${prod.nombre}: no se pudo actualizar (${updateError.message}).`);
                        continue;
                    }
                    if (updatedProd && updatedProd.sku) skuFinal = updatedProd.sku;
                    actualizados++;
                } else {
                    // INSERTAR: Crear nuevo producto
                    const catClean = (prod.categoria || '').toLowerCase().trim();
                    const prefijo = prefijosMap[catClean];
                    
                    if (!prefijo) {
                        erroresImport.push(`${prod.nombre}: Categoría '${prod.categoria}' sin prefijo conocido. Requiere revisión manual, no se generó SKU ni producto.`);
                        continue; // Saltamos este producto
                    }
                    
                    // Generar correlativo
                    const currentNum = (nextSkuByPrefix[prefijo] || 0) + 1;
                    nextSkuByPrefix[prefijo] = currentNum;
                    skuFinal = `${prefijo}-${String(currentNum).padStart(4, '0')}`;

                    const insertData = {
                        nombre: prod.nombre,
                        categoria: prod.categoria,
                        subcategoria: prod.subcategoria || null,
                        modelo_compatible: prod.modelo_compatible || '',
                        precio: prod.precio > 0 ? prod.precio : 0,
                        precio_mayor: prod.precio_mayor > 0 ? prod.precio_mayor : null,
                        stock: prod.cantidad || 0,
                        sku: skuFinal,
                        empresa_id: empresaActual
                    };
                    
                    if (costoField && prod.costo > 0 && rolActual === 'dueno') {
                        insertData[costoField] = prod.costo;
                    }

                    const { error: insertError } = await supabase.from('productos').insert([insertData]);
                    if (insertError) {
                        erroresImport.push(`${prod.nombre}: no se pudo crear (${insertError.message}).`);
                        continue;
                    }
                    nuevosCreados++;
                }

                // Preparar movimiento de stock
                if (prod.cantidad > 0 || (prod.costo > 0 && prod.proveedor)) {
                    movimientos.push({
                        empresa_id: empresaActual,
                        sku: skuFinal,
                        cantidad: prod.cantidad || 0,
                        proveedor: prod.proveedor || null,
                        costo: prod.costo > 0 ? prod.costo : null,
                        nota: prod.nota || null,
                        fecha_ingreso: prod.fecha_ingreso || null,
                        nombre_archivo_origen: nombreArchivo
                    });
                }

            } catch (e) {
                console.error('Error insertando/actualizando prod:', prod.nombre, e);
                erroresImport.push(`Error en "${prod.nombre}": ${e.message}`);
            }
        }
        
        // 2. Insertar historial de movimientos en bloque
        if (movimientos.length > 0) {
            await supabase.from('movimientos_stock').insert(movimientos);
        }

        // 3. Registrar archivo como procesado
        if (hash) {
            const { error: errorCarga } = await supabase.from('cargas_procesadas').insert([{
                empresa_id: empresaActual,
                hash_archivo: hash,
                nombre_archivo: nombreArchivo,
                filas_procesadas: productos.length,
                filas_nuevas: nuevosCreados,
                filas_actualizadas: actualizados
            }]);
            if (errorCarga) console.error('No se pudo registrar la carga procesada:', errorCarga.message);
        }

        // Solo después de insertar movimientos y log, responder OK
        event.reply('resultado-importacion-excel', {
            success: true,
            nuevos: nuevosCreados,
            actualizados,
            vinculados: vinculadosCount,
            vinculadosPorCompatibilidad,
            msg: `Proceso finalizado. Nuevos: ${nuevosCreados}, Actualizados: ${actualizados}, Vinculados por nombre: ${vinculadosCount}, Vinculados por compatibilidad: ${vinculadosPorCompatibilidad}. Errores menores: ${erroresImport.length}`
        });
    } catch (err) {
        console.error('Error procesando Excel:', err);
        event.reply('resultado-importacion-excel', { success: false, msg: err.message });
    }
});

// === 4D. HISTORIAL DE PRODUCTO ===
ipcMain.handle('obtener-historial-producto', async (event, sku) => {
    const { data, error } = await supabase
        .from('movimientos_stock')
        .select('*')
        .eq('sku', sku)
        .eq('empresa_id', empresaActual)
        .order('creado_en', { ascending: false })
        .limit(5);
    if (error) throw error;
    return data;
});

ipcMain.handle('actualizar-producto-detalle', async (event, params) => {
    const { id, updates } = params;
    if (rolActual !== 'dueno') {
        Object.keys(updates).forEach(key => { if (key.startsWith('costo')) delete updates[key]; });
    }
    const { data, error } = await supabase
        .from('productos')
        .update(updates)
        .eq('id', id)
        .eq('empresa_id', empresaActual)
        .select()
        .single();
    if (error) throw error;
    return data;
});

ipcMain.handle('ajustar-stock-manual', async (event, params) => {
    if (rolActual !== 'dueno') throw new Error("Solo el administrador puede ajustar el stock manualmente.");
    const { id, sku, nuevoStock, cantidadDiferencia, motivo } = params;
    if (nuevoStock < 0) throw new Error("El stock no puede ser negativo.");

    // Update product stock
    const { data: prodData, error: prodErr } = await supabase
        .from('productos')
        .update({ stock: nuevoStock })
        .eq('id', id)
        .eq('empresa_id', empresaActual)
        .select()
        .single();
    
    if (prodErr) throw prodErr;

    // Insert to historial
    const { error: histErr } = await supabase.from('movimientos_stock').insert([{
        empresa_id: empresaActual,
        sku: sku,
        cantidad: cantidadDiferencia,
        proveedor: 'AJUSTE MANUAL',
        nota: motivo
    }]);

    if (histErr) throw histErr;

    return prodData;
});

// === 5. ORDENES/TALLER (SOLO DE MI EMPRESA) ===
ipcMain.on('guardar-orden', async (event, orden) => {
    try {
        const { data, error } = await supabase.from('ordenes').insert([{
            ...orden,
            empresa_id: empresaActual,
            // El técnico responsable se elige en Recepción (orden.tecnico_id). Antes se ponía
            // siempre usuarioActual (quien crea la orden, normalmente el dueño/vendedor), así que
            // el técnico que repara nunca quedaba asignado y no le aparecía en su listado.
            tecnico_id: orden.tecnico_id || null,
            costo: parseFloat(orden.costo),
            precio_repuesto: parseFloat(orden.precio_repuesto),
            precio_servicio: parseFloat(orden.precio_servicio),
            adelanto: parseFloat(orden.adelanto),
            saldo: parseFloat(orden.saldo)
        }]).select();
        if (error) throw error;
        event.reply('resultado-guardado', { success: true, id: data[0].id });
    } catch (err) {
        console.error(err);
        event.reply('resultado-guardado', { success: false, msg: err.message });
    }
});

ipcMain.on('obtener-ordenes', async (event) => {
    let query = supabase.from('ordenes')
        .select('*')
        .eq('empresa_id', empresaActual);
        
    if (rolActual === 'tecnico') {
        query = query.eq('tecnico_id', usuarioActual);
    }
    
    const { data } = await query.order('id', { ascending: false });
    event.reply('lista-de-ordenes', data || []);
});

// Lista de técnicos de la empresa (para los desplegables de asignación en Recepción y Taller).
ipcMain.on('obtener-tecnicos', async (event) => {
    const { data } = await supabase.from('usuarios')
        .select('usuario, nombre_completo')
        .eq('empresa_id', empresaActual)
        .eq('rol', 'tecnico')
        .order('usuario');
    event.reply('lista-de-tecnicos', data || []);
});

// Asignar / reasignar el técnico responsable de una orden (desde la tabla de Control de Taller).
ipcMain.on('asignar-tecnico-orden', async (event, data) => {
    try {
        const tecnico = (data && data.tecnico) ? data.tecnico : null; // '' => desasignar
        const { error } = await supabase.from('ordenes')
            .update({ tecnico_id: tecnico })
            .eq('id', data.id)
            .eq('empresa_id', empresaActual);
        if (error) throw error;
        event.reply('tecnico-asignado', { success: true, id: data.id, tecnico });
    } catch (e) {
        event.reply('tecnico-asignado', { success: false, msg: e.message });
    }
});

// === 6. REPORTES (SUMA SOLO EL DINERO DE MI EMPRESA) ===
// FASE 2 del plan finanzas: ganancia REAL con costo real del repuesto, filtro por período, y
// unificación de fuentes: órdenes + ventas POS − gastos operativos.
//   ganancia orden = (precio_repuesto − costo_repuesto_real) + precio_servicio  (solo Entregado)
//   ganancia POS   = ventas − costo de los items de stock (productos.costo)
//   ganancia neta  = margen órdenes + margen POS − gastos operativos
// Mantiene las claves viejas de la respuesta (totalIngresos/totalGastos/totalGanancias/…) para
// no romper renderers anteriores; agrega claves nuevas con el detalle.
ipcMain.on('obtener-datos-reporte', async (event, periodo) => {
    const cf = v => parseFloat(v) || 0;

    // Rango de fecha según el período pedido por la UI ('hoy'|'semana'|'mes'|'todo').
    // desdePrev = inicio de la ventana ANTERIOR del mismo tamaño, para la comparativa ↗/↘.
    const ahora = new Date();
    let desde = null, desdePrev = null;
    if (periodo === 'hoy') {
        desde = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
        desdePrev = new Date(desde.getTime() - 24 * 60 * 60 * 1000);
    } else if (periodo === 'semana') {
        desde = new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000);
        desdePrev = new Date(ahora.getTime() - 14 * 24 * 60 * 60 * 1000);
    } else if (periodo === 'mes') {
        desde = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
        desdePrev = new Date(ahora.getFullYear(), ahora.getMonth() - 1, 1);
    }
    // 'todo' o sin parámetro => sin filtro (histórico completo, sin comparativa)
    const enActual = ts => !desde || (ts && new Date(ts) >= desde);

    // 1) ÓRDENES — select('*') a propósito: tolera que costo_repuesto_real no exista todavía
    // (migración 008 sin aplicar) sin tumbar la consulta.
    let query = supabase.from('ordenes').select('*').eq('empresa_id', empresaActual);
    if (rolActual === 'tecnico') query = query.eq('tecnico_id', usuarioActual);
    if (desdePrev) query = query.gte('created_at', desdePrev.toISOString());
    const { data, error } = await query.order('created_at', { ascending: true });
    if (error) console.error('Error obteniendo datos de reporte:', error.message);

    let ingresosOrdenes = 0, reparados = 0, totalOrdenes = 0;
    let costoRepuestos = 0, margenOrdenes = 0;
    let ingresosOrdenesPrev = 0, margenOrdenesPrev = 0;
    const ingresosPorDia = {}; // { 'dd/mm/aaaa': monto }
    const gastosPorDia = {};

    (data || []).forEach(o => {
        // Ingreso REAL cobrado: Entregado => costo total; si no, solo el adelanto.
        const ingreso = (o.estado === 'Entregado') ? cf(o.costo) : cf(o.adelanto);
        const costoReal = cf(o.costo_repuesto_real);
        const margen = (o.estado === 'Entregado')
            ? (cf(o.precio_repuesto) - costoReal) + cf(o.precio_servicio) : 0;

        if (enActual(o.created_at)) {
            totalOrdenes++;
            ingresosOrdenes += ingreso;
            if (o.estado === 'Entregado') { costoRepuestos += costoReal; margenOrdenes += margen; }
            if (o.estado === 'Completado' || o.estado === 'Entregado') reparados++;
            const dia = o.created_at ? new Date(o.created_at).toLocaleDateString('es-PE') : 'Sin fecha';
            ingresosPorDia[dia] = (ingresosPorDia[dia] || 0) + ingreso;
        } else {
            // Fila de la ventana ANTERIOR (solo para la comparativa)
            ingresosOrdenesPrev += ingreso;
            margenOrdenesPrev += margen;
        }
    });

    // 2) VENTAS POS (vendedora): ingreso + costo real de los items de stock (ambas ventanas).
    let ventasPOS = 0, costoPOS = 0, ventasPOSPrev = 0, costoPOSPrev = 0;
    try {
        let qv = supabase.from('ventas_pos').select('id, total, creado_en').eq('empresa_id', empresaActual);
        if (desdePrev) qv = qv.gte('creado_en', desdePrev.toISOString());
        const { data: ventas, error: errV } = await qv;
        if (!errV && ventas) {
            const idsActual = new Set();
            ventas.forEach(v => {
                if (enActual(v.creado_en)) {
                    ventasPOS += cf(v.total);
                    idsActual.add(v.id);
                    const dia = v.creado_en ? new Date(v.creado_en).toLocaleDateString('es-PE') : 'Sin fecha';
                    ingresosPorDia[dia] = (ingresosPorDia[dia] || 0) + cf(v.total);
                } else {
                    ventasPOSPrev += cf(v.total);
                }
            });
            const ids = ventas.map(v => v.id);
            if (ids.length) {
                const { data: items } = await supabase.from('ventas_pos_items')
                    .select('venta_id, producto_id, cantidad, origen')
                    .in('venta_id', ids).eq('origen', 'stock');
                const pids = [...new Set((items || []).map(i => i.producto_id).filter(Boolean))];
                if (pids.length) {
                    const { data: prods } = await supabase.from('productos').select('id, costo').in('id', pids);
                    const mapaCosto = {};
                    (prods || []).forEach(p => { mapaCosto[p.id] = cf(p.costo); });
                    (items || []).forEach(i => {
                        const c = (mapaCosto[i.producto_id] || 0) * cf(i.cantidad);
                        if (idsActual.has(i.venta_id)) costoPOS += c; else costoPOSPrev += c;
                    });
                }
            }
        }
    } catch (e) { /* POS sin migrar en esta empresa: se ignora */ }

    // 3) GASTOS OPERATIVOS (ambas ventanas) + serie por día para la gráfica.
    let gastosOperativos = 0, gastosOperativosPrev = 0;
    let listaGastos = [];
    try {
        let qg = supabase.from('gastos').select('*').eq('empresa_id', empresaActual);
        if (desdePrev) qg = qg.gte('fecha', desdePrev.toISOString().slice(0, 10));
        const { data: gastos, error: errG } = await qg.order('fecha', { ascending: false }).limit(300);
        if (!errG && gastos) {
            gastos.forEach(g => {
                const fechaG = g.fecha ? new Date(g.fecha + 'T12:00:00') : null;
                if (!desde || (fechaG && fechaG >= desde)) {
                    listaGastos.push(g);
                    gastosOperativos += cf(g.monto);
                    const dia = fechaG ? fechaG.toLocaleDateString('es-PE') : 'Sin fecha';
                    gastosPorDia[dia] = (gastosPorDia[dia] || 0) + cf(g.monto);
                } else {
                    gastosOperativosPrev += cf(g.monto);
                }
            });
        }
    } catch (e) { /* tabla gastos sin migrar: se ignora */ }

    // 4) DEVOLUCIONES en efectivo del período: dinero que salió de caja (accion reembolso_efectivo).
    //    Nota: devoluciones.empresa_id es text (migración 005); la comparación funciona igual.
    let devolucionesMonto = 0, devolucionesPrev = 0;
    try {
        let qd = supabase.from('devoluciones')
            .select('monto, creado_en')
            .eq('empresa_id', empresaActual)
            .eq('accion', 'reembolso_efectivo');
        if (desdePrev) qd = qd.gte('creado_en', desdePrev.toISOString());
        const { data: devs, error: errD } = await qd;
        if (!errD && devs) devs.forEach(d => {
            if (enActual(d.creado_en)) devolucionesMonto += cf(d.monto);
            else devolucionesPrev += cf(d.monto);
        });
    } catch (e) { /* tabla devoluciones sin migrar: se ignora */ }

    const margenPOS = ventasPOS - costoPOS;
    const gananciaNeta = margenOrdenes + margenPOS - gastosOperativos - devolucionesMonto;

    // Comparativa vs la ventana anterior del mismo tamaño (null si el período es 'todo').
    const anterior = desdePrev ? {
        totalIngresos: ingresosOrdenesPrev + ventasPOSPrev - devolucionesPrev,
        gastosOperativos: gastosOperativosPrev,
        totalGanancias: margenOrdenesPrev + (ventasPOSPrev - costoPOSPrev) - gastosOperativosPrev - devolucionesPrev
    } : null;

    const labels = Object.keys(ingresosPorDia);
    event.reply('datos-reporte', {
        // Claves originales (compatibilidad): ahora con significado corregido.
        totalIngresos: ingresosOrdenes + ventasPOS - devolucionesMonto,
        totalGastos: costoRepuestos,           // KPI "Costo Repuestos": costo REAL, no precio cobrado
        totalGanancias: gananciaNeta,          // KPI "Ganancia Neta": margen real − gastos
        totalOrdenes,
        totalReparados: reparados,
        // Detalle nuevo (para las tarjetas ampliadas y el desglose)
        periodo: periodo || 'todo',
        ingresosOrdenes, ventasPOS, costoPOS, margenOrdenes, margenPOS,
        gastosOperativos, gastos: listaGastos, devolucionesMonto,
        anterior,
        grafica: {
            labels,
            values: labels.map(l => Math.round((ingresosPorDia[l] || 0) * 100) / 100),
            gastos: labels.map(l => Math.round((gastosPorDia[l] || 0) * 100) / 100)
        }
    });
});

// === 6b. GASTOS OPERATIVOS (alquiler, sueldos, luz, etc. — migración 008) ===
ipcMain.on('registrar-gasto', async (event, g) => {
    try {
        const monto = parseFloat(g && g.monto);
        if (isNaN(monto) || monto < 0) throw new Error('El monto no es válido');
        const { error } = await supabase.from('gastos').insert([{
            empresa_id: empresaActual,
            categoria: (g.categoria || 'Otros').trim(),
            descripcion: (g.descripcion || '').trim() || null,
            monto,
            fecha: g.fecha || new Date().toISOString().slice(0, 10),
            usuario: usuarioActual || null
        }]);
        if (error) throw error;
        event.reply('gasto-registrado', { success: true });
    } catch (err) {
        event.reply('gasto-registrado', { success: false, msg: err.message });
    }
});

ipcMain.on('eliminar-gasto', async (event, data) => {
    try {
        if (rolActual !== 'dueno') throw new Error('Solo el dueño puede eliminar gastos');
        const { error } = await supabase.from('gastos')
            .delete()
            .eq('id', data.id)
            .eq('empresa_id', empresaActual);
        if (error) throw error;
        event.reply('gasto-eliminado', { success: true });
    } catch (err) {
        event.reply('gasto-eliminado', { success: false, msg: err.message });
    }
});

// === 6b-bis. DATOS PARA EXPORTAR EL REPORTE A EXCEL (formato de la plantilla del dueño) ===
// Devuelve filas crudas del período: ventas del POS (una fila por producto), órdenes del taller
// entregadas (con encargado y costo real), y gastos + compras externas juntos como GASTOS.
async function recolectarDatosExport(periodo) {
    const cf = v => parseFloat(v) || 0;
    {
        const ahora = new Date();
        let desde = null;
        if (periodo === 'hoy') desde = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
        else if (periodo === 'semana') desde = new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000);
        else if (periodo === 'mes') desde = new Date(ahora.getFullYear(), ahora.getMonth(), 1);

        // 1) Ventas del POS: una fila por item (producto | importe | pago | quién atendió).
        const ventasRows = [];
        try {
            let qv = supabase.from('ventas_pos')
                .select('id, total, medio_pago, vendedor_usuario, creado_en')
                .eq('empresa_id', empresaActual)
                .order('creado_en', { ascending: true });
            if (desde) qv = qv.gte('creado_en', desde.toISOString());
            const { data: ventas } = await qv;
            const ids = (ventas || []).map(v => v.id);
            const itemsPorVenta = {};
            if (ids.length) {
                const { data: items } = await supabase.from('ventas_pos_items')
                    .select('venta_id, nombre, cantidad, subtotal').in('venta_id', ids);
                (items || []).forEach(i => {
                    (itemsPorVenta[i.venta_id] = itemsPorVenta[i.venta_id] || []).push(i);
                });
            }
            (ventas || []).forEach(v => {
                const its = itemsPorVenta[v.id] || [{ nombre: 'Venta #' + v.id, cantidad: 1, subtotal: v.total }];
                its.forEach(i => ventasRows.push({
                    producto: i.nombre,
                    cantidad: cf(i.cantidad),
                    importe: cf(i.subtotal),
                    pago: v.medio_pago || 'efectivo',
                    atendio: v.vendedor_usuario || ''
                }));
            });
        } catch (e) { /* POS sin migrar */ }

        // 2) Órdenes del taller ENTREGADAS en el período (por fecha_entregado; si no existe, created_at).
        const ordenesRows = [];
        try {
            const { data: ords } = await supabase.from('ordenes')
                .select('*')
                .eq('empresa_id', empresaActual)
                .eq('estado', 'Entregado');
            (ords || []).forEach(o => {
                const fechaRef = o.fecha_entregado || o.created_at;
                if (desde && (!fechaRef || new Date(fechaRef) < desde)) return;
                ordenesRows.push({
                    servicio: `${o.modelo || 'Equipo'} — ${o.falla || 'Servicio'}`.slice(0, 60),
                    encargado: o.tecnico_id || '',
                    costoRepuesto: cf(o.costo_repuesto_real),
                    importe: cf(o.costo),
                    pago: o.metodo_pago || 'efectivo'
                });
            });
        } catch (e) { }

        // 3) Gastos operativos + compras externas (van juntos al bloque GASTOS de la plantilla).
        const gastosRows = [];
        try {
            let qg = supabase.from('gastos').select('categoria, descripcion, monto, fecha').eq('empresa_id', empresaActual);
            if (desde) qg = qg.gte('fecha', desde.toISOString().slice(0, 10));
            const { data: gs } = await qg;
            (gs || []).forEach(g => gastosRows.push({
                nombre: `${g.categoria}${g.descripcion ? ' — ' + g.descripcion : ''}`,
                importe: cf(g.monto)
            }));
        } catch (e) { }
        try {
            let qc = supabase.from('compras_externas').select('proveedor, descripcion, costo, creado_en').eq('empresa_id', empresaActual);
            if (desde) qc = qc.gte('creado_en', desde.toISOString());
            const { data: cs } = await qc;
            (cs || []).forEach(c => gastosRows.push({
                nombre: `Repuesto ext. — ${c.proveedor}${c.descripcion ? ' (' + c.descripcion + ')' : ''}`,
                importe: cf(c.costo)
            }));
        } catch (e) { }

        return { periodo: periodo || 'todo', ventasRows, ordenesRows, gastosRows };
    }
}

ipcMain.on('obtener-datos-export', async (event, periodo) => {
    try {
        event.reply('datos-export', { success: true, ...(await recolectarDatosExport(periodo)) });
    } catch (err) {
        event.reply('datos-export', { success: false, msg: err.message });
    }
});

// Exporta el reporte a un .xlsx CON FORMATO (mismos colores/bloques que la plantilla
// "reporte de venta" del dueño: encabezados verde 30ED03, totales naranja FFC000, bordes,
// fórmulas de suma). SheetJS gratuito no soporta estilos, por eso se usa exceljs acá en main.
ipcMain.on('exportar-reporte-excel', async (event, periodo) => {
    try {
        const d = await recolectarDatosExport(periodo);
        const buffer = await construirExcelReporte(d);
        const destino = dialog.showSaveDialogSync({
            title: 'Guardar reporte de venta',
            defaultPath: path.join(app.getPath('downloads'), `Reporte_Venta_${d.periodo}_${new Date().toISOString().slice(0, 10)}.xlsx`),
            filters: [{ name: 'Excel', extensions: ['xlsx'] }]
        });
        if (!destino) return event.reply('reporte-excel-generado', { success: false, cancelado: true });
        fs.writeFileSync(destino, Buffer.from(buffer));
        shell.openPath(destino);
        event.reply('reporte-excel-generado', { success: true });
    } catch (err) {
        console.error('Error exportando Excel:', err);
        event.reply('reporte-excel-generado', { success: false, msg: err.message });
    }
});

async function construirExcelReporte({ periodo, ventasRows, ordenesRows, gastosRows }) {
    const ExcelJS = require('exceljs');
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('VENTAS');
    const V = ventasRows || [], O = ordenesRows || [], G = gastosRows || [];

    const VERDE = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF30ED03' } };
    const NARANJA = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC000' } };
    const BORDE = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    const fH = { name: 'Constantia', bold: true, size: 11 };
    const fB = { name: 'Calibri', bold: true, size: 11 };
    const setc = (addr, val, fill, font, num) => {
        const c = ws.getCell(addr);
        if (val !== undefined && val !== null) c.value = val;
        if (fill) c.fill = fill;
        if (font) c.font = font;
        c.border = BORDE;
        if (num) c.numFmt = num;
        return c;
    };

    const etiqueta = { hoy: 'HOY', semana: 'ULT. 7 DIAS', mes: 'MES ACTUAL', todo: 'HISTORICO' }[periodo] || periodo;
    setc('B2', `${new Date().toLocaleDateString('es-PE')} (${etiqueta})`, VERDE, fB);
    setc('G1', 'TOTAL DE DIA', VERDE, fH);
    setc('K1', 'Total S.Tec', VERDE, fB);
    setc('N1', 'Total Ventas', VERDE, fB);
    setc('G4', 'TOTAL EFECTIVO', VERDE, fH);

    // Bloque VENTAS (A4:E...) — igual que la plantilla, con columna IMEI.
    ['#', 'PRODUCTO/SERVICIO', 'IMEI', 'IMPORTE', 'PAGO'].forEach((t, i) =>
        setc(String.fromCharCode(65 + i) + '4', t, VERDE, fH));
    const filaV = 5, nV = Math.max(V.length, 16);
    for (let i = 0; i < nV; i++) {
        const v = V[i];
        setc(`A${filaV + i}`, v ? i + 1 : null);
        setc(`B${filaV + i}`, v ? v.producto : null);
        setc(`C${filaV + i}`, null);
        setc(`D${filaV + i}`, v ? v.importe : null, null, null, '0.00');
        setc(`E${filaV + i}`, v ? String(v.pago || '').toUpperCase() : null);
    }
    const finV = filaV + nV - 1;

    // Bloque GASTOS (G7)
    setc('G7', 'GASTOS', VERDE, fB); setc('H7', 'IMPORTE', VERDE, fB);
    const filaG = 8, nG = Math.max(G.length, 12);
    for (let i = 0; i < nG; i++) {
        const g = G[i];
        setc(`G${filaG + i}`, g ? g.nombre : null);
        setc(`H${filaG + i}`, g ? g.importe : null, null, null, '0.00');
    }
    const finG = filaG + nG - 1;

    // Bloque SERVICIO TECNICO (debajo de gastos)
    const hS = finG + 2;
    ['SERVICIO TECNICO', 'ENCARGADO', 'COSTO REP.', 'IMPORTE', 'PAGO'].forEach((t, i) =>
        setc(String.fromCharCode(71 + i) + hS, t, VERDE, fB));
    const filaS = hS + 1, nS = Math.max(O.length, 8);
    for (let i = 0; i < nS; i++) {
        const o = O[i];
        setc(`G${filaS + i}`, o ? o.servicio : null);
        setc(`H${filaS + i}`, o ? o.encargado : null);
        setc(`I${filaS + i}`, o ? o.costoRepuesto : null, null, null, '0.00');
        setc(`J${filaS + i}`, o ? o.importe : null, null, null, '0.00');
        setc(`K${filaS + i}`, o ? String(o.pago || '').toUpperCase() : null);
    }
    const finS = filaS + nS - 1;

    // Totales con FÓRMULAS (como la fila 38 de la plantilla: se recalculan si el dueño edita)
    const tot = finS + 1;
    setc(`D${tot}`, { formula: `SUM(D${filaV}:D${finV})` }, NARANJA, fB, '0.00');
    setc(`H${tot}`, { formula: `SUM(H${filaG}:H${finG})` }, NARANJA, fB, '0.00');
    setc(`I${tot}`, { formula: `SUM(I${filaS}:I${finS})` }, NARANJA, fB, '0.00');
    setc(`J${tot}`, { formula: `SUM(J${filaS}:J${finS})` }, NARANJA, fB, '0.00');
    setc('G2', { formula: `D${tot}+J${tot}` }, NARANJA, fB, '0.00');
    setc('K2', { formula: `J${tot}` }, NARANJA, fB, '0.00');
    setc('N2', { formula: `D${tot}` }, NARANJA, fB, '0.00');

    // Resumen por método de pago (columna M-N): ventas y servicio por separado.
    const medios = ['EFECTIVO', 'YAPE', 'PLIN', 'TRANSFERENCIA', 'TARJETA', 'OTRO'];
    const porPago = rows => rows.reduce((m, r) => {
        const k = String(r.pago || 'efectivo').toUpperCase();
        m[k] = (m[k] || 0) + (parseFloat(r.importe) || 0); return m;
    }, {});
    const bloqueMetodo = (fila, titulo, rows) => {
        setc(`M${fila}`, titulo, VERDE, fB); setc(`N${fila}`, 'IMPORTE', VERDE, fB);
        const t = porPago(rows);
        medios.forEach((m, i) => {
            setc(`M${fila + 1 + i}`, 'Total en ' + m.charAt(0) + m.slice(1).toLowerCase(), VERDE, fB);
            setc(`N${fila + 1 + i}`, Math.round((t[m] || 0) * 100) / 100, NARANJA, fB, '0.00');
        });
        return fila + medios.length + 2;
    };
    const f2 = bloqueMetodo(1, 'ACCESORIOS/VENTAS', V);
    const f3 = bloqueMetodo(f2, 'SERVICIO TECNICO', O);

    // TOTAL EFECTIVO global (G5)
    const efec = (porPago(V)['EFECTIVO'] || 0) + (porPago(O)['EFECTIVO'] || 0);
    setc('G5', Math.round(efec * 100) / 100, NARANJA, fB, '0.00');

    // YAPES Y RETIROS: quién cobró por Yape (vendedora y técnicos)
    setc(`M${f3}`, 'YAPES Y RETIROS', VERDE, fB); setc(`N${f3}`, 'IMPORTE', VERDE, fB);
    const yapes = {};
    V.forEach(r => { if (String(r.pago).toLowerCase() === 'yape') yapes[r.atendio || 'Vendedora'] = (yapes[r.atendio || 'Vendedora'] || 0) + (parseFloat(r.importe) || 0); });
    O.forEach(r => { if (String(r.pago).toLowerCase() === 'yape') yapes[r.encargado || 'Técnico'] = (yapes[r.encargado || 'Técnico'] || 0) + (parseFloat(r.importe) || 0); });
    const nombresY = Object.keys(yapes);
    if (nombresY.length) {
        nombresY.forEach((k, i) => {
            setc(`M${f3 + 1 + i}`, k);
            setc(`N${f3 + 1 + i}`, Math.round(yapes[k] * 100) / 100, null, null, '0.00');
        });
    } else {
        setc(`M${f3 + 1}`, '(sin cobros por Yape)');
    }

    const widths = { A: 4, B: 42, C: 10, D: 10.3, E: 13, F: 2, G: 46, H: 13, I: 10.6, J: 10.6, K: 13, L: 2.7, M: 22, N: 12 };
    Object.keys(widths).forEach(k => { ws.getColumn(k).width = widths[k]; });

    return await wb.xlsx.writeBuffer();
}

// === 6b-ter. MÁS VENDIDOS por categoría (ventas del POS del período elegido) ===
ipcMain.on('obtener-top-ventas', async (event, periodo) => {
    const cf = v => parseFloat(v) || 0;
    try {
        const ahora = new Date();
        let desde = null;
        if (periodo === 'hoy') desde = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
        else if (periodo === 'semana') desde = new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000);
        else if (periodo === 'mes') desde = new Date(ahora.getFullYear(), ahora.getMonth(), 1);

        const agg = {}; // categoria -> nombre -> { cantidad, total }
        const sumar = (cat, nombre, cantidad, total) => {
            const key = (nombre || 'Producto').trim();
            agg[cat] = agg[cat] || {};
            agg[cat][key] = agg[cat][key] || { nombre: key, cantidad: 0, total: 0 };
            agg[cat][key].cantidad += cantidad;
            agg[cat][key].total += total;
        };

        // 1) Ventas del POS (fuente principal desde la integración 010).
        let qv = supabase.from('ventas_pos').select('id, creado_en').eq('empresa_id', empresaActual);
        if (desde) qv = qv.gte('creado_en', desde.toISOString());
        const { data: ventas } = await qv;
        const ids = (ventas || []).map(v => v.id);

        let items = [];
        if (ids.length) {
            const { data } = await supabase.from('ventas_pos_items')
                .select('producto_id, nombre, cantidad, subtotal, origen')
                .in('venta_id', ids);
            items = data || [];
        }
        const pids = [...new Set(items.map(i => i.producto_id).filter(Boolean))];
        const mapaCat = {};
        if (pids.length) {
            const { data: prods } = await supabase.from('productos').select('id, categoria').in('id', pids);
            (prods || []).forEach(p => { mapaCat[p.id] = p.categoria || 'Sin categoría'; });
        }
        items.forEach(i => {
            const cat = i.origen === 'libre' ? 'Venta libre (sin stock)' : (mapaCat[i.producto_id] || 'Sin categoría');
            sumar(cat, i.nombre, cf(i.cantidad), cf(i.subtotal));
        });

        // 2) HISTÓRICO de ventas móviles anteriores a ventas_pos: viven solo como movimientos de
        //    stock "Venta móvil - ...". Solo se cuentan los ANTERIORES a la primera venta de
        //    ventas_pos, para no contar doble las nuevas (que generan ambos registros).
        try {
            const minVentaPos = ids.length ? (ventas || []).map(v => v.creado_en).sort()[0] : null;
            let qm = supabase.from('movimientos_stock')
                .select('sku, cantidad, creado_en')
                .eq('empresa_id', String(empresaActual))
                .ilike('nota', 'Venta móvil%');
            if (desde) qm = qm.gte('creado_en', desde.toISOString());
            const { data: movs } = await qm;
            const historicos = (movs || []).filter(m => !minVentaPos || new Date(m.creado_en) < new Date(minVentaPos));
            const skus = [...new Set(historicos.map(m => m.sku).filter(Boolean))];
            const mapaSku = {};
            if (skus.length) {
                const { data: prods } = await supabase.from('productos')
                    .select('sku, nombre, categoria, precio')
                    .eq('empresa_id', empresaActual)
                    .in('sku', skus);
                (prods || []).forEach(p => { mapaSku[p.sku] = p; });
            }
            historicos.forEach(m => {
                const p = mapaSku[m.sku];
                const qty = Math.abs(cf(m.cantidad));
                sumar(p ? (p.categoria || 'Sin categoría') : 'Sin categoría',
                      p ? p.nombre : (m.sku || 'Producto'),
                      qty, qty * (p ? cf(p.precio) : 0));
            });
        } catch (e) { /* sin movimientos: se ignora */ }

        // 3) SERVICIOS del taller: órdenes entregadas del período, agrupadas por equipo.
        //    (Así "Más Vendidos" también muestra qué reparaciones son las más frecuentes.)
        try {
            const { data: ords } = await supabase.from('ordenes')
                .select('modelo, costo, estado, created_at, fecha_entregado')
                .eq('empresa_id', String(empresaActual))
                .eq('estado', 'Entregado');
            (ords || []).forEach(o => {
                const ref = o.fecha_entregado || o.created_at;
                if (desde && (!ref || new Date(ref) < desde)) return;
                sumar('🔧 Servicios del taller', (o.modelo || 'Equipo').trim(), 1, cf(o.costo));
            });
        } catch (e) { /* sin ordenes: se ignora */ }

        const categorias = Object.keys(agg).map(cat => {
            const lista = Object.values(agg[cat]).sort((a, b) => b.cantidad - a.cantidad);
            return {
                categoria: cat,
                items: lista.slice(0, 10),
                totalCat: lista.reduce((s, x) => s + x.total, 0)
            };
        }).sort((a, b) => b.totalCat - a.totalCat);

        event.reply('top-ventas-data', { success: true, periodo: periodo || 'todo', categorias });
    } catch (err) {
        event.reply('top-ventas-data', { success: false, msg: err.message });
    }
});

// === 6c. CIERRE DEL DÍA UNIFICADO (FASE 6 del plan finanzas — el "libro de caja") ===
// Junta en una sola foto lo que ENTRÓ hoy (adelantos de órdenes creadas hoy + saldos de órdenes
// entregadas hoy + ventas POS) y lo que SALIÓ (gastos + compras externas + devoluciones en
// efectivo). Con p_registrar=true guarda el snapshot en cierres_dia (migración 009).
ipcMain.on('obtener-cierre-dia', async (event, params) => {
    const cf = v => parseFloat(v) || 0;
    try {
        const base = (params && params.fecha) ? new Date(params.fecha + 'T12:00:00') : new Date();
        const desde = new Date(base.getFullYear(), base.getMonth(), base.getDate());
        const hasta = new Date(base.getFullYear(), base.getMonth(), base.getDate() + 1);
        const fechaTxt = `${desde.getFullYear()}-${String(desde.getMonth() + 1).padStart(2, '0')}-${String(desde.getDate()).padStart(2, '0')}`;

        // 1) Taller — adelantos cobrados hoy (órdenes creadas hoy con adelanto).
        let adelantos = 0;
        const { data: creadas } = await supabase.from('ordenes')
            .select('adelanto')
            .eq('empresa_id', empresaActual)
            .gte('created_at', desde.toISOString())
            .lt('created_at', hasta.toISOString());
        (creadas || []).forEach(o => { adelantos += cf(o.adelanto); });

        // 2) Taller — saldos cobrados hoy (órdenes ENTREGADAS hoy: costo − adelanto).
        //    Tolerante: si falta la migración 009 (columna fecha_entregado) se omite.
        let saldosCobrados = 0;
        try {
            const { data: entregadas, error: errE } = await supabase.from('ordenes')
                .select('costo, adelanto')
                .eq('empresa_id', empresaActual)
                .gte('fecha_entregado', desde.toISOString())
                .lt('fecha_entregado', hasta.toISOString());
            if (!errE) (entregadas || []).forEach(o => {
                saldosCobrados += Math.max(cf(o.costo) - cf(o.adelanto), 0);
            });
        } catch (e) { /* sin migración 009 */ }

        // 3) Ventas POS de hoy.
        let ingresosPOS = 0, ventasPosCount = 0;
        try {
            const { data: ventas, error: errV } = await supabase.from('ventas_pos')
                .select('total')
                .eq('empresa_id', empresaActual)
                .gte('creado_en', desde.toISOString())
                .lt('creado_en', hasta.toISOString());
            if (!errV && ventas) {
                ventasPosCount = ventas.length;
                ingresosPOS = ventas.reduce((s, v) => s + cf(v.total), 0);
            }
        } catch (e) { /* POS sin migrar */ }

        // 4) Gastos operativos de hoy.
        let gastosTotal = 0, listaGastos = [];
        try {
            const { data: gs, error: errG } = await supabase.from('gastos')
                .select('categoria, descripcion, monto')
                .eq('empresa_id', empresaActual)
                .eq('fecha', fechaTxt);
            if (!errG && gs) { listaGastos = gs; gastosTotal = gs.reduce((s, g) => s + cf(g.monto), 0); }
        } catch (e) { /* sin migración 008 */ }

        // 5) Compras externas de hoy (repuestos traídos de otros proveedores).
        let comprasTotal = 0, listaCompras = [];
        try {
            const { data: cs, error: errC } = await supabase.from('compras_externas')
                .select('proveedor, descripcion, costo, orden_id')
                .eq('empresa_id', empresaActual)
                .gte('creado_en', desde.toISOString())
                .lt('creado_en', hasta.toISOString());
            if (!errC && cs) { listaCompras = cs; comprasTotal = cs.reduce((s, c) => s + cf(c.costo), 0); }
        } catch (e) { /* sin migración 007 */ }

        // 6) Devoluciones en efectivo de hoy.
        let devolucionesTotal = 0;
        try {
            const { data: dv, error: errD } = await supabase.from('devoluciones')
                .select('monto')
                .eq('empresa_id', empresaActual)
                .eq('accion', 'reembolso_efectivo')
                .gte('creado_en', desde.toISOString())
                .lt('creado_en', hasta.toISOString());
            if (!errD && dv) devolucionesTotal = dv.reduce((s, d) => s + cf(d.monto), 0);
        } catch (e) { /* sin devoluciones */ }

        const ingresosTaller = adelantos + saldosCobrados;
        const neto = ingresosTaller + ingresosPOS - gastosTotal - comprasTotal - devolucionesTotal;

        let cierreId = null;
        if (params && params.registrar) {
            if (rolActual !== 'dueno') throw new Error('Solo el dueño puede cerrar el día');
            const { data: reg, error: errReg } = await supabase.from('cierres_dia').insert([{
                empresa_id: empresaActual,
                fecha: fechaTxt,
                ingresos_taller: ingresosTaller,
                ingresos_pos: ingresosPOS,
                gastos: gastosTotal,
                compras_externas: comprasTotal,
                devoluciones: devolucionesTotal,
                neto,
                detalle_json: { adelantos, saldosCobrados, ventasPosCount, gastos: listaGastos, compras: listaCompras },
                usuario: usuarioActual || null
            }]).select('id').single();
            if (errReg) throw new Error('No se pudo guardar el cierre (¿falta la migración 009?): ' + errReg.message);
            cierreId = reg ? reg.id : null;
        }

        event.reply('cierre-dia-datos', {
            success: true, fecha: fechaTxt,
            ingresosTaller, adelantos, saldosCobrados,
            ingresosPOS, ventasPosCount,
            gastos: gastosTotal, listaGastos,
            comprasExternas: comprasTotal, listaCompras,
            devoluciones: devolucionesTotal,
            neto, registrado: !!(params && params.registrar), cierre_id: cierreId
        });
    } catch (err) {
        event.reply('cierre-dia-datos', { success: false, msg: err.message });
    }
});

// === 6d. TIENDAS (sucursales) — asignación de personal por tienda ===
ipcMain.on('obtener-tiendas', async (event) => {
    try {
        const { data } = await supabase.from('tiendas')
            .select('*')
            .eq('empresa_id', empresaActual)
            .order('id', { ascending: true });
        event.reply('lista-de-tiendas', data || []);
    } catch (e) {
        event.reply('lista-de-tiendas', []);
    }
});

ipcMain.on('crear-tienda', async (event, data) => {
    try {
        if (rolActual !== 'dueno') throw new Error('Solo el dueño puede crear tiendas');
        const nombre = String((data && data.nombre) || '').trim();
        if (!nombre) throw new Error('Falta el nombre de la tienda');
        const { error } = await supabase.from('tiendas')
            .insert([{ empresa_id: empresaActual, nombre }]);
        if (error) throw error;
        event.reply('tienda-creada', { success: true });
    } catch (err) {
        event.reply('tienda-creada', { success: false, msg: err.message });
    }
});

ipcMain.on('asignar-tienda-usuario', async (event, data) => {
    try {
        if (rolActual !== 'dueno') throw new Error('Solo el dueño puede asignar personal a tiendas');
        const { error } = await supabase.from('usuarios')
            .update({ tienda_id: data.tienda_id || null })
            .eq('id', data.id)
            .eq('empresa_id', empresaActual);
        if (error) throw error;
        event.reply('tienda-asignada', { success: true });
    } catch (err) {
        event.reply('tienda-asignada', { success: false, msg: err.message });
    }
});

// === 7. GESTIÓN DE USUARIOS (SOLO DE MI EMPRESA) ===
ipcMain.on('crear-usuario-nuevo', async (event, data) => {
    if (rolActual !== 'dueno') {
        event.reply('resultado-usuario', { success: false, msg: 'Acceso Denegado: No tienes permisos de Administrador.' });
        return;
    }

    if (!['dueno', 'vendedor', 'tecnico'].includes(data.rol)) {
        event.reply('resultado-usuario', { success: false, msg: 'Rol inválido' });
        return;
    }

    try {
        const { count, error: countError } = await supabase
            .from('usuarios')
            .select('*', { count: 'exact', head: true })
            .eq('empresa_id', empresaActual);

        if (countError) throw countError;

        // El límite de puestos es por empresa (columna empresas.limite_de_usuario), no un valor
        // fijo global — antes este handler ignoraba esa columna y usaba siempre 3 para todos.
        const { data: empresaLimite } = await supabase
            .from('empresas')
            .select('limite_de_usuario')
            .eq('id', empresaActual)
            .single();
        const limitePlan = (empresaLimite && empresaLimite.limite_de_usuario) || 3;

        if (count >= limitePlan) {
            event.reply('resultado-usuario', {
                success: false,
                msg: `💎 Límite de ${limitePlan} usuarios alcanzado. Contacta a soporte para mejorar tu licencia.`
            });
            return;
        }

        // 🚨 NUEVO: Encriptamos la contraseña antes de guardar el usuario
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.password, salt);

        const { error } = await supabase.from('usuarios').insert([{
            usuario: data.usuario,
            password: hashedPassword, // Usamos la contraseña encriptada
            rol: data.rol,
            estado: 'activo',
            empresa_id: empresaActual
        }]);

        if (error) throw error;

        event.reply('resultado-usuario', { success: true, msg: `Usuario ${data.usuario} creado exitosamente` });
    } catch (err) {
        console.error("Error BD Usuarios:", err);
        event.reply('resultado-usuario', { success: false, msg: 'Error al crear el usuario en Supabase' });
    }
});

// === 7.1 CAMBIAR ESTADO DE USUARIO (Activar/Desactivar) ===
ipcMain.on('cambiar-estado-usuario', async (event, data) => {
    try {
        if (rolActual !== 'dueno') {
            return event.reply('resultado-cambio-estado', { success: false, msg: 'Solo el dueño puede cambiar el estado de usuarios.' });
        }
        const { id, nuevoEstado } = data;
        const { error } = await supabase
            .from('usuarios')
            .update({ estado: nuevoEstado })
            .eq('id', id)
            .eq('empresa_id', empresaActual);
        
        if (error) throw error;
        
        console.log(`👤 [Usuario] ID ${id} cambiado a: ${nuevoEstado}`);
        event.reply('resultado-cambio-estado', { success: true, msg: `Usuario ${nuevoEstado} exitosamente` });
        // Refrescar lista de usuarios
        const { data: rows } = await supabase.from('usuarios').select('*').eq('empresa_id', empresaActual);
        mainWindow.webContents.send('lista-de-usuarios', rows || []);
    } catch (err) {
        console.error('Error al cambiar estado usuario:', err);
        event.reply('resultado-cambio-estado', { success: false, msg: 'Error al actualizar el estado del usuario' });
    }
});

// === 8. ESTADO DEL PLAN (Para el Dashboard de Licencias) ===
ipcMain.on('obtener-estado-plan', async (event, data) => {
    const idParaConsultar = empresaActual;

    if (!idParaConsultar) {
        event.reply('estado-plan-respuesta', { error: "Empresa no vinculada" });
        return;
    }

    try {
        const { data: empresa, error: errorEmpresa } = await supabase
            .from('empresas')
            .select('*')
            .eq('id', idParaConsultar)
            .single();

        if (errorEmpresa || !empresa) {
            event.reply('estado-plan-respuesta', { error: "Empresa no encontrada" });
            return;
        }

        const { count } = await supabase
            .from('usuarios')
            .select('*', { count: 'exact', head: true })
            .eq('empresa_id', idParaConsultar);

        const limite = empresa.limite_de_usuario || 3;

        event.reply('estado-plan-respuesta', {
            usados: count,
            total: limite
        });

    } catch (err) {
        event.reply('estado-plan-respuesta', { error: "Error en servidor" });
    }
});

// === 9. CONFIGURACIÓN DE EMPRESA ===
ipcMain.on('guardar-datos-empresa', async (event, data) => {
    try {
        if (!empresaActual) throw new Error('No hay sesión activa');
        const datosActualizar = {
            nombre: data.nombre,
            razon_social: data.razon_social,
            ruc: data.ruc,
            direccion: data.direccion,
            telefono: data.telefono
        };

        const { error } = await supabase
            .from('empresas')
            .update(datosActualizar)
            .eq('id', empresaActual);

        if (error) throw error;

        event.reply('resultado-datos-empresa', { success: true });
    } catch (error) {
        event.reply('resultado-datos-empresa', { success: false, msg: error.message });
    }
});

ipcMain.on('pedir-datos-empresa', async (event, data) => {
    try {
        if (!empresaActual) throw new Error('No hay sesión activa');
        const { data: empresaData, error } = await supabase
            .from('empresas')
            .select('*')
            .eq('id', empresaActual)
            .single();

        if (error) throw error;

        if (empresaData) {
            event.reply('datos-empresa-respuesta', empresaData);
        }
    } catch (error) {
        console.error("Error al pedir datos:", error);
    }
});

// === 10. GENERADOR AUTOMÁTICO DE LICENCIAS (SÓLO ADMIN) ===
ipcMain.on('crear-codigo-automatico', async (event, data) => {
    try {
        if (empresaActual !== 1) {
            console.warn("Intento de generación de licencia bloqueado. Usuario no autorizado.");
            return;
        }

        const caracteresLocos = Math.random().toString(36).substring(2, 8).toUpperCase();
        const codigoFinal = `BH-PRO-${caracteresLocos}`;
        const mesesElegidos = data && data.meses ? data.meses : 1;

        const { error } = await supabase
            .from('licencias')
            .insert([{
                codigo: codigoFinal,
                usada: false,
                meses_duracion: mesesElegidos
            }]);

        if (error) throw error;

        event.reply('codigo-creado-exito', codigoFinal);
    } catch (err) {
        console.error("Error al generar licencia:", err);
    }
});

// === 11. REGISTRO SAAS CON VALIDACIÓN DE LICENCIA Y FECHA ===
ipcMain.on('registrar-nuevo-cliente-saas', async (event, data) => {
    try {
        const { data: licenciaData, error: errLic } = await supabase
            .from('licencias')
            .select('*')
            .eq('codigo', data.codigo)
            .eq('usada', false)
            .single();

        if (errLic || !licenciaData) {
            return event.reply('registro-saas-respuesta', {
                success: false,
                msg: 'Código de licencia inválido, inexistente o ya usado.'
            });
        }

        const mesesAdquiridos = licenciaData.meses_duracion || 1;
        const fechaVencimiento = new Date();
        fechaVencimiento.setMonth(fechaVencimiento.getMonth() + mesesAdquiridos);
        const fechaSQL = fechaVencimiento.toISOString().split('T')[0];

        const { data: nuevaEmpresa, error: errEmpresa } = await supabase
            .from('empresas')
            .insert([{
                nombre: data.empresa,
                limite_de_usuario: 3,
                fecha_de_vencimiento: fechaSQL
            }])
            .select();

        if (errEmpresa) throw errEmpresa;
        const idGenerado = nuevaEmpresa[0].id;

        // 🚨 NUEVO: Encriptamos la contraseña del administrador del nuevo taller
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.password, salt);

        const { error: errUser } = await supabase
            .from('usuarios')
            .insert([{
                usuario: data.usuario,
                password: hashedPassword, // Se guarda encriptada
                rol: 'dueno',
                estado: 'activo',
                empresa_id: idGenerado
            }]);

        if (errUser) throw errUser;

        const { error: errUpdateLic } = await supabase
            .from('licencias')
            .update({ usada: true })
            .eq('id', licenciaData.id);

        if (errUpdateLic) throw errUpdateLic;

        event.reply('registro-saas-respuesta', { success: true });

    } catch (err) {
        console.error("Error en el registro:", err);
        event.reply('registro-saas-respuesta', { success: false, msg: err.message });
    }
});

// === 12. MÓDULO DE FACTURACIÓN AUTOMÁTICA ===
ipcMain.on('emitir-factura-saas', async (event, data) => {
    try {
        const { data: ultimasFacturas, error: errConsulta } = await supabase
            .from('facturas')
            .select('numero_comprobante')
            .eq('empresa_id', empresaActual)
            .eq('tipo', data.tipo)
            .order('id', { ascending: false })
            .limit(1);

        if (errConsulta) throw errConsulta;

        let siguienteNumero = 1;
        if (ultimasFacturas && ultimasFacturas.length > 0 && ultimasFacturas[0].numero_comprobante) {
            const partes = ultimasFacturas[0].numero_comprobante.split('-');
            if (partes.length === 2) {
                siguienteNumero = parseInt(partes[1]) + 1;
            }
        }

        let prefijo = 'NOT';
        if (data.tipo === 'Factura') prefijo = 'FFF';
        if (data.tipo === 'Boleta') prefijo = 'BBB';

        const numeroFinal = `${prefijo}-${String(siguienteNumero).padStart(4, '0')}`;

        const { error } = await supabase
            .from('facturas')
            .insert([{
                empresa_id: empresaActual,
                orden_id: data.ordenId,
                numero_comprobante: numeroFinal,
                tipo: data.tipo,
                cliente_documento: data.documento || 'S/N',
                // Antes el nombre del cliente se descartaba y los comprobantes salían
                // "sin especificar" en los listados. Ahora queda registrado, junto con
                // quién lo emitió (para el control por trabajador).
                cliente_nombre: data.nombre || null,
                vendedor_usuario: usuarioActual || null,
                monto_total: parseFloat(data.total)
            }]);

        if (error) throw error;

        event.reply('factura-emitida-exito', { numero: numeroFinal, tipo: data.tipo });

    } catch (err) {
        // Antes este catch solo hacía console.error y NO respondía al renderer, así que si el
        // guardado fallaba la UI se quedaba muda ("no genera nada" sin ningún aviso). Ahora
        // avisamos del error para que el usuario sepa qué pasó.
        console.error("Error al emitir comprobante:", err);
        event.reply('factura-emitida-error', { msg: err.message });
    }
});

// === 13. ACTUALIZAR PERFIL DE USUARIO ===
ipcMain.on('guardar-mi-perfil', async (event, data) => {
    try {
        if (!empresaActual) throw new Error('No hay sesión activa');
        const { error } = await supabase
            .from('usuarios')
            .update({
                nombre_completo: data.nombre_completo,
                nickname: data.nickname,
                avatar: data.avatar
            })
            .eq('usuario', data.usuario_original)
            .eq('empresa_id', empresaActual);

        if (error) throw error;

        event.reply('perfil-guardado-exito', data);
    } catch (err) {
        console.error("Error al actualizar perfil:", err);
    }
});

// === 14. MÓDULOS DE IA (Gemini y OpenAI) ===
ipcMain.on('analizar-documento-ia', async (event, data) => {
    try {
        console.log("Iniciando análisis con Gemini...");
        
        // NOTA: Asegúrate de tener genAI instanciado correctamente en la cabecera de tu archivo
        // const { GoogleGenerativeAI } = require('@google/generative-ai');
        // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const base64Data = data.image.replace(/^data:image\/\w+;base64,/, "");

        const prompt = `
            Eres un asistente experto en inventarios de servicio técnico de celulares.
            Analiza esta imagen que contiene una lista de repuestos, productos o accesorios.
            Extrae todos los elementos y clasifícalos ESTRICTAMENTE en una de estas tres categorías:
            - "Accesorios" (para auriculares, cargadores, forros, fundas, cables, etc.)
            - "Repuestos" (para puertos de carga, parlantes, micrófonos, baterías, flex, cámaras, etc.)
            - "Pantallas" (para pantallas, displays, módulos)
            
            Devuélvelos ESTRICTAMENTE en este formato JSON:
            [
              { "nombre": "Pantalla Apple iPhone 13", "categoria": "Pantallas", "costo": 120, "precio": 200, "stock": 5 }
            ]
            
            Reglas:
            1. NO incluyas markdown (como \`\`\`json).
            2. Si no ves el costo, ponlo en 0. Si no ves precio de venta, ponlo en 0.
            3. Si no ves el stock, ponlo en 1.
            4. Clasifica cada ítem de forma coherente en una de las tres categorías indicadas ("Accesorios", "Repuestos" o "Pantallas").
            5. Responde ÚNICA Y EXCLUSIVAMENTE con el array JSON válido.
        `;

        const imageParts = [{
            inlineData: { data: base64Data, mimeType: "image/jpeg" }
        }];

        const result = await model.generateContent([prompt, ...imageParts]);
        const responseText = result.response.text();

        let jsonLimpio = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
        console.log("Respuesta de Gemini recibida y limpiada.");

        event.reply('respuesta-analisis-ia', { success: true, data: jsonLimpio });

    } catch (error) {
        console.error("Error al conectar con Gemini:", error);
        event.reply('respuesta-analisis-ia', { success: false, msg: error.message });
    }
});

// === 14B. IMPORTAR GRUPOS DE COMPATIBILIDAD DESDE PDF O IMAGEN (Fase 5) ===
// Handler NUEVO y separado de 'analizar-documento-ia' (no se toca ese, ya está en producción
// para "Escanear Lista" de inventario) para no arriesgar esa función existente. Reutiliza el
// mismo patrón de Gemini Vision, pero con un prompt propio orientado a GRUPOS de compatibilidad
// (varios modelos que comparten una misma mica/pantalla) en vez de productos individuales.
// Acepta imagen (jpg/png/etc) Y PDF: Gemini 1.5 entiende PDF nativo como inlineData con
// mimeType 'application/pdf' (interpreta cada página como si fuera una imagen), así que no
// hace falta distinguir "PDF con texto" de "PDF escaneado" ni añadir una librería de
// extracción de texto — el mimeType se toma directo del data URL que manda el renderer,
// sea cual sea el tipo de archivo real.
ipcMain.on('analizar-compatibilidad-archivo', async (event, data) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const match = /^data:([^;]+);base64,([\s\S]+)$/.exec(data.file || '');
        if (!match) throw new Error('Archivo no reconocido (se esperaba una imagen o un PDF).');
        const mimeType = match[1];
        const base64Data = match[2];

        const prompt = `
            Eres un asistente experto en compatibilidad de repuestos de celulares.
            Analiza este documento/imagen que contiene una lista de compatibilidad de MICAS o
            PANTALLAS: cada fila o grupo son varios modelos de celular que comparten la MISMA
            pieza física (mismo producto, mismo stock).

            Devuélvelo ESTRICTAMENTE en este formato JSON (un elemento del array por cada
            fila/grupo distinto de la lista, aunque tenga un solo modelo):
            [
              { "tipo_pieza": "mica", "modelos": [{"marca": "Samsung", "modelo": "Galaxy A12"}, {"marca": "Samsung", "modelo": "Galaxy A20s"}] }
            ]

            Reglas:
            1. "tipo_pieza" debe ser "mica" o "pantalla" según corresponda a esa fila/grupo.
            2. NO incluyas markdown (como \`\`\`json).
            3. No inventes modelos que no veas escritos en el documento.
            4. Si un modelo no tiene marca explícita en el documento, usa "" para "marca" (se
               revisa y corrige a mano antes de guardar nada).
            5. Responde ÚNICA Y EXCLUSIVAMENTE con el array JSON válido, sin texto adicional.
        `;

        const fileParts = [{ inlineData: { data: base64Data, mimeType } }];
        const result = await model.generateContent([prompt, ...fileParts]);
        const responseText = result.response.text();

        const jsonLimpio = responseText.replace(/```json/g, "").replace(/```/g, "").trim();

        event.reply('respuesta-analisis-compatibilidad', { success: true, data: jsonLimpio });
    } catch (error) {
        console.error("Error al analizar archivo de compatibilidad:", error);
        event.reply('respuesta-analisis-compatibilidad', { success: false, msg: error.message });
    }
});

ipcMain.on('ia-recepcion', async (event, fallaReportada) => {
    try {
        const result = await openai.chat.completions.create({
            model: "llama-3.1-8b-instant", // Corregido el nombre del modelo
            messages: [
                {
                    role: "system",
                    content: `Eres el Ingeniero Jefe de Recepción en un centro de servicio técnico de dispositivos móviles.
Tu objetivo es traducir el reporte del cliente (muchas veces ambiguo) en un pre-diagnóstico técnico claro y directo.

REGLAS ESTRICTAS:
- Prohibido saludar, presentarte o despedirte.
- Prohibido inventar fallas no implícitas en el texto.
- Mantén un tono corporativo, analítico y tranquilizador.
- Responde ÚNICAMENTE usando la estructura de formato requerida, sin texto adicional.`
                },
                {
                    role: "user",
                    content: `
REPORTE DEL CLIENTE:
"${fallaReportada}"

FORMATO DE RESPUESTA REQUERIDO:

🔍 POSIBLE CAUSA:
[Descripción técnica de 1 línea]

🛠️ COMPONENTES A REVISAR:
[Lista de 1 a 3 componentes principales]

📊 DIFICULTAD ESTIMADA:
[Baja / Media / Alta] - [Justificación de 3 a 5 palabras]
`
                }
            ]
        });

        event.reply('respuesta-ia-recepcion', { success: true, text: result.choices[0].message.content });
    } catch (error) {
        event.reply('respuesta-ia-recepcion', { success: false, msg: error.message });
    }
});

ipcMain.on('ia-laboratorio', async (event, bitacoraTecnica) => {
    try {
        const result = await openai.chat.completions.create({
            model: "llama-3.1-8b-instant", // Corregido el nombre del modelo
            messages: [
                {
                    role: "system",
                    content: `Eres un Master en Microsoldadura y Arquitectura de Hardware, especializado en placas base de smartphones (ecosistemas Apple y Android), análisis de esquemáticos y fallas a nivel componente.

Tu objetivo es guiar a técnicos avanzados directo a la solución.

REGLAS ESTRICTAS:
- Asume que el técnico ya conoce lo básico (desarme, limpieza, inspección visual). Ve directo al grano.
- Menciona líneas específicas (ej. VCC_MAIN, I2C, VDD_BOOST), valores de caída de tensión (modo diodo), o ICs (PMIC, CPU, NAND, Tristar/Hydra).
- No des advertencias de seguridad genéricas.
- Prohibido usar texto de relleno. Responde solo con el formato.`
                },
                {
                    role: "user",
                    content: `
BITÁCORA DEL TÉCNICO:
"${bitacoraTecnica}"

FORMATO DE RESPUESTA REQUERIDO:

⚡ LÍNEAS A MEDIR:
[Nombres de líneas clave y mediciones sugeridas]

🔬 ICs IMPLICADOS:
[Circuitos integrados sospechosos]

🛠️ ACCIÓN TÉCNICA RECOMENDADA:
[Instrucción directa y avanzada de diagnóstico o soldadura]
`
                }
            ]
        });

        event.reply('respuesta-ia-laboratorio', { success: true, text: result.choices[0].message.content });
    } catch (error) {
        event.reply('respuesta-ia-laboratorio', { success: false, msg: error.message });
    }
});
// 3. Analista Financiero (Resumen Ejecutivo)
ipcMain.on('generar-resumen-financiero', async (event) => {
    try {
        const { data: ordenes, error } = await supabase
            .from('ordenes')
            .select('costo, estado, falla, modelo')
            .eq('empresa_id', empresaActual)
            .order('id', { ascending: false })
            .limit(30);

        if (error) throw error;

        let totalIngresos = 0;
        let completadas = 0;
        let fallasComunes = [];

        if (ordenes && ordenes.length > 0) {
            ordenes.forEach(o => {
                totalIngresos += parseFloat(o.costo || 0);
                if (o.estado === 'Completado' || o.estado === 'Entregado') completadas++;
                if (o.falla) fallasComunes.push(o.falla);
            });
        }

        const resumenDatos = `
        - Últimas órdenes analizadas: ${ordenes ? ordenes.length : 0}
        - Órdenes ya cobradas/completadas: ${completadas}
        - Dinero total movido: S/ ${totalIngresos.toFixed(2)}
        - Lista de equipos y fallas recientes: ${fallasComunes.join(', ').substring(0, 600)}...
        `;

        const result = await openai.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [
                {
                    role: "system",
                    content: `Eres el Analista Financiero de un centro de servicio técnico de reparación de celulares. 
Tu trabajo es leer los datos recientes y entregar un resumen ejecutivo brillante y directo para el dueño del negocio.

REGLAS ESTRICTAS:
1. Empieza con un párrafo corto analizando el rendimiento económico.
2. Luego, crea exactamente 2 viñetas (bullet points):
   - Una destacando el patrón de reparaciones (ej. qué tipo de fallas o equipos llegan más).
   - Una recomendación comercial estratégica.
3. Mantén un tono corporativo. Solo usa **negritas** para resaltar números y conceptos clave.`
                },
                {
                    role: "user",
                    content: `Aquí están los datos de mi taller:\n${resumenDatos}`
                }
            ]
        });

        event.reply('respuesta-resumen-financiero', { 
            success: true, 
            text: result.choices[0].message.content 
        });

    } catch (error) {
        console.error("Error en IA Financiera:", error);
        event.reply('respuesta-resumen-financiero', { success: false, msg: error.message });
    }
});
// === 15. BÚSQUEDAS ===
ipcMain.on('buscar-stock-tecnico', async (event, valor) => {
    try {
        const valorSeguro = String(valor || '').replace(/[,()]/g, '');
        const { data } = await supabase
            .from('productos')
            .select('*')
            .or(`nombre.ilike.%${valorSeguro}%,categoria.ilike.%${valorSeguro}%`)
            .eq('empresa_id', empresaActual)
            .limit(10);
        event.reply('resultados-stock-tecnico', data || []);
    } catch {
        event.reply('resultados-stock-tecnico', []);
    }
});

ipcMain.on('abrir-ambicion', (event) => {
    try {
        // En la app INSTALADA, __dirname apunta adentro de app.asar y Windows no puede
        // ejecutar un .exe desde ahí (ENOENT). El software vive como extraResource en
        // resources/software (ver package.json), así que la base correcta es:
        //   instalado  -> process.resourcesPath (C:\...\BlackHouse OS V2\resources)
        //   desarrollo -> __dirname (la carpeta del proyecto)
        const base = app.isPackaged ? process.resourcesPath : __dirname;
        const ambicionPath = path.join(base, 'software', 'ambicion', 'ambicion.exe');
        if (fs.existsSync(ambicionPath)) {
            const { spawn } = require('child_process');
            spawn(ambicionPath, [], { detached: true, stdio: 'ignore', cwd: path.dirname(ambicionPath) }).unref();
        } else {
            console.error("No se encontró el ejecutable de Ambicion en:", ambicionPath);
        }
    } catch (err) {
        console.error("Error abriendo Ambicion:", err);
    }
});

ipcMain.on('usar-repuesto-lab', async (event, params) => {
    try {
        const { ordenId, productoId, sku, nombre, precio } = params;

        // 1. Verificar y descontar stock
        const { data: prodData, error: errProd } = await supabase
            .from('productos')
            .select('stock, costo')
            .eq('id', productoId)
            .single();

        if (errProd || !prodData) throw new Error("Producto no encontrado");
        if (prodData.stock <= 0) throw new Error("Stock insuficiente");

        const nuevoStock = prodData.stock - 1;
        const { error: errUpdateProd } = await supabase
            .from('productos')
            .update({ stock: nuevoStock })
            .eq('id', productoId);
            
        if (errUpdateProd) throw new Error("Error al actualizar stock");

        // 2. Registrar movimiento de stock
        // (Antes este insert usaba columnas que NO existen en movimientos_stock —producto_id,
        //  tipo, origen, motivo, usuario— así que el movimiento nunca se guardaba y el stock
        //  quedaba sin historial. Se corrige a las columnas reales: sku/cantidad/proveedor/costo/nota.
        //  Salida => cantidad negativa, igual que el resto del sistema.)
        const { error: errMov } = await supabase.from('movimientos_stock').insert([{
            empresa_id: empresaActual,
            sku: sku || 'S/N',
            cantidad: -1,
            proveedor: 'CONSUMO TALLER',
            costo: prodData.costo || null,
            nota: `Repuesto usado en orden #${ordenId} - ${nombre}`
        }]);
        if (errMov) console.error('No se pudo registrar el movimiento de stock:', errMov.message);

        // 3. Actualizar la Orden
        let avisoMargen = null; // FASE 5: se llena si el precio cobrado queda bajo el costo real
        const { data: ordenData, error: errOrden } = await supabase
            .from('ordenes')
            .select('*')
            .eq('id', ordenId)
            .eq('empresa_id', empresaActual)
            .single();

        if (!errOrden && ordenData) {
            // Usar un repuesto del stock SOLO descuenta inventario y lo anota en la bitácora.
            // NO se suma el precio a la orden: el precio del repuesto lo define el dueño/técnico a
            // mano al crear la orden (a veces cobra un poco menos). Antes se sumaba precio_repuesto,
            // costo y saldo, lo que inflaba el total por encima de lo ya cargado.
            const nuevaBitacora = (ordenData.bitacora || '') + (ordenData.bitacora ? '\n' : '') + `✅ Repuesto utilizado (de stock): ${nombre}`;

            await supabase.from('ordenes').update({
                bitacora: nuevaBitacora
            }).eq('id', ordenId);

            // FASE 1 (plan finanzas): acumular el COSTO REAL del repuesto en la orden, tomado
            // automáticamente de productos.costo (no de lo que se cobra). Con esto el reporte puede
            // calcular la ganancia real. Update separado y tolerante: si la migración 008 aún no se
            // aplicó (columna inexistente), falla solo esto y la bitácora/stock ya quedaron bien.
            try {
                const costoUnit = parseFloat(prodData.costo) || 0;
                const nuevoCostoReal = (parseFloat(ordenData.costo_repuesto_real) || 0) + costoUnit;
                const { error: errCosto } = await supabase.from('ordenes')
                    .update({ costo_repuesto_real: nuevoCostoReal })
                    .eq('id', ordenId);
                if (errCosto) console.warn('No se pudo acumular costo_repuesto_real (¿falta migración 008?):', errCosto.message);

                // FASE 5 (plan finanzas): control de margen. Si lo que la orden cobra por repuesto
                // quedó por DEBAJO del costo real acumulado, se avisa (no se bloquea la reparación:
                // el repuesto ya se usó; el dueño decide si corrige el precio).
                const precioRep = parseFloat(ordenData.precio_repuesto) || 0;
                if (nuevoCostoReal > 0 && precioRep < nuevoCostoReal) {
                    avisoMargen = `La orden #${ordenId} cobra el repuesto a S/ ${precioRep.toFixed(2)} pero su costo real ya va en S/ ${nuevoCostoReal.toFixed(2)} (margen negativo). Revisar precio.`;
                }
            } catch (e) { console.warn('costo_repuesto_real:', e.message); }
        }

        event.reply('repuesto-usado-lab', { success: true, nombre, precio, avisoMargen });

    } catch (err) {
        event.reply('repuesto-usado-lab', { success: false, msg: err.message });
    }
});

// === REPUESTO EXTERNO (traído de otro proveedor porque no había en stock) ===
// Registra la compra externa (proveedor + costo) para el cierre del día y la anota en la orden.
// NO toca el inventario: nunca fue un producto propio.
ipcMain.on('registrar-repuesto-externo', async (event, params) => {
    try {
        const { ordenId, proveedor, descripcion, costo } = params || {};
        const prov = String(proveedor || '').trim();
        const desc = String(descripcion || '').trim();
        const cst = parseFloat(costo);
        if (!prov) throw new Error('Falta el nombre del proveedor');
        if (isNaN(cst) || cst < 0) throw new Error('El costo no es válido');

        const { error } = await supabase.from('compras_externas').insert([{
            empresa_id: empresaActual,
            orden_id: ordenId ? String(ordenId) : null,
            proveedor: prov,
            descripcion: desc || null,
            costo: cst,
            usuario: usuarioActual || null
        }]);
        if (error) throw error;

        // Anotar en la bitácora de la orden (si se indicó una orden válida de esta empresa).
        let avisoMargen = null; // FASE 5: se llena si el precio cobrado queda bajo el costo real
        if (ordenId) {
            const { data: ord } = await supabase.from('ordenes')
                .select('*')
                .eq('id', ordenId)
                .eq('empresa_id', empresaActual)
                .single();
            if (ord) {
                const nota = `🔻 Repuesto externo (${prov})${desc ? ' - ' + desc : ''} - pagado S/ ${cst}`;
                const nuevaBitacora = (ord.bitacora || '') + (ord.bitacora ? '\n' : '') + nota;
                await supabase.from('ordenes').update({ bitacora: nuevaBitacora }).eq('id', ordenId);

                // FASE 1 (plan finanzas): el costo pagado al proveedor externo también acumula en
                // costo_repuesto_real de la orden. Tolerante a que falte la migración 008.
                try {
                    const nuevoCostoReal = (parseFloat(ord.costo_repuesto_real) || 0) + cst;
                    const { error: errCosto } = await supabase.from('ordenes')
                        .update({ costo_repuesto_real: nuevoCostoReal })
                        .eq('id', ordenId);
                    if (errCosto) console.warn('No se pudo acumular costo_repuesto_real (¿falta migración 008?):', errCosto.message);

                    // FASE 5: control de margen (mismo criterio que usar-repuesto-lab).
                    const precioRep = parseFloat(ord.precio_repuesto) || 0;
                    if (nuevoCostoReal > 0 && precioRep < nuevoCostoReal) {
                        avisoMargen = `La orden #${ordenId} cobra el repuesto a S/ ${precioRep.toFixed(2)} pero su costo real ya va en S/ ${nuevoCostoReal.toFixed(2)} (margen negativo). Revisar precio.`;
                    }
                } catch (e) { console.warn('costo_repuesto_real:', e.message); }
            }
        }

        event.reply('repuesto-externo-registrado', { success: true, proveedor: prov, costo: cst, avisoMargen });
    } catch (err) {
        event.reply('repuesto-externo-registrado', { success: false, msg: err.message });
    }
});

// Reporte de compras externas de un día (por defecto hoy), para el cierre.
ipcMain.on('obtener-compras-externas-dia', async (event, params) => {
    try {
        // Bordes del día en hora LOCAL de la máquina (creado_en es timestamptz en UTC).
        const base = (params && params.fecha) ? new Date(params.fecha + 'T12:00:00') : new Date();
        const desde = new Date(base.getFullYear(), base.getMonth(), base.getDate(), 0, 0, 0, 0);
        const hasta = new Date(base.getFullYear(), base.getMonth(), base.getDate(), 23, 59, 59, 999);

        const { data, error } = await supabase.from('compras_externas')
            .select('*')
            .eq('empresa_id', empresaActual)
            .gte('creado_en', desde.toISOString())
            .lte('creado_en', hasta.toISOString())
            .order('creado_en', { ascending: true });
        if (error) throw error;

        const fechaTxt = `${desde.getFullYear()}-${String(desde.getMonth() + 1).padStart(2, '0')}-${String(desde.getDate()).padStart(2, '0')}`;
        event.reply('compras-externas-dia', { success: true, fecha: fechaTxt, items: data || [] });
    } catch (err) {
        event.reply('compras-externas-dia', { success: false, msg: err.message });
    }
});

// === IMPRESIÓN DE COMPROBANTES ===
// El renderer arma el HTML (documento A4 para PDF, o ticket 80mm) y lo manda acá. Se carga en una
// ventana oculta y se usa printToPDF (PDF real) o print con diálogo (para elegir la tickera).
// No usa librerías extra: todo con las APIs nativas de Electron.
ipcMain.on('imprimir-documento', async (event, params) => {
    let win = null;
    let tmpPath = null;
    const modo = (params && params.modo) || 'pdf';
    try {
        const { html, filename } = params || {};
        if (!html) throw new Error('No hay contenido para imprimir');

        tmpPath = path.join(app.getPath('temp'), `bh_doc_${Date.now()}.html`);
        fs.writeFileSync(tmpPath, html, 'utf8');

        win = new BrowserWindow({ show: false, webPreferences: {} });
        await win.loadFile(tmpPath);
        // Damos un momento para que rendericen imágenes/QR antes de imprimir.
        await new Promise(r => setTimeout(r, 450));

        if (modo === 'pdf') {
            const pdf = await win.webContents.printToPDF({ printBackground: true, pageSize: 'A4' });
            const destino = dialog.showSaveDialogSync({
                title: 'Guardar comprobante en PDF',
                defaultPath: path.join(app.getPath('downloads'), filename || 'comprobante.pdf'),
                filters: [{ name: 'PDF', extensions: ['pdf'] }]
            });
            if (destino) {
                fs.writeFileSync(destino, pdf);
                shell.openPath(destino);
                event.reply('documento-impreso', { success: true, modo: 'pdf' });
            } else {
                event.reply('documento-impreso', { success: false, modo: 'pdf', cancelado: true });
            }
            try { win.close(); } catch (e) {}
            win = null;
            if (tmpPath) fs.unlink(tmpPath, () => {});
        } else {
            // Ticket: abre el diálogo de impresión de Windows para elegir la tickera.
            win.webContents.print({ silent: false, printBackground: true }, (ok, reason) => {
                event.reply('documento-impreso', { success: ok, modo: 'ticket', cancelado: !ok, msg: ok ? null : (reason || 'cancelado') });
                try { if (win) { win.close(); win = null; } } catch (e) {}
                if (tmpPath) fs.unlink(tmpPath, () => {});
            });
        }
    } catch (err) {
        console.error('Error al imprimir documento:', err.message);
        event.reply('documento-impreso', { success: false, modo, msg: err.message });
        try { if (win) win.close(); } catch (e) {}
        if (tmpPath) { try { fs.unlink(tmpPath, () => {}); } catch (e) {} }
    }
});

ipcMain.on('busqueda-global', async (event, q) => {
    try {
        const qSeguro = String(q || '').replace(/[,()]/g, '');
        const { data } = await supabase
            .from('ordenes')
            .select('*')
            .or(`cliente.ilike.%${qSeguro}%,modelo.ilike.%${qSeguro}%,imei.ilike.%${qSeguro}%`)
            .eq('empresa_id', empresaActual)
            .limit(20);
        event.reply('resultados-busqueda-global', data || []);
    } catch {
        event.reply('resultados-busqueda-global', []);
    }
});

// === 16. MÓDULO DE ASISTENCIA MANUAL ===
ipcMain.on('marcar-asistencia-manual', async (event, data) => {
    try {
        // Validamos que el usuario tenga empresa asignada
        const asistenciaConEmpresa = {
            ...data,
            empresa_id: empresaActual
        };

        const { error } = await supabase
            .from('asistencia')
            .insert([asistenciaConEmpresa]);
        
        if (error) throw error;
        
        event.reply('asistencia-respuesta', { success: true });
    } catch (err) {
        console.error("Error al marcar asistencia:", err);
        event.reply('asistencia-respuesta', { success: false, msg: err.message });
    }
});

// === HANDLER: Cargar historial de facturas ===
ipcMain.on('obtener-facturas', async (event) => {
    const { data } = await supabase
        .from('facturas')
        .select('*')
        .eq('empresa_id', empresaActual)
        .order('id', { ascending: false });
    event.reply('lista-de-facturas', data || []);
});

// === MÓDULO DE DEVOLUCIONES (cliente devuelve un producto vendido) ===
// facturas.items_json es solo un snapshot de texto {nombre, precio, cantidad, subtotal} —
// NO tiene producto_id ni sku, así que el vínculo con el producto real de inventario se resuelve
// del lado del renderer (matching por nombre contra todosLosProductos) y viaja en el payload.

ipcMain.on('buscar-facturas-devolucion', async (event, texto) => {
    try {
        const termino = String(texto || '').trim();
        if (!termino) {
            event.reply('resultado-busqueda-facturas-devolucion', []);
            return;
        }
        const terminoSeguro = termino.replace(/[,()%]/g, '');
        const { data, error } = await supabase.from('facturas')
            .select('*')
            .eq('empresa_id', empresaActual)
            .or(`numero_comprobante.ilike.%${terminoSeguro}%,cliente_nombre.ilike.%${terminoSeguro}%`)
            .order('created_at', { ascending: false })
            .limit(20);
        if (error) throw error;
        event.reply('resultado-busqueda-facturas-devolucion', data || []);
    } catch (e) {
        console.error('Error buscando facturas para devolución:', e.message);
        event.reply('resultado-busqueda-facturas-devolucion', []);
    }
});

ipcMain.on('registrar-devolucion', async (event, payload) => {
    try {
        const {
            factura_id, producto_id, producto_nombre, cantidad,
            motivo, condicion, accion, monto, usuario
        } = payload || {};

        const cantidadNum = parseInt(cantidad, 10);
        if (!producto_nombre || !cantidadNum || cantidadNum <= 0) {
            throw new Error('Faltan datos obligatorios (producto y cantidad).');
        }
        if (!['buen_estado', 'defectuoso'].includes(condicion)) {
            throw new Error('Condición inválida.');
        }
        if (!['reembolso_efectivo', 'nota_credito', 'cambio_producto', 'ninguna'].includes(accion)) {
            throw new Error('Acción inválida.');
        }

        // factura_id llega del renderer: se verifica que pertenezca de verdad a esta empresa antes
        // de guardarlo, para no dejar que un devoluciones.factura_id apunte a la factura de OTRA
        // empresa (evita que el join embebido de obtener-devoluciones filtre datos ajenos).
        if (factura_id) {
            const { data: facturaValida, error: errFactura } = await supabase.from('facturas')
                .select('id')
                .eq('id', factura_id)
                .eq('empresa_id', empresaActual)
                .maybeSingle();
            if (errFactura) throw errFactura;
            if (!facturaValida) throw new Error('La factura indicada no pertenece a esta empresa.');
        }

        let stockActualizado = false;
        let avisoStock = null;

        // El ajuste de stock ocurre ANTES de insertar el registro de la devolución (y no al
        // revés): si el update de stock fallara a mitad de camino, no queremos que quede un
        // registro de devolución "fantasma" que dice haber reingresado stock sin haberlo hecho
        // de verdad. Solo reingresa stock si el producto vuelve en buen estado Y se pudo
        // identificar el producto real de inventario. Defectuoso o sin match = no se toca stock.
        if (condicion === 'buen_estado' && producto_id) {
            const { data: prod, error: errProd } = await supabase.from('productos')
                .select('id, sku, stock')
                .eq('id', producto_id)
                .eq('empresa_id', empresaActual)
                .single();
            if (errProd) throw errProd;

            const nuevoStock = (prod.stock || 0) + cantidadNum;
            const { error: errUpdate } = await supabase.from('productos')
                .update({ stock: nuevoStock })
                .eq('id', producto_id)
                .eq('empresa_id', empresaActual);
            if (errUpdate) throw errUpdate;
            stockActualizado = true;

            // movimientos_stock.sku es NOT NULL: si el producto no tiene SKU cargado (caso raro),
            // se omite el registro del movimiento sin bloquear la devolución completa.
            if (prod.sku) {
                const { error: errMov } = await supabase.from('movimientos_stock').insert([{
                    empresa_id: empresaActual,
                    sku: prod.sku,
                    cantidad: cantidadNum,
                    proveedor: 'DEVOLUCION CLIENTE',
                    nota: motivo || 'Devolución de cliente (buen estado)'
                }]);
                if (errMov) throw errMov;
            } else {
                avisoStock = 'Stock actualizado, pero no se registró en el historial de movimientos (el producto no tiene SKU).';
            }
        }

        const insertData = {
            empresa_id: empresaActual,
            factura_id: factura_id || null,
            producto_id: producto_id || null,
            producto_nombre,
            cantidad: cantidadNum,
            motivo: motivo || null,
            condicion,
            accion,
            monto: (monto !== undefined && monto !== null && monto !== '') ? parseFloat(monto) : null,
            usuario: usuario || null
        };

        const { data: devolucionCreada, error: errDevol } = await supabase.from('devoluciones')
            .insert([insertData])
            .select()
            .single();
        if (errDevol) throw errDevol;

        event.reply('devolucion-registrada', { success: true, id: devolucionCreada.id, stockActualizado, avisoStock });
    } catch (e) {
        console.error('Error registrando devolución:', e.message);
        event.reply('devolucion-registrada', { success: false, msg: e.message });
    }
});

ipcMain.on('obtener-devoluciones', async (event) => {
    try {
        // Select embebido (join) con facturas: seguro acá porque main.js habla directo con Supabase
        // con la llave de servicio (no es el proxy web restringido de web-limpia, que sí bloquea
        // recursos embebidos por seguridad). Sirve para mostrar comprobante/cliente en el historial
        // sin tener que cruzar manualmente contra la lista de facturas ya cargada en el renderer.
        const { data, error } = await supabase.from('devoluciones')
            .select('*, facturas(numero_comprobante, cliente_nombre)')
            .eq('empresa_id', empresaActual)
            .order('creado_en', { ascending: false })
            .limit(200);
        if (error) throw error;
        event.reply('lista-devoluciones', data || []);
    } catch (e) {
        console.error('Error obteniendo devoluciones:', e.message);
        event.reply('lista-devoluciones', []);
    }
});

// === HANDLER: Análisis CRM (clientes inactivos) ===
ipcMain.on('analisis-crm', async (event) => {
    try {
        // Clientes sin órdenes en los últimos 30 días
        const { data: clientes } = await supabase.from('clientes')
            .select('nombre, telefono, updated_at')
            .eq('empresa_id', empresaActual)
            .order('updated_at', { ascending: true })
            .limit(25);
        event.reply('datos-crm', clientes || []);
    } catch { event.reply('datos-crm', []); }
});

// === HANDLER: Buscar orden por ID (para el Laboratorio) ===
ipcMain.on('buscar-orden-id', async (event, id) => {
    const { data } = await supabase
        .from('ordenes')
        .select('*')
        .eq('id', id)
        .eq('empresa_id', empresaActual)
        .single();
    event.reply('respuesta-orden-id', data || null);
});

// === HANDLER: Guardar bitácora y cambiar estado ===
ipcMain.on('actualizar-bitacora-estado', async (event, data) => {
    try {
        const { error } = await supabase
            .from('ordenes')
            .update({ bitacora: data.bitacora, estado: data.estado })
            .eq('id', data.id)
            .eq('empresa_id', empresaActual);
        if (error) throw error;
        event.reply('bitacora-actualizada', { success: true });
    } catch (err) {
        event.reply('bitacora-actualizada', { success: false, msg: err.message });
    }
});

// === HANDLER: Cambiar estado de una orden ===
ipcMain.on('actualizar-estado-orden', async (event, data) => {
    const { error } = await supabase
        .from('ordenes')
        .update({ estado: data.estado })
        .eq('id', data.id)
        .eq('empresa_id', empresaActual);

    // FASE 6 (plan finanzas): sellar CUÁNDO se entregó, para que el Cierre del Día sepa qué día
    // se cobró el saldo. Update separado y tolerante: si falta la migración 009 falla solo esto.
    if (!error && data.estado === 'Entregado') {
        try {
            const { error: errFecha } = await supabase.from('ordenes')
                .update({ fecha_entregado: new Date().toISOString() })
                .eq('id', data.id)
                .eq('empresa_id', empresaActual);
            if (errFecha) console.warn('No se pudo sellar fecha_entregado (¿falta migración 009?):', errFecha.message);
        } catch (e) { console.warn('fecha_entregado:', e.message); }
    }
    event.reply('orden-actualizada', { success: !error });
});

// === HANDLER: Listar usuarios ===
ipcMain.on('obtener-usuarios', async (event) => {
    const { data } = await supabase
        .from('usuarios')
        .select('id, usuario, rol, estado')
        .eq('empresa_id', empresaActual)
        .order('id');
    event.reply('lista-de-usuarios', data || []);
});

// === HANDLER: Gestión de Resellers (Global, solo super admin) ===
ipcMain.on('obtener-resellers-admin', async (event) => {
    if (empresaActual !== 1) return event.reply('resellers-admin-respuesta', { success: false, msg: 'No autorizado' });
    try {
        const { data, error } = await supabase
            .from('usuarios')
            .select('id, nombre_completo, nickname, avatar, estado, pais')
            .eq('rol', 'reseller')
            .order('id');
        if (error) throw error;
        event.reply('resellers-admin-respuesta', { success: true, data: data || [] });
    } catch (e) {
        event.reply('resellers-admin-respuesta', { success: false, msg: e.message });
    }
});

ipcMain.on('guardar-reseller-admin', async (event, reseller) => {
    if (empresaActual !== 1) return event.reply('guardar-reseller-respuesta', { success: false, msg: 'No autorizado' });
    try {
        if (reseller.id) {
            const { error } = await supabase
                .from('usuarios')
                .update({
                    nombre_completo: reseller.nombre_completo,
                    nickname: reseller.nickname,
                    pais: reseller.pais,
                    avatar: reseller.avatar,
                    estado: reseller.estado
                })
                .eq('id', reseller.id)
                .eq('rol', 'reseller');
            if (error) throw error;
            event.reply('guardar-reseller-respuesta', { success: true, msg: 'Distribuidor actualizado con éxito' });
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('reseller_default_pass_123', salt);
            const username = 'reseller_' + Date.now();
            
            const { error } = await supabase
                .from('usuarios')
                .insert([{
                    usuario: username,
                    password: hashedPassword,
                    rol: 'reseller',
                    estado: reseller.estado,
                    nombre_completo: reseller.nombre_completo,
                    nickname: reseller.nickname,
                    pais: reseller.pais,
                    avatar: reseller.avatar
                }]);
            if (error) throw error;
            event.reply('guardar-reseller-respuesta', { success: true, msg: 'Distribuidor creado con éxito' });
        }
    } catch (e) {
        event.reply('guardar-reseller-respuesta', { success: false, msg: e.message });
    }
});

ipcMain.on('eliminar-reseller-admin', async (event, id) => {
    if (empresaActual !== 1) return event.reply('eliminar-reseller-respuesta', { success: false, msg: 'No autorizado' });
    try {
        const { error } = await supabase
            .from('usuarios')
            .delete()
            .eq('id', id)
            .eq('rol', 'reseller');
        if (error) throw error;
        event.reply('eliminar-reseller-respuesta', { success: true, msg: 'Distribuidor eliminado con éxito' });
    } catch (e) {
        event.reply('eliminar-reseller-respuesta', { success: false, msg: e.message });
    }
});



// === CIERRE ===
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
ipcMain.on('registrar-salida-manual', async (event, data) => {
    try {
        const { error } = await supabase
            .from('asistencia')
            .update({ hora_salida: data.hora_salida })
            .eq('usuario', data.usuario)
            .eq('fecha', data.fecha)
            .eq('empresa_id', empresaActual);
        
        if (error) throw error;
        
        event.reply('salida-respuesta', { success: true });
    } catch (err) {
        event.reply('salida-respuesta', { success: false, msg: err.message });
    }
});
async function registrarFeed(usuario, mensaje) {
    await supabase.from('feed_taller').insert([
        { 
            usuario: usuario, 
            mensaje: mensaje, 
            created_at: new Date().toISOString() 
        }
    ]);
}