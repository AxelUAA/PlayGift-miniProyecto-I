// ===============================
// Estado global
// ===============================

let state = loadFromLS() || getInitialState();
let currentStep = 0;

// ===============================
// Navegación entre secciones
// ===============================

function goTo(step) {
  // Ocultar todas las secciones
  document.querySelectorAll(".section").forEach(sec => {
    sec.classList.remove("active");
  });

  // Mostrar la sección actual
  if (step === 0) {
    document.getElementById("splash").classList.add("active");
  } else {
    document.getElementById("step" + step).classList.add("active");
  }

  currentStep = step;
}

// ===============================
// PASO 1 – Guardar organizador
// ===============================

function saveStep1() {
  const nombre = document.getElementById("inputOrganizador").value.trim();
  const incluir = document.getElementById("checkIncluir").checked;

  if (!nombre) {
    Swal.fire({
  icon: 'warning',
  title: 'Oops...',
  text: 'Ingresa tu nombre jugador ',
  confirmButtonColor: '#00fff5'
});
    return;
  }

  state.organizador = nombre;
  state.incluyeOrganizador = incluir;

  if (incluir && !state.participantes.includes(nombre)) {
    state.participantes.push(nombre);
  }

  saveToLS(state);
  goTo(2);
}

function addPlayer() {
  const input = document.getElementById("inputJugador");
  const nombre = input.value.trim();

  if (!nombre) return;

  if (state.participantes.includes(nombre)) {
    alert("Ese jugador ya existe 🚫");
    return;
  }

  state.participantes.push(nombre);
  input.value = "";

  saveToLS(state);
  renderPlayers();
}

function renderPlayers() {
  const container = document.getElementById("playerList");
  container.innerHTML = "";

  state.participantes.forEach((p, index) => {
    const div = document.createElement("div");

    div.className =
      "arcade-panel p-2 flex justify-between items-center cursor-move";
    
    div.draggable = true;
    div.dataset.index = index;

    div.innerHTML = `
      <span>${p}</span>
      <button onclick="removePlayer(${index})">❌</button>
    `;

    container.appendChild(div);
  });

  addDragEvents();
}

//logica de drag and drop 

let draggedIndex = null;

function addDragEvents() {
  const items = document.querySelectorAll("#playerList > div");

  items.forEach(item => {

    item.addEventListener("dragstart", (e) => {
      draggedIndex = Number(item.dataset.index);
      item.classList.add("opacity-50");
    });

    item.addEventListener("dragend", () => {
      item.classList.remove("opacity-50");
    });

    item.addEventListener("dragover", (e) => {
      e.preventDefault();
      item.classList.add("border-2", "border-yellow-400");
    });

    item.addEventListener("dragleave", () => {
      item.classList.remove("border-2", "border-yellow-400");
    });

    item.addEventListener("drop", (e) => {
      e.preventDefault();

      const targetIndex = Number(item.dataset.index);

      item.classList.remove("border-2", "border-yellow-400");

      if (draggedIndex === targetIndex) return;

      reorderPlayers(draggedIndex, targetIndex);
    });

  });
}

// Función para reordenar el array de jugadores en el estado

function reorderPlayers(from, to) {
  const movedPlayer = state.participantes.splice(from, 1)[0];
  state.participantes.splice(to, 0, movedPlayer);

  saveToLS(state);
  renderPlayers();
}

function removePlayer(index) {
  state.participantes.splice(index, 1);
  saveToLS(state);
  renderPlayers();
}


document.addEventListener("DOMContentLoaded", () => {
  renderPlayers();
});


//exclusiones de jugadores

let exclusionesActivas = false;

function setExclusion(valor) {
  exclusionesActivas = valor;

  const lista = document.getElementById("exclusionList");

  if (!valor) {
    lista.classList.add("hidden");
    state.exclusiones = [];
    saveToLS(state);
    return;
  }

  lista.classList.remove("hidden");
  renderExclusions();
}


// renderizado de exclusiones
function renderExclusions() {
  const container = document.getElementById("exclusionList");
  container.innerHTML = "";

  if (state.participantes.length < 2) {
    container.innerHTML = "<p style='color:#ff00c8'>Agrega más jugadores primero</p>";
    return;
  }

  state.participantes.forEach(de => {

    const div = document.createElement("div");
    div.className = "arcade-panel p-3 mb-2";

    let opciones = state.participantes
      .filter(p => p !== de)
      .map(p => `<option value="${p}">${p}</option>`)
      .join("");

    div.innerHTML = `
      <p style="font-size:0.7rem; margin-bottom:5px">${de} NO puede regalar a:</p>
      <select onchange="addExclusion('${de}', this.value)" class="arcade-input">
        <option value="">-- Selecciona --</option>
        ${opciones}
      </select>
    `;

    container.appendChild(div);
  });
}

//agregar exclusión
function addExclusion(de, para) {
  if (!para) return;

  // Evitar duplicados
  const yaExiste = state.exclusiones.some(e => e.de === de && e.para === para);

  if (yaExiste) {
    Swal.fire({
      icon: 'warning',
      title: 'Exclusión duplicada',
      text: `${de} ya tiene bloqueado a ${para}`,
      confirmButtonColor: '#ff00c8'
    });
    return;
  }

  state.exclusiones.push({ de, para });
  saveToLS(state);

  Swal.fire({
    icon: 'success',
    title: 'Exclusión agregada',
    text: `${de} no podrá regalar a ${para}`,
    confirmButtonColor: '#39ff14'
  });
}


// seleciona tipo de evento 

function selectEvent(button, tipo) {

  // Quitar selección previa
  document.querySelectorAll(".event-opt").forEach(btn => {
    btn.classList.remove("event-selected");
  });

  // Marcar seleccionado
  button.classList.add("event-selected");

  state.tipoEvento = tipo;

  const customDiv = document.getElementById("customEventDiv");

  if (tipo === "Otro") {
    customDiv.classList.remove("hidden");
    state.nombreCelebracion = "";
  } else {
    customDiv.classList.add("hidden");
    state.nombreCelebracion = tipo;
  }

  saveToLS(state);
}

//guardar nombre de celebración personalizada

document.getElementById("inputEventName")
  .addEventListener("input", function () {
    state.nombreCelebracion = this.value.trim();
    saveToLS(state);
  });


  // validacion de seleccion 

  function validateEventStep() {

  if (!state.tipoEvento) {
    Swal.fire({
      icon: 'warning',
      title: 'Selecciona un evento 🎉',
      text: 'Debes elegir el tipo de celebración.',
      confirmButtonColor: '#ff00c8'
    });
    return;
  }

  if (state.tipoEvento === "Otro" && !state.nombreCelebracion) {
    Swal.fire({
      icon: 'warning',
      title: 'Especifica el evento ✏',
      text: 'Escribe el nombre de la celebración.',
      confirmButtonColor: '#00fff5'
    });
    return;
  }

  goTo(5);
}



// selecciona presupuesto 

function selectBudget(button, amount) {

  // Quitar selección previa
  document.querySelectorAll(".budget-opt").forEach(btn => {
    btn.classList.remove("event-selected");
  });

  button.classList.add("event-selected");

  const inputCustom = document.getElementById("inputPresupuesto");

  if (amount === "custom") {
    inputCustom.classList.remove("hidden");
    state.presupuesto = 0;
  } else {
    inputCustom.classList.add("hidden");
    state.presupuesto = amount;
  }

  saveToLS(state);
}


//guardar presupuesto personalizado

document.getElementById("inputPresupuesto")
  .addEventListener("input", function () {
    const valor = Number(this.value);
    state.presupuesto = valor;
    saveToLS(state);
  });


  //guardar fecha


  document.getElementById("inputFecha")
  .addEventListener("change", function () {
    state.fecha = this.value;
    saveToLS(state);
  });


  //validacion de presupuesto

  function saveAndFinish() {

  if (!state.fecha) {
    Swal.fire({
      icon: 'warning',
      title: 'Selecciona una fecha 📅',
      text: 'Debes elegir la fecha del evento.',
      confirmButtonColor: '#ff00c8'
    });
    return;
  }

  if (!state.presupuesto || state.presupuesto <= 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Define el presupuesto 💰',
      text: 'Selecciona o escribe una cantidad válida.',
      confirmButtonColor: '#00fff5'
    });
    return;
  }

  saveToLS(state);

  Swal.fire({
    icon: 'success',
    title: 'Evento configurado 🎉',
    text: 'Todo listo para comenzar el sorteo.',
    confirmButtonColor: '#39ff14'
  }).then(() => {
    goTo(6);
  });
}



// mostrar datos 

function showEventData() {

  const panel = document.getElementById("eventDataPanel");
  const content = document.getElementById("eventDataContent");

  // Toggle mostrar / ocultar
  panel.classList.toggle("hidden");

  // Si se está ocultando, no renderizamos
  if (panel.classList.contains("hidden")) return;

  content.innerHTML = `
    <div><strong>Organizador:</strong> ${state.organizador}</div>
    <div><strong>Total jugadores:</strong> ${state.participantes.length}</div>
    <div><strong>Evento:</strong> ${state.nombreCelebracion || state.tipoEvento}</div>
    <div><strong>Fecha:</strong> ${state.fecha}</div>
    <div><strong>Presupuesto:</strong> $${state.presupuesto}</div>
    <div><strong>Exclusiones:</strong> ${state.exclusiones.length}</div>
  `;
}


// Nuevo juego


function resetAll() {

  Swal.fire({
    title: '¿Reiniciar juego?',
    text: 'Se perderán todos los datos.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, reiniciar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#ff00c8'
  }).then((result) => {

    if (result.isConfirmed) {

      clearLS();
      state = getInitialState();

      goTo(0);
      location.reload();
    }
  });
}



