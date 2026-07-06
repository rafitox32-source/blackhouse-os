// currency.js
let globalCurrency = localStorage.getItem('bh_currency') || 'S/';

function setGlobalCurrency(symbol) {
    globalCurrency = symbol;
    localStorage.setItem('bh_currency', symbol);
    
    if(typeof cargarDashboard === 'function') cargarDashboard();
    if(typeof cargarOrdenes === 'function') cargarOrdenes();
    if(typeof cargarInventario === 'function') cargarInventario();
    
    if (typeof showToast === 'function') {
        showToast('Moneda actualizada a ' + symbol, 'success');
    } else {
        alert('Moneda actualizada a ' + symbol);
    }
}

function formatearMoneda(monto) {
    const numero = parseFloat(monto) || 0;
    return `${globalCurrency} ${numero.toFixed(2)}`;
}

document.addEventListener('DOMContentLoaded', () => {
    const currencySelect = document.getElementById('config-currency-input');
    if (currencySelect) {
        currencySelect.value = globalCurrency;
    }
});
