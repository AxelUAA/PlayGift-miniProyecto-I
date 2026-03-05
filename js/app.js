/// ===============================
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

  // Actualizar bolitas de progreso (ui.js)
  updateStepIndicator(step);

  // Renderizar contenido según el paso (ui.js)
  if (step === 2) renderPlayers();
  if (step === 3) renderExclusions();
  if (step === 5) renderSuggestedDates();
}


// ===============================
// PASO 1 — Guardar organizador
// ===============================

function saveStep1() {

  const nombre = document.getElementById("inputOrganizador").value.trim();
  const incluir = document.getElementById("checkIncluir").checked;

  if (!nombre) {
    Swal.fire({
      icon: 'warning',
      title: 'Oops...',
      text: 'Ingresa tu nombre jugador',
      confirmButtonColor: '#00fff5'
    });
    return;
  }

  state.organizador = nombre;
  state.incluyeOrganizador = incluir;

  // Evitar duplicar al organizador si se vuelve al paso 1
  state.participantes = state.participantes.filter(p => p !== nombre);

  if (incluir) {
    state.participantes.unshift(nombre);
  }

  saveToLS(state);
  goTo(2);
}


// ===============================
// PASO 2 — Jugadores
// ===============================

function addPlayer() {

  const input  = document.getElementById("inputJugador");
  const nombre = input.value.trim();

  if (!nombre) return;

  if (state.participantes.includes(nombre)) {
    Swal.fire({
      icon: 'warning',
      title: 'Duplicado 🚫',
      text: 'Ese jugador ya existe',
      confirmButtonColor: '#ff00c8'
    });
    return;
  }

  state.participantes.push(nombre);
  input.value = "";

  saveToLS(state);
  renderPlayers(); // ui.js
}

function removePlayer(index) {
  state.participantes.splice(index, 1);
  saveToLS(state);
  renderPlayers(); // ui.js
}


// ===============================
// PASO 3 — Exclusiones
// ===============================

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
  renderExclusions(); // ui.js
}

function addExclusion(de, para) {

  if (!para) return;

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


// ===============================
// PASO 4 — Tipo de evento
// ===============================

function selectEvent(button, tipo) {

  // Quitar selección previa
  document.querySelectorAll(".event-opt").forEach(btn => {
    btn.classList.remove("event-selected");
  });

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


// ===============================
// PASO 5 — Fecha y Presupuesto
// ===============================

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


// ===============================
// PASO 6 — Nuevo juego
// ===============================

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


// ===============================
// Listeners de inputs
// ===============================

document.getElementById("inputEventName").addEventListener("input", function () {
  state.nombreCelebracion = this.value.trim();
  saveToLS(state);
});

document.getElementById("inputPresupuesto").addEventListener("input", function () {
  state.presupuesto = Number(this.value);
  saveToLS(state);
});

document.getElementById("inputFecha").addEventListener("change", function () {
  state.fecha = this.value;
  saveToLS(state);
});