const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const oldStr = `        nameEl.innerText = usuario;
        ind.style.display = 'block';
        clearTimeout(typingTimeout);
        ipcRenderer.on('factura-emitida-exito', (e, res) => {`;
        
const newStr = `        nameEl.innerText = usuario;
        ind.style.display = 'block';
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => { ind.style.display = 'none'; }, 2500);
    }
}

async function notificarChatOrden(ordenId, modelo, nuevoEstado) {
    if (!supabaseChat) return;
    const canal = 'hardware';
    const emojis = { 'Completado': '✅', 'Entregado': '📦', 'En Proceso': '🔧', 'Recibido': '📥' };
    await supabaseChat.from('chat_mensajes').insert([{
        usuario: '🤖 Sistema',
        rol: 'SISTEMA',
        mensaje: \`\${emojis[nuevoEstado] || '•'} Orden <b>#\${String(ordenId).padStart(4,'0')}</b> [\${modelo}] → <b>\${nuevoEstado}</b>\`,
        tipo: 'sistema',
        canal: canal
    }]);
}

        ipcRenderer.on('factura-emitida-exito', (e, res) => {`;

if (html.includes(oldStr)) {
    html = html.replace(oldStr, newStr);
    fs.writeFileSync('index.html', html);
    console.log('Fixed successfully');
} else {
    console.log('Could not find the target string');
}
