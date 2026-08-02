/**
 * Prueba del motor de diagnóstico de placa, SIN abrir la app ni gastar IA.
 *
 *   node test/diagnostico-placa.test.mjs
 *
 * Extrae las funciones de index.html (no una copia) y verifica:
 *   - las 5 REGLAS ESTRICTAS del pedido, incluida la parte de "qué NO hacer";
 *   - que la tabla de consumo por etapa siga dando lo MISMO que antes de unificar los dos
 *     botones (es una prueba de regresión: la lógica vieja no se podía perder);
 *   - la detección de arquitectura Apple/Android.
 */

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(path.join(REPO, 'index.html'), 'utf8');

function extraer(nombre) {
    const ini = html.indexOf(`function ${nombre}(`);
    if (ini === -1) throw new Error(`No se encontró function ${nombre}( en index.html`);
    let nivel = 0;
    for (let j = html.indexOf('{', ini); j < html.length; j++) {
        if (html[j] === '{') nivel++;
        else if (html[j] === '}' && --nivel === 0) return html.slice(ini, j + 1);
    }
    throw new Error(`No se pudo cerrar ${nombre}`);
}

const nombres = ['dpNum', 'dpArquitecturaDeModelo', 'dpReglasDeterministas', 'dpEvaluarConsumo'];
const { dpNum, dpArquitecturaDeModelo, dpReglasDeterministas, dpEvaluarConsumo } =
    new Function(`${nombres.map(extraer).join('\n')}\nreturn { ${nombres.join(', ')} };`)();

let ok = 0; const fallos = [];
function chequear(desc, cond, extra) {
    if (cond) { ok++; console.log('  ✔', desc); }
    else { fallos.push(desc); console.log('  ✘', desc, extra ? '→ ' + extra : ''); }
}
const reglas = (m) => dpReglasDeterministas(m).map(h => h.regla);
const base = { vbat: null, bsi: '', vbusSub: null, vbusFpc: null, power: null, consumoAntes: null, consumoDespues: null };

console.log('\n== Regla 1: flex / sub-board ==');
{
    const h = dpReglasDeterministas({ ...base, vbusSub: 5.0, vbusFpc: 0 });
    chequear('5V en el puerto y 0V en el FPC → flex/sub-board', h[0]?.regla === 'flex-subboard');
    chequear('dice explícitamente que NO se toca la placa base', /NO tocar la placa base/i.test(h[0]?.veredicto || ''));
    chequear('la ubica en Fase 1', h[0]?.fase.startsWith('Fase 1'));
}
chequear('4.4V en el FPC tambien dispara (umbral 4.5V)', reglas({ ...base, vbusSub: 5, vbusFpc: 4.4 }).includes('flex-subboard'));
chequear('4.9V en el FPC NO dispara', !reglas({ ...base, vbusSub: 5, vbusFpc: 4.9 }).includes('flex-subboard'));
chequear('sin medir el FPC no inventa el hallazgo', !reglas({ ...base, vbusSub: 5 }).includes('flex-subboard'));

console.log('\n== Regla 2: botón de encendido ==');
{
    const h = dpReglasDeterministas({ ...base, vbat: 3.9, power: 0 });
    chequear('batería sana + 0V en el botón → PMIC o pista', h[0]?.regla === 'boton-power');
    chequear('menciona PMIC y pista cortada', /PMIC/.test(h[0]?.veredicto || '') && /pista/i.test(h[0]?.veredicto || ''));
}
chequear('con 1.8V en el botón NO dispara', !reglas({ ...base, vbat: 3.9, power: 1.8 }).includes('boton-power'));
chequear('con batería baja no culpa al botón', !reglas({ ...base, vbat: 3.2, power: 0 }).includes('boton-power'));

console.log('\n== Regla 3: BSI / térmica ==');
for (const v of ['ol', 'gnd']) {
    const h = dpReglasDeterministas({ ...base, bsi: v });
    chequear(`BSI en "${v}" → reparar línea térmica`, h[0]?.regla === 'bsi-termica');
    chequear(`  y avisa de NO cambiar el IC de carga`, /NO cambiar el IC de carga/i.test(h[0]?.veredicto || ''));
}
chequear('BSI OK no dispara', !reglas({ ...base, bsi: 'ok' }).includes('bsi-termica'));

console.log('\n== Regla 4: consumo en fuga (antes de Power) ==');
chequear('0.150A antes de Power → línea primaria', reglas({ ...base, consumoAntes: 0.150 }).includes('consumo-en-fuga'));
chequear('  y con >0.08A lo llama cortocircuito',
    /[Cc]ortocircuito/.test(dpReglasDeterministas({ ...base, consumoAntes: 0.150 })[0].veredicto));
chequear('  con 0.02A lo llama fuga, no corto',
    /[Ff]uga/.test(dpReglasDeterministas({ ...base, consumoAntes: 0.02 })[0].veredicto));
chequear('0A antes de Power no dispara', !reglas({ ...base, consumoAntes: 0 }).includes('consumo-en-fuga'));

console.log('\n== Regla 5: consumo secundario fijo ==');
{
    const h = dpReglasDeterministas({ ...base, consumoDespues: 0.050 });
    chequear('50mA fijos post-Power → datos/CPU/RAM', h[0]?.regla === 'consumo-secundario');
    chequear('  descarta la etapa de potencia', /No es la etapa de potencia/i.test(h[0]?.veredicto || ''));
}
chequear('0.2A post-Power no dispara (arranca normal)', !reglas({ ...base, consumoDespues: 0.2 }).includes('consumo-secundario'));

console.log('\n== Prioridad y batería fuera de rango ==');
chequear('batería baja se reporta primero que todo', dpReglasDeterministas({ ...base, vbat: 3.1, consumoAntes: 0.2 })[0].regla === 'bateria-baja');
chequear('sin ninguna medición no inventa nada', dpReglasDeterministas({ ...base }).length === 0);
chequear('varios hallazgos a la vez se acumulan', dpReglasDeterministas({ ...base, vbusSub: 5, vbusFpc: 0, bsi: 'ol' }).length === 2);

console.log('\n== Regresión: la tabla de consumo NO cambió al unificar los botones ==');
const casos = [
    ['antes', 0, 'Normal. Esperando orden.', 'ok'],
    ['antes', 0.05, 'Fuga baja en línea principal (Vbat/VPH_PWR). Revisar periféricos.', 'aviso'],
    ['antes', 0.2, 'Cortocircuito en línea principal. Inyectar tensión.', 'malo'],
    ['durante', 0, 'Falla en botón, flex o PMIC no alimentado.', 'aviso'],
    ['durante', 0.02, 'Falla de Reloj Oscilador o CPU no despierta.', 'malo'],
    ['durante', 0.05, 'Falla de RAM/Memoria (Posible soldadura fría/Reballing).', 'aviso'],
    ['durante', 0.1, 'Bloqueo de CPU o corto en salida LDO secundaria.', 'malo'],
    ['durante', 0.3, 'Corto secundario grave post-PMIC.', 'malo'],
    ['despues', 0, 'Falla de retención (Falta señal PS_HOLD).', 'malo'],
    ['despues', 0.2, 'Secuencia de encendido normal o Bootloop.', 'ok'],
    ['despues', 0.05, 'Consumo anormal al soltar. Revisar PMIC.', 'aviso'],
];
for (const [etapa, a, esperado, nivel] of casos) {
    const r = dpEvaluarConsumo(etapa, a);
    chequear(`${etapa} @ ${a}A → "${esperado.slice(0, 38)}…"`, r && r.texto === esperado && r.nivel === nivel,
        r ? `dio "${r.texto}" (${r.nivel})` : 'no devolvió nada');
}
chequear('sin consumo devuelve null', dpEvaluarConsumo('antes', null) === null);

console.log('\n== Varios ==');
chequear('coma decimal se acepta', dpNum('3,85') === 3.85);
chequear('vacío es null, no 0', dpNum('') === null);
chequear('texto basura es null', dpNum('abc') === null);
chequear('iPhone 11 → apple', dpArquitecturaDeModelo('iPhone 11') === 'apple');
chequear('A34 → android', dpArquitecturaDeModelo('Samsung A34') === 'android');
chequear('Redmi Note 12 → android', dpArquitecturaDeModelo('Redmi Note 12') === 'android');

console.log(`\n${fallos.length ? '✘ FALLÓ' : '✅ TODO OK'} — ${ok} chequeos pasados, ${fallos.length} fallidos`);
if (fallos.length) { fallos.forEach(f => console.error('   - ' + f)); process.exit(1); }
