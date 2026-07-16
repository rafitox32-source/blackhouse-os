-- Migración 007: técnico asignado por orden de taller (cada técnico ve solo sus órdenes)
-- Motor: PostgreSQL (Supabase, proyecto flfhpffslhjcuvhxsnjz)
--
-- CONTEXTO / PROBLEMA QUE RESUELVE:
--   Hasta hoy las órdenes (`ordenes`) solo se filtraban por empresa_id, así que TODOS los
--   técnicos de una empresa veían las mismas órdenes en Control de Taller. El dueño necesita
--   que cada técnico (ej. Frank, Luis) tenga su propio listado.
--
--   Esta columna guarda a qué técnico está asignada cada orden (el `usuario` de login del
--   técnico, ej. 'frank' / 'tecnicoluis'). NULL = sin asignar.
--
--   El filtrado real ocurre en la capa de aplicación (main.js): en obtener-ordenes, si el rol
--   de la sesión es 'tecnico' se devuelven solo las órdenes con tecnico_asignado = su usuario;
--   el dueño y el vendedor siguen viendo todas. La asignación se hace desde Recepción (al crear
--   la orden) o reasignando desde la tabla del Taller.
--
-- ESQUEMA REAL VERIFICADO (list_tables) antes de escribir esto:
--   ordenes: id bigint PK, empresa_id text, estado text, ... (sin ninguna columna de técnico).
--   usuarios: usuario text unique, rol text ('dueno'|'vendedor'|'tecnico'|...), empresa_id bigint.
--   Se guarda el `usuario` (texto) y no un FK a usuarios.id para no acoplar y porque main.js ya
--   identifica al técnico por su usuario de login (usuarioActual).

BEGIN;

ALTER TABLE public.ordenes ADD COLUMN IF NOT EXISTS tecnico_asignado text;

CREATE INDEX IF NOT EXISTS idx_ordenes_tecnico ON public.ordenes(tecnico_asignado);

COMMIT;

-- Verificación sugerida después de aplicar:
--   SELECT column_name, data_type FROM information_schema.columns
--     WHERE table_name='ordenes' AND column_name='tecnico_asignado';
