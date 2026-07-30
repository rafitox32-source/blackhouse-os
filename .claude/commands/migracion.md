---
description: Migración Supabase con introspección previa del esquema
argument-hint: <qué tiene que hacer la migración>
---

Migración pedida: `$ARGUMENTS`

**Esta base es PRODUCCIÓN REAL**: proyecto `flfhpffslhjcuvhxsnjz`, 4 empresas, 12 usuarios,
~799 productos, facturas emitidas. Nada de improvisar.

## 1. Introspección PRIMERO (no negociable)

Antes de escribir una sola línea de SQL:

- `list_tables` para ver el esquema actual.
- Para cada tabla que vas a tocar, mirá sus columnas y tipos reales.

Motivo: el ratio histórico es 177 `execute_sql` contra 7 `list_tables`, y eso produjo 22
errores del tipo `column "empresa_id" does not exist`, `column "fecha_entrega" does not
exist`, `operator does not exist: text = integer`. Comparar `text` con `bigint` fue un error
recurrente: fijate en el tipo de `empresa_id` antes de escribir el `WHERE`.

## 2. Escribir el archivo

- Va en `scripts/sql/`, con el **siguiente número libre** (mirá qué números ya existen; van
  006, 007, 008, 009... no lo adivines).
- **Idempotente siempre**: `create table if not exists`, `create or replace function`,
  `drop policy if exists ... ; create policy ...`. Ya pasó
  `relation "ordenes_tracking" already exists`.
- Antes de crear una tabla, verificá que no exista ya algo equivalente con otro nombre: el
  usuario terminó con dos tablas de cierre duplicadas (*"tengo 2 tabla cierre de caja y
  cierre de dia en supabase"*).
- En PL/pgSQL: **nunca** `SELECT col INTO var FROM tabla` (falla con `42P01` en este
  proyecto). Usá `var := (SELECT col FROM tabla WHERE ...);`. Los `RETURNING ... INTO` y el
  `SELECT a,b INTO x,y` multi-columna sí funcionan.

## 3. Mostrarme el SQL antes de aplicarlo

Resumen en 3 bullets de qué cambia y qué se puede romper, y el SQL. Esperá mi confirmación
si la migración hace `UPDATE`/`DELETE` sobre datos existentes o cambia una función que ya
usa la web.

## 4. Aplicar y verificar

- Aplicá con `apply_migration`.
- **Verificá con un `SELECT`** que el objeto quedó como se esperaba. Sin ese paso la
  migración no cuenta como hecha.
- **Nunca ejecutes un RPC "de prueba" que escriba datos** (hay facturas reales; el
  clasificador lo bloqueó con razón). Si necesitás probarlo, hacelo dentro de una
  transacción con `rollback`, o con datos marcados como test y limpialos después.

## 5. Si falla por RLS

`42501 permission denied for table X` o `new row violates row-level security policy` significa
que el problema es **la política**, no la query. Revisá la policy antes de reescribir el SQL.
Y no toques `security_invoker` de las vistas para "arreglarlo" — eso debilita el aislamiento
entre empresas y fue bloqueado con razón.
