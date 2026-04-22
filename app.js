// Controla cual pestaña esta activa y que panel se muestra en pantalla.
function activarTab(tabSeleccionada, configuracionTabs) {
  for (var i = 0; i < configuracionTabs.length; i++) {
    var tab = configuracionTabs[i];
    var estaActiva = tab.radio.id === tabSeleccionada;

    tab.radio.checked = estaActiva;
    tab.label.setAttribute("aria-selected", estaActiva ? "true" : "false");
    tab.pane.hidden = !estaActiva;
  }
}

// Configura el sistema de pestañas y enlaza radios, etiquetas y paneles.
function inicializarTabs() {
  var configuracionTabs = [
    {
      radio: document.getElementById("tab1-radio"),
      label: document.querySelector('label[for="tab1-radio"]'),
      pane: document.getElementById("contenido-ingresos"),
    },
    {
      radio: document.getElementById("tab2-radio"),
      label: document.querySelector('label[for="tab2-radio"]'),
      pane: document.getElementById("contenido-egresos"),
    },
  ];

  for (var i = 0; i < configuracionTabs.length; i++) {
    if (
      !configuracionTabs[i].radio ||
      !configuracionTabs[i].label ||
      !configuracionTabs[i].pane
    ) {
      return;
    }
  }

  for (var j = 0; j < configuracionTabs.length; j++) {
    (function (tab) {
      tab.label.setAttribute("role", "tab");
      tab.pane.setAttribute("role", "tabpanel");

      tab.label.addEventListener("click", function () {
        activarTab(tab.radio.id, configuracionTabs);
      });

      tab.radio.addEventListener("change", function () {
        if (tab.radio.checked) {
          activarTab(tab.radio.id, configuracionTabs);
        }
      });
    })(configuracionTabs[j]);
  }

  var tabInicial = configuracionTabs[0].radio.checked
    ? configuracionTabs[0].radio.id
    : configuracionTabs[1].radio.id;

  activarTab(tabInicial, configuracionTabs);
}

// Punto de entrada principal: espera a que el DOM este listo para trabajar con la interfaz.
document.addEventListener("DOMContentLoaded", function () {
  inicializarTabs();

  if (typeof actualizarElementosDOM === "function") {
    actualizarElementosDOM();
  }

  // Referencias a los controles del formulario usados en el flujo principal.
  var campoTipoTransaccion = document.getElementById("tipo-transaccion");
  var campoDescripcion = document.getElementById("descripcion");
  var campoMonto = document.getElementById("monto");
  var botonAgregar = document.getElementById("btn-agregar");

  if (
    !campoTipoTransaccion ||
    !campoDescripcion ||
    !campoMonto ||
    !botonAgregar
  ) {
    return;
  }

  function limpiarFormulario() {
    campoTipoTransaccion.value = "ingreso";
    campoDescripcion.value = "";
    campoMonto.value = "";
    campoDescripcion.focus();
  }

  // Flujo principal del sistema al presionar el boton de agregar.
  botonAgregar.addEventListener("click", function () {
    // Captura de datos desde la interfaz.
    var tipoTransaccion = campoTipoTransaccion.value;
    var descripcionTransaccion = campoDescripcion.value.trim();
    var montoTransaccion = campoMonto.value.trim();

    // Validacion antes de crear el objeto de negocio.
    var resultadoValidacion = validarCamposTransaccion(
      tipoTransaccion,
      descripcionTransaccion,
      montoTransaccion
    );

    if (!resultadoValidacion.valido) {
      alert(resultadoValidacion.mensaje);
      return;
    }

    var nuevaTransaccion;

    // Se crea una instancia de Ingreso o Egreso segun el tipo seleccionado.
    if (tipoTransaccion === "ingreso") {
      nuevaTransaccion = new Ingreso(descripcionTransaccion, montoTransaccion);
    } else {
      nuevaTransaccion = new Egreso(descripcionTransaccion, montoTransaccion);
    }

    // Persistencia temporal en memoria dentro del arreglo global transacciones.
    transacciones.push(nuevaTransaccion);

    // Se recalcula y redibuja la interfaz completa a partir del nuevo estado.
    actualizarElementosDOM();

    limpiarFormulario();
  });
});
