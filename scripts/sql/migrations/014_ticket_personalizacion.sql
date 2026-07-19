-- Migración 014: personalización completa del ticket/comprobante impreso
-- Motor: PostgreSQL (Supabase, proyecto flfhpffslhjcuvhxsnjz)
--
-- El dueño puede personalizar por completo lo que se imprime en la tickera 80mm y en el
-- comprobante: logo del negocio, encabezado con los datos de la empresa (nombre, RUC,
-- dirección, teléfono — ya existentes) y textos al pie (agradecimiento + nota extra).
--
-- Se agregan tres columnas a `empresas`:
--   • logo_url       → logo del negocio (URL http(s) o data URI base64) para el encabezado.
--   • ticket_mensaje → mensaje de agradecimiento al pie (ej: "¡Gracias por su preferencia!").
--   • ticket_extra   → nota extra al pie (garantía, redes sociales, horario, etc.).

ALTER TABLE public.empresas
  ADD COLUMN IF NOT EXISTS logo_url       text,
  ADD COLUMN IF NOT EXISTS ticket_mensaje text,
  ADD COLUMN IF NOT EXISTS ticket_extra   text;

COMMENT ON COLUMN public.empresas.logo_url       IS 'Logo del negocio (URL o data URI) para el encabezado de tickets/comprobantes.';
COMMENT ON COLUMN public.empresas.ticket_mensaje IS 'Mensaje de agradecimiento al pie del ticket (ej: ¡Gracias por su preferencia!).';
COMMENT ON COLUMN public.empresas.ticket_extra   IS 'Nota extra al pie del ticket (garantía, redes sociales, horario, etc.).';
