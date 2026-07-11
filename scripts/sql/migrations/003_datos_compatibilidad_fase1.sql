-- Migración 003: Poblado inicial de grupos_compatibilidad a partir de datos ya existentes
-- Motor: PostgreSQL (Supabase, proyecto flfhpffslhjcuvhxsnjz)
-- REQUIERE: 002_grupos_compatibilidad.sql ya aplicada.
--
-- NOTA HISTÓRICA IMPORTANTE: la versión de este archivo tal como se escribió originalmente
-- (JOIN LATERAL con un INSERT...RETURNING dentro) tiene un error de sintaxis real — Postgres no
-- permite un INSERT dentro de un JOIN LATERAL de esa forma. Nunca se detectó en esta sesión porque
-- el entorno bloqueó incluso la prueba de BEGIN;...ROLLBACK;, así que quedó "listo" pero nunca se
-- ejecutó de verdad. Quien aplicó esta migración la reescribió con CTEs encadenados
-- (WITH nuevos_grupos AS (INSERT ... RETURNING ...), grupos_con_sku AS (...), miembros(...) AS
-- (VALUES ...) INSERT INTO grupos_compatibilidad_modelos ...) y la aplicó en dos pasos.
-- Resultado verificado en producción: 20 grupos, 42 miembros, 20 productos vinculados, 650
-- pantallas con modelo_compatible relleno — coincide exacto con lo calculado más abajo.
-- Este archivo documenta la LÓGICA/DISEÑO original tal como se pensó, no el SQL literal que
-- terminó corriendo. Lección aplicada al resto de esta tarea: preferir patrones de CTE encadenados
-- simples y evitar INSERT dentro de LATERAL cuando el SQL no se puede probar antes de aplicarse.
--
-- Este script hace DOS cosas independientes:
--   A) Migra a grupos_compatibilidad los productos de categoría 'Micas' cuyo modelo_compatible
--      actual ya es una lista "Modelo A / Modelo B [/ Modelo C ...]" (grupos implícitos).
--   B) Rellena (backfill) productos.modelo_compatible para categoría 'Pantallas', que hoy está
--      vacío en TODAS las filas (verificado: 650/650 con modelo_compatible=''), a partir del
--      nombre del producto. Es SOLO backfill de texto — NO crea grupos de pantallas todavía,
--      porque a diferencia de las micas no hay evidencia hoy de qué pantallas son
--      intercambiables entre sí; eso requiere que el dueño lo confirme antes de agrupar.
--
-- ============================================================================
-- PARTE A: MIGRACIÓN DE GRUPOS DE MICAS
-- ============================================================================
-- Estado real verificado (SELECT categoria, count(*) FILTER (modelo_compatible LIKE '%/%')):
--   135 productos en categoría 'Micas', de los cuales 30 filas (15 SKU únicos × 2 empresas
--   "1" y "6", que son espejos de la misma empresa) tienen modelo_compatible con "/".
--
-- De esos 15 SKU, se verificó CADA fragmento de modelo contra devices_cache.json
-- (catálogo real de ~5500 modelos usado en el selector Marca→Modelo de la app).
-- Solo se migran automáticamente los que matchean LIMPIO (todos sus fragmentos existen
-- tal cual en el catálogo). Los que no matchean limpio se dejan documentados abajo para
-- revisión manual del dueño — no se fuerza ninguna corrección de texto.
--
-- 10 SKU con match limpio (se migran aquí):
--   MICA-0001  Galaxy A71 / Galaxy A72                        -> Samsung / Samsung
--   MICA-0007  Galaxy J4 / Galaxy J6+                         -> Samsung / Samsung
--   MICA-0015  Galaxy A15 / Galaxy A25 5G                     -> Samsung / Samsung
--   MICA-0016  Galaxy A20s / Galaxy A12                       -> Samsung / Samsung
--   MICA-0031  Redmi Note 8 Pro / Huawei Y19                  -> Xiaomi / Huawei (grupo cruzado real)
--   MICA-0032  Redmi 8A / Redmi 8                             -> Xiaomi / Xiaomi
--   MICA-0033  Redmi 9A / Redmi 9C / Redmi 10A                -> Xiaomi / Xiaomi / Xiaomi
--   MICA-0043  Huawei Y9 2019 / Y8s                           -> Huawei / Huawei
--   MICA-0044  Huawei Nova 5i / Nova 7i                       -> Huawei / Huawei
--   MICA-0045  Huawei Y7p / P40 Lite                          -> Huawei / Huawei
--
-- 5 SKU SIN match limpio (NO se migran, quedan para revisión manual — ver reporte):
--   MICA-0050  "Honor X7 / Honor X7a"                — la marca "Honor" NO existe en devices_cache.json
--   MICA-0051  "Honor X8a / Honor X8"                — ídem, catálogo no tiene marca Honor
--   MICA-0058  "Oppo A78 4G / A52 / A53 / Reno 6 Lite" — A52/A53 sí existen en catálogo Oppo,
--                                                         pero "A78 4G" (catálogo solo tiene "A78"
--                                                         y "A78 5G") y "Reno 6 Lite" (catálogo solo
--                                                         tiene "Reno6 Pro+ 5G"/"OPPO Reno6 Z 5G") no
--                                                         matchean exacto -> se deja el grupo completo
--                                                         sin migrar para no crear un grupo incompleto.
--   MICA-0066  "LG K50 / Q60"                        — la marca "LG" NO existe en devices_cache.json
--   MICA-0067  "Redmi Note 13 / Redmi Note 14 / Realme 7i" — ninguno de los 3 modelos existe en el
--                                                         catálogo (Xiaomi no tiene "Redmi Note 13/14"
--                                                         cargados, Realme no tiene "7i", solo "7"/"7 Pro")
--
-- Acción recomendada para esos 5: agregar los modelos/marcas faltantes a devices_cache.json
-- primero (Fase futura / mantenimiento del catálogo), y luego crear esos 5 grupos manualmente
-- desde la UI de "Compatibilidades" de la Fase 2 una vez exista.

BEGIN;

CREATE TEMP TABLE tmp_mica_miembros (sku text, marca text, modelo text) ON COMMIT DROP;
INSERT INTO tmp_mica_miembros (sku, marca, modelo) VALUES
    ('MICA-0001', 'Samsung', 'Galaxy A71'),
    ('MICA-0001', 'Samsung', 'Galaxy A72'),
    ('MICA-0007', 'Samsung', 'Galaxy J4'),
    ('MICA-0007', 'Samsung', 'Galaxy J6+'),
    ('MICA-0015', 'Samsung', 'Galaxy A15'),
    ('MICA-0015', 'Samsung', 'Galaxy A25 5G'),
    ('MICA-0016', 'Samsung', 'Galaxy A20s'),
    ('MICA-0016', 'Samsung', 'Galaxy A12'),
    ('MICA-0031', 'Xiaomi',  'Redmi Note 8 Pro'),
    ('MICA-0031', 'Huawei',  'Y19'),
    ('MICA-0032', 'Xiaomi',  'Redmi 8A'),
    ('MICA-0032', 'Xiaomi',  'Redmi 8'),
    ('MICA-0033', 'Xiaomi',  'Redmi 9A'),
    ('MICA-0033', 'Xiaomi',  'Redmi 9C'),
    ('MICA-0033', 'Xiaomi',  'Redmi 10A'),
    ('MICA-0043', 'Huawei',  'Y9 2019'),
    ('MICA-0043', 'Huawei',  'Y8s'),
    ('MICA-0044', 'Huawei',  'Nova 5i'),
    ('MICA-0044', 'Huawei',  'Nova 7i'),
    ('MICA-0045', 'Huawei',  'Y7p'),
    ('MICA-0045', 'Huawei',  'P40 Lite');

-- Un grupo nuevo por cada (sku, empresa_id) que exista hoy realmente en productos
-- (evita inventar grupos para empresas que no tengan ese SKU).
CREATE TEMP TABLE tmp_nuevos_grupos (grupo_id bigint, sku text, empresa_id text) ON COMMIT DROP;

INSERT INTO tmp_nuevos_grupos (grupo_id, sku, empresa_id)
SELECT gc.id, x.sku, x.empresa_id
FROM (
    SELECT DISTINCT sku, empresa_id, modelo_compatible
    FROM productos
    WHERE categoria = 'Micas'
      AND sku IN (SELECT DISTINCT sku FROM tmp_mica_miembros)
) x
JOIN LATERAL (
    INSERT INTO grupos_compatibilidad (empresa_id, tipo_pieza, etiqueta)
    VALUES (x.empresa_id, 'mica', x.modelo_compatible)
    RETURNING id
) gc ON true;

-- Insertar los modelos miembro de cada grupo recién creado
INSERT INTO grupos_compatibilidad_modelos (grupo_id, marca, modelo, modelo_normalizado)
SELECT g.grupo_id, m.marca, m.modelo, upper(regexp_replace(m.modelo, '\s+', ' ', 'g'))
FROM tmp_nuevos_grupos g
JOIN tmp_mica_miembros m ON m.sku = g.sku;

-- Vincular los productos existentes a su grupo recién creado
UPDATE productos p
SET grupo_compatibilidad_id = g.grupo_id
FROM tmp_nuevos_grupos g
WHERE p.sku = g.sku AND p.empresa_id = g.empresa_id AND p.categoria = 'Micas';

-- Verificación rápida (revisar antes de confiar en el COMMIT final):
--   SELECT count(*) FROM grupos_compatibilidad;                 -- esperado: 20 (10 SKU x 2 empresas)
--   SELECT count(*) FROM grupos_compatibilidad_modelos;         -- esperado: 42 (2+2+2+2+2+2+3+2+2+2 miembros x 2 empresas)
--   SELECT count(*) FROM productos WHERE grupo_compatibilidad_id IS NOT NULL; -- esperado: 20

-- ============================================================================
-- PARTE B: BACKFILL DE modelo_compatible PARA PANTALLAS (solo texto, sin grupos)
-- ============================================================================
-- Patrón verificado sobre los 650 productos reales de categoría 'Pantallas': el nombre
-- casi siempre sigue "PANTALLA {MODELO}" (ej. "PANTALLA HONOR X6 / X6S" -> "HONOR X6 / X6S").
-- Validado localmente con un script Node contra los 325 nombres reales de la empresa "1":
-- 0 resultados vacíos, solo 1 caso sin el prefijo "PANTALLA" (ej. "A35E", que se queda igual).
UPDATE productos
SET modelo_compatible = trim(regexp_replace(regexp_replace(nombre, '^\s*PANTALLA\s+', '', 'i'), '\s+', ' ', 'g'))
WHERE categoria = 'Pantallas'
  AND coalesce(modelo_compatible, '') = '';

-- Verificación rápida:
--   SELECT count(*) FROM productos WHERE categoria='Pantallas' AND coalesce(modelo_compatible,'')=''; -- esperado: 0

COMMIT;
