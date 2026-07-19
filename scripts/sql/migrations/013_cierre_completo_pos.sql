-- Migración 013: Cierre de caja COMPLETO para la vendedora (ventas + servicio técnico)
-- Motor: PostgreSQL (Supabase, proyecto flfhpffslhjcuvhxsnjz)
--
-- CONTEXTO: la vendedora cierra la caja al final del día y entrega UN reporte al dueño, pero
-- ese reporte debe incluir TANTO sus ventas de accesorios (POS) COMO los cobros del técnico
-- por reparaciones — separados por persona, sin mezclar las cuentas.
--
-- Esta función devuelve las dos secciones:
--   • ventas   → ventas del POS de la vendedora (igual que pos_cierre_caja).
--   • servicio → lo COBRADO HOY por el técnico = adelantos de órdenes creadas hoy + saldos de
--     órdenes entregadas hoy (misma definición que el "Cierre del Día" del escritorio, sin doble
--     conteo). Incluye costo real y ganancia por orden (el dueño lo pidió con costo).
--   • total_dia = ventas + servicio.
--
-- SEGURIDAD: SECURITY DEFINER + validación por token de pos_sesiones (igual que las demás pos_*).
-- Solo devuelve datos de la empresa de la sesión. NOTA: ordenes.empresa_id es TEXT y
-- pos_sesiones/ventas_pos.empresa_id es BIGINT → se castea v_emp::text al consultar ordenes.

CREATE OR REPLACE FUNCTION public.pos_cierre_completo(p_token text, p_fecha date DEFAULT NULL)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_emp       bigint;
    v_fecha     date;
    v_desde     timestamptz;
    v_hasta     timestamptz;
    -- Ventas (vendedora)
    v_total     numeric; v_cant integer; v_efectivo numeric; v_otros numeric; v_detalle json;
    -- Servicio (técnico)
    s_adelantos numeric; s_saldos numeric; s_total numeric; s_cant integer;
    s_efectivo  numeric; s_otros numeric; s_detalle json;
BEGIN
    v_emp := (SELECT empresa_id FROM pos_sesiones WHERE token = p_token AND expira_en > now());
    IF v_emp IS NULL THEN
        RETURN json_build_object('ok', false, 'msg', 'Sesión inválida o expirada');
    END IF;

    v_fecha := coalesce(p_fecha, (now())::date);
    v_desde := v_fecha::timestamptz;
    v_hasta := (v_fecha + 1)::timestamptz;

    -- ===================== VENTAS (POS de la vendedora) =====================
    v_total := (SELECT coalesce(sum(total), 0) FROM ventas_pos
                 WHERE empresa_id = v_emp AND creado_en >= v_desde AND creado_en < v_hasta);
    v_cant  := (SELECT count(*) FROM ventas_pos
                 WHERE empresa_id = v_emp AND creado_en >= v_desde AND creado_en < v_hasta);
    v_efectivo := (SELECT coalesce(sum(total), 0) FROM ventas_pos
                    WHERE empresa_id = v_emp AND creado_en >= v_desde AND creado_en < v_hasta
                      AND medio_pago = 'efectivo');
    v_otros := v_total - v_efectivo;
    v_detalle := (SELECT coalesce(json_agg(x ORDER BY x.subtotal DESC), '[]'::json) FROM (
                    SELECT i.nombre, i.origen, sum(i.cantidad) AS cantidad, sum(i.subtotal) AS subtotal
                      FROM ventas_pos_items i JOIN ventas_pos v ON v.id = i.venta_id
                     WHERE v.empresa_id = v_emp AND v.creado_en >= v_desde AND v.creado_en < v_hasta
                     GROUP BY i.nombre, i.origen) x);

    -- ===================== SERVICIO TÉCNICO (cobrado hoy) =====================
    -- Adelantos de órdenes creadas hoy + saldos de órdenes entregadas hoy (sin doble conteo).
    s_adelantos := (SELECT coalesce(sum(adelanto), 0) FROM ordenes
                     WHERE empresa_id = v_emp::text AND created_at >= v_desde AND created_at < v_hasta);
    s_saldos    := (SELECT coalesce(sum(saldo), 0) FROM ordenes
                     WHERE empresa_id = v_emp::text AND estado = 'Entregado'
                       AND fecha_entregado >= v_desde AND fecha_entregado < v_hasta);
    s_total := s_adelantos + s_saldos;

    -- Detalle por orden que cobró algo hoy (con costo y ganancia).
    WITH serv AS (
        SELECT o.id, o.cliente, o.modelo, coalesce(o.metodo_pago, 'efectivo') AS metodo_pago,
               ( (CASE WHEN o.created_at >= v_desde AND o.created_at < v_hasta
                       THEN coalesce(o.adelanto, 0) ELSE 0 END)
               + (CASE WHEN o.estado = 'Entregado' AND o.fecha_entregado >= v_desde AND o.fecha_entregado < v_hasta
                       THEN coalesce(o.saldo, 0) ELSE 0 END) ) AS cobrado_hoy,
               coalesce(o.costo_repuesto_real, 0) AS costo,
               ( (coalesce(o.precio_repuesto, 0) - coalesce(o.costo_repuesto_real, 0)) + coalesce(o.precio_servicio, 0) ) AS ganancia
          FROM ordenes o
         WHERE o.empresa_id = v_emp::text
           AND ( (o.created_at >= v_desde AND o.created_at < v_hasta)
                 OR (o.estado = 'Entregado' AND o.fecha_entregado >= v_desde AND o.fecha_entregado < v_hasta) )
    )
    SELECT coalesce(json_agg(s ORDER BY s.cobrado_hoy DESC), '[]'::json),
           count(*)::int,
           coalesce(sum(s.cobrado_hoy) FILTER (WHERE s.metodo_pago = 'efectivo'), 0),
           coalesce(sum(s.cobrado_hoy) FILTER (WHERE s.metodo_pago <> 'efectivo'), 0)
      INTO s_detalle, s_cant, s_efectivo, s_otros
      FROM serv s
     WHERE s.cobrado_hoy > 0;

    RETURN json_build_object(
        'ok', true,
        'fecha', v_fecha,
        'ventas', json_build_object(
            'total', v_total, 'cantidad', v_cant,
            'efectivo', v_efectivo, 'otros', v_otros, 'detalle', v_detalle),
        'servicio', json_build_object(
            'total', s_total, 'cantidad', coalesce(s_cant, 0),
            'adelantos', s_adelantos, 'saldos', s_saldos,
            'efectivo', coalesce(s_efectivo, 0), 'otros', coalesce(s_otros, 0),
            'detalle', coalesce(s_detalle, '[]'::json)),
        'total_dia', v_total + s_total,
        'total_efectivo', v_efectivo + coalesce(s_efectivo, 0),
        'total_otros', v_otros + coalesce(s_otros, 0)
    );
END;
$$;

REVOKE ALL ON FUNCTION public.pos_cierre_completo(text, date) FROM public;
GRANT EXECUTE ON FUNCTION public.pos_cierre_completo(text, date) TO anon, authenticated;
