/**
 * Prueba el inicio de sesión sin abrir el programa.
 *
 *   node scripts/probar-login.js frank Mundocell2026
 *
 * Hace exactamente los tres pasos que hace la app con la clave pública y dice cuál falla:
 *   1. login_verificar  -> ¿usuario, contraseña y licencia correctos?
 *   2. signInWithPassword -> ¿abre sesión de Supabase Auth? (lo que el RLS necesita)
 *   3. una consulta real -> ¿ve sus datos, y solo los suyos?
 */
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const [usuario, password] = process.argv.slice(2);
if (!usuario || !password) {
    console.error('Uso: node scripts/probar-login.js <usuario> <contraseña>');
    process.exit(1);
}

const URL = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_KEY;
if (!URL || !KEY) {
    console.error('✘ Falta SUPABASE_URL o SUPABASE_KEY en el .env');
    process.exit(1);
}

// La clave de servicio se salta el RLS: si es esa, la prueba no significa nada.
const payload = (() => {
    try { return JSON.parse(Buffer.from(KEY.split('.')[1], 'base64').toString()); }
    catch (e) { return {}; }
})();
console.log('Clave en uso:', payload.role || '(no es un JWT: puede ser publishable)');
if (payload.role === 'service_role') {
    console.log('⚠️  Es la clave de SERVICIO. Se salta el RLS, así que esta prueba no vale.');
    console.log('   Pon la clave pública (anon) en el .env para probar de verdad.\n');
}

const supabase = createClient(URL, KEY);

(async () => {
    // --- 1 ---------------------------------------------------------------
    const { data: res, error } = await supabase.rpc('login_verificar', {
        p_usuario: usuario, p_password: password
    });
    if (error) {
        console.error('✘ PASO 1 (login_verificar) falló:', error.message);
        console.error('   Si dice "function does not exist", falta aplicar la migración 021.');
        process.exit(1);
    }
    if (!res || !res.ok) {
        console.error('✘ PASO 1: el servidor rechazó el acceso ->', res && res.msg);
        process.exit(1);
    }
    console.log(`✔ PASO 1  usuario válido — empresa ${res.empresa_id}, rol ${res.rol}`);

    // --- 2 ---------------------------------------------------------------
    const email = `${usuario.trim().toLowerCase()}@blackhouse.local`;
    const { data: auth, error: e2 } = await supabase.auth.signInWithPassword({ email, password });
    if (e2) {
        console.error(`✘ PASO 2 (sesión de Auth para ${email}) falló:`, e2.message);
        console.error('   Sin esta sesión el programa entra pero no ve ningún dato.');
        process.exit(1);
    }
    console.log('✔ PASO 2  sesión de Supabase Auth abierta');

    // --- 3 ---------------------------------------------------------------
    const [prod, ord, aj, lic] = await Promise.all([
        supabase.from('productos').select('id', { count: 'exact', head: true }),
        supabase.from('ordenes').select('id', { count: 'exact', head: true }),
        supabase.from('productos').select('id', { count: 'exact', head: true })
                .neq('empresa_id', String(res.empresa_id)),
        supabase.from('licencias').select('id', { count: 'exact', head: true })
    ]);
    console.log(`✔ PASO 3  ve ${prod.count} productos y ${ord.count} órdenes`);
    console.log(`          de otras empresas: ${aj.count}  (debe ser 0)`);
    console.log(`          licencias: ${lic.count}  (debe ser 0 salvo la empresa 1)`);

    if (prod.count === 0 && ord.count === 0) {
        console.log('\n⚠️  No ve nada. Suele ser que falta la política de esa tabla,');
        console.log('   o que el usuario no está vinculado (usuarios.auth_id en NULL).');
    } else if (aj.count > 0) {
        console.log('\n⚠️  Está viendo datos de otra empresa: revisar las políticas.');
    } else {
        console.log('\n✅ Todo correcto. El programa puede usar la clave pública.');
    }
    await supabase.auth.signOut();
})();
