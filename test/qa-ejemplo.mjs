/**
 * Ejemplo/plantilla de prueba visual. Copiá este archivo como `test/qa-<tema>.mjs`.
 *
 *   node test/qa-ejemplo.mjs
 *
 * Batcheá TODO lo que quieras verificar de un cambio en una sola pasada: no abras y cierres
 * la app una vez por pantalla.
 */

import { conApp, login, abrirModal, auditarModal, captura, enMovil } from './helpers.mjs';

await conApp(async ({ page }) => {
    // 1. Login (usa QA_USER / QA_PASS del .env)
    await login(page);
    await captura(page, 'ejemplo-01-inicio');

    // 2. Un modal: abrir, auditar el checklist, capturar en laptop y en móvil
    const id = 'modal-detalle-orden';
    await abrirModal(page, id);
    console.log('  checklist:', await auditarModal(page, id));
    await captura(page, `ejemplo-02-${id}-laptop`);
    await enMovil(page, () => captura(page, `ejemplo-03-${id}-movil`));

    // 3. Cerrar con Esc y confirmar que se fue
    await page.keyboard.press('Escape');
    await page.waitForSelector(`#${id}`, { state: 'hidden' }).catch(() => {
        console.error(`  ✘ #${id} no cierra con Esc`);
    });
});
