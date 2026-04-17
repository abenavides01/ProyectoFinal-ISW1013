const productoForm = document.getElementById('productoForm');
const productoIdInput = document.getElementById('productoId');
const codigoInput = document.getElementById('codigo');
const nombreInput = document.getElementById('nombre');
const descripcionInput = document.getElementById('descripcion');
const cantidadInput = document.getElementById('cantidad');
const precioInput = document.getElementById('precio');
const tablaProductos = document.getElementById('tablaProductos');
const mensaje = document.getElementById('mensaje');
const formTitle = document.getElementById('formTitle');
const cancelarEdicionBtn = document.getElementById('cancelarEdicionBtn');
const logoutBtn = document.getElementById('logoutBtn');

const mostrarMensaje = (texto, tipo = '') => {
  mensaje.textContent = texto;
  mensaje.className = 'message';
  if (tipo) mensaje.classList.add(tipo);
};

const limpiarFormulario = () => {
  productoForm.reset();
  productoIdInput.value = '';
  formTitle.textContent = 'Crear producto';
  cancelarEdicionBtn.classList.add('hidden');
};

const crearBoton = (texto, clase, dataset = {}) => {
  const btn = document.createElement('button');
  btn.textContent = texto;
  btn.className = clase;

  Object.entries(dataset).forEach(([key, value]) => {
    btn.dataset[key] = value;
  });

  return btn;
};

const crearCelda = (texto) => {
  const td = document.createElement('td');
  td.textContent = texto ?? '';
  return td;
};

const renderizarProductos = (productos) => {
  tablaProductos.innerHTML = '';

  if (productos.length === 0) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 7;
    td.textContent = 'No hay productos registrados.';
    tr.appendChild(td);
    tablaProductos.appendChild(tr);
    return;
  }

  productos.forEach((producto) => {
    const tr = document.createElement('tr');

    tr.appendChild(crearCelda(producto.id));
    tr.appendChild(crearCelda(producto.codigo));
    tr.appendChild(crearCelda(producto.nombre));
    tr.appendChild(crearCelda(producto.descripcion || ''));
    tr.appendChild(crearCelda(producto.cantidad));
    tr.appendChild(crearCelda(producto.precio));

    const tdAcciones = document.createElement('td');
    const contenedor = document.createElement('div');
    contenedor.className = 'table-actions';

    const btnEditar = crearBoton('Editar', 'btn-edit', {
      action: 'editar',
      id: producto.id,
      codigo: producto.codigo,
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      cantidad: producto.cantidad,
      precio: producto.precio
    });

    const btnEliminar = crearBoton('Eliminar', 'btn-delete', {
      action: 'eliminar',
      id: producto.id
    });

    contenedor.appendChild(btnEditar);
    contenedor.appendChild(btnEliminar);
    tdAcciones.appendChild(contenedor);
    tr.appendChild(tdAcciones);

    tablaProductos.appendChild(tr);
  });
};

const cargarProductos = async () => {
  try {
    const response = await fetch('/api/productos');
    const productos = await response.json();

    if (!response.ok) {
      tablaProductos.innerHTML = `
        <tr>
          <td colspan="7">No se pudieron cargar los productos.</td>
        </tr>
      `;
      return;
    }

    if (productos.length === 0) {
      tablaProductos.innerHTML = `
        <tr>
          <td colspan="7">No hay productos registrados.</td>
        </tr>
      `;
      return;
    }
    renderizarProductos(productos);

  } catch (error) {
    console.error(error);
    tablaProductos.innerHTML = `
      <tr>
        <td colspan="7">Error de conexión con el servidor.</td>
      </tr>
    `;
  }
};

productoForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const id = productoIdInput.value;

  const producto = {
    codigo: codigoInput.value.trim(),
    nombre: nombreInput.value.trim(),
    descripcion: descripcionInput.value.trim(),
    cantidad: Number(cantidadInput.value),
    precio: Number(precioInput.value)
  };

  const esEdicion = Boolean(id);
  const url = esEdicion ? `/api/productos/${id}` : '/api/productos';
  const method = esEdicion ? 'PUT' : 'POST';

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(producto)
    });

    const data = await response.json();

    if (!response.ok) {
      mostrarMensaje(
        data.error || (data.errores ? data.errores.join(' ') : 'No se pudo guardar el producto.'),
        'error'
      );
      return;
    }

    mostrarMensaje(
      esEdicion ? 'Producto actualizado correctamente.' : 'Producto creado correctamente.',
      'success'
    );

    limpiarFormulario();
    cargarProductos();
  } catch (error) {
    console.error(error);
    mostrarMensaje('Error de conexión con el servidor.', 'error');
  }
});

tablaProductos.addEventListener('click', async (event) => {
  const boton = event.target.closest('button');

  if (!boton) return;

  const action = boton.dataset.action;

  if (action === 'editar') {
    productoIdInput.value = boton.dataset.id;
    codigoInput.value = boton.dataset.codigo;
    nombreInput.value = boton.dataset.nombre;
    descripcionInput.value = boton.dataset.descripcion;
    cantidadInput.value = boton.dataset.cantidad;
    precioInput.value = boton.dataset.precio;

    formTitle.textContent = 'Editar producto';
    cancelarEdicionBtn.classList.remove('hidden');
    mostrarMensaje('');
  }

  if (action === 'eliminar') {
    const id = boton.dataset.id;
    const confirmar = confirm('¿Deseas eliminar este producto?');

    if (!confirmar) return;

    try {
      const response = await fetch(`/api/productos/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (!response.ok) {
        mostrarMensaje(data.error || 'No se pudo eliminar el producto.', 'error');
        return;
      }

      mostrarMensaje('Producto eliminado correctamente.', 'success');
      cargarProductos();
    } catch (error) {
      console.error(error);
      mostrarMensaje('Error de conexión con el servidor.', 'error');
    }
  }
});

cancelarEdicionBtn.addEventListener('click', () => {
  limpiarFormulario();
  mostrarMensaje('');
});

logoutBtn.addEventListener('click', async () => {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST'
    });
  } catch (error) {
    console.error(error);
  }

  window.location.href = '/login.html';
});

cargarProductos();