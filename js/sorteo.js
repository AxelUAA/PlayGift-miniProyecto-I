function startSlot() {
  if (state.participantes.length < 2) {
    alert("Necesitas al menos 2 jugadores 🎮");
    return;
  }

  realizarSorteo();
}

function realizarSorteo() {
  const jugadores = [...state.participantes];
  const mezclados = [...jugadores].sort(() => Math.random() - 0.5);

  let resultados = [];

  for (let i = 0; i < jugadores.length; i++) {
    resultados.push({
      de: jugadores[i],
      para: mezclados[i]
    });
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