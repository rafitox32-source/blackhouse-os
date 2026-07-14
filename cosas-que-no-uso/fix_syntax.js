const fs = require('fs');
const lines = fs.readFileSync('c:/Users/BLACK HOUSE/Desktop/app de rafitox/index.html', 'utf8').split('\n');
const idx = lines.findIndex(l => l.includes("ipcRenderer.on('factura-emitida-exito', (e, res) => {"));

if(idx > -1) {
    const toInsert = `        typingTimeout = setTimeout(() => { ind.style.display = 'none'; }, 2500);
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
        mensaje: \`\${emojis[nuevoEstado] || '•'} Orden <b>#\${String(ordenId).padStart(4,'0')}</b> [\${modelo}] → <b>\${nuevoEstado}</b>\`,
        tipo: 'sistema',
        canal: canal
    }]);
}
`.split('\n');
    lines.splice(idx, 0, ...toInsert);
    fs.writeFileSync('c:/Users/BLACK HOUSE/Desktop/app de rafitox/index.html', lines.join('\n'));
    console.log('Fixed syntax error!');
} else {
    console.log('Not found');
}
