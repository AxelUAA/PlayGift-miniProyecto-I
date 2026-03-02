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
    div.className = "arcade-panel p-2 flex justify-between items-center";

    div.innerHTML = `
      <span>${p}</span>
      <button onclick="removePlayer(${index})">❌</button>
    `;

    container.appendChild(div);
  });
}

function removePlayer(index) {
  state.participantes.splice(index, 1);
  saveToLS(state);
  renderPlayers();
}


document.addEventListener("DOMContentLoaded", () => {
  renderPlayers();
});
