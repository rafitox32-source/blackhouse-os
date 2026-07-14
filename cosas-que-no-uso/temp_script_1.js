
// ========= TALLER SEARCH & FILTER =========
function filtrarTablaTaller() {
    const term = document.getElementById('taller-search').value.toLowerCase();
    const rows = document.querySelectorAll('#tabla-servicios tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(term) ? '' : 'none';
    });
}

let tallerFilterEstado = 'todos';
function filtrarTallerPorEstado(estado) {
    tallerFilterEstado = estado;
    const rows = document.querySelectorAll('#tabla-servicios tr');
    rows.forEach(row => {
        if (estado === 'todos') {
            row.style.display = '';
        } else {
            const rowText = row.textContent.toLowerCase();
            row.style.display = rowText.includes(estado.toLowerCase()) ? '' : 'none';
        }
    });
}

function actualizarKPIsTaller() {
    const rows = document.querySelectorAll('#tabla-servicios tr');
    let pendientes = 0, reparacion = 0, listos = 0, entregados = 0;
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes('pendiente')) pendientes++;
        if (text.includes('en reparación') || text.includes('reparación') || text.includes('reparacion')) reparacion++;
        if (text.includes('listo')) listos++;
        if (text.includes('entregado')) entregados++;
    });
    const pe = document.getElementById('kpi-pendientes'); if(pe) pe.textContent = pendientes;
    const re = document.getElementById('kpi-reparacion'); if(re) re.textContent = reparacion;
    const li = document.getElementById('kpi-listos'); if(li) li.textContent = listos;
    const en = document.getElementById('kpi-entregados'); if(en) en.textContent = entregados;
}

// Call KPI update after table is populated
const origObserver = new MutationObserver(() => { actualizarKPIsTaller(); });
document.addEventListener('DOMContentLoaded', () => {
    const ts = document.getElementById('tabla-servicios');
    if(ts) origObserver.observe(ts, { childList: true });
});

// ========= CLIENTES SEARCH =========
function filtrarTablaClientes() {
    const term = document.getElementById('clientes-search').value.toLowerCase();
    const rows = document.querySelectorAll('#tabla-clientes tr');
    let visible = 0;
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const show = text.includes(term);
        row.style.display = show ? '' : 'none';
        if (show) visible++;
    });
}

function actualizarKPIClientes() {
    const rows = document.querySelectorAll('#tabla-clientes tr');
    const tc = document.getElementById('kpi-total-clientes'); if(tc) tc.textContent = rows.length;
}

const clienteObserver = new MutationObserver(() => { actualizarKPIClientes(); });
document.addEventListener('DOMContentLoaded', () => {
    const tc = document.getElementById('tabla-clientes');
    if(tc) clienteObserver.observe(tc, { childList: true });
});

// ========= AGENDA FUNCTIONS =========
function abrirModalEvento() {
    document.getElementById('modal-evento').style.display = 'flex';
}

function guardarEvento() {
    const titulo = document.getElementById('evento-titulo').value;
    const dia = document.getElementById('evento-dia').value;
    const hora = document.getElementById('evento-hora').value;
    const tipo = document.getElementById('evento-tipo').value;
    
    if (!titulo) { showToast('Escribe un título', 'error'); return; }

    const colores = { entrega: 'var(--success)', reparacion: 'var(--warning)', revision: 'var(--info)', cita: 'var(--bh-purple)' };
    const color = colores[tipo] || 'var(--bh-purple)';

    const grid = document.getElementById('agenda-grid-dynamic');
    const dias = grid.querySelectorAll('.cal-day');
    const diasNombres = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const idx = diasNombres.indexOf(dia);
    
    if (idx >= 0 && dias[idx]) {
        const sinEventos = dias[idx].querySelector('div[style*="text-align: center"]');
        if (sinEventos) sinEventos.remove();
        
        const ev = document.createElement('div');
        ev.className = 'cal-event';
        ev.style = 'border-left:3px solid ' + color + '; padding-left:8px; cursor:pointer;';
        ev.textContent = hora + ' - ' + titulo;
        ev.onclick = function() { if(confirm('¿Eliminar este evento?')) ev.remove(); };
        dias[idx].appendChild(ev);
    }

    document.getElementById('modal-evento').style.display = 'none';
    document.getElementById('evento-titulo').value = '';
    showToast('Evento agregado: ' + titulo, 'success');
}

let semanaOffset = 0;
function navegarSemana(dir) {
    semanaOffset += dir;
    const label = document.getElementById('agenda-semana-label');
    if (semanaOffset === 0) label.textContent = 'Esta semana';
    else if (semanaOffset > 0) label.textContent = 'En ' + semanaOffset + ' semana' + (semanaOffset > 1 ? 's' : '');
    else label.textContent = 'Hace ' + Math.abs(semanaOffset) + ' semana' + (Math.abs(semanaOffset) > 1 ? 's' : '');
}
