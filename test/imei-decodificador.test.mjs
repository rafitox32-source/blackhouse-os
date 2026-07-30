/**
 * Prueba de la lógica de decodificación de IMEI, SIN cámara.
 *
 *   node test/imei-decodificador.test.mjs
 *
 * No copia el código: lo EXTRAE de index.html y lo evalúa, así la prueba se rompe si alguien
 * cambia las funciones de verdad. Cubre las funciones puras del escáner:
 * normalizarImei, luhnImeiValido, pareceImei y extraerCandidatosImei.
 *
 * Los casos son salidas de OCR realistas: el IMEI casi nunca sale como 15 dígitos pegados.
 */

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(path.join(REPO, 'index.html'), 'utf8');

// --- extraer las funciones reales del monolito ------------------------------------------------
function extraerFuncion(nombre) {
    const inicio = html.indexOf(`function ${nombre}(`);
    if (inicio === -1) throw new Error(`No se encontró function ${nombre}( en index.html`);
    let i = html.indexOf('{', inicio);
    let nivel = 0;
    for (let j = i; j < html.length; j++) {
        if (html[j] === '{') nivel++;
        else if (html[j] === '}') {
            nivel--;
            if (nivel === 0) return html.slice(inicio, j + 1);
        }
    }
    throw new Error(`No se pudo cerrar el cuerpo de ${nombre}`);
}

const nombres = ['normalizarImei', 'luhnImeiValido', 'pareceImei', 'extraerCandidatosImei'];
const fuente = nombres.map(extraerFuncion).join('\n');
const { normalizarImei, luhnImeiValido, pareceImei, extraerCandidatosImei } =
    new Function(`${fuente}\nreturn { ${nombres.join(', ')} };`)();

// --- mini runner -----------------------------------------------------------------------------
let ok = 0, fallos = [];
function chequear(desc, condicion, detalle) {
    if (condicion) { ok++; console.log('  ✔', desc); }
    else { fallos.push(desc + (detalle ? ' → ' + detalle : '')); console.log('  ✘', desc, detalle ? '→ ' + detalle : ''); }
}

// Genera un IMEI válido a partir de sus primeros 14 dígitos (calcula el verificador Luhn).
function conVerificador(base14) {
    let suma = 0;
    for (let i = 0; i < 14; i++) {
        let d = Number(base14[i]);
        if (i % 2 === 1) { d *= 2; if (d > 9) d -= 9; }
        suma += d;
    }
    return base14 + String((10 - (suma % 10)) % 10);
}

const IMEI_A = conVerificador('35486921012345');
const IMEI_B = conVerificador('35486921012399');

console.log('\n== Luhn ==');
chequear('IMEI generado A pasa el checksum', luhnImeiValido(IMEI_A), IMEI_A);
chequear('IMEI generado B pasa el checksum', luhnImeiValido(IMEI_B), IMEI_B);
chequear('un dígito cambiado rompe el checksum',
    !luhnImeiValido(IMEI_A.slice(0, 5) + ((Number(IMEI_A[5]) + 1) % 10) + IMEI_A.slice(6)));
chequear('14 dígitos no se validan por checksum', !luhnImeiValido(IMEI_A.slice(0, 14)));

console.log('\n== normalizar / pareceImei ==');
chequear('normaliza separadores', normalizarImei('354869 21-012345.6') === '354869210123456');
chequear('acepta 15 dígitos', pareceImei(IMEI_A));
chequear('acepta agrupado con espacios', pareceImei('354869 21 012345 6'));
chequear('rechaza un EAN-13 del producto', !pareceImei('7501234567890'));
chequear('rechaza 17 dígitos', !pareceImei('12345678901234567'));

console.log('\n== extraerCandidatosImei (salidas de OCR realistas) ==');
const casos = [
    ['15 dígitos pegados', IMEI_A, [IMEI_A]],
    ['agrupado con espacios', `IMEI ${IMEI_A.slice(0, 6)} ${IMEI_A.slice(6, 8)} ${IMEI_A.slice(8, 14)} ${IMEI_A[14]}`, [IMEI_A]],
    ['con guiones', `${IMEI_A.slice(0, 8)}-${IMEI_A.slice(8, 14)}-${IMEI_A[14]}`, [IMEI_A]],
    ['con puntos', `${IMEI_A.slice(0, 5)}.${IMEI_A.slice(5, 10)}.${IMEI_A.slice(10)}`, [IMEI_A]],
    ['Dual SIM en dos líneas', `IMEI1: ${IMEI_A}\nIMEI2: ${IMEI_B}`, [IMEI_A, IMEI_B]],
    ['Dual SIM agrupado', `IMEI1 ${IMEI_A.slice(0, 8)} ${IMEI_A.slice(8)}\nIMEI2 ${IMEI_B.slice(0, 8)} ${IMEI_B.slice(8)}`, [IMEI_A, IMEI_B]],
];

for (const [desc, texto, esperados] of casos) {
    const res = extraerCandidatosImei(texto);
    const faltan = esperados.filter(e => !res.includes(e));
    chequear(desc, faltan.length === 0, faltan.length ? 'faltó ' + faltan.join(', ') + ' | obtuvo: ' + JSON.stringify(res) : '');
}

chequear('un EAN-13 solo no genera candidatos', extraerCandidatosImei('EAN 7501234567890').length === 0);
chequear('texto sin números no genera candidatos', extraerCandidatosImei('Samsung Galaxy A24 negro').length === 0);
chequear('los válidos por checksum vienen primero', (() => {
    const res = extraerCandidatosImei(`12345678901234 ${IMEI_A}`);
    return res.length > 0 && res[0] === IMEI_A;
})());

console.log('\n== regresión: por qué fallaba antes ==');
// El regex viejo exigía 14+ dígitos SEGUIDOS. Estos son los casos que dejaba pasar de largo.
const regexViejo = /\d{14,17}/g;
for (const [desc, texto] of casos.slice(1, 4)) {
    const viejo = (texto.match(regexViejo) || []).length;
    const nuevo = extraerCandidatosImei(texto).length;
    chequear(`"${desc}": el regex viejo encontraba ${viejo}, ahora ${nuevo}`, viejo === 0 && nuevo > 0);
}

console.log(`\n${fallos.length ? '✘ FALLÓ' : '✅ TODO OK'} — ${ok} chequeos pasados, ${fallos.length} fallidos`);
if (fallos.length) { fallos.forEach(f => console.error('   - ' + f)); process.exit(1); }
