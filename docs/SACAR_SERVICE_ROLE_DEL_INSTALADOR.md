# Sacar la `service_role` del instalador

Estado del trabajo y qué falta. Los números están medidos sobre la base real, no estimados.

---

## El problema

`package.json` mete el `.env` dentro del `.exe` (`build.files` incluye `".env"`), y la
`SUPABASE_KEY` que se empaqueta es la **`service_role`**, que **se salta el RLS**.

Quien desempaqueta el instalador —el `.exe` es un ZIP y `asar` no es cifrado, es un archivo
empaquetado— obtiene esa clave y con ella puede:

- leer y escribir los datos de **todos** los talleres (clientes, órdenes, precios, hashes);
- regalarse licencias: `INSERT INTO licencias (codigo, dias_duracion) VALUES ('X', 36500)`;
- correrle el vencimiento a cualquier empresa.

Mientras eso siga así, cualquier protección anticopia es una cerradura en una puerta sin pared.

---

## Hecho y verificado

### Migración 021 — quién pregunta
`usuarios.auth_id` enlaza con `auth.users`. `mi_empresa()`, `mi_rol()` y `soy_matriz()` resuelven
la identidad. Van `SECURITY DEFINER` porque `usuarios` también tiene RLS y, si lo respetaran, no
podrían leer la fila del que pregunta.

`login_verificar()` y `login_vincular_auth()` permiten validar usuario y contraseña **con la
clave pública**. Aceptan bcrypt y texto plano igual que el login de hoy, nunca devuelven el hash,
y revisan la licencia del lado del servidor.

### Migración 022 — 32 políticas
Las 24 tablas con `empresa_id` se generan en bucle (resuelve solo que la columna es `bigint` en
unas y `text` en otras). Aparte: la librería de fotos del holograma se comparte a propósito
(todos leen, cada uno escribe lo suyo), `licencias` es solo de la casa matriz, el catálogo de
modelos deja leer lo verificado y proponer a cualquiera pero aprobar solo a la matriz, y las
tablas hijas heredan de su madre.

Todas son `TO authenticated`, para no pisar la política `anon` del QR público de seguimiento.

`recibos` y los dos respaldos de productos quedan cerrados: no los usa ninguna llamada.

### Migración 023 — las columnas de licencia
Salió probando la 022: un técnico podía hacer

```sql
update empresas set fecha_de_vencimiento = '3000-01-01' where id = <la suya>
```

y quedarse con acceso eterno. Una política RLS es por fila, no distingue entre cambiar el logo y
cambiar hasta cuándo pagó. Se cierra con `GRANT` por columna.

### Cuentas espejo
Los 10 usuarios tienen su cuenta `<usuario>@blackhouse.local` en `auth.users`, creada con el
**mismo hash bcrypt** que ya tenían. Nadie cambió de contraseña ni tuvo que confirmar correo.
Cada una con su fila en `auth.identities`, que es lo que GoTrue exige para el login por correo
(sin ella el login falla con "Invalid login credentials").

### Prueba de aislamiento
Simulando la sesión real de un técnico de Doha-cell contra los datos de producción:

| | Ve | Antes |
|---|---|---|
| Productos | 409 · **0 ajenos** | todos |
| Órdenes | 63 · **0 ajenas** | todas |
| Usuarios | 5 | 10 |
| Empresas | 1 | 4 |
| **Licencias** | **0** | todas |
| Catálogo compartido | 380 ✓ | — |
| Fotos del holograma | 5 ✓ | — |

Y los 9 permisos de columna de `empresas` dan exactamente lo esperado.

**Nada de esto cambia el comportamiento actual**: mientras la app entre con `service_role`, las
políticas quedan dormidas porque esa clave las ignora por diseño.

---

## Lo que falta

### 1. Recordar sesión (`iniciar-sesion-token`)
El login normal ya abre la sesión de Auth. El de "recordarme" no puede: no tiene la contraseña.
Hay que guardar el `refresh_token` que devuelve Supabase y restaurarlo con
`supabase.auth.refreshSession({ refresh_token })`. Además ese handler lee `usuarios` por
`session_token`, cosa que con la clave pública queda bloqueada: necesita su propia RPC.

### 2. El cambio de clave
Cambiar el secret `SUPABASE_KEY` de GitHub Actions por la **clave pública**:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  (anon, Settings -> API)
```

**Cómo probarlo antes sin arriesgar nada:** poner esa clave en el `.env` local y correr
`npm start`. Si se entra y todo se ve, la migración está bien. Si algo aparece vacío, es que a
esa tabla le falta política — se anota y se agrega, no se rompe nada.

**Rollback:** volver a poner la clave anterior en el secret. Todo vuelve a como está hoy.

### 3. Revisar dos cosas que quedaron a la vista
- **`reseller_1782964500721` tiene `empresa_id` en NULL**, así que `mi_empresa()` le devuelve
  NULL y con la clave pública no vería nada. Hay que decidir qué debe ver un reseller.
- **`chat_mensajes` y `feed_taller`** tienen políticas viejas con `qual: true` para `anon`, o sea
  abiertas a cualquiera con la clave pública. Son previas a este trabajo y no se tocaron, pero
  conviene revisarlas.

---

## Después de esto

Con la pared levantada, las dos medidas anticopia que sí valen la pena:

1. **Atar la licencia al equipo.** `usuarios.hwid` ya existe y `node-machine-id` ya está en las
   dependencias, sin usar. Una licencia = N máquinas; la siguiente se rechaza.
2. **Interruptor de apagado** con un Worker de Cloudflare que valide la licencia. Lógica simple,
   imposible de saltar desde el cliente, y permite cortarle el acceso a alguien sin tocar su PC.
