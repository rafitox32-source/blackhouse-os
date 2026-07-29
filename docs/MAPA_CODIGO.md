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
| 2136 | comentario | Interruptor del ayudante animado (siempre visible para cualquiera) |
| 2148 | comentario | BARRA SUPERIOR (Corregida con todos sus cierres) |
| 2390 | comentario | HOLOGRAMA 3D: Diagnóstico visual del equipo |
| 2407 | comentario | Estadísticas comunitarias: qué se marcó dañado más seguido en este modelo |
| 2412 | comentario | Piezas de ESTA sesión: se van agregando a medida que fotografías/grabas cada una |
| 2520 | comentario | Modal: Ruta de Diagnóstico de Encendido (antes vivía fija en Laboratorio, ahora en modal para dejar el espacio al Holograma) |
| 2530 | comentario | Progress Bar |
| 2535 | comentario | Pasos |
| 2583 | comentario | Resumen / Fin |
| 2597 | comentario | Modal: VUELTA 360° de una pieza (Opción A del holograma) |
| 2607 | comentario | Instrucciones paso a paso (plegadas por defecto) |
| 2636 | comentario | Visor / previsualización |
| 2667 | comentario | Modal: Fotografiar pieza para el Holograma 3D |
| 2684 | comentario | Modo guiado: la app va pidiendo cara por cara con instrucciones |
| 2696 | comentario | Modo manual (guiado desactivado): elegir cara suelta |
| 2766 | comentario | Modal: Historial privado de este modelo en TU taller |
| 2778 | comentario | Modal: Buscar piezas en modelos similares (referencia visual) |
| 2798 | comentario | Modal: Abrir un modelo ya guardado en la librería (sin necesitar una orden) |
| 2811 | comentario | Modal: Comparar Antes / Después de una pieza |
| 2831 | comentario | ============ VENTA RÁPIDA (POS de escritorio, para todos los roles) ============ |
| 2872 | comentario | Modal: producto libre (venta sin stock) |
| 2952 | comentario | La mano de obra ya no se escribe: sale de restarle el repuesto al total. |
| 3087 | comentario | Stats Row |
| 3117 | comentario | Search |
| 3128 | comentario | Table |
| 3153 | comentario | Las tarjetas se poblarán dinámicamente |
| 3199 | comentario | Pestañas de Navegación de Inventario |
| 3271 | comentario | ================= NUEVO BLOQUE ================= |
| 3278 | comentario | ================================================= |
| 3284 | comentario | Sugerencias de Accesorios |
| 3304 | comentario | Sugerencias de Repuestos |
| 3324 | comentario | Sugerencias de Micas |
| 3342 | comentario | Selector de Modelo para Pantallas y Micas |
| 3619 | comentario | NUEVA SECCIÓN: MI PERFIL |
| 3624 | comentario | FOTO DE PERFIL |
| 3646 | comentario | DATOS |
| 3765 | comentario | ============ APARIENCIA / TEMA ============ |
| 3774 | comentario | ORIGINAL |
| 3788 | comentario | NEGRO |
| 3802 | comentario | BLANCO |
| 3816 | comentario | DOHA-CELL (marca) |
| 3830 | comentario | PREMIUM |
| 3851 | comentario | ============ TICKET / COMPROBANTE (personalización de impresión) ============ |
| 3860 | comentario | Formulario |
| 3915 | comentario | Vista previa en vivo (80mm) |
| 3991 | comentario | NUEVA SECCIÓN: DISTRIBUIDORES |
| 4010 | comentario | Se poblará dinámicamente |
| 4016 | comentario | PANEL DE LICENCIAS (solo casa matriz) |
| 4063 | comentario | COLA DE REVISIÓN DEL CATÁLOGO COMPARTIDO DE MODELOS |
| 4113 | comentario | Quick Stats |
| 4146 | comentario | Calendar Grid |
| 4178 | comentario | Modal Nuevo Evento (Si no existe) |
| 4249 | comentario | Vacío = alta nueva; con id = se está corrigiendo la ficha de ese cliente. |
| 4299 | comentario | Modal Nuevo Proveedor |
| 4342 | comentario | Modal Nuevo / Editar Reseller |
| 4399 | comentario | Modal Selector de Modelos Premium |
| 4409 | comentario | De dónde salen los modelos: el almacén propio o el catálogo mundial |
| 4432 | comentario | Grid de marcas comunes |
| 4434 | comentario | Se poblará dinámicamente con JS |
| 4443 | comentario | Listado de modelos |
| 4446 | comentario | Se poblará dinámicamente con JS |
| 4457 | comentario | Modal Crear/Editar Grupo de Compatibilidad |
| 4505 | comentario | Modal Importar Grupos de Compatibilidad desde archivo (Fase 5) |
| 4564 | comentario | Modal Escáner de IMEI/código de barras por cámara web (Recepción) |
| 4593 | comentario | Modal Registrar Devolución |
| 4691 | comentario | Modal de Selección de Categoría para Excel |
| 4723 | comentario | Modal de Importación Excel |
| 4784 | comentario | MODAL VISTA TIENDA DEL PRODUCTO |
| 4818 | comentario | MODAL IMPRIMIR ETIQUETA |
| 4842 | comentario | CONTENEDOR PARA IMPRESIÓN (OCULTO EN PANTALLA, VISIBLE EN IMPRESIÓN) |
| 4845 | comentario | MODAL DETALLE DE PRODUCTO (SÓLO LECTURA Y EDICIÓN PARCIAL) |
| 4856 | comentario | Bloque 1: Datos Generales |
| 4919 | comentario | Bloque 2: Costos por proveedor (Condicional) |
| 4942 | comentario | Bloque 3: Precios de venta |
| 4957 | comentario | Bloque 4: Historial de Ingresos |
| 5030 | comentario | Modal: elegir formato del comprobante ya emitido (PDF o Ticket) |
| 5050 | comentario | Modal Diagnóstico Consumo |
| 5088 | comentario | ===== ESTUDIO DE GRABACIÓN DE REPARACIONES ===== |
| 5105 | comentario | Vista previa: lo que se ve aquí es exactamente lo que se graba |
| 5114 | comentario | Escenas |
| 5126 | comentario | Configuración de fuentes y vinculación |
| 5192 | comentario | Controles |
| 5210 | comentario | Modal: Vincular la cámara del celular por WiFi al Estudio de Grabación |
| 5255 | comentario | Modal: Cobro adicional (otra falla / trabajo extra encontrado en la reparación) |
| 5293 | comentario | Modal: Bloqueo del equipo (Patrón / Clave / Contraseña) |
| 5304 | comentario | PATRÓN: 9 puntos para dibujar |
| 5313 | comentario | CLAVE: teclado numérico |
| 5332 | comentario | CONTRASEÑA: escribir |
| 5347 | comentario | Modal: Repuesto externo (traído de otro proveedor) |
| 5385 | comentario | Modal: Reponer stock (agotados y por agotarse, agrupados por categoría) |
| 5400 | comentario | Modal: Más vendidos por categoría (según el período elegido en Métricas) |
| 5418 | comentario | Modal: Detalle de orden (datos de Recepción: foto de evidencia y firma del cliente) |
| 5455 | comentario | Modal: Selector de tema (visible para TODOS los roles desde el botón del sidebar) |
| 5478 | comentario | Modal: Cierre del Día unificado (taller + POS − gastos − compras − devoluciones) |
| 5495 | comentario | Modal: Registrar gasto operativo |
| 5533 | comentario | Modal: Compras externas del día (cierre por proveedor) |
| 5548 | comentario | Cabecera con info del canal activo |
| 5567 | comentario | Pestañas de canales temáticos |
| 5588 | comentario | Área de mensajes |
| 5591 | comentario | Indicador de escritura |
| 5597 | comentario | Input de mensaje |
| 5611 | comentario | MARCA DE AGUA (Solo para Notas de Venta) |
| 5617 | comentario | ENCABEZADO |
| 5650 | comentario | DATOS DEL CLIENTE |
| 5676 | comentario | TABLA DE DETALLES |
| 5706 | comentario | TOTALES Y PIE DE PÁGINA |
| 15819 | comentario | TICKET DE ORDEN (oculto, solo para html2canvas) |
| 15862 | comentario | QR de rastreo individual por orden |
| 16093 | comentario | ================= AYUDANTE ANIMADO (robot con puerta) ================= |
| 16117 | comentario | Marco y hueco de la puerta |
| 16119 | comentario | El robot sube desde dentro del hueco |
| 16121 | comentario | antena |
| 16124 | comentario | cabeza |
| 16127 | comentario | visor |
| 16131 | comentario | boca: recta normal, sonrisa y tristeza (se alternan según la emoción) |
| 16139 | comentario | orejas |
| 16142 | comentario | cuerpo |
| 16146 | comentario | brazo que saluda |
| 16150 | comentario | Hojas de la puerta |


## index.html — modal

| Línea | Tipo | Nombre / Texto |
|---|---|---|
| 2521 | modal | ruta-diagnostico |
| 2598 | modal | holo-giro |
| 2668 | modal | holo-foto |
| 2767 | modal | holo-historial |
| 2779 | modal | holo-similares |
| 2799 | modal | holo-modelos |
| 2812 | modal | holo-comparar |
| 2873 | modal | venta-libre |
| 4179 | modal | evento |
| 4246 | modal | cliente |
| 4251 | modal | cliente-aviso |
| 4275 | modal | usuario |
| 4300 | modal | proveedor |
| 4343 | modal | reseller |
| 4400 | modal | selector-modelos |
| 4458 | modal | grupo-compat |
| 4506 | modal | importar-compat |
| 4565 | modal | scanner-imei |
| 4594 | modal | registrar-devolucion |
| 4664 | modal | confirm-custom |
| 4678 | modal | confirm-ai |
| 4692 | modal | categoria-excel |
| 4724 | modal | excel-import |
| 4785 | modal | ver-tienda-producto |
| 4819 | modal | imprimir-etiqueta |
| 4846 | modal | detalle-producto |
| 4985 | modal | facturacion |
| 5031 | modal | comprobante-listo |
| 5051 | modal | diagnostico-consumo |
| 5091 | modal | grabacion |
| 5211 | modal | camara-celular |
| 5226 | modal | ohm |
| 5256 | modal | cobro-adicional |
| 5294 | modal | bloqueo-equipo |
| 5348 | modal | repuesto-externo |
| 5386 | modal | reponer-stock |
| 5401 | modal | top-ventas |
| 5419 | modal | detalle-orden |
| 5456 | modal | tema |
| 5479 | modal | cierre-dia |
| 5496 | modal | gasto |
| 5534 | modal | compras-dia |
| 16004 | modal | super-admin |


## index.html — funcion

| Línea | Tipo | Nombre / Texto |
|---|---|---|
| 5803 | funcion | showToast |
| 5826 | funcion | iniciarSesion |
| 5996 | funcion | guardarPersonalizacion |
| 6005 | funcion | aplicarPersonalizacion |
| 6032 | funcion | _pintarTema |
| 6043 | funcion | abrirSelectorTema |
| 6047 | funcion | cerrarSelectorTema |
| 6051 | funcion | aplicarTema |
| 6061 | funcion | cargarTemaGuardado |
| 6071 | funcion | aplicarPermisos |
| 6140 | funcion | showView |
| 6228 | funcion | buscarFacturasDevolucionDebounced |
| 6259 | funcion | seleccionarFacturaDevolucion |
| 6297 | funcion | cerrarFacturaSeleccionadaDevolucion |
| 6304 | funcion | escaparHtmlDevol |
| 6313 | funcion | intentarMatchProductoPorNombre |
| 6319 | funcion | poblarSelectorProductoDevolucion |
| 6340 | funcion | abrirFormularioDevolucionItem |
| 6363 | funcion | abrirDevolucionSinFactura |
| 6384 | funcion | cerrarModalDevolucion |
| 6388 | funcion | actualizarAvisoCondicionDevolucion |
| 6404 | funcion | toggleMontoDevolucion |
| 6410 | funcion | guardarDevolucion |
| 6471 | funcion | cargarDevoluciones |
| 6486 | funcion | renderizarHistorialDevoluciones |
| 6551 | funcion | showConfigSection |
| 6560 | funcion | calcularTotal |
| 6589 | funcion | buscarClienteRecepcion |
| 6610 | funcion | sugerirStockModelo |
| 6631 | funcion | pintarRepuestosSugeridos |
| 6651 | funcion | elegirRepuestoSugerido |
| 6665 | funcion | costoRepuestoEditado |
| 6677 | funcion | guardarOrden |
| 6706 | funcion | procesarDecision |
| 6727 | funcion | previsualizarFotoProducto |
| 6742 | funcion | comprimirImagen |
| 6780 | funcion | guardarProducto |
| 6841 | funcion | crearUsuario |
| 6851 | funcion | guardarCliente |
| 6950 | funcion | eliminarProducto |
| 6979 | funcion | renderOrdenesTaller |
| 7073 | funcion | actualizarDashboardBento |
| 7129 | funcion | tick |
| 7151 | funcion | verDetalleOrden |
| 7220 | funcion | asignarTecnicoOrden |
| 7234 | funcion | _escV |
| 7238 | funcion | _ventaSinControl |
| 7240 | funcion | renderVentaProductos |
| 7281 | funcion | agregarVentaProducto |
| 7296 | funcion | abrirVentaLibre |
| 7302 | funcion | agregarVentaLibre |
| 7311 | funcion | cambiarCantidadVenta |
| 7320 | funcion | totalVenta |
| 7322 | funcion | renderVentaCarrito |
| 7340 | funcion | vaciarVenta |
| 7344 | funcion | cobrarVenta |
| 7364 | funcion | _finVentaEnCurso |
| 7370 | funcion | generarCotizacion |
| 7444 | funcion | imprimirTicketVenta |
| 7479 | funcion | toggleMenuAgregarInventario |
| 7499 | funcion | cambiarPeriodoReporte |
| 7509 | funcion | animarNumero |
| 7512 | funcion | paso |
| 7520 | funcion | pintarBadge |
| 7532 | funcion | toggleDetalleIngresos |
| 7536 | funcion | irAGastos |
| 7590 | funcion | setTipoGrafica |
| 7596 | funcion | renderChartReporte |
| 7668 | funcion | abrirModalGasto |
| 7676 | funcion | guardarGasto |
| 7697 | funcion | eliminarGasto |
| 7712 | funcion | exportarReporteExcel |
| 7725 | funcion | exportarInventarioExcel |
| 7754 | funcion | abrirCierreDia |
| 7760 | funcion | confirmarCierreDia |
| 7856 | funcion | copiarCierreDia |
| 7896 | funcion | abrirReponerStock |
| 7932 | funcion | copiarListaReposicion |
| 7940 | funcion | abrirTopVentas |
| 7951 | funcion | setTopVentasTab |
| 7958 | funcion | renderTopVentas |
| 8008 | funcion | simularIA |
| 8035 | funcion | generarQR |
| 8078 | funcion | abrirModalCliente |
| 8092 | funcion | cerrarModalCliente |
| 8119 | funcion | nombreTecnico |
| 8138 | funcion | renderTiendasChips |
| 8146 | funcion | crearTienda |
| 8168 | funcion | asignarTiendaUsuario |
| 8177 | funcion | renderTablaUsuarios |
| 8211 | funcion | cambiarEstadoUsuario |
| 8218 | funcion | cambiarEstadoOrden |
| 8242 | funcion | toggleNotifPedidos |
| 8254 | funcion | renderPedidosPendientes |
| 8285 | funcion | resolverPedidoAccesorio |
| 8310 | funcion | getPos |
| 8321 | funcion | limpiarFirma |
| 8325 | funcion | toggleCamara |
| 8343 | funcion | usarCelularParaFoto |
| 8359 | funcion | apagarCamara |
| 8371 | funcion | tomarFoto |
| 8380 | funcion | retomarFoto |
| 8410 | funcion | entrarModoBeta |
| 8460 | funcion | _poblarTallerDemo |
| 8486 | funcion | _poblarClientesDemo |
| 8506 | funcion | _poblarInventarioDemo |
| 8521 | funcion | _poblarCRMDemo |
| 8532 | funcion | _poblarGraficoDemo |
| 8560 | funcion | guardarConfigWA |
| 8567 | funcion | iniciarTutorial |
| 8623 | funcion | cargarEstadoPlan |
| 8640 | funcion | guardarDatosEmpresa |
| 8673 | funcion | mostrarRegistro |
| 8678 | funcion | ocultarRegistro |
| 8683 | funcion | registrarNuevoNegocio |
| 8712 | funcion | generarNuevaLicencia |
| 8741 | funcion | copiarCodigoManual |
| 8772 | funcion | numeroALetras |
| 8787 | funcion | menorDeCien |
| 8795 | funcion | menorDeMil |
| 8805 | funcion | convertir |
| 8830 | funcion | abrirModalFacturacion |
| 8845 | funcion | emitirFactura |
| 8873 | funcion | _finEmisionFactura |
| 8915 | funcion | toggleChat |
| 8921 | funcion | cambiarCanalChat |
| 8936 | funcion | cargarHistorialChatCanal |
| 8958 | funcion | iniciarChatEnVivo |
| 8987 | funcion | recibirMensaje |
| 9047 | funcion | enviarMensajeChat |
| 9074 | funcion | notificarEscritura |
| 9080 | funcion | mostrarEscribiendo |
| 9094 | funcion | notificarChatOrden |
| 9114 | funcion | renderComprobanteDoc |
| 9260 | funcion | verFacturaHistorial |
| 9286 | funcion | _escComp |
| 9292 | funcion | _serializarInvoicePDF |
| 9310 | funcion | descargarComprobantePDF |
| 9324 | funcion | _ticketInner |
| 9387 | funcion | generarGarantiaDesdeComprobante |
| 9411 | funcion | _emitirGarantiaPDF |
| 9472 | funcion | construirTicketHTML |
| 9484 | funcion | _htmlTicket |
| 9489 | funcion | cargarLogoTicket |
| 9504 | funcion | quitarLogoTicket |
| 9509 | funcion | sincronizarLogoDesdeUrl |
| 9520 | funcion | _leerOpcionesTicket |
| 9530 | funcion | renderTicketPreview |
| 9560 | funcion | guardarTicket |
| 9580 | funcion | imprimirComprobanteTicket |
| 9606 | funcion | toggleTimer |
| 9633 | funcion | filtrarStockTecnico |
| 9683 | funcion | usarRepuestoLab |
| 9719 | funcion | avisarMargenNegativo |
| 9733 | funcion | centroPunto |
| 9738 | funcion | construirPuntosPatron |
| 9755 | funcion | tocarPunto |
| 9764 | funcion | dibujarLineasPatron |
| 9775 | funcion | borrarPatron |
| 9782 | funcion | pinTecla |
| 9786 | funcion | pinBorrar |
| 9791 | funcion | cambiarTipoBloqueo |
| 9802 | funcion | abrirBloqueoEquipo |
| 9810 | funcion | guardarBloqueoEquipo |
| 9815 | funcion | guardarBloqueoEquipoActual |
| 9832 | funcion | abrirRepuestoExterno |
| 9851 | funcion | registrarRepuestoExterno |
| 9888 | funcion | abrirCobroAdicional |
| 9898 | funcion | guardarCobroAdicional |
| 9926 | funcion | abrirReporteComprasDia |
| 9977 | funcion | buscarOrdenLab |
| 10041 | funcion | holoRoundedRectShape |
| 10056 | funcion | holoSlabGeometry |
| 10062 | funcion | initHologramaLab |
| 10131 | funcion | holoCrearCajaFoto |
| 10170 | funcion | holoConstruirCelular |
| 10298 | funcion | holoSlotAutomatico |
| 10304 | funcion | holoCrearEtiqueta |
| 10328 | funcion | holoCrearPiezaDinamica |
| 10364 | funcion | holoEliminarPiezaDeEscena |
| 10379 | funcion | holoLimpiarTodasLasPiezas |
| 10394 | funcion | holoEliminarPieza |
| 10417 | funcion | holoDeshacerBorrado |
| 10430 | funcion | holoRenombrarPieza |
| 10461 | funcion | holoRenderListaPiezas |
| 10490 | funcion | holoBuscarPieza |
| 10503 | funcion | holoOrdenarAutomatico |
| 10514 | funcion | holoResize |
| 10524 | funcion | holoToggleFullscreen |
| 10541 | funcion | holoAnimar |
| 10553 | funcion | holoAplicarFactor |
| 10559 | funcion | holoSetExplode |
| 10580 | funcion | holoRegistrarPickTargets |
| 10590 | funcion | holoActualizarMouseNDC |
| 10596 | funcion | holoConfigurarDragPiezas |
| 10659 | funcion | holoAplicarColor |
| 10681 | funcion | holoTogglePieza |
| 10686 | funcion | holoReset |
| 10727 | funcion | holoGiroExtraerCuadros |
| 10763 | funcion | holoGiroMostrar |
| 10783 | funcion | holoGiroConectarArrastre |
| 10808 | funcion | holoAbrirGiro |
| 10821 | funcion | holoCerrarGiro |
| 10828 | funcion | holoAbrirGiroDePieza |
| 10843 | funcion | holoGiroToggleAyuda |
| 10848 | funcion | holoGiroDesdeArchivo |
| 10880 | funcion | _holoDataURLaBytes |
| 10888 | funcion | holoGiroGuardar |
| 10932 | funcion | holoGiroCargarGuardado |
| 10948 | funcion | holoObtenerCaraFoto |
| 10961 | funcion | holoNormalMapDesdeImagen |
| 10998 | funcion | holoAplicarMediaDesdeURL |
| 11043 | funcion | holoCargarFotosDelModelo |
| 11096 | funcion | holoToggleModoGuiado |
| 11105 | funcion | holoActualizarPanelGuiado |
| 11116 | funcion | holoResetCapturaParcial |
| 11131 | funcion | holoAvanzarGuiado |
| 11143 | funcion | holoSaltarCaraGuiada |
| 11147 | funcion | holoTerminarGuiado |
| 11152 | funcion | holoAbrirModalFoto |
| 11180 | funcion | holoCerrarModalFoto |
| 11212 | funcion | holoToggleAnotacion |
| 11225 | funcion | holoRedibujarAnotacion |
| 11257 | funcion | holoCambiarModo |
| 11269 | funcion | holoToggleCamara |
| 11292 | funcion | holoUsarCelularParaFoto |
| 11306 | funcion | holoApagarCamaraFoto |
| 11319 | funcion | holoTomarFoto |
| 11335 | funcion | holoIniciarGrabacion |
| 11361 | funcion | holoDetenerGrabacion |
| 11365 | funcion | holoRetomarFoto |
| 11376 | funcion | holoGuardarFoto |
| 11438 | funcion | holoAplicarEstadisticasComunidad |
| 11454 | funcion | holoAbrirHistorialTaller |
| 11477 | funcion | holoAbrirSelectorModelos |
| 11488 | funcion | holoRenderListaModelos |
| 11505 | funcion | holoFiltrarListaModelos |
| 11510 | funcion | holoSeleccionarModeloGuardado |
| 11517 | funcion | holoAbrirModelosSimilares |
| 11523 | funcion | holoBuscarModelosSimilares |
| 11549 | funcion | holoReportarPieza |
| 11561 | funcion | holoCompararPieza |
| 11582 | funcion | holoGenerarReporte |
| 11623 | funcion | holoCapturarPantalla |
| 11645 | funcion | holoSugerirNombrePieza |
| 11657 | funcion | holoGrabarNotaVoz |
| 11719 | funcion | guardarReparacionLab |
| 11750 | funcion | abrirSoftwareAmbicion |
| 11800 | funcion | generarCodigoSalaCamara |
| 11806 | funcion | emparejarCelular |
| 11905 | funcion | alternarCamaraCelular |
| 11914 | funcion | cerrarModalCamaraCelular |
| 11925 | funcion | desconectarCamaraCelular |
| 11951 | funcion | abrirEstudioGrabacion |
| 11971 | funcion | cerrarEstudioGrabacion |
| 11987 | funcion | listarDispositivosGrabacion |
| 12017 | funcion | guardarConfigGrabacion |
| 12031 | funcion | cargarConfigGrabacion |
| 12033 | funcion | aplicarConfigGuardada |
| 12048 | funcion | videoDeStream |
| 12057 | funcion | videoDeArchivo |
| 12067 | funcion | encenderEstudio |
| 12126 | funcion | mostrarEstadoTransmision |
| 12139 | funcion | apagarEstudio |
| 12163 | funcion | cambiarEscena |
| 12177 | funcion | marcarEscenaActiva |
| 12186 | funcion | dibujarCover |
| 12194 | funcion | dibujarContain |
| 12202 | funcion | dibujarCamaraConMarco |
| 12210 | funcion | dibujarBucle |
| 12259 | funcion | alternarGrabacion |
| 12325 | funcion | alternarTransmision |
| 12421 | funcion | iniciarConexionWebRTC |
| 12494 | funcion | abrirModalDiagnosticoConsumo |
| 12537 | funcion | cerrarModalDiagnosticoConsumo |
| 12541 | funcion | evaluarConsumo |
| 12618 | funcion | agregarDiagnosticoBitacora |
| 12643 | funcion | avanzarRuta |
| 12675 | funcion | finalizarRuta |
| 12699 | funcion | insertarRutaBitacora |
| 12709 | funcion | reiniciarRuta |
| 12737 | funcion | calcularOhm |
| 12763 | funcion | limpiarOhm |
| 12772 | funcion | cargarPreviewAvatar |
| 12790 | funcion | guardarMiPerfil |
| 12823 | funcion | procesarImagenInventario |
| 12833 | funcion | convertirABase64 |
| 12850 | funcion | obtenerLectorImei |
| 12865 | funcion | pareceImei |
| 12870 | funcion | actualizarEstadoScannerImei |
| 12881 | funcion | procesarCodigoDetectadoImei |
| 12903 | funcion | abrirScannerImei |
| 12933 | funcion | usarCelularParaImei |
| 12959 | funcion | cerrarScannerImei |
| 12964 | funcion | detenerScannerImei |
| 13005 | funcion | confirmarImportacionIA |
| 13024 | funcion | abrirModalCategoriaExcel |
| 13032 | funcion | cerrarModalCategoriaExcel |
| 13040 | funcion | confirmarCategoriaExcel |
| 13047 | funcion | procesarExcelInventario |
| 13163 | funcion | detectarColumnas |
| 13378 | funcion | confirmarImportacionExcel |
| 13398 | funcion | consultarCopilotoLab |
| 13494 | funcion | mostrarCargando |
| 13513 | funcion | cerrarSesion |
| 13536 | funcion | generarResumenIA |
| 13562 | funcion | marcarAsistenciaManual |
| 13634 | funcion | registrarFeed |
| 13645 | funcion | reportarActividadImportante |
| 13660 | funcion | enviarAlertaGerencial |
| 13681 | funcion | incrementarBadgeChat |
| 13692 | funcion | limpiarBadgeChat |
| 13701 | funcion | toggleRecuperarPassword |
| 13716 | funcion | enviarCorreoRecuperacion |
| 13758 | funcion | toggleMFAView |
| 13777 | funcion | moverAlSiguiente |
| 13793 | funcion | manejarRetroceso |
| 13800 | funcion | cancelar2FA |
| 13806 | funcion | verificarCodigo2FA |
| 13900 | funcion | cambiarFuenteModelos |
| 13944 | funcion | inicializarSelectorMarcas |
| 13980 | funcion | abrirSelectorModelos |
| 14039 | funcion | cerrarSelectorModelos |
| 14043 | funcion | seleccionarMarca |
| 14054 | funcion | filtrarYRenderizarModelos |
| 14131 | funcion | agregarModeloNuevo |
| 14157 | funcion | seleccionarModelo |
| 14225 | funcion | combinarSubcategorias |
| 14232 | funcion | poblarSelectSubcategoria |
| 14240 | funcion | manejarSeleccionSubcategoria |
| 14252 | funcion | cambiarRegCategoria |
| 14305 | funcion | agregarSugerenciaNombre |
| 14381 | funcion | renderizarGruposCompatibilidad |
| 14431 | funcion | abrirModalNuevoGrupo |
| 14445 | funcion | editarGrupoCompat |
| 14462 | funcion | cerrarModalGrupoCompat |
| 14468 | funcion | abrirSelectorModelosParaGrupo |
| 14472 | funcion | agregarMiembroCompatBuilder |
| 14491 | funcion | quitarMiembroCompatBuilder |
| 14496 | funcion | renderChipsCompatBuilder |
| 14511 | funcion | guardarGrupoCompat |
| 14538 | funcion | abrirModalImportarCompat |
| 14551 | funcion | cerrarModalImportarCompat |
| 14557 | funcion | cambiarTabImportCompat |
| 14569 | funcion | procesarArchivoExcelCompat |
| 14629 | funcion | procesarArchivoIACompat |
| 14664 | funcion | renderTablaImportCompat |
| 14716 | funcion | abrirSelectorModelosParaFilaImport |
| 14721 | funcion | agregarMiembroAFilaImport |
| 14734 | funcion | quitarMiembroFilaImport |
| 14740 | funcion | quitarFilaImport |
| 14745 | funcion | confirmarImportacionCompat |
| 14771 | funcion | eliminarGrupoCompat |
| 14784 | funcion | revisarSugerenciaCompatibilidad |
| 14821 | funcion | filtrarInventario |
| 14833 | funcion | poblarFiltroSubcategoria |
| 14847 | funcion | renderizarProductosFiltrados |
| 14941 | funcion | abrirModalEtiqueta |
| 14963 | funcion | imprimirEtiquetaFinal |
| 14986 | funcion | previsualizarFotoDetalle |
| 15004 | funcion | abrirVerTiendaProducto |
| 15063 | funcion | cerrarVerTiendaProducto |
| 15068 | funcion | irAEditarProductoDesdeTienda |
| 15075 | funcion | agregarDesdeVerTienda |
| 15081 | funcion | abrirDetalleProducto |
| 15148 | funcion | cargarHistorialDetalle |
| 15178 | funcion | cerrarDetalleProducto |
| 15183 | funcion | toggleCostosPorCategoria |
| 15196 | funcion | refrescarDetSubcategoria |
| 15211 | funcion | verificarCambiosDetalle |
| 15244 | funcion | guardarDetalleProducto |
| 15310 | funcion | toggleAjusteStock |
| 15321 | funcion | guardarAjusteStock |
| 15371 | funcion | procesarFotoProveedor |
| 15383 | funcion | cargarProveedores |
| 15429 | funcion | renderizarProveedores |
| 15463 | funcion | guardarProveedor |
| 15504 | funcion | eliminarProveedor |
| 15532 | funcion | cargarPanelLicencias |
| 15600 | funcion | guardarLicencia |
| 15609 | funcion | sumarDiasLicencia |
| 15613 | funcion | borrarCodigoLicencia |
| 15630 | funcion | cargarModelosPendientes |
| 15679 | funcion | usarSugerenciaIA |
| 15686 | funcion | resolverModelo |
| 15707 | funcion | cargarResellersAdmin |
| 15765 | funcion | abrirModalReseller |
| 15775 | funcion | editarReseller |
| 15785 | funcion | guardarResellerAdmin |
| 15810 | funcion | eliminarReseller |
| 15880 | funcion | aplicarFiltroTaller |
| 15896 | funcion | limpiarFiltroTaller |
| 15903 | funcion | filtrarTablaTaller |
| 15904 | funcion | filtrarTallerPorEstado |
| 15910 | funcion | actualizarKPIsTaller |
| 15934 | funcion | filtrarTablaClientes |
| 15946 | funcion | actualizarKPIClientes |
| 15958 | funcion | abrirModalEvento |
| 15962 | funcion | guardarEvento |
| 15996 | funcion | navegarSemana |
| 16036 | funcion | abrirGeneradorLicencia |
| 16039 | funcion | cerrarGeneradorLicencia |
| 16055 | funcion | irADescargarActualizacion |
| 16065 | funcion | instalarActualizacionAhora |
| 17025 | funcion | alternarAyudante |
| 17040 | funcion | actualizarBotonAyudante |
| 17049 | funcion | hablarAyudante |
| 17081 | funcion | programarCierreAyudante |
| 17087 | funcion | ocultarAyudante |
| 17174 | funcion | coincideFrase |
| 17420 | funcion | emocionJP |
| 17431 | funcion | autodestruccionJP |
| 17452 | funcion | responderComando |
| 17481 | funcion | sorprendemeJP |
| 17512 | funcion | revisarNegocio |
| 17581 | funcion | vigilarNegocio |
| 17608 | funcion | iniciarVigilancia |
| 17628 | funcion | sinDatosJP |
| 17637 | funcion | jpVentasDeHoy |
| 17662 | funcion | jpMejorCliente |
| 17687 | funcion | jpModelosMasReparados |
| 17710 | funcion | jpComisionTecnico |
| 17734 | funcion | jpPorCobrar |
| 17758 | funcion | revisarOrdenEnCurso |
| 17829 | funcion | programarRevisionOrden |
| 17840 | funcion | cargarVozJP |
| 17857 | funcion | textoParaVoz |
| 17869 | funcion | hablarEnVozAlta |
| 17883 | funcion | alternarVozJP |
| 17899 | funcion | actualizarBotonVoz |
| 17914 | funcion | posicionGuardadaJP |
| 17926 | funcion | aplicarPosicionGuardadaJP |
| 17938 | funcion | iniciarArrastreJP |
| 18011 | funcion | celebrarOrdenGuardada |
| 18046 | funcion | revisarHitosDelDia |
| 18094 | funcion | jpDameAnimo |
| 18138 | funcion | modoFiestaJP |
| 18153 | funcion | lanzarConfeti |
| 18171 | funcion | jpComoVoyHoy |
| 18197 | funcion | jpAdivinaNumero |
| 18208 | funcion | jpCaraOSello |
| 18265 | funcion | iniciarTutorial |
| 18277 | funcion | mostrarPasoTutorial |
| 18306 | funcion | pasoTutorial |
| 18315 | funcion | terminarTutorial |
| 18330 | funcion | menuTutoriales |
| 18342 | funcion | consejoHtml |
| 18348 | funcion | normalizar |
| 18354 | funcion | buscarTema |
| 18385 | funcion | elementoObjetivo |
| 18394 | funcion | resaltarElemento |
| 18407 | funcion | quitarResaltado |
| 18412 | funcion | posarEnElemento |
| 18458 | funcion | volverASuCasa |
| 18470 | funcion | explicarTema |
| 18481 | funcion | explicarTemaPorId |
| 18486 | funcion | preguntarAlAyudante |
| 18514 | funcion | listaTemasHtml |
| 18519 | funcion | mostrarIndiceAyudante |
| 18527 | funcion | numDe |
| 18535 | funcion | explicarMetricas |


## index.html — funcion (arrow)

| Línea | Tipo | Nombre / Texto |
|---|---|---|
| 6091 | funcion (arrow) | setVis |
| 6531 | funcion (arrow) | setChk |
| 7086 | funcion (arrow) | setNum |
| 9521 | funcion (arrow) | chk |
| 10750 | funcion (arrow) | ok |
| 10789 | funcion (arrow) | mover |
| 10797 | funcion (arrow) | iniciar |
| 10798 | funcion (arrow) | soltar |
| 11016 | funcion (arrow) | alListo |
| 11568 | funcion (arrow) | renderLado |
| 12036 | funcion (arrow) | set |
| 14065 | funcion (arrow) | aItem |
| 17843 | funcion (arrow) | elegir |
| 18627 | funcion (arrow) | ocupado |
| 18628 | funcion (arrow) | libre |


## index.html — ipc (renderer)

| Línea | Tipo | Nombre / Texto |
|---|---|---|
| 2480 | ipc (renderer) | abrir-carpeta |
| 2499 | ipc (renderer) | abrir-carpeta |
| 3188 | ipc (renderer) | abrir-carpeta-plantillas |
| 5203 | ipc (renderer) | abrir-carpeta-grabaciones |
| 5822 | ipc (renderer) | iniciar-sesion-token |
| 5844 | ipc (renderer) | login-respuesta |
| 5847 | ipc (renderer) | iniciar-sesion |
| 5864 | ipc (renderer) | login-respuesta |
| 5933 | ipc (renderer) | resultado-2fa |
| 6019 | ipc (renderer) | pedir-datos-empresa |
| 6134 | ipc (renderer) | obtener-modelos-pendientes |
| 6136 | ipc (renderer) | obtener-panel-licencias |
| 6143 | ipc (renderer) | obtener-clientes |
| 6148 | ipc (renderer) | analisis-crm |
| 6150 | ipc (renderer) | obtener-tecnicos |
| 6152 | ipc (renderer) | obtener-tecnicos |
| 6153 | ipc (renderer) | obtener-ordenes |
| 6154 | ipc (renderer) | listar-pedidos-accesorios-pendientes |
| 6157 | ipc (renderer) | obtener-productos |
| 6158 | ipc (renderer) | obtener-subcategorias-custom |
| 6159 | ipc (renderer) | obtener-grupos-compatibilidad |
| 6162 | ipc (renderer) | obtener-productos |
| 6167 | ipc (renderer) | obtener-grupos-compatibilidad |
| 6170 | ipc (renderer) | obtener-productos |
| 6171 | ipc (renderer) | obtener-devoluciones |
| 6176 | ipc (renderer) | obtener-facturas |
| 6182 | ipc (renderer) | obtener-usuarios |
| 6183 | ipc (renderer) | obtener-tiendas |
| 6187 | ipc (renderer) | pedir-datos-empresa |
| 6198 | ipc (renderer) | lista-de-facturas |
| 6234 | ipc (renderer) | buscar-facturas-devolucion |
| 6238 | ipc (renderer) | resultado-busqueda-facturas-devolucion |
| 6451 | ipc (renderer) | registrar-devolucion |
| 6454 | ipc (renderer) | devolucion-registrada |
| 6462 | ipc (renderer) | obtener-devoluciones |
| 6463 | ipc (renderer) | obtener-productos |
| 6472 | ipc (renderer) | obtener-devoluciones |
| 6481 | ipc (renderer) | lista-devoluciones |
| 6511 | ipc (renderer) | datos-empresa-respuesta |
| 6599 | ipc (renderer) | buscar-clientes |
| 6601 | ipc (renderer) | clientes-sugeridos |
| 6614 | ipc (renderer) | sugerir-stock-modelo |
| 6621 | ipc (renderer) | stock-sugerido-modelo |
| 6713 | ipc (renderer) | guardar-orden |
| 6715 | ipc (renderer) | guardar-orden |
| 6804 | ipc (renderer) | subir-foto-producto |
| 6832 | ipc (renderer) | nuevo-producto-sql |
| 6848 | ipc (renderer) | crear-usuario-nuevo |
| 6864 | ipc (renderer) | actualizar-cliente |
| 6866 | ipc (renderer) | guardar-cliente |
| 6870 | ipc (renderer) | resultado-cliente |
| 6874 | ipc (renderer) | obtener-clientes |
| 6878 | ipc (renderer) | cliente-actualizado |
| 6882 | ipc (renderer) | obtener-clientes |
| 6886 | ipc (renderer) | resultado-guardado |
| 6944 | ipc (renderer) | producto-guardado |
| 6952 | ipc (renderer) | eliminar-producto |
| 6955 | ipc (renderer) | producto-eliminado |
| 6958 | ipc (renderer) | obtener-productos |
| 6964 | ipc (renderer) | resultado-usuario |
| 6965 | ipc (renderer) | obtener-usuarios |
| 6972 | ipc (renderer) | lista-de-ordenes |
| 7204 | ipc (renderer) | obtener-accesorios-orden |
| 7207 | ipc (renderer) | accesorios-de-la-orden |
| 7221 | ipc (renderer) | asignar-tecnico-orden |
| 7224 | ipc (renderer) | lista-de-productos |
| 7360 | ipc (renderer) | registrar-venta-desktop |
| 7438 | ipc (renderer) | imprimir-documento |
| 7458 | ipc (renderer) | imprimir-documento |
| 7462 | ipc (renderer) | venta-desktop-resultado |
| 7470 | ipc (renderer) | obtener-productos |
| 7492 | ipc (renderer) | subcategorias-custom-lista |
| 7505 | ipc (renderer) | obtener-datos-reporte |
| 7541 | ipc (renderer) | datos-reporte |
| 7679 | ipc (renderer) | registrar-gasto |
| 7687 | ipc (renderer) | gasto-registrado |
| 7691 | ipc (renderer) | obtener-datos-reporte |
| 7698 | ipc (renderer) | eliminar-gasto |
| 7701 | ipc (renderer) | gasto-eliminado |
| 7704 | ipc (renderer) | obtener-datos-reporte |
| 7716 | ipc (renderer) | exportar-reporte-excel |
| 7719 | ipc (renderer) | reporte-excel-generado |
| 7740 | ipc (renderer) | exportar-inventario-excel |
| 7743 | ipc (renderer) | exportar-inventario-excel-res |
| 7757 | ipc (renderer) | obtener-cierre-dia |
| 7762 | ipc (renderer) | obtener-cierre-dia |
| 7766 | ipc (renderer) | cierre-dia-datos |
| 7945 | ipc (renderer) | obtener-top-ventas |
| 7989 | ipc (renderer) | top-ventas-data |
| 8020 | ipc (renderer) | ia-recepcion |
| 8024 | ipc (renderer) | respuesta-ia-recepcion |
| 8042 | ipc (renderer) | datos-crm |
| 8058 | ipc (renderer) | lista-de-clientes |
| 8100 | ipc (renderer) | lista-de-tecnicos |
| 8125 | ipc (renderer) | tecnico-asignado |
| 8128 | ipc (renderer) | obtener-ordenes |
| 8149 | ipc (renderer) | crear-tienda |
| 8152 | ipc (renderer) | tienda-creada |
| 8156 | ipc (renderer) | obtener-tiendas |
| 8162 | ipc (renderer) | lista-de-tiendas |
| 8169 | ipc (renderer) | asignar-tienda-usuario |
| 8172 | ipc (renderer) | tienda-asignada |
| 8173 | ipc (renderer) | obtener-usuarios |
| 8206 | ipc (renderer) | lista-de-usuarios |
| 8211 | ipc (renderer) | cambiar-estado-usuario |
| 8213 | ipc (renderer) | resultado-cambio-estado |
| 8219 | ipc (renderer) | actualizar-estado-orden |
| 8236 | ipc (renderer) | orden-actualizada |
| 8238 | ipc (renderer) | obtener-ordenes |
| 8286 | ipc (renderer) | resolver-pedido-accesorio |
| 8289 | ipc (renderer) | pedidos-accesorios-pendientes |
| 8291 | ipc (renderer) | resultado-pedido-accesorio |
| 8294 | ipc (renderer) | obtener-ordenes |
| 8298 | ipc (renderer) | listar-pedidos-accesorios-pendientes |
| 8302 | ipc (renderer) | listar-pedidos-accesorios-pendientes |
| 8629 | ipc (renderer) | obtener-estado-plan |
| 8632 | ipc (renderer) | estado-plan-respuesta |
| 8662 | ipc (renderer) | guardar-datos-empresa |
| 8665 | ipc (renderer) | resultado-datos-empresa |
| 8693 | ipc (renderer) | registrar-nuevo-cliente-saas |
| 8701 | ipc (renderer) | registro-saas-respuesta |
| 8716 | ipc (renderer) | crear-codigo-automatico |
| 8718 | ipc (renderer) | crear-codigo-automatico |
| 8722 | ipc (renderer) | codigo-creado-exito |
| 8863 | ipc (renderer) | emitir-factura-saas |
| 9107 | ipc (renderer) | factura-emitida-error |
| 9239 | ipc (renderer) | factura-emitida-exito |
| 9312 | ipc (renderer) | imprimir-documento |
| 9467 | ipc (renderer) | imprimir-documento |
| 9577 | ipc (renderer) | guardar-datos-empresa |
| 9582 | ipc (renderer) | imprimir-documento |
| 9590 | ipc (renderer) | documento-impreso |
| 9647 | ipc (renderer) | buscar-stock-tecnico |
| 9650 | ipc (renderer) | resultados-stock-tecnico |
| 9692 | ipc (renderer) | usar-repuesto-lab |
| 9702 | ipc (renderer) | repuesto-usado-lab |
| 9863 | ipc (renderer) | registrar-repuesto-externo |
| 9874 | ipc (renderer) | repuesto-externo-registrado |
| 9910 | ipc (renderer) | agregar-cobro-adicional |
| 9913 | ipc (renderer) | cobro-adicional-agregado |
| 9920 | ipc (renderer) | obtener-ordenes |
| 9929 | ipc (renderer) | obtener-compras-externas-dia |
| 9932 | ipc (renderer) | compras-externas-dia |
| 9988 | ipc (renderer) | buscar-orden-id |
| 9993 | ipc (renderer) | respuesta-orden-id |
| 10409 | ipc (renderer) | borrar-pieza-modelo |
| 10439 | ipc (renderer) | renombrar-pieza-modelo |
| 10909 | ipc (renderer) | guardar-foto-pieza-cache |
| 10910 | ipc (renderer) | subir-foto-pieza |
| 11058 | ipc (renderer) | leer-fotos-pieza-cache-modelo |
| 11065 | ipc (renderer) | buscar-fotos-modelo |
| 11076 | ipc (renderer) | guardar-foto-pieza-cache |
| 11172 | ipc (renderer) | sugerencias-nombres-pieza |
| 11403 | ipc (renderer) | guardar-foto-pieza-cache |
| 11419 | ipc (renderer) | subir-foto-pieza |
| 11444 | ipc (renderer) | estadisticas-fallas-modelo |
| 11463 | ipc (renderer) | historial-modelo-taller |
| 11483 | ipc (renderer) | listar-modelos-con-fotos |
| 11534 | ipc (renderer) | buscar-piezas-similares |
| 11555 | ipc (renderer) | reportar-pieza-modelo |
| 11556 | ipc (renderer) | reportar-pieza-modelo |
| 11571 | ipc (renderer) | buscar-fotos-modelo |
| 11588 | ipc (renderer) | buscar-fotos-modelo |
| 11612 | ipc (renderer) | imprimir-documento |
| 11615 | ipc (renderer) | documento-impreso |
| 11675 | ipc (renderer) | transcribir-audio-pieza |
| 11730 | ipc (renderer) | actualizar-bitacora-estado |
| 11757 | ipc (renderer) | abrir-ambicion |
| 11763 | ipc (renderer) | ambicion-bloqueado |
| 12007 | ipc (renderer) | listar-fuentes-pantalla |
| 12096 | ipc (renderer) | elegir-fuente-pantalla |
| 12290 | ipc (renderer) | guardar-grabacion |
| 12344 | ipc (renderer) | actualizar-modo-transmision |
| 12371 | ipc (renderer) | actualizar-modo-transmision |
| 12458 | ipc (renderer) | ambicion-resultado |
| 12474 | ipc (renderer) | abrir-log-ambicion |
| 12484 | ipc (renderer) | bitacora-actualizada |
| 12488 | ipc (renderer) | obtener-ordenes |
| 12799 | ipc (renderer) | guardar-mi-perfil |
| 12807 | ipc (renderer) | perfil-guardado-exito |
| 12830 | ipc (renderer) | analizar-documento-ia |
| 12978 | ipc (renderer) | respuesta-analisis-ia |
| 13010 | ipc (renderer) | nuevo-producto-sql |
| 13015 | ipc (renderer) | obtener-productos |
| 13145 | ipc (renderer) | preview-excel-inventario |
| 13328 | ipc (renderer) | preview-excel-resultado |
| 13381 | ipc (renderer) | importar-excel-inventario |
| 13384 | ipc (renderer) | resultado-importacion-excel |
| 13391 | ipc (renderer) | obtener-productos |
| 13408 | ipc (renderer) | ia-laboratorio |
| 13411 | ipc (renderer) | respuesta-ia-laboratorio |
| 13430 | ipc (renderer) | busqueda-global |
| 13453 | ipc (renderer) | resultados-busqueda-global |
| 13519 | ipc (renderer) | cerrar-sesion-token |
| 13545 | ipc (renderer) | generar-resumen-financiero |
| 13548 | ipc (renderer) | respuesta-resumen-financiero |
| 13569 | ipc (renderer) | marcar-asistencia-manual |
| 13576 | ipc (renderer) | registrar-salida-manual |
| 13585 | ipc (renderer) | asistencia-respuesta |
| 13601 | ipc (renderer) | salida-respuesta |
| 13617 | ipc (renderer) | salida-respuesta |
| 13833 | ipc (renderer) | verificar-2fa |
| 13838 | ipc (renderer) | marcas-modelos-respuesta |
| 13875 | ipc (renderer) | modelos-almacen-respuesta |
| 13924 | ipc (renderer) | obtener-modelos-almacen |
| 14004 | ipc (renderer) | obtener-marcas-modelos |
| 14142 | ipc (renderer) | agregar-modelo-nuevo |
| 14148 | ipc (renderer) | proponer-modelo |
| 14247 | ipc (renderer) | agregar-subcategoria-custom |
| 14314 | ipc (renderer) | lista-grupos-compatibilidad |
| 14319 | ipc (renderer) | grupo-compatibilidad-guardado |
| 14335 | ipc (renderer) | obtener-grupos-compatibilidad |
| 14336 | ipc (renderer) | obtener-productos |
| 14348 | ipc (renderer) | obtener-grupos-compatibilidad |
| 14349 | ipc (renderer) | obtener-productos |
| 14359 | ipc (renderer) | grupo-compatibilidad-eliminado |
| 14362 | ipc (renderer) | obtener-grupos-compatibilidad |
| 14363 | ipc (renderer) | obtener-productos |
| 14369 | ipc (renderer) | producto-vinculado-a-grupo |
| 14372 | ipc (renderer) | obtener-grupos-compatibilidad |
| 14373 | ipc (renderer) | obtener-productos |
| 14530 | ipc (renderer) | actualizar-grupo-compatibilidad |
| 14532 | ipc (renderer) | crear-grupo-compatibilidad |
| 14634 | ipc (renderer) | analizar-compatibilidad-archivo |
| 14637 | ipc (renderer) | respuesta-analisis-compatibilidad |
| 14763 | ipc (renderer) | crear-grupo-compatibilidad |
| 14778 | ipc (renderer) | eliminar-grupo-compatibilidad |
| 15155 | ipc (renderer) | obtener-historial-producto |
| 15271 | ipc (renderer) | subir-foto-producto |
| 15290 | ipc (renderer) | actualizar-producto-detalle |
| 15342 | ipc (renderer) | ajustar-stock-manual |
| 15412 | ipc (renderer) | obtener-proveedores-db |
| 15416 | ipc (renderer) | proveedores-db-respuesta |
| 15489 | ipc (renderer) | guardar-proveedor-db |
| 15512 | ipc (renderer) | eliminar-proveedor-db |
| 15520 | ipc (renderer) | modelo-propuesto |
| 15535 | ipc (renderer) | obtener-panel-licencias |
| 15543 | ipc (renderer) | panel-licencias-respuesta |
| 15601 | ipc (renderer) | actualizar-licencia |
| 15610 | ipc (renderer) | actualizar-licencia |
| 15614 | ipc (renderer) | borrar-codigo-licencia |
| 15617 | ipc (renderer) | licencia-actualizada |
| 15633 | ipc (renderer) | obtener-modelos-pendientes |
| 15636 | ipc (renderer) | modelos-pendientes-respuesta |
| 15695 | ipc (renderer) | resolver-modelo |
| 15698 | ipc (renderer) | modelo-resuelto |
| 15708 | ipc (renderer) | obtener-resellers-admin |
| 15712 | ipc (renderer) | resellers-admin-respuesta |
| 15745 | ipc (renderer) | guardar-reseller-respuesta |
| 15755 | ipc (renderer) | eliminar-reseller-respuesta |
| 15807 | ipc (renderer) | guardar-reseller-admin |
| 15812 | ipc (renderer) | eliminar-reseller-admin |
| 16045 | ipc (renderer) | pedir-version |
| 16048 | ipc (renderer) | recibir-version |
| 16056 | ipc (renderer) | abrir-pagina-descarga |
| 16066 | ipc (renderer) | instalar-actualizacion-ahora |
| 16069 | ipc (renderer) | actualizacion-disponible |
| 16078 | ipc (renderer) | actualizacion-lista |
| 16088 | ipc (renderer) | actualizacion-no-disponible |


# main.js


## main.js — seccion

| Línea | Tipo | Nombre / Texto |
|---|---|---|
| 29 | seccion | SESIÓN DE SUPABASE AUTH (paso previo a sacar la service_role del instalador) |
| 96 | seccion | CANDADO DE LANZAMIENTO DE AMBICION |
| 181 | seccion | CAPTURA DE PANTALLA PARA GRABAR REPARACIONES |
| 251 | seccion | CREAR CARPETAS FIRMWARE Y DUMP AL INICIAR (en userData: sobreviven actualizaciones) |
| 268 | seccion | ABRIR CARPETAS FIRMWARE / DUMP |
| 277 | seccion | GRABACIÓN DE REPARACIONES (pestaña Laboratorio) |
| 371 | seccion | TRANSMISION EN VIVO: marcar/desmarcar una orden como "En Vivo" |
| 394 | seccion | ABRIR CARPETA DE PLANTILLAS DE INVENTARIO (Excel para carga masiva) |
| 401 | seccion | OBTENER MARCAS Y MODELOS DE DISPOSITIVOS |
| 406 | seccion | AGREGAR MODELO NUEVO AL CATÁLOGO (cuando no existe uno que el usuario necesita) |
| 422 | seccion | 2. LOGIN INTELIGENTE (FILTRA POR EMPRESA Y FECHA) |
| 485 | seccion | 2.0B LOGIN AUTOMATICO CON TOKEN DE SESION RECORDADA |
| 538 | seccion | 2.0C CERRAR SESIÓN RECORDADA (invalida el token guardado) |
| 561 | seccion | 2.1 VERIFICACIÓN DE 2FA (SEGUNDO PASO DE ACCESO) |
| 658 | seccion | 3. CLIENTES (SOLO DE MI EMPRESA) |
| 775 | seccion | MI CATÁLOGO DE MODELOS: marcas y modelos deducidos del propio almacén |
| 870 | seccion | PORTERO 1: la forma del nombre |
| 903 | seccion | PORTERO 2: la IA |
| 1207 | seccion | COLA DE APROBACIÓN (solo la casa matriz) |
| 1260 | seccion | PROVEEDORES (PERSISTENCIA SEGURA EN SUPABASE + CONTROL DE FALLOS) |
| 1299 | seccion | SUBIR FOTO PRODUCTO |
| 1331 | seccion | HOLOGRAMA 3D: fotos reales de piezas por modelo de celular |
| 1758 | seccion | 4. INVENTARIO (SOLO DE MI EMPRESA) |
| 1821 | seccion | 4D. GRUPOS DE COMPATIBILIDAD DE MODELOS (micas/pantallas que comparten pieza y stock) |
| 2011 | seccion | 4A. SUBCATEGORÍAS PERSONALIZADAS (editables por el usuario, ej. tipos de Micas) |
| 2041 | seccion | 4B. IMPORTACIÓN DESDE EXCEL - PREVIEW |
| 2054 | seccion | TERCERA VÍA DE MATCHING: por grupo de compatibilidad |
| 2075 | seccion | LOGICA DE SUBCATEGORIAS PARA EXCEL |
| 2197 | seccion | 4C. IMPORTACIÓN DESDE EXCEL - EJECUTAR UPSERT ADITIVO |
| 2408 | seccion | 4D. HISTORIAL DE PRODUCTO |
| 2467 | seccion | 5. ORDENES/TALLER (SOLO DE MI EMPRESA) |
| 2529 | seccion | 6. REPORTES (SUMA SOLO EL DINERO DE MI EMPRESA) |
| 2698 | seccion | 6b. GASTOS OPERATIVOS (alquiler, sueldos, luz, etc. — migración 008) |
| 2732 | seccion | 6b-bis. DATOS PARA EXPORTAR EL REPORTE A EXCEL (formato de la plantilla del dueño) |
| 2849 | seccion | EXPORTAR INVENTARIO ACTUAL DE PRODUCTOS A EXCEL (.XLSX) |
| 3092 | seccion | 6b-ter. MÁS VENDIDOS por categoría (ventas del POS del período elegido) |
| 3194 | seccion | 6c. CIERRE DEL DÍA UNIFICADO (FASE 6 del plan finanzas — el "libro de caja") |
| 3392 | seccion | 6d. TIENDAS (sucursales) — asignación de personal por tienda |
| 3433 | seccion | 7. GESTIÓN DE USUARIOS (SOLO DE MI EMPRESA) |
| 3491 | seccion | 7.1 CAMBIAR ESTADO DE USUARIO (Activar/Desactivar) |
| 3517 | seccion | 8. ESTADO DEL PLAN (Para el Dashboard de Licencias) |
| 3555 | seccion | 9. CONFIGURACIÓN DE EMPRESA |
| 3600 | seccion | 10. GENERADOR AUTOMÁTICO DE LICENCIAS (SÓLO ADMIN) |
| 3634 | seccion | 10B. PANEL DE LICENCIAS (solo casa matriz) |
| 3678 | seccion | 11. REGISTRO SAAS CON VALIDACIÓN DE LICENCIA Y FECHA |
| 3705 | seccion | 12. MÓDULO DE FACTURACIÓN AUTOMÁTICA |
| 3780 | seccion | 13. ACTUALIZAR PERFIL DE USUARIO |
| 3802 | seccion | 14. MÓDULOS DE IA (Gemini y OpenAI) |
| 3853 | seccion | 14B. IMPORTAR GRUPOS DE COMPATIBILIDAD DESDE PDF O IMAGEN (Fase 5) |
| 4055 | seccion | 15. BÚSQUEDAS |
| 4207 | seccion | VENTA RÁPIDA DE ESCRITORIO (POS para cualquier rol) |
| 4373 | seccion | REPUESTO EXTERNO (traído de otro proveedor porque no había en stock) |
| 4448 | seccion | COBRO ADICIONAL: otra falla / trabajo extra hallado durante la reparación |
| 4518 | seccion | IMPRESIÓN DE COMPROBANTES |
| 4587 | seccion | 16. MÓDULO DE ASISTENCIA MANUAL |
| 4609 | seccion | HANDLER: Cargar historial de facturas |
| 4619 | seccion | MÓDULO DE DEVOLUCIONES (cliente devuelve un producto vendido) |
| 4762 | seccion | HANDLER: Análisis CRM (clientes inactivos) |
| 4775 | seccion | HANDLER: Buscar orden por ID (para el Laboratorio) |
| 4786 | seccion | HANDLER: Guardar bitácora y cambiar estado |
| 4820 | seccion | HANDLER: Accesorios ya agregados a una orden (para el Detalle de la orden) |
| 4833 | seccion | HANDLER: Cambiar estado de una orden |
| 4859 | seccion | PEDIDOS DE ACCESORIOS (creados por el cliente desde el tracking web) |
| 4936 | seccion | HANDLER: Listar usuarios |
| 4946 | seccion | HANDLER: Gestión de Resellers (Global, solo super admin) |
| 5021 | seccion | CIERRE |


## main.js — ipc (main)

| Línea | Tipo | Nombre / Texto |
|---|---|---|
| 229 | ipc (main) | pedir-version |
| 237 | ipc (main) | abrir-pagina-descarga |
| 247 | ipc (main) | instalar-actualizacion-ahora |
| 269 | ipc (main) | abrir-carpeta |
| 289 | ipc (main) | listar-fuentes-pantalla |
| 309 | ipc (main) | elegir-fuente-pantalla |
| 312 | ipc (main) | guardar-grabacion |
| 376 | ipc (main) | actualizar-modo-transmision |
| 390 | ipc (main) | abrir-carpeta-grabaciones |
| 395 | ipc (main) | abrir-carpeta-plantillas |
| 402 | ipc (main) | obtener-marcas-modelos |
| 407 | ipc (main) | agregar-modelo-nuevo |
| 423 | ipc (main) | iniciar-sesion |
| 486 | ipc (main) | iniciar-sesion-token |
| 539 | ipc (main) | cerrar-sesion-token |
| 562 | ipc (main) | verificar-2fa |
| 659 | ipc (main) | guardar-cliente |
| 673 | ipc (main) | actualizar-cliente |
| 709 | ipc (main) | obtener-clientes |
| 724 | ipc (main) | buscar-clientes |
| 752 | ipc (main) | sugerir-stock-modelo |
| 1096 | ipc (main) | obtener-modelos-almacen |
| 1130 | ipc (main) | proponer-modelo |
| 1214 | ipc (main) | obtener-modelos-pendientes |
| 1240 | ipc (main) | resolver-modelo |
| 1261 | ipc (main) | guardar-proveedor-db |
| 1277 | ipc (main) | obtener-proveedores-db |
| 1291 | ipc (main) | eliminar-proveedor-db |
| 1300 | ipc (main) | subir-foto-producto |
| 1359 | ipc (main) | subir-foto-pieza |
| 1424 | ipc (main) | reportar-pieza-modelo |
| 1457 | ipc (main) | estadisticas-fallas-modelo |
| 1492 | ipc (main) | historial-modelo-taller |
| 1512 | ipc (main) | renombrar-pieza-modelo |
| 1533 | ipc (main) | borrar-pieza-modelo |
| 1565 | ipc (main) | sugerencias-nombres-pieza |
| 1589 | ipc (main) | transcribir-audio-pieza |
| 1631 | ipc (main) | guardar-foto-pieza-cache |
| 1651 | ipc (main) | leer-fotos-pieza-cache-modelo |
| 1678 | ipc (main) | buscar-fotos-modelo |
| 1709 | ipc (main) | buscar-piezas-similares |
| 1732 | ipc (main) | listar-modelos-con-fotos |
| 1759 | ipc (main) | nuevo-producto-sql |
| 1791 | ipc (main) | obtener-productos |
| 1804 | ipc (main) | eliminar-producto |
| 1824 | ipc (main) | obtener-grupos-compatibilidad |
| 1865 | ipc (main) | crear-grupo-compatibilidad |
| 1926 | ipc (main) | actualizar-grupo-compatibilidad |
| 1973 | ipc (main) | eliminar-grupo-compatibilidad |
| 1989 | ipc (main) | vincular-producto-a-grupo |
| 2012 | ipc (main) | obtener-subcategorias-custom |
| 2029 | ipc (main) | agregar-subcategoria-custom |
| 2042 | ipc (main) | preview-excel-inventario |
| 2198 | ipc (main) | importar-excel-inventario |
| 2409 | ipc (main) | obtener-historial-producto |
| 2421 | ipc (main) | actualizar-producto-detalle |
| 2437 | ipc (main) | ajustar-stock-manual |
| 2468 | ipc (main) | guardar-orden |
| 2491 | ipc (main) | obtener-ordenes |
| 2505 | ipc (main) | obtener-tecnicos |
| 2515 | ipc (main) | asignar-tecnico-orden |
| 2537 | ipc (main) | obtener-datos-reporte |
| 2699 | ipc (main) | registrar-gasto |
| 2718 | ipc (main) | eliminar-gasto |
| 2819 | ipc (main) | obtener-datos-export |
| 2830 | ipc (main) | exportar-reporte-excel |
| 2851 | ipc (main) | exportar-inventario-excel |
| 3093 | ipc (main) | obtener-top-ventas |
| 3198 | ipc (main) | obtener-cierre-dia |
| 3393 | ipc (main) | obtener-tiendas |
| 3405 | ipc (main) | crear-tienda |
| 3419 | ipc (main) | asignar-tienda-usuario |
| 3434 | ipc (main) | crear-usuario-nuevo |
| 3492 | ipc (main) | cambiar-estado-usuario |
| 3518 | ipc (main) | obtener-estado-plan |
| 3556 | ipc (main) | guardar-datos-empresa |
| 3581 | ipc (main) | pedir-datos-empresa |
| 3601 | ipc (main) | crear-codigo-automatico |
| 3638 | ipc (main) | obtener-panel-licencias |
| 3649 | ipc (main) | actualizar-licencia |
| 3666 | ipc (main) | borrar-codigo-licencia |
| 3679 | ipc (main) | registrar-nuevo-cliente-saas |
| 3706 | ipc (main) | emitir-factura-saas |
| 3781 | ipc (main) | guardar-mi-perfil |
| 3803 | ipc (main) | analizar-documento-ia |
| 3863 | ipc (main) | analizar-compatibilidad-archivo |
| 3906 | ipc (main) | ia-recepcion |
| 3949 | ipc (main) | ia-laboratorio |
| 3993 | ipc (main) | generar-resumen-financiero |
| 4056 | ipc (main) | buscar-stock-tecnico |
| 4087 | ipc (main) | abrir-ambicion |
| 4199 | ipc (main) | abrir-log-ambicion |
| 4211 | ipc (main) | registrar-venta-desktop |
| 4287 | ipc (main) | usar-repuesto-lab |
| 4376 | ipc (main) | registrar-repuesto-externo |
| 4452 | ipc (main) | agregar-cobro-adicional |
| 4496 | ipc (main) | obtener-compras-externas-dia |
| 4522 | ipc (main) | imprimir-documento |
| 4572 | ipc (main) | busqueda-global |
| 4588 | ipc (main) | marcar-asistencia-manual |
| 4610 | ipc (main) | obtener-facturas |
| 4624 | ipc (main) | buscar-facturas-devolucion |
| 4646 | ipc (main) | registrar-devolucion |
| 4743 | ipc (main) | obtener-devoluciones |
| 4763 | ipc (main) | analisis-crm |
| 4776 | ipc (main) | buscar-orden-id |
| 4787 | ipc (main) | actualizar-bitacora-estado |
| 4821 | ipc (main) | obtener-accesorios-orden |
| 4834 | ipc (main) | actualizar-estado-orden |
| 4862 | ipc (main) | listar-pedidos-accesorios-pendientes |
| 4873 | ipc (main) | resolver-pedido-accesorio |
| 4937 | ipc (main) | obtener-usuarios |
| 4947 | ipc (main) | obtener-resellers-admin |
| 4962 | ipc (main) | guardar-reseller-admin |
| 5004 | ipc (main) | eliminar-reseller-admin |
| 5025 | ipc (main) | registrar-salida-manual |


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
| 166 | funcion | createWindow |
| 282 | funcion | carpetaGrabaciones |
| 888 | funcion | validarFormatoModelo |
| 912 | funcion | distanciaEdicion |
| 931 | funcion | candidatosDelCatalogo |
| 1003 | funcion | verificarModeloConIA |
| 1049 | funcion | stockPorModeloDeEmpresa |
| 1073 | funcion | sincronizarUsoModelos |
| 1614 | funcion | holoCacheDir |
| 1619 | funcion | holoManifestPath |
| 1622 | funcion | holoLeerManifest |
| 1625 | funcion | holoGuardarManifest |
| 2735 | funcion | recolectarDatosExport |
| 2872 | funcion | agregarHojaInventario |
| 2972 | funcion | construirExcelReporte |
| 4073 | funcion | copiarCarpetaRecursivo |
| 5041 | funcion | registrarFeed |

