# Plan de trabajo — Lógica de dinero, ventas y reportes (BlackHouse OS)

> Documento de análisis + plan para reorganizar cómo el sistema maneja el dinero.
> Creado el 2026-07-17. Sirve para retomar el trabajo en otra sesión sin re-investigar.
> Proyecto Supabase: `flfhpffslhjcuvhxsnjz`. App: Electron (`main.js` backend, `index.html` renderer).

---

## 1. Objetivo

El dueño siente que "todo está desordenado" con el dinero. Dos dolores concretos:
1. **Control de costos:** el técnico pone el precio de la reparación (a veces cobra de menos) y
   **el sistema no guarda cuánto costó el repuesto**, así que no hay margen real ni control.
2. **Reportes de gastos desordenados:** el dinero está repartido en muchas "cajas" separadas que
   no se suman en un solo lugar. No existe módulo de gastos operativos.

Contexto clave del negocio: **el repuesto puede salir del stock propio O traerse de otro proveedor**
cuando no hay stock. Ambos casos deben registrar el costo real y atarse a la orden.

---

## 2. Estado actual — cómo se maneja el dinero HOY

### 2.1 Las 7 "cajas" separadas (raíz del desorden)

| Fuente de dinero | Tabla | ¿Entra al reporte "Métricas"? |
|---|---|---|
| Órdenes de reparación (costo, adelanto, repuesto, servicio) | `ordenes` | ✅ Sí (única) |
| Comprobantes (Boleta/Factura) | `facturas` | ❌ No |
| Ventas del POS (vendedora) | `ventas_pos` / `cierres_caja` | ❌ No |
| Compras a otros proveedores (repuesto externo) | `compras_externas` | ❌ No |
| Costo del inventario (lo pagado por el stock) | `productos.costo` / `movimientos_stock` | ❌ No |
| Devoluciones / reembolsos | `devoluciones` | ❌ No |
| Gastos operativos (alquiler, luz, sueldos, etc.) | **NO EXISTE** | ❌ No existe |

El reporte solo mira `ordenes`. Todo lo demás son islas.

### 2.2 Cómo se calcula el reporte hoy (EL ERROR DE FONDO)

Archivo: **`main.js` → `ipcMain.on('obtener-datos-reporte')` (aprox. líneas 1337–1392).**

```
totalIngresos  = por orden: si estado 'Entregado' -> costo total ; si no -> solo adelanto
totalGastos    = suma de precio_repuesto de órdenes 'Entregado'   ← ❌ MAL
totalGanancias = suma de precio_servicio de órdenes 'Entregado'   ← ❌ MAL
```

- **`totalGastos` ("Inversión (Repuestos)") NO es un costo:** usa `precio_repuesto` = lo que se
  COBRÓ por el repuesto, no lo que se PAGÓ. Número inútil para saber margen.
- **`totalGanancias` ("Ganancia Neta") es solo la mano de obra** (`precio_servicio`). No resta el
  costo del repuesto ni ningún gasto. No es ganancia real.
- **El filtro "Hoy" no filtra:** la query trae TODAS las órdenes (sin rango de fecha).
- Render de KPIs en el renderer: `index.html` handler `datos-reporte` (aprox. líneas 5012–5033).
- Vista de reportes (HTML): `index.html` `#reportes` (aprox. líneas 2510–2567).

### 2.3 Dónde se define el dinero de una orden

Archivo: **`index.html` → `guardarOrden()` (aprox. líneas 4695–4718).**
Campos de la orden: `precio_repuesto`, `precio_servicio`, `costo` (=repuesto+servicio),
`adelanto`, `saldo`. Los ingresa quien crea la orden (hoy: el técnico logueado, auto-asignado).
- `calcularTotal()` (index.html ~4633): `costo = cost-part + cost-service`.
- **No hay campo de "costo real del repuesto" en la orden.** Ese es el hueco central.
- No hay piso de precio ni control de margen. El técnico fija precios libremente.

### 2.4 Repuestos: stock vs externo (ya parcialmente resuelto esta sesión)

- **Usar repuesto del stock:** `main.js` `ipcMain.on('usar-repuesto-lab')` (~2009–2071).
  Ya corregido: **solo descuenta stock + anota en bitácora, ya NO suma el precio a la orden.**
  PERO todavía **no guarda el costo real** (`productos.costo`) en la orden.
- **Repuesto externo (traído de otro proveedor):** tabla `compras_externas`
  (migración `scripts/sql/migrations/007_compras_externas.sql`, YA aplicada).
  Columnas: `id, empresa_id, orden_id (text), proveedor, descripcion, costo, usuario, creado_en`.
  Handlers: `main.js` `registrar-repuesto-externo` y `obtener-compras-externas-dia`.
  UI: botón "Repuesto externo" + reporte "Compras del día" en el laboratorio.
  **Ya ata el costo externo a la orden (`orden_id`)** — base lista para el cálculo de margen.

### 2.5 Otras tablas de dinero relevantes

- `productos`: `costo` (lo pagado; oculto para rol ≠ dueño), `precio` (venta), `stock`.
- `facturas`: comprobantes emitidos (numero_comprobante, tipo, monto_total, items_json, orden_id).
- `ventas_pos` + `ventas_pos_items` + `cierres_caja`: POS de la vendedora (migración 006).
- `movimientos_stock`: `empresa_id (text), sku, cantidad, proveedor, costo, nota, creado_en`.
- `devoluciones`: reembolsos/notas de crédito (migración 005).

### 2.6 Roles

- `dueno`, `vendedor`, `tecnico`. El técnico ve solo sus órdenes (`obtener-ordenes` filtra por
  `tecnico_id = usuarioActual`, main.js ~1303). El `costo` de productos se oculta a no-dueños.
  Pero el **precio de las órdenes no tiene control por rol**.

---

## 3. Problemas detectados (resumen)

1. **No se guarda el costo real del repuesto en la orden** → margen imposible de calcular.
2. **KPI de gastos/ganancia mal calculados** (usan precio cobrado, no costo real).
3. **Sin módulo de gastos operativos** → "ganancia neta" nunca puede ser real.
4. **Ingresos incompletos:** el reporte ignora POS, facturas y devoluciones.
5. **Fuentes de dinero sin unificar** → no hay un "libro de caja" único.
6. **Sin control al técnico:** puede cobrar por debajo del costo sin aviso.
7. **Reportes sin filtro por período** (el "Hoy" no funciona).

---

## 4. Arquitectura objetivo (cómo DEBERÍA ser)

**Regla de oro:** cada venta/orden registra SIEMPRE tres números:
**Precio** (lo que cobrás) · **Costo** (lo que te costó) · **Ganancia** (precio − costo).

1. **Costo automático, no manual.** Al usar un repuesto:
   - del stock → costo = `productos.costo` (se copia a la orden).
   - externo → costo = `compras_externas.costo` (ya atado por `orden_id`).
   La orden acumula `costo_repuesto_real` sumando ambas fuentes.
2. **Margen por orden:** `ganancia = (precio_repuesto − costo_repuesto_real) + precio_servicio`.
3. **Módulo de Gastos operativos** (tabla nueva `gastos`): alquiler, sueldos, luz, publicidad,
   compras a proveedores. Con categoría, fecha, monto, usuario.
4. **Libro de caja único** (a mediano plazo): tabla `movimientos_financieros` (ingreso/egreso,
   categoría, monto, fecha, referencia a orden/venta/gasto). Todas las cajas caen ahí.
5. **Reporte unificado y por período:**
   `Ingresos (órdenes + POS + accesorios) − Costos (repuestos propios + externos) − Gastos
   operativos = Ganancia real`, filtrable por día/semana/mes.
6. **Control del técnico:** aviso/bloqueo si el precio del repuesto queda debajo del costo;
   costo obligatorio antes de cerrar una orden con repuesto externo.
7. **Cierre de caja único del día:** junta órdenes cobradas + ventas POS − gastos − compras
   externas = neto del día.

---

## 5. PLAN DE TRABAJO (por fases, priorizado)

### FASE 1 — Costo real del repuesto en la orden  ✅ HECHA (2026-07-17)
- [x] Columna `costo_repuesto_real` en `ordenes` → **migración `008_costo_real_y_gastos.sql`** (APLICAR EN SUPABASE).
- [x] `usar-repuesto-lab`: suma `productos.costo` a `ordenes.costo_repuesto_real` (update tolerante si falta la 008).
- [x] `registrar-repuesto-externo`: suma el costo externo a `costo_repuesto_real`.
- [ ] (Opcional) Campo manual "costo del repuesto" en la orden para casos sin registro.

### FASE 2 — Corregir el reporte de ganancia  ✅ HECHA (2026-07-17)
- [x] `obtener-datos-reporte` reescrito: ganancia = (precio_repuesto − costo_repuesto_real) + precio_servicio.
- [x] KPI renombrado a "Costo Repuestos (real)".
- [x] Margen por orden en el listado del taller (verde/rojo, solo visible para el dueño). ✅ 2026-07-17

### FASE 3 — Módulo de Gastos operativos  ✅ HECHA (2026-07-17)
- [x] Tabla `gastos` (en migración 008) + handlers `registrar-gasto`/`eliminar-gasto` (solo dueño elimina).
- [x] UI: botón "− Registrar Gasto" en Métricas + modal + lista "Gastos del período" con eliminar.
- [x] Los gastos del período se restan de la Ganancia Neta.

### FASE 4 — Reporte unificado + período  ✅ HECHA en su mayoría (2026-07-17)
- [x] Ingresos de POS sumados (con su costo real vía ventas_pos_items × productos.costo).
- [x] Filtro por período funcional (Hoy / 7 días / Mes / Todo) — botones en la vista Métricas.
- [x] Tablero: Ingresos (taller+POS) − Costo repuestos − Gastos = Ganancia real; KPI nuevo "Gastos Operativos"; desglose taller/ventas bajo Ingresos.
- [x] Devoluciones en efectivo restadas de ingresos y ganancia (con desglose bajo Ingresos). ✅ 2026-07-17

> Migración 008 APLICADA en Supabase el 2026-07-17 (verificado por REST).

### FASE 5 — Control del técnico  ✅ HECHA (aviso, 2026-07-17)
- [x] Aviso si `precio_repuesto < costo_repuesto_real`: al usar repuesto de stock o registrar uno
      externo, si el costo real acumulado supera lo cobrado, toast de advertencia + alerta
      [MARGEN] en el feed gerencial (`avisarMargenNegativo` reusa `enviarAlertaGerencial`).
      Se eligió avisar (no bloquear): el repuesto ya se usó; el dueño decide corregir el precio.
- [ ] (Opcional) que el precio del repuesto lo sugiera el sistema desde el inventario.

### FASE 6 — Libro de caja único  ✅ HECHA (2026-07-17)
- [x] **Migración `009_cierre_dia.sql`** (APLICAR EN SUPABASE): `ordenes.fecha_entregado`
      (sello de cuándo se entregó → qué día se cobró el saldo; lo pone actualizar-estado-orden)
      + tabla `cierres_dia` (snapshot inmutable por día = el "libro de caja").
- [x] Handler `obtener-cierre-dia`: unifica en una foto ENTRÓ (adelantos de órdenes creadas hoy
      + saldos de órdenes entregadas hoy + ventas POS) − SALIÓ (gastos + compras externas +
      devoluciones efectivo) = NETO. Con registrar=true guarda en cierres_dia (solo dueño).
- [x] UI: botón "🧾 Cierre del Día" en Métricas → modal con desglose, guardar cierre y copiar
      resumen (para WhatsApp). Todas las consultas tolerantes a migraciones faltantes.
- Nota: se optó por unificación en lectura + snapshot diario en vez de una tabla
  movimientos_financieros con doble escritura (menos riesgo de descuadre).

---

## 6. Notas técnicas para retomar (evitan re-investigar)

- **Backend** usa la `service_role` key (bypassa RLS); autorización en capa app por `rolActual`.
- **No se puede correr DDL desde la API** (ni service key). Las migraciones se aplican a mano en
  Supabase → SQL Editor. Patrón del repo: `scripts/sql/migrations/00X_*.sql`.
- **PL/pgSQL gotcha de esta instancia:** evitar `SELECT col INTO var FROM tabla`; usar
  `var := (SELECT ...)`. (Ver migración 006, que ya lo aplica.)
- **CI/CD:** al pushear a `main`, GitHub Actions corre semantic-release + electron-builder y publica
  el instalador `.exe` en Releases automáticamente.
- **Push/merge a `main` a veces bloqueado** por el clasificador del entorno; puede requerir que el
  dueño lo haga o reintentar.
- Empresa de prueba principal en datos reales: `empresa_id = 6` (pantallas).

## 6b. POS REAL de la vendedora (descubierto 2026-07-17) — INTEGRADO

La vendedora YA vendía desde una APK que abre
`https://blackhouse-os-web.vercel.app/panel-vendedor.html` ("BlackHouse OS | Ventas") — un POS
web aparte (proyecto Vercel separado, no está en este repo) que llama al RPC
`registrar_venta_movil`. Ese RPC solo descontaba stock + movimientos_stock: las ventas no
registraban importe y eran invisibles para el módulo financiero.

**Solución aplicada (migración 010, YA en producción y probada):** se reemplazó el RPC
manteniendo firma y lógica intactas, agregando el insert en `ventas_pos`/`ventas_pos_items`
(precio = productos.precio, vendedor parseado de la nota, medio 'efectivo'). Sin tocar la APK ni
la web. Desde ahora sus ventas alimentan Métricas, Cierre del Día y el Excel.

- Limitación: su POS no envía medio de pago → todo entra como 'efectivo'. Mejora futura: agregar
  selector de pago en panel-vendedor.html (vive en el proyecto Vercel, no en este repo).
- La carpeta `web-vendedora/` de este repo queda como alternativa/upgrade opcional (tiene venta
  libre y cierre de caja propios) — YA NO es necesario publicarla para que ella venda.

## 7. Estado de lo YA hecho esta sesión (contexto)

- ✅ POS de la vendedora (web `web-vendedora/` + migración 006 `pos_ventas`) — aplicado.
- ✅ Precios de pantallas empresa 6 (260 por script, ~80 a mano pendientes).
- ✅ Técnico automático según login (sin selector).
- ✅ Usar repuesto del stock ya no infla el total de la orden.
- ✅ Repuesto externo + reporte "Compras del día" (migración 007 `compras_externas`) — aplicado.
- ✅ Comprobante PDF real / Ticket 80mm.
- ✅ Publicado en versión 1.9.0 (instalador en GitHub Releases).

**Próximo paso recomendado:** empezar por **FASE 1 + FASE 2** (costo real + ganancia correcta),
que es lo que más plata está costando hoy y no rompe lo existente.

---

## 8. Mejoras de flujo al crear la orden (pedido 2026-07-17)

Dos dolores del dueño. En AMBOS **la base ya existe; falta conectarla al formulario de orden.**

> 8.1 y 8.2 IMPLEMENTADAS el 2026-07-17: handler `buscar-clientes` + datalist en `#cli`
> (autocompleta teléfono al elegir), y handler `sugerir-stock-modelo` + hint bajo `#mod`
> ("✅ Tienes en stock para este modelo" con stock y precio). Detalle original abajo.

### 8.1 Reconocer al cliente ya registrado (hoy se reescriben datos)
- Existe tabla `clientes` + handlers `guardar-cliente` / `obtener-clientes` (main.js ~507-527).
- El campo "Cliente" del formulario (`index.html` `#cli`, ~línea 2007) NO tiene búsqueda: es texto
  plano. Por eso no reconoce clientes existentes.
- **Tarea:** agregar autocompletado en `#cli` (y/o por teléfono `#tel`) contra `clientes`; al
  elegir uno, autocompletar nombre + teléfono (y opcional: mostrar su historial de órdenes).
  Handler nuevo tipo `buscar-clientes` (ILIKE por nombre/teléfono, filtrado por `empresa_id`).

### 8.2 Recomendar el stock según el modelo del equipo (hoy busca a mano)
- Los productos (Pantallas/Micas) ya tienen `modelo_compatible` + `grupos_compatibilidad`, y existe
  `normalizarModeloCompat()` en main.js para emparejar modelos.
- No hay nada que, al ingresar el modelo del equipo en la orden, muestre el stock compatible.
- **Tarea:** al escribir/elegir el modelo (`#mod`), consultar `productos` de la empresa cuyas
  `modelo_compatible` (normalizadas) coincidan con el modelo, y mostrar debajo un aviso tipo
  "✅ En stock: Pantalla [modelo] — N unid., S/ precio", con opción de usarla directo en la orden.
  Handler nuevo tipo `sugerir-stock-modelo`. Reusar `normalizarModeloCompat` y el matching por grupo.

**Esfuerzo:** medio, bajo riesgo (solo agrega; no cambia la lógica de dinero). Buen candidato para
hacer junto o después de la Fase 1.
