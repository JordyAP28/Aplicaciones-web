<template>
  <div class="registrar-mobiliario">
    <form @submit.prevent="handleSubmit" class="row g-3 needs-validation">
      <div class="col-12">
        <h1 class="titulo1">Registrar Mobiliario</h1>
        <hr>
      </div>

      <!-- Código de identificación -->
      <fieldset class="col-md-6">
        <h2 class="fw-bold titulo-form">
          <i class="fas fa-barcode me-2"></i>Código de identificación
        </h2>

        <div class="mb-3">
          <label for="codigo" class="form-label">
            Código QR/ID <span class="text-danger">*</span>
          </label>
          <div class="input-group">
            <input 
              type="text" 
              class="form-control" 
              id="codigo"
              v-model="form.codigo"
              :class="{ 'is-invalid': errors.codigo, 'is-valid': form.codigo && !errors.codigo }"
              @blur="validateField('codigo')"
              placeholder="ULEAM-XXXX"
            />
            <button 
              class="btn btn-outline-secondary" 
              type="button" 
              @click="generarCodigoQR"
            >
              <i class="fas fa-qrcode"></i> Generar
            </button>
            <div v-if="errors.codigo" class="invalid-feedback">
              {{ errors.codigo }}
            </div>
          </div>
        </div>

        <div class="mb-3">
          <label for="tipo" class="form-label">
            Tipo de mobiliario <span class="text-danger">*</span>
          </label>
          <select 
            class="form-select" 
            id="tipo"
            v-model="form.tipo"
            :class="{ 'is-invalid': errors.tipo }"
            @change="saveDraftNow"
          >
            <option value="" disabled>Seleccionar...</option>
            <option value="silla">Silla</option>
            <option value="mesa">Mesa</option>
            <option value="escritorio">Escritorio</option>
            <option value="estante">Estante</option>
            <option value="pizarra">Pizarra</option>
            <option value="otro">Otro</option>
          </select>
          <div v-if="errors.tipo" class="invalid-feedback">
            {{ errors.tipo }}
          </div>
        </div>

        <div class="mb-3">
          <label for="material" class="form-label">Material principal</label>
          <input 
            type="text" 
            class="form-control" 
            id="material"
            v-model="form.material"
            @input="filterMaterialInput"
            placeholder="Ej: Madera, metal, plástico..."
          />
        </div>
      </fieldset>

      <!-- Ubicación -->
      <fieldset class="col-md-6">
        <h2 class="fw-bold titulo-form">
          <i class="fas fa-map-marker-alt me-2"></i>Ubicación
        </h2>
        
        <div class="mb-3">
          <label for="facultad" class="form-label">
            Facultad <span class="text-danger">*</span>
          </label>
          <select 
            class="form-select" 
            id="facultad"
            v-model="form.facultad"
            :class="{ 'is-invalid': errors.facultad }"
            @change="saveDraftNow"
          >
            <option value="" disabled>Seleccionar...</option>
            <option value="ingenieria">Ingeniería</option>
            <option value="medicina">Medicina</option>
            <option value="educacion">Educación</option>
          </select>
          <div v-if="errors.facultad" class="invalid-feedback">
            {{ errors.facultad }}
          </div>
        </div>

        <div class="mb-3">
          <label for="aula" class="form-label">Aula/Espacio</label>
          <input 
            type="text" 
            class="form-control" 
            id="aula"
            v-model="form.aula"
            placeholder="Ej: Aula 203, Lab 1"
          />
        </div>

        <div class="mb-3">
          <label for="responsable" class="form-label">Responsable</label>
          <select 
            class="form-select" 
            id="responsable"
            v-model="form.responsable"
          >
            <option value="" disabled>Asignar a...</option>
            <option value="departamento">Departamento</option>
            <option value="profesor">Profesor</option>
            <option value="administrativo">Personal administrativo</option>
          </select>
        </div>
      </fieldset>

      <!-- Características -->
      <fieldset class="col-6">
        <h2 class="fw-bold titulo-form">
          <i class="fas fa-clipboard-list me-2"></i>Características
        </h2>
        
        <div class="row">
          <div class="col-md-4 mb-3">
            <label for="estado" class="form-label">
              Estado <span class="text-danger">*</span>
            </label>
            <select 
              class="form-select" 
              id="estado"
              v-model="form.estado"
              :class="{ 'is-invalid': errors.estado }"
            >
              <option value="nuevo">Nuevo</option>
              <option value="bueno" selected>Bueno</option>
              <option value="regular">Regular</option>
              <option value="malo">Requiere reparación</option>
            </select>
            <div v-if="errors.estado" class="invalid-feedback">
              {{ errors.estado }}
            </div>
          </div>

          <div class="col-md-4 mb-3">
            <label for="fecha_adquisicion" class="form-label">Fecha de adquisición</label>
            <input 
              type="date" 
              class="form-control" 
              id="fecha_adquisicion"
              v-model="form.fecha_adquisicion"
              :class="{ 'is-invalid': errors.fecha_adquisicion }"
              @change="validateField('fecha_adquisicion')"
              :max="today"
            />
            <div v-if="errors.fecha_adquisicion" class="invalid-feedback">
              {{ errors.fecha_adquisicion }}
            </div>
          </div>

          <div class="col-md-4 mb-3">
            <label for="valor" class="form-label">Valor (USD)</label>
            <input 
              type="number" 
              class="form-control" 
              id="valor"
              v-model.number="form.valor"
              step="0.01" 
              min="0"
              placeholder="0.00"
            />
          </div>
        </div>

        <div class="mb-3">
          <label for="observaciones" class="form-label">Observaciones</label>
          <textarea 
            class="form-control" 
            id="observaciones"
            v-model="form.observaciones"
            rows="2"
            :maxlength="500"
            @input="updateCharCounter"
            placeholder="Detalles adicionales sobre el mobiliario..."
          ></textarea>
          <small class="char-counter text-muted">
            {{ form.observaciones?.length || 0 }}/500 caracteres
          </small>
        </div>
      </fieldset>

      <!-- Imagen -->
      <fieldset class="col-6">
        <h2 class="fw-bold titulo-form">
          <i class="fas fa-camera me-2"></i>Imagen de mobiliario
        </h2>
        <div class="mb-3">
          <input 
            type="file" 
            class="form-control" 
            id="foto"
            @change="handleFileUpload"
            accept="image/*"
          />
          <div class="form-text">Suba imágenes del mobiliario (máx. 2MB)</div>
          <div v-if="errors.foto" class="text-danger small mt-1">
            {{ errors.foto }}
          </div>
        </div>
        
        <!-- Preview de imagen -->
        <div v-if="imagePreview" class="image-preview mt-3">
          <img :src="imagePreview" class="img-thumbnail" style="max-width: 200px;" alt="Preview" />
          <button type="button" class="btn btn-sm btn-outline-danger ms-2" @click="removeImage">
            <i class="fas fa-times"></i> Remover
          </button>
        </div>
      </fieldset>

      <!-- Botones -->
      <div class="col-12 text-center">
        <button 
          type="submit" 
          class="btn btn-uleam"
          :disabled="loading"
        >
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          <i v-else class="fas fa-save me-2"></i> 
          {{ loading ? 'Guardando...' : 'Registrar Mobiliario' }}
        </button>
        <button 
          type="button" 
          class="btn btn-outline-secondary ms-2"
          @click="handleReset"
        >
          <i class="fas fa-eraser me-2"></i> Limpiar
        </button>
      </div>
    </form>

    <!-- Modal de éxito -->
    <div 
      class="modal fade" 
      id="successModal" 
      tabindex="-1" 
      ref="successModal"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title">
              <i class="fas fa-check-circle me-2"></i>¡Registro Exitoso!
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body text-center">
            <div class="mb-3">
              <i class="fas fa-couch text-success" style="font-size: 3rem;"></i>
            </div>
            <h6>Mobiliario registrado correctamente</h6>
            <div v-if="lastRegistered" class="alert alert-success">
              <strong>Código:</strong> {{ lastRegistered.codigo }}<br>
              <strong>Tipo:</strong> {{ lastRegistered.tipo }}<br>
              <strong>Ubicación:</strong> {{ lastRegistered.ubicacion?.edificio }}
            </div>
          </div>
          <div class="modal-footer justify-content-center">
            <button type="button" class="btn btn-success" data-bs-dismiss="modal">
              <i class="fas fa-plus me-1"></i>Registrar Otro
            </button>
            <router-link to="/inventario" class="btn btn-outline-primary">
              <i class="fas fa-list me-1"></i>Ver Inventario
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Modal } from 'bootstrap'
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useMobiliarioStore } from '@/stores/mobiliario'
import { useAuthStore } from '@/stores/auth'


const mobiliarioStore = useMobiliarioStore()
const authStore = useAuthStore()

const loading = ref(false)
const imagePreview = ref(null)
const lastRegistered = ref(null)
const autoSaveInterval = ref(null)
const successModal = ref(null)

const today = computed(() => new Date().toISOString().split('T')[0])

const form = reactive({
  codigo: '',
  tipo: '',
  material: '',
  facultad: '',
  aula: '',
  responsable: '',
  estado: 'bueno',
  fecha_adquisicion: '',
  valor: null,
  observaciones: '',
  foto: null
})

const errors = reactive({
  codigo: '',
  tipo: '',
  facultad: '',
  estado: '',
  fecha_adquisicion: '',
  foto: ''
})

const formType = 'registro_mobiliario'

// Métodos
const generarCodigoQR = () => {
  const newCode = mobiliarioStore.generateCode()
  form.codigo = newCode
  
  authStore.addRecentAction({
    type: 'generate_code',
    description: 'Generó código QR para mobiliario',
    details: newCode
  })
  
  // Mostrar notificación (se podría implementar un sistema de notificaciones)
  console.log('Código generado exitosamente')
  
  saveDraftNow()
}

const filterMaterialInput = (event) => {
  // Solo permitir letras y espacios
  event.target.value = event.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '')
  form.material = event.target.value
}

const updateCharCounter = () => {
  // El contador se actualiza automáticamente via computed en el template
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Validar tipo de archivo
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']
  if (!allowedTypes.includes(file.type)) {
    errors.foto = 'Solo se permiten imágenes JPEG o PNG'
    event.target.value = ''
    return
  }

  // Validar tamaño (2MB)
  if (file.size > 2 * 1024 * 1024) {
    errors.foto = 'La imagen debe pesar menos de 2MB'
    event.target.value = ''
    return
  }

  errors.foto = ''
  form.foto = file

  // Crear preview
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

const removeImage = () => {
  form.foto = null
  imagePreview.value = null
  document.getElementById('foto').value = ''
}

const validateField = (fieldName) => {
  errors[fieldName] = ''

  switch (fieldName) {
    case 'codigo':
      if (!form.codigo.trim()) {
        errors.codigo = 'El código es obligatorio'
      } else if (!form.codigo.startsWith('ULEAM-')) {
        errors.codigo = 'El código debe empezar con ULEAM-'
      } else if (!mobiliarioStore.isCodeUnique(form.codigo)) {
        errors.codigo = 'Este código ya existe'
      }
      break

    case 'fecha_adquisicion':
      if (form.fecha_adquisicion && form.fecha_adquisicion > today.value) {
        errors.fecha_adquisicion = 'La fecha no puede ser futura'
      }
      break
  }
}

const validateForm = () => {
  // Limpiar errores
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })

  let isValid = true

  // Campos obligatorios
  if (!form.codigo.trim()) {
    errors.codigo = 'El código es obligatorio'
    isValid = false
  } else if (!mobiliarioStore.isCodeUnique(form.codigo)) {
    errors.codigo = 'El código ya existe'
    isValid = false
  }

  if (!form.tipo) {
    errors.tipo = 'El tipo de mobiliario es obligatorio'
    isValid = false
  }

  if (!form.facultad) {
    errors.facultad = 'La facultad es obligatoria'
    isValid = false
  }

  if (!form.estado) {
    errors.estado = 'El estado es obligatorio'
    isValid = false
  }

  // Validar fecha
  if (form.fecha_adquisicion && form.fecha_adquisicion > today.value) {
    errors.fecha_adquisicion = 'La fecha no puede ser futura'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  loading.value = true

  try {
    // Crear objeto de mobiliario
    const mobiliarioData = {
      ...form,
      categoria: form.tipo
    }

    // Guardar en el store
    const savedItem = mobiliarioStore.saveItem(mobiliarioData)
    lastRegistered.value = savedItem

    // Limpiar borrador
    mobiliarioStore.removeDraft(formType)

    // Mostrar modal de éxito
    const modal = new bootstrap.Modal(successModal.value)
    modal.show()

    // Limpiar formulario
    clearForm()

  } catch (error) {
    console.error('Error al guardar:', error)
    // Aquí se podría mostrar una notificación de error
  } finally {
    loading.value = false
  }
}

const handleReset = () => {
  if (confirm('¿Está seguro de limpiar todos los campos?')) {
    clearForm()
    mobiliarioStore.removeDraft(formType)
    
    authStore.addRecentAction({
      type: 'reset',
      description: 'Limpió formulario de registro',
      details: 'Formulario de mobiliario'
    })
  }
}

const clearForm = () => {
  Object.keys(form).forEach(key => {
    if (key === 'estado') {
      form[key] = 'bueno'
    } else if (key === 'valor') {
      form[key] = null
    } else {
      form[key] = ''
    }
  })
  
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })
  
  removeImage()
}

const saveDraftNow = () => {
  const hasData = Object.values(form).some(value => 
    value !== '' && value !== null && value !== 'bueno'
  )
  
  if (hasData) {
    mobiliarioStore.saveDraft(formType, { ...form })
  }
}

const loadDraft = () => {
  const draft = mobiliarioStore.getDraft(formType)
  if (draft && draft.data) {
    const shouldRestore = confirm(
      `Se encontró un borrador guardado el ${new Date(draft.savedAt).toLocaleString()}.\n¿Desea restaurarlo?`
    )
    
    if (shouldRestore) {
      Object.assign(form, draft.data)
      
      authStore.addRecentAction({
        type: 'restore_draft',
        description: 'Restauró borrador de registro',
        details: 'Formulario de mobiliario'
      })
    }
  }
}

const setupAutoSave = () => {
  autoSaveInterval.value = setInterval(() => {
    saveDraftNow()
  }, 30000) // Cada 30 segundos
}

onMounted(() => {
  // Cargar borrador si existe
  loadDraft()
  
  // Configurar auto-guardado
  setupAutoSave()
  
  // Animaciones de entrada
  setTimeout(() => {
    document.querySelectorAll('.titulo-form').forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('visible')
      }, index * 200)
    })
  }, 150)
})

onUnmounted(() => {
  if (autoSaveInterval.value) {
    clearInterval(autoSaveInterval.value)
  }
})
</script>

<style scoped>
.titulo1 {
  color: #dc3545;
  font-weight: bold;
  font-size: 2.2rem;
  text-align: center;
  margin-bottom: 1rem;
}

.titulo-form {
  color: #495057;
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e9ecef;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease;
}

.titulo-form.visible {
  opacity: 1;
  transform: translateY(0);
}

.btn-uleam {
  background: linear-gradient(45deg, #dc3545, #c82333);
  border: none;
  color: white;
  font-weight: 500;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.btn-uleam:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(220, 53, 69, 0.4);
  color: white;
}

.btn-uleam:disabled {
  opacity: 0.7;
  transform: none;
  box-shadow: none;
}

fieldset {
  border: 1px solid #e9ecef;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  background-color: #fafafa;
}

.form-control:focus,
.form-select:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}

.char-counter {
  font-size: 0.8rem;
  text-align: right;
  display: block;
  margin-top: 0.25rem;
}

.image-preview {
  padding: 1rem;
  border: 2px dashed #e9ecef;
  border-radius: 8px;
  text-align: center;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}

.registrar-mobiliario {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>