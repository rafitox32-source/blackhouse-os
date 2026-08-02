-- ============================================================================
-- 032 — Ubicación de cada entrega: quién anduvo por dónde, y no repetir talleres
-- ============================================================================
-- Motor: PostgreSQL (Supabase, proyecto flfhpffslhjcuvhxsnjz)
--
-- POR QUÉ
-- Dos problemas del reparto en la calle que el nombre del taller solo no resuelve:
--   1. Saber por dónde anduvo cada repartidor de verdad (el nombre lo escribe él).
--   2. Que dos repartidores no le dejen tarjeta al mismo local. Los nombres se escriben
--      distinto ("Celulares El Rápido" / "el rapido celulares"), así que comparar texto no
--      alcanza: la coordenada sí identifica el local.
--
-- POR QUÉ NO PostGIS
-- Alcanza con dos numeric y una búsqueda por caja de coordenadas (lat/lng entre dos
-- valores), que el índice de abajo resuelve bien. La distancia exacta se calcula después
-- en JavaScript sobre las pocas filas que devuelve la caja. Meter una extensión geográfica
-- en producción por esto sería desproporcionado.
--
-- PRECISIÓN
-- `precision_m` es lo que informa el GPS del celular (accuracy). En calle con edificios
-- suele dar 20-50 m, así que dos marcas del MISMO local pueden quedar separadas varios
-- metros. Se guarda para saber cuánto confiar en cada punto: una marca con 200 m de
-- precisión no sirve para decidir si es el mismo taller.
--
-- Las tres columnas son opcionales a propósito: si el repartidor no da permiso de
-- ubicación, la entrega se guarda igual. Registrar el taller es lo importante; la
-- coordenada es una mejora, no un requisito.
-- ============================================================================

ALTER TABLE public.entregas
    ADD COLUMN IF NOT EXISTS lat         numeric CHECK (lat  IS NULL OR (lat  >= -90  AND lat  <= 90)),
    ADD COLUMN IF NOT EXISTS lng         numeric CHECK (lng  IS NULL OR (lng  >= -180 AND lng <= 180)),
    ADD COLUMN IF NOT EXISTS precision_m numeric CHECK (precision_m IS NULL OR precision_m >= 0);

-- Índice para "¿qué se marcó cerca de acá?": el filtro siempre acota lat y lng a la vez.
-- Parcial porque las entregas sin coordenada nunca son respuesta de esa búsqueda.
CREATE INDEX IF NOT EXISTS entregas_coordenadas_idx
    ON public.entregas (lat, lng)
    WHERE lat IS NOT NULL AND lng IS NOT NULL;

COMMENT ON COLUMN public.entregas.lat IS
    'Latitud donde el repartidor marcó la entrega (GPS del celular). NULL si no dio permiso de ubicación: la entrega vale igual.';
COMMENT ON COLUMN public.entregas.precision_m IS
    'Precisión en metros que informó el GPS (accuracy). Sirve para saber cuánto confiar en el punto: arriba de ~100 m no alcanza para distinguir un local de su vecino.';

-- ============================================================================
-- ROLLBACK
-- ============================================================================
-- DROP INDEX IF EXISTS public.entregas_coordenadas_idx;
-- ALTER TABLE public.entregas
--     DROP COLUMN IF EXISTS lat, DROP COLUMN IF EXISTS lng, DROP COLUMN IF EXISTS precision_m;
-- ============================================================================
