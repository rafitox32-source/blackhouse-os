/**
 * Prueba de la guarda de versión del auto-updater.
 *
 *   node test/version.test.mjs
 *
 * Extrae esVersionMasNueva() de main.js (no una copia) y la corre contra los casos que
 * importan. Es la función que decide si se muestra el banner "hay una nueva versión", el bug
 * que se reportó tres veces: "me sigue saliendo actualizar aun teniendo la version ya
 * actualizada".
 */

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = readFileSync(path.join(REPO, 'main.js'), 'utf8');

const inicio = src.indexOf('function esVersionMasNueva(');
if (inicio === -1) throw new Error('No se encontró esVersionMasNueva() en main.js');
let nivel = 0, fin = -1;
for (let i = src.indexOf('{', inicio); i < src.length; i++) {
    if (src[i] === '{') nivel++;
    else if (src[i] === '}' && --nivel === 0) { fin = i + 1; break; }
}
const esVersionMasNueva = new Function(`${src.slice(inicio, fin)}\nreturn esVersionMasNueva;`)();

let ok = 0; const fallos = [];
function caso(remota, actual, esperado, nota) {
    const real = esVersionMasNueva(remota, actual);
    const bien = real === esperado;
    if (bien) ok++; else fallos.push(`${remota} vs ${actual}: esperaba ${esperado}, dio ${real}`);
    console.log(`  ${bien ? '✔' : '✘'} ${String(remota).padEnd(16)} vs ${String(actual).padEnd(16)} → ${String(real).padEnd(5)} ${nota || ''}`);
}

console.log('\n== hay actualización de verdad (debe mostrar el banner) ==');
caso('2.55.0', '2.54.0', true, 'menor +1');
caso('3.0.0', '2.54.0', true, 'mayor +1');
caso('2.54.1', '2.54.0', true, 'parche +1');
caso('2.54.10', '2.54.9', true, 'parche de 2 dígitos — el fallo clásico de comparar como texto');
caso('2.100.0', '2.99.0', true, 'menor de 3 dígitos');
caso('v2.55.0', '2.54.0', true, 'con prefijo v');
caso('2.55.0', '2.55.0-beta.1', true, 'final supera a su pre-release');

console.log('\n== NO hay actualización (el banner NO debe salir) — el bug reportado ==');
caso('2.54.0', '2.54.0', false, 'misma versión ← el caso que se quejó el usuario');
caso('2.53.0', '2.54.0', false, 'la remota es más vieja');
caso('2.54.0', '2.54.1', false, 'parche más viejo');
caso('2.9.0', '2.10.0', false, 'no comparar como texto ("9" > "1")');
caso('2.54.0-beta.1', '2.54.0', false, 'pre-release no supera a la final');
caso('2.54.0', 'v2.54.0', false, 'prefijo v en la actual');

console.log('\n== entradas raras: nunca deben anunciar una actualización ==');
caso(undefined, '2.54.0', false);
caso(null, '2.54.0', false);
caso('', '2.54.0', false);
caso('vaya', '2.54.0', false, 'basura → 0.0.0');
caso('2.54', '2.54.0', false, 'versión incompleta, equivalente');
caso('2.55', '2.54.0', true, 'versión incompleta pero mayor');

console.log(`\n${fallos.length ? '✘ FALLÓ' : '✅ TODO OK'} — ${ok} casos correctos, ${fallos.length} fallidos`);
if (fallos.length) { fallos.forEach(f => console.error('   - ' + f)); process.exit(1); }
