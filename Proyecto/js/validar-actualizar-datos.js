document.addEventListener('DOMContentLoaded', function() {

    let editMode = false;
    const fotoPerfil = document.getElementById('fotoPerfil');
    const inputFoto = document.getElementById('inputFoto');
    const btnCambiarFoto = document.getElementById('btnCambiarFoto');
    const btnEditar = document.getElementById('btnEditar');
    const btnCancelarEdicion = document.getElementById('btnCancelarEdicion');
    const formDatosPersonales = document.getElementById('formDatosPersonales');
    const formCambiarPassword = document.getElementById('formCambiarPassword');
    const btnGuardarPassword = document.getElementById('btnGuardarPassword');
    const toggleCurrentPassword = document.getElementById('toggleCurrentPassword');
    const toggleNewPassword = document.getElementById('toggleNewPassword');
    const currentPassword = document.getElementById('currentPassword');
    const newPassword = document.getElementById('newPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    const passwordStrength = document.getElementById('passwordStrength');
    const passwordError = document.getElementById('passwordError');

    btnCambiarFoto.addEventListener('click', function() {
        inputFoto.click();
    });

    inputFoto.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            
            if (file.size > 2 * 1024 * 1024) {
                alert('El archivo es demasiado grande. Máximo 2MB permitidos.');
                return;
            }
            
            const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!validTypes.includes(file.type)) {
                alert('Formato de archivo no válido. Solo se permiten JPG, PNG.');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(event) {
                fotoPerfil.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

   btnEditar.addEventListener('click', function() {
        editMode = true;
        toggleFormFields(true);
        btnEditar.classList.add('d-none');
    });

    btnCancelarEdicion.addEventListener('click', function() {
        editMode = false;
        toggleFormFields(false);
        btnEditar.classList.remove('d-none');
    });

    function toggleFormFields(editable) {
        const inputs = formDatosPersonales.querySelectorAll('input');
        inputs.forEach(input => {
            if (input.id && !input.hasAttribute('data-permanent-readonly')) {
                input.readOnly = !editable;
            }
        });
    }

    formDatosPersonales.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!editMode) return;
        
        const nombres = document.getElementById('nombres').value.trim();
        const apellidos = document.getElementById('apellidos').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const fechaNacimiento = document.getElementById('fechaNacimiento').value;
        
        let isValid = true;
        
        if (nombres === '') {
            isValid = false;
            alert('Por favor ingrese sus nombres');
            return;
        }
        
        if (apellidos === '') {
            isValid = false;
            alert('Por favor ingrese sus apellidos');
            return;
        }
        
        if (telefono !== '') {
            const telefonoRegex = /^[0-9]{7,15}$/;
            if (!telefonoRegex.test(telefono)) {
                isValid = false;
                alert('Por favor ingrese un número de teléfono válido');
                return;
            }
        }
        
        if (fechaNacimiento !== '') {
            const fechaNac = new Date(fechaNacimiento);
            const hoy = new Date();
            let edad = hoy.getFullYear() - fechaNac.getFullYear();
            const mes = hoy.getMonth() - fechaNac.getMonth();
            
            if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
                edad--;
            }
            
            if (edad < 18) {
                isValid = false;
                alert('Debes ser mayor de 18 años');
                return;
            }
        }
        
        if (isValid) {
            alert('Datos actualizados correctamente');
            editMode = false;
            toggleFormFields(false);
            btnEditar.classList.remove('d-none');
        }
    });

    toggleCurrentPassword.addEventListener('click', function() {
        togglePasswordVisibility(currentPassword, toggleCurrentPassword);
    });

    toggleNewPassword.addEventListener('click', function() {
        togglePasswordVisibility(newPassword, toggleNewPassword);
    });

    function togglePasswordVisibility(input, button) {
        if (input.type === 'password') {
            input.type = 'text';
            button.innerHTML = '<i class="fas fa-eye-slash"></i>';
        } else {
            input.type = 'password';
            button.innerHTML = '<i class="fas fa-eye"></i>';
        }
    }

    newPassword.addEventListener('input', function() {
        const password = newPassword.value;
        let strength = 0;
        
        if (password.length >= 8) strength += 20;
        
        if (/\d/.test(password)) strength += 20;
        
        if (/[A-Z]/.test(password)) strength += 20;
        
        if (/[^A-Za-z0-9]/.test(password)) strength += 20;
        
        if (password.length >= 12) strength += 20;
        
        passwordStrength.style.width = strength + '%';
        
        if (strength < 40) {
            passwordStrength.className = 'progress-bar bg-danger';
        } else if (strength < 80) {
            passwordStrength.className = 'progress-bar bg-warning';
        } else {
            passwordStrength.className = 'progress-bar bg-success';
        }
    });

    confirmPassword.addEventListener('input', function() {
        if (newPassword.value !== confirmPassword.value) {
            passwordError.classList.remove('d-none');
        } else {
            passwordError.classList.add('d-none');
        }
    });

    btnGuardarPassword.addEventListener('click', function() {
        if (currentPassword.value.trim() === '') {
            alert('Por favor ingrese su contraseña actual');
            return;
        }
        
        if (newPassword.value.trim() === '') {
            alert('Por favor ingrese una nueva contraseña');
            return;
        }
        
        if (passwordStrength.style.width < '50%') {
            alert('La nueva contraseña no es lo suficientemente segura');
            return;
        }
        
        if (newPassword.value !== confirmPassword.value) {
            alert('Las contraseñas no coinciden');
            return;
        }
        
        alert('Contraseña cambiada correctamente');
        $('#cambiarPasswordModal').modal('hide');
        formCambiarPassword.reset();
        passwordStrength.style.width = '0%';
    });
});