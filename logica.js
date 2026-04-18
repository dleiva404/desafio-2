// ── UTILIDADES DE FECHA ──────────────────────────────────────

function obtenerFechaActual() {
  var hoy = new Date();
  var dia = String(hoy.getDate()).padStart(2, "0");
  var mes = String(hoy.getMonth() + 1).padStart(2, "0");
  var anio = hoy.getFullYear();

  return dia + "/" + mes + "/" + anio;
}

// ACTUALIZACIÓN DEL DOM 

function formatearMonto(monto) {
  return Number(monto).toFixed(2);
}

function crearItemTransaccion(transaccion) {
  // Construye cada fila de la lista según el tipo de transacción.
  var elemento = document.createElement("li");
  elemento.className = "item-real item-" + transaccion.tipo;

  var descripcion = document.createElement("span");
  descripcion.className = "item-descripcion";
  descripcion.textContent =
    transaccion.descripcion + " (" + transaccion.fecha + ")";

  var detalle = document.createElement("div");
  detalle.className = "item-detalle";

  var monto = document.createElement("span");
  monto.className = "item-monto";

  if (transaccion instanceof Ingreso) {
    monto.textContent = "+ " + formatearMonto(transaccion.monto);
    detalle.appendChild(monto);
  } else {
    // Los egresos muestran además su porcentaje respecto al total de ingresos.
    var porcentaje = document.createElement("span");
    porcentaje.className = "porcentaje-badge";
    porcentaje.textContent =
      calcularPorcentajeEgresoIndividual(transaccion).toFixed(2) + "%";

    monto.textContent = "- " + formatearMonto(transaccion.monto);
    detalle.appendChild(monto);
    detalle.appendChild(porcentaje);
  }

  elemento.appendChild(descripcion);
  elemento.appendChild(detalle);
  return elemento;
}

function renderizarListaTransacciones(idLista, tipo, mensajeVacio) {
  // Reemplaza el contenido de la lista con los datos actuales del arreglo global.
  var lista = document.getElementById(idLista);
  if (!lista) {
    return;
  }

  lista.innerHTML = "";

  var items = [];
  for (var i = 0; i < transacciones.length; i++) {
    if (transacciones[i].tipo === tipo) {
      items.push(transacciones[i]);
    }
  }

  if (items.length === 0) {
    var itemVacio = document.createElement("li");
    itemVacio.className = "item-vacio";
    itemVacio.textContent = mensajeVacio;
    lista.appendChild(itemVacio);
    return;
  }

  for (var j = 0; j < items.length; j++) {
    lista.appendChild(crearItemTransaccion(items[j]));
  }
}

function actualizarElementosDOM() {
  // Sincroniza encabezado, tarjetas resumen y listas con el estado actual.
  var titulo = document.getElementById("titulo-presupuesto");
  var montoDisponible = document.getElementById("monto-disponible");
  var totalIngresos = document.getElementById("total-ingresos");
  var totalEgresos = document.getElementById("total-egresos");
  var porcentajeTotal = document.getElementById("porcentaje-total");

  var presupuesto = calcularPresupuesto();
  var ingresos = calcularTotalIngresos();
  var egresos = calcularTotalEgresos();
  var porcentaje = calcularPorcentajeGastoGeneral();

  if (titulo) {
    titulo.textContent = obtenerMesAnio();
  }

  if (montoDisponible) {
    montoDisponible.textContent = "$ " + formatearMonto(presupuesto);
  }

  if (totalIngresos) {
    totalIngresos.textContent = "+ " + formatearMonto(ingresos);
  }

  if (totalEgresos) {
    totalEgresos.textContent = "- " + formatearMonto(egresos);
  }

  if (porcentajeTotal) {
    porcentajeTotal.textContent = porcentaje.toFixed(2) + "%";
  }

  renderizarListaTransacciones(
    "lista-ingresos",
    "ingreso",
    "No hay registros de ingresos...",
  );
  renderizarListaTransacciones(
    "lista-egresos",
    "egreso",
    "No hay registros de egresos...",
  );
}

// ── CLASE BASE: Transaccion ──────────────────────────────────

function Transaccion(descripcion, monto) {
  if (typeof descripcion !== "string" || descripcion.trim() === "") {
    throw new Error("La descripción no puede estar vacía.");
  }

  var montoNum = parseFloat(monto);
  if (isNaN(montoNum)) {
    throw new Error("El monto ingresado no es un número válido.");
  }
  if (montoNum <= 0) {
    throw new Error("El monto debe ser mayor que cero.");
  }

  this.descripcion = descripcion.trim();
  this.monto = montoNum;
  this.tipo = "transaccion";

  this.fecha = obtenerFechaActual();
}
Transaccion.prototype.toString = function () {
  return (
    "[" +
    this.tipo.toUpperCase() +
    "] " +
    this.descripcion +
    ": $" +
    this.monto.toFixed(2) +
    " (" +
    this.fecha +
    ")"
  );
};

// ── SUBCLASE: Ingreso ────────────────────────────────────────

function Ingreso(descripcion, monto) {
  Transaccion.call(this, descripcion, monto);
  this.tipo = "ingreso";
}

Ingreso.prototype = Object.create(Transaccion.prototype);
Ingreso.prototype.constructor = Ingreso;

// ── SUBCLASE: Egreso ─────────────────────────────────────────

function Egreso(descripcion, monto) {
  Transaccion.call(this, descripcion, monto);
  this.tipo = "egreso";
}

Egreso.prototype = Object.create(Transaccion.prototype);
Egreso.prototype.constructor = Egreso;

// ── ARRAY GLOBAL DE TRANSACCIONES ───────────────────────────

var transacciones = [];
// ── FUNCIONES DE CÁLCULO ─────────────────────────────────────

function obtenerMesAnio() {
  var meses = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];
  var hoy = new Date();
  var mes = meses[hoy.getMonth()];
  var anio = hoy.getFullYear();
  return "Presupuesto de " + mes + " " + anio;
}

function calcularTotalIngresos() {
  var total = 0;
  for (var i = 0; i < transacciones.length; i++) {
    if (transacciones[i] instanceof Ingreso) {
      total += transacciones[i].monto;
    }
  }
  return parseFloat(total.toFixed(2));
}

function calcularTotalEgresos() {
  var total = 0;
  for (var i = 0; i < transacciones.length; i++) {
    if (transacciones[i] instanceof Egreso) {
      total += transacciones[i].monto;
    }
  }
  return parseFloat(total.toFixed(2));
}

function calcularPresupuesto() {
  var resultado = calcularTotalIngresos() - calcularTotalEgresos();
  return parseFloat(resultado.toFixed(2));
}

function calcularPorcentajeGastoGeneral() {
  var totalIngresos = calcularTotalIngresos();
  if (totalIngresos === 0) {
    return parseFloat((0).toFixed(2));
  }
  var porcentaje = (calcularTotalEgresos() * 100) / totalIngresos;
  return parseFloat(porcentaje.toFixed(2));
}

function calcularPorcentajeEgresoIndividual(egreso) {
  if (!(egreso instanceof Egreso)) {
    console.error(
      "calcularPorcentajeEgresoIndividual: el parámetro debe ser una instancia de Egreso.",
    );
    return parseFloat((0).toFixed(2));
  }
  var totalIngresos = calcularTotalIngresos();
  if (totalIngresos === 0) {
    return parseFloat((0).toFixed(2));
  }
  var porcentaje = (egreso.monto * 100) / totalIngresos;
  return parseFloat(porcentaje.toFixed(2));
}
// ── VALIDACIONES ──────────────────────────────────

function validarCamposTransaccion(tipo, descripcion, monto) {
  if (tipo !== "ingreso" && tipo !== "egreso") {
    return {
      valido: false,
      mensaje: "Debe seleccionar un tipo de transacción: Ingreso o Egreso.",
    };
  }
  if (typeof descripcion !== "string" || descripcion.trim() === "") {
    return { valido: false, mensaje: "La descripción no puede estar vacía." };
  }
  var montoNum = parseFloat(monto);
  if (isNaN(montoNum)) {
    return {
      valido: false,
      mensaje:
        "El monto debe ser un número válido. No se permiten letras ni símbolos.",
    };
  }
  if (montoNum <= 0) {
    return { valido: false, mensaje: "El monto debe ser mayor que cero." };
  }
  return { valido: true, mensaje: "" };
}
