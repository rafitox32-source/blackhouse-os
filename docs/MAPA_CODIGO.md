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
| 2153 | comentario | Interruptor del ayudante animado (siempre visible para cualquiera) |
| 2165 | comentario | BARRA SUPERIOR (Corregida con todos sus cierres) |
| 2407 | comentario | HOLOGRAMA 3D: Diagnóstico visual del equipo |
| 2424 | comentario | Estadísticas comunitarias: qué se marcó dañado más seguido en este modelo |
| 2429 | comentario | Piezas de ESTA sesión: se van agregando a medida que fotografías/grabas cada una |
| 2537 | comentario | Modal: Ruta de Diagnóstico de Encendido (antes vivía fija en Laboratorio, ahora en modal para dejar el espacio al Holograma) |
| 2547 | comentario | Progress Bar |
| 2552 | comentario | Pasos |
| 2600 | comentario | Resumen / Fin |
| 2614 | comentario | Modal: VUELTA 360° de una pieza (Opción A del holograma) |
| 2624 | comentario | Instrucciones paso a paso (plegadas por defecto) |
| 2653 | comentario | Visor / previsualización |
| 2684 | comentario | Modal: Fotografiar pieza para el Holograma 3D |
| 2703 | comentario | Modo guiado: la app va pidiendo cara por cara con instrucciones |
| 2715 | comentario | Modo manual (guiado desactivado): elegir cara suelta |
| 2785 | comentario | Modal: Historial privado de este modelo en TU taller |
| 2797 | comentario | Modal: Buscar piezas en modelos similares (referencia visual) |
| 2817 | comentario | Modal: Abrir un modelo ya guardado en la librería (sin necesitar una orden) |
| 2830 | comentario | Modal: Comparar Antes / Después de una pieza |
| 2850 | comentario | ============ VENTA RÁPIDA (POS de escritorio, para todos los roles) ============ |
| 2891 | comentario | Modal: producto libre (venta sin stock) |
| 2971 | comentario | La mano de obra ya no se escribe: sale de restarle el repuesto al total. |
| 3106 | comentario | Stats Row |
| 3136 | comentario | Search |
| 3147 | comentario | Table |
| 3172 | comentario | Las tarjetas se poblarán dinámicamente |
| 3218 | comentario | Pestañas de Navegación de Inventario |
| 3290 | comentario | ================= NUEVO BLOQUE ================= |
| 3297 | comentario | ================================================= |
| 3303 | comentario | Sugerencias de Accesorios |
| 3323 | comentario | Sugerencias de Repuestos |
| 3343 | comentario | Sugerencias de Micas |
| 3361 | comentario | Selector de Modelo para Pantallas y Micas |
| 3638 | comentario | NUEVA SECCIÓN: MI PERFIL |
| 3643 | comentario | FOTO DE PERFIL |
| 3665 | comentario | DATOS |
| 3784 | comentario | ============ APARIENCIA / TEMA ============ |
| 3793 | comentario | ORIGINAL |
| 3807 | comentario | NEGRO |
| 3821 | comentario | BLANCO |
| 3835 | comentario | DOHA-CELL (marca) |
| 3849 | comentario | PREMIUM |
| 3870 | comentario | ============ TICKET / COMPROBANTE (personalización de impresión) ============ |
| 3879 | comentario | Formulario |
| 3934 | comentario | Vista previa en vivo (80mm) |
| 4010 | comentario | NUEVA SECCIÓN: DISTRIBUIDORES |
| 4029 | comentario | Se poblará dinámicamente |
| 4035 | comentario | PANEL DE LICENCIAS (solo casa matriz) |
| 4082 | comentario | COLA DE REVISIÓN DEL CATÁLOGO COMPARTIDO DE MODELOS |
| 4132 | comentario | Quick Stats |
| 4165 | comentario | Calendar Grid |
| 4197 | comentario | Modal Nuevo Evento (Si no existe) |
| 4263 | comentario | Monitor de Actividad + Caja de Errores: solo casa matriz (empresa 1), ve TODOS los talleres |
| 4342 | comentario | Vacío = alta nueva; con id = se está corrigiendo la ficha de ese cliente. |
| 4392 | comentario | Modal Nuevo Proveedor |
| 4435 | comentario | Modal Nuevo / Editar Reseller |
| 4492 | comentario | Modal Selector de Modelos Premium |
| 4502 | comentario | De dónde salen los modelos: el almacén propio o el catálogo mundial |
| 4525 | comentario | Grid de marcas comunes |
| 4527 | comentario | Se poblará dinámicamente con JS |
| 4536 | comentario | Listado de modelos |
| 4539 | comentario | Se poblará dinámicamente con JS |
| 4550 | comentario | Modal Crear/Editar Grupo de Compatibilidad |
| 4598 | comentario | Modal Importar Grupos de Compatibilidad desde archivo (Fase 5) |
| 4657 | comentario | Modal Escáner de IMEI/código de barras por cámara web (Recepción) |
| 4706 | comentario | Modal Registrar Devolución |
| 4807 | comentario | Modal de Selección de Categoría para Excel |
| 4839 | comentario | Modal de Importación Excel |
| 4900 | comentario | MODAL VISTA TIENDA DEL PRODUCTO |
| 4934 | comentario | MODAL IMPRIMIR ETIQUETA |
| 4958 | comentario | CONTENEDOR PARA IMPRESIÓN (OCULTO EN PANTALLA, VISIBLE EN IMPRESIÓN) |
| 4961 | comentario | MODAL DETALLE DE PRODUCTO (SÓLO LECTURA Y EDICIÓN PARCIAL) |
| 4972 | comentario | Bloque 1: Datos Generales |
| 5035 | comentario | Bloque 2: Costos por proveedor (Condicional) |
| 5058 | comentario | Bloque 3: Precios de venta |
| 5073 | comentario | Bloque 4: Historial de Ingresos |
| 5146 | comentario | Modal: elegir formato del comprobante ya emitido (PDF o Ticket) |
| 5166 | comentario | Modal Diagnóstico Consumo |
| 5204 | comentario | ===== ESTUDIO DE GRABACIÓN DE REPARACIONES ===== |
| 5221 | comentario | Vista previa: lo que se ve aquí es exactamente lo que se graba |
| 5230 | comentario | Escenas |
| 5242 | comentario | Configuración de fuentes y vinculación |
| 5308 | comentario | Controles |
| 5326 | comentario | Modal: Vincular la cámara del celular por WiFi al Estudio de Grabación |
| 5371 | comentario | Modal: Cobro adicional (otra falla / trabajo extra encontrado en la reparación) |
| 5409 | comentario | Modal: Bloqueo del equipo (Patrón / Clave / Contraseña) |
| 5420 | comentario | PATRÓN: 9 puntos para dibujar |
| 5429 | comentario | CLAVE: teclado numérico |
| 5448 | comentario | CONTRASEÑA: escribir |
| 5463 | comentario | Modal: Repuesto externo (traído de otro proveedor) |
| 5501 | comentario | Modal: Reponer stock (agotados y por agotarse, agrupados por categoría) |
| 5516 | comentario | Modal: Más vendidos por categoría (según el período elegido en Métricas) |
| 5534 | comentario | Modal: Detalle de orden (datos de Recepción: foto de evidencia y firma del cliente) |
| 5571 | comentario | Modal: Selector de tema (visible para TODOS los roles desde el botón del sidebar) |
| 5594 | comentario | Modal: Cierre del Día unificado (taller + POS − gastos − compras − devoluciones) |
| 5611 | comentario | Modal: Registrar gasto operativo |
| 5649 | comentario | Modal: Compras externas del día (cierre por proveedor) |
| 5664 | comentario | Cabecera con info del canal activo |
| 5683 | comentario | Pestañas de canales temáticos |
| 5704 | comentario | Área de mensajes |
| 5707 | comentario | Indicador de escritura |
| 5713 | comentario | Input de mensaje |
| 5727 | comentario | MARCA DE AGUA (Solo para Notas de Venta) |
| 5733 | comentario | ENCABEZADO |
| 5766 | comentario | DATOS DEL CLIENTE |
| 5792 | comentario | TABLA DE DETALLES |
| 5822 | comentario | TOTALES Y PIE DE PÁGINA |
| 16588 | comentario | TICKET DE ORDEN (oculto, solo para html2canvas) |
| 16631 | comentario | QR de rastreo individual por orden |
| 16862 | comentario | ================= AYUDANTE ANIMADO (robot con puerta) ================= |
| 16886 | comentario | Marco y hueco de la puerta |
| 16888 | comentario | El robot sube desde dentro del hueco |
| 16890 | comentario | antena |
| 16893 | comentario | cabeza |
| 16896 | comentario | visor |
| 16900 | comentario | boca: recta normal, sonrisa y tristeza (se alternan según la emoción) |
| 16908 | comentario | orejas |
| 16911 | comentario | cuerpo |
| 16915 | comentario | brazo que saluda |
| 16919 | comentario | Hojas de la puerta |


## index.html — modal

| Línea | Tipo | Nombre / Texto |
|---|---|---|
| 2538 | modal | ruta-diagnostico |
| 2615 | modal | holo-giro |
| 2685 | modal | holo-foto |
| 2786 | modal | holo-historial |
| 2798 | modal | holo-similares |
| 2818 | modal | holo-modelos |
| 2831 | modal | holo-comparar |
| 2892 | modal | venta-libre |
| 4198 | modal | evento |
| 4339 | modal | cliente |
| 4344 | modal | cliente-aviso |
| 4368 | modal | usuario |
| 4393 | modal | proveedor |
| 4436 | modal | reseller |
| 4493 | modal | selector-modelos |
| 4551 | modal | grupo-compat |
| 4599 | modal | importar-compat |
| 4658 | modal | scanner-imei |
| 4707 | modal | registrar-devolucion |
| 4780 | modal | confirm-custom |
| 4794 | modal | confirm-ai |
| 4808 | modal | categoria-excel |
| 4840 | modal | excel-import |
| 4901 | modal | ver-tienda-producto |
| 4935 | modal | imprimir-etiqueta |
| 4962 | modal | detalle-producto |
| 5101 | modal | facturacion |
| 5147 | modal | comprobante-listo |
| 5167 | modal | diagnostico-consumo |
| 5207 | modal | grabacion |
| 5327 | modal | camara-celular |
| 5342 | modal | ohm |
| 5372 | modal | cobro-adicional |
| 5410 | modal | bloqueo-equipo |
| 5464 | modal | repuesto-externo |
| 5502 | modal | reponer-stock |
| 5517 | modal | top-ventas |
| 5535 | modal | detalle-orden |
| 5572 | modal | tema |
| 5595 | modal | cierre-dia |
| 5612 | modal | gasto |
| 5650 | modal | compras-dia |
| 16773 | modal | super-admin |


## index.html — funcion

| Línea | Tipo | Nombre / Texto |
|---|---|---|
| 5947 | funcion | showToast |
| 5970 | funcion | iniciarSesion |
| 6140 | funcion | guardarPersonalizacion |
| 6149 | funcion | aplicarPersonalizacion |
| 6176 | funcion | _pintarTema |
| 6187 | funcion | abrirSelectorTema |
| 6191 | funcion | cerrarSelectorTema |
| 6195 | funcion | aplicarTema |
| 6205 | funcion | cargarTemaGuardado |
| 6215 | funcion | aplicarPermisos |
| 6293 | funcion | showView |
| 6358 | funcion | cambiarTabMonitor |
| 6372 | funcion | nombreLegibleCanal |
| 6377 | funcion | cargarMonitorActividad |
| 6407 | funcion | filtrarErrores |
| 6416 | funcion | cargarCajaErrores |
| 6463 | funcion | marcarErrorResuelto |
| 6504 | funcion | buscarFacturasDevolucionDebounced |
| 6535 | funcion | seleccionarFacturaDevolucion |
| 6573 | funcion | cerrarFacturaSeleccionadaDevolucion |
| 6580 | funcion | escaparHtmlDevol |
| 6589 | funcion | intentarMatchProductoPorNombre |
| 6595 | funcion | poblarSelectorProductoDevolucion |
| 6616 | funcion | abrirFormularioDevolucionItem |
| 6639 | funcion | abrirDevolucionSinFactura |
| 6660 | funcion | cerrarModalDevolucion |
| 6664 | funcion | actualizarAvisoCondicionDevolucion |
| 6680 | funcion | toggleMontoDevolucion |
| 6686 | funcion | guardarDevolucion |
| 6747 | funcion | cargarDevoluciones |
| 6762 | funcion | renderizarHistorialDevoluciones |
| 6827 | funcion | showConfigSection |
| 6836 | funcion | calcularTotal |
| 6865 | funcion | buscarClienteRecepcion |
| 6886 | funcion | sugerirStockModelo |
| 6907 | funcion | pintarRepuestosSugeridos |
| 6927 | funcion | elegirRepuestoSugerido |
| 6941 | funcion | costoRepuestoEditado |
| 6953 | funcion | guardarOrden |
| 6982 | funcion | procesarDecision |
| 7003 | funcion | previsualizarFotoProducto |
| 7018 | funcion | comprimirImagen |
| 7056 | funcion | guardarProducto |
| 7117 | funcion | crearUsuario |
| 7127 | funcion | guardarCliente |
| 7226 | funcion | eliminarProducto |
| 7255 | funcion | renderOrdenesTaller |
| 7349 | funcion | actualizarDashboardBento |
| 7405 | funcion | tick |
| 7427 | funcion | verDetalleOrden |
| 7496 | funcion | asignarTecnicoOrden |
| 7510 | funcion | _escV |
| 7514 | funcion | _ventaSinControl |
| 7516 | funcion | renderVentaProductos |
| 7557 | funcion | agregarVentaProducto |
| 7572 | funcion | abrirVentaLibre |
| 7578 | funcion | agregarVentaLibre |
| 7587 | funcion | cambiarCantidadVenta |
| 7596 | funcion | totalVenta |
| 7598 | funcion | renderVentaCarrito |
| 7616 | funcion | vaciarVenta |
| 7620 | funcion | cobrarVenta |
| 7640 | funcion | _finVentaEnCurso |
| 7646 | funcion | generarCotizacion |
| 7720 | funcion | imprimirTicketVenta |
| 7755 | funcion | toggleMenuAgregarInventario |
| 7775 | funcion | cambiarPeriodoReporte |
| 7785 | funcion | animarNumero |
| 7788 | funcion | paso |
| 7796 | funcion | pintarBadge |
| 7808 | funcion | toggleDetalleIngresos |
| 7812 | funcion | irAGastos |
| 7866 | funcion | setTipoGrafica |
| 7872 | funcion | renderChartReporte |
| 7944 | funcion | abrirModalGasto |
| 7952 | funcion | guardarGasto |
| 7973 | funcion | eliminarGasto |
| 7988 | funcion | exportarReporteExcel |
| 8001 | funcion | exportarInventarioExcel |
| 8030 | funcion | abrirCierreDia |
| 8036 | funcion | confirmarCierreDia |
| 8132 | funcion | copiarCierreDia |
| 8172 | funcion | abrirReponerStock |
| 8208 | funcion | copiarListaReposicion |
| 8216 | funcion | abrirTopVentas |
| 8227 | funcion | setTopVentasTab |
| 8234 | funcion | renderTopVentas |
| 8284 | funcion | simularIA |
| 8311 | funcion | generarQR |
| 8354 | funcion | abrirModalCliente |
| 8368 | funcion | cerrarModalCliente |
| 8395 | funcion | nombreTecnico |
| 8414 | funcion | renderTiendasChips |
| 8422 | funcion | crearTienda |
| 8444 | funcion | asignarTiendaUsuario |
| 8453 | funcion | renderTablaUsuarios |
| 8487 | funcion | cambiarEstadoUsuario |
| 8494 | funcion | cambiarEstadoOrden |
| 8518 | funcion | toggleNotifPedidos |
| 8530 | funcion | renderPedidosPendientes |
| 8561 | funcion | resolverPedidoAccesorio |
| 8586 | funcion | getPos |
| 8597 | funcion | limpiarFirma |
| 8601 | funcion | toggleCamara |
| 8619 | funcion | usarCelularParaFoto |
| 8635 | funcion | apagarCamara |
| 8647 | funcion | tomarFoto |
| 8656 | funcion | retomarFoto |
| 8686 | funcion | entrarModoBeta |
| 8736 | funcion | _poblarTallerDemo |
| 8762 | funcion | _poblarClientesDemo |
| 8782 | funcion | _poblarInventarioDemo |
| 8797 | funcion | _poblarCRMDemo |
| 8808 | funcion | _poblarGraficoDemo |
| 8836 | funcion | guardarConfigWA |
| 8843 | funcion | iniciarTutorial |
| 8899 | funcion | cargarEstadoPlan |
| 8916 | funcion | guardarDatosEmpresa |
| 8949 | funcion | mostrarRegistro |
| 8954 | funcion | ocultarRegistro |
| 8959 | funcion | registrarNuevoNegocio |
| 8988 | funcion | generarNuevaLicencia |
| 9017 | funcion | copiarCodigoManual |
| 9048 | funcion | numeroALetras |
| 9063 | funcion | menorDeCien |
| 9071 | funcion | menorDeMil |
| 9081 | funcion | convertir |
| 9106 | funcion | abrirModalFacturacion |
| 9121 | funcion | emitirFactura |
| 9149 | funcion | _finEmisionFactura |
| 9191 | funcion | toggleChat |
| 9197 | funcion | cambiarCanalChat |
| 9212 | funcion | cargarHistorialChatCanal |
| 9234 | funcion | iniciarChatEnVivo |
| 9263 | funcion | recibirMensaje |
| 9323 | funcion | enviarMensajeChat |
| 9350 | funcion | notificarEscritura |
| 9356 | funcion | mostrarEscribiendo |
| 9370 | funcion | notificarChatOrden |
| 9390 | funcion | renderComprobanteDoc |
| 9536 | funcion | verFacturaHistorial |
| 9562 | funcion | _escComp |
| 9568 | funcion | _serializarInvoicePDF |
| 9586 | funcion | descargarComprobantePDF |
| 9600 | funcion | _ticketInner |
| 9663 | funcion | generarGarantiaDesdeComprobante |
| 9687 | funcion | _emitirGarantiaPDF |
| 9748 | funcion | construirTicketHTML |
| 9760 | funcion | _htmlTicket |
| 9765 | funcion | cargarLogoTicket |
| 9780 | funcion | quitarLogoTicket |
| 9785 | funcion | sincronizarLogoDesdeUrl |
| 9796 | funcion | _leerOpcionesTicket |
| 9806 | funcion | renderTicketPreview |
| 9836 | funcion | guardarTicket |
| 9856 | funcion | imprimirComprobanteTicket |
| 9882 | funcion | toggleTimer |
| 9909 | funcion | filtrarStockTecnico |
| 9959 | funcion | usarRepuestoLab |
| 9995 | funcion | avisarMargenNegativo |
| 10009 | funcion | centroPunto |
| 10014 | funcion | construirPuntosPatron |
| 10031 | funcion | tocarPunto |
| 10040 | funcion | dibujarLineasPatron |
| 10051 | funcion | borrarPatron |
| 10058 | funcion | pinTecla |
| 10062 | funcion | pinBorrar |
| 10067 | funcion | cambiarTipoBloqueo |
| 10078 | funcion | abrirBloqueoEquipo |
| 10086 | funcion | guardarBloqueoEquipo |
| 10091 | funcion | guardarBloqueoEquipoActual |
| 10108 | funcion | abrirRepuestoExterno |
| 10127 | funcion | registrarRepuestoExterno |
| 10164 | funcion | abrirCobroAdicional |
| 10174 | funcion | guardarCobroAdicional |
| 10202 | funcion | abrirReporteComprasDia |
| 10253 | funcion | buscarOrdenLab |
| 10317 | funcion | holoRoundedRectShape |
| 10332 | funcion | holoSlabGeometry |
| 10338 | funcion | initHologramaLab |
| 10407 | funcion | holoCrearCajaFoto |
| 10446 | funcion | holoConstruirCelular |
| 10574 | funcion | holoSlotAutomatico |
| 10580 | funcion | holoCrearEtiqueta |
| 10604 | funcion | holoCrearPiezaDinamica |
| 10640 | funcion | holoEliminarPiezaDeEscena |
| 10655 | funcion | holoLimpiarTodasLasPiezas |
| 10670 | funcion | holoEliminarPieza |
| 10693 | funcion | holoDeshacerBorrado |
| 10706 | funcion | holoRenombrarPieza |
| 10737 | funcion | holoRenderListaPiezas |
| 10766 | funcion | holoBuscarPieza |
| 10779 | funcion | holoOrdenarAutomatico |
| 10790 | funcion | holoResize |
| 10800 | funcion | holoToggleFullscreen |
| 10817 | funcion | holoAnimar |
| 10829 | funcion | holoAplicarFactor |
| 10835 | funcion | holoSetExplode |
| 10856 | funcion | holoRegistrarPickTargets |
| 10866 | funcion | holoActualizarMouseNDC |
| 10872 | funcion | holoConfigurarDragPiezas |
| 10935 | funcion | holoAplicarColor |
| 10957 | funcion | holoTogglePieza |
| 10962 | funcion | holoReset |
| 11003 | funcion | holoGiroExtraerCuadros |
| 11039 | funcion | holoGiroMostrar |
| 11059 | funcion | holoGiroConectarArrastre |
| 11084 | funcion | holoAbrirGiro |
| 11097 | funcion | holoCerrarGiro |
| 11104 | funcion | holoAbrirGiroDePieza |
| 11119 | funcion | holoGiroToggleAyuda |
| 11124 | funcion | holoGiroDesdeArchivo |
| 11156 | funcion | _holoDataURLaBytes |
| 11164 | funcion | holoGiroGuardar |
| 11208 | funcion | holoGiroCargarGuardado |
| 11224 | funcion | holoObtenerCaraFoto |
| 11237 | funcion | holoNormalMapDesdeImagen |
| 11274 | funcion | holoAplicarMediaDesdeURL |
| 11319 | funcion | holoCargarFotosDelModelo |
| 11372 | funcion | holoToggleModoGuiado |
| 11381 | funcion | holoActualizarPanelGuiado |
| 11392 | funcion | holoResetCapturaParcial |
| 11407 | funcion | holoAvanzarGuiado |
| 11419 | funcion | holoSaltarCaraGuiada |
| 11423 | funcion | holoTerminarGuiado |
| 11428 | funcion | holoAbrirModalFoto |
| 11456 | funcion | holoCerrarModalFoto |
| 11488 | funcion | holoToggleAnotacion |
| 11501 | funcion | holoRedibujarAnotacion |
| 11533 | funcion | holoCambiarModo |
| 11545 | funcion | holoToggleCamara |
| 11568 | funcion | holoUsarCelularParaFoto |
| 11582 | funcion | holoApagarCamaraFoto |
| 11595 | funcion | holoTomarFoto |
| 11611 | funcion | holoIniciarGrabacion |
| 11637 | funcion | holoDetenerGrabacion |
| 11641 | funcion | holoRetomarFoto |
| 11652 | funcion | holoGuardarFoto |
| 11714 | funcion | holoAplicarEstadisticasComunidad |
| 11730 | funcion | holoAbrirHistorialTaller |
| 11753 | funcion | holoAbrirSelectorModelos |
| 11764 | funcion | holoRenderListaModelos |
| 11781 | funcion | holoFiltrarListaModelos |
| 11786 | funcion | holoSeleccionarModeloGuardado |
| 11793 | funcion | holoAbrirModelosSimilares |
| 11799 | funcion | holoBuscarModelosSimilares |
| 11825 | funcion | holoReportarPieza |
| 11837 | funcion | holoCompararPieza |
| 11858 | funcion | holoGenerarReporte |
| 11899 | funcion | holoCapturarPantalla |
| 11921 | funcion | holoSugerirNombrePieza |
| 11933 | funcion | holoGrabarNotaVoz |
| 11995 | funcion | guardarReparacionLab |
| 12026 | funcion | abrirSoftwareAmbicion |
| 12076 | funcion | generarCodigoSalaCamara |
| 12082 | funcion | emparejarCelular |
| 12235 | funcion | alternarCamaraCelular |
| 12244 | funcion | cerrarModalCamaraCelular |
| 12255 | funcion | desconectarCamaraCelular |
| 12281 | funcion | abrirEstudioGrabacion |
| 12301 | funcion | cerrarEstudioGrabacion |
| 12317 | funcion | listarDispositivosGrabacion |
| 12347 | funcion | guardarConfigGrabacion |
| 12361 | funcion | cargarConfigGrabacion |
| 12363 | funcion | aplicarConfigGuardada |
| 12378 | funcion | videoDeStream |
| 12387 | funcion | videoDeArchivo |
| 12397 | funcion | encenderEstudio |
| 12456 | funcion | mostrarEstadoTransmision |
| 12469 | funcion | apagarEstudio |
| 12493 | funcion | cambiarEscena |
| 12507 | funcion | marcarEscenaActiva |
| 12516 | funcion | dibujarCover |
| 12524 | funcion | dibujarContain |
| 12532 | funcion | dibujarCamaraConMarco |
| 12540 | funcion | dibujarBucle |
| 12589 | funcion | alternarGrabacion |
| 12655 | funcion | alternarTransmision |
| 12751 | funcion | iniciarConexionWebRTC |
| 12824 | funcion | abrirModalDiagnosticoConsumo |
| 12867 | funcion | cerrarModalDiagnosticoConsumo |
| 12871 | funcion | evaluarConsumo |
| 12948 | funcion | agregarDiagnosticoBitacora |
| 12973 | funcion | avanzarRuta |
| 13005 | funcion | finalizarRuta |
| 13029 | funcion | insertarRutaBitacora |
| 13039 | funcion | reiniciarRuta |
| 13067 | funcion | calcularOhm |
| 13093 | funcion | limpiarOhm |
| 13102 | funcion | cargarPreviewAvatar |
| 13120 | funcion | guardarMiPerfil |
| 13153 | funcion | procesarImagenInventario |
| 13163 | funcion | convertirABase64 |
| 13188 | funcion | diagImei |
| 13195 | funcion | pintarDiagImei |
| 13200 | funcion | toggleDiagImei |
| 13212 | funcion | obtenerLectorImei |
| 13225 | funcion | obtenerLectorFotoImei |
| 13238 | funcion | procesarFotoImeiRecibida |
| 13246 | funcion | probarFotoImeiDesdeArchivo |
| 13265 | funcion | analizarImagenImei |
| 13311 | funcion | normalizarImei |
| 13319 | funcion | luhnImeiValido |
| 13330 | funcion | pareceImei |
| 13342 | funcion | extraerCandidatosImei |
| 13387 | funcion | actualizarEstadoScannerImei |
| 13394 | funcion | limpiarCandidatoOcrImei |
| 13408 | funcion | procesarCodigoDetectadoImei |
| 13445 | funcion | cargarTesseractScript |
| 13458 | funcion | obtenerWorkerOcrImei |
| 13482 | funcion | prepararImagenOcrImei |
| 13521 | funcion | resolverTextoOcrImei |
| 13547 | funcion | mostrarSugerenciaOcrImei |
| 13558 | funcion | confirmarOcrImei |
| 13565 | funcion | descartarOcrImei |
| 13577 | funcion | iniciarOcrFallbackImei |
| 13602 | funcion | detenerOcrFallbackImei |
| 13609 | funcion | poblarSelectorCamarasImei |
| 13622 | funcion | cambiarCamaraLaptopImei |
| 13635 | funcion | abrirScannerImei |
| 13675 | funcion | usarCelularParaImei |
| 13703 | funcion | cerrarScannerImei |
| 13708 | funcion | detenerScannerImei |
| 13750 | funcion | confirmarImportacionIA |
| 13769 | funcion | abrirModalCategoriaExcel |
| 13777 | funcion | cerrarModalCategoriaExcel |
| 13785 | funcion | confirmarCategoriaExcel |
| 13792 | funcion | procesarExcelInventario |
| 13908 | funcion | detectarColumnas |
| 14123 | funcion | confirmarImportacionExcel |
| 14143 | funcion | consultarCopilotoLab |
| 14263 | funcion | mostrarCargando |
| 14282 | funcion | cerrarSesion |
| 14305 | funcion | generarResumenIA |
| 14331 | funcion | marcarAsistenciaManual |
| 14403 | funcion | registrarFeed |
| 14414 | funcion | reportarActividadImportante |
| 14429 | funcion | enviarAlertaGerencial |
| 14450 | funcion | incrementarBadgeChat |
| 14461 | funcion | limpiarBadgeChat |
| 14470 | funcion | toggleRecuperarPassword |
| 14485 | funcion | enviarCorreoRecuperacion |
| 14527 | funcion | toggleMFAView |
| 14546 | funcion | moverAlSiguiente |
| 14562 | funcion | manejarRetroceso |
| 14569 | funcion | cancelar2FA |
| 14575 | funcion | verificarCodigo2FA |
| 14669 | funcion | cambiarFuenteModelos |
| 14713 | funcion | inicializarSelectorMarcas |
| 14749 | funcion | abrirSelectorModelos |
| 14808 | funcion | cerrarSelectorModelos |
| 14812 | funcion | seleccionarMarca |
| 14823 | funcion | filtrarYRenderizarModelos |
| 14900 | funcion | agregarModeloNuevo |
| 14926 | funcion | seleccionarModelo |
| 14994 | funcion | combinarSubcategorias |
| 15001 | funcion | poblarSelectSubcategoria |
| 15009 | funcion | manejarSeleccionSubcategoria |
| 15021 | funcion | cambiarRegCategoria |
| 15074 | funcion | agregarSugerenciaNombre |
| 15150 | funcion | renderizarGruposCompatibilidad |
| 15200 | funcion | abrirModalNuevoGrupo |
| 15214 | funcion | editarGrupoCompat |
| 15231 | funcion | cerrarModalGrupoCompat |
| 15237 | funcion | abrirSelectorModelosParaGrupo |
| 15241 | funcion | agregarMiembroCompatBuilder |
| 15260 | funcion | quitarMiembroCompatBuilder |
| 15265 | funcion | renderChipsCompatBuilder |
| 15280 | funcion | guardarGrupoCompat |
| 15307 | funcion | abrirModalImportarCompat |
| 15320 | funcion | cerrarModalImportarCompat |
| 15326 | funcion | cambiarTabImportCompat |
| 15338 | funcion | procesarArchivoExcelCompat |
| 15398 | funcion | procesarArchivoIACompat |
| 15433 | funcion | renderTablaImportCompat |
| 15485 | funcion | abrirSelectorModelosParaFilaImport |
| 15490 | funcion | agregarMiembroAFilaImport |
| 15503 | funcion | quitarMiembroFilaImport |
| 15509 | funcion | quitarFilaImport |
| 15514 | funcion | confirmarImportacionCompat |
| 15540 | funcion | eliminarGrupoCompat |
| 15553 | funcion | revisarSugerenciaCompatibilidad |
| 15590 | funcion | filtrarInventario |
| 15602 | funcion | poblarFiltroSubcategoria |
| 15616 | funcion | renderizarProductosFiltrados |
| 15710 | funcion | abrirModalEtiqueta |
| 15732 | funcion | imprimirEtiquetaFinal |
| 15755 | funcion | previsualizarFotoDetalle |
| 15773 | funcion | abrirVerTiendaProducto |
| 15832 | funcion | cerrarVerTiendaProducto |
| 15837 | funcion | irAEditarProductoDesdeTienda |
| 15844 | funcion | agregarDesdeVerTienda |
| 15850 | funcion | abrirDetalleProducto |
| 15917 | funcion | cargarHistorialDetalle |
| 15947 | funcion | cerrarDetalleProducto |
| 15952 | funcion | toggleCostosPorCategoria |
| 15965 | funcion | refrescarDetSubcategoria |
| 15980 | funcion | verificarCambiosDetalle |
| 16013 | funcion | guardarDetalleProducto |
| 16079 | funcion | toggleAjusteStock |
| 16090 | funcion | guardarAjusteStock |
| 16140 | funcion | procesarFotoProveedor |
| 16152 | funcion | cargarProveedores |
| 16198 | funcion | renderizarProveedores |
| 16232 | funcion | guardarProveedor |
| 16273 | funcion | eliminarProveedor |
| 16301 | funcion | cargarPanelLicencias |
| 16369 | funcion | guardarLicencia |
| 16378 | funcion | sumarDiasLicencia |
| 16382 | funcion | borrarCodigoLicencia |
| 16399 | funcion | cargarModelosPendientes |
| 16448 | funcion | usarSugerenciaIA |
| 16455 | funcion | resolverModelo |
| 16476 | funcion | cargarResellersAdmin |
| 16534 | funcion | abrirModalReseller |
| 16544 | funcion | editarReseller |
| 16554 | funcion | guardarResellerAdmin |
| 16579 | funcion | eliminarReseller |
| 16649 | funcion | aplicarFiltroTaller |
| 16665 | funcion | limpiarFiltroTaller |
| 16672 | funcion | filtrarTablaTaller |
| 16673 | funcion | filtrarTallerPorEstado |
| 16679 | funcion | actualizarKPIsTaller |
| 16703 | funcion | filtrarTablaClientes |
| 16715 | funcion | actualizarKPIClientes |
| 16727 | funcion | abrirModalEvento |
| 16731 | funcion | guardarEvento |
| 16765 | funcion | navegarSemana |
| 16805 | funcion | abrirGeneradorLicencia |
| 16808 | funcion | cerrarGeneradorLicencia |
| 16824 | funcion | irADescargarActualizacion |
| 16834 | funcion | instalarActualizacionAhora |
| 17794 | funcion | alternarAyudante |
| 17809 | funcion | actualizarBotonAyudante |
| 17818 | funcion | hablarAyudante |
| 17850 | funcion | programarCierreAyudante |
| 17856 | funcion | ocultarAyudante |
| 17943 | funcion | coincideFrase |
| 18189 | funcion | emocionJP |
| 18200 | funcion | autodestruccionJP |
| 18221 | funcion | responderComando |
| 18250 | funcion | sorprendemeJP |
| 18281 | funcion | revisarNegocio |
| 18350 | funcion | vigilarNegocio |
| 18377 | funcion | iniciarVigilancia |
| 18397 | funcion | sinDatosJP |
| 18406 | funcion | jpVentasDeHoy |
| 18431 | funcion | jpMejorCliente |
| 18456 | funcion | jpModelosMasReparados |
| 18479 | funcion | jpComisionTecnico |
| 18503 | funcion | jpPorCobrar |
| 18527 | funcion | revisarOrdenEnCurso |
| 18598 | funcion | programarRevisionOrden |
| 18609 | funcion | cargarVozJP |
| 18626 | funcion | textoParaVoz |
| 18638 | funcion | hablarEnVozAlta |
| 18652 | funcion | alternarVozJP |
| 18668 | funcion | actualizarBotonVoz |
| 18683 | funcion | posicionGuardadaJP |
| 18695 | funcion | aplicarPosicionGuardadaJP |
| 18707 | funcion | iniciarArrastreJP |
| 18780 | funcion | celebrarOrdenGuardada |
| 18815 | funcion | revisarHitosDelDia |
| 18863 | funcion | jpDameAnimo |
| 18907 | funcion | modoFiestaJP |
| 18922 | funcion | lanzarConfeti |
| 18940 | funcion | jpComoVoyHoy |
| 18966 | funcion | jpAdivinaNumero |
| 18977 | funcion | jpCaraOSello |
| 19034 | funcion | iniciarTutorial |
| 19046 | funcion | mostrarPasoTutorial |
| 19075 | funcion | pasoTutorial |
| 19084 | funcion | terminarTutorial |
| 19099 | funcion | menuTutoriales |
| 19111 | funcion | consejoHtml |
| 19117 | funcion | normalizar |
| 19123 | funcion | buscarTema |
| 19154 | funcion | elementoObjetivo |
| 19163 | funcion | resaltarElemento |
| 19176 | funcion | quitarResaltado |
| 19181 | funcion | posarEnElemento |
| 19227 | funcion | volverASuCasa |
| 19239 | funcion | explicarTema |
| 19250 | funcion | explicarTemaPorId |
| 19255 | funcion | preguntarAlAyudante |
| 19283 | funcion | listaTemasHtml |
| 19288 | funcion | mostrarIndiceAyudante |
| 19296 | funcion | numDe |
| 19304 | funcion | explicarMetricas |


## index.html — funcion (arrow)

| Línea | Tipo | Nombre / Texto |
|---|---|---|
| 6235 | funcion (arrow) | setVis |
| 6807 | funcion (arrow) | setChk |
| 7362 | funcion (arrow) | setNum |
| 9797 | funcion (arrow) | chk |
| 11026 | funcion (arrow) | ok |
| 11065 | funcion (arrow) | mover |
| 11073 | funcion (arrow) | iniciar |
| 11074 | funcion (arrow) | soltar |
| 11292 | funcion (arrow) | alListo |
| 11844 | funcion (arrow) | renderLado |
| 12366 | funcion (arrow) | set |
| 14206 | funcion (arrow) | esCierre |
| 14834 | funcion (arrow) | aItem |
| 18612 | funcion (arrow) | elegir |
| 19396 | funcion (arrow) | ocupado |
| 19397 | funcion (arrow) | libre |


## index.html — ipc (renderer)

| Línea | Tipo | Nombre / Texto |
|---|---|---|
| 2497 | ipc (renderer) | abrir-carpeta |
| 2516 | ipc (renderer) | abrir-carpeta |
| 3207 | ipc (renderer) | abrir-carpeta-plantillas |
| 5319 | ipc (renderer) | abrir-carpeta-grabaciones |
| 5892 | ipc (renderer) | registrar-error-renderer |
| 5905 | ipc (renderer) | registrar-error-renderer |
| 5966 | ipc (renderer) | iniciar-sesion-token |
| 5988 | ipc (renderer) | login-respuesta |
| 5991 | ipc (renderer) | iniciar-sesion |
| 6008 | ipc (renderer) | login-respuesta |
| 6077 | ipc (renderer) | resultado-2fa |
| 6163 | ipc (renderer) | pedir-datos-empresa |
| 6278 | ipc (renderer) | obtener-modelos-pendientes |
| 6280 | ipc (renderer) | obtener-panel-licencias |
| 6289 | ipc (renderer) | obtener-caja-errores |
| 6296 | ipc (renderer) | obtener-clientes |
| 6301 | ipc (renderer) | analisis-crm |
| 6303 | ipc (renderer) | obtener-tecnicos |
| 6305 | ipc (renderer) | obtener-tecnicos |
| 6306 | ipc (renderer) | obtener-ordenes |
| 6307 | ipc (renderer) | listar-pedidos-accesorios-pendientes |
| 6310 | ipc (renderer) | obtener-productos |
| 6311 | ipc (renderer) | obtener-subcategorias-custom |
| 6312 | ipc (renderer) | obtener-grupos-compatibilidad |
| 6315 | ipc (renderer) | obtener-productos |
| 6320 | ipc (renderer) | obtener-grupos-compatibilidad |
| 6323 | ipc (renderer) | obtener-productos |
| 6324 | ipc (renderer) | obtener-devoluciones |
| 6329 | ipc (renderer) | obtener-facturas |
| 6339 | ipc (renderer) | obtener-usuarios |
| 6340 | ipc (renderer) | obtener-tiendas |
| 6344 | ipc (renderer) | pedir-datos-empresa |
| 6380 | ipc (renderer) | obtener-monitor-actividad |
| 6383 | ipc (renderer) | monitor-actividad-respuesta |
| 6417 | ipc (renderer) | obtener-caja-errores |
| 6420 | ipc (renderer) | caja-errores-respuesta |
| 6465 | ipc (renderer) | resolver-error-app |
| 6468 | ipc (renderer) | error-app-resuelto |
| 6474 | ipc (renderer) | lista-de-facturas |
| 6510 | ipc (renderer) | buscar-facturas-devolucion |
| 6514 | ipc (renderer) | resultado-busqueda-facturas-devolucion |
| 6727 | ipc (renderer) | registrar-devolucion |
| 6730 | ipc (renderer) | devolucion-registrada |
| 6738 | ipc (renderer) | obtener-devoluciones |
| 6739 | ipc (renderer) | obtener-productos |
| 6748 | ipc (renderer) | obtener-devoluciones |
| 6757 | ipc (renderer) | lista-devoluciones |
| 6787 | ipc (renderer) | datos-empresa-respuesta |
| 6875 | ipc (renderer) | buscar-clientes |
| 6877 | ipc (renderer) | clientes-sugeridos |
| 6890 | ipc (renderer) | sugerir-stock-modelo |
| 6897 | ipc (renderer) | stock-sugerido-modelo |
| 6989 | ipc (renderer) | guardar-orden |
| 6991 | ipc (renderer) | guardar-orden |
| 7080 | ipc (renderer) | subir-foto-producto |
| 7108 | ipc (renderer) | nuevo-producto-sql |
| 7124 | ipc (renderer) | crear-usuario-nuevo |
| 7140 | ipc (renderer) | actualizar-cliente |
| 7142 | ipc (renderer) | guardar-cliente |
| 7146 | ipc (renderer) | resultado-cliente |
| 7150 | ipc (renderer) | obtener-clientes |
| 7154 | ipc (renderer) | cliente-actualizado |
| 7158 | ipc (renderer) | obtener-clientes |
| 7162 | ipc (renderer) | resultado-guardado |
| 7220 | ipc (renderer) | producto-guardado |
| 7228 | ipc (renderer) | eliminar-producto |
| 7231 | ipc (renderer) | producto-eliminado |
| 7234 | ipc (renderer) | obtener-productos |
| 7240 | ipc (renderer) | resultado-usuario |
| 7241 | ipc (renderer) | obtener-usuarios |
| 7248 | ipc (renderer) | lista-de-ordenes |
| 7480 | ipc (renderer) | obtener-accesorios-orden |
| 7483 | ipc (renderer) | accesorios-de-la-orden |
| 7497 | ipc (renderer) | asignar-tecnico-orden |
| 7500 | ipc (renderer) | lista-de-productos |
| 7636 | ipc (renderer) | registrar-venta-desktop |
| 7714 | ipc (renderer) | imprimir-documento |
| 7734 | ipc (renderer) | imprimir-documento |
| 7738 | ipc (renderer) | venta-desktop-resultado |
| 7746 | ipc (renderer) | obtener-productos |
| 7768 | ipc (renderer) | subcategorias-custom-lista |
| 7781 | ipc (renderer) | obtener-datos-reporte |
| 7817 | ipc (renderer) | datos-reporte |
| 7955 | ipc (renderer) | registrar-gasto |
| 7963 | ipc (renderer) | gasto-registrado |
| 7967 | ipc (renderer) | obtener-datos-reporte |
| 7974 | ipc (renderer) | eliminar-gasto |
| 7977 | ipc (renderer) | gasto-eliminado |
| 7980 | ipc (renderer) | obtener-datos-reporte |
| 7992 | ipc (renderer) | exportar-reporte-excel |
| 7995 | ipc (renderer) | reporte-excel-generado |
| 8016 | ipc (renderer) | exportar-inventario-excel |
| 8019 | ipc (renderer) | exportar-inventario-excel-res |
| 8033 | ipc (renderer) | obtener-cierre-dia |
| 8038 | ipc (renderer) | obtener-cierre-dia |
| 8042 | ipc (renderer) | cierre-dia-datos |
| 8221 | ipc (renderer) | obtener-top-ventas |
| 8265 | ipc (renderer) | top-ventas-data |
| 8296 | ipc (renderer) | ia-recepcion |
| 8300 | ipc (renderer) | respuesta-ia-recepcion |
| 8318 | ipc (renderer) | datos-crm |
| 8334 | ipc (renderer) | lista-de-clientes |
| 8376 | ipc (renderer) | lista-de-tecnicos |
| 8401 | ipc (renderer) | tecnico-asignado |
| 8404 | ipc (renderer) | obtener-ordenes |
| 8425 | ipc (renderer) | crear-tienda |
| 8428 | ipc (renderer) | tienda-creada |
| 8432 | ipc (renderer) | obtener-tiendas |
| 8438 | ipc (renderer) | lista-de-tiendas |
| 8445 | ipc (renderer) | asignar-tienda-usuario |
| 8448 | ipc (renderer) | tienda-asignada |
| 8449 | ipc (renderer) | obtener-usuarios |
| 8482 | ipc (renderer) | lista-de-usuarios |
| 8487 | ipc (renderer) | cambiar-estado-usuario |
| 8489 | ipc (renderer) | resultado-cambio-estado |
| 8495 | ipc (renderer) | actualizar-estado-orden |
| 8512 | ipc (renderer) | orden-actualizada |
| 8514 | ipc (renderer) | obtener-ordenes |
| 8562 | ipc (renderer) | resolver-pedido-accesorio |
| 8565 | ipc (renderer) | pedidos-accesorios-pendientes |
| 8567 | ipc (renderer) | resultado-pedido-accesorio |
| 8570 | ipc (renderer) | obtener-ordenes |
| 8574 | ipc (renderer) | listar-pedidos-accesorios-pendientes |
| 8578 | ipc (renderer) | listar-pedidos-accesorios-pendientes |
| 8905 | ipc (renderer) | obtener-estado-plan |
| 8908 | ipc (renderer) | estado-plan-respuesta |
| 8938 | ipc (renderer) | guardar-datos-empresa |
| 8941 | ipc (renderer) | resultado-datos-empresa |
| 8969 | ipc (renderer) | registrar-nuevo-cliente-saas |
| 8977 | ipc (renderer) | registro-saas-respuesta |
| 8992 | ipc (renderer) | crear-codigo-automatico |
| 8994 | ipc (renderer) | crear-codigo-automatico |
| 8998 | ipc (renderer) | codigo-creado-exito |
| 9139 | ipc (renderer) | emitir-factura-saas |
| 9383 | ipc (renderer) | factura-emitida-error |
| 9515 | ipc (renderer) | factura-emitida-exito |
| 9588 | ipc (renderer) | imprimir-documento |
| 9743 | ipc (renderer) | imprimir-documento |
| 9853 | ipc (renderer) | guardar-datos-empresa |
| 9858 | ipc (renderer) | imprimir-documento |
| 9866 | ipc (renderer) | documento-impreso |
| 9923 | ipc (renderer) | buscar-stock-tecnico |
| 9926 | ipc (renderer) | resultados-stock-tecnico |
| 9968 | ipc (renderer) | usar-repuesto-lab |
| 9978 | ipc (renderer) | repuesto-usado-lab |
| 10139 | ipc (renderer) | registrar-repuesto-externo |
| 10150 | ipc (renderer) | repuesto-externo-registrado |
| 10186 | ipc (renderer) | agregar-cobro-adicional |
| 10189 | ipc (renderer) | cobro-adicional-agregado |
| 10196 | ipc (renderer) | obtener-ordenes |
| 10205 | ipc (renderer) | obtener-compras-externas-dia |
| 10208 | ipc (renderer) | compras-externas-dia |
| 10264 | ipc (renderer) | buscar-orden-id |
| 10269 | ipc (renderer) | respuesta-orden-id |
| 10685 | ipc (renderer) | borrar-pieza-modelo |
| 10715 | ipc (renderer) | renombrar-pieza-modelo |
| 11185 | ipc (renderer) | guardar-foto-pieza-cache |
| 11186 | ipc (renderer) | subir-foto-pieza |
| 11334 | ipc (renderer) | leer-fotos-pieza-cache-modelo |
| 11341 | ipc (renderer) | buscar-fotos-modelo |
| 11352 | ipc (renderer) | guardar-foto-pieza-cache |
| 11448 | ipc (renderer) | sugerencias-nombres-pieza |
| 11679 | ipc (renderer) | guardar-foto-pieza-cache |
| 11695 | ipc (renderer) | subir-foto-pieza |
| 11720 | ipc (renderer) | estadisticas-fallas-modelo |
| 11739 | ipc (renderer) | historial-modelo-taller |
| 11759 | ipc (renderer) | listar-modelos-con-fotos |
| 11810 | ipc (renderer) | buscar-piezas-similares |
| 11831 | ipc (renderer) | reportar-pieza-modelo |
| 11832 | ipc (renderer) | reportar-pieza-modelo |
| 11847 | ipc (renderer) | buscar-fotos-modelo |
| 11864 | ipc (renderer) | buscar-fotos-modelo |
| 11888 | ipc (renderer) | imprimir-documento |
| 11891 | ipc (renderer) | documento-impreso |
| 11951 | ipc (renderer) | transcribir-audio-pieza |
| 12006 | ipc (renderer) | actualizar-bitacora-estado |
| 12033 | ipc (renderer) | abrir-ambicion |
| 12039 | ipc (renderer) | ambicion-bloqueado |
| 12337 | ipc (renderer) | listar-fuentes-pantalla |
| 12426 | ipc (renderer) | elegir-fuente-pantalla |
| 12620 | ipc (renderer) | guardar-grabacion |
| 12674 | ipc (renderer) | actualizar-modo-transmision |
| 12701 | ipc (renderer) | actualizar-modo-transmision |
| 12788 | ipc (renderer) | ambicion-resultado |
| 12804 | ipc (renderer) | abrir-log-ambicion |
| 12814 | ipc (renderer) | bitacora-actualizada |
| 12818 | ipc (renderer) | obtener-ordenes |
| 13129 | ipc (renderer) | guardar-mi-perfil |
| 13137 | ipc (renderer) | perfil-guardado-exito |
| 13160 | ipc (renderer) | analizar-documento-ia |
| 13723 | ipc (renderer) | respuesta-analisis-ia |
| 13755 | ipc (renderer) | nuevo-producto-sql |
| 13760 | ipc (renderer) | obtener-productos |
| 13890 | ipc (renderer) | preview-excel-inventario |
| 14073 | ipc (renderer) | preview-excel-resultado |
| 14126 | ipc (renderer) | importar-excel-inventario |
| 14129 | ipc (renderer) | resultado-importacion-excel |
| 14136 | ipc (renderer) | obtener-productos |
| 14153 | ipc (renderer) | ia-laboratorio |
| 14156 | ipc (renderer) | respuesta-ia-laboratorio |
| 14175 | ipc (renderer) | busqueda-global |
| 14222 | ipc (renderer) | resultados-busqueda-global |
| 14288 | ipc (renderer) | cerrar-sesion-token |
| 14314 | ipc (renderer) | generar-resumen-financiero |
| 14317 | ipc (renderer) | respuesta-resumen-financiero |
| 14338 | ipc (renderer) | marcar-asistencia-manual |
| 14345 | ipc (renderer) | registrar-salida-manual |
| 14354 | ipc (renderer) | asistencia-respuesta |
| 14370 | ipc (renderer) | salida-respuesta |
| 14386 | ipc (renderer) | salida-respuesta |
| 14602 | ipc (renderer) | verificar-2fa |
| 14607 | ipc (renderer) | marcas-modelos-respuesta |
| 14644 | ipc (renderer) | modelos-almacen-respuesta |
| 14693 | ipc (renderer) | obtener-modelos-almacen |
| 14773 | ipc (renderer) | obtener-marcas-modelos |
| 14911 | ipc (renderer) | agregar-modelo-nuevo |
| 14917 | ipc (renderer) | proponer-modelo |
| 15016 | ipc (renderer) | agregar-subcategoria-custom |
| 15083 | ipc (renderer) | lista-grupos-compatibilidad |
| 15088 | ipc (renderer) | grupo-compatibilidad-guardado |
| 15104 | ipc (renderer) | obtener-grupos-compatibilidad |
| 15105 | ipc (renderer) | obtener-productos |
| 15117 | ipc (renderer) | obtener-grupos-compatibilidad |
| 15118 | ipc (renderer) | obtener-productos |
| 15128 | ipc (renderer) | grupo-compatibilidad-eliminado |
| 15131 | ipc (renderer) | obtener-grupos-compatibilidad |
| 15132 | ipc (renderer) | obtener-productos |
| 15138 | ipc (renderer) | producto-vinculado-a-grupo |
| 15141 | ipc (renderer) | obtener-grupos-compatibilidad |
| 15142 | ipc (renderer) | obtener-productos |
| 15299 | ipc (renderer) | actualizar-grupo-compatibilidad |
| 15301 | ipc (renderer) | crear-grupo-compatibilidad |
| 15403 | ipc (renderer) | analizar-compatibilidad-archivo |
| 15406 | ipc (renderer) | respuesta-analisis-compatibilidad |
| 15532 | ipc (renderer) | crear-grupo-compatibilidad |
| 15547 | ipc (renderer) | eliminar-grupo-compatibilidad |
| 15924 | ipc (renderer) | obtener-historial-producto |
| 16040 | ipc (renderer) | subir-foto-producto |
| 16059 | ipc (renderer) | actualizar-producto-detalle |
| 16111 | ipc (renderer) | ajustar-stock-manual |
| 16181 | ipc (renderer) | obtener-proveedores-db |
| 16185 | ipc (renderer) | proveedores-db-respuesta |
| 16258 | ipc (renderer) | guardar-proveedor-db |
| 16281 | ipc (renderer) | eliminar-proveedor-db |
| 16289 | ipc (renderer) | modelo-propuesto |
| 16304 | ipc (renderer) | obtener-panel-licencias |
| 16312 | ipc (renderer) | panel-licencias-respuesta |
| 16370 | ipc (renderer) | actualizar-licencia |
| 16379 | ipc (renderer) | actualizar-licencia |
| 16383 | ipc (renderer) | borrar-codigo-licencia |
| 16386 | ipc (renderer) | licencia-actualizada |
| 16402 | ipc (renderer) | obtener-modelos-pendientes |
| 16405 | ipc (renderer) | modelos-pendientes-respuesta |
| 16464 | ipc (renderer) | resolver-modelo |
| 16467 | ipc (renderer) | modelo-resuelto |
| 16477 | ipc (renderer) | obtener-resellers-admin |
| 16481 | ipc (renderer) | resellers-admin-respuesta |
| 16514 | ipc (renderer) | guardar-reseller-respuesta |
| 16524 | ipc (renderer) | eliminar-reseller-respuesta |
| 16576 | ipc (renderer) | guardar-reseller-admin |
| 16581 | ipc (renderer) | eliminar-reseller-admin |
| 16814 | ipc (renderer) | pedir-version |
| 16817 | ipc (renderer) | recibir-version |
| 16825 | ipc (renderer) | abrir-pagina-descarga |
| 16835 | ipc (renderer) | instalar-actualizacion-ahora |
| 16838 | ipc (renderer) | actualizacion-disponible |
| 16847 | ipc (renderer) | actualizacion-lista |
| 16857 | ipc (renderer) | actualizacion-no-disponible |


# main.js


## main.js — seccion

| Línea | Tipo | Nombre / Texto |
|---|---|---|
| 29 | seccion | SESIÓN DE SUPABASE AUTH (paso previo a sacar la service_role del instalador) |
| 96 | seccion | CANDADO DE LANZAMIENTO DE AMBICION |
| 166 | seccion | MONITOR DE ACTIVIDAD Y CAJA DE ERRORES (soporte, solo casa matriz) |
| 266 | seccion | MONITOR DE ACTIVIDAD Y ERRORES: PANEL (solo casa matriz, ve TODAS las empresas) |
| 331 | seccion | CAPTURA DE PANTALLA PARA GRABAR REPARACIONES |
| 459 | seccion | CREAR CARPETAS FIRMWARE Y DUMP AL INICIAR (en userData: sobreviven actualizaciones) |
| 476 | seccion | ABRIR CARPETAS FIRMWARE / DUMP |
| 485 | seccion | GRABACIÓN DE REPARACIONES (pestaña Laboratorio) |
| 579 | seccion | TRANSMISION EN VIVO: marcar/desmarcar una orden como "En Vivo" |
| 602 | seccion | ABRIR CARPETA DE PLANTILLAS DE INVENTARIO (Excel para carga masiva) |
| 609 | seccion | OBTENER MARCAS Y MODELOS DE DISPOSITIVOS |
| 614 | seccion | AGREGAR MODELO NUEVO AL CATÁLOGO (cuando no existe uno que el usuario necesita) |
| 630 | seccion | 2. LOGIN INTELIGENTE (FILTRA POR EMPRESA Y FECHA) |
| 693 | seccion | 2.0B LOGIN AUTOMATICO CON TOKEN DE SESION RECORDADA |
| 746 | seccion | 2.0C CERRAR SESIÓN RECORDADA (invalida el token guardado) |
| 769 | seccion | 2.1 VERIFICACIÓN DE 2FA (SEGUNDO PASO DE ACCESO) |
| 866 | seccion | 3. CLIENTES (SOLO DE MI EMPRESA) |
| 983 | seccion | MI CATÁLOGO DE MODELOS: marcas y modelos deducidos del propio almacén |
| 1078 | seccion | PORTERO 1: la forma del nombre |
| 1111 | seccion | PORTERO 2: la IA |
| 1415 | seccion | COLA DE APROBACIÓN (solo la casa matriz) |
| 1468 | seccion | PROVEEDORES (PERSISTENCIA SEGURA EN SUPABASE + CONTROL DE FALLOS) |
| 1507 | seccion | SUBIR FOTO PRODUCTO |
| 1539 | seccion | HOLOGRAMA 3D: fotos reales de piezas por modelo de celular |
| 1966 | seccion | 4. INVENTARIO (SOLO DE MI EMPRESA) |
| 2029 | seccion | 4D. GRUPOS DE COMPATIBILIDAD DE MODELOS (micas/pantallas que comparten pieza y stock) |
| 2219 | seccion | 4A. SUBCATEGORÍAS PERSONALIZADAS (editables por el usuario, ej. tipos de Micas) |
| 2249 | seccion | 4B. IMPORTACIÓN DESDE EXCEL - PREVIEW |
| 2262 | seccion | TERCERA VÍA DE MATCHING: por grupo de compatibilidad |
| 2283 | seccion | LOGICA DE SUBCATEGORIAS PARA EXCEL |
| 2405 | seccion | 4C. IMPORTACIÓN DESDE EXCEL - EJECUTAR UPSERT ADITIVO |
| 2616 | seccion | 4D. HISTORIAL DE PRODUCTO |
| 2675 | seccion | 5. ORDENES/TALLER (SOLO DE MI EMPRESA) |
| 2737 | seccion | 6. REPORTES (SUMA SOLO EL DINERO DE MI EMPRESA) |
| 2906 | seccion | 6b. GASTOS OPERATIVOS (alquiler, sueldos, luz, etc. — migración 008) |
| 2940 | seccion | 6b-bis. DATOS PARA EXPORTAR EL REPORTE A EXCEL (formato de la plantilla del dueño) |
| 3057 | seccion | EXPORTAR INVENTARIO ACTUAL DE PRODUCTOS A EXCEL (.XLSX) |
| 3300 | seccion | 6b-ter. MÁS VENDIDOS por categoría (ventas del POS del período elegido) |
| 3402 | seccion | 6c. CIERRE DEL DÍA UNIFICADO (FASE 6 del plan finanzas — el "libro de caja") |
| 3600 | seccion | 6d. TIENDAS (sucursales) — asignación de personal por tienda |
| 3641 | seccion | 7. GESTIÓN DE USUARIOS (SOLO DE MI EMPRESA) |
| 3699 | seccion | 7.1 CAMBIAR ESTADO DE USUARIO (Activar/Desactivar) |
| 3725 | seccion | 8. ESTADO DEL PLAN (Para el Dashboard de Licencias) |
| 3763 | seccion | 9. CONFIGURACIÓN DE EMPRESA |
| 3808 | seccion | 10. GENERADOR AUTOMÁTICO DE LICENCIAS (SÓLO ADMIN) |
| 3842 | seccion | 10B. PANEL DE LICENCIAS (solo casa matriz) |
| 3886 | seccion | 11. REGISTRO SAAS CON VALIDACIÓN DE LICENCIA Y FECHA |
| 3913 | seccion | 12. MÓDULO DE FACTURACIÓN AUTOMÁTICA |
| 3988 | seccion | 13. ACTUALIZAR PERFIL DE USUARIO |
| 4010 | seccion | 14. MÓDULOS DE IA (Gemini y OpenAI) |
| 4061 | seccion | 14B. IMPORTAR GRUPOS DE COMPATIBILIDAD DESDE PDF O IMAGEN (Fase 5) |
| 4263 | seccion | 15. BÚSQUEDAS |
| 4415 | seccion | VENTA RÁPIDA DE ESCRITORIO (POS para cualquier rol) |
| 4581 | seccion | REPUESTO EXTERNO (traído de otro proveedor porque no había en stock) |
| 4656 | seccion | COBRO ADICIONAL: otra falla / trabajo extra hallado durante la reparación |
| 4726 | seccion | IMPRESIÓN DE COMPROBANTES |
| 4795 | seccion | 16. MÓDULO DE ASISTENCIA MANUAL |
| 4817 | seccion | HANDLER: Cargar historial de facturas |
| 4827 | seccion | MÓDULO DE DEVOLUCIONES (cliente devuelve un producto vendido) |
| 4970 | seccion | HANDLER: Análisis CRM (clientes inactivos) |
| 4983 | seccion | HANDLER: Buscar orden por ID (para el Laboratorio) |
| 4994 | seccion | HANDLER: Guardar bitácora y cambiar estado |
| 5028 | seccion | HANDLER: Accesorios ya agregados a una orden (para el Detalle de la orden) |
| 5041 | seccion | HANDLER: Cambiar estado de una orden |
| 5067 | seccion | PEDIDOS DE ACCESORIOS (creados por el cliente desde el tracking web) |
| 5144 | seccion | HANDLER: Listar usuarios |
| 5154 | seccion | HANDLER: Gestión de Resellers (Global, solo super admin) |
| 5229 | seccion | CIERRE |


## main.js — ipc (main)

| Línea | Tipo | Nombre / Texto |
|---|---|---|
| 260 | ipc (main) | registrar-error-renderer |
| 270 | ipc (main) | obtener-monitor-actividad |
| 285 | ipc (main) | obtener-caja-errores |
| 300 | ipc (main) | resolver-error-app |
| 437 | ipc (main) | pedir-version |
| 445 | ipc (main) | abrir-pagina-descarga |
| 455 | ipc (main) | instalar-actualizacion-ahora |
| 477 | ipc (main) | abrir-carpeta |
| 497 | ipc (main) | listar-fuentes-pantalla |
| 517 | ipc (main) | elegir-fuente-pantalla |
| 520 | ipc (main) | guardar-grabacion |
| 584 | ipc (main) | actualizar-modo-transmision |
| 598 | ipc (main) | abrir-carpeta-grabaciones |
| 603 | ipc (main) | abrir-carpeta-plantillas |
| 610 | ipc (main) | obtener-marcas-modelos |
| 615 | ipc (main) | agregar-modelo-nuevo |
| 631 | ipc (main) | iniciar-sesion |
| 694 | ipc (main) | iniciar-sesion-token |
| 747 | ipc (main) | cerrar-sesion-token |
| 770 | ipc (main) | verificar-2fa |
| 867 | ipc (main) | guardar-cliente |
| 881 | ipc (main) | actualizar-cliente |
| 917 | ipc (main) | obtener-clientes |
| 932 | ipc (main) | buscar-clientes |
| 960 | ipc (main) | sugerir-stock-modelo |
| 1304 | ipc (main) | obtener-modelos-almacen |
| 1338 | ipc (main) | proponer-modelo |
| 1422 | ipc (main) | obtener-modelos-pendientes |
| 1448 | ipc (main) | resolver-modelo |
| 1469 | ipc (main) | guardar-proveedor-db |
| 1485 | ipc (main) | obtener-proveedores-db |
| 1499 | ipc (main) | eliminar-proveedor-db |
| 1508 | ipc (main) | subir-foto-producto |
| 1567 | ipc (main) | subir-foto-pieza |
| 1632 | ipc (main) | reportar-pieza-modelo |
| 1665 | ipc (main) | estadisticas-fallas-modelo |
| 1700 | ipc (main) | historial-modelo-taller |
| 1720 | ipc (main) | renombrar-pieza-modelo |
| 1741 | ipc (main) | borrar-pieza-modelo |
| 1773 | ipc (main) | sugerencias-nombres-pieza |
| 1797 | ipc (main) | transcribir-audio-pieza |
| 1839 | ipc (main) | guardar-foto-pieza-cache |
| 1859 | ipc (main) | leer-fotos-pieza-cache-modelo |
| 1886 | ipc (main) | buscar-fotos-modelo |
| 1917 | ipc (main) | buscar-piezas-similares |
| 1940 | ipc (main) | listar-modelos-con-fotos |
| 1967 | ipc (main) | nuevo-producto-sql |
| 1999 | ipc (main) | obtener-productos |
| 2012 | ipc (main) | eliminar-producto |
| 2032 | ipc (main) | obtener-grupos-compatibilidad |
| 2073 | ipc (main) | crear-grupo-compatibilidad |
| 2134 | ipc (main) | actualizar-grupo-compatibilidad |
| 2181 | ipc (main) | eliminar-grupo-compatibilidad |
| 2197 | ipc (main) | vincular-producto-a-grupo |
| 2220 | ipc (main) | obtener-subcategorias-custom |
| 2237 | ipc (main) | agregar-subcategoria-custom |
| 2250 | ipc (main) | preview-excel-inventario |
| 2406 | ipc (main) | importar-excel-inventario |
| 2617 | ipc (main) | obtener-historial-producto |
| 2629 | ipc (main) | actualizar-producto-detalle |
| 2645 | ipc (main) | ajustar-stock-manual |
| 2676 | ipc (main) | guardar-orden |
| 2699 | ipc (main) | obtener-ordenes |
| 2713 | ipc (main) | obtener-tecnicos |
| 2723 | ipc (main) | asignar-tecnico-orden |
| 2745 | ipc (main) | obtener-datos-reporte |
| 2907 | ipc (main) | registrar-gasto |
| 2926 | ipc (main) | eliminar-gasto |
| 3027 | ipc (main) | obtener-datos-export |
| 3038 | ipc (main) | exportar-reporte-excel |
| 3059 | ipc (main) | exportar-inventario-excel |
| 3301 | ipc (main) | obtener-top-ventas |
| 3406 | ipc (main) | obtener-cierre-dia |
| 3601 | ipc (main) | obtener-tiendas |
| 3613 | ipc (main) | crear-tienda |
| 3627 | ipc (main) | asignar-tienda-usuario |
| 3642 | ipc (main) | crear-usuario-nuevo |
| 3700 | ipc (main) | cambiar-estado-usuario |
| 3726 | ipc (main) | obtener-estado-plan |
| 3764 | ipc (main) | guardar-datos-empresa |
| 3789 | ipc (main) | pedir-datos-empresa |
| 3809 | ipc (main) | crear-codigo-automatico |
| 3846 | ipc (main) | obtener-panel-licencias |
| 3857 | ipc (main) | actualizar-licencia |
| 3874 | ipc (main) | borrar-codigo-licencia |
| 3887 | ipc (main) | registrar-nuevo-cliente-saas |
| 3914 | ipc (main) | emitir-factura-saas |
| 3989 | ipc (main) | guardar-mi-perfil |
| 4011 | ipc (main) | analizar-documento-ia |
| 4071 | ipc (main) | analizar-compatibilidad-archivo |
| 4114 | ipc (main) | ia-recepcion |
| 4157 | ipc (main) | ia-laboratorio |
| 4201 | ipc (main) | generar-resumen-financiero |
| 4264 | ipc (main) | buscar-stock-tecnico |
| 4295 | ipc (main) | abrir-ambicion |
| 4407 | ipc (main) | abrir-log-ambicion |
| 4419 | ipc (main) | registrar-venta-desktop |
| 4495 | ipc (main) | usar-repuesto-lab |
| 4584 | ipc (main) | registrar-repuesto-externo |
| 4660 | ipc (main) | agregar-cobro-adicional |
| 4704 | ipc (main) | obtener-compras-externas-dia |
| 4730 | ipc (main) | imprimir-documento |
| 4780 | ipc (main) | busqueda-global |
| 4796 | ipc (main) | marcar-asistencia-manual |
| 4818 | ipc (main) | obtener-facturas |
| 4832 | ipc (main) | buscar-facturas-devolucion |
| 4854 | ipc (main) | registrar-devolucion |
| 4951 | ipc (main) | obtener-devoluciones |
| 4971 | ipc (main) | analisis-crm |
| 4984 | ipc (main) | buscar-orden-id |
| 4995 | ipc (main) | actualizar-bitacora-estado |
| 5029 | ipc (main) | obtener-accesorios-orden |
| 5042 | ipc (main) | actualizar-estado-orden |
| 5070 | ipc (main) | listar-pedidos-accesorios-pendientes |
| 5081 | ipc (main) | resolver-pedido-accesorio |
| 5145 | ipc (main) | obtener-usuarios |
| 5155 | ipc (main) | obtener-resellers-admin |
| 5170 | ipc (main) | guardar-reseller-admin |
| 5212 | ipc (main) | eliminar-reseller-admin |
| 5233 | ipc (main) | registrar-salida-manual |


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
| 490 | funcion | carpetaGrabaciones |
| 1096 | funcion | validarFormatoModelo |
| 1120 | funcion | distanciaEdicion |
| 1139 | funcion | candidatosDelCatalogo |
| 1211 | funcion | verificarModeloConIA |
| 1257 | funcion | stockPorModeloDeEmpresa |
| 1281 | funcion | sincronizarUsoModelos |
| 1822 | funcion | holoCacheDir |
| 1827 | funcion | holoManifestPath |
| 1830 | funcion | holoLeerManifest |
| 1833 | funcion | holoGuardarManifest |
| 2943 | funcion | recolectarDatosExport |
| 3080 | funcion | agregarHojaInventario |
| 3180 | funcion | construirExcelReporte |
| 4281 | funcion | copiarCarpetaRecursivo |
| 5249 | funcion | registrarFeed |

