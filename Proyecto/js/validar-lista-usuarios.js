document.addEventListener('DOMContentLoaded', function() {
    const filtroRol = document.getElementById('filtroRol');
    const filtroEstado = document.getElementById('filtroEstado');
    const filtroBusqueda = document.getElementById('filtroBusqueda');
    const btnBuscar = document.querySelector('.btn-danger');
    const btnExportar = document.getElementById('btnExportar');
    const tablaUsuarios = document.querySelector('tbody');

    const usuarios = [
        {
            id: 1,
            usuario: 'JordyAP28',
            nombres: 'Jordy Alvarado',
            rol: 'Administrador',
            documento: '1312345678',
            estado: 'Activo',
            ultimoAcceso: '30/05/2025 08:30'
        },
    ];

    function aplicarFiltros() {
        const rol = filtroRol.value.toLowerCase();
        const estado = filtroEstado.value.toLowerCase();
        const busqueda = filtroBusqueda.value.toLowerCase();

        if (!rol && !estado && !busqueda) {
            alert('Por favor ingrese al menos un criterio de búsqueda');
            return;
        }

        const usuariosFiltrados = usuarios.filter(usuario => {
            const cumpleRol = !rol || usuario.rol.toLowerCase().includes(rol);
            const cumpleEstado = !estado || usuario.estado.toLowerCase().includes(estado);
            const cumpleBusqueda = !busqueda || 
                usuario.nombres.toLowerCase().includes(busqueda) || 
                usuario.documento.includes(busqueda) ||
                usuario.usuario.toLowerCase().includes(busqueda);

            return cumpleRol && cumpleEstado && cumpleBusqueda;
        });

        mostrarUsuarios(usuariosFiltrados);
    }

    function mostrarUsuarios(usuarios) {
        tablaUsuarios.innerHTML = '';

        if (usuarios.length === 0) {
            tablaUsuarios.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center text-muted py-4">
                        <i class="fas fa-user-slash fa-2x mb-2"></i>
                        <p>No se encontraron usuarios con los filtros aplicados</p>
                    </td>
                </tr>
            `;
            return;
        }

        usuarios.forEach((usuario, index) => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${index + 1}</td>
                <td>
                    <div class="d-flex align-items-center">
                        <img src="" class="rounded-circle me-2">
                        <span>${usuario.usuario}</span>
                    </div>
                </td>
                <td>${usuario.nombres}</td>
                <td><span class="badge bg-primary">${usuario.rol}</span></td>
                <td>${usuario.documento}</td>
                <td><span class="badge bg-success">${usuario.estado}</span></td>
                <td>${usuario.ultimoAcceso}</td>
                <td>
                    <div class="btn-group btn-group-sm" role="group">
                        <button type="button" class="btn btn-outline-primary" title="Ver">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button type="button" class="btn btn-outline-warning" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button type="button" class="btn btn-outline-danger" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tablaUsuarios.appendChild(fila);
        });
    }

    btnBuscar.addEventListener('click', aplicarFiltros);

    filtroBusqueda.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            aplicarFiltros();
        }
    });

    btnExportar.addEventListener('click', function() {
        if (tablaUsuarios.querySelectorAll('tr').length === 0 || 
            tablaUsuarios.querySelector('td[colspan]')) {
            alert('No hay datos para exportar');
            return;
        }

        alert('Exportando datos a Excel...');
    });

    tablaUsuarios.addEventListener('click', function(e) {
        const btn = e.target.closest('button');
        if (!btn) return;

        const fila = btn.closest('tr');
        const idUsuario = fila.cells[0].textContent;
        const nombreUsuario = fila.cells[2].textContent;

        if (btn.classList.contains('btn-outline-primary')) {
            alert(`Viendo detalles del usuario: ${nombreUsuario} (ID: ${idUsuario})`);
        } else if (btn.classList.contains('btn-outline-warning')) {
            alert(`Editando usuario: ${nombreUsuario} (ID: ${idUsuario})`);
        } else if (btn.classList.contains('btn-outline-danger')) {
            if (confirm(`¿Está seguro que desea eliminar al usuario ${nombreUsuario}?`)) {
                alert(`Usuario ${nombreUsuario} eliminado`);
            }
        }
    });

    mostrarUsuarios(usuarios);
});