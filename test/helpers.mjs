/**
 * Helpers de QA visual para BlackHouse OS.
 *
 * Esto reemplaza los ~25 archivos `_tmp_*.mjs` que se escribían y se borraban en cada
 * sesión. Si te falta un helper, AGREGALO ACÁ en vez de escribir un script nuevo.
 *
 * Uso típico (ver test/qa-ejemplo.mjs):
 *
 *   import { abrirApp, login, abrirModal, captura, cerrarApp } from './helpers.mjs';
 *   const { app, page } = await abrirApp();
 *   await login(page);
 *   await abrirModal(page, 'modal-holo-foto');
 *   await captura(page, 'holo-foto');
 *   await cerrarApp(app);
 *
 * Reglas que este archivo codifica (salieron de la auditoría de julio 2026):
 *  - `playwright-core` es devDependency FIJA. Nunca `--no-save`, nunca desinstalarlo.
 *  - Timeout 60 s, no 30: con 30 s hubo 12 timeouts (Electron + Supabase tardan más).
 *  - Se espera por SELECTOR, nunca por tiempo fijo.
 *  - Siempre `cerrarApp()`, incluso si la prueba falla (el `taskkill` se corrió 35 veces
 *    a mano en una sola sesión por no tener teardown).
 */

import { execSync } from 'node:child_process';
import { mkdirSync, rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { _electron as electron } from 'playwright-core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const REPO = path.resolve(__dirname, '..');
export const CAPTURAS = path.join(__dirname, 'capturas');
export const TIMEOUT = 60_000;

/** Resolución de la laptop del usuario. Todo se verifica acá primero. */
export const LAPTOP = { width: 1366, height: 768 };
export const MOVIL = { width: 390, height: 844 };

/**
 * Abre la app real (Electron) con un perfil desechable para no tocar la sesión del usuario.
 * @param {{ userDataDir?: string, viewport?: {width:number,height:number} }} opts
 */
export async function abrirApp(opts = {}) {
    const userDataDir = opts.userDataDir ?? path.join(__dirname, '.perfil-qa');
    rmSync(userDataDir, { recursive: true, force: true });
    mkdirSync(userDataDir, { recursive: true });

    const app = await electron.launch({
        args: [REPO, `--user-data-dir=${userDataDir}`, '--disable-gpu'],
        cwd: REPO,
        timeout: TIMEOUT,
    });

    const page = await app.firstWindow({ timeout: TIMEOUT });
    page.setDefaultTimeout(TIMEOUT);
    await page.waitForSelector('#login-screen', { timeout: TIMEOUT });
    await page.setViewportSize(opts.viewport ?? LAPTOP);

    // Los errores de consola del renderer son la señal más útil cuando "no sale nada".
    page.on('console', (m) => {
        if (m.type() === 'error') console.error('  [consola]', m.text());
    });
    page.on('pageerror', (e) => console.error('  [pageerror]', e.message));

    return { app, page, userDataDir };
}

/**
 * Inicia sesión. Los datos salen del .env (QA_USER / QA_PASS) para no hardcodear
 * credenciales en un archivo versionado.
 */
export async function login(page, usuario = process.env.QA_USER, password = process.env.QA_PASS) {
    if (!usuario || !password) {
        throw new Error(
            'Faltan QA_USER / QA_PASS en el .env. No pongas credenciales en el código: ' +
            'este archivo está versionado.'
        );
    }
    await page.fill('#user-login', usuario);
    await page.fill('#pass-login', password);
    // Que "recordar sesión" quede apagado: prendido rompió el logout dos veces.
    const chk = page.locator('#chk-recordar-sesion');
    if (await chk.isChecked().catch(() => false)) await chk.uncheck();

    await page.click('button[onclick="iniciarSesion()"]');

    // Esperar por resultado, no por tiempo: o desaparece el login, o aparece el error.
    const error = page.locator('#login-error');
    await Promise.race([
        page.waitForSelector('#login-screen', { state: 'hidden', timeout: TIMEOUT }),
        error.waitFor({ state: 'visible', timeout: TIMEOUT }).then(async () => {
            const txt = (await error.textContent())?.trim();
            if (txt) throw new Error(`Login falló: ${txt}`);
        }),
    ]);
    return page;
}

/** Abre un modal por id (`modal-*`) y espera a que su overlay sea visible. */
export async function abrirModal(page, id, disparador) {
    if (disparador) await page.click(disparador);
    else await page.evaluate((i) => {
        const el = document.getElementById(i);
        if (!el) throw new Error(`No existe #${i}`);
        el.style.display = 'flex';
    }, id);

    await page.waitForSelector(`#${id}`, { state: 'visible', timeout: TIMEOUT });
    return page.locator(`#${id}`);
}

/**
 * Checklist de modal del CLAUDE.md §4. Devuelve un objeto con el veredicto de cada punto.
 * Esto es lo que usa `/modales`.
 */
export async function auditarModal(page, id) {
    return page.evaluate((i) => {
        const overlay = document.getElementById(i);
        if (!overlay) return { id: i, existe: false };
        const content = overlay.querySelector('.modal-content') || overlay.firstElementChild;
        const cs = content ? getComputedStyle(content) : null;
        const cierre = !!overlay.querySelector(
            '[onclick*="cerrar"],[onclick*="Cerrar"],.modal-close,[data-cerrar]'
        );
        return {
            id: i,
            existe: true,
            botonCierre: cierre,
            maxHeight: cs?.maxHeight ?? null,
            overflowY: cs?.overflowY ?? null,
            ajustaAlto: !!cs && cs.maxHeight !== 'none' && ['auto', 'scroll'].includes(cs.overflowY),
            anchoFijo: !!cs && cs.maxWidth === 'none' && cs.width.endsWith('px'),
            alto: content?.getBoundingClientRect().height ?? 0,
        };
    }, id);
}

/** Captura a `test/capturas/<nombre>.png`. Devuelve la ruta para pasarla a SendUserFile. */
export async function captura(page, nombre) {
    mkdirSync(CAPTURAS, { recursive: true });
    const ruta = path.join(CAPTURAS, `${nombre}.png`);
    await page.screenshot({ path: ruta, fullPage: false });
    console.log('  captura ->', ruta);
    return ruta;
}

/** Cambia el viewport a móvil para verificar que un modal se ajusta. */
export async function enMovil(page, fn) {
    await page.setViewportSize(MOVIL);
    try { return await fn(); } finally { await page.setViewportSize(LAPTOP); }
}

/** Teardown. Llamalo SIEMPRE, incluso si la prueba falló. */
export async function cerrarApp(app, userDataDir) {
    try { await app?.close(); } catch { /* ya estaba cerrada */ }
    try { execSync('taskkill //IM electron.exe //F', { stdio: 'ignore' }); } catch { /* no había */ }
    if (userDataDir) rmSync(userDataDir, { recursive: true, force: true });
}

/** Envuelve una prueba para que el teardown corra pase lo que pase. */
export async function conApp(fn, opts) {
    const ctx = await abrirApp(opts);
    try { return await fn(ctx); }
    finally { await cerrarApp(ctx.app, ctx.userDataDir); }
}
