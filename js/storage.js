// ============================================
// Módulo de localStorage
// ============================================

const STORAGE_KEY = 'playgift_data';

// Guardar estado completo en localStorage
function saveToLS(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// Cargar datos desde localStorage
function loadFromLS() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

// Borrar datos de localStorage
function clearLS() {
  localStorage.removeItem(STORAGE_KEY);
}

// Estado inicial vacío
function getInitialState() {
  return {
    organizador: '',
    incluyeOrganizador: true,
    participantes: [],
    exclusiones: [],
    tipoEvento: '',
    nombreCelebracion: '',
    fecha: '',
    presupuesto: 0,
    resultadoSorteo: []
  };
}