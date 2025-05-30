function crearLista(nombre, color, tareas = []) {
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
  };
  lista.appendChild(toggleBtn);

  function agregarTarea(texto) {
    const li = document.createElement('li');

    const span = document.createElement('span');
    span.innerHTML = texto.replace(/\n/g, '<br>');

    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = '🗑️';
    btnEliminar.onclick = () => {
      li.remove();
      guardarListas();
    };

    const btnEditar = document.createElement('button');
    btnEditar.textContent = '✏️';
    btnEditar.onclick = () => {
      const textarea = document.createElement('textarea');
      textarea.value = texto;
      const btnGuardar = document.createElement('button');
      btnGuardar.textContent = '✅';

      li.innerHTML = ''; // Limpia todo
      li.appendChild(textarea);
      li.appendChild(btnGuardar);

      btnGuardar.onclick = () => {
        const nuevoTexto = textarea.value.trim();
        if (nuevoTexto) {
          li.innerHTML = ''; // Limpia para mostrar texto normal otra vez
          const nuevoSpan = document.createElement('span');
          nuevoSpan.innerHTML = nuevoTexto.replace(/\n/g, '<br>');

          const btnEliminar = document.createElement('button');
          btnEliminar.textContent = '🗑️';
          btnEliminar.onclick = () => {
            li.remove();
            guardarListas();
          };

          const btnEditar = document.createElement('button');
          btnEditar.textContent = '✏️';
          btnEditar.onclick = () => {
            agregarTarea(nuevoTexto); // Reutiliza lógica
            li.remove(); // Elimina el viejo
          };

          li.appendChild(nuevoSpan);
          li.appendChild(btnEliminar);
          li.appendChild(btnEditar);
          guardarListas();
        }
      };
    };

    li.appendChild(span);
    li.appendChild(btnEliminar);
    li.appendChild(btnEditar);
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

  // Enter también agrega tarea
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      btnAgregar.click();
    }
  });

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
