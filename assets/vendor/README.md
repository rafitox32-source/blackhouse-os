# assets/vendor — librerías incluidas dentro del programa

Todo lo que hay aquí antes se pedía a internet (cdn.jsdelivr.net, cdnjs, fonts.googleapis.com).
Eso tenía dos problemas:

1. **Sin internet la app se veía rota.** Sin iconos, sin la tipografía, y varias pantallas
   directamente no funcionaban porque su librería nunca llegaba a cargar.
2. **Le contábamos a terceros quién usa el programa.** Cada arranque avisaba a Google, a
   jsDelivr y a Cloudflare. Peor: los avatares se pedían a `ui-avatars.com` poniendo el
   **nombre del cliente en la dirección**, así que abrir la lista de clientes le enviaba la
   cartera del taller, cliente por cliente, a un servidor ajeno. Eso ya no ocurre
   (ver `avatar.js`).

Ahora lo único que sale a la red es Supabase, que es la base de datos del taller.

---

## De dónde salió cada archivo

Todos se bajaron con `npm pack <paquete>@<version>` y se copiaron tal cual desde el `dist`
del paquete. No están modificados, con una sola excepción anotada abajo.

| Archivo | Paquete npm | Versión | Ruta dentro del paquete |
|---|---|---|---|
| `js/chart.min.js` | `chart.js` | 4.4.1 | `dist/chart.umd.js` |
| `js/qrcode.min.js` | `qrcodejs` | 1.0.0 | `qrcode.min.js` |
| `js/html2canvas.min.js` | `html2canvas` | 1.4.1 | `dist/html2canvas.min.js` |
| `js/JsBarcode.all.min.js` | `jsbarcode` | 3.11.5 | `dist/JsBarcode.all.min.js` |
| `js/supabase.min.js` | `@supabase/supabase-js` | 2.x | `dist/umd/supabase.js` |
| `js/xlsx.full.min.js` | `xlsx` | 0.18.5 | `dist/xlsx.full.min.js` |
| `js/zxing.min.js` | `@zxing/library` | 0.21.3 | `umd/index.min.js` |
| `js/intro.min.js` | `intro.js` | 7.2.0 | `minified/intro.min.js` |
| `css/introjs.min.css` | `intro.js` | 7.2.0 | `minified/introjs.min.css` |
| `css/boxicons.min.css` + `fonts/boxicons.woff2` | `boxicons` | 2.1.4 | `css/` y `fonts/` |
| `fonts/inter-latin-*-normal.woff2` | `@fontsource/inter` | 5.0.16 | `files/` (subconjunto latin) |

**Único archivo tocado:** `css/boxicons.min.css`. Su `@font-face` original listaba cinco
formatos (`.eot`, `.woff2`, `.woff`, `.ttf`, `.svg`). Solo se empaquetó el `.woff2`, que es el
que usa Chromium, así que se recortó la lista para que no queden peticiones a archivos que no
existen. Nada más cambió.

`css/fuentes.css` sí es nuestro: son los seis `@font-face` de Inter (pesos 300 a 800) apuntando
a los `.woff2` de `fonts/`. Antes esto lo generaba `fonts.googleapis.com`.

`avatar.js` también es nuestro: reemplaza a `ui-avatars.com`, dibujando las iniciales en un SVG
en memoria. Mismo aspecto, sin red.

`three/` ya estaba local de antes.

---

## Dos versiones que antes flotaban y ahora están fijas

El `index.html` cargaba:

- `cdn.jsdelivr.net/npm/chart.js` — **sin número de versión**
- `cdn.jsdelivr.net/npm/@zxing/library@latest` — con `@latest`

O sea que el programa se actualizaba solo cada vez que esas librerías sacaban una versión
nueva, sin que nosotros lo supiéramos, y una versión mayor podía romper los gráficos o el
lector de códigos de un día para otro sin que hubiéramos tocado nada. Quedaron fijas en las
versiones que se estaban usando: **Chart.js 4.4.1** y **@zxing/library 0.21.3**.

---

## Cómo actualizar alguna

```bash
npm pack chart.js@4.5.0
tar -xzf chart.js-4.5.0.tgz
cp package/dist/chart.umd.js assets/vendor/js/chart.min.js
```

Y actualizar la versión en la tabla de arriba. No cambiar el nombre del archivo: el
`index.html` lo busca por ese nombre.
