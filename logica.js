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

  this.fecha = (function () {
    var hoy = new Date();
    var dia = String(hoy.getDate()).padStart(2, "0");
    var mes = String(hoy.getMonth() + 1).padStart(2, "0");
    var anio = hoy.getFullYear();
    return dia + "/" + mes + "/" + anio;
  })();
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
