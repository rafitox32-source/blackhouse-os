const { contextBridge, ipcRenderer } = require('electron');

// Defensa en Profundidad: No se expone ipcRenderer directamente en la UI.
// Solo exponemos una API declarativa que actúa como un proxy fuertemente tipado.
contextBridge.exposeInMainWorld('posAPI', {
  buscarProducto: async (termino) => {
    // Sanitización básica en el lado del cliente (Frontend) antes del IPC
    if (typeof termino !== 'string') {
      throw new Error('El término de búsqueda debe ser un string.');
    }
    return await ipcRenderer.invoke('pos:buscar-producto', termino.trim());
  },
  
  guardarVentaOffline: async (venta) => {
    // Validación estructural básica antes de enviar al proceso principal
    if (!venta || typeof venta !== 'object') {
      throw new Error('Datos de venta inválidos.');
    }
    if (!Array.isArray(venta.items) || venta.items.length === 0) {
      throw new Error('La venta debe contener al menos un producto.');
    }
    return await ipcRenderer.invoke('pos:guardar-venta-offline', venta);
  }
});
