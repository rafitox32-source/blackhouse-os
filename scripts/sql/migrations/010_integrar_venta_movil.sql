-- Migración 010: integrar el POS real de la vendedora con el módulo financiero
-- Motor: PostgreSQL (Supabase, proyecto flfhpffslhjcuvhxsnjz)
-- ✅ YA APLICADA en producción el 2026-07-17 (vía MCP apply_migration) y probada end-to-end.
--
-- CONTEXTO (descubierto revisando la web publicada):
--   La vendedora vende desde una APK que abre https://blackhouse-os-web.vercel.app/panel-vendedor.html
--   ("BlackHouse OS | Ventas"). Ese POS llama al RPC registrar_venta_movil, que solo descontaba
--   stock y anotaba en movimientos_stock — la venta NO quedaba registrada con su importe, por lo
--   que era invisible para Métricas, Cierre del Día y el Excel.
--
-- QUÉ HACE: se reemplaza registrar_venta_movil manteniendo la firma y la lógica original EXACTAS
-- (la web publicada no se toca), y se AGREGA el registro de la venta en ventas_pos/ventas_pos_items:
--   - precio: el precio actual del producto (productos.precio)
--   - vendedor: parseado de la nota "… (vendedor: usuario)"
--   - medio_pago: 'efectivo' por defecto (el POS de la vendedora no envía el medio)
-- El bloque nuevo es tolerante (EXCEPTION WHEN others => NULL): si algo falla ahí, la venta de la
-- vendedora sigue funcionando igual que siempre.

CREATE OR REPLACE FUNCTION public.registrar_venta_movil(
    p_producto_id bigint, p_cantidad integer, p_empresa_id text, p_sku text, p_nota text
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
  v_nuevo_stock integer;
  v_precio numeric;
  v_nombre text;
  v_vendedor text;
  v_venta_id bigint;
BEGIN
  -- === Lógica original (sin cambios) ===
  IF p_cantidad IS NULL OR p_cantidad <= 0 THEN
    RAISE EXCEPTION 'Cantidad invalida';
  END IF;

  UPDATE productos
  SET stock = stock - p_cantidad
  WHERE id = p_producto_id
    AND empresa_id = p_empresa_id
    AND stock >= p_cantidad
  RETURNING stock, precio, nombre INTO v_nuevo_stock, v_precio, v_nombre;

  IF v_nuevo_stock IS NULL THEN
    RAISE EXCEPTION 'Stock insuficiente o producto no encontrado';
  END IF;

  INSERT INTO movimientos_stock (empresa_id, sku, cantidad, nota)
  VALUES (p_empresa_id, p_sku, -p_cantidad, p_nota);

  -- === NUEVO: registrar la venta en el módulo financiero (ventas_pos) ===
  BEGIN
    v_vendedor := nullif(trim(substring(p_nota from 'vendedor: ([^)]+)')), '');
    INSERT INTO ventas_pos(empresa_id, vendedor_usuario, medio_pago, total)
    VALUES (p_empresa_id::bigint, v_vendedor, 'efectivo',
            round(coalesce(v_precio, 0) * p_cantidad, 2))
    RETURNING id INTO v_venta_id;

    INSERT INTO ventas_pos_items(venta_id, origen, producto_id, nombre, precio_unitario, cantidad, subtotal)
    VALUES (v_venta_id, 'stock', p_producto_id, coalesce(v_nombre, p_sku),
            coalesce(v_precio, 0), p_cantidad,
            round(coalesce(v_precio, 0) * p_cantidad, 2));
  EXCEPTION WHEN others THEN
    NULL;
  END;

  RETURN v_nuevo_stock;
END;
$function$;

-- Prueba realizada (y revertida): venta de 1 unidad del producto 1736 (empresa 6) →
-- stock descontado, fila en ventas_pos con vendedor parseado y total correcto, item creado.
