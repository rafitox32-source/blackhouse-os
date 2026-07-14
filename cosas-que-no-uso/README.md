# Cosas que no uso

Archivos y carpetas que no forman parte de la app real (nada de acá se carga en
producción ni se usa para el build). Se archivaron acá en vez de borrarse, por si
hace falta rescatar algo más adelante. Esta carpeta está en `.gitignore`: lo que ya
estaba versionado se mantiene con su historial, pero nada nuevo que pongas acá se
va a subir a git (a propósito, por los instaladores/zips de `icono/`).

- **backend/**, **electron/** — arquitectura "POS" alternativa (Python + preload
  separado) que se empezó en el commit `db7af22` y quedó abandonada. La app real usa
  Supabase + funciones RPC directo desde `main.js`, no esto.
- **Dump/**, **src/** — restos sueltos sin relación con el código actual.
- **icono/** — instaladores y herramientas que terminaron guardados acá por error
  (no son parte del proyecto). Revisalo antes de borrar la carpeta entera — puede
  tener algo que sí quieras conservar (ej. un dump de firmware de un equipo).
- **fix\*.js, temp_script\*.js, test_db.js, test_login.js, halve_prices.js** —
  parches y pruebas de un solo uso de sesiones pasadas, ya aplicados.
- **\*.txt** — recortes y notas pegadas a mano durante el desarrollo (chat con otra
  IA, líneas de código copiadas para referencia, etc.).
