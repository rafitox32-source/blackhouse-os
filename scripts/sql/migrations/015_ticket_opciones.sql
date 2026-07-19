-- Migración 015: casillas para mostrar/ocultar datos en el ticket
-- Motor: PostgreSQL (Supabase, proyecto flfhpffslhjcuvhxsnjz)
--
-- Permite al dueño elegir qué datos del negocio aparecen en el ticket impreso
-- (logo, RUC, dirección, teléfono) sin borrarlos de la ficha de la empresa.
--
--   • ticket_opciones (jsonb) → {logo,ruc,direccion,telefono} con valores true/false.
--     NULL o campo ausente = mostrar (comportamiento por defecto).

ALTER TABLE public.empresas ADD COLUMN IF NOT EXISTS ticket_opciones jsonb;

COMMENT ON COLUMN public.empresas.ticket_opciones IS 'Qué datos mostrar en el ticket: {logo,ruc,direccion,telefono} (true/false). NULL = mostrar todo.';
