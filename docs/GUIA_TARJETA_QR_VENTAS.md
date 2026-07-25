# Guía: Tarjeta con QR para vender BlackHouse OS

Guía práctica para crear la tarjeta que vas a repartir para **atraer nuevos compradores** del programa.
Incluye la URL del QR, las reglas para que el código **sí escanee**, la paleta de color y
**prompts listos para copiar y pegar** en cualquier generador de imágenes (ChatGPT/DALL·E, Midjourney,
Gemini, Leonardo, Ideogram…).

---

## 1. Qué va dentro del QR

```
https://blackhouse-os-web.vercel.app/caracteristicas.html
```

Esa es la página de características del programa. **Ya está verificada**: el QR de la tarjeta que te
entregué se leyó correctamente y devuelve exactamente esa dirección.

> Si algún día cambias de dominio (ej. `blackhouseos.com`), hay que **regenerar el QR**.
> El código no se puede "editar": se hace uno nuevo.

---

## 2. ⚠️ La regla de oro (esto es lo que más falla)

**Ninguna IA de imágenes puede dibujar un QR que funcione.** Va a dibujar algo que *parece* un QR
—cuadritos bonitos— pero **no escanea**, porque el patrón no es real.

El flujo correcto de los profesionales es:

1. La IA genera **solo el fondo/diseño**, dejando un **cuadrado blanco vacío** donde irá el código.
2. El QR **real** lo generas aparte (el que te di, o con `qr-code-generator.com`, o el botón
   de la app en *Ajustes → QR para Clientes*).
3. **Pegas** el QR real encima del cuadrado blanco, en Canva/Photoshop/PowerPoint.

Por eso **todos los prompts de abajo dicen expresamente que deje el espacio vacío.**

---

## 3. Reglas para que el QR sí escanee (no negociables)

| Regla | Por qué |
|---|---|
| **Tamaño mínimo 2 cm × 2 cm** | Menos que eso, muchos celulares no enfocan. En la tarjeta que te di va a 1.9 cm y funciona porque el margen es correcto. |
| **Margen blanco alrededor** (zona de silencio) | El lector necesita ~4 módulos de blanco al borde. *Sin esto no lee* — me pasó al armar tu tarjeta y tuve que corregirlo. |
| **Oscuro sobre claro, nunca al revés** | QR claro sobre fondo oscuro falla en muchos lectores. Si el fondo es oscuro, pon el QR dentro de un **recuadro blanco**. |
| **Nada de degradados ni fotos debajo** | El código debe ir sobre color plano. |
| **Contraste fuerte** | Morado oscuro sobre blanco: perfecto. Gris sobre gris: no lee. |
| **No lo estires** | Siempre cuadrado. Si lo deformas, muere. |
| **Pruébalo impreso** antes de mandar 1000 | Imprime una hoja de prueba y escanéala con 2 o 3 celulares distintos. |

---

## 4. Paleta de BlackHouse OS

| Uso | Color | Hex |
|---|---|---|
| Morado principal | Identidad de marca | `#7c3aed` |
| Morado profundo | Fondos | `#2a1157` |
| Morado casi negro | Fondo degradado | `#12071f` |
| Lila claro | Acentos y "OS" | `#a78bfa` |
| Verde éxito | Precio / llamada a la acción | `#7ee787` |
| Blanco | Texto principal | `#ffffff` |

**Combinación que funciona:** fondo morado oscuro degradado → texto blanco → acentos lila →
el precio en verde (el ojo va directo al precio).

---

## 5. Textos que venden (copy sugerido)

**Titular (elige uno):**
- "Ordena tu taller en un solo lugar"
- "Deja de anotar en cuaderno"
- "Tu taller bajo control desde el celular"
- "El sistema que tu taller de celulares necesita"

**Beneficios (máximo 2 líneas, sin tecnicismos):**
> Órdenes y técnicos · Inventario y caja
> Boletas · Ventas desde el celular · IA

**Precio (ponlo, no lo escondas):**
> Desde S/ 400 al año

**Llamada a la acción junto al QR:**
> "Escanéame — ver demo y precios"

**Contacto:**
> 912 382 709 · rafitox35@gmail.com

---

## 6. PROMPTS listos para copiar

> 📌 En todos: la IA hace **el fondo**, tú pegas el QR después.

### Prompt 1 — Tecnológico premium (el que recomiendo)

```
Diseño de tarjeta de presentación horizontal, 90x50 mm, para un software de gestión
de talleres de reparación de celulares llamado "BlackHouse OS".

Estilo: tecnológico, premium, moderno, limpio.
Fondo: degradado morado profundo, de #4c1d95 a #12071f, con un sutil brillo violeta
en la esquina superior izquierda y líneas de circuito muy tenues de fondo.
Acentos en lila #a78bfa.

IMPORTANTE: deja el TERCIO DERECHO de la tarjeta como un espacio limpio y vacío,
con un cuadrado blanco sólido de 20x20 mm centrado ahí, donde después pegaré un
código QR real. No dibujes ningún código QR ni cuadritos.

Deja también espacio libre a la izquierda para poner texto encima.
Sin texto, sin letras, sin logotipos. Alta resolución, apto para impresión, 300 dpi.
```

### Prompt 2 — Minimalista blanco (elegante, barato de imprimir)

```
Tarjeta de presentación horizontal 90x50 mm, estilo minimalista y elegante, fondo
blanco puro con una franja delgada de degradado morado (#7c3aed a #a78bfa) en el
borde superior y una forma geométrica suave morada muy clara en la esquina inferior
derecha.

Deja un cuadrado blanco limpio de 20x20 mm en el lado derecho para colocar después
un código QR. No dibujes el QR.

Mucho espacio en blanco, aire, aspecto profesional de software. Sin texto ni logos.
Alta resolución para impresión, 300 dpi.
```

### Prompt 3 — Impactante / llamativo (para ferias y volanteo)

```
Tarjeta horizontal 90x50 mm para software de talleres de celulares. Estilo audaz y
llamativo: fondo negro con destellos morados neón (#7c3aed) tipo tecnología,
partículas de luz suaves y un ligero efecto de vidrio.

Reserva un área rectangular limpia en el lado derecho con un cuadrado blanco sólido
de 20x20 mm para un código QR que agregaré después. No generes el código QR.

Debe verse caro y moderno, como publicidad de una app. Sin texto. 300 dpi,
listo para imprenta.
```

### Prompt 4 — En inglés (muchos generadores responden mejor)

```
Horizontal business card design, 90x50 mm, for a phone-repair shop management
software called "BlackHouse OS". Premium tech aesthetic, deep purple gradient
background (#4c1d95 to #12071f), subtle violet glow top-left, faint circuit-board
lines, lilac accents (#a78bfa).

CRITICAL: leave the right third completely clean, with a solid white 20x20 mm
square centered there where I will paste a real QR code later. Do NOT draw any
QR code or pixel squares. Leave clear space on the left for text overlay.

No text, no letters, no logos. Print-ready, 300 dpi, sharp, professional.
```

### Prompt 5 — Reverso de la tarjeta

```
Reverso de tarjeta de presentación, 90x50 mm, mismo estilo morado tecnológico.
Fondo morado oscuro liso (#2a1157) con un patrón geométrico muy sutil, apenas
visible, y un brillo suave al centro.

Deja el centro despejado para colocar texto encima (lista de beneficios y datos
de contacto). Sin texto, sin logos, sin QR. 300 dpi para impresión.
```

---

## 7. Cómo armarla paso a paso (gratis, con Canva)

1. Entra a **canva.com** → *Crear diseño* → **Tamaño personalizado: 90 × 50 mm**.
2. Sube el **fondo** que generó la IA y ajústalo para que cubra toda la tarjeta.
3. Sube el **QR real** (el archivo `qr_venta.png` que te entregué).
4. Colócalo sobre el cuadrado blanco. Tamaño: **2 cm × 2 cm**. Mantén la proporción
   (arrastra por la **esquina**, nunca por el costado).
5. Agrega los textos del punto 5. Fuente sugerida: **Inter, Poppins o Montserrat**, en **Bold** para
   el titular.
6. Descarga como **PDF para imprimir**, con marcas de recorte y sangrado.
7. **Escanea el PDF desde la pantalla** con tu celular para comprobar que el QR funciona.

> ⏱️ Si no quieres diseñar nada: **ya te dejé la tarjeta lista** (`tarjeta_venta_blackhouse.pdf`),
> a 90×50 mm exactos y con el QR verificado. Puedes mandarla directo a la imprenta.

---

## 8. Checklist antes de mandar a imprenta

- [ ] El QR escanea desde la pantalla **y** desde una impresión de prueba
- [ ] Probado con **2 o 3 celulares** distintos (Android y iPhone)
- [ ] El QR mide **2 cm o más** y tiene margen blanco alrededor
- [ ] Tamaño del archivo: **90 × 50 mm** con **3 mm de sangrado** (96 × 56 mm total)
- [ ] Resolución **300 dpi**, colores en **CMYK** (pídele el perfil a tu imprenta)
- [ ] Ningún texto a menos de **4 mm** del borde (se puede cortar)
- [ ] Teléfono y correo **bien escritos** (revísalos dos veces)
- [ ] El precio es el correcto (S/ 400 nacional · $95 internacional)

**Material sugerido:** couché mate 300 g con plastificado mate. Se ve caro y no se marca con los dedos.
El barniz brillante puede reflejar y dificultar el escaneo del QR.

---

## 9. Ideas para que rinda más

- **Sticker circular** (5 cm) con el QR para pegar en el mostrador de otros talleres o en tu vitrina.
- **Cartel A5** para ferias: mismo diseño, QR de **8 cm** (se escanea desde lejos).
- **Colgante para el equipo entregado:** tarjeta pequeña que va con cada celular reparado.
- **Fondo de WhatsApp / estado:** la misma imagen en vertical, el QR se escanea desde otra pantalla.
- **Dos QR distintos** si quieres medir: uno en las tarjetas y otro en los carteles, con enlaces
  levemente distintos, para saber cuál te trae más clientes.
- **Al reverso, una frase corta:** *"Pruébalo gratis, sin compromiso"* funciona mejor que una lista larga.

---

## 10. Errores comunes (evítalos)

| Error | Qué pasa |
|---|---|
| Pedirle el QR a la IA | Dibuja uno falso que no escanea |
| QR chiquito "para que se vea elegante" | Nadie lo puede escanear |
| QR sin margen blanco | No lee (aunque se vea bien) |
| QR encima de una foto o degradado | Falla en la mitad de los celulares |
| Estirarlo para que "encaje" | Deja de funcionar |
| Imprimir 1000 sin probar | El error más caro de todos |
