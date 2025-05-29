const contenedor = document.getElementById('contenedorListas');

function guardarListas() {
  const datos = [];
  contenedor.querySelectorAll('.lista').forEach(lista => {
    const nombre = lista.querySelector('h3').textContent;
    const color = Array.from(lista.classList).find(c => c.startsWith('color-')) || '';
    const tareas = [];
    lista.querySelectorAll('ul li').forEach(li => {
      tareas.push(li.firstChild.textContent);
    });
    datos.push({ nombre, color, tareas });
  });
  localStorage.setItem('listas', JSON.stringify(datos));
}

function crearLista(nombre, color, tareas = []) {
  if (!nombre) return;

  const lista = document.createElement('div');
  lista.className = 'lista';
  lista.classList.add(color); // Aplica clase de color

  const titulo = document.createElement('h3');
  titulo.textContent = nombre;
  lista.appendChild(titulo);

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Nueva tarea...';

  const btnAgregar = document.createElement('button');
  btnAgregar.textContent = 'Agregar';

  const ul = document.createElement('ul');

  const toggleBtn = document.createElement('button');
  toggleBtn.textContent = '⬇️';
  toggleBtn.onclick = () => {
    ul.classList.toggle('oculto');
    input.classList.toggle('oculto');
    btnAgregar.classList.toggle('oculto');
  };
  lista.appendChild(toggleBtn);

  btnAgregar.onclick = () => {
    const texto = input.value.trim();
    if (texto) {
      const li = document.createElement('li');
      li.textContent = texto;

      const btnEliminar = document.createElement('button');
      btnEliminar.textContent = '🗑️';
      btnEliminar.onclick = () => {
        li.remove();
        guardarListas();
      };

      li.appendChild(btnEliminar);
      ul.appendChild(li);
      input.value = '';
      guardarListas();
    }
  };

  tareas.forEach(texto => {
    const li = document.createElement('li');
    li.textContent = texto;
    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = '🗑️';
    btnEliminar.onclick = () => {
      li.remove();
      guardarListas();
    };
    li.appendChild(btnEliminar);
    ul.appendChild(li);
  });

  lista.appendChild(input);
  lista.appendChild(btnAgregar);
  lista.appendChild(ul);

  const btnBorrarLista = document.createElement('button');
  btnBorrarLista.textContent = '❌ Borrar Lista';
  btnBorrarLista.onclick = () => {
    lista.remove();
    guardarListas();
  };
  lista.appendChild(btnBorrarLista);

  contenedor.appendChild(lista);
  guardarListas();
}

function crearListaDesdeFormulario() {
  const nombre = document.getElementById('listaNombre').value.trim();
  const color = document.getElementById('color').value;
  crearLista(nombre, color);
  document.getElementById('listaNombre').value = '';
}

function cargarListas() {
  const datos = JSON.parse(localStorage.getItem('listas')) || [];
  datos.forEach(lista => {
    crearLista(lista.nombre, lista.color, lista.tareas);
  });
}



function exportarListas() {
  const datos = JSON.parse(localStorage.getItem('listas')) || [];
  const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'listas_tareas.json';
  a.click();
  URL.revokeObjectURL(url);
}

function importarListas() {
  const archivo = document.getElementById('importarArchivo').files[0];
  if (!archivo) return;

  const lector = new FileReader();
  lector.onload = function(e) {
    try {
      const datos = JSON.parse(e.target.result);
      localStorage.setItem('listas', JSON.stringify(datos));
      contenedor.innerHTML = ''; // Limpiar listas actuales
      cargarListas(); // Recargar desde localStorage
    } catch (err) {
      alert('Error al importar el archivo JSON.');
    }
  };
  lector.readAsText(archivo);
}

function exportarListas() {
  const datos = JSON.parse(localStorage.getItem('listas')) || [];
  const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'listas_tareas.json';
  a.click();

  URL.revokeObjectURL(url);
}

function importarListas() {
  const archivo = document.getElementById('importador').files[0];
  if (!archivo) return;

  const lector = new FileReader();
  lector.onload = function(e) {
    try {
      const datos = JSON.parse(e.target.result);
      localStorage.setItem('listas', JSON.stringify(datos));
      location.reload(); // Recarga para aplicar los cambios
    } catch (err) {
      alert('El archivo no es válido.');
    }
  };
  lector.readAsText(archivo);
}

window.onload = cargarListas;