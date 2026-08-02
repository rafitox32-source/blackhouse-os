-- ============================================================================
-- 033 — Fuera `codigo` y `zona` de repartidores: los dos quedaron sin uso
-- ============================================================================
-- Motor: PostgreSQL (Supabase, proyecto flfhpffslhjcuvhxsnjz)
--
-- POR QUÉ SE VA `codigo`
-- Nació en la 029, cuando todavía estaba sobre la mesa imprimir un QR distinto por
-- repartidor: ahí el código iba impreso en la tarjeta y era la única forma de saber de quién
-- venía. Se eligió el otro camino — UN SOLO QR y el cliente elige de una lista —, y con eso
-- el código se quedó sin trabajo:
--   * la atribución la hace `leads.repartidor_id`, que sale del id que tocó el cliente;
--   * lo único que hacía era copiarse al mensaje de WhatsApp, donde el nombre se lee mejor
--     ("te la dio: Juan P." en vez de "tarjeta: JUAN01");
--   * no hay ningún formulario donde alguien escriba un código: no existe checkout.
-- Era un campo NOT NULL UNIQUE que obligaba a inventar un valor para nada.
--
-- POR QUÉ SE VA `zona`
-- Un motorizado no trabaja una zona fija: se mueve. Ponerle una al darlo de alta es adivinar,
-- y encima el dato bueno ya existe: cada fila de `entregas` guarda `distrito` y coordenada.
-- Las zonas donde anduvo se CALCULAN de dónde estuvo de verdad (lo hace el panel), en vez de
-- quedar congeladas en lo que se escribió el primer día.
--
-- SEGURO DE APLICAR
-- Verificado antes de escribir esto: repartidores = 0 filas, entregas = 0, leads = 0. No hay
-- ningún código emitido ni ninguna atribución que dependa de estas columnas.
-- ============================================================================

ALTER TABLE public.repartidores
    DROP COLUMN IF EXISTS codigo,
    DROP COLUMN IF EXISTS zona;

-- ============================================================================
-- ROLLBACK
-- ============================================================================
-- ALTER TABLE public.repartidores
--     ADD COLUMN codigo text,
--     ADD COLUMN zona   text;
-- -- Ojo: el codigo original era NOT NULL UNIQUE con CHECK (codigo ~ '^[A-Z0-9]{2,16}$').
-- -- Volver a ponerle esas restricciones exige darle un valor a cada fila que ya exista.
-- ============================================================================
