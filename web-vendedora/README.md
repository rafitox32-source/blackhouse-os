# POS de la Vendedora (web enlazada a la APK)

Módulo de ventas móvil para la vendedora. Es una web liviana (sin build, sin dependencias)
que se conecta a **tu mismo Supabase** y que la APK abre. Permite:

- **Vender productos de stock** → descuenta el inventario real.
- **Vender productos que NO tienes** (ej. un *chip*) → **no toca tu stock**. Queda guardado y
  la próxima vez ya aparece listo para vender con el precio que se usó.
- **Cierre de caja** → total de las ventas del día (efectivo / otros medios + detalle por producto).

---

## 1. Aplicar la base de datos (una sola vez)

1. Entra a **Supabase → SQL Editor**.
2. Copia y ejecuta el archivo [`scripts/sql/migrations/006_pos_ventas.sql`](../scripts/sql/migrations/006_pos_ventas.sql).
   Crea las tablas (`ventas_pos`, `ventas_pos_items`, `productos_venta_libre`, `cierres_caja`,
   `pos_sesiones`) y las funciones seguras `pos_login`, `pos_productos`, `pos_registrar_venta`,
   `pos_cierre_caja`.

> La web **no** usa la clave secreta. Solo puede llamar a esas 4 funciones, y la empresa se
> resuelve del lado del servidor con el token del login, así que una vendedora nunca ve ni
> modifica datos de otra empresa.

## 2. Configurar la clave pública

Edita [`config.js`](config.js) y pega tu **anon key** (clave pública):

- Supabase → **Project Settings → API → Project API keys → `anon` `public`**.

```js
window.POS_CONFIG = {
  SUPABASE_URL: "https://flfhpffslhjcuvhxsnjz.supabase.co",
  SUPABASE_ANON_KEY: "eyJ...tu_anon_key...",   // ⚠️ la ANON, NO la secret/service_role
  MONEDA: "$",
};
```

## 3. Crear el usuario de la vendedora

En tu tabla `usuarios`, la vendedora debe tener **`rol = 'vendedor'`** (o `vendedora`) y
`estado = 'activo'`. Entra con ese usuario y contraseña. Los dueños (`dueno`) también pueden entrar.

## 4. Publicar la web y apuntar la APK

Sube la carpeta `web-vendedora/` a cualquier hosting estático gratis:

- **Vercel / Netlify:** arrastra la carpeta o conéctala al repo. Te da una URL tipo
  `https://tutienda.vercel.app`.
- **GitHub Pages:** activa Pages sobre esta carpeta.

Luego, en tu **APK**, apunta la URL (WebView / configuración) a esa dirección. La APK abre la web
y la vendedora ya opera desde el celular. También puede abrirse directo en el navegador Android e
**“Instalar app”** (es PWA).

### Probar en tu PC antes de publicar

```bash
cd web-vendedora
python -m http.server 5500
# abre http://localhost:5500
```

(Se necesita un servidor; abrir el `index.html` con doble clic no permite el service worker.)

---

## Cómo funciona la venta libre (sin stock)

- Botón **“+ No tengo en stock”** → nombre + precio → se agrega a la venta.
- Al cobrar, ese producto se guarda en `productos_venta_libre` (por empresa, sin duplicar nombre)
  y **no se crea ni descuenta inventario**.
- La próxima vez aparece arriba en la lista (marcado *“sin stock”*) para venderlo de nuevo. Si le
  cambias el precio en una venta, se actualiza al último precio usado.

## Cierre de caja

- Botón **📊** arriba a la derecha → muestra el total del día (previsualización).
- **“Cerrar caja del día”** guarda un registro en `cierres_caja` y marca las ventas como cerradas.
- **“Compartir / Imprimir”** manda el resumen por WhatsApp u otra app (usa el compartir del sistema).

## Notas de seguridad

- La `anon key` es pública a propósito; la protección real está en las funciones `pos_*` + RLS.
- Nunca pongas la `service_role` / `sb_secret_...` en `config.js` ni en la APK.
- Los tokens de sesión del POS duran 12 h. Para limpiar los vencidos:
  `DELETE FROM public.pos_sesiones WHERE expira_en < now();`
