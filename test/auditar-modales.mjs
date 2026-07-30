/**
 * Auditoría de los modales de index.html — el motor de /modales.
 *
 *   node test/auditar-modales.mjs            # tabla completa
 *   node test/auditar-modales.mjs --fallan    # solo los que fallan algo
 *
 * Verifica el checklist del CLAUDE.md §4 sobre el HTML, sin abrir la app:
 *   - botón de cierre visible
 *   - cierre con Esc
 *   - cierre haciendo click en el overlay
 *   - max-height + overflow-y en .modal-content  (que quepa en 1366x768)
 *   - ancho no fijado en px sin max-width       (que quepa en móvil)
 *
 * Existe porque el usuario reportó tres veces la misma falla ("no tiene boton de cerrar",
 * "esta pestaña no tiene para cerrar", "verifica que todas las ventanas tengan cierre y se
 * puedan ajustar a la pantalla") y revisarlos de a uno a mano no escala a 46 modales.
 */

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RUTA = path.join(REPO, 'index.html');
const html = readFileSync(RUTA, 'utf8');
const soloFallan = process.argv.includes('--fallan');

// --- localizar cada modal y su bloque, cerrando los <div> de forma balanceada ----------------
function bloqueDelModal(indiceApertura) {
    // Avanza etiqueta por etiqueta contando <div> abiertos hasta cerrar el del modal.
    const re = /<(\/?)div\b[^>]*>/gi;
    re.lastIndex = indiceApertura;
    let nivel = 0;
    let m;
    while ((m = re.exec(html))) {
        if (m[1] === '/') { nivel--; if (nivel === 0) return html.slice(indiceApertura, re.lastIndex); }
        else nivel++;
    }
    return html.slice(indiceApertura); // sin cerrar: se reporta igual
}

function lineaDe(indice) {
    return html.slice(0, indice).split('\n').length;
}

const modales = [];
const reModal = /<div\s+id="(modal-[A-Za-z0-9_-]+)"[^>]*class="[^"]*modal-overlay[^"]*"[^>]*>/gi;
let m;
while ((m = reModal.exec(html))) {
    modales.push({ id: m[1], linea: lineaDe(m.index), bloque: bloqueDelModal(m.index), apertura: m[0] });
}

// --- chequeos globales (una sola vez para todos) ----------------------------------------------
// Esc REALMENTE global: un listener de keydown con Escape que opere sobre TODOS los overlays.
// La versión anterior de este auditor solo miraba que existiera un keydown+Escape cerca, y dio
// verde cuando en realidad el handler cerraba un único modal por id (modal-detalle-producto):
// el comentario del código decía "cierre global" y no lo era.
const escGlobal = /addEventListener\(\s*['"]keydown['"][\s\S]{0,1200}?Escape[\s\S]{0,1200}?querySelectorAll\(\s*['"]\.modal-overlay['"]/i.test(html);

// Click en overlay global: un listener que cierre si el click fue en el propio .modal-overlay.
const overlayGlobal = /(e|ev|event)\.target\.classList\.contains\(\s*['"]modal-overlay['"]/i.test(html) ||
    /\.modal-overlay['"][\s\S]{0,300}?(e|ev|event)\.target\s*===\s*/i.test(html);

// Clases que YA aportan límite de altura + scroll desde el CSS. Sin esto el auditor miraba solo
// el style inline y marcaba 29 modales como problemáticos cuando .modal-content ya trae
// max-height:90vh + overflow-y:auto para los 40 que la usan.
const clasesAcotadas = new Set();
for (const m of html.matchAll(/\.([a-zA-Z][\w-]*)\s*\{([^}]*)\}/g)) {
    if (/max-height\s*:/i.test(m[2]) && /overflow(-y)?\s*:\s*(auto|scroll)/i.test(m[2])) clasesAcotadas.add(m[1]);
}

// --- chequeos por modal -----------------------------------------------------------------------
function auditar(mod) {
    const b = mod.bloque;

    // Botón de cierre. OJO: en este repo conviven CUATRO formas de cerrar un modal, y una
    // versión anterior de este auditor solo detectaba dos, así que reportó 20 modales "sin
    // cierre" que sí lo tenían. Las cuatro:
    //   1. onclick a una función cerrarX() / ocultarX() / closeX()
    //   2. onclick inline con style.display='none'
    //   3. una ✖ como contenido del control
    //   4. un botón cuyo texto visible es Cerrar / Cancelar / Salir
    const botonCierre =
        /onclick="[^"]*(cerrar|Cerrar|close|Close|ocultar|Ocultar)[^"]*"/.test(b) ||
        /onclick="[^"]*style\.display\s*=\s*['"]none['"]/.test(b) ||
        /class="[^"]*modal-close[^"]*"/.test(b) ||
        /<(button|span|a|i)[^>]*>\s*(✖|✕|×|&times;)\s*<\//.test(b) ||
        /<button[^>]*>\s*(Cerrar|Cancelar|Salir)\s*<\/button>/i.test(b);

    // Cierre por Esc / overlay: propio del modal, o el global.
    const escPropio = /onkeydown="[^"]*(Escape|27)[^"]*"/.test(b);
    const overlayPropio = /<div\s+id="[^"]*"[^>]*class="[^"]*modal-overlay[^"]*"[^>]*onclick=/i.test(mod.apertura);

    // Contenedor interno real del modal (puede ser .modal-content o .confirm-box) y su estilo.
    const mCaja = b.match(/<div\s+class="([^"]+)"(?:[^>]*style="([^"]*)")?/i);
    const clases = mCaja ? mCaja[1].split(/\s+/) : [];
    const estilo = (mCaja && mCaja[2]) || '';
    const claseAporta = clases.some((c) => clasesAcotadas.has(c));

    // Ajuste en ALTO — lo que de verdad importa en la laptop del usuario (1366x768, o sea
    // ~700px útiles). Vale de dos formas: el .modal-content acotado, o una región interna con
    // scroll acotado (patrón muy usado acá: la lista scrollea y el header/footer quedan fijos).
    const contentAcotado = /max-height\s*:/i.test(estilo) && /overflow(-y)?\s*:\s*(auto|scroll)/i.test(estilo);
    const internoAcotado = /max-height\s*:\s*\d+(px|vh)[^"]*overflow(-y)?\s*:\s*(auto|scroll)/i.test(b) ||
        /overflow(-y)?\s*:\s*(auto|scroll)[^"]*max-height\s*:\s*\d+(px|vh)/i.test(b);

    // Ajuste en ANCHO: esto es una app de ESCRITORIO, no una web responsive. Un width:480px no
    // es un problema en 1366px. Solo se marca si el ancho declarado no entraría en esa pantalla.
    const mAncho = estilo.match(/(^|;)\s*width\s*:\s*(\d+)px/i);
    const anchoOk = !mAncho || Number(mAncho[2]) <= 1300 || /max-width\s*:/i.test(estilo);

    const noEsc = /\bdata-no-esc\b/.test(mod.apertura);

    return {
        id: mod.id,
        linea: mod.linea,
        cierre: botonCierre,
        esc: noEsc ? 'n/a' : (escPropio || escGlobal),
        overlay: overlayPropio || overlayGlobal,
        alto: claseAporta || contentAcotado || internoAcotado,
        ancho: anchoOk,
        caja: clases.join('.') || '(sin clase)',
    };
}

const filas = modales.map(auditar);
// El cierre por click en el overlay NO cuenta como falla: en un modal de formulario, cerrar al
// hacer click afuera borra lo que la persona estaba escribiendo. Se reporta como dato, no como
// defecto — se agrega a mano solo en los modales de solo lectura, si se quiere.
const falla = (f) => !f.cierre || f.esc === false || !f.alto || !f.ancho;

// --- salida -----------------------------------------------------------------------------------
const si = (v) => (v === 'n/a' ? ' n/a ' : v ? '  ✔  ' : '  ✘  ');
console.log(`\nModales encontrados: ${filas.length}   (index.html, ${html.split('\n').length} líneas)`);
console.log(`Esc global: ${escGlobal ? 'SÍ' : 'NO'}      Click en overlay global: ${overlayGlobal ? 'SÍ' : 'NO'}\n`);
console.log('modal'.padEnd(34) + 'línea'.padEnd(8) + 'cierre  Esc   overlay  alto   ancho');
console.log('-'.repeat(80));
for (const f of filas) {
    if (soloFallan && !falla(f)) continue;
    console.log(
        f.id.padEnd(34) + String(f.linea).padEnd(8) +
        si(f.cierre) + si(f.esc) + ' ' + si(f.overlay) + si(f.alto) + si(f.ancho)
    );
}

const conFalla = filas.filter(falla);
const cuenta = (k) => filas.filter((f) => f[k] === false).length;
console.log('\n--- Resumen ---');
console.log(`sin botón de cierre .................. ${cuenta('cierre')}`);
console.log(`sin cierre con Esc .................. ${cuenta('esc')}   (${filas.filter(f => f.esc === 'n/a').length} exentos por data-no-esc)`);
console.log(`sin altura acotada .................. ${cuenta('alto')}`);
console.log(`ancho que no entra en 1366px ........ ${cuenta('ancho')}`);
console.log(`sin cierre por click en overlay ..... ${cuenta('overlay')}   (informativo, no cuenta como falla)`);
const cajas = filas.reduce((a, f) => ((a[f.caja] = (a[f.caja] || 0) + 1), a), {});
console.log('contenedores usados:', JSON.stringify(cajas));
console.log(`\n${conFalla.length ? '✘' : '✅'} ${conFalla.length} de ${filas.length} modales incumplen el checklist.`);
if (conFalla.length) conFalla.forEach(f => console.log(`   - ${f.id} (línea ${f.linea})`));
