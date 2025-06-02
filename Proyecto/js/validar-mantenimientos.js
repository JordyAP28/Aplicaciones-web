document.querySelector('.modal-footer .btn-success').addEventListener('click', function() {
    const form = document.getElementById('formMantenimiento');
    const codigoMobiliario = document.getElementById('codigoMobiliario').value.trim();
    const tipoMantenimiento = document.getElementById('tipoMantenimiento').value;
    const descripcion = document.getElementById('descripcionMantenimiento').value.trim();
    const tecnico = document.getElementById('tecnicoAsignado').value;
    const fechaProgramada = document.getElementById('fechaProgramada').value;
    
    if (codigoMobiliario === '') {
        alert('Por favor ingrese el código del mobiliario.');
        document.getElementById('codigoMobiliario').focus();
        return false;
    }
    
    if (!/^[A-Za-z]{2,}-\d{4,}$/.test(codigoMobiliario)) {
        alert('El código del mobiliario debe tener el formato: ULEAM-1234.');
        document.getElementById('codigoMobiliario').focus();
        return false;
    }
    
    if (tipoMantenimiento === '' || tipoMantenimiento === null) {
        alert('Por favor seleccione el tipo de mantenimiento.');
        document.getElementById('tipoMantenimiento').focus();
        return false;
    }
    
    if (descripcion === '') {
        alert('Por favor ingrese una descripción del mantenimiento.');
        document.getElementById('descripcionMantenimiento').focus();
        return false;
    }
    
    if (descripcion.length < 20) {
        alert('La descripción debe tener al menos 20 caracteres.');
        document.getElementById('descripcionMantenimiento').focus();
        return false;
    }
    
    if (tecnico === '' || tecnico === null) {
        alert('Por favor seleccione un técnico.');
        document.getElementById('tecnicoAsignado').focus();
        return false;
    }
    
    if (fechaProgramada === '') {
        alert('Por favor seleccione una fecha programada.');
        document.getElementById('fechaProgramada').focus();
        return false;
    }
    
    const hoy = new Date();
    const fechaSeleccionada = new Date(fechaProgramada);
    
    if (fechaSeleccionada < hoy) {
        alert('La fecha programada no puede ser anterior al día actual.');
        document.getElementById('fechaProgramada').focus();
        return false;
    }

    alert('Mantenimiento registrado correctamente.');

    const modal = bootstrap.Modal.getInstance(document.getElementById('nuevoMantenimientoModal'));
    modal.hide();
    
    form.reset();
});