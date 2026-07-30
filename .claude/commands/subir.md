---
description: Commit + rebase + push + esperar CI + verificar release y deploy
argument-hint: [mensaje de commit en una línea]
---

Publicá los cambios pendientes de este repo siguiendo estos pasos **en orden**, sin saltarte
ninguno, y reportando al final en 3 líneas. Mensaje de commit sugerido por el usuario:
`$ARGUMENTS` (si viene vacío, redactalo vos en una línea, formato conventional commits).

## 1. Chequeo previo

- `git -C "C:/Users/BLACK HOUSE/Desktop/app de rafitox" status --short` para ver qué hay.
- `node --check` en cada `.js`/`.mjs` modificado. Si alguno falla, **pará acá** y reportá.
- Si hay archivos `_tmp_*` o basura de pruebas sin trackear en la raíz, borralos antes de
  commitear (no los subas).

## 2. Rebase ANTES de commitear (esto es lo que siempre falla)

El remoto corre un release automático que commitea `chore(release): X.Y.Z [skip ci]` en cada
push, así que el local **siempre** queda atrás. Por eso:

```
git -C "<repo>" fetch origin main
git -C "<repo>" stash --include-untracked   # solo si hace falta
git -C "<repo>" rebase origin/main
git -C "<repo>" stash pop                   # solo si hiciste stash
```

Si hay conflicto (históricamente en `main.js`), resolvelo mostrándome el hunk antes de seguir.

## 3. Commit y push

- `git -C "<repo>" add -A`
- `git -C "<repo>" commit -m "<mensaje en UNA línea>"` — **nunca** heredoc
  (`-m "$(cat <<'EOF'`): rompe en PowerShell con `error: pathspec '...'`.
- `git -C "<repo>" push origin main`
- Si el push igual es rechazado: `fetch` + `rebase` + push otra vez. No uses `--force`.

## 4. Esperar el CI (sin `sleep`, sin `gh`)

`gh` no está instalado en esta máquina y `sleep N && ...` está bloqueado por el clasificador.
Usá un bucle de polling:

```bash
REPO=rafitox32-source/blackhouse-os
until curl -s -H "Authorization: token $GH_TOKEN" \
  "https://api.github.com/repos/$REPO/actions/runs?per_page=1" \
  | grep -q '"status": *"completed"'; do :; done
```

Corré esto con `run_in_background` si tarda, y **verificá su output** (no lo dejes colgado:
ya se perdieron 3 monitores con `No completion record was found`). Si el run termina en
`failure`, traé el log del step que falló y reportá sin seguir al paso 5.

## 5. Verificar que de verdad se publicó

- Que el release nuevo exista y **tenga el asset del instalador** (`.exe`): fue un bug real
  antes (`electron-builder no subia el instalador por conflicto de tipo de release`).
- Que la versión del release coincida con `package.json` después del rebase.

## 6. Reportar

Tres líneas: versión publicada · qué entró en este push · qué tiene que probar el usuario a
mano (sobre todo si hay algo que dependa de cámara/hardware, que no se puede verificar acá).
