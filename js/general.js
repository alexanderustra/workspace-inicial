const logueado = localStorage.getItem('logueado');

// Si el usuario no ha iniciado sesión y no está en la página de inicio de sesión, redireccionar a la página de inicio de sesión
if (logueado !== 'true' && window.location.pathname !== '/login.html') {
    window.location.href = './login.html';
}

// Mostrar el nombre de usuario si el usuario está logueado
if (logueado === 'true') {
    const nombreUsuario = localStorage.getItem('nombreUsuario');
    document.getElementById('perfil-a').textContent = nombreUsuario;
}

// Cerrar sesión
document.getElementById('sign-off-btn').addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.setItem('logueado', 'false');
    // Redireccionar a la página de inicio de sesión después de cerrar sesión
    window.location.href = './login.html';
});

const token = localStorage.getItem("token");