// Shim de ipcRenderer para el build de Android (Capacitor).
//
// En Electron esto NO hace nada: preload.js ya deja `window.ipcRenderer` listo antes
// de que corra cualquier script de la página, así que el guard de abajo corta acá.
// En Android no hay preload/proceso principal, así que se imita la misma firma
// (send/on/invoke) que espera el resto de index.html, pero hablando directo con
// Supabase (la app ya corre con la clave "anon" + RLS, sin service_role — la misma
// clave pública que ya viaja en el instalador de escritorio, ver CLAUDE.md §6).
//
// Fase 0 (ver plan de migración a Android): solo cubre 'iniciar-sesion' y
// 'obtener-clientes', para probar el patrón de punta a punta. El resto de los ~270
// canales se van agregando acá, uno por uno, reusando la misma lógica que ya tiene
// main.js (queda documentado con la línea de main.js de la que se copió cada uno).
(function () {
    if (typeof window.ipcRenderer !== 'undefined') return; // Electron: preload.js ya lo puso

    const SUPABASE_URL = 'https://flfhpffslhjcuvhxsnjz.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsZmhwZmZzbGhqY3V2aHhzbmp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4Mzg0MDMsImV4cCI6MjA4NDQxNDQwM30.9AxJDLzH2f5jJxAarw5dc1DMuvDlFY2sAr6zJBNUsFc';

    if (typeof window.supabase === 'undefined') {
        console.error('[capacitor-shim] @supabase/supabase-js no cargó todavía — revisá el <script> del CDN en el <head>.');
        return;
    }
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    // Equivalente a empresaActual/rolActual/usuarioActual de main.js: viven en memoria
    // del proceso principal allá, acá viven en memoria del WebView.
    let empresaActual = null, usuarioActual = null, rolActual = null;

    const listeners = {}; // canal -> [callback, ...]
    function emitir(canal, ...args) {
        (listeners[canal] || []).forEach(cb => {
            try { cb({}, ...args); } catch (e) { console.error(`[capacitor-shim] error en listener de "${canal}":`, e); }
        });
    }

    const correoDe = (usuario) => `${String(usuario || '').trim().toLowerCase()}@blackhouse.local`;

    // Copiado de main.js:702-763 ('iniciar-sesion'). No incluye todavía "recordarme"
    // (emitir_token_sesion) ni 2FA — eso se agrega en una fase posterior si hace falta
    // en Android; hoy ese chequeo en el renderer (res.requiere2FA) nunca se dispara
    // porque main.js tampoco lo envía.
    async function manejarIniciarSesion(data) {
        try {
            const { data: res, error } = await supabase.rpc('login_verificar', {
                p_usuario: data.usuario,
                p_password: data.password
            });

            if (error) {
                emitir('login-respuesta', {
                    success: false,
                    msg: `🌐 No se pudo conectar con el servidor. Verifica tu conexión a internet. (${error.message || error.code || 'error desconocido'})`
                });
                return;
            }
            if (!res || !res.ok) {
                emitir('login-respuesta', { success: false, msg: (res && res.msg) || 'No se pudo iniciar sesión' });
                return;
            }

            // Sesión de Supabase Auth: sin esto, RLS no sabe quién pregunta y las
            // consultas de abajo (obtener-clientes, etc.) vuelven vacías.
            const { error: authError } = await supabase.auth.signInWithPassword({
                email: correoDe(res.usuario), password: data.password
            });
            if (authError) console.warn('[capacitor-shim] No se pudo abrir sesión de Supabase Auth:', authError.message);

            empresaActual = res.empresa_id;
            rolActual = res.rol;
            usuarioActual = res.usuario;

            emitir('login-respuesta', {
                success: true,
                usuario: res.usuario,
                rol: res.rol,
                empresa_id: res.empresa_id,
                nombre_completo: res.nombre_completo || '',
                nickname: res.nickname || res.usuario,
                avatar: res.avatar || '',
                sessionToken: null
            });
        } catch (e) {
            console.error('[capacitor-shim] Error fatal en login:', e);
            emitir('login-respuesta', { success: false, msg: 'Error de conexión al servidor' });
        }
    }

    // Copiado de main.js:989-999 ('obtener-clientes').
    async function manejarObtenerClientes() {
        try {
            let query = supabase.from('clientes').select('*').eq('empresa_id', empresaActual);
            if (rolActual === 'tecnico') query = query.eq('tecnico_id', usuarioActual);
            const { data, error } = await query.order('id', { ascending: false });
            if (error) console.error('[capacitor-shim] Error obteniendo clientes:', error.message);
            emitir('lista-de-clientes', data || []);
        } catch (e) {
            console.error('[capacitor-shim] Error fatal obteniendo clientes:', e);
            emitir('lista-de-clientes', []);
        }
    }

    const CANALES_SEND = {
        'iniciar-sesion': manejarIniciarSesion,
        'obtener-clientes': manejarObtenerClientes,
    };

    window.ipcRenderer = {
        send(canal, payload) {
            const manejador = CANALES_SEND[canal];
            if (manejador) {
                manejador(payload);
            } else {
                console.warn(`[capacitor-shim] Canal "${canal}" todavía no está migrado a Android (Fase 0: solo login + obtener-clientes).`);
            }
        },
        on(canal, func) {
            (listeners[canal] = listeners[canal] || []).push(func);
        },
        invoke(canal) {
            console.warn(`[capacitor-shim] invoke("${canal}") todavía no está migrado a Android.`);
            return Promise.resolve(null);
        }
    };
})();
