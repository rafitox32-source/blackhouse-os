-- Migración 020: licencias de prueba medidas en días (demos de 7 días)
-- Motor: PostgreSQL (Supabase, proyecto flfhpffslhjcuvhxsnjz)
--
-- POR QUÉ:
--   Las licencias solo sabían de meses (meses_duracion) y el registro hacía
--   fechaVencimiento.setMonth(+meses). Para una demo de 7 días eso no sirve: el mínimo era
--   1 mes, y poner 0 habría vencido el mismo día que se activa.
--
--   Se agrega dias_duracion. Cuando viene, manda sobre los meses; cuando es NULL, todo sigue
--   funcionando exactamente igual que antes, así que las licencias ya emitidas no se tocan.

ALTER TABLE public.licencias
    ADD COLUMN IF NOT EXISTS dias_duracion integer;

COMMENT ON COLUMN public.licencias.dias_duracion IS
    'Duración en días para licencias de prueba. Si está puesta, manda sobre meses_duracion.';
