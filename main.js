const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// === 1. CONEXIÓN A TU NUBE ===
const supabaseUrl = 'https://flfhpffslhjcuvhxsnjz.supabase.co'; 
const supabaseKey = 'sb_publishable_nVJCp4k3KM_UCYRmc-jatA_lOEZT8-0'; 
const supabase = createClient(supabaseUrl, supabaseKey);

let mainWindow;
let empresaActual = null; 
let rolActual = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200, height: 800,
    webPreferences: { nodeIntegration: true, contextIsolation: false }
  });
  mainWindow.loadFile('index.html');
}

app.whenReady().then(createWindow);

// === 2. LOGIN INTELIGENTE (FILTRA POR EMPRESA Y FECHA) ===
ipcMain.on('iniciar-sesion', async (event, data) => {
    try {
        console.log("Intentando entrar con:", data.usuario);
        
        // 1. Buscamos al usuario por nombre y contraseña
        const { data: users, error } = await supabase
            .from('usuarios')
            .select('*')
            .eq('usuario', data.usuario)
            .eq('password', data.password)
            .eq('estado', 'activo')
            .single();

        if (error || !users) {
            return event.reply('login-respuesta', { success: false, msg: 'Usuario o contraseña incorrectos' });
        }

        // 2. 🚨 NUEVO: Verificamos el estado de la suscripción de su empresa
        const { data: empresaData, error: errEmpresa } = await supabase
            .from('empresas')
            .select('fecha_de_vencimiento')
            .eq('id', users.empresa_id)
            .single();

        if (errEmpresa || !empresaData) {
            return event.reply('login-respuesta', { success: false, msg: 'Error al verificar la licencia del taller.' });
        }

        // 3. 🚨 EL BLOQUEO: Comparamos las fechas (Excepto si eres tú, la Empresa 1)
        if (users.empresa_id !== 1 && empresaData.fecha_de_vencimiento) {
            // Convertimos la fecha de Supabase a formato de JavaScript
            const fechaVencimiento = new Date(empresaData.fecha_de_vencimiento);
            const hoy = new Date();
            
            // Si el día de hoy es MAYOR a la fecha de vencimiento... ¡Bloqueado!
            if (hoy > fechaVencimiento) {
                return event.reply('login-respuesta', { 
                    success: false, 
                    msg: `⛔ Licencia Vencida. Tu acceso caducó el ${empresaData.fecha_de_vencimiento}. Escríbenos al WhatsApp para renovar.` 
                });
            }
        }

        // 4. Si no está vencido (o eres el dueño), le damos la bienvenida
        empresaActual = users.empresa_id;
        rolActual = users.rol;
        console.log("¡Login exitoso! Empresa:", empresaActual);

        event.reply('login-respuesta', {
            success: true,
            usuario: users.usuario,
            rol: users.rol,
            empresa_id: users.empresa_id 
        });

    } catch (err) {
        console.error("Error fatal en login:", err);
        event.reply('login-respuesta', { success: false, msg: 'Error de conexión al servidor' });
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

// === 4. INVENTARIO (SOLO DE MI EMPRESA) ===
ipcMain.on('nuevo-producto-sql', async (event, prod) => {
    try {
        await supabase.from('productos').insert([{ 
            nombre: prod.nombre, 
            categoria: prod.categoria, 
            costo: parseFloat(prod.costo), 
            precio: parseFloat(prod.precio), 
            stock: parseInt(prod.stock), 
            proveedor: prod.proveedor,
            empresa_id: empresaActual 
        }]);
        event.reply('producto-guardado');
    } catch(e) { console.error(e); }
});

ipcMain.on('obtener-productos', async (event) => {
    const { data } = await supabase.from('productos')
        .select('*')
        .eq('empresa_id', empresaActual)
        .order('id', { ascending: false });
    event.reply('lista-de-productos', data || []);
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
    if(data) {
        data.forEach(o => { 
            total += parseFloat(o.costo || 0); 
            if(o.estado === 'Completado' || o.estado === 'Entregado') reparados++; 
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

        const { error } = await supabase.from('usuarios').insert([{ 
            usuario: data.usuario, 
            password: data.password, 
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

        // Descomenta estas dos líneas ABAJO cuando agregues las columnas en Supabase
        // datosActualizar.direccion = data.direccion;
        // datosActualizar.telefono = data.telefono;

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
            event.reply('cargar-datos-empresa', empresaData);
        }
    } catch (error) {
        console.error("Error al pedir datos:", error);
    }
});

// === 10. GENERADOR AUTOMÁTICO DE LICENCIAS (SÓLO ADMIN) ===
ipcMain.on('crear-codigo-automatico', async (event, data) => {
    try {
        // 🚨 CANDADO SÚPER ADMIN: Solo tú (Empresa 1) puedes generar códigos
        if (empresaActual !== 1) {
            console.warn("Intento de generación de licencia bloqueado. Usuario no autorizado.");
            return;
        }

        const caracteresLocos = Math.random().toString(36).substring(2, 8).toUpperCase();
        const codigoFinal = `BH-PRO-${caracteresLocos}`;
        
        // Atrapamos los meses enviados desde tu index.html. Si no envía nada, asume 1 mes.
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
        // 1. Validar la licencia en la tabla 'licencias'
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

        // 2. Calcular la fecha de vencimiento exacta
        const mesesAdquiridos = licenciaData.meses_duracion || 1;
        const fechaVencimiento = new Date();
        fechaVencimiento.setMonth(fechaVencimiento.getMonth() + mesesAdquiridos);
        const fechaSQL = fechaVencimiento.toISOString().split('T')[0]; // Formato YYYY-MM-DD

        // 3. Crear empresa con su fecha de caducidad
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

        // 4. Crear el usuario administrador de este nuevo taller
        const { error: errUser } = await supabase
            .from('usuarios')
            .insert([{ 
                usuario: data.usuario, 
                password: data.password, 
                rol: 'dueno', 
                estado: 'activo',
                empresa_id: idGenerado 
            }]);

        if (errUser) throw errUser;

        // 5. Quemar la licencia (usada = true)
        const { error: errUpdateLic } = await supabase
            .from('licencias')
            .update({ usada: true })
            .eq('id', licenciaData.id);

        if (errUpdateLic) throw errUpdateLic;

        // Éxito total
        event.reply('registro-saas-respuesta', { success: true });

    } catch (err) {
        console.error("Error en el registro:", err);
        event.reply('registro-saas-respuesta', { success: false, msg: err.message });
    }
});
// === 12. MÓDULO DE FACTURACIÓN AUTOMÁTICA ===
ipcMain.on('emitir-factura-saas', async (event, data) => {
    try {
        // 1. Buscamos el último comprobante del mismo tipo para esta empresa
        const { data: ultimasFacturas, error: errConsulta } = await supabase
            .from('facturas')
            .select('numero_comprobante')
            .eq('empresa_id', empresaActual)
            .eq('tipo', data.tipo)
            .order('id', { ascending: false })
            .limit(1);

        if (errConsulta) throw errConsulta;

        // 2. Calculamos el siguiente número correlativo (Matemática simple)
        let siguienteNumero = 1;
        if (ultimasFacturas && ultimasFacturas.length > 0 && ultimasFacturas[0].numero_comprobante) {
            // Separa el texto "BBB-0005" y se queda con el "5", luego le suma 1
            const partes = ultimasFacturas[0].numero_comprobante.split('-');
            if (partes.length === 2) {
                siguienteNumero = parseInt(partes[1]) + 1;
            }
        }

        // 3. Asignamos la letra según el tipo (F para Factura, B para Boleta, N para Nota)
        let prefijo = 'NOT';
        if (data.tipo === 'Factura') prefijo = 'FFF';
        if (data.tipo === 'Boleta') prefijo = 'BBB';
        
        // Formateamos para que siempre tenga 4 ceros (Ej: BBB-0001)
        const numeroFinal = `${prefijo}-${String(siguienteNumero).padStart(4, '0')}`;

        // 4. Guardamos todo en la base de datos
        const { error } = await supabase
            .from('facturas')
            .insert([{
                empresa_id: empresaActual,
                orden_id: data.ordenId,
                numero_comprobante: numeroFinal,
                tipo: data.tipo,
                cliente_documento: data.documento || 'S/N', // S/N = Sin Número si lo dejan vacío
                monto_total: parseFloat(data.total)
            }]);

        if (error) throw error;

        // 5. Le avisamos a la pantalla que fue un éxito
        event.reply('factura-emitida-exito', { numero: numeroFinal, tipo: data.tipo });

    } catch (err) {
        console.error("Error al emitir comprobante:", err);
    }
});

// Limpieza básica al cerrar
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });