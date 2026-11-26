# Mapa del código — BlackHouse OS (generado automáticamente)

No editar a mano. Regenerar con `node scripts/mapa-codigo.js` cuando
el código cambie de forma importante (nuevas funciones, modales, IPC).

Uso: antes de modificar `index.html` o `main.js`, busca aquí (con Grep,
no leyendo este archivo entero tampoco hace falta) el nombre de la función,
el id del modal o el canal IPC que te interesa, toma el número de línea,
y lee solo ese rango del archivo real con Read (offset/limit).

# index.html


## index.html — comentario

| Línea | Tipo | Nombre / Texto |
|---|---|---|
| 24 | comentario | Holograma 3D del Laboratorio: three.js incluido localmente (assets/vendor/three) para que funcione sin internet |
| 2189 | comentario | Interruptor del ayudante animado (siempre visible para cualquiera) |
| 2201 | comentario | BARRA SUPERIOR (Corregida con todos sus cierres) |
| 2446 | comentario | HOLOGRAMA 3D: Diagnóstico visual del equipo |
| 2463 | comentario | Estadísticas comunitarias: qué se marcó dañado más seguido en este modelo |
| 2468 | comentario | Piezas de ESTA sesión: se van agregando a medida que fotografías/grabas cada una |
| 2590 | comentario | ---------- EQUIPO ---------- |
| 2613 | comentario | ---------- FASE 1: PERIFÉRICOS ---------- |
| 2649 | comentario | ---------- FASE 2: CONSUMO (lógica que antes vivía en su propio modal) ---------- |
| 2676 | comentario | ---------- FASE 2: RUTA DE ENCENDIDO (los 4 pasos de siempre) ---------- |
| 2686 | comentario | Pasos |
| 2734 | comentario | Resumen de la ruta |
| 2741 | comentario | ---------- INFORME ---------- |
| 2765 | comentario | Modal: VUELTA 360° de una pieza (Opción A del holograma) |
| 2775 | comentario | Instrucciones paso a paso (plegadas por defecto) |
| 2804 | comentario | Visor / previsualización |
| 2835 | comentario | Modal: Fotografiar pieza para el Holograma 3D |
| 2854 | comentario | Modo guiado: la app va pidiendo cara por cara con instrucciones |
| 2866 | comentario | Modo manual (guiado desactivado): elegir cara suelta |
| 2936 | comentario | Modal: Historial privado de este modelo en TU taller |
| 2948 | comentario | Modal: Buscar piezas en modelos similares (referencia visual) |
| 2968 | comentario | Modal: Abrir un modelo ya guardado en la librería (sin necesitar una orden) |
| 2981 | comentario | Modal: Comparar Antes / Después de una pieza |
| 3001 | comentario | ============ VENTA RÁPIDA (POS de escritorio, para todos los roles) ============ |
| 3042 | comentario | Modal: producto libre (venta sin stock) |
| 3122 | comentario | La mano de obra ya no se escribe: sale de restarle el repuesto al total. |
| 3257 | comentario | Stats Row |
| 3287 | comentario | Search |
| 3298 | comentario | Table |
| 3323 | comentario | Las tarjetas se poblarán dinámicamente |
| 3369 | comentario | Pestañas de Navegación de Inventario |
| 3441 | comentario | ================= NUEVO BLOQUE ================= |
| 3448 | comentario | ================================================= |
| 3454 | comentario | Sugerencias de Accesorios |
| 3474 | comentario | Sugerencias de Repuestos |
| 3494 | comentario | Sugerencias de Micas |
| 3512 | comentario | Selector de Modelo para Pantallas y Micas |
| 3789 | comentario | NUEVA SECCIÓN: MI PERFIL |
| 3794 | comentario | FOTO DE PERFIL |
| 3816 | comentario | DATOS |
| 3935 | comentario | ============ APARIENCIA / TEMA ============ |
| 3944 | comentario | ORIGINAL |
| 3958 | comentario | NEGRO |
| 3972 | comentario | BLANCO |
| 3986 | comentario | DOHA-CELL (marca) |
| 4000 | comentario | PREMIUM |
| 4021 | comentario | ============ TICKET / COMPROBANTE (personalización de impresión) ============ |
| 4030 | comentario | Formulario |
| 4085 | comentario | Vista previa en vivo (80mm) |
| 4161 | comentario | NUEVA SECCIÓN: DISTRIBUIDORES |
| 4180 | comentario | Se poblará dinámicamente |
| 4186 | comentario | PANEL DE LICENCIAS (solo casa matriz) |
| 4233 | comentario | COLA DE REVISIÓN DEL CATÁLOGO COMPARTIDO DE MODELOS |
| 4283 | comentario | Quick Stats |
| 4316 | comentario | Calendar Grid |
| 4348 | comentario | Modal Nuevo Evento (Si no existe) |
| 4414 | comentario | Monitor de Actividad + Caja de Errores: solo casa matriz (empresa 1), ve TODOS los talleres |
| 4493 | comentario | Vacío = alta nueva; con id = se está corrigiendo la ficha de ese cliente. |
| 4543 | comentario | Modal Nuevo Proveedor |
| 4586 | comentario | Modal Nuevo / Editar Reseller |
| 4643 | comentario | Modal Selector de Modelos Premium |
| 4653 | comentario | De dónde salen los modelos: el almacén propio o el catálogo mundial |
| 4676 | comentario | Grid de marcas comunes |
| 4678 | comentario | Se poblará dinámicamente con JS |
| 4687 | comentario | Listado de modelos |
| 4690 | comentario | Se poblará dinámicamente con JS |
| 4701 | comentario | Modal Crear/Editar Grupo de Compatibilidad |
| 4749 | comentario | Modal Importar Grupos de Compatibilidad desde archivo (Fase 5) |
| 4808 | comentario | Modal Escáner de IMEI/código de barras por cámara web (Recepción) |
| 4857 | comentario | Modal Registrar Devolución |
| 4963 | comentario | Modal de Selección de Categoría para Excel |
| 4995 | comentario | Modal de Importación Excel |
| 5056 | comentario | MODAL VISTA TIENDA DEL PRODUCTO |
| 5090 | comentario | MODAL IMPRIMIR ETIQUETA |
| 5114 | comentario | CONTENEDOR PARA IMPRESIÓN (OCULTO EN PANTALLA, VISIBLE EN IMPRESIÓN) |
| 5117 | comentario | MODAL DETALLE DE PRODUCTO (SÓLO LECTURA Y EDICIÓN PARCIAL) |
| 5128 | comentario | Bloque 1: Datos Generales |
| 5191 | comentario | Bloque 2: Costos por proveedor (Condicional) |
| 5214 | comentario | Bloque 3: Precios de venta |
| 5229 | comentario | Bloque 4: Historial de Ingresos |
| 5316 | comentario | Modal: elegir formato del comprobante ya emitido (PDF o Ticket) |
| 5340 | comentario | ===== ESTUDIO DE GRABACIÓN DE REPARACIONES ===== |
| 5357 | comentario | Vista previa: lo que se ve aquí es exactamente lo que se graba |
| 5366 | comentario | Escenas |
| 5378 | comentario | Configuración de fuentes y vinculación |
| 5444 | comentario | Controles |
| 5462 | comentario | Modal: Vincular la cámara del celular por WiFi al Estudio de Grabación |
| 5507 | comentario | Modal: Cobro adicional (otra falla / trabajo extra encontrado en la reparación) |
| 5545 | comentario | Modal: Bloqueo del equipo (Patrón / Clave / Contraseña) |
| 5556 | comentario | PATRÓN: 9 puntos para dibujar |
| 5565 | comentario | CLAVE: teclado numérico |
| 5584 | comentario | CONTRASEÑA: escribir |
| 5599 | comentario | Modal: Repuesto externo (traído de otro proveedor) |
| 5637 | comentario | Modal: Reponer stock (agotados y por agotarse, agrupados por categoría) |
| 5652 | comentario | Modal: Más vendidos por categoría (según el período elegido en Métricas) |
| 5670 | comentario | Modal: Detalle de orden (datos de Recepción: foto de evidencia y firma del cliente) |
| 5707 | comentario | Modal: Selector de tema (visible para TODOS los roles desde el botón del sidebar) |
| 5730 | comentario | Modal: Cierre del Día unificado (taller + POS − gastos − compras − devoluciones) |
| 5754 | comentario | Modal: Registrar gasto operativo |
| 5792 | comentario | Modal: Compras externas del día (cierre por proveedor) |
| 5806 | comentario | Modal: Cambiar Contraseña dentro de la app |
| 5837 | comentario | Cabecera con info del canal activo |
| 5856 | comentario | Pestañas de canales temáticos |
| 5877 | comentario | Área de mensajes |
| 5880 | comentario | Indicador de escritura |
| 5886 | comentario | Input de mensaje |
| 5900 | comentario | MARCA DE AGUA (Solo para Notas de Venta) |
| 5906 | comentario | ENCABEZADO |
| 5939 | comentario | DATOS DEL CLIENTE |
| 5965 | comentario | TABLA DE DETALLES |
| 5995 | comentario | TOTALES Y PIE DE PÁGINA |
| 8286 | comentario | TARJETAS PRINCIPALES DE LIQUIDACIÓN |
| 8288 | comentario | Efectivo en caja física |
| 8298 | comentario | Dinero Digital / Bancos |
| 8308 | comentario | Neto General del Día |
| 8319 | comentario | CHIPS DE DESGLOSE POR MÉTODO DE PAGO |
| 17379 | comentario | TICKET DE ORDEN (oculto, solo para html2canvas) |
| 17422 | comentario | QR de rastreo individual por orden |
| 17653 | comentario | ================= AYUDANTE ANIMADO (robot con puerta) ================= |
| 17677 | comentario | Marco y hueco de la puerta |
| 17679 | comentario | El robot sube desde dentro del hueco |
| 17681 | comentario | antena |
| 17684 | comentario | cabeza |
| 17687 | comentario | visor |
| 17691 | comentario | boca: recta normal, sonrisa y tristeza (se alternan según la emoción) |
| 17699 | comentario | orejas |
| 17702 | comentario | cuerpo |
| 17706 | comentario | brazo que saluda |
| 17710 | comentario | Hojas de la puerta |


## index.html — modal

| Línea | Tipo | Nombre / Texto |
|---|---|---|
| 2576 | modal | diagnostico-placa |
| 2766 | modal | holo-giro |
| 2836 | modal | holo-foto |
| 2937 | modal | holo-historial |
| 2949 | modal | holo-similares |
| 2969 | modal | holo-modelos |
| 2982 | modal | holo-comparar |
| 3043 | modal | venta-libre |
| 4349 | modal | evento |
| 4490 | modal | cliente |
| 4495 | modal | cliente-aviso |
| 4519 | modal | usuario |
| 4544 | modal | proveedor |
| 4587 | modal | reseller |
| 4644 | modal | selector-modelos |
| 4702 | modal | grupo-compat |
| 4750 | modal | importar-compat |
| 4809 | modal | scanner-imei |
| 4858 | modal | registrar-devolucion |
| 4936 | modal | confirm-custom |
| 4950 | modal | confirm-ai |
| 4964 | modal | categoria-excel |
| 4996 | modal | excel-import |
| 5057 | modal | ver-tienda-producto |
| 5091 | modal | imprimir-etiqueta |
| 5118 | modal | detalle-producto |
| 5257 | modal | facturacion |
| 5317 | modal | comprobante-listo |
| 5343 | modal | grabacion |
| 5463 | modal | camara-celular |
| 5478 | modal | ohm |
| 5508 | modal | cobro-adicional |
| 5546 | modal | bloqueo-equipo |
| 5600 | modal | repuesto-externo |
| 5638 | modal | reponer-stock |
| 5653 | modal | top-ventas |
| 5671 | modal | detalle-orden |
| 5708 | modal | tema |
| 5731 | modal | cierre-dia |
| 5755 | modal | gasto |
| 5793 | modal | compras-dia |
| 5807 | modal | cambiar-password |
| 17564 | modal | super-admin |


## index.html — funcion

| Línea | Tipo | Nombre / Texto |
|---|---|---|
| 6120 | funcion | showToast |
| 6143 | funcion | iniciarSesion |
| 6313 | funcion | guardarPersonalizacion |
| 6322 | funcion | aplicarPersonalizacion |
| 6349 | funcion | _pintarTema |
| 6360 | funcion | abrirSelectorTema |
| 6364 | funcion | cerrarSelectorTema |
| 6368 | funcion | aplicarTema |
| 6378 | funcion | cargarTemaGuardado |
| 6388 | funcion | aplicarPermisos |
| 6466 | funcion | showView |
| 6531 | funcion | cambiarTabMonitor |
| 6545 | funcion | nombreLegibleCanal |
| 6550 | funcion | cargarMonitorActividad |
| 6580 | funcion | filtrarErrores |
| 6589 | funcion | cargarCajaErrores |
| 6636 | funcion | marcarErrorResuelto |
| 6677 | funcion | buscarFacturasDevolucionDebounced |
| 6708 | funcion | seleccionarFacturaDevolucion |
| 6746 | funcion | cerrarFacturaSeleccionadaDevolucion |
| 6753 | funcion | escaparHtmlDevol |
| 6762 | funcion | intentarMatchProductoPorNombre |
| 6768 | funcion | poblarSelectorProductoDevolucion |
| 6789 | funcion | abrirFormularioDevolucionItem |
| 6812 | funcion | abrirDevolucionSinFactura |
| 6833 | funcion | cerrarModalDevolucion |
| 6837 | funcion | actualizarAvisoCondicionDevolucion |
| 6853 | funcion | toggleMontoDevolucion |
| 6859 | funcion | guardarDevolucion |
| 6920 | funcion | cargarDevoluciones |
| 6935 | funcion | renderizarHistorialDevoluciones |
| 7000 | funcion | showConfigSection |
| 7009 | funcion | calcularTotal |
| 7038 | funcion | buscarClienteRecepcion |
| 7059 | funcion | sugerirStockModelo |
| 7080 | funcion | pintarRepuestosSugeridos |
| 7100 | funcion | elegirRepuestoSugerido |
| 7114 | funcion | costoRepuestoEditado |
| 7126 | funcion | guardarOrden |
| 7155 | funcion | procesarDecision |
| 7176 | funcion | previsualizarFotoProducto |
| 7191 | funcion | comprimirImagen |
| 7229 | funcion | guardarProducto |
| 7290 | funcion | crearUsuario |
| 7300 | funcion | guardarCliente |
| 7400 | funcion | eliminarProducto |
| 7429 | funcion | renderOrdenesTaller |
| 7523 | funcion | actualizarDashboardBento |
| 7579 | funcion | tick |
| 7601 | funcion | verDetalleOrden |
| 7670 | funcion | asignarTecnicoOrden |
| 7684 | funcion | _escV |
| 7688 | funcion | _ventaSinControl |
| 7690 | funcion | renderVentaProductos |
| 7731 | funcion | agregarVentaProducto |
| 7746 | funcion | abrirVentaLibre |
| 7752 | funcion | agregarVentaLibre |
| 7761 | funcion | cambiarCantidadVenta |
| 7770 | funcion | totalVenta |
| 7772 | funcion | renderVentaCarrito |
| 7790 | funcion | vaciarVenta |
| 7794 | funcion | cobrarVenta |
| 7814 | funcion | _finVentaEnCurso |
| 7820 | funcion | generarCotizacion |
| 7894 | funcion | imprimirTicketVenta |
| 7929 | funcion | toggleMenuAgregarInventario |
| 7949 | funcion | cambiarPeriodoReporte |
| 7959 | funcion | animarNumero |
| 7962 | funcion | paso |
| 7970 | funcion | pintarBadge |
| 7982 | funcion | toggleDetalleIngresos |
| 7986 | funcion | irAGastos |
| 8040 | funcion | setTipoGrafica |
| 8046 | funcion | renderChartReporte |
| 8118 | funcion | abrirModalGasto |
| 8126 | funcion | guardarGasto |
| 8147 | funcion | eliminarGasto |
| 8162 | funcion | exportarReporteExcel |
| 8175 | funcion | exportarInventarioExcel |
| 8204 | funcion | abrirCierreDia |
| 8210 | funcion | confirmarCierreDia |
| 8474 | funcion | copiarCierreDia |
| 8567 | funcion | abrirReponerStock |
| 8603 | funcion | copiarListaReposicion |
| 8610 | funcion | abrirTopVentas |
| 8621 | funcion | setTopVentasTab |
| 8628 | funcion | renderTopVentas |
| 8678 | funcion | simularIA |
| 8705 | funcion | generarQR |
| 8748 | funcion | abrirModalCliente |
| 8762 | funcion | cerrarModalCliente |
| 8789 | funcion | nombreTecnico |
| 8808 | funcion | renderTiendasChips |
| 8816 | funcion | crearTienda |
| 8838 | funcion | asignarTiendaUsuario |
| 8847 | funcion | renderTablaUsuarios |
| 8881 | funcion | cambiarEstadoUsuario |
| 8888 | funcion | cambiarEstadoOrden |
| 8912 | funcion | toggleNotifPedidos |
| 8924 | funcion | renderPedidosPendientes |
| 8955 | funcion | resolverPedidoAccesorio |
| 8980 | funcion | getPos |
| 8991 | funcion | limpiarFirma |
| 8995 | funcion | toggleCamara |
| 9013 | funcion | usarCelularParaFoto |
| 9029 | funcion | apagarCamara |
| 9041 | funcion | tomarFoto |
| 9050 | funcion | retomarFoto |
| 9080 | funcion | entrarModoBeta |
| 9130 | funcion | _poblarTallerDemo |
| 9156 | funcion | _poblarClientesDemo |
| 9176 | funcion | _poblarInventarioDemo |
| 9191 | funcion | _poblarCRMDemo |
| 9202 | funcion | _poblarGraficoDemo |
| 9230 | funcion | guardarConfigWA |
| 9237 | funcion | iniciarTutorial |
| 9293 | funcion | cargarEstadoPlan |
| 9310 | funcion | guardarDatosEmpresa |
| 9343 | funcion | mostrarRegistro |
| 9348 | funcion | ocultarRegistro |
| 9353 | funcion | registrarNuevoNegocio |
| 9382 | funcion | generarNuevaLicencia |
| 9412 | funcion | copiarCodigoManual |
| 9443 | funcion | numeroALetras |
| 9458 | funcion | menorDeCien |
| 9466 | funcion | menorDeMil |
| 9476 | funcion | convertir |
| 9501 | funcion | abrirModalFacturacion |
| 9516 | funcion | emitirFactura |
| 9547 | funcion | _finEmisionFactura |
| 9589 | funcion | toggleChat |
| 9595 | funcion | cambiarCanalChat |
| 9610 | funcion | cargarHistorialChatCanal |
| 9632 | funcion | iniciarChatEnVivo |
| 9661 | funcion | recibirMensaje |
| 9721 | funcion | enviarMensajeChat |
| 9748 | funcion | notificarEscritura |
| 9754 | funcion | mostrarEscribiendo |
| 9768 | funcion | notificarChatOrden |
| 9788 | funcion | renderComprobanteDoc |
| 9934 | funcion | verFacturaHistorial |
| 9960 | funcion | _escComp |
| 9966 | funcion | _serializarInvoicePDF |
| 9984 | funcion | descargarComprobantePDF |
| 9998 | funcion | _ticketInner |
| 10061 | funcion | generarGarantiaDesdeComprobante |
| 10085 | funcion | _emitirGarantiaPDF |
| 10146 | funcion | construirTicketHTML |
| 10158 | funcion | _htmlTicket |
| 10163 | funcion | cargarLogoTicket |
| 10178 | funcion | quitarLogoTicket |
| 10183 | funcion | sincronizarLogoDesdeUrl |
| 10194 | funcion | _leerOpcionesTicket |
| 10204 | funcion | renderTicketPreview |
| 10234 | funcion | guardarTicket |
| 10254 | funcion | imprimirComprobanteTicket |
| 10280 | funcion | toggleTimer |
| 10307 | funcion | filtrarStockTecnico |
| 10357 | funcion | usarRepuestoLab |
| 10393 | funcion | avisarMargenNegativo |
| 10407 | funcion | centroPunto |
| 10412 | funcion | construirPuntosPatron |
| 10429 | funcion | tocarPunto |
| 10438 | funcion | dibujarLineasPatron |
| 10449 | funcion | borrarPatron |
| 10456 | funcion | pinTecla |
| 10460 | funcion | pinBorrar |
| 10465 | funcion | cambiarTipoBloqueo |
| 10476 | funcion | abrirBloqueoEquipo |
| 10484 | funcion | guardarBloqueoEquipo |
| 10489 | funcion | guardarBloqueoEquipoActual |
| 10506 | funcion | abrirRepuestoExterno |
| 10525 | funcion | registrarRepuestoExterno |
| 10562 | funcion | abrirCobroAdicional |
| 10572 | funcion | guardarCobroAdicional |
| 10600 | funcion | abrirReporteComprasDia |
| 10651 | funcion | buscarOrdenLab |
| 10716 | funcion | holoRoundedRectShape |
| 10731 | funcion | holoSlabGeometry |
| 10737 | funcion | initHologramaLab |
| 10822 | funcion | holoCrearCajaFoto |
| 10861 | funcion | holoConstruirCelular |
| 10989 | funcion | holoSlotAutomatico |
| 10995 | funcion | holoCrearEtiqueta |
| 11019 | funcion | holoCrearPiezaDinamica |
| 11055 | funcion | holoEliminarPiezaDeEscena |
| 11070 | funcion | holoLimpiarTodasLasPiezas |
| 11085 | funcion | holoEliminarPieza |
| 11108 | funcion | holoDeshacerBorrado |
| 11121 | funcion | holoRenombrarPieza |
| 11152 | funcion | holoRenderListaPiezas |
| 11181 | funcion | holoBuscarPieza |
| 11194 | funcion | holoOrdenarAutomatico |
| 11205 | funcion | holoResize |
| 11215 | funcion | holoToggleFullscreen |
| 11232 | funcion | holoAnimar |
| 11244 | funcion | holoAplicarFactor |
| 11250 | funcion | holoSetExplode |
| 11271 | funcion | holoRegistrarPickTargets |
| 11281 | funcion | holoActualizarMouseNDC |
| 11287 | funcion | holoConfigurarDragPiezas |
| 11350 | funcion | holoAplicarColor |
| 11372 | funcion | holoTogglePieza |
| 11377 | funcion | holoReset |
| 11418 | funcion | holoGiroExtraerCuadros |
| 11454 | funcion | holoGiroMostrar |
| 11474 | funcion | holoGiroConectarArrastre |
| 11499 | funcion | holoAbrirGiro |
| 11512 | funcion | holoCerrarGiro |
| 11519 | funcion | holoAbrirGiroDePieza |
| 11534 | funcion | holoGiroToggleAyuda |
| 11539 | funcion | holoGiroDesdeArchivo |
| 11571 | funcion | _holoDataURLaBytes |
| 11579 | funcion | holoGiroGuardar |
| 11623 | funcion | holoGiroCargarGuardado |
| 11639 | funcion | holoObtenerCaraFoto |
| 11652 | funcion | holoNormalMapDesdeImagen |
| 11689 | funcion | holoAplicarMediaDesdeURL |
| 11734 | funcion | holoCargarFotosDelModelo |
| 11787 | funcion | holoToggleModoGuiado |
| 11796 | funcion | holoActualizarPanelGuiado |
| 11807 | funcion | holoResetCapturaParcial |
| 11822 | funcion | holoAvanzarGuiado |
| 11834 | funcion | holoSaltarCaraGuiada |
| 11838 | funcion | holoTerminarGuiado |
| 11843 | funcion | holoAbrirModalFoto |
| 11871 | funcion | holoCerrarModalFoto |
| 11903 | funcion | holoToggleAnotacion |
| 11916 | funcion | holoRedibujarAnotacion |
| 11948 | funcion | holoCambiarModo |
| 11960 | funcion | holoToggleCamara |
| 11983 | funcion | holoUsarCelularParaFoto |
| 11997 | funcion | holoApagarCamaraFoto |
| 12010 | funcion | holoTomarFoto |
| 12026 | funcion | holoIniciarGrabacion |
| 12052 | funcion | holoDetenerGrabacion |
| 12056 | funcion | holoRetomarFoto |
| 12067 | funcion | holoGuardarFoto |
| 12129 | funcion | holoAplicarEstadisticasComunidad |
| 12145 | funcion | holoAbrirHistorialTaller |
| 12168 | funcion | holoAbrirSelectorModelos |
| 12179 | funcion | holoRenderListaModelos |
| 12196 | funcion | holoFiltrarListaModelos |
| 12201 | funcion | holoSeleccionarModeloGuardado |
| 12208 | funcion | holoAbrirModelosSimilares |
| 12214 | funcion | holoBuscarModelosSimilares |
| 12240 | funcion | holoReportarPieza |
| 12252 | funcion | holoCompararPieza |
| 12273 | funcion | holoGenerarReporte |
| 12314 | funcion | holoCapturarPantalla |
| 12336 | funcion | holoSugerirNombrePieza |
| 12348 | funcion | holoGrabarNotaVoz |
| 12410 | funcion | guardarReparacionLab |
| 12441 | funcion | abrirSoftwareAmbicion |
| 12491 | funcion | generarCodigoSalaCamara |
| 12497 | funcion | emparejarCelular |
| 12650 | funcion | alternarCamaraCelular |
| 12659 | funcion | cerrarModalCamaraCelular |
| 12670 | funcion | desconectarCamaraCelular |
| 12696 | funcion | abrirEstudioGrabacion |
| 12716 | funcion | cerrarEstudioGrabacion |
| 12732 | funcion | listarDispositivosGrabacion |
| 12762 | funcion | guardarConfigGrabacion |
| 12776 | funcion | cargarConfigGrabacion |
| 12778 | funcion | aplicarConfigGuardada |
| 12793 | funcion | videoDeStream |
| 12802 | funcion | videoDeArchivo |
| 12812 | funcion | encenderEstudio |
| 12871 | funcion | mostrarEstadoTransmision |
| 12884 | funcion | apagarEstudio |
| 12908 | funcion | cambiarEscena |
| 12922 | funcion | marcarEscenaActiva |
| 12931 | funcion | dibujarCover |
| 12939 | funcion | dibujarContain |
| 12947 | funcion | dibujarCamaraConMarco |
| 12955 | funcion | dibujarBucle |
| 13004 | funcion | alternarGrabacion |
| 13070 | funcion | alternarTransmision |
| 13166 | funcion | iniciarConexionWebRTC |
| 13250 | funcion | dpNum |
| 13259 | funcion | dpArquitecturaDeModelo |
| 13269 | funcion | dpReglasDeterministas |
| 13346 | funcion | dpEvaluarConsumo |
| 13371 | funcion | dpLeerMediciones |
| 13392 | funcion | dpDetectarArquitectura |
| 13399 | funcion | dpEvaluar |
| 13429 | funcion | abrirDiagnosticoPlaca |
| 13449 | funcion | cerrarDiagnosticoPlaca |
| 13453 | funcion | dpReiniciarTodo |
| 13466 | funcion | dpConfigurarInputDecimal |
| 13490 | funcion | avanzarRuta |
| 13522 | funcion | finalizarRuta |
| 13546 | funcion | reiniciarRuta |
| 13576 | funcion | dpGenerarInforme |
| 13638 | funcion | dpPintarInforme |
| 13660 | funcion | dpEscapar |
| 13666 | funcion | dpInsertarBitacora |
| 13686 | funcion | calcularOhm |
| 13712 | funcion | limpiarOhm |
| 13721 | funcion | cargarPreviewAvatar |
| 13739 | funcion | guardarMiPerfil |
| 13772 | funcion | procesarImagenInventario |
| 13782 | funcion | convertirABase64 |
| 13807 | funcion | diagImei |
| 13814 | funcion | pintarDiagImei |
| 13819 | funcion | toggleDiagImei |
| 13831 | funcion | obtenerLectorImei |
| 13844 | funcion | obtenerLectorFotoImei |
| 13857 | funcion | procesarFotoImeiRecibida |
| 13865 | funcion | probarFotoImeiDesdeArchivo |
| 13884 | funcion | analizarImagenImei |
| 13930 | funcion | normalizarImei |
| 13938 | funcion | luhnImeiValido |
| 13949 | funcion | pareceImei |
| 13961 | funcion | extraerCandidatosImei |
| 14006 | funcion | actualizarEstadoScannerImei |
| 14013 | funcion | limpiarCandidatoOcrImei |
| 14027 | funcion | procesarCodigoDetectadoImei |
| 14064 | funcion | cargarTesseractScript |
| 14077 | funcion | obtenerWorkerOcrImei |
| 14101 | funcion | prepararImagenOcrImei |
| 14140 | funcion | resolverTextoOcrImei |
| 14166 | funcion | mostrarSugerenciaOcrImei |
| 14177 | funcion | confirmarOcrImei |
| 14184 | funcion | descartarOcrImei |
| 14196 | funcion | iniciarOcrFallbackImei |
| 14221 | funcion | detenerOcrFallbackImei |
| 14228 | funcion | poblarSelectorCamarasImei |
| 14241 | funcion | cambiarCamaraLaptopImei |
| 14254 | funcion | abrirScannerImei |
| 14294 | funcion | usarCelularParaImei |
| 14322 | funcion | cerrarScannerImei |
| 14327 | funcion | detenerScannerImei |
| 14369 | funcion | confirmarImportacionIA |
| 14388 | funcion | abrirModalCategoriaExcel |
| 14396 | funcion | cerrarModalCategoriaExcel |
| 14404 | funcion | confirmarCategoriaExcel |
| 14411 | funcion | procesarExcelInventario |
| 14527 | funcion | detectarColumnas |
| 14742 | funcion | confirmarImportacionExcel |
| 14762 | funcion | consultarCopilotoLab |
| 14882 | funcion | mostrarCargando |
| 14901 | funcion | cerrarSesion |
| 14924 | funcion | generarResumenIA |
| 14950 | funcion | marcarAsistenciaManual |
| 15022 | funcion | registrarFeed |
| 15033 | funcion | reportarActividadImportante |
| 15048 | funcion | enviarAlertaGerencial |
| 15069 | funcion | incrementarBadgeChat |
| 15080 | funcion | limpiarBadgeChat |
| 15089 | funcion | mostrarPasoRecuperarCodigo |
| 15107 | funcion | toggleRecuperarPassword |
| 15127 | funcion | enviarCorreoRecuperacion |
| 15169 | funcion | confirmarRecuperacionCorreo |
| 15262 | funcion | abrirModalCambiarPassword |
| 15272 | funcion | cerrarModalCambiarPassword |
| 15276 | funcion | cambiarMiPassword |
| 15318 | funcion | toggleMFAView |
| 15337 | funcion | moverAlSiguiente |
| 15353 | funcion | manejarRetroceso |
| 15360 | funcion | cancelar2FA |
| 15366 | funcion | verificarCodigo2FA |
| 15460 | funcion | cambiarFuenteModelos |
| 15504 | funcion | inicializarSelectorMarcas |
| 15540 | funcion | abrirSelectorModelos |
| 15599 | funcion | cerrarSelectorModelos |
| 15603 | funcion | seleccionarMarca |
| 15614 | funcion | filtrarYRenderizarModelos |
| 15691 | funcion | agregarModeloNuevo |
| 15717 | funcion | seleccionarModelo |
| 15785 | funcion | combinarSubcategorias |
| 15792 | funcion | poblarSelectSubcategoria |
| 15800 | funcion | manejarSeleccionSubcategoria |
| 15812 | funcion | cambiarRegCategoria |
| 15865 | funcion | agregarSugerenciaNombre |
| 15941 | funcion | renderizarGruposCompatibilidad |
| 15991 | funcion | abrirModalNuevoGrupo |
| 16005 | funcion | editarGrupoCompat |
| 16022 | funcion | cerrarModalGrupoCompat |
| 16028 | funcion | abrirSelectorModelosParaGrupo |
| 16032 | funcion | agregarMiembroCompatBuilder |
| 16051 | funcion | quitarMiembroCompatBuilder |
| 16056 | funcion | renderChipsCompatBuilder |
| 16071 | funcion | guardarGrupoCompat |
| 16098 | funcion | abrirModalImportarCompat |
| 16111 | funcion | cerrarModalImportarCompat |
| 16117 | funcion | cambiarTabImportCompat |
| 16129 | funcion | procesarArchivoExcelCompat |
| 16189 | funcion | procesarArchivoIACompat |
| 16224 | funcion | renderTablaImportCompat |
| 16276 | funcion | abrirSelectorModelosParaFilaImport |
| 16281 | funcion | agregarMiembroAFilaImport |
| 16294 | funcion | quitarMiembroFilaImport |
| 16300 | funcion | quitarFilaImport |
| 16305 | funcion | confirmarImportacionCompat |
| 16331 | funcion | eliminarGrupoCompat |
| 16344 | funcion | revisarSugerenciaCompatibilidad |
| 16381 | funcion | filtrarInventario |
| 16393 | funcion | poblarFiltroSubcategoria |
| 16407 | funcion | renderizarProductosFiltrados |
| 16501 | funcion | abrirModalEtiqueta |
| 16523 | funcion | imprimirEtiquetaFinal |
| 16546 | funcion | previsualizarFotoDetalle |
| 16564 | funcion | abrirVerTiendaProducto |
| 16623 | funcion | cerrarVerTiendaProducto |
| 16628 | funcion | irAEditarProductoDesdeTienda |
| 16635 | funcion | agregarDesdeVerTienda |
| 16641 | funcion | abrirDetalleProducto |
| 16708 | funcion | cargarHistorialDetalle |
| 16738 | funcion | cerrarDetalleProducto |
| 16743 | funcion | toggleCostosPorCategoria |
| 16756 | funcion | refrescarDetSubcategoria |
| 16771 | funcion | verificarCambiosDetalle |
| 16804 | funcion | guardarDetalleProducto |
| 16870 | funcion | toggleAjusteStock |
| 16881 | funcion | guardarAjusteStock |
| 16931 | funcion | procesarFotoProveedor |
| 16943 | funcion | cargarProveedores |
| 16989 | funcion | renderizarProveedores |
| 17023 | funcion | guardarProveedor |
| 17064 | funcion | eliminarProveedor |
| 17092 | funcion | cargarPanelLicencias |
| 17160 | funcion | guardarLicencia |
| 17169 | funcion | sumarDiasLicencia |
| 17173 | funcion | borrarCodigoLicencia |
| 17190 | funcion | cargarModelosPendientes |
| 17239 | funcion | usarSugerenciaIA |
| 17246 | funcion | resolverModelo |
| 17267 | funcion | cargarResellersAdmin |
| 17325 | funcion | abrirModalReseller |
| 17335 | funcion | editarReseller |
| 17345 | funcion | guardarResellerAdmin |
| 17370 | funcion | eliminarReseller |
| 17440 | funcion | aplicarFiltroTaller |
| 17456 | funcion | limpiarFiltroTaller |
| 17463 | funcion | filtrarTablaTaller |
| 17464 | funcion | filtrarTallerPorEstado |
| 17470 | funcion | actualizarKPIsTaller |
| 17494 | funcion | filtrarTablaClientes |
| 17506 | funcion | actualizarKPIClientes |
| 17518 | funcion | abrirModalEvento |
| 17522 | funcion | guardarEvento |
| 17556 | funcion | navegarSemana |
| 17596 | funcion | abrirGeneradorLicencia |
| 17599 | funcion | cerrarGeneradorLicencia |
| 17615 | funcion | irADescargarActualizacion |
| 17625 | funcion | instalarActualizacionAhora |
| 18585 | funcion | alternarAyudante |
| 18600 | funcion | actualizarBotonAyudante |
| 18609 | funcion | hablarAyudante |
| 18641 | funcion | programarCierreAyudante |
| 18647 | funcion | ocultarAyudante |
| 18734 | funcion | coincideFrase |
| 18980 | funcion | emocionJP |
| 18991 | funcion | autodestruccionJP |
| 19012 | funcion | responderComando |
| 19041 | funcion | sorprendemeJP |
| 19072 | funcion | revisarNegocio |
| 19141 | funcion | vigilarNegocio |
| 19168 | funcion | iniciarVigilancia |
| 19188 | funcion | sinDatosJP |
| 19197 | funcion | jpVentasDeHoy |
| 19222 | funcion | jpMejorCliente |
| 19247 | funcion | jpModelosMasReparados |
| 19270 | funcion | jpComisionTecnico |
| 19294 | funcion | jpPorCobrar |
| 19318 | funcion | revisarOrdenEnCurso |
| 19389 | funcion | programarRevisionOrden |
| 19400 | funcion | cargarVozJP |
| 19417 | funcion | textoParaVoz |
| 19429 | funcion | hablarEnVozAlta |
| 19443 | funcion | alternarVozJP |
| 19459 | funcion | actualizarBotonVoz |
| 19474 | funcion | posicionGuardadaJP |
| 19486 | funcion | aplicarPosicionGuardadaJP |
| 19498 | funcion | iniciarArrastreJP |
| 19571 | funcion | celebrarOrdenGuardada |
| 19606 | funcion | revisarHitosDelDia |
| 19654 | funcion | jpDameAnimo |
| 19698 | funcion | modoFiestaJP |
| 19713 | funcion | lanzarConfeti |
| 19731 | funcion | jpComoVoyHoy |
| 19757 | funcion | jpAdivinaNumero |
| 19768 | funcion | jpCaraOSello |
| 19825 | funcion | iniciarTutorial |
| 19837 | funcion | mostrarPasoTutorial |
| 19866 | funcion | pasoTutorial |
| 19875 | funcion | terminarTutorial |
| 19890 | funcion | menuTutoriales |
| 19902 | funcion | consejoHtml |
| 19908 | funcion | normalizar |
| 19914 | funcion | buscarTema |
| 19945 | funcion | elementoObjetivo |
| 19954 | funcion | resaltarElemento |
| 19967 | funcion | quitarResaltado |
| 19972 | funcion | posarEnElemento |
| 20018 | funcion | volverASuCasa |
| 20030 | funcion | explicarTema |
| 20041 | funcion | explicarTemaPorId |
| 20046 | funcion | preguntarAlAyudante |
| 20074 | funcion | listaTemasHtml |
| 20079 | funcion | mostrarIndiceAyudante |
| 20087 | funcion | numDe |
| 20095 | funcion | explicarMetricas |


## index.html — funcion (arrow)

| Línea | Tipo | Nombre / Texto |
|---|---|---|
| 6408 | funcion (arrow) | setVis |
| 6980 | funcion (arrow) | setChk |
| 7536 | funcion (arrow) | setNum |
| 8277 | funcion (arrow) | badgeMetodo |
| 10195 | funcion (arrow) | chk |
| 11441 | funcion (arrow) | ok |
| 11480 | funcion (arrow) | mover |
| 11488 | funcion (arrow) | iniciar |
| 11489 | funcion (arrow) | soltar |
| 11707 | funcion (arrow) | alListo |
| 12259 | funcion (arrow) | renderLado |
| 12781 | funcion (arrow) | set |
| 13434 | funcion (arrow) | leerLab |
| 14825 | funcion (arrow) | esCierre |
| 15625 | funcion (arrow) | aItem |
| 19403 | funcion (arrow) | elegir |
| 20187 | funcion (arrow) | ocupado |
| 20188 | funcion (arrow) | libre |


## index.html — ipc (renderer)

| Línea | Tipo | Nombre / Texto |
|---|---|---|
| 2536 | ipc (renderer) | abrir-carpeta |
| 2550 | ipc (renderer) | abrir-carpeta |
| 3358 | ipc (renderer) | abrir-carpeta-plantillas |
| 5455 | ipc (renderer) | abrir-carpeta-grabaciones |
| 6065 | ipc (renderer) | registrar-error-renderer |
| 6078 | ipc (renderer) | registrar-error-renderer |
| 6139 | ipc (renderer) | iniciar-sesion-token |
| 6161 | ipc (renderer) | login-respuesta |
| 6164 | ipc (renderer) | iniciar-sesion |
| 6181 | ipc (renderer) | login-respuesta |
| 6250 | ipc (renderer) | resultado-2fa |
| 6336 | ipc (renderer) | pedir-datos-empresa |
| 6451 | ipc (renderer) | obtener-modelos-pendientes |
| 6453 | ipc (renderer) | obtener-panel-licencias |
| 6462 | ipc (renderer) | obtener-caja-errores |
| 6469 | ipc (renderer) | obtener-clientes |
| 6474 | ipc (renderer) | analisis-crm |
| 6476 | ipc (renderer) | obtener-tecnicos |
| 6478 | ipc (renderer) | obtener-tecnicos |
| 6479 | ipc (renderer) | obtener-ordenes |
| 6480 | ipc (renderer) | listar-pedidos-accesorios-pendientes |
| 6483 | ipc (renderer) | obtener-productos |
| 6484 | ipc (renderer) | obtener-subcategorias-custom |
| 6485 | ipc (renderer) | obtener-grupos-compatibilidad |
| 6488 | ipc (renderer) | obtener-productos |
| 6493 | ipc (renderer) | obtener-grupos-compatibilidad |
| 6496 | ipc (renderer) | obtener-productos |
| 6497 | ipc (renderer) | obtener-devoluciones |
| 6502 | ipc (renderer) | obtener-facturas |
| 6512 | ipc (renderer) | obtener-usuarios |
| 6513 | ipc (renderer) | obtener-tiendas |
| 6517 | ipc (renderer) | pedir-datos-empresa |
| 6553 | ipc (renderer) | obtener-monitor-actividad |
| 6556 | ipc (renderer) | monitor-actividad-respuesta |
| 6590 | ipc (renderer) | obtener-caja-errores |
| 6593 | ipc (renderer) | caja-errores-respuesta |
| 6638 | ipc (renderer) | resolver-error-app |
| 6641 | ipc (renderer) | error-app-resuelto |
| 6647 | ipc (renderer) | lista-de-facturas |
| 6683 | ipc (renderer) | buscar-facturas-devolucion |
| 6687 | ipc (renderer) | resultado-busqueda-facturas-devolucion |
| 6900 | ipc (renderer) | registrar-devolucion |
| 6903 | ipc (renderer) | devolucion-registrada |
| 6911 | ipc (renderer) | obtener-devoluciones |
| 6912 | ipc (renderer) | obtener-productos |
| 6921 | ipc (renderer) | obtener-devoluciones |
| 6930 | ipc (renderer) | lista-devoluciones |
| 6960 | ipc (renderer) | datos-empresa-respuesta |
| 7048 | ipc (renderer) | buscar-clientes |
| 7050 | ipc (renderer) | clientes-sugeridos |
| 7063 | ipc (renderer) | sugerir-stock-modelo |
| 7070 | ipc (renderer) | stock-sugerido-modelo |
| 7162 | ipc (renderer) | guardar-orden |
| 7164 | ipc (renderer) | guardar-orden |
| 7253 | ipc (renderer) | subir-foto-producto |
| 7281 | ipc (renderer) | nuevo-producto-sql |
| 7297 | ipc (renderer) | crear-usuario-nuevo |
| 7313 | ipc (renderer) | actualizar-cliente |
| 7315 | ipc (renderer) | guardar-cliente |
| 7319 | ipc (renderer) | resultado-cliente |
| 7323 | ipc (renderer) | obtener-clientes |
| 7327 | ipc (renderer) | cliente-actualizado |
| 7331 | ipc (renderer) | obtener-clientes |
| 7335 | ipc (renderer) | resultado-guardado |
| 7394 | ipc (renderer) | producto-guardado |
| 7402 | ipc (renderer) | eliminar-producto |
| 7405 | ipc (renderer) | producto-eliminado |
| 7408 | ipc (renderer) | obtener-productos |
| 7414 | ipc (renderer) | resultado-usuario |
| 7415 | ipc (renderer) | obtener-usuarios |
| 7422 | ipc (renderer) | lista-de-ordenes |
| 7654 | ipc (renderer) | obtener-accesorios-orden |
| 7657 | ipc (renderer) | accesorios-de-la-orden |
| 7671 | ipc (renderer) | asignar-tecnico-orden |
| 7674 | ipc (renderer) | lista-de-productos |
| 7810 | ipc (renderer) | registrar-venta-desktop |
| 7888 | ipc (renderer) | imprimir-documento |
| 7908 | ipc (renderer) | imprimir-documento |
| 7912 | ipc (renderer) | venta-desktop-resultado |
| 7920 | ipc (renderer) | obtener-productos |
| 7942 | ipc (renderer) | subcategorias-custom-lista |
| 7955 | ipc (renderer) | obtener-datos-reporte |
| 7991 | ipc (renderer) | datos-reporte |
| 8129 | ipc (renderer) | registrar-gasto |
| 8137 | ipc (renderer) | gasto-registrado |
| 8141 | ipc (renderer) | obtener-datos-reporte |
| 8148 | ipc (renderer) | eliminar-gasto |
| 8151 | ipc (renderer) | gasto-eliminado |
| 8154 | ipc (renderer) | obtener-datos-reporte |
| 8166 | ipc (renderer) | exportar-reporte-excel |
| 8169 | ipc (renderer) | reporte-excel-generado |
| 8190 | ipc (renderer) | exportar-inventario-excel |
| 8193 | ipc (renderer) | exportar-inventario-excel-res |
| 8207 | ipc (renderer) | obtener-cierre-dia |
| 8212 | ipc (renderer) | obtener-cierre-dia |
| 8216 | ipc (renderer) | cierre-dia-datos |
| 8615 | ipc (renderer) | obtener-top-ventas |
| 8659 | ipc (renderer) | top-ventas-data |
| 8690 | ipc (renderer) | ia-recepcion |
| 8694 | ipc (renderer) | respuesta-ia-recepcion |
| 8712 | ipc (renderer) | datos-crm |
| 8728 | ipc (renderer) | lista-de-clientes |
| 8770 | ipc (renderer) | lista-de-tecnicos |
| 8795 | ipc (renderer) | tecnico-asignado |
| 8798 | ipc (renderer) | obtener-ordenes |
| 8819 | ipc (renderer) | crear-tienda |
| 8822 | ipc (renderer) | tienda-creada |
| 8826 | ipc (renderer) | obtener-tiendas |
| 8832 | ipc (renderer) | lista-de-tiendas |
| 8839 | ipc (renderer) | asignar-tienda-usuario |
| 8842 | ipc (renderer) | tienda-asignada |
| 8843 | ipc (renderer) | obtener-usuarios |
| 8876 | ipc (renderer) | lista-de-usuarios |
| 8881 | ipc (renderer) | cambiar-estado-usuario |
| 8883 | ipc (renderer) | resultado-cambio-estado |
| 8889 | ipc (renderer) | actualizar-estado-orden |
| 8906 | ipc (renderer) | orden-actualizada |
| 8908 | ipc (renderer) | obtener-ordenes |
| 8956 | ipc (renderer) | resolver-pedido-accesorio |
| 8959 | ipc (renderer) | pedidos-accesorios-pendientes |
| 8961 | ipc (renderer) | resultado-pedido-accesorio |
| 8964 | ipc (renderer) | obtener-ordenes |
| 8968 | ipc (renderer) | listar-pedidos-accesorios-pendientes |
| 8972 | ipc (renderer) | listar-pedidos-accesorios-pendientes |
| 9299 | ipc (renderer) | obtener-estado-plan |
| 9302 | ipc (renderer) | estado-plan-respuesta |
| 9332 | ipc (renderer) | guardar-datos-empresa |
| 9335 | ipc (renderer) | resultado-datos-empresa |
| 9363 | ipc (renderer) | registrar-nuevo-cliente-saas |
| 9371 | ipc (renderer) | registro-saas-respuesta |
| 9386 | ipc (renderer) | crear-codigo-automatico |
| 9388 | ipc (renderer) | crear-codigo-automatico |
| 9392 | ipc (renderer) | codigo-creado-exito |
| 9536 | ipc (renderer) | emitir-factura-saas |
| 9781 | ipc (renderer) | factura-emitida-error |
| 9913 | ipc (renderer) | factura-emitida-exito |
| 9986 | ipc (renderer) | imprimir-documento |
| 10141 | ipc (renderer) | imprimir-documento |
| 10251 | ipc (renderer) | guardar-datos-empresa |
| 10256 | ipc (renderer) | imprimir-documento |
| 10264 | ipc (renderer) | documento-impreso |
| 10321 | ipc (renderer) | buscar-stock-tecnico |
| 10324 | ipc (renderer) | resultados-stock-tecnico |
| 10366 | ipc (renderer) | usar-repuesto-lab |
| 10376 | ipc (renderer) | repuesto-usado-lab |
| 10537 | ipc (renderer) | registrar-repuesto-externo |
| 10548 | ipc (renderer) | repuesto-externo-registrado |
| 10584 | ipc (renderer) | agregar-cobro-adicional |
| 10587 | ipc (renderer) | cobro-adicional-agregado |
| 10594 | ipc (renderer) | obtener-ordenes |
| 10603 | ipc (renderer) | obtener-compras-externas-dia |
| 10606 | ipc (renderer) | compras-externas-dia |
| 10662 | ipc (renderer) | buscar-orden-id |
| 10667 | ipc (renderer) | respuesta-orden-id |
| 11100 | ipc (renderer) | borrar-pieza-modelo |
| 11130 | ipc (renderer) | renombrar-pieza-modelo |
| 11600 | ipc (renderer) | guardar-foto-pieza-cache |
| 11601 | ipc (renderer) | subir-foto-pieza |
| 11749 | ipc (renderer) | leer-fotos-pieza-cache-modelo |
| 11756 | ipc (renderer) | buscar-fotos-modelo |
| 11767 | ipc (renderer) | guardar-foto-pieza-cache |
| 11863 | ipc (renderer) | sugerencias-nombres-pieza |
| 12094 | ipc (renderer) | guardar-foto-pieza-cache |
| 12110 | ipc (renderer) | subir-foto-pieza |
| 12135 | ipc (renderer) | estadisticas-fallas-modelo |
| 12154 | ipc (renderer) | historial-modelo-taller |
| 12174 | ipc (renderer) | listar-modelos-con-fotos |
| 12225 | ipc (renderer) | buscar-piezas-similares |
| 12246 | ipc (renderer) | reportar-pieza-modelo |
| 12247 | ipc (renderer) | reportar-pieza-modelo |
| 12262 | ipc (renderer) | buscar-fotos-modelo |
| 12279 | ipc (renderer) | buscar-fotos-modelo |
| 12303 | ipc (renderer) | imprimir-documento |
| 12306 | ipc (renderer) | documento-impreso |
| 12366 | ipc (renderer) | transcribir-audio-pieza |
| 12421 | ipc (renderer) | actualizar-bitacora-estado |
| 12448 | ipc (renderer) | abrir-ambicion |
| 12454 | ipc (renderer) | ambicion-bloqueado |
| 12752 | ipc (renderer) | listar-fuentes-pantalla |
| 12841 | ipc (renderer) | elegir-fuente-pantalla |
| 13035 | ipc (renderer) | guardar-grabacion |
| 13089 | ipc (renderer) | actualizar-modo-transmision |
| 13116 | ipc (renderer) | actualizar-modo-transmision |
| 13203 | ipc (renderer) | ambicion-resultado |
| 13219 | ipc (renderer) | abrir-log-ambicion |
| 13229 | ipc (renderer) | bitacora-actualizada |
| 13233 | ipc (renderer) | obtener-ordenes |
| 13596 | ipc (renderer) | diagnostico-placa-ia |
| 13616 | ipc (renderer) | diagnostico-placa-resultado |
| 13748 | ipc (renderer) | guardar-mi-perfil |
| 13756 | ipc (renderer) | perfil-guardado-exito |
| 13779 | ipc (renderer) | analizar-documento-ia |
| 14342 | ipc (renderer) | respuesta-analisis-ia |
| 14374 | ipc (renderer) | nuevo-producto-sql |
| 14379 | ipc (renderer) | obtener-productos |
| 14509 | ipc (renderer) | preview-excel-inventario |
| 14692 | ipc (renderer) | preview-excel-resultado |
| 14745 | ipc (renderer) | importar-excel-inventario |
| 14748 | ipc (renderer) | resultado-importacion-excel |
| 14755 | ipc (renderer) | obtener-productos |
| 14772 | ipc (renderer) | ia-laboratorio |
| 14775 | ipc (renderer) | respuesta-ia-laboratorio |
| 14794 | ipc (renderer) | busqueda-global |
| 14841 | ipc (renderer) | resultados-busqueda-global |
| 14907 | ipc (renderer) | cerrar-sesion-token |
| 14933 | ipc (renderer) | generar-resumen-financiero |
| 14936 | ipc (renderer) | respuesta-resumen-financiero |
| 14957 | ipc (renderer) | marcar-asistencia-manual |
| 14964 | ipc (renderer) | registrar-salida-manual |
| 14973 | ipc (renderer) | asistencia-respuesta |
| 14989 | ipc (renderer) | salida-respuesta |
| 15005 | ipc (renderer) | salida-respuesta |
| 15239 | ipc (renderer) | sincronizar-password-recuperada |
| 15295 | ipc (renderer) | cambiar-mi-password |
| 15298 | ipc (renderer) | cambiar-mi-password-respuesta |
| 15393 | ipc (renderer) | verificar-2fa |
| 15398 | ipc (renderer) | marcas-modelos-respuesta |
| 15435 | ipc (renderer) | modelos-almacen-respuesta |
| 15484 | ipc (renderer) | obtener-modelos-almacen |
| 15564 | ipc (renderer) | obtener-marcas-modelos |
| 15702 | ipc (renderer) | agregar-modelo-nuevo |
| 15708 | ipc (renderer) | proponer-modelo |
| 15807 | ipc (renderer) | agregar-subcategoria-custom |
| 15874 | ipc (renderer) | lista-grupos-compatibilidad |
| 15879 | ipc (renderer) | grupo-compatibilidad-guardado |
| 15895 | ipc (renderer) | obtener-grupos-compatibilidad |
| 15896 | ipc (renderer) | obtener-productos |
| 15908 | ipc (renderer) | obtener-grupos-compatibilidad |
| 15909 | ipc (renderer) | obtener-productos |
| 15919 | ipc (renderer) | grupo-compatibilidad-eliminado |
| 15922 | ipc (renderer) | obtener-grupos-compatibilidad |
| 15923 | ipc (renderer) | obtener-productos |
| 15929 | ipc (renderer) | producto-vinculado-a-grupo |
| 15932 | ipc (renderer) | obtener-grupos-compatibilidad |
| 15933 | ipc (renderer) | obtener-productos |
| 16090 | ipc (renderer) | actualizar-grupo-compatibilidad |
| 16092 | ipc (renderer) | crear-grupo-compatibilidad |
| 16194 | ipc (renderer) | analizar-compatibilidad-archivo |
| 16197 | ipc (renderer) | respuesta-analisis-compatibilidad |
| 16323 | ipc (renderer) | crear-grupo-compatibilidad |
| 16338 | ipc (renderer) | eliminar-grupo-compatibilidad |
| 16715 | ipc (renderer) | obtener-historial-producto |
| 16831 | ipc (renderer) | subir-foto-producto |
| 16850 | ipc (renderer) | actualizar-producto-detalle |
| 16902 | ipc (renderer) | ajustar-stock-manual |
| 16972 | ipc (renderer) | obtener-proveedores-db |
| 16976 | ipc (renderer) | proveedores-db-respuesta |
| 17049 | ipc (renderer) | guardar-proveedor-db |
| 17072 | ipc (renderer) | eliminar-proveedor-db |
| 17080 | ipc (renderer) | modelo-propuesto |
| 17095 | ipc (renderer) | obtener-panel-licencias |
| 17103 | ipc (renderer) | panel-licencias-respuesta |
| 17161 | ipc (renderer) | actualizar-licencia |
| 17170 | ipc (renderer) | actualizar-licencia |
| 17174 | ipc (renderer) | borrar-codigo-licencia |
| 17177 | ipc (renderer) | licencia-actualizada |
| 17193 | ipc (renderer) | obtener-modelos-pendientes |
| 17196 | ipc (renderer) | modelos-pendientes-respuesta |
| 17255 | ipc (renderer) | resolver-modelo |
| 17258 | ipc (renderer) | modelo-resuelto |
| 17268 | ipc (renderer) | obtener-resellers-admin |
| 17272 | ipc (renderer) | resellers-admin-respuesta |
| 17305 | ipc (renderer) | guardar-reseller-respuesta |
| 17315 | ipc (renderer) | eliminar-reseller-respuesta |
| 17367 | ipc (renderer) | guardar-reseller-admin |
| 17372 | ipc (renderer) | eliminar-reseller-admin |
| 17605 | ipc (renderer) | pedir-version |
| 17608 | ipc (renderer) | recibir-version |
| 17616 | ipc (renderer) | abrir-pagina-descarga |
| 17626 | ipc (renderer) | instalar-actualizacion-ahora |
| 17629 | ipc (renderer) | actualizacion-disponible |
| 17638 | ipc (renderer) | actualizacion-lista |
| 17648 | ipc (renderer) | actualizacion-no-disponible |


# main.js


## main.js — seccion

| Línea | Tipo | Nombre / Texto |
|---|---|---|
| 29 | seccion | SESIÓN DE SUPABASE AUTH (paso previo a sacar la service_role del instalador) |
| 96 | seccion | CANDADO DE LANZAMIENTO DE AMBICION |
| 166 | seccion | MONITOR DE ACTIVIDAD Y CAJA DE ERRORES (soporte, solo casa matriz) |
| 266 | seccion | MONITOR DE ACTIVIDAD Y ERRORES: PANEL (solo casa matriz, ve TODAS las empresas) |
| 331 | seccion | CAPTURA DE PANTALLA PARA GRABAR REPARACIONES |
| 531 | seccion | CREAR CARPETAS FIRMWARE Y DUMP AL INICIAR (en userData: sobreviven actualizaciones) |
| 548 | seccion | ABRIR CARPETAS FIRMWARE / DUMP |
| 557 | seccion | GRABACIÓN DE REPARACIONES (pestaña Laboratorio) |
| 651 | seccion | TRANSMISION EN VIVO: marcar/desmarcar una orden como "En Vivo" |
| 674 | seccion | ABRIR CARPETA DE PLANTILLAS DE INVENTARIO (Excel para carga masiva) |
| 681 | seccion | OBTENER MARCAS Y MODELOS DE DISPOSITIVOS |
| 686 | seccion | AGREGAR MODELO NUEVO AL CATÁLOGO (cuando no existe uno que el usuario necesita) |
| 702 | seccion | 2. LOGIN INTELIGENTE (FILTRA POR EMPRESA Y FECHA) |
| 765 | seccion | 2.0B LOGIN AUTOMATICO CON TOKEN DE SESION RECORDADA |
| 818 | seccion | 2.0C CERRAR SESIÓN RECORDADA (invalida el token guardado) |
| 841 | seccion | 2.0D CAMBIO Y SINCRONIZACIÓN DE CONTRASEÑA DENTRO DE LA APP |
| 927 | seccion | 2.1 VERIFICACIÓN DE 2FA (SEGUNDO PASO DE ACCESO) |
| 1024 | seccion | 3. CLIENTES (SOLO DE MI EMPRESA) |
| 1141 | seccion | MI CATÁLOGO DE MODELOS: marcas y modelos deducidos del propio almacén |
| 1236 | seccion | PORTERO 1: la forma del nombre |
| 1269 | seccion | PORTERO 2: la IA |
| 1329 | seccion | DIAGNÓSTICO DE PLACA |
| 1607 | seccion | COLA DE APROBACIÓN (solo la casa matriz) |
| 1660 | seccion | PROVEEDORES (PERSISTENCIA SEGURA EN SUPABASE + CONTROL DE FALLOS) |
| 1699 | seccion | SUBIR FOTO PRODUCTO |
| 1731 | seccion | HOLOGRAMA 3D: fotos reales de piezas por modelo de celular |
| 2158 | seccion | 4. INVENTARIO (SOLO DE MI EMPRESA) |
| 2221 | seccion | 4D. GRUPOS DE COMPATIBILIDAD DE MODELOS (micas/pantallas que comparten pieza y stock) |
| 2411 | seccion | 4A. SUBCATEGORÍAS PERSONALIZADAS (editables por el usuario, ej. tipos de Micas) |
| 2441 | seccion | 4B. IMPORTACIÓN DESDE EXCEL - PREVIEW |
| 2454 | seccion | TERCERA VÍA DE MATCHING: por grupo de compatibilidad |
| 2475 | seccion | LOGICA DE SUBCATEGORIAS PARA EXCEL |
| 2597 | seccion | 4C. IMPORTACIÓN DESDE EXCEL - EJECUTAR UPSERT ADITIVO |
| 2808 | seccion | 4D. HISTORIAL DE PRODUCTO |
| 2867 | seccion | 5. ORDENES/TALLER (SOLO DE MI EMPRESA) |
| 2929 | seccion | 6. REPORTES (SUMA SOLO EL DINERO DE MI EMPRESA) |
| 3098 | seccion | 6b. GASTOS OPERATIVOS (alquiler, sueldos, luz, etc. — migración 008) |
| 3132 | seccion | 6b-bis. DATOS PARA EXPORTAR EL REPORTE A EXCEL (formato de la plantilla del dueño) |
| 3277 | seccion | EXPORTAR INVENTARIO ACTUAL DE PRODUCTOS A EXCEL (.XLSX) |
| 3520 | seccion | 6b-ter. MÁS VENDIDOS por categoría (ventas del POS del período elegido) |
| 3622 | seccion | 6c. CIERRE DEL DÍA UNIFICADO (FASE 6 del plan finanzas — el "libro de caja") |
| 3714 | seccion | REPORTE AL DUEÑO DETALLADO |
| 3967 | seccion | 6d. TIENDAS (sucursales) — asignación de personal por tienda |
| 4008 | seccion | 7. GESTIÓN DE USUARIOS (SOLO DE MI EMPRESA) |
| 4066 | seccion | 7.1 CAMBIAR ESTADO DE USUARIO (Activar/Desactivar) |
| 4092 | seccion | 8. ESTADO DEL PLAN (Para el Dashboard de Licencias) |
| 4130 | seccion | 9. CONFIGURACIÓN DE EMPRESA |
| 4175 | seccion | 10. GENERADOR AUTOMÁTICO DE LICENCIAS (SÓLO ADMIN) |
| 4209 | seccion | 10B. PANEL DE LICENCIAS (solo casa matriz) |
| 4253 | seccion | 11. REGISTRO SAAS CON VALIDACIÓN DE LICENCIA Y FECHA |
| 4280 | seccion | 12. MÓDULO DE FACTURACIÓN AUTOMÁTICA |
| 4361 | seccion | 13. ACTUALIZAR PERFIL DE USUARIO |
| 4383 | seccion | 14. MÓDULOS DE IA (Gemini y OpenAI) |
| 4434 | seccion | 14B. IMPORTAR GRUPOS DE COMPATIBILIDAD DESDE PDF O IMAGEN (Fase 5) |
| 4636 | seccion | 15. BÚSQUEDAS |
| 4788 | seccion | VENTA RÁPIDA DE ESCRITORIO (POS para cualquier rol) |
| 4954 | seccion | REPUESTO EXTERNO (traído de otro proveedor porque no había en stock) |
| 5029 | seccion | COBRO ADICIONAL: otra falla / trabajo extra hallado durante la reparación |
| 5099 | seccion | IMPRESIÓN DE COMPROBANTES |
| 5168 | seccion | 16. MÓDULO DE ASISTENCIA MANUAL |
| 5190 | seccion | HANDLER: Cargar historial de facturas |
| 5200 | seccion | MÓDULO DE DEVOLUCIONES (cliente devuelve un producto vendido) |
| 5343 | seccion | HANDLER: Análisis CRM (clientes inactivos) |
| 5356 | seccion | HANDLER: Buscar orden por ID (para el Laboratorio) |
| 5367 | seccion | HANDLER: Guardar bitácora y cambiar estado |
| 5401 | seccion | HANDLER: Accesorios ya agregados a una orden (para el Detalle de la orden) |
| 5414 | seccion | HANDLER: Cambiar estado de una orden |
| 5440 | seccion | PEDIDOS DE ACCESORIOS (creados por el cliente desde el tracking web) |
| 5517 | seccion | HANDLER: Listar usuarios |
| 5527 | seccion | HANDLER: Gestión de Resellers (Global, solo super admin) |
| 5602 | seccion | CIERRE |


## main.js — ipc (main)

| Línea | Tipo | Nombre / Texto |
|---|---|---|
| 260 | ipc (main) | registrar-error-renderer |
| 270 | ipc (main) | obtener-monitor-actividad |
| 285 | ipc (main) | obtener-caja-errores |
| 300 | ipc (main) | resolver-error-app |
| 437 | ipc (main) | diagnostico-placa-ia |
| 509 | ipc (main) | pedir-version |
| 517 | ipc (main) | abrir-pagina-descarga |
| 527 | ipc (main) | instalar-actualizacion-ahora |
| 549 | ipc (main) | abrir-carpeta |
| 569 | ipc (main) | listar-fuentes-pantalla |
| 589 | ipc (main) | elegir-fuente-pantalla |
| 592 | ipc (main) | guardar-grabacion |
| 656 | ipc (main) | actualizar-modo-transmision |
| 670 | ipc (main) | abrir-carpeta-grabaciones |
| 675 | ipc (main) | abrir-carpeta-plantillas |
| 682 | ipc (main) | obtener-marcas-modelos |
| 687 | ipc (main) | agregar-modelo-nuevo |
| 703 | ipc (main) | iniciar-sesion |
| 766 | ipc (main) | iniciar-sesion-token |
| 819 | ipc (main) | cerrar-sesion-token |
| 842 | ipc (main) | cambiar-mi-password |
| 896 | ipc (main) | sincronizar-password-recuperada |
| 928 | ipc (main) | verificar-2fa |
| 1025 | ipc (main) | guardar-cliente |
| 1039 | ipc (main) | actualizar-cliente |
| 1075 | ipc (main) | obtener-clientes |
| 1090 | ipc (main) | buscar-clientes |
| 1118 | ipc (main) | sugerir-stock-modelo |
| 1496 | ipc (main) | obtener-modelos-almacen |
| 1530 | ipc (main) | proponer-modelo |
| 1614 | ipc (main) | obtener-modelos-pendientes |
| 1640 | ipc (main) | resolver-modelo |
| 1661 | ipc (main) | guardar-proveedor-db |
| 1677 | ipc (main) | obtener-proveedores-db |
| 1691 | ipc (main) | eliminar-proveedor-db |
| 1700 | ipc (main) | subir-foto-producto |
| 1759 | ipc (main) | subir-foto-pieza |
| 1824 | ipc (main) | reportar-pieza-modelo |
| 1857 | ipc (main) | estadisticas-fallas-modelo |
| 1892 | ipc (main) | historial-modelo-taller |
| 1912 | ipc (main) | renombrar-pieza-modelo |
| 1933 | ipc (main) | borrar-pieza-modelo |
| 1965 | ipc (main) | sugerencias-nombres-pieza |
| 1989 | ipc (main) | transcribir-audio-pieza |
| 2031 | ipc (main) | guardar-foto-pieza-cache |
| 2051 | ipc (main) | leer-fotos-pieza-cache-modelo |
| 2078 | ipc (main) | buscar-fotos-modelo |
| 2109 | ipc (main) | buscar-piezas-similares |
| 2132 | ipc (main) | listar-modelos-con-fotos |
| 2159 | ipc (main) | nuevo-producto-sql |
| 2191 | ipc (main) | obtener-productos |
| 2204 | ipc (main) | eliminar-producto |
| 2224 | ipc (main) | obtener-grupos-compatibilidad |
| 2265 | ipc (main) | crear-grupo-compatibilidad |
| 2326 | ipc (main) | actualizar-grupo-compatibilidad |
| 2373 | ipc (main) | eliminar-grupo-compatibilidad |
| 2389 | ipc (main) | vincular-producto-a-grupo |
| 2412 | ipc (main) | obtener-subcategorias-custom |
| 2429 | ipc (main) | agregar-subcategoria-custom |
| 2442 | ipc (main) | preview-excel-inventario |
| 2598 | ipc (main) | importar-excel-inventario |
| 2809 | ipc (main) | obtener-historial-producto |
| 2821 | ipc (main) | actualizar-producto-detalle |
| 2837 | ipc (main) | ajustar-stock-manual |
| 2868 | ipc (main) | guardar-orden |
| 2891 | ipc (main) | obtener-ordenes |
| 2905 | ipc (main) | obtener-tecnicos |
| 2915 | ipc (main) | asignar-tecnico-orden |
| 2937 | ipc (main) | obtener-datos-reporte |
| 3099 | ipc (main) | registrar-gasto |
| 3118 | ipc (main) | eliminar-gasto |
| 3247 | ipc (main) | obtener-datos-export |
| 3258 | ipc (main) | exportar-reporte-excel |
| 3279 | ipc (main) | exportar-inventario-excel |
| 3521 | ipc (main) | obtener-top-ventas |
| 3626 | ipc (main) | obtener-cierre-dia |
| 3968 | ipc (main) | obtener-tiendas |
| 3980 | ipc (main) | crear-tienda |
| 3994 | ipc (main) | asignar-tienda-usuario |
| 4009 | ipc (main) | crear-usuario-nuevo |
| 4067 | ipc (main) | cambiar-estado-usuario |
| 4093 | ipc (main) | obtener-estado-plan |
| 4131 | ipc (main) | guardar-datos-empresa |
| 4156 | ipc (main) | pedir-datos-empresa |
| 4176 | ipc (main) | crear-codigo-automatico |
| 4213 | ipc (main) | obtener-panel-licencias |
| 4224 | ipc (main) | actualizar-licencia |
| 4241 | ipc (main) | borrar-codigo-licencia |
| 4254 | ipc (main) | registrar-nuevo-cliente-saas |
| 4281 | ipc (main) | emitir-factura-saas |
| 4362 | ipc (main) | guardar-mi-perfil |
| 4384 | ipc (main) | analizar-documento-ia |
| 4444 | ipc (main) | analizar-compatibilidad-archivo |
| 4487 | ipc (main) | ia-recepcion |
| 4530 | ipc (main) | ia-laboratorio |
| 4574 | ipc (main) | generar-resumen-financiero |
| 4637 | ipc (main) | buscar-stock-tecnico |
| 4668 | ipc (main) | abrir-ambicion |
| 4780 | ipc (main) | abrir-log-ambicion |
| 4792 | ipc (main) | registrar-venta-desktop |
| 4868 | ipc (main) | usar-repuesto-lab |
| 4957 | ipc (main) | registrar-repuesto-externo |
| 5033 | ipc (main) | agregar-cobro-adicional |
| 5077 | ipc (main) | obtener-compras-externas-dia |
| 5103 | ipc (main) | imprimir-documento |
| 5153 | ipc (main) | busqueda-global |
| 5169 | ipc (main) | marcar-asistencia-manual |
| 5191 | ipc (main) | obtener-facturas |
| 5205 | ipc (main) | buscar-facturas-devolucion |
| 5227 | ipc (main) | registrar-devolucion |
| 5324 | ipc (main) | obtener-devoluciones |
| 5344 | ipc (main) | analisis-crm |
| 5357 | ipc (main) | buscar-orden-id |
| 5368 | ipc (main) | actualizar-bitacora-estado |
| 5402 | ipc (main) | obtener-accesorios-orden |
| 5415 | ipc (main) | actualizar-estado-orden |
| 5443 | ipc (main) | listar-pedidos-accesorios-pendientes |
| 5454 | ipc (main) | resolver-pedido-accesorio |
| 5518 | ipc (main) | obtener-usuarios |
| 5528 | ipc (main) | obtener-resellers-admin |
| 5543 | ipc (main) | guardar-reseller-admin |
| 5585 | ipc (main) | eliminar-reseller-admin |
| 5606 | ipc (main) | registrar-salida-manual |


## main.js — funcion

| Línea | Tipo | Nombre / Texto |
|---|---|---|
| 46 | funcion | guardarRefreshAuth |
| 52 | funcion | leerRefreshAuth |
| 59 | funcion | borrarRefreshAuth |
| 63 | funcion | abrirSesionAuth |
| 79 | funcion | emitirTokenSesion |
| 103 | funcion | escribirTokenLanzamientoAmbicion |
| 116 | funcion | rutaDevicesCacheUsuario |
| 120 | funcion | cargarDevicesCache |
| 142 | funcion | prepararPlantillasInventario |
| 183 | funcion | resumirDetalleActividad |
| 205 | funcion | registrarActividad |
| 219 | funcion | registrarErrorApp |
| 316 | funcion | createWindow |
| 353 | funcion | esVersionMasNueva |
| 562 | funcion | carpetaGrabaciones |
| 1254 | funcion | validarFormatoModelo |
| 1278 | funcion | distanciaEdicion |
| 1297 | funcion | candidatosDelCatalogo |
| 1403 | funcion | verificarModeloConIA |
| 1449 | funcion | stockPorModeloDeEmpresa |
| 1473 | funcion | sincronizarUsoModelos |
| 2014 | funcion | holoCacheDir |
| 2019 | funcion | holoManifestPath |
| 2022 | funcion | holoLeerManifest |
| 2025 | funcion | holoGuardarManifest |
| 3135 | funcion | recolectarDatosExport |
| 3300 | funcion | agregarHojaInventario |
| 3400 | funcion | construirExcelReporte |
| 4654 | funcion | copiarCarpetaRecursivo |
| 5622 | funcion | registrarFeed |

