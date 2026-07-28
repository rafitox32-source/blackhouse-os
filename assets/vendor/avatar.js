/* Avatares generados aquí mismo, sin salir a internet.
 *
 * Antes cada avatar era una imagen pedida a ui-avatars.com, y en la dirección iba el
 * NOMBRE DEL CLIENTE. Es decir: cada vez que se abría la lista de clientes le estábamos
 * enviando a un servidor ajeno la cartera de clientes del taller, uno por uno. Además, sin
 * internet no se veía ningún avatar.
 *
 * Esto dibuja lo mismo con un SVG en memoria: mismas iniciales, mismos colores, sin red.
 *
 *   avatarLocal('Juan Perez')                              -> color según el nombre
 *   avatarLocal('Juan Perez', { fondo: '7c3aed' })          -> color fijo (con o sin #)
 *   avatarLocal('Juan Perez', { fondo: '7c3aed', texto: 'fff', tam: 64 })
 *
 * Devuelve un data: URI listo para poner en el src de un <img>.
 */
(function (global) {
    'use strict';

    // Los mismos tonos que se veían con background=random, pero elegidos de forma estable:
    // el mismo nombre da siempre el mismo color, así el avatar de un cliente no cambia
    // cada vez que se recarga la lista.
    var PALETA = [
        '7c3aed', '2563eb', '0891b2', '059669', '65a30d',
        'ca8a04', 'ea580c', 'dc2626', 'db2777', '9333ea',
        '4f46e5', '0d9488'
    ];

    function limpiarNombre(valor) {
        return String(valor == null ? '' : valor)
            .replace(/[<>&"']/g, ' ')      // nada de caracteres que rompan el SVG
            .replace(/\s+/g, ' ')
            .trim();
    }

    // Dos iniciales como máximo, igual que hacía ui-avatars.
    function iniciales(nombre) {
        var partes = nombre.split(' ').filter(Boolean);
        if (!partes.length) return '?';
        if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
        return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
    }

    function huella(texto) {
        var h = 0;
        for (var i = 0; i < texto.length; i++) {
            h = ((h << 5) - h + texto.charCodeAt(i)) | 0;
        }
        return Math.abs(h);
    }

    // Un color solo se acepta si es hexadecimal de verdad. Cualquier otra cosa
    // (incluido "random") se ignora y se usa el color derivado del nombre.
    function colorValido(valor) {
        var v = String(valor == null ? '' : valor).replace(/^#/, '').trim();
        return /^(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v) ? v : null;
    }

    function avatarLocal(nombre, opciones) {
        var opts = opciones || {};
        var limpio = limpiarNombre(nombre) || '?';
        var letras = iniciales(limpio);
        var tam = parseInt(opts.tam, 10);
        if (!(tam > 0 && tam <= 512)) tam = 128;

        var fondo = colorValido(opts.fondo) || PALETA[huella(limpio) % PALETA.length];
        var texto = colorValido(opts.texto) || 'ffffff';

        // Comillas simples y atributos justos: este texto termina guardado en la base
        // (por ejemplo en el avatar de cada mensaje del chat), así que cuanto más corto mejor.
        // La fuente va por familia genérica: un SVG dentro de un <img> se dibuja aislado
        // y no ve las fuentes de la página.
        var svg =
            "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 128 128' width='" + tam +
            "' height='" + tam + "'>" +
            "<rect width='128' height='128' fill='#" + fondo + "'/>" +
            "<text x='64' y='64' fill='#" + texto + "' font-family='Arial,sans-serif' font-size='" +
            (letras.length > 1 ? 52 : 60) + "' font-weight='700' text-anchor='middle' " +
            "dominant-baseline='central'>" + letras + "</text></svg>";

        // En un data: URI solo hacen falta escapar estos: % (el propio escape), # (corta la
        // dirección), < y > (rompen el atributo si alguien lo mete en HTML), las comillas
        // dobles y el espacio (una URL no debe llevar espacios sueltos).
        // Los acentos y la ñ van codificados aparte: "Ñandú" es un nombre normal aquí y una
        // letra suelta fuera del ASCII dentro de una dirección da problemas.
        var seguro = svg.replace(/[%#<>" ]|[^\x20-\x7E]/g, function (c) {
            return c.charCodeAt(0) > 126 ? encodeURIComponent(c)
                : '%' + c.charCodeAt(0).toString(16).toUpperCase();
        });
        return 'data:image/svg+xml;charset=utf-8,' + seguro;
    }

    global.avatarLocal = avatarLocal;
})(typeof window !== 'undefined' ? window : this);
