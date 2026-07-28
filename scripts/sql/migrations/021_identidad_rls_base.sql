-- Migración 021: cimientos para sacar la service_role del instalador
-- Motor: PostgreSQL (Supabase, proyecto flfhpffslhjcuvhxsnjz)
--
-- PROBLEMA:
--   El instalador de escritorio lleva el .env adentro con la clave service_role, que se salta
--   el RLS. Quien desempaqueta el .exe puede leer y escribir los datos de TODOS los talleres,
--   regalarse licencias y correr vencimientos. Ninguna protección anticopia sirve mientras eso
--   siga así.
--
-- HACIA DÓNDE VAMOS:
--   Que la app use la clave pública (anon), que es segura de repartir, y que sea Postgres el
--   que recorte cada consulta a la empresa del que la hace. Así las 129 llamadas directas que
--   ya existen en main.js no se reescriben: el RLS las filtra solo.
--
-- ESTA MIGRACIÓN NO CAMBIA NADA EN MARCHA:
--   Solo agrega la columna de enlace y las funciones que dicen "quién soy". Mientras la app
--   siga entrando con service_role, todo esto queda dormido. Las políticas van aparte y el
--   cambio de clave es el último paso, y es reversible.

-- 1) Enlace entre el usuario del programa y el de Supabase Auth --------------------------
-- Se llena solo la primera vez que cada quien entra; nadie pierde el acceso mientras tanto.
ALTER TABLE public.usuarios
    ADD COLUMN IF NOT EXISTS auth_id uuid;

CREATE UNIQUE INDEX IF NOT EXISTS idx_usuarios_auth_id
    ON public.usuarios (auth_id) WHERE auth_id IS NOT NULL;

COMMENT ON COLUMN public.usuarios.auth_id IS
    'Usuario correspondiente en auth.users. Lo usan mi_empresa() y mi_rol() para recortar el RLS.';

-- 2) Quién soy ----------------------------------------------------------------------------
-- SECURITY DEFINER a propósito: usuarios también va a tener RLS, y si estas funciones lo
-- respetaran no podrían leer la fila del que pregunta y todo devolvería vacío.
-- STABLE para que el planificador las resuelva una vez por consulta y no una vez por fila.

CREATE OR REPLACE FUNCTION public.mi_empresa()
RETURNS bigint LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
    SELECT empresa_id FROM usuarios
     WHERE auth_id = auth.uid() AND estado = 'activo'
     LIMIT 1
$$;

CREATE OR REPLACE FUNCTION public.mi_rol()
RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
    SELECT rol FROM usuarios
     WHERE auth_id = auth.uid() AND estado = 'activo'
     LIMIT 1
$$;

-- La casa matriz (empresa 1) es la que emite licencias y revisa el catálogo compartido.
-- Mismo criterio que ya usaban el generador de licencias y los distribuidores.
CREATE OR REPLACE FUNCTION public.soy_matriz()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$ SELECT coalesce(public.mi_empresa() = 1, false) $$;

-- 3) Login sin clave privilegiada ---------------------------------------------------------
-- La comprobación de usuario y contraseña tiene que poder hacerse ANTES de tener sesión, y
-- hoy se hace leyendo la tabla usuarios con service_role. Esta función hace lo mismo desde
-- adentro de la base, así la app puede validar con la clave pública.
--
-- Devuelve lo mínimo para decidir: si entra, de qué empresa es y con qué rol. Nunca devuelve
-- el hash de la contraseña.
CREATE OR REPLACE FUNCTION public.login_verificar(p_usuario text, p_password text)
RETURNS json LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public', 'extensions'
AS $$
DECLARE
    u        usuarios%ROWTYPE;
    v_vence  date;
BEGIN
    SELECT * INTO u FROM usuarios
     WHERE usuario = p_usuario AND estado = 'activo'
     LIMIT 1;

    IF NOT FOUND THEN
        RETURN json_build_object('ok', false, 'msg', 'Usuario no encontrado o inactivo');
    END IF;

    -- Igual que el login actual: acepta el hash bcrypt y también la contraseña en texto plano
    -- de las cuentas viejas que todavía no se han rehasheado.
    IF NOT (u.password = p_password OR u.password = crypt(p_password, u.password)) THEN
        RETURN json_build_object('ok', false, 'msg', 'Contraseña incorrecta');
    END IF;

    -- La licencia se revisa acá, del lado del servidor, donde el cliente no la puede saltar.
    SELECT fecha_de_vencimiento INTO v_vence FROM empresas WHERE id = u.empresa_id;
    IF u.empresa_id <> 1 AND v_vence IS NOT NULL AND v_vence < current_date THEN
        RETURN json_build_object('ok', false, 'vencida', true,
            'msg', '⛔ Licencia Vencida. Tu acceso caducó el ' || v_vence || '. Escríbenos al WhatsApp para renovar.');
    END IF;

    RETURN json_build_object(
        'ok', true,
        'id', u.id, 'usuario', u.usuario, 'rol', u.rol,
        'empresa_id', u.empresa_id, 'auth_id', u.auth_id,
        'nombre_completo', u.nombre_completo
    );
END;
$$;

-- Vincula al usuario del programa con el de Supabase Auth. La app la llama una sola vez, justo
-- después de crear su cuenta en Auth, y solo puede vincularse a sí misma: hay que probar usuario
-- y contraseña otra vez.
CREATE OR REPLACE FUNCTION public.login_vincular_auth(p_usuario text, p_password text, p_auth_id uuid)
RETURNS json LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public', 'extensions'
AS $$
DECLARE u usuarios%ROWTYPE;
BEGIN
    SELECT * INTO u FROM usuarios WHERE usuario = p_usuario AND estado = 'activo' LIMIT 1;
    IF NOT FOUND THEN RETURN json_build_object('ok', false, 'msg', 'Usuario no encontrado'); END IF;
    IF NOT (u.password = p_password OR u.password = crypt(p_password, u.password)) THEN
        RETURN json_build_object('ok', false, 'msg', 'Contraseña incorrecta');
    END IF;
    IF u.auth_id IS NOT NULL AND u.auth_id <> p_auth_id THEN
        RETURN json_build_object('ok', false, 'msg', 'Ese usuario ya está vinculado a otra cuenta');
    END IF;

    UPDATE usuarios SET auth_id = p_auth_id WHERE id = u.id;
    RETURN json_build_object('ok', true);
END;
$$;

REVOKE ALL ON FUNCTION public.login_verificar(text, text)              FROM public;
REVOKE ALL ON FUNCTION public.login_vincular_auth(text, text, uuid)    FROM public;
GRANT EXECUTE ON FUNCTION public.login_verificar(text, text)           TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.login_vincular_auth(text, text, uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.mi_empresa()  TO authenticated;
GRANT EXECUTE ON FUNCTION public.mi_rol()      TO authenticated;
GRANT EXECUTE ON FUNCTION public.soy_matriz()  TO authenticated;
