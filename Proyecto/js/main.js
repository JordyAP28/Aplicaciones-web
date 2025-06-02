document.getElementById('menuToggle').addEventListener('click', function() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
            
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('expanded');
           
    const icon = this.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
});

document.getElementById('logoutBtn').addEventListener('click', function(e) {
    e.preventDefault();
        
    if(confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        window.location.href = 'Login.html';
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const elementos = [
        ...document.querySelectorAll('.main-content'),
        ...document.querySelectorAll('.titulo-uleam')
    ];

    elementos.forEach((elemento, index) => {
        setTimeout(() => {
            elemento.classList.add('visible');
            if (elemento.classList.contains('form-group')) {
                elemento.style.transition = 'all 0.5s ease ' + (index * 0.1) + 's';
            }
        }, 150);
    });
});