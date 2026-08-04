-- ============================================================================
-- 036 — La ubicación pasa a ser obligatoria en cada entrega
-- ============================================================================
-- Motor: PostgreSQL (Supabase, proyecto flfhpffslhjcuvhxsnjz)
--
-- POR QUÉ
-- Decisión del dueño después de probarlo en la calle. Una entrega sin coordenada no sirve
-- para lo único que el registro tiene que resolver:
--   * no se puede verificar por dónde anduvo el repartidor (el nombre lo escribe él);
--   * no entra en el aviso de "acá ya se dejó tarjeta", que compara distancias;
--   * no aparece en el mapa de cobertura.
-- Antes se aceptaba nombre SIN punto (migración 035) como salida cuando el GPS no andaba.
-- Esa salida se cierra: o el registro trae ubicación, o no se registra.
--
-- LO QUE ESTO CUESTA, A PROPÓSITO
-- Si un celular no consigue señal de GPS (galería con techo, teléfono viejo), el repartidor
-- NO va a poder registrar ese taller. Es el precio de que ningún dato llegue sin coordenada.
-- Para aflojarlo alcanza con volver al CHECK de la 035 (ver el rollback).
--
-- Verificado antes de aplicar: entregas = 0 filas, 0 sin coordenada. Ninguna fila existente
-- queda en falta con el NOT NULL nuevo.
-- ============================================================================

-- El CHECK de la 035 ("nombre o punto") queda sin sentido: ahora el punto es obligatorio
-- siempre, así que exigirlo con NOT NULL es más claro y más fuerte.
ALTER TABLE public.entregas
    DROP CONSTRAINT IF EXISTS entregas_nombre_o_punto_check;

ALTER TABLE public.entregas
    ALTER COLUMN lat SET NOT NULL,
    ALTER COLUMN lng SET NOT NULL;

COMMENT ON COLUMN public.entregas.lat IS
    'Latitud donde el repartidor marcó la entrega (GPS del celular). Obligatoria desde la 036: sin coordenada no se registra.';
COMMENT ON COLUMN public.entregas.taller_nombre IS
    'Nombre del taller. Opcional: el local se identifica por su coordenada, que sí es obligatoria (036). Se completa solo si el repartidor tiene tiempo.';

-- ============================================================================
-- ROLLBACK (volver a permitir entregas sin ubicación)
-- ============================================================================
-- ALTER TABLE public.entregas
--     ALTER COLUMN lat DROP NOT NULL,
--     ALTER COLUMN lng DROP NOT NULL;
-- ALTER TABLE public.entregas
--     ADD CONSTRAINT entregas_nombre_o_punto_check
--     CHECK (taller_nombre IS NOT NULL OR lat IS NOT NULL);
-- ============================================================================
