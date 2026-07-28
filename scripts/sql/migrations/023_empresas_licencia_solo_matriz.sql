-- Migración 023: las columnas de licencia no las puede tocar el taller
-- Motor: PostgreSQL (Supabase, proyecto flfhpffslhjcuvhxsnjz)
--
-- POR QUÉ:
--   Salió probando las políticas de la 022. Un usuario cualquiera de un taller podía hacer
--
--       update empresas set fecha_de_vencimiento = '3000-01-01' where id = <la suya>
--
--   y quedarse con acceso eterno. La política de empresas le da permiso sobre SU fila, y una
--   política RLS es por fila, no por columna: no puede distinguir entre cambiar el logo y
--   cambiar hasta cuándo pagó.
--
--   La restricción por columna se hace con GRANT.

REVOKE UPDATE ON public.empresas FROM authenticated;

-- Lo que el taller sí edita de su propia ficha.
GRANT UPDATE (nombre, razon_social, ruc, direccion, telefono,
              logo_url, ticket_mensaje, ticket_extra, ticket_opciones, tema)
   ON public.empresas TO authenticated;

-- fecha_de_vencimiento, plan_actual, limite_de_usuario e ip_autorizada quedan fuera a
-- propósito: solo se tocan con la clave de servicio, o sea desde la casa matriz al emitir o
-- renovar una licencia.

-- Crear o borrar empresas tampoco: un taller nuevo nace por el registro con código de
-- licencia, que corre del lado del servidor.
REVOKE INSERT, DELETE ON public.empresas FROM authenticated;
