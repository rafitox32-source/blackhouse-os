---
description: Audita los 46 modales de index.html (cierre + ajuste a pantalla) y opcionalmente los arregla
argument-hint: [nombre de un modal, o vacío para auditar todos] [--arreglar]
---

Auditá los modales de `index.html`: `$ARGUMENTS`
(sin argumentos = todos; con `--arreglar` = además corregí los que fallen).

Este comando existe porque el usuario reportó la misma falla 3 veces: *"no tiene boton de
cerrar"*, *"esta pestaña no tiene para cerrar"*, y finalmente *"esta ventana no tiene cierre
y no se ajusta bien a la pantalla, verifica que todas las ventanas tengan cierre y se puedan
ajustar a la pantalla"*.

## Cómo encontrarlos

Son ~46, con `id="modal-*"` y clases `modal-overlay` / `modal-content`:

```bash
grep -n 'id="modal-' "C:/Users/BLACK HOUSE/Desktop/app de rafitox/index.html"
```

Usá `docs/MAPA_CODIGO.md` para ubicar el bloque de cada uno y leé **solo ese rango** con
`Read` + `offset`/`limit`. No leas `index.html` completo (19.144 líneas).

## Qué verificar en cada modal

| Chequeo | Cómo se ve bien |
|---|---|
| Botón de cierre visible | un `<button>`/`<span>` de cierre dentro de `.modal-content`, con handler que oculta el overlay |
| Cierra con `Esc` | listener de `keydown` (global o por modal) que cierra el que esté abierto |
| Cierra con click en overlay | handler en `.modal-overlay` que cierra si `e.target === overlay` |
| Se ajusta en alto | `max-height: 90vh` + `overflow-y: auto` en `.modal-content` |
| Se ajusta en ancho | `max-width` en `%`/`vw`, no en `px` fijos grandes |

## Salida

Una tabla markdown: modal · línea · cierre · Esc · overlay · alto · ancho · veredicto.
Al final, la lista de los que fallan, ordenada por gravedad (sin botón de cierre primero).

## Si viene `--arreglar`

- Corregí los que fallen **reusando el patrón del modal que ya esté mejor implementado** (no
  inventes uno nuevo por modal, ese fue el origen de las quejas de estética).
- Si el `Esc` y el click en overlay se pueden resolver con **un** listener genérico para
  todos los `.modal-overlay` en vez de 46 handlers, hacelo así y decime.
- Al terminar, corré `/qa` sobre 3 o 4 de los modales corregidos a 1366x768 y en ancho móvil
  para confirmar con captura. Y regenerá `docs/MAPA_CODIGO.md` si agregaste funciones.
