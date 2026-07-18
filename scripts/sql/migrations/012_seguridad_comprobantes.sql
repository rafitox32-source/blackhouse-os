-- Migración 012: seguridad de comprobantes
-- ✅ YA APLICADA en producción el 2026-07-18 (vía MCP) y probada.
--
-- 1) generar_boleta_movil ya NO es ejecutable con la llave anónima. Estaba
--    concedida a PUBLIC/anon/authenticated, y como la llave anónima es pública
--    (viaja en el HTML de la web), cualquiera podía crear boletas falsas en
--    cualquier empresa llamando directo al endpoint REST. Ahora queda igual que
--    registrar_venta_movil: solo postgres + service_role. La web NO se ve
--    afectada: su servidor (/api/db en Vercel) usa la llave maestra.
--    Probado: llamada REST con la llave anónima => 42501 permission denied.
--
-- 2) emitir_comprobante_escritorio: numeración de comprobantes del escritorio
--    con candado (pg_advisory_xact_lock). Antes main.js leía el último número y
--    luego insertaba (dos pasos sin candado): dos PCs emitiendo a la vez podían
--    chocar contra el índice único y una fallaba. La clave del candado usa el
--    mismo formato que generar_boleta_movil ('facturas_boleta_<empresa>'), así
--    una Boleta del escritorio y una del móvil tampoco chocan entre sí.
--    Lógica idéntica a la que tenía main.js: prefijo FFF/BBB/NOT según tipo,
--    siguiente = último + 1, documento 'S/N' por defecto.
--    Probado: con última Nota NOT-0006 en empresa 1 devolvió NOT-0007.

BEGIN;

REVOKE EXECUTE ON FUNCTION public.generar_boleta_movil(bigint, text, text, text, numeric, jsonb, text, text) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.emitir_comprobante_escritorio(
    p_empresa_id bigint,
    p_tipo text,
    p_monto_total numeric,
    p_orden_id bigint DEFAULT NULL,
    p_cliente_documento text DEFAULT NULL,
    p_cliente_nombre text DEFAULT NULL,
    p_vendedor text DEFAULT NULL
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
  v_ultimo text;
  v_siguiente integer;
  v_prefijo text;
  v_numero text;
BEGIN
  IF p_monto_total IS NULL OR p_monto_total <= 0 THEN
    RAISE EXCEPTION 'Monto invalido';
  END IF;
  IF p_tipo IS NULL OR btrim(p_tipo) = '' THEN
    RAISE EXCEPTION 'Tipo de comprobante invalido';
  END IF;

  PERFORM pg_advisory_xact_lock(hashtextextended('facturas_' || lower(p_tipo) || '_' || p_empresa_id::text, 0));

  v_ultimo := (SELECT f.numero_comprobante FROM facturas f
               WHERE f.empresa_id = p_empresa_id AND f.tipo = p_tipo
               ORDER BY f.id DESC LIMIT 1);

  v_siguiente := 1;
  IF v_ultimo IS NOT NULL THEN
    v_siguiente := COALESCE(NULLIF(split_part(v_ultimo, '-', 2), '')::integer, 0) + 1;
  END IF;

  v_prefijo := CASE p_tipo WHEN 'Factura' THEN 'FFF' WHEN 'Boleta' THEN 'BBB' ELSE 'NOT' END;
  v_numero := v_prefijo || '-' || lpad(v_siguiente::text, 4, '0');

  INSERT INTO facturas (empresa_id, orden_id, numero_comprobante, tipo, cliente_documento, cliente_nombre, vendedor_usuario, monto_total)
  VALUES (p_empresa_id, p_orden_id, v_numero, p_tipo,
          COALESCE(NULLIF(btrim(coalesce(p_cliente_documento, '')), ''), 'S/N'),
          NULLIF(btrim(coalesce(p_cliente_nombre, '')), ''),
          NULLIF(btrim(coalesce(p_vendedor, '')), ''),
          p_monto_total);

  RETURN v_numero;
END;
$function$;

-- Solo el escritorio (service_role) puede emitir. Nadie con la llave pública.
REVOKE EXECUTE ON FUNCTION public.emitir_comprobante_escritorio(bigint, text, numeric, bigint, text, text, text) FROM PUBLIC, anon, authenticated;

COMMIT;
