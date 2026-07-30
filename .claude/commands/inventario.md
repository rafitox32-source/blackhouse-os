---
description: Carga masiva de stock desde una lista pegada a mano o un Excel/PDF de proveedor
argument-hint: [pega la lista, o la ruta del archivo]
---

Cargar en inventario: `$ARGUMENTS`

Este comando existe porque el usuario tipeó ~12 mensajes de micas a mano (tandas Samsung,
Xiaomi, Huawei/Honor) y tuvo que corregir sobre lo ya tipeado:
- *"iba sacando de cajas contando y posiblemente repito modelos solo suma la cantidad, el a2449 es a24 cantidad 49"*
- *"se me paso la 'y' en algunos pero el stock esta al final, asumes que los 3 comparten stock"*

## 1. Normalizar

Convertí lo pegado a una tabla `modelo | cantidad | sku | notas`, aplicando estas reglas que
ya se acordaron con el usuario:

- **Números pegados al modelo son la cantidad**: `a2449` = modelo `A24`, cantidad `49`.
- **Modelos repetidos se SUMAN**, no se reemplazan (cuenta cajas de a poco y repite).
- **Modelos encadenados con `/`, `y`, `-` comparten el stock que aparece al final**:
  `a10 y a11 y a12 30` = los tres modelos comparten cantidad 30.
- Normalizá la nomenclatura al formato que ya usa la tabla `productos` (mirala primero, ver
  paso 2), no al que venga pegado.

## 2. Ver el esquema y el stock actual ANTES de insertar

- `list_tables` y mirá las columnas reales de `productos` (nombre, `sku`, `costo`, `precio`,
  `stock`, `empresa_id` — y **su tipo**: comparar `text` con `bigint` ya rompió queries).
- Traé los modelos que **ya existen** para los SKU/nombres de la lista, así distinguís
  "crear nuevo" de "sumar al existente".

## 3. Mostrarme la tabla y esperar confirmación

Antes de escribir en la base, mostrame:
- Filas a **crear** (nuevas) y filas a **actualizar** (con stock antes → después).
- Cualquier línea que no pudiste interpretar, listada aparte. **No la adivines.**
- Total de unidades, para que cuadre con lo que conté.

Esperá mi "dale" antes del insert. Es producción real.

## 4. Insertar y verificar

- Una sola transacción. Idempotente: si lo corro dos veces con la misma lista, no debe
  duplicar (usá el SKU como clave).
- Después del insert, `SELECT` de los modelos tocados y mostrame el resultado.

## Si viene un Excel o PDF de proveedor

Ojo: `pypdf`, `pymupdf` y `pdftoppm`/poppler **no están instalados** en esta máquina y ya
bloquearon este flujo antes. Si el archivo es PDF, decímelo y proponé la alternativa
(convertirlo a Excel/CSV, o que te pegue el texto) en vez de pelear con la instalación.
Para Excel usá la skill `xlsx`.
