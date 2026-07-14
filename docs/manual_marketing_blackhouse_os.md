# BlackHouse OS — Manual Técnico-Comercial de Funciones y Estrategia de Marketing

BlackHouse OS es el sistema de gestión definitiva (ERP/CRM/POS) diseñado específicamente para laboratorios de microsoldadura, talleres de reparación de dispositivos móviles y tiendas de repuestos de tecnología en entornos multiempresa.

---

## 🚀 1. Propuesta de Valor y Diferenciadores de Mercado

Para vender BlackHouse OS, es fundamental comprender por qué es superior a cualquier software de inventario genérico (como Odoo, Zoho o sistemas POS tradicionales):

1. **Diseño de Nicho Extremo:** No es un POS adaptado; está construido conociendo el dolor real de un taller (separación de pantallas, costos multiproveedor, bitácoras de laboratorio, mediciones en placa).
2. **Inteligencia Artificial Nativa:** Integra modelos avanzados (Llama 3 y Gemini) para automatizar el pre-diagnóstico de recepción, guiar a los técnicos en fallas de microsoldadura, e importar inventarios masivos desde una simple fotografía de factura.
3. **Seguridad Nivel Enterprise (RLS):** Aislamiento multi-inquilino real. El módulo de vendedor del Punto de Venta (POS) está blindado a nivel de motor de base de datos (Row-Level Security), impidiendo fugas de costos o información del administrador hacia el personal de mostrador.
4. **Resiliencia Offline-First:** Las fallas de internet no detienen la operación del negocio. Electron procesa el stock y las transacciones de ventas mediante Workers asíncronos locales sobre SQLite, sincronizándose automáticamente al restablecerse la red sin congelar la interfaz de usuario.

---

## 🛠️ 2. Análisis Exhaustivo de Módulos y Funciones

A continuación, se detalla una a una cada función del sistema, su especificación técnica y el ángulo comercial ideal para venderla:

---

### MÓDULO: RECEPCIÓN Y ADMISIÓN DE DISPOSITIVOS

#### F1. Ingreso Inteligente de Órdenes de Servicio
*   **Descripción Técnica:** Formulario de admisión que recopila marca, modelo, número de serie/IMEI, estado estético del equipo (rayones, golpes), observaciones de ingreso, costo estimado del trabajo, abono inicial y fecha programada de entrega.
*   **Beneficio para Marketing:** **"Recepciones profesionales en menos de 1 minuto."** El cliente percibe confianza inmediata al ver que se documenta formalmente el estado en el que deja su costoso dispositivo, evitando reclamos injustificados por daños previos.

#### F2. Traducción de Fallas con Inteligencia Artificial (IA Recepción)
*   **Descripción Técnica:** Integra la API de OpenAI (`llama-3.1-8b-instant`) para analizar el reporte empírico del cliente (ej. *"el cliente dice que el cel se le cayó al agua y ahora no da luz pero sí vibra"*) y devolver un reporte estructurado de 3 partes: Posible causa técnica, Componentes principales a revisar y Dificultad estimada.
*   **Beneficio para Marketing:** **"Soporte inmediato para recepcionistas no-técnicos."** Permite que personal de ventas o atención al cliente reciba los equipos y dé un pre-diagnóstico técnico acertado al instante, sin necesidad de que el técnico principal deje su mesa de trabajo para evaluar el equipo.

#### F3. Impresión de Comprobantes Térmicos y Códigos QR
*   **Descripción Técnica:** Generación automatizada de tickets aptos para impresoras térmicas de 80mm/58mm. Cada ticket incluye un código QR único que apunta al portal web del cliente para verificar el estado de su reparación en tiempo real.
*   **Beneficio para Marketing:** **"Transparencia que fideliza."** Reduce las llamadas telefónicas de clientes preguntando *"¿ya está listo mi teléfono?"*. Los clientes escanean el código QR impreso en su ticket de recepción y revisan el avance del taller cómodamente desde su móvil.

---

### MÓDULO: TALLER Y TRABAJO TÉCNICO

#### F4. Mesa de Trabajo Virtual y Control de Estados
*   **Descripción Técnica:** Tablero Kanban interactivo que organiza las órdenes en estados: *Pendiente, En Proceso, Listo para Entrega, Entregado y Rechazado*. Los técnicos pueden cambiar los estados, añadir insumos del inventario utilizados para la reparación y registrar notas técnicas internas.
*   **Beneficio para Marketing:** **"Cuellos de botella eliminados."** El dueño del taller puede ver de un vistazo qué equipos están retrasados, qué técnicos están siendo más productivos y en qué etapa del proceso se encuentra cada reparación.

#### F5. Registro y Control de Repuestos Usados
*   **Descripción Técnica:** Permite vincular repuestos directamente del inventario a una orden de servicio abierta, descontando automáticamente el stock y cargando el costo de las partes al presupuesto de la orden para calcular la rentabilidad neta de la reparación.
*   **Beneficio para Marketing:** **"Cero fugas de stock en reparaciones."** Evita que los técnicos utilicen pantallas o conectores del stock general sin que estos queden debidamente cobrados y registrados en la cuenta final del cliente.

---

### MÓDULO: LABORATORIO Y MICROSOLDADURA AVANZADA

#### F6. Copiloto de Microsoldadura (IA Laboratorio)
*   **Descripción Técnica:** Agente de IA entrenado (`llama-3.1-8b-instant`) que actúa como un experto en microsoldadura. Al introducir síntomas complejos (ej. *"iPhone 13 no carga, consume 0.01A fijos en fuente"*), el sistema devuelve: Líneas de alimentación a medir (ej. PP_VCC_MAIN), Circuitos integrados (ICs) sospechosos (ej. Hydra, Tigris) y la Acción Técnica recomendada de nivel micro (ej. reballing, modo diodo).
*   **Beneficio para Marketing:** **"Un máster en hardware en tu equipo."** Eleva el nivel técnico de tu laboratorio. Permite resolver reparaciones complejas de placas mojadas o cortos circuitos en tiempo récord gracias a sugerencias de diagnóstico precisas y directas al grano.

---

### MÓDULO: CONTROL DE INVENTARIO PROFESIONAL

#### F7. Clasificación y Prefijos Automatizados por Categorías
*   **Descripción Técnica:** Sistema estructurado con 5 categorías principales: *Pantallas (PANT-), Accesorios (ACCE-), Repuestos de Celulares (REPU-), Micas (MICA-), Celulares (CEL-)*. Generación incremental y automática del SKU correlativo basado en la categoría elegida, aislado estrictamente por cada inquilino (`empresa_id`).
*   **Beneficio para Marketing:** **"Orden total desde el primer día."** Olvídate de los códigos de barra rotos o SKU mal creados. El sistema estandariza todo el catálogo de forma automática para facilitar las búsquedas físicas en las cajoneras del taller.

#### F8. Registro de Costos Multiproveedor
*   **Descripción Técnica:** La tabla de base de datos registra de manera separada los costos de compra para 4 de los proveedores de repuestos y pantallas más grandes (CAYCEL, SAMTEC, CYBERPHONE, AMOBILE), manteniendo visible el mejor precio de compra junto al Precio Público y Precio Mayorista.
*   **Beneficio para Marketing:** **"Negociación inteligente y márgenes protegidos."** Compara al instante cuál de tus distribuidores tiene la pantalla o repuesto al costo más bajo. El sistema te ayuda a comprar mejor para vender con mayor margen de ganancia.

#### F9. Importador de Excel con Coincidencia Inteligente
*   **Descripción Técnica:** Sistema que analiza archivos Excel masivos. Permite: 1. Actualizar el stock existente si coincide el SKU. 2. Vincular "productos huérfanos" mediante normalización de strings por nombre, asignándoles su nuevo SKU de forma permanente. 3. Registrar la procedencia del stock guardando el historial detallado del archivo importado en `movimientos_stock`.
*   **Beneficio para Marketing:** **"Carga de inventario en segundos, no días."** Migrar desde un inventario antiguo en Excel o subir el catálogo del mes de un proveedor es tan simple como arrastrar y soltar el archivo. La base de datos se limpia de duplicados y se actualiza al instante.

#### F10. Auditoría de Facturas por Visión Computacional (IA Inventario)
*   **Descripción Técnica:** Integración con Google Gemini (`gemini-1.5-flash`). Permite tomar una foto de una factura física de compra o una lista impresa de repuestos. La IA lee el documento, extrae los nombres de los productos, asigna la categoría idónea, extrae costos, precios sugeridos y stock, y permite agregarlos al inventario con un clic.
*   **Beneficio para Marketing:** **"Adiós al tipeo manual."** Si compraste 30 tipos de repuestos diferentes a un importador local, ya no tienes que tipear uno a uno en la computadora. Le tomas una foto a la factura de compra y la IA de BlackHouse OS ingresa todos los productos al sistema por ti.

#### F11. Historial de Ajuste y Control de Mermas (Stock Logs)
*   **Descripción Técnica:** Logs detallados de cada movimiento de inventario. Los ajustes manuales de stock requieren especificar el motivo y recalculan el valor acumulado en `movimientos_stock` con la nota de auditoría correspondiente, bloqueando stocks negativos.
*   **Beneficio para Marketing:** **"Control total contra robos hormiga."** Cada vez que un producto desaparece o se realiza un ajuste manual de inventario, queda registrado quién lo hizo y por qué, reduciendo drásticamente las mermas inexplicables a final de mes.

---

### MÓDULO: CONTROL DE ASISTENCIA Y OPERACIONES

#### F12. Registro de Jornada Laboral y Asistencia
*   **Descripción Técnica:** Registro de entrada y salida del personal mediante click directo. El backend almacena la hora, fecha, IP pública de conexión y datos de máquina, permitiendo auditar la puntualidad y asistencia real de los empleados.
*   **Beneficio para Marketing:** **"Control de personal descentralizado."** Supervisa las jornadas de tus técnicos y vendedores de forma remota, sabiendo exactamente a qué hora abrieron el taller y desde qué ubicación iniciaron sesión.

---

### MÓDULO: SEGURIDAD, ROLES Y MULTIEMPRESA (RLS)

#### F13. Aislamiento Estricto por Row-Level Security (RLS)
*   **Descripción Técnica:** Políticas de seguridad implementadas en la base de datos SQL para separar el acceso del rol `pos_vendedor` del rol administrativo. El vendedor solo puede consultar la vista enmascarada `vw_productos_pos`, la cual carece de columnas de costo y márgenes de ganancia.
*   **Beneficio para Marketing:** **"Privacidad absoluta de tus finanzas."** Puedes contratar personal de ventas sin temor a que vean cuánto te costó realmente cada pantalla o cuál es tu margen neto. Los vendedores solo ven lo necesario para facturar, protegiendo tus secretos comerciales.

---

## 📈 3. Estrategia y Prompts de Marketing para BlackHouse OS

Para promocionar BlackHouse OS, usaremos una estrategia enfocada en resolver la desorganización de los talleres de reparación. A continuación, se detallan los prompts de IA listos para copiar y pegar para generar contenido publicitario de alto impacto.

---

### PROMPT 1: Generación de Guiones para Reels / TikTok (Casos de Dolor del Cliente)
> **Instrucciones para la IA (Copiar y pegar en ChatGPT/Claude/Gemini):**
> 
> "Actúa como un Copywriter experto en marketing digital y ventas de software SaaS para el mercado técnico. Necesito un guion de video dinámico de 45 segundos para Reels/TikTok enfocado en dueños de talleres de celulares. 
> El gancho del video debe ser el dolor de perder dinero por repuestos no registrados o reclamos de clientes.
> Destaca las siguientes funciones de BlackHouse OS:
> 1. El ticket de recepción con código QR para que el cliente revise el estado en línea.
> 2. La importación de facturas de repuestos con solo tomar una foto (IA Vision).
> 3. El control de costos multiproveedor (Caycel, Samtec, etc.).
> 
> El tono debe ser enérgico, cercano, y terminar con un fuerte llamado a la acción para solicitar una demo. Escribe el guion con acotaciones visuales y de sonido paso a paso."

---

### PROMPT 2: Campaña de Email Marketing (Embudo de Nutrición de Leads)
> **Instrucciones para la IA (Copiar y pegar en ChatGPT/Claude/Gemini):**
> 
> "Actúa como un especialista en Email Marketing. Escribe una secuencia de 3 correos electrónicos altamente persuasivos dirigidos a dueños de laboratorios de servicio técnico de celulares que se registraron en nuestro sitio web pero aún no han contratado la licencia.
>
> - **Correo 1 (Asunto intrigante):** Enfócate en el problema del desorden en el taller y cómo BlackHouse OS unifica el tablero Kanban, la asistencia de personal y el stock en un solo lugar.
> - **Correo 2 (El poder de la IA):** Explica detalladamente cómo la IA integrada (Copiloto de microsoldadura para placas base y el traductor de fallas de recepción) puede hacer que un taller mediano trabaje al nivel de una franquicia internacional.
> - **Correo 3 (Prueba social y urgencia):** Enfocado en la seguridad y el retorno de inversión. Habla del aislamiento RLS (para que sus empleados no vean los costos de proveedores) y ofrece una oferta especial de lanzamiento por tiempo limitado.
> 
> Mantén los correos cortos, con saltos de línea legibles, y llamadas a la acción claras."

---

### PROMPT 3: Hilo de X (Twitter) Educativo sobre Gestión de Inventario
> **Instrucciones para la IA (Copiar y pegar en ChatGPT/Claude/Gemini):**
> 
> "Escribe un hilo de X (Twitter) de 7 tweets dirigido a la comunidad de técnicos y microempresarios de reparación de celulares. 
> El tema es: 'Los 5 errores que están destruyendo las ganancias de tu servicio técnico (y cómo solucionarlos con tecnología)'.
> Desarrolla de manera práctica:
> 1. No registrar el estado físico de ingreso (solución: ticket con QR).
> 2. Comprar pantallas sin comparar costos (solución: comparador multiproveedor).
> 3. Perder tiempo tipeando repuestos nuevos (solución: entrada por foto e IA).
> 4. Fugas de stock por técnicos distraídos (solución: vinculación automática de repuestos en órdenes).
> 5. Filtración de datos de costos al personal (solución: seguridad RLS a nivel base de datos).
> 
> Usa emojis apropiados, un lenguaje conciso y técnico pero accesible, y hashtags relevantes de la industria como #Microsoldadura, #ReparacionDeCelulares y #SaaS."

---

### PROMPT 4: Copywriting para Anuncios de Facebook & Instagram Ads (Meta Ads)
> **Instrucciones para la IA (Copiar y pegar en ChatGPT/Claude/Gemini):**
> 
> "Actúa como un experto en Meta Ads. Escribe 3 variantes de texto para anuncios (Copy + Título del anuncio) utilizando el método PAS (Problema, Agitación, Solución).
> 
> - **Variante A (Enfocada en el Técnico Senior/Dueño):** Habla de la frustración de pasar horas diagnosticando placas base complicadas. Presenta como solución el Asistente IA de Laboratorio de BlackHouse OS que sugiere líneas a medir e ICs sospechosos.
> - **Variante B (Enfocada en la Administración/Inventario):** Habla del caos de contar tornillos, flexes y pantallas a fin de mes. Presenta la importación inteligente por Excel y la IA que lee facturas con fotos.
> - **Variante C (Enfocada en Seguridad):** Habla del miedo a que los empleados se enteren de los márgenes netos o se lleven información. Explica el RLS del rol vendedor.
> 
> Incluye recomendaciones para el tipo de imagen o video que debería acompañar a cada variante."
