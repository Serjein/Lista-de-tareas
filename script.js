const contenedor = document.getElementById('contenedorListas');

function guardarListas() {
  const datos = [];
  contenedor.querySelectorAll('.lista').forEach(lista => {
    const nombre = lista.querySelector('h3').textContent;
    const color = Array.from(lista.classList).find(c => c.startsWith('color-')) || '';
    const tareas = [];
    lista.querySelectorAll('ul li span').forEach(span => {
      tareas.push(span.textContent);
    });
    const visible = !lista.querySelector('ul').classList.contains('oculto');
    datos.push({ nombre, color, tareas, visible });
  });
  localStorage.setItem('listas', JSON.stringify(datos));
}

function crearLista(nombre, color, tareas = [], visible = true) {
  if (!nombre) return;

  const lista = document.createElement('div');
  lista.className = 'lista';
  lista.classList.add(color);

  const titulo = document.createElement('h3');
  titulo.textContent = nombre;
  lista.appendChild(titulo);

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Nueva tarea...';
  input.classList.add('input-tarea');

  const btnAgregar = document.createElement('button');
  btnAgregar.textContent = 'Agregar';
  btnAgregar.classList.add('btn-agregar');

  const ul = document.createElement('ul');

  const toggleBtn = document.createElement('button');
  toggleBtn.textContent = '⬇️';
  toggleBtn.onclick = () => {
    ul.classList.toggle('oculto');
    input.classList.toggle('oculto');
    btnAgregar.classList.toggle('oculto');
    guardarListas();
  };
  lista.appendChild(toggleBtn);

  // Aplicar visibilidad inicial
  if (!visible) {
    ul.classList.add('oculto');
    input.classList.add('oculto');
    btnAgregar.classList.add('oculto');
  }

  function agregarTarea(texto) {
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = texto;

    const btnEditar = document.createElement('button');
    btnEditar.textContent = '✏️';
    btnEditar.onclick = () => {
      const inputEdicion = document.createElement('input');
      inputEdicion.type = 'text';
      inputEdicion.value = span.textContent;

      inputEdicion.onblur = () => {
        if (inputEdicion.value.trim() !== '') {
          span.textContent = inputEdicion.value.trim();
          guardarListas();
        }
        li.replaceChild(span, inputEdicion);
      };

      inputEdicion.onkeydown = (e) => {
        if (e.key === 'Enter') inputEdicion.blur();
      };

      li.replaceChild(inputEdicion, span);
      inputEdicion.focus();
    };

    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = '🗑️';
    btnEliminar.onclick = () => {
      li.remove();
      guardarListas();
    };

    li.appendChild(span);
    li.appendChild(btnEditar);
    li.appendChild(btnEliminar);
    ul.appendChild(li);
  }

  btnAgregar.onclick = () => {
    const texto = input.value.trim();
    if (texto) {
      agregarTarea(texto);
      input.value = '';
      guardarListas();
    }
  };

  tareas.forEach(texto => agregarTarea(texto));

  lista.appendChild(input);
  lista.appendChild(btnAgregar);
  lista.appendChild(ul);

  const btnBorrarLista = document.createElement('button');
  btnBorrarLista.textContent = '❌ Borrar Lista';
  btnBorrarLista.classList.add('btn-borrar-lista');
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
    crearLista(lista.nombre, lista.color, lista.tareas, lista.visible);
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
  const archivo = document.getElementById('importador').files[0];
  if (!archivo) return;

  const lector = new FileReader();
  lector.onload = function(e) {
    try {
      const datos = JSON.parse(e.target.result);
      localStorage.setItem('listas', JSON.stringify(datos));
      location.reload();
    } catch (err) {
      alert('El archivo no es válido.');
    }
  };
  lector.readAsText(archivo);
}

window.onload = cargarListas;
