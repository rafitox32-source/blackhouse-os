const { ipcMain } = require('electron');
const { Worker } = require('worker_threads');
const path = require('path');

let sqliteWorker = null;

// Inicializa el worker thread para mantener SQLite fuera del Event Loop principal
function getSqliteWorker() {
  if (!sqliteWorker) {
    // Apuntamos al script del worker
    const workerPath = path.join(__dirname, '../workers/sqlite_worker.js');
    sqliteWorker = new Worker(workerPath);
    
    // Captura de errores globales del worker para robustez extrema
    sqliteWorker.on('error', (err) => {
      console.error('Error crítico en el Worker SQLite:', err);
      sqliteWorker = null; // Reiniciar en caso de muerte
    });
  }
  return sqliteWorker;
}

// Registro central de IPC para el POS
function registerPosHandlers() {
  // Manejador asíncrono para buscar productos sin bloquear la UI
  ipcMain.handle('pos:buscar-producto', async (event, termino) => {
    return new Promise((resolve, reject) => {
      const worker = getSqliteWorker();
      
      const messageHandler = (msg) => {
        if (msg.type === 'BUSQUEDA_PRODUCTO_RESP') {
          worker.off('message', messageHandler);
          resolve(msg.data);
        }
      };
      
      worker.on('message', messageHandler);
      
      // Enviamos el comando al Worker
      worker.postMessage({
        type: 'BUSCAR_PRODUCTO',
        payload: { termino }
      });
    });
  });

  // Manejador asíncrono para registrar ventas locales
  ipcMain.handle('pos:guardar-venta-offline', async (event, venta) => {
    return new Promise((resolve, reject) => {
      const worker = getSqliteWorker();
      
      const messageHandler = (msg) => {
        if (msg.type === 'GUARDAR_VENTA_RESP') {
          worker.off('message', messageHandler);
          if (msg.error) {
            reject(new Error(msg.error));
          } else {
            resolve(msg.data);
          }
        }
      };
      
      worker.on('message', messageHandler);
      
      // Enviamos el comando de escritura persistente al Worker
      worker.postMessage({
        type: 'GUARDAR_VENTA',
        payload: { venta }
      });
    });
  });
}

module.exports = { registerPosHandlers };
