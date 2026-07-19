-- Migración 016: tema por defecto por empresa
-- Motor: PostgreSQL (Supabase, proyecto flfhpffslhjcuvhxsnjz)
--
-- Permite que cada empresa tenga un tema visual por defecto. Al iniciar sesión,
-- si el equipo todavía no eligió un tema propio, se aplica el de la empresa.
--
--   • tema (text) → 'original' | 'negro' | 'blanco' | 'doha'. NULL = 'original'.

ALTER TABLE public.empresas ADD COLUMN IF NOT EXISTS tema text;

COMMENT ON COLUMN public.empresas.tema IS 'Tema por defecto de la empresa (original/negro/blanco/doha). Se aplica al entrar si el equipo no eligió otro.';
