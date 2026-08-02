-- ============================================================================
-- 031 — La comisión es el 30 % del precio de lista, no de lo que se cobró
-- ============================================================================
-- Motor: PostgreSQL (Supabase, proyecto flfhpffslhjcuvhxsnjz)
--
-- POR QUÉ
-- La 029 calculaba la comisión sobre `licencias.venta_monto` (lo efectivamente cobrado).
-- Con el descuento de la 030 eso castigaba al repartidor: si el cliente pagaba S/300 por
-- usar SU código, la comisión bajaba también. Decisión del dueño: **el código es un
-- beneficio para el consumidor, no un costo para el repartidor.**
--
-- Regla nueva: la comisión es siempre un porcentaje del PRECIO DE LISTA de la anualidad
-- (S/400), sin importar a cuánto se cerró la venta.
--
--   comisión = 400 × 30 % = S/ 120, fijo.
--
-- LA CUENTA COMPLETA DE UNA VENTA REFERIDA
--   el taller paga ........  S/ 300   (400 menos el 25 % de la 030)
--   comisión al repartidor   S/ 120   (30 % de 400)
--   queda para la casa ....  S/ 180
--
-- DÓNDE VIVE EL CÁLCULO
-- En `web-limpia/api/db.js`, acción `licencia_referido`, usando la constante
-- PRECIO_LISTA_ANUAL. `venta_monto` se sigue guardando porque es lo que entró de verdad
-- (sirve para la contabilidad), pero ya NO es la base de la comisión.
--
-- `comision_monto` queda congelado al asignarlo: si algún día cambia el precio de lista o
-- el porcentaje, las comisiones ya calculadas no se mueven solas.
-- ============================================================================

-- El default pasa de 10 a 30. Los repartidores que ya existan conservan el suyo: esto solo
-- afecta a los que se creen de acá en adelante (hoy la tabla está vacía, así que no hay
-- ninguno con el valor viejo).
ALTER TABLE public.repartidores
    ALTER COLUMN comision_pct SET DEFAULT 30;

COMMENT ON COLUMN public.repartidores.comision_pct IS
    'Porcentaje de comisión sobre el PRECIO DE LISTA de la anualidad (no sobre lo cobrado): 30 = S/120 por cada licencia vendida de S/400 de lista, aunque el cliente haya pagado S/300 usando el código de descuento.';

-- ============================================================================
-- ROLLBACK
-- ============================================================================
-- ALTER TABLE public.repartidores ALTER COLUMN comision_pct SET DEFAULT 10;
-- (y volver licencia_referido en api/db.js a calcular sobre venta_monto)
-- ============================================================================
