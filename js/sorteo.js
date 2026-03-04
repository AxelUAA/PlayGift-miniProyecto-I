function startSlot() {

  const total = state.participantes.length;

  if (total < 2) {
    Swal.fire({
      icon: 'warning',
      title: 'Faltan jugadores 🎮',
      text: 'Necesitas al menos 2 jugadores.',
      confirmButtonColor: '#ff00c8'
    });
    return;
  }

  if (total % 2 !== 0) {
    Swal.fire({
      icon: 'error',
      title: 'Número impar 🚫',
      text: 'El intercambio requiere número PAR de jugadores.',
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

      const de = jugadores[i];
      const para = mezclados[i];

      // No regalarse a sí mismo
      if (de === para) {
        valido = false;
        break;
      }

      // Verificar exclusiones
      const bloqueado = state.exclusiones.some(e => e.de === de && e.para === para);

      if (bloqueado) {
        valido = false;
        break;
      }

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

  mostrarResultados();
}


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