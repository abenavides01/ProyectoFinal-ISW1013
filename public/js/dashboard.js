document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('/api/auth/me');
    if (!res.ok) {
      window.location.href = '/login.html';
      return;
    }

    const { usuario } = await res.json();
    document.getElementById('usernameDisplay').textContent = usuario.username;
    document.getElementById('rolDisplay').textContent = usuario.rol;

    // Ocultar módulos según rol
    if (usuario.rol === 'Auditor') {
      document.getElementById('cardUsuarios').classList.add('hidden');
    }

    if (usuario.rol !== 'SuperAdmin') {
      document.getElementById('cardAuditoria').classList.add('hidden');
    }

  } catch (err) {
    window.location.href = '/login.html';
  }

  document.getElementById('logoutBtn').addEventListener('click', async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: { 'Origin': window.location.origin }
    });
    window.location.href = '/login.html';
  });
});