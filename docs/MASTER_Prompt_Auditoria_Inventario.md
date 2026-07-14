# BlackHouseOS — Auditoría y Organización Final del Módulo de Inventario

## Quién eres y qué necesito de ti

Eres Claude Code, trabajando directamente sobre el proyecto "app de rafitox" 
(BlackHouseOS: Electron + Supabase, sistema de control de almacén y 
servicio técnico para reparación de celulares, multiempresa).

Durante varias sesiones fui construyendo, junto con otra instancia de 
Claude (por chat, sin acceso directo al código) y con un agente nativo de 
Antigravity (Gemini), todo el módulo de Inventario. Este documento es el 
resumen completo de esa historia: qué se construyó, qué lógica debe 
cumplir cada pieza, y qué quedó sin confirmar. 

**Tu primera tarea NO es programar. Es auditar.** Lee el código real 
(`main.js`, `index.html`, y consulta el schema real de Supabase) y 
compáralo contra cada punto de este documento. Para cada uno, repórtame:
✅ Implementado y correcto | ⚠️ Implementado a medias / con bug | ❌ No implementado.

No asumas que algo "debería estar" solo porque este documento lo describe 
— varias veces en esta historia un plan aprobado no coincidió con lo que 
terminó en el código real. Verifica leyendo.

---

## 1. Contexto de negocio

- Taller de reparación de celulares en Lima, Perú (chip-level, JTAG, 
  eMMC/UFS). El programa también se vende/instala a otros talleres 
  (multiempresa — cada cliente es una `empresa_id` distinta).
- Categorías de producto existentes: **Pantallas, Accesorios, Repuestos 
  de Celulares, Micas, Celulares**.
- El técnico usa el Inventario para consultar precio al público en 
  tiempo real mientras atiende a un cliente.

## 2. Schema real conocido de `productos` (tabla Supabase)

```
id                  bigint (PK, global, NO por empresa)
nombre              text
categoria           text   -- OJO: verificar valores reales exactos, ver sección 6
costo               numeric  -- campo legado, formulario original de un solo costo
precio              numeric  -- campo legado, formulario original de un solo precio
stock               integer
proveedor           text
empresa_id          text   -- multiempresa. TEXT, no numérico.
sku                 text   -- formato PREFIJO-XXXX, único por (empresa_id, sku), NO global
costo_caycel        numeric
costo_samtec        numeric
costo_cyberphone    numeric
costo_amobile       numeric
precio_mayor        numeric
precio_punto        numeric
costo_por_confirmar boolean
subcategoria        text   -- NUEVO, en desarrollo (ver sección 8)
```

Tablas relacionadas:
- `movimientos_stock` (id, empresa_id **text**, sku, cantidad, proveedor, 
  costo, nota, fecha_ingreso date, nombre_archivo_origen, creado_en) — 
  historial de reposiciones. DEBE filtrarse siempre por empresa_id además 
  de sku (esto tenía un bug de fuga entre empresas, ver sección 7, punto 3).
- `productos_duplicados_archivados` — respaldo de 333 productos huérfanos 
  de empresa_id=1 que se limpiaron (no tocar, es historial).
- `productos_empresa6_respaldo` — si llegó a crearse (verificar si existe; 
  fue mencionado pero no confirmado que se ejecutara).
- Posible `cargas_procesadas` (hash de archivo + resumen) para evitar 
  reprocesar el mismo Excel dos veces — **verificar si esto se implementó, 
  no estoy seguro de que el agente lo haya construido finalmente.**

Índices/constraints importantes:
- `productos_sku_empresa_key`: UNIQUE (empresa_id, sku) WHERE sku IS NOT NULL 
  — reemplazó a un índice viejo que era único solo por sku (global). 
  Verifica que el viejo (`productos_sku_key`) ya no exista.

## 3. Prefijos de SKU por categoría (correlativo por empresa, no global)

```
Pantallas              -> PANT-XXXX
Accesorios             -> ACCE-XXXX
Repuestos de Celulares -> REPU-XXXX
Micas                  -> MICA-XXXX
Celulares              -> CEL-XXXX
```

El correlativo debe calcularse SIEMPRE filtrando por `empresa_id` de la 
sesión actual — dos empresas pueden ambas tener un PANT-0001 sin chocar.

## 4. Flujo de importación de Excel ("Cargar Excel")

Handlers relevantes: `preview-excel-inventario` (decide qué hacer con 
cada fila) e `importar-excel-inventario` (ejecuta el guardado real).

Lógica esperada por fila:
1. Si el SKU de la fila coincide con un producto existente (mismo 
   empresa_id) → `accion: 'actualizar'`.
2. Si no hay SKU o no coincide, buscar por nombre normalizado 
   (`replace(/\s+/g,' ').trim().toUpperCase()`) + categoría + empresa_id 
   → si encuentra, `accion: 'vinculado'` (asigna SKU nuevo permanente al 
   producto huérfano encontrado).
3. Si no hay ninguna coincidencia → `accion: 'nuevo'` (genera SKU con el 
   correlativo de su categoría).
4. Reposición de stock: la columna "Cantidad que Ingresa" del Excel se 
   **SUMA** al stock existente, nunca lo reemplaza.
5. Costo por proveedor: la columna "Proveedor" (CAYCEL/SAMTEC/CYBERPHONE/
   AMOBILE, coincidencia EXACTA mayúsculas+trim, no `.includes()`) decide 
   CUÁL de las 4 columnas de costo se actualiza — las otras 3 quedan intactas.
6. Precio Mayor / Precio Punto: solo se actualizan si la celda viene con 
   un valor; si vienen vacías, no se tocan.
7. Al confirmar, cada fila aplicada debe insertar un registro en 
   `movimientos_stock`.
8. El resumen final (toast/alerta) debe mostrar: nuevos, actualizados, 
   vinculados por nombre, errores/duplicados omitidos — como conteos 
   separados y visibles.

**Bug ya corregido una vez, verifica que siga corregido**: hubo un caso 
donde el preview mostraba correctamente "VINCULADO" pero el handler de 
confirmación (`importar-excel-inventario`) no sabía qué hacer con esa 
`accion` y no guardaba nada, en silencio. Se corrigió agregando el caso 
`'vinculado'` al UPDATE con el SKU nuevo incluido en el `SET`. Confirma 
que ese caso sigue existiendo y funcionando.

## 5. Modal de "Detalle del Producto"

Se abre con un botón "👁️ Detalle" por fila (no toda la fila es clickeable, 
a propósito, para evitar clics accidentales al hacer scroll).

Debe mostrar, organizado en bloques:
- **Datos generales**: SKU (🔒 solo lectura, nunca editable — es la llave 
  de `movimientos_stock`), Nombre (editable), Categoría (editable, 
  `<select>`), Stock actual (solo lectura + botón "Ajustar stock" aparte).
- **Costos por proveedor**: 4 campos editables, mostrando "Sin dato" 
  cuando el valor es null — **nunca "S/ 0.00" ni "S/ NaN"** para un campo 
  vacío. Solo visible si la categoría es "Pantallas" (o si al menos un 
  costo no es null).
- **Precios de venta**: Precio Mayor y Precio Punto, editables.
- **Últimos ingresos (historial)**: últimos 5 registros de 
  `movimientos_stock` para ese SKU, consultado con `ipcMain.handle` 
  (invoke/handle, NO send/reply — para evitar el bug de listeners IPC 
  acumulándose que ya tuvimos en este proyecto), **filtrado tanto por sku 
  COMO por empresa_id** (esto tenía una fuga real entre empresas, 
  corregida — confirma que el filtro de empresa_id sigue ahí).
- **Botón "Ajustar stock"**: abre mini-formulario (nuevo valor total de 
  stock, no la diferencia — el usuario escribe "ahora hay 8", el sistema 
  calcula la diferencia) + motivo. Al guardar, actualiza `productos.stock` 
  Y registra en `movimientos_stock` con `proveedor: 'AJUSTE MANUAL'` y el 
  motivo en `nota`. No debe permitir valores negativos.
- **Footer/header fijos** (sticky), con botón "X" en la esquina y tecla 
  Escape para cerrar. Este era un bug real (el footer quedaba fuera de 
  pantalla) — confirma que el modal usa `display:flex; flex-direction:column; 
  max-height:90vh` con el cuerpo en `overflow-y:auto` y header/footer 
  fuera de ese scroll.
- **Botón "Guardar Cambios"**: deshabilitado hasta que algún campo 
  editable cambie. Usa invoke/handle. Al guardar, refresca solo esa fila 
  en la tabla de Inventario (no toda la lista).

## 6. Buscador y filtros de Inventario

- Barra de búsqueda por nombre O sku (case-insensitive, texto parcial), 
  en `renderizarProductosFiltrados()`.
- **Bug ya corregido, verifica que siga así**: el filtro de categoría 
  debe encadenar sobre el resultado YA filtrado por texto 
  (`filtrados = filtrados.filter(...)`), NUNCA reiniciar desde 
  `todosLosProductos` — si reinicia, el buscador deja de funcionar en 
  cualquier pestaña que no sea "Todos".
- Verifica los valores REALES y exactos que existen en 
  `productos.categoria` corriendo:
  ```sql
  SELECT DISTINCT categoria, COUNT(*) FROM productos GROUP BY categoria;
  ```
  Ya sabemos que en algún punto convivieron variantes como "Repuestos", 
  "repuestos", "Repuestos de Celulares" simultáneamente. Cualquier lógica 
  nueva (dropdowns, prefijos de SKU, subcategorías) debe basarse en los 
  valores REALES de la tabla, no en el nombre "ideal" que aparece en la UI.

## 7. Multiempresa — reglas de aislamiento (ya auditadas una vez, re-confirmar)

- TODA consulta que involucre `sku` para decidir un match, un correlativo, 
  o un update, debe incluir `empresa_id` en el WHERE. Ya se hizo una 
  auditoría completa de esto — repítela tú mismo para confirmar que sigue 
  así después de los cambios de subcategoría (sección 8).
- `movimientos_stock.empresa_id` debe ser tipo `text` (se corrigió desde 
  `bigint` para que coincida con `productos.empresa_id`).
- Existe una empresa_id = '6' que es un cliente real (no de prueba) — su 
  catálogo de Pantallas ya fue restaurado (325 productos, copiados desde 
  empresa_id='1' con los mismos SKU, costos y precios, porque son sus 
  datos reales). NO se debe modificar ni mezclar con empresa_id='1' salvo 
  que yo lo pida explícitamente.
- Pendiente NO resuelto todavía: no existe Row Level Security (RLS) a 
  nivel de Supabase — el aislamiento depende 100% de que el código de la 
  app siempre incluya el filtro correcto. Reporta esto como pendiente, 
  pero NO lo implementes en esta tarea (es un cambio grande, aparte, que 
  merece su propia sesión dedicada).

## 8. Subcategorías (EN DESARROLLO — probablemente lo más incompleto)

Aplica SOLO a "Repuestos de Celulares" y "Accesorios" (categorías 
distintas, cada una con su PROPIA lista fija, no se mezclan). Pantallas, 
Micas y Celulares no usan subcategoría.

Lista fija — Repuestos de Celulares:
```
Batería, Flex de Carga, Flex de Volumen/Encendido, Placa de Carga (conector),
Flex de Huella Dactilar, Cámara Frontal, Cámara Trasera, Altavoz (Parlante),
Auricular (altavoz de llamada), Micrófono, Vibrador (motor), 
Antena/Módulo de Señal, Conector de Audífonos, Bandeja SIM, 
Botón de Encendido/Home, Otro
```

Lista fija — Accesorios:
```
Auriculares (alámbricos), Auriculares Bluetooth, Cargadores (pared/auto),
Cables (USB-C/Lightning/Micro USB), Forros/Case, Stickers/Calcomanías,
Soportes/Holders, Power Bank, Memorias/USB, Parlantes Bluetooth,
Popsockets/Anillos, Otro
```

Debe implementarse en:
1. Columna `productos.subcategoria` (text, nullable) — verifica si ya 
   existe.
2. `<select>` dinámico en "Registrar Nuevo Producto": cambia sus opciones 
   según la categoría elegida, oculto para categorías que no aplican, 
   obligatorio cuando aplica.
3. Segundo filtro en Inventario dentro de las pestañas Repuestos y 
   Accesorios (debe encadenar correctamente, mismo cuidado que la sección 6).
4. Visible en el modal de Detalle (sección 5), solo si aplica.
5. Detección y validación en el importador de Excel: si una fila de estas 
   dos categorías trae subcategoría vacía o inválida para SU categoría, 
   debe reportarse como error de revisión manual — **nunca asignar "Otro" 
   ni ningún valor por defecto en silencio**.
6. El prefijo de SKU NO cambia por subcategoría — sigue siendo el de la 
   categoría (REPU-/ACCE-).

**Esto estaba a medio implementar cuando se interrumpió la sesión 
anterior — es muy probable que encuentres partes hechas y partes sin 
hacer. Repórtame el estado real de cada uno de estos 6 puntos.**

## 9. Micas (ya resuelto, solo para contexto — no requiere trabajo)

Micas ya es su propia categoría de primer nivel en la UI (pestaña propia), 
con su propio prefijo MICA-. No necesita subcategoría ni cambios de 
código — solo cargar productos con `categoria = 'Micas'`.

## 10. Bugs sueltos, sin confirmar si se corrigieron

- **Bug "S/ NaN"**: cuando `precio_punto` es null, algún lugar del 
  frontend hace algo como `precio.toFixed(2)` sobre null/undefined y 
  muestra literalmente "S/ NaN" en la tabla de Inventario. Debe mostrar 
  "Sin precio" o "S/ 0.00" con un guard (`(precio || 0)`), consistente 
  con cómo ya se maneja "Sin dato" en costos.
- **Registro de prueba sin borrar**: puede existir un producto de prueba 
  con nombre que contiene "TEST999" en empresa_id='1' — si lo encuentras, 
  bórralo (era solo para validar el fix de vinculación por nombre).
- **Nombre corrupto puntual**: verifica que el producto SKU='PANT-0324' 
  tenga el nombre completo "PANTALLA ZTE A56/A36/, A56PRO5G/ A76" (tenía 
  un bug de parseo de CSV con comas que se corrigió manualmente una vez, 
  confirma que no se volvió a corromper).

## 11. Reglas de oro para todo lo que seguimos construyendo

Estas son decisiones de diseño que se tomaron repetidamente durante toda 
esta historia y deben mantenerse en cualquier cosa nueva que agregues:

- **Nunca asignes un valor por defecto en silencio** ante un dato ambiguo 
  o faltante — repórtalo para revisión manual.
- **Nunca muestres 0 o NaN** cuando el dato real es "no existe" — usa 
  "Sin dato" / "Sin precio" explícito.
- **Todo dropdown de clasificación** (categoría, subcategoría, proveedor) 
  debe ser una lista fija, nunca texto libre — para evitar inconsistencias 
  de texto que después cuesta limpiar.
- **IPC**: usa siempre `invoke`/`handle`, nunca `send`/`on` para 
  operaciones de solicitud-respuesta (evita acumulación de listeners).
- **Cualquier filtro en cadena** (categoría + subcategoría + texto) debe 
  encadenar sobre el resultado anterior, nunca reiniciar desde la lista 
  completa.
- **Cualquier migración SQL destructiva** debe auto-validarse con un 
  bloque `DO $$ ... IF condicion_esperada_no_cumplida THEN RAISE 
  EXCEPTION ... END $$` para que se revierta sola si algo no cuadra, en 
  vez de depender de que un humano corra COMMIT/ROLLBACK manualmente 
  entre pestañas.

---

## Qué quiero que hagas ahora, en orden

1. Lee `main.js` e `index.html` completos (y el schema real de Supabase 
   con las consultas que te indiqué en las secciones 2 y 6).
2. Dame un reporte punto por punto de las secciones 4, 5, 6, 7, 8 y 10 
   con ✅/⚠️/❌ y el detalle de qué encontraste realmente en el código para 
   cada uno.
3. Para cualquier ⚠️ o ❌, propón el fix específico (no lo apliques todavía).
4. Espera mi aprobación antes de modificar cualquier archivo.
5. Aplica los cambios aprobados, y al final corre una prueba manual real 
   (no "verificación a nivel de código") de al menos: subir un Excel de 
   prueba con un producto de Repuestos con subcategoría, confirmar que 
   aparece correctamente en el filtro y en el modal de detalle.
