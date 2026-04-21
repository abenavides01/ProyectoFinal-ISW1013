const loginForm = document.getElementById('loginForm');
const mensaje = document.getElementById('mensaje');

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  mensaje.textContent = '';
  mensaje.className = 'message';

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (!response.ok) {
      mensaje.textContent = data.error || 'No se pudo iniciar sesión.';
      mensaje.classList.add('error');
      return;
    }

    mensaje.textContent = 'Login exitoso. Redirigiendo...';
    mensaje.classList.add('success');

    setTimeout(() => {
      window.location.href = '/dashboard.html';
    }, 1000);
  } catch (error) {
    console.error(error);
    mensaje.textContent = 'Error de conexión con el servidor.';
    mensaje.classList.add('error');
  }
});