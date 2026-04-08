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
