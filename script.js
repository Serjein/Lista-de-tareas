const input = document.getElementById("tareaInput");
const lista = document.getElementById("listaTareas");

function cargarTareas() {
  const tareas = JSON.parse(localStorage.getItem("tareas")) || [];
  lista.innerHTML = "";
  tareas.forEach((t, i) => {
    const li = document.createElement("li");
    li.innerHTML = t + '<button onclick="eliminarTarea(' + i + ')">🗑️</button>';
    lista.appendChild(li);
  });
}

function agregarTarea() {
  const texto = input.value.trim();
  if (!texto) return;
  const tareas = JSON.parse(localStorage.getItem("tareas")) || [];
  tareas.push(texto);
  localStorage.setItem("tareas", JSON.stringify(tareas));
  input.value = "";
  cargarTareas();
}

function eliminarTarea(index) {
  const tareas = JSON.parse(localStorage.getItem("tareas")) || [];
  tareas.splice(index, 1);
  localStorage.setItem("tareas", JSON.stringify(tareas));
  cargarTareas();
}

window.onload = cargarTareas;