document.addEventListener('DOMContentLoaded', function() {
    const formReubicacion = document.getElementById('form-reubicacion');
    const nuevaUbicacion = document.getElementById('nueva-ubicacion');
    const responsable = document.getElementById('responsable');
    const fechaReubicacion = document.getElementById('fecha-reubicacion');
    const itemSeleccionado = document.getElementById('item-seleccionado');
    const listaMobiliario = document.getElementById('lista-mobiliario');

    function validarMobiliarioSeleccionado() {
        if (!itemSeleccionado.value) {
            alert('Por favor seleccione un mobiliario de la lista');
            return false;
        }
        return true;
    }

    function validarFecha(fecha) {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        
        const fechaSeleccionada = new Date(fecha);
        
        if (fechaSeleccionada < hoy) {
            alert('La fecha de reubicación no puede ser anterior al día actual');
            return false;
        }
        return true;
    }

    listaMobiliario.addEventListener('click', function(e) {
        e.preventDefault();
        const card = e.target.closest('.mobiliario-card');
        if (card) {
            document.querySelectorAll('.mobiliario-card').forEach(item => {
                item.classList.remove('active');
            });
            
            card.classList.add('active');
            
            const titulo = card.querySelector('h6').textContent;
            const codigo = card.querySelector('small').textContent.replace('Código: ', '');
            
            itemSeleccionado.value = `${titulo} (${codigo})`;
        }
    });

    formReubicacion.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validarMobiliarioSeleccionado()) {
            return;
        }
        
        if (!nuevaUbicacion.value) {
            alert('Por favor seleccione la nueva ubicación');
            nuevaUbicacion.focus();
            return;
        }
        
        if (!responsable.value) {
            alert('Por favor seleccione el responsable');
            responsable.focus();
            return;
        }
        
        if (!fechaReubicacion.value) {
            alert('Por favor ingrese la fecha de reubicación');
            fechaReubicacion.focus();
            return;
        }
        
        if (!validarFecha(fechaReubicacion.value)) {
            fechaReubicacion.focus();
            return;
        }
        
        alert('Reubicación registrada correctamente');      

        formReubicacion.reset();
        itemSeleccionado.value = '';
        document.querySelectorAll('.mobiliario-card').forEach(item => {
            item.classList.remove('active');
        });
    });

    fechaReubicacion.addEventListener('change', function() {
        if (this.value && !validarFecha(this.value)) {
            this.value = '';
        }
    });

    nuevaUbicacion.addEventListener('change', function() {
        const mobiliarioSeleccionado = document.querySelector('.mobiliario-card.active');
        if (mobiliarioSeleccionado) {
            const ubicacionActual = mobiliarioSeleccionado.querySelector('.badge').textContent;
            if (this.value === ubicacionActual) {
                alert('La nueva ubicación no puede ser la misma que la ubicación actual');
                this.value = '';
            }
        }
    });
});