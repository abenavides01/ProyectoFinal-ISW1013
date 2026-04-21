const BASE = '/api/usuarios';
const tabla = document.getElementById('tablaUsuarios');
const form = document.getElementById('usuarioForm');
const mensaje = document.getElementById('mensaje');
const formTitle = document.getElementById('formTitle');
const cancelarBtn = document.getElementById('cancelarBtn');

const headers = {
  'Content-Type': 'application/json',
  'Origin': window.location.origin
};

const mostrarMensaje = (texto, tipo) => {
  mensaje.textContent = texto;
  mensaje.className = `message ${tipo}`;
  setTimeout(() => { mensaje.textContent = ''; mensaje.className = 'message'; }, 3000);
};

const editarUsuario = (id, username, email, rol) => {
  document.getElementById('usuarioId').value = id;
  document.getElementById('username').value = username;
  document.getElementById('email').value = email;
  document.getElementById('rol').value = rol;
  document.getElementById('password').value = '';
  formTitle.textContent = 'Editar usuario';
  cancelarBtn.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const eliminarUsuario = async (id) => {
  if (!confirm('¿Estás segura de que querés eliminar este usuario?')) return;
  try {
    const res = await fetch(`${BASE}/${id}`, { method: 'DELETE', headers });
    const data = await res.json();
    mostrarMensaje(res.ok ? data.mensaje : data.error, res.ok ? 'success' : 'error');
    if (res.ok) cargarUsuarios();
  } catch (err) {
    mostrarMensaje('Error eliminando usuario.', 'error');
  }
};

const cargarUsuarios = async () => {
  try {
    const res = await fetch(BASE, { headers });
    if (res.status === 401) { window.location.href = '/index.html'; return; }
    const usuarios = await res.json();

    if (usuarios.length === 0) {
      tabla.innerHTML = '<tr><td colspan="6">No hay usuarios registrados.</td></tr>';
      return;
    }

    tabla.innerHTML = usuarios.map(u => `
      <tr>
        <td>${u.id}</td>
        <td>${u.username}</td>
        <td>${u.email}</td>
        <td>${u.rol}</td>
        <td>${u.ultimo_login ? new Date(u.ultimo_login).toLocaleString() : 'Nunca'}</td>
        <td class="table-actions">
          <button class="btn-edit" data-id="${u.id}" data-username="${u.username}" data-email="${u.email}" data-rol="${u.rol}">Editar</button>
          <button class="btn-delete" data-id="${u.id}">Eliminar</button>
        </td>
      </tr>`).join('');

    // Event listeners en lugar de onclick inline
    tabla.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        editarUsuario(btn.dataset.id, btn.dataset.username, btn.dataset.email, btn.dataset.rol);
      });
    });

    tabla.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', () => eliminarUsuario(btn.dataset.id));
    });

  } catch (err) {
    tabla.innerHTML = '<tr><td colspan="6">Error cargando usuarios.</td></tr>';
  }
};

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('usuarioId').value;
  const body = {
    username: document.getElementById('username').value.trim(),
    email: document.getElementById('email').value.trim(),
    password: document.getElementById('password').value,
    rol: document.getElementById('rol').value
  };

  const url = id ? `${BASE}/${id}` : BASE;
  const method = id ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, { method, headers, body: JSON.stringify(body) });
    const data = await res.json();
    if (res.ok) {
      mostrarMensaje(data.mensaje, 'success');
      form.reset();
      document.getElementById('usuarioId').value = '';
      formTitle.textContent = 'Crear usuario';
      cancelarBtn.classList.add('hidden');
      cargarUsuarios();
    } else {
      mostrarMensaje(data.error || data.errores?.join(', '), 'error');
    }
  } catch (err) {
    mostrarMensaje('Error guardando usuario.', 'error');
  }
});

cancelarBtn.addEventListener('click', () => {
  form.reset();
  document.getElementById('usuarioId').value = '';
  formTitle.textContent = 'Crear usuario';
  cancelarBtn.classList.add('hidden');
});

document.getElementById('logoutBtn').addEventListener('click', async () => {
  await fetch('/api/auth/logout', { method: 'POST', headers });
  window.location.href = '/login.html';
});

cargarUsuarios();