-- Migración 030: políticas de Storage — ARREGLO URGENTE
-- Motor: PostgreSQL (Supabase, proyecto flfhpffslhjcuvhxsnjz)
--
-- QUÉ SE ROMPIÓ Y POR QUÉ
--   Al cambiar la clave de servicio por la pública (migraciones 021–027), el programa pasó a
--   respetar el RLS. Se revisaron las 24 tablas de public, pero NO se revisó storage.objects,
--   que también tiene RLS activo y estaba con CERO políticas.
--
--   Sin políticas, RLS no deja pasar a nadie. Resultado: dejaron de funcionar las subidas de
--   los TRES buckets, no solo la de productos:
--
--     · productos_fotos  → foto del producto
--     · piezas_fotos     → fotos y vídeos del laboratorio 3D
--     · grabaciones      → vídeo de la reparación
--
--   Bajar seguía funcionando porque los tres buckets son públicos y la lectura pública no
--   pasa por RLS. Por eso el fallo se ve solo al subir.
--
-- QUÉ HACE ESTA MIGRACIÓN
--   Devuelve el permiso de escritura a los usuarios con sesión abierta. Nada más.
--
-- LO QUE ESTA MIGRACIÓN **NO** ARREGLA — LEER ESTO
--   Hoy los tres buckets guardan todo plano en la raíz, sin carpeta por empresa:
--
--       productos_fotos/prod_20260728_101500.jpg
--
--   Como la ruta no dice de qué taller es el archivo, la política no tiene con qué comparar:
--   no existe forma de escribir "solo tu empresa" sobre una ruta que no menciona la empresa.
--   Así que estas políticas dicen "cualquier usuario con sesión", que es lo mismo que había
--   antes de todo este trabajo.
--
--   El riesgo concreto: el nombre de la foto de producto es la fecha y la hora al segundo.
--   Alguien que sacara la clave pública del instalador podría adivinar nombres por fuerza
--   bruta (son 86.400 por día) y pisar o borrar fotos de otro taller. No puede LEER nada
--   nuevo —los buckets ya eran públicos para leer—, pero sí puede estropear.
--
--   El arreglo de verdad es guardar en marca/<empresa_id>/... como hace el bucket 'marca'
--   de la migración 028. Eso obliga a mover los archivos que ya existen y a reescribir las
--   URLs guardadas en productos, ordenes y piezas_fotos_modelos: es una migración de DATOS
--   y va aparte, con su respaldo. Está anotado en docs/STORAGE_POR_EMPRESA.md.


-- ---------------------------------------------------------------------------------------
-- Lectura
-- ---------------------------------------------------------------------------------------
-- Los tres buckets ya eran públicos, o sea que sus archivos se bajan por URL sin sesión.
-- Esta política no abre nada nuevo: solo permite que el programa los LISTE y los consulte
-- por la API, que es lo que hace al borrar una pieza del holograma.
DROP POLICY IF EXISTS bh_storage_leer ON storage.objects;
CREATE POLICY bh_storage_leer ON storage.objects
    FOR SELECT TO authenticated
    USING (bucket_id IN ('productos_fotos', 'piezas_fotos', 'grabaciones'));

-- ---------------------------------------------------------------------------------------
-- Subir
-- ---------------------------------------------------------------------------------------
DROP POLICY IF EXISTS bh_storage_subir ON storage.objects;
CREATE POLICY bh_storage_subir ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id IN ('productos_fotos', 'piezas_fotos', 'grabaciones'));

-- ---------------------------------------------------------------------------------------
-- Reemplazar (upsert) y borrar
-- ---------------------------------------------------------------------------------------
-- Las tres subidas del programa van con upsert:true, y eso en Storage es un UPDATE cuando el
-- archivo ya existe. Sin esta política, volver a subir la foto de un producto fallaría.
DROP POLICY IF EXISTS bh_storage_reemplazar ON storage.objects;
CREATE POLICY bh_storage_reemplazar ON storage.objects
    FOR UPDATE TO authenticated
    USING      (bucket_id IN ('productos_fotos', 'piezas_fotos', 'grabaciones'))
    WITH CHECK (bucket_id IN ('productos_fotos', 'piezas_fotos', 'grabaciones'));

-- Borrar lo usa el laboratorio al eliminar una pieza (main.js, storage.remove).
DROP POLICY IF EXISTS bh_storage_borrar ON storage.objects;
CREATE POLICY bh_storage_borrar ON storage.objects
    FOR DELETE TO authenticated
    USING (bucket_id IN ('productos_fotos', 'piezas_fotos', 'grabaciones'));

-- Los buckets no se crean ni se borran desde el programa: eso se hace desde aquí con la
-- clave de servicio. Sin política sobre storage.buckets, nadie los toca.


-- ---------------------------------------------------------------------------------------
-- Límites de tamaño y tipo
-- ---------------------------------------------------------------------------------------
-- productos_fotos y grabaciones no tenían ningún límite: se les podía subir un archivo de
-- cualquier tamaño y de cualquier tipo, incluido un ejecutable. Se les pone el mismo tipo de
-- tope que ya tenía piezas_fotos.
UPDATE storage.buckets
   SET file_size_limit = 10485760,   -- 10 MB, de sobra para una foto de producto
       allowed_mime_types = ARRAY['image/jpeg','image/png','image/webp']
 WHERE id = 'productos_fotos';

UPDATE storage.buckets
   SET file_size_limit = 524288000,  -- 500 MB: son vídeos de reparación
       allowed_mime_types = ARRAY['video/webm','video/mp4']
 WHERE id = 'grabaciones';
