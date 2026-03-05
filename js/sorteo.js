// ===============================
// sorteo.js — Lógica del sorteo
// ===============================

let sorteoIndex = 0; // controla cuántos resultados se han revelado


// ── Iniciar sorteo ────────────────────────────────────────

function startSlot() {

  const total = state.participantes.length;

  if (total < 3) {
    Swal.fire({
      icon: 'warning',
      title: 'Faltan jugadores 🎮',
      text: 'Necesitas al menos 3 jugadores.',
      confirmButtonColor: '#ff00c8'
    });
    return;
  }

  Swal.fire({
    title: '🎰 Iniciando sorteo...',
    text: 'La suerte está echada...',
    icon: 'info',
    timer: 1500,
    showConfirmButton: false,
    background: '#111',
    color: '#00fff5'
  }).then(() => {

    document.getElementById("slotPanel").classList.remove("hidden");
    realizarSorteo();
  });
}


// ── Algoritmo del sorteo ──────────────────────────────────

function realizarSorteo() {

  const jugadores = [...state.participantes];
  let intentos = 0;
  let valido = false;
  let resultados = [];

  while (!valido && intentos < 100) {

    const mezclados = [...jugadores].sort(() => Math.random() - 0.5);
    valido = true;
    resultados = [];

    for (let i = 0; i < jugadores.length; i++) {

      const de   = jugadores[i];
      const para = mezclados[i];

      // No regalarse a sí mismo
      if (de === para) { valido = false; break; }

      // Verificar exclusiones
      const bloqueado = state.exclusiones.some(e => e.de === de && e.para === para);
      if (bloqueado) { valido = false; break; }

      resultados.push({ de, para });
    }

    intentos++;
  }

  if (!valido) {
    Swal.fire({
      icon: 'error',
      title: 'No se pudo generar el sorteo',
      text: 'Revisa las exclusiones, pueden ser incompatibles.',
      confirmButtonColor: '#ff00c8'
    });
    return;
  }

  state.resultadoSorteo = resultados;
  saveToLS(state);

  // Preparar slot machine para revelar uno a uno
  sorteoIndex = 0;
  document.getElementById("reel1text").textContent = "???";
  document.getElementById("reel2text").textContent = "???";
  document.getElementById("sorteoResults").innerHTML = "";
  document.getElementById("btnNuevoSorteo").classList.add("hidden");
  document.getElementById("btnSpin").disabled = false;
  document.getElementById("btnSpin").textContent = "🎰 GIRAR RULETA";
}


// ── Revelar resultado de uno en uno ──────────────────────

function spinNext() {

  // Si ya se mostraron todos, no hacer nada
  if (sorteoIndex >= state.resultadoSorteo.length) return;

  const r = state.resultadoSorteo[sorteoIndex];

  // Animación rápida en los rodillos
  animarRodillos(r.de, r.para, () => {

    // Agregar resultado a la lista
    const container = document.getElementById("sorteoResults");
    const div = document.createElement("div");
    div.className = "arcade-panel p-2 text-center";
    div.style.animation = "flickerIn 0.5s ease";
    div.innerHTML = `
      <span style="color:#ff00c8; font-family:'Press Start 2P', monospace; font-size:0.6rem">${r.de}</span>
      <span style="color:rgba(255,255,255,0.4)"> → </span>
      <span style="color:#00fff5; font-family:'Press Start 2P', monospace; font-size:0.6rem">${r.para}</span>
    `;
    container.appendChild(div);

    sorteoIndex++;

    // Si ya terminaron todos
    if (sorteoIndex >= state.resultadoSorteo.length) {
      document.getElementById("btnSpin").disabled = true;
      document.getElementById("btnSpin").textContent = "✓ SORTEO COMPLETO";
      document.getElementById("btnNuevoSorteo").classList.remove("hidden");
    }
  });
}


// ── Animación de rodillos ─────────────────────────────────

function animarRodillos(nombreFinal1, nombreFinal2, callback) {

  const reel1 = document.getElementById("reel1text");
  const reel2 = document.getElementById("reel2text");
  const nombres = state.participantes;

  let ticks = 0;
  const totalTicks = 10; // cuántas veces parpadea antes de revelar

  const intervalo = setInterval(() => {

    // Mostrar nombres aleatorios mientras "gira"
    reel1.textContent = nombres[Math.floor(Math.random() * nombres.length)];
    reel2.textContent = nombres[Math.floor(Math.random() * nombres.length)];
    ticks++;

    if (ticks >= totalTicks) {
      clearInterval(intervalo);
      // Mostrar el resultado final
      reel1.textContent = nombreFinal1;
      reel2.textContent = nombreFinal2;
      callback();
    }

  }, 80); // velocidad del giro en ms
}