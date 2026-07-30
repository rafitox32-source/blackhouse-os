---
description: Bump de versión atómico y coherente en package.json, index.html y el tag
argument-hint: [nueva versión, p.ej. 2.55.0 — o vacío para solo auditar coherencia]
---

Versión pedida: `$ARGUMENTS` (si viene vacío, **solo auditá** la coherencia y reportá, sin
cambiar nada).

## El bug que este comando evita

Reportado 6 veces en 3 sesiones distintas:
- *"cuando se actualiza el app me sigue saliendo actualizar aun teniendo la version ya actualizada"*
- *"el boton de la app de escritorio cuando actualizo nunca desaparece"*
- *"el letrero que dice hay una nueva version disponible aun se queda fijo asi este actualizado"*
- *"no sale el v2 en el nombre de inicio de sesion ni dentro del app"*
- *"corrige para que npm start siempre me muestre la version actualizada, me esta mostrando una anterior"*

Causa: la versión vive en varios lugares a la vez y se actualizan por separado.

## 1. Auditar dónde aparece la versión

```bash
grep -n '2\.5[0-9]\|version' "C:/Users/BLACK HOUSE/Desktop/app de rafitox/package.json"
grep -nE 'v?[0-9]+\.[0-9]+\.[0-9]+|V2|version' "C:/Users/BLACK HOUSE/Desktop/app de rafitox/index.html" | head -40
```

Buscá específicamente: la pantalla de login, el footer, el título de la ventana, y la lógica
de comparación del auto-updater en `main.js`.

## 2. La regla

**`package.json` es la única fuente de verdad.** Todo lo demás la lee en runtime
(`app.getVersion()` en el main, expuesto por `preload.js`, e inyectado en el DOM).

Si encontrás un literal de versión hardcodeado en `index.html`, **no lo actualices: convertilo
en lectura dinámica.** Cada literal que quede es el próximo reporte de este bug.

## 3. Verificar el auto-updater

La comparación tiene que ser semver y el banner tiene que desaparecer cuando local == remoto.
Revisá el caso de igualdad explícitamente (era ahí donde fallaba) y también el caso en que el
remoto sea **menor** que el local.

## 4. Cerrar

- Si cambiaste la versión: `npm start` y confirmá con captura que se ve la nueva en el login
  y en el footer (`/qa`).
- Recordá que el CI hace su propio `chore(release): X.Y.Z` — no dupliques el bump: si vas a
  publicar, dejá que el release automático mande y usá `/subir`.
