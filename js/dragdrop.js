// ===============================
// Drag & Drop – jugadores
// ===============================

let draggedIndex = null;

function addDragEvents() {
  const items = document.querySelectorAll("#playerList > div");

  items.forEach(item => {

    item.addEventListener("dragstart", () => {
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

function reorderPlayers(from, to) {
  const movedPlayer = state.participantes.splice(from, 1)[0];
  state.participantes.splice(to, 0, movedPlayer);

  saveToLS(state);
  renderPlayers();
}