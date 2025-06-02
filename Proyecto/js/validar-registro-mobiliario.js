document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registroMobiliario');
    const generarQRBtn = document.getElementById('generarQR');
    const codigoInput = document.getElementById('codigo');
    const fotoInput = document.getElementById('foto');

    generarQRBtn.addEventListener('click', function() {
        const digitCount = 4 + Math.floor(Math.random() * 3);
        let numericPart = '';
        
        for (let i = 0; i < digitCount; i++) {
            numericPart += Math.floor(Math.random() * 10);
        }
        
        codigoInput.value = 'ULEAM-' + numericPart;
    });

    fotoInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert('La imagen no debe exceder los 2MB');
                this.value = '';
                return;
            }
            
            const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!validTypes.includes(file.type)) {
                alert('Solo se permiten imágenes (JPEG, PNG, GIF)');
                this.value = '';
                return;
            }
        }
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!codigoInput.value.trim()) {
            alert('El código QR/ID es requerido');
            codigoInput.focus();
            return;
        }

        const tipo = document.getElementById('tipo');
        if (tipo.value === '' || tipo.value === null) {
            alert('El tipo de mobiliario es requerido');
            tipo.focus();
            return;
        }

        const facultad = document.getElementById('facultad');
        if (facultad.value === '' || facultad.value === null) {
            alert('La facultad es requerida');
            facultad.focus();
            return;
        }

        const estado = document.getElementById('estado');
        if (estado.value === '' || estado.value === null) {
            alert('El estado es requerido');
            estado.focus();
            return;
        }

        const fechaAdquisicion = document.getElementById('fecha_adquisicion');
        if (fechaAdquisicion.value) {
            const fechaIngresada = new Date(fechaAdquisicion.value);
            const fechaActual = new Date();
            
            if (fechaIngresada > fechaActual) {
                alert('La fecha de adquisición no puede ser futura');
                fechaAdquisicion.focus();
                return;
            }
        }

        const valor = document.getElementById('valor');
        if (valor.value && valor.value < 0) {
            alert('El valor no puede ser negativo');
            valor.focus();
            return;
        }

        alert('Formulario validado correctamente. Enviando datos...');
    });

    codigoInput.addEventListener('input', function() {
        if (this.value.length > 20) {
            this.value = this.value.substring(0, 20);
            alert('El código no debe exceder los 20 caracteres');
        }
    });

    const materialInput = document.getElementById('material');
    materialInput.addEventListener('input', function() {
        if (this.value.length > 50) {
            this.value = this.value.substring(0, 50);
            alert('La descripción del material no debe exceder 50 caracteres');
        }
    });

    const aulaInput = document.getElementById('aula');
    aulaInput.addEventListener('input', function() {
        if (this.value.length > 30) {
            this.value = this.value.substring(0, 30);
            alert('El aula/espacio no debe exceder los 30 caracteres');
        }
    });

    const observacionesInput = document.getElementById('observaciones');
    observacionesInput.addEventListener('input', function() {
        if (this.value.length > 200) {
            this.value = this.value.substring(0, 200);
            alert('Las observaciones no deben exceder los 200 caracteres');
        }
    });
});