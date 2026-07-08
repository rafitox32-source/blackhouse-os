-- Migración 001: Seguridad a Nivel de Filas (RLS) para el Módulo POS Vendedor
-- Motor asume: PostgreSQL
-- Descripción: Aísla el acceso a la tabla productos y expone una vista segura para los vendedores.

BEGIN;

-- 1. Creación de Roles (usamos DO block para evitar errores si ya existen)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'admin_role') THEN
        CREATE ROLE admin_role;
    END IF;
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'pos_vendedor') THEN
        CREATE ROLE pos_vendedor;
    END IF;
END
$$;

-- 2. Habilitación de RLS en la tabla base
-- Nota: Asumimos que la tabla 'productos' ya existe. Si no, esto fallará limpiamente gracias al BEGIN.
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;

-- 3. Política de Paso Total para el Administrador
-- Garantiza que el sistema central / backend no se rompa
DROP POLICY IF EXISTS admin_all_productos ON productos;
CREATE POLICY admin_all_productos 
    ON productos 
    FOR ALL 
    TO admin_role 
    USING (true) 
    WITH CHECK (true);

-- Revocar cualquier acceso directo previo a la tabla para el vendedor (por seguridad en profundidad)
REVOKE ALL ON productos FROM pos_vendedor;

-- 4. Capa de Enmascaramiento: Vista Segura
-- La vista filtra columnas sensibles como 'costo_proveedor' o 'margen'
CREATE OR REPLACE VIEW vw_productos_pos AS
    SELECT 
        id, 
        nombre, 
        stock_disponible, 
        precio_venta
    FROM productos;

-- 5. Otorgar permisos únicamente sobre la vista
GRANT SELECT ON vw_productos_pos TO pos_vendedor;

COMMIT;
