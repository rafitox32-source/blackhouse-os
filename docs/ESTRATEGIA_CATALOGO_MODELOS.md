# Estrategia: catálogo de modelos compartido entre talleres

Objetivo pedido:

> Que toda empresa nueva arranque viendo **todos los modelos en 0**, que cuando alguien agregue
> un modelo nuevo **quede seleccionable para todos** y el catálogo crezca solo con el tiempo,
> pero que los modelos sean **verificables**, para que nombres raros no entren.

Este documento es el plan. Los números que aparecen están medidos sobre los datos reales del
sistema (409 productos de Doha-cell y 392 de casita), no estimados.

---

## 1. De dónde NO debe salir la semilla

La tentación es sembrar con `devices_cache.json`, que ya está en el programa. **No sirve:**

| | |
|---|---|
| Modelos que trae | 5 523 |
| Marcas | 15 |
| ZTE, sin ir más lejos | 1 057 modelos |

Y la calidad es mala para un taller: `Absolute`, `Acclaim`, `Chromebook 3`, `China Telecom`,
`iPad (3rd generation)`… Sembrar eso es devolverle al usuario justo el problema que lo hizo
pedir "Mi almacén": un catálogo mundial donde no encuentra nada.

**La semilla buena son los modelos que los talleres reales sí manejan.** Hoy son **398**,
derivados del inventario de las dos empresas con datos. Esa lista sí es el mundo real de un
taller de celulares en Perú.

`devices_cache.json` se queda donde está: como la pestaña "Catálogo general", para el día que
entre un equipo raro. No se mezcla con el catálogo compartido.

---

## 2. Los dos porteros

Un modelo llega al catálogo compartido solo si pasa dos filtros distintos. Son distintos a
propósito: uno mira **la forma del nombre**, el otro mira **si alguien más lo confirma**.

### Portero 1 — la forma del nombre (automático, instantáneo)

Rechaza sin preguntar lo que no puede ser un modelo:

| Regla | Ejemplo que rechaza |
|---|---|
| Entre 2 y 40 caracteres, máximo 5 palabras | `un modelo con demasiadas palabras aqui` |
| Solo letras, números y `. + - /` | `@@@###` |
| No puede ser una **pieza** | `PANTALLA A31`, `A31 INCELL C/M`, `MARCO` |
| No puede ser un **accesorio ni una operadora** | `chip bitel`, `cargador tipo c`, `prueba 1` |
| Sin letras repetidas (tecleo al azar) | `aaaaaa` |
| Lleva número **o** una palabra de serie conocida (`PLAY`, `PRO`, `ULTRA`, `XR`…) | `asdasdasd`, `xd`, `sdfghjkl` |

Antes de juzgar se **limpia**: una coma perdida no debería costarle el modelo al taller
(`ZTE , A56PRO5G` → `ZTE A56PRO5G`).

Resultado del filtro corriendo sobre los 398 modelos reales:

| | |
|---|---|
| Aceptados | **395** (99,2 %) |
| A revisión (marca no reconocida) | 1 — `A35E` |
| Rechazados | 2 — `MARCO` y `chip bitel`, ambos basura de verdad |

Y sobre 11 nombres basura de prueba: **rechazó los 11**, aceptando los 4 legítimos
(`Galaxy A31`, `iPhone 15 Pro Max`, `Moto E 2nd Gen`, `Redmi Note 13 Pro+`).

### Portero 2 — la IA, pero reconociendo en vez de recordando

El filtro de forma no puede detectar un nombre que *parece* correcto y no existe: `Mate note 10`
lo cruza sin problema.

Lo que **no** hay que hacer es preguntarle a la IA de memoria. `llama-3.1-8b-instant` es un
modelo chico: ante un `Honor X6b` real lo "corrige" hacia el `X6`, que es más famoso. Eso es
peor que el error de tipeo original.

En vez de eso se le entregan **los modelos parecidos de nuestro propio catálogo** y se le pide
elegir entre ellos o decir que ninguno sirve. Recordar es difícil; reconocer es fácil.

Los candidatos salen por distancia de edición contra el nombre visible **y** contra la clave
canónica —quien escribe `A31` no debería quedarse sin encontrar `Galaxy A31`, que es el mismo
equipo— más una regla extra: si la clave aparece completa dentro de lo escrito, entra igual
(así `P. HONOR X8A` encuentra `X8A` aunque la distancia se dispare por la basura de delante).

Esto es lo que recibe la IA con los datos reales:

| Escrito | Conocidos que se le pasan |
|---|---|
| `Samsng A31` | `Galaxy A31` |
| `Mate note 10` | `Mate 10` |
| `P. HONOR X8A` | `X8A` |
| `A31` | `Galaxy A31`, `Galaxy A01`, `A21`, `A30`… |
| `ZZZZ999` | *(ninguno)* |

La regla más importante del prompt sale de ese cuarto caso: **en los celulares un carácter
cambia el equipo.** `A21`, `A31` y `A51` son tres teléfonos distintos, así que la IA tiene
prohibido tocar la parte numérica para parecerse a otro modelo; solo corrige palabras (la
marca, la serie) y basura descriptiva.

Si la IA corrige hacia un equipo que **ya está** en el catálogo, no se crea ficha nueva: el
error de tipeo se absorbe en la que existe. Ese es el mejor final posible.

Y la IA **no decide**: solo entra directo lo que además de pasar el formato ella reconoce con
confianza alta. Nunca rechaza sola.

### Portero 3 — la corroboración

El filtro de forma no puede detectar un nombre que *parece* correcto pero está mal escrito:
`Mate note 10` pasa el formato y sin embargo no existe.

Para eso está el segundo portero: **un modelo nuevo nace `pendiente` y solo lo ve el taller que
lo creó.** Pasa a `verificado` —y ahí sí lo ve todo el mundo— cuando ocurre una de estas:

1. **Dos talleres distintos** registran un producto para ese mismo modelo, o
2. coincide con un modelo del catálogo general (`devices_cache.json`), o
3. el dueño lo aprueba a mano desde la cola de revisión.

Esto no es teoría. Al comparar los dos talleres con datos:

| | |
|---|---|
| Modelos en **ambos** | **388** |
| Solo en uno | 10 |

Y esos 10 solitarios son exactamente: `chip bitel`, `P. HONOR X8A`, `Mate note 10`, `g05s`,
`X50I`… **la basura vive justo donde no hay corroboración.** El mecanismo se valida solo.

> Salvedad honesta: los dos talleres actuales comparten el 97 % del inventario, así que
> probablemente cargaron la misma lista de proveedor. Como evidencia independiente es floja.
> El mecanismo es el correcto igual, pero conviene arrancar con el umbral en 2 y subirlo a 3
> cuando haya más talleres de verdad distintos.

---

## 3. Qué ve cada taller

- **Empresa nueva** (hoy `iFix` y `SERVICIO TECNICO ESPECIALIZADO RRR`, que no tienen ningún
  producto): abre el selector y ve **los 398 modelos verificados, todos con 0**. Puede
  recepcionar cualquier equipo desde el día uno.
- **A medida que compra repuestos**, esos modelos pasan de `0` a su stock real, y el selector
  ya los ordena poniendo primero lo que tiene.
- **Filtro rápido "solo con stock"** para el que prefiere la lista corta de siempre.
- **Modelo que no existe todavía**: lo agrega, pasa el portero de formato, y lo usa **de
  inmediato** en su taller. Al resto del mundo le aparece cuando se corrobore.

Lo importante: el taller **nunca queda bloqueado**. El equipo entra hoy; la verificación es
para el catálogo compartido, no para su trabajo.

---

## 4. Datos

Dos tablas nuevas, globales (no llevan `empresa_id` en la ficha del modelo — ese es el punto).

```
modelos_dispositivos
  id          bigserial pk
  marca       text        -- 'Samsung'
  modelo      text        -- 'Galaxy A31'   (lo que se muestra)
  clave       text        -- 'A31'          (canónica, une "A31" con "Galaxy A31")
  estado      text        -- 'verificado' | 'pendiente' | 'rechazado'
  talleres    int         -- cuántas empresas distintas lo usan
  origen      text        -- 'semilla' | 'taller' | 'aprobado'
  creado_por  text        -- empresa que lo propuso
  creado_en   timestamptz
  UNIQUE (marca, clave)

modelos_uso                -- para contar talleres sin que nadie pueda inflar el número
  modelo_id   bigint
  empresa_id  text
  UNIQUE (modelo_id, empresa_id)
```

La clave canónica es la que ya usa el programa (`variantesDeModelo` en `main.js`): limpia el
ruido de panel, parte por `/` y une `A31` con `Galaxy A31`. Reusarla es lo que garantiza que el
catálogo compartido y la búsqueda de repuestos no se desincronicen.

`rechazado` se guarda a propósito: si un nombre ya se descartó, no vuelve a colarse ni a
aparecer en la cola de revisión.

---

## 5. Fases

1. **Tablas + semilla.** Crear las dos tablas y sembrarlas con los 398 modelos derivados de los
   productos existentes, en `verificado`. Nada cambia en la pantalla todavía.
2. **Lectura.** "Mi almacén" pasa a leer de `modelos_dispositivos` (verificados + los propios
   pendientes) y cruza con `productos` para el número de stock. Aquí es donde la empresa nueva
   empieza a ver los modelos en 0.
3. **Escritura con portero.** "Agregar modelo" pasa por el validador y crea el registro en
   `pendiente`. Se registra el uso en `modelos_uso`.
4. **Promoción automática.** Al registrar un producto o recepcionar, se cuenta el taller en
   `modelos_uso`; al llegar al umbral, el modelo pasa a `verificado` solo.
5. **Cola de revisión** para el dueño: aprobar / rechazar lo pendiente, en lote.

Las fases 1 y 2 ya sirven solas (empresa nueva con catálogo completo). Las 3–5 son las que lo
hacen crecer.

---

## 6. Lo que hay que decidir antes de construir

1. **Umbral de corroboración: ¿2 talleres o 3?** Con los datos de hoy 2 alcanza y deja el
   catálogo en 388 limpios. Con más clientes, 3 es más seguro.
2. **¿La cola de revisión la ve solo el dueño de BlackHouse, o también el admin de cada
   taller?** Recomiendo solo el dueño: es un catálogo compartido entre clientes distintos.
3. **¿Los pendientes de un taller los ve el resto de usuarios de ese mismo taller?** Recomiendo
   que sí (es su inventario), pero no fuera de la empresa.
4. **Marcas nuevas** (una marca que no está en la lista de 15): ¿se aceptan automáticamente o
   siempre pasan por revisión? Recomiendo revisión — una marca mal escrita ensucia mucho más
   que un modelo mal escrito.
