---
description: Abre la app real con Playwright y saca capturas de las pantallas afectadas
argument-hint: <pantalla o modal a verificar, p.ej. "modal-holo-foto, tienda">
---

Verificá visualmente en la app real: `$ARGUMENTS`

## Reglas del harness

- **`playwright-core` ya está instalado como `devDependency`. NO lo instales, NO uses
  `--no-save`, NO lo desinstales al terminar.** (En julio se corrió
  `npm install --no-save playwright-core` 27 veces en una sola sesión por una regla vieja que
  ya no existe.) Los navegadores están cacheados en
  `C:/Users/BLACK HOUSE/AppData/Local/ms-playwright` (`chromium-1228`).
- Usá los helpers versionados de `test/helpers.mjs`: `abrirApp()`, `login()`,
  `abrirModal(id)`, `captura(nombre)`, `cerrarApp()`. Si te falta un helper, **agregalo ahí**
  en vez de escribir un script nuevo.
- El driver va en `test/` con nombre descriptivo (`test/qa-<tema>.mjs`), no en la raíz del
  repo. **No crees `_tmp_*.mjs`**: se acumularon ~25 y el usuario se quejó del desorden.
- Timeout 60 s (no 30) y esperá por selector, no por tiempo: hubo 12 timeouts de
  `waitForLoadState`/`fill`/`locator` con el default.
- `cerrarApp()` hace el `taskkill //IM electron.exe //F` del teardown (se corrió 35 veces a
  mano en una sesión). Llamalo siempre, incluso si la prueba falla.

## Qué hacer

1. Una sola pasada de Playwright que cubra **todas** las pantallas pedidas. No abras y
   cierres la app una vez por cosa.
2. Capturá a **1366x768** (la laptop del usuario). Si el tema es un modal, capturá también
   en ancho móvil.
3. Si el modal es nuevo o lo tocamos, aplicá el checklist de `/modales` de paso: botón de
   cierre, `Esc`, click en overlay, `max-height: 90vh` + `overflow-y: auto`.
4. Mostrame las capturas con `SendUserFile` y decime en una línea por pantalla si está bien
   o qué está mal.

## Lo que este comando NO puede verificar

Cámara, escaneo de IMEI, lectura de código de barras, transmisión en vivo (WebRTC). Para eso:
dejá logging visible **en pantalla**, agregá un modo "cargar foto de prueba", y decime
explícitamente que esa parte la tengo que probar yo con el equipo real.
