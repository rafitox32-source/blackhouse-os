const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// Set demo flag
content = content.replace('function entrarModoBeta() {', 'function entrarModoBeta() {\n    window.isDemoMode = true;');

// Guard IPC sends in showView
content = content.replace(/if \(id === 'clientes-view'\) ipcRenderer\.send\('obtener-clientes'\);/g, "if (id === 'clientes-view' && !window.isDemoMode) ipcRenderer.send('obtener-clientes');");
content = content.replace(/if\(id === 'crm'\) ipcRenderer\.send\('analisis-crm'\);/g, "if(id === 'crm' && !window.isDemoMode) ipcRenderer.send('analisis-crm');");
content = content.replace(/if\(id === 'taller'\) ipcRenderer\.send\('obtener-ordenes'\);/g, "if(id === 'taller' && !window.isDemoMode) ipcRenderer.send('obtener-ordenes');");
content = content.replace(/if\(id === 'inventario'\) ipcRenderer\.send\('obtener-productos'\);/g, "if(id === 'inventario' && !window.isDemoMode) ipcRenderer.send('obtener-productos');");
content = content.replace(/if\(id === 'reportes'\) ipcRenderer\.send\('obtener-datos-reporte', 'hoy'\);/g, "if(id === 'reportes' && !window.isDemoMode) ipcRenderer.send('obtener-datos-reporte', 'hoy');");
content = content.replace(/if\(id === 'facturas-view'\) ipcRenderer\.send\('obtener-facturas'\);/g, "if(id === 'facturas-view' && !window.isDemoMode) ipcRenderer.send('obtener-facturas');");

fs.writeFileSync('index.html', content, 'utf8');
console.log('Fixed index.html successfully!');
