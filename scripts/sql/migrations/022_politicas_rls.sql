-- Migración 022: políticas RLS para que cada taller solo vea lo suyo
-- Motor: PostgreSQL (Supabase, proyecto flfhpffslhjcuvhxsnjz)
--
-- Segundo paso de sacar la service_role del instalador (ver 021).
--
-- ESTO TAMPOCO CAMBIA NADA EN MARCHA: la app sigue entrando con service_role, que se salta el
-- RLS por diseño, así que estas políticas quedan dormidas hasta que se cambie la clave. Ese
-- cambio es el último paso y es reversible.
--
-- Todas las políticas son TO authenticated a propósito: la política anon que ya existía en
-- ordenes (el QR público de seguimiento, con columnas limitadas por GRANT) no se toca.

-- 1) Las 24 tablas que llevan empresa_id: cada quien ve lo suyo ---------------------------
-- Se generan en bucle en vez de a mano para que no se escape ninguna y para resolver solo la
-- diferencia de tipo: empresa_id es bigint en unas tablas y text en otras.
DO $$
DECLARE t record; expr text;
BEGIN
    FOR t IN
        SELECT c.table_name, c.data_type
          FROM information_schema.columns c
          JOIN pg_tables pt ON pt.tablename = c.table_name AND pt.schemaname = 'public'
         WHERE c.table_schema = 'public'
           AND c.column_name = 'empresa_id'
           -- la librería del holograma se comparte entre talleres: va aparte, más abajo
           AND c.table_name <> 'piezas_fotos_modelos'
    LOOP
        expr := CASE WHEN t.data_type = 'text'
                     THEN 'empresa_id = public.mi_empresa()::text'
                     ELSE 'empresa_id = public.mi_empresa()' END;
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t.table_name);
        EXECUTE format('DROP POLICY IF EXISTS bh_empresa ON public.%I', t.table_name);
        EXECUTE format(
            'CREATE POLICY bh_empresa ON public.%I FOR ALL TO authenticated USING (%s) WITH CHECK (%s)',
            t.table_name, expr, expr);
    END LOOP;
END $$;

-- 2) La librería de fotos del holograma se comparte a propósito ---------------------------
-- Cualquier taller puede MIRAR las piezas fotografiadas por otro (esa es la gracia), pero solo
-- puede subir, corregir o borrar las suyas.
DROP POLICY IF EXISTS bh_fotos_leer   ON public.piezas_fotos_modelos;
DROP POLICY IF EXISTS bh_fotos_propias ON public.piezas_fotos_modelos;
CREATE POLICY bh_fotos_leer ON public.piezas_fotos_modelos
    FOR SELECT TO authenticated USING (true);
CREATE POLICY bh_fotos_propias ON public.piezas_fotos_modelos
    FOR ALL TO authenticated
    USING (empresa_id = public.mi_empresa()::text)
    WITH CHECK (empresa_id = public.mi_empresa()::text);

-- 3) Tablas sin empresa_id ----------------------------------------------------------------

-- La ficha del propio taller. La casa matriz ve todas porque emite licencias y distribuidores.
DROP POLICY IF EXISTS bh_empresas ON public.empresas;
CREATE POLICY bh_empresas ON public.empresas
    FOR ALL TO authenticated
    USING (id = public.mi_empresa() OR public.soy_matriz())
    WITH CHECK (id = public.mi_empresa() OR public.soy_matriz());

-- Licencias: solo la casa matriz. Es lo que impide que un taller se regale acceso eterno.
DROP POLICY IF EXISTS bh_licencias ON public.licencias;
CREATE POLICY bh_licencias ON public.licencias
    FOR ALL TO authenticated
    USING (public.soy_matriz()) WITH CHECK (public.soy_matriz());

-- Catálogo compartido de modelos: todos leen lo verificado y lo suyo pendiente; proponer puede
-- cualquiera; aprobar, corregir o borrar, solo la casa matriz.
DROP POLICY IF EXISTS bh_modelos_leer     ON public.modelos_dispositivos;
DROP POLICY IF EXISTS bh_modelos_proponer ON public.modelos_dispositivos;
DROP POLICY IF EXISTS bh_modelos_resolver ON public.modelos_dispositivos;
CREATE POLICY bh_modelos_leer ON public.modelos_dispositivos
    FOR SELECT TO authenticated
    USING (estado = 'verificado'
        OR creado_por = public.mi_empresa()::text
        OR public.soy_matriz());
CREATE POLICY bh_modelos_proponer ON public.modelos_dispositivos
    FOR INSERT TO authenticated
    WITH CHECK (creado_por = public.mi_empresa()::text OR public.soy_matriz());
CREATE POLICY bh_modelos_resolver ON public.modelos_dispositivos
    FOR UPDATE TO authenticated
    USING (public.soy_matriz()) WITH CHECK (public.soy_matriz());

-- Hijas: heredan el permiso de su madre, que sí sabe de qué empresa es.
DROP POLICY IF EXISTS bh_grupos_modelos ON public.grupos_compatibilidad_modelos;
CREATE POLICY bh_grupos_modelos ON public.grupos_compatibilidad_modelos
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.grupos_compatibilidad g
                    WHERE g.id = grupo_id AND g.empresa_id = public.mi_empresa()::text))
    WITH CHECK (EXISTS (SELECT 1 FROM public.grupos_compatibilidad g
                    WHERE g.id = grupo_id AND g.empresa_id = public.mi_empresa()::text));

DROP POLICY IF EXISTS bh_venta_items ON public.ventas_pos_items;
CREATE POLICY bh_venta_items ON public.ventas_pos_items
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.ventas_pos v
                    WHERE v.id = venta_id AND v.empresa_id = public.mi_empresa()))
    WITH CHECK (EXISTS (SELECT 1 FROM public.ventas_pos v
                    WHERE v.id = venta_id AND v.empresa_id = public.mi_empresa()));

-- 4) Tablas que ya nadie usa --------------------------------------------------------------
-- recibos y los dos respaldos de productos no aparecen en ninguna llamada del programa. Se
-- quedan sin política, o sea cerradas: si algún día hacen falta, se abre la que corresponda.
-- Es preferible que salte "no devuelve nada" a dejarlas accesibles por inercia.
ALTER TABLE public.recibos                         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.productos_empresa6_respaldo     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.productos_duplicados_archivados ENABLE ROW LEVEL SECURITY;
