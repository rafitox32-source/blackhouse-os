
        const isElectron = typeof window !== 'undefined' && window.process?.type === 'renderer';

        let chartInstance = null;
        let codigoActualParaCopiar = ""; // NUEVO: Variable para guardar el código generado

        // Variables globales para el selector de modelos e inventario categorizado
        let marcasModelosCache = {};
        let marcasSeleccionadas = [];
        let marcaActiva = '';
        let modelSelectorTargetId = ''; // Almacena qué input recibirá el modelo seleccionado
        let todosLosProductos = []; // Almacena la lista de productos cargados
        let categoriaInventarioActiva = 'Todos'; // Categoría activa de las pestañas

        function showToast(msg, type = 'success') {
            const container = document.getElementById('toast-container');
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            let icon = type === 'success' ? '✅' : (type === 'danger' ? '🚫' : '⚠️');
            toast.innerHTML = `<div style="font-weight:bold; font-size:16px; margin-right:12px;">${icon}</div><div style="font-size:13px; flex:1;">${msg}</div>`;
            container.appendChild(toast);
            setTimeout(() => { toast.style.animation = 'fadeOut 0.5s forwards'; setTimeout(() => toast.remove(), 500); }, 4000);
        }

 async function iniciarSesion() {
    const u = document.getElementById('user-login').value.trim();
    const p = document.getElementById('pass-login').value.trim();

    if(!u || !p) {
        document.getElementById('login-error').innerText = "Ingresa usuario y contraseña.";
        return;
    }

    const btnMain = document.querySelector('button[onclick="iniciarSesion()"]');
    if (btnMain) {
        btnMain.disabled = true;
        btnMain.innerText = "Iniciando sesión...";
        btnMain.style.opacity = "0.7";
    }
    document.getElementById('login-error').innerText = "";

    // 1. LOGIN PRINCIPAL (Tabla usuarios local/Electron)
    // Esto disparará tu ipcRenderer.on('login-respuesta') devolviéndote tus privilegios.
    // NOTA: Si en tu main.js el evento de escucha se llama diferente (ej: 'iniciar-sesion-sql'), cámbialo por 'login'.
ipcRenderer.send('iniciar-sesion', { usuario: u, password: p });

    // 2. LOGIN SECUNDARIO (Chat en vivo de Supabase)
    let emailParaChat = u;
    if (u.toLowerCase() === 'admin') {
        emailParaChat = 'rafitox32@gmail.com'; 
    }
    
    // Lo ejecutamos en segundo plano para que no bloquee tu acceso si falla
    if (supabaseChat) {
        supabaseChat.auth.signInWithPassword({
            email: emailParaChat,
            password: p
        }).catch(err => console.log("Advertencia del chat:", err));
    }
}

    ipcRenderer.on('login-respuesta', (e, res) => {
        const btnMain = document.querySelector('button[onclick="iniciarSesion()"]');
        if (btnMain) {
            btnMain.disabled = false;
            btnMain.innerText = "Ingresar al Sistema";
            btnMain.style.opacity = "1";
        }
        
        if(res.success) {
            if(res.requiere2FA) {
                // Guardamos temporalmente el usuario para poder validar el 2FA después
                localStorage.setItem('usuarioLoginTemp', res.usuario);
                toggleMFAView(true);
                showToast("Código de seguridad 2FA requerido", "info");
            }
        } else {
            document.getElementById('login-error').innerText = res.msg;
            showToast(res.msg, 'danger');
        }
    });

    ipcRenderer.on('resultado-2fa', (e, res) => {
        const btnVerificar = document.querySelector('button[onclick="verificarCodigo2FA()"]');
        if (btnVerificar) {
            btnVerificar.disabled = false;
            btnVerificar.innerText = "Verificar Código e Ingresar";
            btnVerificar.style.opacity = "1";
        }
        
        if(res.success) {
            // 1. Guardamos todo en localStorage para tener los datos listos
            localStorage.setItem('usuarioLogin', res.usuario); 
            localStorage.setItem('userNickname', res.nickname);
            localStorage.setItem('miEmpresaId', res.empresa_id); 
            localStorage.setItem('userRol', res.rol);
            if(res.avatar) localStorage.setItem('userAvatar', res.avatar);

            // 2. Rellenamos datos de perfil
            document.getElementById('perfil-nombre').value = res.nombre_completo || '';
            document.getElementById('perfil-nickname').value = res.nickname || res.usuario;

            if(res.avatar) {
                document.getElementById('preview-avatar').src = res.avatar;
                document.getElementById('preview-avatar').style.display = 'block';
                document.getElementById('avatar-placeholder').style.display = 'none';
                avatarBase64 = res.avatar;
            }

            showToast("🛡️ Verificación exitosa. Accediendo...", "success");
            
            // Ocultamos el login y mostramos la App
            document.getElementById('login-screen').style.display = 'none';
            document.getElementById('app-content').style.display = 'flex';
            
            // Ejecutamos todo tu código original de arranque
            aplicarPermisos(res.rol, res.usuario, res.avatar);
            aplicarPersonalizacion();
            showView('dashboard', document.getElementById('nav-dash'));
            iniciarChatEnVivo();

            // Lógica del Tutorial que tenías
            const claveTutorial = `tutorial_visto_${res.usuario}`;
            if (!localStorage.getItem(claveTutorial)) {
                setTimeout(() => {
                    iniciarTutorial(res.rol);
                    localStorage.setItem(claveTutorial, 'true');
                }, 1000);
            }

            toggleMFAView(false); // Ocultar vista OTP
        } else {
            showToast(res.msg, "danger");
            const inputs = document.querySelectorAll('.otp-box');
            inputs.forEach(input => input.value = '');
            inputs[0].focus();
        }
    });

        function guardarPersonalizacion() {
            const nombre = document.getElementById('conf-app-name').value;
            const logo = document.getElementById('conf-app-logo').value;
            localStorage.setItem('appName', nombre);
            localStorage.setItem('appLogo', logo);
            showToast("Configuración guardada", "success");
            aplicarPersonalizacion();
        }

        function aplicarPersonalizacion() {
            const nombre = localStorage.getItem('appName') || 'BlackHouse';
            const logo = localStorage.getItem('appLogo');
            const tituloHtml = `${nombre}<span style="color:var(--bh-purple)">OS</span>`;
            document.getElementById('app-title-login').innerHTML = tituloHtml;
            document.getElementById('app-title-sidebar').innerHTML = tituloHtml;
            if(logo) { document.getElementById('watermark-bg').style.backgroundImage = `url('${logo}')`; }
        }

        function aplicarPermisos(rol, usuario) {
            document.getElementById('user-display-name').innerText = usuario;
            document.getElementById('user-role-display').innerText = rol.toUpperCase();
            document.getElementById('welcome-msg').innerText = `Sesión iniciada como: ${usuario}`;
            
            // NUEVO: Avatar Global
            const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(usuario)}&background=7c3aed&color=fff&bold=true`;
            localStorage.setItem('userAvatar', avatarUrl);
            const avatarContainer = document.getElementById('top-bar-avatar');
            if(avatarContainer) {
                avatarContainer.innerHTML = `<img src="${avatarUrl}" style="width:100%; height:100%; object-fit:cover;">`;
            }

            const items = ['nav-dash', 'nav-recep', 'nav-taller', 'nav-clientes', 'nav-inv', 'nav-proveedores', 'nav-report', 'nav-config','nav-facturas'];
            items.forEach(i => { if(document.getElementById(i)) document.getElementById(i).style.display = 'none'; });

            const btnMenuTop = document.getElementById('menu-config-btn');
            if (btnMenuTop) btnMenuTop.style.display = 'none';

            // 1. ASIGNACIÓN DE PERMISOS BASE
            if(rol === 'dueno') {
                items.forEach(i => { if(document.getElementById(i)) document.getElementById(i).style.display = 'flex'; });
                if(document.getElementById('btn-add-prod')) document.getElementById('btn-add-prod').style.display = 'inline-block';
                if(btnMenuTop) btnMenuTop.style.display = 'block'; 

            } else if(rol === 'vendedor') {
                ['nav-dash', 'nav-clientes', 'nav-inv'].forEach(i => { if(document.getElementById(i)) document.getElementById(i).style.display = 'flex'; });
                if(document.getElementById('btn-add-prod')) document.getElementById('btn-add-prod').style.display = 'none'; 
            } else if(rol === 'tecnico') {
                ['nav-dash', 'nav-recep', 'nav-taller'].forEach(i => { if(document.getElementById(i)) document.getElementById(i).style.display = 'flex'; });
            }

            // 🚨 2. REGLA ESTRICTA PARA EL GENERADOR DE LICENCIAS Y DISTRIBUIDORES 🚨
            const panelAdmin = document.getElementById('panel-super-admin');
            const tabResellers = document.getElementById('config-item-resellers');
            if (panelAdmin) {
                panelAdmin.style.display = 'none';
                if (tabResellers) tabResellers.style.display = 'none';
                const miEmpresa = localStorage.getItem('miEmpresaId');
                const usuarioActual = localStorage.getItem('usuarioLogin');
                if (miEmpresa === '1' || usuarioActual === 'admin' || usuarioActual === 'reimi') {
                    panelAdmin.style.display = 'block';
                    if (tabResellers) tabResellers.style.display = 'block';
                }
            }
        }

      function showView(id, el) {
            document.querySelectorAll('.view').forEach(v => { v.classList.remove('active'); v.style.display = 'none'; });
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            if (id === 'clientes-view') ipcRenderer.send('obtener-clientes');
            const target = document.getElementById(id);
            if(target) { target.style.display = 'block'; setTimeout(() => target.classList.add('active'), 10); }
            if(el) el.classList.add('active');

            if(id === 'crm') ipcRenderer.send('analisis-crm');
            if(id === 'taller') ipcRenderer.send('obtener-ordenes');
            if(id === 'inventario') ipcRenderer.send('obtener-productos');
            if(id === 'reportes') ipcRenderer.send('obtener-datos-reporte', 'hoy');
            
            // 1. Aquí pedimos las facturas
            if(id === 'facturas-view') ipcRenderer.send('obtener-facturas'); 
            
            if(id === 'proveedores-view') cargarProveedores();
            
            // 2. Aquí mantenemos tu Configuración intacta con sus propias llaves
            if(id === 'config') { 
                ipcRenderer.send('obtener-usuarios');
                 cargarEstadoPlan();
                const empresaId = localStorage.getItem('miEmpresaId');
           if(empresaId) {
    ipcRenderer.send('pedir-datos-empresa', { id: empresaId });
}
                document.getElementById('conf-app-name').value = localStorage.getItem('appName') || '';
            }
        }

        // 3. ESTO VA AFUERA (Independiente)
        ipcRenderer.on('lista-de-facturas', (e, rows) => {
            const tbody = document.getElementById('tabla-facturas');
            if(!tbody) return;
            
            if(!rows || rows.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:20px;">No hay facturas emitidas en este taller.</td></tr>';
            } else {
                tbody.innerHTML = rows.map(f => {
                    const fecha = new Date(f.created_at).toLocaleDateString();
                    return `
                    <tr>
                        <td>${fecha}</td>
                        <td style="color:var(--info); font-weight:bold;">${f.numero_comprobante} <span style="font-size:10px; color:#aaa; font-weight:normal;">(${f.tipo})</span></td>
                        <td>${f.cliente_documento}</td>
                        <td>#${String(f.orden_id).padStart(4,'0')}</td>
                        <td style="color:var(--success); font-weight:bold; text-align: right;">S/ ${parseFloat(f.monto_total).toFixed(2)}</td>
                    </tr>`;
                }).join('');
            }
        });
// Recibir y mostrar los datos de la empresa en Ajustes
ipcRenderer.on('datos-empresa-respuesta', (e, data) => {
    if (!data) return;
    const campos = {
        'conf-empresa-nombre': data.nombre,
        'conf-empresa-dir': data.direccion,
        'conf-empresa-tel': data.telefono
    };
    Object.entries(campos).forEach(([id, valor]) => {
        const el = document.getElementById(id);
        if (el) el.value = valor || '';
    });
});

        // Función unificada para el menú de Ajustes
        function showConfigSection(id, element) {
            document.querySelectorAll('.config-section').forEach(s => s.classList.remove('active'));
            document.querySelectorAll('.config-item').forEach(i => i.classList.remove('active'));
            document.getElementById(id).classList.add('active');
            element.classList.add('active');
        }

        function calcularTotal() {
            const part = parseFloat(document.getElementById('cost-part').value) || 0;
            const serv = parseFloat(document.getElementById('cost-service').value) || 0;
            const total = part + serv;
            const advance = parseFloat(document.getElementById('pay-advance').value) || 0;
            const balance = total - advance;
            document.getElementById('cost-total').value = total.toFixed(2);
            document.getElementById('pay-balance').value = balance.toFixed(2);
        }

        let ordenTemporal = null;

        function guardarOrden() {
            const nombre = document.getElementById('cli').value;
            const modelo = document.getElementById('mod').value;
            if(!nombre || !modelo) return showToast("Falta Cliente o Modelo", "warning");
            if(!document.getElementById('check-terms').checked) return showToast("Acepte términos", "warning");

            const firmaData = document.getElementById('signature-pad').toDataURL('image/png');
            const fotoPreview = document.getElementById('photo-preview');
            const evidenciaData = (fotoPreview && fotoPreview.style.display === 'block') ? fotoPreview.src : null;

            ordenTemporal = {
                cliente: nombre, telefono: document.getElementById('tel').value,
                modelo: modelo, imei: document.getElementById('imei').value,
                falla: document.getElementById('fal').value,
                precio_repuesto: document.getElementById('cost-part').value || '0',
                precio_servicio: document.getElementById('cost-service').value || '0',
                costo: document.getElementById('cost-total').value || '0', 
                adelanto: document.getElementById('pay-advance').value || '0',
                saldo: document.getElementById('pay-balance').value || '0',
                metodo_pago: document.getElementById('pay-method').value,
                firma: firmaData, evidencia: evidenciaData, estado: 'Recibido'
            };
            document.getElementById('modal-confirm-custom').style.display = 'flex';
        }

        function procesarDecision(registrarCliente) {
            document.getElementById('modal-confirm-custom').style.display = 'none';
            if (registrarCliente) {
                showView('clientes-view', document.getElementById('nav-clientes'));
                document.getElementById('modal-cliente').style.display = 'flex';
                document.getElementById('new-cli-nombre').value = ordenTemporal.cliente;
                document.getElementById('new-cli-tel').value = ordenTemporal.telefono;
                ipcRenderer.send('guardar-orden', ordenTemporal);
            } else {
                ipcRenderer.send('guardar-orden', ordenTemporal);
                document.getElementById('cli').value = ''; document.getElementById('tel').value = '';
                document.getElementById('mod').value = ''; document.getElementById('imei').value = '';
                document.getElementById('fal').value = ''; document.getElementById('cost-part').value = '';
                document.getElementById('cost-service').value = ''; document.getElementById('cost-total').value = '0.00';
                document.getElementById('pay-advance').value = ''; document.getElementById('pay-balance').value = '0.00';
                limpiarFirma();
                if(typeof retomarFoto === 'function') retomarFoto(); 
            }
        }

        function guardarProducto() {
            const data = {
                nombre: document.getElementById('reg-nombre').value,
                categoria: document.getElementById('reg-categoria').value,
                costo: document.getElementById('reg-costo').value,
                precio: document.getElementById('reg-precio').value,
                stock: document.getElementById('reg-stock').value,
                proveedor: document.getElementById('reg-proveedor').value
            };
            ipcRenderer.send('nuevo-producto-sql', data);
        }

        function crearUsuario() {
            const data = {
                usuario: document.getElementById('new-user-name').value,
                password: document.getElementById('new-user-pass').value,
                rol: document.getElementById('new-user-role').value
            };
            if(!data.usuario || !data.password) return showToast("Completa campos", "warning");
            ipcRenderer.send('crear-usuario-nuevo', data);
        }

        function guardarCliente() {
            const datosCliente = {
                nombre: document.getElementById('new-cli-nombre').value,
                telefono: document.getElementById('new-cli-tel').value,
                email: document.getElementById('new-cli-email').value,
                direccion: document.getElementById('new-cli-dir').value
            };
            if(!datosCliente.nombre || !datosCliente.telefono) return showToast("Faltan datos", "warning");
            ipcRenderer.send('guardar-cliente', datosCliente);
        }

        ipcRenderer.on('resultado-cliente', (e, res) => {
            if(res.success) {
                showToast(res.msg, 'success');
                document.getElementById('modal-cliente').style.display = 'none';
                ipcRenderer.send('obtener-clientes');
            } else { showToast(res.msg, 'danger'); }
        });

        ipcRenderer.on('resultado-guardado', (e, datos) => { 
            showToast('Orden creada exitosamente', 'success'); 
            document.querySelectorAll('#recepcion input, #recepcion textarea').forEach(i=>i.value=''); 
            limpiarFirma(); document.getElementById('photo-preview').style.display = 'none';

            if(ordenTemporal) {
                document.getElementById('rec-fecha').innerText = new Date().toLocaleString();
                document.getElementById('rec-cliente').innerText = ordenTemporal.cliente;
                document.getElementById('rec-tel').innerText = ordenTemporal.telefono;
                document.getElementById('rec-modelo').innerText = ordenTemporal.modelo;
                document.getElementById('rec-imei').innerText = ordenTemporal.imei;
                document.getElementById('rec-falla').innerText = ordenTemporal.falla;
                
                document.getElementById('rec-costo').innerHTML = `
                    <div style="font-size:10px; color:#aaa; font-weight:normal; text-align:right;">
                        Total: S/${ordenTemporal.costo} <br> 
                        <span style="color:#d8b4fe;">A Cuenta: - S/${ordenTemporal.adelanto}</span>
                    </div>
                    <div style="font-size:18px; color:#10b981; font-weight:bold;">Saldo: S/ ${ordenTemporal.saldo}</div>
                `;
                document.getElementById('rec-firma-img').src = ordenTemporal.firma;

               const appName = localStorage.getItem('appName') || 'BlackHouse OS';
const recEmpresa = document.getElementById('rec-empresa-name');
if(recEmpresa) recEmpresa.innerText = appName;
               
                html2canvas(document.getElementById('receipt-content'), { backgroundColor: "#111", scale: 2 }).then(canvas => {
                    canvas.toBlob(blob => {
                        try {
                            const item = new ClipboardItem({ "image/png": blob });
                            navigator.clipboard.write([item]);
                            showToast('Ticket copiado al portapapeles 📋', 'success');
                            setTimeout(() => {
                                const trackingLink = `https://blackhouse.app/track/${Date.now()}`;
                                const mensaje = `Hola ${ordenTemporal.cliente}, recibimos su equipo. \n💳 Saldo: S/${ordenTemporal.saldo}\n🔍 Ver estado: ${trackingLink}`;
                                const url = `https://wa.me/51${ordenTemporal.telefono}?text=${encodeURIComponent(mensaje)}`;
                                if(isElectron) require('electron').shell.openExternal(url);
                                else window.open(url, '_blank');
                            }, 1500);
                        } catch(e) { console.error(e); }
                    });
                });
            }
            showView('taller', document.getElementById('nav-taller')); 
        });
        
        ipcRenderer.on('producto-guardado', () => { showToast("Producto agregado", 'success'); showView('inventario', document.getElementById('nav-inv')); });
        
        ipcRenderer.on('resultado-usuario', (e, res) => {
            if(res.success) { showToast(res.msg, 'success'); document.getElementById('modal-usuario').style.display='none'; ipcRenderer.send('obtener-usuarios'); } 
            else { showToast(res.msg, 'danger'); }
        });

        ipcRenderer.on('lista-de-ordenes', (e, rows) => {
            const tbody = document.getElementById('tabla-servicios');
            if(tbody) {
                tbody.innerHTML = rows.map(r => {
                    let link = `https://wa.me/51${r.telefono}?text=${encodeURIComponent('Hola, el estado de su orden es: ' + r.estado)}`;
                    let bgSelect = '#2a1a1a';
                    if(r.estado === 'En Proceso') bgSelect = '#0f3a35';
                    if(r.estado === 'Completado') bgSelect = '#2d264b';
                    if(r.estado === 'Entregado') bgSelect = '#064e3b';

                    return `
                    <tr>
                        <td style="color:var(--bh-purple); font-weight:bold;">#${String(r.id).padStart(4,'0')}</td>
                        <td>${r.fecha ? r.fecha.substring(0,10) : '-'}</td>
                        <td>
                            <div style="font-weight:600; color:white;">${r.cliente}</div>
                            <a href="${link}" target="_blank" style="font-size:12px; color:var(--success); text-decoration:none; display:flex; align-items:center; gap:5px;"><span>📞 WhatsApp</span></a>
                        </td>
                        <td>${r.modelo}</td>
                        <td>
                        <div style="display: flex; flex-direction: column; gap: 8px;">
                            <select class="status-select" onchange="cambiarEstadoOrden(${r.id}, this.value, '${r.telefono}')" style="background:${bgSelect}; color:white;">
                                <option value="Recibido" ${r.estado === 'Recibido' ? 'selected' : ''}>📥 Recibido</option>
                                <option value="En Proceso" ${r.estado === 'En Proceso' ? 'selected' : ''}>🔧 En Proceso</option>
                                <option value="Completado" ${r.estado === 'Completado' ? 'selected' : ''}>✅ Completado</option>
                                <option value="Entregado" ${r.estado === 'Entregado' ? 'selected' : ''}>📦 Entregado</option>
                            </select>
                            
                            <button class="bh-btn-white" style="border-color: var(--info); color: var(--info); padding: 4px 8px; font-size: 11px;" 
                                    onclick="abrirModalFacturacion(${r.id}, '${r.cliente}', ${r.costo})">
                                🧾 Facturar
                            </button>
                        </div>
                    </td>
                    </tr>`;
                }).join('');
                if(document.getElementById('dash-asignar')) document.getElementById('dash-asignar').innerText = rows.length;
            }
        });

        ipcRenderer.on('lista-de-productos', (e, rows) => {
            todosLosProductos = rows || [];
            renderizarProductosFiltrados();
        });

        ipcRenderer.on('datos-reporte', (e, data) => {
            try {
                if(document.getElementById('kpi-ingresos')) document.getElementById('kpi-ingresos').innerText = `S/ ${data.totalIngresos.toFixed(2)}`;
                if(document.getElementById('kpi-ordenes')) document.getElementById('kpi-ordenes').innerText = data.totalOrdenes;
                if(document.getElementById('kpi-reparados')) document.getElementById('kpi-reparados').innerText = data.totalReparados;
                if(document.getElementById('revenueChart') && typeof Chart !== 'undefined') {
                  const ticket = data.totalOrdenes > 0 
            ? (data.totalIngresos / data.totalOrdenes) 
            : 0;
        if(document.getElementById('kpi-ticket')) 
            document.getElementById('kpi-ticket').innerText = `S/ ${ticket.toFixed(2)}`;
        
                    if (chartInstance) chartInstance.destroy();
                    chartInstance = new Chart(document.getElementById('revenueChart'), {
                        type: 'line', data: { labels: data.grafica.labels, datasets: [{ label: 'Ingresos', data: data.grafica.values, borderColor: '#7c3aed', backgroundColor: 'rgba(124, 58, 237, 0.1)', fill: true }] },
                        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { color: '#333' } }, x: { grid: { display: false } } } }
                    });
                }
            } catch (err) {}
        });

        if(document.getElementById('reg-costo')) {
            document.getElementById('reg-costo').addEventListener('input', function() {
                const val = parseFloat(this.value);
                if(!isNaN(val)) document.getElementById('reg-precio').value = Math.ceil(val * 1.4);
            });
        }

     // ================= IA: RECEPCIÓN =================
let timeoutIA_Recepcion;

// Esta función se ejecuta mientras el vendedor escribe la falla
function simularIA(texto) {
    const aiBox = document.getElementById('ai-suggestion');
    if (texto.length < 10) {
        aiBox.style.display = 'none';
        return;
    }

    // Ponemos un pequeño retraso para no saturar la API mientras teclea
    clearTimeout(timeoutIA_Recepcion);
    timeoutIA_Recepcion = setTimeout(() => {
        aiBox.style.display = 'block';
        aiBox.innerHTML = `🤖 <i>Analizando síntomas con IA...</i>`;
        ipcRenderer.send('ia-recepcion', texto);
    }, 1500); // Espera 1.5 segundos después de que deja de escribir
}

ipcRenderer.on('respuesta-ia-recepcion', (event, res) => {
    const aiBox = document.getElementById('ai-suggestion');
    if (res.success) {
        // Formateamos el texto de la IA para que se vea bien
        const textoFormateado = res.text.replace(/\n/g, '<br>');
        aiBox.innerHTML = `<span style="color:#a78bfa; font-weight:bold;">🤖 Diagnóstico IA:</span><br><span style="color:#ccc;">${textoFormateado}</span>`;
    } else {
        aiBox.innerHTML = `🤖 <i>Error al consultar la IA.</i>`;
    }
});

        function generarQR() {
            try {
                document.getElementById('qrcode').innerHTML = "";
                if(typeof QRCode !== 'undefined') { new QRCode(document.getElementById('qrcode'), { text: "https://blackhouse.app/tracking", width: 128, height: 128 }); }
            } catch (err) {}
        }

        ipcRenderer.on('datos-crm', (e, rows) => {
            const body = document.getElementById('list-crm');
            if(!body) return;
            if(rows.length === 0) { body.innerHTML = '<tr><td colspan="3" style="text-align:center; padding:20px;">Sin inactivos.</td></tr>'; } 
            else { body.innerHTML = rows.map(c => `<tr><td>${c.nombre}</td><td>${c.ultima_visita||'-'}</td><td><button class="bh-btn-white">Enviar Promo</button></td></tr>`).join(''); }
        });

        ipcRenderer.on('lista-de-clientes', (e, rows) => {
            const tbody = document.getElementById('tabla-clientes');
            if (!tbody) return;
            if (!rows || rows.length === 0) { tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:20px;">No hay clientes.</td></tr>'; } 
            else { tbody.innerHTML = rows.map(c => `<tr><td style="font-weight:bold; color:white;">${c.nombre || 'Sin Nombre'}</td><td>${c.telefono || '-'}</td><td>${c.email || '-'}</td><td><button class="bh-btn-white" onclick="window.open('https://wa.me/51${c.telefono}')">WhatsApp 💬</button></td></tr>`).join(''); }
        });
        
        ipcRenderer.on('lista-de-usuarios', (e, rows) => {
            const tbody = document.getElementById('tabla-usuarios');
            if (!tbody) return;
            
            if (!rows || rows.length === 0) { 
                tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:20px;">No hay usuarios registrados.</td></tr>'; 
            } else { 
                tbody.innerHTML = rows.map(u => `
                    <tr>
                        <td style="font-weight:bold; color:white;">
                            <div style="display:flex; align-items:center; gap:10px;">
                                <div style="width:30px; height:30px; background:#333; border-radius:50%; display:flex; align-items:center; justify-content:center;">👤</div>
                              ${u.nombre_completo ? u.nombre_completo + '<br><span style="font-size:10px;color:#666;">@'+u.usuario+'</span>' : u.usuario}
                            </div>
                        </td>
                        <td style="text-transform:uppercase; font-size:11px; color:#aaa;">${u.rol}</td>
                        <td><span class="status-badge ${u.estado === 'activo' ? 'bg-entregado' : 'bg-asignar'}">${u.estado}</span></td>
                        <td>
                            <button class="bh-btn-white" style="border-color:var(--danger); color:var(--danger); padding:4px 10px;" onclick="alert('Función para desactivar en desarrollo')">Desactivar</button>
                        </td>
                    </tr>
                `).join(''); 
            }
        });

        function cambiarEstadoUsuario(id, nuevoEstado) { ipcRenderer.send('cambiar-estado-usuario', { id, nuevoEstado }); showToast(`Usuario ${nuevoEstado}`, 'success'); }

        function cambiarEstadoOrden(id, nuevoEstado, telefono) {
            ipcRenderer.send('actualizar-estado-orden', { id, estado: nuevoEstado });
            if (nuevoEstado === 'Devuelto') {
        const miUsuario = localStorage.getItem('userNickname') || 'Técnico';
        enviarAlertaGerencial(
            miUsuario, 
            'AUDITORÍA', 
            `marcó la orden ID-${String(id).padStart(4,'0')} como DEVUELTO (Sin solución). Revisar.`
        );
    }
            const trackingLink = `https://blackhouse.app/track/${id}`;
            const mensaje = `Hola, el estado de su orden #${id} ha cambiado a: *${nuevoEstado}*. \nVer detalle: ${trackingLink}`;
            const url = `https://wa.me/51${telefono}?text=${encodeURIComponent(mensaje)}`;
            if(isElectron) require('electron').shell.openExternal(url);
            else window.open(url, '_blank');
       notificarChatOrden(id, 'Equipo', nuevoEstado);
        }

        ipcRenderer.on('orden-actualizada', (e, data) => { showToast(`Estado actualizado`, 'success'); });

        const canvas = document.getElementById('signature-pad');
        const ctx = canvas.getContext('2d');
        let isDrawing = false;
        ctx.lineWidth = 2; ctx.strokeStyle = '#000000';

        function getPos(e) { const rect = canvas.getBoundingClientRect(); const scaleX = canvas.width / rect.width; const scaleY = canvas.height / rect.height; return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY }; }

        canvas.addEventListener('mousedown', (e) => { isDrawing = true; ctx.beginPath(); ctx.moveTo(getPos(e).x, getPos(e).y); });
        canvas.addEventListener('mousemove', (e) => { if (isDrawing) { ctx.lineTo(getPos(e).x, getPos(e).y); ctx.stroke(); } });
        canvas.addEventListener('mouseup', () => isDrawing = false);
        canvas.addEventListener('mouseleave', () => isDrawing = false);

        canvas.addEventListener('touchstart', (e) => { e.preventDefault(); isDrawing = true; ctx.beginPath(); const t = e.touches[0]; const m = new MouseEvent("mousedown", { clientX: t.clientX, clientY: t.clientY }); canvas.dispatchEvent(m); }, { passive: false });
        canvas.addEventListener('touchmove', (e) => { e.preventDefault(); const t = e.touches[0]; const m = new MouseEvent("mousemove", { clientX: t.clientX, clientY: t.clientY }); canvas.dispatchEvent(m); }, { passive: false });
        canvas.addEventListener('touchend', () => isDrawing = false);

        function limpiarFirma() { ctx.clearRect(0, 0, canvas.width, canvas.height); }

        let streamCamara = null;
        async function toggleCamara() {
            const video = document.getElementById('video-feed');
            const placeholder = document.getElementById('cam-placeholder');
            const controls = document.getElementById('cam-controls');
            const btn = document.getElementById('btn-cam');
            if(!streamCamara) {
                try {
                    streamCamara = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
                    video.srcObject = streamCamara; video.style.display = 'block'; placeholder.style.display = 'none';
                    controls.style.display = 'block'; document.getElementById('photo-preview').style.display = 'none';
                    document.getElementById('photo-actions').style.display = 'none'; btn.innerText = "Apagar Cámara 🚫"; btn.style.color = "var(--danger)";
                } catch (err) { alert("Error: No se pudo acceder a la cámara."); }
            } else { apagarCamara(); btn.innerText = "Activar Cámara 📸"; btn.style.color = "white"; }
        }

        function apagarCamara() {
            const video = document.getElementById('video-feed');
            if(streamCamara) { streamCamara.getTracks().forEach(t => t.stop()); streamCamara = null; }
            video.style.display = 'none'; document.getElementById('cam-controls').style.display = 'none';
            if(document.getElementById('photo-preview').style.display === 'none') { document.getElementById('cam-placeholder').style.display = 'block'; }
        }

        function tomarFoto() {
            const video = document.getElementById('video-feed');
            const canvas = document.getElementById('photo-canvas');
            const img = document.getElementById('photo-preview');
            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
            img.src = canvas.toDataURL('image/jpeg'); img.style.display = 'block';
            apagarCamara(); document.getElementById('photo-actions').style.display = 'block'; document.getElementById('btn-cam').innerText = "Activar Cámara 📸";
        }

        function retomarFoto() { document.getElementById('photo-preview').style.display = 'none'; document.getElementById('photo-actions').style.display = 'none'; toggleCamara(); }
        
       // ===== DATOS DEMO REALISTAS =====
const DEMO_ORDERS = [
    { id:112, fecha:'Hoy, 10:32', cliente:'Carlos Mendoza', modelo:'iPhone 15 Pro Max', falla:'Pantalla rota, touch no responde', estado:'En Proceso', badge:'bg-proceso', costo:320 },
    { id:111, fecha:'Hoy, 09:15', cliente:'María García Rodríguez', modelo:'Samsung Galaxy S24 Ultra', falla:'No carga, puerto dañado', estado:'Recibido', badge:'bg-asignar', costo:150 },
    { id:110, fecha:'Ayer, 16:40', cliente:'José Ramírez Luna', modelo:'iPhone 14 Plus', falla:'Batería hinchada, apaga solo', estado:'Completado', badge:'bg-completado', costo:180 },
    { id:109, fecha:'Ayer, 11:20', cliente:'Ana Torres Vega', modelo:'Xiaomi 13 Ultra', falla:'Cámara trasera dañada', estado:'Entregado', badge:'bg-entregado', costo:220 },
    { id:108, fecha:'23/06', cliente:'Luis Castro Pino', modelo:'iPad Pro M2 11"', falla:'Conector USB-C quemado', estado:'En Proceso', badge:'bg-proceso', costo:95 },
    { id:107, fecha:'22/06', cliente:'Diana Fuentes Ríos', modelo:'MacBook Pro M3 14"', falla:'Teclado con líquido, corto', estado:'Entregado', badge:'bg-entregado', costo:480 },
    { id:106, fecha:'22/06', cliente:'Roberto Valles Cruz', modelo:'Huawei P60 Pro', falla:'Pantalla con líneas verdes', estado:'Recibido', badge:'bg-asignar', costo:260 },
];

const DEMO_CLIENTES = [
    { nombre:'Carlos Mendoza Quispe', telefono:'987654321', email:'carlos.m@gmail.com', visitas:4 },
    { nombre:'María García Rodríguez', telefono:'956789012', email:'mariag@hotmail.com', visitas:2 },
    { nombre:'José Ramírez Luna', telefono:'923456781', email:'joseramirez@email.pe', visitas:7 },
    { nombre:'Ana Torres Vega', telefono:'945123678', email:'ana.torres@gmail.com', visitas:1 },
    { nombre:'Luis Castro Pino', telefono:'912345678', email:'lcastro@empresa.com', visitas:3 },
];

const DEMO_PRODUCTOS = [
    { nombre:'Pantalla iPhone 15 Pro OLED', categoria:'Pantallas', precio:280, costo:155, stock:3 },
    { nombre:'Batería Samsung S24 Ultra', categoria:'Baterías', precio:85, costo:40, stock:8 },
    { nombre:'Módulo Carga iPhone 14', categoria:'Conectores', precio:45, costo:20, stock:14 },
    { nombre:'Pantalla Samsung A54 AMOLED', categoria:'Pantallas', precio:110, costo:60, stock:5 },
    { nombre:'Batería iPhone 13 Pro Original', categoria:'Baterías', precio:65, costo:30, stock:2 },
    { nombre:'IC Carga Tristar U2 iPhone', categoria:'Microcomponentes', precio:35, costo:12, stock:20 },
];

function entrarModoBeta() {
    // Ocultar login y mostrar la app
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('app-content').style.display = 'flex';

    // Mostrar TODOS los módulos del menú
    ['nav-dash','nav-recep','nav-taller','nav-lab','nav-clientes','nav-inv','nav-proveedores',
     'nav-report','nav-facturas','nav-cal','nav-crm','nav-config'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'flex';
    });

    // Info del usuario demo
    document.getElementById('user-display-name').innerText = 'Demo Taller';
    document.getElementById('user-role-display').innerText = 'MODO DEMO';
    document.getElementById('user-role-display').style.color = 'var(--warning)';
    const avatarContainer = document.getElementById('top-bar-avatar');
    if (avatarContainer) avatarContainer.innerHTML = '<img src="https://ui-avatars.com/api/?name=Demo&background=7c3aed&color=fff&bold=true" style="width:100%;height:100%;object-fit:cover;">';

    // Dashboard
    document.getElementById('welcome-msg').innerHTML = 'Modo Demostración — <span style="color:var(--warning);font-size:13px;">⚠️ Los datos son de ejemplo y no se guardan.</span>';
    if (document.getElementById('dash-asignar')) document.getElementById('dash-asignar').innerText = '5';

    // KPIs de Reportes
    const kpis = {'kpi-ingresos':'S/ 18,920.00','kpi-ordenes':'73','kpi-reparados':'61','kpi-ticket':'S/ 259.18'};
    Object.entries(kpis).forEach(([id,v]) => { const el=document.getElementById(id); if(el) el.innerText=v; });

    // Poblar tablas con datos demo
    _poblarTallerDemo();
    _poblarClientesDemo();
    _poblarInventarioDemo();
    _poblarCRMDemo();

    // Gráfico de línea con datos realistas
    setTimeout(_poblarGraficoDemo, 500);

    // Agregar banda de DEMO en esquina superior
    if (!document.getElementById('demo-ribbon')) {
        const r = document.createElement('div');
        r.id = 'demo-ribbon';
        r.style.cssText = 'position:fixed;top:26px;right:-38px;background:#e2950f;color:#000;font-weight:900;font-size:11px;padding:6px 55px;transform:rotate(45deg);z-index:99998;pointer-events:none;letter-spacing:1px;box-shadow:0 2px 8px rgba(0,0,0,0.6);';
        r.innerText = 'DEMO';
        document.body.appendChild(r);
    }

    showToast('🎯 Modo Demo — Explora TODAS las funciones del sistema', 'success');
    showView('dashboard', document.getElementById('nav-dash'));
}

function _poblarTallerDemo() {
    const t = document.getElementById('tabla-servicios');
    if (!t) return;
    t.innerHTML = DEMO_ORDERS.map(r => `
        <tr>
            <td style="color:var(--bh-purple);font-weight:bold;">#${String(r.id).padStart(4,'0')}</td>
            <td>${r.fecha}</td>
            <td>
                <div style="font-weight:600;color:white;">${r.cliente}</div>
                <div style="font-size:11px;color:#666;margin-top:2px;">${r.falla}</div>
                <span style="font-size:11px;color:var(--success);">📞 WhatsApp</span>
            </td>
            <td style="color:#ccc;">${r.modelo}</td>
            <td>
                <div style="display:flex;flex-direction:column;gap:8px;">
                    <span class="status-badge ${r.badge}">${r.estado}</span>
                    <span style="font-size:11px;color:var(--success);font-weight:600;">S/ ${r.costo}.00</span>
                    <button class="bh-btn-white" style="border-color:var(--info);color:var(--info);padding:3px 8px;font-size:10px;" onclick="showToast('Función disponible en versión licenciada','warning')">🧾 Facturar</button>
                </div>
            </td>
        </tr>`).join('');
}

function _poblarClientesDemo() {
    const t = document.getElementById('tabla-clientes');
    if (!t) return;
    t.innerHTML = DEMO_CLIENTES.map(c => `
        <tr>
            <td>
                <div style="display:flex;align-items:center;gap:10px;">
                    <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(c.nombre)}&background=random&color=fff&bold=true&size=32" style="width:32px;height:32px;border-radius:8px;flex-shrink:0;">
                    <div>
                        <div style="font-weight:600;color:white;">${c.nombre}</div>
                        <div style="font-size:10px;color:#aaa;">${c.visitas} reparaciones</div>
                    </div>
                </div>
            </td>
            <td>${c.telefono}</td>
            <td>${c.email}</td>
            <td><button class="bh-btn-white" style="border-color:var(--success);color:var(--success);padding:4px 10px;font-size:11px;" onclick="showToast('Función disponible en versión licenciada','warning')">💬 WhatsApp</button></td>
        </tr>`).join('');
}

function _poblarInventarioDemo() {
    const t = document.getElementById('tabla-productos');
    if (!t) return;
    t.innerHTML = DEMO_PRODUCTOS.map(p => `
        <tr>
            <td style="font-weight:600;color:white;">${p.nombre}</td>
            <td><span style="background:rgba(124,58,237,0.1);color:#a78bfa;padding:2px 10px;border-radius:10px;font-size:11px;">${p.categoria}</span></td>
            <td style="color:var(--success);font-weight:bold;">S/ ${p.precio}.00</td>
            <td>
                <span style="color:${p.stock>4?'var(--success)':'var(--danger)'};font-weight:bold;">${p.stock} unid.</span>
                ${p.stock<=4?'<span style="font-size:10px;color:var(--danger);margin-left:5px;">⚠️ Stock bajo</span>':''}
            </td>
        </tr>`).join('');
}

function _poblarCRMDemo() {
    const t = document.getElementById('list-crm');
    if (!t) return;
    t.innerHTML = DEMO_CLIENTES.map(c => `
        <tr>
            <td style="font-weight:bold;color:white;">${c.nombre}</td>
            <td style="color:var(--warning);">Hace ${Math.floor(Math.random()*20+30)} días</td>
            <td><button class="bh-btn-purple" style="padding:4px 12px;font-size:11px;" onclick="showToast('Función disponible en versión licenciada','warning')">📱 Enviar Promo WA</button></td>
        </tr>`).join('');
}

function _poblarGraficoDemo() {
    const canvas = document.getElementById('revenueChart');
    if (!canvas || typeof Chart === 'undefined') return;
    if (chartInstance) chartInstance.destroy();
    chartInstance = new Chart(canvas, {
        type: 'line',
        data: {
            labels: ['Ene','Feb','Mar','Abr','May','Jun','Jul'],
            datasets: [{
                label: 'Ingresos Mensuales',
                data: [4200, 5800, 4900, 7100, 8900, 11200, 18920],
                borderColor: '#7c3aed',
                backgroundColor: 'rgba(124,58,237,0.08)',
                fill: true, tension: 0.4,
                pointBackgroundColor: '#7c3aed',
                pointRadius: 5
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { grid: { color: '#1a1a1a' }, ticks: { color: '#666', callback: v => 'S/ '+v.toLocaleString() } },
                x: { grid: { display: false }, ticks: { color: '#666' } }
            }
        }
    });
}
        function guardarConfigWA() {
            localStorage.setItem('wa_codigo', document.getElementById('conf-wa-codigo').value || '51');
            localStorage.setItem('wa_recibido', document.getElementById('conf-wa-recibido').value);
            localStorage.setItem('wa_reparado', document.getElementById('conf-wa-reparado').value);
            showToast("Configuración de WhatsApp actualizada", "success");
        }

        function iniciarTutorial(rol) {
            let pasos = [];
            pasos.push({ 
                element: '#nav-dash', 
                intro: '👋 <b>¡Bienvenido a BlackHouse OS!</b><br><br>Aquí en el Dashboard verás un resumen de las órdenes del día y tu rendimiento.' 
            });

            if (rol === 'dueno' || rol === 'tecnico') {
                pasos.push({ 
                    element: '#nav-recep', 
                    intro: '📝 <b>Recepción de Equipos</b><br>Aquí crearás las nuevas órdenes, registrarás la falla, activarás la IA de diagnósticos y pedirás la firma del cliente.' 
                });
                pasos.push({ 
                    element: '#nav-taller', 
                    intro: '🛠️ <b>Control de Taller</b><br>Gestiona las reparaciones en curso. No olvides cambiar el estado a "Completado" cuando el equipo esté listo.' 
                });
            }

            if (rol === 'dueno' || rol === 'vendedor') {
                pasos.push({ 
                    element: '#nav-clientes', 
                    intro: '👥 <b>Directorio de Clientes</b><br>Tu base de datos. Desde aquí puedes contactarlos directamente por WhatsApp con un clic.' 
                });
                pasos.push({ 
                    element: '#nav-inv', 
                    intro: '📦 <b>Inventario</b><br>Revisa el stock de accesorios y repuestos antes de cotizar una reparación.' 
                });
            }

            if (rol === 'dueno') {
                pasos.push({ 
                    element: '#nav-report', 
                    intro: '📊 <b>Métricas de Negocio</b><br>Gráficos en tiempo real de los ingresos y el ticket promedio de la tienda.' 
                });
                pasos.push({ 
                    element: '#nav-config', 
                    intro: '⚙️ <b>Ajustes del Sistema</b><br>Crea accesos para tus trabajadores, personaliza la app y automatiza tus mensajes de WhatsApp.' 
                });
            }

            pasos.push({ 
                element: '#btn-quick-add', 
                intro: '⚡ <b>Acción Rápida</b><br>Usa este botón morado en cualquier momento para iniciar una orden nueva sin importar en qué pantalla estés.<br><br><b>¡Estás listo para empezar!</b>' 
            });

            introJs().setOptions({
                steps: pasos,
                nextLabel: 'Siguiente >',
                prevLabel: '< Atrás',
                doneLabel: '¡Entendido!',
                showStepNumbers: false,
                exitOnOverlayClick: false,
                disableInteraction: true
            }).start();
        }

        function cargarEstadoPlan() {
            const idGuardado = localStorage.getItem('miEmpresaId');
            if (!idGuardado) {
                console.error("No hay empresa logueada");
                return;
            }
            ipcRenderer.send('obtener-estado-plan', { empresaId: idGuardado });
        }

        ipcRenderer.on('estado-plan-respuesta', (e, res) => {
            const porcentaje = (res.usados / res.total) * 100;
            document.getElementById('plan-text').innerText = `Asientos ocupados: ${res.usados} de ${res.total}`;
            document.getElementById('plan-percent').innerText = `${Math.round(porcentaje)}%`;
            document.getElementById('plan-bar').style.width = `${porcentaje}%`;
            if (porcentaje >= 100) document.getElementById('plan-bar').style.background = 'var(--danger)';
        });

        function guardarDatosEmpresa() {
            const nombre = document.getElementById('conf-empresa-nombre').value;
            const direccion = document.getElementById('conf-empresa-dir').value;
            const telefono = document.getElementById('conf-empresa-tel').value;
            
            const empresaId = localStorage.getItem('miEmpresaId'); 

            if(!empresaId || empresaId === "null" || empresaId === "undefined") {
                return showToast("Error: Vuelve a iniciar sesión para conectar la base de datos.", "danger");
            }

            const data = { 
                id: empresaId, 
                nombre: nombre, 
                direccion: direccion, 
                telefono: telefono 
            };
            
            ipcRenderer.send('guardar-datos-empresa', data);
        }

        ipcRenderer.on('resultado-datos-empresa', (e, res) => {
            if(res.success) {
                showToast("Datos de la empresa guardados con éxito", "success");
            } else {
                showToast("Error al guardar: " + res.msg, "danger");
            }
        });

        function mostrarRegistro() {
            document.getElementById('login-section').style.display = 'none';
            document.getElementById('register-section').style.display = 'block';
        }

        function ocultarRegistro() {
            document.getElementById('login-section').style.display = 'block';
            document.getElementById('register-section').style.display = 'none';
        }

        function registrarNuevoNegocio() {
            const empName = document.getElementById('reg-empresa-name').value.trim();
            const adminUser = document.getElementById('reg-admin-user').value.trim();
            const adminPass = document.getElementById('reg-admin-pass').value.trim();
            const licencia = document.getElementById('reg-licencia').value.trim(); 

            if(!empName || !adminUser || !adminPass || !licencia) {
                return showToast("Faltan datos o el código de licencia", "warning");
            }

            ipcRenderer.send('registrar-nuevo-cliente-saas', {
                empresa: empName,
                usuario: adminUser,
                password: adminPass,
                codigo: licencia 
            });
        }

        ipcRenderer.on('registro-saas-respuesta', (e, res) => {
            if(res.success) {
                showToast("¡Negocio creado! Iniciando sesión...", "success");
                document.getElementById('user-login').value = document.getElementById('reg-admin-user').value;
                document.getElementById('pass-login').value = document.getElementById('reg-admin-pass').value;
                iniciarSesion();
            } else {
                showToast("Error: " + res.msg, "danger");
            }
        });

        function generarNuevaLicencia() {
            const meses = document.getElementById('licencia-duracion').value;
            ipcRenderer.send('crear-codigo-automatico', { meses: parseInt(meses) });
        }

        ipcRenderer.on('codigo-creado-exito', (e, nuevoCodigo) => {
            codigoActualParaCopiar = nuevoCodigo; // Guardamos el código para poder copiarlo
            
            const contenedor = document.getElementById('codigo-generado');
            contenedor.innerText = nuevoCodigo;
            
            // Restauramos el botón a la normalidad
            const btn = document.getElementById('btn-copiar-licencia');
            if(btn) {
                btn.innerText = "📋 Copiar";
                btn.style.background = "transparent";
                btn.style.color = "var(--success)";
            }

            navigator.clipboard.writeText(nuevoCodigo);
            showToast("¡Código generado! Listo para enviar por WhatsApp.", "success");
        });

        // NUEVO: Función para copiar el código manualmente con un solo clic
        function copiarCodigoManual() {
            if (!codigoActualParaCopiar || codigoActualParaCopiar === "---") {
                return showToast("Primero debes generar un código", "warning");
            }
            
            navigator.clipboard.writeText(codigoActualParaCopiar);
            
            const btn = document.getElementById('btn-copiar-licencia');
            btn.innerText = "✅ ¡Copiado!";
            btn.style.background = "rgba(16, 185, 129, 0.15)";
            btn.style.color = "#10b981";
            
            showToast("Código copiado al portapapeles", "success");
            
            setTimeout(() => {
                btn.innerText = "📋 Copiar";
                btn.style.background = "transparent";
                btn.style.color = "var(--success)";
            }, 2000);
        }

// ================= MÓDULO DE FACTURACIÓN =================
        
         // ================= MÓDULO DE FACTURACIÓN =================
        let ordenAFacturar = null;

        function abrirModalFacturacion(idOrden, nombreCliente, costo) {
            ordenAFacturar = idOrden;
            
            // Pre-llenamos el modal con los datos que ya sabemos
            document.getElementById('fact-nom').value = nombreCliente;
            document.getElementById('fact-desc').value = `Servicio Técnico - Reparación de Orden #${String(idOrden).padStart(4, '0')}`;
            document.getElementById('fact-monto').value = costo || 0; 
            
            // Limpiamos los demás
            document.getElementById('fact-doc').value = '';
            document.getElementById('fact-dir').value = '';
            
            document.getElementById('modal-facturacion').style.display = 'flex';
        }

        function emitirFactura() {
            const tipo = document.getElementById('fact-tipo').value;
            const doc = document.getElementById('fact-doc').value;
            const nom = document.getElementById('fact-nom').value;
            const dir = document.getElementById('fact-dir').value;
            const total = document.getElementById('fact-monto').value;

            // REGLAS ESTRICTAS DE SUNAT
            if (!doc && tipo !== 'Nota') return showToast("El RUC o DNI es obligatorio", "warning");
            if (!nom) return showToast("Debes poner el Nombre o Razón Social", "warning");
            if (tipo === 'Factura' && !dir) return showToast("La dirección es obligatoria para Facturas", "warning");

            ipcRenderer.send('emitir-factura-saas', {
                ordenId: ordenAFacturar,
                tipo: tipo,
                documento: doc,
                total: total
            });
        }
// ====================================================================
// MÓDULO DE CHAT PROFESIONAL CON CANALES — BlackHouse OS 2.0
// ====================================================================

let supabaseChat = null;
let chatChannel = null;
let canalActual = 'general';

const CANALES_CONFIG = {
    'general':      { icon: '💬', titulo: 'Canal General' },
    'hardware':     { icon: '🔧', titulo: 'Taller · Hardware' },
    'software':     { icon: '💻', titulo: 'Soporte · Software' },
    'remoto':       { icon: '🖥️', titulo: 'Soporte Remoto & Diagnóstico' },
    'herramientas': { icon: '⚙️', titulo: 'Equipos y Herramientas' }
};

// Configuración de colores y emojis por rol
const ROL_CONFIG = {
    'DUEÑO':    { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', emoji: '👑' },
    'DUENO':    { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', emoji: '👑' },
    'ADMIN':    { color: 'var(--bh-purple)', bg: 'rgba(124,58,237,0.12)', emoji: '⚡' },
    'TÉCNICO':  { color: 'var(--info)', bg: 'rgba(59,130,246,0.12)', emoji: '🔧' },
    'TECNICO':  { color: 'var(--info)', bg: 'rgba(59,130,246,0.12)', emoji: '🔧' },
    'VENDEDOR': { color: 'var(--success)', bg: 'rgba(16,185,129,0.12)', emoji: '💼' },
    'SISTEMA':  { color: '#6b7280', bg: 'rgba(107,114,128,0.08)', emoji: '🤖' },
};

// Inicializar Supabase para el chat
try {
    const SUPA_URL = 'https://flfhpffslhjcuvhxsnjz.supabase.co';
    const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsZmhwZmZzbGhqY3V2aHhzbmp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4Mzg0MDMsImV4cCI6MjA4NDQxNDQwM30.9AxJDLzH2f5jJxAarw5dc1DMuvDlFY2sAr6zJBNUsFc';
    if (typeof window.supabase !== 'undefined') {
        supabaseChat = window.supabase.createClient(SUPA_URL, SUPA_KEY);
    }
} catch (e) { console.warn('Chat Supabase no disponible:', e); }

// Abrir/Cerrar el panel
function toggleChat() {
    const panel = document.getElementById('chat-panel');
    if (panel) panel.classList.toggle('open');
}

// Cambiar entre canales
function cambiarCanalChat(canal, btnElement) {
    canalActual = canal;
    document.querySelectorAll('.chat-tab').forEach(t => t.classList.remove('active'));
    if (btnElement) {
        btnElement.classList.add('active');
        btnElement.classList.remove('unread'); // Limpiar badge al entrar
    }
    const cfg = CANALES_CONFIG[canal] || CANALES_CONFIG['general'];
    document.getElementById('chat-channel-icon').innerText = cfg.icon;
    document.getElementById('chat-channel-title').innerText = cfg.titulo;
    document.getElementById('chat-messages').innerHTML = '';
    cargarHistorialChatCanal(canal);
}

// Cargar historial de un canal específico
async function cargarHistorialChatCanal(canal) {
    if (!supabaseChat) return;
    const { data } = await supabaseChat
        .from('chat_mensajes')
        .select('*')
        .eq('canal', canal || 'general')
        .order('created_at', { ascending: true })
        .limit(60);
    const chatBody = document.getElementById('chat-messages');
    if (chatBody) chatBody.innerHTML = '';
    if (data && data.length > 0) {
        data.forEach(msg => recibirMensaje(msg, true));
    } else if (chatBody) {
        chatBody.innerHTML = `
            <div style="text-align:center;padding:40px 20px;color:#333;">
                <div style="font-size:30px;margin-bottom:10px;">${CANALES_CONFIG[canal]?.icon || '💬'}</div>
                <div style="font-size:12px;">No hay mensajes en este canal aún.<br>¡Sé el primero en escribir!</div>
            </div>`;
    }
}

// Iniciar la conexión en tiempo real
async function iniciarChatEnVivo() {
    if (!supabaseChat) return;
    const { error } = await supabaseChat.from('chat_mensajes').select('id').limit(1);
    if (error) { console.warn('Chat offline:', error.message); return; }

    chatChannel = supabaseChat.channel('bh_chat_todos_canales');
    chatChannel
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_mensajes' }, payload => {
            const msg = payload.new;
            if (msg.canal === canalActual) {
                // El mensaje es del canal que estoy viendo: mostrar
                recibirMensaje(msg);
            } else {
                // Es de otro canal: poner badge de notificación
                const tab = document.querySelector(`.chat-tab[data-channel="${msg.canal}"]`);
                if (tab) tab.classList.add('unread');
            }
        })
        .on('broadcast', { event: 'typing' }, payload => {
            mostrarEscribiendo(payload.payload.usuario);
        })
        .subscribe(status => {
            if (status === 'SUBSCRIBED') console.log('🟢 Chat en vivo conectado');
        });

    cargarHistorialChatCanal('general');
}

// Renderizar un mensaje en la pantalla
function recibirMensaje(datos, esHistorial = false) {
    const chatBody = document.getElementById('chat-messages');
    if (!chatBody) return;

    const miNick = localStorage.getItem('userNickname') || document.getElementById('user-display-name')?.innerText || '';
    const esMio = (datos.usuario === miNick);
    const time = new Date(datos.created_at || new Date()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const rolKey = (datos.rol || 'USUARIO').toUpperCase();
    const rc = ROL_CONFIG[rolKey] || { color: '#666', bg: 'rgba(255,255,255,0.04)', emoji: '👤' };

// Si el chat está cerrado, incrementar el badge
    const chatPanel = document.getElementById('chat-panel');
    if (chatPanel && !chatPanel.classList.contains('open') && !esMio) {
        incrementarBadgeChat();
    }

    // Mensaje de sistema (automático)
    if (datos.tipo === 'sistema') {
        chatBody.insertAdjacentHTML('beforeend', `
            <div class="msg-system-line">
                <span>${datos.mensaje}</span>
            </div>`);
        chatBody.scrollTop = chatBody.scrollHeight;
        return;
    }

    const imgUrl = datos.avatar
        ? datos.avatar
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(datos.usuario||'U')}&background=random&color=fff&bold=true&size=64`;

    const anim = esHistorial ? 'none' : 'messageIn 0.3s ease';

    if (esMio) {
        chatBody.insertAdjacentHTML('beforeend', `
            <div class="chat-msg msg-out" style="animation:${anim};">
                <div style="line-height:1.5;">${datos.mensaje}</div>
                <span style="font-size:9px;opacity:0.55;display:block;text-align:right;margin-top:5px;">✓ ${time}</span>
            </div>`);
    } else {
        chatBody.insertAdjacentHTML('beforeend', `
            <div style="display:flex;gap:10px;align-items:flex-start;animation:${anim};">
                <img src="${imgUrl}"
                     style="width:38px;height:38px;border-radius:10px;object-fit:cover;border:2px solid ${rc.color};flex-shrink:0;margin-top:2px;"
                     onerror="this.src='https://ui-avatars.com/api/?name=U&background=333&color=fff'">
                <div style="flex:1;max-width:82%;">
                    <div style="display:flex;align-items:center;gap:7px;margin-bottom:5px;">
                        <span style="font-size:12px;font-weight:700;color:white;">${datos.usuario||'Usuario'}</span>
                        <span style="font-size:9px;font-weight:800;background:${rc.bg};color:${rc.color};padding:2px 8px;border-radius:10px;letter-spacing:0.5px;">${rc.emoji} ${rolKey}</span>
                    </div>
                    <div class="chat-msg msg-in" style="margin:0;border-radius:4px 16px 16px 16px;animation:none;">
                        <div style="line-height:1.5;">${datos.mensaje}</div>
                        <span style="font-size:9px;opacity:0.5;display:block;text-align:right;margin-top:4px;">${time}</span>
                    </div>
                </div>
            </div>`);
    }
    chatBody.scrollTop = chatBody.scrollHeight;
}

// Enviar mensaje
async function enviarMensajeChat() {
    const input = document.getElementById('chat-input-text');
    if (!input) return;
    const msg = input.value.trim();
    if (!msg || !supabaseChat) return;

    const miNick = localStorage.getItem('userNickname') || document.getElementById('user-display-name')?.innerText || 'Usuario';
    const miAvatar = localStorage.getItem('userAvatar') || '';
    const miRol = document.getElementById('user-role-display')?.innerText || 'TÉCNICO';

    input.value = '';

    const { error } = await supabaseChat.from('chat_mensajes').insert([{
        usuario: miNick,
        rol: miRol,
        mensaje: msg,
        tipo: 'texto',
        avatar: miAvatar,
        canal: canalActual
    }]);

    if (error) showToast('Error al enviar el mensaje', 'danger');
}

// Función de "Alguien está escribiendo..."
let typingTimeout;

function notificarEscritura() {
    if (!chatChannel) return;
    const miNick = document.getElementById('user-display-name')?.innerText || 'Alguien';
    chatChannel.send({ type: 'broadcast', event: 'typing', payload: { usuario: miNick } });
}

function mostrarEscribiendo(usuario) {
    const miNick = document.getElementById('user-display-name')?.innerText || '';
    if (usuario === miNick) return;
    const ind = document.getElementById('typing-indicator');
    const nameEl = document.getElementById('typing-user-name');
    if (ind && nameEl) {
        nameEl.innerText = usuario;
        ind.style.display = 'block';
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => { ind.style.display = 'none'; }, 2500);
    }
}

// Notificar en el chat cuando cambia el estado de una orden (mensaje automático)
async function notificarChatOrden(ordenId, modelo, nuevoEstado) {
    if (!supabaseChat) return;
    const canal = 'hardware'; // Siempre va al canal de hardware
    const emojis = { 'Completado': '✅', 'Entregado': '📦', 'En Proceso': '🔧', 'Recibido': '📥' };
    await supabaseChat.from('chat_mensajes').insert([{
        usuario: '🤖 Sistema',
        rol: 'SISTEMA',
        mensaje: `${emojis[nuevoEstado] || '•'} Orden <b>#${String(ordenId).padStart(4,'0')}</b> [${modelo}] → <b>${nuevoEstado}</b>`,
        tipo: 'sistema',
        canal: canal
    }]);
}

        ipcRenderer.on('factura-emitida-exito', (e, res) => {
            document.getElementById('modal-facturacion').style.display = 'none';
            
            const appName = localStorage.getItem('appName') || 'BlackHouse OS';
            const currency = typeof globalCurrency !== 'undefined' ? globalCurrency : 'S/';
            const tipo = document.getElementById('fact-tipo').value;
            const doc = document.getElementById('fact-doc').value || 'S/N';
            const nom = document.getElementById('fact-nom').value;
            const dir = document.getElementById('fact-dir').value || '-';
            const desc = document.getElementById('fact-desc').value;
            const montoFinal = parseFloat(document.getElementById('fact-monto').value) || 0;

            document.getElementById('inv-empresa').innerText = appName;
            document.getElementById('inv-cliente').innerText = nom;
            document.getElementById('inv-cliente-doc').innerText = doc;
            document.getElementById('inv-cliente-dir').innerText = dir;
            document.getElementById('inv-desc-final').innerText = desc;
            
            // Actualizar símbolos de moneda
            document.querySelectorAll('.inv-simbolo').forEach(el => el.innerText = currency);
            document.getElementById('inv-moneda-label').innerText = currency === '$' ? 'Dólares (USD)' : 'Soles (PEN)';

            // Elementos dinámicos
            const rowSubtotal = document.getElementById('row-subtotal');
            const rowIgv = document.getElementById('row-igv');
            const boxSunat = document.getElementById('inv-box-sunat');
            const watermark = document.getElementById('inv-watermark');
            const lblTipo = document.getElementById('inv-lbl-tipo');
            const legalText = document.getElementById('inv-legal-text');
            const notaLegal = document.getElementById('inv-nota-legal');

            // Reset estilos
            boxSunat.style.borderColor = '#1a1a1a';
            boxSunat.querySelector('div').style.background = '#1a1a1a';
            watermark.style.display = 'none';
            notaLegal.style.display = 'none';
            legalText.style.display = 'block';
            
            let subtotal = montoFinal;
            let igv = 0;

            if(tipo === 'Factura') {
                document.getElementById('inv-tipo-doc').innerText = 'FACTURA ELECTRÓNICA';
                document.getElementById('inv-doc-label').innerText = 'R.U.C.:';
                lblTipo.innerText = 'Factura Electrónica';
                rowSubtotal.style.display = 'table-row';
                rowIgv.style.display = 'table-row';
                
                subtotal = montoFinal / 1.18;
                igv = montoFinal - subtotal;
                
            } else if (tipo === 'Boleta') {
                document.getElementById('inv-tipo-doc').innerText = 'BOLETA ELECTRÓNICA';
                document.getElementById('inv-doc-label').innerText = 'DNI/RUC:';
                lblTipo.innerText = 'Boleta de Venta Electrónica';
                
                // Color amigable para boletas (azul oscuro)
                boxSunat.style.borderColor = '#003366';
                boxSunat.querySelector('div').style.background = '#003366';
                
                // Ocultar desglose de IGV para boletas
                rowSubtotal.style.display = 'none';
                rowIgv.style.display = 'none';
                
            } else {
                document.getElementById('inv-tipo-doc').innerText = 'NOTA DE VENTA';
                document.getElementById('inv-doc-label').innerText = 'DOC:';
                
                // Estilo interno neutro/gris
                boxSunat.style.borderColor = '#666';
                boxSunat.querySelector('div').style.background = '#666';
                boxSunat.querySelector('div').style.color = 'white';
                
                rowSubtotal.style.display = 'none';
                rowIgv.style.display = 'none';
                watermark.style.display = 'block';
                notaLegal.style.display = 'block';
                legalText.style.display = 'none';
            }
            
            document.getElementById('inv-numero').innerText = `N° ${res.numero}`;
            document.getElementById('inv-fecha').innerText = new Date().toLocaleDateString();
            document.getElementById('inv-letras').innerText = numeroALetras(montoFinal, currency);

            document.getElementById('inv-precio-unit').innerText = subtotal.toFixed(2);
            document.getElementById('inv-valor').innerText = subtotal.toFixed(2);
            document.getElementById('inv-subtotal').innerText = subtotal.toFixed(2);
            document.getElementById('inv-igv').innerText = igv.toFixed(2);
            document.getElementById('inv-total').innerText = montoFinal.toFixed(2);

            document.getElementById('inv-qrcode').innerHTML = "";
            if(typeof window.QRCode !== 'undefined') {
                new window.QRCode(document.getElementById('inv-qrcode'), {
                    text: `${appName}|${res.numero}|${doc}|${currency}${montoFinal.toFixed(2)}`, width: 80, height: 80
                });
            }

            // CREAR Y DESCARGAR
            showToast("Generando documento profesional...", "info");
            setTimeout(() => {
                if(typeof window.html2canvas !== 'undefined') {
                    window.html2canvas(document.getElementById('invoice-content'), { backgroundColor: "#ffffff", scale: 2 }).then(canvas => {
                        const enlaceDescarga = document.createElement('a');
                        enlaceDescarga.download = `${tipo}_${res.numero}.png`;
                        enlaceDescarga.href = canvas.toDataURL('image/png');
                        enlaceDescarga.click();
                        showToast(`¡${tipo} generada con éxito! 📂`, 'success');
                    }).catch(e => {
                        console.error('Error html2canvas:', e);
                        showToast('Error al generar PDF/Imagen', 'error');
                    });
                } else {
                    showToast('Librería de exportación no disponible.', 'error');
                }
            }, 800);
        });
        // Lógica del cronómetro del técnico
let timerInterval;
let seconds = 0;
let isTimerRunning = false;

function toggleTimer() {
    const btn = document.getElementById('btn-timer');
    const display = document.getElementById('timer-display');
    
    if (isTimerRunning) {
        clearInterval(timerInterval);
        btn.innerHTML = '▶ Reanudar';
        btn.style.color = "var(--info)";
        btn.style.borderColor = "var(--info)";
        display.style.color = "var(--warning)";
    } else {
        timerInterval = setInterval(() => {
            seconds++;
            const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
            const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
            const secs = String(seconds % 60).padStart(2, '0');
            display.innerText = `${hrs}:${mins}:${secs}`;
        }, 1000);
        btn.innerHTML = '⏸ Pausar';
        btn.style.color = "var(--warning)";
        btn.style.borderColor = "var(--warning)";
        display.style.color = "var(--success)";
    }
    isTimerRunning = !isTimerRunning;
}

// Búsqueda simulada de stock (puedes conectarla con IPC después)
function filtrarStockTecnico() {
    const valor = document.getElementById('search-stock-tec').value.trim();
    const contenedor = document.getElementById('stock-resultados-tec');
    
    if (valor.length < 2) {
        contenedor.innerHTML = '';
        return;
    }
    
    contenedor.innerHTML = `
        <div style="color:#aaa; font-size:11px; padding:8px; text-align:center;">
            Buscando...
        </div>`;
    
    ipcRenderer.send('buscar-stock-tecnico', valor);
}

ipcRenderer.on('resultados-stock-tecnico', (e, productos) => {
    const contenedor = document.getElementById('stock-resultados-tec');
    if (!contenedor) return;
    
    if (!productos || productos.length === 0) {
        contenedor.innerHTML = `
            <div style="color:#555; font-size:11px; padding:15px; text-align:center;">
                Sin resultados para esta búsqueda
            </div>`;
        return;
    }
    
    contenedor.innerHTML = productos.map(p => `
        <div style="display:flex; justify-content:space-between; align-items:center; 
                    padding:8px 4px; border-bottom:1px solid rgba(255,255,255,0.04);">
            <div>
                <div style="font-size:12px; color:white; font-weight:500;">${p.nombre}</div>
                <div style="font-size:10px; color:#666; margin-top:2px;">${p.categoria || 'Sin categoría'}</div>
            </div>
            <div style="text-align:right; flex-shrink:0; margin-left:8px;">
                <div style="color:var(--success); font-size:12px; font-weight:bold;">
                    S/ ${parseFloat(p.precio).toFixed(2)}
                </div>
                <div style="font-size:10px; color:${p.stock > 3 ? '#555' : 'var(--danger)'};">
                    Stock: ${p.stock}
                </div>
            </div>
        </div>
    `).join('');
});
// 3. Buscar Orden en el Laboratorio
function buscarOrdenLab(e) {
    // Si presiona la tecla Enter (código 13)
    if (e.key === 'Enter') {
        let idVal = document.getElementById('lab-orden-id').value.trim();
        // Limpiamos por si el técnico escribe "#0098" en vez de "98"
        idVal = idVal.replace('#', '').replace(/^0+/, ''); 
        
        if(!idVal) return;
        
        showToast("Buscando orden...", "info");
        // Le pedimos a Electron (base de datos) que busque la orden por ID
        ipcRenderer.send('buscar-orden-id', idVal);
    }
}

// 4. Recibir y mostrar los datos de la orden en el Laboratorio
ipcRenderer.on('respuesta-orden-id', (e, orden) => {
    const infoPanel = document.getElementById('lab-info-equipo');
    
    if (orden) {
        infoPanel.style.display = 'block';
        document.getElementById('lab-modelo').innerText = `📱 Equipo: ${orden.modelo || 'No especificado'}`;
        document.getElementById('lab-falla').innerText = `⚠️ Falla reportada: ${orden.falla || 'No especificada'}`;
        document.getElementById('lab-cliente').innerText = `👤 Cliente: ${orden.cliente || 'Desconocido'}`;
        
        // Si la orden ya tenía notas previas, las cargamos en la bitácora
        document.getElementById('lab-bitacora').value = orden.bitacora || '';
        
        showToast("Datos cargados correctamente", "success");
    } else {
        infoPanel.style.display = 'none';
        document.getElementById('lab-bitacora').value = '';
        showToast("Orden no encontrada", "danger");
    }
});

// 5. Guardar la Bitácora y cambiar el estado a Reparado
function guardarReparacionLab() {
    let idVal = document.getElementById('lab-orden-id').value.trim();
    idVal = idVal.replace('#', '').replace(/^0+/, ''); 
    
    const notas = document.getElementById('lab-bitacora').value;
    
    if (!idVal) {
        return showToast("Primero debes cargar una orden", "warning");
    }

    // Enviamos al backend para actualizar la bitácora y poner el estado en "Completado"
    ipcRenderer.send('actualizar-bitacora-estado', { 
        id: idVal, 
        bitacora: notas, 
        estado: 'Completado' 
    });

    // Si el cronómetro estaba corriendo, lo pausamos automáticamente
    if (isTimerRunning) {
        toggleTimer();
    }
    
    // Limpiamos la pantalla para el siguiente equipo
    document.getElementById('lab-orden-id').value = '';
    document.getElementById('lab-info-equipo').style.display = 'none';
    document.getElementById('lab-bitacora').value = '';
    
    // Desmarcar todos los checkboxes de QC
    document.querySelectorAll('#laboratorio input[type="checkbox"]').forEach(cb => cb.checked = false);
}

// Escuchar confirmación de guardado
ipcRenderer.on('bitacora-actualizada', (e, res) => {
    if (res.success) {
        showToast("Reparación guardada y equipo en 'Completado'", "success");
        // Refrescamos la vista general del taller para que se vea el cambio
        ipcRenderer.send('obtener-ordenes');
    } else {
        showToast("Error al guardar: " + res.msg, "danger");
    }
});
// ================= CALCULADORA LEY DE OHM =================
function calcularOhm() {
    const vInput = document.getElementById('ohm-v');
    const iInput = document.getElementById('ohm-i');
    const rInput = document.getElementById('ohm-r');

    let v = parseFloat(vInput.value);
    let i = parseFloat(iInput.value);
    let r = parseFloat(rInput.value);

    // Detectamos qué input está modificando el usuario para no sobreescribirlo
    const active = document.activeElement;

    // Si escribe V e I -> Calcula R (R = V / I)
    if (!isNaN(v) && !isNaN(i) && (active === vInput || active === iInput)) {
        if (i !== 0) rInput.value = (v / i).toFixed(3);
    }
    // Si escribe V y R -> Calcula I (I = V / R)
    else if (!isNaN(v) && !isNaN(r) && (active === vInput || active === rInput)) {
        if (r !== 0) iInput.value = (v / r).toFixed(3);
    }
    // Si escribe I y R -> Calcula V (V = I * R)
    else if (!isNaN(i) && !isNaN(r) && (active === iInput || active === rInput)) {
        vInput.value = (i * r).toFixed(3);
    }
}

function limpiarOhm() {
    document.getElementById('ohm-v').value = '';
    document.getElementById('ohm-i').value = '';
    document.getElementById('ohm-r').value = '';
}

// ================= MÓDULO: MI PERFIL =================
let avatarBase64 = "";

function cargarPreviewAvatar(event) {
    const file = event.target.files[0];
    if (file) {
        // Validación de tamaño (Máximo 1MB para no saturar Supabase)
        if (file.size > 1024 * 1024) {
            return showToast("La imagen es muy pesada. Máximo 1MB.", "warning");
        }
        const reader = new FileReader();
        reader.onload = function(e) {
            avatarBase64 = e.target.result;
            document.getElementById('preview-avatar').src = avatarBase64;
            document.getElementById('preview-avatar').style.display = 'block';
            document.getElementById('avatar-placeholder').style.display = 'none';
        };
        reader.readAsDataURL(file);
    }
}

function guardarMiPerfil() {
    const nombre = document.getElementById('perfil-nombre').value.trim();
    const nickname = document.getElementById('perfil-nickname').value.trim();
    
    // Obtenemos el usuario de login original (es nuestra "llave" en la BD)
    const usuarioOriginal = localStorage.getItem('usuarioLogin'); 

    if(!nickname) return showToast("El nickname es obligatorio", "warning");

    ipcRenderer.send('guardar-mi-perfil', {
        usuario_original: usuarioOriginal,
        nombre_completo: nombre,
        nickname: nickname,
        avatar: avatarBase64
    });
}

ipcRenderer.on('perfil-guardado-exito', (e, datos) => {
    showToast("Perfil actualizado correctamente", "success");
    
    // Actualizamos las variables locales
    localStorage.setItem('userNickname', datos.nickname);
    if(datos.avatar) localStorage.setItem('userAvatar', datos.avatar);
    
    // Actualizamos la barra superior
    document.getElementById('user-display-name').innerText = datos.nickname;
    if(datos.avatar) {
        document.getElementById('top-bar-avatar').innerHTML = `<img src="${datos.avatar}" style="width:100%; height:100%; object-fit:cover;">`;
    }
});
// ================= MÓDULO DE IA PARA INVENTARIO =================
let productosIA_Temporales = [];

async function procesarImagenInventario(event) {
    const file = event.target.files[0];
    if (!file) return;

    showToast("Analizando documento con IA... Esto puede tardar unos segundos. ⏳", "info");

    const base64Image = await convertirABase64(file);
    ipcRenderer.send('analizar-documento-ia', { image: base64Image });
}

function convertirABase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

ipcRenderer.on('respuesta-analisis-ia', (event, res) => {
    if (res.success) {
        try {
            const productos = JSON.parse(res.data);
            
            if (productos.length === 0) {
                showToast("La IA no encontró productos en la imagen.", "warning");
                return;
            }

            // Guardar temporalmente y mostrar confirmación
            productosIA_Temporales = productos;
            document.getElementById('ai-confirm-text').innerHTML = 
                `La inteligencia artificial encontró <b style="color: var(--bh-purple); font-size: 18px;">${productos.length}</b> productos.<br><br>¿Deseas añadirlos al inventario ahora?`;
            
            document.getElementById('modal-confirm-ai').style.display = 'flex';

        } catch (error) {
            console.error("Error al procesar JSON:", error);
            showToast("Error leyendo la respuesta de la IA. Revisa consola.", "danger");
        }
    } else {
        showToast("Error de conexión con la IA: " + res.msg, "danger");
    }
    document.getElementById('upload-lista-inv').value = "";
});

function confirmarImportacionIA() {
    document.getElementById('modal-confirm-ai').style.display = 'none';
    showToast(`Guardando ${productosIA_Temporales.length} productos... 💾`, "info");

    productosIA_Temporales.forEach(prod => {
        ipcRenderer.send('nuevo-producto-sql', prod); 
    });

    setTimeout(() => {
        showToast("¡Inventario actualizado con éxito! ✅", "success");
        ipcRenderer.send('obtener-productos');
        productosIA_Temporales = [];
    }, 1500);
}
// ================= IA: COPILOTO DE LABORATORIO =================
function consultarCopilotoLab() {
    const notas = document.getElementById('lab-bitacora').value.trim();
    if (!notas) {
        return showToast("Escribe algo en la bitácora primero para que la IA pueda ayudarte.", "warning");
    }

    const aiLabBox = document.getElementById('ai-lab-response');
    aiLabBox.style.display = 'block';
    aiLabBox.innerHTML = `🧠 <i>Analizando mediciones y esquemáticos...</i>`;
    
    ipcRenderer.send('ia-laboratorio', notas);
}

ipcRenderer.on('respuesta-ia-laboratorio', (event, res) => {
    const aiLabBox = document.getElementById('ai-lab-response');
    if (res.success) {
        const textoFormateado = res.text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
        aiLabBox.innerHTML = `<span style="color:var(--info); font-weight:bold;">🧠 Sugerencia Técnica:</span><br><span style="color:#ccc;">${textoFormateado}</span>`;
   } else {
        // ✅ AHORA VEREMOS EL ERROR REAL
        aiLabBox.innerHTML = `🧠 <i>Error OpenAI: ${res.msg}</i>`; 
    }
});
// Búsqueda global con debounce de 400ms
let _searchTimer;
document.getElementById('global-search').addEventListener('input', function() {
    clearTimeout(_searchTimer);
    const q = this.value.trim();
    
    if (q.length < 2) return;
    
    _searchTimer = setTimeout(() => {
        ipcRenderer.send('busqueda-global', q);
    }, 400);
});

// Limpiar al presionar Escape
document.getElementById('global-search').addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        this.value = '';
        this.blur();
    }
});

// Recibir resultados y navegar al taller filtrando
ipcRenderer.on('resultados-busqueda-global', (e, resultados) => {
    if (!resultados || resultados.length === 0) {
        showToast("Sin resultados para esa búsqueda", "warning");
        return;
    }
    
    // Mostrar en el taller filtrando los resultados
    showView('taller', document.getElementById('nav-taller'));
    
    const tbody = document.getElementById('tabla-servicios');
    if (tbody && resultados.length > 0) {
        // El backend ya devuelve las órdenes filtradas
        // Reusa el mismo renderer de lista-de-ordenes:
        const fakeEvent = {};
        // Emitir como si fuera una respuesta normal
        tbody.innerHTML = resultados.map(r => `
            <tr style="background: rgba(124,58,237,0.05);">
                <td style="color:var(--bh-purple); font-weight:bold;">
                    #${String(r.id).padStart(4,'0')}
                </td>
                <td>${r.fecha ? r.fecha.substring(0,10) : '-'}</td>
                <td>
                    <div style="font-weight:600; color:white;">${r.cliente}</div>
                    <div style="font-size:11px; color:#aaa;">${r.modelo}</div>
                </td>
                <td>${r.modelo}</td>
                <td><span class="status-badge bg-proceso">${r.estado}</span></td>
            </tr>
        `).join('');
        
        showToast(`${resultados.length} resultado(s) encontrado(s)`, "success");
    }
});
function mostrarCargando(tbodyId, columnas = 5) {
    const el = document.getElementById(tbodyId);
    if (!el) return;
    el.innerHTML = `
        <tr>
            <td colspan="${columnas}" style="text-align:center; padding:40px;">
                <div style="display:inline-block; width:28px; height:28px; 
                            border:2px solid rgba(124,58,237,0.2); 
                            border-top-color:var(--bh-purple); 
                            border-radius:50%; 
                            animation: spin 0.7s linear infinite;">
                </div>
                <div style="color:#555; font-size:11px; margin-top:10px;">
                    Cargando datos...
                </div>
            </td>
        </tr>`;
}
// En lugar de onclick="location.reload()"
function cerrarSesion() {
    if(confirm('¿Seguro que deseas cerrar sesión?')) {
        location.reload();
    }
}
// ================= IA: ANALISTA FINANCIERO =================
function generarResumenIA() {
    const aiBox = document.getElementById('ai-finance-box');
    const contentBox = document.getElementById('ai-finance-content');
    
    // Mostramos la caja principal
    aiBox.style.display = 'block';
    // Ponemos el mensaje de carga respetando el diseño
    contentBox.innerHTML = `🧠 <i>Analizando ingresos, órdenes y rentabilidad...</i>`;
    
    ipcRenderer.send('generar-resumen-financiero');
}

ipcRenderer.on('respuesta-resumen-financiero', (e, res) => {
    const contentBox = document.getElementById('ai-finance-content');
    
    if (res.success) {
        const texto = res.text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<b style="color:var(--success);">$1</b>');
        // El padding-right evita que el título se encime con el botón de la "X"
        contentBox.innerHTML = `<h3 style="margin-top:0; color:var(--success); padding-right:30px;">📊 Resumen Ejecutivo Inteligente</h3>${texto}`;
    } else {
        contentBox.innerHTML = `🧠 <i>Error de la IA: ${res.msg}</i>`;
    }
});
// Variable para saber si ya inició
let jornadaIniciada = false;

function marcarAsistenciaManual() {
    const usuario = localStorage.getItem('usuarioLogin');
    const fecha = new Date().toISOString().split('T')[0];
    const hora = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });

    if (!jornadaIniciada) {
        // Enviar evento para Iniciar Jornada
        ipcRenderer.send('marcar-asistencia-manual', {
            usuario: usuario,
            fecha: fecha,
            hora_entrada: hora
        });
    } else {
        // Enviar evento para Registrar Salida
        ipcRenderer.send('registrar-salida-manual', {
            usuario: usuario,
            fecha: fecha,
            hora_salida: hora
        });
    }
}

// Escuchamos la respuesta del servidor para Entrada
ipcRenderer.on('asistencia-respuesta', (e, res) => {
    if (res.success) {
        showToast("¡Jornada iniciada con éxito!", "success");
        jornadaIniciada = true;
        const btn = document.getElementById('btn-asistencia');
        if (btn) {
            btn.innerHTML = "<i class='bx bx-log-out'></i> Registrar Salida";
            btn.style.borderColor = "var(--danger)";
            btn.style.color = "var(--danger)";
        }
    } else {
        showToast("Error al iniciar jornada: " + res.msg, "danger");
    }
});

// Escuchamos la respuesta del servidor para Salida
ipcRenderer.on('salida-respuesta', (e, res) => {
    if (res.success) {
        showToast("¡Jornada finalizada con éxito!", "success");
        jornadaIniciada = false;
        const btn = document.getElementById('btn-asistencia');
        if (btn) {
            btn.innerHTML = "<i class='bx bx-check-circle'></i> Iniciar Jornada";
            btn.style.borderColor = "var(--success)";
            btn.style.color = "var(--success)";
        }
    } else {
        showToast("Error al registrar salida: " + res.msg, "danger");
    }
});

// Escuchamos la respuesta del servidor para Salida
ipcRenderer.on('salida-respuesta', (e, res) => {
    if (res.success) {
        showToast("¡Salida registrada con éxito!", "success");
        jornadaIniciada = false;
        const btn = document.getElementById('btn-asistencia');
        if (btn) {
            btn.disabled = true;
            btn.innerText = "Jornada Finalizada";
            btn.style.opacity = "0.5";
            btn.style.borderColor = "#555";
            btn.style.color = "#888";
        }
    } else {
        showToast("Error al registrar salida: " + res.msg, "danger");
    }
});
// Cuando se marque como "Completado" o "Entregado"
async function registrarFeed(usuario, mensaje) {
    await supabase.from('feed_taller').insert([
        { 
            usuario: usuario, 
            mensaje: mensaje, 
            created_at: new Date().toISOString() 
        }
    ]);
}
// Función global en tu App de Escritorio
async function reportarActividadImportante(nombreUsuario, eventoCritico) {
    try {
        const { error } = await supabaseClient
            .from('feed_taller')
            .insert([
                { usuario: nombreUsuario, mensaje: eventoCritico }
            ]);

        if (error) throw error;
        console.log("Alerta enviada al Panel Web");
    } catch (err) {
        console.error("Error al enviar feed:", err);
    }
}
// Función Global para auditoría de seguridad
async function enviarAlertaGerencial(nombreUsuario, tipoAlerta, detalleCritico) {
        try {
            if (!supabaseChat) return;

            const mensajeFinal = `<span class="text-bhRed font-black">[${tipoAlerta}]</span> ${detalleCritico}`;
            
            const { error } = await supabaseChat
                .from('feed_taller')
                .insert([{ 
                    usuario: nombreUsuario, 
                    mensaje: mensajeFinal 
                }]);

            if (error) console.error("Error enviando alerta:", error);
        } catch (err) {
            console.error("Fallo al enviar la alerta de seguridad:", err);
        }
    }

    let chatMensajesNoLeidos = 0;

function incrementarBadgeChat() {
    const panel = document.getElementById('chat-panel');
    if (panel && panel.classList.contains('open')) return; // Si está abierto, no contar
    chatMensajesNoLeidos++;
    const badge = document.getElementById('chat-notif-badge');
    if (badge) {
        badge.style.display = 'inline-block';
        badge.innerText = chatMensajesNoLeidos > 9 ? '9+' : chatMensajesNoLeidos;
    }
}

function limpiarBadgeChat() {
    chatMensajesNoLeidos = 0;
    const badge = document.getElementById('chat-notif-badge');
    if (badge) badge.style.display = 'none';
}
// ==========================================
// MÓDULO: RECUPERACIÓN DE CONTRASEÑA
// ==========================================

function toggleRecuperarPassword(mostrar) {
    // Usamos TU id exacto: 'login-section'
    const loginContainer = document.getElementById('login-section');
    const recuperarContainer = document.getElementById('recuperar-password-container');

    if (mostrar) {
        loginContainer.style.display = 'none';
        recuperarContainer.style.display = 'block';
    } else {
        loginContainer.style.display = 'block';
        recuperarContainer.style.display = 'none';
        document.getElementById('recuperar-email').value = ''; 
    }
}

async function enviarCorreoRecuperacion(event) {
    const email = document.getElementById('recuperar-email').value.trim();
    const btnEnviar = event.currentTarget; 

    if (!email) {
        // Usamos tu sistema de notificaciones estético (Warning)
        showToast("Por favor, ingresa tu correo electrónico.", "warning");
        return;
    }

    const textoOriginal = btnEnviar.innerHTML;
    btnEnviar.innerHTML = 'Procesando...';
    btnEnviar.disabled = true;

    try {
        const { data, error } = await supabaseChat.auth.resetPasswordForEmail(email, {
            redirectTo: 'https://blackhouse-os-web.vercel.app/actualizar-password.html', 
        });

        if (error) {
            console.error("Error de Supabase:", error.message);
            // Notificación estética de Error
            showToast("Error al enviar el correo. Verifica que esté bien escrito.", "danger");
        } else {
            // Notificación estética de Éxito
            showToast("¡Enlace enviado! Revisa tu bandeja de entrada o SPAM.", "success");
            toggleRecuperarPassword(false); // Volver al login
        }
    } catch (err) {
        console.error("Error interno:", err);
        showToast("Error interno del sistema.", "danger");
    } finally {
        btnEnviar.innerHTML = textoOriginal;
        btnEnviar.disabled = false;
    }
}

// ==========================================
// MÓDULO: SEGURIDAD DE DOBLE PASO (2FA)
// ==========================================

// Intercambia la vista de inicio de sesión con la del 2FA
function toggleMFAView(mostrar) {
    const loginSection = document.getElementById('login-section');
    const mfaSection = document.getElementById('mfa-section');
    const inputs = document.querySelectorAll('.otp-box');

    if (mostrar) {
        loginSection.style.display = 'none';
        mfaSection.style.display = 'block';
        // Dar foco automático al primer cuadro de texto
        setTimeout(() => inputs[0].focus(), 100);
    } else {
        loginSection.style.display = 'block';
        mfaSection.style.display = 'none';
        // Limpiar todas las casillas
        inputs.forEach(input => input.value = '');
    }
}

// Salto automático al escribir un número
function moverAlSiguiente(input, index) {
    // Reemplaza cualquier caracter que no sea número por vacío
    input.value = input.value.replace(/[^0-9]/g, '');
    
    const inputs = document.querySelectorAll('.otp-box');
    if (input.value.length === 1 && index < 5) {
        inputs[index + 1].focus();
    }
    
    // Si se llenó el último dígito, procesa la verificación automáticamente
    if (index === 5 && input.value.length === 1) {
        verificarCodigo2FA();
    }
}

// Permite regresar a la casilla anterior si presionas Borrar (Backspace)
function manejarRetroceso(event, index) {
    const inputs = document.querySelectorAll('.otp-box');
    if (event.key === "Backspace" && inputs[index].value.length === 0 && index > 0) {
        inputs[index - 1].focus();
    }
}

function cancelar2FA() {
    toggleMFAView(false);
    showToast("Inicio de sesión cancelado", "warning");
}

// Verificación real del token de 6 dígitos con el backend
async function verificarCodigo2FA() {
    const inputs = document.querySelectorAll('.otp-box');
    let codigoCompleto = "";
    
    inputs.forEach(input => codigoCompleto += input.value);

    if (codigoCompleto.length < 6) {
        showToast("Por favor, ingresa los 6 dígitos del código.", "warning");
        return;
    }

    const usuarioTemp = localStorage.getItem('usuarioLoginTemp');
    if (!usuarioTemp) {
        showToast("Sesión inválida o expirada. Por favor, inicia sesión de nuevo.", "danger");
        toggleMFAView(false);
        return;
    }

    const btnVerificar = document.querySelector('button[onclick="verificarCodigo2FA()"]');
    if (btnVerificar) {
        btnVerificar.disabled = true;
        btnVerificar.innerText = "Verificando...";
        btnVerificar.style.opacity = "0.7";
    }

    // Enviamos el código para validación en el servidor
    ipcRenderer.send('verificar-2fa', { usuario: usuarioTemp, codigo: codigoCompleto });
}

        // === LOGICA DEL SELECTOR DE MODELOS ===
        
        ipcRenderer.on('marcas-modelos-respuesta', (e, cacheRaw) => {
            let cache = cacheRaw;
            if (typeof cacheRaw === 'string') {
                try { cache = JSON.parse(cacheRaw); } catch(e) { console.error("Error parseando cache:", e); }
            }
            console.log("✨ [Catálogo] Renderer recibió marcas-modelos:", !!cache, cache ? Object.keys(cache).length : 0);
            if (cache && Object.keys(cache).length > 0) {
                marcasModelosCache = cache;
                marcasSeleccionadas = Object.keys(cache).sort();
                inicializarSelectorMarcas();
                
                // Si el modal está abierto y está mostrando el cargando, seleccionar Apple o la primera
                const grid = document.getElementById('selector-modelos-grid');
                const isLoader = grid && grid.innerHTML.includes('Cargando marcas');
                if (document.getElementById('modal-selector-modelos').style.display === 'flex' && (isLoader || !marcaActiva)) {
                    const appleBtn = document.querySelector('.brand-btn[data-brand="Apple"]');
                    if (appleBtn) {
                        seleccionarMarca('Apple', appleBtn);
                    } else if (marcasSeleccionadas.length > 0) {
                        seleccionarMarca(marcasSeleccionadas[0], document.querySelector(`.brand-btn[data-brand="${marcasSeleccionadas[0]}"]`));
                    }
                }
            } else {
                const grid = document.getElementById('selector-modelos-grid');
                if (grid) {
                    grid.innerHTML = `
                        <div style="grid-column: 1/-1; text-align: center; color:var(--danger); padding: 30px;">
                            ⚠️ El catálogo de marcas y modelos no se pudo cargar. Revisa que el archivo devices_cache.json exista en la carpeta del programa.
                        </div>`;
                }
            }
        });

        function inicializarSelectorMarcas() {
            const grid = document.getElementById('selector-marcas-grid');
            if (!grid) return;
            
            // Marcas populares recomendadas en el tope
            const populares = ['Apple', 'Samsung', 'Xiaomi', 'Motorola', 'Huawei', 'Oppo', 'Vivo', 'Realme', 'Infinix', 'Google'];
            
            let html = populares.map(marca => {
                if (marcasSeleccionadas.includes(marca)) {
                    return `<button type="button" class="brand-btn" data-brand="${marca}" onclick="seleccionarMarca('${marca}', this)">${marca}</button>`;
                }
                return '';
            }).join('');
            
            // Añadir otras marcas que estén en el cache pero no en populares
            marcasSeleccionadas.forEach(marca => {
                if (!populares.includes(marca)) {
                    html += `<button type="button" class="brand-btn" data-brand="${marca}" onclick="seleccionarMarca('${marca}', this)">${marca}</button>`;
                }
            });
            
            grid.innerHTML = html;
        }

        function abrirSelectorModelos(targetId) {
            modelSelectorTargetId = targetId;
            document.getElementById('selector-busqueda').value = '';
            document.getElementById('modal-selector-modelos').style.display = 'flex';
            
            // Re-solicitar el catálogo para asegurar que esté al día
            if (isElectron) {
                console.log("Solicitando catálogo de marcas/modelos...");
                ipcRenderer.send('obtener-marcas-modelos');
            }
            
            // Mostrar cargando mientras se recibe respuesta si el caché actual está vacío
            if (Object.keys(marcasModelosCache).length === 0) {
                const grid = document.getElementById('selector-modelos-grid');
                if (grid) {
                    grid.innerHTML = `
                        <div style="grid-column: 1/-1; text-align: center; color:#aaa; padding: 30px;">
                            <i class='bx bx-loader-alt bx-spin' style="font-size:24px; color:var(--bh-purple); margin-bottom:10px;"></i>
                            <br>Cargando marcas y modelos...
                        </div>`;
                }
            } else {
                // Si ya tenemos datos, inicializamos de inmediato
                inicializarSelectorMarcas();
                
                // Resetear marca seleccionada
                document.querySelectorAll('.brand-btn').forEach(btn => btn.classList.remove('active'));
                marcaActiva = '';
                
                // Mostrar todos los modelos de la primera marca popular por defecto (ej. Apple)
                const appleBtn = document.querySelector('.brand-btn[data-brand="Apple"]');
                if (appleBtn) {
                    seleccionarMarca('Apple', appleBtn);
                } else if (marcasSeleccionadas.length > 0) {
                    seleccionarMarca(marcasSeleccionadas[0], document.querySelector(`.brand-btn[data-brand="${marcasSeleccionadas[0]}"]`));
                } else {
                    filtrarYRenderizarModelos();
                }
            }
            
            document.getElementById('selector-busqueda').focus();
        }

        function cerrarSelectorModelos() {
            document.getElementById('modal-selector-modelos').style.display = 'none';
        }

        function seleccionarMarca(marca, el) {
            marcaActiva = marca;
            document.querySelectorAll('.brand-btn').forEach(btn => btn.classList.remove('active'));
            if (el) el.classList.add('active');
            
            // Limpiar búsqueda al cambiar de marca
            document.getElementById('selector-busqueda').value = '';
            
            filtrarYRenderizarModelos();
        }

        function filtrarYRenderizarModelos() {
            const query = document.getElementById('selector-busqueda').value.trim().toLowerCase();
            const grid = document.getElementById('selector-modelos-grid');
            const countLabel = document.getElementById('selector-modelos-count');
            if (!grid) return;
            
            let modelosAMostrar = [];
            
            if (query) {
                // Búsqueda global (ignora marca activa)
                marcasSeleccionadas.forEach(brand => {
                    const list = marcasModelosCache[brand] || [];
                    list.forEach(model => {
                        const fullName = `${brand} ${model}`;
                        if (fullName.toLowerCase().includes(query)) {
                            modelosAMostrar.push({ brand, model, fullName });
                        }
                    });
                });
                
                // Desactivar marcas visualmente si estamos buscando globalmente
                document.querySelectorAll('.brand-btn').forEach(btn => btn.classList.remove('active'));
            } else if (marcaActiva) {
                // Mostrar modelos de la marca activa
                const list = marcasModelosCache[marcaActiva] || [];
                list.forEach(model => {
                    modelosAMostrar.push({ 
                        brand: marcaActiva, 
                        model: model, 
                        fullName: `${marcaActiva} ${model}` 
                    });
                });
            }
            
            // Limitar a máximo 100 resultados para no sobrecargar el DOM
            const totalEncontrados = modelosAMostrar.length;
            const mostrados = modelosAMostrar.slice(0, 100);
            
            countLabel.innerText = `${totalEncontrados} encontrados` + (totalEncontrados > 100 ? ' (mostrando 100)' : '');
            
            if (mostrados.length === 0) {
                grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color:#777; padding: 20px;">No se encontraron modelos.</div>';
                return;
            }
            
            grid.innerHTML = mostrados.map(item => {
                return `<button type="button" class="model-btn" onclick="seleccionarModelo('${item.fullName}')" title="${item.fullName}">
                            <i class='bx bx-mobile-vibration' style="color:var(--bh-purple); margin-right:5px;"></i> ${item.model}
                        </button>`;
            }).join('');
        }

        function seleccionarModelo(nombreCompleto) {
            const targetInput = document.getElementById(modelSelectorTargetId);
            if (targetInput) {
                targetInput.value = nombreCompleto;
                // Si el target es el vinculador de modelos en el registro de pantallas
                if (modelSelectorTargetId === 'reg-vinculo-modelo') {
                    // Autocompletar el nombre del producto
                    document.getElementById('reg-nombre').value = `Pantalla ${nombreCompleto}`;
                }
                // Disparar evento input para validaciones
                targetInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
            cerrarSelectorModelos();
            showToast(`Modelo seleccionado: ${nombreCompleto}`, 'success');
        }

        // === LOGICA DE INVENTARIO CATEGORIZADO ===

        function cambiarRegCategoria(val) {
            // Ocultar sugerencias
            document.getElementById('sub-accesorios-suggest').style.display = 'none';
            document.getElementById('sub-repuestos-suggest').style.display = 'none';
            document.getElementById('sub-pantallas-selector').style.display = 'none';
            
            // Mostrar según categoría
            if (val === 'Accesorios') {
                document.getElementById('sub-accesorios-suggest').style.display = 'block';
                document.getElementById('reg-nombre').placeholder = 'Ej: Auriculares Bluetooth';
            } else if (val === 'Repuestos') {
                document.getElementById('sub-repuestos-suggest').style.display = 'block';
                document.getElementById('reg-nombre').placeholder = 'Ej: Puerto de Carga';
            } else if (val === 'Pantallas') {
                document.getElementById('sub-pantallas-selector').style.display = 'block';
                document.getElementById('reg-nombre').placeholder = 'Ej: Pantalla Apple iPhone 13';
                // Si ya hay un modelo vinculado, actualizar nombre
                const vinculo = document.getElementById('reg-vinculo-modelo').value;
                if (vinculo) {
                    document.getElementById('reg-nombre').value = `Pantalla ${vinculo}`;
                } else {
                    document.getElementById('reg-nombre').value = '';
                }
            }
        }

        function agregarSugerenciaNombre(nombre) {
            document.getElementById('reg-nombre').value = nombre;
            showToast(`Sugerencia aplicada: ${nombre}`, 'success');
        }

        function filtrarInventario(categoria, el) {
            categoriaInventarioActiva = categoria;
            
            // Cambiar clase active en tabs
            document.querySelectorAll('.inv-tab').forEach(tab => tab.classList.remove('active'));
            if (el) el.classList.add('active');
            
            renderizarProductosFiltrados();
        }

        function renderizarProductosFiltrados() {
            const tbody = document.getElementById('tabla-productos');
            if (!tbody) return;
            
            let filtrados = todosLosProductos;
            if (categoriaInventarioActiva !== 'Todos') {
                filtrados = todosLosProductos.filter(p => {
                    const cat = (p.categoria || '').toLowerCase();
                    if (categoriaInventarioActiva === 'Accesorios') {
                        return cat === 'accesorios';
                    } else if (categoriaInventarioActiva === 'Repuestos') {
                        return cat === 'repuestos' || cat === 'repuestos de celulares' || cat === 'repuesto';
                    } else if (categoriaInventarioActiva === 'Pantallas') {
                        return cat === 'pantallas' || cat === 'pantalla';
                    }
                    return false;
                });
            }
            
            if (filtrados.length === 0) {
                tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:20px; color:#777;">No hay productos en esta categoría.</td></tr>`;
                return;
            }
            
            tbody.innerHTML = filtrados.map(p => {
                let badgeColor = 'var(--text-muted)';
                let catText = p.categoria;
                if ((p.categoria || '').toLowerCase().includes('pantalla')) {
                    badgeColor = 'var(--bh-purple)';
                    catText = '📱 Pantalla';
                } else if ((p.categoria || '').toLowerCase().includes('repuesto')) {
                    badgeColor = 'var(--warning)';
                    catText = '🔧 Repuesto';
                } else if ((p.categoria || '').toLowerCase().includes('accesorio')) {
                    badgeColor = 'var(--success)';
                    catText = '🎒 Accesorio';
                }
                
                return `<tr>
                    <td style="font-weight:600; color:white;">${p.nombre}</td>
                    <td><span style="font-size:11px; background:${badgeColor}22; border:1px solid ${badgeColor}44; color:${badgeColor}; padding:3px 10px; border-radius:20px; font-weight:bold;">${catText}</span></td>
                    <td>S/ ${parseFloat(p.precio).toFixed(2)}</td>
                    <td style="font-weight:bold; color:${p.stock > 0 ? '#10b981' : '#ef4444'}">${p.stock}</td>
                </tr>`;
            }).join('');
        }

        // === LOGICA DE GESTION DE PROVEEDORES ===
        let proveedores = [];
        let fotoProveedorTemporalBase64 = '';

        function procesarFotoProveedor(event) {
            const file = event.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                fotoProveedorTemporalBase64 = reader.result;
                document.getElementById('prov-foto').value = file.name;
                showToast("Foto cargada con éxito", "success");
            };
        }

        async function cargarProveedores() {
            const loc = localStorage.getItem('rafitox_proveedores');
            if (loc) {
                proveedores = JSON.parse(loc);
            } else {
                proveedores = [
                    {
                        nombre: "Importaciones Hermanos Vega",
                        tel: "999888777",
                        email: "ventas@hermanosvega.com",
                        dir: "Av. Argentina 1450, Centro de Lima",
                        cat: "Pantallas y Displays",
                        foto: "https://ui-avatars.com/api/?name=Hermanos+Vega&background=7c3aed&color=fff&size=120"
                    },
                    {
                        nombre: "Suministros Express S.A.C.",
                        tel: "912345678",
                        email: "pedidos@suministros.pe",
                        dir: "Calle Las Begonias 450, San Isidro",
                        cat: "Repuestos y Flex",
                        foto: "https://ui-avatars.com/api/?name=Suministros+Express&background=10b981&color=fff&size=120"
                    }
                ];
                localStorage.setItem('rafitox_proveedores', JSON.stringify(proveedores));
            }

            renderizarProveedores();

            if (isElectron) {
                ipcRenderer.send('obtener-proveedores-db');
            }
        }

        ipcRenderer.on('proveedores-db-respuesta', (e, rows) => {
            if (rows && rows.length > 0) {
                const nombresLocales = proveedores.map(p => p.nombre.toLowerCase());
                rows.forEach(r => {
                    if (!nombresLocales.includes(r.nombre.toLowerCase())) {
                        proveedores.push(r);
                    }
                });
                localStorage.setItem('rafitox_proveedores', JSON.stringify(proveedores));
                renderizarProveedores();
            }
        });

        function renderizarProveedores() {
            const grid = document.getElementById('proveedores-grid');
            if (!grid) return;
            
            if (proveedores.length === 0) {
                grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color:#777; padding: 40px;">No hay proveedores registrados. Haz clic en "+ Nuevo Proveedor" para registrar uno.</div>`;
                return;
            }

            grid.innerHTML = proveedores.map((p, index) => {
                const foto = p.foto || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.nombre)}&background=7c3aed&color=fff&size=120`;
                const cleanPhone = p.tel.replace(/\D/g, '');
                return `
                <div class="bh-card" style="display:flex; flex-direction:column; align-items:center; text-align:center; padding:25px; border:1px solid var(--bh-border); transition:0.3s; position:relative; overflow:hidden;">
                    <button onclick="eliminarProveedor(${index})" style="position:absolute; top:12px; right:12px; background:transparent; border:none; color:var(--danger); cursor:pointer; font-size:16px;" title="Eliminar"><i class='bx bx-trash'></i></button>
                    <div style="width:80px; height:80px; border-radius:50%; overflow:hidden; border:2px solid var(--bh-purple); background:#222; display:flex; align-items:center; justify-content:center; margin-bottom:15px;">
                        <img src="${foto}" style="width:100%; height:100%; object-fit:cover;">
                    </div>
                    <h3 style="margin:0; font-size:16px; color:white; font-weight:700;">${p.nombre}</h3>
                    <span style="font-size:10px; background:var(--bh-purple)22; border:1px solid var(--bh-purple)44; color:#a78bfa; padding:3px 10px; border-radius:20px; font-weight:bold; margin-top:5px; margin-bottom:15px; display:inline-block;">${p.cat}</span>
                    
                    <div style="width:100%; text-align:left; font-size:13px; color:#aaa; border-top:1px solid rgba(255,255,255,0.05); padding-top:15px; display:flex; flex-direction:column; gap:8px;">
                        <div style="display:flex; align-items:center; gap:8px;"><i class='bx bx-phone' style="color:#10b981; font-size:16px;"></i> <span>${p.tel}</span></div>
                        <div style="display:flex; align-items:center; gap:8px;"><i class='bx bx-envelope' style="color:#3b82f6; font-size:16px;"></i> <span>${p.email || '-'}</span></div>
                        <div style="display:flex; align-items:center; gap:8px;"><i class='bx bx-map' style="color:#e2950f; font-size:16px;"></i> <span>${p.dir || '-'}</span></div>
                    </div>
                    
                    <a href="https://wa.me/51${cleanPhone}" target="_blank" class="bh-btn-purple" style="width:100%; margin-top:20px; font-size:12px; text-decoration:none; display:flex; align-items:center; justify-content:center; gap:5px; padding:10px 0; border-radius:8px; font-weight:600;">
                        <i class='bx bxl-whatsapp' style="font-size:18px;"></i> WhatsApp de Contacto
                    </a>
                </div>`;
            }).join('');
        }

        async function guardarProveedor() {
            const nombre = document.getElementById('prov-nombre').value.trim();
            const tel = document.getElementById('prov-tel').value.trim();
            const email = document.getElementById('prov-email').value.trim();
            const dir = document.getElementById('prov-dir').value.trim();
            const cat = document.getElementById('prov-cat').value.trim();
            const fotoLink = document.getElementById('prov-foto').value;

            if (!nombre || !tel) {
                return showToast("Falta el Nombre o Teléfono del Proveedor", "warning");
            }

            const nuevo = {
                nombre,
                tel,
                email,
                dir,
                cat: cat || "General",
                foto: fotoProveedorTemporalBase64 || fotoLink || ""
            };

            proveedores.push(nuevo);
            localStorage.setItem('rafitox_proveedores', JSON.stringify(proveedores));
            renderizarProveedores();

            if (isElectron) {
                ipcRenderer.send('guardar-proveedor-db', nuevo);
            }

            document.getElementById('prov-nombre').value = '';
            document.getElementById('prov-tel').value = '';
            document.getElementById('prov-email').value = '';
            document.getElementById('prov-dir').value = '';
            document.getElementById('prov-cat').value = '';
            document.getElementById('prov-foto').value = '';
            fotoProveedorTemporalBase64 = '';

            document.getElementById('modal-proveedor').style.display = 'none';
            showToast("Proveedor registrado exitosamente", "success");
        }

        function eliminarProveedor(index) {
            if (confirm("¿Estás seguro de eliminar este proveedor?")) {
                const provEliminado = proveedores[index];
                proveedores.splice(index, 1);
                localStorage.setItem('rafitox_proveedores', JSON.stringify(proveedores));
                renderizarProveedores();

                if (isElectron && provEliminado.id) {
                    ipcRenderer.send('eliminar-proveedor-db', { id: provEliminado.id });
                }
                showToast("Proveedor eliminado", "success");
            }
        }

// --- LOGICA DE DISTRIBUIDORES (RESELLERS) ---
        function cargarResellersAdmin() {
            if(isElectron) ipcRenderer.send('obtener-resellers-admin');
        }

        if(isElectron) {
            ipcRenderer.on('resellers-admin-respuesta', (e, res) => {
                if (res.success) {
                    const tbody = document.getElementById('tabla-resellers');
                    if (tbody) {
                        if (res.data.length === 0) {
                            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:20px; color:#777;">No hay distribuidores registrados.</td></tr>';
                        } else {
                            tbody.innerHTML = res.data.map(r => `
                                <tr>
                                    <td style="display:flex; align-items:center; gap:10px; border:none; padding:12px;">
                                        <img src="${r.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(r.nombre_completo)}" style="width:30px; height:30px; border-radius:50%; object-fit:cover;">
                                        <span style="font-weight:bold; color:white;">${r.nombre_completo}</span>
                                    </td>
                                    <td style="color:#aaa;">${r.nickname}</td>
                                    <td>
                                        <span style="background:${r.estado === 'activo' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)'}; color:${r.estado === 'activo' ? '#10b981' : '#ef4444'}; padding:4px 8px; border-radius:4px; font-size:11px; font-weight:bold;">
                                            ${r.estado === 'activo' ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td style="text-align:right; padding-right:15px;">
                                        <button class="bh-btn-white" style="padding:4px 8px; font-size:12px; margin:0 3px;" onclick="editarReseller(${JSON.stringify(r).replace(/"/g, '&quot;')})">✏️ Editar</button>
                                        <button class="bh-btn-white" style="padding:4px 8px; font-size:12px; margin:0 3px; border-color:#ef4444; color:#ef4444; background:transparent;" onclick="eliminarReseller(${r.id})">🗑️ Eliminar</button>
                                    </td>
                                </tr>
                            `).join('');
                        }
                    }
                } else {
                    showToast("Error al cargar distribuidores: " + res.msg, 'danger');
                }
            });

            ipcRenderer.on('guardar-reseller-respuesta', (e, res) => {
                if (res.success) {
                    showToast(res.msg, 'success');
                    document.getElementById('modal-reseller').style.display = 'none';
                    cargarResellersAdmin();
                } else {
                    showToast("Error al guardar: " + res.msg, 'danger');
                }
            });

            ipcRenderer.on('eliminar-reseller-respuesta', (e, res) => {
                if (res.success) {
                    showToast(res.msg, 'success');
                    cargarResellersAdmin();
                } else {
                    showToast("Error al eliminar: " + res.msg, 'danger');
                }
            });
        }

        function abrirModalReseller() {
            document.getElementById('reseller-id').value = '';
            document.getElementById('reseller-nombre').value = '';
            document.getElementById('reseller-tel').value = '';
            document.getElementById('reseller-avatar').value = '';
            document.getElementById('reseller-estado').value = 'activo';
            document.getElementById('modal-reseller').style.display = 'flex';
        }

        function editarReseller(r) {
            document.getElementById('reseller-id').value = r.id;
            document.getElementById('reseller-nombre').value = r.nombre_completo;
            document.getElementById('reseller-tel').value = r.nickname;
            document.getElementById('reseller-avatar').value = r.avatar || '';
            document.getElementById('reseller-estado').value = r.estado;
            document.getElementById('modal-reseller').style.display = 'flex';
        }

        function guardarResellerAdmin() {
            const id = document.getElementById('reseller-id').value;
            const nombre = document.getElementById('reseller-nombre').value;
            const tel = document.getElementById('reseller-tel').value;
            const avatar = document.getElementById('reseller-avatar').value;
            const estado = document.getElementById('reseller-estado').value;

            if (!nombre || !tel) {
                showToast("Por favor, completa nombre y teléfono.", "warning");
                return;
            }

            const data = {
                id: id ? parseInt(id) : null,
                nombre_completo: nombre,
                nickname: tel,
                avatar: avatar || ('https://ui-avatars.com/api/?name=' + encodeURIComponent(nombre) + '&background=111&color=a78bfa'),
                estado: estado
            };

            if(isElectron) ipcRenderer.send('guardar-reseller-admin', data);
        }

        function eliminarReseller(id) {
            if (confirm("¿Estás seguro de eliminar este distribuidor de forma permanente?")) {
                if(isElectron) ipcRenderer.send('eliminar-reseller-admin', id);
            }
        }
// Al iniciar el chat, verificar que la conexión funciona:
    