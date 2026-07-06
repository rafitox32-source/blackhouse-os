const { contextBridge, ipcRenderer } = require('electron');

// Esto expone de forma segura 'ipcRenderer' al mundo de tu index.html
contextBridge.exposeInMainWorld('ipcRenderer', {
    send: (channel, ...args) => {
        // Envia datos desde el HTML hacia main.js
        ipcRenderer.send(channel, ...args);
    },
    on: (channel, func) => {
        // Escucha respuestas desde main.js hacia el HTML
        // Empaquetamos la función para no exponer el objeto 'event' completo por seguridad
        ipcRenderer.on(channel, (event, ...args) => func(event, ...args));
    },
    invoke: (channel, ...args) => {
        // Para peticiones asíncronas de doble vía (si llegas a usarlas)
        return ipcRenderer.invoke(channel, ...args);
    }
});