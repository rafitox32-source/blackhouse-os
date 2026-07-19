/* ============================================================================
   POS de la vendedora — lógica de la app web (se conecta a Supabase por RPC).
   No usa librerías externas: llama a las funciones pos_* vía fetch al endpoint
   /rest/v1/rpc con la ANON key. La empresa se resuelve del lado del servidor a
   partir del token, así que el cliente nunca decide de qué empresa son los datos.
   ========================================================================== */
(function () {
  "use strict";

  var CFG = window.POS_CONFIG || {};
  var MONEDA = CFG.MONEDA || "$";
  var TOKEN_KEY = "pos_token";

  // ---- Estado en memoria ----
  var sesion = null;          // { token, nombre, usuario }
  var catalogo = { stock: [], libre: [] };
  var carrito = [];           // [{ key, origen, producto_id, nombre, precio, cantidad, stock }]

  // ---- Utilidades DOM ----
  function $(id) { return document.getElementById(id); }
  function money(n) {
    var v = Number(n || 0);
    return MONEDA + v.toLocaleString("es-AR", { maximumFractionDigits: 2 });
  }
  function mostrarPantalla(id) {
    document.querySelectorAll(".pantalla").forEach(function (p) { p.classList.remove("activa"); });
    $(id).classList.add("activa");
  }
  function abrirModal(id) { $(id).classList.add("activa"); }
  function cerrarModal(id) { $(id).classList.remove("activa"); }
  var toastTimer;
  function toast(msg, tipo) {
    var t = $("toast");
    t.textContent = msg;
    t.className = "toast" + (tipo ? " " + tipo : "");
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, 2600);
  }

  // ---- Llamada RPC a Supabase ----
  function rpc(fn, args) {
    if (!CFG.SUPABASE_URL || !CFG.SUPABASE_ANON_KEY || CFG.SUPABASE_ANON_KEY.indexOf("PEGA_AQUI") === 0) {
      return Promise.reject(new Error("Falta configurar SUPABASE_ANON_KEY en config.js"));
    }
    return fetch(CFG.SUPABASE_URL + "/rest/v1/rpc/" + fn, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": CFG.SUPABASE_ANON_KEY,
        "Authorization": "Bearer " + CFG.SUPABASE_ANON_KEY
      },
      body: JSON.stringify(args || {})
    }).then(function (r) {
      return r.json().then(function (data) {
        if (!r.ok) {
          throw new Error((data && (data.message || data.hint)) || ("Error " + r.status));
        }
        return data; // las funciones devuelven un objeto json { ok, ... }
      });
    });
  }

  // ==========================================================================
  //  LOGIN
  // ==========================================================================
  function iniciarSesion(usuario, password) {
    return rpc("pos_login", { p_usuario: usuario, p_password: password }).then(function (res) {
      if (!res || !res.ok) { throw new Error((res && res.msg) || "No se pudo entrar"); }
      sesion = { token: res.token, nombre: res.nombre, usuario: res.usuario };
      try { localStorage.setItem(TOKEN_KEY, JSON.stringify(sesion)); } catch (e) {}
      return sesion;
    });
  }

  function cerrarSesion() {
    sesion = null;
    carrito = [];
    try { localStorage.removeItem(TOKEN_KEY); } catch (e) {}
    mostrarPantalla("pantalla-login");
  }

  // ==========================================================================
  //  CATÁLOGO
  // ==========================================================================
  function cargarProductos() {
    return rpc("pos_productos", { p_token: sesion.token }).then(function (res) {
      if (!res || !res.ok) {
        if (res && /sesi/i.test(res.msg || "")) { cerrarSesion(); }
        throw new Error((res && res.msg) || "No se pudo cargar el catálogo");
      }
      catalogo.stock = res.stock || [];
      catalogo.libre = res.libre || [];
      renderProductos();
    });
  }

  function renderProductos() {
    var q = ($("in-buscar").value || "").trim().toLowerCase();
    var cont = $("lista-productos");
    var html = "";

    var libres = catalogo.libre.filter(function (p) { return !q || p.nombre.toLowerCase().indexOf(q) >= 0; });
    var stock = catalogo.stock.filter(function (p) { return !q || p.nombre.toLowerCase().indexOf(q) >= 0; });

    libres.forEach(function (p) {
      html += '<div class="prod libre" data-tipo="libre" data-id="' + p.id + '">' +
                '<div class="nombre">' + esc(p.nombre) + ' <span class="badge">sin stock</span></div>' +
                '<div class="meta"><span class="precio">' + money(p.precio) + '</span>' +
                '<span class="stock">libre</span></div>' +
              '</div>';
    });

    stock.forEach(function (p) {
      var agotado = Number(p.stock) <= 0;
      html += '<div class="prod" data-tipo="stock" data-id="' + p.id + '">' +
                '<div class="nombre">' + esc(p.nombre) + '</div>' +
                '<div class="meta"><span class="precio">' + money(p.precio) + '</span>' +
                '<span class="stock' + (agotado ? " agotado" : "") + '">' +
                  (agotado ? "sin stock" : ("stock: " + fmtStock(p.stock))) + '</span></div>' +
              '</div>';
    });

    if (!html) {
      html = '<div class="vacio">No hay productos que coincidan.<br>Usa <b>“+ No tengo en stock”</b> para vender algo nuevo.</div>';
    }
    cont.innerHTML = html;
  }

  function fmtStock(n) { var v = Number(n); return (v % 1 === 0) ? String(v) : v.toFixed(2); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]; }); }

  // ==========================================================================
  //  CARRITO
  // ==========================================================================
  function agregarAlCarrito(item) {
    // item: { origen, producto_id, nombre, precio, stock? }
    var key = item.origen + ":" + (item.producto_id != null ? item.producto_id : item.nombre.toLowerCase());
    var existente = carrito.find(function (c) { return c.key === key; });
    if (existente) {
      existente.cantidad += 1;
    } else {
      carrito.push({
        key: key, origen: item.origen, producto_id: item.producto_id,
        nombre: item.nombre, precio: Number(item.precio) || 0,
        cantidad: 1, stock: item.stock
      });
    }
    renderCarrito();
    toast(item.nombre + " agregado", "exito");
  }

  function cambiarCantidad(key, delta) {
    var it = carrito.find(function (c) { return c.key === key; });
    if (!it) return;
    it.cantidad += delta;
    if (it.cantidad <= 0) { carrito = carrito.filter(function (c) { return c.key !== key; }); }
    renderCarrito();
  }

  function totalCarrito() {
    return carrito.reduce(function (s, c) { return s + c.precio * c.cantidad; }, 0);
  }
  function cantidadCarrito() {
    return carrito.reduce(function (s, c) { return s + c.cantidad; }, 0);
  }

  function renderCarrito() {
    var barra = $("carrito-barra");
    var n = cantidadCarrito();
    barra.hidden = n === 0;
    $("carrito-count").textContent = n;
    $("carrito-total").textContent = money(totalCarrito());
    $("panel-total").textContent = money(totalCarrito());

    var cont = $("carrito-items");
    if (!carrito.length) { cont.innerHTML = '<div class="vacio">La venta está vacía.</div>'; return; }
    cont.innerHTML = carrito.map(function (c) {
      return '<div class="citem ' + (c.origen === "libre" ? "libre" : "") + '">' +
               '<div class="cinfo"><div class="cnombre">' + esc(c.nombre) + '</div>' +
               '<div class="cprecio">' + money(c.precio) + ' c/u</div></div>' +
               '<div class="qty">' +
                 '<button data-menos="' + c.key + '">−</button>' +
                 '<span>' + c.cantidad + '</span>' +
                 '<button data-mas="' + c.key + '">+</button>' +
               '</div>' +
               '<div class="csub">' + money(c.precio * c.cantidad) + '</div>' +
             '</div>';
    }).join("");
  }

  function cobrar() {
    if (!carrito.length) { toast("La venta está vacía", "error"); return; }
    var btn = $("btn-cobrar");
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Cobrando…';

    var items = carrito.map(function (c) {
      return {
        origen: c.origen,
        producto_id: c.producto_id != null ? c.producto_id : null,
        nombre: c.nombre,
        precio_unitario: c.precio,
        cantidad: c.cantidad
      };
    });

    rpc("pos_registrar_venta", {
      p_token: sesion.token,
      p_items: items,
      p_medio_pago: $("sel-pago").value
    }).then(function (res) {
      if (!res || !res.ok) {
        if (res && /sesi/i.test(res.msg || "")) { cerrarSesion(); }
        throw new Error((res && res.msg) || "No se pudo registrar la venta");
      }
      carrito = [];
      renderCarrito();
      cerrarModal("panel-carrito");
      toast("✅ Venta registrada: " + money(res.total), "exito");
      cargarProductos(); // refresca stock descontado
    }).catch(function (e) {
      toast(e.message || "Error al cobrar", "error");
    }).then(function () {
      btn.disabled = false;
      btn.textContent = "Cobrar";
    });
  }

  // ==========================================================================
  //  CIERRE DE CAJA (reporte unificado: ventas de la vendedora + servicio técnico)
  //  Cada uno mantiene su cuenta por separado, pero la vendedora entrega UN solo
  //  reporte al dueño con las dos secciones y el gran total del día.
  // ==========================================================================
  var ultimoCierre = null;   // respuesta de pos_cierre_completo
  var cajaCerrada = false;    // true cuando ya se registró el cierre del POS

  function verCierre() {
    abrirModal("modal-cierre");
    cajaCerrada = false;
    $("cierre-cuerpo").innerHTML = '<p class="cargando">Calculando…</p>';
    rpc("pos_cierre_completo", { p_token: sesion.token }).then(function (res) {
      if (!res || !res.ok) {
        if (res && /sesi/i.test(res.msg || "")) { cerrarSesion(); }
        throw new Error((res && res.msg) || "No se pudo calcular el cierre");
      }
      ultimoCierre = res;
      renderCierre(res, false);
    }).catch(function (e) {
      $("cierre-cuerpo").innerHTML = '<p class="error">' + esc(e.message) + '</p>';
    });
  }

  function renderCierre(res, cerrado) {
    var v = res.ventas || { total: 0, cantidad: 0, efectivo: 0, otros: 0, detalle: [] };
    var s = res.servicio || { total: 0, cantidad: 0, adelantos: 0, saldos: 0, efectivo: 0, otros: 0, detalle: [] };

    // --- Sección VENTAS (accesorios de la vendedora) ---
    var filasV = (v.detalle || []).map(function (d) {
      var chip = d.origen === "libre" ? ' <span class="chip-libre">sin stock</span>' : "";
      return '<div class="dfila"><span class="dn">' + esc(d.nombre) + chip +
             '</span><span class="dc">x' + fmtStock(d.cantidad) + '</span><span class="v">' +
             money(d.subtotal) + '</span></div>';
    }).join("");

    // --- Sección SERVICIO TÉCNICO (reparaciones cobradas hoy, con costo y ganancia) ---
    var filasS = (s.detalle || []).map(function (d) {
      var quien = esc((d.cliente || "—") + (d.modelo ? " · " + d.modelo : ""));
      return '<div class="dfila serv"><span class="dn">' + quien + '</span>' +
             '<span class="v">' + money(d.cobrado_hoy) + '</span>' +
             '<span class="dsub">costo ' + money(d.costo) + ' · gana ' + money(d.ganancia) + '</span></div>';
    }).join("");

    $("cierre-cuerpo").innerHTML =
      '<div class="cierre-total-grande"><span class="n">' + money(res.total_dia) + '</span>' +
      '<span class="l">Total del día · ' + esc(res.fecha) + (cerrado ? " · CAJA CERRADA" : "") + '</span></div>' +
      '<div class="cierre-fila"><span>Efectivo (todo)</span><span class="v">' + money(res.total_efectivo) + '</span></div>' +
      '<div class="cierre-fila"><span>Otros medios (todo)</span><span class="v">' + money(res.total_otros) + '</span></div>' +

      '<div class="cierre-seccion"><h3>🛒 Ventas de la vendedora</h3>' +
        '<div class="cierre-fila destacada"><span>Total ventas (' + v.cantidad + ')</span><span class="v">' + money(v.total) + '</span></div>' +
        '<div class="cierre-fila sub"><span>Efectivo</span><span class="v">' + money(v.efectivo) + '</span></div>' +
        '<div class="cierre-fila sub"><span>Otros medios</span><span class="v">' + money(v.otros) + '</span></div>' +
        '<div class="cierre-detalle">' +
          (filasV || '<div class="dfila"><span class="dn">Sin ventas hoy</span></div>') + '</div>' +
      '</div>' +

      '<div class="cierre-seccion"><h3>🔧 Servicio técnico</h3>' +
        '<div class="cierre-fila destacada"><span>Total cobrado (' + s.cantidad + ')</span><span class="v">' + money(s.total) + '</span></div>' +
        '<div class="cierre-fila sub"><span>Adelantos de hoy</span><span class="v">' + money(s.adelantos) + '</span></div>' +
        '<div class="cierre-fila sub"><span>Saldos entregados hoy</span><span class="v">' + money(s.saldos) + '</span></div>' +
        '<div class="cierre-fila sub"><span>Efectivo</span><span class="v">' + money(s.efectivo) + '</span></div>' +
        '<div class="cierre-fila sub"><span>Otros medios</span><span class="v">' + money(s.otros) + '</span></div>' +
        '<div class="cierre-detalle">' +
          (filasS || '<div class="dfila"><span class="dn">Sin reparaciones cobradas hoy</span></div>') + '</div>' +
      '</div>';

    $("btn-confirmar-cierre").style.display = cerrado ? "none" : "";
    $("btn-confirmar-cierre").textContent = "Cerrar caja del día";
  }

  function confirmarCierre() {
    var btn = $("btn-confirmar-cierre");
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Cerrando…';
    // Registra el cierre del POS (ventas de la vendedora). El servicio técnico no se
    // "cierra" aquí: se cobra/entrega desde el escritorio; aquí sólo se reporta.
    rpc("pos_cierre_caja", { p_token: sesion.token, p_registrar: true }).then(function (resPos) {
      if (!resPos || !resPos.ok) { throw new Error((resPos && resPos.msg) || "No se pudo cerrar"); }
      cajaCerrada = true;
      toast("Caja cerrada: ventas " + money(resPos.total_ventas), "exito");
      // Volvemos a pedir el reporte completo para mostrarlo ya marcado como cerrado.
      return rpc("pos_cierre_completo", { p_token: sesion.token });
    }).then(function (res) {
      if (res && res.ok) { ultimoCierre = res; renderCierre(res, true); }
    }).catch(function (e) {
      toast(e.message || "Error al cerrar", "error");
    }).then(function () {
      btn.disabled = false;
      btn.textContent = "Cerrar caja del día";
    });
  }

  function compartirCierre() {
    if (!ultimoCierre) return;
    var r = ultimoCierre;
    var v = r.ventas || {}, s = r.servicio || {};
    var txt = "CIERRE DEL DÍA — " + r.fecha + (cajaCerrada ? " (CAJA CERRADA)" : "") + "\n" +
      "TOTAL DEL DÍA: " + money(r.total_dia) + "\n" +
      "  Efectivo: " + money(r.total_efectivo) + "  |  Otros: " + money(r.total_otros) + "\n" +
      "\n🛒 VENTAS DE LA VENDEDORA: " + money(v.total) + " (" + (v.cantidad || 0) + ")\n" +
      (v.detalle || []).map(function (d) {
        return "  · " + d.nombre + " x" + fmtStock(d.cantidad) + " = " + money(d.subtotal);
      }).join("\n") +
      "\n\n🔧 SERVICIO TÉCNICO: " + money(s.total) + " (" + (s.cantidad || 0) + ")\n" +
      "  Adelantos: " + money(s.adelantos) + "  |  Saldos: " + money(s.saldos) + "\n" +
      (s.detalle || []).map(function (d) {
        return "  · " + (d.cliente || "—") + (d.modelo ? " (" + d.modelo + ")" : "") +
               " = " + money(d.cobrado_hoy) + "  [costo " + money(d.costo) + ", gana " + money(d.ganancia) + "]";
      }).join("\n");
    if (navigator.share) {
      navigator.share({ title: "Cierre del día", text: txt }).catch(function () {});
    } else {
      try { navigator.clipboard.writeText(txt); toast("Copiado al portapapeles", "exito"); }
      catch (e) { window.print(); }
    }
  }

  // ==========================================================================
  //  EVENTOS
  // ==========================================================================
  function conectarEventos() {
    // Login
    $("form-login").addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = $("btn-login"), err = $("login-error");
      err.hidden = true;
      btn.disabled = true; btn.innerHTML = '<span class="spinner"></span> Entrando…';
      iniciarSesion($("in-usuario").value.trim(), $("in-password").value)
        .then(entrarAlPos)
        .catch(function (e2) { err.textContent = e2.message; err.hidden = false; })
        .then(function () { btn.disabled = false; btn.textContent = "Entrar"; });
    });

    $("btn-salir").addEventListener("click", function () {
      if (confirm("¿Cerrar sesión?")) cerrarSesion();
    });

    // Buscar
    $("in-buscar").addEventListener("input", renderProductos);

    // Tap en producto
    $("lista-productos").addEventListener("click", function (e) {
      var el = e.target.closest(".prod");
      if (!el) return;
      var id = el.getAttribute("data-id");
      if (el.getAttribute("data-tipo") === "libre") {
        var pl = catalogo.libre.find(function (p) { return String(p.id) === id; });
        if (pl) agregarAlCarrito({ origen: "libre", producto_id: pl.id, nombre: pl.nombre, precio: pl.precio });
      } else {
        var ps = catalogo.stock.find(function (p) { return String(p.id) === id; });
        if (ps) agregarAlCarrito({ origen: "stock", producto_id: ps.id, nombre: ps.nombre, precio: ps.precio, stock: ps.stock });
      }
    });

    // Producto libre nuevo
    $("btn-nuevo-libre").addEventListener("click", function () {
      $("libre-nombre").value = ""; $("libre-precio").value = "";
      abrirModal("modal-libre");
      setTimeout(function () { $("libre-nombre").focus(); }, 150);
    });
    $("form-libre").addEventListener("submit", function (e) {
      e.preventDefault();
      var nombre = $("libre-nombre").value.trim();
      var precio = parseFloat($("libre-precio").value);
      if (!nombre || isNaN(precio)) { toast("Completa nombre y precio", "error"); return; }
      agregarAlCarrito({ origen: "libre", producto_id: null, nombre: nombre, precio: precio });
      cerrarModal("modal-libre");
    });

    // Carrito
    $("btn-ver-carrito").addEventListener("click", function () { renderCarrito(); abrirModal("panel-carrito"); });
    $("carrito-items").addEventListener("click", function (e) {
      var mas = e.target.getAttribute("data-mas");
      var menos = e.target.getAttribute("data-menos");
      if (mas) cambiarCantidad(mas, +1);
      if (menos) cambiarCantidad(menos, -1);
    });
    $("btn-vaciar").addEventListener("click", function () {
      if (carrito.length && confirm("¿Vaciar la venta?")) { carrito = []; renderCarrito(); cerrarModal("panel-carrito"); }
    });
    $("btn-cobrar").addEventListener("click", cobrar);

    // Cierre de caja
    $("btn-cierre").addEventListener("click", verCierre);
    $("btn-confirmar-cierre").addEventListener("click", function () {
      if (confirm("¿Cerrar la caja del día? Esto guarda el total y marca las ventas como cerradas.")) confirmarCierre();
    });
    $("btn-imprimir-cierre").addEventListener("click", compartirCierre);

    // Botones cerrar de todos los modales
    document.querySelectorAll("[data-cerrar]").forEach(function (b) {
      b.addEventListener("click", function () { cerrarModal(b.getAttribute("data-cerrar")); });
    });
    // Tocar el fondo del modal para cerrar
    document.querySelectorAll(".modal").forEach(function (m) {
      m.addEventListener("click", function (e) { if (e.target === m) cerrarModal(m.id); });
    });
  }

  function entrarAlPos() {
    $("lbl-nombre").textContent = sesion.nombre || sesion.usuario;
    mostrarPantalla("pantalla-pos");
    renderCarrito();
    cargarProductos().catch(function (e) { toast(e.message, "error"); });
  }

  // ==========================================================================
  //  ARRANQUE
  // ==========================================================================
  function init() {
    conectarEventos();
    // Sesión recordada
    try {
      var guardada = JSON.parse(localStorage.getItem(TOKEN_KEY) || "null");
      if (guardada && guardada.token) {
        sesion = guardada;
        // Validamos el token cargando productos; si falla, vuelve al login.
        entrarAlPos();
        return;
      }
    } catch (e) {}
    mostrarPantalla("pantalla-login");
  }

  // Registrar service worker (PWA) — opcional, no bloquea si falla.
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").catch(function () {});
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
