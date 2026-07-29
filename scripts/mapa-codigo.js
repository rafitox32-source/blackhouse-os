#!/usr/bin/env node
// Genera docs/MAPA_CODIGO.md: un indice con numero de linea de cada
// funcion, modal, IPC channel y seccion en index.html y main.js.
// Objetivo: poder ubicar algo con un grep sobre este mapa (unas pocas
// KB) en vez de leer los archivos completos (18k+ y 5k+ lineas) cada
// vez que hay que modificar algo. Correr: node scripts/mapa-codigo.js

const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '..');

function leerLineas(archivo) {
    const ruta = path.join(RAIZ, archivo);
    if (!fs.existsSync(ruta)) return null;
    return fs.readFileSync(ruta, 'utf8').split('\n');
}

function extraer(lineas, patrones) {
    const resultados = [];
    lineas.forEach((linea, i) => {
        for (const { re, grupo, tipo } of patrones) {
            const m = linea.match(re);
            if (m) resultados.push({ linea: i + 1, tipo, nombre: m[grupo], texto: linea.trim().slice(0, 100) });
        }
    });
    return resultados;
}

const PATRONES_HTML = [
    { re: /^\s*(?:async\s+)?function\s+(\w+)\s*\(/, grupo: 1, tipo: 'funcion' },
    { re: /^\s*const\s+(\w+)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>\s*\{/, grupo: 1, tipo: 'funcion (arrow)' },
    { re: /<div[^>]*\bid=["']modal-([\w-]+)["']/, grupo: 1, tipo: 'modal' },
    { re: /ipcRenderer\.(?:on|invoke|send)\(\s*["']([\w-]+)["']/, grupo: 1, tipo: 'ipc (renderer)' },
    { re: /<!--\s*(.+?)\s*-->/, grupo: 1, tipo: 'comentario' },
];

const PATRONES_MAIN = [
    { re: /^\s*(?:async\s+)?function\s+(\w+)\s*\(/, grupo: 1, tipo: 'funcion' },
    { re: /ipcMain\.(?:on|handle)\(\s*["']([\w-]+)["']/, grupo: 1, tipo: 'ipc (main)' },
    { re: /\/\/\s*={3,}\s*(.+?)\s*={3,}/, grupo: 1, tipo: 'seccion' },
];

function tabla(titulo, filas) {
    if (!filas.length) return '';
    filas.sort((a, b) => a.linea - b.linea);
    let out = `\n## ${titulo}\n\n| Línea | Tipo | Nombre / Texto |\n|---|---|---|\n`;
    for (const f of filas) {
        const nombre = f.nombre || f.texto || '';
        out += `| ${f.linea} | ${f.tipo} | ${nombre.replace(/\|/g, '\\|')} |\n`;
    }
    return out;
}

function generar() {
    const partes = [];
    partes.push('# Mapa del código — BlackHouse OS (generado automáticamente)');
    partes.push('');
    partes.push('No editar a mano. Regenerar con `node scripts/mapa-codigo.js` cuando');
    partes.push('el código cambie de forma importante (nuevas funciones, modales, IPC).');
    partes.push('');
    partes.push('Uso: antes de modificar `index.html` o `main.js`, busca aquí (con Grep,');
    partes.push('no leyendo este archivo entero tampoco hace falta) el nombre de la función,');
    partes.push('el id del modal o el canal IPC que te interesa, toma el número de línea,');
    partes.push('y lee solo ese rango del archivo real con Read (offset/limit).');

    const htmlLineas = leerLineas('index.html');
    if (htmlLineas) {
        const filas = extraer(htmlLineas, PATRONES_HTML);
        partes.push('\n# index.html\n');
        for (const tipo of ['comentario', 'modal', 'funcion', 'funcion (arrow)', 'ipc (renderer)']) {
            partes.push(tabla(`index.html — ${tipo}`, filas.filter(f => f.tipo === tipo)));
        }
    }

    const mainLineas = leerLineas('main.js');
    if (mainLineas) {
        const filas = extraer(mainLineas, PATRONES_MAIN);
        partes.push('\n# main.js\n');
        for (const tipo of ['seccion', 'ipc (main)', 'funcion']) {
            partes.push(tabla(`main.js — ${tipo}`, filas.filter(f => f.tipo === tipo)));
        }
    }

    const destino = path.join(RAIZ, 'docs', 'MAPA_CODIGO.md');
    fs.mkdirSync(path.dirname(destino), { recursive: true });
    fs.writeFileSync(destino, partes.join('\n') + '\n', 'utf8');
    console.log('Mapa generado en docs/MAPA_CODIGO.md');
}

generar();
