const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

console.log("Groq key cargada:", !!process.env.GROQ_API_KEY);

const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const { autoUpdater } = require('electron-updater');
const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');
const bcrypt = require('bcryptjs');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const openai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY, 
    baseURL: "https://api.groq.com/openai/v1" // 🚨 Este es el truco de magia
});

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

const fs = require('fs');
let devicesCache = null;
try {
    const cachePath = path.join(__dirname, 'devices_cache.json');
    console.log("🔍 [Catálogo] Buscando archivo en:", cachePath);
    if (fs.existsSync(cachePath)) {
        devicesCache = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
        console.log("✨ [Catálogo] Cargado con éxito. Marcas encontradas:", Object.keys(devicesCache).length);
    } else {
        console.warn("⚠️ [Catálogo] No se encontró el archivo en la ruta especificada.");
    }
} catch (e) {
    console.error("❌ [Catálogo] Error al cargar:", e);
}

let mainWindow = null;
let empresaActual = null;
let rolActual = null;
const otpMemoryCache = new Map(); // Fallback en memoria si faltan columnas de base de datos

// === FUNCIÓN DE VERIFICACIÓN DE IP ===
const https = require('https');

async function obtenerIPPublica() {
    return new Promise((resolve) => {
        const req = https.get('https://api.ipify.org?format=json', (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try { resolve(JSON.parse(data).ip); }
                catch { resolve(null); }
            });
        });
        req.on('error', () => resolve(null));
        req.setTimeout(4000, () => { req.destroy(); resolve(null); });
    });
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        icon: path.join(__dirname, 'assets', 'icon.png'),
        webPreferences: {
            nodeIntegration: false, // Se mantiene en false por seguridad
            contextIsolation: true, // Se mantiene en true por seguridad
            preload: path.join(__dirname, 'preload.js') // 🚨 AÑADE ESTA LÍNEA AQUÍ
        }
    });

    mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
    createWindow();
    
    // Configuración de actualizaciones automáticas
    autoUpdater.checkForUpdatesAndNotify();

    autoUpdater.on('update-available', () => {
        dialog.showMessageBox({
            type: 'info',
            title: 'Actualización Disponible',
            message: 'Una nueva versión de BlackHouse OS está disponible. Se descargará en segundo plano.'
        });
    });

    autoUpdater.on('update-downloaded', () => {
        dialog.showMessageBox({
            type: 'info',
            title: 'Actualización Lista',
            message: 'La actualización se ha descargado. Se instalará automáticamente la próxima vez que inicies la aplicación.'
        });
    });

    // Exponer versión al frontend
    ipcMain.on('pedir-version', (event) => {
        event.reply('recibir-version', app.getVersion());
    });

    // === CREAR CARPETAS FIRMWARE Y DUMP AL INICIAR ===
    const firmwarePath = path.join(__dirname, 'Firmware');
    const dumpPath = path.join(__dirname, 'Dump');
    if (!fs.existsSync(firmwarePath)) {
        fs.mkdirSync(firmwarePath, { recursive: true });
        console.log('📁 [Carpeta] Firmware/ creada en:', firmwarePath);
    }
    if (!fs.existsSync(dumpPath)) {
        fs.mkdirSync(dumpPath, { recursive: true });
        console.log('📁 [Carpeta] Dump/ creada en:', dumpPath);
    }
});

// === ABRIR CARPETAS FIRMWARE / DUMP ===
ipcMain.on('abrir-carpeta', (event, tipo) => {
    const carpeta = tipo === 'firmware' 
        ? path.join(__dirname, 'Firmware') 
        : path.join(__dirname, 'Dump');
    if (!fs.existsSync(carpeta)) fs.mkdirSync(carpeta, { recursive: true });
    shell.openPath(carpeta);
});

// === OBTENER MARCAS Y MODELOS DE DISPOSITIVOS ===
ipcMain.on('obtener-marcas-modelos', (event) => {
    event.reply('marcas-modelos-respuesta', devicesCache || {});
});

// === 2. LOGIN INTELIGENTE (FILTRA POR EMPRESA Y FECHA) ===
ipcMain.on('iniciar-sesion', async (event, data) => {
    try {
        console.log("=== INICIO DE LOGIN ===");
        console.log("Intentando entrar con usuario:", data.usuario);
        console.log("Contraseña recibida:", data.password);

        // 1. Buscamos al usuario
        console.log("Paso 1: Buscando en tabla usuarios...");
        const { data: users, error } = await supabase
            .from('usuarios')
            .select('*')
            .eq('usuario', data.usuario)
            .eq('estado', 'activo')
            .single();

        if (error || !users) {
            console.error('Login query error (Paso 1):', error);
            return event.reply('login-respuesta', { success: false, msg: 'Usuario no encontrado o inactivo' });
        }
        
        console.log("Usuario encontrado:", users.usuario, "Empresa ID:", users.empresa_id);

        // 2. Validamos la contraseña
        console.log("Paso 2: Validando contraseña...");
        const contrasenaValida = (data.password === users.password) || await bcrypt.compare(data.password, users.password).catch(() => false);

        if (!contrasenaValida) {
            console.log("Error: Contraseña incorrecta");
            return event.reply('login-respuesta', { success: false, msg: 'Contraseña incorrecta' });
        }

        console.log("Contraseña correcta.");

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

       // 5. VERIFICACIÓN DE IP
        if (users.empresa_id !== 1) {
            console.log("Paso 5: Verificando IP...");
            const ipActual = await obtenerIPPublica();
            if (ipActual) {
                const { data: empIP } = await supabase
                    .from('empresas')
                    .select('ip_autorizada')
                    .eq('id', users.empresa_id)
                    .single();

                if (empIP) {
                    if (!empIP.ip_autorizada) {
                        await supabase.from('empresas')
                            .update({ ip_autorizada: ipActual })
                            .eq('id', users.empresa_id);
                        console.log(`IP registrada por primera vez: ${ipActual}`);
                    } else if (empIP.ip_autorizada !== ipActual) {
                        console.log("Error: IP no coincide", empIP.ip_autorizada, "vs", ipActual);
                        return event.reply('login-respuesta', {
                            success: false,
                            msg: `🔒 Acceso bloqueado: Esta licencia está asociada a otro equipo o ubicación. Comunícate con soporte para transferir tu acceso.\n\nWhatsApp Soporte: +51 XXX XXX XXX`
                        });
                    }
                }
            }
        }

        console.log("=== LOGIN EXITOSO ===");
        
        // Establecer las variables de estado global de la sesión en el main.js
        empresaActual = users.empresa_id;
        rolActual = users.rol;

        // 6. Login Directo
        event.reply('login-respuesta', {
            success: true,
            usuario: users.usuario,
            rol: users.rol,
            empresa_id: users.empresa_id,
            nombre_completo: users.nombre_completo || '',
            nickname: users.nickname || users.usuario,
            avatar: users.avatar || ''
        });

    } catch (err) {
        console.error("Error fatal en login:", err);
        event.reply('login-respuesta', { success: false, msg: 'Error de conexión al servidor' });
    }
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

        console.log(`🔒 [2FA] Verificación exitosa para el usuario: ${usuario}`);

        // Enviamos el payload final al renderer
        event.reply('resultado-2fa', {
            success: true,
            ...userPayload
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
        const { error } = await supabase.from('clientes').insert([cliente]);
        if (error) throw error;
        event.reply('resultado-cliente', { success: true, msg: 'Cliente guardado' });
    } catch (err) { event.reply('resultado-cliente', { success: false, msg: 'Error al guardar' }); }
});

ipcMain.on('obtener-clientes', async (event) => {
    const { data } = await supabase.from('clientes')
        .select('*')
        .eq('empresa_id', empresaActual)
        .order('id', { ascending: false });
    event.reply('lista-de-clientes', data || []);
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
            costo: parseFloat(prod.costo) || 0,
            precio: parseFloat(prod.precio) || 0,
            stock: parseInt(prod.stock) || 0,
            proveedor: prod.proveedor || '',
            empresa_id: empresaActual
        };
        // Agregar SKU si viene
        if (prod.sku) insertData.sku = prod.sku;
        
        await supabase.from('productos').insert([insertData]);
        event.reply('producto-guardado');
    } catch (e) { console.error(e); }
});

ipcMain.on('obtener-productos', async (event) => {
    const { data } = await supabase.from('productos')
        .select('*')
        .eq('empresa_id', empresaActual)
        .order('id', { ascending: false });
    event.reply('lista-de-productos', data || []);
});

// === 4B. IMPORTACIÓN DESDE EXCEL - PREVIEW ===
ipcMain.on('preview-excel-inventario', async (event, productos) => {
    try {
        // Obtener todos los productos actuales de la empresa
        const { data: productosDB } = await supabase.from('productos')
            .select('*')
            .eq('empresa_id', empresaActual);

        const existentes = productosDB || [];
        const items = [];
        const errores = [];

        for (const prod of productos) {
            let encontrado = null;

            // Buscar por SKU primero (si tiene)
            if (prod.sku) {
                encontrado = existentes.find(e => 
                    e.sku && e.sku.toLowerCase() === prod.sku.toLowerCase()
                );
            }

            // Fallback: buscar por nombre + categoría
            if (!encontrado) {
                encontrado = existentes.find(e =>
                    e.nombre.toLowerCase().trim() === prod.nombre.toLowerCase().trim() &&
                    (e.categoria || '').toLowerCase().trim() === (prod.categoria || '').toLowerCase().trim()
                );
            }

            if (encontrado) {
                items.push({
                    ...prod,
                    accion: 'actualizar',
                    stockActual: encontrado.stock,
                    productoId: encontrado.id
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

        event.reply('preview-excel-resultado', { items, errores });
    } catch (e) {
        console.error('Error en preview Excel:', e);
        event.reply('preview-excel-resultado', { items: [], errores: ['Error al consultar la base de datos: ' + e.message] });
    }
});

// === 4C. IMPORTACIÓN DESDE EXCEL - EJECUTAR UPSERT ===
ipcMain.on('importar-excel-inventario', async (event, productos) => {
    try {
        let nuevos = 0;
        let actualizados = 0;
        const erroresImport = [];

        for (const prod of productos) {
            try {
                if (prod.accion === 'actualizar' && prod.productoId) {
                    // ACTUALIZAR: Sumar cantidad al stock existente
                    const nuevoStock = (prod.stockActual || 0) + (prod.cantidad || 0);
                    const updateData = { stock: nuevoStock };
                    
                    // Actualizar precio/costo solo si vienen con valor > 0
                    if (prod.precio > 0) updateData.precio = prod.precio;
                    if (prod.costo > 0) updateData.costo = prod.costo;
                    if (prod.sku) updateData.sku = prod.sku;

                    await supabase.from('productos')
                        .update(updateData)
                        .eq('id', prod.productoId);
                    actualizados++;
                } else {
                    // INSERTAR: Crear nuevo producto
                    const insertData = {
                        nombre: prod.nombre,
                        categoria: prod.categoria,
                        stock: prod.cantidad || 0,
                        costo: prod.costo || 0,
                        precio: prod.precio || 0,
                        proveedor: '',
                        empresa_id: empresaActual
                    };
                    if (prod.sku) insertData.sku = prod.sku;

                    await supabase.from('productos').insert([insertData]);
                    nuevos++;
                }
            } catch (rowErr) {
                erroresImport.push(`Error con "${prod.nombre}": ${rowErr.message}`);
            }
        }

        event.reply('resultado-importacion-excel', {
            success: true,
            nuevos,
            actualizados,
            errores: erroresImport
        });
    } catch (e) {
        console.error('Error en importación Excel:', e);
        event.reply('resultado-importacion-excel', {
            success: false,
            msg: e.message
        });
    }
});


// === 5. ORDENES/TALLER (SOLO DE MI EMPRESA) ===
ipcMain.on('guardar-orden', async (event, orden) => {
    try {
        const { data, error } = await supabase.from('ordenes').insert([{
            ...orden,
            empresa_id: empresaActual,
            costo: parseFloat(orden.costo),
            precio_repuesto: parseFloat(orden.precio_repuesto),
            precio_servicio: parseFloat(orden.precio_servicio),
            adelanto: parseFloat(orden.adelanto),
            saldo: parseFloat(orden.saldo)
        }]).select();
        if (error) throw error;
        event.reply('resultado-guardado', { success: true, id: data[0].id });
    } catch (err) { console.error(err); }
});

ipcMain.on('obtener-ordenes', async (event) => {
    const { data } = await supabase.from('ordenes')
        .select('*')
        .eq('empresa_id', empresaActual)
        .order('id', { ascending: false });
    event.reply('lista-de-ordenes', data || []);
});

// === 6. REPORTES (SUMA SOLO EL DINERO DE MI EMPRESA) ===
ipcMain.on('obtener-datos-reporte', async (event) => {
    const { data } = await supabase.from('ordenes')
        .select('costo, estado')
        .eq('empresa_id', empresaActual);

    let total = 0, reparados = 0;
    if (data) {
        data.forEach(o => {
            total += parseFloat(o.costo || 0);
            if (o.estado === 'Completado' || o.estado === 'Entregado') reparados++;
        });
    }
    event.reply('datos-reporte', {
        totalIngresos: total,
        totalOrdenes: data ? data.length : 0,
        totalReparados: reparados,
        grafica: { labels: ['Ventas'], values: [total] }
    });
});

// === 7. GESTIÓN DE USUARIOS (SOLO DE MI EMPRESA) ===
ipcMain.on('crear-usuario-nuevo', async (event, data) => {
    if (rolActual !== 'dueno') {
        event.reply('resultado-usuario', { success: false, msg: 'Acceso Denegado: No tienes permisos de Administrador.' });
        return;
    }

    try {
        const { count, error: countError } = await supabase
            .from('usuarios')
            .select('*', { count: 'exact', head: true })
            .eq('empresa_id', empresaActual);

        if (countError) throw countError;

        const LIMITE_PLAN_BASICO = 3;

        if (count >= LIMITE_PLAN_BASICO) {
            event.reply('resultado-usuario', {
                success: false,
                msg: `💎 Límite de ${LIMITE_PLAN_BASICO} usuarios alcanzado. Contacta a soporte para mejorar tu licencia.`
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
    const idParaConsultar = data.empresaId;

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
        const datosActualizar = { nombre: data.nombre };

        const { error } = await supabase
            .from('empresas')
            .update(datosActualizar)
            .eq('id', data.id);

        if (error) throw error;

        event.reply('resultado-datos-empresa', { success: true });
    } catch (error) {
        event.reply('resultado-datos-empresa', { success: false, msg: error.message });
    }
});

ipcMain.on('pedir-datos-empresa', async (event, data) => {
    try {
        const { data: empresaData, error } = await supabase
            .from('empresas')
            .select('*')
            .eq('id', data.id)
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
                monto_total: parseFloat(data.total)
            }]);

        if (error) throw error;

        event.reply('factura-emitida-exito', { numero: numeroFinal, tipo: data.tipo });

    } catch (err) {
        console.error("Error al emitir comprobante:", err);
    }
});

// === 13. ACTUALIZAR PERFIL DE USUARIO ===
ipcMain.on('guardar-mi-perfil', async (event, data) => {
    try {
        const { error } = await supabase
            .from('usuarios')
            .update({
                nombre_completo: data.nombre_completo,
                nickname: data.nickname,
                avatar: data.avatar
            })
            .eq('usuario', data.usuario_original);

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
        const { data } = await supabase
            .from('productos')
            .select('*')
            .or(`nombre.ilike.%${valor}%,categoria.ilike.%${valor}%`)
            .eq('empresa_id', empresaActual)
            .limit(10);
        event.reply('resultados-stock-tecnico', data || []);
    } catch {
        event.reply('resultados-stock-tecnico', []);
    }
});

ipcMain.on('busqueda-global', async (event, q) => {
    try {
        const { data } = await supabase
            .from('ordenes')
            .select('*')
            .or(`cliente.ilike.%${q}%,modelo.ilike.%${q}%,imei.ilike.%${q}%`)
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

// === HANDLER PARA RESETEAR IP (Solo super admin puede usarlo) ===
ipcMain.on('reset-ip-empresa', async (event, data) => {
    if (empresaActual !== 1) return; // Solo tú (empresa ID=1) puedes hacer esto
    const { error } = await supabase
        .from('empresas')
        .update({ ip_autorizada: null })
        .eq('id', data.empresaId);
    event.reply('reset-ip-respuesta', {
        success: !error,
        msg: error ? error.message : `IP reseteada correctamente para empresa ID: ${data.empresaId}`
    });
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

// === HANDLER: Gestión de Resellers (Global) ===
ipcMain.on('obtener-resellers-admin', async (event) => {
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
                .eq('id', reseller.id);
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
    try {
        const { error } = await supabase
            .from('usuarios')
            .delete()
            .eq('id', id);
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