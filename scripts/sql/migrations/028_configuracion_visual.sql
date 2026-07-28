-- Migración 028: configuración visual por empresa (marca blanca, Fase 3)
-- Motor: PostgreSQL (Supabase, proyecto flfhpffslhjcuvhxsnjz)
--
-- QUÉ RESUELVE
--   Hoy la apariencia de cada taller es una sola columna: empresas.tema, un texto que solo
--   puede valer 'original' | 'negro' | 'blanco' | 'doha' | 'premium'. O sea que un taller
--   puede elegir entre cinco trajes, pero no puede ponerle SUS colores.
--
--   Esta migración crea el lugar donde vive el tema de verdad: configuracion_visual.tema,
--   un jsonb con los valores de los tokens. A partir de aquí, la fuente única es esta tabla.
--
--   empresas.tema NO se borra: queda como respaldo de solo lectura hasta que Doha-cell corra
--   estable con el sistema nuevo. Si configuracion_visual no tiene fila, la app cae a
--   empresas.tema exactamente como hoy.
--
-- NADA DE ESTO CAMBIA LO QUE SE VE TODAVÍA. La tabla nace vacía; mientras no haya filas, la
-- app se comporta igual que antes. El editor llega en la Fase 5.
--
-- SEGURIDAD
--   Los valores del tema son datos que escribe el usuario y terminan aplicados como CSS. Se
--   validan aquí, en el servidor, además de en el programa: solo se aceptan nombres de token
--   conocidos y valores con forma de color. Todo lo que huela a inyección (url(, ;, }, <,
--   javascript:) se rechaza en el INSERT, no al pintarlo.


-- =====================================================================================
-- 1) Qué nombres de token existen
-- =====================================================================================
-- Lista cerrada. Si el editor manda un token que no está aquí, la fila se rechaza. Así un
-- taller no puede inventarse propiedades CSS ni meter basura en el jsonb.
CREATE OR REPLACE FUNCTION public.tokens_conocidos()
RETURNS text[] LANGUAGE sql IMMUTABLE AS $$
    SELECT ARRAY[
        -- marca y acento
        '--bh-purple', '--bh-purple-dark', '--bh-accent-2', '--bh-purple-glow',
        '--bh-accent-soft', '--bh-accent-softer', '--bh-on-accent',
        -- fondo y superficies.
        -- '--bh-bg' NO está en la lista a propósito: es un alias de --bh-surface que vive en
        -- el CSS. Si un tema lo pisara, el alias dejaría de seguir a su superficie y habría
        -- dos perillas para lo mismo.
        '--bh-bg-dark', '--bh-bg-gradient', '--bh-card-bg',
        '--bh-surface', '--bh-surface-2', '--bh-surface-3',
        '--bh-border', '--bh-border-strong', '--bh-input-bg', '--bh-scroll-thumb',
        -- escalera de texto
        '--text-main', '--text-soft', '--text-muted', '--text-dim', '--text-faint',
        '--text-invert',
        -- estados
        '--success', '--success-soft', '--danger', '--danger-soft',
        '--warning', '--warning-soft', '--info', '--info-soft',
        -- laboratorio 3D y mascota del chat
        '--bh-holo-ok', '--bh-holo-bad', '--bh-bot'
    ]::text[]
$$;

COMMENT ON FUNCTION public.tokens_conocidos() IS
'Lista cerrada de tokens de tema. Tiene que coincidir con el bloque :root de index.html.';


-- =====================================================================================
-- 2) Qué es un valor de color aceptable
-- =====================================================================================
-- El peligro real: estos valores terminan aplicados como CSS. Dos cosas hay que impedir.
--
--   a) url(...)  → haría que el programa salga a pedirle algo a un servidor ajeno cada vez
--      que se pinta la pantalla. Es exactamente la fuga que acabamos de cerrar sacando
--      ui-avatars.com. No se acepta, ni siquiera apuntando a nuestro propio Storage.
--
--   b) ; } { < >  → son los caracteres con los que se sale de una declaración CSS para
--      escribir otra cosa. El programa aplica los tokens con setProperty(), que ya los
--      rechaza, pero no se confía en una sola barrera.
CREATE OR REPLACE FUNCTION public.valor_css_valido(v text)
RETURNS boolean LANGUAGE plpgsql IMMUTABLE AS $$
DECLARE limpio text;
BEGIN
    IF v IS NULL THEN RETURN false; END IF;
    limpio := lower(btrim(v));

    -- Largo razonable: un degradado largo cabe de sobra en 200.
    IF length(limpio) = 0 OR length(limpio) > 200 THEN RETURN false; END IF;

    -- Lista negra explícita, antes que cualquier otra cosa.
    IF limpio ~ '(url\s*\(|;|\}|\{|<|>|\\|javascript:|expression|@import|/\*)' THEN
        RETURN false;
    END IF;

    RETURN
        -- #rgb  #rrggbb  #rrggbbaa
        limpio ~ '^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$'
        -- rgb() rgba() hsl() hsla() con solo números, comas, puntos, % y espacios
     OR limpio ~ '^(rgb|rgba|hsl|hsla)\(\s*[0-9.,%\s/-]+\)$'
        -- degradados: solo se permiten los que a su vez están hechos de lo de arriba
     OR limpio ~ '^(linear|radial)-gradient\([0-9a-z.,%\s#()/-]+\)$'
        -- palabras sueltas que sí tienen sentido para un color
     OR limpio IN ('transparent', 'currentcolor', 'inherit', 'none');
END $$;

COMMENT ON FUNCTION public.valor_css_valido(text) IS
'Un valor de token es aceptable si tiene forma de color y no trae nada con lo que salirse del CSS.';


-- =====================================================================================
-- 3) Qué es un tema aceptable
-- =====================================================================================
-- Forma esperada:
--   {
--     "preset": "doha",              -- de qué preset de fábrica salió (o "personalizado")
--     "tokens": { "--bh-purple": "#0284c7", ... },
--     "version": 1
--   }
CREATE OR REPLACE FUNCTION public.tema_valido(t jsonb)
RETURNS boolean LANGUAGE plpgsql IMMUTABLE AS $$
DECLARE clave text; valor jsonb; n int;
BEGIN
    IF t IS NULL OR jsonb_typeof(t) <> 'object' THEN RETURN false; END IF;

    -- 'tokens' es lo único obligatorio y tiene que ser un objeto.
    IF NOT t ? 'tokens' OR jsonb_typeof(t->'tokens') <> 'object' THEN RETURN false; END IF;

    -- Ni un tema vacío ni uno con más entradas que tokens existen.
    SELECT count(*) INTO n FROM jsonb_object_keys(t->'tokens');
    IF n = 0 OR n > array_length(public.tokens_conocidos(), 1) THEN RETURN false; END IF;

    FOR clave, valor IN SELECT * FROM jsonb_each(t->'tokens') LOOP
        IF NOT (clave = ANY (public.tokens_conocidos())) THEN RETURN false; END IF;
        IF jsonb_typeof(valor) <> 'string' THEN RETURN false; END IF;
        IF NOT public.valor_css_valido(valor #>> '{}') THEN RETURN false; END IF;
    END LOOP;

    -- 'preset', si viene, es un texto corto y sin rarezas (se muestra en pantalla).
    IF t ? 'preset' THEN
        IF jsonb_typeof(t->'preset') <> 'string' THEN RETURN false; END IF;
        IF NOT (t->>'preset') ~ '^[a-z0-9_-]{1,40}$' THEN RETURN false; END IF;
    END IF;

    RETURN true;
END $$;


-- =====================================================================================
-- 4) Los presets de fábrica
-- =====================================================================================
-- Los cinco temas que ya existían dejan de ser CSS suelto y pasan a ser datos. El editor
-- de la Fase 5 los lista, el taller elige uno y lo retoca. Se comparten entre todos los
-- talleres (son de la casa), por eso no llevan empresa_id.
CREATE TABLE IF NOT EXISTS public.temas_preset (
    clave        text PRIMARY KEY CHECK (clave ~ '^[a-z0-9_-]{1,40}$'),
    nombre       text NOT NULL,
    es_claro     boolean NOT NULL DEFAULT false,   -- decide la clase tema-claro
    orden        int NOT NULL DEFAULT 100,
    tema         jsonb NOT NULL CHECK (public.tema_valido(tema)),
    creado_en    timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.temas_preset IS
'Temas de fábrica. Son de la casa: todos los talleres los leen, nadie los edita desde el programa.';


-- =====================================================================================
-- 5) La configuración visual de cada taller
-- =====================================================================================
-- Una fila por empresa. La clave primaria ES el empresa_id: no hay forma de que un taller
-- termine con dos configuraciones peleándose.
CREATE TABLE IF NOT EXISTS public.configuracion_visual (
    empresa_id      bigint PRIMARY KEY REFERENCES public.empresas(id) ON DELETE CASCADE,
    tema            jsonb NOT NULL CHECK (public.tema_valido(tema)),
    preset_base     text REFERENCES public.temas_preset(clave) ON DELETE SET NULL,
    es_claro        boolean NOT NULL DEFAULT false,
    logo_url        text,      -- logo de marca en el bucket 'marca' (ver punto 7)
    actualizado_en  timestamptz NOT NULL DEFAULT now(),
    actualizado_por text
);

COMMENT ON TABLE public.configuracion_visual IS
'Fuente única de la apariencia de cada taller. Si no hay fila, la app usa empresas.tema (respaldo).';
COMMENT ON COLUMN public.configuracion_visual.tema IS
'Valores de los tokens. Validado por tema_valido(): solo tokens conocidos y valores con forma de color.';


-- =====================================================================================
-- 6) RLS
-- =====================================================================================
-- Regla de la casa: nada de USING (true) en tablas con datos de taller.

ALTER TABLE public.configuracion_visual ENABLE ROW LEVEL SECURITY;

-- Leer: cualquier usuario activo del taller ve la apariencia de SU taller. Tiene que ser
-- así porque el técnico y el vendedor también necesitan que la app se les pinte.
DROP POLICY IF EXISTS bh_conf_visual_leer ON public.configuracion_visual;
CREATE POLICY bh_conf_visual_leer ON public.configuracion_visual
    FOR SELECT TO authenticated
    USING (empresa_id = public.mi_empresa());

-- Escribir: solo el dueño. Un técnico no le cambia la marca al taller.
-- WITH CHECK repetido en INSERT y UPDATE: sin él, un dueño podría escribir una fila con el
-- empresa_id de otro taller.
DROP POLICY IF EXISTS bh_conf_visual_crear ON public.configuracion_visual;
CREATE POLICY bh_conf_visual_crear ON public.configuracion_visual
    FOR INSERT TO authenticated
    WITH CHECK (empresa_id = public.mi_empresa() AND public.mi_rol() = 'dueno');

DROP POLICY IF EXISTS bh_conf_visual_editar ON public.configuracion_visual;
CREATE POLICY bh_conf_visual_editar ON public.configuracion_visual
    FOR UPDATE TO authenticated
    USING (empresa_id = public.mi_empresa() AND public.mi_rol() = 'dueno')
    WITH CHECK (empresa_id = public.mi_empresa() AND public.mi_rol() = 'dueno');

DROP POLICY IF EXISTS bh_conf_visual_borrar ON public.configuracion_visual;
CREATE POLICY bh_conf_visual_borrar ON public.configuracion_visual
    FOR DELETE TO authenticated
    USING (empresa_id = public.mi_empresa() AND public.mi_rol() = 'dueno');

-- Los presets son de la casa: todos los leen, nadie los escribe desde el programa.
-- Se cambian con la clave de servicio, o sea desde aquí.
ALTER TABLE public.temas_preset ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS bh_presets_leer ON public.temas_preset;
CREATE POLICY bh_presets_leer ON public.temas_preset
    FOR SELECT TO authenticated USING (true);
-- (no se crea ninguna política de escritura: sin política, nadie escribe)

REVOKE INSERT, UPDATE, DELETE ON public.temas_preset FROM authenticated;

-- empresa_id no se toca nunca después de crear la fila: es la clave primaria y decide de
-- quién es la configuración. Que solo se pueda escribir en el INSERT.
REVOKE UPDATE ON public.configuracion_visual FROM authenticated;
GRANT  UPDATE (tema, preset_base, es_claro, logo_url, actualizado_en, actualizado_por)
    ON public.configuracion_visual TO authenticated;


-- =====================================================================================
-- 7) El bucket de los logos
-- =====================================================================================
-- Público para leer, porque el logo sale impreso en el ticket y en los PDF, y esos se abren
-- fuera del programa. Escribir es otra cosa: cada taller solo puede escribir dentro de su
-- propia carpeta, que se llama como su empresa_id.
--
--   marca/<empresa_id>/logo.png
--
-- Las subidas van por main.js vía IPC. El renderer nunca habla con Storage directamente.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('marca', 'marca', true, 2097152,
        ARRAY['image/png','image/jpeg','image/webp','image/svg+xml'])
ON CONFLICT (id) DO UPDATE
   SET file_size_limit   = EXCLUDED.file_size_limit,
       allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS bh_marca_leer   ON storage.objects;
DROP POLICY IF EXISTS bh_marca_subir  ON storage.objects;
DROP POLICY IF EXISTS bh_marca_editar ON storage.objects;
DROP POLICY IF EXISTS bh_marca_borrar ON storage.objects;

CREATE POLICY bh_marca_leer ON storage.objects
    FOR SELECT TO public
    USING (bucket_id = 'marca');

-- (storage.foldername(name))[1] es la primera carpeta de la ruta. Comparada contra el
-- empresa_id del que sube: así 'marca/6/logo.png' solo lo escribe la empresa 6.
CREATE POLICY bh_marca_subir ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'marca'
            AND (storage.foldername(name))[1] = public.mi_empresa()::text
            AND public.mi_rol() = 'dueno');

CREATE POLICY bh_marca_editar ON storage.objects
    FOR UPDATE TO authenticated
    USING      (bucket_id = 'marca'
            AND (storage.foldername(name))[1] = public.mi_empresa()::text
            AND public.mi_rol() = 'dueno')
    WITH CHECK (bucket_id = 'marca'
            AND (storage.foldername(name))[1] = public.mi_empresa()::text
            AND public.mi_rol() = 'dueno');

CREATE POLICY bh_marca_borrar ON storage.objects
    FOR DELETE TO authenticated
    USING (bucket_id = 'marca'
       AND (storage.foldername(name))[1] = public.mi_empresa()::text
       AND public.mi_rol() = 'dueno');


-- =====================================================================================
-- 8) Cómo lo lee y lo escribe el programa
-- =====================================================================================
-- Ninguna de las dos recibe el empresa_id como parámetro: lo saca de quién preguntó. Así el
-- programa no puede pedir ni pisar la configuración de otro taller aunque quisiera.

CREATE OR REPLACE FUNCTION public.tema_de_mi_empresa()
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
    SELECT jsonb_build_object(
        'origen',    CASE WHEN cv.empresa_id IS NOT NULL THEN 'configuracion_visual'
                          WHEN e.tema IS NOT NULL        THEN 'empresas.tema'
                          ELSE 'defecto' END,
        'tema',      cv.tema,
        'preset',    coalesce(cv.preset_base, e.tema, 'original'),
        'es_claro',  coalesce(cv.es_claro, false),
        'logo_url',  coalesce(cv.logo_url, e.logo_url)
    )
      FROM public.empresas e
      LEFT JOIN public.configuracion_visual cv ON cv.empresa_id = e.id
     WHERE e.id = public.mi_empresa()
$$;

COMMENT ON FUNCTION public.tema_de_mi_empresa() IS
'Devuelve la apariencia del taller del que pregunta. "origen" dice de dónde salió: la tabla nueva, el respaldo empresas.tema, o nada.';

-- Guardar. Devuelve un jsonb con ok/msg igual que el resto de RPCs del sistema, para que el
-- programa pueda mostrar el motivo exacto del rechazo en vez de un error de base de datos.
CREATE OR REPLACE FUNCTION public.guardar_tema_empresa(
    p_tema jsonb, p_preset text DEFAULT NULL, p_es_claro boolean DEFAULT false,
    p_logo_url text DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE emp bigint; quien text;
BEGIN
    SELECT empresa_id, usuario INTO emp, quien
      FROM usuarios WHERE auth_id = auth.uid() AND estado = 'activo' LIMIT 1;

    IF emp IS NULL THEN
        RETURN jsonb_build_object('ok', false, 'msg', 'Sesión no válida');
    END IF;
    IF public.mi_rol() <> 'dueno' THEN
        RETURN jsonb_build_object('ok', false, 'msg', 'Solo el dueño puede cambiar la apariencia');
    END IF;
    IF NOT public.tema_valido(p_tema) THEN
        RETURN jsonb_build_object('ok', false,
            'msg', 'El tema tiene valores que no se aceptan (revisa que sean colores)');
    END IF;
    IF p_preset IS NOT NULL AND NOT EXISTS (SELECT 1 FROM temas_preset WHERE clave = p_preset) THEN
        RETURN jsonb_build_object('ok', false, 'msg', 'Ese preset no existe');
    END IF;
    -- El logo tiene que estar en NUESTRO bucket y en la carpeta de ESTA empresa.
    IF p_logo_url IS NOT NULL AND p_logo_url <> ''
       AND p_logo_url !~ ('/storage/v1/object/public/marca/' || emp || '/') THEN
        RETURN jsonb_build_object('ok', false, 'msg', 'El logo debe estar subido desde el programa');
    END IF;

    INSERT INTO configuracion_visual AS cv
        (empresa_id, tema, preset_base, es_claro, logo_url, actualizado_por)
    VALUES (emp, p_tema, p_preset, coalesce(p_es_claro, false),
            nullif(p_logo_url, ''), quien)
    ON CONFLICT (empresa_id) DO UPDATE
       SET tema = EXCLUDED.tema,
           preset_base = EXCLUDED.preset_base,
           es_claro = EXCLUDED.es_claro,
           logo_url = EXCLUDED.logo_url,
           actualizado_en = now(),
           actualizado_por = EXCLUDED.actualizado_por;

    RETURN jsonb_build_object('ok', true, 'msg', 'Apariencia guardada');
END $$;

REVOKE ALL ON FUNCTION public.guardar_tema_empresa(jsonb, text, boolean, text) FROM public;
GRANT EXECUTE ON FUNCTION public.guardar_tema_empresa(jsonb, text, boolean, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.tema_de_mi_empresa() TO authenticated;
