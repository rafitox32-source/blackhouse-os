-- ============================================================================
-- 034 — Que reenviar una entrega guardada sin señal no la duplique
-- ============================================================================
-- Motor: PostgreSQL (Supabase, proyecto flfhpffslhjcuvhxsnjz)
--
-- POR QUÉ
-- Los talleres están en galerías y sótanos donde no hay datos. Hasta ahora, si el
-- repartidor tocaba Guardar sin señal, se le avisaba que no se guardó y tenía que
-- reescribir todo. La página pasa a guardar la entrega en el celular y subirla sola cuando
-- vuelve la conexión.
--
-- EL PROBLEMA QUE ESO CREA
-- El caso feo no es "no llegó": es "llegó, se guardó, y la respuesta se perdió en el
-- camino". El celular cree que falló, la deja en la cola y la reenvía. Resultado: el mismo
-- taller cargado dos veces, y encima disparando el aviso de "acá ya se dejó tarjeta" contra
-- sí mismo.
--
-- LA SOLUCIÓN
-- El celular le pone un identificador propio a cada entrega ANTES de mandarla, y lo repite
-- en cada reintento. El índice único de abajo hace que el segundo intento choque en vez de
-- insertar; el servidor trata ese choque como "ya estaba" y responde bien. O sea: mandar la
-- misma entrega diez veces deja una sola fila.
--
-- Es opcional porque las entregas cargadas con señal no necesitan pasar por la cola, y las
-- que ya existen no tienen ninguno. El índice es parcial por lo mismo: solo indexa las que
-- realmente traen identificador.
-- ============================================================================

ALTER TABLE public.entregas
    ADD COLUMN IF NOT EXISTS cliente_uuid uuid;

CREATE UNIQUE INDEX IF NOT EXISTS entregas_cliente_uuid_idx
    ON public.entregas (cliente_uuid)
    WHERE cliente_uuid IS NOT NULL;

COMMENT ON COLUMN public.entregas.cliente_uuid IS
    'Identificador que genera el celular antes de mandar la entrega, para que los reintentos de la cola sin señal no la dupliquen. NULL en las entregas cargadas directamente con conexión.';

-- ============================================================================
-- ROLLBACK
-- ============================================================================
-- DROP INDEX IF EXISTS public.entregas_cliente_uuid_idx;
-- ALTER TABLE public.entregas DROP COLUMN IF EXISTS cliente_uuid;
-- ============================================================================
