-- Pruebas Unitarias para Migración 001 (TDD)
-- Este script verifica que el aislamiento RLS funciona correctamente sin dejar rastros.

BEGIN;

-- SETUP: Crear tabla de prueba si no existe en el entorno actual
CREATE TABLE IF NOT EXISTS productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    stock_disponible INT NOT NULL,
    precio_venta DECIMAL(10,2) NOT NULL,
    costo_proveedor DECIMAL(10,2) NOT NULL,
    margen DECIMAL(5,2) NOT NULL
);

-- Insertar datos de prueba simulados
INSERT INTO productos (nombre, stock_disponible, precio_venta, costo_proveedor, margen) 
VALUES ('Producto A', 10, 100.00, 50.00, 50.00);

-- TEST 1: Verificación de acceso del Administrador (No debe haber regresión)
SET ROLE admin_role;
DO $$
DECLARE
    v_count INT;
BEGIN
    SELECT COUNT(*) INTO v_count FROM productos;
    IF v_count = 0 THEN
        RAISE EXCEPTION 'TEST FALLIDO: El admin_role no puede ver los productos (regresión detectada).';
    END IF;
END $$;
RESET ROLE;

-- TEST 2: Verificación de denegación directa para el Vendedor (Aislamiento)
SET ROLE pos_vendedor;
DO $$
BEGIN
    -- Intentamos acceder a la tabla base, esto debe disparar una excepción de permisos
    PERFORM * FROM productos;
    RAISE EXCEPTION 'TEST FALLIDO: El vendedor tiene acceso directo a la tabla productos. El aislamiento falló.';
EXCEPTION
    WHEN insufficient_privilege THEN
        -- Comportamiento esperado: no tiene permisos sobre la tabla base
        NULL;
END $$;

-- TEST 3: Verificación de acceso seguro a través de la vista (Enmascaramiento)
DO $$
DECLARE
    v_count INT;
BEGIN
    -- Acceso a través de la vista debe ser exitoso
    SELECT COUNT(*) INTO v_count FROM vw_productos_pos;
    IF v_count = 0 THEN
        RAISE EXCEPTION 'TEST FALLIDO: El vendedor no puede ver los productos a través de la vista segura vw_productos_pos.';
    END IF;
END $$;
RESET ROLE;

-- TEARDOWN: Deshacemos todo (incluso la inserción y creación de tabla si ocurrió aquí)
-- Esto garantiza que la prueba deje la base de datos exactamente como estaba
ROLLBACK;
