function activarTab(tabSeleccionada, configuracionTabs) {
  // Cambia la pestaña activa y muestra el panel correspondiente.
  for (var i = 0; i < configuracionTabs.length; i++) {
    var tab = configuracionTabs[i];
    var estaActiva = tab.radio.id === tabSeleccionada;

    tab.radio.checked = estaActiva;
    tab.label.setAttribute("aria-selected", estaActiva ? "true" : "false");
    tab.pane.hidden = !estaActiva;
  }
}

function inicializarTabs() {
  // Relaciona cada radio con su etiqueta y su panel visible.
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

  // Verifica que todos los elementos necesarios existan.
  for (var i = 0; i < configuracionTabs.length; i++) {
    if (
      !configuracionTabs[i].radio ||
      !configuracionTabs[i].label ||
      !configuracionTabs[i].pane
    ) {
      return;
    }
  }

  // Asigna eventos para cambiar de pestaña.
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

  // Activa la pestaña inicial.
  var tabInicial = configuracionTabs[0].radio.checked
    ? configuracionTabs[0].radio.id
    : configuracionTabs[1].radio.id;

  activarTab(tabInicial, configuracionTabs);
}

document.addEventListener("DOMContentLoaded", function () {
  // Inicializa la interfaz cuando el DOM está completamente cargado.
  inicializarTabs();

  // Actualiza los elementos visuales si la función existe.
  if (typeof actualizarElementosDOM === "function") {
    actualizarElementosDOM();
  }

  // Referencias a los campos del formulario.
  var campoTipoTransaccion = document.getElementById("tipo-transaccion");
  var campoDescripcion = document.getElementById("descripcion");
  var campoMonto = document.getElementById("monto");
  var botonAgregar = document.getElementById("btn-agregar");

  // Validación de existencia de los elementos del DOM.
  if (
    !campoTipoTransaccion ||
    !campoDescripcion ||
    !campoMonto ||
    !botonAgregar
  ) {
    return;
  }

  function limpiarFormulario() {
    // Limpia los campos después de registrar una transacción.
    campoTipoTransaccion.value = "ingreso";
    campoDescripcion.value = "";
    campoMonto.value = "";
    campoDescripcion.focus();
  }

  botonAgregar.addEventListener("click", function () {
    // Obtiene los valores ingresados por el usuario.
    var tipoTransaccion = campoTipoTransaccion.value;
    var descripcionTransaccion = campoDescripcion.value.trim();
    var montoTransaccion = campoMonto.value.trim();

    // Valida los datos ingresados antes de procesarlos.
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

    // Crea una nueva instancia según el tipo seleccionado.
    if (tipoTransaccion === "ingreso") {
      nuevaTransaccion = new Ingreso(descripcionTransaccion, montoTransaccion);
    } else {
      nuevaTransaccion = new Egreso(descripcionTransaccion, montoTransaccion);
    }

    // Agrega la transacción al arreglo global del sistema.
    transacciones.push(nuevaTransaccion);

    // Actualiza la interfaz con los nuevos datos.
    actualizarElementosDOM();

    // Limpia el formulario después del registro exitoso.
    limpiarFormulario();
  });
});