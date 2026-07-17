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

### FASE 1 — Costo real del repuesto en la orden  *(impacto alto, esfuerzo bajo)*
- [ ] Agregar columna `costo_repuesto_real numeric DEFAULT 0` a `ordenes` (migración SQL nueva).
- [ ] En `usar-repuesto-lab` (main.js ~2009): al descontar stock, sumar `productos.costo` a
      `ordenes.costo_repuesto_real` de esa orden.
- [ ] En `registrar-repuesto-externo` (main.js): sumar el `costo` externo a
      `ordenes.costo_repuesto_real` de la orden indicada (además de guardarlo en compras_externas).
- [ ] (Opcional) Campo manual "costo del repuesto" en la orden para casos sin stock ni registro.

### FASE 2 — Corregir el reporte de ganancia  *(impacto alto)*
- [ ] En `obtener-datos-reporte` (main.js ~1337): cambiar el cálculo:
      `costoReal = costo_repuesto_real` (no precio_repuesto);
      `ganancia = (precio_repuesto − costo_repuesto_real) + precio_servicio`.
- [ ] Renombrar KPI "Inversión (Repuestos)" → "Costo de repuestos" y que muestre el costo real.
- [ ] Mostrar **margen por orden** en el listado del taller (verde/rojo).

### FASE 3 — Módulo de Gastos operativos  *(necesario para ganancia real)*
- [ ] Tabla `gastos` (empresa_id, categoria, descripcion, monto, fecha, usuario, creado_en) + RLS.
- [ ] UI: vista "Gastos" con alta rápida y lista por categoría.
- [ ] Restar los gastos del período a la ganancia en el reporte.

### FASE 4 — Reporte unificado + período  *(ordena todo)*
- [ ] Sumar ingresos de POS (`ventas_pos`) y restar devoluciones al reporte.
- [ ] Hacer que el filtro por fecha funcione (Hoy / Semana / Mes).
- [ ] Un tablero: Ingresos − Costos − Gastos = Ganancia real, por período.

### FASE 5 — Control del técnico  *(evita fugas)*
- [ ] Aviso/bloqueo si `precio_repuesto < costo_repuesto_real`.
- [ ] Costo obligatorio antes de cerrar orden con repuesto externo.
- [ ] (Opcional) que el precio del repuesto lo sugiera el sistema desde el inventario.

### FASE 6 — Libro de caja único  *(ideal, mediano plazo)*
- [ ] Tabla `movimientos_financieros` que consolide todas las fuentes.
- [ ] Cierre de caja diario unificado (taller + POS − gastos).

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
