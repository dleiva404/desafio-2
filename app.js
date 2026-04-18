function activarTab(tabSeleccionada, configuracionTabs) {
  // Activa una pestaña y oculta el panel de la otra.
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

      // Permite cambiar de panel tanto por clic como por cambio del radio.
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

document.addEventListener("DOMContentLoaded", function () {
  // Inicializa la interfaz apenas el HTML ya está disponible.
  inicializarTabs();

  if (typeof actualizarElementosDOM === "function") {
    actualizarElementosDOM();
  }
});
