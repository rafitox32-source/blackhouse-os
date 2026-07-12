const { contextBridge, ipcRenderer } = require('electron');

// Lista blanca de canales IPC (hardening fase 1 - tarea 1b).
// Generada cruzando ipcMain.on/handle en main.js contra ipcRenderer.send/on/invoke
// en index.html. Un canal fuera de estas listas se ignora y se loguea con console.warn.
const CANALES_SEND = [
    'abrir-carpeta', 'abrir-carpeta-plantillas', 'abrir-pagina-descarga',
    'actualizar-bitacora-estado', 'actualizar-estado-orden', 'actualizar-grupo-compatibilidad',
    'agregar-modelo-nuevo', 'agregar-subcategoria-custom', 'analisis-crm',
    'analizar-compatibilidad-archivo', 'analizar-documento-ia', 'buscar-facturas-devolucion',
    'buscar-orden-id', 'buscar-stock-tecnico', 'busqueda-global', 'cambiar-estado-usuario',
    'cerrar-sesion-token', 'crear-codigo-automatico', 'crear-grupo-compatibilidad',
    'crear-usuario-nuevo', 'eliminar-grupo-compatibilidad', 'eliminar-producto',
    'eliminar-proveedor-db', 'eliminar-reseller-admin', 'emitir-factura-saas',
    'generar-resumen-financiero', 'guardar-cliente', 'guardar-datos-empresa',
    'guardar-mi-perfil', 'guardar-orden', 'guardar-proveedor-db', 'guardar-reseller-admin',
    'ia-laboratorio', 'ia-recepcion', 'importar-excel-inventario', 'iniciar-sesion',
    'iniciar-sesion-token', 'instalar-actualizacion-ahora', 'marcar-asistencia-manual',
    'nuevo-producto-sql', 'obtener-clientes', 'obtener-datos-reporte', 'obtener-devoluciones',
    'obtener-estado-plan', 'obtener-facturas', 'obtener-grupos-compatibilidad',
    'obtener-marcas-modelos', 'obtener-ordenes', 'obtener-productos', 'obtener-proveedores-db',
    'obtener-resellers-admin', 'obtener-subcategorias-custom', 'obtener-usuarios',
    'pedir-datos-empresa', 'pedir-version', 'preview-excel-inventario', 'registrar-devolucion',
    'registrar-nuevo-cliente-saas', 'registrar-salida-manual', 'verificar-2fa',
    'vincular-producto-a-grupo'
];

const CANALES_ON = [
    'actualizacion-disponible', 'actualizacion-lista', 'asistencia-respuesta',
    'bitacora-actualizada', 'codigo-creado-exito', 'datos-crm', 'datos-empresa-respuesta',
    'datos-reporte', 'devolucion-registrada', 'eliminar-reseller-respuesta',
    'estado-plan-respuesta', 'factura-emitida-exito', 'grupo-compatibilidad-eliminado',
    'grupo-compatibilidad-guardado', 'guardar-reseller-respuesta', 'lista-de-clientes',
    'lista-de-facturas', 'lista-de-ordenes', 'lista-de-productos', 'lista-de-usuarios',
    'lista-devoluciones', 'lista-grupos-compatibilidad', 'login-respuesta',
    'marcas-modelos-respuesta', 'orden-actualizada', 'perfil-guardado-exito',
    'preview-excel-resultado', 'producto-eliminado', 'producto-guardado',
    'producto-vinculado-a-grupo', 'proveedores-db-respuesta', 'recibir-version',
    'registro-saas-respuesta', 'resellers-admin-respuesta', 'respuesta-analisis-compatibilidad',
    'respuesta-analisis-ia', 'respuesta-ia-laboratorio', 'respuesta-ia-recepcion',
    'respuesta-orden-id', 'respuesta-resumen-financiero', 'resultado-2fa',
    'resultado-busqueda-facturas-devolucion', 'resultado-cambio-estado', 'resultado-cliente',
    'resultado-datos-empresa', 'resultado-guardado', 'resultado-importacion-excel',
    'resultado-usuario', 'resultados-busqueda-global', 'resultados-stock-tecnico',
    'salida-respuesta', 'subcategorias-custom-lista'
];

const CANALES_INVOKE = [
    'actualizar-producto-detalle', 'ajustar-stock-manual', 'obtener-historial-producto'
];

// Esto expone de forma segura 'ipcRenderer' al mundo de tu index.html
contextBridge.exposeInMainWorld('ipcRenderer', {
    send: (channel, ...args) => {
        if (!CANALES_SEND.includes(channel)) {
            console.warn(`[preload] Canal 'send' no autorizado, ignorado: ${channel}`);
            return;
        }
        // Envia datos desde el HTML hacia main.js
        ipcRenderer.send(channel, ...args);
    },
    on: (channel, func) => {
        if (!CANALES_ON.includes(channel)) {
            console.warn(`[preload] Canal 'on' no autorizado, ignorado: ${channel}`);
            return;
        }
        // Escucha respuestas desde main.js hacia el HTML
        // Empaquetamos la función para no exponer el objeto 'event' completo por seguridad
        ipcRenderer.on(channel, (event, ...args) => func(event, ...args));
    },
    invoke: (channel, ...args) => {
        if (!CANALES_INVOKE.includes(channel)) {
            console.warn(`[preload] Canal 'invoke' no autorizado, ignorado: ${channel}`);
            return Promise.reject(new Error(`Canal no autorizado: ${channel}`));
        }
        // Para peticiones asíncronas de doble vía
        return ipcRenderer.invoke(channel, ...args);
    }
});
