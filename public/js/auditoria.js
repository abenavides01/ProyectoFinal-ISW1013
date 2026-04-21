const tabla = document.getElementById('tablaAuditoria');

const cargarLogs = async () => {
  try {
    const res = await fetch('/api/auditoria', {
      headers: { 'Origin': window.location.origin }
    });

    if (res.status === 401) { window.location.href = '/index.html'; return; }
    if (res.status === 403) {
      tabla.innerHTML = '<tr><td colspan="7">No tenés permisos para ver los logs.</td></tr>';
      return;
    }

    const logs = await res.json();
    tabla.innerHTML = logs.length === 0
      ? '<tr><td colspan="7">No hay eventos registrados.</td></tr>'
      : logs.map(l => `
        <tr>
          <td>${l.id}</td>
          <td>${l.evento}</td>
          <td>${l.descripcion || '-'}</td>
          <td>${l.usuario_id || '-'}</td>
          <td>${new Date(l.createdAt).toLocaleString()}</td>
        </tr>`).join('');
  } catch (err) {
    tabla.innerHTML = '<tr><td colspan="7">Error cargando logs.</td></tr>';
  }
};

document.getElementById('logoutBtn').addEventListener('click', async () => {
  await fetch('/api/auth/logout', {
    method: 'POST',
    headers: { 'Origin': window.location.origin }
  });
  window.location.href = '/login.html';
});

cargarLogs();