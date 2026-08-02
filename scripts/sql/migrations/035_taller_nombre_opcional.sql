-- ============================================================================
-- 035 — El nombre del taller pasa a ser opcional: alcanza con la ubicación
-- ============================================================================
-- Motor: PostgreSQL (Supabase, proyecto flfhpffslhjcuvhxsnjz)
--
-- POR QUÉ
-- Salió de probarlo en la calle. El repartidor va en moto y no tiene tiempo de escribir
-- nombre, dirección, contacto y teléfono en cada local: o registra rápido, o no registra.
-- Y para lo que el registro tiene que resolver — saber por dónde anduvo y que dos
-- repartidores no repitan el mismo local — la coordenada sola alcanza:
--   * el aviso de "acá ya se dejó tarjeta" compara DISTANCIA, nunca nombres (los nombres
--     se escriben distinto igual: "El Rápido" / "celulares el rapido");
--   * el mapa de cobertura sale de lat/lng;
--   * el dueño abre el punto en Google Maps y ve qué local es.
-- El nombre pasa a ser un dato que suma cuando hay tiempo, no un peaje para registrar.
--
-- EL LÍMITE QUE SÍ IMPORTA
-- Una entrega sin nombre Y sin coordenada no sirve para nada: no se puede ubicar ni
-- identificar. El CHECK de abajo exige al menos una de las dos. Es la única regla que queda.
--
-- Verificado antes de aplicar: entregas = 0 filas, así que ninguna fila existente viola el
-- CHECK nuevo.
-- ============================================================================

ALTER TABLE public.entregas
    ALTER COLUMN taller_nombre DROP NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'entregas_nombre_o_punto_check') THEN
        ALTER TABLE public.entregas
            ADD CONSTRAINT entregas_nombre_o_punto_check
            CHECK (taller_nombre IS NOT NULL OR lat IS NOT NULL);
    END IF;
END $$;

COMMENT ON COLUMN public.entregas.taller_nombre IS
    'Nombre del taller, opcional desde la 035. Si viene NULL, la entrega se identifica por su coordenada. El CHECK entregas_nombre_o_punto_check impide que falten las dos.';

-- ============================================================================
-- ROLLBACK
-- ============================================================================
-- ALTER TABLE public.entregas DROP CONSTRAINT IF EXISTS entregas_nombre_o_punto_check;
-- -- Ojo: volver a poner NOT NULL exige que ninguna fila tenga taller_nombre nulo.
-- -- UPDATE public.entregas SET taller_nombre = 'Sin nombre' WHERE taller_nombre IS NULL;
-- -- ALTER TABLE public.entregas ALTER COLUMN taller_nombre SET NOT NULL;
-- ============================================================================
