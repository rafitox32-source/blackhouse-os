-- Migración 004: agrega 'cargador' al set permitido de tipo_pieza en grupos_compatibilidad
-- Motor: PostgreSQL (Supabase, proyecto flfhpffslhjcuvhxsnjz)
-- REQUIERE: 002_grupos_compatibilidad.sql ya aplicada.
--
-- Contexto: el dueño va a poder importar listas de compatibilidad de MICAS y CARGADORES
-- (Fase 5, import desde Excel/PDF/Imagen). Hoy el CHECK de tipo_pieza solo permite
-- 'mica', 'pantalla', 'general' — falta 'cargador'. Cuando llegue la fase de baterías
-- (mencionada por el dueño como fase futura, fuera de este alcance), esta misma migración
-- se repite agregando 'bateria' en un archivo 005 análogo.
--
-- Verificado por lectura (pg_constraint) antes de escribir esto: el nombre real de la
-- constraint es "grupos_compatibilidad_tipo_pieza_check", definición actual:
--   CHECK ((tipo_pieza = ANY (ARRAY['mica'::text, 'pantalla'::text, 'general'::text])))
-- Postgres no permite "ALTER ... ADD VALUE" sobre un CHECK con ARRAY literal (eso es
-- sintaxis de ENUM, no aplica aquí) — hay que DROP + ADD CONSTRAINT.
--
-- NO APLICADA POR EL AGENTE: solo se prepara el archivo, igual que 002/003 en su momento.
-- Aplicar vía Supabase MCP (apply_migration) después de revisión.

BEGIN;

ALTER TABLE public.grupos_compatibilidad
    DROP CONSTRAINT grupos_compatibilidad_tipo_pieza_check;

ALTER TABLE public.grupos_compatibilidad
    ADD CONSTRAINT grupos_compatibilidad_tipo_pieza_check
    CHECK (tipo_pieza = ANY (ARRAY['mica'::text, 'pantalla'::text, 'general'::text, 'cargador'::text]));

COMMIT;

-- Verificación sugerida después de aplicar:
--   SELECT conname, pg_get_constraintdef(oid) FROM pg_constraint
--   WHERE conrelid = 'grupos_compatibilidad'::regclass AND contype = 'c';
--   -- debe mostrar 'cargador' incluido en el ARRAY.
