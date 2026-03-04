function startSlot() {

  const total = state.participantes.length;

  // Validar mínimo 2 jugadores
  if (total < 2) {
    Swal.fire({
      icon: 'info',
      title: 'Faltan jugadores',
      text: 'Necesitas al menos 2 jugadores ',
      confirmButtonColor: '#facc15'
    });
    return;
  }

  // 🔥 Validar número par
  if (total % 2 !== 0) {
    Swal.fire({
      icon: 'error',
      title: 'Número impar detectado ',
      html: `
        El intercambio necesita un número <b>PAR</b> de jugadores.<br><br>
        Actualmente tienes <b>${total}</b> jugadores.
      `,
      confirmButtonColor: '#ff00c8'
    });
    return;
  }

  // Si todo está bien
  realizarSorteo();
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
    div.className = "arcade-panel p-2";

    div.innerHTML = `${r.de} ➜ ${r.para}`;

    container.appendChild(div);
  });
}