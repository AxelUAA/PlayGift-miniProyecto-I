// ===============================
// ui.js — Renderizado del DOM
// Todas las funciones que dibujan
// o actualizan la interfaz
// ===============================


// ── Indicador de pasos (bolitas) ──────────────────────────

function updateStepIndicator(step) {

  const indicator = document.getElementById("stepIndicator");

  if (step === 0) {
    indicator.classList.add("hidden");
    return;
  }

  indicator.classList.remove("hidden");

  document.querySelectorAll(".step-dot").forEach((dot, i) => {
    dot.classList.remove("active", "done");

    if (i + 1 === step) dot.classList.add("active");
    else if (i + 1 < step) dot.classList.add("done");
  });
}


// ── Lista de jugadores (Paso 2) ───────────────────────────

function renderPlayers() {

  const container = document.getElementById("playerList");
  container.innerHTML = "";

  state.participantes.forEach((p, index) => {
    const div = document.createElement("div");

    div.className = "arcade-panel p-2 flex justify-between items-center cursor-move";
    div.draggable = true;
    div.dataset.index = index;

    div.innerHTML = `
      <span style="font-size:0.75rem; color:var(--neon-pink)">${p}</span>
      <button onclick="removePlayer(${index})" 
              style="background:none; border:none; cursor:pointer; font-size:0.9rem">
        ❌
      </button>
    `;

    container.appendChild(div);
  });

  // Re-inicializar drag & drop tras cada render
  addDragEvents();
}


// ── Lista de exclusiones (Paso 3) ─────────────────────────

function renderExclusions() {

  const container = document.getElementById("exclusionList");
  container.innerHTML = "";

  if (state.participantes.length < 2) {
    container.innerHTML = `
      <p style="color:#ff00c8; font-size:0.7rem">
        Agrega más jugadores primero
      </p>`;
    return;
  }

  state.participantes.forEach(de => {

    const div = document.createElement("div");
    div.className = "arcade-panel p-3 mb-2";

    const opciones = state.participantes
      .filter(p => p !== de)
      .map(p => `<option value="${p}">${p}</option>`)
      .join("");

    div.innerHTML = `
      <p style="font-size:0.7rem; margin-bottom:5px; color:rgba(0,255,245,0.7)">
        ${de} NO puede regalar a:
      </p>
      <select onchange="addExclusion('${de}', this.value)" class="arcade-input">
        <option value="">-- Selecciona --</option>
        ${opciones}
      </select>
    `;

    container.appendChild(div);
  });
}


// ── Fechas sugeridas (Paso 5) ─────────────────────────────

function renderSuggestedDates() {

  const container = document.getElementById("fechasSugeridas");
  container.innerHTML = "";

  const today = new Date();

  // Genera 3 fechas: +1, +2 y +3 semanas desde hoy
  for (let i = 1; i <= 3; i++) {

    const d = new Date(today);
    d.setDate(today.getDate() + i * 7);

    const iso   = d.toISOString().split('T')[0];
    const label = d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });

    const btn = document.createElement("button");
    btn.className = "budget-opt";
    btn.textContent = label;

    btn.onclick = () => {
      // Marcar botón activo
      document.querySelectorAll("#fechasSugeridas .budget-opt")
        .forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");

      // Sincronizar con el input de fecha y el estado
      document.getElementById("inputFecha").value = iso;
      state.fecha = iso;
      saveToLS(state);
    };

    container.appendChild(btn);
  }
}


// ── Panel de datos del evento (Paso 6) ────────────────────

function showEventData() {

  const panel   = document.getElementById("eventDataPanel");
  const content = document.getElementById("eventDataContent");

  // Toggle mostrar / ocultar
  panel.classList.toggle("hidden");

  // Si se está ocultando, no renderizamos
  if (panel.classList.contains("hidden")) return;

  content.innerHTML = `
    <div><strong>Organizador:</strong> ${state.organizador || '—'}</div>
    <div><strong>Total jugadores:</strong> ${state.participantes.length}</div>
    <div><strong>Evento:</strong> ${state.nombreCelebracion || state.tipoEvento || '—'}</div>
    <div><strong>Fecha:</strong> ${state.fecha || '—'}</div>
    <div><strong>Presupuesto:</strong> $${state.presupuesto || 0}</div>
    <div><strong>Exclusiones:</strong> ${state.exclusiones.length}</div>
  `;
}


// ── Resultados del sorteo (Paso 6) ────────────────────────

function mostrarResultados() {

  const container = document.getElementById("sorteoResults");
  container.innerHTML = "";

  state.resultadoSorteo.forEach(r => {

    const div = document.createElement("div");
    div.className = "arcade-panel p-2 text-center";

    div.innerHTML = `
      <span style="color:#ff00c8">${r.de}</span>
      →
      <span style="color:#00fff5">${r.para}</span>
    `;

    container.appendChild(div);
  });

  document.getElementById("btnNuevoSorteo").classList.remove("hidden");
}