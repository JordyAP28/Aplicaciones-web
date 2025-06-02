document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formUsuario');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        let isValid = true;

        const requiredFields = ['tipoDocumento', 'numeroDocumento', 'nombres', 
                              'apellidos', 'email', 'rol', 'usuario', 
                              'contrasena', 'confirmarContrasena'];
        
        requiredFields.forEach(id => {
            const field = document.getElementById(id);
            if (!field.value.trim()) {
                field.classList.add('is-invalid');
                isValid = false;
            } else {
                field.classList.remove('is-invalid');
            }
        });

        const email = document.getElementById('email');
        if (!/^[^\s@]+@uleam\.edu\.ec$/.test(email.value)) {
            email.classList.add('is-invalid');
            alert('Ingrese un email institucional (@uleam.live.edu.ec)');
            isValid = false;
        }

        const pass = document.getElementById('contrasena');
        if (pass.value.length < 8) {
            pass.classList.add('is-invalid');
            alert('La contraseña debe tener al menos 8 caracteres');
            isValid = false;
        }

        const confirmPass = document.getElementById('confirmarContrasena');
        if (pass.value !== confirmPass.value) {
            confirmPass.classList.add('is-invalid');
            alert('Las contraseñas no coinciden');
            isValid = false;
        }

        const usuario = document.getElementById('usuario');
        if (usuario.value.length < 6) {
            usuario.classList.add('is-invalid');
            alert('El usuario debe tener al menos 6 caracteres');
            isValid = false;
        }

        if (isValid) {
            alert('Formulario válido. Enviando datos...');
        }
    });

    form.querySelectorAll('input, select').forEach(field => {
        field.addEventListener('input', function() {
            this.classList.remove('is-invalid');
        });
    });

    document.getElementById('generarUsuario').addEventListener('click', function() {
        const nombres = document.getElementById('nombres').value.trim().substr(0, 3);
        const apellidos = document.getElementById('apellidos').value.trim().substr(0, 3);
        if (nombres && apellidos) {
            document.getElementById('usuario').value = (nombres + apellidos + Math.floor(Math.random() * 90) + 10).toLowerCase();
        }
    });
});