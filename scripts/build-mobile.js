// Arma la carpeta www/ que espera Capacitor, copiando los mismos archivos que usa el
// build de escritorio (index.html, capacitor-shim.js, assets/) SIN modificarlos. No hay
// bundler ni transformación: es una copia directa, para no tener dos versiones del
// frontend que se puedan desincronizar (ver plan de migración a Android).
//
// Uso: node scripts/build-mobile.js

const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '..');
const DESTINO = path.join(RAIZ, 'www');

const ARCHIVOS = ['index.html', 'capacitor-shim.js'];
const CARPETAS = ['assets'];

function copiarCarpeta(origen, destino) {
    fs.mkdirSync(destino, { recursive: true });
    for (const nombre of fs.readdirSync(origen)) {
        const rutaOrigen = path.join(origen, nombre);
        const rutaDestino = path.join(destino, nombre);
        const stat = fs.statSync(rutaOrigen);
        if (stat.isDirectory()) {
            copiarCarpeta(rutaOrigen, rutaDestino);
        } else {
            fs.copyFileSync(rutaOrigen, rutaDestino);
        }
    }
}

fs.rmSync(DESTINO, { recursive: true, force: true });
fs.mkdirSync(DESTINO, { recursive: true });

for (const archivo of ARCHIVOS) {
    fs.copyFileSync(path.join(RAIZ, archivo), path.join(DESTINO, archivo));
    console.log(`copiado: ${archivo}`);
}
for (const carpeta of CARPETAS) {
    copiarCarpeta(path.join(RAIZ, carpeta), path.join(DESTINO, carpeta));
    console.log(`copiada: ${carpeta}/`);
}

console.log(`\nwww/ lista en ${DESTINO}`);
