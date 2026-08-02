-- ============================================================================
-- 030 — El código del repartidor también es un código de descuento
-- ============================================================================
-- Motor: PostgreSQL (Supabase, proyecto flfhpffslhjcuvhxsnjz)
--
-- POR QUÉ
-- Con la 029, el código del repartidor (JUAN01) solo servía para saber quién trajo al
-- cliente. El problema práctico: al taller que recibe la tarjeta no le cambia nada
-- escanearla, así que no escanea. Dándole un precio mejor, el código pasa a ser un motivo
-- para usarlo — y de paso mejora la atribución, porque ahora al cliente le conviene decir
-- de quién es el código.
--
-- LA CUENTA
-- Precio de lista de la anualidad: S/ 400. Objetivo: que con el código quede en S/ 300.
--   descuento = (400 - 300) / 400 = 25 %
-- Por eso el DEFAULT es 25. Queda por repartidor y no global para poder correr promos
-- distintas (una zona difícil, una campaña corta) sin tocar código.
--
-- OJO CON EL PRECIO DE LISTA
-- No existe una tabla de precios en esta base: los S/ 400 viven hoy en la documentación
-- comercial y, a partir de ahora, en la constante PRECIO_LISTA_ANUAL de
-- `web-limpia/api/db.js`, que es donde se calcula el precio promocional que ve el cliente.
-- Si algún día cambia el precio, hay que tocar esa constante — si no, este 25 % va a
-- devolver un número distinto de 300.
--
-- La comisión NO cambia de fórmula: se sigue calculando sobre lo que se cobró de verdad
-- (`licencias.venta_monto`), no sobre el precio de lista. Vender a 300 con 10 % son S/ 30.
-- ============================================================================

ALTER TABLE public.repartidores
    ADD COLUMN IF NOT EXISTS descuento_pct numeric NOT NULL DEFAULT 25
        CHECK (descuento_pct >= 0 AND descuento_pct <= 90);

COMMENT ON COLUMN public.repartidores.descuento_pct IS
    'Descuento sobre la anualidad que consigue quien llega con el código de este repartidor. 25 = la anualidad de S/400 queda en S/300. El tope de 90 evita regalar la licencia por un cero de más.';

-- ============================================================================
-- ROLLBACK
-- ============================================================================
-- ALTER TABLE public.repartidores DROP COLUMN IF EXISTS descuento_pct;
-- ============================================================================
