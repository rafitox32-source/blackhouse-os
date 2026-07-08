const { parentPort } = require('worker_threads');

// Simulación de conexión a base de datos SQLite persistente local
// Aquí se cargaría better-sqlite3 o sqlite3 real
let dbLocal = {
  productos: [
    { id: 1, nombre: 'Arroz 1kg', stock_disponible: 45, precio_venta: 12.50 },
    { id: 2, nombre: 'Aceite Girasol 1L', stock_disponible: 18, precio_venta: 34.00 }
  ],
  ventasOffline: []
};

// Escucha de comandos desde el hilo principal (Main Process)
parentPort.on('message', (msg) => {
  try {
    switch (msg.type) {
      case 'BUSCAR_PRODUCTO': {
        const query = msg.payload.termino.toLowerCase();
        const resultados = dbLocal.productos.filter(p => 
          p.nombre.toLowerCase().includes(query)
        );
        
        parentPort.postMessage({
          type: 'BUSQUEDA_PRODUCTO_RESP',
          data: resultados
        });
        break;
      }
      
      case 'GUARDAR_VENTA': {
        const nuevaVenta = msg.payload.venta;
        
        // Simulación de validación interna y transacción local de SQLite
        if (!nuevaVenta.total || nuevaVenta.total <= 0) {
          throw new Error('El total de la venta debe ser mayor a cero.');
        }
        
        nuevaVenta.uuid = `offline-${Date.now()}`;
        nuevaVenta.sincronizado = false;
        dbLocal.ventasOffline.push(nuevaVenta);
        
        parentPort.postMessage({
          type: 'GUARDAR_VENTA_RESP',
          data: { success: true, uuid: nuevaVenta.uuid }
        });
        break;
      }
      
      default:
        console.warn('Comando de Worker desconocido:', msg.type);
    }
  } catch (error) {
    parentPort.postMessage({
      type: msg.type === 'BUSCAR_PRODUCTO' ? 'BUSQUEDA_PRODUCTO_RESP' : 'GUARDAR_VENTA_RESP',
      error: error.message
    });
  }
});
