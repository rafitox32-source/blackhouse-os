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
| 20 | comentario | Holograma 3D del Laboratorio: three.js incluido localmente (assets/vendor/three) para que funcione sin internet |
| 2148 | comentario | Interruptor del ayudante animado (siempre visible para cualquiera) |
| 2160 | comentario | BARRA SUPERIOR (Corregida con todos sus cierres) |
| 2402 | comentario | HOLOGRAMA 3D: Diagnóstico visual del equipo |
| 2419 | comentario | Estadísticas comunitarias: qué se marcó dañado más seguido en este modelo |
| 2424 | comentario | Piezas de ESTA sesión: se van agregando a medida que fotografías/grabas cada una |
| 2532 | comentario | Modal: Ruta de Diagnóstico de Encendido (antes vivía fija en Laboratorio, ahora en modal para dejar el espacio al Holograma) |
| 2542 | comentario | Progress Bar |
| 2547 | comentario | Pasos |
| 2595 | comentario | Resumen / Fin |
| 2609 | comentario | Modal: VUELTA 360° de una pieza (Opción A del holograma) |
| 2619 | comentario | Instrucciones paso a paso (plegadas por defecto) |
| 2648 | comentario | Visor / previsualización |
| 2679 | comentario | Modal: Fotografiar pieza para el Holograma 3D |
| 2698 | comentario | Modo guiado: la app va pidiendo cara por cara con instrucciones |
| 2710 | comentario | Modo manual (guiado desactivado): elegir cara suelta |
| 2780 | comentario | Modal: Historial privado de este modelo en TU taller |
| 2792 | comentario | Modal: Buscar piezas en modelos similares (referencia visual) |
| 2812 | comentario | Modal: Abrir un modelo ya guardado en la librería (sin necesitar una orden) |
| 2825 | comentario | Modal: Comparar Antes / Después de una pieza |
| 2845 | comentario | ============ VENTA RÁPIDA (POS de escritorio, para todos los roles) ============ |
| 2886 | comentario | Modal: producto libre (venta sin stock) |
| 2966 | comentario | La mano de obra ya no se escribe: sale de restarle el repuesto al total. |
| 3101 | comentario | Stats Row |
| 3131 | comentario | Search |
| 3142 | comentario | Table |
| 3167 | comentario | Las tarjetas se poblarán dinámicamente |
| 3213 | comentario | Pestañas de Navegación de Inventario |
| 3285 | comentario | ================= NUEVO BLOQUE ================= |
| 3292 | comentario | ================================================= |
| 3298 | comentario | Sugerencias de Accesorios |
| 3318 | comentario | Sugerencias de Repuestos |
| 3338 | comentario | Sugerencias de Micas |
| 3356 | comentario | Selector de Modelo para Pantallas y Micas |
| 3633 | comentario | NUEVA SECCIÓN: MI PERFIL |
| 3638 | comentario | FOTO DE PERFIL |
| 3660 | comentario | DATOS |
| 3779 | comentario | ============ APARIENCIA / TEMA ============ |
| 3788 | comentario | ORIGINAL |
| 3802 | comentario | NEGRO |
| 3816 | comentario | BLANCO |
| 3830 | comentario | DOHA-CELL (marca) |
| 3844 | comentario | PREMIUM |
| 3865 | comentario | ============ TICKET / COMPROBANTE (personalización de impresión) ============ |
| 3874 | comentario | Formulario |
| 3929 | comentario | Vista previa en vivo (80mm) |
| 4005 | comentario | NUEVA SECCIÓN: DISTRIBUIDORES |
| 4024 | comentario | Se poblará dinámicamente |
| 4030 | comentario | PANEL DE LICENCIAS (solo casa matriz) |
| 4077 | comentario | COLA DE REVISIÓN DEL CATÁLOGO COMPARTIDO DE MODELOS |
| 4127 | comentario | Quick Stats |
| 4160 | comentario | Calendar Grid |
| 4192 | comentario | Modal Nuevo Evento (Si no existe) |
| 4258 | comentario | Monitor de Actividad + Caja de Errores: solo casa matriz (empresa 1), ve TODOS los talleres |
| 4337 | comentario | Vacío = alta nueva; con id = se está corrigiendo la ficha de ese cliente. |
| 4387 | comentario | Modal Nuevo Proveedor |
| 4430 | comentario | Modal Nuevo / Editar Reseller |
| 4487 | comentario | Modal Selector de Modelos Premium |
| 4497 | comentario | De dónde salen los modelos: el almacén propio o el catálogo mundial |
| 4520 | comentario | Grid de marcas comunes |
| 4522 | comentario | Se poblará dinámicamente con JS |
| 4531 | comentario | Listado de modelos |
| 4534 | comentario | Se poblará dinámicamente con JS |
| 4545 | comentario | Modal Crear/Editar Grupo de Compatibilidad |
| 4593 | comentario | Modal Importar Grupos de Compatibilidad desde archivo (Fase 5) |
| 4652 | comentario | Modal Escáner de IMEI/código de barras por cámara web (Recepción) |
| 4684 | comentario | Modal Registrar Devolución |
| 4782 | comentario | Modal de Selección de Categoría para Excel |
| 4814 | comentario | Modal de Importación Excel |
| 4875 | comentario | MODAL VISTA TIENDA DEL PRODUCTO |
| 4909 | comentario | MODAL IMPRIMIR ETIQUETA |
| 4933 | comentario | CONTENEDOR PARA IMPRESIÓN (OCULTO EN PANTALLA, VISIBLE EN IMPRESIÓN) |
| 4936 | comentario | MODAL DETALLE DE PRODUCTO (SÓLO LECTURA Y EDICIÓN PARCIAL) |
| 4947 | comentario | Bloque 1: Datos Generales |
| 5010 | comentario | Bloque 2: Costos por proveedor (Condicional) |
| 5033 | comentario | Bloque 3: Precios de venta |
| 5048 | comentario | Bloque 4: Historial de Ingresos |
| 5121 | comentario | Modal: elegir formato del comprobante ya emitido (PDF o Ticket) |
| 5141 | comentario | Modal Diagnóstico Consumo |
| 5179 | comentario | ===== ESTUDIO DE GRABACIÓN DE REPARACIONES ===== |
| 5196 | comentario | Vista previa: lo que se ve aquí es exactamente lo que se graba |
| 5205 | comentario | Escenas |
| 5217 | comentario | Configuración de fuentes y vinculación |
| 5283 | comentario | Controles |
| 5301 | comentario | Modal: Vincular la cámara del celular por WiFi al Estudio de Grabación |
| 5346 | comentario | Modal: Cobro adicional (otra falla / trabajo extra encontrado en la reparación) |
| 5384 | comentario | Modal: Bloqueo del equipo (Patrón / Clave / Contraseña) |
| 5395 | comentario | PATRÓN: 9 puntos para dibujar |
| 5404 | comentario | CLAVE: teclado numérico |
| 5423 | comentario | CONTRASEÑA: escribir |
| 5438 | comentario | Modal: Repuesto externo (traído de otro proveedor) |
| 5476 | comentario | Modal: Reponer stock (agotados y por agotarse, agrupados por categoría) |
| 5491 | comentario | Modal: Más vendidos por categoría (según el período elegido en Métricas) |
| 5509 | comentario | Modal: Detalle de orden (datos de Recepción: foto de evidencia y firma del cliente) |
| 5546 | comentario | Modal: Selector de tema (visible para TODOS los roles desde el botón del sidebar) |
| 5569 | comentario | Modal: Cierre del Día unificado (taller + POS − gastos − compras − devoluciones) |
| 5586 | comentario | Modal: Registrar gasto operativo |
| 5624 | comentario | Modal: Compras externas del día (cierre por proveedor) |
| 5639 | comentario | Cabecera con info del canal activo |
| 5658 | comentario | Pestañas de canales temáticos |
| 5679 | comentario | Área de mensajes |
| 5682 | comentario | Indicador de escritura |
| 5688 | comentario | Input de mensaje |
| 5702 | comentario | MARCA DE AGUA (Solo para Notas de Venta) |
| 5708 | comentario | ENCABEZADO |
| 5741 | comentario | DATOS DEL CLIENTE |
| 5767 | comentario | TABLA DE DETALLES |
| 5797 | comentario | TOTALES Y PIE DE PÁGINA |
| 16292 | comentario | TICKET DE ORDEN (oculto, solo para html2canvas) |
| 16335 | comentario | QR de rastreo individual por orden |
| 16566 | comentario | ================= AYUDANTE ANIMADO (robot con puerta) ================= |
| 16590 | comentario | Marco y hueco de la puerta |
| 16592 | comentario | El robot sube desde dentro del hueco |
| 16594 | comentario | antena |
| 16597 | comentario | cabeza |
| 16600 | comentario | visor |
| 16604 | comentario | boca: recta normal, sonrisa y tristeza (se alternan según la emoción) |
| 16612 | comentario | orejas |
| 16615 | comentario | cuerpo |
| 16619 | comentario | brazo que saluda |
| 16623 | comentario | Hojas de la puerta |


## index.html — modal

| Línea | Tipo | Nombre / Texto |
|---|---|---|
| 2533 | modal | ruta-diagnostico |
| 2610 | modal | holo-giro |
| 2680 | modal | holo-foto |
| 2781 | modal | holo-historial |
| 2793 | modal | holo-similares |
| 2813 | modal | holo-modelos |
| 2826 | modal | holo-comparar |
| 2887 | modal | venta-libre |
| 4193 | modal | evento |
| 4334 | modal | cliente |
| 4339 | modal | cliente-aviso |
| 4363 | modal | usuario |
| 4388 | modal | proveedor |
| 4431 | modal | reseller |
| 4488 | modal | selector-modelos |
| 4546 | modal | grupo-compat |
| 4594 | modal | importar-compat |
| 4653 | modal | scanner-imei |
| 4685 | modal | registrar-devolucion |
| 4755 | modal | confirm-custom |
| 4769 | modal | confirm-ai |
| 4783 | modal | categoria-excel |
| 4815 | modal | excel-import |
| 4876 | modal | ver-tienda-producto |
| 4910 | modal | imprimir-etiqueta |
| 4937 | modal | detalle-producto |
| 5076 | modal | facturacion |
| 5122 | modal | comprobante-listo |
| 5142 | modal | diagnostico-consumo |
| 5182 | modal | grabacion |
| 5302 | modal | camara-celular |
| 5317 | modal | ohm |
| 5347 | modal | cobro-adicional |
| 5385 | modal | bloqueo-equipo |
| 5439 | modal | repuesto-externo |
| 5477 | modal | reponer-stock |
| 5492 | modal | top-ventas |
| 5510 | modal | detalle-orden |
| 5547 | modal | tema |
| 5570 | modal | cierre-dia |
| 5587 | modal | gasto |
| 5625 | modal | compras-dia |
| 16477 | modal | super-admin |


## index.html — funcion

| Línea | Tipo | Nombre / Texto |
|---|---|---|
| 5922 | funcion | showToast |
| 5945 | funcion | iniciarSesion |
| 6115 | funcion | guardarPersonalizacion |
| 6124 | funcion | aplicarPersonalizacion |
| 6151 | funcion | _pintarTema |
| 6162 | funcion | abrirSelectorTema |
| 6166 | funcion | cerrarSelectorTema |
| 6170 | funcion | aplicarTema |
| 6180 | funcion | cargarTemaGuardado |
| 6190 | funcion | aplicarPermisos |
| 6268 | funcion | showView |
| 6333 | funcion | cambiarTabMonitor |
| 6347 | funcion | nombreLegibleCanal |
| 6352 | funcion | cargarMonitorActividad |
| 6382 | funcion | filtrarErrores |
| 6391 | funcion | cargarCajaErrores |
| 6438 | funcion | marcarErrorResuelto |
| 6479 | funcion | buscarFacturasDevolucionDebounced |
| 6510 | funcion | seleccionarFacturaDevolucion |
| 6548 | funcion | cerrarFacturaSeleccionadaDevolucion |
| 6555 | funcion | escaparHtmlDevol |
| 6564 | funcion | intentarMatchProductoPorNombre |
| 6570 | funcion | poblarSelectorProductoDevolucion |
| 6591 | funcion | abrirFormularioDevolucionItem |
| 6614 | funcion | abrirDevolucionSinFactura |
| 6635 | funcion | cerrarModalDevolucion |
| 6639 | funcion | actualizarAvisoCondicionDevolucion |
| 6655 | funcion | toggleMontoDevolucion |
| 6661 | funcion | guardarDevolucion |
| 6722 | funcion | cargarDevoluciones |
| 6737 | funcion | renderizarHistorialDevoluciones |
| 6802 | funcion | showConfigSection |
| 6811 | funcion | calcularTotal |
| 6840 | funcion | buscarClienteRecepcion |
| 6861 | funcion | sugerirStockModelo |
| 6882 | funcion | pintarRepuestosSugeridos |
| 6902 | funcion | elegirRepuestoSugerido |
| 6916 | funcion | costoRepuestoEditado |
| 6928 | funcion | guardarOrden |
| 6957 | funcion | procesarDecision |
| 6978 | funcion | previsualizarFotoProducto |
| 6993 | funcion | comprimirImagen |
| 7031 | funcion | guardarProducto |
| 7092 | funcion | crearUsuario |
| 7102 | funcion | guardarCliente |
| 7201 | funcion | eliminarProducto |
| 7230 | funcion | renderOrdenesTaller |
| 7324 | funcion | actualizarDashboardBento |
| 7380 | funcion | tick |
| 7402 | funcion | verDetalleOrden |
| 7471 | funcion | asignarTecnicoOrden |
| 7485 | funcion | _escV |
| 7489 | funcion | _ventaSinControl |
| 7491 | funcion | renderVentaProductos |
| 7532 | funcion | agregarVentaProducto |
| 7547 | funcion | abrirVentaLibre |
| 7553 | funcion | agregarVentaLibre |
| 7562 | funcion | cambiarCantidadVenta |
| 7571 | funcion | totalVenta |
| 7573 | funcion | renderVentaCarrito |
| 7591 | funcion | vaciarVenta |
| 7595 | funcion | cobrarVenta |
| 7615 | funcion | _finVentaEnCurso |
| 7621 | funcion | generarCotizacion |
| 7695 | funcion | imprimirTicketVenta |
| 7730 | funcion | toggleMenuAgregarInventario |
| 7750 | funcion | cambiarPeriodoReporte |
| 7760 | funcion | animarNumero |
| 7763 | funcion | paso |
| 7771 | funcion | pintarBadge |
| 7783 | funcion | toggleDetalleIngresos |
| 7787 | funcion | irAGastos |
| 7841 | funcion | setTipoGrafica |
| 7847 | funcion | renderChartReporte |
| 7919 | funcion | abrirModalGasto |
| 7927 | funcion | guardarGasto |
| 7948 | funcion | eliminarGasto |
| 7963 | funcion | exportarReporteExcel |
| 7976 | funcion | exportarInventarioExcel |
| 8005 | funcion | abrirCierreDia |
| 8011 | funcion | confirmarCierreDia |
| 8107 | funcion | copiarCierreDia |
| 8147 | funcion | abrirReponerStock |
| 8183 | funcion | copiarListaReposicion |
| 8191 | funcion | abrirTopVentas |
| 8202 | funcion | setTopVentasTab |
| 8209 | funcion | renderTopVentas |
| 8259 | funcion | simularIA |
| 8286 | funcion | generarQR |
| 8329 | funcion | abrirModalCliente |
| 8343 | funcion | cerrarModalCliente |
| 8370 | funcion | nombreTecnico |
| 8389 | funcion | renderTiendasChips |
| 8397 | funcion | crearTienda |
| 8419 | funcion | asignarTiendaUsuario |
| 8428 | funcion | renderTablaUsuarios |
| 8462 | funcion | cambiarEstadoUsuario |
| 8469 | funcion | cambiarEstadoOrden |
| 8493 | funcion | toggleNotifPedidos |
| 8505 | funcion | renderPedidosPendientes |
| 8536 | funcion | resolverPedidoAccesorio |
| 8561 | funcion | getPos |
| 8572 | funcion | limpiarFirma |
| 8576 | funcion | toggleCamara |
| 8594 | funcion | usarCelularParaFoto |
| 8610 | funcion | apagarCamara |
| 8622 | funcion | tomarFoto |
| 8631 | funcion | retomarFoto |
| 8661 | funcion | entrarModoBeta |
| 8711 | funcion | _poblarTallerDemo |
| 8737 | funcion | _poblarClientesDemo |
| 8757 | funcion | _poblarInventarioDemo |
| 8772 | funcion | _poblarCRMDemo |
| 8783 | funcion | _poblarGraficoDemo |
| 8811 | funcion | guardarConfigWA |
| 8818 | funcion | iniciarTutorial |
| 8874 | funcion | cargarEstadoPlan |
| 8891 | funcion | guardarDatosEmpresa |
| 8924 | funcion | mostrarRegistro |
| 8929 | funcion | ocultarRegistro |
| 8934 | funcion | registrarNuevoNegocio |
| 8963 | funcion | generarNuevaLicencia |
| 8992 | funcion | copiarCodigoManual |
| 9023 | funcion | numeroALetras |
| 9038 | funcion | menorDeCien |
| 9046 | funcion | menorDeMil |
| 9056 | funcion | convertir |
| 9081 | funcion | abrirModalFacturacion |
| 9096 | funcion | emitirFactura |
| 9124 | funcion | _finEmisionFactura |
| 9166 | funcion | toggleChat |
| 9172 | funcion | cambiarCanalChat |
| 9187 | funcion | cargarHistorialChatCanal |
| 9209 | funcion | iniciarChatEnVivo |
| 9238 | funcion | recibirMensaje |
| 9298 | funcion | enviarMensajeChat |
| 9325 | funcion | notificarEscritura |
| 9331 | funcion | mostrarEscribiendo |
| 9345 | funcion | notificarChatOrden |
| 9365 | funcion | renderComprobanteDoc |
| 9511 | funcion | verFacturaHistorial |
| 9537 | funcion | _escComp |
| 9543 | funcion | _serializarInvoicePDF |
| 9561 | funcion | descargarComprobantePDF |
| 9575 | funcion | _ticketInner |
| 9638 | funcion | generarGarantiaDesdeComprobante |
| 9662 | funcion | _emitirGarantiaPDF |
| 9723 | funcion | construirTicketHTML |
| 9735 | funcion | _htmlTicket |
| 9740 | funcion | cargarLogoTicket |
| 9755 | funcion | quitarLogoTicket |
| 9760 | funcion | sincronizarLogoDesdeUrl |
| 9771 | funcion | _leerOpcionesTicket |
| 9781 | funcion | renderTicketPreview |
| 9811 | funcion | guardarTicket |
| 9831 | funcion | imprimirComprobanteTicket |
| 9857 | funcion | toggleTimer |
| 9884 | funcion | filtrarStockTecnico |
| 9934 | funcion | usarRepuestoLab |
| 9970 | funcion | avisarMargenNegativo |
| 9984 | funcion | centroPunto |
| 9989 | funcion | construirPuntosPatron |
| 10006 | funcion | tocarPunto |
| 10015 | funcion | dibujarLineasPatron |
| 10026 | funcion | borrarPatron |
| 10033 | funcion | pinTecla |
| 10037 | funcion | pinBorrar |
| 10042 | funcion | cambiarTipoBloqueo |
| 10053 | funcion | abrirBloqueoEquipo |
| 10061 | funcion | guardarBloqueoEquipo |
| 10066 | funcion | guardarBloqueoEquipoActual |
| 10083 | funcion | abrirRepuestoExterno |
| 10102 | funcion | registrarRepuestoExterno |
| 10139 | funcion | abrirCobroAdicional |
| 10149 | funcion | guardarCobroAdicional |
| 10177 | funcion | abrirReporteComprasDia |
| 10228 | funcion | buscarOrdenLab |
| 10292 | funcion | holoRoundedRectShape |
| 10307 | funcion | holoSlabGeometry |
| 10313 | funcion | initHologramaLab |
| 10382 | funcion | holoCrearCajaFoto |
| 10421 | funcion | holoConstruirCelular |
| 10549 | funcion | holoSlotAutomatico |
| 10555 | funcion | holoCrearEtiqueta |
| 10579 | funcion | holoCrearPiezaDinamica |
| 10615 | funcion | holoEliminarPiezaDeEscena |
| 10630 | funcion | holoLimpiarTodasLasPiezas |
| 10645 | funcion | holoEliminarPieza |
| 10668 | funcion | holoDeshacerBorrado |
| 10681 | funcion | holoRenombrarPieza |
| 10712 | funcion | holoRenderListaPiezas |
| 10741 | funcion | holoBuscarPieza |
| 10754 | funcion | holoOrdenarAutomatico |
| 10765 | funcion | holoResize |
| 10775 | funcion | holoToggleFullscreen |
| 10792 | funcion | holoAnimar |
| 10804 | funcion | holoAplicarFactor |
| 10810 | funcion | holoSetExplode |
| 10831 | funcion | holoRegistrarPickTargets |
| 10841 | funcion | holoActualizarMouseNDC |
| 10847 | funcion | holoConfigurarDragPiezas |
| 10910 | funcion | holoAplicarColor |
| 10932 | funcion | holoTogglePieza |
| 10937 | funcion | holoReset |
| 10978 | funcion | holoGiroExtraerCuadros |
| 11014 | funcion | holoGiroMostrar |
| 11034 | funcion | holoGiroConectarArrastre |
| 11059 | funcion | holoAbrirGiro |
| 11072 | funcion | holoCerrarGiro |
| 11079 | funcion | holoAbrirGiroDePieza |
| 11094 | funcion | holoGiroToggleAyuda |
| 11099 | funcion | holoGiroDesdeArchivo |
| 11131 | funcion | _holoDataURLaBytes |
| 11139 | funcion | holoGiroGuardar |
| 11183 | funcion | holoGiroCargarGuardado |
| 11199 | funcion | holoObtenerCaraFoto |
| 11212 | funcion | holoNormalMapDesdeImagen |
| 11249 | funcion | holoAplicarMediaDesdeURL |
| 11294 | funcion | holoCargarFotosDelModelo |
| 11347 | funcion | holoToggleModoGuiado |
| 11356 | funcion | holoActualizarPanelGuiado |
| 11367 | funcion | holoResetCapturaParcial |
| 11382 | funcion | holoAvanzarGuiado |
| 11394 | funcion | holoSaltarCaraGuiada |
| 11398 | funcion | holoTerminarGuiado |
| 11403 | funcion | holoAbrirModalFoto |
| 11431 | funcion | holoCerrarModalFoto |
| 11463 | funcion | holoToggleAnotacion |
| 11476 | funcion | holoRedibujarAnotacion |
| 11508 | funcion | holoCambiarModo |
| 11520 | funcion | holoToggleCamara |
| 11543 | funcion | holoUsarCelularParaFoto |
| 11557 | funcion | holoApagarCamaraFoto |
| 11570 | funcion | holoTomarFoto |
| 11586 | funcion | holoIniciarGrabacion |
| 11612 | funcion | holoDetenerGrabacion |
| 11616 | funcion | holoRetomarFoto |
| 11627 | funcion | holoGuardarFoto |
| 11689 | funcion | holoAplicarEstadisticasComunidad |
| 11705 | funcion | holoAbrirHistorialTaller |
| 11728 | funcion | holoAbrirSelectorModelos |
| 11739 | funcion | holoRenderListaModelos |
| 11756 | funcion | holoFiltrarListaModelos |
| 11761 | funcion | holoSeleccionarModeloGuardado |
| 11768 | funcion | holoAbrirModelosSimilares |
| 11774 | funcion | holoBuscarModelosSimilares |
| 11800 | funcion | holoReportarPieza |
| 11812 | funcion | holoCompararPieza |
| 11833 | funcion | holoGenerarReporte |
| 11874 | funcion | holoCapturarPantalla |
| 11896 | funcion | holoSugerirNombrePieza |
| 11908 | funcion | holoGrabarNotaVoz |
| 11970 | funcion | guardarReparacionLab |
| 12001 | funcion | abrirSoftwareAmbicion |
| 12051 | funcion | generarCodigoSalaCamara |
| 12057 | funcion | emparejarCelular |
| 12210 | funcion | alternarCamaraCelular |
| 12219 | funcion | cerrarModalCamaraCelular |
| 12230 | funcion | desconectarCamaraCelular |
| 12256 | funcion | abrirEstudioGrabacion |
| 12276 | funcion | cerrarEstudioGrabacion |
| 12292 | funcion | listarDispositivosGrabacion |
| 12322 | funcion | guardarConfigGrabacion |
| 12336 | funcion | cargarConfigGrabacion |
| 12338 | funcion | aplicarConfigGuardada |
| 12353 | funcion | videoDeStream |
| 12362 | funcion | videoDeArchivo |
| 12372 | funcion | encenderEstudio |
| 12431 | funcion | mostrarEstadoTransmision |
| 12444 | funcion | apagarEstudio |
| 12468 | funcion | cambiarEscena |
| 12482 | funcion | marcarEscenaActiva |
| 12491 | funcion | dibujarCover |
| 12499 | funcion | dibujarContain |
| 12507 | funcion | dibujarCamaraConMarco |
| 12515 | funcion | dibujarBucle |
| 12564 | funcion | alternarGrabacion |
| 12630 | funcion | alternarTransmision |
| 12726 | funcion | iniciarConexionWebRTC |
| 12799 | funcion | abrirModalDiagnosticoConsumo |
| 12842 | funcion | cerrarModalDiagnosticoConsumo |
| 12846 | funcion | evaluarConsumo |
| 12923 | funcion | agregarDiagnosticoBitacora |
| 12948 | funcion | avanzarRuta |
| 12980 | funcion | finalizarRuta |
| 13004 | funcion | insertarRutaBitacora |
| 13014 | funcion | reiniciarRuta |
| 13042 | funcion | calcularOhm |
| 13068 | funcion | limpiarOhm |
| 13077 | funcion | cargarPreviewAvatar |
| 13095 | funcion | guardarMiPerfil |
| 13128 | funcion | procesarImagenInventario |
| 13138 | funcion | convertirABase64 |
| 13155 | funcion | obtenerLectorImei |
| 13168 | funcion | obtenerLectorFotoImei |
| 13181 | funcion | procesarFotoImeiRecibida |
| 13211 | funcion | pareceImei |
| 13221 | funcion | actualizarEstadoScannerImei |
| 13233 | funcion | procesarCodigoDetectadoImei |
| 13261 | funcion | cargarTesseractScript |
| 13274 | funcion | obtenerWorkerOcrImei |
| 13283 | funcion | mostrarSugerenciaOcrImei |
| 13292 | funcion | confirmarOcrImei |
| 13299 | funcion | descartarOcrImei |
| 13307 | funcion | iniciarOcrFallbackImei |
| 13337 | funcion | detenerOcrFallbackImei |
| 13344 | funcion | poblarSelectorCamarasImei |
| 13357 | funcion | cambiarCamaraLaptopImei |
| 13370 | funcion | abrirScannerImei |
| 13403 | funcion | usarCelularParaImei |
| 13431 | funcion | cerrarScannerImei |
| 13436 | funcion | detenerScannerImei |
| 13478 | funcion | confirmarImportacionIA |
| 13497 | funcion | abrirModalCategoriaExcel |
| 13505 | funcion | cerrarModalCategoriaExcel |
| 13513 | funcion | confirmarCategoriaExcel |
| 13520 | funcion | procesarExcelInventario |
| 13636 | funcion | detectarColumnas |
| 13851 | funcion | confirmarImportacionExcel |
| 13871 | funcion | consultarCopilotoLab |
| 13967 | funcion | mostrarCargando |
| 13986 | funcion | cerrarSesion |
| 14009 | funcion | generarResumenIA |
| 14035 | funcion | marcarAsistenciaManual |
| 14107 | funcion | registrarFeed |
| 14118 | funcion | reportarActividadImportante |
| 14133 | funcion | enviarAlertaGerencial |
| 14154 | funcion | incrementarBadgeChat |
| 14165 | funcion | limpiarBadgeChat |
| 14174 | funcion | toggleRecuperarPassword |
| 14189 | funcion | enviarCorreoRecuperacion |
| 14231 | funcion | toggleMFAView |
| 14250 | funcion | moverAlSiguiente |
| 14266 | funcion | manejarRetroceso |
| 14273 | funcion | cancelar2FA |
| 14279 | funcion | verificarCodigo2FA |
| 14373 | funcion | cambiarFuenteModelos |
| 14417 | funcion | inicializarSelectorMarcas |
| 14453 | funcion | abrirSelectorModelos |
| 14512 | funcion | cerrarSelectorModelos |
| 14516 | funcion | seleccionarMarca |
| 14527 | funcion | filtrarYRenderizarModelos |
| 14604 | funcion | agregarModeloNuevo |
| 14630 | funcion | seleccionarModelo |
| 14698 | funcion | combinarSubcategorias |
| 14705 | funcion | poblarSelectSubcategoria |
| 14713 | funcion | manejarSeleccionSubcategoria |
| 14725 | funcion | cambiarRegCategoria |
| 14778 | funcion | agregarSugerenciaNombre |
| 14854 | funcion | renderizarGruposCompatibilidad |
| 14904 | funcion | abrirModalNuevoGrupo |
| 14918 | funcion | editarGrupoCompat |
| 14935 | funcion | cerrarModalGrupoCompat |
| 14941 | funcion | abrirSelectorModelosParaGrupo |
| 14945 | funcion | agregarMiembroCompatBuilder |
| 14964 | funcion | quitarMiembroCompatBuilder |
| 14969 | funcion | renderChipsCompatBuilder |
| 14984 | funcion | guardarGrupoCompat |
| 15011 | funcion | abrirModalImportarCompat |
| 15024 | funcion | cerrarModalImportarCompat |
| 15030 | funcion | cambiarTabImportCompat |
| 15042 | funcion | procesarArchivoExcelCompat |
| 15102 | funcion | procesarArchivoIACompat |
| 15137 | funcion | renderTablaImportCompat |
| 15189 | funcion | abrirSelectorModelosParaFilaImport |
| 15194 | funcion | agregarMiembroAFilaImport |
| 15207 | funcion | quitarMiembroFilaImport |
| 15213 | funcion | quitarFilaImport |
| 15218 | funcion | confirmarImportacionCompat |
| 15244 | funcion | eliminarGrupoCompat |
| 15257 | funcion | revisarSugerenciaCompatibilidad |
| 15294 | funcion | filtrarInventario |
| 15306 | funcion | poblarFiltroSubcategoria |
| 15320 | funcion | renderizarProductosFiltrados |
| 15414 | funcion | abrirModalEtiqueta |
| 15436 | funcion | imprimirEtiquetaFinal |
| 15459 | funcion | previsualizarFotoDetalle |
| 15477 | funcion | abrirVerTiendaProducto |
| 15536 | funcion | cerrarVerTiendaProducto |
| 15541 | funcion | irAEditarProductoDesdeTienda |
| 15548 | funcion | agregarDesdeVerTienda |
| 15554 | funcion | abrirDetalleProducto |
| 15621 | funcion | cargarHistorialDetalle |
| 15651 | funcion | cerrarDetalleProducto |
| 15656 | funcion | toggleCostosPorCategoria |
| 15669 | funcion | refrescarDetSubcategoria |
| 15684 | funcion | verificarCambiosDetalle |
| 15717 | funcion | guardarDetalleProducto |
| 15783 | funcion | toggleAjusteStock |
| 15794 | funcion | guardarAjusteStock |
| 15844 | funcion | procesarFotoProveedor |
| 15856 | funcion | cargarProveedores |
| 15902 | funcion | renderizarProveedores |
| 15936 | funcion | guardarProveedor |
| 15977 | funcion | eliminarProveedor |
| 16005 | funcion | cargarPanelLicencias |
| 16073 | funcion | guardarLicencia |
| 16082 | funcion | sumarDiasLicencia |
| 16086 | funcion | borrarCodigoLicencia |
| 16103 | funcion | cargarModelosPendientes |
| 16152 | funcion | usarSugerenciaIA |
| 16159 | funcion | resolverModelo |
| 16180 | funcion | cargarResellersAdmin |
| 16238 | funcion | abrirModalReseller |
| 16248 | funcion | editarReseller |
| 16258 | funcion | guardarResellerAdmin |
| 16283 | funcion | eliminarReseller |
| 16353 | funcion | aplicarFiltroTaller |
| 16369 | funcion | limpiarFiltroTaller |
| 16376 | funcion | filtrarTablaTaller |
| 16377 | funcion | filtrarTallerPorEstado |
| 16383 | funcion | actualizarKPIsTaller |
| 16407 | funcion | filtrarTablaClientes |
| 16419 | funcion | actualizarKPIClientes |
| 16431 | funcion | abrirModalEvento |
| 16435 | funcion | guardarEvento |
| 16469 | funcion | navegarSemana |
| 16509 | funcion | abrirGeneradorLicencia |
| 16512 | funcion | cerrarGeneradorLicencia |
| 16528 | funcion | irADescargarActualizacion |
| 16538 | funcion | instalarActualizacionAhora |
| 17498 | funcion | alternarAyudante |
| 17513 | funcion | actualizarBotonAyudante |
| 17522 | funcion | hablarAyudante |
| 17554 | funcion | programarCierreAyudante |
| 17560 | funcion | ocultarAyudante |
| 17647 | funcion | coincideFrase |
| 17893 | funcion | emocionJP |
| 17904 | funcion | autodestruccionJP |
| 17925 | funcion | responderComando |
| 17954 | funcion | sorprendemeJP |
| 17985 | funcion | revisarNegocio |
| 18054 | funcion | vigilarNegocio |
| 18081 | funcion | iniciarVigilancia |
| 18101 | funcion | sinDatosJP |
| 18110 | funcion | jpVentasDeHoy |
| 18135 | funcion | jpMejorCliente |
| 18160 | funcion | jpModelosMasReparados |
| 18183 | funcion | jpComisionTecnico |
| 18207 | funcion | jpPorCobrar |
| 18231 | funcion | revisarOrdenEnCurso |
| 18302 | funcion | programarRevisionOrden |
| 18313 | funcion | cargarVozJP |
| 18330 | funcion | textoParaVoz |
| 18342 | funcion | hablarEnVozAlta |
| 18356 | funcion | alternarVozJP |
| 18372 | funcion | actualizarBotonVoz |
| 18387 | funcion | posicionGuardadaJP |
| 18399 | funcion | aplicarPosicionGuardadaJP |
| 18411 | funcion | iniciarArrastreJP |
| 18484 | funcion | celebrarOrdenGuardada |
| 18519 | funcion | revisarHitosDelDia |
| 18567 | funcion | jpDameAnimo |
| 18611 | funcion | modoFiestaJP |
| 18626 | funcion | lanzarConfeti |
| 18644 | funcion | jpComoVoyHoy |
| 18670 | funcion | jpAdivinaNumero |
| 18681 | funcion | jpCaraOSello |
| 18738 | funcion | iniciarTutorial |
| 18750 | funcion | mostrarPasoTutorial |
| 18779 | funcion | pasoTutorial |
| 18788 | funcion | terminarTutorial |
| 18803 | funcion | menuTutoriales |
| 18815 | funcion | consejoHtml |
| 18821 | funcion | normalizar |
| 18827 | funcion | buscarTema |
| 18858 | funcion | elementoObjetivo |
| 18867 | funcion | resaltarElemento |
| 18880 | funcion | quitarResaltado |
| 18885 | funcion | posarEnElemento |
| 18931 | funcion | volverASuCasa |
| 18943 | funcion | explicarTema |
| 18954 | funcion | explicarTemaPorId |
| 18959 | funcion | preguntarAlAyudante |
| 18987 | funcion | listaTemasHtml |
| 18992 | funcion | mostrarIndiceAyudante |
| 19000 | funcion | numDe |
| 19008 | funcion | explicarMetricas |


## index.html — funcion (arrow)

| Línea | Tipo | Nombre / Texto |
|---|---|---|
| 6210 | funcion (arrow) | setVis |
| 6782 | funcion (arrow) | setChk |
| 7337 | funcion (arrow) | setNum |
| 9772 | funcion (arrow) | chk |
| 11001 | funcion (arrow) | ok |
| 11040 | funcion (arrow) | mover |
| 11048 | funcion (arrow) | iniciar |
| 11049 | funcion (arrow) | soltar |
| 11267 | funcion (arrow) | alListo |
| 11819 | funcion (arrow) | renderLado |
| 12341 | funcion (arrow) | set |
| 14538 | funcion (arrow) | aItem |
| 18316 | funcion (arrow) | elegir |
| 19100 | funcion (arrow) | ocupado |
| 19101 | funcion (arrow) | libre |


## index.html — ipc (renderer)

| Línea | Tipo | Nombre / Texto |
|---|---|---|
| 2492 | ipc (renderer) | abrir-carpeta |
| 2511 | ipc (renderer) | abrir-carpeta |
| 3202 | ipc (renderer) | abrir-carpeta-plantillas |
| 5294 | ipc (renderer) | abrir-carpeta-grabaciones |
| 5867 | ipc (renderer) | registrar-error-renderer |
| 5880 | ipc (renderer) | registrar-error-renderer |
| 5941 | ipc (renderer) | iniciar-sesion-token |
| 5963 | ipc (renderer) | login-respuesta |
| 5966 | ipc (renderer) | iniciar-sesion |
| 5983 | ipc (renderer) | login-respuesta |
| 6052 | ipc (renderer) | resultado-2fa |
| 6138 | ipc (renderer) | pedir-datos-empresa |
| 6253 | ipc (renderer) | obtener-modelos-pendientes |
| 6255 | ipc (renderer) | obtener-panel-licencias |
| 6264 | ipc (renderer) | obtener-caja-errores |
| 6271 | ipc (renderer) | obtener-clientes |
| 6276 | ipc (renderer) | analisis-crm |
| 6278 | ipc (renderer) | obtener-tecnicos |
| 6280 | ipc (renderer) | obtener-tecnicos |
| 6281 | ipc (renderer) | obtener-ordenes |
| 6282 | ipc (renderer) | listar-pedidos-accesorios-pendientes |
| 6285 | ipc (renderer) | obtener-productos |
| 6286 | ipc (renderer) | obtener-subcategorias-custom |
| 6287 | ipc (renderer) | obtener-grupos-compatibilidad |
| 6290 | ipc (renderer) | obtener-productos |
| 6295 | ipc (renderer) | obtener-grupos-compatibilidad |
| 6298 | ipc (renderer) | obtener-productos |
| 6299 | ipc (renderer) | obtener-devoluciones |
| 6304 | ipc (renderer) | obtener-facturas |
| 6314 | ipc (renderer) | obtener-usuarios |
| 6315 | ipc (renderer) | obtener-tiendas |
| 6319 | ipc (renderer) | pedir-datos-empresa |
| 6355 | ipc (renderer) | obtener-monitor-actividad |
| 6358 | ipc (renderer) | monitor-actividad-respuesta |
| 6392 | ipc (renderer) | obtener-caja-errores |
| 6395 | ipc (renderer) | caja-errores-respuesta |
| 6440 | ipc (renderer) | resolver-error-app |
| 6443 | ipc (renderer) | error-app-resuelto |
| 6449 | ipc (renderer) | lista-de-facturas |
| 6485 | ipc (renderer) | buscar-facturas-devolucion |
| 6489 | ipc (renderer) | resultado-busqueda-facturas-devolucion |
| 6702 | ipc (renderer) | registrar-devolucion |
| 6705 | ipc (renderer) | devolucion-registrada |
| 6713 | ipc (renderer) | obtener-devoluciones |
| 6714 | ipc (renderer) | obtener-productos |
| 6723 | ipc (renderer) | obtener-devoluciones |
| 6732 | ipc (renderer) | lista-devoluciones |
| 6762 | ipc (renderer) | datos-empresa-respuesta |
| 6850 | ipc (renderer) | buscar-clientes |
| 6852 | ipc (renderer) | clientes-sugeridos |
| 6865 | ipc (renderer) | sugerir-stock-modelo |
| 6872 | ipc (renderer) | stock-sugerido-modelo |
| 6964 | ipc (renderer) | guardar-orden |
| 6966 | ipc (renderer) | guardar-orden |
| 7055 | ipc (renderer) | subir-foto-producto |
| 7083 | ipc (renderer) | nuevo-producto-sql |
| 7099 | ipc (renderer) | crear-usuario-nuevo |
| 7115 | ipc (renderer) | actualizar-cliente |
| 7117 | ipc (renderer) | guardar-cliente |
| 7121 | ipc (renderer) | resultado-cliente |
| 7125 | ipc (renderer) | obtener-clientes |
| 7129 | ipc (renderer) | cliente-actualizado |
| 7133 | ipc (renderer) | obtener-clientes |
| 7137 | ipc (renderer) | resultado-guardado |
| 7195 | ipc (renderer) | producto-guardado |
| 7203 | ipc (renderer) | eliminar-producto |
| 7206 | ipc (renderer) | producto-eliminado |
| 7209 | ipc (renderer) | obtener-productos |
| 7215 | ipc (renderer) | resultado-usuario |
| 7216 | ipc (renderer) | obtener-usuarios |
| 7223 | ipc (renderer) | lista-de-ordenes |
| 7455 | ipc (renderer) | obtener-accesorios-orden |
| 7458 | ipc (renderer) | accesorios-de-la-orden |
| 7472 | ipc (renderer) | asignar-tecnico-orden |
| 7475 | ipc (renderer) | lista-de-productos |
| 7611 | ipc (renderer) | registrar-venta-desktop |
| 7689 | ipc (renderer) | imprimir-documento |
| 7709 | ipc (renderer) | imprimir-documento |
| 7713 | ipc (renderer) | venta-desktop-resultado |
| 7721 | ipc (renderer) | obtener-productos |
| 7743 | ipc (renderer) | subcategorias-custom-lista |
| 7756 | ipc (renderer) | obtener-datos-reporte |
| 7792 | ipc (renderer) | datos-reporte |
| 7930 | ipc (renderer) | registrar-gasto |
| 7938 | ipc (renderer) | gasto-registrado |
| 7942 | ipc (renderer) | obtener-datos-reporte |
| 7949 | ipc (renderer) | eliminar-gasto |
| 7952 | ipc (renderer) | gasto-eliminado |
| 7955 | ipc (renderer) | obtener-datos-reporte |
| 7967 | ipc (renderer) | exportar-reporte-excel |
| 7970 | ipc (renderer) | reporte-excel-generado |
| 7991 | ipc (renderer) | exportar-inventario-excel |
| 7994 | ipc (renderer) | exportar-inventario-excel-res |
| 8008 | ipc (renderer) | obtener-cierre-dia |
| 8013 | ipc (renderer) | obtener-cierre-dia |
| 8017 | ipc (renderer) | cierre-dia-datos |
| 8196 | ipc (renderer) | obtener-top-ventas |
| 8240 | ipc (renderer) | top-ventas-data |
| 8271 | ipc (renderer) | ia-recepcion |
| 8275 | ipc (renderer) | respuesta-ia-recepcion |
| 8293 | ipc (renderer) | datos-crm |
| 8309 | ipc (renderer) | lista-de-clientes |
| 8351 | ipc (renderer) | lista-de-tecnicos |
| 8376 | ipc (renderer) | tecnico-asignado |
| 8379 | ipc (renderer) | obtener-ordenes |
| 8400 | ipc (renderer) | crear-tienda |
| 8403 | ipc (renderer) | tienda-creada |
| 8407 | ipc (renderer) | obtener-tiendas |
| 8413 | ipc (renderer) | lista-de-tiendas |
| 8420 | ipc (renderer) | asignar-tienda-usuario |
| 8423 | ipc (renderer) | tienda-asignada |
| 8424 | ipc (renderer) | obtener-usuarios |
| 8457 | ipc (renderer) | lista-de-usuarios |
| 8462 | ipc (renderer) | cambiar-estado-usuario |
| 8464 | ipc (renderer) | resultado-cambio-estado |
| 8470 | ipc (renderer) | actualizar-estado-orden |
| 8487 | ipc (renderer) | orden-actualizada |
| 8489 | ipc (renderer) | obtener-ordenes |
| 8537 | ipc (renderer) | resolver-pedido-accesorio |
| 8540 | ipc (renderer) | pedidos-accesorios-pendientes |
| 8542 | ipc (renderer) | resultado-pedido-accesorio |
| 8545 | ipc (renderer) | obtener-ordenes |
| 8549 | ipc (renderer) | listar-pedidos-accesorios-pendientes |
| 8553 | ipc (renderer) | listar-pedidos-accesorios-pendientes |
| 8880 | ipc (renderer) | obtener-estado-plan |
| 8883 | ipc (renderer) | estado-plan-respuesta |
| 8913 | ipc (renderer) | guardar-datos-empresa |
| 8916 | ipc (renderer) | resultado-datos-empresa |
| 8944 | ipc (renderer) | registrar-nuevo-cliente-saas |
| 8952 | ipc (renderer) | registro-saas-respuesta |
| 8967 | ipc (renderer) | crear-codigo-automatico |
| 8969 | ipc (renderer) | crear-codigo-automatico |
| 8973 | ipc (renderer) | codigo-creado-exito |
| 9114 | ipc (renderer) | emitir-factura-saas |
| 9358 | ipc (renderer) | factura-emitida-error |
| 9490 | ipc (renderer) | factura-emitida-exito |
| 9563 | ipc (renderer) | imprimir-documento |
| 9718 | ipc (renderer) | imprimir-documento |
| 9828 | ipc (renderer) | guardar-datos-empresa |
| 9833 | ipc (renderer) | imprimir-documento |
| 9841 | ipc (renderer) | documento-impreso |
| 9898 | ipc (renderer) | buscar-stock-tecnico |
| 9901 | ipc (renderer) | resultados-stock-tecnico |
| 9943 | ipc (renderer) | usar-repuesto-lab |
| 9953 | ipc (renderer) | repuesto-usado-lab |
| 10114 | ipc (renderer) | registrar-repuesto-externo |
| 10125 | ipc (renderer) | repuesto-externo-registrado |
| 10161 | ipc (renderer) | agregar-cobro-adicional |
| 10164 | ipc (renderer) | cobro-adicional-agregado |
| 10171 | ipc (renderer) | obtener-ordenes |
| 10180 | ipc (renderer) | obtener-compras-externas-dia |
| 10183 | ipc (renderer) | compras-externas-dia |
| 10239 | ipc (renderer) | buscar-orden-id |
| 10244 | ipc (renderer) | respuesta-orden-id |
| 10660 | ipc (renderer) | borrar-pieza-modelo |
| 10690 | ipc (renderer) | renombrar-pieza-modelo |
| 11160 | ipc (renderer) | guardar-foto-pieza-cache |
| 11161 | ipc (renderer) | subir-foto-pieza |
| 11309 | ipc (renderer) | leer-fotos-pieza-cache-modelo |
| 11316 | ipc (renderer) | buscar-fotos-modelo |
| 11327 | ipc (renderer) | guardar-foto-pieza-cache |
| 11423 | ipc (renderer) | sugerencias-nombres-pieza |
| 11654 | ipc (renderer) | guardar-foto-pieza-cache |
| 11670 | ipc (renderer) | subir-foto-pieza |
| 11695 | ipc (renderer) | estadisticas-fallas-modelo |
| 11714 | ipc (renderer) | historial-modelo-taller |
| 11734 | ipc (renderer) | listar-modelos-con-fotos |
| 11785 | ipc (renderer) | buscar-piezas-similares |
| 11806 | ipc (renderer) | reportar-pieza-modelo |
| 11807 | ipc (renderer) | reportar-pieza-modelo |
| 11822 | ipc (renderer) | buscar-fotos-modelo |
| 11839 | ipc (renderer) | buscar-fotos-modelo |
| 11863 | ipc (renderer) | imprimir-documento |
| 11866 | ipc (renderer) | documento-impreso |
| 11926 | ipc (renderer) | transcribir-audio-pieza |
| 11981 | ipc (renderer) | actualizar-bitacora-estado |
| 12008 | ipc (renderer) | abrir-ambicion |
| 12014 | ipc (renderer) | ambicion-bloqueado |
| 12312 | ipc (renderer) | listar-fuentes-pantalla |
| 12401 | ipc (renderer) | elegir-fuente-pantalla |
| 12595 | ipc (renderer) | guardar-grabacion |
| 12649 | ipc (renderer) | actualizar-modo-transmision |
| 12676 | ipc (renderer) | actualizar-modo-transmision |
| 12763 | ipc (renderer) | ambicion-resultado |
| 12779 | ipc (renderer) | abrir-log-ambicion |
| 12789 | ipc (renderer) | bitacora-actualizada |
| 12793 | ipc (renderer) | obtener-ordenes |
| 13104 | ipc (renderer) | guardar-mi-perfil |
| 13112 | ipc (renderer) | perfil-guardado-exito |
| 13135 | ipc (renderer) | analizar-documento-ia |
| 13451 | ipc (renderer) | respuesta-analisis-ia |
| 13483 | ipc (renderer) | nuevo-producto-sql |
| 13488 | ipc (renderer) | obtener-productos |
| 13618 | ipc (renderer) | preview-excel-inventario |
| 13801 | ipc (renderer) | preview-excel-resultado |
| 13854 | ipc (renderer) | importar-excel-inventario |
| 13857 | ipc (renderer) | resultado-importacion-excel |
| 13864 | ipc (renderer) | obtener-productos |
| 13881 | ipc (renderer) | ia-laboratorio |
| 13884 | ipc (renderer) | respuesta-ia-laboratorio |
| 13903 | ipc (renderer) | busqueda-global |
| 13926 | ipc (renderer) | resultados-busqueda-global |
| 13992 | ipc (renderer) | cerrar-sesion-token |
| 14018 | ipc (renderer) | generar-resumen-financiero |
| 14021 | ipc (renderer) | respuesta-resumen-financiero |
| 14042 | ipc (renderer) | marcar-asistencia-manual |
| 14049 | ipc (renderer) | registrar-salida-manual |
| 14058 | ipc (renderer) | asistencia-respuesta |
| 14074 | ipc (renderer) | salida-respuesta |
| 14090 | ipc (renderer) | salida-respuesta |
| 14306 | ipc (renderer) | verificar-2fa |
| 14311 | ipc (renderer) | marcas-modelos-respuesta |
| 14348 | ipc (renderer) | modelos-almacen-respuesta |
| 14397 | ipc (renderer) | obtener-modelos-almacen |
| 14477 | ipc (renderer) | obtener-marcas-modelos |
| 14615 | ipc (renderer) | agregar-modelo-nuevo |
| 14621 | ipc (renderer) | proponer-modelo |
| 14720 | ipc (renderer) | agregar-subcategoria-custom |
| 14787 | ipc (renderer) | lista-grupos-compatibilidad |
| 14792 | ipc (renderer) | grupo-compatibilidad-guardado |
| 14808 | ipc (renderer) | obtener-grupos-compatibilidad |
| 14809 | ipc (renderer) | obtener-productos |
| 14821 | ipc (renderer) | obtener-grupos-compatibilidad |
| 14822 | ipc (renderer) | obtener-productos |
| 14832 | ipc (renderer) | grupo-compatibilidad-eliminado |
| 14835 | ipc (renderer) | obtener-grupos-compatibilidad |
| 14836 | ipc (renderer) | obtener-productos |
| 14842 | ipc (renderer) | producto-vinculado-a-grupo |
| 14845 | ipc (renderer) | obtener-grupos-compatibilidad |
| 14846 | ipc (renderer) | obtener-productos |
| 15003 | ipc (renderer) | actualizar-grupo-compatibilidad |
| 15005 | ipc (renderer) | crear-grupo-compatibilidad |
| 15107 | ipc (renderer) | analizar-compatibilidad-archivo |
| 15110 | ipc (renderer) | respuesta-analisis-compatibilidad |
| 15236 | ipc (renderer) | crear-grupo-compatibilidad |
| 15251 | ipc (renderer) | eliminar-grupo-compatibilidad |
| 15628 | ipc (renderer) | obtener-historial-producto |
| 15744 | ipc (renderer) | subir-foto-producto |
| 15763 | ipc (renderer) | actualizar-producto-detalle |
| 15815 | ipc (renderer) | ajustar-stock-manual |
| 15885 | ipc (renderer) | obtener-proveedores-db |
| 15889 | ipc (renderer) | proveedores-db-respuesta |
| 15962 | ipc (renderer) | guardar-proveedor-db |
| 15985 | ipc (renderer) | eliminar-proveedor-db |
| 15993 | ipc (renderer) | modelo-propuesto |
| 16008 | ipc (renderer) | obtener-panel-licencias |
| 16016 | ipc (renderer) | panel-licencias-respuesta |
| 16074 | ipc (renderer) | actualizar-licencia |
| 16083 | ipc (renderer) | actualizar-licencia |
| 16087 | ipc (renderer) | borrar-codigo-licencia |
| 16090 | ipc (renderer) | licencia-actualizada |
| 16106 | ipc (renderer) | obtener-modelos-pendientes |
| 16109 | ipc (renderer) | modelos-pendientes-respuesta |
| 16168 | ipc (renderer) | resolver-modelo |
| 16171 | ipc (renderer) | modelo-resuelto |
| 16181 | ipc (renderer) | obtener-resellers-admin |
| 16185 | ipc (renderer) | resellers-admin-respuesta |
| 16218 | ipc (renderer) | guardar-reseller-respuesta |
| 16228 | ipc (renderer) | eliminar-reseller-respuesta |
| 16280 | ipc (renderer) | guardar-reseller-admin |
| 16285 | ipc (renderer) | eliminar-reseller-admin |
| 16518 | ipc (renderer) | pedir-version |
| 16521 | ipc (renderer) | recibir-version |
| 16529 | ipc (renderer) | abrir-pagina-descarga |
| 16539 | ipc (renderer) | instalar-actualizacion-ahora |
| 16542 | ipc (renderer) | actualizacion-disponible |
| 16551 | ipc (renderer) | actualizacion-lista |
| 16561 | ipc (renderer) | actualizacion-no-disponible |


# main.js


## main.js — seccion

| Línea | Tipo | Nombre / Texto |
|---|---|---|
| 29 | seccion | SESIÓN DE SUPABASE AUTH (paso previo a sacar la service_role del instalador) |
| 96 | seccion | CANDADO DE LANZAMIENTO DE AMBICION |
| 166 | seccion | MONITOR DE ACTIVIDAD Y CAJA DE ERRORES (soporte, solo casa matriz) |
| 266 | seccion | MONITOR DE ACTIVIDAD Y ERRORES: PANEL (solo casa matriz, ve TODAS las empresas) |
| 331 | seccion | CAPTURA DE PANTALLA PARA GRABAR REPARACIONES |
| 401 | seccion | CREAR CARPETAS FIRMWARE Y DUMP AL INICIAR (en userData: sobreviven actualizaciones) |
| 418 | seccion | ABRIR CARPETAS FIRMWARE / DUMP |
| 427 | seccion | GRABACIÓN DE REPARACIONES (pestaña Laboratorio) |
| 521 | seccion | TRANSMISION EN VIVO: marcar/desmarcar una orden como "En Vivo" |
| 544 | seccion | ABRIR CARPETA DE PLANTILLAS DE INVENTARIO (Excel para carga masiva) |
| 551 | seccion | OBTENER MARCAS Y MODELOS DE DISPOSITIVOS |
| 556 | seccion | AGREGAR MODELO NUEVO AL CATÁLOGO (cuando no existe uno que el usuario necesita) |
| 572 | seccion | 2. LOGIN INTELIGENTE (FILTRA POR EMPRESA Y FECHA) |
| 635 | seccion | 2.0B LOGIN AUTOMATICO CON TOKEN DE SESION RECORDADA |
| 688 | seccion | 2.0C CERRAR SESIÓN RECORDADA (invalida el token guardado) |
| 711 | seccion | 2.1 VERIFICACIÓN DE 2FA (SEGUNDO PASO DE ACCESO) |
| 808 | seccion | 3. CLIENTES (SOLO DE MI EMPRESA) |
| 925 | seccion | MI CATÁLOGO DE MODELOS: marcas y modelos deducidos del propio almacén |
| 1020 | seccion | PORTERO 1: la forma del nombre |
| 1053 | seccion | PORTERO 2: la IA |
| 1357 | seccion | COLA DE APROBACIÓN (solo la casa matriz) |
| 1410 | seccion | PROVEEDORES (PERSISTENCIA SEGURA EN SUPABASE + CONTROL DE FALLOS) |
| 1449 | seccion | SUBIR FOTO PRODUCTO |
| 1481 | seccion | HOLOGRAMA 3D: fotos reales de piezas por modelo de celular |
| 1908 | seccion | 4. INVENTARIO (SOLO DE MI EMPRESA) |
| 1971 | seccion | 4D. GRUPOS DE COMPATIBILIDAD DE MODELOS (micas/pantallas que comparten pieza y stock) |
| 2161 | seccion | 4A. SUBCATEGORÍAS PERSONALIZADAS (editables por el usuario, ej. tipos de Micas) |
| 2191 | seccion | 4B. IMPORTACIÓN DESDE EXCEL - PREVIEW |
| 2204 | seccion | TERCERA VÍA DE MATCHING: por grupo de compatibilidad |
| 2225 | seccion | LOGICA DE SUBCATEGORIAS PARA EXCEL |
| 2347 | seccion | 4C. IMPORTACIÓN DESDE EXCEL - EJECUTAR UPSERT ADITIVO |
| 2558 | seccion | 4D. HISTORIAL DE PRODUCTO |
| 2617 | seccion | 5. ORDENES/TALLER (SOLO DE MI EMPRESA) |
| 2679 | seccion | 6. REPORTES (SUMA SOLO EL DINERO DE MI EMPRESA) |
| 2848 | seccion | 6b. GASTOS OPERATIVOS (alquiler, sueldos, luz, etc. — migración 008) |
| 2882 | seccion | 6b-bis. DATOS PARA EXPORTAR EL REPORTE A EXCEL (formato de la plantilla del dueño) |
| 2999 | seccion | EXPORTAR INVENTARIO ACTUAL DE PRODUCTOS A EXCEL (.XLSX) |
| 3242 | seccion | 6b-ter. MÁS VENDIDOS por categoría (ventas del POS del período elegido) |
| 3344 | seccion | 6c. CIERRE DEL DÍA UNIFICADO (FASE 6 del plan finanzas — el "libro de caja") |
| 3542 | seccion | 6d. TIENDAS (sucursales) — asignación de personal por tienda |
| 3583 | seccion | 7. GESTIÓN DE USUARIOS (SOLO DE MI EMPRESA) |
| 3641 | seccion | 7.1 CAMBIAR ESTADO DE USUARIO (Activar/Desactivar) |
| 3667 | seccion | 8. ESTADO DEL PLAN (Para el Dashboard de Licencias) |
| 3705 | seccion | 9. CONFIGURACIÓN DE EMPRESA |
| 3750 | seccion | 10. GENERADOR AUTOMÁTICO DE LICENCIAS (SÓLO ADMIN) |
| 3784 | seccion | 10B. PANEL DE LICENCIAS (solo casa matriz) |
| 3828 | seccion | 11. REGISTRO SAAS CON VALIDACIÓN DE LICENCIA Y FECHA |
| 3855 | seccion | 12. MÓDULO DE FACTURACIÓN AUTOMÁTICA |
| 3930 | seccion | 13. ACTUALIZAR PERFIL DE USUARIO |
| 3952 | seccion | 14. MÓDULOS DE IA (Gemini y OpenAI) |
| 4003 | seccion | 14B. IMPORTAR GRUPOS DE COMPATIBILIDAD DESDE PDF O IMAGEN (Fase 5) |
| 4205 | seccion | 15. BÚSQUEDAS |
| 4357 | seccion | VENTA RÁPIDA DE ESCRITORIO (POS para cualquier rol) |
| 4523 | seccion | REPUESTO EXTERNO (traído de otro proveedor porque no había en stock) |
| 4598 | seccion | COBRO ADICIONAL: otra falla / trabajo extra hallado durante la reparación |
| 4668 | seccion | IMPRESIÓN DE COMPROBANTES |
| 4737 | seccion | 16. MÓDULO DE ASISTENCIA MANUAL |
| 4759 | seccion | HANDLER: Cargar historial de facturas |
| 4769 | seccion | MÓDULO DE DEVOLUCIONES (cliente devuelve un producto vendido) |
| 4912 | seccion | HANDLER: Análisis CRM (clientes inactivos) |
| 4925 | seccion | HANDLER: Buscar orden por ID (para el Laboratorio) |
| 4936 | seccion | HANDLER: Guardar bitácora y cambiar estado |
| 4970 | seccion | HANDLER: Accesorios ya agregados a una orden (para el Detalle de la orden) |
| 4983 | seccion | HANDLER: Cambiar estado de una orden |
| 5009 | seccion | PEDIDOS DE ACCESORIOS (creados por el cliente desde el tracking web) |
| 5086 | seccion | HANDLER: Listar usuarios |
| 5096 | seccion | HANDLER: Gestión de Resellers (Global, solo super admin) |
| 5171 | seccion | CIERRE |


## main.js — ipc (main)

| Línea | Tipo | Nombre / Texto |
|---|---|---|
| 260 | ipc (main) | registrar-error-renderer |
| 270 | ipc (main) | obtener-monitor-actividad |
| 285 | ipc (main) | obtener-caja-errores |
| 300 | ipc (main) | resolver-error-app |
| 379 | ipc (main) | pedir-version |
| 387 | ipc (main) | abrir-pagina-descarga |
| 397 | ipc (main) | instalar-actualizacion-ahora |
| 419 | ipc (main) | abrir-carpeta |
| 439 | ipc (main) | listar-fuentes-pantalla |
| 459 | ipc (main) | elegir-fuente-pantalla |
| 462 | ipc (main) | guardar-grabacion |
| 526 | ipc (main) | actualizar-modo-transmision |
| 540 | ipc (main) | abrir-carpeta-grabaciones |
| 545 | ipc (main) | abrir-carpeta-plantillas |
| 552 | ipc (main) | obtener-marcas-modelos |
| 557 | ipc (main) | agregar-modelo-nuevo |
| 573 | ipc (main) | iniciar-sesion |
| 636 | ipc (main) | iniciar-sesion-token |
| 689 | ipc (main) | cerrar-sesion-token |
| 712 | ipc (main) | verificar-2fa |
| 809 | ipc (main) | guardar-cliente |
| 823 | ipc (main) | actualizar-cliente |
| 859 | ipc (main) | obtener-clientes |
| 874 | ipc (main) | buscar-clientes |
| 902 | ipc (main) | sugerir-stock-modelo |
| 1246 | ipc (main) | obtener-modelos-almacen |
| 1280 | ipc (main) | proponer-modelo |
| 1364 | ipc (main) | obtener-modelos-pendientes |
| 1390 | ipc (main) | resolver-modelo |
| 1411 | ipc (main) | guardar-proveedor-db |
| 1427 | ipc (main) | obtener-proveedores-db |
| 1441 | ipc (main) | eliminar-proveedor-db |
| 1450 | ipc (main) | subir-foto-producto |
| 1509 | ipc (main) | subir-foto-pieza |
| 1574 | ipc (main) | reportar-pieza-modelo |
| 1607 | ipc (main) | estadisticas-fallas-modelo |
| 1642 | ipc (main) | historial-modelo-taller |
| 1662 | ipc (main) | renombrar-pieza-modelo |
| 1683 | ipc (main) | borrar-pieza-modelo |
| 1715 | ipc (main) | sugerencias-nombres-pieza |
| 1739 | ipc (main) | transcribir-audio-pieza |
| 1781 | ipc (main) | guardar-foto-pieza-cache |
| 1801 | ipc (main) | leer-fotos-pieza-cache-modelo |
| 1828 | ipc (main) | buscar-fotos-modelo |
| 1859 | ipc (main) | buscar-piezas-similares |
| 1882 | ipc (main) | listar-modelos-con-fotos |
| 1909 | ipc (main) | nuevo-producto-sql |
| 1941 | ipc (main) | obtener-productos |
| 1954 | ipc (main) | eliminar-producto |
| 1974 | ipc (main) | obtener-grupos-compatibilidad |
| 2015 | ipc (main) | crear-grupo-compatibilidad |
| 2076 | ipc (main) | actualizar-grupo-compatibilidad |
| 2123 | ipc (main) | eliminar-grupo-compatibilidad |
| 2139 | ipc (main) | vincular-producto-a-grupo |
| 2162 | ipc (main) | obtener-subcategorias-custom |
| 2179 | ipc (main) | agregar-subcategoria-custom |
| 2192 | ipc (main) | preview-excel-inventario |
| 2348 | ipc (main) | importar-excel-inventario |
| 2559 | ipc (main) | obtener-historial-producto |
| 2571 | ipc (main) | actualizar-producto-detalle |
| 2587 | ipc (main) | ajustar-stock-manual |
| 2618 | ipc (main) | guardar-orden |
| 2641 | ipc (main) | obtener-ordenes |
| 2655 | ipc (main) | obtener-tecnicos |
| 2665 | ipc (main) | asignar-tecnico-orden |
| 2687 | ipc (main) | obtener-datos-reporte |
| 2849 | ipc (main) | registrar-gasto |
| 2868 | ipc (main) | eliminar-gasto |
| 2969 | ipc (main) | obtener-datos-export |
| 2980 | ipc (main) | exportar-reporte-excel |
| 3001 | ipc (main) | exportar-inventario-excel |
| 3243 | ipc (main) | obtener-top-ventas |
| 3348 | ipc (main) | obtener-cierre-dia |
| 3543 | ipc (main) | obtener-tiendas |
| 3555 | ipc (main) | crear-tienda |
| 3569 | ipc (main) | asignar-tienda-usuario |
| 3584 | ipc (main) | crear-usuario-nuevo |
| 3642 | ipc (main) | cambiar-estado-usuario |
| 3668 | ipc (main) | obtener-estado-plan |
| 3706 | ipc (main) | guardar-datos-empresa |
| 3731 | ipc (main) | pedir-datos-empresa |
| 3751 | ipc (main) | crear-codigo-automatico |
| 3788 | ipc (main) | obtener-panel-licencias |
| 3799 | ipc (main) | actualizar-licencia |
| 3816 | ipc (main) | borrar-codigo-licencia |
| 3829 | ipc (main) | registrar-nuevo-cliente-saas |
| 3856 | ipc (main) | emitir-factura-saas |
| 3931 | ipc (main) | guardar-mi-perfil |
| 3953 | ipc (main) | analizar-documento-ia |
| 4013 | ipc (main) | analizar-compatibilidad-archivo |
| 4056 | ipc (main) | ia-recepcion |
| 4099 | ipc (main) | ia-laboratorio |
| 4143 | ipc (main) | generar-resumen-financiero |
| 4206 | ipc (main) | buscar-stock-tecnico |
| 4237 | ipc (main) | abrir-ambicion |
| 4349 | ipc (main) | abrir-log-ambicion |
| 4361 | ipc (main) | registrar-venta-desktop |
| 4437 | ipc (main) | usar-repuesto-lab |
| 4526 | ipc (main) | registrar-repuesto-externo |
| 4602 | ipc (main) | agregar-cobro-adicional |
| 4646 | ipc (main) | obtener-compras-externas-dia |
| 4672 | ipc (main) | imprimir-documento |
| 4722 | ipc (main) | busqueda-global |
| 4738 | ipc (main) | marcar-asistencia-manual |
| 4760 | ipc (main) | obtener-facturas |
| 4774 | ipc (main) | buscar-facturas-devolucion |
| 4796 | ipc (main) | registrar-devolucion |
| 4893 | ipc (main) | obtener-devoluciones |
| 4913 | ipc (main) | analisis-crm |
| 4926 | ipc (main) | buscar-orden-id |
| 4937 | ipc (main) | actualizar-bitacora-estado |
| 4971 | ipc (main) | obtener-accesorios-orden |
| 4984 | ipc (main) | actualizar-estado-orden |
| 5012 | ipc (main) | listar-pedidos-accesorios-pendientes |
| 5023 | ipc (main) | resolver-pedido-accesorio |
| 5087 | ipc (main) | obtener-usuarios |
| 5097 | ipc (main) | obtener-resellers-admin |
| 5112 | ipc (main) | guardar-reseller-admin |
| 5154 | ipc (main) | eliminar-reseller-admin |
| 5175 | ipc (main) | registrar-salida-manual |


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
| 432 | funcion | carpetaGrabaciones |
| 1038 | funcion | validarFormatoModelo |
| 1062 | funcion | distanciaEdicion |
| 1081 | funcion | candidatosDelCatalogo |
| 1153 | funcion | verificarModeloConIA |
| 1199 | funcion | stockPorModeloDeEmpresa |
| 1223 | funcion | sincronizarUsoModelos |
| 1764 | funcion | holoCacheDir |
| 1769 | funcion | holoManifestPath |
| 1772 | funcion | holoLeerManifest |
| 1775 | funcion | holoGuardarManifest |
| 2885 | funcion | recolectarDatosExport |
| 3022 | funcion | agregarHojaInventario |
| 3122 | funcion | construirExcelReporte |
| 4223 | funcion | copiarCarpetaRecursivo |
| 5191 | funcion | registrarFeed |

