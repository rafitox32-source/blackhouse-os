# Storage: falta la carpeta por empresa

Trabajo pendiente. La migración 030 desbloqueó las subidas, pero dejó una puerta más abierta
de lo que debería. Esto explica por qué y qué falta.

---

## Cómo se rompió

Al pasar de la clave de servicio a la clave pública, el programa empezó a respetar el RLS.
Se revisaron las 24 tablas de `public`, pero **no se revisó `storage.objects`**, que también
tiene RLS activo y estaba con **cero políticas**. Sin políticas, RLS no deja pasar a nadie.

Dejaron de funcionar las subidas de los tres buckets:

| bucket | qué guarda |
|---|---|
| `productos_fotos` | foto del producto |
| `piezas_fotos` | fotos y vídeos del laboratorio 3D |
| `grabaciones` | vídeo de la reparación |

Bajar seguía funcionando porque los tres buckets son públicos y la lectura pública no pasa
por RLS. Por eso el fallo solo se notaba al subir.

---

## Lo que la 030 no pudo arreglar

Los tres buckets guardan **todo plano en la raíz**, sin carpeta por empresa:

```
productos_fotos/prod_20260728_101500.jpg
piezas_fotos/moto-g23_pantalla_frente_actual_1753728432.jpg
grabaciones/reparacion_142_2026-07-28_10-15-00.webm
```

Como la ruta no dice de qué taller es el archivo, **la política no tiene con qué comparar**.
No se puede escribir "solo tu empresa" sobre una ruta que no menciona la empresa. Por eso las
políticas de la 030 dicen "cualquier usuario con sesión abierta".

### El riesgo, concreto

El nombre de la foto de producto es la fecha y la hora al segundo: `prod_AAAAMMDD_HHMMSS.jpg`.
Eso son **86.400 nombres posibles por día**, o sea que se pueden probar todos. Alguien que
sacara la clave pública del instalador podría pisar o borrar fotos de otro taller.

Lo que **no** puede hacer: leer nada nuevo. Los tres buckets ya eran públicos para leer desde
antes de todo esto. El daño posible es estropear, no espiar.

Comparado con lo de antes: hasta hace unas semanas el instalador llevaba la clave de servicio,
con la que se podía leer y escribir **todo** de **todos**. Esto es mucho menos, pero no es
donde debería quedar.

---

## El arreglo

Guardar con la empresa en la ruta, como ya hace el bucket `marca` de la migración 028:

```
productos_fotos/<empresa_id>/prod_20260728_101500.jpg
```

Y entonces la política puede comparar de verdad:

```sql
(storage.foldername(name))[1] = public.mi_empresa()::text
```

### Por qué no lo hice ya

Toca **datos que ya existen**, y la regla es preguntar primero. Son tres pasos:

1. Mover los archivos que ya están subidos a su carpeta. Hay que averiguar de qué empresa es
   cada uno, y para `productos_fotos` eso significa buscar la URL en la tabla `productos`.
2. Reescribir las URLs guardadas en `productos.foto_url`, `ordenes` (vídeo) y
   `piezas_fotos_modelos`. Si esto sale mal, las fotos dejan de verse.
3. Cambiar las tres subidas de `main.js` para que metan el `empresa_id` en la ruta.

Se hace con respaldo previo y se puede volver atrás, pero es una migración de datos y necesita
tu visto bueno.

### Un caso especial

`piezas_fotos` es la **librería compartida del holograma**: los talleres se prestan las fotos
de despiece a propósito, y la tabla `piezas_fotos_modelos` ya tiene la política correcta
(todos leen, cada uno escribe lo suyo). Al pasarlo a carpetas hay que mantener eso: lectura
abierta a todos, escritura solo en la carpeta propia.

---

## Estado

| | |
|---|---|
| Subidas funcionando | ✅ migración 030, aplicada |
| Tope de tamaño y tipo | ✅ 10 MB e imágenes en `productos_fotos`, 500 MB y vídeo en `grabaciones` (antes no tenían ninguno) |
| Carpeta por empresa | ⬜ pendiente, necesita tu aprobación |
