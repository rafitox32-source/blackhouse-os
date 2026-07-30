-- ============================================================================
-- 028 — Cerrar el acceso anónimo a las funciones pos_* (POS que nunca se publicó)
-- ============================================================================
--
-- POR QUÉ
-- La migración 006 (y la 013) crearon un POS completo para la vendedora basado en
-- token propio: pos_login / pos_productos / pos_registrar_venta / pos_cierre_caja /
-- pos_cierre_completo. Todas son SECURITY DEFINER (se saltan el RLS a propósito) y
-- tienen EXECUTE otorgado a `anon`, porque el cliente pensado era la web estática
-- `web-vendedora/`, que usaría la anon key desde el navegador.
--
-- Esa web NUNCA se publicó. El POS que la vendedora usa de verdad es
-- `panel-vendedor.html` en blackhouse-os-web.vercel.app, y ese llama a
-- `registrar_venta_movil` / `generar_boleta_movil` — que están correctamente
-- restringidas a `service_role` y se invocan del lado del servidor (/api/db).
--
-- Verificado antes de escribir esto:
--   * `web-limpia` (el sitio real que abre la APK): 0 referencias a pos_*.
--   * `index.html` y `main.js`: 0 referencias a pos_*.
--   * Las únicas referencias en el repo son los .sql y `web-vendedora/` (no publicada).
--   * pos_sesiones = 0 filas, ventas_pos = 0 filas, cierres_caja = 0 filas.
--     El camino pos_* nunca se usó en producción, así que revocar no rompe nada en curso.
--
-- QUÉ ARRIESGA DEJARLO COMO ESTÁ
-- La anon key es pública por diseño (va embebida en la web y en la APK). Con ella,
-- cualquiera puede llamar `pos_login(usuario, password)` sin límite de intentos: es un
-- oráculo de contraseñas contra la tabla `usuarios` real, sin rate limit y saltándose el
-- RLS. Si acierta una, recibe un token de 12 h que además habilita leer el catálogo y
-- registrar ventas/movimientos de stock de esa empresa.
--
-- QUÉ HACE ESTA MIGRACIÓN
-- Solo quita el permiso de ejecución a anon/authenticated. NO borra las funciones ni
-- ninguna tabla: si algún día se publica `web-vendedora/`, se revierte con el bloque de
-- rollback del final. Es el cambio mínimo que cierra el agujero.
--
-- OJO: `cierres_caja` y `cierres_dia` NO son tablas duplicadas (parecía que sí por el
-- nombre). Son cosas distintas y las dos se quedan — ver los COMMENT del paso 2.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1) Revocar EXECUTE a anon y authenticated
-- ---------------------------------------------------------------------------
REVOKE EXECUTE ON FUNCTION public.pos_login(text, text)                     FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.pos_productos(text)                       FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.pos_registrar_venta(text, jsonb, text)    FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.pos_cierre_caja(text, date, boolean)      FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.pos_cierre_completo(text, date)           FROM anon, authenticated;

-- ---------------------------------------------------------------------------
-- 2) Dejar por escrito en la base la diferencia entre las dos tablas de cierre,
--    para que no se vuelvan a confundir (el reclamo fue "tengo 2 tablas cierre
--    de caja y cierre de dia en supabase").
-- ---------------------------------------------------------------------------
COMMENT ON TABLE public.cierres_caja IS
  'Cierre de TURNO de un vendedor del POS (migración 006): por vendedor_usuario y ventana '
  'desde/hasta, con el total partido en efectivo/otros. Pertenece al POS basado en token '
  '(funciones pos_*), cuyo cliente web-vendedora/ nunca se publicó: hoy está sin uso (0 filas) '
  'y sus funciones ya no son ejecutables por anon (migración 028). NO es lo mismo que cierres_dia.';

COMMENT ON TABLE public.cierres_dia IS
  'Cierre del DÍA del taller completo (migración 009): una fila por empresa y fecha, con '
  'ingresos_taller + ingresos_pos - gastos - compras_externas - devoluciones = neto. Es el que '
  'usa la app de escritorio (main.js, IPC de cierre de día; solo el rol dueño puede registrarlo). '
  'NO es lo mismo que cierres_caja, que es el cierre de turno de un vendedor.';

-- ---------------------------------------------------------------------------
-- 3) Verificación — después de aplicar, esto NO debe listar anon ni authenticated
-- ---------------------------------------------------------------------------
--   select p.proname, coalesce(array_to_string(p.proacl,' | '),'(default: PUBLIC)') as permisos
--   from pg_proc p join pg_namespace n on n.oid = p.pronamespace
--   where n.nspname = 'public' and p.proname like 'pos_%'
--   order by p.proname;
--
-- Y esta llamada, hecha con la anon key, debe fallar con "permission denied for function":
--   select public.pos_login('cualquiera','cualquiera');

-- ---------------------------------------------------------------------------
-- ROLLBACK (solo si algún día se publica web-vendedora/ de verdad)
-- ---------------------------------------------------------------------------
-- GRANT EXECUTE ON FUNCTION public.pos_login(text, text)                  TO anon, authenticated;
-- GRANT EXECUTE ON FUNCTION public.pos_productos(text)                    TO anon, authenticated;
-- GRANT EXECUTE ON FUNCTION public.pos_registrar_venta(text, jsonb, text) TO anon, authenticated;
-- GRANT EXECUTE ON FUNCTION public.pos_cierre_caja(text, date, boolean)   TO anon, authenticated;
-- GRANT EXECUTE ON FUNCTION public.pos_cierre_completo(text, date)        TO anon, authenticated;
--
-- Si se publica, antes de re-otorgar habría que ponerle rate limit / bloqueo por intentos
-- fallidos a pos_login, que hoy no tiene ninguno.

-- ---------------------------------------------------------------------------
-- APLICADA en produccion el 2026-07-30 (migraciones `revocar_pos_anon` y
-- `revocar_verificar_password_anon`). Verificado despues de aplicar:
-- has_function_privilege('anon', ...) = false para las 5 pos_* y para
-- verificar_password. registrar_venta_movil / generar_boleta_movil sin cambios.
-- ---------------------------------------------------------------------------
REVOKE EXECUTE ON FUNCTION public.verificar_password(text, text) FROM anon, authenticated;
