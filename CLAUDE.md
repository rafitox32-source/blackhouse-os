# BlackHouse OS — guía para trabajar en este repo

Electron, v2.54.0. Dos archivos gigantes son el corazón de la app: `index.html`
(**19.144 líneas**, todo el frontend) y `main.js` (**5.199 líneas**, proceso principal).
Leerlos completos es la forma más cara de trabajar acá. Las reglas de abajo existen para
evitar eso y para no repetir los bucles que ya costaron 5 compactaciones de contexto.

Las reglas generales de la máquina (rutas, shell, secretos, backups) están en
`C:/Users/BLACK HOUSE/.claude/CLAUDE.md`.

## 0. Mapa del sistema — leer antes de preguntar dónde está algo

Esto NO es un repo aislado. Un pedido suele tocar 2 o 3 de estas piezas:

| Pieza | Ruta / URL | Notas |
|---|---|---|
| App de escritorio | este repo | Electron + `index.html` + `main.js`. Release automático por GitHub Actions. |
| Web / portal del cliente | `C:/Users/BLACK HOUSE/Desktop/web-limpia` | Repo aparte (`rafitox32-source/blackhouse-os-web`), Vercel auto-despliega `main`. Ahí viven `tracking.html`, `panel-vendedor.html`, `camara-celular.html`, `api/db.js`. |
| POS de la vendedora | `panel-vendedor.html` en Vercel | Se cambia por RPC en Supabase, no en la APK. Ver memoria `pos-vendedora-real`. |
| Software "Ambicion" | `C:/Users/BLACK HOUSE/Pictures/ambicion/ambicion/ambicion` | **EN SALIDA — se va a retirar del producto. No invertir trabajo acá.** No arreglar el bug de "no abre en otras PC" ni tocar el candado de lanzamiento; si un pedido lo roza, avisar y confirmar antes. |
| Base de datos | Supabase `flfhpffslhjcuvhxsnjz` | **PRODUCCIÓN REAL**: 4 empresas, 12 usuarios, ~799 productos, facturas emitidas. |

Si el pedido menciona "la web", "el tracking", "el cliente", "la vendedora" o "el QR", casi
siempre el cambio va en `web-limpia`, no acá. Confirmar antes de editar, no adivinar.

## 1. Antes de modificar `index.html` o `main.js`

1. **Nunca `Read` sin `offset`/`limit`** sobre estos dos archivos.
2. **Empezá por `docs/MAPA_CODIGO.md`, siempre.** Es el índice generado de funciones,
   modales y canales IPC con su número de línea. La regla concreta: *el primer Grep de la
   sesión va contra el mapa, no contra el monolito.* (En julio el mapa se regeneró 9 veces
   pero solo se grepeó 3, mientras se hacían 196 greps directos contra los monolitos. El
   mapa está, no se usaba: esa era la fuga.)
   - Si el mapa no tiene lo que buscás: `node scripts/mapa-codigo.js` y volvé a buscar.
   - Solo si el mapa falla dos veces, grepeá el archivo real.
3. **Leé solo el rango necesario**, con `offset` ~30-50 líneas antes del hit.
4. **Editá con `Edit`, nunca con `Write`, sobre estos dos archivos.** `Write main.js`
   completo se hizo 18 veces en una sola sesión (transcript de 15 MB). Eso no se repite.
5. **No releas un archivo justo después de editarlo.** Si `Edit` no dio error, se aplicó.
6. **Regenerá el mapa al terminar** si agregaste función, modal o canal IPC nuevo.

## 2. Definición de "terminado"

Un cambio no está listo hasta que:

- **`node --check`** pasa en los JS tocados (`main.js`, `preload.js`). No hace falta
  correrlo a mano: está en el hook `PostToolUse` de `.claude/settings.json`.
- Si tocó **UI**: se abrió la pantalla real y se sacó captura → `/qa`.
- Si tocó **un modal nuevo**: cumple el checklist de §4 → `/modales`.
- Si tocó **SQL**: se verificó con un `SELECT` después de aplicar → `/migracion`.
- Si tocó **la versión**: coincide en `package.json`, en `index.html` y en el tag → `/version`.

Prohibido decir "quedó listo" con evidencia solo de código. El historial está lleno de
*"no me sale nada"*, *"sigue sin verse"*, *"no lo detecta"*: el usuario terminó siendo el QA
y pegando 24 capturas a mano en una sola sesión.

## 3. Verificación visual (Playwright / Electron)

**Playwright está instalado de forma permanente. No se instala ni se desinstala por sesión.**
La regla anterior decía "limpiá `playwright-core` al terminar" y el resultado fue
`npm install --no-save playwright-core` **27 veces en una sola sesión** (~15 min de reloj
tirados). Queda derogada:

- `playwright-core` es `devDependency` fija del repo. **Nunca** `--no-save`, **nunca**
  desinstalarlo. Los navegadores ya están cacheados en
  `C:/Users/BLACK HOUSE/AppData/Local/ms-playwright` (`chromium-1228`).
- Los drivers de prueba viven en **`test/`**, versionados, con helpers reusables
  (`test/helpers.mjs`: `abrirApp`, `login`, `abrirModal`, `captura`, `cerrarApp`). Usá `/qa`.
- **No crees más `_tmp_*.mjs` en la raíz del repo** — se acumularon ~25 y el usuario se
  quejó del desorden. Si necesitás algo realmente desechable, va al scratchpad de la sesión.
- Batcheá todas las verificaciones de un cambio en **una** pasada.
- El timeout por defecto de 30 s es corto para esta app (Electron + Supabase): usá 60 s y
  esperá por selector, no por tiempo. Hubo 12 timeouts de `waitForLoadState`/`fill`/`locator`.

**Features que dependen de hardware** (cámara, IMEI, código de barras, WebRTC en vivo) **no
se pueden validar con Playwright.** Para esas:
1. Logging visible **en la propia pantalla**, no en consola: estado, error y qué se detectó.
   El usuario lo pidió textual: *"mejor adapta algo para que me diga que ya inicio el en
   vivo si no que me muestre el error en la misma pantalla"*.
2. Un modo "cargar foto de prueba" para iterar el decodificador sin cámara.
3. Recién después, pedirle al usuario que pruebe con el equipo real.

## 4. Modales / ventanas — checklist obligatorio

Hay **46** modales (`id="modal-*"`, clases `modal-overlay` / `modal-content`). El usuario
reportó la misma falla 3 veces: *"no tiene boton de cerrar"*, *"esta pestaña no tiene para
cerrar"*, *"verifica que todas las ventanas tengan cierre y se puedan ajustar a la pantalla"*.

Estado real (auditado con `node test/auditar-modales.mjs`): **41 de 42 cumplen**. Lo que hay que
mantener al agregar o tocar un modal:

- **Botón de cierre visible.** Vale cualquiera de las formas que ya se usan en el repo: `onclick`
  a una función `cerrarX()`, un `style.display='none'` inline, una `✖`, o un botón "Cerrar" /
  "Cancelar". El único que no tiene es `modal-confirm-custom`, a propósito (decisión obligatoria).
- **Cierre con `Esc`: ya es global**, no hay que hacer nada por modal. El listener busca el
  control de cierre del propio modal y le hace click, para no saltarse la limpieza (apagar la
  cámara, cortar una grabación). Si un modal es una decisión obligatoria, marcalo con
  `data-no-esc` y explicá por qué en un comentario.
- **Altura: ya la da la clase.** `.modal-content` (40 modales) y `.confirm-box` (2) traen
  `max-height: 90vh` + `overflow-y: auto`. **No hace falta repetirlo inline** — si ves un
  `max-height` inline en un `.modal-content`, es redundante. Solo importa si creás un contenedor
  con una clase nueva.
- **Ancho:** esto es escritorio (1366x768), no una web responsive. Un `width: 480px` está bien;
  solo es problema si pasa de ~1300px sin `max-width`.
- **Cierre por click en el overlay: NO se agrega por defecto**, y no cuenta como defecto en la
  auditoría. Ninguno de los 42 lo tiene, y está bien: en un modal de formulario, cerrar al hacer
  click afuera le borra a la persona lo que estaba escribiendo. Agregalo sólo a modales de solo
  lectura, y sólo si lo piden.

Auditoría: `/modales` (o `node test/auditar-modales.mjs --fallan`).

## 5. Supabase — es producción real

Antes de cualquier DDL, `UPDATE`, `DELETE` o RPC nuevo:

1. **`list_tables` primero.** Ratio histórico: 177 `execute_sql` contra 7 `list_tables`
   → 22 errores por columnas o tipos que no existen (`column "empresa_id" does not exist`,
   `operator does not exist: text = integer`).
2. Migraciones numeradas en `scripts/sql/`, **idempotentes** (`if not exists` /
   `drop if exists`). Ya pasó `relation "ordenes_tracking" already exists`, y quedaron dos
   tablas de cierre duplicadas en la base.
3. En funciones PL/pgSQL: **no** usar `SELECT col INTO var FROM tabla` (falla con `42P01`);
   usar `var := (SELECT ...)`. Ver memoria `supabase-plpgsql-select-into`.
4. **Nunca "probar" un RPC en vivo** que escriba datos: hay facturas reales. Probar dentro
   de una transacción con `rollback`, o con datos marcados como test y limpiarlos después.
5. Si falla por RLS (`42501 permission denied`, `new row violates row-level security`), el
   problema es la política, no la query: revisar la policy antes de reescribir el SQL.

Atajo: `/migracion`.

## 6. Secretos de este repo

- **Nunca imprimir** el contenido de `.env`, de `.github/workflows/release.yml`, ni valores
  de password o API key, ni truncados. Verificar **presencia y formato**, no el valor.
- No poner claves inline en comandos (`KEY="sb_secret_..."` en un Bash fue bloqueado).
  Leerlas desde `.env` dentro del script.
- `.env` y `token gibhut.txt` están en `.gitignore`. Que siga así.
- Deuda abierta que el usuario marcó como "no urgente": el `.env` se embebe en el build vía
  `release.yml`. Cuando se retome, ver `docs/SACAR_SERVICE_ROLE_DEL_INSTALADOR.md`.

## 7. Git y release

El remoto corre un release automático (`chore(release): X.Y.Z [skip ci]`) que sube la
versión de `package.json` en cada push, así que **el local siempre queda atrás**.

- **`git fetch origin main && git rebase origin/main` ANTES de commitear**, no después de
  que el push falle. Hubo 7 pushes rechazados (`! [rejected] main -> main`) en 4 sesiones
  distintas, más un conflicto en `main.js`.
- Mensajes de commit: **una sola línea** con `-m "..."`. Los heredocs
  (`-m "$(cat <<'EOF'`) rompen en PowerShell (`error: pathspec '...'`).
- **`gh` NO está instalado.** Para la API de GitHub, `curl` con `$GH_TOKEN`.
- **`sleep N && ...` está bloqueado.** Para esperar CI: `until curl ...; do ...; done` o
  `run_in_background`.
- Los `Monitor` largos se perdieron 3 veces (`No completion record was found`). Si armás una
  espera de CI, dejá también el comando de verificación manual a mano.

Todo esto junto: `/subir`.

## 8. Versión y aviso de actualización

Bug reportado 6 veces en 3 sesiones (*"me sigue saliendo actualizar aun teniendo la version ya
actualizada"*, *"el boton cuando actualizo nunca desaparece"*). **Arreglado**, y así quedó:

- **`package.json` es la única fuente de verdad.** El número llega al renderer por el IPC
  `pedir-version` → `recibir-version` (usa `app.getVersion()`) y se pinta en `#app-version`
  (barra lateral) y `#app-version-footer` (login). No hardcodear números de versión.
- **El `V2` del logo NO es la versión, es la marca.** Está hardcodeado a propósito en tres
  lugares (login, sidebar, y el template de `tituloHtml`) porque el usuario lo pidió así
  ("ponle el nombre V2 al final"). **No lo conviertas en dinámico.**
- **Guarda de versión en `main.js` (`esVersionMasNueva`)**: el banner solo se muestra si la
  versión anunciada es **estrictamente mayor** que la instalada. electron-updater puede anunciar
  una versión que no es más nueva (típico: quedó una descarga pendiente en su caché y el usuario
  ya instaló a mano desde la web) — eso era la causa del aviso que no se iba. Cubierto por
  `node test/version.test.mjs` (19 casos, incluido `2.54.10 > 2.54.9`, que falla si alguien
  compara versiones como texto).
- Los listeners del updater se registran **antes** de `checkForUpdates()`, y los avisos al
  renderer se encolan hasta `did-finish-load` (si no, se pierden cuando la respuesta llega antes
  de que la ventana termine de cargar).

**`npm start` mostrando una versión vieja no es un bug**: en desarrollo la versión sale del
`package.json` local, y el CI bumpea la versión en el remoto (`chore(release): X.Y.Z`), así que
el local queda atrás hasta que hagas `fetch`+`rebase`. Por eso `/subir` rebasa antes de
commitear. Si el número local no coincide con el último release, es eso — no lo persigas como
defecto.

Atajo: `/version`.

## 9. Diseño / UI

Ya existen clases propias: `bh-card`, `bh-btn-purple`, `bh-btn-ghost`. Hubo 8 quejas
estéticas (*"se ven muy anticuado"*, *"el boton compactibilidad y devoluciones se ven feo
por que son diferente a los demas"*, *"se ve muy recargado"*) porque cada botón nuevo se
estilizó a mano.

**Reusá las clases existentes; no inventes estilos inline por componente.** Si falta un
token, agregalo al CSS común y documentalo en `docs/UI.md`.

## 10. Alcance: confirmar antes de escribir código

Los pedidos llegan como párrafos largos con 3-5 requisitos encadenados. Cuando eso pasa,
**listá el alcance entendido en 3-5 bullets y esperá confirmación** antes de tocar un
archivo de 19k líneas. Casos donde se construyó lo contrario de lo pedido: la tienda del
cliente (*"creo que estas poniendo una tienda de whatsapp eso no quiero"*, después de dos
interrupciones seguidas) y el login de Ambicion (se construyó el candado y después se pidió
quitarlo).

Y reportá progreso sin que lo pidan: hubo 3 *"¿qué quedó pendiente?"* y 6 *"continua /
sigue / dale"*. Al cerrar cada tarea del plan, una línea con qué quedó y qué falta.

## 11. Subagentes

No delegues a un subagente una búsqueda que un Grep/Glob resuelve en un paso: arranca en
frío y re-deriva contexto que ya tenés. Reservalos para investigación abierta.

Y no delegues revisión de código de firmware/flasheo (módulos MTK, Odin, PIT, IMEI,
`nvdata`) con descripciones tipo *"Review MTK module functions"*: los safeguards del modelo
cortan el agente (pasó 3 de 8 veces, y se reintentó con el mismo prompt + "retry" sin
cambiar nada). Eso se revisa en el hilo principal, por archivo.

## 12. Comandos de este repo

| Comando | Para qué |
|---|---|
| `/subir` | commit + rebase + push + esperar CI + verificar release/deploy |
| `/qa` | abrir la app real y sacar capturas de las pantallas afectadas |
| `/migracion` | migración Supabase con introspección previa del esquema |
| `/modales` | auditar los 46 modales (cierre + ajuste a pantalla) |
| `/version` | bump de versión atómico y coherente |
| `/inventario` | cargar listas de stock pegadas a mano o desde Excel |
