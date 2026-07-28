# Tokens de tema — inventario y plan de sustitución

Lo que sigue **no se ha aplicado**. Es la lista que pediste ver antes de tocar nada
(decisión C: "quirúrgico, lista los casos antes de cambiarlos").

La Fase 1 solo **creó los nombres**. La sustitución va módulo por módulo en la Fase 2.

---

## Por qué hacía falta

El `index.html` tiene **1325 colores escritos a mano**, 315 distintos. Como no tienen nombre,
ningún tema puede moverlos. Por eso existe el bloque `body.tema-claro`: **78 líneas de CSS con
`!important`** cuyo único trabajo es tapar esos colores cuando el fondo es claro, con selectores
tan frágiles como `[style*="color:#aaa"]` — que fallan si alguien escribe `color: #aaa` con
espacio, o `#AAA` en mayúsculas.

Ese bloque desaparece cuando termine la Fase 2. No antes.

---

## Los 35 tokens

### Marca y acento
| token | original | qué es |
|---|---|---|
| `--bh-purple` | `#7c3aed` | acento principal |
| `--bh-purple-dark` | `#5b21b6` | acento presionado |
| `--bh-accent-2` | `#5b21b6` | fin del degradado |
| `--bh-purple-glow` | `rgba(124,58,237,.5)` | resplandor |
| `--bh-accent-soft` | `#a78bfa` | **nuevo** — acento claro para texto |
| `--bh-accent-softer` | `#d8b4fe` | **nuevo** |
| `--bh-on-accent` | `#ffffff` | **nuevo** — qué color va *encima* del acento |

### Fondo y superficies
| token | original | qué es |
|---|---|---|
| `--bh-bg-dark` | `#050505` | fondo de la ventana |
| `--bh-bg-gradient` | degradado | fondo con degradado |
| `--bh-bg` | `var(--bh-surface)` | **nuevo, y arregla un fallo — ver abajo** |
| `--bh-card-bg` | `rgba(20,20,20,.8)` | tarjeta translúcida |
| `--bh-surface` | `#141414` | superficie sólida |
| `--bh-surface-2` | `#1e1e1e` | superficie elevada / hover |
| `--bh-surface-3` | `#222222` | **nuevo** — 69 fondos hoy a mano |
| `--bh-border` | `rgba(255,255,255,.08)` | borde sutil |
| `--bh-border-strong` | `#333333` | **nuevo** — 75 divisores hoy a mano |
| `--bh-scroll-thumb` | `#333` | barra de desplazamiento |

### Escalera de texto
| token | original | usos hoy a mano |
|---|---|--:|
| `--text-main` | `#e0e0e0` | 1 |
| `--text-soft` | `#cccccc` | **nuevo** — 40 |
| `--text-muted` | `#9ca3af` | 101 |
| `--text-dim` | `#888888` | **nuevo** — 95 |
| `--text-faint` | `#666666` | **nuevo** — 69 |
| `--text-invert` | `#ffffff` | **nuevo** |

### Estados
`--success` `#10b981` · `--success-soft` `#34d399` · `--danger` `#ef4444` ·
`--danger-soft` `#f87171` · `--warning` `#e2950f` · `--warning-soft` `#fbbf24` ·
`--info` `#3b82f6` · `--info-soft` `#0ea5e9`

### Laboratorio 3D y mascota
`--bh-holo-ok` `#3fd8ff` · `--bh-holo-bad` `#ff3b4e` · `--bh-bot` `#22d3ee`

---

## Plan de sustitución: 689 casos

### A) 241 casos sin discusión — el literal ya ES el valor del token

Cambiar `#7c3aed` por `var(--bh-purple)` no mueve un solo píxel en el tema por defecto,
porque `--bh-purple` vale exactamente `#7c3aed`. Se puede aplicar sin revisar uno por uno.

| literal | token | CSS | en línea | total |
|---|---|--:|--:|--:|
| `#7c3aed` | `--bh-purple` | 8 | 36 | 44 |
| `#ef4444` | `--danger` | 10 | 29 | 39 |
| `#3fd8ff` | `--bh-holo-ok` | 18 | 7 | 25 |
| `#a78bfa` | `--bh-accent-soft` | 7 | 10 | 17 |
| `#22d3ee` | `--bh-bot` | 1 | 15 | 16 |
| `#10b981` | `--success` | 7 | 8 | 15 |
| `#fbbf24` | `--warning-soft` | 3 | 12 | 15 |
| `#d8b4fe` | `--bh-accent-softer` | 6 | 7 | 13 |
| `#34d399` | `--success-soft` | 5 | 7 | 12 |
| `#0ea5e9` | `--info-soft` | 4 | 7 | 11 |
| `#f87171` | `--danger-soft` | 5 | 4 | 9 |
| `#e2950f` | `--warning` | 4 | 2 | 6 |
| `#ff3b4e` | `--bh-holo-bad` | 3 | 3 | 6 |
| `#3b82f6` | `--info` | 2 | 2 | 4 |
| `#5b21b6` | `--bh-purple-dark` | 2 | 0 | 2 |
| `#e0e0e0` | `--text-main` | 1 | 0 | 1 |
| `#9ca3af` | `--text-muted` | 1 | 0 | 1 |
| `#cccccc` | `--text-soft` | 1 | 0 | 1 |
| `#888888` | `--text-dim` | 1 | 0 | 1 |
| `#666666` | `--text-faint` | 1 | 0 | 1 |
| `#222222` | `--bh-surface-3` | 1 | 0 | 1 |
| `#333333` | `--bh-border-strong` | 1 | 0 | 1 |

### B) 448 casos que sí necesitan tu ojo

Aquí el literal **no** coincide exactamente con el token, así que el tema por defecto
cambiaría un poquito. El caso grande es `#aaa` (100 usos): hoy es `#aaaaaa` y `--text-muted`
es `#9ca3af`, un gris levemente más azulado. La diferencia es casi invisible pero **existe**,
y la regla 6 dice cero regresiones no intencionales. Son decisión tuya.

| literal | token | CSS | en línea | total |
|---|---|--:|--:|--:|
| `#aaa` | `--text-muted` | 60 | 40 | 100 |
| `#888` | `--text-dim` | 20 | 37 | 57 |
| `#333` | `--bh-border-strong` | 32 | 22 | 54 |
| `#666` | `--text-faint` | 9 | 36 | 45 |
| `#222` | `--bh-surface-3` | 32 | 8 | 40 |
| `#1a1a1a` | `--bh-surface-3` | 13 | 15 | 28 |
| `#555` | `--text-faint` | 4 | 19 | 23 |
| `#ccc` | `--text-soft` | 9 | 13 | 22 |
| `#777` | `--text-dim` | 5 | 15 | 20 |
| `#eee` | `--bh-border-strong` | 1 | 19 | 20 |
| `#ddd` | `--text-soft` | 7 | 10 | 17 |
| `#999` | `--text-dim` | 8 | 9 | 17 |
| `#c4b5fd` | `--bh-accent-soft` | 3 | 2 | 5 |

**Las tres opciones para el grupo B:**

1. **Aceptar el cambio mínimo.** `#aaa` → `--text-muted`. Se unifica la paleta, se pierde una
   diferencia de tono imperceptible. *Es lo que recomiendo.*
2. **Ajustar el token al literal.** Poner `--text-muted: #aaaaaa` en el tema por defecto. Cero
   cambio visual, pero se pierde el gris de la paleta actual.
3. **Token aparte.** Crear `--text-muted-2: #aaaaaa`. Cero cambio y cero pérdida, pero son dos
   tokens para lo mismo y el editor de la Fase 5 queda más confuso.

---

## Un fallo que apareció midiendo

`var(--bh-bg)` se usa en dos sitios —el modal de la línea 4775 y las tarjetas de la tienda—
pero **ese token no existía**. En CSS, `background: var(--algo-que-no-existe)` no cae al valor
de la clase: anula la declaración y deja el fondo **transparente**. O sea que ese modal y esas
tarjetas hoy se ven sin fondo.

La Fase 1 define `--bh-bg` como alias de `--bh-surface`, que es lo que usa `.modal-content` en
su clase. **Es el único cambio visual de esta fase**, y es la corrección de un fallo, no un
rediseño.

---

## El puente para lo que no es HTML

El CSS resuelve `var(--lo-que-sea)` solo. El holograma 3D (WebGL) y los gráficos (canvas) no:
necesitan el valor ya calculado. Todo eso pasa por dos funciones y nada más:

```js
tokenColor('--bh-purple')                // "#7c3aed"  -> fillStyle de canvas
tokenNumero('--bh-holo-ok', 0x3fd8ff)    // 4184831    -> three.js
```

Las dos llevan valor de respaldo obligatorio. `tokenNumero` solo acepta hexadecimal: si el token
es un degradado o un `rgba()`, no se puede convertir a número y devuelve el respaldo.

Ya está conectado en el holograma: `HOLO_COLOR_OK` y `HOLO_COLOR_BAD` ahora se leen del tema al
abrir el laboratorio. Como los tokens valen lo mismo que las constantes de antes y ningún tema
los redefine, **hoy se ve idéntico**; la diferencia es que ya se puede cambiar.

Pendiente de pasar por el puente: los colores de Chart.js. Van en la Fase 2.
