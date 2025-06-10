const contenedor = document.getElementById('contenedorListas');

function guardarListas() {
  const datos = [];
  contenedor.querySelectorAll('.lista').forEach(lista => {
    let nombre = '';

    const tituloInput = lista.querySelector('.titulo-editable');
    const tituloH3 = lista.querySelector('h3');

    if (tituloInput) {
      nombre = tituloInput.value.trim();
    } else if (tituloH3) {
      nombre = tituloH3.textContent.trim();
    }

    if (!nombre) return; // ← nota: evita guardar listas vacías

    const color = Array.from(lista.classList).find(c => c.startsWith('color-')) || '';
    const tareas = [];
    lista.querySelectorAll('ul li span').forEach(span => {
      tareas.push(span.textContent.trim());
    });
    const visible = !lista.querySelector('ul').classList.contains('oculto');

    datos.push({ nombre, color, tareas, visible });
  });

  localStorage.setItem('listas', JSON.stringify(datos)); // ← nota: guarda todo en localStorage
}

function crearLista(nombre, color, tareas = [], visible = true) {
  if (!nombre) return;

  const lista = document.createElement('div');
  lista.className = 'lista';
  lista.classList.add(color);

  // ← nota: sección para título editable con botón SVG
  const titulo = document.createElement('h3');
  titulo.classList.add('editable');
  titulo.innerHTML = `
    <span class="titulo-texto">${nombre}</span>
    <button class="btn-editar-titulo" title="Editar nombre">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 24 24">
        <path d="M3 17.25V21h3.75l11.06-11.06-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 000-1.42l-2.34-2.34a1.003 1.003 0 00-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"/>
      </svg>
    </button>
  `;

  const spanTitulo = titulo.querySelector('.titulo-texto');
  const btnEditarTitulo = titulo.querySelector('.btn-editar-titulo');

  // ← nota: lógica de edición del título
  btnEditarTitulo.onclick = () => {
    const inputEdicion = document.createElement('input');
    inputEdicion.type = 'text';
    inputEdicion.value = spanTitulo.textContent;
    inputEdicion.classList.add('input-editar-titulo');

    inputEdicion.onblur = () => {
      if (inputEdicion.value.trim()) {
        spanTitulo.textContent = inputEdicion.value.trim();
        guardarListas();
      }
      titulo.replaceChild(spanTitulo, inputEdicion);
    };

    inputEdicion.onkeydown = e => {
      if (e.key === 'Enter') inputEdicion.blur();
    };

    titulo.replaceChild(inputEdicion, spanTitulo);
    inputEdicion.focus();
  };

  lista.appendChild(titulo);

  // ← nota: input y botón para agregar tareas
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Nueva tarea...';
  input.classList.add('input-tarea');

  const btnAgregar = document.createElement('button');
  btnAgregar.textContent = 'Agregar';
  btnAgregar.classList.add('btn-agregar');

  const ul = document.createElement('ul');
  ul.classList.add('tareas');

  // ← nota: permite arrastrar tareas dentro de la lista
  ul.addEventListener('dragover', e => e.preventDefault());
  ul.addEventListener('drop', e => {
    e.preventDefault();
    const dragging = document.querySelector('.dragging');
    const afterElement = getDragAfterElement(ul, e.clientY);
    if (afterElement) {
      ul.insertBefore(dragging, afterElement);
    } else {
      ul.appendChild(dragging);
    }
    guardarListas();
  });

  // ← nota: función para agregar cada tarea con botones SVG de editar y eliminar
  function agregarTarea(texto) {
    const li = document.createElement('li');
    li.draggable = true;
    li.classList.add('draggable');

    li.addEventListener('dragstart', () => li.classList.add('dragging'));
    li.addEventListener('dragend', () => li.classList.remove('dragging'));

    const span = document.createElement('span');
    span.textContent = texto;

    const btnEditar = document.createElement('button');
    btnEditar.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 24 24">
        <path d="M3 17.25V21h3.75l11.06-11.06-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 000-1.42l-2.34-2.34a1.003 1.003 0 00-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"/>
      </svg>`;
    btnEditar.onclick = () => {
      const inputEdicion = document.createElement('input');
      inputEdicion.type = 'text';
      inputEdicion.value = span.textContent;
      inputEdicion.onblur = () => {
        if (inputEdicion.value.trim()) {
          span.textContent = inputEdicion.value.trim();
          guardarListas();
        }
        li.replaceChild(span, inputEdicion);
      };
      inputEdicion.onkeydown = e => {
        if (e.key === 'Enter') inputEdicion.blur();
      };
      li.replaceChild(inputEdicion, span);
      inputEdicion.focus();
    };

    const btnEliminar = document.createElement('button');
    btnEliminar.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 24 24">
        <path d="M3 6l3 18h12l3-18H3zm5 15H6l-.5-15h3l-.5 15zm6 0h-3l-.5-15h3l.5 15zm6 0h-3l-.5-15h3l.5 15zM15.5 3l1-1h-9l1 1H5v2h14V3h-3.5z"/>
      </svg>`;
    btnEliminar.onclick = () => {
      li.remove();
      guardarListas();
    };

    li.append(span, btnEditar, btnEliminar);
    ul.appendChild(li);
  }

  // ← nota: evento para agregar tareas nuevas
  btnAgregar.onclick = () => {
    const texto = input.value.trim();
    if (texto) {
      agregarTarea(texto);
      input.value = '';
      guardarListas();
    }
  };

  tareas.forEach(t => agregarTarea(t)); // ← nota: cargar tareas existentes

  // ← nota: botón para mostrar/ocultar tareas
  const toggleBtn = document.createElement('button');
  toggleBtn.innerHTML =` 
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 24 24">
    <path d="M7 10l5 5 5-5z"/>
  </svg>`;
  toggleBtn.onclick = () => {
    ul.classList.toggle('oculto');
    input.classList.toggle('oculto');
    btnAgregar.classList.toggle('oculto');
    guardarListas();
  };
  lista.appendChild(toggleBtn);

  if (!visible) {
    ul.classList.add('oculto');
    input.classList.add('oculto');
    btnAgregar.classList.add('oculto');
  }

  lista.append(input, btnAgregar, ul);

  // ← nota: botón con ícono SVG para borrar toda la lista
  const btnBorrarLista = document.createElement('button');
  btnBorrarLista.classList.add('btn-borrar-lista');
  btnBorrarLista.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" viewBox="0 0 24 24">
      <path d="M3 6l3 18h12l3-18H3zm5 15H6l-.5-15h3l-.5 15zm6 0h-3l-.5-15h3l.5 15zm6 0h-3l-.5-15h3l.5 15zM15.5 3l1-1h-9l1 1H5v2h14V3h-3.5z"/>
    </svg> Borrar Lista`;
  btnBorrarLista.onclick = () => {
    lista.remove();
    guardarListas();
  };
  lista.appendChild(btnBorrarLista);

  // ← nota: hacer la lista arrastrable
  lista.draggable = true;
  lista.classList.add('draggable-lista');
  lista.addEventListener('dragstart', () => lista.classList.add('dragging-lista'));
  lista.addEventListener('dragend', () => {
    lista.classList.remove('dragging-lista');
    guardarListas();
  });

  contenedor.appendChild(lista);
  guardarListas();
}

// ← nota: lógica para obtener la posición adecuada al soltar un elemento (tarea o lista)
function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')];
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function crearListaDesdeFormulario() {
  const nombre = document.getElementById('listaNombre').value.trim();
  const color = document.getElementById('color').value;
  crearLista(nombre, color);
  document.getElementById('listaNombre').value = '';
}

// ← nota: carga listas guardadas desde localStorage al iniciar
function cargarListas() {
  const datos = JSON.parse(localStorage.getItem('listas')) || [];
  datos.forEach(lista => {
    crearLista(lista.nombre, lista.color, lista.tareas, lista.visible);
  });
}

// ← nota: exportar datos como archivo JSON
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

// ← nota: importar archivo JSON para cargar listas
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

// ← nota: permitir arrastrar y soltar listas enteras
contenedor.addEventListener('dragover', e => e.preventDefault());
contenedor.addEventListener('drop', e => {
  e.preventDefault();
  const dragging = document.querySelector('.dragging-lista');
  const afterElement = getDragAfterElementLista(contenedor, e.clientY);
  if (afterElement) {
    contenedor.insertBefore(dragging, afterElement);
  } else {
    contenedor.appendChild(dragging);
  }
  guardarListas();
});

// ← nota: lógica para determinar dónde soltar una lista
function getDragAfterElementLista(container, y) {
  const elementos = [...container.querySelectorAll('.draggable-lista:not(.dragging-lista)')];
  return elementos.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}
