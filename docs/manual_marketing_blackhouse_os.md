# BlackHouse OS — Manual Técnico-Comercial de Funciones y Estrategia de Marketing

BlackHouse OS es el sistema de gestión definitiva (ERP/CRM/POS) diseñado específicamente para laboratorios de microsoldadura, talleres de reparación de dispositivos móviles y tiendas de repuestos de tecnología en entornos multiempresa.

---

## 🚀 1. Propuesta de Valor y Diferenciadores de Mercado

Para vender BlackHouse OS, es fundamental comprender por qué es superior a cualquier software de inventario genérico (como Odoo, Zoho o sistemas POS tradicionales):

1. **Diseño de Nicho Extremo:** No es un POS adaptado; está construido conociendo el dolor real de un taller (separación de pantallas, costos multiproveedor, bitácoras de laboratorio, mediciones en placa).
2. **Inteligencia Artificial Nativa:** Integra modelos avanzados (Llama 3 y Gemini) para automatizar el pre-diagnóstico de recepción, guiar a los técnicos en fallas de microsoldadura, e importar inventarios masivos desde una simple fotografía de factura.
3. **Seguridad Nivel Enterprise (RLS):** Aislamiento multi-inquilino real. El módulo de vendedor del Punto de Venta (POS) está blindado a nivel de motor de base de datos (Row-Level Security), impidiendo fugas de costos o información del administrador hacia el personal de mostrador.
4. **Resiliencia Offline-First:** Las fallas de internet no detienen la operación del negocio. Electron procesa el stock y las transacciones de ventas mediante Workers asíncronos locales sobre SQLite, sincronizándose automáticamente al restablecerse la red sin congelar la interfaz de usuario.
5. **Portal Público de Rastreo y Venta:** Ningún competidor del rubro ofrece un portal web para el cliente final con timeline en vivo, video/streaming de la reparación y una tienda de accesorios integrada — no es solo gestión interna, es una herramienta de cara al cliente que genera ventas extra por sí sola.
6. **Holograma 3D y Comunidad de Talleres:** Los técnicos arman un modelo 3D real pieza por pieza de cada equipo, alimentando una base de conocimiento compartida entre todos los talleres que usan BlackHouse OS — una demostración visual única para el cliente en el mostrador.
7. **Un Asistente con Personalidad Propia (J.P.):** No es un chatbot genérico de soporte: vigila el negocio en tiempo real, avisa proactivamente de problemas, celebra logros y capacita a personal nuevo con tutoriales guiados — un diferenciador emocional que ningún ERP/POS tradicional tiene.

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

#### F14. Recuperación de Contraseña y Sesión Recordada
*   **Descripción Técnica:** Los usuarios restablecen su clave desde la web sin depender de soporte técnico, y la sesión se mantiene activa entre reinicios mediante un token que se renueva solo.
*   **Beneficio para Marketing:** **"Nunca dependes de nadie para volver a entrar."** Ni el dueño ni sus técnicos pierden tiempo pidiendo ayuda para recuperar el acceso al sistema.

---

### MÓDULO: LABORATORIO — GRABACIÓN, TRANSMISIÓN EN VIVO Y HOLOGRAMA 3D

#### F15. Estudio de Grabación de Reparaciones
*   **Descripción Técnica:** Combina microscopio, pantalla del equipo y cámara frontal en un solo video con overlays de marca (estilo streaming profesional), guardado localmente y subido a la nube ligado a la orden.
*   **Beneficio para Marketing:** **"Evidencia en video de cada reparación."** Deja atrás las dudas o reclamos: hay un video real de cómo se trabajó el equipo, con la calidad de un canal profesional.

#### F16. Transmisión en Vivo de la Reparación
*   **Descripción Técnica:** Vía WebRTC y Supabase Realtime, retransmite en vivo lo que el técnico está reparando; el cliente lo ve conectándose desde el mismo link de rastreo de su orden.
*   **Beneficio para Marketing:** **"Tu cliente ve la reparación en tiempo real, no una promesa."** Ningún competidor ofrece esto: el cliente observa desde su celular exactamente qué le están haciendo a su equipo mientras espera.

#### F17. Holograma 3D del Equipo (pieza por pieza, comunidad de talleres)
*   **Descripción Técnica:** El técnico fotografía y nombra cada pieza real mientras desarma un equipo, guiado paso a paso por las 6 caras de cada componente, armando una vista 3D interactiva. La base de fotos se comparte entre todos los talleres que usan BlackHouse OS (estadísticas de fallas comunes, piezas similares, moderación básica), con reporte en PDF y captura de pantalla.
*   **Beneficio para Marketing:** **"El primer holograma 3D de reparaciones del mercado."** Una demostración visual espectacular para el cliente en el mostrador, y un banco de conocimiento colectivo: cada taller se beneficia de lo que fotografiaron los demás.

#### F18. Copiloto de Microsoldadura, Calculadora de Ohm y Repositorio de Firmware
*   **Descripción Técnica:** Ley de Ohm y diagnóstico de consumo calculados al instante, más acceso directo a una carpeta de firmwares del taller, todo dentro del Laboratorio.
*   **Beneficio para Marketing:** **"Todas las herramientas del técnico en un solo lugar."** Sin alternar entre calculadoras, carpetas sueltas y la app: todo integrado.

#### F19. Software "Ambición" Integrado con Candado de Sesión
*   **Descripción Técnica:** Herramienta externa de utilidades de reparación (flasheo/diagnóstico) lanzada con un clic desde el Laboratorio, con un token de un solo uso que impide abrirla fuera de BlackHouse OS.
*   **Beneficio para Marketing:** **"Un arsenal técnico bajo un solo login."** Ahorra tiempo y evita licencias sueltas descontroladas entre los técnicos.

---

### MÓDULO: VENTAS, POS Y CAJA

#### F20. Punto de Venta Rápido para Cualquier Rol
*   **Descripción Técnica:** Dueño, técnico o vendedor pueden vender productos sueltos sin abrir una orden de taller, con carrito, medio de pago (efectivo, Yape/Plin, tarjeta, transferencia) y venta de artículos fuera de catálogo, imprimiendo ticket 80mm con el logo del negocio.
*   **Beneficio para Marketing:** **"Tu taller también es tu tienda."** Vende un cargador o una mica sin tener que crear una orden de reparación falsa para registrarlo.

#### F21. Venta Móvil para la Vendedora (POS desde el celular)
*   **Descripción Técnica:** La vendedora vende desde una app en su propio celular conectada al mismo inventario en tiempo real, con carrito, boleta informativa enviada por WhatsApp, y cierre de caja diario que muestra solo sus propias ventas.
*   **Beneficio para Marketing:** **"Tu vendedora no necesita estar sentada frente a la computadora."** Vende desde donde esté, y cuadra caja sola sin depender del dueño.

#### F22. Cierre del Día Unificado (Libro de Caja)
*   **Descripción Técnica:** Suma automáticamente lo que entró (adelantos, saldos cobrados, ventas POS) menos lo que salió (gastos, compras externas, devoluciones) para dar el neto real del día, con historial guardado y exportación a Excel con el formato exacto de la plantilla de reportes.
*   **Beneficio para Marketing:** **"El cuadre de caja que antes tomaba una hora, ahora toma un clic."** Cero calculadora, cero Excel armado a mano cada noche.

#### F23. Comisiones, Costo Real de Repuestos y Caja Personalizada del Técnico
*   **Descripción Técnica:** Calcula la comisión del técnico (50% de la mano de obra) como nota aparte, descuenta el costo real del repuesto (no el precio cobrado) para la ganancia neta, alerta si un repuesto cuesta más de lo cobrado, y muestra al técnico solo lo que él generó.
*   **Beneficio para Marketing:** **"Cada técnico ve su propio desempeño, tú ves la ganancia real."** Transparencia con el equipo sin exponer las finanzas completas del negocio.

#### F24. Métricas Premium, Más Vendidos e Historial de Facturación
*   **Descripción Técnica:** Panel de indicadores con gráficos y comparación contra el período anterior, ranking de productos/servicios más vendidos, e historial de comprobantes con reimpresión desde cualquier momento.
*   **Beneficio para Marketing:** **"Decisiones de negocio basadas en datos reales, no en intuición."** Sabe qué se vende más y cuánto ganó realmente el mes pasado en segundos.

#### F25. Cotizaciones, Garantías y Etiquetas (Módulos Enterprise)
*   **Descripción Técnica:** Genera cotizaciones en PDF antes de aceptar un trabajo, certificados de garantía en PDF con código QR a partir de un comprobante ya emitido, y etiquetas imprimibles de producto (nombre, precio, SKU y código de barras) listas para pegar en el estante.
*   **Beneficio para Marketing:** **"Papelería de nivel corporativo, sin pagar por un diseñador."** Cotiza, respalda tus garantías y organiza tu estante como una cadena grande, aunque tengas un solo local.

#### F26. Devoluciones de Clientes
*   **Descripción Técnica:** Procesa devoluciones ligadas o no a una factura, reintegrando stock automáticamente si el producto vuelve en buen estado.
*   **Beneficio para Marketing:** **"Devoluciones ordenadas, sin descuadrar el inventario."**

---

### MÓDULO: "J.P." — EL ASISTENTE ANIMADO CON PERSONALIDAD

#### F27. J.P., el Robot que Enseña, Vigila y Acompaña
*   **Descripción Técnica:** Personaje animado con nombre, emociones y voz hablada que: (1) explica cada parte de la app cuando detecta un uso incorrecto, (2) responde preguntas en lenguaje natural sobre 27 temas del sistema, (3) revisa el negocio cada 5 minutos y avisa una vez al día de equipos listos sin entregar, órdenes atascadas o reparaciones caras sin adelanto, (4) celebra hitos y buenos márgenes, y (5) guía tutoriales paso a paso a usuarios nuevos.
*   **Beneficio para Marketing:** **"El único software del rubro con un asistente que realmente se preocupa por tu negocio."** No es un chatbot genérico: conoce tus números reales, avisa antes de que un problema se vuelva grande, y hace que capacitar a personal nuevo sea mucho más rápido.

---

### MÓDULO: PERSONALIZACIÓN VISUAL

#### F28. Temas Visuales y Personalización del Ticket
*   **Descripción Técnica:** Cuatro temas seleccionables (Original, Negro, Blanco, "Doha-cell" de marca) con tema por defecto configurable por empresa, más personalización completa del comprobante (logo, mensaje de agradecimiento, nota al pie, qué datos mostrar) con vista previa en vivo.
*   **Beneficio para Marketing:** **"El software se viste con los colores de tu marca."** Desde la interfaz que usan tus técnicos hasta el ticket que recibe el cliente, todo puede llevar tu identidad.

---

### MÓDULO: PANEL WEB Y APP MÓVIL

#### F29. Panel Web del Dueño (Monitor Gerencial desde Cualquier Lugar)
*   **Descripción Técnica:** Accesible desde cualquier navegador o celular: Monitor Móvil con KPIs y feed en vivo de la actividad del taller, Ventas Móviles con ranking por vendedor, Cierre de Caja, Asistencia del personal, y Agenda de pendientes.
*   **Beneficio para Marketing:** **"Tu taller en el bolsillo, aunque no estés ahí."** El dueño supervisa todo — ventas, asistencia, caja — sin tener que estar físicamente sentado en la computadora del negocio.

#### F30. Paneles Móviles para Vendedor y Técnico
*   **Descripción Técnica:** `panel-vendedor.html` y `panel-tecnico.html`: apps web ligeras (instalables como PWA) para que la vendedora venda y el técnico reciba equipos nuevos y consulte stock desde su propio celular, con búsqueda por grupos de modelos compatibles igual que en el escritorio.
*   **Beneficio para Marketing:** **"Todo tu equipo trabaja desde su celular, sin instalar nada complicado."**

---

### MÓDULO: PORTAL DE RASTREO DEL CLIENTE (WEB PÚBLICA)

#### F31. Rastreo de Reparación por Código QR
*   **Descripción Técnica:** Cada orden genera un link/QR único que el cliente escanea para ver, sin llamar al taller: una línea de tiempo visual de 4 pasos (Recibido → En Proceso → Completado → Entregado), sin necesidad de crear una cuenta.
*   **Beneficio para Marketing:** **"Reduce hasta en un 70% las llamadas preguntando '¿ya está listo?'."** Transparencia total, disponible 24/7, sin que nadie del taller tenga que atender el teléfono.

#### F32. Datos Protegidos por Token de Seguridad
*   **Descripción Técnica:** El link de rastreo incluye un código único e imposible de adivinar; solo con el link correcto (no con el número de orden a secas) el cliente ve información sensible como saldo pendiente, foto de evidencia de recepción y nombre real del taller.
*   **Beneficio para Marketing:** **"Transparencia con el cliente, sin exponer datos de nadie más."** La privacidad de cada cliente y cada taller queda protegida por diseño.

#### F33. Video y Transmisión en Vivo desde el Rastreo
*   **Descripción Técnica:** El mismo portal de rastreo reproduce el video grabado de la reparación o conecta en vivo con la transmisión del Laboratorio, cuando el taller la habilita.
*   **Beneficio para Marketing:** **"El cliente ve su equipo siendo reparado, en tiempo real, desde su casa."**

#### F34. Tienda "Mientras Esperas" — Venta de Accesorios desde el Rastreo
*   **Descripción Técnica:** El cliente ve, en una vitrina con fotos tipo tienda virtual, los accesorios del taller y la mica exacta compatible con su propio modelo de equipo (comparación inteligente por código de modelo). El pedido se guarda como pendiente — el precio y stock siempre se validan en el servidor — y llega como notificación al escritorio del taller para que un técnico lo revise y lo sume a la cuenta del cliente.
*   **Beneficio para Marketing:** **"Convierte cada cliente que espera en una venta extra, sin que nadie tenga que ofrecerle nada."** Un canal de venta adicional que funciona solo, 24/7, integrado al mismo sistema.

#### F35. Botón de WhatsApp al Taller Real
*   **Descripción Técnica:** El botón de contacto en el portal de rastreo llama al WhatsApp real del taller que atiende esa orden (no a un número genérico de soporte del software).
*   **Beneficio para Marketing:** **"El cliente habla directo con SU taller."**

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
