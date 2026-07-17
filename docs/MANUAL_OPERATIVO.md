# 📘 Manual Operativo — BlackHouse OS

Guía de uso diario del sistema para todo el equipo. Versión 2026-07-17.

---

## 👥 Roles

| Rol | Qué puede hacer |
|---|---|
| **Dueño** | Todo: precios, costos, gastos, reportes, cierre del día, usuarios. Es el único que ve costos y márgenes, y el único que puede cerrar el día y borrar gastos. |
| **Técnico** | Recibe equipos, repara, usa repuestos, registra repuestos externos. Ve solo sus órdenes y sus clientes. No ve costos ni márgenes. |
| **Vendedora** | Vende desde la app del celular (stock y productos libres) y rinde su caja al final del día. |

> ⚠️ Cada persona debe entrar **con su propio usuario**. El sistema asigna las órdenes
> automáticamente a quien está logueado — si comparten usuario, los reportes salen mal.

---

## 🔧 TÉCNICO — Flujo de una reparación

### 1. Recibir el equipo (Recepción)
1. Escribí el nombre del cliente. **Si ya es cliente, aparece en la lista** — elegilo y el teléfono se llena solo.
2. Escribí el modelo del equipo (ej: *Samsung A15*). Si hay repuestos en stock para ese modelo,
   aparece el aviso **"✅ Tienes en stock para este modelo"** con cantidad y precio — así no
   cotizás a ciegas ni comprás algo que ya tenés.
3. Cargá falla, precio del repuesto, mano de obra, adelanto. Firma del cliente y foto.
4. La orden queda **a tu nombre automáticamente** (no hay que elegir técnico).

### 2. Reparar (Laboratorio)
- Cargá la orden por su número.
- **Repuesto del stock** → buscalo en *Stock Rápido* y tocá **Usar**. Descuenta el inventario y
  queda en la bitácora. *No cambia el precio de la orden* (el precio es el que se pactó en Recepción).
- **Repuesto que NO hay en stock** (lo traés de otro proveedor) → botón **"Repuesto externo"**:
  poné el proveedor, qué es y **cuánto pagaste**. Esto es OBLIGATORIO cada vez: es la única forma
  de que el negocio sepa a quién pagarle y cuánto ganó en esa reparación.
- Si el sistema avisa **"⚠️ margen negativo"** significa que el repuesto costó más de lo que se
  está cobrando → avisale al dueño antes de entregar.

### 3. Entregar
- Marcá la orden como **Entregado** recién cuando el cliente paga y se lleva el equipo.
  Ese momento queda registrado y el cobro cuenta para la caja de ese día.
- Emití el comprobante: **Boleta / Factura / Nota** → elegí **PDF** (para WhatsApp) o
  **Ticket** (para la tickera).

---

## 🛒 VENDEDORA — Ventas desde el celular

1. Abrí la app de ventas e ingresá con tu usuario.
2. **Producto en stock** → tocalo y se agrega a la venta (descuenta inventario solo).
3. **Producto que no está** (ej: un chip) → botón naranja **"+ No tengo en stock"**: nombre y
   precio. No toca el inventario y queda guardado para la próxima.
4. **Cobrar** → revisá el total y el medio de pago.
5. **Al final del día** → botón **📊 Cierre de caja**: muestra tu total del día. Tocá
   **"Cerrar caja del día"** y mostrale/enviale el resumen al dueño. Eso es tu rendición.

---

## 👑 DUEÑO — Control del negocio

### Durante el día
- **Registrar TODO gasto** apenas ocurre: Métricas → **"− Registrar Gasto"** (alquiler, sueldos,
  luz, compra de stock, movilidad…). Lo que no se registra, no se descuenta de la ganancia.
- Revisar el feed del taller: ahí llegan las alertas **[MARGEN]** (reparaciones que se están
  cobrando por debajo del costo) y **[AUDITORÍA]**.

### Al cargar inventario
- Cargá **costo** (lo que pagaste) y **precio** (lo que cobrás) SIEMPRE. El costo solo lo ves vos.
  Sin costo, el sistema no puede calcular la ganancia real de ese producto.

### Cada noche (5 minutos)
1. Recibí la **rendición de la vendedora** (su cierre de caja del celular).
2. Métricas → **🧾 Cierre del Día**:
   - **ENTRÓ**: adelantos de hoy + saldos de órdenes entregadas hoy + ventas de la vendedora.
   - **SALIÓ**: gastos + compras a otros proveedores + devoluciones.
   - **NETO del día** = lo que de verdad quedó.
3. Verificá que "Ventas (POS)" coincida con lo que la vendedora rindió. Si no coincide, revisá.
4. **"Guardar cierre"** → queda registrado para siempre. **"Copiar resumen"** → pegalo en WhatsApp.

### Reportes (Métricas)
- Filtros **Hoy / 7 días / Mes / Todo**.
- **Ingresos Totales** (taller + ventas, menos devoluciones).
- **Costo Repuestos (real)**: lo que costaron los repuestos usados (stock + externos).
- **Gastos Operativos** y **Ganancia Neta (real)** = margen verdadero menos gastos.
- En el Taller, cada orden muestra su **margen** (verde = ganás, rojo = perdés) — solo lo ves vos.

---

## 📏 Reglas de oro (si esto se cumple, los números siempre cuadran)

1. **Cada uno entra con SU usuario.** Nunca compartir cuentas.
2. **Todo repuesto que se usa se registra**: del stock con "Usar", de afuera con "Repuesto externo".
3. **Todo gasto se registra el mismo día.**
4. **"Entregado" se marca solo cuando el cliente pagó** y se llevó el equipo.
5. **Todo producto nuevo entra con costo y precio.**
6. **La vendedora cierra su caja todas las noches**, y el dueño hace el Cierre del Día.

---

## ❓ Problemas frecuentes

- **"No me aparece el cliente"** → escribí al menos 2 letras del nombre o el teléfono.
- **"No me sugiere el repuesto"** → el producto no tiene stock o el modelo está escrito muy
  distinto en el inventario.
- **"El ticket no imprime"** → verificá que la tickera aparezca en las impresoras de Windows.
- **"No puedo cerrar el día"** → solo el usuario con rol dueño puede.
- **La app se actualiza sola** al abrirla cuando hay versión nueva.
