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
| 2551 | comentario | ---------- EQUIPO ---------- |
| 2574 | comentario | ---------- FASE 1: PERIFÉRICOS ---------- |
| 2610 | comentario | ---------- FASE 2: CONSUMO (lógica que antes vivía en su propio modal) ---------- |
| 2637 | comentario | ---------- FASE 2: RUTA DE ENCENDIDO (los 4 pasos de siempre) ---------- |
| 2647 | comentario | Pasos |
| 2695 | comentario | Resumen de la ruta |
| 2702 | comentario | ---------- INFORME ---------- |
| 2726 | comentario | Modal: VUELTA 360° de una pieza (Opción A del holograma) |
| 2736 | comentario | Instrucciones paso a paso (plegadas por defecto) |
| 2765 | comentario | Visor / previsualización |
| 2796 | comentario | Modal: Fotografiar pieza para el Holograma 3D |
| 2815 | comentario | Modo guiado: la app va pidiendo cara por cara con instrucciones |
| 2827 | comentario | Modo manual (guiado desactivado): elegir cara suelta |
| 2897 | comentario | Modal: Historial privado de este modelo en TU taller |
| 2909 | comentario | Modal: Buscar piezas en modelos similares (referencia visual) |
| 2929 | comentario | Modal: Abrir un modelo ya guardado en la librería (sin necesitar una orden) |
| 2942 | comentario | Modal: Comparar Antes / Después de una pieza |
| 2962 | comentario | ============ VENTA RÁPIDA (POS de escritorio, para todos los roles) ============ |
| 3003 | comentario | Modal: producto libre (venta sin stock) |
| 3083 | comentario | La mano de obra ya no se escribe: sale de restarle el repuesto al total. |
| 3218 | comentario | Stats Row |
| 3248 | comentario | Search |
| 3259 | comentario | Table |
| 3284 | comentario | Las tarjetas se poblarán dinámicamente |
| 3330 | comentario | Pestañas de Navegación de Inventario |
| 3402 | comentario | ================= NUEVO BLOQUE ================= |
| 3409 | comentario | ================================================= |
| 3415 | comentario | Sugerencias de Accesorios |
| 3435 | comentario | Sugerencias de Repuestos |
| 3455 | comentario | Sugerencias de Micas |
| 3473 | comentario | Selector de Modelo para Pantallas y Micas |
| 3750 | comentario | NUEVA SECCIÓN: MI PERFIL |
| 3755 | comentario | FOTO DE PERFIL |
| 3777 | comentario | DATOS |
| 3896 | comentario | ============ APARIENCIA / TEMA ============ |
| 3905 | comentario | ORIGINAL |
| 3919 | comentario | NEGRO |
| 3933 | comentario | BLANCO |
| 3947 | comentario | DOHA-CELL (marca) |
| 3961 | comentario | PREMIUM |
| 3982 | comentario | ============ TICKET / COMPROBANTE (personalización de impresión) ============ |
| 3991 | comentario | Formulario |
| 4046 | comentario | Vista previa en vivo (80mm) |
| 4122 | comentario | NUEVA SECCIÓN: DISTRIBUIDORES |
| 4141 | comentario | Se poblará dinámicamente |
| 4147 | comentario | PANEL DE LICENCIAS (solo casa matriz) |
| 4194 | comentario | COLA DE REVISIÓN DEL CATÁLOGO COMPARTIDO DE MODELOS |
| 4244 | comentario | Quick Stats |
| 4277 | comentario | Calendar Grid |
| 4309 | comentario | Modal Nuevo Evento (Si no existe) |
| 4375 | comentario | Monitor de Actividad + Caja de Errores: solo casa matriz (empresa 1), ve TODOS los talleres |
| 4454 | comentario | Vacío = alta nueva; con id = se está corrigiendo la ficha de ese cliente. |
| 4504 | comentario | Modal Nuevo Proveedor |
| 4547 | comentario | Modal Nuevo / Editar Reseller |
| 4604 | comentario | Modal Selector de Modelos Premium |
| 4614 | comentario | De dónde salen los modelos: el almacén propio o el catálogo mundial |
| 4637 | comentario | Grid de marcas comunes |
| 4639 | comentario | Se poblará dinámicamente con JS |
| 4648 | comentario | Listado de modelos |
| 4651 | comentario | Se poblará dinámicamente con JS |
| 4662 | comentario | Modal Crear/Editar Grupo de Compatibilidad |
| 4710 | comentario | Modal Importar Grupos de Compatibilidad desde archivo (Fase 5) |
| 4769 | comentario | Modal Escáner de IMEI/código de barras por cámara web (Recepción) |
| 4818 | comentario | Modal Registrar Devolución |
| 4924 | comentario | Modal de Selección de Categoría para Excel |
| 4956 | comentario | Modal de Importación Excel |
| 5017 | comentario | MODAL VISTA TIENDA DEL PRODUCTO |
| 5051 | comentario | MODAL IMPRIMIR ETIQUETA |
| 5075 | comentario | CONTENEDOR PARA IMPRESIÓN (OCULTO EN PANTALLA, VISIBLE EN IMPRESIÓN) |
| 5078 | comentario | MODAL DETALLE DE PRODUCTO (SÓLO LECTURA Y EDICIÓN PARCIAL) |
| 5089 | comentario | Bloque 1: Datos Generales |
| 5152 | comentario | Bloque 2: Costos por proveedor (Condicional) |
| 5175 | comentario | Bloque 3: Precios de venta |
| 5190 | comentario | Bloque 4: Historial de Ingresos |
| 5277 | comentario | Modal: elegir formato del comprobante ya emitido (PDF o Ticket) |
| 5301 | comentario | ===== ESTUDIO DE GRABACIÓN DE REPARACIONES ===== |
| 5318 | comentario | Vista previa: lo que se ve aquí es exactamente lo que se graba |
| 5327 | comentario | Escenas |
| 5339 | comentario | Configuración de fuentes y vinculación |
| 5405 | comentario | Controles |
| 5423 | comentario | Modal: Vincular la cámara del celular por WiFi al Estudio de Grabación |
| 5468 | comentario | Modal: Cobro adicional (otra falla / trabajo extra encontrado en la reparación) |
| 5506 | comentario | Modal: Bloqueo del equipo (Patrón / Clave / Contraseña) |
| 5517 | comentario | PATRÓN: 9 puntos para dibujar |
| 5526 | comentario | CLAVE: teclado numérico |
| 5545 | comentario | CONTRASEÑA: escribir |
| 5560 | comentario | Modal: Repuesto externo (traído de otro proveedor) |
| 5598 | comentario | Modal: Reponer stock (agotados y por agotarse, agrupados por categoría) |
| 5613 | comentario | Modal: Más vendidos por categoría (según el período elegido en Métricas) |
| 5631 | comentario | Modal: Detalle de orden (datos de Recepción: foto de evidencia y firma del cliente) |
| 5668 | comentario | Modal: Selector de tema (visible para TODOS los roles desde el botón del sidebar) |
| 5691 | comentario | Modal: Cierre del Día unificado (taller + POS − gastos − compras − devoluciones) |
| 5708 | comentario | Modal: Registrar gasto operativo |
| 5746 | comentario | Modal: Compras externas del día (cierre por proveedor) |
| 5761 | comentario | Cabecera con info del canal activo |
| 5780 | comentario | Pestañas de canales temáticos |
| 5801 | comentario | Área de mensajes |
| 5804 | comentario | Indicador de escritura |
| 5810 | comentario | Input de mensaje |
| 5824 | comentario | MARCA DE AGUA (Solo para Notas de Venta) |
| 5830 | comentario | ENCABEZADO |
| 5863 | comentario | DATOS DEL CLIENTE |
| 5889 | comentario | TABLA DE DETALLES |
| 5919 | comentario | TOTALES Y PIE DE PÁGINA |
| 16892 | comentario | TICKET DE ORDEN (oculto, solo para html2canvas) |
| 16935 | comentario | QR de rastreo individual por orden |
| 17166 | comentario | ================= AYUDANTE ANIMADO (robot con puerta) ================= |
| 17190 | comentario | Marco y hueco de la puerta |
| 17192 | comentario | El robot sube desde dentro del hueco |
| 17194 | comentario | antena |
| 17197 | comentario | cabeza |
| 17200 | comentario | visor |
| 17204 | comentario | boca: recta normal, sonrisa y tristeza (se alternan según la emoción) |
| 17212 | comentario | orejas |
| 17215 | comentario | cuerpo |
| 17219 | comentario | brazo que saluda |
| 17223 | comentario | Hojas de la puerta |


## index.html — modal

| Línea | Tipo | Nombre / Texto |
|---|---|---|
| 2537 | modal | diagnostico-placa |
| 2727 | modal | holo-giro |
| 2797 | modal | holo-foto |
| 2898 | modal | holo-historial |
| 2910 | modal | holo-similares |
| 2930 | modal | holo-modelos |
| 2943 | modal | holo-comparar |
| 3004 | modal | venta-libre |
| 4310 | modal | evento |
| 4451 | modal | cliente |
| 4456 | modal | cliente-aviso |
| 4480 | modal | usuario |
| 4505 | modal | proveedor |
| 4548 | modal | reseller |
| 4605 | modal | selector-modelos |
| 4663 | modal | grupo-compat |
| 4711 | modal | importar-compat |
| 4770 | modal | scanner-imei |
| 4819 | modal | registrar-devolucion |
| 4897 | modal | confirm-custom |
| 4911 | modal | confirm-ai |
| 4925 | modal | categoria-excel |
| 4957 | modal | excel-import |
| 5018 | modal | ver-tienda-producto |
| 5052 | modal | imprimir-etiqueta |
| 5079 | modal | detalle-producto |
| 5218 | modal | facturacion |
| 5278 | modal | comprobante-listo |
| 5304 | modal | grabacion |
| 5424 | modal | camara-celular |
| 5439 | modal | ohm |
| 5469 | modal | cobro-adicional |
| 5507 | modal | bloqueo-equipo |
| 5561 | modal | repuesto-externo |
| 5599 | modal | reponer-stock |
| 5614 | modal | top-ventas |
| 5632 | modal | detalle-orden |
| 5669 | modal | tema |
| 5692 | modal | cierre-dia |
| 5709 | modal | gasto |
| 5747 | modal | compras-dia |
| 17077 | modal | super-admin |


## index.html — funcion

| Línea | Tipo | Nombre / Texto |
|---|---|---|
| 6044 | funcion | showToast |
| 6067 | funcion | iniciarSesion |
| 6237 | funcion | guardarPersonalizacion |
| 6246 | funcion | aplicarPersonalizacion |
| 6273 | funcion | _pintarTema |
| 6284 | funcion | abrirSelectorTema |
| 6288 | funcion | cerrarSelectorTema |
| 6292 | funcion | aplicarTema |
| 6302 | funcion | cargarTemaGuardado |
| 6312 | funcion | aplicarPermisos |
| 6390 | funcion | showView |
| 6455 | funcion | cambiarTabMonitor |
| 6469 | funcion | nombreLegibleCanal |
| 6474 | funcion | cargarMonitorActividad |
| 6504 | funcion | filtrarErrores |
| 6513 | funcion | cargarCajaErrores |
| 6560 | funcion | marcarErrorResuelto |
| 6601 | funcion | buscarFacturasDevolucionDebounced |
| 6632 | funcion | seleccionarFacturaDevolucion |
| 6670 | funcion | cerrarFacturaSeleccionadaDevolucion |
| 6677 | funcion | escaparHtmlDevol |
| 6686 | funcion | intentarMatchProductoPorNombre |
| 6692 | funcion | poblarSelectorProductoDevolucion |
| 6713 | funcion | abrirFormularioDevolucionItem |
| 6736 | funcion | abrirDevolucionSinFactura |
| 6757 | funcion | cerrarModalDevolucion |
| 6761 | funcion | actualizarAvisoCondicionDevolucion |
| 6777 | funcion | toggleMontoDevolucion |
| 6783 | funcion | guardarDevolucion |
| 6844 | funcion | cargarDevoluciones |
| 6859 | funcion | renderizarHistorialDevoluciones |
| 6924 | funcion | showConfigSection |
| 6933 | funcion | calcularTotal |
| 6962 | funcion | buscarClienteRecepcion |
| 6983 | funcion | sugerirStockModelo |
| 7004 | funcion | pintarRepuestosSugeridos |
| 7024 | funcion | elegirRepuestoSugerido |
| 7038 | funcion | costoRepuestoEditado |
| 7050 | funcion | guardarOrden |
| 7079 | funcion | procesarDecision |
| 7100 | funcion | previsualizarFotoProducto |
| 7115 | funcion | comprimirImagen |
| 7153 | funcion | guardarProducto |
| 7214 | funcion | crearUsuario |
| 7224 | funcion | guardarCliente |
| 7323 | funcion | eliminarProducto |
| 7352 | funcion | renderOrdenesTaller |
| 7446 | funcion | actualizarDashboardBento |
| 7502 | funcion | tick |
| 7524 | funcion | verDetalleOrden |
| 7593 | funcion | asignarTecnicoOrden |
| 7607 | funcion | _escV |
| 7611 | funcion | _ventaSinControl |
| 7613 | funcion | renderVentaProductos |
| 7654 | funcion | agregarVentaProducto |
| 7669 | funcion | abrirVentaLibre |
| 7675 | funcion | agregarVentaLibre |
| 7684 | funcion | cambiarCantidadVenta |
| 7693 | funcion | totalVenta |
| 7695 | funcion | renderVentaCarrito |
| 7713 | funcion | vaciarVenta |
| 7717 | funcion | cobrarVenta |
| 7737 | funcion | _finVentaEnCurso |
| 7743 | funcion | generarCotizacion |
| 7817 | funcion | imprimirTicketVenta |
| 7852 | funcion | toggleMenuAgregarInventario |
| 7872 | funcion | cambiarPeriodoReporte |
| 7882 | funcion | animarNumero |
| 7885 | funcion | paso |
| 7893 | funcion | pintarBadge |
| 7905 | funcion | toggleDetalleIngresos |
| 7909 | funcion | irAGastos |
| 7963 | funcion | setTipoGrafica |
| 7969 | funcion | renderChartReporte |
| 8041 | funcion | abrirModalGasto |
| 8049 | funcion | guardarGasto |
| 8070 | funcion | eliminarGasto |
| 8085 | funcion | exportarReporteExcel |
| 8098 | funcion | exportarInventarioExcel |
| 8127 | funcion | abrirCierreDia |
| 8133 | funcion | confirmarCierreDia |
| 8229 | funcion | copiarCierreDia |
| 8269 | funcion | abrirReponerStock |
| 8305 | funcion | copiarListaReposicion |
| 8313 | funcion | abrirTopVentas |
| 8324 | funcion | setTopVentasTab |
| 8331 | funcion | renderTopVentas |
| 8381 | funcion | simularIA |
| 8408 | funcion | generarQR |
| 8451 | funcion | abrirModalCliente |
| 8465 | funcion | cerrarModalCliente |
| 8492 | funcion | nombreTecnico |
| 8511 | funcion | renderTiendasChips |
| 8519 | funcion | crearTienda |
| 8541 | funcion | asignarTiendaUsuario |
| 8550 | funcion | renderTablaUsuarios |
| 8584 | funcion | cambiarEstadoUsuario |
| 8591 | funcion | cambiarEstadoOrden |
| 8615 | funcion | toggleNotifPedidos |
| 8627 | funcion | renderPedidosPendientes |
| 8658 | funcion | resolverPedidoAccesorio |
| 8683 | funcion | getPos |
| 8694 | funcion | limpiarFirma |
| 8698 | funcion | toggleCamara |
| 8716 | funcion | usarCelularParaFoto |
| 8732 | funcion | apagarCamara |
| 8744 | funcion | tomarFoto |
| 8753 | funcion | retomarFoto |
| 8783 | funcion | entrarModoBeta |
| 8833 | funcion | _poblarTallerDemo |
| 8859 | funcion | _poblarClientesDemo |
| 8879 | funcion | _poblarInventarioDemo |
| 8894 | funcion | _poblarCRMDemo |
| 8905 | funcion | _poblarGraficoDemo |
| 8933 | funcion | guardarConfigWA |
| 8940 | funcion | iniciarTutorial |
| 8996 | funcion | cargarEstadoPlan |
| 9013 | funcion | guardarDatosEmpresa |
| 9046 | funcion | mostrarRegistro |
| 9051 | funcion | ocultarRegistro |
| 9056 | funcion | registrarNuevoNegocio |
| 9085 | funcion | generarNuevaLicencia |
| 9114 | funcion | copiarCodigoManual |
| 9145 | funcion | numeroALetras |
| 9160 | funcion | menorDeCien |
| 9168 | funcion | menorDeMil |
| 9178 | funcion | convertir |
| 9203 | funcion | abrirModalFacturacion |
| 9218 | funcion | emitirFactura |
| 9249 | funcion | _finEmisionFactura |
| 9291 | funcion | toggleChat |
| 9297 | funcion | cambiarCanalChat |
| 9312 | funcion | cargarHistorialChatCanal |
| 9334 | funcion | iniciarChatEnVivo |
| 9363 | funcion | recibirMensaje |
| 9423 | funcion | enviarMensajeChat |
| 9450 | funcion | notificarEscritura |
| 9456 | funcion | mostrarEscribiendo |
| 9470 | funcion | notificarChatOrden |
| 9490 | funcion | renderComprobanteDoc |
| 9636 | funcion | verFacturaHistorial |
| 9662 | funcion | _escComp |
| 9668 | funcion | _serializarInvoicePDF |
| 9686 | funcion | descargarComprobantePDF |
| 9700 | funcion | _ticketInner |
| 9763 | funcion | generarGarantiaDesdeComprobante |
| 9787 | funcion | _emitirGarantiaPDF |
| 9848 | funcion | construirTicketHTML |
| 9860 | funcion | _htmlTicket |
| 9865 | funcion | cargarLogoTicket |
| 9880 | funcion | quitarLogoTicket |
| 9885 | funcion | sincronizarLogoDesdeUrl |
| 9896 | funcion | _leerOpcionesTicket |
| 9906 | funcion | renderTicketPreview |
| 9936 | funcion | guardarTicket |
| 9956 | funcion | imprimirComprobanteTicket |
| 9982 | funcion | toggleTimer |
| 10009 | funcion | filtrarStockTecnico |
| 10059 | funcion | usarRepuestoLab |
| 10095 | funcion | avisarMargenNegativo |
| 10109 | funcion | centroPunto |
| 10114 | funcion | construirPuntosPatron |
| 10131 | funcion | tocarPunto |
| 10140 | funcion | dibujarLineasPatron |
| 10151 | funcion | borrarPatron |
| 10158 | funcion | pinTecla |
| 10162 | funcion | pinBorrar |
| 10167 | funcion | cambiarTipoBloqueo |
| 10178 | funcion | abrirBloqueoEquipo |
| 10186 | funcion | guardarBloqueoEquipo |
| 10191 | funcion | guardarBloqueoEquipoActual |
| 10208 | funcion | abrirRepuestoExterno |
| 10227 | funcion | registrarRepuestoExterno |
| 10264 | funcion | abrirCobroAdicional |
| 10274 | funcion | guardarCobroAdicional |
| 10302 | funcion | abrirReporteComprasDia |
| 10353 | funcion | buscarOrdenLab |
| 10417 | funcion | holoRoundedRectShape |
| 10432 | funcion | holoSlabGeometry |
| 10438 | funcion | initHologramaLab |
| 10507 | funcion | holoCrearCajaFoto |
| 10546 | funcion | holoConstruirCelular |
| 10674 | funcion | holoSlotAutomatico |
| 10680 | funcion | holoCrearEtiqueta |
| 10704 | funcion | holoCrearPiezaDinamica |
| 10740 | funcion | holoEliminarPiezaDeEscena |
| 10755 | funcion | holoLimpiarTodasLasPiezas |
| 10770 | funcion | holoEliminarPieza |
| 10793 | funcion | holoDeshacerBorrado |
| 10806 | funcion | holoRenombrarPieza |
| 10837 | funcion | holoRenderListaPiezas |
| 10866 | funcion | holoBuscarPieza |
| 10879 | funcion | holoOrdenarAutomatico |
| 10890 | funcion | holoResize |
| 10900 | funcion | holoToggleFullscreen |
| 10917 | funcion | holoAnimar |
| 10929 | funcion | holoAplicarFactor |
| 10935 | funcion | holoSetExplode |
| 10956 | funcion | holoRegistrarPickTargets |
| 10966 | funcion | holoActualizarMouseNDC |
| 10972 | funcion | holoConfigurarDragPiezas |
| 11035 | funcion | holoAplicarColor |
| 11057 | funcion | holoTogglePieza |
| 11062 | funcion | holoReset |
| 11103 | funcion | holoGiroExtraerCuadros |
| 11139 | funcion | holoGiroMostrar |
| 11159 | funcion | holoGiroConectarArrastre |
| 11184 | funcion | holoAbrirGiro |
| 11197 | funcion | holoCerrarGiro |
| 11204 | funcion | holoAbrirGiroDePieza |
| 11219 | funcion | holoGiroToggleAyuda |
| 11224 | funcion | holoGiroDesdeArchivo |
| 11256 | funcion | _holoDataURLaBytes |
| 11264 | funcion | holoGiroGuardar |
| 11308 | funcion | holoGiroCargarGuardado |
| 11324 | funcion | holoObtenerCaraFoto |
| 11337 | funcion | holoNormalMapDesdeImagen |
| 11374 | funcion | holoAplicarMediaDesdeURL |
| 11419 | funcion | holoCargarFotosDelModelo |
| 11472 | funcion | holoToggleModoGuiado |
| 11481 | funcion | holoActualizarPanelGuiado |
| 11492 | funcion | holoResetCapturaParcial |
| 11507 | funcion | holoAvanzarGuiado |
| 11519 | funcion | holoSaltarCaraGuiada |
| 11523 | funcion | holoTerminarGuiado |
| 11528 | funcion | holoAbrirModalFoto |
| 11556 | funcion | holoCerrarModalFoto |
| 11588 | funcion | holoToggleAnotacion |
| 11601 | funcion | holoRedibujarAnotacion |
| 11633 | funcion | holoCambiarModo |
| 11645 | funcion | holoToggleCamara |
| 11668 | funcion | holoUsarCelularParaFoto |
| 11682 | funcion | holoApagarCamaraFoto |
| 11695 | funcion | holoTomarFoto |
| 11711 | funcion | holoIniciarGrabacion |
| 11737 | funcion | holoDetenerGrabacion |
| 11741 | funcion | holoRetomarFoto |
| 11752 | funcion | holoGuardarFoto |
| 11814 | funcion | holoAplicarEstadisticasComunidad |
| 11830 | funcion | holoAbrirHistorialTaller |
| 11853 | funcion | holoAbrirSelectorModelos |
| 11864 | funcion | holoRenderListaModelos |
| 11881 | funcion | holoFiltrarListaModelos |
| 11886 | funcion | holoSeleccionarModeloGuardado |
| 11893 | funcion | holoAbrirModelosSimilares |
| 11899 | funcion | holoBuscarModelosSimilares |
| 11925 | funcion | holoReportarPieza |
| 11937 | funcion | holoCompararPieza |
| 11958 | funcion | holoGenerarReporte |
| 11999 | funcion | holoCapturarPantalla |
| 12021 | funcion | holoSugerirNombrePieza |
| 12033 | funcion | holoGrabarNotaVoz |
| 12095 | funcion | guardarReparacionLab |
| 12126 | funcion | abrirSoftwareAmbicion |
| 12176 | funcion | generarCodigoSalaCamara |
| 12182 | funcion | emparejarCelular |
| 12335 | funcion | alternarCamaraCelular |
| 12344 | funcion | cerrarModalCamaraCelular |
| 12355 | funcion | desconectarCamaraCelular |
| 12381 | funcion | abrirEstudioGrabacion |
| 12401 | funcion | cerrarEstudioGrabacion |
| 12417 | funcion | listarDispositivosGrabacion |
| 12447 | funcion | guardarConfigGrabacion |
| 12461 | funcion | cargarConfigGrabacion |
| 12463 | funcion | aplicarConfigGuardada |
| 12478 | funcion | videoDeStream |
| 12487 | funcion | videoDeArchivo |
| 12497 | funcion | encenderEstudio |
| 12556 | funcion | mostrarEstadoTransmision |
| 12569 | funcion | apagarEstudio |
| 12593 | funcion | cambiarEscena |
| 12607 | funcion | marcarEscenaActiva |
| 12616 | funcion | dibujarCover |
| 12624 | funcion | dibujarContain |
| 12632 | funcion | dibujarCamaraConMarco |
| 12640 | funcion | dibujarBucle |
| 12689 | funcion | alternarGrabacion |
| 12755 | funcion | alternarTransmision |
| 12851 | funcion | iniciarConexionWebRTC |
| 12935 | funcion | dpNum |
| 12944 | funcion | dpArquitecturaDeModelo |
| 12954 | funcion | dpReglasDeterministas |
| 13031 | funcion | dpEvaluarConsumo |
| 13056 | funcion | dpLeerMediciones |
| 13077 | funcion | dpDetectarArquitectura |
| 13084 | funcion | dpEvaluar |
| 13114 | funcion | abrirDiagnosticoPlaca |
| 13134 | funcion | cerrarDiagnosticoPlaca |
| 13138 | funcion | dpReiniciarTodo |
| 13151 | funcion | dpConfigurarInputDecimal |
| 13175 | funcion | avanzarRuta |
| 13207 | funcion | finalizarRuta |
| 13231 | funcion | reiniciarRuta |
| 13261 | funcion | dpGenerarInforme |
| 13323 | funcion | dpPintarInforme |
| 13345 | funcion | dpEscapar |
| 13351 | funcion | dpInsertarBitacora |
| 13371 | funcion | calcularOhm |
| 13397 | funcion | limpiarOhm |
| 13406 | funcion | cargarPreviewAvatar |
| 13424 | funcion | guardarMiPerfil |
| 13457 | funcion | procesarImagenInventario |
| 13467 | funcion | convertirABase64 |
| 13492 | funcion | diagImei |
| 13499 | funcion | pintarDiagImei |
| 13504 | funcion | toggleDiagImei |
| 13516 | funcion | obtenerLectorImei |
| 13529 | funcion | obtenerLectorFotoImei |
| 13542 | funcion | procesarFotoImeiRecibida |
| 13550 | funcion | probarFotoImeiDesdeArchivo |
| 13569 | funcion | analizarImagenImei |
| 13615 | funcion | normalizarImei |
| 13623 | funcion | luhnImeiValido |
| 13634 | funcion | pareceImei |
| 13646 | funcion | extraerCandidatosImei |
| 13691 | funcion | actualizarEstadoScannerImei |
| 13698 | funcion | limpiarCandidatoOcrImei |
| 13712 | funcion | procesarCodigoDetectadoImei |
| 13749 | funcion | cargarTesseractScript |
| 13762 | funcion | obtenerWorkerOcrImei |
| 13786 | funcion | prepararImagenOcrImei |
| 13825 | funcion | resolverTextoOcrImei |
| 13851 | funcion | mostrarSugerenciaOcrImei |
| 13862 | funcion | confirmarOcrImei |
| 13869 | funcion | descartarOcrImei |
| 13881 | funcion | iniciarOcrFallbackImei |
| 13906 | funcion | detenerOcrFallbackImei |
| 13913 | funcion | poblarSelectorCamarasImei |
| 13926 | funcion | cambiarCamaraLaptopImei |
| 13939 | funcion | abrirScannerImei |
| 13979 | funcion | usarCelularParaImei |
| 14007 | funcion | cerrarScannerImei |
| 14012 | funcion | detenerScannerImei |
| 14054 | funcion | confirmarImportacionIA |
| 14073 | funcion | abrirModalCategoriaExcel |
| 14081 | funcion | cerrarModalCategoriaExcel |
| 14089 | funcion | confirmarCategoriaExcel |
| 14096 | funcion | procesarExcelInventario |
| 14212 | funcion | detectarColumnas |
| 14427 | funcion | confirmarImportacionExcel |
| 14447 | funcion | consultarCopilotoLab |
| 14567 | funcion | mostrarCargando |
| 14586 | funcion | cerrarSesion |
| 14609 | funcion | generarResumenIA |
| 14635 | funcion | marcarAsistenciaManual |
| 14707 | funcion | registrarFeed |
| 14718 | funcion | reportarActividadImportante |
| 14733 | funcion | enviarAlertaGerencial |
| 14754 | funcion | incrementarBadgeChat |
| 14765 | funcion | limpiarBadgeChat |
| 14774 | funcion | toggleRecuperarPassword |
| 14789 | funcion | enviarCorreoRecuperacion |
| 14831 | funcion | toggleMFAView |
| 14850 | funcion | moverAlSiguiente |
| 14866 | funcion | manejarRetroceso |
| 14873 | funcion | cancelar2FA |
| 14879 | funcion | verificarCodigo2FA |
| 14973 | funcion | cambiarFuenteModelos |
| 15017 | funcion | inicializarSelectorMarcas |
| 15053 | funcion | abrirSelectorModelos |
| 15112 | funcion | cerrarSelectorModelos |
| 15116 | funcion | seleccionarMarca |
| 15127 | funcion | filtrarYRenderizarModelos |
| 15204 | funcion | agregarModeloNuevo |
| 15230 | funcion | seleccionarModelo |
| 15298 | funcion | combinarSubcategorias |
| 15305 | funcion | poblarSelectSubcategoria |
| 15313 | funcion | manejarSeleccionSubcategoria |
| 15325 | funcion | cambiarRegCategoria |
| 15378 | funcion | agregarSugerenciaNombre |
| 15454 | funcion | renderizarGruposCompatibilidad |
| 15504 | funcion | abrirModalNuevoGrupo |
| 15518 | funcion | editarGrupoCompat |
| 15535 | funcion | cerrarModalGrupoCompat |
| 15541 | funcion | abrirSelectorModelosParaGrupo |
| 15545 | funcion | agregarMiembroCompatBuilder |
| 15564 | funcion | quitarMiembroCompatBuilder |
| 15569 | funcion | renderChipsCompatBuilder |
| 15584 | funcion | guardarGrupoCompat |
| 15611 | funcion | abrirModalImportarCompat |
| 15624 | funcion | cerrarModalImportarCompat |
| 15630 | funcion | cambiarTabImportCompat |
| 15642 | funcion | procesarArchivoExcelCompat |
| 15702 | funcion | procesarArchivoIACompat |
| 15737 | funcion | renderTablaImportCompat |
| 15789 | funcion | abrirSelectorModelosParaFilaImport |
| 15794 | funcion | agregarMiembroAFilaImport |
| 15807 | funcion | quitarMiembroFilaImport |
| 15813 | funcion | quitarFilaImport |
| 15818 | funcion | confirmarImportacionCompat |
| 15844 | funcion | eliminarGrupoCompat |
| 15857 | funcion | revisarSugerenciaCompatibilidad |
| 15894 | funcion | filtrarInventario |
| 15906 | funcion | poblarFiltroSubcategoria |
| 15920 | funcion | renderizarProductosFiltrados |
| 16014 | funcion | abrirModalEtiqueta |
| 16036 | funcion | imprimirEtiquetaFinal |
| 16059 | funcion | previsualizarFotoDetalle |
| 16077 | funcion | abrirVerTiendaProducto |
| 16136 | funcion | cerrarVerTiendaProducto |
| 16141 | funcion | irAEditarProductoDesdeTienda |
| 16148 | funcion | agregarDesdeVerTienda |
| 16154 | funcion | abrirDetalleProducto |
| 16221 | funcion | cargarHistorialDetalle |
| 16251 | funcion | cerrarDetalleProducto |
| 16256 | funcion | toggleCostosPorCategoria |
| 16269 | funcion | refrescarDetSubcategoria |
| 16284 | funcion | verificarCambiosDetalle |
| 16317 | funcion | guardarDetalleProducto |
| 16383 | funcion | toggleAjusteStock |
| 16394 | funcion | guardarAjusteStock |
| 16444 | funcion | procesarFotoProveedor |
| 16456 | funcion | cargarProveedores |
| 16502 | funcion | renderizarProveedores |
| 16536 | funcion | guardarProveedor |
| 16577 | funcion | eliminarProveedor |
| 16605 | funcion | cargarPanelLicencias |
| 16673 | funcion | guardarLicencia |
| 16682 | funcion | sumarDiasLicencia |
| 16686 | funcion | borrarCodigoLicencia |
| 16703 | funcion | cargarModelosPendientes |
| 16752 | funcion | usarSugerenciaIA |
| 16759 | funcion | resolverModelo |
| 16780 | funcion | cargarResellersAdmin |
| 16838 | funcion | abrirModalReseller |
| 16848 | funcion | editarReseller |
| 16858 | funcion | guardarResellerAdmin |
| 16883 | funcion | eliminarReseller |
| 16953 | funcion | aplicarFiltroTaller |
| 16969 | funcion | limpiarFiltroTaller |
| 16976 | funcion | filtrarTablaTaller |
| 16977 | funcion | filtrarTallerPorEstado |
| 16983 | funcion | actualizarKPIsTaller |
| 17007 | funcion | filtrarTablaClientes |
| 17019 | funcion | actualizarKPIClientes |
| 17031 | funcion | abrirModalEvento |
| 17035 | funcion | guardarEvento |
| 17069 | funcion | navegarSemana |
| 17109 | funcion | abrirGeneradorLicencia |
| 17112 | funcion | cerrarGeneradorLicencia |
| 17128 | funcion | irADescargarActualizacion |
| 17138 | funcion | instalarActualizacionAhora |
| 18098 | funcion | alternarAyudante |
| 18113 | funcion | actualizarBotonAyudante |
| 18122 | funcion | hablarAyudante |
| 18154 | funcion | programarCierreAyudante |
| 18160 | funcion | ocultarAyudante |
| 18247 | funcion | coincideFrase |
| 18493 | funcion | emocionJP |
| 18504 | funcion | autodestruccionJP |
| 18525 | funcion | responderComando |
| 18554 | funcion | sorprendemeJP |
| 18585 | funcion | revisarNegocio |
| 18654 | funcion | vigilarNegocio |
| 18681 | funcion | iniciarVigilancia |
| 18701 | funcion | sinDatosJP |
| 18710 | funcion | jpVentasDeHoy |
| 18735 | funcion | jpMejorCliente |
| 18760 | funcion | jpModelosMasReparados |
| 18783 | funcion | jpComisionTecnico |
| 18807 | funcion | jpPorCobrar |
| 18831 | funcion | revisarOrdenEnCurso |
| 18902 | funcion | programarRevisionOrden |
| 18913 | funcion | cargarVozJP |
| 18930 | funcion | textoParaVoz |
| 18942 | funcion | hablarEnVozAlta |
| 18956 | funcion | alternarVozJP |
| 18972 | funcion | actualizarBotonVoz |
| 18987 | funcion | posicionGuardadaJP |
| 18999 | funcion | aplicarPosicionGuardadaJP |
| 19011 | funcion | iniciarArrastreJP |
| 19084 | funcion | celebrarOrdenGuardada |
| 19119 | funcion | revisarHitosDelDia |
| 19167 | funcion | jpDameAnimo |
| 19211 | funcion | modoFiestaJP |
| 19226 | funcion | lanzarConfeti |
| 19244 | funcion | jpComoVoyHoy |
| 19270 | funcion | jpAdivinaNumero |
| 19281 | funcion | jpCaraOSello |
| 19338 | funcion | iniciarTutorial |
| 19350 | funcion | mostrarPasoTutorial |
| 19379 | funcion | pasoTutorial |
| 19388 | funcion | terminarTutorial |
| 19403 | funcion | menuTutoriales |
| 19415 | funcion | consejoHtml |
| 19421 | funcion | normalizar |
| 19427 | funcion | buscarTema |
| 19458 | funcion | elementoObjetivo |
| 19467 | funcion | resaltarElemento |
| 19480 | funcion | quitarResaltado |
| 19485 | funcion | posarEnElemento |
| 19531 | funcion | volverASuCasa |
| 19543 | funcion | explicarTema |
| 19554 | funcion | explicarTemaPorId |
| 19559 | funcion | preguntarAlAyudante |
| 19587 | funcion | listaTemasHtml |
| 19592 | funcion | mostrarIndiceAyudante |
| 19600 | funcion | numDe |
| 19608 | funcion | explicarMetricas |


## index.html — funcion (arrow)

| Línea | Tipo | Nombre / Texto |
|---|---|---|
| 6332 | funcion (arrow) | setVis |
| 6904 | funcion (arrow) | setChk |
| 7459 | funcion (arrow) | setNum |
| 9897 | funcion (arrow) | chk |
| 11126 | funcion (arrow) | ok |
| 11165 | funcion (arrow) | mover |
| 11173 | funcion (arrow) | iniciar |
| 11174 | funcion (arrow) | soltar |
| 11392 | funcion (arrow) | alListo |
| 11944 | funcion (arrow) | renderLado |
| 12466 | funcion (arrow) | set |
| 13119 | funcion (arrow) | leerLab |
| 14510 | funcion (arrow) | esCierre |
| 15138 | funcion (arrow) | aItem |
| 18916 | funcion (arrow) | elegir |
| 19700 | funcion (arrow) | ocupado |
| 19701 | funcion (arrow) | libre |


## index.html — ipc (renderer)

| Línea | Tipo | Nombre / Texto |
|---|---|---|
| 2497 | ipc (renderer) | abrir-carpeta |
| 2511 | ipc (renderer) | abrir-carpeta |
| 3319 | ipc (renderer) | abrir-carpeta-plantillas |
| 5416 | ipc (renderer) | abrir-carpeta-grabaciones |
| 5989 | ipc (renderer) | registrar-error-renderer |
| 6002 | ipc (renderer) | registrar-error-renderer |
| 6063 | ipc (renderer) | iniciar-sesion-token |
| 6085 | ipc (renderer) | login-respuesta |
| 6088 | ipc (renderer) | iniciar-sesion |
| 6105 | ipc (renderer) | login-respuesta |
| 6174 | ipc (renderer) | resultado-2fa |
| 6260 | ipc (renderer) | pedir-datos-empresa |
| 6375 | ipc (renderer) | obtener-modelos-pendientes |
| 6377 | ipc (renderer) | obtener-panel-licencias |
| 6386 | ipc (renderer) | obtener-caja-errores |
| 6393 | ipc (renderer) | obtener-clientes |
| 6398 | ipc (renderer) | analisis-crm |
| 6400 | ipc (renderer) | obtener-tecnicos |
| 6402 | ipc (renderer) | obtener-tecnicos |
| 6403 | ipc (renderer) | obtener-ordenes |
| 6404 | ipc (renderer) | listar-pedidos-accesorios-pendientes |
| 6407 | ipc (renderer) | obtener-productos |
| 6408 | ipc (renderer) | obtener-subcategorias-custom |
| 6409 | ipc (renderer) | obtener-grupos-compatibilidad |
| 6412 | ipc (renderer) | obtener-productos |
| 6417 | ipc (renderer) | obtener-grupos-compatibilidad |
| 6420 | ipc (renderer) | obtener-productos |
| 6421 | ipc (renderer) | obtener-devoluciones |
| 6426 | ipc (renderer) | obtener-facturas |
| 6436 | ipc (renderer) | obtener-usuarios |
| 6437 | ipc (renderer) | obtener-tiendas |
| 6441 | ipc (renderer) | pedir-datos-empresa |
| 6477 | ipc (renderer) | obtener-monitor-actividad |
| 6480 | ipc (renderer) | monitor-actividad-respuesta |
| 6514 | ipc (renderer) | obtener-caja-errores |
| 6517 | ipc (renderer) | caja-errores-respuesta |
| 6562 | ipc (renderer) | resolver-error-app |
| 6565 | ipc (renderer) | error-app-resuelto |
| 6571 | ipc (renderer) | lista-de-facturas |
| 6607 | ipc (renderer) | buscar-facturas-devolucion |
| 6611 | ipc (renderer) | resultado-busqueda-facturas-devolucion |
| 6824 | ipc (renderer) | registrar-devolucion |
| 6827 | ipc (renderer) | devolucion-registrada |
| 6835 | ipc (renderer) | obtener-devoluciones |
| 6836 | ipc (renderer) | obtener-productos |
| 6845 | ipc (renderer) | obtener-devoluciones |
| 6854 | ipc (renderer) | lista-devoluciones |
| 6884 | ipc (renderer) | datos-empresa-respuesta |
| 6972 | ipc (renderer) | buscar-clientes |
| 6974 | ipc (renderer) | clientes-sugeridos |
| 6987 | ipc (renderer) | sugerir-stock-modelo |
| 6994 | ipc (renderer) | stock-sugerido-modelo |
| 7086 | ipc (renderer) | guardar-orden |
| 7088 | ipc (renderer) | guardar-orden |
| 7177 | ipc (renderer) | subir-foto-producto |
| 7205 | ipc (renderer) | nuevo-producto-sql |
| 7221 | ipc (renderer) | crear-usuario-nuevo |
| 7237 | ipc (renderer) | actualizar-cliente |
| 7239 | ipc (renderer) | guardar-cliente |
| 7243 | ipc (renderer) | resultado-cliente |
| 7247 | ipc (renderer) | obtener-clientes |
| 7251 | ipc (renderer) | cliente-actualizado |
| 7255 | ipc (renderer) | obtener-clientes |
| 7259 | ipc (renderer) | resultado-guardado |
| 7317 | ipc (renderer) | producto-guardado |
| 7325 | ipc (renderer) | eliminar-producto |
| 7328 | ipc (renderer) | producto-eliminado |
| 7331 | ipc (renderer) | obtener-productos |
| 7337 | ipc (renderer) | resultado-usuario |
| 7338 | ipc (renderer) | obtener-usuarios |
| 7345 | ipc (renderer) | lista-de-ordenes |
| 7577 | ipc (renderer) | obtener-accesorios-orden |
| 7580 | ipc (renderer) | accesorios-de-la-orden |
| 7594 | ipc (renderer) | asignar-tecnico-orden |
| 7597 | ipc (renderer) | lista-de-productos |
| 7733 | ipc (renderer) | registrar-venta-desktop |
| 7811 | ipc (renderer) | imprimir-documento |
| 7831 | ipc (renderer) | imprimir-documento |
| 7835 | ipc (renderer) | venta-desktop-resultado |
| 7843 | ipc (renderer) | obtener-productos |
| 7865 | ipc (renderer) | subcategorias-custom-lista |
| 7878 | ipc (renderer) | obtener-datos-reporte |
| 7914 | ipc (renderer) | datos-reporte |
| 8052 | ipc (renderer) | registrar-gasto |
| 8060 | ipc (renderer) | gasto-registrado |
| 8064 | ipc (renderer) | obtener-datos-reporte |
| 8071 | ipc (renderer) | eliminar-gasto |
| 8074 | ipc (renderer) | gasto-eliminado |
| 8077 | ipc (renderer) | obtener-datos-reporte |
| 8089 | ipc (renderer) | exportar-reporte-excel |
| 8092 | ipc (renderer) | reporte-excel-generado |
| 8113 | ipc (renderer) | exportar-inventario-excel |
| 8116 | ipc (renderer) | exportar-inventario-excel-res |
| 8130 | ipc (renderer) | obtener-cierre-dia |
| 8135 | ipc (renderer) | obtener-cierre-dia |
| 8139 | ipc (renderer) | cierre-dia-datos |
| 8318 | ipc (renderer) | obtener-top-ventas |
| 8362 | ipc (renderer) | top-ventas-data |
| 8393 | ipc (renderer) | ia-recepcion |
| 8397 | ipc (renderer) | respuesta-ia-recepcion |
| 8415 | ipc (renderer) | datos-crm |
| 8431 | ipc (renderer) | lista-de-clientes |
| 8473 | ipc (renderer) | lista-de-tecnicos |
| 8498 | ipc (renderer) | tecnico-asignado |
| 8501 | ipc (renderer) | obtener-ordenes |
| 8522 | ipc (renderer) | crear-tienda |
| 8525 | ipc (renderer) | tienda-creada |
| 8529 | ipc (renderer) | obtener-tiendas |
| 8535 | ipc (renderer) | lista-de-tiendas |
| 8542 | ipc (renderer) | asignar-tienda-usuario |
| 8545 | ipc (renderer) | tienda-asignada |
| 8546 | ipc (renderer) | obtener-usuarios |
| 8579 | ipc (renderer) | lista-de-usuarios |
| 8584 | ipc (renderer) | cambiar-estado-usuario |
| 8586 | ipc (renderer) | resultado-cambio-estado |
| 8592 | ipc (renderer) | actualizar-estado-orden |
| 8609 | ipc (renderer) | orden-actualizada |
| 8611 | ipc (renderer) | obtener-ordenes |
| 8659 | ipc (renderer) | resolver-pedido-accesorio |
| 8662 | ipc (renderer) | pedidos-accesorios-pendientes |
| 8664 | ipc (renderer) | resultado-pedido-accesorio |
| 8667 | ipc (renderer) | obtener-ordenes |
| 8671 | ipc (renderer) | listar-pedidos-accesorios-pendientes |
| 8675 | ipc (renderer) | listar-pedidos-accesorios-pendientes |
| 9002 | ipc (renderer) | obtener-estado-plan |
| 9005 | ipc (renderer) | estado-plan-respuesta |
| 9035 | ipc (renderer) | guardar-datos-empresa |
| 9038 | ipc (renderer) | resultado-datos-empresa |
| 9066 | ipc (renderer) | registrar-nuevo-cliente-saas |
| 9074 | ipc (renderer) | registro-saas-respuesta |
| 9089 | ipc (renderer) | crear-codigo-automatico |
| 9091 | ipc (renderer) | crear-codigo-automatico |
| 9095 | ipc (renderer) | codigo-creado-exito |
| 9238 | ipc (renderer) | emitir-factura-saas |
| 9483 | ipc (renderer) | factura-emitida-error |
| 9615 | ipc (renderer) | factura-emitida-exito |
| 9688 | ipc (renderer) | imprimir-documento |
| 9843 | ipc (renderer) | imprimir-documento |
| 9953 | ipc (renderer) | guardar-datos-empresa |
| 9958 | ipc (renderer) | imprimir-documento |
| 9966 | ipc (renderer) | documento-impreso |
| 10023 | ipc (renderer) | buscar-stock-tecnico |
| 10026 | ipc (renderer) | resultados-stock-tecnico |
| 10068 | ipc (renderer) | usar-repuesto-lab |
| 10078 | ipc (renderer) | repuesto-usado-lab |
| 10239 | ipc (renderer) | registrar-repuesto-externo |
| 10250 | ipc (renderer) | repuesto-externo-registrado |
| 10286 | ipc (renderer) | agregar-cobro-adicional |
| 10289 | ipc (renderer) | cobro-adicional-agregado |
| 10296 | ipc (renderer) | obtener-ordenes |
| 10305 | ipc (renderer) | obtener-compras-externas-dia |
| 10308 | ipc (renderer) | compras-externas-dia |
| 10364 | ipc (renderer) | buscar-orden-id |
| 10369 | ipc (renderer) | respuesta-orden-id |
| 10785 | ipc (renderer) | borrar-pieza-modelo |
| 10815 | ipc (renderer) | renombrar-pieza-modelo |
| 11285 | ipc (renderer) | guardar-foto-pieza-cache |
| 11286 | ipc (renderer) | subir-foto-pieza |
| 11434 | ipc (renderer) | leer-fotos-pieza-cache-modelo |
| 11441 | ipc (renderer) | buscar-fotos-modelo |
| 11452 | ipc (renderer) | guardar-foto-pieza-cache |
| 11548 | ipc (renderer) | sugerencias-nombres-pieza |
| 11779 | ipc (renderer) | guardar-foto-pieza-cache |
| 11795 | ipc (renderer) | subir-foto-pieza |
| 11820 | ipc (renderer) | estadisticas-fallas-modelo |
| 11839 | ipc (renderer) | historial-modelo-taller |
| 11859 | ipc (renderer) | listar-modelos-con-fotos |
| 11910 | ipc (renderer) | buscar-piezas-similares |
| 11931 | ipc (renderer) | reportar-pieza-modelo |
| 11932 | ipc (renderer) | reportar-pieza-modelo |
| 11947 | ipc (renderer) | buscar-fotos-modelo |
| 11964 | ipc (renderer) | buscar-fotos-modelo |
| 11988 | ipc (renderer) | imprimir-documento |
| 11991 | ipc (renderer) | documento-impreso |
| 12051 | ipc (renderer) | transcribir-audio-pieza |
| 12106 | ipc (renderer) | actualizar-bitacora-estado |
| 12133 | ipc (renderer) | abrir-ambicion |
| 12139 | ipc (renderer) | ambicion-bloqueado |
| 12437 | ipc (renderer) | listar-fuentes-pantalla |
| 12526 | ipc (renderer) | elegir-fuente-pantalla |
| 12720 | ipc (renderer) | guardar-grabacion |
| 12774 | ipc (renderer) | actualizar-modo-transmision |
| 12801 | ipc (renderer) | actualizar-modo-transmision |
| 12888 | ipc (renderer) | ambicion-resultado |
| 12904 | ipc (renderer) | abrir-log-ambicion |
| 12914 | ipc (renderer) | bitacora-actualizada |
| 12918 | ipc (renderer) | obtener-ordenes |
| 13281 | ipc (renderer) | diagnostico-placa-ia |
| 13301 | ipc (renderer) | diagnostico-placa-resultado |
| 13433 | ipc (renderer) | guardar-mi-perfil |
| 13441 | ipc (renderer) | perfil-guardado-exito |
| 13464 | ipc (renderer) | analizar-documento-ia |
| 14027 | ipc (renderer) | respuesta-analisis-ia |
| 14059 | ipc (renderer) | nuevo-producto-sql |
| 14064 | ipc (renderer) | obtener-productos |
| 14194 | ipc (renderer) | preview-excel-inventario |
| 14377 | ipc (renderer) | preview-excel-resultado |
| 14430 | ipc (renderer) | importar-excel-inventario |
| 14433 | ipc (renderer) | resultado-importacion-excel |
| 14440 | ipc (renderer) | obtener-productos |
| 14457 | ipc (renderer) | ia-laboratorio |
| 14460 | ipc (renderer) | respuesta-ia-laboratorio |
| 14479 | ipc (renderer) | busqueda-global |
| 14526 | ipc (renderer) | resultados-busqueda-global |
| 14592 | ipc (renderer) | cerrar-sesion-token |
| 14618 | ipc (renderer) | generar-resumen-financiero |
| 14621 | ipc (renderer) | respuesta-resumen-financiero |
| 14642 | ipc (renderer) | marcar-asistencia-manual |
| 14649 | ipc (renderer) | registrar-salida-manual |
| 14658 | ipc (renderer) | asistencia-respuesta |
| 14674 | ipc (renderer) | salida-respuesta |
| 14690 | ipc (renderer) | salida-respuesta |
| 14906 | ipc (renderer) | verificar-2fa |
| 14911 | ipc (renderer) | marcas-modelos-respuesta |
| 14948 | ipc (renderer) | modelos-almacen-respuesta |
| 14997 | ipc (renderer) | obtener-modelos-almacen |
| 15077 | ipc (renderer) | obtener-marcas-modelos |
| 15215 | ipc (renderer) | agregar-modelo-nuevo |
| 15221 | ipc (renderer) | proponer-modelo |
| 15320 | ipc (renderer) | agregar-subcategoria-custom |
| 15387 | ipc (renderer) | lista-grupos-compatibilidad |
| 15392 | ipc (renderer) | grupo-compatibilidad-guardado |
| 15408 | ipc (renderer) | obtener-grupos-compatibilidad |
| 15409 | ipc (renderer) | obtener-productos |
| 15421 | ipc (renderer) | obtener-grupos-compatibilidad |
| 15422 | ipc (renderer) | obtener-productos |
| 15432 | ipc (renderer) | grupo-compatibilidad-eliminado |
| 15435 | ipc (renderer) | obtener-grupos-compatibilidad |
| 15436 | ipc (renderer) | obtener-productos |
| 15442 | ipc (renderer) | producto-vinculado-a-grupo |
| 15445 | ipc (renderer) | obtener-grupos-compatibilidad |
| 15446 | ipc (renderer) | obtener-productos |
| 15603 | ipc (renderer) | actualizar-grupo-compatibilidad |
| 15605 | ipc (renderer) | crear-grupo-compatibilidad |
| 15707 | ipc (renderer) | analizar-compatibilidad-archivo |
| 15710 | ipc (renderer) | respuesta-analisis-compatibilidad |
| 15836 | ipc (renderer) | crear-grupo-compatibilidad |
| 15851 | ipc (renderer) | eliminar-grupo-compatibilidad |
| 16228 | ipc (renderer) | obtener-historial-producto |
| 16344 | ipc (renderer) | subir-foto-producto |
| 16363 | ipc (renderer) | actualizar-producto-detalle |
| 16415 | ipc (renderer) | ajustar-stock-manual |
| 16485 | ipc (renderer) | obtener-proveedores-db |
| 16489 | ipc (renderer) | proveedores-db-respuesta |
| 16562 | ipc (renderer) | guardar-proveedor-db |
| 16585 | ipc (renderer) | eliminar-proveedor-db |
| 16593 | ipc (renderer) | modelo-propuesto |
| 16608 | ipc (renderer) | obtener-panel-licencias |
| 16616 | ipc (renderer) | panel-licencias-respuesta |
| 16674 | ipc (renderer) | actualizar-licencia |
| 16683 | ipc (renderer) | actualizar-licencia |
| 16687 | ipc (renderer) | borrar-codigo-licencia |
| 16690 | ipc (renderer) | licencia-actualizada |
| 16706 | ipc (renderer) | obtener-modelos-pendientes |
| 16709 | ipc (renderer) | modelos-pendientes-respuesta |
| 16768 | ipc (renderer) | resolver-modelo |
| 16771 | ipc (renderer) | modelo-resuelto |
| 16781 | ipc (renderer) | obtener-resellers-admin |
| 16785 | ipc (renderer) | resellers-admin-respuesta |
| 16818 | ipc (renderer) | guardar-reseller-respuesta |
| 16828 | ipc (renderer) | eliminar-reseller-respuesta |
| 16880 | ipc (renderer) | guardar-reseller-admin |
| 16885 | ipc (renderer) | eliminar-reseller-admin |
| 17118 | ipc (renderer) | pedir-version |
| 17121 | ipc (renderer) | recibir-version |
| 17129 | ipc (renderer) | abrir-pagina-descarga |
| 17139 | ipc (renderer) | instalar-actualizacion-ahora |
| 17142 | ipc (renderer) | actualizacion-disponible |
| 17151 | ipc (renderer) | actualizacion-lista |
| 17161 | ipc (renderer) | actualizacion-no-disponible |


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
| 841 | seccion | 2.1 VERIFICACIÓN DE 2FA (SEGUNDO PASO DE ACCESO) |
| 938 | seccion | 3. CLIENTES (SOLO DE MI EMPRESA) |
| 1055 | seccion | MI CATÁLOGO DE MODELOS: marcas y modelos deducidos del propio almacén |
| 1150 | seccion | PORTERO 1: la forma del nombre |
| 1183 | seccion | PORTERO 2: la IA |
| 1243 | seccion | DIAGNÓSTICO DE PLACA |
| 1521 | seccion | COLA DE APROBACIÓN (solo la casa matriz) |
| 1574 | seccion | PROVEEDORES (PERSISTENCIA SEGURA EN SUPABASE + CONTROL DE FALLOS) |
| 1613 | seccion | SUBIR FOTO PRODUCTO |
| 1645 | seccion | HOLOGRAMA 3D: fotos reales de piezas por modelo de celular |
| 2072 | seccion | 4. INVENTARIO (SOLO DE MI EMPRESA) |
| 2135 | seccion | 4D. GRUPOS DE COMPATIBILIDAD DE MODELOS (micas/pantallas que comparten pieza y stock) |
| 2325 | seccion | 4A. SUBCATEGORÍAS PERSONALIZADAS (editables por el usuario, ej. tipos de Micas) |
| 2355 | seccion | 4B. IMPORTACIÓN DESDE EXCEL - PREVIEW |
| 2368 | seccion | TERCERA VÍA DE MATCHING: por grupo de compatibilidad |
| 2389 | seccion | LOGICA DE SUBCATEGORIAS PARA EXCEL |
| 2511 | seccion | 4C. IMPORTACIÓN DESDE EXCEL - EJECUTAR UPSERT ADITIVO |
| 2722 | seccion | 4D. HISTORIAL DE PRODUCTO |
| 2781 | seccion | 5. ORDENES/TALLER (SOLO DE MI EMPRESA) |
| 2843 | seccion | 6. REPORTES (SUMA SOLO EL DINERO DE MI EMPRESA) |
| 3012 | seccion | 6b. GASTOS OPERATIVOS (alquiler, sueldos, luz, etc. — migración 008) |
| 3046 | seccion | 6b-bis. DATOS PARA EXPORTAR EL REPORTE A EXCEL (formato de la plantilla del dueño) |
| 3191 | seccion | EXPORTAR INVENTARIO ACTUAL DE PRODUCTOS A EXCEL (.XLSX) |
| 3434 | seccion | 6b-ter. MÁS VENDIDOS por categoría (ventas del POS del período elegido) |
| 3536 | seccion | 6c. CIERRE DEL DÍA UNIFICADO (FASE 6 del plan finanzas — el "libro de caja") |
| 3734 | seccion | 6d. TIENDAS (sucursales) — asignación de personal por tienda |
| 3775 | seccion | 7. GESTIÓN DE USUARIOS (SOLO DE MI EMPRESA) |
| 3833 | seccion | 7.1 CAMBIAR ESTADO DE USUARIO (Activar/Desactivar) |
| 3859 | seccion | 8. ESTADO DEL PLAN (Para el Dashboard de Licencias) |
| 3897 | seccion | 9. CONFIGURACIÓN DE EMPRESA |
| 3942 | seccion | 10. GENERADOR AUTOMÁTICO DE LICENCIAS (SÓLO ADMIN) |
| 3976 | seccion | 10B. PANEL DE LICENCIAS (solo casa matriz) |
| 4020 | seccion | 11. REGISTRO SAAS CON VALIDACIÓN DE LICENCIA Y FECHA |
| 4047 | seccion | 12. MÓDULO DE FACTURACIÓN AUTOMÁTICA |
| 4128 | seccion | 13. ACTUALIZAR PERFIL DE USUARIO |
| 4150 | seccion | 14. MÓDULOS DE IA (Gemini y OpenAI) |
| 4201 | seccion | 14B. IMPORTAR GRUPOS DE COMPATIBILIDAD DESDE PDF O IMAGEN (Fase 5) |
| 4403 | seccion | 15. BÚSQUEDAS |
| 4555 | seccion | VENTA RÁPIDA DE ESCRITORIO (POS para cualquier rol) |
| 4721 | seccion | REPUESTO EXTERNO (traído de otro proveedor porque no había en stock) |
| 4796 | seccion | COBRO ADICIONAL: otra falla / trabajo extra hallado durante la reparación |
| 4866 | seccion | IMPRESIÓN DE COMPROBANTES |
| 4935 | seccion | 16. MÓDULO DE ASISTENCIA MANUAL |
| 4957 | seccion | HANDLER: Cargar historial de facturas |
| 4967 | seccion | MÓDULO DE DEVOLUCIONES (cliente devuelve un producto vendido) |
| 5110 | seccion | HANDLER: Análisis CRM (clientes inactivos) |
| 5123 | seccion | HANDLER: Buscar orden por ID (para el Laboratorio) |
| 5134 | seccion | HANDLER: Guardar bitácora y cambiar estado |
| 5168 | seccion | HANDLER: Accesorios ya agregados a una orden (para el Detalle de la orden) |
| 5181 | seccion | HANDLER: Cambiar estado de una orden |
| 5207 | seccion | PEDIDOS DE ACCESORIOS (creados por el cliente desde el tracking web) |
| 5284 | seccion | HANDLER: Listar usuarios |
| 5294 | seccion | HANDLER: Gestión de Resellers (Global, solo super admin) |
| 5369 | seccion | CIERRE |


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
| 842 | ipc (main) | verificar-2fa |
| 939 | ipc (main) | guardar-cliente |
| 953 | ipc (main) | actualizar-cliente |
| 989 | ipc (main) | obtener-clientes |
| 1004 | ipc (main) | buscar-clientes |
| 1032 | ipc (main) | sugerir-stock-modelo |
| 1410 | ipc (main) | obtener-modelos-almacen |
| 1444 | ipc (main) | proponer-modelo |
| 1528 | ipc (main) | obtener-modelos-pendientes |
| 1554 | ipc (main) | resolver-modelo |
| 1575 | ipc (main) | guardar-proveedor-db |
| 1591 | ipc (main) | obtener-proveedores-db |
| 1605 | ipc (main) | eliminar-proveedor-db |
| 1614 | ipc (main) | subir-foto-producto |
| 1673 | ipc (main) | subir-foto-pieza |
| 1738 | ipc (main) | reportar-pieza-modelo |
| 1771 | ipc (main) | estadisticas-fallas-modelo |
| 1806 | ipc (main) | historial-modelo-taller |
| 1826 | ipc (main) | renombrar-pieza-modelo |
| 1847 | ipc (main) | borrar-pieza-modelo |
| 1879 | ipc (main) | sugerencias-nombres-pieza |
| 1903 | ipc (main) | transcribir-audio-pieza |
| 1945 | ipc (main) | guardar-foto-pieza-cache |
| 1965 | ipc (main) | leer-fotos-pieza-cache-modelo |
| 1992 | ipc (main) | buscar-fotos-modelo |
| 2023 | ipc (main) | buscar-piezas-similares |
| 2046 | ipc (main) | listar-modelos-con-fotos |
| 2073 | ipc (main) | nuevo-producto-sql |
| 2105 | ipc (main) | obtener-productos |
| 2118 | ipc (main) | eliminar-producto |
| 2138 | ipc (main) | obtener-grupos-compatibilidad |
| 2179 | ipc (main) | crear-grupo-compatibilidad |
| 2240 | ipc (main) | actualizar-grupo-compatibilidad |
| 2287 | ipc (main) | eliminar-grupo-compatibilidad |
| 2303 | ipc (main) | vincular-producto-a-grupo |
| 2326 | ipc (main) | obtener-subcategorias-custom |
| 2343 | ipc (main) | agregar-subcategoria-custom |
| 2356 | ipc (main) | preview-excel-inventario |
| 2512 | ipc (main) | importar-excel-inventario |
| 2723 | ipc (main) | obtener-historial-producto |
| 2735 | ipc (main) | actualizar-producto-detalle |
| 2751 | ipc (main) | ajustar-stock-manual |
| 2782 | ipc (main) | guardar-orden |
| 2805 | ipc (main) | obtener-ordenes |
| 2819 | ipc (main) | obtener-tecnicos |
| 2829 | ipc (main) | asignar-tecnico-orden |
| 2851 | ipc (main) | obtener-datos-reporte |
| 3013 | ipc (main) | registrar-gasto |
| 3032 | ipc (main) | eliminar-gasto |
| 3161 | ipc (main) | obtener-datos-export |
| 3172 | ipc (main) | exportar-reporte-excel |
| 3193 | ipc (main) | exportar-inventario-excel |
| 3435 | ipc (main) | obtener-top-ventas |
| 3540 | ipc (main) | obtener-cierre-dia |
| 3735 | ipc (main) | obtener-tiendas |
| 3747 | ipc (main) | crear-tienda |
| 3761 | ipc (main) | asignar-tienda-usuario |
| 3776 | ipc (main) | crear-usuario-nuevo |
| 3834 | ipc (main) | cambiar-estado-usuario |
| 3860 | ipc (main) | obtener-estado-plan |
| 3898 | ipc (main) | guardar-datos-empresa |
| 3923 | ipc (main) | pedir-datos-empresa |
| 3943 | ipc (main) | crear-codigo-automatico |
| 3980 | ipc (main) | obtener-panel-licencias |
| 3991 | ipc (main) | actualizar-licencia |
| 4008 | ipc (main) | borrar-codigo-licencia |
| 4021 | ipc (main) | registrar-nuevo-cliente-saas |
| 4048 | ipc (main) | emitir-factura-saas |
| 4129 | ipc (main) | guardar-mi-perfil |
| 4151 | ipc (main) | analizar-documento-ia |
| 4211 | ipc (main) | analizar-compatibilidad-archivo |
| 4254 | ipc (main) | ia-recepcion |
| 4297 | ipc (main) | ia-laboratorio |
| 4341 | ipc (main) | generar-resumen-financiero |
| 4404 | ipc (main) | buscar-stock-tecnico |
| 4435 | ipc (main) | abrir-ambicion |
| 4547 | ipc (main) | abrir-log-ambicion |
| 4559 | ipc (main) | registrar-venta-desktop |
| 4635 | ipc (main) | usar-repuesto-lab |
| 4724 | ipc (main) | registrar-repuesto-externo |
| 4800 | ipc (main) | agregar-cobro-adicional |
| 4844 | ipc (main) | obtener-compras-externas-dia |
| 4870 | ipc (main) | imprimir-documento |
| 4920 | ipc (main) | busqueda-global |
| 4936 | ipc (main) | marcar-asistencia-manual |
| 4958 | ipc (main) | obtener-facturas |
| 4972 | ipc (main) | buscar-facturas-devolucion |
| 4994 | ipc (main) | registrar-devolucion |
| 5091 | ipc (main) | obtener-devoluciones |
| 5111 | ipc (main) | analisis-crm |
| 5124 | ipc (main) | buscar-orden-id |
| 5135 | ipc (main) | actualizar-bitacora-estado |
| 5169 | ipc (main) | obtener-accesorios-orden |
| 5182 | ipc (main) | actualizar-estado-orden |
| 5210 | ipc (main) | listar-pedidos-accesorios-pendientes |
| 5221 | ipc (main) | resolver-pedido-accesorio |
| 5285 | ipc (main) | obtener-usuarios |
| 5295 | ipc (main) | obtener-resellers-admin |
| 5310 | ipc (main) | guardar-reseller-admin |
| 5352 | ipc (main) | eliminar-reseller-admin |
| 5373 | ipc (main) | registrar-salida-manual |


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
| 1168 | funcion | validarFormatoModelo |
| 1192 | funcion | distanciaEdicion |
| 1211 | funcion | candidatosDelCatalogo |
| 1317 | funcion | verificarModeloConIA |
| 1363 | funcion | stockPorModeloDeEmpresa |
| 1387 | funcion | sincronizarUsoModelos |
| 1928 | funcion | holoCacheDir |
| 1933 | funcion | holoManifestPath |
| 1936 | funcion | holoLeerManifest |
| 1939 | funcion | holoGuardarManifest |
| 3049 | funcion | recolectarDatosExport |
| 3214 | funcion | agregarHojaInventario |
| 3314 | funcion | construirExcelReporte |
| 4421 | funcion | copiarCarpetaRecursivo |
| 5389 | funcion | registrarFeed |

