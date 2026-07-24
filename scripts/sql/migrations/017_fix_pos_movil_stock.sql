-- Migración 017: arreglo crítico del POS móvil (catálogo + venta) y enlace con almacén
-- Motor: PostgreSQL (Supabase, proyecto flfhpffslhjcuvhxsnjz)
--
-- PROBLEMA ENCONTRADO EN LA AUDITORÍA COBROS ↔ ALMACÉN:
--   productos.empresa_id es TEXT, pero pos_sesiones.empresa_id es BIGINT. Las funciones
--   pos_productos y pos_registrar_venta comparaban `productos.empresa_id = v_emp` (text = bigint),
--   lo que lanza:  ERROR 42883: operator does not exist: text = bigint
--   Resultado: el POS de la vendedora NO podía cargar el catálogo ni vender productos de
--   inventario (por eso ventas_pos estaba en 0). Solo habría funcionado la venta "libre".
--
-- ARREGLOS:
--   1) pos_productos      → cast v_emp::text al consultar productos.
--   2) pos_registrar_venta → mismo cast + validación de stock ANTES de registrar nada
--      (dos pasadas: si un item no alcanza, se rechaza la venta completa y no queda venta
--      a medias), respetando stock NULL como "sin control de cantidad" (no descuenta),
--      igual que la venta rápida del escritorio. Además el movimiento de stock queda
--      etiquetado como 'VENTA POS MOVIL' para poder rastrear el origen.

CREATE OR REPLACE FUNCTION public.pos_productos(p_token text)
 RETURNS json LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE
    v_emp bigint;
BEGIN
    v_emp := (SELECT empresa_id FROM pos_sesiones WHERE token = p_token AND expira_en > now());
    IF v_emp IS NULL THEN
        RETURN json_build_object('ok', false, 'msg', 'Sesión inválida o expirada');
    END IF;

    RETURN json_build_object(
        'ok', true,
        'stock', coalesce((
            SELECT json_agg(json_build_object(
                       'id', p.id, 'nombre', p.nombre, 'precio', p.precio,
                       'stock', p.stock, 'categoria', p.categoria, 'sku', p.sku
                   ) ORDER BY p.nombre)
              FROM productos p
             WHERE p.empresa_id = v_emp::text
        ), '[]'::json),
        'libre', coalesce((
            SELECT json_agg(json_build_object(
                       'id', l.id, 'nombre', l.nombre, 'precio', l.precio,
                       'veces_vendido', l.veces_vendido
                   ) ORDER BY l.veces_vendido DESC, l.nombre)
              FROM productos_venta_libre l
             WHERE l.empresa_id = v_emp AND l.activo
        ), '[]'::json)
    );
END;
$function$;

CREATE OR REPLACE FUNCTION public.pos_registrar_venta(p_token text, p_items jsonb, p_medio_pago text DEFAULT 'efectivo'::text)
 RETURNS json LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE
    v_emp      bigint;
    v_uid      text;
    v_usuario  text;
    v_item     jsonb;
    v_venta_id bigint;
    v_total    numeric := 0;
    v_sub      numeric;
    v_origen   text;
    v_nombre   text;
    v_precio   numeric;
    v_cant     numeric;
    v_pid      bigint;
    v_libre_id bigint;
    v_stock    numeric;
    v_sku      text;
BEGIN
    v_emp     := (SELECT empresa_id FROM pos_sesiones WHERE token = p_token AND expira_en > now());
    v_uid     := (SELECT usuario_id FROM pos_sesiones WHERE token = p_token AND expira_en > now());
    v_usuario := (SELECT usuario    FROM pos_sesiones WHERE token = p_token AND expira_en > now());
    IF v_emp IS NULL THEN
        RETURN json_build_object('ok', false, 'msg', 'Sesión inválida o expirada');
    END IF;

    IF p_items IS NULL OR jsonb_typeof(p_items) <> 'array' OR jsonb_array_length(p_items) = 0 THEN
        RETURN json_build_object('ok', false, 'msg', 'La venta no tiene productos');
    END IF;

    -- PASO 1: validar TODO el carrito antes de registrar nada (evita ventas a medias).
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
        IF coalesce(v_item->>'origen','libre') = 'stock' THEN
            v_pid  := nullif(v_item->>'producto_id','')::bigint;
            v_cant := coalesce((v_item->>'cantidad')::numeric, 1);
            IF v_cant <= 0 THEN v_cant := 1; END IF;

            SELECT p.stock INTO v_stock FROM productos p
             WHERE p.id = v_pid AND p.empresa_id = v_emp::text;
            IF NOT FOUND THEN
                RETURN json_build_object('ok', false, 'msg', 'Producto no encontrado: ' || coalesce(v_item->>'nombre','?'));
            END IF;
            -- stock NULL = producto sin control de cantidad: se vende sin descontar.
            IF v_stock IS NOT NULL AND v_stock < v_cant THEN
                RETURN json_build_object('ok', false, 'msg', 'Stock insuficiente de ' || coalesce(v_item->>'nombre','?'));
            END IF;
        END IF;
    END LOOP;

    -- PASO 2: registrar la venta.
    INSERT INTO ventas_pos(empresa_id, vendedor_id, vendedor_usuario, medio_pago, total)
    VALUES (v_emp, v_uid, v_usuario, coalesce(nullif(trim(p_medio_pago), ''), 'efectivo'), 0)
    RETURNING id INTO v_venta_id;

    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
        v_origen := coalesce(v_item->>'origen', 'libre');
        v_nombre := trim(coalesce(v_item->>'nombre', ''));
        v_precio := coalesce((v_item->>'precio_unitario')::numeric, 0);
        v_cant   := coalesce((v_item->>'cantidad')::numeric, 1);
        IF v_cant <= 0 THEN v_cant := 1; END IF;
        IF v_nombre = '' THEN CONTINUE; END IF;

        v_sub   := round(v_precio * v_cant, 2);
        v_total := v_total + v_sub;

        IF v_origen = 'stock' THEN
            v_pid := nullif(v_item->>'producto_id', '')::bigint;

            SELECT p.stock, p.sku INTO v_stock, v_sku FROM productos p
             WHERE p.id = v_pid AND p.empresa_id = v_emp::text;

            IF v_stock IS NOT NULL THEN
                UPDATE productos SET stock = v_stock - v_cant
                 WHERE id = v_pid AND empresa_id = v_emp::text;

                BEGIN
                    IF v_sku IS NOT NULL AND v_sku <> '' THEN
                        INSERT INTO movimientos_stock(empresa_id, sku, cantidad, proveedor, nota)
                        VALUES (v_emp::text, v_sku, (-v_cant)::int, 'VENTA POS MOVIL', 'Venta POS #' || v_venta_id);
                    END IF;
                EXCEPTION WHEN others THEN NULL;
                END;
            END IF;

            INSERT INTO ventas_pos_items(venta_id, origen, producto_id, nombre, precio_unitario, cantidad, subtotal)
            VALUES (v_venta_id, 'stock', v_pid, v_nombre, v_precio, v_cant, v_sub);
        ELSE
            INSERT INTO productos_venta_libre(empresa_id, nombre, precio, veces_vendido)
            VALUES (v_emp, v_nombre, v_precio, 1)
            ON CONFLICT (empresa_id, lower(nombre))
            DO UPDATE SET precio = EXCLUDED.precio,
                          veces_vendido = productos_venta_libre.veces_vendido + 1,
                          activo = true, actualizado_en = now()
            RETURNING id INTO v_libre_id;

            INSERT INTO ventas_pos_items(venta_id, origen, producto_id, nombre, precio_unitario, cantidad, subtotal)
            VALUES (v_venta_id, 'libre', v_libre_id, v_nombre, v_precio, v_cant, v_sub);
        END IF;
    END LOOP;

    UPDATE ventas_pos SET total = v_total WHERE id = v_venta_id;

    RETURN json_build_object('ok', true, 'venta_id', v_venta_id, 'total', v_total);
END;
$function$;
