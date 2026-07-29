# BlackHouse OS — guía para trabajar en este repo gastando el mínimo de tokens

Este repo tiene dos archivos gigantes que son el corazón de la app:
`index.html` (~18,600 líneas, todo el frontend en un solo archivo) y
`main.js` (~5,000 líneas, proceso principal de Electron). Leerlos
completos cada vez que hay que tocar algo es la forma más cara posible
de trabajar aquí. Las reglas de abajo existen para evitar eso.

## Antes de modificar `index.html` o `main.js`

1. **Nunca uses Read sin `offset`/`limit` sobre `index.html` o `main.js`.**
   Son demasiado grandes para leerlos completos — cuesta caro y la
   mayor parte no es relevante para el cambio puntual que se está haciendo.
2. **Ubica primero, lee después.** Para encontrar dónde está algo, en este orden:
   - Si sabes el nombre exacto (función, id, canal IPC): usa **Grep**
     directamente sobre `index.html`/`main.js` con `-n` para el número de línea.
   - Si no sabes el nombre exacto: busca en **`docs/MAPA_CODIGO.md`**
     (índice generado de funciones, modales e IPC con su línea). Es
     mucho más chico que los archivos reales — grepealo o léelo, no
     dispara el mismo costo.
   - Si el mapa está desactualizado (se nota si el grep en el mapa no
     encuentra algo que sabes que existe), regenéralo con
     `node scripts/mapa-codigo.js` (no tiene dependencias, tarda
     milisegundos) y vuelve a buscar.
3. **Lee solo el rango necesario.** Con el número de línea en mano, usa
   `Read` con `offset` ~30-50 líneas antes y `limit` que cubra la
   función/bloque relevante. No leas "por si acaso" secciones vecinas
   que no vas a tocar.
4. **Edita con `Edit`, no reescribiendo el archivo.** Usa el string
   único mínimo necesario como `old_string`. No uses `Write` sobre estos
   dos archivos salvo que de verdad haga falta reescribirlos enteros
   (prácticamente nunca).
5. **No releas un archivo justo después de editarlo.** Si `Edit`/`Write`
   no dio error, el cambio se aplicó — confía en eso en vez de volver a
   leer para "confirmar".
6. **Actualiza el mapa cuando agregues algo nuevo y grande.** Si añades
   una función importante, un modal nuevo, o un canal IPC, corré
   `node scripts/mapa-codigo.js` al terminar para que el mapa quede al
   día para la próxima vez (barato: unos segundos, evita búsquedas a
   ciegas después).

## Verificación (Playwright / Electron / navegador)

Lanzar la app real con Playwright para verificar visualmente es
necesario para bugs de UI, timing (WebRTC, cámaras) o layout — pero es
la operación más cara de esta sesión de trabajo. Antes de levantar
Electron/Chromium para probar algo:

- Si el cambio es lógica pura verificable leyendo el código (una
  condición, un cálculo, un query), no hace falta levantar la app —
  basta con revisar el diff.
- Si sí hace falta probar en vivo, probá el flujo completo en una sola
  pasada (no lances la app, probés una cosa, la cierres, y la vuelvas a
  lanzar para probar la siguiente) — batchea todas las verificaciones
  del cambio en una sola sesión de Playwright.
- Limpiá siempre los scripts temporales de prueba (`_tmp_*.mjs/html`) y
  las dependencias instaladas solo para testear (`playwright-core`)
  al terminar — no los dejes acumulándose en el repo.

## Subagentes

No delegues a un subagente (Agent tool) una búsqueda que un Grep/Glob
directo resuelve en un paso — un subagente arranca en frío y tiene que
re-derivar contexto que ya tenés, lo cual sale más caro, no más barato.
Reservalos para investigación abierta que de verdad necesite explorar
varias rutas o archivos sin saber de antemano dónde mirar.

## Git

El remoto de este repo corre un release automático
(`chore(release): X.Y.Z [skip ci]`) que sube la versión de
`package.json` en cada push. Es normal que un `git push` sea
rechazado por eso — no es un conflicto real de tu trabajo. Solución de
siempre: `git fetch origin main` + `git merge origin/main --no-edit` +
volver a pushear.
